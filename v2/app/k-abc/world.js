/* Kindergarten ABC 2.0: the 3D meadow kit shared by every ABC game (v2/curriculum/k-abc/MAP.md).
   One film-lit cartoon world: sky, sun, thousands of grass blades in the wind, trees, flowers, butterflies, pollen, soft glow.
   Also: letters made from the same stroke paths used for tracing, a cute snake that grows along a path, sparkles,
   tweens, the voice (school teacher voice, else the device voice), the pure sounds (made by the device, never spoken),
   and the "hear it again" script runner. Needs lib/three.min.js (three.js r128, MIT) loaded first; the glow add-ons are optional.
   ?fast=1 runs everything quickly with no voice and simple graphics (for the automatic test). */
(function () {
  'use strict';
  var FAST = /[?&]fast=1/.test(location.search);
  var KW = window.KW = { FAST: FAST };
  var col = KW.col = function (h) { return new THREE.Color(h).convertSRGBToLinear(); };

  /* ---------- letter shapes: one set of stroke paths (0..200 box), used for tracing and for the 3D letters ---------- */
  KW.STROKES = {
    s: ['M146 58 C130 34 62 34 60 68 C58 100 142 96 142 134 C142 172 70 174 52 146'],
    a: ['M128 84 C116 62 70 64 68 106 C66 148 118 150 128 120', 'M130 70 L130 152'],
    t: ['M100 40 L100 136 C100 152 114 156 132 148', 'M70 78 L132 78'],
    m: ['M50 74 L50 152', 'M50 100 C54 70 98 70 98 100 L98 152', 'M98 100 C102 70 148 70 148 100 L148 152']
  };
  /* a stroke path -> a smooth 3D curve, centred, 1 unit = 40 path units */
  KW.curveOf = function (d, n) {
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d);
    var L = p.getTotalLength(), pts = [], k = n || Math.max(8, Math.round(L / 6));
    for (var i = 0; i <= k; i++) { var q = p.getPointAtLength(L * i / k); pts.push(new THREE.Vector3((q.x - 100) / 40, (100 - q.y) / 40 - 0.1, 0)); }
    var straight = !/C/.test(d);
    return straight ? new THREE.LineCurve3(pts[0], pts[pts.length - 1]) : new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  };

  KW.init = function (host, opts) {
    opts = opts || {};
    var W = { host: host, phase: 'start', quality: FAST ? 'saver' : 'high', bloom: false };
    var renderer = new THREE.WebGLRenderer({ antialias: !FAST, powerPreference: 'high-performance' });
    renderer.setPixelRatio(FAST ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = !FAST; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);
    var scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, 0.1, 300);
    W.renderer = renderer; W.scene = scene; W.camera = camera;
    W.camBase = new THREE.Vector3(0, 0.6, 11); W.camLook = new THREE.Vector3(0, 0.35, 0); W.camFrom = new THREE.Vector3(-3, 1.4, 31); W.flying = false;

    function canvasTex(w, h, draw, rep) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); t.anisotropy = 4; return t; }
    W.canvasTex = canvasTex;
    var GLOW = W.GLOW = canvasTex(128, 128, function (x) { var g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
    var STAR = W.STAR = canvasTex(128, 128, function (x) { x.translate(64, 64); x.fillStyle = '#FFF8D6'; x.shadowColor = '#FFD447'; x.shadowBlur = 20; x.beginPath(); for (var i = 0; i < 10; i++) { var r = i % 2 ? 20 : 54, a = i * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); });
    var DOT = W.DOT = canvasTex(128, 128, function (x) { var g = x.createRadialGradient(54, 50, 4, 64, 64, 44); g.addColorStop(0, '#FFF7D1'); g.addColorStop(0.55, '#FFC21A'); g.addColorStop(1, '#E08A00'); x.fillStyle = g; x.beginPath(); x.arc(64, 64, 44, 0, Math.PI * 2); x.fill(); x.lineWidth = 7; x.strokeStyle = '#8A4F00'; x.stroke(); }); DOT.encoding = THREE.sRGBEncoding;

    /* sky + reflections (a painted sky picture: works on every computer) */
    var skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: col(0x5FB8FF) }, mid: { value: col(0xA9DCFF) }, low: { value: col(0xFFF4DE) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 low; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.08 ? mix(mid, top, smoothstep(0.08, 0.6, h)) : mix(low, mid, smoothstep(-0.1, 0.08, h)); gl_FragColor = vec4(c,1.0); }' });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), skyMat));
    var envTex = W.envTex = canvasTex(512, 256, function (x, w, h) { var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#4FA8F5'); g.addColorStop(0.45, '#BFE4FF'); g.addColorStop(0.52, '#FFF3D9'); g.addColorStop(0.56, '#7DBF5F'); g.addColorStop(1, '#3E7A33'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      var s = x.createRadialGradient(w * 0.3, h * 0.22, 0, w * 0.3, h * 0.22, 40); s.addColorStop(0, 'rgba(255,255,240,1)'); s.addColorStop(1, 'rgba(255,255,240,0)'); x.fillStyle = s; x.fillRect(0, 0, w, h); });
    envTex.mapping = THREE.EquirectangularReflectionMapping; envTex.encoding = THREE.sRGBEncoding; envTex.wrapS = THREE.ClampToEdgeWrapping;
    var goldEnv = W.goldEnv = canvasTex(512, 256, function (x, w, h) { var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.4, '#FFE9A8'); g.addColorStop(0.55, '#B8741A'); g.addColorStop(1, '#5A3208'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    goldEnv.mapping = THREE.EquirectangularReflectionMapping; goldEnv.encoding = THREE.sRGBEncoding;
    scene.fog = new THREE.Fog(col(0xDDF0FF), 45, 110);
    scene.add(new THREE.HemisphereLight(col(0xDDEEFF), col(0x5F9E45), 0.35));
    var sunL = new THREE.DirectionalLight(col(0xFFE9C4), 2.1); sunL.position.set(-7, 9, 7); sunL.castShadow = !FAST;
    sunL.shadow.mapSize.set(1536, 1536); Object.assign(sunL.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 }); sunL.shadow.bias = -0.0006; sunL.shadow.radius = 5; scene.add(sunL);
    var rimL = new THREE.DirectionalLight(col(0xBFE3FF), 1.1); rimL.position.set(6, 4, -8); scene.add(rimL);

    /* ---------- the meadow ---------- */
    var std = W.std = function (c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: col(c), roughness: 0.75 }, o || {})); };
    var ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), std(0x3C8F35, { roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -2.1; ground.receiveShadow = true; scene.add(ground);
    [[-14, -26, 12, 0x7CCB64], [10, -30, 15, 0x6FC45A], [0, -42, 20, 0x8ED377], [-28, -36, 14, 0x84CF6D], [28, -38, 16, 0x84CF6D]].forEach(function (h) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(h[2], 48, 24), std(h[3], { roughness: 1 })); m.position.set(h[0], -2.1 - h[2] * 0.62, h[1]); scene.add(m); });
    var grassU = { uTime: { value: 0 } }, blade = new THREE.PlaneGeometry(0.07, 0.6, 1, 4); blade.translate(0, 0.3, 0);
    var bp = blade.attributes.position; for (var bi = 0; bi < bp.count; bi++) bp.setX(bi, bp.getX(bi) * (1 - bp.getY(bi) / 0.6 * 0.85));
    var grassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, side: THREE.DoubleSide });
    grassMat.onBeforeCompile = function (sh) { sh.uniforms.uTime = grassU.uTime;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vec4 wp = instanceMatrix * vec4(0.0,0.0,0.0,1.0); float k = pow(position.y / 0.6, 2.0); transformed.x += sin(uTime * 1.8 + wp.x * 0.7 + wp.z * 0.5) * 0.12 * k; transformed.z += cos(uTime * 1.3 + wp.x * 0.4) * 0.06 * k;'); };
    var GN = FAST ? 1500 : 9000, grass = new THREE.InstancedMesh(blade, grassMat, GN), dm = new THREE.Object3D(), gc = new THREE.Color();
    for (var gi = 0; gi < GN; gi++) { var a = Math.random() * Math.PI * 2, rr = 1.6 + Math.pow(Math.random(), 0.7) * 17, gx = Math.cos(a) * rr, gz = Math.sin(a) * rr * 0.75 - 2;
      if (gz > 6.5) gz = 6.5 - Math.random() * 2;
      if (gi > GN * 0.68) { gx = (Math.random() - .5) * 18; gz = 6.5 + Math.random() * 15; }
      dm.position.set(gx, -2.1, gz); dm.rotation.set(0, Math.random() * Math.PI, (Math.random() - .5) * 0.25); var s = 0.6 + Math.random() * 0.9; dm.scale.set(s, s * (0.8 + Math.random() * 0.6) * (gz > 6.5 ? 0.55 : 1), s); dm.updateMatrix(); grass.setMatrixAt(gi, dm.matrix);
      gc.setHSL(0.27 + Math.random() * 0.06, 0.55 + Math.random() * 0.2, 0.34 + Math.random() * 0.16); grass.setColorAt(gi, gc.convertSRGBToLinear()); }
    grass.instanceColor.needsUpdate = true; scene.add(grass); W.grass = grass;
    function tree(x, z, s, c) { var g = new THREE.Group(), tr = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.2, 14), std(0x8A5A34, { roughness: 0.9 })); tr.position.y = 1.1; tr.castShadow = true; g.add(tr);
      for (var i = 0; i < 9; i++) { var r = 0.7 + Math.random() * 0.6, lf = new THREE.Mesh(new THREE.IcosahedronGeometry(r, FAST ? 1 : 2), std(c, { roughness: 0.65 })), an = i / 9 * Math.PI * 2; lf.position.set(Math.cos(an) * 0.9 * Math.random(), 2.4 + Math.random() * 1.3, Math.sin(an) * 0.7 * Math.random()); lf.castShadow = true; g.add(lf); }
      g.position.set(x, -2.1, z); g.scale.setScalar(s); scene.add(g); }
    tree(-7.4, -6, 1.25, 0x3DB35C); tree(7.8, -7.5, 1.4, 0x35A856); tree(-12, -14, 1.7, 0x4CBB66); tree(13, -16, 1.8, 0x45B460); tree(-3, -22, 2, 0x58C070);
    var flowers = [], fcols = [0xFF7FAE, 0xFFD93B, 0xFFFFFF, 0xB98CFF, 0xFF9447];
    function flower(x, z, c, s) { var g = new THREE.Group(), st = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.8, 6), std(0x2F9A49)); st.position.y = 0.4; g.add(st);
      var hd = new THREE.Group(); hd.position.y = 0.82; hd.rotation.x = -0.5; g.add(hd); var pm = new THREE.MeshPhysicalMaterial({ color: col(c), roughness: 0.5, clearcoat: 0.2 });
      for (var i = 0; i < 6; i++) { var p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), pm), an = i / 6 * Math.PI * 2; p.position.set(Math.cos(an) * 0.14, Math.sin(an) * 0.14, 0); p.scale.set(1, 1, 0.3); hd.add(p); }
      var ctr = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), std(0xFFB21F, { roughness: 0.4 })); ctr.position.z = 0.04; hd.add(ctr); g.position.set(x, -2.1, z); g.scale.setScalar(s); scene.add(g); flowers.push(g); }
    for (var fi = 0; fi < 26; fi++) { var fa = Math.random() * Math.PI * 2, fr = 3.2 + Math.random() * 7; flower(Math.cos(fa) * fr * 1.2, Math.sin(fa) * fr * 0.6 + 0.5, fcols[fi % fcols.length], 0.8 + Math.random() * 0.5); }
    [[-3.4, 2.4, 0.45], [3.6, 2.1, 0.35], [6, -1.5, 0.6]].forEach(function (r) { var m = new THREE.Mesh(new THREE.DodecahedronGeometry(r[2], 1), std(0xB9C2CC, { roughness: 0.6 })); m.position.set(r[0], -2.0, r[1]); m.scale.y = 0.65; m.castShadow = true; scene.add(m); });
    var clouds = [];
    for (var ci = 0; ci < 7; ci++) { var cg = new THREE.Group(), cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: col(0xEAF4FF), emissiveIntensity: 0.35, fog: false });
      for (var k = 0; k < 6; k++) { var m = new THREE.Mesh(new THREE.SphereGeometry(1 + Math.random() * 0.8, 20, 14), cm); m.position.set((k - 2.5) * 1.1, Math.random() * 0.8, Math.random() * 0.8); cg.add(m); }
      cg.position.set(-40 + ci * 13, 9 + (ci % 3) * 2.2, -40 - (ci % 2) * 10); cg.userData.v = 0.4 + (ci % 3) * 0.15; scene.add(cg); clouds.push(cg); }
    var sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: col(0xFFF0B8).multiplyScalar(2.2), fog: false, depthWrite: false, transparent: true })); sun.scale.setScalar(22); sun.position.set(-30, 26, -80); scene.add(sun);
    var butterflies = [];
    function butterfly(c, ph) { var g = new THREE.Group(), sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(0.35, 0.5, 0.8, 0.3, 0.6, -0.05); sh.bezierCurveTo(0.62, -0.4, 0.2, -0.42, 0, 0);
      var mat = new THREE.MeshPhysicalMaterial({ color: col(c), side: THREE.DoubleSide, roughness: 0.4, emissive: col(c), emissiveIntensity: 0.15 }), wl = new THREE.Group(), wr = new THREE.Group(), L = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat), R = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat);
      R.scale.x = -1; wl.add(L); wr.add(R); g.add(wl); g.add(wr); g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.42, 6), std(0x1B2A47))); g.scale.setScalar(0.55); g.userData = { wl: wl, wr: wr, ph: ph }; scene.add(g); butterflies.push(g); }
    butterfly(0xFF7FAE, 0); butterfly(0xFFD93B, 2.2); butterfly(0x7FCBFF, 4.2);
    var PN = 140, pgeo = new THREE.BufferGeometry(), pp = new Float32Array(PN * 3);
    for (var pi = 0; pi < PN; pi++) { pp[pi * 3] = (Math.random() - .5) * 18; pp[pi * 3 + 1] = -1.5 + Math.random() * 5; pp[pi * 3 + 2] = (Math.random() - .5) * 10; }
    pgeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    var pollen = new THREE.Points(pgeo, new THREE.PointsMaterial({ map: GLOW, color: col(0xFFF3C2).multiplyScalar(1.6), size: 0.12, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(pollen);

    /* ---------- glow ---------- */
    var composer = null;
    try { if (!FAST && THREE.EffectComposer && THREE.UnrealBloomPass) { composer = new THREE.EffectComposer(renderer); composer.addPass(new THREE.RenderPass(scene, camera)); composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.5, 0.88)); W.bloom = true; } } catch (e) { composer = null; W.bloom = false; }

    /* ---------- tweens, sparkles ---------- */
    var tweens = [], clock = new THREE.Clock(), T = 0, hooks = [];
    var E = W.E = { out: function (t) { return 1 - Math.pow(1 - t, 3); }, lin: function (t) { return t; }, inout: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
      elastic: function (t) { return t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1; }, back: function (t) { var c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };
    W.tween = function (d, fn, e) { return new Promise(function (res) { tweens.push({ t0: T, d: FAST ? Math.min(d, 0.03) : d, fn: fn, e: E[e || 'out'], res: res }); }); };
    W.wait = function (s) { return FAST ? Promise.resolve() : W.tween(s, function () {}); };
    W.time = function () { return T; };
    W.onFrame = function (fn) { hooks.push(fn); };
    var sparks = [];
    W.burst = function (at, n, sp) { if (FAST) return; for (var i = 0; i < n; i++) { var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: STAR, color: col(0xFFFFFF).multiplyScalar(1.8), transparent: true, depthWrite: false })); s.position.copy(at); s.scale.setScalar(0.25 + Math.random() * 0.3);
      var an = Math.random() * Math.PI * 2, v = (sp || 4) * (0.5 + Math.random() * 0.7); s.userData = { v: new THREE.Vector3(Math.cos(an) * v, Math.sin(an) * v * 0.8 + 2, Math.random() * 2), life: 1 + Math.random() * 0.6, t: 0 }; scene.add(s); sparks.push(s); } };

    /* ---------- pointer helpers ---------- */
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hp = new THREE.Vector3(); W.look = new THREE.Vector2();
    W.ndcOf = function (e) { var r = renderer.domElement.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera); return ray; };
    W.planeAt = function (e, z) { plane.constant = -(z || 0); W.ndcOf(e); return ray.ray.intersectPlane(plane, hp) ? hp.clone() : null; };
    W.hits = function (e, objs) { W.ndcOf(e); return ray.intersectObjects(objs, true); };
    W.screenOf = function (v) { var p = v.clone().project(camera), r = renderer.domElement.getBoundingClientRect(); return { x: r.left + (p.x + 1) / 2 * r.width, y: r.top + (1 - p.y) / 2 * r.height }; };
    window.addEventListener('pointermove', function (e) { W.look.set(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5); });

    /* ---------- size ---------- */
    function size() { var w = host.clientWidth, h = host.clientHeight, a = w / h; renderer.setSize(w, h, false); camera.aspect = a; W.aspect = a;
      W.camBase.z = a < 1 ? 11 / Math.max(a, 0.45) * 0.72 + 2 : 11; W.camBase.y = a < 1 ? 0.9 : 0.6; W.camFrom.set(-3, 1.4, W.camBase.z + 20);
      camera.updateProjectionMatrix(); if (composer) composer.setSize(w, h); if (W.phase === 'start') camera.position.copy(W.camFrom); if (W.onResize) W.onResize(a); }
    window.addEventListener('resize', size); W.size = size; size(); camera.position.copy(W.camFrom);
    W.flyIn = function (sec) { W.flying = true; return W.tween(sec || 2.4, function (k) { camera.position.lerpVectors(W.camFrom, W.camBase, k); }, 'inout').then(function () { W.flying = false; }); };

    /* ---------- loop; if the computer is slow, the glow and extra grass turn off by themselves ---------- */
    var frames = 0, slowT = 0;
    function frame() {
      var dt = Math.min(clock.getDelta(), 0.05); T += dt; grassU.uTime.value = T;
      for (var i = tweens.length - 1; i >= 0; i--) { var tw = tweens[i], kk = Math.min(1, (T - tw.t0) / tw.d); tw.fn(tw.e(kk)); if (kk >= 1) { tweens.splice(i, 1); tw.res(); } }
      if (W.phase !== 'start' && !W.flying) camera.position.lerp(new THREE.Vector3(W.camBase.x + W.look.x * 0.35, W.camBase.y - W.look.y * 0.18, W.camBase.z), 0.05);
      camera.lookAt(W.camLook);
      clouds.forEach(function (c) { c.position.x += c.userData.v * dt; if (c.position.x > 55) c.position.x = -55; });
      butterflies.forEach(function (b, j) { var u = b.userData, t = T * 0.45 + u.ph; b.position.set(Math.sin(t) * 6, 0.4 + Math.sin(t * 2.1) * 0.9 + j * 0.5, Math.cos(t * 0.7) * 2.5 - 2.5); var f = Math.sin(T * 15 + u.ph); u.wl.rotation.y = f; u.wr.rotation.y = -f; b.rotation.y = Math.cos(t) > 0 ? 0.7 : -0.7; });
      flowers.forEach(function (f, j) { f.rotation.z = Math.sin(T * 1.6 + j) * 0.07; });
      var pa = pollen.geometry.attributes.position; for (var q = 0; q < PN; q++) { pa.array[q * 3 + 1] += Math.sin(T + q) * 0.002 + 0.002; pa.array[q * 3] += Math.cos(T * 0.5 + q) * 0.003; if (pa.array[q * 3 + 1] > 4) pa.array[q * 3 + 1] = -1.8; } pa.needsUpdate = true;
      for (var s = sparks.length - 1; s >= 0; s--) { var sp = sparks[s], d = sp.userData; d.t += dt; d.v.y -= 6 * dt; sp.position.addScaledVector(d.v, dt); sp.material.opacity = Math.max(0, 1 - d.t / d.life); sp.material.rotation += dt * 3; if (d.t > d.life) { scene.remove(sp); sparks.splice(s, 1); } }
      hooks.forEach(function (h) { h(dt, T); });
      if (composer && W.bloom) composer.render(); else renderer.render(scene, camera);
      frames++; if (!FAST && frames > 30 && frames < 150) { slowT += dt; if (frames === 149 && slowT / 119 > 1 / 28 && W.quality === 'high') { W.quality = 'saver'; W.bloom = false; grass.count = Math.round(GN * 0.3); renderer.setPixelRatio(1); size(); } }
      W.ready = true; requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return W;
  };

  /* ---------- a cute snake that grows along a curve (head at the start) ---------- */
  KW.snake = function (W, curve, R0) {
    R0 = R0 || 0.44; var TS = 260, RS = 24, taper = function (u) { return u < 0.72 ? 1 : 1 - (u - 0.72) / 0.28 * 0.72; };
    var scales = function (x, w, h, base, dark, light) { x.fillStyle = base; x.fillRect(0, 0, w, h); var r = w > 300 ? 24 : 18;
      for (var yy = -r; yy < h + r; yy += r * 1.1) for (var xx = -r; xx < w + r; xx += r * 1.6) { var ox = (Math.round(yy / (r * 1.1)) % 2) * r * 0.8, g = x.createRadialGradient(xx + ox - 3, yy - 4, 1, xx + ox, yy, r); g.addColorStop(0, light); g.addColorStop(0.75, base); g.addColorStop(1, dark); x.fillStyle = g; x.beginPath(); x.arc(xx + ox, yy, r, 0, Math.PI * 2); x.fill(); } };
    var skin = W.canvasTex(512, 256, function (x, w, h) { scales(x, w, h, '#2FB85C', '#17803C', '#6BE38C'); for (var i = 0; i < 4; i++) { var cx = i * w / 4 + w / 8; x.fillStyle = 'rgba(255,205,40,1)'; x.beginPath(); x.ellipse(cx, h * 0.5, 30, 38, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = 'rgba(255,236,150,.9)'; x.beginPath(); x.ellipse(cx - 8, h * 0.5 - 10, 10, 13, 0, 0, Math.PI * 2); x.fill(); } }, [2, 1]);
    skin.encoding = THREE.sRGBEncoding;
    var bump = W.canvasTex(512, 256, function (x, w, h) { scales(x, w, h, '#808080', '#303030', '#E0E0E0'); }, [2, 1]);
    var headTex = W.canvasTex(256, 256, function (x, w, h) { scales(x, w, h, '#35BE62', '#1C8A42', '#76E896'); }, [1.5, 1]); headTex.encoding = THREE.sRGBEncoding;
    var tube = new THREE.TubeGeometry(curve, TS, R0, RS, false), pos = tube.attributes.position, v = new THREE.Vector3();
    for (var i = 0; i <= TS; i++) { var u = i / TS, c = curve.getPointAt(u), f = taper(u); for (var j = 0; j <= RS; j++) { var k = i * (RS + 1) + j; v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(f).add(c); pos.setXYZ(k, v.x, v.y, v.z); } }
    pos.needsUpdate = true; tube.computeVertexNormals();
    var mats = [], col = KW.col;
    function sm(o) { var m = new THREE.MeshPhysicalMaterial(Object.assign({ roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.35, transparent: true, envMap: W.envTex, envMapIntensity: 0.45 }, o)); mats.push(m); return m; }
    var g = new THREE.Group(), body = new THREE.Mesh(tube, sm({ map: skin, bumpMap: bump, bumpScale: 0.035, color: 0xffffff })); body.castShadow = true; g.add(body);
    var tip = new THREE.Mesh(new THREE.SphereGeometry(R0, 24, 16), body.material); tip.castShadow = true; g.add(tip);
    var head = new THREE.Group(), h0 = curve.getPointAt(0); head.position.set(h0.x + 0.22, h0.y + 0.1, h0.z + 0.15); g.add(head);
    var skull = new THREE.Mesh(new THREE.SphereGeometry(0.72, 40, 30), sm({ map: headTex, bumpMap: bump, bumpScale: 0.02, color: 0xffffff })); skull.scale.set(1.14, 0.95, 1); skull.castShadow = true; head.add(skull);
    var snout = new THREE.Mesh(new THREE.SphereGeometry(0.42, 30, 20), skull.material); snout.position.set(0, -0.2, 0.42); snout.scale.set(1.25, 0.72, 0.9); head.add(snout);
    var eyes = new THREE.Group(); head.add(eyes);
    [[-0.31, 0.24], [0.31, 0.27]].forEach(function (e) {
      var sc = new THREE.Mesh(new THREE.SphereGeometry(0.27, 32, 24), sm({ color: col(0xFFFFFF), roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 })); sc.position.set(e[0], e[1], 0.52); eyes.add(sc);
      var ir = new THREE.Mesh(new THREE.SphereGeometry(0.17, 28, 20), sm({ color: col(0x7A4A1E), roughness: 0.2, clearcoat: 1 })); ir.position.set(e[0] + 0.015, e[1] - 0.02, 0.69); ir.scale.z = 0.6; eyes.add(ir);
      var pu = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), sm({ color: col(0x0E1424), roughness: 0.1, clearcoat: 1 })); pu.position.set(e[0] + 0.02, e[1] - 0.025, 0.75); pu.scale.z = 0.6; eyes.add(pu);
      var hl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({ color: col(0xFFFFFF).multiplyScalar(2), transparent: true })); mats.push(hl.material); hl.position.set(e[0] + 0.08, e[1] + 0.06, 0.8); eyes.add(hl); });
    [[-0.54, -0.1], [0.56, -0.08]].forEach(function (c) { var m = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), sm({ color: col(0xFF8FA6), roughness: 0.6, clearcoat: 0, opacity: 0.85 })); m.material.userData.op = 0.85; m.position.set(c[0], c[1], 0.5); m.scale.z = 0.3; head.add(m); });
    var smile = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 10, 28, Math.PI), sm({ color: col(0x1A5A33), roughness: 0.5 })); smile.rotation.z = Math.PI; smile.position.set(0, -0.2, 0.8); head.add(smile);
    var tongue = new THREE.Group(); tongue.position.set(0, -0.38, 0.72); head.add(tongue);
    [[-0.05, 0.4], [0.05, -0.4]].forEach(function (t) { var b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.04), sm({ color: col(0xF04C5C), roughness: 0.3 })); b.position.set(t[0], -0.12, 0.05); b.rotation.z = t[1]; tongue.add(b); });
    tongue.scale.set(1, 0.01, 1);
    var S = { group: g, head: head, mats: mats, progress: 1, hissing: false };
    S.grow = function (p) { p = Math.max(0, Math.min(1, p)); S.progress = p; var seg = Math.floor(p * TS); body.geometry.setDrawRange(0, seg * RS * 6); body.visible = seg > 0;
      tip.position.copy(curve.getPointAt(p)); tip.scale.setScalar(taper(p)); tip.visible = p > 0.005 && p < 0.995; head.visible = p > 0; head.scale.setScalar(Math.min(1, p * 12)); };
    S.opacity = function (o) { mats.forEach(function (m) { m.opacity = o * (m.userData && m.userData.op || 1); }); };
    mats.forEach(function (m) { m.userData = m.userData || {}; });
    S.hiss = function (sec) { if (S.hissing) return Promise.resolve(); S.hissing = true; var w = new THREE.Vector3(); head.getWorldPosition(w); W.burst(w.add(new THREE.Vector3(0.5, -0.2, 0.6)), 10, 3); KW.audio.hissStart();
      return Promise.all([W.tween(0.15, function (k) { tongue.scale.y = 0.01 + k; }), W.tween(sec, function (k) { var s = Math.sin(k * Math.PI * 6) * (1 - k); g.rotation.z = s * 0.06; g.scale.setScalar(S.base || 1); g.scale.x *= 1 + s * 0.03; g.scale.y *= 1 - s * 0.03; }, 'inout')])
        .then(function () { KW.audio.hissStop(); return W.tween(0.2, function (k) { tongue.scale.y = 1 - k * 0.99; }); }).then(function () { S.hissing = false; }); };
    var blinkAt = 2;
    W.onFrame(function (dt, T) { if (!S.hissing && !S.still) { g.position.y = (S.y || 0) + Math.sin(T * 2) * 0.05; head.rotation.z = Math.sin(T * 1.3) * 0.07; head.rotation.y = Math.sin(T * 0.9) * 0.12 + W.look.x * 0.35; }
      if (T > blinkAt) { var bk = (T - blinkAt) / 0.16; eyes.scale.y = bk < 1 ? 1 - Math.sin(bk * Math.PI) * 0.9 : 1; if (bk >= 1) blinkAt = T + 2 + Math.random() * 3; } });
    return S;
  };

  /* ---------- a 3D letter made from its stroke paths ---------- */
  KW.letter = function (W, key, mat) {
    var g = new THREE.Group();
    KW.STROKES[key].forEach(function (d) { var c = KW.curveOf(d); var m = new THREE.Mesh(new THREE.TubeGeometry(c, 160, 0.4, 28, false), mat); m.castShadow = true; g.add(m);
      [0, 1].forEach(function (e) { var cap = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 16), mat); cap.position.copy(c.getPointAt(e)); g.add(cap); }); });
    g.userData.key = key; return g;
  };
  KW.goldMat = function (W) { return new THREE.MeshPhysicalMaterial({ color: KW.col(0xFFB627), metalness: 0.9, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, emissive: KW.col(0x7A4A00), emissiveIntensity: 0.3, envMap: W.goldEnv, envMapIntensity: 1.3, transparent: true }); };

  /* ---------- sound: pure letter sounds are made by the device, never spoken ---------- */
  var AC = null, live = null;
  var audio = KW.audio = { hissN: 0, humN: 0 };
  audio.ctx = function () { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; };
  audio.hissStart = function () { if (live) return; audio.hissN++; var c = audio.ctx(); if (!c) return;
    var len = c.sampleRate * 2, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource(); src.buffer = b; src.loop = true; var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2600;
    var pk = c.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 5500; pk.Q.value = 1.2; pk.gain.value = 9; var g = c.createGain(); g.gain.value = 0;
    src.connect(hp); hp.connect(pk); pk.connect(g); g.connect(c.destination); src.start(); g.gain.setTargetAtTime(0.22, c.currentTime, 0.04); live = { src: src, g: g }; };
  audio.hissStop = function () { if (!live || !AC) { live = null; return; } var n = live; live = null; n.g.gain.setTargetAtTime(0, AC.currentTime, 0.05); setTimeout(function () { try { n.src.stop(); } catch (e) {} }, 300); };
  audio.hum = function (ms) { audio.humN++; var c = audio.ctx(); if (c && !FAST) { var o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(), t0 = c.currentTime, d = (ms || 1200) / 1000;
      o.type = 'sawtooth'; o.frequency.value = 135; f.type = 'lowpass'; f.frequency.value = 650; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.2, t0 + .06); g.gain.setValueAtTime(.2, t0 + d - .1); g.gain.linearRampToValueAtTime(0, t0 + d);
      o.connect(f); f.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .05); }
    return new Promise(function (r) { setTimeout(r, FAST ? 0 : (ms || 1200)); }); };
  audio.chime = function (notes) { var c = audio.ctx(); if (!c || FAST) return; var t = c.currentTime; notes.forEach(function (f, i) { var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t + i * .08); g.gain.linearRampToValueAtTime(.12, t + i * .08 + .02); g.gain.exponentialRampToValueAtTime(.001, t + i * .08 + .5); o.connect(g); g.connect(c.destination); o.start(t + i * .08); o.stop(t + i * .08 + .55); }); };

  /* ---------- the voice: the school's teacher voice, else the device voice ---------- */
  var TTS = 'https:' + '/' + '/' + 'tts-q26c275eaa-uk.a.run.app', vcache = {}, vtok = 0, va = null;
  audio.said = [];
  audio.hush = function () { vtok++; try { if (va) va.pause(); } catch (e) {} va = null; try { window.speechSynthesis.cancel(); } catch (e) {} audio.hissStop(); };
  function fetchVoice(t) { return fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t, voice: 'teacher' }) }).then(function (r) { return r.json(); }).then(function (j) { if (j && j.ok && j.url) { vcache[t] = j.url; return j.url; } throw new Error('tts'); }); }
  audio.say = function (t) { audio.said.push(t); if (FAST) return Promise.resolve(); var my = vtok;
    return new Promise(function (done) { var fin = false, end = function () { if (!fin) { fin = true; done(); } }; setTimeout(end, t.length * 85 + 2500);
      var dev = function () { if (my !== vtok) return end(); try { var u = new SpeechSynthesisUtterance(t); u.rate = 0.9; u.pitch = 1.1; u.onend = end; u.onerror = end; window.speechSynthesis.speak(u); } catch (e) { end(); } };
      var play = function (url) { if (my !== vtok) return end(); var a = new Audio(url); va = a; a.onended = end; a.onerror = dev; var p = a.play(); if (p && p.catch) p.catch(dev); };
      if (vcache[t]) return play(vcache[t]);
      Promise.race([fetchVoice(t), new Promise(function (_, rej) { setTimeout(function () { rej(new Error('slow')); }, 1800); })]).then(play).catch(dev); }); };
  audio.preload = function (lines) { if (FAST) return; lines.forEach(function (t) { if (!vcache[t]) fetchVoice(t).catch(function () {}); }); };

  /* ---------- the script runner: lines are spoken, functions run; "hear it again" repeats the words and marked sounds and never blocks the screen ---------- */
  KW.runner = function (againBtn) {
    var R = { cur: [], busy: false, tok: 0, echoTok: 0, again: 0 };
    R.run = function (sc) { var my = ++R.tok; R.echoTok++; R.cur = sc; R.busy = true; if (againBtn) againBtn.classList.add('wait');
      return sc.reduce(function (p, s) { return p.then(function () { if (my !== R.tok) return; return typeof s === 'string' ? audio.say(s) : s(); }); }, Promise.resolve())
        .then(function () { if (my === R.tok) { R.busy = false; if (againBtn) againBtn.classList.remove('wait'); } return my === R.tok; }); };
    R.stop = function () { R.tok++; R.busy = false; audio.hush(); if (againBtn) againBtn.classList.remove('wait'); };
    if (againBtn) againBtn.onclick = function () { R.again++; if (R.busy) return; var my = ++R.echoTok; audio.hush();
      R.cur.filter(function (s) { return typeof s === 'string' || (typeof s === 'function' && s.echo); }).reduce(function (p, s) { return p.then(function () { if (my !== R.echoTok) return; return typeof s === 'string' ? audio.say(s) : s(); }); }, Promise.resolve()); };
    return R;
  };
  KW.echo = function (fn) { fn.echo = true; return fn; };
})();
