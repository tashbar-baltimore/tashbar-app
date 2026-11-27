/* Kindergarten ABC 2.0, the calm way (Esti 2026-11-27, "Making the K ABC games great").
   learn.html?l=p&g=hear  — one game = one skill. Every letter has five games, always in this order:
     hear   Hear it: ears only. Does this word start with the sound? (thumbs up / down)
     meet   Meet it: the letter and its sound. He hears the sound and taps its letter.
     write  Write it: trace the letter (on the path, on dots, alone).
     find   Find it: he sees the letter (no sound given) and taps the picture that starts with its sound.
     read   Read with it: he blends words with the new letter and old ones (only from the 3rd letter on).
   Every game: the goal in one line; I do (Mendy shows one); we do (together, one); you do (5–8 alone); done.
   A wrong move gets one kind line saying what to listen or look for; after two misses Mendy shows the answer.
   Quiet screen: a calm background, the painted picture or letter large in the middle, nothing else moving.
   Test hooks: window.__abc (the same as the 3D games, so the same test player plays these). */
import { FAST, audio, runner, echo } from './kit3d.js';
import { LETTERS } from './letters.js';
import { WORDS } from './props.js';

export const GAMES = ['hear', 'meet', 'write', 'find', 'read'];
/* each letter: the sound's pictures, other pictures, the letters he already knows, the words he can read (from the 3rd letter) */
export const LESSONS = {
  p: { show: 'pot', together: 'sun',   /* hear: Mendy shows "pot" (yes), together "sun" (no) */
    yes: ['pear', 'penguin', 'pumpkin', 'pinwheel', 'pan', 'pin'], easyNo: ['sock', 'apple', 'ant', 'cat'], hardNo: ['top', 'tent', 'bee'],   /* easy "no" pictures first; top (ends in p), tent and bee later */
    known: ['s', 'a', 't'], findShow: 'pumpkin', findTogether: 'pot',
    read: { show: 'pat', together: 'sat', blend: ['at', 'sat', 'tap'], pairs: [['at', 'pat'], ['pat', 'sat'], ['tap', 'pat']] } }   /* easy to hard; tap/pat last */
};
const $ = id => document.getElementById(id);
const say = w => (WORDS[w] ? WORDS[w].say : w);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 30) : ms));
const toks = w => w.match(/ck|./g);

export function start() {
  const q = new URLSearchParams(location.search), L = q.get('l') || 'p', g = q.get('g') || 'hear', C = LESSONS[L];
  const A = window.__abc = { name: 'loading', ready: false, said: audio.said, rounds: 0, firstTry: 0, misses: 0, stars: 0, fixes: 0, helps: 0, step: 0, round: 0 };
  if (!C) { A.name = 'nounit'; return; } if (!GAMES.includes(g)) { A.name = 'nogame'; return; }
  const gi = GAMES.indexOf(g), nx = GAMES[gi + 1];
  $('next').href = nx ? 'learn.html?l=' + L + '&g=' + nx + (FAST ? '&fast=1' : '') : './';
  $('replay').onclick = () => location.reload();
  /* the painted background for this game (order C1), when it has arrived; until then a calm sky and lawn */
  const BG = { hear: 'garden', meet: 'classroom', write: 'classroom', find: 'meadow', read: 'playground' }[g];
  const bgi = new Image(); bgi.onload = () => { $('scene').style.backgroundImage = 'url(' + bgi.src + ')'; $('scene').classList.add('bg'); }; bgi.src = 'art/bg/' + BG + '.webp';
  const G = makeShell(A, L, g);
  const play = { hear, meet, write, find, read }[g];
  A.ready = true; A.name = 'start';
  const go = async () => { $('play').classList.add('gone'); $('again').classList.add('on'); audio.ctx(); A.name = 'play'; await play(G, C, L); };
  $('play').onclick = go; if (/[?&]autoplay=1/.test(location.search)) go();
}

