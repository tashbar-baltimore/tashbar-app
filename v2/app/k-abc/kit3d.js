/* Kindergarten ABC 2.0 — the NEW 3D look kit (Esti 2026-11-24: "award-winning, premium kids' game graphics ... rich, juicy,
   saturated colors ... depth, soft shadows, glow, sparkle, bounce ... every letter gets its OWN little world").
   three.js r180 (MIT), copied into lib/three-r180/ (no outside websites). Original art, all made here in code.
   What is in here (shared by every letter world):
   - the stage: renderer, film finish (glow/bloom, soft color grade, vignette), soft shadows, sky-colored reflections,
     and the automatic "simpler picture if the computer is slow" steps (tier 2 -> 1 -> 0);
   - sky dome with sun glow, puffy clouds, rolling hills with color patches, lush wind-blown grass with many greens,
     flowers, floating sparkles, butterflies, confetti + star bursts;
   - cartoon parts: glossy "rim-lit" materials, eyes that blink and look around;
   - letter strokes (one set of paths for drawing, tracing and 3D), a finger-tracing helper;
   - sound: pure letter sounds made by the device (never spoken), happy chimes; the voice (school teacher voice, else device);
     the "hear it again" script runner.
   ?fast=1: quick motion, no voice, simplest picture (for the automatic test). */
import * as THREE from 'three';
import { EffectComposer } from './lib/three-r180/addons/postprocessing/EffectComposer.js';
import { RenderPass } from './lib/three-r180/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './lib/three-r180/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './lib/three-r180/addons/postprocessing/OutputPass.js';
import { ShaderPass } from './lib/three-r180/addons/postprocessing/ShaderPass.js';

export { THREE };
export const FAST = /[?&]fast=1/.test(location.search);
const FORCE_TIER = (location.search.match(/[?&]tier=(\d)/) || [])[1];
export const C = h => new THREE.Color(h);
export const Q = { low: false };   /* true when the world is built for the simplest picture: plainer materials, fewer small things */
export const rnd = (a, b) => a + Math.random() * (b - a);
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const ease = {
  out: t => 1 - Math.pow(1 - t, 3), inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  elastic: t => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI) / 3) + 1
};

