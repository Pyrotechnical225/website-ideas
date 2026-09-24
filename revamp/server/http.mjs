export const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
export const sameOrigin=request=>request.headers.get('Origin')===new URL(request.url).origin;
export const siteUrl=(request,env)=>(env.PUBLIC_SITE_URL||new URL(request.url).origin).replace(/\/$/,'');

// Reads a JSON body without trusting Content-Length; rejects anything over `limit` bytes.
export async function readJson(request,limit=20000){
 const reader=request.body?.getReader();if(!reader)throw Object.assign(new Error('Empty body'),{status:400});
 let bytes=0;const chunks=[];
 while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>limit){await reader.cancel();throw Object.assign(new Error('Too large'),{status:413});}chunks.push(value);}
 const body=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength;}
 try{return JSON.parse(new TextDecoder().decode(body));}catch{throw Object.assign(new Error('Invalid JSON'),{status:400});}
}
