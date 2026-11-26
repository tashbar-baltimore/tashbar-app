/* Kindergarten ABC 2.0: the letter worlds for the letter kit (MAP.md: "each letter turns into its picture as it is traced").
   s: the snake's garden pond, a: the apple orchard (both from the look sample Esti approved, worlds.js; the apple friend with a face
   is not shown: no faces on objects). New here:
   t: the Ticking Tree: a tall tree grows down into the stem of t, a branch grows across, and a little woodpecker taps t-t-t.
   p: Pinwheel Hill: a wooden stick grows down, then a bright pinwheel grows around the bowl of p, and spins with a puff of p.
   Every world gives: { name, strokes, focus, P, hero, heroPos, appear, sound, soundStart, soundStop, demo, grow(T), reset, showAll, cheer, poke }. */
import { THREE, C, rnd, clamp, smooth, ease, toon, glow, aura, growTube, audio, eye, eyesTick, blob } from './kit3d.js';
import { worldS, worldA } from './worlds.js';
import { base, tree, rock, stump } from './scenes.js';
import { LETTERS } from './letters.js';
import { strokePoints } from './kit3d.js';

export const LW = {
  s: { word: 'snake', make: S => { const W = worldS(S); W.P = W.party; return W; }, mouth: 's', action: 'Wiggle like a snake! Sss!', rhyme: ['Curve around, then curve back.', 'Sss, the snake!'] },
  a: { word: 'apple', make: S => { const W = worldA(S); W.P = W.party; W.appear = async () => {}; W.poke = () => { W.P.twinkle(new THREE.Vector3(0, 3, 0.5), 4); audio.vowelA(400); }; W.hero = null; return W; },
    mouth: 'a', action: 'Pretend to crunch an apple!', rhyme: ['Around like an apple, then up and down.'] },
  t: { word: 'tree', make: S => worldT(S), mouth: 't', action: 'Tick tock like a clock!', rhyme: ['Down the tall trunk, then a branch across.'] },
  p: { word: 'pinwheel', make: S => worldP(S), mouth: 'p', action: 'Pop your lips like a bubble!', rhyme: ['Down the stick, up, and around the pinwheel.'] }
};

function common(S, W, strokes, parts) {
  /* parts: per stroke { geo (growTube geometry), pops: [...] } ; grow per stroke by T.strokeProgress */
  W.strokes = strokes; W.focus = { target: new THREE.Vector3(0, 2.75, 0) };
  const set = (si, k) => { parts[si].geo.userData.grow(k); (parts[si].pops || []).forEach(o => { const on = o.t <= k + 0.001 && k > 0; if (on && !o.on && W.onPop) W.onPop(o); o.on = on; }); };
  W.set = set;
  W.grow = T => { for (let i = 0; i < parts.length; i++) set(i, i < T.si ? 1 : i === T.si ? (T.done ? 1 : T.strokeProgress()) : 0); if (T.done) parts.forEach((p, i) => set(i, 1)); };
  W.demo = async () => { for (let i = 0; i < parts.length; i++) { W.soundStart(); await S.tween(i === 0 ? 1800 : 1300, e => { set(i, e); W.demoTick && W.demoTick(i, e); }, ease.inOut); W.soundStop(); await S.wait(200); } };
  W.reset = () => S.tween(450, e => parts.forEach((p, i) => set(i, 1 - e)), ease.inOut);
  W.showAll = () => parts.forEach((p, i) => set(i, 1));
  S.tick((t, dt) => parts.forEach(p => (p.pops || []).forEach(o => { o.k += ((o.on ? 1 : 0) - o.k) * Math.min(1, dt * 7); const e = o.on ? ease.elastic(clamp(o.k, 0, 1)) : o.k; o.G.scale.setScalar(Math.max(0.0001, e)); })));
  return W;
}

