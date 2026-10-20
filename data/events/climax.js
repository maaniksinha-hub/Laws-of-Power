// Late-reign events (retirement, succession, coalition) and low-stakes fallback cards that keep the deck from ever running dry.

export default [
  {
    id: 'retire_offer', title: 'LEAVE WHILE THEY SAY PLEASE', theme: 'timing', char: 'aldric', once: true, weight: 0.6,
    when: { turn: [27, null], rank: [2, null], meter: { auth: [45, null], rep: [45, null] } },
    text: "The king sees you alone. 'A barony in the north, a pension and my thanks, {t},' he says. 'Leave while they still say please. In my experience that season is very short.'",
    left: { label: 'Accept the retirement', style: 'restraint', memo: "You accepted the king's offer to retire.", fx: { end: 'negotiated_exit' }, result: 'You kneel, you thank him, and you mean about half of it.' },
    right: { label: 'Say no, with thanks', style: 'charm', fx: { m: { rep: 4, auth: 4 }, chars: { aldric: { trust: -12, suspicion: 10 } } }, result: "The king's smile is a very old one. 'Of course,' he says. 'Ambition is a kind of loyalty, I suppose.'" },
    lesson: { law: 47, left: 'Stepping away at the top turns a life of work into a good ending. Few who rise this high choose it.', right: 'Staying means the next test is harder. And the one who offered you a way out has noted your answer.' },
  },
  {
    id: 'king_death', title: 'THE BELLS WILL NOT STOP', theme: 'ambition', char: 'aldric', story: true, urgent: true, once: true, major: true, when: { turn: [30, null] },
    text: 'The king is dead. The bells have not stopped. The heir is eleven and scared. The council is hungry. Every eye is on you as the steward asks who will rule the kingdom for the boy.',
    left: {
      label: 'Take charge of the kingdom', style: 'force', memo: 'You took charge of the kingdom.', fx: { chars: { aldric: { status: 'dead' } } },
      branches: [
        { when: { meter: { auth: [55, null], rep: [45, null], loy: [45, null] }, notFlags: ['coalition'] }, fx: { flags: ['regent'], m: { rep: 6, auth: 6 } }, result: 'Nobody moves to stop you. By dusk, the royal seal is on your desk.' },
        { when: { meter: { rep: [40, null] } }, fx: { end: 'exiled_alive' }, result: 'The council says no, politely. A ship is arranged for you, and a pension, also politely.' },
        { fx: { end: 'overthrown' }, result: 'You reach for the crown and find a dozen hands already on it.' },
      ],
    },
    right: {
      label: 'Back the boy and guide him', style: 'restraint', memo: 'You backed the young heir.', fx: { chars: { aldric: { status: 'dead' } }, m: { auth: 5, loy: 5, rep: 3 }, flags: ['heir_guardian'] },
      branches: [
        { when: { flags: ['tutor_heir'] }, fx: { m: { loy: 6, rep: 4 } }, result: 'The boy is crowned. He looks for you in the crowd first, finds you, and takes a very deep breath.' },
        { when: { flags: ['heir_promised'] }, fx: { chars: { isaura: { trust: 20 } }, m: { auth: 4 } }, result: 'The boy is crowned. In the gallery, a veiled figure is seen to nod once.' },
        { when: { flags: ['isaura_hostile'] }, fx: { chars: { isaura: { resent: 20 } }, m: { auth: -4 } }, result: 'The boy is crowned. In the gallery, a veiled figure does not clap.' },
      ],
      result: 'The boy is crowned, and he holds your hand through the whole ceremony.',
    },
    lesson: { law: 41, left: "Taking the dead king's chair means people compare you to him for life, including those who loved or feared him.", right: 'Ruling through the heir gives you power without the comparison. It also ties your fate to a child and to those who raise him.' },
  },
  {
    id: 'coalition_moves', title: 'FOUR CHAIRS, ONE DINNER', theme: 'fear', char: 'crowd', who: { name: 'A Scared Page', role: 'Messenger', look: { hue: 60, hat: 'cap' } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "A page slips you a folded note with no name. 'Four chairs, four grudges, one dinner. They meet tonight to split up your jobs.' Your enemies have stopped fighting each other. That is the most dangerous thing they could do.",
    left: {
      label: 'Break the group: pay off its weakest link', style: 'pragmatism', memo: 'You bought off one of the group against you.',
      fx: {},
      branches: [
        { when: { meter: { res: [25, null] } }, fx: { m: { res: -15 }, chars: { $topEnemy: { resent: -25, trust: 10 } }, flags: ['coalition_broken'] }, result: 'You buy the angriest of them a lot of promises. The dinner is much quieter than planned.' },
        { fx: { queue: [{ id: 'coalition_strikes', delay: 2 }] }, result: 'You cannot afford them. They sense it, and the dinner becomes a vote.' },
      ],
    },
    right: {
      label: 'Strike first at the loudest one', style: 'force', memo: 'You struck first at the group against you.',
      fx: {},
      branches: [
        { when: { meter: { auth: [50, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 6, rep: -6 } }, result: 'Before dessert, their host is arrested. The others suddenly remember other plans.' },
        { fx: { m: { auth: -4 }, queue: [{ id: 'coalition_strikes', delay: 2 }] }, result: 'Your guard is half a step slow. The group takes it as an invitation.' },
      ],
    },
    lesson: { law: 42, left: 'Pulling off the weakest link breaks a group cheaply, if you can pay. It fails when you are the one short of coin.', right: 'Striking the loudest voice works only if your power survives being seen. A blow without strength makes the group stronger.' },
  },
  {
    id: 'coalition_strikes', title: 'THE EAST GATE', theme: 'fear', char: 'crowd', who: { name: 'The Captain of the Guard', role: 'Your Last Loyal Officer', look: { hue: 10, hat: 'helm' } }, story: true, urgent: true, once: true, major: true, when: { flags: ['coalition'] },
    text: "The captain bursts in, out of breath. 'They have the east gate, {t}. Four noble houses, two hundred men. They want you gone by dawn, and alive if you are sensible.'",
    left: {
      label: 'Stand and fight', style: 'force',
      branches: [
        { when: { meter: { auth: [40, null], loy: [45, null] } }, fx: { chars: { $topEnemy: { status: 'exiled' } }, m: { auth: 5, loy: -5 }, clear: ['coalition'] }, result: 'More people stay loyal than the captain feared. By dawn, the gate is yours again.' },
        { fx: { end: 'overthrown' }, result: 'The captain falls on the stairs. The rest of the guard remembers it has families.' },
      ],
    },
    right: { label: 'Ask for terms to give up', style: 'restraint', fx: { end: 'exiled_alive' }, result: 'You leave by the harbour gate with a purse, a promise and your head.' },
    lesson: { law: 22, left: 'A last stand works only if the friends and power were in place before the doors broke.', right: 'Giving up on your own terms saves your life and loses everything else. It is the last move in a game you were already losing.' },
  },
  {
    id: 'final_session', title: 'THE COUNCIL HEARS YOUR STORY', theme: 'reputation', char: 'crowd', who: { name: 'The Council Clerk', role: 'Keeper of the Record', look: { hue: 220, hat: 'coif' } }, story: true, urgent: true, once: true, when: { turn: [38, null] },
    text: 'The council meets to hear the story of your time at court. The clerk puts down the record book, and the room goes quiet in the way that means everyone has prepared something.',
    left: {
      label: 'Tell your own story', style: 'charm', fx: { m: { rep: 4, auth: 2 } },
      branches: [{ when: { stat: { manipulations: [2, null] } }, fx: { m: { rep: -6 } }, result: 'Someone interrupts with receipts. Your record has more small notes than you remembered.' }],
      result: 'You speak well, and mostly truthfully. The room does the rest.',
    },
    right: { label: 'Let the facts speak', style: 'restraint', fx: { m: { rep: 2, loy: 4 } }, result: 'You say little. The record says a great deal, and mostly good.' },
    lesson: { law: 30, left: 'Telling your own story shapes how it is heard. A record with loose ends will be pulled apart.', right: 'Letting results speak shows calm. It relies on others to read them fairly. A strong record needs fewer words.' },
  },

  // ---- fallbacks: small, repeatable, never conditional ----
  {
    id: 'routine_petitions', title: 'THE MORNING AUDIENCE', theme: 'opportunity', char: 'crowd', who: { name: 'A Line of Petitioners', role: 'People of the Kingdom', look: { hue: 30, hat: 'none' } }, fallback: true, weight: 0.5, cooldown: 3,
    text: 'The morning audience is long and dull. A fight over a fence. A lost pig. A request to rename a bridge. Each person leaves sure that you listened to them alone.',
    left: { label: 'Hear every case in full', style: 'charm', fx: { m: { rep: 2, res: -1 } }, result: 'Hours later, the bridge is called Merrow Bridge, and Merrow is very pleased.' },
    right: { label: 'Let the clerks handle it', style: 'restraint', fx: { m: { auth: 1, loy: -1 } }, result: 'The clerks are quick. The petitioners are less impressed.' },
  },
  {
    id: 'routine_envoy', title: 'THE DAY\'S LETTERS', theme: 'negotiation', char: 'crowd', who: { name: 'A Visiting Priest', role: 'Bringer of Requests', look: { hue: 50, hat: 'mitre' } }, fallback: true, weight: 0.5, cooldown: 3,
    text: "A priest brings the day's letters with a face like a closed door. A bishop wants a window fixed. A duke wants an honour. A minor lord wants to be seen being forgiven for something.",
    left: { label: 'Give favours freely', style: 'charm', fx: { m: { loy: 2, res: -2 } }, result: 'A dozen small debts are made. You will not know which ones matter for months.' },
    right: { label: 'Answer nobody until they ask twice', style: 'restraint', fx: { m: { auth: 2, loy: -1 } }, result: 'Half the letters are never asked about again. The other half are asked about very politely.' },
  },
  {
    id: 'routine_gossip', title: 'IDLE TALK', theme: 'secrets', char: 'crowd', who: { name: 'A Cheerful Lady-in-Waiting', role: 'Court Gossip', look: { hue: 320, hat: 'veil' } }, fallback: true, weight: 0.5, cooldown: 3,
    text: 'She pours tea and says nothing important for twenty minutes, which is exactly how you learn things. By the end you know who has argued, who is ill, and who is spending too much.',
    left: { label: 'Listen and learn', style: 'restraint', fx: { m: { rep: 1, loy: 1 } }, result: 'You use none of it. From now on you just notice who looks at whom.' },
    right: { label: 'Change the subject', style: 'candour', fx: { m: { rep: -1, auth: 1 } }, result: 'She laughs, delighted, and tells a different story instead.' },
  },
];
