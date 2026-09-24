// Server checks: `npm run build && npm test`. No network or real keys needed —
// Supabase, OpenAI and Stripe are replaced with small fakes below.
import assert from 'node:assert/strict';
import {verifyStripeSignature} from '../server/billing.mjs';
const worker=(await import(new URL('../dist/server/index.js',import.meta.url))).default;
const base='https://oakline.test';
let passed=0;const test=async(name,fn)=>{await fn();passed++;console.log('✓',name);};

// ---------------------------------------------------------------- fakes
const realFetch=globalThis.fetch;
let calls=[],openaiReply,stripeSubs={},subsRow=null,usage=0,limit=25,events=new Set();
const USERS={'good-token':{id:'u1',email:'a@test',email_confirmed_at:'2026-01-01'},'unverified-token':{id:'u2',email:'b@test',email_confirmed_at:null}};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
globalThis.fetch=async(input,init={})=>{
 const url=new URL(typeof input==='string'?input:input.url);const body=init.body;calls.push({url:url.href,init});
 if(url.host==='db.test'){
  if(url.pathname==='/auth/v1/user'){const user=USERS[(init.headers.Authorization||'').slice(7)];return user?reply(user):reply({msg:'bad jwt'},401);}
  assert.equal(init.headers.apikey,'service-key','server calls use the service key');
  if(url.pathname==='/rest/v1/rpc/ai_reserve'){if(usage>=limit)return reply({message:'ALLOWANCE_EXHAUSTED'},400);usage++;return reply('req-'+usage);}
  if(url.pathname==='/rest/v1/rpc/ai_finish'){const a=JSON.parse(body);if(!a.p_ok)usage--;return reply(null);}
  if(url.pathname==='/rest/v1/subscriptions'&&init.method==='POST'){subsRow={...subsRow,...JSON.parse(body)};return new Response(null,{status:201});}
  if(url.pathname==='/rest/v1/subscriptions')return reply(subsRow?[subsRow]:[]);
  if(url.pathname==='/rest/v1/stripe_events'){events.add(JSON.parse(body).id);return new Response(null,{status:201});}
 }
 if(url.host==='api.openai.com')return openaiReply();
 if(url.host==='api.stripe.com'){
  assert.equal(init.headers.Authorization,'Bearer sk_test_x');
  if(url.pathname==='/v1/customers')return reply({id:'cus_1'});
  if(url.pathname==='/v1/checkout/sessions'){const p=new URLSearchParams(body);assert.equal(p.get('line_items[0][price]'),'price_year');assert.equal(p.get('customer'),'cus_1');assert.equal(p.get('subscription_data[metadata][user_id]'),'u1');return reply({url:'https://checkout.stripe.test/s1'});}
  if(url.pathname==='/v1/billing_portal/sessions')return reply({url:'https://billing.stripe.test/p1'});
  const m=url.pathname.match(/^\/v1\/subscriptions\/(.+)$/);if(m)return reply(stripeSubs[m[1]]);
 }
 return realFetch(input,init);
};
const env={SUPABASE_URL:'https://db.test',SUPABASE_ANON_KEY:'anon-key',SUPABASE_SERVICE_ROLE_KEY:'service-key',OPENAI_API_KEY:'sk-openai',STRIPE_SECRET_KEY:'sk_test_x',STRIPE_WEBHOOK_SECRET:'whsec_test',STRIPE_PRICE_MONTHLY:'price_month',STRIPE_PRICE_YEARLY:'price_year'};
let ip=0;
const post=(path,body,headers={})=>worker.fetch(new Request(base+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:base,'CF-Connecting-IP':'10.0.0.'+(++ip),...headers},body:typeof body==='string'?body:JSON.stringify(body)}),env);
const good={Authorization:'Bearer good-token'};
const suggestions={suggestions:[{title:'Lead with a photo',reason:'Shows the product',steps:['Add a section'],block:'section'},{title:'x',reason:'y',steps:[],block:'bogus'}]};
const okReply=()=>reply({status:'completed',usage:{input_tokens:900,output_tokens:200},output:[{content:[{type:'output_text',text:JSON.stringify(suggestions)}]}]});

// ---------------------------------------------------------------- pages
await test('pages are served',async()=>{
 for(const [path,text] of [['/','Build the website'],['/studio','start-dialog'],['/studio.html','start-dialog']]){
  const r=await worker.fetch(new Request(base+path),{});assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/text\/html/);assert.ok((await r.text()).includes(text),path);
 }
});
await test('fonts are served as binary woff2',async()=>{
 const r=await worker.fetch(new Request(base+'/fonts/inter-latin-wght-normal.woff2'),{});assert.equal(r.headers.get('content-type'),'font/woff2');
 assert.equal(new TextDecoder().decode(new Uint8Array(await r.arrayBuffer()).slice(0,4)),'wOF2');
});
await test('unknown pages return the 404 page',async()=>{const r=await worker.fetch(new Request(base+'/nope'),{});assert.equal(r.status,404);assert.ok((await r.text()).includes('off the canvas'));});
await test('config exposes only public settings',async()=>{
 const c=await (await worker.fetch(new Request(base+'/api/config'),env)).json();
 assert.deepEqual(c,{accounts:true,supabaseUrl:'https://db.test',supabaseAnonKey:'anon-key',billing:true,ai:{available:true,requiresAccount:true}});
 assert.ok(!JSON.stringify(c).includes('service-key')&&!JSON.stringify(c).includes('sk_'));
 const off=await (await worker.fetch(new Request(base+'/api/config'),{})).json();assert.equal(off.accounts,false);assert.equal(off.ai.available,false);
});

