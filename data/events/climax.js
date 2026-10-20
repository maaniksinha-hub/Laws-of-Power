// Late-reign events (retirement, succession, coalition) and low-stakes fallback cards that keep the deck from ever running dry.

export default [
  {
    id: 'retire_offer', title: 'LEAVE WHILE THEY SAY PLEASE', theme: 'timing', char: 'aldric', once: true, weight: 0.6,
    when: { turn: [27, null], rank: [2, null], meter: { auth: [45, null], rep: [45, null] } },
    text: "The CEO sees you alone. 'A fine package, a long holiday and my thanks,' he says. 'Leave while they still say please. In my experience that season is very short.'",
    left: { label: 'Accept the package', style: 'restraint', memo: "You accepted the CEO's offer to leave.", fx: { end: 'negotiated_exit' }, result: 'You shake his hand, you thank him, and you mean about half of it.' },
    right: { label: 'Say no, with thanks', style: 'charm', fx: { m: { rep: 4, auth: 4 }, chars: { aldric: { trust: -12, suspicion: 10 } } }, result: "The CEO's smile is a very old one. 'Of course,' he says. 'Ambition is a kind of loyalty, I suppose.'" },
    lesson: { law: 47, left: 'Stepping away at the top turns a career of work into a good ending. Few who rise this high choose it.', right: 'Staying means the next test is harder. And the one who offered you a way out has noted your answer.' },
  },
  {
    id: 'king_death', title: 'THE CEO IS LEAVING TODAY', theme: 'ambition', char: 'aldric', story: true, urgent: true, once: true, major: true, when: { turn: [30, null] },
    text: 'The CEO has just resigned. The phones will not stop ringing. His chosen successor is a young vice president, and she is scared. The board is hungry. Every eye is on you as the Chair asks who will lead the company for now.',
    left: {
      label: 'Take the top job yourself', style: 'force', memo: 'You took the top job yourself.', fx: { chars: { aldric: { status: 'dead' } } },
      branches: [
        { when: { meter: { auth: [55, null], rep: [45, null], loy: [45, null] }, notFlags: ['coalition'] }, fx: { flags: ['regent'], m: { rep: 6, auth: 6 } }, result: "Nobody moves to stop you. By evening, the CEO's keycard is on your desk." },
        { when: { meter: { rep: [40, null] } }, fx: { end: 'exiled_alive' }, result: 'The board says no, politely. A package is arranged for you, also politely.' },
        { fx: { end: 'overthrown' }, result: 'You reach for the job and find a dozen hands already on it.' },
      ],
    },
    right: {
      label: 'Back the young successor and guide her', style: 'restraint', memo: 'You backed the young successor.', fx: { chars: { aldric: { status: 'dead' } }, m: { auth: 5, loy: 5, rep: 3 }, flags: ['heir_guardian'] },
      branches: [
        { when: { flags: ['tutor_heir'] }, fx: { m: { loy: 6, rep: 4 } }, result: 'The new CEO takes the stage. She looks for you in the crowd first, finds you, and takes a very deep breath.' },
        { when: { flags: ['heir_promised'] }, fx: { chars: { isaura: { trust: 20 } }, m: { auth: 4 } }, result: 'The new CEO takes the stage. At the back of the room, the Chair is seen to nod once.' },
        { when: { flags: ['isaura_hostile'] }, fx: { chars: { isaura: { resent: 20 } }, m: { auth: -4 } }, result: 'The new CEO takes the stage. At the back of the room, the Chair does not clap.' },
      ],
      result: 'The vice president becomes CEO, and she holds your hand through the whole announcement.',
    },
    lesson: { law: 41, left: "Taking the founder's chair means being compared to him for the rest of your career, by everyone who loved or feared him.", right: 'Leading through a successor gives you power without the comparison. It also ties your fate to a young leader and to those who back her.' },
  },
  {
    id: 'coalition_moves', title: 'FOUR EXECS, ONE DINNER', theme: 'fear', char: 'crowd', who: { name: 'A Nervous Intern', role: 'Messenger', look: { hue: 60 } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "An intern slips you a folded note with no name. 'Four executives, four grudges, one dinner. They meet tonight to split up your jobs.' Your rivals have stopped fighting each other. That is the most dangerous thing they could do.",
    left: {
      label: 'Break the group: win over its weakest link', style: 'pragmatism', memo: 'You bought off one of the group against you.',
      fx: {},
      branches: [
        { when: { meter: { res: [25, null] } }, fx: { m: { res: -15 }, chars: { $topEnemy: { resent: -25, trust: 10 } }, flags: ['coalition_broken'] }, result: 'You offer the angriest of them a lot of promises. The dinner is much quieter than planned.' },
        { fx: { queue: [{ id: 'coalition_strikes', delay: 2 }] }, result: 'You cannot afford them. They sense it, and the dinner becomes a vote.' },
      ],
    },
    right: {
      label: 'Strike first at the loudest one', style: 'force', memo: 'You struck first at the group against you.',
      fx: {},
      branches: [
        { when: { meter: { auth: [50, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 6, rep: -6 } }, result: 'Before dessert, their host is called into HR. The others suddenly remember other plans.' },
        { fx: { m: { auth: -4 }, queue: [{ id: 'coalition_strikes', delay: 2 }] }, result: 'Your guard is half a step slow. The group takes it as an invitation.' },
      ],
    },
    lesson: { law: 42, left: 'Pulling off the weakest link breaks a group cheaply, if you can pay. It fails when you are the one short of resources.', right: 'Striking the loudest voice works only if your power survives being seen. A blow without strength makes the group stronger.' },
  },
  {
    id: 'coalition_strikes', title: 'SECURITY AT THE DOOR', theme: 'fear', char: 'crowd', who: { name: 'Your Assistant', role: 'Your Last Loyal Teammate', look: { hue: 10 } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "Your assistant bursts in, out of breath. 'They have the board room. Four executives, two directors and the lawyers. They want your badge by dawn, and a quiet exit if you are sensible.'",
    left: {
      label: 'Stand and fight', style: 'force',
      branches: [
        { when: { meter: { auth: [40, null], loy: [45, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 5, loy: -5 }, clear: ['coalition'] }, result: 'More people stay loyal than your assistant feared. By dawn, the board room is yours again.' },
        { fx: { end: 'overthrown' }, result: 'Your assistant is called away. The rest of your team remembers it has families.' },
      ],
    },
    right: { label: 'Ask for a deal to leave', style: 'restraint', fx: { end: 'exiled_alive' }, result: 'You leave by the back door with a package, a promise and your reputation.' },
    lesson: { law: 22, left: 'A last stand works only if the friends and power were in place before the doors closed.', right: 'Leaving on your own terms saves your future and loses everything else. It is the last move in a game you were already losing.' },
  },
  {
    id: 'final_session', title: 'THE BOARD HEARS YOUR STORY', theme: 'reputation', char: 'crowd', who: { name: 'The Board Secretary', role: 'Keeper of the Record', look: { hue: 220 } }, story: true, urgent: true, once: true, when: { turn: [38, null] },
    text: 'The board meets to review your time at the company. The secretary puts down the record, and the room goes quiet in the way that means everyone has prepared something.',
    left: {
      label: 'Tell your own story', style: 'charm', fx: { m: { rep: 4, auth: 2 } },
      branches: [{ when: { stat: { manipulations: [2, null] } }, fx: { m: { rep: -6 } }, result: 'Someone interrupts with screenshots. Your record has more small notes than you remembered.' }],
      result: 'You speak well, and mostly truthfully. The room does the rest.',
    },
    right: { label: 'Let the facts speak', style: 'restraint', fx: { m: { rep: 2, loy: 4 } }, result: 'You say little. The record says a great deal, and mostly good.' },
    lesson: { law: 30, left: 'Telling your own story shapes how it is heard. A record with loose ends will be pulled apart.', right: 'Letting results speak shows calm. It relies on others to read them fairly. A strong record needs fewer words.' },
  },

  // ---- fallbacks: small, repeatable, never conditional ----
  {
    id: 'routine_petitions', title: 'THE MORNING STAND-UP', theme: 'opportunity', char: 'crowd', who: { name: 'The Whole Team', role: 'Your Colleagues', look: { hue: 30 } }, fallback: true, weight: 0.5, cooldown: 3,
    text: 'The morning stand-up is long and dull. A fight over a shared folder. A broken printer. A request to rename a meeting room. Each person leaves sure that you listened to them alone.',
    left: { label: 'Hear every update in full', style: 'charm', fx: { m: { rep: 2, res: -1 } }, result: 'Hours later, the room is called Merrow Room, and Merrow is very pleased.' },
    right: { label: 'Let the team leads handle it', style: 'restraint', fx: { m: { auth: 1, loy: -1 } }, result: 'The leads are quick. The team is less impressed.' },
  },
  {
    id: 'routine_envoy', title: "THE DAY'S EMAILS", theme: 'negotiation', char: 'crowd', who: { name: 'A Visiting Consultant', role: 'Bringer of Requests', look: { hue: 50 } }, fallback: true, weight: 0.5, cooldown: 3,
    text: "A consultant forwards the day's emails with a face like a closed door. A manager wants a bigger desk. A director wants an award. A minor executive wants to be seen being forgiven for something.",
    left: { label: 'Give favours freely', style: 'charm', fx: { m: { loy: 2, res: -2 } }, result: 'A dozen small debts are made. You will not know which ones matter for months.' },
    right: { label: 'Answer nobody until they ask twice', style: 'restraint', fx: { m: { auth: 2, loy: -1 } }, result: 'Half the emails are never asked about again. The other half are asked about very politely.' },
  },
  {
    id: 'routine_gossip', title: 'IDLE TALK AT THE COFFEE MACHINE', theme: 'secrets', char: 'crowd', who: { name: 'A Cheerful Colleague', role: 'Office Gossip', look: { hue: 320 } }, fallback: true, weight: 0.5, cooldown: 3,
    text: 'She makes coffee and says nothing important for twenty minutes, which is exactly how you learn things. By the end you know who has argued, who is job hunting, and who is spending too much.',
    left: { label: 'Listen and learn', style: 'restraint', fx: { m: { rep: 1, loy: 1 } }, result: 'You use none of it. From now on you just notice who talks to whom.' },
    right: { label: 'Change the subject', style: 'candour', fx: { m: { rep: -1, auth: 1 } }, result: 'She laughs, delighted, and tells a different story instead.' },
  },
];
