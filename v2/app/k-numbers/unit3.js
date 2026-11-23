/* Kindergarten Numbers, Unit 3 helpers ("Counting things: touch each once, and the last number tells how many").
   Used by opener3, count3, giveme, mixup, twice, check3 and review3. Adds two original drawings (a siddur and a challah roll),
   the two-hand answer (0-10 fingers), places to put things (a neat line or a loose bunch), and the shared answer step:
   he shows how many on the hands and presses the check; a first miss counts them together ("the last number tells how many"),
   a second miss also says how to fix the fingers. */
(function () {
  var U = window.U3 = {};
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- drawings ---------- */
  var ART = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="u3Cover" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4C6FE0"/><stop offset=".55" stop-color="#2442A8"/><stop offset="1" stop-color="#16296E"/></linearGradient>' +
    '<linearGradient id="u3Gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3A6"/><stop offset=".5" stop-color="#FFCC1F"/><stop offset="1" stop-color="#D98200"/></linearGradient>' +
    '<radialGradient id="u3RollG" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFE2A0"/><stop offset=".4" stop-color="#E9A649"/><stop offset=".8" stop-color="#B8691C"/><stop offset="1" stop-color="#83430D"/></radialGradient>' +
    /* a siddur: a blue book with gold edges and a gold frame on the cover (no letters) */
    '<symbol id="u3Siddur" viewBox="0 0 100 100"><ellipse cx="50" cy="94" rx="30" ry="4.5" fill="url(#nkShadow)"/>' +
    '<rect x="24" y="10" width="54" height="80" rx="6" fill="#F4E7C4" stroke="#7A5A1A" stroke-width="2.5"/>' +
    '<rect x="20" y="8" width="54" height="80" rx="7" fill="url(#u3Cover)" stroke="#0F1E52" stroke-width="3"/>' +
    '<rect x="20" y="8" width="10" height="80" rx="5" fill="#16296E" opacity=".55"/>' +
    '<rect x="34" y="20" width="32" height="56" rx="5" fill="none" stroke="url(#u3Gold)" stroke-width="3.5"/>' +
    '<path d="M50 34 L58 48 L50 62 L42 48 Z" fill="url(#u3Gold)" stroke="#B8730A" stroke-width="1.5"/>' +
    '<rect x="72" y="14" width="5" height="70" rx="2" fill="url(#u3Gold)"/><rect x="38" y="12" width="5" height="22" rx="2" fill="#fff" opacity=".35"/></symbol>' +
    /* a braided challah roll */
    '<symbol id="u3Roll" viewBox="0 0 100 100"><ellipse cx="50" cy="88" rx="38" ry="6" fill="url(#nkShadow)"/>' +
    '<path d="M12 62 C 10 40, 30 30, 50 32 C 70 30, 90 40, 88 62 C 88 80, 70 86, 50 86 C 30 86, 12 80, 12 62 Z" fill="url(#u3RollG)" stroke="#7A3D0A" stroke-width="3"/>' +
    '<path d="M24 44 C 32 56, 30 70, 22 78 M42 34 C 50 48, 50 70, 42 84 M60 34 C 68 48, 68 70, 60 84 M78 44 C 84 56, 84 70, 78 78" stroke="#8E4A10" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>' +
    '<path d="M28 46 C 34 50, 36 56, 34 62 M46 40 C 52 46, 54 54, 52 62 M64 40 C 70 46, 72 54, 70 62" stroke="#FFE7B0" stroke-width="3" fill="none" opacity=".8" stroke-linecap="round"/>' +
    '<g fill="#FFF8E6"><ellipse cx="34" cy="52" rx="1.6" ry="2.4"/><ellipse cx="50" cy="46" rx="1.6" ry="2.4" transform="rotate(30 50 46)"/><ellipse cx="62" cy="56" rx="1.6" ry="2.4"/><ellipse cx="72" cy="48" rx="1.6" ry="2.4" transform="rotate(-30 72 48)"/><ellipse cx="42" cy="62" rx="1.6" ry="2.4" transform="rotate(20 42 62)"/></g></symbol>' +
    '</defs></svg>';
  U.addArt = function () { var d = document.createElement('div'); d.innerHTML = ART; document.body.appendChild(d.firstChild); };
  U.KIND = { siddur: ['u3Siddur', 'siddur', 'siddurim'], roll: ['u3Roll', 'challah roll', 'challah rolls'], apple: ['nkApple', 'apple', 'apples'], orange: ['nkOrange', 'orange', 'oranges'], pear: ['nkPear', 'pear', 'pears'] };
  U.name = function (kind, n) { return n === 1 ? U.KIND[kind][1] : U.KIND[kind][2]; };
  U.svg = function (kind, cls, extra) { return '<svg class="' + (cls || '') + '"' + (extra || '') + ' viewBox="0 0 100 100"><use href="#' + U.KIND[kind][0] + '"/></svg>'; };

  /* ---------- where things go: a neat line, or a loose bunch (in % of the box) ---------- */
  U.line = function (n, y) { var out = [], gap = Math.min(20, 86 / Math.max(1, n)), x0 = 50 - gap * (n - 1) / 2; for (var i = 0; i < n; i++) out.push([x0 + gap * i, y == null ? 62 : y]); return out; };
  U.bunch = function (n, box) {
    box = box || [12, 88, 36, 88]; var pts = [], tries = 0, d = n > 8 ? 13 : 16;
    while (pts.length < n && tries++ < 3000) { var x = box[0] + Math.random() * (box[1] - box[0]), y = box[2] + Math.random() * (box[3] - box[2]);
      if (pts.every(function (q) { return Math.hypot(q[0] - x, (q[1] - y) * 1.1) > d; })) pts.push([x, y]); if (tries % 600 === 0) d -= 1.5; }
    return pts;
  };

  /* ---------- two hands: 0-10 fingers (left hand first, then right) ---------- */
  U.hands = function (box) {
    var a = FR.fingers(0, true), b = FR.fingers(0, true); a.el.classList.add('h0'); b.el.classList.add('h1'); b.el.style.transform = 'scaleX(-1)';
    box.innerHTML = ''; box.appendChild(a.el); box.appendChild(b.el);
    var api = { a: a, b: b, onChange: null };
    api.count = function () { return a.count() + b.count(); };
    api.set = function (n) { a.set(Math.min(5, n)); b.set(Math.max(0, n - 5)); };
    api.lock = function (on) { a.lock(on); b.lock(on); };
    api.moves = function (n) {
      return FR.fingerMoves(a, Math.min(5, n)).map(function (i) { return { tap: '#hands .h0 .fg[data-f="' + i + '"]' }; })
        .concat(FR.fingerMoves(b, Math.max(0, n - 5)).map(function (i) { return { tap: '#hands .h1 .fg[data-f="' + i + '"]' }; }));
    };
    a.onChange = b.onChange = function () { if (api.onChange) api.onChange(api.count()); };
    return api;
  };

  /* ---------- count things out loud, lighting each one ---------- */
  U.countAlong = async function (els, opts) {
    opts = opts || {};
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add('lit'); NK.sound.pop();
      await FR.say(NK.Word(i + 1) + (i === els.length - 1 ? '.' : ','), { noRepeat: true });
      if (!opts.keep) els[i].classList.remove('lit');
    }
  };

  /* ---------- the answer step: show how many on the hands, press check ----------
     opts: { n, H, explain(F, misses) async, check (mastery check: explain once, then move on), praise } -> Promise(first try right) */
  U.answer = function (F, opts) {
    return new Promise(function (res) {
      var H = opts.H, misses = 0, btn = $('check');
      function ready() { btn.classList.toggle('dim', H.count() === 0); btn.classList.toggle('ready', H.count() > 0 && GAME.phase === 'answer'); }
      function hooks() {
        GAME.right = function () { return H.moves(opts.n).concat([{ tap: '#check' }]); };
        GAME.wrong = function () { var w = opts.n < 10 ? opts.n + 1 : opts.n - 1; return H.moves(w).concat([{ tap: '#check' }]); };
      }
      async function press() {
        NK.unlock(); if (GAME.phase !== 'answer') return;
        var have = H.count(); if (!have && opts.n) { F.say('Raise some fingers first.'); return; }
        GAME.phase = 'busy'; F.lock(true); H.lock(true);
        if (have === opts.n) {
          btn.onclick = null; H.onChange = null;
          await F.yes($('hands'), opts.praise ? opts.praise(misses) : misses ? 'Yes! Now you have ' + F.word(opts.n) + '.' : F.pick(['Yes! ' + F.Word(opts.n) + '!', 'Right! ' + F.Word(opts.n) + '!']));
          res(misses === 0); return;
        }
        F.oops($('hands')); misses++;
        if (opts.explain) await opts.explain(F, misses);
        if (opts.check) { btn.onclick = null; H.onChange = null; await F.say("Let's look at the next one."); res(false); return; }
        if (misses >= 2) { var d = opts.n - have; await F.say(d > 0 ? 'Put ' + F.word(d) + ' more up.' : 'Put ' + F.word(-d) + ' down.'); }
        else await F.say('Fix your fingers.');
        GAME.phase = 'answer'; F.lock(false); H.lock(false); ready(); hooks();
      }
      H.set(0); H.lock(false); H.onChange = ready; btn.onclick = press;
      GAME.phase = 'answer'; F.lock(false); ready(); hooks();
      if (opts.ask) F.say(opts.ask, { repeat: opts.ask });
    });
  };
})();

