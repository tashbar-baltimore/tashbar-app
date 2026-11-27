/* Kindergarten ABC 2.0 — Review week A (week 8). v2/curriculum/k-abc/MAP.md
   "Mixed, short rounds of everything so far: sounds, tracing, blending, rhyme. A boy who missed a sound gets that letter again, quietly.
    Quick boys: a speed slide bonus round."
   Every game is a new kind of play:
   opener  the sound parade: all eight letters march in; he taps each to hear it; the whole chant
   bingo   sound bingo: a 3 x 3 board of letter stones; he hears a sound and taps its stone; a row lights up
   chalk   mixed tracing on a chalkboard: a different letter each round, a chalk line follows his finger
   catch   rhyme catch: pictures fall gently from a tree; he taps the one that rhymes before it lands
   bridge  the word bridge: he reads the word on each stepping stone and taps its picture to cross the stream
   speed   bonus word slide (the map's "speed slide" for quick boys): sad, mad, dip, tip, pad, sip, then hear a word and tap it
   check   mixed mastery check (tap kinds)
   Weak letters: the checks of Units 2–3 save the letters he missed (kabc-weak in this browser); bingo asks those first. */
import { THREE, V, shuffle, rnd, audio, echo, WORDS, FAST, ease, clamp } from '../game.js';
import { base, tree, rock, pond, stump, shelf } from '../scenes.js';
import { prop } from '../props.js';
import { tracer, glow, C, toon, growTube } from '../kit3d.js';
import { letterTile, letterPoints } from '../letters.js';
import { slide } from './u2.js';

export const ORDER = ['opener', 'bingo', 'chalk', 'catch', 'bridge', 'speed', 'check'];
const LET = ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd'];
const say = w => (WORDS[w] ? WORDS[w].say : w);
const snd = ch => echo(() => audio.letter(ch));
const sounds = w => echo(async () => { for (const c of w) await audio.letter(c); });
const tapHit = (obj, r = 0.9) => { const h = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); obj.add(h); return h; };
function clearItems(G) { return Promise.all(G.items.slice().map(i => i.remove())); }
export function weak() { try { return JSON.parse(localStorage.getItem('kabc-weak') || '[]'); } catch (e) { return []; } }
const wordTiles = (S, w, k = 0.6) => { const g = new THREE.Group(); w.split('').forEach((c, i) => { const t = letterTile(c); t.scale.setScalar(k); t.position.set((i - (w.length - 1) / 2) * k * 1.3, 0, 0); g.add(t); }); S.scene.add(g); return g; };

