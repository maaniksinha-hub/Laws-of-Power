// Renders the "48" app icons with Chromium (Playwright) using IBM Plex Sans Condensed.
// Usage: node tools/make-icons.mjs        Outputs to icons/
import { chromium } from 'playwright-core';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(existsSync);
const font = readFileSync('node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2').toString('base64');

// Neo-brutalist mark: yellow field, white tile with an ink outline and a hard shadow, ink "48" with an orange flag. Maskable icons keep the mark in the central 60% "safe zone".
const html = (size, { maskable }) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Int; font-weight: 600; src: url(data:font/woff2;base64,${font}) format("woff2"); }
html, body { margin: 0; width: ${size}px; height: ${size}px; background: #FFB84D; overflow: hidden; }
.icon { position: relative; width: ${size}px; height: ${size}px; display: grid; place-items: center; overflow: hidden; background: #FFB84D; }
.frame { position: absolute; inset: ${size * 0.14}px ${size * 0.18}px ${size * 0.18}px ${size * 0.14}px; border: ${Math.max(2, size * 0.03)}px solid #0E1116; border-radius: ${size * 0.02}px; background: #fff; box-shadow: ${size * 0.04}px ${size * 0.04}px 0 #0E1116; display: ${maskable ? 'none' : 'block'}; }
.mark { position: relative; font-family: Int, system-ui, sans-serif; font-weight: 600; font-size: ${size * (maskable ? 0.36 : 0.4)}px; line-height: 1; color: #0E1116; transform: translateY(${size * 0.01}px); }
.flag { position: absolute; right: ${size * (maskable ? 0.24 : 0.22)}px; top: ${size * (maskable ? 0.24 : 0.2)}px; width: ${size * 0.08}px; height: ${size * 0.08}px; background: #E35002; border: ${Math.max(2, size * 0.02)}px solid #0E1116; }
</style><div class="icon"><div class="frame"></div><div class="flag"></div><div class="mark">48</div></div>`;

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
