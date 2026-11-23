/* Look-Alike Detective for any pair (Unit 3: Vov and Zayin, then Hei and Ches).
   Skill: tells look-alike letters apart by the one place they differ. Two crates, each labelled with its letter;
   on each label the difference glows (Zayin's crown, Hei's gap). He drags each letter card to its crate (or taps the crate).
   Show-then-try demo for each pair; a wrong answer circles the difference on the card and says what to look for;
   if he struggles, the right crate glows. */
const PAIRS = { 3: [['vov', 'zayin'], ['hei', 'ches']] };
/* the place to look on each letter (font units), and what to say about it */
const FEATURE = { vov: [235, 500], zayin: [250, 500], hei: [100, 370], ches: [150, 420] };
const LOOK = { vov: 'No crown. That is Vov.', zayin: 'A crown on top! That is Zayin.', hei: 'The leg doesn’t touch the roof. That is Hei.', ches: 'The leg touches the roof. That is Ches.' };
const CLUE = { vov: 'Vov has no crown.', zayin: 'Zayin has a crown.', hei: 'Hei’s leg doesn’t touch the roof.', ches: 'Ches’s leg touches the roof.' };
export default function setup(E, { struggled, unit }) {
  const { THREE, S } = E;
  const pairs = PAIRS[unit.n] || PAIRS[3];
  const kid = E.ari(); E.scene.add(kid);
  const wood = E.M(0xc68a52, { roughness: .6 }), wood2 = E.M(0xa86f3c, { roughness: .6 });
  function crate() { const c = new THREE.Group(); c.add(E.mesh(E.rbox(2.0, 1.2, 1.4, .08), wood, 0, .6, 0)); for (let i = 0; i < 3; i++) c.add(E.mesh(new THREE.BoxGeometry(2.05, .1, .05), wood2, 0, .25 + i * .35, .72));
    c.add(E.mesh(E.rbox(1.25, 1.3, .1, .08), E.M(0xfffaf0, { roughness: .4 }), 0, 1.85, .45)); E.scene.add(c); return c; }
  const crates = [crate(), crate()];
  const rings = crates.map(c => { const r = E.noticeRing(.13); c.add(r); r.visible = true; return r; });
  const glows = crates.map(c => { const g = E.glowSprite('#fff7b0', 3.6, 0); g.position.set(0, 1.2, -.6); c.add(g); return g; });
  let card = E.letter('vov', 1.9); card.visible = false; E.scene.add(card);
  const cardRing = E.noticeRing(.26); card.add(cardRing);
  function makeCard(k) { const old = card; card = E.letter(k, 1.9); card.visible = false; card.add(cardRing); E.scene.add(card); E.scene.remove(old); }   /* each letter has its own shape */
  let pair = pairs[0], labels = [], P = false, CS = 1, cardHome = new THREE.Vector3(), busy = true, dragging = false, enabled = false, help = struggled, mistakes = 0, wrongInRow = 0, missed = false, deck = [], idx = 0, onDone = null, kRound = 0;
  E.onLayout(p => { P = p; CS = p ? .85 : 1;
    if (p) { E.camBase.set(0, 3.2, 11.8); E.camTarget.set(0, 2.4, 0); crates[0].position.set(1.25, 0, 0); crates[1].position.set(-1.25, 0, 0); crates.forEach(c => c.scale.setScalar(.6)); cardHome.set(0, 4.5, 1.5); kid.visible = false; }
    else { E.camBase.set(0, 2.7, 9.8); E.camTarget.set(0, 1.5, 0); crates[0].position.set(2.6, 0, 0); crates[1].position.set(-2.6, 0, 0); crates.forEach(c => c.scale.setScalar(1)); cardHome.set(0, 2.1, 1.5); kid.visible = true; kid.position.set(-4.7, 0, 1.4); }
    if (card.visible && !dragging && !busy) card.position.copy(cardHome);
  });
  function setPair(pr) {   /* right crate: the first letter of the pair (as Hebrew reads), left crate: the second */
    pair = pr; labels.forEach(l => l.parent && l.parent.remove(l)); labels = pr.map((k, i) => { const l = E.letter(k, 1.15); l.position.set(0, 1.85, .62); crates[i].add(l); crates[i].userData.key = k; return l; });
    pr.forEach((k, i) => { const f = FEATURE[k], p = E.fontToLocal(k, 1.15, f[0], f[1]); rings[i].position.set(p.x, 1.85 + p.y, .9); });
  }
  E.onFrame(t => {
    if (card.visible && !dragging && !busy) { card.position.y = cardHome.y + Math.sin(t * 2.2) * .08; card.rotation.y = Math.sin(t * 1.1) * .25; }
    rings.forEach((r, i) => r.scale.setScalar(1 + Math.sin(t * 4 + i) * .15));   /* the difference glows on both labels */
    const want = card.userData.key; crates.forEach((c, i) => glows[i].material.opacity = help && card.visible && c.userData.key === want ? .55 + Math.sin(t * 5) * .3 : 0);
  });
  const centre = c => c.position.clone().add(new THREE.Vector3(0, .8 * c.scale.x, .5));
  window.__info = () => ({ ready: enabled && !busy && card.visible, k: card.userData.key, card: E.toScreen(card.position), crates: Object.fromEntries(crates.map(c => [c.userData.key, E.toScreen(centre(c))])) });
  const nearest = () => { const [cx, cy] = E.toScreen(card.position); let best = null, bd = Math.min(innerWidth, innerHeight) * .25; crates.forEach(c => { const [x, y] = E.toScreen(centre(c)), d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = c; } }); return best; };
  const grab = new THREE.Vector3();
  E.onPointer('down', e => { if (!enabled || busy || !card.visible) return; if (E.pickFrom(e, [card])) { dragging = true; const p = E.planePoint(e, card.position.z); if (p) grab.copy(card.position).sub(p); return; } const c = E.pickFrom(e, crates); if (c) drop(c); });
  E.onPointer('move', e => { if (!dragging) return; const p = E.planePoint(e, card.position.z); if (p) card.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!dragging) return; dragging = false; drop(nearest()); });
  async function setCard(k) { makeCard(k); card.position.copy(cardHome); card.rotation.set(0, 0, 0); cardRing.visible = false; missed = false; await E.popIn(card, CS); }
  async function back() { const p0 = card.position.clone(); busy = true; await E.tween(400, q => card.position.lerpVectors(p0, cardHome, q), E.ease.out); busy = false; }
  async function drop(c) {
    if (!c) { await back(); return; }
    const k = card.userData.key;
    if (c.userData.key === k) {
      busy = true; enabled = false; wrongInRow = 0; const p0 = card.position.clone(), to = centre(c);
      await E.tween(420, q => { card.position.lerpVectors(p0, to, q); card.scale.setScalar(CS * (1 - q * .85)); });
      card.visible = false; E.joy(to); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 900 * E.F); E.hop(c, .15, 300);
      idx++; E.setProgress(deck.length, idx);
      await E.say(['Yes! ' + E.LETTERS[k].name + ' says', S(E.LETTERS[k].snd)]);
      if (idx < deck.length) { busy = true; await setCard(deck[idx]); busy = false; enabled = true; } else onDone();
    } else {
      E.sfx.boop(); if (!missed) mistakes++; missed = true; wrongInRow++; kid.mood('think'); await back(); busy = true; await E.shake(card, .15);
      const f = FEATURE[k], p = E.fontToLocal(k, 1.9, f[0], f[1]); cardRing.position.set(p.x, p.y, .7); cardRing.visible = true;
      await E.say('Look! ' + LOOK[k]); cardRing.visible = false; busy = false; kid.mood('calm');
      if (wrongInRow >= 2 || mistakes >= 3) help = true;
      await E.say('Try again!');
    }
  }
  async function playPair(pr, first) {
    setPair(pr); E.sfx.whoosh(); crates.forEach(c => E.hop(c, .2, 300));
    await E.say(CLUE[pr[1]] + ' ' + CLUE[pr[0]]);
    let d; do { d = Array.from({ length: 8 }, (_, i) => pr[i % 2]).sort(() => Math.random() - .5); } while (new RegExp(`(${pr[0]},){2}${pr[0]}|(${pr[1]},){2}${pr[1]}`).test(d.join(',')));
    deck = [pr[1], ...d]; idx = 0; E.setProgress(deck.length, 0);
    await setCard(deck[0]); busy = false;
    await E.say('Watch me. ' + (pr[1] === 'zayin' ? 'A crown on top!' : 'The leg touches the roof!'));
    const f = FEATURE[pr[1]], p = E.fontToLocal(pr[1], 1.9, f[0], f[1]); cardRing.position.set(p.x, p.y, .7); cardRing.visible = true; await E.wait(600); cardRing.visible = false;
    busy = true; let [x, y] = E.toScreen(card.position); E.hand.at(x, y); await E.wait(350);
    const p0 = card.position.clone(), p1 = centre(crates[1]).add(new THREE.Vector3(.3, .6, .6)); await E.tween(1200, q => { card.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(card.position); E.hand.at(a, b); });
    E.hand.hide(); busy = false; enabled = true;
    const done = new Promise(r => onDone = r);
    const m0 = mistakes; await drop(crates[1]); mistakes = m0;
    await E.say(first ? 'Now you! Put each letter in its box.' : 'Now you!'); document.body.dataset.dragReady = ++kRound;
    await done;
  }
  return async () => {
    await E.say('Look-alike letters! Each one goes in its own box.');
    await playPair(pairs[0], true);
    await E.say('Great! Now two new look-alikes.');
    await playPair(pairs[1], false);
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Great detective work! Crown or no crown, leg or gap!' : null };
  };
}
