// Content integrity: the data files must be internally consistent. Run on every change to data/.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_LIST, EVENTS } from '../data/events.js';
import { CHARACTERS, RELATIONS, SECRETS, CLUES, ALL_SECRET_IDS } from '../data/characters.js';
import { LAWS } from '../data/laws.js';
import { ENDINGS } from '../data/endings.js';
import { OBJECTIVES } from '../data/objectives.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { BACKGROUNDS, STYLES, METER_ALIAS } from '../data/world.js';
import { isEligible, pickEvent } from '../js/eventEngine.js';
import { fresh } from './helpers.js';

const FX_KEYS = new Set(['m', 'flags', 'clear', 'chars', 'rel', 'reveal', 'expose', 'stat', 'queue', 'end', 'note']);
const COND_KEYS = new Set(['any', 'not', 'meter', 'flags', 'notFlags', 'anyFlags', 'seen', 'notSeen', 'chose', 'turn', 'rank', 'char', 'rel', 'secret', 'notSecret', 'exposed', 'stat', 'allies', 'enemies', 'agendas', 'pending', 'objective']);
const THEMES = ['ambition', 'reputation', 'loyalty', 'secrets', 'rivalry', 'negotiation', 'fear', 'scarcity', 'revenge', 'opportunity', 'timing'];
const words = t => (Array.isArray(t) ? t.map(v => (typeof v === 'string' ? v : v.t)) : [t]).map(x => x.trim().split(/\s+/).length);

// every fx object reachable from an event
function fxOf(ev) {
  const out = [];
  for (const side of ['left', 'right']) { const c = ev[side]; if (c.fx) out.push([`${ev.id}.${side}`, c.fx]); for (const b of c.branches || []) if (b.fx) out.push([`${ev.id}.${side}.branch`, b.fx]); }
  return out;
}
function condsOf(ev) {
  const out = [[`${ev.id}.when`, ev.when]];
  for (const side of ['left', 'right']) for (const b of ev[side].branches || []) out.push([`${ev.id}.${side}.branch`, b.when]);
  if (Array.isArray(ev.text)) for (const v of ev.text) if (v.when) out.push([`${ev.id}.text`, v.when]);
  return out.filter(([, c]) => c);
}
const walkCond = (c, f) => { f(c); for (const x of c.any || []) walkCond(x, f); if (c.not) walkCond(c.not, f); };
const validId = id => id.startsWith('$') || !!CHARACTERS[id];

test('at least 40 events with unique ids', () => {
  assert.ok(EVENT_LIST.length >= 40, `${EVENT_LIST.length} events`);
  assert.equal(new Set(EVENT_LIST.map(e => e.id)).size, EVENT_LIST.length);
});

test('every event has the required fields and two distinct, complete choices', () => {
  for (const ev of EVENT_LIST) {
    assert.ok(ev.title && ev.title.length <= 48, `${ev.id} title`);
    assert.ok(THEMES.includes(ev.theme), `${ev.id} theme ${ev.theme}`);
    assert.ok(CHARACTERS[ev.char], `${ev.id} char`);
    for (const o of ev.others || []) assert.ok(CHARACTERS[o], `${ev.id} other ${o}`);
    for (const side of ['left', 'right']) {
      const c = ev[side];
      assert.ok(c && c.label, `${ev.id}.${side} needs a label`);
      const br = c.branches || [];
      assert.ok(c.result || (br.length && br.every(b => b.result) && !br[br.length - 1].when && br[br.length - 1].chance == null), `${ev.id}.${side} needs a result (or an unconditional final branch with one)`);
      assert.ok(STYLES[c.style], `${ev.id}.${side} style ${c.style}`);
    }
    assert.notEqual(ev.left.label, ev.right.label, `${ev.id} choices must differ`);
  }
});

test('narrative length is 25-70 words (±5 tolerance for variants)', () => {
  for (const ev of EVENT_LIST) for (const n of words(ev.text)) assert.ok(n >= 25 && n <= 75, `${ev.id} has ${n} words`);
});

