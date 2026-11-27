/* Kindergarten Shapes 3D kit (v2/curriculum/k-shapes/MAP.md). Every shape game is built from this one file, so they all look,
   sound and teach the same way:  learn (count sides and corners; HE taps them) -> chant (he claps) -> turned / small is still the same
   -> "watch me" (a hand drags one piece) -> he drags each piece into its box (a wrong piece is explained by its rule and goes back;
   2 misses: the rule is taught again; idle: the hand points; quick boys: a bonus round) -> find a friend's mistake -> stars.
   A game is a small config: see find-*.html. No reading needed: every word is spoken; "hear it again" repeats it.
   All art is drawn here in 3D (three.js, MIT licence, lib/). ?fast=1 = no waiting (for the automatic test). */
import * as THREE from 'three';
import { RoomEnvironment } from './lib/RoomEnvironment.js';
import { RoundedBoxGeometry } from './lib/RoundedBoxGeometry.js';
import { createLook } from './look.js';

/* ================= shapes ================= */
export const KINDS = {
  tri:      { pts: [[-0.78, -0.62], [0.78, -0.62], [0, 0.72]], name: 'triangle' },
  triTall:  { pts: [[-0.42, -0.82], [0.42, -0.82], [0.05, 0.86]], name: 'triangle' },
  triRight: { pts: [[-0.62, -0.62], [0.66, -0.62], [-0.62, 0.66]], name: 'triangle' },
  triWide:  { pts: [[-0.95, -0.38], [0.95, -0.38], [0.32, 0.46]], name: 'triangle' },
  triSkinny:{ pts: [[-0.3, -0.85], [0.28, -0.85], [0.62, 0.85]], name: 'triangle' },
  halfSq:   { pts: [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6]], name: 'triangle' },
  square:   { pts: [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]], name: 'square' },
  rect:     { pts: [[-0.92, -0.46], [0.92, -0.46], [0.92, 0.46], [-0.92, 0.46]], name: 'rectangle' },
  rectLong: { pts: [[-1.0, -0.28], [1.0, -0.28], [1.0, 0.28], [-1.0, 0.28]], name: 'rectangle' },
  rectFat:  { pts: [[-0.8, -0.55], [0.8, -0.55], [0.8, 0.55], [-0.8, 0.55]], name: 'rectangle' },
  lean:     { pts: [[-1.0, -0.42], [0.45, -0.42], [1.0, 0.42], [-0.45, 0.42]], name: 'leaning shape' },   /* long and short sides that are clearly different (1.45 and 1.0): never "four sides the same" */
  kite:     { pts: [[0, -1.05], [0.55, 0.2], [0, 0.6], [-0.55, 0.2]], name: 'kite' },   /* clearly longer at the bottom: never mistaken for a square on its corner */
  pent:     { pts: [[0.0, 0.72], [-0.685, 0.222], [-0.423, -0.582], [0.423, -0.582], [0.685, 0.222]], name: 'pentagon' },
  oct:      { pts: [[0.665, 0.276], [0.276, 0.665], [-0.276, 0.665], [-0.665, 0.276], [-0.665, -0.276], [-0.276, -0.665], [0.276, -0.665], [0.665, -0.276]], name: 'octagon' },
  star:     { pts: [[0.0, 0.7], [-0.176, 0.243], [-0.666, 0.216], [-0.285, -0.093], [-0.411, -0.566], [-0.0, -0.3], [0.411, -0.566], [0.285, -0.093], [0.666, 0.216], [0.176, 0.243]], name: 'star' },
  hex:      { pts: [[0.68, 0], [0.34, 0.59], [-0.34, 0.59], [-0.68, 0], [-0.34, -0.59], [0.34, -0.59]], name: 'hexagon' },
  circle:   { circle: 0.66, name: 'circle' },
  sphere:   { solid: 'sphere', name: 'sphere' },
  cube:     { solid: 'cube', name: 'cube' },
  cyl:      { solid: 'cyl', name: 'cylinder' },
  cone:     { solid: 'cone', name: 'cone' },
  oval:     { oval: [0.9, 0.5], name: 'oval' },
  semi:     { semi: 0.75, name: 'half circle' },
  curvy:    { curvy: true, name: 'curvy shape' }
};
export const FAMILY = k => KINDS[k].name;   /* 'triangle', 'square', ... */
const COLORS = ['#E03A33', '#1F6FEB', '#F2A900', '#12A766', '#7C4DFF', '#FF7A1A', '#00A3B8', '#F0458E'];
function shapeOf(k) {
  const K = KINDS[k], s = new THREE.Shape();
  /* round shapes are drawn from points with no repeated start point: a full arc repeats it, and the bevel made a little notch there (a "corner" on a circle; review 2) */
  const round = (rx, ry) => { const N = 120; s.moveTo(rx, 0); for (let i = 1; i < N; i++) s.lineTo(Math.cos(i / N * Math.PI * 2) * rx, Math.sin(i / N * Math.PI * 2) * ry); s.closePath(); return { s, corners: [] }; };
  if (K.circle) return round(K.circle, K.circle);
  if (K.oval) return round(K.oval[0], K.oval[1]);
  if (K.semi) { const r = K.semi; s.moveTo(-r, -r / 2.4); s.absarc(0, -r / 2.4, r, Math.PI, 0, true); s.lineTo(-r, -r / 2.4); return { s, corners: [[-r, -r / 2.4], [r, -r / 2.4]] }; }
  if (K.curvy) {   /* looks like a triangle, but its sides bulge out */
    const a = [-0.78, -0.62], b = [0.78, -0.62], c = [0, 0.74];
    s.moveTo(a[0], a[1]); s.quadraticCurveTo(0, -1.3, b[0], b[1]); s.quadraticCurveTo(1.0, 0.36, c[0], c[1]); s.quadraticCurveTo(-1.0, 0.36, a[0], a[1]);   /* every side bulges clearly, the bottom too (review round 2: it read as a straight bottom) */
    return { s, corners: [] };
  }
  /* centred on the average of its corners, so a finger on its middle always grabs it */
  const cx = K.pts.reduce((t, p) => t + p[0], 0) / K.pts.length, cy = K.pts.reduce((t, p) => t + p[1], 0) / K.pts.length;
  const pts = K.pts.map(p => [p[0] - cx, p[1] - cy]);
  pts.forEach((p, i) => i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])); s.closePath();
  return { s, corners: pts };
}
/* a flat picture of a shape, for buttons */
const DOTS = { 0: [], 1: [[0, 0]], 2: [[-0.4, 0], [0.4, 0]], 3: [[-0.45, -0.3], [0.45, -0.3], [0, 0.42]], 4: [[-0.4, -0.4], [0.4, -0.4], [0.4, 0.4], [-0.4, 0.4]],
  5: [[-0.45, -0.4], [0.45, -0.4], [0.45, 0.4], [-0.45, 0.4], [0, 0]], 6: [[-0.45, -0.45], [0, -0.45], [0.45, -0.45], [-0.45, 0.45], [0, 0.45], [0.45, 0.45]] };
export function iconSVG(k, fill, cross) {
  if (k === 'cupcakes') return '<svg viewBox="0 0 64 64">' + [14, 32, 50].map((x, i) => '<path d="M' + (x - 8) + ' 40 L' + (x + 8) + ' 40 L' + (x + 6) + ' 54 L' + (x - 6) + ' 54Z" fill="' + fill + '" opacity=".55"/><circle cx="' + x + '" cy="' + (34 - i % 2 * 0) + '" r="9" fill="' + fill + '"/><circle cx="' + x + '" cy="26" r="5" fill="' + fill + '"/>').join('') + (cross ? '<path d="M10 10 L54 54" stroke="#E0574F" stroke-width="7" stroke-linecap="round"/>' : '') + '</svg>';
  if (k === 'train') return '<svg viewBox="0 0 64 64">' + [4, 24, 44].map(x => '<rect x="' + x + '" y="24" width="17" height="16" rx="3" fill="' + fill + '"/><circle cx="' + (x + 5) + '" cy="44" r="3.5" fill="' + fill + '"/><circle cx="' + (x + 12) + '" cy="44" r="3.5" fill="' + fill + '"/>').join('') + '<path d="M4 50 H60" stroke="' + fill + '" stroke-width="3"/>' + (cross ? '<path d="M10 10 L54 54" stroke="#E0574F" stroke-width="7" stroke-linecap="round"/>' : '') + '</svg>';
  if (k === 'beads') return '<svg viewBox="0 0 64 64"><path d="M6 32 H58" stroke="' + fill + '" stroke-width="3"/>' + [12, 25, 39, 52].map((x, i) => '<circle cx="' + x + '" cy="32" r="' + (i % 2 ? 6 : 8) + '" fill="' + fill + '"/>').join('') + (cross ? '<path d="M10 10 L54 54" stroke="#E0574F" stroke-width="7" stroke-linecap="round"/>' : '') + '</svg>';
  if (/^dots\d$/.test(k)) {   /* a number of dots ("how many corners"); none = an empty ring */
    const n = +k[4], d = n ? DOTS[n].map(p => '<circle cx="' + (32 + p[0] * 26).toFixed(1) + '" cy="' + (32 - p[1] * 26).toFixed(1) + '" r="7" fill="' + fill + '"/>').join('') : '<circle cx="32" cy="32" r="20" fill="none" stroke="' + fill + '" stroke-width="6"/>';
    return '<svg viewBox="0 0 64 64">' + d + (cross ? '<path d="M10 10 L54 54" stroke="#E0574F" stroke-width="7" stroke-linecap="round"/>' : '') + '</svg>';
  }
  const K = KINDS[k]; let d = '';
  if (K.solid) {   /* simple pictures of the solid shapes */
    const sh = { sphere: '<circle cx="32" cy="32" r="22" fill="F"/><ellipse cx="25" cy="24" rx="6" ry="4" fill="#fff" opacity=".5"/>',
      cube: '<path d="M32 8 L54 20 L54 44 L32 56 L10 44 L10 20Z" fill="F"/><path d="M10 20 L32 32 L54 20 M32 32 L32 56" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>',
      cyl: '<path d="M14 16 L14 48 A18 7 0 0 0 50 48 L50 16Z" fill="F"/><ellipse cx="32" cy="16" rx="18" ry="7" fill="F" stroke="#fff" stroke-width="3" opacity=".9"/>',
      cone: '<path d="M32 6 L52 50 A20 7 0 0 1 12 50Z" fill="F"/><path d="M12 50 A20 7 0 0 0 52 50" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>' }[K.solid];
    return '<svg viewBox="0 0 64 64">' + sh.split('"F"').join('"' + fill + '"') + (cross ? '<path d="M10 10 L54 54" stroke="#E0574F" stroke-width="7" stroke-linecap="round"/>' : '') + '</svg>';
  }
  if (K.circle) d = '<circle cx="32" cy="32" r="22" fill="' + fill + '"/>';
  else if (K.pts) d = '<path d="M' + K.pts.map(p => (32 + p[0] * 26).toFixed(1) + ' ' + (34 - p[1] * 26).toFixed(1)).join(' L') + 'Z" fill="' + fill + '" stroke-linejoin="round"/>';
  return '<svg viewBox="0 0 64 64">' + d + (cross ? '<path d="M10 10 L54 54" stroke="#E0574F" stroke-width="7" stroke-linecap="round"/>' : '') + '</svg>';
}

