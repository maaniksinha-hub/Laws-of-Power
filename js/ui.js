// Rendering and interaction: screens, the swipeable card, result/debrief panel, dialogs, keyboard and touch input.
import { BACKGROUNDS, MAX_TURN, METERS, METER_INFO, RANKS, STYLES } from '../data/world.js';
import { ENDINGS } from '../data/endings.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { DEFAULT_CONTENT, advance, buildSummary, choose, continueReign, newReign } from './gameEngine.js';
import { choiceLabel, echoText, eventText, speaker } from './eventEngine.js';
import { expression } from './characterEngine.js';
import { finishReign, recordProgress, unlockedBackgrounds } from './meta.js';
import { objectiveView } from './objectives.js';
import { THEME_SCENE, portraitSVG } from './portraits.js';
import { play, setSoundEnabled } from './audio.js';
import { CHARACTERS } from '../data/characters.js';
import { buzz, canFullscreen, enterFullscreen, isFullscreen, keepAwake, leaveFullscreen, setVibration } from './immersive.js';
import { canInstall, isIOS, isStandalone, onInstallChange, promptInstall } from './pwa.js';
import { clearAll, clearReign, loadMeta, loadReign, loadSettings, saveMeta, saveReign, saveSettings } from './saveManager.js';
import { LAWS } from '../data/laws.js';
import { chronicleHTML, codexHTML, dossierHTML, esc, exitFoot, exitHTML, meterIcon, menuHTML, newReignFoot, newReignHTML, objectiveHTML, settingsHTML, summaryHTML } from './views.js';

const $ = id => document.getElementById(id);
export const app = { meta: null, settings: null, state: null, content: DEFAULT_CONTENT, busy: false, resultAt: 0, bg: null, codexTab: 'laws' };
const MAGNITUDE = d => (Math.abs(d) >= 10 ? 3 : Math.abs(d) >= 5 ? 2 : 1);
const reduced = () => document.documentElement.dataset.motion === 'reduce';
const resultVisible = () => !$('result').hidden;

// ------------------------------------------------------------------ boot
export function init() {
  app.settings = loadSettings();
  app.meta = loadMeta();
  applySettings();
  buildMeters();
  bindStatic();
  showTitle();
  app.debugShow = id => { app.state.current = { id }; app.state.pendingResult = null; app.state.ending = null; showScreen('game'); renderCard(app.content.events[id]); };
  globalThis.__lop = app; // handy for debugging and browser tests
}

function applySettings() {
  const s = app.settings;
  const prefers = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.dataset.motion = s.motion === 'auto' ? (prefers ? 'reduce' : 'full') : s.motion;
  setSoundEnabled(s.sound);
  setVibration(s.vibrate);
  keepAwake(s.keepAwake && !$('screen-game').hidden);
  $('hint').hidden = !s.hints;
  document.querySelectorAll('.meter-val').forEach(el => { el.hidden = !s.showValues; });
}
const setSetting = (k, v) => { app.settings[k] = v; saveSettings(app.settings); applySettings(); };

function showScreen(name) {
  for (const id of ['title', 'game', 'summary']) $(`screen-${id}`).hidden = id !== name;
  keepAwake(name === 'game' && app.settings.keepAwake);
}

// ------------------------------------------------------------------ title
function showTitle(notice = null) {
  showScreen('title');
  const { state, status } = loadReign(app.content);
  app.saved = state;
  $('btn-continue-reign').hidden = !state;
  if (state) $('btn-continue-reign').textContent = state.ending ? 'View last reign' : `Resume reign (turn ${state.turn})`;
  const msg = notice || ({ corrupt: 'We could not read your saved reign, so we set it aside. Your notebook is safe.', outdated: 'Your saved reign is from another version of the game, so it could not open. Your notebook is safe.' })[status];
  $('title-notice').hidden = !msg; $('title-notice').textContent = msg || '';
  const m = app.meta;
  $('title-stats').textContent = m.reigns ? `${m.reigns} reign${m.reigns > 1 ? 's' : ''} lived. ${Object.keys(m.endings).length} of ${ENDINGS.length} endings found, ${Object.keys(m.laws).length} of 48 laws discovered.` : 'You have not played yet.';
  const d = m.daily?.[todayKey()];
  $('btn-daily').textContent = d ? "Replay today's court" : "Play today's court";
  $('btn-new').focus({ preventScroll: true });
}

