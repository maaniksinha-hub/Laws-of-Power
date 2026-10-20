// Compares the law titles in data/laws.js against a source PDF of the book, if you have one.
// Usage: node tools/verify-laws.mjs [path/to/book.pdf]   (default: references/book.pdf)
// Needs `pdftotext` (poppler-utils). Prints a report; it does not modify any files.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { LAWS } from '../data/laws.js';

const pdf = process.argv[2] || 'references/book.pdf';
if (!existsSync(pdf)) {
  console.error(`No book PDF found at ${pdf}.\nPlace the original book there (or pass a path) to verify law titles.\nNote: references/laws-of-power.pdf is the companion reference, not the book.`);
  process.exit(2);
}
const text = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
if (text.replace(/\s/g, '').length < 5000) { console.error('The PDF has little or no selectable text (probably scanned). OCR is required.'); process.exit(3); }
const norm = s => s.toLowerCase().replace(/[‘’']/g, "'").replace(/[–—-]/g, ' ').replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const hay = norm(text);
let ok = 0;
for (const l of LAWS) {
  const found = hay.includes(norm(l.title));
  if (found) ok++; else console.log(`Law ${l.n}: title not found verbatim: "${l.title}"`);
}
console.log(`${ok}/${LAWS.length} titles found verbatim in ${pdf}.`);
console.log(ok === LAWS.length ? 'All titles match. You can set verified: true in tools/build-laws.mjs and regenerate.' : 'Review the mismatches above (hyphenation and punctuation differences are common).');
