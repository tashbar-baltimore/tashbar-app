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
  p: { yes: ['pot', 'pear', 'pan', 'penguin', 'pumpkin', 'pinwheel'], no: ['sock', 'apple', 'top', 'tent', 'sun', 'ant', 'cat', 'bee'], known: ['s', 'a', 't'],
    show: 'pot', together: 'sun', findShow: 'pan',
    read: { show: 'pat', together: 'sat', pairs: [['tap', 'pat'], ['sap', 'sat'], ['at', 'pat'], ['pat', 'sat'], ['sat', 'tap']], pic: { w: 'tap', pic: 'faucet', other: 'pan' } } }
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
  G.tapOne = els => new Promise(res => { const fns = els.map(e => { const f = ev => { ev.preventDefault(); audio.ctx(); res(e); }; e.addEventListener('pointerup', f, { once: true }); return f; }); G._untap = () => els.forEach((e, i) => e.removeEventListener('pointerup', fns[i])); });
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
  const snd = G.snd(L), pick = shuffle([...shuffle(C.yes.filter(w => w !== C.show)).slice(0, 3).map(w => [w, true]), ...shuffle(C.no.filter(w => w !== C.together)).slice(0, 3).map(w => [w, false])]);
  G.rounds(pick.length);
  await G.say('Today we listen for this sound.', snd);
  const ask = async (w, yes, mode) => { G.clear(); const c = G.add(G.card(w, true)); await G.wait(200);
    G.button('yes', true); G.button('no', true);
    if (mode === 'show') { G.pose('point', 3000); await G.say('Watch me.', G.word(w), 'Does it start with this sound?', snd); await G.say(yes ? 'Yes! Thumbs up.' : 'No. Thumbs down.'); G.button('yes', false); G.button('no', false); return; }
    await G.say(mode === 'together' ? ['Now with me.', G.word(w), 'Does it start with this sound?', snd] : [G.word(w)]);
    G.hint(async () => { await G.say('Listen to the start.', G.word(w), snd); $(yes ? 'yes' : 'no').classList.add('glow'); });
    for (;;) { G.expect({ kind: 'button', id: yes ? 'yes' : 'no' }, { kind: 'button', id: yes ? 'no' : 'yes' });
      const p = await G.pressed('yes', 'no'); if ((p === 'yes') === yes) break;
      await G.wrong(yes ? [say(w) + ' starts with this sound.', snd, 'Listen again.'] : ['Listen to the start of ' + say(w) + '.', 'It is a different sound.'], c); }
    G.button('yes', false); G.button('no', false); return c; };
  await ask(C.show, true, 'show');
  G.newRound(); { const c = await ask(C.together, false, 'together'); await G.say('Right! ' + say(C.together) + ' starts with a different sound.'); }
  await G.say('Now you!');
  for (const [w, yes] of pick) { G.newRound(); const c = await ask(w, yes, 'you'); await G.right(c, yes ? say(w) + '! Yes!' : 'Right! Not this sound.'); }
  await G.done('Great listening!');
}

/* ===================================================== 2. MEET IT: the letter and its sound ===================================================== */
async function meet(G, C, L) {
  const snd = G.snd(L); G.rounds(5);
  G.clear(); const big = G.add(G.tile(L, 'huge'));
  await G.say('This is a new letter.', 'It says this sound.', snd);
  /* I do */ G.pose('point', 2500); await G.say('Watch me tap it.'); big.classList.add('on'); await audio.letter(L); await G.wait(300); big.classList.remove('on');
  /* we do */ await G.say('Now you tap it. Say it with me!');
  G.newRound(); G.expect({ kind: 'tap', el: big }); await G.tapOne([big]); big.classList.add('right'); await audio.letter(L); await G.say('Yes! That is its sound.');
  /* you do: hear the sound, tap its letter (old letters beside it) */
  await G.say('Now listen, and tap the letter for this sound.');
  const others = C.known;
  for (let r = 0; r < 5; r++) { G.newRound(); G.clear(); const row = G.add(G.el('div', 'row'));
    const set = shuffle([L, others[r % others.length]]), ts = set.map(ch => G.add(G.tile(ch), row)), good = ts[set.indexOf(L)], bad = ts.find(t => t !== good);
    await G.wait(200); await G.say(r < 2 ? ['Which letter says', snd] : [snd]);
    G.hint(async () => { good.classList.add('glow'); await G.say('This one says', snd); });
    for (;;) { G.expect({ kind: 'tap', el: good }, { kind: 'tap', el: bad }); const t = await G.tapOne(ts); G._untap(); audio.letter(t.dataset.ch);
      if (t === good) { await G.right(t); break; } await G.wrong(['That letter says a different sound.', 'Listen.', snd], t); }
  }
  await G.done('You know this letter!');
}

