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
const ART = { crown: '/pics/keser-logo-mark.webp', stage: '/pics/keser-stage.webp' };
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
    g.addColorStop(0, '#8A55BC'); g.addColorStop(0.35, '#5D2B88'); g.addColorStop(0.7, '#3A1660'); g.addColorStop(1, '#1C0A30'); x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    /* soft veils of the Keser house colors drifting through the purple: Keser Torah maroon, Keser Malchus royal blue, Keser Kehuna green */
    x.globalCompositeOperation = 'screen';
    for (const [cx, cy, r, col] of [[70, 70, 190, 'rgba(163,38,63,.55)'], [450, 60, 200, 'rgba(47,95,208,.5)'], [256, 250, 230, 'rgba(31,143,92,.38)'], [120, 230, 150, 'rgba(27,42,94,.6)']]) {
      const v = x.createRadialGradient(cx, cy, 0, cx, cy, r); v.addColorStop(0, col); v.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = v; x.fillRect(0, 0, 512, 256); }
    x.globalCompositeOperation = 'source-over';
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();   /* royal purple, deepening at the edges */
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: skyTex, depthWrite: false, fog: false }));
  sky.renderOrder = -10; scene.add(sky);

  /* the stage: the rose-quartz jewel box, always facing her; a soft glow beneath it */
  const stageGlow = glowSprite(SOFT, 0xd4aa50, 1, 0.35); scene.add(stageGlow);
  const stage = painting(ART.stage, 1, 1600 / 756); stage.material.color.set(0x9070d0); stage.renderOrder = -5; scene.add(stage);

  /* the places on a ring that turns; each glows in its Keser house color, with a Keser girl in the school uniform beside it */
  const ring = new THREE.Group(); scene.add(ring);
  const ASPECT = { kodesh: 690 / 860, general: 703 / 900, timeline: 900 / 760 };
  const pav = places.map((pl, i) => {
    const th = i / places.length * TAU, g = new THREE.Group(); g.position.set(Math.sin(th) * R, 0, Math.cos(th) * R); ring.add(g);
    const halo = glowSprite(SOFT, pl.hex, 4.4, 0.35); halo.position.y = 1.9; g.add(halo);
    const dome = painting(pl.art, pl.id === 'timeline' ? 2.9 : 3.6, ASPECT[pl.id]); dome.center.set(0.5, 0); g.add(dome);
    if (pl.id === 'general') dome.material.color.set(0xb4c6ff);
    /* a Keser girl in the school uniform stands on the stage beside her place */
    const girl = pl.girl ? painting(pl.girl, 2.9, pl.girlAspect) : null; if (girl) { girl.center.set(0.5, 0); girl.position.set(1.85, -0.25, 0.5); g.add(girl); }   /* the rose glass dome tinted toward the Keser Malchus royal blue */
    const motes = [...Array(lite ? 3 : 6)].map((_, k) => { const s = glowSprite(STAR, [0xffffff, 0xfff1b8, pl.hex][k % 3], 0.2); s.userData.k = k; g.add(s); return s; });
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 4, 10), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 2; hit.userData.idx = i; g.add(hit);
    return { g, th, halo, dome, girl, motes, hit, sc: 1 };
  });

  /* her crown: the painted tiara high in the middle, with a jewel per subject that lights up as she learns */
  const crownRig = new THREE.Group(); crownRig.position.set(0, 5.6, 0); scene.add(crownRig);
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
  const crownSparks = [...Array(12)].map((_, i) => { const s = glowSprite(STAR, [0xffffff, 0xf6e3b0, 0xd4aa50][i % 3], 0.01); s.userData.off = i * 0.83; crownRig.add(s); return s; });

  /* ---------- glitter, bokeh and drifting rose petals ---------- */
  const palette = [0xffffff, 0xf6e3b0, 0xd4aa50, 0xff8fa6, 0x8fb0ff, 0x7fe0b0].map(c => new THREE.Color(c)), glitter = [];   /* gold glitter with sparks of maroon-rose, royal blue and green */
  for (const [count, size, spread] of [[phoneish ? 700 : 1400, 0.07, 20], [phoneish ? 160 : 320, 0.16, 16]]) {
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
    glitter[1].visible = !lite; glitter[0].geometry.setDrawRange(0, lite ? 500 : Infinity);
    petals.count = lite ? 30 : PN; bokeh.forEach((b, i) => b.visible = !lite || i < 5);
    renderer.setPixelRatio(lite ? 1 : Math.min(devicePixelRatio || 1, 1.5)); fit();
  }

  /* ---------- camera, the turning ring, her moves ---------- */
  let focus = o.focus || 0, angle = -focus / places.length * TAU, dragOff = 0, dragTo = 0, entered = false, nudge = 0;
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
      p.dome.position.y = Math.sin(t * 1.1 + i) * 0.06 * sp;
      p.halo.material.opacity += ((front ? 0.5 : 0.22) - p.halo.material.opacity) * Math.min(1, dt * 5);
      p.dome.material.opacity += ((entered && !front ? 0.35 : 1) - p.dome.material.opacity) * Math.min(1, dt * 4);
      if (p.girl) p.girl.material.opacity += ((entered && !front ? 0.25 : 1) - p.girl.material.opacity) * Math.min(1, dt * 4);
      p.motes.forEach(m => { const k = m.userData.k, y = ((t * 0.22 + k / p.motes.length) % 1); m.position.set(Math.sin(k * 2.3 + t * 0.7 * sp) * 0.7, 0.8 + y * 2.6, 0.3); m.material.opacity = Math.sin(y * Math.PI) * (calm ? 0.5 : 0.9); m.scale.setScalar(0.12 + 0.12 * Math.sin(y * Math.PI)); }); });
    nudge = Math.max(0, nudge - dt * 1.6);
    /* the crown floats, twirls when tapped (it turns like a card), and its jewels glint */
    crownRig.position.y = 5.6 + Math.sin(t * 0.9) * 0.1 * sp - (1 - e) * 1.2; const tw = twirlT.get();
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
    focus(i) { const old = focus; focus = i; glide.set(shortest(glide.get(), -i / places.length * TAU)); return old; },
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
