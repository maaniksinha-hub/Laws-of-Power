// HTML builders for panels (dossier, codex, settings, ...) and the reign summary. Pure functions of data.
import { ACHIEVEMENTS } from '../data/achievements.js';
import { CHARACTERS, CLUES, getSecret } from '../data/characters.js';
import { ENDINGS } from '../data/endings.js';
import { EVENT_LIST } from '../data/events.js';
import { LAWS, LAWS_SOURCE } from '../data/laws.js';
import { BACKGROUNDS, METERS, METER_INFO, RANKS } from '../data/world.js';
import { check, fillTokens } from './conditions.js';
import { attitude } from './characterEngine.js';
import { isBackgroundUnlocked } from './meta.js';
import { portraitSVG } from './portraits.js';
import { objectiveView } from './objectives.js';
import { buildSummary } from './gameEngine.js';
import { relKey } from './state.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tag = (text, cls = '') => `<span class="tag ${cls}">${esc(text)}</span>`;
const nameOf = (state, id) => (id === 'isaura' && state?.secrets?.veiled_hand_identity ? CHARACTERS.isaura.realName : CHARACTERS[id].name);
const STATUS_LABEL = { court: 'At court', dead: 'Dead', exiled: 'Exiled', defected: 'Turned against you', imprisoned: 'Imprisoned' };

export function meterIcon(key) { return `<svg aria-hidden="true"><use href="#i-${METER_INFO[key].icon}"/></svg>`; }

// ---------- dossier ----------
export function dossierHTML(state) {
  const met = Object.keys(CHARACTERS).filter(id => !CHARACTERS[id].generic && state.chars[id].met);
  if (!met.length) return '<p>You have not met anyone worth recording yet.</p>';
  return `<p>What you know, and what you only think you know. Their private motives stay hidden until you uncover them.</p><div class="list">${met.map(id => dossierItem(state, id, met)).join('')}</div>`;
}

