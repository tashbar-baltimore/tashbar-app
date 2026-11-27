/* Kindergarten Numbers, Unit 6 "The path game": a real 3D garden with a straight number path (stepping stones 0 to 10).
   The boy is inside the world: soft sun, plain calm grass and sky (K clarity 10: no trees, bushes or flowers to look at), Mendy and Avi (painted) hop from stone to stone.
   On a Chromebook the whole path shows; on a phone the camera follows along (five stones at a time, each at least 64 px).
   Every stone has a see-through tap spot (.stone, data-n) laid over it, so taps and drags work like any other game piece.
   Used as an ES module: import { mount, spinner } from './path6.js'. Needs kit.js, frame.js and unit5.js (U5.num) loaded first. */
import * as THREE from 'three';

const FAST = /[?&]fast=1/.test(location.search);
const STEP = 1.7, TOP = 0.3;            /* distance between stones; height of a stone's top */
const X = (n, from) => (n - from) * STEP;
const T = ms => FAST ? Math.min(ms, 60) : ms;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* numeral pictures (the same numerals as Units 4 and 5) drawn once into textures */
const numTex = {};
function numeralTexture(n) {
  if (numTex[n]) return numTex[n];
  const c = document.createElement('canvas'); c.width = c.height = 256; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const img = new Image(); img.onload = () => { const x = c.getContext('2d'), h = 170;
    /* a round white sign with a soft gold edge, so the number reads clearly from any angle */
    x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(128, 128, 118, 0, Math.PI * 2); x.fill(); x.lineWidth = 10; x.strokeStyle = '#F2C14E'; x.stroke();
    const hh = h, w = hh * img.width / img.height; x.drawImage(img, 128 - w / 2, 128 - hh / 2 + 2, w, hh); t.needsUpdate = true; };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(U5.num(n).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="' + (n === 10 ? 190 : n > 5 ? 150 : 100) + '" height="' + (n > 5 ? 220 : 140) + '" '));
  return (numTex[n] = t);
}
let emptyTex = null;
function emptyTexture() {   /* an empty spot: a soft dashed ring, waiting for its number */
  if (emptyTex) return emptyTex;
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = 'rgba(255,255,255,.75)'; x.beginPath(); x.arc(128, 128, 118, 0, Math.PI * 2); x.fill();
  x.setLineDash([26, 18]); x.lineWidth = 16; x.lineCap = 'round'; x.strokeStyle = 'rgba(122,92,60,.55)'; x.beginPath(); x.arc(128, 128, 84, 0, Math.PI * 2); x.stroke();
  emptyTex = new THREE.CanvasTexture(c); emptyTex.colorSpace = THREE.SRGBColorSpace; return emptyTex;
}

/* ---------------- the world ---------------- */
export function mount(host, opt) {
  opt = Object.assign({ from: 0, to: 10, band: null, kids: ['mendy'], hidden: [] }, opt || {});
  const N = opt.to - opt.from + 1, mid = (opt.to + opt.from) / 2;
  host.classList.add('p6world');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FAST ? 1 : 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = !FAST; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement); renderer.domElement.className = 'p6canvas';
  const scene = new THREE.Scene(), SKY = new THREE.Color('#BDE6FF'); scene.background = SKY; scene.fog = new THREE.Fog('#D7EEDB', 26, 60);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

  /* light: a warm sun from the upper left, a soft sky fill, a gentle rim */
  scene.add(new THREE.HemisphereLight('#E8F6FF', '#9CC27A', 1.25));
  const sun = new THREE.DirectionalLight('#FFF1D6', 2.1); sun.position.set(-8, 14, 9); sun.castShadow = !FAST;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 8, bottom: -8, near: 1, far: 40 }); sun.shadow.radius = 6; sun.shadow.bias = -0.0006; scene.add(sun);
  const rim = new THREE.DirectionalLight('#FFD9B0', 0.6); rim.position.set(6, 5, -10); scene.add(rim);

  const loader = new THREE.TextureLoader(), tex = (f, fn) => loader.load('art/' + f, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (fn) fn(t); });
  /* the ground: plain soft grass, one calm colour (K clarity 10: the painted grass had little daisies that looked like more flowers to count) */
  const gMat = new THREE.MeshStandardMaterial({ color: '#A6DC86', roughness: 1 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), gMat); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  /* no painted garden behind: a plain sky over plain grass, so the path is the one thing to look at (K clarity 9, 10) */

  /* the path: a soft sandy track joining the stones, a start mat and a finish flag */
  const tMat = new THREE.MeshStandardMaterial({ color: '#F6E6C8', roughness: 1 });
  tex('path-sand.jpg', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(N * 1.2, 1); tMat.map = t; tMat.needsUpdate = true; });
  const track = new THREE.Mesh(new THREE.BoxGeometry((N - 1) * STEP + 1.6, 0.06, 1.15), tMat);
  track.position.set((X(opt.to, opt.from) + X(opt.from, opt.from)) / 2, 0.03, 0); track.receiveShadow = true; scene.add(track);
  const stoneTex = tex('stone-top.jpg');
  const stones = [], tops = [], rings = [];
  for (let n = opt.from; n <= opt.to; n++) {
    const g = new THREE.Group(); g.position.set(X(n, opt.from), 0, 0); scene.add(g);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.76, TOP, 48), new THREE.MeshStandardMaterial({ color: '#FFF4E0', map: stoneTex, roughness: 0.85 }));
    s.position.y = TOP / 2; s.castShadow = s.receiveShadow = true; s.rotation.y = n * 1.3; g.add(s);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.05, 10, 48), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.6 })); lip.rotation.x = Math.PI / 2; lip.position.y = TOP; g.add(lip);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.45), new THREE.MeshBasicMaterial({ map: numeralTexture(n), transparent: true, depthWrite: false, toneMapped: false }));
    /* the number stands up on its stone like a little round sign and always faces the boy, so it reads clearly at any camera angle (Esti, 2026-11-27) */
    top.position.y = TOP + 0.8; top.renderOrder = 2; top.onBeforeRender = () => top.quaternion.copy(camera.quaternion); g.add(top);
    /* the shine round a stone: a thick gold ring at the top of the stone, plain to see (K clarity 9) */
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.13, 12, 56), new THREE.MeshBasicMaterial({ color: '#FFC21A', transparent: true, opacity: 0.95, toneMapped: false }));
    ring.rotation.x = Math.PI / 2; ring.position.y = TOP + 0.02; ring.visible = false; g.add(ring);
    stones.push(g); tops.push(top); rings.push(ring);
  }
  /* start: a small green mat; finish: a flag at the far end (no writing) */
  const flag = new THREE.Group(); flag.position.set(X(opt.to, opt.from) + 1.25, 0, -0.55); scene.add(flag);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 12), new THREE.MeshStandardMaterial({ color: '#FFFFFF' })); pole.position.y = 1.1; pole.castShadow = true; flag.add(pole);
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6, 8, 1), new THREE.MeshStandardMaterial({ color: '#FF5A4E', side: THREE.DoubleSide, roughness: 0.7 })); cloth.position.set(0.47, 1.85, 0); flag.add(cloth);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshStandardMaterial({ color: '#FFD23D', metalness: 0.3, roughness: 0.3 })); knob.position.y = 2.24; flag.add(knob);
  /* the painted finish flag (order N6) replaces the drawn one when it loads; it always faces the camera */
  tex('finish-flag.png', t => { flag.clear(); const fm = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.4), new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.05, toneMapped: false }));
    fm.position.y = 1.15; fm.onBeforeRender = () => fm.quaternion.copy(camera.quaternion); flag.add(fm); });
  const mat = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 40), new THREE.MeshStandardMaterial({ color: '#7FD67A' })); mat.position.set(X(opt.from, opt.from) - 1.3, 0.03, 0.2); scene.add(mat);

  /* no garden props around the path (K clarity 10): no flowers, bushes or trees */

  /* ---------------- the boys (painted) ---------------- */
  const kids = {};
  function kid(who, z) {
    const k = new THREE.Group(); scene.add(k); const card = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, visible: false, toneMapped: false }));
    k.add(card); const sh = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24), new THREE.MeshBasicMaterial({ color: '#4A6A30', transparent: true, opacity: 0.25, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; sh.scale.set(1, 0.55, 1); sh.renderOrder = 1; scene.add(sh);
    const H = 2.5, cache = {}; let cur = '';   /* the boys are big enough to find at once (K clarity 9) */
    const api = { n: opt.from, z: z, obj: k, shadow: sh, y: TOP,
      pose(p) { cur = p; (cache[p] = cache[p] || new Promise(res => loader.load('art/' + who + '-' + p + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; res(t); }, undefined, () => res(null)))).then(t => {
        if (cur !== p) return; if (!t) { if (p !== 'idle') api.pose('idle'); return; } card.material.map = t; card.material.visible = true; card.material.needsUpdate = true; card.scale.set(H * t.image.width / t.image.height, H, 1); card.position.y = H / 2; }); },
      place(n) { api.n = n; k.position.set(X(n, opt.from), TOP, z); sh.position.set(k.position.x, 0.33, z); },
      show(on) { k.visible = sh.visible = on; },
      /* hop one stone at a time; onStep(n) runs as he lands (say the number there) */
      async hop(to, onStep) { const dir = to > api.n ? 1 : -1;
        while (api.n !== to) { const a = api.n, b = a + dir, x0 = X(a, opt.from), x1 = X(b, opt.from), dur = T(380), t0 = performance.now();
          await new Promise(res => { (function f() { const t = Math.min(1, (performance.now() - t0) / dur), e = ease(t);
            k.position.x = x0 + (x1 - x0) * e; k.position.y = TOP + Math.sin(Math.PI * t) * 0.75; k.scale.set(1 + (t > .9 ? .08 : 0), 1 - (t > .9 ? .08 : 0), 1); sh.position.x = k.position.x; sh.scale.setScalar(1 - Math.sin(Math.PI * t) * .35);
            if (t < 1) requestAnimationFrame(f); else { k.scale.set(1, 1, 1); res(); } })(); });
          api.n = b; NK.sound.pop(); follow(b); if (onStep) await onStep(b); } },
      async jump() { const t0 = performance.now(), dur = T(420); await new Promise(res => { (function f() { const t = Math.min(1, (performance.now() - t0) / dur); k.position.y = TOP + Math.sin(Math.PI * t) * 0.6; if (t < 1) requestAnimationFrame(f); else res(); })(); }); }
    };
    card.onBeforeRender = () => { card.quaternion.copy(camera.quaternion); };
    api.pose('idle'); api.place(opt.from); return api;
  }
  opt.kids.forEach((w, i) => { kids[w] = kid(w, i === 0 ? -1.35 : -2.1); });   /* he stands just behind his stone, so its number sign never hides him */

  /* when he is right, the stone shines for a moment (K clarity 10: no flying petals) */
  function petals(n) { const r = rings[Math.round(n) - opt.from]; if (!r) return; r.visible = true; setTimeout(() => { r.visible = false; }, T(900)); }

  /* ---------------- tap spots over the stones ---------------- */
  const layer = document.createElement('div'); layer.className = 'p6layer'; host.appendChild(layer);
  const spots = []; for (let n = opt.from; n <= opt.to; n++) { const d = document.createElement('div'); d.className = 'stone'; d.dataset.n = n; d.setAttribute('role', 'button'); d.setAttribute('aria-label', 'Stone ' + n); layer.appendChild(d); spots.push(d); }
  layer.addEventListener('pointerdown', e => { const s = e.target.closest('.stone'); if (!s || !api.onStone) return; NK.unlock(); api.onStone(+s.dataset.n, s, e); });

  /* ---------------- camera: fit the path into the free band; follow on a phone ---------------- */
  let W = 1, Hh = 1, camX = X(mid, opt.from), wantX = camX, span = N * STEP;
  const DIR = new THREE.Vector3(0, 0.4, 0.92).normalize(), V = 32;
  function band() { const b = typeof opt.band === 'function' ? opt.band() : opt.band; return b || [0, Hh]; }
  function narrow() { return W < Hh * 0.95 || W < 700; }
  function fit() {
    W = host.clientWidth || innerWidth; Hh = host.clientHeight || innerHeight; renderer.setSize(W, Hh, false);
    span = narrow() ? 4 * STEP + 0.5 : N * STEP + 1.2;
    const [b0, b1] = band(), bc = (b0 + b1) / 2, bh = Math.max(120, b1 - b0), fullH = Hh + 2 * Math.abs(Hh / 2 - bc);
    let dist = span * fullH / (2 * W * Math.tan(THREE.MathUtils.degToRad(V / 2)));
    /* the stones and the boys (2 units tall) must fit the band's height too */
    const needH = 4.1, perPx = 2 * Math.tan(THREE.MathUtils.degToRad(V / 2)) / fullH; dist = Math.max(dist, needH / (perPx * bh));
    camera.aspect = W / fullH; camera.fov = V; camera.setViewOffset(W, fullH, 0, fullH / 2 - bc, W, Hh); camera.updateProjectionMatrix(); camera.userData.dist = dist; scene.fog.near = dist + 8; scene.fog.far = dist + 60;
    follow(api ? api.focusN : mid, true);
  }
  function follow(n, now) {
    if (n == null) return; api.focusN = n; const half = span / 2 - STEP / 2 - 0.2, lo = X(opt.from, opt.from) + half - 0.6, hi = X(opt.to, opt.from) - half + 0.6;
    wantX = lo > hi ? X(mid, opt.from) : Math.max(lo, Math.min(hi, X(n, opt.from))); if (now) camX = wantX;
  }
  const v = new THREE.Vector3();
  function place() {
    const r = host.getBoundingClientRect();
    for (let i = 0; i < N; i++) {
      v.set(X(opt.from + i, opt.from), TOP + 0.42, 0).project(camera); const cx = (v.x + 1) / 2 * W, cy = (1 - v.y) / 2 * Hh;   /* the tap spot covers the stone and its number sign */
      v.set(X(opt.from + i, opt.from) + 0.7, TOP + 0.42, 0).project(camera); const rx = (v.x + 1) / 2 * W, size = Math.max(66, (rx - cx) * 2.1);
      const d = spots[i], out = cx - size / 2 < 2 || cx + size / 2 > W - 2 || cy - size / 2 < 2 || cy + size / 2 > Hh - 2 || r.top + cy + size / 2 > innerHeight - 2;
      d.style.display = out ? 'none' : ''; d.style.width = d.style.height = size + 'px'; d.style.left = (cx - size / 2) + 'px'; d.style.top = (cy - size / 2) + 'px';
    }
  }
  function cam() { camera.position.set(camX, TOP, 0).addScaledVector(DIR, camera.userData.dist || 20); camera.lookAt(camX, TOP + 0.55, 0); camera.updateMatrixWorld(); }
  let api = null, last = performance.now(), alive = true;
  function frame() {
    if (!alive) return; requestAnimationFrame(frame); const now = performance.now(), dt = Math.min(50, now - last); last = now;
    camX += (wantX - camX) * Math.min(1, dt / (FAST ? 16 : 140));
    if (now - (frame.t || 0) > 250) { frame.t = now; const b = band(); if (!frame.b || Math.abs(b[0] - frame.b[0]) > 4 || Math.abs(b[1] - frame.b[1]) > 4) { frame.b = b; if (frame.t0) fit(); frame.t0 = 1; } }   /* the panel grew or shrank: fit again */
    cam();
    const tt = now / 1000; cloth.rotation.y = Math.sin(tt * 2) * 0.15;
    rings.forEach(r => { if (r.visible) r.material.opacity = 0.75 + Math.sin(tt * 4) * 0.2; });
    Object.values(kids).forEach(k => { if (k.obj.position.y === TOP && k.obj.scale.y === 1) k.obj.children[0].position.y = 1.0 + Math.sin(tt * 2 + k.z * 3) * 0.015; });
    renderer.render(scene, camera); place();
  }

  api = {
    kids, from: opt.from, to: opt.to, el: n => spots[n - opt.from], spots,
    /* show or hide a stone's number (hidden = an empty spot waiting for its number) */
    shown(n, on) { tops[n - opt.from].material.map = on ? numeralTexture(n) : emptyTexture(); tops[n - opt.from].material.needsUpdate = true; spots[n - opt.from].classList.toggle('empty', !on); },
    showAll(on) { for (let n = opt.from; n <= opt.to; n++) api.shown(n, on); },
    /* a stone shows a different number than it should (Find the mistake) */
    label(n, k) { tops[n - opt.from].material.map = numeralTexture(k); tops[n - opt.from].material.needsUpdate = true; },
    glow(n, on) { if (n == null) { rings.forEach(r => { r.visible = false; }); return; } rings[n - opt.from].visible = on; },
    focus(n, now) { follow(n, now); if (now) { cam(); place(); } },
    /* pan by some stones (the arrows on a phone) */
    pan(d) { follow(Math.max(opt.from, Math.min(opt.to, Math.round(wantX / STEP) + opt.from + d))); },
    petals, fit, narrow,
    lift(n) { const g = stones[n - opt.from], t0 = performance.now(); (function f() { const t = Math.min(1, (performance.now() - t0) / T(500)); g.position.y = Math.sin(Math.PI * t) * 0.25; if (t < 1) requestAnimationFrame(f); })(); },
    destroy() { alive = false; renderer.dispose(); }
  };
  fit(); addEventListener('resize', fit); requestAnimationFrame(frame);
  return api;
}