/* ============================== t: the Ticking Tree ============================== */
export function worldT(S) {
  const { P } = base(S, 'golden', { clearW: 5 }); tree(S, -9, -6, { s: 1.6, c1: 0x3E9E3A, c2: 0xC8E04A }); tree(S, 9, -7, { s: 1.5, c1: 0x5AAE2A, c2: 0xF2C84A }); tree(S, 13, -3, { s: 1.3 }); rock(S, 5.5, 1.5, 0.5, 0xF0D8C8);
  const strokes = LETTERS.t.map(d => strokePoints(d, 0.05)), W = { name: 't', P, camFrom: new THREE.Vector3(4, 6, 22) };
  aura(S, new THREE.Vector3(0, 2.75, 0), 6, 6, 0xFFF6D0, 0.25);
  const bark = C(0x9C5A2E), barkL = C(0xC88850);
  const trunkG = growTube(strokes[0], t => 0.27 * (1 - t * 0.25), (t, n, c) => c.copy(bark).lerp(barkL, (Math.sin(t * 40) * 0.5 + 0.5) * 0.3 + clamp(n.z, 0, 1) * 0.2), 16);
  const branchG = growTube(strokes[1], t => 0.17, (t, n, c) => c.copy(bark).lerp(barkL, 0.3 + clamp(n.z, 0, 1) * 0.2), 12);
  const bm = toon(0xffffff, { vc: true, rough: 0.7, clear: 0.1, rim: 0xFFE0B0, rimI: 0.5 });
  [trunkG, branchG].forEach(g => { const m = new THREE.Mesh(g, bm); m.castShadow = true; S.scene.add(m); g.userData.grow(0); });
  /* leaves pop out along the branch and at the top of the trunk */
  const leafM = toon(0x4CC452, { rough: .5, sheen: .8, sheenC: 0xEFFFB0 }), pops = [[], []];
  const leaf = (at, s) => { const G = new THREE.Group(); [0, 1, 2].forEach(i => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.26 * s, 16, 12), leafM); b.position.set((i - 1) * 0.2 * s, Math.abs(i - 1) * -0.06, 0); b.castShadow = true; G.add(b); }); G.position.copy(at); G.position.z += 0.1; G.scale.setScalar(0.0001); S.scene.add(G); return G; };
  for (let i = 4; i < strokes[1].length; i += 6) pops[1].push({ G: leaf(strokes[1][i].clone().add(new THREE.Vector3(0, 0.22, 0)), 1), t: i / (strokes[1].length - 1), k: 0, on: false });
  pops[0].push({ G: leaf(strokes[0][0].clone().add(new THREE.Vector3(0, 0.25, 0)), 1.3), t: 0.02, k: 0, on: false });
  /* the woodpecker: round, red cap, kind eyes; it hops to where the tree is growing and taps */
  const bird = new THREE.Group(), body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), toon(0x3D6BE8, { clear: 1, rough: .3 })); body.scale.set(1, 1.1, 0.9); bird.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 12), toon(0xFFF1D6)); belly.position.set(0, -0.06, 0.13); bird.add(belly);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xE8303A, { clear: 1 })); cap.position.y = 0.2; bird.add(cap);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.26, 12), toon(0xFFB020)); beak.rotation.z = -Math.PI / 2; beak.position.set(0.3, 0.08, 0.05); bird.add(beak);
  const eyes = [-1, 1].map(s => { const e = eye(0.07, { iris: 0x1A1A2A }); e.position.set(0.14 + (s > 0 ? 0.0 : -0.1), 0.12, s * 0.16 + 0.12); bird.add(e); return e; });
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); bird.add(hit);
  bird.scale.setScalar(0.0001); S.scene.add(bird); eyesTick(S, eyes, () => S.lookTarget);
  let birdS = 0, peck = 0, dance = 0, at = new THREE.Vector3(1.4, 4.2, 0.3);
  S.tick((t, dt) => { peck = Math.max(0, peck - dt * 5); dance = Math.max(0, dance - dt);
    bird.position.lerp(at, Math.min(1, dt * 6)); bird.scale.setScalar(Math.max(0.0001, birdS * 1.1)); bird.rotation.z = -Math.sin(peck * Math.PI) * 0.5 + (dance > 0 ? Math.sin(t * 12) * 0.3 : 0); bird.position.y += dance > 0 ? Math.abs(Math.sin(t * 10)) * 0.2 : Math.sin(t * 2) * 0.02; });
  let lastTap = -9;
  Object.assign(W, { hero: hit, heroPos: () => bird.position.clone(),
    appear: () => S.tween(600, e => birdS = e, ease.elastic),
    sound: () => { peck = 1; return audio.tick(); },
    soundStart: () => { if (S.t - lastTap > 0.4) { lastTap = S.t; peck = 1; audio.tick(); } }, soundStop: () => {},
    cheer: () => { dance = 2; P.burst(new THREE.Vector3(0, 3.6, 0.6)); audio.party(); },
    poke: () => { dance = 0.6; peck = 1; audio.tick(); P.twinkle(bird.position, 4); } });
  common(S, W, strokes, [{ geo: trunkG, pops: pops[0] }, { geo: branchG, pops: pops[1] }]);
  /* the bird follows the growing tip and taps */
  const g0 = W.grow, follow = (si, k) => { const P2 = strokes[si], i = Math.min(P2.length - 1, Math.floor(k * (P2.length - 1))); at.copy(P2[i]).add(new THREE.Vector3(0.42, 0.1, 0.35)); if (S.t - lastTap > 0.4) { lastTap = S.t; peck = 1; audio.tick(); } };
  W.grow = T => { g0(T); follow(T.si, T.done ? 1 : T.strokeProgress()); };
  W.demoTick = (si, e) => follow(si, e);
  W.onPop = () => audio.pop();
  return W;
}