/* =========================================================== opener: the sound parade =========================================================== */
const opener = {
  world(G) { const W = base(G.S, 'morning', { clearW: 8 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6.5, { s: 1.6, c1: 0xE85A9E, c2: 0xFFC2E2 });
    G.view({ wide: [-0.3, 2.0, 11.6, 5.8, 0.17], narrow: [0, 2.2, 5.0, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(LET.length);
    await G.say('Review week! You know eight sounds.', 'Here comes the sound parade!');
    const at = i => n() ? V(-1.5 + (i % 4) * 1.0, 3.2 - Math.floor(i / 4) * 1.4, 0) : V(-3.5 + i * 1.0, 2.0, 0);
    const tiles = LET.map((c, i) => { const t = letterTile(c); t.position.copy(at(i)).add(V(-12, 0, 0)); t.scale.setScalar(n() ? 0.7 : 0.8); S.scene.add(t); t.userData = { c, i }; return t; });
    G.W.layout = () => tiles.forEach(t => t.position.copy(at(t.userData.i)));
    audio.choo(); await S.tween(1600, e => tiles.forEach((t, i) => t.position.copy(at(i)).add(V(-12 * (1 - ease.out(clamp(e * 1.4 - i * 0.05, 0, 1))), Math.abs(Math.sin(e * 20 + i)) * 0.2 * (1 - e), 0))));
    tiles.forEach(t => t.position.copy(at(t.userData.i)));
    await G.say('Tap each letter. Say its sound!');
    for (let k = 0; k < LET.length; k++) {
      G.newRound(); const t = tiles[k];
      await new Promise(res => { G.expect({ kind: 'tap', at: t }); G.A.wrongMove = null; t.scale.multiplyScalar(1.15); G.tap(tapHit(t, 0.7), async () => { G.taps = []; await audio.letter(t.userData.c); t.scale.multiplyScalar(1 / 1.15); res(); }); });
      await G.right(t.position, ['Yes!', 'Good!', 'Super!', 'Great!'][k % 4]);
    }
    G.A.name = 'song'; await G.say('All eight together! Say them with me.'); for (const t of tiles) { t.rotation.z = 0.25; await audio.letter(t.userData.c); t.rotation.z = 0; await G.wait(120); }
    G.A.name = 'play'; await G.done('What a parade!');
  }
};

/* =========================================================== bingo: sound bingo =========================================================== */
const bingo = {
  world(G) { const W = base(G.S, 'sunset', { clearW: 8 }); tree(G.S, -9.5, -6, { s: 1.4 }); tree(G.S, 9.5, -7, { s: 1.6, c1: 0x3A9E5A, c2: 0xB8E06A });
    G.view({ wide: [0.4, 2.4, 11, 6.0, 0.17], narrow: [0, 2.6, 5.0, 8.0, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); const board = shuffle(LET.concat([shuffle(LET)[0]])).slice(0, 9);
    const at = i => n() ? V(-1.4 + (i % 3) * 1.4, 4.4 - Math.floor(i / 3) * 1.4, 0) : V(-1.0 + (i % 3) * 1.6, 3.9 - Math.floor(i / 3) * 1.45, 0);
    const stones = board.map((c, i) => { const g = new THREE.Group(), st = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.16, 36), toon(0xF4EEFF, { rough: .4, clear: .6 })); st.rotation.x = Math.PI / 2; g.add(st);
      const t = letterTile(c); t.scale.setScalar(0.6); t.position.z = 0.12; g.add(t); g.position.copy(at(i)); S.scene.add(g); g.userData = { c, i, lit: false, st }; tapHit(g, 0.65); return g; });
    G.W.layout = () => stones.forEach(g => g.position.copy(at(g.userData.i)));
    /* the weak letters he missed in earlier checks come first */
    const wk = weak().filter(c => board.includes(c)), calls = [...new Set([...wk, ...shuffle(board)])].slice(0, 6);
    G.rounds(calls.length); await G.say('Sound bingo! Listen to the sound.', 'Tap its letter stone.');
    for (const c of calls) {
      G.newRound(); const goal = stones.find(g => g.userData.c === c && !g.userData.lit) || stones.find(g => g.userData.c === c);
      await G.say('Listen.', snd(c));
      G.expect({ kind: 'tap', at: goal }); G.A.wrongMove = { kind: 'tap', at: stones.find(g => g.userData.c !== c) };
      G.hint(async () => { goal.scale.setScalar(1.15); await G.say('Listen again.', snd(c)); });
      await new Promise(res => { G.taps = []; stones.forEach(g => G.tap(g.children[g.children.length - 1], async () => { audio.letter(g.userData.c);
        if (g.userData.c === c) { G.taps = []; g.userData.lit = true; g.userData.st.material = toon(0xFFD23F, { emissive: 0xAA7700, ei: .4, clear: 1 }); g.scale.setScalar(1); await G.right(g.position); res(); }
        else await G.wrong(['That stone says this.', snd(g.userData.c), 'Find the other sound.']); })); });
    }
    await G.done('Bingo! Great listening!');
  }
};

/* =========================================================== chalk: mixed tracing on a chalkboard =========================================================== */
const chalk = {
  world(G) { const W = base(G.S, 'garden', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6.5, { s: 1.6 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 0.16), toon(0x2E5A46, { rough: .9, clear: 0 })); board.position.set(0, 2.75, -0.2); G.S.scene.add(board);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(5.5, 4.5, 0.12), toon(0xC98A4B)); frame.position.set(0, 2.75, -0.3); G.S.scene.add(frame);
    [-1, 1].forEach(s => { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.0, 10), toon(0xC98A4B)); leg.position.set(s * 2.4, 0.5, -0.3); G.S.scene.add(leg); });
    G.view({ wide: [-0.3, 2.7, 11, 6.4, 0.17], narrow: [0, 2.8, 5.6, 8.6, 0.2] }); return W; },
  async play(G) {
    const S = G.S, picks = shuffle(['a', 'd', 'm', 'p', 't', 'n', 'i']).slice(0, 4); G.rounds(picks.length);
    await G.say('Chalkboard time! Trace each letter.', 'A different one each time.');
    for (const ch of picks) {
      G.newRound(); const strokes = letterPoints(ch, 0, 2.7, 0.85, 0.05);
      const lines = strokes.map(P => { if (P.length < 3) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), toon(0xFFFFFF, { emissive: 0x666666, ei: .6 })); d.position.copy(P[0]); d.visible = false; S.scene.add(d); return { dot: d }; }
        const g = growTube(P, () => 0.1, (t, nn, c) => c.set(0xFFFFFF), 8), m = new THREE.Mesh(g, toon(0xffffff, { vc: true, emissive: 0x777777, ei: .6, rough: .9 })); g.userData.grow(0); S.scene.add(m); return { g, m }; });
      const T = tracer(S, strokes, { onMove: T => { lines.forEach((L, i) => { const k = i < T.si ? 1 : i === T.si ? T.strokeProgress() : 0; if (L.g) L.g.userData.grow(k); if (L.dot) L.dot.visible = k > 0; }); if (S.t - (G.lastSnd || -9) > 0.9) { G.lastSnd = S.t; audio.letter(ch); } }, onStroke: () => audio.chime([784, 988]) });
      G.A.traceStrokes = () => T.strokes.map(P => P.map(p => S.toScreen(p)));
      await G.say('This one says...', snd(ch), 'Trace it with your finger.');
      G.expect({ kind: 'trace' }); G.A.wrongMove = null; T.on = true;
      await new Promise(res => { T.onDone = () => res(); });
      lines.forEach(L => { if (L.g) L.g.userData.grow(1); if (L.dot) L.dot.visible = true; }); S.scene.remove(T.dots, T.start);
      await G.right(V(0, 3, 0.4), 'Beautiful!'); await audio.letter(ch);
      lines.forEach(L => S.scene.remove(L.m || L.dot));
    }
    await G.done('Your writing is getting strong!');
  }
};

