/* Unit 9's Look-Alike Detective, a new twist: Spot the Difference.
   Skill: tells look-alike letters apart by finding, himself, the one place where they differ.
   Two big letters stand side by side: Samech and Mem Sofis (the demo), Vov and Nun Sofis,
   Reish and Chaf Sofis, then Daled and Reish, and Beis and Kaf (a review). "Find what is different! Tap it." He taps the place on either letter.
   Found: the place glows on both letters, an arrow points at it, and he hears what is different on each.
   A tap somewhere else is answered kindly ("Look at the bottom!"), and after two misses the place glows softly.
   Then one card of the two hops in, and he drags it to the letter it matches: so he uses the difference straight away. */
const ROUNDS = [
  { a: 'samech', b: 'memsofis', where: 'bottom', la: 'Samech is round at the bottom.', lb: 'Mem Sofis is square at the bottom.' },
  { a: 'vov', b: 'nunsofis', where: 'bottom', la: 'Vov stops at the line.', lb: 'Nun Sofis has a long leg.' },
  { a: 'reish', b: 'chafsofis', where: 'bottom', la: 'Reish stops at the line.', lb: 'Chaf Sofis has a long leg.' },
  { a: 'daled', b: 'reish', where: 'top', la: 'Daled has a corner.', lb: 'Reish is round on top.' },
  { a: 'beis', b: 'kaf', where: 'bottom', la: 'Beis has a tail at the bottom.', lb: 'Kaf is round at the bottom.' },
];   /* the first is the demo; the last two bring back earlier look-alikes */
export default function setup(E, { struggled, unit }) {
  const { THREE, S } = E, NM = k => E.LETTERS[k].name;
  const kid = E.unitBoy(unit.n); E.scene.add(kid);
  const H = 2.3, arrows = [E.arrow3d(.45), E.arrow3d(.45)], marks = [E.glowSprite('#ffe680', 1.4, 0), E.glowSprite('#ffe680', 1.4, 0)], hint = [E.glowSprite('#fff7b0', 1.5, 0), E.glowSprite('#fff7b0', 1.5, 0)];
  const pads = [0, 1].map(() => { const p = new THREE.Group(); p.add(E.mesh(new THREE.CylinderGeometry(1.25, 1.35, .25, 40), E.M(0xfff6e4, { roughness: .4, clearcoat: .6 }), 0, .12, 0)); { const rg = E.mesh(new THREE.TorusGeometry(1.3, .05, 10, 48), E.M(0xf2c14e, { metalness: .5, roughness: .3 }), 0, .26, 0); rg.rotation.x = Math.PI / 2; p.add(rg); } E.scene.add(p); return p; });
  let P = false, A = null, B = null, R = null, busy = true, active = false, misses = 0, mistakes = 0, help = struggled, resolveFind = null, card = null, cardHome = new THREE.Vector3(), drag = null, grab = new THREE.Vector3(), resolveCard = null, cardMissed = false;
  const X = () => P ? 1.15 : 2.0, Y = () => P ? 2.9 : 1.95, S2 = () => P ? .62 : 1;
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.6, 11); E.camTarget.set(0, 2.4, 0); kid.visible = false; cardHome.set(0, .95, 2.2); } else { E.camBase.set(0, 2.5, 9.5); E.camTarget.set(0, 1.6, 0); kid.visible = true; kid.position.set(-4.9, 0, 1.2); cardHome.set(0, .7, 2.6); }
    pads.forEach((pd, i) => { pd.position.set(i ? -X() : X(), Y() - H * S2() / 2 - .35, 0); pd.scale.setScalar(S2()); });
    if (A) { A.position.set(X(), Y(), .3); A.scale.setScalar(S2()); } if (B) { B.position.set(-X(), Y(), .3); B.scale.setScalar(S2()); }
    if (card && !drag) card.position.copy(cardHome);
  });
  E.onFrame(t => { [A, B].forEach((l, i) => { if (l) l.rotation.y = Math.sin(t * .9 + i) * .12; }); marks.forEach(m => m.visible && (m.material.opacity = m.userData.on ? .65 + Math.sin(t * 5) * .25 : 0)); hint.forEach(h => h.material.opacity = help && active ? .35 + Math.sin(t * 4) * .2 : 0);
    if (card && card !== drag && !card.userData.busy) card.position.y = cardHome.y + Math.sin(t * 2) * .06; });
  /* where the difference is, on each letter, in its own space */
  const spot = (k, other, l) => { const f = E.featFor(k, other) || E.FEATURES[k]; return l.localToWorld(E.fontToLocal(k, H, f[0], f[1]).add(new THREE.Vector3(0, 0, .4))); };
  window.__info = () => ({ ready: active && !busy, spots: R && A ? [E.toScreen(spot(R.a, R.b, A)), E.toScreen(spot(R.b, R.a, B))] : [], away: A ? E.toScreen(A.localToWorld(new THREE.Vector3(0, R.where === 'bottom' ? H * .42 : -H * .42, .4))) : null,
    card: card && cardReady ? { k: card.userData.key, xy: E.toScreen(card.position), to: Object.fromEntries([[R.a, E.toScreen(E.worldPos(A))], [R.b, E.toScreen(E.worldPos(B))]]) } : null });
  let cardReady = false;
  E.onPointer('down', e => {
    if (cardReady && card && !busy) { if (E.pickFrom(e, [card])) { drag = card; const p = E.planePoint(e, card.position.z); if (p) grab.copy(card.position).sub(p); } return; }
    if (!active || busy) return;
    const near = (w, r) => { const [x, y] = E.toScreen(w); return Math.hypot(x - e.clientX, y - e.clientY) < r; }, r = Math.max(60, Math.min(innerWidth, innerHeight) * .14);
    if (near(spot(R.a, R.b, A), r) || near(spot(R.b, R.a, B), r)) { const f = resolveFind; resolveFind = null; f && f(true); }
    else if (E.pickFrom(e, [A, B])) { const f = resolveFind; resolveFind = null; f && f(false); }
  });
  E.onPointer('move', e => { if (!drag) return; const p = E.planePoint(e, drag.position.z); if (p) drag.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!drag) return; const c = drag; drag = null; const [cx, cy] = E.toScreen(c.position); let best = null, bd = Math.min(innerWidth, innerHeight) * .2;
    [A, B].forEach(l => { const [x, y] = E.toScreen(E.worldPos(l)), d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = l; } }); dropCard(best); });
  async function showDiff() { [[R.a, R.b, A, 0], [R.b, R.a, B, 1]].forEach(([k, o, l, i]) => { E.pointAt(arrows[i], l, k, H, E.featFor(k, o)); marks[i].position.copy(spot(k, o, l)).setZ(.2); marks[i].userData.on = true; }); }
  const hideDiff = () => { arrows.forEach(a => a.visible = false); marks.forEach(m => m.userData.on = false); };
  async function find() {
    misses = 0;
    for (;;) {
      busy = false; active = true; document.body.dataset.spotReady = (document.body.dataset.spotReady | 0) + 1;
      hint[0].position.copy(spot(R.a, R.b, A)).setZ(.1); hint[1].position.copy(spot(R.b, R.a, B)).setZ(.1);
      const ok = await new Promise(r => resolveFind = r); active = false; busy = true;
      if (ok) { E.sfx.chime(); kid.mood('cheer'); E.sparkle(spot(R.a, R.b, A), 14, .7); E.sparkle(spot(R.b, R.a, B), 14, .7); await showDiff(); await E.say('You found it!'); await E.say(R.la); await E.say(R.lb); hideDiff(); kid.mood('calm'); return; }
      E.sfx.boop(); misses++; if (misses === 1) mistakes++; kid.mood('think'); await E.say(R.where === 'bottom' ? 'Look at the bottom of the letters!' : 'Look at the top of the letters!'); kid.mood('calm');
      if (misses >= 2) help = true;
    }
  }
  async function dropCard(l) {
    const k = card.userData.key; busy = true;
    if (l && l.userData.key === k) { const p0 = card.position.clone(), to = E.worldPos(l).add(new THREE.Vector3(0, 0, .6)); await E.tween(350, q => card.position.lerpVectors(p0, to, q)); E.scene.remove(card); card = null; cardReady = false;
      E.joy(to); E.hop(l, .3); await E.say(['Yes! ' + NM(k) + '!']); const r = resolveCard; resolveCard = null; r && r(); }
    else { const p0 = card.position.clone(); card.userData.busy = true; await E.tween(350, q => card.position.lerpVectors(p0, cardHome, q), E.ease.out); card.userData.busy = false;
      if (l) { E.sfx.boop(); if (!cardMissed) mistakes++; cardMissed = true; await E.say('Look! ' + (k === R.a ? R.la : R.lb)); } busy = false; }
  }
  async function playRound(r, demo) {
    R = r; [A, B].forEach(l => l && E.scene.remove(l)); A = E.letter(r.a, H); B = E.letter(r.b, H); A.position.set(X(), Y(), .3); B.position.set(-X(), Y(), .3); A.scale.setScalar(S2()); B.scale.setScalar(S2()); E.scene.add(A, B); await Promise.all([E.popIn(A, S2()), E.popIn(B, S2())]);
    await E.say(['This is ' + NM(r.a) + '. This is ' + NM(r.b) + '.']);
    if (demo) { await E.say('Watch me. I look carefully at the bottom.'); const [x, y] = E.toScreen(spot(r.b, r.a, B)); E.hand.at(x, y, true); await E.wait(900); E.hand.hide(); E.sfx.chime(); await showDiff(); await E.say(r.la); await E.say(r.lb); hideDiff();
      card = E.letter(r.b, 1.3); card.position.copy(cardHome); card.scale.setScalar(P ? .75 : 1); E.scene.add(card); await E.popIn(card, P ? .75 : 1);   /* show, then try: the hand puts a card with its twin */
      await E.say(['Watch me. I put ' + NM(r.b) + ' with its twin.']); let [hx, hy] = E.toScreen(card.position); E.hand.at(hx, hy); await E.wait(400);
      const c0 = card.position.clone(), c1 = E.worldPos(B).add(new THREE.Vector3(0, 0, .6)); await E.tween(1100, q => { card.position.lerpVectors(c0, c1, q); const [a, b] = E.toScreen(card.position); E.hand.at(a, b); }); E.hand.hide();
      E.scene.remove(card); card = null; E.joy(c1); E.hop(B, .3); return; }
    await E.say('Find what is different! Tap it.'); await find();
    /* use it: one card comes, he puts it with its twin */
    const k = Math.random() < .5 ? r.a : r.b; card = E.letter(k, 1.3); card.position.copy(cardHome); card.scale.setScalar(P ? .75 : 1); E.scene.add(card); await E.popIn(card, P ? .75 : 1); cardMissed = false;
    await E.say(['Put ' + NM(k) + ' with its twin!']); const p = new Promise(res => resolveCard = res); cardReady = true; busy = false; document.body.dataset.cardReady = (document.body.dataset.cardReady | 0) + 1; await p;
  }
  return async () => {
    E.setProgress(ROUNDS.length - 1, 0);
    await E.say('Look-alike letters! Let’s find what is different.');
    await playRound(ROUNDS[0], true);
    await E.say('Now you! Find the difference.'); mistakes = 0;
    for (let i = 1; i < ROUNDS.length; i++) { await playRound(ROUNDS[i]); E.setProgress(ROUNDS.length - 1, i); }
    [A, B].forEach(l => l && E.popOut(l));
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Great detective! You found every difference!' : null };
  };
}
