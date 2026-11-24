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
    bayis() { const h = E.house({ bushes: false }); h.scale.setScalar(.38); h.position.y = -.55; const g = new THREE.Group(); g.add(h); return g; },
    /* ---- everyday pictures (zoo, garden, park, picnic) ---- */
    gamal() { const g = new THREE.Group(), fur = M(0xd9a35b, { roughness: .7 }), dk = M(0x3a2a1a);   /* a camel */
      const body = mesh(new THREE.SphereGeometry(.38, 20, 14), fur, 0, .05, 0); body.scale.set(1.5, .8, .75); g.add(body);
      [[-.2, .3], [.2, .3]].forEach(([x, y]) => g.add(mesh(new THREE.SphereGeometry(.2, 16, 12), fur, x, y, 0)));   /* two humps */
      const neck = mesh(new THREE.CapsuleGeometry(.08, .35, 6, 10), fur, .55, .3, 0); neck.rotation.z = -.5; g.add(neck);
      const head = mesh(new THREE.SphereGeometry(.13, 14, 10), fur, .72, .55, 0); head.scale.set(1.5, .9, .9); g.add(head); g.add(mesh(new THREE.SphereGeometry(.025, 8, 6), dk, .78, .6, .1, false));
      [[-.35, .12], [-.2, -.12], [.25, .12], [.38, -.12]].forEach(([x, z]) => g.add(mesh(new THREE.CylinderGeometry(.05, .045, .42, 8), fur, x, -.38, z))); g.position.y = .1; return g; },
    dov() { const g = new THREE.Group(), fur = M(0x8a5a32, { roughness: .8 }), lt = M(0xd8b48a, { roughness: .7 }), dk = M(0x1d1410);   /* a friendly bear */
      const b = mesh(new THREE.SphereGeometry(.36, 20, 14), fur, 0, -.2, 0); b.scale.set(1, 1.1, .85); g.add(b); g.add(mesh(new THREE.SphereGeometry(.22, 16, 12), lt, 0, -.22, .2));
      g.add(mesh(new THREE.SphereGeometry(.27, 20, 14), fur, 0, .3, 0)); [-1, 1].forEach(s => { g.add(mesh(new THREE.SphereGeometry(.09, 12, 8), fur, s * .2, .52, 0)); g.add(mesh(new THREE.SphereGeometry(.03, 8, 6), dk, s * .09, .36, .23, false)); });
      g.add(mesh(new THREE.SphereGeometry(.1, 12, 8), lt, 0, .25, .22)); g.add(mesh(new THREE.SphereGeometry(.04, 8, 6), dk, 0, .29, .31, false));
      [-1, 1].forEach(s => { g.add(mesh(new THREE.SphereGeometry(.1, 12, 8), fur, s * .33, -.05, .1)); g.add(mesh(new THREE.SphereGeometry(.11, 12, 8), fur, s * .18, -.55, .1)); }); return g; },
    gezer() { const g = new THREE.Group(); const c = mesh(new THREE.ConeGeometry(.16, .9, 16), M(0xff7a1a, { roughness: .4 }), 0, -.1, 0); c.rotation.z = Math.PI; g.add(c);   /* a carrot */
      for (let k = 0; k < 3; k++) { const l = mesh(new THREE.ConeGeometry(.05, .35, 6), M(0x3fae4a), (k - 1) * .06, .5, 0); l.rotation.z = (k - 1) * .35; g.add(l); } g.rotation.z = -.5; return g; },
    vered() { const g = new THREE.Group(), pm = M(0xe0243c, { roughness: .4 });   /* a rose */
      g.add(mesh(new THREE.CylinderGeometry(.025, .025, .8, 6), M(0x2f8f3a), 0, -.25, 0)); const lf = mesh(new THREE.SphereGeometry(.09, 10, 8), M(0x3fae4a), .1, -.2, 0); lf.scale.set(1.5, .5, .8); g.add(lf);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5 + r, p = mesh(new THREE.SphereGeometry(.12 - r * .025, 12, 10), pm, Math.cos(a) * (.11 - r * .04), .25 + r * .03, Math.sin(a) * (.11 - r * .04)); p.scale.set(1, 1.2, .6); g.add(p); } return g; },
    zevuv() { const g = new THREE.Group(), bm = M(0x2a2f3a, { roughness: .3, clearcoat: 1 }), wm = new THREE.MeshPhysicalMaterial({ color: 0xcfefff, transparent: true, opacity: .6, roughness: .1 });   /* a friendly fly */
      const b = mesh(new THREE.SphereGeometry(.22, 16, 12), bm, 0, 0, 0); b.scale.set(1.3, .9, .9); g.add(b); g.add(mesh(new THREE.SphereGeometry(.14, 14, 10), bm, .3, .05, 0));
      [-1, 1].forEach(s => { g.add(mesh(new THREE.SphereGeometry(.07, 12, 8), M(0xd23a3a, { roughness: .2, clearcoat: 1 }), .36, .12, s * .09)); const w = mesh(new THREE.SphereGeometry(.22, 14, 8), wm, -.05, .25, s * .15, false); w.scale.set(1, .25, .55); w.rotation.x = s * .4; g.add(w); });
      return g; },
    zayis() { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(.02, .02, .9, 6), M(0x6b4423), 0, 0, 0)).children.at(-1).rotation.z = 1.2;   /* an olive branch */
      [[-.3, .05], [-.05, .15], [.2, .2], [.35, .32]].forEach(([x, y], i) => { const l = mesh(new THREE.SphereGeometry(.12, 10, 8), M(0x6f8f4a), x, y + .12, 0); l.scale.set(.5, .2, 1); l.rotation.z = .5; g.add(l);
        const o = mesh(new THREE.SphereGeometry(.09, 14, 10), M(0x6b8e23, { roughness: .2, clearcoat: 1 }), x + .05, y - .1, .05); o.scale.set(.8, 1.1, .8); g.add(o); }); return g; },
    chatul() { const g = new THREE.Group(), fur = M(0xffa64d, { roughness: .7 }), wh = M(0xffffff), dk = M(0x1d1410);   /* a cat */
      const b = mesh(new THREE.SphereGeometry(.3, 18, 12), fur, 0, -.25, 0); b.scale.set(1, 1.1, .8); g.add(b); g.add(mesh(new THREE.SphereGeometry(.25, 18, 12), fur, 0, .22, 0));
      [-1, 1].forEach(s => { const e = mesh(new THREE.ConeGeometry(.09, .18, 4), fur, s * .15, .46, 0); e.rotation.z = s * -.3; g.add(e); g.add(mesh(new THREE.SphereGeometry(.035, 8, 6), M(0x3fae4a, { clearcoat: 1 }), s * .09, .27, .21, false));
        for (let k = 0; k < 2; k++) { const w = mesh(new THREE.CylinderGeometry(.005, .005, .22, 4), wh, s * .14, .15 + k * .04, .22, false); w.rotation.z = Math.PI / 2 + s * k * .2; g.add(w); } });
      g.add(mesh(new THREE.SphereGeometry(.03, 8, 6), M(0xff7aa8), 0, .17, .25, false));
      const t = mesh(new THREE.TorusGeometry(.2, .05, 8, 16, Math.PI), fur, .3, -.3, -.05); t.rotation.z = -.3; g.add(t); return g; },
    chamor() { const g = new THREE.Group(), fur = M(0x9a8f88, { roughness: .8 }), lt = M(0xe8e2dc, { roughness: .7 }), dk = M(0x2a2420);   /* a friendly donkey */
      const body = mesh(new THREE.SphereGeometry(.34, 20, 14), fur, 0, 0, 0); body.scale.set(1.35, .9, .85); g.add(body);
      const neck = mesh(new THREE.CapsuleGeometry(.12, .25, 6, 10), fur, .4, .28, 0); neck.rotation.z = -.6; g.add(neck);
      const head = mesh(new THREE.SphereGeometry(.17, 16, 12), fur, .58, .48, 0); head.scale.set(1.25, 1, .95); g.add(head);
      const mz = mesh(new THREE.SphereGeometry(.11, 14, 10), lt, .74, .42, 0); mz.scale.set(1, .85, .95); g.add(mz); g.add(mesh(new THREE.SphereGeometry(.025, 8, 6), dk, .62, .55, .14, false)); g.add(mesh(new THREE.SphereGeometry(.025, 8, 6), dk, .62, .55, -.14, false));
      [-1, 1].forEach(s => { const e = mesh(new THREE.CapsuleGeometry(.045, .26, 4, 8), fur, .5, .74, s * .1); e.rotation.x = s * .45; e.rotation.z = .2; g.add(e); });
      for (let k = 0; k < 5; k++) g.add(mesh(new THREE.SphereGeometry(.05, 8, 6), dk, .3 + k * .06, .3 + k * .07, 0, false));   /* the mane */
      [[-.28, .14], [-.22, -.14], [.24, .14], [.3, -.14]].forEach(([x, z]) => { g.add(mesh(new THREE.CylinderGeometry(.07, .06, .3, 10), fur, x, -.38, z)); g.add(mesh(new THREE.CylinderGeometry(.065, .07, .06, 10), dk, x, -.54, z)); });
      const t = mesh(new THREE.CapsuleGeometry(.025, .25, 4, 6), fur, -.5, -.05, 0); t.rotation.z = -.5; g.add(t); g.position.y = .12; return g; },
    tavas() { const g = new THREE.Group(), body = M(0x1d5fbf, { roughness: .3, clearcoat: 1 });   /* a peacock with its tail open */
      for (let k = 0; k < 11; k++) { const a = Math.PI * (.12 + k * .076), f = mesh(new THREE.SphereGeometry(.16, 12, 8), M(0x1fa37a, { roughness: .3 }), Math.cos(a) * .48, -.15 + Math.sin(a) * .48, -.1); f.scale.set(.55, 1.2, .2); f.rotation.z = a - Math.PI / 2; g.add(f);
        g.add(mesh(new THREE.SphereGeometry(.05, 10, 8), M(0x2346a8, { clearcoat: 1 }), Math.cos(a) * .55, -.15 + Math.sin(a) * .55, -.02, false)); }
      const b = mesh(new THREE.SphereGeometry(.16, 14, 10), body, 0, -.2, .05); b.scale.set(1, 1.4, 1); g.add(b); g.add(mesh(new THREE.SphereGeometry(.09, 12, 8), body, 0, .08, .08));
      g.add(mesh(new THREE.ConeGeometry(.025, .08, 6), M(0xffb020), 0, .07, .18, false)).children.at(-1).rotation.x = Math.PI / 2; return g; },
    yonah() { const g = new THREE.Group(), wh = M(0xffffff, { roughness: .5 });   /* a white dove */
      const b = mesh(new THREE.SphereGeometry(.25, 16, 12), wh, 0, 0, 0); b.scale.set(1.4, .9, .8); g.add(b); g.add(mesh(new THREE.SphereGeometry(.14, 14, 10), wh, .3, .18, 0));
      g.add(mesh(new THREE.ConeGeometry(.04, .1, 6), M(0xffa020), .45, .17, 0, false)).children.at(-1).rotation.z = -Math.PI / 2; g.add(mesh(new THREE.SphereGeometry(.025, 8, 6), M(0x1d1410), .36, .23, .1, false));
      const w = mesh(new THREE.SphereGeometry(.22, 14, 10), wh, -.05, .12, .12); w.scale.set(1.3, .4, .4); w.rotation.z = .5; g.add(w); const t = mesh(new THREE.ConeGeometry(.12, .3, 8), wh, -.42, .05, 0); t.rotation.z = Math.PI / 2; g.add(t); return g; },
    kadur() { const g = new THREE.Group(), cols = [0xe8322b, 0xffffff, 0x2f7de1, 0xffd43b, 0xffffff, 0x2dbb6a];   /* a beach ball */
      cols.forEach((c, i) => g.add(mesh(new THREE.SphereGeometry(.42, 24, 18, i * Math.PI / 3, Math.PI / 3), M(c, { roughness: .25, clearcoat: 1 }), 0, 0, 0))); g.rotation.x = .4; return g; },
    kelev() { const g = new THREE.Group(), fur = M(0xc98a4b, { roughness: .7 }), lt = M(0xf2dcc0), dk = M(0x1d1410);   /* a dog */
      const body = mesh(new THREE.SphereGeometry(.3, 18, 12), fur, 0, -.1, 0); body.scale.set(1.4, .85, .8); g.add(body);
      g.add(mesh(new THREE.SphereGeometry(.22, 16, 12), fur, .42, .2, 0)); g.add(mesh(new THREE.SphereGeometry(.11, 12, 8), lt, .58, .14, 0)); g.add(mesh(new THREE.SphereGeometry(.04, 8, 6), dk, .68, .17, 0, false));
      [-1, 1].forEach(s => { const e = mesh(new THREE.SphereGeometry(.09, 10, 8), M(0x8a5a32), .38, .32, s * .17); e.scale.set(.6, 1.4, .5); g.add(e); g.add(mesh(new THREE.SphereGeometry(.03, 8, 6), dk, .55, .27, s * .09, false)); });
      [[-.25, .12], [-.2, -.12], [.22, .12], [.27, -.12]].forEach(([x, z]) => g.add(mesh(new THREE.CylinderGeometry(.05, .05, .3, 8), fur, x, -.38, z)));
      const t = mesh(new THREE.CapsuleGeometry(.035, .2, 4, 8), fur, -.45, .1, 0); t.rotation.z = .8; g.add(t); return g; },
    limon() { const g = new THREE.Group(); const l = mesh(new THREE.SphereGeometry(.36, 24, 18), M(0xffe23b, { roughness: .35, clearcoat: .6 }), 0, 0, 0); l.scale.set(1.35, 1, 1); g.add(l);   /* a lemon */
      [-1, 1].forEach(s => g.add(mesh(new THREE.SphereGeometry(.07, 10, 8), M(0xffd21a), s * .5, 0, 0))); const lf = mesh(new THREE.SphereGeometry(.12, 10, 8), M(0x3fae4a), -.1, .35, 0); lf.scale.set(1.5, .4, .7); lf.rotation.z = .4; g.add(lf); return g; },
    mayim() { const g = new THREE.Group();   /* a glass of water */
      g.add(mesh(new THREE.CylinderGeometry(.3, .24, .8, 28, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, transparent: true, opacity: .45, roughness: .05, clearcoat: 1, side: THREE.DoubleSide }), 0, 0, 0));
      g.add(mesh(new THREE.TorusGeometry(.3, .015, 8, 32), M(0xffffff, { roughness: .1 }), 0, .4, 0)).children.at(-1).rotation.x = Math.PI / 2;
      g.add(mesh(new THREE.CylinderGeometry(.28, .235, .58, 28), M(0x2f8cff, { roughness: .05, clearcoat: 1, transparent: true, opacity: .9 }), 0, -.09, 0));
      g.add(mesh(new THREE.CylinderGeometry(.28, .28, .02, 28), M(0x8fd0ff, { roughness: .05 }), 0, .2, 0));   /* the water's top */
      [[.08, -.1], [-.1, .02], [.02, .1]].forEach(([x, y]) => g.add(mesh(new THREE.SphereGeometry(.025, 8, 6), M(0xffffff, { transparent: true, opacity: .8 }), x, y, .2, false)));   /* bubbles */
      g.add(mesh(new THREE.CylinderGeometry(.24, .24, .04, 28), M(0xd9f0ff), 0, -.39, 0)); return g; },
    melafefon() { const g = new THREE.Group(); const c = mesh(new THREE.CapsuleGeometry(.15, .7, 8, 16), M(0x2f8f3a, { roughness: .45 }), 0, 0, 0); c.rotation.z = 1.2; g.add(c);   /* a cucumber */
      for (let k = 0; k < 8; k++) g.add(mesh(new THREE.SphereGeometry(.02, 6, 4), M(0x7bd94a), -.33 + k * .1, -.14 + k * .04 + (k % 2) * .05, .14, false)); return g; },
    nemalah() { const g = new THREE.Group(), bm = M(0x3a2018, { roughness: .3, clearcoat: 1 });   /* a cute ant */
      [[-.32, .12], [0, .1], [.3, .13]].forEach(([x, r], i) => { const s = mesh(new THREE.SphereGeometry(r + .04, 14, 10), bm, x, 0, 0); s.scale.set(i === 0 ? 1.3 : 1, 1, 1); g.add(s); });
      [-1, 1].forEach(s => { g.add(mesh(new THREE.SphereGeometry(.04, 8, 6), M(0xffffff), .38, .06, s * .08, false)); g.add(mesh(new THREE.SphereGeometry(.02, 8, 6), M(0x111111), .41, .06, s * .09, false));
        const an = mesh(new THREE.CylinderGeometry(.012, .012, .25, 4), bm, .36, .22, s * .06, false); an.rotation.z = -.5; g.add(an);
        [-.12, 0, .12].forEach(x => { const lg = mesh(new THREE.CylinderGeometry(.015, .015, .3, 4), bm, x, -.12, s * .14, false); lg.rotation.x = s * .7; g.add(lg); }); }); return g; },
  };
  /* the ChatGPT pictures (art/obj) replace the simple 3D ones; each stands as a flat card that always faces the boy */
  const IMG = { dag: ['fish', 1.24], dov: ['bear', .85], gamal: ['camel', 1.02], gezer: ['carrot', .84], har: ['mountain', 1.27], bayis: ['house', 1.14], vered: ['rose', .88], zevuv: ['fly', 1.06], zayis: ['olives', 1.23],
    chatul: ['cat', .82], chamor: ['donkey', .79], taleh: ['lamb', .91], tavas: ['peacock', 1.06], yonah: ['dove', 1.1], yad: ['hand', .91], kadur: ['beachball', 1], kelev: ['dog', .94], limon: ['lemon', .86], mayim: ['water', .85],
    melafefon: ['cucumber', 1.16], nemalah: ['ant', 1.06] };
  const tex = f => texCache[f] || (texCache[f] = (() => { const t = new THREE.TextureLoader().load('art/obj/' + f + '.webp'); t.colorSpace = THREE.SRGBColorSpace; return t; })());
  for (const [w, [f, a]] of Object.entries(IMG)) P[w] = () => { const g = new THREE.Group(), h = 1.35, sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(f), transparent: true, alphaTest: .4 }));
    sp.scale.set(h * a, h, 1); g.add(sp); g.userData.card = sp; return g; };
  return P;
}
const texCache = {};   /* each picture loads once */
/* the words, each with the letter it starts with and the short line he hears */
export const WORDS = {
  bayis: { letter: 'beis', say: 'Bayis. A house!' },
  gefen: { letter: 'gimmel', say: 'Gefen. A grapevine!' },
  gamal: { letter: 'gimmel', say: 'Gamal. A camel!' },
  gezer: { letter: 'gimmel', say: 'Gezer. A carrot!' },
  dag: { letter: 'daled', say: 'Dag. A fish!' },
  dov: { letter: 'daled', say: 'Dov. A bear!' },
  har: { letter: 'hei', say: 'Har. A mountain!' },
  vered: { letter: 'vov', say: 'Vered. A rose!' },
  vov: { letter: 'vov', say: 'A vov. A hook!' },
  zevuv: { letter: 'zayin', say: 'Zevuv. A fly!' },
  zayis: { letter: 'zayin', say: 'Zayis. An olive!' },
  chatul: { letter: 'ches', say: 'Chatul. A cat!' },
  chamor: { letter: 'ches', say: 'Chamor. A donkey!' },
  taleh: { letter: 'tes', say: 'Taleh. A lamb!' },
  tavas: { letter: 'tes', say: 'Tavas. A peacock!' },
  yad: { letter: 'yud', say: 'Yad. A hand!' },
  yonah: { letter: 'yud', say: 'Yonah. A dove!' },
  kadur: { letter: 'kaf', say: 'Kadur. A ball!' },
  limon: { letter: 'lamed', say: 'Limon. A lemon!' },
  mayim: { letter: 'mem', say: 'Mayim. Water!' },
  melafefon: { letter: 'mem', say: 'Melafefon. A cucumber!' },
  nemalah: { letter: 'nun', say: 'Nemalah. An ant!' },
};
export const WORD_NAME = { bayis: 'Bayis', gefen: 'Gefen', gamal: 'Gamal', gezer: 'Gezer', dag: 'Dag', dov: 'Dov', har: 'Har', vered: 'Vered', vov: 'Vov', zevuv: 'Zevuv', zayis: 'Zayis', chatul: 'Chatul', chamor: 'Chamor', taleh: 'Taleh', tavas: 'Tavas', yad: 'Yad', yonah: 'Yonah', kadur: 'Kadur', limon: 'Limon', mayim: 'Mayim', melafefon: 'Melafefon', nemalah: 'Nemalah' };
