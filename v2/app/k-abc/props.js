/* Kindergarten ABC 2.0: the picture library. Every picture word is a small 3D model made here in code (no files, no downloads).
   Rules (k-shapes art bible, Esti 2026-11-26): soft, round, glossy toys in warm colours; NO faces on objects (only animals and
   Mendy and his friends have eyes); no writing, letters or numbers; kosher food; nothing scary.
   prop(name) -> a THREE.Group about 1.4 units across, centred on (0,0,0), facing the camera (+z).
   WORDS lists every picture and how it is said (and its beats, for clapping). */
import { THREE, C, toon, glow, eye, rnd } from './kit3d.js';

const M = {}; const mat = (c, o) => { const k = c + JSON.stringify(o || {}); return M[k] || (M[k] = toon(c, o)); };
const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; return o; };
const sph = (r, s = 24) => new THREE.SphereGeometry(r, s, Math.max(8, s * 0.66 | 0));
const cyl = (a, b, h, s = 28) => new THREE.CylinderGeometry(a, b, h, s);
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const tor = (r, t, a = Math.PI * 2) => new THREE.TorusGeometry(r, t, 12, 36, a);
function lathe(pts, s = 32) { return new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), s); }
function ext(shape, depth = 0.2, bevel = 0.06) { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 24 }); g.center(); return g; }
function starShape(n = 5, r1 = 0.7, r2 = 0.32) { const s = new THREE.Shape(); for (let i = 0; i <= n * 2; i++) { const a = Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r2 : r1; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } return s; }
function eyes(G, r, x, y, z, iris) { [-1, 1].forEach(sx => { const e = eye(r, { iris }); e.position.set(sx * x, y, z); G.add(e); }); }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

