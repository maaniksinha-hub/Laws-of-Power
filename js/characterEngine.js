// Character behaviour: stats, status changes, relationship graph, alliances, defections and perceived attitude.
import { CHARACTERS } from '../data/characters.js';
import { STATE_FLAGS } from '../data/world.js';
import { check } from './conditions.js';
import { NUM_KEYS, REL_NUM_KEYS, clamp, courtChars, getRel, isGeneric, relKey, resolveId } from './state.js';
import { pickWeighted } from './rng.js';

// Apply a delta object to a character. Returns { id, from, to } when their status changed.
// `propagate` enables player-favour side effects on rivals (used for choice outcomes, not for background drift).
export function applyCharFx(state, rawId, d, { propagate = false } = {}) {
  const id = resolveId(state, rawId);
  const c = id && state.chars[id];
  if (!c) return null;
  for (const k of NUM_KEYS) if (d[k]) c[k] = clamp(c[k] + d[k]);
  if (d.role) c.role = d.role;
  if (propagate && !isGeneric(id)) propagateFavour(state, id, d);
  if (d.status && d.status !== c.status) {
    const from = c.status;
    setStatus(state, id, d.status);
    return { id, from, to: d.status };
  }
  return null;
}

function propagateFavour(state, id, d) {
  const favoured = (d.trust || 0) >= 10;
  const humiliated = (d.resent || 0) >= 10 || (d.trust || 0) <= -12;
  if (!favoured && !humiliated) return;
  for (const other of courtChars(state)) {
    if (other === id) continue;
    const rel = getRel(state, id, other);
    if (rel.rivalry < 40) continue;
    const o = state.chars[other];
    if (favoured) { o.resent = clamp(o.resent + 3); o.suspicion = clamp(o.suspicion + 2); }
    if (humiliated) o.trust = clamp(o.trust + 3);
  }
}

export function setStatus(state, id, status) {
  const c = state.chars[id];
  if (!c) return;
  c.status = status;
  if (status !== 'court') {
    c.leftTurn = state.turn;
    for (const [key, rel] of Object.entries(state.relations)) if (key.split('|').includes(id)) rel.alliance = false;
  }
}

// Relationship deltas: numeric keys add, boolean keys set.
export function applyRelFx(state, [rawA, rawB, d]) {
  const a = resolveId(state, rawA), b = resolveId(state, rawB);
  if (!a || !b || !state.chars[a] || !state.chars[b] || a === b) return;
  const r = getRel(state, a, b);
  for (const k of REL_NUM_KEYS) if (d[k]) r[k] = clamp(r[k] + d[k]);
  for (const k of ['alliance', 'allianceKnown']) if (typeof d[k] === 'boolean') r[k] = d[k];
}

// Resentful characters who share a grievance find each other. Hidden until the player discovers it.
export function updateAlliances(state) {
  const notes = [];
  const ids = courtChars(state);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const [a, b] = [ids[i], ids[j]];
      const ca = state.chars[a], cb = state.chars[b];
      if (ca.resent < 55 || cb.resent < 55) continue;
      const r = getRel(state, a, b);
      if (r.alliance || r.rivalry >= 60) continue;
      r.alliance = true; r.benefit = clamp(r.benefit + 30);
      state.flags[`bloc_${relKey(a, b).replace('|', '_')}`] = true;
      notes.push({ kind: 'alliance', hidden: true, text: `${CHARACTERS[a].short} and ${CHARACTERS[b].short} have found a common grievance.`, ids: [a, b] });
    }
  }
  return notes;
}

// Characters who can walk away do so when trust is gone and resentment has set in.
export function runDefections(state) {
  const notes = [];
  for (const id of courtChars(state)) {
    const def = CHARACTERS[id], c = state.chars[id];
    if (!def.canDefect || c.trust > 20 || c.resent < 65) continue;
    setStatus(state, id, 'defected');
    state.stats.betrayals = (state.stats.betrayals || 0) + 1;
    state.betrayals.push({ turn: state.turn, id, text: `${def.name} turned against you.` });
    notes.push({ kind: 'betrayal', text: `${def.name} has turned against you.`, ids: [id] });
  }
  return notes;
}

export function syncStateFlags(state) {
  for (const r of STATE_FLAGS) {
    if (check(r.when, state)) state.flags[r.flag] = true; else delete state.flags[r.flag];
  }
}

// Slow drift: ambition grows when the player looks weak; grudges fade among the content.
export function driftCharacters(state) {
  for (const id of courtChars(state)) {
    const c = state.chars[id];
    if (state.meters.authority <= 35) c.ambition = clamp(c.ambition + 2);
    if (c.resent > 0 && c.trust >= 60) c.resent = clamp(c.resent - 1);
    if (c.fear > 30 && state.turn % 2 === 0) c.fear = clamp(c.fear - 1);
  }
}

// Data-driven character reactions (see `reactions` in character definitions, optional).
export function runReactions(state, applyFx, report) {
  for (const id of courtChars(state)) {
    for (const r of CHARACTERS[id].reactions || []) {
      if (r.once !== false && state.fired[r.id]) continue;
      if (!check(r.when, state)) continue;
      state.fired[r.id] = state.turn;
      applyFx(state, r.fx, report);
    }
  }
}

export function rollVariants(state) {
  for (const [id, def] of Object.entries(CHARACTERS)) {
    const v = pickWeighted(state, def.variants, x => x.weight);
    state.chars[id].variant = v.id;
    state.flags[`${id}_${v.id}`] = true;
  }
}

// What the player can perceive of a character's attitude. Masked deceivers look friendly until their mask slips.
export function attitude(state, id) {
  const c = state.chars[id], def = CHARACTERS[id];
  if (!c) return { label: 'Unknown', tone: 'neutral' };
  if (c.status !== 'court') return { label: { dead: 'Dead', exiled: 'Exiled', defected: 'Turned against you', imprisoned: 'Imprisoned' }[c.status] || c.status, tone: 'neutral' };
  if (def.mask && !c.agendaKnown && c.resent < 70) return { label: def.mask, tone: 'good', masked: true };
  const score = c.trust - c.resent - c.suspicion * 0.4;
  if (c.fear >= 60 && score < 50) return { label: 'Afraid of you', tone: 'neutral' };
  if (score >= 60) return { label: 'Devoted', tone: 'good' };
  if (score >= 35) return { label: 'Friendly', tone: 'good' };
  if (score >= 12) return { label: 'Wary', tone: 'neutral' };
  if (score >= -10) return { label: 'Cold', tone: 'bad' };
  return { label: 'Hostile', tone: 'bad' };
}
