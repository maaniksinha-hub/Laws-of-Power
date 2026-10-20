// Core state shape and tiny helpers shared by every engine module.
import { CHARACTERS, RELATIONS } from '../data/characters.js';
import { METERS, METER_ALIAS } from '../data/world.js';

export const SAVE_VERSION = 1;
export const NUM_KEYS = ['trust', 'fear', 'resent', 'ambition', 'obligation', 'suspicion'];
export const REL_NUM_KEYS = ['trust', 'rivalry', 'fear', 'obligation', 'benefit', 'suspicion'];

export const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
export const meterKey = k => METER_ALIAS[k] || k;
export const relKey = (a, b) => [a, b].sort().join('|');
export const newRel = () => ({ trust: 0, rivalry: 0, fear: 0, obligation: 0, benefit: 0, suspicion: 0, alliance: false, allianceKnown: false, public: false });

export function getRel(state, a, b) {
  const k = relKey(a, b);
  return (state.relations[k] ||= newRel());
}

// Resolve `$target`, `$culprit` and `$topEnemy` pseudo-ids against the reign.
export function resolveId(state, id) {
  if (typeof id !== 'string' || id[0] !== '$') return id;
  const name = id.slice(1);
  if (name === 'topEnemy') {
    let best = null;
    for (const [cid, c] of Object.entries(state.chars)) {
      if (CHARACTERS[cid]?.generic || c.status !== 'court') continue;
      if (!best || c.resent > state.chars[best].resent) best = cid;
    }
    return best;
  }
  return state.params?.[name] ?? null;
}

export const isGeneric = id => !!CHARACTERS[id]?.generic;
export const inCourt = (state, id) => state.chars[id]?.status === 'court';
export const courtChars = state => Object.keys(state.chars).filter(id => !isGeneric(id) && state.chars[id].status === 'court');
export const isAlly = (state, id) => { const c = state.chars[id]; return !!c && !isGeneric(id) && c.status === 'court' && c.trust >= 65 && c.resent < 40; };
export const isEnemy = (state, id) => { const c = state.chars[id]; return !!c && !isGeneric(id) && c.status === 'court' && c.resent >= 50; };
export const countAllies = state => Object.keys(state.chars).filter(id => isAlly(state, id)).length;
export const countEnemies = state => Object.keys(state.chars).filter(id => isEnemy(state, id)).length;
export const agendasKnown = state => Object.values(state.chars).filter(c => c.agendaKnown).length;

export function newCharState(id) {
  const def = CHARACTERS[id];
  return { status: 'court', ...def.start, role: def.role, variant: def.variants[0].id, agendaKnown: false, met: false, memory: [], leftTurn: null };
}

export function createBaseState(seed) {
  const chars = {};
  for (const id of Object.keys(CHARACTERS)) chars[id] = newCharState(id);
  const relations = {};
  for (const [a, b, vals, pub] of RELATIONS) relations[relKey(a, b)] = { ...newRel(), ...vals, public: !!pub };
  return {
    v: SAVE_VERSION, reignId: 1, seed, rng: seed >>> 0, turn: 1, rank: 0, background: null,
    meters: Object.fromEntries(METERS.map(m => [m, 50])),
    current: null, pendingResult: null, history: [], recent: [], played: {}, lastTurn: {}, choices: {},
    queue: [], chars, relations, secrets: {}, laws: {}, flags: {}, params: {}, stats: { betrayals: 0, manipulations: 0, conspiracies: 0 },
    styles: {}, trace: [], betrayals: [], activePressures: [], warned: {}, fired: {}, objective: null, forcedEnding: null, ending: null, log: [],
  };
}
