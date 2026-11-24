/* Unit 6 opener (Picture Story): Avi visits Zeidy's farm.
   A horse (sus) turns into Samech, a tree (eitz) into Ayin, and a butterfly (parpar) into Pei; then Pei's dot floats away and it is Fei.
   Then the look-alikes side by side (Pei's little tongue inside; Pei's dot), a chant of every letter so far, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  return makeStory(E, unit, {
    boy: E => E.avi(), grown: E => E.zeidy(),
    intro: ['This is Avi. He visits Zeidy’s farm!'],
    steps: [
      { pic: 'sus', near: 'grown', lines: ['Zeidy shows him a brown horse.', 'A horse is a sus.'], letter: 'samech', after: ['Sus starts with Samech.', ['Samech says', S('s')]] },
      { pic: 'eitz', lines: ['They sit under a big tree.', 'A tree is an eitz.'], letter: 'ayin', after: ['Eitz starts with Ayin.', 'Ayin is quiet, like Alef.'] },
      { pic: 'parpar', lines: ['A butterfly lands on Avi’s hand!', 'A butterfly is a parpar.'], letter: 'pei', after: ['Parpar starts with Pei. Pei has a dot.', ['Pei says', S('p')]] },
      { fromDot: 'pei', letter: 'fei', lines: ['No dot. This is Fei!', ['Fei says', S('f')]] },
    ],
    lookalikes: [['kaf', 'pei', 'Kaf has no little tongue.', 'Pei has a little tongue inside.'], ['pei', 'fei', 'Pei has a dot.', 'Fei has no dot.']],
  });
}
