/* Bonus round for quick boys: letter rain (opens after 3 stars on the mastery check).
   Skill: spots Beis, Veis and Alef fast, mixed together. Letters float down from the clouds; he taps every one that
   matches the letter on Mendy's sign. Three short rounds (Beis, then Veis, then Alef), each a little faster.
   A wrong tap is named kindly ("That is Veis. No dot."), and nothing is lost when a letter lands. */
export default function setup(E) {
  const { THREE, S } = E;
  const boy = E.mendy(); E.scene.add(boy);
  const sign = new THREE.Group(); sign.add(E.mesh(E.rbox(1.25, 1.35, .14, .1), E.M(0xffd43b, { metalness: .4, roughness: .3 }), 0, 0, 0)); sign.add(E.mesh(E.rbox(1.05, 1.15, .08, .06), E.M(0xfffaf0), 0, 0, .06));
  sign.add(E.mesh(new THREE.CylinderGeometry(.05, .05, 1.2, 8), E.M(0x8a5a3c), 0, -1.2, -.05)); E.scene.add(sign);
  let signL = null; const falling = []; let want = 'beis', caught = 0, targets = 0, wrong = 0, active = false;
  const basket = new THREE.Group(); basket.add(E.mesh(new THREE.CylinderGeometry(.55, .4, .45, 24, 1, true), E.M(0xc68a52, { side: THREE.DoubleSide, roughness: .6 }), 0, .23, 0)); E.scene.add(basket);
  let X = 4;
  E.onLayout(p => { X = p ? 1.6 : 4;
    if (p) { E.camBase.set(0, 2.6, 11); E.camTarget.set(0, 2.6, 0); boy.position.set(-1.35, 0, 1.6); boy.scale.setScalar(.75); sign.position.set(-1.35, 2.55, 1.0); sign.scale.setScalar(.8); basket.position.set(-.75, 0, 1.9); basket.scale.setScalar(.6); }
    else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.9, 0); boy.position.set(-4.3, 0, 1.2); boy.scale.setScalar(1); sign.position.set(-4.3, 3.35, .6); sign.scale.setScalar(.9); basket.position.set(-3.5, 0, 1.6); basket.scale.setScalar(1); }
  });
  E.onFrame((t) => { if (signL) signL.rotation.y = Math.sin(t * 1.4) * .25;
    for (let i = falling.length - 1; i >= 0; i--) { const l = falling[i], u = l.userData; if (u.gone) { falling.splice(i, 1); continue; }
      const k = Math.min(1, (performance.now() - u.t0) / u.ms); l.position.y = u.y0 + (u.y1 - u.y0) * k; l.position.x = u.x + Math.sin(k * 6 + u.x) * .25; l.rotation.z = Math.sin(k * 8 + u.x) * .25;
      if (k >= 1 && !u.busy) { u.gone = true; E.sparkle(l.position, 6, .4); E.scene.remove(l); falling.splice(i, 1); } } });
  window.__info = () => ({ want, active, targets: falling.filter(l => !l.userData.busy && l.userData.key === want).map(l => E.toScreen(l.position)),
    others: falling.filter(l => !l.userData.busy && l.userData.key !== want).map(l => E.toScreen(l.position)), caught, targetsSoFar: targets });
  function setSign(k) { if (signL) sign.remove(signL); signL = E.letter(k, .9); signL.position.set(0, 0, .25); sign.add(signL); E.popIn(signL); }
  const FALL_F = E.FAST ? 2.5 : 1;    /* quick test runs draw very few frames a second, so letters fall slower there to stay tappable */
  function drop(k, ms) {
    const l = E.letter(k, 1.0); let x; do { x = E.portrait ? (Math.random() * 2 - 1) * 1.05 + .5 : (Math.random() * 2 - 1) * X * .85 + .6;   /* never over the sign */ } while (falling.some(f => !f.userData.busy && f.position.y > 2.5 && Math.abs(f.userData.x - x) < (E.portrait ? 1.1 : 1.6)) && Math.random() > .02);
    l.userData = Object.assign(l.userData, { t0: performance.now(), ms: ms * FALL_F, y0: E.portrait ? 5.7 : 4.0, y1: .5, x }); l.position.set(x, l.userData.y0, .8); E.scene.add(l); falling.push(l); E.popIn(l, 1, 250);   /* appears inside the sky, below the top buttons */
    if (k === want) targets++;
  }
  E.onPointer('down', async e => {
    if (!active) return; const live = falling.filter(x => !x.userData.busy); let l = E.pickFrom(e, live);
    if (!l) { let bestD = Math.max(60, innerHeight * .08); live.forEach(x => { const [a, b] = E.toScreen(x.position), d = Math.hypot(a - e.clientX, b - e.clientY); if (d < bestD) { bestD = d; l = x; } }); }   /* a moving letter is easy to just miss: a near tap counts */
    if (!l) return; const u = l.userData;
    if (u.key === want) { u.busy = true; caught++; E.joy(l.position.clone()); boy.mood('cheer'); setTimeout(() => boy.mood('calm'), 700);
      const p0 = l.position.clone(), to = basket.position.clone().add(new THREE.Vector3(0, .5, 0)); await E.tween(420, q => { l.position.lerpVectors(p0, to, q); l.scale.setScalar(1 - q * .6); });
      u.gone = true; E.scene.remove(l); E.sfx.pop(); }
    else { wrong++; u.t0 += 500; E.sfx.boop(); E.shake(l, .12, 350); E.say(u.key === 'alef' ? 'That is Alef.' : u.key === 'beis' ? 'That is Beis. It has a dot.' : 'That is Veis. No dot.', false); }
  });
  async function round(k, n, every, ms) {
    want = k; setSign(k); E.hop(boy, .3);
    await E.say(k === 'alef' ? 'Catch every Alef, the quiet one!' : k === 'beis' ? ['Catch every Beis!', S('b')] : ['Catch every Veis!', S('v')]);
    active = true; document.body.dataset.rainReady = k; homeBtn(false);   /* no leaving by accident while letters fall */
    const mix = Array.from({ length: n }, (_, i) => i % 2 === 0 ? k : keysBut(k)[i % 4 === 1 ? 0 : 1]).sort(() => Math.random() - .5);
    for (const m of mix) { drop(m, ms); await new Promise(r => setTimeout(r, every)); }   /* real time, even in test runs */
    while (falling.length) await new Promise(r => setTimeout(r, 200));
    active = false; delete document.body.dataset.rainReady; homeBtn(true);
  }
  const homeBtn = on => { const h = E.$('#home'); if (h) h.style.display = on ? '' : 'none'; };
  const keysBut = k => ['alef', 'beis', 'veis'].filter(x => x !== k);
  return async () => {
    E.setProgress(3, 0);
    await E.say('Bonus round! Letters are falling from the clouds.');
    setSign('beis'); await E.say('Watch me. I catch a Beis.');
    drop('beis', 2600); targets--; const demo = falling[falling.length - 1]; await E.wait(900);
    const [hx, hy] = E.toScreen(demo.position); E.hand.at(hx, hy); await E.wait(400); E.hand.hide();
    active = true; await new Promise(r => { const iv = setInterval(() => { if (demo.userData.busy || demo.userData.gone) { clearInterval(iv); r(); } }, 50); E.$('#c').dispatchEvent(new PointerEvent('pointerdown', { clientX: E.toScreen(demo.position)[0], clientY: E.toScreen(demo.position)[1], bubbles: true, pointerId: 1 })); });
    active = false; caught = 0; await E.wait(600);
    await E.say('Now you! Be quick!');
    await round('beis', 8, 1500, 4600); E.setProgress(3, 1);
    await round('veis', 9, 1300, 4000); E.setProgress(3, 2);
    await round('alef', 10, 1100, 3500); E.setProgress(3, 3);
    const share = targets ? caught / targets : 0, stars = share >= .8 && wrong <= 2 ? 3 : share >= .5 ? 2 : 1;
    window.__bonus = { caught, targets, wrong };
    return { stars, line: stars === 3 ? 'What a catcher! You caught ' + caught + ' letters!' : stars === 2 ? 'Good catching! You caught ' + caught + ' letters!' : null };
  };
}
