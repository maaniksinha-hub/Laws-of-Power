# Design notes: laws -> mechanics (private, not playable content)

Source: the companion reference PDF (`laws-of-power.pdf`), sections 3-4 (theme clusters and system mapping). These notes
are original and deliberately keep the *game design* separate from the law text.

## Theme clusters -> systems

| Cluster (laws) | Game system | Where it lives |
| --- | --- | --- |
| Reputation and visibility (1, 4, 5, 6, 25, 30, 34, 37, 46) | Reputation meter, public events, rumour cards, spectacle choices | `arrival`, `dorne_toast`, `feast_spectacle`, `rumour_about_you`, `final_session` |
| Information and uncertainty (3, 4, 14, 18, 21, 33, 39, 44) | Secrets, clues, evidence flags, exposure that can backfire | `data/characters.js` SECRETS, `king_ill`, `rumour_meeting`, `dorne_scandal` |
| Trust and alliances (2, 12, 13, 20, 24, 27, 43) | Relationship graph, hidden alliances, favouritism propagation | `characterEngine.js`, `varen_guard`, `rask_*`, `friend_*` |
| Timing and restraint (8, 16, 22, 28, 29, 35, 36, 47, 48) | Delayed consequences (queue), retreat endings, "know when to stop" exit | `border_raid`, `the_coup`, `retire_offer`, `leverage_use` |
| Power concentration and resistance (7, 11, 15, 17, 19, 23, 31, 41, 42, 45) | Systemic pressures at meter extremes, coalitions, succession | `PRESSURES`, `coalition_*`, `king_death`, `vask_collect` |
| Ethical risk / defensive reading (10, 12, 14, 15, 17, 26, 27, 33, 39, 40, 44) | Debrief "if it were used on you" line, manipulation counter -> "Exposed" ending | `stat.manipulations`, `ysolde_ledger`, lessons |

## Principles followed
1. No law is an answer key. Each lesson explains *this* context and names the cost of the other option.
2. Lessons appear **after** a choice, never before.
3. Manipulation is a tracked risk (`stat.manipulations`), not a free strategy: three or more makes exposure possible.
4. Trust, restraint and candour are viable and can win; cruelty is not the only route.
5. Hidden agendas vary per reign (`variants`) so suspicion is a judgment, not a memorised fact.

## Content layers (per the reference's recommendation)
1. Source metadata: `data/laws.js` (generated, `verified:false`).
2. Original summaries and defensive notes: inside the same generated records, from the companion reference.
3. Game content: characters, events, endings, objectives, all original.