function bindStatic() {
  $('btn-new').onclick = onNewReign;
  $('btn-daily').onclick = startDaily;
  $('btn-exit').onclick = exitGame;
  $('btn-continue-reign').onclick = resumeSaved;
  $('btn-codex').onclick = () => openPanel('codex');
  $('btn-settings').onclick = () => openPanel('settings');
  $('btn-menu').onclick = () => openPanel('menu');
  $('btn-dossier').onclick = () => openPanel('dossier');
  $('btn-chronicle').onclick = () => openPanel('chronicle');
  $('objective-btn').onclick = () => openPanel('objective');
  $('btn-left').onclick = () => pick('left');
  $('btn-right').onclick = () => pick('right');
  $('btn-next').onclick = next;
  $('dlg-close').onclick = closePanel;
  $('dlg-back').onclick = backPanel;
  $('dlg').addEventListener('close', () => { panelStack = []; });
  $('dlg').addEventListener('click', e => { if (e.target === $('dlg')) closePanel(); });
  $('dlg-body').addEventListener('click', onPanelClick);
  $('dlg-foot').addEventListener('click', onPanelClick);
  $('dlg-body').addEventListener('change', onPanelChange);
  $('dlg-body').addEventListener('keydown', onPanelKey);
  document.addEventListener('keydown', onKey);
  onInstallChange(() => { if ($('dlg').open && panelStack[panelStack.length - 1] === 'settings') openPanel('settings', { push: false }); });
  bindCardDrag();
}

// Web apps cannot always close themselves. Save, leave full screen, try to close, then show a clear goodbye.
async function exitGame() {
  if (app.state) saveReign(app.state);
  saveMeta(app.meta);
  keepAwake(false);
  await leaveFullscreen();
  try { globalThis.close(); } catch { /* not allowed in a normal tab */ }
  setTimeout(() => { if (!$('dlg').open) openPanel('exit', { push: false }); }, 250);
}

async function onNewReign() {
  if (app.saved && !app.saved.ending) {
    const ok = await confirmDialog({ title: 'Start a new reign?', text: 'Your reign is not finished. If you start a new one, this one ends with no ending. Your notebook and awards stay.', ok: 'Give up and start new' });
    if (!ok) return;
  }
  openPanel('newreign');
}

function goImmersive() { if (app.settings.autoFullscreen && !isStandalone()) enterFullscreen(); }

function resumeSaved() {
  goImmersive();
  app.state = app.saved;
  showScreen('game');
  if (app.state.ending && !app.state.pendingResult) return showSummary();
  renderGame();
}

const todayKey = () => new Date().toISOString().slice(0, 10);
async function startDaily() {
  if (app.saved && !app.saved.ending) {
    const ok = await confirmDialog({ title: "Play today's court?", text: 'Your reign is not finished. If you start a new one, this one ends with no ending.', ok: 'Give up and play' });
    if (!ok) return;
  }
  startReign('minor_noble', { seed: `daily-${todayKey()}`, daily: todayKey() });
}

function startReign(bgId, { seed = null, daily = null } = {}) {
  goImmersive();
  const qs = new URLSearchParams(globalThis.location?.search || '');
  app.state = newReign(app.meta, { background: bgId, seed: seed ?? qs.get('seed') ?? null, objective: qs.get('objective') });
  if (daily) app.state.daily = daily;
  app.bg = bgId;
  clearReign();
  advance(app.state, app.content);
  saveReign(app.state);
  recordProgress(app.meta, app.state); saveMeta(app.meta);
  showScreen('game');
  renderGame();
}

