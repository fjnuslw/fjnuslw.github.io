import { cp, mkdir, rm, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles, publicDirectories } from './site-manifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
// The only recursive removal is this fixed generated output, never caller input.
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Unsafe output path');
await rm(output, { recursive:true, force:true });
await mkdir(output, { recursive:true });
for (const file of [...publicFiles, ...publicDirectories]) {
  const target = path.join(output, file);
  await mkdir(path.dirname(target), { recursive:true });
  await cp(path.join(root, file), target, { recursive:true });
}
await writeFile(path.join(output, '.nojekyll'), '');
async function list(directory) {
  const result = [];
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await list(file));
    else result.push(path.relative(output, file).replaceAll('\\','/'));
  }
  return result;
}
const files = (await list(output)).sort();
if (files.some(file => /^(?:\.private|tmp|docs|specs|search|paper_search|resume-redesign|ai-prep)\//.test(file) || file === 'resume.html')) throw new Error('Non-public workspace in build');
console.log(`正式站点构建完成：${files.length} 个文件 → dist/；内部文档与制作资料已排除。`);
