// Event table. Each file under data/events/ exports an array of event definitions; add new files here.
// Consequence echoes (data/echoes.js) are merged in by event id.
import court from './events/court.js';
import rivals from './events/rivals.js';
import shadows from './events/shadows.js';
import people from './events/people.js';
import more from './events/more.js';
import climax from './events/climax.js';
import { ECHOES } from './echoes.js';

export const EVENT_LIST = [...court, ...rivals, ...shadows, ...people, ...more, ...climax].map(ev => (ECHOES[ev.id] ? { ...ev, echo: ECHOES[ev.id] } : ev));
export const EVENTS = Object.fromEntries(EVENT_LIST.map(ev => [ev.id, ev]));
