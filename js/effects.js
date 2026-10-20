// Effect application: the single place where meters, characters, relations, secrets and flags change.
import { CHARACTERS, getSecret } from '../data/characters.js';
import { STATUS_TEXT } from '../data/world.js';
import { applyCharFx, applyRelFx } from './characterEngine.js';
import { courtChars, clamp, getRel, meterKey } from './state.js';
import { fillTokens } from './conditions.js';

export const newReport = () => ({ meters: { authority: 0, reputation: 0, loyalty: 0, resources: 0 }, notes: [], secrets: [], laws: [] });

export function changeMeter(state, key, delta, report) {
  const k = meterKey(key);
  if (!(k in state.meters) || !delta) return 0;
  const before = state.meters[k];
  state.meters[k] = clamp(before + delta);
  const actual = state.meters[k] - before;
  if (report) report.meters[k] += actual;
  return actual;
}

export function revealSecret(state, id, report) {
  const def = getSecret(id);
  if (!def || state.secrets[id]) return false;
  state.secrets[id] = { turn: state.turn, exposed: false };
  if (def.kind === 'agenda') {
    const c = state.chars[def.char];
    if (c) c.agendaKnown = true;
  }
  // Learning a secret about two people makes their hidden tie visible in the dossier.
  if (def.kind !== 'agenda' && def.about?.length === 2) {
    const r = getRel(state, def.about[0], def.about[1]);
    r.public = true;
    if (r.alliance) r.allianceKnown = true;
  }
  report?.secrets.push(id);
  return true;
}

// Making a secret public. Credibility decides which consequence runs.
export function exposeSecret(state, id, report) {
  const def = getSecret(id);
  const known = state.secrets[id];
  if (!def || !known || known.exposed) return null;
  known.exposed = true;
  const credible = !def.needsEvidence || !!state.flags[`evidence_${id}`];
  const fx = credible ? def.onExpose : def.onBackfire;
  known.credible = credible;
  if (fx) applyFx(state, fx, report);
  report?.notes.push({ kind: 'secret', text: credible ? `"${def.title}" is out in the open.` : `Your accusation about "${def.title}" does not hold up.` });
  return credible;
}

// fx: { m, flags, clear, chars, rel, reveal, expose, stat, queue, end, note, manip }
export function applyFx(state, fx, report = newReport(), { propagate = false } = {}) {
  if (!fx) return report;
  if (fx.m) for (const [k, d] of Object.entries(fx.m)) changeMeter(state, k, d, report);
  for (const f of fx.flags || []) state.flags[f] = true;
  for (const f of fx.clear || []) delete state.flags[f];
  if (fx.chars) {
    for (const [rawId, d] of Object.entries(fx.chars)) {
      const targets = rawId === '$all' ? courtChars(state) : [rawId];
      for (const t of targets) {
        const change = applyCharFx(state, t, d, { propagate });
        if (change) {
          const name = CHARACTERS[change.id].name;
          report.notes.push({ kind: 'status', text: `${name} ${STATUS_TEXT[change.to] || change.to}.`, ids: [change.id] });
        }
      }
    }
  }
  for (const r of fx.rel || []) applyRelFx(state, r);
  for (const id of fx.reveal || []) if (revealSecret(state, id, report)) {
    const def = getSecret(id);
    report.notes.push({ kind: 'secret', text: `Secret learned: ${def.title}.`, secretId: id });
  }
  for (const id of fx.expose || []) exposeSecret(state, id, report);
  if (fx.stat) for (const [k, d] of Object.entries(fx.stat)) {
    state.stats[k] = (state.stats[k] || 0) + d;
    if (k === 'betrayals' && d > 0) {
      state.betrayals.push({ turn: state.turn, event: state.current?.id ?? null, text: fx.note || 'A betrayal.' });
      report.notes.push({ kind: 'betrayal', text: fx.note || 'You have been betrayed.' });
    }
  }
  for (const q of fx.queue || []) {
    if (!state.queue.some(x => x.id === q.id) && !state.played[q.id]) state.queue.push({ id: q.id, due: state.turn + (q.delay ?? 1) });
  }
  if (fx.end && !state.forcedEnding) state.forcedEnding = fx.end;
  if (fx.note && !(fx.stat?.betrayals > 0)) report.notes.push({ kind: 'info', text: fillTokens(fx.note, state) });
  return report;
}
