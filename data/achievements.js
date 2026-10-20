// Achievements are checked when a reign ends. `check` receives { meta, state, ending }.
export const TRACKED_FLAGS = ['conspiracy_exposed', 'lowauth_victory'];

export const ACHIEVEMENTS = [
  { id: 'clean_handoff', title: 'Clean Handoff', desc: 'Finish a full career with no design debt.', check: ({ state }) => state.turn > 40 && (state.stats.debt || 0) <= 0 },
  { id: 'craft_first', title: 'Craft Over Clout', desc: 'Earn six craft points in one career.', check: ({ state }) => (state.stats.craft || 0) >= 6 },
  { id: 'debt_bill', title: 'The Bill Came Due', desc: 'Let design debt reach ten.', check: ({ state }) => (state.stats.debt || 0) >= 10 },
  { id: 'first_reign', title: 'First Crit Survived', desc: 'Finish your first career.', check: () => true },
  { id: 'survive25', title: 'Past the Probation Pixel', desc: 'Last 25 weeks.', check: ({ state }) => state.turn - 1 >= 25 },
  { id: 'five_agendas', title: 'Layers Behind Layers', desc: 'Learn five hidden goals.', check: ({ meta }) => Object.keys(meta.agendas).length >= 5 },
  { id: 'clean_reign', title: 'Clean Component Library', desc: 'Finish a full career without being betrayed.', check: ({ state }) => state.turn > 40 && (state.stats.betrayals || 0) === 0 },
  { id: 'expose', title: 'Lights On in the Studio', desc: 'Uncover a hidden plan.', check: ({ meta }) => !!meta.flagsEver.conspiracy_exposed },
  { id: 'lowauth', title: 'Pixel Perfect, No Title', desc: 'Win a showdown while your influence is low.', check: ({ meta }) => !!meta.flagsEver.lowauth_victory },
  { id: 'three_objectives', title: 'Slow Burn Roadmap', desc: 'Finish three different hidden goals.', check: ({ meta }) => Object.keys(meta.objectivesDone).length >= 3 },
  { id: 'endings3', title: 'Many Artboards', desc: 'Reach three different endings.', check: ({ meta }) => Object.keys(meta.endings).length >= 3 },
  { id: 'supreme', title: 'Acting Head of Design', desc: 'Become Acting Head of Design.', check: ({ meta }) => !!meta.endings.supreme },
  { id: 'peaceful', title: 'Ship It and Wave Goodbye', desc: 'Step down on your own terms.', check: ({ meta }) => !!meta.endings.negotiated_exit },
  { id: 'unmasked', title: 'Behind the Prototype', desc: 'Find out who the Silent Sponsor is.', check: ({ meta }) => !!meta.secrets.veiled_hand_identity },
];
