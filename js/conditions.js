// One shared condition evaluator for events, branches, endings, objectives, pressures and text variants.
// Conditions are plain data; see README ("Condition reference") for the full list of keys.
import { CHARACTERS } from '../data/characters.js';
import { agendasKnown, countAllies, countEnemies, getRel, meterKey, relKey, resolveId } from './state.js';

export const inRange = (v, r) => !r || ((r[0] == null || v >= r[0]) && (r[1] == null || v <= r[1]));

export function check(c, s) {
  if (!c) return true;
  if (Array.isArray(c)) return c.every(x => check(x, s));
  if (c.any && !c.any.some(x => check(x, s))) return false;
  if (c.not && check(c.not, s)) return false;
  if (c.meter) for (const [k, r] of Object.entries(c.meter)) if (!inRange(s.meters[meterKey(k)], r)) return false;
  if (c.flags && !c.flags.every(f => s.flags[f])) return false;
  if (c.notFlags && c.notFlags.some(f => s.flags[f])) return false;
  if (c.anyFlags && !c.anyFlags.some(f => s.flags[f])) return false;
  if (c.seen && !c.seen.every(id => s.played[id])) return false;
  if (c.notSeen && c.notSeen.some(id => s.played[id])) return false;
  if (c.chose) for (const [id, side] of Object.entries(c.chose)) if (s.choices[id] !== side) return false;
  if (c.turn && !inRange(s.turn, c.turn)) return false;
  if (c.rank && !inRange(s.rank, c.rank)) return false;
  if (c.char) for (const [rawId, q] of Object.entries(c.char)) if (!charMatches(s, resolveId(s, rawId), q)) return false;
  if (c.rel) for (const [key, q] of Object.entries(c.rel)) if (!relMatches(s, key, q)) return false;
  if (c.secret && !c.secret.every(id => s.secrets[id])) return false;
  if (c.notSecret && c.notSecret.some(id => s.secrets[id])) return false;
  if (c.exposed && !c.exposed.every(id => s.secrets[id]?.exposed)) return false;
  if (c.stat) for (const [k, r] of Object.entries(c.stat)) if (!inRange(s.stats[k] || 0, r)) return false;
  if (c.allies && !inRange(countAllies(s), c.allies)) return false;
  if (c.enemies && !inRange(countEnemies(s), c.enemies)) return false;
  if (c.agendas && !inRange(agendasKnown(s), c.agendas)) return false;
  if (c.pending && !s.queue.some(q => q.id === c.pending)) return false;
  if (c.objective) {
    const o = s.objective;
    if (c.objective === 'done' ? o?.status !== 'done' : o?.id !== c.objective) return false;
  }
  return true;
}

function charMatches(s, id, q) {
  const c = id && s.chars[id];
  if (!c) return false;
  if (q.status) { if (q.status === 'gone' ? c.status === 'court' : c.status !== q.status) return false; }
  if (q.variant && c.variant !== q.variant) return false;
  if (q.agenda != null && !!c.agendaKnown !== q.agenda) return false;
  if (q.met != null && !!c.met !== q.met) return false;
  for (const k of ['trust', 'fear', 'resent', 'ambition', 'obligation', 'suspicion']) if (q[k] && !inRange(c[k], q[k])) return false;
  return true;
}

function relMatches(s, key, q) {
  const [a, b] = key.split('|').map(x => resolveId(s, x));
  if (!a || !b || !s.chars[a] || !s.chars[b]) return false;
  const r = s.relations[relKey(a, b)] || getRel(s, a, b);
  for (const [k, want] of Object.entries(q)) {
    if (typeof want === 'boolean') { if (!!r[k] !== want) return false; }
    else if (!inRange(r[k], want)) return false;
  }
  return true;
}

// Text may be a string or a list of { when, t } variants. Tokens: {t} player address, {culprit}, {target}.
export function pickText(text, s) {
  if (!Array.isArray(text)) return text;
  for (const v of text) if (typeof v === 'string' || check(v.when, s)) return typeof v === 'string' ? v : v.t;
  return '';
}
export function fillTokens(str, s, address = 'newcomer') {
  return String(str ?? '')
    .replace(/\{t\}/g, address)
    .replace(/\{culprit\}/g, () => CHARACTERS[s.params?.culprit]?.name ?? 'someone close to the king')
    .replace(/\{target\}/g, () => CHARACTERS[s.params?.target]?.name ?? 'your rival');
}
