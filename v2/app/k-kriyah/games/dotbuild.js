/* Unit 8, a new kind of game: Dot Builder.
   Skill: knows that the dot makes the letter. Shin's dot sits on its right head, Sin's on its left head;
   Tuf has a dot inside, Suf has none. He drags a glowing golden dot to build the letter he hears ("Make it Sin!").
   Round 1: Shin and Sin (the dot on the right head or the left head). Round 2: Tuf and Suf (put the dot in, take it out).
   Round 3: all four, mixed. Show-then-try for each new move. A wrong place is never just "wrong": the dot stays there a moment,
   he sees and hears the letter he made ("Look! Dot on the left: that is Sin."), then the rule, and he tries again.
   If he struggles, the right place glows. Every line is 12 words or fewer. */
export default function setup(E, { struggled, unit }) {
  const { THREE, S } = E, NM = k => E.LETTERS[k].name;
  const kid = E.unitBoy(unit.n); E.scene.add(kid);
  /* a soft velvet cushion on a little gold stand, where the letter rests */
  const stand = new THREE.Group(); E.scene.add(stand);
  const cush = E.mesh(new THREE.CylinderGeometry(1.5, 1.6, .22, 40), E.M(0x2b47a8, { roughness: .7, sheen: 1, sheenColor: new THREE.Color(0x9ab4ff) }), 0, .11, 0); cush.scale.z = .45; stand.add(cush);
  const rim = E.mesh(new THREE.TorusGeometry(1.55, .05, 10, 48), E.M(0xf2c14e, { metalness: .55, roughness: .3 }), 0, .22, 0); rim.rotation.x = Math.PI / 2; rim.scale.y = .45; stand.add(rim);   /* a low, flat velvet cushion */
  /* the dish where the dot waits */
  const dish = new THREE.Group(); E.scene.add(dish); const gold = E.M(0xf2c14e, { metalness: .55, roughness: .3, clearcoat: .8 });
  const bowl = E.mesh(new THREE.SphereGeometry(.5, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), gold, 0, .78, 0); bowl.material.side = THREE.DoubleSide; dish.add(bowl);
  dish.add(E.mesh(new THREE.CircleGeometry(.48, 28), E.M(0x2b47a8, { roughness: .8 }), 0, .62, 0)).rotation.x = -Math.PI / 2;   /* a velvet lining inside */
  dish.add(E.mesh(new THREE.CylinderGeometry(.08, .1, .3, 12), gold, 0, .15, 0)); dish.add(E.mesh(new THREE.CylinderGeometry(.3, .34, .06, 24), gold, 0, .03, 0));
  /* the golden dot (a big invisible ball around it makes it easy to grab) */
  const dot = new THREE.Group(); E.scene.add(dot);
  dot.add(E.mesh(new THREE.SphereGeometry(.2, 32, 24), E.goldDot(), 0, 0, 0, false));
  dot.add(new THREE.Mesh(new THREE.SphereGeometry(.55, 12, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })));
  const dotGlow = E.glowSprite('#ffe680', 1.1, .55); dot.add(dotGlow);
  /* soft rings where a dot can go; the right one glows when he needs help */
  const ringM = () => new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe9a0, emissiveIntensity: .6, transparent: true, opacity: .55 });
  const spotRing = () => { const r = E.mesh(new THREE.TorusGeometry(.3, .035, 10, 32), ringM(), 0, 0, 0, false); r.visible = false; E.scene.add(r); return r; };
  const rings = { right: spotRing(), left: spotRing(), in: spotRing() };
  const helpGlow = E.glowSprite('#fff7b0', 1.6, 0); E.scene.add(helpGlow);
  let P = false, H = 2.6, letterAt = new THREE.Vector3(), dishAt = new THREE.Vector3(), shape = null, L = null, want = null, at = 'dish', busy = true, enabled = false, dragging = false, mistakes = 0, wrongInRow = 0, missed = false, help = struggled, resolveTask = null, done = 0, total = 12;
  E.onLayout(p => { P = p; H = p ? 2.1 : 2.6;
    if (p) { E.camBase.set(0, 2.6, 10.5); E.camTarget.set(0, 2.0, 0); letterAt.set(0, 2.75, .4); stand.position.set(0, 0, .2); stand.scale.setScalar(.8); dish.position.set(1.15, 0, 2.2); dish.scale.setScalar(.9); kid.visible = false; }
    else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.6, 0); letterAt.set(.3, 2.05, .4); stand.position.set(.3, 0, .2); stand.scale.setScalar(1); dish.position.set(3.7, 0, 1.4); dish.scale.setScalar(1.1); kid.visible = true; kid.position.set(-4.4, 0, 1.2); }
    dishAt.copy(dish.position).add(new THREE.Vector3(0, .9 * dish.scale.x, 0));
    if (shape) { const k = shape; shape = null; setShape(k, true); }
    if (!dragging) dot.position.copy(spotPos(at));
  });
  /* where each place is, in the world */
  const SHAPE_OF = { shin: 'ש', sin: 'ש', tav: 'ת', sav: 'ת' }, KEY_OF = { 'ש': 'shin', 'ת': 'tav' };
  function spotPos(name) {
    if (name === 'dish' || !L) return dishAt.clone();
    const k = KEY_OF[shape], f = name === 'right' ? E.TOP_DOT.right : name === 'left' ? E.TOP_DOT.left : [34, 24];
    return E.fontToLocal(k, H, f[0] * 10, f[1] * 10).add(L.position).setZ(L.position.z + .42 * H / 2.6 + .05);
  }
  const spotsFor = () => shape === 'ש' ? ['right', 'left'] : ['in', 'dish'];
  function setShape(sh, quick) {
    if (shape === sh && L) return; shape = sh;
    if (L) E.scene.remove(L); L = E.letter(KEY_OF[sh], H); if (L.userData.dot) L.userData.dot.visible = false; L.position.copy(letterAt); E.scene.add(L);
    Object.entries(rings).forEach(([n, r]) => { r.visible = spotsFor().includes(n); if (r.visible) r.position.copy(spotPos(n)); });
    if (!quick) E.popIn(L);
  }
  /* what the dot makes, where it is */
  const made = () => shape === 'ש' ? (at === 'right' ? 'shin' : at === 'left' ? 'sin' : null) : (at === 'in' ? 'tav' : 'sav');
  const goodSpot = k => ({ shin: 'right', sin: 'left', tav: 'in', sav: 'dish' })[k];
  E.onFrame(t => {
    if (!dragging && !busy) { const b = spotPos(at); dot.position.y = b.y + (at === 'dish' ? Math.sin(t * 3) * .06 : 0); }
    dotGlow.material.opacity = .45 + Math.sin(t * 4) * .15;
    Object.values(rings).forEach(r => r.visible && (r.scale.setScalar(1 + Math.sin(t * 3) * .06)));
    if (L) L.rotation.y = Math.sin(t * .9) * .12;
    const g = want && enabled && help ? goodSpot(want) : null; if (g && g !== at) { helpGlow.position.copy(spotPos(g)).add(new THREE.Vector3(0, 0, -.1)); helpGlow.material.opacity = .6 + Math.sin(t * 5) * .3; } else helpGlow.material.opacity = 0;
  });
  window.__info = () => { const spots = {}; [...spotsFor()].forEach(n => spots[n] = E.toScreen(spotPos(n)));
    const g = want && goodSpot(want), b0 = want && (shape === 'ש' ? (g === 'right' ? 'left' : 'right') : (want === 'tav' ? 'dish' : 'in')), bad = b0 && b0 !== at ? b0 : null;   /* a wrong place he can really drop on */
    const r = okBtn.style.display !== 'none' ? okBtn.getBoundingClientRect() : null;
    return { ready: enabled && !busy, want, dot: E.toScreen(dot.position), spots, good: g, bad, at, ok: r ? [r.x + r.width / 2, r.y + r.height / 2] : null }; };
  /* dragging the dot */
  const grab = new THREE.Vector3();
  E.onPointer('down', e => { if (!enabled || busy) return; if (E.pickFrom(e, [dot])) { dragging = true; const p = E.planePoint(e, dot.position.z); if (p) grab.copy(dot.position).sub(p); dot.scale.setScalar(1.25); E.sfx.pop && E.sfx.pop(); } });
  E.onPointer('move', e => { if (!dragging) return; const p = E.planePoint(e, dot.position.z); if (p) dot.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!dragging) return; dragging = false; dot.scale.setScalar(1); dropAt(nearest()); });
  function nearest() { const [dx, dy] = E.toScreen(dot.position); let best = null, bd = Math.max(70, Math.min(innerWidth, innerHeight) * .13);
    spotsFor().forEach(n => { const [x, y] = E.toScreen(spotPos(n)), d = Math.hypot(x - dx, y - dy); if (d < bd) { bd = d; best = n; } });
    if (!best && shape === 'ת') { const [lx, ly] = E.toScreen(L.position); if (Math.hypot(lx - dx, ly - dy) > Math.min(innerWidth, innerHeight) * .2) best = 'dish'; }   /* taken right off the letter: back to the dish */
    return best; }
  async function moveDot(to, ms = 380) { const p0 = dot.position.clone(), p1 = spotPos(to); await E.tween(ms, q => { dot.position.lerpVectors(p0, p1, q); dot.position.y += Math.sin(q * Math.PI) * .35; }, E.ease.out); at = to; }
  const RULE = { shin: 'Shin’s dot goes on the right head.', sin: 'Sin’s dot goes on the left head.', tav: 'Tuf’s dot goes inside.', sav: 'Suf has no dot. Take the dot out!' };
  const SAYS = k => ['Yes! ' + NM(k) + '!', ...E.nameLine(k).slice(1)];
  async function dropAt(spot) {
    if (!spot || spot === at) { busy = true; await moveDot(at, 300); busy = false; if (!spot && shape === 'ש') await E.say('Put the dot on top of a head!'); return; }
    busy = true; enabled = false; await moveDot(spot, 220);
    await judge();
  }
  /* Tuf and Suf: the dot may already be in or out; if the letter is already right, he taps the green check */
  const okBtn = document.createElement('button'); okBtn.className = 'ui btn green'; okBtn.id = 'dotok'; okBtn.setAttribute('aria-label', 'It is ready');
  okBtn.style.cssText = 'left:50%;bottom:34px;transform:translateX(-50%);width:110px;height:110px;display:none'; okBtn.innerHTML = E.ICON.yes.replace('<svg', '<svg style="width:60px;height:60px"'); document.body.appendChild(okBtn);
  okBtn.onclick = async () => { if (!enabled || busy) return; E.sfx.pop && E.sfx.pop(); busy = true; enabled = false; await judge(); };
  async function judge() {
    const k = made();
    if (k === want) {
      wrongInRow = 0; L.setKey && L.setKey(k); if (L.userData.dot) L.userData.dot.visible = false;
      E.joy(spotPos(at).add(new THREE.Vector3(0, .2, .4))); E.hop(L, .25, 350); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 900 * E.F);
      await E.say(SAYS(k)); busy = false; const r = resolveTask; resolveTask = null; r && r();
    } else {
      E.sfx.boop(); if (!missed) mistakes++; missed = true; wrongInRow++; kid.mood('think');
      if (k) { E.hop(L, .15, 300); await E.say(shape === 'ש' ? 'Look! Dot on the ' + at + ': that is ' + NM(k) + '.' : at === 'in' ? 'Look! A dot inside: that is Tuf.' : 'Look! No dot: that is Suf.'); }
      await E.say(RULE[want]);
      if (wrongInRow >= 2 || mistakes >= 3) help = true;
      if (shape === 'ש') await moveDot('dish', 450); kid.mood('calm');
      busy = false; enabled = true; await E.say('Try again! Make it ' + NM(want) + '.');
    }
  }
  async function task(k) {
    const sh = SHAPE_OF[k]; if (shape !== sh) { setShape(sh); at = 'dish'; dot.position.copy(spotPos(at)); await E.wait(350); }
    if (sh === 'ש' && at !== 'dish') { busy = true; await moveDot('dish'); }
    if (sh === 'ת') { const start = Math.random() < .5 ? 'in' : 'dish'; if (start !== at) { busy = true; await moveDot(start); } if (at === 'in') { L.setKey && L.setKey('tav'); } if (L.userData.dot) L.userData.dot.visible = false; }   /* in or out at random: sometimes it is already right */
    okBtn.style.display = sh === 'ת' ? 'grid' : 'none';
    want = k; missed = false;
    const p = new Promise(r => resolveTask = r);
    await E.say(k === 'sav' ? 'Make it Suf!' : ['Make it ' + NM(k) + '!']); busy = false; enabled = true; document.body.dataset.dotReady = ++done;
    await p; enabled = false; want = null; okBtn.style.display = 'none'; E.setProgress(total, done);
  }
  async function demo(k, line) {
    want = k; busy = true; await E.say('Watch me. Make it ' + NM(k) + '!');
    const to = goodSpot(k); let [x, y] = E.toScreen(dot.position); E.hand.at(x, y); await E.wait(400);
    const p0 = dot.position.clone(), p1 = spotPos(to); await E.tween(1200, q => { dot.position.lerpVectors(p0, p1, q); dot.position.y += Math.sin(q * Math.PI) * .5; const [a, b] = E.toScreen(dot.position); E.hand.at(a, b); });
    E.hand.hide(); at = to; L.setKey && L.setKey(k); if (L.userData.dot) L.userData.dot.visible = false; E.sparkle(spotPos(to).add(new THREE.Vector3(0, .1, .4)), 16, .8); E.hop(L, .2, 300);
    await E.say(line); await E.say(E.nameLine(k)); want = null;
  }
  const mix = (a, first) => { let d; do { d = a.slice().sort(() => Math.random() - .5); } while (first && d[0] !== first); return d; };
  return async () => {
    E.setProgress(total, 0);
    setShape('ש'); at = 'dish'; dot.position.copy(spotPos('dish'));
    await E.say('The dot makes the letter! Let’s build letters with a dot.');
    await demo('shin', 'The dot is on the right head. This is Shin.');
    await moveDot('dish', 450); await E.say('And Sin’s dot goes on the left head.'); await E.say('Now you! Listen, and put the dot in its place.'); mistakes = 0;
    for (const k of mix(['sin', 'shin', 'sin', 'shin'], 'sin')) await task(k);
    await E.say('Great! Now Tuf and Suf.');
    setShape('ת'); at = 'dish'; dot.position.copy(spotPos('dish')); await E.wait(300);
    await demo('tav', 'The dot goes inside. This is Tuf.');
    await E.say('Suf has no dot at all.'); await moveDot('dish', 400);
    okBtn.style.display = 'grid'; { const r = okBtn.getBoundingClientRect(); E.hand.at(r.x + r.width / 2, r.y + 20, true); }
    await E.say('Already right? Tap the green check!'); E.hand.hide(); okBtn.style.display = 'none';
    for (const k of ['sav', 'tav', 'sav', 'tav']) await task(k);
    await E.say('Now all four, mixed up!');
    for (const k of mix(['sin', 'sav', 'shin', 'tav'])) await task(k);
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'You are a dot builder! The dot makes the letter!' : null };
  };
}
