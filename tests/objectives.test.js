import test from 'node:test';
import assert from 'node:assert/strict';
import { OBJECTIVES } from '../data/objectives.js';
import { assignObjective, objectiveView, updateObjective } from '../js/objectives.js';
import { applyCharFx } from '../js/characterEngine.js';
import { revealSecret } from '../js/effects.js';
import { fresh } from './helpers.js';

const make = (id, seed = 2) => { const s = fresh(seed); assignObjective(s, OBJECTIVES, id); return s; };

test('every objective can be assigned and viewed', () => {
  for (const o of OBJECTIVES) {
    const s = make(o.id);
    const v = objectiveView(s);
    assert.equal(v.id, o.id); assert.ok(v.brief.length > 10); assert.ok(!v.brief.includes('{'));
    assert.ok(v.steps.every(st => !st.label.includes('{')));
    assert.equal(s.objective.status, 'active');
  }
});

// Each objective must be achievable: construct a state satisfying its stated conditions and check it completes.
const achieve = {
  influence: s => { s.rank = 3; s.meters.authority = 70; for (const id of ['kovane', 'quill']) { s.chars[id].trust = 80; s.chars[id].resent = 0; } },
  conspiracy: s => { s.flags.conspiracy_exposed = true; },
  remove: s => { applyCharFx(s, s.params.target, { status: 'exiled' }); },
  alliances: s => { for (const id of ['kovane', 'quill', 'aubry']) { s.chars[id].trust = 80; s.chars[id].resent = 0; } },
  rich_trusted: s => { Object.assign(s.meters, { resources: 75, loyalty: 50, reputation: 50 }); },
  clean: s => { s.turn = 26; },
  summit: s => { s.rank = 4; s.meters.reputation = 60; },
  agendas: s => { for (const id of ['varen', 'kovane', 'dorne']) revealSecret(s, `agenda_${id}`); },
  unmask: s => { revealSecret(s, 'veiled_hand_identity'); },
};
for (const o of OBJECTIVES) {
  test(`objective "${o.id}" is achievable and completes`, () => {
    const s = make(o.id);
    assert.ok(achieve[o.id], 'test recipe exists');
    achieve[o.id](s);
    updateObjective(s, { final: true });
    assert.equal(s.objective.status, 'done');
  });
}

test('"final" objectives only lock in when the reign ends', () => {
  const s = make('rich_trusted'); achieve.rich_trusted(s);
  assert.equal(updateObjective(s), 'active');
  assert.equal(updateObjective(s, { final: true }), 'done');
});

test('non-final objectives complete as soon as their conditions are met', () => {
  const s = make('conspiracy'); assert.equal(updateObjective(s), 'active');
  s.flags.conspiracy_exposed = true; assert.equal(updateObjective(s), 'done');
});

test('a betrayal fails "Clean Hands" for good', () => {
  const s = make('clean'); s.stats.betrayals = 1; s.turn = 30;
  assert.equal(updateObjective(s), 'failed');
  s.stats.betrayals = 0; assert.equal(updateObjective(s), 'failed');
});

test('unfinished objectives fail at the end of the reign', () => {
  const s = make('agendas'); assert.equal(updateObjective(s, { final: true }), 'failed');
});

test('"remove a rival" never targets Varen when he is not a schemer', () => {
  for (let i = 0; i < 80; i++) {
    const s = fresh('t' + i); assignObjective(s, OBJECTIVES, 'remove');
    if (s.params.target === 'varen') assert.ok(s.flags.varen_schemer);
    assert.ok(['dorne', 'vask', 'varen'].includes(s.params.target));
  }
});

test('objectives are assigned at random across seeds', () => {
  const ids = new Set();
  for (let i = 0; i < 60; i++) { const s = fresh('o' + i); ids.add(s.objective.id); }
  assert.ok(ids.size >= 6);
});
