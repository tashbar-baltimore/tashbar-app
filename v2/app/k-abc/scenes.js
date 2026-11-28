/* Kindergarten ABC 2.0: the worlds the games happen in. Each game has its own place with its own light and colours,
   built from the meadow kit (kit3d.js), kept CALM (Esti 2026-11-24: "engaging, but not too overwhelming"):
   a soft background that fades away, so the pictures, Mendy and the things he touches stay bright.
   Also the set pieces games use: trees, rocks, a pond, lily pads, stumps, baskets, a fence, a little train track, a beehive. */
import { THREE, FAST, C, rnd, clamp, smooth, ease, toon, glow, merge, M4, sky, clouds, hills, ground, grass, flowers, flowerGeo, sparkles, butterflies, party, blob, Q } from './kit3d.js';

const PLAIN = /[?&]plain=1/.test(location.search);
/* CALM (Esti, 2026-11-27: "the backgrounds are so busy that it's so hard to focus ... butterflies flying around ... distracting"; K-CLARITY-RULES 10):
   no grass blades, no floating sparkles, no butterflies, only a few flowers far from the play. ?busy=1 shows the old busy world. */
const CALM = !/[?&]busy=1/.test(location.search);
export const PALETTES = {
  morning: { sky: { top: 0x2A78F0, mid: 0x6CC8FF, hor: 0xFFE0C8, sunDir: [0.4, 0.32, -1] }, g: [0x3DB54E, 0x8CD94A, 0x2CA56A, 0xA8DC70], grass: [0x22A24A, 0x3FC25A, 0x73D84A, 0xA6E64A], tip: 0xF2FF8C, flowers: [0xFF4FA3, 0xFFD23F, 0xffffff, 0x4FC3FF] },
  pond: { sky: { top: 0x1C64F2, mid: 0x4DB8FF, hor: 0xFFD4C4, sunDir: [0.42, 0.3, -1] }, g: [0x2FB34C, 0x7FD83F, 0x23A374, 0x9BD96A], grass: [0x16A34A, 0x2CC45C, 0x5BD93F, 0x9BE83A], tip: 0xF2FF8C, flowers: [0xFF6FB5, 0xffffff, 0xFFD23F] },
  golden: { sky: { top: 0x3A6FE0, mid: 0x8FC8FF, hor: 0xFFC98A, sunDir: [-0.5, 0.2, -1], sunCol: 0xFFD08A }, g: [0x6DBB3A, 0xB5D84A, 0x4FA848, 0xD8C86A], grass: [0x5DAE37, 0x8CC632, 0xB2D93B, 0xD4E05A], tip: 0xFFE89A, flowers: [0xFF8A3A, 0xFFD23F, 0xffffff] },
  garden: { sky: { top: 0x2F7BEA, mid: 0x7FD0FF, hor: 0xFFF0C8, sunDir: [-0.3, 0.35, -1] }, g: [0x4CB848, 0x9AD84A, 0x3AA85A, 0xB8DC70], grass: [0x2E9E4F, 0x4CB848, 0x7FCF45, 0xA8E05A], tip: 0xFFF6A0, flowers: [0xFF4F6D, 0xFF9AC8, 0xFFD23F, 0xB46BFF] },
  hills: { sky: { top: 0x2766E8, mid: 0x6FC2FF, hor: 0xDFF2FF, sunDir: [0.2, 0.35, -1] }, g: [0x4FBF5A, 0x97DB55, 0x37A860, 0xC2E27A], grass: [0x2DA552, 0x48BE55, 0x7AD44C, 0xB0E35A], tip: 0xF4FF9A, flowers: [0xffffff, 0xFFD23F, 0xFF7AB8] },
  sunset: { sky: { top: 0x4A5FD8, mid: 0xB29CFF, hor: 0xFFC4A8, sunDir: [0.1, 0.15, -1], sunCol: 0xFFC890 }, g: [0x5DB85A, 0x9ED65A, 0x4AA870, 0xD8D27A], grass: [0x48A85A, 0x6CC05A, 0x9ED65A, 0xC8E070], tip: 0xFFE6B0, flowers: [0xFFB8E0, 0xffffff, 0xFFD27A] },
  meadow: { sky: { top: 0x3A82F5, mid: 0x86D2FF, hor: 0xFFF2D8, sunDir: [0.3, 0.38, -1] }, g: [0x56C04F, 0xA2DC52, 0x3BAE5C, 0xBEE07A], grass: [0x34A84A, 0x56C04F, 0x86D44A, 0xB2E35A], tip: 0xFFF6A0, flowers: [0xFFD23F, 0xFF8AC2, 0xffffff, 0xB46BFF] }
};

