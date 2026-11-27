/* Kindergarten Numbers, Unit 7 "More, less, the same": a real 3D apple orchard.
   Calm world (K clarity 10): plain grass and sky, no trees or props. Two friends stand by two picnic blankets with apples;
   each boy stands on a mat the colour of his blanket's edge (Dovid orange, in front; Shmuel blue, behind), so the voice can say whose is whose. Boys pair apples one to one, add one more, take one away,
   and balance a see-saw. The blankets sit one in front of the other, and the camera comes in until they fill the screen.
   Every thing he taps (an apple, a blanket, a see-saw end) has a see-through tap spot laid over it. When he must tap a blanket, both blankets shine white (choose).
   ES module: import { mount } from './orchard7.js'. Needs kit.js, frame.js, unit5.js first. */
import * as THREE from 'three';

const FAST = /[?&]fast=1/.test(location.search);
const T = ms => FAST ? Math.min(ms, 60) : ms;
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const tween = (ms, fn) => new Promise(res => { const t0 = performance.now(), d = T(ms); (function f() { const t = Math.min(1, (performance.now() - t0) / d); fn(ease(t), t); if (t < 1) requestAnimationFrame(f); else res(); })(); });

export function mount(host, opt) {
  opt = Object.assign({ band: null, kids: ['dovid', 'shmuel'], stack: false, tree: false }, opt || {});
  host.classList.add('p6world');
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FAST ? 1 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = !FAST; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement); renderer.domElement.className = 'p6canvas';
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#BDE6FF'); scene.fog = null;
  /* K clarity 7 (comparisons obvious): a flat (orthographic) camera, so the near blanket and the far blanket, and every apple,
     are drawn the same size on the screen; "the same" always looks the same */
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 300);
  scene.add(new THREE.HemisphereLight('#E8F6FF', '#9CC27A', 1.25));
  const sun = new THREE.DirectionalLight('#FFF1D6', 2.1); sun.position.set(-8, 14, 9); sun.castShadow = !FAST;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.radius = 6; sun.shadow.bias = -0.0006; scene.add(sun);
  const rim = new THREE.DirectionalLight('#FFD9B0', 0.6); rim.position.set(6, 5, -10); scene.add(rim);

  const loader = new THREE.TextureLoader();
  /* a picture from art/, trying the orchard one first and then a stand-in until the orchard pictures arrive */
  function tex(files, fn) { const list = [].concat(files); (function next(i) { if (i >= list.length) return; loader.load('art/' + list[i], t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; fn(t); }, undefined, () => next(i + 1)); })(0); }
  const gMat = new THREE.MeshStandardMaterial({ color: '#A6DC86', roughness: 1 });   /* plain soft grass, one calm colour */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), gMat); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  /* ---------------- apples ---------------- */
  const appleMat = new THREE.MeshPhysicalMaterial({ color: '#E8322B', roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.25 });
  tex('apple-skin.jpg', t => { appleMat.map = t; appleMat.color.set('#FFFFFF'); appleMat.needsUpdate = true; });
  const stemMat = new THREE.MeshStandardMaterial({ color: '#7A4A22' }), leafMat = new THREE.MeshStandardMaterial({ color: '#4CB050', side: THREE.DoubleSide });
  const appleGeo = new THREE.SphereGeometry(0.3, 28, 20); appleGeo.scale(1, 0.9, 1);
  function apple() {
    const g = new THREE.Group(); const b = new THREE.Mesh(appleGeo, appleMat); b.castShadow = true; b.position.y = 0.27; g.add(b);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.16, 6), stemMat); st.position.y = 0.58; st.rotation.z = 0.2; g.add(st);
    const lf = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 6), leafMat); lf.scale.set(1.4, 0.25, 0.7); lf.position.set(0.1, 0.6, 0); lf.rotation.z = -0.4; g.add(lf);
    g.rotation.y = Math.random() * 6; return g;
  }

  /* ---------------- blankets, baskets and friends ---------------- */
  const blanketMat = new THREE.MeshStandardMaterial({ color: '#FFF3DD', roughness: 0.95 });
  tex('picnic-blanket.jpg', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1.3); blanketMat.map = t; blanketMat.needsUpdate = true; });
  if (!blanketMat.map) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#FFF6E6'; x.fillRect(0, 0, 128, 128);
    x.fillStyle = 'rgba(80,150,230,.35)'; for (let i = 0; i < 4; i++) { x.fillRect(i * 32, 0, 16, 128); x.fillRect(0, i * 32, 128, 16); }
    const ct = new THREE.CanvasTexture(c); ct.colorSpace = THREE.SRGBColorSpace; ct.wrapS = ct.wrapT = THREE.RepeatWrapping; ct.repeat.set(3, 2); blanketMat.map = ct; }
  const sides = [];
  const W = 4.3, D = 2.5, KH = 2.1, COLORS = ['#FF8A3D', '#3D8FE0'];
  function side(i, who) {
    const g = new THREE.Group(); scene.add(g);
    const bl = new THREE.Mesh(new THREE.BoxGeometry(W, 0.05, D), blanketMat); bl.position.y = 0.03; bl.receiveShadow = true; g.add(bl);
    /* a wide coloured edge: Dovid's blanket is orange, Shmuel's is blue; each boy stands on a mat of the same colour */
    const COL = COLORS[i] || '#FF8A3D';
    const edge = new THREE.Mesh(new THREE.BoxGeometry(W + 0.44, 0.04, D + 0.44), new THREE.MeshStandardMaterial({ color: COL, roughness: 0.8 })); edge.position.y = 0.015; g.add(edge);
    const kh = new THREE.Group(); g.add(kh);
    const mat = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.06, 40), new THREE.MeshStandardMaterial({ color: COL, roughness: 0.8 })); mat.position.y = 0.03; kh.add(mat);
    const kid = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, visible: false, toneMapped: false }));
    kid.onBeforeRender = () => kid.quaternion.copy(camera.quaternion); kh.add(kid);
    /* a soft cloth over the apples (Which is more?: the apples are there, but hidden until we check) */
    const cloth = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#FFEFD2', roughness: 0.95 }));
    cloth.scale.set(W / 2 - 0.1, 0.75, D / 2 - 0.12); cloth.position.y = 0.04; cloth.castShadow = true; cloth.visible = false; g.add(cloth);
    /* a white shining frame: "tap a blanket" */
    const pick = new THREE.Group(), pm = new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.9, toneMapped: false }); pick.visible = false; g.add(pick); pick.material = pm;
    [[0, -(D / 2 + 0.42), W + 1.0, 0.2], [0, D / 2 + 0.42, W + 1.0, 0.2], [-(W / 2 + 0.42), 0, 0.2, D + 0.64], [W / 2 + 0.42, 0, 0.2, D + 0.64]].forEach(([x, z, w, d]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), pm); b.position.set(x, 0.03, z); pick.add(b); });
    const S = { i, who, g, kid, kh, cloth, pick, apples: [], glowRing: null, pose(p) { const k = p; loader.load('art/' + who + '-' + p + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; kid.material.map = t; kid.material.visible = true; kid.material.needsUpdate = true; const H = KH; kid.scale.set(H * t.image.width / t.image.height, H, 1); kid.position.y = H / 2 + 0.06; }, undefined, () => { if (k !== 'idle') S.pose('idle'); }); } };
    const ring = new THREE.Mesh(new THREE.BoxGeometry(W + 0.8, 0.03, D + 0.8), new THREE.MeshBasicMaterial({ color: '#FFD23D', transparent: true, opacity: 0.8, toneMapped: false })); ring.position.y = 0.005; ring.visible = false; g.add(ring); S.glowRing = ring;
    S.pose('idle'); return S;
  }
  opt.kids.forEach((w, i) => sides.push(side(i, w)));

  /* where things go: side by side (wide screens) or one behind the other (phones) */
  let narrow = false; const isPhone = () => Wd < Hh * 0.95 || Wd < 700;
  function layout(moved) {
    /* one behind the other, close together: Dovid's blanket in front, Shmuel's behind; each boy stands beside his own blanket
       (Dovid on the left, Shmuel on the right), never in front of an apple (K-CLARITY-RULES 8, 9) */
    sides.forEach((s, i) => { if (narrow) s.g.position.set(0, 0, i ? -(D / 2 + 0.7) : D / 2 + 0.7); else s.g.position.set(i ? 2.75 : -2.75, 0, 0.3); });
    /* a phone (tall and narrow): both boys stand on the left, so the blankets can be as wide as the screen allows */
    const ph = isPhone();
    sides.forEach((s, i) => { if (narrow && ph) { s.kh.position.set(-W / 2 - 0.62, 0, i ? -0.2 : 0.2); s.kh.scale.setScalar(0.72); }
      else if (narrow) { s.kh.position.set(i ? W / 2 + 0.75 : -W / 2 - 0.75, 0, i ? -0.3 : 0.3); s.kh.scale.setScalar(0.85); } else { s.kh.position.set(0, 0, -D / 2 - 0.55); s.kh.scale.setScalar(1); } });
    if (moved) sides.forEach(s => s.apples.forEach((a, j) => a.position.copy(s.slots[j] || a.position)));
  }
  /* apple places on a blanket: 'row' = neat rows of five (left to right), 'scatter' = mixed about, but on a loose grid of
     two rows of five, each apple nudged a little: from the slanted camera no apple ever touches or hides another (K clarity 8) */
  function slots(n, how) {
    const out = [];
    if (how === 'scatter' && n <= 10) {
      const cells = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) cells.push([c, r]);
      for (let k = cells.length - 1; k > 0; k--) { const m = Math.floor(Math.random() * (k + 1)); [cells[k], cells[m]] = [cells[m], cells[k]]; }
      cells.slice(0, n).forEach(([c, r]) => out.push(new THREE.Vector3((c - 2) * 0.92 + (Math.random() - .5) * 0.18, 0.05, (r ? 0.72 : -0.72) + (Math.random() - .5) * 0.2)));
      return out; }
    if (true) for (let j = 0; j < n; j++) { const r = j < 5 ? 0 : 1, c = j % 5; out.push(new THREE.Vector3((c - 2) * 0.92, 0.05, n > 5 ? (r ? 0.72 : -0.72) : 0)); }   /* rows far enough apart that, from the camera, no apple hides behind another */   /* 0.92 apart: their tap spots never overlap, even on a phone */
    return out;
  }


  /* ---------------- the see-saw (built when a game asks) ---------------- */
  let saw = null;
  function seesaw() {
    if (saw) return saw; const g = new THREE.Group(); scene.add(g);
    const pm = new THREE.MeshStandardMaterial({ color: '#E9B872', roughness: 0.7 }); tex('wood-plank.jpg', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 1); pm.map = t; pm.color.set('#FFFFFF'); pm.needsUpdate = true; });
    const piv = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.6, 0.9, 3), new THREE.MeshStandardMaterial({ color: '#FF8A3D' })); piv.position.y = 0.45; piv.rotation.y = Math.PI / 2; piv.castShadow = true; g.add(piv);
    const beam = new THREE.Group(); beam.position.y = 0.95; g.add(beam);
    const PH = isPhone(), PL = PH ? 4.3 : 7, TX = PH ? 1.5 : 2.55;   /* a phone: a shorter see-saw with square trays (rows of three), so it can be big */
    const plank = new THREE.Mesh(new THREE.BoxGeometry(PL, 0.16, 0.9), pm); plank.castShadow = true; beam.add(plank);
    const trays = [-1, 1].map(s => { const tr = new THREE.Group(); tr.position.set(s * TX, 0.08, 0); beam.add(tr);
      const base = new THREE.Mesh(new THREE.BoxGeometry(PH ? 1.5 : 2.7, 0.1, PH ? 2.25 : 1.35),   /* a long tray: the apples sit in rows of five, like a ten-frame */ new THREE.MeshStandardMaterial({ color: s < 0 ? '#FF9A5A' : '#5AA8E8' })); base.position.y = 0.05; base.castShadow = true; tr.add(base); return tr; });
    saw = { g, beam, trays, n: [0, 0], tilt: 0, cols: PH ? 3 : 5, gap: PH ? 0.44 : 0.5 }; fit(); return saw;   /* the camera comes in on the see-saw */
  }
  /* K clarity (rule 8): the apples on a see-saw tray never touch or hide each other: rows of five, like a ten-frame (five, and some more) */
  function sawSlots(n) { const C = saw ? saw.cols : 5, rows = Math.ceil(n / C), out = []; for (let j = 0; j < n; j++) { const r = Math.floor(j / C), c = j % C; const G = saw ? saw.gap : 0.5; out.push(new THREE.Vector3((c - (C - 1) / 2) * G, 0.1, (r - (rows - 1) / 2) * (saw && saw.cols === 3 ? 0.62 : G))); } return out; }   /* rows further apart front-to-back, so no apple hides behind another */

  /* ---------------- tap spots over 3D things ---------------- */
  const layer = document.createElement('div'); layer.className = 'p6layer'; host.appendChild(layer);
  const spots = new Map();
  function spot(id, obj, opts) {   /* opts: { cls, r (radius in world units), y (height offset) } */
    let d = spots.get(id); if (!d) { d = { el: document.createElement('div') }; d.el.className = 'tspot ' + (opts.cls || ''); d.el.dataset.id = id; layer.appendChild(d.el); spots.set(id, d); }
    d.obj = obj; d.r = opts.r || 0.4; d.y = opts.y || 0; d.min = opts.min || 64; d.el.style.display = ''; return d.el;
  }
  function unspot(id) { const d = spots.get(id); if (d) { d.el.remove(); spots.delete(id); } }
  layer.addEventListener('pointerdown', e => { const s = e.target.closest('.tspot'); if (!s || !api.onTap) return; NK.unlock(); api.onTap(s.dataset.id, s, e); });
  const v = new THREE.Vector3(), v2 = new THREE.Vector3();
  function place() {
    spots.forEach(d => { if (!d.obj.parent || !d.obj.visible) { d.el.style.display = 'none'; return; }
      d.el.style.pointerEvents = d.obj.userData.paired ? 'none' : '';   /* a paired apple is done: taps go to the apples still free */
      d.obj.getWorldPosition(v); v.y += d.y; v2.copy(v); v.project(camera); const cx = (v.x + 1) / 2 * Wd, cy = (1 - v.y) / 2 * Hh;
      v2.x += d.r; v2.project(camera); const size = Math.max(d.min, ((v2.x + 1) / 2 * Wd - cx) * 2);
      const out = cx < 0 || cx > Wd || cy < 0 || cy > Hh; d.el.style.display = out ? 'none' : ''; d.el.style.width = d.el.style.height = size + 'px'; d.el.style.left = (cx - size / 2) + 'px'; d.el.style.top = (cy - size / 2) + 'px'; });
  }

  /* when he is right, that blanket shines for a moment (K clarity 10: no flying bits) */
  function sparkle(p) { const sd = sides.find(x => x.g.position.distanceTo(p) < 0.01 && x.g.visible); if (!sd) return; sd.glowRing.visible = true; setTimeout(() => { sd.glowRing.visible = false; }, T(900)); }

  /* ---------------- camera ---------------- */
  let Wd = 1, Hh = 1; const DIR = new THREE.Vector3(0, 0.66, 0.75).normalize();   /* looking down enough that the back row of apples never hides behind the front row */
  let dist = 60; const center = new THREE.Vector3(0, 0.6, 0);
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  function fit() {
    Wd = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(Wd, Hh, false);
    const wasNarrow = narrow; narrow = opt.stack || Wd < Hh * 0.95 || Wd < 700; layout(wasNarrow !== narrow || !fit.done); fit.done = true;
    if (saw) saw.g.position.set(0, 0, 0.3);
    const [b0, b1] = band(), P = saw ? sawPoints() : keyPoints(); if (!P.length) return;
    /* the picnic (or the see-saw) just fits the free band, as big as it can be, in the middle of it */
    cam(); const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(p => { const d = p.clone().sub(camera.position), x = d.dot(right), y = d.dot(up); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const m = Math.max(10, Wd * 0.015) + (saw ? 16 : 0), bh = Math.max(120, b1 - b0 - 2 * m), u = Math.max((x1 - x0) / (Wd - 2 * m), (y1 - y0) / bh);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, bc = (b0 + b1) / 2;
    camera.left = cx - Wd / 2 * u; camera.right = cx + Wd / 2 * u; camera.top = cy + bc * u; camera.bottom = camera.top - Hh * u; camera.updateProjectionMatrix();
  }
  /* every corner of both blankets and both boys (head to mat) */
  function keyPoints() { const P = [], q = new THREE.Vector3();
    sides.forEach(s => { if (!s.g.visible) return; s.g.updateMatrixWorld(true);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => P.push(s.g.localToWorld(new THREE.Vector3(a * (W / 2 + 0.55), 0, b * (D / 2 + 0.55)))));
      s.kh.getWorldPosition(q); const k = s.kh.scale.y; P.push(q.clone().add(new THREE.Vector3(0, (KH + 0.1) * k, 0)), q.clone().add(new THREE.Vector3(-0.65 * k, 0, 0.6 * k)), q.clone().add(new THREE.Vector3(0.65 * k, 0, 0.6 * k))); });
    return P; }
  /* the see-saw at either tilt, with apples piled on its trays */
  function sawPoints() { saw.g.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(saw.g), P = [];
    for (const x of [b.min.x, b.max.x]) for (const y of [0, b.max.y + 0.9]) for (const z of [b.min.z, b.max.z]) P.push(new THREE.Vector3(x, y, z)); return P; }
  function cam() { camera.position.copy(center).addScaledVector(DIR, dist); camera.lookAt(center); camera.updateMatrixWorld(); }
  let last = performance.now(), alive = true;
  function frame() {
    if (!alive) return; requestAnimationFrame(frame); const now = performance.now(), dt = Math.min(50, now - last); last = now; const tt = now / 1000;
    sides.forEach(s => { if (s.glowRing.visible) s.glowRing.material.opacity = 0.55 + Math.sin(tt * 6) * 0.3; });
    if (saw) { const want = Math.max(-1, Math.min(1, (saw.n[1] - saw.n[0]) / 3)) * 0.22; saw.tilt += (want - saw.tilt) * Math.min(1, dt / (FAST ? 16 : 260)); saw.beam.rotation.z = -saw.tilt; }
    sides.forEach(s => { if (s.pick.visible) s.pick.material.opacity = 0.6 + Math.sin(tt * 4) * 0.35; });
    if (now - (frame.t || 0) > 250) { frame.t = now; const b = band(); if (!frame.b || Math.abs(b[0] - frame.b[0]) > 4 || Math.abs(b[1] - frame.b[1]) > 4) { frame.b = b; if (frame.t0) fit(); frame.t0 = 1; } }   /* the panel grew or shrank: fit again */
    cam(); renderer.render(scene, camera); place();
  }

  const api = {
    sides, narrow: () => narrow, spot, unspot, sparkle, seesaw,
    /* put n apples on a side's blanket ('row' or 'scatter'); each gets a tap spot "a<side>-<j>" */
    setApples(i, n, how) {
      const s = sides[i]; s.apples.forEach((a, j) => { s.g.remove(a); unspot('a' + i + '-' + j); }); s.apples = []; s.slots = slots(n, how || 'row');
      for (let j = 0; j < n; j++) { const a = apple(); a.position.copy(s.slots[j]); a.visible = !s.cloth.visible; s.g.add(a); s.apples.push(a); spot('a' + i + '-' + j, a, { cls: 'apple', r: 0.34, y: 0.3 }); }
    },
    count(i) { return sides[i].apples.length; },
    /* a cloth hides a side's apples (they are there, he cannot see how many), or comes off */
    cover(i, on) { const s = sides[i]; s.cloth.visible = on; s.apples.forEach(a => { a.visible = !on; }); },
    /* "tap a blanket": both blankets shine white while he chooses */
    choose(on) { sides.forEach(s => { s.pick.visible = on; }); },
    /* the "spread out" trick: a few apples spread wide across the blanket, or many squeezed close together */
    spread(i, wide) { const s = sides[i], n = s.apples.length, gap = wide ? Math.min(1.25, (W - 0.5) / Math.max(1, n - 1)) : 0.62;   /* close together, but every apple stands apart and can be counted (K-CLARITY-RULES 8) */
      s.slots = s.apples.map((a, j) => new THREE.Vector3(-((n - 1) * gap) / 2 + j * gap, 0.05, 0)); s.apples.forEach((a, j) => a.position.copy(s.slots[j])); },
    /* one more: an apple drops gently from above onto its place on a side's blanket */
    async drop(i) {
      const s = sides[i], a = apple(); scene.add(a);
      s.slots = slots(s.apples.length + 1, s.how || 'row'); s.apples.forEach((p, j) => p.position.copy(s.slots[j]));
      const to = s.slots[s.apples.length].clone(); s.g.localToWorld(to); const from = to.clone(); from.y += 3.2; NK.sound.pop();
      await tween(460, e => { a.position.lerpVectors(from, to, e); });
      scene.remove(a); a.position.copy(s.slots[s.apples.length]); a.rotation.x = 0; s.g.add(a); const j = s.apples.length; s.apples.push(a); spot('a' + i + '-' + j, a, { cls: 'apple', r: 0.34, y: 0.3 });
    },
    /* one less: the last apple lifts away */
    async take(i) {
      const s = sides[i]; if (!s.apples.length) return; const j = s.apples.length - 1, a = s.apples.pop(); unspot('a' + i + '-' + j); NK.sound.back();
      const p0 = a.position.clone(); await tween(380, e => { a.position.set(p0.x, p0.y + e * 1.6, p0.z - e * 1.5); a.scale.setScalar(1 - e); }); s.g.remove(a);
    },
    /* pair one apple of each side: both lift and a ribbon joins them; returns when done */
    async pair(j0, j1) {
      const a = sides[0].apples[j0], b = sides[1].apples[j1]; [a, b].forEach(x => { x.userData.paired = true; });
      /* the partners line up: column k, at the edges that face each other (one behind the other), so the pairs make a line */
      if (narrow) { const k = api.npairs = (api.npairs || 0) + 1, maxp = Math.min(api.count(0), api.count(1)), gap = Math.min(0.78, (W - 0.7) / Math.max(1, maxp)), x = -((maxp - 1) * gap) / 2 + (k - 1) * gap;
        const ta = new THREE.Vector3(x, 0.05, -D / 2 + 0.4), tb = new THREE.Vector3(x, 0.05, D / 2 - 0.4), fa = a.position.clone(), fb = b.position.clone();
        [[0, ta], [1, tb]].forEach(([i, t]) => sides[i].apples.forEach(o => { if (!o.userData.paired && Math.hypot(o.position.x - t.x, o.position.z - t.z) < 0.62) o.position.z += (i ? -0.7 : 0.7); }));
        await tween(300, e => { a.position.lerpVectors(fa, ta, e); b.position.lerpVectors(fb, tb, e); }); }
      const pa = new THREE.Vector3(), pb = new THREE.Vector3(); a.getWorldPosition(pa); b.getWorldPosition(pb);
      const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 8), new THREE.MeshBasicMaterial({ color: '#FFC93D', toneMapped: false }));
      const mid = pa.clone().add(pb).multiplyScalar(0.5); mid.y = 0.9; rib.position.copy(mid); rib.scale.y = pa.distanceTo(pb); rib.lookAt(pb.x, 0.9, pb.z); rib.rotateX(Math.PI / 2); scene.add(rib);
      (api.ribbons = api.ribbons || []).push(rib); NK.sound.pop();
      await tween(260, e => { a.position.y = 0.05 + Math.sin(Math.PI * e) * 0.4; b.position.y = 0.05 + Math.sin(Math.PI * e) * 0.4; });
      [a, b].forEach(x => { x.traverse(m => { if (m.material === appleMat) { m.material = appleMat.clone(); m.material.emissive = new THREE.Color('#5A3A00'); } }); });
    },
    clearPairs() { (api.ribbons || []).forEach(r => scene.remove(r)); api.ribbons = []; api.npairs = 0; },
    unpaired(i) { return sides[i].apples.map((a, j) => a.userData.paired ? -1 : j).filter(j => j >= 0); },
    glowSide(i, on) { if (i == null) sides.forEach(s => { s.glowRing.visible = false; }); else sides[i].glowRing.visible = on; },
    bump(obj) { const y0 = obj.position.y; return tween(300, (e, t) => { obj.position.y = y0 + Math.sin(Math.PI * t) * 0.35; }); },
    sideSpot(i) { return spot('side' + i, sides[i].g, { cls: 'side', r: W / 2 - 0.3, y: 0.2, min: 64 }); },
    /* see-saw apples */
    setSaw(nl, nr) { const S = seesaw(); S.g.scale.setScalar(narrow ? 0.9 : 1); sides.forEach(s => { s.g.visible = false; }); S.n = [nl, nr];
      S.trays.forEach((tr, k) => { while (tr.children.length > 1) tr.remove(tr.children[1]); const ps = sawSlots(S.n[k]); ps.forEach(p => { const a = apple(); a.scale.setScalar(saw && saw.cols === 3 ? 0.68 : 0.75); a.position.copy(p); tr.add(a); }); }); },
    async sawAdd(k, d) { const S = seesaw(); const n = S.n[k] + d; if (n < 0 || n > 10) return false; S.n[k] = n; const tr = S.trays[k];
      while (tr.children.length > 1) tr.remove(tr.children[1]); sawSlots(n).forEach(p => { const a = apple(); a.scale.setScalar(saw && saw.cols === 3 ? 0.68 : 0.75); a.position.copy(p); tr.add(a); }); NK.sound[d > 0 ? 'pop' : 'back'](); return true; },
    sawSpot(k) { const S = seesaw(); return spot('saw' + k, S.trays[k], { cls: 'tray', r: 1.0, y: 0.3, min: 72 }); },
    hideSaw() { sides.forEach(s => { s.g.visible = true; }); if (saw) { scene.remove(saw.g); saw = null; fit(); } unspot('saw0'); unspot('saw1'); },
    fit, destroy() { alive = false; renderer.dispose(); }
  };
  /* for the clarity test (v2/tests/k-clarity-numbers.js): measure what a boy sees */
  api._minGap = i => { const P = sides[i].apples.map(a => a.position); let m = 1e9; P.forEach((p, j) => P.forEach((q, k) => { if (k > j) m = Math.min(m, Math.hypot(p.x - q.x, p.z - q.z)); })); return m; };
  api._rowLen = i => { const xs = sides[i].apples.map(a => a.position.x); return xs.length ? Math.max(...xs) - Math.min(...xs) : 0; };
  api._sawMinGap = () => { if (!saw) return 1e9; let m = 1e9; saw.trays.forEach(tr => { const P = tr.children.slice(1).map(a => a.position); P.forEach((p, j) => P.forEach((q, k) => { if (k > j) m = Math.min(m, Math.hypot(p.x - q.x, p.z - q.z)); })); }); return m; };
  api._treeApples = () => { let n = 0; scene.traverse(o => { if (o.material === appleMat && !sides.some(sd => sd.apples.some(a => a.children.includes(o))) && !(saw && saw.trays.some(tr => tr.children.some(a => a.children && a.children.includes(o))))) n++; }); return n; };
  api.APPLE = 0.6 * 0.95;   /* an apple is 0.6 across */
  window.__orchard = api;
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}
