# references/

| File | What it is |
| --- | --- |
| `laws-of-power.pdf` | The **companion reference** supplied with the project: an original concise synthesis of the 48 laws (principle, failure modes, defensive reading, scenario seeds). It is *not* the book. |
| `laws-of-power.txt` | `pdftotext -layout` output of the PDF above, used by `tools/build-laws.mjs`. Regenerated, safe to delete. |
| `design-notes.md` | Private development notes mapping concepts to mechanics. Not shipped in the game. |
| `book.pdf` *(optional, not included)* | Drop the original book here and run `npm run verify-laws` to check law titles against it. |

The original book could not be downloaded in the build environment (the network policy blocked the host), so
**no law title has been verified against the book**. Titles in `data/laws.js` come from the companion reference
and are flagged `verified: false`. No quotations from the book are used anywhere.
