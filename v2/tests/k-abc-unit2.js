/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, Unit 2 "First sounds: s a t p" (v2/app/k-abc/units/u2.js).
   The same checks as Unit 1 (k-abc-unit1.js): every game played to the end with a real mouse at Chromebook size, the first rounds at
   phone size with everything on the screen, a gentle fix after a wrong move, 3 stars for perfect play, short spoken lines, big buttons,
   and the menu row in order. Tracing games trace every stroke of the letter with a lifted finger between strokes. */
const { unitTest } = require('./k-abc-unit1.js');
module.exports = unitTest(2, ['opener', 's-meet', 's-trace', 's-hunt', 'a-meet', 'a-trace', 'a-hunt', 't-meet', 't-trace', 't-hunt', 'slide',
  'p-meet', 'p-trace', 'p-hunt', 'slide2', 'story', 'fixit', 'review', 'check'], { noWrong: ['opener', 's-trace', 'a-trace', 't-trace', 'p-trace'], name: 'unit 2 (s a t p)' });
