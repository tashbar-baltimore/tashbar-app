/* Unit opener (Picture Story): Mendy's first day in cheder.
   Tatty walks him to cheder; the rebbe shows him the first letter. Alef (Abba starts with Alef; Alef is quiet),
   the house that turns into Beis with Mendy as the dot, Veis when nobody is home, a short chant, then he taps each letter.
   Every spoken line is 12 words or fewer; "hear it again" is always top left. */
export default function setup(E) {
  const { THREE, S } = E;
  const cheder = E.house({ wall: 0x5aa9ff, roof: 0x2f7d4f }); E.scene.add(cheder);
  const boy = E.mendy(), dad = E.tatty(), rebbe = E.rebbe(); E.scene.add(boy, dad, rebbe);
  const home = E.house({ lit: true }); home.visible = false; E.scene.add(home);
  const alef = E.letter('alef', 2.6), beis = E.letter('beis', 2.6), veis = E.letter('veis', 2.6); [alef, beis, veis].forEach(l => { l.visible = false; E.scene.add(l); });
  const glow = E.glowSprite('#ffffff', 6, 0); E.scene.add(glow);
  const ticks = {};
  let P = false, floaters = new Set();
  const X = () => P ? { row: E.CALM ? 1.25 : 1.5, s: E.CALM ? .4 : .5, chederX: 1.1, walkTo: -.35, dadX: -1.1 } : { row: 3.1, s: .9, chederX: 2.6, walkTo: .6, dadX: -.5 };
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.4, 11.5); E.camTarget.set(0, 1.9, 0); } else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.4, 0); }
    cheder.position.x = X().chederX; cheder.scale.setScalar(p ? .75 : 1); rebbe.position.set(X().chederX - (p ? .1 : .2), 0, 1.7);
  });
  E.onFrame(t => { floaters.forEach(l => { if (!l.userData.base) return; if (E.CALM) { l.rotation.y = 0; return; }   /* calm: learned letters stand still, face-on */ l.position.y = l.userData.base.y + Math.sin(t * 2 + l.position.x) * .07; l.rotation.y = Math.sin(t * .9 + l.position.x) * .3; }); });
  const float = (l, on = true) => { if (on) { l.userData.base = l.position.clone(); floaters.add(l); } else floaters.delete(l); };
  const showHand = (obj, dy = -.6) => { const [x, y] = E.toScreen(E.worldPos(obj).add(new THREE.Vector3(.5, dy, .6))); E.hand.at(x, y, true); };
  async function tapIt(l, line) {
    showHand(l); document.body.dataset.tapReady = l.userData.key;
    await E.waitTap([l]); delete document.body.dataset.tapReady; E.hand.hide();
    E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .2, .6)), 26, 1.2);
    float(l, false); const r0 = l.rotation.y, y0 = l.position.y; await E.tween(800, k => { l.rotation.y = r0 + k * Math.PI * 2; l.position.y = y0 + Math.sin(k * Math.PI) * .6; }, E.ease.out); l.position.y = y0; float(l);
    await E.say(line);
  }
  window.__info = () => ({ alef: E.toScreen(E.worldPos(alef)), beis: E.toScreen(E.worldPos(beis)), veis: E.toScreen(E.worldPos(veis)), tap: document.body.dataset.tapReady || null });

  boy.position.set(-4.6, 0, 1.6); dad.position.set(-5.4, 0, 1.2);
  return async () => {
    E.setProgress(4, 0);
    /* 1. the walk to cheder */
    boy.mood('wave'); await E.say('This is Mendy. Today is his first day in cheder!'); boy.mood('calm');
    E.say('Tatty walks him there.'); boy.mood('walk'); dad.mood('walk');
    const b0 = boy.position.clone(), d0 = dad.position.clone();
    await E.tween(2600, k => { boy.position.x = b0.x + (X().walkTo - b0.x) * k; dad.position.x = d0.x + (X().dadX - d0.x) * k; boy.position.y = Math.abs(Math.sin(k * 12)) * .06; }, E.ease.lin);
    boy.mood('calm'); dad.mood('calm'); boy.position.y = 0; await E.wait(500);
    rebbe.mood('wave'); await E.say('The rebbe shows him the first letter.'); rebbe.mood('calm');
    /* 2. Alef */
    E.sfx.whoosh(); await Promise.all([E.popOut(cheder), E.popOut(rebbe), E.popOut(boy)]);
    alef.position.set(0, 1.6, .6); glow.position.set(0, 1.6, -.3); E.sparkle(new THREE.Vector3(0, 1.6, 1), 36, 1.5); E.sfx.sparkle();
    E.tween(700, k => glow.material.opacity = k * .8); await E.popIn(alef, 1, 700); float(alef);
    E.setProgress(4, 1);
    await E.say('This is Alef.');
    const ds = dad.scale.x; dad.position.set(P ? -1.4 : -2.4, 0, 1.4); if (P) dad.scale.setScalar(ds * .68); dad.mood('wave');
    await E.say('Abba starts with Alef.'); dad.mood('calm');
    await E.say('Alef is quiet. It waits for its nekudah.');
    await E.sayWithMe('alef');
    await E.say('Tap Alef!');
    await tapIt(alef, 'Alef. Alef is quiet. Shh!');
    await E.popOut(dad); dad.scale.setScalar(ds);
    /* 3. Beis: the house turns into Beis, and Mendy becomes the dot */
    float(alef, false); const a0 = alef.position.clone();
    await E.tween(700, k => { alef.position.lerpVectors(a0, new THREE.Vector3(X().row, P && E.CALM ? 3.55 : 1.6, .2), k); alef.scale.setScalar(1 - k * (1 - (P && E.CALM ? .3 : X().s)));   /* on a phone Alef waits up high, so the big Beis never covers it */ glow.material.opacity = .8 * (1 - k); }); float(alef);
    home.position.set(0, 0, 0); home.scale.setScalar(P ? .75 : .9); boy.scale.setScalar(1); boy.position.set(-.55, 0, 1.3); boy.visible = true; await Promise.all([E.popIn(home, P ? .75 : .9), E.popIn(boy)]);
    E.setProgress(4, 2);
    boy.mood('wave'); await E.say('This is Mendy’s house.');   /* English words only (HoS 2026-11-26) */
    await E.say('Mendy is home!'); boy.mood('calm');
    await E.say('Watch! The house turns into a letter.');
    const p0 = boy.position.clone(); await E.tween(700, k => { boy.position.lerpVectors(p0, new THREE.Vector3(0, .4, 1.2), k); boy.position.y += Math.sin(k * Math.PI) * .8; });
    E.sfx.sparkle(); E.sfx.whoosh(); E.sparkle(new THREE.Vector3(0, 1.4, 1), 40, 1.5);
    beis.position.set(0, 1.6, .6); beis.visible = true; beis.scale.setScalar(.01); beis.userData.dot.scale.setScalar(.01); glow.position.set(0, 1.6, -.3);
    const hs = home.scale.x;
    await E.tween(1400, k => { home.scale.setScalar(Math.max(.001, hs * (1 - k))); home.rotation.y = k * 1.2; beis.scale.setScalar(.01 + k * .99); beis.rotation.y = (1 - k) * Math.PI * 2; glow.material.opacity = k * .8; boy.scale.setScalar(1 - k * .9); });
    home.visible = false;
    await E.tween(500, k => { boy.scale.setScalar(.1 * (1 - k)); beis.userData.dot.scale.setScalar(.01 + k); }, E.ease.back); boy.visible = false;
    E.sparkle(E.worldPos(beis.userData.dot), 24); E.sfx.sparkle(); float(beis);
    await E.say('This is Beis. Mendy is the dot inside.');
    await E.say(['Beis says', S('b')]);
    await E.sayWithMe('beis');
    await E.say('Tap Beis!');
    await tapIt(beis, ['Beis says', S('b')]);
    /* 4. Veis: nobody home */
    E.setProgress(4, 3);
    float(beis, false); const bp = beis.position.clone(); veis.position.copy(bp); veis.rotation.copy(beis.rotation); veis.visible = true; veis.userData.dot.visible = true; beis.visible = false; float(veis);
    await E.say('Now Mendy goes out to play.');
    const d = veis.userData.dot, dp = d.position.clone(); E.sfx.whoosh();
    await E.tween(700, k => { d.position.set(dp.x + k * 1.5, dp.y + k * 2.6, dp.z + k * .5); d.scale.setScalar(1 - k); }, E.ease.out); d.visible = false; d.position.copy(dp); d.scale.setScalar(1);
    E.sparkle(new THREE.Vector3(1.2, 3.6, 1), 14);
    await E.say('Nobody home. No dot. This is Veis.');
    await E.say(['Veis says', S('v')]);
    await E.sayWithMe('veis');
    await E.say('Tap Veis!');
    await tapIt(veis, ['Veis says', S('v')]);
    /* 5. all three in a row (right to left: Alef, Beis, Veis), and a short chant */
    float(veis, false); const v0 = veis.position.clone();
    if (P && E.CALM) { float(alef, false); const aa = alef.position.clone(), as = alef.scale.x; await E.tween(500, k => { alef.position.lerpVectors(aa, new THREE.Vector3(X().row, 1.6, .2), k); alef.scale.setScalar(as + (X().s - as) * k); }); float(alef); }
    await E.tween(700, k => { veis.position.lerpVectors(v0, new THREE.Vector3(-X().row, 1.6, .2), k); veis.scale.setScalar(1 - k * (1 - X().s)); glow.material.opacity = .8 * (1 - k); }); float(veis);
    beis.position.set(0, 1.6, .2); beis.rotation.set(0, 0, 0); beis.userData.dot.visible = true; beis.userData.dot.scale.setScalar(1); await E.popIn(beis, X().s); float(beis);
    E.setProgress(4, 4);
    await E.say('Let’s sing them!');
    for (let round = 0; round < 2; round++) for (const [l, line] of [[alef, 'Alef, quiet!'], [beis, ['Beis,', S('b')]], [veis, ['Veis,', S('v')]]]) {
      E.sfx.drum(); E.hop(l, .45, 380); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .6, .5)), 8); await E.say(line, false); await E.wait(120); }
    /* 6. now you: tap each letter */
    await E.say('Now you! Tap each letter.');
    const left = [alef, beis, veis]; document.body.dataset.tapAll = 1;
    while (left.length) {
      showHand(left[0]); document.body.dataset.tapReady = left.map(l => l.userData.key).join(',');
      const l = await E.waitTap(left); left.splice(left.indexOf(l), 1); E.hand.hide();
      E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .3, .6)), 22, 1.1); E.hop(l, .5);
      const tk = E.CALM ? E.tick3d(.26) : E.star3d(.26); tk.position.copy(l.position).add(new THREE.Vector3(0, 1.75 * X().s, .3)); if (!E.CALM) E.onFrame(t => tk.rotation.y = t * 2); E.scene.add(tk); E.popIn(tk); ticks[l.userData.key] = tk;
      await E.say(E.nameLine(l.userData.key));
    }
    delete document.body.dataset.tapReady;
    return { stars: 3, line: 'Wonderful! You know Alef, Beis and Veis!' };
  };
}
