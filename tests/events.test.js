import test from 'node:test';
import assert from 'node:assert/strict';
import { isEligible, pickEvent, eventText, RECENT_WINDOW } from '../js/eventEngine.js';
import { check } from '../js/conditions.js';
import { advance, choose, continueReign } from '../js/gameEngine.js';
import { applyFx } from '../js/effects.js';
import { fresh, ev, table } from './helpers.js';

test('meter min/max conditions', () => {
  const s = fresh(); s.meters.resources = 30;
  assert.ok(isEligible(s, ev('a', { when: { meter: { res: [null, 40] } } })));
  assert.ok(!isEligible(s, ev('b', { when: { meter: { res: [40, null] } } })));
  assert.ok(isEligible(s, ev('c', { when: { meter: { resources: [30, 30] } } })));
});

test('required and excluded flags', () => {
  const s = fresh();
  const e = ev('a', { when: { flags: ['x'], notFlags: ['y'] } });
  assert.ok(!isEligible(s, e));
  s.flags.x = true; assert.ok(isEligible(s, e));
  s.flags.y = true; assert.ok(!isEligible(s, e));
  assert.ok(isEligible(s, ev('b', { when: { anyFlags: ['q', 'x'] } })));
});

test('prerequisite events and choices', () => {
  const s = fresh();
  const e = ev('b', { when: { seen: ['a'], chose: { a: 'left' } } });
  assert.ok(!isEligible(s, e));
  s.played.a = 1; s.choices.a = 'right'; assert.ok(!isEligible(s, e));
  s.choices.a = 'left'; assert.ok(isEligible(s, e));
  assert.ok(!isEligible(s, ev('c', { when: { notSeen: ['a'] } })));
});

test('character availability: absent characters cannot speak', () => {
  const s = fresh();
  const e = ev('a', { char: 'varen', others: ['kovane'] });
  assert.ok(isEligible(s, e));
  s.chars.kovane.status = 'exiled'; assert.ok(!isEligible(s, e));
  s.chars.kovane.status = 'court'; s.chars.varen.status = 'dead'; assert.ok(!isEligible(s, e));
  assert.ok(isEligible(s, ev('b', { char: 'varen', allowAbsent: true })));
});

test('relationship and character stat thresholds', () => {
  const s = fresh();
  const e = ev('a', { when: { rel: { 'dorne|varen': { rivalry: [50, null] } }, char: { varen: { trust: [40, 80], variant: s.chars.varen.variant } } } });
  assert.ok(isEligible(s, e));
  s.relations['dorne|varen'].rivalry = 10; assert.ok(!isEligible(s, e));
  s.relations['dorne|varen'].rivalry = 70; s.chars.varen.trust = 90; assert.ok(!isEligible(s, e));
  assert.ok(check({ rel: { 'varen|dorne': { rivalry: [60, null] } } }, s), 'pair keys are order-insensitive');
});

test('rank, turn, any/not combinators', () => {
  const s = fresh(); s.turn = 5;
  assert.ok(check({ turn: [5, 5], rank: [0, 0] }, s));
  assert.ok(check({ any: [{ turn: [9, null] }, { rank: [0, 0] }] }, s));
  assert.ok(!check({ not: { turn: [1, 9] } }, s));
});

test('once-per-reign and cooldown prevent repeats', () => {
  const s = fresh(); s.turn = 10;
  const once = ev('once', { once: true });
  assert.ok(isEligible(s, once));
  s.played.once = 1; assert.ok(!isEligible(s, once));
  const rep = ev('rep', { cooldown: 5 });
  s.played.rep = 1; s.lastTurn.rep = 8; assert.ok(!isEligible(s, rep));
  s.turn = 13; assert.ok(isEligible(s, rep));
});

test('recent events are excluded from the pool', () => {
  const s = fresh(); s.recent = ['a'];
  assert.ok(!isEligible(s, ev('a')));
  assert.ok(isEligible(s, ev('a'), { ignoreRecent: true }));
});

