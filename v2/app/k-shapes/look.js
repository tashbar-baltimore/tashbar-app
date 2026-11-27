/* Kindergarten Shapes: the NEW LOOK (Esti, 2026-11-24: "take the look 10 levels higher"). kit.js uses this when a game sets
   cfg.world (for example world: 'playroom'). Everything a boy sees but does not touch lives here:
   - sharp: drawn at up to 2x detail with smoothing; a slow Chromebook gets simpler effects (never a slower game)
   - colour and light: bright glossy toy colours, a warm sunny key light, a rim light, soft coloured shadows, a tone curve that keeps colours bright
   - a world for each unit: a room with depth (the far wall is softly blurred), moving curtains, sunbeams, floating dust
   - loveable characters: Mendy and his friends, Tatty and Mommy (modest, warm, frum)
   - bouncy motion: squash and stretch, box wiggle, confetti and star bursts
   No teaching, voice or game rules live here, so the tests and the lessons work exactly as before.
   All art is made from code (three.js shapes and pictures painted on a hidden canvas): no picture files to load. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from './lib/RoundedBoxGeometry.js';
import { createTreasures } from './treasures.js';

/* a tone curve that keeps toy colours bright and true (Khronos "PBR Neutral"), instead of the default orange-grey film look */
THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace('vec3 CustomToneMapping( vec3 color ) { return color; }', `
vec3 CustomToneMapping( vec3 color ) {
  color *= toneMappingExposure;
  const float startCompression = 0.76; const float desaturation = 0.15;
  float x = min( color.r, min( color.g, color.b ) );
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  color -= offset;
  float peak = max( color.r, max( color.g, color.b ) );
  if ( peak < startCompression ) return color;
  const float d = 1.0 - startCompression;
  float newPeak = 1.0 - d * d / ( peak + d - startCompression );
  color *= newPeak / peak;
  float g = 1.0 - 1.0 / ( desaturation * ( peak - newPeak ) + 1.0 );
  return mix( color, vec3( newPeak ), g );
}`);

/* the same "random" art every time */
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* bright toy colours: the old palette, made sunnier */
export const TOY = ['#FF3B30', '#2F80FF', '#FFC21A', '#1DC77A', '#9A5BFF', '#FF8A1F', '#00C3D6', '#FF4FA0'];
const OLD2TOY = { '#FFC21A': '#FFD21F', '#E03A33': '#FF3B30', '#1F6FEB': '#2F80FF', '#F2A900': '#FFD21F', '#12A766': '#1DC77A', '#7C4DFF': '#9A5BFF', '#FF7A1A': '#FF8A1F', '#00A3B8': '#00C3D6', '#F0458E': '#FF4FA0' };
export function vivid(c) {
  const k = String(c).toUpperCase(); if (OLD2TOY[k]) return OLD2TOY[k];
  const col = new THREE.Color(c), hsl = {}; col.getHSL(hsl);
  if (hsl.s < 0.15) return '#' + col.getHexString();
  col.setHSL(hsl.h, Math.min(1, hsl.s * 1.15 + 0.05), Math.min(0.62, Math.max(0.45, hsl.l))); return '#' + col.getHexString();
}

