/* Small 3D pictures for "starts with" games and stories (original art, built from simple shapes in the toy-box style).
   Each word: what the boy hears, which letter it starts with, and a maker for its 3D picture (about 1.2 tall, centred). */
export function makePictures(E) {
  const { THREE } = E, M = E.M, mesh = E.mesh;
  const P = {
    gefen() { const g = new THREE.Group(), pm = M(0x7b2d8e, { roughness: .25, clearcoat: 1 }), leaf = M(0x3fae4a, { roughness: .5 });
      [[0, .32], [-.17, .16], [.17, .16], [-.26, -.02], [0, -.02], [.26, -.02], [-.13, -.2], [.13, -.2], [0, -.38]].forEach(([x, y]) => g.add(mesh(new THREE.SphereGeometry(.15, 16, 12), pm, x, y, 0)));
      g.add(mesh(new THREE.CylinderGeometry(.03, .04, .3, 8), M(0x6b4423), 0, .55, 0));
      const lf = mesh(new THREE.SphereGeometry(.24, 16, 10), leaf, .24, .55, -.05); lf.scale.set(1.2, .5, .9); lf.rotation.z = -.4; g.add(lf); return g; },
    gelt() { const g = new THREE.Group(), gold = M(0xf2b705, { metalness: .7, roughness: .25, clearcoat: 1 }), net = M(0xe8322b, { roughness: .5 });
      for (let i = 0; i < 5; i++) { const c = mesh(new THREE.CylinderGeometry(.34, .34, .07, 32), gold, (i % 2) * .04 - .02, -.4 + i * .09, 0); g.add(c); }   /* a stack of Chanukah gelt */
      const bag = mesh(new THREE.SphereGeometry(.3, 18, 12), net, .45, -.25, -.1); bag.scale.set(1, 1.15, 1); g.add(bag); g.add(mesh(new THREE.TorusGeometry(.12, .03, 8, 16), M(0xffd43b), .45, .1, -.1)); return g; },
    dag() { const g = new THREE.Group(), body = M(0xff8a1e, { roughness: .25, clearcoat: 1 });
      const b = mesh(new THREE.SphereGeometry(.4, 24, 16), body); b.scale.set(1.45, .85, .55); g.add(b);
      const t = mesh(new THREE.ConeGeometry(.3, .42, 4), body, -.72, 0, 0); t.rotation.z = Math.PI / 2; g.add(t);
      const fin = mesh(new THREE.ConeGeometry(.14, .3, 3), M(0xffb35b), 0, .38, 0); g.add(fin);
      g.add(mesh(new THREE.SphereGeometry(.08, 12, 10), M(0xffffff), .36, .1, .2)); g.add(mesh(new THREE.SphereGeometry(.045, 10, 8), M(0x1d2b3a), .39, .1, .26, false)); return g; },
    dreidel() { const g = new THREE.Group(), c = M(0x2f7de1, { roughness: .25, clearcoat: 1 });
      g.add(mesh(E.rbox(.62, .6, .62, .08), c, 0, 0, 0)); const tip = mesh(new THREE.ConeGeometry(.42, .5, 4), c, 0, -.55, 0); tip.rotation.y = Math.PI / 4; tip.rotation.x = Math.PI; g.add(tip);
      g.add(mesh(new THREE.CylinderGeometry(.06, .06, .35, 12), M(0xffd43b, { roughness: .3 }), 0, .47, 0)); g.rotation.y = .5; return g; },
    havdalah() { const g = new THREE.Group(), cols = [0x46c3ff, 0xffffff, 0xff7aa8];   /* a braided Havdalah candle and its flame */
      cols.forEach((col, i) => { const pts = []; for (let k = 0; k <= 40; k++) { const t = k / 40, a = t * Math.PI * 6 + i * 2 * Math.PI / 3; pts.push(new THREE.Vector3(Math.cos(a) * .1, -.55 + t * 1.0, Math.sin(a) * .1)); }
        g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, .075, 10), M(col, { roughness: .4 }))); });
      [-.06, .06].forEach(x => g.add(mesh(new THREE.CylinderGeometry(.012, .012, .1, 6), M(0x333333), x, .5, 0, false)));
      const fl = mesh(new THREE.SphereGeometry(.14, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffb020, emissive: 0xff8a00, emissiveIntensity: 1.6 }), 0, .66, 0, false); fl.scale.set(1.3, 1.8, 1.3); g.add(fl);
      const gl = E.glowSprite('#ffcf70', 1.1, .8); gl.position.set(0, .66, 0); g.add(gl); g.userData.flame = fl; return g; },
    har() { const g = new THREE.Group(); g.add(mesh(new THREE.ConeGeometry(.62, .95, 7), M(0x5b8c3a, { roughness: .7 }), 0, -.1, 0));
      g.add(mesh(new THREE.ConeGeometry(.25, .32, 7), M(0xffffff, { roughness: .5 }), 0, .26, 0)); g.add(mesh(new THREE.ConeGeometry(.4, .6, 7), M(0x7aa64e, { roughness: .7 }), .5, -.3, -.2)); return g; },
    bayis() { const h = E.house({ bushes: false }); h.scale.setScalar(.38); h.position.y = -.55; const g = new THREE.Group(); g.add(h); return g; },
  };
  return P;
}
/* the words, each with the letter it starts with and the short line he hears */
export const WORDS = {
  gefen: { letter: 'gimmel', say: 'Gefen. A grapevine!' },
  gelt: { letter: 'gimmel', say: 'Gelt. Chanukah coins!' },
  dag: { letter: 'daled', say: 'Dag. A fish!' },
  dreidel: { letter: 'daled', say: 'Dreidel!' },
  havdalah: { letter: 'hei', say: 'A Havdalah candle!' },
  har: { letter: 'hei', say: 'Har. A mountain!' },
  bayis: { letter: 'beis', say: 'Bayis. A house!' },
};
export const WORD_NAME = { gefen: 'Gefen', gelt: 'Gelt', dag: 'Dag', dreidel: 'Dreidel', havdalah: 'Havdalah', har: 'Har', bayis: 'Bayis' };
