/* Kindergarten Numbers, Unit 10 "Making 10" (friends of ten): a calm 3D bakery counter (K-CLARITY-RULES: calm, one thing to look at).
   The star is a muffin tin with ten cups in two rows of five: a real ten-frame. Pink cupcakes are the ones already there;
   blue cupcakes are the ones he adds, so the two parts of ten are always two clear colours. A plate on the right holds extra cupcakes.
   Every cup he can tap has a see-through tap spot over it (data-id "cup0".."cup9"; "plate" for the plate).
   ES module: import { mount } from './bakery10.js'. */
import * as THREE from 'three';

const FAST = /[?&]fast=1/.test(location.search);
const T = ms => FAST ? Math.min(ms, 60) : ms;
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const tween = (ms, fn) => new Promise(res => { const t0 = performance.now(), d = T(ms); (function f() { const t = Math.min(1, (performance.now() - t0) / d); fn(ease(t), t); if (t < 1) requestAnimationFrame(f); else res(); })(); });

export function mount(host, opt) {
  opt = Object.assign({ band: null, kids: ['mendy', 'dovid'] }, opt || {});
  host.classList.add('p6world');
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FAST ? 1 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !FAST; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement); renderer.domElement.className = 'p6canvas';
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#F6E9D8');
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight('#FFF6E8', '#B99B78', 1.3));
  const sun = new THREE.DirectionalLight('#FFE9C8', 2.0); sun.position.set(-7, 12, 6); sun.castShadow = !FAST;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 1, far: 40 }); sun.shadow.radius = 6; sun.shadow.bias = -0.0006; scene.add(sun);
  const loader = new THREE.TextureLoader();
  function tex(files, fn) { const list = [].concat(files); (function next(i) { if (i >= list.length) return; loader.load('art/' + list[i], t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; fn(t); }, undefined, () => next(i + 1)); })(0); }
  const rep = (t, x, y) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); return t; };

  /* the bakery: soft floor, a painted bakery all around (order N10; Bubby's kitchen until it comes), and the counter */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: '#E8DCCB', roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.6; floor.receiveShadow = true; scene.add(floor);
  if (!FAST) tex(['bakery-panorama.jpg', 'kitchen-panorama.jpg'], t => { t.wrapS = THREE.MirroredRepeatWrapping; t.repeat.x = -2; t.offset.x = 1; const R = 24, span = 2.8, H = R * span / 2 * t.image.height / t.image.width;
    const back = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 96, 1, true, Math.PI - span / 2, span), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, color: '#F2F2F2' }));
    back.position.set(0, H * 0.4 - 2.6, 4); scene.add(back); });
  const TW = 9.5, TD = 5.2;
  const woodMat = new THREE.MeshStandardMaterial({ color: '#C79A68', roughness: 0.6 }); tex(['counter-wood.jpg', 'table-wood.jpg'], t => { woodMat.map = rep(t, 2, 1); woodMat.color.set('#FFFFFF'); woodMat.needsUpdate = true; });
  const top = new THREE.Mesh(new THREE.BoxGeometry(TW, 0.25, TD), woodMat); top.position.y = -0.13; top.receiveShadow = true; scene.add(top);
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(TW - 1.2, 0.02, TD - 1.0), new THREE.MeshStandardMaterial({ color: '#FFF8EC', roughness: 0.95 })); cloth.position.y = 0.01; cloth.receiveShadow = true; scene.add(cloth);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.35), woodMat); l.position.set(a * (TW / 2 - 0.5), -1.45, b * (TD / 2 - 0.5)); scene.add(l); });

  /* the boys behind the counter (painted) */
  const kids = opt.kids.map(who => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, visible: false, toneMapped: false }));
    m.onBeforeRender = () => m.quaternion.copy(camera.quaternion); scene.add(m);
    const k = { who, m, pose(p) { loader.load('art/' + who + '-' + p + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; m.material.map = t; m.material.visible = true; m.material.needsUpdate = true; const H = 2.3; m.scale.set(H * t.image.width / t.image.height, H, 1); }, undefined, () => { if (p !== 'idle') k.pose('idle'); }); } };
    k.pose('idle'); return k; });

  /* ---------------- cupcakes: a white paper case and a round swirl of frosting (pink = already there, blue = added) ---------------- */
  const caseM = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.7 }), cakeM = new THREE.MeshStandardMaterial({ color: '#D9A15E', roughness: 0.8 });
  const pinkM = new THREE.MeshPhysicalMaterial({ color: '#FF7FAE', roughness: 0.5, clearcoat: 0.4 }), blueM = new THREE.MeshPhysicalMaterial({ color: '#4FA8FF', roughness: 0.5, clearcoat: 0.4 });
  const caseG = new THREE.CylinderGeometry(0.3, 0.22, 0.34, 24, 1), topG = new THREE.SphereGeometry(0.31, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), swirlG = new THREE.ConeGeometry(0.16, 0.22, 20);
  function cupcake(blue) { const g = new THREE.Group(); const c = new THREE.Mesh(caseG, caseM); c.position.y = 0.17; c.castShadow = true; g.add(c);
    const ck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 24), cakeM); ck.position.y = 0.36; g.add(ck);
    const f = new THREE.Mesh(topG, blue ? blueM : pinkM); f.position.y = 0.37; f.scale.y = 0.75; f.castShadow = true; g.add(f);
    const s = new THREE.Mesh(swirlG, blue ? blueM : pinkM); s.position.y = 0.66; g.add(s); g.userData.blue = blue; return g; }

  /* ---------------- the muffin tin: ten cups, two rows of five (a ten-frame) ---------------- */
  const tinM = new THREE.MeshStandardMaterial({ color: '#B8C0CC', roughness: 0.35, metalness: 0.6 }), holeM = new THREE.MeshStandardMaterial({ color: '#7D8796', roughness: 0.5, metalness: 0.5 });
  const tin = new THREE.Group(); scene.add(tin);
  const GAP = 0.82, ROW = 0.86;
  const cupPos = i => new THREE.Vector3(((i % 5) - 2) * GAP, 0.12, (i < 5 ? -1 : 1) * ROW / 2);
  { const base = new THREE.Mesh(new THREE.BoxGeometry(5 * GAP + 0.4, 0.16, 2 * ROW + 0.36), tinM); base.position.y = 0.08; base.castShadow = true; base.receiveShadow = true; tin.add(base);
    /* a soft line between the two rows of five, and after five cups: the ten-frame shape */
    const line = new THREE.Mesh(new THREE.BoxGeometry(5 * GAP + 0.3, 0.02, 0.04), new THREE.MeshStandardMaterial({ color: '#8A93A1' })); line.position.y = 0.17; tin.add(line); }
  const holes = [], cups = [];
  for (let i = 0; i < 10; i++) { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.02, 28), holeM); h.position.copy(cupPos(i)).setY(0.17); tin.add(h); holes.push(h);
    const anchor = new THREE.Object3D(); anchor.position.copy(cupPos(i)); tin.add(anchor); cups.push({ anchor, cake: null }); }

  /* a soft cream cloth that covers the whole tin ("can you do it without looking?") */
  const coverM = new THREE.MeshStandardMaterial({ color: '#F3E3C8', roughness: 0.95 }); tex(['cover-cloth.jpg', 'tablecloth.jpg'], t => { coverM.map = rep(t, 2, 1); coverM.needsUpdate = true; });
  const cover = new THREE.Mesh(new THREE.BoxGeometry(5 * GAP + 0.6, 0.9, 2 * ROW + 0.56), coverM); cover.position.y = 0.45; cover.castShadow = true; cover.visible = false; tin.add(cover);
  /* the plate of extra cupcakes (for "finish the ten") */
  const plate = new THREE.Group(); scene.add(plate); plate.visible = false;
  { const p = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 0.08, 40), new THREE.MeshStandardMaterial({ color: '#BFDDFF', roughness: 0.3 })); p.position.y = 0.04; p.castShadow = true; plate.add(p); }
  let extra = [];
  const extraPos = (j, k) => new THREE.Vector3(((j % 3) - (Math.min(3, k) - 1) / 2) * 0.62, 0.08, k > 3 ? (j < 3 ? -0.33 : 0.33) : 0);

  /* ---------------- tap spots ---------------- */
  const layer = document.createElement('div'); layer.className = 'p6layer'; host.appendChild(layer);
  const spots = new Map();
  function spot(id, obj, o) { let d = spots.get(id); if (!d) { d = { el: document.createElement('div') }; d.el.className = 'tspot ' + (o.cls || ''); d.el.dataset.id = id; layer.appendChild(d.el); spots.set(id, d); } d.obj = obj; d.r = o.r || 0.5; d.y = o.y || 0; d.min = o.min || 64; return d.el; }
  function unspot(id) { const d = spots.get(id); if (d) { d.el.remove(); spots.delete(id); } }
  layer.addEventListener('pointerdown', e => { const s = e.target.closest('.tspot'); if (!s || !api.onTap) return; NK.unlock(); api.onTap(s.dataset.id, s, e); });
  const v = new THREE.Vector3(), v2 = new THREE.Vector3();
  function place() { spots.forEach(d => { if (!d.obj.parent || !d.obj.visible) { d.el.style.display = 'none'; return; }
    d.obj.getWorldPosition(v); v.y += d.y; v2.copy(v); v.project(camera); const cx = (v.x + 1) / 2 * Wd, cy = (1 - v.y) / 2 * Hh; v2.x += d.r; v2.project(camera);
    const size = Math.max(d.min, ((v2.x + 1) / 2 * Wd - cx) * 2), out = cx < 0 || cx > Wd || cy < 0 || cy > Hh; d.el.style.display = out ? 'none' : ''; d.el.style.width = d.el.style.height = size + 'px'; d.el.style.left = (cx - size / 2) + 'px'; d.el.style.top = (cy - size / 2) + 'px'; }); }

  /* sparkles (only when a ten is finished) */
  const bits = [], COL = ['#FF7FA8', '#FFD23D', '#FFFFFF', '#B98CFF', '#7FD67A', '#7FC8FF'];
  function sparkle(x, z) { if (FAST) return; const g = new THREE.SphereGeometry(0.06, 8, 6); for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: COL[i % 6] })); m.position.set(x || 0, 1.2, z || 0);
    m.userData.v = new THREE.Vector3((Math.random() - .5) * .08, .07 + Math.random() * .05, (Math.random() - .5) * .08); m.userData.t = 0; scene.add(m); bits.push(m); } }

  /* ---------------- camera ---------------- */
  let Wd = 1, Hh = 1, narrow = false, solo = false; const DIR = new THREE.Vector3(0, 0.62, 0.78).normalize(), V = 34; let dist = 14; const center = new THREE.Vector3(0, 0.3, 0.3);
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  function layout() {
    tin.position.set(narrow ? 0 : -1.0, 0, narrow ? -0.7 : 0.3); tin.scale.setScalar(1);
    plate.position.set(solo ? (narrow ? 0 : -1.0) : narrow ? 0 : 2.75, 0, solo ? 0.3 : narrow ? 1.65 : 0.3); tin.visible = !solo;   /* solo: only the plate, in the middle */   /* phone: in front of the tin, on the table */
    kids.forEach((k, i) => k.m.position.set(narrow ? (i ? 1.9 : -1.9) : (i ? 3.4 : -3.4), 0.35, -3.1));
  }
  function fit() {
    Wd = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(Wd, Hh, false); narrow = Wd < Hh * 0.95 || Wd < 700; layout();
    const span = narrow ? 4.7 : 9.0, needH = narrow ? 4.6 : 4.4; center.z = narrow ? 0.5 : 0.3;
    const [b0, b1] = band(), bc = (b0 + b1) / 2, bh = Math.max(120, b1 - b0), fullH = Hh + 2 * Math.abs(Hh / 2 - bc), tn = Math.tan(THREE.MathUtils.degToRad(V / 2));
    dist = Math.max(span * fullH / (2 * Wd * tn), needH * fullH / (2 * tn * bh));
    camera.aspect = Wd / fullH; camera.fov = V; camera.setViewOffset(Wd, fullH, 0, fullH / 2 - bc, Wd, Hh); camera.updateProjectionMatrix();
  }
  let last = performance.now(), alive = true;
  function frame() { if (!alive) return; requestAnimationFrame(frame); const now = performance.now(), dt = Math.min(50, now - last); last = now;
    for (let i = bits.length - 1; i >= 0; i--) { const b = bits[i]; b.userData.t += dt; b.userData.v.y -= 0.0022 * dt / 16; b.position.addScaledVector(b.userData.v, dt / 16); if (b.userData.t > 1600 || b.position.y < 0.05) { scene.remove(b); bits.splice(i, 1); } }
    camera.position.copy(center).addScaledVector(DIR, dist); camera.lookAt(center); camera.updateMatrixWorld(); renderer.render(scene, camera); place(); }

  const wp = new THREE.Vector3();
  const api = {
    kids, spot, unspot, sparkle, narrow: () => narrow, tween,
    /* the tin: the first n cups hold pink cupcakes; spots on the empty cups when he may tap them */
    setTin(n, opts) { opts = opts || {}; cups.forEach((c, i) => { if (c.cake) { c.anchor.remove(c.cake); c.cake = null; } if (i < n) { c.cake = cupcake(!!(opts.blueFrom != null && i >= opts.blueFrom)); c.anchor.add(c.cake); } }); api.spots(opts.tap); },
    spots(on) { cups.forEach((c, i) => { if (on && !c.cake) spot('cup' + i, c.anchor, { cls: 'cupspot', r: 0.36, y: 0.3, min: 56 }); else unspot('cup' + i); }); },
    count: () => cups.filter(c => c.cake).length, blues: () => cups.filter(c => c.cake && c.cake.userData.blue).length,
    firstEmpty: () => cups.findIndex(c => !c.cake), cakes: () => cups.filter(c => c.cake).map(c => c.cake),
    /* drop a blue cupcake into cup i (from above, or from the plate) */
    async add(i, from) { const c = cups[i]; if (!c || c.cake) return false; const k = cupcake(true); c.anchor.add(k); c.cake = k; unspot('cup' + i); NK.sound.pop();
      const start = new THREE.Vector3(0, 1.4, 0); if (from) { c.anchor.getWorldPosition(wp); start.copy(from).sub(wp); }
      await tween(380, e => { k.position.lerpVectors(start, new THREE.Vector3(), e); k.position.y += Math.sin(Math.PI * e) * 0.6; }); k.position.set(0, 0, 0); return true; },
    async remove(i) { const c = cups[i]; if (!c || !c.cake) return; const k = c.cake; c.cake = null; await tween(300, e => { k.position.y = e * 1.4; k.scale.setScalar(1 - e); }); c.anchor.remove(k); },
    /* the plate of extra blue cupcakes */
    setExtra(k) { extra.forEach(o => plate.remove(o)); extra = []; plate.visible = k > 0; for (let j = 0; j < k; j++) { const o = cupcake(true); o.position.copy(extraPos(j, k)); plate.add(o); extra.push(o); }
      if (k > 0) spot('plate', plate, { cls: 'platespot', r: 1.0, y: 0.3, min: 80 }); else unspot('plate'); },
    extraLeft: () => extra.length, extras: () => extra.slice(),
    async dropExtra() { const o = extra.pop(); if (!o) return; NK.sound.pop(); await tween(320, e => { o.position.y = 0.08 + e * 1.2; o.scale.setScalar(1 - e); }); plate.remove(o); if (!extra.length) { unspot('plate'); plate.visible = false; } },
    async moveOne() { const i = api.firstEmpty(); if (i < 0 || !extra.length) return false; const o = extra.pop(); o.getWorldPosition(wp); const from = wp.clone(); plate.remove(o); if (!extra.length) unspot('plate'); return api.add(i, from); },
    async bumpAll(list, say) { for (let i = 0; i < list.length; i++) { const o = list[i], y0 = o.position.y; await tween(240, (e, t) => { o.position.y = y0 + Math.sin(Math.PI * t) * 0.35; }); o.position.y = y0; if (say) await say(i); } },
    /* light the empty cups one by one (for "how many more?") */
    async countEmpty(say) { const e = cups.map((c, i) => [c, i]).filter(([c]) => !c.cake); for (let j = 0; j < e.length; j++) { const h = holes[e[j][1]]; h.material = h.material.clone(); h.material.emissive = new THREE.Color('#FFD23D'); h.material.emissiveIntensity = 0.9; if (say) await say(j); }
      return e.length; },
    unglow() { holes.forEach(h => { h.material = holeM; }); },
    plateOnly(on) { solo = !!on; layout(); },
    async cover(on) { if (on) { cover.visible = true; await tween(420, e => { cover.position.y = 2.4 - e * 1.95; }); cover.position.y = 0.45; }
      else if (cover.visible) { await tween(420, e => { cover.position.y = 0.45 + e * 2.2; }); cover.visible = false; } },
    celebrate() { tin.getWorldPosition(wp); sparkle(wp.x, wp.z); },
    fit, destroy() { alive = false; renderer.dispose(); }
  };
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}
