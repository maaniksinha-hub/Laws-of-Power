// HTML builders for panels (people, playbook, settings, ...) and the career summary. Pure functions of data.
import { ACHIEVEMENTS } from '../data/achievements.js';
import { CHARACTERS, CLUES, getSecret } from '../data/characters.js';
import { ENDINGS } from '../data/endings.js';
import { EVENT_LIST } from '../data/events.js';
import { LAWS, LAWS_SOURCE } from '../data/laws.js';
import { BACKGROUNDS, METERS, METER_INFO, RANKS } from '../data/world.js';
import { check, fillTokens } from './conditions.js';
import { attitude } from './characterEngine.js';
import { isBackgroundUnlocked } from './meta.js';
import { avatarSVG as portraitSVG } from './portraits.js';
import { objectiveView } from './objectives.js';
import { buildSummary } from './gameEngine.js';
import { relKey } from './state.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tag = (text, cls = '') => `<span class="tag ${cls}">${esc(text)}</span>`;
const nameOf = (state, id) => (id === 'isaura' && state?.secrets?.veiled_hand_identity ? CHARACTERS.isaura.realName : CHARACTERS[id].name);
const STATUS_LABEL = { court: 'At the company', dead: 'Left the company', exiled: 'Left the company', defected: 'Turned against you', imprisoned: 'Removed' };

export function meterIcon(key) { return `<svg aria-hidden="true"><use href="#i-${METER_INFO[key].icon}"/></svg>`; }

// ---------- dossier ----------
export function dossierHTML(state) {
  const met = Object.keys(CHARACTERS).filter(id => !CHARACTERS[id].generic && state.chars[id].met);
  if (!met.length) return '<p>You have not met anyone yet.</p>';
  return `<p>This is what you know about each person. Their secret goals stay hidden until you find them out.</p><div class="list">${met.map(id => dossierItem(state, id, met)).join('')}</div>`;
}

