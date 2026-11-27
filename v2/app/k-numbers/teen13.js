/* Kindergarten Numbers, Unit 13 "Teen numbers: ten and some more": two muffin tins side by side at the calm 3D bakery counter.
   The left tin is THE TEN: he taps it and all ten pink cupcakes drop in at once ("a full tin is ten!"). The right tin holds the ONES: blue cupcakes, one per tap.
   Fourteen is a full tin and four more. On a phone the two tins stand one above the other. Every cup he can tap has a see-through tap spot.
   ES module: import { mount } from './teen13.js'. */
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
    back.position.set(0, H * 0.4 - 2.6, 16); scene.add(back); });   /* the painted bakery stands close behind the counter */
  const TW = 9.5, TD = 5.2;
  const woodMat = new THREE.MeshStandardMaterial({ color: '#C79A68', roughness: 0.6 }); tex(['counter-wood.jpg', 'table-wood.jpg'], t => { woodMat.map = rep(t, 2, 1); woodMat.color.set('#FFFFFF'); woodMat.needsUpdate = true; });
  const top = new THREE.Mesh(new THREE.BoxGeometry(TW, 0.25, TD), woodMat); top.position.y = -0.13; top.receiveShadow = true; top.castShadow = true; scene.add(top);
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

  /* ---------------- two tins: the ten (left) and the ones (right) ---------------- */
  const tinM = new THREE.MeshStandardMaterial({ color: '#B8C0CC', roughness: 0.35, metalness: 0.6 }), holeM = new THREE.MeshStandardMaterial({ color: '#7D8796', roughness: 0.5, metalness: 0.5 });
  const GAP = 0.82, ROW = 0.86, cupPos = i => new THREE.Vector3(((i % 5) - 2) * GAP, 0.12, (i < 5 ? -1 : 1) * ROW / 2);
  function makeTin() { const g = new THREE.Group(); scene.add(g); const base = new THREE.Mesh(new THREE.BoxGeometry(5 * GAP + 0.4, 0.16, 2 * ROW + 0.36), tinM); base.position.y = 0.08; base.castShadow = base.receiveShadow = true; g.add(base);
    const cups = []; for (let i = 0; i < 10; i++) { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.02, 28), holeM); h.position.copy(cupPos(i)).setY(0.17); g.add(h); const anchor = new THREE.Object3D(); anchor.position.copy(cupPos(i)); g.add(anchor); cups.push({ anchor, hole: h, cake: null }); }
    return { g, cups }; }
  const TEN = makeTin(), ONES = makeTin();
  function put(tin, i, blue) { const c = tin.cups[i]; if (c.cake) return; c.cake = cupcake(blue); c.anchor.add(c.cake); }
  function clearTin(tin) { tin.cups.forEach(c => { if (c.cake) { c.anchor.remove(c.cake); c.cake = null; } }); }
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
  let Wd = 1, Hh = 1, narrow = false; const DIR = new THREE.Vector3(0, 0.55, 0.84).normalize(), V = 34; let dist = 14; const center = new THREE.Vector3(0, 0.3, 0.2);
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  function layout() {
    TEN.g.position.set(narrow ? 0 : -2.35, 0, narrow ? -1.15 : 0.3); ONES.g.position.set(narrow ? 0 : 2.35, 0, narrow ? 1.35 : 0.3); TEN.g.scale.setScalar(narrow ? 0.85 : 0.88); ONES.g.scale.setScalar(narrow ? 0.85 : 0.88);
    kids.forEach((k, i) => k.m.position.set(narrow ? (i ? 1.9 : -1.9) : (i ? 4.0 : -4.0), 0.35, -3.1));
  }
  function fit() {
    Wd = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(Wd, Hh, false); narrow = Wd < Hh * 0.95 || Wd < 700; layout();
    DIR.set(0, narrow ? 0.72 : 0.55, narrow ? 0.7 : 0.84).normalize(); center.z = narrow ? 0.1 : 0.2;
    const span = narrow ? 4.6 : 9.6, needH = narrow ? 5.4 : 4.2;
    const [b0, b1] = band(), bc = (b0 + b1) / 2, bh = Math.max(120, b1 - b0), fullH = Hh + 2 * Math.abs(Hh / 2 - bc), tn = Math.tan(THREE.MathUtils.degToRad(V / 2));
    dist = Math.max(span * fullH / (2 * Wd * tn), needH * fullH / (2 * tn * bh));
    camera.aspect = Wd / fullH; camera.fov = V; camera.setViewOffset(Wd, fullH, 0, fullH / 2 - bc, Wd, Hh); camera.updateProjectionMatrix();
  }
  let alive = true;
  function frame() { if (!alive) return; requestAnimationFrame(frame); camera.position.copy(center).addScaledVector(DIR, dist); camera.lookAt(center); camera.updateMatrixWorld(); renderer.render(scene, camera); place(); }

  const api = {
    spot, unspot, tween, narrow: () => narrow,
    /* show a number as tens and ones (no animation); ten: how many in the left tin (0 or 10) */
    show(ten, ones) { clearTin(TEN); clearTin(ONES); for (let i = 0; i < ten; i++) put(TEN, i, false); for (let i = 0; i < ones; i++) put(ONES, i, true); api.spots(false); },
    tenFull: () => TEN.cups.every(c => c.cake), ones: () => ONES.cups.filter(c => c.cake).length,
    /* tap spots: the ten tin (one tap fills it), and each cup of the ones tin (empty: add; full: take back) */
    spots(on) { unspot('ten'); for (let i = 0; i < 10; i++) unspot('one' + i); if (!on) return;
      if (!api.tenFull()) { spot('ten', TEN.g, { cls: 'side hint', r: narrow ? 0.85 : 1.8, y: 0.2, min: 100 }); return; }   /* first only the ten can be tapped */
      ONES.cups.forEach((c, i) => spot('one' + i, c.anchor, { cls: 'cupspot', r: 0.33, y: 0.3, min: 52 })); },
    async fillTen() { if (api.tenFull()) return; unspot('ten'); NK.sound.pop();
      for (let i = 0; i < 10; i++) { const c = TEN.cups[i]; if (c.cake) continue; c.cake = cupcake(false); c.anchor.add(c.cake); const k = c.cake; tween(300, e => { k.position.y = (1 - e) * 1.2; }); await new Promise(r => setTimeout(r, T(60))); }
      await new Promise(r => setTimeout(r, T(300))); },
    /* the next empty ones cup gets a blue cupcake (whatever cup he tapped, the ones fill in order: easy to count) */
    async addOne() { const i = ONES.cups.findIndex(c => !c.cake); if (i < 0) return false; const c = ONES.cups[i]; c.cake = cupcake(true); c.anchor.add(c.cake); const k = c.cake; NK.sound.pop();
      await tween(300, e => { k.position.y = (1 - e) * 1.2; }); return true; },
    async takeOne() { let i = -1; ONES.cups.forEach((c, j) => { if (c.cake) i = j; }); if (i < 0) return false; const c = ONES.cups[i], k = c.cake; c.cake = null; await tween(260, e => { k.position.y = e * 1.2; k.scale.setScalar(1 - e); }); c.anchor.remove(k); return true; },
    tenCakes: () => TEN.cups.filter(c => c.cake).map(c => c.cake), oneCakes: () => ONES.cups.filter(c => c.cake).map(c => c.cake),
    async bumpAll(list, say) { for (let i = 0; i < list.length; i++) { const o = list[i], y0 = o.position.y; await tween(240, (e, t) => { o.position.y = y0 + Math.sin(Math.PI * t) * 0.35; }); o.position.y = y0; if (say) await say(i); } },
    async glowTen() { const cs = api.tenCakes(); await tween(500, (e, t) => cs.forEach(o => { o.position.y = Math.sin(Math.PI * t) * 0.3; })); },
    fit, destroy() { alive = false; renderer.dispose(); }
  };
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}