/* ===================================================== the shell: Mendy, talking, rounds, fixes, stars, test hooks ===================================================== */
function makeShell(A, L, gid) {
  const R = runner($('again')), board = $('board'), G = { A, L };
  const pips = $('pips'); let miss = 0, ri = 0, hintFn = null;
  /* Mendy: the painted picture; he talks while the voice talks, points when he shows, hops when the boy is right */
  const M = $('mendy'); let pose = 'idle', hold = 0;
  G.pose = (p, ms = 1500) => { pose = p; hold = Date.now() + ms; };
  setInterval(() => { const p = Date.now() < hold ? pose : audio.talking ? 'talk' : 'idle'; const src = 'art/mendy-' + p + '.webp'; if (!M.src.endsWith(src)) M.src = src; }, 120);
  G.hop = () => { M.classList.add('hop'); setTimeout(() => M.classList.remove('hop'), 260); };
  G.say = (...lines) => R.run(lines.flat());
  G.snd = ch => echo(() => audio.letter(ch));
  G.sounds = w => echo(async () => { for (const c of toks(w)) await audio.letter(c); });
  G.word = w => echo(() => audio.say(say(w)));
  G.wait = wait;
  G.clear = () => { board.innerHTML = ''; };
  G.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  G.add = (e, parent = board) => { parent.appendChild(e); return e; };
  G.card = (w, big) => { const c = G.el('div', 'card' + (big ? ' big' : '')); c.dataset.w = w; const im = G.el('img'); im.src = 'art/pics/' + w + '.webp'; im.alt = ''; c.appendChild(im); return c; };
  G.tile = (ch, size = '') => { const t = G.el('div', 'tile ' + size); t.dataset.ch = ch; t.innerHTML = letterSVG(ch); return t; };
  /* rounds of "you do" (the only ones that count for stars) */
  G.rounds = n => { pips.innerHTML = ''; for (let i = 0; i < n; i++) pips.appendChild(G.el('i')); A.total = n; ri = 0; };
  G.newRound = () => { miss = 0; A.round++; hintFn = null; };
  G.hint = fn => { hintFn = fn; };
  G.right = async (el, line) => { audio.chime([784, 988, 1319]); if (el) { el.classList.remove('wrong'); el.classList.add('right'); } G.pose('happy', 1200); G.hop();
    A.rounds++; if (miss === 0) A.firstTry++; const d = pips.children[ri++]; if (d) d.className = miss === 0 ? 'star' : 'done';
    await G.say(line || ['Yes!', 'Great!', 'You got it!', 'Wonderful!'][Math.floor(Math.random() * 4)]); };
  G.wrong = async (lines, el) => { miss++; A.misses++; A.fixes++; audio.hmm(); if (el) { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); }
    await G.say([].concat(lines)); if (miss >= 2 && hintFn) { A.helps++; G.pose('point', 2500); await hintFn(); } };
  G.missed = () => miss;
  G.done = async line => { const r = A.rounds ? A.firstTry / A.rounds : 1, stars = r >= 0.85 ? 3 : r >= 0.55 ? 2 : 1; A.stars = stars;
    try { const k = 'kabc-stars', all = JSON.parse(localStorage.getItem(k) || '{}'), id = 'l' + L + '.' + gid; all[id] = Math.max(all[id] || 0, stars); localStorage.setItem(k, JSON.stringify(all)); } catch (e) {}
    G.clear(); G.pose('happy', 3000); G.hop(); audio.party(); A.expect = null;
    const st = $('stars'); st.innerHTML = ''; for (let i = 0; i < 3; i++) { const s = G.el('i'); if (i < stars) s.className = 'on'; s.style.animationDelay = (i * 0.25) + 's'; st.appendChild(s); }
    st.classList.add('on'); A.name = 'end'; await G.say([line || 'You did it!']); $('end').classList.add('on'); };
  /* buttons: thumbs up / down and the check button */
  G.button = (w, on) => $(w).classList.toggle('on', !!on);
  G.pressed = (...which) => new Promise(res => { const fns = which.map(w => { const f = () => { audio.ctx(); fns.forEach((h, i) => $(which[i]).removeEventListener('click', h)); res(w); }; $(w).addEventListener('click', f); return f; }); });
  /* tap: resolves with the element tapped, among these */
  G.tapOne = (els, ok = () => true) => new Promise(res => { const fns = els.map(e => { const f = ev => { if (!ok(ev)) return; ev.preventDefault(); audio.ctx(); G._untap(); res(e); }; e.addEventListener('pointerup', f); return f; }); G._untap = () => els.forEach((e, i) => e.removeEventListener('pointerup', fns[i])); });
  /* the test hooks */
  const ctr = e => { if (!e) return null; if (typeof e === 'function') e = e(); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  G.expect = (next, wrong) => { A.next = next; A.wrongMove = wrong || null; A.step++; };
  const scr = s => { if (!s) return null; if (s.kind === 'button') return Object.assign({ kind: 'tap' }, ctr($(s.id))); if (s.kind === 'tap') { const p = ctr(s.el); return p && Object.assign({ kind: 'tap' }, p); } if (s.kind === 'trace') return { kind: 'trace' }; return null; };
  A.nextScreen = () => { try { return scr(A.next); } catch (e) { return null; } };
  A.wrongScreen = () => { try { return scr(A.wrongMove); } catch (e) { return null; } };
  A.items = () => [...board.querySelectorAll('.card,.tile,.word')].map(e => Object.assign({ name: e.dataset.w || e.dataset.ch || 'word', roam: false }, ctr(e)));
  A.mendyScreen = () => { const r = M.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.6 }; };
  return G;
}

