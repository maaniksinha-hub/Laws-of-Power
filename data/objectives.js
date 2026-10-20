// Secret objectives. One is assigned at the start of each reign.
// `steps` are condition lists; the objective is done when every step holds. `final: true` objectives are only
// locked in when the reign ends (the state must still hold then). `fail` locks the objective as failed.
// `pool` entries choose a random `target` character (optionally gated by a condition).

export const OBJECTIVES = [
  {
    id: 'influence', title: 'The Power in the Room', brief: 'Become the most powerful person at court.',
    themes: ['ambition', 'fear'], final: true,
    steps: [
      { label: 'Reach Chief Advisor or higher', when: { rank: [3, null] } },
      { label: 'Keep your authority above 65', when: { meter: { auth: [65, null] } } },
      { label: 'Keep at least two real friends', when: { allies: [2, null] } },
    ],
  },
  {
    id: 'conspiracy', title: 'Light in the Dark', brief: 'Uncover a secret plot.',
    themes: ['secrets', 'rivalry'],
    steps: [{ label: 'Uncover a plot', when: { flags: ['conspiracy_exposed'] } }],
  },
  {
    id: 'remove', title: 'An Empty Chair', brief: 'Get {target} out of power.',
    themes: ['rivalry', 'revenge'],
    pool: [{ id: 'dorne' }, { id: 'vask' }, { id: 'varen', when: { flags: ['varen_schemer'] } }],
    steps: [{ label: '{target} leaves court', when: { char: { $target: { status: 'gone' } } } }],
  },
  {
    id: 'alliances', title: 'Friends Worth Having', brief: 'Win three true friends.',
    themes: ['alliance', 'loyalty'], final: true,
    steps: [{ label: 'Three trusted friends at court', when: { allies: [3, null] } }],
  },
  {
    id: 'rich_trusted', title: 'Gold Without Envy', brief: 'Get rich without being distrusted.',
    themes: ['scarcity', 'reputation'], final: true,
    steps: [
      { label: 'Resources above 70', when: { meter: { res: [70, null] } } },
      { label: 'Loyalty at least 45', when: { meter: { loy: [45, null] } } },
      { label: 'Reputation at least 45', when: { meter: { rep: [45, null] } } },
    ],
  },
  {
    id: 'clean', title: 'Clean Hands', brief: 'Last 25 turns without being betrayed.',
    themes: ['loyalty', 'secrets'],
    steps: [
      { label: 'Reach turn 26', when: { turn: [26, null] } },
      { label: 'Not be betrayed', when: { stat: { betrayals: [null, 0] } } },
    ],
    fail: { stat: { betrayals: [1, null] } },
  },
  {
    id: 'summit', title: 'The Honest Summit', brief: 'Reach the highest office and keep a good name.',
    themes: ['ambition', 'reputation'], final: true,
    steps: [
      { label: 'Become Ruler', when: { rank: [4, null] } },
      { label: 'Reputation at least 55', when: { meter: { rep: [55, null] } } },
    ],
  },
  {
    id: 'agendas', title: 'Faces Behind Faces', brief: 'Learn what three people at court really want.',
    themes: ['secrets'],
    steps: [{ label: 'Learn three secret goals', when: { agendas: [3, null] } }],
  },
  {
    id: 'unmask', title: 'Who Pulls the Strings', brief: 'Find out who works in secret behind the throne.',
    themes: ['secrets', 'opportunity'],
    steps: [{ label: 'Find the Veiled Patron', when: { secret: ['veiled_hand_identity'] } }],
  },
];