// ---------------------------------------------------------------- AI
await test('AI needs a signed-in, verified account',async()=>{
 assert.equal((await post('/api/assistant/suggest',{brief:'a',prompt:'',outline:''})).status,401);
 assert.equal((await post('/api/assistant/suggest',{brief:'a',prompt:'',outline:''},{Authorization:'Bearer unverified-token'})).status,403);
 assert.equal((await post('/api/assistant/suggest',{brief:'a',prompt:'',outline:''},{Authorization:'Bearer forged'})).status,401);
 assert.equal(usage,0,'nothing was charged');
});
await test('AI refuses cross-origin requests and bad input',async()=>{
 assert.equal((await post('/api/assistant/suggest',{brief:'a',prompt:'',outline:''},{...good,Origin:'https://evil.test'})).status,403);
 assert.equal((await post('/api/assistant/suggest',{brief:'',prompt:'',outline:''},good)).status,400);
 assert.equal((await post('/api/assistant/suggest',{brief:'a',prompt:'',outline:'',model:'gpt-9'},good)).status,400);
});
await test('Luna request is charged once and returns cleaned suggestions',async()=>{
 openaiReply=okReply;calls=[];
 const r=await post('/api/assistant/suggest',{brief:'Bakery',prompt:'Hero?',outline:''},good);
 assert.equal(r.status,200);const data=await r.json();assert.equal(data.model,'luna');assert.equal(data.suggestions.length,2);assert.equal(data.suggestions[1].block,'none');
 const sent=JSON.parse(calls.find(c=>c.url.includes('openai')).init.body);assert.equal(sent.model,'gpt-6-luna');assert.equal(sent.store,false);assert.equal(sent.max_output_tokens,2000);
 const fin=JSON.parse(calls.find(c=>c.url.includes('ai_finish')).init.body);assert.deepEqual(fin,{p_request:'req-1',p_ok:true,p_input_tokens:900,p_output_tokens:200});
 assert.equal(usage,1);
});
await test('Sol is routed to the Sol model',async()=>{
 calls=[];const r=await post('/api/assistant/suggest',{brief:'Bakery',prompt:'',outline:'',model:'sol'},good);assert.equal(r.status,200);
 assert.equal(JSON.parse(calls.find(c=>c.url.includes('openai')).init.body).model,'gpt-6-sol');
 assert.equal(JSON.parse(calls.find(c=>c.url.includes('ai_reserve')).init.body).p_model,'sol');
});
await test('failed AI replies are refunded',async()=>{
 const before=usage;
 for(const bad of [()=>reply({error:'x'},500),()=>reply({status:'incomplete'}),()=>reply({output:[{content:[{type:'output_text',text:'not json'}]}]}),()=>{throw new Error('network');}]){
  openaiReply=bad;const r=await post('/api/assistant/suggest',{brief:'a',prompt:'',outline:''},good);assert.ok(r.status>=500||r.status===429);
 }
 assert.equal(usage,before,'all four failures refunded');
});
await test('exhausted allowance is refused before calling OpenAI',async()=>{
 usage=limit;calls=[];openaiReply=okReply;
 const r=await post('/api/assistant/suggest',{brief:'a',prompt:'',outline:''},good);
 assert.equal(r.status,429);assert.equal((await r.json()).code,'ALLOWANCE_EXHAUSTED');assert.ok(!calls.some(c=>c.url.includes('openai')));usage=0;
});
await test('AI stays off without accounts unless dev mode is on',async()=>{
 const r=await worker.fetch(new Request(base+'/api/assistant/suggest',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,'CF-Connecting-IP':'9.9.9.9'},body:JSON.stringify({brief:'a',prompt:'',outline:''})}),{OPENAI_API_KEY:'k'});
 assert.equal(r.status,503);
 const dev=await worker.fetch(new Request(base+'/api/assistant/suggest',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,'CF-Connecting-IP':'9.9.9.8'},body:JSON.stringify({brief:'a',prompt:'',outline:''})}),{OPENAI_API_KEY:'k',OAKLINE_DEV_ANON_AI:'1'});
 assert.equal(dev.status,200);
});
await test('AI bursts are rate-limited per visitor',async()=>{
 let last;for(let i=0;i<8;i++)last=await worker.fetch(new Request(base+'/api/assistant/suggest',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,'CF-Connecting-IP':'7.7.7.7',...good},body:JSON.stringify({brief:'a',prompt:'',outline:''})}),env);
 assert.equal(last.status,429);usage=0;
});

