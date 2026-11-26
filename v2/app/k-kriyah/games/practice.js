/* Unit 10, a new kind of game: My Hard Letters (extra practice; MAP.md: "a boy who isn't there yet gets extra review
   rounds that focus on the letters he misses"). It opens as soon as he has tried the champion check.
   The four letters he finds hardest (from every answer he gave all year, saved on this device: the ones he got wrong first,
   then the ones not seen for longest) come one at a time:
   1. Meet it again: the letter grows big, he hears its name, its sound and what to look for, and says it with the voice.
   2. Bubble catch: bubbles float up, each with a letter inside (this letter, its look-alike and others). He pops every
      bubble with this letter (three of them). A wrong pop is answered kindly, with what to look for. */
const TIP = { beis: 'It has a dot.', veis: 'No dot.', kaf: 'It has a dot.', chaf: 'No dot.', pei: 'It has a dot.', fei: 'No dot.', tav: 'It has a dot.', sav: 'No dot.',
  shin: 'Its dot is on the right.', sin: 'Its dot is on the left.', vov: 'No crown.', zayin: 'It has a crown.', hei: 'Its leg doesn’t touch the roof.', ches: 'Its leg touches the roof.',
  daled: 'It has a corner.', reish: 'It is round on top.', gimmel: 'It has a foot.', nun: 'It is flat at the bottom.', tes: 'It is closed at the bottom.', mem: 'It has an opening at the bottom.',
  kuf: 'It has a long leg.', yud: 'It is the little one.', lamed: 'It is the tall one.', tzadik: 'It has a little arm up.', feisofis: 'It has a long leg.', tzadiksofis: 'It has a long leg.', samech: 'It is round all around.', memsofis: 'It is square at the bottom.', nunsofis: 'It has a long leg.', chafsofis: 'It has a long leg.', alef: 'It has a slanted line.', ayin: 'It has two arms up.' };
const LOOKS = { beis: ['veis', 'kaf'], veis: ['beis'], kaf: ['chaf', 'beis'], chaf: ['kaf'], pei: ['fei', 'kaf'], fei: ['pei'], tav: ['sav', 'ches'], sav: ['tav'], shin: ['sin'], sin: ['shin'], vov: ['zayin', 'nunsofis'], zayin: ['vov'],
  hei: ['ches', 'kuf'], ches: ['hei', 'tav'], daled: ['reish'], reish: ['daled', 'chafsofis'], gimmel: ['nun'], nun: ['gimmel'], tes: ['mem'], mem: ['tes'], kuf: ['hei'], samech: ['memsofis'], memsofis: ['samech'], nunsofis: ['vov'], chafsofis: ['reish'] };
