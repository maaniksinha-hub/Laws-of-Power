// Immersive play: full screen, screen wake lock, portrait lock and vibration. Every part is optional and fails quietly.
let lock = null;
let wanted = false;

export const canFullscreen = () => !!(document.documentElement.requestFullscreen && document.fullscreenEnabled !== false);
export const isFullscreen = () => !!document.fullscreenElement;

export async function enterFullscreen() {
  try {
    if (!isFullscreen() && canFullscreen()) await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    await screen.orientation?.lock?.('portrait').catch(() => {});
    return true;
  } catch { return false; }
}
export async function leaveFullscreen() {
  try { screen.orientation?.unlock?.(); if (isFullscreen()) await document.exitFullscreen(); } catch { /* ignore */ }
}

// Keep the screen on while a reign is open.
export async function keepAwake(on) {
  wanted = on;
  try {
    if (on && !lock && 'wakeLock' in navigator && document.visibilityState === 'visible') {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } else if (!on && lock) { await lock.release(); lock = null; }
  } catch { lock = null; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && wanted) keepAwake(true); });

let vibrateOn = true;
export const setVibration = v => { vibrateOn = !!v; };
export function buzz(pattern) { try { if (vibrateOn) navigator.vibrate?.(pattern); } catch { /* ignore */ } }
