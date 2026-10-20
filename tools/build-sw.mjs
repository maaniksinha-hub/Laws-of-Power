// Regenerates the ASSETS precache list in sw.js from the files on disk. Run after adding or removing game files:
//   npm run build-sw     (tests fail if the list is out of date)
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const files = ['./', 'index.html', 'manifest.webmanifest', 'styles/main.css'];
for (const d of ['js', 'data', 'data/events', 'fonts', 'icons']) {
  for (const f of readdirSync(d).sort()) if (/\.(js|woff2|png)$/.test(f) && statSync(join(d, f)).isFile()) files.push(`${d}/${f}`);
}
const list = files.map(f => JSON.stringify(f)).join(',\n  ');
const sw = readFileSync('sw.js', 'utf8').replace(/const ASSETS = \[[\s\S]*?\];/, `const ASSETS = [\n  ${list}\n];`);
writeFileSync('sw.js', sw);
console.log(`sw.js precaches ${files.length} files`);
