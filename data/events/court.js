// Court storylines: the arrival, Varen's bid for the guard (a five-step chain), General Kovane, Chamberlain Quill.
// Event schema is documented in README.md ("Adding events"). Meter keys: auth / rep / loy / res.

export default [
  {
    id: 'arrival', title: 'YOUR FIRST DAY', theme: 'ambition', char: 'quill', story: true, urgent: true, once: true, when: { turn: [1, 1] },
    text: 'Welcome aboard. Your badge works and your laptop is ready. Nobody has told you where to sit, so I will. I can give you a desk on the executive floor, where everyone can see you. Or a quiet desk at the back, where the honest people sit.',
    left: { label: 'Take the quiet desk at the back', style: 'restraint', fx: { m: { rep: -2, loy: 3 }, flags: ['humble_start'], chars: { quill: { trust: 8 } } }, result: 'Quentin nods, as if you passed a test you did not know about.' },
    right: { label: 'Take the desk by the executive floor', style: 'charm', fx: { m: { rep: 6, auth: 3 }, flags: ['bold_start'], chars: { varen: { resent: 4, suspicion: 4 }, dorne: { resent: 5 }, quill: { trust: -3 } } }, result: 'Heads turn. Someone smiles. Someone else stops smiling.' },
    lesson: { law: 1, left: 'A quiet desk costs you attention. But it keeps you from being the first thing a nervous office looks at.', right: 'A desk by the executives shows you are bold. It also tells the people who waited years for that spot that you are in their way.' },
  },

  // ---- Chain A: the guard, the chapel, the coup ----
  {
    id: 'varen_guard', title: 'THE AMBITIOUS RIGHT HAND', theme: 'ambition', char: 'varen', others: ['kovane'], story: true, once: true, major: true, weight: 3,
    when: { turn: [5, null], rank: [1, null] },
    text: "Dana's team is getting more popular than is safe. Put the Delivery team under my control. Then I will make sure she never becomes a danger to your plans. Or to you.",
    left: {
      label: 'Say no', style: 'restraint', memo: 'You said no when he asked for the Delivery team.',
      fx: { m: { auth: 3, loy: -3 }, chars: { varen: { trust: -12, resent: 12 }, kovane: { trust: 8 } }, flags: ['varen_denied'] },
      result: 'Marcus smiles a little too wide.',
    },
    right: {
      label: 'Give him the Delivery team', style: 'pragmatism', memo: 'You gave him control of the Delivery team.',
      fx: { m: { auth: 6, res: -2 }, chars: { varen: { trust: 10, ambition: 15 }, kovane: { trust: -12, resent: 10 } }, flags: ['varen_guard'], queue: [{ id: 'rumour_meeting', delay: 3 }] },
      branches: [{ when: { flags: ['varen_schemer'] }, fx: { rel: [['varen', 'kovane', { alliance: true, benefit: 40, trust: 20 }]], flags: ['pact_formed'] } }],
      result: 'Marcus thanks you warmly. Dana leaves the room without being dismissed.',
    },
    lesson: { law: 2, left: 'Saying no keeps Delivery in your hands. But a helpful friend turns into a quiet critic. The cost of a no comes slowly.', right: 'Someone who asks for power "to protect you" has already thought about how to use it. You win his thanks today. You lose some of your own choices.' },
  },
  {
    id: 'rumour_meeting', title: 'A LIGHT IN ROOM 4', theme: 'secrets', char: 'ysolde', others: ['varen'], story: true, once: true,
    when: { flags: ['varen_guard'] },
    text: 'The lights in meeting room 4 were on until midnight. Two people were inside. One was Marcus. The other wore an Operations badge. The booking was hidden. I notice things like this. What do you want me to do with it?',
    left: { label: 'Ignore it', style: 'restraint', fx: { flags: ['rumour_ignored'], chars: { ysolde: { trust: -3 } }, queue: [{ id: 'conspiracy_ripens', delay: 4 }] }, result: 'Yara shrugs. The gossip goes to look for another buyer.' },
    right: {
      label: 'Check the badge and booking logs', style: 'guile', memo: 'You checked the logs for Marcus.',
      fx: { m: { res: -5 }, flags: ['varen_watched'] },
      branches: [
        { when: { flags: ['varen_schemer'] }, fx: { reveal: ['varen_kovane_pact'], flags: ['evidence_varen_kovane_pact'], queue: [{ id: 'varen_confront', delay: 1 }] }, result: 'The logs show a name, a signed note and a deal made in room 4. Marcus and Dana have joined forces.' },
        { fx: { reveal: ['kovane_pay_petition'], flags: ['varen_cleared'], queue: [{ id: 'watchers_found', delay: 4 }] }, result: 'The logs show a request about overtime pay. Marcus offered to carry it for her. Nothing wrong at all.' },
      ],
      result: 'You pay for a quiet look at the logs.',
    },
    lesson: { law: 14, left: 'Ignoring gossip saves the cost of checking it. If it was true, the plot keeps growing in the dark.', right: 'Checking logs gives you facts, not proof of guilt. You may find a guilty friend or clear an innocent one. If they catch you looking, you lose trust either way.' },
  },
  {
    id: 'varen_confront', title: 'THE PROOF', theme: 'rivalry', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed', 'evidence_varen_kovane_pact'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: "You have the proof. Marcus and Dana stand in your office. Marcus is already planning his excuse. 'It is a mix-up,' he says smoothly. Dana stares at the floor.",
    left: {
      label: 'Name them in the leadership meeting', style: 'candour', memo: 'You named Marcus and Dana in the leadership meeting.',
      fx: { m: { loy: -3 } },
      branches: [
        { when: { meter: { auth: [null, 35], loy: [null, 49] } }, fx: { m: { auth: -8, rep: -4 }, chars: { varen: { trust: 10 } }, flags: ['varen_survives'] }, result: 'You have little influence and few friends. Your charge falls flat. Marcus forgives you, loudly.' },
        { when: { meter: { auth: [null, 35] } }, fx: { expose: ['varen_kovane_pact'], flags: ['lowauth_victory'], m: { loy: 5 } }, result: 'You have little influence, but many friends. The leaders look at the proof, then at you, and back you up. Marcus is escorted out.' },
        { fx: { expose: ['varen_kovane_pact'] }, result: 'The room goes silent. Marcus is walked out with great dignity and no friends.' },
      ],
    },
    right: {
      label: 'Win Dana over in private', style: 'guile', memo: 'You turned Dana against Marcus in private.',
      fx: { m: { auth: 4, loy: 4 }, rel: [['varen', 'kovane', { alliance: false, trust: -30 }]], chars: { kovane: { trust: 25, obligation: 20, resent: -10 }, varen: { resent: 25, fear: 10 } }, flags: ['conspiracy_redirected'], clear: ['varen_guard'], stat: { manipulations: 1 } },
      result: 'Dana agrees to work for you and forget room 4. Marcus now holds a team that no longer obeys him.',
    },
    lesson: { law: 42, left: 'Calling it out in public removes the leader and shames his follower. You need proof and enough power to act. Without them it backfires.', right: 'Winning over the follower leaves the leader alone, with no show. But a person who knows you know is still dangerous.' },
  },
  {
    id: 'conspiracy_ripens', title: 'A NEW TEAM CHANNEL', theme: 'secrets', char: 'quill', others: ['varen', 'kovane'], story: true, once: true,
    when: { flags: ['pact_formed', 'rumour_ignored'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: 'A new chat channel called ops-alpha has appeared. People wear matching hoodies. Nobody will say what it means. The team leads will not look me in the eye. And Marcus is very cheerful these days.',
    left: {
      label: 'Change the team leads', style: 'force', memo: 'You changed the team leads in a hurry.',
      fx: { m: { auth: 3, res: -3 }, chars: { kovane: { resent: 15, trust: -10 }, varen: { resent: 10 } }, flags: ['coup_weakened'], queue: [{ id: 'the_coup', delay: 4 }] },
      result: 'Half the leads are gone by Monday. The other half watch you closely.',
    },
    right: {
      label: 'Praise Dana in public', style: 'charm', memo: 'You praised Dana in public.',
      fx: { m: { rep: 3, res: -5 }, chars: { kovane: { trust: 15 } }, queue: [{ id: 'the_coup', delay: 4 }] },
      branches: [{ when: { flags: ['kovane_steady'] }, fx: { flags: ['coup_weakened'], rel: [['varen', 'kovane', { trust: -25 }]] }, result: 'Dana blinks. A person who is praised in public finds it hard to plot in private. The hoodies quietly disappear.' }],
      result: 'Dana takes the praise. She does not take off the hoodie.',
    },
    lesson: { law: 19, left: 'Changing the leads stops a plot. But it also tells the plotters that you know. Do it badly and the plot may start sooner.', right: 'Praise works on someone who feels ignored. It fails on someone who has already picked a side. You need to know which Dana you have.' },
  },
  {
    id: 'the_coup', title: 'FOR THE GOOD OF THE COMPANY', theme: 'fear', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'], seen: ['conspiracy_ripens'] },
    text: "Marcus walks into your office with Dana and two directors. 'For the good of the company,' he says gently, 'we think you should step aside from this project. The board is ready to vote.'",
    left: {
      label: 'Ask your team to back you', style: 'force',
      branches: [
        { when: { any: [{ flags: ['coup_weakened'] }, { meter: { loy: [55, null], auth: [40, null] } }] }, fx: { chars: { varen: { status: 'exiled' }, kovane: { status: 'imprisoned' } }, m: { rep: 8, auth: 8 }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } }, result: 'Your people speak up. The directors hesitate. That is enough. Marcus is walked out. Dana hands in her badge without a word.' },
        { fx: { end: 'overthrown' }, result: 'Nobody speaks. The new hoodies are bright on their shoulders.' },
      ],
    },
    right: {
      label: 'Offer Marcus a seat on the steering group', style: 'pragmatism',
      branches: [
        { when: { any: [{ meter: { rep: [50, null] } }, { meter: { res: [50, null] } }] }, fx: { m: { auth: -15, rep: -4 }, flags: ['varen_council'], chars: { varen: { trust: 15, ambition: 10 } } }, result: 'He accepts a title and the budget keys. You keep your job. You are no longer sure who really holds it.' },
        { fx: { end: 'exiled_alive' }, result: 'Marcus smiles at your offer. Then he asks security to walk you out.' },
      ],
    },
    lesson: { law: 22, left: 'You can only win a fight like this if you built loyalty and influence long before. If not, it is a coin toss.', right: 'Giving way can save you, if you still have a good name or money to trade. It works best when you saw it coming.' },
  },
  {
    id: 'watchers_found', title: 'THE ACCESS LOG', theme: 'loyalty', char: 'varen', story: true, once: true,
    when: { flags: ['varen_cleared', 'varen_watched'] },
    text: "Marcus holds up a printout. 'IT told me you pulled the door logs for room 4. I was arranging overtime pay for Dana's team. If you had doubts, you could simply have asked me.'",
    left: { label: 'Say sorry and explain', style: 'candour', memo: 'You told him you checked his logs.', fx: { m: { rep: -2, loy: 3 }, chars: { varen: { trust: 10, suspicion: -5 } } }, result: 'Marcus accepts your apology. He is so calm about it that you feel you owe him another.' },
    right: { label: 'Deny everything', style: 'guile', memo: 'You lied about the logs.', fx: { m: { rep: -3 }, chars: { varen: { trust: -15, resent: 15, suspicion: 20 } }, stat: { manipulations: 1 } }, result: 'Marcus looks at the printout, then at you. His polite face does not change at all.' },
    lesson: { law: 12, left: 'Owning up to a small fault can calm a bigger worry. You trade a little pride for trust.', right: 'A flat denial works only until the first piece of proof. Then it costs more than the first mistake.' },
  },

  // ---- General Kovane ----
  {
    id: 'kovane_parade', title: 'THE TEAM OFFSITE', theme: 'loyalty', char: 'kovane', once: true, weight: 1.5, when: { turn: [4, null] },
    text: "The Operations team has not had an offsite in three years. 'They need to see that the company cares,' says Dana, a little too fast. 'So do I.' It would cost a month of the team budget.",
    left: { label: 'Not this year', style: 'restraint', fx: { m: { loy: -4 }, chars: { kovane: { trust: -8, resent: 5 } } }, result: 'Dana nods stiffly. Her face tells you what she thinks of stiff nods.' },
    right: { label: 'Pay for the offsite', style: 'charm', fx: { m: { res: -10, rep: 6, loy: 6 }, chars: { kovane: { trust: 14 } } }, result: 'A day of games, food and pep talks. The team loves it. Dana looks ten years younger.' },
    lesson: { law: 37, left: 'Saving the money keeps the budget healthy. It also tells the team how much it matters.', right: 'A big event costs money and soon fades. But it turns private loyalty into a public story that people repeat for you.' },
  },
  {
    id: 'border_raid', title: 'A BIG CUSTOMER IS LEAVING', theme: 'timing', char: 'kovane', others: ['varen'], once: true, when: { turn: [10, null], rank: [1, null] },
    text: "Our largest customer is about to walk away. Dana offers to fly out and fix it herself. 'A week there, a week to follow up.' Marcus watches her face like someone counting.",
    left: { label: 'Send Dana', style: 'force', fx: { m: { rep: 6, auth: -3 }, chars: { kovane: { trust: 8 } }, flags: ['kovane_away'], queue: [{ id: 'kovane_returns', delay: 4 }] }, result: 'Dana flies out at dawn. The office feels both safer and strangely empty.' },
    right: { label: 'Send another manager and keep Dana close', style: 'restraint', fx: { m: { rep: -4 }, chars: { kovane: { resent: 10, trust: -6 } } }, result: 'The manager you send is able but not respected. Dana takes it personally.' },
    lesson: { law: 16, left: 'Sending away a person who could rival you makes her famous far from home. It also leaves your team thin. Being away changes who is missed.', right: 'Keeping your top operator close keeps her where you can see her. It also shows her how little you trust her.' },
  },
  {
    id: 'kovane_returns', title: 'THE HERO COMES BACK', theme: 'reputation', char: 'kovane', once: true, when: { flags: ['kovane_away'] },
    text: 'Dana returns with the customer saved. The whole floor claps. People chant her name in the chat. She looks at you, then at the crowd. She waits to see what you will do.',
    left: { label: 'Praise her in public', style: 'charm', memo: 'You praised Dana for saving the customer.', fx: { m: { loy: 6, rep: 3, auth: -2 }, chars: { kovane: { trust: 15 } }, clear: ['kovane_away'], flags: ['kovane_hero'] }, result: 'You give her a big shout-out at the all-hands. The team cheers, because it was their win too.' },
    right: { label: 'Keep it cool and ask for the report', style: 'force', memo: 'You gave Dana a cool welcome.', fx: { m: { auth: 4, rep: -4 }, chars: { kovane: { resent: 15, trust: -10 } }, clear: ['kovane_away'] }, result: 'The report is in order. The crowd noticed how you treated her, not the report.' },
    lesson: { law: 1, left: 'Sharing the glory costs you some shine. It makes a loyal person famous, and she stays yours.', right: 'Reminding a hero who is in charge protects your place. It also shows her how much she may be loved.' },
  },
  {
    id: 'kovane_doubt', title: "DANA'S QUESTION", theme: 'loyalty', char: 'kovane', others: ['varen'], story: true, once: true, weight: 3,
    when: { char: { kovane: { resent: [25, null], trust: [null, 60] } }, notFlags: ['kovane_entitled'] },
    text: "'Tell me the truth,' says Dana. She holds her coffee like a shield. 'Am I being replaced? Marcus's analysts are in my team channels. They count my people like headcount.'",
    left: { label: 'Promise nothing', style: 'candour', memo: 'You would not promise Dana her job.', fx: { m: { auth: 2 }, chars: { kovane: { resent: 10, trust: -10 } } }, result: 'Dana nods slowly. She heard the truth. She does not like it.' },
    right: { label: 'Promise she will always run Operations', style: 'charm', memo: 'You promised Dana she would always run Operations.', fx: { m: { loy: 5, auth: -4 }, chars: { kovane: { trust: 25, resent: -15 } }, flags: ['kovane_entitled'] }, result: 'She smiles, to her own surprise. You bought a very loyal operator. You also gave away a lot of choice.' },
    lesson: { law: 19, left: 'A worried person hears silence as bad news. Being honest is polite, but it is not always safe.', right: 'A promise made to calm one person ties your hands later. Loyalty bought with a promise makes you less free.' },
  },

  // ---- Chamberlain Quill ----
  {
    id: 'audience_list', title: 'WHO SEES THE CEO', theme: 'negotiation', char: 'quill', others: ['varen', 'dorne'], once: true, when: { turn: [6, null] },
    text: "Everyone wants time with the CEO, and I manage the calendar. Marcus's group and Selena's group both expect slots this week. I can keep it fair. Or I can tilt it your way.",
    left: { label: 'Keep it fair', style: 'candour', fx: { m: { rep: 3, loy: 3 }, chars: { quill: { trust: 5 } } }, result: 'Quentin puts the calendar in order and looks happy about it.' },
    right: { label: 'Put your friends first', style: 'guile', memo: 'You had Quentin tilt the calendar.', fx: { m: { auth: 6, loy: 4 }, chars: { varen: { resent: 8 }, dorne: { resent: 8 }, quill: { obligation: 15 } }, flags: ['list_rigged'], stat: { manipulations: 1 } }, result: 'Your people get the CEO. The others wait. Nobody says anything. Everyone notices.' },
    lesson: { law: 31, left: 'Fair rules win trust slowly. They give nobody a reason to be angry with you.', right: 'Choosing who gets in is quiet power. But the people left in the hall can count.' },
  },
  {
    id: 'quill_leak', title: 'THE SIDE CHAT', theme: 'secrets', char: 'quill', others: ['ysolde'], story: true, once: true,
    when: { secret: ['quill_leaks'] },
    text: "You find Quentin in a private chat with Yara, forwarding a calendar. He does not deny it. 'Everyone sells something. I sell the CEO's daily plans. I never share his secrets. You know the difference.'",
    left: {
      label: 'Feed him false news', style: 'guile', memo: "You used Quentin's leak to spread false news.",
      fx: { m: { auth: 3 }, flags: ['false_news'], stat: { manipulations: 1 } },
      branches: [{ chance: 0.4, fx: { m: { rep: -3 }, chars: { ysolde: { trust: -10 }, quill: { resent: 10 } } }, result: 'Yara sells the false news back to you, with a wink. The leak runs both ways.' }],
      result: 'Your rivals chase a rumour you made up and waste a month.',
    },
    right: { label: "Remove him from the CEO's office", style: 'force', memo: "You removed Quentin for selling the CEO's plans.", fx: { m: { auth: 3, loy: -4, res: -3 }, chars: { quill: { status: 'exiled', resent: 20 } } }, result: 'Quentin leaves quietly. Within a week the office forgets how to book a room.' },
    lesson: { law: 14, left: 'A leak is useful once you know where it goes. It works until the other side learns that you know.', right: 'Removing the spy stops the leak. It also loses the one person who knew how the office really worked.' },
  },
];
