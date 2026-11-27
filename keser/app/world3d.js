/* HER WORLD in 3D, built from the painted art (picture order 2, keser/PICTURE-ORDERS.md): a twilight sky with rose-crystal arches,
   a rose-quartz jewel-box stage, a picture for each place gliding round it, and her gold Keser crown floating above.
   HoS 2026-11-26: "the crown looks very cheap ... use the pictures that ChatGPT is giving." So nothing here is drawn as plain shapes:
   every object is a painting; code only adds depth, light, glitter, drifting petals, glints and glow.
   Her progress: each subject has a jewel on the crown; it is dim until she starts and glows and glints more as she learns.
   Light mode (slow computers): no glow pass, fewer petals and glitter. Reduce motion: everything still, glides are quick. */
import * as THREE from 'three';
import { EffectComposer } from './vendor/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './vendor/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './vendor/postprocessing/OutputPass.js';

const TAU = Math.PI * 2, R = 5.0;
/* M. Heinemann 2026-11-26: the Keser Academy colors (royal purple and gold) and the Keser crown mark from the school logo (keser-logo-mark).
   Each place shows its own picture (places.js: art); the stage painting is tinted royal purple. */
const ART = { crown: '/pics/keser-logo-mark.webp' };
/* where each place's jewel sits on the Keser crown (0..1 across and down the picture): the diamond in the middle, and the two at the sides */
const GEMS = { kodesh: [0.5, 0.67, 1.5], general: [0.045, 0.33, 1], timeline: [0.955, 0.35, 1] };

