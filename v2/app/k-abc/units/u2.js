/* Kindergarten ABC 2.0 — Unit 2: First sounds s a t p (weeks 2–4). v2/curriculum/k-abc/MAP.md
   Skill: know the sounds s, a, t, p, write each one, and blend them into words (at, sat, pat, tap, sap).
   The letter kit for each letter (MAP.md): meet it, trace it, hunt for it. Every letter has its own world and its own twist:
     s  snake pond     · meet: the snake curls into its shape · hunt: pictures float past on lily pads; drag the sss ones to the snake's rock
     a  apple orchard  · meet: an apple vine grows into it     · hunt: pictures hang in the apple tree; drag the a ones into the crate
     t  ticking tree   · meet: a woodpecker taps as a tree grows · hunt: build a tower: only t pictures stack up
     p  pinwheel hill  · meet: a pinwheel grows on its stick    · hunt: pictures float up in bubbles; tap to pop the p ones
   slide / slide2: Slide it (blending): push the letter tiles down the slide into each other: s, a, t ... sat! then the word goes to its picture
   story: a 3-picture story read aloud; he finds the words he can read
   fixit: Ari (his painted picture beside Mendy) built a word; thumbs up or down, then drag in the right tile
   check: the mastery check, tap kinds only (hear a sound, tap its letter; see a letter, tap its picture; hear a word, tap it)
   review: Unit 1 and Unit 2 mixed */
import { THREE, V, shuffle, rnd, audio, echo, WORDS, FAST, ease, clamp } from '../game.js';
import { base, tree, rock, pond, lilypad, stump, basket, shelf } from '../scenes.js';
import { prop } from '../props.js';
import { tracer, glow, C, toon } from '../kit3d.js';
import { letterTile, letter3D, LETTERS } from '../letters.js';
import { LW, mouthCard } from '../lworlds.js';

export const ORDER = ['opener', 's-meet', 's-trace', 's-hunt', 'a-meet', 'a-trace', 'a-hunt', 't-meet', 't-trace', 't-hunt', 'slide',
  'p-meet', 'p-trace', 'p-hunt', 'slide2', 'story', 'fixit', 'review', 'check'];
const say = w => (WORDS[w] ? WORDS[w].say : w);
const an = w => w === 'grapes' ? 'Some grapes' : (/^[aeiou]/.test(w) ? 'An ' : 'A ') + w;
const cap = w => w[0].toUpperCase() + w.slice(1);
const snd = ch => echo(() => audio.letter(ch));
export const KEYWORD = { s: 'snake', a: 'apple', t: 'tree', p: 'pinwheel', i: 'inchworm', n: 'net', m: 'mountain', d: 'drum', g: 'grapes', o: 'octopus', c: 'cat', k: 'kite', e: 'egg' };
export const START = { s: ['sun', 'sock', 'soup', 'snake'], a: ['apple', 'ant', 'alligator', 'anchor'], t: ['top', 'tent', 'turtle', 'teapot'], p: ['pot', 'pear', 'pan', 'pumpkin', 'penguin'],
  i: ['igloo', 'inchworm', 'iguana'], n: ['nest', 'net', 'noodles'], m: ['moon', 'mop', 'mug', 'mouse', 'milk', 'mitten', 'mailbox'], d: ['dog', 'duck', 'door', 'donut', 'dish'],
  g: ['goat', 'grapes', 'gate', 'gift'], o: ['octopus', 'otter', 'ox', 'olive'], c: ['cat', 'cup', 'carrot', 'cap', 'cake', 'car'], k: ['kite', 'key', 'kettle', 'kitten', 'kippah'], e: ['egg', 'elephant', 'envelope'] };
export const OTHER = ['cat', 'bee', 'fish', 'hat', 'goat', 'bell', 'car', 'sun', 'sock', 'pear', 'top'];
export const others = ch => OTHER.filter(w => !START[ch].includes(w) && WORDS[w] && WORDS[w].say[0] !== ch && !('ck'.includes(ch) && /^[ck]/.test(WORDS[w].say)));   /* c and k say the same sound: a cat is never a "no" for k */
function clearItems(G) { return Promise.all(G.items.slice().map(i => i.remove())); }
function tapWait(G, it, wrong) { return new Promise(res => { G.expect({ kind: 'tap', at: it }); G.A.wrongMove = wrong ? { kind: 'tap', at: wrong } : null; const prev = it.onTap; it.onTap = () => { prev(); it.onTap = prev; res(); }; }); }
/* the letter as a glossy toy (the one he will meet in every game) */
function bigLetter(G, ch, at, k = 0.8, col = 0xFF5A8A) { const L = letter3D(ch, col, k, 0.2); L.position.copy(at); L.scale.setScalar(0.0001); G.S.scene.add(L); G.S.tween(500, e => L.scale.setScalar(Math.max(0.0001, e)), ease.back); return L; }
const tapHit = (G, obj, r = 0.9) => { const h = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); obj.add(h); return h; };

/* =========================================================== the letter kit: MEET =========================================================== */
export function meet(ch) {
  const L = LW[ch];
  return {
    world(G) { const W = L.make(G.S); G.view({ wide: [-0.6, 2.7, 11.4, 6.6, 0.17], narrow: [0, 2.6, 5.6, 8.6, 0.2] }); G.mendyAt = { wide: [-4.8, 1.2, 0.92], narrow: [-1.5, 3.4, 0.55] }; return W; },
    async play(G) {
      const W = G.W, S = G.S; G.rounds(3);
      await W.appear();
      await G.say('Look! ' + an(KEYWORD[ch]) + '!', 'Watch it make a shape.');
      G.mendy.set('point', 2.5); await W.demo(); W.cheer(); await G.wait(800);
      await G.say('This shape is a letter.', 'It shows a sound.');
      await G.say(cap(say(KEYWORD[ch])) + (KEYWORD[ch] === 'grapes' ? ' start' : ' starts') + ' with this sound.', snd(ch), 'Say it with me!', snd(ch), echo(() => G.wait(250)), snd(ch));
      /* the mouth picture */
      const mouth = mouthCard(S, L.mouth), mAt = () => G.narrow() ? V(1.25, 0.95, 1.6) : V(3.8, 3.6, 0.4); mouth.position.copy(mAt()); G.W.layout = () => mouth.position.copy(mAt());
      await S.tween(400, e => mouth.scale.setScalar(Math.max(0.0001, e)), ease.back);
      await G.say({ s: 'Teeth together. Let the air hiss out.', a: 'Open your mouth wide, like this.', t: 'Tongue up behind your teeth. Tap!', p: 'Lips together, then pop!',
        i: 'A little smile. Short and quick!', n: 'Tongue up. Hum through your nose.', m: 'Lips together. Hum!', d: 'Tongue up, then drop it. Quick!',
        g: 'Back of your tongue up. A soft, quick sound!', o: 'Make your mouth round and open.', c: 'Back of your tongue up. A quick puff!', k: 'Back of your tongue up. A quick puff!', e: 'A little smile, mouth a bit open.' }[ch], snd(ch));
      if (L.note) await G.say(...L.note);
      await G.say(L.action); G.mendy.wiggle(); W.cheer(); await audio.letter(ch); await G.wait(400);
      /* round 1: tap the picture-letter to hear it */
      G.newRound(); const target = W.hero || tapHit(G, (() => { const o = new THREE.Object3D(); o.position.set(0, 2.75, 0.2); S.scene.add(o); return o; })(), 1.6);
      await G.say('Tap the ' + ({ t: 'woodpecker', a: 'apple vine', m: 'moon' }[ch] || KEYWORD[ch]) + ' to hear its sound.');
      await new Promise(res => { G.expect({ kind: 'tap', at: () => target.getWorldPosition(new THREE.Vector3()) }); G.A.wrongMove = null; G.tap(target, () => { W.poke(); audio.letter(ch); G.taps = []; res(); }); });
      await G.right(V(0, 3.2, 0.6), 'You heard it!');
      /* rounds 2-3: which picture starts with it? (two pictures stand on the grass) */
      const pairs = shuffle(START[ch].filter(w => w !== KEYWORD[ch])).slice(0, 2).map((w, i) => [w, shuffle(others(ch))[i]]);
      for (const [pi, [good, bad]] of pairs.entries()) {
        G.newRound(); const order = shuffle([good, bad]), its = order.map((w, i) => G.item(w, () => G.narrow() ? V(-1.2 + i * 2.4, 0.85, 1.2) : V(-1.6 + i * 3.2, 0.9, 0.9), { size: 1.1 }));
        const g = its[order.indexOf(good)], b = its[order.indexOf(bad)];
        if (pi === 0) await G.say('Which one starts with this sound?', snd(ch));
        else await G.say('Now just look at the letter.', 'Which one starts with its sound?');   /* the letter only, no sound: as in the check */
        G.expect({ kind: 'tap', at: g }); G.A.wrongMove = { kind: 'tap', at: b };
        G.hint(async () => { g.glow(true); await G.say(say(good) + '.', snd(ch)); });
        await new Promise(res => its.forEach(it => it.onTap = async () => { it.poke(); await it.say(); if (it === g) { its.forEach(x => x.onTap = () => x.say()); await G.right(it.obj.position, say(good) + '!'); res(); }
          else await G.wrong([say(bad) + '. Listen to the start.', snd(ch)], it); }));
        await clearItems(G);
      }
      await G.done('You met a new sound!');
    }
  };
}

