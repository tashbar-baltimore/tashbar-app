/* Kindergarten ABC 2.0 — the letter worlds (graphics sample, Esti 2026-11-24: "every letter gets its OWN little world that matches its picture").
   s: the snake's garden pond (lily pads, a rainbow, butterflies). a: the apple orchard (rows of apple trees, a crate, a fence, a cheerful apple friend).
   Each world returns: { strokes, focus, hero, lines, demo(), grow(T), reset(), cheer(), sound() } used by look.html. */
import { THREE, C, rnd, clamp, smooth, ease, toon, glow, merge, M4, sky, clouds, hills, ground, grass, forest, flowers, flowerGeo, sparkles, butterflies, party,
  eye, eyesTick, blob, aura, STROKES, strokePoints, growTube, audio } from './kit3d.js';

/* CALM (Esti 2026-11-24, after looking at kindergarten games: "a careful balance ... engaging, but not too overwhelming"):
   a soft, simple background that fades into the distance, few small things, so the letter and the friend stand out.
   ?busy=1 shows the first, busier look for comparison. */
const CALM = !/[?&]busy=1/.test(location.search), PLAIN = /[?&]plain=1/.test(location.search);   /* plain=1: smooth lawn, no grass blades (a second, even simpler option) */
/* ---------- shared scenery ---------- */
function tree(S, x, z, o = {}) {
  const s = o.s || 1, H = S.groundH(x, z), G = new THREE.Group(); G.position.set(x, H - 0.05, z); G.rotation.y = rnd(0, 6);
  const th = (o.h || 2.4) * s, tg = new THREE.CylinderGeometry(0.17 * s, 0.32 * s, th, 12, 6); tg.translate(0, th / 2, 0);
  const tp = tg.attributes.position; for (let i = 0; i < tp.count; i++) { const y = tp.getY(i); tp.setX(i, tp.getX(i) + Math.sin(y * 1.3) * 0.12 * s); } tg.computeVertexNormals();
  const trunk = new THREE.Mesh(tg, toon(o.bark || 0x9C5A2E, { rough: 0.85, clear: 0, rimI: 0.25, rim: 0xFFD7A0 })); trunk.castShadow = true; trunk.receiveShadow = true; G.add(trunk);
  const c1 = C(o.c1 || 0x1E9E46), c2 = C(o.c2 || 0x8BE04A), parts = [], sg = new THREE.SphereGeometry(1, 22, 16), cy = th + 0.75 * s, n = o.puffs || 9;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + rnd(-.3, .3), rr = i === 0 ? 0 : rnd(0.7, 1.15) * s, r = (i === 0 ? 1.35 : rnd(0.75, 1.05)) * s * (o.crown || 1);
    parts.push({ g: sg, m: M4(Math.cos(a) * rr, cy + rnd(-0.35, 0.65) * s + (i === 0 ? 0.25 * s : 0), Math.sin(a) * rr, r, r * 0.92, r) }); }
  const tmp = new THREE.Color(), crown = new THREE.Mesh(merge(parts.map(p => ({ g: p.g, m: p.m, color: (X, Y, Z) => tmp.copy(c1).lerp(c2, smooth(cy - 1.1 * s, cy + 1.6 * s, Y + X * 0.15 + Z * 0.1)).offsetHSL(0, 0, rnd(-0.015, 0.015)).clone() }))),
    toon(0xffffff, { vc: true, rough: 0.62, clear: 0.15, sheen: 0.7, sheenC: o.sheen || 0xEFFFB0, rim: o.rim || 0xFFF6C8, rimI: 0.42, rimP: 2.2 }));
  crown.castShadow = true; crown.receiveShadow = true; G.add(crown); S.scene.add(G);
  G.userData = { crown, cy, s, wob: 0 };
  return G;
}
function wobbleTrees(S, trees) { S.tick((t, dt) => trees.forEach(T => { const u = T.userData; u.wob = Math.max(0, u.wob - dt * 1.6); const k = u.wob * u.wob;
  T.rotation.z = Math.sin(t * 22) * 0.05 * k + Math.sin(t * 0.9 + T.position.x) * 0.006; u.crown.scale.set(1 + Math.sin(t * 25) * 0.05 * k, 1 - Math.sin(t * 25) * 0.04 * k, 1); })); }
