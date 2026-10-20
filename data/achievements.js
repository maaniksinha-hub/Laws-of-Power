// Achievements are checked when a reign ends. `check` receives { meta, state, ending }.
export const TRACKED_FLAGS = ['conspiracy_exposed', 'lowauth_victory'];

export const ACHIEVEMENTS = [
  { id: 'first_reign', title: 'A Seat at the Table', desc: 'Finish your first reign.', check: () => true },
  { id: 'survive25', title: 'Long Enough to Matter', desc: 'Last 25 turns.', check: ({ state }) => state.turn - 1 >= 25 },
  { id: 'five_agendas', title: 'Faces Behind Faces', desc: 'Learn five secret goals.', check: ({ meta }) => Object.keys(meta.agendas).length >= 5 },
  { id: 'clean_reign', title: 'Clean Hands', desc: 'Finish a full reign without being betrayed.', check: ({ state }) => state.turn > 40 && (state.stats.betrayals || 0) === 0 },
  { id: 'expose', title: 'Daylight', desc: 'Uncover a secret plot.', check: ({ meta }) => !!meta.flagsEver.conspiracy_exposed },
  { id: 'lowauth', title: 'Strength Without a Crown', desc: 'Win a showdown while your authority is low.', check: ({ meta }) => !!meta.flagsEver.lowauth_victory },
  { id: 'three_objectives', title: 'A Patient Hand', desc: 'Finish three different secret goals.', check: ({ meta }) => Object.keys(meta.objectivesDone).length >= 3 },
  { id: 'endings3', title: 'Many Roads', desc: 'Reach three different endings.', check: ({ meta }) => Object.keys(meta.endings).length >= 3 },
  { id: 'supreme', title: 'The Royal Seal', desc: 'Rule the kingdom.', check: ({ meta }) => !!meta.endings.supreme },
  { id: 'peaceful', title: 'Leave While They Say Please', desc: 'Step down on your own terms.', check: ({ meta }) => !!meta.endings.negotiated_exit },
  { id: 'unmasked', title: 'Behind the Veil', desc: 'Find out who the Veiled Patron is.', check: ({ meta }) => !!meta.secrets.veiled_hand_identity },
];