test('advance() records history so the same card does not repeat immediately', () => {
  const s = fresh(5);
  const seen = [];
  let e = advance(s);
  for (let i = 0; i < 12 && e; i++) {
    seen.push(e.id);
    choose(s, i % 2 ? 'left' : 'right');
    e = continueReign(s);
  }
  for (let i = 1; i < seen.length; i++) assert.notEqual(seen[i], seen[i - 1]);
  const window = RECENT_WINDOW;
  for (let i = 0; i < seen.length; i++) for (let j = i + 1; j < Math.min(seen.length, i + window); j++) if (!seen[i].startsWith('routine_')) assert.notEqual(seen[i], seen[j], `${seen[i]} repeated within ${window} turns`);
});

test('follow-up events come due after their delay and respect conditions', () => {
  const events = table(ev('a', { story: true }), ev('f', { when: { flags: ['go'] }, once: true }), ev('fb', { fallback: true, char: 'crowd' }));
  const s = fresh(); s.turn = 3;
  applyFx(s, { queue: [{ id: 'f', delay: 2 }], flags: ['go'] });
  assert.equal(s.queue.length, 1);
  assert.notEqual(pickEvent(s, events).source, 'queue'); // not due yet
  s.turn = 5;
  const p = pickEvent(s, events);
  assert.equal(p.event.id, 'f'); assert.equal(p.source, 'queue');
  assert.equal(s.queue.length, 0);
});

test('queued follow-up with failed conditions is dropped after a grace period', () => {
  const events = table(ev('f', { when: { flags: ['never'] } }), ev('fb', { fallback: true, char: 'crowd' }));
  const s = fresh(); s.queue.push({ id: 'f', due: 2 }); s.turn = 4;
  assert.equal(pickEvent(s, events).event.id, 'fb'); assert.equal(s.queue.length, 1);
  s.turn = 9; pickEvent(s, events); assert.equal(s.queue.length, 0);
});

test('story events are prioritised, urgent ones always win', () => {
  const events = table(ev('story', { story: true, char: 'quill' }), ev('plain', { char: 'kovane' }), ev('urgent', { urgent: true, once: true, char: 'dorne' }));
  const s = fresh(3);
  assert.equal(pickEvent(s, events).event.id, 'urgent');
  s.played.urgent = 1; s.recent = [];
  let story = 0;
  for (let i = 0; i < 200; i++) { s.rng = i * 7919; if (pickEvent(s, events).event.id === 'story') story++; }
  assert.ok(story > 120, `story events should dominate (${story}/200)`);
});

test('fallback selection never returns null', async () => {
  const { EVENTS } = await import('../data/events.js');
  const s = fresh();
  for (const id of Object.keys(s.chars)) if (id !== 'crowd') s.chars[id].status = 'dead';
  s.recent = ['routine_petitions', 'routine_envoy', 'routine_gossip'];
  for (const id of Object.keys(EVENTS)) { s.played[id] = 1; s.lastTurn[id] = s.turn; }
  for (let i = 0; i < 20; i++) { const p = pickEvent(s, EVENTS); assert.ok(p.event); if (i < 8) assert.ok(p.event.fallback); s.turn++; s.played[p.event.id]++; s.lastTurn[p.event.id] = s.turn; s.recent.push(p.event.id); }
});

test('selection is deterministic for a given seed and varies between seeds', () => {
  const run = seed => { const s = fresh(seed); const ids = []; let e = advance(s); for (let i = 0; i < 15 && e; i++) { ids.push(e.id); choose(s, 'left'); e = continueReign(s); } return ids.join(','); };
  assert.equal(run('alpha'), run('alpha'));
  assert.notEqual(run('alpha'), run('beta'));
});

test('conditional dialogue picks the first matching variant and fills tokens', () => {
  const s = fresh(); s.flags.humble_start = true; s.params.culprit = 'vask';
  const e = ev('t', { text: [{ when: { flags: ['humble_start'] }, t: 'Humble, {t}.' }, 'Other'] });
  assert.equal(eventText(s, e), 'Humble, junior.');
  delete s.flags.humble_start; assert.equal(eventText(s, e), 'Other');
});
