import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCharFx, applyRelFx, updateAlliances, runDefections, attitude, setStatus } from '../js/characterEngine.js';
import { applyFx, revealSecret, exposeSecret, newReport } from '../js/effects.js';
import { getRel, isAlly, isEnemy, countEnemies } from '../js/state.js';
import { syncStateFlags } from '../js/characterEngine.js';
import { isEligible } from '../js/eventEngine.js';
import { EVENTS } from '../data/events.js';
import { fresh } from './helpers.js';

test('character stats clamp and status changes are reported', () => {
  const s = fresh();
  applyCharFx(s, 'varen', { trust: 80, resent: -50 });
  assert.equal(s.chars.varen.trust, 100); assert.equal(s.chars.varen.resent, 0);
  const change = applyCharFx(s, 'varen', { status: 'exiled' });
  assert.deepEqual(change, { id: 'varen', from: 'court', to: 'exiled' });
  assert.equal(applyCharFx(s, 'varen', { status: 'exiled' }), null);
});

test('relationship deltas add numerics and set booleans', () => {
  const s = fresh();
  applyRelFx(s, ['kovane', 'varen', { trust: 20, alliance: true, benefit: 40 }]);
  const r = getRel(s, 'varen', 'kovane');
  assert.equal(r.trust, 35); assert.equal(r.alliance, true); assert.equal(r.benefit, 40);
  applyRelFx(s, ['varen', 'kovane', { trust: -200, alliance: false }]);
  assert.equal(r.trust, 0); assert.equal(r.alliance, false);
});

test('favouring one character makes their rivals resentful', () => {
  const s = fresh();
  const before = s.chars.dorne.resent;
  applyFx(s, { chars: { varen: { trust: 12 } } }, newReport(), { propagate: true });
  assert.equal(s.chars.dorne.resent, before + 3);
  assert.ok(s.chars.dorne.suspicion > 5);
});

test('humiliating someone warms their enemies to you', () => {
  const s = fresh();
  const before = s.chars.dorne.trust;
  applyFx(s, { chars: { varen: { resent: 15 } } }, newReport(), { propagate: true });
  assert.equal(s.chars.dorne.trust, before + 3);
});

test('resentful characters with a shared grievance form hidden alliances', () => {
  const s = fresh();
  s.chars.kovane.resent = 60; s.chars.vask.resent = 60;
  const notes = updateAlliances(s);
  assert.ok(getRel(s, 'kovane', 'vask').alliance);
  assert.ok(notes[0].hidden);
  assert.ok(!getRel(s, 'kovane', 'vask').allianceKnown);
});

test('rivals do not ally even when both resent the player', () => {
  const s = fresh();
  s.chars.varen.resent = 70; s.chars.dorne.resent = 70;
  updateAlliances(s);
  assert.ok(!getRel(s, 'varen', 'dorne').alliance);
});

test('leaving court dissolves alliances and counts as no ally/enemy', () => {
  const s = fresh();
  s.chars.kovane.trust = 80; s.chars.kovane.resent = 0;
  assert.ok(isAlly(s, 'kovane'));
  getRel(s, 'varen', 'kovane').alliance = true;
  setStatus(s, 'varen', 'exiled');
  assert.equal(getRel(s, 'varen', 'kovane').alliance, false);
  s.chars.vask.resent = 80; assert.ok(isEnemy(s, 'vask'));
  setStatus(s, 'vask', 'imprisoned'); assert.ok(!isEnemy(s, 'vask'));
});

test('defection: distrust plus resentment makes a defector turn, and counts as a betrayal', () => {
  const s = fresh();
  s.chars.rask.trust = 10; s.chars.rask.resent = 70;
  s.chars.varen.trust = 10; s.chars.varen.resent = 70; // varen cannot defect (not a canDefect character)
  const notes = runDefections(s);
  assert.equal(s.chars.rask.status, 'defected');
  assert.equal(s.chars.varen.status, 'court');
  assert.equal(s.stats.betrayals, 1); assert.equal(notes[0].kind, 'betrayal'); assert.equal(s.betrayals.length, 1);
});

