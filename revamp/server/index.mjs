// Worker entry: static pages + API routes. Assets are injected at build time.
import assets from 'oakline:assets';
import {json} from './http.mjs';
import {handleAssistant,assistantStatus} from './assistant.mjs';
import {handleBilling,billingEnabled} from './billing.mjs';
import {accountsEnabled} from './supabase.mjs';

const routes={'/':'/index.html','/studio':'/studio.html','/studio/':'/studio.html'};
const decode=b64=>Uint8Array.from(atob(b64),c=>c.charCodeAt(0));

// Public settings the browser needs. The anon/publishable key is safe to share;
// Row Level Security in the database is what protects each customer's data.
function config(env){
 const accounts=accountsEnabled(env);
 return{accounts,supabaseUrl:accounts?env.SUPABASE_URL:null,supabaseAnonKey:accounts?env.SUPABASE_ANON_KEY:null,billing:billingEnabled(env),ai:assistantStatus(env)};
}

export default{async fetch(request,env={}){
 const url=new URL(request.url);
 if(url.pathname==='/api/config')return json(config(env));
 if(url.pathname.startsWith('/api/assistant/'))return handleAssistant(request,env);
 if(url.pathname.startsWith('/api/billing/'))return handleBilling(request,env);
 if(url.pathname.startsWith('/api/'))return json({error:'Not found'},404);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const pathname=routes[url.pathname]||url.pathname;
 const asset=assets[pathname];
 if(!asset){const page=assets['/404.html'];return new Response(page?.body||'Page not found',{status:404,headers:{'Content-Type':page?'text/html; charset=utf-8':'text/plain'}});}
 const immutable=/^\/(fonts|vendor)\//.test(pathname);
 const body=request.method==='HEAD'?null:asset.b64?decode(asset.b64):asset.body;
 return new Response(body,{headers:{'Content-Type':asset.type,'Cache-Control':immutable?'public, max-age=604800':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'SAMEORIGIN'}});
}};
