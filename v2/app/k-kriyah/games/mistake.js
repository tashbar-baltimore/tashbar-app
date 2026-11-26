/* Game 4: Find the Mistake.
   Skill: checks a letter's name carefully (the unit's letters) and fixes a wrong one.
   "Yaakov says this is a Beis. Is he right?" He taps yes or no. If Yaakov is wrong, he drags the right letter onto the sign.
   A wrong answer is explained kindly (a ring round the dot place, or an orange arrow at the shape difference) and he still does the fix, so the mistake teaches. */
/* each unit: Yaakov's claims (shown letter, what he says), right 3 times and wrong 3 times, and the demo round */
const PLAN = {
  1: { R: [['beis', 'beis'], ['alef', 'beis'], ['veis', 'veis'], ['beis', 'veis'], ['alef', 'alef'], ['veis', 'beis']], demo: ['veis', 'beis', 'Hmm. Watch me. No dot. That is not a Beis!'] },
  3: { R: [['vov', 'vov'], ['vov', 'zayin'], ['ches', 'ches'], ['hei', 'ches'], ['zayin', 'zayin'], ['ches', 'hei']], demo: ['zayin', 'vov', 'Hmm. Watch me. A crown! That is not a Vov.'] },
  4: { R: [['tes', 'tes'], ['kaf', 'chaf'], ['yud', 'yud'], ['beis', 'kaf'], ['chaf', 'chaf'], ['chaf', 'kaf']], demo: ['kaf', 'beis', 'Hmm. Watch me. Round at the bottom. That is not a Beis!'] },
  5: { R: [['lamed', 'lamed'], ['gimmel', 'nun'], ['mem', 'mem'], ['mem', 'tes'], ['nun', 'nun'], ['tes', 'mem']], demo: ['nun', 'gimmel', 'Hmm. Watch me. Flat at the bottom. That is not a Gimmel!'] },
  6: { R: [['samech', 'samech'], ['pei', 'fei'], ['ayin', 'ayin'], ['pei', 'kaf'], ['fei', 'fei'], ['kaf', 'pei']], demo: ['fei', 'pei', 'Hmm. Watch me. No dot. That is not a Pei!'] },
  7: { R: [['reish', 'reish'], ['daled', 'reish'], ['kuf', 'kuf'], ['hei', 'kuf'], ['tzadik', 'tzadik'], ['reish', 'daled']], demo: ['kuf', 'hei', 'Hmm. Watch me. A long leg! That is not a Hei!'] },   /* the demo is not one of his own questions */
  8: { bySound: true, R: [['shin', 'shin'], ['sin', 'shin'], ['tav', 'tav'], ['sav', 'tav'], ['sin', 'sin'], ['shin', 'sin']], demo: ['sav', 'tav', 'Hmm. Watch me. No dot. It does not say t!'] },   /* Unit 8's twist: Yaakov says the SOUND, not the name */
  9: { words: true, R: [['memsofis', 'memsofis', ['shin', 'lamed', 'vov'], 'Shalom'], ['mem', 'memsofis', ['lamed', 'ches'], 'Lechem, bread'], ['nunsofis', 'nunsofis', ['gimmel'], 'Gan, a garden'],
      ['tzadik', 'tzadiksofis', ['alef', 'reish'], 'Eretz, the land'], ['chafsofis', 'chafsofis', ['mem', 'lamed'], 'Melech, a king'], ['fei', 'feisofis', ['tav'], 'Tof, a drum']],
    demo: ['nun', 'nunsofis', ['alef', 'veis'], 'Even, a stone', 'Hmm. Watch me. Nun at the end needs Shabbos clothes!'] },   /* Unit 9's twist: Yaakov writes a word; is its LAST letter right? */
  2: { R: [['gimmel', 'gimmel'], ['daled', 'hei'], ['hei', 'hei'], ['gimmel', 'daled'], ['beis', 'beis'], ['veis', 'beis']],   /* the last two bring back Unit 1 */ demo: ['daled', 'gimmel', 'Hmm. Watch me. No foot. That is not a Gimmel!'] },
};
/* what to look for, in a few words */
const CUE = { beis: 'with the dot', veis: 'with no dot', gimmel: 'with the foot', daled: 'with no little leg', hei: 'with its leg off the roof', vov: 'with no crown', zayin: 'with the crown', ches: 'with its leg on the roof', tes: 'the round one', yud: 'the little one', kaf: 'with the dot', chaf: 'with no dot', lamed: 'the tall one', mem: 'with the opening at the bottom', nun: 'flat at the bottom', samech: 'the round one', ayin: 'with two arms up', pei: 'with the dot', fei: 'with no dot', reish: 'round on top', kuf: 'with the long leg', tzadik: 'with its little arm up', shin: 'with the dot on the right', memsofis: 'square at the bottom', nunsofis: 'with the long leg', chafsofis: 'with the long leg', feisofis: 'with the long leg', tzadiksofis: 'with the long leg', sin: 'with the dot on the left', tav: 'with the dot inside', sav: 'with no dot' };
const LOOK = { beis: 'A dot!', veis: 'No dot.', gimmel: 'Gimmel has a foot.', daled: 'Daled has no little leg.', hei: 'Hei\u2019s little leg doesn\u2019t touch the roof.', vov: 'Vov has no crown.', zayin: 'Zayin has a crown.', ches: 'Ches\u2019s leg touches the roof.', tes: 'Tes is round, with a curl.', yud: 'Yud is the little one.', kaf: 'A dot!', chaf: 'No dot.', lamed: 'Lamed is the tall one.', mem: 'Mem has an opening at the bottom.', nun: 'Nun is flat at the bottom.', samech: 'Samech is round all around.', ayin: 'Ayin has two arms up.', pei: 'A dot!', fei: 'No dot.', reish: 'Reish is round on top.', kuf: 'Kuf has a long leg.', tzadik: 'Tzadik has a little arm on top.', shin: 'Shin has its dot on the right.', sin: 'Sin has its dot on the left.', tav: 'Tuf has a dot inside.', sav: 'No dot. Suf says s.' };
const lookOf = (k, c) => k === 'beis' && c === 'kaf' ? 'Beis has a tail at the bottom.' : k === 'kaf' && c === 'beis' ? 'Kaf is round at the bottom.' : k === 'tes' && c === 'mem' ? 'Tes is closed at the bottom.' : k === 'pei' && c === 'kaf' ? 'Pei has a little tongue inside.' : k === 'kaf' && c === 'pei' ? 'Kaf has no little tongue.' : k === 'daled' && c === 'reish' ? 'Daled has a corner.' : k === 'hei' && c === 'kuf' ? 'Hei has a short leg.' : LOOK[k];
export default function setup(E, { struggled, unit }) {
  const plan = PLAN[unit.n] || PLAN[1];
  const { THREE, S, ICON } = E;
  const yak = E.yaakov(); E.scene.add(yak);
  const board = new THREE.Group(); E.scene.add(board);
  board.add(E.mesh(E.rbox(1.9, 2.0, .16, .1), E.M(0xffd43b, { metalness: .4, roughness: .3 }), 0, 0, 0));
  board.add(E.mesh(E.rbox(1.62, 1.72, .1, .06), E.M(0xfffaf0, { roughness: .4 }), 0, 0, .06));
  board.add(E.mesh(new THREE.CylinderGeometry(.07, .07, 2.4, 10), E.M(0x8a5a3c), 0, -2.1, -.05));
  let shown = null; const ring = E.noticeRing(.36); const tiles = [];
  const glowT = E.glowSprite('#fff7b0', 2.2, 0); E.scene.add(glowT);
  let P = false, help = struggled, mistakes = 0, missed = false, dragT = null, grab = new THREE.Vector3(), fixKey = null, resolveFix = null, busy = false;
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.6, 11); E.camTarget.set(0, 2.2, 0); yak.position.set(-1.6, 0, 1.3); yak.scale.setScalar(.85); board.position.set(.55, 3.1, .4); board.scale.setScalar(.85); }
    else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.6, 0); yak.position.set(-3.3, 0, 1.2); yak.scale.setScalar(1.1); board.position.set(.2, 2.35, .4); board.scale.setScalar(1); }
    tiles.forEach((t, i) => { if (t !== dragT) t.position.copy(tileHome(i)); });
  });
  const tileHome = i => P ? new THREE.Vector3([1.35, -.1, -1.25][i], .5, 2.1) : new THREE.Vector3(2.55 - i * 1.65, .6, 1.9);   /* never in front of the sign's pole */
  E.onFrame(t => {
    if (shown) shown.rotation.y = Math.sin(t * 1.2) * .15;
    tiles.forEach((tl, i) => { if (tl !== dragT && tl.visible && !tl.userData.busy) { tl.position.y = tileHome(i).y + Math.sin(t * 2 + i) * .05; } });
    const g = tiles.find(x => x.visible && x.userData.key === fixKey); glowT.material.opacity = help && g && !dragT ? .6 + Math.sin(t * 5) * .3 : 0; if (g) glowT.position.copy(g.position).add(new THREE.Vector3(0, 0, -.3));
  });
  /* the yes / no buttons (big, glossy, the same place every time) */
  const bar = document.createElement('div'); bar.className = 'ui'; bar.style.cssText = 'left:50%;bottom:30px;transform:translateX(-50%);display:none;gap:40px';
  bar.innerHTML = `<button class="btn green" id="yes" aria-label="Yes, he is right" style="width:120px;height:120px">${ICON.yes.replace('<svg', '<svg style="width:66px;height:66px"')}</button><button class="btn orange" id="no" aria-label="No, he made a mistake" style="width:120px;height:120px">${ICON.no.replace('<svg', '<svg style="width:60px;height:60px"')}</button>`;
  document.body.appendChild(bar);
  const ask = () => new Promise(r => { bar.style.display = 'flex'; document.body.dataset.askReady = 1; const done = v => { bar.style.display = 'none'; delete document.body.dataset.askReady; E.sfx.pop(); r(v); }; E.$('#yes').onclick = () => done(true); E.$('#no').onclick = () => done(false); });
  const btnXY = id => { const r = E.$(id).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; };
  window.__info = () => ({ ask: !!document.body.dataset.askReady, fix: fixKey, shownKey: shown && shown.userData.key, claim: curClaim, yes: bar.style.display !== 'none' ? btnXY('#yes') : null, no: bar.style.display !== 'none' ? btnXY('#no') : null,
    tiles: tiles.filter(t => t.visible).map(t => ({ k: t.userData.key, xy: E.toScreen(E.worldPos(t)) })), board: E.toScreen(E.worldPos(board)) });
  let curClaim = null;

  /* Unit 9: a word on a wide sign; the letter in question is the last one (the left end) */
  let prefix = null, prefixL = [];
  const wideBack = E.mesh(E.rbox(4.2, 2.0, .16, .1), E.M(0xffd43b, { metalness: .4, roughness: .3 }), 0, 0, 0), wideFace = E.mesh(E.rbox(3.92, 1.72, .1, .06), E.M(0xfffaf0, { roughness: .4 }), 0, 0, .06);
  wideBack.visible = wideFace.visible = false; board.add(wideBack, wideFace);
  function showWord(k) { prefixL.forEach(l => board.remove(l)); prefixL = []; const all = [...prefix, k], n = all.length, x = i => ((n - 1) / 2 - i) * 1.0;
    board.children.slice(0, 2).forEach(m => m.visible = false); wideBack.visible = wideFace.visible = true;
    prefix.forEach((p, i) => { const l = E.letter(p, .95); l.position.set(x(i), l.userData.below * .5, .3); if (l.userData.below) l.scale.setScalar(.85); board.add(l); prefixL.push(l); });
    if (shown) board.remove(shown); shown = E.letter(k, .95); if (shown.userData.below) shown.scale.setScalar(.85); shown.position.set(x(n - 1), shown.userData.below * .5, .3); board.add(shown); shown.add(ring); ring.visible = false; return E.popIn(shown, shown.scale.x); }
  function showLetter(k) { if (plan.words && prefix) return showWord(k); if (shown) board.remove(shown); shown = E.letter(k, 1.3); if (shown.userData.below) { shown.scale.setScalar(.8); shown.position.set(0, shown.userData.below * .8, .3); } else shown.position.set(0, 0, .3);   /* Kuf smaller and higher, so its leg stays on the sign */ board.add(shown); shown.add(ring); ring.visible = false; return E.popIn(shown); }
  /* the ring circles the dot place (Beis/Veis, Kaf/Chaf); an orange arrow points at any other shape difference */
  const arrow = E.arrow3d(.4);
  const mark = k => { if (plan.words) { arrow.setDir('down'); arrow.position.set(0, .75, .5); if (arrow.parent !== shown) shown.add(arrow); arrow.visible = true; return true; } const s = shown.userData; if (s.dotHome && (!curClaim || E.sameShape(k, curClaim))) { ring.position.copy(s.dotHome).setZ(.6); ring.visible = true; return true; } return E.pointAt(arrow, shown, k, 1.3, curClaim ? E.featFor(k, curClaim) : undefined); };   /* a ring round the dot place (same shape, dot or no dot); otherwise an arrow at the shape difference */
  const unmark = () => { ring.visible = false; arrow.visible = false; };
  /* why the letter is not what Yaakov said, in a few words */
  const why = (k, c) => plan.words ? 'Look again. It is the end. ' + E.LETTERS[k].name + ' needs Shabbos clothes!' : plan.bySound ? ['Look again. This is ' + E.LETTERS[k].name + '. It says', S(E.LETTERS[k].snd), ', not', S(E.LETTERS[c].snd), '.'] : k === 'alef' ? 'Look again. This is Alef. Beis and Veis look like a house.' : c === 'alef' ? 'Look again. This looks like a house. It is ' + E.LETTERS[k].name + '.'
    : k === 'beis' && c === 'veis' ? 'Look again. A dot! This is Beis, not Veis.' : k === 'veis' ? 'Look again. No dot. This is Veis, not Beis.'
    : 'Look again. ' + (k === 'daled' && c === 'gimmel' ? 'Daled has no foot.' : lookOf(k, c)) + ' This is ' + E.LETTERS[k].name + '.';
  const an = k => E.an(k);
  function makeTiles() { tiles.forEach(t => E.scene.remove(t)); tiles.length = 0; [...new Set([fixKey, shown.userData.key, ...unit.letters])].slice(0, 3).sort((a, b) => E.AB(a) - E.AB(b)).forEach((k, i) => { const t = E.letter(k, P ? .8 : .95); if (t.userData.below) t.children.forEach(ch => ch.position.y += t.userData.below);   /* Kuf's long leg stays above the floor */ t.position.copy(tileHome(i)); E.scene.add(t); tiles.push(t); E.popIn(t); }); }
  const onBoard = () => { const [bx, by] = E.toScreen(E.worldPos(board)), [tx, ty] = E.toScreen(dragT.position); return Math.hypot(bx - tx, by - ty) < Math.min(innerWidth, innerHeight) * .16; };
  E.onPointer('down', e => { if (!fixKey || busy) return; const t = E.pickFrom(e, tiles); if (t) { dragT = t; const p = E.planePoint(e, t.position.z); if (p) grab.copy(t.position).sub(p); t.scale.setScalar(1.12); } });
  E.onPointer('move', e => { if (!dragT) return; const p = E.planePoint(e, dragT.position.z); if (p) dragT.position.copy(p.add(grab)); });
  E.onPointer('up', () => { if (!dragT) return; const over = onBoard(), t = dragT; dragT = null; t.scale.setScalar(1); placeTile(t, over); });
  async function placeTile(t, over) {
    const i = tiles.indexOf(t), home = tileHome(i), p0 = t.position.clone();
    if (!over) { t.userData.busy = true; await E.tween(300, k => t.position.lerpVectors(p0, home, k), E.ease.out); t.userData.busy = false; return; }
    if (t.userData.key === fixKey) {
      busy = true; const target = E.worldPos(board).add(new THREE.Vector3(0, 0, .5)); await E.tween(350, k => t.position.lerpVectors(p0, target, k));
      t.visible = false; const old = shown; const op = old.position.clone(); await E.tween(350, k => { old.position.set(op.x + k * 2, op.y - k * 2.5, op.z); old.rotation.z = k * 1.5; });
      await showLetter(fixKey); E.joy(E.worldPos(board).add(new THREE.Vector3(0, 0, .8)), true); yak.mood('cheer'); E.hop(yak, .4);
      const r = resolveFix; resolveFix = null; busy = false; r && r();
    } else {
      E.sfx.boop(); if (!missed) mistakes++; missed = true; t.userData.busy = true; await E.tween(350, k => t.position.lerpVectors(p0, home, k), E.ease.out); await E.shake(t, .15); t.userData.busy = false;
      const has = k => tiles.some(x => x.userData.key === k), cue = fixKey === 'kaf' && has('beis') ? 'round at the bottom' : fixKey === 'kaf' && has('pei') ? 'with no little tongue' : fixKey === 'pei' && has('kaf') ? 'with the little tongue inside' : fixKey === 'daled' && has('reish') ? 'with the corner' : fixKey === 'hei' && has('kuf') ? 'with the short leg' : CUE[fixKey];   /* Beis and Pei have a dot too */
      await E.say(plan.bySound ? ['That says', S(E.LETTERS[t.userData.key].snd), '. Find the one that says', S(E.LETTERS[fixKey].snd), '!'] : 'That is ' + E.LETTERS[t.userData.key].name + '. Find ' + E.LETTERS[fixKey].name + (cue ? ', ' + cue : '') + '!');
      help = true;
    }
  }
  async function fix(k, demo) {
    fixKey = k; if (P) yak.visible = false;   /* on a phone, Yaakov steps out of the way of the letters */
    makeTiles(); await E.wait(450);
    await E.say(plan.bySound ? ['Yaakov said', S(E.LETTERS[k].snd), '. Drag the letter that says', S(E.LETTERS[k].snd), '!'] : ['Yaakov wanted ' + an(k) + '. Drag', E.LETTERS[k].name, 'onto the sign!']);
    const done = new Promise(r => resolveFix = r);
    if (demo) { busy = false; const t = tiles.find(x => x.userData.key === k); let [x, y] = E.toScreen(E.worldPos(t)); E.hand.at(x, y); await E.wait(350); dragT = t;
      const p0 = t.position.clone(), p1 = E.worldPos(board).add(new THREE.Vector3(0, -.2, 1.5)); await E.tween(1100, q => { t.position.lerpVectors(p0, p1, q); const [a, b] = E.toScreen(t.position); E.hand.at(a, b); }); dragT = null; E.hand.hide(); placeTile(t, true); }
    else document.body.dataset.fixReady = 1;
    await done; delete document.body.dataset.fixReady; fixKey = null; yak.visible = true;
    tiles.forEach(t => t.visible && E.popOut(t));
    await E.say(E.quiet(k) ? 'Now Yaakov has his ' + E.LETTERS[k].name + '! Thank you!' : E.LETTERS[k].snd === 'ch' ? 'Now Yaakov has his ' + E.LETTERS[k].name + '! Thank you!' : ['Now Yaakov has his ' + E.LETTERS[k].name + '!', ...E.nameLine(k)]);   /* 12 words or fewer */
    yak.mood('calm');
  }
  async function roundOf(shownKey, claim, pre, said, demo = false) {
    if (plan.words) prefix = pre;
    missed = false; curClaim = claim; yak.mood('calm'); await showLetter(shownKey); yak.mood('wave'); E.hop(yak, .25);
    if (plan.words) await E.say(['Yaakov wrote ' + said + '.']);
    await E.say(plan.words ? 'Is the last letter right?' : plan.bySound ? ['Yaakov says this letter says', S(E.LETTERS[claim].snd), '. Is he right?'] : 'Yaakov says this is ' + an(claim) + '. Is he right?'); yak.mood('calm');
    if (help && mark(shownKey)) { await E.say(plan.words ? 'Look at the end of the word!' : ring.visible ? 'Look at the dot place!' : 'Look carefully here!'); unmark(); }
    const right = shownKey === claim; let saysRight;
    if (demo) { mark(shownKey); await E.say(plan.demo[plan.words ? 4 : 2]); unmark(); bar.style.display = 'flex'; const [nx, ny] = btnXY('#no'); E.hand.at(nx - 20, ny - 10); await E.wait(700); bar.style.display = 'none'; E.hand.hide(); E.sfx.pop(); saysRight = false; }
    else saysRight = await ask();
    if (saysRight === right) {
      if (right) { yak.mood('cheer'); E.joy(E.worldPos(board).add(new THREE.Vector3(0, 0, .8))); await E.say(E.LETTERS[shownKey].snd === 'ch' ? 'Yes! Yaakov is right. It is ' + E.LETTERS[shownKey].name + '.' : ['Yes! Yaakov is right.', ...E.nameLine(shownKey)]);   /* 12 words or fewer */ yak.mood('calm'); }
      else { E.sfx.chime(); await E.say(['Yes! Yaakov made a mistake. That is', E.LETTERS[shownKey].name + '.']); await fix(claim, demo); }
    } else {
      E.sfx.boop(); if (!demo && !missed) mistakes++; missed = true; yak.mood('think'); help = help || mistakes >= 2;
      mark(shownKey);
      if (right) { await E.say(plan.words ? 'Look again. It is the end, with ' + E.LETTERS[shownKey].name + '.' : plan.bySound ? ['Look again. It is ' + E.LETTERS[shownKey].name + '. It says', S(E.LETTERS[shownKey].snd), '.'] : shownKey === 'alef' ? 'Look again. It is Alef, not a house shape.' : 'Look again. ' + lookOf(shownKey, curClaim) + ' It is ' + E.LETTERS[shownKey].name + '.'); unmark(); yak.mood('calm');
        await E.say('So is Yaakov right? Try again.');               /* he answers again (it doesn't count) */
        if (await ask()) { E.sfx.chime(); yak.mood('cheer'); E.joy(E.worldPos(board).add(new THREE.Vector3(0, 0, .8))); await E.say('Yes! Yaakov is right.'); }
        else await E.say('Yaakov is right. It is ' + E.LETTERS[shownKey].name + '.');
        yak.mood('calm'); }
      else { await E.say(why(shownKey, claim)); unmark(); await fix(claim, false); }
    }
  }
  return async () => {
    const R = plan.R;   /* Yaakov is right 3 times and wrong 3 times */
    E.setProgress(R.length, 0);
    await E.say('This is Yaakov. Sometimes he makes a mistake.');
    await E.say('Watch me find his mistake.');
    await roundOf(plan.demo[0], plan.demo[1], plan.demo[2], plan.demo[3], true);
    await E.say('Now you! Is Yaakov right? Tap yes or no.');
    mistakes = 0;
    for (let i = 0; i < R.length; i++) { const [a, b, c, d] = R[i]; await roundOf(a, b, c, d); E.setProgress(R.length, i + 1); }
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;   /* Yaakov is right half the time: always tapping one button makes 3 mistakes and can't pass */
    return { stars, line: stars >= 2 ? 'You found all of Yaakov’s mistakes!' : null };
  };
}
