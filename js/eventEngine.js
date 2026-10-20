// Event eligibility and selection. Content-agnostic: everything is driven by the event table.
import { CHARACTERS } from '../data/characters.js';
import { RANKS } from '../data/world.js';
import { check, fillTokens, pickText } from './conditions.js';
import { pickWeighted, random } from './rng.js';

export const RECENT_WINDOW = 8;
export const DEFAULT_COOLDOWN = 12;
const STORY_CHANCE = 0.75;
const QUEUE_GRACE = 4;

export function participants(ev) {
  return [ev.char, ...(ev.others || [])].filter(Boolean);
}

export function isEligible(state, ev, { ignoreRecent = false } = {}) {
  const played = state.played[ev.id] || 0;
  if (ev.once && played) return false;
  if (!ev.once && played) {
    const cd = ev.cooldown ?? DEFAULT_COOLDOWN;
    if (state.turn - (state.lastTurn[ev.id] ?? -999) < cd) return false;
  }
  if (!ignoreRecent && state.recent.includes(ev.id)) return false;
  if (!ev.allowAbsent) {
    for (const id of participants(ev)) if (state.chars[id]?.status !== 'court') return false;
  }
  return check(ev.when, state);
}

// Pick the next event. Order: due follow-ups, story events (mostly), weighted random, fallback.
export function pickEvent(state, events) {
  const list = Object.values(events);
  // 1. follow-ups that have come due
  state.queue.sort((a, b) => a.due - b.due);
  for (let i = 0; i < state.queue.length; i++) {
    const q = state.queue[i];
    const ev = events[q.id];
    if (!ev) { state.queue.splice(i--, 1); continue; }
    if (q.due > state.turn) continue;
    if (isEligible(state, ev, { ignoreRecent: true })) { state.queue.splice(i, 1); return { event: ev, source: 'queue' }; }
    if (state.turn - q.due > QUEUE_GRACE) state.queue.splice(i--, 1);
  }
  // 2. eligible pool
  const pool = list.filter(ev => isEligible(state, ev));
  const urgent = pool.filter(ev => ev.urgent);
  if (urgent.length) return { event: pickWeighted(state, urgent, weightOf(state)), source: 'story' };
  const story = pool.filter(ev => ev.story);
  if (story.length && random(state) < STORY_CHANCE) return { event: pickWeighted(state, story, weightOf(state)), source: 'story' };
  if (pool.length) return { event: pickWeighted(state, pool, weightOf(state)), source: 'random' };
  // 3. fallback: a repeatable low-stakes event always exists
  const fb = list.filter(ev => ev.fallback && isEligible(state, ev, { ignoreRecent: false }));
  const fbPool = fb.length ? fb : list.filter(ev => ev.fallback && isEligible(state, ev, { ignoreRecent: true }));
  const any = fbPool.length ? fbPool : list.filter(ev => ev.fallback);
  return { event: pickWeighted(state, any, ev => ev.weight ?? 1), source: 'fallback' };
}

function weightOf(state) {
  const lastTheme = state.history.slice(-2).map(h => h.theme);
  const lastChar = state.history[state.history.length - 1]?.char;
  const objThemes = state.objective?.themes || [];
  return ev => {
    let w = ev.weight ?? 1;
    if (ev.theme && lastTheme.includes(ev.theme)) w *= 0.6;
    if (ev.char && ev.char === lastChar && !CHARACTERS[ev.char]?.generic) w *= 0.5;
    if (ev.theme && objThemes.includes(ev.theme)) w *= 1.4;
    return w;
  };
}

export const addressFor = state => RANKS[state.rank]?.address ?? 'newcomer';

// Who is speaking: event override (for generic petitioners) or the character, with their current role.
export function speaker(state, ev) {
  const def = CHARACTERS[ev.char];
  const c = state.chars[ev.char];
  let name = ev.who?.name ?? def?.name ?? 'Unknown';
  let role = ev.who?.role ?? c?.role ?? def?.role ?? '';
  if (ev.char === 'isaura' && state.secrets.veiled_hand_identity) { name = def.realName; role = def.realRole; }
  return { id: ev.char, name, role, look: ev.who?.look ? { ...def.look, ...ev.who.look } : def?.look };
}

const cap = t => t.replace(/^[a-z]/, c => c.toUpperCase());
export const eventText = (state, ev) => cap(fillTokens(pickText(ev.text, state), state, addressFor(state)));
export const choiceLabel = (state, ev, side) => cap(fillTokens(pickText(ev[side].label, state), state, addressFor(state)));

// A one-line callback to an earlier decision, if one is still shaping this scene.
export function echoText(state, ev) {
  for (const e of ev.echo || []) if (check(e.when, state)) return fillTokens(e.text, state, addressFor(state));
  return '';
}
