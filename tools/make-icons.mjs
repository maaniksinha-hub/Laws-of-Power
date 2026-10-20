// Renders the "48" app icons with Chromium (Playwright) using IBM Plex Sans Condensed.
// Usage: node tools/make-icons.mjs        Outputs to icons/
import { chromium } from 'playwright-core';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(existsSync);
const font = readFileSync('node_modules/@fontsource/nunito/files/nunito-latin-700-normal.woff2').toString('base64');

// Design-team mark: soft mint field, a hand-drawn rounded frame, black "48" with a yellow marker, a pink dot. Maskable icons keep the mark in the central 60% "safe zone".
const html = (size, { maskable }) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Nun; font-weight: 700; src: url(data:font/woff2;base64,${font}) format("woff2"); }
html, body { margin: 0; width: ${size}px; height: ${size}px; background: #d8f0ea; overflow: hidden; }
.icon { position: relative; width: ${size}px; height: ${size}px; display: grid; place-items: center; overflow: hidden; background: #d8f0ea; }
.frame { position: absolute; inset: ${size * 0.08}px; border: ${Math.max(2, size * 0.02)}px solid #1a1a1a; border-radius: ${size * 0.22}px ${size * 0.26}px ${size * 0.2}px ${size * 0.24}px / ${size * 0.24}px ${size * 0.2}px ${size * 0.26}px ${size * 0.22}px; background: #fff; display: ${maskable ? 'none' : 'block'}; }
.mark { position: relative; font-family: Nun, system-ui, sans-serif; font-weight: 700; font-size: ${size * (maskable ? 0.38 : 0.44)}px; line-height: 1; letter-spacing: -.04em; color: #1a1a1a; transform: translateY(${size * 0.01}px); }
.mark::before { content: ""; position: absolute; left: -4%; right: -4%; top: 52%; height: 30%; background: #ffe45e; z-index: -1; border-radius: ${size * 0.01}px; }
.dot { position: absolute; right: ${size * (maskable ? 0.22 : 0.17)}px; top: ${size * (maskable ? 0.22 : 0.17)}px; width: ${size * 0.09}px; height: ${size * 0.09}px; border-radius: 50%; background: #3da89c; border: ${Math.max(2, size * 0.016)}px solid #1a1a1a; }
.dot2 { position: absolute; left: ${size * (maskable ? 0.24 : 0.19)}px; bottom: ${size * (maskable ? 0.24 : 0.19)}px; width: ${size * 0.07}px; height: ${size * 0.07}px; border-radius: 50%; background: #fbd9dd; border: ${Math.max(2, size * 0.014)}px solid #1a1a1a; }
</style><div class="icon"><div class="frame"></div><div class="dot"></div><div class="dot2"></div><div class="mark">48</div></div>`;

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
