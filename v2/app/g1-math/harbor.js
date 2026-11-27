/* Grade 1 Math 2.0, Unit 2 world: the Harbor (v2/curriculum/g1-math/MAP.md, Unit 2).
   A calm, sunny little harbor: gentle water that moves, a wooden dock, a row of round buoys (the number line on the water),
   a small sailboat with a white sail, barrels of cargo, a cargo plank, and gulls gliding high up. Nothing dark or deep-looking:
   the water is a bright, shallow turquoise. No faces on objects. Uses the 3D kit (kit3d.js). */
import { THREE, FAST, canvasTex, numTex, MATS, SOFT, col } from './kit3d.js';

/* the water: a bright turquoise bay with soft moving ripples */
export function harborWorld(S) {
  const g = new THREE.Group(); S.scene.add(g);
  const rip = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#4FC8D9'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { const px = Math.random() * w, py = Math.random() * h, l = 10 + Math.random() * 40; x.strokeStyle = 'rgba(255,255,255,' + (0.05 + Math.random() * 0.18) + ')'; x.lineWidth = 1.5 + Math.random() * 2; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + l / 2, py - 3, px + l, py); x.stroke(); } });
  rip.wrapS = rip.wrapT = THREE.RepeatWrapping; rip.repeat.set(14, 10);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(240, 140), new THREE.MeshPhysicalMaterial({ color: '#7FDDE8', map: rip, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.2, envMapIntensity: 0.9 }));
  water.rotation.x = -Math.PI / 2; water.position.set(0, 0.03, 46); water.receiveShadow = true; g.add(water);
  /* the far shore: a sandy beach and the green hills behind (the kit's hills) */
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(240, 14), MATS.matte('#F2DDA8')); sand.rotation.x = -Math.PI / 2; sand.position.set(0, 0.05, -18); g.add(sand);
  S.tick.push((dt, t) => { rip.offset.x = t * 0.012; rip.offset.y = Math.sin(t * 0.3) * 0.02; });
  /* little houses on the far shore: warm roofs, plain windows (no faces) */
  const roofs = ['#E57A5A', '#5C8FD6', '#F2B632', '#7FB069'];
  for (let i = 0; i < (FAST ? 3 : 7); i++) { const h = new THREE.Group(), x = -36 + i * 12 + (i % 2) * 2;
    const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 2.6), MATS.matte('#FFF4E2')); b.position.y = 1.2; b.castShadow = !FAST; h.add(b);
    const r = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.6, 4), MATS.matte(roofs[i % 4])); r.position.y = 3.2; r.rotation.y = Math.PI / 4; h.add(r);
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), MATS.matte('#9FD3F0')); w.position.set(0.7, 1.4, 1.31); h.add(w);
    h.position.set(x, 0, -22 - (i % 3)); g.add(h); }
  /* a striped lighthouse far away, on the right */
  const lh = new THREE.Group(); [0, 1, 2, 3].forEach(k => { const s = new THREE.Mesh(new THREE.CylinderGeometry(1.1 - k * 0.12, 1.2 - k * 0.12, 1.6, 20), MATS.matte(k % 2 ? '#FFFFFF' : '#E2524A')); s.position.y = 0.8 + k * 1.6; lh.add(s); });
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), MATS.matte('#E2524A')); top.position.y = 6.8; lh.add(top);
  lh.position.set(34, 0, -20); g.add(lh);
  /* gulls: soft white wings gliding in slow circles high up */
  const wing = new THREE.MeshStandardMaterial({ color: '#FFFFFF', side: THREE.DoubleSide, roughness: 0.6 });
  const gulls = []; for (let i = 0; i < (FAST ? 1 : 4); i++) { const b = new THREE.Group(); [-1, 1].forEach(s => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.22), wing); w.position.x = s * 0.45; w.userData.s = s; b.add(w); });
    b.userData = { a: Math.random() * 6, r: 8 + i * 3, y: 11 + i, cx: -10 + i * 7 }; g.add(b); gulls.push(b); }
  S.tick.push((dt, t) => gulls.forEach(b => { const u = b.userData; u.a += dt * 0.15; b.position.set(u.cx + Math.cos(u.a) * u.r, u.y, -16 + Math.sin(u.a) * u.r * 0.4); b.rotation.y = -u.a;
    b.children.forEach(w => { w.rotation.z = w.userData.s * Math.sin(t * 2 + u.a) * 0.3; }); }));
  return g;
}

/* a wooden dock (boardwalk) along the near shore */
export function dock(len = 30, z = 4) {
  const g = new THREE.Group(), plankM = [MATS.phys('#C99A62', { roughness: 0.7, clearcoat: 0.1 }), MATS.phys('#B9874F', { roughness: 0.7, clearcoat: 0.1 })];
  for (let i = 0; i < len / 0.6; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.18, 3.2), plankM[i % 2]); p.position.set(-len / 2 + i * 0.6, 0.45, z); p.castShadow = !FAST; p.receiveShadow = true; g.add(p); }
  for (let i = 0; i <= len / 4; i++) { const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.4, 10), plankM[1]); post.position.set(-len / 2 + i * 4, 0.2, z + 1.6); g.add(post); }
  return g;
}

