/* A unit's mastery check: "hear it, tap it" (tap-to-check is allowed for checks).
   Skill check: names and sounds every letter so far, mixed; Beis is always asked beside Veis. 9 questions; 2 of 3 stars passes.
   Three letters stand on pedestals for each question (the answer and two others from everything learned so far).
   A wrong tap is explained kindly (the right letter glows and hops), and that question comes back at the end (not counted again).
   If he misses two in a row, the next question shows only two letters: that one is practice, and comes back with all three. */
const N = k => ({ k, by: 'name' }), SND = k => ({ k, by: 'sound' });
const QS = {
  1: [N('beis'), N('alef'), N('veis'), SND('beis'), SND('veis'), { k: 'alef', by: 'quiet' }, N('veis'), N('beis'), SND('veis')],
  2: [N('gimmel'), SND('daled'), N('hei'), SND('gimmel'), SND('hei'), N('daled'), SND('beis'), { k: 'alef', by: 'quiet' }, N('veis')],
};
export default function setup(E, { struggled, unit }) {
  const { THREE, S } = E;
  const rebbe = E.rebbe(); E.scene.add(rebbe);
  const keys = [...unit.known, ...unit.letters], L = {}, peds = [];
  const pedM = E.M(0xffffff, { roughness: .25, clearcoat: .8 }), pedTop = [E.M(0xff7aa8, { roughness: .25, clearcoat: 1 }), E.M(0x46c3ff, { roughness: .25, clearcoat: 1 }), E.M(0xffcf3a, { roughness: .25, clearcoat: 1 })];
  for (let i = 0; i < 3; i++) { const p = new THREE.Group(); p.add(E.mesh(new THREE.CylinderGeometry(.75, .85, .5, 32), pedM, 0, .25, 0)); p.add(E.mesh(new THREE.CylinderGeometry(.78, .78, .12, 32), pedTop[i], 0, .55, 0)); E.scene.add(p); peds.push(p); }
  keys.forEach(k => { L[k] = E.letter(k, 1.6); E.scene.add(L[k]); L[k].visible = false; });
  const LS = () => E.portrait ? .62 : .86;   /* letter size: small enough that wide letters (Mem, Nun) never touch */
  const glow = E.glowSprite('#fff7b0', 3, 0); E.scene.add(glow);
  let set = keys.slice(0, 3), slot = {}, gap = 2.3, active = false, glowOn = null, resolveQ = null, hidden = null;
  set.forEach((k, i) => slot[k] = i);
  const slotPos = i => new THREE.Vector3((1 - i) * gap, 0, .6);   /* right to left */
  E.onLayout(p => {
    gap = p ? 1.55 : 2.55; keys.forEach(k => L[k].scale.setScalar(LS()));
    if (p) { E.camBase.set(0, 2.6, 10.2); E.camTarget.set(0, 1.9, 0); rebbe.visible = false;   /* a phone has no room for him beside the letters */ peds.forEach(x => x.scale.setScalar(.62)); }
    else { E.camBase.set(0, 2.4, 9.5); E.camTarget.set(0, 1.4, 0); rebbe.visible = true; rebbe.position.set(-4.3, 0, .2); rebbe.scale.setScalar(1.45); peds.forEach(x => x.scale.setScalar(1)); }
    place(false);
  });
  function place(animate = true) {
    peds.forEach((p, i) => p.position.copy(slotPos(i)));
    const ps = [];
    keys.forEach(k => { const l = L[k]; if (!set.includes(k)) { l.visible = false; l.userData.base = null; return; }
      const to = slotPos(slot[k]).add(new THREE.Vector3(0, E.portrait ? 1.05 : 1.75, 0));
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
  const PAIR = { beis: 'veis', veis: 'beis' };
  const mix = a => a.slice().sort(() => Math.random() - .5);
  function pick(k) {
    if (keys.length <= 3) return mix(keys);
    const out = [k]; if (PAIR[k]) out.push(PAIR[k]);
    const newer = mix(unit.letters).find(c => !out.includes(c)); if (out.length < 3 && newer) out.push(newer);   /* one new letter and one older one, so old and new stay mixed */
    const older = mix(unit.known).find(c => !out.includes(c)); if (out.length < 3 && older) out.push(older);
    for (const c of mix(keys)) if (out.length < 3 && !out.includes(c)) out.push(c);
    return mix(out);
  }
  async function showSet(k) { set = pick(k); if (keys.length > 3) { set.sort((a, b) => E.AB(a) - E.AB(b)); set.forEach((c, i) => slot[c] = i); } else mix([0, 1, 2]).forEach((s, i) => slot[set[i]] = s);   /* right to left in Alef-Beis order; with only three letters (Unit 1) they mix, so the place doesn't give the answer */ E.sfx.whoosh(); await place(true); }

  const line = q => q.by === 'quiet' ? 'Which letter is quiet? Tap it.' : q.by === 'sound' ? ['Which letter says', S(E.LETTERS[q.k].snd), '? Tap it.'] : 'Tap ' + E.LETTERS[q.k].name + '.';
  const explain = k => k === 'alef' ? 'That is Alef. Alef is quiet.' : k === 'beis' ? ['That is Beis. It has a dot. Beis says', S('b')] : k === 'veis' ? ['That is Veis. No dot. Veis says', S('v')]
    : ['That is ' + E.LETTERS[k].name + '. ' + E.LETTERS[k].name + ' says', S(E.LETTERS[k].snd)];
  const Qs = (QS[unit.n] || QS[1]).slice();
  /* the older letter he finds hardest (or hasn't seen longest) takes the last older-letter question (RESEARCH.md, gain 5) */
  if (E.reviewPicks && unit.known.length) { const weak = E.reviewPicks(unit.known, 1)[0], at = Qs.map(q => unit.known.includes(q.k) && q.by === 'name').lastIndexOf(true);
    if (weak && at >= 0 && !Qs.some(q => q.k === weak)) Qs[at] = { k: weak, by: 'name' }; }
  /* two more older letters, from across all the earlier units, so the check covers everything so far (reviewer: too few older letters) */
  if (E.reviewPicks && unit.known.length > 3) E.reviewPicks(unit.known, 2, Qs.map(q => q.k)).forEach((k, i) => Qs.splice(3 + i * 4, 0, { k, by: 'name' }));
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
      let easy = false; if (inRow >= 2 || (struggled && q.first && done < 3 && !q.again)) { const drop = set.find(k => k !== q.k && k !== PAIR[q.k]); hidden = L[drop]; hidden.visible = false; easy = true; }
      const got = await ask(q);
      if (q.first && !easy && E.noteLetter) E.noteLetter(q.k, got === q.k);   /* remembered per letter, for the spaced review */
      if (got === q.k) { E.joy(E.worldPos(L[got]).add(new THREE.Vector3(0, .3, .6))); E.hop(L[got]); rebbe.mood('cheer'); if (q.first && !easy) right++; inRow = 0;
        await E.say(q.k === 'alef' ? 'Yes! Alef. Alef is quiet.' : ['Yes!', ...E.nameLine(q.k)]); rebbe.mood('calm'); }
      else { E.sfx.boop(); inRow++; rebbe.mood('think'); await E.shake(L[got], .15); await E.say(explain(got));
        glowOn = L[q.k]; E.hop(L[q.k]); await E.say(q.k === 'alef' ? 'Here is Alef, the quiet one.' : ['Here is ' + E.LETTERS[q.k].name + '.', ...E.nameLine(q.k)]); glowOn = null; rebbe.mood('calm');
        if (q.first) queue.push({ ...q, first: false }); }
      if (hidden) { hidden.visible = true; hidden = null; }
      if (q.first && easy && !q.again) queue.push({ ...q, again: true });   /* with only two letters it was practice: it comes back with all three */
      else if (q.first) { done++; E.setProgress(Qs.length, done); }
    }
    const stars = right >= Qs.length - 1 ? 3 : right >= Math.ceil(Qs.length * 2 / 3) ? 2 : 1;   /* 8 of 9 / 6 of 9, the same share with more questions */ window.__right = right;
    const names = unit.letters.map(k => E.LETTERS[k].name);
    return { stars, line: stars === 3 ? 'Three stars! You know ' + names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] + '!' : stars === 2 ? 'Two stars! You passed Unit ' + unit.n + '!' : null };
  };
}
