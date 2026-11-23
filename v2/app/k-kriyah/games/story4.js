/* Unit 4 opener (Picture Story): Dovid goes to shul with Tatty, and Friday night Tatty makes Kiddush.
   Tatty's tallis turns into Tes. Dovid waves his hand (a yad): it turns into Yud. Friday night the Kiddush cup (a kos)
   turns into Kaf; then Kaf's dot floats away and it is Chaf (like Beis and Veis). Then the look-alikes side by side
   (Beis's tail and Kaf's round bottom; Kaf's dot), a chant of every letter so far, and he taps each new one.
   Every spoken line is 12 words or fewer. */
import { makePictures } from '../pictures.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  const PIC = makePictures(E);
  const boy = E.dovid(), dad = E.tatty(); E.scene.add(boy, dad);
  /* the shul: a wall with two tall windows, a shelf of sefarim, a bench */
  const shul = new THREE.Group(); E.scene.add(shul);
  shul.add(E.mesh(E.rbox(10, 3.6, .2, .06), E.M(0xf6ead2, { roughness: .7 }), 0, 1.8, -1.6)); shul.add(E.mesh(new THREE.BoxGeometry(10, .25, .22), E.M(0x8a5a3c), 0, .12, -1.5));
  [-1.2, 1.2].forEach(x => { shul.add(E.mesh(E.rbox(.95, 1.9, .1, .3), E.M(0xffffff), x, 2.2, -1.48)); shul.add(E.mesh(E.rbox(.8, 1.75, .05, .26), E.M(0x9fd8ff, { roughness: .1, clearcoat: 1 }), x, 2.2, -1.42, false)); });
  const shelf = new THREE.Group(); shelf.add(E.mesh(E.rbox(1.6, 1.3, .4, .04), E.M(0x7a4a2a, { roughness: .6 }), 0, .65, 0));
  const spines = [0x8b1e2e, 0x1f3c88, 0x2e6b3f, 0x5a2a6e, 0x8b1e2e, 0x1f3c88, 0x6b4423];   /* sefarim: plain spines, no writing */
  [.35, .95].forEach(y => spines.forEach((c, i) => shelf.add(E.mesh(E.rbox(.17, .46, .3, .02), E.M(c, { roughness: .5, clearcoat: .4 }), -.6 + i * .2, y, .06))));
  shelf.position.set(3.6, 0, -1.25); shul.add(shelf);
  shul.add(E.mesh(E.rbox(10, .08, 4.2, .03), E.M(0xc99a6b, { roughness: .6 }), 0, .02, .4));   /* a wooden floor and two side walls, so it is a room */
  [-5, 5].forEach(x => shul.add(E.mesh(E.rbox(.2, 3.6, 2.6, .06), E.M(0xefe0c4, { roughness: .7 }), x, 1.8, -.4)));
  const bench = E.mesh(E.rbox(2.4, .12, .5, .04), E.M(0xa86f3c, { roughness: .6 }), -3.4, .55, -.8); shul.add(bench); [-4.4, -2.4].forEach(x => shul.add(E.mesh(new THREE.BoxGeometry(.1, .5, .45), E.M(0x8a5a3c), x, .27, -.8)));
  /* Friday night at home: the table with a white cloth, the Shabbos candles and the covered challah */
  const table = new THREE.Group(); table.visible = false; E.scene.add(table);
  table.add(E.mesh(E.rbox(2.6, .12, 1.2, .05), E.M(0xc68a52, { roughness: .55 }), 0, 1.0, 0)); table.add(E.mesh(E.rbox(2.7, .06, 1.3, .03), E.M(0xffffff, { roughness: .5 }), 0, 1.08, 0));
  [-1.1, 1.1].forEach(x => [-.45, .45].forEach(z => table.add(E.mesh(new THREE.CylinderGeometry(.06, .06, 1.0, 10), E.M(0xa86f3c), x, .5, z))));
  const covered = PIC.challah(); covered.scale.setScalar(.45); covered.position.set(-.6, 1.25, 0); table.add(covered);
  table.add(E.mesh(E.rbox(.75, .12, .5, .05), E.M(0x1f3c88, { roughness: .5 }), -.6, 1.32, 0));   /* the challah, covered */
  const candles = PIC.neiros(); candles.visible = false; E.scene.add(candles);
  const tallis = PIC.tallis(), yad = PIC.yad(), kos = PIC.kos(); [tallis, yad, kos].forEach(o => { o.visible = false; E.scene.add(o); });
  const night = document.createElement('div'); night.style.cssText = 'position:fixed;inset:0;background:#0b1840;opacity:0;pointer-events:none;z-index:0'; document.body.insertBefore(night, E.$('#c'));
  const L = {}; unit.letters.forEach(k => { L[k] = E.letter(k, 2.5); L[k].visible = false; E.scene.add(L[k]); });
  const row = [], glow = E.glowSprite('#ffffff', 6, 0); E.scene.add(glow);
  const arrow = E.arrow3d(.45), ring = E.noticeRing(.32);   /* the arrow points at a shape difference; the ring only ever marks the dot place */
  let P = false; const floaters = new Set();
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.4, 11.5); E.camTarget.set(0, 1.9, 0); } else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.4, 0); }
    table.position.set(p ? .6 : 1.6, 0, -.6); table.scale.setScalar(p ? .7 : 1); shelf.visible = !p;
  });
  E.onFrame(t => { floaters.forEach(l => { if (!l.userData.base) return; l.position.y = l.userData.base.y + Math.sin(t * 2 + l.position.x) * .07; l.rotation.y = Math.sin(t * .9 + l.position.x) * .3; });
    if (yad.visible) yad.rotation.z = .12 + Math.sin(t * 7) * .25; });
  const float = (l, on = true) => { if (on) { l.userData.base = l.position.clone(); floaters.add(l); } else floaters.delete(l); };
  const showHand = obj => { const [x, y] = E.toScreen(E.worldPos(obj).add(new THREE.Vector3(.5, -.6, .6))); E.hand.at(x, y, true); };
  async function tapIt(l, line) {
    showHand(l); document.body.dataset.tapReady = l.userData.key;
    await E.waitTap([l]); delete document.body.dataset.tapReady; E.hand.hide();
    E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .2, .6)), 26, 1.2);
    float(l, false); const r0 = l.rotation.y, y0 = l.position.y; await E.tween(800, k => { l.rotation.y = r0 + k * Math.PI * 2; l.position.y = y0 + Math.sin(k * Math.PI) * .6; }, E.ease.out); l.position.y = y0; float(l);
    await E.say(line);
  }
  window.__info = () => Object.assign({ tap: document.body.dataset.tapReady || null }, Object.fromEntries(Object.entries(L).map(([k, l]) => [k, E.toScreen(E.worldPos(l))])),
    Object.fromEntries(row.map(l => ['row-' + l.userData.key, E.toScreen(E.worldPos(l))])));
  async function morph(picObj, k) {
    const from = E.worldPos(picObj), s0 = picObj.scale.x, l = L[k]; E.sfx.sparkle(); E.sfx.whoosh(); E.sparkle(from.clone().add(new THREE.Vector3(0, 0, .5)), 36, 1.4);
    l.position.set(0, 1.6, .6); l.visible = true; l.scale.setScalar(.01); glow.position.set(0, 1.6, -.3);
    await E.tween(1300, q => { picObj.scale.setScalar(Math.max(.001, s0 * (1 - q))); picObj.rotation.y = q * 3; l.scale.setScalar(.01 + q * .99); l.rotation.y = (1 - q) * Math.PI * 2; glow.material.opacity = q * .8; });
    picObj.visible = false; float(l);
  }
  async function letterDone(k) {   /* the four new letters wait in a row along the top, right to left */
    const l = L[k]; float(l, false); const p0 = l.position.clone(), i = unit.letters.indexOf(k), to = new THREE.Vector3((P ? 1.05 : 2.3) * (1.5 - i), P ? 4.4 : 3.6, -.5);
    await E.tween(600, q => { l.position.lerpVectors(p0, to, q); l.scale.setScalar(1 - q * (1 - (P ? .28 : .5))); glow.material.opacity = .8 * (1 - q); }); float(l);
  }
  const toCentre = async o => { const p0 = o.position.clone(); await E.tween(500, q => o.position.lerpVectors(p0, new THREE.Vector3(0, 1.6, .6), q)); };
  return async () => {
    boy.position.set(P ? -1.0 : -2.0, 0, 1.4); dad.position.set(P ? -1.9 : -3.9, 0, .6);
    E.setProgress(6, 0);
    boy.mood('wave'); await E.say('This is Dovid. He goes to shul with Tatty.'); boy.mood('calm');
    /* Tes: Tatty's tallis */
    tallis.position.set(dad.position.x + .9, 2.0, dad.position.z + .4); await E.popIn(tallis, 1.1, 500); dad.mood('wave'); setTimeout(() => dad.mood('calm'), 1000 * E.F);
    await E.say('Tatty brings his tallis to shul.');
    await toCentre(tallis); await morph(tallis, 'tes'); E.setProgress(6, 1);
    await E.say('Tallis starts with Tes.');
    await E.say(['Tes says', S('t')]);
    await E.say('Tap Tes!'); await tapIt(L.tes, ['Tes says', S('t')]);
    await letterDone('tes');
    /* Yud: Dovid waves his hand */
    await E.say('Dovid sees his friend. He waves his hand!'); boy.mood('wave');
    yad.position.set(boy.position.x + .6, 2.1, boy.position.z); yad.scale.setScalar(.9); await E.popIn(yad, .9, 400);
    await E.wait(600); boy.mood('calm'); await E.say('A hand is a yad!');
    await toCentre(yad); await morph(yad, 'yud'); E.setProgress(6, 2);
    await E.say('Yad starts with Yud. Yud is the little letter.');
    await E.say(['Yud says', S('y')]);
    await E.say('Tap Yud!'); await tapIt(L.yud, ['Yud says', S('y')]);
    await letterDone('yud');
    /* Kaf: the Kiddush cup, Friday night */
    await E.say('Friday night, Tatty makes Kiddush.');
    shul.visible = false; table.visible = true; await E.popIn(table, table.scale.x, 400);
    await E.tween(900, q => { night.style.opacity = .5 * q; E.R.toneMappingExposure = .82 - q * .25; });
    candles.position.set(table.position.x + .5 * table.scale.x, 1.06 * table.scale.x + .55, table.position.z + .2); candles.scale.setScalar(.9 * table.scale.x); await E.popIn(candles, .9 * table.scale.x, 400);
    kos.position.set(dad.position.x + .8, 2.0, dad.position.z + .4); await E.popIn(kos, 1.1, 400); dad.mood('cheer');
    await E.say('Tatty holds the kos, the Kiddush cup.'); dad.mood('calm');
    await toCentre(kos); await morph(kos, 'kaf'); E.setProgress(6, 3);
    await E.say('Kos starts with Kaf. Kaf has a dot.');
    await E.say(['Kaf says', S('k')]);
    await E.say('Tap Kaf!'); await tapIt(L.kaf, ['Kaf says', S('k')]);
    /* Chaf: the dot floats away (like Beis and Veis) */
    E.setProgress(6, 4);
    float(L.kaf, false); const kp = L.kaf.position.clone(), ch = L.chaf; ch.position.copy(kp); ch.rotation.copy(L.kaf.rotation); ch.visible = true; ch.userData.dot.visible = true; L.kaf.visible = false;
    await E.say('Now watch the dot!');
    const d = ch.userData.dot, dp = d.position.clone(); E.sfx.whoosh();
    await E.tween(700, k => { d.position.set(dp.x + k * 1.5, dp.y + k * 2.6, dp.z + k * .5); d.scale.setScalar(1 - k); }, E.ease.out); d.visible = false; d.position.copy(dp); d.scale.setScalar(1);
    E.sparkle(E.worldPos(ch).add(new THREE.Vector3(1.4, 2.4, .5)), 14); float(ch);
    await E.say('No dot. This is Chaf!');
    await E.say(['Chaf says', S('ch')]);
    await E.say('Chaf sounds just like Ches!');
    await E.say('Tap Chaf!'); await tapIt(ch, ['Chaf says', S('ch')]);
    L.kaf.visible = true; L.kaf.position.copy(kp); float(L.kaf); await letterDone('kaf'); await letterDone('chaf');
    await E.tween(700, q => { night.style.opacity = .5 * (1 - q); E.R.toneMappingExposure = .57 + q * .25; });   /* Friday night lasts through Kaf and Chaf */
    /* the look-alikes, side by side; for each line the arrow (or the ring at the dot place) shows where to look */
    unit.letters.forEach(k => { L[k].visible = false; floaters.delete(L[k]); });
    await Promise.all([E.popOut(boy), E.popOut(dad), E.popOut(table), E.popOut(candles)]);
    const show = async (a, b, lines) => { const A = E.letter(a, 1.8), B = E.letter(b, 1.8); A.position.set(P ? .85 : 1.2, 1.6, .5); B.position.set(P ? -.85 : -1.2, 1.6, .5); E.scene.add(A, B); await Promise.all([E.popIn(A), E.popIn(B)]);
      for (const [k, line, dotPlace] of lines) { const l = k === a ? A : B;
        if (dotPlace) { ring.position.copy(l.userData.dotHome).setZ(.6); l.add(ring); ring.visible = true; arrow.visible = false; } else { ring.visible = false; E.pointAt(arrow, l, k, 1.8); }
        await E.say(line); await E.wait(250); }
      arrow.visible = false; ring.visible = false; await Promise.all([E.popOut(A), E.popOut(B)]); E.scene.remove(A, B); };
    E.setProgress(6, 5);
    await show('beis', 'kaf', [['beis', 'Beis has a tail at the bottom.'], ['kaf', 'Kaf is round at the bottom.']]);
    await show('kaf', 'chaf', [['kaf', 'Kaf has a dot.', true], ['chaf', 'Chaf has no dot.', true]]);
    /* every letter so far, right to left, and the chant */
    const all = [...unit.known, ...unit.letters], sz = P ? .4 : .7, gap = P ? .34 : .62;
    const made = all.map(k => E.letter(k, sz)), widths = made.map(l => l.userData.width), total = widths.reduce((a, b) => a + b, 0) + gap * .45 * (all.length - 1);
    let x = total / 2; made.forEach((l, i) => { x -= widths[i] / 2; l.position.set(x, 1.5, .4); x -= widths[i] / 2 + gap * .45; l.visible = false; E.scene.add(l); row.push(l); });   /* evenly spaced by each letter's own width */
    for (const l of row) { E.popIn(l, 1, 280); await E.wait(60); }
    E.setProgress(6, 6);
    await E.say('Let’s sing the Alef-Beis so far!');
    for (const l of row) { E.sfx.drum(); E.hop(l, .3, 300); await E.say(E.LETTERS[l.userData.key].name + ',', false); await E.wait(50); }
    await E.say('Now you! Tap Tes, Yud, Kaf and Chaf.');
    const left = row.filter(l => unit.letters.includes(l.userData.key));
    while (left.length) {
      const target = left[0]; const [hx, hy] = E.toScreen(E.worldPos(target).add(new THREE.Vector3(.15, -.35, .5))); E.hand.at(hx, hy, true);
      document.body.dataset.tapReady = left.map(l => 'row-' + l.userData.key).join(',');
      const l = await E.waitTap(row); E.hand.hide();
      if (!left.includes(l)) { E.sfx.boop(); E.shake(l, .08); await E.say(E.nameLine(l.userData.key)); await E.say('Now tap ' + E.LETTERS[target.userData.key].name + '!'); continue; }
      left.splice(left.indexOf(l), 1);
      E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .3, .5)), 20, 1); E.hop(l, .45);
      const st = E.star3d(.14); st.position.copy(l.position).add(new THREE.Vector3(0, sz * .85, .3)); E.scene.add(st); E.popIn(st); E.onFrame(t => st.rotation.y = t * 2);
      await E.say(E.nameLine(l.userData.key));
    }
    delete document.body.dataset.tapReady;
    return { stars: 3, line: 'Wonderful! You know Tes, Yud, Kaf and Chaf!' };
  };
}
