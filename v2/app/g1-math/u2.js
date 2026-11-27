/* Grade 1 Math 2.0, Unit 2: Count on, count back, in the Harbor (v2/curriculum/g1-math/MAP.md, Unit 2).
   unit2.html (no ?g) is the dock: 8 round posts, one per game, in order; 2 stars opens the next.
   ?g=opener   the lesson: put the big number in your head, count on; counting back is the same, going back
   ?g=sail     Sail on: drag the boat along the buoys (each buoy rings its number), then write the answer
   ?g=bigfirst Big pile first: choose which pile goes in the boat first; the game shows how much counting each way takes
   ?g=turn     Spin the plank: 3 + 8 and 8 + 3 (the turn-around fact); he spins the plank himself
   ?g=pull     Pull it back: pull the rope to bring the boat back one buoy at a time (counting back), drop anchor, write
   ?g=mistake  Find the mistake: Dovid counts the start number again ("5, 6, 7" for 5 + 3)
   ?g=check    Mastery check: 8 facts within 20, written; the buoys after the start are blank; the last 3 have no buoys
   ?g=review   Review of Unit 1 and Kindergarten
   Test hooks: window.__g1 (kit3d.js). */
import { THREE, FAST, QUICK, G, say, wait, ui, stage, glow, addKid, confetti, tween, dots, pad, endScreen, numTex, chime, starsFor, shuffle, rnd, goButton, canvasTex, MATS } from './kit3d.js';
import { harborWorld, dock, buoy, boat, barrel, rope } from './harbor.js';

const GAME = new URLSearchParams(location.search).get('g') || 'dock';
const ORDER = ['opener', 'sail', 'bigfirst', 'turn', 'pull', 'mistake', 'check', 'review'];
const host = ui({ home: GAME === 'dock' ? './' : 'unit2.html' });
const S = stage(host, { sky: { top: '#5AB0F0', mid: '#A6DAFF', low: '#FFF0D2' } });
harborWorld(S);
G.isReady = () => S.frames > 2;
const PORTRAIT = innerHeight > innerWidth;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const sc = (o, dy) => S.screenOf(o, dy || 0);
const temp = [];
const keep = o => { S.scene.add(o); temp.push(o); return o; };
const clearTemp = () => { temp.splice(0).forEach(o => S.scene.remove(o)); S.clearInput(); };
const starsOf = g => { try { return +localStorage.getItem('g1math:unit2.html:' + g) || 0; } catch (e) { return 0; } };
const lightUp = (o, color, size) => { const g = glow(color || '#FFD84A', size || 2.4); g.position.set(0, 0.06, 0); o.add(g); return g; };
const bobbers = new Set(); S.tick.push((dt, t) => bobbers.forEach(b => b.parent ? b.bob(t) : bobbers.delete(b)));
const bob = o => { bobbers.add(o); return o; };

/* a painted wooden sign board that shows a number sentence, e.g. "9 + 4 = ?" */
function signBoard(text, w = 4.6) {
  const g = new THREE.Group(), post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.6, 8), MATS.phys('#8A5A3A')); post.position.y = 0.8; g.add(post);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.32), new THREE.MeshStandardMaterial({ roughness: 0.7 })); face.position.y = 1.9; g.add(face);
  const back = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, w * 0.32 + 0.2, 0.12), MATS.phys('#C99A62')); back.position.set(0, 1.9, -0.08); g.add(back);
  g.set = (t, sub) => { face.material.map = canvasTex(512, 164, (x, W, H) => { x.fillStyle = '#FFF8E8'; x.fillRect(0, 0, W, H);
      x.font = '900 ' + (sub ? 84 : 104) + 'px "Nunito","Arial Rounded MT Bold","Arial Black",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#2B3A63'; x.fillText(t, W / 2, sub ? 62 : H / 2 + 6, W - 20);
      if (sub) { x.font = '900 40px Arial,sans-serif'; x.fillStyle = '#E0408A'; x.fillText(sub, W / 2, 132); } }); face.material.needsUpdate = true; };
  g.set(text); return g;
}
const eq = (a, op, b, ans) => a + ' ' + op + ' ' + b + ' = ' + (ans == null ? '?' : ans);

/* ============================================================ the number line on the water ============================================================ */
/* buoys for lo..lo+count-1 in a straight line: across the screen on a Chromebook, up the channel on a phone */
function lineOf(lo, count, o = {}) {
  const pos = i => PORTRAIT ? V(-0.8, 0, 6 - i * 1.85) : V((i - (count - 1) / 2) * 2.05, 0, 3);
  const bs = []; for (let i = 0; i < count; i++) { const n = lo + i, b = keep(bob(buoy(o.hide && o.hide(n) ? null : n))); b.userData.n = n; b.position.copy(pos(i)); bs.push(b); }
  if (PORTRAIT) S.frame(V(0, 0.4, 6 - (count - 1) * 1.85 / 2 - 0.6), 6, count * 1.85 + 2.4, V(0, 2.3, 1));
  else S.frame(V(0, 1.4, 0.2), count * 2.05 + 3.2, 9.5, V(0, 0.8, 1));
  return { bs, at: n => bs[n - lo], posOf: n => pos(n - lo), lo, hi: lo + count - 1 };
}
const boatSpot = p => p.clone().add(PORTRAIT ? V(1.75, 0, 0) : V(0, 0, -1.5));   /* behind the buoys, so the sail never hides a number */
function windowFor(a, b) { const W = PORTRAIT ? 8 : 11, lo0 = Math.min(a, b) - 1, hi0 = Math.max(a, b) + 1; let lo = Math.max(0, lo0 - Math.floor((W - (hi0 - lo0 + 1)) / 2)); if (lo + W - 1 < hi0) lo = hi0 - W + 1; return { lo, W }; }

