// Stripe subscriptions. Pro is only ever unlocked by a verified webhook from Stripe,
// never because the browser reached a success page.
import {json,sameOrigin,siteUrl,readJson} from './http.mjs';
import {accountsEnabled,userFromRequest,isVerified,select,upsert,insertIgnore} from './supabase.mjs';

export const billingEnabled=env=>accountsEnabled(env)&&Boolean(env.STRIPE_SECRET_KEY&&env.STRIPE_WEBHOOK_SECRET&&env.STRIPE_PRICE_MONTHLY&&env.STRIPE_PRICE_YEARLY);

// Stripe's API takes form encoding with bracketed keys: line_items[0][price]=...
function form(params,prefix='',out=new URLSearchParams()){
 for(const [key,value]of Object.entries(params)){
  if(value===undefined||value===null)continue;
  const name=prefix?`${prefix}[${key}]`:key;
  if(typeof value==='object')form(value,name,out);else out.append(name,String(value));
 }
 return out;
}
async function stripe(env,method,path,params,idempotencyKey){
 const response=await fetch((env.STRIPE_API_BASE||'https://api.stripe.com/v1')+path,{method,headers:{Authorization:'Bearer '+env.STRIPE_SECRET_KEY,...(params?{'Content-Type':'application/x-www-form-urlencoded'}:{}),...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{})},body:params?form(params):undefined,signal:AbortSignal.timeout(15000)});
 const data=await response.json();
 if(!response.ok)throw new Error(data?.error?.message||'Stripe error');
 return data;
}

const ACTIVE=new Set(['active','trialing']);
async function subscriptionRow(env,userId){return (await select(env,'subscriptions',`user_id=eq.${encodeURIComponent(userId)}&select=*`))[0]||null;}

async function requireUser(request,env){
 if(!billingEnabled(env))return{error:json({error:'Payments aren’t set up on this site yet.'},503)};
 if(!sameOrigin(request))return{error:json({error:'Please upgrade from Oakline Creator.'},403)};
 const user=await userFromRequest(request,env).catch(()=>null);
 if(!user)return{error:json({error:'Sign in to manage your plan.',code:'SIGN_IN'},401)};
 if(!isVerified(user))return{error:json({error:'Confirm your email address before upgrading.',code:'VERIFY_EMAIL'},403)};
 return{user};
}

async function checkout(request,env){
 const {user,error}=await requireUser(request,env);if(error)return error;
 let input;try{input=await readJson(request,2000);}catch{return json({error:'Choose monthly or yearly billing.'},400);}
 const price={month:env.STRIPE_PRICE_MONTHLY,year:env.STRIPE_PRICE_YEARLY}[input?.interval];
 if(!price)return json({error:'Choose monthly or yearly billing.'},400);
 let row=await subscriptionRow(env,user.id);
 if(row&&ACTIVE.has(row.status))return json({error:'You’re already on Pro. Use “Manage billing” to change your plan.',code:'ALREADY_PRO'},409);
 let customer=row?.stripe_customer_id;
 if(!customer){
  customer=(await stripe(env,'POST','/customers',{email:user.email,metadata:{user_id:user.id}},'oakline-customer-'+user.id)).id;
  await upsert(env,'subscriptions',{user_id:user.id,stripe_customer_id:customer,updated_at:new Date().toISOString()},'user_id');
 }
 const site=siteUrl(request,env);
 const session=await stripe(env,'POST','/checkout/sessions',{mode:'subscription',customer,client_reference_id:user.id,line_items:[{price,quantity:1}],subscription_data:{metadata:{user_id:user.id}},success_url:site+'/studio?billing=success',cancel_url:site+'/studio?billing=cancelled'});
 return json({url:session.url});
}