/* the base world: sky, clouds, ground, grass, a few flowers, soft sparkles; skip(x,z) keeps grass and flowers off set pieces */
export function base(S, pal, o = {}) {
  const P = PALETTES[pal] || PALETTES.morning;
  sky(S, Object.assign({ fog: o.fog || 0xD8ECFF, hemiSky: 0xC6E6FF, hemiGround: P.g[0], fogNear: 14, fogFar: 78 }, P.sky));
  clouds(S, 4, { rim: 0xFFEBD0 });
  const sunny = C(o.clearing || 0xC8EA7A), warm = C(0xF2E2A0);   /* a soft sunlit clearing where the play happens */
  ground(S, { height: o.height || hills, g1: P.g[0], g2: P.g[1], g3: P.g[2], g4: P.g[3], paint: (x, z, c) => { const d = Math.hypot(x / 1.6, z + 0.5);
    c.lerp(sunny, smooth(9, 2.5, d) * 0.55); c.lerp(warm, smooth(5, 1, d) * 0.18); if (o.paint) o.paint(x, z, c); } });
  const play = (x, z) => Math.abs(x) < (o.clearW || 6) && z > -3.2 && z < 2.3;   /* the play area stays clear; grass in the front and all around */
  const skip = (x, z) => play(x, z) || (o.skip && o.skip(x, z));
  grass(S, { colors: P.grass, tip: P.tip, skip, count: PLAIN || CALM || (FAST && !/tier=/.test(location.search)) ? 1 : 5000, tall: 0.55 });   /* the automatic test draws no grass blades */
  flowers(S, { count: CALM ? 10 : 40, size: 1.05, skip, colors: P.flowers });
  if (!CALM) { sparkles(S, { count: 30 }); butterflies(S, 1); }
  return { P: party(S), pal: P };
}

