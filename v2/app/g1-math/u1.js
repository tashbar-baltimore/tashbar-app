/* Grade 1 Math 2.0, Unit 1: Counting to 120 on Orchard Hill (v2/curriculum/g1-math/MAP.md, Unit 1).
   unit1.html (no ?g) is the hill: a path of 7 big stones, one per game, in order; 2 stars opens the next.
   ?g=opener  the lesson: count by tens up the hill, then past 100 (Watch me ... now you!)
   ?g=hop     Hop ahead: predict where Mendy lands, then he hops to check (counting on, across 100)
   ?g=wall    Fix the wall: drag fallen stones into the 120-chart wall (one more = next; ten more = below)
   ?g=crates  Crate count: tap the crates (tens), then the apples (ones), then WRITE the number
   ?g=mistake Find the mistake: Shmuel's real mistakes past 100 (109, 200 ... and 1003 for 103)
   ?g=check   Mastery check: 8 mixed items, no help; 7 of 8 is "mastered"
   ?g=review  Review of Kindergarten: teen numbers, tens, adding within 10 on the path
   Test hooks: window.__g1 (kit3d.js). */
import { THREE, FAST, QUICK, G, say, wait, ui, stage, orchard, stone, glow, crate, apple, addKid, confetti, tween, hopTo, dots, pad, endScreen, numTex, chime, starsFor, shuffle, rnd, goButton, canvasTex, SOFT, MATS } from './kit3d.js';

const GAME = new URLSearchParams(location.search).get('g') || 'hill';
const ORDER = ['opener', 'hop', 'wall', 'crates', 'mistake', 'check', 'review'];
const host = ui({ home: GAME === 'hill' ? './' : 'unit1.html' });
let S;
try { S = stage(host); } catch (e) { throw e; }
orchard(S);
G.isReady = () => S.frames > 2; G.kids = () => S.scene.children.filter(o => o.userData && o.userData.name).map(o => o.userData.name + '@' + o.position.x.toFixed(1) + ',' + o.position.z.toFixed(1));
const PORTRAIT = innerHeight > innerWidth;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const sc = (o, dy) => S.screenOf(o, dy || 0);
const temp = [];   /* things to clear between rounds */
const keep = o => { S.scene.add(o); temp.push(o); return o; };
const clearTemp = () => { temp.splice(0).forEach(o => S.scene.remove(o)); S.clearInput(); };
const starKey = g => 'g1math:unit1.html:' + g;
const starsOf = g => { try { return +localStorage.getItem(starKey(g)) || 0; } catch (e) { return 0; } };

/* a soft glowing number that floats above something (the count he is saying) */
function floatNum(n, at, color = '#FFE27A') {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: numTex(n, { bg: color }), depthTest: false, transparent: true }));
  s.scale.setScalar(1.15); s.position.copy(at); s.renderOrder = 10; keep(s); return s;
}
function shake(o) { const x = o.position.x; return tween(420, u => { o.position.x = x + Math.sin(u * Math.PI * 6) * 0.12 * (1 - u); }); }
function lightUp(o, color) { const g = glow(color || '#FFD84A', 2.8); g.position.set(0, 0.02, 0); o.add(g); return g; }

