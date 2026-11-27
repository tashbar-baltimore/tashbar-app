/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, Unit 4 "g o c k ck e" (v2/app/k-abc/units/u4.js).
   The same checks as Unit 1 (k-abc-unit1.js): every game played to the end with a real mouse at Chromebook size (one wrong move each,
   a gentle fix must follow), the first rounds at phone size with everything on the screen, 3 stars for a perfect check, short spoken
   lines, no letter names, big buttons, the menu row in order. In peek-a-boo (c-hunt) he waits while a picture without the sound peeks. */
const { unitTest } = require('./k-abc-unit1.js');
module.exports = unitTest(4, ['opener', 'g-meet', 'g-trace', 'g-hunt', 'o-meet', 'o-trace', 'o-hunt', 'slide', 'c-meet', 'c-trace', 'c-hunt',
  'k-meet', 'k-trace', 'k-hunt', 'ksort', 'e-meet', 'e-trace', 'e-hunt', 'slide2', 'fixit', 'review', 'check'], { noWrong: ['opener', 'g-trace', 'o-trace', 'c-trace', 'k-trace', 'e-trace'], name: 'unit 4 (g o c k e)' });
