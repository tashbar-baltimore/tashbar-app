/* Unit 10 opener: Champion Day (the big review and the gate to the nekudos).
   A new world: a sunny stage on the green hills, a balloon arch and a golden gate. All of Mendy's friends come to cheer.
   1. The whole Alef-Beis lights up on the stage, row by row, and is chanted; then the five "Shabbos clothes" letters.
   2. Warm-up: the voice says a letter, he taps it (five letters, mixed from the whole year; he says three with the voice).
   3. The golden gate: "Three stars on two different days, and the gate to the nekudos opens!"
   Every line is 12 words or fewer. */
export default function setup(E, { unit }) {
  const { THREE } = E, NM = k => E.LETTERS[k].name;
  const BASE = unit.known.filter(k => !E.LETTERS[k].partner), FINALS = unit.known.filter(k => E.LETTERS[k].partner);
  /* the stage, a balloon arch and the golden gate */
  const stage = new THREE.Group(); E.scene.add(stage);
  stage.add(E.mesh(E.rbox(12, .4, 3.2, .1), E.M(0xc68a52, { roughness: .55 }), 0, .2, -1.2));
  stage.add(E.mesh(E.rbox(12.2, .08, 3.3, .04), E.M(0xe8322b, { roughness: .6 }), 0, .45, -1.2));   /* the red top sits just above the wood (no flickering stripes) */
  const balCols = [0xff7aa8, 0xffcf3a, 0x46c3ff, 0x7bd94a, 0xb388ff, 0xff9f1a];
  for (let i = 0; i <= 22; i++) { const a = Math.PI * i / 22, b = E.mesh(new THREE.SphereGeometry(.34, 18, 14), E.M(balCols[i % 6], { roughness: .2, clearcoat: 1 }), Math.cos(a) * 6.4, .5 + Math.sin(a) * 5.4, -2.6); b.scale.y = 1.15; stage.add(b); }
  const gate = new THREE.Group(); stage.add(gate); const gold = E.goldDot();
  gate.add(E.mesh(new THREE.TorusGeometry(1.0, .12, 14, 40, Math.PI), gold, 0, 1.9, 0)); [-1, 1].forEach(s => gate.add(E.mesh(new THREE.CylinderGeometry(.12, .12, 1.9, 16), gold, s * 1.0, .95, 0)));
  const doors = [-1, 1].map(s => { const d = new THREE.Group(); d.position.set(s * 1.0, 0, 0); for (let i = 0; i < 4; i++) d.add(E.mesh(new THREE.CylinderGeometry(.04, .04, 1.9, 8), gold, -s * (.15 + i * .22), .95, 0)); d.add(E.mesh(new THREE.BoxGeometry(.95, .08, .06), gold, -s * .48, 1.4, 0)); gate.add(d); return d; });
  gate.visible = false;
  const boys = [E.mendy, E.shloimy, E.ari, E.dovid, E.eli, E.avi, E.tzvi].map(f => { const b = f(); b.visible = false; E.scene.add(b); return b; });
  const rows = [], all = [];
  let P = false;
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.6, 12.5); E.camTarget.set(0, 2.6, 0); stage.scale.setScalar(.6); stage.position.set(0, 0, -.5); boys.forEach((b, i) => { b.scale.setScalar(.62); b.position.set(-1.9 + i * .63, .25, 2.2); }); gate.position.set(0, .4, -.6); }
    else { E.camBase.set(0, 2.7, 10.5); E.camTarget.set(0, 2.0, 0); stage.scale.setScalar(1); stage.position.set(0, 0, 0); boys.forEach((b, i) => { b.scale.setScalar(.8); b.position.set(i < 4 ? -5.8 + i * .75 : 3.6 + (i - 4) * .75, 0, 1.6); }); gate.position.set(0, .4, -1.0); }
  });
  E.onFrame(t => { all.forEach((l, i) => { if (l.userData.base && !l.userData.hopping) l.position.y = l.userData.base + Math.sin(t * 2 + i * .5) * .03; }); });
  function wall() {   /* the whole Alef-Beis, right to left, in rows (top row first) */
    const per = P ? 7 : 9, sz = P ? .48 : .72, gap = P ? .58 : .95, top = P ? 4.6 : 4.1, dy = P ? .78 : 1.05;
    const lines = []; for (let i = 0; i < BASE.length; i += per) lines.push(BASE.slice(i, i + per)); lines.push(FINALS);
    lines.forEach((ks, li) => { const made = ks.map(k => E.letter(k, sz)); made.forEach((l, i) => { l.position.set(((ks.length - 1) / 2 - i) * gap, top - li * dy, .2); l.userData.base = l.position.y; l.visible = false; E.scene.add(l); all.push(l); }); rows.push(made); });
  }
  const showHand = l => { if (E.CALM) return E.handBelow(l, true); const [x, y] = E.toScreen(E.worldPos(l).add(new THREE.Vector3(.15, -.3, .4))); E.hand.at(x, y, true); };
  window.__info = () => Object.assign({ tap: document.body.dataset.tapReady || null }, Object.fromEntries(all.filter(l => l.visible).map(l => [l.userData.key, E.toScreen(E.worldPos(l))])));
  return async () => {
    E.setProgress(4, 0);
    for (const b of boys) { b.visible = true; E.popIn(b, b.scale.x, 300); await E.wait(120); }
    boys.forEach(b => b.mood('wave'));
    await E.say('Champion Day! All your friends came to cheer!'); boys.forEach(b => b.mood('calm'));
    await E.say('You learned the whole Alef-Beis! Let’s see it.');
    wall(); E.setProgress(4, 1);
    for (const r of rows.slice(0, -1)) { for (const l of r) { E.popIn(l, 1, 250); await E.wait(50); } }
    await E.say('Let’s sing it together!');
    for (const [ri, r] of rows.slice(0, -1).entries()) {   /* row by row: the voice sings a row, then it is his turn */
      for (const l of r) { E.sfx.drum(); E.hop(l, .25, 260); await E.say(NM(l.userData.key) + ',', false); await E.wait(40); }
      await E.say(ri ? 'Your turn!' : 'Your turn! Sing it with me!'); for (const l of r) { E.hop(l, .3, 300); await E.wait(380); } }
    await E.say('And the letters in Shabbos clothes!'); for (const l of rows[rows.length - 1]) { E.popIn(l, 1, 250); E.sfx.drum(); E.hop(l, .25, 260); await E.say(NM(l.userData.key) + ',', false); }
    boys.forEach(b => b.mood('cheer')); E.joy(new THREE.Vector3(0, 3, 1), true); await E.wait(500); boys.forEach(b => b.mood('calm'));
    E.setProgress(4, 2);
    /* warm-up: hear it, tap it, on the wall */
    await E.say('Now you! Listen, and tap the letter.');
    all.forEach(l => E.popOut(l, 250)); await E.wait(300);
    /* three big letters at a time (big enough to tap on a phone): the one he hears, its look-alike and one more */
    const ASK = [['gimmel', 'nun', 'beis'], ['shin', 'sin', 'lamed'], ['memsofis', 'samech', 'reish'], ['tzadik', 'ayin', 'daled'], ['pei', 'fei', 'yud']];
    const TIP = { gimmel: 'Gimmel has a foot.', shin: 'Shin’s dot is on the right.', memsofis: 'Mem Sofis is square at the bottom.', tzadik: 'Tzadik has a little arm up.', pei: 'Pei has a dot.' };
    let trio = [];
    for (const [qi, set] of ASK.entries()) {
      const k = set[0]; trio.forEach(l => E.scene.remove(l)); all.length = 0;
      trio = set.slice().sort(() => Math.random() - .5).map((c, i) => { const l = E.letter(c, P ? 1.15 : 1.7); l.position.set((1 - i) * (P ? 1.5 : 2.4), P ? 4.6 : 2.6, .6);   /* on a phone, above the arch's top and clear of each other */ E.scene.add(l); all.push(l); E.popIn(l); return l; });
      const l = trio.find(x => x.userData.key === k); await E.wait(300); if (qi < 3) await E.sayWithMe(k);
      await E.say(['Tap ' + NM(k) + '!']); document.body.dataset.tapReady = k; if (qi === 0) showHand(l);
      let tries = 0;
      for (;;) { const got = await E.waitTap(trio); E.hand.hide();
        if (got === l) break; tries++; E.sfx.boop(); E.shake(got, .08); await E.say('That is ' + NM(got.userData.key) + '. ' + TIP[k]); if (tries >= 2) showHand(l); }
      delete document.body.dataset.tapReady; E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .2, .4)), 16, .7); E.hop(l, .4); await E.say(E.nameLine(k));
    }
    trio.forEach(l => E.popOut(l, 250));
    E.setProgress(4, 3);
    /* the golden gate */
    await E.wait(300); gate.visible = true; await E.popIn(gate, 1, 500);
    await E.say('This golden gate leads to the nekudos!');
    await E.say('Get three stars on the champion check.'); await E.say('Do it on two different days.');
    await E.say('Then the gate opens!'); E.sfx.sparkle(); E.sparkle(gate.position.clone().add(new THREE.Vector3(0, 1.4, .3)), 30, 1.4);
    await E.tween(900, q => doors.forEach((d, i) => d.rotation.y = (i ? -1 : 1) * Math.sin(q * Math.PI) * .5));   /* the doors swing a little: a peek at what is coming */
    E.setProgress(4, 4);
    return { stars: 3, line: 'Let’s practice and become Alef-Beis champions!' };
  };
}