export default function setup(E, { struggled, unit }) {
  const { THREE } = E, NM = k => E.LETTERS[k].name;
  const pool = [...unit.known, ...unit.letters], picks = E.reviewPicks(pool, 4);
  const kid = E.unitBoy(unit.n); E.scene.add(kid);
  const bubM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: .28, roughness: 0, clearcoat: 1, transmission: .2, iridescence: .8, depthWrite: false });
  const bubbles = []; let want = null, active = false, caught = 0, wrong = 0, wrongHere = 0, resolveCatch = null, P = false, big = null, help = struggled;
  const glow = E.glowSprite('#fff7b0', 1.8, 0); E.scene.add(glow); const arrow = E.arrow3d(.3);
  E.onLayout(p => { P = p; if (p) { E.camBase.set(0, 2.4, 11); E.camTarget.set(0, 2.3, 0); kid.visible = false; } else { E.camBase.set(0, 2.5, 9.5); E.camTarget.set(0, 1.7, 0); kid.visible = true; kid.position.set(-4.6, 0, 1.2); } });
  const lanes = () => P ? [1.3, .45, -.45, -1.3] : [3.1, 1.6, .1, -1.4, -2.9];
  let seq = 0, queue = [];
  function spawn() {
    if (!queue.length) return; const k = queue.shift(), b = new THREE.Group(); const s = new THREE.Mesh(new THREE.SphereGeometry(.62, 28, 20), bubM); b.add(s);
    const l = E.letter(k, .8); l.position.z = .05; b.add(l); b.userData = { key: k, l, x: lanes()[seq++ % lanes().length] + (Math.random() - .5) * .3, t0: performance.now(), sp: P ? .55 : .5 }; b.position.set(b.userData.x, -.6, 1.2); E.scene.add(b); bubbles.push(b);
  }
  E.onFrame(t => {
    for (const b of bubbles.slice()) { if (b.userData.popping) continue; const y = -.6 + (performance.now() - b.userData.t0) / 1000 * b.userData.sp * (E.FAST ? 3 : 1);
      b.position.set(b.userData.x + Math.sin(t * 1.5 + b.userData.x) * .15, y, 1.2); b.userData.l.rotation.y = Math.sin(t + b.userData.x) * .25;
      if (y > (P ? 5.6 : 4.6)) { E.scene.remove(b); bubbles.splice(bubbles.indexOf(b), 1); if (active) queue.push(b.userData.key); } }   /* a bubble that floats away comes back later */
    const h = help && active && bubbles.find(b => b.userData.key === want && !b.userData.popping); if (h) { glow.position.copy(h.position).setZ(.8); glow.material.opacity = .55 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0;
  });
  let timer = null;
  window.__info = () => ({ ready: active, want, targets: bubbles.filter(b => b.userData.key === want && !b.userData.popping && b.position.y > .4 && b.position.y < (P ? 4.6 : 3.8)).map(b => E.toScreen(b.position)),
    others: bubbles.filter(b => b.userData.key !== want && !b.userData.popping && b.position.y > .4 && b.position.y < (P ? 4.6 : 3.8)).map(b => E.toScreen(b.position)) });
  E.onPointer('down', async e => {
    if (!active) return; const live = bubbles.filter(b => !b.userData.popping); let b = E.pickFrom(e, live);
    if (!b) { let bd = Math.max(55, innerHeight * .08); live.forEach(x => { const [a, c] = E.toScreen(x.position), d = Math.hypot(a - e.clientX, c - e.clientY); if (d < bd) { bd = d; b = x; } }); }
    if (!b) return; const k = b.userData.key;
    if (k === want) { b.userData.popping = true; caught++; E.sfx.pop && E.sfx.pop(); E.joy(b.position.clone()); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 700);
      await E.tween(250, q => b.scale.setScalar(1 + q * .5)); E.scene.remove(b); bubbles.splice(bubbles.indexOf(b), 1); E.say([NM(k) + '!'], false);
      if (caught >= 3 && resolveCatch) { const r = resolveCatch; resolveCatch = null; r(); } }
    else { E.sfx.boop(); if (!wrongHere) wrong++; wrongHere++; E.shake(b, .1, 300); if (E.pointAt(arrow, b.userData.l, k, .8, E.featFor(k, want))) setTimeout(() => arrow.visible = false, 1500 * E.F); if (wrongHere >= 2) help = true; await E.say('That is ' + NM(k) + '. Find ' + NM(want) + '. ' + (TIP[want] || '')); }
  });
  async function letterRound(k, i) {
    want = k; caught = 0; wrongHere = 0;
    big = E.letter(k, 2.6); big.position.set(P ? 0 : .3, P ? 2.6 : 1.9, .6); E.scene.add(big); await E.popIn(big); E.hop(big, .3);
    await E.say(['This is ' + NM(k) + '.']); if (TIP[k]) await E.say(TIP[k]); await E.say(E.nameLine(k));
    await E.sayWithMe(k);
    await E.popOut(big); E.scene.remove(big);
    const others = (LOOKS[k] || []).filter(o => E.LETTERS[o] && !E.sameSound(o, k)), more = pool.filter(o => o !== k && !others.includes(o) && !E.sameSound(o, k)).sort(() => Math.random() - .5).slice(0, 2);
    queue = [k, ...others, k, ...more, k].slice(0, 8); seq = 0;
    await E.say(['Pop every bubble with ' + NM(k) + '!']);
    const done = new Promise(r => resolveCatch = r);
    timer = setInterval(() => { if (bubbles.length < (P ? 3 : 4)) { if (!queue.length) queue = [k, ...others, ...more].sort(() => Math.random() - .5); spawn(); } }, 900 * (E.FAST ? .3 : 1)); spawn();
    if (i === 0) {   /* show, then try: the hand pops the first one */
      await E.say('Watch me.'); let b0 = null; for (let w = 0; w < 80 && !b0; w++) { b0 = bubbles.find(b => b.userData.key === k && b.position.y > 1); if (!b0) await E.wait(100); }
      if (b0) { const [x, y] = E.toScreen(b0.position); E.hand.at(x, y); await E.wait(500); E.hand.hide(); b0.userData.popping = true; caught++; E.joy(b0.position.clone()); E.scene.remove(b0); bubbles.splice(bubbles.indexOf(b0), 1); await E.say([NM(k) + '! Now you!']); } }
    active = true; document.body.dataset.popReady = i + 1;
    await done; active = false; clearInterval(timer); bubbles.slice().forEach(b => { E.scene.remove(b); }); bubbles.length = 0;
    E.noteLetter && E.noteLetter(k, wrongHere === 0);
    await E.say(['You know ' + NM(k) + '!']);
  }
  return async () => {
    E.setProgress(picks.length, 0);
    await E.say('Let’s practice the letters that are hard for you.');
    for (let i = 0; i < picks.length; i++) { await letterRound(picks[i], i); E.setProgress(picks.length, i + 1); }
    const stars = wrong <= 1 ? 3 : wrong <= 3 ? 2 : 1;
    return { stars, line: 'Great practice! Now try the champion check again.' };
  };
}