/* a soft dirt path under the stones */
function pathRibbon(w, h) { const t = canvasTex(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 40, 128, 128, 128); g.addColorStop(0, 'rgba(226,196,148,1)'); g.addColorStop(0.7, 'rgba(214,182,132,.9)'); g.addColorStop(1, 'rgba(214,182,132,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 500; i++) { x.fillStyle = 'rgba(160,120,80,' + (Math.random() * 0.25) + ')'; const a = Math.random() * 7, r = Math.random() * 100; x.fillRect(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, 3, 3); } });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 1, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; m.renderOrder = -1; return m; }
const wideCache = {};
function wideNum(n) { return wideCache[n] || (wideCache[n] = canvasTex(256, 140, (x) => { x.font = '900 112px "Nunito","Arial Rounded MT Bold","Arial Black",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#2B3A63'; x.fillText(String(n), 128, 76, 244); })); }
/* the "How to do it" pictures: small, warm drawings (inline, no download) */
const PIC = {
  hop: '<svg viewBox="0 0 320 120"><g font-family="Arial Rounded MT Bold,Arial" font-weight="900" font-size="22" text-anchor="middle">' +
    [0, 1, 2, 3, 4].map(i => `<circle cx="${40 + i * 60}" cy="80" r="26" fill="#EADCC4" stroke="#C9B48F" stroke-width="3"/><text x="${40 + i * 60}" y="88" fill="#2B3A63">${97 + i}</text>`).join('') +
    [0, 1, 2, 3].map(i => `<path d="M${46 + i * 60} 50 Q ${70 + i * 60} 14 ${94 + i * 60} 50" fill="none" stroke="#FF7EB9" stroke-width="4" stroke-linecap="round"/>`).join('') + '</g></svg>',
  wall: '<svg viewBox="0 0 320 120"><g font-family="Arial" font-weight="900" font-size="18" text-anchor="middle">' +
    [0, 1, 2, 3, 4].map(i => [0, 1].map(j => { const n = 31 + i + j * 10, gap = n === 43; return `<rect x="${20 + i * 58}" y="${14 + j * 48}" width="54" height="42" rx="8" fill="${gap ? '#5A4A3A' : '#E7D6BA'}"/>` + (gap ? '' : `<text x="${47 + i * 58}" y="${42 + j * 48}" fill="#2B3A63">${n}</text>`); }).join('')).join('') +
    '<path d="M163 70 v-6" stroke="#FF7EB9"/><text x="163" y="116" fill="#E0408A" font-size="16">33 + 10 = 43</text></g></svg>',
  crates: '<svg viewBox="0 0 320 120"><g font-family="Arial" font-weight="900" text-anchor="middle">' +
    [0, 1, 2].map(i => `<rect x="${14 + i * 72}" y="40" width="64" height="40" rx="6" fill="#C98B4E"/><text x="${46 + i * 72}" y="30" font-size="20" fill="#2B3A63">${(i + 1) * 10}</text>`).join('') +
    [0, 1].map(i => `<circle cx="${244 + i * 34}" cy="62" r="13" fill="#E2302E"/><text x="${244 + i * 34}" y="30" font-size="18" fill="#2B3A63">${31 + i}</text>`).join('') + '</g></svg>',
  mistake: '<svg viewBox="0 0 320 120"><g font-family="Arial" font-weight="900" font-size="20" text-anchor="middle">' +
    [108, 109, 200, 111].map((n, i) => `<circle cx="${50 + i * 74}" cy="70" r="30" fill="${n === 200 ? '#FFD6E6' : '#EADCC4'}" stroke="${n === 200 ? '#E0408A' : '#C9B48F'}" stroke-width="4"/><text x="${50 + i * 74}" y="78" fill="#2B3A63">${n}</text>`).join('') + '<text x="198" y="26" fill="#E0408A" font-size="18">110!</text></g></svg>'
};

/* ============================================================ the hill: one stone per game ============================================================ */
const ICONS = {
  opener: (x) => { x.fillStyle = '#2EDB6A'; x.beginPath(); x.moveTo(96, 70); x.lineTo(96, 186); x.lineTo(190, 128); x.closePath(); x.fill(); },
  hop: (x) => { x.strokeStyle = '#E0408A'; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(52, 160); x.quadraticCurveTo(92, 60, 128, 150); x.quadraticCurveTo(164, 60, 204, 160); x.stroke(); },
  wall: (x) => { x.fillStyle = '#B98A5C'; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (!(r === 1 && c === 1)) { x.fillRect(48 + c * 56 + (r % 2) * 10, 64 + r * 44, 50, 38); } },
  crates: (x) => { x.fillStyle = '#C98B4E'; x.fillRect(48, 110, 160, 70); x.fillStyle = '#E2302E'; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(68 + i * 30, 102, 16, 0, 7); x.fill(); } },
  mistake: (x) => { x.strokeStyle = '#3B6FD6'; x.lineWidth = 16; x.beginPath(); x.arc(112, 112, 46, 0, 7); x.stroke(); x.lineCap = 'round'; x.beginPath(); x.moveTo(146, 146); x.lineTo(196, 196); x.stroke(); },
  check: (x) => { x.fillStyle = '#FFC21A'; x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 36 : 84, a = i * Math.PI / 5 - Math.PI / 2; x.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } x.closePath(); x.fill(); },
  review: (x) => { x.strokeStyle = '#7E5BEF'; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); x.arc(128, 128, 62, 0.4, 5.6); x.stroke(); x.fillStyle = '#7E5BEF'; x.beginPath(); x.moveTo(196, 70); x.lineTo(196, 128); x.lineTo(150, 100); x.fill(); }
};
const HUE = ['#BFF0CF', '#FFD0E4', '#F3DDB8', '#FFD9B8', '#CFE0FF', '#FFF0B0', '#E3D6FF'];
async function hill() {
  G.name = 'hill';
  const pts = ORDER.map((g, i) => { const t = i / (ORDER.length - 1); return PORTRAIT ? V((i % 2 ? 1 : -1) * 2.1, 0, 8 - i * 3.3) : V(-13 + t * 26, 0, 1.5 - Math.sin(t * Math.PI) * 5 + (i % 2) * 1.2); });
  /* little stones between the big ones: the path */
  for (let i = 0; i < pts.length - 1; i++) for (let k = 1; k < 4; k++) { const p = pts[i].clone().lerp(pts[i + 1], k / 4), s = stone(null); s.scale.setScalar(0.45); s.position.copy(p); S.scene.add(s); }
  const open = ORDER.map((g, i) => i === 0 || starsOf(ORDER[i - 1]) >= 2 || /[?&]all=1/.test(location.search));
  const big = ORDER.map((g, i) => {
    const s = stone(null, { mat: MATS.phys(open[i] ? HUE[i] : '#CFCAC2', { roughness: 0.5, clearcoat: 0.5, envMapIntensity: 0.4 }) }); s.scale.setScalar(PORTRAIT ? 1.35 : 1.5); s.position.copy(pts[i]); S.scene.add(s);
    s.userData.face.material.color.set('#FFFFFF'); s.userData.face.material.transparent = true; s.userData.face.material.map = canvasTex(256, 256, (x) => { ICONS[g](x); if (!open[i]) { x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(150,150,150,.85)'; x.fillRect(0, 0, 256, 256); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#8D877E'; x.fillRect(100, 128, 56, 44); x.strokeStyle = '#8D877E'; x.lineWidth = 10; x.beginPath(); x.arc(128, 126, 18, Math.PI, 0); x.stroke(); } }); s.userData.face.material.needsUpdate = true;
    const st = starsOf(g); for (let j = 0; j < 3; j++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex(j < st) })); sp.scale.setScalar(0.7); sp.position.set(pts[i].x - 0.75 + j * 0.75, 1.15, pts[i].z - 1.1); S.scene.add(sp); }
    s.userData.game = g; s.userData.open = open[i]; return s; });
  const allDone = ORDER.every(g => starsOf(g) >= 2), nextI = allDone ? ORDER.length - 1 : Math.max(0, ORDER.findIndex((g, i) => open[i] && starsOf(g) < 2));
  const m = addKid(S, 'mendy', pts[nextI === -1 ? 0 : nextI].clone().add(V(PORTRAIT ? (nextI % 2 ? -2.6 : 2.6) : 1.9, 0, 0.6))); m.scale.setScalar(0.8);
  const ring = glow('#FFD84A', 4.2); ring.position.copy(pts[nextI]).add(V(0, 0.05, 0)); S.scene.add(ring);
  S.tick.push((dt, t) => { ring.material.opacity = 0.5 + Math.sin(t * 3) * 0.3; });
  const ctr = pts[0].clone().lerp(pts[pts.length - 1], 0.5); ctr.y = 0.6;
  ctr.z += PORTRAIT ? 0 : 1.2; S.frame(ctr, PORTRAIT ? 8.5 : 30, PORTRAIT ? 22 : 8, PORTRAIT ? V(0, 1.1, 0.8) : V(0, 0.62, 1), true);
  G.stationAt = i => sc(big[i]); G.open = open;
  S.onTap(big, o => { if (!o.userData.open) { say('Finish the stone before it first.'); return; } chime('tap'); location.href = 'unit1.html?g=' + o.userData.game + (FAST ? '&fast=1' : QUICK ? '&quick=1' : ''); });
  G.how = { title: 'Orchard Hill', steps: ['Tap the glowing stone.', 'Play the game.', 'Get 2 stars to open the next stone.'], say: 'Tap the glowing stone to play.' };
  await say(starsOf('opener') ? 'Welcome back! Tap the glowing stone.' : 'Welcome to Orchard Hill! Tap the glowing stone.');
  G.name = 'hill-ready';
}
function starTex(on) { return canvasTex(128, 128, (x) => { x.translate(64, 64); x.fillStyle = on ? '#FFC21A' : 'rgba(255,255,255,.75)'; x.strokeStyle = on ? '#E39A00' : 'rgba(120,120,140,.5)'; x.lineWidth = 6; x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 24 : 56, a = i * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke(); }); }

