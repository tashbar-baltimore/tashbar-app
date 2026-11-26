/* HER WORLD (home): the controller. Knows which place is in front, runs the buttons, dots, swipes, keys, sparkles and chimes,
   and drives the 3D jewel box (world3d.js). If this computer cannot draw 3D, the same places show as still cards (html.nogl).
   window.KWORLD is for the tests. */
import { PLACES, readProgress } from './places.js';

const $ = id => document.getElementById(id), html = document.documentElement, body = document.body;
const q = location.search, calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
let store = null; try { store = localStorage; store.getItem('x'); } catch (e) { store = null; }
const pref = (k, d) => { try { const v = store && store.getItem(k); return v == null ? d : v === '1'; } catch (e) { return d; } };
const save = (k, v) => { try { store && store.setItem(k, v ? '1' : '0'); } catch (e) {} };
const progress = readProgress(q, store);
const N = PLACES.length;
const S = { focus: 0, entered: false, gl: false, lite: /[?&]lite=1\b/.test(q) || pref('keser.lite', false), calm, sound: pref('keser.sound', true), frames: 0, taps: 0 };
let world = null;

/* ---------- sparkles: a tiny burst of stars wherever she taps ---------- */
const fx = $('fx'), fc = fx.getContext('2d'); let parts = [], fxOn = false;
function fitFx() { const r = Math.min(devicePixelRatio || 1, 2); fx.width = innerWidth * r; fx.height = innerHeight * r; fc.setTransform(r, 0, 0, r, 0, 0); }
fitFx(); addEventListener('resize', fitFx);
function star(x, y, s, a) { fc.save(); fc.translate(x, y); fc.rotate(a); fc.beginPath();
  for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.28 : s; const t = i * Math.PI / 4; fc.lineTo(Math.cos(t) * r, Math.sin(t) * r); } fc.closePath(); fc.fill(); fc.restore(); }
function burst(x, y, color) {
  const n = calm ? 5 : (S.lite ? 9 : 16);
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = calm ? 0 : 90 + Math.random() * 170;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: 1, s: 3 + Math.random() * 6, rot: Math.random() * 3, c: i % 3 ? color : '#FFF1B8' }); }
  if (!fxOn) { fxOn = true; let last = performance.now();
    const step = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; fc.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => (p.life -= dt * (calm ? 2.2 : 1.6)) > 0);
      for (const p of parts) { p.vy += 260 * dt; p.vx *= 0.97; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += dt * 4;
        fc.globalAlpha = Math.min(1, p.life * 1.6); fc.fillStyle = p.c; fc.shadowColor = p.c; fc.shadowBlur = 10; star(p.x, p.y, p.s * (0.5 + p.life * 0.5), p.rot); }
      if (parts.length) requestAnimationFrame(step); else { fxOn = false; fc.clearRect(0, 0, innerWidth, innerHeight); } };
    requestAnimationFrame(step); }
}

/* ---------- a soft chime (drawn by code, no sound file) ---------- */
let ac = null;
let gestured = false; addEventListener('pointerdown', () => { gestured = true; }, true); addEventListener('keydown', () => { gestured = true; }, true);
function chime(semi, soft) {
  if (!S.sound || !gestured) return;   /* browsers allow sound only after her first tap */
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
    const t = ac.currentTime, f = 1046.5 * Math.pow(2, (semi || 0) / 12), out = ac.createGain();
    out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(soft ? 0.035 : 0.07, t + 0.008); out.gain.exponentialRampToValueAtTime(0.0001, t + 1.4); out.connect(ac.destination);
    [[1, 1], [2.003, 0.35], [3.01, 0.12]].forEach(([m, g]) => { const o = ac.createOscillator(), og = ac.createGain(); o.type = 'sine'; o.frequency.value = f * m; og.gain.value = g; o.connect(og).connect(out); o.start(t); o.stop(t + 1.5); });
  } catch (e) {}
}