function dossierItem(state, id, met) {
  const def = CHARACTERS[id], c = state.chars[id];
  const att = attitude(state, id);
  const secrets = Object.keys(state.secrets).filter(sid => { const s = getSecret(sid); return s && s.kind !== 'agenda' && s.about?.includes(id); });
  const clues = (CLUES[id] || []).filter(cl => check(cl.when, state)).map(cl => cl.text);
  const rels = met.filter(o => o !== id).map(o => relLine(state, id, o)).filter(Boolean);
  const agenda = c.agendaKnown ? def.variants.find(v => v.id === c.variant)?.hidden : null;
  const secretLines = secrets.map(sid => `<li><b>${esc(getSecret(sid).title)}.</b> ${esc(fillTokens(getSecret(sid).text, state))}</li>`);
  const mem = c.memory.slice(-4).map(m => `<li>${esc(m.text)} <span class="sub">(turn ${m.turn})</span></li>`);
  return `<article class="item char-row ${c.status !== 'court' ? 'gone' : ''}">
    <div class="pt">${portraitSVG(def.look, { label: nameOf(state, id) })}</div>
    <div>
      <h4>${esc(nameOf(state, id))}</h4>
      <div class="sub">${esc(id === 'isaura' && state.secrets.veiled_hand_identity ? def.realRole : c.role)} &middot; ${esc(def.archetype)}</div>
      <p>${tag(STATUS_LABEL[c.status], c.status === 'court' ? '' : 'bad')}${c.status === 'court' ? tag(att.label + (att.masked ? '' : ''), att.tone === 'good' ? 'good' : att.tone === 'bad' ? 'bad' : '') : ''}${c.agendaKnown ? tag('Agenda known', 'gold') : ''}</p>
      <p><b>Stated aim:</b> ${esc(def.publicGoal)}</p>
      ${agenda ? `<p><b>Hidden aim:</b> ${esc(agenda)}</p>` : '<p><b>Hidden aim:</b> Unknown.</p>'}
      ${clues.length ? `<h3>Clues</h3><ul class="plain">${clues.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${secretLines.length ? `<h3>Known facts</h3><ul class="plain">${secretLines.join('')}</ul>` : ''}
      ${rels.length ? `<h3>Ties</h3><ul class="plain">${rels.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
      ${mem.length ? `<h3>Remembers</h3><ul class="plain">${mem.join('')}</ul>` : ''}
    </div></article>`;
}

function relLine(state, a, b) {
  const r = state.relations[relKey(a, b)];
  if (!r || !(r.public || r.allianceKnown)) return null;
  const n = CHARACTERS[b].short;
  if (r.alliance && r.allianceKnown) return `Secretly allied with ${n}.`;
  if (r.rivalry >= 40) return `Rivals with ${n}.`;
  if (r.benefit >= 40 || r.obligation >= 40) return `Bound to ${n} by mutual interest.`;
  if (r.trust >= 35) return `On good terms with ${n}.`;
  return null;
}

// ---------- chronicle ----------
export function chronicleHTML(state) {
  if (!state.history.length) return '<p>Nothing has happened yet.</p>';
  return `<div class="list">${[...state.history].reverse().map(h => `<article class="item"><div class="sub">Turn ${h.turn} &middot; ${esc(h.theme || '')}</div><h4>${esc(h.title)}</h4><p><em>${esc(h.label)}.</em> ${esc(h.result)}</p></article>`).join('')}</div>`;
}

export function objectiveHTML(state, content) {
  const v = objectiveView(state, content.objectives);
  if (!v) return '<p>No objective.</p>';
  const status = { active: 'In progress', done: 'Achieved', failed: 'Failed' }[v.status];
  return `<p>Only you know this. Nobody at court has been told, and nobody should guess.</p><article class="item"><h4>${esc(v.title)}</h4><p>${esc(v.brief)}</p>${tag(status, v.status === 'done' ? 'good' : v.status === 'failed' ? 'bad' : 'gold')}${v.final ? tag('Judged at the end of the reign') : ''}<ul class="plain">${v.steps.map(s => `<li>${s.done ? '&#10003; ' : '&#9675; '}${esc(s.label)}${s.done ? ' <span class="sub">(done now)</span>' : ''}</li>`).join('')}</ul></article>`;
}

// ---------- codex ----------
export const CODEX_TABS = [['laws', 'Laws'], ['characters', 'Characters'], ['stories', 'Stories'], ['endings', 'Endings'], ['achievements', 'Achievements'], ['unlocks', 'Unlocks']];

export function codexHTML(meta, tab) {
  const tabs = `<div class="tabs" role="tablist" aria-label="Codex sections">${CODEX_TABS.map(([k, l]) => `<button class="tab" role="tab" data-action="codex-tab" data-tab="${k}" aria-selected="${k === tab}">${l}</button>`).join('')}</div>`;
  return tabs + `<div role="tabpanel" class="list">${codexTab(meta, tab)}</div>`;
}

function codexTab(meta, tab) {
  if (tab === 'laws') {
    const found = LAWS.filter(l => meta.laws[l.id]).length;
    const head = `<p>${found} of 48 laws discovered. Each is revealed by living through a situation that shows it, never before.</p>`;
    const cards = LAWS.map(l => {
      if (!meta.laws[l.id]) return `<article class="item locked"><h4>Law ${l.n}</h4><p class="sub">Not yet discovered.</p></article>`;
      const seen = EVENT_LIST.filter(e => e.lesson?.law === l.n && meta.events[e.id]).map(e => e.title);
      return `<article class="item"><div class="sub">Law ${l.n} &middot; met ${meta.laws[l.id].count}&times;</div><h4>${esc(l.title)}</h4>
        <p><b>Principle.</b> ${esc(l.principle)}</p><p><b>Useful when / failure mode.</b> ${esc(l.risk)}</p><p><b>In practice.</b> ${esc(l.application)}</p><p><b>Spotting it used on you.</b> ${esc(l.defense)}</p>
        <div>${l.clusters.map(c => tag(c)).join('')}</div>${seen.length ? `<p class="sub">Seen in: ${esc(seen.join(', '))}</p>` : ''}</article>`;
    }).join('');
    const foot = `<p class="sub">${esc(LAWS_SOURCE.note)}</p>`;
    return head + cards + foot;
  }
  if (tab === 'characters') {
    const ids = Object.keys(CHARACTERS).filter(id => !CHARACTERS[id].generic);
    return ids.map(id => {
      const d = CHARACTERS[id];
      if (!meta.chars[id]) return `<article class="item locked"><h4>Unknown figure</h4><p class="sub">Not yet met.</p></article>`;
      const texts = Object.keys(meta.agendaTexts[id] || {}).map(v => d.variants.find(x => x.id === v)?.hidden).filter(Boolean);
      return `<article class="item char-row"><div class="pt">${portraitSVG(d.look, { label: d.name })}</div><div><h4>${esc(meta.secrets.veiled_hand_identity && d.realName ? d.realName : d.name)}</h4><div class="sub">${esc(d.archetype)}</div><p>${esc(d.bio)}</p>${texts.length ? `<h3>Agendas uncovered</h3><ul class="plain">${texts.map(t => `<li>${esc(t)}</li>`).join('')}</ul><p class="sub">Agendas differ between reigns. The same face is not always the same person.</p>` : '<p class="sub">No agenda uncovered yet.</p>'}</div></article>`;
    }).join('');
  }
  if (tab === 'stories') {
    const list = Object.entries(meta.stories);
    if (!list.length) return '<p>The major turning points of your reigns will be recorded here.</p>';
    return list.map(([id, s]) => `<article class="item"><div class="sub">Reign ${s.reign}</div><h4>${esc(s.title)}</h4></article>`).join('');
  }
  if (tab === 'endings') {
    const found = ENDINGS.filter(e => meta.endings[e.id]).length;
    return `<p>${found} of ${ENDINGS.length} endings found.</p>` + ENDINGS.map(e => meta.endings[e.id]
      ? `<article class="item"><div class="sub">${esc(e.kind)} &middot; reached ${meta.endings[e.id]}&times;</div><h4>${esc(e.title)}</h4><p><em>${esc(e.epitaph)}</em></p></article>`
      : `<article class="item locked"><h4>? ? ?</h4><p class="sub">An ending you have not yet reached.</p></article>`).join('');
  }
  if (tab === 'achievements') {
    return ACHIEVEMENTS.map(a => `<article class="item ${meta.achievements[a.id] ? '' : 'locked'}"><h4>${esc(a.title)} ${meta.achievements[a.id] ? tag('Earned', 'good') : ''}</h4><p>${esc(a.desc)}</p></article>`).join('');
  }
  if (tab === 'unlocks') {
    return BACKGROUNDS.map(b => { const ok = isBackgroundUnlocked(meta, b); return `<article class="item ${ok ? '' : 'locked'}"><h4>${esc(b.name)} ${ok ? tag('Available', 'good') : tag('Locked', 'bad')}</h4><p>${esc(b.desc)}</p>${ok ? '' : `<p class="sub">${esc(b.unlock.text)}</p>`}</article>`; }).join('');
  }
  return '';
}

// ---------- settings / menu / new reign ----------
export function settingsHTML(settings, hasReign) {
  return `
  <label class="field"><span>Sound effects<small>Small generated tones. Nothing plays until you act.</small></span><input class="switch" type="checkbox" data-setting="sound" ${settings.sound ? 'checked' : ''}></label>
  <label class="field"><span>Motion<small>Auto follows your system's reduced-motion setting.</small></span>
    <select data-setting="motion" aria-label="Motion"><option value="auto" ${settings.motion === 'auto' ? 'selected' : ''}>Auto</option><option value="reduce" ${settings.motion === 'reduce' ? 'selected' : ''}>Reduced</option><option value="full" ${settings.motion === 'full' ? 'selected' : ''}>Full</option></select></label>
  <label class="field"><span>Show exact meter values<small>Off by default so you act on feel, not arithmetic.</small></span><input class="switch" type="checkbox" data-setting="showValues" ${settings.showValues ? 'checked' : ''}></label>
  <label class="field"><span>Control hints<small>Shows swipe and keyboard reminders under the card.</small></span><input class="switch" type="checkbox" data-setting="hints" ${settings.hints ? 'checked' : ''}></label>
  <h3>Reign and progress</h3>
  ${hasReign ? '<button class="btn" data-action="restart-reign">Restart this reign</button>' : ''}
  <button class="btn danger" data-action="erase-all">Erase all saved progress</button>
  <p class="sub">Your reign, codex discoveries, unlocks and achievements are stored only in this browser.</p>`;
}

export function menuHTML() {
  return `<div class="menu-list">
    <button class="btn primary" data-action="resume">Resume</button>
    <button class="btn" data-action="open-panel" data-panel="objective">Secret objective</button>
    <button class="btn" data-action="open-panel" data-panel="dossier">Character dossier</button>
    <button class="btn" data-action="open-panel" data-panel="chronicle">Reign chronicle</button>
    <button class="btn" data-action="open-panel" data-panel="codex">Codex</button>
    <button class="btn" data-action="open-panel" data-panel="settings">Settings</button>
    <button class="btn" data-action="to-title">Save and return to title</button>
  </div>`;
}

export function newReignHTML(meta, selected) {
  return `<p>Choose how you arrive at court. Your secret objective is assigned by fate, and the court's hidden motives are rolled fresh every reign.</p>
  <div class="list" role="radiogroup" aria-label="Starting background">${BACKGROUNDS.map(b => {
    const ok = isBackgroundUnlocked(meta, b);
    return `<label class="bg-opt ${ok ? '' : 'locked'}"><input type="radio" name="bg" value="${b.id}" ${ok ? '' : 'disabled'} ${b.id === selected ? 'checked' : ''}><span><b>${esc(b.name)}</b> ${ok ? '' : tag('Locked', 'bad')}<p>${esc(b.desc)}</p>${ok ? '' : `<p class="sub">${esc(b.unlock.text)}</p>`}</span></label>`;
  }).join('')}</div>
  <button class="btn primary wide" data-action="begin-reign">Begin the reign</button>`;
}

// ---------- reign summary ----------
export function summaryHTML(state, content, fresh = []) {
  const s = buildSummary(state, content);
  const e = s.ending;
  const name = id => esc(nameOf(state, id));
  const obj = s.objective;
  const objStatus = obj.status === 'done' ? 'Achieved' : 'Not achieved';
  const how = obj.steps.map(st => `${st.done ? '&#10003;' : '&#10007;'} ${esc(st.label)}`).join(' &nbsp; ');
  return `<div class="sum-inner">
    <header class="sum-hero"><div class="kind ${e.kind === 'fall' ? 'fall' : ''}" id="sum-kind">${esc({ triumph: 'Triumph', fall: 'Downfall', neutral: 'An ending' }[e.kind])}</div>
      <h1 id="sum-title" tabindex="-1">${esc(e.title)}</h1><p class="epitaph">${esc(e.epitaph)}</p><p class="story">${esc(e.text)}</p></header>
    <div class="kv"><div><b>${s.turns}</b><span>Turns survived</span></div><div><b>${esc(s.rank)}</b><span>Highest rank</span></div><div><b>${s.betrayals.length}</b><span>Betrayals</span></div><div><b>${s.secrets.length}</b><span>Secrets found</span></div></div>
    <div class="final-meters">${METERS.map(m => `<div><b>${s.meters[m]}</b>${esc(METER_INFO[m].label)}</div>`).join('')}</div>
    <section class="sum-sec"><h2>Secret objective</h2><p><b>${esc(obj.title)}</b>: ${esc(obj.brief)} ${tag(objStatus, obj.status === 'done' ? 'good' : 'bad')}</p><p class="sub">${how}</p></section>
    ${s.majorDecisions.length ? `<section class="sum-sec"><h2>Decisions that mattered</h2><ul class="plain">${s.majorDecisions.map(h => `<li><b>${esc(h.title)}</b> (turn ${h.turn}): ${esc(h.label)}.</li>`).join('')}</ul></section>` : ''}
    <section class="sum-sec"><h2>Allies and enemies</h2><p>${s.allies.length ? 'Still at your side: ' + s.allies.map(name).join(', ') + '.' : 'Nobody was at your side at the end.'} ${s.enemies.length ? ' Against you: ' + s.enemies.map(name).join(', ') + '.' : ''} ${s.departed.length ? ' Gone from court: ' + s.departed.map(d => `${name(d.id)} (${esc(STATUS_LABEL[d.status].toLowerCase())})`).join(', ') + '.' : ''}</p></section>
    ${s.betrayals.length ? `<section class="sum-sec"><h2>Betrayals</h2><ul class="plain">${s.betrayals.map(b => `<li>Turn ${b.turn}: ${esc(b.text)}</li>`).join('')}</ul></section>` : ''}
    ${s.secrets.length ? `<section class="sum-sec"><h2>Secrets discovered</h2><ul class="plain">${s.secrets.map(id => `<li>${esc(getSecret(id).title)}</li>`).join('')}</ul></section>` : ''}
    ${s.laws.length ? `<section class="sum-sec"><h2>Principles you met</h2><p>${s.laws.map(id => esc(LAWS.find(l => l.id === id).title)).join('; ')}.</p><p class="sub">Open the Codex for the full notes.</p></section>` : ''}
    <section class="sum-sec"><h2>Your strategic style</h2><p>${esc(s.style.text)}</p></section>
    ${fresh.length ? `<section class="sum-sec"><h2>Achievements</h2>${fresh.map(a => `<div class="ach"><b>${esc(a.title)}</b>: ${esc(a.desc)}</div>`).join('')}</section>` : ''}
    <div class="sum-actions"><button class="btn primary" id="btn-sum-new">Begin another reign</button><button class="btn" id="btn-sum-codex">Open the Codex</button><button class="btn wide" id="btn-sum-title" style="grid-column:1/-1">Return to title</button></div>
  </div>`;
}
export { RANKS };
