import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {publicPages,publicFiles} from './site-manifest.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let changed=0;
// A rebuilt font must invalidate both its stylesheet request and matching preload.
for(const name of publicFiles.filter(file=>file.endsWith('.css'))) {
  const file=path.join(root,name), source=await readFile(file,'utf8');
  let css=source;
  for(const match of source.matchAll(/url\("([^"?]+\.woff2)(?:\?[^"\s]*)?"\)/g)) {
    if(/^(?:https?:|\/\/)/.test(match[1]))continue;
    const asset=await readFile(path.resolve(path.dirname(file),match[1]));
    const version=createHash('sha256').update(asset).digest('hex').slice(0,10);
    css=css.replace(match[0],`url("${match[1]}?v=${version}")`);
  }
  if(css!==source)await writeFile(file,css);
}
for(const page of [...publicPages,'blog/template.html']) {
  const file=path.join(root,page); const source=await readFile(file,'utf8');
  let html=source;
  for(const match of source.matchAll(/(?:href|src)="([^"?]+\.(?:css|js|woff2))(?:\?[^"\s]*)?"/g)) {
    if(/^(?:https?:|\/\/)/.test(match[1]))continue;
    const asset=await readFile(path.resolve(path.dirname(file),match[1]));
    const version=createHash('sha256').update(asset).digest('hex').slice(0,10);
    html=html.replace(match[0],match[0].split('=')[0]+'="'+match[1]+'?v='+version+'"');
  }
  if(html!==source){await writeFile(file,html);changed++;}
}
console.log(`资源版本已核对：${changed} 页更新。`);