/* ---------- the buttons, dots and name ---------- */
const dots = $('dots'), nameEl = document.querySelector('.name'), he = nameEl.querySelector('.he');
PLACES.forEach((p, i) => { const b = document.createElement('button'); b.style.setProperty('--c', p.color); b.setAttribute('role', 'tab'); b.setAttribute('aria-label', p.label || p.name);
  b.onclick = e => { tapAt(e, p.color); go(i); }; dots.appendChild(b); });
/* a Hebrew name (Kodesh) is written right to left */
function setName(el, p) { el.textContent = p.name; if (p.lang) { el.setAttribute('lang', p.lang); el.setAttribute('dir', 'rtl'); } else { el.removeAttribute('lang'); el.removeAttribute('dir'); } }
function show() {
  const p = PLACES[S.focus];
  setName($('placeName'), p); he.textContent = p.he || '';
  nameEl.classList.remove('swap'); void nameEl.offsetWidth; nameEl.classList.add('swap');
  [...dots.children].forEach((d, i) => d.setAttribute('aria-current', i === S.focus ? 'true' : 'false'));
  document.querySelectorAll('.flat .place').forEach((c, i) => c.setAttribute('aria-current', i === S.focus ? 'true' : 'false'));
  const tr = document.querySelector('.flat .track'), card = tr && tr.children[0];
  if (card) { const w = card.getBoundingClientRect().width / (S.focus === 0 ? 1 : 1) || 240, gap = 28, cw = card.offsetWidth || w; tr.style.transform = 'translateX(' + (-(S.focus * (cw + gap)) - cw / 2) + 'px)'; }
  $('enter').style.setProperty('--c', p.color);
}
function go(i, quiet) {
  if (S.entered) return;
  const n = ((i % N) + N) % N; if (n === S.focus && !quiet) { world && world.nudge && world.nudge(); return; }
  S.focus = n; show(); world && world.focus(n); if (!quiet) chime(PLACES[n].note, true);
}
function enter() {
  if (S.entered) return; S.entered = true; const p = PLACES[S.focus];
  chime(p.note); chime(p.note + 7, true); setName($('roomName'), p); $('roomHost').src = p.pic; $('roomHost').alt = p.host; body.classList.add('in');
  world && world.enter(S.focus); setTimeout(() => { if (S.entered) { body.classList.add('inside'); $('room').setAttribute('aria-hidden', 'false'); $('back').focus({ preventScroll: true }); } }, calm ? 50 : 750);
}
function back() {
  if (!S.entered) return; S.entered = false; body.classList.remove('inside', 'in'); $('room').setAttribute('aria-hidden', 'true');
  world && world.back(); chime(PLACES[S.focus].note - 5, true); $('enter').focus({ preventScroll: true });
}
function tapAt(e, color) { S.taps++; if (e && e.clientX != null && (e.clientX || e.clientY)) burst(e.clientX, e.clientY, color || PLACES[S.focus].color);
  else { const r = (e && e.currentTarget && e.currentTarget.getBoundingClientRect) ? e.currentTarget.getBoundingClientRect() : null; if (r) burst(r.left + r.width / 2, r.top + r.height / 2, color || PLACES[S.focus].color); } }
$('prev').onclick = e => { tapAt(e); go(S.focus - 1); };
$('next').onclick = e => { tapAt(e); go(S.focus + 1); };
$('enter').onclick = e => { tapAt(e); enter(); };
$('back').onclick = e => { tapAt(e); back(); };
$('sound').onclick = e => { S.sound = !S.sound; save('keser.sound', S.sound); $('sound').setAttribute('aria-pressed', String(S.sound)); tapAt(e); chime(4, true); };
$('lite').onclick = e => { setLite(!S.lite, true); tapAt(e); chime(9, true); };
function setLite(on, byHer) { S.lite = on; if (byHer) save('keser.lite', on); $('lite').setAttribute('aria-pressed', String(on)); html.classList.toggle('lite', on); world && world.setLite(on); }
$('sound').setAttribute('aria-pressed', String(S.sound));
addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') { go(S.focus - 1); e.preventDefault(); }
  else if (e.key === 'ArrowRight') { go(S.focus + 1); e.preventDefault(); }
  else if (e.key === 'Escape') back();
  else if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === body) { enter(); e.preventDefault(); }
});