/* ---------- set pieces ---------- */
export function tree(S, x, z, o = {}) {
  const s = o.s || 1, H = S.groundH(x, z), G = new THREE.Group(); G.position.set(x, H - 0.05, z); G.rotation.y = rnd(0, 6);
  const th = (o.h || 2.4) * s, tg = new THREE.CylinderGeometry(0.17 * s, 0.32 * s, th, 12, 6); tg.translate(0, th / 2, 0);
  const trunk = new THREE.Mesh(tg, toon(o.bark || 0x9C5A2E, { rough: 0.85, clear: 0, rimI: 0.25, rim: 0xFFD7A0 })); trunk.castShadow = true; G.add(trunk);
  const c1 = C(o.c1 || 0x1E9E46), c2 = C(o.c2 || 0x8BE04A), parts = [], sg = new THREE.SphereGeometry(1, 20, 14), cy = th + 0.75 * s, n = o.puffs || 9;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + rnd(-.3, .3), rr = i === 0 ? 0 : rnd(0.7, 1.15) * s, r = (i === 0 ? 1.35 : rnd(0.75, 1.05)) * s;
    parts.push({ g: sg, m: M4(Math.cos(a) * rr, cy + rnd(-0.35, 0.65) * s + (i === 0 ? 0.25 * s : 0), Math.sin(a) * rr, r, r * 0.92, r) }); }
  const tmp = new THREE.Color(), crown = new THREE.Mesh(merge(parts.map(p => ({ g: p.g, m: p.m, color: (X, Y, Z) => tmp.copy(c1).lerp(c2, smooth(cy - 1.1 * s, cy + 1.6 * s, Y + X * 0.15 + Z * 0.1)).clone() }))),
    toon(0xffffff, { vc: true, rough: 0.62, clear: 0.15, sheen: 0.7, sheenC: o.sheen || 0xEFFFB0, rim: 0xFFF6C8, rimI: 0.42, rimP: 2.2 }));
  crown.castShadow = true; G.add(crown); S.scene.add(G); G.userData = { crown, cy, s };
  S.tick(t => { G.rotation.z = Math.sin(t * 0.9 + x) * 0.008; }); return G;
}
export function rock(S, x, z, r, color = 0xC6BEE6) {
  const g = new THREE.SphereGeometry(1, 18, 12), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setY(i, y > 0 ? y * 0.6 : y * 0.3); } g.computeVertexNormals();
  const m = new THREE.Mesh(g, toon(color, { rough: 0.6, clear: 0.25, rimI: 0.35, rim: 0xFFF0FF })); m.scale.setScalar(r); m.position.set(x, S.groundH(x, z) + r * 0.15, z); m.rotation.y = rnd(0, 6); m.castShadow = m.receiveShadow = true; S.scene.add(m); return m;
}
/* a pond with moving light on the water (from the snake world) */
export function pond(S, x, z, r, sx = 1.6) {
  const U = { uTime: { value: 0 }, deep: { value: C(0x1590C8) }, shallow: { value: C(0x48E4D8) }, foam: { value: C(0xF4FFFF) } };
  const wm = new THREE.ShaderMaterial({ uniforms: U, transparent: true, fog: false,
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform float uTime; uniform vec3 deep, shallow, foam; varying vec2 vUv; varying vec3 vW;
      void main(){ vec2 p = vW.xz; vec2 q = vUv - 0.5; float r = length(q) * 2.0;
        vec3 c = mix(deep, shallow, smoothstep(0.1, 0.95, r));
        float w = sin(p.x*2.2 + uTime*1.1) * sin(p.y*2.7 - uTime*0.8) + 0.5*sin((p.x + p.y)*4.1 + uTime*1.6);
        c += vec3(0.55, 0.95, 1.0) * smoothstep(0.62, 0.95, w*0.5 + 0.5) * 0.28;
        float a = atan(q.y, q.x); float rim = smoothstep(0.82, 0.93, r + 0.03*sin(a*9.0 + uTime*1.4));
        c = mix(c, foam, rim * 0.85);
        gl_FragColor = vec4(c, 1.0 - smoothstep(0.95, 1.0, r));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const water = new THREE.Mesh(new THREE.CircleGeometry(r, 64), wm); water.rotation.x = -Math.PI / 2; water.scale.x = sx; water.position.set(x, 0.04, z); S.scene.add(water);
  S.tick(t => U.uTime.value = t); return water;
}
export function lilypad(S, s = 1) {
  const g = new THREE.CircleGeometry(0.9, 36, 0.25, Math.PI * 2 - 0.5); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, toon(0x34C452, { rough: .45, clear: .6, side: THREE.DoubleSide, rim: 0xD8FF9A, rimI: .5 })); m.scale.setScalar(s); m.receiveShadow = true; S.scene.add(m); return m;
}
export function stump(S, x, z, r = 0.9, h = 0.7) {
  const G = new THREE.Group(), side = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.15, h, 28), toon(0x9C6A3E, { rough: .85, clear: 0 })), top = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r * 0.97, 0.04, 28), toon(0xE8C48A, { rough: .7 }));
  side.position.y = h / 2; top.position.y = h + 0.01; side.castShadow = side.receiveShadow = top.receiveShadow = true; G.add(side, top);
  for (let i = 1; i < 4; i++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(r * i / 4, 0.012, 6, 40), toon(0xC09060)); ring.rotation.x = Math.PI / 2; ring.position.y = h + 0.035; G.add(ring); }
  G.position.set(x, S.groundH(x, z), z); S.scene.add(G); G.userData.top = h; return G;
}
/* a woven basket (open at the top); its front shows a key picture so a boy knows which is which without reading */
export function basket(S, color = 0xD8A060, r = 1.0) {
  const G = new THREE.Group(), m = toon(color, { rough: .75, clear: .1, sheen: .4 }), g = new THREE.CylinderGeometry(r, r * 0.78, r * 0.9, 32, 6, true), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)), y = p.getY(i), k = 1 + 0.025 * Math.sin(a * 24 + Math.round(y * 6) * Math.PI); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } g.computeVertexNormals();
  const wall = new THREE.Mesh(g, Object.assign(m.clone(), { side: THREE.DoubleSide })); wall.castShadow = wall.receiveShadow = true; wall.position.y = r * 0.45; G.add(wall);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(r * 0.78, 32), toon(0x9C6A3E)); bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.02; G.add(bottom);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 10, 40), toon(0xB07A40, { rough: .6 })); rim.rotation.x = Math.PI / 2; rim.position.y = r * 0.9; G.add(rim);
  S.scene.add(G); G.userData.r = r; return G;
}
export function fence(S, x0, x1, z, color = 0xFFF6E8) {
  const m = toon(color, { rough: .6 }), n = Math.round((x1 - x0) / 1.1);
  for (let i = 0; i <= n; i++) { const x = x0 + i * (x1 - x0) / n, p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.0, 0.1), m); p.position.set(x, S.groundH(x, z) + 0.5, z); p.castShadow = true; S.scene.add(p);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.16, 4), m); tip.position.set(x, S.groundH(x, z) + 1.07, z); tip.rotation.y = Math.PI / 4; S.scene.add(tip); }
  [0.3, 0.72].forEach(y => { const r = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.1, 0.06), m); r.position.set((x0 + x1) / 2, S.groundH((x0 + x1) / 2, z) + y, z - 0.07); S.scene.add(r); });
}
/* a beehive hanging from a branch */
export function hive(S, x, y, z) {
  const G = new THREE.Group(); for (let i = 0; i < 5; i++) { const r = 0.42 - Math.abs(i - 1.6) * 0.09, t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.13, 12, 28), toon(0xF6C14A, { rough: .45, clear: .5 })); t.rotation.x = Math.PI / 2; t.position.y = -i * 0.2; G.add(t); }
  const door = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), toon(0x5A3A1A)); door.position.set(0, -0.55, 0.42); G.add(door);
  G.position.set(x, y, z); S.scene.add(G); return G;
}
/* a toy train track that runs left to right, with an arrow of light showing the way */
export function track(S, x0, x1, z) {
  const G = new THREE.Group(), wood = toon(0xC98A4B, { rough: .7 }), rail = toon(0xD8DEE8, { metal: .6, rough: .3 }), len = x1 - x0;
  for (let i = 0; i <= len / 0.45; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 1.0), wood); s.position.set(x0 + i * 0.45, 0.06, z); s.receiveShadow = true; G.add(s); }
  [-0.32, 0.32].forEach(dz => { const r = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, 0.07), rail); r.position.set((x0 + x1) / 2, 0.14, z + dz); G.add(r); });
  S.scene.add(G); return G;
}

/* a wooden shelf (garden bench / station platform) for pictures to stand on: top at height h */
export function shelf(S, x0, x1, z, h = 1.0, color = 0xC98A4B, depth = 1.1) {
  const G = new THREE.Group(), wood = toon(color, { rough: .7, clear: .1, rimI: .3, rim: 0xFFE0B0 }), dark = toon(0x9C6A3E, { rough: .8 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.16, depth), wood); top.position.set((x0 + x1) / 2, h, z); top.castShadow = top.receiveShadow = true; G.add(top);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 0.1, 0.1, 0.12), dark); lip.position.set((x0 + x1) / 2, h - 0.08, z + depth / 2); G.add(lip);
  const n = Math.max(2, Math.round((x1 - x0) / 2.4)); for (let i = 0; i <= n; i++) { const x = x0 + 0.25 + i * (x1 - x0 - 0.5) / n;
    [-1, 1].forEach(s2 => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.16), dark); l.position.set(x, h / 2, z + s2 * (depth / 2 - 0.15)); l.castShadow = true; G.add(l); }); }
  S.scene.add(G); return G;
}
