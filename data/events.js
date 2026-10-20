// Event table. Each file under data/events/ exports an array of event definitions; add new files here.
// Consequence echoes (data/echoes.js) are merged in by event id.
import court from './events/court.js';
import rivals from './events/rivals.js';
import shadows from './events/shadows.js';
import people from './events/people.js';
import more from './events/more.js';
import climax from './events/climax.js';
import work1 from './events/work1.js';
import work2 from './events/work2.js';
import work3 from './events/work3.js';
import { VIA } from './channels.js';
import { ECHOES } from './echoes.js';

export const EVENT_LIST = [...court, ...rivals, ...shadows, ...people, ...more, ...climax, ...work1, ...work2, ...work3].map(ev => ({ ...ev, via: ev.via || VIA[ev.id] || 'meeting', ...(ECHOES[ev.id] ? { echo: ECHOES[ev.id] } : {}) }));
export const EVENTS = Object.fromEntries(EVENT_LIST.map(ev => [ev.id, ev]));
