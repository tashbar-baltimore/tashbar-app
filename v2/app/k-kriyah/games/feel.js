/* Game 2: Feel the Shape (touch only, NOT writing: there is no writing in Kindergarten).
   Skill: knows the shape of Alef, Beis and Veis by feeling it. He runs his finger along a glowing road on the big 3D letter;
   the road turns gold where he has been, an orange ring shows where to go next, the letter glows, and its name and sound play.
   Tapping along the road works too. If his finger wanders off, a kind voice and the hand show him the ring. */
export default function setup(E, { unit }) {
  const { THREE, S } = E;
  /* the path along each letter, in font units (1000 per em, y up), stroke by stroke */
  const BEIS = [[[78, 612], [84, 515], [200, 500], [320, 500], [425, 478], [446, 380], [446, 275], [446, 170], [430, 91], [320, 91], [205, 91], [90, 91]]];
  const PATHS = {
    alef: [[[78, 600], [112, 500], [160, 440], [240, 370], [330, 290], [436, 197], [515, 85]],
      [[424, 612], [458, 520], [520, 468], [505, 360], [470, 280]],
      [[112, 330], [80, 240], [96, 140], [120, 45]]],
    beis: BEIS, veis: BEIS,
    gimmel: [[[115, 615], [118, 510], [210, 500], [289, 455], [289, 340], [289, 230], [250, 110], [140, 91], [45, 91]], [[300, 235], [340, 130], [378, 40]]],
    daled: [[[40, 615], [45, 510], [160, 500], [290, 500], [415, 495], [395, 380], [388, 250], [383, 120], [380, 25]]],
    hei: [[[75, 615], [80, 510], [200, 500], [340, 500], [505, 495], [507, 380], [500, 250], [494, 120], [490, 25]], [[102, 300], [100, 190], [100, 80], [100, 20]]],
  };
  const ORDER = unit.n > 1 ? [...unit.letters, 'beis'] : unit.letters;
  const ROW = unit.n > 1 ? ['beis', ...unit.letters] : ORDER;   /* the finished row is in Alef-Beis order */   /* a later unit ends with one earlier letter (Beis, and its dot) */
  let H = 3.2; const holder = new THREE.Group(); E.scene.add(holder);
  const boy = unit.n === 2 ? E.pictureCard('shloimy', () => E.person({ kippah: 0x2e8b57, hair: 0x8a5a3c })) : E.mendy(); E.scene.add(boy);   /* each unit's own boy: Mendy, then Shloimy */
  const done = []; let cur = null, beads = [], next = 0, demo = false, active = false, lastHelp = 0, wander = 0, offTries = 0;
  /* the path is a soft glowing road along the letter (never dots: a dot on Beis means the dagesh); the part he has felt
     turns gold, and a pulsing ring shows where to go next */
  const roadM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfe4ff, emissiveIntensity: .7, roughness: .3, transparent: true, opacity: .55 });
  const goldM = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffb300, emissiveIntensity: 1.0, roughness: .3 });
  const target = new THREE.Mesh(new THREE.TorusGeometry(1, .22, 12, 32), new THREE.MeshStandardMaterial({ color: 0xff4d1a, emissive: 0xff3d00, emissiveIntensity: 1.1 }));   /* clearly orange-red, not gold */
  let roads = [], golds = [];
  const glow = E.glowSprite('#fff4b0', 7, 0); glow.position.set(0, 0, -.6); holder.add(glow);
  E.onLayout(p => {
    H = p ? 2.7 : 3.2;
    if (p) { E.camBase.set(0, 2.4, 10.5); E.camTarget.set(0, 2.1, 0); holder.position.set(0, 2.5, .8); boy.position.set(-1.25, 0, 2.2); boy.scale.setScalar(.8); }
    else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.6, 0); holder.position.set(0, 1.95, .8); boy.position.set(-3.6, 0, 1.4); boy.scale.setScalar(1); }
    done.forEach(l => layoutDone(l, ROW.indexOf(l.userData.key)));
  });
  function layoutDone(l, i) { if (E.portrait) l.position.set(1.5 - i * .78, .42, 2.0); else l.position.set(4.1 - i * (ROW.length > 4 ? .85 : .95), .45, 1.6);   /* low and to the right of the big letter, all on screen (reviewer) */ l.scale.setScalar(E.portrait ? .24 : .34); }
  E.onFrame(t => {
    if (cur && !cur.userData.spin) cur.rotation.y = Math.sin(t * .7) * .12;
    if (target.parent) { const b = beads.find(x => !x.userData.lit); target.visible = !!b && active; if (b) { target.position.copy(b.position); target.scale.setScalar(.16 * H / 3.2 * (1 + Math.sin(t * 7) * .15)); } }
    done.forEach((l, i) => l.rotation.y = Math.sin(t * 1.2 + i) * .3);
  });
  function makeBeads(key) {
    beads = []; roads.forEach(r => r.parent && r.parent.remove(r)); golds.forEach(r => r.parent && r.parent.remove(r)); roads = []; golds = [];
    const z = 20 / 2 * (H / 64.7) + .06;
    PATHS[key].forEach((st, si) => {
      const pts = st.map(([x, y]) => { const p = E.fontToLocal(key, H, x, y); p.z = z; return p; });
      pts.forEach((p, i) => { const b = new THREE.Object3D(); b.position.copy(p); b.userData = { stroke: si, first: i === 0, idx: i, lit: false }; cur.add(b); beads.push(b); });
      const road = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, .06 * H / 3.2, 10, false), roadM); cur.add(road); roads.push(road);
    });
    cur.add(target); next = 0;
  }
  function paintGold() {
    golds.forEach(r => r.parent && r.parent.remove(r)); golds = [];
    PATHS[cur.userData.key].forEach((st, si) => { const sb = beads.filter(b => b.userData.stroke === si); let run = [];
      const flush = () => { if (run.length >= 2) { const g = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(run), 40, .085 * H / 3.2, 10, false), goldM); cur.add(g); golds.push(g); } run = []; };
      sb.forEach(b => { if (b.userData.lit) run.push(b.position.clone().setZ(b.position.z + .01)); else flush(); }); flush(); });
  }
  const beadScreen = i => E.toScreen(E.worldPos(beads[i]));
  const near = (e, i, tolPx) => { const [x, y] = beadScreen(i); return Math.hypot(e.clientX - x, e.clientY - y) < tolPx; };
  const tol = () => Math.max(46, Math.min(innerWidth, innerHeight) * .075);
  let resolveLetter = null, down = false, dotTarget = null, lastUp = 0;
  /* he may start anywhere on the road and go either way: it's for feeling the shape, not for learning to write */
  function light(i) { const b = beads[i]; if (b.userData.lit) return; b.userData.lit = true; E.sfx.tick(); E.sparkle(E.worldPos(b), 4, .5); const n = beads.filter(x => x.userData.lit).length; next = beads.findIndex(x => !x.userData.lit); if (next < 0) next = beads.length; paintGold(); glow.material.opacity = .15 + .6 * n / beads.length;
    if (n >= beads.length && resolveLetter) { const r = resolveLetter; resolveLetter = null; r(); } }
  async function help() { const now = performance.now(); if (now - lastHelp < 4000 * E.F) return; lastHelp = now; offTries++; E.sfx.boop(); boy.mood('think');
    const [x, y] = beadScreen(next); E.hand.at(x, y, true); await E.say('Put your finger on the glowing road.'); boy.mood('calm'); setTimeout(() => { if (active) E.hand.hide(); }, 1500 * E.F); }
  const touch = e => { let hit = false; beads.forEach((b, i) => { if (near(e, i, tol())) { hit = true; light(i); } }); return hit; };
  E.onPointer('down', e => { if (!active || demo) return; down = true; wander = 0; if (touch(e)) E.hand.hide(); else help(); });
  E.onPointer('move', e => { if (!active || demo || !down) return;
    if (touch(e)) { wander = 0; return; }
    const onPath = beads.some((b, i) => near(e, i, tol() * 1.6)); if (!onPath && ++wander > 12) { wander = -40; help(); } });
  E.onPointer('up', () => { down = false; lastUp = performance.now(); });
  window.__info = () => ({ dot: dotTarget ? E.toScreen(E.worldPos(dotTarget)) : null, key: cur && cur.userData.key, active: active && !demo, next, total: beads.length, beads: beads.map((b, i) => beadScreen(i)), off: offTries });

  async function oneLetter(key, first) {
    cur = E.letter(key, H); cur.position.set(0, 0, 0); holder.add(cur); makeBeads(key); glow.material.opacity = .12;
    E.sfx.whoosh(); await E.popIn(cur, 1, 500);
    await E.say(key === 'alef' ? 'This is Alef. Let’s feel its shape.' : key === 'beis' ? (unit.n > 1 ? 'This is Beis. It has a dot. Feel it!' : 'This is Beis, with Mendy’s dot. Feel it!') : key === 'veis' ? 'This is Veis. No dot. Feel it!' : key === 'hei' ? 'This is Hei. Its little leg doesn\u2019t touch the roof.' : 'This is ' + E.LETTERS[key].name + '. Let’s feel its shape.');
    if (first) {
      demo = true; active = true; await E.say('Watch me. I follow the glowing road.');
      const st = PATHS[key][0].length; let [x, y] = beadScreen(0); E.hand.at(x, y); await E.wait(300);
      for (let i = 0; i < st; i++) { const [a, b] = beadScreen(i); await E.tween(260, k => E.hand.at(x + (a - x) * k, y + (b - y) * k), E.ease.lin); x = a; y = b; light(i); }
      E.hand.hide(); await E.wait(300); beads.forEach(b => b.userData.lit = false); next = 0; paintGold(); glow.material.opacity = .12; demo = false;
      await E.say('Now you! Feel the whole glowing road.');
    } else await E.say('Feel the whole glowing road!');
    active = true; document.body.dataset.feelReady = key;
    let said = 0;
    const fin = new Promise(r => resolveLetter = r);
    /* when part of the road is done but some is left, the ring shows him where (once per stretch) */
    const iv = setInterval(() => { if (!active || down || performance.now() - lastUp < 2500 * E.F) return; const n = beads.filter(x => x.userData.lit).length; if (n > said && n < beads.length) { said = n; E.say('More road to feel! Find the orange ring.'); const [x, y] = beadScreen(next); E.hand.at(x, y, true); setTimeout(() => E.hand.hide(), 1400 * E.F); } }, 400);
    await fin; clearInterval(iv); active = false; delete document.body.dataset.feelReady;
    if (key === 'beis') {   /* Beis: he touches Mendy's dot too, so the dagesh is something he feels */
      const dot = cur.userData.dot; const pad = new THREE.Mesh(new THREE.SphereGeometry(.55, 12, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); dot.add(pad);   /* a tap area much bigger than the dot */
      const ring = E.noticeRing(.35); ring.position.copy(dot.position); ring.visible = true; cur.add(ring);
      await E.say(unit.n > 1 ? 'Now tap the dot!' : 'Now tap Mendy\u2019s dot!'); dotTarget = dot; document.body.dataset.dotReady = 1;
      await E.waitTap([dot]); delete document.body.dataset.dotReady; dotTarget = null; ring.visible = false; cur.remove(ring); E.sfx.chime(); E.sparkle(E.worldPos(dot), 22, 1); E.hop(dot, .25, 400);
      await E.say(unit.n > 1 ? 'Beis has a dot!' : 'Someone is home!');
    }
    /* the whole letter glows, spins, and says its name and sound */
    cur.userData.spin = true; E.joy(E.worldPos(cur).add(new THREE.Vector3(0, 0, .8)), true); boy.mood('cheer');
    const r0 = cur.rotation.y; await E.tween(900, k => { cur.rotation.y = r0 + Math.sin(k * Math.PI * 2) * .35; cur.scale.setScalar(1 + Math.sin(k * Math.PI) * .12); glow.material.opacity = .8; }, E.ease.out); cur.scale.setScalar(1);   /* a happy wobble, never turned round to show the letter backwards */ cur.userData.spin = false; cur.rotation.y = 0;
    await E.say(key === 'alef' ? 'Alef! Alef is quiet.' : [E.LETTERS[key].name + '! ' + E.LETTERS[key].name + ' says', S(E.LETTERS[key].snd)]); boy.mood('calm');
    await E.sayWithMe(key);   /* he says it out loud too */
    /* it moves to the side, so he sees the ones he has done */
    [...beads, ...roads, ...golds, target].forEach(b => b.parent && b.parent.remove(b)); beads = []; roads = []; golds = []; const l = cur; cur = null; holder.remove(l); E.scene.add(l); l.position.copy(holder.position);
    const i = ROW.indexOf(l.userData.key); done.push(l); const p0 = l.position.clone(); const tmp = new THREE.Object3D(); layoutDone(tmp, i);
    await E.tween(600, k => { l.position.lerpVectors(p0, tmp.position, k); l.scale.setScalar(1 + (tmp.scale.x - 1) * k); }); layoutDone(l, i);
    glow.material.opacity = 0; E.setProgress(ORDER.length, done.length);
  }
  return async () => {
    E.setProgress(ORDER.length, 0);
    for (let i = 0; i < ORDER.length; i++) await oneLetter(ORDER[i], i === 0);
    const names = ORDER.map(k => E.LETTERS[k].name);
    return { stars: offTries <= 4 ? 3 : 2, line: 'You felt ' + names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] + '!' };
  };
}
