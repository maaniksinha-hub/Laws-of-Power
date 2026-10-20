// Intelligence and the unseen: Ysolde's ledger, the poisoned cup, the Veiled Patron, the Ambassador.

export default [
  // ---- Ysolde ----
  {
    id: 'ysolde_first', title: 'THE PRICE OF TEA', theme: 'secrets', char: 'ysolde', once: true, story: true, when: { turn: [4, null] },
    text: "'Information is the one coin that appreciates,' Ysolde says, stirring tea she will not drink. 'For eight crowns I will tell you who in this room is lying to you. For nothing, I will tell you to be careful.'",
    left: { label: 'Decline', style: 'restraint', fx: { chars: { ysolde: { trust: -4 } }, flags: ['ysolde_declined'] }, result: "'Careful, then,' says Ysolde, and pours you a cup you did not ask for." },
    right: {
      label: 'Pay her', style: 'pragmatism', memo: 'You bought information from Ysolde.',
      fx: { m: { res: -8 }, flags: ['ysolde_customer'] },
      branches: [
        { when: { flags: ['quill_leaker'] }, fx: { reveal: ['quill_leaks'] }, result: "She slides a folded note across the table: the Chamberlain sells the king's schedule. To her, among others." },
        { fx: { reveal: ['agenda_quill'] }, result: "'The chamberlain? Never sells. I have tried.' It is the nearest thing to a compliment she gives anyone." },
      ],
    },
    lesson: { law: 14, left: 'Declining keeps your hands clean and your purse full. You remain a person who does not know what everyone else knows.', right: "Bought information is only as good as the seller's incentives. A broker sells a true thing to you and the same true thing, usually, to others." },
  },
  {
    id: 'ysolde_ledger', title: 'THE LONG ENTRY', theme: 'secrets', char: 'ysolde', story: true, urgent: true, once: true, major: true,
    when: { seen: ['ysolde_first'], stat: { manipulations: [2, null] } },
    text: "'I keep a ledger,' Ysolde says. 'Your name has grown long in it: favours, leverage, a few tidy lies. Others would pay generously to read it. I would much rather be your friend.'",
    left: { label: 'Buy the page', style: 'pragmatism', memo: 'You bought the page of Ysolde\'s ledger that held your name.', fx: { m: { res: -12 }, reveal: ['ledger_page'], chars: { ysolde: { trust: 5 } }, flags: ['ledger_bought'] }, result: 'The page changes hands. Ysolde keeps a copy, as you would have done.' },
    right: {
      label: 'Call her bluff', style: 'force', memo: 'You called Ysolde\'s bluff over the ledger.',
      fx: { reveal: ['ledger_page'] },
      branches: [
        { when: { stat: { manipulations: [3, null] } }, chance: 0.6, fx: { end: 'exposed_manipulator' }, result: 'Ysolde sells the ledger to the highest bidder by morning. Every thread leads to your hand.' },
        { chance: 0.35, fx: { m: { rep: -10 }, flags: ['ledger_leaked'] }, result: 'A page turns up in the council chamber. It is not the worst page, and it is bad enough.' },
      ],
      result: 'She shrugs, and for once seems uncertain. Perhaps she was bluffing.',
    },
    lesson: { law: 5, left: 'Paying to keep a record out of sight is cheaper than defending your name, and it keeps the broker in your story.', right: 'Daring a record-keeper to publish what she holds is a bet that she values her trade more than the sale. Sometimes she does not.' },
  },

  // ---- The Poisoned Cup ----
  {
    id: 'king_ill', title: 'A FEVER THAT ISN\'T', theme: 'secrets', char: 'aubry', others: ['aldric'], story: true, once: true, when: { turn: [9, null] },
    text: "Dr. Aubry closes the door and does not sit. 'The king's wine, {t}. I have treated enough fevers to know this is not one. Someone is seasoning his cup with patience.'",
    left: { label: 'Investigate quietly', style: 'restraint', memo: 'You investigated the king\'s illness in secret.', fx: { m: { res: -5 }, flags: ['poison_known'], chars: { aubry: { trust: 12 } }, queue: [{ id: 'tasting_cup', delay: 4 }] }, result: 'Aubry hands you a small vial and a list of symptoms. You say nothing to anyone.' },
    right: { label: 'Tell the council', style: 'candour', memo: 'You told the council about the poison.', fx: { m: { rep: 4, auth: -4 }, flags: ['poison_public', 'poisoner_alert'], chars: { aubry: { trust: -6 } }, queue: [{ id: 'tasting_cup', delay: 3 }] }, result: 'The council erupts. Everyone is shocked, and some of them are very good actors.' },
    lesson: { law: 3, left: 'Silence keeps the culprit comfortable, and comfortable people repeat their patterns. You bought time with your own safety.', right: 'Telling everyone warns the poisoner as surely as the victim. It also makes you the person who raised the alarm.' },
  },
  {
    id: 'tasting_cup', title: 'THE KING\'S CUP', theme: 'timing', char: 'aldric', others: ['aubry'], story: true, urgent: true, once: true, major: true, when: { seen: ['king_ill'] },
    text: "At the feast the king's cup is passed to you, a courtesy and a mark of favour. Aubry's eyes find yours across the table. The wine smells of cloves, and of something underneath the cloves.",
    left: { label: 'Have a servant taste it first', style: 'restraint', memo: 'You had a servant taste the king\'s cup.', fx: { m: { rep: -3 }, flags: ['poison_confirmed'], reveal: ['poison_cup'], chars: { aldric: { trust: 4 } } }, result: 'The servant falls ill within the hour. The cup tests true. The court is appalled, quietly.' },
    right: {
      label: 'Drink it yourself', style: 'force', memo: 'You drank the king\'s cup.',
      fx: { flags: ['poison_confirmed'], reveal: ['poison_cup'] },
      branches: [
        { when: { flags: ['poison_known'] }, fx: { m: { rep: 8, loy: 6 }, flags: ['poison_survived'] }, result: "Aubry's antidote steadies you. The court watches someone drink poison and live." },
        { when: { notFlags: ['poison_known'] }, chance: 0.3, fx: { end: 'poisoned' }, result: 'The room tilts. The last thing you see is Aubry running, and nobody else.' },
        { fx: { m: { auth: -10, res: -8 } }, result: 'You are carried out grey-faced. The cup tests true. You recover in a week, and the court keeps the story longer.' },
      ],
    },
    lesson: { law: 26, left: 'Using a stand-in keeps your own hands clean, and puts the cost on someone who did not choose it. People notice who was asked to be careful.', right: 'Personal risk is a powerful signal of conviction, and a lethal gamble if you do not know what you are drinking.' },
  },
  {
    id: 'poisoner_unmasked', title: 'WHOSE HAND IN THE CELLAR', theme: 'revenge', char: 'aubry', story: true, urgent: true, once: true, major: true, when: { flags: ['poison_confirmed'], seen: ['tasting_cup'] },
    text: [
      { when: { flags: ['culprit_vask'] }, t: "Aubry has traced the poison to the apothecary who supplies Master Vask. 'He has the motive, a monopoly that dies with the king, and the means. It does not prove he did it. But I would not eat his bread.'" },
      { when: { flags: ['culprit_dorne'] }, t: "Aubry has traced the poison to Lady Dorne's household. 'Her cook bought the herb, and the cook is terrified. The lady herself is serene. Either she is innocent, or she is a magnificent actress.'" },
      "Aubry has traced the poison to the Chamberlain's office. 'Quill's seal opened the cellar door that night. Whether for gold or fear, I cannot say. But it was his key.'",
    ],
    left: { label: 'Arrest the culprit quietly', style: 'restraint', memo: 'You had the king\'s poisoner arrested quietly.', fx: { chars: { $culprit: { status: 'imprisoned', resent: 30 } }, m: { auth: 5, rep: 2 }, flags: ['poison_solved'] }, result: 'The arrest happens in the middle of the night. By morning, the culprit has simply gone missing from the court.' },
    right: { label: 'Present the evidence in council', style: 'candour', memo: 'You presented the poisoner before the council.', fx: { chars: { $culprit: { status: 'imprisoned', resent: 30 } }, m: { rep: 8, loy: 6, auth: 2 }, flags: ['poison_solved', 'conspiracy_exposed'], stat: { conspiracies: 1 } }, result: 'The council watches {culprit} led away. For one afternoon, everyone is on the same side.' },
    lesson: { law: 29, left: 'A quiet arrest ends the threat while leaving unanswered questions, which is where rumours are born.', right: 'A public trial maximises legitimacy, and teaches every would-be poisoner what the next trial will teach them to hide.' },
  },

  // ---- The Veiled Patron ----
  {
    id: 'anonymous_note', title: 'A GREY SEAL', theme: 'opportunity', char: 'isaura', story: true, once: true, when: { turn: [10, null], rank: [1, null], notFlags: ['veiled_patron'] },
    text: "A note beneath your door, sealed in grey wax: 'Your rise was no accident. Your fall need not be one either. Name a place and an hour.' It is written in a hand that has never asked permission.",
    left: { label: 'Ignore the note', style: 'restraint', fx: { flags: ['note_ignored'], chars: { isaura: { resent: 8 } }, queue: [{ id: 'veiled_meeting', delay: 6 }] }, result: 'You burn it. The ash smells faintly of lavender, which is somehow worse.' },
    right: { label: 'Name a place and an hour', style: 'guile', fx: { flags: ['note_answered'], queue: [{ id: 'veiled_meeting', delay: 2 }] }, result: 'The reply is delivered by a stranger who disappears down the stairs before you finish reading it.' },
    lesson: { law: 8, left: 'Letting a mysterious party come to you keeps the initiative. It also makes you the one who has been ignoring a powerful person.', right: 'Choosing the time and place of an unknown meeting seems to give you control. It only matters if you know who you are meeting.' },
  },
  {
    id: 'veiled_meeting', title: 'THE CURTAINED CARRIAGE', theme: 'negotiation', char: 'isaura', story: true, once: true, major: true, when: { anyFlags: ['note_answered', 'note_ignored'] },
    text: [
      { when: { flags: ['note_ignored'] }, t: "The carriage is waiting outside your door this time. 'You were rude not to answer,' says the veiled voice. 'I forgive it once. I can make the council lean your way. All I will ask is a name, when the time comes.'" },
      "A curtained carriage in the cathedral square. The woman inside never lifts her veil. 'I can make the council lean your way,' she says. 'All I will ever ask is a name, when the time comes.'",
    ],
    left: { label: 'Refuse the patron', style: 'candour', memo: 'You refused the Veiled Patron.', fx: { m: { auth: -4 }, chars: { isaura: { resent: 10, trust: -10 } }, flags: ['veiled_refused'] }, result: 'The curtain does not move. The carriage drives away at exactly the speed of a walk.' },
    right: { label: 'Accept her backing', style: 'pragmatism', memo: 'You accepted the Veiled Patron\'s backing.', fx: { m: { auth: 8, rep: 6, res: 6 }, chars: { isaura: { obligation: 40, trust: 10 } }, flags: ['veiled_patron'], queue: [{ id: 'veiled_price', delay: 8 }] }, result: 'By the next council session, three doors that were locked are open.' },
    lesson: { law: 11, left: 'Refusing an unknown benefactor keeps you free, and makes you the fixed point someone must now work around.', right: 'Patronage creates dependence in both directions, but only one of you knows how long the leash is.' },
  },
  {
    id: 'veiled_price', title: 'THE NAME', theme: 'negotiation', char: 'isaura', story: true, urgent: true, once: true, major: true, when: { flags: ['veiled_patron'] },
    text: "The grey seal again. 'The name I mentioned,' says the veiled voice. 'My grand-nephew, a boy of eleven. When the king dies, you will speak for him, and for no one else. I have waited a long time to ask.'",
    left: { label: 'Refuse', style: 'candour', memo: 'You refused the Veiled Patron\'s price.', fx: { m: { auth: -12, rep: -4 }, chars: { isaura: { resent: 30, trust: -20 } }, flags: ['isaura_hostile'], clear: ['veiled_patron'] }, result: 'Doors close in the order they opened. Her favour was a staircase, and she has taken it away.' },
    right: { label: 'Swear to support the boy', style: 'pragmatism', memo: 'You swore to support the Veiled Patron\'s heir.', fx: { m: { loy: -6, auth: 4 }, chars: { isaura: { trust: 15 } }, flags: ['heir_promised'] }, result: 'You swear it in the cathedral shadow. The oath is the first thing you have said that you cannot unsay.' },
    lesson: { law: 40, left: 'Refusing the price loses the benefits already received, and shows others you can say no to the most powerful person in the room.', right: 'The price of free support is revealed last. Paying keeps the protection, and fixes your future choices in someone else\'s plan.' },
  },
  {
    id: 'unveiling', title: 'THE COAT OF ARMS', theme: 'secrets', char: 'isaura', story: true, once: true, when: { turn: [16, null], anyFlags: ['note_answered', 'note_ignored', 'veiled_patron', 'veiled_refused'], notSecret: ['veiled_hand_identity'] },
    text: "The grey carriage passes beneath your window again, curtains tight. A footman stops to tighten a strap, and for the length of a breath the coat of arms is visible on the door. You could follow it.",
    left: { label: 'Let it go', style: 'restraint', fx: { flags: ['mystery_kept'] }, result: 'The carriage turns the corner. Some mysteries are more useful kept.' },
    right: {
      label: 'Follow the carriage', style: 'guile', memo: 'You followed the Veiled Patron\'s carriage.',
      fx: { m: { res: -4 }, reveal: ['veiled_hand_identity'] },
      branches: [{ chance: 0.4, fx: { chars: { isaura: { resent: 10, suspicion: 15 } } }, result: 'It ends at the dowager duchess\'s private door. Her footman looks directly at you. You have been seen.' }],
      result: 'It ends at the private gate of Dowager Duchess Isaura Venn: the king\'s aunt.',
    },
    lesson: { law: 4, left: 'Leaving a secret alone keeps you off a powerful person\'s radar, and keeps you ignorant of the hand moving the pieces.', right: 'Unmasking a patron gives you leverage and a vulnerability. She will wonder what else you have learned.' },
  },

  // ---- Ambassador Sabel ----
  {
    id: 'sabel_gift', title: 'AN ASTROLABE, WITH NO STRINGS', theme: 'negotiation', char: 'sabel', once: true, when: { turn: [7, null] },
    text: "Ambassador Sabel presents a jewelled astrolabe, bowing from the shoulders. 'A token from the Southern League. No obligation, {t}, only friendship.' The clasp of its case is exquisitely made, like most traps.",
    left: { label: 'Refuse the gift', style: 'candour', fx: { m: { rep: 2 }, chars: { sabel: { trust: -8 } } }, result: 'Sabel bows lower. Only a very good diplomat is that gracious about a refusal.' },
    right: { label: 'Accept it', style: 'charm', fx: { m: { res: 6, rep: 2 }, chars: { sabel: { obligation: 25, trust: 8 } }, flags: ['sabel_gift'] }, result: 'It is a lovely thing. You find yourself thinking about it when the Ambassador is in the room.' },
    lesson: { law: 40, left: 'A refused gift keeps accounts clean, and costs a little warmth with someone who offered it to build one.', right: "Accepting 'no strings' costs less than most gifts and more than it looks. The favour is booked even if the invoice is not sent." },
  },
  {
    id: 'sabel_treaty', title: 'A TREATY BY DAWN', theme: 'negotiation', char: 'sabel', others: ['vask'], story: true, once: true, major: true, when: { turn: [14, null] },
    text: [
      { when: { flags: ['sabel_gift'] }, t: "'Sign the trade treaty by dawn,' Sabel says, hand resting lightly on the astrolabe he gave you. 'The League is generous but impatient.' Vask, in the corner, shakes his head very slightly. Vask has his own reasons to dislike a rival." },
      "'Sign the trade treaty by dawn,' Sabel says. 'The League is generous but impatient.' Vask, in the corner, shakes his head very slightly. Vask has his own reasons to dislike a rival.",
    ],
    left: {
      label: 'Seal it now', style: 'pragmatism', memo: 'You sealed the League\'s treaty overnight.',
      fx: { m: { res: 14, rep: 3 } },
      branches: [
        { when: { flags: ['sabel_agent'] }, fx: { flags: ['pass_ceded'], queue: [{ id: 'sabel_betrayal', delay: 6 }] }, result: 'Coin pours in. Somewhere in the fine print is a clause nobody read aloud.' },
        { fx: { m: { rep: 4, res: 4 }, chars: { sabel: { trust: 15 } } }, result: 'The treaty is exactly what it claimed to be. Sabel looks genuinely relieved.' },
      ],
    },
    right: {
      label: 'Delay and investigate', style: 'restraint', memo: 'You delayed the treaty to investigate.',
      fx: { m: { res: -3 }, reveal: ['agenda_sabel'] },
      branches: [
        { when: { flags: ['sabel_agent'] }, fx: { reveal: ['sabel_pass_scheme'], chars: { sabel: { resent: 20, trust: -15 } } }, result: 'Page nine hands the League a road through the mountain pass. Sabel\'s charm thins noticeably.' },
        { fx: { chars: { sabel: { trust: -6 } } }, result: 'The treaty is sound. Sabel is wounded that you doubted him, and not entirely wrong to be.' },
      ],
    },
    lesson: { law: 29, left: 'Signing quickly rewards the party who set the deadline. Whether that was a mistake depends on what was in the clauses.', right: 'Insisting on time to read what you sign is an ordinary right that urgent people treat as an insult. Pressure is a sign.' },
  },
  {
    id: 'sabel_betrayal', title: 'A DOOR, NOT A TREATY', theme: 'revenge', char: 'sabel', others: ['kovane'], story: true, urgent: true, once: true, major: true, when: { flags: ['pass_ceded'] },
    text: "League 'trade inspectors' are in the mountain pass, and there are a great many of them. Kovane storms in with a map. 'You let them have it, {t}. They never needed a treaty. They needed a door.'",
    left: { label: 'Disavow the treaty publicly', style: 'candour', memo: 'You disavowed the League\'s treaty in public.', fx: { m: { rep: -8, auth: 4 }, chars: { kovane: { trust: 15 }, sabel: { status: 'exiled' } }, reveal: ['sabel_pass_scheme'], flags: ['sabel_expelled'], stat: { betrayals: 1 }, note: 'Ambassador Sabel played you with the treaty.' }, result: 'You admit the error in front of the court and expel the Ambassador. Kovane rides for the pass.' },
    right: { label: 'Claim it was planned', style: 'guile', memo: 'You pretended the treaty was a plan.', fx: { m: { auth: -6, rep: -2 }, chars: { kovane: { resent: 15 } }, stat: { betrayals: 1, manipulations: 1 }, note: 'Ambassador Sabel played you with the treaty.' }, result: "You tell the council it's a trap for the League. Nobody believes it, and a few pretend to." },
    lesson: { law: 29, left: 'Owning an error early limits the damage and makes your next claim more believable.', right: 'A bluff that explains away your own mistake works until someone checks the details. Then you have two problems.' },
  },
];
