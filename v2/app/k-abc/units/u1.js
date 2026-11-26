/* Kindergarten ABC 2.0 — Unit 1: Ears On (week 1). v2/curriculum/k-abc/MAP.md
   Skill: hear rhymes, clap word parts, hear the first sound of a word, and know that we read left to right (no letters yet).
   Also from 1.0's K (Pencil Power): finger paths (lines, curves, circle, zigzag) to get his hand ready for writing letters.
   Every game is a different kind (NOTES.md keeps the list):
   opener  - the lesson: Mendy shows each listening skill, the boy taps along, then the clapping song (getting ready for cheder)
   rhyme   - Rhyme Pond: drag a picture across the pond onto the picture that rhymes
   clap    - Drum Hill: tap the big drum once for each word part, then the check button
   sort    - Sound Garden: drag pictures into the mmm basket or the sss basket
   train   - The Picture Train: load picture-cars from the engine side, the train "reads" them left to right, tap where we start
   paths   - Bee Paths: trace the bee's flight path (line, across, hill, circle, zigzag) to the flower
   fixit   - Fix It: Eli said something about two pictures; thumbs up or down, then drag in the right picture
   check   - The mastery check: tap kinds only (the rhyme, how many claps, the first sound)
   review  - The Listening Walk: one quick round of each skill, mixed */
import { THREE, V, shuffle, rnd, audio, echo, WORDS, FAST, ease } from '../game.js';
import { base, tree, rock, pond, lilypad, stump, basket, fence, hive, track, shelf } from '../scenes.js';
import { prop } from '../props.js';
import { tracer, strokePoints, glow, C, toon, growTube } from '../kit3d.js';

export const ORDER = ['opener', 'rhyme', 'clap', 'sort', 'train', 'paths', 'fixit', 'review', 'check'];   /* the review practises the check's tap-one-of-three before the check */
const say = w => (WORDS[w] ? WORDS[w].say : w);
const sound = { m: () => audio.hum(700), s: () => audio.hiss(700) };

/* ---------- small helpers every game uses ---------- */
function tapOnce(G, it, wrongs = []) {   /* wait until he taps this picture */
  return new Promise(res => { G.expect({ kind: 'tap', at: it }); G.A.wrongMove = wrongs[0] ? { kind: 'tap', at: wrongs[0] } : null;
    const prev = it.onTap; it.onTap = () => { prev(); it.onTap = prev; res(); }; });
}
function pairUp(G, a, b, mid, gap = 0.62) { a.placed = b.placed = true; a.home = mid.clone().add(V(-gap, 0, 0)); b.home = mid.clone().add(V(gap, 0, 0)); return Promise.all([a.moveTo(a.home, 600), b.moveTo(b.home, 600)]); }
function clearItems(G) { return Promise.all(G.items.slice().map(i => i.remove())); }
/* a beat pad: a round stone with 1, 2 or 3 glowing dots (no numbers), used to answer "how many claps?" */
function beatPad(S, n) {
  const G = new THREE.Group(), stone = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.2, 40), toon(0xF4EEFF, { rough: .4, clear: .6 })); stone.rotation.x = Math.PI / 2; G.add(stone);
  for (let i = 0; i < n; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), glow(0xFFB020, 1.6)); d.position.set((i - (n - 1) / 2) * 0.36, 0, 0.14); G.add(d); }
  S.scene.add(G); return G;
}
/* the big drum on a stump: tap it and it booms and bounces */
function bigDrum(G, x, y, z, s = 1) {
  const st = stump(G.S, x, z, 1.1 * s, 0.6 * s), D = prop('drum'); D.scale.setScalar(1.9 * s); D.position.set(x, st.position.y + 0.6 * s + 0.6 * s, z); G.S.scene.add(D);
  let k = 0; G.S.tick((t, dt) => { k = Math.max(0, k - dt * 4); D.scale.set(1.9 * s * (1 + k * 0.08), 1.9 * s * (1 - k * 0.12), 1.9 * s * (1 + k * 0.08)); });
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); D.add(hit);
  return { D, st, hit, boom() { k = 1; audio.drum(); G.P.twinkle(D.position.clone().add(V(0, 0.8, 0.5)), 3); }, move(x2, z2) { D.position.x = x2; st.position.x = x2; } };
}

/* =========================================================== opener =========================================================== */
const opener = {
  world(G) { const W = base(G.S, 'morning'); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 8.5, -7, { s: 1.7, c1: 0xE85A9E, c2: 0xFFC2E2 }); rock(G.S, 6.5, 1.5, 0.5);
    G.table = shelf(G.S, -3.2, 3.2, -0.6, 1.1, 0xC98A4B, 1.6);   /* Mendy's garden table: everything he shows stands on it */
    G.view({ wide: [-0.4, 2.0, 11.6, 5.8, 0.17], narrow: [0, 2.2, 5.0, 7.6, 0.2] }); return W; },
  async play(G) {
    const n = G.narrow(); G.rounds(5);
    await G.say('Hi! I am Mendy.', 'This week, we put our ears on!');
    /* 1. listen */
    G.newRound(); const bell = G.item('bell', () => V(0.3, 1.95, -0.6), { size: 1.4 }); bell.onTap = () => { audio.bell(); bell.poke(); };
    await G.say('Listen!', echo(() => { audio.bell(); bell.poke(); return G.wait(700); }), 'Now you. Tap the bell!');
    await tapOnce(G, bell); await G.right(bell.obj.position, 'Good listening!'); await bell.remove();
    /* 2. rhyme */
    G.newRound(); const cat = G.item('cat', () => G.narrow() ? V(-1.1, 1.95, -0.6) : V(-1.6, 1.95, -0.6), { size: 1.3 }), hat = G.item('hat', () => G.narrow() ? V(1.3, 1.85, -0.6) : V(1.8, 1.85, -0.6), { size: 1.3 });
    await G.say('Cat.', 'Hat.', 'Cat ends with at. Hat ends with at!', 'Same end. They rhyme!');
    await G.say('Tap the cat.'); await tapOnce(G, cat, [hat]);
    await G.say('Now tap the hat.'); await tapOnce(G, hat, [cat]);
    G.mendy.set('point', 1.5); await G.trail(cat.obj.position, hat.obj.position);
    await G.right(V(0, 3.2, 0.5), 'Cat, hat. Rhyme time!'); await clearItems(G);
    /* 3. beats */
    G.newRound(); const can = G.item('candles', () => G.narrow() ? V(-0.9, 1.95, -0.6) : V(-1.6, 1.95, -0.6), { size: 1.3 });
    const drum = bigDrum(G, n ? 1.3 : 2.4, 0, 1.6, n ? 0.7 : 0.9);
    await G.say('Shabbos. Shab-bos.', 'Let\'s clap it!', echo(async () => { for (const b of ['Shab', 'bos']) { G.mendy.set('clap', 0.5); audio.clap(); await audio.say(b); await G.wait(250); } }));
    await G.say('Two claps! Now you. Tap the drum two times.');
    await new Promise(res => { let c = 0; G.expect({ kind: 'tap', at: drum.D }); G.tap(drum.hit, () => { drum.boom(); c++; G.expect(c >= 2 ? null : { kind: 'tap', at: drum.D }); if (c === 2) res(); }); });
    await G.right(drum.D.position, 'Shab-bos. Two claps!'); await clearItems(G); drum.D.visible = false; drum.st.visible = false;
    /* 4. first sound */
    G.newRound(); const moon = G.item('moon', () => V(0.3, 2.0, -0.6), { size: 1.5 }); moon.onTap = () => { sound.m(); moon.poke(); };
    await G.say('Moon.', 'Mmm... moon.', echo(() => sound.m()), 'Moon starts with mmm.', 'Tap the moon and say mmm!');
    await tapOnce(G, moon); await G.right(moon.obj.position, 'Mmm, moon!'); await moon.remove();
    /* 5. left to right */
    G.newRound(); const row = ['hat', 'moon', 'fish'].map((w, i) => G.item(w, () => G.narrow() ? V(-1.3 + i * 1.3, 1.85, -0.6) : V(-2.0 + i * 2.0, 1.85, -0.6), { size: 1.1 }));
    await G.say('When we read, we go this way.', echo(async () => { for (const it of row) { it.glow(true); await it.say(); await G.wait(250); it.glow(false); } }), 'Tap the one we say first.');
    await tapOnce(G, row[0], row[2]); await G.right(row[0].obj.position, 'Yes! We start on this side.'); await clearItems(G);
    /* the song: getting ready for cheder, clap along */
    G.A.name = 'song';
    await G.say('Now our clapping song! Clap with me.');
    for (const [l, parts] of [['Washing hands, splash, splash!', ['Wash', 'ing']], ['Kippah on, quick as a flash!', ['Kip', 'pah']], ['Tzitzis on, I\'m on my way.', ['Tzit', 'zis']], ['Off to cheder, learn today!', ['Che', 'der']]]) {
      await G.say(l); for (const b of parts) { G.mendy.set('clap', 0.4); audio.clap(); await audio.say(b); await G.wait(200); } }   /* one clap for each part */
    G.A.name = 'play';
    await G.done('Your ears are on! Let\'s play!');
  }
};

