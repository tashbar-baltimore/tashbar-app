/* Kindergarten Kriyah, the shared game engine for every Kriyah game (Tashbar Learning 2.0).
   The 3D world in the approved "premium toy-box" look (curriculum/k-kriyah/ART-DIRECTION.md and samples/kriyah-sample-3d.html),
   Mendy and his family, real 3D letters from a Hebrew font, voice, sparkles, stars, saving and the unit's game order.
   Everything is local (lib/), so nothing depends on another website. */
import * as THREE from 'three';
import { SVGLoader } from './lib/SVGLoader.js';
import { RoomEnvironment } from './lib/RoomEnvironment.js';
import { OUTLINES } from './letters.js';
export { THREE };

/* ---------------- the units and their games, in skill order (units.js) ---------------- */
import { UNITS, GAMES, unitOf } from './units.js';
export { UNITS, GAMES, unitOf };
export const PASS = 2;                     /* the next game opens at 2 of 3 stars */

/* ---------------- time (?fast=1 makes every wait short, for tests) ---------------- */
const Q = new URLSearchParams(location.search);
export const FAST = Q.has('fast');
export const LITE = Q.has('lite');
/* calm (Esti 2026-11-27, K-CLARITY-RULES 10: "the backgrounds are so busy that it's hard to focus ... butterflies flying around"): no butterflies, birds,
   drifting clouds, swaying flags or floating light; a paler, softer painted picture; small, short joy. ?busy=1 shows the old look, only for comparing. */
export const CALM = !Q.has('busy');
export const F = FAST ? (LITE ? 0.05 : 0.12) : 1;   /* the quick automatic run waits even less */   /* ?lite=1: a fifth of the pixels across, plainer letters, no shadows and no smoothing, so the automatic tests fit the 45-minute check (the pictures use the full look) */
export const wait = ms => new Promise(r => setTimeout(r, ms * F));
export const $ = s => document.querySelector(s);

/* ---------------- saving: on this device now, and to the shared path later ---------------- */
const KEY = 'tl2:k-kriyah';
export function loadSave() { try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); s.games = s.games || {}; return s; } catch (e) { return { games: {} }; } }
function writeSave(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
export function best(id) { const g = loadSave().games[id]; return g ? g.stars || 0 : 0; }
/* look mode: on a pull request's preview site (its address has "--pr-"), a link with ?look=1 opens every game, so an approver can see any unit.
   It is never on for the live 2.0 site the boys use. */
const LOOK = (() => { try { if (!location.hostname.includes('--pr-')) return false; if (new URLSearchParams(location.search).get('look') === '1') sessionStorage.setItem('tl2:look', '1'); return sessionStorage.getItem('tl2:look') === '1'; } catch (e) { return false; } })();
export function unlocked(id) {
  if (LOOK) return GAMES.some(x => x.id === id);
  const g = GAMES.find(x => x.id === id), u = unitOf(id); if (!g || !u) return false;
  const i = u.games.findIndex(x => x.id === id), check = v => v.games.find(x => x.mastery).id;
  if (g.bonus) return best(check(u)) >= 3;      /* the bonus round opens for a boy who got 3 stars on his unit's check */
  if (i === 0) { const before = UNITS.find(x => x.n === u.n - 1); if (before && before.gate) return gateOpen(check(before)); return !before || best(check(before)) >= PASS; }   /* a new unit opens when the one before it passed its check */
  if (g.afterTry) { const pv = loadSave().games[u.games[i - 1].id]; return !!(pv && pv.plays); }   /* extra practice opens once he has tried the check */
  let j = i - 1; while (j > 0 && u.games[j].bonus) j--;
  return best(u.games[j].id) >= PASS;
}
/* the gate to the nekudos (MAP.md, Unit 10): 3 stars on the champion check on two different days */
export const GATE_DAYS = 2;
/* today, by the boy's own clock (not UTC: in Baltimore the UTC date changes in the evening) */
export const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
export function gateDays(id) { const g = loadSave().games[id]; return g && g.days3 ? g.days3.length : 0; }
export const gateOpen = id => gateDays(id) >= GATE_DAYS;
export function struggled(id) { const g = loadSave().games[id]; return !!(g && g.last != null && g.last < PASS); }
export function record(id, stars) {
  const s = loadSave(); const g = s.games[id] || { stars: 0, plays: 0 };
  g.stars = Math.max(g.stars || 0, stars); g.last = stars; g.plays = (g.plays || 0) + 1; g.at = Date.now();
  if (stars >= 3) { const day = today(); g.days3 = g.days3 || []; if (!g.days3.includes(day)) g.days3.push(day); }   /* the days he got 3 stars (the champion gate counts them) */
  s.games[id] = g; writeSave(s);
  try { if (parent && parent !== window) parent.postMessage({ tl2game: 'k-kriyah/' + id, stars }, '*'); } catch (e) {}
  window.__saved = { id, stars };
}
export function nextGame(id) { const i = GAMES.findIndex(g => g.id === id); return GAMES.slice(i + 1).find(g => !g.bonus) || null; }

/* ---------------- voice ----------------
   Every letter sound plays the rebbe's recording when audio/sounds.json lists it; until then the computer voice says it
   (marked on screen as temporary). A line is an array of words and sounds: ['Beis says', S('b')]. */
export const S = k => ({ snd: k });
const FALLBACK = { b: 'buh', v: 'vuh', g: 'guh', d: 'duh', h: 'huh', z: 'zuh', t: 'tuh', y: 'yuh', k: 'kuh', l: 'luh', m: 'muh', n: 'nuh', s: 'suh', p: 'puh', f: 'fuh', tz: 'tsuh', r: 'ruh', sh: 'shh', ch: 'the sound at the start of challah' };   /* a computer can't say Ches: it names it until the rebbe's recording */          /* the computer can't say a lone sound well; the rebbe's recording replaces these */
let SOUNDS = {}; const audioCache = {};
export const soundsReady = fetch('audio/sounds.json').then(r => r.ok ? r.json() : {}).then(j => { SOUNDS = j || {}; }).catch(() => {});
export let lastLine = null; let sayToken = 0;
window.__lines = [];
function speak(t, rate = .85) {
  return new Promise(res => {
    const ms = Math.max(900, t.split(/\s+/).length * 400 + 250) * F;
    try { const u = new SpeechSynthesisUtterance(t); u.rate = rate; u.pitch = 1.1; u.lang = 'en-US'; speechSynthesis.speak(u); } catch (e) {}
    setTimeout(res, ms);
  });
}
function playSound(k) {
  if (SOUNDS[k]) return new Promise(res => {
    try { const a = audioCache[k] || (audioCache[k] = new Audio('audio/' + SOUNDS[k])); a.currentTime = 0; a.onended = () => res(); a.onerror = () => res(); a.play().catch(() => res()); setTimeout(res, 2500 * F); } catch (e) { res(); }
  });
  return speak(FALLBACK[k] || k, .7);
}
export async function say(line, keep = true) {
  const parts = Array.isArray(line) ? line : [line]; if (keep) lastLine = parts;
  const my = ++sayToken; try { speechSynthesis.cancel(); } catch (e) {}
  window.__lines.push(parts.map(p => typeof p === 'string' ? p : '[' + p.snd + ']').join(' '));
  for (const p of parts) { if (my !== sayToken && keep) break; if (typeof p === 'string') await speak(p); else await playSound(p.snd); }
}
export const again = () => lastLine && say(lastLine);

/* ---------------- little sounds ---------------- */
let actx;
export function tone(f, d = .15, type = 'sine', v = .15, at = 0) { try { actx = actx || new AudioContext(); const t = actx.currentTime + at, o = actx.createOscillator(), g = actx.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d); } catch (e) {} }
export const sfx = {
  chime: () => [660, 880, 1320].forEach((f, i) => tone(f, .25, 'sine', .15, i * .09)),
  sparkle: () => [1200, 1500, 1800, 2200, 2600].forEach((f, i) => tone(f, .14, 'sine', .05, i * .06)),
  boop: () => tone(200, .3, 'triangle', .12),
  whoosh: () => [300, 500, 800].forEach((f, i) => tone(f, .18, 'sine', .06, i * .04)),
  fanfare: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .32, 'triangle', .12, i * .12)),
  pop: () => tone(520, .08, 'sine', .12),
  drum: () => { tone(110, .18, 'sine', .3); tone(70, .22, 'triangle', .2); },
  tick: () => tone(900, .05, 'sine', .06),
};

