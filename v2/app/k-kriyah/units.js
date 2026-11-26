/* Kindergarten Kriyah: the units and their games, in skill order (from curriculum/k-kriyah/MAP.md, approved).
   Plain data, shared by the games, the path and the tests. A game opens at 2 of 3 stars on the one before it;
   a unit's first game opens when the unit before it passed its mastery check; a bonus round opens at 3 stars on its unit's check. */
export const UNITS = [
  { n: 1, letters: ['alef', 'beis', 'veis'], known: [],
    games: [
      { id: 'u1g0', name: 'Mendy’s first day', kind: 'story', icon: 'book' },
      { id: 'u1g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },   /* Alef first, then Beis and Veis: Alef-Beis order */
      { id: 'u1g2', name: 'Look-Alike Detective', kind: 'detective', icon: 'house' },
      { id: 'u1g3', name: 'Letter Hunt', kind: 'hunt', icon: 'glass' },
      { id: 'u1g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u1g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u1g6', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 2, letters: ['gimmel', 'daled', 'hei'], known: ['alef', 'beis', 'veis'],
    games: [
      { id: 'u2g0', name: 'Shloimy at the zoo', kind: 'story2', icon: 'balloon' },
      { id: 'u2g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u2g2', name: 'Sound Match', kind: 'soundmatch', icon: 'fish' },
      { id: 'u2g3', name: 'Alef-Beis Train', kind: 'train', icon: 'train' },
      { id: 'u2g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u2g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u2g6', name: 'Review: Beis and Veis', kind: 'detective', icon: 'house', review: true },
      { id: 'u2g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 3, letters: ['vov', 'zayin', 'ches'], known: ['alef', 'beis', 'veis', 'gimmel', 'daled', 'hei'],
    games: [
      { id: 'u3g0', name: 'Ari in the garden', kind: 'story3', icon: 'flower' },
      { id: 'u3g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u3g2', name: 'Look-Alike Detective', kind: 'sorter', icon: 'pair' },
      { id: 'u3g3', name: 'Letter Hunt', kind: 'hunt', icon: 'glass' },
      { id: 'u3g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u3g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u3g6', name: 'Review: Sound Match', kind: 'soundmatch', icon: 'fish', review: true, reviewOf: 2 },
      { id: 'u3g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 4, letters: ['tes', 'yud', 'kaf', 'chaf'], known: ['alef', 'beis', 'veis', 'gimmel', 'daled', 'hei', 'vov', 'zayin', 'ches'],
    games: [
      { id: 'u4g0', name: 'Dovid at the park', kind: 'story4', icon: 'ball' },
      { id: 'u4g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u4g2', name: 'Look-Alike Detective', kind: 'sorter', icon: 'pair', pairs: [['beis', 'kaf'], ['kaf', 'chaf']] },
      { id: 'u4g3', name: 'Sound Match', kind: 'soundmatch', icon: 'fish', stands: ['ches', 'tes', 'yud', 'kaf'] },   /* Ches (challah) comes back: Chaf sounds just like it */
      { id: 'u4g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u4g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u4g6', name: 'Review: Letter Hunt', kind: 'hunt', icon: 'glass', review: true, reviewOf: 3 },
      { id: 'u4g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 5, letters: ['lamed', 'mem', 'nun'], known: ['alef', 'beis', 'veis', 'gimmel', 'daled', 'hei', 'vov', 'zayin', 'ches', 'tes', 'yud', 'kaf', 'chaf'],
    games: [
      { id: 'u5g0', name: 'Eli’s picnic', kind: 'story5', icon: 'lemon' },
      { id: 'u5g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u5g2', name: 'Look-Alike Detective', kind: 'sorter', icon: 'pair', pairs: [['gimmel', 'nun'], ['tes', 'mem']] },
      { id: 'u5g3', name: 'Alef-Beis Train', kind: 'train', icon: 'train', order: ['yud', 'kaf', 'chaf', 'lamed', 'mem', 'nun'] },
      { id: 'u5g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u5g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u5g6', name: 'Review: Sound Match', kind: 'soundmatch', icon: 'fish', review: true, reviewOf: 4 },
      { id: 'u5g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 6, letters: ['samech', 'ayin', 'pei', 'fei'], known: ['alef', 'beis', 'veis', 'gimmel', 'daled', 'hei', 'vov', 'zayin', 'ches', 'tes', 'yud', 'kaf', 'chaf', 'lamed', 'mem', 'nun'],
    games: [
      { id: 'u6g0', name: 'Avi on the farm', kind: 'story6', icon: 'horse' },
      { id: 'u6g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u6g2', name: 'Look-Alike Detective', kind: 'sorter', icon: 'pair', pairs: [['kaf', 'pei'], ['pei', 'fei']] },
      { id: 'u6g3', name: 'Sound Match', kind: 'soundmatch', icon: 'fish' },
      { id: 'u6g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u6g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u6g6', name: 'Review: Look-Alikes', kind: 'sorter', icon: 'pair', review: true, pairs: [['gimmel', 'nun'], ['tes', 'mem']] },
      { id: 'u6g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 7, letters: ['tzadik', 'kuf', 'reish'], known: ['alef', 'beis', 'veis', 'gimmel', 'daled', 'hei', 'vov', 'zayin', 'ches', 'tes', 'yud', 'kaf', 'chaf', 'lamed', 'mem', 'nun', 'samech', 'ayin', 'pei', 'fei'],
    games: [
      { id: 'u7g0', name: 'Tzvi in the playroom', kind: 'story7', icon: 'train' },
      { id: 'u7g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u7g2', name: 'Look-Alike Detective', kind: 'sorter', icon: 'pair', pairs: [['daled', 'reish'], ['hei', 'kuf']] },
      { id: 'u7g3', name: 'Sound Match', kind: 'soundmatch', icon: 'fish' },   /* Beis comes back; Kaf is never a stand beside Kuf (both say k): it joins Kuf at the end */
      { id: 'u7g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u7g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u7g6', name: 'Review: Look-Alikes', kind: 'sorter', icon: 'pair', review: true, pairs: [['kaf', 'pei'], ['pei', 'fei']] },   /* Unit 6's look-alikes come back */
      { id: 'u7g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 8, letters: ['shin', 'sin', 'tav', 'sav'], known: ['alef', 'beis', 'veis', 'gimmel', 'daled', 'hei', 'vov', 'zayin', 'ches', 'tes', 'yud', 'kaf', 'chaf', 'lamed', 'mem', 'nun', 'samech', 'ayin', 'pei', 'fei', 'tzadik', 'kuf', 'reish'],
    games: [   /* the world of Unit 8: a festive shul on Simchas Torah (engine.js buildShul) */
      { id: 'u8g0', name: 'Simchas Torah in shul', kind: 'story8', icon: 'flag', world: { indoor: 'shul' } },
      { id: 'u8g1', name: 'Dot Builder', kind: 'dotbuild', icon: 'dot', world: { indoor: 'shul' } },   /* new: he puts the dot in its place */
      { id: 'u8g2', name: 'Look-Alike Detective', kind: 'sorter', icon: 'pair', pairs: [['ches', 'tav'], ['hei', 'ches', 'tav']], world: { indoor: 'shul' } },   /* new: three boxes */
      { id: 'u8g3', name: 'Alef-Beis Train', kind: 'train', icon: 'train', order: ['tzadik', 'kuf', 'reish', 'shin', 'sin', 'tav', 'sav'], swap: true, world: { indoor: 'shul' } },   /* new: fix Yaakov's mixed-up cars */
      { id: 'u8g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think', world: { indoor: 'shul' } },   /* new: Yaakov says the sound, not the name */
      { id: 'u8g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u8g6', name: 'Review: Letter Hunt', kind: 'hunt', icon: 'glass', review: true, reviewOf: 7 },   /* Unit 7's Kuf and Reish, hidden in the sukkah */
      { id: 'u8g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 9, letters: ['chafsofis', 'memsofis', 'nunsofis', 'feisofis', 'tzadiksofis'], known: ['alef', 'beis', 'veis', 'gimmel', 'daled', 'hei', 'vov', 'zayin', 'ches', 'tes', 'yud', 'kaf', 'chaf', 'lamed', 'mem', 'nun', 'samech', 'ayin', 'pei', 'fei', 'tzadik', 'kuf', 'reish', 'shin', 'sin', 'tav', 'sav'],
    games: [   /* the world of Unit 9: Erev Shabbos in the kitchen (the painted kitchen) */
      { id: 'u9g0', name: 'Shabbos clothes', kind: 'story9', icon: 'shirt' },
      { id: 'u9g1', name: 'Partner Match', kind: 'partners', icon: 'link' },   /* new: each final letter finds its partner */
      { id: 'u9g2', name: 'End of the Word', kind: 'endword', icon: 'star' },   /* new: Shabbos clothes only at the end */
      { id: 'u9g3', name: 'Spot the Difference', kind: 'spotdiff', icon: 'glass' },   /* new twist on the Look-Alike Detective: he finds the difference himself */
      { id: 'u9g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },   /* new: Yaakov writes a whole word */
      { id: 'u9g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u9g6', name: 'Review: Dot Builder', kind: 'dotbuild', icon: 'dot', review: true, bg: null, world: { indoor: 'shul' } },   /* Unit 8 comes back, in the shul */
      { id: 'u9g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
];
/* every game in order, each knowing its unit */
export const GAMES = UNITS.flatMap(u => u.games.map(g => ({ ...g, unit: u.n })));
export const unitOf = id => UNITS.find(u => u.games.some(g => g.id === id));