/* ============================== the stage ============================== */
export function stage(host, o = {}) {
  const S = { t: 0, dt: 0, ticks: [], tweens: [], onTier: [], pointer: new THREE.Vector2(0, 0), hits: [] };
  const small = Math.min(innerWidth, innerHeight) < 600;
  S.tier = FORCE_TIER != null ? +FORCE_TIER : FAST ? 0 : small ? 1 : 2; Q.low = S.tier === 0;
  const R = S.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.NeutralToneMapping; R.toneMappingExposure = 0.95;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(R.domElement); R.domElement.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;display:block;touch-action:none;';
  const scene = S.scene = new THREE.Scene();
  const cam = S.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 600);
  S.focus = { target: new THREE.Vector3(0, 2.2, 0), w: 8, h: 6.6, dir: new THREE.Vector3(0, 0.17, 1).normalize(), extra: 0 };

  /* film finish: bloom (glow) + soft color grade + vignette */
  let composer = null, bloom = null, grade = null;
  const GradeShader = {
    uniforms: { tDiffuse: { value: null }, sat: { value: 1.2 }, vig: { value: 0.38 }, warm: { value: 0.025 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float sat, vig, warm; varying vec2 vUv;
      void main(){ vec4 c=texture2D(tDiffuse,vUv); float l=dot(c.rgb,vec3(.299,.587,.114));
        c.rgb=mix(vec3(l),c.rgb,sat); c.rgb+=vec3(warm,warm*.4,-warm*.6)*(1.0-l);
        vec2 d=vUv-.5; float v=1.0-dot(d,d)*vig*2.2; c.rgb*=v; gl_FragColor=c; }`
  };
  function buildComposer() {
    if (composer) { composer.dispose(); composer = null; }
    if (S.tier === 0) return;
    const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: S.tier === 2 ? 4 : 0 });
    composer = new EffectComposer(R, rt);
    composer.addPass(new RenderPass(scene, cam));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.45, 1.0);
    composer.addPass(bloom); composer.addPass(new OutputPass());
    grade = new ShaderPass(GradeShader); composer.addPass(grade);
  }
  function applyTier() {
    const dpr = Math.min(devicePixelRatio || 1, S.tier === 2 ? 1.75 : 1);
    R.setPixelRatio(S.tier === 0 ? Math.min(devicePixelRatio || 1, 1) * (FAST ? 0.5 : 0.75) : dpr);   /* the simplest picture also draws fewer dots */
    R.shadowMap.enabled = S.tier > 0;
    scene.traverse(m => { if (m.material) [].concat(m.material).forEach(x => x.needsUpdate = true); });
    if (S.sun) { S.sun.castShadow = S.tier > 0; const s = S.tier === 2 ? 2048 : 1024; if (S.sun.shadow.map) { S.sun.shadow.map.dispose(); S.sun.shadow.map = null; } S.sun.shadow.mapSize.set(s, s); }
    buildComposer(); resize(); S.onTier.forEach(f => f(S.tier));
  }
  S.setTier = t => { S.tier = clamp(t, 0, 2); applyTier(); };
  function resize() {
    const w = innerWidth, h = innerHeight; R.setSize(w, h, false); cam.aspect = w / h;
    cam.fov = w / h < 0.8 ? 46 : 38; cam.updateProjectionMatrix();
    if (composer) { composer.setSize(w, h); if (bloom) bloom.resolution.set(w / 2, h / 2); }
    fit();
  }
  /* keep the play area (w x h around focus.target) in view on any screen shape */
  function fit() {
    const F = S.focus, vf = THREE.MathUtils.degToRad(cam.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
    const d = Math.max((F.h / 2) / Math.tan(vf / 2), (F.w / 2) / Math.tan(hf / 2)) + F.extra;
    S.camHome = F.target.clone().addScaledVector(F.dir, d);
  }
  S.fit = fit; addEventListener('resize', resize);

  /* lights: sky fill, warm sun with soft shadows, a cool back rim light */
  const hemi = S.hemi = new THREE.HemisphereLight(0xBFE6FF, 0x6BBF3A, 0.85); scene.add(hemi);
  const sun = S.sun = new THREE.DirectionalLight(0xFFF1D6, 2.7); sun.position.set(9, 16, 10); sun.castShadow = true;
  sun.shadow.camera.left = -16; sun.shadow.camera.right = 16; sun.shadow.camera.top = 14; sun.shadow.camera.bottom = -10; sun.shadow.camera.far = 60;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 4; scene.add(sun); scene.add(sun.target);
  const rim = S.rim = new THREE.DirectionalLight(0xFFC8F0, 1.1); rim.position.set(-8, 7, -12); scene.add(rim);

  /* tweens and waits (all faster in the test) */
  S.tween = (ms, fn, ez) => new Promise(res => { if (FAST) { fn(1); return res(); } S.tweens.push({ t0: S.t, d: ms / 1000, fn, ez: ez || ease.inOut, res }); });
  S.wait = ms => new Promise(r => setTimeout(r, FAST ? 0 : ms));
  S.tick = f => S.ticks.push(f);

  /* pointer: screen -> world helpers, tap targets */
  const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
  S.ndc = e => { const r = R.domElement.getBoundingClientRect(); return v2.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); };
  S.onPlane = (e, z = 0) => { ray.setFromCamera(S.ndc(e), cam); const p = new THREE.Vector3(), pl = new THREE.Plane(new THREE.Vector3(0, 0, 1), -z); return ray.ray.intersectPlane(pl, p) ? p : null; };
  S.toScreen = v => { const p = v.clone().project(cam), r = R.domElement.getBoundingClientRect(); return { x: r.left + (p.x + 1) / 2 * r.width, y: r.top + (1 - p.y) / 2 * r.height }; };
  S.onTap = (obj, fn) => S.hits.push({ obj, fn });
  S.pick = e => { ray.setFromCamera(S.ndc(e), cam); const list = S.hits.filter(h => h.obj.visible !== false); const hit = ray.intersectObjects(list.map(h => h.obj), true)[0];
    if (!hit) return null; let o = hit.object; while (o) { const h = list.find(x => x.obj === o); if (h) return { h, point: hit.point }; o = o.parent; } return null; };
  addEventListener('pointermove', e => { S.ndc(e); S.pointer.copy(v2); });

  /* main loop + the automatic "simpler picture if slow" steps */
  let last = performance.now(), slow = 0, frames = 0, acc = 0, settle = 0;
  S.fps = 60;
  function loop(now) {
    requestAnimationFrame(loop);
    const real = (now - last) / 1000, dt = Math.min(0.05, real); last = now; S.dt = dt; S.t += dt;
    frames++; acc += real; settle += real;
    if (acc > 1.5) { S.fps = frames / acc; frames = 0; acc = 0;
      if (!FAST && FORCE_TIER == null && settle > 3 && S.fps < 34 && S.tier > 0) { slow++; if (slow >= 2) { slow = 0; settle = 0; S.setTier(S.tier - 1); } } else slow = 0; }
    for (let i = S.tweens.length - 1; i >= 0; i--) { const tw = S.tweens[i], k = clamp((S.t - tw.t0) / tw.d, 0, 1); tw.fn(tw.ez(k)); if (k >= 1) { S.tweens.splice(i, 1); tw.res(); } }
    S.ticks.forEach(f => f(S.t, dt));
    if (composer) composer.render(); else R.render(scene, cam);
  }
  S.start = () => { applyTier(); cam.position.copy(S.camHome); cam.lookAt(S.focus.target); requestAnimationFrame(loop); };
  return S;
}

/* ============================== materials ============================== */
/* glossy cartoon material with a soft colored rim of light (the "premium toy" look) */
export function toon(color, o = {}) {
  const m = new (Q.low ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial)({ color: color === undefined ? 0xffffff : color, roughness: o.rough ?? 0.42, metalness: o.metal ?? 0, vertexColors: !!o.vc,
    emissive: C(o.emissive ?? 0x000000), emissiveIntensity: o.ei ?? 1, transparent: !!o.transparent, opacity: o.opacity ?? 1, side: o.side ?? THREE.FrontSide,
    envMapIntensity: (o.env ?? 0.7) * 0.6, flatShading: !!o.flat });
  if (!Q.low) { m.clearcoat = o.clear ?? 0.35; m.clearcoatRoughness = 0.22; m.sheen = o.sheen ?? 0; m.sheenColor = C(o.sheenC ?? 0xffffff); }
  const rimC = C(o.rim ?? 0xFFF4E0), U = { rimC: { value: rimC }, rimP: { value: o.rimP ?? 3 }, rimI: { value: (o.rimI ?? 0.5) * 0.5 } };
  m.userData.rim = U;
  m.onBeforeCompile = sh => { Object.assign(sh.uniforms, U);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 rimC; uniform float rimP, rimI;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n{ float fr = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), rimP); totalEmissiveRadiance += rimC * fr * rimI; }'); };
  m.customProgramCacheKey = () => 'toonrim';
  return m;
}
export const glow = (color, k = 2.2) => new THREE.MeshBasicMaterial({ color: C(color).multiplyScalar(k), toneMapped: true });

/* tiny geometry merger (positions, normals, colors, uvs) */
export function merge(list) {
  const P = [], N = [], Co = [], U = [], I = []; let base = 0;
  list.forEach(({ g, m, color }) => { const geo = g.index ? g : g; const pos = geo.attributes.position, nor = geo.attributes.normal, uv = geo.attributes.uv;
    const nm = new THREE.Matrix3().getNormalMatrix(m || new THREE.Matrix4()), v = new THREE.Vector3(), cc = color ? C(color) : null;
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); if (m) v.applyMatrix4(m); P.push(v.x, v.y, v.z);
      v.fromBufferAttribute(nor, i).applyMatrix3(nm).normalize(); N.push(v.x, v.y, v.z);
      if (uv) U.push(uv.getX(i), uv.getY(i)); else U.push(0, 0);
      const c = typeof color === 'function' ? color(P[P.length - 3], P[P.length - 2], P[P.length - 1]) : cc; if (c) Co.push(c.r, c.g, c.b); else Co.push(1, 1, 1); }
    if (geo.index) for (let i = 0; i < geo.index.count; i++) I.push(geo.index.getX(i) + base); else for (let i = 0; i < pos.count; i++) I.push(i + base);
    base += pos.count; });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
  out.setAttribute('color', new THREE.Float32BufferAttribute(Co, 3)); out.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); out.setIndex(I);
  return out;
}
export const M4 = (x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx, rx = 0, ry = 0, rz = 0) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));

/* ============================== sky, clouds, ground ============================== */
export function sky(S, p) {
  const U = { top: { value: C(p.top) }, mid: { value: C(p.mid) }, hor: { value: C(p.hor) }, sunDir: { value: new THREE.Vector3(...(p.sunDir || [0.35, 0.32, -1])).normalize() }, sunCol: { value: C(p.sunCol || 0xFFE7A8) } };
  const mat = new THREE.ShaderMaterial({ uniforms: U, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform vec3 top, mid, hor, sunDir, sunCol; varying vec3 vDir;
      void main(){ vec3 d = normalize(vDir); float h = d.y;
        vec3 c = mix(hor, mid, smoothstep(-0.02, 0.22, h)); c = mix(c, top, smoothstep(0.18, 0.75, h));
        float s = max(dot(d, sunDir), 0.0);
        c += sunCol * (pow(s, 6.0) * 0.28 + pow(s, 60.0) * 0.7) + sunCol * smoothstep(0.9985, 0.9991, s) * 4.0;
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(380, 40, 24), mat); dome.renderOrder = -10; S.scene.add(dome);
  S.scene.fog = new THREE.Fog(C(p.fog || p.hor), p.fogNear || 34, p.fogFar || 150);
  S.hemi.color.set(p.hemiSky || 0xBFE6FF); S.hemi.groundColor.set(p.hemiGround || 0x6BBF3A);
  const sd = U.sunDir.value; S.sun.position.set(sd.x * 20 + 4, 16, 12);
  /* sky-colored reflections for every glossy thing */
  const pm = new THREE.PMREMGenerator(S.renderer), es = new THREE.Scene();
  es.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), mat));
  const gnd = new THREE.Mesh(new THREE.CircleGeometry(9, 32), new THREE.MeshBasicMaterial({ color: C(p.hemiGround || 0x6BBF3A) })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = -1.5; es.add(gnd);
  S.scene.environment = pm.fromScene(es, 0.04).texture; S.scene.environmentIntensity = 0.6;
  return dome;
}

export function clouds(S, n = 7, o = {}) {
  const mat = toon(0xffffff, { rough: 0.9, clear: 0, rim: o.rim || 0xFFF0F8, rimI: 0.55, rimP: 2, emissive: o.tint || 0x2A3050, ei: 0.12, env: 0.4 });
  const sg = new THREE.SphereGeometry(1, 20, 14), G = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const parts = [], k = 4 + (Math.random() * 4 | 0);
    for (let j = 0; j < k; j++) { const s = rnd(1.1, 2.1) * (1 - Math.abs(j - k / 2) / k * 0.6); parts.push({ g: sg, m: M4((j - k / 2) * 1.5 + rnd(-.3, .3), rnd(0, .7) + s * 0.2, rnd(-.6, .6), s * 1.15, s, s) }); }
    parts.push({ g: sg, m: M4(0, -0.2, 0, k * 0.9, 0.7, 1.6) });
    const c = new THREE.Mesh(merge(parts), mat);
    const ang = rnd(-1.25, 1.25), dist = rnd(70, 120); c.position.set(Math.sin(ang) * dist, rnd(o.yMin || 22, o.yMax || 40), -Math.cos(ang) * dist);
    c.scale.setScalar(rnd(1.6, 2.6)); c.userData.v = rnd(0.25, 0.6); c.lookAt(0, c.position.y, 0); G.add(c);
  }
  S.scene.add(G); S.tick((t, dt) => G.children.forEach(c => { c.position.x += c.userData.v * dt; if (c.position.x > 130) c.position.x = -130; }));
  return G;
}

/* rolling hills: flat play area in the middle, hills rising behind; colors in soft patches */
export function hills(x, z) {
  const r = Math.hypot(x * 0.8, z + 3), f = smooth(14, 62, r);
  const n = Math.sin(x * 0.11 + 1.3) * Math.cos(z * 0.13 - 0.7) * 0.5 + Math.sin(x * 0.23 + z * 0.17) * 0.25 + Math.sin(x * 0.045 - z * 0.08 + 2) * 0.7;
  return (n * 0.35 + 0.1) * smooth(5, 14, r) + f * f * (10 + 5 * Math.sin(x * 0.06 + 1));
}
export function ground(S, p) {
  const H = p.height || hills, g = new THREE.PlaneGeometry(260, 260, Q.low ? 90 : 170, Q.low ? 90 : 170); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position, cols = [], A = C(p.g1), B = C(p.g2), Cc = C(p.g3), Y = C(p.g4 || p.g3), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), h = H(x, z); pos.setY(i, h);
    const n1 = Math.sin(x * 0.19 + z * 0.07) * Math.cos(z * 0.21 - x * 0.05) * 0.5 + 0.5, n2 = Math.sin(x * 0.07 - z * 0.15 + 1.7) * 0.5 + 0.5;
    tmp.copy(A).lerp(B, n1); tmp.lerp(Cc, smooth(0.55, 0.95, n2) * 0.8); tmp.lerp(Y, smooth(2.5, 9, h) * 0.55);
    if (p.paint) p.paint(x, z, tmp);
    cols.push(tmp.r, tmp.g, tmp.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, envMapIntensity: 0.3 })); m.receiveShadow = true; S.scene.add(m);
  S.groundH = H; return m;
}

/* a far forest line on the hills: many little round trees (cheap: two instanced shapes) */
export function forest(S, p = {}) {
  const n = Math.round((p.count || 160) * (Q.low ? 0.4 : 1)), cg = new THREE.SphereGeometry(1, 14, 10), tg = new THREE.CylinderGeometry(0.15, 0.22, 1, 6); tg.translate(0, 0.5, 0);
  const CM = new THREE.InstancedMesh(cg, toon(0xffffff, { rough: 0.7, clear: 0.1, rimI: 0.35, sheen: 0.5, sheenC: 0xEFFFB0 }), n), TM = new THREE.InstancedMesh(tg, toon(0x8E5A34, { rough: .9, clear: 0 }), n);
  const pal = (p.colors || [0x1E9A48, 0x2DB35A, 0x4CC452, 0x7AD64A, 0x168F55, 0xE07AB8]).map(C), m = new THREE.Matrix4(), H = S.groundH; let k = 0;
  for (let i = 0; i < n * 3 && k < n; i++) { const a = rnd(-1.35, 1.35), r = rnd(p.rMin || 42, p.rMax || 80), x = Math.sin(a) * r * 1.2, z = -Math.cos(a) * r - 3; if (p.skip && p.skip(x, z)) continue;
    const s = rnd(0.9, 1.7) * (r / 45), y = H(x, z); m.compose(new THREE.Vector3(x, y + s * 1.6, z), new THREE.Quaternion(), new THREE.Vector3(s, s * 1.1, s)); CM.setMatrixAt(k, m); CM.setColorAt(k, pal[k % pal.length].clone().offsetHSL(0, 0, rnd(-.04, .04)));
    m.compose(new THREE.Vector3(x, y - 0.2, z), new THREE.Quaternion(), new THREE.Vector3(s, s * 1.0, s)); TM.setMatrixAt(k, m); k++; }
  CM.count = TM.count = k; S.scene.add(CM, TM); return CM;
}

/* lush grass: thousands of blades, many greens, darker roots and sunny tips, swaying in the wind */
export function grass(S, p) {
  const seg = 5, bw = 0.075, g = new THREE.BufferGeometry(), P = [], U = [], I = [];
  for (let i = 0; i <= seg; i++) { const v = i / seg, w = bw * (1 - v * v * 0.92), bend = v * v * 0.28; P.push(-w, v, bend, w, v, bend); U.push(0, v, 1, v); }
  for (let i = 0; i < seg; i++) { const a = i * 2; I.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I);
  g.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(P.length / 3).fill(0).flatMap(() => [0, 1, 0]), 3));
  const U2 = { uTime: { value: 0 }, uTip: { value: C(p.tip || 0xE8FF8A) }, uWind: { value: p.wind || 1 } };
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.75, side: THREE.DoubleSide, envMapIntensity: 0.4 });
  mat.onBeforeCompile = sh => { Object.assign(sh.uniforms, U2);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime, uWind; varying float vH;')
      .replace('#include <project_vertex>', `vH = uv.y; vec4 mvPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
        #endif
        float bend = uv.y * uv.y; vec2 ip = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
        float w = sin(uTime * 1.5 + ip.x * 0.32 + ip.y * 0.21) * 0.6 + sin(uTime * 2.9 + ip.x * 0.9 - ip.y * 0.4) * 0.22;
        mvPosition.x += w * bend * 0.22 * uWind; mvPosition.z += w * bend * 0.08 * uWind;
        mvPosition = modelViewMatrix * mvPosition; gl_Position = projectionMatrix * mvPosition;`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uTip; varying float vH;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= mix(0.42, 1.12, vH); diffuseColor.rgb = mix(diffuseColor.rgb, uTip, smoothstep(0.62, 1.0, vH) * 0.38);'); };
  mat.customProgramCacheKey = () => 'grassblade';
  const MAX = p.count || 16000, mesh = new THREE.InstancedMesh(g, mat, MAX), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color();
  const pal = p.colors.map(C), H = S.groundH || (() => 0);
  let n = 0, tries = 0;
  while (n < MAX && tries < MAX * 6) { tries++;
    const near = Math.random() < 0.6, x = near ? rnd(-14, 14) : rnd(-34, 34), z = near ? rnd(-8, 5.5) : rnd(-36, 5.5);
    if (p.skip && p.skip(x, z)) continue;
    const h = H(x, z), sc = rnd(0.32, 0.62) * (p.tall || 1) * (near ? 1 : 1.25) * (1 + 0.25 * Math.sin(x * 0.4 + z * 0.3)) * (1 - smooth(0, 5, z) * 0.45);
    e.set(rnd(-0.12, 0.12), rnd(0, Math.PI * 2), rnd(-0.12, 0.12)); q.setFromEuler(e);
    m.compose(new THREE.Vector3(x, h - 0.02, z), q, new THREE.Vector3(rnd(0.8, 1.4), sc, 1)); mesh.setMatrixAt(n, m);
    const k = (Math.sin(x * 0.23 + z * 0.31) * 0.5 + 0.5) * (pal.length - 1), i0 = Math.floor(k);
    col.copy(pal[i0]).lerp(pal[Math.min(pal.length - 1, i0 + 1)], k - i0); col.offsetHSL(rnd(-0.02, 0.02), rnd(-0.05, 0.08), rnd(-0.06, 0.06));
    mesh.setColorAt(n, col); n++; }
  mesh.count = n; mesh.receiveShadow = true; mesh.frustumCulled = false; S.scene.add(mesh);
  const full = n, setT = t => mesh.count = Math.floor(full * [0.22, 0.55, 1][t]); setT(S.tier); S.onTier.push(setT);
  S.tick(t => U2.uTime.value = t);
  return mesh;
}

/* flowers: bright cupped petals with glowing centers */
export function flowerGeo(petals = 5) {
  const sh = new THREE.Shape(), N = 60;
  for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2, r = 0.62 + 0.38 * Math.pow(Math.abs(Math.cos(a * petals / 2)), 0.7); const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  const g = new THREE.ShapeGeometry(sh, 6); const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), r = Math.hypot(x, y); pos.setZ(i, r * r * 0.35); }
  g.computeVertexNormals(); g.rotateX(-Math.PI / 2); return g;
}
export function flowers(S, p) {
  const n = Math.round((p.count || 140) * (Q.low ? 0.4 : 1)), pg = flowerGeo(p.petals || 5), cg = new THREE.SphereGeometry(0.34, 12, 8), stem = new THREE.CylinderGeometry(0.03, 0.04, 1, 5); stem.translate(0, 0.5, 0);
  const pm = toon(0xffffff, { rough: 0.5, clear: 0.2, side: THREE.DoubleSide, rimI: 0.25, emissive: 0x111111, sheen: 0.6 }), cm = toon(0xFFC93C, { emissive: 0xFF9A00, ei: 0.35 }), sm = new THREE.MeshStandardMaterial({ color: 0x3FA43A, roughness: .8 });
  const P = new THREE.InstancedMesh(pg, pm, n), Cn = new THREE.InstancedMesh(cg, cm, n), St = new THREE.InstancedMesh(stem, sm, n), m = new THREE.Matrix4(), cols = (p.colors || [0xFF4FA3, 0xFF7A45, 0xFFD23F, 0xB46BFF, 0xffffff, 0x4FC3FF]).map(C);
  const H = S.groundH || (() => 0), list = []; let k = 0, tries = 0;
  while (k < n && tries < n * 30) { tries++; const x = rnd(-24, 24), z = rnd(-22, 7.5); if (p.skip && p.skip(x, z)) continue;
    const s = rnd(0.16, 0.3) * (p.size || 1) * (1 + smooth(-4, 6, z) * 0.35), h = H(x, z) + rnd(0.25, 0.55), y = rnd(0, 6);
    m.compose(new THREE.Vector3(x, h, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(-.3, .3), y, rnd(-.3, .3))), new THREE.Vector3(s, s, s)); P.setMatrixAt(k, m);
    P.setColorAt(k, cols[k % cols.length].clone().offsetHSL(rnd(-.02, .02), 0, rnd(-.04, .04)));
    m.compose(new THREE.Vector3(x, h + 0.08 * s, z), new THREE.Quaternion(), new THREE.Vector3(s * 0.75, s * 0.55, s * 0.75)); Cn.setMatrixAt(k, m);
    m.compose(new THREE.Vector3(x, H(x, z) - 0.05, z), new THREE.Quaternion(), new THREE.Vector3(1, h - H(x, z) + 0.05, 1)); St.setMatrixAt(k, m);
    list.push({ x, z, h, s, y }); k++; }
  [P, Cn, St].forEach(o => { o.count = k; o.castShadow = false; o.receiveShadow = true; S.scene.add(o); });
  return { petals: P, list };
}

/* floating sparkles / pollen that glow */
let _dot = null;
export function dotTex() {
  if (_dot) return _dot; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return (_dot = new THREE.CanvasTexture(c));
}
let _star = null;
export function starTex() {
  if (_star) return _star; const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.fillStyle = '#fff'; x.beginPath();
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = i % 2 ? 14 : 62; x.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } x.closePath(); x.globalAlpha = 0.9; x.fill();
  return (_star = new THREE.CanvasTexture(c));
}
export function sparkles(S, p = {}) {
  const n = p.count || 160, g = new THREE.BufferGeometry(), P = new Float32Array(n * 3), ph = new Float32Array(n), cols = new Float32Array(n * 3), pal = (p.colors || [0xFFF3B0, 0xFFFFFF, 0xFFD1F0]).map(C);
  for (let i = 0; i < n; i++) { P[i * 3] = rnd(-16, 16); P[i * 3 + 1] = rnd(0.3, 7); P[i * 3 + 2] = rnd(-14, 6); ph[i] = rnd(0, 6.28); const c = pal[i % pal.length]; cols.set([c.r, c.g, c.b], i * 3); }
  g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const U = { uTime: { value: 0 }, map: { value: dotTex() }, uSize: { value: (p.size || 0.18) * innerHeight } };
  const mat = new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    vertexShader: `uniform float uTime, uSize; attribute float ph; varying float vA; varying vec3 vC;
      void main(){ vec3 p = position; p.y += sin(uTime*0.6+ph)*0.5; p.x += sin(uTime*0.4+ph*2.0)*0.6; vC = color;
        vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv; vA = 0.45 + 0.55*sin(uTime*2.2+ph*3.0);
        gl_PointSize = uSize * (0.6 + 0.4*sin(ph*5.0)) / -mv.z; }`,
    fragmentShader: 'uniform sampler2D map; varying float vA; varying vec3 vC; void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC*1.6, t.a*max(vA,0.0)); }' });
  const pts = new THREE.Points(g, mat); pts.frustumCulled = false; S.scene.add(pts);
  S.tick(t => U.uTime.value = t); addEventListener('resize', () => U.uSize.value = (p.size || 0.18) * innerHeight);
  return pts;
}

/* butterflies that flutter around and glow a little */
export function butterflies(S, n = 4, cols = [0xFF5FB8, 0x4FC3FF, 0xFFB020, 0xA66BFF]) {
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(0.3, 0.9, 1.1, 0.8, 0.9, 0.1); sh.bezierCurveTo(1.0, -0.4, 0.4, -0.7, 0, -0.1);
  const wg = new THREE.ShapeGeometry(sh, 10), list = [];
  for (let i = 0; i < n; i++) {
    const mat = toon(cols[i % cols.length], { side: THREE.DoubleSide, emissive: cols[i % cols.length], ei: 0.35, rimI: 0.3 }), b = new THREE.Group();
    const L = new THREE.Mesh(wg, mat), Rr = new THREE.Mesh(wg, mat); Rr.scale.x = -1; const wl = new THREE.Group(), wr = new THREE.Group(); wl.add(L); wr.add(Rr); b.add(wl, wr);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.5, 4, 8), toon(0x3A2A5A)); body.rotation.x = 0; b.add(body);
    b.scale.setScalar(0.32); S.scene.add(b); list.push({ b, wl, wr, ph: rnd(0, 9), c: new THREE.Vector3(rnd(-8, 8), rnd(1.5, 4), rnd(-6, 2)) });
  }
  S.tick(t => list.forEach(o => { const a = t * 0.35 + o.ph; o.b.position.set(o.c.x + Math.sin(a) * 3, o.c.y + Math.sin(a * 2.3) * 0.6, o.c.z + Math.cos(a * 0.8) * 2.2);
    o.b.rotation.set(-1.0, Math.atan2(Math.cos(a), -Math.sin(a * 0.8)), 0); const f = Math.sin(t * 16 + o.ph) * 1.1; o.wl.rotation.y = f; o.wr.rotation.y = -f; }));
  return list;
}

/* celebration: confetti + glowing stars (2 seconds) */
export function party(S) {
  const N = 180, g = new THREE.PlaneGeometry(0.12, 0.2), mat = toon(0xffffff, { side: THREE.DoubleSide, emissive: 0x333333, rimI: 0.2 }), mesh = new THREE.InstancedMesh(g, mat, N);
  const pal = [0xFF3B6B, 0xFFB800, 0x2ED16B, 0x3DA5FF, 0xB45CFF, 0xFF7A2E, 0x00D4C8].map(C), ps = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < N; i++) { mesh.setColorAt(i, pal[i % pal.length]); ps.push({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Vector3(), life: 0 }); m.makeScale(0, 0, 0); mesh.setMatrixAt(i, m); }
  mesh.frustumCulled = false; S.scene.add(mesh);
  const sg = new THREE.BufferGeometry(), SN = 40, sp = new Float32Array(SN * 3), sv = [], sl = new Float32Array(SN);
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('life', new THREE.BufferAttribute(sl, 1));
  const sm = new THREE.ShaderMaterial({ uniforms: { map: { value: starTex() }, uSize: { value: 0.6 * innerHeight } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float life; uniform float uSize; varying float vL; void main(){ vL = life; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = uSize*sin(life*3.14159)*0.5/-mv.z; }',
    fragmentShader: 'uniform sampler2D map; varying float vL; void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vec3(2.2,1.9,1.1)*t.rgb, t.a*step(0.001,vL)); }' });
  const stars = new THREE.Points(sg, sm); stars.frustumCulled = false; S.scene.add(stars);
  for (let i = 0; i < SN; i++) sv.push(new THREE.Vector3());
  S.tick((t, dt) => { let any = false;
    ps.forEach((o, i) => { if (o.life <= 0) return; any = true; o.life -= dt; o.v.y -= 7 * dt; o.v.multiplyScalar(0.985); o.p.addScaledVector(o.v, dt); o.r.x += dt * 9; o.r.y += dt * 7;
      e.set(o.r.x, o.r.y, o.r.z); q.setFromEuler(e); const s = o.life > 0 ? Math.min(1, o.life * 2) : 0; m.compose(o.p, q, new THREE.Vector3(s, s, s)); mesh.setMatrixAt(i, m); });
    if (any) mesh.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < SN; i++) if (sl[i] > 0) { sl[i] = Math.max(0, sl[i] - dt * 0.7); sp[i * 3] += sv[i].x * dt; sp[i * 3 + 1] += sv[i].y * dt; sp[i * 3 + 2] += sv[i].z * dt; sv[i].multiplyScalar(0.96); }
    sg.attributes.position.needsUpdate = true; sg.attributes.life.needsUpdate = true; });
  return {
    burst(at, k = 1) { let c = 0; ps.forEach(o => { if (o.life > 0 || c > 120 * k) return; c++; o.p.copy(at).add(new THREE.Vector3(rnd(-.3, .3), rnd(-.3, .3), rnd(-.3, .3)));
        o.v.set(rnd(-5, 5), rnd(4, 10), rnd(-2, 4)); o.r.set(rnd(0, 6), rnd(0, 6), rnd(0, 6)); o.life = rnd(1.6, 2.4); });
      for (let i = 0; i < SN; i++) { sp.set([at.x + rnd(-.5, .5), at.y + rnd(-.5, .5), at.z + rnd(-.2, .4)], i * 3); sv[i].set(rnd(-3.5, 3.5), rnd(-2, 4), rnd(-1, 2)); sl[i] = rnd(0.7, 1); } },
    twinkle(at, n = 6) { let c = 0; for (let i = 0; i < SN && c < n; i++) if (sl[i] <= 0) { c++; sp.set([at.x + rnd(-.3, .3), at.y + rnd(-.3, .3), at.z + 0.3], i * 3); sv[i].set(rnd(-1.5, 1.5), rnd(-.5, 2), 0); sl[i] = rnd(.5, .8); } }
  };
}

/* a soft glowing card behind the letter so it always stands out from the world */
export function aura(S, at, w = 5, h = 5, color = 0xFFFFF0, k = 0.5) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), color: C(color), transparent: true, opacity: k, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  m.position.copy(at); m.position.z -= 0.6; m.renderOrder = 2; S.scene.add(m); return m;
}

/* ============================== cartoon eyes ============================== */
export function eye(r = 0.3, o = {}) {
  const G = new THREE.Group(), lid = new THREE.Group(); G.add(lid);
  const white = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), toon(0xffffff, { rough: 0.15, clear: 1, rimI: 0.15, env: 1 }));
  const iris = new THREE.Group(), ir = new THREE.Mesh(new THREE.SphereGeometry(r * 0.62, 28, 16), toon(o.iris || 0x2B1A0E, { rough: 0.1, clear: 1, env: 1.2, rimI: 0 }));
  ir.scale.z = 0.4; ir.position.z = r * 0.8; const pu = new THREE.Mesh(new THREE.SphereGeometry(r * 0.36, 20, 12), toon(0x05040A, { rough: 0.05, clear: 1, rimI: 0 })); pu.scale.z = 0.35; pu.position.z = r * 0.95;
  const h1 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.17, 12, 8), glow(0xffffff, 3)); h1.position.set(r * 0.2, r * 0.22, r * 1.1);
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.08, 10, 6), glow(0xffffff, 2.5)); h2.position.set(-r * 0.18, -r * 0.16, r * 1.09);
  iris.add(ir, pu); lid.add(white, iris, h1, h2); white.castShadow = true;
  G.userData = { iris, lid, r, nextBlink: rnd(1, 4), blink: 0, big: 1 };
  return G;
}
/* blink every few seconds and look toward a point (in world space) */
export function eyesTick(S, eyes, lookAt) {
  const v = new THREE.Vector3(), inv = new THREE.Matrix4();
  S.tick((t, dt) => eyes.forEach((E, i) => { const u = E.userData;
    u.nextBlink -= dt; if (u.nextBlink <= 0 && i === 0) { eyes.forEach(x => x.userData.blink = 0.16); eyes.forEach(x => x.userData.nextBlink = rnd(1.6, 4.5)); }
    let sy = 1; if (u.blink > 0) { u.blink -= dt; sy = Math.abs(u.blink / 0.08 - 1); sy = Math.max(0.08, sy); }
    u.lid.scale.set(u.big, u.big * sy, u.big);
    const target = lookAt(); if (target) { E.updateWorldMatrix(true, false); if (Math.abs(E.matrixWorld.determinant()) < 1e-9) return; inv.copy(E.matrixWorld).invert(); v.copy(target).applyMatrix4(inv).normalize(); if (!isFinite(v.x + v.y + v.z)) return;
      u.iris.rotation.y += (clamp(Math.atan2(v.x, v.z), -0.5, 0.5) - u.iris.rotation.y) * 0.15; u.iris.rotation.x += (clamp(-Math.asin(clamp(v.y, -1, 1)), -0.4, 0.4) - u.iris.rotation.x) * 0.15; } }));
}

/* a soft round blob shadow (cheap contact shadow under characters) */
export function blob(S, r = 1, k = 0.35) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(20,40,10,' + k + ')'); g.addColorStop(1, 'rgba(20,40,10,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.renderOrder = 1; S.scene.add(m); return m;
}

/* ============================== letters and tracing ============================== */
/* one set of stroke paths (0..200 box) for drawing, tracing and the 3D letter */
export const STROKES = {
  s: ['M146 58 C130 34 62 34 60 68 C58 100 142 96 142 134 C142 172 70 174 52 146'],
  a: ['M128 84 C116 62 70 64 68 106 C66 148 118 150 128 120', 'M130 70 L130 152'],
  t: ['M100 40 L100 136 C100 152 114 156 132 148', 'M68 70 L132 70']   /* Esti 2026-11-24: the t with a short stem above the bar (option 2) */
};
/* a stroke path -> evenly spaced 3D points (1 unit = 40 path units), centred on (cx, cy) */
export function strokePoints(d, step = 0.06, cx = 0, cy = 2.75, z = 0) {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d);
  const L = p.getTotalLength(), n = Math.max(2, Math.round(L / 40 / step)), out = [];
  for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L * i / n); out.push(new THREE.Vector3(cx + (q.x - 100) / 40, cy + (110 - q.y) / 40, z)); }
  return out;
}
/* a tube along points whose index order runs along the length, so setDrawRange "grows" it; radius r(t), color col(t, around) */
export function growTube(pts, radius, color, radial = 18) {
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), N = Math.max(40, pts.length * 2), frames = curve.computeFrenetFrames(N, false);
  const P = [], Nn = [], Co = [], I = [], c = new THREE.Color(), v = new THREE.Vector3(), nr = new THREE.Vector3();
  for (let i = 0; i <= N; i++) { const t = i / N, p = curve.getPointAt(t), r = radius(t);
    for (let j = 0; j <= radial; j++) { const a = j / radial * Math.PI * 2, s = Math.sin(a), co = -Math.cos(a);
      nr.set(0, 0, 0).addScaledVector(frames.normals[i], co).addScaledVector(frames.binormals[i], s).normalize(); v.copy(p).addScaledVector(nr, r);
      P.push(v.x, v.y, v.z); Nn.push(nr.x, nr.y, nr.z); color(t, nr, c); Co.push(c.r, c.g, c.b); } }
  for (let i = 0; i < N; i++) for (let j = 0; j < radial; j++) { const a = i * (radial + 1) + j, b = a + radial + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(Nn, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(Co, 3)); g.setIndex(I);
  g.userData = { curve, N, radial, grow(k) { g.setDrawRange(0, Math.floor(clamp(k, 0, 1) * N) * radial * 6); } };
  return g;
}

/* the finger-tracing helper: strokes in order, start light, forgiving for small fingers; progress 0..1 across all strokes */
export function tracer(S, strokes, o = {}) {
  const T = { strokes, si: 0, k: 0, done: false, on: false, down: false, onMove: o.onMove || (() => {}), onDone: o.onDone || (() => {}), onStroke: o.onStroke || (() => {}), lastMove: 0, lastProgress: 0 };
  const total = strokes.reduce((a, s) => a + s.length - 1, 0);
  T.progress = () => { let a = 0; for (let i = 0; i < T.si; i++) a += strokes[i].length - 1; return T.done ? 1 : (a + T.k) / total; };
  T.strokeProgress = () => T.k / (strokes[T.si].length - 1);
  T.startPoint = () => strokes[T.si][0];
  T.reset = () => { T.si = 0; T.k = 0; T.done = false; };
  const reach = () => (innerWidth < 600 ? 0.82 : 0.62) * (o.reach || 1);
  T.step = w => { const P = strokes[T.si]; let best = T.k, bd = Math.min(reach(), w.distanceTo(P[T.k]));   /* follow the finger: the nearest path point just ahead, never running ahead of it */
    for (let i = T.k + 1; i < Math.min(P.length, T.k + 14); i++) { const d = w.distanceTo(P[i]); if (d < reach() && d <= bd + 1e-6) { best = i; bd = d; } }
    if (best > T.k) { T.k = best; T.lastMove = T.lastProgress = S.t; T.onMove(T);
      if (T.k >= P.length - 3) { T.k = P.length - 1; T.onMove(T);
        if (T.si < strokes.length - 1) { T.si++; T.k = 0; T.down = false; T.onStroke(T); } else { T.done = true; T.on = false; T.down = false; T.onDone(T); } } } };
  const el = S.renderer.domElement;
  el.addEventListener('pointerdown', e => { if (!T.on) return; const w = S.onPlane(e, 0); if (!w) return;
    if (T.k === 0 && w.distanceTo(strokes[T.si][0]) > reach() * 1.3) { if (o.onFar) o.onFar(); return; }
    if (T.k > 0 && w.distanceTo(strokes[T.si][T.k]) > reach() * 1.5) { if (o.onLost) o.onLost(); return; }   /* partway: he must go on from where he stopped */
    T.down = true; try { el.setPointerCapture(e.pointerId); } catch (x) {} T.step(w); });
  el.addEventListener('pointermove', e => { if (T.down && T.on) { const w = S.onPlane(e, 0); if (!w) return; T.step(w);
    if (T.on && w.distanceTo(strokes[T.si][T.k]) > reach() * 1.8 && o.onOff) o.onOff(); } });   /* wandered off the path: a kind reminder */
  const up = () => { if (T.down) { T.down = false; if (o.onUp) o.onUp(); } };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
  /* glowing guide dots along the path and a pulsing green start light */
  const dots = new THREE.Group(), dm = new THREE.MeshBasicMaterial({ color: C(0xffffff).multiplyScalar(1.4), transparent: true, opacity: 0.9 }), dg = new THREE.SphereGeometry(0.1, 12, 8);
  strokes.forEach(P => P.forEach((p, i) => { if (i % 3) return; const d = new THREE.Mesh(dg, dm); d.position.copy(p); d.position.z += 0.05; dots.add(d); }));
  const start = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), glow(0x3DFF7A, 2.4)), halo = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.42, 40), new THREE.MeshBasicMaterial({ color: C(0x9CFFBE).multiplyScalar(1.6), transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
  start.add(halo); dots.visible = start.visible = false; S.scene.add(dots, start); if (o.ringOnly) { start.material.visible = false; }
  /* a wide, soft, shiny track under the dots so the path is easy to see on bright grass */
  const trackM = new THREE.MeshBasicMaterial({ color: C(0xFFFBE8), transparent: true, opacity: 0.32, depthWrite: false });
  strokes.forEach(P => { const g = growTube(P, () => 0.3, (t, n, c) => c.set(0xffffff), 10); g.userData.grow(1); const m = new THREE.Mesh(g, trackM); m.scale.z = 0.15; dots.add(m); });
  T.dots = dots; T.start = start; T.dm = dm;
  S.tick(t => { start.visible = T.on && (T.k < 3 || !T.down); if (start.visible) { start.position.copy(strokes[T.si][T.k]); start.position.z += o.startZ || 0.25; const k = 1 + Math.sin(t * 6) * 0.15; start.scale.setScalar(k); halo.scale.setScalar((o.ringOnly ? 1.7 : 1) * (1 + ((t * 1.2) % 1) * (o.ringOnly ? 0.3 : 0.8))); halo.material.opacity = 0.8 * (1 - (t * 1.2) % 1); }
    dots.visible = !!(T.on || T.showDots); if (dots.visible) dm.opacity = 0.55 + Math.sin(t * 3) * 0.25; });
  return T;
}

/* ============================== sound and voice ============================== */
let AC = null;
export const audio = { hissN: 0, aN: 0, said: [] };
audio.ctx = () => { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; };
function noiseBuf(c, sec) { const len = c.sampleRate * sec, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; return b; }
let hissLive = null;
/* the pure "sss" (never "suh"): shaped noise, made by the device */
audio.hissStart = () => { if (hissLive) return; audio.hissN++; const c = audio.ctx(); if (!c || FAST) return;
  const src = c.createBufferSource(); src.buffer = noiseBuf(c, 2); src.loop = true; const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2600;
  const pk = c.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 5500; pk.Q.value = 1.2; pk.gain.value = 9; const g = c.createGain(); g.gain.value = 0;
  src.connect(hp); hp.connect(pk); pk.connect(g); g.connect(c.destination); src.start(); g.gain.setTargetAtTime(0.22, c.currentTime, 0.04); hissLive = { src, g }; };
audio.hissStop = () => { if (!hissLive || !AC) { hissLive = null; return; } const n = hissLive; hissLive = null; n.g.gain.setTargetAtTime(0, AC.currentTime, 0.05); setTimeout(() => { try { n.src.stop(); } catch (e) {} }, 300); };
audio.hiss = ms => { audio.hissStart(); return new Promise(r => setTimeout(() => { audio.hissStop(); r(); }, FAST ? 0 : ms || 1000)); };
/* the pure short "a" (as in apple): a voiced vowel built from its mouth-shape resonances, made by the device */
audio.vowelA = (ms = 420) => { audio.aN++; const c = audio.ctx(); if (c && !FAST) { const t0 = c.currentTime, d = ms / 1000, o = c.createOscillator(), g = c.createGain(), out = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(230, t0); o.frequency.linearRampToValueAtTime(205, t0 + d);
    [[800, 9, 1], [1750, 11, 0.55], [2600, 13, 0.22]].forEach(([f, q, k]) => { const b = c.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = f; b.Q.value = q; const gg = c.createGain(); gg.gain.value = k * 3.2; o.connect(b); b.connect(gg); gg.connect(out); });
    out.connect(g); g.connect(c.destination); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.5, t0 + 0.04); g.gain.setValueAtTime(0.5, t0 + d - 0.08); g.gain.linearRampToValueAtTime(0, t0 + d); o.start(t0); o.stop(t0 + d + 0.05); }
  return new Promise(r => setTimeout(r, FAST ? 0 : ms + 60)); };
audio.chime = notes => { const c = audio.ctx(); if (!c || FAST) return; const t = c.currentTime; notes.forEach((f, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0, t + i * .08); g.gain.linearRampToValueAtTime(.12, t + i * .08 + .02); g.gain.exponentialRampToValueAtTime(.001, t + i * .08 + .6); o.connect(g); g.connect(c.destination); o.start(t + i * .08); o.stop(t + i * .08 + .65); }); };
audio.boing = (f = 300) => { const c = audio.ctx(); if (!c || FAST) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 0.12); o.frequency.exponentialRampToValueAtTime(f * 1.2, t + 0.3);
  g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.4); };
audio.pop = () => { const c = audio.ctx(); if (!c || FAST) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(260, t + 0.08);
  g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.15); };
audio.party = () => audio.chime([523, 659, 784, 1047, 1319, 1568]);

/* the voice: the school's teacher voice, else the device voice */
const TTS = 'https:' + '/' + '/' + 'tts-q26c275eaa-uk.a.run.app', vcache = {}; let vtok = 0, va = null;
audio.hush = () => { vtok++; try { if (va) va.pause(); } catch (e) {} va = null; try { speechSynthesis.cancel(); } catch (e) {} audio.hissStop(); };
function fetchVoice(t) { return fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t, voice: 'teacher' }) }).then(r => r.json()).then(j => { if (j && j.ok && j.url) { vcache[t] = j.url; return j.url; } throw new Error('tts'); }); }
audio.say = t => { audio.said.push(t); if (FAST) return Promise.resolve(); const my = vtok;
  return new Promise(done => { let fin = false; const end = () => { if (!fin) { fin = true; done(); } }; setTimeout(end, t.length * 85 + 2500);
    const dev = () => { if (my !== vtok) return end(); try { const u = new SpeechSynthesisUtterance(t); u.rate = 0.92; u.pitch = 1.1; u.onend = end; u.onerror = end; speechSynthesis.speak(u); } catch (e) { end(); } };
    const play = url => { if (my !== vtok) return end(); const a = new Audio(url); va = a; a.onended = end; a.onerror = dev; const p = a.play(); if (p && p.catch) p.catch(dev); };
    if (vcache[t]) return play(vcache[t]);
    Promise.race([fetchVoice(t), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 1800))]).then(play).catch(dev); }); };
audio.preload = lines => { if (FAST) return; lines.forEach(t => { if (!vcache[t]) fetchVoice(t).catch(() => {}); }); };

/* the script runner: lines are spoken, functions run; "hear it again" repeats the words and marked sounds and never blocks */
export function runner(againBtn) {
  const R = { cur: [], busy: false, tok: 0, echoTok: 0, again: 0 };
  R.run = (sc, again) => { const my = ++R.tok; R.echoTok++; audio.hush(); R.cur = again || sc.filter(s => typeof s === 'string' || (typeof s === 'function' && s.echo)); R.busy = true; if (againBtn) againBtn.classList.add('wait');
    return sc.reduce((p, s) => p.then(() => { if (my !== R.tok) return; return typeof s === 'string' ? audio.say(s) : s(); }), Promise.resolve())
      .then(() => { if (my === R.tok) { R.busy = false; if (againBtn) againBtn.classList.remove('wait'); } return my === R.tok; }); };
  R.stop = () => { R.tok++; R.busy = false; audio.hush(); if (againBtn) againBtn.classList.remove('wait'); };
  R.echo = () => { const my = ++R.echoTok; audio.hush(); R.cur.reduce((p, s) => p.then(() => { if (my !== R.echoTok) return; return typeof s === 'string' ? audio.say(s) : s(); }), Promise.resolve()); };
  if (againBtn) againBtn.onclick = () => { R.again++; R.echo(); };
  return R;
}
export const echo = fn => { fn.echo = true; return fn; };