/* ---------------- the page around the 3D (big candy buttons, no menus) ---------------- */
const ICON = {
  again: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="#2f6fe1"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#2f6fe1" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" stroke="#2f6fe1" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 10v9.5h5v-5h3v5h5V10" fill="#2f6fe1"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#fff" stroke-width="3.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  replay: '<svg viewBox="0 0 24 24"><path d="M12 5a7 7 0 1 1-6.6 4.7" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M3.5 4.5l1.8 5.4 5.4-1.8" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  yes: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  no: '<svg viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
};
export { ICON };
const CSS = `
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;height:100%;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;font-family:"Nunito","Varela Round",system-ui,sans-serif}
body{background:linear-gradient(#3fb4ff 0%,#8fd8ff 45%,#dff6ff 75%,#fff6d8 100%)}
#c{position:fixed;inset:0;width:100%;height:100%;display:block}
#gtitle{left:50%;top:14px;transform:translateX(-50%);max-width:calc(100% - 200px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:800;font-size:22px;color:#17324d;padding:6px 16px;border-radius:40px;background:#ffffffe0;box-shadow:0 4px 14px #0b3a6626;pointer-events:none}
#gtitle:empty{display:none}
body.titled #prog{top:64px}
body.calmbg::before{content:'';position:fixed;inset:0;pointer-events:none;backdrop-filter:saturate(.45) blur(6px);-webkit-backdrop-filter:saturate(.45) blur(6px)}
.ui{position:fixed;z-index:5}
.btn{width:76px;height:76px;border-radius:50%;border:none;cursor:pointer;display:grid;place-items:center;padding:0;
 background:radial-gradient(circle at 32% 28%,#ffffff 0 18%,#e8f3ff 40%,#b9d8f5 100%);
 box-shadow:inset 0 -6px 10px #7aa9d655,0 7px 0 #6f9dc8,0 14px 22px #0b3a6640;transition:transform .08s}
.btn:active{transform:translateY(5px);box-shadow:inset 0 -6px 10px #7aa9d655,0 2px 0 #6f9dc8,0 6px 10px #0b3a6640}
.btn svg{width:40px;height:40px;filter:drop-shadow(0 2px 0 #fff)}
#again{left:16px;top:16px}
#home{right:16px;top:16px}
#prog{left:50%;top:22px;transform:translateX(-50%);display:flex;gap:10px;padding:10px 14px;border-radius:40px;background:linear-gradient(#ffffffd0,#ffffff90);box-shadow:0 6px 18px #0b3a6626,inset 0 -3px 0 #0001}
#prog:empty{display:none}
#prog i{width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#d6e4f0);box-shadow:inset 0 -3px 4px #0002;transition:all .3s}
#prog i.on{background:radial-gradient(circle at 35% 30%,#fff9d0,#ffd02e 45%,#f0a000);box-shadow:inset 0 -3px 4px #b4730055,0 0 14px #ffd02e}
.green{background:radial-gradient(circle at 34% 26%,#d6ffe5 0 10%,#5be08f 35%,#1fa857 75%,#137a3e);
 box-shadow:inset 0 -10px 18px #0a5a2a88,inset 0 8px 14px #ffffff88,0 9px 0 #0f6a35,0 20px 30px #04331a55}
.green:active{box-shadow:inset 0 -10px 18px #0a5a2a88,inset 0 8px 14px #ffffff88,0 3px 0 #0f6a35,0 8px 14px #04331a55}
.orange{background:radial-gradient(circle at 34% 26%,#fff0d6 0 10%,#ffb45b 35%,#f07f12 75%,#b85a00);
 box-shadow:inset 0 -10px 18px #8a420088,inset 0 8px 14px #ffffff88,0 9px 0 #a65000,0 20px 30px #4a250055}
.orange:active{box-shadow:inset 0 -10px 18px #8a420088,inset 0 8px 14px #ffffff88,0 3px 0 #a65000,0 8px 14px #4a250055}
#start{left:50%;top:50%;transform:translate(-50%,-50%);width:190px;height:190px;animation:breathe 1.6s ease-in-out infinite}
#start:active{transform:translate(-50%,-50%) translateY(6px)}
#start svg{width:88px;height:88px;margin-left:12px;filter:drop-shadow(0 4px 2px #0a5a2a88)}
.endbar{left:50%;bottom:26px;transform:translateX(-50%);display:none;gap:26px;align-items:center}
.endbar.show{display:flex;animation:popc .45s}
.endbar .btn.big{width:120px;height:120px}.endbar .btn.big svg{width:62px;height:62px}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.07)}}
@keyframes popc{0%{transform:translateX(-50%) scale(.2)}70%{transform:translateX(-50%) scale(1.1)}100%{transform:translateX(-50%) scale(1)}}
@keyframes pop{0%{transform:scale(.2)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes bob{0%,100%{transform:translate(-30%,0) rotate(-12deg)}50%{transform:translate(-30%,-16px) rotate(-12deg)}}
.hand{position:fixed;width:96px;height:96px;pointer-events:none;z-index:8;display:none;filter:drop-shadow(0 6px 6px #0004);left:0;top:0}
.hand.bob{animation:bob 1s ease-in-out infinite}
.yay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:9}
.yay.show{display:flex}
.stars{display:flex;gap:20px;padding:20px 30px;border-radius:44px;background:linear-gradient(#ffffffe8,#ffffffb8);box-shadow:0 16px 40px #0b3a6640,inset 0 -4px 0 #0001}
.stars svg{width:126px;height:126px;animation:pop .5s backwards;filter:drop-shadow(0 6px 4px #b4730066)}
.stars svg:nth-child(2){animation-delay:.2s}.stars svg:nth-child(3){animation-delay:.4s}
body.played .note{display:none}.note{position:fixed;left:50%;bottom:4px;transform:translateX(-50%);font-size:11px;line-height:1.25;color:#234;background:#ffffffb0;padding:2px 10px;border-radius:10px;text-align:center;width:max-content;max-width:92vw;z-index:4;pointer-events:none}
#flat{position:fixed;inset:0;display:none;z-index:20;background:linear-gradient(#8fd8ff,#fff6d8);align-items:center;justify-content:center;flex-direction:column;gap:22px;padding:20px;text-align:center;color:#1d2b3a}
#flat .row{display:flex;gap:18px;direction:rtl;flex-wrap:wrap;justify-content:center}
#flat button{width:130px;height:150px;border-radius:30px;border:none;font-size:96px;line-height:1;font-family:"Noto Serif Hebrew","Times New Roman",serif;font-weight:800;color:#1f5fff;cursor:pointer;
 background:radial-gradient(circle at 32% 28%,#ffffff 0 18%,#e8f3ff 40%,#b9d8f5 100%);box-shadow:inset 0 -6px 10px #7aa9d655,0 7px 0 #6f9dc8,0 14px 22px #0b3a6640}
#flat p{font-size:15px;max-width:460px;margin:0;background:#ffffffc0;padding:8px 14px;border-radius:14px}
#rev{position:fixed;inset:0;display:none;z-index:8;background:radial-gradient(circle at 50% 45%,#ffffffee 0 38%,#eaf6ffd8 75%);align-items:center;justify-content:center;flex-direction:column;gap:26px;padding:20px}
#rev.show{display:flex}
#rev .row{display:flex;gap:22px;direction:rtl;flex-wrap:wrap;justify-content:center}
#rev button{width:150px;height:170px;border-radius:34px;border:none;font-size:110px;line-height:1;font-family:"Noto Serif Hebrew","Times New Roman",serif;font-weight:800;color:#1f5fff;cursor:pointer;
 background:radial-gradient(circle at 32% 28%,#ffffff 0 18%,#e8f3ff 40%,#b9d8f5 100%);box-shadow:inset 0 -6px 10px #7aa9d655,0 7px 0 #6f9dc8,0 14px 22px #0b3a6640;transition:transform .15s}
#rev button:active{transform:translateY(4px)}
#rev button.right{background:radial-gradient(circle at 32% 28%,#ffffff 0 18%,#eaffea 40%,#9fe0a6 100%);box-shadow:0 0 0 8px #7bd94a88,0 7px 0 #5fae62}
#rev button.wrong{animation:revshake .45s}
body[data-review] #again{z-index:10}
#rev button.right{animation:revpop .5s}
@keyframes revpop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
#rev .dots{display:flex;gap:14px}#rev .dots i{width:34px;height:34px;background:#d6e2ee;clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}#rev .dots i.on{background:#ffcf3a;animation:revstar .6s}
@keyframes revstar{0%{transform:scale(.4) rotate(-40deg)}60%{transform:scale(1.5) rotate(10deg)}100%{transform:scale(1) rotate(0)}}   /* a star fills for each right answer (reviewer: more fun) */
@keyframes revshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-12px)}75%{transform:translateX(12px)}}
@media (max-width:700px){#rev button{width:100px;height:120px;font-size:76px;border-radius:26px}#rev .row{gap:12px}}
@media (max-width:700px){#start{width:150px;height:150px}#start svg{width:70px;height:70px}.endbar .btn.big{width:100px;height:100px}.stars svg{width:80px;height:80px}.stars{gap:10px;padding:14px 18px}#prog{top:96px}#gtitle{font-size:16px;top:24px;padding:5px 12px;white-space:normal;text-align:center;line-height:1.15;width:max-content;max-width:calc(100% - 190px)}body.titled #prog{top:96px}#prog i{width:18px;height:18px}}
`;
const HAND = '<svg class="hand" id="hand" viewBox="0 0 64 64"><path d="M26 6c3 0 5 2 5 5v19l2-1c2-6 10-5 10 1l1-1c2-4 9-3 9 2v2c2-3 8-2 8 3v12c0 9-7 16-16 16h-6c-6 0-10-3-13-8L10 40c-2-4 2-8 6-5l5 5V11c0-3 2-5 5-5z" fill="#fff" stroke="#1d2b3a" stroke-width="3"/></svg>';
export function buildPage({ home = true } = {}) {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  document.body.insertAdjacentHTML('beforeend', `<canvas id="c"></canvas>
<button class="ui btn" id="again" aria-label="Hear it again">${ICON.again}</button>
${home ? `<button class="ui btn" id="home" aria-label="Back to the path">${ICON.home}</button>` : ''}
<div class="ui" id="gtitle"></div><div class="ui" id="prog"></div>
<button class="ui btn green" id="start" aria-label="Start" style="display:none">${ICON.play}</button>
<div class="ui endbar" id="endbar"></div>
${HAND}<div class="yay" id="yay"><div class="stars"></div></div>
<div id="flat"></div>
<div id="rev" aria-live="polite"><div class="dots"></div><div class="row"></div></div>
<div class="note">The letter sounds are the computer voice for now; the rebbe's own recording will replace them.</div>`);
  { const gm = GAMES.find(x => x.id === Q.get('g')); if (gm) { $('#gtitle').textContent = gm.name; document.body.classList.add('titled'); } }   /* the game's name is always on screen (K-CLARITY-RULES 13) */
  $('#again').onclick = () => { sfx.pop(); again(); };
  if (home) $('#home').onclick = () => goPath();
}
const keep = () => (FAST ? '&fast=1' : '') + (LITE ? '&lite=1' : '');
let curUnit = 1; export const setUnit = n => { curUnit = n; };
export function goPath(u = curUnit) { location.href = 'index.html?u=' + u + keep(); }
export function goGame(id) { location.href = 'play.html?g=' + id + keep(); }
export function setProgress(n, on) { const p = $('#prog'); if (p.children.length !== n) p.innerHTML = '<i></i>'.repeat(n); [...p.children].forEach((x, i) => x.classList.toggle('on', i < on)); }
export function waitStart() { const b = $('#start'); b.style.display = 'grid'; document.body.dataset.startReady = 1; return new Promise(r => { b.onclick = () => { b.style.display = 'none'; document.body.classList.add('played'); delete document.body.dataset.startReady; tone(1, .01); try { speechSynthesis.speak(new SpeechSynthesisUtterance(' ')); } catch (e) {} r(); }; }); }

/* the pointing hand used in every "Watch me" demo */
export const hand = {
  el: () => $('#hand'),
  at(x, y, bobbing = false) { const h = $('#hand'); h.style.left = x + 'px'; h.style.top = y + 'px'; h.style.display = 'block'; h.classList.toggle('bob', bobbing); },
  hide() { const h = $('#hand'); h.style.display = 'none'; h.classList.remove('bob'); },
};

/* ---------------- renderer, light and the living world ---------------- */
export let R, scene, cam, canvas, ENV = .55;
export let portrait = false;
const layoutFns = [], frameFns = [];
export const onLayout = fn => { layoutFns.push(fn); fn(portrait); };
export const onFrame = fn => frameFns.push(fn);
export const offFrame = fn => { const i = frameFns.indexOf(fn); if (i >= 0) frameFns.splice(i, 1); };
export const camBase = new THREE.Vector3(0, 2.6, 9.5), camTarget = new THREE.Vector3(0, 1.4, 0);
export let sway = 1;
export const setSway = v => { sway = v; };

export function hasWebGL() { try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } }
export function initRenderer() {
  canvas = $('#c');
  if (Q.has('noGL') || !hasWebGL()) throw new Error('no-webgl');
  R = new THREE.WebGLRenderer({ canvas, antialias: !LITE, alpha: true, preserveDrawingBuffer: FAST });
  R.setPixelRatio(LITE ? .2 : Math.min(devicePixelRatio, 1.75)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = .82;
  R.shadowMap.enabled = !LITE; R.shadowMap.type = LITE ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(R); scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  cam = new THREE.PerspectiveCamera(38, 1, .1, 200);
  scene.add(new THREE.HemisphereLight(0xcfeeff, 0x6fbf4a, .9));
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.4); sun.position.set(6, 10, 7); sun.castShadow = true; sun.shadow.mapSize.set(LITE ? 512 : 1024, LITE ? 512 : 1024);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.radius = 6; sun.shadow.bias = -.0005; scene.add(sun);
  addEventListener('resize', resize); resize();
  let t0 = performance.now(), frames = 0;
  const loop = now => {
    const t = (now - t0) / 1000; stepTweens(now); stepParticles();
    cam.position.set(camBase.x + Math.sin(t * .25) * .35 * sway, camBase.y + Math.sin(t * .33) * .12 * sway, camBase.z); cam.lookAt(camTarget);
    for (const f of frameFns.slice()) f(t);
    R.render(scene, cam); frames++; if (frames === 3) document.body.dataset.drawn = 1; requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
function resize() { const w = innerWidth, h = innerHeight; R.setSize(w, h, false); cam.aspect = w / h; portrait = w / h < .9; cam.fov = portrait ? 52 : 38; cam.updateProjectionMatrix(); layoutFns.forEach(f => f(portrait)); }
export function toScreen(v) { const p = v.clone().project(cam); return [(p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight]; }
export const worldPos = o => o.getWorldPosition(new THREE.Vector3());

/* materials and shapes */
export const M = (c, o = {}) => new THREE.MeshPhysicalMaterial(Object.assign({ color: c, roughness: .45, clearcoat: .35, clearcoatRoughness: .35, envMapIntensity: ENV }, o));
export function mesh(geo, mat, x = 0, y = 0, z = 0, cast = true) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; return m; }
export function rbox(w, h, d, r = .08) {
  const s = new THREE.Shape(), x = -w / 2 + r, y = -h / 2 + r; s.moveTo(-w / 2, -h / 2 + r); s.absarc(x, y, r, Math.PI, 1.5 * Math.PI); s.absarc(w / 2 - r, y, r, 1.5 * Math.PI, 2 * Math.PI); s.absarc(w / 2 - r, h / 2 - r, r, 0, .5 * Math.PI); s.absarc(x, h / 2 - r, r, .5 * Math.PI, Math.PI);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(.001, d - 2 * r), bevelEnabled: true, bevelSize: r, bevelThickness: r, bevelSegments: 3, curveSegments: 4 }); g.translate(0, 0, -(d - 2 * r) / 2); return g;
}
export function glowTex(col) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, col); g.addColorStop(.4, col + 'aa'); g.addColorStop(1, col + '00'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }
export function glowSprite(col = '#ffffff', size = 4, opacity = 0) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(col), transparent: true, depthWrite: false, opacity })); s.scale.set(size, size, 1); return s; }
function starTex() { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const x = cv.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, '#fff'); g.addColorStop(.25, '#fff6b0'); g.addColorStop(1, '#ffd02e00'); x.fillStyle = g; x.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 9 : 32; x.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } x.fill(); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }

