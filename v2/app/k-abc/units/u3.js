/* Kindergarten ABC 2.0 — Unit 3: i n m d (weeks 5–7). v2/curriculum/k-abc/MAP.md
   Skill: four new sounds, each used in words the same day; hear 2–3 sounds in a short word (sound boxes, light).
   The letter kit again (meet, trace), each letter in its own world: i the inchworm, n the butterfly net, m the mountains, d the drum.
   Every hunt is a NEW kind of play (none repeats Units 1–2):
     i-hunt  the fork path: the inchworm crawls along; at each fork he taps the picture that starts with i
     n-hunt  the net catch: butterflies carry pictures; he drags the net over the ones that start with n
     m-hunt  the memory cards: flip cards to find every m picture
     d-hunt  drum only on d: pictures pop up one at a time; he taps the drum only when it starts with d
   boxes   sound boxes (light): he hears a picture word and pushes one token into a box for each sound (it = 2, pin = 3)
   slide / slide2  word slide with the new sounds (it, in, sit, pin, tin / nap, man, mat, map, dip, dad, did, mad)
   fixit   Dovid reads a word aloud; thumbs up or down; then he taps the letter Dovid read wrong
   review (Units 1–3 mixed) before check (tap kinds: sound → letter, read 4 words, how many sounds in 2 words) */
import { THREE, V, shuffle, rnd, audio, echo, WORDS, FAST, ease, clamp } from '../game.js';
import { base, tree, rock, pond, stump, basket, shelf } from '../scenes.js';
import { prop } from '../props.js';
import { glow, C, toon } from '../kit3d.js';
import { letterTile } from '../letters.js';
import { meet, trace, slide, START, others, KEYWORD } from './u2.js';

export const ORDER = ['opener', 'i-meet', 'i-trace', 'i-hunt', 'n-meet', 'n-trace', 'n-hunt', 'slide', 'boxes',
  'm-meet', 'm-trace', 'm-hunt', 'd-meet', 'd-trace', 'd-hunt', 'slide2', 'fixit', 'review', 'check'];
const say = w => (WORDS[w] ? WORDS[w].say : w);
const snd = ch => echo(() => audio.letter(ch));
const sounds = w => echo(async () => { for (const c of w) await audio.letter(c); });
function clearItems(G) { return Promise.all(G.items.slice().map(i => i.remove())); }
const tapHit = (obj, r = 0.9) => { const h = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); obj.add(h); return h; };
const wordTiles = (S, w, k = 0.62) => { const g = new THREE.Group(); w.split('').forEach((c, i) => { const t = letterTile(c); t.scale.setScalar(k); t.position.set((i - (w.length - 1) / 2) * k * 1.3, 0, 0); t.userData.c = c; g.add(t); }); S.scene.add(g); return g; };

