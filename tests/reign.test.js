import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, buildSummary, choose, continueReign, newReign, DEFAULT_CONTENT } from '../js/gameEngine.js';
import { EVENT_LIST, EVENTS } from '../data/events.js';
import { MAX_TURN } from '../data/world.js';
import { validateState } from '../js/saveManager.js';
import { pickEvent, isEligible } from '../js/eventEngine.js';
import { fresh } from './helpers.js';

// Force a specific card onto the table the way advance() would.
function show(s, id) {
  s.pendingResult = null; s.current = { id, source: 'test', turn: s.turn };
  s.played[id] = (s.played[id] || 0) + 1; s.lastTurn[id] = s.turn; s.recent.push(id);
  for (const c of [EVENTS[id].char, ...(EVENTS[id].others || [])]) if (s.chars[c]) s.chars[c].met = true;
}
const play = (s, id, side) => { show(s, id); const r = choose(s, side); assert.ok(r, `${id} ${side} resolved`); s.pendingResult = null; return r; };
const seedWith = (pred, opts) => { for (let i = 0; i < 500; i++) { const s = newReign({ reigns: 0 }, { seed: `find${i}`, ...opts }); if (pred(s)) return s; } throw new Error('no seed'); };

test('a complete scripted reign runs to an ending, with consistent history and valid state', () => {
  const s = fresh('script');
  const script = ['left', 'right', 'right', 'left', 'right', 'left', 'left', 'right'];
  let e = advance(s), i = 0;
  while (e) {
    assert.deepEqual(validateState(s), []);
    const r = choose(s, script[i++ % script.length]);
    assert.equal(r.eventId, e.id);
    assert.equal(s.history.length, i);
    for (const m of Object.values(s.meters)) assert.ok(m >= 0 && m <= 100);
    e = continueReign(s);
    assert.ok(i <= MAX_TURN + 1, 'reign must end');
  }
  assert.ok(s.ending, 'ending set');
  const sum = buildSummary(s);
  assert.equal(sum.turns, s.turn - 1);
  assert.ok(sum.ending.title && sum.style.text && sum.objective);
});

test('duplicate choices while a result is pending are ignored', () => {
  const s = fresh(1); advance(s);
  const before = JSON.stringify(s.meters);
  const r1 = choose(s, 'left');
  const meters = JSON.stringify(s.meters);
  assert.ok(r1); assert.equal(choose(s, 'left'), null); assert.equal(choose(s, 'right'), null);
  assert.equal(JSON.stringify(s.meters), meters);
  assert.equal(s.history.length, 1);
  assert.notEqual(before, undefined);
});

test('invalid sides are rejected and no choice is possible after the ending', () => {
  const s = fresh(1); advance(s);
  assert.equal(choose(s, 'up'), null);
  s.forcedEnding = 'abandoned'; choose(s, 'left'); assert.ok(s.ending);
  assert.equal(continueReign(s), null); assert.equal(choose(s, 'left'), null);
});

test('both choices of every event resolve without error and leave valid state', () => {
  for (const ev of EVENT_LIST) for (const side of ['left', 'right']) for (const seed of ['p', 'q', 'r']) {
    const s = fresh(seed + ev.id);
    s.turn = 20; s.rank = 2; s.chars[ev.char].status = 'court';
    if (ev.allowAbsent) s.chars.rask.status = 'defected';
    show(s, ev.id);
    let r;
    assert.doesNotThrow(() => { r = choose(s, side); }, `${ev.id}.${side}`);
    assert.ok(r && typeof r.text === 'string', `${ev.id}.${side} result`);
    assert.deepEqual(validateState(s), [], `${ev.id}.${side} state`);
    for (const q of s.queue) assert.ok(EVENTS[q.id]);
  }
});

test('200 random reigns: no crash, always an ending, never invalid, deck never dry', () => {
  for (let n = 0; n < 200; n++) {
    const s = fresh('bot' + n);
    let e = advance(s), g = 0;
    while (e) {
      assert.ok(e, 'deck produced a card');
      choose(s, (n * 31 + g * 17 + (g >> 2)) % 5 < 2 ? 'left' : 'right'); g++;
      assert.deepEqual(validateState(s), [], `reign ${n} turn ${g}`);
      e = continueReign(s);
      assert.ok(g <= MAX_TURN + 1);
    }
    assert.ok(s.ending);
  }
});

