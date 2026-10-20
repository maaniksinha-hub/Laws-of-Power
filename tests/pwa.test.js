import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const manifest = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));
const sw = readFileSync('sw.js', 'utf8');
const assets = JSON.parse(sw.match(/const ASSETS = (\[[\s\S]*?\]);/)[1]);
const pngSize = f => { const b = readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

test('manifest meets installability requirements', () => {
  for (const k of ['name', 'short_name', 'start_url', 'scope', 'display', 'background_color', 'theme_color']) assert.ok(manifest[k], k);
  assert.equal(manifest.display, 'fullscreen'); assert.deepEqual(manifest.display_override, ['fullscreen', 'standalone']); assert.equal(manifest.short_name, '48');
  assert.ok(manifest.start_url.startsWith('.'), 'relative start_url so it works under a GitHub Pages sub-path');
  const purposes = manifest.icons.map(i => i.purpose);
  assert.ok(purposes.includes('any') && purposes.includes('maskable'));
  for (const size of ['192x192', '512x512']) assert.ok(manifest.icons.some(i => i.sizes === size && i.purpose === 'any'), `any ${size}`);
});

test('every manifest icon exists, is a PNG and has its declared size', () => {
  for (const i of manifest.icons) {
    assert.ok(existsSync(i.src), i.src);
    const [w, h] = pngSize(i.src);
    assert.equal(`${w}x${h}`, i.sizes, i.src);
  }
  assert.deepEqual(pngSize('icons/apple-touch-icon.png'), [180, 180]);
  assert.deepEqual(pngSize('icons/favicon-32.png'), [32, 32]);
});

test('the service worker precaches every file the game needs (and nothing missing)', () => {
  const need = ['index.html', 'manifest.webmanifest', 'styles/main.css'];
  for (const d of ['js', 'data', 'data/events', 'fonts', 'icons']) for (const f of readdirSync(d)) if (/\.(js|woff2|png)$/.test(f) && statSync(join(d, f)).isFile()) need.push(`${d}/${f}`);
  for (const f of need) assert.ok(assets.includes(f), `${f} must be in sw.js ASSETS (run npm run build-sw after adding files)`);
  for (const f of assets) if (f !== './') assert.ok(existsSync(f), `${f} listed in sw.js does not exist`);
});

test('index.html links the manifest, icons and theme colour', () => {
  const html = readFileSync('index.html', 'utf8');
  for (const needle of ['rel="manifest"', 'rel="apple-touch-icon"', 'rel="icon"', 'name="theme-color"', 'viewport-fit=cover']) assert.ok(html.includes(needle), needle);
  assert.ok(!/href="\//.test(html) && !/src="\//.test(html), 'no absolute paths: the site is served from a sub-path on GitHub Pages');
});

test('the Pages workflow publishes the PWA files', () => {
  const wf = readFileSync('.github/workflows/pages.yml', 'utf8');
  for (const f of ['manifest.webmanifest', 'sw.js', 'icons', 'fonts']) assert.ok(wf.includes(f), f);
});
