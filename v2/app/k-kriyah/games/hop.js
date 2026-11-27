/* Sound Hopscotch: three glossy stepping stones across a stream, a letter standing on each, in Alef-Beis order (right to left).
   He hears a sound or a name and taps the stone; his friend hops onto it with a splash of sparkles. Skill: letter name and sound, fast.
   Show-then-try: "Watch me" hops once. A wrong tap: the stone wobbles and its letter says its name; the right letter says its name and glows; the question comes again.
   Each new letter is asked twice (once by sound, once by name), plus one earlier letter.
   Two letters with the same sound are never on the stones together. */
export default function setup(E, { struggled, unit, game = {} }) {
  const { THREE, S } = E;
  const sameSound = (a, b) => !!E.LETTERS[a].snd && E.LETTERS[a].snd === E.LETTERS[b].snd || (E.quiet(a) && E.quiet(b));
  const all = [...new Set([...unit.letters, ...unit.known])];
  /* the plan: a demo, one done together, then each new letter twice (once by its sound, once by its name) and one earlier letter */
  const L = unit.letters, old = unit.known.length ? unit.known : L, rnd = a => a[Math.floor(Math.random() * a.length)];
  const plan = [{ want: L[0], bySound: true }, ...L.map(k => ({ want: k, bySound: true })), ...L.map(k => ({ want: k, bySound: false })).reverse(), { want: rnd(old), bySound: true }];
  for (let i = 2; i < plan.length - 1; i++) if (plan[i].want === plan[i - 1].want) { const t = plan[i]; plan[i] = plan[i + 1]; plan[i + 1] = t; }   /* never the same letter twice in a row */
  plan.push({ want: rnd(old.filter(k => k !== plan[plan.length - 1].want)) || rnd(old), bySound: false });   /* the one done together: an earlier letter */
  const ROUNDS = plan.length - 2;
  /* each round: the target plus two others that never sound the same */
  const rounds = [];
  for (const { want, bySound } of plan) {
    const others = all.filter(k => k !== want && !sameSound(k, want)).sort(() => Math.random() - .5), pick = [want];
    for (const k of others) { if (pick.length >= 3) break; if (!pick.some(x => sameSound(x, k))) pick.push(k); }
    pick.sort((a, b) => E.AB(a) - E.AB(b));
    rounds.push({ want, keys: pick, bySound });
  }
  /* three round play mats on the floor, like hopscotch */
  const stoneCols = [0xff7f6e, 0x4fd68a, 0x4aa8ff];
  const stones = [0, 1, 2].map(i => { const g = new THREE.Group();
    const top = E.mesh(new THREE.CylinderGeometry(1.15, 1.3, .5, 40), E.M(stoneCols[i], { roughness: .3, clearcoat: 1 }), 0, .25, 0); g.add(top);
    const rim = E.mesh(new THREE.TorusGeometry(1.16, .07, 12, 48), E.M(0xffffff, { roughness: .2, clearcoat: 1 }), 0, .5, 0, false); rim.rotation.x = Math.PI / 2; g.add(rim);
    const glow = E.glowSprite('#fff4a0', 3.6, 0); glow.position.y = 1.5; g.add(glow);
    g.userData = { glow, letter: null, i }; E.scene.add(g); return g; });
  const boy = E.unitBoy(unit.n); E.scene.add(boy);
  const bank = new THREE.Vector3();
  const said = new Set(); let guided = false, demoing = true; let P = false, active = false, cur = null, mistakes = 0, firstTry = true, done = 0, answer = null;
  const place = () => { stones.forEach((s, i) => { s.position.set((1 - i) * (P ? 1.85 : 3.4), 0, 0); s.scale.setScalar(P ? .58 : 1); }); };
  E.onLayout(p => { P = p; place(); bank.set(P ? 0 : -5.3, 0, P ? 3.6 : 1.6);
    if (!boy.userData.onStone) { boy.position.copy(bank); boy.scale.setScalar(P ? .7 : .9); }
    if (p) { E.camBase.set(0, 3.2, 10.8); E.camTarget.set(0, 1.0, 1.9); } else { E.camBase.set(0, 3.2, 10.8); E.camTarget.set(0, 1.7, 0); } });
  E.onFrame(t => {
    stones.forEach((s, i) => { s.userData.glow.material.opacity = s.userData.hint ? .55 + Math.sin(t * 6) * .3 : 0; const l = s.userData.letter; if (l) l.rotation.y = -Math.atan2(s.position.x, 10) * .8; if (l && !s.userData.busy) l.position.y = 1.5 + l.userData.lift + (s.userData.up || 0) + Math.sin(t * 2 + i) * .05; }); });
  window.__info = () => ({ ready: active, guided, want: cur && cur.want, stones: stones.map(s => ({ key: s.userData.key, xy: E.toScreen(E.worldPos(s).add(new THREE.Vector3(0, 1.5 * s.scale.y, 0))) })) });
  const ask = r => r.bySound && !E.quiet(r.want) ? ['Hop to the letter that says', S(E.LETTERS[r.want].snd), '.'] : r.bySound ? 'Hop to the quiet letter.' : 'Hop to ' + E.LETTERS[r.want].name + '.';
  async function jump(to) {   /* an arc from where he stands to the top of a stone (or back to the bank) */
    const from = boy.position.clone(), end = to.clone(); E.sfx.whoosh(); boy.mood('walk');
    await E.tween(520, q => { boy.position.lerpVectors(from, end, q); boy.position.y = from.y + (end.y - from.y) * q + Math.sin(q * Math.PI) * 1.6; }, E.ease.inOut);
    boy.position.copy(end); boy.mood('calm');
  }
  async function setRound(r) {
    await Promise.all(stones.map(async s => { if (s.userData.letter) { await E.popOut(s.userData.letter, 200); s.remove(s.userData.letter); } }));
    r.keys.forEach((k, i) => { const s = stones[i], l = E.letter(k, 1.9); l.position.set(0, 1.5, .1); l.userData.lift = l.userData.below || 0; l.position.y += l.userData.lift;
      l.visible = false; l.userData.size = P ? 1.2 : 1; s.add(l); s.userData.letter = l; s.userData.key = k; s.userData.hint = false; });
    await Promise.all(stones.map((s, i) => E.wait(i * 90).then(() => E.popIn(s.userData.letter, s.userData.letter.userData.size, 380))));
  }
  async function tapped(s) {
    if (!active || s.userData.key == null) return;
    if (s.userData.key === cur.want) { active = false; answer && answer(s); return; }
    if (guided) { E.sfx.boop(); E.shake(s, .06); return; }   /* while we do one together, only the stone under the hand answers */
    active = false; mistakes++; firstTry = false; E.sfx.boop(); boy.mood('think'); s.userData.busy = true;
    await E.shake(s, .15); s.userData.busy = false; await E.say(E.nameLine(s.userData.key));
    stones.find(x => x.userData.key === cur.want).userData.hint = true;
    await E.say(E.nameLine(cur.want)); await E.say('Try again!'); await E.say(ask(cur)); boy.mood('calm'); active = true;
  }
  E.onPointer('down', e => { if (!active) return; const s = E.pickFrom(e, stones); if (s) tapped(s); });
  async function land(s) {
    stones.forEach(x => x.userData.hint = false); boy.userData.onStone = true;
    const lift = q => s.userData.up = q * 2.1;   /* the letter floats up over his head, so he never hides it */
    await Promise.all([E.tween(420, lift, E.ease.out), jump(E.worldPos(s).add(new THREE.Vector3(0, .5 * s.scale.y, .6 * s.scale.y)))]);
    E.joy(E.worldPos(s).add(new THREE.Vector3(0, 1.4, .6))); E.hop(s.userData.letter, .3); boy.mood('cheer');
    await E.say(E.nameLine(s.userData.key)); await E.wait(250);
    await Promise.all([jump(bank), E.tween(420, q => lift(1 - q))]); boy.userData.onStone = false;
    const k = s.userData.key; if (!demoing && unit.letters.includes(k) && !said.has(k)) { said.add(k); await E.sayWithMe(k); }   /* he says each new letter out loud once (RESEARCH.md) */
  }
  return async () => {
    place(); E.setProgress(ROUNDS, 0); boy.mood('wave');
    await E.say('Hop on the stones! Listen, then tap.');
    /* the demo: one hop, shown */
    const demo = rounds[0]; await setRound(demo); cur = demo; await E.say('Watch me.'); await E.say(ask(demo));
    const ds = stones.find(s => s.userData.key === demo.want), [hx, hy] = E.toScreen(E.worldPos(ds).add(new THREE.Vector3(0, 1.5 * ds.scale.y, 0)));
    E.hand.at(hx + 10, hy + 10); await E.wait(600); E.hand.hide(); await land(ds);
    demoing = false;
    /* "we do": one hop together, the hand on the right stone (RESEARCH.md, gain 3) */
    const we = rounds[ROUNDS + 1]; await setRound(we); cur = we; await E.say('Let\u2019s do one together.'); await E.say(ask(we));
    const ws = stones.find(s => s.userData.key === we.want), [wx, wy] = E.toScreen(E.worldPos(ws).add(new THREE.Vector3(0, 1.5 * ws.scale.y, 0)));
    ws.userData.hint = true; E.hand.at(wx + 10, wy + 10); guided = true; document.body.dataset.hopGuide = 1;
    const g = await new Promise(res => { answer = res; active = true; }); answer = null; E.hand.hide(); guided = false; delete document.body.dataset.hopGuide; await land(g);
    await E.say('Now you!'); document.body.dataset.hopReady = 1;
    for (let i = 1; i <= ROUNDS; i++) {
      const r = rounds[i]; firstTry = true;
      await setRound(r); cur = r;
      if (struggled && i === 1) stones.find(x => x.userData.key === r.want).userData.hint = true;
      await E.say(ask(r));
      const s = await new Promise(res => { answer = res; active = true; }); answer = null;
      await land(s); done++; E.setProgress(ROUNDS, done);
    }
    delete document.body.dataset.hopReady; cur = null;
    boy.mood('cheer'); E.confetti(new THREE.Vector3(0, 2.5, 1), 60); E.sfx.chime();
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
    return { stars, line: stars >= 2 ? 'Six hops! You know your letters!' : null };
  };
}
