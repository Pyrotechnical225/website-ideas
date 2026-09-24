// Local preview server: runs the built Worker (dist/server/index.js) on Node.
// Usage: npm run build && npm start   (PORT and OPENAI_API_KEY are read from the environment)
import http from 'node:http';
const worker=(await import(new URL('../dist/server/index.js',import.meta.url))).default;
const port=Number(process.env.PORT||8787);
http.createServer(async(req,res)=>{
 try{
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const body=chunks.length?Buffer.concat(chunks):undefined;
  const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:body});
  const response=await worker.fetch(request,process.env);
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){console.error(error);res.writeHead(500);res.end('Server error');}
}).listen(port,()=>console.log(`Oakline running at http://localhost:${port}`));
