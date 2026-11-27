/* HER SIGN-IN (signin.html): she taps her code on the gem keys; with each digit the crown dial turns a notch. The right code spins the dial,
   swings the vault door open onto golden light, flies her through the vault into her treasure house in the heavens, where a crystal globe for
   each subject turns on a glowing ring and glows with what she has learned (dim until she starts). A globe spins to the front and takes her to
   that place in her spinning 3D world; "My world" takes her in.
   Until the girls' records are built (keser/STAFF-PROMPT.md: a separate girls' database, M. Heinemann 2026-11-26), the only code is the
   practice code 1234 and nothing is sent anywhere. The tests read the KSIGN object at the end of this file. */
import { PLACES, readProgress } from './places.js';

const $ = id => document.getElementById(id), body = document.body, q = location.search;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
let store = null; try { store = localStorage; store.getItem('x'); } catch (e) { store = null; }
const PRACTICE = '1234', S = { code: '', tries: 0, open: false, stage: 'vault' };
/* one globe for each place in her world (M. Heinemann 2026-11-26: קודש, General Studies, Timeline); Timeline's clear globe holds its timeline picture */
const GLOBES = { kodesh: '/pics/keser-globe-kodesh.webp', general: '/pics/keser-globe-reading.webp', timeline: '/pics/keser-globe-empty.webp' };
const INSIDE = { timeline: '/pics/keser-place-timeline.webp' };

/* ---------- sparkles and soft chimes ---------- */
const fx = $('fx'), fc = fx.getContext('2d'); let parts = [], run = false;
const fitFx = () => { const r = Math.min(devicePixelRatio || 1, 2); fx.width = innerWidth * r; fx.height = innerHeight * r; fc.setTransform(r, 0, 0, r, 0, 0); }; fitFx(); addEventListener('resize', fitFx);
function burst(x, y, n, color) {
  for (let i = 0; i < (calm ? Math.min(n, 5) : n); i++) { const a = Math.random() * Math.PI * 2, v = calm ? 0 : 80 + Math.random() * 220;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: 1, s: 3 + Math.random() * 7, r: Math.random() * 3, c: i % 3 ? (color || '#FF8FBF') : '#FFF1B8' }); }
  if (run) return; run = true; let last = performance.now();
  const tick = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; fc.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => (p.life -= dt * 1.3) > 0);
    for (const p of parts) { p.vy += 240 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += dt * 4; fc.globalAlpha = Math.min(1, p.life * 1.5); fc.fillStyle = p.c; fc.shadowColor = p.c; fc.shadowBlur = 10;
      fc.save(); fc.translate(p.x, p.y); fc.rotate(p.r); fc.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? p.s * .28 : p.s, t = k * Math.PI / 4; fc.lineTo(Math.cos(t) * rr, Math.sin(t) * rr); } fc.closePath(); fc.fill(); fc.restore(); }
    if (parts.length) requestAnimationFrame(tick); else { run = false; fc.clearRect(0, 0, innerWidth, innerHeight); } };
  requestAnimationFrame(tick);
}
let ac = null;
function chime(semi, soft, len) {
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
    const t = ac.currentTime, f = 880 * Math.pow(2, (semi || 0) / 12), g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(soft ? .04 : .07, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + (len || 1.2)); g.connect(ac.destination);
    [[1, 1], [2.003, .3], [3.01, .1]].forEach(([m, a]) => { const o = ac.createOscillator(), og = ac.createGain(); o.frequency.value = f * m; og.gain.value = a; o.connect(og).connect(g); o.start(t); o.stop(t + (len || 1.2) + .1); });
  } catch (e) {}
}

/* ---------- the gem keys ---------- */
const keys = $('keys'), slots = [...document.querySelectorAll('.slot')];
['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].forEach(k => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'key' + (k.length > 1 ? ' small' : ''); b.dataset.k = k;
  b.textContent = k === 'clear' ? 'Clear' : k === 'back' ? '⌫' : k; b.setAttribute('aria-label', k === 'clear' ? 'Clear' : k === 'back' ? 'Delete' : k);
  b.onclick = e => press(k, e); keys.appendChild(b); });