/* =========================================================== rhyme: Rhyme Pond =========================================================== */
const SETS = [[['cat', 'hat'], ['sun', 'bun'], ['goat', 'boat']], [['bee', 'tree'], ['star', 'car'], ['fish', 'dish']], [['clock', 'sock'], ['bell', 'shell'], ['moon', 'spoon']]];
const rhyme = {
  world(G) { const W = base(G.S, 'pond', { clearW: 8, skip: (x, z) => Math.hypot(x / 2.1, z + 0.4) < 3.2 }); pond(G.S, 0, -0.4, 3.0, 1.75); tree(G.S, -10, -7, { s: 1.6 }); tree(G.S, 9, -6, { s: 1.5 });
    [[-7, 1.2, .5], [6.8, 0.8, .4], [-6.2, -3.5, .55]].forEach(([x, z, r]) => rock(G.S, x, z, r, 0xE3D7C9));
    const pads = []; for (let i = 0; i < 6; i++) { const p = lilypad(G.S, 0.75); pads.push(p); } G.pads = pads; G.cur = [];
    G.S.tick(t => pads.forEach((p, i) => { p.rotation.y = i + Math.sin(t * 0.5 + i) * 0.1; const it = G.cur[i];   /* each picture floats on its own lily pad */
      if (it && it.live && !it.placed) { p.visible = true; p.position.set(it.home.x, 0.1, it.home.z); } else p.visible = false; }));
    G.view({ wide: [0, 1.7, 11.6, 5.4, 0.3], narrow: [0, 1.4, 5.0, 7.6, 0.42] }); G.mendyAt = { wide: [-5.0, -0.6, 1.0], narrow: [-1.4, 3.7, 0.55] }; return W; },
  async play(G) {
    const extra = []; G.rounds(6);
    const rowZ = [1.8, 0.0, -1.8], spot = (side, i) => () => G.narrow() ? V(-1.45 + i * 1.6, 0.8, side ? -2.6 : 0.4) : V(side ? 3.4 : -3.4, 0.8, rowZ[i]);   /* standing on lily pads in the pond */
    let first = true;
    for (let si = 0; si < 3; si++) {
      if (si === 2) { if (G.A.firstTry < 6) break; G.rounds(3); await G.say('Bonus pond! Quick ears, here we go!'); }
      const pairs = SETS[si], order = shuffle([0, 1, 2]);
      const L = pairs.map((p, i) => G.item(p[0], spot(0, i), { drag: true, size: 1.15, data: { pair: p[1] } }));
      const Rr = order.map((k, i) => G.item(pairs[k][1], spot(1, i), { size: 1.15 }));
      G.cur = [...L, ...Rr]; G.pads.forEach(p => p.scale.setScalar(0.7));
      if (first) { first = false;
        await G.say('Welcome to Rhyme Pond!', 'Watch me. Cat... hat. Both end with at!');
        const a = L[0], b = Rr.find(r => r.name === a.data.pair); G.mendy.set('point', 2); await G.trail(a.obj.position, b.obj.position); await a.moveTo(b.obj.position.clone().add(V(0, 0, 0.6)), 700); await a.goHome(500);
        await G.say('Now you! Drag a picture to the one that rhymes.'); }
      else await G.say('New pictures! Drag each one to its rhyme.');
      for (let k = 0; k < 3; k++) {
        G.newRound(); const left = L.filter(i => !i.placed);
        const target = it => Rr.find(r => r.name === it.data.pair);
        G.expect({ kind: 'drag', from: left[0], to: () => target(left[0]).obj.position });
        const wrongR = Rr.find(r => !r.placed && r.name !== left[0].data.pair); G.A.wrongMove = wrongR ? { kind: 'drag', from: left[0], to: () => wrongR.obj.position } : null;
        G.hint(async () => { const a = L.find(i => !i.placed), b = target(a); a.glow(true); b.glow(true); await G.say('Listen. ' + say(a.name) + '... ' + say(b.name) + '.'); await G.trail(a.obj.position, b.obj.position); });
        await new Promise(res => { G.onDrop(async (it, at) => {
          const hit = G.near(it, Rr.filter(r => !r.placed)); if (!hit) return false;
          if (hit.name === it.data.pair) { it.glow(false); hit.glow(false); G.onDrop(null);
            it.size *= 0.78; hit.size *= 0.78; await pairUp(G, it, hit, G.narrow() ? V((k - 1) * 1.95, 0.7, -4.0) : V(0, 0.75, rowZ[k]), G.narrow() ? 0.45 : 0.55);   /* a matched pair shares a lily pad in the middle (phone: on the far bank) */
            await G.right(hit.obj.position, say(it.name) + ', ' + say(hit.name) + '!'); res(); return true; }
          await G.wrong(['Listen: ' + say(it.name) + ', ' + say(hit.name) + '.', 'Listen to the end. Try another!'], hit); return false; }); });
      }
      await clearItems(G);
    }
    G.pads.forEach(p => p.visible = false);
    await G.done('You found all the rhymes!');
  }
};

