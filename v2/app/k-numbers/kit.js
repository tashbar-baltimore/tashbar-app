/* Kindergarten Numbers kit (2.0). Used by every Numbers game in v2/app/k-numbers/.
   Voice (spoken lines, "hear it again"), happy sounds, apple and basket art, stars, and saving.
   Saving is in this browser for now; when the shared 2.0 sign-in is in, NK.save() sends it to the boy's record. */
(function () {
  var q = new URLSearchParams(location.search);
  var FAST = q.get('fast') === '1';                       /* tests only: everything 10x quicker */
  var NK = window.NK = { fast: FAST, said: [], last: '' };
  NK.wait = function (ms) { return new Promise(function (r) { setTimeout(r, FAST ? Math.min(ms, 60) : ms); }); };

  /* ---------- voice ---------- */
  var voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    var vs = speechSynthesis.getVoices() || [], pref = [/Google US English/i, /Samantha/i, /Microsoft (Aria|Jenny)/i, /en[-_]US/i, /^en/i];
    for (var i = 0; i < pref.length && !voice; i++) voice = vs.filter(function (v) { return pref[i].test(v.name) || pref[i].test(v.lang); })[0] || null;
  }
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  /* say(text): speaks one short line; resolves when finished (or after a safe time, so a game never freezes). */
  NK.say = function (text, opts) {
    opts = opts || {};
    NK.said.push(text); if (!opts.noRepeat) NK.last = opts.repeat || text;
    var words = text.split(/\s+/).length, guess = FAST ? 40 : 700 + words * 380;
    return new Promise(function (done) {
      var finished = false, end = function () { if (!finished) { finished = true; done(); } };
      setTimeout(end, guess + (FAST ? 0 : 1500));
      if (FAST || !('speechSynthesis' in window)) return setTimeout(end, guess);
      try {
        var u = new SpeechSynthesisUtterance(text); if (voice) u.voice = voice; u.lang = 'en-US'; u.rate = 0.9; u.pitch = 1.08;
        u.onend = function () { setTimeout(end, 120); }; u.onerror = end;
        speechSynthesis.speak(u);
      } catch (e) { setTimeout(end, guess); }
    });
  };
  NK.hush = function () { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {} };
  NK.again = function () { NK.hush(); if (NK.last) NK.say(NK.last, { noRepeat: true }); };

  /* ---------- sounds (made right here, nothing to download) ---------- */
  var ac = null;
  NK.unlock = function () { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) {} };
  function tone(f, t0, dur, type, vol) {
    if (!ac) return; var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  NK.sound = {
    pop: function () { tone(660, 0, 0.12, 'triangle', 0.15); },
    back: function () { tone(440, 0, 0.12, 'triangle', 0.12); },
    yes: function () { tone(784, 0, 0.16, 'triangle'); tone(1047, 0.12, 0.28, 'triangle'); },
    oops: function () { tone(330, 0, 0.18, 'sine', 0.12); tone(294, 0.16, 0.25, 'sine', 0.1); },
    cloth: function () { tone(220, 0, 0.1, 'sine', 0.06); },
    clap: function () { if (!ac) return; var n = ac.sampleRate * 0.08, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); var src = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 1400; g.gain.value = 0.5; src.buffer = buf; src.connect(f); f.connect(g); g.connect(ac.destination); src.start(); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.12, 0.3, 'triangle', 0.16); }); }
  };

  /* ---------- number words ---------- */
  NK.word = function (n) {   /* number words to one hundred (Units 13-14: teen numbers, counting to 100) */
    var w = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    if (n >= 0 && n < 20 && n === Math.floor(n)) return w[n];
    var T = { 2: 'twenty', 3: 'thirty', 4: 'forty', 5: 'fifty', 6: 'sixty', 7: 'seventy', 8: 'eighty', 9: 'ninety' };
    if (n >= 20 && n < 100 && n === Math.floor(n)) return T[Math.floor(n / 10)] + (n % 10 ? ' ' + w[n % 10] : '');
    if (n === 100) return 'one hundred'; return String(n); };
  NK.Word = function (n) { var w = NK.word(n); return w.charAt(0).toUpperCase() + w.slice(1); };

  /* ---------- art (original drawings, glossy 3D cartoon style) ----------
     Every fruit: a soft ground shadow, a rich round body with a darker edge and outline, a big soft shine and a sharp sparkle. */
  var SHADOW = '<ellipse cx="50" cy="94" rx="30" ry="5" fill="url(#nkShadow)"/>';
  var SHINE = function (x, y, rx, ry, r) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="url(#nkShine)" transform="rotate(' + r + ' ' + x + ' ' + y + ')"/>' +
    '<circle cx="' + (x - 2) + '" cy="' + (y - ry * .55) + '" r="3.4" fill="#fff" opacity=".95"/><circle cx="' + (x + rx * .9) + '" cy="' + (y + ry * .9) + '" r="1.6" fill="#fff" opacity=".7"/>'; };
  var LEAF = function (d, vein) { return '<path d="' + d + '" fill="url(#nkLeaf)" stroke="#1F7A34" stroke-width="2" stroke-linejoin="round"/><path d="' + vein + '" stroke="#C8F5A8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>'; };
  var STEM = function (d) { return '<path d="' + d + '" stroke="#4A2C14" stroke-width="7.5" fill="none" stroke-linecap="round"/><path d="' + d + '" stroke="url(#nkStem)" stroke-width="4.5" fill="none" stroke-linecap="round"/>'; };
  var APPLE = 'M50 30 C 36 17, 9 22, 11 50 C 13 77, 32 95, 44 93 C 48 92, 52 92, 56 93 C 68 95, 87 77, 89 50 C 91 22, 64 17, 50 30 Z';
  var PEAR = 'M50 18 C 40 18, 38 31, 36 41 C 33 53, 19 59, 21 76 C 23 93, 40 97, 50 97 C 60 97, 77 93, 79 76 C 81 59, 67 53, 64 41 C 62 31, 60 18, 50 18 Z';
  function rg(id, stops, cx, cy, r) { return '<radialGradient id="' + id + '" cx="' + (cx || '36%') + '" cy="' + (cy || '30%') + '" r="' + (r || '78%') + '">' + stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('') + '</radialGradient>'; }
  NK.ART = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    rg('nkRed', [[0, '#FF9B8A'], [.28, '#FF4D3D'], [.7, '#D91E24'], [1, '#8E0E17']]) +
    rg('nkGreen', [[0, '#E9FFA8'], [.3, '#A8E04A'], [.72, '#5FAE22'], [1, '#2F6E10']]) +
    rg('nkOr', [[0, '#FFE6A3'], [.3, '#FFB536'], [.72, '#FF8A0C'], [1, '#B85305']]) +
    rg('nkPe', [[0, '#FFFFC8'], [.35, '#E7EE72'], [.75, '#B9CF35'], [1, '#6F8A12']], '36%', '58%') +
    rg('nkBlush', [[0, '#FF8A6A', .55], [1, '#FF8A6A', 0]], '50%', '50%', '50%') +
    rg('nkShine', [[0, '#fff', .9], [.6, '#fff', .35], [1, '#fff', 0]], '50%', '45%', '50%') +
    rg('nkShadow', [[0, '#3A2410', .38], [1, '#3A2410', 0]], '50%', '50%', '50%') +
    '<linearGradient id="nkEdge" x1="0" y1="0" x2="1" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3A0008" stop-opacity=".35"/></linearGradient>' +
    '<linearGradient id="nkLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9BF06A"/><stop offset=".5" stop-color="#3FBF4A"/><stop offset="1" stop-color="#1E8A35"/></linearGradient>' +
    '<linearGradient id="nkStem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B07A4A"/><stop offset="1" stop-color="#6B4226"/></linearGradient>' +
    '<linearGradient id="nkSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0DE"/><stop offset="1" stop-color="#F4C08E"/></linearGradient>' +
    '<linearGradient id="nkGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3A6"/><stop offset=".45" stop-color="#FFCC1F"/><stop offset="1" stop-color="#F39200"/></linearGradient>' +
    /* fruit: pictures made in ChatGPT for Tashbar (img/), with a soft shadow under each */
    '<symbol id="nkApple" viewBox="0 0 100 100">' + SHADOW + '<image href="img/red-apple.webp" x="6" y="4" width="88" height="90" preserveAspectRatio="xMidYMid meet"/></symbol>' +
    '<symbol id="nkAppleG" viewBox="0 0 100 100">' + SHADOW + '<image href="img/green-apple.webp" x="6" y="4" width="88" height="90" preserveAspectRatio="xMidYMid meet"/></symbol>' +
    '<symbol id="nkOrange" viewBox="0 0 100 100">' + SHADOW + '<image href="img/orange.webp" x="6" y="4" width="88" height="90" preserveAspectRatio="xMidYMid meet"/></symbol>' +
    '<symbol id="nkPear" viewBox="0 0 100 100">' + SHADOW + '<image href="img/pear.webp" x="6" y="4" width="88" height="90" preserveAspectRatio="xMidYMid meet"/></symbol>' +
    /* open hand for clapping */
    '<symbol id="nkPalm" viewBox="0 0 100 100"><g fill="url(#nkSkin)" stroke="#7A4A2B" stroke-width="3.5" stroke-linejoin="round">' +
    '<rect x="30" y="8" width="13" height="44" rx="6.5"/><rect x="45" y="4" width="13" height="48" rx="6.5"/><rect x="60" y="9" width="13" height="43" rx="6.5"/><rect x="75" y="20" width="12" height="34" rx="6"/>' +
    '<path d="M14 52 c-4-6 2-14 9-9 l9 9 V40 h55 v24 c0 18-12 32-30 32 h-6 c-10 0-17-6-22-14z"/></g>' +
    '<g fill="#fff" opacity=".6"><rect x="33" y="12" width="4" height="14" rx="2"/><rect x="48" y="8" width="4" height="14" rx="2"/><rect x="63" y="13" width="4" height="12" rx="2"/></g></symbol>' +
    /* pointing hand for the demo */
    '<symbol id="nkHand" viewBox="0 0 100 100"><path d="M38 8 c6 0 9 4 9 10 v30 l4-2 c5-2 9 0 10 4 l1 2 c5-2 9 0 10 4 l1 2 c5-1 9 2 9 7 v18 c0 12-10 22-24 22 h-8 c-9 0-15-4-20-11 L16 72 c-3-5-1-10 4-11 c4-1 8 2 10 5 l0 0 V18 c0-6 3-10 8-10z" fill="url(#nkSkin)" stroke="#7A4A2B" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<rect x="34" y="13" width="4.5" height="22" rx="2.2" fill="#fff" opacity=".65"/></symbol>' +
    /* Shabbos candle in a silver candlestick */
    '<linearGradient id="nkSilver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8C99AE"/><stop offset=".35" stop-color="#F4F7FC"/><stop offset=".6" stop-color="#C3CCDA"/><stop offset="1" stop-color="#7D8AA0"/></linearGradient>' +
    '<radialGradient id="nkFlame" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".45" stop-color="#FFD23D"/><stop offset="1" stop-color="#FF7A1A"/></radialGradient>' +
    '<symbol id="nkCandle" viewBox="0 0 100 100"><ellipse cx="50" cy="96" rx="24" ry="4" fill="url(#nkShadow)"/>' +
    '<circle cx="50" cy="14" r="13" fill="#FFE680" opacity=".35"/><path d="M50 3 C 58 13, 57 22, 50 26 C 43 22, 42 13, 50 3 Z" fill="url(#nkFlame)" stroke="#E0700A" stroke-width="1.5"/>' +
    '<rect x="49" y="24" width="2" height="5" fill="#333"/><rect x="41" y="28" width="18" height="40" rx="4" fill="#FFFDF5" stroke="#C9BFA8" stroke-width="2"/><rect x="44" y="31" width="4" height="30" rx="2" fill="#fff"/>' +
    '<path d="M33 68 H67 L62 74 H38 Z" fill="url(#nkSilver)" stroke="#5F6B80" stroke-width="2" stroke-linejoin="round"/><rect x="45" y="74" width="10" height="12" fill="url(#nkSilver)" stroke="#5F6B80" stroke-width="2"/>' +
    '<path d="M30 94 C 30 86, 70 86, 70 94 Z" fill="url(#nkSilver)" stroke="#5F6B80" stroke-width="2" stroke-linejoin="round"/></symbol>' +
    /* star */
    '<symbol id="nkStar" viewBox="0 0 100 100">' + '<image href="img/star.webp" x="2" y="2" width="96" height="96" preserveAspectRatio="xMidYMid meet"/></symbol>' +
    '</defs></svg>';
  NK.apple = function (cls, green) { return '<svg class="' + (cls || '') + '" viewBox="0 0 100 100"' + (green ? ' style="--apple:url(#nkGreen);--appleEdge:#2C5E0E"' : '') + '><use href="#nkApple"/></svg>'; };

  /* ---------- stars and saving ---------- */
  NK.starsFor = function (firstTry, total) { return firstTry >= total ? 3 : (firstTry >= total - 1 || firstTry / total >= 0.85) ? 2 : 1; };   /* all right = 3; one slip = 2 (7 of 8, the plan's mastery line) */
  var KEY = 'tl2.kNumbers';
  NK.load = function () { try { return JSON.parse(localStorage.getItem(KEY)) || { games: {} }; } catch (e) { return { games: {} }; } };
  NK.save = function (game, stars) {
    var p = NK.load(), g = p.games[game] || { best: 0, plays: 0 };
    g.plays++; g.last = stars; g.best = Math.max(g.best, stars); g.passed = g.best >= 2; g.at = Date.now();
    p.games[game] = g; try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    return g;
  };
})();
