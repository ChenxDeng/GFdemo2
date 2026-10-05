import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf','.md':'text/plain; charset=utf-8'};
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    if(!(await stat(target)).isFile()) throw Error('not a file');
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});
    res.end(await readFile(target));
  }catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`QIQC Challenge http://127.0.0.1:${port}`));
