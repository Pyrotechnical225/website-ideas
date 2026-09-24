// Server checks: run `npm run build && npm test`. No network or API key needed.
import assert from 'node:assert/strict';
import {handleAssistant} from '../server/assistant.mjs';
const worker=(await import(new URL('../dist/server/index.js',import.meta.url))).default;
const base='https://oakline.test';
let passed=0;const test=async(name,fn)=>{await fn();passed++;console.log('✓',name);};

await test('pages are served',async()=>{
  for(const [path,text] of [['/','Build the website'],['/studio','start-dialog'],['/studio.html','start-dialog']]){
    const r=await worker.fetch(new Request(base+path),{});assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/text\/html/);assert.ok((await r.text()).includes(text),path);
  }
});
await test('fonts are served as binary woff2',async()=>{
  const r=await worker.fetch(new Request(base+'/fonts/inter-latin-wght-normal.woff2'),{});assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'font/woff2');
  const bytes=new Uint8Array(await r.arrayBuffer());assert.equal(new TextDecoder().decode(bytes.slice(0,4)),'wOF2');
});
await test('unknown pages return the 404 page',async()=>{const r=await worker.fetch(new Request(base+'/nope'),{});assert.equal(r.status,404);assert.ok((await r.text()).includes('off the canvas'));});
await test('non-GET is rejected',async()=>{const r=await worker.fetch(new Request(base+'/',{method:'POST'}),{});assert.equal(r.status,405);});
await test('assistant status reflects the key',async()=>{
  assert.deepEqual(await (await worker.fetch(new Request(base+'/api/assistant/status'),{})).json(),{available:false});
  assert.deepEqual(await (await worker.fetch(new Request(base+'/api/assistant/status'),{OPENAI_API_KEY:'x'})).json(),{available:true});
});
const ask=(body,headers={})=>new Request(base+'/api/assistant/suggest',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,...headers},body:JSON.stringify(body)});
await test('assistant refuses cross-origin requests',async()=>{const r=await handleAssistant(ask({brief:'a',prompt:'',outline:''},{Origin:'https://evil.test'}),{OPENAI_API_KEY:'x'});assert.equal(r.status,403);});
await test('assistant validates input',async()=>{const r=await handleAssistant(ask({brief:'',prompt:'',outline:''}),{OPENAI_API_KEY:'x'});assert.equal(r.status,400);});
await test('assistant returns cleaned suggestions',async()=>{
  const fake=async(url,init)=>{assert.equal(url,'https://api.openai.com/v1/responses');const sent=JSON.parse(init.body);assert.equal(sent.store,false);
    return new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({suggestions:[{title:'Lead with a photo',reason:'Shows the product',steps:['Add a section'],block:'section'},{title:'x',reason:'y',steps:[],block:'bogus'}]})}]}]}),{status:200});};
  const r=await handleAssistant(ask({brief:'Bakery',prompt:'Hero?',outline:''},{'CF-Connecting-IP':'1.1.1.1'}),{OPENAI_API_KEY:'x'},fake);
  assert.equal(r.status,200);const data=await r.json();assert.equal(data.suggestions.length,2);assert.equal(data.suggestions[0].block,'section');assert.equal(data.suggestions[1].block,'none');
});
await test('assistant rate-limits bursts per IP',async()=>{
  const fake=async()=>new Response('{}',{status:500});let last;
  for(let i=0;i<8;i++)last=await handleAssistant(ask({brief:'a',prompt:'',outline:''},{'CF-Connecting-IP':'2.2.2.2'}),{OPENAI_API_KEY:'x'},fake);
  assert.equal(last.status,429);
});
console.log(`\n${passed} checks passed`);
