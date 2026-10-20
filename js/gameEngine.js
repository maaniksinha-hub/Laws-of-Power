// Game rules and state transitions: starting a reign, resolving a choice, ticking the world, finding the ending.
import { EVENTS } from '../data/events.js';
import { ENDINGS } from '../data/endings.js';
import { OBJECTIVES } from '../data/objectives.js';
import { CHARACTERS, agendaSecretId } from '../data/characters.js';
import { BACKGROUNDS, MAX_TURN, METERS, METER_INFO, PRESSURES, RANKS, RANK_TURNS, STYLES } from '../data/world.js';
import { LAW_BY_ID } from '../data/laws.js';
import { check, fillTokens, pickText } from './conditions.js';
import { applyFx, newReport, revealSecret } from './effects.js';
import { driftCharacters, runDefections, runReactions, rollVariants, syncStateFlags, updateAlliances, applyCharFx } from './characterEngine.js';
import { pickEvent, participants, RECENT_WINDOW, addressFor } from './eventEngine.js';
import { assignObjective, objectiveView, updateObjective } from './objectives.js';
import { random, pickWeighted, hashSeed } from './rng.js';
import { agendasKnown, countAllies, courtChars, createBaseState, isAlly, isEnemy } from './state.js';

export const DEFAULT_CONTENT = { events: EVENTS, endings: ENDINGS, objectives: OBJECTIVES };
const CULPRITS = ['vask', 'dorne', 'quill'];

export function newReign(meta = { reigns: 0 }, { seed = null, background = null, objective = null, content = DEFAULT_CONTENT } = {}) {
  const s = seed ?? Math.floor(Math.random() * 2 ** 32);
  const state = createBaseState(hashSeed(s));
  state.seed = s;
  state.reignId = (meta.reigns || 0) + 1;
  rollVariants(state);
  state.params.culprit = pickWeighted(state, CULPRITS, () => 1);
  state.flags[`culprit_${state.params.culprit}`] = true;

  const bg = BACKGROUNDS.find(b => b.id === background) || BACKGROUNDS[0];
  state.background = bg.id;
  Object.assign(state.meters, bg.meters);
  for (const [id, d] of Object.entries(bg.chars || {})) applyCharFx(state, id, d);
  for (const f of bg.flags || []) state.flags[f] = true;
  for (const id of bg.reveal || []) revealSecret(state, id);
  if (bg.revealAgenda) {
    const pool = Object.keys(CHARACTERS).filter(id => !CHARACTERS[id].generic && !['isaura', 'aldric'].includes(id));
    for (let i = 0; i < bg.revealAgenda; i++) revealSecret(state, agendaSecretId(pickWeighted(state, pool, () => 1)));
  }
  assignObjective(state, content.objectives, objective);
  syncStateFlags(state);
  return state;
}

export const getEvent = (state, content = DEFAULT_CONTENT) => (state.current ? content.events[state.current.id] : null);

// Draw the next card. Returns null if the reign is over.
export function advance(state, content = DEFAULT_CONTENT) {
  if (state.ending) return null;
  const { event, source } = pickEvent(state, content.events);
  state.current = { id: event.id, source, turn: state.turn };
  state.played[event.id] = (state.played[event.id] || 0) + 1;
  state.lastTurn[event.id] = state.turn;
  state.recent.push(event.id);
  if (state.recent.length > RECENT_WINDOW) state.recent.shift();
  for (const id of participants(event)) if (state.chars[id]) state.chars[id].met = true;
  return event;
}

function selectBranch(state, ch) {
  for (const b of ch.branches || []) {
    if (!check(b.when, state)) continue;
    if (b.chance != null && random(state) >= b.chance) continue;
    return b;
  }
  return null;
}

export function choose(state, side, content = DEFAULT_CONTENT) {
  if (state.ending || state.pendingResult || !state.current) return null; // duplicate-choice guard
  if (side !== 'left' && side !== 'right') return null;
  const ev = content.events[state.current.id];
  const ch = ev[side];
  const report = newReport();
  const turnPlayed = state.turn;

  const branch = selectBranch(state, ch);
  applyFx(state, ch.fx, report, { propagate: true });
  if (branch) applyFx(state, branch.fx, report, { propagate: true });
  state.choices[ev.id] = side;
  if (ch.style) state.styles[ch.style] = (state.styles[ch.style] || 0) + 1;
  const memo = branch?.memo ?? ch.memo;
  if (memo && state.chars[ev.char]) {
    const mem = state.chars[ev.char].memory;
    mem.push({ turn: turnPlayed, text: memo });
    if (mem.length > 10) mem.shift();
  }
  const resultText = fillTokens(branch?.result ?? ch.result ?? '', state, addressFor(state));
  const label = fillTokens(pickText(ch.label, state), state, addressFor(state));
  state.history.push({ turn: turnPlayed, id: ev.id, title: ev.title, theme: ev.theme, char: ev.char, side, label, result: resultText, major: !!ev.major, style: ch.style || null });

  let lesson = null;
  if (ev.lesson) {
    const law = LAW_BY_ID[`law${ev.lesson.law}`];
    state.laws[law.id] = turnPlayed;
    lesson = { lawId: law.id, n: law.n, title: law.title, text: ev.lesson[side], defense: law.defense };
    report.laws.push(law.id);
  }

  const tick = tickWorld(state, report);
  state.turn += 1;
  const rankUp = updateRank(state, report);
  updateObjective(state, { objectives: content.objectives });
  trackWarnings(state, report);
  const ending = resolveEnding(state, content);

  const result = {
    eventId: ev.id, title: ev.title, side, label, text: resultText,
    changes: { ...report.meters }, notes: report.notes.filter(n => !n.hidden).concat(tick.notes),
    lesson, ending: ending?.id ?? null, rankUp, turn: turnPlayed,
    secrets: report.secrets.slice(),
  };
  state.pendingResult = result;
  state.current = null;
  return result;
}