/* SAIL: the boat is on `start`; he drags it `k` buoys (forward to add, back to take away), then writes the answer */
async function sailRound(start, k, dir, o = {}) {
  clearTemp(); const ans = start + dir * k; G.q = (G.q || 0) + 1; G.ask = { kind: dir > 0 ? 'sail' : 'back', start, k, dir, answer: ans };
  const { lo, W } = windowFor(start, ans);
  const L = lineOf(lo, W, { hide: o.hidden ? (n => n !== start) : null });
  const sg = keep(signBoard(eq(start, dir > 0 ? '+' : '−', k))); sg.position.copy(PORTRAIT ? V(-2.6, 0, 7.4) : V(0, 1.4, -6.5)); sg.scale.setScalar(PORTRAIT ? 0.62 : 1.25);
  const bt = keep(bob(boat())); bt.position.copy(boatSpot(L.posOf(start))); bt.setHatch(start); if (PORTRAIT) bt.rotation.y = Math.PI / 2;
  lightUp(L.at(start), '#7FD6FF');
  let at = start, moving = Promise.resolve(); G.at = at;
  const hops = () => (at - start) * dir;
  const step = async (to, voice) => { at = to; G.at = at; chime('tap'); moving = tween(220, u => bt.position.lerp(boatSpot(L.posOf(to)), u)); sg.set(eq(start, dir > 0 ? '+' : '−', k), hops() > 0 ? '●'.repeat(Math.min(hops(), 12)) : ''); if (voice) await say(String(to)); };
  G.hit = { boat: () => sc(bt, 0.6), buoy: n => sc(L.at(n), 0.3) };
  if (o.demo) {
    await say('Watch me. ' + start + ' is in my head.'); await say((dir > 0 ? 'I sail ' : 'I sail back ') + k + ', counting each buoy.');
    for (let i = 1; i <= k; i++) await step(start + dir * i, true);
    lightUp(L.at(ans)); await say(eq(start, dir > 0 ? 'plus' : 'minus', k, ans).replace('=', 'is') + '. Now you!'); await wait(400); return true;
  }
  await say(o.check ? 'Drag the boat, then write the answer.' : (dir > 0 ? 'Sail ' + k + ' more. Drag the boat.' : 'Sail back ' + k + '. Drag the boat.'), { cap: eq(start, dir > 0 ? '+' : '−', k) + '   Drag the boat.' });
  G.state = 'drag';
  let first = true;
  const plane = new THREE.Plane(V(0, 1, 0), -0.5);
  await new Promise(done => {
    S.onDrag([bt], plane, {
      start: () => chime('tap'),
      move: (b, p) => { /* the nearest buoy under his finger; the boat goes there one buoy at a time, counting each */
        let best = at, bd = 1e9; for (let n = L.lo; n <= L.hi; n++) { const q = boatSpot(L.posOf(n)), d = Math.hypot(q.x - p.x, q.z - p.z); if (d < bd) { bd = d; best = n; } }
        while (best !== at) step(at + Math.sign(best - at), !QUICK && !o.check); },
      drop: async () => { await moving; if (at === start) return;
        if (hops() === k) { S.clearInput(); done(); return; }
        G.fixes++; first = false;
        if (hops() < 0) await say(dir > 0 ? 'To add, sail forward.' : 'To take away, sail back.');
        else await say('You sailed ' + hops() + '. We need ' + k + '.'); } });
  });
  G.state = 'write'; await say('Write the answer.', { cap: eq(start, dir > 0 ? '+' : '−', k) });
  for (;;) { const v = await pad(3);
    if (v === ans) { sg.set(eq(start, dir > 0 ? '+' : '−', k, ans)); lightUp(L.at(ans)); chime('good'); confetti(S, bt.position.clone().add(V(0, 2, 0)), 40); await say(first ? 'Yes! ' + ans + '!' : ans + '! You got it.'); await wait(300); return first; }
    first = false; G.fixes++;
    if (o.check) { await say('It is ' + ans + '.'); return false; }
    L.at(ans).setNum(ans); lightUp(L.at(ans), '#FFB0D8'); await say('Look where the boat is. Try again.'); }
}
/* a fact with no buoys at all: the sign and the number pad (the check's last items) */
async function factRound(a, op, b, o = {}) {
  clearTemp(); const ans = op === '+' ? a + b : a - b; G.q = (G.q || 0) + 1; G.ask = { kind: op === '+' ? 'fact' : 'factback', answer: ans };
  const sg = keep(signBoard(eq(a, op === '+' ? '+' : '−', b), 5)); sg.position.set(0, 0, 0);
  const m = keep(addKid(S, 'mendy', V(PORTRAIT ? 2.4 : 3.6, 0.45, 2.8))); m.scale.setScalar(0.75);
  keep(dock(16, 3));
  S.frame(V(0.4, 1.6, 1), PORTRAIT ? 7 : 10, 5, V(0, 0.4, 1));
  await say(o.say || 'Think it in your head. Write the answer.', { cap: eq(a, op === '+' ? '+' : '−', b) });
  G.state = 'write'; const v = await pad(2);
  if (v === ans) { chime('good'); m.act('cheer'); sg.set(eq(a, op === '+' ? '+' : '−', b, ans)); await say('Yes! ' + ans + '.'); await wait(300); return true; }
  G.fixes++; sg.set(eq(a, op === '+' ? '+' : '−', b, ans)); await say(o.check ? 'It is ' + ans + '.' : 'It is ' + ans + '. Count on from the big one.'); await wait(500); return false;
}
/* hear a number and write it (the review of Unit 1) */
async function hearRound(n) {
  clearTemp(); G.q = (G.q || 0) + 1; G.ask = { kind: 'hear', answer: n };
  const b = keep(bob(buoy(null))); b.scale.setScalar(2.4); b.position.set(0, 0, 2); lightUp(b, '#FFE27A', 3.4);
  S.frame(V(0, 1, 2), PORTRAIT ? 6 : 9, 5, V(0, 0.9, 1));
  await say('Write ' + n + '.', { cap: 'Write the number you hear.' }); G.state = 'write';
  const v = await pad(3); b.setNum(v);
  if (v === n) { chime('good'); await say('Yes! ' + n + '.'); return true; }
  G.fixes++; b.setNum(n); await say('It is ' + n + '.'); await wait(400); return false;
}

