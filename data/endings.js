// Endings. `trigger`: 'crisis' (checked after every turn), 'final' (checked once the reign runs its course),
// 'forced' (only reachable through an event's `end` effect). The first matching ending by priority wins.
// `text` may be a string or a list of { when, t } variants (the last entry without `when` is the default).

export const ENDINGS = [
  // ---- triumphs ----
  {
    id: 'supreme', title: 'The Rise to Supreme Influence', kind: 'triumph', priority: 100, trigger: 'final',
    when: { flags: ['regent'], meter: { auth: [50, null], rep: [40, null] } },
    epitaph: 'The realm answers to you.',
    text: 'The old king is buried, the young king is a boy, and the seal of the realm is on your desk. Rivals bow, or are elsewhere. Power is yours now, and so is every conspiracy that will form to take it from you.',
  },
  {
    id: 'shadow_regent', title: 'The Power Behind the Throne', kind: 'triumph', priority: 95, trigger: 'final',
    when: { flags: ['heir_guardian'], meter: { auth: [60, null], rep: [55, null], loy: [45, null] } },
    epitaph: 'Nobody remembers who decided.',
    text: 'The boy-king smiles for the crowds, and reads the speeches you wrote. No statue will carry your name, but no law will pass without it. It is the safest kind of power: the kind that does not need to be seen.',
  },
  // ---- crisis endings (meter extremes) ----
  {
    id: 'overthrown', title: 'Overthrown by a Coalition of Rivals', kind: 'fall', priority: 90, trigger: 'crisis',
    when: { meter: { auth: [null, 0] } },
    epitaph: 'Every rival you made came to the same room.',
    text: [
      { when: { flags: ['coalition'] }, t: 'They did not need a battle. The enemies you gathered, one slight at a time, finally compared notes. By midnight the guard had changed sides, and by morning your seat had a new occupant.' },
      { t: 'Orders unanswered, doors unopened, a guard that looked at its boots. Authority drained away until even a polite request could depose you. Nobody even needed to be your enemy for it to happen.' },
    ],
  },
  {
    id: 'abandoned', title: 'Abandoned by Former Allies', kind: 'fall', priority: 88, trigger: 'crisis',
    when: { meter: { loy: [null, 0] } },
    epitaph: 'The room emptied slowly, then all at once.',
    text: 'Nobody drew a sword. They simply stopped coming. The messengers, the favours, the dinner invitations: one by one, your people found better places to be. The court did not turn on you. It just forgot to include you.',
  },
  {
    id: 'bankrupt', title: 'Bankrupt and Politically Irrelevant', kind: 'fall', priority: 86, trigger: 'crisis',
    when: { meter: { res: [null, 0] } },
    epitaph: 'Power runs on grain, wages and favours.',
    text: [
      { when: { flags: ['vask_debt'] }, t: 'Master Vask\'s clerks arrived with a cart and a very polite smile. Your debts, as it turned out, were the only thing you owned outright. The court was kind enough to call it a retirement.' },
      { t: 'Without coin, orders stopped being obeyed and favours stopped being returned. Within a season nobody remembered whether you had ever been dangerous. You had become merely poor.' },
    ],
  },
  {
    id: 'exposed_manipulator', title: 'Exposed as a Manipulator', kind: 'fall', priority: 84, trigger: 'crisis',
    when: { meter: { rep: [null, 0] }, stat: { manipulations: [3, null] } },
    epitaph: 'Every thread led back to your hand.',
    text: 'Someone finally laid the pieces side by side: the whispered rumours, the convenient accidents, the allies who happened to be useful. Courts forgive cruelty far more easily than cleverness. They sent you away in a closed carriage.',
  },
  {
    id: 'disgraced', title: 'Disgraced and Forgotten', kind: 'fall', priority: 82, trigger: 'crisis',
    when: { meter: { rep: [null, 0] } },
    epitaph: 'Conversation stopped when you entered. Then you stopped entering.',
    text: 'Nobody could say exactly what you had done. By the end it hardly mattered. A name that nobody will say aloud is a closed door, and the court is built entirely out of doors.',
  },
  {
    id: 'feared_isolated', title: 'Feared but Isolated', kind: 'fall', priority: 80, trigger: 'crisis',
    when: { meter: { auth: [100, null], loy: [null, 50] } },
    epitaph: 'Everyone obeyed. No one stayed.',
    text: 'Your word is law, and nobody argues with it, including when it is wrong. The court bows so low that you can no longer see their faces. Somewhere in the corridors, a few of them have started talking in lower voices.',
  },
  {
    id: 'eclipsed', title: 'Eclipsed by the Crown', kind: 'fall', priority: 78, trigger: 'crisis',
    when: { meter: { auth: [100, null] } },
    epitaph: 'A servant who outranks his master has a short career.',
    text: 'Your hold on the realm grew until the king could feel it on his own throat. The order, when it came, was courteous: a gentle appointment to a far province, and a proper escort to make sure you arrived.',
  },
  {
    id: 'gilded_cage', title: 'The Gilded Cage', kind: 'neutral', priority: 76, trigger: 'crisis',
    when: { meter: { rep: [100, null] } },
    epitaph: 'Adored, and carefully contained.',
    text: 'Everyone loves you. Ballads are written. The council finds you so universally admired that your every move becomes a threat to somebody, and so they give you a splendid residence, a pension and a very long lease on your own good name.',
  },
  {
    id: 'puppet', title: 'Smothered by Devotion', kind: 'neutral', priority: 74, trigger: 'crisis',
    when: { meter: { loy: [100, null] } },
    epitaph: 'They loved you into silence.',
    text: 'Your followers anticipate your every wish, solve your problems before you hear of them and shield you from disagreement. Somewhere in this comfort you stopped deciding. A figurehead is just a ruler whose people love him too much to be told no.',
  },
  {
    id: 'plundered', title: 'Too Rich to Be Safe', kind: 'fall', priority: 72, trigger: 'crisis',
    when: { meter: { res: [100, null] } },
    epitaph: 'A treasury is a standing invitation.',
    text: 'Your fortune became the subject of every conversation. Taxes were discovered that nobody had mentioned. Old debts surfaced. A very legal confiscation arrived with all the correct seals, and was thorough.',
  },
  // ---- forced endings ----
  {
    id: 'negotiated_exit', title: 'A Negotiated Exit', kind: 'neutral', priority: 70, trigger: 'forced',
    epitaph: 'You left while they still said please.',
    text: 'A barony in the north, a pension, and an honourable farewell. You leave with your name intact and a long list of people who wish you had stayed, and a longer one who are relieved you did not. Few rise so high and choose when to step down.',
  },
  {
    id: 'exiled_alive', title: 'Exile with Honours Intact', kind: 'neutral', priority: 69, trigger: 'forced',
    epitaph: 'Alive is a kind of victory.',
    text: 'You bargained for your own survival on the steps of the palace and won it. A ship, a purse and a promise never to return. It is not what you came for, but it is more than most who lose to a coalition ever keep.',
  },
  {
    id: 'poisoned', title: 'The Cup You Did Not Question', kind: 'fall', priority: 68, trigger: 'forced',
    epitaph: 'Someone was always going to try.',
    text: 'The wine was the best the cellar held. You were not the first to be offered it, and you did not look closely at who had offered it. The physician reached you too late, and the court mourned with remarkable efficiency.',
  },
  // ---- final (legacy) endings ----
  {
    id: 'legacy_architect', title: 'Legacy: The Quiet Architect', kind: 'triumph', priority: 60, trigger: 'final',
    when: { meter: { res: [60, null], rep: [55, null] } },
    epitaph: 'You built what outlasts you.',
    text: 'You leave behind full granaries, honest ledgers and a name that opens doors when you are not in the room. History will mention you in a footnote, which is precisely how the best architects prefer it.',
  },
  {
    id: 'legacy_beloved', title: 'Legacy: The Beloved Steward', kind: 'triumph', priority: 59, trigger: 'final',
    when: { meter: { loy: [65, null], rep: [55, null] } },
    epitaph: 'They would have followed you anywhere.',
    text: 'People remember how it felt to be your friend. Those you promoted kept your name alive, and those you spared ensured the stories got kinder with each telling. Not every reign needs a conquest.',
  },
  {
    id: 'legacy_iron', title: 'Legacy: The Iron Chancellor', kind: 'neutral', priority: 58, trigger: 'final',
    when: { meter: { auth: [65, null] } },
    epitaph: 'Orders were obeyed. Not everyone has forgiven them.',
    text: 'You ran the realm like a clockwork you were afraid to let stop. It worked. Roads were built, rebels were broken, and the court still lowers its voice when your name is mentioned. History calls it order. Your enemies call it a long winter.',
  },
  {
    id: 'legacy_quiet', title: 'Legacy: The Quiet Victor', kind: 'triumph', priority: 57, trigger: 'final',
    when: { objective: 'done' },
    epitaph: 'You wanted one thing and you got it.',
    text: 'You did not conquer the court. You wanted one thing, in silence, and now you have it. The people who might have stopped you never noticed until it was finished.',
  },
  {
    id: 'legacy_survivor', title: 'Legacy: The Survivor', kind: 'neutral', priority: 1, trigger: 'final',
    epitaph: 'You are still here. That counts.',
    text: 'You outlasted the king\'s moods, the council\'s knives and your own mistakes. Few can say the same. You are neither adored nor hated, which at court is the nearest thing to safety there is.',
  },
];
export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map(e => [e.id, e]));