/* =========================================================== clap: Drum Hill =========================================================== */
const clap = {
  world(G) { const W = base(G.S, 'golden'); tree(G.S, -9, -5, { s: 1.6, c1: 0x5A9E2A, c2: 0xD8E04A }); tree(G.S, 9.5, -6, { s: 1.4, c1: 0x6AAE2A, c2: 0xF2C84A }); rock(G.S, -6.5, 2, 0.5, 0xF0D8C8);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.0, 7.6, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); const drum = bigDrum(G, 1.6, 0, 0.6, 1); const place = () => drum.move(n() ? 0.9 : 1.6, 0.6); place(); G.W.layout = place;
    /* the beat dots that light up above the drum */
    const dots = []; for (let i = 0; i < 4; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), glow(0xFFB020, 1.8)); d.visible = false; S.scene.add(d); dots.push(d); }
    const showDots = (c, ghost) => dots.forEach((d, i) => { d.visible = i < c; d.position.set(drum.D.position.x + (i - (c - 1) / 2) * 0.6, drum.D.position.y + 1.5, 0.8); d.material.color.set(ghost ? 0x8899AA : 0xFFB020).multiplyScalar(ghost ? 1 : 1.8); });
    const picAt = () => n() ? V(-1.1, 0.85, -0.2) : V(-2.0, 0.9, -0.2);
    const words = ['sun', 'apple', 'banana', 'hat', 'cupcake', 'butterfly'];   /* one part, two, three, then again */
    G.rounds(words.length);
    await G.say('Welcome to Drum Hill!', 'Words have parts. We clap each part.');
    const w0 = G.item('candles', picAt, { size: 1.3 });
    await G.say('Watch me. Shab-bos.'); for (const b of WORDS.candles.beats) { drum.boom(); G.mendy.set('clap', 0.4); showDots(dots.filter(d => d.visible).length + 1); await audio.say(b); await G.wait(300); }
    await G.say('Two parts, two booms!'); showDots(0); await w0.remove();
    let tries = 0;
    for (const w of words) {
      G.newRound(); const it = G.item(w, picAt, { size: 1.3 }), need = WORDS[w].beats.length; let c = 0;
      const sayParts = echo(async () => { for (const b of WORDS[w].beats) { await audio.say(b); await G.wait(220); } });
      await G.say(say(w) + '.', sayParts, 'Tap the drum for each part.');
      const setExp = () => { G.expect(c < need ? { kind: 'tap', at: drum.D } : { kind: 'button', sel: '#ok' }); G.A.wrongMove = c === 0 ? null : c === need ? { kind: 'tap', at: drum.D } : { kind: 'button', sel: '#ok' }; };
      setExp();
      G.hint(async () => { await G.say('Watch the dots.'); for (let k = 1; k <= need; k++) { showDots(k, true); await audio.say(WORDS[w].beats[k - 1]); await G.wait(250); } });
      G.taps = G.taps.filter(x => x.obj !== drum.hit);
      G.tap(drum.hit, () => { drum.boom(); c++; G.mendy.set('clap', 0.3); showDots(Math.min(4, c)); const b = WORDS[w].beats[c - 1]; if (b) audio.say(b); G.button('ok', true); setExp(); });
      for (;;) {
        await G.pressed('ok'); G.button('ok', false);
        if (c === need) { const pad = beatPad(S, need); pad.position.copy(drum.D.position).add(V(0, 1.6, 0.6)); pad.scale.setScalar(0.8);   /* the dot stone for this many parts (used again in the check) */
          await G.right(drum.D.position, say(w) + '. ' + ['One', 'Two', 'Three'][need - 1] + (need > 1 ? ' parts!' : ' part!')); S.scene.remove(pad); break; }
        c = 0; showDots(0); setExp(); await G.wrong(['Let\'s clap it together.', sayParts, 'Now you!']);
      }
      showDots(0); G.taps = G.taps.filter(x => x.obj !== drum.hit); await it.remove(); tries++;
    }
    await G.done('Great clapping!');
  }
};