/* ============================================================ the games ============================================================ */
const HOW = {
  sail: { title: 'Sail on', steps: ['The boat\'s number goes in your head.', 'Drag the boat. Count each buoy: 10, 11, 12 ...', 'Stop after the right number of buoys.', 'Write where you are.'], say: 'Start number in your head. Count each buoy.',
    pic: '<svg viewBox="0 0 320 110"><g font-family="Arial" font-weight="900" font-size="20" text-anchor="middle">' + [9, 10, 11, 12, 13].map((n, i) => `<circle cx="${40 + i * 60}" cy="70" r="24" fill="${i ? '#FFC233' : '#7FD6FF'}"/><text x="${40 + i * 60}" y="77" fill="#2B3A63">${n}</text>`).join('') + [0, 1, 2, 3].map(i => `<path d="M${48 + i * 60} 40 Q ${70 + i * 60} 12 ${92 + i * 60} 40" fill="none" stroke="#3C7DD9" stroke-width="4" stroke-linecap="round"/>`).join('') + '</g></svg>' },
  bigfirst: { title: 'Big pile first', steps: ['Look at the two piles.', 'Put the BIG pile in the boat first. Its number goes in your head.', 'Count on the small pile: tap each barrel.', 'Write how many.'], say: 'Big pile first. Then count on the small pile.' },
  turn: { title: 'Spin the plank', steps: ['Count the barrels: start with the big side.', 'Write the answer.', 'Spin the plank around.', 'Same barrels, same answer!'], say: 'Same barrels, same answer, any way around.' },
  pull: { title: 'Pull it back', steps: ['The boat\'s number goes in your head.', 'Pull the rope once for each buoy back.', 'Count back as you pull: 13, 12, 11 ...', 'Tap the anchor, then write the answer.'], say: 'Pull once for each buoy. Count back as you pull.' },
  mistake: { title: 'Find the mistake', steps: ['Look at Dovid\'s hops.', 'The first hop goes to the NEXT buoy.', 'Tap the hop that is wrong.', 'Write the right answer.'], say: 'The first hop goes to the next buoy.' }
};

