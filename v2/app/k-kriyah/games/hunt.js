/* Game 3: Letter Hunt in the sukkah.
   Skill: picks out a letter among its look-alikes (Unit 1: Beis, then Veis; Unit 3: Zayin, then Ches).
   Two rounds, each with its own letter to find. A kind correction names the letter he tapped and what to look for;
   if he struggles, one Beis glows and the hand points to it. */
/* each unit: two rounds (the letter to find, how many, and the others mixed in), the boy's name, and short "what to look for" words */
const PLAN = {
  1: { boy: 'Mendy', rounds: [['beis', 4, ['alef', 'alef', 'veis', 'veis'], ['alef', 'veis']], ['veis', 3, ['alef', 'alef', 'beis', 'beis'], ['alef', 'beis']]] },
  3: { boy: 'Ari', rounds: [['zayin', 4, ['vov', 'vov', 'ches', 'gimmel'], ['vov', 'ches']], ['ches', 3, ['hei', 'hei', 'zayin', 'daled'], ['hei', 'zayin']]] },
};
const CUE = { beis: 'with the dot', veis: 'with no dot', zayin: 'with the crown', vov: 'with no crown', ches: 'with the leg that touches', hei: 'with the floating leg' };
const NOTE = { alef: '', beis: 'It has a dot.', veis: 'No dot.', vov: 'No crown.', zayin: 'It has a crown.', hei: 'Its leg floats.', ches: 'Its leg touches.', gimmel: '', daled: '' };
export default function setup(E, { struggled, unit }) {
  const plan = PLAN[unit.n] || PLAN[1], NM = k => E.LETTERS[k].name;
  const { THREE } = E;
  const wood = E.M(0xd9a066, { roughness: .6 }), wood2 = E.M(0xc68a52, { roughness: .6 }), cloth = E.M(0xffffff, { roughness: .5 }), leaf = E.M(0x2f9b3e, { roughness: .7, clearcoat: 0 }), leaf2 = E.M(0x46b54d, { roughness: .7, clearcoat: 0 });
  let suk = null, W = 7.4, spots = [];
  const plaque = E.M(0xfffaf0, { roughness: .4, clearcoat: .5 });   /* a plain backing tile, so nothing behind a letter can look like its dot */
  const boy = unit.n === 3 ? E.ari() : E.mendy(); E.scene.add(boy);
  const letters = []; const glow = E.glowSprite('#fff7b0', 1.8, 0); E.scene.add(glow);
  const ring = E.noticeRing(.5); E.scene.add(ring);
  let round = 0, want = plan.rounds[0][0], found = 0, need = 0, wrong = 0, wrongInRound = 0, active = false, help = struggled, helpOn = null, lastAct = 0, resolveRound = null;

  function buildSukkah(w) {
    if (suk) E.scene.remove(suk); suk = new THREE.Group(); E.scene.add(suk); W = w; const hw = w / 2;
    suk.add(E.mesh(E.rbox(w + .4, .16, 4.2, .05), wood2, 0, .08, -.1));
    const n = Math.round(w / .52); for (let i = 0; i < n; i++) suk.add(E.mesh(E.rbox(w / n - .03, 3.3, .14, .04), i % 2 ? wood : wood2, -hw + (i + .5) * w / n, 1.75, -1.7));   /* back wall */
    for (const s of [-1, 1]) for (let i = 0; i < 6; i++) suk.add(E.mesh(E.rbox(.14, 3.3, .5, .04), i % 2 ? wood : wood2, s * (hw + .05), 1.75, -1.45 + i * .52));   /* side walls */
    for (let i = 0; i < Math.round(w * 2.2); i++) { const b = E.mesh(new THREE.CylinderGeometry(.05, .05, 4.1, 6), i % 2 ? leaf : leaf2, -hw + i / 2.2 + .1, 3.42 + (i % 3) * .04, -.1, false); b.rotation.x = Math.PI / 2; suk.add(b); }   /* schach */
    for (let i = 0; i < Math.round(w * 1.6); i++) suk.add(E.mesh(new THREE.SphereGeometry(.22 + (i % 3) * .05, 10, 8), i % 2 ? leaf : leaf2, -hw + (i * .63) % w, 3.55, -1.6 + (i * 1.37) % 3.4, false));
    /* a paper chain along the back wall */
    const cc = [0xff5d8f, 0x2dbb6a, 0x2f7de1, 0x9b5de5];   /* no gold or yellow near the letters: it could look like the dagesh */ for (let i = 0; i < Math.round(w * 3); i++) { const r = E.mesh(new THREE.TorusGeometry(.1, .025, 6, 12), E.M(cc[i % 4], { roughness: .4 }), -hw + .2 + i / 3, 3.15 - Math.sin(i / 3 * 1.4) * .12, -1.55, false); r.rotation.y = i % 2 ? Math.PI / 2 : 0; suk.add(r); }
    /* hanging fruit, only in the far top corners, away from every hiding place */
    [[-.46, 0xe8322b], [.46, 0x8e2b8e]].forEach(([x, c]) => { const X = x * w; suk.add(E.mesh(new THREE.CylinderGeometry(.008, .008, .4, 4), E.M(0xffffff), X, 3.15, -1.2, false)); suk.add(E.mesh(new THREE.SphereGeometry(.15, 16, 12), E.M(c, { roughness: .3, clearcoat: .8 }), X, 2.92, -1.2)); });
    /* the table with a white cloth, a kiddush cup and a fruit bowl */
    const tw = Math.min(3.2, w * .5); suk.add(E.mesh(E.rbox(tw, .12, 1.3, .05), cloth, 0, 1.0, -.2)); suk.add(E.mesh(E.rbox(tw + .05, .55, .05, .02), cloth, 0, .75, .46));
    [[-1, -1], [1, -1]].forEach(([a]) => suk.add(E.mesh(new THREE.CylinderGeometry(.05, .05, 1, 8), wood2, a * (tw / 2 - .15), .5, -.7)));
    suk.add(E.mesh(new THREE.CylinderGeometry(.09, .05, .22, 16), E.M(0xd8dde6, { metalness: .9, roughness: .15 }), -tw * .3, 1.2, -.35)); suk.add(E.mesh(new THREE.CylinderGeometry(.02, .02, .14, 8), E.M(0xd8dde6, { metalness: .9, roughness: .15 }), -tw * .3, 1.1, -.35));
    suk.add(E.mesh(new THREE.SphereGeometry(.3, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), E.M(0xff8a1e, { side: THREE.DoubleSide }), tw * .28, 1.33, -.35));
    [0xe8322b, 0x7bc043, 0xc0392b].forEach((c, i) => suk.add(E.mesh(new THREE.SphereGeometry(.12, 14, 10), E.M(c, { roughness: .3, clearcoat: .8 }), tw * .28 - .12 + i * .12, 1.36, -.35)));
    /* two chairs */
    [-1, 1].forEach(s => { const x = s * (tw / 2 + .45); suk.add(E.mesh(E.rbox(.6, .08, .6, .03), wood, x, .62, .1)); suk.add(E.mesh(E.rbox(.6, .8, .08, .03), wood, x, 1.02, -.2)); [[-.25, -.1], [.25, -.1], [-.25, .35], [.25, .35]].forEach(([a, b]) => suk.add(E.mesh(new THREE.BoxGeometry(.06, .6, .06), wood2, x + a, .3, b))); });
    /* a picture on the back wall */
    suk.add(E.mesh(E.rbox(1.0, .8, .08, .05), E.M(0x8a5a3c, { roughness: .5 }), w * .42, 1.5, -1.6)); suk.add(E.mesh(new THREE.BoxGeometry(.84, .64, .04), E.M(0xbfe8ff), w * .42, 1.5, -1.55, false));
    /* where letters can hide: 9 places, well apart (a test checks they never touch on screen) */
    let sp;
    if (w >= 5) sp = [[-.3, 2.25, -1.5, 0], [0, 2.6, -1.5, 0], [.3, 2.25, -1.5, 0],   /* the back wall */
      [0, .76, .52, 0], [-.22, .42, 1.5, 0], [.22, .42, 1.5, 0],                       /* the tablecloth and the floor */
      [-(hw - .3) / w, 2.25, .05, .5], [(hw - .3) / w, 2.25, .05, -.5]].map(([x, y, z, r]) => [x * w, y, z, r]);   /* the side walls */
    else sp = [[-1.05, 2.75, -1.5, 0], [1.05, 2.75, -1.5, 0], [0, 1.9, -1.5, 0],     /* a phone: the back wall, high and low */
      [0, .74, .52, 0], [-1.25, .42, 1.6, 0], [1.25, .42, 1.6, 0],                     /* the tablecloth and the floor */
      [-1.4, 1.65, .4, .45], [1.4, 1.65, .4, -.45]];                           /* the side walls */
    spots = sp.map(([x, y, z, ry]) => ({ p: new THREE.Vector3(x, y, z), ry }));
    if (letters.length) letters.forEach((l, i) => { if (l.userData.spot != null) placeAt(l, l.userData.spot); });
  }
  E.onLayout(p => {
    buildSukkah(p ? 4.2 : 7.4);
    if (p) { E.camBase.set(0, 1.7, 9.4); E.camTarget.set(0, 1.5, 0); boy.position.set(0, 0, 4.2); boy.scale.setScalar(.5); }
    else { E.camBase.set(0, 2.2, 9.2); E.camTarget.set(0, 1.75, 0); boy.position.set(-2.9, .16, 1.55); boy.scale.setScalar(.85); }
  });
  E.setSway(.5);
  const SIZE = () => E.portrait ? .72 : .9;
  function placeAt(l, i) { const s = spots[i]; l.userData.spot = i; l.position.copy(s.p); l.rotation.y = s.ry; l.userData.base = s.p.clone(); }
  E.onFrame(t => {
    letters.forEach((l, i) => { if (l.visible && l.userData.base && !l.userData.busy) { l.position.y = l.userData.base.y + Math.sin(t * 1.6 + i) * .03; l.rotation.z = Math.sin(t * 1.3 + i) * .05; } });
    if (helpOn && helpOn.visible) { glow.position.copy(helpOn.position).add(new THREE.Vector3(0, 0, -.2)); glow.material.opacity = .6 + Math.sin(t * 5) * .3; } else glow.material.opacity = 0;
  });
  window.__info = () => ({ rects: spots.map(x => { const a = E.toScreen(x.p.clone().add(new THREE.Vector3(-SIZE() * .6, SIZE() * .65, 0))), b = E.toScreen(x.p.clone().add(new THREE.Vector3(SIZE() * .6, -SIZE() * .65, 0))); return [a[0], a[1], b[0], b[1]]; }),   /* each tile's box on screen */ want, round, active, targets: letters.filter(l => l.visible && l.userData.key === want && !l.userData.got).map(l => E.toScreen(E.worldPos(l))),
    others: letters.filter(l => l.visible && l.userData.key !== want).map(l => E.toScreen(E.worldPos(l))), found, need });

  function setRound(k, nTarget, others) {
    letters.forEach(l => E.scene.remove(l)); letters.length = 0;
    const order = [...spots.keys()].sort(() => Math.random() - .5); let j = 0;
    const add = key => { const l = E.letter(key, SIZE()); const ud = l.userData; const pl = E.mesh(E.rbox(ud.width * 1.35, ud.height * 1.3, .08, .07), plaque, 0, 0, -.22, false); l.add(pl); E.scene.add(l); placeAt(l, order[j++]); letters.push(l); l.visible = false; return l; };
    for (let i = 0; i < nTarget; i++) add(k); others.forEach(add);
    want = k; found = 0; need = nTarget; wrongInRound = 0; E.setProgress(need, 0);
  }
  async function showAll() { E.sfx.sparkle(); for (const l of letters.slice().sort(() => Math.random() - .5)) { E.popIn(l, 1, 400); await E.wait(90); } await E.wait(400); }
  async function got(l) {
    l.userData.got = true; l.userData.busy = true; helpOn = null; E.hand.hide(); found++; E.joy(E.worldPos(l)); boy.mood('cheer'); setTimeout(() => boy.mood('think'), 900 * E.F);
    const p0 = l.position.clone(), top = new THREE.Vector3(0, E.portrait ? 4.6 : 4.0, 1);
    E.say(['A ' + NM(want) + '!', E.S(E.LETTERS[want].snd)], false);
    await E.tween(650, k => { l.position.lerpVectors(p0, top, k); l.scale.setScalar(1 - k * .7); l.rotation.y = k * Math.PI * 2; });
    l.visible = false; E.sparkle(top, 14); E.setProgress(need, found);
    if (found >= need && resolveRound) { const r = resolveRound; resolveRound = null; r(); }
  }
  async function miss(l) {
    E.sfx.boop(); wrong++; wrongInRound++; l.userData.busy = true; boy.mood('think'); await E.shake(l, .12); l.userData.busy = false;
    ring.position.copy(E.worldPos(l)).add(new THREE.Vector3(0, 0, .3)); ring.visible = true;
    const k = l.userData.key, look = 'Find ' + NM(want) + (CUE[want] ? ', ' + CUE[want] : '') + '!';
    await E.say('That is ' + NM(k) + '. ' + (NOTE[k] ? NOTE[k] + ' ' : '') + look);
    ring.visible = false;
    if (wrongInRound >= 2) showHelp();
  }
  function showHelp() { const t = letters.find(l => l.visible && !l.userData.got && l.userData.key === want); if (!t) return; helpOn = t; const [x, y] = E.toScreen(E.worldPos(t)); E.hand.at(x + 10, y + 10, true); }
  E.onPointer('down', async e => {
    if (!active) return; const l = E.pickFrom(e, letters.filter(x => !x.userData.got)); if (!l || l.userData.busy) return; lastAct = performance.now();
    if (l.userData.key === want) got(l); else { active = false; await miss(l); active = true; }
  });
  setInterval(() => { if (active && !helpOn && performance.now() - lastAct > (help ? 7000 : 14000) * E.F) { lastAct = performance.now(); showHelp(); E.say('Find ' + NM(want) + (CUE[want] ? ', ' + CUE[want] : '') + '!'); } }, 500);

  return async () => {
    /* round 1: Beis */
    const [r1, r2] = plan.rounds;
    setRound(r1[0], r1[1], help ? r1[3] : r1[2]);
    boy.mood('think'); await E.say(plan.boy + ' is in the sukkah. Letters are hiding!');
    await showAll();
    await E.say('Watch me. I find a Beis. It has a dot!');
    const first = letters.find(l => l.userData.key === r1[0]); let [x, y] = E.toScreen(E.worldPos(first)); E.hand.at(x + 10, y + 10); await E.wait(700);
    const fin1 = new Promise(r => resolveRound = r);
    await got(first); await E.wait(300);
    await E.say('Now you! Find every ' + NM(r1[0]) + '.'); active = true; lastAct = performance.now(); document.body.dataset.huntReady = r1[0];
    await fin1; active = false; await E.wait(500);
    await E.say('You found every ' + NM(r1[0]) + '!');
    /* round 2: Veis */
    round = 1; letters.forEach(l => E.popOut(l)); await E.wait(450);
    setRound(r2[0], r2[1], help ? r2[3] : r2[2]);
    await showAll();
    await E.say('Now find every ' + NM(r2[0]) + '. ' + (NOTE[r2[0]] || ''));
    const fin2 = new Promise(r => resolveRound = r); active = true; lastAct = performance.now(); document.body.dataset.huntReady = r2[0];
    await fin2; active = false;
    const stars = wrong <= 1 ? 3 : wrong <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Great hunting! You found every ' + NM(r1[0]) + ' and ' + NM(r2[0]) + '.' : null };
  };
}