/* a word with the new sound, the same day (MAP.md: "each used in words the same day") */
async function todayWord(G, w) {
  const S = G.S, pip = document.createElement('i'); document.getElementById('pips').appendChild(pip); G.newRound();
  const g = wordTiles(S, w, G.narrow() ? 0.6 : 0.75); g.position.set(0, 3.2, 0.3); const h = tapHit(g, 1.0); h.scale.set(1.8, 0.8, 1);
  await G.say('A new word with this sound!', 'Read it with me.', sounds(w), w + '.');
  await G.say('Tap the word and read it again.');
  await new Promise(res => { G.expect({ kind: 'tap', at: g }); G.A.wrongMove = null; G.tap(h, async () => { G.taps = []; for (const c of w) await audio.letter(c); res(); }); });
  await G.right(g.position, w + '! You read it!'); S.scene.remove(g);
}
/* =========================================================== hunts =========================================================== */
const hunt = {
  /* i: the fork path. The inchworm crawls along a garden path; at each fork two pictures wait; he taps the one that starts with i */
  i: {
    world(G) { const W = base(G.S, 'garden', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6.5, { s: 1.6, c1: 0xE85A9E, c2: 0xFFC2E2 });
      const stones = new THREE.Group(); for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.12, 24), toon(0xE8DCC8, { rough: .7 })); s.position.set(-4 + i, 0.06, 2.2 - Math.sin(i * 0.7) * 0.3); s.receiveShadow = true; stones.add(s); } G.S.scene.add(stones); G.stones = stones;
      G.view({ wide: [0, 1.8, 11.6, 5.6, 0.22], narrow: [0, 1.8, 5.2, 7.8, 0.26] }); G.mendyAt = { wide: [-4.9, 0.4, 0.85], narrow: [1.55, 3.9, 0.45] };
      const lay = () => { G.stones.scale.set(G.narrow() ? 0.52 : 1, 1, 1); }; lay(); G.lay0 = lay; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), worm = prop('inchworm'); worm.scale.setScalar(0.8); S.scene.add(worm);
      let wx = -3.2; const placeWorm = () => { worm.position.set(n() ? wx * 0.52 : wx, 0.45, 2.3); worm.scale.setScalar(n() ? 0.55 : 0.8); }; placeWorm(); G.W.layout = () => { placeWorm(); G.lay0(); };
      S.tick(t => { worm.userData.inner.scale.set(1 + Math.sin(t * 6) * 0.05, 1 - Math.sin(t * 6) * 0.05, 1); });
      const oth = shuffle(others('i')), FORKS = shuffle(START.i).map((w, i) => [w, oth[i]]);
      G.rounds(FORKS.length); await G.say('The inchworm wants to go home.', 'Show him the way! Tap the picture that starts with this sound.', snd('i'));
      for (let r = 0; r < FORKS.length; r++) {
        G.newRound(); const pair = shuffle(FORKS[r]), x = -1.5 + r * 2.2;
        const its = pair.map((w, i) => G.item(w, () => n() ? V(i ? 1.0 : -1.0, 2.2, -0.4) : V(x + (i ? 1.0 : -1.0), 1.9, -0.6), { size: 1.0 }));   /* the fork's two pictures side by side above the path */
        const good = its.find(it => START.i.includes(it.name)), bad = its.find(it => it !== good);
        G.expect({ kind: 'tap', at: good }); G.A.wrongMove = { kind: 'tap', at: bad };
        G.hint(async () => { good.glow(true); await G.say(say(good.name) + '.', snd('i')); });
        await new Promise(res => its.forEach(it => it.onTap = async () => { it.poke(); await it.say(); if (it === good) { its.forEach(x2 => x2.onTap = () => x2.say()); res(); } else await G.wrong([say(it.name) + '. Listen to the start.', snd('i')], it); }));
        const to = x; await S.tween(700, e => { wx = wx + (to - wx) * e; placeWorm(); }); await G.right(good.obj.position, say(good.name) + '!'); await clearItems(G);
      }
      await S.tween(800, e => { wx = 4 * e + wx * (1 - e); placeWorm(); }); await todayWord(G, 'sit'); await G.done('The inchworm is home!');
    }
  },
  /* n: the net catch. Butterflies carry pictures; he drags the net over the ones that start with n */
  n: {
    world(G) { const W = base(G.S, 'meadow', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.6 }); tree(G.S, 9.5, -6, { s: 1.4 }); G.view({ wide: [0, 2.4, 11.6, 6.2, 0.17], narrow: [0, 2.6, 5.2, 8.2, 0.2] }); return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(); const set = shuffle([...shuffle(START.n).slice(0, 3).map(w => [w, true]), ...shuffle(others('n')).slice(0, 3).map(w => [w, false])]);
      /* the net: a tool he drags (handle + hoop + mesh) */
      const net = new THREE.Group(), wood = toon(0xC98A4B); const hdl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 10), wood); hdl.position.y = -0.95; net.add(hdl);
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 10, 36), toon(0xFF7A45, { clear: 1 })); net.add(hoop); const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, side: THREE.DoubleSide })); net.add(mesh);
      const netHome = () => n() ? V(1.4, 1.6, 2.4) : V(3.6, 1.6, 2.0); net.position.copy(netHome()); S.scene.add(net); G.W.layout = () => { if (!net.userData.d) net.position.copy(netHome()); };
      const netItem = { obj: net, screen: () => S.toScreen(net.position) };
      const its = set.map(([w, yes], i) => { const it = G.item(w, () => V(0, 3, 0), { size: 0.8, data: { yes, ph: i * 1.05, roam: true } }); const b = new THREE.Group(); [-1, 1].forEach(s2 => { const wg = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 10), toon([0xFF7AC8, 0xB46BFF, 0x4FC3FF][i % 3], { emissive: 0x331133, ei: .2 })); wg.scale.set(1, 1.2, 0.12); wg.position.set(s2 * 0.4, 0.6, -0.2); b.add(wg); }); it.obj.add(b); it.wings = b; return it; });
      let t0 = 0; S.tick((t, dt) => { t0 += dt * (FAST ? 0.4 : 1); its.forEach((it, i) => { if (it.placed || !it.live) return; const a = t0 * 0.35 + it.data.ph, w = n() ? 1.7 : 3.4;
        const nearNet = net.userData.d && it.obj.position.distanceTo(net.position) < 1.6; if (nearNet) { it.data.ph -= dt * 0.35 * (FAST ? 0.4 : 1); }   /* it waits for the net */
        it.home.set(Math.sin(a) * w - (n() ? 0 : 0.4), (n() ? 3.6 : 3.0) + Math.sin(a * 1.7) * (n() ? 1.6 : 1.1), -0.3); if (!it.moving) it.obj.position.copy(it.home); it.wings.children.forEach((wg, k) => wg.rotation.y = Math.sin(t * 12 + i) * 0.6 * (k ? -1 : 1)); }); });
      G.rounds(3); await G.say('Butterflies are carrying pictures!', 'Catch the ones that start with this sound.', snd('n'), 'Drag the net over them.');
      /* dragging the net: it catches whatever picture it touches */
      const el = S.renderer.domElement; let dragging = false, caught = null, roundDone = null;
      el.addEventListener('pointerdown', e => { const p = S.toScreen(net.position); if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 90) { dragging = true; G.locked = true; net.userData.d = true; } });
      addEventListener('pointermove', e => { if (!dragging) return; const q = S.onPlane(e, -0.3); if (q) net.position.copy(q); });
      addEventListener('pointerup', async () => { if (!dragging) return; dragging = false; G.locked = false; net.userData.d = false;
        const hit = its.filter(it => !it.placed && it.live).sort((a, b) => a.obj.position.distanceTo(net.position) - b.obj.position.distanceTo(net.position))[0];
        const near = hit && G.near(hit, [net.position], 110); net.position.copy(netHome()); if (near && roundDone) roundDone(hit); });
      let got = 0;
      while (got < 3) {
        G.newRound(); const vis = () => its.filter(i => !i.placed && Math.abs(i.home.x) < (n() ? 2.0 : 4.0));
        let lastG; const exp = () => { const v = vis(), g = v.find(i => i.data.yes), b = v.find(i => !i.data.yes); if (g !== lastG) { lastG = g; G.expect(g ? { kind: 'drag', from: netItem, to: () => g.obj.position } : null); } G.A.wrongMove = b ? { kind: 'drag', from: netItem, to: () => b.obj.position } : null; };
        const timer = setInterval(exp, 200); exp();
        G.hint(async () => { const g = its.find(i => i.data.yes && !i.placed); if (g) { g.glow(true); await G.say(say(g.name) + '.', snd('n')); } });
        await new Promise(res => { roundDone = async it => { if (it.data.yes) { roundDone = null; it.placed = true; it.glow(false); it.wings.visible = false; it.size *= 0.6; await it.moveTo(netHome().add(V(-0.6 + got * 0.6, -0.9, 0)), 400); got++; await G.right(it.obj.position, say(it.name) + '!'); res(); }
          else { await G.wrong([say(it.name) + '. Listen to the start.', snd('n')], it); } }; });
        clearInterval(timer);
      }
      await todayWord(G, 'tin'); await G.done('What a catch!');
    }
  },
  /* m: the memory cards. Flip cards to find every picture that starts with m */
  m: {
    world(G) { const W = base(G.S, 'sunset', { clearW: 7 }); tree(G.S, -9.5, -6, { s: 1.4 }); tree(G.S, 9.5, -7, { s: 1.6, c1: 0x3A9E5A, c2: 0xB8E06A }); G.view({ wide: [0, 2.2, 11, 5.8, 0.17], narrow: [0, 2.4, 5.2, 8.2, 0.2] }); return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), yes = shuffle(START.m).slice(0, 3), no = shuffle(others('m')).slice(0, 3), all = shuffle([...yes, ...no]);
      const pos = i => n() ? V(-1.3 + (i % 2) * 2.6, 4.6 - Math.floor(i / 2) * 1.6, 0) : V(-3 + (i % 3) * 3, 3.4 - Math.floor(i / 3) * 2.0, 0);
      const cards = all.map((w, i) => { const c = new THREE.Group(), back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.12), toon(0x8A7BD8, { clear: 1, rough: .3 })); c.add(back);
        const star = new THREE.Mesh(new THREE.CircleGeometry(0.3, 5), toon(0xFFD23F, { emissive: 0xAA7700, ei: .3 })); star.position.z = -0.07; star.rotation.y = Math.PI; c.add(star);
        const pic = prop(w); pic.scale.setScalar(0.7); pic.position.z = 0.25; c.add(pic); c.position.copy(pos(i)); c.rotation.y = Math.PI; c.userData = { w, yes: yes.includes(w), up: false, i }; S.scene.add(c); tapHit(c, 0.8); return c; });
      G.W.layout = () => cards.forEach(c => c.position.copy(pos(c.userData.i)));
      const flip = (c, up) => S.tween(350, e => c.rotation.y = up ? Math.PI * (1 - e) : Math.PI * e);
      G.rounds(3); await G.say('Memory cards! Look at all the pictures.', 'Remember the ones that start with this sound.', snd('m'));
      await Promise.all(cards.map(c => flip(c, true))); await G.wait(FAST ? 0 : 3500); await Promise.all(cards.map(c => flip(c, false)));   /* a long look first, so it is memory, not guessing */
      await G.say('Now flip a card that starts with this sound.');
      let found = 0, busy = false;
      for (let r = 0; r < 3; r++) {
        G.newRound(); const nextGood = () => cards.find(c => c.userData.yes && !c.userData.up), nextBad = () => cards.find(c => !c.userData.yes && !c.userData.up);
        G.expect({ kind: 'tap', at: () => (nextGood() || cards[0]).position }); G.A.wrongMove = nextBad() ? { kind: 'tap', at: () => (nextBad() || cards[0]).position } : null;
        G.hint(async () => { const g = nextGood(); g.scale.setScalar(1.12); await G.say('Try this card.'); });
        await new Promise(res => { G.taps = []; cards.forEach(c => { if (c.userData.up) return; G.tap(c.children[c.children.length - 1], async () => { if (busy || c.userData.up) return; busy = true;
          await flip(c, true); const w = c.userData.w; await audio.say(say(w));
          if (c.userData.yes) { c.userData.up = true; c.scale.setScalar(1); busy = false; found++; G.taps = []; await G.right(c.position, say(w) + '! Mmm!'); res(); }
          else { await G.wrong([say(w) + '. Not this sound. Try another card.']); await flip(c, false); busy = false; } }); }); });
      }
      await todayWord(G, 'mat'); await G.done('You found every one!');
    }
  },
  /* d: drum only on d. Pictures pop up one at a time; he taps the drum only when the picture starts with d, and lets the others go by */
  d: {
    world(G) { const W = base(G.S, 'golden', { clearW: 7 }); tree(G.S, -9, -5, { s: 1.6, c1: 0x5A9E2A, c2: 0xD8E04A }); tree(G.S, 9.5, -6, { s: 1.4, c1: 0x6AAE2A, c2: 0xF2C84A });
      G.st = stump(G.S, 0, -1.2, 1.0, 1.0); G.view({ wide: [0, 2.0, 11, 5.6, 0.17], narrow: [0, 2.2, 5.2, 8.0, 0.2] }); return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(); const drum = prop('drum'); drum.scale.setScalar(1.6); S.scene.add(drum); const dAt = () => n() ? V(1.2, 0.9, 2.0) : V(3.0, 0.9, 1.6); drum.position.copy(dAt()); G.W.layout = () => drum.position.copy(dAt());
      const hit = tapHit(drum, 0.75); let tapped = 0; G.tap(hit, () => { tapped++; audio.drum(); drum.scale.set(1.7, 1.5, 1.7); setTimeout(() => drum.scale.setScalar(1.6), 120); });
      const seq = shuffle([...shuffle(START.d).slice(0, 3).map(w => [w, true]), ...shuffle(others('d')).slice(0, 3).map(w => [w, false])]);
      G.rounds(seq.length); await G.say('Drum time! Watch the stump.', 'Tap the drum only when it starts with this sound.', snd('d'));
      await G.say('If it does not, wait. Let it go by.');
      for (const [w, yes] of seq) {
        G.newRound(); const it = G.item(w, () => V(0, 1.75, -1.2), { size: 1.2 }); await it.say(); tapped = 0; let tries = 0;
        for (;;) { tries++;
        /* he has a few seconds: tap (yes) or wait (no); the hourglass is the glowing ring around the stump */
        const ring = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.18, 48, 1, 0, Math.PI * 2), new THREE.MeshBasicMaterial({ color: C(0xFFF3A0).multiplyScalar(1.4), side: THREE.DoubleSide, transparent: true, opacity: 0.8 })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, 1.02, -1.2); S.scene.add(ring);
        G.expect(yes ? { kind: 'tap', at: drum } : { kind: 'wait' }); G.A.wrongMove = yes ? null : { kind: 'tap', at: drum };
        const T0 = S.t, limit = FAST ? 3.5 : 4.5; let ok = null;
        await new Promise(res => { const id = setInterval(() => { const el = S.t - T0; ring.scale.setScalar(Math.max(0.01, 1 - el / limit));
          if (tapped > 0) { clearInterval(id); ok = yes; res(); } else if (el > limit) { clearInterval(id); ok = !yes ? true : null; res(); } }, 50); });
        S.scene.remove(ring);
        if (ok === true) await G.right(it.obj.position, yes ? say(w) + '! Drum, drum!' : 'Good waiting! ' + say(w) + ' is not this sound.');
        else if (ok === null && tries < 2) { await G.wrong([say(w) + '!', snd('d'), 'It starts with this sound. Try again!']); drum.scale.setScalar(1.9); setTimeout(() => drum.scale.setScalar(1.6), 900); tapped = 0; continue; }   /* one more try, the drum glows big */
        else { if (ok === false) await G.wrong([say(w) + '. Listen to the start.', 'Wait when it is not this sound.']);
          else await G.wrong([say(w) + ' starts with this sound.', 'Next time, tap the drum!']);
          G.A.rounds++; const pip = document.getElementById('pips').children[G.ri++]; if (pip) pip.className = 'done'; }   /* a missed round still counts (no star) */
        break; }
        await it.remove();
      }
      await todayWord(G, 'dad'); await G.done('Drum, drum! Great listening!');
    }
  }
};

