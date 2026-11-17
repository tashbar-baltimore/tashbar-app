/* PathfinderArt.js — THE PICTURES THE QUESTIONS NEED (Head of School 2026-11-16: "it says count the boxes… there were no boxes").
   Claude Code builder (4cc@). 80 Pathfinder questions describe a picture (screenNote) that was never drawn, and the page showed the
   description as text (for "How many stars?" it printed "7 stars, scattered": the answer). Each question now has an exact picture spec
   here, drawn on the page by PathfinderArt.html (SVG, no image files). The spec is written from the question's own picture note,
   one by one; counts and numbers are copied from the note, never guessed. pfPresent_ sends it as it.art and no longer sends the note.
   choices: pictures for answer buttons whose choices ARE pictures ("4 hats", "3 hats spread out wide"). The button keeps its text. */
var PF_ART = (function () {
  var A = {}, M = 'PF.M.MATH.', R = 'PF.R.READ.';
  var row = function (e, n, o) { var s = { k: 'emoji', e: e, n: n }; if (o) Object.keys(o).forEach(function (k) { s[k] = o[k]; }); return s; };
  var cho = function (e, list) { var c = {}; list.forEach(function (x) { c[x[0]] = row(e, x[1], x[2] ? { wide: 1, small: 1 } : { small: 1 }); }); return c; };
  /* ---- Level 1 */
  A[M + 'NUM.L01.01.A'] = row('👦', 4, { choices: cho('🧢', [['4 hats', 4], ['3 hats', 3], ['5 hats', 5], ['3 hats spread out wide', 3, 1]]) });
  A[M + 'NUM.L01.01.B'] = { k: 'table', e: '👦', n: 6, choices: cho('🥛', [['6 cups', 6], ['5 cups', 5], ['7 cups', 7], ['4 cups spread out wide', 4, 1]]) };
  A[M + 'NUM.L01.01.C'] = row('👦', 3, { choices: cho('📘', [['3 siddurim', 3], ['2 siddurim', 2], ['4 siddurim', 4], ['2 siddurim spread out wide', 2, 1]]) });
  A[M + 'NUM.L01.02.A'] = row('⭐', 7, { lay: 'scatter' });
  A[M + 'NUM.L01.02.B'] = row('🍎', 9);
  A[M + 'NUM.L01.02.C'] = row('dreidel', 5, { lay: 'circle' });
  A[M + 'OPS.L01.02.C'] = { k: 'sets', sets: [row('⚽', 1), row('⚽', 3)], join: 'and' };
  A[M + 'OPS.L01.03.A'] = { k: 'balls', groups: [{ c: '#d9363e', n: 5 }, { c: '#2f6fd6', n: 3 }] };
  A[M + 'OPS.L01.04.B'] = { k: 'tenframe', frames: [6] };
  A[M + 'PV.L01.01.C'] = { k: 'tenframe', frames: [10], loose: 8 };
  A[M + 'MEAS.L01.01.A'] = { k: 'lengths', obj: 'pencil', bars: [[60, 230], [150, 170], [20, 90], [10, 150]] };   /* longest starts further right; a shorter one reaches furthest right */
  A[M + 'MEAS.L01.01.C'] = { k: 'lengths', obj: 'string', bars: [[100, 70], [160, 160], [0, 260], [30, 140]] };   /* shortest; a longer one starts further right */
  A[M + 'STAT.L01.01.A'] = { k: 'mix', items: [{ s: 'ball', c: '#d9363e', n: 4 }, { s: 'ball', c: '#2f6fd6', n: 3 }, { s: 'car', c: '#d9363e', n: 2 }] };
  A[M + 'STAT.L01.01.B'] = { k: 'sets', sets: [row('🍎', 3), row('🍌', 2), row('🍪', 3)] };
  A[M + 'STAT.L01.01.C'] = { k: 'mix', items: [{ s: 'button', c: '#d9363e', n: 3, big: 1 }, { s: 'button', c: '#2f6fd6', n: 2, big: 1 }, { s: 'button', c: '#d9363e', n: 4 }] };
  var sh = function (list) { return { k: 'shapes', list: list, small: 1 }; };
  A[M + 'GEO.L01.03.A'] = { k: 'shape', s: 'square', choices: { '2 triangles': sh(['tri', 'tri']), '3 triangles': sh(['tri', 'tri', 'tri']), '2 circles': sh(['circle', 'circle']), '1 triangle': sh(['tri']) } };
  A[M + 'GEO.L01.03.B'] = { k: 'shape', s: 'rect', choices: { '2 squares side by side': sh(['square', 'square']), '3 squares': sh(['square', 'square', 'square']), '2 triangles turned the wrong way': sh(['tri', 'trid']), '2 circles': sh(['circle', 'circle']) } };
  A[M + 'GEO.L01.03.C'] = { k: 'shape', s: 'hexagon', choices: { '6 triangles': sh(['tri', 'tri', 'tri', 'tri', 'tri', 'tri']), '4 triangles': sh(['tri', 'tri', 'tri', 'tri']), '6 squares': sh(['square', 'square', 'square', 'square', 'square', 'square']), '2 squares': sh(['square', 'square']) } };
  /* ---- Level 2 */
  A[M + 'PV.L02.01.B'] = { k: 'base10', h: 0, t: 4, o: 7 };
  A[M + 'MEAS.L02.01.A'] = { k: 'units', obj: 'pencil', unit: 'cube', n: 6 };
  A[M + 'MEAS.L02.01.B'] = { k: 'units', obj: 'sefer', unit: 'clip', n: 4 };
  A[M + 'MEAS.L02.01.C'] = { k: 'units', obj: 'table', unit: 'hand', n: 8 };
  var pg = { k: 'picgraph', rows: [['apples', '🍎', 5], ['pears', '🍐', 3], ['plums', '🟣', 6]] };
  A[M + 'STAT.L02.01.A'] = pg; A[M + 'STAT.L02.01.B'] = pg; A[M + 'STAT.L02.01.C'] = pg;
  var shp = function (s, c, big) { return { k: 'shape', s: s, c: c, big: big ? 1 : 0, small: 1 }; };
  A[M + 'GEO.L02.01.A'] = { k: 'shape', s: 'tri', c: '#2f6fd6', size: 'small', choices: { 'big red triangle': shp('tri', '#d9363e', 1), 'small blue square': shp('square', '#2f6fd6'), 'small blue circle': shp('circle', '#2f6fd6'), 'blue rhombus': shp('rhombus', '#2f6fd6') } };
  A[M + 'GEO.L02.02.C'] = { k: 'frac', shape: 'circle', parts: 4, shaded: 0, fill: '#e9c27a', label: 'kugel' };
  /* ---- Level 3 */
  A[M + 'NUM.L03.01.C'] = { k: 'cubes', n: 9 };
  A[M + 'OPS.L03.04.A'] = row('🪑', 12, { lay: 'rows', r: 3, c: 4 });
  A[M + 'OPS.L03.04.C'] = row('🍎', 10, { lay: 'rows', r: 2, c: 5 });
  A[M + 'PV.L03.02.C'] = { k: 'base10', h: 2, t: 7, o: 0 };
  A[M + 'MEAS.L03.01.A'] = { k: 'ruler', obj: 'pencil', from: 0, to: 6, max: 8 };
  A[M + 'MEAS.L03.01.B'] = { k: 'ruler', obj: 'crayon', from: 2, to: 7, max: 8 };
  A[M + 'MEAS.L03.03.A'] = { k: 'clock', h: 2, m: 25 };
  A[M + 'MEAS.L03.03.B'] = { k: 'clock', h: 7, m: 45 };
  A[M + 'MEAS.L03.03.C'] = { k: 'clock', h: 11, m: 10 };
  A[M + 'MEAS.L03.04.A'] = { k: 'coins', list: ['quarter', 'quarter', 'dime', 'penny', 'penny', 'penny'] };
  A[M + 'MEAS.L03.04.B'] = { k: 'coins', list: ['dollar', 'quarter', 'nickel', 'nickel'] };
  /* ---- Level 4 */
  A[M + 'FRAC.L04.02.B'] = { k: 'frac', shape: 'circle', parts: 3, shaded: 2 };
  A[M + 'FRAC.L04.02.C'] = { k: 'frac', shape: 'rect', parts: 6, shaded: 1 };
  A[M + 'FRAC.L04.01.A'] = { k: 'numline', parts: 4 };
  A[M + 'FRAC.L04.01.B'] = { k: 'numline', parts: 3 };
  A[M + 'FRAC.L04.03.C'] = { k: 'fracbars', bars: [{ parts: 4, shaded: 1 }, { parts: 8, shaded: 0 }] };
  A[M + 'MEAS.L04.01.A'] = { k: 'grid', rows: 3, cols: 4 };
  A[M + 'MEAS.L04.01.B'] = { k: 'cells', cells: [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], cols: 5, rows: 3 };
  A[M + 'MEAS.L04.01.C'] = { k: 'grid', rows: 2, cols: 6 };
  A[M + 'MEAS.L04.03.C'] = { k: 'tri', sides: ['5 cm', '7 cm', '9 cm'] };
  A[M + 'STAT.L04.01.C'] = { k: 'bar', ticks: [0, 5, 10, 15, 20, 25, 30], bars: [['boys at the siyum', 25]] };
  /* ---- Reading K */
  A[R + 'PA.L01.01.A'] = { k: 'book', view: 'page' };
  A[R + 'PA.L01.01.B'] = { k: 'book', view: 'closed' };
  A[R + 'PA.L01.01.C'] = { k: 'boxes', text: 'Dan sat.' };
  /* ---- Level 5-9 */
  A[M + 'GEO.L05.01.A'] = { k: 'protractor', ray: 65 };          /* one ray on outer 0 (right); the other crosses outer 65 / inner 115 */
  A[M + 'GEO.L05.01.B'] = { k: 'angles2', a: [{ name: 'P', deg: 40, len: 150 }, { name: 'Q', deg: 70, len: 50 }] };
  A[M + 'GEO.L05.01.C'] = { k: 'protractor', ray: 40, from: 'left' };   /* one ray on inner 0 (left); the other crosses inner 140 / outer 40 */
  var pen = { k: 'lineplot', title: 'Our pencils (inches)', ticks: ['4 1/2', '4 3/4', '5', '5 1/4'], x: [3, 4, 2, 1] };
  A[M + 'STAT.L05.01.A'] = pen; A[M + 'STAT.L05.01.B'] = pen; A[M + 'STAT.L05.01.C'] = pen;
  A[M + 'OPS.L06.05.B'] = { k: 'expr', text: '(8 + 4) × 2 = ?' };
  A[M + 'MEAS.L06.01.B'] = { k: 'iso', l: 4, w: 2, h: 3 };
  A[M + 'STAT.L06.01.A'] = { k: 'lineplot', title: 'Water in 5 cups (cups)', ticks: ['1/4', '1/2', '3/4', '1'], x: [1, 2, 1, 1] };
  A[M + 'STAT.L06.01.B'] = { k: 'lineplot', title: 'Juice in 4 bottles (liters)', ticks: ['1/2', '1', '1 1/2', '2'], x: [2, 1, 0, 1] };
  A[M + 'STAT.L06.01.C'] = { k: 'lineplot', title: 'Our 6 ropes (yards)', ticks: ['1/4', '1/2', '3/4', '1', '1 1/4', '1 1/2'], x: [3, 0, 1, 1, 0, 1] };
  A[M + 'GEO.L06.01.B'] = { k: 'coord', max: 8, pt: [6, 2] };
  A[M + 'GEO.L07.01.B'] = { k: 'rtri', a: '8 m', b: '5 m' };
  A[M + 'GEO.L07.01.C'] = { k: 'tri', base: '12 in', height: '7 in', slant: '9 in' };
  A[M + 'GEO.L07.02.C'] = { k: 'net', l: 6, w: 2, h: 2, unit: 'cm' };
  A[M + 'STAT.L07.02.A'] = { k: 'hist', title: 'Test scores', bins: ['60–69', '70–79', '80–89', '90–99'], v: [3, 7, 5, 2], ticks: [0, 2, 4, 6, 8] };
  var bx = { k: 'boxplot', min: 10, q1: 15, med: 20, q3: 28, max: 35, axis: [5, 10, 15, 20, 25, 30, 35, 40] };
  A[M + 'STAT.L07.02.B'] = bx; A[M + 'STAT.L07.02.C'] = bx;
  A[M + 'NUM.L08.02.A'] = { k: 'expr', text: '−6 × (−7) = ?' };
  A[M + 'NUM.L08.02.C'] = { k: 'expr', text: '−5 × (−4) × (−2) = ?' };
  A[M + 'NUM.L08.03.C'] = { k: 'expr', text: '(−1/2) ÷ (−1/4) = ?' };
  A[M + 'GEO.L09.02.B'] = { k: 'parallel', known: '110°' };
  A[M + 'GEO.L09.02.C'] = { k: 'extangle', a: 40, b: 75 };
  var sc = { k: 'scatter', x: 'Hours of practice', y: 'Free throws made' };
  A[M + 'STAT.L09.01.A'] = sc; A[M + 'STAT.L09.01.B'] = sc;
  var tw = { k: 'table', title: '50 boys', head: ['', 'Plays an instrument', 'No instrument', 'Total'], rows: [['Plays sports', 12, 18, 30], ['No sports', 8, 12, 20], ['Total', 20, 30, 50]] };
  A[M + 'STAT.L09.02.A'] = tw; A[M + 'STAT.L09.02.B'] = tw; A[M + 'STAT.L09.02.C'] = tw;
  A[M + 'ALG.L09.02.B'] = { k: 'expr', text: '(5²)³' };
  return A;
})();