/* ---------- the two kinds of rounds most Unit 3 pages use ---------- */
(function () {
  var U = window.U3, $ = function (id) { return document.getElementById(id); };
  function place(el, p) { el.style.left = p[0] + '%'; el.style.top = p[1] + '%'; }
  U.place = place;
  U.size = function (n) { return Math.max(8, Math.min(18, 86 / Math.max(1, n) - 1.5)); };
  U.clear = function () { [].slice.call($('scene').querySelectorAll('.it, .plate3, .shelf')).forEach(function (e) { e.remove(); }); };
  U.put = function (kind, p, w, i, cls) {
    var d = document.createElement('div'); d.className = 'it ' + (cls || ''); d.dataset.i = i; d.innerHTML = U.svg(kind);
    d.style.width = w + '%'; d.style.aspectRatio = '1'; place(d, p); $('scene').appendChild(d); return d;
  };

  /* TOUCH AND COUNT: he taps each thing; it hops to the shelf as the voice counts; then he shows how many on the hands.
     o: { n, kind, line (neat line, else a loose bunch), H, check, quiet (no counting voice: mastery check) } */
  U.countRound = function (F, o) {
    return new Promise(async function (res) {
      U.clear(); $('hands').hidden = false; o.H.set(0); o.H.lock(true);
      var sh = document.createElement('div'); sh.className = 'shelf'; $('scene').appendChild(sh);
      var w = U.size(o.n), pts = o.line ? U.line(o.n, 72) : U.bunch(o.n, [10, 90, 58, 90]), slots = U.line(o.n, 25), els = [], moved = 0, busy = false, shelfEls = [];
      for (var i = 0; i < o.n; i++) els.push(U.put(o.kind, pts[i], w, i, 'cnt'));
      function hooks() { var rest = els.filter(function (e) { return !e.classList.contains('done'); }); GAME.right = rest.length ? function () { return [{ tap: '#scene .it[data-i="' + rest[0].dataset.i + '"]' }]; } : null; GAME.wrong = null; }
      async function tap(e) {
        var it = e.target.closest('.it.cnt'); if (!it || it.classList.contains('done') || busy || GAME.phase !== 'answer') return;
        busy = true; GAME.phase = 'busy'; it.classList.add('done'); place(it, slots[moved]); shelfEls.push(it); moved++; NK.sound.pop();
        if (!o.quiet) await F.say(F.Word(moved) + (moved === o.n ? '!' : ''), { noRepeat: true }); else await F.wait(150);
        busy = false;
        if (moved < o.n) { GAME.phase = 'answer'; hooks(); return; }
        $('scene').removeEventListener('pointerdown', tap);
        if (!o.quiet) await F.say('The last number tells how many.');
        var first = await U.answer(F, { n: o.n, H: o.H, check: o.check, ask: 'How many ' + U.name(o.kind, 2) + '?',
          explain: async function (F) { await F.say("Let's count them together."); await U.countAlong(shelfEls); await F.say(F.Word(o.n) + ' ' + U.name(o.kind, o.n) + '. The last number!'); } });
        res(first);
      }
      $('scene').addEventListener('pointerdown', tap);
      GAME.phase = 'answer'; F.lock(false); hooks();
      if (o.intro !== false) await F.say(o.quiet ? 'Count them. Tap each one.' : 'Tap each one. Count with me!', { repeat: 'Tap each one. Count with me!' });
    });
  };

  /* GIVE ME: Bubby needs n challah rolls. He moves rolls from the pile to Bubby's plate (tap or drag), then presses check.
     o: { n, check (mastery: no counting voice, explain once), intro } */
  var SLOTS = [[30, 20], [40, 20], [50, 20], [60, 20], [70, 20], [30, 35], [40, 35], [50, 35], [60, 35], [70, 35]];
  var PILE = [[12, 64], [24, 64], [36, 64], [48, 64], [60, 64], [72, 64], [84, 64], [18, 84], [31, 84], [44, 84], [57, 84], [70, 84]];
  U.giveRound = function (F, o) {
    return new Promise(async function (res) {
      U.clear(); $('hands').hidden = true; var btn = $('check');
      var pl = document.createElement('div'); pl.className = 'plate3'; $('scene').appendChild(pl);
      var total = Math.min(12, Math.max(10, o.n + 2)), rolls = [], onPlate = [], misses = 0;
      for (var i = 0; i < total; i++) rolls.push(U.put('roll', PILE[i], 10.5, i, 'pile'));
      function ready() { btn.classList.toggle('dim', !onPlate.length); btn.classList.toggle('ready', onPlate.length > 0 && GAME.phase === 'answer'); }
      function layout() { onPlate.forEach(function (r, k) { place(r, SLOTS[k]); }); rolls.filter(function (r) { return onPlate.indexOf(r) < 0; }).forEach(function (r) { place(r, PILE[+r.dataset.i]); }); }
      function hooks() {
        var free = rolls.filter(function (r) { return onPlate.indexOf(r) < 0; }), d = o.n - onPlate.length, acts = [], k;
        for (k = 0; k < d; k++) acts.push({ tap: '#scene .it[data-i="' + free[k].dataset.i + '"]' });
        for (k = 0; k < -d; k++) acts.push({ tap: '#scene .it[data-i="' + onPlate[onPlate.length - 1 - k].dataset.i + '"]' });
        GAME.right = function () { return acts.concat([{ tap: '#check' }]); };
        GAME.wrong = d >= 0 && free.length > d ? function () { return acts.concat([{ tap: '#scene .it[data-i="' + free[d].dataset.i + '"]' }, { tap: '#check' }]); } : null;
      }
      function add(r) { if (onPlate.indexOf(r) >= 0 || onPlate.length >= 10) return; onPlate.push(r); layout(); NK.sound.pop(); if (!o.check) F.say(F.Word(onPlate.length), { noRepeat: true }); ready(); hooks(); }
      function back(r) { var k = onPlate.indexOf(r); if (k < 0) return; onPlate.splice(k, 1); layout(); NK.sound.back(); ready(); hooks(); }
      var drag = null;
      function down(e) { if (GAME.phase !== 'answer') return; var r = e.target.closest('.it'); if (!r) return; e.preventDefault(); drag = { r: r, x: e.clientX, y: e.clientY, moved: false, id: e.pointerId }; }
      function move(e) { if (!drag || e.pointerId !== drag.id) return; if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 10) return;
        drag.moved = true; drag.r.classList.add('drag'); var b = $('scene').getBoundingClientRect(); place(drag.r, [(e.clientX - b.left) / b.width * 100, (e.clientY - b.top) / b.height * 100]); }
      function up(e) { if (!drag || e.pointerId !== drag.id) return; var d = drag; drag = null; d.r.classList.remove('drag');
        var onIt = onPlate.indexOf(d.r) >= 0;
        if (!d.moved) { if (onIt) back(d.r); else add(d.r); return; }
        var p = pl.getBoundingClientRect(), inPlate = e.clientX > p.left && e.clientX < p.right && e.clientY > p.top && e.clientY < p.bottom + 20;
        if (inPlate && !onIt) add(d.r); else if (!inPlate && onIt) back(d.r); else layout(); }
      function stop() { $('scene').removeEventListener('pointerdown', down); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); btn.onclick = null; }
      async function press() {
        NK.unlock(); if (GAME.phase !== 'answer') return; if (!onPlate.length) { F.say('Put rolls on the plate first.'); return; }
        GAME.phase = 'busy'; F.lock(true);
        if (onPlate.length === o.n) { stop(); await F.yes(pl, misses ? 'Yes! Now Bubby has ' + F.word(o.n) + '.' : F.pick(['Yes! ' + F.Word(o.n) + ' rolls for Bubby!', 'Thank you! ' + F.Word(o.n) + ' rolls!'])); res(misses === 0); return; }
        F.oops(pl); misses++; var have = onPlate.length;
        await F.say("Let's count them."); await U.countAlong(onPlate);
        await F.say('You have ' + F.word(have) + '. Bubby needs ' + F.word(o.n) + '.');
        if (o.check) { stop(); await F.say("Let's look at the next one."); res(false); return; }
        if (misses >= 2) { var d = o.n - have; await F.say(d > 0 ? 'Put ' + F.word(d) + ' more on.' : 'Take ' + F.word(-d) + ' off.'); }
        else await F.say('Fix the plate.');
        GAME.phase = 'answer'; F.lock(false); ready(); hooks();
      }
      $('scene').addEventListener('pointerdown', down); document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); btn.onclick = press;
      GAME.phase = 'answer'; F.lock(false); ready(); hooks();
      if (o.intro !== false) await F.say('Bubby needs ' + F.word(o.n) + ' challah ' + (o.n === 1 ? 'roll.' : 'rolls.'), { repeat: 'Bubby needs ' + F.word(o.n) + ' challah rolls. Put them on the plate.' });
    });
  };
})();