/* =========================================================== sound boxes (light) =========================================================== */
const boxes = {
  world(G) { const W = base(G.S, 'morning', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6.5, { s: 1.6 }); G.board = shelf(G.S, -3.2, 3.2, -0.8, 1.0, 0xC98A4B, 1.6);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.2], narrow: [0, 2.1, 5.2, 7.8, 0.24] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); const WORDS3 = [['it'], ['in'], ['pin'], ['tin'], ['sit'], ['tip']];   /* only sounds he already has (m comes later in this unit) */
    G.rounds(WORDS3.length); await G.say('Sound boxes! Every sound gets a box.', 'Push one green chip into a box for each sound.');
    const bx = i => n() ? V(-1.3 + i * 1.3, 1.25, -0.6) : V(-1.8 + i * 1.8, 1.25, -0.6);
    const boxesM = [0, 1, 2].map(i => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 1.0), toon(0xFFF6E2, { rough: .5 })); b.position.copy(bx(i)); S.scene.add(b); return b; });
    let first = true;
    for (const [wi, [w]] of WORDS3.entries()) {
      G.newRound(); const pic = WORDS[w] ? G.item(w, () => V(n() ? 1.5 : 3.8, 2.4, -0.6), { size: 1.0 }) : null; const need = w.length; let c = 0; const tokens = [];
      const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.16, 24), toon(0x4DDB6A, { clear: 1 })); pile.position.copy(n() ? V(0, 0.75, 2.2) : V(0, 0.75, 2.0)); S.scene.add(pile);
      const pileItem = { obj: pile, screen: () => S.toScreen(pile.position) };
      if (first) { first = false; await G.say('Watch me.', 'Sat.'); for (let k = 0; k < 3; k++) { const tk = token(S); tk.position.copy(bx(k)).add(V(0, 0.25, 0)); tokens.push(tk); await audio.letter('sat'[k]); await G.wait(250); }
        await G.say('Three sounds, three chips!'); tokens.splice(0).forEach(t => S.scene.remove(t)); }
      await G.say('Listen: ' + w + '.', wi < 2 ? 'Push a chip for each sound.' : 'Say it slowly. A chip for each sound.');
      const setExp = () => { G.expect(c < need ? { kind: 'drag', from: pileItem, to: () => bx(c) } : { kind: 'button', sel: '#ok' }); G.A.wrongMove = c === 0 ? null : c === need ? { kind: 'drag', from: pileItem, to: () => bx(Math.min(2, c)) } : { kind: 'button', sel: '#ok' }; };
      setExp();
      G.hint(async () => { await G.say('Say it slowly with me.', sounds(w)); });
      /* drag from the green pile into the next box */
      const el = S.renderer.domElement; let d = false;
      const down = e => { const p = S.toScreen(pile.position); if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 70) { d = true; G.locked = true; } };
      const up = e => { if (!d) return; d = false; G.locked = false; const q = S.onPlane(e, -0.6); if (!q || c >= 3) return; const tgt = bx(c); const a1 = { x: e.clientX, y: e.clientY }, b1 = S.toScreen(tgt);
        if (Math.hypot(a1.x - b1.x, a1.y - b1.y) < 110 * Math.max(0.6, Math.min(innerWidth, innerHeight) / 768)) { const tk = token(S); tk.position.copy(tgt).add(V(0, 0.25, 0)); tokens.push(tk); if (wi < 2 && w[c]) audio.letter(w[c]); else audio.pop(); c++;   /* from the third word the chips are silent: he says the sounds himself */ G.button('ok', true); setExp(); } };
      el.addEventListener('pointerdown', down); addEventListener('pointerup', up);
      for (;;) { await G.pressed('ok'); G.button('ok', false);
        if (c === need) { const ds = dotStone(S, need); ds.position.copy(bx(1)).add(V(0, 1.6, 0.3)); ds.scale.setScalar(0.8);   /* the dot stone for this many sounds (as in the check) */
          await G.right(bx(need - 1), say(w) + '. ' + (need === 2 ? 'Two' : 'Three') + ' sounds!'); S.scene.remove(ds); break; }
        tokens.splice(0).forEach(t => S.scene.remove(t)); c = 0; setExp(); await G.wrong(['Let\'s say it slowly.', sounds(w), 'One chip for each sound.']); }
      el.removeEventListener('pointerdown', down); removeEventListener('pointerup', up);
      tokens.forEach(t => S.scene.remove(t)); S.scene.remove(pile); if (pic) await pic.remove();
    }
    await G.done('You can hear every sound!');
  }
};
function token(S) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 24), toon(0x4DDB6A, { clear: 1, rough: .25, emissive: 0x0A4A1A, ei: .3 })); S.scene.add(t); return t; }