// Per-turn world update: pressures, reactions, alliances, defections, drift, derived flags.
function tickWorld(state, report) {
  const notes = [];
  const active = [];
  for (const p of PRESSURES) {
    if (!check(p.when, state)) continue;
    active.push(p.id);
    if (!state.activePressures.includes(p.id)) notes.push({ kind: 'warning', text: p.warn });
    applyFx(state, p.fx, report);
  }
  state.activePressures = active;
  runReactions(state, applyFx, report);
  updateAlliances(state);
  notes.push(...runDefections(state));
  driftCharacters(state);
  syncStateFlags(state);
  return { notes };
}

function updateRank(state, report) {
  const before = state.rank;
  if (state.flags.regent) state.rank = 4;
  while (state.rank < 3 && state.turn >= RANK_TURNS[state.rank + 1] && (state.meters.authority + state.meters.reputation) / 2 >= 40) state.rank++;
  if (state.rank > before) {
    report.notes.push({ kind: 'rank', text: `You are now ${RANKS[state.rank].title}.` });
    return true;
  }
  return false;
}

function trackWarnings(state, report) {
  for (const m of METERS) {
    const v = state.meters[m];
    const zone = v <= 15 ? 'low' : v >= 85 ? 'high' : null;
    if (zone && state.warned[m] !== zone) {
      state.warned[m] = zone;
      report.notes.push({ kind: 'warning', text: `${METER_INFO[m].label} is dangerously ${zone}.` });
    } else if (!zone) delete state.warned[m];
  }
}

export function resolveEnding(state, content = DEFAULT_CONTENT) {
  if (state.ending) return content.endings.find(e => e.id === state.ending.id);
  const byPriority = [...content.endings].sort((a, b) => b.priority - a.priority);
  let end = null;
  if (state.forcedEnding) end = content.endings.find(e => e.id === state.forcedEnding);
  if (!end) end = byPriority.find(e => e.trigger === 'crisis' && check(e.when, state)) || null;
  const isFinal = !end && state.turn > MAX_TURN;
  if (end || isFinal) updateObjective(state, { final: true, objectives: content.objectives });
  if (isFinal) end = byPriority.find(e => e.trigger === 'final' && check(e.when, state));
  if (end) state.ending = { id: end.id, turn: state.turn - 1 };
  return end || null;
}

// The player has seen the result; move on. Returns the next event, or null when the reign has ended.
export function continueReign(state, content = DEFAULT_CONTENT) {
  state.pendingResult = null;
  return state.ending ? null : advance(state, content);
}

export function endingView(state, content = DEFAULT_CONTENT) {
  const def = content.endings.find(e => e.id === state.ending?.id);
  if (!def) return null;
  return { ...def, text: fillTokens(pickText(def.text, state), state) };
}

export function strategicStyle(state) {
  const entries = Object.entries(state.styles).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return { top: null, text: 'Too few decisions to read a pattern.' };
  const [top, second] = entries;
  const pct = Math.round((top[1] / entries.reduce((s, e) => s + e[1], 0)) * 100);
  let text = `${STYLES[top[0]].label} (${pct}% of your moves). ${STYLES[top[0]].blurb}`;
  if (second && second[1] >= top[1] * 0.6) text += ` Often paired with ${STYLES[second[0]].label.toLowerCase()}.`;
  return { top: top[0], second: second?.[0] ?? null, text };
}

export function buildSummary(state, content = DEFAULT_CONTENT) {
  const ending = endingView(state, content);
  const chars = Object.keys(state.chars).filter(id => !CHARACTERS[id].generic);
  const secrets = Object.keys(state.secrets);
  return {
    ending, turns: state.turn - 1, rank: RANKS[state.rank].title,
    objective: objectiveView(state, content.objectives),
    majorDecisions: state.history.filter(h => h.major),
    allies: chars.filter(id => isAlly(state, id)),
    enemies: chars.filter(id => isEnemy(state, id) || state.chars[id].status === 'defected'),
    departed: chars.filter(id => state.chars[id].status !== 'court').map(id => ({ id, status: state.chars[id].status })),
    secrets, betrayals: state.betrayals, laws: Object.keys(state.laws),
    style: strategicStyle(state), meters: { ...state.meters },
    agendas: agendasKnown(state), alliesCount: countAllies(state),
  };
}
export { courtChars };