addEventListener('keydown', e => { if (S.stage !== 'vault') return; if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('back'); else if (e.key === 'Escape') press('clear'); });
let turn = 0;
function show() { slots.forEach((s, i) => s.classList.toggle('on', i < S.code.length)); }
function press(k, e) {
  if (S.open) return; $('slots').classList.remove('bad');
  const r = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null; if (r) burst(r.left + r.width / 2, r.top + r.height / 2, 10);
  if (k === 'clear') { S.code = ''; turn -= 90; chime(-5, true, .5); }
  else if (k === 'back') { S.code = S.code.slice(0, -1); turn -= 36; chime(-3, true, .5); }
  else if (S.code.length < 4) { S.code += k; turn += 36 + Number(k) * 9; chime(Number(k), true, .6); }
  $('dial').style.rotate = turn + 'deg'; show();
  if (S.code.length === 4) setTimeout(check, 250);
}
function check() {
  if (S.code === PRACTICE) return openVault();
  S.tries++; S.code = ''; $('slots').classList.add('bad'); $('doorBox').classList.remove('shake'); void $('doorBox').offsetWidth; $('doorBox').classList.add('shake');
  chime(-12, false, .7); turn -= 120; $('dial').style.rotate = turn + 'deg';
  setTimeout(() => { $('slots').classList.remove('bad'); show(); }, 650);
}

/* ---------- the vault opens and she flies in ---------- */
function openVault() {
  S.open = true; S.stage = 'opening'; turn += 720; $('dial').style.rotate = turn + 'deg';
  [0, 4, 7, 12].forEach((s, i) => setTimeout(() => chime(s), i * 120));
  const r = $('doorBox').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 40, '#FFD27A');
  setTimeout(() => $('doorBox').classList.add('open'), calm ? 50 : 650);
  /* the camera pushes into the open door, then the flight: through the vault, out through the clouds, into her treasure house */
  setTimeout(() => { const d = $('doorBox').getBoundingClientRect(); body.style.setProperty('--ox', (d.left + d.width / 2) + 'px'); body.style.setProperty('--oy', (d.top + d.height / 2) + 'px'); body.classList.add('pushing'); whoosh(1.6, .5); }, calm ? 100 : 1900);
  setTimeout(() => { S.stage = 'flying'; body.classList.add('flying'); whoosh(4.4, .9); chime(16, true, 1.6); }, calm ? 200 : 2900);
  setTimeout(arrive, calm ? 600 : 7300);
}
/* a soft whoosh: rushing air, made from filtered noise that rises and falls (no recording needed) */
function whoosh(len, vol) {
  if (calm) return; try {
    const ac = whoosh.ac || (whoosh.ac = new (window.AudioContext || window.webkitAudioContext)()); if (ac.state === 'suspended') ac.resume();
    const n = Math.floor(ac.sampleRate * len), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime; src.buffer = buf;
    bp.type = 'bandpass'; bp.Q.value = 0.9; bp.frequency.setValueAtTime(250, t); bp.frequency.exponentialRampToValueAtTime(1800, t + len * .55); bp.frequency.exponentialRampToValueAtTime(400, t + len);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09 * vol, t + len * .45); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(bp); bp.connect(g); g.connect(ac.destination); src.start(t); src.stop(t + len);
  } catch (e) {}
}
function arrive() {
  S.stage = 'home'; body.classList.add('home'); $('house').setAttribute('aria-hidden', 'false'); $('vault').setAttribute('aria-hidden', 'true');
  chime(12, false, 2); burst(innerWidth / 2, innerHeight * .4, 30, '#FFF1B8'); $('toWorld').focus({ preventScroll: true });
}

