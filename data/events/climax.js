// Late-game events (exit offer, succession, leaders against you) and low-stakes fallback cards that keep the deck from ever running dry.

export default [
  {
    id: 'retire_offer', via: 'oneonone', title: 'LEAVE WHILE THEY SAY PLEASE', theme: 'timing', char: 'aldric', once: true, weight: 0.6,
    when: { turn: [27, null], rank: [2, null], meter: { auth: [45, null], rep: [45, null] } },
    text: "Maya sees you alone. 'A fine package, a long break and my thanks,' she says. 'Leave while they still say please. In my experience that season is very short.'",
    left: { label: 'Accept the package', style: 'restraint', memo: "You accepted Maya's offer to leave.", fx: { end: 'negotiated_exit' }, result: 'You shake his hand, you thank him, and you mean about half of it.' },
    right: { label: 'Say no, with thanks', style: 'charm', fx: { m: { rep: 4, auth: 4 }, chars: { aldric: { trust: -12, suspicion: 10 } } }, result: "Maya's smile is a very old one. 'Of course,' she says. 'Ambition is a kind of loyalty, I suppose.'" },
    lesson: { law: 47, left: 'Stepping away at the top turns a career of work into a good ending. Few who rise this high choose it.', right: 'Staying means the next test is harder. And the one who offered you a way out has noted your answer.' },
  },
  {
    id: 'king_death', title: 'MAYA IS LEAVING TODAY', theme: 'ambition', char: 'aldric', story: true, urgent: true, once: true, major: true, when: { turn: [30, null] },
    text: 'Maya has just announced she is leaving today. Slack will not stop buzzing. Her chosen successor is Nina Park, a young design director, and she is scared. Leadership is hungry. Every eye is on you as Elena Voss asks who will lead Design for now.',
    left: {
      label: 'Ask to be Acting Head of Design', style: 'force', memo: 'You asked to be Acting Head of Design.', fx: { chars: { aldric: { status: 'dead' } } },
      branches: [
        { when: { meter: { auth: [55, null], rep: [45, null], loy: [45, null] }, notFlags: ['coalition'] }, fx: { flags: ['regent'], m: { rep: 6, auth: 6 } }, result: "Nobody moves to stop you. By evening, Maya's calendar access is yours." },
        { when: { meter: { rep: [40, null] } }, fx: { end: 'exiled_alive' }, result: 'Leadership says no, politely. An exit package is arranged for you, also politely.' },
        { fx: { end: 'overthrown' }, result: 'You reach for the job and find a dozen hands already on it.' },
      ],
    },
    right: {
      label: 'Back Nina and guide her', style: 'restraint', memo: 'You backed Nina Park as the new head.', fx: { chars: { aldric: { status: 'dead' } }, m: { auth: 5, loy: 5, rep: 3 }, flags: ['heir_guardian'] },
      branches: [
        { when: { flags: ['tutor_heir'] }, fx: { m: { loy: 6, rep: 4 } }, result: 'Nina takes the stage at the all-hands. She looks for you in the crowd first, finds you, and takes a very deep breath.' },
        { when: { flags: ['heir_promised'] }, fx: { chars: { isaura: { trust: 20 } }, m: { auth: 4 } }, result: 'Nina takes the stage at the all-hands. At the back of the room, Elena Voss is seen to nod once.' },
        { when: { flags: ['isaura_hostile'] }, fx: { chars: { isaura: { resent: 20 } }, m: { auth: -4 } }, result: 'Nina takes the stage at the all-hands. At the back of the room, Elena Voss does not clap.' },
      ],
      result: 'Nina becomes head of Design, and she thanks you by name in the whole announcement.',
    },
    lesson: { law: 41, left: "Taking Maya's seat means being compared to her for the rest of your career, by everyone who loved or feared her.", right: 'Leading through a successor gives you power without the comparison. It also ties your fate to a young leader and to those who back her.' },
  },
  {
    id: 'coalition_moves', via: 'meeting', title: 'FOUR LEADERS, ONE DINNER', theme: 'fear', char: 'crowd', who: { name: 'A Nervous Intern', role: 'Design Intern', look: { hue: 60 } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "An intern slips you a folded note with no name. 'Four leaders, four grudges, one dinner. They meet tonight to split up your projects.' Your rivals have stopped fighting each other. That is the most dangerous thing they could do.",
    left: {
      label: 'Win over the weakest link', style: 'pragmatism', memo: 'You won over one of the group against you.',
      fx: {},
      branches: [
        { when: { meter: { res: [25, null] } }, fx: { m: { res: -15 }, chars: { $topEnemy: { resent: -25, trust: 10 } }, flags: ['coalition_broken'] }, result: 'You offer the angriest of them a lot of promises. The dinner is much quieter than planned.' },
        { fx: { queue: [{ id: 'coalition_strikes', via: 'meeting', delay: 2 }] }, result: 'You cannot afford them. They sense it, and the dinner becomes a vote.' },
      ],
    },
    right: {
      label: 'Strike first at the loudest one', style: 'force', memo: 'You struck first at the group against you.',
      fx: {},
      branches: [
        { when: { meter: { auth: [50, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 6, rep: -6 } }, result: 'Before dessert, their host gets an email from HR. The others suddenly remember other plans.' },
        { fx: { m: { auth: -4 }, queue: [{ id: 'coalition_strikes', delay: 2 }] }, result: 'Your guard is half a step slow. The group takes it as an invitation.' },
      ],
    },
    lesson: { law: 42, left: 'Pulling off the weakest link breaks a group cheaply, if you can pay. It fails when you are the one short of favours.', right: 'Striking the loudest voice works only if your power survives being seen. A blow without strength makes the group stronger.' },
  },
  {
    id: 'coalition_strikes', title: 'A MEETING YOU WERE NOT INVITED TO', theme: 'fear', char: 'crowd', who: { name: 'Nadia Rossi', role: 'Your Last Loyal Teammate', look: { hue: 10 } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "Nadia bursts in, out of breath. 'They have the big meeting room. Four leaders, two directors and someone from Legal. They want you off every project by tomorrow, and a quiet exit if you are sensible.'",
    left: {
      label: 'Stand and fight', style: 'force',
      branches: [
        { when: { meter: { auth: [40, null], loy: [45, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 5, loy: -5 }, clear: ['coalition'] }, result: 'More people stay loyal than Nadia feared. By morning, the big meeting room is yours again.' },
        { fx: { end: 'overthrown' }, result: 'Nadia is called away. The rest of your team remembers it has rent to pay.' },
      ],
    },
    right: { label: 'Ask for a deal to leave', style: 'restraint', fx: { end: 'exiled_alive' }, result: 'You leave by the side door with a package, a promise and your reputation.' },
    lesson: { law: 22, left: 'A last stand works only if the friends and support were in place before the meeting started.', right: 'Leaving on your own terms saves your future and loses everything else. It is the last move in a game you were already losing.' },
  },
  {
    id: 'final_session', via: 'meeting', title: 'THE FINAL PRESENTATION TO LEADERSHIP', theme: 'reputation', char: 'crowd', who: { name: 'Tom Becker', role: 'Design Program Manager', look: { hue: 220 } }, story: true, urgent: true, once: true, when: { turn: [38, null] },
    text: 'Leadership meets to review your time at Lumen. Tom pulls up the slide deck, and the room goes quiet in the way that means everyone has prepared something.',
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
    id: 'routine_petitions', via: 'standup', title: 'THE MORNING STAND-UP', theme: 'opportunity', char: 'crowd', who: { name: 'The Whole Team', role: 'Your Colleagues', look: { hue: 30 } }, fallback: true, weight: 0.5, cooldown: 3,
    text: 'The morning stand-up is long and dull. A fight over a Figma file name. A broken Zoom link. A request to rename a meeting room. Each person leaves sure that you listened to them alone.',
    left: { label: 'Hear every update in full', style: 'charm', fx: { m: { rep: 2, res: -1 } }, result: 'Days later, the room has a new name, and the person who asked is very pleased.' },
    right: { label: 'Let the team leads handle it', style: 'restraint', fx: { m: { auth: 1, loy: -1 } }, result: 'The leads are quick. The team is less impressed.' },
  },
  {
    id: 'routine_envoy', via: 'email', title: "THE DAY'S EMAILS", theme: 'negotiation', char: 'crowd', who: { name: 'A Product Manager', role: 'Sender of Requests', look: { hue: 50 } }, fallback: true, weight: 0.5, cooldown: 3,
    text: "A PM forwards the day's emails with a face like a closed door. One designer wants a bigger monitor. One lead wants a shout-out in the all-hands. One director wants to be seen being forgiven for something.",
    left: { label: 'Give favours freely', style: 'charm', fx: { m: { loy: 2, res: -2 } }, result: 'A dozen small debts are made. You will not know which ones matter for months.' },
    right: { label: 'Answer nobody until they ask twice', style: 'restraint', fx: { m: { auth: 2, loy: -1 } }, result: 'Half the emails are never asked about again. The other half are asked about very politely.' },
  },
  {
    id: 'routine_gossip', title: 'IDLE TALK AT THE COFFEE MACHINE', theme: 'secrets', char: 'crowd', who: { name: 'A Cheerful Colleague', role: 'Office Gossip', look: { hue: 320 } }, fallback: true, weight: 0.5, cooldown: 3,
    text: 'She makes coffee and says nothing important for twenty minutes, which is exactly how you learn things. By the end you know who has argued, who is job hunting, and whose project is late.',
    left: { label: 'Listen and learn', style: 'restraint', fx: { m: { rep: 1, loy: 1 } }, result: 'You use none of it. From now on you just notice who talks to whom.' },
    right: { label: 'Change the subject', style: 'candour', fx: { m: { rep: -1, auth: 1 } }, result: 'She laughs, delighted, and tells a different story instead.' },
  },
];
