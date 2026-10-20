// Progressive web app glue: service worker registration and the install prompt.
let deferred = null;
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn());

export const onInstallChange = fn => { listeners.add(fn); return () => listeners.delete(fn); };
export const canInstall = () => !!deferred;
export const isStandalone = () => globalThis.matchMedia?.('(display-mode: standalone)').matches || globalThis.navigator?.standalone === true;
export const isIOS = () => /iphone|ipad|ipod/i.test(globalThis.navigator?.userAgent || '') && !isStandalone();

export async function promptInstall() {
  if (!deferred) return 'unavailable';
  deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null; notify();
  return outcome;
}

export function initPWA() {
  globalThis.addEventListener?.('beforeinstallprompt', e => { e.preventDefault(); deferred = e; notify(); });
  globalThis.addEventListener?.('appinstalled', () => { deferred = null; notify(); });
  if (!('serviceWorker' in navigator)) return;
  // Local development edits would be hidden behind the cache, so localhost opts in with ?sw=1.
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (local && !new URLSearchParams(location.search).has('sw')) {
    navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => {});
    return;
  }
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ }));
}
