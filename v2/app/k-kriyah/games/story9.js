/* Unit 9 opener (Picture Story): Erev Shabbos in the kitchen. Shloimy puts on his Shabbos clothes, and so do five letters:
   at the end of a word, Chaf, Mem, Nun, Fei and Tzadik put on their "Shabbos clothes" (their final form) and keep their sound.
   Then the look-alikes side by side (Samech round at the bottom, Mem Sofis square; Vov stops at the line, Nun Sofis has a long leg),
   the partners chanted in pairs ("Mem, Mem Sofis"), and he taps each new letter. Every line is 12 words or fewer. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  const step = (k, f, extra) => ({ dress: k, letter: f, before: ['This is ' + E.LETTERS[k].name + '.', ...(extra || [])], lines: ['Now it is ' + E.LETTERS[f].name + '!', ['It still says', S(E.LETTERS[k].snd), ', just like ' + E.LETTERS[k].name + '.']] });
  return makeStory(E, unit, {
    boy: E => E.shloimy(),
    intro: ['This is Shloimy. It is Erev Shabbos!', 'Shloimy puts on his Shabbos clothes.', 'Some letters have Shabbos clothes too!', 'They wear them at the end of a word.'],
    steps: [
      step('chaf', 'chafsofis', ['At the end of a word, Chaf gets dressed up!']),
      step('mem', 'memsofis', ['Watch Mem put on Shabbos clothes!']),
      step('nun', 'nunsofis'),
      step('fei', 'feisofis'),
      step('tzadik', 'tzadiksofis'),
    ],
    lookalikes: [['samech', 'memsofis', 'Samech is round at the bottom.', 'Mem Sofis is square at the bottom.'], ['vov', 'nunsofis', 'Vov stops at the line.', 'Nun Sofis has a long leg.']],
    row: ['chaf', 'chafsofis', 'mem', 'memsofis', 'nun', 'nunsofis', 'fei', 'feisofis', 'tzadik', 'tzadiksofis'],
    chantLine: 'Let’s sing the partners!',
    endLine: 'Wonderful! You know every letter in Shabbos clothes!',
    tapLine: 'Now you! Tap each letter in Shabbos clothes.',
  });
}
