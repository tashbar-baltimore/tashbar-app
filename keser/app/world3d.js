/* HER WORLD in 3D: a jewel box under a glitter sky. A mirror floor inlaid with gold, a colonnade of rose-crystal pillars hung with pearls,
   her crown floating high in the middle inside a ring of chandelier crystals, and five jeweled pavilions (one per subject) on a turning ring.
   Rose petals drift down, holographic butterflies wander, ribbons of light circle, and everything glows (bloom).
   Light mode (slow computers): no mirror, no bloom, fewer petals and glitter. Reduce motion: everything still, glides are quick.
   Everything here is drawn by code: no picture files. */
import * as THREE from 'three';
import { EffectComposer } from './vendor/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './vendor/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './vendor/postprocessing/OutputPass.js';
import { Reflector } from './vendor/objects/Reflector.js';

const TAU = Math.PI * 2, R = 5.2;

export function start(o) {
  const { canvas, places, progress, calm } = o;
  let lite = !!o.lite;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no WebGL');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const phoneish = Math.min(innerWidth, innerHeight) < 600;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x2a0d40, 0.016);
  /* the sky: deep plum to midnight, with a rose glow on the horizon */
  { const c = document.createElement('canvas'); c.width = 16; c.height = 512; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#0c0318'); g.addColorStop(0.35, '#2a0b45'); g.addColorStop(0.5, '#6a1f6e'); g.addColorStop(0.56, '#3a1050'); g.addColorStop(1, '#12051f'); x.fillStyle = g; x.fillRect(0, 0, 16, 512);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.mapping = THREE.EquirectangularReflectionMapping; scene.background = t; }

  /* reflections: a glam studio of pink, lilac and gold light panels, so gold and crystal shine in jewel tones */
  const pm = new THREE.PMREMGenerator(renderer);
  { const env = new THREE.Scene(), box = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: 0x2a0f3a, side: THREE.BackSide })); env.add(box);
    const panel = (c, i, x, y, z, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
    panel(0xffffff, 6, 0, 12, 4, 10, 4); panel(0xff7ab8, 4, -12, 4, 6, 6, 10); panel(0xb98cff, 4, 12, 3, 4, 6, 10); panel(0xffd27a, 5, 4, 6, -12, 10, 5); panel(0x7fe8d8, 2.5, -6, -2, -12, 6, 4); panel(0xffffff, 3, 0, -10, 0, 8, 8); panel(0xffd0e6, 1.2, 0, 5, 14, 12, 6); panel(0xfff1b8, 1.2, 8, 9, 10, 5, 4);
    scene.environment = pm.fromScene(env, 0.02).texture; }

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120); scene.add(camera);
  scene.add(new THREE.AmbientLight(0xffd6ec, 0.25));
  const keyL = new THREE.DirectionalLight(0xfff1d0, 1.6); keyL.position.set(4, 9, 8); scene.add(keyL);
  const rimL = new THREE.DirectionalLight(0xc49bff, 1.2); rimL.position.set(-6, 4, -8); scene.add(rimL);

  /* ---------- materials ---------- */
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xf2bf52, metalness: 1, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06 });
  const roseGold = new THREE.MeshPhysicalMaterial({ color: 0xf3a98f, metalness: 1, roughness: 0.18, clearcoat: 1 });
  const silver = new THREE.MeshPhysicalMaterial({ color: 0xf4eef8, metalness: 1, roughness: 0.1, clearcoat: 1 });
  const pearl = new THREE.MeshPhysicalMaterial({ color: 0xfff7fb, roughness: 0.22, iridescence: 1, iridescenceIOR: 1.3, clearcoat: 1, sheen: 1, sheenColor: 0xffd6ec });
  const gem = (c, e) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.03, metalness: 0.1, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.7, iridescenceThicknessRange: [200, 900], emissive: c, emissiveIntensity: e == null ? 0.25 : e, flatShading: true });
  const crystal = (c) => { const m = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0, metalness: 0.1, transmission: 0, transparent: true, opacity: 0.9, iridescence: 1, iridescenceIOR: 1.6, clearcoat: 1, flatShading: true, emissive: c, emissiveIntensity: 0.3 });
    m.userData.crystal = true; return m; };
  const glow = (c, op) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op == null ? 1 : op, blending: THREE.AdditiveBlending, depthWrite: false });
  const crystals = [];   /* crystal materials: in light mode they turn into simple shiny gems */
  const mkCrystal = c => { const m = crystal(c); crystals.push(m); return m; };

  /* soft round textures for glow, glitter and bokeh */
  const radial = (stops, size = 128) => { const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'), g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, size, size); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const SOFT = radial([[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(255,255,255,.5)'], [1, 'rgba(255,255,255,0)']]);
  const STAR = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    x.globalCompositeOperation = 'lighter'; x.fillStyle = '#fff'; x.beginPath(); x.moveTo(32, 0); x.lineTo(34.5, 29.5); x.lineTo(64, 32); x.lineTo(34.5, 34.5); x.lineTo(32, 64); x.lineTo(29.5, 34.5); x.lineTo(0, 32); x.lineTo(29.5, 29.5); x.closePath(); x.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const sprite = (tex, color, s, op) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity: op == null ? 1 : op, depthWrite: false, blending: THREE.AdditiveBlending })); m.scale.set(s, s, 1); return m; };

  /* a girl from the cast in a gold oval frame that always faces her (the picture loads in; a soft glow shows until it does) */
  function cameo(src, color) {
    const W = 360, H = 440, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const draw = img => { x.clearRect(0, 0, W, H); const cx = W / 2, cy = H / 2, rx = W / 2 - 22, ry = H / 2 - 22;
      const gl = x.createRadialGradient(cx, cy, rx * 0.6, cx, cy, W / 2); gl.addColorStop(0, color); gl.addColorStop(1, 'rgba(255,255,255,0)'); x.globalAlpha = 0.55; x.fillStyle = gl; x.fillRect(0, 0, W, H); x.globalAlpha = 1;
      x.save(); x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); x.clip();
      if (img) { const s = Math.max(rx * 2 / img.width, ry * 2 / img.height) * 1.05; x.drawImage(img, cx - img.width * s / 2, cy - ry - 6, img.width * s, img.height * s); }
      else { const f = x.createLinearGradient(0, 0, 0, H); f.addColorStop(0, '#fff1f7'); f.addColorStop(1, color); x.fillStyle = f; x.fillRect(0, 0, W, H); }
      x.restore();
      const gg = x.createLinearGradient(0, 0, W, H); gg.addColorStop(0, '#fff1b8'); gg.addColorStop(0.5, '#c98a1e'); gg.addColorStop(1, '#fff1b8');
      x.lineWidth = 12; x.strokeStyle = gg; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); x.stroke();
      x.lineWidth = 3; x.strokeStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.ellipse(cx, cy, rx - 9, ry - 9, 0, 0, Math.PI * 2); x.stroke();
      x.fillStyle = '#fff7fb'; for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2; x.beginPath(); x.arc(cx + Math.cos(a) * (rx + 2), cy + Math.sin(a) * (ry + 2), 5, 0, Math.PI * 2); x.fill(); }
      tex.needsUpdate = true; };
    draw(null); const img = new Image(); img.onload = () => draw(img); img.src = src;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.scale.set(1.45, 1.77, 1); return sp;
  }
  /* Bubby waits by her crown */
  const bubby = cameo('/pics/keser-cast-bubby.webp', '#B98CFF');

  /* ---------- the floor: a mirror inlaid with gold, edged in pearls ---------- */
  const floorR = 8.8;
  const mirror = new Reflector(new THREE.CircleGeometry(floorR, 96), { clipBias: 0.003, textureWidth: Math.round(innerWidth * 0.5), textureHeight: Math.round(innerHeight * 0.5), color: 0x7a4a86 });
  mirror.rotation.x = -Math.PI / 2; mirror.position.y = -0.005; scene.add(mirror);
  const plainFloor = new THREE.Mesh(new THREE.CircleGeometry(floorR, 96), new THREE.MeshPhysicalMaterial({ color: 0x4a1d5c, metalness: 0.4, roughness: 0.25, clearcoat: 1 }));
  plainFloor.rotation.x = -Math.PI / 2; plainFloor.position.y = -0.006; scene.add(plainFloor);
  /* a pearly veil over the mirror so it reads as polished rose stone */
  const veilTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d'), m = 512;
    const g = x.createRadialGradient(m, m, 0, m, m, m); g.addColorStop(0, 'rgba(255,170,215,.10)'); g.addColorStop(0.7, 'rgba(120,60,150,.25)'); g.addColorStop(1, 'rgba(40,10,60,.75)'); x.fillStyle = g; x.fillRect(0, 0, 1024, 1024);
    x.strokeStyle = 'rgba(255,214,140,.9)'; x.lineWidth = 3;
    for (const r of [500, 470, 300, 285, 140]) { x.beginPath(); x.arc(m, m, r, 0, TAU); x.stroke(); }
    x.lineWidth = 2; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, b = (i + 0.5) / 16 * TAU;   /* a sixteen-point star rose, like a jewellery-box lid */
      x.beginPath(); x.moveTo(m + Math.cos(a) * 140, m + Math.sin(a) * 140); x.lineTo(m + Math.cos(b) * 285, m + Math.sin(b) * 285); x.lineTo(m + Math.cos(a + TAU / 16) * 140, m + Math.sin(a + TAU / 16) * 140); x.stroke();
      x.beginPath(); x.moveTo(m + Math.cos(b) * 300, m + Math.sin(b) * 300); x.lineTo(m + Math.cos(a + TAU / 32) * 470, m + Math.sin(a + TAU / 32) * 470); x.stroke(); }
    x.fillStyle = 'rgba(255,241,184,.95)'; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU; x.beginPath(); x.arc(m + Math.cos(a) * 485, m + Math.sin(a) * 485, 4, 0, TAU); x.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; })();
  const veil = new THREE.Mesh(new THREE.CircleGeometry(floorR, 96), new THREE.MeshBasicMaterial({ map: veilTex, transparent: true, depthWrite: false }));
  veil.rotation.x = -Math.PI / 2; veil.position.y = 0.004; scene.add(veil);
  { const rim = new THREE.Mesh(new THREE.TorusGeometry(floorR, 0.14, 20, 220), gold); rim.rotation.x = Math.PI / 2; rim.position.y = 0.02; scene.add(rim);
    const pg = new THREE.SphereGeometry(0.085, 16, 10), pearls = new THREE.InstancedMesh(pg, pearl, 150), mm = new THREE.Matrix4();
    for (let i = 0; i < 150; i++) { const a = i / 150 * TAU; mm.makeTranslation(Math.cos(a) * (floorR + 0.24), 0.08, Math.sin(a) * (floorR + 0.24)); pearls.setMatrixAt(i, mm); } scene.add(pearls); }

  /* ---------- the colonnade: rose-crystal pillars, gold arches, pearl garlands ---------- */
  { const n = 26, cr = 23, colGeo = new THREE.CylinderGeometry(0.28, 0.32, 7, 24, 1), capGeo = new THREE.CylinderGeometry(0.5, 0.3, 0.4, 24), baseGeo = new THREE.CylinderGeometry(0.42, 0.5, 0.4, 24);
    const colMat = new THREE.MeshPhysicalMaterial({ color: 0xffb3d6, roughness: 0.08, metalness: 0.1, iridescence: 1, iridescenceIOR: 1.5, clearcoat: 1, transparent: true, opacity: 0.8, emissive: 0x6a1c4a, emissiveIntensity: 0.4 });
    const pg = new THREE.SphereGeometry(0.06, 10, 6), garland = new THREE.InstancedMesh(pg, pearl, n * 22), mm = new THREE.Matrix4(); let gi = 0;
    for (let i = 0; i < n; i++) { const a = i / n * TAU, x = Math.cos(a) * cr, z = Math.sin(a) * cr;
      const c = new THREE.Mesh(colGeo, colMat); c.position.set(x, 3.5, z); scene.add(c);
      const cap = new THREE.Mesh(capGeo, gold); cap.position.set(x, 7.2, z); scene.add(cap);
      const base = new THREE.Mesh(baseGeo, gold); base.position.set(x, 0.2, z); scene.add(base);
      const b = (i + 0.5) / n * TAU, span = 2 * cr * Math.sin(Math.PI / n);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(span / 2, 0.07, 10, 40, Math.PI), gold); arch.position.set(Math.cos(b) * cr * Math.cos(Math.PI / n), 7.4, Math.sin(b) * cr * Math.cos(Math.PI / n)); arch.rotation.y = -b + Math.PI / 2; scene.add(arch);
      const top = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), gem(places[i % places.length].hex, 0.6)); top.scale.y = 1.6; top.position.set(x, 7.75, z); scene.add(top);
      for (let k = 0; k < 22; k++) { const t = (k + 0.5) / 22, aa = a + (t * TAU / n), sag = Math.sin(t * Math.PI) * 1.1;   /* a swag of pearls between two pillars */
        mm.makeTranslation(Math.cos(aa) * (cr - 0.05), 6.6 - sag, Math.sin(aa) * (cr - 0.05)); garland.setMatrixAt(gi++, mm); } }
    scene.add(garland); }

  /* ---------- her crown, high in the middle, inside a ring of chandelier crystals ---------- */
  const crownRig = new THREE.Group(); crownRig.position.set(0, 4.9, 0); crownRig.scale.setScalar(1.5);
  { const spot = new THREE.SpotLight(0xfff1d0, 50, 20, 0.32, 0.6, 1.2); spot.position.set(0, 10, 6); spot.target = crownRig; scene.add(spot); } scene.add(crownRig);
  const crown = new THREE.Group(); crownRig.add(crown);
  const CR = 1.05, CH = 0.5, PEAK = 0.8, CN = 7;
  { const g = new THREE.CylinderGeometry(CR, CR * 0.9, 1, 220, 20, true), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), t = p.getY(i) + 0.5, a = Math.atan2(z, x); const pk = Math.pow(Math.abs(Math.cos(a * CN / 2)), 3);
      p.setY(i, t * (CH + PEAK * pk)); const f = 1 + t * 0.08; p.setX(i, x * f); p.setZ(i, z * f); }
    g.computeVertexNormals(); const band = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: 0xf6c75c, metalness: 1, roughness: 0.12, clearcoat: 1, side: THREE.DoubleSide, emissive: 0x6a4210, emissiveIntensity: 0.55, envMapIntensity: 1.6 })); crown.add(band);
    for (const [y, r, tb] of [[0.02, CR + 0.01, 0.07], [CH * 0.8, CR * 0.99 + 0.05, 0.035]]) { const m = new THREE.Mesh(new THREE.TorusGeometry(r, tb, 18, 160), gold); m.rotation.x = Math.PI / 2; m.position.y = y; crown.add(m); }
    for (let k = 0; k < CN; k++) { const a = k / CN * TAU + Math.PI / 2, tip = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 12), pearl); tip.position.set(Math.cos(a) * CR * 1.08, CH + PEAK + 0.06, Math.sin(a) * CR * 1.08); crown.add(tip); }
    const velvet = new THREE.Mesh(new THREE.SphereGeometry(CR * 0.92, 40, 20, 0, TAU, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xb0306f, roughness: 0.7, sheen: 1, sheenColor: 0xff9fcf, sheenRoughness: 0.4 }));
    velvet.scale.y = 0.75; velvet.position.y = 0.15; crown.add(velvet);
    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), mkCrystal(0xffd6ec)); orb.scale.y = 1.4; orb.position.y = CR * 0.92 * 0.75 + 0.35; crown.add(orb); }
  /* one jewel per subject on the front of the band: it grows and glows as she learns */
  const jewels = places.map((pl, i) => { const a = Math.PI / 2 + (i - (places.length - 1) / 2) * 0.42, v = progress[pl.id] || 0, g = new THREE.Group();
    g.position.set(Math.cos(a) * (CR + 0.06), CH * 0.4, Math.sin(a) * (CR + 0.06)); g.lookAt(Math.cos(a) * 5, CH * 0.4, Math.sin(a) * 5); crown.add(g);
    const socket = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.022, 10, 32), gold); g.add(socket);
    let stone = null, spark = null;
    if (v > 0) { stone = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 0), gem(pl.hex, 0.3 + v * 1.2)); stone.scale.set(1, 1.25, 0.6).multiplyScalar(0.55 + v * 0.75); stone.position.z = 0.03; g.add(stone);
      spark = sprite(STAR, 0xffffff, 0.001); spark.position.z = 0.12; g.add(spark); }
    else { const hint = new THREE.Mesh(new THREE.CircleGeometry(0.08, 24), glow(pl.hex, 0.25)); hint.position.z = 0.005; g.add(hint); }
    return { g, stone, spark, v }; });
  crownRig.add(sprite(radial([[0, 'rgba(255,214,140,.7)'], [0.4, 'rgba(255,95,162,.25)'], [1, 'rgba(255,95,162,0)']]), 0xffffff, 6.5));
  const chandelier = new THREE.Group(); crownRig.add(chandelier);
  { const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.05, 12, 160), gold); ring.rotation.x = Math.PI / 2; ring.position.y = 2.6; chandelier.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.035, 12, 140), gold); ring2.rotation.x = Math.PI / 2; ring2.position.y = 2.95; ring2.scale.setScalar(1.3); chandelier.add(ring2);
    const dropGeo = new THREE.OctahedronGeometry(0.07, 0); dropGeo.scale(1, 2.4, 1);
    const drops = new THREE.InstancedMesh(dropGeo, gem(0xfff0fa, 0.15), 96), strands = new THREE.InstancedMesh(new THREE.SphereGeometry(0.028, 8, 6), pearl, 96 * 4), mm = new THREE.Matrix4(); let si = 0;
    for (let i = 0; i < 96; i++) { const two = i % 2, a = i / 96 * TAU * 2 + two * 0.06, r = two ? 2.08 : 2.6, top = two ? 2.95 : 2.6, len = 0.35 + ((i * 37) % 11) / 11 * 0.45;
      mm.makeTranslation(Math.cos(a) * r, top - len, Math.sin(a) * r); drops.setMatrixAt(i, mm);
      for (let k = 0; k < 4; k++) { mm.makeTranslation(Math.cos(a) * r, top - (k + 0.5) / 4 * (len - 0.22), Math.sin(a) * r); strands.setMatrixAt(si++, mm); } }
    chandelier.add(drops, strands); }
  bubby.position.set(2.6, 0.4, 0.6); bubby.scale.set(1.15, 1.4, 1); crownRig.add(bubby);
  const crownHit = new THREE.Mesh(new THREE.SphereGeometry(1.7, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); crownHit.position.y = 0.6; crownRig.add(crownHit);
  const crownSparks = [...Array(10)].map((_, i) => { const s = sprite(STAR, [0xffffff, 0xfff1b8, 0xffc2dd][i % 3], 0.01); s.userData.off = i * 0.9; crownRig.add(s); return s; });

  /* ---------- the five pavilions ---------- */
  const ring = new THREE.Group(); scene.add(ring);
  const pav = places.map((pl, i) => {
    const g = new THREE.Group(), th = i / places.length * TAU; g.position.set(Math.sin(th) * R, 0, Math.cos(th) * R); g.rotation.y = th; ring.add(g);
    const col = new THREE.Color(pl.hex), tint = gem(pl.hex, 0.35);
    const stepA = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.22, 64), new THREE.MeshPhysicalMaterial({ color: col.clone().lerp(new THREE.Color(0x3a1050), 0.35), metalness: 0.3, roughness: 0.08, clearcoat: 1, iridescence: 0.8, transparent: true, opacity: 0.92, emissive: pl.hex, emissiveIntensity: 0.06 }));
    stepA.position.y = 0.11; g.add(stepA);
    const stepB = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.08, 0.18, 64), stepA.material); stepB.position.y = 0.31; g.add(stepB);
    for (const [y, r] of [[0.22, 1.3], [0.4, 1.04]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 10, 120), gold); t.rotation.x = Math.PI / 2; t.position.y = y; g.add(t); }
    /* six slender gold columns, a lattice dome and a gem on top */
    const colGeo = new THREE.CylinderGeometry(0.04, 0.05, 2.3, 12);
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU, c = new THREE.Mesh(colGeo, gold); c.position.set(Math.cos(a) * 0.9, 1.55, Math.sin(a) * 0.9); g.add(c);
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.028, 8, 48, Math.PI), gold); arc.position.y = 2.7; arc.rotation.y = a; arc.scale.y = 0.75; g.add(arc);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), tint); bead.position.set(Math.cos(a) * 0.9, 2.72, Math.sin(a) * 0.9); g.add(bead); }
    { const t = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.04, 10, 100), gold); t.rotation.x = Math.PI / 2; t.position.y = 2.7; g.add(t); }
    const fin = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), tint); fin.scale.y = 1.7; fin.position.y = 3.55; g.add(fin);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.88, 40, 16, 0, TAU, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: col.clone().lerp(new THREE.Color(0xffffff), 0.6), transparent: true, opacity: 0.07, roughness: 0, iridescence: 1, side: THREE.DoubleSide, depthWrite: false }));
    dome.position.y = 2.7; dome.scale.y = 0.75; g.add(dome);
    /* light: a beam rising from the floor, a halo, a coloured lamp */
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 2.3, 40, 1, true), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { c: { value: col }, k: { value: 0.5 } }, vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'uniform vec3 c; uniform float k; varying vec2 vUv; void main(){ float a=pow(1.-vUv.y,4.)*k; gl_FragColor=vec4(c*a,a); }' }));
    beam.position.y = 1.55; g.add(beam);
    const halo = sprite(SOFT, pl.hex, 3.0, 0.3); halo.position.set(0, 1.6, -0.3); g.add(halo);
    const lamp = new THREE.Object3D();   /* no per-place light: lights make every shiny surface slow to prepare on a school computer; the glow, beam and halo carry the colour */
    const host = cameo(pl.pic, pl.color); host.position.set(1.75, 2.45, 0.3); g.add(host);
    /* the subject itself, floating in the middle */
    const thing = new THREE.Group(); thing.position.y = 1.55; thing.scale.setScalar(1.3); g.add(thing); const anim = build(pl.id, thing, pl);
    /* her progress here: little gems circling the pedestal (more as she learns) */
    const v = progress[pl.id] || 0, orbit = new THREE.Group(); orbit.position.y = 0.5; g.add(orbit);
    for (let k = 0; k < Math.round(v * 10); k++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), gem(k % 3 ? pl.hex : 0xfff1b8, 0.8)); const a = k / 10 * TAU; s.position.set(Math.cos(a) * 1.18, 0, Math.sin(a) * 1.18); orbit.add(s); }
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 3.8, 12), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.9; hit.userData.idx = i; g.add(hit);
    return { g, thing, anim, halo, lamp, beam, orbit, fin, hit, host, th, sc: 1 };
  });

  function build(id, t, pl) {   /* returns a function(time, dt) that animates it */
    if (id === 'kodesh') {   /* Shabbos candlesticks on a silver tray, flames that flicker */
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.55, 0.05, 48), silver); tray.position.y = -0.62; t.add(tray);
      const pts = [[0.2, 0], [0.22, 0.03], [0.09, 0.08], [0.05, 0.16], [0.07, 0.2], [0.035, 0.26], [0.035, 0.5], [0.07, 0.54], [0.05, 0.58], [0.1, 0.66], [0.11, 0.7], [0.05, 0.72], [0, 0.72]].map(([x, y]) => new THREE.Vector2(x, y));
      const stick = new THREE.LatheGeometry(pts, 48), flames = [];
      for (const x of [-0.27, 0.27]) { const s = new THREE.Mesh(stick, silver); s.position.set(x, -0.6, 0); t.add(s);
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 24), new THREE.MeshPhysicalMaterial({ color: 0xfffaf2, roughness: 0.5, sheen: 0.5, emissive: 0xffe8c8, emissiveIntensity: 0.15 })); candle.position.set(x, 0.33, 0); t.add(candle);
        const f = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), glow(0xffd27a)); f.scale.set(0.8, 1.9, 0.8); f.position.set(x, 0.62, 0); t.add(f);
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), glow(0xffffff)); core.scale.y = 1.6; core.position.set(x, 0.6, 0); t.add(core);
        const fh = sprite(SOFT, 0xffb050, 0.9, 0.8); fh.position.set(x, 0.63, 0); t.add(fh); flames.push([f, fh]); }
      const lt = { intensity: 0 };
      return (time) => { flames.forEach(([f, fh], i) => { const k = 1 + Math.sin(time * 13 + i * 2) * 0.08 + Math.sin(time * 23 + i) * 0.05; f.scale.set(0.8, 1.9 * k, 0.8); fh.material.opacity = 0.65 + (k - 1) * 3; }); lt.intensity = 2.6 + Math.sin(time * 17) * 0.4; };
    }
    if (id === 'reading') {   /* an open book with gold edges and a page that keeps turning */
      const cover = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.9), new THREE.MeshPhysicalMaterial({ color: 0xd6336c, roughness: 0.4, sheen: 1, sheenColor: 0xffb3d1, clearcoat: 0.5 })); cover.position.y = -0.3; t.add(cover);
      const pageGeo = (flip) => { const g = new THREE.PlaneGeometry(0.62, 0.84, 24, 1); g.translate(0.31, 0, 0); const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setZ(i, Math.sin(x / 0.62 * Math.PI * 0.5) * 0.12 + x * 0.05); } g.computeVertexNormals(); g.rotateX(-Math.PI / 2); if (flip) g.scale(-1, 1, 1); return g; };
      const pageTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 340; const x = c.getContext('2d'); x.fillStyle = '#f3e3da'; x.fillRect(0, 0, 256, 340);
        x.strokeStyle = 'rgba(200,120,150,.45)'; x.lineWidth = 5; x.lineCap = 'round'; for (let y = 50; y < 300; y += 26) { x.beginPath(); x.moveTo(30, y); x.lineTo(30 + 150 + ((y * 7) % 46), y); x.stroke(); }
        x.strokeStyle = '#d9a441'; x.lineWidth = 6; x.strokeRect(10, 10, 236, 320); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
      const paper = new THREE.MeshPhysicalMaterial({ map: pageTex, roughness: 0.8, side: THREE.DoubleSide, envMapIntensity: 0.35 });
      for (let k = 0; k < 5; k++) { const L = new THREE.Mesh(pageGeo(true), paper), Rr = new THREE.Mesh(pageGeo(false), paper); L.position.y = Rr.position.y = -0.27 + k * 0.012; t.add(L, Rr); }
      const edge = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.06, 0.02), gold); edge.position.set(0, -0.25, 0.43); t.add(edge);
      const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.5), new THREE.MeshPhysicalMaterial({ color: 0xf5c451, metalness: 0.6, roughness: 0.3, side: THREE.DoubleSide })); ribbon.position.set(0.12, -0.32, 0.6); ribbon.rotation.x = -1.2; t.add(ribbon);
      const turning = new THREE.Group(); turning.position.y = -0.2; t.add(turning); const tp = new THREE.Mesh(pageGeo(false), paper); turning.add(tp);
      const motes = [...Array(7)].map((_, k) => { const s = sprite(STAR, [0xffc2dd, 0xfff1b8, 0xffffff][k % 3], 0.12); t.add(s); return s; });
      t.rotation.x = 0.5;
      return (time) => { const c = (time * 0.35) % 1; turning.rotation.z = c < 0.6 ? Math.PI * (1 - Math.cos(c / 0.6 * Math.PI)) / 2 : Math.PI; tp.visible = c < 0.95;
        motes.forEach((s, k) => { const a = time * 0.6 + k / 7 * TAU, y = ((time * 0.25 + k / 7) % 1); s.position.set(Math.cos(a) * 0.4 * (1 - y), -0.1 + y * 1.1, Math.sin(a) * 0.3); s.material.opacity = Math.sin(y * Math.PI); }); };
    }
    if (id === 'math') {   /* crystal shapes that circle each other, splitting light into rainbows */
      const shapes = [new THREE.BoxGeometry(0.42, 0.42, 0.42), new THREE.TetrahedronGeometry(0.36), new THREE.OctahedronGeometry(0.34), new THREE.DodecahedronGeometry(0.3)];
      const mats = [mkCrystal(0xe2ccff), mkCrystal(0xffc2dd), mkCrystal(0xbff5ee), mkCrystal(0xfff1b8)];
      const ms = shapes.map((g, k) => { const m = new THREE.Mesh(g, mats[k]); t.add(m); return m; });
      const big = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 0), gem(0xb98cff, 0.6)); t.add(big);
      const orbitR = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.012, 8, 120), gold); orbitR.rotation.x = 1.2; t.add(orbitR);
      const orbitS = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.012, 8, 120), gold); orbitS.rotation.set(1.9, 0.6, 0); t.add(orbitS);
      return (time) => { ms.forEach((m, k) => { const a = time * 0.7 + k / 4 * TAU; m.position.set(Math.cos(a) * 0.62, Math.sin(a * 1.0) * 0.62 * Math.cos(1.2) * (k % 2 ? 1 : -1) * 0.5, Math.sin(a) * 0.62 * 0.5); m.rotation.set(time * 0.9 + k, time * 1.1, 0); });
        big.rotation.set(time * 0.4, time * 0.6, 0); };
    }
    if (id === 'science') {   /* a glass flask with glowing mint liquid, rising bubbles and atom rings */
      const prof = [[0, -0.55], [0.4, -0.55], [0.44, -0.5], [0.12, 0.05], [0.12, 0.38], [0.15, 0.42], [0.15, 0.45], [0.11, 0.45]].map(([x, y]) => new THREE.Vector2(x, y));
      const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), new THREE.MeshPhysicalMaterial({ color: 0xeafffb, roughness: 0, metalness: 0, transparent: true, opacity: 0.22, envMapIntensity: 0.6, side: THREE.DoubleSide, iridescence: 1, clearcoat: 1, depthWrite: false }));
      glass.renderOrder = 2; t.add(glass);
      const liq = new THREE.Mesh(new THREE.LatheGeometry([[0, -0.53], [0.39, -0.53], [0.42, -0.49], [0.22, -0.18], [0, -0.18]].map(([x, y]) => new THREE.Vector2(x, y)), 48), new THREE.MeshPhysicalMaterial({ color: 0x5fe3cf, emissive: 0x2fd3bf, emissiveIntensity: 1.2, roughness: 0.1, transparent: true, opacity: 0.9 }));
      t.add(liq);
      const bub = [...Array(9)].map((_, k) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.02 + (k % 3) * 0.01, 10, 8), glow(0xdffff9, 0.9)); t.add(b); return b; });
      const atom = new THREE.Group(); atom.position.y = 0.85; t.add(atom);
      const nuc = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 1), gem(0xff5fa2, 1)); atom.add(nuc);
      const elec = [0, 1, 2].map(k => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.008, 8, 80), glow(0xbff5ee, 0.8)); r.rotation.set(Math.PI / 2 + k * 1.0, k * 1.1, 0); atom.add(r);
        const e = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glow(0xffffff)); r.add(e); return e; });
      
      return (time) => { bub.forEach((b, k) => { const y = (time * 0.35 + k / 9) % 1; b.position.set(Math.sin(k * 3 + time) * 0.06 * (1 - y), -0.5 + y * 1.0, Math.cos(k * 5) * 0.05); b.scale.setScalar(Math.sin(y * Math.PI) + 0.2); });
        elec.forEach((e, k) => { const a = time * (2 + k * 0.5); e.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0); }); atom.rotation.y = time * 0.5; };
    }
    /* writing: a rose-gold fountain pen that writes a glowing gold swirl again and again */
    const pen = new THREE.Group(); t.add(pen);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.75, 32), new THREE.MeshPhysicalMaterial({ color: 0xff8fbf, metalness: 0.3, roughness: 0.15, clearcoat: 1, iridescence: 0.5 })); body.position.y = 0.45; pen.add(body);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.08, 32), roseGold); cap.position.y = 0.12; pen.add(cap);
    const end = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 12, 0, TAU, 0, Math.PI / 2), roseGold); end.position.y = 0.825; pen.add(end);
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.4, 0.03), roseGold); clip.position.set(0, 0.6, 0.065); pen.add(clip);
    const nib = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 4, 1), gold); nib.rotation.y = Math.PI / 4; nib.scale.z = 0.5; nib.position.y = -0.0; nib.rotation.x = Math.PI; pen.add(nib);
    const paper = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.01, 0.75), new THREE.MeshPhysicalMaterial({ color: 0xead2d8, roughness: 0.8, envMapIntensity: 0.35 })); paper.position.y = -0.55; t.add(paper);
    const pts = []; for (let k = 0; k <= 80; k++) { const s = k / 80, x = -0.42 + s * 0.84, a = s * TAU * 2.4; pts.push(new THREE.Vector3(x + Math.sin(a) * 0.06, -0.535, Math.cos(a) * 0.12 * (1 - Math.abs(s - 0.5)) - 0.02)); }
    const curve = new THREE.CatmullRomCurve3(pts), ink = new THREE.Mesh(new THREE.TubeGeometry(curve, 240, 0.012, 6), glow(0xffd27a)); t.add(ink);
    const total = ink.geometry.index.count;
    pen.rotation.z = -0.5; pen.rotation.x = 0.25; pen.scale.setScalar(1.5); t.rotation.x = 0.35;
    return (time) => { const c = (time * 0.22) % 1, s = Math.min(1, c / 0.8); ink.geometry.setDrawRange(0, Math.floor(total * s / 6) * 6); ink.material.opacity = c > 0.9 ? 1 - (c - 0.9) * 10 : 1;
      const p = curve.getPoint(Math.min(0.999, s)); pen.position.set(p.x + 0.0, p.y + 0.55 + 0.02, p.z); pen.position.y -= 0.0; nib.position.y = -0.0; pen.position.add(new THREE.Vector3(0.0, 0, 0)); pen.position.y = -0.535 + 0.09; pen.position.x = p.x + Math.sin(0.5) * 0.09; pen.position.z = p.z; };
  }

  /* ---------- glitter, bokeh, rose petals, butterflies, ribbons of light ---------- */
  const palette = [0xffffff, 0xfff1b8, 0xffc2dd, 0xd9c2ff, 0xbff5ee].map(c => new THREE.Color(c)), glitter = [];
  for (const [count, size, spread] of [[phoneish ? 900 : 1800, 0.07, 22], [phoneish ? 220 : 420, 0.17, 18]]) {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { pos[i * 3] = (Math.random() - 0.5) * spread * 2; pos[i * 3 + 1] = Math.random() * spread * 0.7 - 1; pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 2; const c = palette[i % 5]; col.set([c.r, c.g, c.b], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ size, map: STAR, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(p); glitter.push(p); }
  const bokeh = [...Array(16)].map((_, i) => { const s = sprite(SOFT, [0xff5fa2, 0xb98cff, 0xffd27a, 0x5fe3cf][i % 4], 1.5 + Math.random() * 3, 0.16); const a = Math.random() * TAU, r = 14 + Math.random() * 8;
    s.position.set(Math.cos(a) * r, 1 + Math.random() * 10, Math.sin(a) * r); scene.add(s); return s; });
  /* rose petals: soft, curved, in blush, rose, cream and lilac */
  const petalShape = new THREE.Shape(); petalShape.moveTo(0, -0.12); petalShape.bezierCurveTo(0.12, -0.08, 0.13, 0.08, 0, 0.13); petalShape.bezierCurveTo(-0.13, 0.08, -0.12, -0.08, 0, -0.12);
  const petalGeo = new THREE.ShapeGeometry(petalShape, 10); { const p = petalGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, x * x * 3 + y * 0.2); } petalGeo.computeVertexNormals(); }
  const PN = phoneish ? 90 : 160, petals = new THREE.InstancedMesh(petalGeo, new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide, roughness: 0.5, sheen: 1, sheenColor: 0xffffff, emissive: 0x401028, emissiveIntensity: 0.4 }), PN);
  const pdat = [...Array(PN)].map((_, i) => ({ x: (Math.random() - 0.5) * 22, z: (Math.random() - 0.5) * 18 - 1, y: Math.random() * 11, sp: 0.25 + Math.random() * 0.35, ph: Math.random() * TAU, rs: new THREE.Vector3(Math.random(), Math.random(), Math.random()) }));
  const pcols = [0xffb3d1, 0xff7aa8, 0xfff0f5, 0xe5c7ff, 0xffd6e6].map(c => new THREE.Color(c)); pdat.forEach((_, i) => petals.setColorAt(i, pcols[i % 5])); scene.add(petals);
  /* holographic butterflies */
  const wingShape = new THREE.Shape(); wingShape.moveTo(0, 0); wingShape.bezierCurveTo(0.12, 0.22, 0.38, 0.26, 0.34, 0.06); wingShape.bezierCurveTo(0.32, -0.04, 0.2, -0.06, 0.14, -0.04); wingShape.bezierCurveTo(0.26, -0.12, 0.2, -0.3, 0.06, -0.18); wingShape.lineTo(0, 0);
  const wingGeo = new THREE.ShapeGeometry(wingShape, 12), flies = [...Array(phoneish ? 4 : 7)].map((_, i) => {
    const m = new THREE.MeshPhysicalMaterial({ color: [0xffb3d6, 0xd9c2ff, 0xbff5ee, 0xfff1b8][i % 4], side: THREE.DoubleSide, iridescence: 1, iridescenceIOR: 1.8, metalness: 0.3, roughness: 0.2, emissive: [0xff5fa2, 0xb98cff, 0x5fe3cf, 0xf5c451][i % 4], emissiveIntensity: 0.5, transparent: true, opacity: 0.92 });
    const b = new THREE.Group(), L = new THREE.Mesh(wingGeo, m), Rw = new THREE.Mesh(wingGeo, m); Rw.scale.x = -1; const wl = new THREE.Group(), wr = new THREE.Group(); wl.add(L); wr.add(Rw); b.add(wl, wr);
    const bd = new THREE.Mesh(new THREE.CapsuleGeometry(0.015, 0.16, 4, 8), gold); bd.rotation.x = Math.PI / 2; b.add(bd); b.scale.setScalar(0.9 + Math.random() * 0.5);
    b.userData = { wl, wr, ph: Math.random() * TAU, r: 6 + Math.random() * 4, h: 2 + Math.random() * 4, sp: 0.12 + Math.random() * 0.1 }; scene.add(b); return b; });
  /* ribbons of light that circle the jewel box */
  const ribbons = [0xff5fa2, 0xb98cff, 0xffd27a].map((c, k) => { const pts = []; for (let i = 0; i <= 200; i++) { const s = i / 200, a = s * TAU * 1.5 + k * 2.1; pts.push(new THREE.Vector3(Math.cos(a) * (7.5 + k * 0.6), 0.6 + s * 6 + Math.sin(a * 2) * 0.4, Math.sin(a) * (7.5 + k * 0.6))); }
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.025, 6), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { c: { value: new THREE.Color(c) }, t: { value: 0 } }, vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'uniform vec3 c; uniform float t; varying vec2 vUv; void main(){ float w=fract(vUv.x*3.-t); float a=smoothstep(0.,.5,w)*smoothstep(1.,.5,w)*sin(vUv.x*3.14159); gl_FragColor=vec4(c*a*1.6,a); }' }));
    scene.add(m); return m; });

  /* ---------- glow (bloom) ---------- */
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.45, 0.9); composer.addPass(bloom); composer.addPass(new OutputPass());

  /* ---------- light mode ---------- */
  function applyLite() {
    mirror.visible = !lite; plainFloor.visible = lite; veil.material.opacity = lite ? 0.9 : 1;
    glitter[1].visible = !lite; glitter[0].geometry.setDrawRange(0, lite ? 600 : Infinity);
    petals.count = lite ? 40 : PN; flies.forEach((f, i) => f.visible = !lite || i < 2); bokeh.forEach((b, i) => b.visible = !lite || i < 6);
    
    pav.forEach((p, i) => p.lamp.visible = !lite || i === focus);
    renderer.setPixelRatio(lite ? 1 : Math.min(devicePixelRatio || 1, 1.5)); fit();
  }

  /* ---------- the camera, the turning ring and her moves ---------- */
  let focus = o.focus || 0, angle = -focus / places.length * TAU, dragOff = 0, dragTo = 0;
  let entered = false, zoom = 0, nudge = 0, intro = calm ? 1 : 0;
  /* glides run on the real clock (not frame by frame), so a slow computer still glides in the same time */
  const now = () => performance.now() / 1000;
  const backOut = x => { const c = 1.25; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }, smooth = x => x * x * (3 - 2 * x);
  const tween = (v, dur, ease) => ({ from: v, to: v, t0: 0, dur, ease, get() { const k = Math.min(1, (now() - this.t0) / this.dur); return this.from + (this.to - this.from) * this.ease(k); }, set(to) { this.from = this.get(); this.to = to; this.t0 = now(); } });
  const glide = tween(angle, calm ? 0.2 : 0.8, calm ? smooth : backOut), zoomT = tween(0, calm ? 0.2 : 1.0, smooth), twirlT = tween(0, calm ? 0.01 : 1.4, backOut);
  const aim = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  if (!calm) { addEventListener('pointermove', e => { aim.x = e.clientX / innerWidth * 2 - 1; aim.y = e.clientY / innerHeight * 2 - 1; });
    addEventListener('deviceorientation', e => { if (e.gamma == null) return; aim.x = Math.max(-1, Math.min(1, e.gamma / 30)); aim.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }); }
  let portrait = false;
  function fit() { const w = innerWidth, h = innerHeight; portrait = w / h < 0.9; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.fov = portrait ? 52 : 36;
    camera.setViewOffset(w, h, 0, Math.round(h * (portrait ? 0.07 : 0.03)), w, h); camera.updateProjectionMatrix();
    bloom.resolution.set(Math.round(w / 2), Math.round(h / 2)); }
  addEventListener('resize', fit); applyLite();
  const shortest = (from, to) => { let d = (to - from) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return from + d; };
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), look = new THREE.Vector3(), camPos = new THREE.Vector3(), tmp = new THREE.Vector3();

  const clock = new THREE.Clock(); let fpsT = 0, fpsN = 0, checked = !!o.full || lite;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, sp = calm ? 0 : 1;
    if (!checked && t > 2) { const now = performance.now(); if (!fpsT) fpsT = now; fpsN++; if (now - fpsT > 3000) { checked = true; if (fpsN / ((now - fpsT) / 1000) < 24) { lite = true; applyLite(); o.onAutoLite && o.onAutoLite(); } } }
    intro = calm ? 1 : Math.min(1, t * 0.45); const e = 1 - Math.pow(1 - intro, 3);
    /* the ring glides to the place in front with a soft spring */
    dragOff += (dragTo - dragOff) * Math.min(1, dt * 18);
    angle = glide.get();
    ring.rotation.y = angle + dragOff;
    zoom = zoomT.get(); const z = zoom;
    cur.x += (aim.x - cur.x) * 0.04; cur.y += (aim.y - cur.y) * 0.04;
    if (portrait) { camPos.set(cur.x * 0.8, 5.6 - cur.y * 0.4, R + 16); look.set(0, 2.6, R - 3); } else { camPos.set(cur.x * 1.4, 4.6 - cur.y * 0.6, R + 13.2); look.set(0, 2.25, R - 3.5); }
    camPos.y += (1 - e) * 3; camPos.z += (1 - e) * 2;
    tmp.set(0, 2.7, R + (portrait ? 10 : 8)); camPos.lerp(tmp, z); look.lerp(tmp.set(0, 1.45, R), z);
    camera.position.copy(camPos); camera.lookAt(look);
    /* the place in front stands taller and brighter */
    pav.forEach((p, i) => { const front = i === focus, sTo = front ? 1.12 : 0.9; p.sc += (sTo - p.sc) * Math.min(1, dt * 6 + (calm ? 1 : 0)); if (Math.abs(sTo - p.sc) > 0.15 && dt >= 0.05) p.sc = sTo; p.g.scale.setScalar(p.sc + (front ? Math.sin(nudge * 18) * nudge * 0.08 : 0));
      p.halo.material.opacity += ((front ? (entered ? 0.12 : 0.35) : 0.12) - p.halo.material.opacity) * Math.min(1, dt * 5); p.beam.material.uniforms.k.value += ((front ? (entered ? 0 : 0.3) : 0.12) - p.beam.material.uniforms.k.value) * Math.min(1, dt * 5);
      p.thing.position.y = 1.55 + Math.sin(t * 1.3 + i) * 0.07 * sp; p.thing.rotation.y = (front ? Math.sin(t * 0.5) * 0.35 : t * 0.3 + i) * sp - (p.th + ring.rotation.y) * (front ? 1 : 0) * 0;
      p.anim(calm ? 1.5 + i : t, dt); p.host.position.y = 2.45 + Math.sin(t * 1.1 + i * 1.3) * 0.08 * sp; p.host.material.opacity += ((entered && i !== focus ? 0.25 : 1) - p.host.material.opacity) * Math.min(1, dt * 4); p.orbit.rotation.y = t * 0.6 * sp; p.fin.rotation.y = t * 1.2 * sp; });
    nudge = Math.max(0, nudge - dt * 1.6);
    /* the crown sways, twirls when tapped, and its jewels glint */
    crown.rotation.y = twirlT.get();
    crown.rotation.z = Math.sin(t * 0.7) * 0.04 * sp; crown.rotation.x = 0.32; crownRig.position.y = 4.9 + Math.sin(t * 0.9) * 0.08 * sp - (1 - e) * 2;
    chandelier.rotation.y = t * 0.08 * sp;
    jewels.forEach((j, i) => { if (j.spark) { const k = Math.pow(Math.max(0, Math.sin(t * 1.4 + i * 1.7)), 10); const s = (0.15 + j.v * 0.5) * (calm ? 0.4 : k); j.spark.scale.set(s, s, 1); j.spark.material.rotation = t; } });
    crownSparks.forEach((s, i) => { const a = t * 0.4 + s.userData.off, k = Math.pow(Math.max(0, Math.sin(t * 2 + s.userData.off * 3)), 8) * sp; s.position.set(Math.cos(a) * 2.6, 2.0 - (i % 3) * 0.3, Math.sin(a) * 2.6); s.scale.setScalar(0.05 + k * 0.5); });
    glitter[0].rotation.y = t * 0.015 * sp; glitter[1].rotation.y = -t * 0.025 * sp;
    glitter[0].material.opacity = 0.75 + Math.sin(t * 3.1) * 0.2 * sp; glitter[1].material.opacity = 0.7 + Math.sin(t * 2.3 + 1) * 0.3 * sp;
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), eu = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < petals.count; i++) { const d = pdat[i]; if (sp) { d.y -= d.sp * dt; if (d.y < -0.2) d.y = 11; }
      eu.set(d.rs.x * t * sp + d.ph, d.rs.y * t * sp, d.rs.z * t * 0.5 * sp); q.setFromEuler(eu);
      mm.compose(tmp.set(d.x + Math.sin(t * 0.8 + d.ph) * 0.5 * sp, d.y, d.z + Math.cos(t * 0.6 + d.ph) * 0.3 * sp), q, one); petals.setMatrixAt(i, mm); }
    petals.instanceMatrix.needsUpdate = true;
    flies.forEach((b, i) => { const u = b.userData, a = t * u.sp * (sp || 0.0001) + u.ph; b.position.set(Math.cos(a) * u.r, u.h + Math.sin(a * 2.3) * 0.8, Math.sin(a) * u.r * 0.8 - 1);
      b.rotation.y = -a + Math.PI; b.rotation.z = Math.sin(a * 3) * 0.2; const f = Math.sin(t * 14 + i) * 0.9 * (sp || 0.3) + (calm ? 0.6 : 0); u.wl.rotation.y = f; u.wr.rotation.y = -f; });
    ribbons.forEach((r, k) => { r.material.uniforms.t.value = t * 0.12 * (sp || 0) + k * 0.3; });
    if (lite) renderer.render(scene, camera); else composer.render(dt);
    o.onFrame && o.onFrame();
    if (!stopped) requestAnimationFrame(frame);
  }
  let stopped = false;
  fit(); frame();

  return {
    focus(i) { const old = focus; focus = i; glide.set(shortest(glide.get(), -i / places.length * TAU)); if (lite) pav.forEach((p, k) => p.lamp.visible = k === focus); return old; },
    drag(f, release) { dragTo = release ? 0 : f * TAU / places.length * 1.2; if (release) { const to = glide.to; glide.from = glide.get() + dragOff; glide.to = to; glide.t0 = now(); dragOff = 0; } },
    enter() { entered = true; zoomT.set(1); },
    back() { entered = false; zoomT.set(0); },
    twirl() { twirlT.set(twirlT.to + TAU); },
    nudge() { nudge = 1; },
    setLite(on) { lite = on; checked = true; applyLite(); },
    pick(x, y) { ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects([crownHit].concat(pav.map(p => p.hit)), false); if (!hits.length) return null;
      return hits[0].object === crownHit ? 'crown' : hits[0].object.userData.idx; },
    get lite() { return lite; },
    stop() { stopped = true; canvas.style.display = 'none'; },
  };
}
