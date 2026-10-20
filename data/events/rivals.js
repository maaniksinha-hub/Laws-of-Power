// Rivalries and favours: Jordan Blake, Hannah Lee's culture plan, Ethan Cole's headcount.

export default [
  // ---- Jordan Blake ----
  {
    id: 'dorne_toast', via: 'townhall', title: 'A SHOUT-OUT AT THE ALL-HANDS', theme: 'reputation', char: 'dorne', story: true, once: true, when: { turn: [3, null] },
    text: [
      { when: { flags: ['humble_start'] }, t: "At the all-hands, Jordan grabs the mic. 'A big hello to our newest designer, so quiet we almost forgot to be scared!' People laugh. Maya is watching. So is everyone who is not laughing. All eyes turn to you." },
      "At the all-hands, Jordan grabs the mic. 'A big hello to our newest designer, brave enough to sit in the front row!' People laugh. Maya is watching. So is everyone who is not laughing. All eyes turn to you.",
    ],
    left: { label: 'Thank Maya for the welcome', style: 'restraint', fx: { m: { rep: 3, loy: 2 }, chars: { aldric: { trust: 6 }, dorne: { trust: -3 } } }, result: 'Maya raises her coffee a little. Jordan tilts his head, as if reading you.' },
    right: { label: 'Top him with a sharper joke', style: 'charm', fx: { m: { rep: 8, auth: 2 }, chars: { dorne: { resent: 10, suspicion: 5 }, aldric: { trust: -5 } } }, result: 'The room roars. Jordan laughs too, and remembers it.' },
    lesson: { law: 1, left: 'Turning the praise to your boss looks loyal. But it leaves a charming rival unchallenged.', right: 'Beating a popular rival at his own game wins the room today. Tomorrow he will watch you. And Maya will remember who stole the room.' },
  },
  {
    id: 'dorne_alliance', via: 'oneonone', title: "JORDAN'S PROPOSAL", theme: 'negotiation', char: 'dorne', others: ['varen'], story: true, once: true, when: { seen: ['dorne_toast'], turn: [8, null] },
    text: "'Daniel's contractor budget is bloated,' Jordan says, over a quiet coffee. 'Back my plan to move half of it to Brand. Then I will back whatever you ask next. Daniel will hate us both. Is that not nice?'",
    left: { label: 'Say no politely', style: 'restraint', memo: "You said no to Jordan's proposal.", fx: { m: { rep: 1 }, chars: { dorne: { trust: -5, resent: 3 } }, flags: ['dorne_declined'] }, result: 'Jordan smiles the way you smile at a closed shop.' },
    right: { label: 'Back his proposal', style: 'pragmatism', memo: "You backed Jordan's plan against Daniel's budget.", fx: { m: { rep: 3, auth: 3 }, chars: { dorne: { trust: 15, obligation: 20 }, varen: { resent: 15 } }, rel: [['dorne', 'varen', { rivalry: 10 }]], flags: ['dorne_pact'], queue: [{ id: 'dorne_price', delay: 6 }] }, result: 'The plan passes. Daniel is polite about it, which is the scariest thing he could be.' },
    lesson: { law: 20, left: 'Staying free keeps your choices open, and nobody feels they are owed. But you stay outside the group that decides things.', right: 'A deal of convenience is a loan. The favour you took is already growing, in a coin you do not control.' },
  },
  {
    id: 'dorne_price', title: 'JORDAN COLLECTS', theme: 'revenge', char: 'dorne', story: true, once: true, when: { flags: ['dorne_pact'] },
    text: "Jordan comes to collect. 'My old colleague Amir would be great at running the design budget,' he says, as if he mentioned the weather. 'You said you would give me what I needed. I wrote it down.'",
    left: { label: 'Refuse the job for his friend', style: 'candour', memo: "You refused to repay Jordan's favour.", fx: { m: { rep: -2 }, chars: { dorne: { trust: -20, resent: 15 } }, flags: ['dorne_burned'] }, result: "Jordan's smile does not move at all. 'Of course,' he says. 'Honest people are so rare.'" },
    right: { label: 'Give his friend the job', style: 'pragmatism', memo: "You gave Jordan's friend the budget job.", fx: { m: { res: -10, auth: -3 }, chars: { dorne: { ambition: 20, trust: 10 } }, flags: ['dorne_treasury'] }, result: 'Amir is delighted, and good at the job. Now Jordan has a hand in the budget.' },
    lesson: { law: 40, left: 'Refusing a favour you already took costs you the person. It also costs most of the credit for the first deal.', right: 'A favour that comes cheap gets a price later, when it suits him. Paying keeps the peace. It also makes your creditor bigger.' },
  },
  {
    id: 'dorne_scandal', via: 'email', title: 'WHO PAID FOR THE STAR CAMPAIGN', theme: 'secrets', char: 'dorne', others: ['vask'], story: true, once: true, weight: 2,
    when: { turn: [10, null], notFlags: ['dorne_disgraced'], notSecret: ['dorne_vask_funds'] },
    text: "An anonymous email arrives with a spreadsheet from Ethan's office. It lists payments for Jordan's star influencer campaign, his award entry and the launch party. His popular wins were paid for by Product's budget.",
    left: {
      label: 'Say nothing and keep it for later', style: 'guile', memo: "You kept Jordan's secret to use later.",
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds', 'leverage_dorne'], queue: [{ id: 'leverage_use', delay: 4 }] },
      result: 'You save the file in a private folder. Power you do not use is power you can still spend.',
    },
    right: {
      label: 'Show it to the leadership team', style: 'candour', memo: "You showed who paid for Jordan's wins.",
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds'], expose: ['dorne_vask_funds'], chars: { vask: { resent: 12, suspicion: 10 } } },
      result: 'There is silence, then uproar. The company learns who has been buying his success.',
    },
    lesson: { law: 33, left: 'Knowing what someone depends on gives you power. Using it spends it. Keeping it means they may go looking for the leak.', right: 'Telling everyone ends a rival cleanly if your proof is strong. It also makes an enemy of anyone else named.' },
  },
  {
    id: 'leverage_use', title: 'A LOCK BEING TRIED', theme: 'timing', char: 'dorne', story: true, once: true, when: { flags: ['leverage_dorne'], notFlags: ['dorne_disgraced'] },
    text: 'Jordan now glances at you across the open office the way you check a locked door. He thinks someone knows something. Everyone wants an edge. You would rather have a friend.',
    left: { label: 'Let him know that you know', style: 'force', memo: 'You let Jordan know about the payments.', fx: { m: { auth: 5, rep: -2 }, chars: { dorne: { fear: 25, trust: -10, resent: 8 } }, flags: ['dorne_controlled'], stat: { manipulations: 1 } }, result: 'Jordan goes pale, then charming. He will back you in the next review. He will also remember.' },
    right: {
      label: 'Keep waiting', style: 'restraint', fx: {},
      branches: [{ chance: 0.4, fx: { chars: { dorne: { resent: 25, suspicion: 20 } }, m: { rep: -4 } }, result: 'Sofia sold your silence to Jordan. Now he smiles at you in a very different way.' }],
      result: 'Nothing happens. That is the point.',
    },
    lesson: { law: 35, left: 'Showing what you know early buys cooperation now. But your target becomes an open enemy with a long memory.', right: 'Waiting makes a secret worth more. But someone else may sell it first.' },
  },

  // ---- Hannah Lee ----
  {
    id: 'anselm_charter', title: 'THE CULTURE PLAN', theme: 'opportunity', char: 'anselm', story: true, once: true, when: { turn: [5, null] },
    text: "Hannah puts a plan on your desk. Clear levels and pay bands for every designer. Public promotion rules. No secret deals at calibration. 'Do it this quarter,' she says, 'or people will leave and say why.' Her hands are stained with marker but steady.",
    left: { label: 'Try it with one team first', style: 'restraint', memo: "You tried Hannah's plan with one team first.", fx: { m: { auth: 2, rep: 2, res: -3 }, chars: { anselm: { trust: 6 } }, flags: ['charter_pilot'], queue: [{ id: 'pamphlet_storm', delay: 4 }] }, result: 'One team gets the new rules. Everyone else gets a good view.' },
    right: { label: 'Back the whole plan', style: 'candour', memo: "You backed all of Hannah's plan.", fx: { m: { rep: 10, auth: -8, res: -8 }, chars: { anselm: { trust: 25 }, varen: { resent: 10 }, dorne: { resent: 4 } }, flags: ['charter_full'], queue: [{ id: 'pamphlet_storm', delay: 3 }] }, result: 'Designers cheer. The leaders take notes. Both are getting ready.' },
    lesson: { law: 45, left: 'A small test lets people get used to change before it scares them. It also keeps the reformer on your side while you wait.', right: 'A huge change wins love and makes powerful enemies at once. People accept change more easily when it feels like the old ways.' },
  },
  {
    id: 'pamphlet_storm', via: 'slack', title: 'ANONYMOUS POSTS EVERYWHERE', theme: 'secrets', char: 'anselm', others: ['vask'], story: true, once: true, when: { seen: ['anselm_charter'] },
    text: 'Overnight, anonymous posts appear on company review sites and in design Slack groups. They call the leaders greedy and out of touch, with sharp jokes. They are very well written. They link to one blog, and it has twenty thousand views.',
    left: { label: 'Demand the posts come down', style: 'force', memo: 'You demanded the anonymous posts come down.', fx: { m: { auth: 5, rep: -6 }, chars: { anselm: { trust: -15 } }, flags: ['pamphlets_banned'] }, result: 'Legal sends takedown notices. By the next day, screenshots spread everywhere, which is worse.' },
    right: { label: 'Find out who is behind them', style: 'guile', memo: 'You tracked down who paid for the posts.', fx: { m: { res: -4 }, reveal: ['vask_funds_pamphlets'], flags: ['evidence_vask_funds_pamphlets'], queue: [{ id: 'vask_confrontation', delay: 1 }] }, result: 'The trail of invoices ends at a PR freelancer paid by a firm linked to Ethan.' },
    lesson: { law: 39, left: "Banning a message spreads it, and gives the reformer a story of being silenced.", right: 'Following the money shows who gains from the trouble. The loudest voice is not always the one paying.' },
  },
  {
    id: 'anselm_arrest', title: 'A FIRING ORDER FOR HANNAH', theme: 'fear', char: 'anselm', others: ['varen'], story: true, once: true, when: { seen: ['pamphlet_storm'] },
    text: "Some leaders want Hannah fired for leaking company plans. Daniel wrote the letter before you asked. 'It is only a form,' he says. Outside, a crowd of designers gathers with their coffee cups raised.",
    left: { label: 'Protect Hannah', style: 'candour', memo: 'You protected Hannah from the leaders.', fx: { m: { rep: 4, loy: 4, auth: -5 }, chars: { anselm: { trust: 20 }, varen: { resent: 10 } } }, result: 'You tear the letter in two, in front of Daniel. Cheers rise from the designers outside.' },
    right: { label: 'Sign the letter', style: 'force', memo: 'You signed the firing letter for Hannah.', fx: { m: { auth: 6, rep: -8 }, chars: { anselm: { status: 'imprisoned', resent: 20 }, varen: { trust: 8 } }, flags: ['reform_dead'] }, result: 'Hannah leaves calmly with a box. The cheers die out one by one.' },
    lesson: { law: 42, left: 'Standing by the leader keeps her followers loyal. It also makes you the next target of the people she scares.', right: "Taking away a movement's leader can break it or fire it up. It depends on who really holds the crowd together." },
  },

  // ---- Ethan Cole ----
  {
    id: 'vask_loan', via: 'oneonone', title: 'A HEADCOUNT FAVOUR', theme: 'scarcity', char: 'vask', story: true, once: true, when: { turn: [8, null], meter: { res: [null, 55] } },
    text: "Budgets are tight, and Ethan has stopped by your desk. 'Two extra hires for Design this quarter, with no strings but your good word in planning. I would hate to see the team burn out.' He smiles like someone who has already updated the roadmap.",
    left: { label: 'Say no', style: 'restraint', fx: { m: { res: -4, rep: 2, loy: -2 }, chars: { vask: { trust: -6 } } }, result: 'Ethan nods. Doors that were open to you are now only unlocked.' },
    right: { label: 'Take the headcount', style: 'pragmatism', memo: 'You took a headcount favour from Ethan.', fx: { m: { res: 22 }, chars: { vask: { obligation: 30, trust: 8 } }, flags: ['vask_debt'], queue: [{ id: 'vask_collect', delay: 6 }] }, result: 'Two new designers start on Monday. The planning doc has a new, polite line.' },
    lesson: { law: 40, left: 'Saying no keeps you free of the lender. But you face every burnout he warned about.', right: 'A lender is a patient hunter. A free favour has a cost that comes later, in another form.' },
  },
  {
    id: 'vask_collect', via: 'call', title: 'ETHAN CALLS IN THE FAVOUR', theme: 'negotiation', char: 'vask', story: true, urgent: true, once: true, major: true, when: { flags: ['vask_debt'] },
    text: "Ethan calls you after the roadmap review. 'I do not need the favour today,' he says. 'I would just like Product to lead design on the new platform, as a thank-you. Or give the two hires back, if you prefer to be sentimental.'",
    left: { label: 'Let Product lead the platform design', style: 'pragmatism', memo: 'You let Ethan lead design on the platform.', fx: { m: { rep: -5 }, chars: { vask: { trust: 15, obligation: -30 } }, clear: ['vask_debt'], flags: ['salt_monopoly'] }, result: 'The debt is gone, the doc is signed, and Product has more say in every screen.' },
    right: {
      label: 'Give the headcount back', style: 'candour', memo: 'You gave Ethan the headcount back.',
      fx: { m: { res: -25 }, chars: { vask: { resent: 10, trust: -5, obligation: -30 } }, clear: ['vask_debt'], flags: ['vask_resentful'] },
      branches: [{ when: { meter: { res: [null, 25] } }, fx: { m: { loy: -8, auth: -6 }, chars: { vask: { resent: 15 } } }, result: 'You give back both hires and still owe him a little. You cover it with promises in the planning doc. Ethan writes them down.' }],
      result: 'The team shrinks again. Ethan accepts with the smile of someone who just lost a customer.',
    },
    lesson: { law: 11, left: "Letting Product lead pays your debt with your own team's say. It keeps Ethan close. It also makes you his partner in public.", right: 'Paying in full frees you from the lender. It leaves you short-staffed and a creditor with nothing to lose.' },
  },
  {
    id: 'vask_confrontation', title: 'THE INVOICE', theme: 'rivalry', char: 'vask', others: ['anselm'], story: true, urgent: true, once: true, major: true, when: { secret: ['vask_funds_pamphlets'] },
    text: "You put the invoice on Ethan's desk. He reads it slowly, smiles and pours you a coffee. 'Leaders are bad at hiding receipts,' he says. 'Did you come to thank me, or to shout?'",
    left: { label: 'Name him as the one behind the posts', style: 'candour', memo: 'You named Ethan as the one behind the posts.', fx: { expose: ['vask_funds_pamphlets'] }, result: 'The room goes quiet as the invoice is read aloud. Ethan is asked to leave the planning group, still smiling.' },
    right: { label: 'Use it to make a deal', style: 'guile', memo: 'You made a deal with Ethan over the invoice.', fx: { m: { res: 12, auth: 3 }, chars: { vask: { fear: 25, resent: 20, trust: -10 } }, flags: ['vask_leash'], stat: { manipulations: 1 } }, result: 'Ethan agrees to every term. He is a patient person. You just showed him what to wait for.' },
    lesson: { law: 33, left: 'Naming a powerful person in public ends his hold. The roadmap shakes with him.', right: 'A secret turns an enemy into a debtor. A debtor who knows you hold his ruin remembers it every time you deal.' },
  },
  {
    id: 'guild_strike', via: 'slack', title: 'THE ENGINEERS STOP WORK', theme: 'fear', char: 'vask', story: true, once: true, when: { anyFlags: ['salt_monopoly', 'vask_resentful'] },
    text: "At noon, every engineer on the platform team stops work on design tickets. Ethan's leads send a polite Slack message asking who will sign off on scope now. He is not in the channel. He never is.",
    left: { label: 'Escalate it to every manager', style: 'force', fx: { m: { auth: 6, rep: -6 }, chars: { vask: { resent: 15 } } }, result: 'Work restarts under pressure. Everyone is angry, and nobody trusts you.' },
    right: { label: 'Talk about scope and dates', style: 'pragmatism', fx: { m: { res: -8, rep: 4, loy: 3 }, chars: { vask: { trust: 8 } } }, result: 'A fair plan is agreed by lunch. Ethan takes a bow he does not mean.' },
    lesson: { law: 9, left: 'Force restarts the work. It also teaches engineers what you do when they ask a question.', right: 'Showing a plan that works ends the standoff and nobody loses face. It is slow, and it lasts.' },
  },
];
