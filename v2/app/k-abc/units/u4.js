/* Kindergarten ABC 2.0 — Unit 4: g o c k ck e (weeks 9–11). v2/curriculum/k-abc/MAP.md
   Skill: five sounds, including that c, k and ck all say the same sound, and ck goes at the end.
   The letter kit again (meet, trace), each letter in its own world: g the grapes, o the octopus, c the curled-up cat, k the kite pole, e the egg.
   Every hunt is a NEW kind of play (none repeats Units 1–3 or Review A):
     g-hunt  dig and decide: he taps a mound to dig up a picture, then keeps it (basket) or puts it back in its hole
     o-hunt  the octopus arm: he draws a line from the octopus to a picture; its arm reaches out and hugs the o ones
     c-hunt  peek-a-boo bushes: pictures peek up from three bushes and duck down again; he taps the c ones while they peek
     k-hunt  swipe up the kites: kites with pictures lie in the grass; he swipes the k ones up into the sky
     e-hunt  mystery eggs: closed eggs say their word when tapped (no picture); he puts the e ones in the nest and they hatch
   ksort   the k-sound houses: c house, k house, ck house (the end); he looks at the word and takes it to its house
   slide / slide2  word slide with the new sounds (on, got, dog, pot, top / cap, kid, pen, net, peg, sock, neck)
   fixit   Eli builds words with blocks: a high five if he is right, else he taps the wrong block and drags in the right one
   review (Units 1–4 mixed) before check (tap kinds: sound → letter, read 5 words, one k-sound sort) */
import { THREE, V, shuffle, rnd, audio, echo, WORDS, FAST, ease, clamp } from '../game.js';
import { base, tree, rock, pond, stump, basket, shelf } from '../scenes.js';
import { prop } from '../props.js';
import { glow, C, toon } from '../kit3d.js';
import { letterTile } from '../letters.js';
import { meet, trace, slide, START, others, huntSet, PIC, toks } from './u2.js';

export const ORDER = ['opener', 'g-meet', 'g-trace', 'g-hunt', 'o-meet', 'o-trace', 'o-hunt', 'slide',
  'c-meet', 'c-trace', 'c-hunt', 'k-meet', 'k-trace', 'k-hunt', 'ksort', 'e-meet', 'e-trace', 'e-hunt', 'slide2', 'fixit', 'review', 'check'];
Object.assign(PIC, { dog: 'dog', pot: 'pot', top: 'top', cap: 'cap', net: 'net', sock: 'sock' });
const say = w => (WORDS[w] ? WORDS[w].say : w);
const snd = ch => echo(() => audio.letter(ch));
const sounds = w => echo(async () => { for (const c of toks(w)) await audio.letter(c); });
function clearItems(G) { return Promise.all(G.items.slice().map(i => i.remove())); }
const tapHit = (obj, r = 0.9) => { const h = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); obj.add(h); return h; };
const wordTiles = (w, k = 0.62) => { const g = new THREE.Group(), T = toks(w); let x = 0; const ws = T.map(c => (c.length > 1 ? 1.58 : 1.0) * k * 1.3), tot = ws.reduce((a, b) => a + b, 0);
  T.forEach((c, i) => { const t = letterTile(c); t.scale.setScalar(k); t.position.set(x + ws[i] / 2 - tot / 2, 0, 0); x += ws[i]; t.userData.c = c; g.add(t); }); return g; };
const addTiles = (S, w, k) => { const g = wordTiles(w, k); S.scene.add(g); return g; };

