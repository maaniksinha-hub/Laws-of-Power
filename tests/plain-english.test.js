// Plain-English guard: every player-facing string must be easy to read. Thresholds are deliberately strict.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_LIST } from '../data/events.js';
import { ECHOES } from '../data/echoes.js';
import { ENDINGS } from '../data/endings.js';
import { CHARACTERS, SECRETS, CLUES } from '../data/characters.js';
import { OBJECTIVES } from '../data/objectives.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { BACKGROUNDS, PRESSURES, STYLES, METER_INFO } from '../data/world.js';
import { LAWS } from '../data/laws.js';

const flat = t => (Array.isArray(t) ? t.map(v => (typeof v === 'string' ? v : v.t)) : [t]);
export function corpus() {
  const out = [];
  const add = (where, ...ts) => { for (const t of ts.flat()) if (typeof t === 'string' && t) out.push([where, t]); };
  for (const ev of EVENT_LIST) {
    add(`${ev.id}.title`, ev.title); add(`${ev.id}.text`, flat(ev.text));
    for (const s of ['left', 'right']) { add(`${ev.id}.${s}.label`, ev[s].label); add(`${ev.id}.${s}.result`, ev[s].result, (ev[s].branches || []).map(b => b.result)); add(`${ev.id}.${s}.memo`, ev[s].memo); add(`${ev.id}.${s}.note`, ev[s].fx?.note); if (ev.lesson) add(`${ev.id}.lesson.${s}`, ev.lesson[s]); }
    if (ev.who) add(`${ev.id}.who`, ev.who.name, ev.who.role);
  }
  for (const [id, l] of Object.entries(ECHOES)) add(`echo.${id}`, l.map(e => e.text));
  for (const e of ENDINGS) add(`ending.${e.id}`, e.title, e.epitaph, flat(e.text));
  for (const [id, c] of Object.entries(CHARACTERS)) add(`char.${id}`, c.role, c.archetype, c.bio, c.publicGoal, c.variants.map(v => v.hidden), c.realRole);
  for (const [id, s] of Object.entries(SECRETS)) add(`secret.${id}`, s.title, s.text);
  for (const [id, l] of Object.entries(CLUES)) add(`clue.${id}`, l.map(c => c.text));
  for (const o of OBJECTIVES) add(`objective.${o.id}`, o.title, o.brief, o.steps.map(s => s.label));
  for (const a of ACHIEVEMENTS) add(`ach.${a.id}`, a.title, a.desc);
  for (const b of BACKGROUNDS) add(`bg.${b.id}`, b.name, b.desc, b.unlock?.text);
  for (const p of PRESSURES) add(`pressure.${p.id}`, p.warn);
  for (const [k, s] of Object.entries(STYLES)) add(`style.${k}`, s.blurb);
  for (const [k, v] of Object.entries(METER_INFO)) add(`meter.${k}`, v.blurb);
  for (const l of LAWS) add(`law.${l.n}`, l.plain, l.principle, l.risk, l.application, l.defense);
  return out;
}

