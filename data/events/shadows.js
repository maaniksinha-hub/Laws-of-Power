// Intelligence and the unseen: Ysolde's ledger, the poisoned cup, the Veiled Patron, the Ambassador.

export default [
  // ---- Ysolde ----
  {
    id: 'ysolde_first', title: 'THE PRICE OF TEA', theme: 'secrets', char: 'ysolde', once: true, story: true, when: { turn: [4, null] },
    text: "'Secrets are the one coin that grows in value,' says Ysolde, stirring tea she will not drink. 'For eight crowns I will tell you who in this room is lying to you. For free, I will tell you to be careful.'",
    left: { label: 'Say no', style: 'restraint', fx: { chars: { ysolde: { trust: -4 } }, flags: ['ysolde_declined'] }, result: "'Careful, then,' says Ysolde, and pours you a cup you did not ask for." },
    right: {
      label: 'Pay her', style: 'pragmatism', memo: 'You bought a secret from Ysolde.',
      fx: { m: { res: -8 }, flags: ['ysolde_customer'] },
      branches: [
        { when: { flags: ['quill_leaker'] }, fx: { reveal: ['quill_leaks'] }, result: "She slides a folded note across the table. The steward sells the king's daily plans. To her, and to others." },
        { fx: { reveal: ['agenda_quill'] }, result: "'The steward? He never sells. I have tried.' It is the nearest thing to praise she gives anyone." },
      ],
    },
    lesson: { law: 14, left: 'Saying no keeps your hands clean and your purse full. But you stay the one who does not know what everyone else knows.', right: "Bought news is only as good as the seller's reasons. A broker will sell the same true thing to you and to others." },
  },
  {
    id: 'ysolde_ledger', title: 'THE LONG LIST', theme: 'secrets', char: 'ysolde', story: true, urgent: true, once: true, major: true,
    when: { seen: ['ysolde_first'], stat: { manipulations: [2, null] } },
    text: "'I keep a book,' says Ysolde. 'Your name has grown long in it. Favours, pressure, a few neat lies. Others would pay well to read it. I would much rather be your friend.'",
    left: { label: 'Buy the page', style: 'pragmatism', memo: "You bought the page in Ysolde's book that had your name.", fx: { m: { res: -12 }, reveal: ['ledger_page'], chars: { ysolde: { trust: 5 } }, flags: ['ledger_bought'] }, result: 'The page changes hands. Ysolde keeps a copy, as you would have done.' },
    right: {
      label: 'Call her bluff', style: 'force', memo: "You called Ysolde's bluff about the book.",
      fx: { reveal: ['ledger_page'] },
      branches: [
        { when: { stat: { manipulations: [3, null] } }, chance: 0.6, fx: { end: 'exposed_manipulator' }, result: 'Ysolde sells the book to the highest buyer by morning. Every thread leads back to your hand.' },
        { chance: 0.35, fx: { m: { rep: -10 }, flags: ['ledger_leaked'] }, result: 'A page turns up in the council room. It is not the worst page. It is bad enough.' },
      ],
      result: 'She shrugs, and for once she looks unsure. Maybe she was bluffing.',
    },
    lesson: { law: 5, left: 'Paying to keep a record hidden costs less than defending your name. It also keeps the broker in your story.', right: 'Daring a record keeper to publish bets that she values her trade more than the sale. Sometimes she does not.' },
  },

  // ---- The Poisoned Cup ----
  {
    id: 'king_ill', title: 'A FEVER THAT IS NOT A FEVER', theme: 'secrets', char: 'aubry', others: ['aldric'], story: true, once: true, when: { turn: [9, null] },
    text: "Dr. Aubry shuts the door and does not sit. 'The king's wine, {t}. I have treated many fevers. This is not one. Someone is putting something slow in his cup.'",
    left: { label: 'Look into it quietly', style: 'restraint', memo: "You looked into the king's illness in secret.", fx: { m: { res: -5 }, flags: ['poison_known'], chars: { aubry: { trust: 12 } }, queue: [{ id: 'tasting_cup', delay: 4 }] }, result: 'Aubry hands you a small bottle and a list of signs. You tell no one.' },
    right: { label: 'Tell the council', style: 'candour', memo: 'You told the council about the poison.', fx: { m: { rep: 4, auth: -4 }, flags: ['poison_public', 'poisoner_alert'], chars: { aubry: { trust: -6 } }, queue: [{ id: 'tasting_cup', delay: 3 }] }, result: 'The council erupts. Everyone looks shocked. Some of them are very good actors.' },
    lesson: { law: 3, left: 'Staying silent keeps the guilty one comfortable, and comfortable people repeat their habits. You bought time with your own safety.', right: 'Telling everyone warns the poisoner as well as the victim. It also makes you the person who raised the alarm.' },
  },
  {
    id: 'tasting_cup', title: 'THE KING\'S CUP', theme: 'timing', char: 'aldric', others: ['aubry'], story: true, urgent: true, once: true, major: true, when: { seen: ['king_ill'] },
    text: "At the feast, the king's cup is passed to you. It is a kind gesture and a sign of favour. Aubry's eyes find yours across the table. The wine smells of cloves, and of something under the cloves.",
    left: { label: 'Let a servant taste it first', style: 'restraint', memo: 'You had a servant taste the king\'s cup.', fx: { m: { rep: -3 }, flags: ['poison_confirmed'], reveal: ['poison_cup'], chars: { aldric: { trust: 4 } } }, result: 'The servant falls ill within the hour. The cup was bad. The court is shocked, quietly.' },
    right: {
      label: 'Drink it yourself', style: 'force', memo: 'You drank the king\'s cup.',
      fx: { flags: ['poison_confirmed'], reveal: ['poison_cup'] },
      branches: [
        { when: { flags: ['poison_known'] }, fx: { m: { rep: 8, loy: 6 }, flags: ['poison_survived'] }, result: "Aubry's cure keeps you steady. The court watches someone drink poison and live." },
        { when: { notFlags: ['poison_known'] }, chance: 0.3, fx: { end: 'poisoned' }, result: 'The room tilts. The last thing you see is Aubry running, and nobody else.' },
        { fx: { m: { auth: -10, res: -8 } }, result: 'You are carried out grey in the face. The cup was bad. You get better in a week. The court tells the story for much longer.' },
      ],
    },
    lesson: { law: 26, left: 'A stand-in keeps your own hands clean, but someone else pays the price, and they did not choose it. People notice who was told to be careful.', right: 'Taking the risk yourself shows strong belief. It can also kill you if you do not know what you are drinking.' },
  },
  {
    id: 'poisoner_unmasked', title: 'WHOSE HAND IN THE CELLAR', theme: 'revenge', char: 'aubry', story: true, urgent: true, once: true, major: true, when: { flags: ['poison_confirmed'], seen: ['tasting_cup'] },
    text: [
      { when: { flags: ['culprit_vask'] }, t: "Aubry has traced the poison to the shop that supplies Master Vask. 'He has a reason. The king's death would give him sole rights to trade. He has the means too. That is not proof. But I would not eat his bread.'" },
      { when: { flags: ['culprit_dorne'] }, t: "Aubry has traced the poison to Lady Dorne's house. 'Her cook bought the herb, and the cook is terrified. The lady is calm. Either she is innocent, or she is a great actress.'" },
      "Aubry has traced the poison to the steward's office. 'Quill's key opened the cellar door that night. Was it for gold or from fear? I cannot say. But it was his key.'",
    ],
    left: { label: 'Arrest the guilty one quietly', style: 'restraint', memo: 'You had the king\'s poisoner arrested quietly.', fx: { chars: { $culprit: { status: 'imprisoned', resent: 30 } }, m: { auth: 5, rep: 2 }, flags: ['poison_solved'] }, result: 'The arrest happens in the middle of the night. By morning, the guilty one has simply left the court.' },
    right: { label: 'Show the proof to the council', style: 'candour', memo: 'You showed the council who the poisoner was.', fx: { chars: { $culprit: { status: 'imprisoned', resent: 30 } }, m: { rep: 8, loy: 6, auth: 2 }, flags: ['poison_solved', 'conspiracy_exposed'], stat: { conspiracies: 1 } }, result: 'The council watches {culprit} being led away. For one afternoon, everyone is on the same side.' },
    lesson: { law: 29, left: 'A quiet arrest ends the danger but leaves questions. Rumours grow from questions.', right: 'A public trial gives you the most right to act. It also teaches the next poisoner what to hide.' },
  },

  // ---- The Veiled Patron ----
  {
    id: 'anonymous_note', title: 'A GREY SEAL', theme: 'opportunity', char: 'isaura', story: true, once: true, when: { turn: [10, null], rank: [1, null], notFlags: ['veiled_patron'] },
    text: "A note lies under your door, sealed with grey wax. 'Your rise was no accident. Your fall does not have to be one either. Name a place and a time.' The handwriting belongs to someone who never asks permission.",
    left: { label: 'Ignore the note', style: 'restraint', fx: { flags: ['note_ignored'], chars: { isaura: { resent: 8 } }, queue: [{ id: 'veiled_meeting', delay: 6 }] }, result: 'You burn it. The ash smells faintly of lavender, which is somehow worse.' },
    right: { label: 'Name a place and a time', style: 'guile', fx: { flags: ['note_answered'], queue: [{ id: 'veiled_meeting', delay: 2 }] }, result: 'A stranger delivers the reply and vanishes down the stairs before you finish reading.' },
    lesson: { law: 8, left: 'Letting a mystery person come to you keeps the first move. But you are now ignoring a powerful person.', right: 'Choosing the time and place of a secret meeting feels like control. It only helps if you know who you are meeting.' },
  },
  {
    id: 'veiled_meeting', title: 'THE CARRIAGE WITH CURTAINS', theme: 'negotiation', char: 'isaura', story: true, once: true, major: true, when: { anyFlags: ['note_answered', 'note_ignored'] },
    text: [
      { when: { flags: ['note_ignored'] }, t: "The carriage is waiting at your door this time. 'It was rude not to answer,' says the veiled voice. 'I forgive it once. I can make the council lean your way. All I will ask is a name, when the time comes.'" },
      "A carriage with closed curtains waits in the church square. The woman inside never lifts her veil. 'I can make the council lean your way,' she says. 'All I will ever ask is a name, when the time comes.'",
    ],
    left: { label: 'Refuse the helper', style: 'candour', memo: 'You refused the Veiled Patron.', fx: { m: { auth: -4 }, chars: { isaura: { resent: 10, trust: -10 } }, flags: ['veiled_refused'] }, result: 'The curtain does not move. The carriage drives off at exactly walking speed.' },
    right: { label: 'Accept her help', style: 'pragmatism', memo: "You accepted the Veiled Patron's help.", fx: { m: { auth: 8, rep: 6, res: 6 }, chars: { isaura: { obligation: 40, trust: 10 } }, flags: ['veiled_patron'], queue: [{ id: 'veiled_price', delay: 8 }] }, result: 'By the next council meeting, three locked doors are open.' },
    lesson: { law: 11, left: 'Refusing an unknown helper keeps you free. It also makes you a fixed point that someone must now work around.', right: 'A helper makes you depend on her, and she depends on you. But only she knows how long the leash is.' },
  },
  {
    id: 'veiled_price', title: 'THE NAME', theme: 'negotiation', char: 'isaura', story: true, urgent: true, once: true, major: true, when: { flags: ['veiled_patron'] },
    text: "The grey seal again. 'The name I mentioned,' says the veiled voice. 'My grandnephew, a boy of eleven. When the king dies, you will speak for him and for no one else. I have waited a long time to ask.'",
    left: { label: 'Refuse', style: 'candour', memo: 'You refused the Veiled Patron\'s price.', fx: { m: { auth: -12, rep: -4 }, chars: { isaura: { resent: 30, trust: -20 } }, flags: ['isaura_hostile'], clear: ['veiled_patron'] }, result: 'Doors close in the order they opened. Her favour was a staircase, and she has taken it away.' },
    right: { label: 'Promise to back the boy', style: 'pragmatism', memo: "You promised to back the Veiled Patron's heir.", fx: { m: { loy: -6, auth: 4 }, chars: { isaura: { trust: 15 } }, flags: ['heir_promised'] }, result: 'You swear it in the shadow of the church. It is the first thing you cannot take back.' },
    lesson: { law: 40, left: 'Refusing the price loses what you already gained. It also shows others you can say no to the most powerful person in the room.', right: "The price of free help is shown last. Paying keeps you safe. It also ties your future choices to someone else's plan." },
  },
  {
    id: 'unveiling', title: 'THE COAT OF ARMS', theme: 'secrets', char: 'isaura', story: true, once: true, when: { turn: [16, null], anyFlags: ['note_answered', 'note_ignored', 'veiled_patron', 'veiled_refused'], notSecret: ['veiled_hand_identity'] },
    text: 'The grey carriage passes under your window again, curtains shut. A footman stops to fix a strap. For one breath, the coat of arms on the door is visible. You could follow it.',
    left: { label: 'Let it go', style: 'restraint', fx: { flags: ['mystery_kept'] }, result: 'The carriage turns the corner. Some mysteries are more useful when left alone.' },
    right: {
      label: 'Follow the carriage', style: 'guile', memo: 'You followed the Veiled Patron\'s carriage.',
      fx: { m: { res: -4 }, reveal: ['veiled_hand_identity'] },
      branches: [{ chance: 0.4, fx: { chars: { isaura: { resent: 10, suspicion: 15 } } }, result: "It ends at the Dowager Duchess's private door. Her footman looks straight at you. You have been seen." }],
      result: "It ends at the private gate of Dowager Duchess Isaura Venn, the king's aunt.",
    },
    lesson: { law: 4, left: "Leaving a secret alone keeps you off a powerful person's list. It also keeps you blind to the hand that moves the pieces.", right: 'Finding out who a helper is gives you power and a weakness. She will wonder what else you have learned.' },
  },

  // ---- Ambassador Sabel ----
  {
    id: 'sabel_gift', title: 'A GIFT WITH NO STRINGS', theme: 'negotiation', char: 'sabel', once: true, when: { turn: [7, null] },
    text: "Ambassador Sabel gives you a jewelled star finder and bows deeply. 'A gift from the Southern League. No strings, {t}, only friendship.' The lock on the box is beautifully made, like most traps.",
    left: { label: 'Refuse the gift', style: 'candour', fx: { m: { rep: 2 }, chars: { sabel: { trust: -8 } } }, result: 'Sabel bows even lower. Only a very good diplomat is so kind about a refusal.' },
    right: { label: 'Accept it', style: 'charm', fx: { m: { res: 6, rep: 2 }, chars: { sabel: { obligation: 25, trust: 8 } }, flags: ['sabel_gift'] }, result: 'It is a lovely thing. You find yourself thinking of it whenever the Ambassador is in the room.' },
    lesson: { law: 40, left: 'Refusing a gift keeps things clean. It costs a little warmth with someone who offered it to build some.', right: 'A gift with "no strings" costs less than most and more than it seems. You owe the favour even if the bill never comes.' },
  },
  {
    id: 'sabel_treaty', title: 'A TREATY BY DAWN', theme: 'negotiation', char: 'sabel', others: ['vask'], story: true, once: true, major: true, when: { turn: [14, null] },
    text: [
      { when: { flags: ['sabel_gift'] }, t: "'Sign the trade treaty by dawn,' says Sabel, resting a hand on the star finder he gave you. 'The League is generous but in a hurry.' In the corner, Vask shakes his head slightly. Vask has his own reasons to dislike a rival." },
      "'Sign the trade treaty by dawn,' says Sabel. 'The League is generous but in a hurry.' In the corner, Vask shakes his head slightly. Vask has his own reasons to dislike a rival.",
    ],
    left: {
      label: 'Sign it now', style: 'pragmatism', memo: "You signed the League's treaty overnight.",
      fx: { m: { res: 14, rep: 3 } },
      branches: [
        { when: { flags: ['sabel_agent'] }, fx: { flags: ['pass_ceded'], queue: [{ id: 'sabel_betrayal', delay: 6 }] }, result: 'Money pours in. Somewhere in the small print is a line that nobody read out loud.' },
        { fx: { m: { rep: 4, res: 4 }, chars: { sabel: { trust: 15 } } }, result: 'The treaty is exactly what it said it was. Sabel looks truly relieved.' },
      ],
    },
    right: {
      label: 'Wait and check it', style: 'restraint', memo: 'You waited to check the treaty.',
      fx: { m: { res: -3 }, reveal: ['agenda_sabel'] },
      branches: [
        { when: { flags: ['sabel_agent'] }, fx: { reveal: ['sabel_pass_scheme'], chars: { sabel: { resent: 20, trust: -15 } } }, result: "Page nine gives the League a road through the mountain pass. Sabel's charm gets thinner." },
        { fx: { chars: { sabel: { trust: -6 } } }, result: 'The treaty is fair. Sabel is hurt that you doubted him, and not completely wrong to be.' },
      ],
    },
    lesson: { law: 29, left: 'Signing fast rewards the one who set the deadline. Whether it was a mistake depends on what was in the treaty.', right: 'Asking for time to read what you sign is a normal right. People in a hurry treat it as an insult. Being rushed is a warning sign.' },
  },
  {
    id: 'sabel_betrayal', title: 'A DOOR, NOT A TREATY', theme: 'revenge', char: 'sabel', others: ['kovane'], story: true, urgent: true, once: true, major: true, when: { flags: ['pass_ceded'] },
    text: "League \"trade inspectors\" are in the mountain pass, and there are a great many of them. Kovane storms in with a map. 'You gave it to them, {t}. They never needed a treaty. They needed a door.'",
    left: { label: 'Cancel the treaty in public', style: 'candour', memo: "You cancelled the League's treaty in public.", fx: { m: { rep: -8, auth: 4 }, chars: { kovane: { trust: 15 }, sabel: { status: 'exiled' } }, reveal: ['sabel_pass_scheme'], flags: ['sabel_expelled'], stat: { betrayals: 1 }, note: 'Sabel tricked you with the treaty.' }, result: 'You admit the mistake in front of the court and send the Ambassador away. Kovane rides for the pass.' },
    right: { label: 'Say it was all planned', style: 'guile', memo: 'You said the treaty was part of a plan.', fx: { m: { auth: -6, rep: -2 }, chars: { kovane: { resent: 15 } }, stat: { betrayals: 1, manipulations: 1 }, note: 'Sabel tricked you with the treaty.' }, result: 'You tell the council it is a trap for the League. Nobody believes it, and a few pretend to.' },
    lesson: { law: 29, left: 'Owning a mistake early limits the damage. It makes your next words easier to believe.', right: 'A bluff that hides your own mistake works until someone checks. Then you have two problems.' },
  },
];