/* =========================================================== the letter kit: TRACE =========================================================== */
export function trace(ch) {
  const L = LW[ch];
  return {
    world(G) { const W = L.make(G.S); G.view({ wide: [-0.6, 2.7, 11.4, 6.6, 0.17], narrow: [0, 2.6, 5.6, 8.6, 0.2] }); G.mendyAt = { wide: [-4.8, 1.2, 0.92], narrow: [-1.5, 3.4, 0.55] }; return W; },
    async play(G) {
      const W = G.W, S = G.S; G.rounds(3); await W.appear();
      let lastNag = -9; const nag = l => { if (S.t - lastNag > 3 && !G.R.busy) { lastNag = S.t; G.say(l); } };
      const T = tracer(S, W.strokes, { onMove: T => { W.grow(T); W.soundStart(); G.A.trace = T.progress(); }, onStroke: () => { W.soundStop(); audio.chime([784, 988]); }, onUp: () => W.soundStop(),
        onFar: () => nag('Start at the green light.'), onLost: () => nag('Keep going from where you stopped.'), onOff: () => nag('Stay on the shiny path.'), startZ: ch === 's' ? 0.75 : 0.3, ringOnly: ch === 's' });
      G.A.tracePts = () => [].concat(...T.strokes.map(P => P.map(p => S.toScreen(p))));
      G.A.traceStrokes = () => T.strokes.map(P => P.map(p => S.toScreen(p)));
      await G.say(...L.rhyme.map(l => l));
      G.mendy.set('point', 2); await W.demo(); await G.wait(300); await W.reset();
      const modes = ['path', 'dots', 'alone'];
      for (let r = 0; r < 3; r++) {
        G.newRound(); T.reset(); W.reset && await W.reset();
        const track = T.dots.children.filter(c => c.geometry && c.geometry.type !== 'SphereGeometry'), dots = T.dots.children.filter(c => c.geometry && c.geometry.type === 'SphereGeometry');
        track.forEach(m => m.visible = modes[r] === 'path'); dots.forEach(m => m.visible = modes[r] !== 'alone');
        await G.say(['Now you! Trace on the shiny path.', 'Now just the dots. You can do it!', 'All by yourself! Start at the green light.'][r]);
        G.expect({ kind: 'trace' }); G.A.wrongMove = null; T.on = true; T.lastProgress = S.t;
        await new Promise(res => { T.onDone = () => res(); const id = setInterval(() => { if (!T.on) return clearInterval(id); if (!T.down && S.t - T.lastProgress > 8) { T.lastProgress = S.t; nag('Put your finger on the green light.'); } }, 1000); });
        W.soundStop(); W.cheer(); await G.right(V(0, 3, 0.6), ['You made it!', 'Beautiful!', 'All by yourself!'][r]); await audio.letter(ch); await G.wait(600);
      }
      await G.done('Your finger knows this letter!');
    }
  };
}

