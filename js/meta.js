// Cross-reign progression ("meta"): discoveries, endings, achievements and unlocks.
import { ACHIEVEMENTS, TRACKED_FLAGS } from '../data/achievements.js';
import { BACKGROUNDS } from '../data/world.js';

export const META_VERSION = 1;

export function createMeta() {
  return { v: META_VERSION, reigns: 0, endings: {}, laws: {}, agendas: {}, agendaTexts: {}, events: {}, daily: {}, secrets: {}, chars: {}, stories: {}, objectivesDone: {}, achievements: {}, flagsEver: {}, bestTurns: 0, seenTutorial: false };
}

// Incrementally copy discoveries from the active reign. Cheap enough to run after every decision.
export function recordProgress(meta, state, events = {}) {
  for (const [id, turn] of Object.entries(state.laws)) {
    meta.laws[id] ||= { count: 0, first: state.reignId };
    if (turn && !meta.laws[id].seenIn?.includes(state.reignId)) {
      meta.laws[id].count++;
      (meta.laws[id].seenIn ||= []).push(state.reignId);
    }
  }
  for (const [id, c] of Object.entries(state.chars)) {
    if (c.met) meta.chars[id] = { met: true };
    if (c.agendaKnown) { meta.agendas[id] = true; (meta.agendaTexts[id] ||= {})[c.variant] = true; }
  }
  for (const id of Object.keys(state.secrets)) meta.secrets[id] = true;
  for (const id of Object.keys(state.played)) meta.events[id] = true;
  for (const h of state.history) if (h.major && !meta.stories[h.id]) meta.stories[h.id] = { title: h.title, reign: state.reignId };
  for (const f of TRACKED_FLAGS) if (state.flags[f]) meta.flagsEver[f] = true;
  meta.bestTurns = Math.max(meta.bestTurns, state.turn - 1);
}

// Called once when a reign ends. Returns the achievements newly unlocked.
export function finishReign(meta, state, endingId) {
  recordProgress(meta, state);
  meta.reigns++;
  meta.endings[endingId] = (meta.endings[endingId] || 0) + 1;
  if (state.objective?.status === 'done') meta.objectivesDone[state.objective.id] = (meta.objectivesDone[state.objective.id] || 0) + 1;
  const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (meta.achievements[a.id]) continue;
    if (a.check({ meta, state, ending: endingId })) { meta.achievements[a.id] = Date.now(); fresh.push(a); }
  }
  return fresh;
}

export function isBackgroundUnlocked(meta, bg) {
  const u = bg.unlock;
  if (!u) return true;
  if (u.reigns && meta.reigns < u.reigns) return false;
  if (u.endings && Object.keys(meta.endings).length < u.endings) return false;
  if (u.achievement && !meta.achievements[u.achievement]) return false;
  return true;
}
export const unlockedBackgrounds = meta => BACKGROUNDS.filter(b => isBackgroundUnlocked(meta, b));
