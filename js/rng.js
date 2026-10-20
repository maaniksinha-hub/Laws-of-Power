// Deterministic PRNG (mulberry32). The generator state lives on the game state (`state.rng`)
// so saved games and seeded test runs resume identically.
export function hashSeed(seed) {
  if (typeof seed === 'number') return seed >>> 0;
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function random(state) {
  let t = (state.rng = (state.rng + 0x6D2B79F5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function pickWeighted(state, items, weightOf = it => it.weight ?? 1) {
  const weights = items.map(it => Math.max(0, weightOf(it)));
  const total = weights.reduce((a, b) => a + b, 0);
  if (!items.length) return null;
  if (total <= 0) return items[Math.floor(random(state) * items.length)];
  let r = random(state) * total;
  for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r < 0) return items[i]; }
  return items[items.length - 1];
}