function dossierItem(state, id, met) {
  const def = CHARACTERS[id], c = state.chars[id];
  const att = attitude(state, id);
  const secrets = Object.keys(state.secrets).filter(sid => { const s = getSecret(sid); return s && s.kind !== 'agenda' && s.about?.includes(id); });
  const clues = (CLUES[id] || []).filter(cl => check(cl.when, state)).map(cl => cl.text);
  const rels = met.filter(o => o !== id).map(o => relLine(state, id, o)).filter(Boolean);
  const agenda = c.agendaKnown ? def.variants.find(v => v.id === c.variant)?.hidden : null;
  const secretLines = secrets.map(sid => `<li><b>${esc(getSecret(sid).title)}.</b> ${esc(fillTokens(getSecret(sid).text, state))}</li>`);
  const mem = c.memory.slice(-4).map(m => `<li>${esc(m.text)} <span class="sub">(week ${m.turn})</span></li>`);
  return `<article class="item char-row ${c.status !== 'court' ? 'gone' : ''}">
    <div class="pt">${portraitSVG(def.look, { label: nameOf(state, id) })}</div>
    <div>
      <h4>${esc(nameOf(state, id))}</h4>
      <div class="sub">${esc(id === 'isaura' && state.secrets.veiled_hand_identity ? def.realRole : c.role)}<br>${esc(def.archetype)}</div>
      <p>${tag(STATUS_LABEL[c.status], c.status === 'court' ? '' : 'bad')}${c.status === 'court' ? tag(att.label + (att.masked ? '' : ''), att.tone === 'good' ? 'good' : att.tone === 'bad' ? 'bad' : '') : ''}${c.agendaKnown ? tag('Secret goal known', 'gold') : ''}</p>
      <p><b>Says they want:</b> ${esc(def.publicGoal)}</p>
      ${agenda ? `<p><b>Secret goal:</b> ${esc(agenda)}</p>` : '<p><b>Secret goal:</b> Unknown.</p>'}
      ${clues.length ? `<h3>Clues</h3><ul class="plain">${clues.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${secretLines.length ? `<h3>Known facts</h3><ul class="plain">${secretLines.join('')}</ul>` : ''}
      ${rels.length ? `<h3>Links</h3><ul class="plain">${rels.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
      ${mem.length ? `<h3>Remembers</h3><ul class="plain">${mem.join('')}</ul>` : ''}
    </div></article>`;
}

function relLine(state, a, b) {
  const r = state.relations[relKey(a, b)];
  if (!r || !(r.public || r.allianceKnown)) return null;
  const n = CHARACTERS[b].short;
  if (r.alliance && r.allianceKnown) return `Secretly works with ${n}.`;
  if (r.rivalry >= 40) return `Rivals with ${n}.`;
  if (r.benefit >= 40 || r.obligation >= 40) return `Helps ${n} and gets help in return.`;
  if (r.trust >= 35) return `On good terms with ${n}.`;
  return null;
}

// ---------- chronicle ----------
export function chronicleHTML(state) {
  if (!state.history.length) return '<p>Nothing has happened yet.</p>';
  return `<div class="list">${[...state.history].reverse().map(h => `<article class="item"><div class="sub">Week <span class="num">${h.turn}</span></div><h4>${esc(h.title)}</h4><p><em>${esc(h.label)}.</em> ${esc(h.result)}</p></article>`).join('')}</div>`;
}

export function objectiveHTML(state, content) {
  const v = objectiveView(state, content.objectives);
  if (!v) return '<p>No secret goal.</p>';
  const status = { active: 'In progress', done: 'Done', failed: 'Failed' }[v.status];
  return `<p>Only you know this. Nobody at work knows your goal.</p><article class="item"><h4>${esc(v.title)}</h4><p>${esc(v.brief)}</p>${tag(status, v.status === 'done' ? 'good' : v.status === 'failed' ? 'bad' : 'gold')}${v.final ? tag('Checked at the end of the career') : ''}<ul class="plain">${v.steps.map(s => `<li>${s.done ? '&#10003; ' : '&#9675; '}${esc(s.label)}${s.done ? ' <span class="sub">(done now)</span>' : ''}</li>`).join('')}</ul></article>`;
}

// ---------- codex ----------
export const CODEX_TABS = [['laws', 'Laws'], ['characters', 'People'], ['stories', 'Stories'], ['endings', 'Endings'], ['achievements', 'Awards'], ['unlocks', 'New starts']];

export function codexHTML(meta, tab) {
  const tabs = `<div class="tabs" role="tablist" aria-label="Playbook sections">${CODEX_TABS.map(([k, l]) => `<button class="tab" role="tab" data-action="codex-tab" data-tab="${k}" aria-selected="${k === tab}" tabindex="${k === tab ? 0 : -1}">${l}</button>`).join('')}</div>`;
  return tabs + `<div role="tabpanel" class="list">${codexTab(meta, tab)}</div>`;
}

function codexTab(meta, tab) {
  if (tab === 'laws') {
    const found = LAWS.filter(l => meta.laws[l.id]).length;
    const head = `<p>${found} of 48 laws found. You learn each one only after a moment in the game shows it.</p>`;
    const cards = LAWS.map(l => {
      if (!meta.laws[l.id]) return `<article class="item locked"><h4>Law <span class="num">${l.n}</span></h4><p class="sub">Not found yet.</p></article>`;
      const seen = EVENT_LIST.filter(e => e.lesson?.law === l.n && meta.events[e.id]).map(e => e.title);
      return `<article class="item"><div class="sub">Law <span class="num">${l.n}</span>. Seen ${meta.laws[l.id].count} time${meta.laws[l.id].count > 1 ? "s" : ""}</div><h4>${esc(l.plain)}</h4>
        <p><b>The idea.</b> ${esc(l.principle)}</p><p><b>When it helps and when it hurts.</b> ${esc(l.risk)}</p><p><b>How to use it.</b> ${esc(l.application)}</p><p><b>If someone uses it on you.</b> ${esc(l.defense)}</p><p class="sub">Book title: ${esc(l.title)}</p>
        <div>${l.clusters.map(c => tag(c)).join('')}</div>${seen.length ? `<p class="sub">Seen in: ${esc(seen.join(', '))}</p>` : ''}</article>`;
    }).join('');
    const foot = `<p class="sub">${esc(LAWS_SOURCE.note)}</p>`;
    return head + cards + foot;
  }
  if (tab === 'characters') {
    const ids = Object.keys(CHARACTERS).filter(id => !CHARACTERS[id].generic);
    return ids.map(id => {
      const d = CHARACTERS[id];
      if (!meta.chars[id]) return `<article class="item locked"><h4>Unknown person</h4><p class="sub">Not yet met.</p></article>`;
      const texts = Object.keys(meta.agendaTexts[id] || {}).map(v => d.variants.find(x => x.id === v)?.hidden).filter(Boolean);
      return `<article class="item char-row"><div class="pt">${portraitSVG(d.look, { label: d.name })}</div><div><h4>${esc(meta.secrets.veiled_hand_identity && d.realName ? d.realName : d.name)}</h4><div class="sub">${esc(d.archetype)}</div><p>${esc(d.bio)}</p>${texts.length ? `<h3>Secret goals you found</h3><ul class="plain">${texts.map(t => `<li>${esc(t)}</li>`).join('')}</ul><p class="sub">Secret goals change from career to career. The same face is not always the same person.</p>` : '<p class="sub">No secret goal found yet.</p>'}</div></article>`;
    }).join('');
  }
  if (tab === 'stories') {
    const list = Object.entries(meta.stories);
    if (!list.length) return '<p>The big turning points of your careers will show here.</p>';
    return list.map(([id, s]) => `<article class="item"><div class="sub">Career ${s.reign}</div><h4>${esc(s.title)}</h4></article>`).join('');
  }
  if (tab === 'endings') {
    const found = ENDINGS.filter(e => meta.endings[e.id]).length;
    return `<p>${found} of ${ENDINGS.length} endings found.</p>` + ENDINGS.map(e => meta.endings[e.id]
      ? `<article class="item"><div class="sub">${esc({ triumph: 'Good ending', fall: 'Bad ending', neutral: 'Mixed ending' }[e.kind])}, reached ${meta.endings[e.id]} time${meta.endings[e.id] > 1 ? 's' : ''}</div><h4>${esc(e.title)}</h4><p><em>${esc(e.epitaph)}</em></p></article>`
      : `<article class="item locked"><h4>? ? ?</h4><p class="sub">An ending you have not reached yet.</p></article>`).join('');
  }
  if (tab === 'achievements') {
    return ACHIEVEMENTS.map(a => `<article class="item ${meta.achievements[a.id] ? '' : 'locked'}"><h4>${esc(a.title)} ${meta.achievements[a.id] ? tag('Earned', 'good') : ''}</h4><p>${esc(a.desc)}</p></article>`).join('');
  }
  if (tab === 'unlocks') {
    return BACKGROUNDS.map(b => { const ok = isBackgroundUnlocked(meta, b); return `<article class="item ${ok ? '' : 'locked'}"><h4>${esc(b.name)} ${ok ? tag('Available', 'good') : tag('Locked', 'bad')}</h4><p>${esc(b.desc)}</p>${ok ? '' : `<p class="sub">${esc(b.unlock.text)}</p>`}</article>`; }).join('');
  }
  return '';
}

// ---------- settings / menu / new career ----------
export function settingsHTML(settings, hasReign, pwa = {}) {
  return `
  <label class="field"><span>Sound effects<small>Small tones made by the game. Nothing plays until you act.</small></span><input class="switch" type="checkbox" data-setting="sound" ${settings.sound ? 'checked' : ''}></label>
  <label class="field"><span>Motion<small>Auto follows your phone's setting for less motion.</small></span>
    <select data-setting="motion" aria-label="Motion"><option value="auto" ${settings.motion === 'auto' ? 'selected' : ''}>Auto</option><option value="reduce" ${settings.motion === 'reduce' ? 'selected' : ''}>Less</option><option value="full" ${settings.motion === 'full' ? 'selected' : ''}>Full</option></select></label>
  <label class="field"><span>Show exact meter values<small>Off by default, so you go by feel and not by numbers.</small></span><input class="switch" type="checkbox" data-setting="showValues" ${settings.showValues ? 'checked' : ''}></label>
  <label class="field"><span>Show affected meters while dragging<small>Small dots show which meters a choice changes, but not by how much.</small></span><input class="switch" type="checkbox" data-setting="hintDots" ${settings.hintDots ? 'checked' : ''}></label>
  <label class="field"><span>Go full screen when a career starts<small>Hides the browser bars so only the game shows.</small></span><input class="switch" type="checkbox" data-setting="autoFullscreen" ${settings.autoFullscreen ? 'checked' : ''}></label>
  <label class="field"><span>Keep the screen on<small>Stops your phone from going to sleep while you play.</small></span><input class="switch" type="checkbox" data-setting="keepAwake" ${settings.keepAwake ? 'checked' : ''}></label>
  <label class="field"><span>Vibration<small>A small buzz when you choose, and a bigger one for big moments.</small></span><input class="switch" type="checkbox" data-setting="vibrate" ${settings.vibrate ? 'checked' : ''}></label>
  <label class="field"><span>Control hints<small>Shows swipe and key reminders under the card.</small></span><input class="switch" type="checkbox" data-setting="hints" ${settings.hints ? 'checked' : ''}></label>
  <h3>Install</h3>
  ${pwa.standalone ? '<p class="sub">You are playing the installed app.</p>' : pwa.canInstall ? '<button class="btn" data-action="install-app">Install app</button><p class="sub">Adds 48 to your home screen and works offline.</p>' : pwa.ios ? '<p class="sub">To install: tap Share, then Add to Home Screen.</p>' : '<p class="sub">To install, use your browser menu and choose Install app or Add to Home Screen. Once the game has loaded, it works without internet.</p>'}
  <h3>Your game</h3>
  ${hasReign ? '<button class="btn" data-action="restart-reign">Restart this career</button>' : ''}
  <button class="btn danger" data-action="erase-all">Erase all saved progress</button>
  <p class="sub">Your career, playbook, new starts and awards are saved only on this device.</p>`;
}

export function menuHTML() {
  return `<div class="menu-list">
    <button class="btn primary" data-action="resume">Resume career</button>
    <button class="btn" data-action="open-panel" data-panel="objective">View secret goal</button>
    <button class="btn" data-action="open-panel" data-panel="dossier">View people</button>
    <button class="btn" data-action="open-panel" data-panel="chronicle">View your choices</button>
    <button class="btn" data-action="open-panel" data-panel="codex">Open playbook</button>
    <button class="btn" data-action="open-panel" data-panel="settings">Open settings</button>
    <button class="btn" data-action="to-title">Save and go to the title</button>
    <button class="btn" data-action="toggle-fullscreen" id="fs-toggle">Go full screen</button>
    <button class="btn danger" data-action="exit-game">Exit game</button>
  </div>`;
}

export function newReignHTML(meta, selected) {
  return `<p>Choose how you start at the company. Your secret goal is picked for you. Each career, people at work get new secret goals too.</p>
  <div class="list" role="radiogroup" aria-label="Where you start">${BACKGROUNDS.map(b => {
    const ok = isBackgroundUnlocked(meta, b);
    return `<label class="bg-opt ${ok ? '' : 'locked'}"><input type="radio" name="bg" value="${b.id}" ${ok ? '' : 'disabled'} ${b.id === selected ? 'checked' : ''}><span><b>${esc(b.name)}</b> ${ok ? '' : tag('Locked', 'bad')}<p>${esc(b.desc)}</p>${ok ? '' : `<p class="sub">${esc(b.unlock.text)}</p>`}</span></label>`;
  }).join('')}</div>`;
}
export const newReignFoot = () => '<button class="btn primary wide" data-action="begin-reign">Begin the career</button>';

export function exitHTML() {
  return '<p>Your game is saved. You can close the app now.</p><p class="sub">If the app does not close, use your phone\'s home button or back gesture.</p>';
}
export const exitFoot = () => '<button class="btn wide" data-action="resume-from-exit">Go back to the game</button>';

// ---------- career summary ----------
export function summaryHTML(state, content, fresh = []) {
  const s = buildSummary(state, content);
  const e = s.ending;
  const name = id => esc(nameOf(state, id));
  const obj = s.objective;
  const objStatus = obj.status === 'done' ? 'Done' : 'Not done';
  const how = obj.steps.map(st => `${st.done ? '&#10003;' : '&#10007;'} ${esc(st.label)}`).join(' &nbsp; ');
  return `<div class="sum-inner">
    <header class="sum-hero"><div class="kind ${e.kind === 'fall' ? 'fall' : ''}" id="sum-kind">${esc({ triumph: 'A big win', fall: 'A fall', neutral: 'The end' }[e.kind])}</div>
      <h1 id="sum-title" tabindex="-1">${esc(e.title)}</h1><p class="epitaph">${esc(e.epitaph)}</p><p class="story">${esc(e.text)}</p></header>
    <div class="kv"><div><b>${s.turns}</b><span>Weeks you lasted</span></div><div><b>${esc(s.rank)}</b><span>Highest rank</span></div><div><b>${s.betrayals.length}</b><span>Betrayals</span></div><div><b>${s.secrets.length}</b><span>Secrets found</span></div></div>
    <div class="final-meters">${METERS.map(m => `<div><b>${s.meters[m]}</b>${esc(METER_INFO[m].label)}</div>`).join('')}</div>
    ${timelineHTML(state)}
    <section class="sum-sec"><h2>Your secret goal</h2><p><b>${esc(obj.title)}</b>: ${esc(obj.brief)} ${tag(objStatus, obj.status === 'done' ? 'good' : 'bad')}</p><p class="sub">${how}</p></section>
    ${s.majorDecisions.length ? `<section class="sum-sec"><h2>Choices that mattered</h2><ul class="plain">${s.majorDecisions.map(h => `<li><b>${esc(h.title)}</b> (week ${h.turn}): ${esc(h.label)}.</li>`).join('')}</ul></section>` : ''}
    <section class="sum-sec"><h2>Friends and enemies</h2><p>${s.allies.length ? 'Still at your side: ' + s.allies.map(name).join(', ') + '.' : 'Nobody was at your side at the end.'} ${s.enemies.length ? ' Against you: ' + s.enemies.map(name).join(', ') + '.' : ''} ${s.departed.length ? ' Gone from the company: ' + s.departed.map(d => `${name(d.id)} (${esc(STATUS_LABEL[d.status].toLowerCase())})`).join(', ') + '.' : ''}</p></section>
    ${s.betrayals.length ? `<section class="sum-sec"><h2>Betrayals</h2><ul class="plain">${s.betrayals.map(b => `<li>Week ${b.turn}: ${esc(b.text)}</li>`).join('')}</ul></section>` : ''}
    ${s.secrets.length ? `<section class="sum-sec"><h2>Secrets you found</h2><ul class="plain">${s.secrets.map(id => `<li>${esc(getSecret(id).title)}</li>`).join('')}</ul></section>` : ''}
    ${s.laws.length ? `<section class="sum-sec"><h2>Laws you met</h2><p>${s.laws.map(id => esc(LAWS.find(l => l.id === id).plain)).join('; ')}.</p><p class="sub">Open the playbook to read more.</p></section>` : ''}
    <section class="sum-sec"><h2>Your style</h2><p>${esc(s.style.text)}</p></section>
    ${fresh.length ? `<section class="sum-sec"><h2>New awards</h2>${fresh.map(a => `<div class="ach"><b>${esc(a.title)}</b>: ${esc(a.desc)}</div>`).join('')}</section>` : ''}
    <div class="sum-actions"><button class="btn primary" id="btn-sum-new">Begin another career</button><button class="btn" id="btn-sum-codex">Open the playbook</button><button class="btn" id="btn-sum-share">Share this career</button><button class="btn" id="btn-sum-title">Go to the title</button></div>
  </div>`;
}

// Meter history across the career. Line style (not only colour) distinguishes the four meters.
function timelineHTML(state) {
  const t = state.trace;
  if (!t || t.length < 2) return '';
  const W = 320, H = 110, x = i => 8 + (i * (W - 16)) / (t.length - 1), y = v => H - 8 - (v * (H - 16)) / 100;
  const styles = [['#d9b970', ''], ['#7aa1bd', '6 3'], ['#78a886', '2 3'], ['#c0564c', '10 3 2 3']];
  const lines = METERS.map((m, k) => `<polyline fill="none" stroke="${styles[k][0]}" stroke-width="2" stroke-dasharray="${styles[k][1]}" stroke-linejoin="round" points="${t.map((r, i) => `${x(i).toFixed(1)},${y(r[k + 1]).toFixed(1)}`).join(' ')}"/>`).join('');
  const legend = METERS.map((m, k) => `<span><svg width="26" height="8" aria-hidden="true"><line x1="0" y1="4" x2="26" y2="4" stroke="${styles[k][0]}" stroke-width="2" stroke-dasharray="${styles[k][1]}"/></svg>${esc(METER_INFO[m].label)}</span>`).join('');
  return `<section class="sum-sec"><h2>Your career in four lines</h2><svg class="timeline" viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart of your four meters over ${t.length} weeks"><rect x="8" y="${y(85)}" width="${W - 16}" height="${y(15) - y(85)}" fill="none" stroke="rgba(239,230,210,.14)" stroke-dasharray="2 4"/>${lines}</svg><div class="legend">${legend}</div></section>`;
}
export { RANKS };
