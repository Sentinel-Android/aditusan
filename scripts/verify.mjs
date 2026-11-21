import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
const failures = [];
let checked = 0;

async function verifyAsset(reference, from) {
  if (!reference.startsWith('./') && !reference.startsWith('../')) return;
  const path = resolve(dirname(from), reference.split(/[?#]/)[0]);
  if (!path.startsWith(root + '/')) { failures.push(`Asset escapes dist: ${reference}`); return; }
  try { if (!(await stat(path)).isFile()) throw new Error(); checked += 1; }
  catch { failures.push(`Missing local asset: ${reference}`); }
}

for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) await verifyAsset(match[1], resolve(root, 'index.html'));
for (const match of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) await verifyAsset(match[1], resolve(root, 'styles.css'));
for (const season of ['spring', 'summer', 'autumn', 'winter']) {
  await verifyAsset(`./assets/season-${season}.webp`, resolve(root, 'index.html'));
  await verifyAsset(`./assets/season-${season}-night.webp`, resolve(root, 'index.html'));
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) failures.push('Duplicate HTML/SVG IDs.');
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) failures.push(`Missing anchor: #${match[1]}`);
}
const context = { window: {} };
vm.runInNewContext(await readFile(resolve(root, 'projects.js'), 'utf8'), context);
const projects = context.window.ADITUSAN_PROJECTS;
for (const match of html.matchAll(/data-project="([^"]+)"/g)) {
  if (!projects[match[1]]) failures.push(`Missing project details: ${match[1]}`);
}
for (const project of Object.values(projects)) {
  await verifyAsset(`./assets/${project.image}`, resolve(root, 'index.html'));
  for (const link of project.links) {
    try { if (new URL(link.href).protocol !== 'https:') throw new Error(); }
    catch { failures.push(`Invalid project URL: ${link.href}`); }
  }
}
for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  try { JSON.parse(match[1]); } catch { failures.push('Invalid structured-data JSON.'); }
}
if ((await readFile(resolve(root, 'CNAME'), 'utf8')).trim() !== 'aditusan.dev') failures.push('Incorrect custom domain.');
if (/\{\{(?:TITLE|DESCRIPTION|SEO_TAGS)\}\}|<!-- INK_LOGO -->/.test(html)) failures.push('An unfinished template placeholder remains.');
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Website validated: ${checked} local asset references, ${Object.keys(projects).length} project entries, anchors, metadata, and custom domain.`);
