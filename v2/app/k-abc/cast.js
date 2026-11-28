/* Kindergarten ABC 2.0: Mendy, painted (the same painted Mendy as 2.0 Shapes: warm animated-film style, navy kippah, tzitzis).
   He stands inside the 3D world as a painted cut-out that always turns to face the boy, with a soft shadow under him.
   Poses: idle, talk (shown while the voice speaks), point, happy (a hop), clap. Friends use the same code with their own pictures. */
import { THREE, blob, audio, clamp } from './kit3d.js';

const loader = new THREE.TextureLoader(), cache = {};
function tex(url) { if (!cache[url]) { const t = loader.load(url, x => { t.userData.ratio = x.image.width / x.image.height; }); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; cache[url] = t; } return cache[url]; }

export function painted(S, who = 'mendy', o = {}) {
  const poses = o.poses || ['idle', 'talk', 'point', 'happy', 'clap'], base = o.base || './art/';
  const ratio = { idle: 321 / 900, talk: 463 / 900, point: 484 / 900, happy: 474 / 900, clap: 315 / 900, think: 0.45 };
  const T = {}; poses.forEach(p => T[p] = tex(base + who + '-' + p + '.webp'));
  const H = o.height || 2.5, G = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ map: T.idle, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, toneMapped: false });
  const card = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat); card.renderOrder = 3; G.add(card);
  const hit = new THREE.Mesh(new THREE.BoxGeometry(H * 0.42, H, 0.3), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = H / 2; G.add(hit);
  const shadow = blob(S, H * 0.3, 0.32); S.scene.add(G);
  const M = { G, hit, pose: 'idle', hold: 0, hop: 0, wig: 0, scale: 0, talks: o.talks !== false };
  M.set = (p, sec = 0) => { if (!T[p]) p = 'idle'; M.pose = p; M.hold = sec; };
  M.hopNow = () => { M.hop = 1; };
  M.wiggle = () => { M.wig = 1; };
  M.place = (x, z, s = 1) => { G.position.set(x, (S.groundH ? S.groundH(x, z) : 0) - 0.04, z); G.userData.s = s; shadow.position.set(x, G.position.y + 0.06, z + 0.05); };
  M.appear = () => S.tween(600, e => M.scale = e, t => t < 1 ? 1 + Math.sin(t * Math.PI) * 0.12 * (1 - t) - (1 - t) * (1 - t) * (1 - t) : 1);
  M.scale = 0;
  S.tick((t, dt) => {
    M.hold = Math.max(0, M.hold - dt); M.hop = Math.max(0, M.hop - dt * 1.8); M.wig = Math.max(0, M.wig - dt * 1.5);
    let p = M.pose; if (M.hold <= 0 && p !== 'idle') { p = M.pose = 'idle'; }
    if (p === 'idle' && M.talks && audio.talking) p = 'talk';
    if (!T[p]) p = 'idle';
    if (mat.map !== T[p]) { mat.map = T[p]; mat.needsUpdate = true; }
    const s = (G.userData.s || 1) * M.scale, w = H * (T[p].userData.ratio || ratio[p] || 0.4);   /* each picture keeps its own shape */
    const breathe = 1 + Math.sin(t * 2.1) * 0.012, jump = Math.sin(M.hop * Math.PI) * 0.45;
    card.scale.set(w * s, H * s * breathe, 1); card.position.set(0, H * s * breathe / 2 + jump * s, 0);
    card.rotation.z = Math.sin(t * 22) * 0.04 * M.wig + Math.sin(t * 0.9) * 0.012;
    hit.scale.setScalar(Math.max(0.01, s)); hit.position.y = H * s / 2;
    /* always face the boy (turn around the up axis only) */
    const c = S.camera.position; G.rotation.y = Math.atan2(c.x - G.position.x, c.z - G.position.z);
    shadow.scale.setScalar(Math.max(0.01, s * (1 - jump * 0.4))); shadow.material.opacity = clamp(s, 0, 1);
  });
  M.top = () => new THREE.Vector3(G.position.x, G.position.y + H * (G.userData.s || 1) * 0.95, G.position.z);
  return M;
}