/* =========================================================== hunts =========================================================== */
const hunt = {
  /* g: dig and decide. Mounds of soft earth; tap one to dig up a picture; keep it in the basket if it starts with g, else put it back in its hole */
  g: {
    world(G) { const W = base(G.S, 'garden', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5, c1: 0x5A9E2A, c2: 0xB8E06A }); tree(G.S, 9, -6.5, { s: 1.6 });
      G.view({ wide: [0, 1.9, 11.4, 5.8, 0.24], narrow: [0, 2.0, 5.2, 8.0, 0.28] }); G.mendyAt = { wide: [-4.9, 0.4, 0.85], narrow: [-1.55, 4.1, 0.45] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), set = huntSet('g', 6);
      const bk = basket(S, 0xD8A060, 0.85), bAt = () => n() ? V(1.4, 0, 2.6) : V(4.0, 0, 1.3); bk.position.copy(bAt());
      const grape = prop('grapes'); grape.scale.setScalar(0.55); bk.add(grape); grape.position.set(0, 1.25, 0.6);   /* the basket shows grapes: g things go here */
      const holeAt = i => n() ? V(-1.2 + (i % 3) * 1.2, 0, 0.4 + Math.floor(i / 3) * 1.4) : V(-2.9 + i * 1.15, 0, 0.6);
      const earth = toon(0x8A5A34, { rough: .95 }), dark = toon(0x4A2E1A, { rough: 1 });
      const mounds = set.map((s2, i) => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), earth); m.scale.set(1, 0.55, 0.8); m.castShadow = m.receiveShadow = true; g.add(m);
        const hole = new THREE.Mesh(new THREE.CircleGeometry(0.34, 24), dark); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.02; hole.visible = false; g.add(hole); g.userData = { m, hole, i }; g.position.copy(holeAt(i)); S.scene.add(g); return g; });
      G.W.layout = () => { bk.position.copy(bAt()); mounds.forEach(g => g.position.copy(holeAt(g.userData.i))); };
      const shovel = new THREE.Group(); { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 10), toon(0xC98A4B)); st.position.y = 0.45; shovel.add(st); const bl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon(0x9FB0C8, { metal: .5, rough: .3 })); bl.rotation.x = Math.PI; bl.scale.set(1, 1.4, 0.4); shovel.add(bl); }
      shovel.visible = false; S.scene.add(shovel);
      G.rounds(set.length); await G.say('Let\'s dig in the garden!', 'Keep the ones that start with this sound.', snd('g'));
      await G.say('Put the others back in their hole.');
      for (let r = 0; r < set.length; r++) {
        G.newRound(); const [w, yes] = set[r], md = mounds[r];
        /* 1. dig: tap the glowing mound */
        md.userData.m.material = toon(0xB07A44, { rough: .9, emissive: 0x553300, ei: .4 });
        await new Promise(res => { G.expect({ kind: 'tap', at: () => md.position.clone().add(V(0, 0.2, 0)) }); G.A.wrongMove = null; G.taps = []; G.tap(tapHit(md, 0.7), () => { G.taps = []; res(); }); });
        shovel.visible = true; for (let k = 0; k < 3; k++) { shovel.position.copy(md.position).add(V(0.3, 0.5, 0.2)); await S.tween(FAST ? 0 : 160, e => { shovel.rotation.z = -0.6 + e * 0.9; }); audio.burst(500, 0.8, 90, 0.35, 'lowpass'); G.P.twinkle(md.position.clone().add(V(0, 0.3, 0)), 2); }
        shovel.visible = false; md.userData.m.visible = false; md.userData.hole.visible = true;
        const it = G.item(w, () => md.position.clone().add(V(0, 1.0, 0)), { size: n() ? 0.9 : 1.0, drag: true }); await G.wait(300); await it.say();
        /* 2. decide: basket or back in the hole */
        const toB = () => bk.position.clone().add(V(0, 0.9, 0)), toH = () => md.position.clone().add(V(0, 0.15, 0));
        G.expect({ kind: 'drag', from: it, to: yes ? toB : toH }); G.A.wrongMove = { kind: 'drag', from: it, to: yes ? toH : toB };
        G.hint(async () => { it.glow(true); await G.say(say(w) + '.', snd('g')); await G.trail(it.obj.position, yes ? toB() : toH()); });
        await new Promise(res => { G.onDrop(async (it2, at) => { const tB = { screen: () => S.toScreen(toB()) }, tH = { screen: () => S.toScreen(toH()) }, hit = G.near(it2, [tB, tH], 140);
          if (!hit) return false; const isB = hit === tB;
          if (isB === yes) { it2.placed = true; await it2.moveTo(isB ? toB() : toH(), 300); res(); return true; }
          await G.wrong(isB ? [say(w) + '. Listen to the start.', snd('g'), 'Put it back in the hole.'] : [say(w) + ' starts with this sound!', snd('g'), 'Keep it in the basket.'], it2); return false; }); });
        G.onDrop(null); await G.right(it.obj.position, yes ? say(w) + '! Into the basket!' : 'Back in the hole. Bye, ' + say(w) + '!');
        if (yes) { it.size *= 0.55; await it.moveTo(bk.position.clone().add(V(rnd(-0.3, 0.3), 0.75, rnd(-0.1, 0.2))), 250); } else { await it.remove(); md.userData.m.visible = true; md.userData.m.material = earth; md.userData.hole.visible = false; }
      }
      await G.done('What a garden!');
    }
  },
  /* o: the octopus arm. He draws a line from the octopus to a picture; if it starts with o, the arm reaches out and hugs it in */
  o: {
    world(G) { const W = base(G.S, 'pond', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F }); pond(G.S, 0, -1.6, 2.4, 2.4);
      G.view({ wide: [0, 2.2, 11.4, 6.0, 0.2], narrow: [0, 2.4, 5.4, 8.4, 0.24] }); G.mendyAt = { wide: [-5.0, 0.5, 0.85], narrow: [-1.55, 4.6, 0.4] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), set = huntSet('o', 6);
      const oc = prop('octopus'); S.scene.add(oc); const ocAt = () => n() ? V(0, 0.9, 1.9) : V(0, 0.9, 0.6); oc.position.copy(ocAt()); oc.scale.setScalar(n() ? 1.2 : 1.5);
      S.tick(t => { oc.userData.inner.rotation.z = Math.sin(t * 1.4) * 0.06; oc.userData.inner.position.y = Math.sin(t * 2) * 0.06; });
      const ring = (i, m) => { const a = Math.PI * (0.12 + 0.76 * i / (m - 1)); return n() ? V(Math.cos(a) * -1.5, 2.6 + Math.sin(a) * 1.9, 0.2) : V(Math.cos(a) * -4.0, 1.1 + Math.sin(a) * 2.6, -0.4); };
      const its = set.map(([w, yes], i) => G.item(w, () => ring(i, set.length), { size: n() ? 0.78 : 1.0, data: { yes } }));
      G.W.layout = () => { oc.position.copy(ocAt()); oc.scale.setScalar(n() ? 1.2 : 1.5); };
      const ocItem = { obj: oc, screen: () => S.toScreen(oc.position.clone().add(V(0, 0.2, 0))) };
      /* the line he draws, and the arm that follows it */
      const lineM = new THREE.LineBasicMaterial({ color: 0xFF8A65 }), line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, 0, 0)]), lineM); line.visible = false; S.scene.add(line);
      const armM = toon(0xFF8A65, { clear: .7, rough: .35 });
      const reach = async (to, keep) => { const from = oc.position.clone().add(V(0, 0.1, 0.3)), arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1, 12), armM); S.scene.add(arm);
        const set2 = k => { const end = from.clone().lerp(to, k), mid = from.clone().add(end).multiplyScalar(0.5); arm.position.copy(mid); arm.scale.set(1, Math.max(0.01, from.distanceTo(end)), 1); arm.lookAt(end); arm.rotateX(Math.PI / 2); };
        await S.tween(350, e => set2(e)); if (!keep) await S.tween(300, e => set2(1 - e)); return { arm, set2 }; };
      G.rounds(3); await G.say('The octopus wants to hug some pictures.', 'Only the ones that start with this sound!', snd('o'));
      await G.say('Draw a line from the octopus to a picture.');
      const el = S.renderer.domElement; let dragging = false, roundDone = null;
      const down = e => { const p = ocItem.screen(); if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 90) { dragging = true; G.locked = true; line.visible = true; } };
      const move = e => { if (!dragging) return; const q = S.onPlane(e, 0.2); if (q) line.geometry.setFromPoints([oc.position.clone().add(V(0, 0.1, 0.3)), q]); };
      const up = async e => { if (!dragging) return; dragging = false; G.locked = false; line.visible = false; const live = its.filter(i => i.live && !i.placed);
        let best = null, bd = 1e9; live.forEach(it => { const p = it.screen(), d = Math.hypot(p.x - e.clientX, p.y - e.clientY); if (d < bd) { bd = d; best = it; } });
        if (best && bd < 110 * Math.max(0.6, Math.min(innerWidth, innerHeight) / 768) && roundDone) roundDone(best); };
      el.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up);
      for (let r = 0; r < 3; r++) {
        G.newRound(); const good = () => its.find(i => i.data.yes && !i.placed), bad = () => its.find(i => !i.data.yes && i.live);
        G.expect({ kind: 'drag', from: ocItem, to: () => good().obj.position }); G.A.wrongMove = { kind: 'drag', from: ocItem, to: () => bad().obj.position };
        G.hint(async () => { const g = good(); g.glow(true); await G.say(say(g.name) + '.', snd('o')); await G.trail(oc.position, g.obj.position); });
        await new Promise(res => { roundDone = async it => { await it.say(); if (it.data.yes) { roundDone = null; it.placed = true; it.glow(false);
            const { arm, set2 } = await reach(it.obj.position.clone(), true); const p0 = it.obj.position.clone(), tgt = oc.position.clone().add(V((r - 1) * 0.5, -0.3, 0.6));
            await S.tween(400, e => { it.obj.position.lerpVectors(p0, tgt, e); set2(1 - e * 0.85); }); S.scene.remove(arm); it.size *= 0.5; await G.right(it.obj.position, say(it.name) + '! A big hug!'); res(); }
          else { await reach(it.obj.position.clone(), false); await G.wrong([say(it.name) + '. Listen to the start.', snd('o')], it); } }; });
      }
      el.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up);
      await G.done('Octopus hugs for everyone!');
    }
  },
  /* c: peek-a-boo bushes. Pictures peek up from three bushes and duck down again; he taps the ones that start with c while they peek */
  c: {
    world(G) { const W = base(G.S, 'morning', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 8.5, -7, { s: 1.7, c1: 0xE85A9E, c2: 0xFFC2E2 });
      G.view({ wide: [0, 1.8, 11.0, 5.6, 0.2], narrow: [0, 2.0, 5.2, 8.0, 0.24] }); G.mendyAt = { wide: [-4.9, 0.4, 0.85], narrow: [-1.55, 4.1, 0.45] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), bAt = i => n() ? V(-1.3 + i * 1.3, 0, 0.9 + (i % 2) * 0.6) : V(-3.0 + i * 3.0, 0, 0.4);
      const bm = toon(0x3DAE4A, { rough: .6, sheen: .5 }), bushes = [0, 1, 2].map(i => { const g = new THREE.Group(); [[0, 0.5, 0, 0.62], [-0.5, 0.4, 0.1, 0.45], [0.5, 0.4, 0.1, 0.45], [0, 0.85, 0.05, 0.42]].forEach(([x, y, z, r]) => { const b = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), bm); b.position.set(x, y, z); b.castShadow = true; g.add(b); });
        [[-0.3, 0.7], [0.35, 0.55], [0.05, 1.05]].forEach(([x, y]) => { const f = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), toon(0xFFF0F6)); f.position.set(x, y, 0.5); g.add(f); }); g.position.copy(bAt(i)); g.scale.setScalar(n() ? 0.62 : 1); S.scene.add(g); return g; });
      const cat = prop('cat'); S.scene.add(cat); const cAt = () => n() ? V(1.45, 0.6, 2.6) : V(4.6, 0.6, 1.4); cat.position.copy(cAt()); cat.scale.setScalar(0.9);
      G.W.layout = () => { bushes.forEach((b, i) => { b.position.copy(bAt(i)); b.scale.setScalar(n() ? 0.62 : 1); }); cat.position.copy(cAt()); };
      const yes = shuffle(START.c.filter(w => w !== 'cat')), no = shuffle(others('c'));
      G.rounds(3); await G.say('Pictures are playing peek-a-boo!', 'Tap the ones that start with this sound.', snd('c'));
      await G.say('Be quick, before they hide!');
      let got = 0, k = 0, busy = false, cur = null;
      /* the peek loop: one picture at a time; every other one starts with c */
      const peek = async () => { const isYes = k % 2 === 1, w = isYes ? yes[(k >> 1) % yes.length] : no[(k >> 1) % no.length], bi = Math.floor(rnd(0, 3)) % 3, b = bushes[bi]; k++;
        const it = G.item(w, () => b.position.clone().add(V(0, n() ? 1.0 : 1.4, n() ? 0.1 : 0.2)), { size: n() ? 0.7 : 0.95, data: { yes: isYes } }); cur = it; it.say();
        const T0 = S.t, stay = FAST ? 3.0 : 3.2; it.data.until = T0 + stay; await new Promise(res => { const id = setInterval(() => { if (it.data.hit || S.t - T0 > stay || got >= 3) { clearInterval(id); res(); } }, 50); });
        if (!it.data.hit) { cur = null; await it.remove(200); } };
      const setExp = () => { const c2 = cur && cur.live && !cur.data.hit && (cur.data.until || 1e9) - S.t > 1.2 ? cur : null;   /* not while it is about to hide */ G.expect(c2 && c2.data.yes ? { kind: 'tap', at: c2 } : { kind: 'wait' }); G.A.wrongMove = c2 && !c2.data.yes ? { kind: 'tap', at: c2 } : null; };
      const timer = setInterval(setExp, 120);
      G.onItemTap = async it => { if (busy || it.data.hit || !it.live) return; busy = true;
        if (it.data.yes) { it.data.hit = true; got++; const p0 = it.obj.position.clone(); await S.tween(350, e => it.obj.position.lerpVectors(p0, cat.position.clone().add(V(0, 1.2, 0)), e)); await G.right(cat.position.clone().add(V(0, 1, 0)), say(it.name) + '! Got it!'); await it.remove(200); if (got < 3) G.newRound(); }
        else { await G.wrong([say(it.name) + '. Listen to the start.', snd('c')], it); }
        busy = false; };
      G.newRound(); G.hint(async () => { await G.say('Listen for this sound.', snd('c')); });
      while (got < 3) { await peek(); await G.wait(FAST ? 100 : 350); }
      clearInterval(timer); G.onItemTap = null; G.expect(null);
      await G.done('You found them all!');
    }
  },
  /* k: swipe up the kites. Kites with pictures lie in the grass; he swipes the k ones up into the sky; the others stay down */
  k: {
    world(G) { const W = base(G.S, 'meadow', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.6 }); tree(G.S, 9.5, -6, { s: 1.4 });
      G.view({ wide: [0, 2.6, 11.4, 6.6, 0.18], narrow: [0, 2.8, 5.2, 8.6, 0.22] }); G.mendyAt = { wide: [-5.0, 0.4, 0.85], narrow: [-1.55, 5.0, 0.4] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), set = huntSet('k', 6), cols = [0xFF5A6E, 0xFFB020, 0x4DDB6A, 0x4DB2FF, 0xB46BFF, 0xFF7AC8];
      const at = i => () => n() ? V(-1.2 + (i % 3) * 1.2, 0.8 + Math.floor(i / 3) * 1.3, 1.2 - Math.floor(i / 3) * 0.8) : V(-3.4 + i * 1.36, 0.85, 0.6);
      const its = set.map(([w, yes], i) => { const it = G.item(w, at(i), { size: n() ? 0.62 : 0.8, drag: true, data: { yes } }), sh = new THREE.Shape(); sh.moveTo(0, 0.95); sh.lineTo(0.75, 0.1); sh.lineTo(0, -0.85); sh.lineTo(-0.75, 0.1); sh.closePath();
        const kt = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false }), toon(cols[i], { clear: 1, rough: .3 })); kt.position.z = -0.35; it.obj.add(kt);
        const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0, -0.85, -0.3), V(0.2, -1.1, -0.3), V(-0.1, -1.35, -0.3)]), 12, 0.025, 6), toon(0xFFFFFF)); it.obj.add(tail); return it; });
      G.rounds(3); await G.say('Windy day! These kites want to fly.', 'Swipe up the kites that start with this sound.', snd('k'));
      { /* watch me: Mendy shows a swipe on the first k kite */
        const g = its.find(i => i.data.yes); await G.say('Watch me.'); await G.trail(g.obj.position, g.obj.position.clone().add(V(0, 2.4, 0))); await G.say('Swish! Up it goes. Now you!'); }
      let got = 0;
      while (got < 3) {
        G.newRound(); const good = its.find(i => i.data.yes && !i.placed), bad = its.find(i => !i.data.yes && i.live);
        G.expect({ kind: 'drag', from: good, to: () => good.obj.position.clone().add(V(0, 2.6, 0)) }); G.A.wrongMove = bad ? { kind: 'drag', from: bad, to: () => bad.obj.position.clone().add(V(0, 2.6, 0)) } : null;
        G.hint(async () => { good.glow(true); await G.say(say(good.name) + '.', snd('k')); await G.trail(good.obj.position, good.obj.position.clone().add(V(0, 2.4, 0))); });
        await new Promise(res => { G.onDrop(async (it, p) => { if (p.y - it.home.y < 0.9) return false;   /* not a swipe up: it just settles back */
          await it.say(); if (it.data.yes) { it.placed = true; audio.whoosh(); const p0 = it.obj.position.clone(), to = V(p0.x * 0.6 + rnd(-1, 1), n() ? 6.6 : 5.0, -1.5 - got);
            S.tween(1200, e => it.obj.position.lerpVectors(p0, to, e)); got++; await G.right(to, say(it.name) + '! Up, up!'); res(); return true; }
          await G.wrong([say(it.name) + '. Listen to the start.', snd('k'), 'That kite stays down.'], it); return false; }); });
        G.onDrop(null);
      }
      await G.done('Look at them fly!');
    }
  },
  /* e: mystery eggs. Closed eggs say their word when tapped (no picture: ears only). He puts the e ones in the nest, and they hatch to show the picture */
  e: {
    world(G) { const W = base(G.S, 'golden', { clearW: 7 }); tree(G.S, -9, -5, { s: 1.6, c1: 0x5A9E2A, c2: 0xD8E04A }); tree(G.S, 9.5, -6, { s: 1.4, c1: 0x6AAE2A, c2: 0xF2C84A });
      G.view({ wide: [0, 1.9, 11.0, 5.6, 0.22], narrow: [0, 2.0, 5.2, 8.0, 0.26] }); G.mendyAt = { wide: [-4.9, 0.4, 0.85], narrow: [-1.55, 4.1, 0.45] }; return W; },
    async play(G) {
      const S = G.S, n = () => G.narrow(), set = huntSet('e', 6);
      const nest = new THREE.Group(), straw = toon(0xC8924A, { rough: .9 }); const t1 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.3, 12, 36), straw); t1.rotation.x = Math.PI / 2; nest.add(t1); const bot = new THREE.Mesh(new THREE.CircleGeometry(0.85, 30), toon(0x9C6A3E, { rough: 1 })); bot.rotation.x = -Math.PI / 2; bot.position.y = -0.1; nest.add(bot);
      const glowR = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.05, 8, 48), glow(0xFFE14D, 1.4)); glowR.rotation.x = Math.PI / 2; nest.add(glowR); S.scene.add(nest);
      const nAt = () => n() ? V(0, 0.35, 2.4) : V(3.6, 0.35, 1.0); nest.position.copy(nAt()); S.tick(t => glowR.scale.setScalar(1 + Math.sin(t * 3) * 0.04));
      const at = i => () => n() ? V(-1.2 + (i % 3) * 1.2, 2.6 + Math.floor(i / 3) * 1.25, 0) : V(-3.6 + (i % 3) * 1.5, 0.75 + Math.floor(i / 3) * 1.4, 0.2 - Math.floor(i / 3) * 0.9);
      const its = set.map(([w, yes], i) => { const it = G.item('egg', at(i), { size: n() ? 0.72 : 0.85, drag: true, data: { yes, w } }); it.say = () => audio.say(say(w)); it.onTap = () => { it.say(); it.poke(); }; return it; });
      G.W.layout = () => nest.position.copy(nAt());
      G.rounds(3); await G.say('Mystery eggs! Tap an egg to hear its word.', 'Is it this sound?', snd('e'));
      await G.say('Put those eggs in the nest. Listen first!');
      let got = 0;
      while (got < 3) {
        G.newRound(); const good = its.find(i => i.data.yes && !i.placed), bad = its.find(i => !i.data.yes && i.live);
        const nTo = () => nest.position.clone().add(V(0, 0.4, 0));
        G.expect({ kind: 'drag', from: good, to: nTo }); G.A.wrongMove = bad ? { kind: 'drag', from: bad, to: nTo } : null;
        G.hint(async () => { good.glow(true); good.poke(); await good.say(); await G.say('Listen to the start.', snd('e')); });
        await new Promise(res => { G.onDrop(async (it, p) => { if (!G.near(it, [{ screen: () => S.toScreen(nTo()) }], 150)) return false;
          const w = it.data.w; it.placed = true; await it.moveTo(nTo(), 250);
          /* it hatches: the shell pops and the picture comes out */
          audio.pop(); G.P.burst(it.obj.position, 0.4); it.obj.visible = false; const pic = G.item(w, () => nTo().add(V(0, 0.7, 0)), { size: n() ? 0.8 : 1.0 }); await pic.say();
          if (it.data.yes) { got++; it.live = false; S.scene.remove(it.obj); G.items = G.items.filter(x => x !== it); await G.right(pic.obj.position, say(w) + '! It hatched!'); pic.placed = true; await pic.moveTo(nest.position.clone().add(V(-0.9 + got * 0.45, 1.2, -0.6)), 300); pic.size *= 0.5; res(); return true; }
          await G.wrong([say(w) + '. Listen to the start.', snd('e')]); await pic.remove(); it.obj.visible = true; it.placed = false; return false; }); });
        G.onDrop(null);
      }
      await G.done('Three new friends hatched!');
    }
  }
};

