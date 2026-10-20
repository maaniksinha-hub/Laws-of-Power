// Persistence: versioned saves in localStorage with validation, repair and migration.
import { CHARACTERS } from '../data/characters.js';
import { METERS } from '../data/world.js';
import { EVENTS } from '../data/events.js';
import { ENDINGS } from '../data/endings.js';
import { OBJECTIVES } from '../data/objectives.js';
import { META_VERSION, createMeta } from './meta.js';
import { SAVE_VERSION, newCharState } from './state.js';

export const KEYS = { save: 'design.save', meta: 'design.meta', settings: 'design.settings' };
export const DEFAULT_SETTINGS = { sound: true, motion: 'auto', showValues: false, hints: true, hintDots: true, autoFullscreen: true, keepAwake: true, vibrate: true };

let store = null;
export function setStorage(s) { store = s; } // tests inject a mock
function ls() {
  if (store) return store;
  try { return globalThis.localStorage || null; } catch { return null; }
}
function read(key) {
  try { const raw = ls()?.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return undefined; }
}
function write(key, value) {
  try { ls()?.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

// Migrations take a save at version N and return it at N+1. Add one whenever SAVE_VERSION increases.
export const MIGRATIONS = {
  // 1: s => ({ ...s, v: 2, newField: default }),
};
export function migrate(data, target = SAVE_VERSION, migrations = MIGRATIONS) {
  let cur = data;
  while (cur.v < target) {
    const fn = migrations[cur.v];
    if (!fn) return null;
    cur = fn(cur);
  }
  return cur;
}

const CHAR_STATUS = ['court', 'dead', 'exiled', 'defected', 'imprisoned'];
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

// Fill gaps (new characters, missing fields) without touching progress. Returns the repaired state.
export function repairState(s, content = { events: EVENTS, endings: ENDINGS, objectives: OBJECTIVES }) {
  for (const id of Object.keys(CHARACTERS)) if (!isObj(s.chars?.[id])) (s.chars ||= {})[id] = newCharState(id);
  for (const id of Object.keys(s.chars)) if (!CHARACTERS[id]) delete s.chars[id];
  for (const k of ['flags', 'params', 'played', 'lastTurn', 'choices', 'secrets', 'laws', 'relations', 'styles', 'warned', 'fired']) if (!isObj(s[k])) s[k] = {};
  for (const k of ['history', 'recent', 'queue', 'betrayals', 'log', 'activePressures', 'trace']) if (!Array.isArray(s[k])) s[k] = [];
  if (!isObj(s.stats)) s.stats = {};
  for (const k of ['betrayals', 'manipulations', 'conspiracies', 'debt', 'craft']) s.stats[k] ||= 0;
  s.queue = s.queue.filter(q => q && content.events[q.id] && Number.isFinite(q.due));
  if (s.current && !content.events[s.current.id]) s.current = null;
  if (!Number.isFinite(s.rank)) s.rank = 0;
  return s;
}

export function validateState(s, content = { events: EVENTS, endings: ENDINGS, objectives: OBJECTIVES }) {
  const problems = [];
  if (!isObj(s)) return ['not an object'];
  if (s.v !== SAVE_VERSION) problems.push('version');
  if (!isObj(s.meters)) problems.push('meters');
  else for (const m of METERS) if (!Number.isFinite(s.meters[m]) || s.meters[m] < 0 || s.meters[m] > 100) problems.push(`meter ${m}`);
  if (!Number.isInteger(s.turn) || s.turn < 1) problems.push('turn');
  if (!Number.isFinite(s.rng)) problems.push('rng');
  if (!isObj(s.chars)) problems.push('chars');
  else for (const id of Object.keys(CHARACTERS)) {
    const c = s.chars[id];
    if (!isObj(c) || !CHAR_STATUS.includes(c.status)) problems.push(`char ${id}`);
  }
  if (s.current && !content.events[s.current.id]) problems.push('current event');
  if (s.current && s.chars?.[content.events[s.current.id]?.char]?.status !== 'court' && !content.events[s.current.id]?.allowAbsent) problems.push('absent speaker');
  if (s.ending && !content.endings.some(e => e.id === s.ending.id)) problems.push('ending');
  if (s.objective && !content.objectives.some(o => o.id === s.objective.id)) problems.push('objective');
  if (!s.ending && !s.current && !s.pendingResult) problems.push('no active card');
  return problems;
}

export function saveReign(state) {
  return write(KEYS.save, { v: SAVE_VERSION, savedAt: Date.now(), state });
}
// -> { state, status: 'none' | 'ok' | 'migrated' | 'corrupt' | 'outdated' }
export function loadReign(content) {
  const raw = read(KEYS.save);
  if (raw === null) return { state: null, status: 'none' };
  if (raw === undefined || !isObj(raw) || !isObj(raw.state)) return { state: null, status: 'corrupt' };
  if (raw.v > SAVE_VERSION) return { state: null, status: 'outdated' };
  let data = raw.state;
  data.v = raw.state.v ?? raw.v;
  let status = 'ok';
  if (data.v < SAVE_VERSION) {
    data = migrate(data);
    if (!data) return { state: null, status: 'outdated' };
    status = 'migrated';
  }
  try {
    repairState(data, content);
    if (validateState(data, content).length) return { state: null, status: 'corrupt' };
  } catch { return { state: null, status: 'corrupt' }; }
  return { state: data, status };
}
export function clearReign() { try { ls()?.removeItem(KEYS.save); } catch { /* ignore */ } }

export function loadMeta() {
  const m = read(KEYS.meta);
  const base = createMeta();
  if (!isObj(m) || !(m.v <= META_VERSION)) return base;
  const merged = { ...base, ...m, v: META_VERSION };
  for (const k of ['endings', 'laws', 'agendas', 'agendaTexts', 'events', 'daily', 'secrets', 'chars', 'stories', 'objectivesDone', 'achievements', 'flagsEver']) if (!isObj(merged[k])) merged[k] = {};
  if (!Number.isFinite(merged.reigns)) merged.reigns = 0;
  return merged;
}
export const saveMeta = meta => write(KEYS.meta, meta);

export function loadSettings() {
  const s = read(KEYS.settings);
  return { ...DEFAULT_SETTINGS, ...(isObj(s) ? s : {}) };
}
export const saveSettings = settings => write(KEYS.settings, settings);

export function clearAll() {
  for (const k of Object.values(KEYS)) { try { ls()?.removeItem(k); } catch { /* ignore */ } }
}
