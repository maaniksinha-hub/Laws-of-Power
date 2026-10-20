// Secret objectives. One is assigned at the start of each reign.
// `steps` are condition lists; the objective is done when every step holds. `final: true` objectives are only
// locked in when the reign ends (the state must still hold then). `fail` locks the objective as failed.
// `pool` entries choose a random `target` character (optionally gated by a condition).

export const OBJECTIVES = [
  {
    id: 'influence', title: 'The Designer Nobody Can Skip', brief: 'Become the designer the PM cannot ship without.',
    themes: ['ambition', 'fear'], final: true,
    steps: [
      { label: 'Reach Design Lead or higher', when: { rank: [3, null] } },
      { label: 'Keep your influence above 65', when: { meter: { auth: [65, null] } } },
      { label: 'Keep at least two real allies', when: { allies: [2, null] } },
    ],
  },
  {
    id: 'conspiracy', title: 'Who Changed the Results', brief: 'Find out who is working against Design in secret.',
    themes: ['secrets', 'rivalry'],
    steps: [{ label: 'Expose the plan', when: { flags: ['conspiracy_exposed'] } }],
  },
  {
    id: 'remove', title: 'An Empty Desk', brief: 'Get {target} out of the design org.',
    themes: ['rivalry', 'revenge'],
    pool: [{ id: 'dorne' }, { id: 'vask' }, { id: 'varen', when: { flags: ['varen_schemer'] } }],
    steps: [{ label: '{target} leaves the team', when: { char: { $target: { status: 'gone' } } } }],
  },
  {
    id: 'alliances', title: 'Friends Worth Having', brief: 'Win three true allies on the team.',
    themes: ['alliance', 'loyalty'], final: true,
    steps: [{ label: 'Three trusted allies at work', when: { allies: [3, null] } }],
  },
  {
    id: 'rich_trusted', title: 'Save the Design System', brief: 'Get a big enough team to protect the design system, without losing trust.',
    themes: ['scarcity', 'reputation'], final: true,
    steps: [
      { label: 'Capacity above 70', when: { meter: { res: [70, null] } } },
      { label: 'Team trust at least 45', when: { meter: { loy: [45, null] } } },
      { label: 'Reputation at least 45', when: { meter: { rep: [45, null] } } },
    ],
  },
  {
    id: 'clean', title: 'Clean Hands', brief: 'Last 25 weeks without a colleague turning on you.',
    themes: ['loyalty', 'secrets'],
    steps: [
      { label: 'Reach week 26', when: { turn: [26, null] } },
      { label: 'Nobody turns on you', when: { stat: { betrayals: [null, 0] } } },
    ],
    fail: { stat: { betrayals: [1, null] } },
  },
  {
    id: 'summit', title: 'The Seat at the Table', brief: 'Reach the top design job and keep a good name, so Design gets a seat in strategy meetings.',
    themes: ['ambition', 'reputation'], final: true,
    steps: [
      { label: 'Become Acting Head of Design', when: { rank: [4, null] } },
      { label: 'Reputation at least 55', when: { meter: { rep: [55, null] } } },
    ],
  },
  {
    id: 'agendas', title: 'What They Really Want', brief: 'Learn what three people at work really want.',
    themes: ['secrets'],
    steps: [{ label: 'Learn three secret goals', when: { agendas: [3, null] } }],
  },
  {
    id: 'unmask', title: 'The Silent Sponsor', brief: 'Find out which senior exec quietly backs you.',
    themes: ['secrets', 'opportunity'],
    steps: [{ label: 'Find the Silent Sponsor', when: { secret: ['veiled_hand_identity'] } }],
  },
];