/* =========================================================== sort: Sound Garden =========================================================== */
const sort = {
  world(G) { const W = base(G.S, 'garden'); tree(G.S, -8.5, -5.5, { s: 1.5, c1: 0x188F3E, c2: 0xA6E64A }); tree(G.S, 9, -7, { s: 1.6, c1: 0xE85A9E, c2: 0xFFC2E2 }); fence(G.S, -9, 9, -4.2);
    G.shelfW = shelf(G.S, -4.9, 4.9, -1.6, 1.3, 0xD9A066); G.shelfN = shelf(G.S, -2.7, 2.7, -1.2, 1.3, 0xD9A066); G.shelfN2 = shelf(G.S, -2.7, 2.7, -2.8, 2.6, 0xD9A066);
    G.W_lay = () => { const n = G.narrow(); G.shelfW.visible = !n; G.shelfN.visible = G.shelfN2.visible = n; }; G.W_lay();
    G.view({ wide: [0, 2.1, 11.6, 5.8, 0.2], narrow: [0, 2.3, 5.0, 7.8, 0.22] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow();
    const bM = basket(S, 0xD8A060, 1.05), bS = basket(S, 0xC8925A, 1.05);
    const keyM = prop('moon'), keyS = prop('snake'); [keyM, keyS].forEach(k => { k.scale.setScalar(0.62); S.scene.add(k); });
    const place = () => { const x = n() ? 1.35 : 2.6, y = n() ? 0.4 : 0; bM.position.set(-x, y, 0.8); bS.position.set(x, y, 0.8); bM.scale.setScalar(n() ? 0.8 : 1); bS.scale.setScalar(n() ? 0.8 : 1);
      keyM.position.set(-x, y + (n() ? 1.15 : 1.4), 1.9); keyS.position.set(x, y + (n() ? 1.15 : 1.4), 1.9); };
    place(); G.W.layout = () => { place(); G.W_lay(); };
    const baskets = [{ b: bM, k: 'm', key: keyM, word: 'moon' }, { b: bS, k: 's', key: keyS, word: 'snake' }];
    baskets.forEach(B => { const h = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); h.position.y = 0.6; B.b.add(h); B.hit = h;
      G.tap(h, () => { sound[B.k](); B.key.rotation.z = 0.3; setTimeout(() => B.key.rotation.z = 0, 300); }); G.tap(B.key, () => sound[B.k]()); });
    const M = ['mop', 'mug', 'mouse'], Ss = ['sock', 'soup', 'snake'], items0 = shuffle([...M.map(w => [w, 'm']), ['sock', 's'], ['soup', 's']]).concat([['star', 's']]);   /* star (st...) is the hardest start, so it comes last */
    G.rounds(items0.length);
    await G.say('Welcome to the Sound Garden!', 'This basket says mmm.', echo(() => sound.m()), 'This basket says sss.', echo(() => sound.s()));
    const spot = i => () => n() ? (i < 3 ? V(-1.75 + i * 1.75, 3.45, -2.8) : V(-1.75 + (i - 3) * 1.75, 2.15, -1.2)) : V(-4.1 + i * 1.64, 2.05, -1.6);   /* standing on the garden shelf */
    const its = items0.map(([w, k], i) => G.item(w, spot(i), { drag: true, size: 0.95, data: { k } }));
    /* watch me: the first one */
    const d0 = its.find(i => i.data.k === 'm'); await G.say('Watch me.', say(d0.name) + '. Mmm... ' + say(d0.name) + '!');
    G.mendy.set('point', 2); await G.trail(d0.obj.position, bM.position.clone().add(V(0, 1.2, 0))); await d0.moveTo(bM.position.clone().add(V(0, 1.4, 0.6)), 700); await d0.goHome(500);
    await G.say('Now you! Listen to the first sound.', 'Drag each picture to its basket.');
    for (let r = 0; r < its.length; r++) {
      G.newRound(); const left = its.filter(i => !i.placed), cur = left[0], B = k => baskets.find(x => x.k === k);
      G.expect({ kind: 'drag', from: cur, to: () => B(cur.data.k).b.position.clone().add(V(0, 0.8, 0)) });
      G.A.wrongMove = { kind: 'drag', from: cur, to: () => B(cur.data.k === 'm' ? 's' : 'm').b.position.clone().add(V(0, 0.8, 0)) };
      G.hint(async () => { const a = its.find(i => !i.placed), b = B(a.data.k); a.glow(true); await G.say(say(a.name) + '.', echo(() => sound[a.data.k]())); await G.trail(a.obj.position, b.b.position.clone().add(V(0, 1, 0))); });
      await new Promise(res => { G.onDrop(async (it, at) => {
        const hit = G.near(it, baskets.map(x => x.b.position.clone().add(V(0, 0.9 * x.b.scale.x, 0))), 150); const hb = hit && baskets.find(x => x.b.position.x === hit.x); if (!hb) return false; const hitB = hb;
        if (hitB.k === it.data.k) { it.glow(false); it.placed = true; G.onDrop(null);
          await it.moveTo(hitB.b.position.clone().add(V(rnd(-0.35, 0.35), 0.75 * hitB.b.scale.x, rnd(0, 0.3))), 400); it.size *= 0.7;
          await G.right(hitB.b.position.clone().add(V(0, 1.5, 0)), say(it.name) + '! ' + (hitB.k === 'm' ? 'Mmm.' : 'Sss.')); res(); return true; }
        await G.wrong([say(it.name) + '. Listen to the start.', echo(() => sound[it.data.k]()), 'Try the other basket!'], it); return false; }); });
    }
    await G.done('Every picture is home!');
  }
};

/* =========================================================== train: The Picture Train =========================================================== */
function makeTrain(S) {
  const G = new THREE.Group(), red = toon(0xE8434F, { clear: 1, rough: .25 }), blue = toon(0x3D8BFF, { clear: 1, rough: .25 }), gold = toon(0xFFD23F, { metal: .4, clear: 1 }), dark = toon(0x2B2B36);
  const eng = new THREE.Group(); const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.2, 28), red); boiler.rotation.z = Math.PI / 2; boiler.position.set(0.15, 0.72, 0); eng.add(boiler);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.0, 0.95), blue); cab.position.set(-0.6, 0.95, 0); eng.add(cab); const roof = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 1.1), red); roof.position.set(-0.6, 1.5, 0); eng.add(roof);
  const chim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.45, 16), dark); chim.position.set(0.45, 1.3, 0); eng.add(chim); const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 28), gold); nose.rotation.z = Math.PI / 2; nose.position.set(0.78, 0.72, 0); eng.add(nose);
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.97), toon(0xCDEFFF, { rough: .05, clear: 1 })); win.position.set(-0.6, 1.1, 0); eng.add(win);
  const wheel = (x, p, r = 0.24) => { [-0.45, 0.45].forEach(z => { const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.1, 20), dark); w.rotation.x = Math.PI / 2; w.position.set(x, r, z); p.add(w); const h = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.4, r * 0.4, 0.12, 12), gold); h.rotation.x = Math.PI / 2; h.position.set(x, r, z); p.add(h); }); };
  wheel(-0.6, eng, 0.3); wheel(0.35, eng); G.add(eng); eng.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const cars = [0xFFB020, 0x2ED16B, 0xB45CFF].map((c, i) => { const car = new THREE.Group(), bed = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.28, 0.95), toon(c, { clear: 1, rough: .3 })); bed.position.y = 0.48; car.add(bed);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.08, 1.0), gold); rim.position.y = 0.64; car.add(rim); wheel(-0.4, car); wheel(0.4, car); car.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const slot = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 40), new THREE.MeshBasicMaterial({ color: C(0xFFF3A0).multiplyScalar(1.6), transparent: true, opacity: 0, side: THREE.DoubleSide })); slot.position.set(0, 1.4, 0.4); car.add(slot); car.userData.slot = slot;
    G.add(car); return car; });
  const flag = new THREE.Group(), pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.9, 10), toon(0xFFFFFF, { clear: 1 })); pole.position.y = 0.95; flag.add(pole);   /* the green start flag */
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.48, 8, 1), toon(0x2ED16B, { side: THREE.DoubleSide, emissive: 0x0A6A2A, ei: .3 })); cloth.position.set(0.4, 1.62, 0); flag.add(cloth); G.add(flag);
  S.tick(t => { const p = cloth.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(t * 4 + p.getX(i) * 6) * 0.05 * (p.getX(i) + 0.375)); p.needsUpdate = true; });
  S.scene.add(G); return { G, eng, cars, chim, flag };
}
const train = {
  world(G) { const W = base(G.S, 'hills', { clearW: 9 }); tree(G.S, -9, -7, { s: 1.4 }); tree(G.S, 10, -6, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F }); G.mendyAt = { wide: [-4.6, 1.4, 0.92], narrow: [1.5, 3.7, 0.5] }; track(G.S, -14, 14, 0.4); G.plat = shelf(G.S, -4.6, 4.6, -1.7, 1.2, 0xE0B070, 1.3);   /* the station platform */
    G.view({ wide: [0, 1.8, 11.6, 5.4, 0.2], narrow: [0, 1.8, 5.0, 7.4, 0.22] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); const T = makeTrain(S);
    const lay = () => { T.G.scale.setScalar(n() ? 0.62 : 1); T.eng.position.set(2.75, 0, 0); T.cars.forEach((c, i) => c.position.set(-2.3 + i * 1.5, 0, 0)); T.flag.position.set(-3.55, 0, 0.55); T.G.position.set(n() ? 0.05 : 0.3, 0, 0.4); T.G.updateMatrixWorld(true); };
    lay(); G.W.layout = lay;
    let run = 0; S.tick((t, dt) => { T.G.position.y = 0.04 + (run ? Math.abs(Math.sin(t * 14)) * 0.03 : 0); });
    const slotPos = i => { T.G.updateMatrixWorld(true); return T.cars[i].localToWorld(V(0, 1.25, 0.2)); };
    const SETS2 = [['cat', 'sun', 'boat'], ['bee', 'cake', 'drum']];
    G.rounds(8);
    await G.say('All aboard the picture train!', 'The engine pulls the train this way.', echo(async () => { for (let k = 0; k < 3; k++) { T.cars[k].userData.slot.material.opacity = 0.9; G.P.twinkle(slotPos(k), 3); await G.wait(350); T.cars[k].userData.slot.material.opacity = 0; } T.chim.scale.setScalar(1.3); audio.choo(); await G.wait(300); T.chim.scale.setScalar(1); }));   /* the cars light up from the flag to the engine */
    for (let r = 0; r < 2; r++) {
      const spot = i => () => n() ? V(-1.75 + i * 1.75, 1.95, -1.7) : V(-2.8 + i * 2.8, 1.95, -1.7);   /* waiting on the platform */
      const pics = shuffle(SETS2[r]).map((w, i) => G.item(w, spot(i), { drag: true, size: 1.0 })), loaded = [];
      if (r === 0) { await G.say('Watch me. We start at the green flag.'); G.mendy.set('point', 2); T.cars[0].userData.slot.material.opacity = 0.8; await G.trail(pics[0].obj.position, slotPos(0)); T.cars[0].userData.slot.material.opacity = 0; await G.say('Now you! Fill the cars, starting at the flag.'); }
      else await G.say('A new train! Start at the green flag.');
      for (let k = 0; k < 3; k++) {
        G.newRound(); T.cars.forEach((c, i) => c.userData.slot.material.opacity = i === k ? 0.85 : 0);
        const cur = pics.find(p => !p.placed); G.expect({ kind: 'drag', from: cur, to: () => slotPos(k) }); G.A.wrongMove = k < 2 ? { kind: 'drag', from: cur, to: () => slotPos(2) } : null;
        G.hint(async () => { await G.trail(pics.find(p => !p.placed).obj.position, slotPos(k)); });
        await new Promise(res => { G.onDrop(async (it, at) => {
          const sp = [0, 1, 2].map(slotPos), hitP = G.near(it, sp, 130); if (!hitP) return false; const near = { i: sp.indexOf(hitP) };
          if (near.i === k) { G.onDrop(null); it.placed = true; loaded.push(it); it.size *= 0.85; await it.moveTo(slotPos(k), 300); it.home = slotPos(k);
            T.cars[k].userData.slot.material.opacity = 0; audio.pop(); G.A.rounds++; if (G.missed() === 0) G.A.firstTry++; const d = document.getElementById('pips').children[G.ri++]; if (d) d.className = G.missed() ? 'done' : 'star'; res(); return true; }
          await G.wrong(['We start at the green flag.', 'Fill this car first.']); T.cars[k].userData.slot.material.opacity = 1; return false; }); });
      }
      /* the train "reads" left to right */
      G.A.name = 'reading'; await G.say('Choo choo! The train reads this way.');
      audio.choo(); for (let k = 0; k < 3; k++) { loaded[k].glow(true); loaded[k].poke(); await loaded[k].say(); await G.wait(350); loaded[k].glow(false); }
      G.A.name = 'play';
      G.newRound(); await G.say('Where do we start? Tap the first picture.');
      await new Promise(res => { G.expect({ kind: 'tap', at: loaded[0] }); G.A.wrongMove = { kind: 'tap', at: loaded[2] };
        G.hint(async () => { loaded[0].glow(true); await G.say('Start at the green flag.'); });
        loaded.forEach((it, i) => { it.onTap = async () => { it.poke(); if (i === 0) { loaded.forEach(x => { x.onTap = () => x.say(); x.glow(false); }); await G.right(it.obj.position, 'Yes! We start on this side.'); res(); } else await G.wrong(['We start on this side, by the flag.']); }; }); });
      /* off it goes */
      run = 1; T.flag.visible = false; audio.choo(); const x0 = T.G.position.x; await S.tween(1600, e => { T.G.position.x = x0 + e * 16; loaded.forEach((it, k) => { it.moving = true; it.obj.position.copy(slotPos(k)); }); }, ease.inOut);
      loaded.forEach(it => { it.live = false; S.scene.remove(it.obj); }); G.items = []; run = 0; T.G.position.x = -16; await S.tween(1200, e => { T.G.position.x = -16 + e * (16 + x0); }, ease.out); T.flag.visible = true; lay();
    }
    await G.done('You read the train this way!');
  }
};

