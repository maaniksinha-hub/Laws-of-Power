import { init } from './ui.js';
import { initPWA } from './pwa.js';

initPWA();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
