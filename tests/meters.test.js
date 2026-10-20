import test from 'node:test';
import assert from 'node:assert/strict';
import { changeMeter, applyFx, newReport } from '../js/effects.js';
import { resolveEnding, newReign } from '../js/gameEngine.js';
import { METERS, MAX_TURN } from '../data/world.js';
import { fresh } from './helpers.js';

test('meter changes clamp to 0..100 and report the real delta', () => {
  const s = fresh();
  s.meters.authority = 95;
  const r = newReport();
  assert.equal(changeMeter(s, 'auth', 20, r), 5);
  assert.equal(s.meters.authority, 100);
  assert.equal(r.meters.authority, 5);
  s.meters.loyalty = 3;
  assert.equal(changeMeter(s, 'loy', -50), -3);
  assert.equal(s.meters.loyalty, 0);
  assert.equal(changeMeter(s, 'res', 0), 0);
  assert.equal(changeMeter(s, 'nonsense', 5), 0);
});

test('short and long meter keys are equivalent in fx', () => {
  const s = fresh();
  const before = { ...s.meters };
  applyFx(s, { m: { auth: 3, reputation: -2 } });
  assert.equal(s.meters.authority, before.authority + 3);
  assert.equal(s.meters.reputation, before.reputation - 2);
});

const crisis = [
  ['authority', 0, 'overthrown'], ['loyalty', 0, 'abandoned'], ['resources', 0, 'bankrupt'], ['reputation', 0, 'disgraced'],
  ['authority', 100, 'feared_isolated'], ['reputation', 100, 'gilded_cage'], ['loyalty', 100, 'puppet'], ['resources', 100, 'plundered'],
];
for (const [meter, value, ending] of crisis) {
  test(`${meter}=${value} triggers "${ending}"`, () => {
    const s = fresh();
    s.meters[meter] = value;
    if (meter === 'authority' && value === 100) s.meters.loyalty = 30;
    const e = resolveEnding(s);
    assert.equal(e?.id, ending);
    assert.equal(s.ending.id, ending);
  });
}

test('no crisis for mid-range meters, and extremes are not always success', () => {
  const s = fresh();
  for (const m of METERS) s.meters[m] = 50;
  assert.equal(resolveEnding(s), null);
  for (const m of METERS) { for (const v of [0, 100]) { const t = fresh(); t.meters[m] = v; const e = resolveEnding(t); assert.ok(e && e.kind !== 'triumph', `${m}=${v} must not be a triumph`); } }
});

test('the same extreme gives a more specific ending depending on state', () => {
  const a = fresh(); a.meters.authority = 100; a.meters.loyalty = 30;
  const b = fresh(); b.meters.authority = 100; b.meters.loyalty = 80;
  assert.equal(resolveEnding(a).id, 'feared_isolated');
  assert.equal(resolveEnding(b).id, 'eclipsed');
  const c = fresh(); c.meters.reputation = 0; c.stats.manipulations = 3;
  assert.equal(resolveEnding(c).id, 'exposed_manipulator');
});

test('ending is not re-evaluated once set', () => {
  const s = fresh(); s.meters.loyalty = 0; resolveEnding(s);
  s.meters.loyalty = 50; s.meters.authority = 0;
  assert.equal(resolveEnding(s).id, 'abandoned');
});

test('reaching the turn limit produces a legacy ending', () => {
  const s = fresh(); s.turn = MAX_TURN + 1;
  assert.ok(resolveEnding(s).id.startsWith('legacy_') || ['supreme', 'shadow_regent'].includes(s.ending.id));
});

test('final endings: regent, heir guardian and legacy variants', () => {
  const mk = f => { const s = fresh(); s.turn = MAX_TURN + 1; Object.assign(s.meters, f.m); Object.assign(s.flags, f.flags || {}); return resolveEnding(s).id; };
  assert.equal(mk({ m: { authority: 60, reputation: 60, loyalty: 50, resources: 50 }, flags: { regent: true } }), 'supreme');
  assert.equal(mk({ m: { authority: 65, reputation: 60, loyalty: 50, resources: 50 }, flags: { heir_guardian: true } }), 'shadow_regent');
  assert.equal(mk({ m: { authority: 40, reputation: 60, loyalty: 40, resources: 70 } }), 'legacy_architect');
  assert.equal(mk({ m: { authority: 40, reputation: 60, loyalty: 70, resources: 40 } }), 'legacy_beloved');
  assert.equal(mk({ m: { authority: 70, reputation: 40, loyalty: 40, resources: 40 } }), 'legacy_iron');
  assert.equal(mk({ m: { authority: 40, reputation: 40, loyalty: 40, resources: 40 } }), 'legacy_survivor');
});

test('forced endings from events take precedence over meters', () => {
  const s = fresh(); s.forcedEnding = 'negotiated_exit';
  assert.equal(resolveEnding(s).id, 'negotiated_exit');
});
