// Development/test stand-ins for Supabase, OpenAI and Stripe, so the whole app can be
// exercised offline. The "Supabase" part runs the REAL migration on a local Postgres,
// so row-level security, plan limits and AI allowances are the production rules.
// Never deploy this. Usage: DATABASE_URL=postgres://... node test/fake-services.mjs
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import pg from 'pg';

const port=Number(process.env.FAKE_PORT||54321);
const target=new URL(process.env.DATABASE_URL||'postgres://missing');
const local=['localhost','127.0.0.1','::1',''].includes(target.hostname)&&(!target.searchParams.get('host')||target.searchParams.get('host').startsWith('/'));
if(!local){console.error('Refusing to run: fake-services wipes its database, so DATABASE_URL must point at a local test database.');process.exit(1);}
const db=new pg.Pool({connectionString:process.env.DATABASE_URL});
const here=new URL('.',import.meta.url);

// Fresh schema on every start.
const admin=await db.connect();
await admin.query(`drop schema if exists public cascade; create schema public; drop schema if exists auth cascade;`);
await admin.query(`grant usage on schema public to public`);
await admin.query(fs.readFileSync(new URL('../supabase/tests/supabase-stub.sql',here),'utf8'));
await admin.query(`alter table auth.users add column if not exists password text, add column if not exists confirmed boolean default false`);
await admin.query(fs.readFileSync(new URL('../supabase/migrations/0001_oakline_core.sql',here),'utf8'));
admin.release();

const b64=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const makeJwt=user=>[b64({alg:'HS256',typ:'JWT'}),b64({sub:user.id,email:user.email,role:'authenticated',aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600}),'fakesig'].join('.');
const userFromJwt=token=>{try{return JSON.parse(Buffer.from(token.split('.')[1],'base64url')).sub;}catch{return null;}};
const publicUser=u=>({id:u.id,aud:'authenticated',role:'authenticated',email:u.email,email_confirmed_at:u.confirmed?'2026-01-01T00:00:00Z':null,confirmed_at:u.confirmed?'2026-01-01T00:00:00Z':null,app_metadata:{},user_metadata:{},created_at:'2026-01-01T00:00:00Z'});
const session=u=>({access_token:makeJwt(u),refresh_token:'refresh-'+u.id,token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user:publicUser(u)});
const log=[];  // emails "sent"
export const stripeState={subscriptions:{},sessions:[]};

// Runs SQL as a Supabase role (with auth.uid() set), like PostgREST does.
async function asRole(role,uid,sql,params){
 const client=await db.connect();
 try{
  await client.query('begin');
  await client.query(`select set_config('request.jwt.claim.sub',$1,true)`,[uid||'']);
  await client.query(`set local role ${role}`);
  const result=await client.query(sql,params);
  await client.query('commit');return result.rows;
 }catch(error){await client.query('rollback').catch(()=>{});throw error;}
 finally{client.release();}
}
const pgError=(res,error)=>send(res,error.message.includes('row-level security')||error.code==='42501'?403:400,{code:error.code,message:error.message,details:null,hint:null});
function send(res,status,body,headers={}){res.writeHead(status,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'*','Access-Control-Expose-Headers':'*',...headers});res.end(body===undefined?'':JSON.stringify(body));}
const cols=select=>!select||select==='*'?'*':select.split(',').map(c=>c.replace(/[^a-z_]/g,'')).filter(Boolean).map(c=>`"${c}"`).join(',');
const PROJECT_COLS=new Set(['name','brief','kind','data']);