/* ================= the game ================= */
export function startGame(cfg) {
  const FAST = /[?&]fast=1/.test(location.search);
  const SHOT = FAST && /[?&]shot=1/.test(location.search);   /* pictures only (v2/screens/k-shapes-graphics/shoot.js): test speed, but the full look */
  if (FAST) document.documentElement.classList.add('fast');
  document.body.insertAdjacentHTML('afterbegin', `
<canvas id="view"></canvas>
<div class="hud">
  <button class="btn" id="again" aria-label="Hear it again"><svg viewBox="0 0 48 48"><path d="M8 18h8l11-9v30l-11-9H8z" fill="#1F2A44"/><path d="M33 16c3 2 5 5 5 8s-2 6-5 8M37 10c5 3 8 8 8 14s-3 11-8 14" stroke="#1F2A44" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg></button>
  <div class="mid"><div class="gtitle" id="gtitle"></div><div class="dots" id="dots" aria-hidden="true"></div></div>
  <div style="width:84px"></div>
</div>
<button class="btn" id="start" aria-label="Start"><svg viewBox="0 0 48 48"><path d="M16 10 L38 24 L16 38Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg></button>
<svg id="hand" viewBox="-50 -60 100 110"><path d="M-10 0 L-10 -46 C-10 -56 6 -56 6 -46 L6 -22 L6 -26 C6 -34 20 -34 20 -26 L20 -20 C20 -28 34 -28 34 -20 L34 -14 C34 -22 46 -22 46 -14 L46 14 C46 36 30 46 12 46 L0 46 C-12 46 -18 38 -24 30 L-40 6 C-46 -2 -36 -10 -28 -4 L-10 10Z" fill="#FFFFFF" stroke="#1F2A44" stroke-width="4" stroke-linejoin="round"/></svg>
<div class="judge" id="judge">
  <button class="btn yesB" aria-label="yes" style="background:#E3F6EA;box-shadow:0 6px 0 #9ED9B5"><svg viewBox="0 0 48 48"><path d="M10 25 L20 35 L38 13" stroke="#1E9E5A" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  <button class="btn noB" aria-label="no" style="background:#FDE8E6;box-shadow:0 6px 0 #F2B8B2"><svg viewBox="0 0 48 48"><path d="M13 13 L35 35 M35 13 L13 35" stroke="#E0574F" stroke-width="7" fill="none" stroke-linecap="round"/></svg></button>
</div>
<div class="end" id="end"><div class="stars" id="stars"></div>
  <button class="btn" id="replay" aria-label="Play again"><svg viewBox="0 0 48 48"><path d="M36 16 A14 14 0 1 0 38 28" stroke="#1F2A44" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 8 L38 16 L28 20Z" fill="#1F2A44"/></svg></button></div>
<button class="btn" id="clapBtn" aria-label="Clap"><svg viewBox="0 0 64 64"><g fill="#F2C9A0" stroke="#B5742A" stroke-width="2.5" stroke-linejoin="round"><path d="M18 52 C10 44 8 34 12 24 L20 12 C22 9 26 10 25 14 L22 22 L30 8 C32 5 36 7 34 11 L28 24 L36 10 C38 7 42 9 40 13 L33 27 L39 18 C41 15 45 17 43 21 L36 36 C34 44 28 52 18 52Z"/></g><path d="M46 8 l4 -4 M52 14 l6 -2 M50 22 l6 2" stroke="#F5B400" stroke-width="3.5" stroke-linecap="round"/></svg></button>
<div id="nogl">This computer cannot show the 3D game.</div>`);
  const $ = s => document.querySelector(s);
  $('#gtitle').textContent = cfg.title || document.title;   /* the game's name is always on screen (K-CLARITY-RULES 13) */
  const facers = [], _fq = new THREE.Quaternion(), solidLabels = [];   /* solidLabels: on a phone they float over their own box, never between two rows */   /* box labels that always face the camera (a circle label never looks like an oval, K-CLARITY-RULES 9) */
  const W = window.__shp = { hasBonus: !!(cfg.bonus || cfg.bonusRounds), hasChant: !!(cfg.fixLesson || cfg.patternLesson || (cfg.lessons || []).some(l => l.chant)), nb: cfg.boxes.length, game: cfg.id, name: 'start', misses: 0, stars: 0, said: [], done: false, again: 0, found: 0, ready: false };
  const wait = ms => new Promise(r => setTimeout(r, FAST ? 0 : ms));
  const NB = cfg.boxes.length;
  const sortBox = (color, scale) => cfg.boxes.findIndex(b => cfg.sortBy === 'color' ? b.acceptColor === color : (scale >= 0.85) === (b.acceptSize === 'big'));
  const boxOf = k => cfg.boxes.findIndex(b => b.accept.includes(k));   /* the box a piece belongs in, or -1 */

  /* ---------- the 3D room ---------- */
  const canvas = $('#view');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: FAST }); }
  catch (e) { $('#nogl').style.display = 'grid'; $('#start').style.display = 'none'; throw e; }
  /* the automatic test (?fast=1) draws at low detail: test machines have no graphics card. A boy always gets full detail. */
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  /* the new look (look.js): a game with cfg.world gets the rich world, light, characters and effects. Others keep the first look. */
  /* the automatic game test (?fast=1) plays on the first plain look, so it stays quick on a test machine; look=1 (v2/tests/k-shapes-look.js) and pictures (shot=1) use the new look */
  const LOOKTEST = FAST && /[?&]look=1/.test(location.search);
  const PARENTS = /[?&]parents=1/.test(location.search);
  const LK = cfg.world && (!FAST || SHOT || LOOKTEST || cfg.id === 'triangles') ? createLook({ renderer, scene, camera, FAST: FAST && !SHOT, world: cfg.world }) : null;
  if (LK) document.body.classList.add('world');
  const PAL = LK ? ['#FF3B30', '#2F80FF', '#FFC21A', '#1DC77A', '#9A5BFF', '#FF8A1F', '#00C3D6', '#FF4FA0'] : COLORS;
  if (LK) { LK.buildWorld(); const add0 = scene.add.bind(scene); scene.add = (...os) => { os.forEach(o => LK.toyify(o)); return add0(...os); }; } else {
  renderer.setPixelRatio(FAST ? 0.5 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene.background = new THREE.Color('#F6EBDA'); scene.fog = new THREE.Fog('#F6EBDA', 22, 48);
  scene.add(new THREE.HemisphereLight('#FFF6E8', '#C9B48E', 0.7));
  const sun = new THREE.DirectionalLight('#FFF1DC', 2.2);
  sun.position.set(-5, 11, 7); sun.castShadow = true; sun.shadow.mapSize.set(FAST ? 512 : 2048, FAST ? 512 : 2048); sun.shadow.radius = 6; sun.shadow.bias = -0.0004;
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 }); scene.add(sun);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: '#E9D7B6', roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 0.06, 96), new THREE.MeshStandardMaterial({ color: cfg.rug || '#BFE0D2', roughness: 0.9 }));
  rug.position.y = 0.03; rug.receiveShadow = true; scene.add(rug);
  const rugRing = new THREE.Mesh(new THREE.TorusGeometry(5.9, 0.08, 12, 128), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.8 }));
  rugRing.rotation.x = Math.PI / 2; rugRing.position.y = 0.07; scene.add(rugRing);
  { const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 14), new THREE.MeshStandardMaterial({ color: '#F4E3C6', roughness: 0.95 }));
    wall.position.set(0, 7, -8.5); wall.receiveShadow = true; scene.add(wall);
    const base = new THREE.Mesh(new THREE.BoxGeometry(60, 0.5, 0.2), new THREE.MeshStandardMaterial({ color: '#C99A67', roughness: 0.7 })); base.position.set(0, 0.25, -8.4); scene.add(base);
    const frame = new THREE.Mesh(new RoundedBoxGeometry(4.6, 3.4, 0.3, 3, 0.1), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.5 })); frame.position.set(-4.5, 4.4, -8.4); scene.add(frame);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.8), new THREE.MeshStandardMaterial({ color: '#BFE3FF', emissive: '#CFEAFF', emissiveIntensity: 0.6 })); glass.position.set(-4.5, 4.4, -8.24); scene.add(glass);
    const bar = new THREE.MeshStandardMaterial({ color: '#FFFFFF' });
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.8, 0.1), bar); b1.position.set(-4.5, 4.4, -8.2); scene.add(b1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.14, 0.1), bar); b2.position.set(-4.5, 4.4, -8.2); scene.add(b2);
    const shelfM = new THREE.MeshStandardMaterial({ color: '#B87842', roughness: 0.6 });
    [1.6, 3.2].forEach(y => { const sh = new THREE.Mesh(new RoundedBoxGeometry(4.2, 0.16, 0.9, 2, 0.05), shelfM); sh.position.set(4.5, y, -8.0); sh.castShadow = true; scene.add(sh); });
    const spines = ['#7A1F2B', '#1F3A6B', '#2E5D3A', '#5B2A6E', '#8A5A1E', '#1F3A6B', '#7A1F2B', '#2E5D3A'];
    [1.68, 3.28].forEach((y, r) => { let x = 2.7; spines.forEach((c, i) => { const h = 0.95 + ((i * 7 + r * 3) % 4) * 0.08, w = 0.28 + (i % 3) * 0.05;
      const bk = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.7, 2, 0.03), new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })); bk.position.set(x + w / 2, y + h / 2, -8.0); bk.castShadow = true; scene.add(bk);
      const gold = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.05, 0.01), new THREE.MeshStandardMaterial({ color: '#E8C36A', metalness: 0.6, roughness: 0.3 })); gold.position.set(x + w / 2, y + h * 0.7, -7.64); scene.add(gold);
      x += w + 0.04; }); }); }
  }

  /* ---------- the toy boxes (one, or one per shape for the sorter), each with its shape painted on the front ---------- */
  const BM = LK ? LK.boxMats() : null;
  const wood = BM ? BM.body : new THREE.MeshStandardMaterial({ color: '#D49A5E', roughness: 0.55 }), woodDark = BM ? BM.inside : new THREE.MeshStandardMaterial({ color: '#8A5A33', roughness: 0.7 });
  const BX = NB === 1 ? { w: 3.0, d: 1.9, h: 0.95, t: 0.16 } : { w: 2.25, d: 1.55, h: 0.8, t: 0.14 };
  const boxes = cfg.boxes.map(bc => {
    const g = new THREE.Group(); scene.add(g); if (bc.boxScale) g.scale.setScalar(bc.boxScale);   /* Big and small: the big box is big, the small box is small (review 2) */
    const plank = (w, h, d, x, y, z, m) => { const p = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, 0.05), m || wood); p.position.set(x, y, z); p.castShadow = true; p.receiveShadow = true; g.add(p); };
    plank(BX.w, 0.14, BX.d, 0, 0.07, 0, woodDark);
    plank(BX.w, BX.h, BX.t, 0, BX.h / 2, -BX.d / 2 + BX.t / 2);
    plank(BX.w, BX.h * 0.8, BX.t, 0, BX.h * 0.4, BX.d / 2 - BX.t / 2);
    plank(BX.t, BX.h, BX.d, -BX.w / 2 + BX.t / 2, BX.h / 2, 0);
    plank(BX.t, BX.h, BX.d, BX.w / 2 - BX.t / 2, BX.h / 2, 0);
    if (BM) { plank(BX.w + 0.06, 0.1, BX.t + 0.06, 0, BX.h, -BX.d / 2 + BX.t / 2, BM.rim); plank(BX.w + 0.06, 0.1, BX.t + 0.06, 0, BX.h * 0.8, BX.d / 2 - BX.t / 2, BM.rim);
      plank(BX.t + 0.06, 0.1, BX.d + 0.06, -BX.w / 2 + BX.t / 2, BX.h, 0, BM.rim); plank(BX.t + 0.06, 0.1, BX.d + 0.06, BX.w / 2 - BX.t / 2, BX.h, 0, BM.rim); }
    if (LK && LK.treasures.decorBox) LK.treasures.decorBox(g, BX);   /* the box belongs to the world: a farm wagon, a treasure chest, a pastry box ... */
    if (cfg.sortBy === 'color' && bc.color) {   /* sorting by colour: the whole box is painted its colour, so the boy sees at once which box is red, blue or yellow (Esti, 2026-11-27) */
      const hsl = {}; new THREE.Color(bc.color).getHSL(hsl); const col = hsl.h > 0.1 && hsl.h < 0.2 ? '#FFEE00' : bc.color;   /* yellow stays yellow (the light would turn it orange) */
      const cm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.45, toneMapped: false }), cin = new THREE.MeshStandardMaterial({ color: col, roughness: 0.8, toneMapped: false });
      const yel = col === '#FFEE00'; cm.color.multiplyScalar(yel ? 1 : 0.62); cin.color.multiplyScalar(yel ? 1 : 0.72); if (yel) { cm.emissive = new THREE.Color('#5A5200'); cin.emissive = new THREE.Color('#6A6000'); }   /* the bright sun lifts every colour; this keeps red red, blue blue and yellow yellow */
      g.children.filter(c => c.isMesh).forEach((m, i) => { if (i === 0) m.material = cin; else if (i <= 8) m.material = cm; });   /* floor, walls and rims all in the box's colour */
    }
    const paintM = new THREE.MeshStandardMaterial({ color: bc.color || '#FFFFFF', roughness: 0.6 });
    if (bc.dots != null) {   /* a box for "how many corners": that many dots, or an empty ring for none (new look: bigger, on a card tilted up to face the boy) */
      const card = new THREE.Group(); card.position.set(0, LK ? BX.h * 0.6 + 0.24 : BX.h * 0.4, BX.d / 2 + (LK ? 0.42 : 0.005)); if (LK) { card.rotation.x = -0.55; card.scale.setScalar(1.4); facers.push(card); } g.add(card);   /* big and in front: the dots are what he matches */
      const k = LK ? 1.15 : 1;
      if (LK) { const rs = new THREE.Shape(), h = 0.35, rr = 0.12; rs.moveTo(-h + rr, -h); rs.lineTo(h - rr, -h); rs.quadraticCurveTo(h, -h, h, -h + rr); rs.lineTo(h, h - rr); rs.quadraticCurveTo(h, h, h - rr, h); rs.lineTo(-h + rr, h); rs.quadraticCurveTo(-h, h, -h, h - rr); rs.lineTo(-h, -h + rr); rs.quadraticCurveTo(-h, -h, -h + rr, -h);   /* a dice card, never a disc: an empty round card looked like a circle label (review 1) */ const bg = new THREE.Mesh(new THREE.ShapeGeometry(rs, 12), new THREE.MeshStandardMaterial({ color: bc.color && bc.color !== '#FFFFFF' ? '#FFFFFF' : '#2B3A6B', roughness: 0.6 })); bg.position.z = -0.004; card.add(bg); }
      if (!bc.dots && !LK) { const ring = new THREE.Mesh(new THREE.RingGeometry(0.16 * k, 0.24 * k, 40), paintM); card.add(ring); }   /* the new look: the "no corners" card is simply empty (a ring looked like one dot) */
      DOTS[bc.dots].forEach(p => { const dot = new THREE.Mesh(new THREE.CircleGeometry(0.075 * k, 24), paintM); dot.position.set(p[0] * 0.38 * (LK ? 0.85 : 1), p[1] * 0.38 * (LK ? 0.85 : 1), 0.002); card.add(dot); });
    } else if (bc.solid) {   /* a little real solid stuck on the front */
      const b3 = new THREE.Mesh(solidGeo(bc.solid), new THREE.MeshStandardMaterial({ color: bc.color || (LK ? '#FFD21F' : '#FFFFFF'), roughness: 0.4 })); b3.scale.setScalar((LK ? 0.42 : 0.28) * (bc.solidScale || 1)); b3.position.set(0, BX.h * (LK ? 0.6 : 0.45), BX.d / 2 + (LK ? 0.3 : 0.18) + (LK && bc.solidScale ? 0.3 * (bc.solidScale - 1) : 0)); b3.userData.wideAt = b3.position.clone(); b3.userData.solid = bc.solid; solidLabels.push(b3);   /* solidScale: a bigger solid, so the label is easy to read */ if (bc.solidScale) b3.rotation.set(...(bc.solid === 'cube' ? [0.38, 0.62, 0] : bc.solid === 'cyl' ? [0.3, 0, 0] : [0, 0, 0]));
      if (bc.solidScale && bc.solid === 'cube') b3.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.0, 1.0, 1.0)), new THREE.LineBasicMaterial({ color: '#13224A' })));   /* dark edges: three faces plainly seen, never a flat diamond */   /* turned, so he sees three faces: a cube never looks like a flat square */ b3.castShadow = true; g.add(b3);   /* new look: bigger and golden, so the solid on each box is easy to read */
    } else if (bc.paint === 'none') {   /* a plain box with nothing on its front (the clue games: he finds the shape the clue tells) */
    } else if (LK) {
      const lab = LK.emblem(shapeOf(bc.paint).s, bc.color || '#FFFFFF', (NB === 1 ? 0.5 : 0.44) * (bc.paintScale || 1)); lab.position.set(0, BX.h * 0.5 + (NB > 1 ? 0.5 : 0), BX.d / 2 + 0.3);   /* several boxes (phone: two rows): high enough that the box in front never hides it */ lab.rotation.x = -0.55; facers.push(lab); g.add(lab);   /* tilted up to face the boy (and turned to face the camera every frame, so on a phone a circle stays round), so a circle looks round, not squashed; out in front of the box, so no part of it hides inside the wall (a circle must never look like a half circle) */
    } else {
      const lab = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(bc.paint).s, 32), paintM);
      lab.scale.setScalar((NB === 1 ? 0.48 : 0.5) * (bc.paintScale || 1)); lab.position.set(0, BX.h * 0.45, BX.d / 2 + 0.005); g.add(lab);
    }
    return { g, n: 0 };
  });

  /* ---------- the boys: Mendy (by the toy box) and a friend for "find the mistake" ---------- */
  function makeKid(shirt, hair, glasses) {
    if (LK && (!FAST || SHOT)) return LK.makeKid(shirt, hair, glasses);   /* the automatic test keeps the simple boys (quicker on a test machine) */
    const k = new THREE.Group(), skin = new THREE.MeshStandardMaterial({ color: '#F2C9A0', roughness: 0.6 });
    const pants = new THREE.MeshStandardMaterial({ color: '#2E3650', roughness: 0.7 }), top = new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.55 });
    const add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; k.add(o); return o; };
    add(new THREE.CapsuleGeometry(0.17, 0.55, 6, 16), pants, -0.2, 0.45, 0); add(new THREE.CapsuleGeometry(0.17, 0.55, 6, 16), pants, 0.2, 0.45, 0);
    add(new THREE.SphereGeometry(0.2, 16, 12), new THREE.MeshStandardMaterial({ color: '#1A1E29' }), -0.2, 0.12, 0.08).scale.set(1, 0.6, 1.4);
    add(new THREE.SphereGeometry(0.2, 16, 12), new THREE.MeshStandardMaterial({ color: '#1A1E29' }), 0.2, 0.12, 0.08).scale.set(1, 0.6, 1.4);
    add(new THREE.CapsuleGeometry(0.42, 0.55, 8, 24), top, 0, 1.25, 0);
    const tz = new THREE.MeshStandardMaterial({ color: '#FFFFFF' });
    [-0.36, -0.3, 0.3, 0.36].forEach(x => add(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6), tz, x, 0.72, 0.18));
    const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-0.5, 1.55, 0); armR.position.set(0.5, 1.55, 0); k.add(armL, armR);
    [armL, armR].forEach(a => { const s1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.5, 6, 12), top); s1.position.y = -0.3; s1.castShadow = true; a.add(s1);
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), skin); h.position.y = -0.65; a.add(h); });
    armL.rotation.z = -0.15; armR.rotation.z = 0.15;
    add(new THREE.SphereGeometry(0.5, 32, 24), skin, 0, 2.3, 0);
    add(new THREE.SphereGeometry(0.52, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), new THREE.MeshStandardMaterial({ color: hair, roughness: 0.8 }), 0, 2.32, -0.04);
    add(new THREE.SphereGeometry(0.4, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.28), new THREE.MeshStandardMaterial({ color: '#1F2A44', roughness: 0.5 }), 0, 2.5, -0.06);
    const eye = new THREE.MeshStandardMaterial({ color: '#1F2A44' });
    add(new THREE.SphereGeometry(0.06, 12, 8), eye, -0.17, 2.36, 0.45); add(new THREE.SphereGeometry(0.06, 12, 8), eye, 0.17, 2.36, 0.45);
    const smile = add(new THREE.TorusGeometry(0.14, 0.025, 8, 24, Math.PI), new THREE.MeshStandardMaterial({ color: '#B5533A' }), 0, 2.2, 0.45); smile.rotation.z = Math.PI;
    const cheek = new THREE.MeshStandardMaterial({ color: '#F4A9A0', transparent: true, opacity: 0.6 });
    add(new THREE.SphereGeometry(0.08, 12, 8), cheek, -0.3, 2.2, 0.38); add(new THREE.SphereGeometry(0.08, 12, 8), cheek, 0.3, 2.2, 0.38);
    [-0.47, 0.47].forEach(x => add(new THREE.TorusGeometry(0.07, 0.025, 6, 12), new THREE.MeshStandardMaterial({ color: hair }), x, 2.15, 0.05).rotation.y = Math.PI / 2);
    if (glasses) { const gm = new THREE.MeshStandardMaterial({ color: '#1F2A44', roughness: 0.4 });
      [-0.17, 0.17].forEach(x => add(new THREE.TorusGeometry(0.12, 0.022, 8, 24), gm, x, 2.36, 0.47));
      add(new THREE.BoxGeometry(0.12, 0.025, 0.02), gm, 0, 2.38, 0.5); }
    k.userData = { armL, armR }; scene.add(k); return k;
  }
  function cheer(kid) {
    const { armL, armR } = kid.userData, y0 = kid.position.y;
    if (kid.userData.pose) { kid.userData.pose(kid.userData.cheerN++ % 2 ? 'clap' : 'happy'); setTimeout(() => kid.userData.pose('idle'), FAST ? 0 : 1400); }   /* painted boys change pose */
    return tween(700, t => { const e = Math.sin(Math.PI * t); kid.position.y = y0 + e * 0.5; armL.rotation.z = -0.15 - e * 2.4; armR.rotation.z = 0.15 + e * 2.4;
      if (LK && kid.userData.body) kid.userData.body.scale.set(1 - e * 0.06 + (t > 0.9 ? 0 : 0), 1 + e * 0.1, 1 - e * 0.06); }).then(() => { kid.position.y = y0; if (LK && kid.userData.body) LK.squash(kid.userData.body, 1, 0.14); });
  }
  const F = cfg.mistake.friend;
  /* Mendy and his friend: painted pictures (Esti chose them, 2026-11-26) */
  const PAINTED = LK && (!FAST || SHOT || LOOKTEST) && !/[?&]kids=3d/.test(location.search);   /* Esti, 2026-11-26: painted characters (the redrawn 3D boys stay at ?kids=3d) */
  if (LK) LK.treasures.painted = PAINTED;   /* the painted look also uses the painted cupcakes */
  const mendy = PAINTED ? LK.makePaintedKid('mendy') : makeKid(LK ? '#A9CFF2' : '#FFFFFF', LK ? '#7A4E2C' : '#B5773E'), friend = PAINTED ? LK.makePaintedKid(LK.friendArt(F)) : makeKid(F.shirt, F.hair, F.glasses); friend.visible = false;

  /* ---------- pieces ---------- */
  const DEPTH = 0.34, BEV = 0.09, shapes = [];
  const cornerGeo = new THREE.SphereGeometry(0.11, 24, 16);
  const cornerMat = new THREE.MeshStandardMaterial({ color: '#FFD23F', emissive: '#FFB000', emissiveIntensity: 1.4, roughness: 0.3 });
  const cornerFaint = new THREE.MeshStandardMaterial({ color: '#1F6FEB', emissive: '#1F6FEB', emissiveIntensity: 0.45, roughness: 0.35 });   /* 'tap me' dots: solid blue, easy to see on any shape; a tapped one turns gold */
  function solidGeo(kind) {
    if (kind === 'sphere') return new THREE.SphereGeometry(0.62, 48, 32);
    if (kind === 'cube') return new RoundedBoxGeometry(1.0, 1.0, 1.0, 4, 0.08);
    if (kind === 'cyl') return new THREE.CylinderGeometry(0.5, 0.5, 1.15, 48);
    return new THREE.ConeGeometry(0.62, 1.25, 48);
  }
  function makeShape(id, k, color, rotZ, scale) {
    const solid = KINDS[k].solid, { s, corners } = solid ? { s: null, corners: [] } : shapeOf(k);
    const dep = cfg.thinFlat ? 0.06 : cfg.plain && !solid ? 0.12 : DEPTH, bev = cfg.thinFlat ? 0.03 : cfg.plain && !solid ? 0.06 : BEV;   /* plain first-meeting shapes are thin, so they read as flat */   /* "flat or solid": flat pieces are thin, like card */
    const geo = solid ? solidGeo(solid) : new THREE.ExtrudeGeometry(s, { depth: dep, bevelEnabled: true, bevelThickness: LK ? bev * 1.25 : bev, bevelSize: bev, bevelSegments: LK && (!FAST || SHOT) ? 6 : 3, curveSegments: LK && (!FAST || SHOT) ? 64 : 48 });
    if (!solid) geo.translate(0, 0, -dep / 2);
    const TP = LK && !solid && !cfg.plain && LK.treasures.piece ? LK.treasures.piece(k, color, s, FAMILY(k)) : null;   /* the world's own thing in this exact outline (treasures.js); cfg.plain (first meeting with a shape, K-CLARITY-RULES 1): a plain flat shape in one solid colour, nothing painted on it */
    const TS = LK && solid && !cfg.plain && LK.treasures.solid ? LK.treasures.solid(solid, color) : null;   /* the world's own thing in this exact solid (planet, gift box ...); cfg.plain: a plain one-colour solid (K-CLARITY-RULES 6) */
    const mat = TS ? TS.mat : TP ? TP.mats : LK ? LK.pieceMat(color) : new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 0.35, emissive: '#FFC400', emissiveIntensity: 0 });
    if (cfg.sortBy === 'color' && !TS && !TP && mat && mat.isMeshPhysicalMaterial) { mat.sheen = 0; mat.clearcoat = 0.15; mat.envMapIntensity = 0.08; mat.roughness = 0.62; }   /* colour games: matte, so a flat yellow or red piece keeps its full colour and never looks pale or salmon in the light (review 1) */
    const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = true;
    if (TS && TS.extras) TS.extras.forEach(x => mesh.add(x));
    if (TP && !cfg.thinFlat) TP.extras.forEach(x => { const front = x.clone(); front.position.z = dep / 2 + bev * 1.25 + 0.004; mesh.add(front); const back = x.clone(); back.rotation.y = Math.PI; back.position.z = -(dep / 2 + bev * 1.25 + 0.004); mesh.add(back); });
    const turn = new THREE.Group(); turn.rotation.z = rotZ; turn.add(mesh);
    const g = new THREE.Group(); g.add(turn); g.scale.setScalar(scale); scene.add(g);
    const marks = corners.map(p => { const m = new THREE.Mesh(cornerGeo, cornerMat); m.position.set(p[0], p[1], Math.max(dep / 2 + bev, DEPTH / 2 + BEV) + 0.07);   /* always in front of the lit sides, so no corner marker is hidden */ m.scale.setScalar(0); if (LK) m.add(LK.cornerHalo()); mesh.add(m); return m; });
    const o = { id, k, solid, color, box: cfg.sortBy ? sortBox(color, scale) : boxOf(k), g, turn, mesh, mat, marks, corners, scale, home: new THREE.Vector3(), phase: (shapes.length * 1.7) % 6.28, inBox: false, busy: false };
    mesh.userData.shape = o; shapes.push(o); return o;
  }

  /* ---------- layout ---------- */
  let tall = false;
  const SLOTS_WIDE = [[-3.9, -2.6], [-1.3, -2.9], [1.3, -2.9], [3.9, -2.6], [-4.7, -0.2], [-2.3, 0.1], [2.3, 0.1], [4.7, -0.2]];
  const SLOTS_TALL = [[-1.8, -4.7], [0, -5.0], [1.8, -4.7], [-1.8, -2.4], [0, -2.5], [1.8, -2.4], [-1.8, -0.1], [0, -0.2], [1.8, -0.1]];
  function boxAt(i) {
    if (NB === 1) return tall ? new THREE.Vector3(0, 0, 2.6) : new THREE.Vector3(0, 0, 2.3);
    if (tall) return new THREE.Vector3(NB === 3 && i === 2 ? 0 : i % 2 ? 1.3 : -1.3, 0, i < 2 ? 1.75 : 4.35);
    return new THREE.Vector3((i - (NB - 1) / 2) * (NB === 3 ? 3.2 : 2.7), 0, 2.6);
  }
  const VIEW1 = { wide: [[0, 8.6, 11.6], [0, 0.2, -0.4]], tall: [[0, 15.6, 7.0], [0, 0, -1.4]] };
  const VIEWN = { wide: [[0, 9.4, 12.2], [0, 0.2, -0.2]], tall: [[0, 17.5, 8.4], [0, 0, -0.5]] };
  const CLOSE = [[0, 2.7, 6.4], [0, 2.05, 0.9]];
  let camMode = 'wide';
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  let patN = 0;   /* cars in the train now (phone camera fits the whole train) */
  function viewFor(m) {
    if (m === 'close' && tall && cfg.mode === 'pattern' && cfg.world === 'bakery') return { pos: new THREE.Vector3(0, 3.6, 9.4), look: new THREE.Vector3(0, 1.7, 0.9) };   /* phone, cupcakes (no engine): closer, so the row fills the width (review round 2) */
    if (m === 'close' && tall && cfg.mode === 'pattern') return { pos: new THREE.Vector3(-0.75, 4.4, 14.4), look: new THREE.Vector3(-0.75, 2.0, 0.9) };   /* review 2: centred on cars AND engine, a little further back, so the engine is never cut off */
    if (m === 'close' && cfg.mode === 'pattern' && cfg.world === 'traintown') return { pos: new THREE.Vector3(-0.75, 3.0, 7.8), look: new THREE.Vector3(-0.75, 2.0, 0.9) };   /* Chromebook train lesson: the engine fits too */   /* phone: the whole train, engine too, as big as fits (K-CLARITY-RULES 9) */
    if (m === 'close' && cfg.sortBy && W.name === 'mistake') return tall ? { pos: new THREE.Vector3(0, 6.2, 13.5), look: new THREE.Vector3(0, 1.3, 1.6) } : { pos: new THREE.Vector3(0, 4.6, 9.8), look: new THREE.Vector3(0, 1.0, 1.4) };   /* sorting mistake: every box whole, the piece above them (review 2: the red box was cut off) */
    if (m === 'close') return tall ? { pos: new THREE.Vector3(...CLOSE[0]).multiplyScalar(1.95), look: new THREE.Vector3(...CLOSE[1]) } : { pos: new THREE.Vector3(...CLOSE[0]), look: new THREE.Vector3(...CLOSE[1]) };
    if (W.towers && m !== 'close') return tall ? { pos: new THREE.Vector3(0, 2.8, 10.8), look: new THREE.Vector3(0, 1.45, -0.2) } : { pos: new THREE.Vector3(0, 2.3, 7.6), look: new THREE.Vector3(0, 1.35, -0.2) };   /* towers are seen from the side, so "taller" shows (review 2: the top-down camera hid the heights) */
    if (cfg.view) { const v = cfg.view[tall ? 'tall' : 'wide'], look = new THREE.Vector3(...v[1]), pos = new THREE.Vector3(...v[0]);
      if (tall && cfg.mode === 'pattern' && cfg.world === 'traintown' && patN > 6) pos.sub(look).multiplyScalar(1 + 0.09 * (patN - 6)).add(look);   /* phone: a longer train steps the camera back, so the engine and the next spot stay on screen (review 2) */
      return { pos, look }; }
    const v = (NB === 1 ? VIEW1 : VIEWN)[tall ? 'tall' : 'wide']; return { pos: new THREE.Vector3(...v[0]), look: new THREE.Vector3(...v[1]) };
  }
  function homeFor(i) { const s = (tall ? SLOTS_TALL : SLOTS_WIDE)[i]; return new THREE.Vector3(s[0], 0.92, s[1]); }
  function mendyAt() {
    if (cfg.mendyAt) return new THREE.Vector3(...(cfg.mendyAt[tall ? 'tall' : 'wide'] || [0, -50, 0]));
    if (NB > 1) return tall ? new THREE.Vector3(2.35, 0, 5.4) : new THREE.Vector3(-6.3, 0, 1.2);
    const b = boxAt(0); return tall ? new THREE.Vector3(b.x + 2.1, 0, b.z + 0.35) : new THREE.Vector3(b.x + 3.0, 0, b.z + 2.0);
  }
  function placeMendy(mode) {
    if (mode === 'close') { mendy.visible = !friend.visible && cfg.mode !== 'pattern' && cfg.mode !== 'position'; mendy.position.set(-1.45, 0, 0.6); mendy.rotation.set(0, 0.35, 0); }
    else { mendy.visible = !(NB > 1 && tall) && !(cfg.mendyAt && !cfg.mendyAt[tall ? 'tall' : 'wide']); mendy.position.copy(mendyAt()); if (PAINTED && PATTERNED) mendy.position.add(new THREE.Vector3(0.75, 0, 1.9));   /* the painted boy is wider: keep him clear of the train's engine */ mendy.rotation.set(tall ? -0.6 : 0, (NB > 1 || cfg.mendyAt) && !tall ? 0.5 : -0.35, 0); }
  }
  function inBoxSpot(bi, n) { const b = boxAt(bi), sp = NB === 1 ? 0.75 : 0.55; return new THREE.Vector3(b.x - sp + (n % 3) * sp, 0.3 + Math.floor(n / 3) * 0.15, b.z + (n % 2 ? 0.18 : -0.18)); }
  function resize() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; if (LK) LK.resize();
    const was = tall; tall = w / h < 0.95; camera.fov = tall ? 46 : 40; camera.updateProjectionMatrix();
    boxes.forEach((b, i) => b.g.position.copy(boxAt(i)));
    solidLabels.forEach(l => { if (tall && NB > 2) l.position.set(0, BX.h + 0.45, 0); else l.position.copy(l.userData.wideAt);
      if (l.userData.solid === 'cyl' || l.userData.solid === 'cone') { if (l.userData.rot0 == null) l.userData.rot0 = l.rotation.clone(); if (tall && NB > 2) l.rotation.set(l.userData.solid === 'cyl' ? 0.25 : -1.1, 0, l.userData.solid === 'cyl' ? Math.PI / 2 : 0); else l.rotation.copy(l.userData.rot0); } });   /* phone, seen from above: the cylinder lies on its side and the cone tips toward him, so neither looks like a plain circle (review round 2) */
    if (was !== tall) shapes.forEach(o => { if (o.inBox && o.boxN != null && !o.busy) o.g.position.copy(inBoxSpot(o.inBoxAt, o.boxN)); else if (o.slot != null) { o.home.copy(homeFor(o.slot)); if (!o.busy && !o.inBox) o.g.position.copy(o.home); } });
    placeMendy(camMode);
    const v = viewFor(camMode); camPos.copy(v.pos); camLook.copy(v.look);
  }
  addEventListener('resize', resize);

  /* ---------- motion ---------- */
  const tweens = [];
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function tween(ms, fn) { return new Promise(res => { if (FAST) { fn(1); return res(); } tweens.push({ t0: performance.now(), ms, fn, res }); }); }
  function moveTo(o, to, ms, hop) {
    const a = o.g.position.clone(); o.busy = true;
    return tween(ms, k => { const e = ease(k); o.g.position.lerpVectors(a, to, e); if (hop) o.g.position.y += Math.sin(Math.PI * e) * hop; }).then(() => { o.busy = false; });
  }
  function camTo(mode, ms) {
    camMode = mode; const v = viewFor(mode), p0 = camPos.clone(), l0 = camLook.clone(); placeMendy(mode);
    if (typeof boxes !== 'undefined') boxes.forEach(b => { b.g.visible = !(mode === 'close' && !(cfg.sortBy && (W.name === 'mistake' || !tall))); });   /* close-ups show only the piece and the boy (sorting games keep the boxes they talk about); before: the boxes would only show cut off at the bottom */
    if (typeof boxes !== 'undefined' && typeof shapes !== 'undefined') shapes.forEach(o => { if (o.inBox && o.inBoxAt != null && boxes[o.inBoxAt]) o.g.visible = boxes[o.inBoxAt].g.visible; });   /* pieces in a hidden box hide with it (no stray edges under the yes/no buttons) */
    return tween(ms, k => { const e = ease(k); camPos.lerpVectors(p0, v.pos, e); camLook.lerpVectors(l0, v.look, e); });
  }
  const sparks = [], sparkGeo = new THREE.OctahedronGeometry(0.09);
  function burst(at, n) {
    if (FAST && !SHOT) return;
    if (LK) return LK.celebrate(at, n);
    for (let i = 0; i < (n || 22); i++) {
      const m = new THREE.Mesh(sparkGeo, new THREE.MeshStandardMaterial({ color: COLORS[i % COLORS.length], emissive: COLORS[i % COLORS.length], emissiveIntensity: .5, transparent: true }));
      m.position.copy(at); scene.add(m);
      sparks.push({ m, v: new THREE.Vector3((Math.random() - .5) * 5, 3 + Math.random() * 4, (Math.random() - .5) * 5), life: 1 });
    }
  }
  let dragging = null, handOn = null;
  const clock = new THREE.Clock(); let fastN = 0;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, now = performance.now();
    for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i], k = Math.min(1, (now - tw.t0) / tw.ms); tw.fn(k); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
    shapes.forEach(o => {
      if (o.slot == null && !o.inBox && o !== dragging && o.g.visible && !o.solid && !o.upright && KINDS[o.k] && o.parentLocked !== true && o.g.parent === scene) { o.g.quaternion.copy(camera.quaternion); return; }   /* lesson and friend's pieces face the camera too: a flat circle never looks like a drum */
      if (o.inBox || o.busy || o.still || o === dragging || !o.g.visible || o.slot == null) return;
      o.g.position.set(o.home.x, o.home.y + Math.sin(t * 1.6 + o.phase) * 0.06, o.home.z);
      if (o.solid) { o.g.rotation.y = t * 0.5 + o.phase; if (tall) { const dx = camera.position.x - o.g.position.x, dz = camera.position.z - o.g.position.z; o.g.rotation.x = -Math.atan2(camera.position.y - o.g.position.y, Math.hypot(dx, dz)) * 0.75; } else o.g.rotation.x = 0; return; }   /* phone: the camera looks down steeply, so a solid leans toward it; a cone never looks like a flat disc (review 2) */
      if (o.upright) { o.g.rotation.set(-0.12, o.vis && o.vis.userData.flat ? 0 : Math.sin(t * 0.7 + o.phase) * 0.3, 0); return; }   /* a cupcake stands up and turns a little, like on a shop turntable */
      o.g.quaternion.copy(camera.quaternion);   /* faces the camera straight on (not only tilted up), so a square always looks square and a triangle is never seen edge-on, even at the side of the screen */
    });
    facers.forEach(f => { if (!f.parent) return; f.parent.getWorldQuaternion(_fq).invert().multiply(camera.quaternion); f.quaternion.copy(_fq); });
    if (BS) placePans(dt);
    if (LK) LK.update(dt, t, shapes);
    for (let i = sparks.length - 1; i >= 0; i--) { const s = sparks[i]; s.v.y -= 9 * dt; s.m.position.addScaledVector(s.v, dt); s.m.rotation.x += dt * 6; s.life -= dt * 0.9; s.m.material.opacity = Math.max(0, s.life); if (s.life <= 0) { scene.remove(s.m); sparks.splice(i, 1); } }
    syncCam();
    if (handOn) { const p = toScreen(handOn.g.position); hand.style.left = p.x + 'px'; hand.style.top = p.y + 'px'; }
    if (SHOT ? window.__shotDraw : (!FAST || (fastN++ < 12 || fastN % 8 === 0))) { if (LK) LK.render(); else renderer.render(scene, camera); }   /* pictures: draw only while one is taken */
    requestAnimationFrame(frame);
  }
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  /* the camera is put in place before every drawing AND before every tap is measured, so a tap during a camera move still lands */
  function syncCam() { const t = clock.elapsedTime, sway = FAST ? 0 : Math.sin(t * 0.25) * 0.25, bob = FAST || !LK ? 0 : Math.sin(t * 0.37) * 0.08;
    camera.position.set(camPos.x + sway, camPos.y + bob, camPos.z); camera.lookAt(camLook); camera.updateMatrixWorld(); }
  function toScreen(v) { syncCam(); const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight }; }
  function hitOn(o, cx, cy) {   /* did he tap this piece? (works even when it is lined up or in place) */
    ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); (syncCam(), ray.setFromCamera(ndc, camera)); return ray.intersectObject(o.g, true).length > 0;
  }
  function pick(cx, cy) {
    ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); (syncCam(), ray.setFromCamera(ndc, camera));
    const hits = ray.intersectObjects(shapes.filter(o => o.g.visible && !o.inBox).map(o => o.mesh), false);
    return hits.length ? hits[0].object.userData.shape : null;
  }
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.25), hitP = new THREE.Vector3();
  function onPlane(cx, cy) { ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); (syncCam(), ray.setFromCamera(ndc, camera)); return ray.ray.intersectPlane(dragPlane, hitP) ? hitP.clone() : null; }
  function overBox(p) { if (cfg.mode === 'pattern') { if (!PS || PS.next >= PS.n) return -1;
      if (PS.R.fixAt != null) { let best = -1, bd = 1e9; for (let i = 0; i < PS.n; i++) { const q = slotAt(i, PS.n, PS.z), d = Math.hypot(p.x - q.x, p.z - q.z); if (d < bd) { bd = d; best = i; } } return bd > 1.3 ? -1 : best === PS.next ? 0 : 2; }
      const g = slotAt(PS.next, PS.n, PS.z); return Math.hypot(p.x - g.x, p.z - g.z) < 1.3 ? 0 : -1; } if (cfg.mode === 'fix') { const g = OL ? OL.mark.getWorldPosition(new THREE.Vector3()) : null; return g && Math.hypot(p.x - g.x, p.z - g.z) < 1.5 ? 0 : -1; } for (let i = 0; i < NB; i++) { const b = boxAt(i); if (Math.abs(p.x - b.x) < BX.w / 2 + 0.3 && Math.abs(p.z - b.z) < BX.d / 2 + 0.4) return i; } return -1; }
  /* for the automatic test */
  W.shapePt = id => toScreen(shapes.find(s => s.id === id).g.position);
  W.boxPt = i => cfg.mode === 'balance' ? (i === 9 || !BS ? toScreen(new THREE.Vector3(0, 0.3, tall ? 3.6 : 3.2)) : toScreen(panWorld(i).add(new THREE.Vector3(0, 0.45, 0)))) : cfg.mode === 'measure' ? (i === 9 ? toScreen(new THREE.Vector3(LINE_X() + 3.2, 1.25, 0)) : W.boxPtM(i)) : cfg.mode === 'position' ? toScreen(zoneWorld(i === 0 ? posWant : i === 1 ? (posWant === 'behind' ? 'front' : 'behind') : i)) : cfg.mode === 'puzzle' ? toScreen(slotWorld(PZ.slots[i || 0])) : cfg.mode === 'pattern' ? toScreen(slotAt(PS.next, PS.n, PS.z).setY(1.25)) : cfg.mode === 'fix' ? toScreen(OL.mark.getWorldPosition(new THREE.Vector3()).setY(1.25)) : toScreen(boxAt(i || 0).clone().setY(1.25));
  W.pieces = () => shapes.map(o => ({ id: o.id, k: o.k, marks: o.marks.length, painted: [].concat(o.mat || []).some(m => m && m.map) }));   /* the clarity test: every corner has its marker; plain games paint nothing on a piece */
  W.plain = !!cfg.plain;
  W.list = () => shapes.filter(o => o.g.visible && !o.inBox && o.slot != null).map(o => ({ id: o.id, k: o.k, box: o.box, busy: o.busy }));

  /* ---------- sound ---------- */
  let AC = null;
  function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function tone(freqs, type, gap, len, vol) {
    const c = ac(); if (!c || FAST) return; const t = c.currentTime;
    freqs.forEach((f, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * gap); g.gain.linearRampToValueAtTime(vol, t + i * gap + .02); g.gain.exponentialRampToValueAtTime(.001, t + i * gap + len);
      o.connect(g); g.connect(c.destination); o.start(t + i * gap); o.stop(t + i * gap + len + .05); });
  }
  const chime = ok => ok ? tone([660, 880, 1320], 'sine', .1, .35, .14) : tone([330, 262], 'sine', .14, .3, .14);
  const plink = () => tone([1046], 'triangle', 0, .18, .12);
  const pop = () => tone([520, 780], 'triangle', .05, .12, .1);
  function clap() {
    const c = ac(); if (!c || FAST) return; const len = c.sampleRate * .12, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); src.buffer = b; f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = .8; g.gain.value = .5;
    src.connect(f); f.connect(g); g.connect(c.destination); src.start();
  }

  /* ---------- the voice: the school's teacher voice, else the device voice ---------- */
  const TTS = 'https:' + '/' + '/' + 'tts-q26c275eaa-uk.a.run.app', vcache = {}; let vtok = 0, audio = null;
  function hush() { vtok++; try { if (audio) audio.pause(); } catch (e) {} audio = null; try { speechSynthesis.cancel(); } catch (e) {} }
  function say(t) {
    W.said.push(t); if (FAST) return Promise.resolve();
    const my = vtok;
    return new Promise(done => {
      let fin = false; const end = () => { if (!fin) { fin = true; done(); } };
      setTimeout(end, t.length * 85 + 2500);
      const dev = () => { if (my !== vtok) return end(); try { const u = new SpeechSynthesisUtterance(t); u.rate = 0.9; u.pitch = 1.1; u.onend = end; u.onerror = end; speechSynthesis.speak(u); } catch (e) { end(); } };
      const playUrl = url => { if (my !== vtok) return end(); const a = new Audio(url); audio = a; a.onended = end; a.onerror = dev; const p = a.play(); if (p && p.catch) p.catch(dev); };
      if (vcache[t]) return playUrl(vcache[t]);
      Promise.race([
        fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t, voice: 'teacher' }) })
          .then(r => r.json()).then(j => { if (j && j.ok && j.url) { vcache[t] = j.url; return j.url; } throw new Error('tts'); }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 1800))
      ]).then(playUrl).catch(dev);
    });
  }
  function preload(lines) { if (FAST) return; lines.forEach(t => { if (typeof t === 'string' && !vcache[t]) fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t, voice: 'teacher' }) }).then(r => r.json()).then(j => { if (j && j.ok && j.url) vcache[t] = j.url; }).catch(() => {}); }); }
  let cur = [], runTok = 0, echoTok = 0, busy = false, task = null;
  const againBtn = $('#again');
  function play(script) {
    const my = ++runTok; echoTok++; cur = script; busy = true; againBtn.classList.add('wait'); hush();
    return script.reduce((p, s) => p.then(() => {
      if (my !== runTok) return;
      if (typeof s === 'string') return say(s);
      if (typeof s === 'function') return s();
      if (s.wait) return wait(s.wait);
    }), Promise.resolve()).then(() => { if (my === runTok) { busy = false; againBtn.classList.remove('wait'); } return my === runTok; });
  }
  againBtn.onclick = () => {
    W.again++; if (busy && !task) { const last = W.said[W.said.length - 1]; if (last) { try { speechSynthesis.cancel(); } catch (e) {} say(last); } return; } const my = ++echoTok; hush();
    (task || cur.filter(s => typeof s === 'string')).reduce((p, s) => p.then(() => my === echoTok ? say(s) : null), Promise.resolve());
  };

  const STEPS = 4;
  function dots(n) { $('#dots').innerHTML = Array.from({ length: STEPS }, (_, i) => '<i' + (i < n ? ' class="on"' : '') + '></i>').join(''); }
  const hand = $('#hand');

  /* ---------- counting corners and sides ---------- */
  const NUMS = ['One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.', 'Seven.', 'Eight.'], NUMX = ['One!', 'Two!', 'Three!', 'Four!', 'Five!', 'Six!', 'Seven!', 'Eight!'];
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  function lightCorner(o, i) { if (i === 0) shapes.forEach(x => { if (x !== o && x.marks.length && x.marks.some(q => q.scale.x > 0 && q.material === cornerMat)) clearCorners(x); });   /* one thing at a time: only the shape being counted has lit corners */
    plink(); const m = o.marks[i]; m.material = cornerMat; return tween(260, k => m.scale.setScalar(k * 1.45)); }
  function clearCorners(o) { o.marks.forEach(m => { m.scale.setScalar(0); m.material = cornerMat; }); }
  let cornerTap = null, shapeTap = null;
  function tapCorners(o) {   /* HE counts: faint dots on the corners; each tap lights one and the voice counts */
    return new Promise(done => {
      o.marks.forEach(m => { m.material = cornerFaint; m.scale.setScalar(1.5); });
      const got = new Set(); let nag = null;
      const remind = () => { clearTimeout(nag); nag = setTimeout(() => { if (cornerTap) { say('Tap each corner.'); remind(); } }, FAST ? 1e9 : 9000); };
      cornerTap = (cx, cy) => {
        let best = -1, bd = 1e9;
        o.marks.forEach((m, i) => { if (got.has(i)) return; const p = toScreen(m.getWorldPosition(new THREE.Vector3())); const d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = i; } });
        if (best < 0 || bd > Math.max(56, innerWidth * 0.05)) return;
        got.add(best); W.cornerTaps = (W.cornerTaps || 0) + 1; lightCorner(o, best); hush(); say(NUMX[got.size - 1]); remind();
        if (got.size === o.marks.length) { cornerTap = null; clearTimeout(nag); setTimeout(done, FAST ? 0 : 900); }
      };
      remind();
    });
  }
  W.cornerPts = () => { if (W.cornerPtsP) return W.cornerPtsP(); const o = shapes.find(s => s.marks.length && s.marks.some(m => m.material === cornerFaint)); return o ? o.marks.filter(m => m.material === cornerFaint).map(m => toScreen(m.getWorldPosition(new THREE.Vector3()))) : []; };
  W.tapTarget = () => W.tapPt ? W.tapPt() : W.tapShape ? toScreen(W.tapShape.g.position) : null;
  const tracer = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#FFFFFF', emissiveIntensity: 1 }));
  tracer.visible = false;
  function traceSide(o, i, color) {   /* a glowing dot runs along one side; with a colour, a bar stays on that side (equal sides, long and short sides) */
    const a = o.corners[i], b = o.corners[(i + 1) % o.corners.length]; o.mesh.add(tracer); tracer.visible = true; plink();
    return tween(700, k => tracer.position.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, DEPTH / 2 + BEV + 0.05)).then(() => {
      if (!color) return;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, Math.max(0.01, len - 0.14), 6, 12), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.4 }));
      bar.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2; bar.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, DEPTH / 2 + BEV + 0.04);
      o.mesh.add(bar); (o.bars = o.bars || []).push(bar);
    });
  }
  function clearBars(o) { (o.bars || []).forEach(b => o.mesh.remove(b)); o.bars = []; }
  /* every side lights, one by one, while the voice counts them (K-CLARITY-RULES 5). Same-length sides get one colour;
     long sides are blue and short sides yellow, so "two long, two short" and "all the same" can be SEEN */
  function sideSteps(o) {
    const c = o.corners, n = c.length; if (!n) return [];
    const len = c.map((a, i) => { const b = c[(i + 1) % n]; return Math.hypot(b[0] - a[0], b[1] - a[1]); }), lo = Math.min(...len), hi = Math.max(...len), same = hi - lo < 0.05 * hi;
    const col = i => same ? '#12A766' : (len[i] > (lo + hi) / 2 ? '#1F6FEB' : '#F2A900');
    const st = [];
    for (let i = 0; i < n; i++) st.push(() => traceSide(o, i, col(i)), i < n - 1 ? NUMS[i] : cap(WORDS[n]) + ' sides!');
    st.push(() => { tracer.visible = false; }, same ? 'All the sides are the same.' : (n === 4 ? 'Two long sides. Two short sides.' : 'Some long, some short.'), () => wait(400), () => clearBars(o));
    return st;
  }
  function traceRound(o, ms) {   /* a glowing dot runs all the way round a circle */
    const r = KINDS[o.k].circle || 0.66; o.mesh.add(tracer); tracer.visible = true; plink();
    return tween(ms || 1600, k => { const a = Math.PI / 2 + k * Math.PI * 2; tracer.position.set(Math.cos(a) * (r + 0.02), Math.sin(a) * (r + 0.02), DEPTH / 2 + BEV + 0.05); }).then(() => { tracer.visible = false; });
  }
  function tapShape(o, nagLine, onTap) {   /* he taps the shape; something happens (the dot runs round, the ball rolls...) */
    return new Promise(done => {
      W.tapShape = o; let nag = null;
      const remind = () => { clearTimeout(nag); nag = setTimeout(() => { if (shapeTap) { say(nagLine || 'Tap the circle.'); remind(); } }, FAST ? 1e9 : 9000); };
      shapeTap = (cx, cy) => { const c = toScreen(o.g.getWorldPosition(new THREE.Vector3())); if (!hitOn(o, cx, cy) && Math.hypot(c.x - cx, c.y - cy) > Math.max(90, innerWidth * 0.08)) return;   /* small fingers: near it counts too */
        shapeTap = null; clearTimeout(nag); W.shapeTaps = (W.shapeTaps || 0) + 1; hush();
        if (onTap) return onTap().then(done); say('Round and round!'); traceRound(o, 1400).then(done); };
      remind();
    });
  }

  /* ---------- the chant: he claps along; the corners (or the whole piece) bounce on the beat ---------- */
  const clapBtn = $('#clapBtn'), BEAT = [523, 587, 659, 698, 784, 880];
  let chantOn = false, clapWaiter = null;
  function boyClap() { clap(); W.boyClaps = (W.boyClaps || 0) + 1; if (clapWaiter) clapWaiter(); clapBtn.classList.remove('beat'); void clapBtn.offsetWidth; clapBtn.classList.add('beat'); }
  clapBtn.onclick = () => { ac(); if (chantOn) boyClap(); };
  function chant(on) { chantOn = on; clapBtn.classList.toggle('show', on); }
  function waitClap(ms) { return new Promise(r => { if (FAST) return r(); const t = setTimeout(() => { clapWaiter = null; r(); }, ms); clapWaiter = () => { clearTimeout(t); clapWaiter = null; r('boy'); }; }); }
  function claps(o, n, what) {
    W.claps = (W.claps || 0) + n;
    const all = o.bars && o.bars.length ? o.bars : null;
    const bars = !all ? null : what === 'sides' ? all : what === 'long' ? [all[0], all[2]] : what === 'short' ? [all[1], all[3]] : null;
    return Array.from({ length: n }).reduce((p, _, i) => p.then(() => waitClap(1600)).then(by => {
      if (by !== 'boy') clap(); tone([BEAT[i % BEAT.length]], 'triangle', 0, .3, .12); clapBtn.classList.remove('beat'); void clapBtn.offsetWidth; clapBtn.classList.add('beat');
      if (bars) { const b = bars[i % bars.length]; b.scale.set(1.8, 1, 1.8); return tween(320, k => b.scale.set(1.8 - k * 0.8, 1, 1.8 - k * 0.8)); }
      if (o.marks.length) { const m = o.marks[i % o.marks.length]; m.scale.setScalar(1.6); return tween(320, k => m.scale.setScalar(1.6 - k * 0.45)); }
      const s0 = o.g.scale.x; return tween(320, k => o.g.scale.setScalar(s0 * (1 + 0.12 * Math.sin(Math.PI * k))));
    }), Promise.resolve());
  }

  /* ---------- the pieces on the rug ---------- */
  let allow = false, down = null, onDrop = null;
  function buildSet() {
    shapes.splice(0).forEach(o => scene.remove(o.g)); friend.visible = false; boxes.forEach(b => { b.n = 0; });
    (cfg.set || []).forEach((s, i) => { const o = makeShape(s[0], s[1], s[4] || PAL[i % PAL.length], s[2], s[3]); o.slot = i; o.home.copy(homeFor(i)); o.g.position.copy(o.home); o.g.visible = false; });
  }
  function dropInBox(o, bi) {
    bi = bi == null ? Math.max(0, o.box) : bi;
    clearCorners(o); o.inBox = true; o.inBoxAt = bi; o.boxN = boxes[bi].n++; W.found++;
    const to = inBoxSpot(bi, o.boxN), s0 = o.g.scale.x, s1 = Math.min(o.scale || s0, 1) * (NB === 1 ? 0.55 : 0.42);   /* from its own size, not its size this moment (a piece still popping in stayed a speck) */
    tween(520, k => o.g.scale.setScalar(s0 + (s1 - s0) * ease(k)));
    return moveTo(o, to, 520, 1.2).then(() => { o.g.rotation.set(-1.45, (o.boxN % 3 - 1) * 0.6, 0); burst(to.clone().setY(1.2)); pop(); cheer(mendy);
      if (LK) { LK.squash(o.g, s1, 0.4); LK.wiggle(boxes[bi].g); LK.sparkle(to.clone().setY(1.0)); } });
  }
  function goHome(o) { return moveTo(o, o.home, 420, 0.4).then(() => { if (LK) LK.squash(o.g, o.scale, 0.22); }); }

  canvas.addEventListener('pointerdown', e => {
    ac(); if (SHOT && !handOn) hand.style.display = 'none'; if (glowHeld) { glowHeld = false; if (PS) coreGlow(false); } if (helpRings.length) ringsOff();
    if (cornerTap) { cornerTap(e.clientX, e.clientY); return; }
    if (shapeTap) { shapeTap(e.clientX, e.clientY); return; }
    if (chantOn) { boyClap(); return; }
    if (!allow || down) return;
    const o = pick(e.clientX, e.clientY); if (!o || o.busy) return;
    down = { o, x: e.clientX, y: e.clientY, moved: false, id: e.pointerId }; try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
  });
  canvas.addEventListener('pointermove', e => {
    lastPt = { x: e.clientX, y: e.clientY };
    if (!down || e.pointerId !== down.id) return;
    if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) { down.moved = true; dragging = down.o; pop(); }
    if (dragging) { const p = onPlane(e.clientX, e.clientY); if (p) { dragging.g.position.set(p.x, 1.25, p.z); dragging.g.rotation.y = 0; } }
  });
  function release(e) {
    if (!down || (e && e.pointerId !== down.id)) return; const d = down; down = null;
    if (!d.moved) {   /* one box: a tap sends the piece there. Several boxes: a tap makes it hop (he must drag it to a box) */
      if (d.o.busy) return;
      if ((NB === 1 || FIXED || PATTERNED) && onDrop && allow) { idle(); const o = d.o; o.busy = true; moveTo(o, (PATTERNED ? slotAt(PS.next, PS.n, PS.z) : FIXED ? gapWorld().setY(1.25) : boxAt(0).clone().setY(1.25)), 450, 0.8).then(() => { if (onDrop && allow) onDrop(o, 0); else goHome(o); }); }
      else if (BALANCED && onDrop && allow && d.o.box >= 0) { idle(); onDrop(d.o, d.o.box); }
      else if (PUZZLED && onDrop && allow && d.o.box >= 0) { idle(); const o = d.o; o.busy = true; moveTo(o, slotWorld(PZ.slots[o.box]), 450, 0.6).then(() => { o.busy = false; if (onDrop && allow) onDrop(o, o.box); else goHome(o); }); }
      else { pop(); const o = d.o; o.busy = true; tween(500, k => { o.g.position.y = o.home.y + Math.sin(Math.PI * k) * 0.6; }).then(() => { o.busy = false; }); }
      return;
    }
    idle();
    const o = dragging; dragging = null;
    if (!o) return;
    if (onDrop && allow) onDrop(o, cfg.mode === 'balance' ? bsDropPan(lastPt.x, lastPt.y) : cfg.mode === 'measure' ? 0 : cfg.mode === 'position' ? zoneHit(lastPt.x, lastPt.y) : cfg.mode === 'puzzle' ? slotHit(lastPt.x, lastPt.y) : overBox(o.g.position)); else goHome(o);
  }
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);

  /* ---------- idle: say the task again, the hand points; next time count its corners ---------- */
  let idleT = null, idleN = 0, idleFn = null;
  function idle() { clearTimeout(idleT); if (!idleFn) return; idleT = setTimeout(() => { if (!busy && allow) idleFn(++idleN); idle(); }, FAST ? 1e9 : 11000); }
  function stopIdle() { clearTimeout(idleT); idleFn = null; idleN = 0; }
  function pointAt(o, toBox, at) {   /* at: a place to move to instead of the box (the gap in Fix the shape) */   /* the hand points at a piece (and then at the box it goes in) */
    handOn = o; hand.style.display = 'block';
    const hw = ms => (SHOT ? new Promise(r => setTimeout(r, ms)) : wait(ms));   /* pictures (shot=1) keep the hand on screen long enough to be seen */
    return hw(1500).then(() => { handOn = null; if (toBox && o.box >= 0 && (NB || at)) { const p = toScreen(at ? at.clone() : boxAt(o.box).clone().setY(1.1)); hand.style.left = p.x + 'px'; hand.style.top = p.y + 'px'; return hw(1300); } })
      .then(() => { if (!SHOT) hand.style.display = 'none'; });   /* pictures: the hand stays until his next touch, so the slow picture machine still catches it */
  }
  W.idleNow = () => { if (idleFn) idleFn(++idleN); }; W.waitingTap = () => !!(shapeTap || cornerTap);   /* the test waits until the lesson really waits for his tap */

  /* ---------- the lesson: one shape up close ---------- */
  function showcase(k, color, rot, scale, at) {
    const o = makeShape('show', k, color, rot || 0, 1); o.slot = null; o.busy = true;
    o.g.position.copy(at || new THREE.Vector3(0.55, 2.05, 0.9)); o.g.scale.setScalar(0.01);
    if (LK) LK.pop(o.g, scale || 1.25); else tween(600, t => o.g.scale.setScalar(Math.max(0.01, ease(t) * (scale || 1.25))));
    return o;
  }
  function solidAction(o, a) {   /* what a solid does: a ball rolls, a block stacks, a cone spins on its point */
    plink();
    if (a === 'roll') { const x0 = o.g.position.x; return tween(1600, k => { const e = Math.sin(Math.PI * 2 * k); o.g.position.x = x0 + e * 1.1; o.turn.rotation.z = -e * 2.2; }).then(() => { o.g.position.x = x0; o.turn.rotation.z = 0; }); }
    if (a === 'stack') { const top = new THREE.Mesh(o.mesh.geometry, o.mat); top.scale.setScalar(0.75); o.g.add(top); const y1 = 0.88;
      return tween(700, k => { top.position.y = 2.4 - (2.4 - y1) * ease(k); }).then(() => { pop(); return wait(700); }).then(() => tween(300, k => top.scale.setScalar(0.75 * (1 - k)))).then(() => { o.g.remove(top); }); }
    if (a === 'stand') return tween(1200, k => { o.turn.rotation.x = Math.sin(Math.PI * k) * 1.57; });
    if (a === 'gather' && o.extra) return tween(500, k => { o.g.position.y += Math.sin(Math.PI * k) * 0.01; });   /* the second time (his tap): a little hop only */
    if (a === 'gather') {   /* colour lesson: a red square and a blue triangle come; the red square slides next to the red circle, the blue one stays apart (review 2: "red goes together" needs more than one red thing) */
      const p0 = o.g.position, dx = tall ? 1.35 : 2.4, dy = tall ? 0.75 : 0.85;
      const same = showcase('square', o.color, 0, 0.6, p0.clone().add(new THREE.Vector3(dx, dy, 0))), other = showcase('tri', '#1F6FEB', 0, 0.6, p0.clone().add(new THREE.Vector3(dx, -dy, 0)));
      o.extra = [same, other];
      const from = same.g.position.clone(), to = p0.clone().add(new THREE.Vector3(tall ? 1.0 : 1.4, 0, 0.1));
      return wait(700).then(() => tween(900, k => { same.g.position.lerpVectors(from, to, ease(k)); })).then(() => { pop(); return wait(1600); });
    }
    return tween(1400, k => { o.turn.rotation.y = ease(k) * Math.PI * 2; });
  }
  /* the pure shape, glowing (Esti 2026-11-26): when the voice names the shape, a soft gold outline of the exact shape lights up on the object,
     so a cupcake, a tire or a hay bale is never in doubt: it is that shape. New look only. */
  function glowOutline(o, on) {
    if (!LK || !o || o.solid || !KINDS[o.k] || KINDS[o.k].solid || !o.mesh || cfg.sortBy === 'color' || cfg.plain) return Promise.resolve();   /* plain games: the piece IS the plain shape; a gold ring would make a circle look two-coloured */   /* sorting by colour: no gold ring round a red circle (is it red or yellow?) */
    if (!o.glow) {
      const pts = shapeOf(o.k).s.getPoints(96).map(p => new THREE.Vector3(p.x, p.y, 0)); if (pts[0].distanceTo(pts[pts.length - 1]) < 1e-3) pts.pop();
      const z = (cfg.thinFlat ? 0.03 : DEPTH / 2) + (cfg.thinFlat ? 0.03 : BEV) * 1.25 + 0.012;
      const m = new THREE.MeshBasicMaterial({ color: '#FFE27A', transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.0), 240, 0.045, 8, true), m); tube.position.z = z; tube.renderOrder = 4;
      const soft = new THREE.Mesh(tube.geometry, new THREE.MeshBasicMaterial({ color: '#FFC94A', transparent: true, opacity: 0, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending })); soft.scale.set(1, 1, 1); soft.position.z = z; soft.renderOrder = 4;
      o.mesh.add(tube, soft); o.glow = { tube, soft };
    }
    const a0 = o.glow.tube.material.opacity, a1 = on ? 0.95 : 0;
    return tween(450, k => { const a = a0 + (a1 - a0) * k; o.glow.tube.material.opacity = a; o.glow.soft.material.opacity = a * 0.5; });
  }
  function lessonFor(L, o) {
    const n = o.marks.length, steps = [() => { glowOutline(o, true); }];
    if (L.kind === 'solid') {   /* a solid shape: its name, what it is like, what it does; he taps it to make it do it */
      steps.push('This is a ' + L.word + '.', L.like, () => solidAction(o, L.action), ...(L.rule || []));
      if (L.tap) steps.push(L.tap, () => { setName('tap'); task = [L.tap]; return tapShape(o, L.tap, () => Promise.all([say(L.tapSay || 'Yes!'), solidAction(o, L.action)])); }, () => { setName('learn'); task = null; });
      if (!L.chant) return steps;
      steps.push(() => { chant(true); }, 'Clap it with me! Tap the hands.');
      L.chant.forEach(c => steps.push(c[0], () => claps(o, c[1])));
      steps.push(() => { chant(false); burst(o.g.position, 30); chime(true); return cheer(mendy); });
      return steps;
    }
    if (L.short) {   /* the sorter's quick review: name it, count its corners (or trace it round), its rule */
      steps.push('This is a ' + L.word + '.');
      if (n) o.marks.forEach((m, i) => steps.push(() => lightCorner(o, i), i < n - 1 ? NUMS[i] : cap(WORDS[n]) + ' corners!'));
      else steps.push(() => traceRound(o, 1200), 'No corners!');
      (L.rule || []).forEach(r => { if (n && /side/i.test(r)) { steps.push(() => clearCorners(o), r, ...sideSteps(o).slice(0, -3), () => { tracer.visible = false; }, () => wait(400), () => clearBars(o)); } else steps.push(r); });   /* a rule about sides lights every side */
      steps.push(() => { clearCorners(o); return wait(200); });
      if (L.tapCorners && n) steps.push('Your turn! Tap each corner.', () => { setName('tap'); task = ['Tap each corner.']; return tapCorners(o); }, () => { setName('learn'); task = null; }, cap(WORDS[n]) + ' corners!', () => clearCorners(o));
      if (L.chant) { steps.push(() => { chant(true); }, 'Clap it with me! Tap the hands.'); L.chant.forEach(c => steps.push(c[0], () => claps(o, c[1], c[2]))); steps.push(() => { chant(false); return cheer(mendy); }); }
      steps.push(() => glowOutline(o, false));
      return steps;
    }
    if (L.kind === 'circle') {
      steps.push('This is a ' + L.word + '.', 'Watch the ball go all the way round.', () => traceRound(o), 'Round and round!', 'No corners. No straight sides.',
        'Your turn! Tap the circle.', () => { setName('tap'); task = ['Tap the circle.']; return tapShape(o); }, () => { setName('learn'); task = null; },
        ...(L.rule || []));
    } else {
      steps.push(L.first || 'This is a ' + L.word + '.', 'Count the sides with me.');
      for (let i = 0; i < n; i++) steps.push(() => traceSide(o, i, L.sideColors && L.sideColors[i]), i < n - 1 ? NUMS[i] : cap(WORDS[n]) + ' sides!');
      steps.push(() => { tracer.visible = false; }, ...(L.sidesLine || []), 'Now count the corners.');
      for (let i = 0; i < n; i++) steps.push(() => lightCorner(o, i), i < n - 1 ? NUMS[i] : cap(WORDS[n]) + ' corners!');
      steps.push(() => { clearCorners(o); return wait(300); }, 'Your turn! Tap each corner and count.', () => { setName('tap'); task = ['Tap each corner.']; return tapCorners(o); },
        () => { setName('learn'); task = null; }, cap(WORDS[n]) + ' corners! Great counting!', () => clearCorners(o), ...(L.rule || []));
    }
    steps.push(() => { chant(true); o.marks.forEach(m => { m.material = cornerMat; m.scale.setScalar(1.15); }); }, 'Clap it with me! Tap the hands.');
    L.chant.forEach(c => steps.push(c[0], () => claps(o, c[1], c[2])));
    steps.push(() => { chant(false); burst(o.g.position, 30); chime(true); clearCorners(o); clearBars(o); return cheer(mendy); });
    if (L.noTurn) { steps.push(() => glowOutline(o, false)); return steps; }
    if (L.turn != null) steps.push(L.turnLine || 'Watch. I turn it.', () => tween(1100, k => { o.turn.rotation.z = ease(k) * L.turn; }), 'Still a ' + L.word + '!');
    steps.push('Now I make it small.', () => tween(800, k => o.g.scale.setScalar(1.25 - ease(k) * 0.7)), 'Small, but still a ' + L.word + '!');
    if (L.big) steps.push('Now big!', () => tween(800, k => o.g.scale.setScalar(0.55 + ease(k) * 1.0)), 'Big, and still a ' + L.word + '!');
    steps.push(() => glowOutline(o, false));
    return steps;
  }

  /* ---------- the game ---------- */

  /* =========== "Fix the shape" mode (cfg.mode === 'fix'): a shape made of 3D sticks has a gap; he drags the stick that closes it =========== */
  const FIXED = cfg.mode === 'fix';
  const stickMat = c => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.2, envMapIntensity: 0.45 });
  const SR = 0.11;   /* stick thickness */
  function stickGeo(len, curvy) {
    if (curvy) { const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-len / 2, 0, 0), new THREE.Vector3(0, len * 0.38, 0), new THREE.Vector3(len / 2, 0, 0)); return new THREE.TubeGeometry(c, 32, SR, 12, false); }
    const g = new THREE.CapsuleGeometry(SR, Math.max(0.01, len - 2 * SR), 6, 12); g.rotateZ(Math.PI / 2); return g;
  }
  function sideOf(corners, i, sc) { const a = corners[i], b = corners[(i + 1) % corners.length];
    return { mid: new THREE.Vector3((a[0] + b[0]) / 2 * sc, (a[1] + b[1]) / 2 * sc, 0), len: Math.hypot(b[0] - a[0], b[1] - a[1]) * sc, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) }; }
  /* the outline: all sides but the missing one; the missing side is ready (hidden) for when it is closed; a flat fill shows when closed */
  function makeOutline(k, miss, color, sc) {
    const { s: shp, corners } = shapeOf(k), g = new THREE.Group(), m = stickMat(color);
    corners.forEach((c, i) => { if (i === miss) return; const sd = sideOf(corners, i, sc), st = new THREE.Mesh(stickGeo(sd.len), m); st.position.copy(sd.mid); st.rotation.z = sd.ang; st.castShadow = true; g.add(st);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(SR * 1.5, 16, 12), m); ball.position.set(c[0] * sc, c[1] * sc, 0); g.add(ball); });
    const last = corners[(miss + 1) % corners.length], j = new THREE.Mesh(new THREE.SphereGeometry(SR * 1.5, 16, 12), m); j.position.set(last[0] * sc, last[1] * sc, 0); g.add(j);
    const gap = sideOf(corners, miss, sc), fill = new THREE.Mesh(new THREE.ShapeGeometry(shp, 32), new THREE.MeshStandardMaterial({ color, roughness: 0.5, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    fill.scale.setScalar(sc); fill.position.z = -0.02; fill.visible = false; g.add(fill);
    const close = new THREE.Mesh(stickGeo(gap.len), m); close.position.copy(gap.mid); close.rotation.z = gap.ang; close.visible = false; g.add(close);
    /* the gap (K clarity, Esti 2026-11-27): a dashed ghost of the missing side, in the shape's colour, shows exactly where the stick goes */
    const mark = new THREE.Group(), nd = Math.max(3, Math.round(gap.len / 0.34)), dm = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false });
    for (let i = 0; i < nd; i++) { const d = new THREE.Mesh(new THREE.CapsuleGeometry(SR * 0.75, gap.len / nd * 0.45, 4, 8), dm); d.rotation.z = Math.PI / 2; d.position.x = -gap.len / 2 + (i + 0.5) * gap.len / nd; mark.add(d); }
    mark.position.copy(gap.mid); mark.rotation.z = gap.ang; mark.position.z = 0.05; g.add(mark);
    scene.add(g);
    return { g, k, corners, sc, gap, fill, close, mark, marks: [], color };
  }
  let OL = null, roundN = 0;   /* the outline being fixed; a count of rounds, so each stick has its own name */
  const OL_AT = () => tall ? new THREE.Vector3(0, 1.7, 0.3) : new THREE.Vector3(0, 1.75, 0.2);
  function gapWorld() { return OL ? OL.mark.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(); }
  function closeIt(o) {   /* the gap closes: the stick snaps in, the shape fills with colour, a dot runs all round it */
    OL.mark.visible = false; OL.close.visible = true; OL.close.scale.set(0.01, 1, 1); plink();
    return tween(350, k => OL.close.scale.set(Math.max(0.01, k), 1, 1)).then(() => { OL.fill.visible = true; chime(true); burst(OL.g.position.clone(), 26); return cheer(mendy); });
  }
  function tryInGap(o) {   /* a wrong stick is laid in the gap for a moment, so he SEES why it does not fit */
    const t = new THREE.Mesh(o.L != null ? stickGeo(o.L, o.kind === 'curvy') : o.mesh.geometry, o.mat); t.position.copy(OL.gap.mid); t.rotation.z = OL.gap.ang; t.position.z = 0.04; OL.g.add(t);
    return wait(1400).then(() => { OL.g.remove(t); });
  }
  function makeStick(id, kind, len, color, slot, ang) {   /* kind: 'right' | 'short' | 'long' | 'curvy' */
    const L = kind === 'short' ? len * 0.55 : kind === 'long' ? len * 1.5 : len;
    const mat = stickMat(color), mesh = new THREE.Mesh(stickGeo(L, kind === 'curvy'), mat); mesh.castShadow = true;
    /* K clarity: every stick lies the same way as the gap, so he compares only the length (no colour clue, no perspective trick) */
    const turn = new THREE.Group(); turn.add(mesh); turn.rotation.z = ang || 0;
    const g = new THREE.Group(); g.add(turn); scene.add(g);
    const o = { id, k: 'stick-' + kind, kind, box: kind === 'right' ? 0 : -1, g, turn, mesh, mat, marks: [], corners: [], scale: 1, home: new THREE.Vector3(), phase: (shapes.length * 1.7) % 6.28, inBox: false, busy: false, slot };
    /* the sticks are nearer to him than the shape, so perspective would make them look longer: each stick is sized so that, on HIS screen,
       the right one is exactly as long as the gap (K-CLARITY-RULES 7: no trick he could argue about); and no stick is ever off the screen */
    o.L = L; const a = Math.abs(Math.cos(ang || 0)) > 0.75 && tall;   /* a phone: lying-down sticks go in rows, one under the other */
    o.home.copy(fixSlot(slot, a));
    const V = viewFor('wide'), pc = new THREE.PerspectiveCamera(tall ? 46 : 40, innerWidth / innerHeight, 0.1, 100); pc.position.copy(V.pos); pc.lookAt(V.look); pc.updateMatrixWorld();
    const ends = (obj, p, q) => { obj.updateMatrixWorld(true); const A = obj.localToWorld(p.clone()).project(pc), B = obj.localToWorld(q.clone()).project(pc);
      const ax = (A.x + 1) / 2 * innerWidth, bx = (B.x + 1) / 2 * innerWidth; return { len: Math.hypot(ax - bx, (A.y - B.y) / 2 * innerHeight), x0: Math.min(ax, bx), x1: Math.max(ax, bx) }; };
    const gapPx = OL ? ends(OL.g, OL.gap.mid.clone().add(new THREE.Vector3(-Math.cos(OL.gap.ang), -Math.sin(OL.gap.ang), 0).multiplyScalar(OL.gap.len / 2)),
      OL.gap.mid.clone().add(new THREE.Vector3(Math.cos(OL.gap.ang), Math.sin(OL.gap.ang), 0).multiplyScalar(OL.gap.len / 2))).len : 0;
    const place = f => { mesh.scale.setScalar(f); o.home.y = Math.max(fixSlot(slot, a).y, 0.35 + L * f * Math.abs(Math.sin(ang || 0)) / 2); g.position.copy(o.home);
      g.rotation.x = -Math.atan2(pc.position.y - o.home.y, pc.position.z - o.home.z); return ends(mesh, new THREE.Vector3(-L / 2, 0, 0), new THREE.Vector3(L / 2, 0, 0)); };
    let f = 1;
    if (gapPx) for (let it = 0; it < 3; it++) { const e = place(f); f *= gapPx / (e.len * len / L); }
    for (let n = 0; n < 60; n++) { const e = place(f), m = 14; if (e.x0 < m) o.home.x += 0.06; else if (e.x1 > innerWidth - m) o.home.x -= 0.06; else break; }
    o.px = place(f); if (OL) OL.gapPx = gapPx; mesh.userData.shape = o; shapes.push(o); return o;
  }
  W.fixPx = () => OL && { gap: OL.gapPx, w: innerWidth, sticks: shapes.filter(x => x.L != null && x.g.visible).map(x => ({ kind: x.kind, len: x.px.len, x0: x.px.x0, x1: x.px.x1 })) };   /* the test: on screen, the right stick is as long as the gap */
  function fixSlot(i, rows) { if (rows) return new THREE.Vector3(0, 0.92, [2.4, 3.4, 4.3][i]);
    const S = tall ? [[-1.0, 2.7], [1.0, 3.6], [0, 4.4]] : [[-2.3, 3.0], [2.3, 3.0], [0, 3.9]]; return new THREE.Vector3(S[i][0], 0.92, S[i][1]); }
  function setRound(R) {
    if (OL) scene.remove(OL.g); shapes.splice(0).forEach(o => scene.remove(o.g));
    OL = makeOutline(R.k, R.miss, R.color, R.sc || (tall ? 1.6 : 2.1)); OL.g.position.copy(OL_AT()); OL.g.rotation.x = -Math.atan2(viewFor('wide').pos.y - OL.g.position.y, viewFor('wide').pos.z - OL.g.position.z);   /* faces the camera: a square looks square */
    roundN++; R.options.forEach((kind, i) => makeStick('r' + roundN + 's' + i, kind, OL.gap.len, R.color, i, OL.gap.ang));
  }
  async function fixLesson() {
    const L = cfg.fixLesson;
    OL = makeOutline(L.k, L.miss, L.color, 1.05); OL.g.position.set(0.8, 2.0, 0.9);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), new THREE.MeshPhysicalMaterial({ color: '#F2A900', clearcoat: 1, roughness: 0.3 })); OL.g.add(ball); ball.position.set(0, -0.2, 0.15);
    const roll = (out) => { const a = ball.position.clone(), b = out ? OL.gap.mid.clone().multiplyScalar(1.9) : new THREE.Vector3(0.15, -0.1, 0.15);
      return tween(1300, k => { ball.position.lerpVectors(a, b, ease(k)); ball.rotation.z -= 0.2; }).then(() => { if (out) { ball.visible = false; tone([400, 300], 'sine', .12, .3, .12); } }); };
    W.tapGap = true;
    const steps = [() => { cheer(mendy); }, ...cfg.intro, { wait: 200 },
      L.first, 'Watch the ball.', () => roll(true), 'Oops! The ball rolled out!', 'There is a gap.',
      'Where is the gap? Tap it!', () => { setName('tap'); task = ['Tap the gap.']; return tapPoint(gapWorld, 'Tap the gap.'); }, () => { setName('learn'); task = null; },
      'Yes! That is the gap.', 'Watch. I close it.', () => closeIt(), () => { ball.visible = true; ball.position.set(0, -0.2, 0.15); return roll(false); }, 'Now the ball stays in!',
      ...L.rule,
      () => { chant(true); }, 'Clap it with me! Tap the hands.'];
    L.chant.forEach(c => steps.push(c[0], () => claps(OL, c[1])));
    steps.push(() => { chant(false); return cheer(mendy); });
    return play(steps);
  }
  function tapPoint(getPos, nagLine) {   /* he taps a place (the gap) */
    return new Promise(done => {
      let nag = null;
      const remind = () => { clearTimeout(nag); nag = setTimeout(() => { if (shapeTap) { say(nagLine); remind(); } }, FAST ? 1e9 : 9000); };
      W.tapPt = () => toScreen(getPos());
      shapeTap = (cx, cy) => { const p = toScreen(getPos()); if (Math.hypot(p.x - cx, p.y - cy) > Math.max(70, innerWidth * 0.07)) return; shapeTap = null; clearTimeout(nag); W.shapeTaps = (W.shapeTaps || 0) + 1; W.tapPt = null; chime(true); done(); };
      remind();
    });
  }
  async function fixGame() {
    setName('watch'); dots(1);
    await camTo('wide', 1200);
    const R0 = cfg.rounds[0]; setRound(R0);
    const right = shapes.find(o => o.box === 0);
    let ok = await play([cfg.watchLine, () => { handOn = right; hand.style.display = 'block'; return wait(500); },
      () => moveTo(right, gapWorld().setY(Math.max(1.25, gapWorld().y)), 1400), () => { hand.style.display = 'none'; handOn = null; right.g.visible = false; return closeIt(); },
      R0.done, cfg.yourTurn]);
    if (!ok) return;
    let helped = false;
    for (let r = 1; r < cfg.rounds.length; r++) { ok = await fixRound(cfg.rounds[r], false, () => helped, v => { helped = v; }); if (!ok) return; }
    if (W.misses <= 1 && cfg.bonusRounds) {
      W.bonus = true; ok = await play(['Bonus round! You are so good at this.', 'This one is tricky.']); if (!ok) return;
      for (const R of cfg.bonusRounds) { ok = await fixRound(R, true, () => true, () => {}); if (!ok) return; }
    }
    if (OL) { scene.remove(OL.g); OL = null; } shapes.splice(0).forEach(o => scene.remove(o.g));
    mistake();
  }
  function fixRound(R, bonus, getHelped, setHelped) {
    return new Promise(resolve => {
      setName(bonus ? 'bonus' : 'find'); dots(2); setRound(R); allow = true;
      const ask = [R.ask || cfg.ask]; task = ask;
      idleFn = n => { const t = shapes.find(o => o.box === 0); if (!t) return; W.reminders = (W.reminders || 0) + 1;
        play(n === 1 ? [...ask, cfg.hint, () => pointAt(t)] : [cfg.hint2, () => pointAt(t)]); };
      idle();
      onDrop = (o, bi) => {
        idle();
        if (bi < 0) { goHome(o); play(['Put it in the gap.']); return; }
        if (o.box === 0) {
          allow = false; onDrop = null; stopIdle(); o.g.visible = false;
          closeIt(o).then(() => play([R.done, { wait: 300 }])).then(ok => resolve(ok));
          return;
        }
        if (!bonus) W.misses++; chime(false);
        o.g.visible = false;
        const lines = cfg.why[o.kind];
        tryInGap(o).then(() => { o.g.visible = true; o.g.position.copy(o.home); });
        const steps = [...lines];
        const fits = shapes.find(x => x.box === 0 && x !== o && !x.inBox);   /* a wrong stick: the hand then shows the one that fits, going to the gap (review round 2) */
        if (fits) steps.push('This one fits.', () => pointAt(fits, true, gapWorld().setY(1.1)));
        if (W.misses >= 2 && !getHelped() && !bonus) { setHelped(true); steps.push(cfg.remember); }
        steps.push(...ask);
        play(steps);
      };
      play([R.say, ...ask]);
    });
  }


  /* =========== "Patterns" mode (cfg.mode === 'pattern'): beads on a 3D string; he drags the bead that comes next =========== */
  const PATTERNED = cfg.mode === 'pattern';
  const BEADS = cfg.beads || {};
  let PS = null;   /* the pattern being built: { g, slots, beads, next, R } */
  function beadMesh(type) {
    const B = BEADS[type];
    const TM = LK && LK.bead && !(cfg.plain && B.kind && KINDS[B.kind]) ? LK.bead(type, B, () => shapeOf(B.kind).s) : null;   /* the world's own things (bakery: cupcakes, iced cookies); cfg.plain: a shape item is a plain flat shape in one colour, never a thick cookie (K-CLARITY-RULES 1, 11) */
    if (TM) { const hull = new THREE.Mesh(new THREE.SphereGeometry(0.46, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); TM.add(hull); TM.userData.hull = hull; TM.userData.upright = true; if (tall) TM.scale.setScalar(0.72); return TM; }
    const mat = new THREE.MeshPhysicalMaterial({ color: B.color, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.5 });
    let geo;
    if (B.kind === 'cube') geo = new RoundedBoxGeometry(0.6, 0.6, 0.6, 4, 0.12);
    else if (B.kind === 'drum') { geo = new THREE.CylinderGeometry(0.34, 0.34, 0.5, 32); geo.rotateX(Math.PI / 2); }
    else if (B.kind && KINDS[B.kind]) { geo = new THREE.ExtrudeGeometry(shapeOf(B.kind).s, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4, curveSegments: 32 }); geo.translate(0, 0, -0.11); geo.scale(0.52, 0.52, 1); }
    else geo = new THREE.SphereGeometry(0.37, 32, 24);
    const m = new THREE.Mesh(geo, mat); m.castShadow = true; if (tall) m.scale.setScalar(0.72); return m;
  }
  function beadNote(type) { tone([BEADS[type].note || 523], BEADS[type].kind === 'drum' ? 'square' : 'triangle', 0, .28, .12); if (BEADS[type].kind === 'drum') clap(); }
  function makeBead(id, type, at, slot) {
    const vis = beadMesh(type), mesh = vis.userData.hull || vis, turn = new THREE.Group(); turn.add(vis); const g = new THREE.Group(); g.add(turn); scene.add(g); g.position.copy(at);
    const o = { id, k: type, type, box: -1, g, turn, mesh, vis, mat: vis.material, marks: [], corners: [], scale: 1, home: at.clone(), phase: (shapes.length * 1.3) % 6.28, inBox: false, busy: false, slot, upright: !!vis.userData.upright };
    mesh.userData.shape = o; shapes.push(o); return o;
  }
  const STR = () => tall ? { y: 1.5, z: -0.7, sp: 0.56, copyZ: 0.5 } : { y: 1.7, z: -0.2, sp: 1.08, copyZ: 1.2 };
  function slotAt(i, n, z) { const S = STR(), sp = tall && n > 1 ? Math.min(S.sp, 3.2 / (n - 1)) : S.sp; return new THREE.Vector3((i - (n - 1) / 2) * sp, S.y, z == null ? S.z : z); }   /* phone: a long row (8) closes up a little so its ends stay on screen (review round 2) */
  function trayAt(i, n) { const z = tall ? 2.0 : 2.9, sp = tall ? 0.95 : 1.6;   /* phone: close enough that the outer pieces stay on screen */ return new THREE.Vector3((i - (n - 1) / 2) * sp, 0.9, z); }
  function stringAt(n, z) {
    const S = STR(), len = (n - 1) * S.sp + 1.2;
    const BD = LK && LK.board ? LK.board(len) : null;   /* bakery: a cake board instead of a bead string */
    if (BD) { if (tall) BD.scale.set(1, 0.72, 0.72); BD.position.set(0, S.y, z == null ? S.z : z); scene.add(BD); return BD; }
    const g = new THREE.Group();
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 12), new THREE.MeshStandardMaterial({ color: '#7A4A26', roughness: 0.8 })); cord.rotation.z = Math.PI / 2; g.add(cord);
    [-1, 1].forEach(sd => { const knot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), cord.material); knot.position.x = sd * len / 2; g.add(knot); });
    g.position.set(0, S.y, z == null ? S.z : z); scene.add(g); return g;
  }
  const ghost = (LK && LK.treasures.marker && LK.treasures.marker()) || new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 12, 40), new THREE.MeshBasicMaterial({ color: '#F5B400' })); ghost.visible = false; scene.add(ghost);

  function setPattern(R) {
    ringsOff(); if (PS) { PS.parts.forEach(p => scene.remove(p)); } shapes.splice(0).forEach(o => scene.remove(o.g));
    const n = R.seq.length, parts = [], beads = [];
    patN = R.copy ? 0 : n;
    const z = R.copy ? STR().copyZ : null;
    /* copy: Mendy's row stands well behind the row he fills, so the two rows never overlap (K-CLARITY-RULES 9: one thing to look at) */
    const model = [];
    if (R.copy) { const MZ = tall ? -2.0 : -1.8; parts.push(stringAt(n, MZ)); R.seq.forEach((t, i) => { const m = beadMesh(t); m.position.copy(slotAt(i, n, MZ)); scene.add(m); parts.push(m); model.push(m); }); }   /* model: Mendy's row, sung and glowed when he copies */
    parts.push(stringAt(n, z));
    const fixing = R.fixAt != null, blanks = fixing ? 0 : R.copy ? n : R.blanks;
    let bad = null;
    R.seq.forEach((t, i) => { if (i < n - blanks) { const m = beadMesh(fixing && i === R.fixAt ? R.wrong : t); m.position.copy(slotAt(i, n, z)); scene.add(m); parts.push(m); beads.push(m); if (fixing && i === R.fixAt) bad = m; } });
    const holes = [], holeMat = new THREE.MeshStandardMaterial({ color: '#EFE3CF', roughness: 0.8 });   /* the later spots are plain; only the next one glows */   /* copy: every spot he will fill shows its empty place, so he sees the row is as long as Mendy's (review round 2) */
    if (R.copy) for (let i = 0; i < n; i++) { const h = ghost.clone(); h.position.copy(slotAt(i, n, z)); if (h.isGroup) h.scale.setScalar(tall ? 0.72 : 1); h.traverse(c => { if (c.isMesh) c.material = holeMat; }); h.visible = false; scene.add(h); parts.push(h); holes.push(h); }
    PS = { parts, beads, model, next: fixing ? R.fixAt : n - blanks, n, z, R, bad, showRing: !fixing, holes };
    const types = R.tray; types.forEach((t, i) => makeBead('b' + (++beadN), t, trayAt(i, types.length), i));
    markNext();
  }
  let beadN = 0;
  function markNext() {
    if (!PS) return; const want = PS.R.seq[PS.next];
    shapes.forEach(o => { if (!o.inBox) o.box = o.type === want ? 0 : -1; });
    (PS.holes || []).forEach((h, i) => { h.visible = i > PS.next; });
    if (PS.next < PS.n && PS.showRing) { ghost.visible = true; ghost.position.copy(slotAt(PS.next, PS.n, PS.z)); if (ghost.isGroup) ghost.scale.setScalar(tall ? 0.72 : 1); } else ghost.visible = false;
  }
  function placeBead(o) {   /* the right bead slides onto the string; a fresh one appears in the tray */
    const at = slotAt(PS.next, PS.n, PS.z), type = o.type, slot = o.slot, fixAt = PS.R.fixAt;
    o.inBox = true; o.box = -1; PS.next = fixAt != null ? PS.n : PS.next + 1;
    if (fixAt != null && PS.bad) { const b = PS.bad; PS.bad = null; tween(250, k => b.scale.setScalar(Math.max(0.001, 1 - k))).then(() => scene.remove(b)); }
    return moveTo(o, at, 380, 0.5).then(() => { o.g.rotation.set(0, 0, 0); if (fixAt != null) PS.beads.splice(fixAt, 1, o.vis || o.mesh); else PS.beads.push(o.vis || o.mesh); beadNote(type); pop();
      const fresh = makeBead('b' + (++beadN), type, trayAt(slot, PS.R.tray.length), slot); fresh.g.scale.setScalar(0.01); tween(300, k => fresh.g.scale.setScalar(Math.max(0.01, k)));
      markNext(); });
  }
  function sing(upto, line) {   /* the beads bounce in order with a note each, while the voice says the pattern */
    const useModel = PS.R.copy && upto === 0 && PS.model && PS.model.length;   /* copy: sing Mendy's row, the one to copy (it used to sing nothing) */
    const list = useModel ? PS.model : PS.beads.slice(0, upto == null ? PS.beads.length : upto);
    const bounce = list.reduce((p, m, i) => p.then(() => { const y0 = m.parent === scene ? m.position.y : 0, t = PS.R.seq[i], row = useModel ? m.position.z : PS.z; beadNote(t);
      return tween(260, k => { if (m.parent === scene) m.position.y = y0 + Math.sin(Math.PI * k) * 0.3; else m.parent.parent.position.y = slotAt(i, PS.n, row).y + Math.sin(Math.PI * k) * 0.3; }); }), Promise.resolve());
    return Promise.all([say(line || PS.R.seq.slice(0, list.length).map(t => BEADS[t].word).join(', ') + '.'), bounce]);
  }
  const wordsOf = (seq, k) => seq.slice(0, k).map(t => BEADS[t].word).join(', ');
  let glowHeld = false;   /* pictures (shot=1): the help glow stays until his next touch, like the hand */
  let helpRings = [];   /* copy: after a miss a thick gold ring sits on the cupcake to copy AND on the same one in the tray, so he sees WHICH one (review round 2) */
  function ringsOff() { helpRings.forEach(r => { if (r.parent) r.parent.remove(r); }); helpRings = []; }
  function ringOn(target) { if (!target) return; const r = new THREE.Mesh(new THREE.TorusGeometry(tall ? 0.34 : 0.55, tall ? 0.05 : 0.075, 12, 48), new THREE.MeshBasicMaterial({ color: '#FFB000', depthTest: false, transparent: true, opacity: 1 })); r.renderOrder = 999;   /* drawn after the soft glow, so the whole ring shows */
    if (target.g) { r.position.set(0, 0.05, 0.1); target.g.add(r); } else { r.position.copy(target.position); r.position.z += 0.1; scene.add(r); } helpRings.push(r); }
  function coreGlow(on) { const c = PS.R.core || 2; (PS.R.copy && PS.model && PS.model.length ? PS.model.slice(Math.min(PS.next, PS.model.length - 1), Math.min(PS.next, PS.model.length - 1) + 1) : PS.beads.slice(0, c)).forEach(m => { if (m.userData.glow) { m.userData.glow(on); return; } m.material.emissive = new THREE.Color(on ? '#FFC400' : '#000000'); m.material.emissiveIntensity = on ? 0.5 : 0; }); }   /* world items glow with a soft halo behind them, so their own colour never changes (a red car stays red) */
  function patternRound(R, bonus, help) {
    return new Promise(resolve => {
      setName(bonus ? 'bonus' : 'find'); dots(2); setPattern(R); allow = true;
      const ask = [R.fixAt != null ? 'Find the wrong one. Put the right one on it.' : R.copy ? 'Make the same pattern below.' : 'What comes next?']; task = ask;
      idleFn = n => { const t = shapes.find(o => o.box === 0 && !o.inBox); if (!t) return; W.reminders = (W.reminders || 0) + 1;
        play(n === 1 ? [() => (R.copy ? sing(0, null) : sing()), ...ask, () => pointAt(t)] : [cfg.hint2, () => pointAt(t)]); };   /* copy: sing Mendy's row, not his half-made one */
      idle();
      onDrop = (o, bi) => {
        idle();
        if (bi < 0) { goHome(o); play([cfg.putLine || 'Put it on the string.']); return; }
        if (bi === 2) { goHome(o); play(['That one is right.', 'Find the wrong one.']); return; }
        if (o.box === 0) {
          chime(true); const last = PS.R.fixAt != null || PS.next + 1 >= PS.n;
          if (last) { allow = false; onDrop = null; stopIdle(); }
          placeBead(o).then(() => {
            if (!last) { play([R.copy ? 'Yes! And next?' : 'Yes! And next?']); return; }
            ghost.visible = false;
            play([() => sing(null, R.sayAll), R.done || 'You made the pattern!', () => cheer(mendy), { wait: 200 }]).then(ok => resolve(ok));
          });
          return;
        }
        if (!bonus) W.misses++; chime(false); goHome(o);
        /* the first miss already SHOWS how (K-CLARITY-RULES 16): the part that repeats glows while the pattern is sung; fixing: the ring sits on the wrong one */
        const rightOne = shapes.find(x => x.box === 0 && !x.inBox && x.g.visible);   /* the first miss also points at the one that fits (review round 2) */
        const steps = ['Not that one.', () => { coreGlow(true); if (R.copy && PS.model) { ringsOff(); ringOn(PS.model[Math.min(PS.next, PS.model.length - 1)]); ringOn(rightOne); } }, ...(R.copy ? ['Look at the pattern above.'] : []), () => sing(R.copy ? 0 : R.fixAt != null ? undefined : PS.next, null), () => wait(900), () => { if (SHOT) glowHeld = true; else coreGlow(false); }];   /* the glow stays a moment after the song, so he sees the part that repeats */
        if (R.fixAt != null && !PS.showRing) steps.push(() => { PS.showRing = true; markNext(); }, 'The wrong one is in the ring.');
        if (R.fixAt == null && rightOne) steps.push('This one fits.', () => pointAt(rightOne, true, slotAt(PS.next, PS.n, PS.z)), () => { if (!SHOT) ringsOff(); });
        if (W.misses >= 2 && !help.done && !bonus) { help.done = true; steps.push(cfg.remember, () => coreGlow(true), () => say(wordsOf(R.seq, R.core || 2) + ' repeats.'), () => wait(600), () => coreGlow(false)); }
        steps.push(...ask);
        play(steps);
      };
      play([R.say, () => sing(R.copy ? 0 : undefined, R.copy ? null : undefined), ...ask].filter(Boolean));
    });
  }
  async function patternLesson() {
    const L = cfg.patternLesson; setPattern({ seq: L.seq, blanks: 0, tray: [] });
    camTo('close', 10);
    PS.parts.forEach(p => { if (p.isGroup || p.isMesh) { p.position.z += 1.0; p.position.y += 0.3; } });   /* phone: the row already fills the width (six cupcakes edge to edge); bigger cut off both ends, so it stays this size */
    const steps = [() => { cheer(mendy); }, ...cfg.intro, { wait: 200 }, L.first, () => sing(null, L.say), 'The same part repeats!',
      () => coreGlow(true), L.coreLine, () => wait(500), () => coreGlow(false),
      'Your turn! Tap each one to sing.', () => { setName('tap'); task = ['Tap each one.']; return tapBeads(); }, () => { setName('learn'); task = null; },
      () => { chant(true); }, 'Clap the pattern with me!'];
    L.chant.forEach(c => steps.push(c[0], () => claps({ marks: [], g: PS.parts[0] }, c[1])));
    steps.push(() => { chant(false); return cheer(mendy); });
    return play(steps);
  }
  function tapBeads() {   /* he taps the beads one by one; each sings its note and the voice says its name */
    return new Promise(done => {
      const left = PS.beads.slice(); let nag = null;
      const remind = () => { clearTimeout(nag); nag = setTimeout(() => { if (cornerTap) { say('Tap each one.'); remind(); } }, FAST ? 1e9 : 9000); };
      W.cornerPtsP = () => left.map(m => toScreen(m.getWorldPosition(new THREE.Vector3())));
      cornerTap = (cx, cy) => {
        let best = -1, bd = 1e9; left.forEach((m, i) => { const p = toScreen(m.getWorldPosition(new THREE.Vector3())); const d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = i; } });
        if (best < 0 || bd > Math.max(56, innerWidth * 0.05)) return;
        const m = left.splice(best, 1)[0], i = PS.beads.indexOf(m), t = PS.R.seq[i]; W.cornerTaps = (W.cornerTaps || 0) + 1; beadNote(t); hush(); say(cap(BEADS[t].word) + '!');
        const y0 = m.position.y; tween(260, k => { m.position.y = y0 + Math.sin(Math.PI * k) * 0.3; }); remind();
        if (!left.length) { cornerTap = null; W.cornerPtsP = null; clearTimeout(nag); setTimeout(done, FAST ? 0 : 900); }
      };
      remind();
    });
  }
  async function patternGame() {
    setName('watch'); dots(1); PS.parts.forEach(p => scene.remove(p)); PS = null;
    await camTo('wide', 1200);
    const R0 = cfg.rounds[0]; setPattern(R0);
    const right = shapes.find(o => o.box === 0);
    if (R0.copy) {   /* a copy round: Mendy copies his whole row, one by one, naming each (review round 2: the lesson never showed copying) */
      const one = () => { const o = shapes.find(x => x.box === 0 && !x.inBox && x.g.visible); if (!o) return Promise.resolve(); const t = o.type;
        handOn = o; hand.style.display = 'block';
        return wait(400).then(() => moveTo(o, slotAt(PS.next, PS.n, PS.z), 900)).then(() => { hand.style.display = 'none'; handOn = null; return placeBead(o); }).then(() => say(cap(BEADS[t].word) + '.')); };
      const ok0 = await play([R0.watchLine || cfg.watchLine, () => sing(0, R0.say || null), ...R0.seq.map(() => one), R0.watchDone || cfg.watchDone, cfg.yourTurn]);
      if (!ok0) return;
      const help0 = { done: false };
      for (let r = 1; r < cfg.rounds.length; r++) { const ok1 = await patternRound(cfg.rounds[r], false, help0); if (!ok1) return; }
      if (W.misses <= 1 && cfg.bonusRounds) { W.bonus = true; if (!(await play(['Bonus round! You are so good at this.', 'This one is tricky.']))) return;
        for (const R of cfg.bonusRounds) { if (!(await patternRound(R, true, help0))) return; } }
      ghost.visible = false; if (PS) { PS.parts.forEach(p => scene.remove(p)); PS = null; } shapes.splice(0).forEach(o => scene.remove(o.g));
      mistake(); return;
    }
    let ok = await play([cfg.watchLine, () => sing(), cfg.watchAsk || 'What comes next?', () => { handOn = right; hand.style.display = 'block'; return wait(500); },
      () => moveTo(right, slotAt(PS.next, PS.n, PS.z), 1300), () => { hand.style.display = 'none'; handOn = null; return placeBead(right); },
      ...(PS.next < PS.n ? [] : []), R0.watchDone || cfg.watchDone, cfg.yourTurn]);
    if (!ok) return;
    const help = { done: false };
    for (let r = 1; r < cfg.rounds.length; r++) { ok = await patternRound(cfg.rounds[r], false, help); if (!ok) return; }
    if (W.misses <= 1 && cfg.bonusRounds) {
      W.bonus = true; ok = await play(['Bonus round! You are so good at this.', 'This one is tricky.']); if (!ok) return;
      for (const R of cfg.bonusRounds) { ok = await patternRound(R, true, help); if (!ok) return; }
    }
    ghost.visible = false; if (PS) { PS.parts.forEach(p => scene.remove(p)); PS = null; } shapes.splice(0).forEach(o => scene.remove(o.g));
    mistake();
  }


  /* =========== "Building" mode (cfg.mode === 'puzzle'): a picture board with shape-shaped holes; he drags pieces in to build it =========== */
  const PUZZLED = cfg.mode === 'puzzle';
  let PZ = null, pzN = 0, lastPt = { x: 0, y: 0 };
  const BOARD_AT = () => tall ? new THREE.Vector3(0, 2.0, 0.6) : new THREE.Vector3(0, 2.35, 0.9);
  function centroidOf(k) { const P = KINDS[k].pts; return P ? [P.reduce((t, p) => t + p[0], 0) / P.length, P.reduce((t, p) => t + p[1], 0) / P.length] : [0, 0]; }
  function slotCenter(sl) { const c = centroidOf(sl.k), sc = sl.s || 1, cs = Math.cos(sl.rot || 0), sn = Math.sin(sl.rot || 0);
    return [sl.off[0] + (c[0] * cs - c[1] * sn) * sc, sl.off[1] + (c[0] * sn + c[1] * cs) * sc]; }
  function setPuzzle(R) {
    if (PZ) scene.remove(PZ.g); shapes.splice(0).forEach(o => scene.remove(o.g));
    const g = new THREE.Group(), BS = tall ? 0.95 : 1.35; g.scale.setScalar(BS); g.position.copy(BOARD_AT());
    const backM = LK && cfg.world === 'beach' ? new THREE.MeshStandardMaterial({ color: '#EBCF98', roughness: 0.9 }) : new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.8 });   /* beach: a smooth wet-sand slab */
    const back = new THREE.Mesh(new RoundedBoxGeometry(R.w || 3.4, R.h || 3.4, 0.12, 4, 0.1), backM); back.position.z = -0.12; back.receiveShadow = true; g.add(back);
    if (LK && cfg.world === 'beach') { const rim = new THREE.Mesh(new RoundedBoxGeometry((R.w || 3.4) + 0.24, (R.h || 3.4) + 0.24, 0.1, 4, 0.12), new THREE.MeshStandardMaterial({ color: '#2FB7C9', roughness: 0.4 })); rim.position.z = -0.17; g.add(rim); }   /* a turquoise rim */
    const slots = R.slots.map((sl, i) => {
      const at = slotCenter(sl), hole = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(sl.k).s, 32), new THREE.MeshStandardMaterial({ color: '#B89F72', roughness: 0.9 }));
      hole.scale.setScalar((sl.s || 1) * 0.9); hole.rotation.z = sl.rot || 0; hole.position.set(at[0], at[1], -0.04 + (sl.z || 0)); g.add(hole);   /* the fill is a little smaller, so every hole has its own dark border inside it: two holes side by side never look like one */
      const rimH = new THREE.Mesh(hole.geometry, new THREE.MeshStandardMaterial({ color: '#5A4528', roughness: 0.9 })); rimH.scale.setScalar(sl.s || 1); rimH.rotation.z = sl.rot || 0; rimH.position.set(at[0], at[1], -0.05 + (sl.z || 0)); g.add(rimH); hole.userData.rim = rimH;   /* a dark edge round each hole: the hole he fills is easy to see (K-CLARITY-RULES 9) */
      const edge = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(shapeOf(sl.k).corners.length ? shapeOf(sl.k).corners.map(c => new THREE.Vector3(c[0], c[1], 0)) : Array.from({ length: 48 }, (_, j) => new THREE.Vector3(Math.cos(j / 48 * 6.283) * 0.66, Math.sin(j / 48 * 6.283) * 0.66, 0))),
        new THREE.LineDashedMaterial({ color: '#6E5B3E', dashSize: 0.1, gapSize: 0.06 }));
      edge.computeLineDistances(); edge.scale.setScalar(sl.s || 1); edge.rotation.z = sl.rot || 0; edge.position.set(at[0], at[1], -0.02 + (sl.z || 0)); g.add(edge);
      return { ...sl, at, hole, edge, i, filled: false };
    });
    scene.add(g); g.rotation.x = -Math.atan2(viewFor('wide').pos.y - g.position.y, viewFor('wide').pos.z - g.position.z);
    PZ = { g, slots, R, BS };
    const tray = [...R.slots.map(sl => [sl.k, sl.s || 1]), ...(R.extra || []).map(k => [k, 0.8])];
    const order = tray.map((_, i) => i).sort((a, b) => ((a * 7 + pzN * 3) % tray.length) - ((b * 7 + pzN * 3) % tray.length)); pzN++;
    order.forEach((ti, j) => { const [k, sc] = tray[ti], o = makeShape('p' + pzN + '_' + j, k, R.colors ? R.colors[ti % R.colors.length] : COLORS[(ti + 2) % COLORS.length], 0, sc * BS * 0.8); o.slot = j; o.home.copy(puzzleTray(j, tray.length)); o.g.position.copy(o.home); });
    markSlots();
  }
  function puzzleTray(j, n) { const per = tall ? 3 : 5, row = Math.floor(j / per), col = j % per, cnt = Math.min(per, n - row * per), sp = tall ? 1.2 : 2.0;   /* phone: the outer pieces stay on screen */
    return new THREE.Vector3((col - (cnt - 1) / 2) * sp, 0.92, (tall ? 3.2 : 3.5) + row * 1.3); }
  function markSlots() { if (!PZ) return; shapes.forEach(o => { if (o.inBox) return; const sl = PZ.slots.find(q => !q.filled && q.k === o.k); o.box = sl ? sl.i : -1; }); }
  function slotWorld(sl) { return new THREE.Vector3(sl.at[0], sl.at[1], 0.05).applyMatrix4(PZ.g.matrixWorld); }
  function slotHit(cx, cy) { if (!PZ) return -1; let best = -1, bd = 1e9;
    PZ.slots.forEach(sl => { if (sl.filled) return; const p = toScreen(slotWorld(sl)), d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = sl.i; } });
    return bd < Math.max(90, innerWidth * 0.08) ? best : -1; }
  function fillSlot(o, sl) {   /* the piece slides into its hole and stays there */
    sl.filled = true; o.inBox = true; o.box = -1;
    return moveTo(o, slotWorld(sl), 380, 0.4).then(() => { PZ.g.add(o.g); o.g.position.set(sl.at[0], sl.at[1], 0.06 + (sl.z || 0)); o.g.rotation.set(0, 0, 0); o.g.scale.setScalar(sl.s || 1); o.turn.rotation.z = sl.rot || 0;
      sl.hole.visible = false; sl.edge.visible = false; if (sl.hole.userData.rim) sl.hole.userData.rim.visible = false; pop(); markSlots(); });
  }
  function flashSlot(sl, ms = 900) { if (!sl) return Promise.resolve(); const rm = sl.hole.userData.rim && sl.hole.userData.rim.material, fl = Math.max(2, Math.round(ms / 450)); return tween(ms, k => { const on = Math.sin(k * Math.PI * fl) > 0; sl.edge.material.color.set(on ? '#F5B400' : '#6E5B3E'); if (rm) rm.color.set(on || k >= 1 ? (k >= 1 ? '#5A4528' : '#F5B400') : '#5A4528'); }); }   /* the hint flashes the whole dark edge gold */
  function showSlotFor(o) {   /* a wrong drop SHOWS how (K-CLARITY-RULES 16): the hand sits on the piece, then moves to its own hole while that hole flashes */
    const sl = o.box >= 0 ? PZ.slots[o.box] : null; if (!sl) return Promise.resolve();
    const hw = ms => (SHOT ? new Promise(r => setTimeout(r, ms)) : wait(ms));
    handOn = o; hand.style.display = 'block';
    return hw(1300).then(() => { handOn = null; const p = toScreen(slotWorld(sl)); hand.style.left = p.x + 'px'; hand.style.top = p.y + 'px'; return Promise.all([hw(1800), flashSlot(sl, 1800)]); })
      .then(() => { if (!SHOT) hand.style.display = 'none'; });
  }
  function puzzleRound(R, bonus, help) {
    return new Promise(resolve => {
      setName(bonus ? 'bonus' : 'find'); dots(2); setPuzzle(R); allow = true;
      const ask = [R.ask || cfg.ask]; task = ask;
      idleFn = n => { const t = shapes.find(o => o.box >= 0 && !o.inBox); if (!t) return; W.reminders = (W.reminders || 0) + 1;
        play(n === 1 ? [...ask, cfg.hint, () => pointAt(t)] : [cfg.hint2, () => pointAt(t), () => flashSlot(PZ.slots[t.box])]); };
      idle();
      onDrop = (o, bi) => {
        idle();
        if (bi < 0) { goHome(o); play(['Put it in a hole on the board.']); return; }
        const sl = PZ.slots[bi];
        if (sl.k === o.k && !sl.filled) {
          chime(true); const last = PZ.slots.filter(q => !q.filled).length === 1;
          if (last) { allow = false; onDrop = null; stopIdle(); }
          fillSlot(o, sl).then(() => {
            if (!last) { play(['Yes! It fits!']); return; }
            burst(PZ.g.position.clone(), 40); chime(true);
            play([R.done, () => cheer(mendy), { wait: 300 }]).then(ok => resolve(ok));
          });
          return;
        }
        if (!bonus) W.misses++; chime(false); goHome(o);
        const steps = ['That shape does not fit there.', () => flashSlot(sl, 1600), 'Look at the hole. ' + cap(FAMILY(sl.k)) + ' fits there.'];
        if (o.box >= 0) steps.push('Watch. This one goes here.', () => showSlotFor(o));
        if (W.misses >= 2 && !help.done && !bonus) { help.done = true; steps.push(cfg.remember); }
        steps.push(...ask);
        allow = false; play(steps).then(() => { if (onDrop) allow = true; });
      };
      play([R.say, ...ask].filter(Boolean));
    });
  }
  async function puzzleLesson() {
    const L = cfg.puzzleLesson;   /* two triangles slide together and make a square */
    if (PZ) { scene.remove(PZ.g); PZ = null; } shapes.splice(0).forEach(o => scene.remove(o.g));
    const a = makeShape('la', L.k, '#E03A33', L.rotA || 0, 1), b = makeShape('lb', L.k, '#1F6FEB', L.rotB || Math.PI, 1);
    [a, b].forEach(o => { o.slot = null; o.busy = true; });
    const ca = slotCenter({ k: L.k, rot: L.rotA || 0, off: [0, 0] }), cb = slotCenter({ k: L.k, rot: L.rotB || Math.PI, off: [0, 0] });
    const at = new THREE.Vector3(tall ? 0.6 : 1.0, 2.0, 0.9), gap = tall ? 0.75 : 0.9;   /* phone: a little closer, so both triangles fit on the screen */
    a.g.position.set(at.x + ca[0] - gap, at.y + ca[1], at.z); b.g.position.set(at.x + cb[0] + gap, at.y + cb[1], at.z);
    const join = () => Promise.all([moveTo(a, new THREE.Vector3(at.x + ca[0], at.y + ca[1], at.z), 900), moveTo(b, new THREE.Vector3(at.x + cb[0], at.y + cb[1], at.z), 900)]).then(() => { a.busy = b.busy = true; pop(); });
    const apart = () => Promise.all([moveTo(a, new THREE.Vector3(at.x + ca[0] - gap, at.y + ca[1], at.z), 600), moveTo(b, new THREE.Vector3(at.x + cb[0] + gap, at.y + cb[1], at.z), 600)]).then(() => { a.busy = b.busy = true; });
    const both = { marks: [], g: new THREE.Group() }; scene.add(both.g);
    const steps = [() => { cheer(mendy); }, ...cfg.intro, { wait: 200 }, L.first, 'Watch them slide together.', join, L.made, () => burst(at.clone(), 26),
      L.again, apart, 'Your turn! Tap a triangle.', () => { setName('tap'); task = ['Tap a triangle.']; return tapShape(a, 'Tap a triangle.', () => join().then(() => say(L.made))); }, () => { setName('learn'); task = null; },
      ...L.rule, () => { chant(true); }, 'Clap it with me! Tap the hands.'];
    L.chant.forEach(c => steps.push(c[0], () => claps(a, c[1])));
    steps.push(() => { chant(false); return cheer(mendy); }, () => { [a, b].forEach(o => { scene.remove(o.g); shapes.splice(shapes.indexOf(o), 1); }); scene.remove(both.g); });
    return play(steps);
  }
  async function puzzleGame() {
    setName('watch'); dots(1);
    await camTo('wide', 1200);
    const R0 = cfg.rounds[0]; setPuzzle(R0);
    let ok = true;
    for (const sl of PZ.slots) {   /* the hand builds the first picture */
      const t = shapes.find(o => o.box === sl.i && !o.inBox);
      ok = await play([sl === PZ.slots[0] ? cfg.watchLine : 'And this one.', () => { handOn = t; hand.style.display = 'block'; return wait(400); },
        () => moveTo(t, slotWorld(sl), 1100), () => { hand.style.display = 'none'; handOn = null; return fillSlot(t, sl); }]);
      if (!ok) return;
    }
    ok = await play([R0.done, () => burst(PZ.g.position.clone(), 40), cfg.yourTurn]); if (!ok) return;
    const help = { done: false };
    for (let r = 1; r < cfg.rounds.length; r++) { ok = await puzzleRound(cfg.rounds[r], false, help); if (!ok) return; }
    if (W.misses <= 1 && cfg.bonusRounds) {
      W.bonus = true; ok = await play(['Bonus round! You are so good at this.', 'Build something tricky.']); if (!ok) return;
      for (const R of cfg.bonusRounds) { ok = await puzzleRound(R, true, help); if (!ok) return; }
    }
    if (PZ) { scene.remove(PZ.g); PZ = null; } shapes.splice(0).forEach(o => scene.remove(o.g));
    mistake();
  }


  /* =========== "Where is it?" mode (cfg.mode === 'position'): a 3D toy bridge of blocks; he puts a piece on top, under, next to, in front, behind =========== */
  const POSITIONED = cfg.mode === 'position';
  let BR = null;
  const PLANK_Y = 1.45;
  const ZONES = { top: [0, PLANK_Y + 0.55, 0], under: [0, 0.45, 0], left: [-2.3, 0.55, 0], right: [2.3, 0.55, 0], front: [0, 0.55, 2.1], behind: [0.5, 0.55, -3.3] };   /* behind: placed by zoneWorld (half hidden behind a block) */
  const ZWORD = { top: 'on top of', under: 'under', left: 'next to', right: 'next to', front: 'in front of', behind: 'behind' };
  function makeBridge() {
    const TB = LK && !cfg.plain && LK.treasures.bridge ? LK.treasures.bridge(PLANK_Y) : null;   /* cfg.plain: the plain block bridge (no pearls on it that look like one more ball) */   /* under the sea: a stone bridge on coral rocks (treasures.js) */
    if (TB) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 12, 40), new THREE.MeshBasicMaterial({ color: '#F5B400' })); ring.rotation.x = -Math.PI / 2; ring.visible = false; scene.add(ring);
      TB.position.set(0, 0, POS_Z()); scene.add(TB); return { g: TB, ring }; }
    const g = new THREE.Group(), m1 = new THREE.MeshPhysicalMaterial({ color: '#E03A33', roughness: 0.35, clearcoat: 1 }), m2 = new THREE.MeshPhysicalMaterial({ color: '#1F6FEB', roughness: 0.35, clearcoat: 1 });
    [-1.05, 1.05].forEach(x => { const c = new THREE.Mesh(new RoundedBoxGeometry(0.8, PLANK_Y - 0.1, 0.8, 4, 0.08), m1); c.position.set(x, (PLANK_Y - 0.1) / 2, 0); c.castShadow = c.receiveShadow = true; g.add(c); });
    const plank = new THREE.Mesh(new RoundedBoxGeometry(3.0, 0.22, 1.1, 4, 0.08), m2); plank.position.set(0, PLANK_Y + 0.02, 0); plank.castShadow = plank.receiveShadow = true; g.add(plank);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 12, 40), new THREE.MeshBasicMaterial({ color: '#F5B400' })); ring.rotation.x = -Math.PI / 2; ring.visible = false; scene.add(ring);
    g.position.set(0, 0, POS_Z()); scene.add(g); return { g, ring };
  }
  const POS_Z = () => tall ? -0.6 : -0.4;
  function zoneWorld(z) { const v = ZONES[z], dz = v[2] * (tall ? 0.85 : 1);
    if (z === 'behind') {   /* behind (review 2): just behind the left block on the line from his eye, moved over so about half of it peeks out. The block hides part of it, so it is clearly BEHIND: never next to the end, never seen above the bridge like "on top" */
      const c = viewFor('wide').pos, qx = -1.05, qz = POS_Z(); let dx = qx - c.x, dzz = qz - c.z; const n = Math.hypot(dx, dzz) || 1; dx /= n; dzz /= n;
      return new THREE.Vector3(qx + dx * 1.15 + dzz * 0.75, v[1], qz + dzz * 1.15 - dx * 0.75); }
    return new THREE.Vector3(v[0] * (tall ? 0.8 : 1), v[1], dz + POS_Z()); }
  function zoneHit(cx, cy) { let best = null, bd = 1e9; Object.keys(ZONES).forEach(z => { const p = toScreen(zoneWorld(z)), d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = z; } }); return bd < Math.max(110, innerWidth * 0.1) ? best : null; }
  function showRing(z, on) { if (!BR) return; BR.ring.visible = on; if (on) { const p = zoneWorld(z); BR.ring.position.set(p.x, z === 'top' ? PLANK_Y + 0.16 : 0.1, p.z); } }
  let posPiece = null, posWant = null;
  function setPosRound(R) {
    if (posPiece) { scene.remove(posPiece.g); shapes.splice(shapes.indexOf(posPiece), 1); posPiece = null; }
    if (!BR) BR = makeBridge();
    posPiece = makeShape('q' + (++pzN), R.k, R.color || '#F2A900', 0, R.s || 0.6); posPiece.slot = 0; posPiece.home.copy(cfg.posHome ? new THREE.Vector3(...cfg.posHome[tall ? 'tall' : 'wide']) : tall ? new THREE.Vector3(0, 0.92, 3.3) : new THREE.Vector3(-2.9, 0.92, 2.3));   /* cfg.posHome: where the piece waits, chosen for the game's camera */   /* in from the corner, so it is round and easy to see (not stretched at the screen edge) */ posPiece.g.position.copy(posPiece.home);
    posWant = R.where; posPiece.box = 0;
  }
  function placeAt(o, z) { const p = zoneWorld(z); return moveTo(o, new THREE.Vector3(p.x, p.y + 0.05, p.z), 420, 0.5).then(() => { o.busy = true; o.g.rotation.set(0, 0, 0); pop(); }); }
  function posRound(R, bonus, help) {
    return new Promise(resolve => {
      setName(bonus ? 'bonus' : 'find'); dots(2); setPosRound(R); allow = true;
      const ask = ['Put the ' + posWord(R.k) + ' ' + ZWORD[R.where] + ' the bridge.']; task = ask;
      idleFn = n => { W.reminders = (W.reminders || 0) + 1; play(n === 1 ? [...ask, () => pointAt(posPiece)] : [cfg.hint2, () => { showRing(R.where, true); return wait(1500); }, ...ask]); };
      idle();
      onDrop = (o, z) => {
        idle();
        if (!z) { goHome(o); play([...ask]); return; }
        if (z === R.where || (R.where === 'left' && z === 'right') || (R.where === 'right' && z === 'left')) {
          allow = false; onDrop = null; stopIdle(); chime(true); showRing(null, false);
          placeAt(o, z).then(() => play(['Yes! ' + cap(ZWORD[z]) + ' the bridge!', () => cheer(mendy), { wait: 300 }])).then(ok => resolve(ok));
          return;
        }
        if (!bonus) W.misses++; chime(false);
        placeAt(o, z).then(() => {
          const steps = ['Oops! That is ' + ZWORD[z] + ' the bridge.', () => { showRing(R.where, true); return wait(300); }, cap(ZWORD[R.where]) + ' is here.', () => goHome(o).then(() => { o.busy = false; })];
          if (W.misses >= 2 && !help.done && !bonus) { help.done = true; steps.push(cfg.remember); }
          steps.push(...ask);
          allow = false; play(steps).then(() => { if (onDrop) allow = true; });
        });
      };
      play([R.say, ...ask].filter(Boolean));
    });
  }
  W.zonePt = z => toScreen(zoneWorld(z)); if (POSITIONED) W.wrongBox = 1;
  const BW = cfg.ballWord || 'ball';   /* what the voice calls the round thing (under the sea: a pearl) */
  function posWord(k) { return k === 'sphere' && cfg.ballWord ? BW : FAMILY(k); }   /* one word for the round thing all game (K-CLARITY-RULES 11) */
  async function posLesson() {
    const L = cfg.posLesson; if (!BR) BR = makeBridge();
    const ball = makeShape('lball', 'sphere', '#7C4DFF', 0, 0.55); ball.slot = null; ball.busy = true; ball.g.position.copy(zoneWorld('left'));
    const steps = [() => { cheer(mendy); }, ...cfg.intro, { wait: 200 }, 'Look at the ' + BW + '. Where is it?'];
    for (const z of ['top', 'under', 'right', 'front', 'behind']) steps.push(() => placeAt(ball, z).then(() => { ball.busy = true; }), cap(ZWORD[z]) + ' the bridge!');
    const ball2 = () => { const b2 = makeShape('lball2', 'sphere', '#12A766', 0, 0.55); b2.slot = null; b2.busy = true; b2.g.position.copy(zoneWorld('under')); return b2; };
    let b2 = null;
    steps.push(() => placeAt(ball, 'top').then(() => { b2 = ball2(); }), 'Two ' + BW + 's. One is on top. One is under.',
      'Tap the ' + BW + ' on top!', () => { setName('tap'); task = ['Tap the ' + BW + ' on top.']; return tapShape(ball, 'Tap the ' + BW + ' on top.', () => Promise.all([say('Yes! On top!'), solidAction(ball, 'spin')])); }, () => { setName('learn'); task = null; },
      ...L.rule, () => { chant(true); }, 'Clap it with me! Tap the hands.');
    L.chant.forEach(c => steps.push(c[0], () => claps(ball, c[1])));
    steps.push(() => { chant(false); return cheer(mendy); }, () => { [ball, b2].forEach(o => { if (o) { scene.remove(o.g); shapes.splice(shapes.indexOf(o), 1); } }); });
    return play(steps);
  }
  async function posGame() {
    setName('watch'); dots(1); await camTo('wide', 1200);
    const R0 = cfg.rounds[0]; setPosRound(R0);
    let ok = await play([cfg.watchLine, 'Put the ' + posWord(R0.k) + ' ' + ZWORD[R0.where] + ' the bridge.', () => { handOn = posPiece; hand.style.display = 'block'; return wait(400); },
      () => moveTo(posPiece, zoneWorld(R0.where), 1200), () => { hand.style.display = 'none'; handOn = null; return placeAt(posPiece, R0.where); }, cap(ZWORD[R0.where]) + ' the bridge!', cfg.yourTurn]);
    if (!ok) return;
    const help = { done: false };
    for (let r = 1; r < cfg.rounds.length; r++) { ok = await posRound(cfg.rounds[r], false, help); if (!ok) return; }
    if (W.misses <= 1 && cfg.bonusRounds) {
      W.bonus = true; ok = await play(['Bonus round! You are so good at this.', 'Listen carefully.']); if (!ok) return;
      for (const R of cfg.bonusRounds) { ok = await posRound(R, true, help); if (!ok) return; }
    }
    if (posPiece) { scene.remove(posPiece.g); posPiece = null; } shapes.splice(0).forEach(o => scene.remove(o.g)); if (BR) { scene.remove(BR.g); BR.ring.visible = false; BR = null; }
    mistake();
  }


  /* =========== "Measuring" mode (cfg.mode === 'measure'): line things up at the start, then say which is longer, shorter or taller =========== */
  const MEASURED = cfg.mode === 'measure';
  let MS = null, msN = 0, MS_LINE = null, MS_ENDS = null;
  const LINE_X = () => tall ? -2.1 : -3.6;
  const ROW_Z = i => (tall ? [-1.0, 0.7, 2.4] : [-1.2, 0.5, 2.2])[i];
  const ROD_Y = 0.28;
  function makeRod(id, L, color, i) {   /* a pencil: a six-sided body, a wooden tip, a pink eraser (winter: a knitted scarf, treasures.js) */
    const TRd = LK && LK.treasures.rod ? LK.treasures.rod(L, color) : null;
    if (TRd) { scene.add(TRd.g); const o = { id, k: 'rod', len: L, box: i, g: TRd.g, turn: TRd.g, mesh: TRd.body, mat: TRd.body.material, marks: [], corners: [], scale: 1, home: new THREE.Vector3(), still: true, slot: i, inBox: false, busy: false };
      TRd.body.userData.shape = o; shapes.push(o); return o; }
    const g = new THREE.Group(), body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, L - 0.5, 6), new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, clearcoat: 0.6 }));
    body.rotation.z = Math.PI / 2; body.position.x = -0.15; body.castShadow = true; g.add(body);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 6), new THREE.MeshStandardMaterial({ color: '#E8C99A' })); tip.rotation.z = -Math.PI / 2; tip.position.x = L / 2 - 0.2; g.add(tip);
    const lead = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 6), new THREE.MeshStandardMaterial({ color: '#333' })); lead.rotation.z = -Math.PI / 2; lead.position.x = L / 2 - 0.02; g.add(lead);
    const er = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), new THREE.MeshStandardMaterial({ color: '#F4A9A0' })); er.rotation.z = Math.PI / 2; er.position.x = -L / 2 + 0.1; g.add(er);
    scene.add(g);
    const o = { id, k: 'rod', len: L, box: i, g, turn: g, mesh: body, mat: body.material, marks: [], corners: [], scale: 1, home: new THREE.Vector3(), still: true, slot: i, inBox: false, busy: false };
    body.userData.shape = o; shapes.push(o); return o;
  }
  function makeTower(id, n, color, i, x) {   /* a tower of n blocks, standing on the floor (winter: tinted ice blocks with snow on top) */
    const g = new THREE.Group(), m = LK && LK.treasures.towerMat ? LK.treasures.towerMat(color) : new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.8 });
    for (let j = 0; j < n; j++) { const c = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.55, 0.7, 3, 0.06), m); c.position.y = 0.3 + j * 0.57; c.castShadow = true; g.add(c); }
    if (LK && LK.treasures.towerTop) { const top = LK.treasures.towerTop(); top.position.y = 0.3 + (n - 1) * 0.57 + 0.29; g.add(top); }
    const hull = new THREE.Mesh(new THREE.BoxGeometry(0.8, n * 0.57 + 0.1, 0.8), new THREE.MeshBasicMaterial({ visible: false })); hull.position.y = (n * 0.57) / 2; g.add(hull);
    g.position.set(x, 0, -0.2); scene.add(g);
    const o = { id, k: 'tower', len: n, box: -1, g, turn: g, mesh: hull, mat: m, marks: [], corners: [], scale: 1, home: g.position.clone(), still: true, slot: i, inBox: true, busy: false };
    hull.userData.shape = o; shapes.push(o); return o;
  }
  function setMeasure(R) {
    if (MS) MS.parts.forEach(q => scene.remove(q)); endMarks(false); MS_LINE = null; shapes.splice(0).forEach(o => scene.remove(o.g));
    const parts = [], items = [];
    if (R.kind !== 'tall') {
      /* the start line: a thick dark line he can always see (a white line was lost on the snow; K clarity, 2026-11-27), with a green flag on a pole at its far end */
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, tall ? 4.2 : 4.2), new THREE.MeshStandardMaterial({ color: '#22304F', roughness: 0.6 }));
      line.position.set(LINE_X(), 0.12, ROW_Z(1)); scene.add(line); parts.push(line); MS_LINE = line;
      const flag = new THREE.Group(), pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 12), new THREE.MeshStandardMaterial({ color: '#22304F' })); pole.position.y = 0.75; flag.add(pole);
      const cloth = new THREE.Shape(); cloth.moveTo(0, 0); cloth.lineTo(0.75, -0.25); cloth.lineTo(0, -0.5); cloth.lineTo(0, 0);
      const cl = new THREE.Mesh(new THREE.ShapeGeometry(cloth), new THREE.MeshStandardMaterial({ color: '#12A766', side: THREE.DoubleSide })); cl.position.set(0.05, 1.5, 0); flag.add(cl);
      flag.position.set(LINE_X(), 0, ROW_Z(0) - (tall ? 1.1 : 1.2)); if (tall) flag.scale.setScalar(0.85); flag.visible = false; scene.add(flag); parts.push(flag);   /* the camera now looks down from above, where the pole read as a slanted stick nobody talks about: hidden (review round 2) */
      R.items.forEach((it, i) => { const o = makeRod('m' + (++msN), it.L * (tall ? 0.72 : 1), it.color, i); o.word = it.word;
        o.home.set(LINE_X() + o.len / 2 + (it.off || 0) * (tall ? 0.7 : 1), ROD_Y, ROW_Z(i)); o.g.position.copy(o.home); o.inBox = !!R.lined; if (R.lined) o.g.position.x = LINE_X() + o.len / 2; items.push(o); });
    } else {
      R.items.forEach((it, i) => { const xs = R.items.length === 2 ? [-1.1, 1.1] : [-1.8, 0, 1.8]; const o = makeTower('m' + (++msN), it.n, it.color, i, xs[i] * (tall ? 0.8 : 1)); o.word = it.word; items.push(o); });
    }
    MS = { parts, items, R }; W.towers = R.kind === 'tall';
  }
  /* a wrong move SHOWS how (K-CLARITY-RULES 16) */
  function showLineFor(o) {   /* the start line flashes gold; the hand goes from the scarf's end to the line */
    const hw = ms => (SHOT ? new Promise(r => setTimeout(r, ms)) : wait(ms)), at = v => { const p = toScreen(v); hand.style.left = p.x + 'px'; hand.style.top = p.y + 'px'; };
    const end = new THREE.Vector3(o.g.position.x - o.len / 2, ROD_Y + 0.2, o.g.position.z), onLine = new THREE.Vector3(LINE_X(), ROD_Y + 0.2, o.g.position.z);
    handOn = null; hand.style.display = 'block'; at(end);
    const ln = MS_LINE, fl = ln ? tween(1800, k => { ln.material.color.set(Math.sin(k * Math.PI * 4) > 0 && k < 1 ? '#F5B400' : '#22304F'); }) : Promise.resolve();
    return hw(1000).then(() => { at(onLine); return Promise.all([hw(1300), fl]); }).then(() => { if (!SHOT) hand.style.display = 'none'; });
  }
  function endMarks(on) {   /* a gold ball on the far end of each scarf (the top of each tower): "look at the other ends" */
    if (MS_ENDS) { MS_ENDS.forEach(m => scene.remove(m)); MS_ENDS = null; } if (!on || !MS) return;
    MS_ENDS = MS.items.map(o => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), cornerMat);
      m.position.copy(o.k === 'tower' ? new THREE.Vector3(o.g.position.x, 0.3 + o.len * 0.57 + 0.45, o.g.position.z + 0.2) : new THREE.Vector3(o.g.position.x + o.len / 2 + 0.1, ROD_Y + 0.3, o.g.position.z)); scene.add(m); return m; });
  }
  function alignRod(o) { o.inBox = true; return moveTo(o, new THREE.Vector3(LINE_X() + o.len / 2, ROD_Y, o.home.z), 400, 0.3).then(() => { o.busy = true; o.home.copy(o.g.position); pop(); }); }
  function msItemPt(o) { return toScreen(o.k === 'tower' ? o.g.position.clone().setY(o.len * 0.3) : o.g.position.clone()); }
  W.boxPt2 = i => MEASURED && MS ? msItemPt(MS.items[i]) : W.boxPt2b ? W.boxPt2b(i) : null;
  function compareStep(R, bonus, help) {   /* he taps the longer / shorter / taller one */
    return new Promise(done => {
      setName('count'); stopIdle();
      const vals = MS.items.map(o => o.len), want = /short/.test(R.ask) ? Math.min(...vals) : Math.max(...vals), ans = vals.indexOf(want);
      W.countAnswer = ans; const q = 'Which is ' + R.ask + '? Tap it.'; task = [q]; let costed = false;
      shapeTap = (cx, cy) => {
        let best = -1, bd = 1e9; MS.items.forEach((o, i) => { const p = msItemPt(o), d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = i; } });
        if (bd > Math.max(130, innerWidth * 0.12)) return;
        if (best === ans) { shapeTap = null; task = null; endMarks(false); chime(true); burst(MS.items[ans].g.position.clone().setY(1), 26);
          play(['Yes! The ' + MS.items[ans].word + ' one is ' + R.ask + '!', () => cheer(mendy), { wait: 300 }]).then(done); return; }
        if (!costed && !bonus) { W.misses++; costed = true; } chime(false);
        const steps = ['Look again.', () => endMarks(true), R.kind === 'tall' ? 'Look at the tops.' : 'Look at the other ends.', () => wait(1500), () => { if (!SHOT) endMarks(false); }];
        if (W.misses >= 2 && !help.done && !bonus) { help.done = true; steps.push(cfg.remember); }
        play([...steps, q]);
      };
      play([R.kind === 'tall' ? 'They both stand on the floor. Fair!' : 'Now they start at the same place.', q]);
    });
  }
  function measureRound(R, bonus, help) {
    return new Promise(resolve => {
      setMeasure(R); camTo('wide', 700);
      const toLine = MS.items.filter(o => o.k === 'rod' && !o.inBox);
      if (!toLine.length) { play([R.say].filter(Boolean)).then(() => compareStep(R, bonus, help)).then(resolve); return; }
      setName(bonus ? 'bonus' : 'find'); dots(2); allow = true;
      const ask = ['Line them up! Put each end on the start line.']; task = ask;
      idleFn = n => { const t = MS.items.find(o => !o.inBox); if (!t) return; W.reminders = (W.reminders || 0) + 1; play(n === 1 ? [...ask, () => pointAt(t)] : [cfg.hint2, () => pointAt(t)]); };
      idle();
      onDrop = (o, bi) => {
        idle();
        const left = o.g.position.x - o.len / 2;
        if (Math.abs(left - LINE_X()) < 0.9) {
          chime(true); const last = MS.items.filter(q => !q.inBox).length === 1;
          if (last) { allow = false; onDrop = null; }
          alignRod(o).then(() => { if (last) compareStep(R, bonus, help).then(resolve); else play(['Yes! On the line.']); });
          return;
        }
        if (!bonus) W.misses++; chime(false);
        moveTo(o, new THREE.Vector3(o.g.position.x, ROD_Y, o.home.z), 300).then(() => { o.home.copy(o.g.position); });
        const steps = ['Not yet! The end must touch the start line.', 'Watch.', () => showLineFor(o)];
        if (W.misses >= 2 && !help.done && !bonus) { help.done = true; steps.push(cfg.remember); }
        steps.push(...ask);
        allow = false; play(steps).then(() => { if (onDrop) allow = true; });
      };
      play([R.say, ...ask].filter(Boolean));
    });
  }
  if (MEASURED) W.wrongBox = 9;
  W.boxPtM = i => { const o = MS.items[i]; return toScreen(new THREE.Vector3(LINE_X() + o.len / 2, 1.25, o.home.z)); };
  async function measureLesson() {
    const L = cfg.measureLesson; await camTo('wide', 10);
    setMeasure({ kind: 'long', items: L.items });
    const [a, b] = MS.items;
    const steps = [() => { cheer(mendy); }, ...cfg.intro, { wait: 200 }, L.first, 'The red one looks longer.', 'But look! They do not start together.',
      'Watch. I line them up at the start.', () => alignRod(a), () => alignRod(b), 'Now we can see!', 'The blue one is longer!', () => burst(b.g.position.clone().setY(1), 26),
      'Your turn! Tap the longer one.', () => { setName('tap'); task = ['Tap the longer one.']; return tapShape(b, 'Tap the longer one.', () => Promise.all([say('Yes! Longer!'), tween(500, k => { b.g.position.y = ROD_Y + Math.sin(Math.PI * k) * 0.4; })])); },
      () => { setName('learn'); task = null; }, ...L.rule, () => { chant(true); }, 'Clap it with me! Tap the hands.'];
    L.chant.forEach(c => steps.push(c[0], () => claps({ marks: [], g: b.g }, c[1])));
    steps.push(() => { chant(false); return cheer(mendy); });
    return play(steps);
  }
  async function measureGame() {
    const JR = FAST && location.search.match(/[?&]jump=round(\d)/);   /* pictures only (fast=1): straight to round N */
    if (JR) { for (let r = +JR[1]; r < cfg.rounds.length; r++) { if (await measureRound(cfg.rounds[r], false, { done: true }) === false) return; } return; }
    setName('watch'); dots(1);
    const R0 = cfg.rounds[0]; setMeasure(R0);
    let ok = await play([cfg.watchLine, ...MS.items.flatMap(o => [() => { handOn = o; hand.style.display = 'block'; return wait(300); }, () => alignRod(o)]), () => { hand.style.display = 'none'; handOn = null; },
      'Now they start together.', 'The ' + MS.items[MS.items.map(o => o.len).indexOf(Math.max(...MS.items.map(o => o.len)))].word + ' one is longer!', cfg.yourTurn]);
    if (!ok) return;
    const help = { done: false };
    for (let r = 1; r < cfg.rounds.length; r++) { ok = await measureRound(cfg.rounds[r], false, help); if (ok === false) return; }
    if (W.misses <= 1 && cfg.bonusRounds) {
      W.bonus = true; ok = await play(['Bonus round! You are so good at this.', 'Three at once!']); if (!ok) return;
      for (const R of cfg.bonusRounds) { ok = await measureRound(R, true, help); if (ok === false) return; }
    }
    if (MS) { MS.parts.forEach(q => scene.remove(q)); MS = null; } shapes.splice(0).forEach(o => scene.remove(o.g));
    mistake();
  }

  /* =========== "Balance" mode (cfg.mode === 'balance'): a 3D balance scale; the heavy side goes down =========== */
  const BALANCED = cfg.mode === 'balance';
  let BS = null, bsN = 0;
  const PAN_X = 1.9, BEAM_Y = 2.35, HANG = 1.15;
  function makeScale() {
    const g = new THREE.Group(), wood = new THREE.MeshPhysicalMaterial({ color: '#B87842', roughness: 0.5, clearcoat: 0.4 }), metal = new THREE.MeshStandardMaterial({ color: '#C9CED6', metalness: 0.6, roughness: 0.3 });
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.25, 1.0, 3, 0.08), wood); base.position.y = 0.13; base.castShadow = true; g.add(base);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, BEAM_Y - 0.1, 20), wood); post.position.y = BEAM_Y / 2; post.castShadow = true; g.add(post);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), metal); knob.position.y = BEAM_Y; g.add(knob);
    const beam = new THREE.Group(); beam.position.y = BEAM_Y; g.add(beam);
    const bar = new THREE.Mesh(new RoundedBoxGeometry(PAN_X * 2 + 0.3, 0.14, 0.18, 3, 0.05), wood); bar.castShadow = true; beam.add(bar);
    const pans = [-1, 1].map(sd => {
      const p = new THREE.Group(); g.add(p);
      const sl = Math.hypot(0.62, HANG), sa = Math.atan2(0.62, HANG);   /* strings from the rim up to one hook under the beam end */
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, sl, 6), metal); st.position.set(dx * 0.31, HANG / 2, dz * 0.31); st.rotation.set(-dz * sa, 0, dx * sa); p.add(st); });
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16), metal); hook.position.y = HANG + 0.04; p.add(hook);
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.65, 0.14, 40), metal); dish.castShadow = dish.receiveShadow = true; p.add(dish);
      return { g: p, sd, item: null };
    });
    g.position.set(0, 0, tall ? -0.8 : -1.2); g.scale.setScalar(tall ? 0.7 : 1); scene.add(g);
    return { g, beam, pans, angle: 0, target: 0 };
  }
  function panWorld(i) { return BS.pans[i].g.localToWorld(new THREE.Vector3(0, 0.15, 0)); }
  function placePans(dt) {   /* the pans hang straight down from the ends of the beam */
    if (!BS) return; const now = performance.now(), real = Math.min(1, ((now - (BS.t || now)) / 1000)); BS.t = now;   /* real time, so a slow computer still tips in time */
    BS.angle += (BS.target - BS.angle) * (FAST ? 1 : 1 - Math.exp(-real * 4)); BS.beam.rotation.z = BS.angle;
    BS.pans.forEach(P => { const x = P.sd * PAN_X; P.g.position.set(x * Math.cos(BS.angle), BEAM_Y + x * Math.sin(BS.angle) - HANG, 0); });
  }
  function objMesh(T) {   /* the things we weigh */
    const TW = LK && LK.treasures.weighable ? LK.treasures.weighable(T) : null; if (TW) return TW;   /* the farm's own things (treasures.js) */
    const m = c => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.35, clearcoat: 0.7 });
    if (T.look === 'rock') { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32 * (T.s || 1), 1), new THREE.MeshStandardMaterial({ color: '#7B7F87', roughness: 0.9, flatShading: true })); r.position.y = 0.3 * (T.s || 1); return r; }
    if (T.look === 'ball') { const b = new THREE.Mesh(new THREE.SphereGeometry(0.62 * (T.s || 1), 36, 24), m(T.color)); b.position.y = 0.62 * (T.s || 1); return b; }
    if (T.look === 'block') { const b = new THREE.Mesh(new RoundedBoxGeometry(0.75 * (T.s || 1), 0.75 * (T.s || 1), 0.75 * (T.s || 1), 3, 0.08), m(T.color)); b.position.y = 0.38 * (T.s || 1); return b; }
    const f = new THREE.Group(), vane = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 12), m(T.color || '#F4F1EA')); vane.scale.set(1.5, 0.08, 0.42); f.add(vane);   /* a feather */
    const quill = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 1.6, 6), new THREE.MeshStandardMaterial({ color: '#D9CBB0' })); quill.rotation.z = Math.PI / 2; quill.position.x = 0.1; f.add(quill);
    f.position.y = 0.12; f.rotation.y = 0.5; return f;
  }
  function makeThing(id, T, i) {
    const inner = objMesh(T), turn = new THREE.Group(); turn.add(inner); const g = new THREE.Group(); g.add(turn); scene.add(g); inner.traverse(q => { q.castShadow = true; });
    const o = { id, k: T.look, word: T.word, w: T.w, box: -1, g, turn, mesh: inner, mat: inner.material || inner.children[0].material, marks: [], corners: [], scale: 1, home: new THREE.Vector3(), still: true, slot: i, inBox: false, busy: false };
    const xs = tall ? [-0.85, 0.85] : [-1.5, 1.5];   /* phone: closer together, so neither is cut off at the edge */
    o.home.set(xs[i], 0, tall ? 1.6 : 0.3); g.position.copy(o.home); g.scale.setScalar(tall ? (LK ? 0.95 : 0.7) : 1);   /* new look: bigger on a phone */
    const bb = new THREE.Box3().setFromObject(turn), sz = bb.getSize(new THREE.Vector3());   /* he can grab it anywhere, even the top of a big balloon */
    const hull = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.5, sz.x + 0.3), Math.max(1.4, sz.y + 0.2), Math.max(1.2, sz.z + 0.3)), new THREE.MeshBasicMaterial({ visible: false })); hull.position.y = Math.max(0.6, (bb.min.y + bb.max.y) / 2); g.add(hull); o.mesh = hull; hull.userData.shape = o; shapes.push(o); return o;
  }
  function markPans() { const free = BS.pans.findIndex(P => !P.item); shapes.forEach(o => { if (!o.inBox) o.box = free; }); }
  function putOnPan(o, i) {
    const P = BS.pans[i]; P.item = o; o.inBox = true; o.box = -1;
    return moveTo(o, panWorld(i), 450, 0.6).then(() => { P.g.add(o.g); o.g.position.set(0, 0.07, 0); o.g.scale.setScalar(1); o.busy = true; pop(); markPans(); tipScale(); });
  }
  function tipScale() { const [L, R] = BS.pans.map(P => (P.item ? P.item.w : 0)); BS.target = Math.max(-0.3, Math.min(0.3, (L - R) * 0.06)); tone([L === R ? 523 : 392], 'sine', 0, 0.4, 0.1); }
  function setBalance(R) {
    shapes.splice(0).forEach(o => { if (o.g.parent) o.g.parent.remove(o.g); });
    if (!BS) BS = makeScale(); BS.pans.forEach(P => { P.item = null; }); BS.target = 0;
    BS.items = R.items.map((T, i) => makeThing('w' + (++bsN), T, i)); markPans();
  }
  function bsDropPan(cx, cy) { if (!BS) return -1; let best = -1, bd = 1e9; BS.pans.forEach((P, i) => { const p = toScreen(panWorld(i)), d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = i; } }); return bd < Math.max(120, innerWidth * 0.11) ? best : -1; }
  function weighStep(R, bonus, help) {
    return new Promise(done => {
      setName('count'); stopIdle();
      const ws = BS.items.map(o => o.w), want = /light/.test(R.ask) ? Math.min(...ws) : Math.max(...ws), ans = ws.indexOf(want);
      W.countAnswer = ans; const q = 'Which is ' + R.ask + '? Tap it.'; task = [q]; let costed = false;
      const ptOf = o => toScreen(o.g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.4, 0)));
      W.boxPt2 = i => ptOf(BS.items[i]);
      shapeTap = (cx, cy) => {
        let best = -1, bd = 1e9; BS.items.forEach((o, i) => { const p = ptOf(o), d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = i; } });
        if (bd > Math.max(130, innerWidth * 0.12)) return;
        if (best === ans) { shapeTap = null; task = null; chime(true); play(['Yes! The ' + BS.items[ans].word + ' is ' + R.ask + '!', () => cheer(mendy), { wait: 300 }]).then(done); return; }
        if (!costed && !bonus) { W.misses++; costed = true; } chime(false);
        const steps = ['Look at the scale.', () => showHandAt(ptOf(BS.items[ans])), /light/.test(R.ask) ? 'The light side goes up.' : 'The heavy side goes down.', () => wait(1200), () => { if (!SHOT) hand.style.display = 'none'; }];   /* the hand points at the side that went down (up): it SHOWS how to read the scale (K-CLARITY-RULES 16) */
        if (W.misses >= 2 && !help.done && !bonus) { help.done = true; steps.push(cfg.remember); }
        play([...steps, q]);
      };
      play([R.big ? 'Look! Big is not always heavy.' : 'Look at the scale.', q]);
    });
  }
  function showHandAt(p) { handOn = null; hand.style.display = 'block'; hand.style.left = p.x + 'px'; hand.style.top = p.y + 'px'; }
  function balanceRound(R, bonus, help) {
    return new Promise(resolve => {
      setName(bonus ? 'bonus' : 'find'); dots(2); setBalance(R); allow = true;
      const ask = ['Put each one on the scale.']; task = ask;
      idleFn = n => { const t = shapes.find(o => !o.inBox); if (!t) return; W.reminders = (W.reminders || 0) + 1; play(n === 1 ? [...ask, () => pointAt(t)] : [cfg.hint2, () => pointAt(t)]); };
      idle();
      onDrop = (o, bi) => {
        idle();
        if (bi < 0 || BS.pans[bi].item) {
          if (!bonus) W.misses++; chime(false); goHome(o);
          const steps = [bi < 0 ? 'Not yet! Put it on a pan of the scale.' : 'That pan is full. Use the other pan.'];
          const free = BS.pans.findIndex(P => !P.item); if (free >= 0) steps.push('Watch.', () => { handOn = o; hand.style.display = 'block'; const hw = ms => (SHOT ? new Promise(r => setTimeout(r, ms)) : wait(ms));
            return hw(1100).then(() => { handOn = null; showHandAt(toScreen(panWorld(free).add(new THREE.Vector3(0, 0.3, 0)))); return hw(1300); }).then(() => { if (!SHOT) hand.style.display = 'none'; }); });   /* the hand goes from the thing to the empty pan */
          if (W.misses >= 2 && !help.done && !bonus) { help.done = true; steps.push(cfg.remember); }
          allow = false; play([...steps, ...ask]).then(() => { if (onDrop) allow = true; }); return;
        }
        chime(true); const last = BS.pans.filter(P => !P.item).length === 1;
        if (last) { allow = false; onDrop = null; }
        putOnPan(o, bi).then(() => { if (last) wait(900).then(() => weighStep(R, bonus, help)).then(resolve); else play(['Yes! Now the other one.']); });
      };
      play([R.say, ...ask].filter(Boolean));
    });
  }
  async function balanceLesson() {
    const L = cfg.balanceLesson; await camTo('wide', 10);
    setBalance({ items: L.items });
    const [a, b] = BS.items;
    const steps = [() => { cheer(mendy); }, ...cfg.intro, { wait: 200 }, L.first, 'Watch. I put the ' + a.word + ' on.', () => putOnPan(a, 0), () => wait(900), 'The heavy side goes down!',
      'Now the big ' + b.word + '.', () => putOnPan(b, 1), () => wait(900), 'The ' + a.word + ' side is still down.', 'The ' + a.word + ' is heavy. The ' + b.word + ' is light.',   /* the words name what he sees (a balloon is a balloon) */
      'Your turn! Tap the heavy one.', () => { setName('tap'); task = ['Tap the heavy one.']; W.tapPt = () => toScreen(a.g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.3, 0)));
        return tapPoint(() => a.g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.3, 0)), 'Tap the heavy one.'); }, () => { setName('learn'); task = null; }, 'Yes! The ' + a.word + ' is heavy.',
      ...L.rule, () => { chant(true); }, 'Clap it with me! Tap the hands.'];
    L.chant.forEach(c => steps.push(c[0], () => claps({ marks: [], g: BS.beam }, c[1])));
    steps.push(() => { chant(false); return cheer(mendy); });
    return play(steps);
  }
  async function balanceGame() {
    setName('watch'); dots(1);
    const R0 = cfg.rounds[0]; setBalance(R0);
    let ok = await play([cfg.watchLine, ...BS.items.flatMap((o, i) => [() => { handOn = o; hand.style.display = 'block'; return wait(300); }, () => putOnPan(o, i)]),
      () => { hand.style.display = 'none'; handOn = null; return wait(900); }, R0.watchDone, cfg.yourTurn]);
    if (!ok) return;
    const help = { done: false };
    for (let r = 1; r < cfg.rounds.length; r++) { ok = await balanceRound(cfg.rounds[r], false, help); if (ok === false) return; }
    if (W.misses <= 1 && cfg.bonusRounds) {
      W.bonus = true; ok = await play(['Bonus round! You are so good at this.', 'This one is tricky.']); if (!ok) return;
      for (const R of cfg.bonusRounds) { ok = await balanceRound(R, true, help); if (ok === false) return; }
    }
    shapes.splice(0).forEach(o => { if (o.g.parent) o.g.parent.remove(o.g); }); if (BS) { scene.remove(BS.g); BS = null; }
    mistake();
  }
  if (BALANCED) { W.wrongBox = 9; W.nb = 2; W.hasChant = true; }

  function setName(n) { W.name = n; }
  async function learn() {
    setName('learn'); dots(0); W.misses = 0; W.found = 0; allow = false; onDrop = null; task = null; W.bonus = false; chant(false); stopIdle();
    $('#end').classList.remove('show');
    if (LK) LK.family(false);
    buildSet(); resize(); camTo('close', 10);
    if (FAST && /[?&]jump=mistake/.test(location.search)) { await camTo('wide', 10); mistake(); return; }
    if (FAST && /[?&]jump=end/.test(location.search)) { W.misses = 0; end(); return; }   /* pictures only: the end screen */   /* pictures only (with fast=1): straight to the friend's mistake */
    if (BALANCED) { const ok = await balanceLesson(); if (ok) balanceGame(); return; }
    if (MEASURED) { if (FAST && /[?&]jump=round/.test(location.search)) { measureGame(); return; } const ok = await measureLesson(); if (ok) measureGame(); return; }
    if (POSITIONED) { const ok = await posLesson(); if (ok) posGame(); return; }
    if (PUZZLED) { const ok = await puzzleLesson(); if (ok) puzzleGame(); return; }
    if (PATTERNED) { const ok = await patternLesson(); if (ok) patternGame(); return; }
    if (FIXED) { if (OL) { scene.remove(OL.g); OL = null; } const ok = await fixLesson(); if (OL) { scene.remove(OL.g); OL = null; } if (ok) fixGame(); return; }
    const steps = [() => { cheer(mendy); }, ...cfg.intro, { wait: 200 }];
    const shows = [];
    cfg.lessons.forEach((L, li) => {
      steps.push(() => {
        if (!L.keep) { shows.forEach(s => { s.g.visible = false; }); shows.push(showcase(L.k, L.color || COLORS[li * 3 % COLORS.length], L.rot, L.scale)); return; }
        /* L.keep (big and small): the one before stays, and this one comes beside it, so he compares the two (size is only clear side by side) */
        shows.push(showcase(L.k, L.color || COLORS[li * 3 % COLORS.length], L.rot, L.scale, new THREE.Vector3(tall ? 1.85 : 2.5, 2.05, 0.9)));
      });
      steps.push(() => wait(300));
      steps.push(() => play2(lessonFor(L, shows[li])));
    });
    steps.push(() => { shows.forEach(s => [s, ...(s.extra || [])].forEach(q => { scene.remove(q.g); const i = shapes.indexOf(q); if (i >= 0) shapes.splice(i, 1); })); });
    const ok = await play(steps);
    if (ok) watch();
  }
  /* runs a lesson inside the main script, so "hear it again" and tokens still work */
  function play2(sub) {
    const my = runTok;
    return sub.reduce((p, s) => p.then(() => {
      if (my !== runTok) return;
      if (typeof s === 'string') return say(s);
      if (typeof s === 'function') return s();
      if (s.wait) return wait(s.wait);
    }), Promise.resolve());
  }
  /* "Mystery shape" mode (cfg.mode === 'clues'): Mendy's piece gives clues; only the piece that fits them goes in the box */
  let clueN = 0;
  function setClue(i) { clueN = i; const C = cfg.clues[i]; shapes.forEach(o => { if (!o.inBox) o.box = C.accept.includes(o.k) ? 0 : -1; }); }
  function nextClue() { if (clueN + 1 >= cfg.clues.length) { play([cfg.allDone, { wait: 300 }]).then(ok => { if (ok) mistake(); }); return; }
    setClue(clueN + 1); find(false, nextClue); }
  async function watch() {
    if (cfg.mode === 'clues') setClue(0);
    setName('watch'); dots(1);
    const demo = shapes.find(o => o.box >= 0);
    await camTo('wide', 1300);
    shapes.forEach((o, i) => { o.g.visible = true; o.g.scale.setScalar(0.01); setTimeout(() => { pop(); if (LK) return LK.pop(o.g, o.scale); tween(420, k => o.g.scale.setScalar(Math.max(0.01, o.scale * ease(k)))); }, FAST ? 0 : i * 140); });
    await wait(1400);
    const ok = await play([
      ...(cfg.mode === 'clues' ? [cfg.watchLine, ...cfg.clues[0].say] : [cfg.watchLine || "Here are Mendy's toys. Watch me."]),
      () => { handOn = demo; hand.style.display = 'block'; return wait(500); },
      () => { demo.busy = true; return moveTo(demo, new THREE.Vector3(demo.g.position.x, 1.25, demo.g.position.z), 400); },
      () => moveTo(demo, boxAt(demo.box).clone().setY(1.25), 1300),
      () => { hand.style.display = 'none'; handOn = null; }, ...clueProof(demo),
      () => { chime(true); return dropInBox(demo); },
      cfg.watchDone || 'Into the box!', cfg.yourTurn
    ]);
    if (ok) { if (cfg.mode === 'clues') { setClue(1); find(false, nextClue); } else find(false); }
  }
  const ACT = { sphere: 'roll', cube: 'stack', cyl: 'roll', cone: 'spin' };
  function clueProof(o) {   /* clue games: the right shape for a corner clue has its corners lit and counted; for a side clue its sides light one by one (review 2: "six corners" marked nothing) */
    if (cfg.mode !== 'clues' || !o || !o.marks || !o.marks.length || !cfg.clues[clueN]) return [];
    const said = cfg.clues[clueN].say.join(' '), n = o.marks.length;
    if (/corner/i.test(said)) return [...o.marks.flatMap((m, i) => [() => lightCorner(o, i), i < n - 1 ? NUMS[i] : cap(WORDS[n]) + ' corners!']), () => wait(400), () => clearCorners(o)];
    if (/side/i.test(said)) return sideSteps(o);
    return [];
  }
  function teachAgain(t) {
    if (!t) return [];
    if (cfg.sortBy) return [cfg.remember, 'Look at this one.', () => pointAt(t, true)];
    if (t.solid || cfg.thinFlat) return [cfg.remember, 'Look at this one.', () => solidAction(t, t.solid ? ACT[t.solid] : 'stand')];
    if (cfg.ruleFor) return [cfg.ruleFor(t), 'Look at this one.', ...(t.marks.length ? t.marks.flatMap((m, i) => [() => lightCorner(t, i), NUMS[i]]) : [() => traceRound(t, 1200)]), () => wait(300), () => clearCorners(t)];
    if (t.marks.length && /side/i.test(cfg.remember || '')) return [cfg.remember, 'Look at this one.', ...sideSteps(t), cap(FAMILY(t.k)) + '!'];   /* the rule is about sides: the sides light (K-CLARITY-RULES 5) */
    if (t.marks.length) return [cfg.remember, 'Look at this one.', ...t.marks.flatMap((m, i) => [() => lightCorner(t, i), NUMS[i]]), cap(WORDS[t.marks.length]) + ' corners! A ' + FAMILY(t.k) + '!', () => wait(300), () => clearCorners(t)];
    return [cfg.remember, 'Look at this one.', () => traceRound(t, 1200)];
  }
  function find(bonus, next) {
    setName(bonus ? 'bonus' : 'find'); dots(2); allow = true;
    let left = shapes.filter(o => o.box >= 0 && !o.inBox && o.g.visible).length;
    const ask = cfg.mode === 'clues' ? [...cfg.clues[clueN].say, 'Find me!'] : [bonus ? cfg.bonusAsk : cfg.ask]; task = ask;
    let helped = false;
    idleFn = n => { const t = shapes.find(x => x.box >= 0 && !x.inBox && x.g.visible && !x.busy); if (!t) return;
      W.reminders = (W.reminders || 0) + 1;
      if (n === 1) play([...ask, cfg.hint, () => pointAt(t)]);
      else play([cfg.hint2 || 'Here is one.', () => pointAt(t, true), ...teachAgain(t).slice(2), ...ask]); };
    idle();
    onDrop = (o, bi) => {
      idle();
      if (bi < 0) { goHome(o); play([NB === 1 ? 'Put it in the box.' : 'Put it in a box.']); return; }
      if (o.box === bi) {
        chime(true); left--;
        if (left === 0) { allow = false; onDrop = null; stopIdle(); }
        (cfg.mode === 'clues' && clueProof(o).length ? play(clueProof(o)) : Promise.resolve()).then(() => dropInBox(o, bi)).then(() => {
          const yes = (cfg.yes && cfg.yes[o.id]) || cfg.yesDefault(o);
          if (left === 0) {
            const quick = !bonus && W.misses <= 1 && cfg.bonus;   /* quick boys get a bonus round */
            if (next) { play([yes, { wait: 300 }]).then(ok => { if (ok) next(); }); return; }
            play([yes, cfg.allDone, { wait: 300 }]).then(ok => { if (!ok) return; const go = () => (quick ? bonusRound() : mistake());
              if (cfg.countAfter && !bonus) countBoxes().then(ok2 => { if (ok2) go(); }); else go(); });
          } else play([yes]);
        });
        return;
      }
      if (!bonus) W.misses++; chime(false);
      const lines = cfg.wrong(o, bi);
      goHome(o).then(() => {
        const steps = [lines[0]];
        const clueNoCorners = cfg.mode === 'clues' && !/corner/i.test(cfg.clues[clueN].say.join(' '));   /* a clue about sides or round: counting corners would not show why */
        if (clueNoCorners && o.marks.length && /side/i.test(cfg.clues[clueN].say.join(' '))) steps.push('Look at its sides.', ...sideSteps(o));   /* the clue was about sides: show its sides */
        const showSides = lines.count === false && cfg.mode !== 'clues' && o.corners && o.corners.length === 4;   /* a four-sided look-alike (rectangle, kite, leaning shape): its sides light one by one, so he SEES why (review round 2) */
        if (showSides) steps.push(...sideSteps(o));
        if (o.marks.length && lines.count !== false && !clueNoCorners) { steps.push('Count the corners.'); o.marks.forEach((m, i) => steps.push(() => lightCorner(o, i), NUMS[i])); }
        steps.push(...lines.slice(1).filter(l => !(showSides && /long|pointy|corners are not/i.test(l))), () => { clearCorners(o); });
        if (o.box < 0 && !bonus) { const t = shapes.find(s => s.box >= 0 && !s.inBox && s.g.visible && !s.busy && s !== o);   /* a piece that does not belong: the hand shows one that does, going into the box */
          if (t) steps.push(() => pointAt(t, true)); }
        if (o.box >= 0 && NB > 1) steps.push(() => pointAt(o, true));   /* the first miss already shows how: the hand goes from the piece to its right box (K-CLARITY-RULES 16) */
        if (W.misses >= 2 && !helped && !bonus) { const t = shapes.find(s => s.box === (NB === 1 ? 0 : o.box) && !s.inBox && s.g.visible && s !== o) || (o.box >= 0 ? o : null);
          if (t && t.box >= 0) { helped = true; steps.push(...teachAgain(t)); } }
        steps.push(...ask);
        allow = false; play(steps).then(() => { if (onDrop) allow = true; });
      });
    };
    play(ask);
  }
  /* cfg.countTags: as each thing is counted, a big number stands above it and stays, so he can see every one was counted once (K-CLARITY-RULES 8, 12) */
  function numTag(n, at, big) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill(); x.lineWidth = 6; x.strokeStyle = '#1F2A44'; x.stroke();
    x.fillStyle = '#1F2A44'; x.font = 'bold 84px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), 64, 70);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, toneMapped: false })); sp.renderOrder = 9; sp.scale.setScalar(big ? (tall ? 1.0 : 0.95) : (tall ? 0.5 : 0.44)); sp.position.copy(at); scene.add(sp); return sp;
  }
  function countBoxes() {   /* count each box together, then he taps the box with the most */
    setName('counting'); stopIdle(); const tags = [];
    const counts = boxes.map((b, i) => shapes.filter(o => o.inBox && o.inBoxAt === i));
    const steps = ["Now let's count each box!"];
    counts.forEach((items, i) => { const word = cfg.boxes[i].word;
      steps.push('The ' + word + ' box.');
      items.forEach((o, j) => steps.push(() => { const y0 = o.g.position.y; pop(); if (cfg.countTags) { const bx = boxAt(i), st = Math.min(0.5, (BX.w - 0.3) / Math.max(1, items.length - 1)); tags.push(numTag(j + 1, new THREE.Vector3(bx.x - st * (items.length - 1) / 2 + st * j, 1.55, bx.z + 0.3))); }   /* the numbers stand in a neat row above the box, one per thing, never on top of each other */ return tween(300, k => { o.g.position.y = y0 + Math.sin(Math.PI * k) * 0.5; }); }, NUMS[j]));
      if (cfg.countTags) steps.push(() => { const bx = boxAt(i); tags.push(numTag(items.length, new THREE.Vector3(bx.x, 2.45, bx.z + 0.3), true)); pop(); });   /* the last number says how many: one big number for the whole box (K-CLARITY-RULES 8, 12) */
      steps.push(cap(WORDS[items.length]) + ' ' + word + '!'); });
    const most = counts.reduce((b, c, i) => (c.length > counts[b].length ? i : b), 0);
    return play(steps).then(ok => { if (!ok) return false; return new Promise(done => {
      setName('count'); W.countAnswer = most; task = [cfg.mostAsk];
      let costed = false;
      shapeTap = (cx, cy) => {
        let best = -1, bd = 1e9; boxes.forEach((b, i) => { const p = toScreen(boxAt(i).clone().setY(0.6)), d = Math.hypot(p.x - cx, p.y - cy); if (d < bd) { bd = d; best = i; } });
        if (bd > Math.max(120, innerWidth * 0.1)) return;
        if (best === most) { shapeTap = null; task = null; chime(true); burst(boxAt(best).clone().setY(1.2), 30);
          play([cfg.mostYes, () => cheer(mendy)]).then(() => { tags.forEach(t => scene.remove(t)); done(true); }); return; }
        if (!costed) { W.misses++; costed = true; } chime(false);
        play(['That box has ' + WORDS[counts[best].length] + '.', 'Look for the box with the most.', cfg.mostAsk]);
      };
      play([cfg.mostAsk, 'Tap that box.']);
    }); });
  }
  W.boxPt2b = i => toScreen(boxAt(i).clone().setY(0.6)); W.boxPt2 = W.boxPt2 || W.boxPt2b;
  function bonusRound() {
    W.bonus = true; setName('bonus');
    const bc = ['#E03A33', '#00A3B8', '#F2A900', '#7C4DFF'];
    const news = cfg.bonus.map((b, i) => { const o = makeShape(b[0], b[1], b[5] || bc[i % bc.length], b[2], b[3]);   /* b[5]: the piece's own colour (sort by colour: every bonus piece has its box) */ o.slot = b[4]; o.home.copy(homeFor(b[4])); o.g.position.copy(o.home); o.g.scale.setScalar(0.01); return o; });
    news.forEach((o, i) => setTimeout(() => { pop(); tween(420, k => o.g.scale.setScalar(Math.max(0.01, o.scale * ease(k)))); }, FAST ? 0 : 300 + i * 200));
    play(['Bonus round! You are so good at this.', 'Here come some tricky ones.', { wait: 500 }]).then(ok => { if (ok) find(true); });
  }
  function mistake() {
    setName('mistake'); dots(3); task = null; stopIdle(); shapes.forEach(clearCorners);
    shapes.forEach(o => { if (!o.inBox) tween(300, k => o.g.scale.setScalar(Math.max(0.001, o.scale * (1 - k)))).then(() => { o.g.visible = false; }); });
    const M = cfg.mistake, p = M.piece || ['outline', 0, 1];
    let d;
    if (M.outline) { OL = makeOutline(M.outline.k, M.outline.miss, M.outline.color, 1.5); OL.mark.visible = false; OL.fill.visible = false; d = { g: OL.g, marks: [] }; }   /* the friend's shape: the gap is a real empty space (no dashed side, no fill), so it plainly is not closed */   /* a shape with a gap */
    else if (M.measure) {   /* two pencils that do not start together */
      setMeasure({ kind: 'long', items: M.measure }); d = { g: new THREE.Group(), marks: [] }; scene.add(d.g);
    }
    else if (M.balance) {   /* a friend says the big one is heavier; the scale shows it is not */
      setBalance({ items: M.balance }); BS.items.forEach((o, i) => { BS.pans[i].item = o; o.inBox = true; o.busy = true; BS.pans[i].g.add(o.g); o.g.position.set(0, 0.07, 0); o.g.scale.setScalar(1); }); tipScale(); d = { g: new THREE.Group(), marks: [] }; scene.add(d.g);
    }
    else if (M.where) {   /* a friend says where the ball is, on the bridge scene */
      BR = makeBridge(); const b = makeShape('mball', 'sphere', '#7C4DFF', 0, 0.6); b.slot = null; b.busy = true; b.g.position.copy(zoneWorld(M.where)); d = { g: b.g, marks: [] };
    }
    else if (M.pattern) {   /* a friend's bead string with one wrong bead */
      setPattern({ seq: M.pattern.seq, blanks: 0, tray: [] }); ghost.visible = false;
      if (!M.wide) PS.parts.forEach(q => { q.position.z += 1.0; q.position.y += 0.3; q.position.x += 0.45; }); d = { g: new THREE.Group(), marks: [] }; scene.add(d.g);   /* M.wide: the long train stays where it was, seen whole */
    }
    else { d = makeShape('mk', p[0], p[3] || '#FF7A1A', p[1], 1); d.slot = null; d.busy = true; if (p[4]) d.turn.rotation.x = p[4]; }   /* p[4]: tipped toward him, so an upside-down cone shows its round base (it never looks like a flat triangle) */
    let side = null;   /* M.beside: a second piece next to it, to compare with (big and small: a ball is only big next to a small one) */
    const SX = M.join ? (tall ? 1.35 : 2.15) : (tall ? 1.95 : 2.65);   /* where the second piece stands (join: the spot Build shapes was tuned for) */
    if (M.beside) { side = makeShape('mk2', M.beside[0], M.beside[3] || '#FF7A1A', M.beside[1], 1); side.slot = null; side.busy = true; side.g.position.set(SX, 2.05, 0.9); side.g.scale.setScalar(0.01); }
    const joinSide = (on) => side ? tween(700, k => { const e = ease(k); const sx = SX; side.g.position.x = on ? sx + (d.g.position.x - sx) * e : d.g.position.x + (sx - d.g.position.x) * e; }).then(() => { pop(); return wait(on ? 600 : 0); }) : null;   /* M.join: the second piece slides onto the first (two triangles make a square), and back */
    const sideAway = () => side ? tween(400, k => side.g.scale.setScalar(Math.max(0.001, (M.beside[2] || 0.5) * (1 - k)))).then(() => { side.g.visible = false; scene.remove(side.g); const i = shapes.indexOf(side); if (i >= 0) shapes.splice(i, 1); }) : null;
    if (!M.where && !M.measure && !M.balance && !M.wide) { d.g.position.set(0.7, 2.05, 0.9); d.g.scale.setScalar(0.01); }
    if (M.wide) { friend.position.copy(mendyAt()); if (PAINTED && PATTERNED) friend.position.add(new THREE.Vector3(0.75, 0, 1.9)); if (tall) friend.position.set(-0.95, 0, 2.6); friend.rotation.set(tall ? -0.6 : 0, tall ? -0.35 : 0.5, 0); friend.visible = true; mendy.visible = false; }   /* M.wide: the friend stands where Mendy stood, in front of the whole train, never hidden behind it */
    else if (M.where || M.measure || M.balance) { friend.position.set(M.measure ? (tall ? 1.7 : 3.0) : (tall ? -1.6 : -3.4), 0, M.measure && !tall ? 0.9 : tall ? 2.6 : 1.4);   /* measuring: he stands on the right, never on the start line the question is about (review 2) */ friend.rotation.y = M.measure ? -0.5 : 0.5; friend.userData.mirror = !!M.measure;   /* on the right his picture is mirrored, so his hand points at the scarves */ friend.visible = true; mendy.visible = false; }
    else { friend.position.set(-1.3, 0, 0.6); friend.rotation.y = 0.35; friend.visible = true;
      if (side) d.g.position.x = M.join ? -0.1 : (tall ? 0.35 : 0.6);   /* big and small: clear of the friend */
      camTo('close', 1000).then(() => tween(500, k => { d.g.scale.setScalar(Math.max(0.01, ease(k) * (p[2] || 1.15))); if (side) side.g.scale.setScalar(Math.max(0.01, ease(k) * (M.beside[2] || 0.5))); })); }
    if (friend.userData.pose) friend.userData.pose('talk');   /* a painted friend explains with an open hand */
    const j = $('#judge'); let answered = false, costed = false;
    const right = M.answer ? j.querySelector('.yesB') : j.querySelector('.noB'), wrong = M.answer ? j.querySelector('.noB') : j.querySelector('.yesB');
    W.answerSel = M.answer ? '.judge .yesB' : '.judge .noB'; W.wrongSel = M.answer ? '.judge .noB' : '.judge .yesB';
    const explain = M.sides && d.marks ? ['Let us look at the sides.', ...sideSteps(d)] : d.marks.length ? ['Let us count the corners.', ...d.marks.flatMap((m, i) => [() => lightCorner(d, i), NUMS[i]])] : [];   /* M.sides: the friend's claim is about sides, so the sides light */
    wrong.onclick = () => {
      if (answered) return; if (!costed) { W.misses++; costed = true; } chime(false); wrong.classList.remove('shake'); void wrong.offsetWidth; wrong.classList.add('shake');
      const per = q => { for (let k = 1; k <= q.length; k++) if (q.every((t, i) => t === q[i % k])) return k; return q.length; };
      const patShow = M.pattern && PS ? (M.pattern.bad != null ? [() => { ghost.visible = true; ghost.position.copy(slotAt(M.pattern.bad, PS.n, PS.z)); if (ghost.isGroup) ghost.scale.setScalar(tall ? 0.72 : 1); }]
        : [() => { PS.R = { ...PS.R, core: per(M.pattern.seq) }; coreGlow(true); return sing(); }, () => wait(600), () => coreGlow(false)]) : [];   /* a friend's pattern: the wrong car gets the ring, or the part that repeats glows while it is sung (K-CLARITY-RULES 16) */
      play([...explain, ...patShow, ...(M.join ? [() => joinSide(true)] : []), ...M.explain, ...(M.join ? [() => joinSide(false)] : []), () => clearCorners(d), M.ask]);
    };
    right.onclick = () => {
      if (answered) return; answered = true; j.classList.remove('show'); chime(true); clearCorners(d); if (M.pattern) ghost.visible = false;
      const prove = M.prove && d.marks.length ? ['Show ' + F.name + ' the corners.', () => { task = ['Tap each corner.']; return tapCorners(d); }, () => { task = null; clearCorners(d); }] : [];
      const fixBad = () => { const m = PS.beads[M.pattern.bad], want = BEADS[M.pattern.seq.map((t, i) => i === M.pattern.bad ? M.pattern.fix : t)[M.pattern.bad]];
        if (m.userData.recolor) m.userData.recolor(want.color); else m.material.color.set(want.color); PS.R = { ...PS.R, seq: M.pattern.seq.map((t, i) => i === M.pattern.bad ? M.pattern.fix : t) }; chime(true); return sing(); };
      play([...M.right.slice(0, 1), ...prove, ...(M.sides && d.marks ? sideSteps(d) : []), ...(M.join ? [() => joinSide(true)] : []), ...M.right.slice(1), ...(M.outline ? [M.closeLine || 'Let us close it.', () => closeIt()] : []),
        ...(M.measure ? [M.fixLine || 'Let us line them up.', () => Promise.all(MS.items.map(o => alignRod(o))), M.after || 'Now we can see.'] : []),
        ...(M.pattern && M.pattern.bad != null ? [M.fixLine || 'Let us fix it.', fixBad] : M.pattern ? [() => sing()] : []), () => cheer(friend), M.after || (() => {}),
        () => { friend.visible = false; sideAway(); return camTo('wide', 1000); }, () => (M.balance ? (shapes.splice(0), scene.remove(BS.g), BS = null, Promise.resolve()) : M.measure ? (MS.parts.forEach(q => scene.remove(q)), MS.items.forEach(o => scene.remove(o.g)), MS = null, Promise.resolve()) : M.where ? (scene.remove(d.g), scene.remove(BR.g), BR = null, Promise.resolve()) : M.pattern ? (PS.parts.forEach(q => scene.remove(q)), PS = null, Promise.resolve()) : M.outline ? tween(400, k => d.g.scale.setScalar(Math.max(0.001, 1 - k))).then(() => { scene.remove(d.g); OL = null; }) : M.box != null ? dropInBox(d, M.box) : M.answer && NB ? dropInBox(d, Math.max(0, boxOf(p[0]))) : tween(400, k => d.g.scale.setScalar(Math.max(0.001, (1 - k)))).then(() => { d.g.visible = false; })), { wait: 300 }]).then(ok => { if (ok) end(); });
    };
    play(['This is ' + F.name + '.', ...M.claim, M.ask, () => { task = [M.ask + ' Tap your answer.']; j.classList.add('show'); }, 'The tick means yes. The X means no.']);
    setTimeout(() => { if (!answered) j.classList.add('show'); }, FAST ? 0 : 14000);
    const nudge = () => setTimeout(() => { if (answered || W.name !== 'mistake') return; if (!busy) play([M.ask + ' Tap your answer.']); nudge(); }, FAST ? 1e9 : 13000); nudge();
  }
  function end() {
    const m = W.misses, stars = m === 0 ? 3 : m <= 2 ? 2 : 1;
    W.stars = stars; W.done = true; setName('end'); dots(STEPS);
    burst(boxAt(0).clone().setY(1.4), 60); chime(true); task = null; cheer(mendy).then(() => cheer(mendy));
    if (LK && PARENTS) { placeFamily(true); LK.family(true, true); }   /* Mommy and Tatty only at the very end, and only once Esti says yes to how they look (?parents=1 to preview) */
    const STAR = on => '<svg viewBox="0 0 100 100"><path d="M50 6l13 28 30 3-23 20 7 30-27-16-27 16 7-30L7 37l30-3z" fill="' + (on ? '#F5B400' : '#EDE6D6') + '" stroke="' + (on ? '#C48F00' : '#D8CFBC') + '" stroke-width="4" stroke-linejoin="round"/></svg>';
    $('#stars').innerHTML = [0, 1, 2].map(i => '<div class="star">' + STAR(i < stars) + '</div>').join('');
    if (cfg.certificate) showCertificate();
    $('#end').classList.add('show');
    document.querySelectorAll('.star').forEach((s, i) => setTimeout(() => s.classList.add('pop'), FAST ? 0 : 250 + i * 250));
    play([cfg.endLine, stars === 3 ? cfg.praise : 'Great work! Play again for more stars.']);
  }
  function showCertificate() {   /* graduation: a certificate with a gold medal of shapes, and fireworks (no name: nothing about a real boy is shown) */
    let c = $('#cert'); if (!c) { c = document.createElement('div'); c.id = 'cert'; c.className = 'cert'; $('#end').prepend(c); }
    if (tall) mendy.visible = false; else mendy.position.x -= 1.9;   /* never behind the certificate (review 2: it covered his face) */
    c.innerHTML = '<svg viewBox="0 0 520 300" role="img" aria-label="Shape graduate certificate"><rect x="8" y="8" width="504" height="284" rx="22" fill="#FFFBEF" stroke="#C48F00" stroke-width="8"/>'
      + '<rect x="26" y="26" width="468" height="248" rx="14" fill="none" stroke="#F2D27A" stroke-width="3" stroke-dasharray="10 8"/>'
      + '<text x="260" y="78" text-anchor="middle" font-family="Baloo 2, Trebuchet MS, sans-serif" font-weight="800" font-size="40" fill="#1F2A44">Shape Graduate</text>'
      + '<text x="260" y="108" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="700" font-size="18" fill="#5B6478">Kindergarten Shapes, Patterns and Measuring</text>'
      + '<path d="M232 200 L214 280 L236 266 L248 286 L258 206Z M288 200 L306 280 L284 266 L272 286 L262 206Z" fill="#E03A33"/>'
      + '<circle cx="260" cy="190" r="52" fill="#F5B400" stroke="#C48F00" stroke-width="6"/><circle cx="260" cy="190" r="38" fill="#FFD84D"/>'
      + '<path d="M260 160 l9 19 21 2 -16 14 5 21 -19 -11 -19 11 5 -21 -16 -14 21 -2z" fill="#C48F00"/>'
      + '<circle cx="86" cy="180" r="30" fill="#1F6FEB"/><path d="M150 150 L182 208 L118 208Z" fill="#E03A33"/><rect x="340" y="152" width="54" height="54" rx="4" fill="#12A766"/>'
      + '<path d="M470 180 L454 208 L422 208 L406 180 L422 152 L454 152Z" fill="#F2A900"/></svg>';
    [0, 1, 2, 3].forEach(i => setTimeout(() => { burst(new THREE.Vector3((i % 2 ? 1 : -1) * (1 + i * 0.6), 1.6 + i * 0.3, 0), 70); chime(true); }, FAST ? 0 : 400 + i * 650));
  }
  $('#replay').onclick = () => { hush(); learn(); };

  /* Tatty and Mommy (new look): they are there to welcome him, and they come back to clap at the end */
  function placeFamily(atEnd) { const f = LK.family(false), z = tall ? (atEnd ? -1.6 : -5.2) : -5.6, x = tall ? (atEnd ? 1.75 : 1.3) : 3.0;   /* phone end: below the stars */
    f[0].position.set(-x, 0, z); f[1].position.set(x, 0, z);
    f[0].rotation.y = 0.25; f[1].rotation.y = -0.25; return f; }
  /* ---------- start: the room is already moving behind the play button ---------- */
  buildSet(); resize();
  if (FIXED) setRound(cfg.rounds[0]);
  if (PATTERNED) setPattern(cfg.rounds[0]);
  if (PUZZLED) setPuzzle(cfg.rounds[0]);
  if (POSITIONED) setPosRound(cfg.rounds[0]);
  if (MEASURED) setMeasure(cfg.rounds[0]);
  if (BALANCED) setBalance(cfg.rounds[0]);
  shapes.forEach(o => { o.g.visible = true; });
  /* Esti, 2026-11-26: no Mommy and Tatty on the play screens */
  dots(0); frame(); W.ready = true;
  preload([...cfg.intro, cfg.ask, cfg.yourTurn, 'Count the sides with me.', 'Now count the corners.', 'Your turn! Tap each corner and count.', 'One!', 'Two!', 'Three!', 'Four!', 'One.', 'Two.', 'Three.', 'Four.', 'Clap it with me! Tap the hands.']);
  $('#start').onclick = () => { ac(); $('#start').style.display = 'none'; againBtn.style.visibility = 'visible'; learn(); };
}

