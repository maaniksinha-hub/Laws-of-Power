// Dev tool for the plain-English pass: replaces player-facing strings in the data files with the versions in
// tools/simple/<area>.json (same shape as `node tools/dump-strings.mjs <area>`). Strings are located by value
// inside the block of the event/ending/character they belong to, so identical labels in other events are untouched.
// Usage: node tools/apply-strings.mjs events tools/simple/events-court.json
import { readFileSync, writeFileSync } from 'node:fs';
import court from '../data/events/court.js';
import rivals from '../data/events/rivals.js';
import shadows from '../data/events/shadows.js';
import people from '../data/events/people.js';
import more from '../data/events/more.js';
import climax from '../data/events/climax.js';
import { ECHOES } from '../data/echoes.js';
import { ENDINGS } from '../data/endings.js';

const [area, file] = process.argv.slice(2);
const S = JSON.parse(readFileSync(file, 'utf8'));

const lits = old => [`'${old.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`, JSON.stringify(old)];
const lit = nw => (nw.includes("'") ? JSON.stringify(nw) : `'${nw.replace(/\\/g, '\\\\')}'`);

// replace `old` with `nw` inside src[from, to); returns the new src and the new `to`
function rep(src, from, to, old, nw, label) {
  if (nw == null || old === nw) return [src, to];
  for (const l of lits(old)) {
    const i = src.indexOf(l, from);
    if (i !== -1 && i < to) { const r = lit(nw); return [src.slice(0, i) + r + src.slice(i + l.length), to + r.length - l.length]; }
  }
  throw new Error(`not found in block: ${label}: ${old.slice(0, 60)}`);
}
const blockOf = (src, startRe, nextRe) => {
  const m = startRe.exec(src); if (!m) throw new Error('block start not found: ' + startRe);
  const from = m.index; nextRe.lastIndex = from + m[0].length;
  const n = nextRe.exec(src); return [from, n ? n.index : src.length];
};

const toArr = x => (Array.isArray(x) ? x : [x]);
if (area === 'events') {
  const sources = { court, rivals, shadows, people, more, climax };
  const done = new Set();
  for (const [name, arr] of Object.entries(sources)) {
    const path = `data/events/${name}.js`; let src = readFileSync(path, 'utf8'); let changed = false;
    for (const ev of arr) {
      const n = S[ev.id]; if (!n) continue; done.add(ev.id);
      let [from, to] = blockOf(src, new RegExp(`\\n    id: '${ev.id}'`), /\n  \{\n    id: '/g);
      const R = (old, nw, label) => { [src, to] = rep(src, from, to, old, nw, `${ev.id}.${label}`); changed = true; };
      if (n.title) R(ev.title, n.title, 'title');
      if (n.text != null) toArr(ev.text).forEach((v, i) => R(typeof v === 'string' ? v : v.t, toArr(n.text)[i], `text[${i}]`));
      for (const side of ['left', 'right']) {
        const c = ev[side], m = n[side]; if (!m) continue;
        if (m.label) R(typeof c.label === 'string' ? c.label : c.label, m.label, `${side}.label`);
        if (m.memo) R(c.memo, m.memo, `${side}.memo`);
        if (m.result) R(c.result, m.result, `${side}.result`);
        if (m.note) R(c.fx.note, m.note, `${side}.note`);
        if (m.branches) (c.branches || []).forEach((b, i) => { if (b.result && m.branches[i]) R(b.result, m.branches[i], `${side}.branch[${i}]`); });
      }
      if (n.lesson) for (const side of ['left', 'right']) if (n.lesson[side]) R(ev.lesson[side], n.lesson[side], `lesson.${side}`);
      if (n.who) { if (n.who.name) R(ev.who.name, n.who.name, 'who.name'); if (n.who.role) R(ev.who.role, n.who.role, 'who.role'); }
    }
    if (changed) writeFileSync(path, src);
  }
  for (const id of Object.keys(S)) if (!done.has(id)) throw new Error('unknown event ' + id);
}
if (area === 'echoes') {
  const path = 'data/echoes.js'; let src = readFileSync(path, 'utf8');
  for (const [id, list] of Object.entries(S)) {
    let [from, to] = blockOf(src, new RegExp(`\\n  ${id}: \\[`), /\n  [a-z_]+: \[/g);
    ECHOES[id].forEach((e, i) => { [src, to] = rep(src, from, to, e.text, list[i], `echo.${id}[${i}]`); });
  }
  writeFileSync(path, src);
}
if (area === 'endings') {
  const path = 'data/endings.js'; let src = readFileSync(path, 'utf8');
  for (const [id, n] of Object.entries(S)) {
    const e = ENDINGS.find(x => x.id === id);
    let [from, to] = blockOf(src, new RegExp(`\\n    id: '${id}'`), /\n  \{\n    id: '/g);
    const R = (old, nw, label) => { [src, to] = rep(src, from, to, old, nw, `${id}.${label}`); };
    if (n.title) R(e.title, n.title, 'title'); if (n.epitaph) R(e.epitaph, n.epitaph, 'epitaph');
    if (n.text != null) toArr(e.text).forEach((v, i) => R(typeof v === 'string' ? v : v.t, toArr(n.text)[i], `text[${i}]`));
  }
  writeFileSync(path, src);
}
console.log('applied', area, file);

// ---- generic mode: characters / objectives / world. Same shape as the dump; every changed string must be unique in its file.
if (['characters', 'objectives', 'world'].includes(area)) {
  const { execFileSync } = await import('node:child_process');
  const old = JSON.parse(execFileSync('node', ['tools/dump-strings.mjs', area], { encoding: 'utf8' }));
  const files = { characters: ['data/characters.js'], objectives: ['data/objectives.js', 'data/achievements.js'], world: ['data/world.js'] }[area];
  const srcs = Object.fromEntries(files.map(f => [f, readFileSync(f, 'utf8')]));
  const pairs = [];
  const walk = (o, n, path) => {
    if (typeof o === 'string') { if (typeof n === 'string' && n !== o && o !== '') pairs.push([path, o, n]); return; }
    if (o && typeof o === 'object') for (const k of Object.keys(o)) if (n && n[k] !== undefined) walk(o[k], n[k], `${path}.${k}`);
  };
  walk(old, S, area);
  for (const [path, o, n] of pairs) {
    let done = false;
    for (const f of files) {
      for (const l of lits(o)) {
        const count = srcs[f].split(l).length - 1;
        if (count === 1) { srcs[f] = srcs[f].replace(l, () => lit(n)); done = true; break; }
        if (count > 1) throw new Error(`not unique (${count}) in ${f}: ${path}: ${o.slice(0, 50)}`);
      }
      if (done) break;
    }
    if (!done) throw new Error(`not found: ${path}: ${o.slice(0, 60)}`);
  }
  for (const f of files) writeFileSync(f, srcs[f]);
  console.log(`generic: ${pairs.length} strings changed`);
}
