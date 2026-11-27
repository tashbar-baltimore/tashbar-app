/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, Unit 3 "i n m d" (v2/app/k-abc/units/u3.js).
   The same checks as Unit 1 (k-abc-unit1.js): every game played to the end with a real mouse at Chromebook size (one wrong move each,
   a gentle fix must follow), the first rounds at phone size with everything on the screen, 3 stars for a perfect check, short spoken
   lines, no letter names, big buttons, the menu row in order. In "drum only on d" a "wait" round passes when he does not tap. */
const { unitTest } = require('./k-abc-unit1.js');
module.exports = unitTest(3, ['opener', 'i-meet', 'i-trace', 'i-hunt', 'n-meet', 'n-trace', 'n-hunt', 'slide', 'boxes',
  'm-meet', 'm-trace', 'm-hunt', 'd-meet', 'd-trace', 'd-hunt', 'slide2', 'fixit', 'review', 'check'], { noWrong: ['opener', 'i-trace', 'n-trace', 'm-trace', 'd-trace'], name: 'unit 3 (i n m d)' });