async function portal(request,env){
 const {user,error}=await requireUser(request,env);if(error)return error;
 const row=await subscriptionRow(env,user.id);
 if(!row?.stripe_customer_id)return json({error:'There’s no billing account yet. Upgrade to Pro first.'},404);
 const session=await stripe(env,'POST','/billing_portal/sessions',{customer:row.stripe_customer_id,return_url:siteUrl(request,env)+'/studio'});
 return json({url:session.url});
}

// ---------------------------------------------------------------- webhook
const hex=buffer=>[...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,'0')).join('');
function safeEqual(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}
export async function verifyStripeSignature(payload,header,secret,now=Date.now(),toleranceSeconds=300){
 const pairs=(header||'').split(',').map(p=>p.trim().split('='));
 const timestamp=pairs.find(([k])=>k==='t')?.[1];const signatures=pairs.filter(([k])=>k==='v1').map(([,v])=>v);
 if(!timestamp||!signatures.length)return false;
 if(Math.abs(now/1000-Number(timestamp))>toleranceSeconds)return false;
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const expected=hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${timestamp}.${payload}`)));
 return signatures.some(sig=>safeEqual(sig,expected));
}

// Always re-reads the subscription from Stripe, so repeated or out-of-order events are harmless.
async function syncSubscription(env,subscriptionId){
 const sub=await stripe(env,'GET','/subscriptions/'+encodeURIComponent(subscriptionId));
 const customer=typeof sub.customer==='string'?sub.customer:sub.customer?.id;
 let userId=sub.metadata?.user_id;
 if(!userId)userId=(await select(env,'subscriptions',`stripe_customer_id=eq.${encodeURIComponent(customer)}&select=user_id`))[0]?.user_id;
 if(!userId)throw new Error('No Oakline user for customer '+customer);
 const existing=await subscriptionRow(env,userId);
 // Don't let an old, ended subscription overwrite a newer active one.
 if(existing&&existing.stripe_subscription_id&&existing.stripe_subscription_id!==sub.id&&ACTIVE.has(existing.status)&&!ACTIVE.has(sub.status))return;
 const item=sub.items?.data?.[0];
 const periodEnd=item?.current_period_end??sub.current_period_end;
 await upsert(env,'subscriptions',{user_id:userId,stripe_customer_id:customer,stripe_subscription_id:sub.id,status:sub.status,billing_interval:item?.price?.recurring?.interval??null,current_period_end:periodEnd?new Date(periodEnd*1000).toISOString():null,cancel_at_period_end:Boolean(sub.cancel_at_period_end),updated_at:new Date().toISOString()},'user_id');
}

async function webhook(request,env){
 if(!billingEnabled(env))return json({error:'Billing not configured'},503);
 const payload=await request.text();
 if(payload.length>1_000_000)return json({error:'Too large'},413);
 if(!await verifyStripeSignature(payload,request.headers.get('Stripe-Signature'),env.STRIPE_WEBHOOK_SECRET))return json({error:'Invalid signature'},400);
 const event=JSON.parse(payload);
 const object=event.data?.object||{};
 if(event.type==='checkout.session.completed'&&object.mode==='subscription'&&object.subscription)await syncSubscription(env,object.subscription);
 else if(/^customer\.subscription\.(created|updated|deleted|paused|resumed)$/.test(event.type))await syncSubscription(env,object.id);
 await insertIgnore(env,'stripe_events',{id:event.id,type:event.type});
 return json({received:true});
}

export async function handleBilling(request,env){
 const path=new URL(request.url).pathname;
 if(request.method!=='POST')return json({error:'Method not allowed'},405);
 try{
  if(path==='/api/billing/checkout')return await checkout(request,env);
  if(path==='/api/billing/portal')return await portal(request,env);
  if(path==='/api/billing/webhook')return await webhook(request,env);
  return json({error:'Not found'},404);
 }catch(error){
  console.error('billing',path,error?.message);
  // A 500 makes Stripe retry the webhook later.
  return json({error:path.endsWith('webhook')?'Webhook failed':'Billing is unavailable right now. Please try again.'},500);
 }
}