function rock(S, x, z, r, color) {
  const g = new THREE.SphereGeometry(1, 20, 14), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setY(i, y > 0 ? y * 0.6 : y * 0.3); p.setX(i, p.getX(i) * (1 + Math.sin(i) * 0.04)); } g.computeVertexNormals();
  const m = new THREE.Mesh(g, toon(color, { rough: 0.6, clear: 0.25, rimI: 0.35, rim: 0xFFF0FF, sheen: 0.3 })); m.scale.setScalar(r); m.position.set(x, S.groundH(x, z) + r * 0.15, z); m.rotation.y = rnd(0, 6); m.castShadow = m.receiveShadow = true; S.scene.add(m); return m;
}
function mushroom(S, x, z, s = 1) {
  const G = new THREE.Group(), st = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.17, 0.45, 12), toon(0xFFF3DC, { rough: .6 })); st.position.y = 0.22;
  const capG = new THREE.SphereGeometry(0.36, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), cap = new THREE.Mesh(capG, toon(0xFF3347, { rough: .3, clear: .8, rimI: .4, rim: 0xFFC0C0 })); cap.scale.y = 0.75; cap.position.y = 0.42;
  G.add(st, cap); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + rnd(0, .5), d = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 6), toon(0xffffff)); d.position.set(Math.cos(a) * 0.24, 0.42 + 0.17, Math.sin(a) * 0.24); d.scale.y = 0.4; G.add(d); }
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 6), toon(0xffffff)); top.position.y = 0.69; top.scale.y = 0.4; G.add(top);
  G.position.set(x, S.groundH(x, z), z); G.scale.setScalar(s); G.traverse(o => { if (o.isMesh) o.castShadow = true; }); S.scene.add(G); return G;
}
function face(G, o) {   /* cheeks + smile + eyes on a character head */
  const eyes = [-1, 1].map(sx => { const E = eye(o.er, { iris: o.iris }); E.position.set(sx * o.ex, o.ey, o.ez); E.rotation.y = sx * 0.18; G.add(E); return E; });
  const cheekM = toon(0xFF6F9E, { rough: .5, emissive: 0xFF3F7F, ei: 0.45, rimI: 0 });
  [-1, 1].forEach(sx => { const c = new THREE.Mesh(new THREE.SphereGeometry(o.cr, 16, 10), cheekM); c.position.set(sx * o.cx, o.cy, o.cz); c.scale.set(1, 0.6, 0.35); c.rotation.y = sx * 0.5; G.add(c); });
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(o.mr, o.mr * 0.17, 8, 24, Math.PI), toon(0x4A1A1A, { rough: .4, rimI: 0 })); mouth.rotation.z = Math.PI; mouth.position.set(0, o.my, o.mz); G.add(mouth);
  const open = new THREE.Mesh(new THREE.SphereGeometry(o.mr * 0.8, 16, 10), toon(0x8A1E2E, { rough: .4, rimI: 0 })); open.scale.set(1, 0.01, 0.3); open.position.set(0, o.my - o.mr * 0.35, o.mz - 0.01); G.add(open);
  return { eyes, mouth, open };
}