export function start(o) {
  const { canvas, places, progress, calm } = o;
  let lite = !!o.lite;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no WebGL');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
  const phoneish = Math.min(innerWidth, innerHeight) < 600;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200); scene.add(camera);

  /* ---------- the paintings ---------- */
  let ready = false; const manager = new THREE.LoadingManager(() => { ready = true; });
  const loader = new THREE.TextureLoader(manager);
  const tex = src => { const t = loader.load(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const painting = (src, h, aspect) => { const m = new THREE.SpriteMaterial({ map: tex(src), transparent: true, depthWrite: false });
    const s = new THREE.Sprite(m); s.scale.set(h * aspect, h, 1); s.userData.h = h; s.userData.aspect = aspect; return s; };
  const radial = (stops, size = 128) => { const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'), g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([p, col]) => g.addColorStop(p, col)); x.fillStyle = g; x.fillRect(0, 0, size, size); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const SOFT = radial([[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,.45)'], [1, 'rgba(255,255,255,0)']]);
  const DIM = radial([[0, 'rgba(28,10,48,.82)'], [0.55, 'rgba(28,10,48,.6)'], [1, 'rgba(28,10,48,0)']]);
  const STAR = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    x.globalCompositeOperation = 'lighter'; x.fillStyle = '#fff'; x.beginPath(); x.moveTo(32, 0); x.lineTo(34.5, 29.5); x.lineTo(64, 32); x.lineTo(34.5, 34.5); x.lineTo(32, 64); x.lineTo(29.5, 34.5); x.lineTo(0, 32); x.lineTo(29.5, 29.5); x.closePath(); x.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const glowSprite = (map, color, s, op) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map, color, transparent: true, opacity: op == null ? 1 : op, depthWrite: false, blending: THREE.AdditiveBlending })); m.scale.set(s, s, 1); return m; };

  /* the sky: a wide painting far behind, a little larger than the view so it can drift as she moves */
  const skyTex = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d'), g = x.createRadialGradient(256, 110, 10, 256, 128, 300);
    g.addColorStop(0, '#4B2A85'); g.addColorStop(0.35, '#3A1F6A'); g.addColorStop(0.7, '#2A1650'); g.addColorStop(1, '#170A2E');   /* deep Keser purple (M. Heinemann 2026-11-27) */ x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    /* soft veils of the Keser house colors drifting through the purple: Keser Torah maroon, Keser Malchus royal blue, Keser Kehuna green */
    x.globalCompositeOperation = 'screen';
    for (const [cx, cy, r, col] of [[70, 70, 190, 'rgba(142,31,53,.28)'], [450, 60, 200, 'rgba(47,95,208,.25)'], [256, 250, 230, 'rgba(31,143,92,.2)'], [120, 230, 150, 'rgba(27,42,94,.35)']]) {
      const v = x.createRadialGradient(cx, cy, 0, cx, cy, r); v.addColorStop(0, col); v.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = v; x.fillRect(0, 0, 512, 256); }
    x.globalCompositeOperation = 'source-over';
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();   /* royal purple, deepening at the edges */
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: skyTex, depthWrite: false, fog: false }));
  sky.renderOrder = -10; scene.add(sky);

  /* the stage: the rose-quartz jewel box, always facing her; a soft glow beneath it */
  const stageGlow = glowSprite(SOFT, 0xd4aa50, 1, 0.35); scene.add(stageGlow);
  const floorTex = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 484; const x = c.getContext('2d'), cx = 512, cy = 242;
    x.save(); x.translate(cx, cy); x.scale(1, 484 / 1024);
    const g = x.createRadialGradient(0, 0, 40, 0, 0, 500); g.addColorStop(0, 'rgba(110,70,170,.85)'); g.addColorStop(0.6, 'rgba(75,42,133,.55)'); g.addColorStop(1, 'rgba(42,22,80,0)'); x.fillStyle = g; x.beginPath(); x.arc(0, 0, 500, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(212,170,80,.7)'; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 430, 0, TAU); x.stroke(); x.lineWidth = 1.5; x.strokeStyle = 'rgba(246,227,176,.4)'; x.beginPath(); x.arc(0, 0, 400, 0, TAU); x.stroke();
    x.restore(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  /* a soft lit floor in Keser purple with fine gold rings (M. Heinemann 2026-11-27: flow, not stuck on) */
  const stage = new THREE.Sprite(new THREE.SpriteMaterial({ map: floorTex, transparent: true, depthWrite: false })); stage.renderOrder = -5; scene.add(stage);

  /* the places on a ring that turns; each glows in its Keser house color, with a Keser girl in the school uniform beside it */
  const ring = new THREE.Group(); scene.add(ring);
  /* M. Heinemann 2026-11-27: "it kind of looks like stuck on ... It needs to like flow more and be a little bit more clear."
     Each place is a framed card that belongs to the scene: rounded, a fine gold frame, the picture filling it, a soft glow in its house color,
     a gentle float and sway; the two places stand side by side so both are always in view. */
  const CW = 600, CH = 780;
  function card(pl) {
    const c = document.createElement('canvas'); c.width = CW; c.height = CH; const x = c.getContext('2d'), t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const rr = (X, Y, W, H, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); };
    const draw = img => { x.clearRect(0, 0, CW, CH);
      const P = 26, R0 = 46;
      const gold = x.createLinearGradient(0, 0, CW, CH); gold.addColorStop(0, '#F6E3B0'); gold.addColorStop(0.45, '#D4AA50'); gold.addColorStop(0.55, '#B8892E'); gold.addColorStop(1, '#F6E3B0');
      rr(P, P, CW - 2 * P, CH - 2 * P, R0); x.fillStyle = gold; x.fill();                                  /* the gold frame */
      rr(P + 8, P + 8, CW - 2 * P - 16, CH - 2 * P - 16, R0 - 8); x.fillStyle = pl.color; x.fill();        /* the house color */
      if (img) { x.save(); rr(P + 14, P + 14, CW - 2 * P - 28, CH - 2 * P - 28, R0 - 14); x.clip();
        const W = CW - 2 * P - 28, H = CH - 2 * P - 28, cover = pl.id !== 'timeline', s = cover ? Math.max(W / img.width, H / img.height) : Math.min(W / img.width, H / img.height) * 0.92;
        if (!cover) { const gr = x.createRadialGradient(CW / 2, CH / 2, 40, CW / 2, CH / 2, CH * 0.6); gr.addColorStop(0, 'rgba(255,255,255,.16)'); gr.addColorStop(1, 'rgba(0,0,0,.25)'); x.fillStyle = gr; x.fillRect(P + 14, P + 14, W, H); }   /* the timeline sits on its own deep green, not on white */
        x.drawImage(img, P + 14 + (W - img.width * s) / 2, P + 14 + (H - img.height * s) / 2, img.width * s, img.height * s);
        const v = x.createLinearGradient(0, P, 0, CH - P); v.addColorStop(0, 'rgba(255,255,255,.18)'); v.addColorStop(0.25, 'rgba(255,255,255,0)'); x.fillStyle = v; x.fillRect(0, 0, CW, CH);   /* a soft sheen, like glass */
        x.restore(); }
      t.needsUpdate = true; };
    draw(null); manager.itemStart(pl.art); const img = new Image(); img.onload = () => { draw(img); manager.itemEnd(pl.art); }; img.onerror = () => manager.itemEnd(pl.art); img.src = pl.art;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); const h = 3.1; sp.scale.set(h * CW / CH, h, 1); return sp;
  }
  /* two or three places stand side by side on a gentle arc (so none hides behind another); more would go round a full ring */
  const STEP = places.length <= 3 ? 0.62 : TAU / places.length;
  const pav = places.map((pl, i) => {
    const th = i * STEP, g = new THREE.Group(); g.position.set(Math.sin(th) * R, 0, Math.cos(th) * R); ring.add(g);
    const halo = glowSprite(SOFT, pl.hex, 5.2, 0.35); halo.position.y = 1.7; g.add(halo);
    const pool = glowSprite(SOFT, pl.hex, 1, 0.5); pool.scale.set(3.6, 0.9, 1); pool.position.y = -0.05; g.add(pool);   /* a pool of its color on the floor beneath it */
    const dome = card(pl); dome.center.set(0.5, 0); dome.position.y = 0.75; g.add(dome);
    if (pl.id === 'general') dome.material.color.set(0xb4c6ff);
    /* a Keser girl in the school uniform stands on the stage beside her place */
    const girl = pl.girl ? painting(pl.girl, 2.9, pl.girlAspect) : null; if (girl) { girl.center.set(0.5, 0); girl.position.set(i === 0 ? -1.75 : 1.75, -0.2, 0.6); g.add(girl); }   /* on the side away from the other place, so nothing covers anything */   /* the rose glass dome tinted toward the Keser Malchus royal blue */
    const motes = [...Array(0)].map((_, k) => { const s = glowSprite(STAR, [0xffffff, 0xfff1b8, pl.hex][k % 3], 0.2); s.userData.k = k; g.add(s); return s; });
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 4, 10), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 2; hit.userData.idx = i; g.add(hit);
    return { g, th, halo, pool, dome, girl, motes, hit, sc: 1 };
  });

  /* her crown: the painted tiara high in the middle, with a jewel per subject that lights up as she learns */
  const crownRig = new THREE.Group(); crownRig.position.set(0, 6.0, 0); scene.add(crownRig);
  const crownHalo = glowSprite(radial([[0, 'rgba(255,214,140,.75)'], [0.45, 'rgba(140,80,200,.3)'], [1, 'rgba(140,80,200,0)']]), 0xffffff, 7.5, 0.9); crownRig.add(crownHalo);
  const crownH = 2.8, crownW = crownH * 600 / 472;
  const crown = painting(ART.crown, crownH, 600 / 472); crownRig.add(crown);
  const jewels = places.map((pl, i) => { const [u, v, big] = GEMS[pl.id], p = progress[pl.id] || 0;
    const pos = new THREE.Vector3((u - 0.5) * crownW, (0.5 - v) * crownH, 0.02);
    const dim = new THREE.Sprite(new THREE.SpriteMaterial({ map: DIM, transparent: true, depthWrite: false, opacity: 0 }));   /* the Keser crown is gold line art: a jewel not started yet simply has no glow */ dim.scale.set(0.34 * big, 0.34 * big, 1); dim.position.copy(pos); crownRig.add(dim);
    const glow = glowSprite(SOFT, pl.hex, (0.35 + p * 0.55) * big, p > 0 ? 0.35 + p * 0.5 : 0); glow.position.copy(pos); crownRig.add(glow);
    const glint = glowSprite(STAR, 0xffffff, 0.01); glint.position.copy(pos).add(new THREE.Vector3(0, 0, 0.04)); crownRig.add(glint);
    return { glint, glow, p, i }; });
  const crownHit = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); crownRig.add(crownHit);
  const crownSparks = [...Array(4)].map((_, i) => { const s = glowSprite(STAR, [0xffffff, 0xf6e3b0, 0xd4aa50][i % 3], 0.01); s.userData.off = i * 0.83; crownRig.add(s); return s; });

  /* ---------- glitter, bokeh and drifting rose petals ---------- */
  const palette = [0xffffff, 0xf6e3b0, 0xd4aa50, 0xf6e3b0, 0xffffff, 0xd4aa50].map(c => new THREE.Color(c)), glitter = [];   /* gold glitter with sparks of maroon-rose, royal blue and green */
  for (const [count, size, spread] of [[phoneish ? 120 : 220, 0.07, 20], [phoneish ? 30 : 50, 0.14, 16]]) {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { pos[i * 3] = (Math.random() - 0.5) * spread * 2; pos[i * 3 + 1] = Math.random() * spread * 0.6 - 0.5; pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 1.6; const c = palette[i % 6]; col.set([c.r, c.g, c.b], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ size, map: STAR, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(p); glitter.push(p); }
  const bokeh = [...Array(14)].map((_, i) => { const s = glowSprite(SOFT, [0x8a55bc, 0xa3263f, 0x2f5fd0, 0x1f8f5c, 0xd4aa50][i % 5], 1.2 + Math.random() * 2.4, 0.14); const a = Math.random() * TAU;
    s.position.set(Math.cos(a) * (10 + Math.random() * 6), 1 + Math.random() * 8, -4 - Math.random() * 8); scene.add(s); return s; });
  const petalShape = new THREE.Shape(); petalShape.moveTo(0, -0.12); petalShape.bezierCurveTo(0.12, -0.08, 0.13, 0.08, 0, 0.13); petalShape.bezierCurveTo(-0.13, 0.08, -0.12, -0.08, 0, -0.12);
  const petalGeo = new THREE.ShapeGeometry(petalShape, 10); { const p = petalGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, x * x * 3 + y * 0.2); } petalGeo.computeVertexNormals(); }
  const PN = phoneish ? 70 : 120, petals = new THREE.InstancedMesh(petalGeo, new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, emissive: 0x3a1660, emissiveIntensity: 0.6 }), PN);
  scene.add(new THREE.AmbientLight(0xffe4f0, 1.4)); const sun = new THREE.DirectionalLight(0xfff1d0, 1.2); sun.position.set(3, 8, 6); scene.add(sun);
  const pdat = [...Array(PN)].map(() => ({ x: (Math.random() - 0.5) * 20, z: (Math.random() - 0.5) * 14 + 1, y: Math.random() * 11, sp: 0.25 + Math.random() * 0.35, ph: Math.random() * TAU, rs: new THREE.Vector3(Math.random(), Math.random(), Math.random()) }));
  const pcols = [0xd4aa50, 0xa3263f, 0x2f5fd0, 0x1f8f5c, 0x8a55bc].map(c => new THREE.Color(c));   /* petals in gold, purple and the three house colors */ pdat.forEach((_, i) => petals.setColorAt(i, pcols[i % 5])); scene.add(petals);

  /* ---------- glow ---------- */
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.45, 0.5, 0.86); composer.addPass(bloom); composer.addPass(new OutputPass());

  function applyLite() {
    glitter[1].visible = !lite; glitter[0].geometry.setDrawRange(0, Infinity);
    petals.count = 0; bokeh.forEach(b => b.visible = false);   /* less busy (M. Heinemann 2026-11-27): no petals or bokeh */
    renderer.setPixelRatio(lite ? 1 : Math.min(devicePixelRatio || 1, 1.5)); fit();
  }

  /* ---------- camera, the turning ring, her moves ---------- */
  let focus = o.focus || 0, angle = -focus * STEP, dragOff = 0, dragTo = 0, entered = false, nudge = 0;
  const now = () => performance.now() / 1000;
  const backOut = x => { const c = 1.25; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }, smooth = x => x * x * (3 - 2 * x);
  const tween = (v, dur, ease) => ({ from: v, to: v, t0: 0, dur, ease, get() { const k = Math.min(1, (now() - this.t0) / this.dur); return this.from + (this.to - this.from) * this.ease(k); }, set(to) { this.from = this.get(); this.to = to; this.t0 = now(); } });
  const glide = tween(angle, calm ? 0.2 : 0.8, calm ? smooth : backOut), zoomT = tween(0, calm ? 0.2 : 1.0, smooth), twirlT = tween(0, calm ? 0.01 : 1.2, backOut);
  const aim = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  if (!calm) { addEventListener('pointermove', e => { aim.x = e.clientX / innerWidth * 2 - 1; aim.y = e.clientY / innerHeight * 2 - 1; });
    addEventListener('deviceorientation', e => { if (e.gamma == null) return; aim.x = Math.max(-1, Math.min(1, e.gamma / 30)); aim.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }); }
  let portrait = false;
  function fit() { const w = innerWidth, h = innerHeight; portrait = w / h < 0.9; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.fov = portrait ? 58 : 38; camera.updateProjectionMatrix();
    bloom.resolution.set(Math.round(w / 2), Math.round(h / 2));
    /* the sky fills the view behind everything */
    const d = 40, vh = 2 * d * Math.tan(camera.fov * Math.PI / 360) * 1.2, vw = vh * Math.max(camera.aspect, 2); sky.scale.set(vw, vw / 2, 1); }
  addEventListener('resize', fit);
  const shortest = (from, to) => { let d = (to - from) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return from + d; };
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), look = new THREE.Vector3(), camPos = new THREE.Vector3(), tmp = new THREE.Vector3(), dir = new THREE.Vector3();

  const clock = new THREE.Clock(); let fpsT = 0, fpsN = 0, checked = !!o.full || lite, stopped = false, shown = 0;
  function frame() {
    if (stopped) return; requestAnimationFrame(frame);
    if (!ready) return;   /* wait until every painting has arrived (the glowing crown shows meanwhile) */
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, sp = calm ? 0 : 1;
    if (!checked && t > 2) { const n = performance.now(); if (!fpsT) fpsT = n; fpsN++; if (n - fpsT > 3000) { checked = true; if (fpsN / ((n - fpsT) / 1000) < 24) { lite = true; applyLite(); o.onAutoLite && o.onAutoLite(); } } }
    const e = calm ? 1 : smooth(Math.min(1, t * 0.6));
    dragOff += (dragTo - dragOff) * Math.min(1, dt * 18); angle = glide.get(); ring.rotation.y = angle + dragOff;
    const z = zoomT.get();
    cur.x += (aim.x - cur.x) * 0.04; cur.y += (aim.y - cur.y) * 0.04;
    if (portrait) { camPos.set(cur.x * 0.8, 4.6 - cur.y * 0.4, R + 14.5); look.set(0, 2.9, 0); } else { camPos.set(cur.x * 1.4, 3.8 - cur.y * 0.6, R + 12.5); look.set(0, 2.5, 0); }
    camPos.z += (1 - e) * 3; camPos.y += (1 - e) * 1.5;
    tmp.set(0, 2.6, R + (portrait ? 9 : 7.2)); camPos.lerp(tmp, z); look.lerp(tmp.set(0, 1.9, R), z);
    camera.position.copy(camPos); camera.lookAt(look);
    /* the sky sits far behind, facing her, drifting a little against the near things */
    camera.getWorldDirection(dir); sky.position.copy(camera.position).addScaledVector(dir, 40); sky.position.x -= cur.x * 1.5; sky.lookAt(camera.position);
    /* the stage lies under the ring; the domes stand on it */
    stage.scale.set(R * 2 * 1.18, R * 2 * 1.18 * 756 / 1600, 1); stage.position.set(0, -0.55 - (portrait ? 0.3 : 0), 0); stage.material.opacity = 1 - z * 0.15;
    stageGlow.scale.set(R * 3.4, R * 1.6, 1); stageGlow.position.set(0, -0.4, -0.5);
    pav.forEach((p, i) => { const front = i === focus, sTo = front ? 1.15 : 0.86; p.sc += (sTo - p.sc) * Math.min(1, dt * 6 + (calm ? 1 : 0)); if (Math.abs(sTo - p.sc) > 0.15 && dt >= 0.05) p.sc = sTo;
      const s = p.sc + (front ? Math.sin(nudge * 18) * nudge * 0.06 : 0); p.g.scale.setScalar(s); p.g.rotation.y = -ring.rotation.y;   /* keep each host girl on her dome's right side */
      p.dome.position.y = 0.75 + Math.sin(t * 0.9 + i * 1.7) * 0.09 * sp; p.dome.material.rotation = Math.sin(t * 0.6 + i) * 0.025 * sp;   /* a gentle float and sway */
      p.pool.material.opacity += ((front ? 0.55 : 0.2) - p.pool.material.opacity) * Math.min(1, dt * 5);
      p.halo.material.opacity += ((front ? 0.5 : 0.22) - p.halo.material.opacity) * Math.min(1, dt * 5);
      p.dome.material.opacity += ((front ? 1 : 0.6) - p.dome.material.opacity) * Math.min(1, dt * 4);
      if (p.girl) p.girl.material.opacity += ((front && !entered ? 1 : 0) - p.girl.material.opacity) * Math.min(1, dt * 4);   /* her girl stands beside the place in front only */
      p.motes.forEach(m => { const k = m.userData.k, y = ((t * 0.22 + k / p.motes.length) % 1); m.position.set(Math.sin(k * 2.3 + t * 0.7 * sp) * 0.7, 0.8 + y * 2.6, 0.3); m.material.opacity = Math.sin(y * Math.PI) * (calm ? 0.5 : 0.9); m.scale.setScalar(0.12 + 0.12 * Math.sin(y * Math.PI)); }); });
    nudge = Math.max(0, nudge - dt * 1.6);
    /* the crown floats, twirls when tapped (it turns like a card), and its jewels glint */
    crownRig.position.y = 6.0 + Math.sin(t * 0.9) * 0.1 * sp - (1 - e) * 1.2; const tw = twirlT.get();
    crown.scale.x = crownW * Math.cos(tw); crownHalo.material.rotation = t * 0.1 * sp;
    jewels.forEach(j => { const k = calm ? 0.4 : Math.pow(Math.max(0, Math.sin(t * 1.3 + j.i * 1.9)), 10); const s = j.p > 0 ? (0.25 + j.p * 0.6) * k : 0; j.glint.scale.set(s, s, 1); j.glint.material.rotation = t * 0.8;
      if (j.p > 0) j.glow.material.opacity = (0.3 + j.p * 0.45) * (0.8 + 0.2 * Math.sin(t * 2 + j.i)); });
    crownSparks.forEach((s, i) => { const a = t * 0.35 + s.userData.off, k = Math.pow(Math.max(0, Math.sin(t * 1.7 + s.userData.off * 3)), 8) * sp; s.position.set(Math.cos(a) * 2.4, Math.sin(a * 1.3) * 0.8, 0.2); s.scale.setScalar(0.04 + k * 0.45); });
    glitter[0].rotation.y = t * 0.012 * sp; glitter[1].rotation.y = -t * 0.02 * sp;
    glitter[0].material.opacity = 0.75 + Math.sin(t * 3.1) * 0.2 * sp; glitter[1].material.opacity = 0.7 + Math.sin(t * 2.3 + 1) * 0.3 * sp;
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), eu = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < petals.count; i++) { const d = pdat[i]; if (sp) { d.y -= d.sp * dt; if (d.y < -0.5) d.y = 11; }
      eu.set(d.rs.x * t * sp + d.ph, d.rs.y * t * sp, d.rs.z * t * 0.5 * sp); q.setFromEuler(eu);
      mm.compose(tmp.set(d.x + Math.sin(t * 0.8 + d.ph) * 0.5 * sp, d.y, d.z + Math.cos(t * 0.6 + d.ph) * 0.3 * sp), q, one); petals.setMatrixAt(i, mm); }
    petals.instanceMatrix.needsUpdate = true;
    if (lite) renderer.render(scene, camera); else composer.render(dt);
    if (++shown > 1) o.onFrame && o.onFrame();
  }
  applyLite(); fit(); frame();

  return {
    focus(i) { const old = focus; focus = i; glide.set(shortest(glide.get(), -i * STEP)); return old; },
    drag(f, release) { dragTo = release ? 0 : f * STEP * 1.2; if (release) { const to = glide.to; glide.from = glide.get() + dragOff; glide.to = to; glide.t0 = now(); dragOff = 0; } },
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
