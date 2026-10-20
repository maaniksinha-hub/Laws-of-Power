// Rivalries and money: Lady Dorne, Brother Anselm's reforms, Master Vask's ledgers.

export default [
  // ---- Lady Dorne ----
  {
    id: 'dorne_toast', title: 'A SHOUT-OUT AT THE ALL-HANDS', theme: 'reputation', char: 'dorne', story: true, once: true, when: { turn: [3, null] },
    text: [
      { when: { flags: ['humble_start'] }, t: "At the all-hands, Selena grabs the mic. 'A big hello to our newest hire, so quiet we almost forgot to be scared!' People laugh. The CEO is watching. So is everyone who is not laughing. All eyes turn to you." },
      "At the all-hands, Selena grabs the mic. 'A big hello to our newest hire, brave enough to sit in the executive row!' People laugh. The CEO is watching. So is everyone who is not laughing. All eyes turn to you.",
    ],
    left: { label: 'Thank the CEO for the welcome', style: 'restraint', fx: { m: { rep: 3, loy: 2 }, chars: { aldric: { trust: 6 }, dorne: { trust: -3 } } }, result: 'The CEO raises his coffee a little. Selena tilts her head, as if reading you.' },
    right: { label: 'Beat her with a sharper joke', style: 'charm', fx: { m: { rep: 8, auth: 2 }, chars: { dorne: { resent: 10, suspicion: 5 }, aldric: { trust: -5 } } }, result: 'The room roars. Selena laughs too, and remembers it.' },
    lesson: { law: 1, left: 'Turning the praise to the boss looks loyal. But it leaves a charming rival unchallenged.', right: 'Beating a popular rival at her own game wins the room today. Tomorrow she will watch you. And the CEO will remember who outshone him.' },
  },
  {
    id: 'dorne_alliance', title: "SELENA'S PROPOSAL", theme: 'negotiation', char: 'dorne', others: ['varen'], story: true, once: true, when: { seen: ['dorne_toast'], turn: [8, null] },
    text: "'Strategy is bloated,' Selena says, over a quiet coffee. 'Back my plan to cut their budget. Then I will back whatever you ask next. Marcus will hate us both. Is that not nice?'",
    left: { label: 'Say no politely', style: 'restraint', memo: "You said no to Selena's proposal.", fx: { m: { rep: 1 }, chars: { dorne: { trust: -5, resent: 3 } }, flags: ['dorne_declined'] }, result: 'Selena smiles the way you smile at a closed shop.' },
    right: { label: 'Back her proposal', style: 'pragmatism', memo: "You backed Selena's plan against the strategy team.", fx: { m: { rep: 3, auth: 3 }, chars: { dorne: { trust: 15, obligation: 20 }, varen: { resent: 15 } }, rel: [['dorne', 'varen', { rivalry: 10 }]], flags: ['dorne_pact'], queue: [{ id: 'dorne_price', delay: 6 }] }, result: 'The plan passes. Marcus is polite about it, which is the scariest thing he could be.' },
    lesson: { law: 20, left: 'Staying free keeps your choices open, and nobody feels they are owed. But you stay outside the group that decides things.', right: 'A deal of convenience is a loan. The favour you took is already growing, in a coin you do not control.' },
  },
  {
    id: 'dorne_price', title: 'SELENA COLLECTS', theme: 'revenge', char: 'dorne', story: true, once: true, when: { flags: ['dorne_pact'] },
    text: "Selena comes to collect. 'My old colleague Baldric would make a great head of finance,' she says, as if she mentioned the weather. 'You said you would give me what I needed. I wrote it down.'",
    left: { label: 'Refuse the job for her friend', style: 'candour', memo: "You refused to repay Selena's favour.", fx: { m: { rep: -2 }, chars: { dorne: { trust: -20, resent: 15 } }, flags: ['dorne_burned'] }, result: "Selena's smile does not move at all. 'Of course,' she says. 'Honest people are so rare.'" },
    right: { label: 'Give her friend the job', style: 'pragmatism', memo: "You gave Selena's friend the finance job.", fx: { m: { res: -10, auth: -3 }, chars: { dorne: { ambition: 20, trust: 10 } }, flags: ['dorne_treasury'] }, result: 'Baldric is delighted, and good at the job. Now Selena has a hand in the budget.' },
    lesson: { law: 40, left: 'Refusing a favour you already took costs you the person. It also costs most of the credit for the first deal.', right: 'A favour that comes cheap gets a price later, when it suits her. Paying keeps the peace. It also makes your creditor bigger.' },
  },
  {
    id: 'dorne_scandal', title: "THE STAR'S INVESTOR", theme: 'secrets', char: 'dorne', others: ['vask'], story: true, once: true, weight: 2,
    when: { turn: [10, null], notFlags: ['dorne_disgraced'], notSecret: ['dorne_vask_funds'] },
    text: "An anonymous email arrives with a spreadsheet from Oliver Vasquez's office. It lists payments for Selena's big discounts, awards and bonus pool. Her popular wins were paid for by an investor.",
    left: {
      label: 'Say nothing and keep it for later', style: 'guile', memo: "You kept Selena's secret to use later.",
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds', 'leverage_dorne'], queue: [{ id: 'leverage_use', delay: 4 }] },
      result: 'You save the file in a private folder. Power you do not use is power you can still spend.',
    },
    right: {
      label: 'Show it to the leadership team', style: 'candour', memo: "You showed who paid for Selena's wins.",
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds'], expose: ['dorne_vask_funds'], chars: { vask: { resent: 12, suspicion: 10 } } },
      result: 'There is silence, then uproar. The company learns who has been buying her success.',
    },
    lesson: { law: 33, left: 'Knowing what someone depends on gives you power. Using it spends it. Keeping it makes them look for the leak.', right: 'Telling everyone ends a rival cleanly if your proof is strong. It also makes an enemy of anyone else named.' },
  },
  {
    id: 'leverage_use', title: 'A LOCK BEING TRIED', theme: 'timing', char: 'dorne', story: true, once: true, when: { flags: ['leverage_dorne'], notFlags: ['dorne_disgraced'] },
    text: 'Selena now glances at you across the floor the way you check a locked door. She thinks someone knows something. Everyone wants an edge. You would rather have a friend.',
    left: { label: 'Let her know that you know', style: 'force', memo: 'You let Selena know about her investor.', fx: { m: { auth: 5, rep: -2 }, chars: { dorne: { fear: 25, trust: -10, resent: 8 } }, flags: ['dorne_controlled'], stat: { manipulations: 1 } }, result: 'Selena goes pale, then charming. She will vote with you. She will also remember.' },
    right: {
      label: 'Keep waiting', style: 'restraint', fx: {},
      branches: [{ chance: 0.4, fx: { chars: { dorne: { resent: 25, suspicion: 20 } }, m: { rep: -4 } }, result: 'Yara sold your silence to Selena. Now she smiles at you in a very different way.' }],
      result: 'Nothing happens. That is the point.',
    },
    lesson: { law: 35, left: 'Showing what you know early buys obedience now. But your target becomes an open enemy with a long memory.', right: 'Waiting makes a secret worth more. But someone else may sell it first.' },
  },

  // ---- Brother Anselm ----
  {
    id: 'anselm_charter', title: 'THE CULTURE PLAN', theme: 'opportunity', char: 'anselm', story: true, once: true, when: { turn: [5, null] },
    text: "Andrew puts a plan on your desk. Fair pay for everyone. A four-day week. No special deals for executives. 'Do it this quarter,' he says, 'or people will leave and say why.' His hands are stained with marker but steady.",
    left: { label: 'Try it in one department first', style: 'restraint', memo: "You tried Andrew's changes in one department first.", fx: { m: { auth: 2, rep: 2, res: -3 }, chars: { anselm: { trust: 6 } }, flags: ['charter_pilot'], queue: [{ id: 'pamphlet_storm', delay: 4 }] }, result: 'One department gets the new rules. Everyone else gets a good view.' },
    right: { label: 'Back the whole plan', style: 'candour', memo: "You backed all of Andrew's plan.", fx: { m: { rep: 10, auth: -8, res: -8 }, chars: { anselm: { trust: 25 }, varen: { resent: 10 }, dorne: { resent: 4 } }, flags: ['charter_full'], queue: [{ id: 'pamphlet_storm', delay: 3 }] }, result: 'Staff cheer. The executives take notes. Both are getting ready.' },
    lesson: { law: 45, left: 'A small test lets people get used to change before it scares them. It also keeps the reformer on your side while you wait.', right: 'A huge change wins love and makes powerful enemies at once. People accept change more easily when it feels like the old ways.' },
  },
  {
    id: 'pamphlet_storm', title: 'ANONYMOUS POSTS EVERYWHERE', theme: 'secrets', char: 'anselm', others: ['vask'], story: true, once: true, when: { seen: ['anselm_charter'] },
    text: 'Overnight, anonymous posts appear on every review site. They call the leaders greedy and out of touch, with sharp jokes. They are very well written. Andrew has one blog. There are twenty thousand views.',
    left: { label: 'Ban the posts', style: 'force', memo: 'You banned the anonymous posts.', fx: { m: { auth: 5, rep: -6 }, chars: { anselm: { trust: -15 } }, flags: ['pamphlets_banned'] }, result: 'Legal sends takedown notices. By the next day, screenshots spread everywhere, which is worse.' },
    right: { label: 'Find out who is behind them', style: 'guile', memo: 'You tracked down who paid for the posts.', fx: { m: { res: -4 }, reveal: ['vask_funds_pamphlets'], flags: ['evidence_vask_funds_pamphlets'], queue: [{ id: 'vask_confrontation', delay: 1 }] }, result: 'The trail of invoices ends at an agency owned by a firm owned by Oliver Vasquez.' },
    lesson: { law: 39, left: "Banning a message spreads it, and gives the reformer a martyr's story.", right: 'Following the money shows who gains from the trouble. The loudest voice is not always the one paying.' },
  },
  {
    id: 'anselm_arrest', title: 'A FIRING ORDER FOR ANDREW', theme: 'fear', char: 'anselm', others: ['varen'], story: true, once: true, when: { seen: ['pamphlet_storm'] },
    text: "The executives want Andrew fired for leaking company plans. Marcus wrote the letter before you asked. 'It is only a form,' he says. Outside, a crowd of staff gathers with their coffee cups raised.",
    left: { label: 'Protect Andrew', style: 'candour', memo: 'You protected Andrew from the executives.', fx: { m: { rep: 4, loy: 4, auth: -5 }, chars: { anselm: { trust: 20 }, varen: { resent: 10 } } }, result: 'You tear the letter in two, in front of Marcus. Cheers rise from the staff outside.' },
    right: { label: 'Sign the letter', style: 'force', memo: 'You signed the firing letter for Andrew.', fx: { m: { auth: 6, rep: -8 }, chars: { anselm: { status: 'imprisoned', resent: 20 }, varen: { trust: 8 } }, flags: ['reform_dead'] }, result: 'Andrew leaves calmly with a box. The cheers die out one by one.' },
    lesson: { law: 42, left: 'Standing by the leader keeps his followers loyal. It also makes you the next target of the people he scares.', right: "Taking away a movement's leader can break it or fire it up. It depends on who really holds the crowd together." },
  },

  // ---- Master Vask ----
  {
    id: 'vask_loan', title: 'A BRIDGE LOAN', theme: 'scarcity', char: 'vask', story: true, once: true, when: { turn: [8, null], meter: { res: [null, 55] } },
    text: "The cash is low, and Oliver has come to visit. 'A bridge loan, with no collateral but your good name. I would hate to see payroll go unpaid.' He smiles like someone who has already counted the money.",
    left: { label: 'Say no', style: 'restraint', fx: { m: { res: -4, rep: 2, loy: -2 }, chars: { vask: { trust: -6 } } }, result: 'Oliver nods. Doors that were open to you are now only unlocked.' },
    right: { label: 'Take the loan', style: 'pragmatism', memo: 'You borrowed money from Oliver.', fx: { m: { res: 22 }, chars: { vask: { obligation: 30, trust: 8 } }, flags: ['vask_debt'], queue: [{ id: 'vask_collect', delay: 6 }] }, result: 'Payroll is covered and the projects are funded. The spreadsheet has a new, polite line.' },
    lesson: { law: 40, left: 'Saying no keeps you free of the lender. But you face every shortage he warned about.', right: 'A lender is a patient hunter. Free money has a cost that comes later, in another form.' },
  },
  {
    id: 'vask_collect', title: 'THE CALL FROM THE BOARD MEMBER', theme: 'negotiation', char: 'vask', story: true, urgent: true, once: true, major: true, when: { flags: ['vask_debt'] },
    text: "Oliver calls with a folder. 'I do not need the money today,' he says. 'I would just like to be your only supplier for the new data platform, as a favour. Or the whole sum, if you prefer to be sentimental.'",
    left: { label: 'Give him the exclusive deal', style: 'pragmatism', memo: 'You gave Oliver the exclusive supplier deal.', fx: { m: { rep: -5 }, chars: { vask: { trust: 15, obligation: -30 } }, clear: ['vask_debt'], flags: ['salt_monopoly'] }, result: 'The debt is gone, the contract is signed, and the platform costs creep up.' },
    right: {
      label: 'Pay it all back', style: 'candour', memo: 'You paid Oliver back in full.',
      fx: { m: { res: -25 }, chars: { vask: { resent: 10, trust: -5, obligation: -30 } }, clear: ['vask_debt'], flags: ['vask_resentful'] },
      branches: [{ when: { meter: { res: [null, 25] } }, fx: { m: { loy: -8, auth: -6 }, chars: { vask: { resent: 15 } } }, result: 'You empty the budget and still fall short. You cover the rest with promises. Oliver writes them down.' }],
      result: 'The budget empties. Oliver accepts with the smile of someone who just lost a customer.',
    },
    lesson: { law: 11, left: "A sole supplier deal pays your debt with someone else's money. It keeps Oliver in your debt too. It also makes you his partner in public.", right: 'Paying in full frees you from the lender. It leaves you with an empty budget and a creditor with nothing to lose.' },
  },
  {
    id: 'vask_confrontation', title: 'THE INVOICE', theme: 'rivalry', char: 'vask', others: ['anselm'], story: true, urgent: true, once: true, major: true, when: { secret: ['vask_funds_pamphlets'] },
    text: "You put the invoice on Oliver's table. He reads it slowly, smiles and pours you a coffee. 'Executives are bad at paying their debts,' he says. 'Did you come to thank me, or to shout?'",
    left: { label: 'Name him as the one behind the posts', style: 'candour', memo: 'You named Oliver as the one behind the posts.', fx: { expose: ['vask_funds_pamphlets'] }, result: 'The board room goes quiet as the invoice is read aloud. Oliver is asked to step down, still smiling.' },
    right: { label: 'Use it to make a deal', style: 'guile', memo: 'You made a deal with Oliver over the invoice.', fx: { m: { res: 12, auth: 3 }, chars: { vask: { fear: 25, resent: 20, trust: -10 } }, flags: ['vask_leash'], stat: { manipulations: 1 } }, result: 'Oliver agrees to every term. He is a patient person. You just showed him what to wait for.' },
    lesson: { law: 33, left: 'Naming a money person in public ends his power. The markets panic with him.', right: 'A secret turns an enemy into a debtor. A debtor who knows you hold his ruin remembers it every time you deal.' },
  },
  {
    id: 'guild_strike', title: 'THE SUPPLIERS STOP SHIPPING', theme: 'fear', char: 'vask', story: true, once: true, when: { anyFlags: ['salt_monopoly', 'vask_resentful'] },
    text: "Every supplier stops shipping at noon. Oliver's partner firms send a polite email asking who will pay them now. He is not on the call. He never is.",
    left: { label: 'Threaten to sue them all', style: 'force', fx: { m: { auth: 6, rep: -6 }, chars: { vask: { resent: 15 } } }, result: 'The shipments restart under legal threat. Everyone is angry, and nobody trusts you.' },
    right: { label: 'Talk about prices and terms', style: 'pragmatism', fx: { m: { res: -8, rep: 4, loy: 3 }, chars: { vask: { trust: 8 } } }, result: 'A fair deal is signed by lunch. Oliver takes a bow he does not mean.' },
    lesson: { law: 9, left: 'Force restarts the shipments. It also teaches suppliers what you do when they ask a question.', right: 'Showing a deal that works ends the standoff and nobody loses face. It is slow, and it lasts.' },
  },
];