/* ============================== p: Pinwheel Hill ============================== */
export function worldP(S) {
  const { P } = base(S, 'hills', { clearW: 5 }); tree(S, -9.5, -6, { s: 1.5 }); tree(S, 9, -6.5, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F });
  const strokes = LETTERS.p.map(d => strokePoints(d, 0.05)), W = { name: 'p', P, camFrom: new THREE.Vector3(-4, 6, 22) };
  aura(S, new THREE.Vector3(0, 2.4, 0), 6, 6, 0xFFF6D0, 0.25);
  const stickG = growTube(strokes[0], t => 0.15, (t, n, c) => c.set(0xE8B070).lerp(C(0xFFE0B0), clamp(n.z, 0, 1) * 0.4), 12);
  const ribbon = [0xFF4F6D, 0xFFB020, 0xFFE14D, 0x4DDB6A, 0x4DB2FF, 0xB46BFF].map(C);
  const bowlG = growTube(strokes[1], t => 0.19, (t, n, c) => c.copy(ribbon[Math.floor(t * 5.99)]).lerp(C(0xffffff), clamp(n.z, 0, 1) * 0.25), 14);
  const sm = toon(0xffffff, { vc: true, rough: 0.5, clear: 0.6, rimI: 0.5 }), rm = toon(0xffffff, { vc: true, rough: 0.25, clear: 1, rimI: 0.6, emissive: 0x222222 });
  const stick = new THREE.Mesh(stickG, sm), bowl = new THREE.Mesh(bowlG, rm); [stick, bowl].forEach(m => { m.castShadow = true; S.scene.add(m); }); stickG.userData.grow(0); bowlG.userData.grow(0);
  /* pinwheel blades pop out around the bowl; when finished they spin */
  const c0 = new THREE.Vector3(); strokes[1].forEach(p => c0.add(p)); c0.divideScalar(strokes[1].length); c0.x += 0.05;
  const wheel = new THREE.Group(); wheel.position.copy(c0); wheel.position.z = 0.15; S.scene.add(wheel); const pops = [];
  for (let i = 0; i < 6; i++) { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(0.42, 0.06, 0.5, 0.42); sh.lineTo(0.06, 0.12); sh.closePath();
    const b = new THREE.Mesh(new THREE.ShapeGeometry(sh, 10), toon(ribbon[i], { side: THREE.DoubleSide, clear: 1, rough: .3, emissive: ribbon[i], ei: 0.15 })); const G = new THREE.Group(); G.add(b); G.rotation.z = i / 6 * Math.PI * 2; G.scale.setScalar(0.0001); wheel.add(G);
    pops.push({ G, t: 0.1 + i / 6 * 0.85, k: 0, on: false }); }
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), toon(0xFFD23F, { clear: 1 })); wheel.add(pin);
  const hit = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); wheel.add(hit);
  let spin = 0, spinV = 0;
  /* soft bubbles float up from the pinwheel when it spins */
  const bub = []; const bm = toon(0xDDF4FF, { transparent: true, opacity: 0.45, rough: 0.05, clear: 1, rim: 0xFFFFFF, rimI: 1.2 });
  for (let i = 0; i < 12; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), bm); b.visible = false; S.scene.add(b); bub.push({ b, life: 0, v: new THREE.Vector3() }); }
  const blow = n => { let c = 0; bub.forEach(o => { if (o.life > 0 || c >= n) return; c++; o.life = rnd(1.5, 2.5); o.b.position.copy(c0).add(new THREE.Vector3(rnd(-.4, .4), rnd(-.4, .4), 0.3)); o.v.set(rnd(-0.6, 0.6), rnd(0.5, 1.2), rnd(0, 0.3)); o.b.scale.setScalar(rnd(0.6, 1.4)); o.b.visible = true; }); };
  S.tick((t, dt) => { spinV *= Math.pow(0.4, dt); spin += (spinV + 0.15) * dt; wheel.rotation.z = -spin;
    bub.forEach(o => { if (o.life <= 0) return; o.life -= dt; o.b.position.addScaledVector(o.v, dt); if (o.life <= 0) { o.b.visible = false; audio.pop(); } }); });
  let lastPuff = -9;
  Object.assign(W, { hero: hit, heroPos: () => c0.clone(),
    appear: async () => {},
    sound: () => { spinV = 6; blow(2); return audio.puff(); },
    soundStart: () => { if (S.t - lastPuff > 0.5) { lastPuff = S.t; spinV = 4; audio.puff(); } }, soundStop: () => {},
    cheer: () => { spinV = 14; blow(10); P.burst(c0.clone().add(new THREE.Vector3(0, 0.5, 0.5))); audio.party(); },
    poke: () => { spinV = 10; blow(4); audio.puff(); } });
  common(S, W, strokes, [{ geo: stickG, pops: [] }, { geo: bowlG, pops }]);
  W.onPop = o => { audio.pop(); P.twinkle(c0, 2); };
  return W;
}

