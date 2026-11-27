/* Game 1: Look-Alike Detective, Beis and Veis.
   Skill: tells Beis (dot: someone home, says "b") from Veis (no dot: nobody home, says "v").
   Two houses: the Beis house has Mendy inside (lit window); the Veis house is empty. He drags each letter to its house
   (or taps the house). Show-then-try demo; a kind correction circles the dot; if he struggles the right house glows. */
export default function setup(E, { struggled, game = {} }) {
  const { THREE, S } = E;
  const HB = E.house({ lit: true }), HV = E.house({ lit: false }); E.scene.add(HB, HV);
  const kid = E.mendy(); kid.scale.setScalar(.55); HB.add(kid); kid.position.set(.45, .36, 1.12); kid.userData.armR.visible = false;
  const signB = E.letter('beis', .9), signV = E.letter('veis', .9); HB.add(signB); HV.add(signV); signB.position.set(0, 2.55, 1.45); signV.position.set(0, 2.55, 1.45);
  const glowB = E.glowSprite('#fff7b0', 5.5, 0), glowV = E.glowSprite('#fff7b0', 5.5, 0); HB.add(glowB); HV.add(glowV); glowB.position.set(0, 1.4, -.4); glowV.position.set(0, 1.4, -.4);
  const card = E.letter('beis', 2.0); card.visible = false; E.scene.add(card);
  const ring = E.noticeRing(); card.add(ring);
  const shelf = { b: [], v: [] };
  const cardHome = new THREE.Vector3(); let HS = 1, CS = 1, dragging = false, busy = true, dragEnabled = false, help = struggled, t0 = 0;
  E.onLayout(p => {
    HS = p ? .7 : 1; CS = p ? 1.1 : 1;
    if (p) { E.camBase.set(0, 3.2, 12.6); E.camTarget.set(0, 2.3, 0); HB.position.set(1.32, 0, .9); HV.position.set(-1.32, 0, .9);   /* phone: both houses whole on screen (reviewer) */   /* Beis on the right, Veis on the left: Hebrew order */ cardHome.set(0, 4.7, 1.0); }
    else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.4, 0); HB.position.set(3.6, 0, 0); HV.position.set(-3.6, 0, 0); cardHome.set(0, 1.9, 1.4); }
    HB.scale.setScalar(HS); HV.scale.setScalar(HS); if (card.visible && !dragging && !busy) { card.position.copy(cardHome); card.scale.setScalar(CS); }
  });
  E.onFrame(t => {
    if (card.visible && !dragging && !busy && !E.CALM) { card.position.y = cardHome.y + Math.sin(t * 2.2) * .08; card.rotation.y = Math.sin(t * 1.1) * .3; }   /* calm: the letter hangs still, face-on */
    kid.userData.head.rotation.y = Math.sin(t * 1.5) * .3;
    if (!E.CALM) [signB, signV].forEach((s, i) => s.rotation.y = Math.sin(t * 1.2 + i) * .25);
    const k = card.userData.key, pulse = .55 + Math.sin(t * 4) * .25;
    glowB.material.opacity = help && card.visible && k === 'beis' ? pulse : 0; glowV.material.opacity = help && card.visible && k === 'veis' ? pulse : 0;
    if (card.userData.dot) card.userData.dot.material.emissiveIntensity = (help || ring.visible) ? .6 + Math.sin(t * 6) * .4 : .25;
  });
  const center = h => h.position.clone().add(new THREE.Vector3(0, 1, 0));
  window.__info = () => ({ k: card.userData.key, ready: dragEnabled && !busy && card.visible, card: E.toScreen(card.position), hb: E.toScreen(center(HB)), hv: E.toScreen(center(HV)), help });

  /* the deck: 8 letters (6 if he struggled last time), never 3 the same in a row; the demo is the first Beis */
  const n = help || game.review ? 6 : 8; let deck;   /* as a review round in a later unit: a short deck */
  do { deck = Array.from({ length: n }, (_, i) => i % 2 ? 'veis' : 'beis').sort(() => Math.random() - .5); } while (/(beis,beis,beis|veis,veis,veis)/.test(deck.join(',')));
  deck = ['beis', ...deck];
  let idx = 0, mistakes = 0, wrongInRow = 0, missed = false, onDone;

  const nearestHouse = () => { const c = card.position; for (const h of [HB, HV]) { const dx = Math.abs(c.x - h.position.x), lim = E.portrait ? 1.3 : 1.9; if (dx < lim && c.y < (E.portrait ? 3.7 : 3.4)) return h; } return null; };
  const plane = () => card.position.z; const grab = new THREE.Vector3();
  E.onPointer('down', e => {
    if (!dragEnabled || busy || !card.visible) return;
    if (E.pickFrom(e, [card])) { dragging = true; const p = E.planePoint(e, plane()); if (p) grab.copy(card.position).sub(p); return; }
    const h = E.pickFrom(e, [HB, HV]); if (h) drop(h);              /* tapping a house works too */
  });
  E.onPointer('move', e => { if (!dragging) return; const p = E.planePoint(e, plane()); if (p) { card.position.copy(p.add(grab)); card.rotation.z = (card.position.x - cardHome.x) * -.08; }
    const near = nearestHouse(); [HB, HV].forEach(h => h.scale.setScalar(HS * (h === near ? 1.06 : 1))); });
  E.onPointer('up', () => { if (!dragging) return; dragging = false; [HB, HV].forEach(h => h.scale.setScalar(HS)); drop(nearestHouse()); });

  function setCard(k) { card.setKey(k); card.position.copy(cardHome); card.rotation.set(0, 0, 0); card.visible = true; missed = false; return E.popIn(card, CS); }
  async function back() { const p0 = card.position.clone(); busy = true; await E.tween(400, k => { card.position.lerpVectors(p0, cardHome, k); card.rotation.z *= .8; }, E.ease.out); busy = false; }
  async function drop(h) {
    if (!h) { await back(); return; }
    const k = card.userData.key, right = (h === HB) === (k === 'beis');
    if (right) {
      busy = true; dragEnabled = false; wrongInRow = 0; const p0 = card.position.clone(), target = h.localToWorld(h.userData.window.clone());
      await E.tween(450, q => { card.position.lerpVectors(p0, target, q); card.scale.setScalar(CS * (1 - q * .92)); if (!E.CALM) card.rotation.y = q * Math.PI; });   /* calm: it never turns its back (a mirrored letter) */
      card.visible = false; E.joy(target); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 900);
      const s0 = h.scale.x; E.tween(500, q => h.scale.set(s0 * (1 + Math.sin(q * Math.PI) * .12), s0 * (1 - Math.sin(q * Math.PI) * .1), s0));
      const sh = shelf[k[0]], mini = E.letter(k, .42); mini.visible = !E.CALM; h.add(mini);   /* calm: no pile of little letters; the dots at the top count */ mini.position.set(-.85 + (sh.length % 4) * .55, .32 + Math.floor(sh.length / 4) * .5, 1.55); sh.push(mini);
      idx++; E.setProgress(deck.length, idx);
      await E.say(k === 'beis' ? ['Yes! Someone home. Beis says', S('b')] : ['Yes! Nobody home. Veis says', S('v')]);
      if (idx < deck.length) { await setCard(deck[idx]); busy = false; dragEnabled = true; if (help) E.say(k === 'beis' ? 'Look for the dot!' : 'Is anyone home?'); }
      else onDone();
    } else {
      E.sfx.boop(); if (!missed) mistakes++; missed = true; wrongInRow++; await back(); busy = true; kid.mood('think'); await E.shake(card); busy = false;
      ring.visible = true; ring.position.copy(card.userData.dotHome).setZ(.7); ring.scale.setScalar(1);
      await E.say(k === 'beis' ? 'Look! A dot. Someone is home. That is Beis.' : 'Look! No dot. Nobody is home. That is Veis.');
      ring.visible = false; kid.mood('calm');
      if ((wrongInRow >= 2 || mistakes >= 2) && !help) { help = true; }     /* quietly easier: the right house glows */
      { /* show how (K-CLARITY 16): the hand carries the letter halfway to its house, then he does it */
        busy = true; const H = k === 'beis' ? HB : HV, p0 = card.position.clone(), p1 = p0.clone().lerp(new THREE.Vector3(H.position.x, p0.y, p0.z), .5);
        await E.say(k === 'beis' ? 'Beis goes to the house with Mendy.' : 'Veis goes to the empty house.');
        await E.tween(700, q => { card.position.lerpVectors(p0, p1, q); const [x, y] = E.toScreen(card.position); E.hand.at(x, y); }); await E.wait(250); E.hand.hide(); await back(); }
      await E.say('Now you!');
    }
  }

  return async () => {
    E.setProgress(deck.length, 0);
    await setCard(deck[0]); busy = false; await E.wait(300);
    if (game.review) await E.say('Remember Beis and Veis? Let\u2019s sort them again!');
    await E.say('Watch me. Is anyone home?');
    ring.visible = true; ring.position.copy(card.userData.dotHome).setZ(.7); await E.say('A dot! Someone is home. Beis!'); ring.visible = false;
    busy = true; let [sx, sy] = E.toScreen(card.position); E.hand.at(sx, sy); await E.wait(400);
    const p0 = card.position.clone(), p1 = new THREE.Vector3(HB.position.x + (E.portrait ? .2 : .4), E.portrait ? 2.4 : 1.6, 1.4);
    await E.tween(1300, k => { card.position.lerpVectors(p0, p1, k); const [x, y] = E.toScreen(card.position); E.hand.at(x, y); });
    E.hand.hide(); busy = false; dragEnabled = true;
    const done = new Promise(r => onDone = r);
    await drop(HB);
    mistakes = 0;
    await E.say('Now you! Drag each letter to its house.');
    dragEnabled = true; busy = false; document.body.dataset.dragReady = 1;
    await done;
    const scored = deck.length - 1, stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    return { stars, line: stars >= 2 ? ['Great job! Beis says', S('b'), '. Veis says', S('v')] : null, scored };
  };
}
