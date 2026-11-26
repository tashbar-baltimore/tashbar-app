/* Look-Alike Detective for any pair (Unit 3: Vov and Zayin, then Hei and Ches).
   Skill: tells look-alike letters apart by the one place they differ. Two crates, each labelled with its letter;
   on each label an orange arrow points at the difference (Zayin's crown, Hei's gap). He drags each letter card to its crate (or taps the crate).
   Show-then-try demo for each pair; a wrong answer points an arrow at the difference on the card and says what to look for;
   if he struggles, the right crate glows. */
const PAIRS = { 3: [['vov', 'zayin'], ['hei', 'ches']] };   /* a game can bring its own pairs (Unit 4: Beis/Kaf, then Kaf/Chaf) */
/* the place to look on each letter (font units), and what to say about it */
const LOOK = { vov: 'No crown. That is Vov.', zayin: 'A crown on top! That is Zayin.', hei: 'The leg doesn’t touch the roof. That is Hei.', ches: 'The leg touches the roof. That is Ches.',
  beis: 'A tail at the bottom! That is Beis.', gimmel: 'A foot at the bottom! That is Gimmel.', pei: 'A dot! That is Pei.', peiTongue: 'A little tongue inside! That is Pei.', kafNoTongue: 'No little tongue. That is Kaf.', fei: 'No dot. That is Fei.', nun: 'Flat at the bottom. That is Nun.', tes: 'Closed at the bottom. That is Tes.', mem: 'An opening at the bottom! That is Mem.', kafRound: 'Round at the bottom. That is Kaf.', reish: 'Round on top. That is Reish.', daledCorner: 'A corner! That is Daled.', kuf: 'A long leg! That is Kuf.', heiShort: 'A short leg. That is Hei.', kaf: 'A dot inside! That is Kaf.', chaf: 'No dot. That is Chaf.' };
const CLUE = { vov: 'Vov has no crown.', zayin: 'Zayin has a crown.', hei: 'Hei’s leg doesn’t touch the roof.', ches: 'Ches’s leg touches the roof.',
  beis: 'Beis has a tail at the bottom.', gimmel: 'Gimmel has a foot.', pei: 'Pei has a dot.', peiTongue: 'Pei has a little tongue inside.', kafNoTongue: 'Kaf has no little tongue.', fei: 'Fei has no dot.', nun: 'Nun is flat at the bottom.', tes: 'Tes is closed at the bottom.', mem: 'Mem has an opening at the bottom.', kafRound: 'Kaf is round at the bottom.', reish: 'Reish is round on top.', daledCorner: 'Daled has a corner.', kuf: 'Kuf has a long leg.', heiShort: 'Hei has a short leg.', kaf: 'Kaf has a dot.', chaf: 'Chaf has no dot.' };