async function opener() {
  G.name = 'opener'; dots(4, 0);
  G.how = { title: 'Count on, count back', steps: ['Put the big number in your head.', 'Count on the rest: 9, 10, 11.', 'To take away, count back: 11, 10, 9.'], say: 'Big number in your head, then count on.' };
  keep(dock(22, 3.2));
  const bt = keep(bob(boat())); bt.position.set(PORTRAIT ? 0 : 1.5, 0, 6.6);
  const m = keep(addKid(S, 'mendy', V(PORTRAIT ? -2.2 : -4.5, 0.55, 3.2))); m.scale.setScalar(0.8);
  S.frame(V(PORTRAIT ? -0.6 : -0.5, 1.2, 4.6), PORTRAIT ? 7 : 13, 6, V(0, 0.6, 1), true);
  await say('Hi! Welcome to the harbor!'); m.act('wave', 1.6);
  await say('Today we learn a fast way to add and take away.');
  /* 1. eight barrels go in at once */
  const pile = []; for (let i = 0; i < 8; i++) { const b = keep(barrel()); b.position.set(-2 + (i % 4) * 0.75, 0.55, 2.6 + Math.floor(i / 4) * 0.75); pile.push(b); }
  await say('Watch me. I put 8 barrels in the boat.');
  await Promise.all(pile.map((b, i) => tween(500 + i * 40, u => b.position.lerp(bt.position.clone().add(V(-0.6, 0.6, 0)), u)))); pile.forEach(b => S.scene.remove(b));
  bt.setHatch(8); chime('good'); dots(4, 1);
  await say('Now 8 is in my head. I don\'t count them again!');
  const more = []; for (let i = 0; i < 3; i++) { const b = keep(barrel('#7FB069')); b.position.set(-0.5 + i * 0.9, 0.55, 2.8); more.push(b); }
  await say('3 more come. I count on: 9, 10, 11.');
  for (let i = 0; i < 3; i++) { lightUp(more[i], '#FFE27A', 1.4); chime('tap'); await wait(350); await tween(300, u => more[i].position.lerp(bt.position.clone().add(V(-0.6, 0.6, 0)), u)); more[i].visible = false; bt.setHatch(9 + i); }
  await say('8 and 3 more is 11!'); m.act('cheer'); dots(4, 2);
  /* 2. now you: 6 in your head, tap each new barrel */
  bt.setHatch(6); await say('Now you! 6 is in the boat.');
  const yours = []; for (let i = 0; i < 3; i++) { const b = keep(barrel('#5C8FD6')); b.position.set(-0.9 + i * 0.95, 0.55, 2.8); yours.push(b); }
  await say('Tap each new barrel and count on.'); G.state = 'tapcount'; G.hit = { barrel: i => sc(yours[i], 0.3) };
  let n = 6; for (let i = 0; i < 3; i++) {
    await new Promise(res => { const t = S.onTap(yours.filter(b => b.visible), o => { t.enabled = false; res(o); }); }).then(async o => { n++; chime('tap'); bt.setHatch(n); await tween(260, u => o.position.lerp(bt.position.clone().add(V(-0.6, 0.6, 0)), u)); o.visible = false; await say(String(n)); }); }
  G.state = 'write'; await say('How many in the boat now? Write it.');
  while ((await pad(2)) !== 9) { G.fixes++; await say('6 in your head, then 7, 8, 9.'); }
  chime('good'); m.act('cheer'); await say('Yes! 9. You counted on!'); dots(4, 3);
  /* 3. counting back is the same, going back */
  clearTemp(); G.state = 'busy';
  const L = lineOf(6, PORTRAIT ? 8 : 9); const b2 = keep(bob(boat())); b2.position.copy(boatSpot(L.posOf(12))); b2.setHatch(12); if (PORTRAIT) b2.rotation.y = Math.PI / 2;
  await say('To take away, count back. 12, take away 3.');
  for (let k = 11; k >= 9; k--) { await tween(380, u => b2.position.lerp(boatSpot(L.posOf(k)), u)); chime('tap'); await say(String(k)); }
  lightUp(L.at(9)); await say('12 take away 3 is 9!');
  await say('Big number in your head. Then count on, or back.');
  confetti(S, b2.position.clone().add(V(0, 2, 0)), 60); dots(4, 4); G.how = null; await wait(500);
  const r = await endScreen(3); if (r === 'replay') location.reload();
}
async function sail() {
  G.name = 'sail'; const R = 5; dots(R, 0); G.how = HOW.sail;
  await sailRound(9, 3, 1, { demo: true }); dots(R, 1);
  let miss = 0, easy = false;
  const plan = [() => [rnd(5, 8), rnd(2, 3)], () => [rnd(7, 9), rnd(3, 5)], () => [rnd(11, 14), rnd(3, 5)], () => [rnd(8, 12), rnd(4, 6)]];
  for (let r = 0; r < plan.length; r++) { G.round = r; let [s, k] = plan[r](); if (easy) { s = Math.min(s, 6); k = Math.min(k, 3); }
    if (!(await sailRound(s, k, 1))) miss++; if (miss >= 2 && !easy) { easy = true; G.easy = true; await say('Let us use smaller numbers.'); } dots(R, r + 2); }
  if (miss === 0) { G.bonus = true; await say('Bonus! The buoys are blank.'); await sailRound(rnd(10, 13), rnd(4, 6), 1, { hidden: true }); }
  const st = easy ? Math.min(2, starsFor(miss, 4)) : starsFor(miss, 4); await say(st === 3 ? 'Smooth sailing!' : 'Great counting on!');
  const e = await endScreen(st); if (e === 'replay') location.reload();
}
async function bigfirst() {
  G.name = 'bigfirst'; const R = 4; dots(R, 0); G.how = HOW.bigfirst;
  let miss = 0;
  const pairs = [[2, 9], [3, 8], [9, 4], [2, 11]];
  for (let r = 0; r < pairs.length; r++) {
    clearTemp(); G.round = r; const [a, b] = pairs[r], big = Math.max(a, b), small = Math.min(a, b), ans = a + b;
    G.q = (G.q || 0) + 1; G.ask = { kind: 'bigfirst', big, small, answer: ans };
    keep(dock(22, 3.2)); const bt = keep(bob(boat())); bt.position.set(0, 0, 6.8);
    const sides = shuffle([a, b]);
    const piles = sides.map((n, j) => { const g = keep(new THREE.Group()); g.position.set((j ? 1 : -1) * (PORTRAIT ? 2.1 : 3.6), 0.55, 2.6); g.userData.n = n;
      const bs = []; for (let i = 0; i < n; i++) { const br = barrel(j ? '#7FB069' : '#5C8FD6'); br.position.set(((i % 4) - 1.5) * 0.7, Math.floor(i / 8) * 0.64, Math.floor((i % 8) / 4) * 0.7 - 0.35); g.add(br); bs.push(br); }
      const hit = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 2.2), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); hit.position.y = 0.6; g.add(hit);
      g.userData.bs = bs; return g; });
    const m = keep(addKid(S, 'mendy', V(0, 0.55, 1.4))); m.scale.setScalar(PORTRAIT ? 0.6 : 0.75);
    S.frame(V(0, 1, 3.8), PORTRAIT ? 7.4 : 12, 6.5, V(0, 0.8, 1));
    G.hit = { pile: n => sc(piles.find(p => p.userData.n === n), 0.6), barrel: i => sc(piles.find(p => p.userData.n === small).userData.bs[i], 0.2) };
    if (r === 0) { await say('Two piles go in the boat. Which one goes first?'); }
    else await say('Which pile goes in first?');
    G.state = 'choose';
    let first = true;
    for (;;) {
      const p = await new Promise(res => { const t = S.onTap(piles, o => { t.enabled = false; res(o); }); });
      G.state = 'busy'; chime('tap'); const n = p.userData.n, other = piles.find(x => x !== p);
      bt.setHatch(n); lightUp(p, '#7FD6FF', 3.2);
      if (n === big) { await say(n + ' goes in your head. Now count on the small pile.'); break; }
      first = false; G.fixes++;
      await say(n + ' in your head. Count on ' + other.userData.n + '... that is long!');
      for (let i = 1; i <= other.userData.n; i++) { chime('tap'); bt.setHatch(n + i); await wait(QUICK ? 10 : 180); }
      await say('So much counting! Try the big pile first.'); bt.setHatch(null); G.state = 'choose';
    }
    /* count on the small pile: tap each barrel */
    const sp = piles.find(p => p.userData.n === small); let c = big; G.state = 'tapcount';
    await new Promise(res => { S.onTap(sp.userData.bs, async o => { if (!o.parent) return; o.parent.remove(o); c++; bt.setHatch(c); chime('tap'); if (!QUICK) say(String(c)); if (c === ans) res(); }); });
    S.clearInput(); G.state = 'write'; await say('How many in the boat? Write it.', { cap: big + ' + ' + small + ' = ?' });
    for (;;) { const v = await pad(2); if (v === ans) { chime('good'); m.act('cheer'); confetti(S, bt.position.clone().add(V(0, 2, 0)), 40); await say('Yes! ' + big + ' and ' + small + ' is ' + ans + '.'); break; }
      first = false; G.fixes++; await say('Look at the boat. It shows the count.'); }
    if (!first) miss++; dots(R, r + 1); await wait(300);
  }
  const st = starsFor(miss, 4); const e = await endScreen(st); if (e === 'replay') location.reload();
}
async function turn() {
  G.name = 'turn'; const R = 3; dots(R, 0); G.how = HOW.turn;
  let miss = 0; const pairs = [[3, 8], [2, 7], [4, 9]];
  for (let r = 0; r < pairs.length; r++) {
    clearTemp(); G.round = r; const [a, b] = pairs[r], ans = a + b; G.q = (G.q || 0) + 1; G.ask = { kind: 'turn', a, b, answer: ans };
    keep(dock(22, 3.2));
    const plank = keep(new THREE.Group()); plank.position.set(0, 0.55, 3.0);
    const board = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.16, 1.2), MATS.phys('#C99A62', { roughness: 0.6 })); board.position.y = 0.6; board.castShadow = !FAST; plank.add(board);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.6, 16), MATS.phys('#8A5A3A')); pin.position.y = 0.3; plank.add(pin);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 10, 28), MATS.phys('#FF7A59', { clearcoat: 1 })); wheel.rotation.x = Math.PI / 2; wheel.position.y = 0.95; plank.add(wheel);
    const hitW = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.6, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); hitW.position.y = 0.95; plank.add(hitW);
    const put = (n, side, colr) => { for (let i = 0; i < n; i++) { const br = barrel(colr); br.scale.setScalar(0.85); br.position.set(side * (0.6 + (i % 5) * 0.55), 0.68 + Math.floor(i / 5) * 0.55, 0); plank.add(br); } };
    put(a, -1, '#5C8FD6'); put(b, 1, '#7FB069');
    const sg = keep(signBoard(eq(a, '+', b))); sg.position.set(0, PORTRAIT ? 0.45 : 1.2, PORTRAIT ? 0.6 : -3.5); sg.scale.setScalar(PORTRAIT ? 0.6 : 1.1);
    const m = keep(addKid(S, 'mendy', V(PORTRAIT ? 2.6 : 5.4, 0.55, 2.0))); m.scale.setScalar(PORTRAIT ? 0.55 : 0.75);
    S.frame(V(0, 1.4, 2.6), PORTRAIT ? 7.2 : 14, 6, V(0, 0.75, 1));
    G.hit = { wheel: () => sc(wheel), spinTo: () => { const d = new THREE.Object3D(); d.position.copy(plank.position).add(V(PORTRAIT ? 3.2 : 4.5, 0.95, 0)); S.scene.add(d); const s = sc(d); S.scene.remove(d); return s; } };
    let first = true;
    await say(r === 0 ? 'Count the barrels. Start with the big side!' : 'How many barrels?', { cap: eq(a, '+', b) });
    G.state = 'write';
    for (;;) { const v = await pad(2); if (v === ans) { chime('good'); sg.set(eq(a, '+', b, ans)); await say('Yes! ' + ans + '.'); break; } first = false; G.fixes++; await say(b + ' in your head, then count on ' + a + '.'); }
    await say('Now spin the plank! Drag the red wheel.'); G.state = 'spin';
    const plane = new THREE.Plane(V(0, 1, 0), -1.5); let x0 = null;
    await new Promise(done => { S.onDrag([hitW, wheel], plane, {
      start: (o, p) => { x0 = p.x; chime('tap'); },
      move: (o, p) => { plank.rotation.y = Math.max(-Math.PI, Math.min(Math.PI, -(p.x - x0) * 0.8)); },
      drop: async () => { if (Math.abs(plank.rotation.y) > 2.3) { const to = Math.sign(plank.rotation.y) * Math.PI, from = plank.rotation.y; await tween(250, u => { plank.rotation.y = from + (to - from) * u; }); S.clearInput(); done(); }
        else { const from = plank.rotation.y; await tween(250, u => { plank.rotation.y = from * (1 - u); }); say('Spin it all the way around!'); } } }); });
    chime('good'); sg.set(eq(b, '+', a)); G.state = 'write2';
    await say('Now it says ' + b + ' plus ' + a + '. How many?', { cap: eq(b, '+', a) });
    for (;;) { const v = await pad(2); if (v === ans) { chime('good'); sg.set(eq(b, '+', a, ans)); m.act('cheer'); confetti(S, V(0, 2.5, 3), 40); await say('Same barrels, same answer!'); break; }
      first = false; G.fixes++; await say('Same barrels as before. Same answer!'); }
    if (!first) miss++; dots(R, r + 1); await wait(300);
  }
  await say('Turn it around, the answer stays the same!');
  const e = await endScreen(starsFor(miss, 3)); if (e === 'replay') location.reload();
}
/* PULL IT BACK: each pull on the rope brings the boat back one buoy; he drops the anchor when he is done */
async function pullRound(start, k, o = {}) {
  clearTemp(); const ans = start - k; G.q = (G.q || 0) + 1; G.ask = { kind: 'pull', start, k, answer: ans };
  const { lo, W } = windowFor(start, ans); const L = lineOf(lo, W);
  const bt = keep(bob(boat())); bt.position.copy(boatSpot(L.posOf(start))); bt.setHatch(start); if (PORTRAIT) bt.rotation.y = Math.PI / 2;
  lightUp(L.at(start), '#7FD6FF');
  /* the rope runs from the boat to a big ring the boy pulls, near the low end of the line */
  const ringPos = PORTRAIT ? V(2.2, 0.6, 6 + 1.9) : V(-(W * 2.05) / 2 - 0.6, 0.6, 5.2);
  const ring = keep(new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.11, 10, 28), MATS.phys('#FF7A59', { clearcoat: 1 }))); ring.position.copy(ringPos); ring.rotation.x = -Math.PI / 2.4;
  const ringHit = keep(new THREE.Mesh(new THREE.SphereGeometry(0.95, 10, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))); ringHit.position.copy(ringPos);
  let rp = keep(rope(bt.position.clone().add(V(0, 0.7, 0)), ringPos));
  const anchor = keep(new THREE.Group()); const am = MATS.phys('#5B6B86', { clearcoat: 0.8 });
  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.1, 10), am); shank.position.y = 0.75; anchor.add(shank);
  const arm = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 8, 20, Math.PI), am); arm.rotation.z = Math.PI; arm.position.y = 0.45; anchor.add(arm);
  const eye = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.06, 8, 16), am); eye.position.y = 1.38; anchor.add(eye);
  const aHit = new THREE.Mesh(new THREE.SphereGeometry(0.95, 10, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); aHit.position.y = 0.8; anchor.add(aHit);
  anchor.position.copy(PORTRAIT ? V(2.2, 0.2, 6 - 7 * 1.85 + 0.2) : V((W * 2.05) / 2 + 0.4, 0.2, 5.2));
  const sg = keep(signBoard(eq(start, '−', k))); sg.position.copy(PORTRAIT ? V(-2.6, 0, 7.6) : V(0, 1.4, -6.5)); sg.scale.setScalar(PORTRAIT ? 0.6 : 1.25);
  let at = start; G.at = at; const pulls = () => start - at;
  const back = async voice => { if (at <= L.lo) return; at--; G.at = at; chime('tap'); S.scene.remove(rp); temp.splice(temp.indexOf(rp), 1);
    await tween(240, u => bt.position.lerp(boatSpot(L.posOf(at)), u)); rp = keep(rope(bt.position.clone().add(V(0, 0.7, 0)), ringPos)); sg.set(eq(start, '−', k), pulls() > 0 ? '●'.repeat(Math.min(12, pulls())) : ''); if (voice) await say(String(at)); };
  G.hit = { ring: () => sc(ringHit), pullTo: () => { const d = new THREE.Object3D(); d.position.copy(ringPos).add(PORTRAIT ? V(0, 0, 1.6) : V(-1.6, 0, 0.8)); S.scene.add(d); const s = sc(d); S.scene.remove(d); return s; }, anchor: () => sc(anchor, 0.8), buoy: n => sc(L.at(n), 0.3) };
  if (o.demo) {
    await say('Watch me. ' + start + ' is in my head. Take away ' + k + '.');
    for (let i = 0; i < k; i++) await back(true);
    lightUp(L.at(ans)); await say(k + ' pulls back. ' + start + ' take away ' + k + ' is ' + ans + '.'); await say('Now you!'); return true;
  }
  await say('Pull the rope ' + k + ' times. Then tap the anchor.', { cap: eq(start, '−', k) + '   Pull the red ring.' });
  G.state = 'pull';
  const plane = new THREE.Plane(V(0, 1, 0), -0.6);
  let first = true;
  for (;;) {
    await new Promise(done => { let p0 = null;
      S.onDrag([ringHit, ring], plane, { start: (r, p) => { p0 = p.clone(); }, move: (r, p) => { ring.position.copy(ringPos).add(p.clone().sub(p0).multiplyScalar(0.5)); },
        drop: async () => { const moved = ring.position.distanceTo(ringPos); ring.position.copy(ringPos); if (moved > 0.45) await back(!QUICK); } });
      S.onTap([aHit], () => { S.clearInput(); done(); }); });
    if (pulls() === k) break;
    G.fixes++; first = false;
    await say(pulls() === 0 ? 'Pull the red ring first.' : 'You pulled ' + pulls() + '. We need ' + k + '. Try again from ' + start + '.');
    at = start; G.at = at; bt.position.copy(boatSpot(L.posOf(start))); S.scene.remove(rp); temp.splice(temp.indexOf(rp), 1); rp = keep(rope(bt.position.clone().add(V(0, 0.7, 0)), ringPos)); sg.set(eq(start, '−', k));
    G.state = 'pull';
  }
  chime('good'); G.state = 'write'; await say('Anchor down! Write the answer.', { cap: eq(start, '−', k) });
  for (;;) { const v = await pad(2); if (v === ans) { sg.set(eq(start, '−', k, ans)); lightUp(L.at(ans)); confetti(S, bt.position.clone().add(V(0, 2, 0)), 40); await say(first ? 'Yes! ' + ans + '!' : ans + '! You got it.'); return first; }
    first = false; G.fixes++; await say('Look at the buoy by the boat. Try again.'); }
}
async function pull() {
  G.name = 'pull'; const R = 4; dots(R, 0); G.how = HOW.pull;
  await pullRound(12, 3, { demo: true }); dots(R, 1);
  let miss = 0; const plan = [[rnd(8, 10), 2], [rnd(12, 14), 3], [rnd(15, 18), rnd(3, 4)]];
  for (let r = 0; r < plan.length; r++) { G.round = r; if (!(await pullRound(plan[r][0], plan[r][1]))) miss++; dots(R, r + 2); }
  const e = await endScreen(starsFor(miss, 3)); if (e === 'replay') location.reload();
}
async function mistake() {
  G.name = 'mistake'; const R = 3; dots(R, 0); G.how = HOW.mistake;
  const a1 = rnd(4, 7), k1 = 3, a2 = rnd(8, 11), k2 = rnd(3, 4), a3 = rnd(13, 16), k3 = 3;
  const rounds = [{ s: a1, k: k1, dir: 1 }, { s: a2, k: k2, dir: 1 }, { s: a3, k: k3, dir: -1 }];
  let miss = 0;
  for (let r = 0; r < rounds.length; r++) {
    clearTemp(); G.round = r; const { s, k, dir } = rounds[r], ans = s + dir * k; G.q = (G.q || 0) + 1; G.ask = { kind: 'mistake', bad: s, answer: ans };
    const { lo, W } = windowFor(s, ans); const L = lineOf(lo, W);
    const bt = keep(bob(boat({ hull: '#7E5BEF' }))); bt.position.copy(boatSpot(L.posOf(s))); if (PORTRAIT) bt.rotation.y = Math.PI / 2;
    const d = keep(addKid(S, 'dovid', PORTRAIT ? V(-2.6, 0, 7.6) : V(-(W * 2.05) / 2 - 0.4, 0, 5.0))); d.scale.setScalar(0.72);
    const sg = keep(signBoard(eq(s, dir > 0 ? '+' : '−', k, s + dir * (k - 1)))); sg.position.copy(PORTRAIT ? V(1.6, 0, 8.4) : V(0, 1.4, -6.5)); sg.scale.setScalar(PORTRAIT ? 0.55 : 1.25);
    /* Dovid's hops: he says the start number on the first hop */
    const labels = []; for (let i = 0; i < k; i++) { const n = s + dir * i, b = L.at(n), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: numTex(n, { bg: '#FFE6F0' }), depthTest: false })); sp.scale.setScalar(1.1); sp.position.copy(b.position).add(V(0, 1.7, 0)); sp.renderOrder = 9; keep(sp); sp.userData.n = n; labels.push(sp); }
    G.hit = { label: i => sc(labels[i]), buoy: n => sc(L.at(n), 0.3) };
    d.act('think', 2);
    await say('Dovid did ' + s + (dir > 0 ? ' plus ' : ' take away ') + k + '. He got ' + (s + dir * (k - 1)) + '.', { cap: 'Dovid counted: ' + labels.map(l => l.userData.n).join(', ') });
    await say('Tap the hop that is wrong.'); G.state = 'find';
    let first = true;
    for (;;) { const i = await new Promise(res => { const t = S.onTap(labels.concat(L.bs), o => { t.enabled = false; res(labels.includes(o) ? labels.indexOf(o) : -1 - L.bs.indexOf(o)); }); });
      G.state = 'busy';
      if (i === 0 || i === -1 - L.bs.indexOf(L.at(s))) break;
      first = false; G.fixes++; await say('That hop is fine. Look at the first hop.'); G.state = 'find'; }
    chime('good'); lightUp(L.at(s), '#FFB0D8'); await say('Yes! He counted ' + s + ' again. The first hop is ' + (s + dir) + '.');
    labels.forEach(l => S.scene.remove(l));
    for (let i = 1; i <= k; i++) { const n = s + dir * i; await tween(260, u => bt.position.lerp(boatSpot(L.posOf(n)), u)); chime('tap'); if (!QUICK) await say(String(n)); }
    G.state = 'write'; await say('Write the right answer.', { cap: eq(s, dir > 0 ? '+' : '−', k) });
    for (;;) { const v = await pad(2); if (v === ans) { sg.set(eq(s, dir > 0 ? '+' : '−', k, ans)); d.act('cheer'); confetti(S, bt.position.clone().add(V(0, 2, 0)), 40); await say('Yes! ' + ans + '. Thank you!'); break; }
      first = false; G.fixes++; await say('Look where the boat stopped. Try again.'); }
    if (!first) miss++; dots(R, r + 1); await wait(300);
  }
  const e = await endScreen(starsFor(miss, 3)); if (e === 'replay') location.reload();
}
async function check() {
  G.name = 'check'; document.getElementById('help').classList.add('off'); const R = 8; dots(R, 0);
  await say('The big check! Do your best. No help this time.');
  const add = () => { const s = rnd(6, 14), k = rnd(3, 6); return [s, Math.min(k, 20 - s)]; };
  const items = [
    ...shuffle([() => { const [s, k] = add(); return sailRound(s, k, 1, { check: true, hidden: true }); },
      () => { const [s, k] = add(); return sailRound(s, k, 1, { check: true, hidden: true }); },
      () => { const [s, k] = add(); return sailRound(s, k, 1, { check: true, hidden: true }); },
      () => sailRound(rnd(11, 17), rnd(3, 5), -1, { check: true, hidden: true }),
      () => sailRound(rnd(9, 15), rnd(2, 4), -1, { check: true, hidden: true })]),
    () => { const a = rnd(2, 4), b = rnd(7, 9); return factRound(a, '+', b, { check: true }); },   /* small first: he must start from the big one */
    () => factRound(rnd(8, 12), '+', rnd(2, 3), { check: true }),
    () => factRound(rnd(10, 15), '−', rnd(2, 3), { check: true })];
  let right = 0; const missed = {};
  for (let i = 0; i < items.length; i++) { G.round = i; if (await items[i]()) right++; else { const g = { sail: 'sail', back: 'pull', fact: 'bigfirst', factback: 'pull' }[G.ask.kind] || 'sail'; missed[g] = (missed[g] || 0) + 1; } dots(R, i + 1); }
  G.right = right; G.mastered = right >= 7;
  clearTemp(); keep(dock(20, 3.2)); const m = keep(addKid(S, 'mendy', V(PORTRAIT ? 0 : -3.2, 0.55, 3))); m.rotation.y = PORTRAIT ? 0 : 0.4; S.frame(V(0, PORTRAIT ? -0.2 : 1.6, 3), 10, 7, V(0, 0.45, 1));
  if (G.mastered) { m.act('cheer', 3); confetti(S, V(0, 3, 3), 80); await say('You did it! You count on and back!'); }
  else { m.act('wave', 2); await say('Good work! Let us practice and try again.'); G.practice = Object.keys(missed).sort((a, b) => missed[b] - missed[a])[0] || 'sail'; document.getElementById('onward').href = 'unit2.html?g=' + G.practice; }
  const e = await endScreen(right === 8 ? 3 : right === 7 ? 2 : 1); if (e === 'replay') location.reload();
}
async function review() {
  G.name = 'review'; const R = 5; dots(R, 0);
  G.how = { title: 'Review', steps: ['Listen to each question.', 'Sail, write or count on.', 'Use what you learned before!'], say: 'Listen, then show what you know.' };
  await say('Let us remember Orchard Hill and kindergarten!');
  const items = [
    () => sailRound(rnd(97, 99), rnd(3, 4), 1),          /* counting past 100 (Unit 1) */
    () => hearRound(100 + rnd(1, 19)),                    /* writing big numbers (Unit 1) */
    () => sailRound(109, 1, 1),                           /* what comes after 109 */
    () => factRound(rnd(2, 5), '+', rnd(2, 4), { say: 'Add them. Write the answer.' }),   /* adding within 10 (K) */
    () => sailRound(rnd(6, 9), rnd(2, 3), -1)];           /* taking away within 10 (K) */
  let miss = 0; for (let i = 0; i < items.length; i++) { G.round = i; if (!(await items[i]())) miss++; dots(R, i + 1); }
  const e = await endScreen(starsFor(miss, 5)); if (e === 'replay') location.reload();
}

