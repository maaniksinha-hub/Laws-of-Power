// Secret objectives. One is assigned at the start of each reign.
// `steps` are condition lists; the objective is done when every step holds. `final: true` objectives are only
// locked in when the reign ends (the state must still hold then). `fail` locks the objective as failed.
// `pool` entries choose a random `target` character (optionally gated by a condition).

export const OBJECTIVES = [
  {
    id: 'influence', title: 'The Power in the Room', brief: 'Become the most influential person at court.',
    themes: ['ambition', 'fear'], final: true,
    steps: [
      { label: 'Reach Chancellor or higher', when: { rank: [3, null] } },
      { label: 'Hold authority above 65', when: { meter: { auth: [65, null] } } },
      { label: 'Keep at least two real allies', when: { allies: [2, null] } },
    ],
  },
  {
    id: 'conspiracy', title: 'Light in the Dark', brief: 'Expose a hidden conspiracy.',
    themes: ['secrets', 'rivalry'],
    steps: [{ label: 'Expose a conspiracy', when: { flags: ['conspiracy_exposed'] } }],
  },
  {
    id: 'remove', title: 'A Chair Left Empty', brief: 'Remove {target} from power.',
    themes: ['rivalry', 'revenge'],
    pool: [{ id: 'dorne' }, { id: 'vask' }, { id: 'varen', when: { flags: ['varen_schemer'] } }],
    steps: [{ label: '{target} leaves court', when: { char: { $target: { status: 'gone' } } } }],
  },
  {
    id: 'alliances', title: 'Friends Worth Having', brief: 'Build three meaningful alliances.',
    themes: ['alliance', 'loyalty'], final: true,
    steps: [{ label: 'Three trusted allies at court', when: { allies: [3, null] } }],
  },
  {
    id: 'rich_trusted', title: 'Gold Without Envy', brief: 'Accumulate resources without becoming distrusted.',
    themes: ['scarcity', 'reputation'], final: true,
    steps: [
      { label: 'Resources above 70', when: { meter: { res: [70, null] } } },
      { label: 'Loyalty at least 45', when: { meter: { loy: [45, null] } } },
      { label: 'Reputation at least 45', when: { meter: { rep: [45, null] } } },
    ],
  },
  {
    id: 'clean', title: 'Clean Hands', brief: 'Survive 25 turns without a betrayal.',
    themes: ['loyalty', 'secrets'],
    steps: [
      { label: 'Reach turn 26', when: { turn: [26, null] } },
      { label: 'Suffer no betrayal', when: { stat: { betrayals: [null, 0] } } },
    ],
    fail: { stat: { betrayals: [1, null] } },
  },
  {
    id: 'summit', title: 'The Credible Summit', brief: 'Reach the highest office while keeping a credible reputation.',
    themes: ['ambition', 'reputation'], final: true,
    steps: [
      { label: 'Become Regent', when: { rank: [4, null] } },
      { label: 'Reputation at least 55', when: { meter: { rep: [55, null] } } },
    ],
  },
  {
    id: 'agendas', title: 'Faces Behind Faces', brief: 'Learn the true intentions of three courtiers.',
    themes: ['secrets'],
    steps: [{ label: 'Three hidden agendas uncovered', when: { agendas: [3, null] } }],
  },
  {
    id: 'unmask', title: 'Who Pulls the Strings', brief: 'Discover who is working behind the throne.',
    themes: ['secrets', 'opportunity'],
    steps: [{ label: 'Unmask the Veiled Patron', when: { secret: ['veiled_hand_identity'] } }],
  },
];