/* ===================================================== 3. WRITE IT: trace ===================================================== */
async function write(G, C, L) {
  G.rounds(3); G.clear();
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.id = 'trace'; svg.setAttribute('viewBox', '30 20 140 190'); G.add(svg);
  const mk = (tag, a) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); svg.appendChild(e); return e; };
  const strokes = LETTERS[L].map(d => { const track = mk('path', { d, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 30, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.9 });
    const ink = mk('path', { d, fill: 'none', stroke: '#1F4FB8', 'stroke-width': 22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const len = ink.getTotalLength(), N = Math.max(2, Math.round(len / 6)), pts = []; for (let i = 0; i <= N; i++) { const p = ink.getPointAtLength(len * i / N); pts.push({ x: p.x, y: p.y }); }
    ink.style.strokeDasharray = len; ink.style.strokeDashoffset = len; return { track, ink, len, pts, dots: [] }; });
  strokes.forEach(s => { for (let i = 0; i < s.pts.length; i += 4) s.dots.push(mk('circle', { cx: s.pts[i].x, cy: s.pts[i].y, r: 3.5, fill: '#8FB8E8' })); });
  const start = mk('circle', { r: 13, fill: '#2EDB6A', opacity: 0.85 });
  const toScr = p => { const m = svg.getScreenCTM(), q = svg.createSVGPoint(); q.x = p.x; q.y = p.y; const r = q.matrixTransform(m); return { x: r.x, y: r.y }; };
  const toSvg = e => { const m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m); };
  let si = 0, k = 0;
  const show = (mode) => { strokes.forEach(s => { s.track.style.display = mode === 'path' ? '' : 'none'; s.dots.forEach(d => d.style.display = mode === 'alone' ? 'none' : ''); }); };
  const setInk = (s, f) => { s.ink.style.strokeDashoffset = s.len * (1 - f); };
  const placeStart = () => { const s = strokes[si]; if (!s) { start.style.display = 'none'; return; } start.style.display = ''; const p = s.pts[k] || s.pts[0]; start.setAttribute('cx', p.x); start.setAttribute('cy', p.y); };
  const reset = () => { si = 0; k = 0; strokes.forEach(s => setInk(s, 0)); placeStart(); };
  G.A.traceStrokes = () => strokes.map(s => s.pts.map(toScr));
  /* I do: Mendy's stroke grows slowly, one stroke at a time */
  await G.say('Today we write this letter.'); G.pose('point', 4000); await G.say('Watch me.');
  for (const s of strokes) { for (let f = 0; f <= 1.0001; f += FAST ? 1 : 0.04) { setInk(s, f); await wait(40); } await wait(250); }
  await audio.letter(L); await wait(400);
  const lines = ['Now with me. Follow the shiny path.', 'Now just the dots.', 'All by yourself!'], modes = ['path', 'dots', 'alone'];
  for (let r = 0; r < 3; r++) {
    G.newRound(); reset(); show(modes[r]); await G.say(lines[r], 'Start at the green light.');
    G.expect({ kind: 'trace' }); let down = false, lost = 0;
    await new Promise(res => {
      const dn = e => { const p = toSvg(e), s = strokes[si]; if (!s) return; const q = s.pts[k]; if (Math.hypot(p.x - q.x, p.y - q.y) < 22) { down = true; svg.setPointerCapture && svg.setPointerCapture(e.pointerId); } else if (++lost % 3 === 1) G.say('Start at the green light.'); };
      const mv = e => { if (!down) return; const p = toSvg(e), s = strokes[si]; for (let j = k + 1; j < Math.min(s.pts.length, k + 6); j++) { if (Math.hypot(p.x - s.pts[j].x, p.y - s.pts[j].y) < 20) k = j; }
        setInk(s, k / (s.pts.length - 1)); placeStart();
        if (k >= s.pts.length - 2) { setInk(s, 1); audio.chime([784, 988]); si++; k = 0; down = false; placeStart(); if (si >= strokes.length) { cleanup(); res(); } } };
      const up = () => { down = false; };
      const cleanup = () => { svg.removeEventListener('pointerdown', dn); svg.removeEventListener('pointermove', mv); svg.removeEventListener('pointerup', up); };
      svg.addEventListener('pointerdown', dn); svg.addEventListener('pointermove', mv); svg.addEventListener('pointerup', up); });
    await audio.letter(L); await G.right(null, ['You did it!', 'Beautiful!', 'All by yourself!'][r]);
  }
  await G.done('Your finger knows this letter!');
}

