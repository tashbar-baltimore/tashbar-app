/* Memory Match: glossy cards lie face down. He turns two at a time and pairs each letter with a picture that starts with its sound
   (the bear goes with Beis). Skill: letter-sound links, with a little memory fun.
   Show-then-try: "Watch me" turns the first pair. A wrong pair is explained (the picture's first sound, then the letter's name) and the
   cards turn back. After two misses, the partner of the card he just turned glows. Two letters with the same sound are never both on the table. */
import { makePictures, WORDS, WORD_NAME, hasPic } from '../pictures.js';
export default function setup(E, { struggled, unit, game = {} }) {
  const { THREE, S } = E;
  const PIC = makePictures(E);
  /* the letters: this unit's letters that have a picture, then known letters, up to five pairs; never two that say the same sound */
  const sameSound = (a, b) => !!E.LETTERS[a].snd && E.LETTERS[a].snd === E.LETTERS[b].snd || (E.quiet(a) && E.quiet(b));
  const withPic = k => Object.keys(WORDS).some(w => WORDS[w].letter === k && hasPic(w));
  const pool = [...unit.letters, ...[...unit.known].sort(() => Math.random() - .5)].filter(withPic), keys = [];   /* earlier letters come back at random, not only the newest */
  for (const k of pool) { if (keys.length >= 5) break; if (!keys.some(x => sameSound(x, k))) keys.push(k); }
  keys.sort((a, b) => E.AB(a) - E.AB(b));
  const wordOf = {}; keys.forEach(k => { const ws = Object.keys(WORDS).filter(w => WORDS[w].letter === k && hasPic(w)); wordOf[k] = ws[Math.floor(Math.random() * ws.length)]; });
  Object.values(wordOf).forEach(w => PIC[w]());   /* every picture starts loading now */

  /* a painted back for every card: a soft blue-to-violet tile with a gold star (no letters, so nothing gives the answer away) */
  const backTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 320; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 256, 320); g.addColorStop(0, '#4f8dff'); g.addColorStop(1, '#8a5cff'); x.fillStyle = g; x.fillRect(0, 0, 256, 320);
    x.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 26; i++) { x.beginPath(); x.arc((i * 71) % 256, (i * 113) % 320, 6 + (i % 3) * 3, 0, Math.PI * 2); x.fill(); }
    x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 10; x.strokeRect(14, 14, 228, 292);
    x.translate(128, 160); x.fillStyle = '#ffd43b'; x.strokeStyle = '#ffb000'; x.lineWidth = 6; x.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 26 : 62; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const W = 1.5, H = 1.9, PAIR_COLS = [0x37b24d, 0xf76707, 0xe64980, 0x1c7ed6, 0x7048e8];
  const bodyM = E.M(0xfff7e6, { roughness: .35, clearcoat: .9 }), rimM = E.M(0xffd43b, { metalness: .45, roughness: .25, clearcoat: 1 });
  function makeCard(kind, k) {
    const c = new THREE.Group(); c.add(E.mesh(E.rbox(W + .1, H + .1, .12, .05), rimM, 0, 0, 0));
    c.add(E.mesh(E.rbox(W - .06, H - .06, .14, .05), bodyM, 0, 0, .01, false));
    const back = new THREE.Mesh(new THREE.PlaneGeometry(W - .12, H - .12), new THREE.MeshBasicMaterial({ map: backTex })); back.position.z = -.085; back.rotation.y = Math.PI; c.add(back);
    let face;
    if (kind === 'letter') { face = E.letter(k, 1.25); face.position.set(0, face.userData.below * .6, .1); }
    else { const p = PIC[wordOf[k]](); const sp = p.userData.card;
      if (sp) { const a = sp.scale.x / sp.scale.y, h = Math.min(H - .35, (W - .3) / a); face = new THREE.Mesh(new THREE.PlaneGeometry(h * a, h), new THREE.MeshBasicMaterial({ map: sp.material.map, transparent: true, alphaTest: .4 })); face.position.z = .09; }
      else { face = p; p.scale.setScalar(.8); p.position.z = .25; } }   /* until a painting comes, the simple 3D model */
    face.visible = false; c.add(face);   /* the front only shows once the card is turned over */
    const glow = E.glowSprite('#fff4a0', 3.0, 0); glow.position.z = -.3; c.add(glow);
    c.userData = { kind, key: k, up: false, done: false, busy: false, glow, face };
    c.rotation.y = Math.PI; E.scene.add(c); return c;
  }
  const cards = []; keys.forEach(k => { cards.push(makeCard('letter', k), makeCard('pic', k)); });
  const order = cards.map((_, i) => i).sort(() => Math.random() - .5);   /* dealt in a mixed order */
  const kid = E.unitBoy(unit.n); E.scene.add(kid);
  const said = new Set(); let only = null; let P = false, active = false, first = null, misses = 0, mistakes = 0, pairs = 0, help = struggled, busy = false;
  E.onLayout(p => { P = p; const n = cards.length, cols = p ? 2 : n / 2, rows = Math.ceil(n / cols), sc = p ? (rows > 4 ? .74 : .82) : (cols > 4 ? .8 : .9), dx = (p ? 1.75 : 1.85) * sc / (p ? .82 : .9), dy = (p ? 2.15 : 2.25) * sc / (p ? .82 : .9);
    order.forEach((ci, i) => { const c = cards[ci], col = i % cols, row = Math.floor(i / cols); c.userData.home = new THREE.Vector3(((cols - 1) / 2 - col) * dx, (rows - 1) * dy / 2 - row * dy + (p ? 2.6 : 1.9), 0); if (!c.userData.busy) c.position.copy(c.userData.home); c.scale.setScalar(sc); c.userData.sc = sc; });
    if (p) { E.camBase.set(0, 2.8, rows > 4 ? 12.4 : 11.4); E.camTarget.set(0, 2.6, 0); kid.visible = false; } else { E.camBase.set(0, 2.2, 10.2); E.camTarget.set(0, 1.9, 0); kid.visible = true; kid.position.set(cols > 4 ? -5.0 : -4.75, 0, 1.4); kid.scale.setScalar(1); } });
  E.onFrame(t => cards.forEach((c, i) => { if (c.userData.busy) return; const h = c.userData.home; if (h) c.position.y = h.y + Math.sin(t * 1.6 + i) * .04;
    c.userData.glow.material.opacity = c.userData.done ? .35 + Math.sin(t * 3 + i) * .1 : c.userData.hint ? .6 + Math.sin(t * 6) * .3 : 0; }));
  window.__info = () => ({ ready: active && !busy, guide: only ? E.toScreen(E.worldPos(only)) : null, cards: cards.map((c, i) => ({ i, kind: c.userData.kind, key: c.userData.key, up: c.userData.up, done: c.userData.done, xy: E.toScreen(E.worldPos(c)) })) });
  const flip = async (c, up) => { c.userData.busy = true; const r0 = c.rotation.y, r1 = up ? 0 : Math.PI, z0 = c.position.z; E.sfx.pop();
    await E.tween(380, q => { c.rotation.y = r0 + (r1 - r0) * q; c.userData.face.visible = Math.cos(c.rotation.y) > 0; c.position.z = z0 + Math.sin(q * Math.PI) * .8; }, E.ease.inOut); c.position.z = z0; c.userData.up = up; c.userData.busy = false; };
  const partner = c => cards.find(x => x !== c && x.userData.key === c.userData.key);
  const sayOf = c => c.userData.kind === 'pic' ? (E.quiet(c.userData.key) ? WORD_NAME[wordOf[c.userData.key]] + '!' : [WORD_NAME[wordOf[c.userData.key]] + '!', S(E.LETTERS[c.userData.key].snd)]) : E.nameLine(c.userData.key);
  async function match(a, b) {   /* a pair: both glow gold, sparkle and hop */
    const l = a.userData.kind === 'letter' ? a : b, p = a === l ? b : a, k = l.userData.key, w = wordOf[k];
    const rim = E.M(PAIR_COLS[pairs % PAIR_COLS.length], { roughness: .25, clearcoat: 1 }); [a, b].forEach(c => { c.userData.done = true; c.userData.hint = false; c.children[0].material = rim; }); help = struggled && pairs < 1;   /* the two cards of a pair share one bright frame */
    E.joy(E.worldPos(l).add(new THREE.Vector3(0, 1.4, .6)), true); E.hop(l, .35); E.hop(p, .35); kid.mood('cheer'); setTimeout(() => kid.mood('calm'), 1000 * E.F);
    await E.say(E.quiet(k) ? 'Yes! ' + WORD_NAME[w] + ' starts with ' + E.LETTERS[k].name + ', the quiet letter!' : ['Yes! ' + WORD_NAME[w] + ' starts with', S(E.LETTERS[k].snd), '. ' + E.LETTERS[k].name + '!']);
    pairs++; E.setProgress(keys.length, pairs);
    if (unit.letters.includes(k) && !said.has(k)) { said.add(k); await E.sayWithMe(k); }   /* he says the new letter out loud too (RESEARCH.md) */
  }
  async function miss(a, b) {
    E.sfx.boop(); misses++; if (partner(a).userData.seen) mistakes++;   /* a miss counts against him only when he had already seen the right card */ kid.mood('think'); await Promise.all([E.shake(a, .08), E.shake(b, .08)]);
    if (a.userData.kind === b.userData.kind) await E.say(a.userData.kind === 'letter' ? 'Two letters! Find a letter and its picture.' : 'Two pictures! Find a letter and its picture.');
    else { const p = a.userData.kind === 'pic' ? a : b, l = p === a ? b : a, pk = p.userData.key; await E.say(E.nameLine(l.userData.key));
      await E.say(E.quiet(pk) ? WORD_NAME[wordOf[pk]] + ' starts quiet.' : [WORD_NAME[wordOf[pk]] + ' starts with', S(E.LETTERS[pk].snd), '.']); }
    await E.say('Not a pair. Let’s turn them back.'); kid.mood('calm');
    await Promise.all([flip(a, false), flip(b, false)]);
    if (misses >= 2) help = true;
  }
  async function turn(c) {   /* one tap: the first card shows itself; the second decides */
    if (c.userData.up || c.userData.done || c.userData.busy) return;
    busy = true; await flip(c, true); c.userData.seen = true; await E.say(sayOf(c));
    if (!first) { first = c; if (help) partner(c).userData.hint = true; busy = false; return; }
    const a = first, b = c; first = null; cards.forEach(x => x.userData.hint = false);
    if (a.userData.key === b.userData.key && a.userData.kind !== b.userData.kind) await match(a, b); else await miss(a, b);
    busy = false; if (pairs >= keys.length && resolveAll) resolveAll();
  }
  let resolveAll = null;
  E.onPointer('down', e => { if (!active || busy) return; const c = E.pickFrom(e, cards.filter(x => !x.userData.done && !x.userData.up)); if (c && (!only || c === only)) turn(c); });
  return async () => {
    E.setProgress(keys.length, 0);
    await Promise.all(order.map((ci, i) => (async () => { await E.wait(i * 70); await E.popIn(cards[ci], cards[ci].userData.sc || .9, 380); })()));
    await E.say('Find each letter and a picture that starts with it.');
    /* the demo: the first new letter and its picture */
    const k0 = keys.find(k => unit.letters.includes(k)) || keys[0], dl = cards.find(c => c.userData.key === k0 && c.userData.kind === 'letter'), dp = partner(dl);
    await E.say('Watch me.');
    for (const c of [dl, dp]) { const [x, y] = E.toScreen(E.worldPos(c)); E.hand.at(x + 10, y + 10); await E.wait(500); E.hand.hide(); await flip(c, true); await E.say(sayOf(c)); }
    await match(dl, dp);
    /* "we do": one pair together, the hand showing each card (RESEARCH.md, gain 3) */
    const k1 = keys.find(k => k !== k0 && unit.letters.includes(k)) || keys.find(k => k !== k0);
    if (k1) { const gl = cards.find(c => c.userData.key === k1 && c.userData.kind === 'letter'), gp = partner(gl);
      await E.say('Let\u2019s do one together. Tap where my hand is.'); active = true; document.body.dataset.memoryGuide = 1;
      for (const c of [gl, gp]) { only = c; c.userData.hint = true; const [x, y] = E.toScreen(E.worldPos(c)); E.hand.at(x + 10, y + 10);
        while (!c.userData.up) await E.wait(100); E.hand.hide(); c.userData.hint = false; }
      while (!gp.userData.done || busy) await E.wait(100); only = null; active = false; delete document.body.dataset.memoryGuide; }
    await E.say('Now you! Turn two cards.'); active = true; document.body.dataset.memoryReady = 1;
    if (pairs < keys.length) await new Promise(r => resolveAll = r);
    active = false; delete document.body.dataset.memoryReady;
    kid.mood('cheer'); cards.forEach((c, i) => setTimeout(() => E.hop(c, .3), i * 90 * E.F));
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'You found every pair! Great remembering!' : null };
  };
}
