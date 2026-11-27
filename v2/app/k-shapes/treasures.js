/* Kindergarten Shapes: SHAPE TREASURES (Esti, 2026-11-26: "for the bakery use cupcakes ... for the farm use a tractor tire ... farm-related
   shapes, as opposed to the same shapes everywhere"). Art bible: v2/curriculum/k-shapes-art-bible.md.
   In each world the pieces a boy finds, sorts, drags and builds with become real, lovable things from that world, and each one IS the shape:
   - a flat piece keeps its exact outline (the same geometry kit.js always used), so sides stay straight, corners stay corners and a boy
     counting corners counts the true number; only its paint changes (icing on a cookie, a tyre's tread, a sail's cloth ...);
   - the colour a boy sorts by is the main colour of the object;
   - a pattern item differs from its neighbours in ONE feature only (the frosting colour, or the cookie's shape), never two.
   No teaching, voice or rules live here. Used only with the full look (look.js); the automatic test (?fast=1) keeps the plain pieces. */
import * as THREE from 'three';

export function createTreasures({ world, PM: PM0, paint, FAST, ANISO, vivid = c => c, CALM = false }) {
  /* every treasure reflects the room only softly (as the old pieces did), so colours stay rich, never washed to white */
  class PM extends PM0 { constructor(o = {}) { super(Object.assign({ envMapIntensity: o.metalness ? 0.6 : 0.25 }, o)); } }
  const T = {};
  const cache = {};
  const once = (k, make) => cache[k] || (cache[k] = make());

  /* ---------- shared ---------- */
  const shadowy = o => { o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); return o; };
  /* a tube whose thickness changes along its length (frosting swirls, piped icing) */
  function taperTube(points, r0, r1, seg = 160, ring = 18, ridges = 0, depth = 0) {   /* ridges: the grooves a star piping tip leaves */
    const curve = new THREE.CatmullRomCurve3(points), geo = new THREE.TubeGeometry(curve, seg, 1, ring, false), pos = geo.attributes.position, P = new THREE.Vector3(), V = new THREE.Vector3();
    for (let i = 0; i <= seg; i++) { const u = i / seg; curve.getPointAt(u, P); const r = r0 + (r1 - r0) * u;
      for (let j = 0; j <= ring; j++) { const idx = i * (ring + 1) + j, k = ridges ? 1 - depth * (0.5 - 0.5 * Math.cos(j / ring * Math.PI * 2 * ridges)) : 1;
        V.fromBufferAttribute(pos, idx).sub(P).multiplyScalar(r * k).add(P); pos.setXYZ(idx, V.x, V.y, V.z); } }
    pos.needsUpdate = true; geo.computeVertexNormals(); return { geo, curve };
  }

  /* ================= BAKERY ================= */
  /* the cupcake: the same white-and-gold paper case, the same cake, the same swirl; only the frosting colour changes */
  const linerTex = () => once('linerTex', () => paint(512, 64, (x, w, h) => {
    x.fillStyle = '#FFF7EA'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 28; i++) { const px = (i + 0.5) * w / 28; x.fillStyle = 'rgba(214,170,74,.85)'; x.fillRect(px - 1.6, 0, 3.2, h);
      const g = x.createLinearGradient(px - w / 56, 0, px + w / 56, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.0)'); g.addColorStop(0.75, 'rgba(180,150,110,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(px - w / 56, 0, w / 28, h); }
  }));
  const linerGeo = () => once('linerGeo', () => {
    const g = new THREE.CylinderGeometry(0.31, 0.235, 0.36, 112, 3, false), p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const a = Math.atan2(v.z, v.x), r = Math.hypot(v.x, v.z); if (r < 1e-4) continue;
      const k = 1 + 0.032 * Math.abs(Math.cos(a * 14)); p.setXYZ(i, v.x * k, v.y, v.z * k); }   /* the pleats of a paper case */
    g.computeVertexNormals(); g.translate(0, -0.24, 0); return g;
  });
  const swirlGeo = () => once('swirlGeo', () => {
    const pts = [], N = 90, turns = 2.55;
    for (let i = 0; i <= N; i++) { const u = i / N, a = u * turns * Math.PI * 2, R = 0.255 * (1 - u * 0.93) + 0.012; pts.push(new THREE.Vector3(Math.cos(a) * R, -0.02 + u * 0.33 + Math.sin(u * Math.PI) * 0.02, Math.sin(a) * R)); }
    const { geo, curve } = taperTube(pts, 0.122, 0.05, 240, 48, 8, 0.16); return { geo, tip: curve.getPointAt(1) };
  });
  const cakeMat = () => once('cake', () => new PM({ color: '#C98A4B', roughness: 0.85, sheen: 0.3, sheenColor: new THREE.Color('#FFD9A8') }));
  const linerMat = () => once('liner', () => new PM({ color: '#FFFFFF', map: linerTex(), roughness: 0.6, sheen: 0.5, sheenColor: new THREE.Color('#FFFFFF'), side: THREE.DoubleSide }));
  function frostingMat(color) {
    return new PM({ color: new THREE.Color(color), roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.35, sheen: 0.2, sheenColor: new THREE.Color('#FFFFFF'), sheenRoughness: 0.5, emissive: '#FFC400', emissiveIntensity: 0 });
  }
  /* frosting colours: soft and creamy, but each one is clearly its colour word */
  const FROST = { '#E03A33': '#F0484A', '#1F6FEB': '#4C8DF0', '#F2A900': '#FFD21F', '#12A766': '#3DBE78', '#7C4DFF': '#9C72FF', '#FF7A1A': '#FF9A3C', '#00A3B8': '#27BFD0', '#F0458E': '#FF7FB3', '#F5C542': '#FFD95A', '#C0392B': '#E2524A' };
  const frostOf = c => { const f = FROST[String(c).toUpperCase()] || c; return f === '#FFD21F' ? f : keepHue2(f); };   /* butter yellow stays butter yellow */
  function keepHue2(c) { const col = new THREE.Color(c), l = 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b; return l > 0.32 ? '#' + col.multiplyScalar(0.32 / l * 0.95 + 0.05).getHexString() : c; }
  function cupcake(color, topping) {
    const g = new THREE.Group();
    const liner = new THREE.Mesh(linerGeo(), linerMat()); g.add(liner);
    const base = new THREE.Mesh(new THREE.CircleGeometry(0.235, 40), linerMat()); base.rotation.x = Math.PI / 2; base.position.y = -0.419; g.add(base);
    const cake = new THREE.Mesh(once('cakeGeo', () => new THREE.SphereGeometry(0.33, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2)), cakeMat()); cake.scale.y = 0.42; cake.position.y = -0.065; g.add(cake);
    const fm = frostingMat(frostOf(color));
    const dome = new THREE.Mesh(once('domeGeo', () => new THREE.SphereGeometry(0.31, 40, 18, 0, Math.PI * 2, 0, Math.PI / 2)), fm); dome.scale.y = 0.34; dome.position.y = -0.03; g.add(dome);
    const S = swirlGeo(), sw = new THREE.Mesh(S.geo, fm); g.add(sw);
    const tip = new THREE.Mesh(once('tipGeo', () => new THREE.SphereGeometry(0.05, 20, 14)), fm); tip.position.copy(S.tip); tip.scale.set(1, 1.5, 1); tip.position.y += 0.03; g.add(tip);
    if (topping === 'cherry') { const ch = new THREE.Mesh(once('cherryGeo', () => new THREE.SphereGeometry(0.085, 24, 16)), once('cherryM', () => new PM({ color: '#D7263D', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 }))); ch.position.set(S.tip.x, S.tip.y + 0.1, S.tip.z); g.add(ch);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.12, 6), once('stemM', () => new PM({ color: '#5C8A2E', roughness: 0.6 }))); st.position.set(S.tip.x + 0.02, S.tip.y + 0.2, S.tip.z); st.rotation.z = -0.35; g.add(st); }
    if (topping === 'sprinkles') { const R = rng(7), cols = ['#FF5C8A', '#4CC3FF', '#FFD23F', '#7BDC6B', '#B98CFF', '#FFFFFF'], sg = once('sprGeo', () => new THREE.CapsuleGeometry(0.011, 0.04, 3, 6));
      const dummy = new THREE.Object3D(), sp = new THREE.InstancedMesh(sg, new THREE.MeshStandardMaterial({ roughness: 0.4 }), 60), P = S.geo.attributes.position;
      for (let i = 0; i < 60; i++) { const k = Math.floor(R() * P.count); dummy.position.fromBufferAttribute(P, k); dummy.rotation.set(R() * 6, R() * 6, R() * 6); dummy.updateMatrix(); sp.setMatrixAt(i, dummy.matrix); sp.setColorAt(i, new THREE.Color(cols[i % cols.length])); }
      g.add(sp); }
    g.material = fm;   /* kit.js lights the frosting when it says "that part repeats" */
    g.userData.recolor = c => fm.color.set(frostOf(c));
    return shadowy(g);
  }
  /* an iced sugar cookie in the exact shape: golden baked edge, smooth icing in the colour, a piped white line just inside the edge */
  function icingTex(color, kind) {
    return once('icing' + color + kind, () => { const t = paint(512, 512, (x, w, h) => {
      const c = new THREE.Color(frostOf(color)), lite = c.clone().lerp(new THREE.Color('#FFFFFF'), 0.35);
      const g = x.createRadialGradient(w * 0.38, h * 0.36, 0, w / 2, h / 2, w * 0.7); g.addColorStop(0, '#' + lite.getHexString()); g.addColorStop(0.55, '#' + c.getHexString()); g.addColorStop(1, '#' + c.clone().multiplyScalar(0.88).getHexString());
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      const R = rng(kind.length * 31 + 3); x.fillStyle = 'rgba(255,255,255,.85)';   /* a few sugar pearls */
      for (let i = 0; i < 9; i++) { const a = R() * 6.28, r = R() * w * 0.12; x.beginPath(); x.arc(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, 5 + R() * 3, 0, 7); x.fill(); }
    }); t.repeat.set(0.5, 0.5); t.offset.set(0.5, 0.5); return t; });
  }
  const doughMat = () => once('dough', () => new PM({ color: '#E2A45C', roughness: 0.8, sheen: 0.4, sheenColor: new THREE.Color('#FFE2B0') }));
  function cookie(shape, color, kind) {
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 5, curveSegments: 48 }); geo.translate(0, 0, -0.08); geo.scale(0.52, 0.52, 1);
    const ice = new PM({ color: '#FFFFFF', map: icingTex(color, kind), roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2, emissive: '#FFC400', emissiveIntensity: 0 });
    const m = new THREE.Mesh(geo, [ice, doughMat()]);
    /* the piped white line just inside the edge: the same outline, a little smaller, so corners stay corners */
    const pts = shape.getPoints(64), cx = pts.reduce((s, p) => s + p.x, 0) / pts.length, cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const line = pts.map(p => new THREE.Vector3(cx + (p.x - cx) * 0.8, cy + (p.y - cy) * 0.8, 0)); line.push(line[0].clone());
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line, true, 'catmullrom', 0.02), 160, 0.028, 8, true), once('pipe', () => new PM({ color: '#FFFFFF', roughness: 0.35, clearcoat: 0.6 })));
    tube.scale.set(0.52, 0.52, 1); tube.position.z = 0.08 + 0.07 + 0.005; m.add(tube);
    m.material.emissive = ice.emissive; const g = new THREE.Group(); g.add(m); g.material = ice;
    g.userData.recolor = c => { ice.map = icingTex(c, kind); ice.needsUpdate = true; };
    return shadowy(g);
  }
  /* a shop counter bell (the "ding" of the bakery) and a little toy drum: sound patterns stay sound patterns */
  function bell(color) {
    const g = new THREE.Group(), gold = new PM({ color: frostOf(color), metalness: 0.75, roughness: 0.22, clearcoat: 1, emissive: '#FFC400', emissiveIntensity: 0 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.08, 48), once('bellBase', () => new PM({ color: '#8B5A34', roughness: 0.45, clearcoat: 0.8 }))); base.position.y = -0.3; g.add(base);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), gold); dome.position.y = -0.27; dome.scale.y = 0.95; g.add(dome);
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 16), gold); btn.position.y = 0.04; g.add(btn);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 12), gold); cap.position.y = 0.1; cap.scale.y = 0.6; g.add(cap);
    g.material = gold; return shadowy(g);
  }
  function drum(color) {
    const g = new THREE.Group(), body = new PM({ color: frostOf(color), roughness: 0.35, clearcoat: 0.9, emissive: '#FFC400', emissiveIntensity: 0 });
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.42, 48), body); g.add(shell);
    const skin = once('drumSkin', () => new PM({ color: '#FFF4E0', roughness: 0.6, sheen: 0.4 }));
    [-1, 1].forEach(s => { const top = new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.02, 48), skin); top.position.y = s * 0.215; g.add(top);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 10, 48), once('drumRim', () => new PM({ color: '#FFFFFF', roughness: 0.3, clearcoat: 1 }))); rim.rotation.x = Math.PI / 2; rim.position.y = s * 0.2; g.add(rim); });
    const zig = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI * 2; zig.push(new THREE.Vector3(Math.cos(a) * 0.335, i % 2 ? 0.16 : -0.16, Math.sin(a) * 0.335)); }
    for (let i = 0; i < 12; i++) { const a = zig[i], b = zig[i + 1], len = a.distanceTo(b), c = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 6), once('cord', () => new PM({ color: '#FFFFFF', roughness: 0.5 })));
      c.position.copy(a).add(b).multiplyScalar(0.5); c.lookAt(b); c.rotateX(Math.PI / 2); g.add(c); }
    g.rotation.x = 0.35; const w = new THREE.Group(); w.add(g); w.material = body; return shadowy(w);
  }

  /* painted cupcakes (art/cupcake-<colour>.png, from the picture account): a picture card that always faces the camera.
     Only the frosting colour differs from one to the next. A soft warm glow behind it when kit.js lights "the part that repeats". */
  const CUP = { '#E03A33': 'red', '#1F6FEB': 'blue', '#F2A900': 'yellow', '#12A766': 'green' };
  const cupTex = {};
  function cupPic(name) { return cupTex[name] || (cupTex[name] = (() => { const t = loader.load('art/cupcake-' + name + '.png'); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANISO; return t; })()); }
  function paintedCupcake(color) {
    const g = new THREE.Group(), name = CUP[String(color).toUpperCase()];
    const m = new THREE.MeshBasicMaterial({ map: cupPic(name), transparent: true, alphaTest: 0.05, fog: false, side: THREE.DoubleSide });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.84 * 475 / 384), m); card.position.y = -0.42 + 0.84 * 475 / 384 / 2; g.add(card);
    const halo = new THREE.Mesh(new THREE.CircleGeometry(0.62, 40), new THREE.MeshBasicMaterial({ color: '#FFD45A', transparent: true, opacity: 0.55, depthWrite: false, fog: false })); halo.visible = false; halo.position.set(0, 0.02, -0.02); card.add(halo);
    card.onBeforeRender = () => { const q = new THREE.Quaternion(); g.getWorldQuaternion(q); card.quaternion.copy(q.invert().multiply(T.camera.quaternion)); };
    g.material = { set emissive(v) {}, get emissive() { return new THREE.Color(); }, set emissiveIntensity(v) { halo.visible = v > 0; }, get emissiveIntensity() { return halo.visible ? 0.5 : 0; }, color: { set: c => { const n = CUP[String(c).toUpperCase()]; if (n) { m.map = cupPic(n); m.needsUpdate = true; } } } };
    g.userData.recolor = c => g.material.color.set(c); g.userData.flat = true;
    return g;
  }

  /* ================= FARM: the things on the scale (same sizes as before, so the weighing is exactly the same) =================
     rock = a smooth field stone, ball = a ball of wool in its colour, block = a little hay bale with twine, feather = a soft hen's feather */
  const strawTex = () => once('straw', () => { const t = paint(256, 256, (x, w, h) => { x.fillStyle = '#E9BE4E'; x.fillRect(0, 0, w, h); const R = rng(5);
    for (let i = 0; i < 900; i++) { x.strokeStyle = ['#D9A52E', '#F6D477', '#C98F22', '#FFE39A'][i % 4]; x.lineWidth = 1.2 + R() * 1.5; const px = R() * w, py = R() * h, a = (R() - 0.5) * 0.5; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * 22, py + Math.sin(a) * 22); x.stroke(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; });
  const stoneTex = () => once('stoneT', () => paint(256, 128, (x, w, h) => { x.fillStyle = '#9A9086'; x.fillRect(0, 0, w, h); const R = rng(9); for (let i = 0; i < 500; i++) { x.fillStyle = ['rgba(255,255,255,.12)', 'rgba(60,50,40,.12)', 'rgba(200,180,150,.15)'][i % 3]; x.beginPath(); x.arc(R() * w, R() * h, 0.8 + R() * 2.5, 0, 7); x.fill(); } }));
  function fieldStone(s) {
    const geo = new THREE.SphereGeometry(0.36 * s, 40, 28), p = geo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = 1 + 0.06 * Math.sin(v.x * 9 / s + 1) * Math.cos(v.z * 7 / s) + 0.04 * Math.sin(v.y * 11 / s); p.setXYZ(i, v.x * k * 1.15, v.y * k * 0.78, v.z * k); }
    geo.computeVertexNormals(); const r = new THREE.Mesh(geo, new PM({ color: '#FFFFFF', map: stoneTex(), roughness: 0.75, clearcoat: 0.2 })); r.position.y = 0.28 * s; return r;
  }
  function woolBall(s, color) {
    const R0 = 0.62 * s, g = new THREE.Group(), col = vivid(color);
    const core = new THREE.Mesh(new THREE.SphereGeometry(R0 * 0.97, 36, 24), new PM({ color: shade(col, 0.8), roughness: 0.95, sheen: 1, sheenColor: C(tint(col, 0.5)) })); g.add(core);
    const yarn = new PM({ color: col, roughness: 0.9, sheen: 1, sheenColor: C(tint(col, 0.6)), sheenRoughness: 0.6 }), Rr = rng(11);
    for (let k = 0; k < 14; k++) {   /* strands wound round and round, each a great circle at its own angle */
      const ax = new THREE.Vector3(Rr() - 0.5, Rr() - 0.5, Rr() - 0.5).normalize(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), ax), pts = [];
      for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * R0, 0, Math.sin(a) * R0).applyQuaternion(q)); }
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 80, R0 * 0.045, 6, true), yarn)); }
    const tail = []; for (let i = 0; i <= 20; i++) { const u = i / 20; tail.push(new THREE.Vector3(R0 * (0.6 + u * 0.7), -R0 * 0.85 + Math.sin(u * 3) * 0.05, R0 * 0.3 * (1 - u))); }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tail), 30, R0 * 0.045, 6, false), yarn));
    g.position.y = R0; return g;
  }
  /* a party balloon resting on the scale: every child knows a balloon is light, even a big one (Esti: a big ball of yarn against a rock was confusing) */
  function balloon(s, color) {
    const R0 = 0.62 * s, g = new THREE.Group(), col = vivid(color), m = new PM({ color: col, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 });
    /* a real balloon shape (round on top, narrowing to a knot), so it never looks like an egg or a ball (K-CLARITY-RULES 7) */
    const prof = []; for (let i = 0; i <= 24; i++) { const t = i / 24, a = Math.PI * t; prof.push(new THREE.Vector2(Math.max(0.001, Math.sin(a) * R0 * (1 - 0.32 * Math.pow(1 - t, 3))), -Math.cos(a) * R0 * 1.18)); }
    const b = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), m); b.position.y = R0 * 1.18 + R0 * 0.16; g.add(b);
    const knot = new THREE.Mesh(new THREE.ConeGeometry(R0 * 0.16, R0 * 0.22, 16), m); knot.rotation.x = Math.PI; knot.position.y = R0 * 0.1; g.add(knot);
    const sm = new PM({ color: '#FFFFFF', roughness: 0.5 });
    const str = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(R0 * 0.35, 0.02, R0 * 0.25), new THREE.Vector3(R0 * 0.7, 0.02, -R0 * 0.1), new THREE.Vector3(R0 * 1.1, 0.02, R0 * 0.3), new THREE.Vector3(R0 * 1.5, 0.02, R0 * 0.05)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(str, 40, Math.max(0.012, R0 * 0.025), 6, false), sm));   /* its string lies curled on the pan */
    return g;
  }
  function hayBale(s) {
    const e = 0.75 * s, g = new THREE.Group(), t = strawTex().clone(); t.needsUpdate = true; t.repeat.set(1.5 * s, 1.5 * s);
    const b = new THREE.Mesh(new THREE.BoxGeometry(e, e, e, 1, 1, 1), new PM({ color: '#FFFFFF', map: t, roughness: 0.95, sheen: 0.4, sheenColor: C('#FFE9A8') })); g.add(b);
    const twine = once('twine', () => new PM({ color: '#B7793A', roughness: 0.8 }));
    [-0.22, 0.22].forEach(d => { const band = new THREE.Mesh(new THREE.BoxGeometry(e * 1.02, e * 1.02, e * 0.05), twine); band.position.z = d * e; g.add(band); });
    g.position.y = e / 2; return g;
  }
  function henFeather(color) {   /* a small light feather (review 2: the brown one read as a leaf and looked bigger than the rock): barbs drawn one by one from the quill, a soft fluffy end, light blue */
    const col = color || '#6FB3E6';
    const tex = once('featherT' + col, () => paint(512, 192, (x, w, h) => { x.clearRect(0, 0, w, h); const c = new THREE.Color(col), lite = '#' + c.clone().lerp(new THREE.Color('#FFFFFF'), 0.45).getHexString(), dark = '#' + c.clone().multiplyScalar(0.8).getHexString();
      const q0 = 40, q1 = w - 24, mid = h / 2, env = t => Math.sin(Math.PI * Math.min(1, t * 1.08)) * (0.42 - 0.12 * t) * h;   /* how far the barbs reach along the feather */
      x.lineCap = 'round';
      for (let i = 0; i < 120; i++) { const t = i / 119, px = q0 + (q1 - q0) * t, L = env(t), gap = (i % 23 === 7) || (i % 31 === 15);   /* a few gaps, like a real feather */
        if (gap) continue; [-1, 1].forEach(sd => { x.strokeStyle = i % 3 ? col : lite; x.lineWidth = 4; x.beginPath(); x.moveTo(px, mid); x.quadraticCurveTo(px + L * 0.35, mid + sd * L * 0.55, px + L * 0.55, mid + sd * L); x.stroke(); }); }
      for (let i = 0; i < 26; i++) { const px = q0 + i * 2.2, a = (i % 2 ? 1 : -1) * (0.6 + (i % 5) * 0.15); x.strokeStyle = lite; x.lineWidth = 3; x.beginPath(); x.moveTo(px, mid); x.lineTo(px + Math.cos(a) * 26, mid + Math.sin(a) * 30); x.stroke(); }   /* fluffy down at the quill end */
      x.strokeStyle = dark; x.lineWidth = 5; x.beginPath(); x.moveTo(8, mid + 3); x.quadraticCurveTo(w * 0.5, mid - 4, q1 + 10, mid - 2); x.stroke(); }, { srgb: true }));
    const vane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), new PM({ color: '#FFFFFF', map: tex, transparent: true, alphaTest: 0.35, roughness: 0.9, side: THREE.DoubleSide }));
    vane.rotation.x = -Math.PI / 2 + 1.25; vane.scale.setScalar(0.95); const f = new THREE.Group(); f.add(vane); f.position.y = 0.3; f.rotation.y = 0.2; return f;
  }
  T.weighable = (W) => {
    if (world !== 'farm') return null;
    const s = W.s || 1;
    const o = W.look === 'rock' ? fieldStone(s) : W.look === 'ball' ? woolBall(s, W.color) : W.look === 'balloon' ? balloon(s, W.color) : W.look === 'block' ? hayBale(s) : W.look === 'feather' ? henFeather(W.color) : null;
    if (!o) return null;
    const first = []; o.traverse(c => { if (c.isMesh && !first.length) first.push(c); }); if (!o.material) o.material = first[0].material;
    o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    return o;
  };

  /* ================= TRAIN TOWN: pattern items are toy train cars (the colour is the car's paint), shape items are signal signs
     (all the same paint, so only the shape changes), the bell is a shiny locomotive bell; they ride on a real track behind a little engine ================= */
  const wheelGeo = () => once('wheelGeo', () => { const g = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 28); g.rotateX(Math.PI / 2); return g; });
  const wheelM = () => once('wheelM', () => new PM({ color: '#2E3440', roughness: 0.4, clearcoat: 0.6 }));
  const hubM = () => once('hubM', () => new PM({ color: '#E8C35A', metalness: 0.5, roughness: 0.3 }));
  function wheels(g, xs, y, z) { xs.forEach(x => [-1, 1].forEach(sd => { const w = new THREE.Mesh(wheelGeo(), wheelM()); w.position.set(x, y, sd * z); g.add(w);
    const h = new THREE.Mesh(once('hubGeo', () => { const q = new THREE.CylinderGeometry(0.045, 0.045, 0.07, 16); q.rotateX(Math.PI / 2); return q; }), hubM()); h.position.set(x, y, sd * (z + 0.005)); g.add(h); })); }
  function trainCar(color, exact) {
    const g = new THREE.Group(), col = exact ? color : keepHue(vivid(color)), paintM = new PM({ color: col, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, emissive: '#FFC400', emissiveIntensity: 0 });
    const body = new THREE.Mesh(once('carGeo', () => new RoundedBoxGeometryLite(0.7, 0.44, 0.46, 0.06)), paintM); body.position.y = -0.08; g.add(body);
    const roof = new THREE.Mesh(once('roofGeo', () => new RoundedBoxGeometryLite(0.78, 0.07, 0.54, 0.03)), once('roofM', () => new PM({ color: '#F7F2E8', roughness: 0.35, clearcoat: 0.8 }))); roof.position.y = 0.18; g.add(roof);
    const winM = once('winM', () => new PM({ color: '#FFF6D8', roughness: 0.2, clearcoat: 1, emissive: '#FFE9A8', emissiveIntensity: 0.25 }));
    [-0.17, 0.17].forEach(x => { const w = new THREE.Mesh(once('winGeo', () => new RoundedBoxGeometryLite(0.2, 0.16, 0.48, 0.03)), winM); w.position.set(x, -0.02, 0); g.add(w); });
    const base = new THREE.Mesh(once('chassis', () => new THREE.BoxGeometry(0.74, 0.06, 0.4)), wheelM()); base.position.y = -0.31; g.add(base);
    wheels(g, [-0.2, 0.2], -0.33, 0.2);
    g.material = paintM; g.userData.recolor = c => paintM.color.set(keepHue(vivid(c)));
    return shadowy(g);
  }
  function signalSign(shape) {
    const g = new THREE.Group(), front = new PM({ color: '#FFC000', roughness: 0.25, clearcoat: 1, emissive: '#FFC400', emissiveIntensity: 0 });
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 4, curveSegments: 48 }); geo.translate(0, 0, -0.04); geo.scale(0.5, 0.5, 1);
    const plate = new THREE.Mesh(geo, [front, once('signEdgeM', () => new PM({ color: '#FFFFFF', roughness: 0.3, clearcoat: 1 }))]); plate.position.y = 0.06; g.add(plate);
    const rim = insetLine(shape, { color: '#FFFFFF', r: 0.035, at: 0.8 }, '#FFFFFF'); rim.scale.set(0.5, 0.5, 1); rim.position.z = 0.085; plate.add(rim);
    const post = new THREE.Mesh(once('postGeo', () => new THREE.CylinderGeometry(0.035, 0.035, 0.42, 12)), once('postM', () => new PM({ color: '#8E99A6', metalness: 0.4, roughness: 0.35 }))); post.position.y = -0.24; g.add(post);
    g.material = front; return shadowy(g);
  }
  function shapeCar(shape) {
    const g = trainCar('#F6EEDD', true);   /* every shape car is the same cream car: only the shape on it changes */
    const front = new PM({ color: '#E0372E', roughness: 0.25, clearcoat: 1 });
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 40 }); geo.scale(0.46, 0.46, 1);   /* big enough that circle, triangle and square are easy to tell apart (K-CLARITY-RULES 9) */
    const sign = new THREE.Mesh(geo, [front, once('signEdgeM2', () => new PM({ color: '#FFFFFF', roughness: 0.3 }))]); sign.position.set(0, 0.22 + 0.32, 0.0); g.add(sign);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), once('postM2', () => new PM({ color: '#8E99A6', metalness: 0.4, roughness: 0.35 }))); post.position.set(0, 0.32, 0); g.add(post);
    g.userData.recolor = () => {}; g.material = front;
    return shadowy(g);
  }
  function trainBell(color) {
    const g = new THREE.Group(), brass = new PM({ color: '#F4C64E', metalness: 0.45, roughness: 0.25, envMapIntensity: 0.8, clearcoat: 1, emissive: '#FFC400', emissiveIntensity: 0 });
    const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push(new THREE.Vector2(0.06 + 0.24 * Math.pow(u, 1.6) + (u > 0.9 ? (u - 0.9) * 0.5 : 0), 0.22 - u * 0.5)); }
    const bell = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), brass); g.add(bell);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), brass); top.position.y = 0.24; g.add(top);
    const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 24, Math.PI), once('yokeM', () => new PM({ color: '#2E3440', roughness: 0.4 }))); yoke.position.y = 0.05; g.add(yoke);
    void color; g.material = brass; return shadowy(g);
  }
  function engine() {
    const g = new THREE.Group(), red = once('engCab', () => new PM({ color: '#2F5FB8', roughness: 0.3, clearcoat: 1 })), black = wheelM();
    const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.62, 28), once('engRedB', () => new PM({ color: '#E0372E', roughness: 0.3, clearcoat: 1 }))); boiler.rotation.z = Math.PI / 2; boiler.position.set(0.12, -0.08, 0); g.add(boiler);
    const cab = new THREE.Mesh(new RoundedBoxGeometryLite(0.36, 0.5, 0.48, 0.05), red); cab.position.set(-0.3, 0.0, 0); g.add(cab);
    const roof = new THREE.Mesh(new RoundedBoxGeometryLite(0.46, 0.06, 0.56, 0.03), black); roof.position.set(-0.3, 0.27, 0); g.add(roof);
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.2, 16), black); stack.position.set(0.3, 0.18, 0); g.add(stack);
    const front = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.04, 28), hubM()); front.rotation.z = Math.PI / 2; front.position.set(0.44, -0.08, 0); g.add(front);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.4), black); base.position.y = -0.31; g.add(base);
    wheels(g, [-0.3, 0.0, 0.28], -0.33, 0.2); return shadowy(g);
  }
  /* a rounded box made here (treasures.js does not load the kit's RoundedBoxGeometry) */
  function RoundedBoxGeometryLite(w, h, d, r) { const sh = new THREE.Shape(), x = w / 2 - r, y = h / 2 - r;
    sh.moveTo(-x, -h / 2); sh.lineTo(x, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -y); sh.lineTo(w / 2, y); sh.quadraticCurveTo(w / 2, h / 2, x, h / 2); sh.lineTo(-x, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, y); sh.lineTo(-w / 2, -y); sh.quadraticCurveTo(-w / 2, -h / 2, -x, -h / 2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.5, bevelSegments: 3, curveSegments: 6 }); g.translate(0, 0, -(d - 2 * r) / 2); return g; }

  /* ================= SOLIDS: the exact sphere, cube, cylinder and cone, painted as a real thing from the world =================
     returns { mat: material or [materials by face], extras: [small details that do not change the solid's form] } */
  function solidTex(key, w, h, draw) { return once('sol' + key, () => paint(w, h, draw)); }
  function bands(col, n, lite) { return (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { x.fillStyle = i % 2 ? tint(col, lite) : shade(col, 0.82); x.globalAlpha = 0.7; x.fillRect(0, h * (i + 0.3) / n, w, h * (0.25 + (i % 3) * 0.12) / n); } x.globalAlpha = 1; }; }
  T.solid = (kind, color) => {
    const col = keepHue(vivid(color)), M = (map, o = {}) => new PM(Object.assign({ color: '#FFFFFF', map, roughness: 0.4, clearcoat: 0.6, emissive: '#FFC400', emissiveIntensity: 0 }, o));
    if (world === 'space') {
      if (kind === 'sphere') return { mat: M(solidTex('planet' + col, 512, 256, bands(col, 7, 0.45)), { roughness: 0.55, clearcoat: 0.2 }) };   /* a planet with soft bands */
      if (kind === 'cube') return { mat: M(solidTex('cargo' + col, 256, 256, (x, w, h) => { lightWash(x, w, h, col, 0.2, 0.9); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 10; x.strokeRect(14, 14, w - 28, h - 28);
        x.fillStyle = '#EEF3FF'; [[30, 30], [w - 30, 30], [30, h - 30], [w - 30, h - 30]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 8, 0, 7); x.fill(); }); }), { metalness: 0.15 }) };   /* a cargo box */
      if (kind === 'cyl') { const side = M(solidTex('tank' + col, 512, 256, (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h); x.fillStyle = '#F4F7FF'; x.fillRect(0, h * 0.12, w, h * 0.1); x.fillRect(0, h * 0.78, w, h * 0.1); }), { metalness: 0.2 });
        return { mat: [side, M(null, { color: '#E6ECF5', metalness: 0.4 }), M(null, { color: '#E6ECF5', metalness: 0.4 })] }; }   /* a fuel tank */
      if (kind === 'cone') return { mat: [M(solidTex('nose' + col, 512, 256, (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h); x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, w, h * 0.22); x.fillRect(0, h * 0.62, w, h * 0.08); })), M(null, { color: '#E6ECF5' })] };   /* a rocket nose */
    }
    if (world === 'underwater') {
      if (kind === 'sphere') return { mat: new PM({ color: col, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.35, sheenColor: C('#FFC0E0'), envMapIntensity: 0.5, emissive: '#FFC400', emissiveIntensity: 0 }) };   /* a glossy pearl in its colour (it must stand out on the sand) */
      if (kind === 'cube') return { mat: M(solidTex('chest' + col, 256, 256, (x, w, h) => { lightWash(x, w, h, col, 0.2, 0.85); x.strokeStyle = 'rgba(60,30,10,.35)'; x.lineWidth = 4; for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(0, i * h / 4); x.lineTo(w, i * h / 4); x.stroke(); }
        x.fillStyle = '#E8C35A'; x.fillRect(0, 0, w, 16); x.fillRect(0, h - 16, w, 16); x.fillRect(0, 0, 16, h); x.fillRect(w - 16, 0, 16, h); }), { roughness: 0.55 }) };   /* a treasure box: planks and gold bands */
      if (kind === 'cyl') { const side = M(solidTex('barrel' + col, 512, 256, (x, w, h) => { lightWash(x, w, h, col, 0.2, 0.85); x.strokeStyle = 'rgba(60,30,10,.3)'; x.lineWidth = 4; for (let i = 0; i < 16; i++) { x.beginPath(); x.moveTo(i * w / 16, 0); x.lineTo(i * w / 16, h); x.stroke(); }
        x.fillStyle = '#B9C2CC'; x.fillRect(0, h * 0.15, w, h * 0.07); x.fillRect(0, h * 0.78, w, h * 0.07); }), { roughness: 0.6 }); const top = M(null, { color: shade(col, 0.9), roughness: 0.6 }); return { mat: [side, top, top] }; }   /* a little barrel */
      if (kind === 'cone') return { mat: [M(solidTex('spire' + col, 512, 256, (x, w, h) => { x.fillStyle = tint(col, 0.35); x.fillRect(0, 0, w, h); x.strokeStyle = shade(col, 0.85); x.lineWidth = 10; for (let i = -4; i < 8; i++) { x.beginPath(); x.moveTo(i * w / 4, 0); x.lineTo(i * w / 4 + w / 2, h); x.stroke(); } }), { roughness: 0.25, clearcoat: 1 }), M(null, { color: tint(col, 0.5) })] };   /* a spiral sea shell */
    }
    if (world === 'party') {
      if (kind === 'sphere') { const knot = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 16), new PM({ color: col, roughness: 0.3, clearcoat: 1 })); knot.position.y = -0.66; knot.rotation.x = Math.PI;
        return { mat: new PM({ color: col, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, emissive: '#FFC400', emissiveIntensity: 0 }), extras: [knot] }; }   /* a balloon (a tiny knot underneath) */
      if (kind === 'cube') return { mat: M(solidTex('gift' + col, 256, 256, (x, w, h) => { lightWash(x, w, h, col, 0.2, 0.9); x.fillStyle = '#FFF4D6'; x.fillRect(w * 0.42, 0, w * 0.16, h); x.fillRect(0, h * 0.42, w, h * 0.16); })) };   /* a gift box with a ribbon */
      if (kind === 'cyl') { const side = M(solidTex('cake' + col, 512, 256, (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h); x.fillStyle = '#FFF8EE'; x.fillRect(0, 0, w, h * 0.22);
        for (let i = 0; i < 18; i++) { x.beginPath(); x.ellipse((i + 0.5) * w / 18, h * 0.22, w / 40, h * (0.08 + (i % 3) * 0.05), 0, 0, Math.PI); x.fill(); } x.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 24; i++) { x.beginPath(); x.arc((i + 0.5) * w / 24, h * 0.88, 6, 0, 7); x.fill(); } }));
        return { mat: [side, M(null, { color: '#FFF8EE', roughness: 0.5 }), M(null, { color: '#E9D3B0' })] }; }   /* a round cake: frosting drips and piped pearls (no candles, no writing) */
      if (kind === 'cone') { const pom = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), new PM({ color: '#FFFFFF', roughness: 0.9, sheen: 1 })); pom.position.y = 0.66;
        return { mat: [M(solidTex('hat' + col, 512, 256, (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 40; i++) { x.beginPath(); x.arc((i * 53) % w, ((i * 97) % h), 7, 0, 7); x.fill(); } })), M(null, { color: '#FFFFFF' })], extras: [pom] }; }   /* a party hat with dots and a pom-pom */
    }
    return null;
  };

  /* ================= BOXES that belong to the world (same size, the shape picture stays on the front) =================
     the box's own planks are repainted (planks whose material is the box body), and small details are added outside the opening */
  const BOXLOOK = {
    farm: { body: '#C8423A', rim: '#FFFFFF', name: 'a red farm wagon', wheels: '#3A3330', hubs: '#F2C94C' },
    bakery: { body: 'stripes', rim: '#FFFFFF', name: 'a pink-and-cream pastry box' },
    garden: { body: '#B98450', rim: '#7DBE4A', name: 'a wooden garden planter', leaves: true },
    space: { body: '#DDE4EF', rim: '#9C72FF', name: 'a silver cargo hold', rivets: true, metal: 0.4 },
    underwater: { body: '#B57A45', rim: '#E8C35A', name: 'a treasure chest', corners: '#E8C35A' },
    traintown: { body: '#2F80FF', rim: '#FFFFFF', name: 'a train wagon', wheels: '#2E3440', hubs: '#E8C35A' },
    jungle: { body: '#A8743F', rim: '#4FAE4A', name: 'a wooden jungle crate', leaves: true },
    snow: { body: '#E9F4FF', rim: '#FFFFFF', name: 'a sled box with snow on top', snowcap: true },
    party: { body: '#FF7FB3', rim: '#FFD23F', name: 'a gift box with a bow', bow: '#FFD23F' },
    beach: { body: '#2FB7C9', rim: '#FFFFFF', name: 'a beach-toy crate', shells: true },
    sky: { body: '#F7F2E8', rim: '#9FD3FF', name: 'a balloon basket', wicker: true },
    toyland: { body: '#FF8FB1', rim: '#FFFFFF', name: 'a toy chest' }
  };
  T.decorBox = (g, BX) => {
    const B = BOXLOOK[world]; if (!B || FAST) return;
    let bodyM;
    if (B.body === 'stripes') { const t = once('pastryStripes', () => { const q = paint(256, 64, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#FFF4E6' : '#F7A8BE'; x.fillRect(i * w / 8, 0, w / 8, h); } }); q.wrapS = THREE.RepeatWrapping; q.repeat.set(2, 1); return q; }); bodyM = new PM({ color: '#FFFFFF', map: t, roughness: 0.6 }); }
    else if (B.wicker && CALM) bodyM = new PM({ color: '#D9B27A', roughness: 0.4, clearcoat: 0.6 });   /* calm: a plain basket colour, no woven checks */
    else if (B.wicker) { const t = once('wicker', () => { const q = paint(128, 128, (x, w, h) => { x.fillStyle = '#C99456'; x.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.fillStyle = (i + j) % 2 ? '#E0B477' : '#B07D44'; x.fillRect(i * 16 + 1, j * 16 + 1, 14, 14); } }); q.wrapS = q.wrapT = THREE.RepeatWrapping; q.repeat.set(3, 1); return q; }); bodyM = new PM({ color: '#FFFFFF', map: t, roughness: 0.75 }); }
    else bodyM = new PM({ color: B.body, roughness: 0.35, clearcoat: 0.8, metalness: B.metal || 0 });
    const rimM = new PM({ color: B.rim, roughness: 0.3, clearcoat: 1 });
    /* repaint: the box's planks are its first five meshes (floor, back, front, left, right), then four rim planks */
    const planks = g.children.filter(c => c.isMesh);
    planks.forEach((p, i) => { if (i >= 1 && i <= 4) p.material = bodyM; else if (i >= 5 && i <= 8) p.material = rimM; });
    if (CALM) return;   /* calm (Esti 2026-11-27, K-CLARITY-RULES 10): a plain box in the world's colours; no wheels, rivets, leaves, shells, snow or bows to look at */
    const add = o => { o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); g.add(o); return o; };
    if (B.wheels) { const wg = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 28); wg.rotateZ(Math.PI / 2); const wm = new PM({ color: B.wheels, roughness: 0.5 }), hm = new PM({ color: B.hubs, roughness: 0.3, clearcoat: 1 });
      [-1, 1].forEach(sx => [-1, 1].forEach(sz => { const w = add(new THREE.Mesh(wg, wm)); w.position.set(sx * (BX.w / 2 + 0.05), 0.12, sz * BX.d * 0.3);
        const h = add(new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10), hm)); h.position.set(sx * (BX.w / 2 + 0.1), 0.12, sz * BX.d * 0.3); })); }
    if (B.corners) { const cm = new PM({ color: B.corners, metalness: 0.5, roughness: 0.3 }); [-1, 1].forEach(sx => [-1, 1].forEach(sz => { const c = add(new THREE.Mesh(new THREE.BoxGeometry(0.16, BX.h + 0.04, 0.16), cm)); c.position.set(sx * BX.w / 2, BX.h / 2, sz * BX.d / 2); })); }
    if (B.rivets) { const rm = new PM({ color: '#F4F7FF', metalness: 0.5, roughness: 0.3 }); for (let i = 0; i < 6; i++) { const r = add(new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), rm)); r.position.set(-BX.w / 2 + 0.2 + i * (BX.w - 0.4) / 5, BX.h * 0.72, BX.d / 2 + 0.01); } }
    if (B.leaves) { const lm = new PM({ color: '#5DBB4A', roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }), sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(0.12, 0.12, 0, 0.3); sh.quadraticCurveTo(-0.12, 0.12, 0, 0); const lg = new THREE.ShapeGeometry(sh, 8);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz], i) => { for (let k = 0; k < 3; k++) { const l = add(new THREE.Mesh(lg, lm)); l.position.set(sx * (BX.w / 2 - 0.05), BX.h + 0.02, sz * (BX.d / 2 - 0.05)); l.rotation.set(-0.6, (k - 1) * 0.9 + i, sx * 0.5); } }); }
    if (B.snowcap) { const sm = new PM({ color: '#FFFFFF', roughness: 0.7, sheen: 1, sheenColor: C('#DCEBFF') }); [-1, 1].forEach(sz => { const c = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09, BX.w - 0.1, 4, 10), sm)); c.rotation.z = Math.PI / 2; c.position.set(0, BX.h + 0.07, sz * (BX.d / 2 - 0.08)); }); }
    if (B.bow) { const bm = new PM({ color: B.bow, roughness: 0.3, clearcoat: 1 }); [-1, 1].forEach(sd => { const l = add(new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 10, 24), bm)); l.position.set(sd * 0.14, BX.h + 0.02, -BX.d / 2 + 0.08); l.rotation.y = sd * 0.6; });
      add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), bm)).position.set(0, BX.h + 0.02, -BX.d / 2 + 0.08); }
    if (B.shells) { const sm2 = new PM({ color: '#FFD9C7', roughness: 0.3, clearcoat: 1 }); [-1, 1].forEach(sx => { const s2 = add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), sm2)); s2.rotation.x = Math.PI / 2; s2.position.set(sx * (BX.w / 2 - 0.25), BX.h * 0.72, BX.d / 2 + 0.01); }); }
  };
  T.boxName = () => (BOXLOOK[world] || {}).name || 'a toy box';

  /* ================= WINTER: the measuring things are knitted scarves (same lengths; the fringe stays inside the length, so lining up is exact)
     and towers of ice blocks tinted in their colour, with a little snow on top ================= */
  T.rod = (L, color) => {
    if (world !== 'snow') return null;
    const col = keepHue(vivid(color)), t = paint(512, 128, (x, w, h) => { x.fillStyle = col; x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(255,255,255,.92)'; [0.1, 0.18, 0.82, 0.9].forEach(u => x.fillRect(u * w, 0, w * 0.035, h));   /* white stripes near the ends */
      x.strokeStyle = 'rgba(0,0,0,.14)'; x.lineWidth = 2; for (let px = 0; px < w; px += 8) for (let py = 4; py < h; py += 12) { x.beginPath(); x.moveTo(px, py); x.lineTo(px + 4, py + 6); x.lineTo(px + 8, py); x.stroke(); } });   /* knit stitches */
    const knit = HAVE.has('winter-knit-surface.jpg') ? (() => { const k = artTex('winter-knit-surface.jpg').clone(); k.needsUpdate = true; k.wrapS = k.wrapT = THREE.RepeatWrapping; k.repeat.set((L - 0.24) / 0.7, 0.7); return k; })() : null;   /* the painted knit, tinted */
    const g = new THREE.Group(), body = new THREE.Mesh(new RoundedBoxGeometryLite(L - 0.24, 0.16, 0.5, 0.06), new PM({ color: knit ? col : '#FFFFFF', map: knit || t, roughness: 0.95, sheen: 1, sheenColor: C(tint(col, 0.5)), emissive: '#FFC400', emissiveIntensity: 0 }));
    body.castShadow = true; g.add(body);
    const fm = new PM({ color: col, roughness: 0.9, sheen: 1 }), fg = new THREE.CylinderGeometry(0.018, 0.018, 0.12, 5); fg.rotateZ(Math.PI / 2);
    [-1, 1].forEach(sd => { for (let k = 0; k < 7; k++) { const f = new THREE.Mesh(fg, fm); f.position.set(sd * (L / 2 - 0.06), 0, -0.21 + k * 0.07); g.add(f); } });
    return { g, body };
  };
  T.towerMat = (color) => world === 'snow' ? new PM({ color: tint(keepHue(vivid(color)), 0.15), roughness: 0.15, clearcoat: 1, transmission: 0.12, thickness: 0.5, emissive: '#FFC400', emissiveIntensity: 0 }) : null;
  T.towerTop = () => { if (world !== 'snow') return null; const m = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new PM({ color: '#FFFFFF', roughness: 0.7, sheen: 1, sheenColor: C('#DCEBFF') })); m.scale.set(1, 0.32, 1); return m; };
  if (world !== 'snow') { T.towerMat = null; T.towerTop = null; T.rod = null; }

  /* ================= UNDER THE SEA: the bridge for "where is it?" is a smooth sandstone slab on two coral-pink rocks, with little shells
     (the same size and place as the block bridge, so on top / under / next to / in front / behind are exactly the same) ================= */
  T.bridge = (PLANK_Y) => {
    if (world !== 'underwater') return null;
    const g = new THREE.Group(), rockM = new PM({ color: '#F28C8C', roughness: 0.6, clearcoat: 0.3, sheen: 0.6, sheenColor: C('#FFD6D6') });
    [-1.05, 1.05].forEach(x => { const geo = new THREE.CylinderGeometry(0.36, 0.44, PLANK_Y - 0.1, 28, 6), p = geo.attributes.position, v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const a = Math.atan2(v.z, v.x), k = 1 + 0.08 * Math.sin(a * 5 + v.y * 6 + x) + 0.05 * Math.sin(v.y * 13); p.setXYZ(i, v.x * k, v.y, v.z * k); }
      geo.computeVertexNormals(); const c = new THREE.Mesh(geo, rockM); c.position.set(x, (PLANK_Y - 0.1) / 2, 0); g.add(c);
      for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new PM({ color: ['#FFB3C1', '#FFFFFF', '#FFD39A'][k % 3], roughness: 0.4 })); b.position.set(x + Math.cos(k * 1.7) * 0.4, 0.2 + k * 0.17, Math.sin(k * 1.7) * 0.4); g.add(b); } });
    const slabT = paint(256, 128, (x, w, h) => { x.fillStyle = '#EBCB96'; x.fillRect(0, 0, w, h); const R = rng(4); for (let i = 0; i < 300; i++) { x.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.18)' : 'rgba(150,100,50,.12)'; x.beginPath(); x.arc(R() * w, R() * h, 1 + R() * 2.5, 0, 7); x.fill(); } });
    const slab = new THREE.Mesh(new RoundedBoxGeometryLite(3.0, 0.22, 1.1, 0.08), new PM({ color: '#FFFFFF', map: slabT, roughness: 0.7 })); slab.position.set(0, PLANK_Y + 0.02, 0); g.add(slab);
    const shellM = new PM({ color: '#FFE3D6', roughness: 0.3, clearcoat: 1 });
    [[-1.2, 0.35], [1.25, -0.3], [0.5, 0.42]].forEach(([x, z]) => { const sh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), shellM); sh.position.set(x, PLANK_Y + 0.13, z); sh.scale.set(1, 0.5, 1.2); g.add(sh); });
    return shadowy(g);
  };

  /* the soft golden halo a pattern item lights when the voice says "that part repeats" (the item's own colour never changes) */
  function addHalo(g, r = 0.55, y = -0.05) {
    const h = new THREE.Mesh(new THREE.CircleGeometry(r * 1.15, 40), new THREE.MeshBasicMaterial({ color: '#FFB000', transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false }));
    h.position.set(0, y, -0.32); h.renderOrder = -1; g.add(h);
    h.onBeforeRender = () => { const q = new THREE.Quaternion(); g.getWorldQuaternion(q); h.quaternion.copy(q.invert().multiply(T.camera.quaternion)); };
    g.userData.glow = on => { h.material.opacity = on ? 0.9 : 0; };   /* a clear gold glow: the pale one hardly showed on the light floor (review 2) */
    return g;
  }

  /* ================= what each world offers kit.js ================= */
  /* T.bead(type, B, shapeFn): a pattern item, or null to keep the plain bead */
  T.bead = (type, B, shapeFn) => {
    if (world === 'traintown') {
      if (B.kind === 'drum') return addHalo(drum(B.color));
      if (type === 'bell') return addHalo(trainBell(B.color));
      if (B.kind && B.kind !== 'cube') return addHalo(shapeCar(shapeFn()));   /* a cream train car carrying its shape sign: every item on the train is a car */
      return addHalo(trainCar(B.color));
    }
    if (world !== 'bakery') return null;
    if (B.kind === 'drum') return addHalo(drum(B.color));
    if (type === 'bell') return addHalo(bell(B.color));
    if (B.kind && B.kind !== 'cube') return addHalo(cookie(shapeFn(), '#F0458E', B.kind));   /* every shape cookie has the same pink icing: only the shape changes */
    if (T.painted && CUP[String(B.color).toUpperCase()]) return addHalo(paintedCupcake(B.color), 0.55, 0.05);
    return addHalo(cupcake(B.color, B.topping));
  };
  /* where the next one goes: an empty paper case with a soft golden glow (bakery) */
  T.marker = () => {
    if (world === 'traintown') {
      const g = new THREE.Group(), glowM = new THREE.MeshStandardMaterial({ color: '#FFE08A', emissive: '#FFC94A', emissiveIntensity: 0.7, roughness: 0.5 });
      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.06, 0.44), glowM); deck.position.y = -0.27; g.add(deck);
      wheels(g, [-0.2, 0.2], -0.33, 0.2);
      /* a bright gold outline where the next car goes, so the empty spot is the clearest thing on the track (K-CLARITY-RULES 9) */
      const lineM = new THREE.MeshBasicMaterial({ color: '#13224A', toneMapped: false }), W2 = 0.37, H2 = 0.27, cy = -0.02, r = 0.055;   /* thick dark navy: a gold line looked like the yellow cars (review 2) */
      [[0, cy + H2, 2 * W2, true], [0, cy - H2, 2 * W2, true], [-W2, cy, 2 * H2, false], [W2, cy, 2 * H2, false]].forEach(([x, y, L, hor]) => {
        const b = new THREE.Mesh(new THREE.CapsuleGeometry(r, L, 4, 8), lineM); if (hor) b.rotation.z = Math.PI / 2; b.position.set(x, y, 0.24); g.add(b); });
      return g;
    }
    if (world !== 'bakery') return null;
    const g = new THREE.Group(), glowM = new PM({ color: '#FFF3D6', map: linerTex(), emissive: '#FFC94A', emissiveIntensity: 0.55, roughness: 0.6, side: THREE.DoubleSide });
    const l = new THREE.Mesh(linerGeo(), glowM); g.add(l);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.325, 0.03, 10, 64), new THREE.MeshStandardMaterial({ color: '#FFC21A', emissive: '#FFB000', emissiveIntensity: 1.1 })); rim.rotation.x = Math.PI / 2; rim.position.y = -0.06; g.add(rim);
    return g;
  };
  /* where the pattern items sit: a long cake board on little feet (bakery), instead of a bead string */
  T.board = (len) => {
    if (world === 'traintown') {
      const g = new THREE.Group(), railM = once('railM', () => new PM({ color: '#B9C2CC', metalness: 0.6, roughness: 0.3 })), tieM = once('tieM', () => new PM({ color: '#9A6237', roughness: 0.7 }));
      const L2 = len + 1.4;
      [-0.2, 0.2].forEach(z => { const r = new THREE.Mesh(new THREE.BoxGeometry(L2, 0.05, 0.05), railM); r.position.set(-0.7, -0.44, z); g.add(r); });
      for (let x = -L2 / 2; x <= L2 / 2; x += 0.32) { const t = new THREE.Mesh(once('tieGeo', () => new THREE.BoxGeometry(0.14, 0.04, 0.62)), tieM); t.position.set(x - 0.7, -0.48, 0); g.add(t); }
      const e = engine(); e.position.set(-len / 2 - 0.62, 0, 0); g.add(e);   /* the little engine pulls the pattern */
      return shadowy(g);
    }
    if (world !== 'bakery') return null;
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, 0.95), once('boardM', () => new PM({ color: '#FFFFFF', roughness: 0.35, clearcoat: 0.9, sheen: 0.3 })));
    top.position.y = -0.46; g.add(top);
    const lace = once('laceTex', () => { const t = paint(512, 64, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#FFB3C8'; for (let i = 0; i < 16; i++) { x.beginPath(); x.arc((i + 0.5) * w / 16, 0, w / 32, 0, Math.PI); x.fill(); } x.fillRect(0, 0, w, 6); }); t.wrapS = THREE.RepeatWrapping; return t; });
    const lt = lace.clone(); lt.needsUpdate = true; lt.repeat.set(len / 1.6, 1);
    const frill = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.13), new THREE.MeshStandardMaterial({ map: lt, transparent: true, roughness: 0.7, side: THREE.DoubleSide }));
    frill.position.set(0, -0.53, 0.476); g.add(frill);
    const footM = once('footM', () => new PM({ color: '#F6C0CF', roughness: 0.35, clearcoat: 0.8 }));
    [-1, 1].forEach(s => { const f = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.5, 24), footM); f.position.set(s * (len / 2 - 0.35), -0.74, 0); g.add(f); });
    return shadowy(g);
  };
  T.boardOffset = world === 'bakery' ? 0 : null;

  /* ================= FLAT PIECES: the exact outline, painted as a real thing from the world =================
     cap: the front and back (the shape a boy sees, in its colour); side: the edge. The outline never changes. */
  const C = c => new THREE.Color(c);
  const hex = c => '#' + c.getHexString();
  const shade = (c, k) => hex(C(c).multiplyScalar(k));
  const tint = (c, k) => hex(C(c).lerp(C('#FFFFFF'), k));
  /* soft painted light across the front: brighter top-left, gently darker bottom-right (painted-film look) */
  function lightWash(x, w, h, c, lite = 0.32, dark = 0.86) { lite *= 0.3; c = c === '#FFD21F' ? c : shade(c, 0.88); const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, tint(c, lite)); g.addColorStop(0.45, c); g.addColorStop(1, shade(c, dark)); x.fillStyle = g; x.fillRect(0, 0, w, h); }
  const SKINS = {
    /* toy land: painted wooden toy blocks (the front painted in the colour, a little wood grain shows through; plain maple edges) */
    toyland: { side: () => once('maple', () => new PM({ color: '#F1C98E', roughness: 0.55, clearcoat: 0.5, clearcoatRoughness: 0.3 })),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.25, 0.9); x.strokeStyle = '#000'; x.lineWidth = 2.5;
        for (let i = 0; i < 34; i++) { const y0 = R() * h; x.globalAlpha = 0.06 + R() * 0.08; x.beginPath(); x.moveTo(0, y0); x.bezierCurveTo(w * 0.3, y0 + (R() - 0.5) * 40, w * 0.7, y0 + (R() - 0.5) * 40, w, y0 + (R() - 0.5) * 24); x.stroke(); }
        x.globalAlpha = 0.1; x.lineWidth = 2; const kx = w * (0.3 + R() * 0.4), ky = h * (0.3 + R() * 0.4); for (let r = 6; r < 40; r += 7) { x.beginPath(); x.ellipse(kx, ky, r * 1.8, r * 0.7, 0, 0, 7); x.stroke(); } x.globalAlpha = 1; },
      rough: 0.42, coat: 0.65, inset: null },
    /* bakery: iced sugar cookies (icing in the colour, sugar pearls, a piped white line; golden baked edge) */
    bakery: { side: () => doughMat(),
      cap: (x, w, h, c, R) => { const k = frostOf(c); lightWash(x, w, h, k, 0.35, 0.9); x.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 9; i++) { const a = R() * 6.28, r = R() * w * 0.12; x.beginPath(); x.arc(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, 5 + R() * 3, 0, 7); x.fill(); } },
      rough: 0.32, coat: 0.6, inset: { color: '#FFFFFF', r: 0.028, at: 0.8 } },
    /* garden: glazed garden stepping tiles (a glossy glaze in the colour over speckled stone; warm stone edge) */
    garden: { side: () => once('terracotta', () => new PM({ color: '#C9805A', roughness: 0.8 })),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.3, 0.85); for (let i = 0; i < 260; i++) { x.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.07)'; x.beginPath(); x.arc(R() * w, R() * h, 1 + R() * 2.5, 0, 7); x.fill(); } },
      rough: 0.3, coat: 0.9, inset: { color: '#FFF8E8', r: 0.02, at: 0.84, op: 0.8 } },
    /* sky islands: kite cloth (soft fabric in the colour with a stitched seam just inside the edge; white wooden frame edge) */
    sky: { side: () => once('kiteEdge', () => new PM({ color: '#FFFFFF', roughness: 0.5, sheen: 0.6, sheenColor: C('#DDEBFF') })),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.3, 0.88); x.globalAlpha = 0.06; x.fillStyle = '#FFF'; for (let i = 0; i < w; i += 6) x.fillRect(i, 0, 2, h); x.globalAlpha = 1; },
      rough: 0.75, coat: 0, sheen: 0.8, inset: { color: '#FFFFFF', r: 0.016, at: 0.86, dash: true } },
    /* space: friendly space-station panels (smooth candy metal in the colour, little rivets just inside the edge; silver edge) */
    space: { side: () => once('silver', () => new PM({ color: '#D7DEEA', metalness: 0.6, roughness: 0.3, clearcoat: 1 })),
      cap: (x, w, h, c) => { lightWash(x, w, h, c, 0.35, 0.8); const g = x.createLinearGradient(0, h * 0.2, w, h * 0.5); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); },
      rough: 0.22, coat: 1, metal: 0.15, inset: { color: '#EEF3FF', r: 0.03, at: 0.82, dots: true } },
    /* beach: plastic sand moulds (glossy beach-toy plastic in the colour, a raised rim; the edge the same plastic, a little darker) */
    beach: { side: c => new PM({ color: shade(c, 0.85), roughness: 0.25, clearcoat: 1 }),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.3, 0.88); x.globalAlpha = 0.25; x.fillStyle = '#F4D79A'; for (let i = 0; i < 40; i++) { x.beginPath(); x.arc(w * 0.2 + R() * w * 0.6, h * 0.55 + R() * h * 0.3, 1.5 + R() * 2.5, 0, 7); x.fill(); } x.globalAlpha = 1; },
      rough: 0.2, coat: 1, inset: { color: 'rim', r: 0.04, at: 0.84 } },
    /* underwater: smooth sea glass (frosted, softly see-through glass in the colour) */
    underwater: { side: c => new PM({ color: tint(c, 0.2), roughness: 0.35, transmission: 0.25, thickness: 0.4, clearcoat: 1 }),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.4, 0.85); x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 4;
        for (let i = 0; i < 9; i++) { const y0 = h * (0.08 + i * 0.11); x.beginPath(); x.moveTo(0, y0); for (let px = 0; px <= w; px += 16) x.lineTo(px, y0 + Math.sin(px / 38 + i * 1.7) * 9 + Math.sin(px / 17 + i) * 3); x.stroke(); } },
      rough: 0.35, coat: 1, transmission: 0.08, inset: null },
    /* train town: painted signal boards (enamel in the colour with a white painted border; grey metal edge) */
    traintown: { side: () => once('signEdge', () => new PM({ color: '#B9C2CC', metalness: 0.5, roughness: 0.35, clearcoat: 0.8 })),
      cap: (x, w, h, c) => lightWash(x, w, h, c, 0.25, 0.88), rough: 0.25, coat: 1, inset: { color: '#FFFFFF', r: 0.045, at: 0.82 } },
    /* jungle: carved wooden tiles painted in the colour, with a little carved leaf vein pattern; dark wood edge */
    jungle: { side: () => once('darkWood', () => new PM({ color: '#9A6A3E', roughness: 0.6, clearcoat: 0.3 })),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.25, 0.85); x.globalAlpha = 0.12; x.strokeStyle = '#FFFFFF'; x.lineWidth = 3;
        for (let i = 0; i < 7; i++) { const y0 = h * (0.15 + i * 0.12); x.beginPath(); x.moveTo(w * 0.1, y0); x.quadraticCurveTo(w * 0.5, y0 - h * 0.08, w * 0.9, y0); x.stroke(); } x.globalAlpha = 1; },
      rough: 0.45, coat: 0.5, inset: { color: '#FFF3D6', r: 0.02, at: 0.84, op: 0.85 } },
    /* winter: ice blocks tinted in the colour (frosty, softly sparkling) */
    snow: { side: c => new PM({ color: tint(c, 0.25), roughness: 0.15, clearcoat: 1, transmission: 0.12, thickness: 0.5 }),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.3, 0.88); for (let i = 0; i < 160; i++) { x.fillStyle = 'rgba(255,255,255,' + (0.1 + R() * 0.4) + ')'; x.beginPath(); x.arc(R() * w, R() * h, 0.8 + R() * 1.8, 0, 7); x.fill(); } },
      rough: 0.12, coat: 1, transmission: 0.05, inset: { color: '#FFFFFF', r: 0.018, at: 0.85, op: 0.7 } },
    /* farm: painted barn wood (planks in the colour, white trim just inside the edge, like a barn door); weathered wood edge */
    farm: { side: () => once('barnWood', () => new PM({ color: '#C79A6B', roughness: 0.75 })),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.22, 0.88); x.strokeStyle = 'rgba(60,30,10,.32)'; x.lineWidth = 5; for (let i = 1; i < 8; i++) { const px = i * w / 8; x.beginPath(); x.moveTo(px, 0); x.lineTo(px, h); x.stroke(); }
        x.globalAlpha = 0.07; x.fillStyle = '#000'; for (let i = 0; i < 60; i++) x.fillRect(R() * w, R() * h, 1.5, 12 + R() * 20); x.globalAlpha = 1; },
      rough: 0.6, coat: 0.2, inset: { color: '#FFFFFF', r: 0.04, at: 0.8 } },
    /* party: shiny foil balloons in the shape (soft crinkle shine) */
    party: { side: c => new PM({ color: shade(c, 0.9), roughness: 0.22, clearcoat: 1 }),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.4, 0.78); for (let i = 0; i < 14; i++) { const g = x.createLinearGradient(R() * w, 0, R() * w, h); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); } },
      rough: 0.22, coat: 1, metal: 0, inset: null }
  };
  const SK = SKINS[world] || null;
  /* very light colours (yellow, light orange) are drawn a little deeper, so the bright sun never washes them to cream: yellow stays yellow */
  function keepHue(c) { const col = C(c), hsl = {}; col.getHSL(hsl);
    if (hsl.h > 0.07 && hsl.h < 0.2 && hsl.s > 0.5) return '#FFD21F';   /* a true butter yellow */   /* yellow: a warm sunflower yellow (a deeper or paler yellow looks like wood or cream in the sun) */
    const l = 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b; return l > 0.5 ? hex(col.multiplyScalar(0.5 / l)) : hex(col); }
  function capTex(kind, color) {
    return once('cap' + world + color + kind, () => { const R = rng(kind.length * 17 + color.length), t = paint(512, 512, (x, w, h) => SK.cap(x, w, h, color, R)); t.repeat.set(0.5, 0.5); t.offset.set(0.5, 0.5); return t; });
  }
  function insetLine(shape, o, color) {   /* a line just inside the edge: the same outline, smaller, so corners stay corners */
    const pts = shape.getPoints(64), n = pts.length, cx = pts.reduce((s, p) => s + p.x, 0) / n, cy = pts.reduce((s, p) => s + p.y, 0) / n;
    const line = pts.map(p => new THREE.Vector3(cx + (p.x - cx) * o.at, cy + (p.y - cy) * o.at, 0)); if (line[0].distanceTo(line[line.length - 1]) < 1e-3) line.pop();
    const col = o.color === 'rim' ? shade(color, 1.08) : o.color;
    const m = o.dots || o.dash ? new THREE.MeshStandardMaterial({ color: col, roughness: o.dots ? 0.25 : 0.6, metalness: o.dots ? 0.5 : 0 }) : new PM({ color: col, roughness: 0.35, clearcoat: 0.6, transparent: o.op != null, opacity: o.op == null ? 1 : o.op });
    if (o.dots || o.dash) {   /* rivets or stitches along the line */
      const curve = new THREE.CatmullRomCurve3(line, true, 'catmullrom', 0.01), len = curve.getLength(), N = Math.max(8, Math.round(len / (o.dots ? 0.22 : 0.09))), g = new THREE.Group();
      const geo = o.dots ? new THREE.SphereGeometry(o.r, 12, 8) : new THREE.CapsuleGeometry(o.r, 0.035, 3, 6);
      for (let i = 0; i < N; i++) { const p = curve.getPointAt(i / N), d = curve.getTangentAt(i / N), q = new THREE.Mesh(geo, m); q.position.copy(p); if (!o.dots) q.rotation.z = Math.atan2(d.y, d.x) - Math.PI / 2; g.add(q); }
      return g; }
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line, true, 'catmullrom', 0.01), 200, o.r, 8, true), m);
  }
  /* special objects that are more than paint: the farm's circle is a tractor tyre (tread all round, the hub in the colour) */
  function tyreCap(color) { return once('tyre' + color, () => { const t = paint(512, 512, (x, w, h) => {
      const c = w / 2, R = w / 2 * 0.66 / 1.0;   /* the circle's radius is 0.66 in shape units; the picture spans -1..1 */
      x.fillStyle = '#2E2B2A'; x.fillRect(0, 0, w, h);
      const k = w / 2; const rr = 0.66 * k;
      for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; x.save(); x.translate(c, c); x.rotate(a); x.fillStyle = '#4A4543'; x.fillRect(rr * 0.84, -rr * 0.05, rr * 0.18, rr * 0.1); x.restore(); }   /* tread blocks */
      const g = x.createRadialGradient(c - rr * 0.15, c - rr * 0.15, 0, c, c, rr * 0.62); g.addColorStop(0, tint(color, 0.35)); g.addColorStop(1, shade(color, 0.85));
      x.fillStyle = g; x.beginPath(); x.arc(c, c, rr * 0.62, 0, 7); x.fill();   /* the hub, in the colour */
      x.fillStyle = '#F4F1EA'; x.beginPath(); x.arc(c, c, rr * 0.16, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; x.beginPath(); x.arc(c + Math.cos(a) * rr * 0.36, c + Math.sin(a) * rr * 0.36, rr * 0.05, 0, 7); x.fill(); }
      void R; }); t.repeat.set(0.5, 0.5); t.offset.set(0.5, 0.5); return t; }); }
  /* ================= PAINTED SHAPE TREASURES (pictures from the picture account, art/<name>.png|jpg) =================
     Each world gives every group of shapes its own real thing. Shapes that look alike share the same thing, so a tricky piece stays exactly as tricky:
       round  = circle, oval, half circle (a round object: the oval is the same object squashed, the half circle is half of it)
       box    = square, rectangle, leaning shape (one surface)       pointy = triangles, curvy shape, kite (one surface)
       many   = hexagon, pentagon, octagon (one surface)            star   = star
     tint: the picture is white and takes the piece's colour (colour games). trim: a white line just inside the edge. side: the edge colour.
     A group whose picture has not arrived yet keeps the painted-in-code look above. */
  const GROUP = { circle: 'round', oval: 'round', 'half circle': 'round', square: 'box', rectangle: 'box', 'leaning shape': 'box',
    triangle: 'pointy', 'curvy shape': 'pointy', kite: 'pointy', hexagon: 'many', pentagon: 'many', octagon: 'many', star: 'star' };
  const ART = {
    farm: { round: { pic: 'farm-tire-round.png', side: '#353130' }, box: { pic: 'farm-hay-surface.jpg', side: '#D9A93E' }, pointy: { pic: 'farm-barnroof-surface.jpg', side: '#F4EFE6', trim: 1 }, many: { pic: 'farm-honeycomb-surface.jpg', side: '#C98A1E' } },
    toyland: { round: { pic: 'toy-drum-round.png', side: '#D23A33' }, box: { pic: 'toy-brick-surface.jpg', tint: 1 }, pointy: { pic: 'toy-sail-surface.jpg', side: '#F1C98E' }, many: { pic: 'toy-puzzle-surface.jpg', side: '#F1C98E' } },
    garden: { round: { pic: 'garden-sunflower-round.png', side: '#6E8B3D' }, box: { pic: 'garden-planter-surface.jpg', side: '#A9774A' }, pointy: { pic: 'garden-flag-surface.jpg', side: '#FFFFFF' }, many: { pic: 'garden-stone-surface.jpg', side: '#C9B79A' } },
    sky: { round: { pic: 'sky-kite-round.png', side: '#FFFFFF' }, box: { pic: 'sky-basket-surface.jpg', side: '#B98548' }, pointy: { pic: 'sky-kitecloth-surface.jpg', side: '#FFFFFF' }, many: { pic: 'sky-cloudtile-surface.jpg', side: '#DCEBFF' }, star: { pic: 'sky-goldstar-surface.jpg', side: '#E0A21A' } },
    space: { round: { pic: 'space-planet-round.png', side: '#C9A6E8' }, box: { pic: 'space-panel-surface.jpg', tint: 1 }, pointy: { pic: 'space-panel-surface.jpg', tint: 1 }, many: { pic: 'space-solar-surface.jpg', side: '#D7DEEA' } },
    beach: { round: { pic: 'beach-ball-round.png', side: '#FFFFFF' }, box: { pic: 'beach-sand-surface.jpg', side: '#D9B36A' }, pointy: { pic: 'beach-sail-surface.jpg', side: '#FFFFFF' }, many: { pic: 'beach-mould-surface.jpg', tint: 1 } },
    party: { round: { pic: 'party-cake-round.png', side: '#FFFFFF' }, box: { pic: 'party-gift-surface.jpg', side: '#FFFFFF', trim: 1 }, pointy: { pic: 'party-bunting-surface.jpg', side: '#FFFFFF' }, many: { pic: 'party-tile-surface.jpg', side: '#FFFFFF' }, star: { pic: 'party-foil-surface.jpg', side: '#E0A21A' } },
    jungle: { round: { pic: 'jungle-leaf-surface.jpg', tint: 1 }, box: { pic: 'jungle-carved-surface.jpg', tint: 1 }, pointy: { pic: 'jungle-carved-surface.jpg', tint: 1 }, many: { pic: 'jungle-carved-surface.jpg', tint: 1 }, star: { pic: 'jungle-carved-surface.jpg', tint: 1 } },
    traintown: { round: { pic: 'train-wheel-round.png', side: '#B9C2CC' }, box: { pic: 'train-car-surface.jpg', tint: 1 }, pointy: { pic: 'train-sign-surface.jpg', tint: 1, trim: 1 }, many: { pic: 'train-sign-surface.jpg', tint: 1, trim: 1 } },
    snow: { round: { pic: 'winter-snowball-round.png', side: '#E8F2FF' }, box: { pic: 'winter-ice-surface.jpg', side: '#CFE6FF' }, pointy: { pic: 'winter-ice-surface.jpg', side: '#CFE6FF' }, many: { pic: 'winter-ice-surface.jpg', side: '#CFE6FF' } }
  };
  /* the pictures that have arrived and been checked by eye (k-shapes-art-requests.md); only these are loaded */
  const HAVE = new Set(['beach-ball-round.png', 'beach-sail-surface.jpg', 'beach-sand-surface.jpg', 'farm-barnroof-surface.jpg', 'farm-hay-surface.jpg', 'farm-honeycomb-surface.jpg',
    'farm-tire-round.png', 'garden-sunflower-round.png', 'party-bunting-surface.jpg', 'party-cake-round.png', 'party-gift-surface.jpg', 'sky-basket-surface.jpg', 'sky-cloudtile-surface.jpg',
    'sky-goldstar-surface.jpg', 'space-fin-surface.jpg', 'space-panel-surface.jpg', 'space-planet-round.png', 'space-solar-surface.jpg', 'toy-drum-round.png',
    'garden-planter-surface.jpg', 'garden-stone-surface.jpg', 'garden-flag-surface.jpg', 'toy-brick-surface.jpg', 'toy-sail-surface.jpg', 'toy-puzzle-surface.jpg', 'sky-kitecloth-surface.jpg',
    'beach-mould-surface.jpg', 'sky-kite-round.png', 'party-tile-surface.jpg', 'party-foil-surface.jpg', 'jungle-carved-surface.jpg', 'jungle-leaf-surface.jpg', 'winter-knit-surface.jpg']);
  T.artList = () => [...HAVE];
  const loader = new THREE.TextureLoader(), texCache = {};
  function artTex(pic) { return texCache[pic] || (texCache[pic] = (() => { const t = loader.load('art/' + pic); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ANISO; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })()); }
  function bbox(shape) { const b = new THREE.Box2(); shape.getPoints(48).forEach(p => b.expandByPoint(p)); return b; }
  function pictureFront(entry, kind, fam, shape, color) {
    const base = artTex(entry.pic), t = base.clone(); t.needsUpdate = true;
    if (/-round\./.test(entry.pic)) {   /* a round object: fitted to the shape's own frame (circle = the whole object; oval = squashed; half circle = its top half) */
      const b = bbox(shape), w = b.max.x - b.min.x;
      if (fam === 'half circle') { const r = w / 2, cy = b.min.y; t.repeat.set(1 / (2 * r), 1 / (2 * r)); t.offset.set(0.5, 0.5 - cy / (2 * r)); }
      else { const h = b.max.y - b.min.y, cx = (b.max.x + b.min.x) / 2, cy = (b.max.y + b.min.y) / 2; t.repeat.set(1 / w, 1 / h); t.offset.set(0.5 - cx / w, 0.5 - cy / h); }
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    } else {   /* a surface: the picture covers the shape's frame once (no repeat seams), centred */
      const b = bbox(shape), w = b.max.x - b.min.x, h = b.max.y - b.min.y, m = Math.max(w, h) * 1.04, cx = (b.max.x + b.min.x) / 2, cy = (b.max.y + b.min.y) / 2;
      t.repeat.set(1 / m, 1 / m); t.offset.set(0.5 - cx / m, 0.5 - cy / m); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    }
    return new PM({ color: entry.tint ? C(color) : C('#FFFFFF'), map: t, roughness: 0.55, clearcoat: entry.tint ? 0.5 : 0.25, clearcoatRoughness: 0.3, emissive: '#FFC400', emissiveIntensity: 0, transparent: false });
  }

  /* T.piece(kind, color, shape): { mats: [front, edge], extras: [things to add on the front] } or null for the plain glossy toy */
  T.piece = (kind, color, shape, fam) => {
    if (!SK) return null;
    color = vivid(color); color = keepHue(color);
    const entry = ART[world] && ART[world][GROUP[fam]];
    if (entry && HAVE.has(entry.pic)) {
      const side = entry.side ? once('side' + entry.side, () => new PM({ color: entry.side, roughness: 0.55, clearcoat: 0.3 })) : once('sideT' + color, () => new PM({ color: shade(color, 0.85), roughness: 0.4, clearcoat: 0.6 }));
      return { mats: [pictureFront(entry, kind, fam, shape, color), side], extras: entry.trim ? [insetLine(shape, { color: '#FFFFFF', r: 0.03, at: 0.82 }, color)] : [] };
    }
    if (world === 'farm' && fam === 'circle') {
      const front = new PM({ color: '#FFFFFF', map: tyreCap(color), roughness: 0.6, clearcoat: 0.3, emissive: '#FFC400', emissiveIntensity: 0 });
      return { mats: [front, once('rubber', () => new PM({ color: '#353130', roughness: 0.7 }))], extras: [], tread: true };
    }
    const front = new PM({ color: '#FFFFFF', map: capTex(kind, color), roughness: SK.rough, clearcoat: SK.coat || 0, clearcoatRoughness: 0.15, metalness: SK.metal || 0,
      sheen: SK.sheen || 0, sheenColor: C('#FFFFFF'), transmission: SK.transmission || 0, thickness: 0.3, emissive: '#FFC400', emissiveIntensity: 0 });
    const side = SK.side(color);
    return { mats: [front, side], extras: SK.inset ? [insetLine(shape, SK.inset, color)] : [] };
  };
  T.hasPieces = !!SK;

  /* ---------- celebration style for each world (look.js uses it for its confetti): gentle, floating, never a hard flash ---------- */
  const petal = () => { const s = new THREE.Shape(); s.moveTo(0, -0.07); s.quadraticCurveTo(0.06, 0, 0, 0.07); s.quadraticCurveTo(-0.06, 0, 0, -0.07); return new THREE.ShapeGeometry(s, 6); };
  const starG = () => { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.035 : 0.085, a = Math.PI / 2 + i * Math.PI / 5; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } s.closePath(); return new THREE.ShapeGeometry(s); };
  const CEL = {
    bakery: { geo: () => new THREE.CapsuleGeometry(0.022, 0.09, 3, 6), colors: ['#FF7FB3', '#4CC3FF', '#FFD23F', '#7BDC6B', '#B98CFF', '#FFFFFF', '#FF9A3C'], spin: 0.6, star: 0.5, name: 'sprinkles' },
    garden: { geo: petal, colors: ['#FFB7D0', '#FFFFFF', '#FFD6E5', '#FFE58A', '#F7A8C8'], spin: 0.35, star: 0.3, grav: 0.45, name: 'flower petals' },
    space: { geo: starG, colors: ['#FFE27A', '#FFFFFF', '#FFD0F0', '#BDE7FF'], spin: 0.25, star: 1, grav: 0.25, name: 'twinkling stars' },
    underwater: { geo: () => new THREE.SphereGeometry(0.06, 12, 8), colors: ['#FFFFFF', '#DFF8FF', '#C8F2FF'], spin: 0, star: 0.2, grav: -0.35, name: 'bubbles' },
    beach: { geo: () => new THREE.SphereGeometry(0.055, 12, 8), colors: ['#FFFFFF', '#DFF8FF', '#FFF1C4'], spin: 0, star: 0.4, grav: -0.3, name: 'soft bubbles' },
    snow: { geo: () => new THREE.SphereGeometry(0.05, 10, 8), colors: ['#FFFFFF', '#F2F8FF', '#E3F0FF'], spin: 0, star: 0.3, grav: 0.3, name: 'soft snow' },
    farm: { geo: () => new THREE.PlaneGeometry(0.16, 0.04), colors: ['#F2C94C', '#E8B33A', '#FFE08A', '#D9A43A', '#9BCB5A'], spin: 0.5, star: 0.4, name: 'hay-coloured confetti' },
    jungle: { geo: petal, colors: ['#6CC24A', '#9BDB6A', '#3FA34D', '#FFD23F', '#FF7A59'], spin: 0.35, star: 0.4, grav: 0.5, name: 'leaves' },
    party: { geo: () => new THREE.SphereGeometry(0.07, 14, 10), colors: ['#FF5C8A', '#4CC3FF', '#FFD23F', '#7BDC6B', '#B98CFF'], spin: 0, star: 0.4, grav: -0.3, n: 0.4, name: 'little balloons' }
  };
  T.celebration = CEL[world] || null;
  return T;
}

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
