import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateSitemap } from './generate-sitemap.mjs';

const directory = await mkdtemp(join(tmpdir(), 'aditusan-sitemap-'));
try {
  async function page(name, content = '<h1>A page</h1>') {
    const path = join(directory, name);
    await mkdir(join(path, '..'), { recursive: true });
    await writeFile(path, content);
  }
  await page('index.html', '<link href="https://example.test/" rel="canonical"><h1>Home</h1>');
  await page('about/index.html');
  await page('notes.html');
  await page('404.html');
  await page('Aditusan-Preview.html');
  await page('qa-reference/index.html');
  await page('private.html', '<meta content="noindex,follow" NAME="robots">');
  await page('redirect.html', '<meta http-equiv="refresh" content="0;url=/">');
  await page('duplicate.html', '<link rel="canonical" href="/">');
  await page('external.html', '<link rel="canonical" href="https://other.test/">');
  await page('robots.txt', 'User-agent: *\nDisallow: /private/\n');
  const options = { directory, baseURL: 'https://example.test/' };
  assert.deepEqual(await generateSitemap(options), ['https://example.test/', 'https://example.test/about/', 'https://example.test/notes.html']);
  const robots = await readFile(join(directory, 'robots.txt'), 'utf8');
  assert.ok(robots.includes('Disallow: /private/'));
  assert.ok(robots.includes('Sitemap: https://example.test/sitemap.xml'));
  const first = await readFile(join(directory, 'sitemap.xml'), 'utf8');
  await generateSitemap(options);
  assert.equal(await readFile(join(directory, 'sitemap.xml'), 'utf8'), first);
  assert.equal(await readFile(join(directory, 'robots.txt'), 'utf8'), robots);
  await page('new-page.html', '<link rel="canonical" href="/new-page.html?a=1&amp;b=2#section">');
  await rm(join(directory, 'notes.html'));
  assert.deepEqual(await generateSitemap(options), ['https://example.test/', 'https://example.test/about/', 'https://example.test/new-page.html?a=1&b=2']);
  assert.ok((await readFile(join(directory, 'sitemap.xml'), 'utf8')).includes('?a=1&amp;b=2</loc>'));
  await assert.rejects(generateSitemap({ directory, baseURL: 'http://example.test/' }), /HTTPS/);
  console.log('Sitemap tests passed: page discovery, additions/removals, exclusions, canonicals, XML escaping, and repeatability.');
} finally {
  await rm(directory, { recursive: true, force: true });
}