/* =========================================================== fix it: Dovid reads aloud =========================================================== */
const READS = [{ w: 'sit', said: 'sat', bad: 1 }, { w: 'map', said: 'map' }, { w: 'dip', said: 'tip', bad: 0 }, { w: 'man', said: 'man' }, { w: 'pin', said: 'pit', bad: 2 }];
const fixit = {
  world(G) { const W = base(G.S, 'meadow', { clearW: 7 }); tree(G.S, -9, -7, { s: 1.6 }); tree(G.S, 8.5, -7.5, { s: 1.4 }); G.board = shelf(G.S, -2.8, 2.8, -1.2, 1.4, 0xC98A4B, 1.2);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.1, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(READS.length);
    const dv = await G.friend('dovid'); await G.say('This is my friend Dovid. He reads to us.', 'Listen. Is he right?');
    { /* watch me: Mendy finds the sound Dovid mixed up */
      const g = wordTiles(S, 'sat', n() ? 0.62 : 0.8); g.position.set(0, 2.15, -1.2); dv.set('think', 4);
      await G.say('Watch me. Dovid says sap.', 'I check each sound.', echo(async () => { for (const [k, c] of [...'sat'].entries()) { g.children[k].scale.multiplyScalar(1.15); await audio.letter(c); g.children[k].scale.multiplyScalar(1 / 1.15); } }));
      g.children[2].scale.multiplyScalar(1.2); G.mendy.set('point', 2); await G.say('The last sound is wrong.', 'It says sat, not sap.'); S.scene.remove(g); }
    for (const r of READS) {
      G.newRound(); const g = wordTiles(S, r.w, n() ? 0.62 : 0.8); g.position.set(0, 2.15, -1.2);
      dv.set('think', 30); await G.say('Dovid reads this word.', 'He says ' + r.said + '.', 'Is he right?');
      const ok = r.w === r.said; G.button('yes', true); G.button('no', true);
      for (;;) { G.expect({ kind: 'button', sel: ok ? '#yes' : '#no' }); G.A.wrongMove = { kind: 'button', sel: ok ? '#no' : '#yes' };
        const p = await G.pressed('yes', 'no'); if ((p === 'yes') === ok) break; await G.wrong(['Read it with me.', sounds(r.w), 'Did he say ' + r.w + '?']); }
      G.button('yes', false); G.button('no', false);
      if (!ok) {
        await G.say('Dovid mixed up one sound.', 'Tap the letter he read wrong.');
        const tiles = g.children, badT = tiles[r.bad];
        G.expect({ kind: 'tap', at: badT }); G.A.wrongMove = { kind: 'tap', at: tiles[(r.bad + 1) % tiles.length] };
        G.hint(async () => { badT.scale.multiplyScalar(1.15); await G.say('Listen to each sound.', sounds(r.w)); });
        await new Promise(res => tiles.forEach((t, i) => { G.tap(tapHit(t, 0.7), async () => { audio.letter(t.userData.c); if (i === r.bad) { G.taps = []; dv.set('happy', 1.5); dv.hopNow(); await G.right(g.position, 'Yes! It says ' + r.w + '.'); res(); } else await G.wrong(['That sound was right.', 'Find the one he mixed up.']); }); }));
      } else { dv.set('happy', 1.5); dv.hopNow(); await G.right(g.position, 'Yes! Dovid read ' + r.w + '!'); }
      S.scene.remove(g); G.taps = [];
    }
    dv.set('happy', 3); await G.done('Dovid says thank you!');
  }
};