/* =========================================================== catch: rhyme catch =========================================================== */
const RH = [['cat', ['hat', 'sun', 'mop']], ['bee', ['tree', 'dog', 'cake']], ['goat', ['boat', 'pin', 'sock']], ['moon', ['spoon', 'map', 'duck']], ['clock', ['sock', 'bell', 'nest']]];
const catchG = {
  world(G) { const W = base(G.S, 'garden', { clearW: 7 }); G.big = tree(G.S, 0, -3.2, { s: 1.9, c1: 0x16883A, c2: 0x8EDB4A, puffs: 12 }); tree(G.S, -9, -6, { s: 1.4 }); tree(G.S, 9, -6, { s: 1.5 });
    G.view({ wide: [0, 2.8, 11.6, 6.6, 0.15], narrow: [0, 3.0, 5.4, 8.6, 0.18] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(RH.length);
    await G.say('Rhyme catch! Pictures fall from the tree.', 'Tap the one that rhymes before it lands.');
    for (const [key, opts] of RH) {
      G.newRound(); const k = G.item(key, () => n() ? V(-1.4, 1.0, 1.6) : V(-3.6, 1.0, 1.2), { size: 1.1 });
      await G.say(say(key) + '. What rhymes with ' + say(key) + '?');
      /* three pictures drift down slowly from the leaves; they float back up if none is caught */
      const its = shuffle(opts).map((w, i) => G.item(w, () => V((n() ? -1.3 : -1.8) + i * (n() ? 1.3 : 1.8) + 0.6, 5.4, -0.6), { size: 0.95, data: { roam: true, t0: i * 0.6 } }));
      let t0 = 0, done = false; const tick = (t, dt) => { if (done) return; t0 += dt * (FAST ? 0.35 : 0.5); its.forEach(it => { if (!it.live || it.placed) return; const y = 5.4 - ((t0 + it.data.t0) % 4.0) * 1.1; it.home.y = y; if (!it.moving) it.obj.position.y = y; }); }; S.tick(tick);
      const good = its.find(i => i.name === opts[0]);
      G.expect({ kind: 'tap', at: good }); G.A.wrongMove = { kind: 'tap', at: its.find(i => i !== good) };
      G.hint(async () => { good.glow(true); await G.say(say(key) + '... ' + say(good.name) + '.'); });
      await new Promise(res => its.forEach(it => it.onTap = async () => { it.poke(); await it.say(); if (it === good) { done = true; its.forEach(x => x.onTap = () => {}); await it.moveTo(k.obj.position.clone().add(V(1.2, 0, 0)), 400); await G.right(it.obj.position, say(key) + ', ' + say(it.name) + '!'); res(); }
        else await G.wrong([say(key) + ', ' + say(it.name) + '. Listen to the end.'], it); }));
      await clearItems(G);
    }
    await G.done('You caught every rhyme!');
  }
};

/* =========================================================== bridge: the word bridge =========================================================== */
const BRIDGE = [['map', ['map', 'mat']], ['pin', ['pin', 'tin']], ['mat', ['mat', 'map']], ['pan', ['pan', 'pin']], ['tin', ['tin', 'pan']]];
const bridge = {
  world(G) { const W = base(G.S, 'pond', { clearW: 8 }); pond(G.S, 0, -0.2, 2.6, 2.6); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F });
    G.stones = []; for (let i = 0; i < 5; i++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.2, 28), toon(0xE3D7C9, { rough: .6 })); s.position.set(-4 + i * 2, 0.1, 0.2 + Math.sin(i) * 0.4); G.S.scene.add(s); G.stones.push(s); }
    G.view({ wide: [0, 1.9, 11.6, 5.8, 0.22], narrow: [0, 2.0, 5.2, 8.0, 0.26] }); G.mendyAt = { wide: [-4.9, 2.2, 0.8], narrow: [-1.5, 3.9, 0.45] }; return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(BRIDGE.length);
    const lay = () => G.stones.forEach((s, i) => { s.position.x = n() ? -2 + i : -4 + i * 2; }); lay(); G.W.layout = lay;
    const walker = prop('duck'); walker.scale.setScalar(0.6); S.scene.add(walker); const wAt = i => G.stones[Math.max(0, i)].position.clone().add(V(0, 0.55, 0)); walker.position.copy(wAt(0)).add(V(n() ? -1 : -2, 0, 0));
    await G.say('Help the duck cross the stream!', 'Read the word, then tap its picture.');
    for (let r = 0; r < BRIDGE.length; r++) {
      G.newRound(); const [w, opts] = BRIDGE[r]; const word = wordTiles(S, w, n() ? 0.5 : 0.6); word.position.set(0, 3.9, -0.8);
      const its = shuffle(opts).map((p, i) => G.item(p, () => n() ? V(-1.1 + i * 2.2, 2.3, -0.2) : V(-1.6 + i * 3.2, 2.3, -0.4), { size: 1.0 })), good = its.find(i => i.name === w);
      await G.say('Read this word. Tap its picture.');
      G.expect({ kind: 'tap', at: good }); G.A.wrongMove = { kind: 'tap', at: its.find(i => i !== good) };
      G.hint(async () => { await G.say('Read it slowly.', sounds(w)); });
      await new Promise(res => its.forEach(it => it.onTap = async () => { it.poke(); if (it === good) { its.forEach(x => x.onTap = () => {}); await it.say(); res(); } else { await it.say(); await G.wrong(['Read it again, sound by sound.', sounds(w)], it); } }));
      audio.boing(400); await S.tween(500, e => walker.position.lerpVectors(walker.position.clone(), wAt(r), e)); walker.position.copy(wAt(r));
      await G.right(walker.position, say(w) + '!'); S.scene.remove(word); await clearItems(G);
    }
    await S.tween(600, e => walker.position.x += 0.04); await G.done('The duck is across! You read it all!');
  }
};