export const world = { group: null, clouds: [] };
/* ---------------- painted backgrounds (made with ChatGPT; art/bg) ---------------- */
export const UNIT_BACKDROP = { 1: 'street', 2: 'zoo', 3: 'garden', 4: 'park', 5: 'picnic', 6: 'farm', 7: 'playroom', 9: 'kitchen' };   /* Unit 8 is the 3D shul (buildShul) */
export const KIND_BACKDROP = { mastery: 'classroom', bonus: 'beach', story: 'street', detective: 'street', hunt: null };   /* the sukkah hunt keeps its 3D world */
export const backdropFor = (game, unitN) => game && 'bg' in game ? game.bg : game && game.kind in KIND_BACKDROP ? KIND_BACKDROP[game.kind] : UNIT_BACKDROP[unitN || (game && game.unit) || 1] || null;
export let backdrop = null;
export function setBackdrop(name) { backdrop = name || null; document.body.style.background = name ? `radial-gradient(ellipse 70% 60% at 50% 58%, #ffffff40, #ffffff1a 70%, #ffffff10), ${CALM ? 'linear-gradient(#ffffffa8, #ffffffa8), ' : ''}url(art/bg/${name}.jpg) center 64% / cover no-repeat, #8fd8ff` : ''; document.body.classList.toggle('calmbg', !!name && CALM);   /* a soft light veil: the painting stays, the letter stands out (RESEARCH.md: few distractions) */ }
export function buildWorld({ trees = true, flowers = true, backdrop: bd = null, indoor = null } = {}) {
  const indoorWorld = indoor === 'shul';
  if (!bd && indoorWorld) return buildShul();   /* Unit 8: inside a festive shul on Simchas Torah */
  if (bd) {   /* a painted scene behind; only a see-through ground that catches shadows, so the children and letters stand in it */
    setBackdrop(bd); const w = new THREE.Group(); scene.add(w); world.group = w;
    const g = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: .28 })); g.rotation.x = -Math.PI / 2; g.receiveShadow = true; w.add(g); return w; }
  /* the outdoor world: green hills, a little village far away, a fence, many kinds of trees, bushes, rocks, flowers, butterflies, birds and clouds.
     Everything stays at the sides and the back, so the middle, where the letters are, stays clear. */
  const w = new THREE.Group(); scene.add(w); world.group = w;
  const grass = M(0x3fae2e, { roughness: .85, clearcoat: 0 }), grass2 = M(0x5cc23d, { roughness: .85, clearcoat: 0 }), grass3 = M(0x8fd46a, { roughness: .9, clearcoat: 0 });
  const g1 = mesh(new THREE.SphereGeometry(40, 64, 32), grass, 0, -39.95, -4, false); g1.scale.set(1, 1, .6); w.add(g1);
  w.add(mesh(new THREE.SphereGeometry(30, 48, 24), grass2, -14, -28.6, -20, false));
  w.add(mesh(new THREE.SphereGeometry(30, 48, 24), grass2, 16, -28.2, -24, false));
  w.add(mesh(new THREE.SphereGeometry(40, 48, 24), grass3, 0, -37.5, -42, false));   /* the far hill */
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  if (!LITE && !CALM) {   /* calm (K-CLARITY 10): plain hills, a few round trees and the sky; no village, fence, rocks or tufts */
    /* a little village on the far hills */
    const walls = [0xffd7a8, 0xbfe3ff, 0xffe6f0, 0xfff3b0, 0xd9f2d0], roofs = [0xe8322b, 0x2f7de1, 0xff8a1e, 0x9b5de5, 0x2dbb6a];
    [[-13, 1.1, -19], [-9.5, 1.2, -21], [10.5, 1.0, -21], [13.5, 1.2, -19.5], [16.5, .9, -22]].forEach(([x, y, z], i) => { const h = new THREE.Group();
      h.add(mesh(rbox(1.2, .9, 1, .05), M(walls[i]), 0, .45, 0, false)); const r = mesh(new THREE.ConeGeometry(.95, .7, 4), M(roofs[i], { roughness: .4 }), 0, 1.25, 0, false); r.rotation.y = Math.PI / 4; h.add(r);
      h.add(mesh(new THREE.BoxGeometry(.25, .3, .02), M(0x9fd8ff, { roughness: .1 }), .25, .55, .51, false)); h.add(mesh(new THREE.BoxGeometry(.22, .42, .02), M(0x8a5a3c), -.25, .21, .51, false));
      h.position.set(x, y, z); h.rotation.y = (x > 0 ? -.3 : .3); h.scale.setScalar(1.3); w.add(h); });
    /* a white picket fence along the back, with a gap in the middle */
    const pick = M(0xffffff, { roughness: .5 });
    [[-10, -3.2], [3.2, 10]].forEach(([a, b]) => { for (let x = a; x <= b; x += .42) { const p = mesh(new THREE.BoxGeometry(.14, .7, .05), pick, x, .35, -6.5, false); w.add(p); const t = mesh(new THREE.ConeGeometry(.1, .14, 4), pick, x, .77, -6.5, false); t.rotation.y = Math.PI / 4; w.add(t); }
      [.22, .5].forEach(y => w.add(mesh(new THREE.BoxGeometry(b - a + .2, .07, .04), pick, (a + b) / 2, y, -6.53, false))); });
    /* rocks and grass tufts at the sides */
    const rockM = M(0xa8adb5, { roughness: .8, clearcoat: 0 }), tuftM = M(0x2f9b3e, { roughness: .8, clearcoat: 0 });
    for (let k = 0; k < 10; k++) { const sd = k % 2 ? 1 : -1, x = sd * (5 + rnd() * 4), z = -2 + rnd() * 5; const r = mesh(new THREE.SphereGeometry(.18 + rnd() * .15, 10, 8), rockM, x, .05, z); r.scale.set(1.3, .6, 1); w.add(r); }
    for (let k = 0; k < 30; k++) { const sd = k % 2 ? 1 : -1, x = sd * (3.5 + rnd() * 6), z = -1 + rnd() * 5.5; const t = new THREE.Group(); for (let j = 0; j < 4; j++) { const c = mesh(new THREE.ConeGeometry(.035, .22 + rnd() * .1, 4), tuftM, (j - 1.5) * .04, .1, 0, false); c.rotation.z = (j - 1.5) * .25; t.add(c); } t.position.set(x, 0, z); w.add(t); }
    /* butterflies flutter at the sides; birds fly across the sky */
    const wingCols = [0xff7aa8, 0x46c3ff, 0xff9f1a, 0xb388ff];
    if (!CALM) for (let k = 0; k < 4; k++) { const bf = new THREE.Group(), wm = new THREE.MeshStandardMaterial({ color: wingCols[k], side: THREE.DoubleSide, roughness: .4 }); const wg = [-1, 1].map(s => { const g = new THREE.Group(); const p = mesh(new THREE.CircleGeometry(.12, 12), wm, s * .1, 0, 0, false); p.scale.set(1, 1.3, 1); g.add(p); bf.add(g); return g; });
      bf.add(mesh(new THREE.CapsuleGeometry(.02, .12, 4, 8), M(0x3a2a1a), 0, 0, 0, false)); const sd = k % 2 ? 1 : -1, cx = sd * (5.5 + k * .6), cz = -1 + k, ph = k * 1.7; w.add(bf);
      onFrame(t => { const a = t * .5 + ph; bf.position.set(cx + Math.sin(a) * 1.2, 1.2 + Math.sin(a * 2.3) * .4, cz + Math.cos(a) * .8); bf.rotation.y = -a; wg[0].rotation.y = Math.sin(t * 18 + ph) * 1.1; wg[1].rotation.y = -Math.sin(t * 18 + ph) * 1.1; }); }
    const birdM = M(0x34405a, { roughness: .5 });
    if (!CALM) for (let k = 0; k < 3; k++) { const bd = new THREE.Group(); [-1, 1].forEach(s => { const wgt = mesh(new THREE.BoxGeometry(.4, .04, .08), birdM, s * .18, 0, 0, false); wgt.rotation.z = s * .4; bd.add(wgt); }); w.add(bd);
      onFrame(t => { const x = ((t * .6 + k * 9) % 44) - 22; bd.position.set(x, 7.5 + k * .8 + Math.sin(t * 2 + k) * .2, -16 - k * 2); bd.children.forEach((c, i) => c.rotation.z = (i ? 1 : -1) * (.2 + Math.sin(t * 8 + k) * .35)); }); }
  }
  if (trees) { tree(-6.5, -3, 1.3); tree(6.8, -3.5, 1.5); tree(-9, -7, 1.6); tree(9.5, -8, 1.8);
    if (!LITE && !CALM) { pine(-11.5, -5, 1.6); pine(12, -5.5, 1.8); pine(-4.5, -9, 1.4); pine(5.2, -10, 1.5); bush(-5.2, -1.2, 1); bush(5.6, -1.6, 1.1); bush(-8.2, .5, 1.2); bush(8.4, .3, 1); } }
  if (flowers && !CALM) { const cols = [0xff6fa5, 0xffffff, 0xb388ff, 0xff8a3d];
    for (let k = 0; k < 26; k++) { const x = (rnd() - .5) * 16, z = 3.3 + rnd() * 1.2; if (Math.abs(x) < 1.2) continue; const f = new THREE.Group();
      f.add(mesh(new THREE.CylinderGeometry(.02, .02, .25, 5), M(0x2f8f3a), 0, .12, 0, false));
      const lf = mesh(new THREE.SphereGeometry(.06, 8, 6), M(0x3fae4a), .05, .08, 0, false); lf.scale.set(1.4, .5, .8); f.add(lf);
      const pm = M(cols[k % 4], { roughness: .35 }); for (let j = 0; j < 5; j++) { const a = j * Math.PI * 2 / 5, p = mesh(new THREE.SphereGeometry(.055, 10, 8), pm, Math.cos(a) * .065, .29 + Math.sin(a) * .065, 0, false); p.scale.set(1, 1, .5); f.add(p); }
      f.add(mesh(new THREE.SphereGeometry(.04, 10, 8), M(0xff9f1a, { roughness: .4 }), 0, .29, .02, false)); f.position.set(x, 0, z); f.rotation.y = (rnd() - .5) * .6; w.add(f); } }   /* five petals and a middle */
  const sunBall = mesh(new THREE.SphereGeometry(1.6, 32, 20), new THREE.MeshBasicMaterial({ color: 0xffe066 }), 9, 9, -25, false); w.add(sunBall);
  const halo = glowSprite('#fff3a0', 9, .9); halo.position.copy(sunBall.position); w.add(halo); world.sun = new THREE.Group(); w.add(world.sun); world.sun.add(sunBall, halo);   /* a game can hide the sky's sun (Unit 10's sun-clock) */
  const cm = M(0xffffff, { roughness: .9, clearcoat: 0, emissive: 0xffffff, emissiveIntensity: .15 });
  for (let k = 0; k < 5; k++) { const c = new THREE.Group(); [[0, 0, 0, 1], [.9, -.1, .1, .75], [-.9, -.15, 0, .7], [.4, .5, 0, .7], [-.35, .4, .1, .6]].forEach(([a, b, d, r]) => c.add(mesh(new THREE.SphereGeometry(r, 18, 12), cm, a, b, d, false)));
    c.position.set(-16 + k * 8, 6 + (k * 37 % 10) / 4, -14 - (k * 53 % 6)); c.scale.setScalar(.8 + (k % 3) * .25); w.add(c); world.clouds.push(c); }
  if (!CALM) onFrame(() => world.clouds.forEach((c, i) => { c.position.x += .004 + i * .001; if (c.position.x > 22) c.position.x = -22; }));
  return w;
}
/* Unit 8's world: a bright, warm shul on Simchas Torah (made in code, original art).
   A cream back wall with tall arched windows full of daylight, the aron kodesh with a blue velvet curtain (no writing or symbols),
   shelves of seforim (plain coloured spines), wooden benches, two warm hanging lamps and strings of little Simchas Torah flags.
   Everything stays at the sides and high at the back, so the middle, where the letters are, stays clear and light. */