/* =========================================================== the letter kit: HUNT (a new twist for every letter) =========================================================== */
export function huntSet(ch, n = 6) { const yes = shuffle(START[ch]).slice(0, 3), no = shuffle(others(ch)).slice(0, n - 3); return shuffle([...yes.map(w => [w, true]), ...no.map(w => [w, false])]); }
const hunt = {
  /* s: pictures float past on lily pads; drag the sss ones onto the snake's sunny rock */
  s: {
    world(G) { const W = base(G.S, 'pond', { clearW: 8, skip: (x, z) => Math.hypot(x / 2.4, z + 0.4) < 2.6 }); pond(G.S, 0, -0.4, 2.6, 2.4); tree(G.S, -10, -7, { s: 1.6 }); tree(G.S, 9, -6, { s: 1.5, c1: 0xE85A9E, c2: 0xFFC2E2 });
      G.rock = rock(G.S, 3.6, 1.8, 0.8, 0xE3D7C9); G.snake = prop('snake'); G.snake.scale.setScalar(0.9); G.snake.position.set(4.4, 1.25, 2.0); G.S.scene.add(G.snake);
      G.view({ wide: [0, 1.6, 11.6, 5.6, 0.32], narrow: [0, 1.5, 5.2, 7.6, 0.42] }); G.mendyAt = { wide: [-4.8, 1.8, 0.9], narrow: [-1.5, 3.7, 0.5] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), set = huntSet('s'), rockAt = () => n() ? V(1.4, 0.4, 2.6) : V(3.7, 0.4, 1.8);
      const lay = () => { const r = rockAt(); G.rock.position.set(r.x, S.groundH(r.x, r.z) + 0.15, r.z); G.rock.scale.setScalar(n() ? 0.7 : 1); G.snake.position.set(r.x, r.y + (n() ? 0.7 : 0.9), r.z); }; lay(); G.W.layout = lay;
      G.rounds(3); await G.say('The pond parade is coming!', 'Catch the pictures that start with this sound.', snd('s'), 'Drag them to the snake.');
      const pads = []; const its = set.map(([w, yes], i) => { const x0 = FAST ? -3.2 + i * 1.3 : 7 + i * 3.2, it = G.item(w, () => V(x0 * (n() ? 0.6 : 1), 0.75, -0.3), { drag: true, size: 1.0, data: { yes, x: x0, roam: true } });   /* the automatic test sees the parade standing still, already in view */ const p = lilypad(S, 0.7); pads.push([p, it]); return it; });
      let pause = false; S.tick((t, dt) => { its.forEach((it, i) => { if (it.placed || !it.live) return; if (!pause && !G.dragItem() && G.A.name !== 'end') it.data.x -= dt * (FAST ? 0 : 0.9);   /* the parade waits while his finger is down */ if (it.data.x < -7) it.data.x += set.length * 3.2;
        const z = n() ? -0.4 : -0.3, w = n() ? 0.6 : 1; it.home.set(it.data.x * w, 0.75, z + Math.sin(it.data.x * 0.5) * 0.6); if (!it.moving && it !== G.dragItem()) it.obj.position.copy(it.home); });
        pads.forEach(([p, it]) => { p.visible = it.live && !it.placed; p.position.set(it.home.x, 0.1, it.home.z); }); });
      let got = 0;
      while (got < 3) {
        G.newRound(); const visible = () => its.filter(i => !i.placed && i.live && Math.abs(i.home.x) < (n() ? 2.2 : 4.2));
        let lastG; const exp = () => { const v = visible(); const good = v.find(i => i.data.yes), bad = v.find(i => !i.data.yes); if (good !== lastG) { lastG = good; G.expect(good ? { kind: 'drag', from: good, to: () => G.snake.position } : null); } G.A.wrongMove = bad ? { kind: 'drag', from: bad, to: () => G.snake.position } : null; };
        const timer = setInterval(exp, 250); exp();
        G.hint(async () => { const v = visible().find(i => i.data.yes); if (v) { v.glow(true); await G.say(say(v.name) + '.', snd('s')); } });
        await new Promise(res => G.onDrop(async (it, at) => { if (!G.near(it, [G.snake.position], 150)) return false;
          if (it.data.yes) { G.onDrop(null); it.placed = true; it.glow(false); it.size *= 0.6; await it.moveTo(G.snake.position.clone().add(V(-0.7 + got * 0.7, 0.9, 0.3)), 400); got++; await G.right(G.snake.position, say(it.name) + '!'); res(); return true; }
          await G.wrong([say(it.name) + '. Listen to the start.', 'It does not start with this sound.', snd('s')], it); return false; }));
        clearInterval(timer);
      }
      pause = true; await G.done('The snake is so happy!');
    }
  },
  /* a: pictures hang in the apple tree; drag the a ones into the apple crate */
  a: {
    world(G) { const W = base(G.S, 'garden', { clearW: 7 }); G.bigTree = tree(G.S, 0, -2.2, { s: 1.75, c1: 0x16883A, c2: 0x8EDB4A, puffs: 12 }); tree(G.S, -9, -6, { s: 1.4 }); tree(G.S, 9, -6, { s: 1.5 });
      G.crate = new THREE.Group(); const wood = toon(0xC98A4B, { rough: .7, clear: .1 }); [0.12, 0.45].forEach(y => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 1.1), wood); b.position.y = y; b.castShadow = true; G.crate.add(b); });
      const inn = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.5, 0.95), toon(0x7A4A22)); inn.position.y = 0.36; G.crate.add(inn); G.S.scene.add(G.crate);
      G.view({ wide: [0, 2.9, 11.6, 6.6, 0.15], narrow: [0, 2.9, 5.4, 8.4, 0.18] }); G.mendyAt = { wide: [-4.8, 1.6, 0.92], narrow: [-1.5, 3.6, 0.55] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), set = huntSet('a'), crAt = () => n() ? V(1.2, 0, 1.6) : V(3.4, 0, 0.6);
      const lay = () => { const c = crAt(); G.crate.position.set(c.x, S.groundH(c.x, c.z), c.z); G.crate.scale.setScalar(n() ? 0.75 : 1); }; lay(); G.W.layout = lay;
      const spots = [[-2.6, 4.0], [-0.9, 4.6], [0.9, 4.6], [2.6, 4.0], [-1.7, 3.1], [1.7, 3.1]];
      G.rounds(3); await G.say('Welcome to the apple tree!', 'Find the pictures that start with this sound.', snd('a'), 'Drag them into the crate.');
      const its = set.map(([w, yes], i) => G.item(w, () => { const s = spots[i]; return n() ? V(s[0] * 0.62, s[1] - 0.2, -0.4) : V(s[0], s[1], -0.2); }, { drag: true, size: 0.95, data: { yes } }));
      its.forEach(it => { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), toon(0x6B4A2A)); st.position.y = 0.7; it.obj.add(st); });   /* each hangs on a little stem */
      const cTop = () => G.crate.position.clone().add(V(0, 0.8, 0));
      for (let r = 0; r < 3; r++) {
        G.newRound(); const good = its.find(i => i.data.yes && !i.placed), bad = its.find(i => !i.data.yes);
        G.expect({ kind: 'drag', from: good, to: cTop }); G.A.wrongMove = { kind: 'drag', from: bad, to: cTop };
        G.hint(async () => { const g = its.find(i => i.data.yes && !i.placed); g.glow(true); await G.say(say(g.name) + '.', snd('a')); });
        await new Promise(res => G.onDrop(async (it, at) => { if (!G.near(it, [cTop()], 150)) return false;
          if (it.data.yes) { G.onDrop(null); it.placed = true; it.glow(false); it.size *= 0.7; await it.moveTo(cTop().add(V(-0.5 + r * 0.5, 0.1, 0)), 400); await G.right(cTop(), say(it.name) + '!'); res(); return true; }
          await G.wrong([say(it.name) + '. Listen to the start.', snd('a')], it); return false; }));
      }
      await G.done('A crate full of pictures!');
    }
  },
  /* t: build a tower: only pictures that start with t stack up; the others wobble back */
  t: {
    world(G) { const W = base(G.S, 'golden', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.6, c1: 0x3E9E3A, c2: 0xC8E04A }); tree(G.S, 9.5, -6, { s: 1.4, c1: 0x5AAE2A, c2: 0xF2C84A });
      G.base = stump(G.S, 2.6, 0.6, 0.9, 0.5); G.view({ wide: [0, 2.6, 11.6, 6.4, 0.15], narrow: [0, 2.8, 5.4, 8.6, 0.18] }); G.mendyAt = { wide: [-4.8, 1.6, 0.92], narrow: [-1.5, 3.6, 0.55] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), set = huntSet('t'), cols = [0xFF5A6E, 0xFFB020, 0x4DDB6A, 0x4DB2FF];
      const bx = () => n() ? 1.5 : 2.6; const lay = () => { G.base.position.x = bx(); }; lay(); G.W.layout = () => { lay(); blocks.forEach(b => b.position.x = bx()); its.filter(x => x.placed).forEach(x => { x.home.x = bx(); x.obj.position.x = bx(); }); };
      const blocks = []; let h = 0.5;
      const topAt = () => V(bx(), h + 0.75, 0.6);
      G.rounds(3); await G.say('Let\'s build a tall tower!', 'Only pictures that start with this sound.', snd('t'));
      const its = set.map(([w, yes], i) => G.item(w, () => n() ? V(-1.9 + (i % 3) * 1.2 + Math.floor(i / 3) * 0.6, 0.75 + Math.floor(i / 3) * 0.35, 2.2 - Math.floor(i / 3) * 1.5) : V(-3.9 + (i % 3) * 1.6 + Math.floor(i / 3) * 0.8, 0.75 + Math.floor(i / 3) * 0.35, 2.0 - Math.floor(i / 3) * 1.7), { drag: true, size: 0.95, data: { yes } }));   /* the back row sits between the front ones, so none hides another */
      for (let r = 0; r < 3; r++) {
        G.newRound(); const good = its.find(i => i.data.yes && !i.placed), bad = its.find(i => !i.data.yes);
        G.expect({ kind: 'drag', from: good, to: topAt }); G.A.wrongMove = { kind: 'drag', from: bad, to: topAt };
        G.hint(async () => { const g = its.find(i => i.data.yes && !i.placed); g.glow(true); await G.say(say(g.name) + '.', snd('t')); });
        await new Promise(res => G.onDrop(async (it, at) => { if (!G.near(it, [topAt()], 170)) return false;
          if (it.data.yes) { G.onDrop(null); it.placed = true; it.glow(false);
            const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 1.2), toon(cols[r % 4], { clear: 1, rough: .3 })); b.castShadow = true; b.position.set(bx(), h + 0.25, 0.6); S.scene.add(b); blocks.push(b); audio.tick();
            const at2 = V(bx(), h + 0.25, 1.3); h += 0.5; it.size *= 0.42; it.hover = 0; await it.moveTo(at2, 400); it.home = at2;   /* the picture becomes a sticker on its block */
            await G.right(at2, say(it.name) + '!'); res(); return true; }
          await G.wrong([say(it.name) + '. It does not start with this sound.', snd('t')], it); return false; }));
      }
      await G.done('What a tall tower!');
    }
  },
  /* p: pictures float up inside bubbles; tap to pop the ones that start with p */
  p: {
    world(G) { const W = base(G.S, 'hills', { clearW: 7 }); tree(G.S, -9.5, -6, { s: 1.5 }); tree(G.S, 9, -6.5, { s: 1.6 }); G.bk = basket(G.S, 0xD8A060, 1.0);
      G.view({ wide: [0, 2.6, 11.6, 6.4, 0.15], narrow: [0, 2.8, 5.4, 8.6, 0.18] }); G.mendyAt = { wide: [-4.8, 1.6, 0.92], narrow: [-1.5, 3.6, 0.55] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(); const lay = () => { G.bk.position.set(n() ? 1.2 : 3.6, 0, 1.8); G.bk.scale.setScalar(n() ? 0.75 : 1); }; lay(); G.W.layout = lay;
      const set = huntSet('p', 6), bm = toon(0xDDF4FF, { transparent: true, opacity: 0.32, rough: 0.05, clear: 1, rim: 0xFFFFFF, rimI: 1.4, depthWrite: false });
      G.rounds(3); await G.say('Bubbles! Some have pictures that start with this sound.', snd('p'), 'Tap those bubbles to pop them!');
      const its = set.map(([w, yes], i) => { const it = G.item(w, () => V(0, 0, 0), { size: 0.8, data: { yes, ph: i * 1.05, roam: true } }); const b = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 16), bm); it.obj.add(b); it.bub = b; return it; });
      let t0 = 0; S.tick((t, dt) => { t0 += dt * (FAST ? 0.5 : 1); its.forEach((it, i) => { if (it.placed || !it.live) return; const k = ((t0 * 0.08 + it.data.ph / 6.3) % 1), w = n() ? 1.7 : 3.4;
        it.home.set(Math.sin(i * 2.3) * w + Math.sin(t0 * 0.6 + i) * 0.3 - (n() ? 0 : 0.6), 0.9 + k * (n() ? 5.2 : 4.4), -0.4); if (!it.moving) it.obj.position.copy(it.home); }); });
      for (let r = 0; r < 3; r++) {
        G.newRound(); const vis = () => its.filter(i => !i.placed && i.home.y > 1.3 && i.home.y < (n() ? 5.6 : 4.8));
        let lastG; const exp = () => { const v = vis(), g = v.find(i => i.data.yes), b = v.find(i => !i.data.yes); if (g !== lastG) { lastG = g; G.expect(g ? { kind: 'tap', at: g } : null); } G.A.wrongMove = b ? { kind: 'tap', at: b } : null; };
        const timer = setInterval(exp, 200); exp();
        G.hint(async () => { const g = its.find(i => i.data.yes && !i.placed); if (g) { g.glow(true); await G.say(say(g.name) + '.', snd('p')); } });
        await new Promise(res => its.forEach(it => it.onTap = async () => { if (it.placed) return; it.poke(); await it.say();
          if (it.data.yes) { its.forEach(x => x.onTap = () => {}); it.placed = true; audio.pop(); G.P.burst(it.obj.position, 0.3); it.bub.visible = false; it.size *= 0.75;
            await it.moveTo(G.bk.position.clone().add(V(-0.4 + r * 0.4, 0.8 * G.bk.scale.x, 0.2)), 500); await G.right(G.bk.position, say(it.name) + '!'); res(); }
          else await G.wrong([say(it.name) + '. Not this sound.', snd('p')], it); }));
        clearInterval(timer); its.forEach(it => { if (!it.placed) it.onTap = () => it.say(); });
      }
      await G.done('Pop, pop! You found them all!');
    }
  }
};

