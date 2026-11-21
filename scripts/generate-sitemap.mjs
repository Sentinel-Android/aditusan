import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const xmlEscape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const decode = value => value.replace(/&(amp|quot|apos|lt|gt);/g, (_, key) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' })[key]);

function attributes(tag) {
  const result = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4]);
  }
  return result;
}

async function pages(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || /^(qa[-_.]|preview[-_.])/i.test(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await pages(path));
    else if (entry.isFile() && /\.html$/i.test(entry.name) && !/(?:^404|preview)\.html$/i.test(entry.name)) found.push(path);
  }
  return found;
}

export async function generateSitemap({ directory = resolve(project, 'dist'), baseURL } = {}) {
  directory = resolve(directory);
  const base = new URL(baseURL ?? `https://${(await readFile(join(directory, 'CNAME'), 'utf8')).trim()}/`);
  if (base.protocol !== 'https:' || base.pathname !== '/' || base.search || base.hash || base.username || base.password) {
    throw new Error('Sitemap base must be an HTTPS site origin, for example https://aditusan.dev/.');
  }
  const urls = new Set();
  for (const file of await pages(directory)) {
    const html = (await readFile(file, 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
    const tags = [...html.matchAll(/<(meta|link)\b[^>]*>/gi)].map(m => ({ tag: m[1].toLowerCase(), attrs: attributes(m[0]) }));
    if (tags.some(({ tag, attrs: a }) => tag === 'meta' && /^(robots|googlebot)$/i.test(a.name ?? '') && /(?:^|[\s,])(noindex|none)(?:$|[\s,])/i.test(a.content ?? ''))) continue;
    if (tags.some(({ tag, attrs: a }) => tag === 'meta' && /^refresh$/i.test(a['http-equiv'] ?? ''))) continue;
    const path = relative(directory, file).split(sep).map(encodeURIComponent).join('/').replace(/(^|\/)index\.html$/i, '$1');
    let url = new URL(path, base);
    const canonical = tags.find(({ tag, attrs: a }) => tag === 'link' && (a.rel ?? '').toLowerCase().split(/\s+/).includes('canonical'));
    if (canonical) {
      if (!canonical.attrs.href) throw new Error(`Empty canonical URL in ${file}`);
      url = new URL(canonical.attrs.href, url);
    }
    if (url.origin !== base.origin || url.username || url.password) continue;
    url.hash = '';
    urls.add(url.href);
  }
  const locations = [...urls].sort();
  if (!locations.length) throw new Error('No indexable HTML pages found; sitemap was not overwritten.');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    locations.map(url => `  <url>\n    <loc>${xmlEscape(url)}</loc>\n  </url>\n`).join('') + '</urlset>\n';
  await writeFile(join(directory, 'sitemap.xml'), xml);
  let robots;
  try { robots = await readFile(join(directory, 'robots.txt'), 'utf8'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; robots = 'User-agent: *\nAllow: /\n'; }
  const reference = `Sitemap: ${new URL('sitemap.xml', base).href}`;
  if (!robots.split(/\r?\n/).some(line => line.trim() === reference)) {
    await writeFile(join(directory, 'robots.txt'), `${robots.trimEnd()}\n\n${reference}\n`);
  }
  return locations;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const urls = await generateSitemap();
  console.log(`Generated sitemap.xml with ${urls.length} canonical page(s); robots.txt references it.`);
}
