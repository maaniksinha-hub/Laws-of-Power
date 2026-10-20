// World configuration: meters, ranks, starting backgrounds, systemic pressures and strategic styles.
// Data files use short meter keys (auth/rep/loy/res); the engine maps them to the full names.

export const METERS = ['authority', 'reputation', 'loyalty', 'resources'];
export const METER_ALIAS = { auth: 'authority', rep: 'reputation', loy: 'loyalty', res: 'resources' };

export const METER_INFO = {
  authority: { label: 'Influence', icon: 'bolt', blurb: 'How much people follow your lead.' },
  reputation: { label: 'Reputation', icon: 'star', blurb: 'How leaders and colleagues see you.' },
  loyalty: { label: 'Team trust', icon: 'team', blurb: 'Who will back you when it counts.' },
  resources: { label: 'Budget', icon: 'coin', blurb: 'Budget, favours and the means to get things done.' },
};

export const MAX_TURN = 40;

export const RANKS = [
  { title: 'New Hire', address: 'new hire' },
  { title: 'Associate', address: 'associate' },
  { title: 'Manager', address: 'manager' },
  { title: 'Director', address: 'director' },
  { title: 'Acting CEO', address: 'CEO' },
];
// Turn at which each rank may be earned (average of authority and reputation must be 40+).
export const RANK_TURNS = [0, 6, 13, 22, 31];

export const BACKGROUNDS = [
  {
    id: 'minor_noble', name: 'Graduate Hire',
    desc: 'A good degree opens doors, but not very wide.',
    meters: { authority: 45, reputation: 55, loyalty: 40, resources: 50 },
    chars: { dorne: { resent: 5 } }, unlock: null,
  },
  {
    id: 'merchant_ward', name: 'Hired from a Startup',
    desc: 'You moved fast and broke things. Now you must learn the rules.',
    meters: { authority: 40, reputation: 40, loyalty: 45, resources: 65 },
    chars: { vask: { trust: 12 }, dorne: { trust: -8 } }, unlock: null,
  },
  {
    id: 'veteran_officer', name: 'Laid-Off Manager',
    desc: 'Your old team remembers you. HR would rather forget you.',
    meters: { authority: 55, reputation: 38, loyalty: 52, resources: 35 },
    chars: { kovane: { trust: 18 }, varen: { trust: -8 } }, unlock: null,
  },
  {
    id: 'archivist', name: "Assistant's Helper",
    desc: 'You have read what others only whisper. You already know one secret goal.',
    meters: { authority: 35, reputation: 52, loyalty: 45, resources: 45 },
    reveal: ['agenda_quill'], unlock: { reigns: 1, text: 'Finish one career.' },
  },
  {
    id: 'returned_exile', name: 'Boomerang Employee',
    desc: 'You left once and came back. You know how this place works, and you have no friends. You already know one secret goal.',
    meters: { authority: 42, reputation: 36, loyalty: 36, resources: 48 },
    revealAgenda: 1, unlock: { endings: 3, text: 'Reach three different endings.' },
  },
  {
    id: 'grey_pawn', name: "The Sponsor's Pick",
    desc: 'Someone arranged your hiring, and she expects you to pay her back.',
    meters: { authority: 50, reputation: 48, loyalty: 46, resources: 52 },
    chars: { isaura: { obligation: 30, trust: 25 } }, flags: ['veiled_patron'],
    unlock: { achievement: 'unmasked', text: 'Find the Silent Sponsor in any career.' },
  },
];

// Systemic pressure: extremes are never purely good. Applied once per turn while `when` holds.
// `$all` addresses every non-generic character still at court.
export const PRESSURES = [
  { id: 'tyranny', when: { meter: { auth: [85, null] } }, warn: 'You hold on so tight that people have started to avoid you.', fx: { chars: { $all: { fear: 3, resent: 2 } }, m: { loy: -1 } } },
  { id: 'envy_fame', when: { meter: { rep: [85, null] } }, warn: 'Everyone is talking about you, and not all of it is kind.', fx: { chars: { $all: { resent: 2, suspicion: 1 } }, m: { rep: -2 } } },
  { id: 'entitlement', when: { meter: { loy: [85, null] } }, warn: 'Your team now expects more than you can give.', fx: { m: { auth: -1, res: -1 } } },
  { id: 'envy_wealth', when: { meter: { res: [85, null] } }, warn: 'Your budget gets more attention than your advice.', fx: { chars: { $all: { resent: 2 } }, m: { res: -1 } } },
  { id: 'weakness', when: { meter: { auth: [null, 25] } }, warn: 'People answer your requests with polite delay.', fx: { chars: { $all: { ambition: 3, resent: 1 } } } },
  { id: 'disrepute', when: { meter: { rep: [null, 25] } }, warn: 'Talk stops when you walk into a room.', fx: { chars: { $all: { trust: -2 } } } },
  { id: 'desertion', when: { meter: { loy: [null, 25] } }, warn: 'There are empty chairs where your friends used to sit.', fx: { chars: { $all: { trust: -2 } } } },
  { id: 'penury', when: { meter: { res: [null, 25] } }, warn: 'People you owe have started to smile at you.', fx: { chars: { vask: { obligation: 3 } } } },
];

// Flags that mirror state (set while the condition holds, cleared when it stops).
export const STATE_FLAGS = [
  { flag: 'coalition', when: { enemies: [3, null] } },
];

export const STYLES = {
  guile: { label: 'Trickery', blurb: 'You like to mislead, use pressure and let other people do your work.' },
  force: { label: 'Force', blurb: 'You settle things by making it costly to oppose you.' },
  charm: { label: 'Charm', blurb: 'You win rooms with praise, shows and careful handling of egos.' },
  restraint: { label: 'Patience', blurb: 'You wait, hold back and let others go too far before you move.' },
  candour: { label: 'Honesty', blurb: 'You tell people where they stand and accept what follows.' },
  pragmatism: { label: 'Deal-making', blurb: 'To you every friendship is a ledger, and you read it well.' },
};

export const STATUS_TEXT = {
  exiled: 'left the company',
  dead: 'has left the company',
  defected: 'has turned against you',
  imprisoned: 'was removed from the company',
};
