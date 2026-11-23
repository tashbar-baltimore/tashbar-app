/* Kindergarten Numbers, Unit 5 (numbers 6-10: five and some more): the tools its games share.
   U5.frame  — a glossy ten-frame (2 rows of 5). Interactive: tap an empty box to add a counter (fills in order), tap a full one to take the last away.
   U5.rack   — a bead rack (rekenrek): 2 rods of 10 beads, 5 red then 5 white. Tap or slide a bead: it and every bead
               before it slide over together, in one move. Tap a moved bead: it and the ones after it slide back.
   U5.hands  — two big hands for 0-10 (first hand five, then the second hand).
   U5.tracer — trace a big rounded numeral 6-10 along its road, starting at the green dot.
   All need kit.js and frame.js first. */
(function () {
  var U5 = window.U5 = {};
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- ten-frame ---------- */
  U5.frame = function (n, interactive) {
    var el = document.createElement('div'); el.className = 'tf' + (interactive ? ' live' : '');
    var h = '<div class="tfboard">';
    for (var i = 0; i < 10; i++) h += '<div class="cell" data-i="' + i + '"><i class="ctr"></i></div>';
    el.innerHTML = h + '</div>';
    var cells = el.querySelectorAll('.cell'), api = { el: el, onChange: null, n: 0 };
    api.set = function (k) { api.n = k; cells.forEach(function (c, i) { c.classList.toggle('on', i < k); }); };
    api.count = function () { return api.n; };
    api.cell = function (i) { return cells[i]; };
    api.lock = function (on) { el.classList.toggle('locked', on); };
    api.glow = function (on) { el.classList.toggle('glowrows', on); };
    if (interactive) el.addEventListener('pointerdown', function (e) {
      var c = e.target.closest('.cell'); if (!c || el.classList.contains('locked')) return; e.preventDefault();
      var i = +c.dataset.i;
      if (i < api.n) { api.set(api.n - 1); NK.sound.back(); } else if (api.n < 10) { api.set(api.n + 1); NK.sound.pop(); cells[api.n - 1].classList.add('land'); setTimeout(function () { cells[api.n - 1] && cells[api.n - 1].classList.remove('land'); }, 350); }
      if (api.onChange) api.onChange(api.n);
    });
    /* taps that make k (for tests and the demo) */
    api.moves = function (k) { var out = []; if (k > api.n) for (var j = 0; j < k - api.n; j++) out.push(api.n + j); else for (var m = 0; m < api.n - k; m++) out.push(0); return out; };
    api.set(n || 0); return api;
  };

  /* ---------- bead rack ---------- */
  U5.rack = function (interactive) {
    var el = document.createElement('div'); el.className = 'rack' + (interactive ? ' live' : '');
    var h = '<div class="rframe"><div class="post l"></div><div class="post r"></div>';
    for (var r = 0; r < 2; r++) { h += '<div class="rod" data-r="' + r + '"><i class="wire"></i>'; for (var i = 0; i < 10; i++) h += '<b class="bead' + (i < 5 ? ' red' : ' white') + '" data-r="' + r + '" data-i="' + i + '"></b>'; h += '</div>'; }
    el.innerHTML = h + '</div>';
    var api = { el: el, pushed: [0, 0], onChange: null };
    function place() {
      el.querySelectorAll('.bead').forEach(function (b) {
        var r = +b.dataset.r, i = +b.dataset.i, left = i < api.pushed[r];
        b.style.left = left ? 'calc(' + (i * 6.6) + '% + 2%)' : 'calc(' + (100 - (10 - i) * 6.6) + '% - 2%)';
        b.classList.toggle('moved', left);
      });
    }
    api.count = function () { return api.pushed[0] + api.pushed[1]; };
    api.set = function (a, b) { api.pushed = [a || 0, b || 0]; place(); };
    api.lock = function (on) { el.classList.toggle('locked', on); };
    api.tap = function (r, i) { var p = api.pushed[r]; api.pushed[r] = i >= p ? i + 1 : i; place(); NK.sound[api.pushed[r] > p ? 'pop' : 'back'](); if (api.onChange) api.onChange(api.count()); };
    api.bead = function (r, i) { return el.querySelector('.bead[data-r="' + r + '"][data-i="' + i + '"]'); };
    /* taps that make k on the top rod (bottom rod back to 0) */
    api.moves = function (k) { var out = []; if (api.pushed[1] > 0) out.push([1, 0]); if (api.pushed[0] !== k) out.push(k > api.pushed[0] ? [0, k - 1] : [0, k]); return out; };
    if (interactive) {
      var down = null;
      el.addEventListener('pointerdown', function (e) {   /* a tap anywhere on a rod picks the nearest bead (big target for small fingers) */
        var b = e.target.closest('.bead'), rod = e.target.closest('.rod');
        if (!b && rod) { var best = null, bd = 1e9; rod.querySelectorAll('.bead').forEach(function (x) { var r = x.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - e.clientX); if (d < bd) { bd = d; best = x; } }); b = best; }
        if (!b || el.classList.contains('locked')) return; e.preventDefault(); down = b; });
      document.addEventListener('pointerup', function () { if (!down) return; var b = down; down = null; if (el.classList.contains('locked')) return; api.tap(+b.dataset.r, +b.dataset.i); });
    }
    api.set(0, 0); return api;
  };

  /* ---------- two hands (0-10) ---------- */
  U5.hands = function (n, interactive) {
    var el = document.createElement('div'); el.className = 'hands2';
    var a = FR.fingers(0, interactive), b = FR.fingers(0, interactive);
    a.el.classList.add('h0', 'mirror'); b.el.classList.add('h1'); el.appendChild(a.el); el.appendChild(b.el);
    var api = { el: el, onChange: null, hands: [a, b] };
    function ch() { if (api.onChange) api.onChange(api.count()); }
    a.onChange = ch; b.onChange = ch;
    api.set = function (k) { a.set(Math.min(5, k)); b.set(Math.max(0, k - 5)); };
    api.count = function () { return a.count() + b.count(); };
    api.lock = function (on) { a.lock(on); b.lock(on); };
    api.moves = function (k, sel) {
      var out = []; FR.fingerMoves(a, Math.min(5, k)).forEach(function (i) { out.push({ tap: sel + ' .h0 .fg[data-f="' + i + '"]' }); });
      FR.fingerMoves(b, Math.max(0, k - 5)).forEach(function (i) { out.push({ tap: sel + ' .h1 .fg[data-f="' + i + '"]' }); }); return out;
    };
    api.set(n || 0); return api;
  };

  /* ---------- the numeral tracer ---------- */
  U5.NUMERALS = {
    6: { strokes: ['M138 42 C 92 44, 62 92, 62 160 C 62 206, 86 228, 110 228 C 140 228, 158 204, 158 176 C 158 146, 138 126, 110 126 C 86 126, 66 140, 62 160'], rhyme: 'Down and around. Six has a loop!' },
    7: { strokes: ['M52 52 L 150 52 L 92 228'], rhyme: 'Across the top, then down. Seven!' },
    8: { strokes: ['M100 130 C 62 122, 62 50, 100 48 C 138 50, 138 122, 100 130 C 52 140, 52 226, 100 228 C 148 226, 148 140, 100 130'], rhyme: 'Make an S, then go back up. Eight!' },
    9: { strokes: ['M148 96 C 148 62, 126 46, 100 46 C 72 46, 52 66, 52 96 C 52 124, 74 140, 100 140 C 124 140, 148 126, 148 96 L 148 228'], rhyme: 'A loop and a line. Nine!' },
    10: { strokes: ['M42 76 L 70 52 L 70 228', 'M146 52 C 118 52, 104 92, 104 140 C 104 190, 118 228, 146 228 C 174 228, 188 190, 188 140 C 188 92, 174 52, 146 52'], rhyme: 'A one and a zero. Ten!' }
  };
  U5.tracer = function (n) {
    var spec = U5.NUMERALS[n], el = document.createElement('div'); el.className = 'tracer';
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 220 270'); el.appendChild(svg);
    var api = { el: el, n: n, stroke: 0, onDone: null, onOff: null, done: false }, cur = 0, samples = [], prog, head, startDot, len, track = false, warned = false;
    function mk(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; }
    spec.strokes.forEach(function (d) { mk('path', { d: d, fill: 'none', stroke: '#C9D9EE', 'stroke-width': 40, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'class': 'road' }); });
    spec.strokes.forEach(function (d) { mk('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 5, 'stroke-dasharray': '2 12', 'stroke-linecap': 'round' }); });
    var done = [];
    function setup() {
      var d = spec.strokes[api.stroke]; prog = mk('path', { d: d, fill: 'none', stroke: 'url(#u5ink)', 'stroke-width': 30, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      len = prog.getTotalLength(); samples = []; for (var s = 0; s <= 60; s++) { var p = prog.getPointAtLength(len * s / 60); samples.push([p.x, p.y]); }
      prog.style.strokeDasharray = len + ' ' + len; prog.style.strokeDashoffset = len; cur = 0; warned = false;
      if (startDot) startDot.remove(); if (head) head.remove();
      startDot = mk('circle', { cx: samples[0][0], cy: samples[0][1], r: 15, fill: '#22B45E', stroke: '#fff', 'stroke-width': 5, 'class': 'startdot' });
      head = mk('circle', { cx: samples[0][0], cy: samples[0][1], r: 9, fill: '#FFD23D', stroke: '#C26A00', 'stroke-width': 3 });
    }
    function show() { prog.style.strokeDashoffset = len * (1 - cur / 60); head.setAttribute('cx', samples[cur][0]); head.setAttribute('cy', samples[cur][1]); }
    function toUser(x, y) { var r = svg.getBoundingClientRect(), vb = [0, 0, 220, 270], s = Math.min(r.width / vb[2], r.height / vb[3]); var ox = r.left + (r.width - vb[2] * s) / 2, oy = r.top + (r.height - vb[3] * s) / 2; return [(x - ox) / s, (y - oy) / s]; }
    api.toScreen = function (p) { var r = svg.getBoundingClientRect(), s = Math.min(r.width / 220, r.height / 270); return [r.left + (r.width - 220 * s) / 2 + p[0] * s, r.top + (r.height - 270 * s) / 2 + p[1] * s]; };
    api.points = function () { return samples.slice(cur).map(api.toScreen); };
    api.offPath = function () { var c = api.toScreen([200, 20]), d = api.toScreen([20, 250]); return [api.toScreen(samples[cur]), c, d]; };
    function move(x, y) {
      var p = toUser(x, y), best = -1, bd = 1e9;
      for (var i = cur; i < Math.min(samples.length, cur + 10); i++) { var d = Math.hypot(samples[i][0] - p[0], samples[i][1] - p[1]); if (d < bd) { bd = d; best = i; } }
      if (bd < 32 && best > cur) { cur = best; show(); }
      else if (bd > 62 && !warned) { warned = true; if (api.onOff) api.onOff(); }
      if (cur >= samples.length - 2) finishStroke();
    }
    function finishStroke() {
      track = false; cur = samples.length - 1; show(); done.push(prog); NK.sound.pop();
      if (api.stroke < spec.strokes.length - 1) { api.stroke++; setup(); if (api.onStroke) api.onStroke(); }
      else { api.done = true; startDot.remove(); head.remove(); el.classList.add('traced'); if (api.onDone) api.onDone(); }
    }
    api.lock = function (on) { el.classList.toggle('locked', on); };
    api.auto = async function (ms) { /* the demo: the road fills slowly */ while (!api.done) { cur = Math.min(samples.length - 1, cur + 1); show(); await FR.wait((ms || 1600) / 60); if (cur >= samples.length - 1) finishStroke(); } };
    el.addEventListener('pointerdown', function (e) {
      if (el.classList.contains('locked') || api.done) return; e.preventDefault();
      var p = toUser(e.clientX, e.clientY), d = Math.hypot(samples[cur][0] - p[0], samples[cur][1] - p[1]);
      if (d < 44) { track = true; move(e.clientX, e.clientY); } else if (!warned) { warned = true; if (api.onOff) api.onOff(true); }
    });
    document.addEventListener('pointermove', function (e) { if (track) move(e.clientX, e.clientY); });
    document.addEventListener('pointerup', function () { track = false; });
    var defs = document.createElementNS(NS, 'defs'); defs.innerHTML = '<linearGradient id="u5ink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF9B3D"/><stop offset=".5" stop-color="#FF4D3D"/><stop offset="1" stop-color="#C0207A"/></linearGradient>'; svg.insertBefore(defs, svg.firstChild);
    setup(); return api;
  };
})();
