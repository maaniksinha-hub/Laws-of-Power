// Renders the "48" app icons with Chromium (Playwright) using IBM Plex Sans Condensed.
// Usage: node tools/make-icons.mjs        Outputs to icons/
import { chromium } from 'playwright-core';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(existsSync);
const font = readFileSync('node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff2').toString('base64');

// Neo-brutalist mark: yellow field, black "48" with a hard shadow, orange block. Maskable icons keep the mark inside the central 60% "safe zone".
const html = (size, { maskable }) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Black; src: url(data:font/woff2;base64,${font}) format("woff2"); }
html, body { margin: 0; width: ${size}px; height: ${size}px; background: #ffc21a; overflow: hidden; }
.icon { position: relative; width: ${size}px; height: ${size}px; display: grid; place-items: center; overflow: hidden; background: #ffc21a; }
.frame { position: absolute; inset: ${size * 0.07}px; border: ${Math.max(2, size * 0.022)}px solid #111; display: ${maskable ? 'none' : 'block'}; }
.mark { font-family: Black, Impact, sans-serif; font-size: ${size * (maskable ? 0.40 : 0.46)}px; line-height: 1; letter-spacing: -.05em; color: #111; text-shadow: ${size * 0.02}px ${size * 0.02}px 0 #fff; transform: translateY(${size * 0.01}px); }
.sq { position: absolute; right: ${size * (maskable ? 0.2 : 0.14)}px; top: ${size * (maskable ? 0.2 : 0.14)}px; width: ${size * 0.1}px; height: ${size * 0.1}px; background: #ff5b1f; border: ${Math.max(2, size * 0.016)}px solid #111; }
.bar { position: absolute; left: 50%; bottom: ${size * (maskable ? 0.24 : 0.17)}px; width: ${size * 0.3}px; height: ${size * 0.035}px; transform: translateX(-50%); background: #111; }
</style><div class="icon"><div class="frame"></div><div class="sq"></div><div class="mark">48</div><div class="bar"></div></div>`;

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
