/* Kindergarten Numbers, Unit 11 "Adding and taking away within 5": a calm 3D sukkah (K-CLARITY-RULES: calm, one thing to look at).
   A long table with a white cloth and five chairs behind it. Boys (painted) come in through the opening on the right and stand at a chair
   ("three boys in the sukkah, one more comes"), or go out. A plate of round golden cookies sits on the table; a cookie he takes away
   goes into a little box on the left ("four cookies, two are eaten"). Every boy and cookie he can tap has a see-through tap spot.
   ES module: import { mount } from './sukkah11.js'. */
import * as THREE from 'three';

const FAST = /[?&]fast=1/.test(location.search);
const T = ms => FAST ? Math.min(ms, 60) : ms;
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const tween = (ms, fn) => new Promise(res => { const t0 = performance.now(), d = T(ms); (function f() { const t = Math.min(1, (performance.now() - t0) / d); fn(ease(t), t); if (t < 1) requestAnimationFrame(f); else res(); })(); });
/* the boys, in the order they come in (new boys from order N11 fall back to an existing picture until they arrive) */
const BOYS = [['mendy'], ['dovid'], ['avi'], ['shmuli', 'ari'], ['yossi', 'ari']];

export function mount(host, opt) {
  opt = Object.assign({ band: null }, opt || {});
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

  /* the sukkah all around (painted, order N11; the garden until it comes), a wooden floor, the table */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: '#D8C3A0', roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.6; floor.receiveShadow = true; scene.add(floor);
  if (!FAST) tex(['sukkah-panorama.jpg', 'garden-panorama.jpg'], t => { t.wrapS = THREE.MirroredRepeatWrapping; t.repeat.x = -2; t.offset.x = 1; const R = 24, span = 2.8, H = R * span / 2 * t.image.height / t.image.width;
    const back = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 96, 1, true, Math.PI - span / 2, span), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, color: '#F2F2F2' }));
    back.position.set(0, H * 0.4 - 2.6, 4); scene.add(back); });
  const TW = 9.5, TD = 4.6;
  const woodMat = new THREE.MeshStandardMaterial({ color: '#C79A68', roughness: 0.6 }); tex(['counter-wood.jpg', 'table-wood.jpg'], t => { woodMat.map = rep(t, 2, 1); woodMat.color.set('#FFFFFF'); woodMat.needsUpdate = true; });
  const top = new THREE.Mesh(new THREE.BoxGeometry(TW, 0.25, TD), woodMat); top.position.y = -0.13; top.receiveShadow = true; top.castShadow = true; scene.add(top);
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(TW - 0.6, 0.03, TD - 0.6), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.95 })); cloth.position.y = 0.01; cloth.receiveShadow = true; scene.add(cloth);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.35), woodMat); l.position.set(a * (TW / 2 - 0.5), -1.45, b * (TD / 2 - 0.5)); scene.add(l); });

  /* five chairs behind the table: one place for each boy */
  const chairM = new THREE.MeshStandardMaterial({ color: '#B98A58', roughness: 0.6 });
  const SEATS = 5, seatX = (i, w) => (i - (SEATS - 1) / 2) * w;
  const chairs = []; for (let i = 0; i < SEATS; i++) { const c = new THREE.Group(); const back = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.12), chairM); back.position.set(0, 0.35, -0.3); back.castShadow = true; c.add(back);
    c.position.set(0, 0, -2.75); c.visible = false; scene.add(c); chairs.push(c); }   /* (no chairs shown: they hid the boys) */

  /* the boys: painted billboards that always face us */
  const boys = BOYS.map((names, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, visible: false, toneMapped: false, side: THREE.DoubleSide }));
    m.onBeforeRender = () => m.quaternion.copy(camera.quaternion); m.visible = false; scene.add(m);
    const b = { i, m, pose(p) { const tryN = j => { if (j >= names.length) return; loader.load('art/' + names[j] + '-' + p + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; m.material.map = t; m.material.visible = true; m.material.needsUpdate = true; const H = 2.3; m.scale.set((j > 0 && i === 4 ? -1 : 1) * H * t.image.width / t.image.height, H, 1); },   /* a stand-in picture for boy five is turned the other way */
        undefined, () => p !== 'idle' ? b.pose('idle') : tryN(j + 1)); }; tryN(0); } };
    b.pose('idle'); return b; });
  let inRoom = 0;
  const door = new THREE.Object3D(); scene.add(door);   /* the opening on the right, where boys come in (a tap spot only) */

  /* ---------------- cookies: round golden butter cookies on a plate; eaten ones go into a little box ---------------- */
  const cookieM = new THREE.MeshStandardMaterial({ color: '#E2A85A', roughness: 0.75 }); tex('cookie-top.jpg', t => { cookieM.map = t; cookieM.color.set('#FFFFFF'); cookieM.needsUpdate = true; });
  const cookieG = new THREE.CylinderGeometry(0.34, 0.36, 0.12, 32), domeG = new THREE.SphereGeometry(0.34, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), chipG = new THREE.SphereGeometry(0.05, 10, 6), chipM = new THREE.MeshStandardMaterial({ color: '#5A3418', roughness: 0.6 });
  function cookie() { const c = new THREE.Mesh(cookieG, cookieM); c.castShadow = true; const d = new THREE.Mesh(domeG, cookieM); d.scale.y = 0.22; d.position.y = 0.06; c.add(d);
    [[0.12, 0.08], [-0.14, 0.1], [0.02, -0.15], [-0.05, 0.0], [0.18, -0.1]].forEach(([x, z]) => { const h = new THREE.Mesh(chipG, chipM); h.position.set(x, 0.12, z); h.scale.y = 0.6; c.add(h); }); return c; }   /* a round butter cookie with chocolate chips */
  const plate = new THREE.Group(); scene.add(plate);
  { const p = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.1, 0.08, 40), new THREE.MeshStandardMaterial({ color: '#BFDDFF', roughness: 0.3 })); p.position.y = 0.04; p.castShadow = true; plate.add(p); }
  const box = new THREE.Group(); scene.add(box);
  { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.85, 0.08, 40), new THREE.MeshStandardMaterial({ color: '#FFD3B0', roughness: 0.3 })); p.position.y = 0.04; p.castShadow = true; box.add(p); }   /* a small peach plate: the eaten ones */
  let cookies = [], gone = [];
  const cookiePos = (j, n) => new THREE.Vector3(((j % 3) - (Math.min(3, n - Math.floor(j / 3) * 3) - 1) / 2) * 0.8, 0.14, n > 3 ? (j < 3 ? -0.38 : 0.38) : 0);

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

  const bits = [], COL = ['#FF7FA8', '#FFD23D', '#FFFFFF', '#B98CFF', '#7FD67A', '#7FC8FF'];
  function sparkle(x, z) { if (FAST) return; const g = new THREE.SphereGeometry(0.06, 8, 6); for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: COL[i % 6] })); m.position.set(x || 0, 1.2, z || 0);
    m.userData.v = new THREE.Vector3((Math.random() - .5) * .08, .07 + Math.random() * .05, (Math.random() - .5) * .08); m.userData.t = 0; scene.add(m); bits.push(m); } }

  /* ---------------- camera ---------------- */
  let Wd = 1, Hh = 1, narrow = false, mode = 'boys'; const DIR = new THREE.Vector3(0, 0.46, 0.89).normalize(), V = 34; let dist = 14; const center = new THREE.Vector3(0, 0.4, -0.4);
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  const gapX = () => narrow ? 0.95 : 1.55, doorX = () => narrow ? 3.4 : 5.6;
  const waitPos = j => seat(inRoom + j).setZ(-4.2).setY(0.55);   /* waiting just outside, right behind his own empty chair */
  let waiting = 0;
  function seat(i) { return new THREE.Vector3(seatX(i, gapX()), 0, -2.55); }
  function layout() {
    chairs.forEach((c, i) => { c.position.x = seatX(i, gapX()); c.scale.setScalar(narrow ? 0.8 : 1); });
    boys.forEach((b, i) => { if (i < inRoom) { const s = seat(i); b.m.position.x = s.x; b.m.position.z = s.z; } }); door.position.set(doorX(), 1.2, -1.2);
    plate.position.set(narrow ? 0.6 : 0.9, 0, 0.5); box.position.set(narrow ? -1.45 : -1.9, 0, 0.6); box.scale.setScalar(narrow ? 0.75 : 1);
  }
  function fit() {
    Wd = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(Wd, Hh, false); narrow = Wd < Hh * 0.95 || Wd < 700; layout();
    const boysView = mode === 'boys', span = narrow ? (boysView ? 5.6 : 4.6) : boysView ? 8.2 : 7.0, needH = narrow ? (boysView ? 4.4 : 3.6) : boysView ? 3.9 : 3.2; center.z = boysView ? -2.0 : 0.4; center.y = boysView ? 0.7 : 0.2;   /* the boy games look at the boys */
    const [b0, b1] = band(), bc = (b0 + b1) / 2, bh = Math.max(120, b1 - b0), fullH = Hh + 2 * Math.abs(Hh / 2 - bc), tn = Math.tan(THREE.MathUtils.degToRad(V / 2));
    dist = Math.max(span * fullH / (2 * Wd * tn), needH * fullH / (2 * tn * bh));
    camera.aspect = Wd / fullH; camera.fov = V; camera.setViewOffset(Wd, fullH, 0, fullH / 2 - bc, Wd, Hh); camera.updateProjectionMatrix();
  }
  let last = performance.now(), alive = true;
  function frame() { if (!alive) return; requestAnimationFrame(frame); const now = performance.now(), dt = Math.min(50, now - last); last = now;
    for (let i = bits.length - 1; i >= 0; i--) { const b = bits[i]; b.userData.t += dt; b.userData.v.y -= 0.0022 * dt / 16; b.position.addScaledVector(b.userData.v, dt / 16); if (b.userData.t > 1600 || b.position.y < 0.05) { scene.remove(b); bits.splice(i, 1); } }
    camera.position.copy(center).addScaledVector(DIR, dist); camera.lookAt(center); camera.updateMatrixWorld(); renderer.render(scene, camera); place(); }

  const wp = new THREE.Vector3();
  async function walk(b, from, to) { b.m.visible = true; await tween(700, (e, t) => { b.m.position.lerpVectors(from, to, e); b.m.position.y = 0.55 + Math.abs(Math.sin(t * Math.PI * 4)) * 0.12; }); b.m.position.copy(to).setY(0.55); }
  const api = {
    spot, unspot, sparkle, narrow: () => narrow, tween, boys,
    /* boys: n are in the sukkah, standing at the first n chairs */
    setBoys(n) { inRoom = n; waiting = 0; for (let j = 0; j < SEATS; j++) unspot('w' + j); boys.forEach((b, i) => { b.m.visible = i < n; b.pose('idle'); if (i < n) { const s = seat(i); b.m.position.set(s.x, 0.55, s.z); } unspot('boy' + i); }); },
    inRoom: () => inRoom,
    /* k boys wait outside on the right; he taps one and he comes in */
    showWaiting(k) { waiting = Math.min(k, SEATS - inRoom); for (let j = 0; j < SEATS; j++) unspot('w' + j);
      for (let j = 0; j < waiting; j++) { const b = boys[inRoom + j]; b.m.visible = true; b.pose('idle'); b.m.position.copy(waitPos(j)); spot('w' + (inRoom + j), b.m, { cls: 'side hint', r: 0.45, y: 0, min: 70 }); } },
    waiting: () => waiting,
    async comeOne() { if (!waiting) return false; const b = boys[inRoom], to = seat(inRoom); unspot('w' + inRoom); inRoom++; waiting--; b.pose('happy'); NK.sound.pop(); await walk(b, b.m.position.clone(), to); b.pose('idle'); return true; },
    /* k more boys come in through the opening on the right, one at a time */
    async comeIn(k, each) { for (let j = 0; j < k && inRoom < SEATS; j++) { const b = boys[inRoom], to = seat(inRoom); inRoom++; b.pose('happy'); NK.sound.pop(); await walk(b, new THREE.Vector3(doorX(), 0.55, -1.2), to); b.pose('idle'); if (each) await each(inRoom); } },
    /* k boys go out (the last ones in), one at a time */
    async goOut(k, each) { for (let j = 0; j < k && inRoom > 0; j++) { inRoom--; const b = boys[inRoom]; unspot('boy' + inRoom); await walk(b, b.m.position.clone(), new THREE.Vector3(doorX(), 0.55, -1.2)); b.m.visible = false; if (each) await each(inRoom); } },
    boySpots(on) { boys.forEach((b, i) => { if (on && i < inRoom) spot('boy' + i, b.m, { cls: 'side', r: 0.5, y: 0.0, min: 70 }); else unspot('boy' + i); }); },
    doorSpot(on) { if (on) spot('door', door, { cls: 'side doorspot', r: 0.8, y: 0, min: 90 }); else unspot('door'); },
    boyMeshes: () => boys.slice(0, inRoom).map(b => b.m),
    /* cookies on the plate; tapping one takes it away into the box */
    setCookies(n) { cookies.concat(gone).forEach(c => c.parent && c.parent.remove(c)); cookies = []; gone = []; plate.visible = true;
      for (let j = 0; j < n; j++) { const c = cookie(); c.position.copy(cookiePos(j, n)); plate.add(c); cookies.push(c); } api.cookieSpots(false); },
    cookieSpots(on) { for (let j = 0; j < 6; j++) unspot('ck' + j); if (on) cookies.forEach((c, j) => { c.userData.id = 'ck' + j; spot('ck' + j, c, { r: 0.36, y: 0.05, min: 64 }); }); },
    cookies: () => cookies.slice(), eaten: () => gone.length, boxCookies: () => gone.slice(),
    async takeCookie(id) { const c = cookies.find(x => x.userData.id === id) || cookies[cookies.length - 1]; if (!c) return false; unspot(c.userData.id); cookies.splice(cookies.indexOf(c), 1); NK.sound.pop();
      c.getWorldPosition(wp); const from = wp.clone(); plate.remove(c); scene.add(c); const to = box.position.clone().add(new THREE.Vector3(((gone.length % 2) - 0.5) * 0.7, 0.14 + Math.floor(gone.length / 2) * 0.13, 0)); gone.push(c);
      await tween(450, e => { c.position.lerpVectors(from, to, e); c.position.y += Math.sin(Math.PI * e) * 0.8; }); c.position.copy(to); return true; },
    async putBack() { while (gone.length) { const c = gone.pop(); scene.remove(c); plate.add(c); cookies.push(c); } cookies.forEach((c, j) => c.position.copy(cookiePos(j, cookies.length))); },
    showPlate(on) { plate.visible = on; box.visible = on; gone.forEach(c => { c.visible = on; }); if (!on) api.cookieSpots(false); mode = on ? 'cookies' : 'boys'; fit(); },
    async bumpAll(list, say) { for (let i = 0; i < list.length; i++) { const o = list[i], y0 = o.position.y; await tween(240, (e, t) => { o.position.y = y0 + Math.sin(Math.PI * t) * 0.35; }); o.position.y = y0; if (say) await say(i); } },
    celebrate() { sparkle(0, -1); },
    fit, destroy() { alive = false; renderer.dispose(); }
  };
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}