/* ============================== s: the snake's garden pond ============================== */
export function worldS(S) {
  const pond = { x: -8.5, z: -7, r: 4.6 };
  const H = (x, z) => hills(x, z) - 0.9 * (1 - smooth(pond.r * 0.55, pond.r + 0.6, Math.hypot(x - pond.x, (z - pond.z) * 1.15)));
  sky(S, { top: 0x1C64F2, mid: 0x4DB8FF, hor: 0xFFD4C4, fog: 0xC9E6FF, sunDir: [0.42, 0.3, -1], hemiSky: 0xBEE3FF, hemiGround: 0x4FBF4A, fogNear: CALM ? 14 : 40, fogFar: CALM ? 75 : 170 });
  clouds(S, CALM ? 4 : 9, { rim: 0xFFE4F4 });
  ground(S, { height: H, g1: 0x2FB34C, g2: 0x7FD83F, g3: 0x23A374, g4: 0x9BD96A,
    paint: (x, z, c) => { const d = Math.hypot(x - pond.x, (z - pond.z) * 1.15); if (d < pond.r + 1) c.lerp(C(0xE8D49A), smooth(pond.r + 1, pond.r - 0.2, d) * 0.85); } });
  if (!CALM) forest(S);
  const inPond = (x, z) => Math.hypot(x - pond.x, (z - pond.z) * 1.15) < pond.r + 0.5;
  grass(S, { colors: [0x16A34A, 0x2CC45C, 0x5BD93F, 0x9BE83A, 0x22B07A, 0x46C94E], tip: 0xF2FF8C, skip: inPond, count: PLAIN || CALM ? 1 : 16000, tall: CALM ? 0.6 : 1 });
  flowers(S, { count: CALM ? 12 : 230, size: CALM ? 1.1 : 1.3, skip: (x, z) => inPond(x, z) || (Math.abs(x) < (CALM ? 5 : 3.5) && z > -2 && z < 3), colors: [0xFF4FA3, 0xFF7A45, 0xFFD23F, 0xB46BFF, 0xffffff, 0x4FC3FF, 0xFF5577] });

  /* the pond: deep turquoise, moving light lines, a foamy edge, sun sparkles */
  const U = { uTime: { value: 0 }, deep: { value: C(0x0C7FB8) }, shallow: { value: C(0x34E0D2) }, foam: { value: C(0xF4FFFF) } };
  const wm = new THREE.ShaderMaterial({ uniforms: U, transparent: true, fog: false,
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform float uTime; uniform vec3 deep, shallow, foam; varying vec2 vUv; varying vec3 vW;
      void main(){ vec2 p = vW.xz; vec2 q = vUv - 0.5; float r = length(q) * 2.0;
        vec3 c = mix(deep, shallow, smoothstep(0.15, 0.95, r));
        float w = sin(p.x*2.6 + uTime*1.2) * sin(p.y*3.1 - uTime*0.9) + 0.5*sin((p.x + p.y)*4.7 + uTime*1.8);
        c += vec3(0.55, 0.95, 1.0) * smoothstep(0.62, 0.95, w*0.5 + 0.5) * 0.32;
        float a = atan(q.y, q.x); float rim = smoothstep(0.80, 0.92, r + 0.03*sin(a*9.0 + uTime*1.6));
        c = mix(c, foam, rim * 0.9);
        float sp = pow(max(0.0, sin(p.x*8.0 + uTime*2.6) * sin(p.y*10.0 - uTime*2.1)), 60.0);
        c += vec3(2.5) * sp * step(0.6, sin(p.x*1.7 - uTime*0.7) * sin(p.y*1.3 + uTime*0.5)) * (1.0 - rim);
        gl_FragColor = vec4(c, 1.0 - smoothstep(0.95, 1.0, r));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const water = new THREE.Mesh(new THREE.CircleGeometry(pond.r + 0.15, 64), wm); water.rotation.x = -Math.PI / 2; water.scale.y = 1 / 1.15; water.position.set(pond.x, -0.2, pond.z); S.scene.add(water);
  S.tick(t => U.uTime.value = t);
  /* lily pads with a pink water flower */
  const padG = new THREE.CircleGeometry(0.62, 32, 0.25, Math.PI * 2 - 0.5); padG.rotateX(-Math.PI / 2);
  const padM = toon(0x2FBF4E, { rough: .45, clear: .6, side: THREE.DoubleSide, rim: 0xD8FF9A, rimI: .5 }), pads = [];
  [[-6.6, -5.2, 1], [-9.8, -6.1, .8], [-7.9, -8.3, 1.2], [-10.2, -8.6, .7], [-5.9, -7.6, .75]].forEach(([x, z, s], i) => { const p = new THREE.Mesh(padG, padM); p.position.set(x, -0.15, z); p.scale.setScalar(s); p.rotation.y = i * 1.7; p.receiveShadow = true; S.scene.add(p); pads.push(p); });
  const lotus = new THREE.Mesh(flowerGeo(8), toon(0xFF6FB5, { side: THREE.DoubleSide, emissive: 0xFF3D9A, ei: 0.25, sheen: .8 })); lotus.scale.setScalar(0.42); lotus.position.set(-7.9, -0.06, -8.3); S.scene.add(lotus);
  const lc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), toon(0xFFE14D, { emissive: 0xFFB000, ei: .6 })); lc.position.set(-7.9, 0.02, -8.3); S.scene.add(lc);
  S.tick(t => pads.forEach((p, i) => { p.position.y = -0.15 + Math.sin(t * 1.3 + i) * 0.02; p.rotation.y += 0.0008 * (i % 2 ? 1 : -1); }));
  /* stones around the pond */
  for (let i = 0; i < (CALM ? 8 : 13); i++) { const a = -0.4 + i / 13 * 5.4, r = pond.r + rnd(0.1, 0.5); rock(S, pond.x + Math.cos(a) * r, pond.z + Math.sin(a) * r / 1.15, rnd(0.28, 0.6), [0xC6BEE6, 0xE3D7C9, 0xB7C4E8, 0xF0D8C8][i % 4]); }
  if (!CALM) { rock(S, 5.2, 1.6, 0.55, 0xC9C1EA); rock(S, 5.9, 1.2, 0.32, 0xE6D8CA); }
  /* trees: lush greens, one in pink blossom; mushrooms */
  const trees = [tree(S, -13, -12, { s: 1.5, c1: 0x13924A, c2: 0x7FE04A }), tree(S, 9, -9, { s: 1.6, c1: 0x188F3E, c2: 0xA6E64A }), tree(S, 14, -16, { s: 1.9, c1: 0x0F8A52, c2: 0x5ED67A }),
    tree(S, -4, -17, { s: 1.4, c1: 0xE85A9E, c2: 0xFFC2E2, rim: 0xFFF0FA, sheen: 0xFFFFFF }), tree(S, 6.5, -20, { s: 1.3, c1: 0x1D9A44, c2: 0xC3EB55 }), tree(S, -18, -4, { s: 1.7, c1: 0x18914A, c2: 0x8FE35A }),
    tree(S, 18, -5, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F })].filter((T, i) => !CALM || [0, 1, 3].includes(i) || (T.visible = false, S.scene.remove(T), false));
  wobbleTrees(S, trees);
  if (!CALM) { mushroom(S, 7.2, -6.2, 1.1); mushroom(S, 7.9, -5.6, 0.7); mushroom(S, -11.6, -9.6, 0.9); }
  /* a soft rainbow behind the hills */
  const rb = new THREE.TorusGeometry(70, 4.2, 12, 80, Math.PI), rc = []; const rp = rb.attributes.position, cols = [0xFF4D4D, 0xFF9A3C, 0xFFE14D, 0x4DDB6A, 0x4DB2FF, 0x9B6BFF].map(C);
  for (let i = 0; i < rp.count; i++) { const x = rp.getX(i), y = rp.getY(i), r = Math.hypot(x, y), k = clamp((r - 65.8) / 8.4, 0, 0.999) * 5, a = Math.floor(k), c = cols[a].clone().lerp(cols[Math.min(5, a + 1)], k - a); rc.push(c.r, c.g, c.b); }
  rb.setAttribute('color', new THREE.Float32BufferAttribute(rc, 3));
  const rain = new THREE.Mesh(rb, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.24, fog: false, depthWrite: false })); rain.position.set(40, -12, -175); rain.scale.set(0.75, 0.75, 0.05); if (!CALM) S.scene.add(rain);
  if (!CALM) { sparkles(S, { count: 170 }); butterflies(S, 4); }   /* calm: nothing floating or flying (K clarity 10) */ const P = party(S);

  /* ---------- the snake: emerald with golden bands, glossy, big eyes ---------- */
  const strokes = STROKES.s.map(d => strokePoints(d, 0.05)), pts = strokes[0], R0 = 0.34;
  const au = aura(S, new THREE.Vector3(0, 2.75, 0), 6, 6, 0xFFF6D0, 0.0);
  const green = C(0x16D45E), band = C(0xFFD23F), lime = C(0x9BF03A);
  const body = growTube(pts, t => R0 * (0.25 + 0.75 * smooth(0, 0.28, t)), (t, nr, c) => { const b = Math.sin(t * Math.PI * 22); c.copy(green).lerp(lime, clamp(nr.z, 0, 1) * 0.35); if (b > 0.82) c.lerp(band, smooth(0.82, 0.95, b)); }, 20);
  const bm = toon(0xffffff, { vc: true, rough: 0.28, clear: 1, rim: 0xD8FFB0, rimI: 0.55, rimP: 2.2, env: 0.9 });
  const snake = new THREE.Mesh(body, bm); snake.castShadow = true; S.scene.add(snake); body.userData.grow(0);
  const head = new THREE.Group(), skull = new THREE.Mesh(new THREE.SphereGeometry(0.6, 36, 24), toon(green, { rough: 0.28, clear: 1, rim: 0xD8FFB0, rimI: 0.55, rimP: 2.2 }));
  skull.scale.set(1.2, 0.95, 1.05); skull.castShadow = true; head.add(skull);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 18), toon(0x5BE87A, { rough: .3, clear: 1, rimI: .3 })); snout.scale.set(1.15, 0.7, 0.8); snout.position.set(0, -0.16, 0.36); head.add(snout);
  const F = face(head, { er: 0.22, ex: 0.27, ey: 0.27, ez: 0.4, iris: 0x2A1B0A, cr: 0.14, cx: 0.46, cy: -0.1, cz: 0.52, mr: 0.15, my: -0.2, mz: 0.66 });
  const tongue = new THREE.Group(), tm = toon(0xFF2E63, { rough: .3, clear: .6, emissive: 0xFF0040, ei: .25 });
  [-1, 1].forEach(sx => { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.22, 4, 8), tm); f.rotation.x = Math.PI / 2; f.rotation.y = sx * 0.35; f.position.set(sx * 0.04, 0, 0.14); tongue.add(f); });
  tongue.position.set(0, -0.28, 0.6); tongue.scale.setScalar(0.001); head.add(tongue);
  const hit = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); head.add(hit);
  head.scale.setScalar(0); S.scene.add(head);
  const shadow = blob(S, 2.6, 0.3); shadow.position.set(0, 0.03, 0.2);
  eyesTick(S, F.eyes, () => S.lookTarget);
  let prog = 0, headS = 0, react = { k: 0, kind: '' }, dance = 0, flick = 0, nextFlick = 2;
  const tmpV = new THREE.Vector3(), tan = new THREE.Vector3();
  S.tick((t, dt) => {
    const c = body.userData.curve, k = Math.max(0.001, prog), p = c.getPointAt(k); c.getTangentAt(k, tan);
    head.position.copy(p); head.position.z += 0.1;
    const bob = Math.sin(t * 2.2) * 0.06, sway = Math.sin(t * 1.7) * 0.08;
    react.k = Math.max(0, react.k - dt * 1.4); dance = Math.max(0, dance - dt);
    let jump = 0, rz = clamp(Math.atan2(tan.y, tan.x) * 0.12, -0.25, 0.25) + sway * 0.5, big = 1;
    if (react.kind === 'surprise') { jump = Math.sin(react.k * Math.PI) * 0.5; big = 1 + react.k * 0.45; }
    if (react.kind === 'giggle') rz += Math.sin(t * 30) * 0.18 * react.k;
    if (dance > 0) { jump += Math.abs(Math.sin(t * 9)) * 0.35; rz += Math.sin(t * 9) * 0.3; }
    head.position.y += bob + jump; head.rotation.set(-0.05, Math.sin(t * 0.8) * 0.15, rz);
    head.scale.setScalar(headS * (1 + Math.sin(t * 3.1) * 0.02));
    F.eyes.forEach(E => E.userData.big = big);
    snake.position.y = dance > 0 ? Math.abs(Math.sin(t * 9)) * 0.18 : 0; snake.scale.set(1, 1 + (dance > 0 ? Math.sin(t * 9) * 0.04 : 0), 1);
    nextFlick -= dt; if (nextFlick < 0) { flick = 0.6; nextFlick = rnd(2.5, 5); }
    flick = Math.max(0, flick - dt); const fl = flick > 0 ? Math.sin((0.6 - flick) / 0.6 * Math.PI) : 0; tongue.scale.set(1, 1, 0.001 + fl * 1.2); tongue.visible = fl > 0.02;
    F.open.scale.y = (react.kind === 'surprise' ? react.k : 0) * 0.9 + (dance > 0 ? 0.6 : 0) + 0.01;
    bm.userData.rim.rimI.value = 0.55 + glowK * 1.4; glowK = Math.max(0, glowK - dt * 0.8);
    shadow.position.x = 0; shadow.material.opacity = 0.4 + prog * 0.6;
  });
  let glowK = 0;
  function setProg(k) { prog = clamp(k, 0, 1); body.userData.grow(prog); au.material.opacity = 0.18 + prog * 0.25; }
  const heroPos = () => head.getWorldPosition(tmpV).clone();
  const W = {
    name: 's', strokes, focus: { target: new THREE.Vector3(0, 2.75, 0) }, party: P, trees,
    camFrom: new THREE.Vector3(-6, 7, 22),
    lines: { hi: 'Hi! I am a happy little snake.', watch: 'Watch me make my shape!', you: 'Now you! Start at the glowing ring.', far: 'Start at the glowing ring.', keep: 'Keep going! Put your finger on the ring.', off: 'Stay on the shiny path.',
      word: 'Snake starts with this sound.', say: 'Say it with me!', yay: 'You made the snake!', tap: 'Tap me!', again: 'Again!' },
    hero: hit, heroPos,
    async appear() { await S.tween(700, e => { headS = e; }, ease.elastic); audio.boing(260); },
    sound: () => audio.hiss(900),
    soundStart: () => audio.hissStart(), soundStop: () => audio.hissStop(),
    async demo() { audio.hissStart(); await S.tween(3200, e => setProg(e), ease.inOut); audio.hissStop(); },
    grow(T) { setProg(T.progress()); P.twinkle(head.position, 1); },
    reset() { return S.tween(500, e => setProg(1 - e), ease.inOut); },
    showAll() { setProg(1); headS = 1; },
    cheer() { dance = 2; glowK = 1; P.burst(head.position.clone().add(new THREE.Vector3(0, 0.4, 0.6))); audio.party(); },
    poke() { react = { k: 1, kind: Math.random() < 0.5 ? 'surprise' : 'giggle' }; audio.boing(320 + Math.random() * 120); P.twinkle(head.position, 4); audio.hiss(500); },
    progress: () => prog
  };
  return W;
}

