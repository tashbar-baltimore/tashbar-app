/* Unit 8 opener (Picture Story): Mendy goes to shul with Tatty on Simchas Torah.
   The shofar turns into Shin, Mendy's Simchas Torah flag into Sin (its dot on the other head), and the Torah gives Tuf
   (the Torah is never spun or shrunk: it steps back and the letter rises out of a soft light). Then Tuf's dot floats away: Suf.
   Then the look-alikes side by side (Shin's dot on the right, Sin's on the left; Ches with no foot, Tuf with a little foot),
   the WHOLE Alef-Beis chanted for the first time, and he taps each new letter. Every line is 12 words or fewer. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  return makeStory(E, unit, {
    boy: E => E.mendy(), grown: E => E.tatty(),
    intro: ['This is Mendy. He goes to shul with Tatty.', 'Today is Simchas Torah!'],
    steps: [
      { pic: 'shofar', near: 'grown', lines: ['Tatty shows Mendy the shofar from Rosh Hashanah.'], letter: 'shin', after: [['Shofar starts with', S('sh'), '.'], 'Shin has a dot on its right head.', ['Shin says', S('sh'), ', like shofar!']] },
      { pic: 'flag', lines: ['Mendy waves his Simchas Torah flag!'], letter: 'sin', after: [['Simchas Torah starts with', S('s'), '.'], 'Sin has a dot on its left head.', ['Sin says', S('s'), '.']] },
      { pic: 'torah', near: 'grown', keep: true, size: .8, lines: ['Tatty dances with the Torah!'], letter: 'tav', after: [['Torah starts with', S('t'), '.'], 'Tuf has a dot inside.', ['Tuf says', S('t'), ', like Torah!']] },
      { fromDot: 'tav', letter: 'sav', lines: ['No dot. This is Suf!', ['Suf says', S('s'), '.']] },
    ],
    lookalikes: [['shin', 'sin', 'Shin has its dot on the right.', 'Sin has its dot on the left.'], ['ches', 'tav', 'Ches has no foot.', 'Tuf has a little foot.']],
    chantLine: 'Now you know the whole Alef-Beis! Let’s sing it!',
  });
}