export function buildShul() {
  const w = new THREE.Group(); scene.add(w); world.group = w;
  document.body.style.background = 'linear-gradient(#fff4dc,#ffe9c2)';
  const wood = M(0xb9784a, { roughness: .55 }), woodL = M(0xd9a066, { roughness: .55 }), cream = M(0xfff3dc, { roughness: .8, clearcoat: 0 }), gold = M(0xf2c14e, { metalness: .55, roughness: .3, clearcoat: .8 });
  const floor = mesh(new THREE.PlaneGeometry(60, 40), M(0xd6a46b, { roughness: .6, clearcoat: .3 }), 0, 0, 0, false); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; w.add(floor);
  if (!LITE) for (let i = -14; i <= 14; i++) w.add(mesh(new THREE.BoxGeometry(.03, .005, 40), M(0xbf8c55, { roughness: .7 }), i * .9, .003, 0, false));   /* floor boards */
  const runner = mesh(new THREE.PlaneGeometry(3.2, 30), M(0xc94b4b, { roughness: .85, clearcoat: 0 }), 0, .01, -1, false); runner.rotation.x = -Math.PI / 2; runner.receiveShadow = true; w.add(runner);   /* a red carpet up the middle */
  [-1.5, 1.5].forEach(x => { const t = mesh(new THREE.PlaneGeometry(.12, 30), gold, x, .012, -1, false); t.rotation.x = -Math.PI / 2; w.add(t); });
  w.add(mesh(new THREE.BoxGeometry(40, 14, .4), cream, 0, 7, -7.2, false));   /* the back wall */
  w.add(mesh(new THREE.BoxGeometry(40, 1.3, .3), wood, 0, .65, -6.9, false)); w.add(mesh(new THREE.BoxGeometry(40, .12, .4), woodL, 0, 1.35, -6.85, false));
  [-1, 1].forEach(sd => { const sw = mesh(new THREE.BoxGeometry(.4, 14, 30), cream, sd * 15, 7, 6, false); w.add(sw); });
  /* tall arched windows, full of soft daylight */
  const sky = new THREE.MeshBasicMaterial({ color: 0xd8f0ff }), frameM = M(0xffffff, { roughness: .4 });
  const win = (x, y, wd, h) => { const g = new THREE.Group(); const sh = new THREE.Shape(); sh.moveTo(-wd / 2, 0); sh.lineTo(wd / 2, 0); sh.lineTo(wd / 2, h - wd / 2); sh.absarc(0, h - wd / 2, wd / 2, 0, Math.PI); sh.lineTo(-wd / 2, 0);
    const fr = mesh(new THREE.ShapeGeometry(sh), frameM, 0, 0, 0, false); fr.scale.set(1.12, 1.06, 1); fr.position.set(0, -.12, -.01); g.add(fr); g.add(mesh(new THREE.ShapeGeometry(sh), sky, 0, 0, 0, false));
    g.add(mesh(new THREE.BoxGeometry(.08, h, .04), frameM, 0, h / 2, .02, false)); g.add(mesh(new THREE.BoxGeometry(wd, .08, .04), frameM, 0, h * .45, .02, false));
    const gl = glowSprite('#ffffff', wd * 2.6, .35); gl.position.set(0, h * .55, .3); g.add(gl); g.position.set(x, y, -6.98); w.add(g); };
  win(-8.5, 3.2, 1.6, 3.6); win(8.5, 3.2, 1.6, 3.6); win(-3.2, 5.6, 1.3, 2.6); win(3.2, 5.6, 1.3, 2.6);
  /* a round window high in the middle, like the morning sun coming in */
  { const r = mesh(new THREE.CircleGeometry(.9, 40), sky, 0, 7.3, -6.97, false); w.add(r); const rf = mesh(new THREE.TorusGeometry(.92, .1, 10, 40), frameM, 0, 7.3, -6.95, false); w.add(rf); const gl = glowSprite('#fff6d0', 4, .4); gl.position.set(0, 7.3, -6.6); w.add(gl); }
  /* the aron kodesh: a wooden ark on two steps, a blue velvet curtain with a gold border, and the ner tamid above it */
  const aron = new THREE.Group(); w.add(aron); aron.position.set(-5.6, 0, -6.2);
  aron.add(mesh(rbox(3.4, .25, 1.4, .04), woodL, 0, .12, .3)); aron.add(mesh(rbox(3.0, .25, 1.1, .04), woodL, 0, .37, .2));
  aron.add(mesh(rbox(2.6, 3.4, .7, .08), wood, 0, 2.2, 0)); const cap = mesh(rbox(2.9, .35, .85, .06), wood, 0, 4.05, 0); aron.add(cap);
  const arch = new THREE.Shape(); arch.moveTo(-1.45, 0); arch.lineTo(1.45, 0); arch.quadraticCurveTo(0, .9, -1.45, 0); aron.add(mesh(new THREE.ExtrudeGeometry(arch, { depth: .7, bevelEnabled: false }), wood, 0, 4.2, -.35));
  aron.add(mesh(rbox(2.15, 3.0, .12, .05), gold, 0, 2.15, .36)); const curtain = mesh(rbox(2.0, 2.85, .14, .05), M(0x2b47a8, { roughness: .75, clearcoat: .1, sheen: 1, sheenColor: new THREE.Color(0x8fb0ff) }), 0, 2.15, .4); aron.add(curtain);
  for (let i = 0; i < 6; i++) aron.add(mesh(new THREE.BoxGeometry(.012, 2.8, .02), M(0x1f3888, { roughness: .9 }), -.85 + i * .34, 2.15, .48, false));   /* soft folds */
  aron.add(mesh(new THREE.BoxGeometry(2.0, .12, .05), gold, 0, .78, .49, false)); aron.add(mesh(new THREE.BoxGeometry(2.0, .08, .05), gold, 0, 3.5, .49, false));
  const ner = new THREE.Group(); ner.add(mesh(new THREE.CylinderGeometry(.16, .1, .26, 16), gold)); ner.add(mesh(new THREE.SphereGeometry(.09, 12, 10), new THREE.MeshStandardMaterial({ color: 0xff7a3a, emissive: 0xff4a1a, emissiveIntensity: 1.4 }), 0, -.05, .1, false));
  ner.add(mesh(new THREE.CylinderGeometry(.01, .01, .8, 6), gold, 0, .5, 0, false)); const ng = glowSprite('#ffb070', 1.3, .7); ner.add(ng); ner.position.set(0, 5.4, .4); aron.add(ner);
  /* shelves of seforim (plain coloured spines, no writing) */
  const shelf = new THREE.Group(); w.add(shelf); shelf.position.set(5.8, 0, -6.6);
  shelf.add(mesh(rbox(3.0, 3.6, .6, .06), wood, 0, 1.8, 0)); const bookCols = [0x7a1f2b, 0x1f3c88, 0x2d6a3e, 0x5a2d82, 0x8a5a2b, 0x20335a];
  for (let r = 0; r < 3; r++) { shelf.add(mesh(new THREE.BoxGeometry(2.7, .06, .5), woodL, 0, .55 + r * 1.05, .1, false)); let x = -1.25; let k = r * 3;
    while (x < 1.2) { const bw = .12 + ((k * 37) % 5) * .02, bh = .6 + ((k * 53) % 4) * .07; shelf.add(mesh(new THREE.BoxGeometry(bw, bh, .38), M(bookCols[k % 6], { roughness: .5 }), x + bw / 2, .58 + r * 1.05 + bh / 2, .12, false));
      if (!LITE) shelf.add(mesh(new THREE.BoxGeometry(bw + .005, .03, .385), gold, x + bw / 2, .58 + r * 1.05 + bh * .8, .12, false)); x += bw + .02; k++; } }
  /* wooden benches at the sides */
  const bench = (x, z, ry) => { const b = new THREE.Group(); b.add(mesh(rbox(2.6, .12, .55, .04), woodL, 0, .5, 0)); b.add(mesh(rbox(2.6, .6, .1, .04), wood, 0, .85, -.25)); [-1.1, 1.1].forEach(lx => b.add(mesh(new THREE.BoxGeometry(.1, .5, .5), wood, lx, .25, 0)));
    b.position.set(x, 0, z); b.rotation.y = ry; w.add(b); };
  bench(-7.6, -2.4, .25); bench(7.6, -2.4, -.25); bench(-8.4, .6, .35); bench(8.4, .6, -.35);
  /* two warm hanging lamps */
  [[-3.4, 5.4, -3.5], [3.4, 5.4, -3.5]].forEach(([x, y, z]) => { const l = new THREE.Group(); l.add(mesh(new THREE.CylinderGeometry(.015, .015, 3, 6), gold, 0, 1.6, 0, false));
    l.add(mesh(new THREE.SphereGeometry(.32, 20, 14), new THREE.MeshStandardMaterial({ color: 0xfff1c8, emissive: 0xffd98a, emissiveIntensity: 1 }), 0, 0, 0, false)); l.add(mesh(new THREE.CylinderGeometry(.18, .26, .14, 16), gold, 0, .3, 0, false));
    const g = glowSprite('#ffe3a0', 2.2, .55); l.add(g); l.position.set(x, y, z); w.add(l); });
  /* strings of little Simchas Torah flags (plain colours, no writing), gently swaying */
  const flagCols = [0xe8322b, 0xffcf3a, 0x2f7de1, 0x2dbb6a, 0xff7aa8, 0xff9f1a, 0x9b5de5];
  const strings = [];
  [[-9, 6.2, 0, 5.0, -5.6], [0, 5.0, 9, 6.2, -5.6], [-9, 7.4, 9, 7.4, -6.6]].forEach(([x0, y0, x1, y1, z], si) => { const st = new THREE.Group(); w.add(st); const n = 14;
    const pts = []; for (let i = 0; i <= n; i++) { const t = i / n; pts.push(new THREE.Vector3(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * .7, z)); }
    st.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, .012, 5), M(0xffffff), 0, 0, 0, false));
    for (let i = 1; i < n; i++) { const tri = new THREE.Shape(); tri.moveTo(-.17, 0); tri.lineTo(.17, 0); tri.lineTo(0, -.38); tri.closePath();
      const f = mesh(new THREE.ShapeGeometry(tri), new THREE.MeshStandardMaterial({ color: flagCols[(i + si * 3) % 7], side: THREE.DoubleSide, roughness: .6 }), pts[i].x, pts[i].y, z + .02, false); st.add(f); strings.push({ f, ph: i * .7 + si }); } });
  if (!CALM) onFrame(t => strings.forEach(({ f, ph }) => { f.rotation.x = Math.sin(t * 1.4 + ph) * .25; }));
  /* soft dust of light drifting in the window light (something always moves gently) */
  if (!LITE && !CALM) { const motes = []; const mm = new THREE.SpriteMaterial({ map: glowTex('#fff6d0'), transparent: true, depthWrite: false, opacity: .5 });
    for (let i = 0; i < 14; i++) { const sp = new THREE.Sprite(mm); sp.scale.setScalar(.12); sp.position.set((i % 2 ? 1 : -1) * (5 + (i * 7) % 4), 1 + (i * 13) % 5, -4 + (i * 5) % 4); w.add(sp); motes.push(sp); }
    onFrame(t => motes.forEach((m, i) => { m.position.y = 1 + ((t * .15 + i * .37) % 1) * 5; m.position.x += Math.sin(t + i) * .002; })); }
  return w;
}
/* a pine tree and a round bush with berries, for a fuller world */
export function pine(x, z, s = 1, parent) { const t = new THREE.Group(); t.add(mesh(new THREE.CylinderGeometry(.1, .14, .6, 8), M(0x7a4a2a), 0, .3, 0));
  const nm = M(0x237a3b, { roughness: .6 }); [[.75, .9, .55], [.6, .8, 1.05], [.45, .7, 1.5]].forEach(([r, h, y]) => t.add(mesh(new THREE.ConeGeometry(r, h, 12), nm, 0, y, 0)));
  t.position.set(x, 0, z); t.scale.setScalar(s); (parent || world.group || scene).add(t); return t; }
export function bush(x, z, s = 1, parent) { const t = new THREE.Group(), lm = M(0x2f9b3e, { roughness: .6 }); [[0, .3, 0, .42], [.35, .25, .05, .32], [-.35, .25, 0, .33], [0, .55, -.05, .3]].forEach(([a, b, c, r]) => t.add(mesh(new THREE.SphereGeometry(r, 16, 12), lm, a, b, c)));
  const bm = M(0xe8322b, { roughness: .3, clearcoat: .8 }); if (!CALM) [[.2, .55, .28], [-.18, .4, .35], [.4, .3, .25], [-.42, .35, .2], [.05, .72, .2]].forEach(([a, b, c]) => t.add(mesh(new THREE.SphereGeometry(.045, 8, 6), bm, a, b, c, false)));
  t.position.set(x, 0, z); t.scale.setScalar(s); (parent || world.group || scene).add(t); return t; }
export function tree(x, z, s = 1, parent) { const t = new THREE.Group(); t.add(mesh(new THREE.CylinderGeometry(.12, .18, 1, 10), M(0x8a5a3c), 0, .5, 0));
  const leaf = M(0x3fae4a, { roughness: .6 }); [[0, 1.35, 0, .62], [.32, 1.1, .1, .45], [-.32, 1.12, 0, .46], [0, 1.75, 0, .42]].forEach(([a, b, c, r]) => t.add(mesh(new THREE.SphereGeometry(r, 20, 14), leaf, a, b, c)));
  t.position.set(x, 0, z); t.scale.setScalar(s); (parent || world.group || scene).add(t); return t; }

/* ---------------- buildings ---------------- */
export function house({ lit = true, wall = 0xffa552, roof = 0xe8322b, bushes = true } = {}) {
  const h = new THREE.Group();
  const roofM = M(roof, { roughness: .35, clearcoat: .6 }), white = M(0xffffff, { roughness: .3 });
  h.add(mesh(rbox(2.4, 1.9, 2, .1), M(wall), 0, .95, 0));
  const tri = new THREE.Shape(); tri.moveTo(-1.55, 0); tri.lineTo(1.55, 0); tri.lineTo(0, 1.25); tri.closePath();
  const rg = new THREE.ExtrudeGeometry(tri, { depth: 2.3, bevelEnabled: true, bevelSize: .08, bevelThickness: .08, bevelSegments: 3 }); rg.translate(0, 0, -1.15);
  h.add(mesh(rg, roofM, 0, 1.9, 0));
  h.add(mesh(new THREE.BoxGeometry(.38, .7, .38), M(0xc0473f), .7, 2.5, -.2));
  h.add(mesh(rbox(.62, 1.08, .14, .06), M(0x8a5a3c, { roughness: .6 }), -.58, .56, 1.02));
  h.add(mesh(new THREE.SphereGeometry(.05, 12, 10), M(0xffd43b, { metalness: .8, roughness: .2 }), -.39, .56, 1.11));
  const mez = mesh(new THREE.BoxGeometry(.07, .26, .07), M(0xd9a520, { metalness: .7, roughness: .25 }), -.17, .95, 1.06); mez.rotation.z = -.35; h.add(mez);   /* the mezuzah */
  h.add(mesh(rbox(.86, .82, .12, .06), white, .45, 1.12, 1.02));
  const glass = mesh(new THREE.BoxGeometry(.66, .62, .06), new THREE.MeshStandardMaterial({ color: 0xfff1a8, emissive: 0xffd36a, emissiveIntensity: .9 }), .45, 1.12, 1.07, false);
  const dark = M(0x3d5f8f, { roughness: .15, clearcoat: 1 }); const litM = glass.material; glass.material = lit ? litM : dark; h.add(glass);
  if (bushes && !CALM) [[-1.35, .28, 1.05], [1.35, .3, 1.0]].forEach(([x, y, z]) => { h.add(mesh(new THREE.SphereGeometry(.34, 18, 12), M(0x3fae4a, { roughness: .6 }), x, y, z)); h.add(mesh(new THREE.SphereGeometry(.07, 10, 8), M(0xff6fa5), x + .12, y + .26, z + .22)); });
  h.userData = { window: new THREE.Vector3(.45, 1.12, 1.1), setLit: v => { glass.material = v ? litM : dark; } };
  return h;
}

/* ---------------- people as painted picture cards (HoS 2026-11-26: the 3D people looked scary to young children) ----------------
   Rabbi Khaver's cartoon pictures (art/obj/<name>-<pose>.webp, cut out of white). A card stands on the ground facing the boy;
   the game's moods pick the pose: calm and walk = stand, wave = wave, cheer = cheer, think = think (a grown-up without a
   cheer or think picture waves or stands). The card keeps the 3D person's handles (armR, head ...) so every game works the same.
   If a picture can't load, the friendly 3D person is used instead. */
const CARD_POSES = { mendy: 4, shloimy: 4, ari: 4, dovid: 4, eli: 4, avi: 4, tzvi: 4, yaakov: 4, rebbe: 4, tatty: 2, mommy: 2, bubby: 2, zeidy: 2 };
const cardTex = {}; let texLoader = null;
function cardTexture(file) { texLoader = texLoader || new THREE.TextureLoader();
  if (!cardTex[file]) cardTex[file] = new Promise(res => texLoader.load('art/obj/' + file + '.webp', t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; res(t); }, undefined, () => res(null)));
  return cardTex[file]; }