/* a mouth picture (drawn, kind and simple) that shows how to say the sound: s teeth together, a open, t tongue tip up, p lips together */
export function mouthCard(S, kind) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#FFF8EC'; x.beginPath(); x.arc(128, 128, 124, 0, 7); x.fill(); x.lineWidth = 8; x.strokeStyle = '#FFC98A'; x.stroke();
  x.fillStyle = '#F6C9A8'; x.beginPath(); x.ellipse(128, 132, 96, 80, 0, 0, 7); x.fill();
  const lip = '#D9667A', open = kind === 'a' ? 46 : kind === 's' ? 16 : kind === 't' ? 20 : 4;
  x.fillStyle = '#7A2A3A'; x.beginPath(); x.ellipse(128, 140, 52, Math.max(3, open), 0, 0, 7); x.fill();
  if (kind === 's' || kind === 't') { x.fillStyle = '#FFFFFF'; x.fillRect(84, 140 - open + 2, 88, open - 4); }
  if (kind === 't') { x.fillStyle = '#E87A8A'; x.beginPath(); x.ellipse(128, 136, 22, 10, 0, 0, 7); x.fill(); }
  if (kind === 'a') { x.fillStyle = '#E87A8A'; x.beginPath(); x.ellipse(128, 168, 30, 14, 0, 0, 7); x.fill(); x.fillStyle = '#FFFFFF'; x.fillRect(96, 96, 64, 12); }
  x.strokeStyle = lip; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.ellipse(128, 140, 58, Math.max(8, open + 6), 0, 0, 7); x.stroke();
  if (kind === 'p') { x.strokeStyle = '#9FD8FF'; x.lineWidth = 6; [0, 1, 2].forEach(i => { x.beginPath(); x.arc(190, 140, 14 + i * 14, -0.6, 0.6); x.stroke(); }); }
  if (kind === 's') { x.strokeStyle = '#9FD8FF'; x.lineWidth = 5; x.beginPath(); x.moveTo(190, 120); for (let i = 0; i < 4; i++) x.quadraticCurveTo(200 + i * 10, 112 + (i % 2) * 24, 206 + i * 10, 136); x.stroke(); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.CircleGeometry(0.9, 48), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.07, 10, 48), toon(0xFFC93C, { clear: 1 })); m.add(ring); m.scale.setScalar(0.0001); S.scene.add(m); return m;
}
