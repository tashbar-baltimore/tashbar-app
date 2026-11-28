/* Unit 2 opener (Picture Story): Shloimy goes to the zoo with Tatty.
   Grapes turn into Gimmel, a donkey into Daled, and a waving hand into Hei (English words: the boys' first language is English).
   Then Daled and Hei side by side, a chant of all six letters, and he taps each new one. */
import { makeStory } from './storykit.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  return makeStory(E, unit, {
    boy: E => E.pictureCard('shloimy', () => E.person({ kippah: 0x2e8b57, hair: 0x8a5a3c })),   /* Shloimy */
    grown: E => E.tatty(),
    scene: (E, g) => {   /* the zoo: wooden fences, a pond and big rocks */
      const wood = E.M(0xa86f3c, { roughness: .6 });
      [[-4.5, -2.2], [4.5, -2.4]].forEach(([x, z]) => { for (let i = 0; i < 6; i++) g.add(E.mesh(new THREE.CylinderGeometry(.06, .06, .9, 8), wood, x + (i - 2.5) * .5, .45, z)); [.3, .7].forEach(y => g.add(E.mesh(new THREE.BoxGeometry(2.9, .08, .06), wood, x, y, z + .05))); });
      const pond = E.mesh(new THREE.CircleGeometry(1.1, 32), new THREE.MeshPhysicalMaterial({ color: 0x4fb3ff, roughness: .05, clearcoat: 1 }), 5.2, .02, .6, false); pond.rotation.x = -Math.PI / 2; pond.scale.set(1.4, 1, 1); g.add(pond);
      [[-5.6, .2], [-6.2, -.3]].forEach(([x, z], i) => { const r = E.mesh(new THREE.SphereGeometry(.45 - i * .1, 14, 10), E.M(0xa8adb5, { roughness: .8 }), x, .15, z); r.scale.set(1.3, .7, 1); g.add(r); }); },
    intro: ['This is Shloimy. Today he goes to the zoo!', 'Tatty takes him. Let’s see what we find!'],
    steps: [
      { pic: 'grapes', near: 'grown', lines: ['Tatty brings grapes for a snack.'], letter: 'gimmel', after: [['Grapes starts with', S('g'), '.'], ['Gimmel says', S('g'), ', like grapes!']] },
      { pic: 'donkey', lines: ['A friendly donkey eats hay.'], letter: 'daled', after: [['Donkey starts with', S('d'), '.'], ['Daled says', S('d'), ', like donkey!']] },
      { pic: 'hand', lines: ['Shloimy waves his hand. Bye, donkey!'], letter: 'hei', after: [['Hand starts with', S('h'), '.'], ['Hei says', S('h'), ', like hand!']] },
    ],
    lookalikes: [['daled', 'hei', 'Daled has no little leg.', 'Hei has a little leg.']],
  });
}