/* ============================================================ the dock: one post per game ============================================================ */
const ICONS = {
  opener: x => { x.fillStyle = '#2EDB6A'; x.beginPath(); x.moveTo(96, 70); x.lineTo(96, 186); x.lineTo(190, 128); x.closePath(); x.fill(); },
  sail: x => { x.fillStyle = '#3C7DD9'; x.beginPath(); x.moveTo(60, 160); x.lineTo(196, 160); x.lineTo(176, 190); x.lineTo(80, 190); x.fill(); x.fillStyle = '#FFFFFF'; x.strokeStyle = '#3C7DD9'; x.lineWidth = 6; x.beginPath(); x.moveTo(128, 60); x.lineTo(128, 150); x.lineTo(186, 150); x.closePath(); x.fill(); x.stroke(); },
  bigfirst: x => { x.fillStyle = '#B97A45'; [[60, 120, 34], [104, 120, 34], [82, 80, 34], [170, 150, 22]].forEach(([cx, cy, r]) => { x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); }); },
  turn: x => { x.strokeStyle = '#FF7A59'; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); x.arc(128, 128, 62, 0.3, 5.9); x.stroke(); x.fillStyle = '#FF7A59'; x.beginPath(); x.moveTo(200, 120); x.lineTo(186, 160); x.lineTo(160, 124); x.fill(); },
  pull: x => { x.strokeStyle = '#C9A46A'; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(40, 80); x.quadraticCurveTo(128, 180, 200, 100); x.stroke(); x.strokeStyle = '#FF7A59'; x.beginPath(); x.arc(200, 100, 26, 0, 7); x.stroke(); },
  mistake: x => { x.strokeStyle = '#3B6FD6'; x.lineWidth = 16; x.beginPath(); x.arc(112, 112, 46, 0, 7); x.stroke(); x.lineCap = 'round'; x.beginPath(); x.moveTo(146, 146); x.lineTo(196, 196); x.stroke(); },
  check: x => { x.fillStyle = '#FFC21A'; x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 36 : 84, a = i * Math.PI / 5 - Math.PI / 2; x.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } x.closePath(); x.fill(); },
  review: x => { x.strokeStyle = '#7E5BEF'; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); x.arc(128, 128, 62, 0.4, 5.6); x.stroke(); x.fillStyle = '#7E5BEF'; x.beginPath(); x.moveTo(196, 70); x.lineTo(196, 128); x.lineTo(150, 100); x.fill(); }
};
const HUE = ['#BFF0CF', '#CFE8FF', '#F3DDB8', '#FFD9B8', '#FFD0E4', '#CFE0FF', '#FFF0B0', '#E3D6FF'];
function starTex(on) { return canvasTex(128, 128, x => { x.translate(64, 64); x.fillStyle = on ? '#FFC21A' : 'rgba(255,255,255,.8)'; x.strokeStyle = on ? '#E39A00' : 'rgba(120,120,140,.5)'; x.lineWidth = 6; x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 24 : 56, a = i * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke(); }); }
async function dockHub() {
  G.name = 'dock';
  const pts = ORDER.map((g, i) => PORTRAIT ? V((i % 2 ? 1 : -1) * 1.9, 0, 9 - i * 3.0) : V(-14 + i * 4, 0, 3 + (i % 2) * 0.9));
  keep(dock(PORTRAIT ? 8 : 34, PORTRAIT ? 0 : 3.4)).rotation.y = PORTRAIT ? Math.PI / 2 : 0;
  const all = /[?&]all=1/.test(location.search), open = ORDER.map((g, i) => all || i === 0 || starsOf(ORDER[i - 1]) >= 2);
  const posts = ORDER.map((g, i) => {
    const p = new THREE.Group(); p.position.copy(pts[i]); S.scene.add(p);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.9, 28), MATS.phys('#B9874F', { roughness: 0.6 })); pole.position.y = 0.45; pole.castShadow = !FAST; p.add(pole);
    const top = new THREE.Mesh(new THREE.CircleGeometry(1.02, 32), new THREE.MeshStandardMaterial({ roughness: 0.6, map: canvasTex(256, 256, x => { x.fillStyle = open[i] ? HUE[i] : '#D6D1C8'; x.beginPath(); x.arc(128, 128, 126, 0, 7); x.fill(); ICONS[g](x);
      if (!open[i]) { x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(150,150,150,.75)'; x.fillRect(0, 0, 256, 256); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#8D877E'; x.fillRect(100, 128, 56, 44); x.strokeStyle = '#8D877E'; x.lineWidth = 10; x.beginPath(); x.arc(128, 126, 18, Math.PI, 0); x.stroke(); } }) }));
    top.rotation.x = -Math.PI / 2; top.position.y = 0.91; p.add(top);
    const st = starsOf(g); for (let j = 0; j < 3; j++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex(j < st) })); sp.scale.setScalar(0.62); sp.position.set(-0.7 + j * 0.7, 1.9, -0.6); p.add(sp); }
    p.userData = { game: g, open: open[i] }; return p; });
  const allDone = ORDER.every(g => starsOf(g) >= 2), nextI = allDone ? ORDER.length - 1 : Math.max(0, ORDER.findIndex((g, i) => open[i] && starsOf(g) < 2));
  const ring = glow('#FFD84A', 3.6); ring.position.copy(pts[nextI]).add(V(0, 0.95, 0)); S.scene.add(ring); S.tick.push((dt, t) => { ring.material.opacity = 0.5 + Math.sin(t * 3) * 0.3; });
  const m = addKid(S, 'mendy', pts[nextI].clone().add(PORTRAIT ? V(nextI % 2 ? -2.4 : 2.4, 0, 0.4) : V(1.6, 0, 1.4))); m.scale.setScalar(0.8);
  const b = bob(boat()); b.position.set(PORTRAIT ? 0 : 6, 0, PORTRAIT ? -14 : 9); S.scene.add(b);
  const ctr = pts[0].clone().lerp(pts[pts.length - 1], 0.5);
  S.frame(V(ctr.x, 0.8, ctr.z + (PORTRAIT ? 0 : 1)), PORTRAIT ? 8 : 33, PORTRAIT ? 25 : 8, PORTRAIT ? V(0, 1.2, 0.8) : V(0, 0.6, 1), true);
  G.stationAt = i => sc(posts[i], 1); G.open = open;
  S.onTap(posts, o => { if (!o.userData.open) { say('Finish the post before it first.'); return; } chime('tap'); location.href = 'unit2.html?g=' + o.userData.game + (FAST ? '&fast=1' : QUICK ? '&quick=1' : ''); });
  G.how = { title: 'The Harbor', steps: ['Tap the glowing post.', 'Play the game.', 'Get 2 stars to open the next post.'], say: 'Tap the glowing post to play.' };
  await say(starsOf('opener') ? 'Welcome back to the harbor! Tap the glowing post.' : 'Welcome to the harbor! Tap the glowing post.');
  G.name = 'dock-ready';
}

const RUN = { dock: dockHub, opener, sail, bigfirst, turn, pull, mistake, check, review };
(async () => {
  if (GAME !== 'dock' && !QUICK) { G.name = 'start'; await goButton(); }
  await (RUN[GAME] || dockHub)();
})().catch(e => { G.err = String(e && e.stack || e); console.error(e); });