/* ---------------- the spinner: a big round wheel with one dot and two dots; it lands where we choose ---------------- */
export function spinner(el) {
  el.classList.add('spin6');
  el.innerHTML = '<img src="art/spinner.png" alt="" class="wheelpic">' +   /* the painted wooden wheel (order N6): yellow right, blue left */
    '<svg viewBox="0 0 200 200" class="wheel"><circle cx="146" cy="62" r="17" fill="#3B2A7A"/>' +   /* the dots sit off the arrow's line, so the arrow never covers them (K clarity 8) */
    '<circle cx="56" cy="62" r="17" fill="#3B2A7A"/><circle cx="56" cy="138" r="17" fill="#3B2A7A"/></svg>' +
    '<img src="art/spinner-arrow.png" alt="" class="arrow">';   /* the painted wooden arrow (order N6-r1), its gold pin in the centre */
  let turn = 0; const arrow = el.querySelector('.arrow');
  return {
    el,
    /* spin and land on k (1 = the yellow side with one dot, 2 = the blue side with two dots) */
    async spin(k) { NK.sound.pop(); turn += 1080 + (k === 1 ? 90 : 270) - (turn % 360); arrow.style.transition = 'transform ' + (FAST ? .05 : 1.5) + 's cubic-bezier(.15,.8,.25,1)'; arrow.style.transform = 'rotate(' + turn + 'deg)';
      await sleep(FAST ? 80 : 1600); el.classList.add('landed'); await sleep(FAST ? 20 : 250); el.classList.remove('landed'); return k; },
    glow(on) { el.classList.toggle('glow', on); }
  };
}
export const word = n => FR.word(n);
export { sleep, FAST };