/* =========================================================== slide it: blending =========================================================== */
export function slide(words, title, decoy = 'pan', finalRead = false) {
  return {
    world(G) { const W = base(G.S, 'morning', { clearW: 8 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6, { s: 1.6, c1: 0xE85A9E, c2: 0xFFC2E2 });
      /* a playground slide: a long, gentle rainbow ramp going down to the right */
      const ramp = new THREE.Group(), cols = [0xFF5A6E, 0xFFB020, 0xFFE14D, 0x4DDB6A, 0x4DB2FF];
      cols.forEach((c, i) => { const s = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.12, 0.34), toon(c, { clear: 1, rough: .25 })); s.position.set(0, 0, -0.68 + i * 0.34); s.receiveShadow = true; ramp.add(s); });
      [-1, 1].forEach(sd => { const rail = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.3, 0.12), toon(0xFFFFFF, { clear: 1 })); rail.position.set(0, 0.15, sd * 0.92); ramp.add(rail); });
      ramp.rotation.z = -0.12; ramp.position.set(0.4, 1.5, -0.8); G.S.scene.add(ramp); G.ramp = ramp;
      [-4, 4.6].forEach((x, i) => { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, i ? 1.1 : 2.2, 10), toon(0x4DB2FF, { clear: 1 })); leg.position.set(x, i ? 0.55 : 1.1, -0.8); G.S.scene.add(leg); });
      G.view({ wide: [0, 2.2, 11.6, 5.8, 0.17], narrow: [0, 2.4, 5.4, 8.0, 0.2] }); G.mendyAt = { wide: [-4.6, 2.6, 0.85], narrow: [-1.5, 3.7, 0.5] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(); G.rounds(words.length + (finalRead ? 1 : 0));
      const yAt = x => 1.5 + 0.55 - x * Math.tan(0.12), sp = () => n() ? 1.25 : 2.3;
      await G.say(title, 'Push each sound down the slide into the next one.');
      let firstWord = true;
      for (const w of words) {
        G.newRound(); const chs = toks(w), x0 = () => n() ? -1.4 : -2.6;
        const tiles = chs.map((ch, i) => { const t = letterTile(ch); const at = V(x0() + i * sp(), 0, -0.8); at.y = yAt(at.x) + 0.55; t.position.copy(at); t.scale.setScalar(0.0001); S.scene.add(t); S.tween(400, e => t.scale.setScalar(Math.max(0.0001, e * (n() ? 0.8 : 1))), ease.back); t.userData.i = i; return t; });
        const place = () => tiles.forEach((t, i) => { if (t.userData.joined) return; const x = x0() + i * sp(); t.position.set(x, yAt(x) + 0.55, -0.8); }); G.W.layout = place;
        tiles.forEach(t => { const h = tapHit(G, t, 0.8); G.tap(h, () => { audio.letter(t.userData.ch || chs[t.userData.i]); }); });
        if (firstWord) { firstWord = false; await G.say('Watch me.'); for (let i = 0; i < chs.length; i++) { tiles[i].position.z += 0.0; await audio.letter(chs[i]); } await G.say(say(w) + '!'); await G.say('Now you! Push the first one down.'); }
        else await G.say('A new word! Push the sounds together.');
        /* he drags the lead group into the next tile, again and again, left to right */
        let lead = 0;
        while (lead < chs.length - 1) {
          const cur = tiles[lead], nxt = tiles[lead + 1];
          const grp = { obj: cur, screen: () => S.toScreen(cur.getWorldPosition(new THREE.Vector3())) };
          G.expect({ kind: 'drag', from: grp, to: () => nxt.getWorldPosition(new THREE.Vector3()) }); G.A.wrongMove = lead === 0 && chs.length > 2 ? { kind: 'drag', from: { screen: () => S.toScreen(tiles[2].getWorldPosition(new THREE.Vector3())) }, to: () => tiles[0].getWorldPosition(new THREE.Vector3()) } : null;
          G.hint(async () => { await G.trail(cur.position, nxt.position); });
          await dragTile(G, tiles, lead, async ok => { if (!ok) await G.wrong(['We go this way, down the slide.', 'Push the first sound.']); });
          /* join: the sounds slide down together, and he hears them blend */
          audio.whoosh(); const gap = n() ? 0.95 : 1.2, endX = nxt.position.x, from = tiles.slice(0, lead + 2).map(t => t.position.clone());
          await S.tween(350, e => tiles.slice(0, lead + 2).forEach((t, k) => { const x = endX - (lead + 1 - k) * gap; t.position.lerpVectors(from[k], V(x, yAt(x) + 0.55, -0.8), e); }));
          tiles.slice(0, lead + 2).forEach(t => t.userData.joined = true); for (let k = 0; k <= lead + 1; k++) await audio.letter(chs[k]);
          lead++;
        }
        if (!PIC[w]) { await G.say('What word is it? Say it!'); await G.wait(1800); }   /* he says it before the voice does */
        await G.right(tiles[tiles.length - 1].position.clone().add(V(0, 0.6, 0.4)), PIC[w] ? 'You blended it!' : say(w) + '!');
        /* the word goes to its picture, if it has one */
        if (PIC[w]) { const dk = typeof decoy === 'string' ? decoy : (PIC[decoy[w]] || 'pan'), opts = shuffle([PIC[w], dk]).map((p, i) => G.item(p, () => n() ? V(-1.2 + i * 2.4, 0.8, 2.2) : V(-1.6 + i * 3.2, 0.8, 2.2), { size: 1.0 })); const good = opts.find(o => o.name === PIC[w]);
          await G.say('Which picture shows this word?'); G.expect({ kind: 'tap', at: good }); G.A.wrongMove = { kind: 'tap', at: opts.find(o => o !== good) };
          await new Promise(res => opts.forEach(it => it.onTap = async () => { it.poke(); if (it === good) { audio.chime([784, 988, 1319]); G.P.burst(it.obj.position, 0.4); await G.say('Yes! ' + say(w) + '!'); res(); } else await G.wrong(['That is ' + an(say(dk)).toLowerCase() + '. Read it again.', echo(async () => { for (const c of chs) await audio.letter(c); })], it); }));
          await clearItems(G); }
        await S.tween(300, e => tiles.forEach(t => t.scale.setScalar(Math.max(0.0001, (1 - e) * (n() ? 0.8 : 1))))); tiles.forEach(t => S.scene.remove(t)); G.taps = [];
      }
      if (finalRead) {   /* hear a word, find it among three (practice for the check) */
        G.newRound(); const pick = shuffle(words).slice(0, 3), goal = pick[0], cards = shuffle(pick).map((w, j) => { const g = new THREE.Group(); toks(w).forEach((ch, k, A2) => { const t = letterTile(ch); t.scale.setScalar(0.6); t.position.set((k - (A2.length - 1) / 2) * 0.78 + (ch.length > 1 ? 0.1 : 0), 0, 0); g.add(t); });
          g.position.copy(n() ? V(0, 3.4 - j * 1.25, 0.6) : V(-3 + j * 3, 1.4, 0.8)); g.scale.setScalar(n() ? 0.75 : 1); S.scene.add(g); const h = tapHit(G, g, 0.8); h.scale.set(1.6, 0.8, 1); g.userData = { w, h }; return g; });
        const gc = cards.find(c => c.userData.w === goal); await G.say('Listen.', say(goal) + '.', 'Tap that word.');
        G.expect({ kind: 'tap', at: gc }); G.A.wrongMove = { kind: 'tap', at: cards.find(c => c !== gc) };
        G.hint(async () => { await G.say('Say it slowly.', echo(async () => { for (const c of toks(goal)) await audio.letter(c); })); });
        await new Promise(res => cards.forEach(c => G.tap(c.userData.h, async () => { if (c === gc) { G.taps = []; await G.right(c.position, say(goal) + '!'); res(); } else await G.wrong(['That one says ' + c.userData.w + '.', 'Find ' + goal + '.']); })));
        cards.forEach(c => S.scene.remove(c)); }
      await G.done('You can read words!');
    }
  };
}
export const PIC = { tap: 'faucet', pin: 'pin', tin: 'tin', mat: 'mat', map: 'map' };
/* a word's sounds, in order: ck is one sound (Unit 4) */
export const toks = w => w.match(/ck|./g);
/* drag a letter tile (the leading group) into the next tile; resolves when he does it the right way */
function dragTile(G, tiles, lead, onWrong) {
  const S = G.S, el = S.renderer.domElement; let dragging = null, off = new THREE.Vector3(), start = null;
  return new Promise(res => {
    const pick = e => { const p = S.onPlane(e, -0.8); if (!p) return null; let best = null, bd = 1e9; tiles.forEach((t, i) => { const d = t.position.distanceTo(p); if (d < bd && d < 0.9) { bd = d; best = i; } }); return best == null ? null : { i: best, p }; };
    const down = e => { const h = pick(e); if (!h) return; dragging = h.i; start = tiles.map(t => t.position.clone()); off.copy(tiles[h.i].position).sub(h.p); G.locked = true; };
    const move = e => { if (dragging == null) return; const p = S.onPlane(e, -0.8); if (!p) return; const d = p.add(off).sub(start[dragging]); const grp = dragging <= lead ? tiles.slice(0, lead + 1) : [tiles[dragging]];
      grp.forEach(t => { const k = tiles.indexOf(t); t.position.copy(start[k]).add(d).add(V(0, 0, 0.5)); }); };
    const up = async () => { if (dragging == null) return; const i = dragging; dragging = null; G.locked = false;
      const ok = i <= lead && tiles[lead].position.distanceTo(tiles[lead + 1].position) < 1.6;
      tiles.forEach((t, k) => t.position.copy(start[k]));
      if (ok) { cleanup(); res(); } else if (i > lead) await onWrong(false); };   /* a sound pushed the wrong way (up the slide) gets a gentle fix */
    const cleanup = () => { el.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
    el.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up);
  });
}

