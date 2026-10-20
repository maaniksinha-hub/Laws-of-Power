import { newReign, DEFAULT_CONTENT } from '../js/gameEngine.js';
import { setStorage } from '../js/saveManager.js';

export const fresh = (seed = 1, opts = {}) => newReign({ reigns: 0 }, { seed, ...opts });

export class MemoryStorage {
  constructor() { this.d = new Map(); }
  getItem(k) { return this.d.has(k) ? this.d.get(k) : null; }
  setItem(k, v) { this.d.set(k, String(v)); }
  removeItem(k) { this.d.delete(k); }
}
export function useMemoryStorage() { const m = new MemoryStorage(); setStorage(m); return m; }

// A tiny event factory for engine tests
export const ev = (id, extra = {}) => ({
  id, title: id.toUpperCase(), theme: 'ambition', char: 'varen', text: 'Test event text.',
  left: { label: 'L', style: 'restraint', fx: {}, result: 'l' }, right: { label: 'R', style: 'force', fx: {}, result: 'r' }, ...extra,
});
export const table = (...list) => Object.fromEntries(list.map(e => [e.id, e]));
export { DEFAULT_CONTENT };
