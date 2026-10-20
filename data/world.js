// World configuration: meters, ranks, starting backgrounds, systemic pressures and strategic styles.
// Data files use short meter keys (auth/rep/loy/res); the engine maps them to the full names.

export const METERS = ['authority', 'reputation', 'loyalty', 'resources'];
export const METER_ALIAS = { auth: 'authority', rep: 'reputation', loy: 'loyalty', res: 'resources' };

export const METER_INFO = {
  authority: { label: 'Influence', icon: 'bolt', blurb: 'How much the team and the PMs follow your lead in crit and planning.' },
  reputation: { label: 'Reputation', icon: 'star', blurb: 'How leaders and colleagues rate your work and your name.' },
  loyalty: { label: 'Team trust', icon: 'team', blurb: 'Who will back you in the room when it counts.' },
  resources: { label: 'Capacity', icon: 'coin', blurb: 'Time, headcount and budget to get the work done.' },
};

export const MAX_TURN = 40;

export const RANKS = [
  { title: 'Junior Designer', address: 'junior' },
  { title: 'Product Designer', address: 'designer' },
  { title: 'Senior Designer', address: 'senior' },
  { title: 'Design Lead', address: 'lead' },
  { title: 'Acting Head of Design', address: 'boss' },
];
// Turn at which each rank may be earned (average of authority and reputation must be 40+).
export const RANK_TURNS = [0, 6, 13, 22, 31];

export const BACKGROUNDS = [
  {
    id: 'minor_noble', name: 'Design School Graduate',
    desc: 'A sharp portfolio opens doors, but not very wide.',
    meters: { authority: 45, reputation: 55, loyalty: 40, resources: 50 },
    chars: { dorne: { resent: 5 } }, unlock: null,
  },
  {
    id: 'merchant_ward', name: 'Hired from an Agency',
    desc: 'You shipped a new client every month. Now you must live with one product and its rules.',
    meters: { authority: 40, reputation: 40, loyalty: 45, resources: 65 },
    chars: { vask: { trust: 12 }, dorne: { trust: -8 } }, unlock: null,
  },
  {
    id: 'veteran_officer', name: 'Laid-Off Startup Lead',
    desc: 'Your old team remembers you. Your old startup does not exist.',
    meters: { authority: 55, reputation: 38, loyalty: 52, resources: 35 },
    chars: { kovane: { trust: 18 }, varen: { trust: -8 } }, unlock: null,
  },
  {
    id: 'archivist', name: 'Intern Turned Junior',
    desc: 'You spent a summer in every Slack channel and read what others skip. You already know one secret goal.',
    meters: { authority: 35, reputation: 52, loyalty: 45, resources: 45 },
    reveal: ['agenda_quill'], unlock: { reigns: 1, text: 'Finish one career.' },
  },
  {
    id: 'returned_exile', name: 'Boomerang Designer',
    desc: 'You left Lumen once and came back. You know how this place works, and you have few friends left. You already know one secret goal.',
    meters: { authority: 42, reputation: 36, loyalty: 36, resources: 48 },
    revealAgenda: 1, unlock: { endings: 3, text: 'Reach three different endings.' },
  },
  {
    id: 'grey_pawn', name: "The Sponsor's Pick",
    desc: 'A senior exec pushed your offer through, and she expects a favour back.',
    meters: { authority: 50, reputation: 48, loyalty: 46, resources: 52 },
    chars: { isaura: { obligation: 30, trust: 25 } }, flags: ['veiled_patron'],
    unlock: { achievement: 'unmasked', text: 'Find the Silent Sponsor in any career.' },
  },
];

// Systemic pressure: extremes are never purely good. Applied once per turn while `when` holds.
// `$all` addresses every non-generic character still on the team.
export const PRESSURES = [
  { id: 'tyranny', when: { meter: { auth: [85, null] } }, warn: 'You decide everything in crit, and people have stopped bringing you early work.', fx: { chars: { $all: { fear: 3, resent: 2 } }, m: { loy: -1 } } },
  { id: 'envy_fame', when: { meter: { rep: [85, null] } }, warn: 'Your name is in every exec deck, and some peers are not pleased about it.', fx: { chars: { $all: { resent: 2, suspicion: 1 } }, m: { rep: -2 } } },
  { id: 'entitlement', when: { meter: { loy: [85, null] } }, warn: 'Your team now expects you to win every fight for them.', fx: { m: { auth: -1, res: -1 } } },
  { id: 'envy_wealth', when: { meter: { res: [85, null] } }, warn: 'People notice your headcount before they hear your ideas.', fx: { chars: { $all: { resent: 2 } }, m: { res: -1 } } },
  { id: 'weakness', when: { meter: { auth: [null, 25] } }, warn: 'Your Figma comments get "will look later" replies.', fx: { chars: { $all: { ambition: 3, resent: 1 } } } },
  { id: 'disrepute', when: { meter: { rep: [null, 25] } }, warn: 'Slack goes quiet when you join a thread.', fx: { chars: { $all: { trust: -2 } } } },
  { id: 'desertion', when: { meter: { loy: [null, 25] } }, warn: 'Fewer people come to your crit. The chairs stay empty.', fx: { chars: { $all: { trust: -2 } } } },
  { id: 'penury', when: { meter: { res: [null, 25] } }, warn: 'Product has started to remind you, kindly, what it did for you.', fx: { chars: { vask: { obligation: 3 } } } },
];

// Flags that mirror state (set while the condition holds, cleared when it stops).
export const STATE_FLAGS = [
  { flag: 'coalition', when: { enemies: [3, null] } },
];

export const STYLES = {
  guile: { label: 'Trickery', blurb: 'You steer with half-truths, quiet pressure and other people\'s hands.' },
  force: { label: 'Force', blurb: 'You win by making it costly to say no to your design.' },
  charm: { label: 'Charm', blurb: 'You win rooms with warm words, good demos and careful handling of egos.' },
  restraint: { label: 'Patience', blurb: 'You wait, hold back and let others over-reach before you move.' },
  candour: { label: 'Honesty', blurb: 'You say what the data says and accept the heat.' },
  pragmatism: { label: 'Deal-making', blurb: 'To you every working friendship is a trade, and you keep good notes.' },
};

export const STATUS_TEXT = {
  exiled: 'left Lumen',
  dead: 'has left Lumen',
  defected: 'has turned against you',
  imprisoned: 'was cut from the team',
};