/* a letter drawn from its strokes (the same strokes he traces), thick and round */
export function letterSVG(ch, col = '#1F4FB8') {
  const paths = ch.split('').map((c, i, a) => { const dx = a.length > 1 ? (i - (a.length - 1) / 2) * 70 : 0;
    return (LETTERS[c] || []).map(d => { const dot = /^M[\d.]+ [\d.]+$/.test(d.trim()) || !/[LC]/.test(d); return dot ? '<circle cx="' + d.match(/[\d.]+/g)[0] + '" cy="' + d.match(/[\d.]+/g)[1] + '" r="14" fill="' + col + '" transform="translate(' + dx + ' 0)"/>'
      : '<path d="' + d + '" transform="translate(' + dx + ' 0)" fill="none" stroke="' + col + '" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>'; }).join(''); }).join('');
  const w = ch.length > 1 ? 200 : 140;
  return '<svg viewBox="' + (100 - w / 2) + ' 20 ' + w + ' 190" xmlns="http://www.w3.org/2000/svg">' + paths + '</svg>';
}

/* ===================================================== 1. HEAR IT: ears only ===================================================== */
async function hear(G, C, L) {
  const snd = G.snd(L), yes = shuffle(C.yes).slice(0, 3), no = [...shuffle(C.easyNo).slice(0, 1), ...shuffle(C.hardNo).slice(0, 2)];
  const pick = [[yes[0], true], [no[0], false], ...shuffle([[yes[1], true], [yes[2], true], [no[1], false], [no[2], false]])];   /* easy "no" first, the close ones later */
  G.rounds(pick.length);
  const thumbs = on => { G.button('yes', on); G.button('no', on); $('yes').classList.remove('glow'); $('no').classList.remove('glow'); };
  /* goal + I do */
  G.clear(); let c = G.add(G.card(C.show, true)); await G.say('Listen for this sound.', snd);
  G.pose('point', 3000); await G.say('Watch me.', G.word(C.show), snd, 'Yes!'); $('yes').classList.add('glow', 'demo'); G.button('yes', true); await G.wait(900); $('yes').classList.remove('demo'); thumbs(false);
  const ask = async (w, isYes, together) => { G.clear(); const c = G.add(G.card(w, true)); await G.wait(150); thumbs(true);
    await G.say(together ? ['Now with me.', G.word(w)] : [G.word(w)]);
    G.hint(async () => { $(isYes ? 'yes' : 'no').classList.add('glow'); await G.say('Listen to the start.', G.word(w), snd); });
    for (;;) { G.expect({ kind: 'button', id: isYes ? 'yes' : 'no' }, { kind: 'button', id: isYes ? 'no' : 'yes' });
      const p = await G.pressed('yes', 'no'); if ((p === 'yes') === isYes) break;
      await G.wrong(isYes ? [say(w) + ' starts with this sound.', snd] : ['Listen to the start of ' + say(w) + '.'], c); }
    thumbs(false); return c; };
  /* we do */ G.newRound(); await ask(C.together, false, true); await G.say('Right! A different sound.');
  /* you do */ for (const [w, isYes] of pick) { G.newRound(); const c = await ask(w, isYes, false); await G.right(c, isYes ? say(w) + '! Yes!' : 'Right! Not this sound.'); }
  await G.done('Great listening!');
}

