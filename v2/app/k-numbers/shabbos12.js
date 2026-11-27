/* Kindergarten Numbers, Unit 12 "Adding and taking away within 10": a calm 3D Shabbos table (K-CLARITY-RULES: calm, one thing to look at).
   A long table with a white cloth; at the back, two silver candlesticks and a challah under a blue cover (all still). Two painted boys stand behind it.
   Stories within 10, always in rows of five in the middle of the table:
   - silver cups are set from a tray on the right ("six cups, three more are set"): he taps the tray, one cup moves to its place;
   - round candies are eaten into a small bowl on the left ("nine candies, four are eaten"): he taps a candy, it goes to the bowl.
   ES module: import { mount } from './shabbos12.js'. */
import * as THREE from 'three';

const FAST = /[?&]fast=1/.test(location.search);
const T = ms => FAST ? Math.min(ms, 60) : ms;
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const tween = (ms, fn) => new Promise(res => { const t0 = performance.now(), d = T(ms); (function f() { const t = Math.min(1, (performance.now() - t0) / d); fn(ease(t), t); if (t < 1) requestAnimationFrame(f); else res(); })(); });
/* the boys, in the order they come in (new boys from order N11 fall back to an existing picture until they arrive) */

export function mount(host, opt) {
  opt = Object.assign({ band: null, kids: ['mendy', 'shmuli'] }, opt || {});
  host.classList.add('p6world');
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FAST ? 1 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !FAST; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement); renderer.domElement.className = 'p6canvas';
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#EAF4E2');
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight('#FFF6E8', '#A89070', 1.35));
  const sun = new THREE.DirectionalLight('#FFE9C8', 1.9); sun.position.set(-7, 12, 6); sun.castShadow = !FAST;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 1, far: 40 }); sun.shadow.radius = 6; sun.shadow.bias = -0.0006; scene.add(sun);
  const loader = new THREE.TextureLoader();
  function tex(files, fn) { const list = [].concat(files); (function next(i) { if (i >= list.length) return; loader.load('art/' + list[i], t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; fn(t); }, undefined, () => next(i + 1)); })(0); }
  const rep = (t, x, y) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); return t; };

  /* the Shabbos table all around (painted, order N11; the garden until it comes), a wooden floor, the table */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: '#D8C3A0', roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.6; floor.receiveShadow = true; scene.add(floor);
  if (!FAST) tex(['shabbos-panorama.jpg', 'kitchen-panorama.jpg'], t => { t.wrapS = THREE.MirroredRepeatWrapping; t.repeat.x = -2; t.offset.x = 1; const R = 24, span = 2.8, H = R * span / 2 * t.image.height / t.image.width;
    const back = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 96, 1, true, Math.PI - span / 2, span), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, color: '#F2F2F2' }));
    back.position.set(0, H * 0.4 - 2.6, 16); scene.add(back); });   /* the Shabbos table walls stand close behind the table */
  const TW = 9.5, TD = 4.6;
  const woodMat = new THREE.MeshStandardMaterial({ color: '#C79A68', roughness: 0.6 }); tex(['counter-wood.jpg', 'table-wood.jpg'], t => { woodMat.map = rep(t, 2, 1); woodMat.color.set('#FFFFFF'); woodMat.needsUpdate = true; });
  const top = new THREE.Mesh(new THREE.BoxGeometry(TW, 0.25, TD), woodMat); top.position.y = -0.13; top.receiveShadow = true; top.castShadow = true; scene.add(top);
  const clothM = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.95 }); tex('white-tablecloth.jpg', t => { clothM.map = rep(t, 3, 2); clothM.needsUpdate = true; });
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(TW - 0.6, 0.03, TD - 0.6), clothM); cloth.position.y = 0.01; cloth.receiveShadow = true; scene.add(cloth);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.35), woodMat); l.position.set(a * (TW / 2 - 0.5), -1.45, b * (TD / 2 - 0.5)); scene.add(l); });


  /* the Shabbos table at the back: two silver candlesticks (still, a soft glow) and a challah under a blue cover */
  const silverM = new THREE.MeshStandardMaterial({ color: '#B9C3D2', roughness: 0.25, metalness: 0.15, emissive: '#4A5466', emissiveIntensity: 0.2 });   /* darker silver: stands out on the white cloth */
  const deco = new THREE.Group(); scene.add(deco);
  [-1, 1].forEach(s => { const g = new THREE.Group(); g.position.set(s * 0.45 - 1.75, 0, -1.9); deco.add(g);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.1, 24), silverM); base.position.y = 0.05; g.add(base);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.9, 16), silverM); stem.position.y = 0.55; g.add(stem);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 0.14, 16), silverM); cup.position.y = 1.05; g.add(cup);
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6, 16), new THREE.MeshStandardMaterial({ color: '#FFFDF5' })); candle.position.y = 1.4; g.add(candle);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: '#FFC94A' })); flame.scale.set(1, 1.8, 1); flame.position.y = 1.78; g.add(flame); });
  { const coverM = new THREE.MeshStandardMaterial({ color: '#3D5BC4', roughness: 0.8 }); tex('challah-cover.jpg', t => { coverM.map = t; coverM.color.set('#FFFFFF'); coverM.emissive.set('#22348A'); coverM.emissiveIntensity = 0.45; coverM.needsUpdate = true; });
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), coverM); c.scale.set(1.15, 0.7, 0.7); c.position.set(1.75, 0.02, -1.9); c.castShadow = true; deco.add(c);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.04, 8, 48), new THREE.MeshStandardMaterial({ color: '#E8C15A', roughness: 0.4 })); rim.rotation.x = Math.PI / 2; rim.scale.set(1.15, 0.7, 1); rim.position.set(1.75, 0.03, -1.9); deco.add(rim); }   /* a plain blue cover with a gold edge (no letters) */

  /* the two boys behind the table (painted) */
  const kids = opt.kids.map((who, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, visible: false, toneMapped: false }));
    m.onBeforeRender = () => m.quaternion.copy(camera.quaternion); scene.add(m);
    loader.load('art/' + who + '-idle.png', t => { t.colorSpace = THREE.SRGBColorSpace; m.material.map = t; m.material.visible = true; m.material.needsUpdate = true; const H = 2.3; m.scale.set(H * t.image.width / t.image.height, H, 1); });
    return m; });

  /* ---------------- the things in the stories: silver cups and round candies, in rows of five ---------------- */
  const candyCols = ['#FF6FA8', '#FFB31A', '#4FA8FF', '#22B45E', '#A779FF'];
  function cupMesh() { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.42, 24, 1, true), silverM); b.position.y = 0.36; b.castShadow = true; g.add(b);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.06, 20), silverM); foot.position.y = 0.03; g.add(foot); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 12), silverM); st.position.y = 0.12; g.add(st); return g; }
  function candyMesh(j) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshPhysicalMaterial({ color: candyCols[j % 5], roughness: 0.3, clearcoat: 0.6 })); b.position.y = 0.22; b.castShadow = true; g.add(b); return g; }
  const ROWX = 0.72, ROWZ = 0.5, mid = new THREE.Vector3(0, 0.02, 0.3);
  const slotPos = j => new THREE.Vector3(mid.x + ((j % 5) - 2) * ROWX, mid.y, mid.z + (j < 5 ? -ROWZ : ROWZ));
  const tray = new THREE.Group(); scene.add(tray);   /* where new cups wait (right) */
  { const t = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 1.1), new THREE.MeshStandardMaterial({ color: '#C8A064', roughness: 0.6 }));   /* a wooden tray */ t.position.y = 0.03; t.castShadow = true; tray.add(t); }
  const bowl = new THREE.Group(); scene.add(bowl);   /* where eaten candies go (left) */
  { const b = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#FFD3B0', roughness: 0.4, side: THREE.DoubleSide })); b.scale.set(1, 0.45, 1); b.position.y = 0.34; b.castShadow = true; bowl.add(b); }
  let items = [], waitingCups = [], eaten = [], kind = 'cup';
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

  /* ---------------- camera ---------------- */
  let Wd = 1, Hh = 1, narrow = false; const DIR = new THREE.Vector3(0, 0.5, 0.86).normalize(), V = 34; let dist = 14; const center = new THREE.Vector3(0, 0.4, -0.2);
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  function layout() {
    kids.forEach((m, i) => m.position.set((i ? 1 : -1) * (narrow ? 1.7 : 3.4), 0.55, -3.0));
    tray.position.set(narrow ? 1.25 : 3.3, 0, narrow ? 1.7 : 1.45);   /* low on the right, clearly apart from the rows */ bowl.position.set(narrow ? -1.25 : -3.3, 0, narrow ? 1.7 : 1.45); tray.scale.setScalar(narrow ? 0.8 : 1); bowl.scale.setScalar(narrow ? 0.8 : 1);
    deco.visible = !narrow;   /* the phone shows only the story: calm */ waitingCups.forEach((c, j) => c.position.copy(trayPos(j)));
  }
  const trayPos = j => tray.position.clone().add(new THREE.Vector3(((j % 3) - 1) * 0.42 * tray.scale.x, 0.06, (j < 3 ? -0.22 : 0.22) * tray.scale.x));
  function fit() {
    Wd = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(Wd, Hh, false); narrow = Wd < Hh * 0.95 || Wd < 700; layout();
    const span = narrow ? 4.6 : 9.0, needH = narrow ? 4.4 : 4.2;
    const [b0, b1] = band(), bc = (b0 + b1) / 2, bh = Math.max(120, b1 - b0), fullH = Hh + 2 * Math.abs(Hh / 2 - bc), tn = Math.tan(THREE.MathUtils.degToRad(V / 2));
    dist = Math.max(span * fullH / (2 * Wd * tn), needH * fullH / (2 * tn * bh));
    camera.aspect = Wd / fullH; camera.fov = V; camera.setViewOffset(Wd, fullH, 0, fullH / 2 - bc, Wd, Hh); camera.updateProjectionMatrix();
  }
  let alive = true;
  function frame() { if (!alive) return; requestAnimationFrame(frame); camera.position.copy(center).addScaledVector(DIR, dist); camera.lookAt(center); camera.updateMatrixWorld(); renderer.render(scene, camera); place(); }

  function clear() { items.concat(waitingCups, eaten).forEach(o => o.parent && o.parent.remove(o)); items = []; waitingCups = []; eaten = []; for (let j = 0; j < 12; j++) unspot('it' + j); unspot('tray'); }
  const api = {
    spot, unspot, tween, narrow: () => narrow,
    /* n things in rows of five; for cups, k more wait on the tray */
    setCups(n, k) { clear(); kind = 'cup'; for (let j = 0; j < n; j++) { const c = cupMesh(); c.position.copy(slotPos(j)); scene.add(c); items.push(c); }
      for (let j = 0; j < (k || 0); j++) { const c = cupMesh(); c.position.copy(trayPos(j)); scene.add(c); waitingCups.push(c); } tray.visible = true; bowl.visible = false; },
    traySpot(on) { if (on && waitingCups.length) spot('tray', tray, { cls: 'side hint', r: 0.9, y: 0.2, min: 80 }); else unspot('tray'); },
    async setOne() { const c = waitingCups.shift(); if (!c) return false; const to = slotPos(items.length); items.push(c); NK.sound.pop(); const from = c.position.clone();
      await tween(420, e => { c.position.lerpVectors(from, to, e); c.position.y += Math.sin(Math.PI * e) * 0.6; }); c.position.copy(to); if (!waitingCups.length) unspot('tray'); return true; },
    waiting: () => waitingCups.length,
    setCandies(n) { clear(); kind = 'candy'; for (let j = 0; j < n; j++) { const c = candyMesh(j); c.position.copy(slotPos(j)); c.userData.id = 'it' + j; scene.add(c); items.push(c); } tray.visible = false; bowl.visible = true; },
    candySpots(on) { for (let j = 0; j < 12; j++) unspot('it' + j); if (on) items.forEach(c => spot(c.userData.id, c, { r: 0.3, y: 0.2, min: 64 })); },
    async eatOne(id) { const c = items.find(x => x.userData.id === id) || items[items.length - 1]; if (!c) return false; unspot(c.userData.id); items.splice(items.indexOf(c), 1); NK.sound.pop();
      const g = eaten.length, to = bowl.position.clone().add(new THREE.Vector3(((g % 3) - 1) * 0.34 * bowl.scale.x, 0.12 + Math.floor(g / 3) * 0.05, ((Math.floor(g / 3) % 2) ? 0.2 : -0.15) * bowl.scale.x)); eaten.push(c);
      const from = c.position.clone(); await tween(450, e => { c.position.lerpVectors(from, to, e); c.position.y += Math.sin(Math.PI * e) * 0.8; }); c.position.copy(to); return true; },
    items: () => items.slice(), eatenList: () => eaten.slice(), clear,
    empty() { clear(); tray.visible = bowl.visible = false; },
    rows(n) { api.empty(); for (let j = 0; j < n; j++) { const c = cupMesh(); c.position.copy(slotPos(j)); scene.add(c); items.push(c); } },   /* n cups in rows of five: a ten-frame on the table */
    async bumpAll(list, say) { for (let i = 0; i < list.length; i++) { const o = list[i], y0 = o.position.y; await tween(240, (e, t) => { o.position.y = y0 + Math.sin(Math.PI * t) * 0.35; }); o.position.y = y0; if (say) await say(i); } },
    fit, destroy() { alive = false; renderer.dispose(); }
  };
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}
