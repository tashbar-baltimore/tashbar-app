/* Unit 5 opener (Picture Story): Eli has a picnic with Bubby.
   A lemon turns into Lamed, a mountain into Mem, and nuts into Nun (English words).
   Then the look-alikes side by side (Gimmel's foot and Nun's flat bottom; Tes closed and Mem open at the bottom), a chant of all sixteen letters, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  return makeStory(E, unit, {
    boy: E => E.eli(), grown: E => E.bubby(),
    scene: (E, g) => {   /* a checked picnic blanket and a basket */
      const bl = new THREE.Group(); for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) bl.add(E.mesh(new THREE.BoxGeometry(.4, .02, .4), E.M((i + j) % 2 ? 0xe8322b : 0xffffff, { roughness: .8 }), (i - 2.5) * .4, .01, (j - 1.5) * .4, false));
      bl.position.set(4.6, 0, -.6); bl.rotation.y = -.2; g.add(bl);
      const bk = new THREE.Group(), wk = E.M(0xc68a52, { roughness: .7 }); bk.add(E.mesh(E.rbox(.7, .4, .45, .06), wk, 0, .2, 0)); const h = E.mesh(new THREE.TorusGeometry(.28, .03, 8, 20, Math.PI), wk, 0, .4, 0); bk.add(h);
      bk.position.set(4.2, .02, -.5); g.add(bk); },
    intro: ['This is Eli. He has a picnic with Bubby.'],
    steps: [
      { pic: 'lemon', near: 'grown', lines: ['Bubby makes lemonade with a lemon.'], letter: 'lamed', after: [['Lemon starts with', S('l'), '.'], ['Lamed says', S('l'), ', like lemon!']] },
      { pic: 'mountain', lines: ['Eli sees a big mountain far away.'], letter: 'mem', after: [['Mountain starts with', S('m'), '.'], ['Mem says', S('m'), ', like mountain!']] },
      { pic: 'nut', near: 'grown', lines: ['Bubby brings nuts for a snack.'], letter: 'nun', after: [['Nut starts with', S('n'), '.'], ['Nun says', S('n'), ', like nut!']] },
    ],
    lookalikes: [['gimmel', 'nun', 'Gimmel has a foot.', 'Nun has no foot.'], ['tes', 'mem', 'Tes is closed at the bottom.', 'Mem has an opening at the bottom.']],
  });
}
