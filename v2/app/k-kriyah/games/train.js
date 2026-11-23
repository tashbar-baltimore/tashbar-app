/* Alef-Beis Train: put the letter cars on the train in Alef-Beis order, the way the boys sing it in cheder.
   Skill: knows the order Alef, Beis, Veis, Gimmel, Daled, Hei. The chant plays with a drum (rhythm and music learners).
   Round 1: he fills the whole train, one car after another. Round 2: some cars are already on; he fills the empty places.
   A wrong car rolls back and he hears the chant up to the place he needs; if he struggles, the right car glows. */
export default function setup(E, { struggled, unit }) {
  const { THREE } = E;
  const ORDER = [...unit.known, ...unit.letters];          /* Alef, Beis, Veis, Gimmel, Daled, Hei */
  const n = ORDER.length, carCols = [0xff7aa8, 0x46c3ff, 0xffcf3a, 0x7bd94a, 0xb388ff, 0xff9f1a, 0x00c2d1];
  const dark = E.M(0x26324a, { roughness: .4 }), red = E.M(0xe8322b, { roughness: .3, clearcoat: .8 }), gold = E.M(0xffd43b, { metalness: .5, roughness: .3 });
  /* the track */
  const track = new THREE.Group(); E.scene.add(track);
  [-.32, .32].forEach(z => track.add(E.mesh(new THREE.BoxGeometry(14, .06, .08), E.M(0x9aa7b8, { metalness: .6, roughness: .3 }), 0, .05, z, false)));
  for (let i = 0; i < 28; i++) track.add(E.mesh(new THREE.BoxGeometry(.18, .05, .9), E.M(0x8a5a3c, { roughness: .7 }), -7 + i * .5, .02, 0, false));
  /* the engine (it faces left: the train goes the way Hebrew reads) */
  const loco = new THREE.Group(); E.scene.add(loco);
  loco.add(E.mesh(E.rbox(1.25, .6, .8, .1), red, 0, .55, 0)); loco.add(E.mesh(E.rbox(.55, .7, .8, .08), red, .38, 1.15, 0));
  loco.add(E.mesh(E.rbox(.62, .12, .9, .05), dark, .38, 1.55, 0)); loco.add(E.mesh(new THREE.CylinderGeometry(.12, .16, .45, 14), dark, -.35, 1.05, 0));
  loco.add(E.mesh(new THREE.BoxGeometry(.4, .3, .06), E.M(0xbfe8ff, { roughness: .1, clearcoat: 1 }), .38, 1.2, .42, false));
  [-.38, .38].forEach(x => [-.42, .42].forEach(z => { const w = E.mesh(new THREE.CylinderGeometry(.2, .2, .1, 20), dark, x, .22, z); w.rotation.x = Math.PI / 2; loco.add(w); }));
  const puffs = []; for (let i = 0; i < 4; i++) { const p = E.mesh(new THREE.SphereGeometry(.14, 12, 8), E.M(0xffffff, { roughness: .9, clearcoat: 0, transparent: true, opacity: .8 }), -.35, 1.4, 0, false); loco.add(p); puffs.push(p); }
  const driver = E.mendy(); driver.scale.setScalar(.42); driver.position.set(.38, .85, -.05); loco.add(driver);
  /* the cars: each carries one letter */
  const cars = ORDER.map((k, i) => { const c = new THREE.Group(); c.add(E.mesh(E.rbox(1.0, .55, .75, .08), E.M(carCols[i % 7], { roughness: .25, clearcoat: 1 }), 0, .55, 0));
    [-.3, .3].forEach(x => [-.38, .38].forEach(z => { const w = E.mesh(new THREE.CylinderGeometry(.15, .15, .08, 16), dark, x, .2, z); w.rotation.x = Math.PI / 2; c.add(w); }));
    c.add(E.mesh(new THREE.BoxGeometry(.12, .06, .06), gold, .56, .4, 0));
    const l = E.letter(k, .8); l.position.set(0, 1.15, .1); c.add(l); c.userData = { key: k, i, on: false, letter: l }; E.scene.add(c); return c; });
  const glow = E.glowSprite('#fff7b0', 2.2, 0); E.scene.add(glow);
  let P = false, S = 1, slotX = [], homes = [], busy = true, enabled = false, drag = null, grab = new THREE.Vector3(), help = struggled, wrong = 0, wrongInRow = 0, resolveRound = null, gaps = null, rolling = false;
  const slotPos = i => new THREE.Vector3(slotX[i], 0, .2);
  E.onLayout(p => { P = p; S = p ? .5 : 1;
    const lx = p ? 1.68 : 4.6, step = p ? .55 : 1.22;   /* on a phone the whole train fits the width */ loco.position.set(lx, 0, .2); loco.scale.setScalar(S); track.scale.set(1, 1, S); track.position.z = .2;
    slotX = ORDER.map((_, i) => lx - (p ? .67 : 1.35) - i * step);
    homes = ORDER.map((_, i) => p ? new THREE.Vector3(1.3 - (i % 3) * 1.3, i < 3 ? 3.3 : 2.05, .6) : new THREE.Vector3(3.0 - i * 1.3, 0, 3.9));   /* all inside the screen: on a phone, two rows above the train */   /* waiting on the grass in front of the track */
    cars.forEach(c => c.userData.letter.scale.setScalar(p ? 1.35 : 1));   /* bigger letters on a phone */
    cars.forEach(c => { c.scale.setScalar(c.userData.on ? S : (p ? .75 : .8)); if (c.userData.on) c.position.copy(slotPos(c.userData.slot)); else if (c !== drag) c.position.copy(homes[c.userData.home ?? c.userData.i]); });
    if (p) { E.camBase.set(0, 2.3, 11); E.camTarget.set(0, 1.8, 0); } else { E.camBase.set(0, 2.7, 10.2); E.camTarget.set(0, 1.5, 0); }
  });
  E.onFrame(t => {
    puffs.forEach((p, i) => { const k = ((t * .8 + i / 4) % 1); p.position.set(-.35 - k * .5, 1.4 + k * .9, 0); p.scale.setScalar(.6 + k * 1.2); p.material.opacity = .8 * (1 - k); });
    cars.forEach((c, i) => { if (!c.userData.on && c !== drag && !c.userData.busy && c.visible) { c.position.y = homes[c.userData.home ?? i].y + Math.sin(t * 2 + i) * .05; } c.userData.letter.rotation.y = Math.sin(t * 1.3 + i) * .2; });
    const need = nextNeeded(), g = need != null && cars.find(c => c.userData.key === ORDER[need] && !c.userData.on);
    if (help && g && enabled) { glow.position.copy(g.position).add(new THREE.Vector3(0, .9 * g.scale.x, -.4)); glow.material.opacity = .55 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0;
  });
  const nextNeeded = () => { if (gaps) return gaps.find(i => !cars.some(c => c.userData.on && c.userData.slot === i)); const k = cars.filter(c => c.userData.on).length; return k < n ? k : null; };
  window.__info = () => ({ ready: enabled && !busy, need: nextNeeded() != null ? ORDER[nextNeeded()] : null, needSlot: nextNeeded(),
    cars: cars.filter(c => !c.userData.on && c.visible).map(c => ({ k: c.userData.key, xy: E.toScreen(c.position.clone().add(new THREE.Vector3(0, .7 * c.scale.x, 0))) })),
    slots: slotX.map((_, i) => E.toScreen(slotPos(i).add(new THREE.Vector3(0, .6 * S, 0)))) });

  E.onPointer('down', e => { if (!enabled || busy) return; const c = E.pickFrom(e, cars.filter(c => !c.userData.on && !c.userData.busy)); if (!c) return; drag = c; const p = E.planePoint(e, c.position.z); if (p) grab.copy(c.position).sub(p); c.scale.multiplyScalar(1.1); });
  E.onPointer('move', e => { if (!drag) return; const p = E.planePoint(e, drag.position.z); if (p) drag.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!drag) return; const c = drag; drag = null; c.scale.setScalar(P ? .75 : .8); place(c, slotUnder(c)); });
  /* which empty place on the train the car was dropped on (near the train, nearest empty place) */
  function slotUnder(c) { const [cx, cy] = E.toScreen(c.position); let best = null, bd = Math.min(innerWidth, innerHeight) * .22;
    slotX.forEach((_, i) => { if (cars.some(o => o.userData.on && o.userData.slot === i)) return; if (!gaps && i !== nextNeeded()) return; const [x, y] = E.toScreen(slotPos(i)), d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = i; } });
    return best; }
  const chantTo = i => ORDER.slice(0, i + 1).map(k => E.LETTERS[k].name).join(', ') + '!';
  async function place(c, slot) {
    const home = homes[c.userData.home ?? c.userData.i], p0 = c.position.clone();
    if (slot == null) { c.userData.busy = true; await E.tween(350, q => c.position.lerpVectors(p0, home, q), E.ease.out); c.userData.busy = false; return; }
    busy = true;
    if (ORDER[slot] === c.userData.key) {
      wrongInRow = 0; c.userData.on = true; c.userData.slot = slot; const to = slotPos(slot);
      await E.tween(420, q => { c.position.lerpVectors(p0, to, q); c.position.y += Math.sin(q * Math.PI) * .6; c.scale.setScalar((P ? .75 : .8) + (S - (P ? .75 : .8)) * q); });
      E.sfx.drum(); E.sparkle(to.clone().add(new THREE.Vector3(0, .8 * S, .4)), 14); E.hop(c, .25, 300);
      await E.say(c.userData.key === 'alef' ? 'Alef!' : [E.LETTERS[c.userData.key].name + '!', E.S(E.LETTERS[c.userData.key].snd)], false);
      busy = false;
      if (nextNeeded() == null && resolveRound) { const r = resolveRound; resolveRound = null; r(); }
    } else {
      E.sfx.boop(); wrong++; wrongInRow++; c.userData.busy = true; await E.tween(380, q => c.position.lerpVectors(p0, home, q), E.ease.out); await E.shake(c, .12); c.userData.busy = false;
      const need = gaps ? slot : nextNeeded();
      await E.say('That is ' + E.LETTERS[c.userData.key].name + '. Listen.');
      await chant(need, true);
      await E.say(E.LETTERS[ORDER[need]].name + ' goes here!');
      if (wrongInRow >= 2 || wrong >= 3) help = true;
      busy = false;
    }
  }
  /* the chant: each car (or loose car) hops on its beat */
  async function chant(upTo = n - 1, quick = false) {
    for (let i = 0; i <= upTo; i++) { const c = cars.find(x => x.userData.key === ORDER[i]); E.sfx.drum(); if (c) E.hop(c.userData.letter, .35, 300);
      await E.say(E.LETTERS[ORDER[i]].name + (i === upTo ? '!' : ','), false); if (!quick) await E.wait(80); }
  }
  async function chug(away = true) {   /* the full train rolls off to the left, then comes back empty */
    rolling = true; const on = cars.filter(c => c.userData.on), x0 = loco.position.x, starts = on.map(c => c.position.x); E.sfx.whoosh();
    await E.tween(1600, q => { const dx = -q * 12; loco.position.x = x0 + dx; on.forEach((c, i) => c.position.x = starts[i] + dx); }, E.ease.inOut);
    rolling = false;
  }
  async function roundOne() {
    E.setProgress(2, 0);
    await E.say('All aboard the Alef-Beis train!');
    await E.say('Listen to the order.'); await chant();
    await E.say('Watch me. Alef goes first.');
    const c0 = cars.find(c => c.userData.key === ORDER[0]);   /* the demo: Alef goes first */ let [x, y] = E.toScreen(c0.position); E.hand.at(x, y); await E.wait(350);
    const p0 = c0.position.clone(), p1 = slotPos(0).add(new THREE.Vector3(0, .6, .3)); await E.tween(1100, q => { c0.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(c0.position); E.hand.at(a, b); });
    E.hand.hide(); await place(c0, 0);
    await E.say('Now you! Which car comes next?'); wrong = 0;
    const done = new Promise(r => resolveRound = r); enabled = true; busy = false; document.body.dataset.trainReady = 1;
    await done; enabled = false;
    E.joy(loco.position.clone().add(new THREE.Vector3(-2, 1.5, 1)), true); await chant(); await chug();
    E.setProgress(2, 1);
  }
  async function roundTwo() {
    /* the train comes back with some cars on, and gaps to fill */
    gaps = [1, 3, 5]; const gapHomes = [0, 2, 4].sort(() => Math.random() - .5);
    const lx = P ? 1.68 : 4.6; loco.position.x = lx + 10;
    cars.forEach((c, i) => { if (gaps.includes(i)) { c.userData.on = false; c.userData.slot = null; c.userData.home = gapHomes[gaps.indexOf(i)]; c.scale.setScalar(P ? .75 : .8); c.position.copy(homes[c.userData.home]); c.visible = true; }
      else { c.userData.on = true; c.userData.slot = i; c.scale.setScalar(S); c.position.copy(slotPos(i)).add(new THREE.Vector3(10, 0, 0)); } });
    const on = cars.filter(c => c.userData.on), sx = on.map(c => c.position.x);
    await E.tween(1600, q => { loco.position.x = lx + 10 * (1 - q); on.forEach((c, i) => c.position.x = sx[i] - 10 * q); }, E.ease.out);
    await E.say('Some cars are missing! Fill the empty places.');
    const done = new Promise(r => resolveRound = r); enabled = true; busy = false;
    await done; enabled = false;
    E.joy(loco.position.clone().add(new THREE.Vector3(-2, 1.5, 1)), true); await chant();   /* the full train stays on screen for the end */
    E.setProgress(2, 2);
  }
  /* the waiting cars are mixed up (never in Alef-Beis order, no car in its own place), so the order comes from him */
  const derange = m => { let a; do { a = [...Array(m).keys()].sort(() => Math.random() - .5); } while (a.some((v, i) => v === i)); return a; };
  return async () => {
    const perm = derange(n); cars.forEach((c, i) => { c.userData.home = perm[i]; c.position.copy(homes[perm[i]]); });
    await roundOne(); await roundTwo();
    const stars = wrong <= 1 ? 3 : wrong <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Choo choo! You know the Alef-Beis order!' : null };
  };
}