/* ============================================================ shared rounds (used by the games, the check and the review) ============================================================ */
/* a path of stones laid out in reading order: rows of 10 (Chromebook) or 5 (phone) */
function pathOf(first, count, o = {}) {
  const cols = o.cols || (PORTRAIT ? 5 : 10), gap = 2.25, rows = Math.ceil(count / cols), stones = [];
  for (let i = 0; i < count; i++) { const r = Math.floor(i / cols), c = i % cols, s = keep(stone(o.blank && o.blank(first + i) ? null : first + i));
    s.position.set((c - (cols - 1) / 2) * gap, 0, (r - (rows - 1) / 2) * 2.5); s.userData.n = first + i; stones.push(s); }
  const w = Math.min(count, cols) * gap, h = rows * 2.5;
  S.frame(V(0, 0.6, 0.3), w + (PORTRAIT ? 0.3 : 1.2), h + 3.2, V(0, PORTRAIT ? 0.95 : 0.72, 1));
  const rib = keep(pathRibbon(w + 2.4, h + 1.6)); rib.position.set(0, 0.015, (rows - 1) * 0 + 0);
  return stones;
}
/* HOP AHEAD: Mendy on `start`, "where after `hops` hops?" He taps a stone; Mendy hops to check. Returns true if right the first time. */
async function hopRound(start, hops, o = {}) {
  clearTemp(); G.q = (G.q || 0) + 1; G.ask = { kind: 'hop', start, hops, answer: start + hops };
  const first = start - (o.before != null ? o.before : 1), stones = pathOf(first, 10, { blank: o.blank ? (n => n !== start) : null });
  const at = n => stones[n - first];
  const BEH = V(0, 0.26, -0.75);
  const m = keep(addKid(S, o.who || 'mendy', at(start).position.clone().add(BEH))); m.scale.setScalar(0.7);
  const home = lightUp(at(start), '#7FD6FF');
  G.hit = { stone: n => sc(at(n), 0.3) };
  async function hopAlong(to, count) { for (let n = start + 1; n <= to; n++) { await hopTo(m, at(n).position.clone().add(BEH), 380, 0.9); chime('tap'); const f = floatNum(n, at(n).position.clone().add(V(0, 2.2, 0)), '#FFF3B0'); if (count) await say(String(n)); setTimeout(() => S.scene.remove(f), QUICK ? 60 : 900); } }
  if (o.demo) {
    await say('Watch me. I am on ' + start + '. I hop ' + hops + '.');
    m.act('point'); await say('I count on: ' + Array.from({ length: hops }, (_, i) => start + 1 + i).join(', ') + '.');
    await hopAlong(start + hops, false); lightUp(at(start + hops)); m.act('cheer'); await say('I land on ' + (start + hops) + '. Now you!'); await wait(500); return true;
  }
  await say((o.who === 'shmuel' ? 'Shmuel' : 'Mendy') + ' is on ' + start + '. Where after ' + hops + ' hops?', { cap: 'On ' + start + '. Hop ' + hops + '. Tap where he lands.' });
  G.state = 'ask';
  let firstTry = true;
  for (;;) {
    const n = await new Promise(res => { const t = S.onTap(stones, s => { t.enabled = false; res(s.userData.n); }); });
    G.state = 'busy'; chime('tap');
    if (n === start + hops) { await hopAlong(n, !QUICK && hops <= 4); lightUp(at(n)); m.act('cheer'); chime('good'); confetti(S, at(n).position.clone().add(V(0, 1.5, 0)), 40); await say(firstTry ? 'Yes! ' + n + '!' : 'There it is, ' + n + '!'); await wait(400); return firstTry; }
    firstTry = false; G.fixes++; shake(at(n));
    if (o.check) { await hopAlong(start + hops, false); lightUp(at(start + hops)); await say('He lands on ' + (start + hops) + '.'); await wait(300); return false; }
    await say('Let us count the hops together.');
    await hopAlong(start + hops, true); lightUp(at(start + hops), '#FFB0D8');
    await say(hops + ' hops from ' + start + ' is ' + (start + hops) + '.'); await wait(300);
    m.position.copy(at(start).position).add(BEH);
    await say('Your turn. Tap where he lands.'); G.state = 'ask';
  }
}
/* FIX THE WALL: a piece of the 120-chart wall (rows of 10) with gaps; he drags each loose stone into its gap */
async function wallRound(firstRow, rows, gapNums, o = {}) {
  if (gapNums.some(n => n < firstRow || n >= firstRow + rows * 10)) throw new Error('wall gap outside the wall: ' + gapNums);
  clearTemp(); G.q = (G.q || 0) + 1; G.ask = { kind: 'wall', gaps: gapNums.slice() };
  const bw = 1.9, bh = 1.05, wall = keep(new THREE.Group()), top = 1.4 + rows * bh, bricks = {}, holes = {};
  const brickM = [MATS.phys('#E7D6BA', { roughness: 0.75, clearcoat: 0.1 }), MATS.phys('#DCC8A6', { roughness: 0.75, clearcoat: 0.1 })], holeM = MATS.matte('#5E4B3A');
  const cap = new THREE.Mesh(new THREE.BoxGeometry(bw * 10 + 0.6, 0.3, 0.9), MATS.phys('#CDB894', { roughness: 0.8 })); cap.position.set(0, top + 0.15, -0.3); wall.add(cap);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(bw * 10 + 0.6, 1.4, 0.9), MATS.phys('#BFA982', { roughness: 0.85 })); foot.position.set(0, 0.7, -0.3); wall.add(foot);
  const posOf = n => { const i = n - firstRow, r = Math.floor(i / 10), c = i % 10; return V((c - 4.5) * bw, top - (r + 0.5) * bh, 0); };
  for (let i = 0; i < rows * 10; i++) { const n = firstRow + i, p = posOf(n);
    if (gapNums.includes(n)) { const h = new THREE.Mesh(new THREE.BoxGeometry(bw - 0.1, bh - 0.1, 0.2), holeM); h.position.copy(p).add(V(0, 0, -0.45)); wall.add(h); holes[n] = h; continue; }
    const b = brick(n, brickM[(i + Math.floor(i / 10)) % 2]); b.position.copy(p); wall.add(b); bricks[n] = b; }
  function brick(n, m) { const g = new THREE.Group(), b = new THREE.Mesh(new THREE.BoxGeometry(bw - 0.12, bh - 0.12, 0.7), m); b.position.z = -0.3; b.castShadow = !FAST; b.receiveShadow = true; g.add(b);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.92), new THREE.MeshStandardMaterial({ map: wideNum(n), transparent: true, roughness: 0.8 })); f.position.z = 0.06; g.add(f); g.userData.n = n; return g; }
  /* the loose stones lie in front, mixed up */
  const lo = gapNums.every(n => (n - firstRow) % 10 < 5), hi = gapNums.every(n => (n - firstRow) % 10 >= 5), half = lo ? -1 : 1, hx = PORTRAIT && (lo || hi) ? half * 2.5 * bw : 0;
  const LS = PORTRAIT ? 1.25 : 1.25, loose = shuffle(gapNums.slice()).map((n, i) => { const b = brick(n, MATS.phys('#FFE6B8', { roughness: 0.6, clearcoat: 0.3 })); b.scale.setScalar(LS);
    b.position.set(hx + (i - (gapNums.length - 1) / 2) * (PORTRAIT ? 2.45 : 2.9), PORTRAIT ? 1.0 : 0.75, 1.6); b.userData.home = b.position.clone(); keep(b); return b; });
  G.looseLeft = () => loose.filter(b => !b.userData.done).map(b => b.userData.n);
  const m = keep(addKid(S, 'mendy', PORTRAIT ? V(hx - half * 4.2, -0.2, 3.4) : V(bw * 5 + 1.6, 0, 1.4))); m.rotation.y = PORTRAIT ? half * 0.4 : -0.5; m.scale.setScalar(PORTRAIT ? 0.6 : 0.8);
  S.frame(V(hx, (top + 0.2) / 2 + (PORTRAIT ? -0.4 : 0.5), 0), PORTRAIT && hx ? bw * 5 + 0.2 : bw * 10 + 1.5, top + (PORTRAIT ? 2.6 : 2.4), V(0, 0.22, 1));
  G.hit = { loose: n => sc(loose.find(b => b.userData.n === n)), gap: n => { const v = posOf(n); const d = new THREE.Object3D(); d.position.copy(v).add(V(0, 0, 0.3)); S.scene.add(d); const r = sc(d); S.scene.remove(d); return r; } };
  if (o.demo) {
    await say('Watch me. Look at the stone before the gap.');
    const n = gapNums[0], b = loose.find(x => x.userData.n === n), left = bricks[n - 1] || bricks[n - 10];
    if (left) { const gg = lightUp(left, '#7FD6FF'); gg.rotation.x = 0; gg.position.z = 0.1; }
    await say(bricks[n - 1] ? (n - 1) + ', then ' + n + '. It goes here!' : 'Ten more than ' + (n - 10) + ' is ' + n + '.');
    await tween(700, u => b.position.lerpVectors(b.userData.home, posOf(n).clone().add(V(0, 0, 0.1)), u)); b.scale.setScalar(1); holes[n].visible = false; b.userData.done = true; chime('good');
    const b24 = bricks[n + 1]; if (b24 && bricks[n + 11] === undefined) { const g2 = lightUp(b24, '#7FD6FF'); g2.rotation.x = 0; g2.position.z = 0.1; await say('Ten more is right below. ' + (n + 1) + ', then ' + (n + 11) + '.'); b24.remove(g2); }
    await say('Now you! Drag the stones in.');
  } else await say(o.check ? 'Drag each stone into its gap.' : 'Some stones fell out. Drag each one home.');
  let miss = 0, left = loose.filter(b => !b.userData.done).length; G.state = 'ask';
  const plane = new THREE.Plane(V(0, 0, 1), -1.6);
  await new Promise(done => {
    S.onDrag(loose.filter(b => !b.userData.done), plane, {
      start: b => { if (b.userData.done) return; b.scale.setScalar(1.15); chime('tap'); },
      move: (b, p) => { if (!b.userData.done) b.position.set(p.x, p.y, 1.6); },
      drop: async b => { if (b.userData.done) return;
        let best = null, bd = 1e9; const cam = S.camera.position; gapNums.forEach(n => { if (!holes[n].visible) return; const g0 = posOf(n), dv = g0.clone().sub(cam), q = cam.clone().addScaledVector(dv, (1.6 - cam.z) / dv.z), d = Math.hypot(q.x - b.position.x, q.y - b.position.y); if (d < bd) { bd = d; best = n; } });
        if (best != null && bd < 1.6 && best === b.userData.n) { b.userData.done = true; await tween(250, u => b.position.lerp(posOf(best).clone().add(V(0, 0, 0.1)), u)); b.scale.setScalar(1); holes[best].visible = false; chime('good');
          if (--left === 0) { m.act('cheer'); confetti(S, V(0, top, 1), 50); await say(miss ? 'The wall is fixed!' : 'Perfect! The wall is fixed!'); done(); } return; }
        if (best == null || bd >= 1.6) { await tween(300, u => b.position.lerp(b.userData.home, u)); b.scale.setScalar(LS); return; }
        miss++; G.fixes++; await tween(300, u => b.position.lerp(b.userData.home, u)); b.scale.setScalar(LS);
        if (o.check) { await say('Not that gap.'); return; }
        const n = b.userData.n, hint = bricks[n - 1] ? 'It comes right after ' + (n - 1) + '.' : bricks[n - 10] ? 'It is ten more than ' + (n - 10) + '. Look up!' : 'Count along the row.';
        const hb = bricks[n - 1] || bricks[n - 10]; if (hb) { const gg = lightUp(hb, '#7FD6FF'); gg.rotation.x = 0; gg.position.z = 0.1; setTimeout(() => hb.remove(gg), QUICK ? 200 : 2500); }
        await say(hint, { cap: 'This stone is ' + n + '. ' + hint });
      } });
  });
  G.state = 'busy'; await wait(400); return miss;
}
/* CRATE COUNT: full crates of 10 and loose apples. He taps the crates (10, 20 ...) then the apples, then writes the number. */
async function crateRound(n, o = {}) {
  clearTemp(); G.q = (G.q || 0) + 1; G.ask = { kind: 'crates', answer: n };
  const tens = Math.floor(n / 10), ones = n % 10, per = PORTRAIT ? 4 : 6, rows = Math.ceil(tens / per) || 1;
  const crates = [], apples = [], RZ = PORTRAIT ? 2.3 : 1.7;
  for (let i = 0; i < tens; i++) { const c = keep(crate(10)), r = Math.floor(i / per), k = i % per, inRow = Math.min(per, tens - r * per);
    c.position.set((k - (inRow - 1) / 2) * 2.95, 0, -r * RZ - 1.2); crates.push(c);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.0, 1.3), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); hit.position.y = 0.4; c.add(hit); }
  for (let i = 0; i < ones; i++) { const a = keep(apple()); a.scale.setScalar(1.6); a.position.set((i - (ones - 1) / 2) * (PORTRAIT ? 0.9 : 1.05), 0.35, 1.3); apples.push(a);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); a.add(hit); }
  const w = Math.max(Math.min(tens, per) * 2.95, ones * 1.05, 6) + (PORTRAIT ? 1 : 5);
  const m = keep(addKid(S, o.who || 'mendy', PORTRAIT ? V(4.4, 0, -1.4 - rows * RZ) : V(-w / 2 + 0.6, 0, 1.4))); m.rotation.y = PORTRAIT ? -0.4 : 0.5; m.scale.setScalar(PORTRAIT ? 0.7 : 0.85);
  S.frame(V(PORTRAIT ? 0 : -1.5, 0.6, -(rows - 1) * RZ / 2 + 0.2), w, rows * RZ + 4.2, V(0, 0.85, 1));
  G.hit = { crate: i => sc(crates[i], 0.5), apple: i => sc(apples[i], 0.2) };
  let said = 0;
  const countTo = async (obj, k, saying) => { if (o.check) { chime('tap'); const gg = glow('#FFE27A', 2.2); gg.position.y = 0.05; obj.add(gg); return null; } const isC = crates.includes(obj), lab = floatNum(k, obj.position.clone().add(V(0, isC ? 1.5 : 0.95, isC ? -0.3 : 0))); lab.scale.setScalar(isC ? (PORTRAIT ? 1.25 : 1.2) : (PORTRAIT ? 0.95 : 0.78)); chime('tap'); if (saying) await say(String(k)); return lab; };
  if (o.demo) {
    await say('Watch me. Crates first: each crate has 10.');
    for (let i = 0; i < tens; i++) await countTo(crates[i], (i + 1) * 10, true);
    await say('Then the apples, one by one.');
    for (let i = 0; i < ones; i++) await countTo(apples[i], tens * 10 + i + 1, true);
    m.act('cheer'); await say(tens + (tens === 1 ? ' crate and ' : ' crates and ') + ones + ' apples make ' + n + '.'); await wait(400); clearLabels(); return true;
  }
  function clearLabels() { temp.filter(x => x.isSprite).forEach(x => S.scene.remove(x)); }
  await say(o.check ? 'How many apples? Count, then write it.' : 'Count the crates, then the apples. Tap each one.');
  G.state = 'tapcount';
  /* he taps every crate, then every apple; a crate tapped twice or an apple tapped too early gets a gentle word */
  const doneC = new Set(), doneA = new Set();
  await new Promise(res => {
    S.onTap(crates, async c => { if (doneC.has(c)) { say('You counted that crate.'); return; } doneC.add(c); await countTo(c, doneC.size * 10, !QUICK); if (doneC.size === tens && !ones) res(); else if (doneC.size === tens) say('Now the apples.'); });
    S.onTap(apples, async a => { if (doneC.size < tens) { say('Tens first! Tap the crates.'); return; } if (doneA.has(a)) return; doneA.add(a); await countTo(a, tens * 10 + doneA.size, !QUICK); if (doneA.size === ones) res(); });
  });
  S.clearInput(); G.state = 'write';
  clearLabels();
  await say('Write how many apples.', { cap: 'Write how many apples.' });
  let first = true;
  for (;;) {
    const v = await pad(3);
    if (v === n) { m.act('cheer'); chime('good'); confetti(S, V(0, 2, 0), 40); await say(first ? 'Yes! ' + n + ' apples!' : n + '! You got it.'); clearLabels(); await wait(300); return first; }
    first = false; G.fixes++;
    if (o.check) { await say('It is ' + n + '.'); clearLabels(); return false; }
    const cw = tens === 1 ? ' crate is ' : ' crates is '; await say(ones ? tens + cw + (tens * 10) + '. ' + ones + ' more is ' + n + '.' : tens + cw + n + '.');
    await say('Write ' + n + '.', { cap: tens + (tens === 1 ? ' ten and ' : ' tens and ') + ones + (ones === 1 ? ' one' : ' ones') });
  }
}
/* HEAR AND WRITE: the voice says a number; he writes it (the caption does not show it) */
async function hearRound(n, o = {}) {
  clearTemp(); G.q = (G.q || 0) + 1; G.ask = { kind: 'hear', answer: n };
  const s = keep(stone(null)); s.scale.setScalar(2.2); s.position.set(0, 0, 0); lightUp(s, '#FFE27A');
  const m = keep(addKid(S, 'mendy', V(-3.6, 0, 0.8))); m.scale.setScalar(0.8); m.rotation.y = 0.4; m.act('wave', 1.5);
  S.frame(V(-1, 0.8, 0), 9, 6, V(0, 0.9, 1));
  await say('Write ' + n + '.', { cap: 'Write the number you hear. Tap the speaker to hear it again.' });
  G.state = 'write';
  let first = true;
  for (;;) { const v = await pad(3); s.setNum(v);
    if (v === n) { chime('good'); m.act('cheer'); await say(first ? 'Yes! ' + n + '.' : 'You got it!'); await wait(300); return first; }
    first = false; G.fixes++; await wait(200); shake(s);
    if (o.check) { s.setNum(n); await say('It is ' + n + '.'); await wait(600); return false; }
    s.setNum(null); await say(n > 100 ? 'Not yet. A 1 for the hundred, then the rest.' : 'Not yet. Listen again.');
    await say('Write ' + n + '.', { cap: 'Write the number you hear.' }); }
}

