/* Kindergarten ABC 2.0: the game shell every ABC game uses (play.html?u=1&g=rhyme).
   - the 3D stage, the world, painted Mendy, the big buttons (hear it again, home, play, check, thumbs up / down);
   - pictures you can tap (they say their name) and drag (they fly back home if the move is not right);
   - "Watch me ... now you!", a gentle fix on a wrong move (a soft "hmm", one kind line, then a glowing hint after two tries),
     rounds with little progress dots, stars at the end (3 = nearly all first tries), saved in this browser;
   - hooks for the automatic test (window.__abc): what to do next and where it is on the screen, so the test plays with a real mouse.
   No reading needed: every instruction is spoken, and "hear it again" repeats it. */
import { THREE, FAST, stage, runner, echo, audio, ease, clamp, rnd, glow, C } from './kit3d.js';
import { painted } from './cast.js';
import { prop, animateProp, WORDS } from './props.js';

export { echo, audio, THREE, FAST, rnd, ease, clamp, WORDS };
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
const PRAISE = ['Yes!', 'Great listening!', 'You got it!', 'Wonderful!', 'Super!', 'Good ears!'];

export function makeGame(host, o) {
  const $ = id => document.getElementById(id), A = window.__abc = { name: 'loading', ready: false, said: audio.said, audio, rounds: 0, firstTry: 0, misses: 0, stars: 0, fixes: 0, helps: 0 };
  const S = stage(host), R = runner($('again')), G = { S, R, A, items: [], taps: [], lines: [], unit: o.unit, id: o.id };
  G.narrow = () => innerWidth / innerHeight < 0.8;
  /* the camera keeps the play area in view on any screen; a gentle living sway */
  let viewSpec = { wide: [0, 2.2, 11, 6.4], narrow: [0, 2.6, 5.6, 9.6] };
  const applyView = () => { const v = viewSpec[G.narrow() ? 'narrow' : 'wide']; S.focus.target.set(v[0], v[1], 0); S.focus.w = v[2]; S.focus.h = v[3]; S.focus.dir.set(0, v[4] ?? 0.2, 1).normalize(); S.fit(); };
  G.view = v => { viewSpec = v; applyView(); };
  let camK = FAST ? 1 : 0; const camFrom = V(0, 9, 26);
  S.tick(t => { const p = S.camHome.clone(); p.x += Math.sin(t * 0.21) * 0.18 + S.pointer.x * 0.25; p.y += Math.sin(t * 0.27) * 0.1 + S.pointer.y * 0.12;
    S.camera.position.copy(camFrom).lerp(p, ease.inOut(camK)); S.camera.lookAt(S.focus.target); });
  S.lookTarget = V(0, 2, 8);

  /* ---------- Mendy ---------- */
  G.mendy = painted(S, 'mendy', { height: 2.6 });
  G.mendyAt = { wide: [-4.6, 1.4, 0.92], narrow: [-1.4, 3.7, 0.55] };
  const placeMendy = () => { const m = G.mendyAt[G.narrow() ? 'narrow' : 'wide']; G.mendy.place(m[0], m[1], m[2]); };
  S.onTap(G.mendy.hit, () => { G.mendy.set('happy', 0.8); G.mendy.hopNow(); audio.boing(300); });

  /* ---------- pictures ---------- */
  const tmp = new THREE.Vector3();
  G.item = (name, at, opts = {}) => {
    const obj = prop(name), it = { name, obj, at: typeof at === 'function' ? at : () => at.clone(), home: null, drag: !!opts.drag, size: opts.size || 1.15, live: true, data: opts.data || {}, k: 0, bob: rnd(0, 6), hover: opts.hover ?? 0.12, spin: 0 };
    obj.scale.setScalar(0.001); S.scene.add(obj); it.home = it.at(); obj.position.copy(it.home);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); obj.add(hit); it.hit = hit;
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.78, 0.95, 48), new THREE.MeshBasicMaterial({ color: C(0xFFF3A0).multiplyScalar(1.6), transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); halo.position.z = -0.3; obj.add(halo); it.halo = halo;
    it.shadow = null;
    it.say = () => { const w = WORDS[name]; return audio.say(w ? w.say : name); };
    it.onTap = opts.tap || (() => { it.say(); it.poke(); });
    it.poke = () => { it.spin = 1; };
    it.glow = on => { it.glowing = on; };
    it.moveTo = (v, ms = 450) => { const a = obj.position.clone(); it.moving = true; return S.tween(ms, e => obj.position.lerpVectors(a, v, e), ease.inOut).then(() => { it.moving = false; }); };
    it.goHome = (ms = 380) => it.moveTo(it.home, ms);
    it.remove = (ms = 300) => { it.live = false; return S.tween(ms, e => obj.scale.setScalar(Math.max(0.001, it.size * (1 - e)))).then(() => { S.scene.remove(obj); G.items = G.items.filter(x => x !== it); }); };
    it.screen = () => S.toScreen(obj.getWorldPosition(tmp));
    G.items.push(it);
    S.tween(500, e => { it.k = e; }, ease.back);
    return it;
  };
  S.tick((t, dt) => G.items.forEach(it => { if (!it.live && it.k === 0) return; it.spin = Math.max(0, it.spin - dt * 1.6);
    const s = it.size * it.k * (1 + Math.sin(t * 2 + it.bob) * 0.02) * (it === drag.it ? 1.12 : 1) * (G.narrow() ? 0.86 : 1);   /* a little smaller on a phone */
    if (it.live) it.obj.scale.setScalar(Math.max(0.001, s));
    it.obj.userData.inner.position.y = Math.sin(t * 1.6 + it.bob) * it.hover * 0.5;
    it.obj.rotation.y = Math.sin(t * 0.7 + it.bob) * 0.18 + it.spin * Math.PI * 2;
    it.halo.material.opacity = it.glowing ? 0.55 + Math.sin(t * 5) * 0.3 : Math.max(0, it.halo.material.opacity - dt * 2);
    it.halo.scale.setScalar(it.glowing ? 1 + Math.sin(t * 5) * 0.06 : 1); it.halo.lookAt(S.camera.position);
    animateProp(it.obj, t); }));

  /* ---------- touch: tap things, drag pictures ---------- */
  const drag = { it: null, z: 0, off: new THREE.Vector3(), moved: 0, start: null };
  G.tap = (obj, fn) => { G.taps.push({ obj, fn }); };
  G.onDrop = fn => { G.dropFn = fn; };
  G.dragItem = () => drag.it;
  G.locked = false;
  /* which of these is nearest the dropped picture, as the boy sees it on the screen (within about a finger's width) */
  G.near = (it, list, px = 120) => { const a = it.screen(), k = Math.min(innerWidth, innerHeight) / 768; let best = null, bd = 1e9;
    list.forEach(x => { const p = x.screen ? x.screen() : S.toScreen(x.isVector3 ? x : x.getWorldPosition(new THREE.Vector3())), d = Math.hypot(p.x - a.x, p.y - a.y); if (d < bd) { bd = d; best = x; } });
    return bd < px * Math.max(0.6, k) ? best : null; };
  const ray = new THREE.Raycaster();
  function pickItem(e) { ray.setFromCamera(S.ndc(e), S.camera); const list = G.items.filter(i => i.live && !i.moving);
    const hits = ray.intersectObjects(list.map(i => i.hit), false); if (!hits.length) return null; return list.find(i => i.hit === hits[0].object); }
  function pickTap(e) { ray.setFromCamera(S.ndc(e), S.camera); const list = G.taps.filter(x => x.obj.visible !== false && x.obj.parent);
    const hits = ray.intersectObjects(list.map(x => x.obj), true); if (!hits.length) return null; let ob = hits[0].object; while (ob) { const f = list.find(x => x.obj === ob); if (f) return f; ob = ob.parent; } return null; }
  const el = S.renderer.domElement;
  el.addEventListener('pointerdown', e => { audio.ctx(); if (G.locked) return;
    const it = pickItem(e);
    if (it) { drag.it = it; drag.moved = 0; drag.start = { x: e.clientX, y: e.clientY }; drag.z = it.obj.position.z; const p = S.onPlane(e, drag.z); drag.off.copy(it.obj.position).sub(p || it.obj.position); drag.off.z = 0;
      try { el.setPointerCapture(e.pointerId); } catch (x) {} return; }
    const tp = pickTap(e); if (tp) { tp.fn(e); return; }
    const h = S.pick(e); if (h) h.h.fn(h.point); });
  el.addEventListener('pointermove', e => { if (!drag.it) return; drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.start.x, e.clientY - drag.start.y));
    if (!drag.it.drag || drag.moved < 8) return; const p = S.onPlane(e, drag.z); if (p) { drag.it.obj.position.copy(p.add(drag.off)); drag.it.obj.position.z = drag.z + 0.6; } S.lookTarget.copy(drag.it.obj.position).setZ(4); });
  const up = async e => { const it = drag.it; if (!it) return; drag.it = null;
    if (!it.drag || drag.moved < 8) { it.obj.position.z = it.home.z; it.onTap(); if (G.onItemTap) G.onItemTap(it); return; }
    const at = it.obj.position.clone(); at.z = drag.z; it.obj.position.z = drag.z;
    const keep = G.dropFn ? await G.dropFn(it, at) : false; if (!keep && it.live) it.goHome(); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);

  /* ---------- buttons ---------- */
  const btn = { ok: $('ok'), yes: $('yes'), no: $('no') };
  G.button = (which, on) => { btn[which].classList.toggle('on', !!on); };
  G.pressed = (...which) => new Promise(res => { const fns = which.map(w => { const f = () => { audio.ctx(); fns.forEach((g, i) => btn[which[i]].removeEventListener('click', g)); res(w); }; btn[w].addEventListener('click', f); return f; }); });

  /* ---------- talking, rounds, fixes, stars ---------- */
  G.say = (...lines) => { lines.flat().forEach(l => { if (typeof l === 'string') G.lines.push(l); }); return R.run(lines.flat()); };
  G.wait = ms => S.wait(ms);
  const pips = $('pips');
  G.rounds = n => { pips.innerHTML = ''; for (let i = 0; i < n; i++) { const d = document.createElement('i'); pips.appendChild(d); } A.total = n; G.ri = 0; };
  let miss = 0;
  G.newRound = () => { miss = 0; A.round = (A.round || 0) + 1; G.hintFn = null; };
  G.right = async (at, line) => { audio.chime([784, 988, 1319]); if (at) G.P.burst(at, 0.5); G.mendy.set('happy', 1.1); G.mendy.hopNow();
    A.rounds++; if (miss === 0) A.firstTry++; const d = pips.children[G.ri++]; if (d) d.className = miss === 0 ? 'star' : 'done';
    await G.say([line || PRAISE[Math.floor(Math.random() * PRAISE.length)]]); };
  G.wrong = async (lines, it) => { miss++; A.misses++; A.fixes++; audio.hmm(); if (it) it.poke(); G.mendy.wiggle();
    await G.say([].concat(lines));
    if (miss >= 2 && G.hintFn) { A.helps++; await G.hintFn(); } };
  G.hint = fn => { G.hintFn = fn; };
  G.missed = () => miss;
  G.done = async (line) => {
    const r = A.rounds ? A.firstTry / A.rounds : 1, stars = r >= 0.85 ? 3 : r >= 0.55 ? 2 : 1; A.stars = stars;
    try { const k = 'kabc-stars', all = JSON.parse(localStorage.getItem(k) || '{}'), id = 'u' + o.unit + '.' + o.id; all[id] = Math.max(all[id] || 0, stars); localStorage.setItem(k, JSON.stringify(all)); } catch (e) {}
    G.mendy.set('happy', 2.5); G.mendy.hopNow(); G.P.burst(V(0, 3, 1)); audio.party();
    const st = $('stars'); st.innerHTML = ''; for (let i = 0; i < 3; i++) { const s = document.createElement('i'); if (i < stars) s.className = 'on'; s.style.animationDelay = (i * 0.25) + 's'; st.appendChild(s); }
    st.classList.add('on'); A.name = 'end';
    await G.say([line || 'You did it!']);
    $('end').classList.add('on');
  };
  /* a glowing trail from a picture to where it goes (the "watch me" hint) */
  G.trail = async (from, to, n = 14) => { for (let i = 0; i <= n; i++) { G.P.twinkle(from.clone().lerp(to, i / n), 1); await S.wait(45); } };

  /* ---------- the test hooks ---------- */
  G.expect = spec => { A.next = spec; A.step = (A.step || 0) + 1; };
  A.nextScreen = () => { const s = A.next; if (!s) return null;
    const pt = v => v ? (v.screen ? v.screen() : v.isVector3 ? S.toScreen(v) : v.isObject3D ? S.toScreen(v.getWorldPosition(new THREE.Vector3())) : v.obj ? S.toScreen(v.obj.getWorldPosition(new THREE.Vector3())) : null) : null;
    if (s.kind === 'button') { const r = document.querySelector(s.sel).getBoundingClientRect(); return { kind: 'tap', x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    if (s.kind === 'tap') return Object.assign({ kind: 'tap' }, pt(typeof s.at === 'function' ? s.at() : s.at));
    if (s.kind === 'drag') { const a = pt(s.from), b = pt(typeof s.to === 'function' ? s.to() : s.to); return { kind: 'drag', x: a.x, y: a.y, x2: b.x, y2: b.y }; }
    if (s.kind === 'trace') return { kind: 'trace' };
    return null; };
  A.wrongScreen = () => { const s = A.wrongMove; if (!s) return null; const save = A.next; A.next = s; const r = A.nextScreen(); A.next = save; return r; };
  A.items = () => G.items.filter(i => i.live).map(i => Object.assign({ name: i.name }, i.screen()));
  A.mendyScreen = () => S.toScreen(G.mendy.top().add(V(0, -1, 0)));
  A.t = () => S.t; A.tier = () => S.tier;

  /* ---------- start ---------- */
  G.start = async (world, play) => {
    G.W = world(G); G.P = G.W.P; placeMendy(); applyView();
    addEventListener('resize', () => { applyView(); placeMendy(); G.items.forEach(it => { if (it.live && !it.placed && drag.it !== it) { it.home = it.at(); it.obj.position.copy(it.home); } }); if (G.W.layout) G.W.layout(); });
    S.start(); A.ready = true; A.name = 'start';
    const go = async () => { $('play').classList.add('gone'); $('again').classList.add('on'); audio.ctx();
      if (!FAST) await S.tween(1800, e => camK = e, t => t); camK = 1;
      await G.mendy.appear(); audio.boing(240);
      A.name = 'play'; await play(G); };
    $('play').onclick = go;
    $('replay').onclick = () => { location.reload(); };
    if (/[?&]autoplay=1/.test(location.search)) go();
  };
  return G;
}