/* =========================================================== the k-sound houses: c, k, ck =========================================================== */
function house(S, col, label) {
  const G = new THREE.Group(), wall = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.4, 1.2), toon(col, { clear: .4, rough: .45 })); wall.position.y = 0.7; wall.castShadow = wall.receiveShadow = true; G.add(wall);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.9, 4), toon(0xE8434F, { clear: .6, rough: .35 })); roof.rotation.y = Math.PI / 4; roof.position.y = 1.85; roof.castShadow = true; G.add(roof);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.05), toon(0x9C6A3E)); door.position.set(0, 0.4, 0.61); G.add(door);
  const t = letterTile(label); t.scale.setScalar(0.62); t.position.set(0, 1.08, 0.66); G.add(t); G.userData.tile = t; S.scene.add(G); return G;
}
const SORT = [['cat', 'c', 'cat'], ['kid', 'k'], ['sock', 'ck', 'sock'], ['cup', 'c', 'cup'], ['kit', 'k'], ['duck', 'ck', 'duck'], ['cap', 'c', 'cap'], ['rock', 'ck', 'rock']];
function wordCard(G, w, pic, at, size) { const it = G.item('card', at, { size, drag: true, hover: 0.04, data: { w } }), t = wordTiles(w, 0.44); t.position.set(0, 0, 0.12); it.obj.add(t);
  if (pic) { const p = prop(pic); p.scale.setScalar(0.5); p.position.set(0, 0.85, 0); it.obj.add(p); } it.say = () => audio.say(w); it.onTap = () => { it.say(); it.poke(); }; return it; }
