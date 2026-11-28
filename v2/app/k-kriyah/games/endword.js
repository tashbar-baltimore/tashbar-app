/* Unit 9, a new kind of game: End of the Word.
   Skill: a final letter comes only at the END of a word (the left end, as Hebrew reads); everywhere else the plain letter goes.
   A short word stands on a long wooden board, right to left, with one empty place. Two cards wait below: the plain letter and
   its Shabbos-clothes partner (Mem and Mem Sofis). He drags the right one into the empty place. A small gold star marks the
   end of every word. He does not need to read the word: the place tells him. Show-then-try; a wrong card is answered kindly
   ("Mem Sofis goes only at the end."), and if he struggles, the right card glows. Every line is 12 words or fewer.
   The words (no nekudos, real everyday words; none spells a Name): שלום, מים, ארץ, נר, מלך, צב, גן, תף. */
const WORDS = [
  { say: 'Shalom', keys: ['shin', 'lamed', 'vov', 'memsofis'], gap: 3 },
  { say: 'Mayim, water', keys: ['mem', 'yud', 'memsofis'], gap: 0 },
  { say: 'Eretz, the land', keys: ['alef', 'reish', 'tzadiksofis'], gap: 2 },
  { say: 'Ner, a candle', keys: ['nun', 'reish'], gap: 0 },
  { say: 'Melech, a king', keys: ['mem', 'lamed', 'chafsofis'], gap: 2 },
  { say: 'Tzav, a turtle', keys: ['tzadik', 'veis'], gap: 0 },
  { say: 'Gan, a garden', keys: ['gimmel', 'nunsofis'], gap: 1 },
  { say: 'Tof, a drum', keys: ['tav', 'feisofis'], gap: 1 },
];
export default function setup(E, { struggled, unit }) {
  const { THREE } = E, NM = k => E.LETTERS[k].name;
  const FIN = { chaf: 'chafsofis', kaf: 'chafsofis', mem: 'memsofis', nun: 'nunsofis', pei: 'feisofis', fei: 'feisofis', tzadik: 'tzadiksofis' };
  const plainOf = k => E.LETTERS[k].partner || k, finalOf = k => E.LETTERS[k].partner ? k : FIN[k];
  const kid = E.unitBoy(unit.n); E.scene.add(kid);
  const board = new THREE.Group(); E.scene.add(board);
  const plank = E.mesh(E.rbox(6.4, 1.9, .3, .1), E.M(0x3f7fe0, { roughness: .4, clearcoat: .6 }), 0, 0, -.2); board.add(plank);
  const face = E.mesh(E.rbox(6.1, 1.6, .1, .08), E.M(0xfff6e4, { roughness: .5 }), 0, 0, -.02); board.add(face);
  const endStar = E.star3d(.3); board.add(endStar);   /* the end of the word (the left end) */
  const slotM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd36a, emissiveIntensity: .7, transparent: true, opacity: .6 });
  const slot = E.mesh(new THREE.TorusGeometry(.62, .05, 10, 40), slotM, 0, 0, .15, false); board.add(slot);
  const glow = E.glowSprite('#fff7b0', 2.0, 0); E.scene.add(glow);
  let slotFlash = 0, P = false, tiles = [], cards = [], word = null, busy = true, enabled = false, drag = null, grab = new THREE.Vector3(), mistakes = 0, missed = false, wrongInRow = 0, help = struggled, resolveTask = null, done = 0;
  const TH = 1.15, step = 1.35;
  const tileX = (i, n) => ((n - 1) / 2 - i) * step;   /* right to left */
  const cardHome = i => P ? new THREE.Vector3(i ? -.9 : .9, .9, 2.0) : new THREE.Vector3(i ? -1.4 : 1.4, .75, 2.4);
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.5, 11); E.camTarget.set(0, 2.2, 0); board.position.set(0, 2.75, .3); board.scale.setScalar(.78); kid.visible = false; }
    else { E.camBase.set(0, 2.5, 9.8); E.camTarget.set(0, 1.7, 0); board.position.set(.4, 2.65, 0); board.scale.setScalar(1); kid.visible = true; kid.position.set(-4.7, 0, 1.0); }
    cards.forEach((c, i) => { if (c !== drag && !c.userData.busy) c.position.copy(cardHome(i)); c.scale.setScalar(P ? .8 : 1); });
  });
  E.onFrame(t => {
    endStar.rotation.y = E.CALM ? 0 : Math.sin(t * 1.5) * .5; endStar.scale.setScalar(P ? 1.45 : 1);   /* it rocks gently, never edge-on; bigger on a phone */
    const fl = performance.now() < slotFlash; slotM.opacity = fl ? 1 : .45 + Math.sin(t * 3) * .15; slot.scale.setScalar(fl ? 1.3 : 1 + Math.sin(t * 3) * .04);
    cards.forEach((c, i) => { if (c !== drag && !c.userData.busy) c.position.y = cardHome(i).y + (E.CALM ? 0 : Math.sin(t * 2 + i) * .05); });
    const g = help && enabled && cards.find(c => word && c.userData.key === word.keys[word.gap]); if (g) { glow.position.copy(g.position).setZ(g.position.z - .3); glow.material.opacity = .55 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0;
  });
  const slotWorld = () => E.worldPos(slot);
  window.__info = () => ({ ready: enabled && !busy, want: word && word.keys[word.gap], cards: cards.map(c => ({ k: c.userData.key, xy: E.toScreen(c.position) })), slot: E.toScreen(slotWorld()) });
  function showWord(w) {
    tiles.forEach(t => board.remove(t)); tiles = []; word = w; const n = w.keys.length;
    w.keys.forEach((k, i) => { if (i === w.gap) return; const t = E.letter(k, TH); t.position.set(tileX(i, n), t.userData.below ? t.userData.below * .5 : 0, .1); if (t.userData.below) t.scale.setScalar(.8); board.add(t); tiles.push(t); E.popIn(t, t.scale.x); });
    slot.position.set(tileX(w.gap, n), 0, .15); slot.visible = true;
    endStar.position.set(tileX(n - 1, n) - .45, .95, .2);
    plank.scale.x = face.scale.x = Math.max(.5, (n * step + .6) / 6.4);
  }
  function makeCards(k) {
    cards.forEach(c => E.scene.remove(c)); const a = plainOf(k), b = finalOf(k);
    cards = [a, b].sort(() => Math.random() - .5).map((kk, i) => { const c = E.letter(kk, 1.3); c.position.copy(cardHome(i)); c.scale.setScalar(P ? .8 : 1); E.scene.add(c); E.popIn(c, P ? .8 : 1); return c; });
  }
  E.onPointer('down', e => { if (!enabled || busy) return; const c = E.pickFrom(e, cards); if (!c) return; drag = c; const p = E.planePoint(e, c.position.z); if (p) grab.copy(c.position).sub(p); });
  E.onPointer('move', e => { if (!drag) return; const p = E.planePoint(e, drag.position.z); if (p) drag.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!drag) return; const c = drag; drag = null; const [cx, cy] = E.toScreen(c.position), [sx, sy] = E.toScreen(slotWorld()); drop(c, Math.hypot(cx - sx, cy - sy) < Math.max(70, Math.min(innerWidth, innerHeight) * .15)); });
  async function back(c) { const i = cards.indexOf(c), p0 = c.position.clone(), h = cardHome(i); c.userData.busy = true; await E.tween(380, q => c.position.lerpVectors(p0, h, q), E.ease.out); c.userData.busy = false; }
  const atEnd = () => word.gap === word.keys.length - 1;
  async function drop(c, over) {
    if (!over) { await back(c); return; }
    busy = true; const k = c.userData.key, want = word.keys[word.gap];
    if (k === want) {
      wrongInRow = 0; enabled = false; const p0 = c.position.clone(), to = slotWorld(); await E.tween(350, q => c.position.lerpVectors(p0, to, q));
      E.scene.remove(c); cards = cards.filter(x => x !== c); slot.visible = false; const t = E.letter(k, TH); const n = word.keys.length; t.position.set(tileX(word.gap, n), t.userData.below ? t.userData.below * .5 : 0, .1); if (t.userData.below) t.scale.setScalar(.8); board.add(t); tiles.push(t);
      E.joy(to.clone().add(new THREE.Vector3(0, .3, .5))); E.hop(t, .25, 300); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 900 * E.F);
      await E.say(atEnd() ? 'Yes! At the end, ' + NM(want) + '!' : 'Yes! Not the end, so plain ' + NM(want) + '!');
      busy = false; const r = resolveTask; resolveTask = null; r && r();
    } else {
      E.sfx.boop(); if (!missed) mistakes++; missed = true; wrongInRow++; kid.mood('think'); await back(c); await E.shake(c, .12);
      E.hop(endStar, .4, 500); slotFlash = performance.now() + 2500 * E.F;   /* the star and the empty place light up */
      await E.say(E.LETTERS[k].partner ? NM(k) + ' goes only at the end of a word.' : 'This is the end of the word!');
      await E.say(atEnd() ? 'At the end, ' + NM(plainOf(k)) + ' wears Shabbos clothes.' : 'Here we need plain ' + NM(want) + '.');
      { const r = cards.find(x => x.userData.key === want && x.visible); if (E.CALM && r) { /* show how (K-CLARITY 16): the hand carries it halfway, then he does it */ const a = r.position.clone(), b = a.clone().lerp(slotWorld(), .5); r.userData.busy = true;
        await E.tween(700, q => { r.position.lerpVectors(a, b, q); const [x, y] = E.toScreen(r.position); E.hand.at(x, y); }); await E.wait(250); E.hand.hide(); await E.tween(350, q => r.position.lerpVectors(b, a, q)); r.userData.busy = false; await E.say('Now you!'); } }
      if (wrongInRow >= 2 || mistakes >= 3) help = true; kid.mood('calm'); busy = false;
    }
  }
  async function task(w, demo) {
    showWord(w); makeCards(w.keys[w.gap]); missed = false; await E.wait(350);
    await E.say(w.say + '!'); await E.say(atEnd() ? 'The empty place is at the end.' : 'The empty place is not at the end.');
    const p = new Promise(r => resolveTask = r);
    if (demo) { const c = cards.find(x => x.userData.key === w.keys[w.gap]); await E.say('Watch me. At the end, Mem Sofis!'); let [x, y] = E.toScreen(c.position); E.hand.at(x, y); await E.wait(400);
      const p0 = c.position.clone(), p1 = slotWorld(); await E.tween(1200, q => { c.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(c.position); E.hand.at(a, b); }); E.hand.hide(); enabled = true; busy = false; await drop(c, true); }
    else { busy = false; enabled = true; document.body.dataset.endReady = ++done; await E.say('Which one goes there?'); }
    await p; enabled = false;
    tiles.forEach(t => E.popOut(t, 250)); cards.forEach(c => { E.popOut(c, 250); setTimeout(() => E.scene.remove(c), 300); }); cards = []; await E.wait(300);   /* the other card goes too */
  }
  return async () => {
    const list = WORDS.slice(1).sort(() => Math.random() - .5); E.setProgress(list.length, 0);
    await E.say('The star shows the end of the word.');
    await task(WORDS[0], true);
    await E.say(E.CALM ? 'Now you! Drag the right one to the empty place.' : 'Now you! Is it the end, or not?'); mistakes = 0;
    for (let i = 0; i < list.length; i++) { await task(list[i]); E.setProgress(list.length, i + 1); }
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'You know where Shabbos clothes go: at the end!' : null };
  };
}