// ---- consequence chains
test('Chain: giving Varen the guard (schemer) forms a hidden alliance; investigating reveals it; exposure exiles him', () => {
  const s = seedWith(x => x.flags.varen_schemer && x.flags.kovane_steady);
  s.turn = 6; s.rank = 1;
  assert.ok(!s.relations['kovane|varen'].alliance);
  play(s, 'varen_guard', 'right');
  assert.ok(s.relations['kovane|varen'].alliance, 'Varen and Kovane quietly allied');
  assert.ok(!s.relations['kovane|varen'].allianceKnown, 'the player cannot see it');
  assert.ok(s.queue.some(q => q.id === 'rumour_meeting'));
  s.turn += 3;
  assert.ok(isEligible(s, EVENTS.rumour_meeting));
  play(s, 'rumour_meeting', 'right');
  assert.ok(s.secrets.varen_kovane_pact && s.relations['kovane|varen'].allianceKnown);
  s.turn += 1;
  assert.ok(isEligible(s, EVENTS.varen_confront));
  s.meters.authority = 60;
  play(s, 'varen_confront', 'left');
  assert.equal(s.chars.varen.status, 'exiled');
  assert.ok(s.flags.conspiracy_exposed);
});

test('Chain: ignoring the rumour lets the conspiracy ripen into a coup that can end the reign', () => {
  const s = seedWith(x => x.flags.varen_schemer);
  s.turn = 6; s.rank = 1;
  play(s, 'varen_guard', 'right'); s.turn += 3;
  play(s, 'rumour_meeting', 'left'); s.turn += 4;
  assert.ok(isEligible(s, EVENTS.conspiracy_ripens));
  assert.ok(!isEligible(s, EVENTS.varen_confront), 'no proof, no confrontation');
  play(s, 'conspiracy_ripens', 'right'); s.turn += 4;
  assert.ok(isEligible(s, EVENTS.the_coup));
  Object.assign(s.meters, { loyalty: 20, authority: 30 }); delete s.flags.coup_weakened;
  play(s, 'the_coup', 'left');
  assert.equal(s.forcedEnding, 'overthrown');
  // ...whereas a well-supported player survives the same coup
  const t = seedWith(x => x.flags.varen_schemer); t.turn = 6; t.rank = 1;
  play(t, 'varen_guard', 'right'); t.turn += 3; play(t, 'rumour_meeting', 'left'); t.turn += 4; play(t, 'conspiracy_ripens', 'right'); t.turn += 4;
  Object.assign(t.meters, { loyalty: 70, authority: 60 });
  play(t, 'the_coup', 'left');
  assert.equal(t.chars.varen.status, 'exiled'); assert.equal(t.forcedEnding, null);
});

test('Chain: an honest Varen is cleared by investigation, and watching him costs trust when found', () => {
  const s = seedWith(x => x.flags.varen_honest);
  s.turn = 6; s.rank = 1;
  play(s, 'varen_guard', 'right');
  assert.ok(!s.relations['kovane|varen'].alliance, 'no conspiracy exists');
  s.turn += 3; play(s, 'rumour_meeting', 'right');
  assert.ok(s.secrets.kovane_pay_petition && !s.secrets.varen_kovane_pact);
  assert.ok(!isEligible(s, EVENTS.varen_confront));
  s.turn += 4; assert.ok(isEligible(s, EVENTS.watchers_found));
  const trust = s.chars.varen.trust; play(s, 'watchers_found', 'right');
  assert.ok(s.chars.varen.trust < trust);
});

test('refusing Varen is remembered and blocks the guard chain', () => {
  const s = seedWith(x => x.flags.varen_schemer);
  s.turn = 6; s.rank = 1; play(s, 'varen_guard', 'left');
  assert.ok(s.flags.varen_denied && !s.flags.varen_guard);
  assert.ok(!isEligible(s, EVENTS.rumour_meeting));
  assert.ok(s.chars.varen.memory.some(m => /said no/i.test(m.text)));
});

test('Chain: taking the loan makes Vask collect; paying with an empty treasury hurts further', () => {
  const s = fresh('vask'); s.turn = 9; s.meters.resources = 40;
  play(s, 'vask_loan', 'right');
  assert.ok(s.flags.vask_debt && s.chars.vask.obligation >= 30);
  s.turn += 6; assert.ok(isEligible(s, EVENTS.vask_collect));
  s.meters.resources = 20; const loy = s.meters.loyalty;
  play(s, 'vask_collect', 'right');
  assert.ok(s.meters.loyalty < loy); assert.ok(!s.flags.vask_debt && s.flags.vask_resentful);
});

test('Chain: tracing the pamphlets exposes Vask, who can be removed (objective path)', () => {
  const s = fresh('pamph'); s.turn = 8;
  play(s, 'anselm_charter', 'left'); s.turn += 4;
  play(s, 'pamphlet_storm', 'right');
  assert.ok(s.secrets.vask_funds_pamphlets && s.flags.evidence_vask_funds_pamphlets);
  s.turn += 1; play(s, 'vask_confrontation', 'left');
  assert.equal(s.chars.vask.status, 'imprisoned'); assert.ok(s.flags.conspiracy_exposed);
});