/* =========================================================== story: the 3-picture story =========================================================== */
const story = {
  world(G) { const W = base(G.S, 'garden', { clearW: 8 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6.5, { s: 1.6, c1: 0xE85A9E, c2: 0xFFC2E2 });
    G.view({ wide: [0, 2.4, 11.8, 6.2, 0.17], narrow: [0, 2.6, 5.6, 8.8, 0.2] }); G.mendyAt = { wide: [-4.5, 1.8, 0.85], narrow: [-1.6, 3.8, 0.5] }; return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow();
    /* three picture frames on easels; each shows a little 3D scene; the readable words float under it */
    const PAGES = [{ pics: ['cat'], line: 'The cat sat.', words: ['sat'] }, { pics: ['cat'], line: 'Pat, pat, pat!', words: ['pat'] }, { pics: ['cat', 'faucet'], line: 'The cat taps the tap. Tap, tap!', words: ['tap'] }];
    G.rounds(3); await G.say('Story time! Listen, then find the words you can read.');
    const frameAt = i => () => n() ? V(0, 3.6, -0.6) : V(-2.2 + i * 3.0, 3.2, -0.6);
    for (let i = 0; i < PAGES.length; i++) {
      G.newRound(); const pg = PAGES[i], fa = frameAt(i)();
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.1, 0.1), toon(0xFFF8EC, { rough: .5 })); frame.position.copy(fa); S.scene.add(frame);
      const border = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.3, 0.06), toon(0xC98A4B, { rough: .6 })); border.position.copy(fa).add(V(0, 0, -0.06)); S.scene.add(border);
      const its = pg.pics.map((p, k) => G.item(p, () => frameAt(i)().add(V(pg.pics.length > 1 ? (k ? 0.65 : -0.55) : 0, -0.1, 0.4)), { size: 0.95 }));
      const choices = shuffle(['sat', 'pat', 'tap']), cards = choices.map((w, j) => { const g = new THREE.Group(); w.split('').forEach((ch, k) => { const t = letterTile(ch); t.scale.setScalar(0.5); t.position.set((k - 1) * 0.66, 0, 0); g.add(t); });
        g.position.copy(n() ? V(-1.55 + j * 1.55, 0.85, 1.6) : V(-3.0 + j * 3.0, 0.85, 1.2)); g.scale.setScalar(n() ? 0.72 : 1); S.scene.add(g); g.userData.w = w; const h = tapHit(G, g, 0.9); h.scale.set(1.5, 0.7, 1); g.userData.h = h; return g; });
      const word = cards[choices.indexOf(pg.words[0])];   /* three word cards: he must read to find the page's word */
      await G.say(pg.line); if (i === 1) { for (let k = 0; k < 3; k++) { G.mendy.set('point', 0.3); its[0].poke(); audio.pop(); await G.wait(300); } }
      if (i === 2) { for (let k = 0; k < 3; k++) { its[1].poke(); audio.tick(); await G.wait(300); } }
      await G.say('Find the word ' + pg.words[0] + '. Tap it!');
      G.expect({ kind: 'tap', at: word }); G.A.wrongMove = { kind: 'tap', at: cards.find(c => c !== word) };
      G.hint(async () => { await G.say('Read each card slowly.', echo(async () => { for (const ch of pg.words[0]) await audio.letter(ch); })); word.scale.multiplyScalar(1.12); });
      await new Promise(res => cards.forEach(c => G.tap(c.userData.h, async () => { for (const ch of c.userData.w) await audio.letter(ch);
        if (c === word) { G.taps = []; await G.right(word.position, pg.words[0] + '! You read it!'); res(); } else await G.wrong(['That card says ' + c.userData.w + '.', 'Find ' + pg.words[0] + '.']); })));
      cards.forEach(c => S.scene.remove(c));
      if (n() && i < PAGES.length - 1) { await clearItems(G); [frame, border].forEach(o => S.scene.remove(o)); }
    }
    await G.done('You read a story!');
  }
};

