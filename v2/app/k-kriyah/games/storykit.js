/* A unit's opener story from a short script (Units 2 and up): everyday pictures turn into the new letters.
   Each step: a picture pops up, the boy hears what it is, it turns into its letter, he hears the letter's name and sound and taps it.
   A dot letter can come from the one before it losing its dot (Chaf from Kaf). Then the look-alikes stand side by side
   (an orange arrow at a shape difference, a ring only at the dot place), every letter so far is chanted right to left, and he taps each new one.
   Every spoken line is 12 words or fewer. */
import { makePictures, hasPic } from '../pictures.js';
export function makeStory(E, unit, script) {
  const { THREE, S } = E;
  const PIC = makePictures(E);
  const boy = script.boy ? script.boy(E) : E.unitBoy(unit.n); E.scene.add(boy);
  const grown = script.grown ? script.grown(E) : null; if (grown) E.scene.add(grown);
  const props = new THREE.Group(); E.scene.add(props); if (script.scene && !E.backdrop) script.scene(E, props); if (script.extra) script.extra(E, props);   /* extra things that belong even on a painted backdrop (Unit 9: the Shabbos table) */   /* a painted backdrop already has the zoo, garden, park or picnic */
  const L = {}; unit.letters.forEach(k => { L[k] = E.letter(k, 2.5); L[k].visible = false; E.scene.add(L[k]); });
  const row = [], glow = E.glowSprite('#ffffff', 6, 0); E.scene.add(glow);
  const arrow = E.arrow3d ? E.arrow3d(.45) : new THREE.Object3D(), ring = E.noticeRing(.32);
  let P = false; const floaters = new Set(), steps = script.steps.length + 2;
  E.onLayout(p => { P = p;
    if (p) { E.camBase.set(0, 2.4, 11.5); E.camTarget.set(0, 1.9, 0); } else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.4, 0); }
    if (script.layout) script.layout(E, props, p);
  });
  E.onFrame(t => floaters.forEach(l => { if (!l.userData.base) return; if (E.CALM) { l.rotation.y = 0; return; }   /* calm: still, face-on */ l.position.y = l.userData.base.y + Math.sin(t * 2 + l.position.x) * .07; l.rotation.y = Math.sin(t * .9 + l.position.x) * .3; }));
  const float = (l, on = true) => { if (on) { l.userData.base = l.position.clone(); floaters.add(l); } else floaters.delete(l); };
  const showHand = obj => { if (E.CALM) return E.handBelow(obj, true); const [x, y] = E.toScreen(E.worldPos(obj).add(new THREE.Vector3(.5, -.6, .6))); E.hand.at(x, y, true); };
  async function tapIt(l, line) {
    showHand(l); document.body.dataset.tapReady = l.userData.key;
    await E.waitTap([l]); delete document.body.dataset.tapReady; E.hand.hide();
    E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .2, .6)), 26, 1.2);
    float(l, false); const r0 = l.rotation.y, y0 = l.position.y; await E.tween(800, k => { if (!E.CALM) l.rotation.y = r0 + Math.sin(k * Math.PI * 2) * .5; l.position.y = y0 + Math.sin(k * Math.PI) * .6; }, E.ease.out);   /* a happy wobble, never turned round to show the letter backwards */ l.position.y = y0; float(l);
    await E.say(line);
  }
  window.__info = () => Object.assign({ tap: document.body.dataset.tapReady || null }, Object.fromEntries(Object.entries(L).map(([k, l]) => [k, E.toScreen(E.worldPos(l))])),
    Object.fromEntries(row.map(l => ['row-' + l.userData.key, E.toScreen(E.worldPos(l))])));
  async function morph(picObj, k) {
    const from = E.worldPos(picObj), s0 = picObj.scale.x, l = L[k]; E.sfx.sparkle(); E.sfx.whoosh(); E.sparkle(from.clone().add(new THREE.Vector3(0, 0, .5)), 36, 1.4);
    l.position.set(P ? .35 : -.3, P ? 1.6 : 1.45, .6); l.visible = true; l.scale.setScalar(.01); glow.position.set(P ? .35 : -.3, 1.6, -.3);
    await E.tween(1300, q => { picObj.scale.setScalar(Math.max(.001, s0 * (1 - q))); picObj.rotation.y = q * 3; l.scale.setScalar(.01 + q * .99); l.rotation.y = (1 - q) * Math.PI * 2; glow.material.opacity = q * .8; });
    picObj.visible = false; float(l);
  }
  async function letterDone(k) {   /* the new letters wait in a row along the top, right to left */
    const l = L[k]; float(l, false); const n = unit.letters.length, i = unit.letters.indexOf(k), gap = P ? (n > 4 ? .8 : n > 3 ? 1.05 : 1.45) : (n > 4 ? 1.85 : n > 3 ? 2.3 : 2.7);
    const p0 = l.position.clone(), to = new THREE.Vector3(gap * ((n - 1) / 2 - i) + (!P && n % 2 ? gap / 2 : 0), (P ? (E.CALM ? 4.2 : 4.4) + l.userData.below * .28 : 3.3), -.5);   /* on a Chromebook no waiting letter sits right above the big one */   /* a long leg (Kuf) waits higher, never touching the big letter */
    await E.tween(600, q => { l.position.lerpVectors(p0, to, q); l.scale.setScalar(1 - q * (1 - (P ? (E.CALM ? .36 : .28) : (E.CALM ? .48 : .42))));   /* calm: waiting letters big enough to read (reviewer: 25-40 px) */ glow.material.opacity = .8 * (1 - q); }); float(l);
  }
  /* a picture that stays (the Torah is never spun or shrunk away): it steps back beside the grown-up, and its letter rises out of a soft light */
  const kept = [];
  async function rise(picObj, k) {
    const from = E.worldPos(picObj), l = L[k], to = new THREE.Vector3(P ? .35 : -.3, P ? 1.6 : 1.45, .6); E.sfx.sparkle(); E.sparkle(from.clone().add(new THREE.Vector3(0, .4, .5)), 30, 1.2);
    const held = () => { const w = grown || boy; return w.position.clone().add(new THREE.Vector3(.45 * w.scale.x, 1.05 * w.scale.x, .35)); };   /* in the grown-up's arms */
    const p0 = picObj.position.clone(), home = held(); kept.push(picObj); const s0 = picObj.scale.x;
    l.position.copy(from); l.visible = true; l.scale.setScalar(.01); glow.position.set(to.x, 1.6, -.3);
    await E.tween(1300, q => { picObj.position.lerpVectors(p0, home, q); l.position.lerpVectors(from, to, q); l.scale.setScalar(.01 + q * .99); glow.material.opacity = q * .8; });
    float(l); const w = grown || boy; w.mood('wave');
    E.onFrame(t => { if (!picObj.visible || picObj.userData.fading) return; picObj.position.copy(held()).add(new THREE.Vector3(Math.sin(t * 2.2) * .08, Math.abs(Math.sin(t * 2.2)) * .1, 0)); picObj.rotation.z = Math.sin(t * 2.2) * .12; });   /* a gentle dance */
  }
  /* a kept picture (the Torah) is never shrunk away: it fades softly */
  async function fade(o) { o.userData.fading = true; const mats = []; o.traverse(m => { if (m.material) { m.material = m.material.clone(); m.material.transparent = true; mats.push(m.material); } });
    await E.tween(450, q => mats.forEach(m => m.opacity = 1 - q)); o.visible = false; }
  const toCentre = async o => { const p0 = o.position.clone(); await E.tween(500, q => o.position.lerpVectors(p0, new THREE.Vector3(P ? .35 : -.3, P ? 1.6 : 1.45, .6), q)); };
  const say = async (who, line) => { if (who) { who.mood('wave'); setTimeout(() => who.mood('calm'), 1100 * E.F); } await E.say(line); };
  let shown = false;   /* the first tap is shown first (K-CLARITY 15): "Watch me. I tap Gimmel." then "Now you!" */
  async function askTap(l, k) { const nm = E.LETTERS[k].name;
    if (E.CALM && !shown) { shown = true; await E.say('Watch me. I tap ' + nm + '.'); E.handBelow(l, true); await E.wait(500); E.hop(l, .3, 350); await E.wait(400); E.hand.hide(); await E.say('Now you! Tap ' + nm + '!'); }
    else await E.say(['Tap ' + nm + '!']); }
  return async () => {
    boy.position.set(P ? -.85 : -2.0, 0, P ? 3.0 : 1.4); if (grown) grown.position.set(P ? -1.5 : -3.9, 0, P ? 2.2 : .6); if (P) { boy.scale.setScalar(.95); if (grown) grown.scale.multiplyScalar(.9); }   /* on a phone they stand in front, big enough to see (reviewer: they were tiny) */
    E.setProgress(steps, 0);
    for (const line of script.intro) await say(boy, line);
    for (const [si, st] of script.steps.entries()) {
      if (st.dress) {   /* Unit 9: a letter puts on its "Shabbos clothes" (its final form, for the end of a word) */
        const src = E.letter(st.dress, 2.5); const c = new THREE.Vector3(P ? .35 : -.3, P ? 1.6 : 1.45, .6); src.position.copy(c); E.scene.add(src); await E.popIn(src); float(src);
        for (const line of st.before) await E.say(line);
        float(src, false); E.sfx.sparkle(); E.sfx.whoosh(); E.confetti(c.clone().add(new THREE.Vector3(0, 1.2, .5)), 26);   /* dressing up: a little shower of confetti */ const ring = E.glowSprite('#fff2a8', 5, 0); ring.position.copy(c).setZ(.2); E.scene.add(ring);
        await E.tween(650, q => { src.scale.set(1, 1 - q * .99, 1); ring.material.opacity = q * .9; });
        E.scene.remove(src); const l = L[st.letter]; l.position.copy(c); l.visible = true; l.scale.set(1, .01, 1); E.sparkle(c.clone().add(new THREE.Vector3(0, .3, .5)), 30, 1.4);
        await E.tween(650, q => { l.scale.set(1, .01 + q * .99, 1); ring.material.opacity = .9 * (1 - q); }, E.ease.back); E.scene.remove(ring); float(l);
        for (const line of st.lines) await E.say(line);
        await E.sayWithMe(st.letter);
        await askTap(l, st.letter); await tapIt(l, E.nameLine(st.letter));
        await letterDone(st.letter);
      } else if (st.fromDot) {   /* this letter is the last one without its dot (Chaf from Kaf) */
        const src = L[st.fromDot]; float(src, false); const kp = src.position.clone(), ch = L[st.letter]; ch.position.copy(kp); ch.rotation.copy(src.rotation); ch.visible = true; ch.userData.dot.visible = true; src.visible = false;
        await E.say('Now watch the dot!');
        const d = ch.userData.dot, dp = d.position.clone(); E.sfx.whoosh();
        await E.tween(700, k => { d.position.set(dp.x + k * 1.5, dp.y + k * 2.6, dp.z + k * .5); d.scale.setScalar(1 - k); }, E.ease.out); d.visible = false; d.position.copy(dp); d.scale.setScalar(1);
        E.sparkle(E.worldPos(ch).add(new THREE.Vector3(1.4, 2.4, .5)), 14); float(ch);
        for (const line of st.lines) await E.say(line);
        await E.sayWithMe(st.letter);   /* he says it out loud too (RESEARCH.md) */
        await askTap(ch, st.letter); await tapIt(ch, E.nameLine(st.letter));
        src.visible = true; src.position.copy(kp); float(src); await letterDone(st.fromDot); await letterDone(st.letter);
      } else {
        const has = hasPic(st.pic), pic = has ? PIC[st.pic]() : new THREE.Group(); const who = st.near === 'grown' && grown ? grown : boy;   /* a painting not here yet: the letter appears on its own */
        const [dx, py] = st.at || [.9, 2.0]; pic.position.set(who.position.x + dx, py, who.position.z + .4); if (E.CALM) { if (P) pic.position.set(.6, 2.9, .9); else pic.position.set(who.position.x + 2.0, 2.7, who.position.z + .2); }   /* calm, on a phone: the picture shows on its own, beside and above the people, never on a head */   /* st.at: a picture that needs more room beside the face */ pic.scale.setScalar(st.size || 1.1); E.scene.add(pic); await E.popIn(pic, st.size || 1.1, 450);
        if (st.act) st.act(E, pic, boy, grown);
        for (const line of st.lines) await say(st.near === 'grown' ? grown : boy, line);   /* the story is told even before its painting comes */
        if (st.keep) await rise(pic, st.letter); else { await toCentre(pic); await morph(pic, st.letter); }
        for (const line of st.after) await E.say(line);
        await E.sayWithMe(st.letter);   /* he says it out loud too (RESEARCH.md) */
        await askTap(L[st.letter], st.letter); await tapIt(L[st.letter], E.nameLine(st.letter));
        if (!(script.steps[si + 1] && script.steps[si + 1].fromDot)) await letterDone(st.letter);
      }
      E.setProgress(steps, si + 1);
    }
    /* the look-alikes, side by side, right to left; for each line the arrow (or the ring at the dot place) shows where to look */
    unit.letters.forEach(k => { L[k].visible = false; floaters.delete(L[k]); });
    await Promise.all([E.popOut(boy), grown && E.popOut(grown), E.popOut(props), ...kept.map(fade)].filter(Boolean));
    for (const [a, b, la, lb] of script.lookalikes || []) {
      const A = E.letter(a, 1.8), B = E.letter(b, 1.8); A.position.set(P ? .85 : 1.2, 1.6, .5); B.position.set(P ? -.85 : -1.2, 1.6, .5); E.scene.add(A, B); await Promise.all([E.popIn(A), E.popIn(B)]);
      for (const [k, line] of [[a, la], [b, lb]]) { const l = k === a ? A : B;
        if (E.sameShape && E.sameShape(a, b)) { ring.position.copy(l.userData.dotHome).setZ(.6); l.add(ring); ring.visible = true; arrow.visible = false; } else { ring.visible = false; if (E.pointAt) E.pointAt(arrow, l, k, 1.8, E.featFor ? E.featFor(k, k === a ? b : a) : undefined); }
        await E.say(line); await E.wait(250); }
      arrow.visible = false; ring.visible = false; await Promise.all([E.popOut(A), E.popOut(B)]); E.scene.remove(A, B);
    }
    E.setProgress(steps, steps - 1);
    /* every letter so far, right to left (two lines on a phone when there are many), and the chant */
    const all = script.row || [...unit.known, ...unit.letters], many = all.length > (P && E.CALM ? 6 : 9),   /* calm: on a phone, more than six letters break into lines (nine in one row ran off both edges) */ sz = P ? .5 : (all.length > 20 ? .66 : all.length > 12 ? .85 : many ? .7 : .82), gap = P ? (script.row ? .52 : many ? .4 : .46) : (all.length > 20 ? 1.0 : many ? .62 : .82);   /* a wide gap when there are many, so no two letters touch (reviewer) */
    const nl = P && many ? Math.ceil(all.length / 7) : all.length > 20 ? 4 : all.length > 12 ? 2 : 1, per = script.row ? Math.ceil(Math.ceil(all.length / nl) / 2) * 2 : Math.ceil(all.length / nl),   /* partners in pairs never split across two lines */ lines = Array.from({ length: nl }, (_, i) => all.slice(i * per, (i + 1) * per));   /* more lines (right to left, top line first) when they would not fit: on a phone, 8 letters a line at most */
    lines.forEach((ks, li) => { const made = ks.map(k => E.letter(k, sz)), widths = made.map(l => l.userData.width), total = widths.reduce((a, b) => a + b, 0) + gap * (E.CALM ? .6 : .45) * (ks.length - 1);
      let x = total / 2; made.forEach((l, i) => { x -= widths[i] / 2; l.position.set(x, lines.length > 1 ? (P ? (lines.length > 2 ? 3.1 - li * (lines.length > 3 ? .85 : 1.0) : 2.3 - li * 1.1) : (lines.length > 3 ? (E.CALM ? 3.1 : 3.45) - li * 1.05 : lines.length > 2 ? 3.15 - li * 1.3 : 2.55 - li * 1.4)) : 1.5, .4); x -= widths[i] / 2 + gap * (E.CALM ? .6 : .45); l.visible = false; E.scene.add(l); row.push(l); }); });
    for (const l of row) { E.popIn(l, 1, 280); await E.wait(60); }
    E.setProgress(steps, steps);
    await E.say(script.chantLine || 'Let’s sing the Alef-Beis so far!');
    for (const l of row) { E.sfx.drum(); E.hop(l, .3, 300); await E.say(E.LETTERS[l.userData.key].name + ',', false); await E.wait(50); }
    const names = unit.letters.map(k => E.LETTERS[k].name), list = names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    await E.say(script.tapLine || 'Now you! Tap ' + list + '.');
    const left = row.filter(l => unit.letters.includes(l.userData.key));
    while (left.length) {
      const target = left[0]; if (E.CALM) E.handBelow(target, true); else { const [hx, hy] = E.toScreen(E.worldPos(target).add(new THREE.Vector3(.15, -.35, .5))); E.hand.at(hx, hy, true); }
      document.body.dataset.tapReady = left.map(l => 'row-' + l.userData.key).join(',');
      const l = await E.waitTap(row); E.hand.hide();
      const finOf = left.find(x => E.LETTERS[x.userData.key].partner === l.userData.key);   /* he tapped the plain partner of a letter in Shabbos clothes */
      if (!left.includes(l) && finOf) { E.sfx.boop(); E.shake(l, .08); await E.say(E.LETTERS[l.userData.key].name + ' is plain. Find ' + E.LETTERS[finOf.userData.key].name + ', in Shabbos clothes!'); continue; }
      if (!left.includes(l)) { E.sfx.boop(); E.shake(l, .08); const tk = target.userData.key, lk = l.userData.key, same = E.LETTERS[lk].snd && E.LETTERS[lk].snd === E.LETTERS[tk].snd;   /* Kaf for Kuf: both say k, so the sound is no help */
        await E.say(same ? 'That is ' + E.LETTERS[lk].name + '.' : E.nameLine(lk)); await E.say((same || lk === 'hei') && tk === 'kuf' ? 'Kuf has a long leg. Tap Kuf!' : lk === 'daled' && tk === 'reish' ? 'Reish is round on top. Tap Reish!' : E.sameShape(lk, tk) && E.LETTERS[tk].top ? E.LETTERS[tk].name + '’s dot is on the ' + E.LETTERS[tk].top + ' head. Tap ' + E.LETTERS[tk].name + '!' : E.sameShape(lk, tk) ? (E.LETTERS[tk].dagesh ? E.LETTERS[tk].name + ' has a dot. Tap ' : E.LETTERS[tk].name + ' has no dot. Tap ') + E.LETTERS[tk].name + '!' : 'Now tap ' + E.LETTERS[tk].name + '!'); continue; }   /* Hei for Kuf: the look-alike cue */
      left.splice(left.indexOf(l), 1);
      E.sfx.chime(); E.sparkle(E.worldPos(l).add(new THREE.Vector3(0, .3, .5)), 20, 1); E.hop(l, .45);
      if (lines.length > 1) { const s0 = l.scale.x; E.tween(300, q => l.scale.setScalar(s0 * (1 + .18 * q))); }   /* more than one line: no star, which could sit under a letter above and look like a nekudah; the letter grows instead */
      else { const st = E.CALM ? E.tick3d(.14) : E.star3d(.14); st.position.copy(l.position).add(new THREE.Vector3(0, sz * .85, .3)); E.scene.add(st); E.popIn(st); if (!E.CALM) E.onFrame(t => st.rotation.y = t * 2); }
      await E.say(E.nameLine(l.userData.key));
    }
    delete document.body.dataset.tapReady;
    return { stars: 3, line: script.endLine || 'Wonderful! You know ' + list + '!' };
  };
}
