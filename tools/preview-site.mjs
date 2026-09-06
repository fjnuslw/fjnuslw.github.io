// Local-only preview of the public build, with opt-in browser QA fixtures.
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const port=Number(process.argv.find(arg=>arg.startsWith('--port='))?.split('=')[1] || 4174);
const qa=process.argv.includes('--qa');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),mode='';
    const fixture=pathname.match(/^\/__qa\/(nojs|offline-index|slow-index|reduced|large-text|print)\//);
    if(fixture){if(!qa){res.writeHead(404);res.end();return;}mode=fixture[1];pathname=pathname.slice(fixture[0].length-1);}
    if(mode==='offline-index'&&pathname==='/blog/posts.json'){res.writeHead(503,{'Cache-Control':'no-store'});res.end('QA: index unavailable');return;}
    if(mode==='slow-index'&&pathname==='/blog/posts.json')await new Promise(resolve=>setTimeout(resolve,3000));
    let file=path.resolve(root,'.'+pathname);
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    let content=await readFile(file); const ext=path.extname(file);
    if(mode && ['.html','.css'].includes(ext)) {
      let text=content.toString('utf8');
      if(mode==='print')text=text.replace(/@media\s+print/g,'@media all');
      if(mode==='reduced')text=text.replace(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g,'@media all');
      if(ext==='.html') {
        if(mode==='large-text')text=text.replace('</head>','<style>html{font-size:200% !important}</style></head>');
        if(mode==='reduced')text=text.replace('<head>','<head><script>const nativeMatchMedia=window.matchMedia.bind(window);window.matchMedia=query=>query.includes("prefers-reduced-motion")?nativeMatchMedia("(min-width:0px)"):nativeMatchMedia(query);</script>');
      }
      content=Buffer.from(text);
    }
    const headers={'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-store'};
    if(mode==='nojs')headers['Content-Security-Policy']="script-src 'none'; object-src 'none'";
    res.writeHead(200,headers);res.end(content);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}/ ${qa?'(QA fixtures enabled at /__qa/<mode>/)':''}`));