// ---------------------------------------------------------------- billing
await test('checkout needs a verified user and a valid interval',async()=>{
 assert.equal((await post('/api/billing/checkout',{interval:'year'})).status,401);
 assert.equal((await post('/api/billing/checkout',{interval:'year'},{Authorization:'Bearer unverified-token'})).status,403);
 assert.equal((await post('/api/billing/checkout',{interval:'week'},good)).status,400);
});
await test('checkout creates a customer and a yearly session',async()=>{
 calls=[];const r=await post('/api/billing/checkout',{interval:'year'},good);assert.equal(r.status,200);assert.equal((await r.json()).url,'https://checkout.stripe.test/s1');
 assert.equal(calls.find(c=>c.url.endsWith('/v1/customers')).init.headers['Idempotency-Key'],'oakline-customer-u1');
 assert.equal(subsRow.stripe_customer_id,'cus_1');assert.equal(subsRow.user_id,'u1');
});
const sign=async(payload,secret='whsec_test',t=Math.floor(Date.now()/1000))=>{const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=[...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${t}.${payload}`)))].map(b=>b.toString(16).padStart(2,'0')).join('');return `t=${t},v1=${sig}`;};
await test('webhook signatures are verified',async()=>{
 const payload='{"id":"evt_x"}';
 assert.ok(await verifyStripeSignature(payload,await sign(payload),'whsec_test'));
 assert.ok(!await verifyStripeSignature(payload,await sign(payload,'wrong'),'whsec_test'));
 assert.ok(!await verifyStripeSignature(payload+' ',await sign(payload),'whsec_test'));
 assert.ok(!await verifyStripeSignature(payload,await sign(payload,'whsec_test',Math.floor(Date.now()/1000)-3600),'whsec_test'),'old events rejected');
 assert.equal((await post('/api/billing/webhook',payload,{'Stripe-Signature':'t=1,v1=00'})).status,400);
});
await test('webhook unlocks Pro from Stripe’s data, in any order',async()=>{
 stripeSubs.sub_1={id:'sub_1',customer:'cus_1',status:'active',metadata:{user_id:'u1'},cancel_at_period_end:false,items:{data:[{current_period_end:1790000000,price:{recurring:{interval:'year'}}}]}};
 const e1=JSON.stringify({id:'evt_1',type:'checkout.session.completed',data:{object:{mode:'subscription',subscription:'sub_1'}}});
 assert.equal((await post('/api/billing/webhook',e1,{'Stripe-Signature':await sign(e1)})).status,200);
 assert.equal(subsRow.status,'active');assert.equal(subsRow.billing_interval,'year');assert.equal(subsRow.stripe_subscription_id,'sub_1');
 // A stale "created" event arriving late still reads the current state from Stripe.
 const e2=JSON.stringify({id:'evt_0',type:'customer.subscription.created',data:{object:{id:'sub_1',status:'incomplete'}}});
 await post('/api/billing/webhook',e2,{'Stripe-Signature':await sign(e2)});assert.equal(subsRow.status,'active');
 // An old cancelled subscription can't overwrite the active one.
 stripeSubs.sub_old={id:'sub_old',customer:'cus_1',status:'canceled',metadata:{user_id:'u1'},items:{data:[]}};
 const e3=JSON.stringify({id:'evt_2',type:'customer.subscription.deleted',data:{object:{id:'sub_old'}}});
 await post('/api/billing/webhook',e3,{'Stripe-Signature':await sign(e3)});assert.equal(subsRow.status,'active');assert.equal(subsRow.stripe_subscription_id,'sub_1');
 // Cancelling the real one downgrades.
 stripeSubs.sub_1={...stripeSubs.sub_1,status:'canceled'};
 const e4=JSON.stringify({id:'evt_3',type:'customer.subscription.deleted',data:{object:{id:'sub_1'}}});
 await post('/api/billing/webhook',e4,{'Stripe-Signature':await sign(e4)});assert.equal(subsRow.status,'canceled');
 assert.ok(events.has('evt_1')&&events.has('evt_3'));
});
await test('checkout is refused while already Pro; portal works',async()=>{
 subsRow.status='active';
 assert.equal((await post('/api/billing/checkout',{interval:'month'},good)).status,409);
 const r=await post('/api/billing/portal',{},good);assert.equal((await r.json()).url,'https://billing.stripe.test/p1');
});
await test('billing is off when not configured',async()=>{
 const r=await worker.fetch(new Request(base+'/api/billing/checkout',{method:'POST',headers:{Origin:base}}),{});assert.equal(r.status,503);
});
console.log(`\n${passed} server checks passed`);