/* =========================================================== fix it: Ari's words (MAP.md: "Ari read this ...") =========================================================== */
const FIXES = [{ want: 'sat', made: 'sap', fix: 2 }, { want: 'tap', made: 'tap' }, { want: 'pat', made: 'sat', fix: 0 }, { want: 'at', made: 'at' }, { want: 'sap', made: 'tap', fix: 0 }];
const fixit = {
  world(G) { const W = base(G.S, 'meadow', { clearW: 7 }); tree(G.S, -9, -7, { s: 1.6 }); tree(G.S, 8.5, -7.5, { s: 1.4 }); G.board = shelf(G.S, -2.8, 2.8, -1.2, 1.4, 0xC98A4B, 1.2);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.1, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(FIXES.length);
    const ari = await G.friend('ari'); await G.say('This is my friend Ari. He builds words.', 'Sometimes he gets mixed up. Let\'s check!');
    { /* watch me: Mendy checks one word first, sound by sound */
      const demo = 'sat'.split('').map((ch, i) => { const t = letterTile(ch); t.position.set((i - 1) * (n() ? 1.2 : 1.45), 2.15, -1.2); S.scene.add(t); return t; });
      ari.set('think', 3); await G.say('Watch me. Ari wanted to make sat.', 'I check each sound.', echo(async () => { for (const [k, c] of [...'sat'].entries()) { demo[k].scale.setScalar(1.15); await audio.letter(c); demo[k].scale.setScalar(1); } }));
      G.mendy.set('happy', 1); await G.say('Sat! He is right. Thumbs up!'); demo.forEach(t => S.scene.remove(t)); }
    for (const f of FIXES) {
      G.newRound(); const chs = f.made.split(''), slot = i => V((i - (chs.length - 1) / 2) * (n() ? 1.2 : 1.45), 2.15, -1.2);
      const tiles = chs.map((ch, i) => { const t = letterTile(ch); t.position.copy(slot(i)); t.scale.setScalar(0.0001); S.scene.add(t); S.tween(400, e => t.scale.setScalar(Math.max(0.0001, e)), ease.back); return t; });
      ari.set('think', 30); await G.say('Ari wanted to make ' + f.want + '.', 'He made this. Is he right?', echo(async () => { for (const c of chs) await audio.letter(c); }));
      G.button('yes', true); G.button('no', true); const ok = f.want === f.made;
      G.hint(async () => { await G.say('Check each sound with me.'); for (const [k, c] of chs.entries()) { tiles[k].scale.setScalar(1.15); await audio.letter(c); tiles[k].scale.setScalar(1); } });
      for (;;) { G.expect({ kind: 'button', sel: ok ? '#yes' : '#no' }); G.A.wrongMove = { kind: 'button', sel: ok ? '#no' : '#yes' };
        const p = await G.pressed('yes', 'no'); if ((p === 'yes') === ok) break;
        await G.wrong(['Listen to each sound.', echo(async () => { for (const c of chs) await audio.letter(c); }), 'Does it say ' + f.want + '?']); }
      G.button('yes', false); G.button('no', false);
      if (ok) { ari.set('happy', 1.5); ari.hopNow(); await G.right(V(0, 3.2, 0), 'Yes! Ari made ' + f.want + '!'); }
      else {
        await G.say('Ari got mixed up. Let\'s fix it!', 'Drag the right letter into the glowing spot.');
        const bad = tiles[f.fix]; await S.tween(300, e => bad.position.y = slot(f.fix).y + e * 1.4); S.scene.remove(bad);
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.66, 0.82, 40), new THREE.MeshBasicMaterial({ color: C(0xFFF3A0).multiplyScalar(1.6), transparent: true, opacity: 0.85, side: THREE.DoubleSide })); ring.position.copy(slot(f.fix)).add(V(0, 0, 0.2)); S.scene.add(ring);
        const need = f.want[f.fix], choices = shuffle([need, f.made[f.fix] === need ? 'a' : f.made[f.fix]]);
        const ch = choices.map((c, i) => { const t = letterTile(c); t.position.set(n() ? -0.9 + i * 1.8 : -1.4 + i * 2.8, 0.9, 1.6); S.scene.add(t); t.userData.ch = c; return t; });
        const items = ch.map(t => ({ obj: t, screen: () => S.toScreen(t.getWorldPosition(new THREE.Vector3())) }));
        G.expect({ kind: 'drag', from: items[choices.indexOf(need)], to: () => slot(f.fix) }); G.A.wrongMove = { kind: 'drag', from: items[1 - choices.indexOf(need)], to: () => slot(f.fix) };
        G.hint(async () => { await G.trail(ch[choices.indexOf(need)].position, slot(f.fix)); });
        await new Promise(res => tileDrag(G, ch, async (t, at) => { const a1 = S.toScreen(t.position), b1 = S.toScreen(slot(f.fix)); if (Math.hypot(a1.x - b1.x, a1.y - b1.y) > 120 * Math.max(0.6, Math.min(innerWidth, innerHeight) / 768)) return false;
          if (t.userData.ch === need) { t.position.copy(slot(f.fix)); S.scene.remove(ring); tiles[f.fix] = t; ch.filter(x => x !== t).forEach(x => S.scene.remove(x));
            ari.set('happy', 1.5); ari.hopNow(); for (const c of f.want) await audio.letter(c); await G.right(t.position, f.want + '! Fixed!'); res(); return true; }
          await G.wrong(['Listen.', snd(t.userData.ch), 'We need ' + f.want + '.']); return false; }));
      }
      tiles.forEach(t => S.scene.remove(t));
    }
    ari.set('happy', 3); await G.done('Ari says thank you!');
  }
};
/* drag loose letter tiles (not pictures); drop(tile, point) -> true keeps it */
function tileDrag(G, tiles, drop) {
  const S = G.S, el = S.renderer.domElement; let d = null, off = new THREE.Vector3(), home = null, z = 0;
  const down = e => { let best = null, bd = 1e9; tiles.forEach(t => { if (!t.parent) return; const p = S.onPlane(e, t.position.z); if (!p) return; const dd = p.distanceTo(t.position); if (dd < 0.8 && dd < bd) { bd = dd; best = t; } });
    if (!best) return; d = best; z = d.position.z; home = d.position.clone(); off.copy(d.position).sub(S.onPlane(e, z)); G.locked = true; };
  const move = e => { if (!d) return; const p = S.onPlane(e, z); if (p) d.position.copy(p.add(off)).setZ(z + 0.5); };
  const up = async () => { if (!d) return; const t = d; d = null; G.locked = false; const at = t.position.clone(); at.z = -1.2; const keep = await drop(t, at); if (keep) { el.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); } else t.position.copy(home); };
  el.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up);
}

