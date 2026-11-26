/* Unit 9, a new kind of game: Partner Match.
   Skill: knows each final letter's partner, and that the partners say the same sound (Mem and Mem Sofis both say m).
   Five letters stand on a shelf in Alef-Beis order, right to left: Chaf, Mem, Nun, Fei, Tzadik. Under each is an empty
   glowing place. Below, the five final letters wait, mixed up. He drags each final letter under its partner; the two
   hop together, a gold link joins them, and both say their sound. Round 2: the shelf is mixed up, so the place gives no help.
   Show-then-try; a wrong partner is answered kindly (the letter says who its partner is) and he tries again;
   if he struggles, the right place glows. Every line is 12 words or fewer. */
export default function setup(E, { struggled, unit }) {
  const { THREE, S } = E, NM = k => E.LETTERS[k].name;
  const FIN = ['chafsofis', 'memsofis', 'nunsofis', 'feisofis', 'tzadiksofis'], REG = FIN.map(f => E.LETTERS[f].partner);
  const kid = E.unitBoy(unit.n); E.scene.add(kid);
  const shelfM = E.M(0xc68a52, { roughness: .55 }), placeM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff0b0, emissiveIntensity: .5, transparent: true, opacity: .55 });
  const shelf = E.mesh(E.rbox(8.6, .18, 1.0, .06), shelfM, 0, 0, 0); E.scene.add(shelf);
  const tops = [], places = [], links = [], cards = [];
  const glow = E.glowSprite('#fff7b0', 2.0, 0); E.scene.add(glow);
  let P = false, H = 1.3, order = REG.slice(), busy = true, enabled = false, drag = null, grab = new THREE.Vector3(), mistakes = 0, wrongInRow = 0, help = struggled, resolveRound = null, placed = 0, missedKey = null;
  const slotX = i => P ? (2 - i) * 1.0 : (2 - i) * 1.75;   /* right to left */
  const topPos = i => new THREE.Vector3(slotX(i), P ? 4.6 : 3.25, 0);
  const placePos = i => new THREE.Vector3(slotX(i), P ? 3.3 : 1.75, .3);
  const homePos = i => P ? new THREE.Vector3([1.3, 0, -1.3, .65, -.65][i], [1.95, 1.95, 1.95, .95, .95][i], 1.6) : new THREE.Vector3(3.6 - i * 1.8, .95, 2.4);
  E.onLayout(p => { P = p; H = p ? .85 : 1.3;
    if (p) { E.camBase.set(0, 2.6, 11); E.camTarget.set(0, 2.6, 0); kid.visible = false; shelf.scale.set(.6, 1, 1); shelf.position.set(0, 4.6 - H / 2 - .12, 0); }
    else { E.camBase.set(0, 2.4, 10); E.camTarget.set(0, 1.7, 0); kid.visible = true; kid.position.set(-5.4, 0, .8); shelf.scale.set(1, 1, 1); shelf.position.set(0, 3.25 - H / 2 - .12, 0); }
    lay();
  });
  function lay() {
    tops.forEach((t, i) => { t.position.copy(topPos(i)); t.scale.setScalar(H / 1.3); }); places.forEach((p, i) => { p.position.copy(placePos(i)); p.scale.setScalar(H / 1.3); });
    cards.forEach(c => { c.scale.setScalar(H / 1.3); if (c.userData.done != null) c.position.copy(placePos(c.userData.done)); else if (c !== drag) c.position.copy(homePos(c.userData.home)); });
    links.forEach(l => { const i = l.userData.i; l.position.copy(topPos(i)).lerp(placePos(i), .5); l.scale.setScalar(H / 1.3); });
  }
  function build() {
    tops.forEach(t => E.scene.remove(t)); places.forEach(p => E.scene.remove(p)); links.forEach(l => E.scene.remove(l)); cards.forEach(c => E.scene.remove(c)); tops.length = places.length = links.length = cards.length = 0;
    order.forEach((k, i) => { const t = E.letter(k, 1.3); t.userData.slot = i; E.scene.add(t); tops.push(t);
      const p = E.mesh(new THREE.TorusGeometry(.62, .05, 10, 40), placeM, 0, 0, 0, false); p.userData = { slot: i, key: k }; E.scene.add(p); places.push(p); });
    const homes = FIN.map((_, i) => i).sort(() => Math.random() - .5);
    FIN.forEach((f, i) => { const c = E.letter(f, 1.3); c.userData.home = homes[i]; c.userData.done = null; E.scene.add(c); cards.push(c); });
    placed = 0; lay();
  }
  E.onFrame(t => {
    cards.forEach((c, i) => { if (c.userData.done == null && c !== drag && !c.userData.busy) c.position.y = homePos(c.userData.home).y + Math.sin(t * 2 + i) * .05; c.rotation.y = c.userData.done == null ? Math.sin(t * 1.2 + i) * .2 : 0; });
    places.forEach((p, i) => { p.material.opacity = .45 + Math.sin(t * 3 + i) * .12; p.visible = !cards.some(c => c.userData.done === i); });
    const want = help && enabled && cards.find(c => c.userData.done == null && (!missedKey || c.userData.key === missedKey));
    if (want) { const i = order.indexOf(E.LETTERS[want.userData.key].partner); glow.position.copy(placePos(i)).setZ(-.1); glow.material.opacity = .55 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0;
  });
  window.__info = () => ({ ready: enabled && !busy, cards: cards.filter(c => c.userData.done == null).map(c => ({ k: c.userData.key, xy: E.toScreen(c.position) })),
    places: Object.fromEntries(order.map((k, i) => [k, i]).filter(([k, i]) => !cards.some(c => c.userData.done === i)).map(([k, i]) => [k, E.toScreen(placePos(i))])), partnerOf: Object.fromEntries(FIN.map(f => [f, E.LETTERS[f].partner])) });
  E.onPointer('down', e => { if (!enabled || busy) return; const c = E.pickFrom(e, cards.filter(c => c.userData.done == null && !c.userData.busy)); if (!c) return; drag = c; const p = E.planePoint(e, c.position.z); if (p) grab.copy(c.position).sub(p); c.scale.multiplyScalar(1.1); });
  E.onPointer('move', e => { if (!drag) return; const p = E.planePoint(e, drag.position.z); if (p) drag.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!drag) return; const c = drag; drag = null; c.scale.setScalar(H / 1.3); drop(c, nearest(c)); });
  function nearest(c) { const [cx, cy] = E.toScreen(c.position); let best = null, bd = Math.max(60, Math.min(innerWidth, innerHeight) * .12);
    order.forEach((k, i) => { if (cards.some(o => o.userData.done === i)) return; const [x, y] = E.toScreen(placePos(i)), d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = i; } }); return best; }
  async function back(c) { const p0 = c.position.clone(), h = homePos(c.userData.home); c.userData.busy = true; await E.tween(380, q => c.position.lerpVectors(p0, h, q), E.ease.out); c.userData.busy = false; }
  async function drop(c, i, demo) {
    if (i == null) { await back(c); return; }
    busy = true; const k = c.userData.key, partner = E.LETTERS[k].partner;
    if (order[i] === partner) {
      c.userData.done = i; wrongInRow = 0; missedKey = null; const p0 = c.position.clone(), to = placePos(i);
      await E.tween(380, q => { c.position.lerpVectors(p0, to, q); c.position.y += Math.sin(q * Math.PI) * .4; });
      const link = E.mesh(new THREE.CylinderGeometry(.05, .05, 1, 10), E.goldDot(), 0, 0, -.2, false); link.userData.i = i; link.scale.setScalar(H / 1.3); link.position.copy(topPos(i)).lerp(placePos(i), .5).setZ(-.25); link.scale.y = 1; E.scene.add(link); links.push(link);
      E.joy(to.clone().add(new THREE.Vector3(0, .5, .5))); E.hop(c, .3); E.hop(tops[i], .3); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 900 * E.F);
      await E.say([NM(partner) + ' and ' + NM(k) + '! Both say', S(E.LETTERS[k].snd), '!']);
      placed++; busy = false; if (placed === FIN.length && resolveRound) { const r = resolveRound; resolveRound = null; r(); }
    } else {
      E.sfx.boop(); if (missedKey !== k) mistakes++; missedKey = k; wrongInRow++; kid.mood('think'); await back(c); await E.shake(c, .12);
      await E.say('That is ' + NM(k) + '. Its partner is ' + NM(partner) + '.');
      const j = order.indexOf(partner); E.hop(tops[j], .35);
      if (wrongInRow >= 2 || mistakes >= 3) help = true; kid.mood('calm'); busy = false;
    }
  }
  return async () => {
    E.setProgress(2, 0); build();
    await E.say('Every letter in Shabbos clothes has a partner.');
    await E.say('Watch me. Mem Sofis goes with Mem.');
    const c0 = cards.find(c => c.userData.key === 'memsofis'), i0 = order.indexOf('mem'); let [x, y] = E.toScreen(c0.position); E.hand.at(x, y); await E.wait(400);
    const p0 = c0.position.clone(), p1 = placePos(i0); await E.tween(1200, q => { c0.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(c0.position); E.hand.at(a, b); });
    E.hand.hide(); await drop(c0, i0, true);
    await E.say('Now you! Put each one under its partner.'); mistakes = 0;
    let done = new Promise(r => resolveRound = r); busy = false; enabled = true; document.body.dataset.partnerReady = 1; await done; enabled = false;
    E.setProgress(2, 1); await E.say('Great! Now the shelf is mixed up.');
    do { order = REG.slice().sort(() => Math.random() - .5); } while (order.some((k, i) => k === REG[i]));
    build(); tops.forEach(t => E.popIn(t, H / 1.3)); await E.wait(400);
    await E.say('Find each partner again!');
    done = new Promise(r => resolveRound = r); busy = false; enabled = true; document.body.dataset.partnerReady = 2; await done; enabled = false;
    E.setProgress(2, 2);
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Every letter found its partner! Wonderful!' : null };
  };
}
