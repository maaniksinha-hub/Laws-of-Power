// Cast, relationship seeds and secrets. All hidden information lives here as data.
// `variants` are rolled at the start of every run, so the same face can be a schemer in one run and an honest colleague in the next.

export const CHARACTERS = {
  varen: {
    name: 'Daniel Reyes', short: 'Daniel', role: 'Design Manager', archetype: 'The Ambitious Manager',
    bio: "Maya's right hand. First to say \"happy to help\", last to be blamed. He always has a plan for you.",
    publicGoal: 'Support the team and keep Design running smoothly.',
    look: { face: 'long', hue: 220, skin: 3, hair: '#2b2623', style: 'part', outfit: '#2f3a4a', glasses: true },
    start: { trust: 52, fear: 8, resent: 0, ambition: 70, obligation: 0, suspicion: 0 },
    mask: 'Devoted',
    variants: [
      { id: 'schemer', weight: 55, hidden: 'Daniel wants Maya\'s seat. Every favour he does for you is another step on his own ladder.' },
      { id: 'honest', weight: 45, hidden: 'Daniel is hungry for control, but truly loyal. He grabs for it because he thinks only he can keep Design safe.' },
    ],
  },
  kovane: {
    name: 'Priya Nair', short: 'Priya', role: 'Design Systems Lead', archetype: 'The Loyal but Undervalued Lead',
    bio: 'Her team ships the components everyone uses and nobody thanks. She fears being replaced by people with slide decks.',
    publicGoal: 'Keep the design system healthy and her team recognised.',
    look: { face: 'round', hue: 160, skin: 5, hair: '#15100e', style: 'bun', outfit: '#3aa59a', glasses: true },
    start: { trust: 58, fear: 5, resent: 0, ambition: 40, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'steady', weight: 60, hidden: 'Priya would give her all for Design, but only if she feels respected. If you ignore her, she turns fast.' },
      { id: 'wavering', weight: 40, hidden: 'Other people have already talked to Priya. She will follow whoever promises her team safety.' },
    ],
  },
  dorne: {
    name: 'Jordan Blake', short: 'Jordan', role: 'Creative Director, Brand', archetype: 'The Charming Rival',
    bio: 'Loved by everyone, brilliant at all-hands, and never seen to want anything.',
    publicGoal: 'Stand up for the brand and the people who make it.',
    look: { face: 'square', hue: 350, skin: 2, hair: '#8a3b2a', style: 'curly', outfit: '#f08ca0', shades: true },
    start: { trust: 40, fear: 0, resent: 8, ambition: 80, obligation: 0, suspicion: 5 },
    mask: 'Warm',
    variants: [
      { id: 'populist', weight: 55, hidden: 'Jordan truly wants change, and uses charm as a ladder to get it. Old favours hold Jordan more than they admit.' },
      { id: 'claimant', weight: 45, hidden: "Jordan is quietly building a case to be the next head of Design. Being popular is only the first step." },
    ],
  },
  vask: {
    name: 'Ethan Cole', short: 'Ethan', role: 'VP of Product', archetype: 'The Roadmap Broker',
    bio: 'He owns the roadmap and the headcount. He does favours, and he likes to be thanked in person.',
    publicGoal: 'Ship the roadmap and keep Product and Design aligned.',
    look: { face: 'round', hue: 150, skin: 4, hair: '#a9adb3', style: 'short', outfit: '#23473d', glasses: true },
    start: { trust: 50, fear: 0, resent: 0, ambition: 55, obligation: 0, suspicion: 0 },
    mask: 'Generous',
    variants: [
      { id: 'predator', weight: 50, hidden: 'Ethan gives out cheap favours so leaders owe him. His real goal is to move Design under Product.' },
      { id: 'patriot', weight: 50, hidden: 'Ethan wants a calm company, because chaos hurts his roadmap. He is tough, but not an enemy.' },
    ],
  },
  ysolde: {
    name: 'Sofia Alvarez', short: 'Sofia', role: 'Design Ops Manager', archetype: 'The Person Who Knows Everything',
    bio: 'She sees every calendar, every budget line and every unhappy face. She trades in what she knows.',
    publicGoal: 'Stay out of politics and keep the tools running.',
    look: { face: 'long', hue: 180, skin: 4, hair: '#1c1514', style: 'long', outfit: '#e8b923', headset: true },
    start: { trust: 45, fear: 5, resent: 0, ambition: 50, obligation: 0, suspicion: 0 },
    mask: 'Neutral',
    variants: [
      { id: 'neutral', weight: 50, hidden: 'Sofia shares news with everyone equally. She is loyal only to her own safety and her notes.' },
      { id: 'kept', weight: 50, hidden: 'Sofia quietly takes favours from someone senior, and her best tips always lean the same way.' },
    ],
  },
  anselm: {
    name: 'Hannah Lee', short: 'Hannah', role: 'People Partner', archetype: 'The Fair Rule-Keeper',
    bio: 'Careful, kind and hard to rush. Staff trust her. Leaders wish she would ask fewer questions.',
    publicGoal: 'Fair rules for hiring, pay and promotion, with no special treatment.',
    look: { face: 'round', hue: 40, skin: 1, hair: '#6b4a2e', style: 'bob', outfit: '#8d7fd6', glasses: true },
    start: { trust: 55, fear: 0, resent: 0, ambition: 25, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'sincere', weight: 60, hidden: 'Hannah means every word. She also does not know who is feeding her information.' },
      { id: 'zealot', weight: 40, hidden: 'Hannah will take any ally, and give up almost anything, for fair rules. That includes you.' },
    ],
  },
  quill: {
    name: 'Tom Becker', short: 'Tom', role: 'Design Program Manager', archetype: 'The Calendar Guard',
    bio: 'He knows who sits where, who talks to whom, and who gets time with Maya.',
    publicGoal: "Keep Maya's week and the team calendar running smoothly.",
    look: { face: 'square', hue: 230, skin: 2, hair: '#1b1a1c', style: 'crop', outfit: '#6d7785', glasses: true, badge: true },
    start: { trust: 50, fear: 5, resent: 0, ambition: 45, obligation: 0, suspicion: 0 },
    mask: 'Correct',
    canDefect: true,
    variants: [
      { id: 'leaker', weight: 55, hidden: "Tom sells Maya's calendar and agenda to whoever asks nicely." },
      { id: 'clean', weight: 45, hidden: 'Tom is very careful and treats a leak as a betrayal. He is the most trusted person in Design, and the most tiring.' },
    ],
  },
  rask: {
    name: 'Ravi Shah', short: 'Ravi', role: 'Product Designer', archetype: 'The Friend Who Follows Winners',
    bio: 'Friendly with whoever is winning. Surprisingly few people hold it against him.',
    publicGoal: 'Do good work and back the people with the most support.',
    look: { face: 'round', hue: 200, skin: 3, hair: '#3a2a20', style: 'short', outfit: '#2f8fd0', headset: true },
    start: { trust: 48, fear: 0, resent: 0, ambition: 60, obligation: 0, suspicion: 0 },
    mask: 'Loyal',
    canDefect: true,
    variants: [
      { id: 'opportunist', weight: 100, hidden: 'Ravi follows power like a weathervane follows the wind. His loyalty is real, until it is not handy.' },
    ],
  },
  sabel: {
    name: 'Lena Fischer', short: 'Lena', role: 'Partner at Pixelhouse (design agency)', archetype: 'The Agency Charmer',
    bio: 'Charming, from an outside agency, and a little too well informed. Gifts first, small print later.',
    publicGoal: 'Sign a fair, long partnership between Pixelhouse and Lumen.',
    look: { face: 'long', hue: 20, skin: 6, hair: '#17110f', style: 'part', outfit: '#7a2e3b', glasses: true },
    start: { trust: 45, fear: 0, resent: 0, ambition: 65, obligation: 0, suspicion: 0 },
    mask: 'Charming',
    canDefect: true,
    variants: [
      { id: 'agent', weight: 50, hidden: 'Lena works for a rival. She wants access to our files and customer data. Her charm is a tool.' },
      { id: 'broker', weight: 50, hidden: 'Lena truly wants a fair deal. She is just bad at looking trustworthy.' },
    ],
  },
  isaura: {
    name: 'The Silent Sponsor', short: 'Silent Sponsor', role: 'A senior executive', archetype: 'The Hidden Kingmaker',
    bio: 'An unsigned calendar invite, a quiet coffee, a voice used to being obeyed.',
    publicGoal: 'None known.',
    look: { face: 'long', hue: 260, skin: 2, hair: '#c9ccd3', style: 'bob', outfit: '#16181d', shades: true },
    realName: 'Dr. Elena Voss',
    realRole: 'Chief Product Officer',
    start: { trust: 30, fear: 5, resent: 0, ambition: 85, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'kingmaker', weight: 100, hidden: 'She has picked and dropped rising stars for years. She wants a Design head who will answer to Product, and a helpful one until then.' },
    ],
  },
  aubry: {
    name: 'Noor Haddad', short: 'Noor', role: 'Senior UX Researcher', archetype: 'The Honest Researcher',
    bio: 'Sees every test result and tells no one. Almost no one.',
    publicGoal: 'Keep the research honest.',
    look: { face: 'square', hue: 170, skin: 5, hair: '#2a1b18', style: 'curly', outfit: '#47535f', glasses: true },
    start: { trust: 55, fear: 0, resent: 0, ambition: 15, obligation: 0, suspicion: 0 },
    canDefect: true,
    variants: [
      { id: 'honourable', weight: 100, hidden: 'Noor only wants honest data. She will share what she finds with anyone who helps.' },
    ],
  },
  aldric: {
    name: 'Maya Brandt', short: 'Maya', role: 'VP of Design', archetype: 'The Tired Visionary',
    bio: 'Charismatic, kind and very tired. She built this team and is about to move to a bigger job.',
    publicGoal: 'Leave behind a Design team that stays whole.',
    look: { face: 'round', hue: 30, skin: 2, hair: '#d8d4cf', style: 'bob', outfit: '#3d3d47', glasses: true },
    start: { trust: 50, fear: 0, resent: 0, ambition: 10, obligation: 0, suspicion: 0 },
    variants: [
      { id: 'tired', weight: 100, hidden: 'Maya knows she will leave soon. She is quietly testing which of you deserves her seat.' },
    ],
  },
  crowd: {
    name: 'Colleague', short: 'Colleague', role: 'Person at Lumen', archetype: 'The Team',
    bio: 'Interns, engineers, PMs and researchers. The company as it really is.',
    publicGoal: '-',
    generic: true,
    look: { face: 'round', hue: 200, skin: 3, hair: '#3a2e28', style: 'short', outfit: '#5b6f8a' },
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
    title: 'The Late Night Deal', about: ['varen', 'kovane'],
    text: 'Daniel and Priya met after hours and promised to back each other. The Design Systems team now answers to people who are loyal to each other.',
    needsEvidence: true,
    onExpose: { m: { rep: 6, auth: 4 }, chars: { varen: { status: 'exiled', resent: 30 }, kovane: { trust: -20, resent: 25, fear: 25 } }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } },
    onBackfire: { m: { rep: -8, auth: -6 }, chars: { varen: { trust: 10, resent: 10 }, kovane: { resent: 15 } }, flags: ['varen_survives'] },
  },
  kovane_pay_petition: {
    title: "The Team's Ask", about: ['varen', 'kovane'],
    text: 'The late meeting was about unpaid crunch hours. Daniel offered to carry the request so Priya would not look like a troublemaker.',
  },
  quill_leaks: {
    title: "The Calendar Leak", about: ['quill', 'ysolde'],
    text: "Tom shares Maya's weekly calendar with Sofia Alvarez, who passes it on.",
  },
  dorne_vask_funds: {
    title: "The Favour Bank", about: ['dorne', 'vask'],
    text: "Ethan Cole has been paying for Jordan's big wins: the extra headcount, the launch budget and the award entries.",
    needsEvidence: true,
    onExpose: { m: { rep: 4 }, chars: { dorne: { status: 'exiled', resent: 40 }, vask: { fear: 15 } }, flags: ['dorne_disgraced'] },
    onBackfire: { m: { rep: -5 }, chars: { dorne: { resent: 20, trust: -10 } } },
  },
  vask_funds_pamphlets: {
    title: 'The Account Behind the Posts', about: ['vask', 'anselm'],
    text: 'Ethan feeds the anonymous posts that attack Design leaders. He gains if they look weak and Design moves under Product.',
    needsEvidence: true,
    onExpose: { m: { rep: 4, res: -10 }, chars: { vask: { status: 'imprisoned', resent: 30 }, anselm: { trust: 6 } }, flags: ['vask_unmasked', 'conspiracy_exposed'], stat: { conspiracies: 1 } },
    onBackfire: { m: { rep: -6, res: -4 }, chars: { vask: { resent: 20 } } },
  },
  poison_cup: {
    title: 'The Changed Results', about: ['aldric', 'aubry'],
    text: 'Someone is quietly changing usability test results and metrics. The trail leads to {culprit}.',
  },
  sabel_pass_scheme: {
    title: 'The Hidden Access Clause', about: ['sabel'],
    text: 'The contract Lena pushed on you quietly gives Pixelhouse access to our Figma files and customer data.',
  },
  veiled_hand_identity: {
    title: 'The Silent Sponsor Found', about: ['isaura'],
    text: 'The Silent Sponsor is Dr. Elena Voss, Chief Product Officer. She wants a Design head who answers to Product.',
  },
  ledger_page: {
    title: "Sofia's Screenshots", about: ['ysolde'],
    text: 'Sofia Alvarez keeps screenshots of every favour you asked, every price you paid and every person you used.',
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
    { when: { flags: ['varen_guard'], notSecret: ['agenda_varen'] }, text: 'Since you gave him the Systems team, he is oddly often in meeting room 4.' },
    { when: { flags: ['varen_denied'], notSecret: ['agenda_varen'] }, text: 'He smiled too widely when you said no. Then he said "no problem" twice.' },
    { when: { char: { varen: { suspicion: [20, null] } }, notSecret: ['agenda_varen'] }, text: 'He seems to know what you told other people in DMs.' },
  ],
  kovane: [
    { when: { flags: ['kovane_entitled'] }, text: 'She now treats her team as untouchable.' },
    { when: { char: { kovane: { resent: [25, null] } }, notSecret: ['agenda_kovane'] }, text: 'She goes quiet on camera when you speak.' },
  ],
  dorne: [
    { when: { notSecret: ['agenda_dorne'], flags: ['dorne_pact'] }, text: 'Her favours come with a very good memory.' },
    { when: { notSecret: ['agenda_dorne'], seen: ['dorne_toast'] }, text: 'Her shout-outs always thank the team and never mention herself.' },
  ],
  vask: [
    { when: { flags: ['vask_debt'], notSecret: ['agenda_vask'] }, text: 'His notes have a page with your name, neatly ruled.' },
    { when: { seen: ['anselm_charter'], notSecret: ['agenda_vask'] }, text: 'He says little against the fair hiring plan. That is odd for a VP of Product.' },
  ],
  ysolde: [{ when: { notSecret: ['agenda_ysolde'], flags: ['ysolde_customer'] }, text: 'She never asks whose side you are on.' }],
  anselm: [{ when: { notSecret: ['agenda_anselm'], seen: ['pamphlet_storm'] }, text: 'She avoids saying who gave her the tip.' }],
  quill: [{ when: { notSecret: ['agenda_quill'], flags: ['list_rigged'] }, text: 'He built your meeting list without one question. That is not like him.' }],
  rask: [{ when: { notSecret: ['agenda_rask'], seen: ['rask_oath'] }, text: 'He agrees with whoever spoke last in the sync.' }],
  sabel: [
    { when: { notSecret: ['agenda_sabel'], flags: ['sabel_gift'] }, text: "The gift is beautiful. Its box has a rival agency's logo." },
    { when: { notSecret: ['agenda_sabel'], seen: ['sabel_treaty'] }, text: 'She is strangely pushy about the signing date.' },
  ],
  isaura: [
    { when: { anyFlags: ['note_answered', 'note_ignored', 'veiled_patron'], notSecret: ['veiled_hand_identity'] }, text: 'An unsigned calendar invite and a quiet coffee. Someone arranged your rise.' },
  ],
  aubry: [{ when: { notSecret: ['agenda_aubry'], seen: ['king_ill'] }, text: 'She guards the raw test data as if it were her own.' }],
};