export function pictureCard(name, fallback, height = 1.78) {
  const b = new THREE.Group(), n = CARD_POSES[name] || 2;
  const pose = m => m === 'wave' ? 'wave' : m === 'cheer' ? (n > 2 ? 'cheer' : 'wave') : m === 'think' ? (n > 2 ? 'think' : 'stand') : 'stand';
  const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: .08, depthWrite: true, side: THREE.DoubleSide, toneMapped: false });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat); plane.visible = false; plane.renderOrder = 1; b.add(plane);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(.36, 28), new THREE.MeshBasicMaterial({ color: 0x1d2b3a, transparent: true, opacity: .18, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, .01, .05); shadow.scale.set(1, .45, 1); b.add(shadow);
  const dummy = () => { const o = new THREE.Object3D(); b.add(o); return o; };
  b.userData = { armR: dummy(), armL: dummy(), head: dummy(), legL: dummy(), legR: dummy(), eyes: [], mood: 'calm', card: true, name };
  let shown = null, fell = false;
  async function show(m) { const want = name + '-' + pose(m); if (want === shown) return; shown = want; const t = await cardTexture(want);
    if (shown !== want) return;
    if (!t) { if (!fell && fallback) { fell = true; plane.visible = false; shadow.visible = false; const p = fallback(); b.add(p); b.userData = Object.assign(p.userData, { card: false }); b.mood = p.mood; } return; }
    const a = t.image.width / t.image.height; mat.map = t; mat.needsUpdate = true;
    plane.scale.set(height * a, height, 1); plane.position.set(0, height / 2, 0); plane.visible = true; }
  b.mood = m => { b.userData.mood = m; show(m); };
  onFrame(t => { if (!b.visible || !plane.visible) return; const m = b.userData.mood;
    plane.position.y = height / 2 + (m === 'cheer' ? Math.abs(Math.sin(t * 7)) * .12 : m === 'walk' ? Math.abs(Math.sin(t * 9)) * .05 : 0);   /* a little hop for joy, a bob for walking */
    plane.rotation.z = m === 'think' ? Math.sin(t * 1.5) * .03 : 0; });
  show('calm');
  return b;
}

/* ---------------- people (round, friendly, modest; kippah and tzitzis) ---------------- */
export function person({ skin = 0xffd2ad, shirt = 0xffffff, pants = 0x26324a, kippah = 0x1f3c88, hair = 0x6b4423, beard = null, hat = false, jacket = null, tzitzis = true, woman = false, dress = 0x7b4fa0, eye = 0x5a3a1e } = {}) {
  /* a friendly toy-style person: real eyes (white, colour, shine), eyebrows, ears, nose, hair, collar, buttons, hands with thumbs and shoes */
  const b = new THREE.Group();
  const skinM = M(skin, { roughness: .5, clearcoat: .2 }), nose = M(new THREE.Color(skin).multiplyScalar(.93).getHex(), { roughness: .5 }), shirtM = M(shirt, { roughness: .55 }), pantsM = M(pants, { roughness: .6 }),
    shoeM = M(0x2b2420, { roughness: .3, clearcoat: .7 }), dark = M(0x1d2b3a, { roughness: .2, clearcoat: 1 }), hairM = M(hair, { roughness: .75, clearcoat: .1 }), white = M(0xffffff, { roughness: .25, clearcoat: .6 });
  if (woman) { tzitzis = false; shirt = dress; }
  const topM = jacket != null ? M(jacket, { roughness: .55 }) : woman ? M(dress, { roughness: .6 }) : shirtM;
  /* legs and shoes */
  const leg = x => { const g = new THREE.Group(); g.position.set(x, 0, 0); g.add(mesh(new THREE.CapsuleGeometry(.1, .3, 6, 12), pantsM, 0, .28, 0)); const sh = mesh(new THREE.SphereGeometry(.12, 18, 12), shoeM, 0, .06, .05); sh.scale.set(1, .62, 1.45); g.add(sh); b.add(g); return g; };
  const legL = leg(-.12), legR = leg(.12);
  if (woman) { legL.visible = legR.visible = false; b.add(mesh(new THREE.CylinderGeometry(.24, .43, .95, 28), M(dress, { roughness: .6 }), 0, .48, 0));   /* a long, modest dress */
    b.add(mesh(new THREE.TorusGeometry(.425, .025, 8, 32), M(new THREE.Color(dress).multiplyScalar(.8).getHex(), { roughness: .5 }), 0, .04, 0)).children.at(-1).rotation.x = Math.PI / 2;
    [-.12, .12].forEach(x => { const sh = mesh(new THREE.SphereGeometry(.1, 14, 10), shoeM, x, .04, .33); sh.scale.set(1, .55, 1.2); b.add(sh); }); }
  else { b.add(mesh(new THREE.CylinderGeometry(.295, .27, .36, 28), pantsM, 0, .42, 0)); b.add(mesh(new THREE.CylinderGeometry(.3, .3, .06, 28), M(new THREE.Color(pants).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, .6, 0)); }   /* trousers up to the waist, and a belt */
  /* body: shirt or jacket, collar, buttons */
  b.add(mesh(new THREE.CapsuleGeometry(.27, .36, 8, 18), topM, 0, .72, 0));
  if (jacket != null) { b.add(mesh(new THREE.BoxGeometry(.13, .42, .05), shirtM, 0, .8, .25, false)); [-1, 1].forEach(s => { const l = mesh(new THREE.BoxGeometry(.09, .3, .03), M(new THREE.Color(jacket).multiplyScalar(.75).getHex()), s * .1, .86, .265, false); l.rotation.z = s * .35; b.add(l); }); }
  if (!woman) { [-1, 1].forEach(s => { const c = mesh(new THREE.BoxGeometry(.13, .07, .03), shirtM, s * .07, 1.0, .235, false); c.rotation.z = s * -.5; b.add(c); });   /* the collar */
    if (jacket == null) [.88, .74, .6].forEach(y => b.add(mesh(new THREE.SphereGeometry(.018, 8, 6), M(0xd8dde6, { roughness: .3 }), 0, y, .272, false))); }
  if (tzitzis) [-.2, .2].forEach(x => { for (let k = 0; k < 4; k++) b.add(mesh(new THREE.CylinderGeometry(.008, .008, .3, 4), white, x + (k - 1.5) * .018, .36, .24, false)); b.add(mesh(new THREE.SphereGeometry(.022, 8, 6), white, x, .52, .24, false)); });   /* tzitzis: four strings and a knot */
  b.add(mesh(new THREE.CylinderGeometry(.09, .1, .12, 14), skinM, 0, 1.05, 0));   /* the neck */
  /* arms with hands (a palm and a thumb) */
  const arm = s => { const a = new THREE.Group(); a.position.set(s * .32, .9, 0); a.add(mesh(new THREE.CapsuleGeometry(.075, .3, 6, 10), topM, 0, -.17, 0));
    a.add(mesh(new THREE.CylinderGeometry(.08, .082, .05, 12), jacket != null ? shirtM : topM, 0, -.33, 0, false));   /* the cuff */
    const palm = mesh(new THREE.SphereGeometry(.08, 14, 10), skinM, 0, -.41, 0); palm.scale.set(.95, 1.1, .7); a.add(palm);
    const th = mesh(new THREE.CapsuleGeometry(.025, .05, 4, 8), skinM, s * -.06, -.39, .04, false); th.rotation.z = s * .6; a.add(th);
    a.rotation.z = s * .2; b.add(a); return a; };
  const armL = arm(-1), armR = arm(1);
  /* the head */
  const head = new THREE.Group(); head.position.set(0, 1.32, 0); b.add(head);
  const skull = mesh(new THREE.SphereGeometry(.34, 36, 28), skinM); skull.scale.set(1, .98, .96); head.add(skull);
  [-1, 1].forEach(s => { const e = mesh(new THREE.SphereGeometry(.07, 14, 10), skinM, s * .325, -.02, 0); e.scale.set(.5, 1, .8); head.add(e); });   /* ears */
  const ns = mesh(new THREE.SphereGeometry(.042, 14, 10), nose, 0, -.03, .33, false); ns.scale.set(1.1, .9, .9); head.add(ns);
  /* kind cartoon eyes (HoS 2026-11-26: the people looked scary): big, tall eyes set low and close, a large iris that fills the eye
     (only a thin edge of white, so they never stare), two soft shines, eyebrows lifted, and a wide warm smile */
  const eyes = [], cheekM = M(0xff8f8f, { transparent: true, opacity: .42 });
  [-.11, .11].forEach(x => { const e = new THREE.Group(); e.position.set(x, .0, .29); const sc = mesh(new THREE.SphereGeometry(.078, 20, 16), white, 0, 0, 0, false); sc.scale.set(.9, 1.18, .5); e.add(sc);
    const ir = mesh(new THREE.SphereGeometry(.07, 20, 16), M(eye, { roughness: .35, clearcoat: .6 }), 0, -.006, .016, false); ir.scale.set(.9, 1.12, .62); e.add(ir);
    const pu = mesh(new THREE.SphereGeometry(.042, 16, 12), dark, 0, -.01, .04, false); pu.scale.set(.95, 1.1, .6); e.add(pu);
    const shine = M(0xffffff, { roughness: 1, clearcoat: 0, emissive: 0xffffff, emissiveIntensity: .6 }); [[-.024, .03, .018], [.022, -.034, .009]].forEach(([sx, sy, r]) => { const h = mesh(new THREE.CircleGeometry(r, 14), shine, sx, sy, .065, false); e.add(h); });   /* two shines */
    head.add(e); eyes.push(e);
    const br = mesh(new THREE.TorusGeometry(.055, .012, 6, 14, Math.PI * .7), beard ? M(beard) : hairM, x, .145, .3, false); br.rotation.z = Math.PI * .15; head.add(br);   /* soft, lifted eyebrows */
    const ck = mesh(new THREE.SphereGeometry(.058, 12, 10), cheekM, x * 1.6, beard ? -.06 : -.085, beard ? .27 : .258, false); ck.scale.set(1, .7, .5); head.add(ck); });   /* rosy cheeks */
  const sm = mesh(new THREE.TorusGeometry(.09, .02, 8, 22, Math.PI), M(0xb5454a, { roughness: .4 }), 0, -.11, .3, false); sm.rotation.z = Math.PI; head.add(sm);   /* a wide, warm smile */
  const tongue = mesh(new THREE.SphereGeometry(.07, 16, 8, 0, Math.PI * 2, Math.PI * .5, Math.PI * .5), M(0xc7525a, { roughness: .5 }), 0, -.115, .292, false); tongue.scale.set(1.1, .62, .4); head.add(tongue);   /* an open, happy mouth */
  ns.position.y = -.07; ns.scale.set(.9, .75, .8);
  if (!beard && !woman) { head.scale.setScalar(1.1); head.position.y = 1.35; }   /* a child's head is a little bigger: rounder and softer */
  /* hair */
  if (woman) { const h = mesh(new THREE.SphereGeometry(.375, 30, 20, 0, Math.PI * 2, 0, Math.PI * .5), hairM, 0, .1, -.04); h.scale.set(1.05, 1.05, 1.02); head.add(h);
    head.add(mesh(new THREE.CapsuleGeometry(.21, .22, 6, 14), hairM, 0, -.2, -.15)); [-1, 1].forEach(sd => head.add(mesh(new THREE.CapsuleGeometry(.1, .3, 6, 12), hairM, sd * .31, -.14, -.02)));
    const bang = mesh(new THREE.SphereGeometry(.3, 24, 12, 0, Math.PI * 2, 0, Math.PI * .28), hairM, 0, .1, .07); bang.rotation.x = .55; head.add(bang); }   /* a neat, shoulder-length sheitel */
  else { const cap = mesh(new THREE.SphereGeometry(.355, 30, 20, 0, Math.PI * 2, 0, Math.PI * .5), hairM, 0, .03, -.05); cap.rotation.x = -.62; head.add(cap);   /* short hair */
    [-.1, 0, .1].forEach((x, i) => { const t = mesh(new THREE.SphereGeometry(.075, 12, 8), hairM, x, .27 - Math.abs(x) * .3, .17); t.scale.set(1.2, .55, .8); head.add(t); });   /* the fringe */
    if (!beard) [-1, 1].forEach(s => { [0, 1].forEach(k => { const p = mesh(new THREE.TorusGeometry(.04, .018, 8, 16, Math.PI * 1.8), hairM, s * .315, -.1 - k * .07, .07, false); p.rotation.y = s * Math.PI / 2; p.rotation.x = k * .6; head.add(p); }); }); }   /* curly peyos */
  if (hat) { head.add(mesh(new THREE.CylinderGeometry(.47, .47, .03, 32), dark, 0, .22, 0)); head.add(mesh(new THREE.CylinderGeometry(.27, .3, .3, 28), dark, 0, .37, 0)); head.add(mesh(new THREE.CylinderGeometry(.302, .302, .05, 28), M(0x0d1420), 0, .25, 0)); }
  else if (!woman) { const k = mesh(new THREE.SphereGeometry(.25, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2.4), M(kippah, { roughness: .45, clearcoat: .4 }), 0, .21, -.04); k.rotation.x = -.25; head.add(k); }
  if (beard) { const bm = M(beard, { roughness: .85, clearcoat: 0 }); const bd = mesh(new THREE.SphereGeometry(.3, 26, 18, 0, Math.PI * 2, Math.PI * .6, Math.PI * .4), bm, 0, -.02, .07); bd.scale.set(1.0, 1.5, 1); head.add(bd);
    const mu = mesh(new THREE.CapsuleGeometry(.028, .13, 4, 10), bm, 0, -.115, .315, false); mu.rotation.z = Math.PI / 2; head.add(mu); sm.position.set(0, -.175, .372); sm.scale.set(.7, .55, .6); sm.material = M(0xd4636a, { roughness: .4 }); tongue.visible = false; }   /* a small smile under the moustache */
  b.userData = { armR, armL, head, eyes, legL, legR, mood: 'calm', blinkAt: 2 + Math.random() * 3 };
  onFrame(t => { const u = b.userData; if (!b.visible) return;
    if (t > u.blinkAt) { u.eyes.forEach(e => e.scale.y = .1); if (t > u.blinkAt + .12) { u.eyes.forEach(e => e.scale.y = 1); u.blinkAt = t + 2.5 + Math.random() * 3; } }
    if (u.mood === 'wave') u.armR.rotation.z = 2.6 + Math.sin(t * 8) * .4;
    else if (u.mood === 'cheer') { u.armR.rotation.z = 2.7 + Math.sin(t * 10) * .2; u.armL.rotation.z = -2.7 - Math.sin(t * 10) * .2; }
    else if (u.mood === 'think') { u.armR.rotation.z = 2.2; u.armR.rotation.x = -.6; u.head.rotation.z = Math.sin(t * 1.5) * .12 + .12; }
    else if (u.mood === 'walk') { u.legL.position.z = Math.sin(t * 9) * .08; u.legR.position.z = -Math.sin(t * 9) * .08; u.armL.rotation.x = Math.sin(t * 9) * .4; u.armR.rotation.x = -Math.sin(t * 9) * .4; }
    else u.head.rotation.y = Math.sin(t * .8 + b.id) * .08;   /* a little life when calm */
    if (u.mood !== 'think') { u.head.rotation.z *= .9; }
  });
  b.mood = m => { const u = b.userData; u.mood = m; if (m !== 'wave' && m !== 'cheer' && m !== 'think') { u.armR.rotation.set(0, 0, .2); u.armL.rotation.set(0, 0, -.2); } if (m !== 'walk') { u.legL.position.z = u.legR.position.z = 0; } if (m !== 'think') u.armR.rotation.x = 0; };
  return b;
}
export const mendy = () => pictureCard('mendy', () => person({ kippah: 0x1f3c88 }));
export const tatty = () => { const p = pictureCard('tatty', () => person({ beard: 0x6b4423, hat: true, jacket: 0x2c4a7a, pants: 0x26324a, hair: 0x6b4423 }));   /* navy jacket and brown beard: not the rebbe */ p.scale.setScalar(1.45); return p; };
export const rebbe = () => { const p = pictureCard('rebbe', () => person({ beard: 0x8a8a8a, hat: true, jacket: 0x1d2433, pants: 0x1d2433, hair: 0x8a8a8a, skin: 0xf6c9a2 })); p.scale.setScalar(1.5); return p; };
export const mommy = () => { const p = pictureCard('mommy', () => person({ woman: true, hair: 0x5a3a22, dress: 0x3f5fa8, shirt: 0x3f5fa8 }));   /* long sleeves in the dress colour */ p.scale.setScalar(1.35); return p; };
export const ari = () => pictureCard('ari', () => person({ kippah: 0xd97706, hair: 0x3b2a1a }));
export const shloimy = () => pictureCard('shloimy', () => person({ kippah: 0x2e8b57, hair: 0x8a5a3c }));
export const avi = () => pictureCard('avi', () => person({ kippah: 0x2f7de1, hair: 0x5a3a22, shirt: 0xeaffea }));
export const zeidy = () => { const p = pictureCard('zeidy', () => person({ beard: 0xf2f2f2, hat: true, jacket: 0x1d2433, pants: 0x1d2433, hair: 0xe0e0e0, skin: 0xf6c9a2 })); p.scale.setScalar(1.45); return p; };
export const tzvi = () => pictureCard('tzvi', () => person({ kippah: 0x8e44ad, hair: 0x2b1d12, shirt: 0xe8f0ff }));
export const eli = () => pictureCard('eli', () => person({ kippah: 0x1f7a8c, hair: 0x7a4a24, shirt: 0xfff4e0 }));
export const bubby = () => { const p = pictureCard('bubby', () => person({ woman: true, hair: 0xb8a48c, dress: 0x6b4f8a, shirt: 0x6b4f8a, skin: 0xf6cfae })); p.scale.setScalar(1.3); return p; };   /* a light sheitel and a long dress */
export const dovid = () => pictureCard('dovid', () => person({ kippah: 0x6a3fa0, hair: 0x2b1d12, shirt: 0xeaf4ff }));
/* each unit's own boy: Mendy, Shloimy, Ari, Dovid */
export const unitBoy = n => ({ 2: shloimy, 3: ari, 4: dovid, 5: eli, 6: avi, 7: tzvi, 9: shloimy }[n] || mendy)();
export const yaakov = () => pictureCard('yaakov', () => person({ kippah: 0xc0392b, hair: 0xb5532a, shirt: 0xfff7e0, skin: 0xffdcc2 }));

/* a little jump, used for joy */
export function hop(o, h = .5, ms = 450) { const y0 = o.position.y; o.userData.hopping = (o.userData.hopping || 0) + 1; return tween(ms, k => { o.position.y = y0 + Math.sin(k * Math.PI) * h; }, ease.out).then(() => { o.position.y = y0; o.userData.hopping--; }); }   /* a game's own bobbing leaves a hopping thing alone */
export function shake(o, amt = .2, ms = 450) { const x0 = o.position.x; return tween(ms, k => { o.position.x = x0 + Math.sin(k * Math.PI * 5) * amt * (1 - k); }).then(() => { o.position.x = x0; }); }

/* ---------------- 3D letters, from the real font outline ---------------- */
const geoCache = {};
const FACE = { blue: [0x1f5fff, 0x1236a8], grey: [0x9aa7b8, 0x6c7888], green: [0x16b45a, 0x0e7a3c], orange: [0xff8a1e, 0xc15d00] };
const faceMats = {};
/* a soft shade on a letter's face: lighter at the top, deeper at the bottom, like a glossy candy toy */
function shadeTopDown(m) { m.onBeforeCompile = sh => {
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vLy;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLy = position.y;');
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vLy;').replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= mix(.78, 1.22, smoothstep(-34., 34., vLy));'); }; return m; }
function letterMats(color) { if (!faceMats[color]) { const [f, s] = FACE[color] || FACE.blue;
  faceMats[color] = [shadeTopDown(new THREE.MeshPhysicalMaterial({ color: f, roughness: .2, metalness: .05, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: .8 })), new THREE.MeshPhysicalMaterial({ color: s, roughness: .25, metalness: .05, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: .7 })]; } return faceMats[color]; }
