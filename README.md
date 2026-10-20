# 48: Laws of Power

> Every decision creates a rival. Every alliance has a price.

A swipe-based political thriller for the browser, inspired by the *Reigns* interaction model and by the themes of
*The 48 Laws of Power*. You arrive at court as a newcomer. Every card is a dilemma with two options and incomplete
information. The consequences are remembered: by the four meters, by the people involved, and by the people who
were watching.

Vanilla HTML/CSS/JS (ES modules). No backend, no framework, no API keys, no build step. All artwork is generated in
CSS/SVG, so nothing external has to load.

## Run it

```bash
npm start            # serves http://localhost:8080  (PORT=3000 npm start to change)
```

Any static server works (`python3 -m http.server`), but the page must be served over `http://`, because browsers
block ES modules from `file://`. Node 18+ is all you need to play. `npm install` is only needed for the browser test.

Optional URL parameters (handy for testing): `?seed=abc` makes a reign deterministic, `?objective=conspiracy` forces a
secret objective.

## How to play

| Input | Action |
| --- | --- |
| Drag / swipe the card left or right | choose the left or right option |
| Tap the two buttons under the card | same, for mouse, touch and screen readers |
| `←` `→` or `A` `D` | choose; after a choice, any of them (or `Enter`) continues |
| `Esc` | pause menu |

You lose control of a reign when a meter hits 0 **or 100**. Extremes are never simply good: too much authority breeds
fear and conspiracy, too much reputation breeds jealousy, too much loyalty breeds entitlement, too much money breeds
envy. A reign lasts up to 40 turns (5–15 minutes). Each reign has a **secret objective**, rolled **hidden agendas** (the
same courtier can be a schemer in one reign and an honest man in the next), and a starting background. Exact meter
values are hidden by default.

The Codex records the laws, characters, stories and endings you have discovered, and persists between reigns.
Laws are revealed only **after** a decision that demonstrates them.

## Look and feel

* **Type:** IM Fell English, a historic printing face (SIL OFL, bundled in `fonts/`), for titles, buttons and labels; a plain
  sans for reading text. Numbers use a plain serif because the Fell old-style figures are hard to read when small.
* **The card is the one bold element.** Each card sits in a scene (throne room, chapel, market, counting-house, night
  rooftops...) chosen by theme. Portraits have distinct face shapes and expressions driven by hidden state: a courtier
  hiding something looks friendly, then his brow starts to twitch before the mask breaks.
* **Feedback that answers your actions:** while dragging, small dots mark which meters a choice touches (never by how
  much; toggle in Settings). Critical meters pulse and the edges of the screen darken. Betrayals shake the stage once,
  secrets arrive under a wax seal that cracks, and endings arrive slowly with different light for a downfall and a triumph.
* **The court remembers:** an italic echo line on a card points back to the earlier decision that is shaping the scene.
* **Replay hooks:** a daily court (same hidden agendas for everyone on a date), a share line for finished reigns, and a
  four-line meter timeline in the summary.
* Reduced motion switches off every animation above.

## Project layout

```
index.html               application shell (screens + dialogs)
styles/main.css          the whole visual system
js/
  main.js                entry point
  ui.js                  rendering, card drag/swipe, keyboard, panels
  views.js               HTML builders: dossier, codex, settings, summary
  portraits.js           generated SVG portraits: face shapes, expressions, scene backdrops (no image files)
  audio.js               generated WebAudio effects (muteable, no autoplay)
  gameEngine.js          rules: new reign, choose(), world tick, ending resolution, summary
  eventEngine.js         eligibility, weighted selection, queue, fallbacks
  characterEngine.js     character stats, relationship graph, alliances, defections, attitude
  effects.js             the one place state changes: meters, flags, secrets, queue
  conditions.js          the shared condition evaluator + text variants
  objectives.js          secret objectives
  meta.js                cross-reign progress, achievements, unlocks
  saveManager.js         versioned localStorage saves, validation, repair, migration
  state.js, rng.js       state shape/helpers and the seeded PRNG
data/
  events.js + events/*   the 70 event cards (court, rivals, shadows, people, more, climax)
  characters.js          cast, relationships, secrets, dossier clues
  laws.js                48 laws (GENERATED, see below)
  objectives.js          secret objectives     endings.js   endings
  echoes.js              one-line callbacks to earlier decisions
  achievements.js        achievements          world.js     meters, ranks, backgrounds, pressures
fonts/                   IM Fell English (OFL), bundled locally
references/              companion PDF, notes (see references/README.md)
tools/                   build-laws.mjs, verify-laws.mjs, sim.mjs
tests/                   node:test suites + browser smoke test
```

Content is data; the engine contains no scenario-specific logic. Rendering never mutates game state except through
`gameEngine.choose()` / `continueReign()`.

## Tests

```bash
npm test             # 124 logic tests (node:test): meters, crises, eligibility, flags, repetition, relationships,
                     #   secrets, objectives, endings, save/load/corruption, content integrity, scripted + 200 random reigns
npm run test:smoke   # 27-step browser test (Playwright + Chromium): real mouse, keyboard and touch input, refresh persistence,
                     #   panels, every card × both choices, full reigns to the summary, 5 viewports, accessibility basics
node tools/sim.mjs 400 random   # balance report: endings, objective rates, events never seen
```

The smoke test looks for Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; set `CHROMIUM_PATH` otherwise.
Set `SHOTS_DIR=./shots` to save screenshots.

## The law reference and the book

The supplied PDF is a **companion reference** (original summaries, defensive readings, scenario seeds), not the book.
`tools/build-laws.mjs` parses it into `data/laws.js`:

