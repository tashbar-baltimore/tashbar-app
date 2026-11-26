/* Kindergarten Numbers: the shared frame for every Numbers game (2.0).
   It builds the top bar (hear it again, round dots, back to the map), the start screen, the demo hand, the end screen with stars,
   saving, and helpers each game uses: say, drag-or-tap, the finger hand, amount cards, celebrations, the clapping chant.
   A game calls FR.game({ id, title, hero, rounds, demo(F), round(F, i) -> true if right the first time, bonus(F)? }).
   Tests: ?fast=1 makes everything quick; window.GAME tells a test what a right (and a wrong) move is right now. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var F = window.FR = {};
  window.GAME = { phase: 'start' };
  F.wait = NK.wait; F.word = NK.word; F.Word = NK.Word;
  F.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  F.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  F.NAMES = ['Mendy', 'Shloimy', 'Yaakov', 'Ari', 'Dovid', 'Eli', 'Avi', 'Tzvi', 'Moshe', 'Chaim'];

  /* where things sit for 1-5 (and the two groups the eye sees) */
  F.LAYOUTS = {
    0: [{ p: [], g: [[], []], say: 'None at all. Zero!' }],
    1: [{ p: [[50, 50]], g: [[0], []], say: 'Just one, all alone.' }],
    2: [{ p: [[32, 32], [68, 68]], g: [[0], [1]], say: 'One and one. Two!' }, { p: [[30, 50], [70, 50]], g: [[0], [1]], say: 'One and one. Two!' }],
    3: [{ p: [[26, 26], [50, 50], [74, 74]], g: [[0, 1], [2]], say: 'Two and one. Three!' }, { p: [[50, 28], [28, 70], [72, 70]], g: [[0], [1, 2]], say: 'One on top, two below. Three!' }],
    4: [{ p: [[30, 30], [70, 30], [30, 70], [70, 70]], g: [[0, 1], [2, 3]], say: 'Two on top, two below. Four!' }],
    5: [{ p: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], g: [[0, 1, 3, 4], [2]], say: 'Four corners, one in the middle. Five!' }, { p: [[24, 32], [50, 32], [76, 32], [37, 70], [63, 70]], g: [[0, 1, 2], [3, 4]], say: 'Three on top, two below. Five!' }]
  };
  F.parts = function (L) { var m = L.say.match(/^(.*\.) (\w+!)$/); return m ? m[1] : L.say; };

  /* ---------- page shell ---------- */
  var cfg, S = F.S = { round: 0, results: [], first: 0, rounds: 0 };
  function shell() {
    var art = document.createElement('div'); art.innerHTML = NK.ART; document.body.insertBefore(art, document.body.firstChild);
    var top = document.createElement('div'); top.className = 'top';
    top.innerHTML = '<button id="again" class="rb btn3d b-blue" aria-label="Hear it again"><svg viewBox="0 0 48 48"><path d="M8 18h8l11-9v30l-11-9H8z" fill="#fff"/><path d="M32 17c3 2 5 4.5 5 7s-2 5-5 7M36 11c5 3.5 8 8 8 13s-3 9.5-8 13" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg></button>' +
      '<div class="dots" id="dots"></div><button id="home" class="rb btn3d b-white" aria-label="Back to the map"><svg viewBox="0 0 48 48"><path d="M6 24 24 8l18 16" stroke="#2B2350" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22v18h9V30h6v10h9V22" fill="#FFC940" stroke="#2B2350" stroke-width="4" stroke-linejoin="round"/></svg></button>';
    var g = $('game'); g.insertBefore(top, g.firstChild);
    var more = document.createElement('div');
    more.innerHTML = '<div id="clap" hidden><img src="img/clapping-hands.webp" alt="" class="claphands"></div>' +
      '<svg id="hand" viewBox="0 0 100 100" aria-hidden="true"><use href="#nkHand"/></svg>' +
      '<svg class="yesbadge" id="yesbadge" viewBox="0 0 100 100"><use href="#nkStar"/></svg>' +
      '<div class="over" id="start"><h1 class="title">' + cfg.title + '</h1><div class="hero" id="hero">' + (cfg.hero || '') + '</div>' +
      '<button class="play btn3d b-green" id="play" aria-label="Play"><svg viewBox="0 0 48 48"><path d="M12 6 42 24 12 42z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg></button></div>' +
      '<div class="over" id="end" hidden><div class="stars" id="stars"></div><div class="row">' +
      '<button class="big btn3d b-sun" id="replay" aria-label="Play again"><svg viewBox="0 0 48 48"><path d="M38 24a14 14 0 1 1-4.1-9.9" stroke="#2B2350" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M36 6v10H26" stroke="#2B2350" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button class="big btn3d b-green" id="next" aria-label="Go on"><svg viewBox="0 0 48 48"><path d="M8 24h28M26 12l12 12-12 12" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>';
    while (more.firstChild) document.body.appendChild(more.firstChild);
    if (NK.fast) document.body.classList.add('fast');
    $('again').addEventListener('click', function () { NK.unlock(); $('again').classList.add('talk'); NK.again(); setTimeout(function () { $('again').classList.remove('talk'); }, 1800); });
    $('home').addEventListener('click', function () { NK.hush(); location.href = './' + (/[?&]look=1/.test(location.search) ? '?look=1' : ''); });
    $('next').addEventListener('click', function () { NK.hush(); location.href = ((S.stars < 2 && cfg.practice) ? cfg.practice : './') + (/[?&]look=1/.test(location.search) ? '?look=1' : ''); });
    $('replay').addEventListener('click', function () { NK.unlock(); $('end').hidden = true; run(false); });
    $('play').addEventListener('click', function () { NK.unlock(); $('start').hidden = true; run(true); });
    $('clap').addEventListener('pointerdown', function (e) { e.preventDefault(); NK.unlock(); S.claps = (S.claps || 0) + 1; hit(); });
  }

  /* ---------- talking ---------- */
  F.say = function (t, o) { $('again').classList.add('talk'); return NK.say(t, o).then(function () { $('again').classList.remove('talk'); }); };
  F.lock = function (on) { $('game').classList.toggle('locked', on); };
  F.dots = function () {
    var h = ''; for (var i = 0; i < S.rounds; i++) h += '<i class="' + (S.results[i] === 'ok' ? 'ok' : S.results[i] === 'fix' ? 'fix' : (i === S.round && S.playing ? 'now' : '')) + '"></i>';
    $('dots').innerHTML = h;
  };

  /* ---------- celebrations ---------- */
  F.yes = function (el, line) {
    NK.sound.yes(); var b = $('yesbadge'), r = (el || $('stage')).getBoundingClientRect(), w = b.getBoundingClientRect().width || 110;
    b.style.left = Math.max(8, r.left + r.width / 2 - w / 2) + 'px'; b.style.top = Math.max(8, r.top - w * .35) + 'px'; b.classList.add('on');
    if (el) el.classList.add('good');
    return Promise.all([F.wait(1000), line ? F.say(line) : null]).then(function () { b.classList.remove('on'); if (el) el.classList.remove('good'); });
  };
  F.oops = function (el) { NK.sound.oops(); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); setTimeout(function () { el.classList.remove('shake'); }, 500); } };

  /* ---------- the clapping chant: he taps along ---------- */
  function hit() { var c = $('clap'); NK.sound.clap(); c.classList.add('hit'); setTimeout(function () { c.classList.remove('hit'); }, 140); }
  F.chant = async function (line, stand) {
    var c = $('clap'); c.hidden = false;
    await F.say(stand ? 'Stand up! Clap with me!' : 'Tap and clap with me!');
    for (var k = 0; k < 2; k++) { await F.say(line, { noRepeat: true }); for (var b = 0; b < 3; b++) { hit(); await F.wait(420); } }
    await F.wait(200); c.hidden = true;
  };

  /* ---------- the demo hand ---------- */
  var hand;
  F.handTo = function (el, dx, dy) { var r = el.getBoundingClientRect(); hand.style.left = (r.left + r.width * (dx == null ? .5 : dx) - 20) + 'px'; hand.style.top = (r.top + r.height * (dy == null ? .5 : dy) - 8) + 'px'; return F.wait(650); };
  F.handTap = function () { hand.classList.add('tap'); return F.wait(160).then(function () { hand.classList.remove('tap'); return F.wait(120); }); };
  F.handHide = function () { hand.style.top = '110%'; };
  F.handDrag = async function (el, target) {   /* carries a copy of el to target */
    await F.handTo(el); hand.classList.add('tap');
    var r = el.getBoundingClientRect(), t = target.getBoundingClientRect(), g = el.cloneNode(true);
    g.className += ' flycopy'; g.style.cssText = 'position:fixed;z-index:58;pointer-events:none;margin:0;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;transition:left .65s ease-in-out,top .65s ease-in-out';
    document.body.appendChild(g);
    var tx = t.left + t.width / 2 - r.width / 2, ty = t.top + t.height / 2 - r.height / 2;
    requestAnimationFrame(function () { g.style.left = tx + 'px'; g.style.top = ty + 'px'; hand.style.left = (tx + r.width / 2 - 20) + 'px'; hand.style.top = (ty + r.height / 2) + 'px'; });
    await F.wait(720); hand.classList.remove('tap'); g.remove();
  };

  /* ---------- drag or tap: move a source onto a target ----------
     opts: { sources: '.selector', targets: '.selector', drop(src, tgt) } — tap a source then a target works too. */
  F.dragTap = function (opts) {
    var drag = null, picked = null;
    function srcOf(e) { var s = e.target.closest(opts.sources); return s && !s.classList.contains('done') ? s : null; }
    function tgtAt(x, y) { var best = null; document.querySelectorAll(opts.targets).forEach(function (t) { if (t.classList.contains('done')) return; var r = t.getBoundingClientRect(); if (x > r.left - 16 && x < r.right + 16 && y > r.top - 16 && y < r.bottom + 16) best = t; }); return best; }
    document.addEventListener('pointerdown', function (e) {
      if (!F.canPlay()) return; var s = srcOf(e);
      if (!s) { var t = e.target.closest(opts.targets); if (t && picked && !t.classList.contains('done')) { var p = picked; picked.classList.remove('picked'); picked = null; opts.drop(p, t); } return; }
      e.preventDefault(); drag = { el: s, x: e.clientX, y: e.clientY, g: null, id: e.pointerId };
    });
    document.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.g && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 10) {
        var r = drag.el.getBoundingClientRect(); drag.g = drag.el.cloneNode(true); drag.w = r.width; drag.h = r.height;
        drag.g.style.cssText = 'position:fixed;z-index:58;pointer-events:none;margin:0;width:' + r.width + 'px;height:' + r.height + 'px;transform:scale(1.06) rotate(-3deg);opacity:.95';
        document.body.appendChild(drag.g); drag.el.style.opacity = '.3';
      }
      if (drag.g) { drag.g.style.left = (e.clientX - drag.w / 2) + 'px'; drag.g.style.top = (e.clientY - drag.h / 2) + 'px'; }
    });
    function end(e) {
      if (!drag || e.pointerId !== drag.id) return; var d = drag; drag = null;
      if (!d.g) { if (picked) picked.classList.remove('picked'); picked = d.el === picked ? null : d.el; if (picked) { picked.classList.add('picked'); NK.sound.pop(); } return; }
      d.g.remove(); d.el.style.opacity = ''; var t = tgtAt(e.clientX, e.clientY); if (t) opts.drop(d.el, t);
    }
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', function () { if (drag && drag.g) { drag.g.remove(); drag.el.style.opacity = ''; } drag = null; });
  };
  F.canPlay = function () { return GAME.phase === 'answer'; };

  /* ---------- amount cards: n things in a shape ---------- */
  var KIND = { apple: 'nkApple', orange: 'nkOrange', pear: 'nkPear', candle: 'nkCandle' };
  F.card = function (n, kind, L, cls) {
    L = L || F.pick(F.LAYOUTS[n]); var d = document.createElement('div'); d.className = 'qcard ' + (cls || '') + (kind === 'dots' ? ' dice' : ''); d.dataset.n = n; d.dataset.kind = kind;
    if (kind === 'fingers') { var h = F.fingers(n, false); h.el.classList.add('fh'); d.appendChild(h.el); return d; }
    d.L = L;
    var h2 = ''; L.p.forEach(function (p, i) {
      if (kind === 'dots') h2 += '<i class="dot" data-i="' + i + '" style="left:' + p[0] + '%;top:' + p[1] + '%"></i>';
      else h2 += '<svg class="q" data-i="' + i + '" viewBox="0 0 100 100" style="left:' + p[0] + '%;top:' + p[1] + '%' + (kind === 'candle' ? ';width:46%;height:60%' : '') + '"><use href="#' + KIND[kind] + '"/></svg>';
    });
    d.innerHTML = h2; return d;
  };
  /* light up the two groups of a card and say the shape (whole = with the total) */
  F.showShape = async function (card, whole, silent) {
    var L = card.L, items = card.querySelectorAll('[data-i]'), A = [], B = [];
    if (!L) {   /* a finger card: light the hand and say it */
      var n = +card.dataset.n; card.classList.add('glow');
      await Promise.all([F.wait(1400), silent ? null : F.say(whole ? F.Word(n) + (n === 1 ? ' finger.' : ' fingers.') : 'Look at the fingers.', { noRepeat: true })]);
      card.classList.remove('glow'); return;
    }
    if (L) { L.g[0].forEach(function (i) { items[i] && A.push(items[i]); }); (L.g[1] || []).forEach(function (i) { items[i] && B.push(items[i]); }); }
    A.forEach(function (x) { x.style.filter = 'drop-shadow(0 0 8px #FFD23D) drop-shadow(0 0 14px #FFB000)'; x.style.transform = 'translate(-50%,-50%) scale(1.2)'; });
    B.forEach(function (x) { x.style.filter = 'drop-shadow(0 0 8px #5FD0FF) drop-shadow(0 0 14px #1E9CE8)'; x.style.transform = 'translate(-50%,-50%) scale(1.2)'; });
    await Promise.all([F.wait(1400), silent ? null : F.say(whole ? L.say : F.parts(L), { noRepeat: true })]);
    A.concat(B).forEach(function (x) { x.style.filter = ''; x.style.transform = ''; });
  };

  /* ---------- the finger hand ----------
     F.fingers(n, interactive) -> { el, set(n), count(), onChange }. Fingers go up in counting order: pointer, middle, ring, pinky, thumb. */
  var FING = [ /* x, y, w, h, rotate (index order: pointer, middle, ring, pinky, thumb) */
    [78, 18, 22, 86, -4], [104, 8, 22, 96, 0], [130, 16, 22, 88, 5], [154, 36, 20, 70, 11], [46, 92, 22, 58, -40]];
  F.fingers = function (n, interactive) {
    var el = document.createElement('div'); el.className = 'fhand' + (interactive ? '' : ' locked');
    var g = '';
    FING.forEach(function (f, i) {
      g += '<g class="fg down" data-f="' + i + '" style="transform-origin:' + (f[0] + f[2] / 2) + 'px ' + (f[1] + f[3]) + 'px"><g transform="rotate(' + f[4] + ' ' + (f[0] + f[2] / 2) + ' ' + (f[1] + f[3]) + ')">' +
        '<rect class="skin" x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + (f[3] + 14) + '" rx="' + f[2] / 2 + '" fill="url(#nkSkin)" stroke="#7A4A2B" stroke-width="4"/>' +
        '<rect x="' + (f[0] + 5) + '" y="' + (f[1] + 4) + '" width="' + (f[2] - 10) + '" height="12" rx="5" fill="#FFF6EC" stroke="#E8B48A" stroke-width="1.5"/>' +
        '<rect x="' + (f[0] + 4) + '" y="' + (f[1] + 16) + '" width="4" height="' + Math.max(10, f[3] * .4) + '" rx="2" fill="#fff" opacity=".55"/></g></g>';
    });
    el.innerHTML = '<svg viewBox="20 0 170 230">' + g + '<path d="M62 98 C 60 84, 176 80, 176 104 L 178 170 C 178 206, 150 226, 118 226 C 84 226, 62 204, 62 172 Z" fill="url(#nkSkin)" stroke="#7A4A2B" stroke-width="4.5"/>' +
      '<g fill="none" stroke="#E8B48A" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M80 100 q 9 -6 18 0"/><path d="M104 96 q 9 -6 18 0"/><path d="M128 99 q 9 -6 18 0"/><path d="M151 104 q 8 -5 16 0"/></g>' +
      '<path d="M72 112 C 70 104, 166 100, 166 112" stroke="#E8B48A" stroke-width="3" fill="none" opacity=".7"/><ellipse cx="96" cy="170" rx="10" ry="22" fill="#fff" opacity=".35"/></svg>';
    var fs = el.querySelectorAll('.fg'), api = { el: el, onChange: null };
    function mark() { el.classList.toggle('empty', api.count() === 0); }
    api.set = function (k) { fs.forEach(function (f, i) { f.classList.toggle('down', i >= k); }); mark(); };
    api.count = function () { var c = 0; fs.forEach(function (f) { if (!f.classList.contains('down')) c++; }); return c; };
    api.lock = function (on) { el.classList.toggle('locked', on); };
    api.finger = function (i) { return fs[i]; };
    if (interactive) el.addEventListener('pointerdown', function (e) {
      if (el.classList.contains('locked')) return; var f = e.target.closest('.fg'); e.preventDefault();
      if (!f || f.classList.contains('down')) { f = null; for (var i = 0; i < 5; i++) if (fs[i].classList.contains('down')) { f = fs[i]; break; } if (!f) return; }   /* tap the hand: the next finger goes up */
      f.classList.toggle('down'); NK.sound[f.classList.contains('down') ? 'back' : 'pop'](); mark(); if (api.onChange) api.onChange(api.count());
    });
    if (interactive) {
      var dn = document.createElement('button'); dn.className = 'fdown btn3d b-sun'; dn.setAttribute('aria-label', 'Put one finger down');
      dn.innerHTML = '<svg viewBox="0 0 48 48"><path d="M24 10v26M13 26l11 11 11-11" stroke="#2B2350" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      dn.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); if (el.classList.contains('locked')) return;
        for (var i = 4; i >= 0; i--) if (!fs[i].classList.contains('down')) { fs[i].classList.add('down'); NK.sound.back(); mark(); if (api.onChange) api.onChange(api.count()); return; } });
      el.appendChild(dn);
    }
    api.set(n || 0); return api;
  };
  /* the fingers he should tap to show n, starting from what is up now */
  /* the taps that show n: tap the hand to raise the next finger, tap a raised finger to fold it */
  F.fingerTaps = function (h, n, root) {
    var out = [], c = h.count();
    for (; c > n; c--) out.push({ tap: root + ' .fdown' });
    for (; c < n; c++) out.push({ tap: root + ' .fhand' });
    return out;
  };
  F.fingerMoves = function (h, n) { var out = [], c = h.count(); for (var i = 0; i < 5; i++) { var up = !h.finger(i).classList.contains('down'), want = i < n; if (up !== want) out.push(i); } return out; };

  /* ---------- the flow ---------- */
  async function run(first) {
    S.round = 0; S.results = []; S.first = 0; S.rounds = cfg.rounds; S.playing = true; F.dots();
    if (cfg.reset) cfg.reset(F, !first, !first && S.stars < 2);
    if (first && cfg.chant) await F.chant(cfg.chant);
    if (first && cfg.demo) { GAME.phase = 'demo'; F.lock(true); await cfg.demo(F); F.handHide(); await F.say('Now you!'); }
    for (S.round = 0; S.round < cfg.rounds; S.round++) {
      F.dots(); if (cfg.half && S.round === Math.floor(cfg.rounds / 2)) await cfg.half(F);
      var right = await cfg.round(F, S.round);
      S.results[S.round] = right ? 'ok' : 'fix'; if (right) S.first++; F.dots();
    }
    S.playing = false;
    if (cfg.bonus && S.first >= cfg.rounds - 1) { GAME.phase = 'bonus'; var bs = cfg.bonusSay != null ? cfg.bonusSay : 'Bonus! Super quick!'; if (bs) await F.say(bs); await cfg.bonus(F); }
    finish();
  }
  async function finish() {
    GAME.phase = 'end'; F.lock(true);
    var stars = S.stars = cfg.stars ? cfg.stars(S) : NK.starsFor(S.first, cfg.rounds); S.saved = NK.save(cfg.id, stars);
    var h = ''; for (var i = 0; i < 3; i++) h += '<svg class="' + (i < stars ? '' : 'off') + '" viewBox="0 0 100 100"><use href="#nkStar"/></svg>';
    $('stars').innerHTML = h; $('next').hidden = stars < 2 && !cfg.practice; $('end').hidden = false; NK.sound.win(); burst();
    $('stars').querySelectorAll('svg').forEach(function (s, i) { setTimeout(function () { s.classList.add('on'); }, 150 + i * 250); });
    await F.say(cfg.endSay ? cfg.endSay(stars) : stars === 3 ? 'Wow! Three stars!' : stars === 2 ? 'You did it! Two stars!' : 'Nice try! Let\'s play once more.');
    GAME.phase = 'done';
  }
  function burst() {
    var cols = ['#FFC93D', '#22B45E', '#2FB5E8', '#FF4D3D', '#FF8FB1', '#A779FF'];
    for (var i = 0; i < 28; i++) { var c = document.createElement('i'); c.style.cssText = 'left:50%;top:40%;background:' + cols[i % 6] + ';--dx:' + Math.round(Math.random() * 700 - 350) + 'px;--dy:' + Math.round(Math.random() * 500 - 150) + 'px';
      var w = document.createElement('div'); w.className = 'burst'; w.appendChild(c); document.body.appendChild(w); setTimeout(function (x) { x.remove(); }.bind(null, w), 1700); }
  }

  F.game = function (c) {
    cfg = c; shell(); hand = $('hand');
    if (cfg.init) cfg.init(F);
    F.dots();
  };
})();
