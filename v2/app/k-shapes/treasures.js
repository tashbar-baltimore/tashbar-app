/* Kindergarten Shapes: SHAPE TREASURES (Esti, 2026-11-26: "for the bakery use cupcakes ... for the farm use a tractor tire ... farm-related
   shapes, as opposed to the same shapes everywhere"). Art bible: v2/curriculum/k-shapes-art-bible.md.
   In each world the pieces a boy finds, sorts, drags and builds with become real, lovable things from that world, and each one IS the shape:
   - a flat piece keeps its exact outline (the same geometry kit.js always used), so sides stay straight, corners stay corners and a boy
     counting corners counts the true number; only its paint changes (icing on a cookie, a tyre's tread, a sail's cloth ...);
   - the colour a boy sorts by is the main colour of the object;
   - a pattern item differs from its neighbours in ONE feature only (the frosting colour, or the cookie's shape), never two.
   No teaching, voice or rules live here. Used only with the full look (look.js); the automatic test (?fast=1) keeps the plain pieces. */
import * as THREE from 'three';

export function createTreasures({ world, PM: PM0, paint, FAST, ANISO, vivid = c => c }) {
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
  const FROST = { '#E03A33': '#F0484A', '#1F6FEB': '#4C8DF0', '#F2A900': '#FFD400', '#12A766': '#3DBE78', '#7C4DFF': '#9C72FF', '#FF7A1A': '#FF9A3C', '#00A3B8': '#27BFD0', '#F0458E': '#FF7FB3', '#F5C542': '#FFD95A', '#C0392B': '#E2524A' };
  const frostOf = c => keepHue2(FROST[String(c).toUpperCase()] || c);
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

  /* ================= what each world offers kit.js ================= */
  /* T.bead(type, B, shapeFn): a pattern item, or null to keep the plain bead */
  T.bead = (type, B, shapeFn) => {
    if (world !== 'bakery') return null;
    if (B.kind === 'drum') return drum(B.color);
    if (type === 'bell') return bell(B.color);
    if (B.kind && B.kind !== 'cube') return cookie(shapeFn(), B.color, B.kind);
    if (T.painted && CUP[String(B.color).toUpperCase()]) return paintedCupcake(B.color);
    return cupcake(B.color, B.topping);
  };
  /* where the next one goes: an empty paper case with a soft golden glow (bakery) */
  T.marker = () => {
    if (world !== 'bakery') return null;
    const g = new THREE.Group(), glowM = new PM({ color: '#FFF3D6', map: linerTex(), emissive: '#FFC94A', emissiveIntensity: 0.55, roughness: 0.6, side: THREE.DoubleSide });
    const l = new THREE.Mesh(linerGeo(), glowM); g.add(l);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.325, 0.03, 10, 64), new THREE.MeshStandardMaterial({ color: '#FFC21A', emissive: '#FFB000', emissiveIntensity: 1.1 })); rim.rotation.x = Math.PI / 2; rim.position.y = -0.06; g.add(rim);
    return g;
  };
  /* where the pattern items sit: a long cake board on little feet (bakery), instead of a bead string */
  T.board = (len) => {
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
  function lightWash(x, w, h, c, lite = 0.32, dark = 0.86) { lite *= 0.35; c = shade(c, 0.78); const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, tint(c, lite)); g.addColorStop(0.45, c); g.addColorStop(1, shade(c, dark)); x.fillStyle = g; x.fillRect(0, 0, w, h); }
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
    party: { side: c => new PM({ color: shade(c, 0.9), metalness: 0.55, roughness: 0.22, clearcoat: 1 }),
      cap: (x, w, h, c, R) => { lightWash(x, w, h, c, 0.4, 0.78); for (let i = 0; i < 14; i++) { const g = x.createLinearGradient(R() * w, 0, R() * w, h); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); } },
      rough: 0.25, coat: 1, metal: 0.12, inset: null }
  };
  const SK = SKINS[world] || null;
  /* very light colours (yellow, light orange) are drawn a little deeper, so the bright sun never washes them to cream: yellow stays yellow */
  function keepHue(c) { const col = C(c), hsl = {}; col.getHSL(hsl);
    if (hsl.h > 0.07 && hsl.h < 0.2 && hsl.s > 0.5) return '#FFC000';   /* yellow: a warm sunflower yellow (a deeper or paler yellow looks like wood or cream in the sun) */
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
    space: { round: { pic: 'space-planet-round.png', side: '#C9A6E8' }, box: { pic: 'space-panel-surface.jpg', tint: 1 }, pointy: { pic: 'space-fin-surface.jpg', side: '#D7DEEA' }, many: { pic: 'space-solar-surface.jpg', side: '#D7DEEA' } },
    beach: { round: { pic: 'beach-ball-round.png', side: '#FFFFFF' }, box: { pic: 'beach-sand-surface.jpg', side: '#D9B36A' }, pointy: { pic: 'beach-sail-surface.jpg', side: '#FFFFFF' }, many: { pic: 'beach-mould-surface.jpg', tint: 1 } },
    party: { round: { pic: 'party-cake-round.png', side: '#FFFFFF' }, box: { pic: 'party-gift-surface.jpg', side: '#FFFFFF', trim: 1 }, pointy: { pic: 'party-bunting-surface.jpg', side: '#FFFFFF' }, many: { pic: 'party-tile-surface.jpg', side: '#FFFFFF' }, star: { pic: 'party-foil-surface.jpg', side: '#E0A21A' } },
    jungle: { round: { pic: 'jungle-leaf-surface.jpg', tint: 1 }, box: { pic: 'jungle-carved-surface.jpg', tint: 1 }, pointy: { pic: 'jungle-carved-surface.jpg', tint: 1 }, many: { pic: 'jungle-carved-surface.jpg', tint: 1 }, star: { pic: 'jungle-carved-surface.jpg', tint: 1 } },
    traintown: { round: { pic: 'train-wheel-round.png', side: '#B9C2CC' }, box: { pic: 'train-car-surface.jpg', tint: 1 }, pointy: { pic: 'train-sign-surface.jpg', tint: 1, trim: 1 }, many: { pic: 'train-sign-surface.jpg', tint: 1, trim: 1 } },
    snow: { round: { pic: 'winter-snowball-round.png', side: '#E8F2FF' }, box: { pic: 'winter-ice-surface.jpg', side: '#CFE6FF' }, pointy: { pic: 'winter-ice-surface.jpg', side: '#CFE6FF' }, many: { pic: 'winter-ice-surface.jpg', side: '#CFE6FF' } }
  };
  /* the pictures that have arrived and been checked by eye (k-shapes-art-requests.md); only these are loaded */
  const HAVE = new Set([]);
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
    } else { t.repeat.set(0.55, 0.55); t.offset.set(0.5, 0.5); }   /* a surface: laid across the shape at the same scale on every piece */
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
    party: { geo: () => new THREE.SphereGeometry(0.09, 16, 12), colors: ['#FF5C8A', '#4CC3FF', '#FFD23F', '#7BDC6B', '#B98CFF'], spin: 0, star: 0.6, grav: -0.3, name: 'little balloons' }
  };
  T.celebration = CEL[world] || null;
  return T;
}

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
