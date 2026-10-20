// Cast, relationship seeds and secrets. All hidden information lives here as data.
// `variants` are rolled at the start of every reign, so the same face can be a schemer in one reign and an honest man in the next.

export const CHARACTERS = {
  varen: {
    name: 'Lord Varen', short: 'Varen', role: 'Royal Advisor', archetype: 'The Ambitious Advisor',
    bio: 'Smooth-talking helper of the old king. First to offer help, last to be blamed.',
    publicGoal: 'Serve the king and keep the kingdom calm.',
    look: { face: 'long', hue: 268, hat: 'coif', accent: '#b8964e', build: 'slim' },
    start: { trust: 52, fear: 8, resent: 0, ambition: 70, obligation: 0, suspicion: 0 },
    mask: 'Devoted',
    variants: [
      { id: 'schemer', weight: 55, hidden: 'Varen wants to rule the kingdom for the boy king. Every favour he does for you is a brick in that wall.' },
      { id: 'honest', weight: 45, hidden: 'Varen is eager for power, but truly loyal. He grabs for power because he thinks only he can keep the kingdom safe.' },
    ],
  },
  kovane: {
    name: 'General Idris Kovane', short: 'Kovane', role: 'Commander of the Army', archetype: 'The Loyal but Worried General',
    bio: "A soldier's soldier. His men adore him. He fears being replaced by clerks.",
    publicGoal: 'Guard the borders and keep the army paid.',
    look: { face: 'square', hue: 8, hat: 'helm', accent: '#9aa0a6', build: 'broad' },
    start: { trust: 58, fear: 5, resent: 0, ambition: 40, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'steady', weight: 60, hidden: 'Kovane would die for the king, but only if he feels respected. If you ignore him, he turns fast.' },
      { id: 'wavering', weight: 40, hidden: 'Other people have already talked to Kovane. He will follow whoever promises his men safety.' },
    ],
  },
  dorne: {
    name: 'Lady Seraphine Dorne', short: 'Dorne', role: 'Noble Lady', archetype: 'The Charming Rival',
    bio: 'Loved by the crowds, quick with a toast, and never seen to want anything.',
    publicGoal: 'Stand up for the people against a stuck council.',
    look: { face: 'round', hue: 342, hat: 'veil', accent: '#c58a8a', build: 'slim' },
    start: { trust: 40, fear: 0, resent: 8, ambition: 80, obligation: 0, suspicion: 5 },
    mask: 'Warm',
    variants: [
      { id: 'populist', weight: 55, hidden: 'Dorne truly wants change, and uses charm as a ladder to get it. Her debts hold her more than she admits.' },
      { id: 'claimant', weight: 45, hidden: 'Dorne is quietly building a claim to the throne. Being popular is only the first step.' },
    ],
  },
  vask: {
    name: 'Master Orlo Vask', short: 'Vask', role: 'Banker and Guild Leader', archetype: 'The Rich Backer',
    bio: 'The man who knows what every duke owes. He likes to be thanked in person.',
    publicGoal: 'Keep trade moving and the treasury healthy.',
    look: { face: 'round', hue: 150, hat: 'cap', accent: '#c9a45a', build: 'broad' },
    start: { trust: 50, fear: 0, resent: 0, ambition: 55, obligation: 0, suspicion: 0 },
    mask: 'Generous',
    variants: [
      { id: 'predator', weight: 50, hidden: 'Vask lends cheaply so rulers depend on him. His real goal is to be the only one who sells key goods.' },
      { id: 'patriot', weight: 50, hidden: 'Vask wants a calm kingdom because war is bad for business. He is hard, but not an enemy.' },
    ],
  },
  ysolde: {
    name: 'Ysolde Marr', short: 'Ysolde', role: 'Seller of Secrets', archetype: 'The Secret Seller',
    bio: 'Runs a tea house where everyone is a little too honest. She sells what she hears.',
    publicGoal: 'Keep her tea house out of politics.',
    look: { face: 'long', hue: 190, hat: 'hood', accent: '#6f9a9a', build: 'slim' },
    start: { trust: 45, fear: 5, resent: 0, ambition: 50, obligation: 0, suspicion: 0 },
    mask: 'Neutral',
    variants: [
      { id: 'neutral', weight: 50, hidden: 'Ysolde sells to everyone equally. She is loyal only to her own safety and her book.' },
      { id: 'kept', weight: 50, hidden: 'Ysolde quietly takes pay from someone at court, and her best tips always lean the same way.' },
    ],
  },
  anselm: {
    name: 'Brother Anselm Thorne', short: 'Anselm', role: 'Priest Who Wants Change', archetype: 'The Dreamer',
    bio: 'A thin man with a loud conscience. The poor love him. The nobles want him quiet.',
    publicGoal: 'Lower church taxes, open the grain stores, end special treatment for nobles.',
    look: { face: 'long', hue: 40, hat: 'mitre', accent: '#d8cfa8', build: 'slim' },
    start: { trust: 55, fear: 0, resent: 0, ambition: 25, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'sincere', weight: 60, hidden: 'Anselm means every word. He also does not know who is paying for his printing press.' },
      { id: 'zealot', weight: 40, hidden: 'Anselm will take any friend, and give up anything, for his cause. That includes you.' },
    ],
  },
  quill: {
    name: 'Piers Quill', short: 'Quill', role: 'Palace Steward', archetype: 'The Palace Insider',
    bio: 'Knows who sits where, who talks to whom, and which door must never be opened.',
    publicGoal: 'Keep the court in order and the king undisturbed.',
    look: { face: 'square', hue: 220, hat: 'cap', accent: '#a9b3c4', build: 'slim' },
    start: { trust: 50, fear: 5, resent: 0, ambition: 45, obligation: 0, suspicion: 0 },
    mask: 'Correct',
    canDefect: true,
    variants: [
      { id: 'leaker', weight: 55, hidden: "Quill sells the king's daily plans to the highest buyer." },
      { id: 'clean', weight: 45, hidden: 'Quill is very careful and treats fear as treason. He is the most trusted man at court, and the most tiring.' },
    ],
  },
  rask: {
    name: 'Baron Teodor Rask', short: 'Rask', role: 'Baron of the Border Lands', archetype: 'The Friend Who Follows Power',
    bio: 'Friendly with whoever is winning. Surprisingly few people hold it against him.',
    publicGoal: 'Back the king and the people with the most support.',
    look: { face: 'round', hue: 95, hat: 'cap', accent: '#a0a86a', build: 'broad' },
    start: { trust: 48, fear: 0, resent: 0, ambition: 60, obligation: 0, suspicion: 0 },
    mask: 'Loyal',
    canDefect: true,
    variants: [
      { id: 'opportunist', weight: 100, hidden: 'Rask follows power like a weathervane follows the wind. His loyalty is real, until it is not handy.' },
    ],
  },
  sabel: {
    name: 'Ambassador Imre Sabel', short: 'Sabel', role: 'Messenger from the Southern League', archetype: 'The Outsider',
    bio: 'Charming, foreign, and a little too well informed. Nobody is sure who pays him.',
    publicGoal: 'Open trade between the League and the kingdom.',
    look: { face: 'long', hue: 28, hat: 'turban', accent: '#d08a3c', build: 'slim' },
    start: { trust: 45, fear: 0, resent: 0, ambition: 65, obligation: 0, suspicion: 0 },
    mask: 'Charming',
    canDefect: true,
    variants: [
      { id: 'agent', weight: 50, hidden: "Sabel is the League's spy, sent to win the mountain pass. His charm is a tool." },
      { id: 'broker', weight: 50, hidden: 'Sabel truly wants a fair treaty. He is just bad at looking trustworthy.' },
    ],
  },
  isaura: {
    name: 'The Veiled Patron', short: 'Veiled Patron', role: 'Secret Helper', archetype: 'The Hidden Kingmaker',
    bio: 'A grey-sealed note, a carriage with closed curtains, a voice used to being obeyed.',
    publicGoal: 'None known.',
    look: { face: 'long', hue: 0, hat: 'veil', accent: '#7d7d86', build: 'slim' },
    realName: 'Dowager Duchess Isaura Venn',
    realRole: 'Aunt of the King',
    start: { trust: 30, fear: 5, resent: 0, ambition: 85, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'kingmaker', weight: 100, hidden: 'Isaura has picked and broken every favourite for thirty years. She wants her grandnephew crowned, and a helpful ruler until then.' },
    ],
  },
  aubry: {
    name: 'Dr. Lucan Aubry', short: 'Aubry', role: "King's Doctor", archetype: 'The Quiet Witness',
    bio: 'Sees everyone at their worst and tells no one. Almost no one.',
    publicGoal: 'Keep the king alive.',
    look: { face: 'square', hue: 170, hat: 'coif', accent: '#8fb0a0', build: 'slim' },
    start: { trust: 55, fear: 0, resent: 0, ambition: 15, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'honourable', weight: 100, hidden: 'Aubry only wants the king to live. He will share news with anyone who helps.' },
    ],
  },
  aldric: {
    name: 'King Aldric', short: 'The King', role: 'King of the Realm', archetype: 'The Sick King',
    bio: 'An old man in a heavy robe. He has outlasted three councils and does not trust the fourth.',
    publicGoal: 'Leave behind a throne that stays whole.',
    look: { face: 'square', hue: 48, hat: 'crown', accent: '#d4af37', build: 'broad' },
    start: { trust: 50, fear: 0, resent: 0, ambition: 10, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'tired', weight: 100, hidden: 'Aldric knows he is dying. He is quietly testing which of you deserves the kingdom.' },
    ],
  },
  crowd: {
    name: 'Petitioner', short: 'Petitioner', role: 'Person of the Kingdom', archetype: 'The People',
    bio: 'Bakers, widows, clerks and drunks. The kingdom as it really is.',
    publicGoal: '-',
    generic: true,
    look: { face: 'round', hue: 30, hat: 'none', accent: '#8a7a66', build: 'broad' },
    start: { trust: 50, fear: 0, resent: 0, ambition: 0, obligation: 0, suspicion: 0 },
    variants: [{ id: 'plain', weight: 100, hidden: '' }],
  },
};