/* ===================================================== 4. FIND IT: see the letter, find the picture ===================================================== */
async function find(G, C, L) {
  const snd = G.snd(L), ys = shuffle(C.yes.filter(w => w !== C.findShow)), ns = shuffle(C.no); G.rounds(6);
  const top = () => { const t = G.tile(L, 'small'); return t; };
  const scene = (good, bads) => { G.clear(); G.add(top()); const row = G.add(G.el('div', 'row wrap')); const ws = shuffle([good, ...bads]); const cs = ws.map(w => G.add(G.card(w), row)); return { cs, good: cs[ws.indexOf(good)] }; };
  await G.say('Today we find pictures for this letter.');
  /* I do */ { const { cs, good } = scene(C.findShow, ns.slice(0, 2)); G.pose('point', 3000); await G.say('Watch me. This letter says', snd); await G.say(say(C.findShow) + ' starts with this sound!'); good.classList.add('glow'); await G.wait(700); good.classList.add('right'); await G.wait(500); }
  /* we do */ { G.newRound(); const { cs, good } = scene(ys[0], ns.slice(2, 4)); await G.say('Now with me. Say each picture.', ...cs.map(c => G.word(c.dataset.w)), 'Which starts with this sound?', snd);
    G.hint(async () => { good.classList.add('glow'); });
    for (;;) { G.expect({ kind: 'tap', el: good }, { kind: 'tap', el: cs.find(c => c !== good) }); const t = await G.tapOne(cs); G._untap(); await audio.say(say(t.dataset.w)); if (t === good) { t.classList.add('right'); await G.say('Yes! ' + say(t.dataset.w) + '!'); break; } await G.wrong(['Listen to the start.', snd], t); } }
  await G.say('Now you! Look at the letter.');
  for (let r = 0; r < 6; r++) { G.newRound(); const { cs, good } = scene(ys[(r + 1) % ys.length], shuffle(ns).slice(0, 2)); await G.wait(250);
    if (r === 0) await G.say('Tap the picture that starts with its sound.');
    G.hint(async () => { await G.say('This letter says', snd); good.classList.add('glow'); });
    for (;;) { G.expect({ kind: 'tap', el: good }, { kind: 'tap', el: cs.find(c => c !== good) }); const t = await G.tapOne(cs); G._untap(); await audio.say(say(t.dataset.w));
      if (t === good) { await G.right(t, say(t.dataset.w) + '!'); break; } await G.wrong([say(t.dataset.w) + ' starts with a different sound.', 'Look at the letter. What does it say?'], t); }
  }
  await G.done('You found them all!');
}

