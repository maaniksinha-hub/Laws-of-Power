// Cast, relationship seeds and secrets. All hidden information lives here as data.
// `variants` are rolled at the start of every reign, so the same face can be a schemer in one reign and an honest man in the next.

export const CHARACTERS = {
  varen: {
    name: 'Lord Varen', short: 'Varen', role: 'Royal Advisor', archetype: 'The Ambitious Advisor',
    bio: 'Silver-tongued counsellor to the old king: first to offer help, last to be blamed.',
    publicGoal: 'Serve the Crown and keep the realm stable.',
    look: { face: 'long', hue: 268, hat: 'coif', accent: '#b8964e', build: 'slim' },
    start: { trust: 52, fear: 8, resent: 0, ambition: 70, obligation: 0, suspicion: 0 },
    mask: 'Devoted',
    variants: [
      { id: 'schemer', weight: 55, hidden: 'Varen intends to become regent. Every favour he does you is a brick in that wall.' },
      { id: 'honest', weight: 45, hidden: 'Varen is ambitious, but genuinely loyal. He grabs for power because he believes only he can protect the realm.' },
    ],
  },
  kovane: {
    name: 'General Idris Kovane', short: 'Kovane', role: 'Commander of the Army', archetype: 'The Loyal but Insecure General',
    bio: 'A soldier\'s soldier, adored by his men and terrified of being replaced by clerks.',
    publicGoal: 'Defend the borders and keep the army paid.',
    look: { face: 'square', hue: 8, hat: 'helm', accent: '#9aa0a6', build: 'broad' },
    start: { trust: 58, fear: 5, resent: 0, ambition: 40, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'steady', weight: 60, hidden: 'Kovane would die for the Crown, but only if he feels respected. Neglect turns him quickly.' },
      { id: 'wavering', weight: 40, hidden: 'Kovane has already been approached by others. He will follow whoever promises his men security.' },
    ],
  },
  dorne: {
    name: 'Lady Seraphine Dorne', short: 'Dorne', role: 'Noble Heiress', archetype: 'The Charismatic Rival',
    bio: 'Beloved by the crowds, quick with a toast, and never seen to want anything.',
    publicGoal: 'Champion the people against a stagnant council.',
    look: { face: 'round', hue: 342, hat: 'veil', accent: '#c58a8a', build: 'slim' },
    start: { trust: 40, fear: 0, resent: 8, ambition: 80, obligation: 0, suspicion: 5 },
    mask: 'Warm',
    variants: [
      { id: 'populist', weight: 55, hidden: 'Dorne truly wants reform, and uses charm as a ladder to get it. Her debts bind her more than she admits.' },
      { id: 'claimant', weight: 45, hidden: 'Dorne is quietly assembling a claim to the throne. Popularity is only the first step.' },
    ],
  },
  vask: {
    name: 'Master Orlo Vask', short: 'Vask', role: 'Guildmaster & Banker', archetype: 'The Wealthy Patron',
    bio: 'The man who knows what every duke owes. He prefers to be thanked in person.',
    publicGoal: 'Keep trade flowing and the treasury solvent.',
    look: { face: 'round', hue: 150, hat: 'cap', accent: '#c9a45a', build: 'broad' },
    start: { trust: 50, fear: 0, resent: 0, ambition: 55, obligation: 0, suspicion: 0 },
    mask: 'Generous',
    variants: [
      { id: 'predator', weight: 50, hidden: 'Vask lends cheaply to make rulers dependent. His real goal is a legal monopoly on trade.' },
      { id: 'patriot', weight: 50, hidden: 'Vask wants a stable realm because war is bad for ledgers. He is hard, not hostile.' },
    ],
  },
  ysolde: {
    name: 'Ysolde Marr', short: 'Ysolde', role: 'Broker of Whispers', archetype: 'The Information Broker',
    bio: 'Runs a tea-house where everyone is a little too honest. Sells what she hears.',
    publicGoal: 'Keep her establishment out of politics.',
    look: { face: 'long', hue: 190, hat: 'hood', accent: '#6f9a9a', build: 'slim' },
    start: { trust: 45, fear: 5, resent: 0, ambition: 50, obligation: 0, suspicion: 0 },
    mask: 'Neutral',
    variants: [
      { id: 'neutral', weight: 50, hidden: 'Ysolde sells to everyone, equally. Her only loyalty is to her own survival and to her ledger.' },
      { id: 'kept', weight: 50, hidden: 'Ysolde takes a quiet stipend from someone at court, and her best tips tilt the same way every time.' },
    ],
  },
  anselm: {
    name: 'Brother Anselm Thorne', short: 'Anselm', role: 'Reformer-Priest', archetype: 'The Idealistic Reformer',
    bio: 'A thin man with a loud conscience. The poor love him; the nobles want him quiet.',
    publicGoal: 'Cap the tithes, open the granaries, end noble exemptions.',
    look: { face: 'long', hue: 40, hat: 'mitre', accent: '#d8cfa8', build: 'slim' },
    start: { trust: 55, fear: 0, resent: 0, ambition: 25, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'sincere', weight: 60, hidden: 'Anselm believes every word. He is also naive about who is paying for his printing press.' },
      { id: 'zealot', weight: 40, hidden: 'Anselm will accept any ally, and any sacrifice, for his cause, including yours.' },
    ],
  },
  quill: {
    name: 'Piers Quill', short: 'Quill', role: 'Lord Chamberlain', archetype: 'The Court Insider',
    bio: 'Knows who sits where, who is speaking to whom, and which door is never to be opened.',
    publicGoal: 'Keep the court orderly and the king undisturbed.',
    look: { face: 'square', hue: 220, hat: 'cap', accent: '#a9b3c4', build: 'slim' },
    start: { trust: 50, fear: 5, resent: 0, ambition: 45, obligation: 0, suspicion: 0 },
    mask: 'Correct',
    canDefect: true,
    variants: [
      { id: 'leaker', weight: 55, hidden: 'Quill sells glimpses of the king\'s schedule to the highest bidder.' },
      { id: 'clean', weight: 45, hidden: 'Quill is obsessively discreet, and reads fear as treason. He is the most trustworthy man at court, and the most exhausting.' },
    ],
  },
  rask: {
    name: 'Baron Teodor Rask', short: 'Rask', role: 'Baron of the Marches', archetype: 'The Opportunistic Ally',
    bio: 'Friendly with whoever is winning. Remarkably few people hold it against him.',
    publicGoal: 'Support the Crown and its best-supported servants.',
    look: { face: 'round', hue: 95, hat: 'cap', accent: '#a0a86a', build: 'broad' },
    start: { trust: 48, fear: 0, resent: 0, ambition: 60, obligation: 0, suspicion: 0 },
    mask: 'Loyal',
    canDefect: true,
    variants: [
      { id: 'opportunist', weight: 100, hidden: 'Rask follows power as a weathervane follows wind. His loyalty is sincere, until it is inconvenient.' },
    ],
  },
  sabel: {
    name: 'Ambassador Imre Sabel', short: 'Sabel', role: 'Envoy of the Southern League', archetype: 'The Unpredictable Outsider',
    bio: 'Charming, foreign and a fraction too well-informed. Nobody is sure who pays him.',
    publicGoal: 'Open trade between the League and the realm.',
    look: { face: 'long', hue: 28, hat: 'turban', accent: '#d08a3c', build: 'slim' },
    start: { trust: 45, fear: 0, resent: 0, ambition: 65, obligation: 0, suspicion: 0 },
    mask: 'Charming',
    canDefect: true,
    variants: [
      { id: 'agent', weight: 50, hidden: 'Sabel is the League\'s agent, sent to pry loose the mountain pass. His charm is a tool.' },
      { id: 'broker', weight: 50, hidden: 'Sabel truly wants a fair treaty. He is merely terrible at looking trustworthy.' },
    ],
  },
  isaura: {
    name: 'The Veiled Patron', short: 'Veiled Patron', role: 'Unknown Benefactor', archetype: 'The Kingmaker Who Prefers to Stay Invisible',
    bio: 'A grey-sealed note, a curtained carriage, a voice that expects to be obeyed.',
    publicGoal: 'None known.',
    look: { face: 'long', hue: 0, hat: 'veil', accent: '#7d7d86', build: 'slim' },
    realName: 'Dowager Duchess Isaura Venn',
    realRole: 'Aunt of the King',
    start: { trust: 30, fear: 5, resent: 0, ambition: 85, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'kingmaker', weight: 100, hidden: 'Isaura has picked and broken every favourite for thirty years. She wants her grand-nephew crowned, and a compliant regent until then.' },
    ],
  },
  aubry: {
    name: 'Dr. Lucan Aubry', short: 'Aubry', role: 'Royal Physician', archetype: 'The Quiet Witness',
    bio: 'Sees everyone at their worst and tells no one. Mostly.',
    publicGoal: 'Keep the king alive.',
    look: { face: 'square', hue: 170, hat: 'coif', accent: '#8fb0a0', build: 'slim' },
    start: { trust: 55, fear: 0, resent: 0, ambition: 15, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'honourable', weight: 100, hidden: 'Aubry only wants the king to live, and will trade information to anyone who helps with that.' },
    ],
  },
  aldric: {
    name: 'King Aldric', short: 'The King', role: 'King of the Realm', archetype: 'The Ailing Crown',
    bio: 'An old man in a heavy robe who has outlasted three councils and distrusts the fourth.',
    publicGoal: 'Leave an unbroken throne.',
    look: { face: 'square', hue: 48, hat: 'crown', accent: '#d4af37', build: 'broad' },
    start: { trust: 50, fear: 0, resent: 0, ambition: 10, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'tired', weight: 100, hidden: 'Aldric knows he is dying, and is quietly testing which of you deserves to be left with the realm.' },
    ],
  },
  crowd: {
    name: 'Petitioner', short: 'Petitioner', role: 'Subject of the Realm', archetype: 'The People',
    bio: 'Bakers, widows, clerks and drunks: the realm as it actually is.',
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
    title: 'The Chapel Pact', about: ['varen', 'kovane'],
    text: 'Varen and General Kovane met at midnight and swore to support each other. The guard now answers to men whose loyalty is to each other.',
    needsEvidence: true,
    onExpose: { m: { rep: 6, auth: 4 }, chars: { varen: { status: 'exiled', resent: 30 }, kovane: { trust: -20, resent: 25, fear: 25 } }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } },
    onBackfire: { m: { rep: -8, auth: -6 }, chars: { varen: { trust: 10, resent: 10 }, kovane: { resent: 15 } }, flags: ['varen_survives'] },
  },
  kovane_pay_petition: {
    title: 'The Soldiers\' Petition', about: ['varen', 'kovane'],
    text: 'The midnight meeting was about unpaid wages. Varen offered to carry the petition so Kovane would not look like a mutineer.',
  },
  quill_leaks: {
    title: 'The Chamberlain\'s Side Income', about: ['quill', 'ysolde'],
    text: 'Quill sells the king\'s weekly schedule to Ysolde Marr, who sells it on.',
  },
  dorne_vask_funds: {
    title: 'The Lady\'s Creditor', about: ['dorne', 'vask'],
    text: 'Master Vask has been paying for Lady Dorne\'s popularity: the bread doles, the banners, the minstrels.',
    needsEvidence: true,
    onExpose: { m: { rep: 4 }, chars: { dorne: { status: 'exiled', resent: 40 }, vask: { fear: 15 } }, flags: ['dorne_disgraced'] },
    onBackfire: { m: { rep: -5 }, chars: { dorne: { resent: 20, trust: -10 } } },
  },
  vask_funds_pamphlets: {
    title: 'The Printer\'s Receipt', about: ['vask', 'anselm'],
    text: 'The pamphlets cursing the nobility are being paid for by Master Vask, who gains if the old houses weaken.',
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
    text: 'The treaty Sabel pressed on you quietly opens the mountain pass to League troops.',
  },
  veiled_hand_identity: {
    title: 'The Veiled Patron Unmasked', about: ['isaura'],
    text: 'The Veiled Patron is Dowager Duchess Isaura Venn, the king\'s aunt. She wants her grand-nephew on the throne.',
  },
  ledger_page: {
    title: 'The Broker\'s Ledger', about: ['ysolde'],
    text: 'Ysolde Marr keeps a ledger of every favour you asked, every price you paid, and every person you used.',
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
    { when: { flags: ['varen_guard'], notSecret: ['agenda_varen'] }, text: 'Since you gave him the guard, he has been oddly punctual at the chapel.' },
    { when: { flags: ['varen_denied'], notSecret: ['agenda_varen'] }, text: 'He bowed too low when you refused him.' },
    { when: { char: { varen: { suspicion: [20, null] } }, notSecret: ['agenda_varen'] }, text: 'He seems to be keeping track of what you say to others.' },
  ],
  kovane: [
    { when: { flags: ['kovane_entitled'] }, text: 'He treats his command as a settled fact now.' },
    { when: { char: { kovane: { resent: [25, null] } }, notSecret: ['agenda_kovane'] }, text: 'He keeps a hand on his sword when he speaks to you.' },
  ],
  dorne: [
    { when: { notSecret: ['agenda_dorne'], flags: ['dorne_pact'] }, text: 'Her favours come with a very accurate memory.' },
    { when: { notSecret: ['agenda_dorne'], seen: ['dorne_toast'] }, text: 'Her toasts always mention the people, and never herself.' },
  ],
  vask: [
    { when: { flags: ['vask_debt'], notSecret: ['agenda_vask'] }, text: 'His ledger has a page with your name, handsomely ruled.' },
    { when: { seen: ['anselm_charter'], notSecret: ['agenda_vask'] }, text: 'He says little against the reformer, which is curious for a man of his class.' },
  ],
  ysolde: [{ when: { notSecret: ['agenda_ysolde'], flags: ['ysolde_customer'] }, text: 'She never asks whose side you are on.' }],
  anselm: [{ when: { notSecret: ['agenda_anselm'], seen: ['pamphlet_storm'] }, text: 'He is evasive about who pays for his printing.' }],
  quill: [{ when: { notSecret: ['agenda_quill'], flags: ['list_rigged'] }, text: 'He arranged your list without a single question, which is not like him.' }],
  rask: [{ when: { notSecret: ['agenda_rask'], seen: ['rask_oath'] }, text: 'He agrees with whoever spoke last.' }],
  sabel: [
    { when: { notSecret: ['agenda_sabel'], flags: ['sabel_gift'] }, text: 'The astrolabe is beautiful. Its case has a League maker\'s mark.' },
    { when: { notSecret: ['agenda_sabel'], seen: ['sabel_treaty'] }, text: 'He is oddly insistent on the deadline.' },
  ],
  isaura: [
    { when: { anyFlags: ['note_answered', 'note_ignored', 'veiled_patron'], notSecret: ['veiled_hand_identity'] }, text: 'A grey seal, a curtained carriage, lavender. Someone arranged your arrival.' },
  ],
  aubry: [{ when: { notSecret: ['agenda_aubry'], seen: ['king_ill'] }, text: 'He guards the king\'s door like it was his own.' }],
};
