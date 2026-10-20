// Court storylines: the arrival, Varen's bid for the guard (a five-step chain), General Kovane, Chamberlain Quill.
// Event schema is documented in README.md ("Adding events"). Meter keys: auth / rep / loy / res.

export default [
  {
    id: 'arrival', title: "THE STEWARD'S WELCOME", theme: 'ambition', char: 'quill', story: true, urgent: true, once: true, when: { turn: [1, 1] },
    text: "Welcome to court, {t}. You have a letter and no friends. I can seat you near the king's table, where everyone can see you. Or by the door, where the cold draughts and the honest people sit.",
    left: { label: 'Take the seat by the door', style: 'restraint', fx: { m: { rep: -2, loy: 3 }, flags: ['humble_start'], chars: { quill: { trust: 8 } } }, result: 'Quill nods, as if you passed a test you did not know about.' },
    right: { label: 'Take the seat near the throne', style: 'charm', fx: { m: { rep: 6, auth: 3 }, flags: ['bold_start'], chars: { varen: { resent: 4, suspicion: 4 }, dorne: { resent: 5 }, quill: { trust: -3 } } }, result: 'Heads turn. Someone smiles. Someone else stops smiling.' },
    lesson: { law: 1, left: 'A quiet seat costs you attention. But it keeps you from being the first thing a nervous court looks at.', right: 'A seat near the throne shows you are bold. It also tells people who waited years for that seat that you are in their way.' },
  },

  // ---- Chain A: the guard, the chapel, the coup ----
  {
    id: 'varen_guard', title: 'THE AMBITIOUS ADVISOR', theme: 'ambition', char: 'varen', others: ['kovane'], story: true, once: true, major: true, weight: 3,
    when: { turn: [5, null], rank: [1, null] },
    text: '{t}, the general is getting more popular with the soldiers than is safe. Give me command of the royal guard. Then I will make sure he never becomes a danger to the throne. Or to you.',
    left: {
      label: 'Say no', style: 'restraint', memo: 'You said no when he asked for the guard.',
      fx: { m: { auth: 3, loy: -3 }, chars: { varen: { trust: -12, resent: 12 }, kovane: { trust: 8 } }, flags: ['varen_denied'] },
      result: 'Varen smiles and bows a little too low.',
    },
    right: {
      label: 'Give him the guard', style: 'pragmatism', memo: 'You gave him command of the royal guard.',
      fx: { m: { auth: 6, res: -2 }, chars: { varen: { trust: 10, ambition: 15 }, kovane: { trust: -12, resent: 10 } }, flags: ['varen_guard'], queue: [{ id: 'rumour_meeting', delay: 3 }] },
      branches: [{ when: { flags: ['varen_schemer'] }, fx: { rel: [['varen', 'kovane', { alliance: true, benefit: 40, trust: 20 }]], flags: ['pact_formed'] } }],
      result: 'Varen kneels to kiss your ring. Kovane leaves the room without being sent away.',
    },
    lesson: { law: 2, left: 'Saying no keeps the guard in your hands. But a helpful friend turns into a quiet critic. The cost of a no comes slowly.', right: 'Someone who asks for power "to protect you" has already thought about how to use it. You win his thanks today. You lose some of your own choices.' },
  },
  {
    id: 'rumour_meeting', title: 'A CANDLE AT MIDNIGHT', theme: 'secrets', char: 'ysolde', others: ['varen'], story: true, once: true,
    when: { flags: ['varen_guard'] },
    text: "A candle burned late in the chapel last night. Two men met there. One was Lord Varen. The other wore a soldier's cloak. I saw it. I sell what I see. What do you want me to do with this gossip?",
    left: { label: 'Ignore the gossip', style: 'restraint', fx: { flags: ['rumour_ignored'], chars: { ysolde: { trust: -3 } }, queue: [{ id: 'conspiracy_ripens', delay: 4 }] }, result: 'Ysolde shrugs. The gossip goes to look for another buyer.' },
    right: {
      label: 'Have them watched', style: 'guile', memo: 'You had Varen watched.',
      fx: { m: { res: -5 }, flags: ['varen_watched'] },
      branches: [
        { when: { flags: ['varen_schemer'] }, fx: { reveal: ['varen_kovane_pact'], flags: ['evidence_varen_kovane_pact'], queue: [{ id: 'varen_confront', delay: 1 }] }, result: 'Your watcher comes back with a name, a seal and a promise made in the chapel. Varen and Kovane have joined hands.' },
        { fx: { reveal: ['kovane_pay_petition'], flags: ['varen_cleared'], queue: [{ id: 'watchers_found', delay: 4 }] }, result: "Your watcher says it was about soldiers' pay. Varen offered to carry their request. Nothing wrong at all." },
      ],
      result: 'You pay for eyes in the dark.',
    },
    lesson: { law: 14, left: 'Ignoring gossip saves the cost of checking it. If it was true, the plot keeps growing in the dark.', right: 'Watching someone gives you facts, not proof of guilt. You may find a guilty friend or clear an innocent one. If they catch you watching, you lose trust either way.' },
  },
  {
    id: 'varen_confront', title: 'THE PROOF', theme: 'rivalry', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed', 'evidence_varen_kovane_pact'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: "You have the proof. Varen and the General stand in your room. Varen is already planning his excuse. 'It is a mistake, {t},' he says. Kovane stares at the floor.",
    left: {
      label: 'Name them in front of the court', style: 'candour', memo: 'You named Varen and Kovane in front of the court.',
      fx: { m: { loy: -3 } },
      branches: [
        { when: { meter: { auth: [null, 35], loy: [null, 49] } }, fx: { m: { auth: -8, rep: -4 }, chars: { varen: { trust: 10 } }, flags: ['varen_survives'] }, result: 'You have little power and few friends. Your charge dies in the room. Varen forgives you, loudly.' },
        { when: { meter: { auth: [null, 35] } }, fx: { expose: ['varen_kovane_pact'], flags: ['lowauth_victory'], m: { loy: 5 } }, result: 'You have little power, but many friends. The guards look at the proof, then at you, and take Varen away.' },
        { fx: { expose: ['varen_kovane_pact'] }, result: 'The court gasps. Varen is led out with great dignity and no friends.' },
      ],
    },
    right: {
      label: 'Win the general over in private', style: 'guile', memo: 'You turned Kovane against Varen in private.',
      fx: { m: { auth: 4, loy: 4 }, rel: [['varen', 'kovane', { alliance: false, trust: -30 }]], chars: { kovane: { trust: 25, obligation: 20, resent: -10 }, varen: { resent: 25, fear: 10 } }, flags: ['conspiracy_redirected'], clear: ['varen_guard'], stat: { manipulations: 1 } },
      result: 'Kovane agrees to serve you and forget the chapel. Varen now holds a guard that no longer obeys him.',
    },
    lesson: { law: 42, left: 'Telling the court removes the leader and shames his follower. You need proof and enough power to act. Without them it backfires.', right: 'Winning over the follower leaves the leader alone, with no show. But a man who knows you know is still dangerous.' },
  },
  {
    id: 'conspiracy_ripens', title: 'A NEW RIBBON', theme: 'secrets', char: 'quill', others: ['varen', 'kovane'], story: true, once: true,
    when: { flags: ['pact_formed', 'rumour_ignored'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: "Soldiers on the palace walls wear a new ribbon. Nobody will say what it means. The guard's officers will not look me in the eye. And Lord Varen is very cheerful these days.",
    left: {
      label: "Change the guard's leaders", style: 'force', memo: "You changed the guard's leaders in a hurry.",
      fx: { m: { auth: 3, res: -3 }, chars: { kovane: { resent: 15, trust: -10 }, varen: { resent: 10 } }, flags: ['coup_weakened'], queue: [{ id: 'the_coup', delay: 4 }] },
      result: 'Half the leaders are gone by morning. The other half watch you closely.',
    },
    right: {
      label: 'Honour Kovane in public', style: 'charm', memo: 'You honoured Kovane in public.',
      fx: { m: { rep: 3, res: -5 }, chars: { kovane: { trust: 15 } }, queue: [{ id: 'the_coup', delay: 4 }] },
      branches: [{ when: { flags: ['kovane_steady'] }, fx: { flags: ['coup_weakened'], rel: [['varen', 'kovane', { trust: -25 }]] }, result: 'Kovane blinks. A man who is thanked in public finds it hard to plot in secret. The ribbons quietly disappear.' }],
      result: 'The General takes your medal. He does not take off the ribbon.',
    },
    lesson: { law: 19, left: 'Changing the guard stops a plot. But it also tells the plotters that you know. Do it badly and the plot may start sooner.', right: 'Honour works on a man who feels ignored. It fails on a man who has already picked a side. You need to know which Kovane you have.' },
  },
  {
    id: 'the_coup', title: 'FOR THE GOOD OF THE KINGDOM', theme: 'fear', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'], seen: ['conspiracy_ripens'] },
    text: "Boots echo in the hall. Varen walks in with half the guard behind him and Kovane at his side. 'For the good of the kingdom, {t},' he says gently, 'you must step aside.'",
    left: {
      label: 'Order the guard to stand with you', style: 'force',
      branches: [
        { when: { any: [{ flags: ['coup_weakened'] }, { meter: { loy: [55, null], auth: [40, null] } }] }, fx: { chars: { varen: { status: 'exiled' }, kovane: { status: 'imprisoned' } }, m: { rep: 8, auth: 8 }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } }, result: 'The guard hesitates. That is enough. Varen is taken away in chains. Kovane hands over his sword without a word.' },
        { fx: { end: 'overthrown' }, result: 'Nobody moves. The new ribbons are bright on their sleeves.' },
      ],
    },
    right: {
      label: 'Offer Varen a seat on the ruling council', style: 'pragmatism',
      branches: [
        { when: { any: [{ meter: { rep: [50, null] } }, { meter: { res: [50, null] } }] }, fx: { m: { auth: -15, rep: -4 }, flags: ['varen_council'], chars: { varen: { trust: 15, ambition: 10 } } }, result: 'He accepts a title and the keys to the treasury. You keep your seat. You are no longer sure who really holds it.' },
        { fx: { end: 'exiled_alive' }, result: 'Varen smiles at your offer. Then he names the guards who will take you to the harbour.' },
      ],
    },
    lesson: { law: 22, left: 'You can only win a fight like this if you built loyalty and power long before. If not, it is a coin toss.', right: 'Giving way can save you, if you still have good name or money to trade. It works best when you saw it coming.' },
  },
  {
    id: 'watchers_found', title: 'THE BRASS WHISTLE', theme: 'loyalty', char: 'varen', story: true, once: true,
    when: { flags: ['varen_cleared', 'varen_watched'] },
    text: "Varen holds up a small brass whistle. 'Your watcher dropped this outside the chapel. I was working on the soldiers' pay, {t}. If you had doubts, you could simply have asked me.'",
    left: { label: 'Say sorry and explain', style: 'candour', memo: 'You told him you had him watched.', fx: { m: { rep: -2, loy: 3 }, chars: { varen: { trust: 10, suspicion: -5 } } }, result: 'Varen accepts your apology. He is so serious about it that you feel you owe him another.' },
    right: { label: 'Deny everything', style: 'guile', memo: 'You lied about the watcher.', fx: { m: { rep: -3 }, chars: { varen: { trust: -15, resent: 15, suspicion: 20 } }, stat: { manipulations: 1 } }, result: 'Varen looks at the whistle, then at you. His polite face does not change at all.' },
    lesson: { law: 12, left: 'Owning up to a small fault can calm a bigger worry. You trade a little pride for trust.', right: 'A flat denial works only until the first piece of proof. Then it costs more than the first mistake.' },
  },

  // ---- General Kovane ----
  {
    id: 'kovane_parade', title: 'THE WINTER PARADE', theme: 'loyalty', char: 'kovane', once: true, weight: 1.5, when: { turn: [4, null] },
    text: "The winter soldiers have not had a parade in three years. 'The men need to see that the crown cares, {t},' says Kovane, a little too fast. 'So does the city.' It would cost a month of pay.",
    left: { label: 'Not this year', style: 'restraint', fx: { m: { loy: -4 }, chars: { kovane: { trust: -8, resent: 5 } } }, result: 'Kovane salutes sharply. His face tells you what he thinks of sharp salutes.' },
    right: { label: 'Hold the parade', style: 'charm', fx: { m: { res: -10, rep: 6, loy: 6 }, chars: { kovane: { trust: 14 } } }, result: 'Flags, drums and a thousand marching boots. The city loves it. Kovane looks ten years younger.' },
    lesson: { law: 37, left: 'Saving the money keeps the treasury healthy. It also tells the army how much it matters.', right: 'A big show costs money and soon fades. But it turns private loyalty into a public story that people repeat for you.' },
  },
  {
    id: 'border_raid', title: 'SMOKE ON THE BORDER', theme: 'timing', char: 'kovane', others: ['varen'], once: true, when: { turn: [10, null], rank: [1, null] },
    text: "Raiders have burned two villages on the border. Kovane offers to lead the answer himself. 'A week to ride out, a week to ride back, {t}.' Lord Varen watches the General's face like a man counting.",
    left: { label: 'Send Kovane', style: 'force', fx: { m: { rep: 6, auth: -3 }, chars: { kovane: { trust: 8 } }, flags: ['kovane_away'], queue: [{ id: 'kovane_returns', delay: 4 }] }, result: 'Kovane rides out at dawn. The city feels both safer and strangely empty.' },
    right: { label: 'Send another officer and keep Kovane close', style: 'restraint', fx: { m: { rep: -4 }, chars: { kovane: { resent: 10, trust: -6 } } }, result: 'The captain you send is able but not loved. Kovane takes it personally.' },
    lesson: { law: 16, left: 'Sending away a man who could rival you makes him famous far from home. It also leaves your guard thin. Being away changes who is missed.', right: 'Keeping your general close keeps him where you can see him. It also shows him how little you trust him.' },
  },
  {
    id: 'kovane_returns', title: 'THE HERO COMES HOME', theme: 'reputation', char: 'kovane', once: true, when: { flags: ['kovane_away'] },
    text: 'Kovane rides in under flags the city made for him. The crowd chants his name. He looks at you, then at the crowd. He waits to see what you will do.',
    left: { label: 'Honour him in public', style: 'charm', memo: 'You honoured Kovane for his victory on the border.', fx: { m: { loy: 6, rep: 3, auth: -2 }, chars: { kovane: { trust: 15 } }, clear: ['kovane_away'], flags: ['kovane_hero'] }, result: 'You hang a gold chain on him. The soldiers cheer, because it was their win too.' },
    right: { label: 'Keep the welcome cool and ask for the accounts', style: 'force', memo: 'You gave Kovane a cool welcome.', fx: { m: { auth: 4, rep: -4 }, chars: { kovane: { resent: 15, trust: -10 } }, clear: ['kovane_away'] }, result: 'The accounts are in order. The crowd noticed how you treated him, not the accounts.' },
    lesson: { law: 1, left: 'Sharing the glory costs you some shine. It makes a loyal man famous, and he stays yours.', right: 'Reminding a hero who is in charge protects your place. It also shows him how much he may be loved.' },
  },
  {
    id: 'kovane_doubt', title: "THE GENERAL'S QUESTION", theme: 'loyalty', char: 'kovane', others: ['varen'], story: true, once: true, weight: 3,
    when: { char: { kovane: { resent: [25, null], trust: [null, 60] } }, notFlags: ['kovane_entitled'] },
    text: "'Tell me the truth,' says Kovane. His hand rests on his sword, not as a threat, but as a man holds a rail. 'Am I being replaced? Varen's clerks are in my barracks. They count my men like sacks of grain.'",
    left: { label: 'Promise nothing', style: 'candour', memo: 'You would not promise Kovane his command.', fx: { m: { auth: 2 }, chars: { kovane: { resent: 10, trust: -10 } } }, result: 'Kovane nods slowly. He heard the truth. He does not like it.' },
    right: { label: 'Promise he will always lead the army', style: 'charm', memo: 'You promised Kovane he would always lead the army.', fx: { m: { loy: 5, auth: -4 }, chars: { kovane: { trust: 25, resent: -15 } }, flags: ['kovane_entitled'] }, result: 'He kneels, to his own surprise. You bought a very loyal general. You also gave away a lot of choice.' },
    lesson: { law: 19, left: 'A worried man hears silence as bad news. Being honest is polite, but it is not always safe.', right: 'A promise made to calm one man ties your hands later. Loyalty bought with a promise makes you less free.' },
  },

  // ---- Chamberlain Quill ----
  {
    id: 'audience_list', title: 'WHO SEES THE KING', theme: 'negotiation', char: 'quill', others: ['varen', 'dorne'], once: true, when: { turn: [6, null] },
    text: "Everyone wants the king's ear, and I decide whose name comes first. Lord Varen's people and Lady Dorne's people both expect favour. I can keep the list fair, {t}. Or I can tilt it your way.",
    left: { label: 'Keep the list fair', style: 'candour', fx: { m: { rep: 3, loy: 3 }, chars: { quill: { trust: 5 } } }, result: 'Quill puts the list in order and looks happy about it.' },
    right: { label: 'Put your friends first', style: 'guile', memo: 'You had Quill tilt the list.', fx: { m: { auth: 6, loy: 4 }, chars: { varen: { resent: 8 }, dorne: { resent: 8 }, quill: { obligation: 15 } }, flags: ['list_rigged'], stat: { manipulations: 1 } }, result: 'Your people see the king. The others wait. Nobody says anything. Everyone notices.' },
    lesson: { law: 31, left: 'Fair rules win trust slowly. They give nobody a reason to be angry with you.', right: 'Choosing who gets in is quiet power. But the people left in the hall can count.' },
  },
  {
    id: 'quill_leak', title: 'THE BACK DOOR', theme: 'secrets', char: 'quill', others: ['ysolde'], story: true, once: true,
    when: { secret: ['quill_leaks'] },
    text: "You find Quill at the back door of Ysolde's tea house, hat pulled low. He does not deny it. 'Everyone sells something, {t}. I sell the king's daily plans. I never sell his secrets. You know the difference.'",
    left: {
      label: 'Feed him false news', style: 'guile', memo: "You used Quill's leak to spread false news.",
      fx: { m: { auth: 3 }, flags: ['false_news'], stat: { manipulations: 1 } },
      branches: [{ chance: 0.4, fx: { m: { rep: -3 }, chars: { ysolde: { trust: -10 }, quill: { resent: 10 } } }, result: 'Ysolde sells the false news back to you, with a wink. The leak runs both ways.' }],
      result: 'Your rivals chase a rumour you made up and waste a month.',
    },
    right: { label: 'Send him away', style: 'force', memo: "You sent Quill away for selling the king's plans.", fx: { m: { auth: 3, loy: -4, res: -3 }, chars: { quill: { status: 'exiled', resent: 20 } } }, result: 'Quill leaves quietly. Within a week the court forgets how to open its own doors.' },
    lesson: { law: 14, left: 'A leak is useful once you know where it goes. It works until the other side learns that you know.', right: 'Sending the spy away stops the leak. It also loses the one man who knew how the court really worked.' },
  },
];
