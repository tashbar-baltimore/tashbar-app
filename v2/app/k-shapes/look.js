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
const OLD2TOY = { '#E03A33': '#FF3B30', '#1F6FEB': '#2F80FF', '#F2A900': '#FFC21A', '#12A766': '#1DC77A', '#7C4DFF': '#9A5BFF', '#FF7A1A': '#FF8A1F', '#00A3B8': '#00C3D6', '#F0458E': '#FF4FA0' };
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

  /* ---------- pictures painted in code ---------- */
  function paint(w, h, draw, o = {}) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h);
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

  /* ---------- renderer: sharp, bright, soft shadows ---------- */
  function prFor(q) { return FAST ? 0.5 : q >= 2 ? Math.min(2, Math.max(DPR, 1.5)) : q === 1 ? Math.min(DPR, 1.5) : Math.min(DPR, 1); }
  renderer.toneMapping = THREE.CustomToneMapping; renderer.toneMappingExposure = 0.92;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.setPixelRatio(prFor(L.Q));
  const BG = new THREE.Color('#FBE7C8');
  scene.background = BG; scene.fog = new THREE.Fog('#FBE3C0', 24, 52);

  /* light: a warm sunny key light with soft shadows, a sky/floor fill, a gentle rim light from the window, a warm bounce from the front */
  const hemi = new THREE.HemisphereLight('#F4F8FF', '#E8C9A6', 0.75);
  const sun = new THREE.DirectionalLight('#FFF3E0', 2.5); sun.position.set(-6, 12, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(FAST ? 512 : 2048, FAST ? 512 : 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 34 });
  const rim = new THREE.DirectionalLight('#FFD9A8', 1.0); rim.position.set(-4, 6, -9);
  const front = new THREE.DirectionalLight('#FFE9D2', 0.5); front.position.set(7, 3, 4);
  [hemi, sun, rim, front].forEach(l => { l.layers.enableAll(); scene.add(l); });
  sun.shadow.camera.layers.enableAll();

  /* ---------- materials ---------- */
  const M = {};
  const std = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6 }, o));
  const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial(Object.assign({ color, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }, o));
  L.pieceMat = color => new THREE.MeshPhysicalMaterial({ color: vivid(color), roughness: 0.42, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.18, envMapIntensity: 0.38, emissive: '#FFC400', emissiveIntensity: 0 });
  L.stickMat = color => new THREE.MeshPhysicalMaterial({ color: vivid(color), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.0 });
  L.solidMat = color => L.pieceMat(color);

  /* ---------- the far layer (drawn softly blurred, like a camera focused on the toys) ---------- */
  const FAR = 1;
  function farify(o) { o.traverse(c => { c.layers.set(FAR); }); }

  /* ================= the worlds ================= */
  const anim = [];   /* things that gently move: fn(t, dt) */
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
    const rugM = new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', map: rugT, roughness: 1, sheen: 1, sheenColor: new THREE.Color('#FFF4E0'), sheenRoughness: 0.8 });
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
    const curtM = new THREE.MeshPhysicalMaterial({ color: '#FF9C86', roughness: 0.85, sheen: 1, sheenColor: new THREE.Color('#FFE0D0'), sheenRoughness: 0.5, side: THREE.DoubleSide });
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
    const pouf = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new THREE.MeshPhysicalMaterial({ color: '#FFB547', roughness: 0.9, sheen: 1, sheenColor: new THREE.Color('#FFE3A8') }));
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
  const WORLDS = { playroom };
  L.buildWorld = () => { (WORLDS[world] || playroom)(); };

  /* ================= toy boxes: glossy painted toy chests ================= */
  L.boxMats = () => ({ body: phys('#FFC94A', { roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12 }), rim: phys('#FFFFFF', { roughness: 0.3, clearcoat: 1 }), inside: std('#E9A93A', { roughness: 0.8 }) });
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
  function face(g, o) {   /* big friendly eyes, eyebrows, a smile, rosy cheeks; o: { y, r, hair, glasses, lash } */
    const r = o.r, cy = o.y, onHead = (dx, dy, lift) => Math.sqrt(Math.max(0, r * r - dx * dx - dy * dy)) * 0.97 + (lift || 0);
    const white = mat('eyeW', () => phys('#FFFFFF', { roughness: 0.15, clearcoat: 1 })), iris = mat('iris' + o.eye, () => phys(o.eye || '#4A2E1C', { roughness: 0.2, clearcoat: 1 })), pupil = mat('pupil', () => std('#120C0A', { roughness: 0.2 }));
    const shine = mat('shine', () => new THREE.MeshBasicMaterial({ color: '#FFFFFF' }));
    const eyes = [];
    [-1, 1].forEach(s => {
      const ex = s * r * 0.36, ey = r * 0.05, e = new THREE.Group(); e.position.set(ex, cy + ey, onHead(ex, ey, -0.04)); e.rotation.y = s * 0.32;
      const w = new THREE.Mesh(new THREE.SphereGeometry(r * 0.23, 24, 18), white); w.scale.set(0.85, 1.05, 0.55); e.add(w);
      const ir = new THREE.Mesh(new THREE.SphereGeometry(r * 0.165, 24, 18), iris); ir.scale.set(0.95, 1.05, 0.5); ir.position.set(0, -r * 0.02, r * 0.07); e.add(ir);
      const pu = new THREE.Mesh(new THREE.SphereGeometry(r * 0.095, 20, 14), pupil); pu.scale.set(1, 1, 0.5); pu.position.set(0, -r * 0.02, r * 0.11); e.add(pu);
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.045, 12, 8), shine); h1.position.set(r * 0.05, r * 0.05, r * 0.135); e.add(h1);
      const h2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.022, 10, 6), shine); h2.position.set(-r * 0.05, -r * 0.07, r * 0.13); e.add(h2);
      g.add(e); eyes.push(e);
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(r * 0.035, r * 0.2, 4, 10), mat('brow' + o.hair, () => std(new THREE.Color(o.hair).multiplyScalar(0.7), { roughness: 0.8 })));
      brow.rotation.z = Math.PI / 2 - s * 0.22; brow.position.set(ex, cy + r * 0.36, onHead(ex, r * 0.36, 0.02)); brow.rotation.y = s * 0.3; g.add(brow);
      const ck = new THREE.Mesh(new THREE.CircleGeometry(r * 0.15, 24), mat('cheek', () => new THREE.MeshBasicMaterial({ color: '#FF8E9A', transparent: true, opacity: 0.38, depthWrite: false })));
      const cx = s * r * 0.55, cyy = -r * 0.2; ck.position.set(cx, cy + cyy, onHead(cx, cyy, 0.012)); ck.rotation.set(0.25, s * 0.62, 0); g.add(ck);
      if (o.glasses) { const gm = mat('glass', () => phys('#2A2F45', { roughness: 0.3, clearcoat: 1 }));
        const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.25, r * 0.035, 10, 32), gm); rim.position.set(ex, cy + ey, onHead(ex, ey, 0.06)); rim.rotation.y = s * 0.3; g.add(rim);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.025, r * 0.025, r * 0.8, 6), gm); arm.rotation.x = Math.PI / 2; arm.position.set(s * r * 0.86, cy + ey + 0.02, r * 0.25); arm.rotation.y = s * 0.15; g.add(arm); }
    });
    if (o.glasses) { const br = new THREE.Mesh(new THREE.CapsuleGeometry(r * 0.025, r * 0.16, 4, 8), MAT.glass); br.rotation.z = Math.PI / 2; br.position.set(0, cy + r * 0.1, onHead(0, r * 0.1, 0.07)); g.add(br); }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(r * 0.1, 16, 12), mat('nose', () => phys('#F4B990', { roughness: 0.5, clearcoat: 0.3 }))); nose.scale.set(1.1, 0.85, 0.8); nose.position.set(0, cy - r * 0.12, onHead(0, -r * 0.12, -0.01)); g.add(nose);
    /* the smile: an open happy mouth with a little tongue */
    const sm = new THREE.Shape(), mw = r * 0.27; sm.moveTo(-mw, 0); sm.quadraticCurveTo(0, -r * 0.05, mw, 0); sm.quadraticCurveTo(mw * 0.85, -r * 0.3, 0, -r * 0.32); sm.quadraticCurveTo(-mw * 0.85, -r * 0.3, -mw, 0);
    const my = -r * 0.32, mouth = new THREE.Mesh(new THREE.ShapeGeometry(sm, 20), mat('mouth', () => std('#8A2A35', { roughness: 0.5 })));
    mouth.position.set(0, cy + my, onHead(0, my - r * 0.1, 0.03)); mouth.rotation.x = 0.42; g.add(mouth);
    const tg = new THREE.Mesh(new THREE.CircleGeometry(r * 0.12, 20), mat('tongue', () => std('#FF7A88', { roughness: 0.5 }))); tg.scale.set(1.2, 0.6, 1); tg.position.set(0, -r * 0.24, 0.003); mouth.add(tg);
    const teeth = new THREE.Mesh(new THREE.PlaneGeometry(mw * 1.3, r * 0.06), shine); teeth.position.set(0, -r * 0.045, 0.002); mouth.add(teeth);
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
    const skin = mat('skin', () => new THREE.MeshPhysicalMaterial({ color: SKIN, roughness: 0.55, sheen: 0.6, sheenColor: new THREE.Color('#FFD7C2'), sheenRoughness: 0.6 }));
    const shirtM = mat('shirt' + shirt, () => new THREE.MeshPhysicalMaterial({ color: shirt, roughness: 0.7, sheen: 0.8, sheenColor: new THREE.Color('#FFFFFF'), sheenRoughness: 0.7 }));
    const pants = mat('pants', () => new THREE.MeshPhysicalMaterial({ color: '#2B3656', roughness: 0.75, sheen: 0.5, sheenColor: new THREE.Color('#6D7BA8') }));
    const shoe = mat('shoe', () => phys('#3B2418', { roughness: 0.3, clearcoat: 1 })), hairM = mat('hair' + hair, () => new THREE.MeshPhysicalMaterial({ color: hair, roughness: 0.6, sheen: 1, sheenColor: new THREE.Color(hair).lerp(new THREE.Color('#FFFFFF'), 0.4), sheenRoughness: 0.4 }));
    const kipM = mat('kip' + (opts.kippah || '#1F2C5C'), () => new THREE.MeshPhysicalMaterial({ color: opts.kippah || '#1F2C5C', roughness: 0.8, sheen: 1, sheenColor: new THREE.Color('#7E8FD0'), sheenRoughness: 0.4 }));
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
    const head = new THREE.Group(); head.position.set(0, 2.22, 0); body.add(head);
    const hr = 0.6;
    const skull = new THREE.Mesh(new THREE.SphereGeometry(hr, 48, 36), skin); skull.scale.set(1.02, 0.96, 0.97); skull.castShadow = true; head.add(skull);
    [-1, 1].forEach(s => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), skin); ear.scale.set(0.5, 1, 0.75); ear.position.set(s * hr * 0.98, -0.02, -0.02); head.add(ear);
      const pe = curl(hairM, hr); pe.position.set(s * hr * 0.9, -0.06, 0.16); head.add(pe); });
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(hr * 1.035, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), hairM); hairCap.rotation.x = -0.58; hairCap.position.set(0, 0.03, -0.03); hairCap.castShadow = true; head.add(hairCap);
    for (let i = 0; i < 7; i++) { const a = -0.75 + i * 0.25, t = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), hairM); t.scale.set(1.15, 0.7, 0.8);
      t.position.set(Math.sin(a) * hr * 0.9, hr * 0.7 - Math.abs(a) * 0.1, Math.cos(a) * hr * 0.5 - 0.02); head.add(t); }
    const kip = new THREE.Mesh(new THREE.SphereGeometry(hr * 1.07, 40, 10, 0, Math.PI * 2, 0, 0.68), kipM); kip.rotation.x = -0.3; kip.position.set(0, 0.03, -0.02); head.add(kip);
    const kr = new THREE.Mesh(new THREE.TorusGeometry(hr * 1.07 * Math.sin(0.68), 0.018, 6, 48), mat('kipRim', () => phys('#E8C35A', { metalness: 0.4, roughness: 0.4 }))); kr.rotation.x = Math.PI / 2;
    kr.position.y = hr * 1.07 * Math.cos(0.68) - 0.005; kip.add(kr);
    const F = face(head, { y: 0, r: hr, hair, glasses, eye: opts.eye });
    k.userData = { armL, armR, head, body, eyes: F.eyes, blink: 2 + Math.random() * 3, kind: 'kid' };
    k.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(k); L.kids.push(k); return k;
  };
  /* Tatty and Mommy: kind grown-ups who come to see and clap */
  L.makeAdult = (who) => {
    const k = new THREE.Group(), body = new THREE.Group(); k.add(body);
    const add = (o, x, y, z, par) => { o.position.set(x, y, z); o.castShadow = true; (par || body).add(o); return o; };
    const skin = mat('skin', () => phys(SKIN, { roughness: 0.55, clearcoat: 0 }));
    const isT = who === 'tatty', hair = isT ? '#4A2F1E' : '#5A3A28';
    const top = isT ? mat('suit', () => new THREE.MeshPhysicalMaterial({ color: '#1E2232', roughness: 0.6, sheen: 0.6, sheenColor: new THREE.Color('#5A6488') }))
      : mat('dress', () => new THREE.MeshPhysicalMaterial({ color: '#4E7FD0', roughness: 0.7, sheen: 0.8, sheenColor: new THREE.Color('#BFD4FF') }));
    const white = mat('shirtW', () => new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0.7, sheen: 0.6, sheenColor: new THREE.Color('#FFFFFF') }));
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
      const tM = mat('tichel', () => new THREE.MeshPhysicalMaterial({ color: '#7A3E8E', roughness: 0.75, sheen: 1, sheenColor: new THREE.Color('#D9A8EA'), sheenRoughness: 0.5 }));
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
  const CN = 220, conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.13, 0.075), new THREE.MeshStandardMaterial({ roughness: 0.5, side: THREE.DoubleSide }), CN);
  conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage); conf.frustumCulled = false; conf.count = 0; scene.add(conf);
  const cs = Array.from({ length: CN }, () => ({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), q: new THREE.Quaternion(), ax: new THREE.Vector3(), spin: 0 }));
  const cc = new THREE.Color(), cm = new THREE.Matrix4(), cq = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), hid = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < CN; i++) { conf.setColorAt(i, cc.set(TOY[i % TOY.length])); conf.setMatrixAt(i, hid); }
  let cNext = 0;
  const sprites = [];
  function sprite(tex, color, add) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending })); s.renderOrder = 5; scene.add(s); return s; }
  L.celebrate = (at, n) => {
    if (FAST) return;
    const k = L.Q >= 2 ? 1 : L.Q === 1 ? 0.6 : 0.3, N = Math.round((n || 26) * 2 * k);
    for (let i = 0; i < N; i++) { const c = cs[cNext]; cNext = (cNext + 1) % CN; c.life = 2.6 + Math.random();
      c.p.copy(at); const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4; c.v.set(Math.cos(a) * sp, 5 + Math.random() * 5, Math.sin(a) * sp * 0.6);
      c.ax.set(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize(); c.spin = 6 + Math.random() * 10; c.q.setFromAxisAngle(c.ax, Math.random() * 6); }
    conf.count = CN;
    const ns = Math.round(9 * Math.max(0.5, k));
    for (let i = 0; i < ns; i++) { const s = sprite(starTex, '#FFFFFF', false), a = i / ns * Math.PI * 2;
      L.fx.push({ s, t: 0, life: 1.1, p0: at.clone(), v: new THREE.Vector3(Math.cos(a) * 3.2, 2.5 + Math.sin(a) * 2.6, 0.6), size: 0.55 + Math.random() * 0.25, spin: (Math.random() - .5) * 6 }); }
    const ring = sprite(soft, '#FFF0B0', true); L.fx.push({ s: ring, t: 0, life: 0.55, p0: at.clone(), v: new THREE.Vector3(), size: 4.2, ring: true });
  };
  L.sparkle = (at, n) => {
    if (FAST) return;
    for (let i = 0; i < (n || 7); i++) { const s = sprite(twinkleTex, '#FFFFFF', true);
      L.fx.push({ s, t: -i * 0.07, life: 0.75, p0: at.clone().add(new THREE.Vector3((Math.random() - .5) * 1.4, (Math.random() - .2) * 1.0, (Math.random() - .5) * 0.6)), v: new THREE.Vector3(0, 0.6, 0), size: 0.45 + Math.random() * 0.3, tw: true }); }
  };
  function stepFx(dt) {
    let alive = 0;
    for (let i = 0; i < CN; i++) { const c = cs[i]; if (c.life <= 0) continue; alive++; c.life -= dt;
      c.v.y -= 7.5 * dt; c.v.multiplyScalar(1 - 1.9 * dt); if (c.v.y < -1.6) c.v.y = -1.6;   /* paper floats down */
      c.p.addScaledVector(c.v, dt); c.p.x += Math.sin(c.life * 5 + i) * 0.6 * dt;
      if (c.p.y < 0.12) { c.p.y = 0.12; c.v.set(0, 0, 0); }
      cq.setFromAxisAngle(c.ax, c.spin * dt); c.q.multiply(cq);
      const s = Math.min(1, c.life / 0.5); cm.compose(c.p, c.q, one.set(s, s, s)); conf.setMatrixAt(i, c.life > 0 ? cm : hid); }
    if (alive || conf.count) { conf.instanceMatrix.needsUpdate = true; if (!alive) conf.count = 0; }
    for (let i = L.fx.length - 1; i >= 0; i--) { const f = L.fx[i]; f.t += dt; if (f.t < 0) { f.s.visible = false; continue; } f.s.visible = true; const k = f.t / f.life;
      if (k >= 1) { scene.remove(f.s); f.s.material.dispose(); L.fx.splice(i, 1); continue; }
      if (f.ring) { f.s.position.copy(f.p0); f.s.scale.setScalar(0.3 + f.size * Math.sqrt(k)); f.s.material.opacity = (1 - k) * 0.9; continue; }
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
    if (!fam) { fam = [L.makeAdult('mommy'), L.makeAdult('tatty')]; fam.forEach(f => { f.visible = false; }); }
    fam.forEach((f, i) => { f.visible = on; if (on) { f.scale.setScalar(0.9); L.pop(f, 0.9); if (clap) f.userData.clap = 4; } });
    return fam;
  };

  /* ================= drawing: the far room softly blurred, the toys sharp ================= */
  let rtW = 1, rtH = 1;
  const rtOpt = { type: THREE.HalfFloatType, depthBuffer: true };
  const farRT = new THREE.WebGLRenderTarget(1, 1, rtOpt), blurA = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false }), blurB = blurA.clone();
  const blurMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new THREE.Vector2() } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform sampler2D tex; uniform vec2 dir; varying vec2 vUv; void main(){ vec4 c = texture2D(tex, vUv) * 0.2270270270; c += texture2D(tex, vUv + dir * 1.3846153846) * 0.3162162162; c += texture2D(tex, vUv - dir * 1.3846153846) * 0.3162162162; c += texture2D(tex, vUv + dir * 3.2307692308) * 0.0702702703; c += texture2D(tex, vUv - dir * 3.2307692308) * 0.0702702703; gl_FragColor = c; }' });
  const showMat = new THREE.MeshBasicMaterial({ depthTest: false, depthWrite: false });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat), qScene = new THREE.Scene(), qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  quad.frustumCulled = false; qScene.add(quad);
  const showQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: { tex: { value: null } }, depthTest: false, depthWrite: false, toneMapped: true,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform sampler2D tex; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tex, vUv); \n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n }' }));
  showQuad.frustumCulled = false; const sScene = new THREE.Scene(); sScene.add(showQuad);
  void showMat;
  L.resize = () => { const v = renderer.getDrawingBufferSize(new THREE.Vector2()); rtW = Math.max(1, Math.round(v.x / 2)); rtH = Math.max(1, Math.round(v.y / 2)); farRT.setSize(rtW, rtH); blurA.setSize(rtW, rtH); blurB.setSize(rtW, rtH); };
  let first = true;
  L.render = () => {
    const dof = L.Q >= 2 && !FAST;
    if (!dof) { camera.layers.enableAll(); scene.background = BG; renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera); return; }
    /* 1. the far room, at half size */
    camera.layers.set(FAR); scene.background = BG; renderer.shadowMap.needsUpdate = first; first = false;
    renderer.setRenderTarget(farRT); renderer.clear(); renderer.render(scene, camera);
    /* 2. soften it (two passes each way) */
    quad.material = blurMat; const R = 1.25;
    [[farRT, blurA, R / rtW, 0], [blurA, blurB, 0, R / rtH], [blurB, blurA, R * 1.8 / rtW, 0], [blurA, blurB, 0, R * 1.8 / rtH]].forEach(([src, dst, x, y]) => {
      blurMat.uniforms.tex.value = src.texture; blurMat.uniforms.dir.value.set(x, y); renderer.setRenderTarget(dst); renderer.render(qScene, qCam); });
    renderer.setRenderTarget(null);
    /* 3. the soft room behind, then the sharp toys and people on top */
    const ac = renderer.autoClear; renderer.autoClear = false; renderer.clear();
    showQuad.material.uniforms.tex.value = blurB.texture; renderer.render(sScene, qCam); renderer.clearDepth();
    camera.layers.set(0); scene.background = null; renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera);
    renderer.autoClear = ac; scene.background = BG;
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
  if (window.__shp) window.__shp.quality = L.Q;
  return L;
}