// ------------------------------------------------------------------ meters
function buildMeters() {
  $('meters').innerHTML = METERS.map(m => `<div class="meter" data-key="${m}" role="meter" aria-valuemin="0" aria-valuemax="100" aria-label="${METER_INFO[m].label}">
    <div class="meter-top">${meterIcon(m)}<span class="meter-label">${METER_INFO[m].label}</span></div>
    <div class="meter-bar" aria-hidden="true"><div class="meter-fill"></div></div>
    <span class="meter-flag" aria-hidden="true"></span><span class="meter-val" hidden></span><span class="meter-delta" aria-hidden="true"></span></div>`).join('');
}
const statusWord = v => (v <= 15 ? 'critically low' : v <= 35 ? 'low' : v >= 85 ? 'critically high' : v >= 65 ? 'high' : 'steady');

function updateMeters(changes = null) {
  const s = app.state;
  $('vignette').classList.toggle('on', METERS.some(m => s.meters[m] <= 15 || s.meters[m] >= 85));
  for (const m of METERS) {
    const el = $('meters').querySelector(`[data-key="${m}"]`);
    const v = s.meters[m];
    el.querySelector('.meter-fill').style.transform = `scaleX(${v / 100})`;
    const crit = v <= 15 || v >= 85;
    el.classList.toggle('critical', crit);
    el.classList.toggle('low', v <= 15); el.classList.toggle('high', v >= 85);
    el.querySelector('.meter-flag').textContent = crit ? (v <= 15 ? '▼ LOW' : '▲ HIGH') : ' ';
    el.querySelector('.meter-val').textContent = v;
    el.setAttribute('aria-valuenow', v);
    el.setAttribute('aria-valuetext', statusWord(v));
    const d = changes?.[m];
    if (d) {
      const arrows = (d > 0 ? '▲' : '▼').repeat(MAGNITUDE(d));
      el.querySelector('.meter-delta').textContent = arrows;
      el.classList.remove('up', 'down'); void el.offsetWidth;
      el.classList.add(d > 0 ? 'up' : 'down');
      setTimeout(() => el.classList.remove('up', 'down'), 1100);
    }
  }
}

// ------------------------------------------------------------------ game screen
function renderGame() {
  const s = app.state;
  updateMeters();
  updateHeader();
  if (s.pendingResult) { showResult(s.pendingResult, { restored: true }); return; }
  if (s.ending) return showSummary();
  if (!s.current) advance(s, app.content);
  renderCard(app.content.events[s.current.id]);
}

function updateHeader() {
  const s = app.state;
  $('reign-info').innerHTML = `<b>${RANKS[s.rank].title}</b><br>Reign ${s.reignId}, turn ${Math.min(s.turn, MAX_TURN)} of ${MAX_TURN}`;
  const o = objectiveView(s, app.content.objectives);
  $('objective-btn').innerHTML = o ? `<span class="obj-k">Secret goal</span><span class="obj-t">${esc(o.brief)}</span><span class="pips" aria-label="${o.steps.filter(x => x.done).length} of ${o.steps.length} steps met">${o.steps.map(x => `<i class="pip ${x.done ? 'on' : ''}"></i>`).join('')}</span>` : '';
  $('objective-btn').setAttribute('aria-label', o ? `Secret goal: ${o.brief}. ${o.steps.filter(x => x.done).length} of ${o.steps.length} steps met.` : 'Objective');
  const touch = globalThis.matchMedia?.('(pointer: coarse)').matches;
  $('hint').textContent = touch ? 'Swipe the card left or right, or tap a choice' : 'Drag the card, click a choice, or press ← → / A D';
}

