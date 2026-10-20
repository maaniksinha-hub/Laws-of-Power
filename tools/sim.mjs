// Dev tool: simulate many random reigns and report stats / event coverage.
import { newReign, advance, choose, continueReign, DEFAULT_CONTENT } from '../js/gameEngine.js';
import { random } from '../js/rng.js';
import { validateState } from '../js/saveManager.js';
const N = Number(process.argv[2] || 300);
const policy = process.argv[3] || 'random';
const seen = {}; const endings = {}; const lens = []; const objs = {};
let errors = 0;
for (let i = 0; i < N; i++) {
  const s = newReign({ reigns: 0 }, { seed: 'sim' + i });
  let ev = advance(s);
  let guard = 0;
  while (ev && guard++ < 200) {
    seen[ev.id] = (seen[ev.id] || 0) + 1;
    const side = policy === 'left' ? 'left' : policy === 'right' ? 'right' : (Math.sin(i * 131 + guard * 17) > 0 ? 'left' : 'right');
    try { choose(s, side); } catch (e) { errors++; console.error(ev.id, side, e.stack); break; }
    const p = validateState(s);
    if (p.length) { errors++; console.error('invalid', ev.id, p); break; }
    ev = continueReign(s);
  }
  endings[s.ending?.id] = (endings[s.ending?.id] || 0) + 1;
  lens.push(s.turn - 1);
  const k = s.objective.id + ':' + s.objective.status; objs[k] = (objs[k] || 0) + 1;
}
console.log('errors', errors, 'avg turns', (lens.reduce((a, b) => a + b, 0) / N).toFixed(1));
console.log('endings', endings);
console.log('objectives', objs);
const all = Object.keys(DEFAULT_CONTENT.events);
console.log('never seen:', all.filter(id => !seen[id]));
console.log('seen counts:', Object.entries(seen).sort((a,b)=>a[1]-b[1]).map(([k,v])=>k+':'+v).join(' '));
