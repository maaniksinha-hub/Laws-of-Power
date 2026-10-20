// Dev tool for the plain-English pass: prints the player-facing strings of one data area as JSON, keyed by id.
// Usage: node tools/dump-strings.mjs events|endings|characters|objectives|world|laws|echoes
import court from '../data/events/court.js';
import rivals from '../data/events/rivals.js';
import shadows from '../data/events/shadows.js';
import people from '../data/events/people.js';
import more from '../data/events/more.js';
import climax from '../data/events/climax.js';
import { ECHOES } from '../data/echoes.js';
import { ENDINGS } from '../data/endings.js';
import { CHARACTERS, SECRETS, CLUES } from '../data/characters.js';
import { OBJECTIVES } from '../data/objectives.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { BACKGROUNDS, PRESSURES, STYLES, METER_INFO } from '../data/world.js';

const txt = t => (Array.isArray(t) ? t.map(v => (typeof v === 'string' ? v : v.t)) : t);
const side = c => ({ label: c.label, ...(c.memo ? { memo: c.memo } : {}), ...(c.result ? { result: c.result } : {}), ...(c.branches?.some(b => b.result) ? { branches: c.branches.map(b => b.result ?? null) } : {}) });
const area = process.argv[2];
let out = {};
if (area === 'events') for (const ev of [...court, ...rivals, ...shadows, ...people, ...more, ...climax]) {
  out[ev.id] = { title: ev.title, text: txt(ev.text), left: side(ev.left), right: side(ev.right), ...(ev.lesson ? { lesson: { left: ev.lesson.left, right: ev.lesson.right } } : {}), ...(ev.who ? { who: { name: ev.who.name, role: ev.who.role } } : {}) };
  for (const s of ['left', 'right']) if (ev[s].fx?.note) out[ev.id][s].note = ev[s].fx.note;
}
if (area === 'echoes') for (const [id, l] of Object.entries(ECHOES)) out[id] = l.map(e => e.text);
if (area === 'endings') for (const e of ENDINGS) out[e.id] = { title: e.title, epitaph: e.epitaph, text: txt(e.text) };
if (area === 'characters') {
  for (const [id, c] of Object.entries(CHARACTERS)) out[id] = { name: c.name, role: c.role, archetype: c.archetype, bio: c.bio, publicGoal: c.publicGoal, variants: Object.fromEntries(c.variants.map(v => [v.id, v.hidden])), ...(c.realRole ? { realRole: c.realRole } : {}) };
  out._secrets = Object.fromEntries(Object.entries(SECRETS).map(([id, s]) => [id, { title: s.title, text: s.text }]));
  out._clues = Object.fromEntries(Object.entries(CLUES).map(([id, l]) => [id, l.map(c => c.text)]));
}
if (area === 'objectives') {
  for (const o of OBJECTIVES) out[o.id] = { title: o.title, brief: o.brief, steps: o.steps.map(s => s.label) };
  out._achievements = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, { title: a.title, desc: a.desc }]));
}
if (area === 'world') {
  out.backgrounds = Object.fromEntries(BACKGROUNDS.map(b => [b.id, { name: b.name, desc: b.desc, ...(b.unlock ? { unlock: b.unlock.text } : {}) }]));
  out.pressures = Object.fromEntries(PRESSURES.map(p => [p.id, p.warn]));
  out.styles = Object.fromEntries(Object.entries(STYLES).map(([k, v]) => [k, { label: v.label, blurb: v.blurb }]));
  out.meters = Object.fromEntries(Object.entries(METER_INFO).map(([k, v]) => [k, v.blurb]));
}
console.log(JSON.stringify(out, null, 1));
