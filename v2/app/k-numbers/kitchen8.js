/* Kindergarten Numbers, Unit 8 "Parts of 5": a real 3D, warm frum home kitchen (Bubby's kitchen).
   On the kitchen table: a blue cup of two-colour counters to shake and spill, a plate of kugel slices with a towel that hides some,
   and two little plates (peach and blue) for the two parts of a number.
   K clarity (rule 10, review 2026-11-27): the camera looks down on the table so the plates and the things to count fill the screen;
   a soft plain floor around it, no painted kitchen, no table legs, and nobody standing behind the table (opt.kids is empty unless a game asks).
   Every thing he taps has a see-through tap spot over it. ES module: import { mount } from './kitchen8.js'. */
import * as THREE from 'three';

const FAST = /[?&]fast=1/.test(location.search);
const T = ms => FAST ? Math.min(ms, 60) : ms;
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const tween = (ms, fn) => new Promise(res => { const t0 = performance.now(), d = T(ms); (function f() { const t = Math.min(1, (performance.now() - t0) / d); fn(ease(t), t); if (t < 1) requestAnimationFrame(f); else res(); })(); });

export function mount(host, opt) {
  opt = Object.assign({ band: null, kids: [] }, opt || {});
  host.classList.add('p6world');
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FAST ? 1 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !FAST; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement); renderer.domElement.className = 'p6canvas';
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#F6E7CF');
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight('#FFF6E8', '#B99B78', 1.3));
  const sun = new THREE.DirectionalLight('#FFE9C8', 2.0); sun.position.set(-7, 12, 6); sun.castShadow = !FAST;   /* the window light, upper left */
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 1, far: 40 }); sun.shadow.radius = 6; sun.shadow.bias = -0.0006; scene.add(sun);
  const loader = new THREE.TextureLoader();
  function tex(files, fn) { const list = [].concat(files); (function next(i) { if (i >= list.length) return; loader.load('art/' + list[i], t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; fn(t); }, undefined, () => next(i + 1)); })(0); }
  const rep = (t, x, y) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); return t; };

  /* a soft, plain floor (calm: nothing to look at but the table) */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: '#F1E4CC', roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.6; floor.receiveShadow = true; scene.add(floor);
  const TW = 9.5, TD = 5.2;
  const clothMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.95 });
  tex('tablecloth.jpg', t => { clothMat.map = rep(t, 3, 1.6); clothMat.needsUpdate = true; });
  const woodMat = new THREE.MeshStandardMaterial({ color: '#B9844F', roughness: 0.6 }); tex('table-wood.jpg', t => { woodMat.map = rep(t, 2, 1); woodMat.color.set('#FFFFFF'); woodMat.needsUpdate = true; });
  const top = new THREE.Mesh(new THREE.BoxGeometry(TW, 0.25, TD), woodMat); top.position.y = -0.13; top.receiveShadow = true; scene.add(top);
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(TW - 1.2, 0.02, TD - 1.0), clothMat); cloth.position.y = 0.01; cloth.receiveShadow = true; scene.add(cloth);

  /* the boys behind the table */
  const kids = opt.kids.map((who, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, visible: false, toneMapped: false }));
    m.onBeforeRender = () => m.quaternion.copy(camera.quaternion); scene.add(m);
    const k = { who, m, pose(p) { loader.load('art/' + who + '-' + p + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; m.material.map = t; m.material.visible = true; m.material.needsUpdate = true; const H = 2.3; m.scale.set(H * t.image.width / t.image.height, H, 1); }, undefined, () => { if (p !== 'idle') k.pose('idle'); }); } };
    k.pose('idle'); return k; });

  /* ---------------- counters (red on one side, yellow on the other) ---------------- */
  const redM = new THREE.MeshPhysicalMaterial({ color: '#E8322B', roughness: 0.35, clearcoat: 0.8 }), yelM = new THREE.MeshPhysicalMaterial({ color: '#FFB800', roughness: 0.4, clearcoat: 0.5 });
  const half = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 32);
  function counter() { const g = new THREE.Group(); const a = new THREE.Mesh(half, redM), b = new THREE.Mesh(half, yelM); a.position.y = 0.04; b.position.y = -0.04; a.castShadow = true; g.add(a, b); g.userData.red = true; return g; }
  const glazeMat = new THREE.MeshPhysicalMaterial({ color: '#5FB4F0', roughness: 0.25, clearcoat: 1, side: THREE.DoubleSide }); tex('ceramic-glaze.jpg', t => { glazeMat.map = rep(t, 2, 1); glazeMat.color.set('#FFFFFF'); glazeMat.needsUpdate = true; });
  const cup = new THREE.Group(); scene.add(cup);
  { const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 1.4, 40, 1, true), glazeMat); body.position.y = 0.7; body.castShadow = true; cup.add(body);
    const bot = new THREE.Mesh(new THREE.CircleGeometry(0.6, 40), glazeMat); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.02; cup.add(bot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 10, 40), new THREE.MeshStandardMaterial({ color: '#FFFFFF' })); rim.rotation.x = Math.PI / 2; rim.position.y = 1.4; cup.add(rim); }
  let counters = []; cup.visible = false;
  /* ---------------- kugel slices on a plate, and the towel ---------------- */
  const kugelTop = new THREE.MeshStandardMaterial({ color: '#E7A93E', roughness: 0.8 }), kugelSide = new THREE.MeshStandardMaterial({ color: '#F4D28A', roughness: 0.9 });
  tex('kugel-top.jpg', t => { kugelTop.map = t; kugelTop.color.set('#FFFFFF'); kugelTop.needsUpdate = true; });
  const plateM = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });
  const platter = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.08, 1.6), plateM); platter.position.set(0, 0.05, 0); platter.castShadow = true; scene.add(platter);
  let slices = [];
  function slice() { const m = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.42, 0.95), [kugelSide, kugelSide, kugelTop, kugelSide, kugelSide, kugelSide]); m.castShadow = true; return m; }
  const towelMat = new THREE.MeshStandardMaterial({ color: '#FFE7A0', roughness: 1, side: THREE.DoubleSide }); tex('towel-cloth.jpg', t => { towelMat.map = rep(t, 2, 1); towelMat.color.set('#FFFFFF'); towelMat.needsUpdate = true; });
  const towel = new THREE.Mesh(new THREE.BoxGeometry(1, 0.06, 1.5), towelMat); towel.castShadow = true; towel.visible = false; scene.add(towel);
  /* two little plates for the two parts */
  /* the same peach and blue as the part circles of the number bond (K clarity: each part circle matches its plate) */
  const PLATE = ['#FFB877', '#7DB8F2'];
  const plates = [-1, 1].map((s, i) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.3, 0.1, 40), new THREE.MeshStandardMaterial({ color: PLATE[i], roughness: 0.45 })); p.position.set(s * 1.75, 0.06, 0); p.castShadow = true; p.visible = false; scene.add(p); return p; });
  /* a sunny ring around a plate when the help talks about it (kept apart from the plate, so it is never counted) */
  const rings = plates.map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.1, 12, 64), new THREE.MeshBasicMaterial({ color: '#FFC21A', toneMapped: false })); r.rotation.x = Math.PI / 2; r.visible = false; scene.add(r); return r; });

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

  /* sparkles */
  const bits = [], COL = ['#FF7FA8', '#FFD23D', '#FFFFFF', '#B98CFF', '#7FD67A', '#7FC8FF'];
  function sparkle(x, z) { if (FAST) return; const g = new THREE.SphereGeometry(0.06, 8, 6); for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: COL[i % 6] })); m.position.set(x || 0, 1.2, z || 0);
    m.userData.v = new THREE.Vector3((Math.random() - .5) * .08, .07 + Math.random() * .05, (Math.random() - .5) * .08); m.userData.t = 0; scene.add(m); bits.push(m); } }

  /* ---------------- camera ---------------- */
  let Wd = 1, Hh = 1, narrow = false; const DIR = new THREE.Vector3(0, 0.85, 0.53).normalize(), V = 34; let dist = 14;   /* looking down on the table: the things to count fill the screen */ const center = new THREE.Vector3(0, 0.2, 0);
  /* what the camera frames: [x0, x1, z0, z1] on the table, for the wide (Chromebook) and the narrow (phone) layout */
  const FOCUS = { kugel: [[-3.3, 3.3, -0.9, 0.9], [-2.8, 2.8, -0.9, 0.9]], plates: [[-3.25, 3.25, -1.45, 1.45], [-1.5, 1.5, -3.05, 3.05]], cup: [[-3.1, 3.1, -2.05, 1.15], [-2.0, 2.0, -2.9, 2.4]] };
  let focus = 'kugel';
  function look(f) { if (f !== focus) { focus = f; fit(); } }
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  function layout() {
    cup.position.set(0, 0, narrow ? -2.1 : -1.3);   /* the cup at the back, the counters spill in front of it */
    top.rotation.y = cloth.rotation.y = narrow ? Math.PI / 2 : 0;   /* on a phone the table stands the long way, like the screen */
    plates.forEach((p, i) => p.position.set(narrow ? 0 : (i ? 1.75 : -1.75), 0.06, narrow ? (i ? 1.55 : -1.55) : 0));   /* phone: peach on top, blue below */
    kids.forEach((k, i) => k.m.position.set(narrow ? (i ? 1.9 : -1.9) : (i ? 3.4 : -3.4), 0.35, -3.1));
  }
  function fit() {
    Wd = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(Wd, Hh, false); narrow = Wd < Hh * 0.95 || Wd < 700; layout();
    const [x0, x1, z0, z1] = FOCUS[focus][narrow ? 1 : 0], span = x1 - x0 + 0.3, needH = (z1 - z0) * 0.85 + 0.7;   /* K clarity (rules 9, 10): the camera frames the play area, nothing around it */
    center.set((x0 + x1) / 2, 0.2, (z0 + z1) / 2);
    const [b0, b1] = band(), bc = (b0 + b1) / 2, bh = Math.max(120, b1 - b0), fullH = Hh + 2 * Math.abs(Hh / 2 - bc), tn = Math.tan(THREE.MathUtils.degToRad(V / 2));
    dist = Math.max(span * fullH / (2 * Wd * tn), needH * fullH / (2 * tn * bh));
    camera.aspect = Wd / fullH; camera.fov = V; camera.setViewOffset(Wd, fullH, 0, fullH / 2 - bc, Wd, Hh); camera.updateProjectionMatrix();
  }
  let last = performance.now(), alive = true, seen = '', tick = 0;
  function frame() { if (!alive) return; requestAnimationFrame(frame);
    if (++tick % 8 === 0) { const b = band().map(Math.round).join(); if (b !== seen) { seen = b; fit(); } }   /* the panel changed size: frame the table above it again */ const now = performance.now(), dt = Math.min(50, now - last); last = now;
    for (let i = bits.length - 1; i >= 0; i--) { const b = bits[i]; b.userData.t += dt; b.userData.v.y -= 0.0022 * dt / 16; b.position.addScaledVector(b.userData.v, dt / 16); if (b.userData.t > 1600 || b.position.y < 0.05) { scene.remove(b); bits.splice(i, 1); } }
    camera.position.copy(center).addScaledVector(DIR, dist); camera.lookAt(center); camera.updateMatrixWorld(); renderer.render(scene, camera); place(); }

  const sliceX = (j, n) => (j - (n - 1) / 2) * 1.0;
  const api = {
    kids, spot, unspot, sparkle, narrow: () => narrow, plates,
    showCup(on) { cup.visible = on; if (on) look('cup'); },
    cupSpot() { return spot('cup', cup, { cls: 'cup', r: 0.8, y: 0.8, min: 80 }); },
    /* counters: n in the cup (hidden), spill them out; red = how many show red */
    clearCounters() { counters.forEach(c => scene.remove(c)); counters = []; },
    async shake() { NK.sound.pop(); await tween(600, (e, t) => { cup.rotation.z = Math.sin(t * Math.PI * 6) * 0.25 * (1 - t); cup.position.y = Math.abs(Math.sin(t * Math.PI * 6)) * 0.15; }); cup.rotation.z = 0; cup.position.y = 0; },
    async spill(n, red) {
      api.clearCounters(); platter.visible = false; slices.forEach(o => scene.remove(o)); slices = []; look('cup'); const from = cup.position.clone().setY(1.4); NK.sound.cloth && NK.sound.cloth();
      /* reds together on the left, yellows together on the right (the red hand is on the left too), each in tidy rows with gaps */
      const xs = [], flags = [], cols = narrow ? 2 : 3, gap = 0.98, z0 = narrow ? 0.0 : -0.1;
      [red, n - red].forEach((m, g) => { for (let j = 0; j < m; j++) { const row = Math.floor(j / cols), inRow = Math.min(cols, m - row * cols), col = j % cols;
        const cx = (g ? 1 : -1) * (narrow ? 1.15 : 1.75); xs.push(new THREE.Vector3(cx + (col - (inRow - 1) / 2) * gap, 0.08, z0 + row * gap)); flags.push(!g); } });
      for (let j = 0; j < n; j++) { const c = counter(); c.position.copy(from); scene.add(c); counters.push(c); c.userData.red = flags[j]; }
      await Promise.all(counters.map((c, j) => new Promise(r => setTimeout(r, j * T(90))).then(() => tween(520, e => { c.position.lerpVectors(from, xs[j], e); c.position.y += Math.sin(Math.PI * e) * 1.2; c.rotation.x = e * Math.PI * (c.userData.red ? 4 : 5); }))));
      counters.forEach(c => { c.rotation.x = c.userData.red ? 0 : Math.PI; });
    },
    counters: () => counters,
    /* kugel: n slices on the platter; hide k of them (from the right) under the towel */
    setKugel(n) { slices.forEach(s => scene.remove(s)); slices = []; platter.visible = n > 0; if (n) look('kugel'); for (let j = 0; j < n; j++) { const s = slice(); s.position.set(sliceX(j, n), 0.3, 0); scene.add(s); slices.push(s); } towel.visible = false; spot('towel', towel, { cls: 'towel', r: 0.8, y: 0.2, min: 80 }); },
    async hide(k) { const n = slices.length; if (!k) { towel.visible = false; return; } const x0 = sliceX(n - k, n), x1 = sliceX(n - 1, n); towel.scale.set((x1 - x0) + 1.2, 1, 1); const tx = (x0 + x1) / 2;
      towel.visible = true; await tween(500, e => { towel.position.set(tx, 2 - e * 1.45, 0); towel.rotation.z = (1 - e) * 0.4; }); towel.position.y = 0.55; slices.slice(n - k).forEach(s => { s.visible = false; }); },   /* under the towel: really hidden, no edges peek out */
    async lift() { if (!towel.visible) return; slices.forEach(s => { s.visible = true; }); const y0 = towel.position.y; await tween(450, e => { towel.position.y = y0 + e * 1.6; towel.rotation.z = -e * 0.5; }); towel.visible = false; },
    slices: () => slices, towelOn: () => towel.visible,
    async bumpAll(list, say) { for (let i = 0; i < list.length; i++) { const o = list[i], y0 = o.position.y; await tween(240, (e, t) => { o.position.y = y0 + Math.sin(Math.PI * t) * 0.35; }); o.position.y = y0; if (say) await say(i); } },
    /* parts on two plates: show a and b slices (or counters) on the two little plates */
    setPlates(a, b) { platter.visible = false; slices.forEach(s => scene.remove(s)); slices = []; towel.visible = false; look('plates'); plates.forEach(p => { p.visible = true; }); api.platePut(0, a); api.platePut(1, b); },
    /* n kugel slices on plate k, in rows with gaps, so each one can be counted */
    platePut(k, n) { const p = plates[k]; while (p.children.length) p.remove(p.children[0]);
      for (let j = 0; j < n; j++) { const o = slice(); o.scale.setScalar(0.78); const per = n > 3 ? Math.ceil(n / 2) : n, row = Math.floor(j / per), col = j % per, inRow = row ? n - per : per;
        o.position.set((col - (inRow - 1) / 2) * 0.96, 0.2, n > 3 ? (row ? 0.52 : -0.52) : 0); p.add(o); } },
    /* a soft glow on a plate (the one the help talks about), or on none */
    glowPlate(k) { rings.forEach((r, i) => { r.position.copy(plates[i].position).setY(0.1); r.visible = i === k && plates[i].visible; }); },
    /* a soft glow on the red (or yellow) counters while he works on that hand; null = none */
    glowCounters(c) { redM.emissive.set(c === 'red' ? '#FF6A5A' : '#000000'); redM.emissiveIntensity = c === 'red' ? 0.6 : 0; yelM.emissive.set(c === 'yellow' ? '#FF9A00' : '#000000'); yelM.emissiveIntensity = c === 'yellow' ? 0.45 : 0;
      counters.forEach(o => { const on = c && (o.userData.red === (c === 'red')); o.scale.setScalar(on ? 1.18 : 1); o.position.y = on ? 0.25 : 0.08; }); },
    hidePlates() { plates.forEach(p => { p.visible = false; }); api.glowPlate(-1); platter.visible = true; look('kugel'); },
    fit, destroy() { alive = false; renderer.dispose(); }
  };
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}
