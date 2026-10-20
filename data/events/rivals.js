// Rivalries and money: Lady Dorne, Brother Anselm's reforms, Master Vask's ledgers.

export default [
  // ---- Lady Dorne ----
  {
    id: 'dorne_toast', title: 'A TOAST AT THE BANQUET', theme: 'reputation', char: 'dorne', story: true, once: true, when: { turn: [3, null] },
    text: [
      { when: { flags: ['humble_start'] }, t: "At the banquet Lady Dorne rises, glass lifted. 'To our newest guest, so quiet we nearly forgot to be afraid!' Laughter. The king is watching, and so is everyone who is not laughing. All eyes turn to you." },
      "At the banquet Lady Dorne rises, glass lifted. 'To our newest guest, bold enough to sit beside the throne!' Laughter. The king is watching, and so is everyone who is not laughing. All eyes turn to you.",
    ],
    left: { label: 'Answer with a toast to the king', style: 'restraint', fx: { m: { rep: 3, loy: 2 }, chars: { aldric: { trust: 6 }, dorne: { trust: -3 } } }, result: 'The king raises his cup a fraction. Dorne tilts her head as if reading you.' },
    right: { label: 'Out-toast her with a sharper wit', style: 'charm', fx: { m: { rep: 8, auth: 2 }, chars: { dorne: { resent: 10, suspicion: 5 }, aldric: { trust: -5 } } }, result: 'The hall roars. Dorne laughs too, and files it away.' },
    lesson: { law: 1, left: 'Deflecting the spotlight to the king looks like loyalty. It also leaves a charismatic rival unchallenged.', right: 'Beating a popular rival at her own game wins the room tonight and makes you her focus tomorrow. It also reminds the king of who is not him.' },
  },
  {
    id: 'dorne_alliance', title: "THE LADY'S MOTION", theme: 'negotiation', char: 'dorne', others: ['varen'], story: true, once: true, when: { seen: ['dorne_toast'], turn: [8, null] },
    text: "'The council is rotting,' Dorne says, behind her fan. 'Back my motion to cut the advisors' stipends, and I will back whatever you propose next. Lord Varen will hate us both. Isn't that delightful?'",
    left: { label: 'Decline politely', style: 'restraint', memo: 'You declined Dorne\'s motion.', fx: { m: { rep: 1 }, chars: { dorne: { trust: -5, resent: 3 } }, flags: ['dorne_declined'] }, result: 'Dorne smiles as one smiles at a closed shop.' },
    right: { label: 'Back her motion', style: 'pragmatism', memo: 'You backed Dorne\'s motion against the advisors.', fx: { m: { rep: 3, auth: 3 }, chars: { dorne: { trust: 15, obligation: 20 }, varen: { resent: 15 } }, rel: [['dorne', 'varen', { rivalry: 10 }]], flags: ['dorne_pact'], queue: [{ id: 'dorne_price', delay: 6 }] }, result: 'The motion passes. Varen is gracious, which is the most alarming option available.' },
    lesson: { law: 20, left: 'Staying uncommitted keeps your options open and nobody feels indebted. It also keeps you out of the coalition that decides things.', right: 'An alliance of convenience is a loan. The favour you accepted is already accruing interest, and in a currency you do not control.' },
  },
  {
    id: 'dorne_price', title: 'THE LADY COLLECTS', theme: 'revenge', char: 'dorne', story: true, once: true, when: { flags: ['dorne_pact'] },
    text: "Dorne comes to collect. 'My cousin Baldric would make an excellent Master of the Coin,' she says, as if recalling a mild preference. 'You did say whatever I needed. I wrote it down.'",
    left: { label: 'Refuse the appointment', style: 'candour', memo: 'You refused to repay Dorne\'s favour.', fx: { m: { rep: -2 }, chars: { dorne: { trust: -20, resent: 15 } }, flags: ['dorne_burned'] }, result: "Dorne's smile does not move at all. 'Of course,' she says. 'Honesty is so rare.'" },
    right: { label: 'Appoint her cousin', style: 'pragmatism', memo: 'You gave Dorne\'s cousin the treasury.', fx: { m: { res: -10, auth: -3 }, chars: { dorne: { ambition: 20, trust: 10 } }, flags: ['dorne_treasury'] }, result: 'Baldric is delighted, and surprisingly competent. Dorne now has a hand in the strongbox.' },
    lesson: { law: 40, left: "Refusing a favour you have already taken costs you the person, and most of the credit for the original deal.", right: "A favour that arrives cheaply is priced later, and at her convenience. Paying keeps the peace and enlarges your creditor." },
  },
  {
    id: 'dorne_scandal', title: "THE LADY'S CREDITOR", theme: 'secrets', char: 'dorne', others: ['vask'], story: true, once: true, weight: 2,
    when: { turn: [10, null], notFlags: ['dorne_disgraced'], notSecret: ['dorne_vask_funds'] },
    text: "A courier from a certain tea-house leaves a letter bearing Master Vask's seal. It lists payments to Lady Dorne's bread doles, banners and balladeers. Her beloved populism has a banker, and the banker has a ledger.",
    left: {
      label: 'Say nothing; keep it as leverage', style: 'guile', memo: 'You kept Dorne\'s secret as leverage.',
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds', 'leverage_dorne'], queue: [{ id: 'leverage_use', delay: 4 }] },
      result: 'You fold the letter into your sleeve. Power you do not use is power you can still spend.',
    },
    right: {
      label: 'Read it out in council', style: 'candour', memo: 'You read Dorne\'s financing out in council.',
      fx: { reveal: ['dorne_vask_funds'], flags: ['evidence_dorne_vask_funds'], expose: ['dorne_vask_funds'], chars: { vask: { resent: 12, suspicion: 10 } } },
      result: 'Silence, then uproar. The crowd learns who has been buying their love.',
    },
    lesson: { law: 33, left: "Knowing someone's dependency is leverage. Using it spends it, and keeping it invites them to look for the leak.", right: 'Public exposure ends a rival cleanly when the proof is solid, and creates a new enemy in whoever else was named.' },
  },
  {
    id: 'leverage_use', title: 'A LOCK BEING CHECKED', theme: 'timing', char: 'dorne', story: true, once: true, when: { flags: ['leverage_dorne'], notFlags: ['dorne_disgraced'] },
    text: "Dorne has started to glance at you across the hall the way one checks a lock. She suspects someone knows something. Everyone needs a hostage; you would rather have a friend.",
    left: { label: 'Let her know you know', style: 'force', memo: 'You let Dorne know about her financier.', fx: { m: { auth: 5, rep: -2 }, chars: { dorne: { fear: 25, trust: -10, resent: 8 } }, flags: ['dorne_controlled'], stat: { manipulations: 1 } }, result: 'Dorne goes pale, then charming. She will vote with you. She will also remember.' },
    right: {
      label: 'Keep waiting', style: 'restraint', fx: {},
      branches: [{ chance: 0.4, fx: { chars: { dorne: { resent: 25, suspicion: 20 } }, m: { rep: -4 } }, result: 'Ysolde sold your silence to Dorne. She smiles at you now in a very different way.' }],
      result: 'Nothing happens, which is exactly the point.',
    },
    lesson: { law: 35, left: 'Revealing leverage early buys compliance now. The hostage-taker becomes a visible enemy with a long memory.', right: 'Patience keeps a secret worth more, and carries the risk that someone else sells it first.' },
  },

  // ---- Brother Anselm ----
  {
    id: 'anselm_charter', title: 'THE CHARTER', theme: 'opportunity', char: 'anselm', story: true, once: true, when: { turn: [5, null] },
    text: "Brother Anselm lays a charter on your desk: cap the tithes, open the granaries in winter, end the noble exemptions. 'Tomorrow, {t}, or the poor will do it for us.' His hands are ink-stained and steady.",
    left: { label: 'Pilot it in one province', style: 'restraint', memo: 'You piloted Anselm\'s reforms in a single province.', fx: { m: { auth: 2, rep: 2, res: -3 }, chars: { anselm: { trust: 6 } }, flags: ['charter_pilot'], queue: [{ id: 'pamphlet_storm', delay: 4 }] }, result: 'One province gets the new rules. Everyone else gets a very good view.' },
    right: { label: 'Endorse the whole charter', style: 'candour', memo: 'You endorsed Anselm\'s full charter.', fx: { m: { rep: 10, auth: -8, res: -8 }, chars: { anselm: { trust: 25 }, varen: { resent: 10 }, dorne: { resent: 4 } }, flags: ['charter_full'], queue: [{ id: 'pamphlet_storm', delay: 3 }] }, result: 'The poor weep. The nobles take notes. Both reactions are, in their way, preparations.' },
    lesson: { law: 45, left: 'A pilot lets people grow accustomed to change before it threatens them, and keeps the reformer on your side while you wait.', right: 'Sweeping reform wins love and makes powerful enemies in a single stroke. Changes that feel like continuity provoke far less resistance.' },
  },
  {
    id: 'pamphlet_storm', title: 'PAMPHLETS IN THE SQUARES', theme: 'secrets', char: 'anselm', others: ['vask'], story: true, once: true, when: { seen: ['anselm_charter'] },
    text: "Overnight, pamphlets appear in every square, calling the nobility parasites in rhyme. They are beautifully printed. Brother Anselm owns one handpress. There are twenty thousand copies.",
    left: { label: 'Ban the pamphlets', style: 'force', memo: 'You banned the pamphlets.', fx: { m: { auth: 5, rep: -6 }, chars: { anselm: { trust: -15 } }, flags: ['pamphlets_banned'] }, result: 'Soldiers tear them down. Within a day, handwritten copies appear, which is worse.' },
    right: { label: 'Trace the printer', style: 'guile', memo: 'You traced the printer behind the pamphlets.', fx: { m: { res: -4 }, reveal: ['vask_funds_pamphlets'], flags: ['evidence_vask_funds_pamphlets'], queue: [{ id: 'vask_confrontation', delay: 1 }] }, result: 'The receipt trail ends in a warehouse owned by a company owned by Master Vask.' },
    lesson: { law: 39, left: 'Suppressing a message amplifies it, and hands the reformer a martyr\'s story.', right: 'Following the money tells you who benefits from the chaos. The loudest voice is not always the one paying.' },
  },
  {
    id: 'anselm_arrest', title: 'A WARRANT FOR THE PRIEST', theme: 'fear', char: 'anselm', others: ['varen'], story: true, once: true, when: { seen: ['pamphlet_storm'] },
    text: "The nobles want Anselm arrested for sedition. Varen has drafted the warrant before you asked. 'Only a formality,' he says. Outside, a crowd is already gathering with candles.",
    left: { label: 'Protect Anselm', style: 'candour', memo: 'You protected Anselm from the nobles.', fx: { m: { rep: 4, loy: 4, auth: -5 }, chars: { anselm: { trust: 20 }, varen: { resent: 10 } } }, result: 'You tear the warrant in two, in front of Varen. Candle-light cheers outside.' },
    right: { label: 'Sign the warrant', style: 'force', memo: 'You signed the warrant against Anselm.', fx: { m: { auth: 6, rep: -8 }, chars: { anselm: { status: 'imprisoned', resent: 20 }, varen: { trust: 8 } }, flags: ['reform_dead'] }, result: 'Anselm is led out calmly. The candles gutter one by one.' },
    lesson: { law: 42, left: 'Standing by the shepherd keeps the flock loyal, and makes you the next target of those he scares.', right: 'Removing a movement\'s leader can scatter it or galvanise it. Whether it works depends on who really holds the crowd together.' },
  },

  // ---- Master Vask ----
  {
    id: 'vask_loan', title: 'A MODEST LOAN', theme: 'scarcity', char: 'vask', story: true, once: true, when: { turn: [8, null], meter: { res: [null, 55] } },
    text: "The treasury is thin, and Master Vask has come to call. 'A modest loan, {t}, with no collateral but your good name. I would hate to see the soldiers go unpaid.' He smiles like a man who has already counted it.",
    left: { label: 'Decline', style: 'restraint', fx: { m: { res: -4, rep: 2, loy: -2 }, chars: { vask: { trust: -6 } } }, result: 'Vask bows. Doors that were open to you are now merely unlocked.' },
    right: { label: 'Accept the loan', style: 'pragmatism', memo: 'You borrowed from Vask.', fx: { m: { res: 22 }, chars: { vask: { obligation: 30, trust: 8 } }, flags: ['vask_debt'], queue: [{ id: 'vask_collect', delay: 6 }] }, result: 'The soldiers are paid, the granaries are stocked, and the ledger has a new, polite entry.' },
    lesson: { law: 40, left: 'Refusing the money keeps you free of the lender, and exposes you to every shortage he warned about.', right: 'A lender is a patient predator. The cost of free money arrives later and in a different form.' },
  },
  {
    id: 'vask_collect', title: 'THE GREEN LEDGER', theme: 'negotiation', char: 'vask', story: true, urgent: true, once: true, major: true, when: { flags: ['vask_debt'] },
    text: "Vask's clerks arrive with a ledger bound in green. 'I do not need repayment today,' he says. 'I would merely like the salt trade, as a courtesy. Or the entire sum, if you prefer to be sentimental.'",
    left: { label: 'Grant the salt monopoly', style: 'pragmatism', memo: 'You gave Vask the salt trade.', fx: { m: { rep: -5 }, chars: { vask: { trust: 15, obligation: -30 } }, clear: ['vask_debt'], flags: ['salt_monopoly'] }, result: 'The debt is cancelled, the monopoly is signed, and the price of salt takes a quiet step upward.' },
    right: {
      label: 'Repay in full', style: 'candour', memo: 'You repaid Vask in full.',
      fx: { m: { res: -25 }, chars: { vask: { resent: 10, trust: -5, obligation: -30 } }, clear: ['vask_debt'], flags: ['vask_resentful'] },
      branches: [{ when: { meter: { res: [null, 25] } }, fx: { m: { loy: -8, auth: -6 }, chars: { vask: { resent: 15 } } }, result: 'You empty the strongroom and still fall short. The rest you cover with promises, which Vask writes down.' }],
      result: 'The strongroom empties. Vask accepts it with the smile of a man who has lost a customer.',
    },
    lesson: { law: 11, left: 'A monopoly pays a debt with someone else\'s money, and keeps Vask dependent on your goodwill. It also makes you his partner in public.', right: 'Paying in full frees you from the lender, and leaves you with an empty treasury and a creditor who now has nothing to lose.' },
  },
  {
    id: 'vask_confrontation', title: "THE PRINTER'S RECEIPT", theme: 'rivalry', char: 'vask', others: ['anselm'], story: true, urgent: true, once: true, major: true, when: { secret: ['vask_funds_pamphlets'] },
    text: "You lay the printer's receipt on Vask's table. He reads it without hurry, smiles, and pours you wine. 'Nobles make poor borrowers,' he says. 'Were you planning to thank me, or to shout?'",
    left: { label: 'Expose him as the pamphleteer', style: 'candour', memo: 'You exposed Vask as the man behind the pamphlets.', fx: { expose: ['vask_funds_pamphlets'] }, result: 'The guild hall falls silent as the receipt is read aloud. Vask is escorted out, still smiling.' },
    right: { label: 'Use it to bargain', style: 'guile', memo: 'You bargained with Vask over the receipt.', fx: { m: { res: 12, auth: 3 }, chars: { vask: { fear: 25, resent: 20, trust: -10 } }, flags: ['vask_leash'], stat: { manipulations: 1 } }, result: 'Vask agrees to every term. He is a patient man, and you have just taught him what he is waiting for.' },
    lesson: { law: 33, left: 'Public exposure ends a money-man\'s influence, and the markets panic along with him.', right: 'Leverage turns an enemy into a debtor. A debtor who knows you hold his ruin remembers it at every transaction.' },
  },
  {
    id: 'guild_strike', title: 'THE SHUTTERS COME DOWN', theme: 'fear', char: 'vask', story: true, once: true, when: { anyFlags: ['salt_monopoly', 'vask_resentful'] },
    text: "Every guild shop in the capital closes at noon. Vask's apprentices are on the palace steps, politely asking who will pay the soldiers now. He is not in the crowd. He never is.",
    left: { label: 'Break the strike with the guard', style: 'force', fx: { m: { auth: 6, rep: -6 }, chars: { vask: { resent: 15 } } }, result: 'The shutters go up under spears. The markets reopen and nobody buys anything.' },
    right: { label: 'Negotiate wages and tariffs', style: 'pragmatism', fx: { m: { res: -8, rep: 4, loy: 3 }, chars: { vask: { trust: 8 } } }, result: 'A fair settlement is signed by lunchtime. Vask takes a bow he does not mean.' },
    lesson: { law: 9, left: 'Force reopens the shops and teaches the guilds what you do when asked a question.', right: 'Showing a workable deal ends the standoff without anyone losing face. It is slow, and it holds.' },
  },
];
