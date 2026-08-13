import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://fjnuslw.github.io/';
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
  const filePath = relative(file);
  if (!/<html\b[^>]*\blang=["']zh-CN["']/i.test(html)) errors.push(`${relative(file)}: 缺少 lang="zh-CN"`);
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) errors.push(`${relative(file)}: 缺少 viewport`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${relative(file)}: 缺少标题`);

  const requiresCanonical = filePath !== 'blog/template.html' && (
    /^[^/]+\.html$/.test(filePath)
    || /^blog\/[^/]+\.html$/.test(filePath)
    || /^projects\/[^/]+\.html$/.test(filePath)
    || filePath === 'demos/local-window-copilot/index.html'
  );
  if (requiresCanonical) {
    const canonical = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i)?.[1];
    const publicPath = filePath === 'index.html'
      ? ''
      : filePath.endsWith('/index.html')
        ? filePath.slice(0, -'index.html'.length)
        : filePath;
    const expectedCanonical = new URL(publicPath, origin).href;
    if (!canonical) errors.push(`${filePath}: 缺少 canonical`);
    else if (canonical !== expectedCanonical) errors.push(`${filePath}: canonical 应为 ${expectedCanonical}`);

    const ogUrl = html.match(/<meta\b[^>]*\bproperty=["']og:url["'][^>]*\bcontent=["']([^"']+)["']/i)?.[1];
    if (ogUrl && canonical && ogUrl !== canonical) errors.push(`${filePath}: og:url 与 canonical 不一致`);
  }

  for (const match of html.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${filePath}: JSON-LD 无效：${error.message}`);
    }
  }

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    if (!/\balt=["'][^"']*["']/i.test(tag)) errors.push(`${filePath}: img 缺少 alt`);
  }

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

let posts = [];
try {
  posts = JSON.parse(await readFile(path.join(root, 'blog', 'posts.json'), 'utf8'));
  const ids = posts.map(post => post.id);
  const urls = posts.map(post => post.url);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const duplicateUrls = [...new Set(urls.filter((url, index) => urls.indexOf(url) !== index))];
  if (duplicateIds.length) errors.push(`blog/posts.json: 重复 id：${duplicateIds.join(', ')}`);
  if (duplicateUrls.length) errors.push(`blog/posts.json: 重复 URL：${duplicateUrls.join(', ')}`);

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

try {
  const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());
  const duplicateSitemapUrls = [...new Set(sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index))];
  if (duplicateSitemapUrls.length) errors.push(`sitemap.xml: 重复 URL：${duplicateSitemapUrls.join(', ')}`);

  for (const post of posts) {
    const expected = new URL(post.url, origin).href;
    if (!sitemapUrls.includes(expected)) errors.push(`sitemap.xml: 缺少文章：${post.url}`);
  }
  for (const file of htmlFiles) {
    const filePath = relative(file);
    if (!/^projects\/[^/]+\.html$/.test(filePath)) continue;
    const expected = new URL(filePath, origin).href;
    if (!sitemapUrls.includes(expected)) errors.push(`sitemap.xml: 缺少项目详情：${filePath}`);
  }
} catch (error) {
  errors.push(`sitemap.xml: ${error.message}`);
}

const listedPosts = new Set(posts.map(post => post.url));
for (const file of htmlFiles) {
  const filePath = relative(file);
  if (!/^blog\/[^/]+\.html$/.test(filePath) || filePath === 'blog/template.html') continue;
  if (!listedPosts.has(filePath)) errors.push(`blog/posts.json: 未收录文章：${filePath}`);
}

try {
  const blogIndex = await readFile(path.join(root, 'blog.html'), 'utf8');
  if (!blogIndex.includes(`${posts.length} 篇公开笔记`)) {
    errors.push(`blog.html: 硬编码篇数与 posts.json 的 ${posts.length} 篇不一致`);
  }
  for (const post of posts) {
    if (!blogIndex.includes(`href="${post.url}"`)) errors.push(`blog.html: 缺少文章卡片：${post.url}`);
  }
} catch (error) {
  errors.push(`blog.html: ${error.message}`);
}

for (const svgFile of files.filter(file => file.endsWith('.svg') && relative(file).startsWith('assets/blog/'))) {
  const svg = await readFile(svgFile, 'utf8');
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(svg)) errors.push(`${relative(svgFile)}: 缺少 SVG title`);
  if (!/<desc\b[^>]*>[^<]+<\/desc>/i.test(svg)) errors.push(`${relative(svgFile)}: 缺少 SVG desc`);
}

for (const cssFile of files.filter(file => file.endsWith('.css'))) {
  const css = (await readFile(cssFile, 'utf8'))
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
  let braceDepth = 0;
  for (const character of css) {
    if (character === '{') braceDepth += 1;
    if (character === '}') braceDepth -= 1;
    if (braceDepth < 0) break;
  }
  if (braceDepth !== 0) errors.push(`${relative(cssFile)}: 花括号不平衡`);
}

if (errors.length) {
  console.error(`站点校验失败（${errors.length} 项）：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`站点校验通过：${htmlFiles.length} 个 HTML 文件，${checkedLinks} 个本地资源链接。`);
