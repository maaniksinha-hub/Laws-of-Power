// Where a card "arrives" at work. Shown as a small header on the card (see js/ui.js) so each scene feels like a real moment:
// a Slack message, an email, a meeting, a one-to-one, a call, an all-hands, a review, a calendar invite, LinkedIn.
export const CHANNELS = {
  email: { label: 'Email', icon: 'mail' },
  slack: { label: 'Team chat', icon: 'chat' },
  meeting: { label: 'Meeting', icon: 'meet' },
  oneonone: { label: 'One-to-one', icon: 'two' },
  call: { label: 'Call', icon: 'call' },
  townhall: { label: 'All-hands', icon: 'stage' },
  review: { label: 'Review', icon: 'doc' },
  calendar: { label: 'Calendar', icon: 'cal' },
  linkedin: { label: 'LinkedIn', icon: 'chat' },
};

// Older story cards pick a channel here by id; any card can also set `via` itself.
export const VIA = {
  arrival: 'oneonone', varen_guard: 'oneonone', rumour_meeting: 'slack', varen_confront: 'meeting', conspiracy_ripens: 'slack', the_coup: 'meeting', watchers_found: 'slack',
  kovane_parade: 'townhall', border_raid: 'call', kovane_returns: 'townhall', kovane_doubt: 'oneonone', audience_list: 'email', quill_leak: 'slack',
  dorne_toast: 'townhall', dorne_alliance: 'oneonone', dorne_price: 'oneonone', dorne_scandal: 'email', leverage_use: 'slack',
  anselm_charter: 'email', pamphlet_storm: 'slack', anselm_arrest: 'oneonone', vask_loan: 'oneonone', vask_collect: 'call', vask_confrontation: 'email', guild_strike: 'call',
  ysolde_first: 'oneonone', ysolde_ledger: 'slack', king_ill: 'oneonone', tasting_cup: 'review', poisoner_unmasked: 'oneonone',
  anonymous_note: 'linkedin', veiled_meeting: 'call', veiled_price: 'call', unveiling: 'calendar', sabel_gift: 'email', sabel_treaty: 'email', sabel_betrayal: 'meeting',
  grain_shortage: 'meeting', tax_revolt: 'email', widow_petition: 'townhall', duel_challenge: 'townhall', feast_spectacle: 'calendar', credit_idea: 'meeting',
  friend_asks: 'oneonone', friend_betrays: 'oneonone', silence_council: 'meeting', rumour_about_you: 'slack', rask_oath: 'oneonone', rask_wavers: 'slack', rask_returns: 'oneonone',
  council_seat: 'meeting', spy_in_house: 'oneonone', bridge_toll: 'slack', hunger_march: 'townhall', heir_tutor: 'oneonone', tavern_song: 'slack', rival_wedding: 'calendar',
  border_deserters: 'slack', aubry_hospital: 'email', isaura_tea: 'oneonone', treasury_audit: 'review', quill_protocol: 'calendar', retire_offer: 'oneonone', king_death: 'townhall',
  coalition_moves: 'calendar', coalition_strikes: 'meeting', final_session: 'meeting', routine_petitions: 'meeting', routine_envoy: 'email', routine_gossip: 'slack',
};
