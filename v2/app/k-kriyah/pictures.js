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
      [-.07, 0, .07].forEach(x => g.add(mesh(new THREE.CylinderGeometry(.014, .014, .14, 6), M(0x222222), x, .52, 0, false)));   /* several wicks: one wide, torch-like flame */
      const fl = mesh(new THREE.ConeGeometry(.13, .42, 20), new THREE.MeshStandardMaterial({ color: 0xffb020, emissive: 0xff8a00, emissiveIntensity: 1.6 }), 0, .78, 0, false); g.add(fl);
      const gl = E.glowSprite('#ffcf70', 1.1, .8); gl.position.set(0, .66, 0); g.add(gl); g.userData.flame = fl; return g; },
    har() { const g = new THREE.Group(); g.add(mesh(new THREE.ConeGeometry(.62, .95, 7), M(0x5b8c3a, { roughness: .7 }), 0, -.1, 0));
      g.add(mesh(new THREE.ConeGeometry(.25, .32, 7), M(0xffffff, { roughness: .5 }), 0, .26, 0)); g.add(mesh(new THREE.ConeGeometry(.4, .6, 7), M(0x7aa64e, { roughness: .7 }), .5, -.3, -.2)); return g; },
    vov() { const g = new THREE.Group(), metal = M(0xb8c2cc, { metalness: .85, roughness: .2 });   /* a hook on a peg board: "vov" means a hook */
      g.add(mesh(E.rbox(.9, .5, .12, .05), M(0x8a5a3c, { roughness: .6 }), 0, .45, -.1));
      g.add(mesh(new THREE.CylinderGeometry(.05, .05, .55, 12), metal, 0, .05, 0)); const c = mesh(new THREE.TorusGeometry(.17, .05, 10, 20, Math.PI), metal, .17, -.22, 0); c.rotation.z = Math.PI; g.add(c); return g; },
    challah() { const g = new THREE.Group(), crust = M(0xc9802f, { roughness: .45, clearcoat: .5 });   /* a braided challah */
      for (let s = 0; s < 3; s++) { const pts = []; for (let k = 0; k <= 30; k++) { const t = k / 30, x = -.6 + t * 1.2; pts.push(new THREE.Vector3(x, Math.sin(t * Math.PI * 4 + s * 2.1) * .08 + .02, Math.cos(t * Math.PI * 4 + s * 2.1) * .12)); }
        g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, .14 - Math.abs(s - 1) * .01, 12), crust)); }
      g.scale.set(1, 1.1, 1.2); return g; },
    zemiros() { const g = new THREE.Group(), ink = M(0x2b2f6b, { roughness: .3, clearcoat: .8 });   /* singing: two music notes */
      [[-.25, -.1], [.25, .1]].forEach(([x, y]) => { const h = mesh(new THREE.SphereGeometry(.14, 16, 12), ink, x, y - .3, 0); h.scale.set(1.25, .9, .8); g.add(h); g.add(mesh(new THREE.CylinderGeometry(.03, .03, .62, 8), ink, x + .15, y, 0)); });
      const beam = mesh(new THREE.BoxGeometry(.56, .08, .06), ink, .15, .32, 0); beam.rotation.z = .35; g.add(beam); return g; },
    tallis() { const g = new THREE.Group(), wool = M(0xfbfaf4, { roughness: .8 }), stripe = M(0x1f2d4a, { roughness: .6 });   /* a folded tallis: white with dark stripes and tzitzis */
      g.add(mesh(E.rbox(1.1, .7, .14, .05), wool, 0, 0, 0)); [-.22, .22].forEach(y => g.add(mesh(new THREE.BoxGeometry(1.12, .07, .15), stripe, 0, y, 0)));
      g.add(mesh(new THREE.BoxGeometry(.4, .1, .16), M(0xd9dde3, { metalness: .6, roughness: .3 }), 0, .4, 0));
      [-.48, .48].forEach(x => { for (let i = 0; i < 4; i++) g.add(mesh(new THREE.CylinderGeometry(.012, .012, .42, 6), wool, x + (i - 1.5) * .025, -.55, .03)); }); return g; },
    taleh() { const g = new THREE.Group(), wool = M(0xfbf7ee, { roughness: .9 }), face = M(0x3b2f2a, { roughness: .6 });   /* a lamb (taleh): fluffy wool, dark face and legs */
      [[0, 0], [-.22, .05], [.22, .05], [-.12, .18], [.12, .18], [-.3, -.1], [.3, -.1], [0, .2]].forEach(([x, y]) => g.add(mesh(new THREE.SphereGeometry(.22, 16, 12), wool, x, y, 0)));
      const head = mesh(new THREE.SphereGeometry(.16, 16, 12), face, .48, .22, .05); head.scale.set(1.1, .95, .9); g.add(head);
      [[.42, .36], [.56, .34]].forEach(([x, y]) => { const e = mesh(new THREE.SphereGeometry(.06, 10, 8), face, x, y, -.03); e.scale.set(1.4, .6, .8); g.add(e); });
      g.add(mesh(new THREE.SphereGeometry(.035, 8, 6), M(0xffffff), .58, .26, .17, false));
      [[-.25, -.1], [-.08, .1], [.1, -.1], [.25, .1]].forEach(([x, z]) => g.add(mesh(new THREE.CylinderGeometry(.05, .05, .35, 8), face, x, -.4, z))); g.position.y = .08; return g; },
    yad() { const g = new THREE.Group(), skin = M(0xf2c9a0, { roughness: .55 });   /* a hand, waving */
      const palm = mesh(E.rbox(.62, .6, .2, .12), skin, 0, -.2, 0); g.add(palm);
      [[-.22, .26, .44], [-.075, .3, .5], [.075, .29, .48], [.22, .24, .4]].forEach(([x, y, h]) => { const f = mesh(new THREE.CapsuleGeometry(.07, h - .14, 6, 12), skin, x, y, 0); g.add(f); });
      const th = mesh(new THREE.CapsuleGeometry(.075, .22, 6, 12), skin, .4, -.15, 0); th.rotation.z = -.9; g.add(th); g.rotation.z = .12; return g; },
    yeled() { const k = E.person({ shirt: 0x5aa0e6, pants: 0x2a3550 }); const g = new THREE.Group(); k.scale.setScalar(.42); k.position.y = -.6; g.add(k); return g; },   /* a boy */
    kos() { const g = new THREE.Group(), silver = M(0xd8dde6, { metalness: .9, roughness: .15 });   /* a silver Kiddush cup with wine */
      const cup = mesh(new THREE.CylinderGeometry(.34, .22, .5, 28, 1, true), silver, 0, .25, 0); cup.material.side = THREE.DoubleSide; g.add(cup);
      g.add(mesh(new THREE.CylinderGeometry(.31, .31, .03, 28), M(0x7a1030, { roughness: .1, clearcoat: 1 }), 0, .44, 0));
      g.add(mesh(new THREE.CylinderGeometry(.06, .08, .35, 14), silver, 0, -.17, 0)); g.add(mesh(new THREE.CylinderGeometry(.3, .32, .07, 28), silver, 0, -.37, 0)); return g; },
    kippah() { const g = new THREE.Group(); const k = mesh(new THREE.SphereGeometry(.5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2.6), M(0x1d2340, { roughness: .9, sheen: 1 }), 0, -.2, 0); k.scale.set(1, .7, 1); g.add(k);   /* a velvet kippah */
      g.rotation.x = .5; return g; },
    neiros() { const g = new THREE.Group(), silver = M(0xd8dde6, { metalness: .9, roughness: .15 });   /* Shabbos candles */
      [-.25, .25].forEach(x => { g.add(mesh(new THREE.CylinderGeometry(.12, .16, .08, 20), silver, x, -.5, 0)); g.add(mesh(new THREE.CylinderGeometry(.04, .05, .45, 12), silver, x, -.25, 0)); g.add(mesh(new THREE.CylinderGeometry(.08, .06, .08, 16), silver, x, 0, 0));
        g.add(mesh(new THREE.CylinderGeometry(.05, .05, .45, 12), M(0xffffff), x, .26, 0)); g.add(mesh(new THREE.ConeGeometry(.05, .16, 12), new THREE.MeshStandardMaterial({ color: 0xffb020, emissive: 0xff8a00, emissiveIntensity: 1.6 }), x, .57, 0, false));
        const gl = E.glowSprite('#ffcf70', .5, .8); gl.position.set(x, .57, 0); g.add(gl); }); return g; },
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
  vov: { letter: 'vov', say: 'A vov. A hook!' },
  challah: { letter: 'ches', say: 'Challah for Shabbos!' },
  zemiros: { letter: 'zayin', say: 'Zemiros! Singing at the Shabbos table.' },
  tallis: { letter: 'tes', say: 'A tallis!' },
  taleh: { letter: 'tes', say: 'Taleh. A lamb!' },
  yad: { letter: 'yud', say: 'Yad. A hand!' },
  yeled: { letter: 'yud', say: 'Yeled. A boy!' },
  kos: { letter: 'kaf', say: 'A kos for Kiddush!' },
  kippah: { letter: 'kaf', say: 'A kippah!' },
};
export const WORD_NAME = { gefen: 'Gefen', gelt: 'Gelt', dag: 'Dag', dreidel: 'Dreidel', havdalah: 'Havdalah', har: 'Har', bayis: 'Bayis', vov: 'Vov', challah: 'Challah', zemiros: 'Zemiros', tallis: 'Tallis', taleh: 'Taleh', yad: 'Yad', yeled: 'Yeled', kos: 'Kos', kippah: 'Kippah' };
