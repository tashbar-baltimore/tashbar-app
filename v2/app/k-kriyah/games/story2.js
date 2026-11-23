/* Unit 2 opener (Picture Story): Shloimy visits Zeidy.
   They pick grapes (gefen): the grapes turn into Gimmel. They go fishing (dag): the fish turns into Daled.
   Motzei Shabbos, Zeidy makes Havdalah: the candle turns into Hei. Then a short chant of all six letters, and he taps each new one.
   Every spoken line is 12 words or fewer; "hear it again" is always top left. */
import { makePictures } from '../pictures.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  const PIC = makePictures(E);
  const zeidy = E.person({ beard: 0xf2f2f2, hat: true, jacket: 0x1d2433, pants: 0x1d2433, hair: 0xe0e0e0, skin: 0xf6c9a2 }); zeidy.scale.setScalar(1.45);
  const boy = E.person({ kippah: 0x2e8b57, hair: 0x8a5a3c }); E.scene.add(zeidy, boy);
  const home = E.house({ wall: 0x8fd3ff, roof: 0x7b2d8e }); E.scene.add(home);
  /* the grapevine: two posts, a bar, leaves and grapes */
  const vine = new THREE.Group(); E.scene.add(vine); const wood = E.M(0x8a5a3c, { roughness: .6 });
  [-1, 1].forEach(x => vine.add(E.mesh(new THREE.CylinderGeometry(.07, .08, 2.2, 10), wood, x, 1.1, 0)));
  const bar = E.mesh(new THREE.CylinderGeometry(.06, .06, 2.3, 10), wood, 0, 2.2, 0); bar.rotation.z = Math.PI / 2; vine.add(bar);
  for (let i = 0; i < 9; i++) { const lf = E.mesh(new THREE.SphereGeometry(.26, 14, 10), E.M(0x3fae4a, { roughness: .55 }), -1 + i * .25, 2.25 + (i % 2) * .1, .05); lf.scale.set(1, .6, .7); vine.add(lf); }
  const bunch = PIC.gefen(); bunch.position.set(.2, 1.65, .15); bunch.scale.setScalar(.8); vine.add(bunch);
  /* the pond and the fish */
  const pond = E.mesh(new THREE.CylinderGeometry(1.6, 1.6, .06, 40), E.M(0x2f9be0, { roughness: .1, clearcoat: 1 }), 0, .03, 0, false); pond.scale.z = .5; E.scene.add(pond); pond.visible = false;
  const fish = PIC.dag(); fish.visible = false; E.scene.add(fish);
  const candle = PIC.havdalah(); candle.visible = false; E.scene.add(candle);
  const night = document.createElement('div'); night.style.cssText = 'position:fixed;inset:0;background:#0b1840;opacity:0;pointer-events:none;z-index:0'; document.body.insertBefore(night, E.$('#c'));
  const L = {}; unit.letters.forEach(k => { L[k] = E.letter(k, 2.5); L[k].visible = false; E.scene.add(L[k]); });
  const row = []; const glow = E.glowSprite('#ffffff', 6, 0); E.scene.add(glow);
  let P = false; const floaters = new Set();
  const X = () => P ? { row: 1.5, s: .5, mini: .3 } : { row: 3.1, s: .85, mini: .55 };
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.4, 11.5); E.camTarget.set(0, 1.9, 0); } else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.4, 0); }
    home.position.set(p ? 1.2 : 3.0, 0, -1.2); home.scale.setScalar(p ? .6 : .8);
  });
  E.onFrame(t => { floaters.forEach(l => { if (!l.userData.base) return; l.position.y = l.userData.base.y + Math.sin(t * 2 + l.position.x) * .07; l.rotation.y = Math.sin(t * .9 + l.position.x) * .3; });
    if (candle.visible && candle.userData.flame) candle.userData.flame.scale.y = 1 + Math.sin(t * 9) * .08; });
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
  /* a picture turns into its letter, in the middle, with sparkles */
  async function morph(picObj, k, gentle = false) {   /* gentle: the picture fades away and the letter rises from its glow (used for the Havdalah candle) */
    const from = E.worldPos(picObj), s0 = picObj.scale.x, l = L[k]; E.sfx.sparkle(); E.sfx.whoosh(); E.sparkle(from.clone().add(new THREE.Vector3(0, 0, .5)), 36, 1.4);
    l.position.set(0, 1.6, .6); l.visible = true; l.scale.setScalar(.01); glow.position.set(0, 1.6, -.3);
    if (gentle) { l.position.y = .6; await E.tween(900, q => { glow.material.opacity = q * .8; picObj.scale.setScalar(Math.max(.001, s0 * (1 - q))); }); picObj.visible = false;
      await E.tween(1000, q => { l.scale.setScalar(.01 + q * .99); l.position.y = .6 + q * 1.0; }); }
    else await E.tween(1300, q => { picObj.scale.setScalar(Math.max(.001, s0 * (1 - q))); picObj.rotation.y = q * 3; l.scale.setScalar(.01 + q * .99); l.rotation.y = (1 - q) * Math.PI * 2; glow.material.opacity = q * .8; });
    picObj.visible = false; float(l);
  }
  async function letterDone(k) {   /* the letter moves aside, small, so the next picture has room */
    const l = L[k]; float(l, false); const p0 = l.position.clone(), i = unit.letters.indexOf(k), to = new THREE.Vector3(X().row * (1 - i), P ? 4.4 : 3.6, -.5);
    await E.tween(600, q => { l.position.lerpVectors(p0, to, q); l.scale.setScalar(1 - q * (1 - X().mini)); glow.material.opacity = .8 * (1 - q); }); float(l);
  }
  async function walkTo(x) { boy.mood('walk'); zeidy.mood('walk'); const b0 = boy.position.x, z0 = zeidy.position.x;
    await E.tween(1400, q => { boy.position.x = b0 + (x - b0) * q; zeidy.position.x = z0 + (x - 1.2 - z0) * q; }, E.ease.lin); boy.mood('calm'); zeidy.mood('calm'); }

  boy.position.set(P ? -1.2 : -2.2, 0, 1.5); zeidy.position.set(P ? -1.6 : -3.4, 0, 1.0); vine.position.set(P ? .2 : 0, 0, -.4); vine.scale.setScalar(P ? .7 : 1);
  return async () => {
    E.setProgress(4, 0);
    boy.mood('wave'); await E.say('This is Shloimy. He visits his Zeidy!'); boy.mood('calm');
    zeidy.mood('wave'); await E.say('Zeidy has a gefen, a grapevine.'); zeidy.mood('calm');
    await E.say('Shloimy picks the grapes.'); boy.mood('cheer'); await E.hop(boy, .4); boy.mood('calm');
    /* Gimmel */
    await E.say('Watch! The grapes turn into a letter.');
    vine.remove(bunch); E.scene.add(bunch); bunch.position.set(vine.position.x + .2 * vine.scale.x, 1.65 * vine.scale.x, 0); bunch.scale.setScalar(.8 * vine.scale.x);
    await morph(bunch, 'gimmel'); E.setProgress(4, 1);
    await E.say('This is Gimmel. Gefen starts with Gimmel.');
    await E.say(['Gimmel says', S('g')]); await E.say('Tap Gimmel!');
    await tapIt(L.gimmel, ['Gimmel says', S('g')]);
    await letterDone('gimmel');
    /* Daled */
    await Promise.all([E.popOut(vine), E.popOut(home)]);
    await E.say('Now they go fishing.'); pond.position.set(0, 0, .3); await E.popIn(pond, 1, 400); pond.scale.z = .5;
    fish.position.set(0, .2, .5); fish.visible = true; fish.scale.setScalar(1); E.sfx.whoosh();
    await E.tween(900, q => { fish.position.y = .2 + Math.sin(q * Math.PI) * 1.4; fish.rotation.z = (q - .5) * -1.2; });
    await E.say('A dag! A fish!'); fish.position.set(0, 1.4, .5); fish.rotation.z = 0;
    await morph(fish, 'daled'); E.setProgress(4, 2);
    await E.say('This is Daled. Dag starts with Daled.');
    await E.say(['Daled says', S('d')]); await E.say('Tap Daled!');
    await tapIt(L.daled, ['Daled says', S('d')]);
    await letterDone('daled'); await E.popOut(pond);
    /* Hei */
    await E.say('Motzei Shabbos, Zeidy makes Havdalah.');
    await E.tween(900, q => { night.style.opacity = .55 * q; E.R.toneMappingExposure = .82 - q * .3; });
    candle.position.set(0, 1.5, .5); candle.scale.setScalar(1.3); await E.popIn(candle, 1.3, 500);
    await E.say('Look at the Havdalah candle!'); await E.wait(400);
    await morph(candle, 'hei', true); E.setProgress(4, 3);
    await E.tween(700, q => { night.style.opacity = .55 * (1 - q); E.R.toneMappingExposure = .52 + q * .3; });
    await E.say('This is Hei. Havdalah starts with Hei.');
    await E.say(['Hei says', S('h')]); await E.say('Tap Hei!');
    await tapIt(L.hei, ['Hei says', S('h')]);
    await letterDone('hei');
    /* all six letters in a row (right to left), and the chant */
    const all = [...unit.known, ...unit.letters];
    unit.letters.forEach(k => { L[k].visible = false; floaters.delete(L[k]); });
    if (P) await Promise.all([E.popOut(zeidy), E.popOut(boy)]);   /* on a phone there's no room beside the row */
    else { const b0 = boy.position.clone(), z0 = zeidy.position.clone(); boy.mood('walk'); zeidy.mood('walk');
      await E.tween(900, q => { boy.position.lerpVectors(b0, new THREE.Vector3(-3.95, 0, .6), q); zeidy.position.lerpVectors(z0, new THREE.Vector3(-4.75, 0, -.2), q); }); boy.mood('calm'); zeidy.mood('calm'); }
    all.forEach((k, i) => { const l = E.letter(k, P ? .8 : 1.15); l.position.set(((all.length - 1) / 2 - i) * (P ? .72 : 1.15), 1.5, .4); l.visible = false; E.scene.add(l); row.push(l); });
    for (const l of row) { E.popIn(l, 1, 300); await E.wait(90); }
    E.setProgress(4, 4);
    await E.say('Let’s sing the Alef-Beis so far!');
    for (let r = 0; r < 2; r++) for (const l of row) { E.sfx.drum(); E.hop(l, .4, 320); await E.say(E.LETTERS[l.userData.key].name + ',', false); await E.wait(60); }
    /* now you: tap each new letter */
    await E.say('Now you! Tap Gimmel, Daled and Hei.');
    const left = row.filter(l => unit.letters.includes(l.userData.key));
    while (left.length) {
      const target = left[0]; const [x, y] = E.toScreen(E.worldPos(target).add(new THREE.Vector3(.3, -.5, .5))); E.hand.at(x, y, true);
      document.body.dataset.tapReady = left.map(l => 'row-' + l.userData.key).join(',');
      const l = await E.waitTap(row); E.hand.hide();
      if (!left.includes(l)) { E.sfx.boop(); E.shake(l, .1); await E.say(E.nameLine(l.userData.key)); await E.say('Now tap ' + E.LETTERS[target.userData.key].name + '!'); continue; }
      left.splice(left.indexOf(l), 1);
      E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .3, .6)), 22, 1.1); E.hop(l, .5);
      const st = E.star3d(.2); st.position.copy(l.position).add(new THREE.Vector3(0, P ? .7 : .95, .3)); E.scene.add(st); E.popIn(st); E.onFrame(t => st.rotation.y = t * 2);
      await E.say(E.nameLine(l.userData.key));
    }
    delete document.body.dataset.tapReady;
    return { stars: 3, line: 'Wonderful! You know Gimmel, Daled and Hei!' };
  };
}