/* =========================================================== paths: Bee Paths =========================================================== */
const PATHS = [
  { d: 'M100 30 L100 180', word: 'down' },
  { d: 'M25 105 L175 105', word: 'across' },
  { d: 'M25 160 C40 40 160 40 175 160', word: 'over the hill' },
  { d: 'M100 35 C30 35 30 175 100 175 C170 175 170 35 102 35', word: 'around' },
  { d: 'M20 150 L55 60 L90 150 L125 60 L160 150 L180 100', word: 'zig zag' }
];
const paths = {
  world(G) { const W = base(G.S, 'meadow'); const t = tree(G.S, -8.5, -4, { s: 1.6 }); hive(G.S, -7.2, 3.7, -3.4); tree(G.S, 9, -6, { s: 1.5, c1: 0xE85A9E, c2: 0xFFC2E2 });
    G.view({ wide: [0, 2.6, 10.5, 6.6], narrow: [0, 2.8, 5.4, 8.6] }); return W; },
  async play(G) {
    const S = G.S, bee = prop('bee'); bee.scale.setScalar(0.7); S.scene.add(bee); bee.position.set(-6, 4, 0);
    const flower = prop('tree'); flower.visible = false;
    const bloom = new THREE.Group(); { const pg = new THREE.CircleGeometry(0.22, 16); for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(pg, toon(0xFF6FB5, { side: THREE.DoubleSide, emissive: 0xFF3D9A, ei: .2 })); const a = i / 6 * Math.PI * 2; p.position.set(Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0); bloom.add(p); }
      const c = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), toon(0xFFD23F, { emissive: 0xFFB000, ei: .4 })); c.position.z = 0.05; bloom.add(c); } S.scene.add(bloom); bloom.scale.setScalar(0.001);
    S.tick(t => { bee.userData.inner.children.forEach((c, i) => { if (c.scale.z < 0.3) c.rotation.y = Math.sin(t * 30 + i) * 0.6; }); bee.rotation.z = Math.sin(t * 3) * 0.1; });
    G.rounds(PATHS.length);
    await G.say('Buzz! The bee needs your help.', 'Draw her path to the flower.');
    for (let r = 0; r < PATHS.length; r++) {
      G.newRound(); const P = PATHS[r], pts = strokePoints(P.d, 0.06, 0, 2.6, 0);
      const trailG = growTube(pts, () => 0.13, (t, nr, c) => c.set(0xFFC93C).lerp(C(0xFFF3B0), Math.max(0, nr.z) * 0.5), 10), trail = new THREE.Mesh(trailG, toon(0xffffff, { vc: true, emissive: 0x664400, ei: 0.5, clear: 1 })); trailG.userData.grow(0); S.scene.add(trail);   /* the golden line he draws */
      const end = pts[pts.length - 1]; bloom.position.copy(end).add(V(0, 0, 0.1)); await S.tween(300, e => bloom.scale.setScalar(0.4 + e * 0.4));
      const T = tracer(S, [pts], { onMove: T => { const p = pts[T.k]; bee.position.copy(p).add(V(0, 0.15, 0.4)); trailG.userData.grow(T.progress()); audio.boing(500 + T.k * 4); G.A.trace = T.progress(); },
        onFar: () => { if (!G.R.busy) G.say('Start at the green light.'); }, onLost: () => { if (!G.R.busy) G.say('Keep going from the bee.'); }, onOff: () => {} });
      G.A.tracePts = () => pts.map(p => S.toScreen(p)); G.A.trace = 0;
      /* watch me: the bee flies it first */
      T.showDots = true; await S.tween(300, e => bee.position.lerp(pts[0].clone().add(V(0, 0.15, 0.4)), e));
      await G.say(r === 0 ? 'Watch the bee fly. Down!' : 'Watch. ' + P.word[0].toUpperCase() + P.word.slice(1) + '!');
      audio.whoosh(); await S.tween(1500, e => { const i = Math.min(pts.length - 1, Math.floor(e * (pts.length - 1))); bee.position.copy(pts[i]).add(V(0, 0.15, 0.4)); G.P.twinkle(pts[i], 1); }, ease.inOut);
      bee.position.copy(pts[0]).add(V(0, 0.15, 0.4));
      await G.say('Now you! Start at the green light.');
      G.expect({ kind: 'trace' }); G.A.wrongMove = null; T.on = true; T.lastProgress = S.t;
      await new Promise(res => { T.onDone = () => res(); const nag = setInterval(() => { if (!T.on) return clearInterval(nag); if (!T.down && S.t - T.lastProgress > 7 && !G.R.busy) { T.lastProgress = S.t; G.say('Put your finger on the green light.'); } }, 1000); });
      trailG.userData.grow(1); S.scene.remove(T.dots, T.start); await S.tween(500, e => bloom.scale.setScalar(0.8 + e * 0.6), ease.back);
      await G.right(end, ['Yum, a flower!', 'Buzz! You did it!', 'The bee is happy!', 'What a path!', 'Zig zag, yes!'][r]);
      await S.tween(300, e => bloom.scale.setScalar(1.4 * (1 - e) + 0.001)); S.scene.remove(trail);
    }
    await G.done('Your finger is ready to write!');
  }
};