test('a coalition flag mirrors the number of enemies', () => {
  const s = fresh();
  for (const id of ['varen', 'dorne', 'vask']) s.chars[id].resent = 60;
  syncStateFlags(s); assert.ok(s.flags.coalition);
  s.chars.vask.resent = 0; syncStateFlags(s); assert.ok(!s.flags.coalition);
});

test('dead or exiled characters never speak again', () => {
  const s = fresh();
  for (const ev of Object.values(EVENTS)) if (ev.char !== 'crowd') {
    s.chars[ev.char].status = 'dead';
    assert.ok(!isEligible(s, ev), `${ev.id} must not be eligible with a dead speaker`);
    s.chars[ev.char].status = 'court';
  }
});

test('attitude: masked characters look friendly until their agenda is known or the mask slips', () => {
  const s = fresh();
  s.chars.varen.trust = 5; s.chars.varen.resent = 40;
  assert.equal(attitude(s, 'varen').label, 'Devoted');
  s.chars.varen.agendaKnown = true; assert.notEqual(attitude(s, 'varen').label, 'Devoted');
  s.chars.varen.agendaKnown = false; s.chars.varen.resent = 90; assert.notEqual(attitude(s, 'varen').label, 'Devoted');
  s.chars.varen.status = 'exiled'; assert.equal(attitude(s, 'varen').label, 'Left the company');
});

// ---- secrets
test('revealing a secret is idempotent and marks agendas as known', () => {
  const s = fresh();
  const r = newReport();
  assert.ok(revealSecret(s, 'agenda_varen', r));
  assert.ok(!revealSecret(s, 'agenda_varen', r));
  assert.ok(s.chars.varen.agendaKnown);
  assert.equal(r.secrets.length, 1);
  assert.ok(!revealSecret(s, 'no_such_secret', r));
});

test('revealing a two-person secret makes their hidden tie visible', () => {
  const s = fresh();
  assert.ok(!getRel(s, 'varen', 'ysolde').public);
  getRel(s, 'varen', 'kovane').alliance = true;
  revealSecret(s, 'varen_kovane_pact');
  assert.ok(getRel(s, 'varen', 'kovane').allianceKnown);
});

test('exposing needs a known secret; credible with evidence, backfires without', () => {
  const a = fresh();
  assert.equal(exposeSecret(a, 'varen_kovane_pact'), null, 'cannot expose an unknown secret');
  revealSecret(a, 'varen_kovane_pact');
  const rep = a.meters.reputation;
  assert.equal(exposeSecret(a, 'varen_kovane_pact'), false);
  assert.ok(a.meters.reputation < rep, 'backfire hurts reputation');
  assert.equal(a.chars.varen.status, 'court');
  assert.equal(exposeSecret(a, 'varen_kovane_pact'), null, 'cannot be exposed twice');

  const b = fresh();
  revealSecret(b, 'varen_kovane_pact'); b.flags.evidence_varen_kovane_pact = true;
  assert.equal(exposeSecret(b, 'varen_kovane_pact'), true);
  assert.equal(b.chars.varen.status, 'exiled');
  assert.ok(b.flags.conspiracy_exposed); assert.equal(b.stats.conspiracies, 1);
});

test('the fallout of an exposure depends on who benefits: Dorne exposed hurts her, hearsay hurts you', () => {
  const s = fresh(); revealSecret(s, 'dorne_vask_funds'); s.flags.evidence_dorne_vask_funds = true;
  exposeSecret(s, 'dorne_vask_funds');
  assert.equal(s.chars.dorne.status, 'exiled'); assert.ok(s.flags.dorne_disgraced);
});

test('pseudo-ids resolve against the reign ($culprit, $topEnemy)', () => {
  const s = fresh(); s.params.culprit = 'quill';
  applyFx(s, { chars: { $culprit: { status: 'imprisoned' } } });
  assert.equal(s.chars.quill.status, 'imprisoned');
  s.chars.vask.resent = 90;
  applyFx(s, { chars: { $topEnemy: { status: 'exiled' } } });
  assert.equal(s.chars.vask.status, 'exiled');
});
