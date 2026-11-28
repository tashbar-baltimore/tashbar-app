/* Alef-Beis Train: put the letter cars on the train in Alef-Beis order, the way the boys sing it in cheder.
   Skill: knows the order Alef, Beis, Veis, Gimmel, Daled, Hei. The chant plays with a drum (rhythm and music learners).
   Round 1: he fills the whole train, one car after another. Round 2: some cars are already on; he fills the empty places.
   A wrong car rolls back and he hears the chant up to the place he needs; if he struggles, the right car glows. */
export default function setup(E, { struggled, unit, game = {} }) {
  const { THREE } = E;
  const ORDER = game.order || [...unit.known, ...unit.letters];   /* a later unit's train carries the newest six letters, in order */          /* Alef, Beis, Veis, Gimmel, Daled, Hei */
  const n = ORDER.length, carCols = [0xff7aa8, 0x46c3ff, 0xffcf3a, 0x7bd94a, 0xb388ff, 0xff9f1a, 0x00c2d1];
  const dark = E.M(0x26324a, { roughness: .4 }), red = E.M(0xe8322b, { roughness: .3, clearcoat: .8 }), gold = E.M(E.CALM ? 0x5a6578 : 0xffd43b, { metalness: E.CALM ? 0 : .5, roughness: .3 });
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
  const driver = E.unitBoy ? E.unitBoy(unit.n) : E.mendy(); driver.scale.setScalar(.42); driver.position.set(.38, .85, -.05); loco.add(driver);
  /* the cars: each carries one letter */
  const cars = ORDER.map((k, i) => { const c = new THREE.Group(); c.add(E.mesh(E.rbox(1.0, .55, .75, .08), E.M(carCols[i % 7], { roughness: .25, clearcoat: 1 }), 0, .55, 0));
    [-.3, .3].forEach(x => [-.38, .38].forEach(z => { const w = E.mesh(new THREE.CylinderGeometry(.15, .15, .08, 16), dark, x, .2, z); w.rotation.x = Math.PI / 2; c.add(w); }));
    c.add(E.mesh(new THREE.BoxGeometry(.12, .06, .06), gold, .56, .4, 0));
    const l = E.letter(k, .8); l.position.set(0, 1.15 + l.userData.below, .1); if (E.CALM) { l.position.set(0, 0, .1); l.updateMatrixWorld(true); const lift = -new THREE.Box3().setFromObject(l.userData.body).min.y; l.children.forEach(ch => ch.position.y += lift); l.position.y = .95; }   /* calm: the letter's foot stands on the roof, so nothing of it sinks into the car (reviewer: Alef was two bumps, Hei lost its leg) */   /* Kuf's long leg shows above the car */ c.add(l); c.userData = { key: k, i, on: false, letter: l }; E.scene.add(c); return c; });
  const glow = E.glowSprite('#fff7b0', 2.2, 0); E.scene.add(glow);
  let LX = 4.6, P = false, S = 1, slotX = [], homes = [], busy = true, enabled = false, drag = null, grab = new THREE.Vector3(), help = struggled, wrong = 0, wrongInRow = 0, resolveRound = null, gaps = null, rolling = false;
  const slotPos = i => new THREE.Vector3(slotX[i], 0, .2);
  E.onLayout(p => { P = p; S = p ? (ORDER.length === 5 ? .6 : .5) : 1;
    const lx = p ? (ORDER.length >= 7 ? 2.0 : ORDER.length >= 6 ? 1.85 : ORDER.length === 5 ? 1.75 : 1.68) : 4.6, step = p ? (ORDER.length >= 7 ? .53 : ORDER.length >= 6 ? .6 : ORDER.length === 5 ? .68 : .55) : 1.22;   /* seven cars: a little closer, so the last car stays on a phone screen */   /* on a phone the whole train fits the width */ LX = lx; loco.position.set(lx, 0, .2); loco.scale.setScalar(S); track.scale.set(1, 1, S); track.position.z = .2;
    slotX = ORDER.map((_, i) => lx - (p ? .67 : 1.35) - i * step);
    const top = Math.ceil(ORDER.length / 2), per = ORDER.length > 6 ? [top, ORDER.length - top] : [3, 3];   /* seven cars: four on top, three below, none on top of another */
    homes = ORDER.map((_, i) => p ? (() => { const r = i < per[0] ? 0 : 1, j = r ? i - per[0] : i, n = per[r], gap = n > 3 ? 1.05 : 1.3; return new THREE.Vector3(((n - 1) / 2 - j) * gap, r ? 1.6 : 3.2, .6); })() : new THREE.Vector3(ORDER.length > 6 ? ((ORDER.length - 1) / 2 - i) * .76 : E.CALM ? ((ORDER.length - 1) / 2 - i) * 1.08 : 2.25 - i * .98, 0, ORDER.length > 6 ? 3.7 : E.CALM ? 3.6 : 4.2));   /* calm: the waiting cars stand well apart, so they never look like a train already made */   /* seven cars: centred and a little closer, so none leaves the screen */   /* all inside the screen: on a phone, two rows above the train */   /* waiting on the grass in front of the track */
    cars.forEach(c => c.userData.letter.scale.setScalar(p ? 1.45 : 1));   /* much bigger letters on a phone (reviewer: Kaf's dot hardly showed) */
    cars.forEach(c => { c.scale.setScalar(c.userData.on ? S : (p ? .75 : .7)); if (c.userData.on) c.position.copy(slotPos(c.userData.slot)); else if (c !== drag) c.position.copy(homes[c.userData.home ?? c.userData.i]); });
    if (p) { E.camBase.set(0, 2.3, 11); E.camTarget.set(0, 1.8, 0); } else { E.camBase.set(0, 2.7, 10.2); E.camTarget.set(0, 1.5, 0); }
  });
  E.onFrame(t => {
    puffs.forEach((p, i) => { const k = ((t * .8 + i / 4) % 1); p.position.set(-.35 - k * .5, 1.4 + k * .9, 0); p.scale.setScalar(.6 + k * 1.2); p.material.opacity = .8 * (1 - k); });
    cars.forEach((c, i) => { if (!c.userData.on && c !== drag && !c.userData.busy && c.visible) { c.position.y = homes[c.userData.home ?? i].y + Math.sin(t * 2 + i) * .05; } if (!E.CALM) c.userData.letter.rotation.y = Math.sin(t * 1.3 + i) * .2; if (P) c.userData.letter.scale.setScalar(c.userData.on ? (swapPairs.length ? 1.15 : ORDER.length >= 6 ? 1.25 : 1.2) : 1.3);   /* in the mix-up round the letters on the train are bigger, so the dots show */ });   /* on a phone, letters on the train are bigger */
    const need = nextNeeded(), g = swapPairs.length ? cars.find(c => swapPairs.some(p => p.includes(c.userData.slot))) : need != null && cars.find(c => c.userData.key === ORDER[need] && !c.userData.on);   /* in the mix-up round, a mixed-up car glows */
    if (help && g && enabled) { glow.position.copy(g.position).add(new THREE.Vector3(0, .9 * g.scale.x, -.4)); glow.material.opacity = .55 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0;
  });
  const nextNeeded = () => { if (gaps) return gaps.find(i => !cars.some(c => c.userData.on && c.userData.slot === i)); const k = cars.filter(c => c.userData.on).length; return k < n ? k : null; };
  window.__info = () => ({ ready: enabled && !busy, need: nextNeeded() != null ? ORDER[nextNeeded()] : null, needSlot: nextNeeded(),
    cars: cars.filter(c => !c.userData.on && c.visible).map(c => ({ k: c.userData.key, xy: E.toScreen(c.position.clone().add(new THREE.Vector3(0, .7 * c.scale.x, 0))) })),
    slots: slotX.map((_, i) => E.toScreen(slotPos(i).add(new THREE.Vector3(0, .6 * S, 0)))),
    swap: swapPairs.length && enabled && !busy ? { wrong: cars.filter(c => swapPairs.some(p => p.includes(c.userData.slot))).map(c => E.toScreen(c.position.clone().add(new THREE.Vector3(0, .7 * S, 0)))), right: cars.filter(c => !swapPairs.some(p => p.includes(c.userData.slot))).map(c => E.toScreen(c.position.clone().add(new THREE.Vector3(0, .7 * S, 0)))) } : null });

  E.onPointer('down', e => { if (!enabled || busy || swapPairs.length) return; const c = E.pickFrom(e, cars.filter(c => !c.userData.on && !c.userData.busy)); if (!c) return; drag = c; const p = E.planePoint(e, c.position.z); if (p) grab.copy(c.position).sub(p); c.scale.multiplyScalar(1.1); });
  E.onPointer('move', e => { if (!drag) return; const p = E.planePoint(e, drag.position.z); if (p) drag.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!drag) return; const c = drag; drag = null; c.scale.setScalar(P ? .75 : .7); place(c, slotUnder(c)); });
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
      await E.tween(420, q => { c.position.lerpVectors(p0, to, q); c.position.y += Math.sin(q * Math.PI) * .6; c.scale.setScalar((P ? .75 : .7) + (S - (P ? .75 : .7)) * q); });
      E.sfx.drum(); E.sparkle(to.clone().add(new THREE.Vector3(0, .8 * S, .4)), 14); E.hop(c, .25, 300);
      await E.say(E.quiet(c.userData.key) ? E.LETTERS[c.userData.key].name + '!' : [E.LETTERS[c.userData.key].name + '!', E.S(E.LETTERS[c.userData.key].snd)], false);
      busy = false;
      if (nextNeeded() == null && resolveRound) { const r = resolveRound; resolveRound = null; r(); }
    } else {
      E.sfx.boop(); wrong++; wrongInRow++; c.userData.busy = true; await E.tween(380, q => c.position.lerpVectors(p0, home, q), E.ease.out); await E.shake(c, .12); c.userData.busy = false;
      const need = gaps ? slot : nextNeeded();
      if (E.CALM && E.sameShape(c.userData.key, ORDER[need])) { const nk = ORDER[need], dk = E.LETTERS[nk].dagesh ? nk : c.userData.key, nd = dk === nk ? c.userData.key : nk;   /* Kaf and Chaf: the chant can't help, the dot can */
        await E.say(E.LETTERS[dk].name + ' has a dot. ' + E.LETTERS[nd].name + ' has none.'); }
      else { await E.say('That is ' + E.LETTERS[c.userData.key].name + '. Listen.');
      await chant(need, true); }
      await E.say(E.LETTERS[ORDER[need]].name + ' goes here!');
      { const r = cars.find(x => x.userData.key === ORDER[need] && !x.userData.on);   /* show how (K-CLARITY 16): the hand moves the right car halfway, then he does it */
        if (r) { r.userData.busy = true; const a = r.position.clone(), b = a.clone().lerp(slotPos(need).add(new THREE.Vector3(0, .6, .3)), .5);
          await E.tween(700, q => { r.position.lerpVectors(a, b, q); const [x, y] = E.toScreen(r.position); E.hand.at(x, y); }); await E.wait(250); E.hand.hide();
          await E.tween(350, q => r.position.lerpVectors(b, a, q), E.ease.out); r.userData.busy = false; await E.say('Now you!'); } }
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
    await E.say('All aboard the Alef-Beis train!'); if (game.order) { const all = [...unit.known, ...unit.letters], before = all.slice(0, all.indexOf(ORDER[0]));   /* sing up to where this train starts */
      if (before.length > 6) await E.say('After ' + E.LETTERS[before[before.length - 1]].name + ' comes ' + E.LETTERS[ORDER[0]].name + '! This train starts there.');   /* a long Alef-Beis: no long wait */
      else { for (const k of before) { E.sfx.drum(); await E.say(E.LETTERS[k].name + ',', false); }
      await E.say('Then comes ' + E.LETTERS[ORDER[0]].name + '! This train starts there.'); } }
    await E.say('Listen to the order.'); await chant();
    await E.say('Watch me. ' + E.LETTERS[ORDER[0]].name + ' goes first.');
    const c0 = cars.find(c => c.userData.key === ORDER[0]);   /* the demo: Alef goes first */ let [x, y] = E.toScreen(c0.position); E.hand.at(x, y); await E.wait(350);
    const p0 = c0.position.clone(), p1 = slotPos(0).add(new THREE.Vector3(0, .6, .3)); await E.tween(1100, q => { c0.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(c0.position); E.hand.at(a, b); });
    E.hand.hide(); await place(c0, 0);
    if (game.clock) { if (E.world.sun) E.world.sun.visible = false; startClock(); await E.wait(200); const [sx, sy] = E.toScreen(sunObj.position); E.hand.at(sx - 20, sy + 30, true); await E.say('Can you finish before the sun goes down?'); E.hand.hide(); }   /* the race, said and shown */
    await E.say('Now you! Which car comes next?'); wrong = 0;
    const done = new Promise(r => resolveRound = r); enabled = true; busy = false; document.body.dataset.trainReady = 1;
    await done; enabled = false;
    E.joy(loco.position.clone().add(new THREE.Vector3(-2, 1.5, 1)), true); await chant(); if (!game.clock) await chug();   /* with the sun-clock, his finished train stays on screen */
    E.setProgress(2, 1);
  }
  async function roundTwo() {
    /* the train comes back with some cars on, and gaps to fill */
    gaps = [...Array(n).keys()].filter(i => i % 2 === 1); const gapHomes = gaps.map((_, i) => i * 2).sort(() => Math.random() - .5);   /* every other car is missing, however long the train */
    const lx = LX; loco.position.x = lx + 10;
    cars.forEach((c, i) => { if (gaps.includes(i)) { c.userData.on = false; c.userData.slot = null; c.userData.home = gapHomes[gaps.indexOf(i)]; c.scale.setScalar(P ? .75 : .7); c.position.copy(homes[c.userData.home]); c.visible = true; }
      else { c.userData.on = true; c.userData.slot = i; c.scale.setScalar(S); c.position.copy(slotPos(i)).add(new THREE.Vector3(10, 0, 0)); } });
    const on = cars.filter(c => c.userData.on), sx = on.map(c => c.position.x);
    await E.tween(1600, q => { loco.position.x = lx + 10 * (1 - q); on.forEach((c, i) => c.position.x = sx[i] - 10 * q); }, E.ease.out);
    await E.say('Some cars are missing! Fill the empty places.');
    { /* a new kind of round: show it first (K-CLARITY 15) */ const g0 = gaps[0], c0 = cars.find(c => c.userData.key === ORDER[g0]);
      await E.say('Watch me. ' + E.LETTERS[ORDER[g0]].name + ' goes after ' + E.LETTERS[ORDER[g0 - 1]].name + '.');
      let [x, y] = E.toScreen(c0.position); E.hand.at(x, y); await E.wait(350);
      const p0 = c0.position.clone(), p1 = slotPos(g0).add(new THREE.Vector3(0, .6, .3)); await E.tween(1100, q => { c0.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(c0.position); E.hand.at(a, b); });
      E.hand.hide(); resolveRound = null; await place(c0, g0); await E.say('Now you! Fill the other places.'); }
    const done = new Promise(r => resolveRound = r); enabled = true; busy = false;
    await done; enabled = false;
    E.joy(loco.position.clone().add(new THREE.Vector3(-2, 1.5, 1)), true); await chant();   /* the full train stays on screen for the end */
    E.setProgress(2, 2);
  }
  /* Unit 10's bonus (game.clock): a gentle clock. A sun moves slowly across the sky while he fills the train.
     Nothing is lost when it sets: he just hears "you finished it!" instead of "before the sun went down!". */
  let sunObj = null, sunT0 = 0, beatSun = true, sunTick = null;
  const SUN_MS = 70000;
  function startClock() { sunObj = new THREE.Group(); sunObj.add(E.mesh(new THREE.SphereGeometry(.45, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd84a }), 0, 0, 0, false)); const g = E.glowSprite('#ffe680', 2.2, .7); sunObj.add(g); E.scene.add(sunObj); sunT0 = performance.now();
    const f = () => { if (!sunObj) return; const q = Math.min(1, (performance.now() - sunT0) / (SUN_MS * (E.FAST ? .3 : 1))); sunObj.position.set((P ? 2.2 : 6) - q * (P ? 4.4 : 12), (P ? 4.4 : 5.0) + Math.sin(q * Math.PI) * (P ? .6 : 1.0) - q * q * 1.5, -3);   /* under the top bar on a phone */ if (q >= 1 && beatSun) { beatSun = false; } };
    E.onFrame(f); sunTick = f; }
  function stopClock() { if (sunTick) E.offFrame(sunTick); }
  /* Unit 8's twist (game.swap): the full train comes back, but Yaakov mixed up some cars. He listens to the order and taps a car
     in the wrong place; it swaps with its partner. Two of the mix-ups differ only by the dot (Shin and Sin, Tuf and Suf), so he must look closely.
     A tap on a car in the right place is answered kindly: it says its name, and the chant plays up to it. */
  let swapPairs = [], resolveSwap = null;
  E.onPointer('down', e => { if (!swapPairs.length || busy || !enabled) return; const c = E.pickFrom(e, cars); if (c) tapSwap(c); });
  async function tapSwap(c) {
    busy = true; const pr = swapPairs.find(p => p.includes(c.userData.slot));
    if (pr) { const [a, b] = pr.map(i => cars.find(x => x.userData.slot === i)); swapPairs = swapPairs.filter(p => p !== pr); E.sfx.whoosh();
      const pa = a.position.clone(), pb = b.position.clone(); await E.tween(650, q => { a.position.lerpVectors(pa, pb, q); b.position.lerpVectors(pb, pa, q); a.position.y += Math.sin(q * Math.PI) * 1.0; b.position.y += Math.sin(q * Math.PI) * .4; });
      const sa = a.userData.slot; a.userData.slot = b.userData.slot; b.userData.slot = sa; E.sfx.drum(); E.sparkle(a.position.clone().add(new THREE.Vector3(0, .8 * S, .4)), 14); E.sparkle(b.position.clone().add(new THREE.Vector3(0, .8 * S, .4)), 14);
      const hi = Math.max(a.userData.slot, b.userData.slot), k1 = ORDER[hi - 1], k2 = ORDER[hi]; await E.say(['Fixed! ' + E.LETTERS[k1].name + ', then ' + E.LETTERS[k2].name + '!']);
      if (E.sameShape(k1, k2)) await E.say(E.LETTERS[k1].top ? 'Shin has its dot on the right.' : 'Tuf has a dot. Suf has none.');   /* what to look at */
      wrongInRow = 0; busy = false; if (!swapPairs.length && resolveSwap) { const r = resolveSwap; resolveSwap = null; r(); } }
    else { E.sfx.boop(); wrong++; wrongInRow++; await E.shake(c, .12); await E.say(E.LETTERS[c.userData.key].name + ' is in the right place. Listen.'); await chant(c.userData.slot, true);
      if (wrongInRow >= 2 || wrong >= 3) help = true; busy = false; }
  }
  async function roundSwap() {
    /* every other pair of neighbours is swapped: the first pair is the demo */
    const dotPairs = [[3, 4], [5, 6]].filter(p => p[1] < n), prs = [[1, 2], dotPairs[Math.floor(Math.random() * dotPairs.length)]].filter(Boolean); gaps = null;   /* the demo pair, and ONE dot pair among cars in the right place: he must look to find it */
    const at = i => { const p = prs.find(q => q.includes(i)); return p ? (p[0] === i ? p[1] : p[0]) : i; };   /* the car standing in place i */
    const lx = LX; loco.position.x = lx + 10;
    /* on a phone the cars park in two short lines (right to left, top line first), big enough to see every dot */
    const park = i => { const r = i < 4 ? 0 : 1, j = r ? i - 4 : i, m = r ? n - 4 : Math.min(4, n); return new THREE.Vector3(((m - 1) / 2 - j) * .98, r ? 1.25 : 2.9, .8); };
    cars.forEach((c, i) => { c.userData.on = true; c.userData.slot = at(i); c.scale.setScalar(P ? .74 : S); c.visible = true; c.position.copy(P ? park(c.userData.slot) : slotPos(c.userData.slot)).add(new THREE.Vector3(10, 0, 0)); });
    if (P) { loco.visible = false; track.visible = false; E.camBase.set(0, 2.3, 10.5); E.camTarget.set(0, 2.0, 0); }
    const sx = cars.map(c => c.position.x);
    await E.tween(1600, q => { if (!P) loco.position.x = lx + 10 * (1 - q); cars.forEach((c, i) => c.position.x = sx[i] - 10 * q); }, E.ease.out);
    await E.say('Oh no! Yaakov mixed up some cars.');
    swapPairs = prs.slice(); enabled = false;
    const d = prs[0], first = cars.find(c => c.userData.slot === d[0]);
    await E.say(['Watch me. ' + E.LETTERS[ORDER[d[0]]].name + ' comes after ' + E.LETTERS[ORDER[d[0] - 1]].name + '.']);
    let [x, y] = E.toScreen(first.position.clone().add(new THREE.Vector3(0, .7 * S, 0))); E.hand.at(x, y, true); await E.wait(900); E.hand.hide();
    await tapSwap(first);
    await E.say('Now you! Look at the dots.'); await E.say('Tap a car in the wrong place.'); wrongInRow = 0;   /* mistakes in both rounds count */
    const done = new Promise(r => resolveSwap = r); enabled = true; busy = false; document.body.dataset.swapReady = 1;
    await done; enabled = false; delete document.body.dataset.swapReady;
    E.joy(loco.position.clone().add(new THREE.Vector3(-2, 1.5, 1)), true); await chant();
    E.setProgress(2, 2);
  }
  /* the waiting cars are mixed up (never in Alef-Beis order, no car in its own place), so the order comes from him */
  const derange = m => { let a; do { a = [...Array(m).keys()].sort(() => Math.random() - .5); } while (a.some((v, i) => v === i)); return a; };
  return async () => {
    const perm = derange(n); cars.forEach((c, i) => { c.userData.home = perm[i]; c.position.copy(homes[perm[i]]); });
    await roundOne(); if (game.clock) { stopClock(); await E.say(beatSun ? 'Before the sun went down! Champion!' : 'The sun went down, and you finished it! Great!'); }
    else if (game.swap) await roundSwap(); else await roundTwo();
    const stars = wrong <= 1 ? 3 : wrong <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Choo choo! You know the Alef-Beis order!' : null };
  };
}