const ksort = {
  world(G) { const W = base(G.S, 'hills', { clearW: 8 }); tree(G.S, -9.5, -6, { s: 1.5 }); tree(G.S, 9.5, -6.5, { s: 1.6, c1: 0xE85A9E, c2: 0xFFC2E2 });
    G.view({ wide: [0, 2.0, 11.4, 6.0, 0.2], narrow: [0, 2.3, 5.4, 8.6, 0.24] }); G.mendyAt = { wide: [-5.1, 0.4, 0.8], narrow: [-1.6, 4.9, 0.4] }; return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(), L = ['c', 'k', 'ck'], hAt = i => n() ? V(-1.45 + i * 1.45, 0, -0.6) : V(-3.0 + i * 3.0, 0, -1.2);
    const H = L.map((l, i) => { const h = house(S, [0xFFE3A0, 0xBFE6FF, 0xD8F5C0][i], l); h.position.copy(hAt(i)); h.scale.setScalar(n() ? 0.62 : 1); return h; });
    G.W.layout = () => H.forEach((h, i) => { h.position.copy(hAt(i)); h.scale.setScalar(n() ? 0.62 : 1); });
    const door = i => H[i].position.clone().add(V(0, n() ? 0.5 : 0.8, 0.8));
    G.rounds(SORT.length - 1);
    await G.say('Three houses. They all say the same sound!', snd('k'));
    await G.say('The cat letter. The kite letter.', 'And two letters together, for the end.');
    G.mendy.wiggle(); await G.say('Kick, kick, ck at the end!');
    const cAt = () => n() ? V(0, 2.9, 1.6) : V(0, 3.3, 0.8);
    for (let r = 0; r < SORT.length; r++) {
      const [w, l, pic] = SORT[r], gi = L.indexOf(l), card = wordCard(G, w, pic, cAt, n() ? 0.8 : 1.0); await G.wait(300); await card.say();
      if (r === 0) { /* watch me */ await G.say('Watch me. Cat. I look at the word.', 'The sound is at the start, with this letter.');
        H[0].userData.tile.scale.setScalar(0.75); await G.trail(card.obj.position, door(0)); H[0].userData.tile.scale.setScalar(0.62); card.placed = true; await card.moveTo(door(0), 400); await card.remove(); await G.say('Into the cat letter house!'); continue; }
      G.newRound(); await G.say(r < 3 ? 'Your turn! Look at the word. Which house?' : 'Which house?');
      G.expect({ kind: 'drag', from: card, to: () => door(gi) }); G.A.wrongMove = { kind: 'drag', from: card, to: () => door((gi + 1) % 3) };
      G.hint(async () => { const t = H[gi].userData.tile; t.scale.setScalar(0.8); await G.say(l === 'ck' ? 'The sound is at the end.' : 'Look at the first letter.'); await G.trail(card.obj.position, door(gi)); t.scale.setScalar(0.62); });
      await new Promise(res => { G.onDrop(async (it, p) => { const hit = G.near(it, [0, 1, 2].map(i => ({ i, screen: () => S.toScreen(door(i)) })), 150); if (!hit) return false;
        if (hit.i === gi) { it.placed = true; await it.moveTo(door(gi), 250); res(); return true; }
        await G.wrong(l === 'ck' ? ['Listen. ' + w + '. The sound is at the end.', 'Two letters at the end!'] : hit.i === 2 ? ['The sound is at the start.', 'Look at the first letter.'] : ['Look at the first letter of ' + w + '.'], it); return false; }); });
      G.onDrop(null); H[gi].userData.tile.scale.setScalar(0.75); await G.right(door(gi), w + '! ' + ['The cat letter house!', 'The kite letter house!', 'At the end! Kick, kick!'][gi]); H[gi].userData.tile.scale.setScalar(0.62); await card.remove();
    }
    await G.done('Every word found its house!');
  }
};