/* a round buoy floating on the water, with its number on a white top */
const buoyBody = new THREE.CylinderGeometry(0.72, 0.62, 0.7, 28), buoyM = [MATS.phys('#FF7A59', { roughness: 0.35, clearcoat: 0.8 }), MATS.phys('#FFC233', { roughness: 0.35, clearcoat: 0.8 })];
export function buoy(n, o = {}) {
  const g = new THREE.Group(), b = new THREE.Mesh(buoyBody, o.mat || buoyM[Math.abs(n || 0) % 2]); b.position.y = 0.2; b.castShadow = !FAST; g.add(b);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.735, 0.7, 0.16, 28), MATS.phys('#FFFFFF', { roughness: 0.4 })); band.position.y = 0.3; g.add(band);
  const top = new THREE.Mesh(new THREE.CircleGeometry(0.72, 32), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.6 })); top.rotation.x = -Math.PI / 2; top.position.y = 0.56; g.add(top);
  const set = v => { g.userData.n = v; top.material.map = v == null ? null : numTex(v, { bg: '#FFFFFF' }); top.material.color.set(v == null ? '#FFF6E6' : '#FFFFFF'); top.material.needsUpdate = true; };
  set(n); g.setNum = set; g.userData.phase = Math.random() * 6; g.userData.top = top;
  g.bob = t => { b.position.y = 0.2 + Math.sin(t * 1.6 + g.userData.phase) * 0.05; top.position.y = b.position.y + 0.36; band.position.y = b.position.y + 0.1; };
  return g;
}

/* a small sailboat: a rounded hull, a mast and a white sail; a round cargo hatch that can show "the number in your head" */
export function boat(o = {}) {
  const g = new THREE.Group(), hullM = MATS.phys(o.hull || '#3C7DD9', { roughness: 0.3, clearcoat: 1 }), trimM = MATS.phys('#FFFFFF', { roughness: 0.4 }), woodM = MATS.phys('#C99A62', { roughness: 0.6 });
  const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), hullM); hull.scale.set(1.5, 0.7, 0.75); hull.position.y = 0.55; hull.castShadow = !FAST; g.add(hull);
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.08, 32), woodM); deck.scale.set(1.45, 1, 0.72); deck.position.y = 0.56; g.add(deck);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 8, 40), trimM); rim.rotation.x = Math.PI / 2; rim.scale.set(1.5, 0.75, 1); rim.position.y = 0.6; g.add(rim);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.8, 8), woodM); mast.position.set(0.1, 1.95, 0); g.add(mast);
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(1.3, 0); sh.lineTo(0, 2.3); sh.closePath();
  const sail = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ color: '#FFFDF6', side: THREE.DoubleSide, roughness: 0.7 })); sail.position.set(0.18, 0.85, 0); g.add(sail);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.22), new THREE.MeshStandardMaterial({ color: '#FF7A59', side: THREE.DoubleSide })); flag.position.set(0.3, 3.3, 0); g.add(flag);
  /* the hatch sign: a round lid on deck that can show a number (the number in your head) */
  const hatch = new THREE.Mesh(new THREE.CircleGeometry(0.42, 28), new THREE.MeshStandardMaterial({ color: '#FFF6E6', roughness: 0.6 })); hatch.rotation.x = -Math.PI / 2; hatch.position.set(-0.75, 0.62, 0); g.add(hatch);
  g.setHatch = v => { hatch.material.map = v == null ? null : numTex(v, { bg: '#FFF6E6' }); hatch.material.color.set(v == null ? '#C99A62' : '#FFFFFF'); hatch.material.needsUpdate = true; };
  g.setHatch(null);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.8), new THREE.MeshBasicMaterial({ map: SOFT, color: '#1C6E7A', transparent: true, opacity: 0.3, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.05; g.add(shadow);
  g.userData = { sail, flag, hull };
  g.bob = t => { g.rotation.z = Math.sin(t * 1.2) * 0.03; flag.rotation.y = Math.sin(t * 5) * 0.3; };
  return g;
}

/* a wooden barrel of cargo (flour, apples ... never a face) */
const barrelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.62, 18), barrelM = MATS.phys('#B97A45', { roughness: 0.55, clearcoat: 0.25 }), hoopM = MATS.phys('#6E5A4A', { roughness: 0.4, clearcoat: 0.6 });
export function barrel(color) {
  const g = new THREE.Group(), b = new THREE.Mesh(barrelGeo, color ? MATS.phys(color, { roughness: 0.55, clearcoat: 0.25 }) : barrelM); b.position.y = 0.31; b.castShadow = !FAST; g.add(b);
  [0.1, 0.52].forEach(y => { const h = new THREE.Mesh(new THREE.TorusGeometry(0.325, 0.025, 6, 24), hoopM); h.rotation.x = Math.PI / 2; h.position.y = y; g.add(h); });
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.9, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); hit.position.y = 0.4; g.add(hit);
  return g;
}

/* a rope: a soft curved tube from a to b (used to pull the boat back to the dock) */
export function rope(a, b, sag = 0.6) {
  const mid = a.clone().lerp(b, 0.5); mid.y -= sag;
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 24, 0.06, 6, false), MATS.matte('#E8D3A8'));
}
export { col };
