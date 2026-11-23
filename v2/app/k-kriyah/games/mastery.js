/* Unit 1 mastery check: "hear it, tap it" (tap-to-check is allowed for checks).
   Skill check: names and sounds Alef, Beis and Veis, and tells Beis from Veis. 9 questions, mixed; 2 of 3 stars passes.
   A wrong tap is explained kindly (the right letter glows and hops), and that question comes back at the end (not counted again).
   If he misses two in a row, the next question shows only two letters. */
export default function setup(E, { struggled }) {
  const { THREE, S } = E;
  const rebbe = E.rebbe(); E.scene.add(rebbe);
  const keys = ['alef', 'beis', 'veis'];
  const L = {}, peds = [];
  const pedM = E.M(0xffffff, { roughness: .25, clearcoat: .8 }), pedTop = [E.M(0xff7aa8, { roughness: .25, clearcoat: 1 }), E.M(0x46c3ff, { roughness: .25, clearcoat: 1 }), E.M(0xffcf3a, { roughness: .25, clearcoat: 1 })];
  for (let i = 0; i < 3; i++) { const p = new THREE.Group(); p.add(E.mesh(new THREE.CylinderGeometry(.75, .85, .5, 32), pedM, 0, .25, 0)); p.add(E.mesh(new THREE.CylinderGeometry(.78, .78, .12, 32), pedTop[i], 0, .55, 0)); E.scene.add(p); peds.push(p); }
  keys.forEach(k => { L[k] = E.letter(k, 1.6); E.scene.add(L[k]); });
  const glow = E.glowSprite('#fff7b0', 3, 0); E.scene.add(glow);
  let slot = { alef: 0, beis: 1, veis: 2 }, gap = 2.3, active = false, glowOn = null, resolveQ = null, hidden = null;
  const slotPos = i => new THREE.Vector3((1 - i) * gap, 0, .6);   /* right to left */
  E.onLayout(p => {
    gap = p ? 1.55 : 2.3;
    if (p) { E.camBase.set(0, 2.5, 10.8); E.camTarget.set(0, 1.9, 0); rebbe.position.set(-1.2, 0, -1.6); rebbe.scale.setScalar(1.2); peds.forEach(x => x.scale.setScalar(.85)); }
    else { E.camBase.set(0, 2.4, 9.5); E.camTarget.set(0, 1.4, 0); rebbe.position.set(-4.3, 0, .2); rebbe.scale.setScalar(1.45); peds.forEach(x => x.scale.setScalar(1)); }
    place(false);
  });
  function place(animate = true) {
    peds.forEach((p, i) => p.position.copy(slotPos(i)));
    const ps = [];
    keys.forEach(k => { const to = slotPos(slot[k]).add(new THREE.Vector3(0, E.portrait ? 1.6 : 1.75, 0)); const l = L[k];
      if (!animate) { l.position.copy(to); l.userData.base = to.clone(); return; }
      const from = l.position.clone(); l.userData.base = null; ps.push(E.tween(600, q => { l.position.lerpVectors(from, to, q); l.position.y += Math.sin(q * Math.PI) * 1.0; }).then(() => { l.userData.base = to.clone(); })); });
    return Promise.all(ps);
  }
  E.onFrame(t => { keys.forEach((k, i) => { const l = L[k]; if (l.userData.base) { l.position.y = l.userData.base.y + Math.sin(t * 2 + i * 2) * .06; l.rotation.y = Math.sin(t * 1.1 + i) * .25; } });
    if (glowOn) { glow.position.copy(glowOn.position).add(new THREE.Vector3(0, 0, -.4)); glow.material.opacity = .6 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0; });
  window.__info = () => ({ active, want: cur && cur.k, letters: Object.fromEntries(keys.filter(k => L[k].visible).map(k => [k, E.toScreen(E.worldPos(L[k]))])) });
  let cur = null;
  E.onPointer('down', e => { if (!active) return; const l = E.pickFrom(e, keys.map(k => L[k]).filter(l => l.visible)); if (l && resolveQ) { const r = resolveQ; resolveQ = null; r(l.userData.key); } });
  const shuffle = async () => { const order = keys.slice().sort(() => Math.random() - .5); keys.forEach((k, i) => slot[k] = order.indexOf(k)); E.sfx.whoosh(); await place(true); };

  /* the questions: by name and by sound (Alef is "the quiet letter") */
  const Qs = [
    { k: 'beis', line: 'Tap Beis.' }, { k: 'alef', line: 'Tap Alef.' }, { k: 'veis', line: 'Tap Veis.' },
    { k: 'beis', line: ['Which letter says', S('b'), '? Tap it.'] }, { k: 'veis', line: ['Which letter says', S('v'), '? Tap it.'] },
    { k: 'alef', line: 'Which letter is quiet? Tap it.' }, { k: 'veis', line: 'Tap Veis.' }, { k: 'beis', line: 'Tap Beis.' },
    { k: 'veis', line: ['Which letter says', S('v'), '? Tap it.'] },
  ];
  const explain = { alef: 'That is Alef. Alef is quiet.', beis: ['That is Beis. It has a dot. Beis says', S('b')], veis: ['That is Veis. No dot. Veis says', S('v')] };
  async function ask(q) {
    cur = q; await E.say(q.line); active = true; document.body.dataset.askReady = 1;
    const got = await new Promise(r => resolveQ = r); active = false; delete document.body.dataset.askReady; return got;
  }
  return async () => {
    E.setProgress(Qs.length, 0); place(false);
    rebbe.mood('wave'); await E.say('Show the rebbe what you know!'); rebbe.mood('calm');
    /* show, then try */
    await E.say('Watch me. Tap Alef.'); let [x, y] = E.toScreen(E.worldPos(L.alef)); E.hand.at(x, y + 20); await E.wait(700); E.hand.hide();
    E.sfx.chime(); E.hop(L.alef); await E.say('Alef. Alef is quiet.');
    await E.say('Now you! Listen, then tap.');
    const queue = Qs.map((q, i) => ({ ...q, i, first: true })); let right = 0, done = 0, inRow = 0;
    while (queue.length) {
      const q = queue.shift(); await shuffle();
      if (inRow >= 2 || (struggled && q.first && done < 3)) { const drop = q.k === 'alef' ? 'veis' : 'alef'; hidden = L[drop]; hidden.visible = false; }
      const got = await ask(q);
      if (got === q.k) { E.joy(E.worldPos(L[got]).add(new THREE.Vector3(0, .3, .6))); E.hop(L[got]); rebbe.mood('cheer'); if (q.first) right++; inRow = 0;
        await E.say(q.k === 'alef' ? 'Yes! Alef. Alef is quiet.' : ['Yes!', ...E.nameLine(q.k)]); rebbe.mood('calm'); }
      else { E.sfx.boop(); inRow++; rebbe.mood('think'); await E.shake(L[got], .15); await E.say(explain[got]);
        glowOn = L[q.k]; E.hop(L[q.k]); await E.say(q.k === 'alef' ? 'Here is Alef, the quiet one.' : ['Here is ' + E.LETTERS[q.k].name + '.', ...E.nameLine(q.k)]); glowOn = null; rebbe.mood('calm');
        if (q.first) queue.push({ ...q, first: false }); }
      if (hidden) { hidden.visible = true; hidden = null; }
      if (q.first) { done++; E.setProgress(Qs.length, done); }
    }
    const stars = right >= 8 ? 3 : right >= 6 ? 2 : 1; window.__right = right;
    return { stars, line: stars === 3 ? 'Three stars! You know Alef, Beis and Veis!' : stars === 2 ? 'Two stars! You passed Unit 1!' : null };
  };
}
