// Achievements are checked when a reign ends. `check` receives { meta, state, ending }.
export const TRACKED_FLAGS = ['conspiracy_exposed', 'lowauth_victory'];

export const ACHIEVEMENTS = [
  { id: 'first_reign', title: 'A Seat at the Table', desc: 'Finish your first reign.', check: () => true },
  { id: 'survive25', title: 'Long Enough to Matter', desc: 'Survive 25 turns.', check: ({ state }) => state.turn - 1 >= 25 },
  { id: 'five_agendas', title: 'Faces Behind Faces', desc: 'Discover five hidden agendas.', check: ({ meta }) => Object.keys(meta.agendas).length >= 5 },
  { id: 'clean_reign', title: 'Clean Hands', desc: 'Complete a full reign without suffering a betrayal.', check: ({ state }) => state.turn > 40 && (state.stats.betrayals || 0) === 0 },
  { id: 'expose', title: 'Daylight', desc: 'Successfully expose a conspiracy.', check: ({ meta }) => !!meta.flagsEver.conspiracy_exposed },
  { id: 'lowauth', title: 'Strength Without a Crown', desc: 'Win a confrontation despite low authority.', check: ({ meta }) => !!meta.flagsEver.lowauth_victory },
  { id: 'three_objectives', title: 'A Patient Hand', desc: 'Complete three distinct secret objectives.', check: ({ meta }) => Object.keys(meta.objectivesDone).length >= 3 },
  { id: 'endings3', title: 'Many Roads', desc: 'Reach three different endings.', check: ({ meta }) => Object.keys(meta.endings).length >= 3 },
  { id: 'supreme', title: 'The Seal of the Realm', desc: 'Rise to supreme influence.', check: ({ meta }) => !!meta.endings.supreme },
  { id: 'peaceful', title: 'Leave While They Say Please', desc: 'Negotiate your own exit.', check: ({ meta }) => !!meta.endings.negotiated_exit },
  { id: 'unmasked', title: 'Behind the Veil', desc: 'Unmask the Veiled Patron.', check: ({ meta }) => !!meta.secrets.veiled_hand_identity },
];
