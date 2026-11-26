/* Grade 1 Math 2.0: the 3D kit every Grade 1 game uses (v2/curriculum/g1-math/MAP.md).
   A warm, film-lit world the boy is inside (sky, sun, hills, apple trees, flowers, butterflies, soft light), Mendy and his friends
   (a year older than in Kindergarten), number stones and crates, tapping and dragging in 3D, the voice, the buttons (64 px or more),
   the number pad, the "How to do it" box, stars and the test hooks (window.__g1).
   Uses lib/three.module.min.js (three.js r180, MIT): our own copy, so no outside website is needed.
   ?fast=1 runs everything quickly with no voice and simple graphics (for the automatic test). */
import * as THREE from './lib/three.module.min.js';
export { THREE };
export const FAST = /[?&]fast=1/.test(location.search);   /* simple graphics + quick + silent (the automatic test) */
export const QUICK = FAST || /[?&]quick=1/.test(location.search);   /* quick + silent, full graphics (for pictures) */
export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const SP = QUICK ? 0.04 : 1;
export const wait = ms => new Promise(r => setTimeout(r, ms * SP));

/* ---------------- the test hooks and the record of everything said ---------------- */
export const G = window.__g1 = { name: 'loading', round: 0, said: [], long: [], done: false, stars: 0, taps: 0, fixes: 0 };

