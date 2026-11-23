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
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.12, 0.3, 'triangle', 0.16); }); }
  };

  /* ---------- number words ---------- */
  NK.word = function (n) { return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] || String(n); };
  NK.Word = function (n) { var w = NK.word(n); return w.charAt(0).toUpperCase() + w.slice(1); };

  /* ---------- art (original drawings) ---------- */
  NK.ART = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<radialGradient id="nkRed" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FF7A6B"/><stop offset=".55" stop-color="#E5322D"/><stop offset="1" stop-color="#B01E22"/></radialGradient>' +
    '<radialGradient id="nkGreen" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#C9F07A"/><stop offset=".55" stop-color="#7CC63A"/><stop offset="1" stop-color="#4F9A1F"/></radialGradient>' +
    '<symbol id="nkApple" viewBox="0 0 100 100"><path d="M50 30 C 36 18, 10 22, 12 50 C 14 76, 32 94, 44 92 C 48 91, 52 91, 56 92 C 68 94, 86 76, 88 50 C 90 22, 64 18, 50 30 Z" fill="var(--apple,url(#nkRed))"/>' +
    '<ellipse cx="32" cy="44" rx="7" ry="12" fill="#fff" opacity=".45" transform="rotate(20 32 44)"/>' +
    '<path d="M50 31 C 50 22, 52 14, 57 8" stroke="#6B4226" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M55 16 C 64 6, 78 8, 82 12 C 76 22, 62 22, 55 16 Z" fill="#3FAE49"/><path d="M57 16 C 65 13, 72 12, 79 12" stroke="#2C8A37" stroke-width="1.6" fill="none"/></symbol>' +
    '<symbol id="nkHand" viewBox="0 0 100 100"><path d="M38 8 c6 0 9 4 9 10 v30 l4-2 c5-2 9 0 10 4 l1 2 c5-2 9 0 10 4 l1 2 c5-1 9 2 9 7 v18 c0 12-10 22-24 22 h-8 c-9 0-15-4-20-11 L16 72 c-3-5-1-10 4-11 c4-1 8 2 10 5 l0 0 V18 c0-6 3-10 8-10z" fill="#FFE0BD" stroke="#5A3E2B" stroke-width="4" stroke-linejoin="round"/></symbol>' +
    '</defs></svg>';
  NK.apple = function (cls, green) { return '<svg class="' + (cls || '') + '" viewBox="0 0 100 100"' + (green ? ' style="--apple:url(#nkGreen)"' : '') + '><use href="#nkApple"/></svg>'; };

  /* ---------- stars and saving ---------- */
  NK.starsFor = function (firstTry, total) { var r = firstTry / total; return r >= 0.95 ? 3 : r >= 0.7 ? 2 : 1; };
  var KEY = 'tl2.kNumbers';
  NK.load = function () { try { return JSON.parse(localStorage.getItem(KEY)) || { games: {} }; } catch (e) { return { games: {} }; } };
  NK.save = function (game, stars) {
    var p = NK.load(), g = p.games[game] || { best: 0, plays: 0 };
    g.plays++; g.last = stars; g.best = Math.max(g.best, stars); g.passed = g.best >= 2; g.at = Date.now();
    p.games[game] = g; try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    return g;
  };
})();
