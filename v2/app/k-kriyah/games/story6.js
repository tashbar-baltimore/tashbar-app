/* Unit 6 opener (Picture Story): Avi visits Zeidy's farm.
   The sun turns into Samech, then quiet Ayin comes, and a pear turns into Pei; then Pei's dot floats away and it is Fei (English words).
   Then the look-alikes side by side (Pei's little tongue inside; Pei's dot), a chant of every letter so far, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  return makeStory(E, unit, {
    boy: E => E.avi(), grown: E => E.zeidy(),
    intro: ['This is Avi. He visits Zeidy’s farm!'],
    steps: [
      { pic: 'sun', lines: ['The sun shines on the farm.'], letter: 'samech', after: [['Sun starts with', S('s'), '.'], ['Samech says', S('s'), ', like sun!']] },
      { pic: 'ayin-quiet', lines: ['Here comes a quiet letter.'], letter: 'ayin', after: ['This is Ayin.', 'Ayin is quiet, just like Alef.'] },
      { pic: 'pear', near: 'grown', lines: ['Zeidy picks a pear from the tree.'], letter: 'pei', after: [['Pear starts with', S('p'), '. Pei has a dot.'], ['Pei says', S('p'), ', like pear!']] },
      { fromDot: 'pei', letter: 'fei', lines: ['No dot. This is Fei!', ['Fei says', S('f')]] },
    ],
    lookalikes: [['kaf', 'pei', 'Kaf has no little tongue.', 'Pei has a little tongue inside.'], ['pei', 'fei', 'Pei has a dot.', 'Fei has no dot.']],
  });
}
