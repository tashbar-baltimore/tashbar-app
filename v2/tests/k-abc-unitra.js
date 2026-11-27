/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, Review week A (v2/app/k-abc/units/ura.js).
   The same checks as Unit 1 (k-abc-unit1.js): every game played to the end with a real mouse at Chromebook size (one wrong move each,
   a gentle fix must follow), the first rounds at phone size with everything on the screen, a perfect check = 3 stars, short spoken lines,
   no letter names, big buttons, the menu row in order. */
const { unitTest } = require('./k-abc-unit1.js');
module.exports = unitTest('ra', ['opener', 'bingo', 'chalk', 'catch', 'bridge', 'speed', 'check'], { noWrong: ['opener', 'chalk'], name: 'review week A' });
