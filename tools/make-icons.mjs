// Renders the "48" app icons with Chromium (Playwright) using Playfair Display (lining figures).
// Usage: node tools/make-icons.mjs        Outputs to icons/
import { chromium } from 'playwright-core';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(existsSync);
// Playfair Display (OFL, dev-only, not shipped) gives clean lining figures; the game's IM Fell face has old-style numerals that sit unevenly in a square icon.
const font = readFileSync('node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2').toString('base64');

// glyph: font-size as a share of the icon edge. Maskable icons keep the mark inside the central 60% "safe zone".
const html = (size, { maskable }) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Fell; src: url(data:font/woff2;base64,${font}) format("woff2"); }
html, body { margin: 0; width: ${size}px; height: ${size}px; background: #0e0d0c; overflow: hidden; }
.icon { position: relative; width: ${size}px; height: ${size}px; display: grid; place-items: center; overflow: hidden;
  background: radial-gradient(circle at 50% 38%, #3a2f1b 0, #1a160f 46%, #0e0d0c 78%); }
.ring { position: absolute; inset: ${size * 0.07}px; border: ${Math.max(2, size * 0.008)}px solid rgba(184,150,78,.55); border-radius: ${size * 0.17}px; display: ${maskable ? 'none' : 'block'}; }
.ring::after { content: ""; position: absolute; inset: ${size * 0.025}px; border: ${Math.max(1, size * 0.004)}px solid rgba(184,150,78,.25); border-radius: ${size * 0.14}px; }
.mark { font-family: Fell, serif; font-weight: 700; font-size: ${size * (maskable ? 0.40 : 0.48)}px; line-height: 1; letter-spacing: -.03em; transform: translateY(${size * 0.01}px);
  color: transparent; background: linear-gradient(180deg, #f0d99a 0%, #d2ad62 45%, #9c7a38 100%); -webkit-background-clip: text; background-clip: text;
  filter: drop-shadow(0 ${size * 0.01}px ${size * 0.03}px rgba(0,0,0,.6)); }
</style><div class="icon"><div class="ring"></div><div class="mark">48</div></div>`;

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