async function handle(req,res){
 const url=new URL(req.url,'http://x');let raw='';for await(const c of req)raw+=c;let body={};try{body=raw?JSON.parse(raw):{};}catch{}
 if(req.method==='OPTIONS')return send(res,204);
 const token=(req.headers.authorization||'').replace(/^Bearer /,'');
 const isService=req.headers.apikey==='fake-service-key';
 const uid=isService?null:userFromJwt(token);
 const p=url.pathname;

 // ---- test helpers
 if(p==='/__confirm'){await db.query('update auth.users set confirmed=true where email=$1',[url.searchParams.get('email')]);return send(res,200,{ok:true});}
 if(p==='/__emails')return send(res,200,log);
 if(p==='/__stripe')return send(res,200,stripeState);
 if(p==='/__stripe/subscription'){stripeState.subscriptions[body.id]=body;return send(res,200,{ok:true});}

 // ---- auth (GoTrue)
 if(p==='/auth/v1/signup'){
  const exists=(await db.query('select 1 from auth.users where email=$1',[body.email])).rowCount;
  if(exists)return send(res,422,{code:422,error_code:'user_already_exists',msg:'User already registered'});
  const u={id:crypto.randomUUID(),email:body.email,confirmed:false};
  await db.query('insert into auth.users (id,email,password,confirmed) values ($1,$2,$3,false)',[u.id,u.email,body.password]);
  log.push({type:'confirm',to:u.email,redirect:url.searchParams.get('redirect_to')});
  return send(res,200,publicUser(u));
 }
 if(p==='/auth/v1/token'&&url.searchParams.get('grant_type')==='password'){
  const u=(await db.query('select * from auth.users where email=$1 and password=$2',[body.email,body.password])).rows[0];
  if(!u)return send(res,400,{code:400,error_code:'invalid_credentials',msg:'Invalid login credentials'});
  if(!u.confirmed)return send(res,400,{code:400,error_code:'email_not_confirmed',msg:'Email not confirmed'});
  return send(res,200,session(u));
 }
 if(p==='/auth/v1/token'&&url.searchParams.get('grant_type')==='refresh_token'){
  const u=(await db.query('select * from auth.users where id=$1',[String(body.refresh_token).replace('refresh-','')])).rows[0];
  return u?send(res,200,session(u)):send(res,400,{msg:'Invalid Refresh Token'});
 }
 if(p==='/auth/v1/user'&&req.method==='GET'){
  const u=uid&&(await db.query('select * from auth.users where id=$1',[uid])).rows[0];
  return u?send(res,200,publicUser(u)):send(res,401,{code:401,msg:'invalid JWT'});
 }
 if(p==='/auth/v1/logout')return send(res,204);
 if(p==='/auth/v1/recover'){log.push({type:'recover',to:body.email});return send(res,200,{});}
 if(p==='/auth/v1/resend'){log.push({type:'confirm',to:body.email});return send(res,200,{});}

 // ---- REST (PostgREST subset)
 if(p.startsWith('/rest/v1/'))try{
  const role=isService?'service_role':uid?'authenticated':'anon';
  const single=(req.headers.accept||'').includes('vnd.pgrst.object');
  const one=rows=>single?(rows.length===1?send(res,200,rows[0]):send(res,406,{code:'PGRST116',message:'JSON object requested, multiple (or no) rows returned'})):send(res,200,rows);
  if(p.startsWith('/rest/v1/rpc/')){
   const fn=p.split('/').pop().replace(/[^a-z_]/g,'');const keys=Object.keys(body);
   const rows=await asRole(role,uid,`select public.${fn}(${keys.map((k,i)=>`${k.replace(/[^a-z_]/g,'')} => $${i+1}`).join(',')}) as r`,keys.map(k=>body[k]));
   return send(res,200,rows[0].r);
  }
  const table=p.replace('/rest/v1/','').replace(/[^a-z_]/g,'');
  const filters=[];const params=[];
  for(const [k,v]of url.searchParams){const m=v.match(/^eq\.(.*)$/);if(m&&!['select','order','on_conflict'].includes(k)){params.push(decodeURIComponent(m[1]));filters.push(`"${k.replace(/[^a-z_]/g,'')}" = $${params.length}`);}}
  const where=filters.length?' where '+filters.join(' and '):'';
  const ret=cols(url.searchParams.get('select'));
  if(req.method==='GET'){
   const order=url.searchParams.get('order')?.match(/^([a-z_]+)\.(asc|desc)$/);
   return one(await asRole(role,uid,`select ${ret} from public.${table}${where}${order?` order by "${order[1]}" ${order[2]}`:''}`,params));
  }
  if(req.method==='POST'){
   const rows=Array.isArray(body)?body:[body];const keys=Object.keys(rows[0]).filter(k=>/^[a-z_]+$/.test(k));
   const conflict=url.searchParams.get('on_conflict');const prefer=req.headers.prefer||'';
   let sql=`insert into public.${table} (${keys.map(k=>`"${k}"`).join(',')}) values (${keys.map((k,i)=>`$${i+1}`).join(',')})`;
   if(conflict)sql+=prefer.includes('ignore-duplicates')?` on conflict ("${conflict}") do nothing`:` on conflict ("${conflict}") do update set ${keys.map(k=>`"${k}"=excluded."${k}"`).join(',')}`;
   else if(prefer.includes('ignore-duplicates'))sql+=' on conflict do nothing';
   const out=await asRole(role,uid,sql+` returning ${ret}`,keys.map(k=>typeof rows[0][k]==='object'&&rows[0][k]!==null?JSON.stringify(rows[0][k]):rows[0][k]));
   return prefer.includes('return=representation')||single?one(out):send(res,201);
  }
  if(req.method==='PATCH'){
   const keys=Object.keys(body).filter(k=>table!=='projects'||PROJECT_COLS.has(k));
   const set=keys.map((k,i)=>`"${k}" = $${params.length+i+1}`).join(',');
   const out=await asRole(role,uid,`update public.${table} set ${set}${where} returning ${ret}`,[...params,...keys.map(k=>typeof body[k]==='object'&&body[k]!==null?JSON.stringify(body[k]):body[k])]);
   return one(out);
  }
  if(req.method==='DELETE'){await asRole(role,uid,`delete from public.${table}${where}`,params);return send(res,204);}
 }catch(error){return pgError(res,error);}

 // ---- OpenAI (Responses API)
 if(p==='/openai/v1/responses'){
  const input=JSON.parse(body.input);
  return send(res,200,{status:'completed',usage:{input_tokens:800,output_tokens:180},output:[{content:[{type:'output_text',text:JSON.stringify({suggestions:[
   {title:`Lead with a bold welcome (${body.model})`,reason:`Built for: ${String(input.project_brief).slice(0,60)}`,steps:['Add a full-width section at the top','Keep the headline under eight words'],block:'section'},
   {title:'Three reasons to choose you',reason:'Visitors scan before they read.',steps:['Add a three-column row'],block:'grid'}]})}]}]});
 }
 // ---- Stripe
 if(p.startsWith('/stripe/v1/')){
  const params=new URLSearchParams(raw);
  if(p==='/stripe/v1/customers')return send(res,200,{id:'cus_'+crypto.randomUUID().slice(0,8)});
  if(p==='/stripe/v1/checkout/sessions'){const s={id:'cs_'+stripeState.sessions.length,customer:params.get('customer'),price:params.get('line_items[0][price]'),user:params.get('subscription_data[metadata][user_id]'),success_url:params.get('success_url')};stripeState.sessions.push(s);return send(res,200,{url:`http://localhost:${port}/__checkout?session=${s.id}`});}
  if(p==='/stripe/v1/billing_portal/sessions')return send(res,200,{url:`http://localhost:${port}/__portal`});
  const m=p.match(/^\/stripe\/v1\/subscriptions\/(.+)$/);if(m)return send(res,200,stripeState.subscriptions[m[1]]);
 }
 if(p==='/__checkout'){res.writeHead(200,{'Content-Type':'text/html'});return res.end('<h1>Fake Stripe Checkout</h1>');}
 send(res,404,{message:'fake: not implemented '+req.method+' '+p});
}

http.createServer((req,res)=>handle(req,res).catch(error=>{console.error(error);send(res,500,{message:error.message});})).listen(port,()=>console.log(`Fake Supabase/OpenAI/Stripe on http://localhost:${port}`));
