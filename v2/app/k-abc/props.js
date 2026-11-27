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
  bun() { const G = new THREE.Group(), top = mesh(sph(0.55, 32), mat(0xD98A3A, { rough: .35, clear: .7, sheen: .4 })); top.scale.set(1, 0.55, 1); top.position.y = 0.08; G.add(top);   /* a round roll: golden top with sesame, a soft cut line, a pale bottom */
    G.add(mesh(cyl(0.55, 0.5, 0.16, 32), mat(0xF6DCA8, { rough: .7 }), 0, -0.08, 0)); G.add(mesh(cyl(0.555, 0.555, 0.025, 32), mat(0xB86A2A, { rough: .8 }), 0, 0.0, 0));
    for (let i = 0; i < 22; i++) { const a = rnd(0, 6.28), r = rnd(0.05, 0.44), y = 0.08 + 0.3 * Math.sqrt(Math.max(0, 1 - (r / 0.55) ** 2)), sd = mesh(sph(0.035, 8), mat(0xFFF6E0), Math.cos(a) * r, y, Math.sin(a) * r); sd.scale.set(1, 0.5, 1.8); sd.rotation.y = a; G.add(sd); }
    G.rotation.x = 0.55; return G; },
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
    G.add(mesh(g, mat(0xFFC93C, { metal: .15, rough: .25, clear: 1, emissive: 0x553300, ei: .4 }))); G.add(mesh(sph(0.1, 14), mat(0xC98A00, { metal: .5 }), 0, -0.42, 0)); const r = mesh(tor(0.1, 0.03), mat(0xFFC93C, { metal: .5 }), 0, 0.58, 0); G.add(r);
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
  spoon() { const G = new THREE.Group(), m = mat(0xE4ECF6, { metal: .25, rough: .2, clear: 1 }); const b = mesh(sph(0.26, 24), m, 0, 0.35, 0); b.scale.set(0.8, 1.15, 0.3); G.add(b); G.add(mesh(cyl(0.045, 0.06, 0.9, 12), m, 0, -0.3, 0)); G.rotation.z = -0.5; return G; },
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
  kippah() { const G = new THREE.Group(), dome = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2.4), mat(0x23336E, { rough: .85, sheen: 1, sheenC: 0x8FA8FF })); dome.castShadow = true; dome.scale.y = 0.75; G.add(dome);   /* a navy knitted kippah with a white pattern band */
    const y0 = 0.62 * Math.cos(Math.PI / 2.4) * 0.75; [[0.6, 0.03, 0xFFFFFF], [0.52, 0.12, 0x7FB2FF], [0.42, 0.24, 0xFFFFFF]].forEach(([r, y, c]) => { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 8, 48), mat(c, { rough: .8 })); t.rotation.x = Math.PI / 2; t.position.y = y0 + y; G.add(t); });
    G.position.y = -0.2; G.rotation.x = 0.75; const W = new THREE.Group(); W.add(G); return W; },
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
  sail() { return B.boat(); },
  /* ---- Unit 2 (s a t p) ---- */
  ant() { const G = new THREE.Group(), r = mat(0xD0452E, { clear: 1, rough: .25 }); [[-0.42, -0.05, 0.3], [0, 0, 0.22], [0.38, 0.12, 0.26]].forEach(([x, y, s]) => { const b = mesh(sph(s), r, x, y, 0); b.scale.set(1.2, 1, 1); G.add(b); });
    for (let i = 0; i < 3; i++) [-1, 1].forEach(s => { const l = mesh(cyl(0.025, 0.025, 0.5, 6), mat(0x5A2A1E), -0.15 + i * 0.15, -0.28, s * 0.18); l.rotation.set(s * 0.6, 0, (i - 1) * 0.4); G.add(l); });
    [-1, 1].forEach(s => { const a = mesh(cyl(0.02, 0.02, 0.4, 6), mat(0x5A2A1E), 0.5, 0.42, s * 0.1); a.rotation.z = -0.5; G.add(a); });
    const e = eye(0.08, {}); e.position.set(0.52, 0.18, 0.18); G.add(e); return G; },
  alligator() { const G = new THREE.Group(), g = mat(0x4FBF5A, { clear: .8, rough: .3 }), l = mat(0xC8F08A); const b = mesh(sph(0.4), g, -0.1, -0.15, 0); b.scale.set(1.6, 0.6, 0.8); G.add(b);
    const sn = mesh(sph(0.3), g, 0.62, -0.08, 0); sn.scale.set(1.5, 0.5, 0.7); G.add(sn); const belly = mesh(sph(0.36), l, -0.1, -0.28, 0.1); belly.scale.set(1.5, 0.4, 0.7); G.add(belly);
    const tail = mesh(new THREE.ConeGeometry(0.22, 0.8, 16), g, -0.85, -0.18, 0); tail.rotation.z = Math.PI / 2; tail.scale.z = 0.6; G.add(tail);
    for (let i = 0; i < 5; i++) G.add(mesh(sph(0.06, 8), mat(0x2E9A45), -0.6 + i * 0.25, 0.08, 0));
    [-1, 1].forEach(s => { const e = eye(0.09, { iris: 0x3A2A0A }); e.position.set(0.38, 0.12, s * 0.16); G.add(e); });
    [[-0.45, 1], [-0.45, -1], [0.25, 1], [0.25, -1]].forEach(([x, s]) => G.add(mesh(sph(0.1, 10), g, x, -0.42, s * 0.25))); G.rotation.y = -0.25; return G; },
  anchor() { const G = new THREE.Group(), m = mat(0x5A7BA8, { metal: .5, rough: .3, clear: 1 }); G.add(mesh(cyl(0.06, 0.06, 1.1, 14), m, 0, 0.05, 0)); const r = mesh(tor(0.14, 0.05), m, 0, 0.7, 0); G.add(r);
    const bar = mesh(cyl(0.05, 0.05, 0.6, 12), m, 0, 0.42, 0); bar.rotation.z = Math.PI / 2; G.add(bar); const arc = mesh(tor(0.45, 0.06, Math.PI), m, 0, -0.08, 0); arc.rotation.z = Math.PI; G.add(arc);
    [-1, 1].forEach(s => { const t = mesh(new THREE.ConeGeometry(0.1, 0.22, 12), m, s * 0.45, -0.02, 0); t.rotation.z = -s * 0.6; G.add(t); }); return G; },
  top() { const G = new THREE.Group(); G.add(mesh(lathe([[0, -0.55], [0.1, -0.4], [0.5, -0.05], [0.55, 0.05], [0.42, 0.2], [0.08, 0.3], [0.06, 0.6], [0, 0.6]], 40), mat(0xFF5A6E, { clear: 1 })));
    G.add(mesh(cyl(0.555, 0.555, 0.06, 40), mat(0xFFD23F, { clear: 1 }), 0, 0.0, 0), mesh(cyl(0.45, 0.45, 0.05, 40), mat(0x4FA8FF, { clear: 1 }), 0, 0.15, 0)); G.userData.spinY = 4; G.rotation.z = 0.12; return G; },
  tent() { const G = new THREE.Group(), sh = new THREE.Shape(); sh.moveTo(-0.75, -0.5); sh.lineTo(0.75, -0.5); sh.lineTo(0, 0.6); sh.closePath();
    const t = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.9, bevelEnabled: false }), mat(0xFF9A3C, { rough: .7, sheen: .5 })); t.position.z = -0.45; t.castShadow = true; G.add(t);
    const door = new THREE.Shape(); door.moveTo(-0.28, -0.5); door.lineTo(0.28, -0.5); door.lineTo(0, 0.1); door.closePath(); const d = new THREE.Mesh(new THREE.ShapeGeometry(door), mat(0x8A3A1A)); d.position.z = 0.46; G.add(d);
    const f = mesh(cyl(0.02, 0.02, 0.35, 6), mat(0x6B4A2A), 0, 0.75, 0.0); G.add(f); const fl = mesh(box(0.22, 0.13, 0.01), mat(0x4FA8FF), 0.11, 0.86, 0); G.add(fl); G.rotation.y = -0.4; return G; },
  turtle() { const G = new THREE.Group(), sh = mesh(sph(0.5, 32, 16), mat(0x3FA55A, { clear: .8, rough: .3 }), 0, -0.05, 0); sh.geometry = new THREE.SphereGeometry(0.5, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2); sh.scale.y = 0.85; G.add(sh);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, p = mesh(sph(0.13, 12), mat(0x7FD36A), Math.cos(a) * 0.28, 0.22, Math.sin(a) * 0.28); p.scale.y = 0.3; G.add(p); }
    const skin = mat(0xB8E07A, { rough: .5 }), hd = mesh(sph(0.2), skin, 0.6, 0.02, 0.1); G.add(hd); [[0.3, 0.3], [0.3, -0.3], [-0.3, 0.3], [-0.3, -0.3]].forEach(([x, z]) => G.add(mesh(sph(0.12, 10), skin, x, -0.08, z)));
    const e = eye(0.06, {}); e.position.set(0.7, 0.1, 0.2); G.add(e); G.rotation.y = -0.4; return G; },
  teapot() { const G = new THREE.Group(), m = mat(0x7FC8FF, { clear: 1, rough: .2 }); const b = mesh(sph(0.42, 32), m, 0, -0.08, 0); b.scale.y = 0.85; G.add(b);
    G.add(mesh(cyl(0.18, 0.24, 0.12, 24), m, 0, 0.3, 0), mesh(sph(0.07, 12), mat(0xFFFFFF), 0, 0.4, 0)); const sp = mesh(cyl(0.05, 0.1, 0.45, 12), m, 0.48, 0.05, 0); sp.rotation.z = -0.9; G.add(sp);
    const h = mesh(tor(0.18, 0.045, Math.PI * 1.3), m, -0.45, -0.05, 0); h.rotation.z = Math.PI * 0.35; G.add(h); return G; },
  penguin() { const G = new THREE.Group(), k = mat(0x2A3550, { clear: .8, rough: .3 }), w = mat(0xFFFFFF, { rough: .4 }); const b = mesh(sph(0.45), k, 0, -0.15, 0); b.scale.set(0.9, 1.2, 0.85); G.add(b);
    const bl = mesh(sph(0.36), w, 0, -0.2, 0.14); bl.scale.set(0.85, 1.1, 0.7); G.add(bl); G.add(mesh(sph(0.3), k, 0, 0.42, 0)); const face = mesh(sph(0.22), w, 0, 0.4, 0.13); face.scale.set(1, 0.9, 0.6); G.add(face);
    const bk = mesh(new THREE.ConeGeometry(0.07, 0.18, 12), mat(0xFFA020), 0, 0.36, 0.33); bk.rotation.x = Math.PI / 2; G.add(bk); eyes(G, 0.06, 0.09, 0.46, 0.27, 0x1A1A2A);
    [-1, 1].forEach(s => { const f = mesh(sph(0.16), k, s * 0.42, -0.1, 0); f.scale.set(0.3, 1, 0.6); f.rotation.z = s * 0.3; G.add(f); const ft = mesh(sph(0.12), mat(0xFFA020), s * 0.16, -0.68, 0.12); ft.scale.set(1, 0.4, 1.4); G.add(ft); }); return G; },
  pot() { const G = new THREE.Group(), m = mat(0xE8434F, { clear: 1, rough: .2 }); G.add(mesh(cyl(0.48, 0.42, 0.6, 36), m), mesh(cyl(0.5, 0.5, 0.06, 36), mat(0xC8303A), 0, 0.3, 0), mesh(cyl(0.46, 0.46, 0.1, 36), m, 0, 0.36, 0));
    G.add(mesh(sph(0.08, 12), mat(0x222), 0, 0.46, 0)); [-1, 1].forEach(s => { const h = mesh(tor(0.1, 0.035, Math.PI), mat(0x333), s * 0.52, 0.15, 0); h.rotation.set(0, s > 0 ? Math.PI / 2 : -Math.PI / 2, -Math.PI / 2); G.add(h); }); G.rotation.x = 0.25; return G; },
  pear() { const G = new THREE.Group(), g = lathe([[0, -0.5], [0.3, -0.45], [0.42, -0.25], [0.38, 0.0], [0.24, 0.2], [0.18, 0.38], [0.1, 0.48], [0, 0.5]], 32); G.add(mesh(g, mat(0xC8D838, { clear: .8, rough: .3 })));
    G.add(mesh(cyl(0.02, 0.025, 0.18, 8), mat(0x7A4A22), 0.01, 0.56, 0)); const lf = mesh(sph(0.1), mat(0x3ED35A), 0.12, 0.58, 0); lf.scale.set(1.5, 0.4, 0.7); G.add(lf); return G; },
  pan() { const G = new THREE.Group(), m = mat(0x4A4F5C, { metal: .4, rough: .3 }); G.add(mesh(cyl(0.48, 0.42, 0.16, 36), m), mesh(cyl(0.42, 0.42, 0.02, 36), mat(0x6A7080, { metal: .5 }), 0, 0.075, 0));
    const h = mesh(box(0.7, 0.07, 0.12), mat(0x8A5A3A), 0.8, 0.03, 0); G.add(h); G.rotation.x = 0.6; return G; },
  pumpkin() { const G = new THREE.Group(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, s = mesh(sph(0.34), mat(0xFF8A2A, { clear: .6, rough: .35 }), Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2); s.scale.set(0.8, 1, 0.8); G.add(s); }
    G.add(mesh(cyl(0.05, 0.07, 0.2, 8), mat(0x4A7A2A), 0, 0.38, 0)); return G; },
  faucet() { const G = new THREE.Group(), m = mat(0xD8E2EE, { metal: .8, rough: .15 }); G.add(mesh(cyl(0.12, 0.12, 0.6, 20), m, -0.35, -0.1, 0)); const arm = mesh(tor(0.3, 0.1, Math.PI), m, -0.05, 0.2, 0); G.add(arm);
    G.add(mesh(cyl(0.12, 0.1, 0.15, 20), m, 0.25, 0.12, 0)); const k = mesh(cyl(0.12, 0.12, 0.08, 16), mat(0x4FA8FF), -0.35, 0.48, 0); G.add(k);
    const drop = mesh(sph(0.08, 14), toon(0x7FD8FF, { transparent: true, opacity: .8, clear: 1 }), 0.25, -0.12, 0); drop.scale.y = 1.4; G.add(drop); G.userData.drip = drop; return G; },   /* a water tap */
  pinwheel() { const G = new THREE.Group(); G.add(mesh(cyl(0.04, 0.04, 1.2, 10), mat(0xE8B070), 0, -0.45, 0)); const wh = new THREE.Group(); wh.position.set(0, 0.2, 0.05); G.add(wh);
    [0xFF4F6D, 0xFFB020, 0x4DDB6A, 0x4DB2FF, 0xB46BFF, 0xFFE14D].forEach((c, i) => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(0.36, 0.05, 0.42, 0.36); sh.lineTo(0.05, 0.1); sh.closePath();
      const b = new THREE.Mesh(new THREE.ShapeGeometry(sh, 8), toon(c, { side: THREE.DoubleSide, clear: 1, rough: .3 })); b.rotation.z = i / 6 * Math.PI * 2; wh.add(b); });
    wh.add(mesh(sph(0.06, 10), mat(0xFFD23F), 0, 0, 0.02)); G.userData.wheel = wh; return G; },
  /* ---- Unit 3 (i n m d) ---- */
  iguana() { const G = new THREE.Group(), g = mat(0x3FC08A, { clear: .8, rough: .3 }); const b = mesh(sph(0.36), g, -0.05, -0.2, 0); b.scale.set(1.6, 0.6, 0.7); G.add(b); const h = mesh(sph(0.22), g, 0.55, -0.05, 0); h.scale.set(1.3, 0.8, 0.8); G.add(h);
    for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.ConeGeometry(0.05, 0.16, 6), mat(0x2E9A6A), -0.45 + i * 0.18, 0.05, 0); G.add(sp); }
    const tail = mesh(new THREE.ConeGeometry(0.12, 1.0, 12), g, -0.95, -0.3, 0); tail.rotation.z = Math.PI / 2 + 0.2; G.add(tail); const e = eye(0.06, {}); e.position.set(0.65, 0.02, 0.15); G.add(e);
    [[-0.3, 1], [-0.3, -1], [0.3, 1], [0.3, -1]].forEach(([x, s2]) => G.add(mesh(sph(0.08, 10), g, x, -0.42, s2 * 0.22))); G.rotation.y = -0.3; return G; },
  net() { const G = new THREE.Group(); G.add(mesh(cyl(0.04, 0.04, 1.0, 10), mat(0xC98A4B), 0.35, -0.5, 0)); G.children[0].rotation.z = 0.6; const hoop = mesh(tor(0.38, 0.05), mat(0xFF7A45, { clear: 1 }), -0.1, 0.18, 0); G.add(hoop);
    const bag = mesh(new THREE.ConeGeometry(0.36, 0.6, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, side: THREE.DoubleSide, wireframe: true }), -0.1, -0.15, -0.05); bag.rotation.x = Math.PI; G.add(bag); return G; },   /* the mesh bag shows it is a net */   /* a butterfly net */
  mountain() { const G = new THREE.Group(); [[-0.3, 0.75, 0x8A7BD8], [0.35, 0.55, 0x7A9BE8]].forEach(([x, h, c]) => { const m = mesh(new THREE.ConeGeometry(0.5, h * 1.4, 24), mat(c, { rough: .6 }), x, -0.5 + h * 0.7, 0); G.add(m);
      const cap = mesh(new THREE.ConeGeometry(0.18, h * 0.5, 24), mat(0xFFFFFF, { rough: .5 }), x, -0.5 + h * 1.4 - h * 0.25 + 0.02, 0); G.add(cap); }); return G; },
  igloo() { const G = new THREE.Group(), w = mat(0xF4FAFF, { rough: .35, clear: .6, sheen: .6, sheenC: 0xBFE6FF }); const d = mesh(new THREE.SphereGeometry(0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), w, 0, -0.45, 0); G.add(d);
    for (let i = 1; i < 4; i++) { const r = mesh(tor(0.6 * Math.cos(i * 0.36), 0.012, Math.PI * 2), mat(0xBFD8F0), 0, -0.45 + 0.6 * Math.sin(i * 0.36), 0); r.rotation.x = Math.PI / 2; G.add(r); }
    const door = mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.5, 24, 1, false, 0, Math.PI), w, 0, -0.45, 0.5); door.rotation.set(Math.PI / 2, Math.PI / 2, 0); G.add(door);
    const hole = mesh(new THREE.CircleGeometry(0.17, 20, 0, Math.PI), mat(0x3A5A8A), 0, -0.44, 0.76); G.add(hole); G.rotation.x = 0.25; return G; },
  inchworm() { const G = new THREE.Group(), g = mat(0x8FD84A, { clear: .8, rough: .3 }); for (let i = 0; i < 7; i++) { const a = i / 6 * Math.PI, b = mesh(sph(0.17 - Math.abs(i - 3) * 0.008), g, -0.6 + i * 0.2, -0.3 + Math.sin(a) * 0.5, 0); G.add(b); }
    const h = mesh(sph(0.2), g, 0.66, -0.2, 0); G.add(h); const e = eye(0.06, {}); e.position.set(0.74, -0.12, 0.15); G.add(e); const e2 = eye(0.06, {}); e2.position.set(0.66, -0.1, 0.17); G.add(e2); return G; },
  ink() { const G = new THREE.Group(); G.add(mesh(cyl(0.34, 0.38, 0.55, 28), mat(0x2A3A8A, { clear: 1, rough: .1, transparent: true, opacity: .85 }), 0, -0.2, 0), mesh(cyl(0.18, 0.2, 0.18, 20), mat(0x1A1A2A), 0, 0.15, 0));
    const f = mesh(new THREE.ConeGeometry(0.06, 0.9, 12), mat(0xF4F0E8, { rough: .6 }), 0.15, 0.55, 0); f.rotation.z = -0.35; G.add(f); const tip = mesh(new THREE.ConeGeometry(0.03, 0.12, 8), mat(0x2A3A8A), 0.31, 0.12, 0); tip.rotation.z = Math.PI - 0.35; G.add(tip); return G; },   /* an ink bottle with a feather pen */
  nest() { const G = new THREE.Group(), b = mat(0xA0703A, { rough: .9 }); for (let i = 0; i < 26; i++) { const t = mesh(tor(0.45 + (i % 4) * 0.04, 0.035, Math.PI * 2), b, 0, -0.25 + (i % 5) * 0.04, 0); t.rotation.set(Math.PI / 2 + rnd(-.25, .25), 0, rnd(0, 6)); G.add(t); }
    [[-0.12, 0], [0.13, 0.05], [0, -0.12]].forEach(([x, z]) => { const e = mesh(sph(0.16, 18), mat(0xA8D8FF, { clear: .8 }), x, -0.05, z); e.scale.y = 1.25; G.add(e); }); G.rotation.x = 0.45; return G; },
  nut() { const G = new THREE.Group(); const b = mesh(sph(0.4, 28), mat(0xB8703A, { clear: .7, rough: .3 }), 0, -0.15, 0); b.scale.y = 1.15; G.add(b); const cap = mesh(new THREE.SphereGeometry(0.44, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x7A4A22, { rough: .9 }), 0, 0.12, 0); cap.scale.y = 0.6; G.add(cap);
    G.add(mesh(cyl(0.04, 0.05, 0.18, 8), mat(0x5A3A1A), 0, 0.42, 0)); return G; },   /* an acorn */
  noodles() { const G = new THREE.Group(); G.add(mesh(lathe([[0, -0.32], [0.3, -0.32], [0.55, -0.1], [0.62, 0.15], [0.58, 0.15], [0.5, -0.06], [0, -0.14]], 40), mat(0xFFE0B0, { clear: 1 })));
    for (let i = 0; i < 12; i++) { const n = mesh(tor(rnd(0.12, 0.3), 0.025, Math.PI * 1.6), mat(0xFFD27A), rnd(-0.2, 0.2), 0.12, rnd(-0.2, 0.2)); n.rotation.set(Math.PI / 2 + rnd(-.4, .4), 0, rnd(0, 6)); G.add(n); } G.rotation.x = 0.55; return G; },   /* a bowl of noodles */
  dog() { const G = new THREE.Group(), b = mat(0xD8A060, { rough: .55, sheen: .7 }), d = mat(0x8A5A2A); const body = mesh(sph(0.42), b, -0.1, -0.22, 0); body.scale.set(1.3, 0.85, 0.85); G.add(body); G.add(mesh(sph(0.3), b, 0.42, 0.12, 0.05));
    const sn = mesh(sph(0.16), mat(0xF4D8B0), 0.62, 0.05, 0.12); sn.scale.set(1.2, 0.8, 0.9); G.add(sn); G.add(mesh(sph(0.06, 10), mat(0x2A1A1A), 0.76, 0.1, 0.2));
    [-1, 1].forEach(s => { const e = mesh(sph(0.14), d, 0.36, 0.2, s * 0.25); e.scale.set(0.5, 1.4, 0.6); e.rotation.z = 0.3; G.add(e); }); const e = eye(0.06, {}); e.position.set(0.55, 0.22, 0.24); G.add(e);
    [[-0.4, 1], [-0.4, -1], [0.15, 1], [0.15, -1]].forEach(([x, s]) => G.add(mesh(cyl(0.07, 0.07, 0.35, 10), b, x, -0.6, s * 0.2))); const t = mesh(new THREE.CapsuleGeometry(0.05, 0.3, 4, 8), b, -0.65, 0.0, 0); t.rotation.z = 0.8; G.add(t); G.rotation.y = -0.35; return G; },
  duck() { const G = new THREE.Group(), y = mat(0xFFD23F, { clear: .8, rough: .3 }); const b = mesh(sph(0.42), y, 0, -0.2, 0); b.scale.set(1.3, 0.85, 0.9); G.add(b); G.add(mesh(sph(0.27), y, 0.35, 0.25, 0));
    const bk = mesh(sph(0.12), mat(0xFF8A2A), 0.6, 0.2, 0); bk.scale.set(1.4, 0.45, 0.9); G.add(bk); const e = eye(0.06, {}); e.position.set(0.48, 0.34, 0.18); G.add(e);
    const w = mesh(sph(0.22), mat(0xFFC21E), -0.1, -0.12, 0.3); w.scale.set(1.3, 0.6, 0.3); G.add(w); const t = mesh(new THREE.ConeGeometry(0.12, 0.25, 10), y, -0.6, -0.05, 0); t.rotation.z = Math.PI / 2 + 0.5; G.add(t); G.rotation.y = -0.3; return G; },
  door() { const G = new THREE.Group(); G.add(mesh(box(0.9, 1.3, 0.12), mat(0xC0673A, { rough: .6, clear: .3 }))); [[0.25], [-0.25]].forEach(([y]) => G.add(mesh(box(0.7, 0.45, 0.04), mat(0xA8552E), 0, y, 0.07)));
    G.add(mesh(sph(0.06, 12), mat(0xFFD23F, { metal: .5 }), 0.3, 0, 0.12)); G.add(mesh(box(1.05, 0.08, 0.16), mat(0xFFF6E8), 0, 0.69, 0)); return G; },
  donut() { const G = new THREE.Group(); G.add(mesh(new THREE.TorusGeometry(0.36, 0.2, 20, 36), mat(0xE0A060, { rough: .5 }))); const ic = mesh(new THREE.TorusGeometry(0.36, 0.205, 20, 36, Math.PI * 2), mat(0xFF8AC2, { clear: .8 }), 0, 0, 0.03); ic.scale.set(1, 1, 0.6); G.add(ic);
    for (let i = 0; i < 14; i++) { const a = rnd(0, 6.28), r = rnd(0.25, 0.48), s = mesh(cyl(0.015, 0.015, 0.08, 6), mat([0xFFFFFF, 0x4FC3FF, 0xFFD23F][i % 3]), Math.cos(a) * r, Math.sin(a) * r, 0.2); s.rotation.set(Math.PI / 2, 0, a); G.add(s); } return G; },
  pin() { const G = new THREE.Group(); G.add(mesh(sph(0.2, 20), mat(0xE8434F, { clear: 1 }), 0, 0.4, 0)); G.add(mesh(cyl(0.025, 0.012, 0.85, 10), mat(0xD8E2EE, { metal: .6, rough: .2 }), 0, -0.05, 0)); G.rotation.z = -0.5; return G; },   /* a sewing pin */
  tin() { const G = new THREE.Group(), m = mat(0xC8D2DE, { metal: .6, rough: .25 }); G.add(mesh(cyl(0.36, 0.36, 0.8, 32), m)); [0.32, -0.32].forEach(y => { const r = mesh(tor(0.36, 0.03), m, 0, y, 0); r.rotation.x = Math.PI / 2; G.add(r); });
    G.add(mesh(cyl(0.365, 0.365, 0.4, 32, 1, true), mat(0x4FA8FF, { side: THREE.DoubleSide }), 0, 0, 0)); G.rotation.x = 0.2; return G; },   /* a tin can with a plain blue label */
  mat() { const G = new THREE.Group(); const m = mesh(box(1.3, 0.06, 0.9), mat(0xE8434F, { rough: .8, sheen: .6 })); G.add(m); for (let i = 0; i < 4; i++) G.add(mesh(box(1.3, 0.065, 0.06), mat(0xFFF0D8), 0, 0, -0.33 + i * 0.22));
    for (let i = 0; i < 8; i++) G.add(mesh(cyl(0.012, 0.012, 0.12, 4), mat(0xFFF0D8), -0.55 + i * 0.157, 0, 0.5)); G.rotation.x = 0.9; return G; },   /* a small rug */
  mailbox() { const G = new THREE.Group(), b = mat(0x3D7BE8, { clear: 1, rough: .25 }); const body = mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 28, 1, false, 0, Math.PI), b, 0, 0.1, 0); body.rotation.z = Math.PI / 2; body.rotation.y = Math.PI / 2; G.add(body);
    G.add(mesh(box(0.8, 0.4, 0.8), b, 0, -0.1, 0)); G.add(mesh(cyl(0.06, 0.06, 0.6, 10), mat(0x8A5A3A), 0, -0.6, 0)); const fl = mesh(box(0.05, 0.3, 0.12), mat(0xE8434F), 0.42, 0.25, 0.1); G.add(fl);
    G.add(mesh(box(0.42, 0.07, 0.02), mat(0x1A2A4A), 0, 0.18, 0.41)); return G; }
};

