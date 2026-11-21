import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const types = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff': 'font/woff' };
const inline = async path => `data:${types[extname(path)] || 'application/octet-stream'};base64,${(await readFile(path)).toString('base64')}`;
let css = await readFile(resolve(dist, 'styles.css'), 'utf8');
for (const [whole, src] of [...css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)]) {
  css = css.replaceAll(whole, `url("${await inline(resolve(dist, src))}")`);
}
let html = await readFile(resolve(dist, 'index.html'), 'utf8');
html = html.replace('<link rel="stylesheet" href="./styles.css">', `<style>${css}</style>`);
html = html.replace(/\s*<link rel="preload"[^>]+>/g, '');
html = html.replace(/\s*<script defer src="\.\/(projects|appearance|seasonal-tree|main)\.js"><\/script>/g, '');
for (const [whole, src] of [...html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)]) {
  html = html.replaceAll(whole, whole.replace(src, await inline(resolve(dist, src))));
}
const assetMap = {};
for (const image of ['phonecam-website.webp', 'casting.svg', 'multiplayer.svg', 'controller.svg', 'cleanindia.svg', 'season-spring.webp', 'season-summer.webp', 'season-autumn.webp', 'season-winter.webp', 'season-spring-night.webp', 'season-summer-night.webp', 'season-autumn-night.webp', 'season-winter-night.webp']) assetMap[image] = await inline(resolve(dist, 'assets', image));
const escapeScript = source => source.replaceAll('</script', '<\\/script');
const scripts = `<script>window.ADITUSAN_ASSET_URLS=${JSON.stringify(assetMap)};</script>\n<script>${escapeScript(await readFile(resolve(dist, 'projects.js'), 'utf8'))}</script>\n<script>${escapeScript(await readFile(resolve(dist, 'appearance.js'), 'utf8'))}</script>\n<script>${escapeScript(await readFile(resolve(dist, 'seasonal-tree.js'), 'utf8'))}</script>\n<script>${escapeScript(await readFile(resolve(dist, 'main.js'), 'utf8'))}</script>`;
html = html.replace('</body>', `${scripts}\n</body>`);
const output = process.argv[2] ? resolve(process.argv[2]) : resolve(root, 'Aditusan-Preview.html');
await writeFile(output, html);
console.log(`Standalone preview created: ${output}`);