export function createLook({ renderer, scene, camera, FAST, world }) {
  const ANISO = Math.min(8, renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1);
  const DPR = window.devicePixelRatio || 1;
  const L = { kids: [], adults: [], springs: [], fx: [], Q: FAST ? 0 : 2 };
  /* the automatic test (?fast=1) uses plain materials and small painted pictures, so a test machine stays quick (a boy always gets the full look) */
  const PM = FAST ? class extends THREE.MeshStandardMaterial { constructor(o = {}) { const c = Object.assign({}, o); ['clearcoat', 'clearcoatRoughness', 'sheen', 'sheenColor', 'sheenRoughness', 'transmission', 'thickness'].forEach(k => delete c[k]); super(c); } } : THREE.MeshPhysicalMaterial;
  const TK = FAST ? 0.25 : 1;

  /* ---------- pictures painted in code ---------- */
  function paint(w, h, draw, o = {}) {
    const c = document.createElement('canvas'); c.width = Math.max(4, Math.round(w * TK)); c.height = Math.max(4, Math.round(h * TK)); const x = c.getContext('2d'); if (TK !== 1) x.scale(TK, TK); draw(x, w, h);
    const t = new THREE.CanvasTexture(c); if (o.srgb !== false) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANISO;
    if (o.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.repeat[0], o.repeat[1]); }
    return t;
  }
  const soft = paint(128, 128, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); }, { srgb: false });
  const starTex = paint(128, 128, (x, w) => {
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,240,180,.9)'); g.addColorStop(0.35, 'rgba(255,210,80,.35)'); g.addColorStop(1, 'rgba(255,200,60,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 17 : 42, a = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } x.closePath();
    x.fillStyle = '#FFE26B'; x.shadowColor = '#FFF6C8'; x.shadowBlur = 10; x.fill(); x.shadowBlur = 0; x.lineWidth = 4; x.strokeStyle = '#FFB000'; x.stroke();
  });
  const twinkleTex = paint(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,250,220,.6)'); g.addColorStop(1, 'rgba(255,240,200,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.moveTo(32, 0); x.quadraticCurveTo(35, 29, 64, 32); x.quadraticCurveTo(35, 35, 32, 64); x.quadraticCurveTo(29, 35, 0, 32); x.quadraticCurveTo(29, 29, 32, 0); x.fill(); });

  /* ---------- the world's own things: cupcakes in the bakery, a tyre on the farm ... (treasures.js) ---------- */
  const TR = createTreasures({ world, PM, paint, FAST, ANISO, vivid });
  L.bead = TR.bead; L.board = TR.board; L.treasures = TR; TR.camera = camera;

  /* ---------- renderer: sharp, bright, soft shadows ---------- */
  function prFor(q) { return FAST ? 0.5 : q >= 2 ? Math.min(2, Math.max(DPR, 1.5)) : q === 1 ? Math.min(DPR, 1.5) : Math.min(DPR, 1); }
  renderer.toneMapping = THREE.CustomToneMapping; renderer.toneMappingExposure = 0.92;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.setPixelRatio(prFor(L.Q));
  const BG = new THREE.Color('#FBE7C8');
  scene.background = BG; scene.fog = new THREE.Fog('#FBE3C0', 24, 52);

  /* light: a warm sunny key light with soft shadows, a sky/floor fill, a gentle rim light from behind, a warm bounce from the front.
     Each world tunes the colours (see ENV below). */
  const hemi = new THREE.HemisphereLight('#F4F8FF', '#E8C9A6', 0.75);
  const sun = new THREE.DirectionalLight('#FFF3E0', 2.5); sun.position.set(-6, 12, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(FAST ? 512 : 2048, FAST ? 512 : 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 34 });
  const rim = new THREE.DirectionalLight('#FFD9A8', 1.0); rim.position.set(-4, 6, -9);
  const front = new THREE.DirectionalLight('#FFE9D2', 0.5); front.position.set(7, 3, 4);
  [hemi, sun, rim, front].forEach(l => { l.layers.enableAll(); scene.add(l); });
  if (FAST) { rim.visible = false; front.visible = false; renderer.shadowMap.enabled = false; }   /* the automatic test: fewer lights, quicker */
  sun.shadow.camera.layers.enableAll();
  /* the settings a world can change */
  const ENV = { exposure: 0.92, bloom: 0.22, vib: 0.18, box: ['#FFC94A', '#FFFFFF', '#E9A93A'], css: '#FBE7C8' };
  function setEnv(o) {
    Object.assign(ENV, o);
    if (o.bg) { BG.set(o.bg); scene.fog.color.set(o.fog ? o.fog[0] : o.bg); }
    if (o.fog) { scene.fog.color.set(o.fog[0]); scene.fog.near = o.fog[1]; scene.fog.far = o.fog[2]; }
    if (o.sun) { sun.color.set(o.sun[0]); sun.intensity = o.sun[1]; if (o.sun[2]) sun.position.set(...o.sun[2]); }
    if (o.hemi) { hemi.color.set(o.hemi[0]); hemi.groundColor.set(o.hemi[1]); hemi.intensity = o.hemi[2]; }
    if (o.rim) { rim.color.set(o.rim[0]); rim.intensity = o.rim[1]; }
    if (o.front) { front.color.set(o.front[0]); front.intensity = o.front[1]; }
    renderer.toneMappingExposure = ENV.exposure;
    if (o.css) document.body.style.background = o.css;
  }

  /* ---------- materials ---------- */
  const std = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6 }, o));
  const phys = (color, o = {}) => new PM(Object.assign({ color, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }, o));
  const MC = {}; const pm = (c, o) => { const k = c + JSON.stringify(o || {}); return MC[k] || (MC[k] = phys(c, o)); };   /* shared glossy material */
  const glow = (c, i) => { const k = 'g' + c + i; return MC[k] || (MC[k] = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i == null ? 1 : i, roughness: 0.4 })); };
  L.pieceMat = color => new PM({ color: vivid(color), roughness: 0.36, metalness: 0, clearcoat: 0.85, clearcoatRoughness: 0.12, envMapIntensity: 0.22, sheen: 0.25, sheenColor: new THREE.Color('#FFFFFF'), sheenRoughness: 0.35, emissive: '#FFC400', emissiveIntensity: 0 });
  L.stickMat = color => new PM({ color: vivid(color), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.0 });
  L.solidMat = color => L.pieceMat(color);
  /* the props a game mode adds (beads' string, the puzzle board, the bridge, pencils, towers, the scale...) get the glossy toy finish.
     Only plain, solid materials change; glowing, see-through and character materials are left as they are. */
  const toyCache = new Map();
  L.toyify = (root) => {
    if (FAST || !root || (root.userData && root.userData.kind)) return;
    root.traverse(o => {
      if (!o.isMesh || !o.material || Array.isArray(o.material)) return;
      const m = o.material; if (!m.isMeshStandardMaterial || m.isMeshPhysicalMaterial || m.transparent || m.map || (m.emissiveIntensity > 0 && (m.emissive.r + m.emissive.g + m.emissive.b) > 0)) return;
      let t = toyCache.get(m); if (!t) { const matte = m.roughness >= 0.85;
        t = new PM({ color: m.color.clone(), roughness: matte ? m.roughness : Math.min(m.roughness, 0.42), metalness: m.metalness, clearcoat: matte ? 0 : 0.75, clearcoatRoughness: 0.15, envMapIntensity: 0.3, flatShading: m.flatShading, side: m.side });
        toyCache.set(m, t); }
      o.material = t; o.castShadow = true;
    });
  };

  /* ---------- the far layer (drawn softly blurred, like a camera focused on the toys) ---------- */
  const FAR = 1;
  function farify(o) { o.traverse(c => { c.layers.set(FAR); c.castShadow = false; }); }   /* far things do not need to cast shadows on the toys: faster on a slow computer */
  const anim = [];   /* things that gently move: fn(t, q) */
  const noDepth = [];   /* far things that must not hide the near ground (the sky, the far ground) */
  const groundMats = [];   /* the ground's materials (a painted ground picture replaces the drawn one) */

  /* ================= the world kit: pieces every world is built from ================= */
  const G = {   /* shared shapes (made once, used many times) */
    ball: new THREE.SphereGeometry(1, 32, 22), ballLo: new THREE.SphereGeometry(1, 16, 12), cyl: new THREE.CylinderGeometry(1, 1, 1, 28), cone: new THREE.ConeGeometry(1, 1, 28),
    box: new RoundedBoxGeometry(1, 1, 1, 3, 0.12), torus: new THREE.TorusGeometry(1, 0.32, 16, 48), disc: new THREE.CircleGeometry(1, 48), plane: new THREE.PlaneGeometry(1, 1)
  };
  function mesh(geo, m, x, y, z, sx, sy, sz, par) { const o = new THREE.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); o.scale.set(sx || 1, sy == null ? (sx || 1) : sy, sz == null ? (sx || 1) : sz); o.castShadow = true; o.receiveShadow = true; (par || scene).add(o); return o; }
  function group(x, y, z, par) { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); (par || scene).add(g); return g; }
  /* the sky: a big soft dome, bright at the top, glowing at the horizon */
  function skyDome(top, mid, hor, sunDir) {
    const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color(top) }, mid: { value: new THREE.Color(mid) }, hor: { value: new THREE.Color(hor) }, sd: { value: new THREE.Vector3(...(sunDir || [-0.4, 0.35, -1])).normalize() } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 hor; uniform vec3 sd; varying vec3 vD; void main(){ float h = vD.y; vec3 c = h > 0.18 ? mix(mid, top, smoothstep(0.18, 0.75, h)) : mix(hor, mid, smoothstep(-0.05, 0.18, h)); float s = max(dot(normalize(vD), sd), 0.0); c += vec3(1.0, 0.93, 0.75) * (pow(s, 40.0) * 1.2 + pow(s, 6.0) * 0.18); gl_FragColor = vec4(c, 1.0); }' });
    const d = new THREE.Mesh(new THREE.SphereGeometry(90, 40, 20), m); d.renderOrder = -10; d.layers.set(FAR); d.frustumCulled = false; scene.add(d); noDepth.push(d); return d;
  }
  /* the ground: sharp near the toys, softly blurred far away (the near part fades out at its edge, so there is no line) */
  const fadeT = paint(256, 256, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, w * 0.36, w / 2, w / 2, w / 2); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#000000'); x.fillStyle = g; x.fillRect(0, 0, w, w); }, { srgb: false });
  function ground(tex, color, o = {}) {
    const near = new THREE.Mesh(new THREE.CircleGeometry(o.r || 13, 96), new PM({ color: color || '#FFFFFF', map: tex, roughness: o.rough || 0.85, sheen: o.sheen || 0, sheenColor: new THREE.Color(o.sheenColor || '#FFFFFF'), clearcoat: o.coat || 0, clearcoatRoughness: 0.4, alphaMap: fadeT, transparent: true, depthWrite: true }));
    near.rotation.x = -Math.PI / 2; near.position.y = 0.002; near.receiveShadow = true; near.renderOrder = -1; scene.add(near);
    /* UVs of the round piece match the far piece, so the pattern lines up where they meet */
    const uv = near.geometry.attributes.uv, R0 = o.r || 13, S = o.size || 160; for (let i = 0; i < uv.count; i++) { uv.setXY(i, 0.5 + (uv.getX(i) - 0.5) * 2 * R0 / S, 0.5 + (uv.getY(i) - 0.5) * 2 * R0 / S); }
    const fm = new THREE.MeshStandardMaterial({ color: color || '#FFFFFF', map: tex, roughness: 0.95 });
    const far = new THREE.Mesh(new THREE.PlaneGeometry(o.size || 160, o.size || 160), fm); far.rotation.x = -Math.PI / 2; far.position.y = -0.03; far.layers.set(FAR); scene.add(far); noDepth.push(far);
    groundMats.push(near.material, fm);
    near.material.alphaMap.repeat.set(1, 1);
    /* the alpha map uses the round piece's own 0..1 UVs */
    near.material.alphaMap = fadeT.clone(); near.material.alphaMap.repeat.set(S / (2 * R0), S / (2 * R0)); near.material.alphaMap.offset.set(0.5 - S / (4 * R0), 0.5 - S / (4 * R0)); near.material.alphaMap.needsUpdate = true;
    return { near, far };
  }
  /* the stage: the round mat in the middle where the shapes sit (its top is at 0.1, like the rug) */
  /* painted round mats that have arrived and been checked by eye (art/mat-<world>.png; k-shapes-art-requests.md) */
  const MATS = new Set(['toyland', 'garden', 'sky', 'bakery', 'space', 'beach', 'underwater', 'traintown', 'jungle', 'snow', 'farm', 'party']);
  /* calm (K-CLARITY-RULES 10, Esti 2026-11-27 "the backgrounds are so busy"): the painted mat under the shapes is paler and less colourful,
     so the shapes on it are the strongest thing he sees */
  function calmMat(t) { if (!CALM) return t; try { const im = t.image, cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height; const cx = cv.getContext('2d');
    cx.filter = 'saturate(0.45)'; cx.drawImage(im, 0, 0); cx.filter = 'none'; cx.fillStyle = 'rgba(255,255,255,0.5)'; cx.fillRect(0, 0, cv.width, cv.height); return new THREE.CanvasTexture(cv); } catch (e) { return t; } }
  function stage(draw, o = {}) {
    const t = paint(1024, 1024, (x, w) => draw(x, w / 2, w));
    const top = new PM({ color: '#FFFFFF', map: t, roughness: o.rough || 0.9, sheen: o.sheen == null ? 0.8 : o.sheen, sheenColor: new THREE.Color(o.sheenColor || '#FFF6E8'), sheenRoughness: 0.7, clearcoat: o.coat || 0, clearcoatRoughness: 0.3 });
    const s = new THREE.Mesh(new THREE.CylinderGeometry(o.r || 6.6, (o.r || 6.6) + 0.1, o.h || 0.1, 128), [std(o.edge || '#F4E6D2', { roughness: 0.8 }), top, top]);
    s.position.y = (o.h || 0.1) / 2; s.receiveShadow = true; s.castShadow = false; scene.add(s);
    if (MATS.has(world)) new THREE.TextureLoader().load('art/mat-' + world + '.png', t => { t = calmMat(t); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANISO; top.map = t; top.needsUpdate = true; });   /* a painted round mat from the picture account */
    return s;
  }
  /* soft round puffs (clouds, bushes, tree tops) */
  function puff(x, y, z, r, m, n, seed, par) {
    const g = group(x, y, z, par), R = rng(seed || 3);
    for (let i = 0; i < (n || 7); i++) { const a = R() * Math.PI * 2, d = R() * r * 0.7, s = r * (0.45 + R() * 0.4);
      mesh(G.ball, m, Math.cos(a) * d, (R() - 0.3) * r * 0.45, Math.sin(a) * d * 0.6, s, s * 0.9, s, g); }
    mesh(G.ball, m, 0, 0, 0, r * 0.8, r * 0.7, r * 0.7, g); return g;
  }
  function cloud(x, y, z, s, seed, color) { const g = puff(x, y, z, s, MC['cloud' + (color || '')] || (MC['cloud' + (color || '')] = new THREE.MeshStandardMaterial({ color: color || '#FFFFFF', emissive: color || '#FFFFFF', emissiveIntensity: 0.35, roughness: 1, fog: true })), 9, seed); g.scale.y = 0.62; g.traverse(o => { o.castShadow = false; }); return g; }
  const swirlT = {};
  function swirlTex(c1, c2) { const k = c1 + c2; return swirlT[k] || (swirlT[k] = paint(256, 256, (x, w) => { const c = w / 2; x.fillStyle = c2; x.fillRect(0, 0, w, w);
    for (let arm = 0; arm < 3; arm++) { x.beginPath(); for (let i = 0; i <= 120; i++) { const u = i / 120, a = arm * 2.094 + u * 9.5, r = u * c; x.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r); } x.strokeStyle = c1; x.lineWidth = 22; x.lineCap = 'round'; x.stroke(); }
    const g = x.createRadialGradient(c * 0.7, c * 0.6, 0, c, c, c); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); })); }
  function lollipopTree(x, z, h, c1, c2, par) {   /* a giant lollipop: a striped stick and a glossy swirl */
    const g = group(x, 0, z, par), r = 0.9 * h / 3;
    mesh(G.cyl, pm('#FFFFFF', { roughness: 0.3 }), 0, h / 2, 0, 0.09 * h / 3, h, 0.09 * h / 3, g);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r, r * 0.35, 48), [pm(c1, { clearcoat: 1, roughness: 0.2 }), new PM({ map: swirlTex(c1, c2), roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }), new PM({ map: swirlTex(c1, c2), roughness: 0.2, clearcoat: 1 })]);
    top.rotation.x = Math.PI / 2; top.position.y = h + r * 0.9; top.castShadow = true; g.add(top);
    const ph = x * 0.7; anim.push((t, q) => { if (q >= 1) top.rotation.y = Math.sin(t * 0.5 + ph) * 0.15; });
    return g;
  }
  function roundTree(x, z, h, leaf, trunk, seed, par) {
    const g = group(x, 0, z, par); mesh(G.cyl, pm(trunk || '#9A6237', { roughness: 0.7, clearcoat: 0.2 }), 0, h * 0.35, 0, h * 0.07, h * 0.7, h * 0.07, g);
    puff(0, h * 0.82, 0, h * 0.42, pm(leaf, { roughness: 0.55, clearcoat: 0.3 }), 8, seed, g); return g;
  }
  function pine(x, z, h, leaf, snow, par) {
    const g = group(x, 0, z, par); mesh(G.cyl, pm('#8A5530', { roughness: 0.8 }), 0, h * 0.12, 0, h * 0.06, h * 0.25, h * 0.06, g);
    for (let i = 0; i < 3; i++) { const r = h * (0.36 - i * 0.08), y = h * (0.3 + i * 0.22); mesh(G.cone, pm(leaf, { roughness: 0.6, clearcoat: 0.3 }), 0, y + h * 0.15, 0, r, h * 0.38, r, g);
      if (snow) mesh(G.cone, pm('#FFFFFF', { roughness: 0.5, clearcoat: 0.4 }), 0, y + h * 0.27, 0, r * 0.62, h * 0.16, r * 0.62, g); }
    return g;
  }
  function flower(x, z, h, petal, center, n, petalLen, par, seed) {   /* a giant flower on a gently swaying stem */
    const g = group(x, 0, z, par), stemM = pm('#3FB54A', { roughness: 0.5 });
    const head = group(0, h, 0, g);
    mesh(G.cyl, stemM, 0, h / 2, 0, h * 0.025, h, h * 0.025, g);
    [-1, 1].forEach((s, i) => { const lf = mesh(G.ball, pm('#4CC85A', { roughness: 0.45, clearcoat: 0.5 }), s * h * 0.12, h * (0.3 + i * 0.15), 0, h * 0.13, h * 0.035, h * 0.06, g); lf.rotation.z = s * 0.5; });
    const N = n || 10, pl = petalLen || h * 0.2;
    for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, p = mesh(G.ball, pm(petal, { roughness: 0.4, clearcoat: 0.6, sheen: 0.6, sheenColor: new THREE.Color('#FFFFFF') }), Math.cos(a) * pl * 0.95, Math.sin(a) * pl * 0.95, 0, pl * 0.95, pl * 0.42, pl * 0.12, head); p.rotation.z = a; }
    mesh(G.ball, pm(center, { roughness: 0.5, clearcoat: 0.6 }), 0, 0, pl * 0.15, pl * 0.55, pl * 0.55, pl * 0.3, head);
    head.rotation.x = -0.25; const ph = (seed || x) * 1.7;
    anim.push((t, q) => { if (q < 1) return; g.rotation.z = Math.sin(t * 0.6 + ph) * 0.025; head.rotation.y = Math.sin(t * 0.45 + ph) * 0.08; });
    return g;
  }
  function tulip(x, z, h, c, par) {
    const g = group(x, 0, z, par); mesh(G.cyl, pm('#3FB54A'), 0, h / 2, 0, h * 0.025, h, h * 0.025, g);
    const lf = mesh(G.ball, pm('#4CC85A', { clearcoat: 0.5 }), h * 0.06, h * 0.25, 0, h * 0.06, h * 0.28, h * 0.03, g); lf.rotation.z = -0.3;
    const cup = group(0, h, 0, g), m = pm(c, { roughness: 0.35, clearcoat: 0.8, sheen: 0.5, sheenColor: new THREE.Color('#FFFFFF') });
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2, p = mesh(G.ball, m, Math.cos(a) * h * 0.06, h * 0.07, Math.sin(a) * h * 0.06, h * 0.08, h * 0.16, h * 0.05, cup); p.rotation.y = -a; p.rotation.z = Math.cos(a) * 0.18; p.rotation.x = Math.sin(a) * 0.18; }
    const ph = x * 2.1; anim.push((t, q) => { if (q >= 1) g.rotation.z = Math.sin(t * 0.7 + ph) * 0.03; });
    return g;
  }
  function mushroom(x, z, s, cap, par) {   /* (Esti's reviewer: red toadstools look like poisonous mushrooms) a small round flowering bush instead */
    void cap; return bush(x, z, 0.5 * s, '#5DBB4A', true, Math.round(Math.abs(x * 37 + z * 11)), par);
  }
  function bush(x, z, r, c, flowers, seed, par) { const g = puff(x, r * 0.55, z, r, pm(c, { roughness: 0.6, clearcoat: 0.2 }), 7, seed, par);
    if (flowers) { const R = rng(seed || 1); for (let i = 0; i < 9; i++) { const a = R() * 6.28, h = R(); mesh(G.ball, pm(flowers[i % flowers.length], { clearcoat: 0.6 }), Math.cos(a) * r * 0.85, (h - 0.2) * r * 0.6, Math.sin(a) * r * 0.55 + r * 0.25, r * 0.12, r * 0.12, r * 0.12, g); } }
    return g; }
  function house(x, z, w, h, wall, roof, par, rot) {
    const g = group(x, 0, z, par); g.rotation.y = rot || 0;
    mesh(G.box, pm(wall, { roughness: 0.5 }), 0, h / 2, 0, w, h, w * 0.85, g);
    const r = mesh(new THREE.ConeGeometry(w * 0.78, h * 0.7, 4), pm(roof, { clearcoat: 1, roughness: 0.3 }), 0, h + h * 0.35, 0, 1, 1, 1, g); r.rotation.y = Math.PI / 4;
    mesh(G.box, pm('#8A5530', { roughness: 0.5 }), 0, h * 0.28, w * 0.43, w * 0.22, h * 0.56, 0.05, g);
    [-1, 1].forEach(s => { mesh(G.box, glow('#FFE7A0', 0.55), s * w * 0.28, h * 0.62, w * 0.43, w * 0.2, w * 0.2, 0.04, g); mesh(G.box, pm('#FFFFFF'), s * w * 0.28, h * 0.62, w * 0.425, w * 0.26, w * 0.26, 0.03, g); });
    return g;
  }
  function balloon(x, y, z, c, s, par) {
    const g = group(x, y, z, par), b = mesh(G.ball, pm(c, { roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 }), 0, 0, 0, s * 0.8, s, s * 0.8, g);
    mesh(G.cone, pm(c), 0, -s * 1.02, 0, s * 0.12, s * 0.15, s * 0.12, g).rotation.x = Math.PI;
    const str = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, s * 3, 4), std('#FFFFFF')); str.position.y = -s * 2.5; g.add(str);
    const ph = x * 1.3 + y; anim.push((t, q) => { if (q < 1) return; g.position.y = y + Math.sin(t * 0.8 + ph) * 0.18; g.rotation.z = Math.sin(t * 0.6 + ph) * 0.06; });
    void b; return g;
  }
  function bunting(a, b, sag, colors, n, par) {   /* a string of little triangle flags (no writing) */
    const g = group(0, 0, 0, par), pts = [], N = n || 14;
    for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push(new THREE.Vector3(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag, a[2] + (b[2] - a[2]) * u)); }
    const curve = new THREE.CatmullRomCurve3(pts); g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.025, 6), std('#FFFFFF')));
    const tri = new THREE.Shape(); tri.moveTo(-0.28, 0); tri.lineTo(0.28, 0); tri.lineTo(0, -0.55); tri.closePath(); const tg = new THREE.ShapeGeometry(tri);
    for (let i = 0; i < N; i++) { const p = curve.getPoint((i + 0.5) / N), f = new THREE.Mesh(tg, std(colors[i % colors.length], { side: THREE.DoubleSide, roughness: 0.7 })); f.position.copy(p); g.add(f);
      const ph = i * 0.7; anim.push((t, q) => { if (q >= 1) f.rotation.x = Math.sin(t * 1.3 + ph) * 0.18; }); }
    return g;
  }
  function hill(x, z, r, h, tex, color, par) { const m = mesh(new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color, map: tex || null, roughness: 0.9 }), x, 0, z, r, h, r * 0.8, par); m.castShadow = false; return m; }
  function rainbow(x, y, z, r, par) {
    const g = group(x, y, z, par), cols = ['#FF4E50', '#FF9A2E', '#FFD93B', '#4CD964', '#3AA8FF', '#9B6BFF'];
    cols.forEach((c, i) => { const t = new THREE.Mesh(new THREE.TorusGeometry(r - i * r * 0.07, r * 0.036, 12, 96, Math.PI), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.55, roughness: 0.6, transparent: true, opacity: 0.88 })); g.add(t); });
    return g;
  }
  /* things that float: dust in sunbeams, petals, bubbles, snow, twinkles */
  function motes(o) {
    if (FAST) return null;   /* the automatic test (?fast=1) gets a light world: it must stay quick on a test machine */
    const N = o.n || 140, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = [], R = rng(o.seed || 11), c = new THREE.Color();
    for (let i = 0; i < N; i++) { seed.push([R(), R(), R(), R() * 6.28]); c.set(o.colors ? o.colors[i % o.colors.length] : '#FFFFFF'); col.set([c.r, c.g, c.b], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ map: o.tex || soft, vertexColors: true, size: o.size || 0.1, transparent: true, opacity: o.opacity || 0.9, blending: o.add === false ? THREE.NormalBlending : THREE.AdditiveBlending, depthWrite: false, fog: false }));
    p.frustumCulled = false; p.renderOrder = 3; scene.add(p);
    const [x0, x1, y0, y1, z0, z1] = o.box || [-12, 12, 0.2, 8, -12, 6], kind = o.kind || 'drift';
    const place = t => { for (let i = 0; i < N; i++) { const [u, v, w, ph] = seed[i]; let x = x0 + u * (x1 - x0), y, z = z0 + w * (z1 - z0);
        if (kind === 'fall') { y = y1 - ((v + t * (o.speed || 0.03) * (0.6 + w * 0.8)) % 1) * (y1 - y0); x += Math.sin(t * 0.7 + ph) * 0.5; z += Math.cos(t * 0.5 + ph) * 0.3; }
        else if (kind === 'rise') { y = y0 + ((v + t * (o.speed || 0.05) * (0.6 + w * 0.8)) % 1) * (y1 - y0); x += Math.sin(t * 1.2 + ph * 3) * 0.15; }
        else { y = y0 + v * (y1 - y0) + Math.sin(t * 0.4 + ph * 2) * 0.35; x += Math.sin(t * 0.25 + ph) * 0.6; z += Math.cos(t * 0.2 + ph) * 0.4; }
        pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; }
      g.attributes.position.needsUpdate = true; };
    place(0); anim.push((t, q) => { p.visible = q >= 1; if (q >= 1) { place(t); if (kind === 'twinkle') p.material.opacity = (o.opacity || 0.9) * (0.75 + 0.25 * Math.sin(t * 2.3)); } });
    return p;
  }
  /* butterflies: two wings that flap, on a lazy loop */
  function butterflies(n, colors, area) {
    if (FAST) return;
    const wingS = new THREE.Shape(); wingS.moveTo(0, 0); wingS.bezierCurveTo(0.1, 0.35, 0.5, 0.42, 0.42, 0.08); wingS.bezierCurveTo(0.5, -0.15, 0.2, -0.32, 0, 0);
    const wg = new THREE.ShapeGeometry(wingS, 16);
    for (let i = 0; i < n; i++) { const g = group(), m = std(colors[i % colors.length], { side: THREE.DoubleSide, roughness: 0.5, emissive: colors[i % colors.length], emissiveIntensity: 0.15 });
      const l = new THREE.Mesh(wg, m), r = new THREE.Mesh(wg, m); r.scale.x = -1; g.add(l, r); mesh(G.ballLo, std('#3A2A3A'), 0, 0, 0, 0.03, 0.03, 0.14, g).rotation.x = Math.PI / 2;
      g.scale.setScalar(0.9); const [cx, cy, cz, rr] = area[i % area.length], ph = i * 2.3;
      anim.push((t, q) => { if (q < 1) return; const a = t * 0.35 + ph; g.position.set(cx + Math.cos(a) * rr, cy + Math.sin(t * 0.9 + ph) * 0.4, cz + Math.sin(a) * rr * 0.6); g.rotation.y = -a; const f = Math.sin(t * 14 + ph); l.rotation.y = f * 1.0; r.rotation.y = -f * 1.0; }); }
  }
  /* small sharp things scattered just outside the stage (grass tufts, little flowers, toys) */
  function scatter(n, rMin, rMax, seed, make) {
    if (CALM && !FAST) return;   /* calm (Esti 2026-11-27): no little blocks, balls, cupcakes or gifts scattered round the stage; they pulled the eye from the game */
    if (FAST) make = (x, z, R, i) => { if (i % 4 === 0) mesh(G.box, pm(TOY[i % TOY.length]), x, 0.22, z, 0.44, 0.44, 0.44); };   /* the test: a few plain toy blocks instead */
    const R = rng(seed || 17);
    for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, r = rMin + R() * (rMax - rMin), x = Math.cos(a) * r, z = Math.sin(a) * r * 0.9 - 0.6;
      if (z > 2 && Math.abs(x) < 7.5) continue;   /* keep the front clear (the toy box, Mendy) */
      make(x, z, R, i); }
  }
  function tuft(x, z, s, c, par) { const g = group(x, 0, z, par), m = pm(c, { roughness: 0.5, clearcoat: 0.3 }); for (let i = 0; i < 5; i++) { const b = mesh(G.cone, m, (i - 2) * 0.06 * s, 0.22 * s, ((i * 7) % 3 - 1) * 0.05 * s, 0.05 * s, 0.45 * s * (0.7 + (i % 3) * 0.2), 0.05 * s, g); b.rotation.z = (i - 2) * 0.22; } return g; }
  function bloomFlower(x, z, s, petal, par) { const g = group(x, 0, z, par); mesh(G.cyl, pm('#3FB54A'), 0, 0.2 * s, 0, 0.025 * s, 0.4 * s, 0.025 * s, g);
    for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; mesh(G.ball, pm(petal, { clearcoat: 0.8, roughness: 0.3 }), Math.cos(a) * 0.09 * s, 0.42 * s, Math.sin(a) * 0.09 * s, 0.08 * s, 0.035 * s, 0.08 * s, g); }
    mesh(G.ball, pm('#FFD23F', { clearcoat: 0.8 }), 0, 0.44 * s, 0, 0.055 * s, 0.04 * s, 0.055 * s, g); return g; }
  /* painted textures */
  function grassTex(base, dark, light, flowers, seed) {
    const R = rng(seed || 5);
    return paint(1024, 1024, (x, w) => { x.fillStyle = base; x.fillRect(0, 0, w, w);
      for (let i = 0; i < 40; i++) { x.fillStyle = R() < 0.5 ? light : dark; x.globalAlpha = 0.12; x.beginPath(); x.arc(R() * w, R() * w, 40 + R() * 110, 0, 7); x.fill(); }
      x.globalAlpha = 1; x.lineCap = 'round';
      for (let i = 0; i < 9000; i++) { const px = R() * w, py = R() * w, l = 5 + R() * 9; x.strokeStyle = R() < 0.55 ? dark : light; x.globalAlpha = 0.35 + R() * 0.35; x.lineWidth = 1.5 + R() * 1.5; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (R() - 0.5) * 4, py - l); x.stroke(); }
      x.globalAlpha = 1;
      if (flowers) for (let i = 0; i < 160; i++) { const px = R() * w, py = R() * w, c = flowers[i % flowers.length]; x.fillStyle = c; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28; x.beginPath(); x.arc(px + Math.cos(a) * 4, py + Math.sin(a) * 4, 3.4, 0, 7); x.fill(); } x.fillStyle = '#FFE14D'; x.beginPath(); x.arc(px, py, 2.4, 0, 7); x.fill(); }
    }, { repeat: [16, 16] });
  }
  function speckTex(base, specks, n, rMax, seed, rep) {
    const R = rng(seed || 9);
    return paint(512, 512, (x, w) => { x.fillStyle = base; x.fillRect(0, 0, w, w); for (let i = 0; i < n; i++) { x.fillStyle = specks[i % specks.length]; x.globalAlpha = 0.25 + R() * 0.5; x.beginPath(); x.arc(R() * w, R() * w, 0.6 + R() * rMax, 0, 7); x.fill(); } x.globalAlpha = 1; }, { repeat: rep || [24, 24] });
  }
  /* a stage drawn as a cream centre with happy rings at the edge */
  const ringStage = (rings, center, extra) => (x, c, w) => {
    rings.forEach(([r, col]) => { x.fillStyle = col; x.beginPath(); x.arc(c, c, r * c, 0, Math.PI * 2); x.fill(); });
    const lastR = rings[rings.length - 1][0], g = x.createRadialGradient(c, c, 0, c, c, c * lastR); g.addColorStop(0, center[0]); g.addColorStop(1, center[1]); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * lastR, 0, Math.PI * 2); x.fill();
    const R = rng(4); for (let i = 0; i < 20000; i++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * c; x.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.3)' : 'rgba(160,110,70,.05)'; x.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 2, 2); }
    if (extra) extra(x, c, w);
  };

  function playroom() {
    const R = rng(7);
    /* floor: warm honey wood planks, polished */
    const plank = paint(1024, 1024, (x, w, h) => {
      const rows = 8, ph = h / rows;
      for (let r = 0; r < rows; r++) {
        let xs = -R() * 400;
        while (xs < w) {
          const len = 380 + R() * 300, base = [220 + R() * 14, 184 + R() * 14, 136 + R() * 14];
          x.fillStyle = `rgb(${base[0] | 0},${base[1] | 0},${base[2] | 0})`; x.fillRect(xs, r * ph, len, ph);
          for (let g = 0; g < 14; g++) {   /* the grain */
            x.strokeStyle = `rgba(${150 + R() * 40 | 0},${95 + R() * 30 | 0},${55 + R() * 20 | 0},${0.08 + R() * 0.12})`; x.lineWidth = 1 + R() * 2;
            const y0 = r * ph + R() * ph; x.beginPath(); x.moveTo(xs, y0);
            for (let s = 0; s <= 8; s++) x.lineTo(xs + len * s / 8, y0 + Math.sin(s * 0.9 + g) * (2 + R() * 3)); x.stroke();
          }
          const sh = x.createLinearGradient(0, r * ph, 0, r * ph + ph); sh.addColorStop(0, 'rgba(255,255,255,.10)'); sh.addColorStop(1, 'rgba(120,70,30,.10)'); x.fillStyle = sh; x.fillRect(xs, r * ph, len, ph);
          x.fillStyle = 'rgba(110,62,28,.55)'; x.fillRect(xs, r * ph, 3, ph);
          xs += len;
        }
        x.fillStyle = 'rgba(110,62,28,.6)'; x.fillRect(0, r * ph, w, 3);
      }
    }, { repeat: [6, 4.6] });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(64, 40), phys('#FFFFFF', { map: plank, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.35 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 11.5); floor.receiveShadow = true; scene.add(floor);   /* ends at the wall (z = -8.5) */

    /* the rug: soft and fluffy, a big cream middle with happy rings at the edge */
    const rugT = paint(1024, 1024, (x, w) => {
      const c = w / 2, rings = [[1.0, '#FFFFFF'], [0.965, '#FF8C7A'], [0.905, '#FFFFFF'], [0.885, '#FFD15C'], [0.83, '#FFFFFF'], [0.81, '#7FD9C0'], [0.755, '#FFF7EA']];
      rings.forEach(([r, col]) => { x.fillStyle = col; x.beginPath(); x.arc(c, c, r * c, 0, Math.PI * 2); x.fill(); });
      const g = x.createRadialGradient(c, c, 0, c, c, c * 0.75); g.addColorStop(0, '#FFFBF3'); g.addColorStop(1, '#FFF2DE'); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * 0.755, 0, Math.PI * 2); x.fill();
      for (let i = 0; i < 26000; i++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * c; x.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.35)' : 'rgba(200,150,110,.06)'; x.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 2, 2); }
      x.strokeStyle = 'rgba(255,190,120,.25)'; x.lineWidth = 3; x.setLineDash([10, 12]); x.beginPath(); x.arc(c, c, c * 0.7, 0, Math.PI * 2); x.stroke();
    });
    const rugM = new PM({ color: '#FFFFFF', map: rugT, roughness: 1, sheen: 1, sheenColor: new THREE.Color('#FFF4E0'), sheenRoughness: 0.8 });
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 6.7, 0.1, 128), [std('#F4E6D2', { roughness: 1 }), rugM, rugM]);
    rug.position.y = 0.05; rug.receiveShadow = true; scene.add(rug);

    /* a pool of window sunlight on the floor */
    const poolT = paint(256, 256, (x) => { x.filter = 'blur(10px)'; x.fillStyle = 'rgba(255,236,180,1)'; x.fillRect(40, 40, 82, 80); x.fillRect(134, 40, 82, 80); x.fillRect(40, 132, 82, 84); x.fillRect(134, 132, 82, 84); }, { srgb: false });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 4.2), new THREE.MeshBasicMaterial({ map: poolT, color: '#FFD98A', transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2; pool.rotation.z = 0.35; pool.position.set(-2.4, 0.11, -3.4); scene.add(pool);
    anim.push(t => { pool.material.opacity = 0.32 + Math.sin(t * 0.4) * 0.06; });

    /* ---- the far wall and everything on it (blurred) ---- */
    const far = new THREE.Group(); scene.add(far);
    const paper = paint(512, 512, (x, w) => {
      x.fillStyle = '#FFEFD2'; x.fillRect(0, 0, w, w);
      for (let i = 0; i < 9; i++) { x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(i * 57, 0, 26, w); }
      const cols = ['#FFB3A7', '#9FDCF5', '#FFD66E', '#A8E6C4', '#D2B8FF'];
      for (let i = 0; i < 18; i++) { const px = (i % 6) * 85 + (Math.floor(i / 6) % 2) * 42 + 20, py = Math.floor(i / 6) * 170 + 60; x.fillStyle = cols[i % 5];
        x.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 6 : 14, a = -Math.PI / 2 + k * Math.PI / 5; x.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r); } x.closePath(); x.globalAlpha = 0.55; x.fill(); x.globalAlpha = 1; }
    }, { repeat: [12, 3] });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(64, 16), std('#FFFFFF', { map: paper, roughness: 0.95 })); wall.position.set(0, 8, -8.6); wall.receiveShadow = true; far.add(wall);
    const wains = new THREE.Mesh(new THREE.PlaneGeometry(64, 2.3), std('#BFEADB', { roughness: 0.8 })); wains.position.set(0, 1.15, -8.55); far.add(wains);
    for (let i = -16; i <= 16; i++) { const pnl = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.5, 0.06, 2, 0.03), std('#CFF2E6', { roughness: 0.7 })); pnl.position.set(i * 2, 1.15, -8.5); far.add(pnl); }
    const rail = new THREE.Mesh(new RoundedBoxGeometry(64, 0.16, 0.16, 2, 0.05), std('#FFFFFF', { roughness: 0.4 })); rail.position.set(0, 2.32, -8.48); far.add(rail);
    const base = new THREE.Mesh(new RoundedBoxGeometry(64, 0.36, 0.18, 2, 0.05), std('#FFFFFF', { roughness: 0.4 })); base.position.set(0, 0.18, -8.46); far.add(base);

    /* the window: a sunny garden outside */
    const view = paint(1024, 800, (x, w, h) => {
      const sky = x.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#5DB8FF'); sky.addColorStop(0.65, '#BFE6FF'); sky.addColorStop(1, '#E6F6FF'); x.fillStyle = sky; x.fillRect(0, 0, w, h);
      const sg = x.createRadialGradient(220, 150, 10, 220, 150, 360); sg.addColorStop(0, 'rgba(255,255,230,1)'); sg.addColorStop(0.2, 'rgba(255,250,210,.8)'); sg.addColorStop(1, 'rgba(255,250,210,0)'); x.fillStyle = sg; x.fillRect(0, 0, w, h);
      x.filter = 'blur(6px)'; x.fillStyle = 'rgba(255,255,255,.95)';
      [[560, 140, 1.2], [820, 230, 0.9], [330, 300, 0.7]].forEach(([cx, cy, s]) => { [[0, 0, 60], [55, 10, 48], [-55, 12, 45], [25, -30, 46], [-20, -24, 40]].forEach(([dx, dy, r]) => { x.beginPath(); x.arc(cx + dx * s, cy + dy * s, r * s, 0, 7); x.fill(); }); });
      x.filter = 'blur(4px)';
      x.fillStyle = '#9EDB86'; x.beginPath(); x.moveTo(0, 560); x.quadraticCurveTo(300, 440, 600, 540); x.quadraticCurveTo(820, 600, 1024, 500); x.lineTo(1024, 800); x.lineTo(0, 800); x.fill();
      x.fillStyle = '#6FC56B'; x.beginPath(); x.moveTo(0, 650); x.quadraticCurveTo(400, 560, 1024, 640); x.lineTo(1024, 800); x.lineTo(0, 800); x.fill();
      [[120, 520, 80], [260, 500, 60], [780, 520, 90], [920, 540, 70]].forEach(([tx, ty, r]) => { x.fillStyle = '#8B5A33'; x.fillRect(tx - 9, ty, 18, 90); x.fillStyle = '#3FA75A'; x.beginPath(); x.arc(tx, ty - r * 0.3, r, 0, 7); x.fill(); x.fillStyle = 'rgba(160,230,120,.6)'; x.beginPath(); x.arc(tx - r * 0.3, ty - r * 0.6, r * 0.45, 0, 7); x.fill(); });
      x.filter = 'none'; const fl = ['#FF6B8B', '#FFD23F', '#FFFFFF', '#FF8A3D', '#B98CFF'];
      for (let i = 0; i < 70; i++) { x.fillStyle = fl[i % 5]; x.beginPath(); x.arc(R() * w, 680 + R() * 110, 5 + R() * 5, 0, 7); x.fill(); }
    });
    const WX = -4.6, WY = 4.9, WW = 4.6, WH = 3.8;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(WW, WH), new THREE.MeshBasicMaterial({ map: view })); glass.position.set(WX, WY, -8.52); far.add(glass);
    const frameM = std('#FFFFFF', { roughness: 0.35 });
    const fr = (w, h, x, y) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.22, 2, 0.06), frameM); m.position.set(x, y, -8.42); m.castShadow = true; far.add(m); };
    fr(WW + 0.4, 0.26, WX, WY + WH / 2 + 0.05); fr(WW + 0.4, 0.26, WX, WY - WH / 2 - 0.05); fr(0.26, WH + 0.3, WX - WW / 2 - 0.05, WY); fr(0.26, WH + 0.3, WX + WW / 2 + 0.05, WY);
    fr(0.12, WH, WX, WY); fr(WW, 0.12, WX, WY);
    const sill = new THREE.Mesh(new RoundedBoxGeometry(WW + 1.0, 0.18, 0.6, 2, 0.06), frameM); sill.position.set(WX, WY - WH / 2 - 0.2, -8.25); far.add(sill);
    /* a plant on the sill */
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.24, 0.5, 24), phys('#E8794A', { roughness: 0.5 })); pot.position.set(WX + 1.5, WY - WH / 2 + 0.14, -8.2); far.add(pot);
    const leafM = phys('#3DBE5C', { roughness: 0.4 });
    for (let i = 0; i < 9; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), leafM); lf.scale.set(0.6, 1.3, 0.35); const a = i / 9 * Math.PI * 2; lf.position.set(pot.position.x + Math.cos(a) * 0.22, pot.position.y + 0.55 + (i % 3) * 0.12, -8.2 + Math.sin(a) * 0.15); lf.rotation.z = Math.cos(a) * -0.6; far.add(lf); }
    /* curtains that gently sway */
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, WW + 3.4, 16), phys('#E8B84A', { metalness: 0.6, roughness: 0.3 })); rod.rotation.z = Math.PI / 2; rod.position.set(WX, WY + WH / 2 + 0.55, -8.15); far.add(rod);
    [-1, 1].forEach(s => { const f = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), rod.material); f.position.set(WX + s * (WW / 2 + 1.75), rod.position.y, -8.15); far.add(f); });
    const curtM = new PM({ color: '#FF9C86', roughness: 0.85, sheen: 1, sheenColor: new THREE.Color('#FFE0D0'), sheenRoughness: 0.5, side: THREE.DoubleSide });
    [-1, 1].forEach(s => {
      const cw = 1.6, ch = WH + 1.6, geo = new THREE.PlaneGeometry(cw, ch, 22, 18), pos = geo.attributes.position, rest = pos.array.slice();
      const cu = new THREE.Mesh(geo, curtM); cu.position.set(WX + s * (WW / 2 + 0.75), rod.position.y - ch / 2, -8.05); cu.castShadow = true; far.add(cu);
      const ph = s > 0 ? 1.3 : 0;
      const move = t => { for (let i = 0; i < pos.count; i++) { const x0 = rest[i * 3], y0 = rest[i * 3 + 1], down = (ch / 2 - y0) / ch;
          pos.array[i * 3 + 2] = Math.sin(x0 * 9 + 0.5) * 0.09 + Math.sin(t * 0.9 + ph + y0 * 0.8) * 0.12 * down * down + Math.sin(t * 1.7 + x0 * 3 + ph) * 0.03 * down;
          pos.array[i * 3] = x0 + Math.sin(t * 0.7 + ph) * 0.06 * down * down; }
        pos.needsUpdate = true; geo.computeVertexNormals(); };
      move(0); anim.push((t, q) => { if (q >= 1) move(t); });
      const tie = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 8, 24), phys('#FFD15C')); tie.position.set(cu.position.x + s * 0.12, WY - 0.6, -7.95); tie.scale.set(1, 0.5, 1); far.add(tie);
    });

    /* a bookcase: sefarim and toys */
    const woodM = phys('#C98A4E', { roughness: 0.45, clearcoat: 0.4 });
    const BCX = 5.6;
    const box = (w, h, d, x, y, z, m) => { const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.05), m || woodM); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; far.add(b); return b; };
    box(4.6, 0.2, 1.0, BCX, 0.25, -7.9); box(4.6, 0.2, 1.0, BCX, 2.1, -7.9); box(4.6, 0.2, 1.0, BCX, 3.9, -7.9); box(4.6, 0.2, 1.0, BCX, 5.6, -7.9);
    box(0.2, 5.6, 1.0, BCX - 2.3, 2.9, -7.9); box(0.2, 5.6, 1.0, BCX + 2.3, 2.9, -7.9); box(4.6, 5.6, 0.1, BCX, 2.9, -8.38, phys('#B37440', { roughness: 0.6 }));
    const spines = ['#8E2234', '#22407A', '#2F6B44', '#6A2F80', '#9A5E1F', '#22407A', '#8E2234', '#2F6B44', '#6A2F80'], goldM = phys('#F2C94C', { metalness: 0.7, roughness: 0.25 });
    let bx = BCX - 2.1; spines.forEach((c, i) => { const h = 1.25 + ((i * 7) % 4) * 0.08, w = 0.3 + (i % 3) * 0.05;
      const bk = box(w, h, 0.75, bx + w / 2, 2.2 + h / 2, -7.9, phys(c, { roughness: 0.45 })); const gd = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.06, 0.02), goldM); gd.position.set(bk.position.x, 2.2 + h * 0.72, -7.5); far.add(gd);
      const gd2 = gd.clone(); gd2.position.y = 2.2 + h * 0.3; far.add(gd2); bx += w + 0.03; });
    /* toys on the shelves: a stacking-rings toy, a ball, blocks, a little train */
    const ringC = ['#FF3B30', '#FF8A1F', '#FFC21A', '#1DC77A', '#2F80FF'];
    ringC.forEach((c, i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.42 - i * 0.06, 0.12, 14, 28), phys(c, { clearcoat: 1 })); r.rotation.x = Math.PI / 2; r.position.set(BCX - 1.3, 0.47 + i * 0.22, -7.8); r.castShadow = true; far.add(r); });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3, 12), woodM); pole.position.set(BCX - 1.3, 0.95, -7.8); far.add(pole);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), phys('#2F80FF', { clearcoat: 1 })); ball.position.set(BCX + 0.2, 0.77, -7.8); far.add(ball);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 10, 40), phys('#FFFFFF')); stripe.position.copy(ball.position); stripe.rotation.y = 0.6; far.add(stripe);
    [['#FFC21A', 0], ['#1DC77A', 1], ['#FF4FA0', 2]].forEach(([c, i]) => box(0.5, 0.5, 0.5, BCX + 1.3 + (i === 2 ? 0.27 : i * 0.55), 0.6 + (i === 2 ? 0.5 : 0), -7.8, phys(c, { clearcoat: 1 })));
    box(1.0, 0.5, 0.6, BCX + 1.0, 4.25, -7.8, phys('#FF3B30', { clearcoat: 1 })); box(0.5, 0.45, 0.6, BCX + 0.25, 4.6, -7.8, phys('#FF3B30', { clearcoat: 1 }));
    [BCX + 0.55, BCX + 1.3].forEach(x => { const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.66, 20), phys('#333A55')); wh.rotation.x = Math.PI / 2; wh.position.set(x, 4.08, -7.8); far.add(wh); });
    box(0.9, 0.5, 0.6, BCX - 1.0, 4.25, -7.8, phys('#2F80FF', { clearcoat: 1 }));
    /* a painted picture of a rainbow and sun */
    const pic = paint(512, 400, (x, w, h) => { x.fillStyle = '#E9F7FF'; x.fillRect(0, 0, w, h); const c = ['#FF5A4E', '#FF9F1C', '#FFD23F', '#3CCB7F', '#3A8DFF', '#9B6BFF'];
      c.forEach((col, i) => { x.strokeStyle = col; x.lineWidth = 20; x.beginPath(); x.arc(w / 2, h * 0.95, 200 - i * 20, Math.PI, 0); x.stroke(); });
      x.fillStyle = '#FFD23F'; x.beginPath(); x.arc(90, 80, 44, 0, 7); x.fill(); x.fillStyle = '#FFFFFF'; [[380, 80], [420, 90], [350, 95]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 30, 0, 7); x.fill(); });
      x.fillStyle = '#7ED36E'; x.fillRect(0, h - 40, w, 40); });
    const pf = new THREE.Mesh(new RoundedBoxGeometry(2.7, 2.2, 0.14, 2, 0.05), phys('#FFC14D', { roughness: 0.35 })); pf.position.set(0.9, 5.4, -8.48); far.add(pf);
    const pp = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.8), std('#FFFFFF', { map: pic, roughness: 0.8 })); pp.position.set(0.9, 5.4, -8.4); far.add(pp);
    /* a garland of soft felt balls along the top of the wall */
    const felt = TOY.map(c => std(c, { roughness: 1 }));
    const gN = 34;
    for (let i = 0; i < gN; i++) { const u = i / (gN - 1), x = -12 + u * 24, y = 8.2 - Math.sin(u * Math.PI * 3) ** 2 * 0.9;
      const fb = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), felt[i % felt.length]); fb.position.set(x, y, -8.3); far.add(fb); }
    /* a low toy bench and a big soft pouf off to the side */
    const pouf = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new PM({ color: '#FFB547', roughness: 0.9, sheen: 1, sheenColor: new THREE.Color('#FFE3A8') }));
    pouf.scale.set(1.1, 0.55, 1.1); pouf.position.set(-8.6, 0.5, -5.8); pouf.castShadow = true; pouf.receiveShadow = true; far.add(pouf);
    farify(far);

    /* sunbeams from the window (soft light you can almost touch) */
    const beamT = paint(64, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const e = x.createLinearGradient(0, 0, w, 0); e.addColorStop(0, 'rgba(0,0,0,1)'); e.addColorStop(0.3, 'rgba(0,0,0,0)'); e.addColorStop(0.7, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = e; x.fillRect(0, 0, w, h); }, { srgb: false });
    const beams = [];
    [[-5.8, 1.1, 0.16], [-4.6, 1.5, 0.2], [-3.4, 1.0, 0.14]].forEach(([x0, wd, op], i) => {
      const g = new THREE.BufferGeometry(), top = [x0, WY + 1.2, -8.3], bot = [x0 + 3.4, 0.12, -2.6 + i * 0.4];
      g.setAttribute('position', new THREE.Float32BufferAttribute([top[0] - wd / 2, top[1], top[2], top[0] + wd / 2, top[1], top[2], bot[0] - wd, bot[1], bot[2], bot[0] + wd, bot[1], bot[2]], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 0, 0, 1, 0], 2)); g.setIndex([0, 2, 1, 1, 2, 3]);
      const b = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: beamT, color: '#FFE7B0', transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
      b.userData.op = op; b.renderOrder = 2; scene.add(b); beams.push(b);
    });
    anim.push(t => beams.forEach((b, i) => { b.material.opacity = b.userData.op * (0.75 + 0.25 * Math.sin(t * 0.5 + i * 1.7)); }));

    /* floating dust in the sunlight */
    const DN = 160, dpos = new Float32Array(DN * 3), dseed = [];
    for (let i = 0; i < DN; i++) { const u = R(); dseed.push([u, R(), R(), R() * 6.28]); }
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
    const dust = new THREE.Points(dg, new THREE.PointsMaterial({ map: soft, color: '#FFF1C8', size: 0.09, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    dust.frustumCulled = false; scene.add(dust); L.dust = dust;
    const placeDust = t => { for (let i = 0; i < DN; i++) { const [u, v, w, p] = dseed[i], k = (u + t * 0.012 * (0.5 + v)) % 1;
        dpos[i * 3] = -6.2 + k * 4.2 + w * 1.6 + Math.sin(t * 0.3 + p) * 0.3; dpos[i * 3 + 1] = 6.0 - k * 5.6 + Math.sin(t * 0.5 + p * 2) * 0.25; dpos[i * 3 + 2] = -8.0 + k * 5.4 + (v - 0.5) * 1.6; }
      dg.attributes.position.needsUpdate = true; };
    placeDust(0); anim.push((t, q) => { dust.visible = q >= 1; if (q >= 1) placeDust(t); });
  }

  /* ================= the worlds (one per unit) =================
     Every world: a sky, ground that is sharp near the toys and soft far away, a round stage in the middle,
     a frame of things on the left and right (seen in every view), low things at the back (seen from above),
     tall things far away (seen in the close-ups), gentle movement and something floating in the air. */

  /* Unit 1: Toy Land - candy-coloured hills, lollipop trees, a castle of giant blocks, a rainbow, balloons */
  function toyland() {
    setEnv({ bg: '#BFE6FF', fog: ['#D9F0FF', 34, 120], sun: ['#FFF1D6', 2.6, [-6, 13, 8]], hemi: ['#CFE8FF', '#7FCB6A', 0.6], rim: ['#FFD2A0', 1.1], front: ['#FFE9D2', 0.35],
      exposure: 0.84, box: ['#FF5A7A', '#FFFFFF', '#E8456A'], css: '#BFE6FF' });
    skyDome('#3E9BFF', '#8FCBFF', '#E6F6FF', [-0.5, 0.4, -1]);
    ground(grassTex('#5ECF4F', '#36A83F', '#9BEA6E', ['#FFFFFF', '#FF6FA3', '#FFD23F', '#A77BFF', '#FF8A3D'], 5), '#FFFFFF', { sheen: 0.5, sheenColor: '#D8FFB0' });
    const near = group();
    scatter(70, 7.1, 11.5, 31, (x, z, R, i) => { const k = i % 7; if (k < 3) tuft(x, z, 0.8 + R() * 0.6, ['#3FBF4A', '#58D35A', '#2EA845'][k], near);
      else if (k < 6) bloomFlower(x, z, 0.9 + R() * 0.7, ['#FF6FA3', '#FFFFFF', '#FFC93C', '#A77BFF', '#FF8A3D'][i % 5], near);
      else { const b = mesh(G.box, pm(['#FF5A5A', '#3AA8FF', '#FFC93C', '#4CD964'][i % 4], { clearcoat: 1, roughness: 0.2 }), x, 0.22, z, 0.44, 0.44, 0.44, near); b.rotation.y = R() * 3; } });
    stage(ringStage([[1.0, '#FFFFFF'], [0.965, '#FF8FB1'], [0.915, '#FFFFFF'], [0.895, '#FFD84D'], [0.845, '#FFFFFF'], [0.825, '#7FDCC6'], [0.77, '#FFF8EE']], ['#FFFDF8', '#FFF1E0'],
      (x, c) => { x.strokeStyle = 'rgba(255,170,190,.35)'; x.lineWidth = 4; x.setLineDash([14, 14]); x.beginPath(); x.arc(c, c, c * 0.72, 0, 7); x.stroke(); }), { edge: '#FFD4DF' });
    /* left and right: lollipop trees, candy bushes, block towers */
    const far = group();
    [[-10.5, -3, 4.2, '#FF6FA3', '#FFFFFF'], [-13.5, -8, 5.2, '#FFC93C', '#FF6FA3'], [-9, -11, 3.6, '#7ED6FF', '#FFFFFF'], [10.8, -2.5, 4.4, '#B98CFF', '#FFFFFF'], [13.8, -8.5, 5.4, '#FF8A3D', '#FFE37A'], [9.4, -11.5, 3.4, '#5BE0A8', '#FFFFFF'],
     [-16, 1, 4.8, '#FF5A5A', '#FFFFFF'], [16.5, 1.5, 4.6, '#3AA8FF', '#FFFFFF']]
      .forEach(([x, z, h, a, b]) => lollipopTree(x, z, h, a, b, far));
    [[-8.4, -8.6, 1.2, '#7ED957', ['#FF8FB1', '#FFFFFF']], [8.6, -8.8, 1.3, '#6CD3A0', ['#FFD84D', '#FFFFFF']], [-11.6, 3.5, 1.4, '#7ED957', ['#FF6FA3', '#FFD84D']], [11.8, 4.2, 1.3, '#6CD3A0', ['#B98CFF', '#FFFFFF']],
     [-4, -11, 1.0, '#8EE07A', ['#FFFFFF', '#FF8FB1']], [3.6, -11.4, 1.1, '#7ED957', ['#FFD84D', '#7ED6FF']], [0, -12.6, 1.2, '#6CD3A0', ['#FF8FB1']]]
      .forEach(([x, z, r, c, f], i) => bush(x, z, r, c, f, 20 + i, far));
    /* the castle of giant toy blocks, back left */
    const castle = group(-7.5, 0, -16, far), BC = ['#FF5A5A', '#3AA8FF', '#FFC93C', '#4CD964', '#B98CFF', '#FF8A3D'];
    let n = 0; for (let tx = 0; tx < 3; tx++) for (let ty = 0; ty < 3 + (tx === 1 ? 2 : 0); ty++) { const s = 1.6; mesh(G.box, pm(BC[n++ % 6], { clearcoat: 1, roughness: 0.25 }), (tx - 1) * s * 1.05, s / 2 + ty * s * 1.02, 0, s, s, s, castle); }
    [-1, 0, 1].forEach(tx => mesh(G.cone, pm(['#FF6FA3', '#FFC93C', '#3AA8FF'][tx + 1], { clearcoat: 1 }), tx * 1.68, (tx === 0 ? 5 : 3) * 1.63 + 1.1, 0, 0.95, 2.2, 0.95, castle));
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.55), std('#FF5A5A', { side: THREE.DoubleSide })); flag.position.set(0.45, 5 * 1.63 + 2.6, 0); castle.add(flag); mesh(G.cyl, pm('#FFFFFF'), 0, 5 * 1.63 + 2.4, 0, 0.04, 1.2, 0.04, castle);
    anim.push((t, q) => { if (q >= 1) flag.rotation.y = Math.sin(t * 2) * 0.3; });
    /* stacking-ring toy and a giant ball, back right */
    ['#FF5A5A', '#FF8A3D', '#FFC93C', '#4CD964', '#3AA8FF'].forEach((c, i) => { const r = mesh(G.torus, pm(c, { clearcoat: 1, roughness: 0.2 }), 7.5, 0.55 + i * 0.62, -15, 1.25 - i * 0.16, 1.25 - i * 0.16, 1.25 - i * 0.16, far); r.rotation.x = Math.PI / 2; r.scale.z = (1.25 - i * 0.16) * 1.4; });
    mesh(G.cyl, pm('#FFE7B0'), 7.5, 2, -15, 0.16, 4, 0.16, far); mesh(G.ball, pm('#FFE7B0', { clearcoat: 1 }), 7.5, 4.1, -15, 0.38, 0.38, 0.38, far);
    const bb = group(11, 1.4, -12.5, far); mesh(G.ball, pm('#FFFFFF', { clearcoat: 1, roughness: 0.15 }), 0, 0, 0, 1.4, 1.4, 1.4, bb);
    ['#FF5A5A', '#3AA8FF', '#FFC93C'].forEach((c, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(1.41, 32, 16, i * 2.09, 0.9), pm(c, { clearcoat: 1, roughness: 0.15 })); bb.add(s); });
    /* rolling candy hills, far away, and a rainbow */
    const stripes = paint(256, 256, (x, w) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#FFFFFF' : '#FFC2D6'; x.fillRect(0, i * 32, w, 32); } });
    hill(-26, -40, 16, 9, null, '#9DE38A', far); hill(0, -52, 22, 11, null, '#B5EC8F', far); hill(28, -42, 18, 10, null, '#8FDDB0', far); hill(-12, -34, 9, 5, stripes, '#FFFFFF', far); hill(16, -32, 8, 4.5, null, '#FFD9E6', far);
    rainbow(4, -6, -60, 30, far);
    [[-18, 18, -55, 3.2, 1], [8, 22, -70, 4, 2], [26, 15, -50, 2.8, 3], [-34, 12, -45, 2.6, 4], [36, 20, -62, 3, 5]].forEach(([x, y, z, s, sd]) => { const cl = cloud(x, y, z, s, sd, null); cl.parent.remove(cl); far.add(cl); const ph = sd; anim.push((t, q) => { if (q >= 1) cl.position.x = x + Math.sin(t * 0.05 + ph) * 3; }); });
    /* balloons floating up at the sides */
    [[-12.5, 7, -6, '#FF5A5A', 0.7], [-11.6, 8.2, -7, '#FFC93C', 0.6], [12.3, 7.4, -6.5, '#3AA8FF', 0.7], [13.4, 8.6, -7.5, '#4CD964', 0.6], [-6, 12, -20, '#B98CFF', 0.9], [6, 13, -22, '#FF6FA3', 0.9]].forEach(([x, y, z, c, s]) => balloon(x, y, z, c, s, far));
    farify(far);
    motes({ n: 120, colors: ['#FFFFFF', '#FFE58A', '#FFC2D6', '#BDE8FF'], size: 0.12, box: [-12, 12, 0.6, 7, -13, -1.5], kind: 'drift', seed: 3 });
  }


  /* ---------- more pieces for the worlds ---------- */
  function palm(x, z, h, par, lean) {
    const g = group(x, 0, z, par), tm = pm('#B98552', { roughness: 0.7, clearcoat: 0.2 }), lm = pm('#2FBF55', { roughness: 0.45, clearcoat: 0.4, side: THREE.DoubleSide }), L0 = lean || 0.25;
    let px = 0, py = 0; for (let i = 0; i < 9; i++) { const s = 0.24 - i * 0.012; mesh(G.cyl, tm, px, py + h / 18, 0, s, h / 9 + 0.05, s, g); py += h / 9; px += L0 * (i / 9) * 0.35; }
    const top = group(px, py, 0, g);
    const leafS = new THREE.Shape(); leafS.moveTo(0, 0); leafS.quadraticCurveTo(0.6, 0.35, 2.4, 0); leafS.quadraticCurveTo(0.6, -0.15, 0, 0);
    const lg = new THREE.ShapeGeometry(leafS, 12);
    for (let i = 0; i < 8; i++) { const lf = new THREE.Mesh(lg, lm); lf.rotation.set(-Math.PI / 2 + 0.2, i / 8 * Math.PI * 2, -0.45); lf.scale.setScalar(h / 5.5); lf.castShadow = true; const pv = group(0, 0, 0, top); pv.rotation.y = i / 8 * Math.PI * 2; lf.rotation.set(0, 0, -0.5); lf.rotation.order = 'YXZ'; pv.add(lf); }
    for (let i = 0; i < 3; i++) mesh(G.ball, pm('#8A5A2B', { roughness: 0.5 }), Math.cos(i * 2) * 0.22, -0.18, Math.sin(i * 2) * 0.22, 0.18, 0.2, 0.18, top);
    const ph = x; anim.push((t, q) => { if (q >= 1) top.rotation.z = Math.sin(t * 0.7 + ph) * 0.05; });
    return g;
  }
  function umbrella(x, z, h, c1, c2, par) {
    const g = group(x, 0, z, par); mesh(G.cyl, pm('#FFFFFF'), 0, h / 2, 0, 0.05, h, 0.05, g); g.rotation.z = 0.12;
    const st = paint(256, 64, (c, w, hh) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? c1 : c2; c.fillRect(i * w / 8, 0, w / 8, hh); } });
    const top = new THREE.Mesh(new THREE.ConeGeometry(h * 0.62, h * 0.3, 32, 1, true), new PM({ map: st, roughness: 0.6, sheen: 0.6, side: THREE.DoubleSide })); top.position.y = h + h * 0.12; top.castShadow = true; g.add(top);
    return g;
  }
  function sandcastle(x, z, s, par) {
    const g = group(x, 0, z, par), m = pm('#F2CF8A', { roughness: 0.85, clearcoat: 0 }), d = pm('#E8BC6E', { roughness: 0.9, clearcoat: 0 });
    mesh(G.box, m, 0, 0.5 * s, 0, 2.2 * s, 1.0 * s, 1.6 * s, g);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { mesh(G.cyl, m, a * 1.05 * s, 0.85 * s, b * 0.75 * s, 0.42 * s, 1.7 * s, 0.42 * s, g); mesh(G.cone, d, a * 1.05 * s, 2.0 * s, b * 0.75 * s, 0.5 * s, 0.6 * s, 0.5 * s, g); });
    mesh(G.cyl, m, 0, 1.5 * s, 0, 0.6 * s, 1.1 * s, 0.6 * s, g); mesh(G.cone, d, 0, 2.4 * s, 0, 0.7 * s, 0.8 * s, 0.7 * s, g);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.45 * s, 0.28 * s), std('#FF5A5A', { side: THREE.DoubleSide })); fl.position.set(0.22 * s, 3.1 * s, 0); g.add(fl); mesh(G.cyl, pm('#FFFFFF'), 0, 2.95 * s, 0, 0.02 * s, 0.7 * s, 0.02 * s, g);
    mesh(G.box, pm('#8A5A2B'), 0, 0.3 * s, 0.81 * s, 0.4 * s, 0.6 * s, 0.03, g);
    anim.push((t, q) => { if (q >= 1) fl.rotation.y = Math.sin(t * 2.2 + x) * 0.35; });
    return g;
  }
  function bucket(x, z, s, c, par) { const g = group(x, 0, z, par); mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.7, 24, 1, true), pm(c, { clearcoat: 1, side: THREE.DoubleSide }), 0, 0.35 * s, 0, s, s, s, g);
    mesh(G.disc, pm(c), 0, 0.01, 0, 0.32 * s, 0.32 * s, 1, g).rotation.x = -Math.PI / 2; const h = mesh(new THREE.TorusGeometry(0.42, 0.025, 6, 24, Math.PI), pm('#FFFFFF'), 0, 0.7 * s, 0, s, s, s, g); void h; return g; }
  function starfish(x, z, s, c, par) { const sh = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.16 : 0.42, a = Math.PI / 2 + i * Math.PI / 5; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); } sh.closePath();
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 3 }), pm(c, { roughness: 0.5, clearcoat: 0.6 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.08, z); m.scale.setScalar(s); m.castShadow = true; (par || scene).add(m); return m; }
  function shell(x, z, s, c, par) { const m = mesh(new THREE.SphereGeometry(0.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), pm(c, { roughness: 0.3, clearcoat: 1 }), x, 0.02, z, s, s * 0.6, s * 1.2, par); m.rotation.y = x; return m; }
  function coralBranch(x, z, h, c, seed, par) {
    const g = group(x, 0, z, par), m = pm(c, { roughness: 0.5, clearcoat: 0.5, sheen: 0.6, sheenColor: new THREE.Color('#FFFFFF') }), R = rng(seed || 2);
    const grow = (px, py, pz, len, ang, dz, depth) => { const ex = px + Math.sin(ang) * len, ey = py + Math.cos(ang) * len, ez = pz + dz * len;
      const c1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.11 * h * (1 - depth * 0.18), len, 4, 10), m); c1.position.set((px + ex) / 2, (py + ey) / 2, (pz + ez) / 2); c1.lookAt(ex, ey, ez); c1.rotateX(Math.PI / 2); c1.castShadow = true; g.add(c1);
      if (depth < 3) { grow(ex, ey, ez, len * 0.75, ang - 0.5 - R() * 0.3, (R() - 0.5) * 0.6, depth + 1); grow(ex, ey, ez, len * 0.75, ang + 0.5 + R() * 0.3, (R() - 0.5) * 0.6, depth + 1); } };
    grow(0, 0, 0, h * 0.4, 0, 0, 0); return g;
  }
  function seaweed(x, z, h, c, par) {
    const g = group(x, 0, z, par), n = 8, segs = [], m = pm(c, { roughness: 0.5, clearcoat: 0.3, side: THREE.DoubleSide });
    let p = g; for (let i = 0; i < n; i++) { const s = group(0, i ? h / n : 0, 0, p); const lf = mesh(G.ball, m, 0, h / n / 2, 0, 0.2 * (1 - i / n * 0.45), h / n * 0.85, 0.04, s); void lf; segs.push(s); p = s; }
    const ph = x * 1.3 + z; anim.push((t, q) => { if (q < 1) return; segs.forEach((s, i) => { s.rotation.z = Math.sin(t * 1.1 + ph + i * 0.5) * 0.09; s.rotation.x = Math.cos(t * 0.8 + ph + i * 0.4) * 0.05; }); });
    return g;
  }
  function fishSchool(cx, cy, cz, r, n, colors, speed, par) {
    const body = new THREE.SphereGeometry(0.22, 16, 12), tail = new THREE.ConeGeometry(0.14, 0.22, 3), fish = [];
    for (let i = 0; i < n; i++) { const f = group(0, 0, 0, par), m = pm(colors[i % colors.length], { clearcoat: 1, roughness: 0.25 });
      const b = new THREE.Mesh(body, m); b.scale.set(1.5, 1, 0.6); f.add(b); const tl = new THREE.Mesh(tail, m); tl.rotation.z = Math.PI / 2; tl.position.x = -0.38; tl.scale.z = 0.4; f.add(tl);
      const fin = new THREE.Mesh(tail, m); fin.position.set(0, 0.2, 0); fin.scale.set(0.6, 0.6, 0.3); f.add(fin); fish.push([f, tl, i]); }
    anim.push((t, q) => { fish.forEach(([f, tl, i]) => { const a = t * (speed || 0.25) + i * 0.45, rr = r + Math.sin(i * 1.7) * 0.8; f.position.set(cx + Math.cos(a) * rr, cy + Math.sin(i * 2.3 + t * 0.6) * 0.5 + (i % 3) * 0.35, cz + Math.sin(a) * rr * 0.5); f.rotation.y = -a - Math.PI / 2 * Math.sign(speed || 1); if (q >= 1) tl.rotation.y = Math.sin(t * 8 + i) * 0.4; }); });
  }
  function barn(x, z, s, par, rot) {
    const g = group(x, 0, z, par); g.rotation.y = rot || 0; const red = pm('#E5413A', { roughness: 0.55 }), wh = pm('#FFFFFF', { roughness: 0.4 });
    mesh(G.box, red, 0, 1.6 * s, 0, 4 * s, 3.2 * s, 3 * s, g);
    const rs = new THREE.Shape(); rs.moveTo(-2.2, 0); rs.lineTo(-1.6, 1.2); rs.lineTo(0, 1.9); rs.lineTo(1.6, 1.2); rs.lineTo(2.2, 0); rs.closePath();
    const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(rs, { depth: 3.2, bevelEnabled: false }), pm('#7A3B2E', { roughness: 0.5 })); roof.position.set(0, 3.2 * s, -1.6 * s); roof.scale.setScalar(s); roof.castShadow = true; g.add(roof);
    mesh(G.box, wh, 0, 1.1 * s, 1.52 * s, 1.6 * s, 2.2 * s, 0.06, g); mesh(G.box, red, 0, 1.1 * s, 1.56 * s, 1.3 * s, 1.9 * s, 0.05, g);
    [-1, 1].forEach(k => { const b = mesh(G.box, wh, 0, 1.1 * s, 1.6 * s, 0.12 * s, 2.3 * s, 0.05, g); b.rotation.z = k * 0.62; });
    mesh(G.box, wh, 0, 3.7 * s, 1.55 * s, 0.9 * s, 0.7 * s, 0.05, g); mesh(G.box, glow('#FFE7A0', 0.4), 0, 3.7 * s, 1.58 * s, 0.7 * s, 0.5 * s, 0.04, g);
    const silo = group(2.9 * s, 0, -0.4 * s, g); mesh(G.cyl, pm('#E8E2D6', { metalness: 0.2 }), 0, 2.6 * s, 0, 0.9 * s, 5.2 * s, 0.9 * s, silo); mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), pm('#3A7BD5'), 0, 5.2 * s, 0, 0.92 * s, 0.7 * s, 0.92 * s, silo);
    return g;
  }
  function pumpkin(x, z, s, par) {
    const pts = []; for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI; pts.push(new THREE.Vector2(Math.sin(a) * 0.5, -Math.cos(a) * 0.38)); }
    const geo = new THREE.LatheGeometry(pts, 48), p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const vx = p.getX(i), vz = p.getZ(i), a = Math.atan2(vz, vx), k = 1 + Math.cos(a * 8) * 0.06; p.setX(i, vx * k); p.setZ(i, vz * k); } geo.computeVertexNormals();
    const g = group(x, 0.36 * s, z, par); mesh(geo, pm('#FF8A1F', { roughness: 0.45, clearcoat: 0.6 }), 0, 0, 0, s, s, s, g); mesh(G.cyl, pm('#5A8A2E'), 0, 0.42 * s, 0, 0.05 * s, 0.2 * s, 0.05 * s, g); return g;
  }
  function hay(x, z, s, par, rot) { const t = paint(256, 128, (c, w, h) => { c.fillStyle = '#F2C94C'; c.fillRect(0, 0, w, h); const R = rng(8); for (let i = 0; i < 700; i++) { c.strokeStyle = R() < 0.5 ? '#D9A92E' : '#FFE28A'; c.lineWidth = 1.5; c.beginPath(); const px = R() * w, py = R() * h; c.moveTo(px, py); c.lineTo(px + 12, py + (R() - 0.5) * 4); c.stroke(); } });
    const m = mesh(G.cyl, new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }), x, 0.6 * s, z, 0.75 * s, 1.0 * s, 0.75 * s, par); m.rotation.z = Math.PI / 2; m.rotation.y = rot || 0; return m; }
  function fence(x0, z0, x1, z1, n, c, par) { const g = group(0, 0, 0, par), m = pm(c || '#FFFFFF', { roughness: 0.5 });
    for (let i = 0; i <= n; i++) { const u = i / n; mesh(G.box, m, x0 + (x1 - x0) * u, 0.45, z0 + (z1 - z0) * u, 0.14, 0.9, 0.1, g); }
    const len = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(z1 - z0, x1 - x0); [0.3, 0.65].forEach(y => { const r = mesh(G.box, m, (x0 + x1) / 2, y, (z0 + z1) / 2, len, 0.1, 0.06, g); r.rotation.y = -a; }); return g; }
  function windmill(x, z, s, par) { const g = group(x, 0, z, par); mesh(new THREE.CylinderGeometry(0.5, 0.9, 1, 8), pm('#FFFFFF'), 0, 2.5 * s, 0, s, 5 * s, s, g); mesh(G.cone, pm('#E5413A'), 0, 5.4 * s, 0, 0.75 * s, 1 * s, 0.75 * s, g);
    const hub = group(0, 4.6 * s, 0.75 * s, g); for (let i = 0; i < 4; i++) { const b = mesh(G.box, pm('#FFF4D6'), 0, 1.3 * s, 0, 0.5 * s, 2.4 * s, 0.05, group(0, 0, 0, hub)); b.parent.rotation.z = i * Math.PI / 2; }
    anim.push((t) => { hub.rotation.z = t * 0.5; }); return g; }
  function snowman(x, z, s, scarf, par) { const g = group(x, 0, z, par), sn = pm('#FFFFFF', { roughness: 0.6, clearcoat: 0.2, sheen: 0.6, sheenColor: new THREE.Color('#D8ECFF') });
    mesh(G.ball, sn, 0, 0.75 * s, 0, 0.8 * s, 0.75 * s, 0.8 * s, g); mesh(G.ball, sn, 0, 1.85 * s, 0, 0.58 * s, 0.55 * s, 0.58 * s, g); mesh(G.ball, sn, 0, 2.7 * s, 0, 0.42 * s, 0.42 * s, 0.42 * s, g);
    const n = mesh(G.cone, pm('#FF8A1F', { clearcoat: 1 }), 0, 2.68 * s, 0.5 * s, 0.07 * s, 0.35 * s, 0.07 * s, g); n.rotation.x = Math.PI / 2;
    [-1, 1].forEach(k => mesh(G.ballLo, std('#2A2A35'), k * 0.14 * s, 2.82 * s, 0.37 * s, 0.05 * s, 0.05 * s, 0.05 * s, g));
    for (let i = 0; i < 5; i++) { const a = -0.5 + i * 0.25; mesh(G.ballLo, std('#2A2A35'), Math.sin(a) * 0.3 * s, 2.55 * s - Math.cos(a) * 0.08 * s + 0.08 * s, 0.36 * s, 0.035 * s, 0.035 * s, 0.035 * s, g); }
    const sc = mesh(G.torus, pm(scarf, { roughness: 0.8, sheen: 1 }), 0, 2.32 * s, 0, 0.42 * s, 0.42 * s, 0.6 * s, g); sc.rotation.x = Math.PI / 2;
    mesh(G.box, pm(scarf, { roughness: 0.8 }), 0.25 * s, 2.0 * s, 0.4 * s, 0.16 * s, 0.5 * s, 0.06 * s, g);
    [0, 1, 2].forEach(i => mesh(G.ballLo, std('#2A2A35'), 0, (1.65 + i * 0.2) * s, 0.56 * s, 0.05 * s, 0.05 * s, 0.05 * s, g));
    [-1, 1].forEach(k => { const a = mesh(G.cyl, pm('#7A4A26'), k * 0.85 * s, 2.0 * s, 0, 0.03 * s, 0.9 * s, 0.03 * s, g); a.rotation.z = k * 1.0; });
    return g; }
  function cabin(x, z, s, par, rot) { const g = group(x, 0, z, par); g.rotation.y = rot || 0; const wd = pm('#B5653A', { roughness: 0.6 });
    mesh(G.box, wd, 0, 1.2 * s, 0, 3.2 * s, 2.4 * s, 2.6 * s, g); const rf = mesh(new THREE.ConeGeometry(2.6, 1.6, 4), pm('#FFFFFF', { roughness: 0.5, sheen: 0.6 }), 0, 3.2 * s, 0, s * 1.05, s, s * 0.95, g); rf.rotation.y = Math.PI / 4;
    [-0.8, 0.8].forEach(k => { mesh(G.box, glow('#FFC861', 1.4), k * s, 1.4 * s, 1.31 * s, 0.7 * s, 0.7 * s, 0.04, g); mesh(G.box, pm('#FFFFFF'), k * s, 1.4 * s, 1.3 * s, 0.85 * s, 0.85 * s, 0.03, g); });
    mesh(G.box, pm('#7A3B2E'), 0, 0.75 * s, 1.31 * s, 0.7 * s, 1.5 * s, 0.04, g); mesh(G.box, pm('#C94A3A'), 0.9 * s, 3.6 * s, -0.4 * s, 0.45 * s, 1.4 * s, 0.45 * s, g); return g; }
  function cupcake(x, y, z, s, frost, par) { const g = group(x, y, z, par); mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.5, 20), pm('#FFB3C7', { roughness: 0.6 }), 0, 0.25 * s, 0, s, s, s, g);
    [0.32, 0.24, 0.14].forEach((r, i) => mesh(G.ball, pm(frost, { roughness: 0.35, clearcoat: 0.6 }), 0, (0.55 + i * 0.16) * s, 0, r * 1.45 * s, 0.16 * s, r * 1.45 * s, g)); mesh(G.ball, pm('#FF3B5C', { clearcoat: 1, roughness: 0.15 }), 0, 0.98 * s, 0, 0.1 * s, 0.1 * s, 0.1 * s, g); return g; }
  function cookie(x, y, z, s, c, par) { const g = group(x, y, z, par), m = mesh(G.cyl, pm('#E0A45E', { roughness: 0.7, clearcoat: 0.1 }), 0, 0.06 * s, 0, 0.4 * s, 0.12 * s, 0.4 * s, g); void m;
    mesh(G.cyl, pm(c, { roughness: 0.35, clearcoat: 0.8 }), 0, 0.13 * s, 0, 0.32 * s, 0.03 * s, 0.32 * s, g); for (let i = 0; i < 6; i++) mesh(G.ballLo, pm(['#FFFFFF', '#FFD23F', '#3AA8FF'][i % 3]), Math.cos(i) * 0.2 * s, 0.15 * s, Math.sin(i) * 0.2 * s, 0.03 * s, 0.02 * s, 0.03 * s, g); return g; }
  function challah(x, y, z, s, par) { const g = group(x, y, z, par), m = pm('#D98A3A', { roughness: 0.45, clearcoat: 0.6 }); for (let i = 0; i < 5; i++) mesh(G.ball, m, (i - 2) * 0.34 * s, 0.22 * s, (i % 2 ? 0.1 : -0.1) * s, 0.3 * s * (1 - Math.abs(i - 2) * 0.12), 0.24 * s, 0.26 * s, g); return g; }
  function gift(x, z, s, c, rb, par) { const g = group(x, 0, z, par); mesh(G.box, pm(c, { clearcoat: 1, roughness: 0.25 }), 0, 0.5 * s, 0, s, s, s, g); mesh(G.box, pm(rb, { clearcoat: 1 }), 0, 0.5 * s, 0, 1.02 * s, 1.02 * s, 0.18 * s, g); mesh(G.box, pm(rb, { clearcoat: 1 }), 0, 0.5 * s, 0, 0.18 * s, 1.02 * s, 1.02 * s, g);
    [-1, 1].forEach(k => { const b = mesh(G.torus, pm(rb, { clearcoat: 1 }), k * 0.16 * s, 1.08 * s, 0, 0.16 * s, 0.12 * s, 0.16 * s, g); b.rotation.y = Math.PI / 2; b.rotation.z = k * 0.5; }); return g; }
  function lights(a, b, sag, colors, n, par) { const g = group(0, 0, 0, par), pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push(new THREE.Vector3(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag, a[2] + (b[2] - a[2]) * u)); }
    const cv = new THREE.CatmullRomCurve3(pts); g.add(new THREE.Mesh(new THREE.TubeGeometry(cv, 40, 0.015, 5), std('#3A3A4A'))); const bulbs = [];
    for (let i = 0; i < n; i++) { const p = cv.getPoint((i + 0.5) / n), m = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], emissive: colors[i % colors.length], emissiveIntensity: 2.2 }); const bl = mesh(G.ballLo, m, p.x, p.y - 0.1, p.z, 0.09, 0.12, 0.09, g); bl.castShadow = false; bulbs.push(m); }
    anim.push((t, q) => { if (q >= 1) bulbs.forEach((m, i) => { m.emissiveIntensity = 1.8 + Math.sin(t * 2 + i * 1.3) * 0.7; }); }); return g; }
  function planet(x, y, z, r, c, ring, par) { const g = group(x, y, z, par); const t = paint(256, 128, (cx, w, h) => { cx.fillStyle = c[0]; cx.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { cx.fillStyle = c[1 + i % (c.length - 1)]; cx.globalAlpha = 0.55; cx.fillRect(0, h * (0.1 + i * 0.15), w, h * (0.04 + (i % 3) * 0.03)); } });
    const p = mesh(G.ball, new THREE.MeshStandardMaterial({ map: t, roughness: 0.5, emissive: c[0], emissiveIntensity: 0.25 }), 0, 0, 0, r, r, r, g); p.castShadow = false;
    if (ring) { const rg = new THREE.Mesh(new THREE.RingGeometry(r * 1.35, r * 2.0, 64), new THREE.MeshStandardMaterial({ color: ring, emissive: ring, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })); rg.rotation.x = -1.2; rg.rotation.y = 0.3; g.add(rg); }
    anim.push(t => { p.rotation.y = t * 0.08; }); return g; }
  function rocket(x, z, s, par) { const g = group(x, 0, z, par); mesh(G.cyl, pm('#FFFFFF', { clearcoat: 1, roughness: 0.2 }), 0, 2.2 * s, 0, 0.75 * s, 3.2 * s, 0.75 * s, g); mesh(G.cone, pm('#FF4E50', { clearcoat: 1 }), 0, 4.45 * s, 0, 0.75 * s, 1.3 * s, 0.75 * s, g);
    mesh(G.cyl, glow('#7FE7FF', 0.9), 0, 2.9 * s, 0.7 * s, 0.32 * s, 0.08 * s, 0.32 * s, g).rotation.x = Math.PI / 2; mesh(G.torus, pm('#3AA8FF', { clearcoat: 1 }), 0, 2.9 * s, 0.72 * s, 0.34 * s, 0.34 * s, 0.34 * s, g);
    for (let i = 0; i < 3; i++) { const f = group(0, 0, 0, g); f.rotation.y = i * Math.PI * 2 / 3; mesh(G.box, pm('#FF4E50', { clearcoat: 1 }), 0.85 * s, 0.9 * s, 0, 0.5 * s, 1.4 * s, 0.12 * s, f); }
    mesh(G.cyl, pm('#B9C2D6', { metalness: 0.5 }), 0, 0.45 * s, 0, 0.55 * s, 0.4 * s, 0.55 * s, g); return g; }
  function crystal(x, z, s, c, par) { const m = mesh(new THREE.OctahedronGeometry(0.4, 0), new PM({ color: c, emissive: c, emissiveIntensity: 0.6, roughness: 0.1, clearcoat: 1, flatShading: true }), x, 0.45 * s, z, s * 0.7, s * 1.5, s * 0.7, par); m.rotation.y = x; return m; }
  function bigLeaf(x, z, h, c, rot, par) {   /* a giant tropical leaf on a stem */
    const g = group(x, 0, z, par); g.rotation.y = rot || 0; const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(-1.2, 0.5, -1.0, 2.0, 0, 2.6); s.bezierCurveTo(1.0, 2.0, 1.2, 0.5, 0, 0);
    const geo = new THREE.ShapeGeometry(s, 24), p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, -Math.pow(p.getX(i), 2) * 0.35 + Math.pow(p.getY(i) / 2.6, 2) * 0.6); geo.computeVertexNormals();
    mesh(G.cyl, pm('#2E9E44'), 0, h * 0.3, 0, 0.05 * h / 3, h * 0.6, 0.05 * h / 3, g);
    const lf = new THREE.Mesh(geo, pm(c, { roughness: 0.4, clearcoat: 0.7, side: THREE.DoubleSide })); lf.position.y = h * 0.55; lf.rotation.x = -0.5; lf.scale.setScalar(h / 3); lf.castShadow = true; g.add(lf);
    const ph = x + z; anim.push((t, q) => { if (q >= 1) lf.rotation.x = -0.5 + Math.sin(t * 0.8 + ph) * 0.06; }); return g; }
  function parrot(x, y, z, s, c1, c2, par) { const g = group(x, y, z, par); mesh(G.ball, pm(c1, { clearcoat: 0.8 }), 0, 0, 0, 0.32 * s, 0.45 * s, 0.32 * s, g); mesh(G.ball, pm(c1, { clearcoat: 0.8 }), 0, 0.5 * s, 0.05 * s, 0.24 * s, 0.24 * s, 0.24 * s, g);
    const bk = mesh(G.cone, pm('#FFD23F'), 0, 0.46 * s, 0.3 * s, 0.07 * s, 0.18 * s, 0.07 * s, g); bk.rotation.x = Math.PI / 2 + 0.6; [-1, 1].forEach(k => { const w = mesh(G.ball, pm(c2, { clearcoat: 0.8 }), k * 0.28 * s, 0.05 * s, -0.05 * s, 0.1 * s, 0.38 * s, 0.22 * s, g); w.rotation.z = k * 0.2; });
    const tl = mesh(G.box, pm(c2), 0, -0.6 * s, -0.12 * s, 0.14 * s, 0.6 * s, 0.05 * s, g); tl.rotation.x = 0.3; [-1, 1].forEach(k => mesh(G.ballLo, std('#1A1A1A'), k * 0.12 * s, 0.56 * s, 0.17 * s, 0.035 * s, 0.035 * s, 0.035 * s, g));
    const ph = x; anim.push((t, q) => { if (q >= 1) g.rotation.y = Math.sin(t * 0.5 + ph) * 0.3; }); return g; }
  function waterfall(x, y0, z, w, h, par) { const t = paint(64, 256, (c, ww, hh) => { const R = rng(3); c.fillStyle = '#7FDBFF'; c.fillRect(0, 0, ww, hh); for (let i = 0; i < 120; i++) { c.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.75)' : 'rgba(200,245,255,.6)'; c.fillRect(R() * ww, R() * hh, 2 + R() * 3, 10 + R() * 30); } }, { repeat: [2, 1] });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; const m = mesh(G.plane, new THREE.MeshBasicMaterial({ map: t, color: '#E8FBFF' }), x, y0 + h / 2, z, w, h, 1, par); m.castShadow = false;
    anim.push(tt => { t.offset.y = tt * 0.6; }); return m; }
  function train(path, cars, par) {   /* a little toy train going round and round */
    const parts = []; const mk = (c, eng) => { const g = group(0, 0, 0, par); mesh(G.box, pm(c, { clearcoat: 1, roughness: 0.2 }), 0, 0.55, 0, 1.4, 0.7, 0.8, g);
      if (eng) { mesh(G.cyl, pm(c, { clearcoat: 1 }), 0.2, 0.7, 0, 0.4, 1.0, 0.4, g).rotation.z = Math.PI / 2; mesh(G.box, pm('#FFFFFF', { clearcoat: 1 }), -0.35, 1.1, 0, 0.7, 0.7, 0.8, g); mesh(G.cyl, pm('#2A2F45'), 0.55, 1.25, 0, 0.12, 0.5, 0.12, g); mesh(G.box, pm('#FF4E50'), -0.35, 1.5, 0, 0.9, 0.12, 1.0, g); }
      else [0, 1, 2].forEach(i => mesh(G.ball, pm(['#FFD23F', '#3AA8FF', '#FF6FA3'][i], { clearcoat: 1 }), (i - 1) * 0.42, 1.05, 0, 0.2, 0.2, 0.2, g));
      [-0.45, 0.45].forEach(wx => [-0.42, 0.42].forEach(wz => { const wh = mesh(G.cyl, pm('#2A2F45'), wx, 0.22, wz, 0.2, 0.08, 0.2, g); wh.rotation.x = Math.PI / 2; }));
      parts.push(g); return g; };
    cars.forEach((c, i) => mk(c, i === 0));
    anim.push(t => { parts.forEach((g, i) => { const u = ((t * 0.018 - i * 0.022) % 1 + 1) % 1, p = path.getPointAt(u), d = path.getTangentAt(u); g.position.copy(p); g.rotation.y = Math.atan2(-d.z, d.x); }); });
    return parts;
  }
  function track(path, par) { const g = group(0, 0, 0, par), N = 160; for (let i = 0; i < N; i++) { const u = i / N, p = path.getPointAt(u), d = path.getTangentAt(u), tie = mesh(G.box, pm('#9A6237', { roughness: 0.7 }), p.x, 0.05, p.z, 0.16, 0.08, 1.1, g); tie.rotation.y = Math.atan2(-d.z, d.x); tie.castShadow = false; }
    [-0.4, 0.4].forEach(off => { const pts = []; for (let i = 0; i <= N; i++) { const u = (i % N) / N, p = path.getPointAt(u), d = path.getTangentAt(u); pts.push(new THREE.Vector3(p.x - d.z * off, 0.12, p.z + d.x * off)); } g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 300, 0.05, 6, true), pm('#C9CED6', { metalness: 0.6, roughness: 0.3 }))); });
    return g; }

  /* Unit 2: a garden of giant flowers */
  function garden() {
    setEnv({ bg: '#BDE6FF', fog: ['#D6F0FF', 34, 120], sun: ['#FFF0D2', 2.6, [-7, 13, 7]], hemi: ['#CFE8FF', '#6FC060', 0.6], rim: ['#FFE0B0', 1.1], front: ['#FFE9D2', 0.35], exposure: 0.84,
      box: ['#5FBF5A', '#FFFFFF', '#3E9E45'], css: '#BDE6FF' });
    skyDome('#3E9BFF', '#93CFFF', '#EAF8FF', [0.4, 0.45, -1]);
    ground(grassTex('#58C84C', '#349E3C', '#93E46A', ['#FFFFFF', '#FFE14D', '#FF8FB1', '#B98CFF'], 8), '#FFFFFF', { sheen: 0.5, sheenColor: '#D8FFB0' });
    stage((x, c) => { x.fillStyle = '#9BE07A'; x.fillRect(0, 0, 2 * c, 2 * c); x.fillStyle = '#FFFFFF'; for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; x.save(); x.translate(c + Math.cos(a) * c * 0.86, c + Math.sin(a) * c * 0.86); x.rotate(a); x.beginPath(); x.ellipse(0, 0, c * 0.14, c * 0.075, 0, 0, 7); x.fill(); x.restore(); }
      x.fillStyle = '#FFE58A'; x.beginPath(); x.arc(c, c, c * 0.8, 0, 7); x.fill(); const g = x.createRadialGradient(c, c, 0, c, c, c * 0.77); g.addColorStop(0, '#FFFDF2'); g.addColorStop(1, '#FFF4D2'); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * 0.77, 0, 7); x.fill();
      const R = rng(6); for (let i = 0; i < 260; i++) { const a = R() * 6.28, r = Math.sqrt(R()) * c * 0.74; x.fillStyle = 'rgba(255,214,90,.25)'; x.beginPath(); x.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, 2 + R() * 3, 0, 7); x.fill(); } }, { edge: '#FFF0C0', r: 6.9 });
    const far = group(), near = group();
    scatter(80, 7.4, 11.5, 41, (x, z, R, i) => { const k = i % 6; if (k < 3) tuft(x, z, 0.9 + R() * 0.7, ['#3FBF4A', '#58D35A', '#2EA845'][k], near); else if (k < 5) bloomFlower(x, z, 1 + R() * 0.8, ['#FF6FA3', '#FFFFFF', '#FFC93C', '#A77BFF', '#FF5A5A'][i % 5], near); else if (i % 12 === 5) mushroom(x, z, 0.45 + R() * 0.25, '#FF4E50', near); else bloomFlower(x, z, 1.1, '#FFFFFF', near); });
    [[-10, -2.5, 6.5, '#FF6FA3', '#FFD23F'], [-13, -7, 8.5, '#FFFFFF', '#FFC93C'], [-8.6, -11, 5.2, '#B98CFF', '#FFFFFF'], [10.4, -3, 7, '#FFD23F', '#8A4E1E'], [13.6, -8, 8.8, '#FF8A3D', '#FFE37A'], [8.8, -11.5, 5, '#FF5A5A', '#FFFFFF'], [-15.5, 1.5, 7.5, '#3AA8FF', '#FFFFFF'], [16, 1, 7.2, '#FF6FA3', '#FFFFFF']]
      .forEach(([x, z, h, p, c], i) => flower(x, z, h, p, c, p === '#FFD23F' ? 16 : 10, h * (p === '#FFD23F' ? 0.17 : 0.2), far, i));
    [[-6, -10.5, 2.6, '#FF5A5A'], [-4.4, -11.5, 3, '#FFC93C'], [4.6, -11, 2.8, '#FF6FA3'], [6.2, -10.2, 2.4, '#B98CFF'], [-11.5, 4, 2.6, '#FF8A3D'], [11.8, 4.5, 2.8, '#FF5A5A'], [0, -13, 3, '#FFFFFF']].forEach(([x, z, h, c]) => tulip(x, z, h, c, far));
    [[-2, -11.6, 1.1, '#56C452', ['#FFFFFF', '#FF8FB1']], [2.2, -12, 1.2, '#4BB84A', ['#FFD84D', '#FFFFFF']], [-9, -8, 1.3, '#56C452', ['#B98CFF']], [9.2, -8.4, 1.2, '#4BB84A', ['#FF6FA3']]].forEach(([x, z, r, c, f], i) => bush(x, z, r, c, f, 60 + i, far));
    mushroom(-7.5, -9, 1.4, '#FF4E50', far); mushroom(7.6, -9.3, 1.1, '#FF8A3D', far);
    [[-20, -28, 14, '#FFD23F', '#8A4E1E'], [-6, -34, 16, '#FF6FA3', '#FFFFFF'], [9, -30, 15, '#FFFFFF', '#FFC93C'], [24, -26, 13, '#B98CFF', '#FFFFFF']].forEach(([x, z, h, p, c], i) => flower(x, z, h, p, c, p === '#FFD23F' ? 16 : 11, h * 0.17, far, 10 + i));
    hill(-30, -50, 20, 9, null, '#8FDD7E', far); hill(20, -55, 24, 10, null, '#A6E58A', far);
    [[-16, 16, -50, 3, 1], [12, 19, -60, 3.6, 2], [30, 14, -48, 2.6, 3]].forEach(([x, y, z, s, sd]) => { const cl = cloud(x, y, z, s, sd); far.add(cl); anim.push((t, q) => { if (q >= 1) cl.position.x = x + Math.sin(t * 0.05 + sd) * 3; }); });
    butterflies(6, ['#FF6FA3', '#FFC93C', '#3AA8FF', '#B98CFF', '#FF8A3D', '#FFFFFF'], [[-8, 3, -5, 2.5], [8, 3.4, -6, 2.2], [0, 4.5, -9, 3], [-11, 2.5, 0, 1.8], [11, 2.8, 1, 2], [0, 6, -14, 4]]);
    farify(far);
    motes({ n: 90, colors: ['#FFFFFF', '#FFD6E5', '#FFF3A8'], size: 0.13, box: [-12, 12, 0.6, 7, -13, -1.5], kind: 'drift', seed: 5 });
  }

  /* Unit 3: floating islands in the clouds */
  function sky() {
    setEnv({ bg: '#BFE3FF', fog: ['#FFE6F2', 30, 110], sun: ['#FFF2DE', 2.6, [-6, 13, 8]], hemi: ['#D6EBFF', '#FFE2EE', 0.65], rim: ['#FFD6E8', 1.2], front: ['#FFE9F2', 0.35], exposure: 0.85,
      box: ['#7FB8FF', '#FFFFFF', '#5D97E8'], css: '#BFE3FF' });
    skyDome('#3D8BFF', '#9CCBFF', '#FFE0EE', [-0.5, 0.35, -1]);
    /* the island he stands on: grass on top, a rim of soft grass, earth and rock underneath */
    const top = grassTex('#62D057', '#3BA845', '#A3EC74', ['#FFFFFF', '#FFD84D', '#FF8FB1'], 12);
    const isl = new THREE.Mesh(new THREE.CircleGeometry(15, 96), new PM({ map: top, roughness: 0.85, sheen: 0.5, sheenColor: new THREE.Color('#D8FFB0') }));
    const uv = isl.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 15 / 80, uv.getY(i) * 15 / 80); isl.rotation.x = -Math.PI / 2; isl.receiveShadow = true; scene.add(isl); groundMats.push(isl.material);
    const rimG = new THREE.Mesh(new THREE.TorusGeometry(15, 0.45, 16, 120), pm('#58C84C', { roughness: 0.6 })); rimG.rotation.x = Math.PI / 2; rimG.position.y = -0.15; scene.add(rimG);
    const far = group(), near = group();
    const rock = new THREE.Mesh(new THREE.ConeGeometry(15.2, 14, 40, 6), new THREE.MeshStandardMaterial({ color: '#C98A5A', roughness: 0.9, flatShading: true })); rock.rotation.x = Math.PI; rock.position.y = -7.4; far.add(rock);
    { const p = rock.geometry.attributes.position, R = rng(3); for (let i = 0; i < p.count; i++) { if (p.getY(i) < 6.9) { p.setX(i, p.getX(i) * (0.92 + R() * 0.16)); p.setZ(i, p.getZ(i) * (0.92 + R() * 0.16)); } } rock.geometry.computeVertexNormals(); }
    /* the cloud sea far below, and clouds all around */
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#FFF2F8', emissiveIntensity: 0.55, roughness: 1 })); sea.rotation.x = -Math.PI / 2; sea.position.y = -7; far.add(sea);
    const R = rng(21); for (let i = 0; i < 34; i++) { const a = R() * Math.PI * 2, d = 18 + R() * 34, cl = cloud(Math.cos(a) * d, -4.5 + R() * 3, Math.sin(a) * d - 4, 3 + R() * 3.5, i, R() < 0.35 ? '#FFE3F0' : null); far.add(cl); const x0 = cl.position.x; anim.push((t, q) => { if (q >= 1) cl.position.x = x0 + Math.sin(t * 0.07 + i) * 1.2; }); }
    [[-20, 14, -50, 3.6], [14, 18, -60, 4], [30, 10, -40, 3], [-34, 8, -38, 3]].forEach(([x, y, z, s], i) => { const cl = cloud(x, y, z, s, 40 + i); far.add(cl); anim.push((t, q) => { if (q >= 1) cl.position.x = x + Math.sin(t * 0.06 + i) * 3; }); });
    /* little islands floating nearby, with trees and a waterfall */
    const islet = (x, y, z, r, seed) => { const g = group(x, y, z, far); const tp = mesh(new THREE.CylinderGeometry(r, r * 0.95, 0.5, 32), pm('#62D057', { roughness: 0.7 }), 0, 0, 0, 1, 1, 1, g);
      const rk = mesh(new THREE.ConeGeometry(r * 0.95, r * 1.6, 12, 2), new THREE.MeshStandardMaterial({ color: '#C98A5A', roughness: 0.9, flatShading: true }), 0, -r * 0.8 - 0.25, 0, 1, 1, 1, g); rk.rotation.x = Math.PI;
      roundTree(-r * 0.3, 0, r * 1.1, ['#5ED36A', '#FF8FB1', '#7FD9FF'][seed % 3], null, seed, g); bloomFlower(r * 0.5, r * 0.2, 1.6, '#FFFFFF', g); bloomFlower(r * 0.3, -r * 0.4, 1.4, '#FF6FA3', g);
      const ph = seed * 1.3; anim.push((t, q) => { if (q >= 1) g.position.y = y + Math.sin(t * 0.4 + ph) * 0.35; }); void tp; return g; };
    islet(-17, 2, -12, 3, 1); islet(18, 4, -16, 3.6, 2); islet(-8, 7, -30, 4, 3); islet(12, 9, -36, 4.5, 4); islet(-26, 6, -24, 3.5, 5);
    waterfall(18 + 2.8, -9, -16 + 1.5, 1.2, 13, far); waterfall(-17 + 2.2, -8, -12 + 1.2, 1, 10, far);
    rainbow(-2, -4, -55, 28, far);
    /* hot-air balloons drifting by */
    [[-12, 9, -22, '#FF6FA3', '#FFD23F'], [14, 12, -28, '#3AA8FF', '#FFFFFF'], [2, 15, -40, '#FF8A3D', '#FFE37A']].forEach(([x, y, z, c1, c2], i) => { const g = group(x, y, z, far);
      const st = paint(256, 128, (c, w, h) => { for (let k = 0; k < 8; k++) { c.fillStyle = k % 2 ? c1 : c2; c.fillRect(k * w / 8, 0, w / 8, h); } });
      const b = mesh(G.ball, new PM({ map: st, roughness: 0.3, clearcoat: 0.6 }), 0, 0, 0, 1.6, 1.9, 1.6, g); void b; mesh(G.cone, pm(c1), 0, -2.1, 0, 0.8, 1, 0.8, g).rotation.x = Math.PI; mesh(G.box, pm('#B9824E'), 0, -3, 0, 0.7, 0.5, 0.7, g);
      anim.push((t, q) => { if (q >= 1) { g.position.y = y + Math.sin(t * 0.3 + i * 2) * 0.6; g.position.x = x + Math.sin(t * 0.04 + i) * 2; } }); });
    /* on our island: trees and bushes at the sides */
    [[-10.5, -3, 4.6, '#5ED36A', 1], [-12.5, -9, 5.4, '#FF8FB1', 2], [10.6, -2.6, 4.8, '#7FD9FF', 3], [12.6, -9.5, 5.6, '#5ED36A', 4], [-13.5, 3, 4.2, '#FFC93C', 5], [13.6, 3.5, 4.4, '#FF8FB1', 6]].forEach(([x, z, h, c, sd]) => roundTree(x, z, h, c, '#A86A3D', sd, far));
    [[-6, -11.4, 1.1, '#56C452', ['#FFFFFF', '#FF8FB1']], [5.6, -11.6, 1.2, '#4BB84A', ['#FFD84D', '#FFFFFF']], [0, -12.8, 1.0, '#56C452', ['#B98CFF', '#FFFFFF']]].forEach(([x, z, r, c, f], i) => bush(x, z, r, c, f, 70 + i, far));
    stage(ringStage([[1.0, '#FFFFFF'], [0.965, '#9CCBFF'], [0.915, '#FFFFFF'], [0.895, '#FFB8D9'], [0.845, '#FFFFFF'], [0.825, '#FFE58A'], [0.77, '#FFFAF4']], ['#FFFFFF', '#F7F3FF']), { edge: '#E6EEFF' });
    scatter(60, 7.2, 12, 51, (x, z, Rr, i) => { const k = i % 5; if (k < 2) tuft(x, z, 0.9 + Rr() * 0.6, ['#3FBF4A', '#58D35A'][k], near); else bloomFlower(x, z, 1 + Rr() * 0.6, ['#FFFFFF', '#FF8FB1', '#FFD84D'][i % 3], near); });
    farify(far);
    motes({ n: 110, colors: ['#FFFFFF', '#FFE6F2', '#FFF6C8'], size: 0.12, box: [-13, 13, 0.6, 8, -14, -1.5], kind: 'drift', seed: 7 });
  }

  /* Unit 4: a sunny bakery */
  function bakery() {
    setEnv({ bg: '#FFE8D6', fog: ['#FFE3CF', 26, 70], sun: ['#FFF0DA', 2.5, [-6, 12, 8]], hemi: ['#FFF4EA', '#F2C9A8', 0.65], rim: ['#FFCFA0', 1.0], front: ['#FFE6D0', 0.4], exposure: 0.86,
      box: ['#FF9EBB', '#FFFFFF', '#F07A9E'], css: '#FFE8D6' });
    const tiles = paint(512, 512, (x, w) => { const n = 8, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = (i + j) % 2 ? '#FFFFFF' : '#FFD3DF'; x.fillRect(i * s, j * s, s, s); } x.strokeStyle = 'rgba(200,140,150,.35)'; x.lineWidth = 2; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo(i * s, 0); x.lineTo(i * s, w); x.stroke(); x.beginPath(); x.moveTo(0, i * s); x.lineTo(w, i * s); x.stroke(); } }, { repeat: [20, 20] });
    ground(tiles, '#FFFFFF', { coat: 0.6, rough: 0.4 });
    const far = group(), near = group();
    /* the back wall: pastel tiles, a long counter full of good things, the oven, shelves, a sunny window */
    const wallT = paint(512, 512, (x, w) => { x.fillStyle = '#C9F0E6'; x.fillRect(0, 0, w, w); const s = w / 8; x.strokeStyle = '#FFFFFF'; x.lineWidth = 6; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(0, i * s); x.lineTo(w, i * s); x.stroke(); for (let j = 0; j <= 8; j++) { x.beginPath(); x.moveTo(j * s + (i % 2) * s / 2, i * s); x.lineTo(j * s + (i % 2) * s / 2, i * s + s); x.stroke(); } } }, { repeat: [10, 3] });
    mesh(G.plane, std('#FFFFFF', { map: wallT, roughness: 0.6 }), 0, 8, -11, 70, 16, 1, far).castShadow = false;
    mesh(G.box, pm('#FFB3C7', { roughness: 0.4 }), 0, 1.0, -9.8, 26, 2.0, 1.8, far); mesh(G.box, pm('#FFFFFF', { roughness: 0.25, clearcoat: 1 }), 0, 2.05, -9.8, 26.4, 0.14, 2.0, far);
    for (let i = -6; i <= 6; i++) mesh(G.box, pm('#FFC9D6', { roughness: 0.5 }), i * 2, 1.0, -8.88, 1.6, 1.4, 0.05, far);
    const goods = [[-10, 'c', '#FFFFFF'], [-8.6, 'c', '#FFB3E6'], [-7.2, 'k', '#FF6FA3'], [-5.6, 'b'], [-3.8, 'c', '#BDE8FF'], [-2.4, 'k', '#FFD23F'], [-1, 'c', '#FFE37A'], [0.6, 'b'], [2.4, 'k', '#7ED6FF'], [3.8, 'c', '#C8F7C5'], [5.2, 'c', '#FFFFFF'], [6.8, 'k', '#B98CFF'], [8.4, 'b'], [10, 'c', '#FFB3E6']];
    goods.forEach(([x, k, c]) => { if (k === 'c') cupcake(x, 2.12, -9.6, 0.9, c, far); else if (k === 'k') { const st = group(x, 2.12, -9.6, far); mesh(G.cyl, pm('#FFFFFF', { clearcoat: 1 }), 0, 0.02, 0, 0.6, 0.04, 0.6, st); cookie(0, 0.05, 0, 1.2, c, st); cookie(0.1, 0.2, 0.05, 1.1, c === '#FFD23F' ? '#FF6FA3' : '#FFD23F', st); } else challah(x, 2.12, -9.6, 1.2, far); });
    /* a big layer cake on a stand */
    const ck = group(-4.6, 2.12, -9.4, far); mesh(G.cyl, pm('#FFFFFF', { clearcoat: 1 }), 0, 0.5, 0, 0.12, 1.0, 0.12, ck); mesh(G.cyl, pm('#FFFFFF', { clearcoat: 1 }), 0, 1.0, 0, 1.0, 0.06, 1.0, ck);
    [['#FF9EBB', 0.85, 0.55], ['#FFF4E2', 0.65, 0.45], ['#9EE2FF', 0.45, 0.4]].forEach(([c, r, h], i) => { const y = 1.05 + [0, 0.55, 1.0][i]; mesh(G.cyl, pm(c, { roughness: 0.4, clearcoat: 0.5 }), 0, y + h / 2, 0, r, h, r, ck); for (let k = 0; k < 10; k++) mesh(G.ballLo, pm('#FFFFFF'), Math.cos(k / 10 * 6.28) * r, y + h, Math.sin(k / 10 * 6.28) * r, 0.08, 0.08, 0.08, ck); });
    mesh(G.ball, pm('#FF3B5C', { clearcoat: 1 }), 0, 2.55, 0, 0.13, 0.13, 0.13, ck); ck.position.y = 2.12; ck.position.x = 1.6;
    /* the oven with a warm glow */
    const ov = group(9, 0, -9.6, far); mesh(G.box, pm('#FFFFFF', { roughness: 0.3 }), 0, 2.0, 0, 3.2, 4.0, 1.6, ov); mesh(G.box, glow('#FF9A3C', 1.6), 0, 1.6, 0.81, 2.2, 1.4, 0.04, ov); mesh(G.box, pm('#E8E2D6', { metalness: 0.4 }), 0, 2.55, 0.85, 2.3, 0.12, 0.1, ov);
    [-0.9, -0.3, 0.3, 0.9].forEach(k => mesh(G.cyl, pm('#FF6FA3'), k, 3.5, 0.82, 0.13, 0.08, 0.13, ov).rotation.x = Math.PI / 2); ov.position.set(11.5, 0, -9.4);
    /* shelves of round breads and jars */
    const sh = group(-11.5, 0, -10.2, far); [3, 4.5, 6].forEach(y => mesh(G.box, pm('#E7A867', { roughness: 0.5 }), 0, y, 0, 4, 0.16, 1, sh));
    [3, 4.5, 6].forEach((y, r) => [-1.4, -0.5, 0.4, 1.3].forEach((x, i) => { if ((i + r) % 2) mesh(G.ball, pm('#D98A3A', { clearcoat: 0.6, roughness: 0.4 }), x, y + 0.3, 0, 0.38, 0.28, 0.38, sh); else { mesh(G.cyl, new PM({ color: '#FFFFFF', transmission: 0.6, roughness: 0.1, thickness: 0.2 }), x, y + 0.4, 0, 0.3, 0.65, 0.3, sh); mesh(G.cyl, pm(['#FF6FA3', '#FFC93C', '#7ED6FF'][r]), x, y + 0.78, 0, 0.32, 0.1, 0.32, sh); } }));
    /* the window and the bunting */
    const view = paint(512, 400, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5DB8FF'); g.addColorStop(1, '#D9F2FF'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = '#8FDD7E'; x.beginPath(); x.ellipse(w * 0.3, h, w * 0.5, h * 0.3, 0, 0, 7); x.fill(); x.fillStyle = '#6FCB6A'; x.beginPath(); x.ellipse(w * 0.8, h, w * 0.5, h * 0.25, 0, 0, 7); x.fill(); x.fillStyle = '#FFFFFF'; [[120, 90], [160, 80], [380, 120], [420, 110]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 34, 0, 7); x.fill(); }); });
    mesh(G.plane, new THREE.MeshBasicMaterial({ map: view }), 0, 6.2, -10.95, 6, 3.6, 1, far).castShadow = false; mesh(G.box, pm('#FFFFFF'), 0, 6.2, -10.98, 6.5, 4.1, 0.1, far); mesh(G.box, pm('#FFFFFF'), 0, 6.2, -10.9, 0.15, 3.6, 0.1, far);
    bunting([-14, 10, -10.8], [14, 10, -10.8], 1.4, ['#FF6FA3', '#FFD23F', '#7ED6FF', '#B98CFF', '#7ED957'], 20, far);
    [[-5, 12, -7], [5, 12, -7]].forEach(([x, y, z]) => { mesh(G.cyl, std('#3A3A4A'), x, y + 1.5, z, 0.02, 3, 0.02, far); const sh2 = mesh(new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), pm('#FFC93C', { side: THREE.DoubleSide }), x, y, z, 1, 1, 1, far); void sh2; mesh(G.ball, glow('#FFF2C8', 2.2), x, y - 0.1, z, 0.35, 0.35, 0.35, far); });
    stage((x, c) => { x.fillStyle = '#FF9EBB'; for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; x.beginPath(); x.arc(c + Math.cos(a) * c * 0.93, c + Math.sin(a) * c * 0.93, c * 0.09, 0, 7); x.fill(); }
      x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(c, c, c * 0.9, 0, 7); x.fill(); x.fillStyle = 'rgba(255,158,187,.35)'; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; x.beginPath(); x.arc(c + Math.cos(a) * c * 0.83, c + Math.sin(a) * c * 0.83, c * 0.025, 0, 7); x.fill(); }
      const g = x.createRadialGradient(c, c, 0, c, c, c * 0.78); g.addColorStop(0, '#FFFDF8'); g.addColorStop(1, '#FFF4E8'); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * 0.78, 0, 7); x.fill(); }, { edge: '#FFD3DF', coat: 0.3 });
    scatter(26, 7.6, 11, 61, (x, z, Rr, i) => { const k = i % 4; if (k === 0) cupcake(x, 0, z, 0.8, ['#FFFFFF', '#FFB3E6', '#BDE8FF'][i % 3], near); else if (k === 1) cookie(x, 0, z, 1.3, ['#FF6FA3', '#FFD23F', '#7ED6FF'][i % 3], near); else if (k === 2) { const b = mesh(new THREE.SphereGeometry(0.6, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), pm(['#7ED6FF', '#FFC93C', '#C8F7C5'][i % 3], { side: THREE.DoubleSide, clearcoat: 1 }), x, 0.6, z, 1, 1, 1, near); void b; } else { const rp = mesh(G.cyl, pm('#E7B57A', { roughness: 0.5 }), x, 0.2, z, 0.18, 1.4, 0.18, near); rp.rotation.z = Math.PI / 2; rp.rotation.y = Rr() * 3; } });
    farify(far);
    motes({ n: 90, colors: ['#FFFFFF', '#FFF0D8'], size: 0.09, box: [-12, 12, 0.6, 7, -9, -1.5], kind: 'drift', seed: 9 });
  }

  /* Unit 5: a starry space playground */
  function space() {
    setEnv({ bg: '#2B1C78', fog: ['#5B3BB0', 40, 120], sun: ['#FFF6EE', 2.6, [-6, 13, 8]], hemi: ['#C8B8FF', '#7A5BD0', 0.75], rim: ['#7FE7FF', 1.2], front: ['#FFD6F5', 0.45], exposure: 0.88, bloom: 0.24,
      box: ['#7A6BFF', '#FFFFFF', '#5A4BD8'], css: '#2B1C78' });
    skyDome('#140C4A', '#3B2391', '#FF8FCB', [0.6, 0.25, -1]);
    const moon = paint(1024, 1024, (x, w) => { x.fillStyle = '#F2B98E'; x.fillRect(0, 0, w, w); const R = rng(13); for (let i = 0; i < 4000; i++) { x.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.25)' : 'rgba(120,90,200,.15)'; x.beginPath(); x.arc(R() * w, R() * w, 1 + R() * 3, 0, 7); x.fill(); }
      for (let i = 0; i < 26; i++) { const cx = R() * w, cy = R() * w, r = 10 + R() * 40; x.fillStyle = 'rgba(214,130,110,.35)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 3; x.beginPath(); x.arc(cx - 2, cy - 2, r, 2.6, 5.6); x.stroke(); } }, { repeat: [12, 12] });
    ground(moon, '#FFFFFF', { sheen: 0.4, sheenColor: '#FFE6DB' });
    const far = group(), near = group();
    /* stars on the dome */
    const SN = 700, sp = new Float32Array(SN * 3), sc = new Float32Array(SN * 3), R = rng(77), cc = new THREE.Color();
    for (let i = 0; i < SN; i++) { const a = R() * Math.PI * 2, e = 0.08 + Math.pow(R(), 0.7) * 1.4, d = 80; sp.set([Math.cos(a) * Math.cos(e) * d, Math.sin(e) * d, Math.sin(a) * Math.cos(e) * d], i * 3); cc.set(['#FFFFFF', '#FFF3B0', '#BDE8FF', '#FFC2E8'][i % 4]); sc.set([cc.r, cc.g, cc.b], i * 3); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('color', new THREE.BufferAttribute(sc, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ map: twinkleTex, size: 1.6, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); far.add(stars); anim.push(t => { stars.rotation.y = t * 0.004; stars.material.opacity = 0.85 + Math.sin(t * 1.7) * 0.15; });
    planet(-22, 16, -50, 7, ['#FF9EBB', '#FFD1E0', '#E86A9A', '#FFE0EA'], '#FFE58A', far); planet(26, 22, -60, 5, ['#7ED6FF', '#C9F1FF', '#3AA8FF'], null, far); planet(8, 30, -70, 3, ['#FFC93C', '#FFE58A', '#FF9A2E'], null, far); planet(-6, 10, -40, 2.2, ['#7ED957', '#C8F7C5', '#3FBF4A'], '#FFFFFF', far);
    const mn = mesh(G.ball, new THREE.MeshStandardMaterial({ color: '#FFF6D8', emissive: '#FFF2C0', emissiveIntensity: 0.9, map: moon }), 34, 26, -55, 6, 6, 6, far); mn.castShadow = false;
    /* the playground: a rocket slide, glowing crystals, round moon rocks, a ringed planet ball */
    rocket(-11, -6, 1.3, far); rocket(12.5, -8, 1.0, far);
    const slide = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-10.2, 4.6, -5.5), new THREE.Vector3(-8.6, 3.0, -4.0), new THREE.Vector3(-7.4, 1.0, -2.4), new THREE.Vector3(-6.6, 0.3, -1.6)]), 40, 0.35, 12), pm('#FFC93C', { clearcoat: 1, roughness: 0.2 })); slide.castShadow = true; far.add(slide);
    [[-8.5, -10, 1.2, '#FF6FA3'], [-6.8, -11, 0.9, '#7FE7FF'], [7.5, -10.5, 1.3, '#B98CFF'], [9.2, -9.6, 0.9, '#FFE58A'], [-13, 2, 1.4, '#7FE7FF'], [13.6, 2.6, 1.3, '#FF6FA3'], [0, -13, 1.1, '#7ED957']].forEach(([x, z, s, c]) => { crystal(x, z, s, c, far); crystal(x + 0.6, z + 0.3, s * 0.6, c, far); crystal(x - 0.5, z + 0.2, s * 0.5, c, far); });
    [[-4, -11.5, 1.0], [4.2, -12, 1.3], [-14, -4, 1.6], [14.5, -3, 1.4]].forEach(([x, z, r]) => mesh(G.ball, pm('#B48AD8', { roughness: 0.8, clearcoat: 0 }), x, r * 0.4, z, r, r * 0.7, r, far));
    const swing = group(10.5, 0, -2, far); mesh(G.torus, pm('#7FE7FF', { clearcoat: 1 }), 0, 3.2, 0, 2.2, 2.2, 2.2, swing).scale.z = 1.4; const seat = group(0, 3.2, 0, swing);
    [-0.4, 0.4].forEach(k => mesh(G.cyl, pm('#FFFFFF'), k, -1.1, 0, 0.03, 2.2, 0.03, seat)); mesh(G.box, pm('#FF6FA3', { clearcoat: 1 }), 0, -2.2, 0, 1.1, 0.12, 0.5, seat); anim.push((t, q) => { if (q >= 1) seat.rotation.x = Math.sin(t * 1.1) * 0.25; });
    farify(far);
    stage(ringStage([[1.0, '#FFFFFF'], [0.97, '#7FE7FF'], [0.93, '#FFFFFF'], [0.9, '#FF9EDB'], [0.86, '#FFFFFF'], [0.84, '#B9A8FF'], [0.79, '#FBF8FF']], ['#FFFFFF', '#F1EBFF']), { edge: '#B9A8FF', sheenColor: '#F3EEFF' });
    const ring = mesh(new THREE.TorusGeometry(6.75, 0.07, 10, 160), new THREE.MeshStandardMaterial({ color: '#7FE7FF', emissive: '#7FE7FF', emissiveIntensity: 2.0 }), 0, 0.1, 0, 1, 1, 1); ring.rotation.x = Math.PI / 2; ring.castShadow = false;
    scatter(36, 7.5, 12, 71, (x, z, Rr, i) => { if (i % 3) crystal(x, z, 0.35 + Rr() * 0.3, ['#FF6FA3', '#7FE7FF', '#B98CFF', '#FFE58A'][i % 4], near); else mesh(G.ball, pm('#A893E8', { roughness: 0.8, clearcoat: 0 }), x, 0.05, z, 0.35, 0.2, 0.35, near); });
    motes({ n: 140, colors: ['#FFFFFF', '#FFF3B0', '#BDE8FF', '#FFC2E8'], size: 0.14, box: [-13, 13, 0.6, 8, -14, -1.5], kind: 'twinkle', seed: 15, tex: twinkleTex });
  }

  /* Unit 6: a sunny beach with sandcastles */
  function beach() {
    setEnv({ bg: '#A9E2FF', fog: ['#CFF0FF', 40, 130], sun: ['#FFF2DA', 2.7, [-6, 13, 8]], hemi: ['#CFEAFF', '#F4D79A', 0.62], rim: ['#FFE0A8', 1.1], front: ['#FFEBD0', 0.35], exposure: 0.84,
      box: ['#3FC3E8', '#FFFFFF', '#2A9FC4'], css: '#A9E2FF' });
    skyDome('#2F8FFF', '#8FD0FF', '#E3F7FF', [-0.5, 0.4, -1]);
    const sand = paint(1024, 1024, (x, w) => { x.fillStyle = '#F7DDA2'; x.fillRect(0, 0, w, w); const R = rng(17); for (let i = 0; i < 30; i++) { x.fillStyle = R() < 0.5 ? 'rgba(255,240,200,.35)' : 'rgba(220,180,110,.18)'; x.beginPath(); x.arc(R() * w, R() * w, 40 + R() * 120, 0, 7); x.fill(); }
      for (let i = 0; i < 16000; i++) { x.fillStyle = ['rgba(200,150,80,.35)', 'rgba(255,255,255,.55)', 'rgba(230,180,110,.4)'][i % 3]; x.fillRect(R() * w, R() * w, 1.5, 1.5); }
      x.strokeStyle = 'rgba(210,165,95,.25)'; x.lineWidth = 3; for (let i = 0; i < 14; i++) { x.beginPath(); const y0 = R() * w; for (let k = 0; k <= 20; k++) x.lineTo(k * w / 20, y0 + Math.sin(k * 0.9 + i) * 8); x.stroke(); } }, { repeat: [14, 14] });
    ground(sand, '#FFFFFF', { sheen: 0.3, sheenColor: '#FFF4DA' });
    const far = group(), near = group();
    /* the sea: turquoise, with moving sparkles and a soft line of foam */
    const seaT = paint(512, 512, (x, w) => { x.fillStyle = '#28C7D9'; x.fillRect(0, 0, w, w); const R = rng(5); for (let i = 0; i < 900; i++) { x.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.55)' : 'rgba(120,240,255,.5)'; x.fillRect(R() * w, R() * w, 6 + R() * 18, 2); } }, { repeat: [10, 10] });
    const sea = mesh(G.plane, new THREE.MeshStandardMaterial({ map: seaT, roughness: 0.15, metalness: 0.1, emissive: '#1AA6C9', emissiveIntensity: 0.25 }), 0, 0.05, -70, 260, 100, 1, far); sea.rotation.x = -Math.PI / 2; sea.castShadow = false;
    const shore = mesh(G.plane, new THREE.MeshStandardMaterial({ color: '#7FE8E8', transparent: true, opacity: 0.8, roughness: 0.3 }), 0, 0.04, -19.5, 260, 3, 1, far); shore.rotation.x = -Math.PI / 2;
    const foam = mesh(G.plane, new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#FFFFFF', emissiveIntensity: 0.3, transparent: true, opacity: 0.9 }), 0, 0.07, -20.6, 260, 0.6, 1, far); foam.rotation.x = -Math.PI / 2;
    anim.push(t => { seaT.offset.set(t * 0.004, t * 0.01); foam.position.z = -20.6 + Math.sin(t * 0.6) * 0.5; shore.position.z = -19.5 + Math.sin(t * 0.6) * 0.5; });
    [[-26, -45, 1], [18, -60, 2], [40, -50, 3]].forEach(([x, z, i]) => { const b = group(x, 0, z, far); mesh(G.box, pm('#FFFFFF', { clearcoat: 1 }), 0, 0.4, 0, 3, 0.6, 1, b); const sl = new THREE.Shape(); sl.moveTo(0, 0); sl.lineTo(1.6, 0); sl.lineTo(0, 3); sl.closePath();
      const s = new THREE.Mesh(new THREE.ShapeGeometry(sl), std(['#FF6FA3', '#FFD23F', '#FF5A5A'][i - 1], { side: THREE.DoubleSide })); s.position.set(-0.2, 0.8, 0); b.add(s); anim.push((t, q) => { if (q >= 1) { b.rotation.z = Math.sin(t * 0.8 + i) * 0.05; b.position.x = x + Math.sin(t * 0.05 + i) * 2; } }); });
    hill(-40, -80, 22, 8, null, '#5FC86A', far); hill(36, -90, 26, 10, null, '#6FD27A', far);
    [[-18, 13, -60, 3, 1], [10, 16, -70, 3.6, 2], [30, 11, -55, 2.6, 3]].forEach(([x, y, z, s, sd]) => { const cl = cloud(x, y, z, s, sd); far.add(cl); });
    /* on the sand: palm trees, umbrellas, sandcastles, buckets, a beach ball */
    palm(-11, -4, 7, far, 0.4); palm(-14, -10, 8.5, far, 0.2); palm(12, -5, 7.5, far, -0.4); palm(15, -11, 8, far, -0.2); palm(-16, 2, 6.5, far, 0.3);
    umbrella(-9, -9.5, 3.4, '#FF5A5A', '#FFFFFF', far); umbrella(9.6, -9, 3.6, '#3AA8FF', '#FFFFFF', far); umbrella(13.4, 3, 3.2, '#FFC93C', '#FF6FA3', far);
    sandcastle(-6.5, -11.5, 1.0, far); sandcastle(6, -12.5, 1.2, far); sandcastle(-12, 4.5, 0.8, far);
    bucket(-4, -10, 1.2, '#FF6FA3', far); bucket(3.2, -10.5, 1.0, '#FFC93C', far); bucket(11, 5.6, 1.1, '#3AA8FF', far);
    const bb = group(-10.6, 0.9, 6, far); mesh(G.ball, pm('#FFFFFF', { clearcoat: 1, roughness: 0.15 }), 0, 0, 0, 0.9, 0.9, 0.9, bb); ['#FF5A5A', '#3AA8FF', '#FFC93C'].forEach((c, i) => bb.add(new THREE.Mesh(new THREE.SphereGeometry(0.91, 32, 16, i * 2.09, 0.9), pm(c, { clearcoat: 1, roughness: 0.15 }))));
    /* sea birds gliding high (simple soft V shapes) */
    for (let i = 0; i < 4; i++) { const b = group(0, 0, 0, far), wm = std('#FFFFFF', { side: THREE.DoubleSide }); [-1, 1].forEach(k => { const w = mesh(G.plane, wm, k * 0.45, 0, 0, 0.9, 0.18, 1, b); w.rotation.z = -k * 0.35; });
      anim.push((t, q) => { const a = t * 0.12 + i * 1.6; b.position.set(Math.cos(a) * (14 + i * 3), 12 + i * 1.5 + Math.sin(t + i) * 0.4, -30 + Math.sin(a) * 8); b.rotation.y = -a; if (q >= 1) b.children.forEach((w, k) => { w.rotation.z = (k ? 1 : -1) * (0.35 + Math.sin(t * 5 + i) * 0.3); }); }); }
    farify(far);
    stage((x, c) => { const cols = ['#3FC3E8', '#FFFFFF', '#FFC93C', '#FFFFFF', '#FF6FA3', '#FFFFFF']; for (let i = 0; i < 48; i++) { x.fillStyle = cols[i % 6]; x.beginPath(); x.moveTo(c, c); x.arc(c, c, c, i / 48 * Math.PI * 2, (i + 1) / 48 * Math.PI * 2); x.fill(); }
      x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(c, c, c * 0.86, 0, 7); x.fill(); const g = x.createRadialGradient(c, c, 0, c, c, c * 0.83); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#F2FBFF'); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * 0.83, 0, 7); x.fill();
      x.strokeStyle = 'rgba(63,195,232,.35)'; x.lineWidth = 5; x.setLineDash([16, 14]); x.beginPath(); x.arc(c, c, c * 0.78, 0, 7); x.stroke(); }, { edge: '#BDEFFF' });
    scatter(40, 7.4, 11.5, 81, (x, z, Rr, i) => { const k = i % 4; if (k === 0) starfish(x, z, 0.7 + Rr() * 0.5, ['#FF8A3D', '#FF6FA3', '#FFC93C'][i % 3], near); else if (k === 1) shell(x, z, 0.7 + Rr() * 0.4, ['#FFFFFF', '#FFD6E0', '#FFE7B0'][i % 3], near); else if (k === 2) { const p = mesh(G.ball, pm('#E9C27F', { roughness: 0.9, clearcoat: 0 }), x, 0.05, z, 0.5 + Rr() * 0.3, 0.18, 0.4, near); void p; } else bucket(x, z, 0.5, ['#FF6FA3', '#3AA8FF', '#7ED957'][i % 3], near); });
    motes({ n: 60, colors: ['#FFFFFF', '#FFF6C8'], size: 0.1, box: [-12, 12, 0.6, 6, -13, -1.5], kind: 'drift', seed: 17 });
  }

  /* Unit 7: an underwater bubble world */
  function underwater() {
    setEnv({ bg: '#2EB8D4', fog: ['#3CC3DA', 14, 55], sun: ['#E6FFFF', 2.2, [-3, 14, 6]], hemi: ['#8FE4F7', '#CDEFF2', 0.6], rim: ['#9CF2FF', 1.5], front: ['#C8FFF4', 0.3], exposure: 0.76, bloom: 0.26, vib: 0.28,
      box: ['#FFC93C', '#FFFFFF', '#E0A52A'], css: '#2EB8D4' });
    skyDome('#BFF6FF', '#4CCDE2', '#2AAFCB', [0, 1, -0.2]);
    const sand = paint(1024, 1024, (x, w) => { x.fillStyle = '#F4E2B6'; x.fillRect(0, 0, w, w); const R = rng(23); for (let i = 0; i < 14000; i++) { x.fillStyle = ['rgba(210,180,120,.35)', 'rgba(255,255,255,.5)', 'rgba(255,220,180,.4)'][i % 3]; x.fillRect(R() * w, R() * w, 1.6, 1.6); }
      x.strokeStyle = 'rgba(200,170,110,.22)'; x.lineWidth = 4; for (let i = 0; i < 18; i++) { x.beginPath(); const y0 = R() * w; for (let k = 0; k <= 20; k++) x.lineTo(k * w / 20, y0 + Math.sin(k * 1.1 + i) * 9); x.stroke(); } }, { repeat: [14, 14] });
    ground(sand, '#D9CFA8', { sheen: 0.3, sheenColor: '#BFF4FF' });
    /* dancing light on the sand (caustics) */
    const caus = paint(512, 512, (x, w) => { x.fillStyle = '#000'; x.fillRect(0, 0, w, w); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 3; const R = rng(4); for (let i = 0; i < 70; i++) { const cx = R() * w, cy = R() * w, r = 18 + R() * 30; x.beginPath(); for (let k = 0; k <= 7; k++) { const a = k / 7 * 6.28; x.lineTo(cx + Math.cos(a) * r * (0.8 + R() * 0.4), cy + Math.sin(a) * r * (0.8 + R() * 0.4)); } x.stroke(); } }, { repeat: [5, 5], srgb: false });
    const cm = new THREE.Mesh(new THREE.CircleGeometry(16, 64), new THREE.MeshBasicMaterial({ map: caus, color: '#9CF6FF', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })); cm.rotation.x = -Math.PI / 2; cm.position.y = 0.115; cm.renderOrder = 2; scene.add(cm);
    anim.push((t, q) => { caus.offset.set(Math.sin(t * 0.13) * 0.3, t * 0.02); cm.visible = q >= 1 && !CALM; });   /* calm (K-CLARITY-RULES 10): no moving light lines on the sand */
    const far = group(), near = group();
    /* coral, seaweed, rocks, a treasure chest, shells */
    const CC = ['#FF6F91', '#FF9A3C', '#B98CFF', '#FFD23F', '#FF5A7A', '#7FE7C4'];
    [[-10, -3, 3.4, 0], [-12.5, -8, 4, 1], [-8, -10.5, 2.8, 2], [10.2, -3.4, 3.6, 3], [12.8, -8.6, 4.2, 4], [8.4, -11, 3, 5], [-14.5, 2.5, 3.2, 2], [14.6, 2.8, 3, 0], [0, -13, 2.6, 3], [-4, -12, 2.2, 1], [4.4, -12.4, 2.4, 4]].forEach(([x, z, h, c]) => coralBranch(x, z, h, CC[c], c + 3, far));
    [[-11, -5.5], [-9, -12], [-6, -10.5], [11.5, -6], [9.5, -12], [6.5, -10], [-15, -1], [15.5, -1], [-2, -12.5], [2, -12.8]].forEach(([x, z], i) => { seaweed(x, z, 3 + (i % 3) * 1.2, ['#2FBF71', '#3FD68A', '#1FA35E'][i % 3], far); seaweed(x + 0.4, z + 0.3, 2.4 + (i % 2), '#4FE39A', far); });
    [[-7, -8.8, 1.2], [7.6, -9.2, 1.0], [-13, 5.5, 1.4], [13, 6, 1.2]].forEach(([x, z, r]) => { const b = mesh(G.ball, pm('#FF8FB1', { roughness: 0.6, clearcoat: 0.3 }), x, r * 0.5, z, r, r * 0.75, r, far); const tex = paint(128, 128, (c, w) => { c.fillStyle = '#FF8FB1'; c.fillRect(0, 0, w, w); c.strokeStyle = '#FF5A88'; c.lineWidth = 5; for (let k = 0; k < 9; k++) { c.beginPath(); for (let j = 0; j <= 12; j++) c.lineTo(j * w / 12, k * 15 + Math.sin(j * 1.6 + k) * 5); c.stroke(); } }); b.material = new PM({ map: tex, roughness: 0.6, clearcoat: 0.3 }); });
    const ch = group(11, 0, -5, far); ch.rotation.y = -0.5; mesh(G.box, pm('#B5703A', { roughness: 0.5 }), 0, 0.6, 0, 2, 1.2, 1.3, ch); const lid = group(0, 1.2, -0.65, ch); mesh(new THREE.CylinderGeometry(0.65, 0.65, 2, 24, 1, false, 0, Math.PI), pm('#B5703A'), 0, 0, 0.65, 1, 1, 1, lid).rotation.z = Math.PI / 2; lid.rotation.x = -0.7;
    [-0.8, 0, 0.8].forEach(k => mesh(G.box, pm('#FFC93C', { metalness: 0.6, roughness: 0.25 }), k, 0.6, 0, 0.14, 1.25, 1.35, ch)); for (let i = 0; i < 8; i++) mesh(G.cyl, glow('#FFD23F', 0.9), (i % 4 - 1.5) * 0.4, 1.25, (Math.floor(i / 4) - 0.5) * 0.4, 0.16, 0.05, 0.16, ch);
    /* sunbeams from far above */
    const beamT = paint(64, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); const e = x.createLinearGradient(0, 0, w, 0); e.addColorStop(0, 'rgba(0,0,0,1)'); e.addColorStop(0.35, 'rgba(0,0,0,0)'); e.addColorStop(0.65, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = e; x.fillRect(0, 0, w, h); }, { srgb: false });
    [[-8, -14, 3, 0.16], [-2, -16, 4, 0.2], [5, -13, 2.6, 0.14], [11, -17, 3.6, 0.18]].forEach(([x, z, w, op], i) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(w, 30), new THREE.MeshBasicMaterial({ map: beamT, color: '#E8FFFF', transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); b.position.set(x, 15, z); b.rotation.z = 0.25; far.add(b); anim.push((t) => { b.material.opacity = op * (0.7 + 0.3 * Math.sin(t * 0.5 + i * 1.9)); }); });
    fishSchool(0, 5, -10, 9, 9, ['#FFC93C', '#FF8A3D', '#FFFFFF'], 0.22, far); fishSchool(-6, 7, -20, 7, 7, ['#7FE7FF', '#3AA8FF'], -0.18, far); fishSchool(8, 3, -4, 6, 5, ['#FF6FA3', '#FFD23F'], 0.3, far);
    farify(far);
    stage((x, c) => { const g = x.createRadialGradient(c, c, 0, c, c, c); g.addColorStop(0, '#F4FBF9'); g.addColorStop(0.75, '#EDEBD6'); g.addColorStop(0.9, '#8FE3E8'); g.addColorStop(1, '#4CC9D8'); x.fillStyle = g; x.fillRect(0, 0, 2 * c, 2 * c);
      const R = rng(9); for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2 + R() * 0.05, r = c * 0.9; x.fillStyle = ['#FFFFFF', '#FFD6E0', '#FFE7B0', '#C9F3FF'][i % 4]; x.beginPath(); x.ellipse(c + Math.cos(a) * r, c + Math.sin(a) * r, c * 0.04, c * 0.03, a, 0, 7); x.fill(); } }, { edge: '#F4E2B6', sheen: 0.3 });
    scatter(46, 7.2, 11.5, 91, (x, z, Rr, i) => { const k = i % 5; if (k === 0) starfish(x, z, 0.6 + Rr() * 0.4, ['#FF8A3D', '#FF6FA3', '#B98CFF'][i % 3], near); else if (k === 1) shell(x, z, 0.6 + Rr() * 0.4, ['#FFFFFF', '#FFD6E0', '#FFE7B0'][i % 3], near); else if (k === 2) seaweed(x, z, 1.2 + Rr(), '#3FD68A', near); else if (k === 3) coralBranch(x, z, 1.1, CC[i % 6], i, near); else mesh(G.ball, pm('#9FB7C9', { roughness: 0.8, clearcoat: 0 }), x, 0.08, z, 0.35, 0.22, 0.3, near); });
    motes({ n: 130, colors: ['#FFFFFF', '#DFFBFF'], size: 0.22, box: [-12, 12, 0.2, 10, -14, -1.5], kind: 'rise', speed: 0.035, seed: 19, tex: bubbleTex(), add: false, opacity: 0.85 });
  }
  let bubbleT = null; function bubbleTex() { return bubbleT || (bubbleT = paint(64, 64, (x) => { x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 3; x.beginPath(); x.arc(32, 32, 26, 0, 7); x.stroke(); const g = x.createRadialGradient(32, 32, 0, 32, 32, 28); g.addColorStop(0, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(200,250,255,.35)'); x.fillStyle = g; x.beginPath(); x.arc(32, 32, 26, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.ellipse(22, 20, 7, 4, -0.6, 0, 7); x.fill(); })); }

  /* Unit 8: a toy train town */
  function traintown() {
    setEnv({ bg: '#BDE6FF', fog: ['#D9F0FF', 34, 120], sun: ['#FFF1D6', 2.6, [-6, 13, 8]], hemi: ['#CFE8FF', '#7FCB6A', 0.6], rim: ['#FFD2A0', 1.1], front: ['#FFE9D2', 0.35], exposure: 0.84,
      box: ['#FF5A5A', '#FFFFFF', '#D8403F'], css: '#BDE6FF' });
    skyDome('#3E9BFF', '#8FCBFF', '#E6F6FF', [0.5, 0.4, -1]);
    ground(grassTex('#62CF55', '#3BA845', '#A0EA74', ['#FFFFFF', '#FFD84D', '#FF8FB1'], 14), '#FFFFFF', { sheen: 0.5, sheenColor: '#D8FFB0' });
    const far = group(), near = group();
    const path = new THREE.CatmullRomCurve3([[-12, -4], [-9, -11], [0, -12.6], [9, -11], [12, -4], [11, 3], [0, 9.5], [-11, 3]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true, 'centripetal');
    track(path, near); train(path, ['#FF5A5A', '#3AA8FF', '#FFC93C', '#4CD964', '#B98CFF'], near);
    /* a puff of steam now and then */
    const puffs = []; for (let i = 0; i < 6; i++) { const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#FFFFFF', transparent: true, opacity: 0, depthWrite: false })); scene.add(p); puffs.push(p); }
    anim.push((t, q) => { const u = ((t * 0.018) % 1 + 1) % 1, p0 = path.getPointAt(u); puffs.forEach((p, i) => { const k = ((t * 0.5 + i / puffs.length) % 1); p.position.set(p0.x, 1.6 + k * 2.4, p0.z); p.scale.setScalar(0.4 + k * 1.2); p.material.opacity = q >= 1 ? (1 - k) * 0.7 : 0; }); });
    const roofs = ['#FF5A5A', '#3AA8FF', '#FFC93C', '#B98CFF', '#4CD964', '#FF8A3D'], walls = ['#FFF4E2', '#FFE3EC', '#E3F4FF', '#FFF7C8', '#E8FFE3'];
    [[-15, -6, 2.2, 2.2, 0.4], [-16.5, 0, 2.0, 2.0, 0.6], [-13, -13, 2.4, 2.8, 0.2], [-7, -16, 2.2, 2.4, 0], [7.5, -16, 2.4, 2.6, 0], [13.5, -13, 2.2, 2.4, -0.2], [15.5, -6, 2.2, 2.2, -0.4], [16.5, 0.5, 2.0, 2.2, -0.6], [-3, -17.5, 2, 2.2, 0], [3, -18, 2.2, 2.6, 0]].forEach(([x, z, w, h, r], i) => house(x, z, w, h, walls[i % 5], roofs[i % 6], far, r));
    /* the clock tower (no numbers) */
    const tw = group(0, 0, -21, far); mesh(G.box, pm('#FFE3C2'), 0, 3, 0, 2.2, 6, 2.2, tw); mesh(new THREE.ConeGeometry(1.8, 2.4, 4), pm('#3AA8FF', { clearcoat: 1 }), 0, 7.2, 0, 1, 1, 1, tw).rotation.y = Math.PI / 4;
    mesh(G.cyl, pm('#FFFFFF'), 0, 4.6, 1.12, 0.75, 0.08, 0.75, tw).rotation.x = Math.PI / 2; const hand1 = mesh(G.box, std('#2A2F45'), 0, 4.6, 1.2, 0.06, 0.55, 0.03, tw), hand2 = mesh(G.box, std('#2A2F45'), 0, 4.6, 1.21, 0.05, 0.4, 0.03, tw);
    hand1.geometry = hand1.geometry.clone().translate(0, 0.4, 0); hand2.geometry = hand2.geometry.clone().translate(0, 0.4, 0); anim.push(t => { hand1.rotation.z = -t * 0.2; hand2.rotation.z = -t * 0.02; });
    [[-10.5, -9, 4, '#5ED36A', 1], [10.5, -9.5, 4.2, '#4CC85A', 2], [-18, -10, 5, '#5ED36A', 3], [18, -10, 5, '#7FD9A0', 4], [-6, -20, 4.4, '#4CC85A', 5], [6, -21, 4.6, '#5ED36A', 6], [-14, 5.5, 3.6, '#7FD9A0', 7], [14, 6, 3.8, '#5ED36A', 8]].forEach(([x, z, h, c, sd]) => roundTree(x, z, h, c, null, sd, far));
    hill(-28, -45, 18, 9, null, '#8FDD7E', far); hill(0, -55, 24, 11, null, '#A6E58A', far); hill(28, -45, 18, 9, null, '#8FDD7E', far);
    /* a bridge over a little blue stream at the back */
    const st = mesh(G.plane, new THREE.MeshStandardMaterial({ color: '#5CC8FF', roughness: 0.15, emissive: '#2A9CE0', emissiveIntensity: 0.2 }), 0, 0.03, -27, 80, 3, 1, far); st.rotation.x = -Math.PI / 2; st.castShadow = false;
    const br = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.35, 12, 40, Math.PI), pm('#FF8A3D', { clearcoat: 1 })); br.position.set(9, 0, -27); far.add(br);
    [[-18, 16, -55, 3.2, 1], [10, 20, -65, 4, 2], [30, 14, -50, 2.8, 3]].forEach(([x, y, z, s, sd]) => far.add(cloud(x, y, z, s, sd)));
    farify(far);
    stage(ringStage([[1.0, '#FFFFFF'], [0.965, '#FF5A5A'], [0.92, '#FFFFFF'], [0.9, '#3AA8FF'], [0.855, '#FFFFFF'], [0.835, '#FFC93C'], [0.78, '#FFFBF2']], ['#FFFFFF', '#FFF5E6']), { edge: '#FFE3C2', r: 6.6 });
    scatter(50, 7.2, 10.5, 101, (x, z, Rr, i) => { if (Math.abs(path.getPointAt(0).z) && i % 2) tuft(x, z, 0.9 + Rr() * 0.6, '#3FBF4A', near); else bloomFlower(x, z, 1 + Rr() * 0.6, ['#FFFFFF', '#FF8FB1', '#FFD84D'][i % 3], near); });
    motes({ n: 80, colors: ['#FFFFFF', '#FFF6C8'], size: 0.1, box: [-12, 12, 0.6, 7, -13, -1.5], kind: 'drift', seed: 21 });
  }

  /* Unit 9: a bright, friendly jungle */
  function jungle() {
    setEnv({ bg: '#A8E6C8', fog: ['#BFF0D6', 26, 90], sun: ['#FFF4D2', 2.6, [-5, 13, 8]], hemi: ['#D6FFE8', '#4FA35A', 0.65], rim: ['#FFE7A0', 1.2], front: ['#F2FFE0', 0.35], exposure: 0.86,
      box: ['#FF8A3D', '#FFFFFF', '#E06A1F'], css: '#A8E6C8' });
    skyDome('#4FB6FF', '#A7E3FF', '#E6FFF2', [-0.3, 0.5, -1]);
    const leafT = paint(1024, 1024, (x, w) => { x.fillStyle = '#4CBF4A'; x.fillRect(0, 0, w, w); const R = rng(29); for (let i = 0; i < 700; i++) { const cx = R() * w, cy = R() * w, s = 10 + R() * 18, a = R() * 6.28; x.save(); x.translate(cx, cy); x.rotate(a); x.fillStyle = ['#3BA845', '#5ED36A', '#2E9E44', '#7ADF6A'][i % 4]; x.beginPath(); x.ellipse(0, 0, s, s * 0.45, 0, 0, 7); x.fill(); x.restore(); }
      for (let i = 0; i < 120; i++) { x.fillStyle = ['#FF6FA3', '#FFD23F', '#FF8A3D', '#FFFFFF'][i % 4]; x.beginPath(); x.arc(R() * w, R() * w, 4, 0, 7); x.fill(); } }, { repeat: [14, 14] });
    ground(leafT, '#FFFFFF', { sheen: 0.5, sheenColor: '#C8FFB0' });
    const far = group(), near = group();
    const LC = ['#2FBF55', '#3FD06A', '#25A84A', '#5ED36A'];
    [[-10, -3, 4.2, 0.6], [-12, -7, 5.4, 0.3], [-9, -10, 3.6, 0.1], [-14, 1.5, 4.6, 0.9], [10, -3, 4.4, -0.6], [12.4, -7.5, 5.6, -0.3], [9.2, -10.5, 3.8, -0.1], [14.4, 2, 4.8, -0.9], [-4.5, -11.5, 3.2, 0], [4.5, -12, 3.4, 0], [0, -13.5, 3.8, 0]].forEach(([x, z, h, r], i) => { bigLeaf(x, z, h, LC[i % 4], r, far); bigLeaf(x + 0.8, z - 0.6, h * 0.8, LC[(i + 1) % 4], r + 0.6, far); });
    palm(-16, -12, 9, far, 0.3); palm(16, -13, 9.5, far, -0.3); palm(-7, -18, 8, far, 0.1); palm(8, -19, 8.5, far, -0.1);
    /* hibiscus flowers */
    [[-8, -7, '#FF4E6A'], [8.4, -7.4, '#FF8A3D'], [-12, 4, '#FFD23F'], [12.4, 4.2, '#FF6FA3'], [-2.5, -11, '#FF6FA3'], [2.8, -11.4, '#FFD23F']].forEach(([x, z, c], i) => flower(x, z, 1.6, c, '#FFF2B0', 5, 0.42, far, 30 + i));
    /* the waterfall and its pool */
    const cliff = mesh(new THREE.CylinderGeometry(9, 11, 14, 12, 3), new THREE.MeshStandardMaterial({ color: '#7FAF6A', roughness: 0.9, flatShading: true }), 0, 5, -32, 1, 1, 1, far); cliff.castShadow = false;
    waterfall(0, -0.5, -23.2, 4, 12, far); const pool = mesh(G.disc, new THREE.MeshStandardMaterial({ color: '#4FD8F0', roughness: 0.1, emissive: '#2AB8E0', emissiveIntensity: 0.25 }), 0, 0.05, -21.5, 5, 2.4, 1, far); pool.rotation.x = -Math.PI / 2;
    /* vines hanging from above (seen in the close-ups) */
    for (let i = 0; i < 9; i++) { const x = -14 + i * 3.5 + (i % 2) * 0.8, z = -9 - (i % 3) * 3, len = 4 + (i % 4) * 1.5, pts = []; for (let k = 0; k <= 10; k++) pts.push(new THREE.Vector3(x + Math.sin(k * 0.6 + i) * 0.3, 16 - k / 10 * len, z));
      const v = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.06, 6), pm('#3FA34A')); far.add(v); for (let k = 2; k < 10; k += 2) mesh(G.ball, pm('#4FC45A', { clearcoat: 0.5 }), pts[k].x + 0.15, pts[k].y, z, 0.22, 0.1, 0.12, far); }
    parrot(-10, 4.4, -9, 1.1, '#FF4E50', '#3AA8FF', far); parrot(10.5, 4.8, -9.5, 1.1, '#3AA8FF', '#FFD23F', far); parrot(-5, 7, -18, 1.3, '#FFD23F', '#4CD964', far); parrot(6, 8, -19, 1.3, '#FF4E50', '#FFD23F', far);
    butterflies(6, ['#3AA8FF', '#FF6FA3', '#FFC93C', '#B98CFF', '#FF8A3D', '#7FE7FF'], [[-8, 3, -6, 2.4], [8, 3.4, -6, 2.2], [0, 5, -10, 3], [-11, 2.5, 1, 1.8], [11, 2.8, 1, 2], [0, 6, -16, 4]]);
    farify(far);
    stage((x, c) => { x.fillStyle = '#E3B27A'; x.fillRect(0, 0, 2 * c, 2 * c); x.fillStyle = '#C98A4E'; x.beginPath(); x.arc(c, c, c, 0, 7); x.fill(); x.fillStyle = '#F2CB92'; x.beginPath(); x.arc(c, c, c * 0.94, 0, 7); x.fill();
      x.strokeStyle = 'rgba(190,130,70,.35)'; x.lineWidth = 4; for (let r = 0.12; r < 0.92; r += 0.075) { x.beginPath(); x.arc(c, c, c * r, 0, 7); x.stroke(); } const g = x.createRadialGradient(c, c, 0, c, c, c * 0.9); g.addColorStop(0, 'rgba(255,248,230,.85)'); g.addColorStop(1, 'rgba(255,240,210,.35)'); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * 0.9, 0, 7); x.fill(); }, { edge: '#B8773E', sheen: 0.3, h: 0.1 });
    scatter(50, 7.2, 11.5, 111, (x, z, Rr, i) => { const k = i % 4; if (k < 2) tuft(x, z, 1.0 + Rr() * 0.6, ['#2FBF55', '#3FD06A'][k], near); else if (k === 2) bloomFlower(x, z, 1.1 + Rr() * 0.6, ['#FF4E6A', '#FFD23F', '#FF8A3D', '#FF6FA3'][i % 4], near); else mushroom(x, z, 0.4 + Rr() * 0.2, '#FF8A3D', near); });
    motes({ n: 90, colors: ['#FFFFFF', '#FFF6C8', '#E0FFD0'], size: 0.11, box: [-12, 12, 0.6, 7, -13, -1.5], kind: 'drift', seed: 23 });
  }

  /* Unit 10: a winter wonderland */
  function snow() {
    setEnv({ bg: '#CFEAFF', fog: ['#E8F4FF', 30, 110], sun: ['#FFF0DC', 2.2, [-6, 12, 8]], hemi: ['#BFDFFF', '#9FB8E0', 0.55], rim: ['#FFD6E6', 1.2], front: ['#FFEFE0', 0.3], exposure: 0.76, vib: 0.3,
      box: ['#FF5A5A', '#FFFFFF', '#D8403F'], css: '#CFEAFF' });
    skyDome('#5BA8FF', '#A8D6FF', '#FFE3EE', [-0.5, 0.3, -1]);
    const snowT = paint(1024, 1024, (x, w) => { x.fillStyle = '#EAF3FF'; x.fillRect(0, 0, w, w); const R = rng(31); for (let i = 0; i < 40; i++) { x.fillStyle = R() < 0.5 ? 'rgba(200,220,255,.25)' : 'rgba(255,255,255,.6)'; x.beginPath(); x.arc(R() * w, R() * w, 40 + R() * 140, 0, 7); x.fill(); }
      for (let i = 0; i < 2600; i++) { x.fillStyle = ['rgba(180,205,255,.5)', 'rgba(255,255,255,1)', 'rgba(210,230,255,.6)'][i % 3]; x.beginPath(); x.arc(R() * w, R() * w, 0.8 + R() * 1.6, 0, 7); x.fill(); } }, { repeat: [12, 12] });
    ground(snowT, '#FFFFFF', { sheen: 0.8, sheenColor: '#E6F2FF', coat: 0.3 });
    const far = group(), near = group();
    [[-10, -3, 5, 1], [-12.5, -8, 7, 0], [-9, -11, 3.6, 1], [-15, 1.5, 6, 1], [10, -3, 4.4, 1], [12.6, -8.5, 7.5, 0], [9, -11.5, 3.2, 1], [15, 2, 5.4, 1], [-5, -13, 4.5, 1], [5, -13.5, 5.5, 1], [-18, -14, 9, 1], [18, -15, 8.5, 1]].forEach(([x, z, h, s], i) => pine(x, z, h, ['#2E9E5A', '#3BB36A', '#26875A'][i % 3], s, far));
    snowman(-7, -9, 1.0, '#FF5A5A', far); snowman(7.5, -9.6, 0.75, '#3AA8FF', far); snowman(-12.5, 4.5, 0.6, '#FFC93C', far);
    cabin(12.5, -16, 1.4, far, -0.4); const smoke = []; for (let i = 0; i < 5; i++) { const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#FFFFFF', transparent: true, opacity: 0.5, depthWrite: false })); far.add(p); smoke.push(p); }
    anim.push((t, q) => smoke.forEach((p, i) => { const k = (t * 0.12 + i / 5) % 1; p.position.set(12.5 + 1.2 + k * 1.2, 5.6 + k * 4, -16.6); p.scale.setScalar(0.6 + k * 1.8); p.material.opacity = q >= 1 ? (1 - k) * 0.6 : 0; }));
    const pond = mesh(G.disc, new PM({ color: '#BFE6FF', roughness: 0.05, clearcoat: 1, metalness: 0.1 }), -10, 0.03, -17, 5, 2.4, 1, far); pond.rotation.x = -Math.PI / 2; pond.castShadow = false;
    const sled = group(10.5, 0, 4.5, far); sled.rotation.y = -0.6; mesh(G.box, pm('#FF5A5A', { clearcoat: 1 }), 0, 0.45, 0, 1.6, 0.12, 0.8, sled); [-0.35, 0.35].forEach(k => { const r = mesh(G.torus, pm('#FFC93C', { metalness: 0.5 }), 0.2, 0.25, k, 0.6, 0.25, 0.1, sled); r.scale.set(1.1, 0.4, 0.2); });
    hill(-26, -40, 16, 7, null, '#FFFFFF', far); hill(0, -50, 22, 10, null, '#F4F9FF', far); hill(28, -42, 18, 8, null, '#FFFFFF', far);
    [[-18, 15, -55, 3, 1], [12, 19, -62, 3.6, 2]].forEach(([x, y, z, s, sd]) => far.add(cloud(x, y, z, s, sd)));
    farify(far);
    stage((x, c) => { const g = x.createRadialGradient(c * 0.8, c * 0.7, 0, c, c, c); g.addColorStop(0, '#E6F5FF'); g.addColorStop(0.7, '#BFE4FF'); g.addColorStop(1, '#8CCBFF'); x.fillStyle = g; x.fillRect(0, 0, 2 * c, 2 * c);
      x.strokeStyle = '#FF6F91'; x.lineWidth = 14; x.beginPath(); x.arc(c, c, c * 0.96, 0, 7); x.stroke(); x.strokeStyle = '#FFFFFF'; x.lineWidth = 8; x.beginPath(); x.arc(c, c, c * 0.93, 0, 7); x.stroke(); x.strokeStyle = 'rgba(70,140,230,.55)'; x.lineWidth = 4; x.beginPath(); x.arc(c, c, c * 0.88, 0, 7); x.stroke();
      const R = rng(33); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2; for (let i = 0; i < 30; i++) { const a = R() * 6.28, r = R() * c * 0.8; x.beginPath(); x.arc(c, c, r, a, a + 0.6 + R()); x.stroke(); }
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28, px = c + Math.cos(a) * c * 0.915, py = c + Math.sin(a) * c * 0.915; x.strokeStyle = '#8FC6FF'; x.lineWidth = 3; for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(px - Math.cos(k * 1.05) * 10, py - Math.sin(k * 1.05) * 10); x.lineTo(px + Math.cos(k * 1.05) * 10, py + Math.sin(k * 1.05) * 10); x.stroke(); } } }, { edge: '#D6ECFF', coat: 0.8, sheen: 0.4 });
    scatter(44, 7.4, 11.5, 121, (x, z, Rr, i) => { const k = i % 4; if (k < 2) pine(x, z, 0.9 + Rr() * 0.9, '#3BB36A', true, near); else if (k === 2) mesh(G.ball, pm('#FFFFFF', { roughness: 0.6, sheen: 0.6 }), x, 0.1, z, 0.5 + Rr() * 0.3, 0.3, 0.45, near); else mesh(G.ball, pm('#FFFFFF', { roughness: 0.6, sheen: 0.6 }), x, 0.22, z, 0.26, 0.24, 0.26, near); });   /* snowballs (no stray toy blocks) */
    motes({ n: 220, colors: ['#FFFFFF'], size: 0.13, box: [-14, 14, 0.1, 10, -16, -1], kind: 'fall', speed: 0.025, seed: 25, add: false, opacity: 0.95 });
  }

  /* Unit 11: a sunny farm */
  function farm() {
    setEnv({ bg: '#BDE6FF', fog: ['#DAF0FF', 34, 120], sun: ['#FFF0CF', 2.7, [-6, 13, 8]], hemi: ['#CFE8FF', '#86C860', 0.6], rim: ['#FFD6A0', 1.1], front: ['#FFE9D2', 0.35], exposure: 0.84,
      box: ['#FFC93C', '#FFFFFF', '#E0A52A'], css: '#BDE6FF' });
    skyDome('#3E9BFF', '#93CFFF', '#F2F9E6', [-0.5, 0.4, -1]);
    ground(grassTex('#6AD35A', '#41AE45', '#A9EC78', ['#FFFFFF', '#FFE14D'], 16), '#FFFFFF', { sheen: 0.5, sheenColor: '#D8FFB0' });
    const far = group(), near = group();
    barn(-9, -17, 1.5, far, 0.35); windmill(11, -18, 1.4, far);
    fence(-16, -9, -6, -11.5, 8, '#FFFFFF', far); fence(6, -11.5, 16, -9, 8, '#FFFFFF', far);
    hay(-12, -5, 1.2, far, 0.4); hay(-13.6, -3.4, 1.0, far, 0.2); hay(12.6, -5, 1.2, far, -0.4);
    [[-9.4, -8.6, 1.4], [-8.2, -9.6, 1.0], [8.6, -9, 1.3], [9.8, -8.2, 0.9], [-12.4, 3.6, 1.6], [12.8, 4, 1.4], [0, -12.6, 1.2], [-1.4, -12.2, 0.9]].forEach(([x, z, s]) => pumpkin(x, z, s, far));
    [[-14, -12, 4.6, 1], [14, -12.5, 4.8, 2], [-17, 1, 4.2, 3], [17, 1.5, 4.4, 4], [-4, -22, 5, 5], [4, -23, 5.2, 6]].forEach(([x, z, h, sd]) => { const tr = roundTree(x, z, h, '#4CC85A', null, sd, far); const R = rng(sd); for (let i = 0; i < 10; i++) { const a = R() * 6.28; mesh(G.ball, pm('#FF3B30', { clearcoat: 1, roughness: 0.2 }), Math.cos(a) * h * 0.36, h * (0.75 + R() * 0.2), Math.sin(a) * h * 0.25 + h * 0.15, h * 0.04, h * 0.04, h * 0.04, tr); } });
    [[-6, -10.5], [-4.6, -11], [5, -10.8], [6.4, -10.2]].forEach(([x, z], i) => flower(x, z, 3 + (i % 2) * 0.6, '#FFD23F', '#8A4E1E', 16, 0.5, far, 50 + i));
    hill(-30, -45, 20, 8, null, '#9DE38A', far); hill(0, -55, 26, 10, null, '#B5EC8F', far); hill(30, -45, 20, 8, null, '#8FDD7E', far);
    const rows = paint(512, 512, (x, w) => { x.fillStyle = '#C8E68A'; x.fillRect(0, 0, w, w); for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#9BD45A' : '#E8F2A0'; x.fillRect(0, i * 32, w, 18); } }, { repeat: [2, 2] }); hill(-14, -34, 12, 4, rows, '#FFFFFF', far);
    [[-18, 16, -55, 3.2, 1], [10, 20, -65, 4, 2], [30, 14, -50, 2.8, 3]].forEach(([x, y, z, s, sd]) => far.add(cloud(x, y, z, s, sd)));
    butterflies(4, ['#FFFFFF', '#FFC93C', '#FF8A3D', '#B98CFF'], [[-8, 3, -6, 2.4], [8, 3.4, -6, 2.2], [0, 5, -11, 3], [0, 6, -16, 4]]);
    farify(far);
    stage((x, c) => { const n = 24; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = (i + j) % 2 ? '#FFFFFF' : ((i % 2) ? '#E46A5E' : '#F4B7AE'); x.fillRect(i * 2 * c / n, j * 2 * c / n, 2 * c / n, 2 * c / n); }
      x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(c, c, c * 0.86, 0, 7); x.fill(); const g = x.createRadialGradient(c, c, 0, c, c, c * 0.84); g.addColorStop(0, '#FFFDF6'); g.addColorStop(1, '#FFF6E2'); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * 0.84, 0, 7); x.fill();
      x.strokeStyle = 'rgba(255,120,110,.4)'; x.lineWidth = 4; x.setLineDash([14, 12]); x.beginPath(); x.arc(c, c, c * 0.8, 0, 7); x.stroke(); }, { edge: '#FFD9D6' });
    scatter(50, 7.2, 11.5, 131, (x, z, Rr, i) => { const k = i % 4; if (k < 2) tuft(x, z, 1 + Rr() * 0.6, ['#3FBF4A', '#58D35A'][k], near); else if (k === 2) bloomFlower(x, z, 1 + Rr() * 0.6, ['#FFFFFF', '#FFD84D'][i % 2], near); else pumpkin(x, z, 0.45 + Rr() * 0.2, near); });
    motes({ n: 80, colors: ['#FFFFFF', '#FFF6C8'], size: 0.12, box: [-12, 12, 0.6, 7, -13, -1.5], kind: 'drift', seed: 27 });
  }

  /* Unit 12: a happy shape party at golden hour */
  function party() {
    setEnv({ bg: '#FFD6C2', fog: ['#FFD9C8', 34, 110], sun: ['#FFE2B8', 2.6, [-8, 10, 6]], hemi: ['#FFE6F2', '#8FCB6A', 0.65], rim: ['#FFB27A', 1.4], front: ['#FFE0D0', 0.4], exposure: 0.86, bloom: 0.34,
      box: ['#B98CFF', '#FFFFFF', '#9467E8'], css: '#FFD6C2' });
    skyDome('#6E8CFF', '#FFB0D4', '#FFD59A', [-0.6, 0.2, -1]);
    ground(grassTex('#6AD35A', '#41AE45', '#B3EE7A', ['#FFFFFF', '#FFE14D', '#FF8FB1'], 18), '#FFFFFF', { sheen: 0.5, sheenColor: '#FFE8C8' });
    const far = group(), near = group();
    const poles = [[-13, -4], [-13, -12], [13, -12], [13, -4]];
    poles.forEach(([x, z]) => { mesh(G.cyl, pm('#FFFFFF', { clearcoat: 1 }), x, 3.5, z, 0.12, 7, 0.12, far); mesh(G.ball, pm('#FFC93C', { clearcoat: 1, metalness: 0.3 }), x, 7.1, z, 0.25, 0.25, 0.25, far); });
    for (let i = 0; i < poles.length - 1; i++) { const a = [poles[i][0], 6.6, poles[i][1]], b = [poles[i + 1][0], 6.6, poles[i + 1][1]]; bunting(a, b, 1.2, ['#FF5A5A', '#FFC93C', '#4CD964', '#3AA8FF', '#B98CFF', '#FF6FA3'], 10, far); lights([a[0], 6.2, a[2]], [b[0], 6.2, b[2]], 1.6, ['#FFF2B0', '#FFD0E8', '#C8F0FF'], 12, far); }
    /* balloon bunches */
    [[-11, -6, ['#FF5A5A', '#FFC93C', '#3AA8FF']], [11, -6.5, ['#B98CFF', '#FF6FA3', '#4CD964']], [-15, 3, ['#FF8A3D', '#FFFFFF', '#FF6FA3']], [15, 3.5, ['#3AA8FF', '#FFC93C', '#FF5A5A']]].forEach(([x, z, cs]) => cs.forEach((c, i) => balloon(x + (i - 1) * 0.6, 4.2 + (i % 2) * 0.6, z + (i % 2) * 0.3, c, 0.6, far)));
    /* gifts with ribbons, and a cake table */
    [[-8, -9.5, 1.1, '#FF6FA3', '#FFFFFF'], [-6.8, -10.6, 0.7, '#3AA8FF', '#FFC93C'], [8.2, -9.8, 1.0, '#FFC93C', '#FF5A5A'], [7, -10.8, 0.75, '#4CD964', '#FFFFFF'], [-12.5, 5.5, 0.9, '#B98CFF', '#FFC93C'], [12.8, 6, 0.8, '#FF5A5A', '#FFFFFF']].forEach(([x, z, s, c, r]) => gift(x, z, s, c, r, far));
    const tb = group(0, 0, -12.5, far); mesh(G.cyl, pm('#FFFFFF', { clearcoat: 0.6 }), 0, 1.0, 0, 2.6, 0.12, 1.3, tb); mesh(G.cyl, pm('#FFFFFF'), 0, 0.5, 0, 0.12, 1.0, 0.12, tb);
    [['#FF9EBB', 0.9, 0.55], ['#FFF4E2', 0.7, 0.45], ['#9EE2FF', 0.5, 0.4]].forEach(([c, r, h], i) => { const y = 1.06 + [0, 0.55, 1.0][i]; mesh(G.cyl, pm(c, { roughness: 0.4, clearcoat: 0.5 }), 0, y + h / 2, 0, r, h, r, tb); });
    [-0.3, 0, 0.3].forEach(k => { mesh(G.cyl, pm('#FFFFFF'), k, 2.65, 0, 0.04, 0.3, 0.04, tb); mesh(G.ball, glow('#FFD27A', 2.4), k, 2.86, 0, 0.05, 0.09, 0.05, tb); });
    cupcake(-1.8, 1.06, 0.2, 0.7, '#FFB3E6', tb); cupcake(1.8, 1.06, 0.2, 0.7, '#BDE8FF', tb);
    /* paper lanterns glowing softly */
    [[-6, 8, -9, '#FF8FB1'], [-2, 8.6, -11, '#FFD27A'], [2, 8.4, -11, '#B98CFF'], [6, 8, -9, '#7ED6FF']].forEach(([x, y, z, c], i) => { const l = mesh(G.ball, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.1, roughness: 0.8 }), x, y, z, 0.6, 0.75, 0.6, far); anim.push((t, q) => { if (q >= 1) l.position.y = y + Math.sin(t * 0.8 + i) * 0.12; }); });
    rainbow(0, -6, -60, 30, far);
    [[-14, -14, 4.2, '#FF8FB1', 1], [14, -14.5, 4.4, '#FFC93C', 2], [-18, -3, 4.8, '#5ED36A', 3], [18, -2.5, 4.6, '#B98CFF', 4]].forEach(([x, z, h, c, sd]) => roundTree(x, z, h, c, null, sd, far));
    hill(-28, -45, 18, 8, null, '#9DE38A', far); hill(28, -48, 20, 9, null, '#8FDD7E', far);
    [[-18, 15, -55, 3, 1, '#FFE0EE'], [12, 19, -62, 3.6, 2, '#FFF0E0'], [30, 12, -50, 2.8, 3, '#FFE0EE']].forEach(([x, y, z, s, sd, c]) => far.add(cloud(x, y, z, s, sd, c)));
    farify(far);
    stage((x, c) => { x.fillStyle = '#7ED957'; x.fillRect(0, 0, 2 * c, 2 * c); x.fillStyle = '#FFC93C'; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; x.beginPath(); x.arc(c + Math.cos(a) * c * 0.94, c + Math.sin(a) * c * 0.94, c * 0.07, 0, 7); x.fill(); }
      x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(c, c, c * 0.92, 0, 7); x.fill(); const cols = ['#FF5A5A', '#FFC93C', '#4CD964', '#3AA8FF', '#B98CFF', '#FF6FA3']; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; x.fillStyle = cols[i % 6]; x.beginPath(); x.arc(c + Math.cos(a) * c * 0.86, c + Math.sin(a) * c * 0.86, c * 0.018, 0, 7); x.fill(); }
      const g = x.createRadialGradient(c, c, 0, c, c, c * 0.82); g.addColorStop(0, '#FFFDF8'); g.addColorStop(1, '#FFF2E6'); x.fillStyle = g; x.beginPath(); x.arc(c, c, c * 0.82, 0, 7); x.fill(); }, { edge: '#FFE3A0', coat: 0.3 });
    scatter(40, 7.2, 11.5, 141, (x, z, Rr, i) => { const k = i % 3; if (k === 0) gift(x, z, 0.4 + Rr() * 0.2, ['#FF6FA3', '#3AA8FF', '#FFC93C', '#4CD964'][i % 4], '#FFFFFF', near); else if (k === 1) bloomFlower(x, z, 1 + Rr() * 0.6, ['#FFFFFF', '#FF8FB1', '#FFD84D'][i % 3], near); else tuft(x, z, 1 + Rr() * 0.5, '#3FBF4A', near); });
    motes({ n: 160, colors: ['#FF5A5A', '#FFC93C', '#4CD964', '#3AA8FF', '#B98CFF', '#FF6FA3', '#FFFFFF'], size: 0.12, box: [-13, 13, 0.3, 9, -14, -1.5], kind: 'fall', speed: 0.02, seed: 29, add: false, opacity: 0.9 });
  }

  /* the automatic test (?fast=1) builds a light world: the sky, ground and stage, without the decorations (quicker on a test machine) */
  /* CALM (Esti, 2026-11-27: "the backgrounds are so busy that it's so hard to focus ... butterflies flying around ... distracting"):
     every world is only its painted picture, its ground and the game. No butterflies, no floating sparkles, no made-in-code trees, flowers or props.
     (?busy=1 shows the old busy world, only for comparing.) */
  const CALM = !/[?&]busy=1/.test(location.search);
  if (CALM) { motes = butterflies = () => {}; }
  if (FAST || CALM) { const stub = (...a) => group(0, 0, 0, a.find(x => x && x.isObject3D));
    puff = cloud = lollipopTree = roundTree = pine = flower = tulip = mushroom = bush = house = balloon = bunting = hill = rainbow = palm = umbrella = sandcastle = bucket = starfish = shell = coralBranch = seaweed = fishSchool = barn = pumpkin = hay = fence = windmill = snowman = cabin = cupcake = cookie = challah = gift = lights = planet = rocket = crystal = bigLeaf = parrot = waterfall = train = track = tuft = bloomFlower = stub; }
  const WORLDS = { playroom, toyland, garden, sky, bakery, space, beach, underwater, traintown, jungle, snow, farm, party };
  /* painted backdrops (v2/app/k-shapes/worlds/*.jpg, painted for us, ground cut away): a big curved picture far behind the 3D world,
     softly blurred like an animated film background. The 3D things in front give depth; far 3D scenery steps aside for the painting.
     g: where its ground line is (0 top .. 1 bottom); y: the height of that line; R / span: how far away and how wide; cut: 3D things wholly behind this line (z) hide. */
  const PAINT = { toyland: {}, garden: {}, sky: { g: 1, y: -7, haze: false }, bakery: { R: 14, span: 2.3, y: -0.4, cut: -7.9 }, space: {}, beach: {}, underwater: {}, traintown: {}, jungle: {}, snow: {}, farm: { cut: -11 }, party: {} };
  function painted(name) {
    const P = PAINT[name]; if (!P || FAST) return;
    /* the painted ground under the toys (worlds/<name>-ground.jpg, seamless): same size of pattern as the drawn one */
    new THREE.TextureLoader().load(new URL('./worlds/' + name + '-ground.jpg', import.meta.url).href, gt => {
      gt.colorSpace = THREE.SRGBColorSpace; gt.anisotropy = ANISO; gt.wrapS = gt.wrapT = THREE.RepeatWrapping;
      const tint = { toyland: '#BFE3AE', garden: '#C6E6B4', sky: '#C2E4AE', traintown: '#C6E6B4', farm: '#C2E2AC', jungle: '#CFE8C0', party: '#A9D898', underwater: '#D4DFD2', space: '#F0E2DC', beach: '#F2E6D6', snow: '#E6EEFF' }[name] || '#FFFFFF';   /* a little deeper, so the bright sun does not wash it out */
      groundMats.forEach(m => { const old = m.map; const t = gt.clone(); if (old) { t.repeat.copy(old.repeat); t.offset.copy(old.offset); } t.needsUpdate = true; m.map = t; m.color.set(tint); m.needsUpdate = true; });
    });
    new THREE.TextureLoader().load(new URL('./worlds/' + name + '.jpg', import.meta.url).href, tex => {
      if (CALM) try {   /* calm (Esti 2026-11-27, "the backgrounds are so busy"): the painting is paler, softer and less colourful, so the game in front is what he sees */
        const im = tex.image, cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height; const cx = cv.getContext('2d');
        cx.filter = 'saturate(0.55) blur(' + Math.max(2, Math.round(im.width / 400)) + 'px)'; cx.drawImage(im, 0, 0); cx.filter = 'none';
        cx.fillStyle = 'rgba(255,255,255,0.38)'; cx.fillRect(0, 0, cv.width, cv.height);
        const soft = new THREE.CanvasTexture(cv); tex = soft;
      } catch (e) {}
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = ANISO; tex.repeat.x = -1; tex.offset.x = 1;
      const R = P.R || 46, span = P.span || 1.55, H = R * span * tex.image.height / tex.image.width, g = P.g || 0.97, y0 = P.y == null ? -2 : P.y;
      const back = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 96, 1, true, Math.PI - span / 2, span), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, color: new THREE.Color(1.1, 1.1, 1.1) }));
      back.position.y = y0 + H * (g - 0.5); back.layers.set(FAR); back.renderOrder = -5; scene.add(back);
      /* the haze where the painting meets the 3D ground takes its colour from the painting */
      let hc = null;
      try { const c = document.createElement('canvas'), w = 64, h = Math.round(64 * tex.image.height / tex.image.width); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(tex.image, 0, 0, w, h);
        const row = Math.max(0, Math.min(h - 1, Math.round(g * h) - 2)), d = x.getImageData(Math.round(w * 0.3), row, Math.round(w * 0.4), 1).data; let r = 0, gg = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; } const n = d.length / 4;
        hc = new THREE.Color().setRGB(r / n / 255, gg / n / 255, b / n / 255, THREE.SRGBColorSpace); } catch (e) {}
      if (hc && P.haze !== false) { scene.fog.color.lerp(hc, 0.6); BG.lerp(hc, 0.6);
        const hz = paint(4, 64, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#000'); gr.addColorStop(0.55, '#555'); gr.addColorStop(1, '#FFF'); x.fillStyle = gr; x.fillRect(0, 0, w, h); }, { srgb: false });
        const band = new THREE.Mesh(new THREE.CylinderGeometry(R - 1.5, R - 1.5, 4.5, 96, 1, true, Math.PI - span / 2 - 0.3, span + 0.6), new THREE.MeshBasicMaterial({ color: hc, alphaMap: hz, transparent: true, depthWrite: false, side: THREE.BackSide, fog: false }));
        band.position.y = 1.0; band.layers.set(FAR); band.renderOrder = -4; scene.add(band); }
      /* far 3D scenery steps aside (the painting has its own) */
      const cut = P.cut || -14, bx = new THREE.Box3();
      scene.children.forEach(c => { if (c === back || noDepth.includes(c) || !(c.layers.mask & 2)) return;
        (c.isGroup ? c.children.slice() : [c]).forEach(o => { bx.setFromObject(o); if (!bx.isEmpty() && bx.max.z < cut) o.visible = false; }); });
      L.painted = name;
    });
  }
  L.buildWorld = () => { (WORLDS[world] || playroom)(); painted(world);
    /* the automatic test (?fast=1): no far scenery (it is only seen softly blurred), so a test machine stays quick. A boy always gets the full world. */
    if (FAST || CALM) scene.children.slice().forEach(c => { if ((c.layers.mask & 2) && !(c.layers.mask & 1) && !noDepth.includes(c)) scene.remove(c); }); };

  /* ================= toy boxes: glossy painted toy chests ================= */
  L.boxMats = () => ({ body: phys(ENV.box[0], { roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1 }), rim: phys(ENV.box[1], { roughness: 0.3, clearcoat: 1 }), inside: std(ENV.box[2], { roughness: 0.8 }) });
  L.emblem = (shape, color, scale) => {   /* the box's shape, raised and glossy, with a white edge */
    const g = new THREE.Group();
    const back = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.1, bevelSegments: 3, curveSegments: 40 }), phys('#FFFFFF', { roughness: 0.3 }));
    const front = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 4, curveSegments: 40 }), L.pieceMat(color));
    front.position.z = 0.05; g.add(back, front); g.scale.setScalar(scale); return g;
  };

  /* ================= characters ================= */
  const MAT = {};
  const mat = (key, make) => MAT[key] || (MAT[key] = make());
  const SKIN = '#F8CFAA';
  function face(g, o) {   /* a gentle face (Esti, 2026-11-26): warm eyes of normal size (no big glassy whites, never staring), soft brows, a small kind smile, rosy cheeks.
                             o: { y, r, hair, glasses, eye } */
    const r = o.r, cy = o.y, onHead = (dx, dy, lift) => Math.sqrt(Math.max(0, r * r - dx * dx - dy * dy)) * 0.985 + (lift || 0);
    const iris = mat('irisG' + o.eye, () => phys(o.eye || '#4A2E1C', { roughness: 0.25, clearcoat: 0.8 }));
    const shine = mat('shine', () => new THREE.MeshBasicMaterial({ color: '#FFFFFF' }));
    const eyes = [];
    [-1, 1].forEach(s => {
      const ex = s * r * 0.3, ey = r * 0.04, e = new THREE.Group(); e.position.set(ex, cy + ey, onHead(ex, ey, -0.012)); e.rotation.y = s * 0.3;
      const ball = new THREE.Mesh(new THREE.SphereGeometry(r * 0.1, 24, 18), iris); ball.scale.set(0.86, 1.08, 0.42); e.add(ball);
      const h1 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.03, 14), shine); h1.position.set(r * 0.028, r * 0.038, r * 0.044); e.add(h1);
      const h2 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.013, 10), shine); h2.position.set(-r * 0.026, -r * 0.036, r * 0.043); e.add(h2);
      g.add(e); eyes.push(e);
      /* a soft, slightly raised brow: friendly, never cross */
      const bpts = []; for (let i = 0; i <= 12; i++) { const u = i / 12 - 0.5, bx = ex + u * r * 0.26, by = r * 0.27 + (0.25 - u * u) * r * 0.12 - s * u * r * 0.02; bpts.push(new THREE.Vector3(bx, cy + by, onHead(bx, by, 0.006))); }
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bpts), 16, r * 0.018, 6, false), mat('browG' + o.hair, () => std(new THREE.Color(o.hair).multiplyScalar(0.8), { roughness: 0.8 }))));
      const ck = new THREE.Mesh(new THREE.CircleGeometry(r * 0.13, 24), mat('cheekG', () => new THREE.MeshBasicMaterial({ color: '#FF9AA6', transparent: true, opacity: 0.3, depthWrite: false })));
      const cx = s * r * 0.5, cyy = -r * 0.17; ck.position.set(cx, cy + cyy, onHead(cx, cyy, 0.01)); ck.rotation.set(0.2, s * 0.55, 0); g.add(ck);
      if (o.glasses) { const gm = mat('glass', () => phys('#2A2F45', { roughness: 0.3, clearcoat: 1 }));
        const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.19, r * 0.026, 10, 32), gm); rim.position.set(ex, cy + ey, onHead(ex, ey, 0.045)); rim.rotation.y = s * 0.3; g.add(rim); }
    });
    if (o.glasses) { const br = new THREE.Mesh(new THREE.CapsuleGeometry(r * 0.02, r * 0.14, 4, 8), MAT.glass); br.rotation.z = Math.PI / 2; br.position.set(0, cy + r * 0.07, onHead(0, r * 0.07, 0.05)); g.add(br); }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(r * 0.075, 16, 12), mat('noseG', () => phys('#F3BE9C', { roughness: 0.55, clearcoat: 0.2 }))); nose.scale.set(1.1, 0.85, 0.7); nose.position.set(0, cy - r * 0.1, onHead(0, -r * 0.1, -0.012)); g.add(nose);
    /* a small, kind, closed smile */
    const mpts = []; for (let i = 0; i <= 16; i++) { const u = i / 16 - 0.5, mx = u * r * 0.26, my = -r * 0.3 - (0.25 - u * u) * r * 0.16; mpts.push(new THREE.Vector3(mx, my, 0)); }
    const mouth = new THREE.Group(); mouth.position.set(0, cy, 0);
    mpts.forEach(p => { p.z = onHead(p.x, p.y, 0.008); });
    mouth.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mpts), 20, r * 0.02, 6, false), mat('smileG', () => std('#B9505F', { roughness: 0.6 }))));
    g.add(mouth);
    return { eyes, mouth };
  }
  function curl(mHair, r) {   /* a peyah: a soft little curl */
    const pts = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 4; pts.push(new THREE.Vector3(Math.cos(a) * r * 0.07, -i / 40 * r * 0.42, Math.sin(a) * r * 0.07)); }
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, r * 0.035, 8, false), mHair);
  }
  function lathe(points, m, seg = 40) { return new THREE.Mesh(new THREE.LatheGeometry(points.map(p => new THREE.Vector2(p[0], p[1])), seg), m); }
  function tzitzis(k, y, spread) {   /* four corners of white strings, peeking out below the shirt */
    const m = mat('tz', () => std('#FFFFFF', { roughness: 0.6 }));
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => { for (let j = 0; j < 3; j++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.42, 5), m); s.position.set(sx * (spread + j * 0.025), y - 0.21, sz * 0.14 + j * 0.01); s.rotation.z = sx * 0.06; k.add(s); } });
  }
  /* a child: Mendy (or a friend). opts: { shirt, hair, glasses, kippah, eye } */
  L.makeKid = (shirt, hair, glasses, opts = {}) => {
    const k = new THREE.Group(), body = new THREE.Group(); k.add(body);
    const add = (o, x, y, z, par) => { o.position.set(x, y, z); o.castShadow = true; (par || body).add(o); return o; };
    const skin = mat('skin', () => new PM({ color: SKIN, roughness: 0.55, sheen: 0.6, sheenColor: new THREE.Color('#FFD7C2'), sheenRoughness: 0.6 }));
    const shirtM = mat('shirt' + shirt, () => new PM({ color: shirt, roughness: 0.7, sheen: 0.8, sheenColor: new THREE.Color('#FFFFFF'), sheenRoughness: 0.7 }));
    const pants = mat('pants', () => new PM({ color: '#2B3656', roughness: 0.75, sheen: 0.5, sheenColor: new THREE.Color('#6D7BA8') }));
    const shoe = mat('shoe', () => phys('#3B2418', { roughness: 0.3, clearcoat: 1 })), hairM = mat('hair' + hair, () => new PM({ color: hair, roughness: 0.6, sheen: 1, sheenColor: new THREE.Color(hair).lerp(new THREE.Color('#FFFFFF'), 0.4), sheenRoughness: 0.4 }));
    const kipM = mat('kip' + (opts.kippah || '#24346E'), () => new PM({ color: '#FFFFFF', map: paint(256, 128, (x, w, h) => { x.fillStyle = opts.kippah || '#24346E'; x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(255,255,255,.10)'; for (let i = 0; i < 64; i++) for (let j = 0; j < 16; j++) x.fillRect(i * 4 + (j % 2) * 2, j * 8, 2, 4);   /* knit stitches */
      x.fillStyle = '#8FB4F0'; x.fillRect(0, h * 0.78, w, h * 0.07); x.fillStyle = '#FFFFFF'; x.fillRect(0, h * 0.88, w, h * 0.04); }), roughness: 0.85, sheen: 0.6, sheenColor: new THREE.Color('#7E8FD0'), sheenRoughness: 0.5 }));
    [-1, 1].forEach(s => { add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 14), shoe), s * 0.19, 0.1, 0.06).scale.set(1, 0.62, 1.45);
      add(new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.3, 6, 14), pants), s * 0.18, 0.42, 0); });
    add(lathe([[0, 0.5], [0.3, 0.52], [0.41, 0.62], [0.42, 0.78], [0.39, 0.86], [0, 0.88]], pants), 0, 0, 0);
    tzitzis(body, 0.86, 0.33);
    const torso = add(lathe([[0, 0.72], [0.43, 0.74], [0.45, 0.9], [0.42, 1.22], [0.36, 1.48], [0.2, 1.62], [0, 1.64]], shirtM), 0, 0, 0);
    const collar = add(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 10, 24), shirtM), 0, 1.6, 0); collar.rotation.x = Math.PI / 2;
    const btnM = mat('btn', () => phys('#E8E2D6'));
    [1.42, 1.22, 1.02].forEach(y => add(new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), btnM), 0, y, Math.sqrt(Math.max(0, 0.42 * 0.42 - 0.01)) - (1.48 - y) * 0.05 + 0.02));
    const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-0.4, 1.46, 0); armR.position.set(0.4, 1.46, 0); body.add(armL, armR);
    [armL, armR].forEach((a, i) => { const s1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.36, 6, 14), shirtM); s1.position.y = -0.26; s1.castShadow = true; a.add(s1);
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), skin); h.position.y = -0.58; h.scale.set(1, 1.05, 0.9); h.castShadow = true; a.add(h);
      const th = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), skin); th.position.set(i ? -0.08 : 0.08, -0.52, 0.06); a.add(th); });
    armL.rotation.z = -0.15; armR.rotation.z = 0.15;
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.16, 16), skin), 0, 1.68, 0);
    const head = new THREE.Group(); head.position.set(0, 2.13, 0); body.add(head);
    const hr = 0.5;   /* a natural child's head (it was bigger, like a doll) */
    const skull = new THREE.Mesh(new THREE.SphereGeometry(hr, 48, 36), skin); skull.scale.set(1.02, 0.96, 0.97); skull.castShadow = true; head.add(skull);
    [-1, 1].forEach(s => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), skin); ear.scale.set(0.5, 1, 0.75); ear.position.set(s * hr * 0.98, -0.03, -0.02); head.add(ear);
      const pe = curl(hairM, hr * 0.8); pe.scale.set(1.5, 1, 1.5); pe.position.set(s * hr * 0.92, -0.08, 0.1); head.add(pe); });
    /* soft hair: a cap that comes down to a natural hairline, and a gentle fringe (no spikes) */
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(hr * 1.035, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), hairM); hairCap.rotation.x = -0.6; hairCap.position.set(0, 0.01, -0.02); hairCap.castShadow = true; head.add(hairCap);
    for (let i = 0; i < 9; i++) { const a = -0.8 + i * 0.2, el = 0.52 - a * a * 0.12, t = new THREE.Mesh(new THREE.SphereGeometry(hr * 0.16, 18, 12), hairM);
      const ca = Math.cos(el); t.position.set(Math.sin(a) * ca * hr * 1.0, Math.sin(el) * hr * 1.0, Math.cos(a) * ca * hr * 1.0); t.scale.set(1.45, 0.5, 0.32);
      t.lookAt(t.position.clone().multiplyScalar(2)); t.rotateZ(a * 0.4); head.add(t); }
    /* a knitted kippah on top, softly patterned (no shiny rim) */
    const kip = new THREE.Mesh(new THREE.SphereGeometry(hr * 1.08, 48, 12, 0, Math.PI * 2, 0, 0.72), kipM); kip.rotation.x = -0.28; kip.position.set(0, 0.02, -0.02); head.add(kip);
    const F = face(head, { y: 0, r: hr, hair, glasses, eye: opts.eye });
    k.userData = { armL, armR, head, body, eyes: F.eyes, blink: 2 + Math.random() * 3, kind: 'kid' };
    k.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(k); L.kids.push(k); return k;
  };
  /* a PAINTED child (Esti chooses between this and the 3D child): illustrated pictures (art/<who>-<pose>.png, transparent) shown as a flat card
     that always faces the camera, with a soft shadow at his feet. Poses: idle, happy, clap, point, talk. Same calm life as the 3D child: breathing,
     a happy hop. If a picture is missing the 3D child is used instead (see kit.js). */
  const texLoader = new THREE.TextureLoader(), paintedTex = {};
  function poseTex(who, pose) { const k = who + '-' + pose; if (!paintedTex[k]) { paintedTex[k] = new Promise(res => texLoader.load('art/' + k + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANISO; res(t); }, undefined, () => res(null))); } return paintedTex[k]; }
  /* which painted boy plays each game's friend: glasses -> Dovid, ginger hair -> Shloimy, Shmuel -> Shmuel, the others shared out by name.
     Only boys whose pictures have arrived and been checked are used. */
  const FRIENDS = ['shmuel', 'dovid', 'shloimy', 'ari', 'avi', 'yossi'];
  L.friendArt = (F) => {
    const has = n => FRIENDS.includes(n);
    if (F.glasses && has('dovid')) return 'dovid';
    if (String(F.hair).toUpperCase() === '#B8642A' && has('shloimy')) return 'shloimy';
    if (F.name === 'Shmuel') return 'shmuel';
    const pool = ['ari', 'avi', 'yossi', 'shmuel'].filter(has), h = [...String(F.name)].reduce((a, c) => a + c.charCodeAt(0), 0);
    return pool[h % pool.length];
  };
  L.paintedReady = (who) => poseTex(who, 'idle').then(t => !!t);
  L.makePaintedKid = (who, height = 2.75) => {
    const k = new THREE.Group(), body = new THREE.Group(); k.add(body);
    const m = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.04, fog: false, side: THREE.DoubleSide, visible: false }), card = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m); body.add(card);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: soft, color: '#5A4030', transparent: true, opacity: 0.32, depthWrite: false, fog: false }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.03; sh.scale.set(1.5, 0.75, 1); sh.renderOrder = 1; k.add(sh);
    let cur = '';
    const pose = (name) => { cur = name; poseTex(who, name).then(t => { if (cur !== name) return; if (!t) { if (name !== 'idle') pose('idle'); return; }
      const a = t.image.width / t.image.height; m.map = t; m.visible = true; m.needsUpdate = true; card.scale.set(height * a, height, 1); card.position.y = height / 2; }); };
    pose('idle');
    const dummy = () => new THREE.Object3D();
    k.userData = { armL: dummy(), armR: dummy(), head: dummy(), body, eyes: [], blink: 9e9, kind: 'kid', painted: true, pose, card, cheerN: 0 };
    card.onBeforeRender = () => { k.updateMatrixWorld(); const q = new THREE.Quaternion(); body.getWorldQuaternion(q); card.quaternion.copy(q.invert().multiply(camera.quaternion)); };
    scene.add(k); L.kids.push(k); return k;
  };
  /* Tatty and Mommy: kind grown-ups who come to see and clap */
  L.makeAdult = (who) => {
    const k = new THREE.Group(), body = new THREE.Group(); k.add(body);
    const add = (o, x, y, z, par) => { o.position.set(x, y, z); o.castShadow = true; (par || body).add(o); return o; };
    const skin = mat('skin', () => phys(SKIN, { roughness: 0.55, clearcoat: 0 }));
    const isT = who === 'tatty', hair = isT ? '#4A2F1E' : '#5A3A28';
    const top = isT ? mat('suit', () => new PM({ color: '#1E2232', roughness: 0.6, sheen: 0.6, sheenColor: new THREE.Color('#5A6488') }))
      : mat('dress', () => new PM({ color: '#4E7FD0', roughness: 0.7, sheen: 0.8, sheenColor: new THREE.Color('#BFD4FF') }));
    const white = mat('shirtW', () => new PM({ color: '#FFFFFF', roughness: 0.7, sheen: 0.6, sheenColor: new THREE.Color('#FFFFFF') }));
    const shoe = mat('shoe', () => phys('#3B2418', { roughness: 0.3, clearcoat: 1 }));
    [-1, 1].forEach(s => add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12), shoe), s * 0.2, 0.09, 0.08).scale.set(1, 0.55, 1.6));
    if (isT) {
      [-1, 1].forEach(s => add(new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 1.0, 6, 14), top), s * 0.2, 0.75, 0));
      add(lathe([[0, 1.25], [0.48, 1.28], [0.5, 1.6], [0.47, 2.2], [0.38, 2.5], [0.2, 2.62], [0, 2.64]], top), 0, 0, 0);
      add(lathe([[0, 2.3], [0.2, 2.32], [0.22, 2.6], [0, 2.63]], white), 0, 0, 0.27).scale.set(1, 1, 0.4);   /* the white shirt at the front */
      tzitzis(body, 1.36, 0.42);
    } else {   /* a long, modest dress, long sleeves */
      add(lathe([[0, 0.2], [0.62, 0.22], [0.58, 0.6], [0.48, 1.4], [0.4, 1.9], [0.38, 2.3], [0.3, 2.55], [0.18, 2.64], [0, 2.66]], top), 0, 0, 0);
      add(new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 8, 48), mat('hem', () => phys('#FFFFFF'))), 0, 0.24, 0).rotation.x = Math.PI / 2;
    }
    const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-0.5, 2.45, 0); armR.position.set(0.5, 2.45, 0); body.add(armL, armR);
    [armL, armR].forEach(a => { const s1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.75, 6, 14), top); s1.position.y = -0.45; s1.castShadow = true; a.add(s1);
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), skin); h.position.y = -0.92; a.add(h); });
    armL.rotation.z = -0.12; armR.rotation.z = 0.12;
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.2, 16), skin), 0, 2.7, 0);
    const head = new THREE.Group(); head.position.set(0, 3.2, 0); body.add(head);
    const hr = 0.48;
    head.add(new THREE.Mesh(new THREE.SphereGeometry(hr, 40, 30), skin));
    [-1, 1].forEach(s => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), skin); ear.scale.set(0.5, 1, 0.75); ear.position.set(s * hr * 0.98, 0, -0.02); head.add(ear); });
    const F = face(head, { y: 0.02, r: hr, hair, eye: isT ? '#3B2A1E' : '#4A6A3A' });
    if (isT) {
      const hairM = mat('hairT', () => phys(hair, { roughness: 0.7, clearcoat: 0 }));
      const beard = new THREE.Mesh(new THREE.SphereGeometry(hr * 0.86, 32, 24, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), hairM); beard.scale.set(1.08, 1.25, 0.95); beard.position.set(0, -0.08, 0.12); head.add(beard);
      F.mouth.position.z += 0.06; F.mouth.position.y += 0.03;   /* his smile shows above the beard */
      const mus = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.22, 4, 10), hairM); mus.rotation.z = Math.PI / 2; mus.position.set(0, -0.16, hr * 0.93); head.add(mus);
      const hatM = mat('hat', () => phys('#15161C', { roughness: 0.45, clearcoat: 0.6 }));
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(hr * 1.5, hr * 1.5, 0.045, 40), hatM); brim.position.y = hr * 0.6; head.add(brim);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(hr * 0.95, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), hatM); crown.scale.set(1, 0.62, 0.92); crown.position.y = hr * 0.62; head.add(crown);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(hr * 0.97, hr * 0.97, 0.08, 40), mat('band', () => std('#2C2E3A'))); band.position.y = hr * 0.62 + 0.04; band.scale.set(1, 1, 0.92); head.add(band);
      [-1, 1].forEach(s => { const pe = curl(hairM, hr * 1.1); pe.position.set(s * hr * 0.9, -0.02, 0.12); head.add(pe); });
    } else {   /* a tichel (head scarf) covering her hair, tied at the back */
      const tM = mat('tichel', () => new PM({ color: '#7A3E8E', roughness: 0.75, sheen: 1, sheenColor: new THREE.Color('#D9A8EA'), sheenRoughness: 0.5 }));
      const cap = new THREE.Mesh(new THREE.SphereGeometry(hr * 1.08, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.62), tM); cap.rotation.x = -0.62; cap.position.set(0, 0.03, -0.03); head.add(cap);
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), tM); knot.scale.set(1.2, 0.9, 0.9); knot.position.set(0, -0.08, -hr * 1.0); head.add(knot);
    }
    k.userData = { armL, armR, head, body, eyes: F.eyes, blink: 1 + Math.random() * 3, kind: 'adult', clap: 0 };
    k.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(k); L.adults.push(k); return k;
  };

  /* ================= shadows that carry colour: a soft glow of each piece's colour on the floor ================= */
  const blobs = new Map(), blobGeo = new THREE.PlaneGeometry(1, 1);
  function blobFor(o) {
    let b = blobs.get(o); if (b) return b;
    const c = new THREE.Color(vivid(o.color)), hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, Math.min(1, hsl.s + 0.1), 0.38);
    b = new THREE.Mesh(blobGeo, new THREE.MeshBasicMaterial({ map: soft, color: c, transparent: true, opacity: 0.4, depthWrite: false, fog: false }));
    b.rotation.x = -Math.PI / 2; b.renderOrder = 1; scene.add(b); blobs.set(o, b); return b;
  }
  const tmpV = new THREE.Vector3();
  function placeBlobs(shapes) {
    blobs.forEach((b, o) => { if (!shapes.includes(o)) { scene.remove(b); b.material.dispose(); blobs.delete(o); } });
    shapes.forEach(o => {
      if (!o.color || o.k && String(o.k).startsWith('stick')) return;
      const b = blobFor(o), live = o.g.parent && o.g.visible && !o.inBox;
      b.visible = !!live; if (!live) return;
      o.g.getWorldPosition(tmpV); const h = Math.max(0, tmpV.y - 0.1), s = o.g.scale.x * (1.9 + h * 0.25);
      b.position.set(tmpV.x + h * 0.12, 0.115, tmpV.z + h * 0.05); b.scale.set(s, s * 0.8, 1); b.material.opacity = Math.max(0.12, 0.5 - h * 0.12);
    });
  }

  /* ================= the glow on the corners he counts ================= */
  L.cornerHalo = () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#FFD84A', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.setScalar(0.34); return s; };

  /* ================= celebration: confetti, stars, twinkles ================= */
  /* each world celebrates in its own way (treasures.js: sprinkles in the bakery ...); gentle, never a hard flash */
  const CEL = TR.celebration, CCOL = CEL ? CEL.colors : TOY, GRAV = CEL && CEL.grav != null ? CEL.grav : 1;
  const CN = 220, conf = new THREE.InstancedMesh(CEL ? CEL.geo() : new THREE.PlaneGeometry(0.13, 0.075), new THREE.MeshStandardMaterial({ roughness: 0.5, side: THREE.DoubleSide }), CN);
  conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage); conf.frustumCulled = false; conf.count = 0; scene.add(conf);
  const cs = Array.from({ length: CN }, () => ({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), q: new THREE.Quaternion(), ax: new THREE.Vector3(), spin: 0 }));
  const cc = new THREE.Color(), cm = new THREE.Matrix4(), cq = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), hid = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < CN; i++) { conf.setColorAt(i, cc.set(CCOL[i % CCOL.length])); conf.setMatrixAt(i, hid); }
  let cNext = 0;
  const sprites = [];
  function sprite(tex, color, add) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending })); s.renderOrder = 5; scene.add(s); return s; }
  L.celebrate = (at, n) => {
    if (FAST) return;
    const k = L.Q >= 2 ? 1 : L.Q === 1 ? 0.6 : 0.3, N = Math.round((n || 26) * 2 * k * (CEL && CEL.n ? CEL.n : 1) * (CALM ? 0.35 : 1));   /* calm: a small, short burst that never covers the pieces he still has to look at */   /* party: fewer, smaller balloons, so they never cover the play */
    for (let i = 0; i < N; i++) { const c = cs[cNext]; cNext = (cNext + 1) % CN; c.life = 1.8 + Math.random() * 0.6;
      c.p.copy(at); const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4; c.v.set(Math.cos(a) * sp, 5 + Math.random() * 5, Math.sin(a) * sp * 0.6);
      c.ax.set(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize(); c.spin = (6 + Math.random() * 10) * (CEL ? CEL.spin : 1); c.q.setFromAxisAngle(c.ax, Math.random() * 6); }
    conf.count = CN;
    const ns = Math.round((CALM ? 5 : 9) * Math.max(0.5, k) * (CEL ? CEL.star : 1)), reach = CALM ? 0.45 : 1;
    for (let i = 0; i < ns; i++) { const s = sprite(starTex, '#FFFFFF', false), a = i / ns * Math.PI * 2;
      L.fx.push({ s, t: 0, life: 1.1, p0: at.clone(), v: new THREE.Vector3(Math.cos(a) * 3.2 * reach, (2.5 + Math.sin(a) * 2.6) * reach, 0.6), size: 0.55 + Math.random() * 0.25, spin: (Math.random() - .5) * 6 }); }
    const ring = sprite(soft, '#FFF0B0', true); L.fx.push({ s: ring, t: 0, life: 0.9, p0: at.clone(), v: new THREE.Vector3(), size: 3.2, ring: true, soft: 0.45 });   /* a soft warm glow, never a hard flash */
  };
  L.sparkle = (at, n) => {
    if (FAST) return;
    for (let i = 0; i < (n || 7); i++) { const s = sprite(twinkleTex, '#FFFFFF', true);
      L.fx.push({ s, t: -i * 0.07, life: 0.75, p0: at.clone().add(new THREE.Vector3((Math.random() - .5) * 1.4, (Math.random() - .2) * 1.0, (Math.random() - .5) * 0.6)), v: new THREE.Vector3(0, 0.6, 0), size: 0.45 + Math.random() * 0.3, tw: true }); }
  };
  function stepFx(dt) {
    let alive = 0;
    for (let i = 0; i < CN; i++) { const c = cs[i]; if (c.life <= 0) continue; alive++; c.life -= dt;
      c.v.y -= 7.5 * dt * GRAV; c.v.multiplyScalar(1 - 1.9 * dt); if (c.v.y < -1.6 * Math.max(0.4, GRAV)) c.v.y = -1.6 * Math.max(0.4, GRAV);   /* paper floats down; bubbles and balloons float up */   /* paper floats down */
      c.p.addScaledVector(c.v, dt); c.p.x += Math.sin(c.life * 5 + i) * 0.6 * dt;
      if (c.p.y < 0.12 && GRAV > 0) { c.p.y = 0.12; c.v.set(0, 0, 0); }
      cq.setFromAxisAngle(c.ax, c.spin * dt); c.q.multiply(cq);
      const s = Math.min(1, c.life / 0.5); cm.compose(c.p, c.q, one.set(s, s, s)); conf.setMatrixAt(i, c.life > 0 ? cm : hid); }
    if (alive || conf.count) { conf.instanceMatrix.needsUpdate = true; if (!alive) conf.count = 0; }
    for (let i = L.fx.length - 1; i >= 0; i--) { const f = L.fx[i]; f.t += dt; if (f.t < 0) { f.s.visible = false; continue; } f.s.visible = true; const k = f.t / f.life;
      if (k >= 1) { scene.remove(f.s); f.s.material.dispose(); L.fx.splice(i, 1); continue; }
      if (f.ring) { f.s.position.copy(f.p0); f.s.scale.setScalar(0.3 + f.size * Math.sqrt(k)); f.s.material.opacity = (1 - k) * (f.soft || 0.9); continue; }
      if (f.tw) { f.s.position.copy(f.p0).addScaledVector(f.v, f.t); const e = Math.sin(Math.PI * k); f.s.scale.setScalar(f.size * e); f.s.material.rotation = k * 2; f.s.material.opacity = e; continue; }
      const e = 1 - Math.pow(1 - k, 3); f.s.position.copy(f.p0).addScaledVector(f.v, e * 0.9); f.s.position.y -= k * k * 0.6;
      f.s.scale.setScalar(f.size * (k < 0.2 ? k / 0.2 * 1.25 : 1.25 - (k - 0.2) * 0.6)); f.s.material.rotation += f.spin * dt; f.s.material.opacity = k < 0.7 ? 1 : (1 - k) / 0.3; }
  }

  /* ================= bouncy motion ================= */
  /* squash and stretch: the object lands, squashes flat, then springs back (o: a THREE.Object3D; s: its normal size) */
  L.squash = (o, s, amt) => { if (FAST) return; s = s == null ? o.scale.x : s; L.springs = L.springs.filter(q => q.o !== o || q.kind !== 'sq'); L.springs.push({ o, kind: 'sq', t: 0, s, a: amt || 0.32, dur: 0.75 }); };
  L.wiggle = (o, amt) => { if (FAST) return; L.springs = L.springs.filter(q => q.o !== o || q.kind !== 'wg'); L.springs.push({ o, kind: 'wg', t: 0, a: amt || 0.12, dur: 0.9, r0: o.rotation.z, s0: o.scale.y }); };
  L.pop = (o, s) => { if (FAST) { o.scale.setScalar(s); return; } L.springs = L.springs.filter(q => q.o !== o); L.springs.push({ o, kind: 'pop', t: 0, s, dur: 0.55 }); };
  function stepSprings(dt) {
    for (let i = L.springs.length - 1; i >= 0; i--) { const q = L.springs[i]; q.t += dt; const k = Math.min(1, q.t / q.dur), d = Math.exp(-5 * k) * (1 - k);
      if (q.kind === 'sq') { const w = Math.cos(k * Math.PI * 4.5) * d * q.a; q.o.scale.set(q.s * (1 + w * 0.6), q.s * (1 - w), q.s * (1 + w * 0.6)); if (k >= 1) q.o.scale.setScalar(q.s); }
      else if (q.kind === 'wg') { q.o.rotation.z = q.r0 + Math.sin(k * Math.PI * 6) * d * q.a; q.o.scale.y = q.s0 * (1 - Math.sin(k * Math.PI * 3) * d * 0.12); if (k >= 1) { q.o.rotation.z = q.r0; q.o.scale.y = q.s0; } }
      else if (q.kind === 'pop') { const c1 = 1.70158 * 1.3, c3 = c1 + 1, e = 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); q.o.scale.setScalar(Math.max(0.01, q.s * e)); }
      if (k >= 1) L.springs.splice(i, 1); }
  }
  L.easeBack = k => { const c1 = 1.70158 * 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };

  /* characters come alive: breathing, blinking, a little head bob; grown-ups clap when asked */
  function stepPeople(t, dt) {
    [...L.kids, ...L.adults].forEach((k, i) => {
      if (!k.visible) return; const u = k.userData;
      u.body.scale.y = 1 + Math.sin(t * 2.2 + i) * 0.012; u.head.rotation.z = Math.sin(t * 0.9 + i * 2) * 0.05; u.head.rotation.x = Math.sin(t * 0.7 + i) * 0.03;
      u.blink -= dt; const b = u.blink < 0 ? Math.max(0.08, Math.abs(u.blink + 0.07) / 0.07) : 1; u.eyes.forEach(e => { e.scale.y = Math.min(1, b); });
      if (u.blink < -0.14) u.blink = 2 + Math.random() * 3.5;
      if (u.kind === 'adult') { if (u.clap > 0) { u.clap -= dt; const c = Math.abs(Math.sin(t * 9)); u.armL.rotation.set(-1.1, 0, -0.2 - c * 0.35); u.armR.rotation.set(-1.1, 0, 0.2 + c * 0.35); }
        else { u.armL.rotation.set(0, 0, -0.12 + Math.sin(t * 1.3) * 0.03); u.armR.rotation.set(0, 0, 0.12 - Math.sin(t * 1.3 + 1) * 0.03); } }
    });
  }
  /* Tatty and Mommy */
  let fam = null;
  L.family = (on, clap) => {
    if (FAST && !clap) on = false;   /* the automatic test sees them only at the end (quicker on a test machine) */
    if (!fam) { fam = [L.makeAdult('mommy'), L.makeAdult('tatty')]; fam.forEach(f => { f.visible = false; }); }
    fam.forEach((f, i) => { f.visible = on; if (on) { f.scale.setScalar(0.9); L.pop(f, 0.9); if (clap) f.userData.clap = 4; } });
    return fam;
  };


  /* ================= drawing =================
     1. the far world, at half size, softly blurred (like a camera focused on the toys)
     2. the near world (toys, people, the stage) drawn sharp on top; the far things still hide what is behind them
     3. a warm glow around the brightest things (sun, sparkles, stars), then the colour finish: bright, rich, never grey */
  let rtW = 1, rtH = 1, fW = 1, fH = 1;
  const HF = THREE.HalfFloatType;
  const farRT = new THREE.WebGLRenderTarget(1, 1, { type: HF, depthBuffer: true }), blurA = new THREE.WebGLRenderTarget(1, 1, { type: HF, depthBuffer: false }), blurB = blurA.clone();
  const mainRT = new THREE.WebGLRenderTarget(1, 1, { type: HF, depthBuffer: true, samples: 4 });
  const bloomA = new THREE.WebGLRenderTarget(1, 1, { type: HF, depthBuffer: false }), bloomB = bloomA.clone();
  const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const blurMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new THREE.Vector2() } }, depthTest: false, depthWrite: false, vertexShader: VS,
    fragmentShader: 'uniform sampler2D tex; uniform vec2 dir; varying vec2 vUv; void main(){ vec4 c = texture2D(tex, vUv) * 0.2270270270; c += texture2D(tex, vUv + dir * 1.3846153846) * 0.3162162162; c += texture2D(tex, vUv - dir * 1.3846153846) * 0.3162162162; c += texture2D(tex, vUv + dir * 3.2307692308) * 0.0702702703; c += texture2D(tex, vUv - dir * 3.2307692308) * 0.0702702703; gl_FragColor = c; }' });
  const copyMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null } }, depthTest: false, depthWrite: false, vertexShader: VS, fragmentShader: 'uniform sampler2D tex; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tex, vUv); }' });
  const brightMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, th: { value: 2.4 } }, depthTest: false, depthWrite: false, vertexShader: VS,
    fragmentShader: 'uniform sampler2D tex; uniform float th; varying vec2 vUv; void main(){ vec3 c = texture2D(tex, vUv).rgb; float l = max(c.r, max(c.g, c.b)); float k = smoothstep(th, th * 1.8, l); gl_FragColor = vec4(c * k, 1.0); }' });
  const finalMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, bloom: { value: null }, bs: { value: 0.3 }, vib: { value: 0.14 }, px: { value: new THREE.Vector2(1, 1) } }, depthTest: false, depthWrite: false, toneMapped: true, vertexShader: VS,
    fragmentShader: `uniform sampler2D tex; uniform sampler2D bloom; uniform float bs; uniform float vib; uniform vec2 px; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tex, vUv).rgb;
        /* a light sharpen, so edges stay crisp after the picture is scaled to the screen */
        vec3 n = texture2D(tex, vUv + vec2(px.x, 0.0)).rgb + texture2D(tex, vUv - vec2(px.x, 0.0)).rgb + texture2D(tex, vUv + vec2(0.0, px.y)).rgb + texture2D(tex, vUv - vec2(0.0, px.y)).rgb;
        c = max(c + (c - n * 0.25) * 0.22, vec3(0.0));
        c += texture2D(bloom, vUv).rgb * bs;
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); float s = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
        c = mix(vec3(l), c, 1.0 + vib * (1.0 - s));   /* vibrance: dull colours get richer, rich ones stay */
        vec2 d = vUv - 0.5; c *= 1.0 - dot(d, d) * 0.28;   /* a soft frame at the edges */
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat), qScene = new THREE.Scene(), qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  quad.frustumCulled = false; qScene.add(quad);
  const depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
  const pass = (m, dst) => { quad.material = m; renderer.setRenderTarget(dst); renderer.render(qScene, qCam); };
  L.resize = () => { const v = renderer.getDrawingBufferSize(new THREE.Vector2()); rtW = Math.max(1, v.x); rtH = Math.max(1, v.y); fW = Math.max(1, Math.round(rtW / 2)); fH = Math.max(1, Math.round(rtH / 2));
    farRT.setSize(fW, fH); blurA.setSize(fW, fH); blurB.setSize(fW, fH); mainRT.setSize(rtW, rtH); bloomA.setSize(Math.max(1, rtW >> 2), Math.max(1, rtH >> 2)); bloomB.setSize(Math.max(1, rtW >> 2), Math.max(1, rtH >> 2));
    finalMat.uniforms.px.value.set(1 / rtW, 1 / rtH); };
  renderer.info.autoReset = false;
  L.render = () => {
    renderer.info.reset();
    const full = L.Q >= 2 && !FAST;
    if (!full) { camera.layers.enableAll(); scene.background = BG; renderer.shadowMap.needsUpdate = true; renderer.setRenderTarget(null); renderer.render(scene, camera); return; }
    /* 1. the far world, half size, blurred */
    camera.layers.set(FAR); scene.background = BG; renderer.shadowMap.needsUpdate = true;
    renderer.setRenderTarget(farRT); renderer.clear(); renderer.render(scene, camera);
    const R = 1.2;
    blurMat.uniforms.tex.value = farRT.texture; blurMat.uniforms.dir.value.set(R / fW, 0); pass(blurMat, blurA);
    blurMat.uniforms.tex.value = blurA.texture; blurMat.uniforms.dir.value.set(0, R / fH); pass(blurMat, blurB);
    blurMat.uniforms.tex.value = blurB.texture; blurMat.uniforms.dir.value.set(R * 1.8 / fW, 0); pass(blurMat, blurA);
    blurMat.uniforms.tex.value = blurA.texture; blurMat.uniforms.dir.value.set(0, R * 1.8 / fH); pass(blurMat, blurB);
    /* 2. into the big picture: the soft far world, its depth (so it still hides what is behind it), then the sharp near world */
    const ac = renderer.autoClear; renderer.autoClear = false;
    renderer.setRenderTarget(mainRT); renderer.clear();
    copyMat.uniforms.tex.value = blurB.texture; quad.material = copyMat; renderer.render(qScene, qCam);
    renderer.clearDepth();
    noDepth.forEach(o => { o.visible = false; }); scene.overrideMaterial = depthOnly; scene.background = null; renderer.shadowMap.needsUpdate = false;
    renderer.render(scene, camera);
    scene.overrideMaterial = null; noDepth.forEach(o => { o.visible = true; });
    camera.layers.set(0); renderer.render(scene, camera);
    renderer.autoClear = ac; scene.background = BG;
    /* 3. glow and colour finish */
    brightMat.uniforms.tex.value = mainRT.texture; pass(brightMat, bloomA);
    const bw = bloomA.width, bh = bloomA.height;
    [[1.3, 0], [0, 1.3], [2.6, 0], [0, 2.6]].forEach(([x, y], i) => { blurMat.uniforms.tex.value = (i % 2 ? bloomB : bloomA).texture; blurMat.uniforms.dir.value.set(x / bw, y / bh); pass(blurMat, i % 2 ? bloomA : bloomB); });
    finalMat.uniforms.tex.value = mainRT.texture; finalMat.uniforms.bloom.value = bloomA.texture; finalMat.uniforms.bs.value = ENV.bloom; finalMat.uniforms.vib.value = ENV.vib;
    pass(finalMat, null);
  };


  /* ================= keeping it smooth: a slow computer gets simpler effects, never a slower game ================= */
  let fN = 0, fAcc = 0, warm = 0, lastNow = performance.now();
  function setQ(q) {
    L.Q = q; renderer.setPixelRatio(prFor(q)); renderer.setSize(innerWidth, innerHeight, false); L.resize();
    const ms = q >= 1 ? 2048 : 1024; if (sun.shadow.mapSize.x !== ms) { sun.shadow.mapSize.set(ms, ms); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
    renderer.shadowMap.type = q >= 1 ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    window.__shp && (window.__shp.quality = q);
  }
  function govern() {
    if (FAST) return; const now = performance.now(), d = now - lastNow; lastNow = now;
    if (document.hidden || d > 250) return;   /* a hidden tab is not a slow computer */
    fN++; fAcc += d; if (fN < 45) return; const avg = fAcc / fN; fN = 0; fAcc = 0;
    if (warm < 1) { warm++; return; }
    if (avg > 23 && L.Q > 0) setQ(L.Q - 1);
  }
  L.update = (dt, t, shapes) => {
    govern();
    anim.forEach(f => f(t, FAST ? 0 : L.Q));
    stepSprings(dt); stepFx(dt); if (!FAST) stepPeople(t, dt);
    placeBlobs(shapes);
  };
  if (window.__shp) { window.__shp.quality = L.Q; window.__shp.drawInfo = () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles, q: L.Q }); }
  return L;
}
