// Bundles server/ plus every file in public/ into one Worker: dist/server/index.js.
// Text files are embedded as strings, fonts/images as base64.
import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
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
await build({entryPoints:['server/index.mjs'],bundle:true,format:'esm',platform:'neutral',target:'es2022',outfile:'dist/server/index.js',logLevel:'warning',
 plugins:[{name:'assets',setup(b){b.onResolve({filter:/^oakline:assets$/},()=>({path:'assets',namespace:'oakline'}));b.onLoad({filter:/.*/,namespace:'oakline'},()=>({contents:'export default '+JSON.stringify(assets),loader:'js'}));}}]});
if(fs.existsSync('.openai/hosting.json')){fs.mkdirSync('dist/.openai',{recursive:true});fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');}
console.log(`Worker built with ${Object.keys(assets).length} assets, AI assistant and billing endpoints.`);
