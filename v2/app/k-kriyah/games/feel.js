/* Game 2: Feel the Shape (touch only, NOT writing: there is no writing in Kindergarten).
   Skill: knows the shape of Alef, Beis and Veis by feeling it. He runs his finger along a glowing road on the big 3D letter;
   the road turns gold where he has been, an orange ring shows where to go next, the letter glows, and its name and sound play.
   Tapping along the road works too. If his finger wanders off, a kind voice and the hand show him the ring. */
export default function setup(E) {
  const { THREE, S } = E;
  /* the path along each letter, in font units (1000 per em, y up), stroke by stroke */
  const BEIS = [[[78, 612], [84, 515], [200, 500], [320, 500], [425, 478], [446, 380], [446, 275], [446, 170], [430, 91], [320, 91], [205, 91], [90, 91]]];
  const PATHS = {
    alef: [[[78, 600], [112, 500], [160, 440], [240, 370], [330, 290], [436, 197], [515, 85]],
      [[424, 612], [458, 520], [520, 468], [505, 360], [470, 280]],
      [[112, 330], [80, 240], [96, 140], [120, 45]]],
    beis: BEIS, veis: BEIS,
  };
  const ORDER = ['alef', 'beis', 'veis'];
  let H = 3.2; const holder = new THREE.Group(); E.scene.add(holder);
  const boy = E.mendy(); E.scene.add(boy);
  const done = []; let cur = null, beads = [], next = 0, demo = false, active = false, lastHelp = 0, wander = 0, offTries = 0;
  /* the path is a soft glowing road along the letter (never dots: a dot on Beis means the dagesh); the part he has felt
     turns gold, and a pulsing ring shows where to go next */
  const roadM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfe4ff, emissiveIntensity: .7, roughness: .3, transparent: true, opacity: .55 });
  const goldM = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffb300, emissiveIntensity: 1.0, roughness: .3 });
  const target = new THREE.Mesh(new THREE.TorusGeometry(1, .22, 12, 32), new THREE.MeshStandardMaterial({ color: 0xff8a00, emissive: 0xff8a00, emissiveIntensity: 1.2 }));
  let roads = [], golds = [];
  const glow = E.glowSprite('#fff4b0', 7, 0); glow.position.set(0, 0, -.6); holder.add(glow);
  E.onLayout(p => {
    H = p ? 2.7 : 3.2;
    if (p) { E.camBase.set(0, 2.4, 10.5); E.camTarget.set(0, 2.1, 0); holder.position.set(0, 2.5, .8); boy.position.set(-1.25, 0, 2.2); boy.scale.setScalar(.8); }
    else { E.camBase.set(0, 2.6, 9.5); E.camTarget.set(0, 1.6, 0); holder.position.set(0, 1.95, .8); boy.position.set(-3.6, 0, 1.4); boy.scale.setScalar(1); }
    done.forEach(layoutDone);
  });
  function layoutDone(l, i) { if (E.portrait) l.position.set(1.3 - i * 1.3, 4.55, 0); else l.position.set(4.4 - i * 1.2, .62, 1.3); l.scale.setScalar(E.portrait ? .3 : .34); }
  E.onFrame(t => {
    if (cur && !cur.userData.spin) cur.rotation.y = Math.sin(t * .7) * .12;
    if (target.parent) { const b = beads[next]; target.visible = !!b && active; if (b) { target.position.copy(b.position); target.scale.setScalar(.16 * H / 3.2 * (1 + Math.sin(t * 7) * .15)); } }
    done.forEach((l, i) => l.rotation.y = Math.sin(t * 1.2 + i) * .3);
  });
  const strokeStarts = () => { const s = []; let n = 0; PATHS[cur.userData.key].forEach(st => { s.push(n); n += st.length; }); return s; };
  function makeBeads(key) {
    beads = []; roads.forEach(r => r.parent && r.parent.remove(r)); golds.forEach(r => r.parent && r.parent.remove(r)); roads = []; golds = [];
    const z = 20 / 2 * (H / 64.7) + .06;
    PATHS[key].forEach((st, si) => {
      const pts = st.map(([x, y]) => { const p = E.fontToLocal(key, H, x, y); p.z = z; return p; });
      pts.forEach((p, i) => { const b = new THREE.Object3D(); b.position.copy(p); b.userData = { stroke: si, first: i === 0, idx: i }; cur.add(b); beads.push(b); });
      const road = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, .06 * H / 3.2, 10, false), roadM); cur.add(road); roads.push(road);
    });
    cur.add(target); next = 0;
  }
  function paintGold() {
    golds.forEach(r => r.parent && r.parent.remove(r)); golds = [];
    PATHS[cur.userData.key].forEach((st, si) => { const lit = beads.filter((b, i) => b.userData.stroke === si && i < next).map(b => b.position.clone().setZ(b.position.z + .01));
      if (lit.length >= 2) { const g = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lit), 40, .085 * H / 3.2, 10, false), goldM); cur.add(g); golds.push(g); } });
  }
  const beadScreen = i => E.toScreen(E.worldPos(beads[i]));
  const near = (e, i, tolPx) => { const [x, y] = beadScreen(i); return Math.hypot(e.clientX - x, e.clientY - y) < tolPx; };
  const tol = () => Math.max(46, Math.min(innerWidth, innerHeight) * .075);
  let resolveLetter = null, down = false;
  function light(i) { const b = beads[i]; E.sfx.tick(); E.sparkle(E.worldPos(b), 4, .5); next = i + 1; paintGold(); glow.material.opacity = .15 + .6 * next / beads.length;
    if (next >= beads.length && resolveLetter) { const r = resolveLetter; resolveLetter = null; r(); } }
  async function help() { const now = performance.now(); if (now - lastHelp < 4000 * E.F) return; lastHelp = now; offTries++; E.sfx.boop(); boy.mood('think');
    const [x, y] = beadScreen(next); E.hand.at(x, y, true); await E.say(beads[next].userData.first && next > 0 ? 'Now start at the orange ring.' : 'Follow the glowing road to the orange ring.'); boy.mood('calm'); setTimeout(() => { if (active) E.hand.hide(); }, 1500 * E.F); }
  E.onPointer('down', e => { if (!active || demo) return; down = true; wander = 0; if (near(e, next, tol())) { E.hand.hide(); light(next); } else if (!beads.some((b, i) => i < next && near(e, i, tol()))) help(); });
  E.onPointer('move', e => { if (!active || demo || !down) return;
    if (next < beads.length && near(e, next, tol())) { light(next); wander = 0; return; }
    /* skipping past the next dot: allow it only within the same stroke, by a little */
    if (next + 1 < beads.length && beads[next + 1].userData.stroke === beads[next].userData.stroke && near(e, next + 1, tol() * .8)) { light(next); light(next); wander = 0; return; }
    const onPath = beads.some((b, i) => near(e, i, tol() * 1.6)); if (!onPath && ++wander > 12) { wander = -40; help(); } });
  E.onPointer('up', () => { down = false; });
  window.__info = () => ({ key: cur && cur.userData.key, active: active && !demo, next, total: beads.length, beads: beads.map((b, i) => beadScreen(i)), off: offTries });

  async function oneLetter(key, first) {
    cur = E.letter(key, H); cur.position.set(0, 0, 0); holder.add(cur); makeBeads(key); glow.material.opacity = .12;
    E.sfx.whoosh(); await E.popIn(cur, 1, 500);
    await E.say(key === 'alef' ? 'This is Alef. Let’s feel its shape.' : key === 'beis' ? 'This is Beis, with Mendy’s dot. Feel it!' : 'This is Veis. No dot. Feel it!');
    if (first) {
      demo = true; active = true; await E.say('Watch me. I follow the glowing road.');
      const st = PATHS[key][0].length; let [x, y] = beadScreen(0); E.hand.at(x, y); await E.wait(300);
      for (let i = 0; i < st; i++) { const [a, b] = beadScreen(i); await E.tween(260, k => E.hand.at(x + (a - x) * k, y + (b - y) * k), E.ease.lin); x = a; y = b; light(i); }
      E.hand.hide(); await E.wait(300); next = 0; paintGold(); glow.material.opacity = .12; demo = false;
      await E.say('Now you! Put your finger on the orange ring.');
    } else await E.say('Start at the orange ring.');
    active = true; document.body.dataset.feelReady = key;
    const starts = strokeStarts(); let said = new Set([0]);
    const fin = new Promise(r => resolveLetter = r);
    /* when a stroke is finished and another begins, tell him where */
    const iv = setInterval(() => { if (!active) return; if (starts.includes(next) && !said.has(next) && next < beads.length) { said.add(next); E.say('Now go to the orange ring!'); const [x, y] = beadScreen(next); E.hand.at(x, y, true); setTimeout(() => E.hand.hide(), 1400 * E.F); } }, 200);
    await fin; clearInterval(iv); active = false; delete document.body.dataset.feelReady;
    /* the whole letter glows, spins, and says its name and sound */
    cur.userData.spin = true; E.joy(E.worldPos(cur).add(new THREE.Vector3(0, 0, .8)), true); boy.mood('cheer');
    const r0 = cur.rotation.y; await E.tween(900, k => { cur.rotation.y = r0 + k * Math.PI * 2; glow.material.opacity = .8; }, E.ease.out); cur.userData.spin = false; cur.rotation.y = 0;
    await E.say(key === 'alef' ? 'Alef! Alef is quiet.' : key === 'beis' ? ['Beis! Beis says', S('b')] : ['Veis! Veis says', S('v')]); boy.mood('calm');
    /* it moves to the side, so he sees the ones he has done */
    [...beads, ...roads, ...golds, target].forEach(b => b.parent && b.parent.remove(b)); beads = []; roads = []; golds = []; const l = cur; cur = null; holder.remove(l); E.scene.add(l); l.position.copy(holder.position);
    const i = done.length; done.push(l); const p0 = l.position.clone(); const tmp = new THREE.Object3D(); layoutDone(tmp, i);
    await E.tween(600, k => { l.position.lerpVectors(p0, tmp.position, k); l.scale.setScalar(1 + (tmp.scale.x - 1) * k); }); layoutDone(l, i);
    glow.material.opacity = 0; E.setProgress(3, done.length);
  }
  return async () => {
    E.setProgress(3, 0);
    for (let i = 0; i < ORDER.length; i++) await oneLetter(ORDER[i], i === 0);
    return { stars: offTries <= 4 ? 3 : 2, line: 'You felt Alef, Beis and Veis!' };
  };
}