const syllables = w => { w = w.toLowerCase().replace(/[^a-z]/g, ''); if (w.length <= 3) return w ? 1 : 0; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, ''); return Math.max(1, (w.match(/[aeiouy]{1,2}/g) || []).length); };
const words = s => s.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
const sentences = s => s.split(/(?<=[.!?])["'”’)]*\s+|;\s+/).filter(x => /[A-Za-z]/.test(x));
export function grade(strings) {
  let w = 0, sy = 0, se = 0;
  for (const s of strings) { for (const x of words(s)) { w++; sy += syllables(x); } se += sentences(s).length || 1; }
  return 0.39 * (w / se) + 11.8 * (sy / w) - 15.59;
}

// Words that signal fancy or abstract writing. Names and rank titles are fine.
const FANCY = /\b(sedition|precedence|reciprocity|scrutiny|ambiguous|ambiguity|nuance|pretext|leverage|coalition|dependency|dependence|autonomy|legitimacy|ostensibly|clandestine|disparage|indispensable|magnanimity|magnanimous|benefactor|insinuat\w*|adversar\w*|nonchalant|conspicuous|expedient|perfidy|emissary|plebeian|aristocra\w*|machinat\w*|duplicit\w*|obfuscat\w*|ephemeral|opportunis\w*|subordinate\w*|hierarchy|incrementalism|equanimity|vulnerabilit\w*|credibility|stipend|monopol\w*|tariff\w*|arrears|regency|regent|astrolabe)\b/i;

test('no very long words and no fancy vocabulary in player-facing text', () => {
  const bad = [];
  for (const [where, t] of corpus()) {
    for (const x of words(t)) if (x.replace(/[^A-Za-z]/g, '').length > 13) bad.push(`${where}: long word "${x}"`);
    const m = t.match(FANCY); if (m) bad.push(`${where}: fancy word "${m[0]}"`);
  }
  assert.deepEqual(bad, []);
});

test('sentences are short (22 words or fewer)', () => {
  const bad = [];
  for (const [where, t] of corpus()) for (const s of sentences(t)) { const n = words(s).length; if (n > 22) bad.push(`${where} (${n} words): ${s.slice(0, 70)}...`); }
  assert.deepEqual(bad, []);
});

test('the story text reads at about grade 6 or easier, and so does the rest', () => {
  const c = corpus();
  const story = grade(c.filter(([w]) => /\.(text|result)$/.test(w) || w.startsWith('echo.') || /^ending\./.test(w)).map(x => x[1]));
  const lessons = grade(c.filter(([w]) => /\.lesson\./.test(w) || w.startsWith('law.')).map(x => x[1]));
  const all = grade(c.map(x => x[1]));
  console.log(`grade levels: story ${story.toFixed(1)}, lessons and laws ${lessons.toFixed(1)}, everything ${all.toFixed(1)}`);
  assert.ok(story <= 6.5, `story grade ${story.toFixed(1)}`);
  assert.ok(lessons <= 8, `lessons grade ${lessons.toFixed(1)}`);
  assert.ok(all <= 7, `overall grade ${all.toFixed(1)}`);
});

// The interface text (buttons, menus, notices) in the source files must be plain too.
import { readFileSync } from 'node:fs';
const UI_BANNED = /\b(codex|dossier|chronicle|agenda|agendas|objective|objectives|achievements?|principles?|discoveries|persist\w*|configur\w*|immersive|mutual|progress(?!\b)|unlocks|reduced)\b/i;
function uiStrings() {
  const out = [];
  for (const f of ['index.html', 'js/ui.js', 'js/views.js', 'js/gameEngine.js', 'js/pwa.js']) {
    const src = readFileSync(f, 'utf8');
    const pieces = [...src.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`|>([^<>{}]*[A-Za-z][^<>{}]*)</g)].map(m => m[1] ?? m[2] ?? m[3] ?? m[4]);
    for (const p of pieces) {
      const text = p.replace(/\$\{[^}]*\}/g, ' ').replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\\'/g, "'");
      if (/prefers-/.test(text)) continue;
      if (/^[\sA-Za-z0-9_.#:-]*$/.test(text) && !/\s\S+\s/.test(text.trim())) continue; // ids, classes, single words
      if ((text.match(/[A-Za-z]{3,}/g) || []).length >= 2 && / /.test(text.trim()) && !/^[#.a-z-]+( [#.a-z-]+)*$/.test(text.trim()) && !/[{};=]|=>|function|\bconst\b/.test(text)) out.push([f, text.trim()]);
    }
  }
  return out;
}
test('interface text uses plain words (no jargon like Codex, dossier or agenda)', () => {
  const bad = [];
  for (const [f, t] of uiStrings()) {
    const m = t.match(UI_BANNED); if (m) bad.push(`${f}: "${m[0]}" in "${t.slice(0, 70)}"`);
    for (const w of words(t)) if (w.length > 13) bad.push(`${f}: long word "${w}"`);
    const fm = t.match(FANCY); if (fm) bad.push(`${f}: fancy "${fm[0]}" in "${t.slice(0, 60)}"`);
    for (const s of sentences(t)) if (words(s).length > 22) bad.push(`${f}: long sentence "${s.slice(0, 60)}"`);
  }
  assert.deepEqual(bad, []);
});