/* ===================================================== 2. MEET IT: the letter and its sound ===================================================== */
async function meet(G, C, L) {
  const snd = G.snd(L); G.rounds(5);
  /* goal + I do: Mendy taps the new letter */
  G.clear(); const big = G.add(G.tile(L, 'huge')); await G.say('This letter says', snd);
  G.pose('point', 2000); await G.say('Watch me tap it.'); big.classList.add('on'); await audio.letter(L); big.classList.remove('on');
  /* we do: two letters; Mendy says the sound, they find it together */
  const choose = async (set, lines, label) => { G.clear(); const row = G.add(G.el('div', 'row')); const ts = set.map(ch => G.add(G.tile(ch), row)), good = ts[set.indexOf(L)];
    await G.wait(150); await G.say(lines);
    G.hint(async () => { good.classList.add('glow'); await G.say('This one says', snd); });
    for (;;) { G.expect({ kind: 'tap', el: good }, { kind: 'tap', el: ts.find(t => t !== good) }); const t = await G.tapOne(ts); audio.letter(t.dataset.ch);
      if (t === good) return t; await G.wrong(['That letter says a different sound.', snd], t); } };
  G.newRound(); { const t = await choose(shuffle([L, C.known[0]]), ['Now with me. Which says', snd], 'we'); t.classList.add('right'); await G.say('Yes! We found it.'); }
  /* you do: 2 letters, then 3 */
  for (let r = 0; r < 5; r++) { G.newRound(); const k = C.known, set = r < 2 ? [L, k[(r + 1) % k.length]] : [L, ...shuffle(k).slice(0, 2)];
    const t = await choose(shuffle(set), r === 0 ? ['Your turn. Which says', snd] : [snd]); await G.right(t); }
  await G.done('You know this letter!');
}

/* ===================================================== 3. WRITE IT: trace ===================================================== */
async function write(G, C, L) {
  const modes = ['dots', 'dots', 'alone', 'alone', 'alone']; G.rounds(modes.length); G.clear();
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.id = 'trace'; G.add(svg);
  const mk = (tag, a) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); svg.appendChild(e); return e; };
  const strokes = LETTERS[L].map(d => { const track = mk('path', { d, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 30, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.9 });
    const ink = mk('path', { d, fill: 'none', stroke: '#1F4FB8', 'stroke-width': 22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const len = ink.getTotalLength(), N = Math.max(2, Math.round(len / 6)), pts = []; for (let i = 0; i <= N; i++) { const p = ink.getPointAtLength(len * i / N); pts.push({ x: p.x, y: p.y }); }
    ink.style.strokeDasharray = len; ink.style.strokeDashoffset = len; return { track, ink, len, pts, dots: [] }; });
  /* the letter fills the box: a tight view around its strokes, so it is big on a phone too */
  { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; strokes.forEach(s => s.pts.forEach(p => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }));
    const pad = 26, w = x1 - x0 + 2 * pad, h = y1 - y0 + 2 * pad, side = Math.max(w, h * 0.8); svg.setAttribute('viewBox', [(x0 + x1) / 2 - side / 2, y0 - pad, side, h].join(' ')); }
  strokes.forEach(s => { for (let i = 0; i < s.pts.length; i += 4) s.dots.push(mk('circle', { cx: s.pts[i].x, cy: s.pts[i].y, r: 3.5, fill: '#8FB8E8' })); });
  const arrow = mk('path', { d: 'M0 0 L-9 -6 L-9 6 Z', fill: '#2EDB6A' }), start = mk('circle', { r: 13, fill: '#2EDB6A', opacity: 0.85 });
  const toScr = p => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = p.x; q.y = p.y; const r = q.matrixTransform(m); return { x: r.x, y: r.y }; };
  const toSvg = e => { const m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m); };
  let si = 0, k = 0;
  const show = mode => strokes.forEach(s => { s.track.style.display = mode === 'path' ? '' : 'none'; s.dots.forEach(d => d.style.display = mode === 'alone' ? 'none' : ''); });
  const setInk = (s, f) => { s.ink.style.strokeDashoffset = s.len * (1 - f); };
  const placeStart = () => { const s = strokes[si]; if (!s) { start.style.display = arrow.style.display = 'none'; return; } start.style.display = arrow.style.display = '';
    const p = s.pts[k] || s.pts[0], q = s.pts[Math.min(s.pts.length - 1, k + 3)]; start.setAttribute('cx', p.x); start.setAttribute('cy', p.y);
    arrow.setAttribute('transform', 'translate(' + (p.x + (q.x - p.x) * 2.2) + ' ' + (p.y + (q.y - p.y) * 2.2) + ') rotate(' + (Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI) + ')'); };   /* which way to go */
  const reset = () => { si = 0; k = 0; strokes.forEach(s => setInk(s, 0)); placeStart(); };
  const demo = async () => { strokes.forEach(s => setInk(s, 0)); for (const s of strokes) { for (let f = 0; f <= 1.0001; f += FAST ? 1 : 0.04) { setInk(s, f); await wait(40); } await wait(250); } };
  G.A.traceStrokes = () => strokes.map(s => s.pts.map(toScr));
  /* goal + I do */ show('path'); start.style.display = arrow.style.display = 'none'; await G.say('Today we write this letter.'); G.pose('point', 4000); await G.say('Watch me.'); await demo(); await audio.letter(L);
  const trace = (mode, line) => new Promise(async res => { reset(); show(mode); await G.say(line);
    G.expect({ kind: 'trace' }); let down = false, far = 0;
    const dn = async e => { const p = toSvg(e), s = strokes[si]; if (!s) return; const q = s.pts[k]; if (Math.hypot(p.x - q.x, p.y - q.y) < 24) { down = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {} return; }
      far++; if (far === 2) { G.A.helps++; G.pose('point', 3000); await G.say('Watch me again.'); await demo(); strokes.forEach(s2 => setInk(s2, 0)); for (let i = 0; i < si; i++) setInk(strokes[i], 1); }   /* help after two starts in the wrong place */
      else if (far % 2 === 1) G.say('Start at the green light.'); };
    const mv = e => { if (!down) return; const p = toSvg(e), s = strokes[si]; for (let j = k + 1; j < Math.min(s.pts.length, k + 6); j++) { if (Math.hypot(p.x - s.pts[j].x, p.y - s.pts[j].y) < 20) k = j; }
      setInk(s, k / (s.pts.length - 1)); placeStart();
      if (k >= s.pts.length - 2) { setInk(s, 1); audio.chime([784, 988]); si++; k = 0; down = false; placeStart(); if (si >= strokes.length) { cleanup(); res(); } } };
    const up = () => { down = false; };
    const cleanup = () => { svg.removeEventListener('pointerdown', dn); svg.removeEventListener('pointermove', mv); svg.removeEventListener('pointerup', up); };
    svg.addEventListener('pointerdown', dn); svg.addEventListener('pointermove', mv); svg.addEventListener('pointerup', up); });
  /* we do: on the shiny path, with Mendy */ await trace('path', 'Now with me. Start at the green light.'); await audio.letter(L); await G.say('Lovely!');
  /* you do */ for (let r = 0; r < modes.length; r++) { G.newRound(); await trace(modes[r], r === 0 ? 'Now you. Follow the dots.' : r === 2 ? 'Now all by yourself!' : 'Again!'); await audio.letter(L); await G.right(null, ['Good!', 'Beautiful!', 'All by yourself!', 'Wonderful!', 'You did it!'][r]); }
  await G.done('Your finger knows this letter!');
}

