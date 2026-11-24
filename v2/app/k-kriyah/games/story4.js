/* Unit 4 opener (Picture Story): Dovid goes to the park with Tatty.
   A peacock (tavas) turns into Tes, a dove (yonah) into Yud, and a big ball (kadur) into Kaf; then Kaf's dot floats away and it is Chaf.
   Then the look-alikes side by side (Beis's tail and Kaf's round bottom; Kaf's dot), a chant of all thirteen letters, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  return makeStory(E, unit, {
    boy: E => E.dovid(), grown: E => E.tatty(),
    scene: (E, g) => {   /* the park: a bench, a lamp post and a sandy path */
      const wood = E.M(0xa86f3c, { roughness: .6 }), iron = E.M(0x2a3340, { roughness: .4, clearcoat: .6 });
      const bench = new THREE.Group(); [.0, .16, .32].forEach(z => bench.add(E.mesh(E.rbox(1.8, .07, .14, .02), wood, 0, .5, z))); [.6, .8].forEach(y => bench.add(E.mesh(E.rbox(1.8, .12, .05, .02), wood, 0, y, -.05)));
      [-.75, .75].forEach(x => bench.add(E.mesh(new THREE.BoxGeometry(.06, .5, .4), iron, x, .25, .15))); bench.position.set(4.8, 0, -1.2); bench.rotation.y = -.3; g.add(bench);
      const lamp = new THREE.Group(); lamp.add(E.mesh(new THREE.CylinderGeometry(.05, .07, 2.4, 10), iron, 0, 1.2, 0)); lamp.add(E.mesh(new THREE.SphereGeometry(.18, 16, 12), E.M(0xfff3c0, { emissive: 0xffe9a0, emissiveIntensity: .4 }), 0, 2.5, 0)); lamp.position.set(-5.2, 0, -1.5); g.add(lamp);
      const path = E.mesh(new THREE.PlaneGeometry(2.2, 14), E.M(0xe9d3a0, { roughness: .9 }), 6.8, .015, -2, false); path.rotation.x = -Math.PI / 2; path.rotation.z = .5; g.add(path); },
    intro: ['This is Dovid. He goes to the park with Tatty.'],
    steps: [
      { pic: 'tavas', lines: ['Look! A peacock opens its tail!', 'A peacock is a tavas.'], letter: 'tes', after: ['Tavas starts with Tes.', ['Tes says', S('t')]] },
      { pic: 'yonah', lines: ['A white dove lands on the path.', 'A dove is a yonah.'], letter: 'yud', after: ['Yonah starts with Yud. Yud is the little letter.', ['Yud says', S('y')]] },
      { pic: 'kadur', near: 'grown', lines: ['Tatty throws him a big ball!', 'A ball is a kadur.'], letter: 'kaf', after: ['Kadur starts with Kaf. Kaf has a dot.', ['Kaf says', S('k')]] },
      { fromDot: 'kaf', letter: 'chaf', lines: ['No dot. This is Chaf!', ['Chaf says', S('ch')], 'Chaf sounds just like Ches!'] },
    ],
    lookalikes: [['beis', 'kaf', 'Beis has a tail at the bottom.', 'Kaf is round at the bottom.'], ['kaf', 'chaf', 'Kaf has a dot.', 'Chaf has no dot.']],
  });
}