test('effects only use legal keys and valid references', () => {
  for (const ev of EVENT_LIST) for (const [where, fx] of fxOf(ev)) {
    for (const k of Object.keys(fx)) assert.ok(FX_KEYS.has(k), `${where}: unknown fx key ${k}`);
    for (const k of Object.keys(fx.m || {})) assert.ok(METER_ALIAS[k] || Object.values(METER_ALIAS).includes(k), `${where}: meter ${k}`);
    for (const id of Object.keys(fx.chars || {})) assert.ok(id === '$all' || validId(id), `${where}: char ${id}`);
    for (const [a, b] of (fx.rel || []).map(r => r)) assert.ok(validId(a) && validId(b), `${where}: rel ${a} ${b}`);
    for (const id of [...(fx.reveal || []), ...(fx.expose || [])]) assert.ok(ALL_SECRET_IDS.includes(id), `${where}: secret ${id}`);
    for (const q of fx.queue || []) assert.ok(EVENTS[q.id], `${where}: queue target ${q.id}`);
    if (fx.end) assert.ok(ENDINGS.some(e => e.id === fx.end), `${where}: ending ${fx.end}`);
    for (const d of Object.values(fx.chars || {})) if (d.status) assert.ok(['court', 'dead', 'exiled', 'defected', 'imprisoned'].includes(d.status));
  }
});

test('conditions only use legal keys and valid references', () => {
  for (const ev of EVENT_LIST) for (const [where, cond] of condsOf(ev)) walkCond(cond, c => {
    for (const k of Object.keys(c)) assert.ok(COND_KEYS.has(k), `${where}: unknown condition ${k}`);
    for (const id of [...(c.seen || []), ...(c.notSeen || []), ...Object.keys(c.chose || {})]) assert.ok(EVENTS[id], `${where}: event ref ${id}`);
    for (const id of [...(c.secret || []), ...(c.notSecret || []), ...(c.exposed || [])]) assert.ok(ALL_SECRET_IDS.includes(id), `${where}: secret ${id}`);
    for (const id of Object.keys(c.char || {})) assert.ok(validId(id), `${where}: char ${id}`);
    if (c.pending) assert.ok(EVENTS[c.pending]);
  });
});

test('law references are valid and every lesson has text for both choices', () => {
  const lessons = EVENT_LIST.filter(e => e.lesson);
  assert.ok(lessons.length >= 25, `${lessons.length} lessons`);
  for (const ev of lessons) {
    assert.ok(LAWS.some(l => l.n === ev.lesson.law), `${ev.id} law ${ev.lesson.law}`);
    assert.ok(ev.lesson.left.length > 40 && ev.lesson.right.length > 40);
  }
});

test('at least 10 events form connected storylines (queued follow-ups or chained prerequisites)', () => {
  const linked = new Set();
  for (const ev of EVENT_LIST) {
    for (const [, fx] of fxOf(ev)) for (const q of fx.queue || []) { linked.add(ev.id); linked.add(q.id); }
    for (const [, c] of condsOf(ev)) walkCond(c, x => { for (const id of [...(x.seen || []), ...Object.keys(x.chose || {})]) { linked.add(ev.id); linked.add(id); } });
  }
  assert.ok(linked.size >= 10, `${linked.size} linked events`);
});

test('at least 8 events involve more than one significant character', () => {
  const multi = EVENT_LIST.filter(e => (e.others || []).some(o => !CHARACTERS[o].generic) && !CHARACTERS[e.char].generic);
  assert.ok(multi.length >= 8, `${multi.length} multi-character events`);
});

test('all required themes are represented', () => {
  const have = new Set(EVENT_LIST.map(e => e.theme));
  for (const t of THEMES) assert.ok(have.has(t), `theme ${t}`);
});

test('every event can actually be reached: some other event or rule makes it eligible', () => {
  // Reachability: events with `seen`/flag prerequisites must have a producer (queue, flag setter, reveal) somewhere.
  const setFlags = new Set(), queued = new Set(), revealed = new Set();
  for (const ev of EVENT_LIST) for (const [, fx] of fxOf(ev)) { (fx.flags || []).forEach(f => setFlags.add(f)); (fx.queue || []).forEach(q => queued.add(q.id)); [...(fx.reveal || []), ...(fx.expose || [])].forEach(x => revealed.add(x)); }
  for (const s of Object.values(SECRETS)) (s.onExpose?.flags || []).forEach(f => setFlags.add(f));
  for (const ch of Object.keys(CHARACTERS)) for (const v of CHARACTERS[ch].variants) setFlags.add(`${ch}_${v.id}`);
  for (const f of ['culprit_vask', 'culprit_dorne', 'culprit_quill', 'coalition', 'humble_start', 'bold_start', 'veiled_patron']) setFlags.add(f);
  for (const b of BACKGROUNDS) (b.flags || []).forEach(f => setFlags.add(f));
  for (const ev of EVENT_LIST) for (const [where, cond] of condsOf(ev)) if (where.endsWith('.when')) walkCond(cond, c => {
    for (const f of [...(c.flags || []), ...(c.anyFlags || [])]) if (!f.startsWith('bloc_')) assert.ok(setFlags.has(f), `${ev.id} requires flag "${f}" that nothing sets`);
    for (const id of c.secret || []) assert.ok(revealed.has(id) || BACKGROUNDS.some(b => (b.reveal || []).includes(id)) || id.startsWith('agenda_'), `${ev.id} requires secret ${id} that nothing reveals`);
  });
});