/* =========================================================== review (Units 1–3) and check =========================================================== */
const review = {
  world(G) { const W = base(G.S, 'pond', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F }); pond(G.S, 7.5, -6, 2.2, 1.6);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(4); await G.say('Review time! Old and new sounds.');
    const row = (ws, z = 1.0) => ws.map((w, i) => G.item(w, () => n() ? V(-1.6 + i * 1.6, 0.85, z + 0.4) : V(-2.9 + i * 2.9, 0.85, z), { size: 1.05 }));
    const tapOne = (its, good, ask, fix) => new Promise(res => { G.expect({ kind: 'tap', at: good }); G.A.wrongMove = { kind: 'tap', at: its.find(i => i !== good) };
      its.forEach(it => it.onTap = async () => { it.poke(); await it.say(); if (it === good) { its.forEach(x => x.onTap = () => x.say()); await G.right(it.obj.position); res(); } else await G.wrong(fix, it); }); });
    /* 1. rhyme (Unit 1) */
    G.newRound(); { const its = row(shuffle(['cake', 'dog', 'mop'])); await G.say('Tap the picture that rhymes with snake.'); await tapOne(its, its.find(i => i.name === 'cake'), [], ['Snake... listen to the end.']); await clearItems(G); }
    /* 2. first sound d (Unit 3) */
    G.newRound(); { const its = row(shuffle(['duck', 'sun', 'pear'])); await G.say('Tap the one that starts with this sound.', snd('d')); await tapOne(its, its.find(i => i.name === 'duck'), [], ['Listen for this sound.', snd('d')]); await clearItems(G); }
    /* 3. read the word (Units 2–3): tap its picture */
    G.newRound(); { const g = wordTiles(S, 'map', n() ? 0.6 : 0.75); g.position.set(0, 2.6, -1.2); const its = row(shuffle(['map', 'mop', 'cat'])); await G.say('Read the word. Tap its picture.'); await tapOne(its, its.find(i => i.name === 'map'), [], ['Read it slowly.', sounds('map')]); S.scene.remove(g); await clearItems(G); }
    /* 4. how many sounds (Unit 3): tap the stone with that many dots */
    G.newRound(); { const pads = [2, 3].map((k, i) => { const p = dotStone(S, k); p.position.copy(n() ? V(-1.0 + i * 2.0, 0.85, 1.4) : V(-1.5 + i * 3.0, 0.85, 1.0)); return p; }); const pic = G.item('pin', () => V(0, 2.3, -1.2), { size: 1.0 });
      await G.say('Pin. How many sounds?', 'Tap the stone with that many dots.');
      await new Promise(res => { G.expect({ kind: 'tap', at: pads[1] }); G.A.wrongMove = { kind: 'tap', at: pads[0] };
        pads.forEach((p, i) => G.tap(tapHit(p, 0.7), async () => { if (i === 1) { G.taps = []; await G.right(p.position, 'Pin. Three sounds!'); res(); } else await G.wrong(['Say it slowly.', sounds('pin')]); })); });
      pads.forEach(p => S.scene.remove(p)); await clearItems(G); }
    await G.done('Great review!');
  }
};
function dotStone(S, k) { const G = new THREE.Group(), st = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.2, 40), toon(0xF4EEFF, { rough: .4, clear: .6 })); st.rotation.x = Math.PI / 2; G.add(st);
  for (let i = 0; i < k; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), glow(0x4DDB6A, 1.6)); d.position.set((i - (k - 1) / 2) * 0.36, 0, 0.14); G.add(d); } S.scene.add(G); return G; }

