/* Unit 8 opener (Picture Story): Moshe in the kitchen with Mommy.
   A shoe turns into Shin; Shin's dot hops to the left and it is Sin. A table turns into Tav; Tav's dot floats away and it is Sav.
   The pictures go by the first sound of their English name (HoS). Then the look-alikes side by side (the dot's side; Hei, Ches and Tav),
   a chant of all 27 letters, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  const CUE = { 'sin>shin': 'Shin has its dot on the right. Tap Shin!', 'shin>sin': 'Sin has its dot on the left. Tap Sin!', 'sav>tav': 'Tav has a dot inside. Tap Tav!', 'tav>sav': 'Sav has no dot. Tap Sav!', 'ches>tav': 'Tav has a foot at the bottom. Tap Tav!', 'ches>sav': 'Sav has a foot at the bottom. Tap Sav!' };
  return makeStory(E, unit, {
    boy: E => E.moshe(), grown: E => E.mommy(),
    intro: ['This is Moshe. He is in the kitchen with Mommy!'],
    steps: [
      { pic: 'shoe', lines: ['Moshe finds his shoe under the chair.', ['A shoe! Shoe starts with', S('sh'), '.']], letter: 'shin', after: [['Shin says', S('sh'), '.'], 'Shin has its dot on the right.'] },
      { fromDot: 'shin', move: true, letter: 'sin', lines: ['The dot hopped to the left. This is Sin!', ['Sin says', S('s'), '.']] },
      { pic: 'table', near: 'grown', lines: ['Mommy and Moshe set the table.', ['A table! Table starts with', S('t'), '.']], letter: 'tav', after: [['Tav says', S('t'), '.'], 'Tav has a dot inside.'] },
      { fromDot: 'tav', letter: 'sav', lines: ['No dot. This is Sav!', ['Sav says', S('s'), ', just like Sin.']] },
    ],
    lookalikes: [['shin', 'sin', 'Shin has its dot on the right.', 'Sin has its dot on the left.'],
      { keys: ['hei', 'ches', 'tav'], vs: ['ches', 'hei', 'ches'], lines: ['Hei’s leg doesn’t touch the roof.', 'Ches’s leg touches the roof.', 'Tav has a foot at the bottom.'] }],
    tapCue: (got, want) => CUE[got + '>' + want],
  });
}