/* in a Beis/Kaf round the thing to see is the bottom, in a Kaf/Chaf round the dot */
const say = (T, k, pr) => T[k === 'kaf' && pr.includes('beis') ? 'kafRound' : k === 'kaf' && pr.includes('pei') ? 'kafNoTongue' : k === 'pei' && pr.includes('kaf') ? 'peiTongue' : k === 'daled' && pr.includes('reish') ? 'daledCorner' : k === 'hei' && pr.includes('kuf') ? 'heiShort' : k];
const WATCH = { reish: 'Round on top!', kuf: 'A long leg!', zayin: 'A crown on top!', ches: 'The leg touches the roof!', kaf: 'Round at the bottom!', chaf: 'No dot!', nun: 'Flat at the bottom!', mem: 'An opening at the bottom!', pei: 'A little tongue inside!', fei: 'No dot!' };
export default function setup(E, { struggled, unit, game }) {
  const { THREE, S } = E;
  const pairs = (game && game.pairs) || PAIRS[unit.n] || PAIRS[3];
  const feat = (k, pr) => E.featFor(k, pr[0] === k ? pr[1] : pr[0]);   /* a dot pair: point at the dot place */
  const kid = E.unitBoy(unit.n); E.scene.add(kid);
  const wood = E.M(0xc68a52, { roughness: .6 }), wood2 = E.M(0xa86f3c, { roughness: .6 });
  function crate() { const c = new THREE.Group(); c.add(E.mesh(E.rbox(2.0, 1.2, 1.4, .08), wood, 0, .6, 0)); for (let i = 0; i < 3; i++) c.add(E.mesh(new THREE.BoxGeometry(2.05, .1, .05), wood2, 0, .25 + i * .35, .72));
    c.add(E.mesh(E.rbox(1.55, 1.6, .1, .08), E.M(0xfffaf0, { roughness: .4 }), 0, 1.9, .45)); E.scene.add(c); return c; }
  const crates = [crate(), crate()];
  const arrows = crates.map(() => E.arrow3d(.4));   /* on each label an arrow points at the difference */
  const glows = crates.map(c => { const g = E.glowSprite('#fff7b0', 3.6, 0); g.position.set(0, 1.2, -.6); c.add(g); return g; });
  let card = E.letter('vov', 1.9); card.visible = false; E.scene.add(card);
  const cardArrow = E.arrow3d(.45);
  function makeCard(k) { const old = card; card = E.letter(k, 1.9); card.visible = false; E.scene.add(card); E.scene.remove(old); }   /* each letter has its own shape */
  let pair = pairs[0], labels = [], P = false, CS = 1, cardHome = new THREE.Vector3(), busy = true, dragging = false, enabled = false, help = struggled, mistakes = 0, wrongInRow = 0, missed = false, deck = [], idx = 0, onDone = null, kRound = 0;
  E.onLayout(p => { P = p; CS = p ? 1.05 : 1;
    if (p) { E.camBase.set(0, 3.0, 11.2); E.camTarget.set(0, 2.3, 0); crates[0].position.set(1.3, 0, .3); crates[1].position.set(-1.3, 0, .3); crates.forEach(c => c.scale.setScalar(.82)); cardHome.set(0, 4.3, 1.5); kid.visible = false; }   /* phone: bigger crates and card (graphics pass) */
    else { E.camBase.set(0, 2.7, 9.8); E.camTarget.set(0, 1.5, 0); crates[0].position.set(2.6, 0, 0); crates[1].position.set(-2.6, 0, 0); crates.forEach(c => c.scale.setScalar(1)); cardHome.set(0, 2.1, 1.5); kid.visible = true; kid.position.set(-4.7, 0, 1.4); }
    if (card.visible && !dragging && !busy) card.position.copy(cardHome);
  });
  function setPair(pr) {   /* right crate: the first letter of the pair (as Hebrew reads), left crate: the second */
    pair = pr; labels.forEach(l => l.parent && l.parent.remove(l)); labels = pr.map((k, i) => { const l = E.letter(k, 1.15); l.position.set(0, 1.95, .62); const lo = Math.max(...pr.map(x => E.letter(x, 1.15).userData.below)); if (lo) { l.scale.setScalar(.72); l.position.y += lo * .72 + .05; }   /* beside Kuf both letters are smaller and higher, so the long leg shows on the white label */ crates[i].add(l); crates[i].userData.key = k; return l; });
    pr.forEach((k, i) => E.pointAt(arrows[i], labels[i], k, 1.3, feat(k, pr)));
  }
  E.onFrame(t => {
    if (card.visible && !dragging && !busy) { card.position.y = cardHome.y + Math.sin(t * 2.2) * .08; card.rotation.y = Math.sin(t * 1.1) * .25; }
    const want = card.userData.key; crates.forEach((c, i) => glows[i].material.opacity = help && card.visible && c.userData.key === want ? .55 + Math.sin(t * 5) * .3 : 0);
  });
  const centre = c => c.position.clone().add(new THREE.Vector3(0, .8 * c.scale.x, .5));
  window.__info = () => ({ ready: enabled && !busy && card.visible, k: card.userData.key, card: E.toScreen(card.position), crates: Object.fromEntries(crates.map(c => [c.userData.key, E.toScreen(centre(c))])) });
  const nearest = () => { const [cx, cy] = E.toScreen(card.position); let best = null, bd = Math.min(innerWidth, innerHeight) * .25; crates.forEach(c => { const [x, y] = E.toScreen(centre(c)), d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = c; } }); return best; };
  const grab = new THREE.Vector3();
  E.onPointer('down', e => { if (!enabled || busy || !card.visible) return; if (E.pickFrom(e, [card])) { dragging = true; const p = E.planePoint(e, card.position.z); if (p) grab.copy(card.position).sub(p); return; } const c = E.pickFrom(e, crates); if (c) drop(c); });
  E.onPointer('move', e => { if (!dragging) return; const p = E.planePoint(e, card.position.z); if (p) card.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!dragging) return; dragging = false; drop(nearest()); });
  async function setCard(k) { makeCard(k); card.position.copy(cardHome); card.rotation.set(0, 0, 0); cardArrow.visible = false; missed = false; await E.popIn(card, CS); }
  async function back() { const p0 = card.position.clone(); busy = true; await E.tween(400, q => card.position.lerpVectors(p0, cardHome, q), E.ease.out); busy = false; }
  async function drop(c) {
    if (!c) { await back(); return; }
    const k = card.userData.key;
    if (c.userData.key === k) {
      busy = true; enabled = false; wrongInRow = 0; const p0 = card.position.clone(), to = centre(c);
      await E.tween(420, q => { card.position.lerpVectors(p0, to, q); card.scale.setScalar(CS * (1 - q * .85)); });
      card.visible = false; { const m = E.letter(k, .42); const n = c.userData.inCrate = (c.userData.inCrate || 0) + 1; m.position.set(((n - 1) % 4 - 1.5) * .42, .24 + Math.floor((n - 1) / 4) * .46, 1.0); m.userData.inPile = true; c.add(m); E.popIn(m, 1, 250); }   /* the crate fills up: he sees his sorted letters pile in (reviewer: more fun) */ E.joy(to); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 900 * E.F); E.hop(c, .15, 300);
      idx++; E.setProgress(deck.length, idx);
      await E.say(['Yes! ' + E.LETTERS[k].name + ' says', S(E.LETTERS[k].snd)]);
      if (idx < deck.length) { busy = true; await setCard(deck[idx]); busy = false; enabled = true; } else onDone();
    } else {
      E.sfx.boop(); if (!missed) mistakes++; missed = true; wrongInRow++; kid.mood('think'); await back(); busy = true; await E.shake(card, .15);
      E.pointAt(cardArrow, card, k, 1.9, feat(k, pair));
      await E.say('Look! ' + say(LOOK, k, pair)); cardArrow.visible = false; busy = false; kid.mood('calm');
      if (wrongInRow >= 2 || mistakes >= 3) help = true;
      await E.say('Try again!');
    }
  }
  async function playPair(pr, first) {
    setPair(pr); E.sfx.whoosh(); crates.forEach(c => E.hop(c, .2, 300));
    await E.say(say(CLUE, pr[0], pr)); await E.say(say(CLUE, pr[1], pr));   /* the right-hand crate first, as we read */   /* two lines: each 12 words or fewer */
    let d; do { d = Array.from({ length: 6 }, (_, i) => pr[i % 2]).sort(() => Math.random() - .5); } while (new RegExp(`(${pr[0]},){2}${pr[0]}|(${pr[1]},){2}${pr[1]}`).test(d.join(',')));
    deck = [pr[1], ...d]; idx = 0; E.setProgress(deck.length, 0);
    await setCard(deck[0]); busy = false;
    await E.say('Watch me. ' + (WATCH[pr[1]] || say(LOOK, pr[1], pr)));
    E.pointAt(cardArrow, card, pr[1], 1.9, feat(pr[1], pr)); await E.wait(600); cardArrow.visible = false;
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
    await E.say('Great! Now ' + E.LETTERS[pairs[1][0]].name + ' and ' + E.LETTERS[pairs[1][1]].name + '!');
    await playPair(pairs[1], false);
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? ({ 3: 'Great detective work! Crown or no crown, leg or gap!', 4: 'Great detective work! You know Beis, Kaf and Chaf!', 5: 'Great detective work! Foot or flat, open or closed!', 6: 'Great detective work! Tongue or no tongue, dot or no dot!', 7: 'Great detective work! Corner or round, short leg or long!' }[game && game.review ? 0 : unit.n]) || 'Great detective work!' : null };
  };
}
