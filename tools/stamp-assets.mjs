import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {publicPages} from './site-manifest.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let changed=0;
for(const page of [...publicPages,'blog/template.html']) {
  const file=path.join(root,page); const source=await readFile(file,'utf8');
  let html=source;
  for(const match of source.matchAll(/(?:href|src)="([^"?]+\.(?:css|js))(?:\?[^"\s]*)?"/g)) {
    if(/^(?:https?:|\/\/)/.test(match[1]))continue;
    const asset=await readFile(path.resolve(path.dirname(file),match[1]));
    const version=createHash('sha256').update(asset).digest('hex').slice(0,10);
    html=html.replace(match[0],match[0].split('=')[0]+'="'+match[1]+'?v='+version+'"');
  }
  if(html!==source){await writeFile(file,html);changed++;}
}
console.log(`资源版本已核对：${changed} 页更新。`);
