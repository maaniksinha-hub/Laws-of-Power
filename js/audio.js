// Tiny generated sound effects (WebAudio). No assets, no autoplay: the context is created on first user gesture.
let ctx = null;
let enabled = true;

export const setSoundEnabled = v => { enabled = !!v; };

function tone(freq, start, dur, { type = 'sine', gain = 0.06, slide = 0 } = {}) {
  const t0 = ctx.currentTime + start;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

const SOUNDS = {
  choose: () => { tone(210, 0, 0.09, { type: 'triangle', slide: -60 }); },
  flip: () => { tone(330, 0, 0.05, { type: 'sine' }); },
  critical: () => { tone(110, 0, 0.35, { type: 'sawtooth', gain: 0.035, slide: -30 }); tone(116, 0.02, 0.35, { type: 'sawtooth', gain: 0.03 }); },
  secret: () => { [523, 659, 784].forEach((f, i) => tone(f, i * 0.07, 0.22, { type: 'sine', gain: 0.045 })); },
  betrayal: () => { tone(196, 0, 0.18, { type: 'square', gain: 0.03 }); tone(185, 0.16, 0.35, { type: 'square', gain: 0.03, slide: -40 }); },
  ending: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, i * 0.2, 0.5, { type: 'triangle', gain: 0.05 })); },
};

export function play(name) {
  if (!enabled) return;
  try {
    ctx ||= new (globalThis.AudioContext || globalThis.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    SOUNDS[name]?.();
  } catch { /* sound is optional */ }
}