/* every picture word: how it is said; beats for clapping (each beat is said on its own) */

/* ============================== Unit 4 pictures (g o c k e, and ck at the end) ============================== */
const tube = (pts, r, m) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(q => V3(...q))), 24, r, 10), m);
Object.assign(B, {
  grapes() { const G = new THREE.Group(), m = mat(0x8E4FD8, { clear: 1, rough: .2, rimI: .6 });   /* a bunch of purple grapes, a little stem and leaf */
    [[0, 0.45, 4], [0, 0.18, 3.4], [0, -0.1, 2.4], [0, -0.36, 1.3], [0, -0.58, 0.4]].forEach(([x, y, n], r) => { for (let i = 0; i < Math.max(1, Math.round(n)); i++) { const k = Math.max(1, Math.round(n)), a = (i - (k - 1) / 2) * 0.27; G.add(mesh(sph(0.15, 18), m, a, y, Math.cos(a * 2) * 0.12)); } });
    G.add(tube([[0, 0.55, 0], [0.04, 0.72, 0], [0.12, 0.8, 0]], 0.035, mat(0x7A5230)));
    const leaf = mesh(sph(0.2, 16), mat(0x5DBB4A, { clear: .6 }), 0.26, 0.72, 0); leaf.scale.set(1.3, 0.45, 0.8); leaf.rotation.z = 0.4; G.add(leaf); return G; },
  gate() { const G = new THREE.Group(), w = mat(0xF4F1EA, { rough: .5, clear: .4 });   /* a little white garden gate */
    [-0.55, 0.55].forEach(x => { G.add(mesh(box(0.14, 1.3, 0.14), mat(0xC98A4B), x, 0, 0)); G.add(mesh(sph(0.1, 12), mat(0xC98A4B), x, 0.7, 0)); });
    for (let i = 0; i < 5; i++) { const x = -0.36 + i * 0.18; G.add(mesh(box(0.1, 0.9, 0.06), w, x, -0.05, 0.05)); G.add(mesh(new THREE.ConeGeometry(0.07, 0.12, 4), w, x, 0.46, 0.05)); }
    G.add(mesh(box(0.92, 0.09, 0.07), w, 0, 0.22, 0.1)); G.add(mesh(box(0.92, 0.09, 0.07), w, 0, -0.32, 0.1)); return G; },
  gift() { const G = new THREE.Group(); G.add(mesh(box(0.9, 0.75, 0.9), mat(0x3FA9F5, { clear: 1, rough: .25 }), 0, -0.12, 0));   /* a wrapped present with a bow */
    const lid = mesh(box(0.98, 0.18, 0.98), mat(0x3FA9F5, { clear: 1, rough: .25 }), 0, 0.33, 0); G.add(lid); const rb = mat(0xFFD23F, { clear: 1 });
    G.add(mesh(box(0.16, 0.95, 0.94), rb, 0, -0.04, 0.0)); G.add(mesh(box(0.94, 0.95, 0.16), rb, 0, -0.04, 0));
    [-1, 1].forEach(s2 => { const l = mesh(tor(0.15, 0.05), rb, s2 * 0.16, 0.5, 0); l.rotation.y = Math.PI / 2; l.rotation.z = s2 * 0.5; G.add(l); }); G.add(mesh(sph(0.07, 12), rb, 0, 0.47, 0)); G.rotation.set(0.3, 0.5, 0); return G; },
  octopus() { const G = new THREE.Group(), m = mat(0xFF8A65, { clear: .7, rough: .35, sheen: .4 });   /* a friendly octopus (an animal, so it has eyes) */
    const head = mesh(sph(0.42, 32), m, 0, 0.2, 0); head.scale.set(1, 1.1, 0.95); G.add(head);
    for (let i = 0; i < 6; i++) { const a = (i / 5 - 0.5) * 2.4, x = Math.sin(a) * 0.38; G.add(tube([[x * 0.7, -0.1, 0.1], [x, -0.4, 0.15], [x * 1.25, -0.62, 0.1], [x * 1.45 + 0.08 * Math.sign(x || 1), -0.55, 0.12]], 0.065, m)); }
    eyes(G, 0.09, 0.15, 0.25, 0.36, 0x3A2A1E); return G; },
  otter() { const G = new THREE.Group(), f = mat(0x9A6A42, { rough: .6, sheen: .7, sheenC: 0xE8C8A0 }), lt = mat(0xE8D2B0, { rough: .6 });   /* an otter floating on its back */
    const body = mesh(new THREE.CapsuleGeometry(0.3, 0.7, 8, 20), f, 0, -0.1, 0); body.rotation.z = Math.PI / 2; G.add(body);
    const belly = mesh(sph(0.27, 20), lt, 0.05, -0.02, 0.12); belly.scale.set(1.5, 0.8, 0.6); G.add(belly);
    G.add(mesh(sph(0.27, 24), f, -0.58, 0.12, 0)); const muz = mesh(sph(0.12, 16), lt, -0.64, 0.06, 0.2); muz.scale.set(1.2, 0.8, 0.8); G.add(muz); G.add(mesh(sph(0.04, 10), mat(0x3A2A1E), -0.66, 0.1, 0.3));
    [-1, 1].forEach(s2 => G.add(mesh(sph(0.06, 10), f, -0.58 + s2 * 0.2, 0.34, 0))); eyes(G, 0.055, 0.09, 0.2, 0.22, 0x2A1A10); G.children[G.children.length - 1].position.x -= 0.58; G.children[G.children.length - 2].position.x -= 0.58;
    G.add(tube([[0.5, -0.12, 0], [0.75, -0.05, 0], [0.9, 0.08, 0]], 0.08, f)); return G; },
  ox() { const G = new THREE.Group(), f = mat(0xB0703C, { rough: .6, sheen: .5 }), lt = mat(0xF2D8B8, { rough: .6 }), hn = mat(0xF4EEDC, { clear: .8 });   /* a gentle ox */
    const body = mesh(sph(0.45, 24), f, 0.12, -0.25, -0.1); body.scale.set(1.3, 0.85, 0.9); G.add(body);
    const head = mesh(sph(0.3, 24), f, -0.35, 0.12, 0.15); head.scale.set(1, 1.05, 0.95); G.add(head); const muz = mesh(sph(0.18, 18), lt, -0.4, 0.0, 0.38); muz.scale.set(1.25, 0.8, 0.7); G.add(muz);
    [-1, 1].forEach(s2 => { const h = tube([[-0.35 + s2 * 0.2, 0.35, 0.1], [-0.35 + s2 * 0.38, 0.42, 0.1], [-0.35 + s2 * 0.42, 0.6, 0.1]], 0.05, hn); G.add(h); });
    [[-0.2, 1], [0.45, 1], [-0.1, -1], [0.38, -1]].forEach(([x, z]) => G.add(mesh(cyl(0.08, 0.08, 0.35, 12), f, x, -0.65, z * 0.18 - 0.1)));
    eyes(G, 0.06, 0.12, 0.2, 0.36, 0x2A1A10); G.children.slice(-2).forEach(e => e.position.x -= 0.35); return G; },
  kite() { const G = new THREE.Group(), sh = new THREE.Shape(); sh.moveTo(0, 0.62); sh.lineTo(0.42, 0.08); sh.lineTo(0, -0.5); sh.lineTo(-0.42, 0.08); sh.closePath();   /* a diamond kite with a bow tail */
    const k = mesh(ext(sh, 0.05, 0.03), mat(0xFF5A6E, { clear: 1, rough: .3 })); G.add(k); const q = new THREE.Shape(); q.moveTo(0, 0.62); q.lineTo(0.42, 0.08); q.lineTo(0, 0.08); q.closePath();
    const k2 = mesh(ext(q, 0.06, 0.02), mat(0xFFD23F, { clear: 1 })); k2.position.set(0.14, 0.23, 0.02); G.add(k2);
    G.add(tube([[0, -0.5, 0], [0.1, -0.7, 0], [-0.05, -0.9, 0], [0.08, -1.05, 0]], 0.02, mat(0xFFFFFF)));
    [[0.1, -0.7], [-0.04, -0.88]].forEach(([x, y], i) => { const b = mesh(sph(0.07, 10), mat(i ? 0x4DB2FF : 0x4DDB6A), x, y, 0); b.scale.set(1.6, 0.7, 0.6); G.add(b); }); G.rotation.z = -0.2; G.position.y = 0.15; return G; },
  key() { const G = new THREE.Group(), m = mat(0xFFC93C, { clear: 1, rough: .15, metal: .6, emissive: 0x553300, ei: .2 });   /* a shiny gold key */
    const ring = mesh(tor(0.24, 0.08), m, -0.42, 0, 0); G.add(ring); G.add(mesh(box(0.8, 0.12, 0.1), m, 0.12, 0, 0));
    G.add(mesh(box(0.1, 0.22, 0.1), m, 0.4, -0.12, 0)); G.add(mesh(box(0.1, 0.16, 0.1), m, 0.22, -0.09, 0)); G.rotation.z = 0.3; return G; },
  kettle() { const G = new THREE.Group(), m = mat(0xE8434F, { clear: 1, rough: .2 });   /* a round kettle */
    const b = mesh(sph(0.48, 32), m, 0, -0.1, 0); b.scale.set(1, 0.85, 1); G.add(b); G.add(mesh(cyl(0.4, 0.42, 0.14, 32), m, 0, -0.42, 0));
    G.add(mesh(cyl(0.16, 0.2, 0.12, 20), mat(0x23232E), 0, 0.32, 0)); G.add(mesh(sph(0.06, 10), mat(0x23232E), 0, 0.4, 0));
    const h = mesh(tor(0.3, 0.05, Math.PI), mat(0x23232E), 0, 0.3, 0); G.add(h);
    const sp = mesh(cyl(0.05, 0.1, 0.42, 14), m, 0.5, 0.0, 0); sp.rotation.z = -0.9; G.add(sp); G.rotation.x = 0.15; return G; },
  kitten() { const G = B.cat(); G.scale.setScalar(0.8); G.children.forEach(c => { if (c.material && c.material.color && c.material.color.getHex() === 0xFFA94D) c.material = mat(0xBDBDC8, { rough: .55, sheen: .8, sheenC: 0xFFFFFF }); });   /* a small grey kitten */
    const yarn = mesh(sph(0.2, 18), mat(0xFF6B8A, { rough: .8, sheen: 1 }), 0.55, -0.6, 0.3); G.add(yarn); return G; },
  egg() { const G = new THREE.Group(), e = new THREE.Mesh(lathe(Array.from({ length: 21 }, (_, i) => { const t = i / 20, a = Math.PI * t; return [Math.sin(a) * 0.42 * (1 - 0.18 * Math.cos(a)), -Math.cos(a) * 0.56]; })), mat(0xFFF6E6, { rough: .35, clear: .8, sheen: .3 }));   /* a smooth egg */
    e.castShadow = true; G.add(e); return G; },
  elephant() { const G = new THREE.Group(), f = mat(0x9FA8C8, { rough: .55, sheen: .5 }), pk = mat(0xFFB3C6);   /* a gentle elephant */
    const body = mesh(sph(0.45, 28), f, 0.18, -0.2, -0.1); body.scale.set(1.25, 0.95, 0.9); G.add(body); G.add(mesh(sph(0.32, 24), f, -0.32, 0.18, 0.1));
    [-1, 1].forEach(s2 => { const ear = mesh(sph(0.26, 20), f, -0.32 + s2 * 0.3, 0.2, -0.02); ear.scale.set(0.9, 1.1, 0.25); G.add(ear); const ei = mesh(sph(0.18, 16), pk, -0.32 + s2 * 0.31, 0.2, 0.03); ei.scale.set(0.9, 1.1, 0.2); G.add(ei); });
    G.add(tube([[-0.38, 0.05, 0.35], [-0.42, -0.2, 0.42], [-0.36, -0.45, 0.42], [-0.25, -0.5, 0.45]], 0.075, f));
    [[-0.05, 1], [0.45, 1], [0, -1], [0.4, -1]].forEach(([x, z]) => G.add(mesh(cyl(0.11, 0.11, 0.35, 14), f, x, -0.62, z * 0.18 - 0.1)));
    eyes(G, 0.055, 0.12, 0.28, 0.36, 0x2A1A10); G.children.slice(-2).forEach(e2 => e2.position.x -= 0.32); return G; },
  envelope() { const G = new THREE.Group(), m = mat(0xFFF6E2, { rough: .6 }); G.add(mesh(box(1.2, 0.8, 0.06), m));   /* a closed letter envelope with a red seal */
    const fl = new THREE.Shape(); fl.moveTo(-0.6, 0.4); fl.lineTo(0.6, 0.4); fl.lineTo(0, -0.08); fl.closePath(); const f2 = mesh(ext(fl, 0.02, 0.01), mat(0xF0E2C4, { rough: .6 })); f2.position.set(0, 0.2, 0.05); G.add(f2);
    const seal = mesh(cyl(0.1, 0.1, 0.04, 20), mat(0xD84050, { clear: .8 }), 0, 0.0, 0.08); seal.rotation.x = Math.PI / 2; G.add(seal); G.rotation.z = -0.08; return G; },
  cup() { const G = new THREE.Group(), m = mat(0x4DDB6A, { clear: .8, rough: .25 }); G.add(mesh(cyl(0.36, 0.28, 0.68, 36), m));   /* a plain cup */
    const h = mesh(tor(0.18, 0.05, Math.PI * 1.2), m, 0.38, 0.02, 0); h.rotation.z = -Math.PI * 0.6; G.add(h); G.rotation.x = 0.25; return G; },
  carrot() { const G = new THREE.Group(), c = mesh(new THREE.ConeGeometry(0.22, 1.0, 24), mat(0xFF8A2A, { rough: .45, clear: .5 }), 0, -0.1, 0); c.rotation.z = Math.PI; G.add(c);
    for (let i = 0; i < 3; i++) { const l = mesh(new THREE.CapsuleGeometry(0.05, 0.3, 4, 8), mat(0x4DBB3A), (i - 1) * 0.08, 0.55, 0); l.rotation.z = (i - 1) * 0.4; G.add(l); } G.rotation.z = 0.5; return G; },
  cap() { const G = new THREE.Group(), m = mat(0x3F6FE8, { rough: .7, sheen: .6 });   /* a boy's baseball cap */
    const top = mesh(new THREE.SphereGeometry(0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m); top.scale.set(1, 0.8, 1); G.add(top);
    const brim = mesh(cyl(0.42, 0.42, 0.04, 32, 1), m, 0, 0.0, 0.32); brim.scale.set(0.9, 1, 0.75); G.add(brim); G.add(mesh(sph(0.05, 10), mat(0xFFFFFF), 0, 0.36, 0)); G.rotation.set(0.3, -0.5, 0); return G; },
  rock() { const G = new THREE.Group(), r = mesh(new THREE.IcosahedronGeometry(0.5, 2), mat(0x9AA3AE, { rough: .8 })); r.scale.set(1.2, 0.75, 0.9); G.add(r);   /* a round grey rock */
    const r2 = mesh(new THREE.IcosahedronGeometry(0.22, 1), mat(0xB8C0C8, { rough: .8 }), 0.55, -0.2, 0.15); G.add(r2); return G; },
  lock() { const G = new THREE.Group(); G.add(mesh(box(0.7, 0.55, 0.25), mat(0xFFC93C, { clear: 1, rough: .2, metal: .5 }), 0, -0.2, 0));   /* a padlock */
    G.add(mesh(tor(0.24, 0.07, Math.PI), mat(0xB8C0C8, { metal: .7, rough: .2 }), 0, 0.08, 0)); const kh = mesh(cyl(0.06, 0.06, 0.04, 14), mat(0x5A4010), 0, -0.2, 0.14); kh.rotation.x = Math.PI / 2; G.add(kh); return G; },
  card() { const G = new THREE.Group(), sh = new THREE.Shape(), w = 1.0, h = 0.42, r = 0.16;   /* a blank cream word card (the word tiles sit on it) */
    sh.moveTo(-w + r, -h); sh.lineTo(w - r, -h); sh.quadraticCurveTo(w, -h, w, -h + r); sh.lineTo(w, h - r); sh.quadraticCurveTo(w, h, w - r, h); sh.lineTo(-w + r, h); sh.quadraticCurveTo(-w, h, -w, h - r); sh.lineTo(-w, -h + r); sh.quadraticCurveTo(-w, -h, -w + r, -h);
    G.add(mesh(ext(sh, 0.08, 0.04), mat(0xFFE9A8, { rough: .5, clear: .6 }))); return G; },
  truck() { const G = new THREE.Group(); G.add(mesh(box(0.9, 0.5, 0.6), mat(0xFF5A3C, { clear: 1, rough: .25 }), 0.2, 0.0, 0));   /* a toy truck */
    G.add(mesh(box(0.45, 0.42, 0.58), mat(0x3F8FE8, { clear: 1, rough: .25 }), -0.48, -0.04, 0)); G.add(mesh(box(0.2, 0.2, 0.6), mat(0xBFE6FF, { emissive: 0x335577, ei: .2 }), -0.58, 0.05, 0.01));
    [[-0.45, 1], [0.35, 1], [-0.45, -1], [0.35, -1]].forEach(([x, z]) => { const w = mesh(cyl(0.16, 0.16, 0.12, 20), mat(0x2A2A35), x, -0.3, z * 0.3); w.rotation.x = Math.PI / 2; G.add(w); }); G.rotation.y = 0.35; return G; }
});

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
  tomato: { say: 'tomato', beats: ['to', 'ma', 'to'] }, butterfly: { say: 'butterfly', beats: ['but', 'ter', 'fly'] },
  ant: { say: 'ant', beats: ['ant'] }, alligator: { say: 'alligator', beats: ['al', 'li', 'ga', 'tor'] }, anchor: { say: 'anchor', beats: ['an', 'chor'] },
  top: { say: 'top', beats: ['top'] }, tent: { say: 'tent', beats: ['tent'] }, turtle: { say: 'turtle', beats: ['tur', 'tle'] }, teapot: { say: 'teapot', beats: ['tea', 'pot'] },
  penguin: { say: 'penguin', beats: ['pen', 'guin'] }, pot: { say: 'pot', beats: ['pot'] }, pear: { say: 'pear', beats: ['pear'] }, pan: { say: 'pan', beats: ['pan'] }, pumpkin: { say: 'pumpkin', beats: ['pump', 'kin'] },
  faucet: { say: 'tap', beats: ['tap'] }, pinwheel: { say: 'pinwheel', beats: ['pin', 'wheel'] },
  igloo: { say: 'igloo', beats: ['ig', 'loo'] }, inchworm: { say: 'inchworm', beats: ['inch', 'worm'] }, ink: { say: 'ink', beats: ['ink'] },
  nest: { say: 'nest', beats: ['nest'] }, nut: { say: 'nut', beats: ['nut'] }, noodles: { say: 'noodles', beats: ['noo', 'dles'] },
  iguana: { say: 'iguana', beats: ['i', 'gua', 'na'] }, net: { say: 'net', beats: ['net'] }, mountain: { say: 'mountain', beats: ['moun', 'tain'] },
  dog: { say: 'dog', beats: ['dog'] }, duck: { say: 'duck', beats: ['duck'] }, door: { say: 'door', beats: ['door'] }, donut: { say: 'donut', beats: ['do', 'nut'] },
  pin: { say: 'pin', beats: ['pin'] }, tin: { say: 'tin', beats: ['tin'] }, mat: { say: 'mat', beats: ['mat'] }, mailbox: { say: 'mailbox', beats: ['mail', 'box'] },
  grapes: { say: 'grapes', beats: ['grapes'] }, gate: { say: 'gate', beats: ['gate'] }, gift: { say: 'gift', beats: ['gift'] },
  octopus: { say: 'octopus', beats: ['oc', 'to', 'pus'] }, otter: { say: 'otter', beats: ['ot', 'ter'] }, ox: { say: 'ox', beats: ['ox'] },
  kite: { say: 'kite', beats: ['kite'] }, key: { say: 'key', beats: ['key'] }, kettle: { say: 'kettle', beats: ['ket', 'tle'] }, kitten: { say: 'kitten', beats: ['kit', 'ten'] },
  egg: { say: 'egg', beats: ['egg'] }, elephant: { say: 'elephant', beats: ['el', 'e', 'phant'] }, envelope: { say: 'envelope', beats: ['en', 've', 'lope'] },
  cup: { say: 'cup', beats: ['cup'] }, carrot: { say: 'carrot', beats: ['car', 'rot'] }, cap: { say: 'cap', beats: ['cap'] },
  rock: { say: 'rock', beats: ['rock'] }, lock: { say: 'lock', beats: ['lock'] }, truck: { say: 'truck', beats: ['truck'] }
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
  if (u.spinY) G.rotation.y = t * u.spinY;
  if (u.wheel) u.wheel.rotation.z = -t * 2;
  if (u.drip) { const k = (t * 0.8) % 1; u.drip.position.y = -0.12 - k * 0.5; u.drip.scale.setScalar(k < 0.9 ? 1 : 0.01); }
  if (u.flap) G.children.forEach((c, i) => { if (c.scale.z < 0.3 && c.geometry && c.geometry.type === 'SphereGeometry') c.rotation.y = Math.sin(t * 14 + i) * 0.5; });
  if (u.swim) G.rotation.y = Math.sin(t * 2) * 0.25;
  if (u.flame) G.children.forEach(c => { if (c.material && c.material.type === 'MeshBasicMaterial') c.scale.y = 1.8 + Math.sin(t * 13 + c.position.x * 9) * 0.25; });
}
export const PROPS = Object.keys(B);
