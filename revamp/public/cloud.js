'use strict';
// Oakline accounts, cloud projects and billing — browser side, no UI.
// Everything here runs with the customer's own session; the database only lets
// them touch their own rows. Plans and AI allowances are decided on the server.
window.OakCloud=(()=>{
 const listeners=new Set();
 const state={config:null,client:null,session:null,account:null,ready:null};
 const emit=event=>listeners.forEach(fn=>{try{fn(event,state);}catch(e){console.error(e);}});

 async function loadConfig(){
  try{const r=await fetch('/api/config',{cache:'no-store'});if(r.ok)return await r.json();}catch{}
  return{accounts:false,billing:false,ai:{available:false,requiresAccount:false}};
 }
 state.ready=(async()=>{
  state.config=await loadConfig();
  if(state.config.accounts&&window.supabase?.createClient){
   state.client=window.supabase.createClient(state.config.supabaseUrl,state.config.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   state.client.auth.onAuthStateChange((event,session)=>{
    const changedUser=state.session?.user?.id!==session?.user?.id;
    state.session=session;
    if(event==='PASSWORD_RECOVERY')emit('recovery');
    if(changedUser){state.account=null;emit('session');if(session)refreshAccount();}
   });
   const {data}=await state.client.auth.getSession();state.session=data.session;
   if(state.session)await refreshAccount();
  }
  emit('ready');
  return state;
 })();

 async function refreshAccount(){
  if(!state.client||!state.session)return null;
  const {data,error}=await state.client.rpc('my_account');
  if(!error&&data){state.account=data;emit('account');}
  return state.account;
 }
 const friendly=error=>{
  const m=String(error?.message||error||'');
  if(/Invalid login credentials/i.test(m))return'That email and password don’t match. Try again or reset your password.';
  if(/Email not confirmed/i.test(m))return'Please confirm your email first — check your inbox for the link.';
  if(/already registered|already been registered/i.test(m))return'There’s already an account with that email. Try signing in.';
  if(/Password should be/i.test(m))return'Choose a password with at least 8 characters.';
  if(/rate limit|too many/i.test(m))return'Too many attempts. Please wait a minute and try again.';
  if(/PROJECT_LIMIT/.test(m))return'PROJECT_LIMIT';
  if(/PAGE_LIMIT/.test(m))return'PAGE_LIMIT';
  if(/Failed to fetch|NetworkError/i.test(m))return'You seem to be offline. Your work is still saved in this browser.';
  return m||'Something went wrong. Please try again.';
 };
 const need=()=>{if(!state.client)throw new Error('Accounts aren’t available on this site yet.');};
 const redirect=()=>location.origin+'/studio';

 async function authed(path,body){
  const token=state.session?.access_token;
  const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body||{})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw Object.assign(new Error(data.error||'Something went wrong. Please try again.'),{code:data.code,status:r.status});
  return data;
 }

 return{
  state,ready:state.ready,friendly,refreshAccount,
  on(fn){listeners.add(fn);return()=>listeners.delete(fn);},
  get enabled(){return Boolean(state.client);},
  get user(){return state.session?.user||null;},
  get verified(){const u=state.session?.user;return Boolean(u?.email_confirmed_at||u?.confirmed_at);},
  get plan(){return state.account?.plan||'free';},
  get limits(){return state.account?.limits||{plan:'free',luna_per_month:25,sol_per_month:0,max_projects:3,max_pages:3};},
  async signUp(email,password){need();const {data,error}=await state.client.auth.signUp({email,password,options:{emailRedirectTo:redirect()}});if(error)throw new Error(friendly(error));return{needsConfirmation:!data.session};},
  async signIn(email,password){need();const {error}=await state.client.auth.signInWithPassword({email,password});if(error)throw new Error(friendly(error));},
  async resetPassword(email){need();const {error}=await state.client.auth.resetPasswordForEmail(email,{redirectTo:redirect()});if(error)throw new Error(friendly(error));},
  async setPassword(password){need();const {error}=await state.client.auth.updateUser({password});if(error)throw new Error(friendly(error));},
  async resendConfirmation(email){need();const {error}=await state.client.auth.resend({type:'signup',email,options:{emailRedirectTo:redirect()}});if(error)throw new Error(friendly(error));},
  async signOut(){if(state.client)await state.client.auth.signOut();},
  async token(){if(!state.client)return null;const {data}=await state.client.auth.getSession();return data.session?.access_token||null;},

  // Cloud projects (latest version only on Free; history is a planned Pro feature)
  async listProjects(){need();const {data,error}=await state.client.from('projects').select('id,name,updated_at,kind').order('updated_at',{ascending:false});if(error)throw new Error(friendly(error));return data;},
  async getProject(id){need();const {data,error}=await state.client.from('projects').select('*').eq('id',id).single();if(error)throw new Error(friendly(error));return data;},
  async saveProject(id,row){
   need();
   const query=id?state.client.from('projects').update(row).eq('id',id).select('id,updated_at').single():state.client.from('projects').insert(row).select('id,updated_at').single();
   const {data,error}=await query;
   if(error)throw Object.assign(new Error(friendly(error)),{code:friendly(error)});
   if(!id)refreshAccount();
   return data;
  },
  async deleteProject(id){need();const {error}=await state.client.from('projects').delete().eq('id',id);if(error)throw new Error(friendly(error));refreshAccount();},

  // Billing — Stripe pages; Pro is switched on by Stripe's webhook, not by this redirect.
  async checkout(interval){const {url}=await authed('/api/billing/checkout',{interval});location.href=url;},
  async portal(){const {url}=await authed('/api/billing/portal');location.href=url;},
  async askAI(body){
   const token=await this.token();
   const r=await fetch('/api/assistant/suggest',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(50000)});
   const data=await r.json().catch(()=>({}));
   if(!r.ok)throw Object.assign(new Error(data.error||'The assistant could not reply. Please try again.'),{code:data.code});
   refreshAccount();
   return data;
  }
 };
})();
