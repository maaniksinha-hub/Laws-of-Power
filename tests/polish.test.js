import test from 'node:test';
import assert from 'node:assert/strict';
import { ECHOES } from '../data/echoes.js';
import { EVENTS } from '../data/events.js';
import { check } from '../js/conditions.js';
import { echoText } from '../js/eventEngine.js';
import { expression } from '../js/characterEngine.js';
import { portraitSVG, THEME_SCENE } from '../js/portraits.js';
import { advance, choose, continueReign, newReign } from '../js/gameEngine.js';
import { DEFAULT_SETTINGS } from '../js/saveManager.js';
import { CHARACTERS } from '../data/characters.js';
import { fresh } from './helpers.js';

test('every echo belongs to a real event, has a valid condition and a short line', () => {
  for (const [id, list] of Object.entries(ECHOES)) {
    assert.ok(EVENTS[id], `echo for unknown event ${id}`);
    assert.ok(EVENTS[id].echo, `${id} echo merged into the event`);
    for (const e of list) { assert.ok(e.text.length > 20 && e.text.length < 140, `${id} echo length`); assert.doesNotThrow(() => check(e.when, fresh())); }
  }
  assert.ok(Object.keys(ECHOES).length >= 20);
});

test('an echo appears only when the earlier decision happened', () => {
  const s = fresh();
  assert.equal(echoText(s, EVENTS.rumour_meeting), '');
  s.choices.varen_guard = 'right';
  assert.match(echoText(s, EVENTS.rumour_meeting), /guard/);
  s.choices.varen_guard = 'left';
  assert.equal(echoText(s, EVENTS.rumour_meeting), '');
});

test('expressions follow hidden state, and a mask slips before it breaks', () => {
  const s = fresh();
  assert.equal(expression(s, 'varen'), 'warm', 'masked and calm: a friendly face');
  s.chars.varen.resent = 40; assert.equal(expression(s, 'varen'), 'slip', 'mask slipping');
  s.chars.varen.resent = 85; assert.ok(['hostile', 'wary'].includes(expression(s, 'varen')), 'mask gone');
  s.chars.varen.agendaKnown = true; s.chars.varen.resent = 0; s.chars.varen.trust = 5; s.chars.varen.suspicion = 0;
  assert.ok(['wary', 'neutral'].includes(expression(s, 'varen')));
  s.chars.varen.status = 'exiled'; assert.equal(expression(s, 'varen'), 'neutral');
  assert.equal(expression(s, 'ysolde'), 'neutral', 'a neutral mask does not smile');
});

test('portraits render every expression, face shape and scene without breaking', () => {
  const seen = new Set();
  for (const ex of ['neutral', 'warm', 'slip', 'wary', 'hostile', 'afraid']) for (const face of ['round', 'long', 'square']) for (const scene of [...new Set(Object.values(THEME_SCENE))]) {
    const svg = portraitSVG({ hue: 40, face, hat: 'crown' }, { expression: ex, scene, label: 'X' });
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>')); seen.add(svg);
  }
  assert.ok(seen.size >= 100, 'portraits are visibly distinct');
  assert.match(portraitSVG({}, { expression: 'slip' }), /expr-slip/);
  assert.ok(portraitSVG({}, { expression: 'nonsense' }).includes('expr-neutral'));
  for (const id of Object.keys(CHARACTERS)) assert.ok(CHARACTERS[id].look.face, `${id} has a face shape`);
});

test('every theme maps to a scene', () => {
  for (const t of ['ambition', 'reputation', 'loyalty', 'secrets', 'rivalry', 'negotiation', 'fear', 'scarcity', 'revenge', 'opportunity', 'timing']) assert.ok(THEME_SCENE[t], t);
});

test('the reign records a meter trace for the summary timeline', () => {
  const s = fresh('trace'); let e = advance(s), n = 0;
  while (e && n < 8) { choose(s, 'left'); n++; e = continueReign(s); }
  assert.equal(s.trace.length, n);
  assert.ok(s.trace.every(r => r.length === 5 && r.slice(1).every(v => v >= 0 && v <= 100)));
});

test('the daily court is the same reign for everyone on the same day, and differs between days', () => {
  const sig = seed => { const s = newReign({ reigns: 0 }, { seed, background: 'minor_noble' }); return JSON.stringify([s.objective.id, s.chars.varen.variant, s.params.culprit, s.chars.kovane.variant]); };
  assert.equal(sig('daily-2026-10-20'), sig('daily-2026-10-20'));
  const set = new Set(['2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'].map(d => sig(`daily-${d}`)));
  assert.ok(set.size >= 3);
});

test('hint dots default on, and new content is reachable by the weighted deck', () => {
  assert.equal(DEFAULT_SETTINGS.hintDots, true);
  assert.ok(Object.keys(EVENTS).length >= 65);
  for (const id of ['council_seat', 'hunger_march', 'heir_tutor', 'isaura_tea', 'treasury_audit', 'aubry_hospital']) assert.ok(EVENTS[id]);
});

test('tutoring the heir changes how the succession plays out', () => {
  const mk = tutor => { const s = fresh('succ'); s.turn = 31; if (tutor) s.flags.tutor_heir = true; s.current = { id: 'king_death' }; const before = s.meters.loyalty; choose(s, 'right'); return s.meters.loyalty - before; };
  assert.ok(mk(true) > mk(false));
});