/* ---------- her treasures, turning on a glowing ring (swipe, the arrows, or tap one: it spins to the front and takes her there) ---------- */
const progress = readProgress(q, store), order = PLACES.map(p => p.id), N = order.length, globes = [];
let ang = 0, aim = 0, vel = 0, drag = null, moved = false, tilt = 0, tiltAim = 0, idle = 0;
const STEP = Math.PI * 2 / N, front = () => ((Math.round(-ang / STEP) % N) + N) % N;
function turnTo(i) { let d = (-i * STEP - aim) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; aim += d; idle = 0; }
order.forEach((id, i) => { const p = PLACES.find(x => x.id === id), v = progress[id] || 0, b = document.createElement('button');
  b.type = 'button'; b.className = 'globe' + (v > 0 ? '' : ' waiting'); b.style.setProperty('--c', p.color); b.dataset.place = id;
  b.innerHTML = '<img class="orb" src="' + GLOBES[id] + '" alt="">' + (INSIDE[id] ? '<img class="inside" src="' + INSIDE[id] + '" alt="">' : '') + '<span' + (p.lang ? ' lang="he" dir="rtl"' : '') + '>' + p.name + '</span>';   /* no crowns floating over the globes (HoS 2026-11-26: "those crowns are like awkward") */ b.setAttribute('aria-label', (p.label || p.name) + (v > 0 ? '' : ', waiting for her first treasure'));
  b.onclick = () => { if (moved) return; const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 3, 18, p.color); chime(p.note);
    turnTo(i); setTimeout(() => { location.href = 'world.html?place=' + id; }, calm ? 0 : 750); };
  $('globes').appendChild(b); globes.push(b); });
$('spinL').onclick = e => { aim += STEP; idle = 0; chime(2, true, .5); burst(e.clientX, e.clientY, 8); };
$('spinR').onclick = e => { aim -= STEP; idle = 0; chime(4, true, .5); burst(e.clientX, e.clientY, 8); };
const ringEl = $('globes');
ringEl.addEventListener('pointerdown', e => { drag = { x: e.clientX, a: aim }; moved = false; idle = 0; });
addEventListener('pointermove', e => { tiltAim = e.clientX / innerWidth - .5; if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 8) moved = true; aim = drag.a + dx / Math.max(260, innerWidth * .45) * Math.PI; });
addEventListener('pointerup', () => { if (!drag) return; drag = null; if (moved) { aim = Math.round(aim / STEP) * STEP; chime(5, true, .5); setTimeout(() => { moved = false; }, 0); } });
let lastT = performance.now();
function ring(now) {
  const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
  if (S.stage === 'home') {
    if (!drag && !calm) { idle += dt; if (idle > 3.5) aim -= dt * .18; }   /* when she is not touching it, the ring keeps turning slowly */
    if (calm) ang = aim; else { vel += (aim - ang) * 70 * dt; vel *= Math.exp(-11 * dt); ang += vel * dt; }
    tilt += (tiltAim - tilt) * .06;
    const W = ringEl.clientWidth, R = Math.min(W * .36, 430), f = front();
    globes.forEach((g, i) => { const a = ang + i * STEP, x = Math.sin(a) * R, z = Math.cos(a), sc = .48 + Math.pow((z + 1) / 2, 2.2) * .78;   /* the front globe comes right up close */
      g.style.transform = 'translateX(calc(-50% + ' + (x + tilt * 30 * z).toFixed(1) + 'px)) translateY(' + (-(1 - z) * 34 + (z > .9 ? 18 : 0)).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
      g.style.zIndex = String(Math.round(z * 100) + 100); g.style.setProperty('--o', (.45 + (z + 1) * .275).toFixed(2)); g.style.setProperty('--lbl', z > .3 ? '1' : '0');
      g.classList.toggle('front', i === f); });
  }
  requestAnimationFrame(ring);
}
requestAnimationFrame(ring);

window.KSIGN = { state: S, press, practice: PRACTICE };