/* ===================================================== 5. READ WITH IT: blend words ===================================================== */
async function read(G, C, L) {
  const R0 = C.read; G.rounds(R0.pairs.length + 1);
  /* a word: its letter tiles in a row and the reading arrow under them; tap each letter, then the arrow to blend */
  const wordBox = (w, small) => { const box = G.el('div', 'word'); box.dataset.w = w; const row = G.el('div', 'row'); row.style.gap = '10px'; toks(w).forEach(c => row.appendChild(G.tile(c, small ? 'small' : ''))); box.appendChild(row); const col = G.el('div'); col.style.cssText = 'display:flex;flex-direction:column;align-items:stretch'; col.appendChild(box); return { col, box, ts: [...row.children] }; };   /* the reading arrow is as wide as the word */
  const blend = async (w, ts, arrow) => { for (const t of ts) { t.classList.add('on'); await audio.letter(t.dataset.ch); await wait(150); t.classList.remove('on'); } arrow.classList.add('go'); await audio.say(say(w)); arrow.classList.remove('go'); };
  const guided = async (w, mine) => { G.clear(); const { col, ts } = wordBox(w); const arrow = G.el('div', 'arrow'); col.appendChild(arrow); G.add(col); await wait(200);
    if (mine) { G.pose('point', 4000); await G.say('Watch me read it.', 'Each sound, then slide them together.'); await blend(w, ts, arrow); await G.say(w + '!'); return; }
    await G.say('Now with me. Tap each letter.');
    for (const t of ts) { t.classList.add('glow'); G.expect({ kind: 'tap', el: t }); await G.tapOne([t]); t.classList.remove('glow'); t.classList.add('on'); await audio.letter(t.dataset.ch); t.classList.remove('on'); }
    await G.say('Now tap the arrow to slide them together.'); G.expect({ kind: 'tap', el: arrow }); await G.tapOne([arrow]); await blend(w, ts, arrow); await G.say('You read ' + w + '!'); };
  await G.say('Today we read words with our letters.');
  await guided(R0.show, true); G.newRound(); await guided(R0.together, false);
  await G.say('Now you! Listen, then tap the word you hear.');
  for (const [a, b] of R0.pairs) { G.newRound(); G.clear(); const goal = a, ws = shuffle([a, b]), boxes = ws.map(w => { const W = wordBox(w, true); G.add(W.col); return W; });
    const gb = boxes[ws.indexOf(goal)], bb = boxes.find(x => x !== gb);
    boxes.forEach(W => W.ts.forEach(t => t.addEventListener('pointerdown', e => { e.stopPropagation(); audio.letter(t.dataset.ch); })));   /* he may tap a letter to hear its sound */
    await wait(200); await G.say('Find', G.word(goal));
    G.hint(async () => { await G.say('Say it slowly.', G.sounds(goal)); gb.box.classList.add('glow'); });
    for (;;) { G.expect({ kind: 'tap', el: gb.box }, { kind: 'tap', el: bb.box }); const t = await G.tapOne(boxes.map(W => W.box)); G._untap();
      if (t === gb.box) { await audio.say(say(goal)); await G.right(t, 'Yes! ' + goal + '!'); break; }
      await G.wrong(['That word says ' + t.dataset.w + '.', 'Tap each letter and listen.'], t); }
  }
  /* the last one: read the word and find its picture */
  { G.newRound(); G.clear(); const { col, box } = wordBox(R0.pic.w, true); G.add(col); const row = G.add(G.el('div', 'row')); const ps = shuffle([R0.pic.pic, R0.pic.other]), cs = ps.map(w => G.add(G.card(w), row)), good = cs[ps.indexOf(R0.pic.pic)];
    await G.say('Read this word by yourself.', 'Then tap its picture.'); G.hint(async () => { await G.say('Say it slowly.', G.sounds(R0.pic.w)); good.classList.add('glow'); });
    box.querySelectorAll('.tile').forEach(t => t.addEventListener('pointerdown', () => audio.letter(t.dataset.ch)));
    for (;;) { G.expect({ kind: 'tap', el: good }, { kind: 'tap', el: cs.find(c => c !== good) }); const t = await G.tapOne(cs); G._untap();
      if (t === good) { await G.right(t, 'Yes! A ' + R0.pic.w + '!'); break; } await G.wrong(['Read it again. Each sound.', G.sounds(R0.pic.w)], t); } }
  await G.done('You can read!');
}