/* =========================================================== fix it: Eli builds words =========================================================== */
const BUILDS = [{ w: 'sock', b: ['s', 'o', 'k'], bad: 2, fix: 'ck', alt: 'c', pic: 'sock' }, { w: 'pen', b: ['p', 'e', 'n'] }, { w: 'top', b: ['t', 'o', 't'], bad: 2, fix: 'p', alt: 'd', pic: 'top' },
  { w: 'neck', b: ['n', 'e', 'k'], bad: 2, fix: 'ck', alt: 'g' }, { w: 'dog', b: ['d', 'o', 'g'], pic: 'dog' }, { w: 'peg', b: ['p', 'i', 'g'], bad: 1, fix: 'e', alt: 'a' }];
const fixit = {
  world(G) { const W = base(G.S, 'meadow', { clearW: 7 }); tree(G.S, -9, -7, { s: 1.6 }); tree(G.S, 8.5, -7.5, { s: 1.4 }); G.board = shelf(G.S, -2.8, 2.8, -1.2, 1.4, 0xC98A4B, 1.2);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.1, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(BUILDS.length);
    const eli = await G.friend('eli'); await G.say('Eli is building words with blocks.', 'Is he right? Check each sound.');
    await G.say('Right? Tap Eli for a high five.', 'Not right? Tap the wrong block.');
    for (const [ri, B] of BUILDS.entries()) {
      G.newRound(); const blocks = B.b.map((c, i) => { const t = letterTile(c); t.scale.setScalar(n() ? 0.62 : 0.8); t.userData.c = c; S.scene.add(t); return t; });
      const lay = () => { const sp = n() ? 0.9 : 1.2; blocks.forEach((t, i) => t.position.set((i - (blocks.length - 1) / 2) * sp, 2.15, -1.2)); }; lay(); G.W.layout = lay;
      const pic = B.pic ? G.item(B.pic, () => n() ? V(0, 3.6, -1.2) : V(0, 3.7, -1.2), { size: 0.8 }) : null;
      eli.set('think', 30); await G.say('Eli wants to make ' + B.w + '.', ri === 0 ? 'Say it slowly with me.' : 'Check each sound.', sounds(B.w));
      const ok = B.bad === undefined, eliAt = () => eli.top().add(V(0, -1.0, 0));
      await new Promise(res => { G.taps = [];
        G.expect(ok ? { kind: 'tap', at: eliAt } : { kind: 'tap', at: blocks[B.bad] });
        G.A.wrongMove = ok ? { kind: 'tap', at: blocks[0] } : { kind: 'tap', at: eliAt };
        G.hint(async () => { await G.say('Listen to each sound.', sounds(B.w)); if (!ok) blocks[B.bad].scale.multiplyScalar(1.15); });
        const onEli = async () => { if (ok) { G.taps = []; eli.set('happy', 1.5); eli.hopNow(); audio.clap(); res(); } else await G.wrong(['Check again. Listen.', sounds(B.w), 'One block is wrong.']); };
        G.tap(eli.hit, onEli);
        blocks.forEach((t, i) => G.tap(tapHit(t, 0.7), async () => { audio.letter(t.userData.c); if (!ok && i === B.bad) { G.taps = []; res(); } else await G.wrong(ok ? ['That block is right.', 'Is the whole word right?'] : ['That sound is right.', 'Find the wrong one.']); })); });
      if (ok) { await G.right(blocks[1].position, 'High five! ' + B.w + '!'); }
      else { /* the wrong block pops out; he drags the right one in from two choices */
        const gap = blocks[B.bad].position.clone(); await S.tween(250, e => blocks[B.bad].scale.setScalar(Math.max(0.0001, (1 - e) * 0.8))); S.scene.remove(blocks[B.bad]);
        await G.say(B.fix === 'ck' ? 'At the end, this sound uses two letters!' : 'Which block makes ' + B.w + '?');
        const opts = shuffle([B.fix, B.alt]), chAt = i => n() ? V(-0.9 + i * 1.8, 0.9, 1.4) : V(-1.4 + i * 2.8, 0.9, 1.0);
        const ch = opts.map((c, i) => { const t = letterTile(c); t.scale.setScalar(n() ? 0.62 : 0.8); t.position.copy(chAt(i)); t.userData.c = c; S.scene.add(t); return t; });
        const good = ch[opts.indexOf(B.fix)], badT = ch.find(t => t !== good);
        G.expect({ kind: 'drag', from: { screen: () => S.toScreen(good.position) }, to: () => gap }); G.A.wrongMove = G.missed() ? null : { kind: 'drag', from: { screen: () => S.toScreen(badT.position) }, to: () => gap };
        await new Promise(res => { const el = S.renderer.domElement; let d = null, st = null;
          const pick = e => ch.find(t => { const p = S.toScreen(t.position); return Math.hypot(p.x - e.clientX, p.y - e.clientY) < 70; });
          const down = e => { d = pick(e); if (d) { st = d.position.clone(); G.locked = true; audio.letter(d.userData.c); } };
          const mv = e => { if (!d) return; const q = S.onPlane(e, 0.6); if (q) d.position.copy(q); };
          const upF = async e => { if (!d) return; const t = d; d = null; G.locked = false; const a = S.toScreen(gap), dd = Math.hypot(a.x - e.clientX, a.y - e.clientY);
            if (dd > 120 * Math.max(0.6, Math.min(innerWidth, innerHeight) / 768)) { t.position.copy(st); return; }
            if (t === good) { t.position.copy(gap); el.removeEventListener('pointerdown', down); removeEventListener('pointermove', mv); removeEventListener('pointerup', upF); res(); }
            else { t.position.copy(st); await G.wrong(['Say it slowly.', sounds(B.w), 'Which sound is missing?']); G.A.wrongMove = null; } };
          el.addEventListener('pointerdown', down); addEventListener('pointermove', mv); addEventListener('pointerup', upF); });
        S.scene.remove(badT); eli.set('happy', 1.5); eli.hopNow(); await G.right(gap, 'Now it says ' + B.w + '! Thank you!'); blocks[B.bad] = good; }
      blocks.forEach(t => S.scene.remove(t)); if (pic) await pic.remove(); G.taps = [];
    }
    eli.set('happy', 3); await G.done('Eli says thank you!');
  }
};

