// Bundles every file in public/ plus the AI endpoint into one Worker (dist/server/index.js).
// Text files are embedded as strings, fonts/images as base64.
import fs from 'node:fs';
import path from 'node:path';
const root='public';
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json; charset=utf-8',svg:'image/svg+xml',woff2:'font/woff2',png:'image/png',ico:'image/x-icon',txt:'text/plain; charset=utf-8'};
const binary=new Set(['woff2','png','ico']);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const assets={};
for(const file of walk(root)){
 const ext=file.split('.').at(-1).toLowerCase();
 const key='/'+path.relative(root,file).split(path.sep).join('/');
 assets[key]=binary.has(ext)?{b64:fs.readFileSync(file).toString('base64'),type:mime[ext]}:{body:fs.readFileSync(file,'utf8'),type:mime[ext]||'text/plain; charset=utf-8'};
}
const assistant=fs.readFileSync('server/assistant.mjs','utf8').replace('export async function handleAssistant','async function handleAssistant');
const routes={'/':'/index.html','/studio':'/studio.html','/studio/':'/studio.html'};
fs.mkdirSync('dist/server',{recursive:true});
fs.writeFileSync('dist/server/index.js',`const assets=${JSON.stringify(assets)};
const routes=${JSON.stringify(routes)};
const decode=b64=>Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
${assistant}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/assistant/'))return handleAssistant(request,env);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const pathname=routes[url.pathname]||url.pathname;
 const asset=assets[pathname];
 if(!asset)return new Response(assets['/404.html']?.body||'Page not found',{status:404,headers:{'Content-Type':assets['/404.html']?'text/html; charset=utf-8':'text/plain'}});
 const immutable=/^\\/(fonts|vendor)\\//.test(pathname);
 const body=request.method==='HEAD'?null:asset.b64?decode(asset.b64):asset.body;
 return new Response(body,{headers:{'Content-Type':asset.type,'Cache-Control':immutable?'public, max-age=604800':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'SAMEORIGIN'}});
}};
`);
if(fs.existsSync('.openai/hosting.json')){fs.mkdirSync('dist/.openai',{recursive:true});fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');}
console.log(`Worker built with ${Object.keys(assets).length} assets and the AI assistant endpoint.`);