// [a, b, values, public]. `public` relations are visible in the dossier from the start.
export const RELATIONS = [
  ['varen', 'dorne', { rivalry: 60, suspicion: 30 }, true],
  ['varen', 'kovane', { trust: 15, rivalry: 35 }, true],
  ['varen', 'quill', { trust: 40, benefit: 20 }, true],
  ['varen', 'ysolde', { benefit: 30 }, false],
  ['varen', 'isaura', { obligation: 50, benefit: 40 }, false],
  ['kovane', 'dorne', { trust: 10, rivalry: 20 }, false],
  ['kovane', 'rask', { trust: 30 }, true],
  ['dorne', 'vask', { benefit: 50 }, false],
  ['dorne', 'anselm', { trust: 40 }, true],
  ['dorne', 'rask', { trust: 35 }, true],
  ['vask', 'anselm', { rivalry: 45 }, true],
  ['vask', 'sabel', { benefit: 30 }, false],
  ['ysolde', 'quill', { benefit: 50 }, false],
  ['isaura', 'aldric', { trust: 70 }, true],
  ['aubry', 'aldric', { trust: 80 }, true],
  ['aubry', 'isaura', { benefit: 25 }, false],
  ['kovane', 'aldric', { trust: 60 }, true],
];

// Secrets the player can learn, and (optionally) expose. Agendas are generated from character variants (id `agenda_<char>`).
// onExpose runs when a secret is made public with evidence; onBackfire when it is made public without it.
export const SECRETS = {
  varen_kovane_pact: {
    title: 'The Chapel Promise', about: ['varen', 'kovane'],
    text: 'Varen and General Kovane met at midnight and promised to back each other. The guard now obeys men who are loyal to each other.',
    needsEvidence: true,
    onExpose: { m: { rep: 6, auth: 4 }, chars: { varen: { status: 'exiled', resent: 30 }, kovane: { trust: -20, resent: 25, fear: 25 } }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } },
    onBackfire: { m: { rep: -8, auth: -6 }, chars: { varen: { trust: 10, resent: 10 }, kovane: { resent: 15 } }, flags: ['varen_survives'] },
  },
  kovane_pay_petition: {
    title: "The Soldiers' Request", about: ['varen', 'kovane'],
    text: 'The midnight meeting was about unpaid wages. Varen offered to carry the request so Kovane would not look like a rebel.',
  },
  quill_leaks: {
    title: "The Steward's Side Job", about: ['quill', 'ysolde'],
    text: "Quill sells the king's weekly plans to Ysolde Marr, who sells them on.",
  },
  dorne_vask_funds: {
    title: "The Lady's Banker", about: ['dorne', 'vask'],
    text: "Master Vask has been paying for Lady Dorne's fame: the free bread, the banners and the singers.",
    needsEvidence: true,
    onExpose: { m: { rep: 4 }, chars: { dorne: { status: 'exiled', resent: 40 }, vask: { fear: 15 } }, flags: ['dorne_disgraced'] },
    onBackfire: { m: { rep: -5 }, chars: { dorne: { resent: 20, trust: -10 } } },
  },
  vask_funds_pamphlets: {
    title: 'The Printer\'s Receipt', about: ['vask', 'anselm'],
    text: 'Master Vask pays for the leaflets that curse the nobles. He gains if the old noble houses get weak.',
    needsEvidence: true,
    onExpose: { m: { rep: 4, res: -10 }, chars: { vask: { status: 'imprisoned', resent: 30 }, anselm: { trust: 6 } }, flags: ['vask_unmasked', 'conspiracy_exposed'], stat: { conspiracies: 1 } },
    onBackfire: { m: { rep: -6, res: -4 }, chars: { vask: { resent: 20 } } },
  },
  poison_cup: {
    title: 'The Poisoned Cup', about: ['aldric', 'aubry'],
    text: 'Someone is poisoning the king\'s wine. The trail leads to {culprit}.',
  },
  sabel_pass_scheme: {
    title: 'The Mountain Pass', about: ['sabel'],
    text: 'The treaty Sabel pushed on you quietly opens the mountain pass to League soldiers.',
  },
  veiled_hand_identity: {
    title: 'The Veiled Patron Found', about: ['isaura'],
    text: "The Veiled Patron is Dowager Duchess Isaura Venn, the king's aunt. She wants her grandnephew on the throne.",
  },
  ledger_page: {
    title: "The Seller's Book", about: ['ysolde'],
    text: 'Ysolde Marr keeps a book of every favour you asked, every price you paid and every person you used.',
  },
};

