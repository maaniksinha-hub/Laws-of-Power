// Event table. Each file under data/events/ exports an array of event definitions; add new files here.
import court from './events/court.js';
import rivals from './events/rivals.js';
import shadows from './events/shadows.js';
import people from './events/people.js';
import climax from './events/climax.js';

export const EVENT_LIST = [...court, ...rivals, ...shadows, ...people, ...climax];
export const EVENTS = Object.fromEntries(EVENT_LIST.map(ev => [ev.id, ev]));
