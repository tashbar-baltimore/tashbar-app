/* Sound Match: each picture goes to the letter it starts with (gefen to Gimmel, dag to Daled, Havdalah to Hei).
   Skill: links each new letter with its sound. He hears the word, then drags the picture to a letter (or taps the letter).
   Show-then-try demo; a wrong answer is explained (he hears the word's first sound and the right letter glows); if he
   struggles, the right letter glows from the start of each picture. */
import { makePictures, WORDS, WORD_NAME } from '../pictures.js';
export default function setup(E, { struggled, unit, game = {} }) {
  const { THREE, S } = E;
  const PIC = makePictures(E), keys = (game.stands || (game.reviewOf ? E.UNITS[game.reviewOf - 1].letters : unit.n > 1 ? ['beis', ...unit.letters] : unit.letters)).filter(k => Object.values(WORDS).some(w => w.letter === k));   /* only letters with pictures (Chaf has none: few words start with it) */   /* in Alef-Beis order, right to left; as a review round, an earlier unit's letters */   /* one earlier letter comes back (Beis, with the bayis) */
  const words = Object.keys(WORDS).filter(w => keys.includes(WORDS[w].letter));
  const kid = E.unitBoy(unit.n); E.scene.add(kid);   /* the unit's boy: Shloimy, then Ari */
  const L = {}, peds = [], pedM = E.M(0xffffff, { roughness: .25, clearcoat: .8 }), tops = [0xff7aa8, 0x46c3ff, 0xffcf3a];
  keys.forEach((k, i) => { const p = new THREE.Group(); p.add(E.mesh(new THREE.CylinderGeometry(.75, .85, .5, 32), pedM, 0, .25, 0)); p.add(E.mesh(new THREE.CylinderGeometry(.78, .78, .12, 32), E.M(tops[i % 3], { roughness: .25, clearcoat: 1 }), 0, .55, 0));
    const l = E.letter(k, 1.4); l.position.y = 1.4; p.add(l); L[k] = l; p.userData.key = k; E.scene.add(p); peds.push(p); });
  const PS = () => P ? (peds.length > 3 ? .5 : .62) : (peds.length > 3 ? .88 : 1);
  const card = new THREE.Group(); E.scene.add(card); card.visible = false;
  const cardGlow = E.glowSprite('#ffffff', 2.6, .7); cardGlow.position.z = -.4; card.add(cardGlow);
  const cardBack = E.mesh(E.rbox(2.05, 2.05, .08, .2), E.M(0xffe9b8, { roughness: .4, clearcoat: .6, depthWrite: false }), 0, 0, -.35, false); cardBack.renderOrder = -1; card.add(cardBack);   /* a white card behind the picture, so it never melts into the painting */
  const hint = E.glowSprite('#fff7b0', 2.8, 0); E.scene.add(hint);
  let pic = null, word = null, P = false, gap = 2.3, cardHome = new THREE.Vector3(), busy = true, dragging = false, enabled = false, help = struggled, mistakes = 0, missed = false, onDone = null, idx = 0;
  E.onLayout(p => { P = p; gap = p ? (peds.length > 3 ? 1.12 : 1.45) : (peds.length > 3 ? 2.05 : 2.3); kid.visible = !p;   /* on a phone there's no room for Shloimy beside the stands */
    if (p) { E.camBase.set(0, 2.8, 10.6); E.camTarget.set(0, 2.4, 0); cardHome.set(0, 3.9, 2.2); kid.position.set(-1.5, 0, 2.6); kid.scale.setScalar(.6); }
    else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.9, 0); cardHome.set(0, 3.0, 2.2);   /* well above the letters, so it never seems to belong to one */ kid.position.set(-4.4, 0, 1.2); kid.scale.setScalar(1); }
    const m = peds.length; peds.forEach((pd, i) => { pd.position.set(((m - 1) / 2 - i) * gap, 0, .6); pd.scale.setScalar(PS()); });   /* right to left: Gimmel, Daled, Hei, then Beis */
    if (card.visible && !dragging && !busy) card.position.copy(cardHome);
  });
  E.onFrame(t => {
    if (card.visible && !dragging && !busy) { card.position.y = cardHome.y + Math.sin(t * 2.2) * .08; card.rotation.y = Math.sin(t * 1.1) * .35; }
    peds.forEach((pd, i) => L[pd.userData.key].rotation.y = Math.sin(t * 1.2 + i) * .25);
    const want = word && WORDS[word].letter, tgt = peds.find(pd => pd.userData.key === want);
    if (help && tgt && card.visible) { hint.position.copy(tgt.position).add(new THREE.Vector3(0, 1.4 * tgt.scale.x, -.5)); hint.material.opacity = .55 + Math.sin(t * 5) * .3; } else hint.material.opacity = 0;
    if (pic && pic.userData.flame) pic.userData.flame.scale.y = 1 + Math.sin(t * 9) * .08;
  });
  const top = pd => pd.position.clone().add(new THREE.Vector3(0, 1.4 * pd.scale.x, 0));
  window.__info = () => ({ ready: enabled && !busy && card.visible, want: word && WORDS[word].letter, card: E.toScreen(card.position), peds: Object.fromEntries(peds.map(pd => [pd.userData.key, E.toScreen(top(pd))])) });

  const nearest = () => { const [cx, cy] = E.toScreen(card.position); let best = null, bd = Math.min(innerWidth, innerHeight) * .2;
    peds.forEach(pd => { const [x, y] = E.toScreen(top(pd)), d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = pd; } }); return best; };
  const grab = new THREE.Vector3();
  E.onPointer('down', e => { if (!enabled || busy || !card.visible) return;
    if (E.pickFrom(e, [card])) { dragging = true; const p = E.planePoint(e, card.position.z); if (p) grab.copy(card.position).sub(p); return; }
    const pd = E.pickFrom(e, peds); if (pd) drop(pd); });            /* tapping a letter works too */
  E.onPointer('move', e => { if (!dragging) return; const p = E.planePoint(e, card.position.z); if (p) card.position.copy(p.add(grab)); const n = nearest(); peds.forEach(pd => pd.scale.setScalar(PS() * (pd === n ? 1.06 : 1))); });
  E.onPointer('up', () => { if (!dragging) return; dragging = false; peds.forEach(pd => pd.scale.setScalar(PS())); drop(nearest()); });

  async function showCard(w) {
    word = w; if (pic) card.remove(pic); pic = PIC[w](); card.add(pic); cardBack.scale.x = pic.userData.card ? Math.max(1, (pic.userData.card.scale.x + .35) / 2.05) : 1;   /* a wide picture (the cloud) gets a wider card */ card.position.copy(cardHome); card.rotation.set(0, 0, 0); missed = false;
    await E.popIn(card, P ? .9 : .85); busy = false;
    await E.say(WORDS[w].say);
  }
  async function back() { const p0 = card.position.clone(); busy = true; await E.tween(400, k => card.position.lerpVectors(p0, cardHome, k), E.ease.out); busy = false; }
  async function drop(pd) {
    if (!pd) { await back(); return; }
    const w = word, k = WORDS[w].letter, name = E.LETTERS[k].name, snd = E.LETTERS[k].snd;
    if (pd.userData.key === k) {
      busy = true; enabled = false; const p0 = card.position.clone(), to = top(pd);
      await E.tween(450, q => { card.position.lerpVectors(p0, to, q); card.scale.setScalar((P ? .9 : .85) * (1 - q * .9)); });
      card.visible = false; card.scale.setScalar(1); E.joy(to); E.hop(L[k], .4); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 900 * E.F);
      idx++; E.setProgress(deck.length, idx);
      await E.say(E.quiet(k) ? 'Yes! ' + WORD_NAME[w] + ' starts with ' + name + ', the quiet letter!' : ['Yes! ' + WORD_NAME[w] + ' starts with', S(snd), '. ' + name + '!']);   /* a quiet letter (Ayin) has no sound to say */
      if (idx < deck.length) { busy = true; await showCard(deck[idx]); enabled = true; } else onDone();
    } else {
      E.sfx.boop(); if (!missed) mistakes++; missed = true; kid.mood('think'); await back(); busy = true; await E.shake(card, .15); busy = false;
      help = true; await E.say(E.quiet(k) ? ['Listen. ' + WORD_NAME[w] + '.', WORD_NAME[w] + ' starts with ' + name + '.'] : ['Listen. ' + WORD_NAME[w] + '.', WORD_NAME[w] + ' starts with', S(snd), '.']);
      E.hop(L[k], .35); await E.say(E.quiet(k) ? name + ' is quiet. Try again!' : [name + ' says', S(snd), '. Try again!']); kid.mood('calm');
      if (mistakes < 2 && !struggled) help = false;   /* the glow stays on once he has missed twice */
    }
  }
  /* the pictures: the demo first, then the rest mixed */
  const first = (!game.reviewOf && words.find(w => unit.letters.includes(WORDS[w].letter) && E.LETTERS[WORDS[w].letter].snd && E.LETTERS[WORDS[w].letter].snd !== 'ch')) || words[0];   /* the demo shows a new letter */
  const rest = words.filter(w => w !== first).sort(() => Math.random() - .5), deck = [first, ...rest];
  return async () => {
    E.setProgress(deck.length, 0);
    if (game.review) { const nm = keys.map(k => E.LETTERS[k].name); await E.say('Remember ' + nm.slice(0, -1).join(', ') + ' and ' + nm[nm.length - 1] + '? Let\u2019s match again!'); }   /* names the letters on the stands */
    await E.say('Each picture goes to the letter it starts with.');
    await showCard(first);
    const k0 = WORDS[first].letter, pd0 = peds.find(pd => pd.userData.key === k0);
    await E.say(E.quiet(k0) ? 'Watch me. ' + WORD_NAME[first] + ' starts with ' + E.LETTERS[k0].name + '.' : ['Watch me. ' + WORD_NAME[first] + ' starts with', S(E.LETTERS[k0].snd), '.']);
    busy = true; let [x, y] = E.toScreen(card.position); E.hand.at(x, y); await E.wait(350);
    const p0 = card.position.clone(), p1 = top(pd0); await E.tween(1200, q => { card.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(card.position); E.hand.at(a, b); });
    E.hand.hide(); busy = false; enabled = true;
    const done = new Promise(r => onDone = r);
    await drop(pd0); mistakes = 0;
    if (idx < deck.length) { await E.say('Now you! Drag each picture to its letter.'); document.body.dataset.dragReady = 1; }
    await done;
    if (keys.includes('ches') && unit.letters.includes('chaf')) {   /* Chaf has no picture: it joins Ches, the letter that sounds just like it */
      const pd = peds.find(x => x.userData.key === 'ches'), c = E.letter('chaf', 1.2); c.position.copy(top(pd)).add(new THREE.Vector3(0, 2.75 * pd.scale.x, .6)); c.scale.setScalar(.75 * pd.scale.x); E.scene.add(c); await E.popIn(c, .75 * pd.scale.x);   /* well above its partner, smaller, so the two never look like one tall letter */
      await E.say('This is Chaf. Kaf without its dot.'); E.hop(L.ches, .3); await E.say('Chaf sounds just like Ches!'); }
    if (keys.includes('pei') && unit.letters.includes('fei')) {   /* Fei has no picture: it stands beside Pei and says f */
      const pd = peds.find(x => x.userData.key === 'pei'), c = E.letter('fei', 1.2); c.position.copy(top(pd)).add(new THREE.Vector3(0, 2.75 * pd.scale.x, .6)); c.scale.setScalar(.75 * pd.scale.x); E.scene.add(c); await E.popIn(c, .75 * pd.scale.x);   /* well above its partner, smaller, so the two never look like one tall letter */
      await E.say('This is Fei. Pei without its dot.'); E.hop(c, .3); await E.say(['Fei says', S(E.LETTERS.fei.snd), '.']); }
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Great matching! Every picture found its letter.' : null };
  };
}
