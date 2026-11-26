/* Unit 7 opener (Picture Story): Tzvi plays in the playroom with Mommy.
   Tzitzis turn into Tzadik, a kite into Kuf, and a toy rabbit into Reish (English words; tzitzis is a word every boy knows).
   Then the look-alikes side by side (Daled's corner and Reish's round top; Hei's short leg and Kuf's long one), a chant of every letter so far, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  return makeStory(E, unit, {
    boy: E => E.tzvi(), grown: E => E.mommy(),
    intro: ['This is Tzvi. He is playing in the playroom!'],
    steps: [
      { pic: 'tzitzis', lines: ['Tzvi gets dressed. He puts on his tzitzis.'], letter: 'tzadik', after: ['Tzitzis starts with Tzadik.', ['Tzadik says', S('tz')]] },
      { pic: 'kite', near: 'grown', lines: ['Mommy finds his kite.'], letter: 'kuf', after: [['Kite starts with', S('k'), '.'], ['Kuf says', S('k'), '.'], 'Kuf sounds just like Kaf!'] },
      { pic: 'rabbit', lines: ['Tzvi hugs his toy rabbit.'], letter: 'reish', after: [['Rabbit starts with', S('r'), '.'], ['Reish says', S('r'), ', like rabbit!']] },
    ],
    lookalikes: [['daled', 'reish', 'Daled has a corner.', 'Reish is round on top.'], ['hei', 'kuf', 'Hei has a short leg.', 'Kuf has a long leg.']],
  });
}
