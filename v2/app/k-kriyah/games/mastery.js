/* A unit's mastery check: "hear it, tap it" (tap-to-check is allowed for checks).
   Skill check: names and sounds every letter so far, mixed; Beis is always asked beside Veis. 9 questions; 2 of 3 stars passes.
   Three letters stand on pedestals for each question (the answer and two others from everything learned so far).
   A wrong tap is explained kindly (the right letter glows and hops), and that question comes back at the end (not counted again).
   If he misses two in a row, the next question shows only two letters: that one is practice, and comes back with all three. */
const N = k => ({ k, by: 'name' }), SND = k => ({ k, by: 'sound' });
const QS = {
  1: [N('beis'), N('alef'), N('veis'), SND('beis'), SND('veis'), { k: 'alef', by: 'quiet' }, N('veis'), N('beis'), SND('veis')],
  3: [N('zayin'), N('vov'), SND('zayin'), N('ches'), N('hei'), N('daled'), { k: 'alef', by: 'quiet' }, N('beis'), SND('gimmel')],   /* no 'Which says ch?' until the rebbe's recording */
  4: [N('kaf'), N('tes'), N('chaf'), SND('kaf'), N('yud'), SND('tes'), N('beis'), SND('yud'), N('ches')],   /* Beis comes with Kaf; no 'Which says ch?' */
  5: [N('lamed'), N('nun'), SND('mem'), N('mem'), SND('nun'), N('tes'), SND('lamed'), N('gimmel'), N('kaf')],   /* Nun beside Gimmel, Mem beside Tes */
  6: [N('pei'), N('nun'), N('fei'), SND('pei'), N('ayin'), SND('samech'), { k: 'ayin', by: 'quiet' }, N('kaf'), SND('fei')],   /* Pei beside Fei; Kaf beside Chaf; 'Which says f?' with Pei beside it */
  7: [N('reish'), N('tzadik'), N('kuf'), SND('reish'), N('daled'), SND('tzadik'), N('hei'), SND('mem'), SND('kuf')],   /* an older letter comes back too */   /* Reish beside Daled, Kuf beside Hei */
  8: [N('shin'), N('sin'), SND('shin'), N('tav'), N('sav'), SND('tav'), N('ches'), N('tzadik'), N('sin')],   /* Shin beside Sin, Tuf beside Suf; 'Which says t?' never with Tes on screen */
  2: [N('gimmel'), SND('daled'), N('hei'), SND('gimmel'), SND('hei'), N('daled'), SND('beis'), { k: 'alef', by: 'quiet' }, N('veis')],
};
export default function setup(E, { struggled, unit }) {
  const { THREE, S } = E;
  const rebbe = E.rebbe(); E.scene.add(rebbe);
  const keys = [...unit.known, ...unit.letters], L = {}, peds = [];
  const pedM = E.M(0xffffff, { roughness: .25, clearcoat: .8 }), pedTop = [E.M(0xff7aa8, { roughness: .25, clearcoat: 1 }), E.M(0x46c3ff, { roughness: .25, clearcoat: 1 }), E.M(0xffcf3a, { roughness: .25, clearcoat: 1 })];
  for (let i = 0; i < 3; i++) { const p = new THREE.Group(); p.add(E.mesh(new THREE.CylinderGeometry(.75, .85, .5, 32), pedM, 0, .25, 0)); p.add(E.mesh(new THREE.CylinderGeometry(.78, .78, .12, 32), pedTop[i], 0, .55, 0)); E.scene.add(p); peds.push(p); }
  keys.forEach(k => { L[k] = E.letter(k, 1.6); E.scene.add(L[k]); L[k].visible = false; });
  const arrows = [E.arrow3d(.3), E.arrow3d(.3)];   /* on a look-alike mix-up: point at the place to look on both letters */
  const feat = (k, other) => E.featFor(k, other);
  const LS = () => E.portrait ? .55 : .86;   /* letter size: small enough that wide letters (Mem, Nun) never touch */
  const glow = E.glowSprite('#fff7b0', 3, 0); E.scene.add(glow);
  /* a basket that fills up: every letter he gets right jumps in and stays, so he can watch his letters pile up */
  const basket = new THREE.Group(), wick = E.M(0xc68a52, { roughness: .7 }); basket.add(E.mesh(new THREE.CylinderGeometry(.75, .55, .7, 28, 1, true), wick, 0, .35, 0)); basket.children[0].material.side = THREE.DoubleSide;
  for (let i = 0; i < 3; i++) basket.add(E.mesh(new THREE.TorusGeometry(.6 + i * .07, .035, 8, 32), E.M(0xa86f3c, { roughness: .6 }), 0, .12 + i * .23, 0)).children.at(-1).rotation.x = Math.PI / 2;
  basket.add(E.mesh(new THREE.CylinderGeometry(.56, .56, .04, 28), E.M(0x8a5a3c), 0, .05, 0)); E.scene.add(basket); let inBasket = 0;
  async function toBasket(k) { const c = E.letter(k, .55), p0 = E.worldPos(L[k]); c.position.copy(p0); E.scene.add(c); const n = inBasket++, to = basket.position.clone().add(new THREE.Vector3(((n % 3) - 1) * .32 * basket.scale.x, (.5 + Math.floor(n / 3) * .12) * basket.scale.x, ((n % 2) - .5) * .2));
    E.sfx.whoosh(); await E.tween(520, q => { c.position.lerpVectors(p0, to, q); c.position.y += Math.sin(q * Math.PI) * 1.2; c.rotation.y = q * Math.PI * 2; c.scale.setScalar(basket.scale.x * (1 - q * .2) + .2 * (1 - q)); }); E.sfx.pop(); E.hop(basket, .12, 250); }
  let set = keys.slice(0, 3), slot = {}, gap = 2.3, active = false, glowOn = null, resolveQ = null, hidden = null, hiddenPed = null;
  set.forEach((k, i) => slot[k] = i);
  const slotPos = i => new THREE.Vector3((1 - i) * gap, 0, .6);   /* right to left */
  E.onLayout(p => {
    gap = p ? 1.5 : 2.55; keys.forEach(k => L[k].scale.setScalar(LS()));
    basket.position.set(p ? .9 : 4.3, 0, p ? 3.3 : .4); basket.scale.setScalar(p ? .5 : 1);   /* on a phone it sits on the grass in front */
    if (p) { E.camBase.set(0, 2.6, 10.2); E.camTarget.set(0, 1.9, 0); rebbe.visible = false;   /* a phone has no room for him beside the letters */ peds.forEach(x => x.scale.setScalar(.62)); }
    else { E.camBase.set(0, 2.4, 9.5); E.camTarget.set(0, 1.4, 0); rebbe.visible = true; rebbe.position.set(-4.8, 0, .2); rebbe.scale.setScalar(1.45); peds.forEach(x => x.scale.setScalar(1)); }
    place(false);
  });
  function place(animate = true) {
    peds.forEach((p, i) => p.position.copy(slotPos(i)));
    const ps = [];
    keys.forEach(k => { const l = L[k]; if (!set.includes(k)) { l.visible = false; l.userData.base = null; return; }
      const to = slotPos(slot[k]).add(new THREE.Vector3(0, (E.portrait ? .38 : .61) + .5 * 1.6 * LS() + .12 + l.userData.below * LS(), 0));   /* just above the pedestal top, Kuf's leg too */   /* Kuf's long leg above the pedestal */
      if (!animate || !l.visible) { l.visible = true; l.position.copy(to); l.userData.base = to.clone(); if (animate) ps.push(E.popIn(l, LS(), 400)); return; }
      const from = l.position.clone(); l.userData.base = null; ps.push(E.tween(600, q => { l.position.lerpVectors(from, to, q); l.position.y += Math.sin(q * Math.PI) * 1.0; }).then(() => { l.userData.base = to.clone(); })); });
    return Promise.all(ps);
  }
  E.onFrame(t => { keys.forEach((k, i) => { const l = L[k]; if (l.userData.base) { l.position.y = l.userData.base.y + Math.sin(t * 2 + i * 2) * .06; l.rotation.y = Math.sin(t * 1.1 + i) * .25; } });
    if (glowOn) { glow.position.copy(glowOn.position).add(new THREE.Vector3(0, 0, -.4)); glow.material.opacity = .6 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0; });
  window.__info = () => ({ active, want: cur && cur.k, letters: Object.fromEntries(keys.filter(k => L[k].visible).map(k => [k, E.toScreen(E.worldPos(L[k]))])) });
  let cur = null;
  E.onPointer('down', e => { if (!active) return; const l = E.pickFrom(e, keys.map(k => L[k]).filter(l => l.visible)); if (l && resolveQ) { const r = resolveQ; resolveQ = null; r(l.userData.key); } });
  /* the three letters for a question: the answer, its look-alike if it has one, then a new letter and an older one */
  const PAIR = { beis: unit.n >= 4 ? 'kaf' : 'veis', veis: 'beis', vov: 'zayin', zayin: 'vov', hei: 'ches', ches: 'hei', kaf: 'chaf', chaf: 'kaf', ...(unit.n >= 5 ? { gimmel: 'nun', nun: 'gimmel', tes: 'mem', mem: 'tes' } : {}), ...(unit.n >= 6 ? { pei: 'fei', fei: 'pei' } : {}), ...(unit.n >= 7 ? { reish: 'daled', daled: 'reish', kuf: 'hei', hei: 'kuf' } : {}), ...(unit.n >= 8 ? { shin: 'sin', sin: 'shin', tav: 'sav', sav: 'tav', ches: 'tav' } : {}) };   /* Unit 8: Ches is shown beside Tuf (the little foot) */   /* from Unit 4, Beis is shown with its look-alike Kaf */
  const SAME = { vov: 'veis', veis: 'vov', chaf: 'ches', ches: 'chaf', alef: 'ayin', ayin: 'alef', samech: 'sin', kaf: 'kuf', kuf: 'kaf' };   /* the same sound, never asked side by side */   /* the same sound */
  const CLUE = { beis: 'Beis has a dot.', veis: 'Veis has no dot.', zayin: 'Zayin has a crown.', vov: 'Vov has no crown.', ches: 'Ches\u2019s leg touches the roof.', hei: 'Hei\u2019s leg doesn\u2019t touch the roof.', kaf: 'Kaf has a dot.', chaf: 'Chaf has no dot.', gimmel: 'Gimmel has a foot.', nun: 'Nun is flat at the bottom.', tes: 'Tes is closed at the bottom.', mem: 'Mem has an opening at the bottom.', lamed: 'Lamed is the tall one.', pei: 'Pei has a dot.', fei: 'Fei has no dot.', reish: 'Reish is round on top.', kuf: 'Kuf has a long leg.', shin: 'Shin has its dot on the right.', sin: 'Sin has its dot on the left.', tav: 'Tuf has a dot inside.', sav: 'Suf has no dot.' };
  const ALSO = unit.n >= 6 ? { kaf: 'pei', pei: 'kaf' } : {};   /* this unit's own look-alike (Pei's little tongue) */
  const clue = (k, got) => (k === 'pei' && got === 'kaf') ? 'Pei has a little tongue inside.' : (k === 'kaf' && got === 'pei') ? 'Kaf has no little tongue.' : (k === 'daled' && got === 'reish') ? 'Daled has a corner.' : (k === 'hei' && got === 'kuf') ? 'Hei has a short leg.' : (k === 'beis' && got === 'kaf') ? 'Beis has a tail at the bottom.' : (k === 'kaf' && got === 'beis') ? 'Kaf is round at the bottom.' : (k === 'tav' && got === 'ches') ? 'Tuf has a little foot.' : (k === 'ches' && got === 'tav') ? 'Ches has no foot.' : CLUE[k];   /* Vov and Veis both say v: never ask one with the other on screen */
  const mix = a => a.slice().sort(() => Math.random() - .5);
  function pick(k) {
    if (keys.length <= 3) return mix(keys);
    const out = [k]; if (PAIR[k]) out.push(PAIR[k]);
    const ok = c => !out.includes(c) && !out.some(o => SAME[o] === c || (E.sameSound && E.sameSound(o, c)));   /* never two letters with the same sound together (Kuf and Kaf, Alef and Ayin) */
    const newer = mix(unit.letters).find(ok); if (out.length < 3 && newer) out.push(newer);   /* one new letter and one older one, so old and new stay mixed */
    const older = mix(unit.known).find(ok); if (out.length < 3 && older) out.push(older);
    for (const c of mix(keys)) if (out.length < 3 && ok(c)) out.push(c);
    return mix(out);
  }
  async function showSet(k) { set = pick(k); if (keys.length > 3) { set.sort((a, b) => E.AB(a) - E.AB(b)); set.forEach((c, i) => slot[c] = i); } else mix([0, 1, 2]).forEach((s, i) => slot[set[i]] = s);   /* right to left in Alef-Beis order; with only three letters (Unit 1) they mix, so the place doesn't give the answer */ E.sfx.whoosh(); await place(true); }

  const line = q => q.by === 'quiet' ? 'Which letter is quiet? Tap it.' : q.by === 'sound' ? ['Which letter says', S(E.LETTERS[q.k].snd), '? Tap it.'] : 'Tap ' + E.LETTERS[q.k].name + '.';
  const explain = k => E.quiet(k) ? 'That is ' + E.LETTERS[k].name + '. ' + E.LETTERS[k].name + ' is quiet.' : k === 'pei' ? ['That is Pei. It has a dot. Pei says', S('p')] : k === 'fei' ? ['That is Fei. No dot. Fei says', S('f')] : k === 'beis' ? ['That is Beis. It has a dot. Beis says', S('b')] : k === 'veis' ? ['That is Veis. No dot. Veis says', S('v')] : k === 'kaf' ? ['That is Kaf. It has a dot. Kaf says', S('k')] : k === 'chaf' ? ['No dot: Chaf. It says', S('ch')] : k === 'shin' ? ['That is Shin. Dot on the right. Shin says', S('sh')] : k === 'sin' ? ['That is Sin. Dot on the left. Sin says', S('s')] : k === 'tav' ? ['That is Tuf. It has a dot. Tuf says', S('t')] : k === 'sav' ? ['That is Suf. No dot. Suf says', S('s')]
    : ['That is ' + E.LETTERS[k].name + '. ' + E.LETTERS[k].name + ' says', S(E.LETTERS[k].snd)];
  const Qs = (QS[unit.n] || QS[1]).slice();
  /* the older letter he finds hardest (or hasn't seen longest) takes the last older-letter question (RESEARCH.md, gain 5) */
  if (E.reviewPicks && unit.known.length) { const weak = E.reviewPicks(unit.known, 1)[0], at = Qs.map(q => unit.known.includes(q.k) && q.by === 'name').lastIndexOf(true);
    if (weak && at >= 0 && !Qs.some(q => q.k === weak)) Qs[at] = { k: weak, by: 'name' }; }
  async function ask(q) {
    cur = q; await E.say(line(q)); active = true; document.body.dataset.askReady = 1;
    const got = await new Promise(r => resolveQ = r); active = false; delete document.body.dataset.askReady; return got;
  }
  return async () => {
    E.setProgress(Qs.length, 0);
    const demoK = unit.letters[0]; await showSet(demoK);
    rebbe.mood('wave'); await E.say('Show the rebbe what you know!'); rebbe.mood('calm');
    /* show, then try */
    await E.say('Watch me. Tap ' + E.LETTERS[demoK].name + '.'); let [x, y] = E.toScreen(E.worldPos(L[demoK])); E.hand.at(x, y + 20); await E.wait(700); E.hand.hide();
    E.sfx.chime(); E.hop(L[demoK]); await E.say(E.nameLine(demoK));
    await E.say('Now you! Listen, then tap.');
    const queue = Qs.map((q, i) => ({ ...q, i, first: true })); let right = 0, done = 0, inRow = 0;
    while (queue.length) {
      const q = queue.shift(); await showSet(q.k);
      let easy = false; if (inRow >= 2 || (struggled && q.first && done < 3 && !q.again)) { const drop = set.find(k => k !== q.k && k !== PAIR[q.k]); hidden = L[drop]; hidden.visible = false; hiddenPed = peds[slot[drop]]; if (hiddenPed) hiddenPed.visible = false; easy = true; }
      const got = await ask(q);
      if (q.first && !easy && E.noteLetter) E.noteLetter(q.k, got === q.k);   /* remembered per letter, for the spaced review */
      if (got === q.k) { E.joy(E.worldPos(L[got]).add(new THREE.Vector3(0, .3, .6))); E.hop(L[got]); if (q.first && !easy) toBasket(got); rebbe.mood('cheer'); if (q.first && !easy) right++; inRow = 0;
        await E.say(E.quiet(q.k) ? 'Yes! ' + E.LETTERS[q.k].name + '. ' + E.LETTERS[q.k].name + ' is quiet.' : ['Yes!', ...E.nameLine(q.k)]); rebbe.mood('calm'); }
      else { E.sfx.boop(); inRow++; rebbe.mood('think'); await E.shake(L[got], .15); await E.say(explain(got));
        if ((PAIR[got] === q.k || PAIR[q.k] === got || ALSO[got] === q.k) && clue(q.k, got)) {   /* a look-alike mix-up: show and say what to look for */
          [got, q.k].forEach((k, i) => E.pointAt(arrows[i], L[k], k, 1.6, feat(k, i ? got : q.k))); await E.say(clue(q.k, got)); arrows.forEach(a => a.visible = false); }
        glowOn = L[q.k]; E.hop(L[q.k]); await E.say(E.quiet(q.k) ? 'Here is ' + E.LETTERS[q.k].name + ', the quiet one.' : ['Here is ' + E.LETTERS[q.k].name + '.', ...E.nameLine(q.k)]); glowOn = null; rebbe.mood('calm');
        if (q.first) queue.push({ ...q, first: false }); }
      if (hidden) { hidden.visible = true; hidden = null; } if (hiddenPed) { hiddenPed.visible = true; hiddenPed = null; }
      if (q.first && easy && !q.again) queue.push({ ...q, again: true });   /* with only two letters it was practice: it comes back with all three */
      else if (q.first) { done++; E.setProgress(Qs.length, done); }
    }
    E.hop(basket, .35, 450); E.confetti(basket.position.clone().add(new THREE.Vector3(0, 1, .5)), 50);
    const stars = right >= 8 ? 3 : right >= 6 ? 2 : 1; window.__right = right;
    const names = unit.letters.map(k => E.LETTERS[k].name);
    return { stars, line: stars === 3 ? 'Three stars! You know ' + names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] + '!' : stars === 2 ? 'Two stars! You passed Unit ' + unit.n + '!' : null };
  };
}