/* =========================================================== check: mastery (tap kinds) =========================================================== */
const check = {
  world(G) { const W = base(G.S, 'sunset'); tree(G.S, -9, -6, { s: 1.5, c1: 0x3A9E5A, c2: 0xB8E06A }); tree(G.S, 9.5, -7, { s: 1.6, c1: 0xC85AA8, c2: 0xFFC2E2 }); G.st = stump(G.S, 0, -1.6, 0.9, 1.1);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow();
    const Q = [{ k: 'sound', ch: 's' }, { k: 'sound', ch: 'p' }, { k: 'sound', ch: 'a' }, { k: 'sound', ch: 't' }, { k: 'pic', ch: 't' }, { k: 'pic', ch: 'a' }, { k: 'pic', ch: 's' }, { k: 'pic', ch: 'p' }, { k: 'word', w: 'sat' }, { k: 'word', w: 'tap' }, { k: 'word', w: 'at' }];
    G.rounds(Q.length); await G.say('Show me what you know!', 'Tap the right one each time.');
    for (const q of Q) {
      G.newRound(); let objs = [], goal, ask;
      const pos = (i, m) => n() ? (m > 3 ? V(-0.75 + (i % 2) * 1.5, 2.3 - Math.floor(i / 2) * 1.5, 1.0) : V((i - (m - 1) / 2) * 1.6, 0.85, 1.4)) : V((i - (m - 1) / 2) * (m > 3 ? 2.2 : 2.9), 0.85, 1.0);   /* four tiles: a 2 x 2 grid on a phone */
      if (q.k === 'sound') { const L = shuffle(['s', 'a', 't', 'p']); objs = L.map((c, i) => { const t = letterTile(c); t.position.copy(pos(i, 4)); t.scale.setScalar(n() ? 0.85 : 0.82); S.scene.add(t); t.userData.c = c; return t; }); goal = objs[L.indexOf(q.ch)];
        ask = ['Which letter says this sound?', snd(q.ch)]; }
      if (q.k === 'pic') { const big = letterTile(q.ch); big.position.set(0, 2.35, -1.6); S.scene.add(big); objs.push(big); big.userData.keep = true;
        const ps = shuffle([shuffle(START[q.ch])[0], ...shuffle(others(q.ch)).slice(0, 2)]); const its = ps.map((w, i) => G.item(w, () => pos(i, 3), { size: 1.05 })); goal = its.find(it => START[q.ch].includes(it.name)); objs.push(...its.map(it => it.obj));
        ask = ['Look at this letter.', 'Tap the picture that starts with its sound.']; }
      if (q.k === 'word') { const ws = shuffle([q.w, ...shuffle(['sat', 'tap', 'pat', 'at', 'sap'].filter(x => x !== q.w)).slice(0, 2)]);
        objs = ws.map((w, i) => { const g = new THREE.Group(); w.split('').forEach((c, k) => { const t = letterTile(c); t.scale.setScalar(0.62); t.position.set((k - (w.length - 1) / 2) * 0.8, 0, 0); g.add(t); }); g.position.copy(pos(i, 3)); g.scale.setScalar(n() ? 0.6 : 1); S.scene.add(g); g.userData.w = w; return g; });
        goal = objs[ws.indexOf(q.w)]; ask = ['Tap the word ' + q.w + '.']; }
      await G.say(ask);
      const targets = q.k === 'pic' ? G.items.filter(i => i.live) : objs;
      G.expect({ kind: 'tap', at: goal.obj || goal }); const wr = targets.find(t => t !== goal && !(t.userData && t.userData.keep)); G.A.wrongMove = { kind: 'tap', at: wr.obj || wr };
      await new Promise(res => { let tries = 0; const hit = async t => { if (t === goal) { G.taps = []; G.items.forEach(i => i.onTap = () => {}); await G.right((goal.obj || goal).position); res(); }
          else { tries++; if (q.ch) { try { const k = 'kabc-weak', w = JSON.parse(localStorage.getItem(k) || '[]'); if (!w.includes(q.ch)) w.push(q.ch); localStorage.setItem(k, JSON.stringify(w)); } catch (e) {} }   /* a missed sound comes back first in the review */ await G.wrong(tries < 2 ? ['Look again.', ...ask] : ['This one!']); if (tries >= 2) { if (goal.glow) goal.glow(true); else goal.scale.multiplyScalar(1.2); } } };
        if (q.k === 'pic') targets.forEach(it => it.onTap = () => { it.say(); hit(it); });
        else objs.forEach(o => { const h = tapHit(G, o, 0.85); if (q.k === 'word') h.scale.set(1.6, 0.8, 1); G.tap(h, () => { if (q.k === 'sound') audio.letter(o.userData.c); hit(o); }); }); });
      await clearItems(G); objs.forEach(o => S.scene.remove(o)); G.taps = [];
    }
    await G.done(G.A.firstTry >= Q.length - 1 ? 'You know all four sounds!' : 'Good work! Let\'s practice more.');
  }
};

