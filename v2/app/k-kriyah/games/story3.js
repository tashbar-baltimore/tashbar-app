/* Unit 3 opener (Picture Story): Ari plays in the garden while Mommy waters the flowers.
   A vase turns into Vov, a zipper into Zayin, and a challah into Ches (English words; challah is a word every boy knows).
   Then the look-alikes side by side (Zayin's crown; Ches's leg on the roof), a chant of all nine letters, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  return makeStory(E, unit, {
    boy: E => E.ari(), grown: E => E.mommy(),
    scene: (E, g) => {   /* flower beds and a watering can */
      const soil = E.M(0x7a4a2a, { roughness: .9 }), cols = [0xff6fa5, 0xffffff, 0xb388ff, 0xff8a3d];
      [[-5, -1.4], [5, -1.6]].forEach(([x, z]) => { g.add(E.mesh(E.rbox(2.6, .25, .9, .05), soil, x, .12, z));
        for (let i = 0; i < 7; i++) { const fx = x + (i - 3) * .35; g.add(E.mesh(new THREE.CylinderGeometry(.02, .02, .45, 5), E.M(0x2f8f3a), fx, .45, z)); g.add(E.mesh(new THREE.SphereGeometry(.1, 10, 8), E.M(cols[i % 4], { roughness: .3 }), fx, .7, z)); } });
      const can = new THREE.Group(), cm = E.M(0x46c3ff, { roughness: .3, clearcoat: 1 }); can.add(E.mesh(new THREE.CylinderGeometry(.18, .2, .32, 18), cm, 0, .16, 0));
      const sp = E.mesh(new THREE.CylinderGeometry(.03, .045, .4, 8), cm, .25, .3, 0); sp.rotation.z = -.9; can.add(sp); can.position.set(-2.9, 0, 1.6); g.add(can); },
    intro: ['This is Ari. He plays in the garden.', 'Look at all the flowers!'],
    steps: [
      { pic: 'vase', near: 'grown', lines: ['Mommy puts flowers in a vase.'], letter: 'vov', after: [['Vase starts with', S('v'), '.'], ['Vov says', S('v'), ', like vase!'], ['Vov says', S('v'), '.']] },
      { pic: 'zipper', lines: ['Ari zips up. Zzzip!'], letter: 'zayin', after: [['Zipper starts with', S('z'), '.'], ['Zayin says', S('z'), ', like zipper!']] },
      { pic: 'challah', near: 'grown', lines: ['Mommy brings out a warm challah.'], letter: 'ches', after: [['Challah starts with', S('ch'), '.'], ['Ches says', S('ch')]] },
    ],
    lookalikes: [['vov', 'zayin', 'Vov has no crown.', 'Zayin has a crown on top.'], ['hei', 'ches', 'Hei’s little leg doesn’t touch the roof.', 'Ches’s leg touches the roof.']],
  });
}
