// Endings. `trigger`: 'crisis' (checked after every turn), 'final' (checked once the reign runs its course),
// 'forced' (only reachable through an event's `end` effect). The first matching ending by priority wins.
// `text` may be a string or a list of { when, t } variants (the last entry without `when` is the default).

export const ENDINGS = [
  // ---- triumphs ----
  {
    id: 'supreme', title: 'You Rule the Kingdom', kind: 'triumph', priority: 100, trigger: 'final',
    when: { flags: ['regent'], meter: { auth: [50, null], rep: [40, null] } },
    epitaph: 'The kingdom answers to you.',
    text: 'The old king is buried. The young king is a boy. The royal seal is on your desk. Your rivals bow, or they are somewhere else. The power is yours now. So is every plot that will be made to take it from you.',
  },
  {
    id: 'shadow_regent', title: 'The Power Behind the Throne', kind: 'triumph', priority: 95, trigger: 'final',
    when: { flags: ['heir_guardian'], meter: { auth: [60, null], rep: [55, null], loy: [45, null] } },
    epitaph: 'Nobody remembers who decided.',
    text: 'The boy king smiles for the crowds and reads the speeches you wrote. No statue will carry your name, but no law will pass without it. It is the safest kind of power: the kind nobody sees.',
  },
  // ---- crisis endings (meter extremes) ----
  {
    id: 'overthrown', title: 'Thrown Down by Your Enemies', kind: 'fall', priority: 90, trigger: 'crisis',
    when: { meter: { auth: [null, 0] } },
    epitaph: 'Every enemy you made came to the same room.',
    text: [
      { when: { flags: ['coalition'] }, t: 'They did not need a battle. The enemies you made, one insult at a time, finally compared notes. By midnight the guard had changed sides. By morning your seat had a new owner.' },
      { t: 'Your orders went unanswered and your doors stayed shut. The guard looked at its boots. Your power drained away until a polite request could remove you. Nobody even had to be your enemy.' },
    ],
  },
  {
    id: 'abandoned', title: 'Left Alone by Your Friends', kind: 'fall', priority: 88, trigger: 'crisis',
    when: { meter: { loy: [null, 0] } },
    epitaph: 'The room emptied slowly, then all at once.',
    text: 'Nobody drew a sword. They just stopped coming. The messengers, the favours, the dinner invitations all faded. One by one, your people found better places to be. The court did not turn on you. It simply forgot you.',
  },
  {
    id: 'bankrupt', title: 'Broke and Forgotten', kind: 'fall', priority: 86, trigger: 'crisis',
    when: { meter: { res: [null, 0] } },
    epitaph: 'Power runs on grain, pay and favours.',
    text: [
      { when: { flags: ['vask_debt'] }, t: "Master Vask's clerks arrived with a cart and a very polite smile. Your debts were the only thing you owned. The court was kind enough to call it a retirement." },
      { t: 'Without money, orders stopped working and favours stopped coming back. Within a season, nobody remembered if you had ever been dangerous. You were just poor.' },
    ],
  },
  {
    id: 'exposed_manipulator', title: 'Caught as a Schemer', kind: 'fall', priority: 84, trigger: 'crisis',
    when: { meter: { rep: [null, 0] }, stat: { manipulations: [3, null] } },
    epitaph: 'Every thread led back to your hand.',
    text: 'Someone finally laid all the pieces side by side. The whispers, the lucky accidents, the friends who were so useful. A court forgives cruelty more easily than cleverness. They sent you away in a closed carriage.',
  },
  {
    id: 'disgraced', title: 'Shamed and Forgotten', kind: 'fall', priority: 82, trigger: 'crisis',
    when: { meter: { rep: [null, 0] } },
    epitaph: 'Talk stopped when you came in. Then you stopped coming in.',
    text: 'Nobody could say exactly what you had done. In the end it did not matter. A name that nobody says out loud is a closed door, and the court is made of doors.',
  },
  {
    id: 'feared_isolated', title: 'Feared and Alone', kind: 'fall', priority: 80, trigger: 'crisis',
    when: { meter: { auth: [100, null], loy: [null, 50] } },
    epitaph: 'Everyone obeyed. No one stayed.',
    text: 'Your word is law, and nobody argues, even when you are wrong. The court bows so low that you cannot see their faces. Somewhere in the halls, a few of them have started to whisper.',
  },
  {
    id: 'eclipsed', title: 'Pushed Aside by the King', kind: 'fall', priority: 78, trigger: 'crisis',
    when: { meter: { auth: [100, null] } },
    epitaph: 'A servant who is bigger than his master does not last long.',
    text: 'Your grip on the kingdom grew until the king could feel it on his own neck. The order, when it came, was polite. A new post in a far province, and a proper escort to make sure you got there.',
  },
  {
    id: 'gilded_cage', title: 'The Golden Cage', kind: 'neutral', priority: 76, trigger: 'crisis',
    when: { meter: { rep: [100, null] } },
    epitaph: 'Loved by all, and kept safe from view.',
    text: 'Everyone loves you. They write songs about you. The council finds you so loved that every move you make is a danger to someone. So they give you a grand house, a pension and a very long stay in your own good name.',
  },
  {
    id: 'puppet', title: 'Smothered by Love', kind: 'neutral', priority: 74, trigger: 'crisis',
    when: { meter: { loy: [100, null] } },
    epitaph: 'They loved you into silence.',
    text: 'Your followers guess your every wish. They solve problems before you hear of them and shield you from anyone who disagrees. Somewhere in all this comfort, you stopped deciding. A ruler whose people love him too much to say no is only a figure on a throne.',
  },
  {
    id: 'plundered', title: 'Too Rich to Be Safe', kind: 'fall', priority: 72, trigger: 'crisis',
    when: { meter: { res: [100, null] } },
    epitaph: 'A full treasury invites thieves.',
    text: 'Your wealth became all anyone talked about. New taxes were found that no one had mentioned. Old debts came back. A very legal order to take your money arrived with all the right seals, and it took everything.',
  },
  // ---- forced endings ----
  {
    id: 'negotiated_exit', title: 'You Leave on Your Own Terms', kind: 'neutral', priority: 70, trigger: 'forced',
    epitaph: 'You left while they still said please.',
    text: 'A barony in the north, a pension and a warm goodbye. You leave with your name safe and a long list of people who wish you had stayed. A longer list is relieved that you did not. Few people rise so high and choose when to step down.',
  },
  {
    id: 'exiled_alive', title: 'Sent Away, But Alive', kind: 'neutral', priority: 69, trigger: 'forced',
    epitaph: 'Being alive is a kind of win.',
    text: 'You bargained for your life on the palace steps and won it. A ship, a purse and a promise never to return. It is not what you came for. But it is more than most who lose to a group of enemies ever keep.',
  },
  {
    id: 'poisoned', title: 'The Cup You Did Not Question', kind: 'fall', priority: 68, trigger: 'forced',
    epitaph: 'Someone was always going to try.',
    text: 'The wine was the best in the cellar. You were not the first to be offered it, and you did not look closely at who offered it. The doctor reached you too late. The court mourned with great speed.',
  },
  // ---- final (legacy) endings ----
  {
    id: 'legacy_architect', title: 'Your Legacy: The Quiet Builder', kind: 'triumph', priority: 60, trigger: 'final',
    when: { meter: { res: [60, null], rep: [55, null] } },
    epitaph: 'You built what outlasts you.',
    text: 'You leave full grain stores, honest books and a name that opens doors when you are not in the room. History will give you a small note. That is just how the best builders like it.',
  },
  {
    id: 'legacy_beloved', title: 'Your Legacy: The Loved Helper', kind: 'triumph', priority: 59, trigger: 'final',
    when: { meter: { loy: [65, null], rep: [55, null] } },
    epitaph: 'They would have followed you anywhere.',
    text: 'People remember how it felt to be your friend. Those you lifted up kept your name alive. Those you spared made sure the stories got kinder each time they were told. Not every reign needs a conquest.',
  },
  {
    id: 'legacy_iron', title: 'Your Legacy: The Iron Hand', kind: 'neutral', priority: 58, trigger: 'final',
    when: { meter: { auth: [65, null] } },
    epitaph: 'Orders were obeyed. Not everyone has forgiven them.',
    text: 'You ran the kingdom like a clock you were afraid to stop. It worked. Roads were built and rebels were beaten. The court still lowers its voice when your name is said. History calls it order. Your enemies call it a long winter.',
  },
  {
    id: 'legacy_quiet', title: 'Your Legacy: The Quiet Winner', kind: 'triumph', priority: 57, trigger: 'final',
    when: { objective: 'done' },
    epitaph: 'You wanted one thing and you got it.',
    text: 'You did not rule the court. You wanted one thing, in silence, and now you have it. The people who could have stopped you did not notice until it was done.',
  },
  {
    id: 'legacy_survivor', title: 'Your Legacy: The Survivor', kind: 'neutral', priority: 1, trigger: 'final',
    epitaph: 'You are still here. That counts.',
    text: "You outlasted the king's moods, the council's knives and your own mistakes. Few can say the same. You are not loved or hated. At court, that is the closest thing to safety.",
  },
];
export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map(e => [e.id, e]));