/* =========================================================== review (Units 1–4) and check =========================================================== */
function dotStone(S, k) { const G = new THREE.Group(), st = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.2, 40), toon(0xF4EEFF, { rough: .4, clear: .6 })); st.rotation.x = Math.PI / 2; G.add(st);
  for (let i = 0; i < k; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), glow(0x4DDB6A, 1.6)); d.position.set((i - (k - 1) / 2) * 0.36, 0, 0.14); G.add(d); } S.scene.add(G); return G; }
const review = {
  world(G) { const W = base(G.S, 'pond', { clearW: 7 }); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 9, -6, { s: 1.6, c1: 0x13924A, c2: 0x9BE94F }); pond(G.S, 7.5, -6, 2.2, 1.6);
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(5); await G.say('Review time! Old and new sounds.');
    const row = (ws, z = 1.0) => ws.map((w, i) => G.item(w, () => n() ? V(-1.6 + i * 1.6, 0.85, z + 0.4) : V(-2.9 + i * 2.9, 0.85, z), { size: 1.05 }));
    const tapOne = (its, good, fix) => new Promise(res => { G.expect({ kind: 'tap', at: good }); G.A.wrongMove = { kind: 'tap', at: its.find(i => i !== good) };
      its.forEach(it => it.onTap = async () => { it.poke(); await it.say(); if (it === good) { its.forEach(x => x.onTap = () => x.say()); await G.right(it.obj.position); res(); } else await G.wrong(fix, it); }); });
    /* 1. rhyme (Unit 1) */
    G.newRound(); { const its = row(shuffle(['boat', 'kite', 'egg'])); await G.say('Tap the picture that rhymes with goat.'); await tapOne(its, its.find(i => i.name === 'boat'), ['Goat... listen to the end.']); await clearItems(G); }
    /* 2. first sound g (Unit 4) */
    G.newRound(); { const its = row(shuffle(['gift', 'duck', 'pear'])); await G.say('Tap the one that starts with this sound.', snd('g')); await tapOne(its, its.find(i => i.name === 'gift'), ['Listen for this sound.', snd('g')]); await clearItems(G); }
    /* 3. read the word (Units 2–4): tap its picture */
    G.newRound(); { const g = addTiles(S, 'pot', n() ? 0.6 : 0.75); g.position.set(0, 2.6, -1.2); const its = row(shuffle(['pot', 'top', 'pan'])); await G.say('Read the word. Tap its picture.'); await tapOne(its, its.find(i => i.name === 'pot'), ['Read it slowly.', sounds('pot')]); S.scene.remove(g); await clearItems(G); }
    /* 4–5. how many sounds (Unit 3), now with ck: sock has three sounds */
    for (const [w, k] of [['egg', 2], ['sock', 3]]) {
      G.newRound(); const pads = [2, 3].map((c, i) => { const p = dotStone(S, c); p.position.copy(n() ? V(-1.0 + i * 2.0, 0.85, 1.4) : V(-1.5 + i * 3.0, 0.85, 1.0)); return p; }); const pic = G.item(w, () => V(0, 2.3, -1.2), { size: 1.0 });
      await G.say(say(w) + '. How many sounds?', 'Tap the stone with that many dots.');
      await new Promise(res => { G.expect({ kind: 'tap', at: pads[k - 2] }); G.A.wrongMove = { kind: 'tap', at: pads[3 - k] };
        pads.forEach((p, i) => G.tap(tapHit(p, 0.7), async () => { if (i === k - 2) { G.taps = []; await G.right(p.position, say(w) + '. ' + (k === 2 ? 'Two' : 'Three') + ' sounds!'); res(); } else await G.wrong(['Say it slowly.', sounds(w), w === 'sock' ? 'The last two letters say one sound.' : 'One dot for each sound.']); })); });
      pads.forEach(p => S.scene.remove(p)); await clearItems(G); }
    await G.done('Great review!');
  }
};

