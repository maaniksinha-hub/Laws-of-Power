// Design team storylines: the first day, Daniel's bid for Design Systems (a five-step chain), Priya, Tom.
// Event schema is documented in README.md ("Adding events"). Meter keys: auth / rep / loy / res.

export default [
  {
    id: 'arrival', title: 'YOUR FIRST DAY ON THE TEAM', theme: 'ambition', char: 'quill', story: true, urgent: true, once: true, when: { turn: [1, 1] },
    text: "Welcome to Lumen. Your laptop works and you are in the Figma team. I am Tom, the Design Program Manager. Nobody told you where to sit, so I will. There is a desk next to the product squad, where everyone walks by. Or a desk in the quiet design pod, where the craft people sit.",
    left: { label: 'Take the desk in the design pod', style: 'restraint', fx: { m: { rep: -2, loy: 3 }, flags: ['humble_start'], chars: { quill: { trust: 8 } } }, result: 'Tom nods, as if you passed a test you did not know about.' },
    right: { label: 'Take the desk by the product squad', style: 'charm', fx: { m: { rep: 6, auth: 3 }, flags: ['bold_start'], chars: { varen: { resent: 4, suspicion: 4 }, dorne: { resent: 5 }, quill: { trust: -3 } } }, result: 'A PM waves. An engineer asks a quick question. Someone in the pod stops smiling.' },
    lesson: { law: 1, left: 'The pod costs you visibility. PMs will not know your name. But you are not the first thing a nervous team looks at.', right: 'The product squad desk shows you are bold and easy to find. It also tells the designers who waited years for a seat there that you are in their way.' },
  },

  // ---- Chain A: the guard, the chapel, the coup ----
  {
    id: 'varen_guard', title: 'DANIEL WANTS THE SYSTEMS TEAM', theme: 'ambition', char: 'varen', others: ['kovane'], story: true, once: true, major: true, weight: 3,
    when: { turn: [5, null], rank: [1, null] },
    text: "Priya's Design Systems team is getting louder in roadmap talks. Move them under me, Maya says you decide. It would protect the roadmap. I will make sure Priya never blocks your plans. Or you.",
    left: {
      label: 'Say no', style: 'restraint', memo: 'You said no when he asked for the Design Systems team.',
      fx: { m: { auth: 3, loy: -3 }, chars: { varen: { trust: -12, resent: 12 }, kovane: { trust: 8 } }, flags: ['varen_denied'] },
      result: 'Daniel smiles a little too wide.',
    },
    right: {
      label: 'Move Design Systems under Daniel', style: 'pragmatism', memo: 'You moved the Design Systems team under Daniel.',
      fx: { m: { auth: 6, res: -2 }, chars: { varen: { trust: 10, ambition: 15 }, kovane: { trust: -12, resent: 10 } }, flags: ['varen_guard'], queue: [{ id: 'rumour_meeting', delay: 3 }] },
      branches: [{ when: { flags: ['varen_schemer'] }, fx: { rel: [['varen', 'kovane', { alliance: true, benefit: 40, trust: 20 }]], flags: ['pact_formed'] } }],
      result: 'Daniel thanks you warmly. Priya leaves the call without saying goodbye.',
    },
    lesson: { law: 2, left: 'Saying no keeps Design Systems out of his hands. But a helpful manager turns into a quiet critic. The cost of a no comes slowly.', right: 'Someone who asks for a team "to protect the roadmap" has already thought about how to use it. You win his thanks today. You lose some of your own choices.' },
  },
  {
    id: 'rumour_meeting', title: 'A HIDDEN CALENDAR SERIES', theme: 'secrets', char: 'ysolde', others: ['varen'], story: true, once: true,
    when: { flags: ['varen_guard'] },
    text: 'I found a private calendar series called Sync 4. It repeats every Thursday after hours. Two people are on it. One is Daniel. The other is from Design Systems. The details are hidden. I notice things like this. What do you want me to do with it?',
    left: { label: 'Ignore it', style: 'restraint', fx: { flags: ['rumour_ignored'], chars: { ysolde: { trust: -3 } }, queue: [{ id: 'conspiracy_ripens', delay: 4 }] }, result: 'Sofia shrugs. The gossip goes to look for another buyer.' },
    right: {
      label: 'Check the calendar and file access logs', style: 'guile', memo: 'You checked the access logs for Daniel.',
      fx: { m: { res: -5 }, flags: ['varen_watched'] },
      branches: [
        { when: { flags: ['varen_schemer'] }, fx: { reveal: ['varen_kovane_pact'], flags: ['evidence_varen_kovane_pact'], queue: [{ id: 'varen_confront', delay: 1 }] }, result: 'The logs show a private Figma file, a shared plan and a deal made in Sync 4. Daniel and Priya have joined forces.' },
        { fx: { reveal: ['kovane_pay_petition'], flags: ['varen_cleared'], queue: [{ id: 'watchers_found', delay: 4 }] }, result: 'The logs show a doc about extra pay for her team. Daniel offered to carry it for her. Nothing wrong at all.' },
      ],
      result: 'You spend a favour on a quiet look at the logs.',
    },
    lesson: { law: 14, left: 'Ignoring gossip saves the cost of checking it. If it was true, the plan keeps growing in the dark.', right: 'Checking logs gives you facts, not proof of guilt. You may find a guilty colleague or clear an innocent one. If they catch you looking, you lose trust either way.' },
  },
  {
    id: 'varen_confront', title: 'THE PROOF IN THE FIGMA FILE', theme: 'rivalry', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed', 'evidence_varen_kovane_pact'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: "You have the proof. Daniel and Priya join your Zoom. Daniel has his excuse ready. 'It is a mix-up,' he says smoothly. 'Just a draft for the roadmap.' Priya stares at her keyboard and says nothing.",
    left: {
      label: 'Name them in the leadership meeting', style: 'candour', memo: 'You named Daniel and Priya in the leadership meeting.',
      fx: { m: { loy: -3 } },
      branches: [
        { when: { meter: { auth: [null, 35], loy: [null, 49] } }, fx: { m: { auth: -8, rep: -4 }, chars: { varen: { trust: 10 } }, flags: ['varen_survives'] }, result: 'You have little influence and few friends. Your charge falls flat. Daniel forgives you, loudly.' },
        { when: { meter: { auth: [null, 35] } }, fx: { expose: ['varen_kovane_pact'], flags: ['lowauth_victory'], m: { loy: 5 } }, result: 'You have little influence, but many friends. The leaders look at the proof, then at you, and back you up. Daniel is moved off the team.' },
        { fx: { expose: ['varen_kovane_pact'] }, result: 'The room goes silent. Daniel is moved off the team with great dignity and no friends.' },
      ],
    },
    right: {
      label: 'Win Priya over in private', style: 'guile', memo: 'You turned Priya against Daniel in private.',
      fx: { m: { auth: 4, loy: 4 }, rel: [['varen', 'kovane', { alliance: false, trust: -30 }]], chars: { kovane: { trust: 25, obligation: 20, resent: -10 }, varen: { resent: 25, fear: 10 } }, flags: ['conspiracy_redirected'], clear: ['varen_guard'], stat: { manipulations: 1 } },
      result: 'Priya agrees to work with you and drop the plan. Daniel now holds a plan that nobody will follow.',
    },
    lesson: { law: 42, left: 'Calling it out in public removes the leader and shames his partner. You need proof and enough power to act. Without them it backfires.', right: 'Winning over the partner leaves the leader alone, with no show. But a person who knows you know is still dangerous.' },
  },
  {
    id: 'conspiracy_ripens', title: 'A NEW PRIVATE SLACK CHANNEL', theme: 'secrets', char: 'quill', others: ['varen', 'kovane'], story: true, once: true,
    when: { flags: ['pact_formed', 'rumour_ignored'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'] },
    text: 'A new Slack channel called design-next has appeared. The invite list is private. People join and go quiet in crit. The team leads will not look me in the eye. And Daniel is very cheerful these days.',
    left: {
      label: 'Shuffle the team leads', style: 'force', memo: 'You shuffled the team leads in a hurry.',
      fx: { m: { auth: 3, res: -3 }, chars: { kovane: { resent: 15, trust: -10 }, varen: { resent: 10 } }, flags: ['coup_weakened'], queue: [{ id: 'the_coup', delay: 4 }] },
      result: 'Half the leads have new projects by Monday. The other half watch you closely.',
    },
    right: {
      label: 'Praise Priya in public', style: 'charm', memo: 'You praised Priya in public.',
      fx: { m: { rep: 3, res: -5 }, chars: { kovane: { trust: 15 } }, queue: [{ id: 'the_coup', delay: 4 }] },
      branches: [{ when: { flags: ['kovane_steady'] }, fx: { flags: ['coup_weakened'], rel: [['varen', 'kovane', { trust: -25 }]] }, result: 'Priya blinks. A person who is praised in public finds it hard to plan in private. The channel goes quiet.' }],
      result: 'Priya takes the praise. She does not leave the channel.',
    },
    lesson: { law: 19, left: 'Shuffling the leads slows a plan. But it also tells the planners that you know. Do it badly and the plan may start sooner.', right: 'Praise works on someone who feels ignored. It fails on someone who has already picked a side. You need to know which Priya you have.' },
  },
  {
    id: 'the_coup', title: 'FOR THE GOOD OF THE TEAM', theme: 'fear', char: 'varen', others: ['kovane'], story: true, urgent: true, once: true, major: true,
    when: { flags: ['pact_formed'], notFlags: ['conspiracy_exposed', 'conspiracy_redirected'], seen: ['conspiracy_ripens'] },
    text: "Daniel books a room with Priya and two senior PMs. 'For the good of the team,' he says gently, 'we think Design should report into Product, and you should step aside. Ethan is ready to sign off.'",
    left: {
      label: 'Ask the design team to back you', style: 'force',
      branches: [
        { when: { any: [{ flags: ['coup_weakened'] }, { meter: { loy: [55, null], auth: [40, null] } }] }, fx: { chars: { varen: { status: 'exiled' }, kovane: { status: 'imprisoned' } }, m: { rep: 8, auth: 8 }, flags: ['conspiracy_exposed'], stat: { conspiracies: 1 } }, result: 'Your people speak up in the thread. The PMs hesitate. That is enough. Daniel is moved out. Priya hands in her resignation without a word.' },
        { fx: { end: 'overthrown' }, result: 'Nobody speaks. The Slack thread stays empty.' },
      ],
    },
    right: {
      label: 'Offer Daniel a seat on the steering group', style: 'pragmatism',
      branches: [
        { when: { any: [{ meter: { rep: [50, null] } }, { meter: { res: [50, null] } }] }, fx: { m: { auth: -15, rep: -4 }, flags: ['varen_council'], chars: { varen: { trust: 15, ambition: 10 } } }, result: 'He accepts a title and the headcount plan. You keep your job. You are no longer sure who really holds it.' },
        { fx: { end: 'exiled_alive' }, result: 'Daniel smiles at your offer. Then Ethan\'s email lands, and your access is gone.' },
      ],
    },
    lesson: { law: 22, left: 'You can only win a fight like this if you built loyalty and influence long before. If not, it is a coin toss.', right: 'Giving way can save you, if you still have a good name or a favour to trade. It works best when you saw it coming.' },
  },
  {
    id: 'watchers_found', title: 'DANIEL SAW THE ACCESS LOG', theme: 'loyalty', char: 'varen', story: true, once: true,
    when: { flags: ['varen_cleared', 'varen_watched'] },
    text: "Daniel shares his screen. 'IT told me you pulled the access logs for Sync 4. I was working on extra pay for Priya's team. If you had doubts, you could simply have asked me. Per my last message.'",
    left: { label: 'Say sorry and explain', style: 'candour', memo: 'You told him you checked his logs.', fx: { m: { rep: -2, loy: 3 }, chars: { varen: { trust: 10, suspicion: -5 } } }, result: 'Daniel accepts your apology. He is so calm about it that you feel you owe him another.' },
    right: { label: 'Deny everything', style: 'guile', memo: 'You lied about the logs.', fx: { m: { rep: -3 }, chars: { varen: { trust: -15, resent: 15, suspicion: 20 } }, stat: { manipulations: 1 } }, result: 'Daniel looks at the screen, then at you. His polite face does not change at all.' },
    lesson: { law: 12, left: 'Owning up to a small fault can calm a bigger worry. You trade a little pride for trust.', right: 'A flat denial works only until the first piece of proof. Then it costs more than the first mistake.' },
  },

  // ---- General Kovane ----
  {
    id: 'kovane_parade', title: 'THE DESIGN SYSTEMS OFFSITE', theme: 'loyalty', char: 'kovane', once: true, weight: 1.5, when: { turn: [4, null] },
    text: "The Design Systems team has not had an offsite in three years. 'They need to see that Design cares,' says Priya, a little too fast. 'So do I.' It would cost a month of the team budget.",
    left: { label: 'Not this year', style: 'restraint', fx: { m: { loy: -4 }, chars: { kovane: { trust: -8, resent: 5 } } }, result: 'Priya nods stiffly. Her face tells you what she thinks of stiff nods.' },
    right: { label: 'Pay for the offsite', style: 'charm', fx: { m: { res: -10, rep: 6, loy: 6 }, chars: { kovane: { trust: 14 } } }, result: 'A day of workshops, food and a long lunch. The team loves it. Priya looks ten years younger.' },
    lesson: { law: 37, left: 'Saving the money keeps the budget healthy. It also tells the team how much its quiet work matters.', right: 'A big event costs money and soon fades. But it turns private loyalty into a public story that people repeat for you.' },
  },
  {
    id: 'border_raid', title: 'A BIG CUSTOMER IS LEAVING', theme: 'timing', char: 'kovane', others: ['varen'], once: true, when: { turn: [10, null], rank: [1, null] },
    text: "Our largest customer is about to leave over a broken date picker component. Priya offers to lead the fix and meet them herself. 'A week there, a week to follow up.' Daniel watches her face like someone counting.",
    left: { label: 'Let Priya lead the fix', style: 'force', fx: { m: { rep: 6, auth: -3 }, chars: { kovane: { trust: 8 } }, flags: ['kovane_away'], queue: [{ id: 'kovane_returns', delay: 4 }] }, result: 'Priya starts that afternoon. The Slack channel feels both safer and strangely empty.' },
    right: { label: 'Send another designer and keep Priya close', style: 'restraint', fx: { m: { rep: -4 }, chars: { kovane: { resent: 10, trust: -6 } } }, result: 'The designer you send is able but not trusted by the customer. Priya takes it personally.' },
    lesson: { law: 16, left: 'Sending out a person who could rival you makes her famous beyond her team. It also leaves her team thin. Being away changes who is missed.', right: 'Keeping your top systems lead close keeps her where you can see her. It also shows her how little you trust her.' },
  },
  {
    id: 'kovane_returns', title: 'PRIYA SAVES THE CUSTOMER', theme: 'reputation', char: 'kovane', once: true, when: { flags: ['kovane_away'] },
    text: 'Priya is back with the customer saved. The fix shipped and they are staying. The whole floor claps. People post clap emoji with her name in Slack. She looks at you, then at the crowd. She waits to see what you will do.',
    left: { label: 'Praise her in public', style: 'charm', memo: 'You praised Priya for saving the customer.', fx: { m: { loy: 6, rep: 3, auth: -2 }, chars: { kovane: { trust: 15 } }, clear: ['kovane_away'], flags: ['kovane_hero'] }, result: 'You give her a big shout-out at the all-hands. The team cheers, because it was their win too.' },
    right: { label: 'Keep it cool and ask for the write-up', style: 'force', memo: 'You gave Priya a cool welcome.', fx: { m: { auth: 4, rep: -4 }, chars: { kovane: { resent: 15, trust: -10 } }, clear: ['kovane_away'] }, result: 'The write-up is in order. The crowd noticed how you treated her, not the write-up.' },
    lesson: { law: 1, left: 'Sharing the glory costs you some shine. It makes a loyal person famous, and she stays yours.', right: 'Reminding a hero who is in charge protects your place. It also shows her how much she may be loved.' },
  },
  {
    id: 'kovane_doubt', title: "PRIYA'S QUESTION", theme: 'loyalty', char: 'kovane', others: ['varen'], story: true, once: true, weight: 3,
    when: { char: { kovane: { resent: [25, null], trust: [null, 60] } }, notFlags: ['kovane_entitled'] },
    text: "'Tell me the truth,' says Priya. She holds her coffee like a shield. 'Am I being replaced by flashy decks? Daniel's people are in my team channels. They count my designers like headcount.'",
    left: { label: 'Promise nothing', style: 'candour', memo: 'You would not promise Priya her job.', fx: { m: { auth: 2 }, chars: { kovane: { resent: 10, trust: -10 } } }, result: 'Priya nods slowly. She heard the truth. She does not like it.' },
    right: { label: 'Promise she will always lead Design Systems', style: 'charm', memo: 'You promised Priya she would always lead Design Systems.', fx: { m: { loy: 5, auth: -4 }, chars: { kovane: { trust: 25, resent: -15 } }, flags: ['kovane_entitled'] }, result: 'She smiles, to her own surprise. You bought a very loyal systems lead. You also gave away a lot of choice.' },
    lesson: { law: 19, left: 'A worried person hears silence as bad news. Being honest is polite, but it is not always safe.', right: 'A promise made to calm one person ties your hands later. Loyalty bought with a promise makes you less free.' },
  },

  // ---- Chamberlain Quill ----
  {
    id: 'audience_list', title: 'WHO GETS TIME WITH MAYA', theme: 'negotiation', char: 'quill', others: ['varen', 'dorne'], once: true, when: { turn: [6, null] },
    text: "Everyone wants time with Maya, and I run her calendar. Daniel's group and Jordan's group both expect slots this week. I can keep it fair. Or I can tilt it your way. Quick question: which is it?",
    left: { label: 'Keep it fair', style: 'candour', fx: { m: { rep: 3, loy: 3 }, chars: { quill: { trust: 5 } } }, result: 'Tom puts the calendar in order and looks happy about it.' },
    right: { label: 'Put your friends first', style: 'guile', memo: 'You had Tom tilt the calendar.', fx: { m: { auth: 6, loy: 4 }, chars: { varen: { resent: 8 }, dorne: { resent: 8 }, quill: { obligation: 15 } }, flags: ['list_rigged'], stat: { manipulations: 1 } }, result: 'Your people get Maya. The others wait. Nobody says anything. Everyone notices.' },
    lesson: { law: 31, left: 'Fair rules win trust slowly. They give nobody a reason to be angry with you.', right: 'Choosing who gets time is quiet power. But the people left off the invite can count.' },
  },
  {
    id: 'quill_leak', title: 'THE PRIVATE SLACK DM', theme: 'secrets', char: 'quill', others: ['ysolde'], story: true, once: true,
    when: { secret: ['quill_leaks'] },
    text: "You see Tom in a private Slack DM with Sofia, forwarding a calendar. He does not deny it. 'Everyone trades something. I trade Maya's daily plans. I never share her private notes. You know the difference.'",
    left: {
      label: 'Feed him false news', style: 'guile', memo: "You used Tom's leak to spread false news.",
      fx: { m: { auth: 3 }, flags: ['false_news'], stat: { manipulations: 1 } },
      branches: [{ chance: 0.4, fx: { m: { rep: -3 }, chars: { ysolde: { trust: -10 }, quill: { resent: 10 } } }, result: 'Sofia trades the false news back to you, with a wink. The leak runs both ways.' }],
      result: 'Your rivals chase a rumour you made up and waste a month of sprints.',
    },
    right: { label: "Take him off Maya's calendar", style: 'force', memo: "You removed Tom for trading Maya's plans.", fx: { m: { auth: 3, loy: -4, res: -3 }, chars: { quill: { status: 'exiled', resent: 20 } } }, result: 'Tom steps back quietly. Within a week nobody knows how to book a crit.' },
    lesson: { law: 14, left: 'A leak is useful once you know where it goes. It works until the other side learns that you know.', right: 'Removing the leaker stops the leak. It also loses the one person who knew how the team really ran.' },
  },
];