/* ============================== a: the apple orchard ============================== */
export function worldA(S) {
  const lane = (x, z) => z < 1 && Math.abs(x + Math.sin(z * 0.15) * 0.6) < 1.2 + (-z) * 0.02;
  sky(S, { top: 0x2A6CF5, mid: 0x78CFFF, hor: 0xFFDFA0, fog: 0xD8ECFF, sunDir: [-0.45, 0.3, -1], sunCol: 0xFFE2A0, hemiSky: 0xCDE8FF, hemiGround: 0x7BBF3A, fogNear: CALM ? 14 : 40, fogFar: CALM ? 75 : 170 });
  clouds(S, CALM ? 4 : 8, { rim: 0xFFEBD0 });
  ground(S, { g1: 0x5DBA3A, g2: 0xA3D53E, g3: 0x3FA548, g4: 0xC9D96A,
    paint: (x, z, c) => { if (z < 1) { const d = Math.abs(x + Math.sin(z * 0.15) * 0.6) - (1.2 + (-z) * 0.02); c.lerp(C(0xB98250), smooth(0.6, -0.2, d) * 0.85); } } });
  if (!CALM) forest(S, { colors: [0x1E9A48, 0x3BAF4A, 0x6CC44A, 0x99D84A, 0x2A9E3A] });
  grass(S, { colors: [0x3FAE37, 0x6CC632, 0x9AD93B, 0x2E9E4F, 0xC2E05A, 0x58BD3E], tip: 0xFFF29A, skip: lane, count: PLAIN || CALM ? 1 : 15000, tall: CALM ? 0.55 : 0.9 });
  flowers(S, { count: CALM ? 12 : 170, size: 1.1, skip: (x, z) => lane(x, z) || (Math.abs(x) < (CALM ? 5 : 3.5) && z > -2 && z < 3), colors: [0xffffff, 0xFFD23F, 0xFF8AC2, 0xFFFFFF, 0xB46BFF] });

  /* orchard rows going into the distance, heavy with shiny apples */
  const trees = [], spots = [];
  [-1, 1].forEach(side => { (CALM ? [-4, -10.5, -17] : [-4, -9.5, -15, -21, -27, -33]).forEach((z, i) => { trees.push(tree(S, side * (4.8 + i * 0.25) + rnd(-.3, .3), z, { s: 1.15 + rnd(0, .2), c1: 0x16883A, c2: 0x8EDB4A, puffs: 10 })); });
    (CALM ? [] : [-7, -13, -19, -25]).forEach(z => trees.push(tree(S, side * rnd(10, 12), z, { s: 1.3, c1: 0x1A8F3C, c2: 0xA0E04F, puffs: 10 }))); });
  trees.push(tree(S, -9.6, 0.5, { s: 1.45, c1: 0x15853A, c2: 0x98E04C, puffs: 11 }), tree(S, 10.4, -0.5, { s: 1.5, c1: 0x15853A, c2: 0x98E04C, puffs: 11 }));
  wobbleTrees(S, trees);
  const ag = new THREE.SphereGeometry(0.17, 20, 14), ap = ag.attributes.position; for (let i = 0; i < ap.count; i++) { const x = ap.getX(i), y = ap.getY(i), z = ap.getZ(i), r = Math.hypot(x, z); if (y > 0) ap.setY(i, y - 0.06 * Math.exp(-r * r / 0.004)); } ag.computeVertexNormals();
  const am = toon(0xffffff, { rough: 0.22, clear: 1, rim: 0xFFD0B0, rimI: 0.45, env: 1, emissive: 0x330000, ei: 0.4 });
  const per = 12, AM = new THREE.InstancedMesh(ag, am, trees.length * per), m = new THREE.Matrix4(), apal = [0xFF1F2E, 0xFF2A1F, 0xE8102A, 0xFF5A1F, 0xFF1F4A].map(C); let ai = 0;
  trees.forEach(T => { const u = T.userData; for (let i = 0; i < per; i++) { const a = rnd(0, 6.28), e = rnd(-0.6, 0.9), r = 1.35 * u.s;
      const local = new THREE.Vector3(Math.cos(a) * Math.cos(e) * r * 1.05, u.cy + Math.sin(e) * r * 0.9, Math.sin(a) * Math.cos(e) * r * 1.05).applyEuler(new THREE.Euler(0, T.rotation.y, 0)).add(T.position);
      m.compose(local, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1).multiplyScalar(u.s * rnd(1.1, 1.5))); AM.setMatrixAt(ai, m); AM.setColorAt(ai, apal[ai % apal.length]); ai++; } });
  AM.castShadow = true; S.scene.add(AM);
  /* a wooden fence, a crate full of apples, a ladder */
  const wood = toon(0xC98A4B, { rough: .75, clear: .1, rimI: .3, rim: 0xFFE0B0 }), wood2 = toon(0xB0703A, { rough: .8, clear: 0, rimI: .25 });
  for (let i = 0; i < 9; i++) { const x = -16 + i * 1.6, z = 3.4 - i * 0.55, post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.1, 0.16), wood); post.position.set(x, S.groundH(x, z) + 0.5, z); post.castShadow = true; S.scene.add(post);
    if (i < 8) [0.35, 0.75].forEach(y => { const r = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.06), wood2); r.position.set(x + 0.8, S.groundH(x, z) + y, z - 0.27); r.rotation.y = Math.atan2(0.55, 1.6); r.castShadow = true; S.scene.add(r); }); }
  const crate = new THREE.Group(); [[0, 0.1], [0, 0.42]].forEach(([, y]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.26, 1.0), wood); b.position.y = y; crate.add(b); });
  const cin = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.5, 0.86), toon(0x7A4A22)); cin.position.y = 0.3; crate.add(cin);
  for (let i = 0; i < 14; i++) { const a = new THREE.Mesh(ag, toon(apal[i % 5], { rough: .22, clear: 1, rim: 0xFFD0B0, rimI: .45, emissive: 0x330000, ei: .4 })); a.scale.setScalar(1.25); a.position.set(rnd(-0.55, 0.55), 0.6 + rnd(0, 0.15), rnd(-0.3, 0.3)); a.castShadow = true; crate.add(a); }
  crate.position.set(4.6, S.groundH(4.6, 1.2), 1.2); crate.rotation.y = -0.4; crate.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); S.scene.add(crate);
  const ladder = new THREE.Group(); [-0.3, 0.3].forEach(x => { const r = new THREE.Mesh(new THREE.BoxGeometry(0.09, 3.2, 0.09), wood); r.position.set(x, 1.6, 0); ladder.add(r); });
  for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.07, 0.07), wood2); r.position.set(0, 0.4 + i * 0.5, 0); ladder.add(r); }
  const lt = trees[0]; ladder.position.set(lt.position.x + 1.1, lt.position.y, lt.position.z + 0.6); ladder.rotation.set(-0.15, -0.6, -0.3); ladder.traverse(o => o.castShadow = true); S.scene.add(ladder);
  if (!CALM) { sparkles(S, { count: 150, colors: [0xFFF3B0, 0xFFFFFF, 0xFFE0C0] }); butterflies(S, 4, [0xFFB020, 0xFF5FB8, 0x4FC3FF, 0xFFE14D]); }   /* calm: nothing floating or flying */ const P = party(S);
  /* falling blossom petals */
  const pg = new THREE.CircleGeometry(0.06, 8); pg.scale(1, 0.6, 1); const PN = CALM ? 0 : 60, petals = new THREE.InstancedMesh(pg, toon(0xFFD6EA, { side: THREE.DoubleSide, emissive: 0xFF9AC8, ei: .3 }), PN), pd = [];
  for (let i = 0; i < PN; i++) pd.push({ p: new THREE.Vector3(rnd(-12, 12), rnd(0, 8), rnd(-14, 4)), ph: rnd(0, 6) }); petals.frustumCulled = false; S.scene.add(petals);
  S.tick((t, dt) => { pd.forEach((o, i) => { o.p.y -= dt * 0.45; o.p.x += Math.sin(t + o.ph) * dt * 0.4; if (o.p.y < 0) { o.p.y = 8; o.p.x = rnd(-12, 12); }
    m.compose(o.p, new THREE.Quaternion().setFromEuler(new THREE.Euler(t * 2 + o.ph, t + o.ph, 0)), new THREE.Vector3(1, 1, 1)); petals.setMatrixAt(i, m); }); petals.instanceMatrix.needsUpdate = true; });

  /* ---------- the letter as an apple vine: leaves and shiny apples pop out as it grows ---------- */
  const strokes = STROKES.a.map(d => strokePoints(d, 0.05)), vg = C(0x6FD62A), vl = C(0xD8F55A);
  const au = aura(S, new THREE.Vector3(0, 2.75, 0), 6, 6, 0xFFF6D0, 0.0);
  const vineM = toon(0xffffff, { vc: true, rough: 0.3, clear: 0.9, rim: 0xFFFFC0, rimI: 1.0, emissive: 0x1A3A00, ei: 0.5 });
  const vines = strokes.map(pts => { const g = growTube(pts, t => 0.2 * (0.6 + 0.4 * smooth(0, 0.1, t)) * (1 - smooth(0.92, 1, t) * 0.4), (t, nr, c) => c.copy(vg).lerp(vl, (Math.sin(t * 60) * 0.5 + 0.5) * 0.35 + clamp(nr.z, 0, 1) * 0.25), 14);
    const mm = new THREE.Mesh(g, vineM); mm.castShadow = true; S.scene.add(mm); g.userData.grow(0); return g; });
  const leafSh = new THREE.Shape(); leafSh.moveTo(0, 0); leafSh.bezierCurveTo(0.12, 0.08, 0.2, 0.25, 0, 0.42); leafSh.bezierCurveTo(-0.2, 0.25, -0.12, 0.08, 0, 0);
  const leafG = new THREE.ShapeGeometry(leafSh, 8), leafM = toon(0x3ED35A, { side: THREE.DoubleSide, rough: .4, clear: .5, rim: 0xEFFFB0, rimI: .5 });
  const bigApple = ag.clone(); const fruitM = toon(0xFF1F2E, { rough: 0.2, clear: 1, rim: 0xFFC8A0, rimI: 0.5, env: 1.1, emissive: 0x400000, ei: 0.5 });
  const stemM = toon(0x7A4A22, { rough: .7 }), pops = [];
  strokes.forEach((pts, si) => { const every = 9; for (let i = 3; i < pts.length - 1; i += every) { const t = i / (pts.length - 1), G = new THREE.Group(); G.position.copy(pts[i]);
      const isApple = (Math.floor(i / every) % 2 === (si ? 1 : 0)); const dir = pts[Math.min(pts.length - 1, i + 1)].clone().sub(pts[i]).normalize(), side = new THREE.Vector3(-dir.y, dir.x, 0);
      if (isApple) { const a = new THREE.Mesh(bigApple, fruitM); a.scale.setScalar(1.15); a.castShadow = true; G.add(a); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.14, 6), stemM); st.position.y = 0.28; G.add(st);
        const lf = new THREE.Mesh(leafG, leafM); lf.position.set(0.03, 0.3, 0); lf.rotation.z = -1.0; lf.scale.setScalar(0.5); G.add(lf); G.position.addScaledVector(side, (Math.floor(i / every) % 4 < 2) ? 0.26 : -0.26); G.position.z += 0.1; }
      else { const lf = new THREE.Mesh(leafG, leafM); lf.rotation.z = Math.atan2(side.y, side.x) - Math.PI / 2 + ((i / every) % 2 ? Math.PI : 0); lf.scale.setScalar(0.75); G.add(lf); G.position.z += 0.05; }
      G.scale.setScalar(0); S.scene.add(G); pops.push({ G, si, t, on: false, apple: isApple, k: 0 }); } });
  S.tick((t, dt) => pops.forEach(o => { const target = o.on ? 1 : 0; o.k += (target - o.k) * Math.min(1, dt * 7); const e = o.on ? ease.elastic(clamp(o.k, 0, 1)) : o.k;
    o.G.scale.setScalar(Math.max(0.0001, e * (1 + (o.apple ? Math.sin(t * 2 + o.t * 9) * 0.03 : 0)))); if (o.apple) o.G.rotation.z = Math.sin(t * 1.6 + o.t * 7) * 0.08; }));
  let popN = 0;
  function setVine(si, k) { vines[si].userData.grow(k); au.material.opacity = Math.max(au.material.opacity, k * 0.28); pops.forEach(o => { if (o.si === si) { const on = o.t <= k + 0.001 && k > 0; if (on && !o.on) { audio.pop(); popN++; P.twinkle(o.G.position, 2); } o.on = on; } }); }

  /* ---------- the apple friend: round, glossy, a wiggly leaf, big eyes, tiny shoes ---------- */
  const hero = new THREE.Group(), bodyG = new THREE.SphereGeometry(0.8, 48, 32), bp = bodyG.attributes.position, bc = [], red = C(0xFF1E2D), warm = C(0xFF6A1F), blush = C(0xFFC23A), tc = new THREE.Color();
  for (let i = 0; i < bp.count; i++) { const x = bp.getX(i), y = bp.getY(i), z = bp.getZ(i), r = Math.hypot(x, z);
    if (y > 0) bp.setY(i, y - 0.24 * Math.exp(-r * r / 0.05)); if (y < 0) bp.setY(i, y + 0.12 * Math.exp(-r * r / 0.04)); bp.setX(i, x * (1 + 0.06 * Math.sin(y * 3)));
    tc.copy(red).lerp(warm, smooth(0.1, 0.8, y) * 0.35).lerp(blush, smooth(0.2, 0.8, -x * 0.9 + y * 0.2) * 0.35); bc.push(tc.r, tc.g, tc.b); }
  bodyG.setAttribute('color', new THREE.Float32BufferAttribute(bc, 3)); bodyG.computeVertexNormals();
  const ab = new THREE.Mesh(bodyG, toon(0xffffff, { vc: true, rough: 0.18, clear: 1, rim: 0xFFD6B0, rimI: 0.55, env: 1.1 })); ab.castShadow = true;
  const inner = new THREE.Group(); inner.add(ab); hero.add(inner);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.38, 8), stemM); stem.position.set(0.02, 0.62, 0); stem.rotation.z = -0.15; inner.add(stem);
  const leafPivot = new THREE.Group(); leafPivot.position.set(0.05, 0.72, 0); const bl = new THREE.Mesh(leafG, leafM); bl.rotation.z = -1.1; bl.scale.setScalar(1.3); leafPivot.add(bl); inner.add(leafPivot);
  const AF = face(inner, { er: 0.19, ex: 0.24, ey: 0.14, ez: 0.62, iris: 0x2A1606, cr: 0.12, cx: 0.48, cy: -0.07, cz: 0.52, mr: 0.13, my: -0.12, mz: 0.76 });
  const shoes = [-1, 1].map(sx => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 12), toon(0x6B3A1E, { rough: .35, clear: .8 })); s.scale.set(1, 0.6, 1.4); s.position.set(sx * 0.32, -0.76, 0.12); s.castShadow = true; hero.add(s); return s; });
  const ahit = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); ahit.position.y = 0.1; hero.add(ahit);
  let hx = -3.1, hz = 1.4; hero.position.set(hx, S.groundH(hx, hz) + 0.86, hz); hero.rotation.y = 0.35; hero.scale.setScalar(0); S.scene.add(hero);
  const hs = blob(S, 1.1, 0.4); hs.position.set(hx, S.groundH(hx, hz) + 0.03, hz);
  eyesTick(S, AF.eyes, () => S.lookTarget);
  let heroS = 0, react = { k: 0, kind: '' }, dance = 0, hop = 0, nextHop = 3, look = 0, sayK = 0;
  S.tick((t, dt) => { react.k = Math.max(0, react.k - dt * 1.3); dance = Math.max(0, dance - dt); hop = Math.max(0, hop - dt * 1.6); sayK = Math.max(0, sayK - dt);
    nextHop -= dt; if (nextHop < 0) { hop = 1; nextHop = rnd(3, 6); }
    let y = 0, sq = 1 + Math.sin(t * 3) * 0.025, rz = Math.sin(t * 1.4) * 0.05, ry = 0.35 + Math.sin(t * 0.7) * 0.12, big = 1;
    if (hop > 0) { const k = 1 - hop; y += Math.sin(k * Math.PI) * 0.45; sq *= k < 0.15 ? 1 - (0.15 - k) * 1.2 : 1 + Math.sin(k * Math.PI) * 0.06; }
    if (react.kind === 'surprise') { y += Math.sin(react.k * Math.PI) * 0.7; big = 1 + react.k * 0.45; }
    if (react.kind === 'spin') ry += (1 - react.k) * Math.PI * 2 * (react.k > 0 ? 1 : 0);
    if (react.kind === 'giggle') rz += Math.sin(t * 28) * 0.15 * react.k;
    if (dance > 0) { y += Math.abs(Math.sin(t * 8)) * 0.5; rz += Math.sin(t * 8) * 0.25; ry += Math.sin(t * 4) * 0.4; }
    hero.position.y = S.groundH(hx, hz) + 0.86 + y; hero.rotation.set(0, ry, rz); hero.scale.setScalar(heroS);
    inner.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)); leafPivot.rotation.z = Math.sin(t * 3.2) * 0.25 + (dance > 0 ? Math.sin(t * 16) * 0.4 : 0);
    shoes.forEach((s, i) => s.position.y = -0.76 + (dance > 0 ? Math.max(0, Math.sin(t * 8 + i * Math.PI)) * 0.12 : 0));
    AF.eyes.forEach(E => E.userData.big = big); AF.open.scale.y = Math.max(react.kind === 'surprise' ? react.k : 0, dance > 0 ? 0.7 : 0, sayK > 0 ? 0.8 : 0) + 0.01;
    hs.scale.setScalar(1 - y * 0.3); });
  const tmpV = new THREE.Vector3(); let lastA = -9;
  const W = {
    name: 'a', strokes, focusW: 6.8, focus: { target: new THREE.Vector3(-0.6, 2.55, 0) }, party: P, trees,
    camFrom: new THREE.Vector3(5, 6, 22),
    lines: { hi: 'Hi! Welcome to my apple orchard.', watch: 'Watch the apple vine grow!', you: 'Now you! Start at the green light.', far: 'Start at the green light.', keep: 'Keep going! Put your finger on the light.', off: 'Stay on the shiny path.',
      word: 'Apple starts with this sound.', say: 'Say it with me!', yay: 'You grew the apple vine!', tap: 'Tap me!', again: 'Again!' },
    hero: ahit, heroPos: () => hero.getWorldPosition(tmpV).clone().add(new THREE.Vector3(0, 0.6, 0)),
    async appear() { await S.tween(700, e => { heroS = e; }, ease.elastic); audio.boing(220); },
    sound: () => { sayK = 0.5; return audio.vowelA(450); },
    soundStart: () => { if (S.t - lastA > 1.1) { lastA = S.t; sayK = 0.4; audio.vowelA(380); } }, soundStop: () => {},   /* while he traces, the friend says the pure short sound now and then */
    async demo() { await S.tween(2400, e => setVine(0, e), ease.inOut); await S.wait(250); await S.tween(900, e => setVine(1, e), ease.inOut); },
    grow(T) { if (T.si === 0) setVine(0, T.strokeProgress()); else { setVine(0, 1); setVine(1, T.done ? 1 : T.strokeProgress()); } },
    reset() { return S.tween(450, e => { setVine(0, 1 - e); setVine(1, 1 - e); }, ease.inOut); },
    showAll() { setVine(0, 1); setVine(1, 1); heroS = 1; },
    cheer() { dance = 2; P.burst(new THREE.Vector3(-0.2, 3.0, 0.6)); audio.party(); },
    poke() { react = { k: 1, kind: ['surprise', 'spin', 'giggle'][Math.floor(Math.random() * 3)] }; audio.boing(260 + Math.random() * 120); P.twinkle(hero.position, 4); },
    layout(narrow) { hx = narrow ? -1.55 : -3.1; hz = narrow ? 2.6 : 1.4; hero.position.x = hx; hero.position.z = hz; hs.position.set(hx, S.groundH(hx, hz) + 0.03, hz); },
    progress: () => (vines[0].drawRange.count + vines[1].drawRange.count) > 0 ? 1 : 0,
    pops: () => popN
  };
  return W;
}