const B = {
  cat() { const G = new THREE.Group(), f = mat(0xFFA94D, { rough: .55, sheen: .8, sheenC: 0xFFE2B0, clear: .1 }), w = mat(0xFFF3E0, { rough: .6, sheen: .6 });
    const body = mesh(sph(0.42), f, 0, -0.32, -0.05); body.scale.set(1.05, 0.9, 0.9); G.add(body);
    G.add(mesh(sph(0.4), f, 0, 0.22, 0.05)); const muz = mesh(sph(0.17), w, 0, 0.12, 0.38); muz.scale.set(1.3, 0.8, 0.7); G.add(muz);
    G.add(mesh(sph(0.045, 12), mat(0xFF7FA0), 0, 0.19, 0.48));
    [-1, 1].forEach(s => { const e = mesh(new THREE.ConeGeometry(0.14, 0.26, 16), f, s * 0.24, 0.58, 0); e.rotation.z = -s * 0.35; G.add(e); const ei = mesh(new THREE.ConeGeometry(0.08, 0.16, 12), mat(0xFFB3C6), s * 0.235, 0.56, 0.05); ei.rotation.z = -s * 0.35; G.add(ei); });
    eyes(G, 0.09, 0.14, 0.3, 0.33, 0x3A6B1E);
    const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.35, -0.5, -0.2), new THREE.Vector3(0.65, -0.3, -0.25), new THREE.Vector3(0.62, 0.05, -0.2), new THREE.Vector3(0.5, 0.15, -0.15)]), 20, 0.07, 10), f); G.add(tail);
    [-1, 1].forEach(s => G.add(mesh(sph(0.11, 14), w, s * 0.2, -0.68, 0.22))); return G; },
  hat() { const G = new THREE.Group(), k = mat(0x23232E, { rough: .5, clear: .3, rim: 0xBFD4FF, rimI: .7 });   /* a Shabbos hat */
    const brim = mesh(cyl(0.72, 0.72, 0.06, 48), k, 0, -0.32, 0); brim.scale.z = 0.85; G.add(brim);
    const crown = mesh(cyl(0.38, 0.44, 0.62, 40), k, 0, 0, 0); crown.scale.z = 0.85; G.add(crown);
    const dent = mesh(sph(0.3), k, 0, 0.3, 0); dent.scale.set(1.25, 0.25, 1.05); G.add(dent);
    const band = mesh(cyl(0.445, 0.445, 0.12, 40), mat(0x3A3A4A, { rough: .7 }), 0, -0.23, 0); band.scale.z = 0.86; G.add(band); G.rotation.x = 0.35; return G; },
  sun() { const G = new THREE.Group(); G.add(mesh(sph(0.45, 32), toon(0xFFD23F, { emissive: 0xFFB000, ei: 0.7, rough: .3 })));
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = mesh(new THREE.ConeGeometry(0.09, 0.26, 12), toon(0xFFB020, { emissive: 0xFF9000, ei: .6 }), Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0); r.rotation.z = a - Math.PI / 2; G.add(r); }
    G.userData.spin = 0.3; return G; },
  bun() { const G = new THREE.Group(), b = mesh(sph(0.55, 32), mat(0xE7A04E, { rough: .45, clear: .5, sheen: .4 })); b.scale.set(1, 0.6, 1); G.add(b);
    const base = mesh(cyl(0.56, 0.5, 0.18, 32), mat(0xF4D29A, { rough: .7 }), 0, -0.12, 0); G.add(base);
    for (let i = 0; i < 14; i++) { const a = rnd(0, 6.28), r = rnd(0.05, 0.4), s = mesh(sph(0.03, 8), mat(0xFFF6E0), Math.cos(a) * r, 0.3 - r * r * 0.4, Math.sin(a) * r * 0.8 + 0.12); s.scale.set(1, 0.5, 1.8); G.add(s); }
    G.rotation.x = 0.45; return G; },
  map() { const G = new THREE.Group(), tex = canvasTex(256, 192, (x, w, h) => { x.fillStyle = '#F6E7BF'; x.fillRect(0, 0, w, h); x.fillStyle = '#8FD3F4'; x.beginPath(); x.ellipse(60, 140, 50, 34, 0.3, 0, 7); x.fill();
      x.fillStyle = '#8CCB6A'; x.beginPath(); x.ellipse(180, 60, 60, 40, -0.2, 0, 7); x.fill(); x.fillStyle = '#5FAE4E'; [[170, 50], [195, 70], [160, 75]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 9, 0, 7); x.fill(); });
      x.strokeStyle = '#C0392B'; x.lineWidth = 6; x.setLineDash([12, 10]); x.beginPath(); x.moveTo(30, 40); x.bezierCurveTo(90, 20, 110, 110, 190, 150); x.stroke(); x.setLineDash([]);
      x.lineWidth = 8; x.beginPath(); x.moveTo(178, 138); x.lineTo(202, 162); x.moveTo(202, 138); x.lineTo(178, 162); x.stroke(); });
    const g = new THREE.PlaneGeometry(1.3, 0.98, 20, 1), p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 7) * 0.04); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, roughness: .8, side: THREE.DoubleSide })); m.castShadow = true; G.add(m);
    [-1, 1].forEach(s => { const r = mesh(cyl(0.07, 0.07, 1.0, 20), mat(0xE8D29A, { rough: .7 }), s * 0.68, 0, 0); G.add(r); }); return G; },
  moon() { const G = new THREE.Group(), s = new THREE.Shape(), R = 0.62, d = 0.3, r = 0.54;   /* a crescent: outer circle minus an inner one */
    const ix = (R * R - r * r + d * d) / (2 * d), iy = Math.sqrt(R * R - ix * ix), a1 = Math.atan2(iy, ix), b1 = Math.atan2(iy, ix - d);
    for (let i = 0; i <= 40; i++) { const a = a1 + (Math.PI * 2 - 2 * a1) * i / 40; i ? s.lineTo(Math.cos(a) * R, Math.sin(a) * R) : s.moveTo(Math.cos(a) * R, Math.sin(a) * R); }
    for (let i = 0; i <= 40; i++) { const a = (Math.PI * 2 - b1) - (Math.PI * 2 - 2 * b1) * i / 40; s.lineTo(d + Math.cos(a) * r, Math.sin(a) * r); }
    const m = new THREE.Mesh(ext(s, 0.22, 0.08), toon(0xFFE58A, { emissive: 0xFFC94A, ei: 0.55, rough: .35 })); m.rotation.z = 0.35; m.castShadow = true; G.add(m); return G; },
  mop() { const G = new THREE.Group(); const st = mesh(cyl(0.05, 0.05, 1.3, 14), mat(0x6FB7FF, { clear: .6 }), 0, 0.2, 0); G.add(st);
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, s = mesh(new THREE.CapsuleGeometry(0.06, 0.34, 4, 8), mat(0xF4F1EA, { rough: .9, sheen: .6 }), Math.cos(a) * 0.14, -0.55, Math.sin(a) * 0.14); s.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); G.add(s); }
    G.add(mesh(cyl(0.18, 0.12, 0.12, 20), mat(0xFFD23F), 0, -0.4, 0)); G.rotation.z = 0.25; return G; },
  mug() { const G = new THREE.Group(), m = mat(0xFF6B8A, { clear: .8, rough: .25 }); G.add(mesh(cyl(0.38, 0.34, 0.75, 36), m));
    const h = mesh(tor(0.2, 0.06, Math.PI * 1.2), m, 0.42, 0, 0); h.rotation.z = -Math.PI * 0.6; G.add(h); const top = mesh(cyl(0.33, 0.33, 0.02, 36), mat(0xA8DCFF, { emissive: 0x2266AA, ei: .2 }), 0, 0.36, 0); G.add(top); G.rotation.x = 0.25; return G; },
  sock() { const G = new THREE.Group(), m = mat(0x4FA8FF, { rough: .8, sheen: 1, sheenC: 0xDDEEFF }), w = mat(0xFFFFFF, { rough: .8, sheen: 1 });
    G.add(mesh(new THREE.CapsuleGeometry(0.22, 0.7, 6, 16), m, 0, 0.12, 0)); const foot = mesh(new THREE.CapsuleGeometry(0.22, 0.42, 6, 16), m, 0.25, -0.38, 0); foot.rotation.z = Math.PI / 2; G.add(foot);
    G.add(mesh(cyl(0.235, 0.235, 0.18, 24), w, 0, 0.58, 0)); [0.2, 0.0].forEach(y => G.add(mesh(cyl(0.228, 0.228, 0.07, 24), w, 0, y, 0))); const toe = mesh(sph(0.2), w, 0.52, -0.38, 0); G.add(toe); G.rotation.z = -0.15; return G; },
  clock() { const G = new THREE.Group(), b = mesh(cyl(0.6, 0.6, 0.18, 48), mat(0x7BD389, { clear: .8 })); b.rotation.x = Math.PI / 2; G.add(b);   /* ticks only: no numbers, no face */
    const d = mesh(cyl(0.5, 0.5, 0.2, 48), mat(0xFFFDF5, { rough: .4 })); d.rotation.x = Math.PI / 2; d.position.z = 0.01; G.add(d);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; G.add(mesh(sph(i % 3 ? 0.025 : 0.045, 8), mat(0x335), Math.cos(a) * 0.41, Math.sin(a) * 0.41, 0.12)); }
    const h1 = mesh(box(0.05, 0.28, 0.03), mat(0x223), 0, 0.12, 0.13); const h2 = mesh(box(0.04, 0.38, 0.03), mat(0x223), 0.13, 0.08, 0.14); h2.rotation.z = -1.0; G.add(h1, h2, mesh(sph(0.05, 10), mat(0xFF5A5A), 0, 0, 0.15));
    [-1, 1].forEach(s => { const bl = mesh(sph(0.18, 16), mat(0xFFC93C, { metal: .3, clear: 1 }), s * 0.42, 0.55, -0.02); bl.scale.y = 0.6; G.add(bl); }); return G; },
  goat() { const G = new THREE.Group(), w = mat(0xFFFFFF, { rough: .75, sheen: 1, sheenC: 0xFFF6E6 }), h = mat(0xD8B48A, { rough: .5 });
    const body = mesh(sph(0.45), w, 0, -0.2, -0.1); body.scale.set(1.3, 0.85, 0.8); G.add(body); const head = mesh(sph(0.3), w, 0.42, 0.22, 0.12); head.scale.set(0.9, 1, 0.95); G.add(head);
    [-1, 1].forEach(s => { const hn = mesh(new THREE.ConeGeometry(0.06, 0.3, 10), h, 0.35 + s * 0.1, 0.55, 0.05); hn.rotation.z = 0.4; G.add(hn); const e = mesh(sph(0.1), w, 0.42 + s * 0.27, 0.3, 0.05); e.scale.set(1.5, 0.5, 0.6); G.add(e); });
    const beard = mesh(new THREE.ConeGeometry(0.07, 0.22, 10), w, 0.48, -0.08, 0.25); beard.rotation.z = Math.PI; G.add(beard); G.add(mesh(sph(0.06, 10), mat(0xFFB3B3), 0.5, 0.12, 0.38));
    eyes(G, 0.07, 0.1, 0.3, 0.33, 0x4A3010); G.children.slice(-2).forEach(e => e.position.x += 0.42);
    [[-0.35, 0.15], [0.3, 0.15], [-0.35, -0.2], [0.3, -0.2]].forEach(([x, z]) => G.add(mesh(cyl(0.07, 0.06, 0.4, 10), h, x, -0.62, z))); return G; },
  boat() { const G = new THREE.Group(), hull = new THREE.Shape(); hull.moveTo(-0.75, 0.15); hull.lineTo(0.75, 0.15); hull.quadraticCurveTo(0.55, -0.32, 0.0, -0.32); hull.quadraticCurveTo(-0.55, -0.32, -0.75, 0.15);
    G.add(new THREE.Mesh(ext(hull, 0.5, 0.06), mat(0xE8554E, { clear: .9 }))); G.children[0].position.y = -0.3; G.children[0].castShadow = true;
    G.add(mesh(cyl(0.035, 0.035, 1.1, 10), mat(0xA0683A), 0, 0.35, 0)); const sail = new THREE.Shape(); sail.moveTo(0, 0); sail.lineTo(0.55, 0); sail.lineTo(0, 0.85); sail.closePath();
    const s = new THREE.Mesh(ext(sail, 0.03, 0.02), mat(0xFFFFFF, { rough: .6, sheen: .5 })); s.position.set(0.3, 0.32, 0); s.castShadow = true; G.add(s); return G; },
  bee() { const G = new THREE.Group(), y = mat(0xFFD23F, { clear: .8 }), k = mat(0x3A2E2A, { clear: .5 }); const b = mesh(sph(0.42), y); b.scale.set(1.25, 1, 1); G.add(b);
    [-0.15, 0.15].forEach(x => { const s = mesh(cyl(0.43, 0.43, 0.12, 32), k, x, 0, 0); s.rotation.z = Math.PI / 2; s.scale.set(1, 1, 0.98); G.add(s); });
    [-1, 1].forEach(s => { const w = mesh(sph(0.3), toon(0xE6F6FF, { transparent: true, opacity: .75, rough: .1, clear: 1 }), s * 0.18, 0.42, -0.05); w.scale.set(0.7, 1, 0.25); w.rotation.z = s * 0.5; G.add(w); });
    eyes(G, 0.08, 0.13, 0.08, 0.36, 0x2A1B0A); G.children.slice(-2).forEach(e => e.position.x += 0.3); G.userData.flap = true; return G; },
  tree() { const G = new THREE.Group(); G.add(mesh(cyl(0.12, 0.18, 0.7, 14), mat(0x9C5A2E, { rough: .8 }), 0, -0.4, 0));
    [[0, 0.25, 0, 0.45], [-0.3, 0.1, 0.05, 0.32], [0.3, 0.1, 0.05, 0.32], [0, 0.5, 0, 0.3]].forEach(([x, yy, z, r]) => G.add(mesh(sph(r), mat(0x3CC45A, { rough: .55, sheen: .7, sheenC: 0xEFFFB0 }), x, yy, z))); return G; },
  star() { const m = new THREE.Mesh(ext(starShape(), 0.22, 0.08), toon(0xFFD23F, { emissive: 0xFFB000, ei: .5, rough: .25, clear: 1 })); m.castShadow = true; const G = new THREE.Group(); G.add(m); return G; },
  car() { const G = new THREE.Group(), r = mat(0x3D8BFF, { clear: 1, rough: .2 }); const b = mesh(new THREE.CapsuleGeometry(0.28, 0.75, 8, 16), r, 0, -0.1, 0); b.rotation.z = Math.PI / 2; b.scale.set(1, 1, 0.85); G.add(b);
    const top = mesh(sph(0.34), r, -0.05, 0.12, 0); top.scale.set(1.2, 0.85, 0.8); G.add(top); const win = mesh(sph(0.3), mat(0xCDEFFF, { rough: .05, clear: 1 }), -0.05, 0.15, 0.06); win.scale.set(1.15, 0.7, 0.8); G.add(win);
    [-0.38, 0.38].forEach(x => { const w = mesh(cyl(0.18, 0.18, 0.12, 24), mat(0x2B2B33), x, -0.36, 0.22); w.rotation.x = Math.PI / 2; G.add(w); const hub = mesh(cyl(0.08, 0.08, 0.13, 16), mat(0xDDDDDD, { metal: .5 }), x, -0.36, 0.23); hub.rotation.x = Math.PI / 2; G.add(hub); });
    G.add(mesh(sph(0.06, 10), glow(0xFFF3B0, 1.5), 0.6, -0.05, 0.12)); return G; },
  cake() { const G = new THREE.Group(); G.add(mesh(cyl(0.55, 0.55, 0.42, 40), mat(0xFFC2D6, { rough: .4, clear: .4 }), 0, -0.3, 0), mesh(cyl(0.4, 0.4, 0.34, 40), mat(0xFFF1F6, { rough: .4 }), 0, 0.08, 0));
    G.add(mesh(tor(0.53, 0.06), mat(0xFFFFFF), 0, -0.09, 0)); G.children[2].rotation.x = Math.PI / 2; const ch = mesh(sph(0.1, 14), mat(0xE8203A, { clear: 1 }), 0, 0.33, 0); G.add(ch);
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; G.add(mesh(sph(0.05, 10), mat([0xFF5FA2, 0x5FC8FF, 0xFFD23F][i % 3]), Math.cos(a) * 0.38, 0.26, Math.sin(a) * 0.38)); } G.rotation.x = 0.3; return G; },
  snake() { const G = new THREE.Group(), g = mat(0x2ECC71, { clear: 1, rough: .25 }); const pts = []; for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push(new THREE.Vector3(Math.cos(t * 5.2) * (0.55 - t * 0.25), -0.45 + t * 0.55, Math.sin(t * 5.2) * (0.4 - t * 0.2))); }
    G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.12, 12), g)); const h = mesh(sph(0.22), g, pts[30].x, pts[30].y + 0.15, pts[30].z + 0.1); h.scale.set(1.2, 0.9, 1); G.add(h);
    eyes(G, 0.07, 0.09, 0, 0, 0x2A1B0A); G.children.slice(-2).forEach(e => e.position.add(h.position).add(new THREE.Vector3(0, 0.08, 0.15))); return G; },
  bell() { const G = new THREE.Group(), g = lathe([[0, 0.5], [0.12, 0.48], [0.22, 0.35], [0.28, 0.05], [0.42, -0.25], [0.5, -0.33], [0.46, -0.36], [0, -0.33]]);
    G.add(mesh(g, mat(0xFFC93C, { metal: .55, rough: .2, clear: 1 }))); G.add(mesh(sph(0.1, 14), mat(0xC98A00, { metal: .5 }), 0, -0.42, 0)); const r = mesh(tor(0.1, 0.03), mat(0xFFC93C, { metal: .5 }), 0, 0.58, 0); G.add(r);
    const bow = mesh(sph(0.12), mat(0xE8203A), 0, 0.42, 0.12); bow.scale.set(2, 0.8, 0.6); G.add(bow); return G; },
  shell() { const G = new THREE.Group(), sh = new THREE.Shape(); sh.moveTo(0, -0.5); for (let i = 0; i <= 20; i++) { const a = Math.PI * (0.12 + 0.76 * i / 20), r = 0.65 + 0.05 * Math.sin(i * Math.PI * 0.9 * 2); sh.lineTo(Math.cos(a) * r * 1.05, Math.sin(a) * r - 0.2); } sh.closePath();
    const m = new THREE.Mesh(ext(sh, 0.12, 0.08), mat(0xFFC8B0, { rough: .3, clear: 1, sheen: .6, sheenC: 0xFFFFFF })); m.castShadow = true; G.add(m);
    for (let i = 0; i < 7; i++) { const a = Math.PI * (0.18 + 0.64 * i / 6), l = mesh(box(0.035, 0.62, 0.02), mat(0xFF9E8A), Math.cos(a) * 0.3, Math.sin(a) * 0.3 - 0.15, 0.15); l.rotation.z = a - Math.PI / 2; G.add(l); } return G; },
  fish() { const G = new THREE.Group(), o = mat(0xFF8A2A, { clear: 1, rough: .2 }); const b = mesh(sph(0.42), o); b.scale.set(1.35, 0.9, 0.55); G.add(b);
    const tail = new THREE.Shape(); tail.moveTo(0, 0); tail.lineTo(-0.38, 0.32); tail.quadraticCurveTo(-0.28, 0, -0.38, -0.32); tail.closePath(); const t = new THREE.Mesh(ext(tail, 0.06, 0.03), o); t.position.set(-0.62, 0, 0); G.add(t);
    [0.0, -0.2].forEach(x => { const s = mesh(tor(0.3, 0.03, Math.PI), mat(0xFFFFFF), x, 0, 0); s.rotation.z = -Math.PI / 2; s.scale.set(0.95, 0.9, 1); s.position.z = 0.02; G.add(s); });
    const e = eye(0.09, { iris: 0x1A2A3A }); e.position.set(0.3, 0.1, 0.2); G.add(e); G.userData.swim = true; return G; },
  dish() { const G = new THREE.Group(); G.add(mesh(lathe([[0, -0.12], [0.45, -0.12], [0.62, 0.02], [0.7, 0.08], [0.66, 0.1], [0.56, 0.02], [0, -0.02]], 48), mat(0xF8FBFF, { clear: 1, rough: .15 })));
    G.add(mesh(tor(0.58, 0.025), mat(0x4F8DFF), 0, 0.06, 0)); G.children[1].rotation.x = Math.PI / 2; G.rotation.x = 0.7; G.scale.setScalar(1.05); return G; },
  drum() { const G = new THREE.Group(); G.add(mesh(cyl(0.5, 0.5, 0.55, 36), mat(0xE8434F, { clear: .8 })), mesh(cyl(0.48, 0.48, 0.04, 36), mat(0xFFF8EC, { rough: .6 }), 0, 0.29, 0));
    [0.27, -0.27].forEach(y => { const r = mesh(tor(0.5, 0.04), mat(0xFFD23F, { metal: .4 }), 0, y, 0); r.rotation.x = Math.PI / 2; G.add(r); });
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28, l = mesh(cyl(0.012, 0.012, 0.56, 6), mat(0xFFFFFF), Math.cos(a) * 0.505, 0, Math.sin(a) * 0.505); l.rotation.z = (i % 2 ? 0.5 : -0.5); G.add(l); } G.rotation.x = 0.35; return G; },
  spoon() { const G = new THREE.Group(), m = mat(0xD8E2EE, { metal: .8, rough: .15 }); const b = mesh(sph(0.26, 24), m, 0, 0.35, 0); b.scale.set(0.8, 1.15, 0.3); G.add(b); G.add(mesh(cyl(0.045, 0.06, 0.9, 12), m, 0, -0.3, 0)); G.rotation.z = -0.5; return G; },
  bug() { const G = new THREE.Group(), r = mat(0xE8203A, { clear: 1, rough: .2 }); const b = mesh(sph(0.45, 32, 16), r, 0, 0, 0); b.scale.set(1, 1, 0.6); G.add(b);   /* a ladybug, seen from above */
    G.add(mesh(box(0.03, 0.85, 0.05), mat(0x222), 0, 0, 0.27)); [[-0.2, 0.15], [0.2, 0.15], [-0.22, -0.18], [0.22, -0.18], [0, -0.32]].forEach(([x, y]) => { const d = mesh(sph(0.08, 12), mat(0x222), x, y, 0.24); d.scale.z = 0.4; G.add(d); });
    const h = mesh(sph(0.2), mat(0x2A2A30), 0, 0.45, 0.05); h.scale.set(1.2, 0.8, 0.6); G.add(h); const e = eye(0.06, {}); e.position.set(-0.08, 0.5, 0.15); const e2 = eye(0.06, {}); e2.position.set(0.08, 0.5, 0.15); G.add(e, e2); return G; },
  candles() { const G = new THREE.Group(), s = mat(0xFFD86B, { metal: .7, rough: .2 });   /* Shabbos candles in silver/gold sticks */
    [-0.3, 0.3].forEach(x => { G.add(mesh(lathe([[0, -0.6], [0.22, -0.6], [0.2, -0.52], [0.07, -0.45], [0.05, -0.1], [0.12, -0.04], [0.12, 0], [0, 0]], 24), s, x, 0, 0));
      G.add(mesh(cyl(0.07, 0.07, 0.5, 16), mat(0xFFFDF5, { rough: .5 }), x, 0.25, 0)); const f = mesh(sph(0.07, 14), glow(0xFFC94A, 2.6), x, 0.58, 0); f.scale.y = 1.8; G.add(f); }); G.userData.flame = true; return G; },
  apple() { const G = new THREE.Group(), g = sph(0.48, 32), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.hypot(x, z); if (y > 0) p.setY(i, y - 0.14 * Math.exp(-r * r / 0.02)); } g.computeVertexNormals();
    G.add(mesh(g, mat(0xF0263A, { clear: 1, rough: .2 }))); G.add(mesh(cyl(0.025, 0.03, 0.22, 8), mat(0x7A4A22), 0.02, 0.42, 0)); const lf = mesh(sph(0.12), mat(0x3ED35A), 0.15, 0.48, 0); lf.scale.set(1.4, 0.4, 0.7); lf.rotation.z = -0.5; G.add(lf); return G; },
  cupcake() { const G = new THREE.Group(); G.add(mesh(cyl(0.42, 0.3, 0.45, 20), mat(0x6FC3FF, { rough: .5 }), 0, -0.3, 0)); const f = mesh(sph(0.46), mat(0xFFB8D9, { rough: .35, clear: .5 }), 0, 0.05, 0); f.scale.set(1, 0.65, 1); G.add(f);
    G.add(mesh(sph(0.3), mat(0xFFC9E2, { rough: .35 }), 0, 0.28, 0)); G.add(mesh(sph(0.1, 14), mat(0xE8203A, { clear: 1 }), 0, 0.55, 0)); return G; },
  kippah() { const G = new THREE.Group(), k = mesh(sph(0.6, 32, 16), mat(0x2A3A7A, { rough: .8, sheen: 1, sheenC: 0x8FA8FF }), 0, -0.2, 0); k.geometry = new THREE.SphereGeometry(0.6, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2.6); G.add(k);
    const r = mesh(tor(0.47, 0.035), mat(0xFFFFFF, { rough: .8 }), 0, -0.04, 0); r.rotation.x = Math.PI / 2; G.add(r); G.rotation.x = 0.5; return G; },
  banana() { const G = new THREE.Group(), pts = []; for (let i = 0; i <= 20; i++) { const a = -0.9 + i / 20 * 1.8; pts.push(new THREE.Vector3(Math.sin(a) * 0.7, -Math.cos(a) * 0.5 + 0.2, 0)); }
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.15, 14), p = g.attributes.position; G.add(new THREE.Mesh(g, mat(0xFFDE3F, { clear: .6, rough: .35 }))); G.children[0].castShadow = true;
    G.add(mesh(cyl(0.04, 0.06, 0.12, 8), mat(0x6B4A22), pts[20].x + 0.03, pts[20].y + 0.03, 0)); return G; },
  umbrella() { const G = new THREE.Group(), cols = [0xFF4F6D, 0xFFD23F, 0x4FC3FF, 0x6BD66B]; for (let i = 0; i < 8; i++) { const g = new THREE.SphereGeometry(0.75, 8, 10, i / 8 * Math.PI * 2, Math.PI / 4, 0, Math.PI / 2.4); G.add(mesh(g, toon(cols[i % 4], { side: THREE.DoubleSide, rough: .5 }), 0, -0.1, 0)); }
    G.add(mesh(cyl(0.03, 0.03, 1.0, 10), mat(0x8A5A3A), 0, -0.15, 0)); const h = mesh(tor(0.1, 0.03, Math.PI), mat(0x8A5A3A), -0.1, -0.65, 0); h.rotation.z = Math.PI; G.add(h); return G; },
  tomato() { const G = new THREE.Group(), t = mesh(sph(0.48, 32), mat(0xF0302A, { clear: 1, rough: .2 })); t.scale.y = 0.82; G.add(t); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28, l = mesh(sph(0.1), mat(0x3DAA3A), Math.cos(a) * 0.1, 0.38, Math.sin(a) * 0.1); l.scale.set(1.6, 0.3, 0.6); l.rotation.y = -a; G.add(l); } return G; },
  butterfly() { const G = new THREE.Group(); [-1, 1].forEach(s => { [[0.32, 0.18, 0.36, 0xFF7AC8], [0.26, -0.22, 0.26, 0xB46BFF]].forEach(([x, y, r, c]) => { const w = mesh(sph(r), toon(c, { emissive: c, ei: .2 }), s * x, y, 0); w.scale.z = 0.12; G.add(w); }); });
    G.add(mesh(new THREE.CapsuleGeometry(0.06, 0.6, 4, 8), mat(0x3A2A5A))); [-1, 1].forEach(s => { const a = mesh(cyl(0.012, 0.012, 0.3, 6), mat(0x3A2A5A), s * 0.07, 0.48, 0); a.rotation.z = -s * 0.4; G.add(a); }); G.userData.flap = true; return G; },
  soup() { const G = new THREE.Group(); G.add(mesh(lathe([[0, -0.3], [0.35, -0.3], [0.55, -0.05], [0.62, 0.2], [0.58, 0.2], [0.5, -0.02], [0, -0.1]], 40), mat(0xFFFFFF, { clear: 1 })));
    G.add(mesh(cyl(0.55, 0.55, 0.02, 40), mat(0xF4B54A, { rough: .3, clear: 1 }), 0, 0.12, 0)); [[0.15, 0.1], [-0.2, -0.1], [0.05, -0.25], [-0.25, 0.2]].forEach(([x, z]) => G.add(mesh(sph(0.07, 10), mat(0xFF8A3A), x, 0.14, z)));
    G.add(mesh(sph(0.12, 14), mat(0xF8F0D8), 0.25, 0.16, 0.18)); G.rotation.x = 0.55; return G; },   /* chicken soup with carrots and a kneidel */
  mitten() { const G = new THREE.Group(), m = mat(0xE8434F, { rough: .85, sheen: 1, sheenC: 0xFFD0D0 }); const h = mesh(new THREE.CapsuleGeometry(0.34, 0.4, 8, 16), m, 0, 0.05, 0); h.scale.z = 0.5; G.add(h);
    const t = mesh(new THREE.CapsuleGeometry(0.12, 0.22, 6, 12), m, 0.36, 0.0, 0); t.rotation.z = -0.6; t.scale.z = 0.6; G.add(t); G.add(mesh(cyl(0.33, 0.33, 0.2, 24), mat(0xFFFFFF, { rough: .9, sheen: 1 }), 0, -0.45, 0)); G.children[2].scale.z = 0.55; return G; },
  milk() { const G = new THREE.Group(); G.add(mesh(cyl(0.32, 0.3, 0.9, 32), mat(0xF4FBFF, { rough: .1, clear: 1, transparent: true, opacity: .55 })), mesh(cyl(0.28, 0.27, 0.72, 32), mat(0xFFFFFF, { rough: .5 }), 0, -0.07, 0));
    G.add(mesh(cyl(0.2, 0.32, 0.18, 24), mat(0xF4FBFF, { transparent: true, opacity: .5 }), 0, 0.53, 0), mesh(cyl(0.16, 0.16, 0.12, 24), mat(0x4FA8FF), 0, 0.66, 0)); return G; },   /* a glass bottle of milk */
  mouse() { const G = new THREE.Group(), g = mat(0xB9A89A, { rough: .6, sheen: .8, sheenC: 0xFFF0E0 }), pink = mat(0xFFB3C6);   /* a little brown-grey mouse, seen from the side */
    const b = mesh(sph(0.42), g, -0.1, -0.25, 0); b.scale.set(1.25, 0.85, 0.85); G.add(b); const hd = mesh(sph(0.3), g, 0.4, 0.0, 0); hd.scale.set(1.15, 0.95, 0.95); G.add(hd);
    const nose = mesh(new THREE.ConeGeometry(0.17, 0.3, 16), g, 0.66, -0.04, 0); nose.rotation.z = -Math.PI / 2; G.add(nose); G.add(mesh(sph(0.055, 10), pink, 0.82, -0.04, 0));
    [[0.28, 0.33, -0.12], [0.36, 0.3, 0.16]].forEach(([x, y, z]) => { const e = mesh(sph(0.2), g, x, y, z); e.scale.set(0.35, 1, 1); G.add(e); const ei = mesh(sph(0.14), pink, x + 0.04, y, z); ei.scale.set(0.3, 1, 1); G.add(ei); });
    const e = eye(0.065, {}); e.position.set(0.55, 0.08, 0.2); e.rotation.y = 0.6; G.add(e);
    const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-0.6, -0.35, 0), V3(-0.85, -0.2, 0), V3(-0.9, 0.1, 0.05), V3(-0.75, 0.25, 0.1)]), 20, 0.03, 8), pink); G.add(tail);
    [-0.35, 0.15].forEach(x => G.add(mesh(sph(0.08, 10), pink, x, -0.62, 0.15))); G.rotation.y = -0.35; return G; },
  sail() { return B.boat(); }
};