function renderCard(ev) {
  const s = app.state;
  const sp = speaker(s, ev);
  const others = (ev.others || []).filter(id => !CHARACTERS[id].generic);
  const scene = ev.scene || THEME_SCENE[ev.theme];
  $('card-portrait').innerHTML = portraitSVG(sp.look, { label: sp.name, scene, expression: expression(s, sp.id) }) + (others.length ? `<div class="others" aria-hidden="true">${others.map(id => `<span>${portraitSVG(CHARACTERS[id].look, { expression: expression(s, id) })}</span>`).join('')}</div>` : '');
  const echo = echoText(s, ev);
  $('card-echo').hidden = !echo; $('card-echo').textContent = echo;
  app.dots = { left: Object.keys(ev.left.fx?.m || {}), right: Object.keys(ev.right.fx?.m || {}) };
  $('card-title').textContent = ev.title;
  $('card-name').textContent = sp.name;
  $('card-role').textContent = sp.role;
  $('card-text').textContent = eventText(s, ev);
  const l = choiceLabel(s, ev, 'left'), r = choiceLabel(s, ev, 'right');
  $('label-left').textContent = l; $('label-right').textContent = r;
  $('tag-left').textContent = l; $('tag-right').textContent = r;
  $('btn-left').setAttribute('aria-label', `Choose left: ${l}`); $('btn-right').setAttribute('aria-label', `Choose right: ${r}`);
  $('sr-live').textContent = `${ev.title}. ${sp.name}, ${sp.role}. ${eventText(s, ev)} Left: ${l}. Right: ${r}.`;

  $('result').hidden = true; $('card').hidden = false;
  for (const id of ['btn-left', 'btn-right']) { $(id).hidden = false; $(id).disabled = false; $(id).classList.remove('preview'); }
  $('btn-next').hidden = true;
  const c = $('card'); c.style.transform = ''; c.style.opacity = ''; setTags(0);
  if (!reduced()) c.animate([{ opacity: 0, transform: 'translateY(26px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.16, 1, .3, 1)' });
  app.busy = false;
  c.focus({ preventScroll: true });
}

function setTags(dx) {
  const a = Math.min(Math.abs(dx) / 90, 1);
  showHintDots(Math.abs(dx) > 24 ? (dx < 0 ? 'left' : 'right') : null);
  $('tag-left').style.opacity = dx < 0 ? a : 0; $('tag-right').style.opacity = dx > 0 ? a : 0;
  $('btn-left').classList.toggle('preview', dx < -30); $('btn-right').classList.toggle('preview', dx > 30);
}

// Which meters a choice touches (not by how much, and not counting later consequences).
function showHintDots(side) {
  const keys = side && app.settings.hintDots ? (app.dots?.[side] || []).map(k => ({ auth: 'authority', rep: 'reputation', loy: 'loyalty', res: 'resources' }[k] || k)) : [];
  document.querySelectorAll('.meter').forEach(el => el.classList.toggle('hinted', keys.includes(el.dataset.key)));
}

// ---- drag & swipe
function bindCardDrag() {
  const card = $('card');
  let d = null;
  card.addEventListener('pointerdown', e => {
    if (app.busy || resultVisible() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    d = { x: e.clientX, id: e.pointerId, dx: 0, t: performance.now() };
    card.setPointerCapture(e.pointerId); card.classList.add('dragging');
  });
  card.addEventListener('pointermove', e => {
    if (!d || e.pointerId !== d.id) return;
    d.dx = e.clientX - d.x;
    card.style.transform = `translateX(${d.dx}px) rotate(${d.dx / 16}deg)`;
    setTags(d.dx);
  });
  const end = e => {
    if (!d || e.pointerId !== d.id) return;
    const { dx, t } = d; d = null;
    card.classList.remove('dragging');
    const v = Math.abs(dx) / Math.max(performance.now() - t, 1);
    const far = Math.abs(dx) > Math.min(110, card.offsetWidth * 0.28) || (Math.abs(dx) > 50 && v > 0.6);
    if (e.type !== 'pointercancel' && far) pick(dx < 0 ? 'left' : 'right', dx);
    else {
      setTags(0);
      if (reduced()) card.style.transform = '';
      else card.animate([{ transform: card.style.transform }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.16, 1, .3, 1)' }).onfinish = () => { card.style.transform = ''; };
    }
  };
  card.addEventListener('pointerup', end);
  card.addEventListener('pointercancel', end);
}

// ---- choosing
async function pick(side, fromDx = 0) {
  const s = app.state;
  if (app.busy || !s?.current || s.pendingResult || resultVisible()) return;
  app.busy = true;
  $('btn-left').disabled = $('btn-right').disabled = true;
  play('choose'); buzz(10);
  const result = choose(s, side, app.content);
  if (!result) { app.busy = false; return; }
  saveReign(s);
  recordProgress(app.meta, s); saveMeta(app.meta);
  await flyOut(side, fromDx);
  showResult(result);
}

function flyOut(side, fromDx) {
  const card = $('card'), sign = side === 'left' ? -1 : 1;
  setTags(sign * 100);
  if (reduced()) return new Promise(r => setTimeout(r, 120));
  const from = fromDx ? card.style.transform : 'none';
  return card.animate([{ transform: from, opacity: 1 }, { transform: `translateX(${sign * 140}%) rotate(${sign * 18}deg)`, opacity: 0 }], { duration: 200, easing: 'cubic-bezier(.7, 0, .84, 0)', fill: 'forwards' }).finished.catch(() => {});
}

// ------------------------------------------------------------------ result / debrief
function showResult(r, { restored = false } = {}) {
  const s = app.state;
  $('card').hidden = true; $('card').getAnimations().forEach(a => a.cancel());
  showHintDots(null);
  $('btn-left').hidden = $('btn-right').hidden = true;
  const chips = METERS.filter(m => r.changes[m]).map(m => {
    const d = r.changes[m], n = MAGNITUDE(d);
    const word = `${METER_INFO[m].label} ${d > 0 ? 'rose' : 'fell'}${n === 1 ? ' slightly' : n === 3 ? ' sharply' : ''}`;
    return `<li class="chip ${d > 0 ? 'up' : 'down'}" aria-label="${word}">${meterIcon(m)}<span>${METER_INFO[m].label}</span><span class="amt" aria-hidden="true">${(d > 0 ? '▲' : '▼').repeat(n)}</span></li>`;
  }).join('');
  const KIND = { secret: 'Secret', betrayal: 'Betrayal', status: 'Court', warning: 'Warning', rank: 'Rank', info: 'Note', alliance: 'Plot' };
  const notes = (r.notes || []).map(n => `<li class="note ${n.kind}">${n.kind === 'secret' ? '<i class="seal" aria-hidden="true"></i>' : ''}<b>${KIND[n.kind] || 'Note'}</b>${esc(n.text)}</li>`).join('');
  const lesson = r.lesson ? `<details class="lesson" open><summary>Law <span class="num">${r.lesson.n}</span>: ${esc(r.lesson.title)}</summary><div class="lesson-body"><p>${esc(r.lesson.text)}</p><p class="watch"><b>If it were used on you</b>${esc(r.lesson.defense)}</p></div></details>` : '';
  const end = r.ending ? app.content.endings.find(e => e.id === r.ending) : null;
  $('result').innerHTML = `<p class="result-kicker">${esc(r.title)}</p><p class="result-choice">${esc(r.label)}</p><p class="result-text">${esc(r.text)}</p>
    ${chips ? `<ul class="chips" aria-label="Changes">${chips}</ul>` : ''}${notes ? `<ul class="notes">${notes}</ul>` : ''}${lesson}
    ${end ? `<p class="result-kicker">Your reign has reached its end</p>` : ''}`;
  $('result').hidden = false; $('result').scrollTop = 0;
  $('btn-next').hidden = false;
  $('btn-next').textContent = r.ending ? 'See what became of you' : 'Draw the next card';
  app.busy = false; app.resultAt = performance.now();
  updateMeters(restored ? null : r.changes);
  updateHeader();
  $('btn-next').focus({ preventScroll: true });
  $('sr-live').textContent = `${r.text} ${(r.notes || []).map(n => n.text).join(' ')}`;
  if (!restored) {
    const kinds = new Set((r.notes || []).map(n => n.kind));
    if (kinds.has('betrayal') && !reduced()) { $('stage').classList.remove('shake'); void $('stage').offsetWidth; $('stage').classList.add('shake'); }
    if (r.ending) buzz([40, 60, 40, 60]); else if (kinds.has('betrayal')) buzz([30, 40, 30]); else if (kinds.has('secret')) buzz(20);
    if (r.ending) play('ending');
    else if (kinds.has('betrayal')) play('betrayal');
    else if (kinds.has('secret') || r.secrets?.length) play('secret');
    else if (kinds.has('warning')) play('critical');
  }
}

function next() {
  if (app.busy || !resultVisible() || performance.now() - app.resultAt < 250) return;
  const s = app.state;
  const ev = continueReign(s, app.content);
  saveReign(s);
  if (!ev) return showSummary();
  updateHeader();
  renderCard(ev);
}

// ------------------------------------------------------------------ summary
function showSummary() {
  const s = app.state;
  let firstTime = false;
  if (!s.ending.recorded) {
    const fresh = finishReign(app.meta, s, s.ending.id);
    s.ending.recorded = true; s.ending.fresh = fresh.map(a => a.id);
    if (s.daily) app.meta.daily[s.daily] = s.ending.id;
    saveMeta(app.meta); saveReign(s); firstTime = true;
  }
  const fresh = (s.ending.fresh || []).map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
  showScreen('summary');
  const el = $('screen-summary');
  el.innerHTML = summaryHTML(s, app.content, fresh);
  el.className = `screen summary kind-${app.content.endings.find(e => e.id === s.ending.id)?.kind || 'neutral'}`;
  el.scrollTop = 0;
  $('btn-sum-new').onclick = () => { clearReign(); app.saved = null; openPanel('newreign'); };
  $('btn-sum-codex').onclick = () => openPanel('codex');
  $('btn-sum-share').onclick = shareResult;
  $('btn-sum-title').onclick = () => { clearReign(); showTitle(); };
  $('sum-title').focus({ preventScroll: true });
  if (firstTime) play('ending');
}

async function shareResult() {
  const s = app.state, sum = buildSummary(s, app.content);
  const text = `48: Laws of Power. ${sum.ending.title}. ${sum.turns} turns as ${sum.rank}, ${sum.style.top ? STYLES[sum.style.top].label.toLowerCase() : 'unreadable'} style, secret goal ${sum.objective.status === 'done' ? 'done' : 'missed'}.${s.daily ? ` Today's court (${s.daily}).` : ''}`;
  const btn = $('btn-sum-share');
  try {
    if (navigator.share) await navigator.share({ text });
    else { await navigator.clipboard.writeText(text); btn.textContent = 'Copied to clipboard'; setTimeout(() => { btn.textContent = 'Share this reign'; }, 1800); }
  } catch { btn.textContent = text; }
}

// ------------------------------------------------------------------ keyboard
function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  if (document.querySelector('dialog[open]') || $('screen-game').hidden) return;
  const k = e.key;
  const left = k === 'ArrowLeft' || k === 'a' || k === 'A', right = k === 'ArrowRight' || k === 'd' || k === 'D';
  if (resultVisible()) {
    if (left || right || ((k === 'Enter' || k === ' ') && e.target.tagName !== 'BUTTON')) { e.preventDefault(); next(); }
    return;
  }
  if (left) { e.preventDefault(); pick('left'); }
  else if (right) { e.preventDefault(); pick('right'); }
  else if (k === 'Escape') openPanel('menu');
}

// ------------------------------------------------------------------ panels
let panelStack = [];
const PANELS = {
  menu: { title: 'Paused', render: () => menuHTML() },
  dossier: { title: 'People at Court', render: () => (app.state ? dossierHTML(app.state) : '<p>Start a reign to meet people.</p>') },
  chronicle: { title: 'Your Choices', render: () => chronicleHTML(app.state) },
  objective: { title: 'Secret Goal', render: () => objectiveHTML(app.state, app.content) },
  codex: { title: 'Notebook', render: () => codexHTML(app.meta, app.codexTab) },
  settings: { title: 'Settings', render: () => settingsHTML(app.settings, !!app.state && !app.state.ending && !$('screen-game').hidden, { canInstall: canInstall(), standalone: isStandalone(), ios: isIOS() }) },
  newreign: { title: 'A New Reign', render: () => newReignHTML(app.meta, app.bg && unlockedBackgrounds(app.meta).some(b => b.id === app.bg) ? app.bg : BACKGROUNDS[0].id), foot: newReignFoot },
  exit: { title: 'See you soon', render: exitHTML, foot: exitFoot },
};

function openPanel(name, { push = true } = {}) {
  const p = PANELS[name];
  if (!p) return;
  if (push) panelStack.push(name); 
  $('dlg-title').textContent = p.title;
  $('dlg-body').innerHTML = p.render();
  $('dlg-foot').hidden = !p.foot; $('dlg-foot').innerHTML = p.foot ? p.foot() : '';
  const fs = $('dlg-body').querySelector('#fs-toggle'); if (fs) { fs.hidden = !canFullscreen(); fs.textContent = isFullscreen() ? 'Leave full screen' : 'Go full screen'; }
  $('dlg-back').hidden = panelStack.length < 2;
  if (!$('dlg').open) $('dlg').showModal();
  $('dlg-body').scrollTop = 0;
}
function backPanel() { panelStack.pop(); const name = panelStack[panelStack.length - 1]; if (name) openPanel(name, { push: false }); else closePanel(); }
function closePanel() { $('dlg').close(); }

async function onPanelClick(e) {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'resume') closePanel();
  else if (a === 'open-panel') openPanel(t.dataset.panel);
  else if (a === 'codex-tab') { app.codexTab = t.dataset.tab; openPanel('codex', { push: false }); $('dlg-body').querySelector('[aria-selected="true"]')?.focus(); }
  else if (a === 'install-app') { await promptInstall(); if ($('dlg').open && panelStack[panelStack.length - 1] === 'settings') openPanel('settings', { push: false }); }
  else if (a === 'toggle-fullscreen') { if (isFullscreen()) await leaveFullscreen(); else await enterFullscreen(); openPanel('menu', { push: false }); }
  else if (a === 'exit-game') { closePanel(); exitGame(); }
  else if (a === 'resume-from-exit') closePanel();
  else if (a === 'to-title') { closePanel(); showTitle(); }
  else if (a === 'begin-reign') { const sel = $('dlg-body').querySelector('input[name="bg"]:checked'); closePanel(); startReign(sel ? sel.value : BACKGROUNDS[0].id); }
  else if (a === 'restart-reign') {
    if (await confirmDialog({ title: 'Restart this reign?', text: 'This reign will end with no ending. A new one will start with the same background.', ok: 'Restart reign' })) { closePanel(); startReign(app.state.background); }
  } else if (a === 'erase-all') {
    if (await confirmDialog({ title: 'Erase everything?', text: 'This deletes your reign, notebook, awards and new starts from this device for good. You cannot undo it.', ok: 'Erase all progress' })) {
      clearAll(); app.meta = loadMeta(); app.settings = loadSettings(); app.state = null; applySettings(); closePanel(); showTitle('Everything you saved was erased.');
    }
  }
}
function onPanelKey(e) {
  const t = e.target.closest('[role=tab]');
  if (!t || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  const tabs = [...$('dlg-body').querySelectorAll('[role=tab]')];
  const i = tabs.indexOf(t);
  const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  e.preventDefault(); app.codexTab = tabs[n].dataset.tab; openPanel('codex', { push: false }); $('dlg-body').querySelector('[aria-selected="true"]')?.focus();
}
function onPanelChange(e) {
  const t = e.target.closest('[data-setting]');
  if (!t) return;
  setSetting(t.dataset.setting, t.type === 'checkbox' ? t.checked : t.value);
}

function confirmDialog({ title, text, ok }) {
  return new Promise(resolve => {
    const d = $('dlg-confirm');
    $('confirm-title').textContent = title; $('confirm-text').textContent = text; $('confirm-ok').textContent = ok;
    d.returnValue = 'cancel';
    d.addEventListener('close', () => resolve(d.returnValue === 'ok'), { once: true });
    d.showModal();
  });
}