/* ---------------- the voice ---------------- */
let VOICE = null;
function pickVoice() { const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || []; VOICE = vs.find(v => /en-US/.test(v.lang) && /Samantha|Google US|Female|Aria|Jenny/i.test(v.name)) || vs.find(v => /^en/.test(v.lang)) || null; }
if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
let lastLine = '', lastCap, sayToken = 0;
export function say(text, o = {}) {
  const words = spoken(text).replace(/[^\w\s'-]/g, ' ').trim().split(/\s+/).filter(Boolean);   /* counted as said: 116 is 3 words */
  if (words.length > 12) G.long.push(text);
  G.said.push(text); lastLine = text; lastCap = o.cap; showCaption(o.cap || text);
  const my = ++sayToken;
  if (QUICK || !window.speechSynthesis) return wait(Math.min(400, 60 * words.length));
  return new Promise(res => {
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(spoken(text));
    if (VOICE) u.voice = VOICE; u.rate = 0.9; u.pitch = 1.08;
    let fin = false; const end = () => { if (!fin) { fin = true; res(); } };
    u.onend = end; u.onerror = end; setTimeout(end, 900 + words.length * 520);
    speechSynthesis.speak(u);
  }).then(() => { if (my === sayToken) hideCaption(); });
}
export const sayAgain = () => lastLine && say(lastLine, { cap: lastCap });
/* numbers past 100 are said the Grade 1 way: 107 -> "one hundred seven" */
export function spoken(t) { return t.replace(/\b100\b/g, 'one hundred').replace(/\b1(\d\d)\b/g, (m, d) => 'one hundred ' + (+d)); }
G.spoken = spoken;

/* ---------------- soft sounds made by the computer (never a loud flash) ---------------- */
let AC = null;
export function chime(kind) {
  if (QUICK) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  const notes = kind === 'good' ? [659, 784, 1046] : kind === 'tap' ? [880] : kind === 'soft' ? [392, 330] : [523, 659, 784, 1046, 1318];
  notes.forEach((f, i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(AC.destination);
    const t = AC.currentTime + i * 0.09; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); o.start(t); o.stop(t + 0.4); });
}

/* ---------------- the buttons and boxes on top of the world ---------------- */
const CSS = `
:root{ --ink:#24304D; }
*{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html,body{ margin:0; height:100%; overflow:hidden; background:#9AD3FF; font-family:"Nunito","Varela Round","Arial Rounded MT Bold",system-ui,sans-serif; user-select:none; -webkit-user-select:none; touch-action:none; }
#stage{ position:fixed; inset:0; } #stage canvas{ display:block; }
.kb{ position:fixed; border:0; padding:0; border-radius:50%; cursor:pointer; display:grid; place-items:center; z-index:6; transition:transform .15s ease, opacity .3s ease;
  box-shadow:0 7px 0 rgba(0,0,0,.16), 0 12px 24px rgba(20,50,90,.3), inset 0 -6px 0 rgba(0,0,0,.1), inset 0 6px 10px rgba(255,255,255,.6); }
.kb:active{ transform:scale(.92); } .kb svg{ width:56%; height:56%; }
.kb.off{ opacity:0; pointer-events:none; }
#again{ top:calc(14px + env(safe-area-inset-top,0px)); left:14px; width:76px; height:76px; background:radial-gradient(circle at 35% 30%,#FFFFFF,#E3F1FF 60%,#B9DAFF); }
#help{ top:calc(14px + env(safe-area-inset-top,0px)); left:102px; width:76px; height:76px; background:radial-gradient(circle at 35% 30%,#FFFBEA,#FFE07A 60%,#F2B632); font-size:44px; font-weight:900; color:#7A4A00; }
#home{ top:calc(14px + env(safe-area-inset-top,0px)); right:14px; width:68px; height:68px; background:radial-gradient(circle at 35% 30%,#FFF6D8,#FFD36B 60%,#F5A623); }
#go{ left:50%; top:50%; width:148px; height:148px; margin:-74px 0 0 -74px; background:radial-gradient(circle at 35% 30%,#B8FFCE,#2EDB6A 55%,#109A45); animation:bob 1.6s ease-in-out infinite; }
#go svg{ margin-left:10%; }
#dots{ position:fixed; top:calc(30px + env(safe-area-inset-top,0px)); left:50%; transform:translateX(-50%); display:flex; gap:10px; z-index:5; }
#dots i{ width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,.55); box-shadow:inset 0 2px 3px rgba(0,0,0,.15); }
#dots i.on{ background:radial-gradient(circle at 35% 30%,#FFF6C8,#FFC21A); }
#cap{ position:fixed; left:50%; bottom:calc(18px + env(safe-area-inset-bottom,0px)); transform:translateX(-50%); max-width:min(92vw,760px); background:rgba(255,255,255,.92); color:var(--ink);
  border-radius:22px; padding:12px 22px; font-size:24px; font-weight:800; text-align:center; z-index:4; box-shadow:0 8px 24px rgba(20,50,90,.22); opacity:0; transition:opacity .25s; pointer-events:none; }
#cap.on{ opacity:1; }
body.padon #cap{ bottom:auto; top:calc(104px + env(safe-area-inset-top,0px)); }
#pad{ position:fixed; z-index:7; display:none; background:rgba(255,253,245,.94); border-radius:28px; padding:14px; box-shadow:0 14px 36px rgba(20,50,90,.3); }
#pad.on{ display:block; }
#pad .show{ height:76px; border-radius:18px; background:#FFFFFF; box-shadow:inset 0 3px 8px rgba(0,0,0,.12); font-size:56px; font-weight:900; color:var(--ink); display:flex; align-items:center; justify-content:center; letter-spacing:4px; margin-bottom:12px; }
#pad .keys{ display:grid; grid-template-columns:repeat(3,72px); gap:10px; }
#pad button{ width:72px; height:66px; border:0; border-radius:18px; font-size:36px; font-weight:900; color:var(--ink); cursor:pointer; font-family:inherit;
  background:linear-gradient(#FFFFFF,#E9F2FF); box-shadow:0 5px 0 #B9CBE6, 0 8px 14px rgba(20,50,90,.18); }
#pad button:active{ transform:translateY(3px); box-shadow:0 2px 0 #B9CBE6; }
#pad button.ok{ background:linear-gradient(#B8FFCE,#2EDB6A); color:#fff; box-shadow:0 5px 0 #13924A, 0 8px 14px rgba(20,50,90,.18); }
#pad button.del{ background:linear-gradient(#FFF1E0,#FFD7B0); box-shadow:0 5px 0 #E3A66B; }
@media (orientation:landscape){ #pad{ right:18px; top:50%; transform:translateY(-50%); } }
@media (orientation:portrait){ #pad{ left:50%; bottom:calc(10px + env(safe-area-inset-bottom,0px)); transform:translateX(-50%); padding:10px; }
  #pad .keys{ grid-template-columns:repeat(4,80px); gap:8px; } #pad button{ width:80px; height:64px; } #pad .show{ height:64px; font-size:46px; margin-bottom:8px; } }
#howbox{ position:fixed; inset:0; z-index:9; display:none; place-items:center; background:rgba(30,50,80,.35); }
#howbox.on{ display:grid; }
#howbox .card{ width:min(92vw,560px); background:#FFFDF5; border-radius:30px; padding:22px 24px 24px; box-shadow:0 20px 50px rgba(0,0,0,.3); color:var(--ink); text-align:center; }
#howbox h2{ margin:0 0 6px; font-size:28px; } #howbox ol{ text-align:left; font-size:22px; font-weight:700; line-height:1.45; margin:8px 0 16px; padding-left:30px; }
#howbox svg{ width:100%; max-height:150px; } #howbox .x{ position:relative; width:84px; height:84px; margin:0 auto; display:grid; background:radial-gradient(circle at 35% 30%,#B8FFCE,#2EDB6A 55%,#109A45); }
#end{ position:fixed; inset:0; z-index:8; display:none; place-items:center; pointer-events:none; }
#end.on{ display:grid; }
#end .card{ pointer-events:auto; background:rgba(255,253,245,.95); border-radius:34px; padding:26px 34px; text-align:center; box-shadow:0 20px 50px rgba(20,50,90,.3); }
#stars{ display:flex; gap:14px; justify-content:center; margin-bottom:18px; }
#stars .star{ width:78px; height:78px; } #stars .star path{ fill:#E4E8F0; } #stars .star.on path{ fill:#FFC21A; stroke:#E39A00; stroke-width:1.2; }
#end .row{ display:flex; gap:26px; justify-content:center; } #end .kb{ position:relative; width:100px; height:100px; }
#replay{ background:radial-gradient(circle at 35% 30%,#FFFFFF,#E3F1FF 60%,#B9DAFF); } #onward{ background:radial-gradient(circle at 35% 30%,#FFE1F1,#FF7EB9 55%,#E0408A); animation:bob 1.6s ease-in-out infinite; }
#nogl{ position:fixed; inset:0; display:none; place-items:center; background:#9AD3FF; color:#fff; font-size:24px; text-align:center; padding:24px; z-index:20; }
@keyframes bob{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-8px) } }
@media (max-width:600px){ body.padon #cap{ top:calc(126px + env(safe-area-inset-top,0px)); } #again,#help{ width:68px; height:68px; } #help{ left:90px; } #home{ width:64px; height:64px; } #cap{ font-size:20px; } #dots{ top:calc(96px + env(safe-area-inset-top,0px)); } }
`;
const ICON = {
  again: '<svg viewBox="0 0 24 24"><path fill="#1F6FD6" d="M3 9v6h4l5 4V5L7 9H3z"/><path fill="none" stroke="#1F6FD6" stroke-width="2.2" stroke-linecap="round" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path fill="#8A4B00" d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"/></svg>',
  go: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M7 4.5v15l13-7.5z"/></svg>',
  replay: '<svg viewBox="0 0 24 24"><path fill="none" stroke="#1F6FD6" stroke-width="2.6" stroke-linecap="round" d="M19 12a7 7 0 1 1-2.1-5"/><path fill="#1F6FD6" d="M20.5 3.5v6h-6z"/></svg>',
  onward: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M5 10.5h9.5L11 7l2-2 7 7-7 7-2-2 3.5-3.5H5z"/></svg>',
  ok: '<svg viewBox="0 0 24 24" width="34" height="34"><path fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  star: '<svg class="star" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z"/></svg>'
};
let capEl, padEl, padShow, howEl;
function showCaption(t) { if (capEl) { capEl.textContent = t; capEl.classList.add('on'); } }
function hideCaption() { if (capEl) capEl.classList.remove('on'); }
export function ui(opts = {}) {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  document.body.insertAdjacentHTML('beforeend', `
<div id="stage"></div>
<button class="kb" id="again" aria-label="hear it again">${ICON.again}</button>
<button class="kb" id="help" aria-label="how to do it">?</button>
<a class="kb" id="home" href="${opts.home || './'}" aria-label="all games">${ICON.home}</a>
<div id="dots"></div>
<button class="kb off" id="go" aria-label="start">${ICON.go}</button>
<div id="cap"></div>
<div id="pad"><div class="show" id="padshow"></div><div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}">${n}</button>`).join('')}<button class="del" data-k="del" aria-label="erase">&#9003;</button><button data-k="0">0</button><button class="ok" data-k="ok" aria-label="done">${ICON.ok}</button></div></div>
<div id="howbox"><div class="card"><h2 id="howt">How to do it</h2><div id="howpic"></div><ol id="howl"></ol><button class="kb x" id="howx" aria-label="got it">${ICON.ok.replace('width="34" height="34"', '')}</button></div></div>
<div id="end"><div class="card"><div id="stars">${ICON.star + ICON.star + ICON.star}</div><div class="row"><button class="kb" id="replay" aria-label="play again">${ICON.replay}</button><a class="kb" id="onward" href="${opts.home || './'}" aria-label="next">${ICON.onward}</a></div></div></div>
<div id="nogl">This computer cannot show the 3D world.</div>`);
  capEl = document.getElementById('cap'); padEl = document.getElementById('pad'); padShow = document.getElementById('padshow'); howEl = document.getElementById('howbox');
  document.getElementById('again').onclick = () => { G.again = (G.again || 0) + 1; sayAgain(); };
  document.getElementById('howx').onclick = () => { howEl.classList.remove('on'); G.howOpen = false; };
  document.getElementById('help').onclick = () => openHow();
  return document.getElementById('stage');
}
/* the kid-friendly "How to do it" box: the current game sets G.how = { title, steps: [...], pic: '<svg>' , say } */
export function openHow() {
  const h = G.how || { title: 'How to do it', steps: ['Listen.', 'Tap.'] };
  document.getElementById('howt').textContent = h.title; document.getElementById('howpic').innerHTML = h.pic || '';
  document.getElementById('howl').innerHTML = h.steps.map(s => '<li>' + s + '</li>').join('');
  howEl.classList.add('on'); G.howOpen = true; G.howN = (G.howN || 0) + 1; if (h.say) say(h.say);
}
export function dots(n, on) { const d = document.getElementById('dots'); d.innerHTML = Array.from({ length: n }, (_, i) => '<i class="' + (i < on ? 'on' : '') + '"></i>').join(''); }
export function goButton() { const b = document.getElementById('go'); b.classList.remove('off'); return new Promise(r => { b.onclick = () => { b.classList.add('off'); r(); }; }); }
/* the number pad: resolves with the number he wrote (he taps the green check) */
export function pad(maxDigits = 3) {
  let v = ''; padShow.textContent = ''; padEl.classList.add('on'); document.body.classList.add('padon'); G.padOn = true;
  return new Promise(res => { padEl.onclick = e => { const b = e.target.closest('button'); if (!b) return; const k = b.dataset.k; chime('tap');
    if (k === 'del') v = v.slice(0, -1); else if (k === 'ok') { if (!v) return; padEl.classList.remove('on'); document.body.classList.remove('padon'); G.padOn = false; res(+v); return; }
    else if (v.length < maxDigits) v = (v === '0' ? '' : v) + k; padShow.textContent = v; }; });
}
export function padType(n) { /* for the test: type a number and tap the check */
  String(n).split('').forEach(d => padEl.querySelector('[data-k="' + d + '"]').click()); padEl.querySelector('[data-k="ok"]').click(); }
G.padType = padType;
export function endScreen(stars) {
  G.stars = stars; G.done = true;
  document.querySelectorAll('#stars .star').forEach((s, i) => s.classList.toggle('on', i < stars));
  document.getElementById('end').classList.add('on');
  try { const k = 'g1math:' + location.pathname.split('/').pop() + ':' + (new URLSearchParams(location.search).get('g') || ''); const old = +localStorage.getItem(k) || 0; if (stars > old) localStorage.setItem(k, stars); } catch (e) {}
  return new Promise(r => { document.getElementById('replay').onclick = () => { document.getElementById('end').classList.remove('on'); r('replay'); }; });
}

/* ---------------- the world ---------------- */
export const col = h => new THREE.Color(h);
export function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const softTex = canvasTex(128, 128, (x) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
export const SOFT = softTex;
const phys = (c, o = {}) => new THREE.MeshPhysicalMaterial(Object.assign({ color: c, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.35 }, o));
const matte = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85 }, o));
export const MATS = { phys, matte };

export function stage(host, opts = {}) {
  const S = { host, tick: [], taps: [], drags: [], safe: { top: 100, bottom: 70, left: 10, right: 10 } };
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: !FAST, powerPreference: 'high-performance' }); }
  catch (e) { document.getElementById('nogl').style.display = 'grid'; G.name = 'nogl'; G.err = String(e); throw e; }
  renderer.setPixelRatio(FAST ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !FAST; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
  Object.assign(S, { renderer, scene, camera });

  /* sky: a warm painted gradient, with the sun glow low on the left */
  const sky = opts.sky || { top: '#5DB2F2', mid: '#A8DBFF', low: '#FFF1D6' };
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(200, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: col(sky.top) }, mid: { value: col(sky.mid) }, low: { value: col(sky.low) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 low; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.06 ? mix(mid, top, smoothstep(0.06, 0.55, h)) : mix(low, mid, smoothstep(-0.12, 0.06, h)); float s = pow(max(0.0, dot(vP, normalize(vec3(-0.6,0.25,-0.75)))), 24.0); c += vec3(1.0,0.85,0.55)*s*0.6; gl_FragColor = vec4(c,1.0); }' })));
  const pm = new THREE.PMREMGenerator(renderer);
  const env = canvasTex(256, 128, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#7CC4FF'); g.addColorStop(0.48, '#E6F4FF'); g.addColorStop(0.52, '#FFF1D9'); g.addColorStop(0.6, '#8CCB6A'); g.addColorStop(1, '#4E8A3A'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
  env.mapping = THREE.EquirectangularReflectionMapping; scene.environment = pm.fromEquirectangular(env).texture; scene.environmentIntensity = 0.55;
  scene.fog = new THREE.Fog(col(sky.mid).lerp(col('#FFFFFF'), 0.35), 40, 150);
  scene.add(new THREE.HemisphereLight(col('#DDEEFF'), col('#6BA34F'), 0.7));
  const sun = new THREE.DirectionalLight(col('#FFE6BF'), 2.4); sun.position.set(-9, 14, 9); sun.castShadow = !FAST;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 }); sun.shadow.bias = -0.0005; sun.shadow.radius = 4;
  scene.add(sun, sun.target); S.sun = sun;
  const rim = new THREE.DirectionalLight(col('#FFD7A8'), 0.8); rim.position.set(6, 6, -12); scene.add(rim);

  /* ground: soft painted meadow, rolling hills behind */
  const grassTex = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#86C964'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { const g = 150 + Math.random() * 60 | 0; x.fillStyle = `rgba(${60 + Math.random() * 50 | 0},${g},${50 + Math.random() * 40 | 0},.35)`; const px = Math.random() * w, py = Math.random() * h; x.fillRect(px, py, 2, 5 + Math.random() * 6); } });
  grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping; grassTex.repeat.set(18, 18);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260, 1, 1), matte('#FFFFFF', { map: grassTex }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground); S.ground = ground;
  const hillM = matte('#8CCB66'), hillM2 = matte('#A6D77A');
  [[-60, -70, 34, hillM], [-8, -88, 42, hillM2], [52, -74, 36, hillM], [95, -40, 30, hillM2], [-100, -35, 30, hillM2]].forEach(([x, z, r, m]) => {
    const h = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m); h.scale.y = 0.38; h.position.set(x, -1, z); scene.add(h); });

  /* clouds: soft painted puffs that drift */
  const cloudM = new THREE.SpriteMaterial({ map: softTex, color: '#FFFFFF', transparent: true, opacity: 0.9, depthWrite: false, fog: false });
  const clouds = new THREE.Group(); scene.add(clouds);
  for (let i = 0; i < (FAST ? 4 : 11); i++) { const c = new THREE.Group(), cx = -90 + i * 17 + Math.random() * 8, cy = 26 + Math.random() * 14, cz = -95 - Math.random() * 25;
    for (let j = 0; j < 6; j++) { const s = new THREE.Sprite(cloudM); const sc = 10 + Math.random() * 9; s.scale.set(sc * 1.5, sc, 1); s.position.set(j * 5 - 12 + Math.random() * 3, Math.random() * 3, 0); c.add(s); }
    c.position.set(cx, cy, cz); clouds.add(c); }
  S.tick.push(dt => clouds.children.forEach((c, i) => { c.position.x += dt * (0.6 + i % 3 * 0.2); if (c.position.x > 110) c.position.x = -110; }));

  /* pointer: taps and drags in 3D */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function toNdc(e) { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); }
  let dragging = null;
  renderer.domElement.addEventListener('pointerdown', e => {
    if (G.howOpen) return; toNdc(e); G.taps++;
    for (const d of S.drags) { if (!d.enabled) continue; const hit = ray.intersectObjects(d.objects, true)[0]; if (hit) { let o = hit.object; while (o && !d.objects.includes(o)) o = o.parent; dragging = { d, o }; d.start && d.start(o); renderer.domElement.setPointerCapture(e.pointerId); return; } }
    const objs = S.taps.filter(t => t.enabled !== false).flatMap(t => t.objects);
    const hit = ray.intersectObjects(objs, true)[0]; if (!hit) return;
    let o = hit.object; let t = null; while (o) { t = S.taps.find(tt => tt.enabled !== false && tt.objects.includes(o)); if (t) break; o = o.parent; }
    if (t) t.fn(o, hit);
  });
  renderer.domElement.addEventListener('pointermove', e => { if (!dragging) return; toNdc(e); const p = new THREE.Vector3(); if (ray.ray.intersectPlane(dragging.d.plane, p)) dragging.d.move(dragging.o, p); });
  const up = () => { if (!dragging) return; const d = dragging; dragging = null; d.d.drop(d.o); };
  renderer.domElement.addEventListener('pointerup', up); renderer.domElement.addEventListener('pointercancel', up);
  S.onTap = (objects, fn) => { const t = { objects, fn, enabled: true }; S.taps.push(t); return t; };
  S.onDrag = (objects, plane, h) => { const d = Object.assign({ objects, plane, enabled: true }, h); S.drags.push(d); return d; };
  S.clearInput = () => { S.taps.length = 0; S.drags.length = 0; };
  S.screenOf = (o, dy = 0) => { const v = new THREE.Vector3(); o.updateWorldMatrix(true, false); o.getWorldPosition(v); v.y += dy; v.project(camera);
    const r = renderer.domElement.getBoundingClientRect(); return { x: Math.round(r.left + (v.x + 1) / 2 * r.width), y: Math.round(r.top + (1 - v.y) / 2 * r.height) }; };

  /* the camera: frames a box (center, width, height) inside the free part of the screen, and glides between shots */
  S.view = { center: new THREE.Vector3(0, 1, 0), w: 12, h: 7, dir: new THREE.Vector3(0, 0.32, 1).normalize() };
  const camPos = new THREE.Vector3(0, 6, 30), camLook = new THREE.Vector3(0, 1, 0);
  function aim() { const W = innerWidth, H = innerHeight, s = S.safe, pad = G.padOn;
    let rx = s.left, ry = s.top, rw = W - s.left - s.right, rh = H - s.top - s.bottom;
    if (pad) { const pr = padEl.getBoundingClientRect(); if (W > H) rw = Math.max(200, pr.left - 10 - rx); else rh = Math.max(200, pr.top - 10 - ry); }
    camera.aspect = W / H; const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dv = (S.view.h / 2) / t * (H / rh), dh = (S.view.w / 2) / (t * camera.aspect) * (W / rw), d = Math.max(dv, dh);
    S.goal = { pos: S.view.center.clone().addScaledVector(S.view.dir, d), look: S.view.center.clone() };
    camera.setViewOffset(W, H, -((rx + rw / 2) - W / 2), -((ry + rh / 2) - H / 2), W, H); camera.updateProjectionMatrix(); }
  S.aim = aim;
  S.frame = (center, w, h, dir, now) => { S.view = { center: center.clone(), w, h, dir: (dir || S.view.dir).clone().normalize() }; aim(); if (now || FAST) { camPos.copy(S.goal.pos); camLook.copy(S.goal.look); } };
  function resize() { renderer.setSize(innerWidth, innerHeight); aim(); }
  addEventListener('resize', resize); resize(); camPos.copy(S.goal.pos); camLook.copy(S.goal.look);

  /* the loop */
  const clock = new THREE.Clock(); let rafOn = true; S.frames = 0;
  function loop() { if (!rafOn) return; requestAnimationFrame(loop); const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
    if (G.padOn !== S.lastPad) { S.lastPad = G.padOn; aim(); }
    const k = FAST ? 1 : 1 - Math.pow(0.02, dt); camPos.lerp(S.goal.pos, k); camLook.lerp(S.goal.look, k);
    camera.position.copy(camPos); if (!FAST) camera.position.y += Math.sin(t * 0.4) * 0.04; camera.lookAt(camLook);
    S.tick.forEach(f => f(dt, t)); renderer.render(scene, camera); S.frames++; G.frames = S.frames; }
  loop();
  S.stop = () => { rafOn = false; };
  G.settled = () => camPos.distanceTo(S.goal.pos) < 0.05;   /* the camera has finished gliding (for the picture-taking script) */
  return S;
}

/* ---------------- tweens ---------------- */
export function tween(ms, fn, ez = ease) { if (FAST) { fn(1); return Promise.resolve(); } return new Promise(res => { const d = ms * SP, t0 = performance.now(); (function step() { const u = d <= 0 ? 1 : Math.min(1, (performance.now() - t0) / d); fn(ez(u)); if (u < 1) requestAnimationFrame(step); else res(); })(); }); }
export function hopTo(obj, to, ms = 420, height = 1) { const from = obj.position.clone(); return tween(ms, u => { obj.position.lerpVectors(from, to, u); obj.position.y += Math.sin(u * Math.PI) * height; }); }

/* ---------------- the orchard: apple trees, a stone path, flowers, butterflies ---------------- */
export function orchard(S, o = {}) {
  const { scene } = S, g = new THREE.Group(); scene.add(g);
  const trunkM = matte('#8A5A3A'), leafM = [matte('#4FA43F', { roughness: 0.75 }), matte('#66B84A', { roughness: 0.75 }), matte('#3F9440', { roughness: 0.75 })], appleM = phys('#E2302E', { roughness: 0.3, clearcoat: 0.9 });
  const trees = o.trees || (FAST ? [[-14, -10], [15, -11], [0, -26]] : [[-14, -10], [-20, -4], [15, -11], [21, -3], [-9, -20], [10, -22], [0, -26], [-26, -16], [27, -17]]);
  trees.forEach(([x, z], i) => { const t = new THREE.Group(); const s = 0.9 + (i % 3) * 0.15;
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 3, 10), trunkM); tr.position.y = 1.5; tr.castShadow = true; t.add(tr);
    for (let j = 0; j < 7; j++) { const r = 1.3 + Math.random() * 0.6, l = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), leafM[j % 3]); const a = j / 7 * Math.PI * 2;
      l.position.set(Math.cos(a) * 1.2, 3.8 + (j % 2) * 0.8 + Math.random() * 0.4, Math.sin(a) * 1.0); l.castShadow = true; l.receiveShadow = true; t.add(l); }
    const top = new THREE.Mesh(new THREE.SphereGeometry(1.7, 18, 14), leafM[1]); top.position.y = 5; top.castShadow = true; t.add(top);
    for (let j = 0; j < 9; j++) { const ap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), appleM); const a = j / 9 * Math.PI * 2 + i;
      ap.position.set(Math.cos(a) * 2.05, 3.5 + Math.sin(j * 1.7) * 0.9, Math.sin(a) * 1.75); t.add(ap); }
    t.position.set(x, 0, z); t.scale.setScalar(s); t.rotation.y = i; g.add(t); });
  /* round bushes near the play area */
  const bushM = [matte('#5DB04A', { roughness: 0.8 }), matte('#74C25A', { roughness: 0.8 })];
  [[-15, -6], [-17, 0], [15, -7], [17, -1], [-12, -9], [12, -10], [-6, -12], [6, -13]].forEach(([x, z], i) => { for (let j = 0; j < 3; j++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1.1 - j * 0.2, 16, 12), bushM[(i + j) % 2]); b.position.set(x + (j - 1) * 1.1, 0.6, z + (j % 2) * 0.5); b.scale.y = 0.8; b.castShadow = !FAST; g.add(b); } });
  /* flowers in the grass */
  const fN = FAST ? 60 : 260, stem = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 10, 8), matte('#FFFFFF', { roughness: 0.6 }), fN), fc = new THREE.Color(), m = new THREE.Matrix4();
  const FC = ['#FFFFFF', '#FFD84A', '#FF9EC4', '#B9A4FF', '#FFB36B'];
  for (let i = 0; i < fN; i++) { let x, z; do { x = (Math.random() - 0.5) * 70; z = 8 - Math.random() * 45; } while (Math.abs(x) < 12 && z > -7); m.makeTranslation(x, 0.12, z); m.multiply(new THREE.Matrix4().makeScale(1, 0.35, 1)); stem.setMatrixAt(i, m); stem.setColorAt(i, fc.set(FC[i % 5])); }
  g.add(stem);
  /* butterflies: two soft wings, gentle flight */
  const wingM = new THREE.MeshStandardMaterial({ color: '#FFB0D8', side: THREE.DoubleSide, roughness: 0.6 }), wingM2 = new THREE.MeshStandardMaterial({ color: '#FFE27A', side: THREE.DoubleSide, roughness: 0.6 });
  const bf = []; for (let i = 0; i < (FAST ? 1 : 5); i++) { const b = new THREE.Group(); [-1, 1].forEach(s => { const w = new THREE.Mesh(new THREE.CircleGeometry(0.22, 12), i % 2 ? wingM : wingM2); w.position.x = s * 0.2; w.userData.s = s; b.add(w); });
    b.userData = { a: Math.random() * 6, r: 5 + Math.random() * 6, y: 2 + Math.random() * 2, c: new THREE.Vector3((Math.random() - 0.5) * 20, 0, -4 - Math.random() * 8) }; g.add(b); bf.push(b); }
  S.tick.push((dt, t) => bf.forEach(b => { const u = b.userData; u.a += dt * 0.35; b.position.set(u.c.x + Math.cos(u.a) * u.r, u.y + Math.sin(t * 1.3 + u.a) * 0.5, u.c.z + Math.sin(u.a) * u.r * 0.5); b.rotation.y = -u.a;
    b.children.forEach(w => { w.rotation.y = w.userData.s * (0.3 + Math.abs(Math.sin(t * 9 + u.a)) * 1.1); }); }));
  return g;
}

/* a number written on a soft disc texture (numbers live on stones, crates and signs in the world; never inside ordered pictures) */
const numTexCache = {};
export function numTex(text, o = {}) {
  const key = text + '|' + (o.bg || '') + '|' + (o.fg || '');
  if (numTexCache[key]) return numTexCache[key];
  return (numTexCache[key] = canvasTex(256, 256, (x, w, h) => {
    if (o.bg) { x.fillStyle = o.bg; x.beginPath(); x.arc(128, 128, 124, 0, Math.PI * 2); x.fill(); }
    const s = String(text), fs = s.length >= 3 ? 104 : s.length === 2 ? 132 : 160;
    x.font = '900 ' + fs + 'px "Nunito","Arial Rounded MT Bold","Arial Black",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineJoin = 'round'; x.lineWidth = 16; x.strokeStyle = o.edge || 'rgba(255,255,255,.95)'; x.strokeText(s, 128, 138);
    x.fillStyle = o.fg || '#2B3A63'; x.fillText(s, 128, 138);
  }));
}
/* a round stepping stone with a number on top */
const stoneGeo = (() => { const pts = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI / 2; pts.push(new THREE.Vector2(0.92 + Math.sin(a) * 0.14, Math.cos(a) * 0.14 + 0.12)); } pts.unshift(new THREE.Vector2(0, 0.26)); pts.push(new THREE.Vector2(0.98, 0)); pts.push(new THREE.Vector2(0, 0)); return new THREE.LatheGeometry(pts, 40); })();
const stoneM = [phys('#F7E6C4', { roughness: 0.6, clearcoat: 0.25, envMapIntensity: 0.4 }), phys('#F2DDB6', { roughness: 0.6, clearcoat: 0.25, envMapIntensity: 0.4 }), phys('#FAEBCF', { roughness: 0.6, clearcoat: 0.25, envMapIntensity: 0.4 })];
export function stone(n, o = {}) {
  const g = new THREE.Group(), b = new THREE.Mesh(stoneGeo, o.mat || stoneM[Math.abs(n) % 3]); b.castShadow = !FAST; b.receiveShadow = true; g.add(b);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.86, 40), new THREE.MeshStandardMaterial({ map: numTex(n == null ? '' : n), transparent: true, roughness: 0.8 }));
  face.rotation.x = -Math.PI / 2; face.position.y = 0.265; g.add(face); g.userData = { n, face, base: b };
  const plain = (v) => { const blank = v == null; face.material.map = blank ? null : numTex(v); face.material.color.set(blank ? '#F4E3C4' : '#FFFFFF'); face.material.transparent = !blank; face.material.needsUpdate = true; };   /* a blank stone gets a plain, smooth top */
  plain(n);
  g.setNum = v => { g.userData.n = v; plain(v); };
  return g;
}
/* a glowing ring under something to show "here" */
export function glow(color = '#FFD84A', size = 2.6) { const s = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: SOFT, color, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })); s.rotation.x = -Math.PI / 2; return s; }

/* ---------------- a crate of ten apples, and loose apples ---------------- */
const appleGeo = new THREE.SphereGeometry(0.22, 18, 14), appleMat = phys('#E2302E', { roughness: 0.28, clearcoat: 1 }), leafMat = matte('#4FA43F'), stemMat = matte('#6B4226');
export function apple() { const a = new THREE.Group(); const b = new THREE.Mesh(appleGeo, appleMat); b.scale.set(1, 0.92, 1); b.castShadow = !FAST; a.add(b);
  const st = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.12, 6), stemMat); st.position.y = 0.24; a.add(st);
  const lf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), leafMat); lf.scale.set(1.4, 0.3, 0.7); lf.position.set(0.07, 0.27, 0); a.add(lf); return a; }
const crateM = phys('#C98B4E', { roughness: 0.65, clearcoat: 0.15 }), crateDark = phys('#A8703C', { roughness: 0.7, clearcoat: 0.1 });
export function crate(full = 10) {
  const g = new THREE.Group(), W = 2.6, D = 1.1, H = 0.55;
  const base = new THREE.Mesh(new THREE.BoxGeometry(W, 0.08, D), crateDark); base.position.y = 0.04; g.add(base);
  [[0, D / 2], [0, -D / 2]].forEach(([x, z]) => { for (let k = 0; k < 2; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(W, 0.2, 0.07), crateM); s.position.set(x, 0.16 + k * 0.26, z); s.castShadow = !FAST; g.add(s); } });
  [-W / 2, W / 2].forEach(x => { for (let k = 0; k < 2; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, D), crateM); s.position.set(x, 0.16 + k * 0.26, 0); s.castShadow = !FAST; g.add(s); } });
  const apples = []; for (let i = 0; i < 10; i++) { const a = apple(); a.position.set(-1.0 + (i % 5) * 0.5, 0.3, i < 5 ? -0.24 : 0.24); a.visible = i < full; g.add(a); apples.push(a); }
  g.userData = { apples, kind: 'crate' }; return g;
}

/* ---------------- Mendy and his friends (Grade 1: a year older, a little taller) ---------------- */
const SKIN = '#F6CDA8';
export function kid(o = {}) {
  const shirt = o.shirt || '#A9C6EE', hair = o.hair || '#8A5A34', kippah = o.kippah || '#24346E';
  const k = new THREE.Group(), body = new THREE.Group(); k.add(body);
  const skin = new THREE.MeshPhysicalMaterial({ color: SKIN, roughness: 0.55, sheen: 0.6, sheenColor: col('#FFD7C2') });
  const shirtM = new THREE.MeshPhysicalMaterial({ color: shirt, roughness: 0.75, sheen: 0.7, sheenColor: col('#FFFFFF') });
  const pantsM = new THREE.MeshPhysicalMaterial({ color: o.pants || '#2B3656', roughness: 0.8, sheen: 0.4, sheenColor: col('#6D7BA8') });
  const shoeM = phys('#7A4A2A', { roughness: 0.4, clearcoat: 0.8 }), hairM = new THREE.MeshPhysicalMaterial({ color: hair, roughness: 0.65, sheen: 1, sheenColor: col(hair).lerp(col('#FFFFFF'), 0.4) });
  const kipM = new THREE.MeshStandardMaterial({ roughness: 0.9, map: canvasTex(256, 128, (x, w, h) => { x.fillStyle = kippah; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,.10)'; for (let i = 0; i < 64; i++) for (let j = 0; j < 16; j++) x.fillRect(i * 4 + (j % 2) * 2, j * 8, 2, 4); x.fillStyle = '#8FB4F0'; x.fillRect(0, h * 0.8, w, h * 0.06); }) });
  const add = (m, x, y, z, p) => { m.position.set(x, y, z); m.castShadow = !FAST; (p || body).add(m); return m; };
  const lathe = (pts, m) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), 36), m);
  [-1, 1].forEach(s => { add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12), shoeM), s * 0.19, 0.1, 0.07).scale.set(1, 0.6, 1.5);
    add(new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.46, 6, 14), pantsM), s * 0.18, 0.5, 0); });
  add(lathe([[0, 0.62], [0.32, 0.64], [0.41, 0.76], [0.42, 0.92], [0.39, 1.0], [0, 1.02]], pantsM), 0, 0, 0);
  add(lathe([[0, 0.86], [0.43, 0.88], [0.45, 1.04], [0.42, 1.36], [0.36, 1.62], [0.2, 1.76], [0, 1.78]], shirtM), 0, 0, 0);
  const tzM = matte('#FFFFFF', { roughness: 0.6 });
  [-1, 1].forEach(s => { for (let j = 0; j < 3; j++) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.4, 5), tzM); t.position.set(s * (0.36 + j * 0.025), 0.82, 0.12 + j * 0.01); t.rotation.z = s * 0.06; body.add(t); } });
  const collar = add(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 10, 24), shirtM), 0, 1.74, 0); collar.rotation.x = Math.PI / 2;
  const btnM = phys('#F2EEE6'); [1.56, 1.36, 1.16].forEach(y => add(new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), btnM), 0, y, 0.41 - (1.62 - y) * 0.03));
  const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-0.41, 1.6, 0); armR.position.set(0.41, 1.6, 0); body.add(armL, armR);
  [armL, armR].forEach(a => { const s1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.42, 6, 12), shirtM); s1.position.y = -0.3; s1.castShadow = !FAST; a.add(s1);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), skin); h.position.y = -0.64; a.add(h); });
  armL.rotation.z = -0.14; armR.rotation.z = 0.14;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.16, 14), skin), 0, 1.82, 0);
  const head = new THREE.Group(); head.position.set(0, 2.24, 0); body.add(head); const r = 0.46;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 30), skin); skull.scale.set(1.0, 1.0, 0.97); skull.castShadow = !FAST; head.add(skull);
  [-1, 1].forEach(s => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), skin); ear.scale.set(0.5, 1, 0.75); ear.position.set(s * r * 0.98, -0.03, -0.02); head.add(ear);
    const pts = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI * 4; pts.push(new THREE.Vector3(Math.cos(a) * 0.035, -i / 30 * 0.2, Math.sin(a) * 0.035)); }
    const pe = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.017, 6, false), hairM); pe.position.set(s * r * 0.92, -0.07, 0.1); head.add(pe); });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 1.035, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), hairM); cap.rotation.x = -0.6; cap.position.set(0, 0.01, -0.02); head.add(cap);
  for (let i = 0; i < 9; i++) { const a = -0.8 + i * 0.2, el = 0.52 - a * a * 0.12, t = new THREE.Mesh(new THREE.SphereGeometry(r * 0.16, 14, 10), hairM); const ca = Math.cos(el);
    t.position.set(Math.sin(a) * ca * r, Math.sin(el) * r, Math.cos(a) * ca * r); t.scale.set(1.45, 0.5, 0.32); t.lookAt(t.position.clone().multiplyScalar(2)); t.rotateZ(a * 0.4); head.add(t); }
  const kip = new THREE.Mesh(new THREE.SphereGeometry(r * 1.08, 40, 12, 0, Math.PI * 2, 0, 0.72), kipM); kip.rotation.x = -0.28; kip.position.set(0, 0.02, -0.02); head.add(kip);
  /* a gentle face: warm eyes of normal size with a small highlight, soft brows, rosy cheeks, a small kind smile */
  const on = (dx, dy, lift) => Math.sqrt(Math.max(0, r * r - dx * dx - dy * dy)) * 0.985 + (lift || 0);
  const iris = phys(o.eye || '#4A2E1C', { roughness: 0.25, clearcoat: 0.8 }), shine = new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), eyes = [];
  const browM = matte(col(hair).multiplyScalar(0.8)), cheekM = new THREE.MeshBasicMaterial({ color: '#FF9AA6', transparent: true, opacity: 0.3, depthWrite: false });
  [-1, 1].forEach(s => { const ex = s * r * 0.3, ey = r * 0.04, e = new THREE.Group(); e.position.set(ex, ey, on(ex, ey, -0.012)); e.rotation.y = s * 0.3;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(r * 0.1, 20, 14), iris); ball.scale.set(0.86, 1.08, 0.42); e.add(ball);
    const h1 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.03, 12), shine); h1.position.set(r * 0.028, r * 0.038, r * 0.044); e.add(h1); head.add(e); eyes.push(e);
    const bp = []; for (let i = 0; i <= 10; i++) { const u = i / 10 - 0.5, bx = ex + u * r * 0.26, by = r * 0.27 + (0.25 - u * u) * r * 0.12; bp.push(new THREE.Vector3(bx, by, on(bx, by, 0.006))); }
    head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bp), 14, r * 0.018, 6, false), browM));
    const ck = new THREE.Mesh(new THREE.CircleGeometry(r * 0.13, 20), cheekM), cx = s * r * 0.5, cy = -r * 0.17; ck.position.set(cx, cy, on(cx, cy, 0.01)); ck.rotation.set(0.2, s * 0.55, 0); head.add(ck);
    if (o.glasses) { const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.19, r * 0.026, 8, 28), phys('#2A2F45')); rim.position.set(ex, ey, on(ex, ey, 0.045)); rim.rotation.y = s * 0.3; head.add(rim); } });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(r * 0.075, 14, 10), phys('#F0BB98', { roughness: 0.55, clearcoat: 0.2 })); nose.scale.set(1.1, 0.85, 0.7); nose.position.set(0, -r * 0.1, on(0, -r * 0.1, -0.012)); head.add(nose);
  const mp = []; for (let i = 0; i <= 14; i++) { const u = i / 14 - 0.5, mx = u * r * 0.26, my = -r * 0.3 - (0.25 - u * u) * r * 0.16; mp.push(new THREE.Vector3(mx, my, on(mx, my, 0.008))); }
  head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mp), 16, r * 0.02, 6, false), matte('#B9505F', { roughness: 0.6 })));
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ map: SOFT, color: '#4A3A2A', transparent: true, opacity: 0.35, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = 0.02; k.add(sh);
  k.userData = { armL, armR, head, body, eyes, blink: 2 + Math.random() * 3, name: o.name || 'Mendy', act: null, actT: 0 };
  k.traverse(m => { if (m.isMesh && m !== sh) m.castShadow = !FAST; });
  /* calm life: breathing, blinking, a small head tilt; plus acts: wave, cheer, point, think */
  k.act = (name, dur = 1.2) => { k.userData.act = name; k.userData.actT = 0; k.userData.actD = dur; };
  k.live = (dt, t) => { const u = k.userData; body.position.y = Math.sin(t * 2.1 + k.id) * 0.015; head.rotation.z = Math.sin(t * 0.7 + k.id) * 0.05;
    u.blink -= dt; const bl = u.blink < 0.12 && u.blink > 0; eyes.forEach(e => e.scale.y = bl ? 0.15 : 1); if (u.blink < 0) u.blink = 2.5 + Math.random() * 3;
    let aL = -0.14, aR = 0.14, ax = 0, hop = 0;
    if (u.act) { u.actT += dt; const p = u.actT / u.actD;
      if (u.act === 'wave') { aR = 2.6 + Math.sin(u.actT * 12) * 0.35; }
      else if (u.act === 'cheer') { aL = -2.6; aR = 2.6; hop = Math.abs(Math.sin(u.actT * 7)) * 0.25; }
      else if (u.act === 'point') { aR = 1.3; ax = -0.6; }
      else if (u.act === 'think') { aR = 2.2; head.rotation.z = 0.15; }
      else if (u.act === 'clap') { aL = -0.5; aR = 0.5; ax = -1.1 - Math.abs(Math.sin(u.actT * 14)) * 0.25; }
      if (p >= 1) u.act = null; }
    armL.rotation.z += (aL - armL.rotation.z) * 0.2; armR.rotation.z += (aR - armR.rotation.z) * 0.2; armR.rotation.x += (ax - armR.rotation.x) * 0.2; armL.rotation.x += ((u.act === 'clap' ? ax : 0) - armL.rotation.x) * 0.2;
    body.position.y += hop; };
  return k;
}
export const CAST = {
  mendy: { name: 'Mendy', shirt: '#A9C6EE', hair: '#8A5A34', kippah: '#24346E' },
  shmuel: { name: 'Shmuel', shirt: '#9ED9A8', hair: '#2E1F14', kippah: '#1E2A44', eye: '#3A2416' },
  dovid: { name: 'Dovid', shirt: '#F4C98A', hair: '#5A3A22', kippah: '#3A2A6A', glasses: true },
  eli: { name: 'Eli', shirt: '#F2A9A0', hair: '#C9782F', kippah: '#203858', eye: '#3F6A3A' },
  yossi: { name: 'Yossi', shirt: '#C8B4EE', hair: '#1C140E', kippah: '#2A2A2A' }
};
export function addKid(S, who, pos) { const k = kid(CAST[who] || CAST.mendy); k.position.copy(pos); S.scene.add(k); S.tick.push((dt, t) => k.live(dt, t)); return k; }

/* ---------------- a gentle celebration: soft confetti and twinkles that float down (never a hard flash) ---------------- */
export function confetti(S, at, n = 60) {
  const C = ['#FFC21A', '#FF7EB9', '#5EC8FF', '#7EE08A', '#B9A4FF', '#FFFFFF'];
  const geo = new THREE.PlaneGeometry(0.16, 0.09), parts = [];
  for (let i = 0; i < (FAST ? 8 : n); i++) { const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: C[i % C.length], side: THREE.DoubleSide, roughness: 0.5 }));
    m.position.copy(at); m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 5, 4 + Math.random() * 4, (Math.random() - 0.5) * 3); m.userData.s = Math.random() * 6; S.scene.add(m); parts.push(m); }
  let life = 0; const f = dt => { life += dt; parts.forEach(p => { p.userData.v.y -= 6 * dt; p.userData.v.multiplyScalar(0.985); p.position.addScaledVector(p.userData.v, dt); p.rotation.x += dt * p.userData.s; p.rotation.y += dt * 3; });
    if (life > 2.2) { parts.forEach(p => { S.scene.remove(p); p.material.dispose(); }); S.tick.splice(S.tick.indexOf(f), 1); } };
  S.tick.push(f); chime('yay');
}

/* the end-of-game star count from mistakes: no mistakes 3, a few 2, many 1 */
export const starsFor = (miss, rounds) => miss === 0 ? 3 : miss <= Math.max(1, Math.floor(rounds / 3)) ? 2 : 1;