test('characters: at least 10 recurring characters with the full set of attributes', () => {
  const cast = Object.entries(CHARACTERS).filter(([, c]) => !c.generic);
  assert.ok(cast.length >= 10);
  for (const [id, c] of cast) {
    for (const k of ['name', 'role', 'archetype', 'bio', 'publicGoal', 'look', 'start']) assert.ok(c[k], `${id}.${k}`);
    assert.ok(c.variants.length >= 1 && c.variants.every(v => v.hidden && v.weight > 0), `${id} variants`);
  }
  for (const [a, b] of RELATIONS) assert.ok(CHARACTERS[a] && CHARACTERS[b]);
  for (const id of Object.keys(CLUES)) assert.ok(CHARACTERS[id]);
});

test('endings: all the required endings exist with valid conditions', () => {
  const need = ['overthrown', 'abandoned', 'bankrupt', 'feared_isolated', 'exposed_manipulator', 'negotiated_exit', 'supreme'];
  for (const id of need) assert.ok(ENDINGS.some(e => e.id === id), id);
  assert.ok(ENDINGS.filter(e => e.id.startsWith('legacy_')).length >= 3);
  assert.equal(new Set(ENDINGS.map(e => e.id)).size, ENDINGS.length);
  assert.ok(ENDINGS.some(e => e.trigger === 'final' && !e.when), 'a final fallback ending must exist');
});

test('the law dataset has all 48 laws with complete records', () => {
  assert.equal(LAWS.length, 48);
  LAWS.forEach((l, i) => { assert.equal(l.n, i + 1); for (const k of ['title', 'principle', 'risk', 'defense', 'application']) assert.ok(l[k] && l[k].length > 15, `law ${l.n} ${k}`); });
  assert.ok(LAWS.every(l => l.verified === false), 'titles must not be claimed as verified against the book');
});

test('every objective and achievement is well-formed', () => {
  for (const o of OBJECTIVES) assert.ok(o.id && o.title && o.brief && o.steps.length);
  assert.ok(OBJECTIVES.length >= 7);
  assert.equal(new Set(ACHIEVEMENTS.map(a => a.id)).size, ACHIEVEMENTS.length);
});

test('"remove a rival" targets each have an event path that removes them', () => {
  const removed = new Set();
  for (const ev of EVENT_LIST) for (const [, fx] of fxOf(ev)) for (const [id, d] of Object.entries(fx.chars || {})) if (d.status && d.status !== 'court') removed.add(id);
  for (const s of Object.values(SECRETS)) for (const [id, d] of Object.entries(s.onExpose?.chars || {})) if (d.status && d.status !== 'court') removed.add(id);
  const culprits = new Set(['vask', 'dorne', 'quill']);
  for (const t of OBJECTIVES.find(o => o.id === 'remove').pool.map(p => p.id)) assert.ok(removed.has(t) || culprits.has(t), `${t} has a removal path`);
});

test('the first card always exists and the deck never runs dry in a fresh reign', () => {
  const s = fresh(1);
  assert.ok(isEligible(s, EVENTS.arrival));
  assert.equal(pickEvent(s, EVENTS).event.id, 'arrival');
});

test('weights are positive and cooldowns are sane', () => {
  for (const ev of EVENT_LIST) { assert.ok((ev.weight ?? 1) > 0); assert.ok((ev.cooldown ?? 1) >= 0); }
});

test('every one of the 48 laws is taught by at least one real-office scene', async () => {
  const { CHANNELS } = await import('../data/channels.js');
  const covered = new Set(EVENT_LIST.filter(e => e.id.startsWith('w_')).map(e => e.lesson?.law));
  for (let n = 1; n <= 48; n++) assert.ok(covered.has(n), `law ${n} has no w_ scene`);
  for (const ev of EVENT_LIST) assert.ok(CHANNELS[ev.via], `${ev.id} has an unknown channel ${ev.via}`);
});
