// Secret objectives: assignment, live progress and completion.
import { OBJECTIVES } from '../data/objectives.js';
import { CHARACTERS } from '../data/characters.js';
import { check } from './conditions.js';
import { pickWeighted } from './rng.js';

export const OBJECTIVE_BY_ID = Object.fromEntries(OBJECTIVES.map(o => [o.id, o]));

export function assignObjective(state, objectives = OBJECTIVES, forceId = null) {
  const def = forceId ? objectives.find(o => o.id === forceId) : pickWeighted(state, objectives, () => 1);
  let target = null;
  if (def.pool) {
    const valid = def.pool.filter(p => check(p.when, state));
    target = pickWeighted(state, valid, () => 1).id;
    state.params.target = target;
  }
  state.objective = { id: def.id, status: 'active', themes: def.themes || [], target };
  return state.objective;
}

const fill = (str, state) => String(str).replace(/\{target\}/g, CHARACTERS[state.params.target]?.name ?? 'your rival');

export function objectiveView(state, objectives = OBJECTIVES) {
  const o = state.objective;
  if (!o) return null;
  const def = objectives.find(x => x.id === o.id);
  if (!def) return null;
  const steps = def.steps.map(s => ({ label: fill(s.label, state), done: check(s.when, state) }));
  return { id: def.id, title: def.title, brief: fill(def.brief, state), status: o.status, steps, final: !!def.final };
}

// Re-evaluate. `final` is true when the reign ends, which locks in `final` objectives.
export function updateObjective(state, { final = false, objectives = OBJECTIVES } = {}) {
  const o = state.objective;
  if (!o || o.status !== 'active') return o?.status;
  const def = objectives.find(x => x.id === o.id);
  if (!def) return o.status;
  const met = def.steps.every(s => check(s.when, state));
  if (def.fail && check(def.fail, state)) { o.status = 'failed'; o.turn = state.turn; return o.status; }
  if (met && (!def.final || final)) { o.status = 'done'; o.turn = state.turn; return o.status; }
  if (final) { o.status = 'failed'; o.turn = state.turn; }
  return o.status;
}