/* ============================================================ the games ============================================================ */
async function opener() {
  G.name = 'opener'; dots(3, 0);
  G.how = { title: 'Counting past 100', steps: ['Listen to Mendy count.', 'Tap the stone that glows.', 'After 100, say "one hundred one", "one hundred two" ...'], say: 'Tap the glowing stone and say its number.' };
  const m = addKid(S, 'mendy', V(0, 0, 3)); m.scale.setScalar(0.9);
  S.frame(V(0, 1.2, 1.5), 7, 4.5, V(0, 0.3, 1), true);
  await say('Hi! I am Mendy. I am in first grade now!'); m.act('wave', 1.8);
  await say('Today we pick apples for Bubby\'s Shabbos cake!');
  await say('Today we count all the way to 120!');
  await say('Big numbers help us count lots of apples!');
  /* 1: tens up the hill */
  const tens = Array.from({ length: 10 }, (_, i) => (i + 1) * 10), row = [];
  const cols = PORTRAIT ? 5 : 10;
  tens.forEach((n, i) => { const s = keep(stone(n)); const r = Math.floor(i / cols), c = i % cols; s.position.set((c - (cols - 1) / 2) * 2.25, 0, (r - (Math.ceil(10 / cols) - 1) / 2) * 2.5 - 3); s.visible = false; row.push(s); });
  m.position.set(PORTRAIT ? 0 : -13, 0, PORTRAIT ? 1.2 : -3); m.rotation.y = PORTRAIT ? 0 : 0.9;
  S.frame(V(PORTRAIT ? 0 : -1, 0.7, -2.6), PORTRAIT ? 12 : 26, PORTRAIT ? 9 : 6, V(0, 0.75, 1));
  await say('First, by tens. Count with me!');
  for (const s of row) { s.visible = true; s.scale.setScalar(0.01); tween(300, u => s.scale.setScalar(u)); chime('tap'); await say(String(s.userData.n)); }
  dots(3, 1);
  /* 2: past 100, Watch me ... now you */
  clearTemp(); const past = [], cols2 = PORTRAIT ? 5 : 10;
  const all = Array.from({ length: 11 }, (_, i) => 100 + i);
  all.forEach((n, i) => { const s = keep(stone(i === 0 ? 100 : null)); const r = Math.floor(i / cols2), c = i % cols2; s.position.set((c - (Math.min(11, cols2) - 1) / 2) * 2.25, 0, r * 2.5 - 2); s.userData.n = n; past.push(s); });
  m.position.set(PORTRAIT ? -3.8 : -13.5, 0, PORTRAIT ? 5.2 : -1.5);
  S.frame(V(PORTRAIT ? 0 : -1.2, 0.6, PORTRAIT ? 0.6 : -1), PORTRAIT ? 12 : 27, PORTRAIT ? 10 : 7, V(0, 0.8, 1));
  await say('After 100, we keep going.');
  await say('Watch me. One hundred, then one hundred one!');
  past[1].setNum(101); lightUp(past[1]); chime('tap'); await say('101');
  past[2].setNum(102); lightUp(past[2]); chime('tap'); await say('102');
  await say('Now you! Tap the glowing stone.');
  G.state = 'tapnext';
  for (let i = 3; i < past.length; i++) {
    const s = past[i], g = lightUp(s, '#7FFFB0'); G.next = s.userData.n; G.hit = { next: () => sc(s, 0.3), prev: () => sc(past[i - 1], 0.3) };
    await new Promise(res => { const t = S.onTap(past, o => { if (o !== s) { say('Tap the glowing stone.'); return; } t.enabled = false; res(); }); });
    s.remove(g); s.setNum(s.userData.n); lightUp(s); chime('tap'); await say(String(s.userData.n));
  }
  S.clearInput(); dots(3, 2); m.act('cheer');
  /* 3: the pattern: 101-110 looks like 1-10 with a hundred in front */
  clearTemp();
  const cols3 = PORTRAIT ? 5 : 10, two = [];
  [[1, 10], [101, 110]].forEach(([a], r) => { for (let i = 0; i < 10; i++) { const s = keep(stone(a + i)); const rr = Math.floor(i / cols3), c = i % cols3; s.position.set((c - (cols3 - 1) / 2) * 2.25, 0, (r * (PORTRAIT ? 2 : 1) + rr) * 2.4 - 3); two.push(s); } });
  S.frame(V(0, 0.6, PORTRAIT ? 0.6 : -1.8), PORTRAIT ? 12 : 23.5, PORTRAIT ? 12 : 7, V(0, 0.9, 1));
  await say('See the pattern? 1, then 101.');
  for (let i = 0; i < 3; i++) { lightUp(two[i], '#7FD6FF'); lightUp(two[10 + i], '#7FD6FF'); await wait(500); }
  await say('A hundred in front, then the same numbers.');
  /* 4: 111 to 120, then he finishes the climb himself */
  clearTemp(); const top = [];
  for (let i = 0; i < 10; i++) { const n = 111 + i, s = keep(stone(null)); const rr = Math.floor(i / cols3), c = i % cols3; s.position.set((c - (cols3 - 1) / 2) * 2.25, 0, rr * 2.5 - 2); s.userData.n = n; top.push(s); }
  S.frame(V(0, 0.6, PORTRAIT ? 0.6 : -2), PORTRAIT ? 12 : 23.5, PORTRAIT ? 9 : 6, V(0, 0.8, 1));
  await say('Up to the top of the hill!');
  for (let i = 0; i < 7; i++) { top[i].setNum(top[i].userData.n); lightUp(top[i]); chime('tap'); await say(String(top[i].userData.n)); }
  await say('Now you! Finish the climb.');
  G.state = 'writenext';
  for (let i = 7; i < 10; i++) { const s = top[i], g = lightUp(s, '#7FFFB0'); G.next = s.userData.n;
    await say('What comes next? Write it.', { cap: 'What comes after ' + (s.userData.n - 1) + '? Write it.' });
    while ((await pad(3)) !== s.userData.n) { G.fixes++; await say('Count on from ' + (s.userData.n - 1) + '. Try again.'); }
    s.remove(g); s.setNum(s.userData.n); lightUp(s); chime('good'); await say(String(s.userData.n)); }
  S.clearInput(); G.state = 'busy';
  await say('120! The top of the hill!');
  /* 5: how a big number is written */
  clearTemp(); const w = keep(stone(113)); w.scale.setScalar(2.4); lightUp(w, '#FFE27A');
  S.frame(V(0, 0.6, 0), 8, 5, V(0, 0.9, 1));
  await say('We write one hundred thirteen like this: 113.');
  await say('A 1 for the hundred, then 13.');
  confetti(S, V(0, 2, 0), 60); m.act('cheer'); dots(3, 3);
  G.how = null; await wait(600);
  const r = await endScreen(3); if (r === 'replay') location.reload();
}
async function hop() {
  G.name = 'hop'; const R = 5; dots(R, 0);
  G.how = { title: 'Hop ahead', pic: PIC.hop, steps: ['Find the stone Mendy is on.', 'Count on, one hop at a time: 98, 99, 100 ...', 'Tap the stone where he lands.'], say: 'Start on his number. Count on each hop.' };
  await hopRound(46, 3, { demo: true }); dots(R, 1);
  let miss = 0, easy = false;
  const plan = [() => [rnd(21, 55), rnd(2, 4)], () => { const s = rnd(3, 8) * 10 + rnd(6, 8); return [s, rnd(3, 5)]; }, () => [rnd(95, 98), rnd(4, 6)], () => [rnd(104, 110), rnd(3, 5)]];
  for (let r = 0; r < plan.length; r++) {
    G.round = r; let [s, h] = plan[r](); if (easy) { h = Math.min(h, 3); s = Math.min(s, 90 - h); }
    if (s + h > 120) s = 120 - h;
    const ok = await hopRound(s, h); if (!ok) miss++; if (miss >= 2 && !easy) { easy = true; G.easy = true; await say('Let us take smaller hops.'); }
    dots(R, r + 2);
  }
  if (miss === 0) { G.bonus = true; await say('Bonus! The numbers are hiding.'); await hopRound(rnd(104, 112), 4, { blank: true }); }
  const st = easy ? Math.min(2, starsFor(miss, 4)) : starsFor(miss, 4);
  await say(st === 3 ? 'Amazing hopping!' : 'Great counting on!'); const r = await endScreen(st); if (r === 'replay') location.reload();
}
async function wall() {
  G.name = 'wall'; dots(3, 0);
  G.how = { title: 'Fix the wall', pic: PIC.wall, steps: ['Look at the stone before the gap: one more comes next.', 'Or look up: the stone below is ten more.', 'Drag the stone into its gap.'], say: 'One more is next. Ten more is right below.' };
  const sets = [[21, 3, [23, 34, 45]], [61, 3, [76, 77, 89]], [91, 3, [99, 108, 116, 120]]];
  let miss = 0;
  for (let r = 0; r < sets.length; r++) { G.round = r; let [a, rows, gaps] = sets[r]; if (r === 2 && miss >= 2) { gaps = gaps.slice(0, 2); G.easy = true; await say('Just two stones this time.'); } miss += await wallRound(a, rows, gaps, { demo: r === 0 }); dots(3, r + 1); }
  const st = starsFor(miss, 6); const e = await endScreen(st); if (e === 'replay') location.reload();
}
async function crates() {
  G.name = 'crates'; const R = 5; dots(R, 0);
  G.how = { title: 'Crate count', pic: PIC.crates, steps: ['Each crate has 10 apples.', 'Tap the crates: 10, 20, 30 ...', 'Then tap the apples: 31, 32 ...', 'Write the number.'], say: 'Count the crates by tens, then the apples by ones.' };
  await crateRound(23, { demo: true }); dots(R, 1);
  let miss = 0; const ns = [rnd(3, 4) * 10 + rnd(1, 9), rnd(6, 8) * 10 + rnd(1, 9), 110 + rnd(1, 6)];
  for (let r = 0; r < ns.length; r++) { G.round = r; if (r === 2 && miss >= 2) { ns[2] = rnd(5, 9) * 10 + rnd(1, 9); G.easy = true; await say('Let us try a smaller one.'); } if (!(await crateRound(ns[r]))) miss++; dots(R, r + 2); }
  G.round = 3; await say('Now listen, and write the number.'); if (!(await hearRound(100 + rnd(1, 19)))) miss++; dots(R, 5);
  const st = starsFor(miss, 4); await say(st === 3 ? 'You count like a farmer!' : 'Great counting!'); const e = await endScreen(st); if (e === 'replay') location.reload();
}
async function mistake() {
  G.name = 'mistake'; const R = 3; dots(R, 0);
  G.how = { title: 'Find the mistake', pic: PIC.mistake, steps: ['Count along the stones.', 'Tap the stone that is wrong.', 'Write the right number.'], say: 'Count along. Tap the wrong stone, then fix it.' };
  const b0 = rnd(2, 4), t1 = rnd(1, 4), b1 = rnd(1, 3), t2 = rnd(5, 9), b2 = rnd(1, 4);
  const rowOf = (start, bad, wrong) => Array.from({ length: 6 }, (_, i) => i === bad ? wrong : start + i);
  const rounds = [
    { row: rowOf(110 - b0, b0, 200), bad: b0, right: 110, line: 'Shmuel counted. Tap the wrong stone.' },
    { row: rowOf(100 + t1 - b1, b1, 1000 + t1), bad: b1, right: 100 + t1, line: 'Shmuel wrote these. Find the wrong one.' },
    { row: rowOf(100 + t2 - b2, b2, 1000 + t2), bad: b2, right: 100 + t2, line: 'Shmuel wrote numbers past 100. Find the wrong stone.' }];
  let miss = 0;
  for (let r = 0; r < rounds.length; r++) {
    clearTemp(); G.round = r; const q = rounds[r]; G.q = (G.q || 0) + 1; G.ask = { kind: 'mistake', bad: q.bad, answer: q.right };
    const cols = PORTRAIT ? 3 : 6, stones = q.row.map((n, i) => { const s = keep(stone(n)); s.scale.setScalar(1.2); const rr = Math.floor(i / cols), c = i % cols; s.position.set((c - (cols - 1) / 2) * 2.7, 0, rr * 2.8 - 1); return s; });
    const sh = keep(addKid(S, 'shmuel', V(PORTRAIT ? 0 : -8.8, 0, PORTRAIT ? 5.6 : 0.4))); sh.scale.setScalar(PORTRAIT ? 0.7 : 0.85); sh.rotation.y = PORTRAIT ? 0 : 0.5;
    S.frame(V(PORTRAIT ? 0 : -1.4, 0.8, PORTRAIT ? 1.2 : -0.6), PORTRAIT ? 9 : 20, PORTRAIT ? 9 : 6, V(0, 0.75, 1));
    keep(pathRibbon(PORTRAIT ? 9 : 17, PORTRAIT ? 7 : 3.4)).position.set(0, 0.015, PORTRAIT ? 0.4 : -1);
    G.hit = { stone: i => sc(stones[i], 0.3) };
    sh.act('think', 2); await say(q.line, q.cap ? { cap: q.cap } : {});
    let first = true; G.state = 'find';
    for (;;) { const i = await new Promise(res => { const t = S.onTap(stones, s => { t.enabled = false; G.state = 'busy'; res(stones.indexOf(s)); }); });
      if (i === q.bad) { chime('good'); lightUp(stones[i], '#FFB0D8'); await say('You found it!'); break; }
      first = false; G.fixes++; lightUp(stones[i], '#7FD6FF'); await say('That one is right. Count along with me.');
      for (let k = 0; k < q.bad; k++) { chime('tap'); await say(String(q.row[k])); } await say('What comes next?'); G.state = 'find'; }
    G.state = 'write'; await say('Write the right number.', { cap: 'Write the right number for the pink stone.' });
    for (;;) { const v = await pad(4); if (v === q.right) { stones[q.bad].setNum(v); sh.act('cheer'); confetti(S, stones[q.bad].position.clone().add(V(0, 1, 0)), 40); await say('Yes! ' + v + '. Thank you!'); break; }
      first = false; G.fixes++; await say(q.right === 110 ? 'What comes after 109? Try again.' : 'A 1 for the hundred, then the small number.'); }
    if (!first) miss++; dots(R, r + 1); await wait(300);
  }
  const st = starsFor(miss, 3); const e = await endScreen(st); if (e === 'replay') location.reload();
}
/* three gaps in one half of a 3-row wall: one in each row, the last one a step to the side (next, ten more, ten more and one) */
function gapsIn(first) { const c = rnd(0, 3) + (Math.random() < 0.5 ? 0 : 5); return [first + c, first + 10 + c, first + 21 + c]; }
async function check() {
  G.name = 'check'; document.getElementById('help').classList.add('off'); const R = 8; dots(R, 0);
  await say('The big check! Do your best. No help this time.');
  const items = shuffle([
    () => hopRound(rnd(64, 85), rnd(3, 5), { check: true }),
    () => { const s = rnd(96, 99); return hopRound(s, rnd(Math.max(3, 101 - s), 6), { check: true }); },
    async () => (await wallRound(41, 3, gapsIn(41), { check: true })) === 0,
    async () => (await wallRound(91, 3, gapsIn(91), { check: true })) === 0,
    () => crateRound(rnd(4, 9) * 10 + rnd(1, 9), { check: true }),
    () => crateRound(100 + rnd(11, 19), { check: true }),
    () => hearRound(100 + rnd(1, 9), { check: true }),
    () => hearRound(110 + rnd(1, 9), { check: true })]);
  let right = 0;
  const missed = {};
  for (let i = 0; i < items.length; i++) { G.round = i; if (await items[i]()) right++; else { const g = { hop: 'hop', wall: 'wall', crates: 'crates', hear: 'crates' }[G.ask.kind]; missed[g] = (missed[g] || 0) + 1; } dots(R, i + 1); }
  G.right = right; G.mastered = right >= 7;
  clearTemp(); const m = keep(addKid(S, 'mendy', V(PORTRAIT ? 0 : -3.2, 0, 0))); m.rotation.y = PORTRAIT ? 0 : 0.4; S.frame(V(0, PORTRAIT ? -0.6 : 1.4, 0), 10, 7, V(0, 0.45, 1));
  if (G.mastered) { m.act('cheer', 3); confetti(S, V(0, 3, 0), 80); await say('You did it! You count to 120!'); }
  else { m.act('wave', 2); await say('Good work! Let us practice and try again.');
    G.practice = Object.keys(missed).sort((a, b) => missed[b] - missed[a])[0] || 'hop';   /* the game for what he missed most */ document.getElementById('onward').href = 'unit1.html?g=' + G.practice; }
  const e = await endScreen(right === 8 ? 3 : right === 7 ? 2 : 1); if (e === 'replay') location.reload();
}
async function review() {
  G.name = 'review'; const R = 6; dots(R, 0);
  G.how = { title: 'Review', steps: ['Listen to each question.', 'Hop, drag, count or write.', 'Use what you learned in kindergarten!'], say: 'Listen, then show what you know.' };
  await say('Let us remember kindergarten!');
  const items = [
    () => crateRound(10 + rnd(3, 9)),            /* teen numbers: ten and some more */
    () => crateRound(rnd(5, 9) * 10),            /* counting by tens */
    () => hopRound(rnd(3, 6), rnd(2, 4), { before: 1 }),   /* adding within 10 on the path */
    async () => (await wallRound(1, 3, [12, 23, 25])) === 0,
    () => hearRound(10 + rnd(1, 9)),
    () => hopRound(rnd(4, 7), 3, { before: 1 })];
  let miss = 0; for (let i = 0; i < items.length; i++) { G.round = i; if (!(await items[i]())) miss++; dots(R, i + 1); }
  const e = await endScreen(starsFor(miss, 6)); if (e === 'replay') location.reload();
}

const RUN = { hill, opener, hop, wall, crates, mistake, check, review };
(async () => {
  if (GAME !== 'hill' && !QUICK) { G.name = 'start'; await goButton(); }   /* a tap first, so the voice may speak */
  await (RUN[GAME] || hill)();
})().catch(e => { G.err = String(e && e.stack || e); console.error(e); });
