/* Kindergarten Numbers, Unit 4 (numbers 0-5): helpers shared by Unit 4's pages.
   U4.num(n): a big, rounded written number drawn with thick strokes (the same strokes are the tracing path).
   U4.frame5(k, interactive): a glossy five-frame he fills by tapping boxes. U4.tracer(n): trace a number with a finger.
   U4.numCard(n): a card with a big written number. U4.defs(): cookies for the "empty plate" (zero) game. */
(function () {
  var U4 = window.U4 = {};
  /* stroke centerlines in a 100 x 140 box, in writing order */
  U4.STROKES = {
    0: ['M50 20 C 24 20 18 48 18 70 C 18 96 30 120 50 120 C 70 120 82 96 82 70 C 82 46 76 20 50 20'],
    1: ['M32 40 L54 20 L54 120'],
    2: ['M22 44 C 22 16 78 14 78 42 C 78 66 42 92 22 120 L82 120'],
    3: ['M24 30 C 38 12 78 16 76 42 C 74 62 54 66 44 68 C 62 68 80 76 80 96 C 80 126 36 128 22 110'],
    4: ['M30 20 L22 86 L84 86', 'M64 44 L64 122'],
    5: ['M34 22 L30 64 C 44 54 80 56 80 88 C 80 124 34 126 22 108', 'M34 22 L78 22']
  };
  U4.COLOR = { 0: '#2FB5E8', 1: '#FF4D3D', 2: '#FFB31A', 3: '#22B45E', 4: '#A779FF', 5: '#FF6FA8' };
  U4.RHYME = {
    0: 'Around and back to the top. Zero!',
    1: 'One straight line, down we go. One!',
    2: 'Curve around, slide down, line across. Two!',
    3: 'Around a bump, around a bump. Three!',
    4: 'Down and across, then down again. Four!',
    5: 'Down, a round belly, then a hat. Five!'
  };
  U4.num = function (n, w) {
    var d = U4.STROKES[n], c = U4.COLOR[n], s = '<svg viewBox="0 0 100 140">';
    d.forEach(function (p) { s += '<path d="' + p + '" fill="none" stroke="#3B2A7A" stroke-width="' + ((w || 18) + 9) + '" stroke-linecap="round" stroke-linejoin="round"/>'; });
    d.forEach(function (p) { s += '<path d="' + p + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 18) + '" stroke-linecap="round" stroke-linejoin="round"/>'; });
    d.forEach(function (p) { s += '<path d="' + p + '" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity=".55" transform="translate(-2.5 -3)"/>'; });
    return s + '</svg>';
  };
  U4.numCard = function (n) { var d = document.createElement('div'); d.className = 'numcard'; d.dataset.n = n; d.innerHTML = U4.num(n); return d; };

  /* five-frame: tap an empty box to put a counter in, tap a counter to take it out */
  U4.frame5 = function (k, interactive) {
    var el = document.createElement('div'); el.className = 'ff' + (interactive ? '' : ' locked');
    var h = ''; for (var i = 0; i < 5; i++) h += '<div class="box" data-b="' + i + '"></div>'; el.innerHTML = h;
    var api = { el: el, onChange: null }, boxes = el.querySelectorAll('.box');
    api.count = function () { return el.querySelectorAll('.ctr').length; };
    api.set = function (m) { boxes.forEach(function (b, i) { b.innerHTML = i < m ? '<i class="ctr"></i>' : ''; b.classList.remove('need', 'extra'); }); };
    api.lock = function (on) { el.classList.toggle('locked', on); };
    api.box = function (i) { return boxes[i]; };
    api.hint = function (want) { var c = api.count(), seen = 0; boxes.forEach(function (b) { var has = !!b.querySelector('.ctr'); if (has) seen++; b.classList.toggle('extra', has && c > want && seen > want); }); var need = want - c; boxes.forEach(function (b) { var has = !!b.querySelector('.ctr'); b.classList.toggle('need', !has && need-- > 0); }); };
    api.clearHint = function () { boxes.forEach(function (b) { b.classList.remove('need', 'extra'); }); };
    /* the boxes to tap to get from now to m (fill from the left, empty from the right) */
    api.moves = function (m) { var out = [], c = api.count(), i; if (c < m) { for (i = 0; i < 5 && out.length < m - c; i++) if (!boxes[i].querySelector('.ctr')) out.push(i); } else { for (i = 4; i >= 0 && out.length < c - m; i--) if (boxes[i].querySelector('.ctr')) out.push(i); } return out; };
    if (interactive) el.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.box'); if (!b || el.classList.contains('locked')) return; e.preventDefault();
      if (b.querySelector('.ctr')) { b.innerHTML = ''; NK.sound.back(); } else { b.innerHTML = '<i class="ctr"></i>'; NK.sound.pop(); }
      api.clearHint(); if (api.onChange) api.onChange(api.count());
    });
    api.set(k || 0); return api;
  };

  /* tracing: follow each stroke from its green start dot */
  U4.tracer = function (n) {
    var el = document.createElement('div'); el.className = 'tracer';
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '-6 4 112 132'); el.appendChild(svg);
    var strokes = U4.STROKES[n], c = U4.COLOR[n], at = 0, ink = null, pts = [], api = { el: el, onDone: null, onMiss: null, locked: false };
    function mk(tag, attrs, parent) { var x = document.createElementNS(NS, tag); for (var k in attrs) x.setAttribute(k, attrs[k]); (parent || svg).appendChild(x); return x; }
    var samples = strokes.map(function (d) { var p = mk('path', { d: d, fill: 'none', stroke: 'none' }), L = p.getTotalLength(), a = []; for (var s = 0; s <= L; s += 2) { var q = p.getPointAtLength(s); a.push([q.x, q.y]); } p.remove(); return a; });
    strokes.forEach(function (d) { mk('path', { d: d, fill: 'none', stroke: '#D5E2F4', 'stroke-width': 24, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); });
    strokes.forEach(function (d) { mk('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' }); });
    var paint = mk('g', {}), inkG = mk('g', {}), dotG = mk('g', {});
    function drawDot() {
      while (dotG.firstChild) dotG.removeChild(dotG.firstChild); if (at >= strokes.length) return;
      var s = samples[at], a = s[0], b = s[Math.min(6, s.length - 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      mk('circle', { cx: a[0], cy: a[1], r: 9, fill: '#22B45E', stroke: '#fff', 'stroke-width': 3, 'class': 'startdot' }, dotG);
      mk('path', { d: 'M-4 -5 L5 0 L-4 5', fill: 'none', stroke: '#fff', 'stroke-width': 2.6, 'stroke-linecap': 'round', transform: 'translate(' + a[0] + ' ' + a[1] + ') rotate(' + ang + ')' }, dotG);
    }
    function toSvg(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var q = p.matrixTransform(svg.getScreenCTM().inverse()); return [q.x, q.y]; }
    function judge() {
      var s = samples[at], cov = 0, on = 0, d2 = function (a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); };
      s.forEach(function (q) { if (pts.some(function (p) { return d2(p, q) < 13; })) cov++; });
      pts.forEach(function (p) { if (s.some(function (q) { return d2(p, q) < 18; })) on++; });
      return pts.length > 3 && cov / s.length >= .8 && on / pts.length >= .75 && d2(pts[0], s[0]) < 24;
    }
    function paintStroke(d) {
      mk('path', { d: d, fill: 'none', stroke: '#3B2A7A', 'stroke-width': 27, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, paint);
      mk('path', { d: d, fill: 'none', stroke: c, 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, paint);
      mk('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: .55, transform: 'translate(-2.5 -3)' }, paint);
    }
    svg.addEventListener('pointerdown', function (e) {
      if (api.locked || at >= strokes.length) return; e.preventDefault(); try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      pts = [toSvg(e)]; ink = mk('polyline', { points: pts.join(' '), fill: 'none', stroke: c, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .85 }, inkG);
    });
    svg.addEventListener('pointermove', function (e) { if (!ink) return; pts.push(toSvg(e)); ink.setAttribute('points', pts.join(' ')); });
    function up() {
      if (!ink) return; var good = judge(); ink.remove(); ink = null;
      if (good) { paintStroke(strokes[at]); NK.sound.pop(); at++; drawDot(); if (at >= strokes.length && api.onDone) api.onDone(); }
      else if (api.onMiss) api.onMiss();
    }
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    /* for the demo hand and tests: a stroke's points on screen */
    api.screenPts = function (i, every) { var m = svg.getScreenCTM(), out = []; samples[i].forEach(function (q, k) { if (k % (every || 3) && k !== samples[i].length - 1) return; var p = svg.createSVGPoint(); p.x = q[0]; p.y = q[1]; var r = p.matrixTransform(m); out.push([Math.round(r.x), Math.round(r.y)]); }); return out; };
    api.stroke = function () { return at; };
    api.strokes = function () { return strokes.length; };
    /* the demo: paint the next stroke as the hand moves along it */
    api.demoStroke = async function (moveHand) { var P = api.screenPts(at, 5); for (var k = 0; k < P.length; k++) await moveHand(P[k]); paintStroke(strokes[at]); NK.sound.pop(); at++; drawDot(); };
    api.reset = function () { at = 0; while (paint.firstChild) paint.removeChild(paint.firstChild); drawDot(); };
    drawDot(); return api;
  };

  /* cookies (round, with chips) */
  U4.defs = function () {
    var d = document.createElement('div');
    d.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="u4Ck" cx="38%" cy="32%" r="78%"><stop offset="0" stop-color="#F7D08A"/><stop offset=".6" stop-color="#D99A45"/><stop offset="1" stop-color="#9C5E1E"/></radialGradient>' +
      '<symbol id="u4Cookie" viewBox="0 0 100 100"><ellipse cx="50" cy="92" rx="34" ry="5" fill="url(#nkShadow)"/><circle cx="50" cy="52" r="38" fill="url(#u4Ck)" stroke="#7A4515" stroke-width="3"/>' +
      '<g fill="#5A3010"><ellipse cx="36" cy="40" rx="5" ry="4"/><ellipse cx="60" cy="34" rx="4" ry="3.5"/><ellipse cx="66" cy="58" rx="5" ry="4"/><ellipse cx="42" cy="66" rx="4.5" ry="4"/><ellipse cx="54" cy="52" rx="3.5" ry="3"/></g>' +
      '<ellipse cx="34" cy="30" rx="10" ry="6" fill="#fff" opacity=".35" transform="rotate(-25 34 30)"/></symbol>' +
      '<radialGradient id="u4Rl" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFE3A0"/><stop offset=".55" stop-color="#E7A645"/><stop offset="1" stop-color="#A8621C"/></radialGradient>' +
      '<symbol id="u4Roll" viewBox="0 0 100 100"><ellipse cx="50" cy="88" rx="38" ry="6" fill="url(#nkShadow)"/>' +
      '<g stroke="#7A4515" stroke-width="3"><ellipse cx="30" cy="58" rx="18" ry="22" fill="url(#u4Rl)"/><ellipse cx="70" cy="58" rx="18" ry="22" fill="url(#u4Rl)"/><ellipse cx="50" cy="50" rx="20" ry="26" fill="url(#u4Rl)"/></g>' +
      '<g fill="#FFF6DC" opacity=".8"><ellipse cx="44" cy="36" rx="6" ry="3"/><ellipse cx="24" cy="46" rx="4" ry="2.5"/><ellipse cx="64" cy="46" rx="4" ry="2.5"/></g></symbol></defs></svg>';
    document.body.appendChild(d.firstChild);
  };
})();
