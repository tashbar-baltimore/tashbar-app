/* Unit 2 opener (Picture Story): Shloimy goes to the zoo with Tatty.
   A camel (gamal) turns into Gimmel, a bear (dov) into Daled, and a mountain (har) into Hei.
   Then Daled and Hei side by side, a chant of all six letters, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  return makeStory(E, unit, {
    boy: E => E.person({ kippah: 0x2e8b57, hair: 0x8a5a3c }),   /* Shloimy */
    grown: E => E.tatty(),
    scene: (E, g) => {   /* the zoo: wooden fences, a pond and big rocks */
      const wood = E.M(0xa86f3c, { roughness: .6 });
      [[-4.5, -2.2], [4.5, -2.4]].forEach(([x, z]) => { for (let i = 0; i < 6; i++) g.add(E.mesh(new THREE.CylinderGeometry(.06, .06, .9, 8), wood, x + (i - 2.5) * .5, .45, z)); [.3, .7].forEach(y => g.add(E.mesh(new THREE.BoxGeometry(2.9, .08, .06), wood, x, y, z + .05))); });
      const pond = E.mesh(new THREE.CircleGeometry(1.1, 32), new THREE.MeshPhysicalMaterial({ color: 0x4fb3ff, roughness: .05, clearcoat: 1 }), 5.2, .02, .6, false); pond.rotation.x = -Math.PI / 2; pond.scale.set(1.4, 1, 1); g.add(pond);
      [[-5.6, .2], [-6.2, -.3]].forEach(([x, z], i) => { const r = E.mesh(new THREE.SphereGeometry(.45 - i * .1, 14, 10), E.M(0xa8adb5, { roughness: .8 }), x, .15, z); r.scale.set(1.3, .7, 1); g.add(r); }); },
    intro: ['This is Shloimy. Today he goes to the zoo!', 'Tatty takes him. Let’s see the animals!'],
    steps: [
      { pic: 'gamal', lines: ['Look! A camel! A camel is a gamal.'], letter: 'gimmel', after: ['Gamal starts with Gimmel.', ['Gimmel says', S('g')]] },
      { pic: 'dov', lines: ['A big brown bear! A bear is a dov.'], letter: 'daled', after: ['Dov starts with Daled.', ['Daled says', S('d')]] },
      { pic: 'har', near: 'grown', lines: ['Tatty points to a mountain.', 'A mountain is a har.'], letter: 'hei', after: ['Har starts with Hei.', ['Hei says', S('h')]] },
    ],
    lookalikes: [['daled', 'hei', 'Daled has no little leg.', 'Hei has a little leg.']],
  });
}