/* every picture word: how it is said; beats for clapping (each beat is said on its own) */
export const WORDS = {
  cat: { say: 'cat', beats: ['cat'] }, hat: { say: 'hat', beats: ['hat'] }, sun: { say: 'sun', beats: ['sun'] }, bun: { say: 'bun', beats: ['bun'] },
  map: { say: 'map', beats: ['map'] }, moon: { say: 'moon', beats: ['moon'] }, mop: { say: 'mop', beats: ['mop'] }, mug: { say: 'mug', beats: ['mug'] },
  sock: { say: 'sock', beats: ['sock'] }, clock: { say: 'clock', beats: ['clock'] }, goat: { say: 'goat', beats: ['goat'] }, boat: { say: 'boat', beats: ['boat'] },
  bee: { say: 'bee', beats: ['bee'] }, tree: { say: 'tree', beats: ['tree'] }, star: { say: 'star', beats: ['star'] }, car: { say: 'car', beats: ['car'] },
  cake: { say: 'cake', beats: ['cake'] }, snake: { say: 'snake', beats: ['snake'] }, bell: { say: 'bell', beats: ['bell'] }, shell: { say: 'shell', beats: ['shell'] },
  fish: { say: 'fish', beats: ['fish'] }, dish: { say: 'dish', beats: ['dish'] }, drum: { say: 'drum', beats: ['drum'] }, spoon: { say: 'spoon', beats: ['spoon'] },
  bug: { say: 'bug', beats: ['bug'] }, soup: { say: 'soup', beats: ['soup'] }, mitten: { say: 'mitten', beats: ['mit', 'ten'] }, milk: { say: 'milk', beats: ['milk'] },
  mouse: { say: 'mouse', beats: ['mouse'] },
  candles: { say: 'Shabbos', beats: ['Shab', 'bos'] }, apple: { say: 'apple', beats: ['ap', 'ple'] }, cupcake: { say: 'cupcake', beats: ['cup', 'cake'] },
  kippah: { say: 'kippah', beats: ['kip', 'pah'] }, banana: { say: 'banana', beats: ['ba', 'na', 'na'] }, umbrella: { say: 'umbrella', beats: ['um', 'brel', 'la'] },
  tomato: { say: 'tomato', beats: ['to', 'ma', 'to'] }, butterfly: { say: 'butterfly', beats: ['but', 'ter', 'fly'] }
};

export function prop(name) {
  const G = (B[name] || B.star)(); G.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
  const W = new THREE.Group(); W.add(G); W.userData = { name, inner: G, base: G.rotation.clone() };
  return W;
}
/* gentle life for pictures that move (the sun turns, the bee and butterfly flap, the fish swims, flames flicker) */
export function animateProp(W, t) {
  const G = W.userData.inner, u = G.userData; if (!G) return;
  if (u.spin) G.rotation.z = t * u.spin;
  if (u.flap) G.children.forEach((c, i) => { if (c.scale.z < 0.3 && c.geometry && c.geometry.type === 'SphereGeometry') c.rotation.y = Math.sin(t * 14 + i) * 0.5; });
  if (u.swim) G.rotation.y = Math.sin(t * 2) * 0.25;
  if (u.flame) G.children.forEach(c => { if (c.material && c.material.type === 'MeshBasicMaterial') c.scale.y = 1.8 + Math.sin(t * 13 + c.position.x * 9) * 0.25; });
}
export const PROPS = Object.keys(B);
