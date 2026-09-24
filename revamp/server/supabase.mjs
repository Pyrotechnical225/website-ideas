// Server-side access to Supabase. The service key never leaves the server.
export const accountsEnabled=env=>Boolean(env.SUPABASE_URL&&env.SUPABASE_ANON_KEY&&env.SUPABASE_SERVICE_ROLE_KEY);
const base=env=>env.SUPABASE_URL.replace(/\/$/,'');
// Legacy keys are JWTs and go in Authorization too; new sb_secret_/sb_publishable_ keys only go in `apikey`.
const keyHeaders=key=>({apikey:key,...(key.startsWith('eyJ')?{Authorization:'Bearer '+key}:{})});

// Returns the signed-in user for a request's Bearer token, or null.
export async function userFromRequest(request,env){
 const token=(request.headers.get('Authorization')||'').match(/^Bearer\s+(\S+)$/i)?.[1];
 if(!token)return null;
 const response=await fetch(base(env)+'/auth/v1/user',{headers:{apikey:env.SUPABASE_ANON_KEY,Authorization:'Bearer '+token},signal:AbortSignal.timeout(10000)});
 if(!response.ok)return null;
 const user=await response.json();
 return user?.id?user:null;
}
export const isVerified=user=>Boolean(user?.email_confirmed_at||user?.confirmed_at);

export class DbError extends Error{constructor(message,status){super(message);this.status=status;}}
async function call(env,path,init={}){
 const response=await fetch(base(env)+path,{...init,headers:{...keyHeaders(env.SUPABASE_SERVICE_ROLE_KEY),'Content-Type':'application/json',...init.headers},signal:AbortSignal.timeout(10000)});
 const text=await response.text();const data=text?JSON.parse(text):null;
 if(!response.ok)throw new DbError(data?.message||'Database error',response.status);
 return data;
}
export const rpc=(env,fn,args)=>call(env,'/rest/v1/rpc/'+fn,{method:'POST',body:JSON.stringify(args)});
export const select=(env,table,query)=>call(env,`/rest/v1/${table}?${query}`);
export const upsert=(env,table,row,conflict)=>call(env,`/rest/v1/${table}?on_conflict=${conflict}`,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(row)});
export const insertIgnore=(env,table,row)=>call(env,`/rest/v1/${table}`,{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(row)});
