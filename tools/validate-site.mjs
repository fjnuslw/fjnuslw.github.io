import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excludedDirectories = new Set(['.git', '.workbuddy', 'node_modules', 'resume-redesign', 'tmp']);
const errors = [];
let checkedLinks = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).replaceAll('\\', '/');
}

function localTarget(fromFile, rawUrl) {
  const url = rawUrl.trim();
  if (!url || url.startsWith('#') || url.startsWith('//')) return null;
  if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(url)) return null;

  const clean = url.split('#', 1)[0].split('?', 1)[0];
  if (!clean) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    errors.push(`${relative(fromFile)}: URL 编码无效：${rawUrl}`);
    return null;
  }

  return decoded.startsWith('/')
    ? path.resolve(root, `.${decoded}`)
    : path.resolve(path.dirname(fromFile), decoded);
}

async function validateHtml(file) {
  const html = await readFile(file, 'utf8');
  if (!/<html\b[^>]*\blang=["']zh-CN["']/i.test(html)) errors.push(`${relative(file)}: 缺少 lang="zh-CN"`);
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) errors.push(`${relative(file)}: 缺少 viewport`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${relative(file)}: 缺少标题`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) errors.push(`${relative(file)}: 重复 id：${duplicates.join(', ')}`);

  const urls = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map(match => match[1]);
  for (const url of urls) {
    const target = localTarget(file, url);
    if (!target) continue;
    checkedLinks += 1;
    let resolvedTarget = target;
    if (path.extname(resolvedTarget) === '') resolvedTarget = path.join(resolvedTarget, 'index.html');
    try {
      await access(resolvedTarget);
    } catch {
      errors.push(`${relative(file)}: 本地链接不存在：${url}`);
    }
  }
}

const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
await Promise.all(htmlFiles.map(validateHtml));

try {
  const posts = JSON.parse(await readFile(path.join(root, 'blog', 'posts.json'), 'utf8'));
  for (const post of posts) {
    if (!post.id || !post.title || !post.date || !post.url) errors.push('blog/posts.json: 文章记录字段不完整');
    const target = path.join(root, post.url);
    try {
      await access(target);
    } catch {
      errors.push(`blog/posts.json: 文章文件不存在：${post.url}`);
    }
  }
} catch (error) {
  errors.push(`blog/posts.json: ${error.message}`);
}

const cssFile = path.join(root, 'css', 'style.css');
const css = (await readFile(cssFile, 'utf8'))
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
let braceDepth = 0;
for (const character of css) {
  if (character === '{') braceDepth += 1;
  if (character === '}') braceDepth -= 1;
  if (braceDepth < 0) break;
}
if (braceDepth !== 0) errors.push('css/style.css: 花括号不平衡');

if (errors.length) {
  console.error(`站点校验失败（${errors.length} 项）：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`站点校验通过：${htmlFiles.length} 个 HTML 文件，${checkedLinks} 个本地资源链接。`);
