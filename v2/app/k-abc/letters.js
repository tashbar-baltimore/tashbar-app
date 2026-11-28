/* Kindergarten ABC 2.0: every small letter as finger-tracing strokes, in the order a teacher writes them (0..200 box:
   tall letters start at y 30, small letters at y 70, the line is y 152, tails go down to y 192).
   One set of paths is used for: the trace path, the glowing 3D letter, the letter tiles. No letter is ever said by its name in K
   until Unit 7; the voice says its sound.
   Esti 2026-11-24: t has a short stem above the bar. */
import { THREE, C, toon, glow, strokePoints, growTube, clamp } from './kit3d.js';

export const LETTERS = {
  s: ['M134 84 C124 62 74 60 72 88 C70 110 132 106 132 130 C132 158 78 162 64 140'],   /* the snake world traces a bigger s (worlds.js) */
  a: ['M128 84 C116 62 70 64 68 106 C66 148 118 150 128 120', 'M130 70 L130 152'],
  t: ['M100 40 L100 136 C100 152 114 156 132 148', 'M68 70 L132 70'],
  p: ['M72 70 L72 192', 'M72 94 C82 62 134 62 134 111 C134 160 82 160 72 130'],
  i: ['M100 78 L100 152', 'M100 44 L100 50'],
  n: ['M66 70 L66 152', 'M66 102 C72 66 134 64 134 102 L134 152'],
  m: ['M48 72 L48 152', 'M48 100 C52 68 98 68 98 100 L98 152', 'M98 100 C102 68 150 68 150 100 L150 152'],
  d: ['M128 84 C116 62 70 64 68 108 C66 150 118 152 128 122', 'M130 30 L130 152'],
  g: ['M128 84 C116 62 70 64 68 106 C66 146 118 148 128 120', 'M130 70 L130 170 C130 198 84 200 70 180'],
  o: ['M100 68 C58 68 58 154 100 154 C142 154 142 68 102 68'],
  c: ['M134 86 C120 62 70 62 68 111 C66 160 120 162 136 136'],
  k: ['M70 30 L70 152', 'M128 72 L72 118', 'M90 104 L132 152'],
  e: ['M68 112 L132 112 C132 64 68 62 68 112 C68 162 122 162 134 138'],
  u: ['M68 70 L68 124 C68 160 130 160 130 124', 'M130 70 L130 152'],
  r: ['M76 70 L76 152', 'M76 106 C82 72 114 64 134 78'],
  h: ['M66 30 L66 152', 'M66 102 C72 66 134 64 134 102 L134 152'],
  b: ['M70 30 L70 152', 'M70 110 C80 62 134 62 134 111 C134 160 80 162 70 132'],
  f: ['M130 44 C118 22 86 24 86 58 L86 152', 'M62 80 L122 80'],
  l: ['M100 30 L100 152'],
  j: ['M110 78 L110 172 C110 198 74 198 64 178', 'M110 44 L110 50'],
  v: ['M64 70 L100 152 L136 70'],
  w: ['M46 70 L70 152 L100 92 L130 152 L154 70'],
  x: ['M68 70 L132 152', 'M132 70 L68 152'],
  y: ['M66 70 L100 142', 'M134 70 L84 196'],
  z: ['M66 70 L134 70 L66 152 L134 152'],
  q: ['M128 84 C116 62 70 64 68 106 C66 146 118 148 128 120', 'M130 70 L130 192 L146 180']
};
/* the pure sound of each letter, as the voice is allowed to say it (kept short, never "suh"/"tuh"); the device makes the held sounds */
export const SOUND_WORD = { s: 'sss', a: 'a', t: 't', p: 'p', i: 'i', n: 'nnn', m: 'mmm', d: 'd' };

/* strokes -> 3D points (scale k: 1 unit = 40/k path units), centred on (cx, cy) */
export function letterPoints(ch, cx = 0, cy = 2.75, k = 1, z = 0) {
  return LETTERS[ch].map(d => strokePoints(d, 0.05 / k, 0, 0, z).map(p => new THREE.Vector3(cx + p.x * k, cy + p.y * k, z)));
}
/* a glossy 3D letter made of round tubes (a toy letter), colour col */
export function letter3D(ch, col = 0xFF5A8A, k = 1, r = 0.17) {
  const G = new THREE.Group(), m = toon(col, { clear: 1, rough: .25, rimI: .6 });
  letterPoints(ch, 0, 0, k).forEach(pts => { if (pts.length < 3) { const d = new THREE.Mesh(new THREE.SphereGeometry(r * k * 1.25, 18, 12), m); d.position.copy(pts[0]); d.castShadow = true; G.add(d); return; }
    const g = growTube(pts, () => r * k, (t, n, c) => c.set(0xffffff), 14); g.userData.grow(1); const mm = new THREE.Mesh(g, m); mm.castShadow = true; G.add(mm);
    [pts[0], pts[pts.length - 1]].forEach(p => { const cap = new THREE.Mesh(new THREE.SphereGeometry(r * k, 14, 10), m); cap.position.copy(p); G.add(cap); }); });
  return G;
}
/* a letter tile: a soft cream tile with a raised letter (for "slide it" and spelling) */
export function letterTile(ch, col = 0x2E6BE6) {
  const G = new THREE.Group(), sh = new THREE.Shape(), w = ch.length > 1 ? 0.98 : 0.62, h = 0.72, r = 0.18;
  sh.moveTo(-w + r, -h); sh.lineTo(w - r, -h); sh.quadraticCurveTo(w, -h, w, -h + r); sh.lineTo(w, h - r); sh.quadraticCurveTo(w, h, w - r, h); sh.lineTo(-w + r, h); sh.quadraticCurveTo(-w, h, -w, h - r); sh.lineTo(-w, -h + r); sh.quadraticCurveTo(-w, -h, -w + r, -h);
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 3 }); g.translate(0, 0, -0.11);
  const tile = new THREE.Mesh(g, toon(0xFFFBF0, { rough: .4, clear: .6, emissive: 0x4A4030, ei: 0.5 })); tile.castShadow = true; G.add(tile);
  if (ch.length > 1) {   /* two letters, one sound (ck): both on one tile, side by side */
    ch.split('').forEach((c1, i) => { const L1 = letter3D(c1, col, 0.28, 0.2); L1.position.set((i - 0.5) * 0.9, /[bdfhklt]/.test(c1) ? -0.08 : 0.03, 0.2); G.add(L1); });
    G.userData.ch = ch; return G; }
  const L = letter3D(ch, col, 0.36, 0.2); L.position.set(0, -0.38 * 0.36 * 0 - 0.02, 0.2); L.position.y = (2.75 - 2.75) - 0.05; G.add(L);
  /* the 0..200 box centre is at y 110 -> move so small letters sit in the middle */
  const tall = /[bdfhklt]/.test(ch), tail = /[gjpqy]/.test(ch); L.position.y = (tall ? -0.12 : tail ? 0.18 : 0.04);
  G.userData.ch = ch; return G;
}