function letterGeo(ch) {
  if (!geoCache[ch]) { const d = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${OUTLINES[ch].d}"/></svg>`);
    const shapes = d.paths.flatMap(p => SVGLoader.createShapes(p));
    const g = new THREE.ExtrudeGeometry(shapes, { depth: CALM ? 6 : 14, bevelEnabled: true, bevelThickness: CALM ? 2 : 3, bevelSize: CALM ? 1.6 : 2.2, bevelSegments: LITE ? 1 : 5, curveSegments: LITE ? 3 : 10 });   /* the quick test run uses plainer letters */ g.computeBoundingBox();
    const c = new THREE.Vector3(); g.boundingBox.getCenter(c); g.translate(-c.x, -c.y, -c.z); g.computeBoundingBox(); geoCache[ch] = { g, c }; }
  return geoCache[ch];
}
export const goldDot = () => new THREE.MeshPhysicalMaterial({ color: 0xffc21a, roughness: .15, metalness: .35, clearcoat: 1, emissive: 0x6a4200, emissiveIntensity: .25 });
const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
/* key: 'alef' | 'beis' | 'veis'.  Beis and Veis share one shape; Beis has the dagesh (Mendy's dot: "someone home"). */
export const LETTERS = { alef: { ch: 'א', name: 'Alef', quiet: true }, beis: { ch: 'ב', name: 'Beis', dagesh: true, snd: 'b' }, veis: { ch: 'ב', name: 'Veis', snd: 'v' },
  gimmel: { ch: 'ג', name: 'Gimmel', snd: 'g' }, daled: { ch: 'ד', name: 'Daled', snd: 'd' }, hei: { ch: 'ה', name: 'Hei', snd: 'h' },
  vov: { ch: 'ו', name: 'Vov', snd: 'v' }, zayin: { ch: 'ז', name: 'Zayin', snd: 'z' }, ches: { ch: 'ח', name: 'Ches', snd: 'ch' },
  tes: { ch: 'ט', name: 'Tes', snd: 't' }, yud: { ch: 'י', name: 'Yud', snd: 'y' }, kaf: { ch: 'כ', name: 'Kaf', dagesh: true, snd: 'k' }, chaf: { ch: 'כ', name: 'Chaf', snd: 'ch' },
  lamed: { ch: 'ל', name: 'Lamed', snd: 'l' }, mem: { ch: 'מ', name: 'Mem', snd: 'm' }, nun: { ch: 'נ', name: 'Nun', snd: 'n' },
  samech: { ch: 'ס', name: 'Samech', snd: 's' }, ayin: { ch: 'ע', name: 'Ayin', quiet: true }, pei: { ch: 'פ', name: 'Pei', dagesh: true, snd: 'p' }, fei: { ch: 'פ', name: 'Fei', snd: 'f' },
  tzadik: { ch: 'צ', name: 'Tzadik', snd: 'tz' }, kuf: { ch: 'ק', name: 'Kuf', snd: 'k' }, reish: { ch: 'ר', name: 'Reish', snd: 'r' },
  shin: { ch: 'ש', name: 'Shin', snd: 'sh', top: 'right' }, sin: { ch: 'ש', name: 'Sin', snd: 's', top: 'left' }, tav: { ch: 'ת', name: 'Tuf', dagesh: true, snd: 't' }, sav: { ch: 'ת', name: 'Suf', snd: 's' },
  chafsofis: { ch: 'ך', name: 'Chaf Sofis', snd: 'ch', partner: 'chaf' }, memsofis: { ch: 'ם', name: 'Mem Sofis', snd: 'm', partner: 'mem' }, nunsofis: { ch: 'ן', name: 'Nun Sofis', snd: 'n', partner: 'nun' },
  feisofis: { ch: 'ף', name: 'Fei Sofis', snd: 'f', partner: 'fei' }, tzadiksofis: { ch: 'ץ', name: 'Tzadik Sofis', snd: 'tz', partner: 'tzadik' } };   /* the final letters (Unit 9): each says the same sound as its partner, and comes only at the end of a word */   /* Shin and Sin: the dot on top, right or left; Tuf has the dagesh, Suf has none (ת without a dot says s) */
/* a quiet letter (Alef, Ayin) has no sound of its own; 'an' or 'a' before a letter's name */
export const quiet = k => !!LETTERS[k].quiet;
export const an = k => (/^[AEIOU]/.test(LETTERS[k].name) ? 'an ' : 'a ') + LETTERS[k].name;
export const FLAT = { alef: '\u05D0', beis: '\u05D1\u05BC', veis: '\u05D1', gimmel: '\u05D2', daled: '\u05D3', hei: '\u05D4', vov: '\u05D5', zayin: '\u05D6', ches: '\u05D7', tes: '\u05D8', yud: '\u05D9', kaf: '\u05DB\u05BC', chaf: '\u05DB', lamed: '\u05DC', mem: '\u05DE', nun: '\u05E0', samech: '\u05E1', ayin: '\u05E2', pei: '\u05E4\u05BC', fei: '\u05E4', tzadik: '\u05E6', kuf: '\u05E7', reish: '\u05E8', shin: '\u05E9\u05C1', sin: '\u05E9\u05C2', tav: '\u05EA\u05BC', sav: '\u05EA', chafsofis: '\u05DA', memsofis: '\u05DD', nunsofis: '\u05DF', feisofis: '\u05E3', tzadiksofis: '\u05E5' };
/* letters that can hold a dagesh: where the dot sits (Beis/Veis, Kaf/Chaf share one shape each) */
/* the full letter height in font units (baseline to the top of the roof's little tag), and its middle */
const REF_H = 64.7, REF_CY = 32.35;
const DOT_AT = { 'ב': [24, 29.6], 'כ': [22, 29.6], 'פ': [38, 30], 'ת': [34, 24] };
/* Shin's dot sits on top of its right head, Sin's on top of its left head (font units) */
export const TOP_DOT = { right: [66, 71.5], left: [11.5, 71.5] };
const dotAt = key => LETTERS[key].top ? TOP_DOT[LETTERS[key].top] : DOT_AT[LETTERS[key].ch];
export const sameShape = (a, b) => LETTERS[a].ch === LETTERS[b].ch;
/* a letter's place in the Alef-Beis (for putting things in order, right to left) */
export const AB = k => Object.keys(LETTERS).indexOf(k);
export function letter(key, height = 2.6, color = 'blue') {
  const L = LETTERS[key], { g: geo, c } = letterGeo(L.ch); const bb = geo.boundingBox, W = bb.max.x - bb.min.x, s = height / REF_H, oy = (c.y - REF_CY) * s;   /* every letter on the same lines: Yud stays small, up at the top */
  const grp = new THREE.Group(), m = new THREE.Mesh(geo, letterMats(color)); m.castShadow = true; m.receiveShadow = true; m.scale.setScalar(s); m.position.y = oy; grp.add(m);
  const Hs = (bb.max.y - bb.min.y) * s, hit = new THREE.Mesh(new THREE.BoxGeometry(Math.max(W * s, height * .45) * 1.15, Math.max(Hs, height * .45) * 1.15, height * .5), hitMat); hit.position.y = oy; hit.castShadow = false; grp.add(hit);
  let dot = null;
  const dp = dotAt(key);
  if (dp) {   /* the dagesh sits in the middle of the letter's open space (font units /10: Beis x 24, y 29.6 of 56.1 x 64.7) */
    dot = mesh(new THREE.SphereGeometry(Math.max(.2 * height / 2.6, .075), 32, 24), goldDot(), (dp[0] - c.x) * s, (dp[1] - REF_CY) * s, CALM ? (5 / REF_H) * height + Math.max(.2 * height / 2.6, .075) * .35 : .42 * height / 2.6); grp.add(dot); dot.visible = !!(L.dagesh || L.top); }
  const below = Math.max(0, -(bb.min.y + c.y) - 4) * s;   /* how far a long leg (Kuf) reaches below the line: stands and cars lift it by this much */
  grp.userData = { key, body: m, dot, hit, height, width: W * s, color, below, dotHome: dot ? dot.position.clone() : null };
  grp.setKey = k => { grp.userData.key = k; if (dot) { const d = dotAt(k); if (LETTERS[k].top) { grp.userData.dotHome.set((d[0] - c.x) * s, (d[1] - REF_CY) * s, dot.position.z); } dot.visible = !!(LETTERS[k].dagesh || LETTERS[k].top); dot.scale.setScalar(1); dot.position.copy(grp.userData.dotHome); } };   /* Shin to Sin: the dot moves to the other head */
  grp.setColor = col => { m.material = letterMats(col); grp.userData.color = col; };
  return grp;
}
/* the outline as 2D points in the letter's own space (for Feel the Shape) */
export function fontToLocal(key, height, x, y) { const L = LETTERS[key], { g, c } = letterGeo(L.ch); const s = height / REF_H; return new THREE.Vector3((x / 10 - c.x) * s, (y / 10 - REF_CY) * s, 0); }
export const nameLine = key => quiet(key) ? [LETTERS[key].name + '. ' + LETTERS[key].name + ' is quiet.'] : [LETTERS[key].name + ' says', S(LETTERS[key].snd)];

