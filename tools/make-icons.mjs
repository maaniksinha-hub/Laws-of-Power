// Renders the "48" app icons with Chromium (Playwright) using IBM Plex Sans Condensed.
// Usage: node tools/make-icons.mjs        Outputs to icons/
import { chromium } from 'playwright-core';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(existsSync);
// Playfair Display (OFL, dev-only, not shipped) gives clean lining figures; the game's IM Fell face has old-style numerals that sit unevenly in a square icon.
const font = readFileSync('node_modules/@fontsource/ibm-plex-sans-condensed/files/ibm-plex-sans-condensed-latin-600-normal.woff2').toString('base64');

// glyph: font-size as a share of the icon edge. Maskable icons keep the mark inside the central 60% "safe zone".
const html = (size, { maskable }) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Fell; src: url(data:font/woff2;base64,${font}) format("woff2"); }
html, body { margin: 0; width: ${size}px; height: ${size}px; background: #10223a; overflow: hidden; }
  .icon { position: relative; width: ${size}px; height: ${size}px; display: grid; place-items: center; overflow: hidden; background: #10223a; }
.mark { font-family: Fell, sans-serif; font-weight: 600; font-size: ${size * (maskable ? 0.40 : 0.50)}px; line-height: 1; letter-spacing: -.02em; color: #ffd84d; transform: translateY(${size * 0.01}px); }
.bar { position: absolute; left: 50%; bottom: ${size * (maskable ? 0.27 : 0.2)}px; width: ${size * 0.26}px; height: ${size * 0.03}px; transform: translateX(-50%); background: #ffd84d; opacity: .55; }
</style><div class="icon"><div class="mark">48</div><div class="bar"></div></div>`;

mkdirSync('icons', { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const jobs = [['icon-512.png', 512, false], ['icon-192.png', 192, false], ['icon-maskable-512.png', 512, true], ['icon-maskable-192.png', 192, true], ['apple-touch-icon.png', 180, false], ['favicon-32.png', 32, false]];
for (const [name, size, maskable] of jobs) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(html(size, { maskable }));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve('icons', name), omitBackground: false });
  await page.close();
  console.log('wrote icons/' + name);
}
await browser.close();
