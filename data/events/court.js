// Court storylines: the arrival, Varen's bid for the guard (a five-step chain), General Kovane, Chamberlain Quill.
// Event schema is documented in README.md ("Adding events"). Meter keys: auth / rep / loy / res.

export default [
  {
    id: 'arrival', title: "THE CHAMBERLAIN'S WELCOME", theme: 'ambition', char: 'quill', story: true, urgent: true, once: true, when: { turn: [1, 1] },
    text: "Welcome to court, {t}. You carry a letter of introduction and nobody's attention. I can seat you near the king's table, where everyone will see you. Or by the door, where the draughts and the honest people sit.",
    left: { label: 'Take the seat by the door', style: 'restraint', fx: { m: { rep: -2, loy: 3 }, flags: ['humble_start'], chars: { quill: { trust: 8 } } }, result: 'Quill nods, as if you had passed a test you did not know was set.' },
    right: { label: 'Take the seat near the throne', style: 'charm', fx: { m: { rep: 6, auth: 3 }, flags: ['bold_start'], chars: { varen: { resent: 4, suspicion: 4 }, dorne: { resent: 5 }, quill: { trust: -3 } } }, result: 'Heads turn. Someone smiles. Someone else stops smiling.' },
    lesson: { law: 1, left: 'A modest seat gives up visibility, but it keeps you from being the first thing a nervous court measures itself against.', right: 'Sitting beside the throne signals confidence, and tells everyone who waited years for that chair that you are competition.' },
  },

  // ---- Chain A: the guard, the chapel, the coup ----
  {
    id: 'varen_guard', title: 'THE AMBITIOUS ADVISOR', theme: 'ambition', char: 'varen', others: ['kovane'], story: true, once: true, major: true, weight: 3,
    when: { turn: [5, null], rank: [1, null] },
    text: "{t}, the general grows more popular with the soldiers than is wise. Put the royal guard under my command, and I will make sure he never threatens the throne. Or you.",
    left: {
      label: 'Refuse his request', style: 'restraint', memo: 'You refused him command of the guard.',
      fx: { m: { auth: 3, loy: -3 }, chars: { varen: { trust: -12, resent: 12 }, kovane: { trust: 8 } }, flags: ['varen_denied'] },
      result: 'Varen smiles, and bows a fraction too low.',
    },
    right: {
      label: 'Give him command of the guard', style: 'pragmatism', memo: 'You gave him command of the royal guard.',
      fx: { m: { auth: 6, res: -2 }, chars: { varen: { trust: 10, ambition: 15 }, kovane: { trust: -12, resent: 10 } }, flags: ['varen_guard'], queue: [{ id: 'rumour_meeting', delay: 3 }] },
      branches: [{ when: { flags: ['varen_schemer'] }, fx: { rel: [['varen', 'kovane', { alliance: true, benefit: 40, trust: 20 }]], flags: ['pact_formed'] } }],
      result: 'Varen kneels to kiss your ring. Kovane leaves the room without being dismissed.',
    },
    lesson: { law: 2, left: 'Refusing keeps control of the guard, and turns a helpful friend into a quiet critic. The cost of saying no arrives slowly.', right: 'Anyone who asks for power "to protect you" has already pictured how to use it. Handing it over buys loyalty today and trades away your options.' },
  },
  {
    id: 'rumour_meeting', title: 'A CANDLE AT MIDNIGHT', theme: 'secrets', char: 'ysolde', others: ['varen'], story: true, once: true,
    when: { flags: ['varen_guard'] },
    text: "A chapel candle burned late last night. Two men met beneath it: Lord Varen, and one in a soldier's cloak. My eyes saw it. My mouth is for sale. What would you like done with the gossip?",
    left: { label: 'Ignore the gossip', style: 'restraint', fx: { flags: ['rumour_ignored'], chars: { ysolde: { trust: -3 } }, queue: [{ id: 'conspiracy_ripens', delay: 4 }] }, result: 'Ysolde shrugs, and the rumour goes looking for another buyer.' },
    right: {
      label: 'Have them watched', style: 'guile', memo: 'You had Varen watched.',
      fx: { m: { res: -5 }, flags: ['varen_watched'] },
      branches: [
        { when: { flags: ['varen_schemer'] }, fx: { reveal: ['varen_kovane_pact'], flags: ['evidence_varen_kovane_pact'], queue: [{ id: 'varen_confront', delay: 1 }] }, result: 'Your watcher returns with a name, a seal and a promise sworn in the chapel. Varen and Kovane have joined hands.' },
        { fx: { reveal: ['kovane_pay_petition'], flags: ['varen_cleared'], queue: [{ id: 'watchers_found', delay: 4 }] }, result: 'Your watcher reports a petition about unpaid wages and a promise to carry it. Nothing treasonous at all.' },
      ],
      result: 'You pay for eyes in the dark.',
    },
    lesson: { law: 14, left: 'Ignoring a rumour spares the cost of checking it. If it was true, the plot keeps growing in the dark.', right: 'Watching someone buys facts, not guilt. What you learn can convict a friend or clear a suspect, and being discovered watching costs trust either way.' },
  },
  {
    id: 'varen_confront', title: 'THE PROOF', theme: 'rivalry', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed', 'evidence_varen_kovane_pact'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: "You have the proof. Varen and the General stand in your study, Varen already composing his innocence. 'A misunderstanding, {t},' he begins. Kovane stares at the floor.",
    left: {
      label: 'Denounce them before the court', style: 'candour', memo: 'You denounced Varen and Kovane to the court.',
      fx: { m: { loy: -3 } },
      branches: [
        { when: { meter: { auth: [null, 35], loy: [null, 49] } }, fx: { m: { auth: -8, rep: -4 }, chars: { varen: { trust: 10 } }, flags: ['varen_survives'] }, result: 'Without the authority to enforce it, your accusation dies in the room. Varen forgives you, loudly.' },
        { when: { meter: { auth: [null, 35] } }, fx: { expose: ['varen_kovane_pact'], flags: ['lowauth_victory'], m: { loy: 5 } }, result: 'You have little authority, but many friends. The guard looks at the proof, then at you, and marches Varen out.' },
        { fx: { expose: ['varen_kovane_pact'] }, result: 'The court gasps. Varen is escorted out with great dignity and no friends.' },
      ],
    },
    right: {
      label: 'Turn the general quietly', style: 'guile', memo: 'You turned Kovane against Varen in private.',
      fx: { m: { auth: 4, loy: 4 }, rel: [['varen', 'kovane', { alliance: false, trust: -30 }]], chars: { kovane: { trust: 25, obligation: 20, resent: -10 }, varen: { resent: 25, fear: 10 } }, flags: ['conspiracy_redirected'], clear: ['varen_guard'], stat: { manipulations: 1 } },
      result: 'Kovane agrees to serve you, and to forget the chapel. Varen finds himself holding a guard that no longer answers to him.',
    },
    lesson: { law: 42, left: 'Exposure removes the leader and shames his follower. It needs evidence and enough power to enforce it, or it backfires.', right: 'Peeling away the follower isolates the leader without a spectacle. But a cornered man who knows you know remains dangerous.' },
  },
  {
    id: 'conspiracy_ripens', title: 'A NEW RIBBON', theme: 'secrets', char: 'quill', others: ['varen', 'kovane'], story: true, once: true,
    when: { flags: ['pact_formed', 'rumour_ignored'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: "Soldiers on the palace walls are wearing a new ribbon, and nobody will say what it means. None of the guard's officers will meet my eye. Lord Varen, meanwhile, seems unusually cheerful.",
    left: {
      label: "Reshuffle the guard's commanders", style: 'force', memo: 'You reshuffled the guard in a hurry.',
      fx: { m: { auth: 3, res: -3 }, chars: { kovane: { resent: 15, trust: -10 }, varen: { resent: 10 } }, flags: ['coup_weakened'], queue: [{ id: 'the_coup', delay: 4 }] },
      result: 'Half the commanders are replaced by dawn. The other half watch you carefully.',
    },
    right: {
      label: 'Honour Kovane publicly', style: 'charm', memo: 'You honoured Kovane in public.',
      fx: { m: { rep: 3, res: -5 }, chars: { kovane: { trust: 15 } }, queue: [{ id: 'the_coup', delay: 4 }] },
      branches: [{ when: { flags: ['kovane_steady'] }, fx: { flags: ['coup_weakened'], rel: [['varen', 'kovane', { trust: -25 }]] }, result: 'Kovane blinks. A man who is thanked in public finds it hard to plot in private. The ribbons are quietly removed.' }],
      result: 'The General accepts your medal. He does not take off the ribbon.',
    },
    lesson: { law: 19, left: 'Shaking up the guard disrupts a plot, and also tells the plotters they are suspected. Timing it badly can accelerate what you are trying to stop.', right: 'Honour works on a man who feels overlooked, and fails on one who has already chosen a side. It pays to know which Kovane you have.' },
  },
  {
    id: 'the_coup', title: 'FOR THE STABILITY OF THE REALM', theme: 'fear', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'], seen: ['conspiracy_ripens'] },
    text: "Boots in the corridor. Varen enters with half the guard behind him and Kovane at his shoulder. 'For the stability of the realm, {t},' he says gently, 'you will step aside.'",
    left: {
      label: 'Order the guard to stand with you', style: 'force',
      branches: [
        { when: { any: [{ flags: ['coup_weakened'] }, { meter: { loy: [55, null], auth: [40, null] } }] }, fx: { chars: { varen: { status: 'exiled' }, kovane: { status: 'imprisoned' } }, m: { rep: 8, auth: 8 }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } }, result: 'The guard hesitates. The hesitation is enough. Varen is taken in irons, and Kovane gives up his sword without a word.' },
        { fx: { end: 'overthrown' }, result: 'Nobody moves. The new ribbons are bright against their sleeves.' },
      ],
    },
    right: {
      label: 'Offer Varen a seat on the regency council', style: 'pragmatism',
      branches: [
        { when: { any: [{ meter: { rep: [50, null] } }, { meter: { res: [50, null] } }] }, fx: { m: { auth: -15, rep: -4 }, flags: ['varen_council'], chars: { varen: { trust: 15, ambition: 10 } } }, result: 'He accepts a title and the keys to the treasury room. You keep your seat, and lose some sense of who is holding it.' },
        { fx: { end: 'exiled_alive' }, result: 'Varen smiles at the offer. Then he names the escort that will take you to the harbour.' },
      ],
    },
    lesson: { law: 22, left: 'Fighting a coup only works if loyalty and authority were built long before the crisis. A bluff at this point is a coin toss.', right: 'Yielding something can buy survival, if you still have reputation or resources to trade. It works best when it is not a surprise to you.' },
  },
  {
    id: 'watchers_found', title: 'THE BRASS WHISTLE', theme: 'loyalty', char: 'varen', story: true, once: true,
    when: { flags: ['varen_cleared', 'varen_watched'] },
    text: "Varen holds up a small brass whistle. 'Your watcher dropped this outside the chapel. I was arranging the soldiers' pay, {t}. If you had doubts, you might simply have asked me.'",
    left: { label: 'Apologise and explain', style: 'candour', memo: 'You admitted you had him watched.', fx: { m: { rep: -2, loy: 3 }, chars: { varen: { trust: 10, suspicion: -5 } } }, result: 'Varen accepts the apology with a gravity that makes you feel, oddly, that you owe him another.' },
    right: { label: 'Deny everything', style: 'guile', memo: 'You lied about the watcher.', fx: { m: { rep: -3 }, chars: { varen: { trust: -15, resent: 15, suspicion: 20 } }, stat: { manipulations: 1 } }, result: 'Varen looks at the whistle, then at you, and the polite expression does not change at all.' },
    lesson: { law: 12, left: 'Admitting a small fault openly can defuse a larger suspicion, and trade a little pride for trust.', right: 'A flat denial is believed only until the first piece of evidence. Then it costs you more than the original mistake.' },
  },

  // ---- General Kovane ----
  {
    id: 'kovane_parade', title: 'THE WINTER PARADE', theme: 'loyalty', char: 'kovane', once: true, weight: 1.5, when: { turn: [4, null] },
    text: "The winter garrison has not seen a parade in three years. 'The men need to see that the crown cares, {t},' Kovane says, too quickly. 'And so does the city.' It would cost a month of pay.",
    left: { label: 'Not this year', style: 'restraint', fx: { m: { loy: -4 }, chars: { kovane: { trust: -8, resent: 5 } } }, result: 'Kovane salutes crisply. His expression makes it clear what he thinks of crisp salutes.' },
    right: { label: 'Hold the parade', style: 'charm', fx: { m: { res: -10, rep: 6, loy: 6 }, chars: { kovane: { trust: 14 } } }, result: 'Banners, drums, a thousand boots in step. The city loves it, and Kovane looks ten years younger.' },
    lesson: { law: 37, left: 'Saving the money keeps the treasury healthy, and tells the army how much it matters.', right: 'Spectacle is expensive and perishable, but it turns private loyalty into a public story that people repeat for you.' },
  },
  {
    id: 'border_raid', title: 'SMOKE ON THE BORDER', theme: 'timing', char: 'kovane', others: ['varen'], once: true, when: { turn: [10, null], rank: [1, null] },
    text: "Raiders have burned two border villages. Kovane volunteers to lead the response himself. 'A week's ride out, a week's ride back, {t}.' Lord Varen watches the General's face with the interest of a man counting.",
    left: { label: 'Send Kovane', style: 'force', fx: { m: { rep: 6, auth: -3 }, chars: { kovane: { trust: 8 } }, flags: ['kovane_away'], queue: [{ id: 'kovane_returns', delay: 4 }] }, result: 'Kovane rides out at dawn. The city feels both safer and strangely lighter.' },
    right: { label: 'Send a lesser officer, keep Kovane close', style: 'restraint', fx: { m: { rep: -4 }, chars: { kovane: { resent: 10, trust: -6 } } }, result: 'The captain you send is competent and unloved. Kovane takes it personally.' },
    lesson: { law: 16, left: 'Sending a rival-in-waiting away raises his standing abroad and thins your guard at home. Absence changes who is missed.', right: 'Keeping your general close keeps him in view, and tells him exactly how much you trust him.' },
  },
  {
    id: 'kovane_returns', title: 'THE HERO RETURNS', theme: 'reputation', char: 'kovane', once: true, when: { flags: ['kovane_away'] },
    text: "Kovane rides in under banners the city made for him. The crowd chants his name. He looks at you, then at the crowd, and waits to see what you will make of it.",
    left: { label: 'Honour him publicly', style: 'charm', memo: 'You honoured Kovane for the border victory.', fx: { m: { loy: 6, rep: 3, auth: -2 }, chars: { kovane: { trust: 15 } }, clear: ['kovane_away'], flags: ['kovane_hero'] }, result: 'You hang a chain of office on him. Soldiers cheer, because it was also their victory.' },
    right: { label: 'Cool the welcome and call for accounts', style: 'force', memo: 'You cooled Kovane\'s hero welcome.', fx: { m: { auth: 4, rep: -4 }, chars: { kovane: { resent: 15, trust: -10 } }, clear: ['kovane_away'] }, result: 'The accounts are in order. The crowd noticed the order of things, and not the accounts.' },
    lesson: { law: 1, left: 'Sharing the glory costs you a little shine and makes a loyal servant visible, and visibly yours.', right: 'Reminding a hero who the master is protects your position, and teaches him how much he is allowed to be admired.' },
  },
  {
    id: 'kovane_doubt', title: "THE GENERAL'S QUESTION", theme: 'loyalty', char: 'kovane', others: ['varen'], story: true, once: true, weight: 3,
    when: { char: { kovane: { resent: [25, null], trust: [null, 60] } }, notFlags: ['kovane_entitled'] },
    text: "'Be honest with me,' says Kovane, hand on his sword-hilt not threateningly, but as a man holds a rail. 'Am I being replaced? Varen's clerks are in my barracks. They count my men like sacks of grain.'",
    left: { label: 'Promise nothing', style: 'candour', memo: 'You refused to promise Kovane his command.', fx: { m: { auth: 2 }, chars: { kovane: { resent: 10, trust: -10 } } }, result: 'Kovane nods, slowly. He has been told the truth, and does not enjoy it.' },
    right: { label: 'Swear he will always command the army', style: 'charm', memo: 'You swore Kovane would always command the army.', fx: { m: { loy: 5, auth: -4 }, chars: { kovane: { trust: 25, resent: -15 } }, flags: ['kovane_entitled'] }, result: 'He kneels, much to his own surprise. You have bought a very loyal general, and given away a very large option.' },
    lesson: { law: 19, left: 'An insecure man hears silence as a verdict. Honesty is respectful, but not always safe.', right: 'A promise made to calm one person becomes a constraint on every choice that follows. Loyalty bought with certainty makes you less flexible.' },
  },

  // ---- Chamberlain Quill ----
  {
    id: 'audience_list', title: 'WHO SEES THE KING', theme: 'negotiation', char: 'quill', others: ['varen', 'dorne'], once: true, when: { turn: [6, null] },
    text: "Every petitioner wants the king's ear, and I decide whose name goes first. Lord Varen's party and Lady Dorne's both expect favour. I can keep the list neutral, {t}, or I can make it flow in your direction.",
    left: { label: 'Keep the list neutral', style: 'candour', fx: { m: { rep: 3, loy: 3 }, chars: { quill: { trust: 5 } } }, result: 'Quill alphabetises the list with visible pleasure.' },
    right: { label: 'Put your allies first', style: 'guile', memo: 'You had Quill tilt the audience list.', fx: { m: { auth: 6, loy: 4 }, chars: { varen: { resent: 8 }, dorne: { resent: 8 }, quill: { obligation: 15 } }, flags: ['list_rigged'], stat: { manipulations: 1 } }, result: 'Your people get the king; others get a polite wait. Nobody says anything. Everyone notices.' },
    lesson: { law: 31, left: 'Neutral rules earn trust slowly and give nobody a reason to resent you.', right: 'Controlling who gets in is a quiet form of power, but the people left in the corridor do the arithmetic.' },
  },
  {
    id: 'quill_leak', title: 'THE BACK DOOR', theme: 'secrets', char: 'quill', others: ['ysolde'], story: true, once: true,
    when: { secret: ['quill_leaks'] },
    text: "You find Quill at the back door of Ysolde's tea-house, hat pulled low. He does not deny it. 'Everyone sells something, {t}. I sell the king's schedule. I have never sold his secrets, and you know the difference.'",
    left: {
      label: 'Feed him false news', style: 'guile', memo: 'You used Quill\'s leak to plant false news.',
      fx: { m: { auth: 3 }, flags: ['false_news'], stat: { manipulations: 1 } },
      branches: [{ chance: 0.4, fx: { m: { rep: -3 }, chars: { ysolde: { trust: -10 }, quill: { resent: 10 } } }, result: 'Ysolde sells the false news back to you, with a wink. The leak runs both ways.' }],
      result: 'Your rivals act on a rumour you invented, and waste a month doing it.',
    },
    right: { label: 'Dismiss him', style: 'force', memo: 'You dismissed Quill for selling the schedule.', fx: { m: { auth: 3, loy: -4, res: -3 }, chars: { quill: { status: 'exiled', resent: 20 } } }, result: 'Quill leaves quietly. Within a week the court has forgotten how to open its own doors.' },
    lesson: { law: 14, left: 'A leak is an asset once you know where it goes. It works until the other end of the pipe realises you know too.', right: 'Removing the spy ends the leak and loses the one man who understood how the court really ran.' },
  },
];
