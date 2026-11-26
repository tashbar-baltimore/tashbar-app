/* Unit 9 opener (Picture Story): Erev Shabbos in the kitchen. Shloimy puts on his Shabbos clothes, and so do five letters:
   at the end of a word, Chaf, Mem, Nun, Fei and Tzadik put on their "Shabbos clothes" (their final form) and keep their sound.
   Then the look-alikes side by side (Samech round at the bottom, Mem Sofis square; Vov stops at the line, Nun Sofis has a long leg),
   the partners chanted in pairs ("Mem, Mem Sofis"), and he taps each new letter. Every line is 12 words or fewer. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { S } = E;
  const step = (k, f, extra, short) => ({ dress: k, letter: f, before: short ? [E.LETTERS[k].name + ' gets dressed up!'] : ['This is ' + E.LETTERS[k].name + '.', ...(extra || [])], lines: ['Now it is ' + E.LETTERS[f].name + '!', ['It still says', S(E.LETTERS[k].snd), ', just like ' + E.LETTERS[k].name + '.']] });
  return makeStory(E, unit, {
    boy: E => E.shloimy(),
    extra: (E, props) => {   /* the Shabbos table: a white cloth, two silver candlesticks (not lit yet) and the challos under their cover */
      const { THREE } = E, t = new THREE.Group(); props.add(t);
      t.add(E.mesh(E.rbox(2.2, .1, 1.1, .04), E.M(0xffffff, { roughness: .6 }), 0, .9, 0)); [-.95, .95].forEach(x => t.add(E.mesh(new THREE.CylinderGeometry(.05, .05, .9, 10), E.M(0x8a5a3c), x, .45, 0)));
      const silver = E.M(0xdfe4ea, { metalness: .85, roughness: .2 });
      [-.6, -.25].forEach(x => { t.add(E.mesh(new THREE.CylinderGeometry(.09, .13, .06, 16), silver, x, .98, -.2)); t.add(E.mesh(new THREE.CylinderGeometry(.04, .05, .45, 12), silver, x, 1.2, -.2)); t.add(E.mesh(new THREE.CylinderGeometry(.035, .035, .25, 10), E.M(0xfffaf0), x, 1.55, -.2)); });
      const cover = E.mesh(E.rbox(.8, .22, .5, .1), E.M(0x2b47a8, { roughness: .6 }), .45, 1.05, 0); t.add(cover); t.add(E.mesh(new THREE.BoxGeometry(.82, .03, .52), E.M(0xf2c14e, { metalness: .5, roughness: .3 }), .45, 1.0, 0));
      E.onLayout(p => { t.position.set(p ? 1.2 : 4.4, 0, p ? -1.0 : .4); t.scale.setScalar(p ? .7 : 1); });
    },
    intro: ['This is Shloimy. It is Erev Shabbos!', 'Shloimy puts on his Shabbos clothes.', 'Some letters have Shabbos clothes too!', 'They wear them at the end of a word.'],
    steps: [
      step('chaf', 'chafsofis', ['At the end of a word, Chaf gets dressed up!']),
      step('mem', 'memsofis', ['Watch Mem put on Shabbos clothes!']),
      step('nun', 'nunsofis', null, true),
      step('fei', 'feisofis', null, true),
      step('tzadik', 'tzadiksofis', null, true),
    ],
    lookalikes: [['samech', 'memsofis', 'Samech is round at the bottom.', 'Mem Sofis is square at the bottom.'], ['vov', 'nunsofis', 'Vov stops at the line.', 'Nun Sofis has a long leg.']],
    row: ['chaf', 'chafsofis', 'mem', 'memsofis', 'nun', 'nunsofis', 'fei', 'feisofis', 'tzadik', 'tzadiksofis'],
    chantLine: 'Let’s sing the partners!',
    endLine: 'Wonderful! You know every letter in Shabbos clothes!',
    tapLine: 'Now you! Tap each letter in Shabbos clothes.',
  });
}
