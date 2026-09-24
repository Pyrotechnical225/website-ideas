import fs from 'node:fs';
const files=['index.html','studio.html','home.css','platform.css','freeform.css','home.js','creator.css','creator.js','vendor/grapes.min.js','vendor/grapes.min.css','vendor/purify.min.js','vendor/grapes-LICENSE','vendor/dompurify-LICENSE'];
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8'};
const assets=Object.fromEntries(files.map(file=>['/'+file,{body:fs.readFileSync('dist/'+file,'utf8'),type:mime[file.split('.').at(-1)]||'text/plain; charset=utf-8'}]));
const assistant=fs.readFileSync('server/assistant.mjs','utf8').replace('export async function handleAssistant','async function handleAssistant');
fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});
fs.writeFileSync('dist/server/index.js',`const assets=${JSON.stringify(assets)};\n${assistant}\nexport default {async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith('/api/assistant/'))return handleAssistant(request,env);if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});let pathname=url.pathname;if(pathname==='/')pathname='/index.html';if(pathname==='/studio'||pathname==='/studio/')pathname='/studio.html';const asset=assets[pathname];if(!asset)return new Response('Page not found',{status:404,headers:{'Content-Type':'text/plain'}});return new Response(request.method==='HEAD'?null:asset.body,{headers:{'Content-Type':asset.type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});}};\n`);
fs.writeFileSync('dist/.openai/hosting.json',fs.readFileSync('.openai/hosting.json'));
console.log('Worker built with website assets and AI assistant endpoint.');