export function agendaSecretId(charId) { return `agenda_${charId}`; }
export function getSecret(id) {
  if (SECRETS[id]) return SECRETS[id];
  if (id.startsWith('agenda_')) {
    const charId = id.slice(7);
    const c = CHARACTERS[charId];
    if (c) return { title: `${c.short}'s true aim`, about: [charId], kind: 'agenda', char: charId };
  }
  return null;
}
export const ALL_SECRET_IDS = [
  ...Object.keys(SECRETS),
  ...Object.keys(CHARACTERS).filter(k => !CHARACTERS[k].generic).map(agendaSecretId),
];

// Observable hints shown in the dossier while a hidden agenda is still unknown. Each is a condition + sentence.
export const CLUES = {
  varen: [
    { when: { flags: ['varen_guard'], notSecret: ['agenda_varen'] }, text: 'Since you gave him the guard, he is oddly on time at the chapel.' },
    { when: { flags: ['varen_denied'], notSecret: ['agenda_varen'] }, text: 'He bowed too low when you said no.' },
    { when: { char: { varen: { suspicion: [20, null] } }, notSecret: ['agenda_varen'] }, text: 'He seems to keep track of what you tell other people.' },
  ],
  kovane: [
    { when: { flags: ['kovane_entitled'] }, text: 'He now treats his command as settled.' },
    { when: { char: { kovane: { resent: [25, null] } }, notSecret: ['agenda_kovane'] }, text: 'He keeps a hand on his sword when he talks to you.' },
  ],
  dorne: [
    { when: { notSecret: ['agenda_dorne'], flags: ['dorne_pact'] }, text: 'Her favours come with a very good memory.' },
    { when: { notSecret: ['agenda_dorne'], seen: ['dorne_toast'] }, text: 'Her toasts always mention the people and never herself.' },
  ],
  vask: [
    { when: { flags: ['vask_debt'], notSecret: ['agenda_vask'] }, text: 'His book has a page with your name, neatly ruled.' },
    { when: { seen: ['anselm_charter'], notSecret: ['agenda_vask'] }, text: 'He says little against the reformer. That is odd for a man of his kind.' },
  ],
  ysolde: [{ when: { notSecret: ['agenda_ysolde'], flags: ['ysolde_customer'] }, text: 'She never asks whose side you are on.' }],
  anselm: [{ when: { notSecret: ['agenda_anselm'], seen: ['pamphlet_storm'] }, text: 'He avoids saying who pays for his printing.' }],
  quill: [{ when: { notSecret: ['agenda_quill'], flags: ['list_rigged'] }, text: 'He made your list without one question. That is not like him.' }],
  rask: [{ when: { notSecret: ['agenda_rask'], seen: ['rask_oath'] }, text: 'He agrees with whoever spoke last.' }],
  sabel: [
    { when: { notSecret: ['agenda_sabel'], flags: ['sabel_gift'] }, text: "The star finder is beautiful. Its box has a League maker's mark." },
    { when: { notSecret: ['agenda_sabel'], seen: ['sabel_treaty'] }, text: 'He is strangely pushy about the deadline.' },
  ],
  isaura: [
    { when: { anyFlags: ['note_answered', 'note_ignored', 'veiled_patron'], notSecret: ['veiled_hand_identity'] }, text: 'A grey seal, a closed carriage, lavender. Someone arranged your arrival.' },
  ],
  aubry: [{ when: { notSecret: ['agenda_aubry'], seen: ['king_ill'] }, text: "He guards the king's door as if it were his own." }],
};
