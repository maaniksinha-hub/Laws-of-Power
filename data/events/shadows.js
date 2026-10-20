// Intelligence and the unseen: Ysolde's ledger, the poisoned cup, the Veiled Patron, the Ambassador.

export default [
  // ---- Ysolde ----
  {
    id: 'ysolde_first', title: 'COFFEE WITH YARA', theme: 'secrets', char: 'ysolde', once: true, story: true, when: { turn: [4, null] },
    text: "'News is the one thing that grows in value,' says Yara, stirring a coffee she will not drink. 'For one big favour I will tell you who in this building is lying to you. For free, I will tell you to be careful.'",
    left: { label: 'Say no', style: 'restraint', fx: { chars: { ysolde: { trust: -4 } }, flags: ['ysolde_declined'] }, result: "'Careful, then,' says Yara, and slides you a coffee you did not ask for." },
    right: {
      label: 'Do her the favour', style: 'pragmatism', memo: 'You bought a secret from Yara.',
      fx: { m: { res: -8 }, flags: ['ysolde_customer'] },
      branches: [
        { when: { flags: ['quill_leaker'] }, fx: { reveal: ['quill_leaks'] }, result: "She slides over a folded note. The head of the CEO's office sells the CEO's daily plans. To her, and to others." },
        { fx: { reveal: ['agenda_quill'] }, result: "'Quentin? He never sells. I have tried.' It is the nearest thing to praise she gives anyone." },
      ],
    },
    lesson: { law: 14, left: 'Saying no keeps your hands clean and your favours free. But you stay the one who does not know what everyone else knows.', right: "Bought news is only as good as the seller's reasons. A broker will sell the same true thing to you and to others." },
  },
  {
    id: 'ysolde_ledger', title: 'THE LONG THREAD', theme: 'secrets', char: 'ysolde', story: true, urgent: true, once: true, major: true,
    when: { seen: ['ysolde_first'], stat: { manipulations: [2, null] } },
    text: "'I keep screenshots,' says Yara. 'Your name has a long thread now. Favours, pressure, a few neat lies. Others would pay well to read it. I would much rather be your friend.'",
    left: { label: 'Buy the screenshots', style: 'pragmatism', memo: 'You bought the screenshots that had your name.', fx: { m: { res: -12 }, reveal: ['ledger_page'], chars: { ysolde: { trust: 5 } }, flags: ['ledger_bought'] }, result: 'The files change hands. Yara keeps a copy, as you would have done.' },
    right: {
      label: 'Call her bluff', style: 'force', memo: "You called Yara's bluff about the screenshots.",
      fx: { reveal: ['ledger_page'] },
      branches: [
        { when: { stat: { manipulations: [3, null] } }, chance: 0.6, fx: { end: 'exposed_manipulator' }, result: 'Yara sells the thread to the highest buyer by morning. Every message leads back to you.' },
        { chance: 0.35, fx: { m: { rep: -10 }, flags: ['ledger_leaked'] }, result: 'A few screenshots turn up in the leadership chat. It is not the worst page. It is bad enough.' },
      ],
      result: 'She shrugs, and for once she looks unsure. Maybe she was bluffing.',
    },
    lesson: { law: 5, left: 'Paying to keep a record hidden costs less than defending your name. It also keeps the broker in your story.', right: 'Daring a record keeper to publish bets that she values her trade more than the sale. Sometimes she does not.' },
  },

  // ---- The Poisoned Cup ----
  {
    id: 'king_ill', title: 'THE NUMBERS ARE OFF', theme: 'secrets', char: 'aubry', others: ['aldric'], story: true, once: true, when: { turn: [9, null] },
    text: "Lucas shuts the door and does not sit. 'The quarterly numbers. I have audited many reports. This one is wrong. Someone is changing the figures a little each week.'",
    left: { label: 'Look into it quietly', style: 'restraint', memo: 'You looked into the numbers in secret.', fx: { m: { res: -5 }, flags: ['poison_known'], chars: { aubry: { trust: 12 } }, queue: [{ id: 'tasting_cup', delay: 4 }] }, result: 'Lucas gives you a spreadsheet and a list of odd entries. You tell no one.' },
    right: { label: 'Tell the leadership team', style: 'candour', memo: 'You told the leadership team about the numbers.', fx: { m: { rep: 4, auth: -4 }, flags: ['poison_public', 'poisoner_alert'], chars: { aubry: { trust: -6 } }, queue: [{ id: 'tasting_cup', delay: 3 }] }, result: 'The room erupts. Everyone looks shocked. Some of them are very good actors.' },
    lesson: { law: 3, left: 'Staying silent keeps the guilty one comfortable, and comfortable people repeat their habits. You bought time with your own safety.', right: 'Telling everyone warns the one who changed the numbers as well as the victim. It also makes you the person who raised the alarm.' },
  },
  {
    id: 'tasting_cup', title: 'THE REPORT TO SIGN', theme: 'timing', char: 'aldric', others: ['aubry'], story: true, urgent: true, once: true, major: true, when: { seen: ['king_ill'] },
    text: "Before the board meeting, the CEO hands you the quarterly report. It is a kind gesture and a sign of trust. Lucas's eyes find yours across the room. The numbers look perfect. A little too perfect.",
    left: { label: 'Ask an analyst to check it first', style: 'restraint', memo: "You had an analyst check the CEO's report.", fx: { m: { rep: -3 }, flags: ['poison_confirmed'], reveal: ['poison_cup'], chars: { aldric: { trust: 4 } } }, result: 'The analyst finds errors within the hour. The report was bad. The office is shocked, quietly.' },
    right: {
      label: 'Sign it yourself', style: 'force', memo: "You signed the CEO's report.",
      fx: { flags: ['poison_confirmed'], reveal: ['poison_cup'] },
      branches: [
        { when: { flags: ['poison_known'] }, fx: { m: { rep: 8, loy: 6 }, flags: ['poison_survived'] }, result: "Lucas's notes keep you safe. The board watches someone sign a clean report with proof behind it." },
        { when: { notFlags: ['poison_known'] }, chance: 0.3, fx: { end: 'poisoned' }, result: 'You sign. Later, the report is found false. The last thing you see is Lucas walking away, and nobody else.' },
        { fx: { m: { auth: -10, res: -8 } }, result: 'You are called in, grey in the face. The report was bad. You clear your name in a week. The office tells the story for much longer.' },
      ],
    },
    lesson: { law: 26, left: 'A second check keeps your own hands clean, but someone else does the work, and they did not choose it. People notice who was told to be careful.', right: 'Signing yourself shows strong belief. It can also end your career if you do not know what you are signing.' },
  },
  {
    id: 'poisoner_unmasked', title: 'WHO CHANGED THE FIGURES', theme: 'revenge', char: 'aubry', story: true, urgent: true, once: true, major: true, when: { flags: ['poison_confirmed'], seen: ['tasting_cup'] },
    text: [
      { when: { flags: ['culprit_vask'] }, t: "Lucas has traced the changes to the finance team Oliver Vasquez set up. 'He has a reason. A weak quarter gives him more control. He has the means too. That is not proof. But I would check his invoices.'" },
      { when: { flags: ['culprit_dorne'] }, t: "Lucas has traced the changes to Selena's sales team. 'Her top manager entered the numbers, and he is terrified. Selena is calm. Either she is innocent, or she is a great actress.'" },
      "Lucas has traced the changes to the CEO's office. 'Quentin's login made the edits that night. Was it for money or from fear? I cannot say. But it was his login.'",
    ],
    left: { label: 'Remove the guilty one quietly', style: 'restraint', memo: 'You had the person behind the numbers removed quietly.', fx: { chars: { $culprit: { status: 'imprisoned', resent: 30 } }, m: { auth: 5, rep: 2 }, flags: ['poison_solved'] }, result: 'It happens in a quiet meeting on Friday. By Monday, the guilty one has simply left the company.' },
    right: { label: 'Show the proof to the board', style: 'candour', memo: 'You showed the board who changed the numbers.', fx: { chars: { $culprit: { status: 'imprisoned', resent: 30 } }, m: { rep: 8, loy: 6, auth: 2 }, flags: ['poison_solved', 'conspiracy_exposed'], stat: { conspiracies: 1 } }, result: 'The board watches {culprit} being walked out. For one afternoon, everyone is on the same side.' },
    lesson: { law: 29, left: 'A quiet exit ends the danger but leaves questions. Rumours grow from questions.', right: 'A public hearing gives you the most right to act. It also teaches the next cheat what to hide.' },
  },

  // ---- The Veiled Patron ----
  {
    id: 'anonymous_note', title: 'A QUIET INVITE FROM THE BOARD', theme: 'opportunity', char: 'isaura', story: true, once: true, when: { turn: [10, null], rank: [1, null], notFlags: ['veiled_patron'] },
    text: "A calendar invite arrives from a private address, titled 'Coffee, 20 min'. The note says: 'Your rise was noticed. Your next step does not have to be luck. Pick a time.' It is signed with two letters only, I.V.",
    left: { label: 'Ignore the message', style: 'restraint', fx: { flags: ['note_ignored'], chars: { isaura: { resent: 8 } }, queue: [{ id: 'veiled_meeting', delay: 6 }] }, result: 'You decline the invite. The next day, your name comes up in a board meeting, which is somehow worse.' },
    right: { label: 'Name a place and a time', style: 'guile', fx: { flags: ['note_answered'], queue: [{ id: 'veiled_meeting', delay: 2 }] }, result: 'You accept. The reply says to come alone, to a small cafe two streets from the office.' },
    lesson: { law: 8, left: 'Not answering keeps the first move. But you are now ignoring someone who sits very near the top.', right: 'Picking the time and place feels like control. It only helps if you know who you are meeting.' },
  },
  {
    id: 'veiled_meeting', title: 'THE COFFEE WITH NO NAME', theme: 'negotiation', char: 'isaura', story: true, once: true, major: true, when: { anyFlags: ['note_answered', 'note_ignored'] },
    text: [
      { when: { flags: ['note_ignored'] }, t: "A woman is waiting in the lobby this time. 'It was rude not to answer,' she says. 'I forgive it once. I can make the board lean your way. All I will ask is a name, when the time comes.'" },
      "A woman is waiting at a back table in the cafe. She does not give her name. 'I can make the board lean your way,' she says. 'All I will ever ask is a name, when the time comes.'",
    ],
    left: { label: 'Refuse the helper', style: 'candour', memo: 'You refused the Silent Sponsor.', fx: { m: { auth: -4 }, chars: { isaura: { resent: 10, trust: -10 } }, flags: ['veiled_refused'] }, result: 'She finishes her tea, leaves cash on the table and goes, exactly on time.' },
    right: { label: 'Accept her help', style: 'pragmatism', memo: "You accepted the Silent Sponsor's help.", fx: { m: { auth: 8, rep: 6, res: 6 }, chars: { isaura: { obligation: 40, trust: 10 } }, flags: ['veiled_patron'], queue: [{ id: 'veiled_price', delay: 8 }] }, result: 'By the next board meeting, three locked doors are open.' },
    lesson: { law: 11, left: 'Refusing an unknown helper keeps you free. It also makes you a fixed point that someone must now work around.', right: 'A helper makes you depend on her, and she depends on you. But only she knows how long the leash is.' },
  },
  {
    id: 'veiled_price', title: 'THE NAME', theme: 'negotiation', char: 'isaura', story: true, urgent: true, once: true, major: true, when: { flags: ['veiled_patron'] },
    text: "She calls you at your desk. 'The name I mentioned,' she says. 'My nephew, a young vice president. When the CEO steps down, you will back him and no one else. I have waited a long time to ask.'",
    left: { label: 'Refuse', style: 'candour', memo: "You refused the Silent Sponsor's price.", fx: { m: { auth: -12, rep: -4 }, chars: { isaura: { resent: 30, trust: -20 } }, flags: ['isaura_hostile'], clear: ['veiled_patron'] }, result: 'Doors close in the order they opened. Her favour was a staircase, and she has taken it away.' },
    right: { label: 'Promise to back her nephew', style: 'pragmatism', memo: "You promised to back the Silent Sponsor's pick.", fx: { m: { loy: -6, auth: 4 }, chars: { isaura: { trust: 15 } }, flags: ['heir_promised'] }, result: 'You agree on the phone. It is the first thing you cannot take back.' },
    lesson: { law: 40, left: 'Refusing the price loses what you already gained. It also shows others you can say no to the most powerful person in the room.', right: "The price of free help is shown last. Paying keeps you safe. It also ties your future choices to someone else's plan." },
  },
  {
    id: 'unveiling', title: 'THE NAME ON THE BADGE', theme: 'secrets', char: 'isaura', story: true, once: true, when: { turn: [16, null], anyFlags: ['note_answered', 'note_ignored', 'veiled_patron', 'veiled_refused'], notSecret: ['veiled_hand_identity'] },
    text: 'You pass her in the lobby again. This time her visitor badge flips over on her coat. For one breath, you can read a name and a floor. You could follow her.',
    left: { label: 'Let it go', style: 'restraint', fx: { flags: ['mystery_kept'] }, result: 'The lift doors close. Some mysteries are more useful when left alone.' },
    right: {
      label: 'Follow her upstairs', style: 'guile', memo: "You followed the Silent Sponsor upstairs.",
      fx: { m: { res: -4 }, reveal: ['veiled_hand_identity'] },
      branches: [{ chance: 0.4, fx: { chars: { isaura: { resent: 10, suspicion: 15 } } }, result: "It ends at the Chair's private door. Her assistant looks straight at you. You have been seen." }],
      result: 'It ends at the private entrance of Isabel Venn, Chair of the Board.',
    },
    lesson: { law: 4, left: "Leaving a secret alone keeps you off a powerful person's list. It also keeps you blind to the hand that moves the pieces.", right: 'Finding out who a helper is gives you power and a weakness. She will wonder what else you have learned.' },
  },

  // ---- Ambassador Sabel ----
  {
    id: 'sabel_gift', title: 'A GIFT WITH NO STRINGS', theme: 'negotiation', char: 'sabel', once: true, when: { turn: [7, null] },
    text: "Imre from Southline Group hands you a premium tablet and a free pilot of his software. 'A gift from Southline. No strings, only friendship.' The box is beautifully made, like most traps.",
    left: { label: 'Refuse the gift', style: 'candour', fx: { m: { rep: 2 }, chars: { sabel: { trust: -8 } } }, result: 'Imre nods. Only a very good salesperson is so kind about a refusal.' },
    right: { label: 'Accept it', style: 'charm', fx: { m: { res: 6, rep: 2 }, chars: { sabel: { obligation: 25, trust: 8 } }, flags: ['sabel_gift'] }, result: 'It is a lovely thing. You find yourself thinking of it whenever Imre is in the room.' },
    lesson: { law: 40, left: 'Refusing a gift keeps things clean. It costs a little warmth with someone who offered it to build some.', right: 'A gift with "no strings" costs less than most and more than it seems. You owe the favour even if the bill never comes.' },
  },
  {
    id: 'sabel_treaty', title: 'A CONTRACT BY MORNING', theme: 'negotiation', char: 'sabel', others: ['vask'], story: true, once: true, major: true, when: { turn: [14, null] },
    text: [
      { when: { flags: ['sabel_gift'] }, t: "'Sign the partnership contract by morning,' says Imre, resting a hand on the tablet he gave you. 'Southline is generous but in a hurry.' In the corner, Oliver shakes his head slightly. Oliver has his own reasons to dislike a rival." },
      "'Sign the partnership contract by morning,' says Imre. 'Southline is generous but in a hurry.' In the corner, Oliver shakes his head slightly. Oliver has his own reasons to dislike a rival.",
    ],
    left: {
      label: 'Sign it now', style: 'pragmatism', memo: "You signed Southline's contract overnight.",
      fx: { m: { res: 14, rep: 3 } },
      branches: [
        { when: { flags: ['sabel_agent'] }, fx: { flags: ['pass_ceded'], queue: [{ id: 'sabel_betrayal', delay: 6 }] }, result: 'Money flows in. Somewhere in the small print is a clause that nobody read out loud.' },
        { fx: { m: { rep: 4, res: 4 }, chars: { sabel: { trust: 15 } } }, result: 'The contract is exactly what it said it was. Imre looks truly relieved.' },
      ],
    },
    right: {
      label: 'Wait and check it', style: 'restraint', memo: 'You waited to check the contract.',
      fx: { m: { res: -3 }, reveal: ['agenda_sabel'] },
      branches: [
        { when: { flags: ['sabel_agent'] }, fx: { reveal: ['sabel_pass_scheme'], chars: { sabel: { resent: 20, trust: -15 } } }, result: "Page nine gives Southline admin access to our core systems. Imre's charm gets thinner." },
        { fx: { chars: { sabel: { trust: -6 } } }, result: 'The contract is fair. Imre is hurt that you doubted him, and not completely wrong to be.' },
      ],
    },
    lesson: { law: 29, left: 'Signing fast rewards the one who set the deadline. Whether it was a mistake depends on what was in the contract.', right: 'Asking for time to read what you sign is a normal right. People in a hurry treat it as an insult. Being rushed is a warning sign.' },
  },
  {
    id: 'sabel_betrayal', title: 'A BACK DOOR, NOT A PARTNERSHIP', theme: 'revenge', char: 'sabel', others: ['kovane'], story: true, urgent: true, once: true, major: true, when: { flags: ['pass_ceded'] },
    text: "Southline \"support engineers\" are inside our systems, and there are a great many of them. Dana storms in with a printout. 'You gave them the keys. They never needed a partnership. They needed a back door.'",
    left: { label: 'Cancel the contract in public', style: 'candour', memo: "You cancelled Southline's contract in public.", fx: { m: { rep: -8, auth: 4 }, chars: { kovane: { trust: 15 }, sabel: { status: 'exiled' } }, reveal: ['sabel_pass_scheme'], flags: ['sabel_expelled'], stat: { betrayals: 1 }, note: 'Imre tricked you with the contract.' }, result: 'You admit the mistake in front of the company and cut Southline off. Dana runs to lock down the systems.' },
    right: { label: 'Say it was all planned', style: 'guile', memo: 'You said the contract was part of a plan.', fx: { m: { auth: -6, rep: -2 }, chars: { kovane: { resent: 15 } }, stat: { betrayals: 1, manipulations: 1 }, note: 'Imre tricked you with the contract.' }, result: 'You tell leadership it is a trap for Southline. Nobody believes it, and a few pretend to.' },
    lesson: { law: 29, left: 'Owning a mistake early limits the damage. It makes your next words easier to believe.', right: 'A bluff that hides your own mistake works until someone checks. Then you have two problems.' },
  },
];