const check = {
  world(G) { const W = base(G.S, 'sunset'); tree(G.S, -9, -6, { s: 1.5, c1: 0x3A9E5A, c2: 0xB8E06A }); tree(G.S, 9.5, -7, { s: 1.6, c1: 0xC85AA8, c2: 0xFFC2E2 });
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow();
    const Q = [{ k: 'sound', ch: 'i' }, { k: 'sound', ch: 'd' }, { k: 'sound', ch: 'n' }, { k: 'sound', ch: 'm' }, { k: 'word', w: 'sit' }, { k: 'word', w: 'man' }, { k: 'word', w: 'dip' }, { k: 'word', w: 'nap' }, { k: 'count', w: 'it', n: 2 }, { k: 'count', w: 'map', n: 3 }];
    G.rounds(Q.length); await G.say('Show me what you know!', 'Tap the right one each time.');
    const pos = (i, m, col) => n() ? (m > 3 ? V(-0.75 + (i % 2) * 1.5, 2.3 - Math.floor(i / 2) * 1.5, 1.0) : col ? V(0, 3.2 - i * 1.25, 0.8) : V((i - (m - 1) / 2) * 1.6, 0.85, 1.4)) : V((i - (m - 1) / 2) * (m > 3 ? 2.2 : 2.9), 0.85, 1.0);   /* phone: letters 2 x 2, words in a column */
    for (const q of Q) {
      G.newRound(); let objs = [], goal, ask;
      if (q.k === 'sound') { const pool = ['i', 'n', 'm', 'd', 's', 'a', 't', 'p'].filter(c => c !== q.ch && !(q.ch === 'm' && c === 'n') && !(q.ch === 'n' && c === 'm')); const L = shuffle([q.ch, ...shuffle(pool).slice(0, 3)]);   /* m and n (both hums) never side by side */ objs = L.map((c, i) => { const t = letterTile(c); t.position.copy(pos(i, 4)); t.scale.setScalar(n() ? 0.85 : 0.82); S.scene.add(t); t.userData.c = c; return t; });
        goal = objs[L.indexOf(q.ch)]; ask = ['Which letter says this sound?', snd(q.ch)]; }
      if (q.k === 'word') { const near = { sit: ['sat', 'tin'], man: ['mat', 'nap'], dip: ['dad', 'tip'], nap: ['pan', 'map'] }[q.w] || ['mat', 'tin']; const ws = shuffle([q.w, ...near]);   /* look-alike words, so a first-letter guess does not work */
        objs = ws.map((w, i) => { const g = wordTiles(S, w, 0.62); g.position.copy(pos(i, 3, true)); g.scale.setScalar(n() ? 0.75 : 1); return g; }); goal = objs[ws.indexOf(q.w)]; ask = ['Tap the word ' + q.w + '.']; }
      if (q.k === 'count') { objs = [1, 2, 3].map((k, i) => { const p = dotStone(S, k); p.position.copy(pos(i, 3)); return p; }); goal = objs[q.n - 1];
        ask = [(q.w === 'it' ? 'It.' : say(q.w) + '.'), 'How many sounds? Tap the stone with that many dots.']; }
      await G.say(ask);
      G.expect({ kind: 'tap', at: goal }); G.A.wrongMove = { kind: 'tap', at: objs.find(o => o !== goal) };
      await new Promise(res => { let tries = 0; objs.forEach(o => { const h = tapHit(o, 0.8); if (q.k === 'word') h.scale.set(1.6, 0.8, 1);
        G.tap(h, async () => { if (q.k === 'sound') audio.letter(o.userData.c);
          if (o === goal) { G.taps = []; await G.right(o.position); res(); } else { tries++; if (q.ch) { try { const k = 'kabc-weak', w = JSON.parse(localStorage.getItem(k) || '[]'); if (!w.includes(q.ch)) w.push(q.ch); localStorage.setItem(k, JSON.stringify(w)); } catch (e) {} }   /* a missed sound comes back first in the review */ await G.wrong(tries < 2 ? ['Look again.', ...ask] : ['This one!']); if (tries >= 2) goal.scale.multiplyScalar(1.2); } }); }); });
      objs.forEach(o => S.scene.remove(o)); G.taps = [];
    }
    await G.done(G.A.firstTry >= Q.length - 1 ? 'You know your new sounds!' : 'Good work! Let\'s practice more.');
  }
};

