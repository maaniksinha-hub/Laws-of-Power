// Late-reign events (retirement, succession, coalition) and low-stakes fallback cards that keep the deck from ever running dry.

export default [
  {
    id: 'retire_offer', title: 'LEAVE WHILE THEY SAY PLEASE', theme: 'timing', char: 'aldric', once: true, weight: 0.6,
    when: { turn: [27, null], rank: [2, null], meter: { auth: [45, null], rep: [45, null] } },
    text: "The king receives you alone. 'A barony in the north, a pension and my thanks, {t},' he says. 'Leave while they still say please. In my experience that is a very short season.'",
    left: { label: 'Accept the retirement', style: 'restraint', memo: 'You accepted the king\'s offer of retirement.', fx: { end: 'negotiated_exit' }, result: 'You kneel, you thank him, and you mean about half of it.' },
    right: { label: 'Decline with thanks', style: 'charm', fx: { m: { rep: 4, auth: 4 }, chars: { aldric: { trust: -12, suspicion: 10 } } }, result: "The king's smile is a very old one. 'Of course,' he says. 'Ambition is a form of loyalty, I suppose.'" },
    lesson: { law: 47, left: 'Stepping away at the height of your influence cashes in a life of work. Few who rise this far choose it.', right: 'Staying means the next test will be harder, and the one granting your exit has now noted your answer.' },
  },
  {
    id: 'king_death', title: 'THE BELLS DO NOT STOP', theme: 'ambition', char: 'aldric', story: true, urgent: true, once: true, major: true, when: { turn: [30, null] },
    text: "The king is dead. The bells have not stopped. The heir is eleven and frightened; the council is hungry. Every eye is on you as the chamberlain asks who will speak for the realm.",
    left: {
      label: 'Claim the regency', style: 'force', memo: 'You claimed the regency.', fx: { chars: { aldric: { status: 'dead' } } },
      branches: [
        { when: { meter: { auth: [55, null], rep: [45, null], loy: [45, null] }, notFlags: ['coalition'] }, fx: { flags: ['regent'], m: { rep: 6, auth: 6 } }, result: 'Nobody moves to stop you. By dusk, the seal of the realm is on your desk.' },
        { when: { meter: { rep: [40, null] } }, fx: { end: 'exiled_alive' }, result: 'The council refuses, politely. A ship is arranged for you, and your pension, also politely.' },
        { fx: { end: 'overthrown' }, result: 'You reach for the crown and find a dozen hands already on it.' },
      ],
    },
    right: {
      label: 'Back the heir and guide him', style: 'restraint', memo: 'You backed the young heir.', fx: { chars: { aldric: { status: 'dead' } }, m: { auth: 5, loy: 5, rep: 3 }, flags: ['heir_guardian'] },
      branches: [
        { when: { flags: ['heir_promised'] }, fx: { chars: { isaura: { trust: 20 } }, m: { auth: 4 } }, result: 'The boy is crowned. In the gallery, a veiled figure is seen to nod, once.' },
        { when: { flags: ['isaura_hostile'] }, fx: { chars: { isaura: { resent: 20 } }, m: { auth: -4 } }, result: 'The boy is crowned. In the gallery, a veiled figure does not clap.' },
      ],
      result: 'The boy is crowned, and he holds your hand through the ceremony.',
    },
    lesson: { law: 41, left: "Claiming the dead king's chair means being measured against him for the rest of your life, by everyone who loved or feared him.", right: 'Governing through an heir gets you the power without the comparison. It also ties your fate to a child and to those who raised him.' },
  },
  {
    id: 'coalition_moves', title: 'FOUR CHAIRS, ONE DINNER', theme: 'fear', char: 'crowd', who: { name: 'A Frightened Page', role: 'Messenger', look: { hue: 60, hat: 'cap' } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "A page slips you a folded note with no name: 'Four chairs, four grudges, one dinner. They meet tonight to divide your offices.' Your enemies have stopped competing with each other, which is the most dangerous thing they could do.",
    left: {
      label: 'Break the bloc: pay off its weakest link', style: 'pragmatism', memo: 'You bought off a member of the coalition.',
      fx: {},
      branches: [
        { when: { meter: { res: [25, null] } }, fx: { m: { res: -15 }, chars: { $topEnemy: { resent: -25, trust: 10 } }, flags: ['coalition_broken'] }, result: 'You buy the angriest of them a dukedom of promises. The dinner is much quieter than planned.' },
        { fx: { queue: [{ id: 'coalition_strikes', delay: 2 }] }, result: 'You cannot afford them. They sense it, and the dinner becomes a vote.' },
      ],
    },
    right: {
      label: 'Strike first against the loudest of them', style: 'force', memo: 'You struck first against the coalition.',
      fx: {},
      branches: [
        { when: { meter: { auth: [50, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 6, rep: -6 } }, result: 'Before dessert, their host is arrested. The others remember pressing engagements.' },
        { fx: { m: { auth: -4 }, queue: [{ id: 'coalition_strikes', delay: 2 }] }, result: 'Your guard is half a step slow. The coalition takes it as an invitation.' },
      ],
    },
    lesson: { law: 42, left: 'Peeling off the weakest link dissolves a coalition cheaply if you can pay. It fails when you are the one short of coin.', right: 'Striking the loudest voice works only when your authority can survive being seen to use it. A visible blow without strength strengthens the coalition.' },
  },
  {
    id: 'coalition_strikes', title: 'THE EAST GATE', theme: 'fear', char: 'crowd', who: { name: 'The Captain of the Guard', role: 'Your Last Loyal Officer', look: { hue: 10, hat: 'helm' } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "The captain bursts in, breathing hard. 'They have the east gate, {t}. Four houses, two hundred men. They want you gone by dawn, and alive if you are sensible.'",
    left: {
      label: 'Stand and fight', style: 'force',
      branches: [
        { when: { meter: { auth: [40, null], loy: [45, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 5, loy: -5 }, clear: ['coalition'] }, result: 'Those who stay loyal turn out to be more than the captain feared. By dawn the gate is yours again.' },
        { fx: { end: 'overthrown' }, result: 'The captain falls on the stairs. The rest of the guard remembers it has families.' },
      ],
    },
    right: { label: 'Negotiate your surrender terms', style: 'restraint', fx: { end: 'exiled_alive' }, result: 'You leave by the harbour gate with a purse, a promise and your head.' },
    lesson: { law: 22, left: 'A last stand works only if the relationships and authority were in place before the doors broke.', right: 'Surrendering on your terms saves your life and loses everything else. It is the last move in a game you were already losing.' },
  },
  {
    id: 'final_session', title: 'THE COUNCIL HEARS YOUR ACCOUNT', theme: 'reputation', char: 'crowd', who: { name: 'The Council Clerk', role: 'Keeper of the Register', look: { hue: 220, hat: 'coif' } }, story: true, urgent: true, once: true, when: { turn: [38, null] },
    text: "The council convenes to hear the account of your tenure. The clerk sets down the register, and the room goes quiet in the particular way that means everyone has prepared something.",
    left: {
      label: 'Present your record', style: 'charm', fx: { m: { rep: 4, auth: 2 } },
      branches: [{ when: { stat: { manipulations: [2, null] } }, fx: { m: { rep: -6 } }, result: 'Someone interrupts with receipts. Your record has more footnotes than you remembered.' }],
      result: 'You speak well, and mostly truthfully. The room does the rest.',
    },
    right: { label: 'Let the facts speak for you', style: 'restraint', fx: { m: { rep: 2, loy: 4 } }, result: 'You say little. The register says a great deal, and rarely badly.' },
    lesson: { law: 30, left: 'Presenting your record shapes the story. A record with loose ends will be pulled at.', right: 'Letting results speak shows composure and relies on others to read them fairly. A strong record needs fewer words.' },
  },

  // ---- fallbacks: small, repeatable, never conditional ----
  {
    id: 'routine_petitions', title: 'THE MORNING AUDIENCE', theme: 'opportunity', char: 'crowd', who: { name: 'A Line of Petitioners', role: 'Subjects of the Realm', look: { hue: 30, hat: 'none' } }, fallback: true, weight: 0.5, cooldown: 3,
    text: "The morning audience is long and unremarkable: a boundary dispute, a lost pig, a request to rename a bridge. Each petitioner leaves convinced that you listened to them alone.",
    left: { label: 'Hear every case in full', style: 'charm', fx: { m: { rep: 2, res: -1 } }, result: 'Hours later, the bridge is called Merrow Bridge, and Merrow is very pleased.' },
    right: { label: 'Delegate it to the clerks', style: 'restraint', fx: { m: { auth: 1, loy: -1 } }, result: 'The clerks are efficient. The petitioners are less moved.' },
  },
  {
    id: 'routine_envoy', title: 'THE DAY\'S LETTERS', theme: 'negotiation', char: 'crowd', who: { name: 'A Visiting Chaplain', role: 'Bearer of Requests', look: { hue: 50, hat: 'mitre' } }, fallback: true, weight: 0.5, cooldown: 3,
    text: "A chaplain presents the day's correspondence with a face like closed shutters. A bishop wants a window mended; a duke wants an honour; a minor lord wants to be seen being forgiven for something.",
    left: { label: 'Grant favours generously', style: 'charm', fx: { m: { loy: 2, res: -2 } }, result: 'A dozen small obligations are created, and you will not know which of them matter for months.' },
    right: { label: 'Answer none until asked twice', style: 'restraint', fx: { m: { auth: 2, loy: -1 } }, result: 'Half the letters are never asked about again. The other half are asked about with great politeness.' },
  },
  {
    id: 'routine_gossip', title: 'IDLE TALK', theme: 'secrets', char: 'crowd', who: { name: 'A Cheerful Lady-in-Waiting', role: 'Court Gossip', look: { hue: 320, hat: 'veil' } }, fallback: true, weight: 0.5, cooldown: 3,
    text: "She pours tea and says nothing important for twenty minutes, which is exactly how you learn things. By the end you know who has quarrelled, who is ill and who is spending beyond their means.",
    left: { label: 'Listen and learn', style: 'restraint', fx: { m: { rep: 1, loy: 1 } }, result: 'You do not use any of it. You simply notice who looks at whom, from now on.' },
    right: { label: 'Change the subject', style: 'candour', fx: { m: { rep: -1, auth: 1 } }, result: 'She laughs, delighted, and tells a different story instead.' },
  },
];