/* a green tick: the calm "done" mark above a letter (not gold, not round, so it can't look like the dot) */
export function tick3d(r = .22) { const sh = new THREE.Shape(); sh.moveTo(-r, 0); sh.lineTo(-r * .35, -r * .65); sh.lineTo(r, r * .7); sh.lineTo(r * .78, r * .9); sh.lineTo(-r * .35, -r * .25); sh.lineTo(-r * .8, .2 * r); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: r * .15, bevelEnabled: false }); g.center(); return mesh(g, new THREE.MeshStandardMaterial({ color: 0x1fae5a, emissive: 0x0d6b33, emissiveIntensity: .3, roughness: .4 }), 0, 0, 0, false); }
/* a glossy gold 3D star (used as a "done" mark above a letter, never below it, so it can't look like a nekudah) */
export function star3d(r = .22) { const sh = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? sh.lineTo(x, y) : sh.moveTo(x, y); } sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: r * .25, bevelEnabled: true, bevelThickness: r * .12, bevelSize: r * .1, bevelSegments: 3 }); g.center(); return mesh(g, goldDot(), 0, 0, 0, false); }
/* an orange arrow that points at the part to notice, without covering it (never round, so it can't look like a dot).
   dir: 'down' (points down at a crown or roof), 'right' (points right at a leg or gap), 'left' or 'up' */
export function arrow3d(size = .35, dir = 'down') {
  const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: 0xff5a1f, emissive: 0xff3d00, emissiveIntensity: .9 });
  const shaft = mesh(new THREE.CylinderGeometry(size * .12, size * .12, size * .7, 10), m, 0, size * .55, 0, false), head = mesh(new THREE.ConeGeometry(size * .3, size * .45, 16), m, 0, size * .05, 0, false);
  head.rotation.x = Math.PI; const inner = new THREE.Group(); inner.add(shaft, head); g.add(inner);
  g.userData.inner = inner; g.visible = false;
  g.setDir = d => { g.userData.dir = d; inner.rotation.z = { down: 0, up: Math.PI, right: Math.PI / 2, left: -Math.PI / 2 }[d] || 0; }; g.setDir(dir);   /* the cone's tip is at the group's origin, so it touches the place it points at */
  onFrame(t => { if (g.visible) { const w = Math.sin(t * 6) * size * .15; inner.position.set(...({ down: [0, w, 0], up: [0, -w, 0], right: [-w, 0, 0], left: [w, 0, 0] }[g.userData.dir] || [0, 0, 0])); } });
  return g;
}
/* where to look on each letter (font units) and which way the arrow points at it */
export const FEATURES = { gimmel: [360, 110, 'left'], daled: [150, 250, 'right'], hei: [135, 375, 'left'], vov: [235, 560, 'down'], zayin: [250, 560, 'down'], ches: [205, 440, 'left'],
  beis: [530, 70, 'left'], kaf: [450, 35, 'left'], tes: [470, 610, 'down'], yud: [150, 610, 'down'],
  lamed: [90, 820, 'down'], mem: [130, 55, 'right'], nun: [310, 50, 'left'],
  reish: [445, 540, 'left'], kuf: [70, -60, 'right'], tzadik: [470, 560, 'left'], tav: [45, 90, 'right'], sav: [45, 90, 'right'], shin: [660, 745, 'down'], sin: [115, 745, 'down'], memsofis: [70, 45, 'right'], nunsofis: [225, -170, 'left'], chafsofis: [450, -170, 'left'], feisofis: [505, -170, 'left'], tzadiksofis: [175, -170, 'left'] };   /* the final letters: Mem Sofis's square corner, the others' long leg */   /* Tuf and Suf: the little foot at the bottom left; Shin and Sin: the dot on top */   /* Tzadik: its little arm up on the right */   /* Reish: round on top; Kuf: its long leg */   /* Lamed: its tall neck; Mem: the opening at the bottom; Nun: its flat bottom */
/* a place to look that depends on the look-alike beside it: Tes's closed round bottom (beside Mem) */
const PAIR_FEAT = { 'tes|mem': [60, 70, 'right'], 'kaf|pei': false, 'pei|kaf': [190, 300, 'right'], 'daled|reish': [420, 500, 'left'], 'hei|kuf': [60, 150, 'right'], 'ayin|tzadik': [60, 30, 'right'], 'ches|tav': [105, 60, 'right'], 'ches|sav': [105, 60, 'right'], 'tav|ches': [45, 90, 'right'], 'tav|hei': [45, 90, 'right'], 'sav|ches': [45, 90, 'right'], 'sav|hei': [45, 90, 'right'], 'samech|memsofis': [290, -40, 'up'], 'vov|nunsofis': [255, 30, 'left'], 'reish|chafsofis': [455, 30, 'left'] };   /* Samech round at the bottom; Vov and Reish stop at the line */   /* Ches beside Tuf: the bottom of its leg, where Tuf has a foot */   /* Ayin's tail at the bottom left; Tzadik is flat there */   /* Daled's corner beside Reish's round top; Hei's short leg beside Kuf's long one */   /* Pei: an arrow at its little tongue. Kaf beside Pei gets no arrow: its dot sits where Pei's tongue is, so the words say it */   /* Tes: its curl on top; Yud: the little head */   /* Beis's tail sticks out at the bottom; Kaf's bottom is round */
/* the dot place, for Beis/Veis and Kaf/Chaf (an arrow from the open side) */
/* the place to look on k when it might be taken for other: the dot place for a dot pair or any lone dotted letter, the shape for Beis/Kaf */
export const featFor = (k, other) => sameShape(k, other) ? DOT_FEATURE[k] : (k + '|' + other) in PAIR_FEAT ? PAIR_FEAT[k + '|' + other] : (((k === 'beis' && other === 'kaf') || (k === 'kaf' && other === 'beis')) ? FEATURES[k] : (DOT_FEATURE[k] || FEATURES[k]));
export const DOT_FEATURE = { beis: [240, 296, 'right'], veis: [240, 296, 'right'], kaf: [220, 296, 'right'], chaf: [220, 296, 'right'], pei: [385, 300, 'left'], fei: [385, 300, 'left'], tav: [340, 240, 'right'], sav: [340, 240, 'right'], shin: [660, 745, 'down'], sin: [115, 745, 'down'] };
/* put an arrow at a letter's feature (the letter object, its height); returns false if the letter has none */
export function pointAt(arrow, l, key, height, feat) { const f = feat === false ? null : feat || FEATURES[key]; if (!f) { arrow.visible = false; return false; }   /* false: nothing to point at (Kaf beside Pei: its tongue's place holds its dot, so the words say it) */ const p = fontToLocal(key, height, f[0], f[1]), off = height * .2;
  const d = { down: [0, off], up: [0, -off], right: [-off, 0], left: [off, 0] }[f[2]]; if (arrow.setDir) arrow.setDir(f[2]); arrow.position.set(p.x + d[0], p.y + d[1], .5); if (arrow.parent !== l) l.add(arrow); arrow.visible = true; return true; }
/* a soft ring that circles the thing to notice */
export function noticeRing(r = .42) { const ring = mesh(new THREE.TorusGeometry(r, CALM ? .03 : .06, 16, 40), new THREE.MeshStandardMaterial({ color: CALM ? 0xff2d8a : 0xff8a00, emissive: CALM ? 0xff2d8a : 0xff8a00, emissiveIntensity: 1.2 }), 0, 0, .7, false); ring.visible = false; onFrame(t => { if (ring.visible) ring.scale.setScalar(1 + Math.sin(t * 10) * .08); }); return ring; }

/* ---------------- sparkles and confetti ---------------- */
let sparkTex; const sparks = [], confs = []; let confGeo; const confCols = [0xff5d8f, 0xffc21a, 0x2dbb6a, 0x2f7de1, 0x9b5de5, 0x00c2d1];
export function sparkle(pos, n = 18, spread = 1) { sparkTex = sparkTex || starTex(); if (CALM) { n = Math.min(n, 8); spread = Math.min(spread, .7); }   /* calm: a few small sparkles, never a cloud over the letter */ for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.position.copy(pos); const v = new THREE.Vector3((Math.random() - .5), (Math.random() - .2), (Math.random() - .5)).normalize().multiplyScalar(.03 + Math.random() * .06 * spread); s.userData = { v, life: 50 + Math.random() * 30 }; s.scale.setScalar(.12 + Math.random() * .16); scene.add(s); sparks.push(s); } }
export function confetti(pos, n = 60) { confGeo = confGeo || new THREE.PlaneGeometry(.12, .07); for (let i = 0; i < n; i++) { const m = new THREE.Mesh(confGeo, new THREE.MeshStandardMaterial({ color: confCols[i % 6], side: THREE.DoubleSide, roughness: .4, metalness: .3 }));
  m.position.copy(pos); m.userData = { v: new THREE.Vector3((Math.random() - .5) * .16, .08 + Math.random() * .14, (Math.random() - .5) * .1), r: new THREE.Vector3(Math.random() * .3, Math.random() * .3, Math.random() * .3), life: 80 }; scene.add(m); confs.push(m); } }
function stepParticles() {
  for (let i = sparks.length - 1; i >= 0; i--) { const s = sparks[i]; s.position.add(s.userData.v); s.userData.v.multiplyScalar(.96); s.material.opacity = Math.min(1, s.userData.life / 25); s.material.rotation += .05; if (--s.userData.life <= 0) { scene.remove(s); s.material.dispose(); sparks.splice(i, 1); } }
  for (let i = confs.length - 1; i >= 0; i--) { const c = confs[i]; c.position.add(c.userData.v); c.userData.v.y -= .004; c.userData.v.x *= .99; c.rotation.x += c.userData.r.x; c.rotation.y += c.userData.r.y; if (--c.userData.life <= 0) { scene.remove(c); c.material.dispose(); confs.splice(i, 1); } }
}
/* joy: chime, sparkles, confetti (well under 2 seconds) */
export function joy(pos, big = false) { sfx.chime(); if (CALM) { sparkle(pos.clone().add(new THREE.Vector3(0, .85, .4)), big ? 8 : 5, .5); return; } sparkle(pos, big ? 14 : 8, 1.2); confetti(pos, big ? 45 : 22); }   /* short and light, so his eyes come back to the letter */

/* ---------------- tweens ---------------- */
const tweens = []; export const ease = { lin: t => t, out: t => 1 - Math.pow(1 - t, 3), inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, back: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };
export function tween(ms, fn, e = ease.inOut) { return new Promise(res => tweens.push({ t0: performance.now(), ms: Math.max(1, ms * F), fn, e, res })); }
function stepTweens(now) { for (let i = tweens.length - 1; i >= 0; i--) { const w = tweens[i]; const t = Math.min(1, (now - w.t0) / w.ms); w.fn(w.e(t)); if (t >= 1) { tweens.splice(i, 1); w.res(); } } }
export const popIn = (o, s = 1, ms = 450) => { o.visible = true; o.scale.setScalar(.01); return tween(ms, k => o.scale.setScalar(Math.max(.01, k * s)), ease.back); };
export const popOut = (o, ms = 350) => { const s0 = o.scale.x; return tween(ms, k => o.scale.setScalar(Math.max(.01, s0 * (1 - k)))).then(() => { o.visible = false; o.scale.setScalar(s0); }); };

/* ---------------- touch: tapping and dragging 3D things ---------------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
export function setRay(e) { ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam); return ray; }
const shown = o => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
/* which of these groups is under the finger (nearest first) */
export function pickFrom(e, groups) { setRay(e); const hits = ray.intersectObjects(groups.filter(shown), true); for (const h of hits) { if (!shown(h.object)) continue; let o = h.object; while (o && groups.indexOf(o) < 0) o = o.parent; if (o) return o; } return null; }
export function planePoint(e, z) { setRay(e); const p = new THREE.Vector3(); return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), -z), p) ? p : null; }
const handlers = { down: [], move: [], up: [] };
export const onPointer = (kind, fn) => handlers[kind].push(fn);
export function initPointer() {
  canvas.addEventListener('pointerdown', e => { try { canvas.setPointerCapture(e.pointerId); } catch (x) {} handlers.down.forEach(f => f(e)); });
  canvas.addEventListener('pointermove', e => handlers.move.forEach(f => f(e)));
  const up = e => handlers.up.forEach(f => f(e)); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
}
/* wait for a tap on one of these groups */
export function waitTap(groups) { return new Promise(res => { const f = e => { const o = pickFrom(e, groups); if (o) { const i = handlers.down.indexOf(f); if (i >= 0) handlers.down.splice(i, 1); res(o); } }; handlers.down.push(f); }); }

