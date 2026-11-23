/* Unit 3 opener (Picture Story): Ari helps Mommy bake challah for Shabbos, and the family sings zemiros.
   Mommy hangs her apron on a hook (a "vov"): the hook turns into Vov. The challah turns into Ches. Friday night the family sings
   zemiros: the music turns into Zayin. Then the look-alikes side by side (Zayin's crown, Hei's floating leg and Ches's leg that
   touches), a chant of all nine letters, and he taps each new one. Every spoken line is 12 words or fewer. */
import { makePictures } from '../pictures.js';
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  const PIC = makePictures(E);
  const mom = E.mommy(), boy = E.ari(); E.scene.add(mom, boy);
  const table = new THREE.Group(); E.scene.add(table);
  table.add(E.mesh(E.rbox(2.6, .12, 1.2, .05), E.M(0xc68a52, { roughness: .55 }), 0, 1.0, 0)); [-1.1, 1.1].forEach(x => [-.45, .45].forEach(z => table.add(E.mesh(new THREE.CylinderGeometry(.05, .05, 1, 8), E.M(0xa86f3c), x, .5, z))));
  const dough = E.mesh(new THREE.SphereGeometry(.35, 20, 14), E.M(0xf3dcb0, { roughness: .7 }), .3, 1.25, 0); dough.scale.y = .6; table.add(dough);
  const hook = PIC.vov(); hook.visible = false; E.scene.add(hook);
  const challah = PIC.challah(); challah.visible = false; E.scene.add(challah);
  const notes = PIC.zemiros(); notes.visible = false; E.scene.add(notes);
  const candles = PIC.neiros(); candles.visible = false; E.scene.add(candles);
  const night = document.createElement('div'); night.style.cssText = 'position:fixed;inset:0;background:#0b1840;opacity:0;pointer-events:none;z-index:0'; document.body.insertBefore(night, E.$('#c'));
  const L = {}; unit.letters.forEach(k => { L[k] = E.letter(k, 2.5); L[k].visible = false; E.scene.add(L[k]); });
  const row = [], glow = E.glowSprite('#ffffff', 6, 0); E.scene.add(glow);
  const ring = E.noticeRing(.26); E.scene.add(ring);
  let P = false; const floaters = new Set();
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.4, 11.5); E.camTarget.set(0, 1.9, 0); } else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.4, 0); }
    table.position.set(p ? .6 : 1.6, 0, -.6); table.scale.setScalar(p ? .7 : 1);
  });
  E.onFrame(t => { floaters.forEach(l => { if (!l.userData.base) return; l.position.y = l.userData.base.y + Math.sin(t * 2 + l.position.x) * .07; l.rotation.y = Math.sin(t * .9 + l.position.x) * .3; });
    if (notes.visible) notes.rotation.z = Math.sin(t * 3) * .15; });
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
  async function letterDone(k) {
    const l = L[k]; float(l, false); const p0 = l.position.clone(), i = unit.letters.indexOf(k), to = new THREE.Vector3((P ? 1.5 : 3.1) * (1 - i), P ? 4.4 : 3.6, -.5);
    await E.tween(600, q => { l.position.lerpVectors(p0, to, q); l.scale.setScalar(1 - q * (1 - (P ? .3 : .55))); glow.material.opacity = .8 * (1 - q); }); float(l);
  }
  boy.position.set(P ? -1.0 : -2.0, 0, 1.4); mom.position.set(P ? -1.6 : -3.2, 0, .8);
  return async () => {
    E.setProgress(5, 0);
    boy.mood('wave'); await E.say('This is Ari. It’s Friday!'); boy.mood('calm');
    mom.mood('wave'); await E.say('Ari helps Mommy bake challah for Shabbos.'); mom.mood('calm');
    /* Vov: the hook */
    hook.position.set(0, 1.7, .5); hook.scale.setScalar(1.3); await E.popIn(hook, 1.3, 500);
    await E.say('Mommy hangs her apron on a hook.');
    await E.say('A hook is called a vov!');
    await morph(hook, 'vov'); E.setProgress(5, 1);
    await E.say(['This is Vov. Vov says', S('v')]);
    await E.say('Vov says v, just like Veis!');
    await E.say('Tap Vov!'); await tapIt(L.vov, ['Vov says', S('v')]);
    await letterDone('vov');
    /* Ches: the challah */
    await E.say('Now they braid the challah!'); boy.mood('cheer'); E.hop(boy, .3);
    const dp = E.worldPos(dough); table.remove(dough); challah.position.copy(dp); challah.scale.setScalar(.01); await E.popIn(challah, 1.1, 600); boy.mood('calm');
    await E.tween(500, q => challah.position.lerpVectors(dp, new THREE.Vector3(0, 1.6, .6), q));
    await morph(challah, 'ches'); E.setProgress(5, 2);
    await E.say('Challah starts with Ches.');
    await E.say(['Ches says', S('ch')]);
    await E.say('Tap Ches!'); await tapIt(L.ches, ['Ches says', S('ch')]);
    await letterDone('ches');
    /* Zayin: zemiros on Friday night */
    await E.say('Friday night, the family sings zemiros.');
    await E.tween(900, q => { night.style.opacity = .5 * q; E.R.toneMappingExposure = .82 - q * .25; });
    candles.position.set(table.position.x, 1.06 * table.scale.x + .55, table.position.z + .2); candles.scale.setScalar(.9 * table.scale.x); await E.popIn(candles, .9 * table.scale.x, 400);
    notes.position.set(0, 1.3, .6); notes.scale.setScalar(1.3); await E.popIn(notes, 1.3, 400); E.sfx.fanfare();
    await E.tween(800, q => { notes.position.y = 1.3 + q * .4; });
    await morph(notes, 'zayin'); E.setProgress(5, 3);
    await E.tween(700, q => { night.style.opacity = .5 * (1 - q); E.R.toneMappingExposure = .57 + q * .25; });
    await E.say('Zemiros starts with Zayin.');
    await E.say(['Zayin says', S('z')]);
    await E.say('Tap Zayin!'); await tapIt(L.zayin, ['Zayin says', S('z')]);
    await letterDone('zayin');
    /* the look-alikes, side by side, with the difference circled */
    unit.letters.forEach(k => { L[k].visible = false; floaters.delete(L[k]); });
    await Promise.all([E.popOut(mom), E.popOut(boy), E.popOut(table), E.popOut(candles)]);
    const show = async (a, b, line, mark) => { const A = E.letter(a, 1.8), B = E.letter(b, 1.8); A.position.set(P ? .85 : 1.2, 1.6, .5); B.position.set(P ? -.85 : -1.2, 1.6, .5); E.scene.add(A, B); await Promise.all([E.popIn(A), E.popIn(B)]);
      const f = mark[1], p = E.fontToLocal(mark[0], 1.8, f[0], f[1]), host = mark[0] === a ? A : B; ring.position.copy(host.position).add(new THREE.Vector3(p.x, p.y, .5)); ring.visible = true;
      await E.say(line[0]); await E.say(line[1]); ring.visible = false; await Promise.all([E.popOut(A), E.popOut(B)]); E.scene.remove(A, B); };
    E.setProgress(5, 4);
    await show('vov', 'zayin', ['Zayin has a crown on top.', 'Vov has no crown.'], ['zayin', [250, 500]]);
    await show('hei', 'ches', ['Hei’s little leg doesn’t touch the roof.', 'Ches’s leg touches the roof.'], ['ches', [150, 420]]);
    /* all nine letters, right to left, and the chant */
    const all = [...unit.known, ...unit.letters], sz = P ? .5 : .82, gap = P ? .46 : .82;
    all.forEach((k, i) => { const l = E.letter(k, sz); l.position.set(((all.length - 1) / 2 - i) * gap, 1.5, .4); l.visible = false; E.scene.add(l); row.push(l); });
    for (const l of row) { E.popIn(l, 1, 280); await E.wait(70); }
    E.setProgress(5, 5);
    await E.say('Let’s sing the Alef-Beis so far!');
    for (const l of row) { E.sfx.drum(); E.hop(l, .35, 300); await E.say(E.LETTERS[l.userData.key].name + ',', false); await E.wait(50); }
    await E.say('Now you! Tap Vov, Zayin and Ches.');
    const left = row.filter(l => unit.letters.includes(l.userData.key));
    while (left.length) {
      const target = left[0]; const [x, y] = E.toScreen(E.worldPos(target).add(new THREE.Vector3(.2, -.4, .5))); E.hand.at(x, y, true);
      document.body.dataset.tapReady = left.map(l => 'row-' + l.userData.key).join(',');
      const l = await E.waitTap(row); E.hand.hide();
      if (!left.includes(l)) { E.sfx.boop(); E.shake(l, .08); await E.say(E.nameLine(l.userData.key)); await E.say('Now tap ' + E.LETTERS[target.userData.key].name + '!'); continue; }
      left.splice(left.indexOf(l), 1);
      E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .3, .5)), 20, 1); E.hop(l, .45);
      const st = E.star3d(.16); st.position.copy(l.position).add(new THREE.Vector3(0, sz * .85, .3)); E.scene.add(st); E.popIn(st); E.onFrame(t => st.rotation.y = t * 2);
      await E.say(E.nameLine(l.userData.key));
    }
    delete document.body.dataset.tapReady;
    return { stars: 3, line: 'Wonderful! You know Vov, Zayin and Ches!' };
  };
}
