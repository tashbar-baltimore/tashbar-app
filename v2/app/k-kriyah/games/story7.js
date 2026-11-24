/* Unit 7 opener (Picture Story): Tzvi plays in the playroom with Mommy.
   A bird (tzipor) turns into Tzadik, a toy monkey (kof) into Kuf, and a toy train (rakevet) into Reish.
   Then the look-alikes side by side (Daled's corner and Reish's round top; Hei's short leg and Kuf's long one), a chant of every letter so far, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  return makeStory(E, unit, {
    boy: E => E.tzvi(), grown: E => E.mommy(),
    intro: ['This is Tzvi. He is playing in the playroom!'],
    steps: [
      { pic: 'tzipor', lines: ['A bird sings at the window.', 'A bird is a tzipor.'], letter: 'tzadik', after: ['Tzipor starts with Tzadik.', ['Tzadik says', S('tz')]] },
      { pic: 'kof', near: 'grown', lines: ['Mommy finds his toy monkey.', 'A monkey is a kof.'], letter: 'kuf', after: ['Kof starts with Kuf.', ['Kuf says', S('k')], 'Kuf sounds just like Kaf!'] },
      { pic: 'rakevet', lines: ['Tzvi drives his toy train. Choo choo!', 'A train is a rakeves.'], letter: 'reish', after: ['Rakeves starts with Reish.', ['Reish says', S('r')]] },
    ],
    lookalikes: [['daled', 'reish', 'Daled has a corner.', 'Reish is round on top.'], ['hei', 'kuf', 'Hei has a short leg.', 'Kuf has a long leg.']],
  });
}
