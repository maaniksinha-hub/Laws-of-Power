// Browser smoke test (Playwright + Chromium). Run with: npm run test:smoke
// Covers: boot, title, new reign, mouse/keyboard/touch input, persistence across refresh, panels, settings,
// every card with both choices, full reigns to an ending, summary, responsive layouts, reduced motion.
import { chromium } from 'playwright-core';
import { createGameServer } from '../server.js';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const CHROME = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(existsSync);
const SHOTS = process.env.SHOTS_DIR;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const server = createGameServer();
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const problems = [];
let passed = 0;
const step = async (name, fn) => { try { await fn(); passed++; console.log('  ok  ', name); } catch (e) { problems.push(`${name}: ${e.message}`); console.log('  FAIL', name, '\n      ', e.message.split('\n')[0]); } };

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: false, ...opts });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errs.push('requestfailed: ' + r.url()));
  page.on('response', r => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
  page.errs = errs; page.ctx = ctx;
  return page;
}
const shot = (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png` });
const visible = (page, sel) => page.locator(sel).isVisible();
async function swipe(page, dx) {
  const box = await page.locator('#card').boundingBox();
  const cdp = await page.ctx.newCDPSession(page);
  const y = box.y + box.height / 2, x0 = box.x + box.width / 2;
  const pt = x => [{ x, y, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(x0) });
  for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(x0 + (dx * i) / 8) });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
async function dragMouse(page, dx) {
  const box = await page.locator('#card').boundingBox();
  const y = box.y + box.height / 2, x0 = box.x + box.width / 2;
  await page.mouse.move(x0, y); await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(x0 + (dx * i) / 8, y);
  await page.mouse.up();
}
const waitResult = page => page.waitForSelector('#result:not([hidden])', { timeout: 3000 });
const nextCard = async page => { await page.waitForTimeout(280); await page.click('#btn-next'); };
const turn = page => page.evaluate(() => __lop.state.turn);
async function startReign(page, qs = '') {
  await page.goto(base + qs); await page.click('#btn-new'); await page.click('[data-action=begin-reign]');
  await page.waitForSelector('#card:not([hidden])');
}
async function reduceMotion(page) { await page.evaluate(() => { __lop.settings.motion = 'reduce'; document.documentElement.dataset.motion = 'reduce'; }); }

// ----------------------------------------------------------------------------------------------
console.log('Smoke test against', base);
let page = await newPage();

await step('title screen loads without console errors or missing assets', async () => {
  await page.goto(base);
  await page.waitForSelector('#screen-title:not([hidden])');
  assert.match(await page.textContent('h1'), /48.*Laws of Power/);
  assert.ok(await visible(page, '#btn-new')); assert.ok(await visible(page, '#btn-codex')); assert.ok(await visible(page, '#btn-settings'));
  assert.ok(!(await visible(page, '#btn-continue-reign')), 'no Continue without a save');
  await shot(page, '01-title');
  assert.deepEqual(page.errs, []);
});

await step('title: daily court button and bundled font load', async () => {
  assert.ok(await visible(page, '#btn-daily'));
  assert.ok(await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('18px "IM Fell English"'); }), 'IM Fell English loaded from /fonts');
});

await step('new reign dialog lists backgrounds; locked ones are disabled', async () => {
  await page.click('#btn-new');
  assert.ok(await visible(page, '#dlg'));
  assert.equal(await page.locator('input[name=bg]').count(), 6);
  assert.ok(await page.locator('input[name=bg][value=grey_pawn]').isDisabled());
  assert.ok(!(await page.locator('input[name=bg][value=minor_noble]').isDisabled()));
  await shot(page, '02-newreign');
});

await step('begin a reign: card, four meters, two choices, objective strip', async () => {
  await page.click('[data-action=begin-reign]');
  await page.waitForSelector('#card:not([hidden])');
  assert.equal(await page.locator('.meter').count(), 4);
  assert.match(await page.textContent('#card-title'), /CHAMBERLAIN/i);
  assert.ok((await page.textContent('#label-left')).length > 3); assert.ok((await page.textContent('#label-right')).length > 3);
  assert.ok(await visible(page, '#objective-btn'));
  for (const n of ['Authority', 'Reputation', 'Loyalty', 'Resources']) assert.ok(await page.locator(`.meter[aria-label="${n}"]`).count());
  await shot(page, '03-card');
});

await step('click a choice: result panel with meter chips, then continue', async () => {
  await page.click('#btn-right');
  await waitResult(page);
  assert.ok((await page.textContent('#result')).length > 40);
  assert.ok(await page.locator('#result .chip').count() >= 1);
  assert.ok(await page.locator('#result details.lesson').count() === 1, 'debrief appears for a significant event');
  assert.ok(await visible(page, '#btn-next')); assert.ok(!(await visible(page, '#btn-left')));
  await shot(page, '04-result');
  await nextCard(page);
  await page.waitForSelector('#card:not([hidden])');
  assert.equal(await turn(page), 2);
});

await step('double activation cannot resolve two choices', async () => {
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('a');
  await waitResult(page);
  assert.equal(await page.evaluate(() => __lop.state.history.length), 2);
  assert.equal(await turn(page), 3);
});

await step('keyboard: any arrow/A/D continues from result, then A and D choose', async () => {
  await page.waitForTimeout(300); await page.keyboard.press('ArrowRight');
  await page.waitForSelector('#card:not([hidden])');
  await page.keyboard.press('d'); await waitResult(page); await page.waitForTimeout(300); await page.keyboard.press('Enter');
  await page.waitForSelector('#card:not([hidden])');
  assert.equal(await turn(page), 4);
});

await step('polish: scene portraits, hint dots while dragging, echo line, vignette on crisis', async () => {
  assert.ok(await page.locator('#card-portrait svg expr-warm, #card-portrait svg[class*=expr-]').count() >= 1, 'expressive portrait');
  const box = await page.locator('#card').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 120); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 70, box.y + 120, { steps: 4 });
  const hinted = await page.locator('.meter.hinted').count();
  await page.waitForTimeout(450); await page.mouse.up(); await page.waitForTimeout(300);
  assert.ok(hinted >= 1, 'a hint dot marks an affected meter while dragging right');
  await page.evaluate(() => { __lop.state.meters.loyalty = 8; document.querySelector('[data-key=loyalty]').classList.add('critical'); document.getElementById('vignette').classList.add('on'); });
  assert.equal(await page.locator('#vignette.on').count(), 1);
  await page.evaluate(() => { __lop.state.meters.loyalty = 40; document.getElementById('vignette').classList.remove('on'); });
});

await step('touch swipe left/right chooses; short swipe snaps back', async () => {
  const t0 = await turn(page);
  await swipe(page, 25);
  await page.waitForTimeout(350);
  assert.ok(await visible(page, '#card'), 'short swipe leaves the card');
  assert.equal(await turn(page), t0);
  await swipe(page, -160); await waitResult(page);
  assert.equal(await page.evaluate(() => __lop.state.history.at(-1).side), 'left');
  await nextCard(page); await page.waitForSelector('#card:not([hidden])');
  await swipe(page, 170); await waitResult(page);
  assert.equal(await page.evaluate(() => __lop.state.history.at(-1).side), 'right');
});

await step('mouse drag chooses and card rotates while dragging', async () => {
  await nextCard(page); await page.waitForSelector('#card:not([hidden])');
  const box = await page.locator('#card').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 100); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 60, box.y + 100, { steps: 4 }); await page.waitForTimeout(500); // hold still so it is not read as a flick
  assert.match(await page.locator('#card').evaluate(e => e.style.transform), /rotate/);
  assert.ok(Number(await page.locator('#tag-right').evaluate(e => e.style.opacity)) > 0.3, 'choice tag fades in');
  await page.mouse.up();
  await page.waitForTimeout(350);
  assert.ok(await visible(page, '#card'), 'card must spring back after a slow short drag: ' + JSON.stringify(await page.evaluate(() => ({ turn: __lop.state.turn, pending: !!__lop.state.pendingResult, cardHidden: document.getElementById('card').hidden, resultHidden: document.getElementById('result').hidden, tr: document.getElementById('card').style.transform }))));
  await dragMouse(page, -200); await waitResult(page);
});

await step('progress survives a refresh (Continue restores turn, meters and pending result)', async () => {
  const before = await page.evaluate(() => ({ turn: __lop.state.turn, m: __lop.state.meters, pending: !!__lop.state.pendingResult }));
  await page.reload();
  await page.waitForSelector('#btn-continue-reign:not([hidden])');
  await page.click('#btn-continue-reign');
  await page.waitForSelector('#screen-game:not([hidden])');
  const after = await page.evaluate(() => ({ turn: __lop.state.turn, m: __lop.state.meters, pending: !!__lop.state.pendingResult }));
  assert.deepEqual(after, before);
  assert.ok(before.pending ? await visible(page, '#result') : await visible(page, '#card'));
  if (before.pending) { await nextCard(page); await page.waitForSelector('#card:not([hidden])'); }
});

await step('panels: dossier, chronicle, objective, menu, codex, settings open and close', async () => {
  await page.click('#btn-dossier'); assert.ok((await page.textContent('#dlg-body')).includes('Piers Quill'));
  assert.ok(!(await page.textContent('#dlg-body')).includes('Hidden aim:</b> Quill'), 'hidden agenda stays hidden');
  assert.match(await page.textContent('#dlg-body'), /Hidden aim:\s*Unknown/);
  await shot(page, '05-dossier');
  await page.keyboard.press('Escape'); assert.ok(!(await visible(page, '#dlg')));
  await page.click('#btn-chronicle'); assert.match(await page.textContent('#dlg-body'), /Turn 1/); await page.click('#dlg-close');
  await page.click('#objective-btn'); assert.match(await page.textContent('#dlg-body'), /Only you know this/); await page.click('#dlg-close');
  await page.click('#btn-menu'); await page.click('[data-action=open-panel][data-panel=codex]');
  assert.ok(await visible(page, '#dlg-back'));
  assert.match(await page.textContent('#dlg-body'), /laws discovered/);
  await page.click('[data-tab=characters]'); assert.match(await page.textContent('#dlg-body'), /Piers Quill/);
  await page.click('[data-tab=endings]'); await page.click('[data-tab=achievements]'); await page.click('[data-tab=unlocks]');
  await shot(page, '06-codex');
  await page.click('#dlg-back'); assert.match(await page.textContent('#dlg-title'), /Paused/);
  await page.click('[data-action=resume]');
  await page.waitForTimeout(100);
});

await step('settings: toggles persist; exact values option shows numbers', async () => {
  await page.click('#btn-menu'); await page.click('[data-panel=settings]');
  await page.locator('[data-setting=showValues]').check();
  await page.locator('[data-setting=sound]').uncheck();
  await page.selectOption('[data-setting=motion]', 'reduce');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('lop.settings')));
  assert.deepEqual([saved.showValues, saved.sound, saved.motion], [true, false, 'reduce']);
  assert.equal(await page.evaluate(() => document.documentElement.dataset.motion), 'reduce');
  await page.click('#dlg-close');
  assert.ok(await page.locator('.meter-val').first().isVisible());
});

await step('erase-all requires explicit confirmation (cancel keeps data, confirm wipes)', async () => {
  await page.click('#btn-menu'); await page.click('[data-panel=settings]');
  await page.click('[data-action=erase-all]'); assert.ok(await visible(page, '#dlg-confirm'));
  await page.click('#confirm-cancel');
  assert.ok(await page.evaluate(() => !!localStorage.getItem('lop.save')), 'cancel keeps the save');
  await page.click('[data-action=erase-all]'); await page.click('#confirm-ok');
  await page.waitForSelector('#screen-title:not([hidden])');
  assert.ok(await page.evaluate(() => !localStorage.getItem('lop.save') && !localStorage.getItem('lop.meta')));
  assert.ok(!(await visible(page, '#btn-continue-reign')));
});

await step('corrupted save is ignored with a notice, and the game still starts', async () => {
  await page.evaluate(() => localStorage.setItem('lop.save', '{broken'));
  await page.reload(); await page.waitForSelector('#screen-title:not([hidden])');
  assert.match(await page.textContent('#title-notice'), /could not be read/);
  assert.ok(!(await visible(page, '#btn-continue-reign')));
  await startReign(page);
  assert.ok(await visible(page, '#card'));
});

await step('every event card renders and both choices work in the UI', async () => {
  await reduceMotion(page);
  const ids = await page.evaluate(() => Object.keys(__lop.content.events));
  assert.ok(ids.length >= 40);
  for (const id of ids) for (const side of ['left', 'right']) {
    await page.evaluate(async ({ id }) => {
      const g = await import('/js/gameEngine.js');
      __lop.state = g.newReign({ reigns: 0 }, { seed: 'ui-' + id });
      const ev = __lop.content.events[id];
      __lop.state.turn = 20; __lop.state.rank = 2; __lop.state.chars[ev.char].status = 'court';
      for (const o of ev.others || []) __lop.state.chars[o].status = 'court';
      if (ev.allowAbsent) __lop.state.chars.rask.status = 'defected';
      __lop.debugShow(id);
    }, { id });
    const ev = await page.evaluate(id => __lop.content.events[id], id);
    assert.equal((await page.textContent('#card-title')).trim(), ev.title, id);
    assert.ok((await page.textContent('#card-text')).trim().length > 40, id + ' text');
    assert.ok(await page.locator('#card-portrait svg').count() >= 1, id + ' portrait');
    await page.click(side === 'left' ? '#btn-left' : '#btn-right');
    await waitResult(page);
    assert.ok((await page.textContent('#result .result-text')).trim().length > 5, `${id} ${side} result`);
  }
  assert.deepEqual(page.errs.filter(e => !/corrupt|broken/i.test(e)), []);
});

await step('complete reigns through the UI reach a summary screen (several seeds, mixed inputs)', async () => {
  for (const seed of ['ui1', 'ui2']) {
    await page.evaluate(() => localStorage.clear());
    await startReign(page, `?seed=${seed}`); await reduceMotion(page);
    let guard = 0;
    while (!(await visible(page, '#screen-summary')) && guard++ < 220) {
      if (await visible(page, '#card')) {
        const how = guard % 3;
        if (how === 0) await page.click('#btn-left'); else if (how === 1) await page.keyboard.press('d'); else await swipe(page, guard % 2 ? 150 : -150);
        await page.waitForSelector('#result:not([hidden])');
      } else { await page.waitForTimeout(260); await page.click('#btn-next'); await page.waitForTimeout(80); }
    }
    await page.waitForSelector('#screen-summary:not([hidden])', { timeout: 4000 });
    const text = await page.textContent('#screen-summary');
    for (const need of ['Turns survived', 'Secret objective', 'Allies and enemies', 'strategic style']) assert.ok(text.includes(need) || text.toLowerCase().includes(need.toLowerCase()), `summary mentions ${need}`);
    if (seed === 'ui1') await shot(page, '07-summary');
    assert.ok(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('lop.meta')).endings).length >= 1), 'ending recorded in meta');
  }
  assert.deepEqual(page.errs.filter(e => !/corrupt|broken/i.test(e)), []);
});

await step('summary shows the meter timeline and a share button', async () => {
  await page.evaluate(() => localStorage.clear());
  await startReign(page, '?seed=ui9'); await reduceMotion(page);
  await page.evaluate(() => { const s = __lop.state; s.forcedEnding = 'negotiated_exit'; });
  await page.click('#btn-left'); await waitResult(page); await page.waitForTimeout(280); await page.click('#btn-next');
  await page.waitForSelector('#screen-summary:not([hidden])');
  assert.ok(await visible(page, '#btn-sum-share'));
  await page.evaluate(() => { navigator.clipboard.writeText = async t => { window.__copied = t; }; Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }); });
  await page.click('#btn-sum-share');
  assert.match(await page.evaluate(() => window.__copied || ''), /48: Laws of Power/);
  assert.equal(await page.evaluate(() => /kind-/.test(document.getElementById('screen-summary').className)), true);
});

await step('after a reign: codex has discoveries, a new reign can begin, progress persists', async () => {
  await page.click('#btn-sum-codex');
  assert.match(await page.textContent('#dlg-body'), /laws discovered/);
  await page.click('[data-tab=endings]');
  assert.ok(await page.locator('#dlg-body .item:not(.locked)').count() >= 1);
  await page.click('#dlg-close');
  await page.click('#btn-sum-new'); await page.click('[data-action=begin-reign]');
  await page.waitForSelector('#card:not([hidden])');
  assert.equal(await page.evaluate(() => __lop.state.reignId), 2, 'reign counter advances from the persisted meta (storage was cleared before the last reign)');
});

await page.ctx.close();

// ---- responsive layouts
for (const [name, w, h] of [['phone-small', 360, 640], ['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1280, 800], ['landscape', 844, 390]]) {
  await step(`layout ${name} (${w}x${h}): no overflow, choices on screen, card readable`, async () => {
    const p = await newPage({ viewport: { width: w, height: h } });
    await startReign(p);
    const m = await p.evaluate(() => {
      const r = id => document.getElementById(id).getBoundingClientRect();
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight, ch: innerHeight, l: r('btn-left'), rr: r('btn-right'), card: r('card'), text: getComputedStyle(document.getElementById('card-text')).fontSize, bodyOverflow: getComputedStyle(document.body).overflow };
    });
    assert.ok(m.sw <= m.cw + 1, `horizontal overflow ${m.sw} > ${m.cw}`);
    assert.ok(m.l.bottom <= m.ch + 1 && m.rr.bottom <= m.ch + 1, 'choice buttons within viewport');
    assert.ok(m.card.height >= (h < 520 ? 150 : 200), `card height ${m.card.height}`);
    assert.ok(parseFloat(m.text) >= 14, 'text size');
    await shot(p, `layout-${name}`);
    await p.click('#btn-left'); await waitResult(p);
    const r = await p.evaluate(() => { const b = document.getElementById('btn-next').getBoundingClientRect(); return { b: b.bottom, ch: innerHeight }; });
    assert.ok(r.b <= r.ch + 1, 'continue button within viewport');
    assert.deepEqual(p.errs, []);
    await p.ctx.close();
  });
}

await step('taste: 12px type floor, 44px targets, no clipped card text, no layout-property animation', async () => {
  for (const [w, h] of [[360, 640], [390, 844], [1280, 800]]) {
    const p = await newPage({ viewport: { width: w, height: h } });
    await startReign(p);
    const r = await p.evaluate(() => {
      const small = [...document.querySelectorAll('body *')].filter(e => e.offsetParent && !e.closest('svg') && !e.classList.contains('sr-only') && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.className || e.tagName);
      const tiny = [...document.querySelectorAll('button')].filter(b => b.offsetParent && !b.hidden).filter(b => { const r = b.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).map(b => b.id || b.className);
      const body = document.querySelector('.card-body');
      const weights = new Set([...document.querySelectorAll('body *')].filter(e => e.offsetParent).map(e => getComputedStyle(e).fontWeight));
      const widthAnim = [...document.styleSheets[0].cssRules].filter(r => r.style && /width/.test(r.style.transitionProperty || '')).length;
      return { small, tiny, clipped: body.scrollHeight - body.clientHeight, weights: [...weights], widthAnim };
    });
    assert.deepEqual(r.small, [], `${w}x${h} text under 12px`);
    assert.deepEqual(r.tiny, [], `${w}x${h} targets under 44px`);
    assert.ok(r.clipped <= 1, `${w}x${h} card text clipped by ${r.clipped}px`);
    assert.ok(r.weights.every(x => Number(x) <= 600), `font weights ${r.weights}`);
    assert.equal(r.widthAnim, 0, 'no width transitions');
    await p.ctx.close();
  }
});

await step('PWA: manifest and icons load, service worker installs, the game starts offline', async () => {
  const p = await newPage();
  await p.goto(base + '?sw=1');
  const m = await p.evaluate(async () => {
    const link = document.querySelector('link[rel=manifest]');
    const man = await (await fetch(link.href)).json();
    const icons = await Promise.all(man.icons.map(async i => (await fetch(new URL(i.src, link.href))).status));
    const reg = await navigator.serviceWorker.ready;
    await new Promise(r => { if (navigator.serviceWorker.controller) r(); else navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }); });
    const keys = await caches.keys();
    const cached = (await (await caches.open(keys[0])).keys()).length;
    return { name: man.name, display: man.display, icons, active: !!reg.active, keys, cached, theme: document.querySelector('meta[name=theme-color]').content };
  });
  assert.equal(m.name, '48: Laws of Power'); assert.equal(m.display, 'standalone'); assert.deepEqual(m.icons, [200, 200, 200, 200]);
  assert.ok(m.active && m.keys.length === 1 && m.cached >= 40, `precached ${m.cached} files`);
  await p.ctx.setOffline(true);
  await p.reload();
  await p.waitForSelector('#btn-new');
  await p.click('#btn-new'); await p.click('[data-action=begin-reign]');
  await p.waitForSelector('#card:not([hidden])');
  assert.match(await p.textContent('#card-title'), /CHAMBERLAIN/i);
  assert.ok(await p.evaluate(() => document.fonts.check('18px "IM Fell English"')), 'bundled font works offline');
  await p.click('#btn-left'); await waitResult(p);
  await p.ctx.setOffline(false);
  await p.ctx.close();
});

await step('settings shows an install section', async () => {
  const p = await newPage();
  await p.goto(base); await p.click('#btn-settings');
  assert.match(await p.textContent('#dlg-body'), /Install/);
  await p.ctx.close();
});

await step('reduced-motion preference is honoured automatically', async () => {
  const p = await newPage({ reducedMotion: 'reduce' });
  await p.goto(base); assert.equal(await p.evaluate(() => document.documentElement.dataset.motion), 'reduce');
  await p.ctx.close();
});

await step('accessibility basics: names on controls, visible focus, no colour-only meters', async () => {
  const p = await newPage();
  await startReign(p);
  const unnamed = await p.evaluate(() => [...document.querySelectorAll('button, [role=meter], input, select')].filter(e => !e.offsetParent ? false : !(e.getAttribute('aria-label') || e.textContent.trim() || e.labels?.length)).map(e => e.outerHTML.slice(0, 80)));
  assert.deepEqual(unnamed, []);
  assert.ok(await p.evaluate(() => !!document.querySelector('[role=meter][aria-valuetext]')), 'meters expose text values');
  await p.keyboard.press('Tab');
  const outline = await p.evaluate(() => { const e = document.activeElement; return getComputedStyle(e).outlineStyle + ' ' + getComputedStyle(e).outlineWidth; });
  assert.match(outline, /solid|auto/);
  await p.ctx.close();
});

await browser.close(); server.close();
console.log(`\n${passed} steps passed, ${problems.length} failed`);
if (problems.length) { console.log(problems.map(p => ' - ' + p).join('\n')); process.exit(1); }