/* ---------- swipe or tap in the world ---------- */
const stage = $('stage'); let down = null;
stage.addEventListener('pointerdown', e => { if (S.entered) return; down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; try { stage.setPointerCapture(e.pointerId); } catch (_) {} });
stage.addEventListener('pointermove', e => { if (!down || e.pointerId !== down.id) return; world && world.drag((e.clientX - down.x) / Math.max(320, innerWidth)); });
const up = e => { if (!down || e.pointerId !== down.id) return; const dx = e.clientX - down.x, dy = e.clientY - down.y, dt = performance.now() - down.t; down = null;
  if (Math.abs(dx) > 40 || (Math.abs(dx) > 18 && dt < 220)) { world && world.drag(0, true); go(S.focus + (dx < 0 ? 1 : -1)); burst(e.clientX, e.clientY, PLACES[S.focus].color); return; }
  world && world.drag(0, true);
  if (Math.abs(dy) > 40) return;
  const hit = world ? world.pick(e.clientX, e.clientY) : null;
  if (hit === 'crown') { tapAt(e, '#F5C451'); world.twirl(); chime(12); chime(16, true); }
  else if (typeof hit === 'number') { tapAt(e, PLACES[hit].color); if (hit === S.focus) enter(); else go(hit); }
  else tapAt(e); };
stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', () => { down = null; world && world.drag(0, true); });

/* ---------- still cards, for computers that cannot draw 3D ---------- */
const ICONS = {
  kodesh: '<rect x="24" y="8" width="4" height="8" rx="1" fill="#C98A1E"/><rect x="52" y="8" width="4" height="8" rx="1" fill="#C98A1E"/><circle cx="26" cy="6" r="4" fill="#E8E4F0"/><circle cx="54" cy="6" r="4" fill="#E8E4F0"/>'
    + '<rect x="18" y="15" width="44" height="44" rx="9" fill="#1B2A5E" stroke="#FFF1B8" stroke-width="2"/><path d="M18 50h44" stroke="#F5C451" stroke-width="2.5"/><path d="M30 40l2-12 6 7 2-9 2 9 6-7 2 12z" fill="#F5C451" stroke="#FFF6D6" stroke-width="1"/>'
    + '<rect x="24" y="59" width="4" height="7" rx="1" fill="#C98A1E"/><rect x="52" y="59" width="4" height="7" rx="1" fill="#C98A1E"/>',
  timeline: '<path d="M8 50c14-8 22 4 32-4s20-10 32-6" fill="none" stroke="#F5C451" stroke-width="2.5" stroke-linecap="round"/>'
    + '<path d="M14 44l4 4-4 4-4-4z" fill="#FF5FA2"/><path d="M28 45l4 4-4 4-4-4z" fill="#F5C451"/><path d="M40 42l4 4-4 4-4-4z" fill="#5FE3CF"/><path d="M54 37l4 4-4 4-4-4z" fill="#8FB8FF"/><path d="M68 36l4 4-4 4-4-4z" fill="#B98CFF"/>'
    + '<rect x="8" y="16" width="14" height="10" rx="2" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="1.2"/><rect x="33" y="12" width="14" height="10" rx="2" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="1.2"/><rect x="58" y="10" width="14" height="10" rx="2" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="1.2"/>',
  general: '<path d="M40 34C30 27 18 28 10 31v30c8-3 20-4 30 3z" fill="#fff"/><path d="M40 34c10-7 22-6 30-3v30c-8-3-20-4-30 3z" fill="#FFE3F0"/><path d="M40 34v30" stroke="#FF5FA2" stroke-width="2"/>'
    + '<rect x="18" y="8" width="13" height="13" rx="2" fill="#D9C2FF" stroke="#fff" stroke-width="1.3"/><path d="M47 22l7-15 7 15z" fill="#FF8FBF" stroke="#fff" stroke-width="1.3"/><circle cx="39" cy="14" r="6" fill="#BFF5EE" stroke="#fff" stroke-width="1.3"/>',
};
function buildFlat() {
  const tr = document.querySelector('.flat .track'); tr.innerHTML = '';
  PLACES.forEach((p, i) => { const c = document.createElement('div'); c.className = 'place'; c.style.setProperty('--c', p.color);
    c.innerHTML = '<div class="pic" style="background-image:url(' + p.pic + ')"></div><svg viewBox="0 0 80 70">' + ICONS[p.id] + '</svg>';
    c.onclick = e => { tapAt(e, p.color); if (i === S.focus) enter(); else go(i); }; tr.appendChild(c); });
  const g = document.getElementById('flatgems'); g.innerHTML = '';
  PLACES.forEach((p, i) => { const v = progress[p.id], x = 35 + i * 20;
    g.insertAdjacentHTML('beforeend', v > 0 ? '<path d="M' + x + ' ' + (97 - 3 - v * 4) + 'l' + (3 + v * 4) + ' ' + (3 + v * 4) + '-' + (3 + v * 4) + ' ' + (3 + v * 4) + '-' + (3 + v * 4) + '-' + (3 + v * 4) + 'z" fill="' + p.color + '" stroke="#fff" stroke-width="1"/>' : '<circle cx="' + x + '" cy="97" r="3" fill="none" stroke="#FFF6D6" stroke-width="1.2"/>'); });
  document.querySelector('.flat .crown').onclick = e => { tapAt(e, '#F5C451'); chime(12); };
}
function flat() { html.classList.add('nogl'); S.gl = false; buildFlat(); show(); }
addEventListener('resize', show);

