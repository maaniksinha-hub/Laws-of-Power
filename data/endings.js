// Endings. `trigger`: 'crisis' (checked after every turn), 'final' (checked once the reign runs its course),
// 'forced' (only reachable through an event's `end` effect). The first matching ending by priority wins.
// `text` may be a string or a list of { when, t } variants (the last entry without `when` is the default).

export const ENDINGS = [
  // ---- triumphs ----
  {
    id: 'supreme', title: 'You Are the New Head of Design', kind: 'triumph', priority: 100, trigger: 'final',
    when: { flags: ['regent'], meter: { auth: [50, null], rep: [40, null] } },
    epitaph: 'The design team answers to you.',
    text: 'Maya is gone. Leadership has voted. Your name is on the new org chart, above the line where hers used to be. Your rivals smile, or they have updated their LinkedIn. The seat is yours now. So is every plan to take it from you.',
  },
  {
    id: 'shadow_regent', title: 'The Power Behind the New Head', kind: 'triumph', priority: 95, trigger: 'final',
    when: { flags: ['heir_guardian'], meter: { auth: [60, null], rep: [55, null], loy: [45, null] } },
    epitaph: 'Nobody remembers who decided.',
    text: 'The new Head of Design presents at all-hands and reads the slides you wrote. Your name is on no org chart box, but no big decision happens without your comment in the doc. It is the safest kind of power: the kind nobody sees.',
  },
  // ---- design-native endings ----
  {
    id: 'craft_path', title: 'The Designer Everyone Asks For', kind: 'triumph', priority: 80, trigger: 'final',
    when: { stat: { craft: [6, null] }, meter: { rep: [60, null] } },
    epitaph: 'You never wanted the org chart box. You got the respect.',
    text: 'You stay on the tools. Engineers ping you before they start. Product books you early. Juniors ask to sit in your crit. The Head of Design title goes to someone else, and you do not mind much. When a hard flow needs fixing, your name is the first one in the thread. That is a kind of power too.',
  },
  {
    id: 'debt_collapse', title: 'The Shortcuts Caught Up With You', kind: 'fall', priority: 88, trigger: 'crisis',
    when: { stat: { debt: [10, null] } },
    epitaph: 'Every "we will fix it in v2" was a loan.',
    text: 'The release goes out with the broken flow, the missing alt text and the checkout nobody tested. Support tickets triple by Tuesday. A customer posts a screen recording that gets shared very widely. Product rolls it back and calls a review. Everyone looks at the design file history, and your name is on every shortcut.',
  },
  // ---- crisis endings (meter extremes) ----
  {
    id: 'overthrown', title: 'Voted Out by Leadership', kind: 'fall', priority: 90, trigger: 'crisis',
    when: { meter: { auth: [null, 0] } },
    epitaph: 'Every rival you made joined the same calendar invite.',
    text: [
      { when: { flags: ['coalition'] }, t: 'They did not need a fight. The rivals you made, one sharp crit at a time, finally compared notes. By evening leadership had changed sides. By morning your Figma projects had a new owner.' },
      { t: 'Your requests went unanswered and your meeting invites were declined. Your team looked at their screens. Your influence drained away until a polite email could remove you. Nobody even had to be your enemy.' },
    ],
  },
  {
    id: 'abandoned', title: 'Your Team Walked Away', kind: 'fall', priority: 88, trigger: 'crisis',
    when: { meter: { loy: [null, 0] } },
    epitaph: 'The crit room emptied slowly, then all at once.',
    text: 'Nobody shouted. They just stopped coming. The replies, the favours, the lunch invitations all faded. One by one, your people moved to other squads. Lumen did not turn on you. It simply forgot you.',
  },
  {
    id: 'bankrupt', title: 'Out of Capacity, Out of Power', kind: 'fall', priority: 86, trigger: 'crisis',
    when: { meter: { res: [null, 0] } },
    epitaph: 'Influence runs on time, headcount and favours.',
    text: [
      { when: { flags: ['vask_debt'] }, t: "Ethan's finance partner arrived with a spreadsheet and a very polite smile. The headcount you borrowed was the only thing you had. Lumen was kind enough to call it a restructure." },
      { t: 'With no time, no headcount and no budget, your asks stopped working and favours stopped coming back. Within a quarter, nobody remembered you had ever mattered. Your roadmap items sat in the backlog.' },
    ],
  },
  {
    id: 'exposed_manipulator', title: 'Caught as a Schemer', kind: 'fall', priority: 84, trigger: 'crisis',
    when: { meter: { rep: [null, 0] }, stat: { manipulations: [3, null] } },
    epitaph: 'Every Slack thread led back to you.',
    text: 'Someone finally laid all the pieces side by side. The quiet DMs, the lucky timing, the helpful friends. A team forgives mistakes more easily than cleverness. Hannah walked you out with a box and a laptop return slip.',
  },
  {
    id: 'disgraced', title: 'Reputation Ruined', kind: 'fall', priority: 82, trigger: 'crisis',
    when: { meter: { rep: [null, 0] } },
    epitaph: 'Slack went quiet when you joined. Then you stopped joining.',
    text: 'Nobody could say exactly what you had done. In the end it did not matter. Nobody will put a name they distrust on a project, and your portfolio needs projects.',
  },
  {
    id: 'feared_isolated', title: 'Feared and Alone', kind: 'fall', priority: 80, trigger: 'crisis',
    when: { meter: { auth: [100, null], loy: [null, 50] } },
    epitaph: 'Everyone agreed in crit. No one stayed.',
    text: 'Your word is final, and nobody argues, even when you are wrong. The team nods on Zoom so hard that you cannot see their faces. Somewhere in Slack, a few of them have started a private channel.',
  },
  {
    id: 'eclipsed', title: 'Pushed Aside by Maya', kind: 'fall', priority: 78, trigger: 'crisis',
    when: { meter: { auth: [100, null] } },
    epitaph: 'A designer who casts a bigger shadow than the VP does not last long.',
    text: 'Your grip on the team grew until Maya could feel it on her own neck. The message, when it came, was polite. A new title on a side project, and a clear handover doc to make sure you went.',
  },
  {
    id: 'gilded_cage', title: 'The Golden Title', kind: 'neutral', priority: 76, trigger: 'crisis',
    when: { meter: { rep: [100, null] } },
    epitaph: 'Loved by all, and kept out of the real decisions.',
    text: 'Everyone loves you. They write Slack shout-outs about you. Leadership finds you so loved that every move you make worries someone. So they give you a grand title, a quiet role and a long stay in your own good name.',
  },
  {
    id: 'puppet', title: 'Smothered by Yes-People', kind: 'neutral', priority: 74, trigger: 'crisis',
    when: { meter: { loy: [100, null] } },
    epitaph: 'They agreed you into silence.',
    text: 'Your team guesses your every wish. They fix problems before you hear of them and shield you from anyone who disagrees. Somewhere in all this comfort, you stopped deciding. A lead whose people love them too much to say no is only a name on a chart.',
  },
  {
    id: 'plundered', title: 'Too Much Headcount to Be Safe', kind: 'fall', priority: 72, trigger: 'crisis',
    when: { meter: { res: [100, null] } },
    epitaph: 'A big team invites cuts.',
    text: 'Your headcount became all anyone talked about in planning. Old questions about your roadmap came back. A very official note to cut your team arrived with all the right approvals, and it took everything.',
  },
  // ---- forced endings ----
  {
    id: 'negotiated_exit', title: 'You Leave on Your Own Terms', kind: 'neutral', priority: 70, trigger: 'forced',
    epitaph: 'You left while they still said please.',
    text: 'A fair package, a long holiday and a warm farewell Slack message with forty emoji. You leave with your portfolio full and a long list of people who wish you had stayed. A longer list is relieved that you did not. Few people rise this far and choose when to step down.',
  },
  {
    id: 'exiled_alive', title: 'Laid Off, But Standing', kind: 'neutral', priority: 69, trigger: 'forced',
    epitaph: 'Leaving with your portfolio and your head up is a kind of win.',
    text: 'You bargained for your future in a glass meeting room and won it. A severance, a reference from Priya and a promise to stay quiet. It is not what you came for. But it is more than most who lose to a group of rivals ever keep.',
  },
  {
    id: 'poisoned', title: 'The Report You Presented', kind: 'fall', priority: 68, trigger: 'forced',
    epitaph: 'Someone was always going to try.',
    text: 'The usability numbers looked perfect. You presented them to Ethan and Maya, and you did not look closely at who changed the file. Noor found the real results too late. Lumen moved on with great speed.',
  },
  // ---- final (legacy) endings ----
  {
    id: 'legacy_architect', title: 'Your Legacy: The Quiet Builder', kind: 'triumph', priority: 60, trigger: 'final',
    when: { meter: { res: [60, null], rep: [55, null] } },
    epitaph: 'You built what outlasts you.',
    text: 'You leave a healthy team and a clean component library that others keep alive. Your name opens doors when you are not in the room. The company wiki will give you a small note. That is how the best builders like it.',
  },
  {
    id: 'legacy_beloved', title: 'Your Legacy: The Loved Lead', kind: 'triumph', priority: 59, trigger: 'final',
    when: { meter: { loy: [65, null], rep: [55, null] } },
    epitaph: 'They would have followed you anywhere.',
    text: 'People remember how it felt to work with you. Those you lifted up kept your name alive. Those you backed in crit make sure the stories get kinder each time they are told. Not every career needs a big title.',
  },
  {
    id: 'legacy_iron', title: 'Your Legacy: The Iron Fist', kind: 'neutral', priority: 58, trigger: 'final',
    when: { meter: { auth: [65, null] } },
    epitaph: 'Your calls were followed. Not everyone has forgiven them.',
    text: 'You ran design like a machine you were afraid to stop. It worked. Launches were on time and the rebels left. People still lower their voices when your name is said. The metrics call it success. Your old team calls it a long winter.',
  },
  {
    id: 'legacy_quiet', title: 'Your Legacy: The Quiet Winner', kind: 'triumph', priority: 57, trigger: 'final',
    when: { objective: 'done' },
    epitaph: 'You wanted one thing and you got it.',
    text: 'You did not run the department. You wanted one thing, in silence, and now you have it. The people who could have stopped you did not notice until it shipped.',
  },
  {
    id: 'legacy_survivor', title: 'Your Legacy: The Survivor', kind: 'neutral', priority: 1, trigger: 'final',
    epitaph: 'You are still here. That counts.',
    text: "You outlasted Maya's moods, three reorgs and your own mistakes. Few can say the same. You are not loved or hated. On a busy design team, that is the closest thing to safety.",
  },
];
export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map(e => [e.id, e]));