/* ---------------- the end of a game: stars, then next / play again ---------------- */
const starSvg = (k, on) => `<svg viewBox="0 0 24 24"><defs><radialGradient id="sg${k}" cx=".35" cy=".3"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#ffd02e"/><stop offset="1" stop-color="#e89a00"/></radialGradient></defs><path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z" fill="${on ? `url(#sg${k})` : '#dde6ee'}" stroke="${on ? '#c98400' : '#c3cfda'}" stroke-width=".8" stroke-linejoin="round"/></svg>`;
export async function finish(id, stars, line) {
  record(id, stars); document.body.dataset.stars = stars;
  const y = $('#yay'); y.querySelector('.stars').innerHTML = [0, 1, 2].map(k => starSvg(k, k < stars)).join('');
  y.classList.add('show'); sfx.fanfare(); for (let k = 0; k < 4; k++) setTimeout(() => confetti(new THREE.Vector3((Math.random() - .5) * 6, 4, 1), 50), k * 200 * F);
  const passed = stars >= PASS;
  const gi = GAMES.findIndex(g => g.id === id);
  const practice = GAMES[gi].mastery && unitOf(id).gate && stars < 3 ? GAMES.find(g => g.afterTry && g.unit === GAMES[gi].unit) : null;   /* the champion check: not 3 stars yet, so practise his hard letters next */
  await say(line || (practice ? 'Let’s practise your hard letters!' : passed ? (stars === 3 ? 'Three stars! Great job!' : 'Two stars! You did it!') : 'Good trying! Let’s play it again together.'));
  await wait(400); y.classList.remove('show');
  const nx = nextGame(id), bar = $('#endbar');
  const bonusOpen = GAMES[gi + 1] && GAMES[gi + 1].bonus && unlocked(GAMES[gi + 1].id);
  bar.innerHTML = `<button class="btn ${passed ? '' : 'orange big'}" id="again2" aria-label="Play again">${passed ? ICON.replay.replace(/#fff/g, '#2f6fe1') : ICON.replay}</button>` +
    ((passed && (nx || bonusOpen)) || practice ? `<button class="btn green big" id="nextg" aria-label="Next game">${ICON.next}</button>` : passed ? `<button class="btn green big" id="home2" aria-label="Back to the path">${ICON.home.replace(/#2f6fe1/g, '#fff')}</button>` : '');
  bar.classList.add('show'); document.body.dataset.done = 1; const note = document.querySelector('.note'); if (note) note.style.display = 'none';
  $('#again2').onclick = () => { location.reload(); };
  if ($('#nextg')) $('#nextg').onclick = () => goGame((practice || nx || GAMES[gi + 1]).id);
  if ($('#home2')) $('#home2').onclick = () => goPath();
  if (practice) await say('Tap the green arrow to practise your hard letters!');
  else if (passed) await say(nx ? 'Tap the green arrow for the next game!' : bonusOpen ? 'A bonus game! Tap the green arrow.' : 'Tap the green button to go back.');
  else await say('Tap the orange button to play again.');
}

/* ---------------- no 3D on this computer: a clean flat screen, never a blank one ---------------- */
export function flatFallback(keys = ['alef', 'beis', 'veis']) {
  const f = $('#flat'); f.style.display = 'flex'; document.body.dataset.flat = 1;
  f.innerHTML = `<div class="row">${keys.map(k => `<button data-k="${k}" aria-label="${LETTERS[k].name}">${FLAT[k]}</button>`).join('')}</div>
  <p>This computer can't show the 3D games. Tap a letter to hear it. (For the teacher: please open the games on a newer Chromebook or browser.)</p>`;
  f.querySelectorAll('button').forEach(b => b.onclick = () => say(nameLine(b.dataset.k)));
  say('Tap a letter to hear it.');
}

/* ---------------- "Remember these?": spaced review at the end of a game (RESEARCH.md, gain 1) ----------------
   Before the stars, three quick "hear it, tap it" questions about letters from EARLIER units, chosen by spacing:
   a letter he got wrong comes back first, then the ones he hasn't seen for longest. Practice only: it never costs a star.
   Every answer here and in the mastery check is remembered on his device, per letter (save.letters). */
export function noteLetter(k, right) { const s = loadSave(); s.letters = s.letters || {}; const m = s.letters[k] || { r: 0, w: 0, at: 0 };
  if (right) m.r++; else { m.w++; m.lastWrong = Date.now(); } m.at = Date.now(); m.ok = right; s.letters[k] = m; writeSave(s); }
const REV_LOOK = { memsofis: ['samech'], samech: ['memsofis'], nunsofis: ['vov'], chafsofis: ['reish'], shin: ['sin'], sin: ['shin'], tav: ['sav', 'ches'], sav: ['tav'], beis: ['veis', 'kaf'], veis: ['beis'], gimmel: ['nun'], daled: ['reish'], hei: ['ches', 'kuf'], vov: ['zayin'], zayin: ['vov'], ches: ['hei', 'tav'], tes: ['mem'], kaf: ['chaf', 'beis', 'pei'], chaf: ['kaf'], mem: ['tes'], nun: ['gimmel'], pei: ['fei', 'kaf'], fei: ['pei'], reish: ['daled'], kuf: ['hei'] };
/* two letters with the same sound (Kuf and Kaf; Samech, Sin and Suf), or both quiet: never asked side by side */
export const sameSound = (a, b) => a !== b && ((LETTERS[a].quiet && LETTERS[b].quiet) || (!!LETTERS[a].snd && LETTERS[a].snd === LETTERS[b].snd));
/* what to look for when he mixes up a look-alike pair: "want/tapped" */
const REV_CLUE = { 'beis/veis': 'Beis has a dot.', 'veis/beis': 'Veis has no dot.', 'beis/kaf': 'Beis has a tail at the bottom.', 'kaf/beis': 'Kaf is round at the bottom.',
  'kaf/chaf': 'Kaf has a dot.', 'chaf/kaf': 'Chaf has no dot.', 'vov/zayin': 'Vov has no crown.', 'zayin/vov': 'Zayin has a crown.', 'hei/ches': 'Hei\u2019s leg doesn\u2019t touch the roof.', 'ches/hei': 'Ches\u2019s leg touches the roof.',
  'gimmel/nun': 'Gimmel has a foot.', 'nun/gimmel': 'Nun is flat at the bottom.', 'tes/mem': 'Tes is closed at the bottom.', 'mem/tes': 'Mem has an opening at the bottom.',
  'pei/kaf': 'Pei has a little tongue inside.', 'kaf/pei': 'Kaf has no little tongue.', 'pei/fei': 'Pei has a dot.', 'fei/pei': 'Fei has no dot.', 'daled/reish': 'Daled has a corner.', 'reish/daled': 'Reish is round on top.', 'hei/kuf': 'Hei has a short leg.', 'kuf/hei': 'Kuf has a long leg.',
  'shin/sin': 'Shin\u2019s dot is on the right.', 'sin/shin': 'Sin\u2019s dot is on the left.', 'tav/sav': 'Tuf has a dot.', 'sav/tav': 'Suf has no dot.', 'tav/ches': 'Tuf has a little foot.', 'ches/tav': 'Ches has no foot.' };
export function reviewPicks(known, n = 3, skip = []) {
  const L = loadSave().letters || {}, now = Date.now(); known = known.filter(k => !skip.includes(k));   /* not the letters this game just practised: that would not be spaced */
  const score = k => { const m = L[k]; if (!m) return 1e12; return (m.ok === false ? 2e12 : 0) + (m.w > m.r ? 1e11 : 0) + (now - (m.at || 0)); };   /* missed last time first, then weaker, then not seen for longest */
  const order = known.slice().sort(() => Math.random() - .5).sort((a, b) => score(b) - score(a));
  const out = []; for (const k of order) { if (out.length >= n) break; if (out.some(o => sameSound(o, k))) continue; out.push(k); }
  return out;
}
export async function quickReview(unit, game) {
  if (!unit || !unit.known || !unit.known.length || !game || game.mastery || game.bonus || /^story/.test(game.kind)) return;
  const used = [...unit.letters, ...(game.pairs || []).flat(), ...(game.stands || []), ...(game.order || []), ...(game.reviewOf && UNITS[game.reviewOf - 1] ? UNITS[game.reviewOf - 1].letters : [])];
  unit.letters.forEach(k => (REV_LOOK[k] || []).forEach(o => used.push(o)));   /* and the look-alikes this game compared */
  let picks = reviewPicks(unit.known, 3, used); if (picks.length < 3) picks = [...picks, ...reviewPicks(unit.known, 3 - picks.length, [...picks, ...unit.letters])];
  const trainOrder = game.kind === 'train' ? unit.known.filter(k => !(game.order || []).includes(k)) : null, after = {};   /* after a train: which letter comes next, among the letters this train left out */
  if (trainOrder && trainOrder.length > 2) { const starts = trainOrder.slice(0, -1).sort(() => Math.random() - .5).slice(0, 3); picks = starts.map(a => { const k = trainOrder[trainOrder.indexOf(a) + 1]; after[k] = a; return k; }); }
  const pool = [...unit.known, ...unit.letters], box = $('#rev'), row = box.querySelector('.row'), dots = box.querySelector('.dots');
  const firstEver = !loadSave().revDemo; if (firstEver) { const sv = loadSave(); sv.revDemo = 1; writeSave(sv); }
  dots.innerHTML = picks.map(() => '<i></i>').join(''); box.classList.add('show'); document.body.dataset.review = 1;
  await say('Remember these?');
  for (let qi = 0; qi < picks.length; qi++) {
    const k = picks[qi], others = [];
    (REV_LOOK[k] || []).filter(o => pool.includes(o)).slice(0, 1).forEach(o => others.push(o));   /* its look-alike, if he knows it */
    for (const c of pool.slice().sort(() => Math.random() - .5)) if (others.length < 2 && c !== k && !others.includes(c) && !sameSound(k, c) && !others.some(o => sameSound(o, c))) others.push(c);
    const set = [k, ...others].sort((a, b) => AB(a) - AB(b));   /* right to left in Alef-Beis order */
    row.innerHTML = set.map(c => `<button data-k="${c}" aria-label="${LETTERS[c].name}">${FLAT[c]}</button>`).join('');
    let firstTry = true;
    await new Promise(res => {
      const btns = [...row.querySelectorAll('button')];
      window.__review = { want: k, at: Object.fromEntries(btns.map(b => { const r = b.getBoundingClientRect(); return [b.dataset.k, [r.x + r.width / 2, r.y + r.height / 2]]; })) };
      const bySound = !after[k] && qi === 1 && LETTERS[k].snd && !set.some(c => c !== k && LETTERS[c].snd === LETTERS[k].snd);   /* one question by its sound, never with a same-sound letter beside it */
      const ask = after[k] ? 'What comes after ' + LETTERS[after[k]].name + '? Tap it.' : bySound ? ['Which letter says', S(LETTERS[k].snd), '? Tap it.'] : 'Tap ' + LETTERS[k].name + '.';
      let busy = true;
      (async () => { if (qi === 0 && firstEver) { await say('Watch me. Tap ' + LETTERS[k].name + '.'); const r = btns.find(x => x.dataset.k === k).getBoundingClientRect(); hand.at(r.x + r.width / 2, r.y + r.height / 2 + 20, true); await wait(900); hand.hide(); await say('Now you!'); }
        await say(ask); busy = false; window.__review.ready = 1; })();
      btns.forEach(b => b.onclick = async () => { if (busy) return; const c = b.dataset.k;
        if (c === k) { busy = true; b.classList.add('right'); sfx.chime(); if (firstTry) noteLetter(k, true); dots.children[qi].classList.add('on'); if (qi === picks.length - 1) sfx.fanfare && sfx.fanfare();
          await say(k === 'alef' || k === 'ayin' ? [LETTERS[k].name + '! ' + LETTERS[k].name + ' is quiet.'] : [LETTERS[k].name + '! ' + LETTERS[k].name + ' says', S(LETTERS[k].snd)]); res(); }
        else { busy = true; sfx.boop(); b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); if (firstTry) noteLetter(k, false); firstTry = false;
          const r = btns.find(x => x.dataset.k === k); r.classList.add('right');
          await say(after[k] ? 'After ' + LETTERS[after[k]].name + ' comes ' + LETTERS[k].name + '.' : 'That is ' + LETTERS[c].name + '. This is ' + LETTERS[k].name + '.'); if (REV_CLUE[k + '/' + c]) await say(REV_CLUE[k + '/' + c]); r.classList.remove('right'); busy = false; } });
    });
    window.__review = null; await wait(250);
  }
  box.classList.remove('show'); delete document.body.dataset.review;
}
/* "Say it with me" (curriculum/k-kriyah/RESEARCH.md, gain 2): saying a letter out loud helps it stick (the production effect).
   The voice says the name, then waits a moment for him to say it too, then says it again with him. */
export async function sayWithMe(key) {
  const L = LETTERS[key], name = L.name;
  document.body.dataset.sayIt = key;
  await say('Say it with me: ' + name + '!'); await wait(1300);
  sfx.pop && sfx.pop(); await say(quietLetter(key) ? name + '! Quiet!' : [name + '!', S(L.snd)]);
  delete document.body.dataset.sayIt;
}
const quietLetter = k => k === 'alef' || k === 'ayin';