const check = {
  world(G) { const W = base(G.S, 'sunset'); tree(G.S, -9, -6, { s: 1.5, c1: 0x3A9E5A, c2: 0xB8E06A }); tree(G.S, 9.5, -7, { s: 1.6, c1: 0xC85AA8, c2: 0xFFC2E2 });
    G.view({ wide: [-0.3, 2.0, 11.2, 5.6, 0.17], narrow: [0, 2.0, 5.2, 7.8, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow();
    const Q = [{ k: 'sound', ch: 'g' }, { k: 'sound', ch: 'o' }, { k: 'sound', ch: 'e' }, { k: 'sound', ch: 'k' }, { k: 'word', w: 'got' }, { k: 'word', w: 'peg' }, { k: 'word', w: 'kid' }, { k: 'word', w: 'net' }, { k: 'word', w: 'sock' }, { k: 'sort', w: 'duck' }];
    G.rounds(Q.length); await G.say('Show me what you know!', 'Tap the right one each time.');
    const pos = (i, m, col) => n() ? (m > 3 ? V(-0.75 + (i % 2) * 1.5, 2.3 - Math.floor(i / 2) * 1.5, 1.0) : col ? V(0, 3.2 - i * 1.25, 0.8) : V((i - (m - 1) / 2) * 1.6, 0.85, 1.4)) : V((i - (m - 1) / 2) * (m > 3 ? 2.2 : 2.9), 0.85, 1.0);
    for (const q of Q) {
      G.newRound(); let objs = [], goal, ask;
      if (q.k === 'sound') { const pool = ['g', 'o', 'e', 'd', 'a', 'i', 't', 'p', 'n', 'm'].filter(c => c !== q.ch && !(q.ch === 'e' && c === 'i') && !(q.ch === 'o' && c === 'a')); const L = shuffle([q.ch, ...shuffle(pool).slice(0, 3)]);   /* close vowels never side by side; c and k never together (they say the same sound) */
        objs = L.map((c, i) => { const t = letterTile(c); t.position.copy(pos(i, 4)); t.scale.setScalar(n() ? 0.85 : 0.82); S.scene.add(t); t.userData.c = c; return t; });
        goal = objs[L.indexOf(q.ch)]; ask = ['Which letter says this sound?', snd(q.ch)]; }
      if (q.k === 'word') { const near = { got: ['dot', 'gap'], peg: ['pig', 'pen'], kid: ['kit', 'did'], net: ['nut', 'ten'], sock: ['sack', 'dock'] }[q.w]; const ws = shuffle([q.w, ...near]);   /* look-alike words, so a first-letter guess does not work */
        objs = ws.map((w, i) => { const g = addTiles(S, w, 0.62); g.position.copy(pos(i, 3, true)); g.scale.setScalar(n() ? 0.75 : 1); return g; }); goal = objs[ws.indexOf(q.w)]; ask = ['Tap the word ' + q.w + '.']; }
      if (q.k === 'sort') { const g = addTiles(S, q.w, 0.6); g.position.copy(n() ? V(0, 3.6, 0.8) : V(0, 3.2, 0.4)); objs = ['c', 'k', 'ck'].map((l, i) => { const h = house(S, [0xFFE3A0, 0xBFE6FF, 0xD8F5C0][i], l); h.position.copy(n() ? V(-1.45 + i * 1.45, 0, 0.4) : V(-3 + i * 3, 0, 0)); h.scale.setScalar(n() ? 0.6 : 0.85); return h; });
        goal = objs[2]; ask = [q.w + '. Which house does it go to?']; objs.word = g; }
      await G.say(ask);
      const tgt = o => q.k === 'sort' ? o.position.clone().add(V(0, 0.6, 0.5)) : o;
      G.expect({ kind: 'tap', at: () => tgt(goal) }); G.A.wrongMove = { kind: 'tap', at: () => tgt(objs.find(o => o !== goal)) };
      await new Promise(res => { let tries = 0; objs.forEach(o => { const h = tapHit(o, q.k === 'sort' ? 1.0 : 0.8); if (q.k === 'word') h.scale.set(1.6, 0.8, 1); if (q.k === 'sort') h.position.y = 0.8;
        G.tap(h, async () => { if (q.k === 'sound') audio.letter(o.userData.c);
          if (o === goal) { G.taps = []; await G.right(q.k === 'sort' ? tgt(o) : o.position); res(); } else { tries++; if (q.ch) { try { const k = 'kabc-weak', w = JSON.parse(localStorage.getItem(k) || '[]'); if (!w.includes(q.ch)) w.push(q.ch); localStorage.setItem(k, JSON.stringify(w)); } catch (e) {} }   /* a missed sound comes back first in the next review */
            await G.wrong(tries < 2 ? ['Look again.', ...ask] : ['This one!']); if (tries >= 2) goal.scale.multiplyScalar(1.2); } }); }); });
      objs.forEach(o => S.scene.remove(o)); if (objs.word) S.scene.remove(objs.word); G.taps = [];
    }
    await G.done(G.A.firstTry >= Q.length - 1 ? 'You know your new sounds!' : 'Good work! Let\'s practice more.');
  }
};

/* =========================================================== opener: five gifts =========================================================== */
const opener = {
  world(G) { const W = base(G.S, 'morning'); tree(G.S, -9, -6, { s: 1.5 }); tree(G.S, 8.5, -7, { s: 1.7, c1: 0xE85A9E, c2: 0xFFC2E2 }); G.table = shelf(G.S, -3.8, 3.8, -0.6, 1.1, 0xC98A4B, 1.6);
    G.view({ wide: [-0.4, 2.0, 11.6, 5.8, 0.17], narrow: [0, 2.2, 5.0, 7.6, 0.2] }); return W; },
  async play(G) {
    const S = G.S, n = () => G.narrow(); G.rounds(5);
    await G.say('Five new sounds today!', 'Each one is hiding in a gift.');
    const F = [['grapes', 'g', 'Grapes start with...'], ['octopus', 'o', 'Octopus starts with...'], ['cat', 'c', 'Cat starts with...'], ['kite', 'k', 'Kite starts with...'], ['egg', 'e', 'Egg starts with...']];
    const at = i => () => n() ? V(-1.9 + i * 0.95, 1.85, -0.6) : V(-3.0 + i * 1.5, 1.85, -0.6);
    const gifts = F.map((f, i) => { const g = prop('gift'); g.scale.setScalar(n() ? 0.55 : 0.75); g.position.copy(at(i)()); S.scene.add(g); return g; });
    const lets = F.map(([, c], i) => { const t = letterTile(c); t.scale.setScalar(0.0001); S.scene.add(t); t.userData.p = () => at(i)().add(V(0, 1.3, 0)); t.position.copy(t.userData.p()); return t; });
    G.W.layout = () => { lets.forEach(t => t.position.copy(t.userData.p())); gifts.forEach((g, i) => { g.position.copy(at(i)()); g.scale.setScalar(n() ? 0.55 : 0.75); }); };
    for (let i = 0; i < 5; i++) { const [w, c, line] = F[i]; G.newRound();
      /* tap the gift: it opens and the picture comes out */
      await G.say(i === 0 ? 'Tap the first gift!' : 'Tap the next gift!');
      await new Promise(res => { G.expect({ kind: 'tap', at: gifts[i] }); G.A.wrongMove = null; G.taps = []; G.tap(tapHit(gifts[i], 0.6), () => { G.taps = []; res(); }); });
      audio.pop(); G.P.burst(gifts[i].position, 0.4); S.scene.remove(gifts[i]); G.item(w, at(i), { size: n() ? 0.8 : 1.05 });
      await G.say(line, snd(c)); await S.tween(400, e => lets[i].scale.setScalar(Math.max(0.0001, e * (n() ? 0.5 : 0.85))), ease.back);
      if (c === 'k') await G.say('The same sound as cat! A new letter for it.');
      await G.say('Tap the letter for that sound.');
      await new Promise(res => { G.expect({ kind: 'tap', at: lets[i] }); G.A.wrongMove = i > 0 && c !== 'k' ? { kind: 'tap', at: lets[0] } : null; G.taps = [];
        lets.slice(0, i + 1).forEach((t, k) => G.tap(tapHit(t, 0.8), async () => { audio.letter(F[k][1]); if (k === i) { G.taps = []; res(); }
          else if (c === 'k' && F[k][1] === 'c') await G.say('Yes, that one says it too!', 'Kite uses the new one.');   /* not a mistake: c says it too */
          else await G.wrong(['That one says a different sound.', 'Listen again.', snd(c)]); })); });
      await G.right(lets[i].position, say(w) + '!'); }
    /* the chant (MAP.md): "Kick, kick, ck at the end." */
    G.A.name = 'song'; await clearItems(G); lets.forEach(t => S.scene.remove(t)); const sock = G.item('sock', () => V(-0.8, 2.0, -0.6), { size: 1.3 }); const ckT = letterTile('ck'); ckT.position.set(1.3, 2.1, -0.6); ckT.scale.setScalar(n() ? 0.6 : 0.8); S.scene.add(ckT);
    await G.say('Sometimes two letters make this sound.', 'At the end of a word, like sock.');
    await G.say('Our chant! Kick your foot with me.');
    for (const l of ['Kick, kick, ck at the end!', 'Sock, rock, duck, kick!']) { G.mendy.wiggle(); sock.poke(); await G.say(l); await audio.letter('k'); }
    S.scene.remove(ckT); G.A.name = 'play'; await G.done('Let\'s meet each sound!');
  }
};

export const GAMES = { opener, 'g-meet': meet('g'), 'g-trace': trace('g'), 'g-hunt': hunt.g, 'o-meet': meet('o'), 'o-trace': trace('o'), 'o-hunt': hunt.o,
  slide: slide(['on', 'got', 'dog', 'pot', 'top'], 'Back to the word slide!', { dog: 'pot', pot: 'top', top: 'dog' }),
  'c-meet': meet('c'), 'c-trace': trace('c'), 'c-hunt': hunt.c, 'k-meet': meet('k'), 'k-trace': trace('k'), 'k-hunt': hunt.k, ksort,
  'e-meet': meet('e'), 'e-trace': trace('e'), 'e-hunt': hunt.e,
  slide2: slide(['cap', 'kid', 'pen', 'net', 'peg', 'sock', 'neck'], 'New sounds on the word slide!', { cap: 'net', net: 'sock', sock: 'cap' }, true), fixit, review, check };
