// Rivalries and money: Lady Dorne, Brother Anselm's reforms, Master Vask's ledgers.

export default [
  // ---- Lady Dorne ----
  {
    id: 'dorne_toast', title: 'A TOAST AT THE FEAST', theme: 'reputation', char: 'dorne', story: true, once: true, when: { turn: [3, null] },
    text: [
      { when: { flags: ['humble_start'] }, t: "At the feast, Lady Dorne stands and lifts her glass. 'To our newest guest, so quiet we almost forgot to be afraid!' People laugh. The king is watching. So is everyone who is not laughing. All eyes turn to you." },
      "At the feast, Lady Dorne stands and lifts her glass. 'To our newest guest, brave enough to sit beside the throne!' People laugh. The king is watching. So is everyone who is not laughing. All eyes turn to you.",
    ],
    left: { label: 'Answer with a toast to the king', style: 'restraint', fx: { m: { rep: 3, loy: 2 }, chars: { aldric: { trust: 6 }, dorne: { trust: -3 } } }, result: 'The king raises his cup a little. Dorne tilts her head, as if reading you.' },
    right: { label: 'Beat her with a sharper joke', style: 'charm', fx: { m: { rep: 8, auth: 2 }, chars: { dorne: { resent: 10, suspicion: 5 }, aldric: { trust: -5 } } }, result: 'The hall roars. Dorne laughs too, and remembers it.' },
    lesson: { law: 1, left: 'Turning the praise to the king looks loyal. But it leaves a charming rival unchallenged.', right: 'Beating a popular rival at her own game wins the room tonight. Tomorrow she will watch you. And the king will remember who outshone him.' },
  },
  {
    id: 'dorne_alliance', title: "THE LADY'S PLAN", theme: 'negotiation', char: 'dorne', others: ['varen'], story: true, once: true, when: { seen: ['dorne_toast'], turn: [8, null] },
    text: "'The council is rotten,' Dorne says behind her fan. 'Back my plan to cut the advisors' pay. Then I will back whatever you ask next. Lord Varen will hate us both. Is that not lovely?'",
    left: { label: 'Say no politely', style: 'restraint', memo: "You said no to Dorne's plan.", fx: { m: { rep: 1 }, chars: { dorne: { trust: -5, resent: 3 } }, flags: ['dorne_declined'] }, result: 'Dorne smiles the way you smile at a shut shop.' },
    right: { label: 'Back her plan', style: 'pragmatism', memo: "You backed Dorne's plan against the advisors.", fx: { m: { rep: 3, auth: 3 }, chars: { dorne: { trust: 15, obligation: 20 }, varen: { resent: 15 } }, rel: [['dorne', 'varen', { rivalry: 10 }]], flags: ['dorne_pact'], queue: [{ id: 'dorne_price', delay: 6 }] }, result: 'The plan passes. Varen is polite about it, which is the scariest thing he could be.' },
    lesson: { law: 20, left: 'Staying free keeps your choices open, and nobody feels they are owed. But you stay outside the group that decides things.', right: 'A deal of convenience is a loan. The favour you took is already growing, in a coin you do not control.' },
  },
  {
    id: 'dorne_price', title: 'THE LADY COLLECTS', theme: 'revenge', char: 'dorne', story: true, once: true, when: { flags: ['dorne_pact'] },
    text: "Dorne comes to collect. 'My cousin Baldric would make a fine keeper of the money,' she says, as if she mentioned the weather. 'You said you would give me what I needed. I wrote it down.'",
    left: { label: 'Refuse the job for her cousin', style: 'candour', memo: 'You refused to repay Dorne\'s favour.', fx: { m: { rep: -2 }, chars: { dorne: { trust: -20, resent: 15 } }, flags: ['dorne_burned'] }, result: "Dorne's smile does not move at all. 'Of course,' she says. 'Honest people are so rare.'" },
    right: { label: 'Give her cousin the job', style: 'pragmatism', memo: 'You gave Dorne\'s cousin the treasury.', fx: { m: { res: -10, auth: -3 }, chars: { dorne: { ambition: 20, trust: 10 } }, flags: ['dorne_treasury'] }, result: 'Baldric is delighted, and good at the job. Now Dorne has a hand in the money box.' },
    lesson: { law: 40, left: 'Refusing a favour you already took costs you the person. It also costs most of the credit for the first deal.', right: 'A favour that comes cheap gets a price later, when it suits her. Paying keeps the peace. It also makes your creditor bigger.' },
  },
  {
    id: 'dorne_scandal', title: "THE LADY'S BANKER", theme: 'secrets', char: 'dorne', others: ['vask'], story: true, once: true, weight: 2,
    when: { turn: [10, null], notFlags: ['dorne_disgraced'], notSecret: ['dorne_vask_funds'] },
    text: "A messenger from a certain tea house leaves a letter with Master Vask's seal. It lists payments for Lady Dorne's free bread, banners and singers. Her popular fame was paid for by a banker.",
    left: {
      label: 'Say nothing and keep it for later', style: 'guile', memo: "You kept Dorne's secret to use later.",
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds', 'leverage_dorne'], queue: [{ id: 'leverage_use', delay: 4 }] },
      result: 'You fold the letter into your sleeve. Power you do not use is power you can still spend.',
    },
    right: {
      label: 'Read it out to the council', style: 'candour', memo: "You read out who paid for Dorne's fame.",
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds'], expose: ['dorne_vask_funds'], chars: { vask: { resent: 12, suspicion: 10 } } },
      result: 'There is silence, then uproar. The crowd learns who has been buying their love.',
    },
    lesson: { law: 33, left: 'Knowing what someone depends on gives you power. Using it spends it. Keeping it makes them look for the leak.', right: 'Telling everyone ends a rival cleanly if your proof is strong. It also makes an enemy of anyone else named.' },
  },
  {
    id: 'leverage_use', title: 'A LOCK BEING TRIED', theme: 'timing', char: 'dorne', story: true, once: true, when: { flags: ['leverage_dorne'], notFlags: ['dorne_disgraced'] },
    text: 'Dorne now glances at you across the hall the way you check a lock. She thinks someone knows something. Everyone wants a hostage. You would rather have a friend.',
    left: { label: 'Let her know that you know', style: 'force', memo: 'You let Dorne know about her banker.', fx: { m: { auth: 5, rep: -2 }, chars: { dorne: { fear: 25, trust: -10, resent: 8 } }, flags: ['dorne_controlled'], stat: { manipulations: 1 } }, result: 'Dorne goes pale, then charming. She will vote with you. She will also remember.' },
    right: {
      label: 'Keep waiting', style: 'restraint', fx: {},
      branches: [{ chance: 0.4, fx: { chars: { dorne: { resent: 25, suspicion: 20 } }, m: { rep: -4 } }, result: 'Ysolde sold your silence to Dorne. Now she smiles at you in a very different way.' }],
      result: 'Nothing happens. That is the point.',
    },
    lesson: { law: 35, left: 'Showing what you know early buys obedience now. But your captive becomes an open enemy with a long memory.', right: 'Waiting makes a secret worth more. But someone else may sell it first.' },
  },

  // ---- Brother Anselm ----
  {
    id: 'anselm_charter', title: 'THE PLAN FOR CHANGE', theme: 'opportunity', char: 'anselm', story: true, once: true, when: { turn: [5, null] },
    text: "Brother Anselm puts a plan on your desk. Lower the church taxes. Open the grain stores in winter. End the special treatment for nobles. 'Do it tomorrow, {t}, or the poor will do it for us.' His hands are stained with ink but steady.",
    left: { label: 'Try it in one province first', style: 'restraint', memo: "You tried Anselm's changes in one province first.", fx: { m: { auth: 2, rep: 2, res: -3 }, chars: { anselm: { trust: 6 } }, flags: ['charter_pilot'], queue: [{ id: 'pamphlet_storm', delay: 4 }] }, result: 'One province gets the new rules. Everyone else gets a good view.' },
    right: { label: 'Back the whole plan', style: 'candour', memo: "You backed all of Anselm's plan.", fx: { m: { rep: 10, auth: -8, res: -8 }, chars: { anselm: { trust: 25 }, varen: { resent: 10 }, dorne: { resent: 4 } }, flags: ['charter_full'], queue: [{ id: 'pamphlet_storm', delay: 3 }] }, result: 'The poor weep with joy. The nobles take notes. Both are getting ready.' },
    lesson: { law: 45, left: 'A small test lets people get used to change before it scares them. It also keeps the reformer on your side while you wait.', right: 'A huge change wins love and makes powerful enemies at once. People accept change more easily when it feels like the old ways.' },
  },
  {
    id: 'pamphlet_storm', title: 'LEAFLETS IN THE SQUARES', theme: 'secrets', char: 'anselm', others: ['vask'], story: true, once: true, when: { seen: ['anselm_charter'] },
    text: 'Overnight, leaflets appear in every square. They call the nobles greedy parasites, in rhyme. They are beautifully printed. Brother Anselm owns one small press. There are twenty thousand copies.',
    left: { label: 'Ban the leaflets', style: 'force', memo: 'You banned the leaflets.', fx: { m: { auth: 5, rep: -6 }, chars: { anselm: { trust: -15 } }, flags: ['pamphlets_banned'] }, result: 'Soldiers tear them down. By the next day, handwritten copies appear, which is worse.' },
    right: { label: 'Find out who printed them', style: 'guile', memo: 'You tracked down the printer of the leaflets.', fx: { m: { res: -4 }, reveal: ['vask_funds_pamphlets'], flags: ['evidence_vask_funds_pamphlets'], queue: [{ id: 'vask_confrontation', delay: 1 }] }, result: 'The trail of receipts ends at a warehouse owned by a firm owned by Master Vask.' },
    lesson: { law: 39, left: "Banning a message spreads it, and gives the reformer a martyr's story.", right: 'Following the money shows who gains from the trouble. The loudest voice is not always the one paying.' },
  },
  {
    id: 'anselm_arrest', title: 'A WARRANT FOR THE PRIEST', theme: 'fear', char: 'anselm', others: ['varen'], story: true, once: true, when: { seen: ['pamphlet_storm'] },
    text: "The nobles want Anselm locked up for plotting against the king. Varen wrote the order before you asked. 'It is only a form,' he says. Outside, a crowd gathers with candles.",
    left: { label: 'Protect Anselm', style: 'candour', memo: 'You protected Anselm from the nobles.', fx: { m: { rep: 4, loy: 4, auth: -5 }, chars: { anselm: { trust: 20 }, varen: { resent: 10 } } }, result: 'You tear the order in two, in front of Varen. Cheers rise from the candlelit crowd outside.' },
    right: { label: 'Sign the order', style: 'force', memo: 'You signed the order against Anselm.', fx: { m: { auth: 6, rep: -8 }, chars: { anselm: { status: 'imprisoned', resent: 20 }, varen: { trust: 8 } }, flags: ['reform_dead'] }, result: 'Anselm is led out calmly. The candles go out one by one.' },
    lesson: { law: 42, left: 'Standing by the leader keeps his followers loyal. It also makes you the next target of the people he scares.', right: "Taking away a movement's leader can break it or fire it up. It depends on who really holds the crowd together." },
  },

  // ---- Master Vask ----
  {
    id: 'vask_loan', title: 'A SMALL LOAN', theme: 'scarcity', char: 'vask', story: true, once: true, when: { turn: [8, null], meter: { res: [null, 55] } },
    text: "The treasury is low, and Master Vask has come to visit. 'A small loan, {t}, and all I want is your good name. I would hate to see the soldiers go unpaid.' He smiles like a man who has already counted the money.",
    left: { label: 'Say no', style: 'restraint', fx: { m: { res: -4, rep: 2, loy: -2 }, chars: { vask: { trust: -6 } } }, result: 'Vask bows. Doors that were open to you are now only unlocked.' },
    right: { label: 'Take the loan', style: 'pragmatism', memo: 'You borrowed money from Vask.', fx: { m: { res: 22 }, chars: { vask: { obligation: 30, trust: 8 } }, flags: ['vask_debt'], queue: [{ id: 'vask_collect', delay: 6 }] }, result: 'The soldiers are paid and the grain stores are full. The ledger has a new, polite line.' },
    lesson: { law: 40, left: 'Saying no keeps you free of the lender. But you face every shortage he warned about.', right: 'A lender is a patient hunter. Free money has a cost that comes later, in another form.' },
  },
  {
    id: 'vask_collect', title: 'THE GREEN BOOK', theme: 'negotiation', char: 'vask', story: true, urgent: true, once: true, major: true, when: { flags: ['vask_debt'] },
    text: "Vask's clerks arrive with a book bound in green. 'I do not need the money today,' he says. 'I would just like to be the only one who sells salt, as a favour. Or the whole sum, if you prefer to be sentimental.'",
    left: { label: 'Give him the salt trade', style: 'pragmatism', memo: 'You gave Vask the salt trade.', fx: { m: { rep: -5 }, chars: { vask: { trust: 15, obligation: -30 } }, clear: ['vask_debt'], flags: ['salt_monopoly'] }, result: 'The debt is gone, the deal is signed, and the price of salt creeps up.' },
    right: {
      label: 'Pay it all back', style: 'candour', memo: 'You paid Vask back in full.',
      fx: { m: { res: -25 }, chars: { vask: { resent: 10, trust: -5, obligation: -30 } }, clear: ['vask_debt'], flags: ['vask_resentful'] },
      branches: [{ when: { meter: { res: [null, 25] } }, fx: { m: { loy: -8, auth: -6 }, chars: { vask: { resent: 15 } } }, result: 'You empty the strongroom and still fall short. You cover the rest with promises. Vask writes them down.' }],
      result: 'The strongroom empties. Vask accepts with the smile of a man who just lost a customer.',
    },
    lesson: { law: 11, left: "A sole right to sell pays your debt with other people's money. It keeps Vask in your debt too. It also makes you his partner in public.", right: 'Paying in full frees you from the lender. It leaves you with an empty treasury and a creditor with nothing to lose.' },
  },
  {
    id: 'vask_confrontation', title: "THE PRINTER'S RECEIPT", theme: 'rivalry', char: 'vask', others: ['anselm'], story: true, urgent: true, once: true, major: true, when: { secret: ['vask_funds_pamphlets'] },
    text: "You put the printer's receipt on Vask's table. He reads it slowly, smiles and pours you wine. 'Nobles are bad at paying their debts,' he says. 'Did you come to thank me, or to shout?'",
    left: { label: 'Name him as the one behind the leaflets', style: 'candour', memo: 'You named Vask as the man behind the leaflets.', fx: { expose: ['vask_funds_pamphlets'] }, result: 'The guild hall goes quiet as the receipt is read aloud. Vask is led out, still smiling.' },
    right: { label: 'Use it to make a deal', style: 'guile', memo: 'You made a deal with Vask over the receipt.', fx: { m: { res: 12, auth: 3 }, chars: { vask: { fear: 25, resent: 20, trust: -10 } }, flags: ['vask_leash'], stat: { manipulations: 1 } }, result: 'Vask agrees to every term. He is a patient man. You just showed him what to wait for.' },
    lesson: { law: 33, left: 'Naming a money man in public ends his power. The markets panic with him.', right: 'A secret turns an enemy into a debtor. A debtor who knows you hold his ruin remembers it every time you deal.' },
  },
  {
    id: 'guild_strike', title: 'THE SHUTTERS COME DOWN', theme: 'fear', char: 'vask', story: true, once: true, when: { anyFlags: ['salt_monopoly', 'vask_resentful'] },
    text: "Every guild shop in the city closes at noon. Vask's workers stand on the palace steps and politely ask who will pay the soldiers now. He is not in the crowd. He never is.",
    left: { label: 'End the strike with the guard', style: 'force', fx: { m: { auth: 6, rep: -6 }, chars: { vask: { resent: 15 } } }, result: 'The shutters go up at spear point. The markets open, and nobody buys anything.' },
    right: { label: 'Talk about pay and taxes', style: 'pragmatism', fx: { m: { res: -8, rep: 4, loy: 3 }, chars: { vask: { trust: 8 } } }, result: 'A fair deal is signed by lunch. Vask takes a bow he does not mean.' },
    lesson: { law: 9, left: 'Force reopens the shops. It also teaches the guilds what you do when they ask a question.', right: 'Showing a deal that works ends the standoff and nobody loses face. It is slow, and it lasts.' },
  },
];
