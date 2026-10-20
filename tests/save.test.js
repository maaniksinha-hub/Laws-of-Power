import test from 'node:test';
import assert from 'node:assert/strict';
import { KEYS, setStorage, clearAll, clearReign, loadMeta, loadReign, loadSettings, migrate, repairState, saveMeta, saveReign, saveSettings, validateState, DEFAULT_SETTINGS } from '../js/saveManager.js';
import { createMeta, finishReign, recordProgress, isBackgroundUnlocked } from '../js/meta.js';
import { BACKGROUNDS } from '../data/world.js';
import { advance, choose } from '../js/gameEngine.js';
import { SAVE_VERSION } from '../js/state.js';
import { fresh, useMemoryStorage } from './helpers.js';

const started = seed => { const s = fresh(seed); advance(s); return s; };

test('save and load round trip preserves the whole reign', () => {
  useMemoryStorage();
  const s = started(11);
  choose(s, 'right'); s.pendingResult = null; advance(s);
  assert.ok(saveReign(s));
  const { state, status } = loadReign();
  assert.equal(status, 'ok');
  assert.deepEqual(state, JSON.parse(JSON.stringify(s)));
  assert.deepEqual(validateState(state), []);
});

test('a reloaded reign continues identically (rng state is saved)', () => {
  useMemoryStorage();
  const a = started(5); saveReign(a);
  const b = loadReign().state;
  const play = s => { const out = []; for (let i = 0; i < 6; i++) { out.push(s.current.id); choose(s, 'left'); s.pendingResult = null; advance(s); } return out; };
  assert.deepEqual(play(a), play(b));
});

test('a pending result survives a refresh', () => {
  useMemoryStorage();
  const s = started(3); const r = choose(s, 'left'); saveReign(s);
  const loaded = loadReign().state;
  assert.deepEqual(loaded.pendingResult, JSON.parse(JSON.stringify(r)));
});

test('missing save returns status none', () => { useMemoryStorage(); assert.deepEqual(loadReign(), { state: null, status: 'none' }); });

test('corrupted JSON is handled gracefully', () => {
  const m = useMemoryStorage();
  m.setItem(KEYS.save, '{not json'); assert.deepEqual(loadReign(), { state: null, status: 'corrupt' });
  m.setItem(KEYS.save, '"a string"'); assert.equal(loadReign().status, 'corrupt');
  m.setItem(KEYS.save, JSON.stringify({ v: 1, state: null })); assert.equal(loadReign().status, 'corrupt');
});

test('structurally invalid state is rejected', () => {
  const m = useMemoryStorage();
  const s = started(4);
  const bad = JSON.parse(JSON.stringify(s)); bad.meters.authority = 'lots';
  m.setItem(KEYS.save, JSON.stringify({ v: SAVE_VERSION, state: bad })); assert.equal(loadReign().status, 'corrupt');
  const bad2 = JSON.parse(JSON.stringify(s)); bad2.chars.varen.status = 'sleeping';
  m.setItem(KEYS.save, JSON.stringify({ v: SAVE_VERSION, state: bad2 })); assert.equal(loadReign().status, 'corrupt');
  const bad3 = JSON.parse(JSON.stringify(s)); bad3.meters.loyalty = 140;
  assert.ok(validateState(bad3).includes('meter loyalty'));
});

test('a save from a newer version is reported as outdated, not loaded', () => {
  const m = useMemoryStorage();
  m.setItem(KEYS.save, JSON.stringify({ v: SAVE_VERSION + 1, state: started(1) })); assert.equal(loadReign().status, 'outdated');
});

test('older saves migrate through registered migrations, or are dropped when none exists', () => {
  const old = { v: 1, x: 1 };
  assert.deepEqual(migrate(old, 3, { 1: s => ({ ...s, v: 2, a: 1 }), 2: s => ({ ...s, v: 3, b: 2 }) }), { v: 3, x: 1, a: 1, b: 2 });
  assert.equal(migrate(old, 3, { 1: s => ({ ...s, v: 2 }) }), null);
});

