// Event table. Each file under data/events/ exports an array of event definitions; add new files here.
// Consequence echoes (data/echoes.js) are merged in by event id.
import court from './events/court.js';
import rivals from './events/rivals.js';
import shadows from './events/shadows.js';
import people from './events/people.js';
import more from './events/more.js';
import climax from './events/climax.js';
import d1 from './events/d1.js';
import d2 from './events/d2.js';
import d3 from './events/d3.js';
import d4 from './events/d4.js';
import d5 from './events/d5.js';
import { VIA } from './channels.js';
import { ECHOES } from './echoes.js';

// Generic scenes from earlier editions that are not about design work are left out of the pool.
const DROP = new Set(['grain_shortage', 'tax_revolt', 'widow_petition', 'duel_challenge', 'feast_spectacle', 'tavern_song', 'rival_wedding', 'border_deserters', 'aubry_hospital']);
export const EVENT_LIST = [...court, ...rivals, ...shadows, ...people, ...more, ...climax, ...d1, ...d2, ...d3, ...d4, ...d5].filter(ev => !DROP.has(ev.id)).map(ev => ({ ...ev, via: ev.via || VIA[ev.id] || 'meeting', ...(ECHOES[ev.id] ? { echo: ECHOES[ev.id] } : {}) }));
export const EVENTS = Object.fromEntries(EVENT_LIST.map(ev => [ev.id, ev]));