/* ===================================================== 4. FIND IT: see the letter, find the picture ===================================================== */
async function find(G, C, L) {
  const snd = G.snd(L), ys = shuffle(C.yes.filter(w => w !== C.findShow && w !== C.findTogether)).slice(0, 5), nE = shuffle(C.easyNo), nH = shuffle(C.hardNo); G.rounds(ys.length);
  const scene = (good, bads) => { G.clear(); G.add(G.tile(L, 'small')); const row = G.add(G.el('div', 'row wrap')); const ws = shuffle([good, ...bads]); const cs = ws.map(w => G.add(G.card(w), row)); return { cs, good: cs[ws.indexOf(good)] }; };
  /* goal + I do */ { const { good } = scene(C.findShow, nE.slice(0, 2)); await G.say('This letter says', snd); G.pose('point', 3000); await G.say('Watch me.', G.word(C.findShow) + '!', 'It starts with that sound.'); good.classList.add('glow'); await G.wait(800); good.classList.add('right'); await G.wait(400); }
  const pickOne = async (cs, good, wrongLine) => { for (;;) { G.expect({ kind: 'tap', el: good }, { kind: 'tap', el: cs.find(c => c !== good) }); const t = await G.tapOne(cs); await audio.say(say(t.dataset.w)); if (t === good) return t; await G.wrong(wrongLine(t), t); } };
  /* we do: they say each picture together */ { G.newRound(); const { cs, good } = scene(C.findTogether, [nE[2], nE[3]]); await G.say('Now with me.', ...cs.map(c => G.word(c.dataset.w)));
    G.hint(async () => { good.classList.add('glow'); }); const t = await pickOne(cs, good, () => ['Listen to the start.', snd]); t.classList.add('right'); await G.say('Yes!'); }
  /* you do: the letter only; the picture names are said in the first two rounds */
  for (let r = 0; r < ys.length; r++) { G.newRound(); const bads = r < 2 ? shuffle(C.easyNo).slice(0, 2) : [shuffle(C.easyNo)[0], nH[r % nH.length]], { cs, good } = scene(ys[r], bads); await G.wait(200);
    if (r < 2) await G.say(...cs.map(c => G.word(c.dataset.w)));
    G.hint(async () => { await G.say('This letter says', snd); good.classList.add('glow'); });
    const t = await pickOne(cs, good, t => [say(t.dataset.w) + ' starts with a different sound.', 'What does the letter say?']); await G.right(t, say(t.dataset.w) + '!'); }
  await G.done('You found them all!');
}

