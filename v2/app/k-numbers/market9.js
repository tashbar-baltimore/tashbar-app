/* Kindergarten Numbers, Unit 9 "Parts of 6 to 10": a calm, sunny 3D fruit market stall (K-CLARITY-RULES: calm, one thing to look at).
   On the stall: a wicker basket of oranges and lemons to shake and spill (the two parts), a tray of oranges with a big upside-down basket
   that some of them hide under, and two plates for the two parts. Mendy and Dovid (painted) stand behind the stall.
   Every thing he taps has a see-through tap spot over it. ES module: import { mount } from './market9.js'. */
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
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#CDEBFF');
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight('#FFF6E8', '#B99B78', 1.3));
  const sun = new THREE.DirectionalLight('#FFE9C8', 2.0); sun.position.set(-7, 12, 6); sun.castShadow = !FAST;   /* the window light, upper left */
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 1, far: 40 }); sun.shadow.radius = 6; sun.shadow.bias = -0.0006; scene.add(sun);
  const loader = new THREE.TextureLoader();
  function tex(files, fn) { const list = [].concat(files); (function next(i) { if (i >= list.length) return; loader.load('art/' + list[i], t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; fn(t); }, undefined, () => next(i + 1)); })(0); }
  const rep = (t, x, y) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); return t; };

  /* the kitchen: a wooden floor, a painted kitchen all around, and the table */
  const floorMat = new THREE.MeshStandardMaterial({ color: '#D9B48A', roughness: 0.9 });
  floorMat.color.set('#E3D7C4');   /* plain soft paving: calm */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.6; floor.receiveShadow = true; scene.add(floor);
  if (!FAST) tex(['market-panorama.jpg', 'garden-panorama.jpg'], t => { t.wrapS = THREE.MirroredRepeatWrapping; t.repeat.x = -2; t.offset.x = 1; const R = 24, span = 2.8, H = R * span / 2 * t.image.height / t.image.width;
    const back = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 96, 1, true, Math.PI - span / 2, span), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
    back.position.set(0, H * 0.4 - 2.6, 4); scene.add(back); });
  const TW = 9.5, TD = 5.2;
  const clothMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.95 });
  clothMat.color.set('#FFF8EC');   /* a plain cream cloth: nothing to distract */
  const woodMat = new THREE.MeshStandardMaterial({ color: '#B9844F', roughness: 0.6 }); tex(['stall-wood.jpg', 'table-wood.jpg'], t => { woodMat.map = rep(t, 2, 1); woodMat.color.set('#FFFFFF'); woodMat.needsUpdate = true; });
  const top = new THREE.Mesh(new THREE.BoxGeometry(TW, 0.25, TD), woodMat); top.position.y = -0.13; top.receiveShadow = true; scene.add(top);
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(TW - 1.2, 0.02, TD - 1.0), clothMat); cloth.position.y = 0.01; cloth.receiveShadow = true; scene.add(cloth);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.35), woodMat); l.position.set(a * (TW / 2 - 0.5), -1.45, b * (TD / 2 - 0.5)); scene.add(l); });

  /* the boys behind the table */
  const kids = opt.kids.map((who, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, visible: false, toneMapped: false }));
    m.onBeforeRender = () => m.quaternion.copy(camera.quaternion); scene.add(m);
    const k = { who, m, pose(p) { loader.load('art/' + who + '-' + p + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; m.material.map = t; m.material.visible = true; m.material.needsUpdate = true; const H = 2.3; m.scale.set(H * t.image.width / t.image.height, H, 1); }, undefined, () => { if (p !== 'idle') k.pose('idle'); }); } };
    k.pose('idle'); return k; });

  /* ---------------- counters (red on one side, yellow on the other) ---------------- */
  /* the two parts are two fruits every child knows: oranges (round, orange) and lemons (oval, yellow) */
  const orM = new THREE.MeshPhysicalMaterial({ color: '#FF8A1E', roughness: 0.45, clearcoat: 0.5 }), leM = new THREE.MeshPhysicalMaterial({ color: '#FFE03A', roughness: 0.45, clearcoat: 0.5 });
  tex('orange-skin.jpg', t => { orM.map = t; orM.color.set('#FFFFFF'); orM.needsUpdate = true; }); tex('lemon-skin.jpg', t => { leM.map = t; leM.color.set('#FFFFFF'); leM.needsUpdate = true; });
  const orG = new THREE.SphereGeometry(0.3, 28, 20), leG = new THREE.SphereGeometry(0.27, 28, 20); leG.scale(1.12, 0.9, 0.9);   /* lemons stay apart, so each can be counted */
  const leafM = new THREE.MeshStandardMaterial({ color: '#4CB050' });
  function fruit(orange) { const g = new THREE.Group(); const b = new THREE.Mesh(orange ? orG : leG, orange ? orM : leM); b.castShadow = true; b.position.y = 0.28; g.add(b);
    if (orange) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 6), leafM); l.scale.set(1.5, 0.3, 0.8); l.position.set(0.06, 0.58, 0); g.add(l); }
    g.userData.red = orange; return g; }
  function counter() { return fruit(true); }
  const glazeMat = new THREE.MeshStandardMaterial({ color: '#D9A55E', roughness: 0.8, side: THREE.DoubleSide }); tex(['wicker-basket.jpg', 'basket-weave.jpg'], t => { glazeMat.map = rep(t, 3, 1); glazeMat.color.set('#FFFFFF'); glazeMat.needsUpdate = true; });   /* a wicker basket */
  const cup = new THREE.Group(); scene.add(cup);
  { const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 1.4, 40, 1, true), glazeMat); body.position.y = 0.7; body.castShadow = true; cup.add(body);
    const bot = new THREE.Mesh(new THREE.CircleGeometry(0.6, 40), glazeMat); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.02; cup.add(bot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 10, 40), new THREE.MeshStandardMaterial({ color: '#FFFFFF' })); rim.rotation.x = Math.PI / 2; rim.position.y = 1.4; cup.add(rim); }
  let counters = []; cup.visible = false;
  /* ---------------- a tray of oranges, and the big upside-down basket some of them hide under ---------------- */
  const plateM = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });
  const platter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 1.9), new THREE.MeshStandardMaterial({ color: '#EBD5B0', roughness: 0.8 })); platter.position.set(-1.0, 0.05, 0.4); platter.castShadow = true; scene.add(platter);
  let slices = [];
  const towel = new THREE.Group(); towel.visible = false; scene.add(towel);   /* (kept the name 'towel' so the games share one API) a wicker dome */
  { const dm = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2), glazeMat); dm.castShadow = true; dm.scale.set(1, 0.85, 0.8); towel.add(dm);
    const rimB = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.07, 10, 40), new THREE.MeshStandardMaterial({ color: '#B57E3E' })); rimB.rotation.x = Math.PI / 2; rimB.scale.set(1, 0.8, 1); towel.add(rimB); }
  const HIDE_X = 2.2;
  const slot = (j, n) => { const per = Math.min(5, Math.max(1, n)), row = Math.floor(j / 5), col = j % 5; return new THREE.Vector3(-1.0 + (col - (Math.min(5, n) - 1) / 2) * 0.76, 0.08, 0.4 + (n > 5 ? (row ? 0.42 : -0.42) : 0)); };
  const hideSlot = (j, k) => { const per = Math.min(3, k), row = Math.floor(j / 3), col = j % 3; return new THREE.Vector3(HIDE_X + (col - (per - 1) / 2) * 0.55, 0.08, 0.4 + (k > 3 ? (row % 2 ? 0.3 : -0.3) : 0)); };
  /* two little plates for the two parts */
  const plates = [-1, 1].map(s => { const p = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.3, 0.1, 40), new THREE.MeshStandardMaterial({ color: s < 0 ? '#FFD9B0' : '#CFE6FF', roughness: 0.3 })); p.position.set(s * 1.75, 0.06, 0.4); p.castShadow = true; p.visible = false; scene.add(p); return p; });

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
  let Wd = 1, Hh = 1, narrow = false; const DIR = new THREE.Vector3(0, 0.44, 0.9).normalize(), V = 34; let dist = 14;   /* low enough to see Bubby's kitchen behind */ const center = new THREE.Vector3(0, 0.3, 0.2);
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  function layout() {
    cup.position.set(narrow ? 1.6 : 2.9, 0, narrow ? -1.2 : -0.7);
    kids.forEach((k, i) => k.m.position.set(narrow ? (i ? 1.9 : -1.9) : (i ? 3.4 : -3.4), 0.35, -3.1));   /* standing behind the table, seen from the waist up */
  }
  function fit() {
    Wd = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(Wd, Hh, false); narrow = Wd < Hh * 0.95 || Wd < 700; layout();
    const span = narrow ? 7.0 : 9.6, needH = narrow ? 5.4 : 4.6; center.x = narrow ? 0.3 : 0;   /* phone: the basket on the right stays on screen */
    const [b0, b1] = band(), bc = (b0 + b1) / 2, bh = Math.max(120, b1 - b0), fullH = Hh + 2 * Math.abs(Hh / 2 - bc), tn = Math.tan(THREE.MathUtils.degToRad(V / 2));
    dist = Math.max(span * fullH / (2 * Wd * tn), needH * fullH / (2 * tn * bh));
    camera.aspect = Wd / fullH; camera.fov = V; camera.setViewOffset(Wd, fullH, 0, fullH / 2 - bc, Wd, Hh); camera.updateProjectionMatrix();
  }
  let last = performance.now(), alive = true;
  function frame() { if (!alive) return; requestAnimationFrame(frame); const now = performance.now(), dt = Math.min(50, now - last); last = now;
    for (let i = bits.length - 1; i >= 0; i--) { const b = bits[i]; b.userData.t += dt; b.userData.v.y -= 0.0022 * dt / 16; b.position.addScaledVector(b.userData.v, dt / 16); if (b.userData.t > 1600 || b.position.y < 0.05) { scene.remove(b); bits.splice(i, 1); } }
    camera.position.copy(center).addScaledVector(DIR, dist); camera.lookAt(center); camera.updateMatrixWorld(); renderer.render(scene, camera); place(); }

  const sliceX = (j, n) => (j - (n - 1) / 2) * 1.0;
  const api = {
    kids, spot, unspot, sparkle, narrow: () => narrow, plates,
    showCup(on) { cup.visible = on; },
    cupSpot() { return spot('cup', cup, { cls: 'cup', r: 0.8, y: 0.8, min: 80 }); },
    /* counters: n in the cup (hidden), spill them out; red = how many show red */
    clearCounters() { counters.forEach(c => scene.remove(c)); counters = []; },
    async shake() { NK.sound.pop(); await tween(600, (e, t) => { cup.rotation.z = Math.sin(t * Math.PI * 6) * 0.25 * (1 - t); cup.position.y = Math.abs(Math.sin(t * Math.PI * 6)) * 0.15; }); cup.rotation.z = 0; cup.position.y = 0; },
    async spill(n, red) {
      api.clearCounters(); platter.visible = false; slices.forEach(o => scene.remove(o)); slices = []; const from = cup.position.clone().setY(1.4); NK.sound.cloth && NK.sound.cloth();
      const xs = []; for (let j = 0; j < n; j++) xs.push(new THREE.Vector3((j - (n - 1) / 2) * 0.82 - (narrow ? 0.9 : 0.6), 0.07, 0.55 + (j % 2 ? 0.25 : -0.25)));
      const flags = []; for (let j = 0; j < n; j++) flags.push(j < red); flags.sort((a, b) => b - a);   /* reds together on the left, yellows on the right: easy to see the two parts */
      for (let j = 0; j < n; j++) { const c = fruit(flags[j]); c.position.copy(from); scene.add(c); counters.push(c); }
      await Promise.all(counters.map((c, j) => new Promise(r => setTimeout(r, j * T(90))).then(() => tween(520, e => { c.position.lerpVectors(from, xs[j], e); c.position.y += Math.sin(Math.PI * e) * 1.2; c.rotation.y = e * Math.PI * 2; }))));
    },
    counters: () => counters,
    /* oranges: n on the tray (rows of five); hide k under the big basket: they roll over, the basket comes down over them */
    setKugel(n) { slices.forEach(o => scene.remove(o)); slices = []; platter.visible = n > 0; for (let j = 0; j < n; j++) { const o = fruit(true); o.position.copy(slot(j, n)); scene.add(o); slices.push(o); } towel.visible = false; spot('towel', towel, { cls: 'towel', r: 1.0, y: 0.5, min: 80 }); },
    async hide(k) { const n = slices.length; if (!k) { towel.visible = false; return; } const moving = slices.slice(n - k), from = moving.map(o => o.position.clone()), to = moving.map((o, j) => hideSlot(j, k));
      await tween(500, e => moving.forEach((o, j) => { o.position.lerpVectors(from[j], to[j], e); o.position.y += Math.sin(Math.PI * e) * 0.3; }));
      towel.position.set(HIDE_X, 2.4, 0.4); towel.visible = true; await tween(450, e => { towel.position.y = 2.4 - e * 2.38; }); towel.position.y = 0.02; moving.forEach(o => { o.visible = false; }); },   /* under the basket: really hidden */
    async lift() { if (!towel.visible) return; slices.forEach(o => { o.visible = true; }); await tween(450, e => { towel.position.y = 0.02 + e * 1.9; towel.rotation.z = -e * 0.3; }); towel.visible = false; towel.rotation.z = 0; },
    /* split it: n fruits in rows of five; the first k are oranges, the rest lemons */
    setSplit(n, k) { slices.forEach(o => scene.remove(o)); slices = []; platter.visible = true; towel.visible = false; for (let j = 0; j < n; j++) { const o = fruit(j < k); o.position.copy(slot(j, n)); scene.add(o); slices.push(o); } },
    slices: () => slices, towelOn: () => towel.visible,
    async bumpAll(list, say) { for (let i = 0; i < list.length; i++) { const o = list[i], y0 = o.position.y; await tween(240, (e, t) => { o.position.y = y0 + Math.sin(Math.PI * t) * 0.35; }); o.position.y = y0; if (say) await say(i); } },
    /* parts on two plates: show a and b slices (or counters) on the two little plates */
    setPlates(a, b, what) { platter.visible = false; slices.forEach(s => scene.remove(s)); slices = []; towel.visible = false; plates.forEach((p, i) => { p.visible = true; while (p.children.length) p.remove(p.children[0]); p.position.x = (i ? 1 : -1) * (narrow ? 1.5 : 1.75); p.scale.setScalar(narrow ? 0.85 : 1); });
      [a, b].forEach((n, k) => { for (let j = 0; j < n; j++) { const o = fruit(what === 'counters' ? !k : true);
        const per = n > 3 ? Math.ceil(n / 2) : n, row = Math.floor(j / per), col = j % per, inRow = row ? n - per : per; if (what !== 'counters') o.scale.setScalar(0.5);
        o.position.set((col - (inRow - 1) / 2) * 0.66, what === 'counters' ? 0.1 : 0.2, n > 3 ? (row ? 0.38 : -0.38) : 0); plates[k].add(o); } }); },   /* rows with gaps, so each one can be counted */
    hidePlates() { plates.forEach(p => { p.visible = false; }); platter.visible = true; },
    fit, destroy() { alive = false; renderer.dispose(); }
  };
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}