/* =========================================================== fixit: Fix It =========================================================== */
const FIX = [
  { a: 'sun', b: 'map', ok: false, fix: ['bun', 'car'], kind: 'rhyme' },
  { a: 'cat', b: 'hat', ok: true, kind: 'rhyme' },
  { a: 'sock', claim: 'm', ok: false, kind: 'first' },
  { a: 'moon', b: 'spoon', ok: true, kind: 'rhyme' },
  { a: 'bee', b: 'car', ok: false, fix: ['tree', 'mop'], kind: 'rhyme' }
];
const fixit = {
  world(G) { const W = base(G.S, 'meadow', { clearW: 7 }); fence(G.S, -9, 9, -3.6, 0xFFF0DC); tree(G.S, -9, -7, { s: 1.6 }); tree(G.S, 8.5, -7.5, { s: 1.4 });
    G.view({ wide: [-0.3, 1.8, 11.2, 5.4, 0.2], narrow: [0, 1.8, 5.0, 7.4, 0.24] }); return W; },
  async play(G) {
    const n = () => G.narrow(); G.rounds(FIX.length);
    await G.say('Sometimes I get mixed up.', 'Check me! Thumbs up if I\'m right.');
    for (const f of FIX) {
      G.newRound();
      const A = G.item(f.a, () => n() ? V(-1.15, 1.0, -0.4) : V(-1.7, 1.0, -0.4), { size: 1.35 });
      let B = f.b ? G.item(f.b, () => n() ? V(1.15, 1.0, -0.4) : V(1.7, 1.0, -0.4), { size: 1.35 }) : null;
      G.mendy.set('point', 2);
      if (f.kind === 'rhyme') await G.say(say(f.a) + ' and ' + say(f.b) + ' rhyme!', 'Am I right?');
      else await G.say(say(f.a) + ' starts with ' + (f.claim === 'm' ? 'mmm.' : 'sss.'), 'Am I right?');
      G.button('yes', true); G.button('no', true);
      for (;;) {
        G.expect({ kind: 'button', sel: f.ok ? '#yes' : '#no' }); G.A.wrongMove = { kind: 'button', sel: f.ok ? '#no' : '#yes' };
        const p = await G.pressed('yes', 'no');
        if ((p === 'yes') === f.ok) break;
        await G.wrong(f.kind === 'rhyme' ? ['Listen again.', say(f.a) + '... ' + say(f.b) + '.'] : ['Listen again.', say(f.a) + '.', echo(() => sound[f.claim === 'm' ? 's' : 'm']())]);
      }
      G.button('yes', false); G.button('no', false);
      if (f.ok) { await G.right(V(0, 3.4, 0.5), 'Yes! I was right. ' + say(f.a) + ', ' + say(f.b) + '!'); await clearItems(G); continue; }
      await G.say('Oops, I got mixed up!', 'Let\'s fix it!');
      if (B) await B.remove();
      if (f.kind === 'first') {   /* the sock goes to the sss basket (the snake), not the mmm basket (the moon) */
        const bk = [['moon', 'm'], ['snake', 's']].map(([k, snd2], i) => { const b = basket(G.S, 0xD8A060, 0.85); const at = () => n() ? V(-1.2 + i * 2.4, 0, 2.0) : V(-0.8 + i * 3.2, 0, 1.6); b.position.copy(at()); b.scale.setScalar(n() ? 0.8 : 1);
          const key = prop(k); key.scale.setScalar(0.55); key.position.copy(at()).add(V(0, 1.25, 0.9)); G.S.scene.add(key); return { b, key, snd2, at }; });
        A.drag = true; await G.say('Sock. Sss... sock!', echo(() => sound.s()), 'Drag the sock to its basket.');
        const tgt = () => bk[1].b.position.clone().add(V(0, 0.9, 0));
        G.expect({ kind: 'drag', from: A, to: tgt }); G.A.wrongMove = { kind: 'drag', from: A, to: () => bk[0].b.position.clone().add(V(0, 0.9, 0)) };
        G.hint(async () => { A.glow(true); await G.trail(A.obj.position, tgt()); });
        await new Promise(res => G.onDrop(async (it, at) => { const h = G.near(it, bk.map(x => x.b.position.clone().add(V(0, 0.9, 0))), 150); if (!h) return false;
          if (Math.abs(h.x - bk[1].b.position.x) < 0.01) { G.onDrop(null); it.placed = true; await it.moveTo(tgt(), 300); await G.right(tgt(), 'Sss, sock! Fixed!'); res(); return true; }
          await G.wrong(['Sock. Listen to the start.', echo(() => sound.s())], it); return false; }));
        bk.forEach(x => { G.S.scene.remove(x.b); G.S.scene.remove(x.key); }); await clearItems(G); continue; }
      const want = f.fix[0], opts = shuffle(f.fix).map((w, i) => G.item(w, () => n() ? V(-1.0 + i * 2.0, 0.7, 2.3) : V(-1.4 + i * 2.8, 0.7, 2.2), { drag: true, size: 0.95 }));
      const slot = () => n() ? V(1.15, 1.0, -0.4) : V(1.7, 1.0, -0.4), ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.78, 48), new THREE.MeshBasicMaterial({ color: C(0xFFF3A0).multiplyScalar(1.6), transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
      ring.position.copy(slot()); G.S.scene.add(ring); G.S.tick(() => ring.scale.setScalar(1 + Math.sin(G.S.t * 5) * 0.08));   /* the empty spot glows */
      await G.say('Drag the picture that rhymes with ' + say(f.a) + '.');
      const good = opts.find(o => o.name === want), bad = opts.find(o => o.name !== want);
      G.expect({ kind: 'drag', from: good, to: slot }); G.A.wrongMove = { kind: 'drag', from: bad, to: slot };
      G.hint(async () => { good.glow(true); await G.trail(good.obj.position, slot()); });
      await new Promise(res => { G.onDrop(async (it, at) => { if (!G.near(it, [slot()], 140)) return false;
        if (it.name === want) { G.onDrop(null); it.placed = true; await it.moveTo(slot(), 300); ring.visible = false;
          await G.right(slot(), f.kind === 'rhyme' ? say(f.a) + ', ' + say(it.name) + '. Fixed!' : 'Mmm, ' + say(it.name) + '. Fixed!'); res(); return true; }
        await G.wrong(f.kind === 'rhyme' ? [say(f.a) + ', ' + say(it.name) + '. Not the same end.'] : [say(it.name) + '. That is not mmm.'], it); return false; }); });
      G.S.scene.remove(ring); await clearItems(G);
    }
    await G.done('Thank you for checking me!');
  }
};

/* =========================================================== check: the mastery check =========================================================== */
const CHECK = [
  { q: 'rhyme', w: 'cat', opts: ['hat', 'sun', 'mop'], goal: 'hat' },
  { q: 'claps', w: 'banana', n: 3 },
  { q: 'first', k: 'm', opts: ['mug', 'sock', 'bee'] },
  { q: 'rhyme', w: 'snake', opts: ['cake', 'sun', 'mop'], goal: 'cake' },
  { q: 'claps', w: 'apple', n: 2 },
  { q: 'first', k: 's', opts: ['moon', 'soup', 'cat'] }
];
const check = {
  world(G) { const W = base(G.S, 'sunset'); tree(G.S, -9, -6, { s: 1.5, c1: 0x3A9E5A, c2: 0xB8E06A }); tree(G.S, 9.5, -7, { s: 1.6, c1: 0xC85AA8, c2: 0xFFC2E2 }); stump(G.S, 0, -1.6, 0.9, 1.1);
    G.view({ wide: [-0.3, 1.8, 11.2, 5.4, 0.2], narrow: [0, 1.8, 5.0, 7.4, 0.24] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(CHECK.length);
    await G.say('Show me your listening!', 'Tap the right one each time.');
    for (const c of CHECK) {
      G.newRound(); let ask, right, targets = [];
      const pos = i => () => n() ? V(-1.75 + i * 1.75, 0.8, 1.4) : V(-3 + i * 3, 0.8, 1.0);
      if (c.q === 'claps') {
        const pic = G.item(c.w, () => V(0, 2.05, -1.6), { size: 1.2 });
        const sayParts = echo(async () => { for (const b of WORDS[c.w].beats) { await audio.say(b); await G.wait(200); } });   /* parts said, never clapped: he counts them himself */
        targets = [1, 2, 3].map((k, i) => { const p = beatPad(S, k); const at = pos(i); p.position.copy(at()); p.userData.k = k; p.userData.at = at; return p; });
        G.W.layout = () => targets.forEach(p => p.position.copy(p.userData.at()));
        ask = [say(c.w) + '.', sayParts, 'How many parts? Tap the stone with that many dots.'];
        right = targets[c.n - 1];
        G.expect({ kind: 'tap', at: () => right.position }); G.A.wrongMove = { kind: 'tap', at: () => targets[c.n === 1 ? 1 : 0].position };
        await G.say(ask);
        await new Promise(res => { let tries = 0; targets.forEach(p => G.tap(p, async () => { audio.pop();
          if (p === right) { await G.right(p.position, say(c.w) + '. ' + ['One', 'Two', 'Three'][c.n - 1] + ' parts!'); res(); }
          else { tries++; await G.wrong(tries < 2 ? ['Hmm. Listen again.', sayParts] : ['Count with me.', sayParts]); if (tries >= 2) { right.scale.setScalar(1.2); } } })); });
        targets.forEach(p => { S.scene.remove(p); }); G.taps = []; G.W.layout = null; await pic.remove();
        continue;
      }
      const its = c.opts.map((w, i) => G.item(w, pos(i), { size: 1.1 }));
      const goal = c.q === 'rhyme' ? its.find(i => c.goal === i.name) : its.find(i => WORDS[i.name].say[0] === (c.k === 'm' ? 'm' : 's'));
      let key = null; if (c.q === 'rhyme') key = G.item(c.w, () => V(0, 2.05, -1.6), { size: 1.2 });
      ask = c.q === 'rhyme' ? ['Tap the picture that rhymes with ' + say(c.w) + '.'] : ['Tap the picture that starts with ' + (c.k === 'm' ? 'mmm.' : 'sss.'), echo(() => sound[c.k]())];
      await G.say(ask);
      G.expect({ kind: 'tap', at: goal }); G.A.wrongMove = { kind: 'tap', at: its.find(i => i !== goal) };
      await new Promise(res => { let tries = 0; its.forEach(it => { it.onTap = async () => { it.poke(); await it.say();
        if (it === goal) { its.forEach(x => x.onTap = () => x.say()); await G.right(it.obj.position); res(); }
        else { tries++; await G.wrong(tries < 2 ? ['Hmm. Listen again.', ...ask] : ['This one!']); if (tries >= 2) goal.glow(true); } }; }); });
      if (key) key.onTap = () => key.say();
      await clearItems(G);
    }
    await G.done(G.A.firstTry >= 5 ? 'Your ears are super strong!' : 'Good work! Let\'s practice more.');
  }
};

/* =========================================================== review: The Listening Walk =========================================================== */
const review = {
  world(G) { const W = base(G.S, 'morning', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F }); pond(G.S, 7.5, -6, 2.2, 1.6); rock(G.S, -6.5, 2, 0.45);
    G.view({ wide: [-0.3, 1.8, 11.2, 5.4, 0.2], narrow: [0, 1.8, 5.0, 7.4, 0.24] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(4);
    await G.say('A listening walk! A little of everything.');
    /* 1. rhyme: drag to the rhyme */
    G.newRound(); { const a = G.item('star', () => n() ? V(0, 0.8, 2.0) : V(-2.6, 0.8, 1.0), { drag: true, size: 1.1 }), opts = shuffle(['car', 'sock']).map((w, i) => G.item(w, () => n() ? V(-1.3 + i * 2.6, 0.8, -1.2) : V(0.6 + i * 2.8, 0.8, -0.6), { size: 1.1 }));
      const good = opts.find(o => o.name === 'car'); await G.say('Drag the star to its rhyme.');
      G.expect({ kind: 'drag', from: a, to: () => good.obj.position }); G.A.wrongMove = { kind: 'drag', from: a, to: () => opts.find(o => o !== good).obj.position };
      G.hint(async () => { good.glow(true); await G.say('Star... car.'); });
      await new Promise(res => G.onDrop(async (it, at) => { const hit = G.near(it, opts); if (!hit) return false;
        if (hit === good) { G.onDrop(null); await pairUp(G, a, good, n() ? V(0, 0.8, 0.4) : V(0, 0.8, 0.4)); await G.right(good.obj.position, 'Star, car!'); res(); return true; }
        await G.wrong(['Star, sock. Listen to the end. Try another!'], hit); return false; }));
      await clearItems(G); }
    /* 2. clap */
    G.newRound(); { const drum = bigDrum(G, n() ? 0.9 : 1.6, 0, 0.6, n() ? 0.8 : 1), pic = G.item('tomato', () => n() ? V(-1.1, 0.8, -0.4) : V(-2.0, 0.85, -0.2), { size: 1.3 }); let c = 0;
      const parts = echo(async () => { for (const b of WORDS.tomato.beats) { await audio.say(b); await G.wait(200); } });
      await G.say('Tomato.', parts, 'Tap the drum for each part.');
      const setExp = () => { G.expect(c < 3 ? { kind: 'tap', at: drum.D } : { kind: 'button', sel: '#ok' }); G.A.wrongMove = c > 0 && c !== 3 ? { kind: 'button', sel: '#ok' } : { kind: 'tap', at: drum.D }; }; setExp();
      G.tap(drum.hit, () => { drum.boom(); c++; G.button('ok', true); setExp(); });
      for (;;) { await G.pressed('ok'); G.button('ok', false); if (c === 3) { await G.right(drum.D.position, 'To-ma-to. Three parts!'); break; } c = 0; setExp(); await G.wrong(['Clap it with me.', parts]); }
      G.taps = []; drum.D.visible = drum.st.visible = false; await pic.remove(); }
    /* 3. first sound: tap */
    G.newRound(); { const its = shuffle(['mop', 'sun', 'bee']).map((w, i) => G.item(w, () => n() ? V(-1.75 + i * 1.75, 0.85, 0.4) : V(-3 + i * 3, 0.85, 0.2), { size: 1.1 })), goal = its.find(i => i.name === 'sun');
      await G.say('Tap the picture that starts with sss.', echo(() => sound.s()));
      G.expect({ kind: 'tap', at: goal }); G.A.wrongMove = { kind: 'tap', at: its.find(i => i !== goal) };
      await new Promise(res => its.forEach(it => it.onTap = async () => { it.poke(); await it.say(); if (it === goal) { await G.right(it.obj.position, 'Sss, sun!'); res(); } else await G.wrong(['Listen for sss.', echo(() => sound.s())], it); }));
      await clearItems(G); }
    /* 4. left to right: which do we say first? */
    G.newRound(); { const row = ['hat', 'moon', 'fish'].map((w, i) => G.item(w, () => n() ? V(-1.3 + i * 1.55, 0.85, 0.4) : V(-3 + i * 3, 0.85, 0.2), { size: 1.1 }));
      await G.say('We read this way.', echo(async () => { for (const it of row) { it.glow(true); await G.wait(350); it.glow(false); } }), 'Which picture do we say first?');
      G.expect({ kind: 'tap', at: row[0] }); G.A.wrongMove = { kind: 'tap', at: row[2] }; G.hint(async () => { row[0].glow(true); await G.say('Start here, on this side.'); });
      await new Promise(res => row.forEach((it, i) => it.onTap = async () => { it.poke(); if (i === 0) { await G.right(it.obj.position, 'Yes! Hat, moon, fish.'); res(); } else await G.wrong(['We start on this side.'], it); }));
      await clearItems(G); }
    await G.done('What a listening walk!');
  }
};

export const GAMES = { opener, rhyme, clap, sort, train, paths, fixit, check, review };