/* ================= why a piece is NOT the shape (said when he puts it in the wrong box) ================= */
const CORNERS = { triangle: 3, square: 4, rectangle: 4, circle: 0, hexagon: 6 };
const W_ = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const noCount = a => { a.count = false; return a; };
export function wrongFor(T) {
  const has = n => (n === 0 ? 'no corners' : W_[n] + ' corners');
  return o => {
    const f = FAMILY(o.k), n = KINDS[o.k].pts ? KINDS[o.k].pts.length : 0;
    if (o.k === 'curvy') return noCount(['Look closely. These sides are curvy.', 'A ' + T + ' has straight sides.']);
    if (o.k === 'oval') return noCount(['That is an oval. It is long and squished.', T === 'circle' ? 'A circle is perfectly round.' : 'A ' + T + ' has straight sides.']);
    if (o.k === 'semi') return noCount(['That is half a circle.', T === 'circle' ? 'It has a straight side. A circle is all round.' : 'It has a round side. A ' + T + ' has straight sides.']);
    if (f === 'circle') return ['That is a circle.', 'A circle has no corners at all. A ' + T + ' has ' + has(CORNERS[T]) + '.'];
    if (o.k === 'lean' && (T === 'square' || T === 'rectangle')) return noCount(['This shape leans over.', 'Two corners are pointy. Two are wide.', (T === 'square' ? 'A square has four sides the same.' : 'A rectangle stands up straight.')]);
    if (o.k === 'kite' && (T === 'square' || T === 'rectangle')) return noCount(['That is a kite shape.', 'Its corners are not all the same.', 'It is not a ' + T + '.']);
    if (T === 'square' && f === 'rectangle') return noCount(['That is a rectangle.', 'Two sides are long. Two are short.', 'A square has four sides the same.']);
    const name = (f === T || ['triangle', 'square', 'rectangle', 'circle'].includes(f) || T === 'hexagon') && !['pentagon', 'octagon'].includes(f) ? 'That is a ' + f + '.' : 'That shape is not a ' + T + '.';
    if (T === 'circle') return [name, 'It has ' + has(n) + '. A circle has none.'];
    return [name, W_[n][0].toUpperCase() + W_[n].slice(1) + ' corners! A ' + T + ' has ' + (n > CORNERS[T] ? 'only ' : '') + has(CORNERS[T]) + '.'];
  };
}
