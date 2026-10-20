// Cast, relationship seeds and secrets. All hidden information lives here as data.
// `variants` are rolled at the start of every reign, so the same face can be a schemer in one reign and an honest man in the next.

export const CHARACTERS = {
  varen: {
    name: 'Marcus Vance', short: 'Marcus', role: 'Chief of Staff', archetype: 'The Ambitious Right Hand',
    bio: "The CEO's right hand. First to offer help, last to be blamed. He always has a plan for you.",
    publicGoal: 'Serve the company and keep things calm.',
    look: { face: 'long', hue: 220, skin: 3, hair: '#2b2623', style: 'part', outfit: '#1f3354', tie: '#ffd84d', badge: true },
    start: { trust: 52, fear: 8, resent: 0, ambition: 70, obligation: 0, suspicion: 0 },
    mask: 'Devoted',
    variants: [
      { id: 'schemer', weight: 55, hidden: 'Marcus wants the top job. Every favour he does for you is another step on his own ladder.' },
      { id: 'honest', weight: 45, hidden: 'Marcus is hungry for power, but truly loyal. He grabs for control because he thinks only he can keep the company safe.' },
    ],
  },
  kovane: {
    name: 'Dana Kowalski', short: 'Dana', role: 'Head of Operations', archetype: 'The Loyal but Worried Operator',
    bio: 'Her teams would follow her anywhere. She fears being replaced by people with slide decks.',
    publicGoal: 'Keep projects on time and the teams paid.',
    look: { face: 'square', hue: 160, skin: 5, hair: '#15100e', style: 'crop', outfit: '#35424f', badge: true },
    start: { trust: 58, fear: 5, resent: 0, ambition: 40, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'steady', weight: 60, hidden: 'Dana would give her all for the company, but only if she feels respected. If you ignore her, she turns fast.' },
      { id: 'wavering', weight: 40, hidden: 'Other people have already talked to Dana. She will follow whoever promises her teams safety.' },
    ],
  },
  dorne: {
    name: 'Selena Dorsey', short: 'Selena', role: 'Head of Sales', archetype: 'The Charming Rival',
    bio: 'Loved by everyone, great in all-hands meetings, and never seen to want anything.',
    publicGoal: 'Stand up for the people who bring in the money.',
    look: { face: 'round', hue: 350, skin: 2, hair: '#8a3b2a', style: 'long', outfit: '#b13a4b', badge: true },
    start: { trust: 40, fear: 0, resent: 8, ambition: 80, obligation: 0, suspicion: 5 },
    mask: 'Warm',
    variants: [
      { id: 'populist', weight: 55, hidden: 'Selena truly wants change, and uses charm as a ladder to get it. Her debts hold her more than she admits.' },
      { id: 'claimant', weight: 45, hidden: 'Selena is quietly building a case to be the next CEO. Being popular is only the first step.' },
    ],
  },
  vask: {
    name: 'Oliver Vasquez', short: 'Oliver', role: 'Investor and Board Member', archetype: 'The Rich Backer',
    bio: 'He knows what every company in town owes. He likes to be thanked in person.',
    publicGoal: 'Keep the money flowing and the company healthy.',
    look: { face: 'round', hue: 150, skin: 4, hair: '#a9adb3', style: 'short', outfit: '#23473d', glasses: true, tie: '#e8edf3' },
    start: { trust: 50, fear: 0, resent: 0, ambition: 55, obligation: 0, suspicion: 0 },
    mask: 'Generous',
    variants: [
      { id: 'predator', weight: 50, hidden: 'Oliver gives cheap money so leaders depend on him. His real goal is to control the key deals.' },
      { id: 'patriot', weight: 50, hidden: 'Oliver wants a calm company, because chaos is bad for his money. He is tough, but not an enemy.' },
    ],
  },
  ysolde: {
    name: 'Yara Mendes', short: 'Yara', role: 'Executive Assistant', archetype: 'The Office Hub',
    bio: 'She sees every calendar and hears every rumour. She trades in what she knows.',
    publicGoal: 'Stay out of office politics.',
    look: { face: 'long', hue: 180, skin: 4, hair: '#1c1514', style: 'bun', outfit: '#1f7f86', headset: true, badge: true },
    start: { trust: 45, fear: 5, resent: 0, ambition: 50, obligation: 0, suspicion: 0 },
    mask: 'Neutral',
    variants: [
      { id: 'neutral', weight: 50, hidden: 'Yara shares news with everyone equally. She is loyal only to her own safety and her notes.' },
      { id: 'kept', weight: 50, hidden: 'Yara quietly takes favours from someone senior, and her best tips always lean the same way.' },
    ],
  },
  anselm: {
    name: 'Andrew Thorne', short: 'Andrew', role: 'Head of People', archetype: 'The Culture Reformer',
    bio: 'A thin man with a loud conscience. Staff love him. The bosses want him quiet.',
    publicGoal: 'Fair pay for everyone, a shorter work week, and no special treatment for executives.',
    look: { face: 'long', hue: 40, skin: 1, hair: '#6b4a2e', style: 'curly', outfit: '#c9962a', glasses: true, badge: true },
    start: { trust: 55, fear: 0, resent: 0, ambition: 25, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'sincere', weight: 60, hidden: 'Andrew means every word. He also does not know who is paying for his campaign.' },
      { id: 'zealot', weight: 40, hidden: 'Andrew will take any friend, and give up anything, for his cause. That includes you.' },
    ],
  },
  quill: {
    name: 'Quentin Park', short: 'Quentin', role: "Head of the CEO's Office", archetype: 'The Gatekeeper',
    bio: 'He knows who sits where, who talks to whom, and which door must never be opened.',
    publicGoal: "Keep the CEO's day running smoothly.",
    look: { face: 'square', hue: 230, skin: 2, hair: '#1b1a1c', style: 'part', outfit: '#6d7785', glasses: true, tie: '#2f6fe0', badge: true },
    start: { trust: 50, fear: 5, resent: 0, ambition: 45, obligation: 0, suspicion: 0 },
    mask: 'Correct',
    canDefect: true,
    variants: [
      { id: 'leaker', weight: 55, hidden: "Quentin sells the CEO's calendar to the highest buyer." },
      { id: 'clean', weight: 45, hidden: 'Quentin is very careful and treats a leak as treason. He is the most trusted man at HQ, and the most tiring.' },
    ],
  },
  rask: {
    name: 'Ryan Rask', short: 'Ryan', role: 'Regional Director', archetype: 'The Friend Who Follows Power',
    bio: 'Friendly with whoever is winning. Surprisingly few people hold it against him.',
    publicGoal: 'Back the leaders with the most support.',
    look: { face: 'round', hue: 200, skin: 3, hair: '#a8864f', style: 'short', outfit: '#6fa3d8', badge: true },
    start: { trust: 48, fear: 0, resent: 0, ambition: 60, obligation: 0, suspicion: 0 },
    mask: 'Loyal',
    canDefect: true,
    variants: [
      { id: 'opportunist', weight: 100, hidden: 'Ryan follows power like a weathervane follows the wind. His loyalty is real, until it is not handy.' },
    ],
  },
  sabel: {
    name: 'Imre Sabel', short: 'Imre', role: 'Partner at Southline Group', archetype: 'The Outsider',
    bio: 'Charming, from another firm, and a little too well informed. Nobody is sure who pays him.',
    publicGoal: 'Sign a fair partnership between Southline and the company.',
    look: { face: 'long', hue: 20, skin: 4, hair: '#17110f', style: 'short', outfit: '#7a2e3b', beard: true },
    start: { trust: 45, fear: 0, resent: 0, ambition: 65, obligation: 0, suspicion: 0 },
    mask: 'Charming',
    canDefect: true,
    variants: [
      { id: 'agent', weight: 50, hidden: 'Imre works for a rival. He wants access to our core systems. His charm is a tool.' },
      { id: 'broker', weight: 50, hidden: 'Imre truly wants a fair deal. He is just bad at looking trustworthy.' },
    ],
  },
  isaura: {
    name: 'The Silent Sponsor', short: 'Silent Sponsor', role: 'Secret Mentor', archetype: 'The Hidden Kingmaker',
    bio: 'An unsigned message, a car with dark windows, a voice used to being obeyed.',
    publicGoal: 'None known.',
    look: { face: 'long', hue: 260, skin: 2, hair: '#c9ccd3', style: 'bob', outfit: '#16181d', shades: true },
    realName: 'Isabel Venn',
    realRole: 'Chair of the Board',
    start: { trust: 30, fear: 5, resent: 0, ambition: 85, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'kingmaker', weight: 100, hidden: 'She has picked and broken every rising star for thirty years. She wants her nephew to be CEO, and a helpful leader until then.' },
    ],
  },
  aubry: {
    name: 'Lucas Aubry', short: 'Lucas', role: 'Head of Internal Audit', archetype: 'The Quiet Witness',
    bio: "Sees everyone's numbers and tells no one. Almost no one.",
    publicGoal: 'Keep the books honest.',
    look: { face: 'square', hue: 170, skin: 5, hair: '#9aa0a8', style: 'bald', outfit: '#47535f', glasses: true, badge: true },
    start: { trust: 55, fear: 0, resent: 0, ambition: 15, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'honourable', weight: 100, hidden: 'Lucas only wants honest numbers. He will share news with anyone who helps.' },
    ],
  },
  aldric: {
    name: 'Alan Richter', short: 'The CEO', role: 'Founder and CEO', archetype: 'The Tired Founder',
    bio: 'An older man in a plain jacket. He built the company and does not trust the next team.',
    publicGoal: 'Leave behind a company that stays whole.',
    look: { face: 'square', hue: 30, skin: 1, hair: '#e6e8ec', style: 'short', outfit: '#2d3a4b' },
    start: { trust: 50, fear: 0, resent: 0, ambition: 10, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'tired', weight: 100, hidden: 'Alan knows he will step down soon. He is quietly testing which of you deserves the company.' },
    ],
  },
  crowd: {
    name: 'Colleague', short: 'Colleague', role: 'Person at the Company', archetype: 'The Team',
    bio: 'Interns, engineers, assistants and customers. The company as it really is.',
    publicGoal: '-',
    generic: true,
    look: { face: 'round', hue: 200, skin: 3, hair: '#3a2e28', style: 'short', outfit: '#5b6f8a', badge: true },
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
    title: 'The Meeting Room Deal', about: ['varen', 'kovane'],
    text: 'Marcus and Dana met late at night and promised to back each other. The delivery team now answers to people who are loyal to each other.',
    needsEvidence: true,
    onExpose: { m: { rep: 6, auth: 4 }, chars: { varen: { status: 'exiled', resent: 30 }, kovane: { trust: -20, resent: 25, fear: 25 } }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } },
    onBackfire: { m: { rep: -8, auth: -6 }, chars: { varen: { trust: 10, resent: 10 }, kovane: { resent: 15 } }, flags: ['varen_survives'] },
  },
  kovane_pay_petition: {
    title: "The Team's Request", about: ['varen', 'kovane'],
    text: 'The late meeting was about unpaid overtime. Marcus offered to carry the request so Dana would not look like a troublemaker.',
  },
  quill_leaks: {
    title: "The Gatekeeper's Side Job", about: ['quill', 'ysolde'],
    text: "Quentin sells the CEO's weekly calendar to Yara Mendes, who passes it on.",
  },
  dorne_vask_funds: {
    title: "The Star's Investor", about: ['dorne', 'vask'],
    text: "Oliver Vasquez has been paying for Selena's big wins: the discounts, the awards and the bonus pool.",
    needsEvidence: true,
    onExpose: { m: { rep: 4 }, chars: { dorne: { status: 'exiled', resent: 40 }, vask: { fear: 15 } }, flags: ['dorne_disgraced'] },
    onBackfire: { m: { rep: -5 }, chars: { dorne: { resent: 20, trust: -10 } } },
  },
  vask_funds_pamphlets: {
    title: 'The Account Behind the Posts', about: ['vask', 'anselm'],
    text: 'Oliver pays for the anonymous posts that attack the bosses. He gains if the old leaders get weak.',
    needsEvidence: true,
    onExpose: { m: { rep: 4, res: -10 }, chars: { vask: { status: 'imprisoned', resent: 30 }, anselm: { trust: 6 } }, flags: ['vask_unmasked', 'conspiracy_exposed'], stat: { conspiracies: 1 } },
    onBackfire: { m: { rep: -6, res: -4 }, chars: { vask: { resent: 20 } } },
  },
  poison_cup: {
    title: 'The Changed Numbers', about: ['aldric', 'aubry'],
    text: 'Someone is quietly changing the quarterly numbers. The trail leads to {culprit}.',
  },
  sabel_pass_scheme: {
    title: 'The Hidden Access Clause', about: ['sabel'],
    text: 'The contract Imre pushed on you quietly gives his firm admin access to our core systems.',
  },
  veiled_hand_identity: {
    title: 'The Silent Sponsor Found', about: ['isaura'],
    text: 'The Silent Sponsor is Isabel Venn, Chair of the Board. She wants her nephew to be the next CEO.',
  },
  ledger_page: {
    title: "Yara's Screenshots", about: ['ysolde'],
    text: 'Yara Mendes keeps screenshots of every favour you asked, every price you paid and every person you used.',
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
    { when: { flags: ['varen_guard'], notSecret: ['agenda_varen'] }, text: 'Since you gave him Delivery, he is oddly often in meeting room 4.' },
    { when: { flags: ['varen_denied'], notSecret: ['agenda_varen'] }, text: 'He smiled too widely when you said no.' },
    { when: { char: { varen: { suspicion: [20, null] } }, notSecret: ['agenda_varen'] }, text: 'He seems to keep track of what you tell other people.' },
  ],
  kovane: [
    { when: { flags: ['kovane_entitled'] }, text: 'She now treats her team as settled.' },
    { when: { char: { kovane: { resent: [25, null] } }, notSecret: ['agenda_kovane'] }, text: 'She crosses her arms when she talks to you.' },
  ],
  dorne: [
    { when: { notSecret: ['agenda_dorne'], flags: ['dorne_pact'] }, text: 'Her favours come with a very good memory.' },
    { when: { notSecret: ['agenda_dorne'], seen: ['dorne_toast'] }, text: 'Her shout-outs always mention the team and never herself.' },
  ],
  vask: [
    { when: { flags: ['vask_debt'], notSecret: ['agenda_vask'] }, text: 'His notes have a page with your name, neatly ruled.' },
    { when: { seen: ['anselm_charter'], notSecret: ['agenda_vask'] }, text: 'He says little against the culture plan. That is odd for an investor.' },
  ],
  ysolde: [{ when: { notSecret: ['agenda_ysolde'], flags: ['ysolde_customer'] }, text: 'She never asks whose side you are on.' }],
  anselm: [{ when: { notSecret: ['agenda_anselm'], seen: ['pamphlet_storm'] }, text: 'He avoids saying who pays for his campaign.' }],
  quill: [{ when: { notSecret: ['agenda_quill'], flags: ['list_rigged'] }, text: 'He made your meeting list without one question. That is not like him.' }],
  rask: [{ when: { notSecret: ['agenda_rask'], seen: ['rask_oath'] }, text: 'He agrees with whoever spoke last.' }],
  sabel: [
    { when: { notSecret: ['agenda_sabel'], flags: ['sabel_gift'] }, text: "The gift is beautiful. Its box has a rival firm's logo." },
    { when: { notSecret: ['agenda_sabel'], seen: ['sabel_treaty'] }, text: 'He is strangely pushy about the deadline.' },
  ],
  isaura: [
    { when: { anyFlags: ['note_answered', 'note_ignored', 'veiled_patron'], notSecret: ['veiled_hand_identity'] }, text: 'An unsigned note, a dark car, a faint perfume. Someone arranged your rise.' },
  ],
  aubry: [{ when: { notSecret: ['agenda_aubry'], seen: ['king_ill'] }, text: 'He guards the quarterly numbers as if they were his own.' }],
};
