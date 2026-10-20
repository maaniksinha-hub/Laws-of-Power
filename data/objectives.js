// Secret objectives. One is assigned at the start of each reign.
// `steps` are condition lists; the objective is done when every step holds. `final: true` objectives are only
// locked in when the reign ends (the state must still hold then). `fail` locks the objective as failed.
// `pool` entries choose a random `target` character (optionally gated by a condition).

export const OBJECTIVES = [
  {
    id: 'influence', title: 'The Power in the Room', brief: 'Become the most powerful person at the company.',
    themes: ['ambition', 'fear'], final: true,
    steps: [
      { label: 'Reach Director or higher', when: { rank: [3, null] } },
      { label: 'Keep your influence above 65', when: { meter: { auth: [65, null] } } },
      { label: 'Keep at least two real friends', when: { allies: [2, null] } },
    ],
  },
  {
    id: 'conspiracy', title: 'Light in the Dark', brief: 'Uncover a secret plot.',
    themes: ['secrets', 'rivalry'],
    steps: [{ label: 'Uncover a plot', when: { flags: ['conspiracy_exposed'] } }],
  },
  {
    id: 'remove', title: 'An Empty Desk', brief: 'Get {target} out of the company.',
    themes: ['rivalry', 'revenge'],
    pool: [{ id: 'dorne' }, { id: 'vask' }, { id: 'varen', when: { flags: ['varen_schemer'] } }],
    steps: [{ label: '{target} leaves the company', when: { char: { $target: { status: 'gone' } } } }],
  },
  {
    id: 'alliances', title: 'Friends Worth Having', brief: 'Win three true friends.',
    themes: ['alliance', 'loyalty'], final: true,
    steps: [{ label: 'Three trusted friends at work', when: { allies: [3, null] } }],
  },
  {
    id: 'rich_trusted', title: 'Budget Without Envy', brief: 'Get a big budget without being distrusted.',
    themes: ['scarcity', 'reputation'], final: true,
    steps: [
      { label: 'Budget above 70', when: { meter: { res: [70, null] } } },
      { label: 'Team trust at least 45', when: { meter: { loy: [45, null] } } },
      { label: 'Reputation at least 45', when: { meter: { rep: [45, null] } } },
    ],
  },
  {
    id: 'clean', title: 'Clean Hands', brief: 'Last 25 weeks without being betrayed.',
    themes: ['loyalty', 'secrets'],
    steps: [
      { label: 'Reach week 26', when: { turn: [26, null] } },
      { label: 'Not be betrayed', when: { stat: { betrayals: [null, 0] } } },
    ],
    fail: { stat: { betrayals: [1, null] } },
  },
  {
    id: 'summit', title: 'The Honest Summit', brief: 'Reach the top job and keep a good name.',
    themes: ['ambition', 'reputation'], final: true,
    steps: [
      { label: 'Become Acting CEO', when: { rank: [4, null] } },
      { label: 'Reputation at least 55', when: { meter: { rep: [55, null] } } },
    ],
  },
  {
    id: 'agendas', title: 'Faces Behind Faces', brief: 'Learn what three people at work really want.',
    themes: ['secrets'],
    steps: [{ label: 'Learn three secret goals', when: { agendas: [3, null] } }],
  },
  {
    id: 'unmask', title: 'Who Pulls the Strings', brief: 'Find out who works in secret behind the board.',
    themes: ['secrets', 'opportunity'],
    steps: [{ label: 'Find the Silent Sponsor', when: { secret: ['veiled_hand_identity'] } }],
  },
];