test('repairState fills in newly added characters and drops dangling references', () => {
  const s = started(8);
  delete s.chars.sabel; s.queue.push({ id: 'does_not_exist', due: 3 }); delete s.flags;
  repairState(s);
  assert.ok(s.chars.sabel); assert.deepEqual(s.flags, {}); assert.ok(!s.queue.some(q => q.id === 'does_not_exist'));
  assert.deepEqual(validateState(s), []);
});

test('an unknown current card is dropped instead of crashing', () => {
  const m = useMemoryStorage(); const s = started(9); s.current = { id: 'removed_in_new_version' };
  m.setItem(KEYS.save, JSON.stringify({ v: SAVE_VERSION, state: s }));
  assert.notEqual(loadReign().status, 'ok'); // no card, no pending result, not ended: unusable, so reported corrupt
});

test('clearReign removes only the reign; clearAll removes everything', () => {
  const m = useMemoryStorage();
  saveReign(started(2)); saveMeta(createMeta()); saveSettings({ ...DEFAULT_SETTINGS, sound: false });
  clearReign(); assert.equal(loadReign().status, 'none'); assert.ok(m.getItem(KEYS.meta));
  clearAll(); assert.equal(m.getItem(KEYS.meta), null); assert.equal(loadSettings().sound, true);
});

test('settings and meta merge with defaults and survive junk', () => {
  const m = useMemoryStorage();
  m.setItem(KEYS.settings, JSON.stringify({ sound: false })); assert.deepEqual(loadSettings(), { ...DEFAULT_SETTINGS, sound: false });
  m.setItem(KEYS.settings, 'garbage'); assert.deepEqual(loadSettings(), DEFAULT_SETTINGS);
  m.setItem(KEYS.meta, JSON.stringify({ v: 1, reigns: 'x', endings: [] }));
  const meta = loadMeta(); assert.equal(meta.reigns, 0); assert.deepEqual(meta.endings, {});
});

test('storage that throws (private mode) does not break saving or loading', () => {
  const bad = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('denied'); } };
  const state = started(1);
  setStorage(bad);
  try {
    assert.equal(saveReign(state), false);
    assert.equal(loadReign().status, 'corrupt');
    assert.deepEqual(loadSettings(), DEFAULT_SETTINGS);
    assert.doesNotThrow(() => clearAll());
  } finally { setStorage(null); }
});

test('meta: finishing a reign records the ending, objective and achievements, and unlocks backgrounds', () => {
  const meta = createMeta(); const s = fresh(6);
  s.turn = 27; s.objective.status = 'done'; s.laws.law1 = 3; s.chars.varen.met = true; s.chars.varen.agendaKnown = true;
  const fresh1 = finishReign(meta, s, 'legacy_survivor');
  assert.equal(meta.reigns, 1); assert.equal(meta.endings.legacy_survivor, 1);
  assert.ok(fresh1.some(a => a.id === 'first_reign')); assert.ok(fresh1.some(a => a.id === 'survive25'));
  assert.ok(meta.laws.law1); assert.ok(meta.agendas.varen);
  assert.equal(meta.objectivesDone[s.objective.id], 1);
  assert.ok(isBackgroundUnlocked(meta, BACKGROUNDS.find(b => b.id === 'archivist')));
  assert.ok(!isBackgroundUnlocked(meta, BACKGROUNDS.find(b => b.id === 'returned_exile')));
  assert.equal(finishReign(meta, s, 'legacy_survivor').length, 0, 'achievements are only awarded once');
});

test('meta: recording progress twice does not double count law discoveries', () => {
  const meta = createMeta(); const s = fresh(6); s.laws.law5 = 4;
  recordProgress(meta, s); recordProgress(meta, s);
  assert.equal(meta.laws.law5.count, 1);
});

test('achievements: three distinct objectives, three endings, clean reign', () => {
  const meta = createMeta(); const s = fresh(7);
  meta.objectivesDone = { a: 1, b: 1, c: 1 }; meta.endings = { x: 1, y: 1 }; s.turn = 41; s.stats.betrayals = 0;
  const got = finishReign(meta, s, 'z').map(a => a.id);
  for (const id of ['three_objectives', 'endings3', 'clean_reign']) assert.ok(got.includes(id), id);
});