/* =========================================================== review: Units 1 and 2 mixed =========================================================== */
const review = {
  world(G) { const W = base(G.S, 'pond', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F }); pond(G.S, 7.5, -6, 2.2, 1.6);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(4); await G.say('Review time! Old games and new sounds.');
    /* 1. rhyme (unit 1): tap the picture that rhymes */
    G.newRound(); { const key = G.item('cat', () => V(0, 2.4, -1.4), { size: 1.1 }), opts = shuffle(['hat', 'sun', 'pear']).map((w, i) => G.item(w, () => n() ? V(-1.6 + i * 1.6, 0.85, 1.4) : V(-2.9 + i * 2.9, 0.85, 1.0), { size: 1.05 })), good = opts.find(o => o.name === 'hat');
      await G.say('Tap the picture that rhymes with cat.'); G.expect({ kind: 'tap', at: good }); G.A.wrongMove = { kind: 'tap', at: opts.find(o => o !== good) };
      await new Promise(res => opts.forEach(it => it.onTap = async () => { it.poke(); await it.say(); if (it === good) { await G.right(it.obj.position, 'Cat, hat!'); res(); } else await G.wrong(['Cat, ' + say(it.name) + '. Not the same end.'], it); })); await clearItems(G); }
    /* 2. first sound -> letter (unit 2): drag the picture onto the letter it starts with */
    G.newRound(); { const L = ['s', 'p'], tl = L.map((c, i) => { const t = letterTile(c); t.position.set(n() ? -1.1 + i * 2.2 : -2.0 + i * 4.0, 2.2, -1.2); S.scene.add(t); return t; }); const pic = G.item('pot', () => n() ? V(0, 0.85, 1.6) : V(0, 0.85, 1.2), { drag: true, size: 1.1 });
      await G.say('Pot. Drag it to the letter it starts with.'); G.expect({ kind: 'drag', from: pic, to: () => tl[1].position }); G.A.wrongMove = { kind: 'drag', from: pic, to: () => tl[0].position };
      await new Promise(res => G.onDrop(async (it, at) => { const h = G.near(it, tl.map(t => t.position), 150); if (!h) return false; if (h === tl[1].position) { G.onDrop(null); await it.moveTo(tl[1].position.clone().add(V(0, -1.0, 0.4))); await G.right(h, 'Pot!'); res(); return true; }
        await G.wrong(['Pot. Listen to the start.', snd('p')], it); return false; })); await clearItems(G); tl.forEach(t => S.scene.remove(t)); }
    /* 3. claps (unit 1): how many parts in pumpkin? tap the drum, then check */
    G.newRound(); { const pic = G.item('pumpkin', () => n() ? V(-1.0, 0.85, 0.6) : V(-1.8, 0.85, 0.4), { size: 1.2 }), drum = prop('drum'); drum.scale.setScalar(1.4); drum.position.set(n() ? 1.1 : 1.8, 0.8, 0.6); S.scene.add(drum); const dh = tapHit(G, drum, 0.8); let c = 0;
      const parts = echo(async () => { for (const b of WORDS.pumpkin.beats) { await audio.say(b); await G.wait(200); } });
      await G.say('Pumpkin.', parts, 'Tap the drum for each part.');
      const setExp = () => { G.expect(c < 2 ? { kind: 'tap', at: drum } : { kind: 'button', sel: '#ok' }); G.A.wrongMove = c === 0 ? null : c === 2 ? { kind: 'tap', at: drum } : { kind: 'button', sel: '#ok' }; }; setExp();
      G.tap(dh, () => { audio.drum(); c++; G.button('ok', true); setExp(); });
      for (;;) { await G.pressed('ok'); G.button('ok', false); if (c === 2) { await G.right(drum.position, 'Pump-kin. Two parts!'); break; } c = 0; setExp(); await G.wrong(['Clap it with me.', parts]); }
      G.taps = []; S.scene.remove(drum); await clearItems(G); }
    /* 4. blend (unit 2): hear the sounds, tap the word */
    G.newRound(); { const ws = shuffle(['pat', 'sat', 'tap']), objs = ws.map((w, i) => { const g = new THREE.Group(); w.split('').forEach((c, k) => { const t = letterTile(c); t.scale.setScalar(0.62); t.position.set((k - 1) * 0.8, 0, 0); g.add(t); }); g.position.set(n() ? 0 : -3 + i * 3, n() ? 0.9 + i * 1.3 : 1.4, 0.6); g.scale.setScalar(n() ? 0.75 : 1); S.scene.add(g); return g; });
      const goal = objs[ws.indexOf('pat')]; await G.say('Listen.', echo(async () => { for (const c of 'pat') await audio.letter(c); }), 'Tap that word.');
      G.expect({ kind: 'tap', at: goal }); G.A.wrongMove = { kind: 'tap', at: objs.find(o => o !== goal) };
      await new Promise(res => objs.forEach((o, i) => { const h = tapHit(G, o, 0.8); h.scale.set(1.6, 0.8, 1); G.tap(h, async () => { if (o === goal) { G.taps = []; await G.right(o.position, 'Pat!'); res(); } else await G.wrong(['Listen again.', echo(async () => { for (const c of 'pat') await audio.letter(c); })]); }); }));
      objs.forEach(o => S.scene.remove(o)); }
    await G.done('Great review!');
  }
};

export const GAMES = { opener: null, 's-meet': meet('s'), 's-trace': trace('s'), 's-hunt': hunt.s, 'a-meet': meet('a'), 'a-trace': trace('a'), 'a-hunt': hunt.a, 't-meet': meet('t'), 't-trace': trace('t'), 't-hunt': hunt.t,
  slide: slide(['at', 'sat'], 'The word slide!'), 'p-meet': meet('p'), 'p-trace': trace('p'), 'p-hunt': hunt.p, slide2: slide(['pat', 'tap', 'sap', 'sat'], 'Back to the word slide!', 'pan', true), story, fixit, check, review };

/* =========================================================== opener: letters show sounds =========================================================== */
GAMES.opener = {
  world(G) { const W = base(G.S, 'morning'); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 8.5, -7, { s: 1.7, c1: 0xE85A9E, c2: 0xFFC2E2 }); G.table = shelf(G.S, -3.6, 3.6, -0.6, 1.1, 0xC98A4B, 1.6);
    G.view({ wide: [-0.4, 2.0, 11.6, 5.8, 0.17], narrow: [0, 2.2, 5.0, 7.6, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(4);
    await G.say('Your ears are on! Now, letters!', 'A letter is a picture of a sound.');
    const F = [['snake', 's'], ['apple', 'a'], ['tree', 't'], ['pinwheel', 'p']];
    const at = i => () => n() ? V(-1.8 + i * 1.2, 1.85, -0.6) : V(-2.7 + i * 1.8, 1.85, -0.6);
    const its = F.map(([w], i) => G.item(w, at(i), { size: n() ? 0.9 : 1.15 }));
    const lets = F.map(([, c], i) => { const t = letterTile(c); t.scale.setScalar(0.0001); S.scene.add(t); const p = () => at(i)().add(V(0, 1.3, 0)); t.position.copy(p()); t.userData.p = p; return t; });
    G.W.layout = () => lets.forEach(t => t.position.copy(t.userData.p()));
    const intro = { s: ['The snake says...', 'Wiggle!'], a: ['Apple starts with...', 'Crunch!'], t: ['Tree starts with...', 'Tick tock!'], p: ['Pinwheel starts with...', 'Pop!'] };
    for (let i = 0; i < 4; i++) { const [w, c] = F[i]; G.newRound();
      await G.say(intro[c][0], snd(c)); await S.tween(400, e => lets[i].scale.setScalar(Math.max(0.0001, e * (n() ? 0.58 : 0.9))), ease.back);
      await G.say('This letter shows that sound.', 'Tap it!');
      await new Promise(res => { const h = tapHit(G, lets[i], 0.8); G.expect({ kind: 'tap', at: lets[i] }); G.A.wrongMove = null; G.tap(h, () => { audio.letter(c); G.taps = []; res(); }); });
      await G.right(lets[i].position, intro[c][1]); }
    /* the s-a-t-p action chant: every friend wiggles in turn */
    G.A.name = 'song'; await G.say('Our chant! Do the moves with me.');
    for (let i = 0; i < 4; i++) { const [w, c] = F[i]; its[i].poke(); lets[i].rotation.z = 0.2; G.mendy.wiggle(); await G.say({ s: 'Wiggle, wiggle,', a: 'Apple crunch,', t: 'Tick tock,', p: 'Pop, pop,' }[c]); await audio.letter(c); await audio.letter(c); lets[i].rotation.z = 0; }
    G.A.name = 'play'; await G.done('Let\'s meet each sound!');
  }
};
