// World configuration: meters, ranks, starting backgrounds, systemic pressures and strategic styles.
// Data files use short meter keys (auth/rep/loy/res); the engine maps them to the full names.

export const METERS = ['authority', 'reputation', 'loyalty', 'resources'];
export const METER_ALIAS = { auth: 'authority', rep: 'reputation', loy: 'loyalty', res: 'resources' };

export const METER_INFO = {
  authority: { label: 'Authority', icon: 'crown', blurb: 'Your grip on orders and hierarchy.' },
  reputation: { label: 'Reputation', icon: 'eye', blurb: 'How the court and the people see you.' },
  loyalty: { label: 'Loyalty', icon: 'hands', blurb: 'Who will stand beside you when it counts.' },
  resources: { label: 'Resources', icon: 'coin', blurb: 'Coin, favours and operational capacity.' },
};

export const MAX_TURN = 40;

export const RANKS = [
  { title: 'Newcomer', address: 'newcomer' },
  { title: 'Courtier', address: 'courtier' },
  { title: 'Counsellor', address: 'Counsellor' },
  { title: 'Chancellor', address: 'Chancellor' },
  { title: 'Regent', address: 'Regent' },
];
// Turn at which each rank may be earned (average of authority and reputation must be 40+).
export const RANK_TURNS = [0, 6, 13, 22, 31];

export const BACKGROUNDS = [
  {
    id: 'minor_noble', name: 'Heir of a Minor House',
    desc: 'A name that opens doors, if not very wide.',
    meters: { authority: 45, reputation: 55, loyalty: 40, resources: 50 },
    chars: { dorne: { resent: 5 } }, unlock: null,
  },
  {
    id: 'merchant_ward', name: 'Ward of a Merchant House',
    desc: 'Money you did not earn and manners you had to learn.',
    meters: { authority: 40, reputation: 40, loyalty: 45, resources: 65 },
    chars: { vask: { trust: 12 }, dorne: { trust: -8 } }, unlock: null,
  },
  {
    id: 'veteran_officer', name: 'Disgraced Officer',
    desc: 'The soldiers remember you. The court would rather not.',
    meters: { authority: 55, reputation: 38, loyalty: 52, resources: 35 },
    chars: { kovane: { trust: 18 }, varen: { trust: -8 } }, unlock: null,
  },
  {
    id: 'archivist', name: "Archivist's Apprentice",
    desc: 'You have read what others only whisper. One hidden agenda is already known to you.',
    meters: { authority: 35, reputation: 52, loyalty: 45, resources: 45 },
    reveal: ['agenda_quill'], unlock: { reigns: 1, text: 'Finish one reign.' },
  },
  {
    id: 'returned_exile', name: 'Returned Exile',
    desc: 'You know how courts fall. You have nobody to lean on. One hidden agenda is already known to you.',
    meters: { authority: 42, reputation: 36, loyalty: 36, resources: 48 },
    revealAgenda: 1, unlock: { endings: 3, text: 'Reach three different endings.' },
  },
  {
    id: 'grey_pawn', name: "The Patron's Pawn",
    desc: 'Someone arranged your arrival, and she expects to be repaid.',
    meters: { authority: 50, reputation: 48, loyalty: 46, resources: 52 },
    chars: { isaura: { obligation: 30, trust: 25 } }, flags: ['veiled_patron'],
    unlock: { achievement: 'unmasked', text: 'Unmask the Veiled Patron in any reign.' },
  },
];

// Systemic pressure: extremes are never purely good. Applied once per turn while `when` holds.
// `$all` addresses every non-generic character still at court.
export const PRESSURES = [
  { id: 'tyranny', when: { meter: { auth: [85, null] } }, warn: 'Your grip is so tight that the court has begun to flinch.', fx: { chars: { $all: { fear: 3, resent: 2 } }, m: { loy: -1 } } },
  { id: 'envy_fame', when: { meter: { rep: [85, null] } }, warn: 'Your name is on every tongue, and not all of them are kind.', fx: { chars: { $all: { resent: 2, suspicion: 1 } }, m: { rep: -2 } } },
  { id: 'entitlement', when: { meter: { loy: [85, null] } }, warn: 'Your followers have begun to expect more than you can give.', fx: { m: { auth: -1, res: -1 } } },
  { id: 'envy_wealth', when: { meter: { res: [85, null] } }, warn: 'Your coffers are attracting more attention than your counsel.', fx: { chars: { $all: { resent: 2 } }, m: { res: -1 } } },
  { id: 'weakness', when: { meter: { auth: [null, 25] } }, warn: 'Your orders are being answered with polite delay.', fx: { chars: { $all: { ambition: 3, resent: 1 } } } },
  { id: 'disrepute', when: { meter: { rep: [null, 25] } }, warn: 'Conversations stop when you enter a room.', fx: { chars: { $all: { trust: -2 } } } },
  { id: 'desertion', when: { meter: { loy: [null, 25] } }, warn: 'Empty chairs where your allies used to sit.', fx: { chars: { $all: { trust: -2 } } } },
  { id: 'penury', when: { meter: { res: [null, 25] } }, warn: 'Creditors have started to smile at you.', fx: { chars: { vask: { obligation: 3 } } } },
];

// Flags that mirror state (set while the condition holds, cleared when it stops).
export const STATE_FLAGS = [
  { flag: 'coalition', when: { enemies: [3, null] } },
];

export const STYLES = {
  guile: { label: 'Guile', blurb: 'You prefer misdirection, leverage and the quiet use of other people\'s hands.' },
  force: { label: 'Force', blurb: 'You settle questions by making the cost of opposition obvious.' },
  charm: { label: 'Charm', blurb: 'You win rooms: gifts, spectacle and the careful management of admiration.' },
  restraint: { label: 'Restraint', blurb: 'You wait, withhold and let others over-commit before you move.' },
  candour: { label: 'Candour', blurb: 'You tell people where they stand, and accept what follows.' },
  pragmatism: { label: 'Pragmatism', blurb: 'Every relationship is a ledger to you, and you read it well.' },
};

export const STATUS_TEXT = {
  exiled: 'was exiled from court',
  dead: 'is dead',
  defected: 'has turned against you',
  imprisoned: 'was imprisoned',
};