/* ---------- the sisters greet her (once per visit; any tap or key lets her straight in) ---------- */
function greet() {
  let seen = false; try { seen = sessionStorage.getItem('keser.greeted') === '1'; sessionStorage.setItem('keser.greeted', '1'); } catch (e) {}
  if (seen || /[?&]nogreet=1\b/.test(q)) return;
  const g = $('greet'), off = () => { g.classList.remove('on'); body.classList.remove('greeting'); removeEventListener('pointerdown', off, true); removeEventListener('keydown', off, true); };
  g.classList.add('on'); body.classList.add('greeting');
  /* she sees the sisters while her world gets ready, then 2.5 seconds more once it is ready (at most 15 seconds in all) */
  const t0 = performance.now(); let seenAt = 0;
  const wait = () => { if (!g.classList.contains('on')) return; const now = performance.now();
    if (!seenAt && (body.classList.contains('ready') || html.classList.contains('nogl'))) seenAt = now;
    if ((seenAt && now - seenAt > 2500) || now - t0 > 15000) off(); else setTimeout(wait, 250); };
  setTimeout(wait, calm ? 1500 : 2500);
  addEventListener('pointerdown', off, true); addEventListener('keydown', off, true);
}

/* ---------- start ---------- */
window.KWORLD = { places: PLACES.map(p => p.id), progress, state: S, go, enter, back, next: () => go(S.focus + 1), prev: () => go(S.focus - 1), setLite };
show();
if (S.lite) { html.classList.add('lite'); $('lite').setAttribute('aria-pressed', 'true'); }
setTimeout(() => body.classList.remove('intro'), calm ? 0 : 900);
greet();
if (/[?&]nogl=1\b/.test(q)) flat();
else {
  import('./world3d.js').then(m => {
    world = m.start({ canvas: $('scene'), places: PLACES, progress, focus: S.focus, calm, lite: S.lite, full: /[?&]full=1\b/.test(q),
      onFrame: () => { if (++S.frames === 2) body.classList.add('ready'); }, onAutoLite: () => setLite(true, false) });
    S.gl = true;
    /* if the 3D world has not drawn after 12 seconds, this computer is too slow for it: show the still cards instead */
    if (!/[?&]full=1\b/.test(q)) setTimeout(() => { if (S.frames < 1 && !S.entered) { world && world.stop && world.stop(); world = null; flat(); } }, 12000);
  }).catch(e => { console.warn('Keser world: no 3D, still cards shown (' + (e && e.message) + ')'); flat(); });
}
