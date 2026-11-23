/* Kindergarten Kriyah: the units and their games, in skill order (from curriculum/k-kriyah/MAP.md, approved).
   Plain data, shared by the games, the path and the tests. A game opens at 2 of 3 stars on the one before it;
   a unit's first game opens when the unit before it passed its mastery check; a bonus round opens at 3 stars on its unit's check. */
export const UNITS = [
  { n: 1, letters: ['alef', 'beis', 'veis'], known: [],
    games: [
      { id: 'u1g0', name: 'Mendy’s first day', kind: 'story', icon: 'book' },
      { id: 'u1g1', name: 'Look-Alike Detective', kind: 'detective', icon: 'house' },
      { id: 'u1g2', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u1g3', name: 'Letter Hunt', kind: 'hunt', icon: 'glass' },
      { id: 'u1g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u1g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u1g6', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
  { n: 2, letters: ['gimmel', 'daled', 'hei'], known: ['alef', 'beis', 'veis'],
    games: [
      { id: 'u2g0', name: 'Shloimy visits Zeidy', kind: 'story2', icon: 'grapes' },
      { id: 'u2g1', name: 'Feel the Shape', kind: 'feel', icon: 'hand' },
      { id: 'u2g2', name: 'Sound Match', kind: 'soundmatch', icon: 'fish' },
      { id: 'u2g3', name: 'Alef-Beis Train', kind: 'train', icon: 'train' },
      { id: 'u2g4', name: 'Find the Mistake', kind: 'mistake', icon: 'think' },
      { id: 'u2g5', name: 'Show what you know', kind: 'mastery', icon: 'trophy', mastery: true },
      { id: 'u2g6', name: 'Review: Beis and Veis', kind: 'detective', icon: 'house', review: true },
      { id: 'u2g7', name: 'Bonus: letter rain', kind: 'bonus', icon: 'rocket', bonus: true },
    ] },
];
/* every game in order, each knowing its unit */
export const GAMES = UNITS.flatMap(u => u.games.map(g => ({ ...g, unit: u.n })));
export const unitOf = id => UNITS.find(u => u.games.some(g => g.id === id));