test('Chain: the poisoner is determined by the reign and removed by the investigation', () => {
  const s = fresh('poison'); const culprit = s.params.culprit;
  s.turn = 10; play(s, 'king_ill', 'left'); s.turn += 4;
  play(s, 'tasting_cup', 'right');
  assert.ok(s.flags.poison_confirmed && s.flags.poison_survived, 'known poison + antidote');
  assert.ok(isEligible(s, EVENTS.poisoner_unmasked) || s.chars[culprit].status !== 'court');
  play(s, 'poisoner_unmasked', 'right');
  assert.equal(s.chars[culprit].status, 'imprisoned');
});

test('Chain: Kovane left to resent you eventually defects, a betrayal that fails "Clean Hands"', () => {
  const s = seedWith(x => true); s.objective = { id: 'clean', status: 'active', themes: [] };
  s.chars.kovane.trust = 15; s.chars.kovane.resent = 70;
  show(s, 'routine_gossip'); choose(s, 'left');
  assert.equal(s.chars.kovane.status, 'defected'); assert.equal(s.stats.betrayals, 1); assert.equal(s.objective.status, 'failed');
});

test('a choice can matter much later: Ysolde\'s ledger only appears after repeated manipulation', () => {
  const s = fresh('ledger'); s.turn = 12; s.played.ysolde_first = 1;
  assert.ok(!isEligible(s, EVENTS.ysolde_ledger));
  s.stats.manipulations = 2; assert.ok(isEligible(s, EVENTS.ysolde_ledger));
});

test('a secret objective can be completed in play (expose a conspiracy)', () => {
  const s = seedWith(x => x.flags.varen_schemer);
  s.objective = { id: 'conspiracy', status: 'active', themes: [] };
  s.turn = 6; s.rank = 1; s.meters.authority = 60;
  play(s, 'varen_guard', 'right'); s.turn += 3; play(s, 'rumour_meeting', 'right'); s.turn += 1;
  show(s, 'varen_confront'); choose(s, 'left');
  assert.equal(s.objective.status, 'done');
});

test('the same decision can have different outcomes depending on state (low authority confrontation)', () => {
  const run = (auth, loy) => { const s = seedWith(x => x.flags.varen_schemer); s.turn = 6; s.rank = 1; play(s, 'varen_guard', 'right'); s.turn += 3; play(s, 'rumour_meeting', 'right'); s.meters.authority = auth; s.meters.loyalty = loy; play(s, 'varen_confront', 'left'); return s; };
  const strong = run(70, 60), weakAlone = run(25, 30), weakLoved = run(25, 70);
  assert.equal(strong.chars.varen.status, 'exiled');
  assert.equal(weakAlone.chars.varen.status, 'court'); assert.ok(weakAlone.flags.varen_survives);
  assert.equal(weakLoved.chars.varen.status, 'exiled'); assert.ok(weakLoved.flags.lowauth_victory);
});

test('a powerful player attracts new threats: extreme meters trigger systemic pressure', () => {
  const s = fresh('power'); s.turn = 5; s.meters.authority = 90;
  const before = s.chars.dorne.resent;
  show(s, 'routine_gossip'); const r = choose(s, 'left');
  assert.ok(s.chars.dorne.resent > before);
  assert.ok(r.notes.some(n => n.kind === 'warning'));
});

test('rank advances with time when authority and reputation are healthy', () => {
  const s = fresh('rank'); s.turn = 5; s.meters.authority = 60; s.meters.reputation = 60;
  show(s, 'routine_gossip'); const r = choose(s, 'left');
  assert.equal(s.rank, 1); assert.ok(r.rankUp);
});

test('starting backgrounds and objectives vary the reign', () => {
  const a = newReign({ reigns: 0 }, { seed: 1, background: 'merchant_ward' }), b = newReign({ reigns: 0 }, { seed: 1, background: 'veteran_officer' });
  assert.notDeepEqual(a.meters, b.meters);
  assert.ok(b.chars.kovane.trust > a.chars.kovane.trust);
  const g = newReign({ reigns: 0 }, { seed: 1, background: 'grey_pawn' }); assert.ok(g.flags.veiled_patron);
  const ar = newReign({ reigns: 0 }, { seed: 1, background: 'archivist' }); assert.ok(ar.chars.quill.agendaKnown);
  const ex = newReign({ reigns: 0 }, { seed: 1, background: 'returned_exile' }); assert.equal(Object.values(ex.chars).filter(c => c.agendaKnown).length, 1);
  const variants = new Set(); for (let i = 0; i < 40; i++) variants.add(newReign({ reigns: 0 }, { seed: 'v' + i }).chars.varen.variant);
  assert.equal(variants.size, 2);
});