/* =========================================================== opener =========================================================== */
const opener = {
  world(G) { const W = base(G.S, 'morning'); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 8.5, -7, { s: 1.7, c1: 0xE85A9E, c2: 0xFFC2E2 }); G.table = shelf(G.S, -3.6, 3.6, -0.6, 1.1, 0xC98A4B, 1.6);
    G.view({ wide: [-0.4, 2.0, 11.6, 5.8, 0.17], narrow: [0, 2.2, 5.0, 7.6, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(4);
    await G.say('Four new sounds today!', 'Then we read new words.');
    const F = [['inchworm', 'i', 'Inchworm starts with...'], ['net', 'n', 'Net starts with...'], ['mountain', 'm', 'Mountain starts with...'], ['drum', 'd', 'Drum starts with...']];
    const at = i => () => n() ? V(-1.8 + i * 1.2, 1.85, -0.6) : V(-2.7 + i * 1.8, 1.85, -0.6);
    const its = F.map(([w], i) => G.item(w, at(i), { size: n() ? 0.9 : 1.15 }));
    const lets = F.map(([, c], i) => { const t = letterTile(c); t.scale.setScalar(0.0001); S.scene.add(t); t.userData.p = () => at(i)().add(V(0, 1.3, 0)); t.position.copy(t.userData.p()); return t; });
    G.W.layout = () => lets.forEach(t => t.position.copy(t.userData.p()));
    for (let i = 0; i < 4; i++) { const [w, c, line] = F[i]; G.newRound();
      await G.say(line, snd(c)); await S.tween(400, e => lets[i].scale.setScalar(Math.max(0.0001, e * (n() ? 0.58 : 0.9))), ease.back);
      await G.say('Tap the letter for that sound.');
      await new Promise(res => { G.expect({ kind: 'tap', at: lets[i] }); G.A.wrongMove = i > 0 ? { kind: 'tap', at: lets[0] } : null; G.taps = [];
        lets.slice(0, i + 1).forEach((t, k) => G.tap(tapHit(t, 0.8), async () => { audio.letter(F[k][1]); if (k === i) { G.taps = []; res(); } else await G.wrong(['That one says a different sound.', 'Listen again.', snd(c)]); })); });   /* a real choice: every letter so far */
      await G.right(lets[i].position, say(w) + '!'); }
    /* the chant (MAP.md): "Mmm, the Shabbos soup is yum." */
    G.A.name = 'song'; await clearItems(G); lets.forEach(t => S.scene.remove(t)); const soup = G.item('soup', () => V(0.3, 2.0, -0.6), { size: 1.5 });
    await G.say('Our chant! Rub your tummy with me.');
    for (const l of ['Mmm, the Shabbos soup is yum!', 'Mmm, mmm, a yummy one!']) { G.mendy.wiggle(); soup.poke(); await G.say(l); await audio.letter('m'); }
    G.A.name = 'play'; await G.done('Let\'s meet each sound!');
  }
};

export const GAMES = { opener, 'i-meet': meet('i'), 'i-trace': trace('i'), 'i-hunt': hunt.i, 'n-meet': meet('n'), 'n-trace': trace('n'), 'n-hunt': hunt.n,
  slide: slide(['it', 'in', 'sit', 'tin', 'pin'], 'Back to the word slide!', { pin: 'tin', tin: 'pin' }), boxes, 'm-meet': meet('m'), 'm-trace': trace('m'), 'm-hunt': hunt.m,
  'd-meet': meet('d'), 'd-trace': trace('d'), 'd-hunt': hunt.d, slide2: slide(['nap', 'man', 'mat', 'map', 'dip', 'dad', 'did', 'mad'], 'New sounds on the word slide!', { mat: 'map', map: 'mat' }, true), fixit, review, check };