```bash
node tools/build-laws.mjs     # re-generate data/laws.js from references/laws-of-power.pdf (needs pdftotext)
npm run verify-laws           # compare titles with the original book if you place it at references/book.pdf
```

All 48 laws are marked `verified: false` until compared with the book, and the Codex says so. No book text is
reproduced; debrief copy and every scenario are original.

## Extending the game

### Add an event

Create or edit a file in `data/events/` (and import it in `data/events.js`):

```js
{
  id: 'quill_audit',                // unique
  title: 'THE QUIET AUDIT',         // card title
  theme: 'secrets',                 // ambition|reputation|loyalty|secrets|rivalry|negotiation|fear|scarcity|revenge|opportunity|timing
  char: 'quill', others: ['varen'], // speaker (must be at court) and other involved characters
  who: { name, role, look },        // optional: override identity for generic 'crowd' cards
  text: 'About 25-70 words.',       // or [{ when: cond, t: 'variant' }, 'default']; tokens {t} {culprit} {target}
  when: { ... },                    // eligibility condition (see below)
  once: true, cooldown: 12,         // once per reign, or minimum turns between repeats (default 12)
  weight: 1, story: true, urgent: false, fallback: false, major: false, allowAbsent: false,
  left:  { label, style, memo, fx, branches, result },
  right: { ... },
  lesson: { law: 14, left: '...', right: '...' },   // optional debrief shown AFTER the choice
}
```

* `style`: `guile | force | charm | restraint | candour | pragmatism`. Feeds the end-of-reign strategic style analysis.
* `story: true` events are strongly prioritised when eligible; `urgent: true` always wins; `fallback: true` cards are
  low-stakes and are used when nothing else is eligible (keep at least one, with no conditions).
* `major: true` records the decision in the summary and the Codex "Stories" tab. `memo` is remembered in the dossier.
* `result` is shown after the choice. `branches` pick the first match (`when`, optional `chance` using the seeded RNG).
  Branch `fx` is applied **in addition** to the choice's `fx`, and branch `result` replaces `result`. If a choice has
  no `result`, its last branch must be unconditional.

**Effects (`fx`)**: `m: { auth, rep, loy, res }` meter deltas · `flags: []` set · `clear: []` · `chars: { id: { trust,
fear, resent, ambition, obligation, suspicion, role, status } }` (status: `court|dead|exiled|defected|imprisoned`;
`$all`, `$culprit`, `$target`, `$topEnemy` are allowed) · `rel: [[a, b, { trust, rivalry, fear, obligation, benefit,
suspicion, alliance, allianceKnown }]]` · `reveal: [secretId]` · `expose: [secretId]` · `stat: { betrayals,
manipulations, conspiracies }` · `queue: [{ id, delay }]` · `end: endingId` · `note: 'text'`.

**Conditions (`when`)**: `meter: { auth: [min, max] }` · `flags` / `notFlags` / `anyFlags` · `seen` / `notSeen` ·
`chose: { eventId: 'left' }` · `turn` / `rank: [min, max]` · `char: { id: { status, variant, trust, fear, resent,
ambition, obligation, suspicion, agenda, met } }` · `rel: { 'a|b': { rivalry: [40, null], alliance: true } }` ·
`secret` / `notSecret` / `exposed` · `stat` · `allies` / `enemies` / `agendas: [min, max]` · `objective` · `any: []` ·
`not: {}`. Ranges use `null` for "open". `npm test` validates every reference (characters, queue targets, secrets,
endings, flags that nothing sets) so typos fail fast.

### Add a character
Add an entry to `CHARACTERS` in `data/characters.js` (look, start stats, `mask`, `variants` with weights and hidden
text, `canDefect`), relationships to `RELATIONS`, and optional dossier `CLUES`. Hidden agendas are automatically
available as the secret `agenda_<id>`.

### Add a secret
`SECRETS` in `data/characters.js`: `title`, `text`, `about`, and optionally `needsEvidence` with `onExpose` /
`onBackfire` effects. Set the flag `evidence_<secretId>` when the player gains proof.

### Add a law
Laws come from the reference PDF. Edit the PDF (or `tools/build-laws.mjs`) and re-run it. To teach a law in a card,
add `lesson: { law: N, ... }` to an event.

### Add an ending
Add to `data/endings.js`: `trigger: 'crisis' | 'final' | 'forced'`, `priority`, a `when` condition and `text` (string or
variant list). Higher priority is checked first. `forced` endings are reached via an event's `fx.end`.

### Add an objective or background
`data/objectives.js` (steps are conditions; `final: true` locks at reign end; `fail` condition optional) and
`BACKGROUNDS` in `data/world.js`. Add a recipe to `tests/objectives.test.js` so achievability stays tested.

### Saves
Saves are versioned (`SAVE_VERSION` in `js/state.js`). When you change the state shape, bump it and add a migration to
`MIGRATIONS` in `js/saveManager.js`; saves that cannot be migrated or fail validation are set aside with a notice and the
Codex is kept.

## Known limitations

* Law titles are unverified against the original book (see above).
* Audio is simple generated tones; there is no music.
* The deck holds 58 cards; a long-time player will start seeing familiar scenes, though agendas and outcomes vary
  per reign.
* The browser test targets Chromium only.

## Design rules the interface is held to

The UI was audited against the VectorLab UX skills (type, spacing, colour, motion, keyboard, viewports, verbs) and the
browser test enforces the measurable ones: no text under 12px, no font weight above 600, 44px minimum targets, card text
never clipped at 360×640, no layout-property transitions. Motion uses four durations (100/150/200/300ms) and animates
only transform and opacity. The one decorative loop is the ember drift on the title screen. Metadata is plain text, not
pills. Buttons are verb-first sentence case ("Draw the next card", "Open Codex").