/* =========================================================== check: mixed mastery =========================================================== */
const check = {
  world(G) { const W = base(G.S, 'sunset'); tree(G.S, -9, -6, { s: 1.5, c1: 0x3A9E5A, c2: 0xB8E06A }); tree(G.S, 9.5, -7, { s: 1.6, c1: 0xC85AA8, c2: 0xFFC2E2 }); G.st = stump(G.S, 0, -1.6, 0.9, 1.1);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); const missed = new Set();
    const Q = [...shuffle(LET).slice(0, 4).map(ch => ({ k: 'sound', ch })), { k: 'pic', w: 'map' }, { k: 'pic', w: 'pin' }, { k: 'pic', w: 'tin' }, { k: 'rhyme', w: 'cat', goal: 'hat', opts: ['hat', 'dog', 'pin'] }];
    G.rounds(Q.length); await G.say('Show me what you know!', 'Tap the right one each time.');
    const pos = (i, m) => n() ? (m > 3 ? V(-0.75 + (i % 2) * 1.5, 2.3 - Math.floor(i / 2) * 1.5, 1.0) : V((i - (m - 1) / 2) * 1.6, 0.85, 1.4)) : V((i - (m - 1) / 2) * (m > 3 ? 2.2 : 2.9), 0.85, 1.0);
    for (const q of Q) {
      G.newRound(); let objs = [], goal, ask, extra = [];
      if (q.k === 'sound') { const L = shuffle([q.ch, ...shuffle(LET.filter(c => c !== q.ch)).slice(0, 3)]); objs = L.map((c, i) => { const t = letterTile(c); t.position.copy(pos(i, 4)); t.scale.setScalar(n() ? 0.85 : 0.82); S.scene.add(t); t.userData.c = c; return t; });
        goal = objs[L.indexOf(q.ch)]; ask = ['Which letter says this sound?', snd(q.ch)]; }
      if (q.k === 'pic') { const g = wordTiles(S, q.w, 0.55); g.position.set(0, 2.35, -1.6); extra.push(g); const ps = shuffle([q.w, ...shuffle(['map', 'mat', 'pin', 'tin', 'pan'].filter(x => x !== q.w)).slice(0, 2)]);
        objs = ps.map((w, i) => { const p = prop(w); p.position.copy(pos(i, 3)); S.scene.add(p); p.userData.w = w; return p; }); goal = objs[ps.indexOf(q.w)]; ask = ['Read the word. Tap its picture.']; }
      if (q.k === 'rhyme') { const key = prop(q.w); key.position.set(0, 2.3, -1.6); S.scene.add(key); extra.push(key); objs = shuffle(q.opts).map((w, i) => { const p = prop(w); p.position.copy(pos(i, 3)); S.scene.add(p); p.userData.w = w; return p; });
        goal = objs.find(o => o.userData.w === q.goal); ask = ['Tap the picture that rhymes with cat.']; }
      await G.say(ask);
      G.expect({ kind: 'tap', at: goal }); G.A.wrongMove = { kind: 'tap', at: objs.find(o => o !== goal) };
      await new Promise(res => { let tries = 0; objs.forEach(o => G.tap(tapHit(o, 0.8), async () => { if (q.k === 'sound') audio.letter(o.userData.c); else audio.say(say(o.userData.w));
        if (o === goal) { G.taps = []; await G.right(o.position); res(); } else { tries++; if (q.ch) missed.add(q.ch); await G.wrong(tries < 2 ? ['Look again.', ...ask] : ['This one!']); if (tries >= 2) goal.scale.multiplyScalar(1.2); } })); });
      objs.concat(extra).forEach(o => S.scene.remove(o)); G.taps = [];
    }
    try { localStorage.setItem('kabc-weak', JSON.stringify([...missed])); } catch (e) {}   /* the sounds he missed come back first next time */
    await G.done(G.A.firstTry >= Q.length - 1 ? 'Review week is done. Wonderful!' : 'Good work! Let\'s practice more.');
  }
};

export const GAMES = { opener, bingo, chalk, catch: catchG, bridge, speed: slide(['sad', 'mad', 'dip', 'tip', 'pad', 'sip'], 'Bonus! More words on the slide.', 'cat', true), check };