/* ===================================================== 5. READ WITH IT: blend words ===================================================== */
async function read(G, C, L) {
  const R0 = C.read; G.rounds(R0.blend.length + R0.pairs.length);
  /* a word: letter tiles in a row and the reading arrow under them */
  const wordBox = (w, small) => { const box = G.el('div', 'word'); box.dataset.w = w; const row = G.el('div', 'row'); row.style.gap = '10px'; toks(w).forEach(c => row.appendChild(G.tile(c, small ? 'small' : ''))); box.appendChild(row);
    const col = G.el('div'); col.style.cssText = 'display:flex;flex-direction:column;align-items:stretch'; col.appendChild(box); return { col, box, ts: [...row.children] }; };
  const blend = async (w, ts, arrow) => { for (const t of ts) { t.classList.add('on'); await audio.letter(t.dataset.ch); await wait(150); t.classList.remove('on'); } arrow.classList.add('go'); await audio.say(say(w)); arrow.classList.remove('go'); };
  /* he blends it himself: each letter, left to right, then the arrow. A letter out of order gets a gentle fix */
  const himself = async (w, lead) => { G.clear(); const { col, ts } = wordBox(w); const arrow = G.el('div', 'arrow'); col.appendChild(arrow); G.add(col); await wait(150); if (lead) await G.say(lead);
    for (let i = 0; i < ts.length; i++) { const t = ts[i]; t.classList.add('glow');
      G.hint(async () => { t.classList.add('on'); await G.say('Start here, on the left.'); });
      for (;;) { G.expect({ kind: 'tap', el: t }, i === 0 ? { kind: 'tap', el: ts[ts.length - 1] } : null); const x = await G.tapOne(ts); audio.letter(x.dataset.ch); if (x === t) break; await G.wrong(['We read this way.', 'Tap the shining letter.'], x); }
      t.classList.remove('glow'); await wait(250); }
    arrow.classList.add('glow'); G.expect({ kind: 'tap', el: arrow }); await G.tapOne([arrow]); await blend(w, ts, arrow); };
  /* goal + I do */ { G.clear(); const { col, ts } = wordBox(R0.show); const arrow = G.el('div', 'arrow'); col.appendChild(arrow); G.add(col); await G.say('Let\'s read!'); G.pose('point', 4000); await G.say('Watch me.'); await blend(R0.show, ts, arrow); }
  /* we do */ await himself(R0.together, 'Now with me. Tap each letter.'); await G.say('We read ' + R0.together + '!');
  /* you do: blend a word yourself, then hear-and-find (word cards: a tap anywhere on the card chooses it) */
  for (let r = 0; r < R0.blend.length; r++) {
    G.newRound(); await himself(R0.blend[r], r === 0 ? 'Your turn!' : null); await G.right(null, 'You read ' + R0.blend[r] + '!');
    const [a, b] = R0.pairs[r]; G.newRound(); G.clear(); const ws = shuffle([a, b]), boxes = ws.map(w => { const W = wordBox(w, true); G.add(W.col); return W; }), gb = boxes[ws.indexOf(a)].box;
    await wait(150); await G.say('Find', G.word(a));
    G.hint(async () => { await G.say('Say it slowly.', G.sounds(a)); gb.classList.add('glow'); });
    for (;;) { const bb = boxes.map(W => W.box); G.expect({ kind: 'tap', el: gb }, { kind: 'tap', el: bb.find(x => x !== gb) }); const t = await G.tapOne(bb);
      if (t === gb) { await audio.say(say(a)); await G.right(t, 'Yes! ' + a + '!'); break; }
      await G.wrong(['That word says ' + t.dataset.w + '.', 'Say each sound slowly.'], t); }
  }
  await G.done('You can read!');
}
