/* Tashbar Learning 2.0: the core (sign-in, the boy's saved record, voice, and the K-1 game path).
   Moved from 1.0 (QuestPage.html sign-in and save queue, K1Only.html game path), kept small and clean (v2/README.md).
   Same school server as 1.0, so the same codes and the same saved progress. The game packs in games/ are copies of 1.0's
   packs/; they need only A, render, saveStudent, SRV, run and speak, which this file gives them. */
(function () {
  'use strict';
  var API = '__V2_API_URL__';
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var A = window.A = { st: null, view: 'signin', overlay: null, pin: '', busy: false, err: '', grade: null, subj: 'MATH', msg: '' };
  var SRV = window.SRV = { token: null, pendingEv: [], states: {} };

  /* ---------- the school server ---------- */
  function remote(fn, args) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, fn: fn, args: args || [] }) })
      .then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'Server error'); return j.result; });
  }
  window.run = function (fn) { return remote(fn, Array.prototype.slice.call(arguments, 1)); };

  /* ---------- saving (one save at a time; a failed save keeps his answers and tries again) ---------- */
  var SV = { busy: false, again: false, timer: null, tries: 0, dirty: false };
  function saveNow() {
    var st = A.st, token = SRV.token; if (!st || !token) return;
    if (SV.busy) { SV.again = true; return; }
    SV.busy = true; SV.again = false; SV.dirty = false;
    var ev = SRV.pendingEv.splice(0);
    remote('msSave', [token, st.id, JSON.parse(JSON.stringify(st)), ev, []]).then(function (r) {
      if (r && typeof r.balance === 'number') { st.balance = r.balance; if (Array.isArray(r.ledger)) st.ledger = r.ledger; }
      SV.busy = false; SV.tries = 0; if (SV.again && A.st === st) saveNow();
    }).catch(function () {
      SV.busy = false; if (SRV.token !== token || A.st !== st) return;
      SRV.pendingEv = ev.concat(SRV.pendingEv); SV.dirty = true; SV.tries++;
      clearTimeout(SV.timer); SV.timer = setTimeout(saveNow, Math.min(120000, [3000, 7000, 15000, 30000, 60000][SV.tries - 1] || 120000) * (0.7 + Math.random() * 0.6));
    });
  }
  window.saveStudent = function (st, done) { if (st && A.st && st.id === A.st.id) { SV.dirty = true; saveNow(); } if (typeof done === 'function') setTimeout(function () { done({}); }, 0); };
  window.addEventListener('online', function () { if (SV.timer) { clearTimeout(SV.timer); SV.timer = null; saveNow(); } });

  /* ---------- voice: the teacher voice, else the device voice ---------- */
  var TTS = 'https:' + '/' + '/' + 'tts-q26c275eaa-uk.a.run.app';
  var V = { a: null, tok: 0, cache: {} };
  function hush() { V.tok++; try { if (V.a) V.a.pause(); } catch (e) {} V.a = null; try { window.speechSynthesis.cancel(); } catch (e) {} }
  function devVoice(t, done) { try { var u = new SpeechSynthesisUtterance(t); u.rate = 0.92; u.pitch = 1.1; u.onend = done; u.onerror = done; window.speechSynthesis.speak(u); } catch (e) { done(); } }
  function voice(t, done) {
    done = done || function () {}; hush(); var my = V.tok, fin = false;
    var end = function () { if (fin) return; fin = true; done(); };
    var dev = function () { if (my === V.tok) devVoice(t, end); };
    var viaUrl = function (u) { if (my !== V.tok) return; var a = new Audio(u); V.a = a; a.onended = end; a.onerror = dev; var p = a.play(); if (p && p.catch) p.catch(dev); };
    setTimeout(end, String(t).length * 130 + 6000);
    if (V.cache[t]) return viaUrl(V.cache[t]);
    Promise.race([
      fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: String(t).slice(0, 300), voice: 'teacher' }) })
        .then(function (r) { return r.json(); }).then(function (j) { if (j && j.ok && j.url) { V.cache[t] = j.url; return j.url; } throw new Error('tts'); }),
      new Promise(function (_, rej) { setTimeout(function () { rej(new Error('slow')); }, 1500); })
    ]).then(viaUrl).catch(dev);
  }
  window.speak = function (t) { voice(String(t || '')); };

  /* ---------- the K-1 games: his grade only, in the order the skills build, one game at a time ----------
     Kindergarten (Level 1 games): KL Math, KR ABC, KK Kriyah. Grade 1 (Level 2 games): G1M Math, G1R Reading, KK Kriyah.
     A game is passed at 2 or more stars (0-3, saved by the game in his record); the next one opens when the one before is passed. */
  var PACKS = {
    0: [{ k: 'MATH', g: 'KL', st: 'klm', lv: 1, i: '🔢', n: 'Numbers' }, { k: 'READ', g: 'KR', st: 'krm', lv: 1, i: '🔤', n: 'ABC' }, { k: 'LK', g: 'KK', st: 'kkm', lv: 1, i: 'א', n: 'Kriyah' }],
    1: [{ k: 'MATH', g: 'G1M', st: 'g1m', lv: 2, i: '🔢', n: 'Numbers' }, { k: 'READ', g: 'G1R', st: 'g1r', lv: 2, i: '📖', n: 'Reading' }, { k: 'LK', g: 'KK', st: 'kkm', lv: 2, i: 'א', n: 'Kriyah' }]
  };
  var OVS = ['klov', 'krov', 'kkov', 'kkov2', 'g1mov', 'g1rov'];
  function list(p) { try { var re = new RegExp('\\.L0' + p.lv + '\\.'); return window[p.g].list().map(function (x) { return x[0]; }).filter(function (id) { return re.test(id); }); } catch (e) { return []; } }
  function subjects() { return (PACKS[A.grade] || []).filter(function (p) { return window[p.g] && typeof window[p.g].list === 'function' && list(p).length; }); }
  function score(p, id) { var m = A.st && A.st[p.st]; return m && typeof m[id] === 'number' ? m[id] : -1; }
  function passed(p, id) { return score(p, id) >= 2; }
  function nameOf(p, id) { try { var l = window[p.g].list().filter(function (x) { return x[0] === id; })[0]; return (l && l[1]) || id; } catch (e) { return id; } }
  function gameOpen() { return OVS.some(function (id) { return document.getElementById(id); }); }

  /* inside each game: fill the whole screen, and a voice bridge so the first lines are never silent (Chrome keeps a new frame
     silent until a tap inside it; the lines come to this page, which the boy has already tapped). Same as 1.0's K1Only. */
  var GAME_CSS = '<style id="k1fit">@media (min-width:900px){' +
    '.wrap{max-width:none!important;padding-left:clamp(16px,3vw,48px)!important;padding-right:clamp(16px,3vw,48px)!important}' +
    '.stage{min-height:calc(100vh - 160px)!important;justify-content:center}' +
    '.o{font-size:clamp(42px,15vh,150px)!important} .frame .o{font-size:clamp(38px,7vh,70px)!important}' +
    '.ch{min-width:clamp(108px,22vh,220px)!important;height:clamp(108px,22vh,220px)!important;font-size:clamp(52px,11vh,110px)!important;border-radius:clamp(30px,4vh,44px)!important}' +
    '.ch.wide{font-size:clamp(34px,5.5vh,60px)!important;min-width:clamp(150px,24vh,260px)!important}' +
    '.cap{font-size:clamp(22px,4.4vh,42px)!important;min-height:clamp(58px,8vh,84px)!important}' +
    '.card-num{font-size:clamp(96px,17vh,170px)!important} .big-num{font-size:clamp(72px,13vh,130px)!important}' +
    '.frame{grid-template-columns:repeat(5,clamp(60px,10vh,100px))!important;grid-template-rows:repeat(2,clamp(60px,10vh,100px))!important}' +
    '.tile{width:clamp(54px,8.5vh,84px)!important;height:clamp(54px,8.5vh,84px)!important;font-size:clamp(26px,4vh,40px)!important}' +
    '.tiles{max-width:min(92vw,1000px)!important}' +
    '.basket{min-width:clamp(140px,24vh,240px)!important;min-height:clamp(110px,18vh,180px)!important}' +
    '.bin{min-width:clamp(130px,22vh,230px)!important;min-height:clamp(120px,19vh,190px)!important}' +
    '.car{min-width:clamp(70px,11vh,110px)!important;height:clamp(62px,9.5vh,96px)!important;font-size:clamp(32px,5vh,50px)!important}' +
    '.spk{width:clamp(64px,9vh,88px)!important;height:clamp(64px,9vh,88px)!important;font-size:clamp(30px,4.2vh,40px)!important}' +
    'h1{font-size:clamp(26px,3.6vh,36px)!important}' +
    '}#home,h1 small{display:none!important}</style>';
  var GAME_VOICE = '<scr' + 'ipt>(function(){var P={},n=0;' +
    'var S={speak:function(u){var id=++n;P[id]=u;try{if(u.onstart)u.onstart();}catch(e){}try{parent.postMessage({k1say:String(u.text||""),id:id},"*");}catch(e){}},' +
    'cancel:function(){P={};try{parent.postMessage({k1hush:1},"*");}catch(e){}},getVoices:function(){return [];},pause:function(){},resume:function(){},' +
    'speaking:false,pending:false,paused:false,onvoiceschanged:null,addEventListener:function(){},removeEventListener:function(){}};' +
    'try{Object.defineProperty(window,"speechSynthesis",{value:S,configurable:true});}catch(e){}' +
    'if(!window.SpeechSynthesisUtterance){window.SpeechSynthesisUtterance=function(t){this.text=t;};}' +
    'window.addEventListener("message",function(e){var d=e.data;if(d&&d.k1said&&P[d.k1said]){var u=P[d.k1said];delete P[d.k1said];try{if(u.onend)u.onend();}catch(x){}}});' +
    '})();<\/scr' + 'ipt>';
  function dress(ovId) { try { var f = document.querySelector('#' + ovId + ' iframe'); if (!f || f.dataset.k1) return; var src = f.srcdoc || ''; if (!src) return; f.dataset.k1 = '1'; f.srcdoc = GAME_VOICE + GAME_CSS + src; } catch (e) {} }
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d || typeof d !== 'object' || (d.k1say == null && !d.k1hush)) return;
    var f = OVS.map(function (id) { return document.querySelector('#' + id + ' iframe'); }).filter(function (x) { return x && e.source === x.contentWindow; })[0]; if (!f) return;
    if (d.k1hush) { hush(); return; }
    var id = d.id; voice(String(d.k1say), function () { try { f.contentWindow.postMessage({ k1said: id }, '*'); } catch (x) {} });
  });
  function play(id) { var p = subjects().filter(function (x) { return x.k === A.subj; })[0]; if (!p) return; hush(); window[p.g].open(id); OVS.forEach(dress); }

  /* ---------- screens ---------- */
  function signinHtml() {
    var dots = ''; for (var i = 0; i < 4; i++) dots += '<i class="' + (i < A.pin.length ? 'on' : '') + '"></i>';
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clr', '0', 'go'].map(function (k) {
      if (k === 'clr') return '<button class="key soft" data-act="clr" aria-label="Clear">⌫</button>';
      if (k === 'go') return '<button class="key go" data-act="go" aria-label="Go"' + (A.pin.length === 4 && !A.busy ? '' : ' disabled') + '>▶</button>';
      return '<button class="key" data-act="key" data-k="' + k + '">' + k + '</button>'; }).join('');
    return '<div class="signin"><div class="logo">Tashbar Learning</div><div class="hello">Type your code</div><div class="dots">' + dots + '</div>' +
      (A.err ? '<div class="err" role="alert">' + E(A.err) + '</div>' : '') + '<div class="pad">' + keys + '</div></div>';
  }
  function k1Html() {
    var S = subjects(); if (!S.filter(function (s) { return s.k === A.subj; }).length) A.subj = S.length ? S[0].k : 'MATH';
    var p = S.filter(function (s) { return s.k === A.subj; })[0], ids = p ? list(p) : [];
    var nx = -1; for (var i = 0; i < ids.length; i++) if (!passed(p, ids[i])) { nx = i; break; } if (nx < 0 && ids.length) nx = 0;
    var first = String((A.st && A.st.name) || '').split(' ')[0];
    var h = '<div id="k1o" role="main"><div class="k1-top"><button class="k1-say" data-act="say" aria-label="Hear it">🔊</button><div class="k1-hi">' + (first ? 'Hi, ' + E(first) + '!' : 'Let\'s play!') + '</div>' +
      '<button class="k1-out" data-act="out" aria-label="Sign out">👋 Bye</button></div>';
    if (S.length > 1) h += '<div class="k1-subj" role="tablist">' + S.map(function (s) { return '<button role="tab" class="k1-s' + (s.k === A.subj ? ' on' : '') + '" data-act="subj" data-s="' + s.k + '" aria-label="' + E(s.n) + '"><span class="i">' + E(s.i) + '</span><span class="n">' + E(s.n) + '</span></button>'; }).join('') + '</div>';
    if (nx >= 0) h += '<button class="k1-play" data-act="play" data-id="' + E(ids[nx]) + '" aria-label="Play: ' + E(nameOf(p, ids[nx])) + '"><span class="pic">' + E(p.i) + '</span><span class="go">▶ PLAY</span></button>';
    h += '<div class="k1-path">' + ids.map(function (id, n) { var d = passed(p, id), lock = !(d || n === nx || n === 0);
      return '<button class="k1-t' + (d ? ' done' : '') + (n === nx ? ' now' : '') + (lock ? ' lock' : '') + '" data-act="' + (lock ? 'locked' : 'play') + '" data-id="' + E(id) + '" aria-label="' + E(nameOf(p, id)) + (d ? ', done' : lock ? ', locked' : '') + '">' +
        '<span class="pic">' + E(lock ? '🔒' : p.i) + '</span><span class="num">' + (n + 1) + '</span>' + (d ? '<span class="star">⭐</span>' : '') + '</button>'; }).join('') + '</div></div>';
    return h;
  }
  function pickHtml() {
    return '<div class="note"><h1>Hi, ' + E(String((A.st && A.st.name) || '').split(' ')[0]) + '!</h1><p>Test boy: which grade should 2.0 show?</p>' +
      '<div class="row"><button class="big" data-act="grade" data-g="0">Kindergarten</button><button class="big" data-act="grade" data-g="1">Grade 1</button></div>' +
      '<button class="link" data-act="out">Sign out</button></div>';
  }
  function noteHtml() {
    return '<div class="note"><h1>' + E(A.msg || 'Coming soon') + '</h1><p>For now, please use the regular app.</p>' +
      '<p><a class="big" href="https:' + '/' + '/' + 'tashbar-learning-live.web.app/">Open the regular app</a></p><button class="link" data-act="out">Sign out</button></div>';
  }
  var sigNow = '';
  function sig() { var b = A.st || {}; return JSON.stringify([A.view, A.subj, A.grade, A.pin, A.err, A.busy, b.klm, b.krm, b.kkm, b.g1m, b.g1r]); }
  function paint() {
    if (gameOpen() && A.view === 'home') return;
    var root = document.getElementById('app'); if (!root) return;
    document.body.className = 'v-' + A.view;
    root.innerHTML = A.view === 'signin' ? signinHtml() : A.view === 'home' ? k1Html() : A.view === 'pick' ? pickHtml() : noteHtml();
    sigNow = sig();
  }
  window.render = paint;

  /* ---------- sign-in, grade, sign-out ---------- */
  function signIn() {
    if (A.pin.length !== 4 || A.busy) return; A.busy = true; A.err = ''; paint(); var pin = A.pin;
    remote('msSignInCode', [pin]).then(function (r) {
      if (!r || !r.ok) { A.busy = false; A.pin = ''; A.err = 'That code didn’t work. Try again.'; return paint(); }
      SRV.token = r.token;
      if (r.role === 'staff' || r.role === 'parent') { A.busy = false; A.pin = ''; A.view = 'note'; A.msg = 'Staff and parent screens are not in 2.0 yet'; return paint(); }
      return remote('msLoad', [r.token]).then(function (d) {
        SRV.states = (d && d.states) || {};
        var me = ((d && d.roster) || []).filter(function (x) { return x.id === r.sid; })[0] || { id: r.sid, name: r.name };
        A.st = Object.assign({}, SRV.states[me.id] || {}, { id: me.id, name: me.name });
        try { sessionStorage.setItem('v2-session', JSON.stringify({ token: r.token, sid: me.id })); } catch (e) {}
        return remote('klMe', [r.token]).then(function (k) { return k && typeof k.grade === 'number' ? k.grade : null; }, function () { return null; });
      }).then(function (g) { A.busy = false; A.pin = ''; setGrade(g); });
    }).catch(function () { A.busy = false; A.pin = ''; A.err = 'Can’t reach the school. Check the Wi-Fi and try again.'; paint(); });
  }
  function setGrade(g) {
    A.grade = g;
    if (g === 0 || g === 1) { A.view = 'home'; paint(); setTimeout(function () { window.speak('Tap PLAY!'); }, 400); return; }
    if (g == null && /^TEST/i.test(String(A.st && A.st.id))) { A.view = 'pick'; return paint(); }
    A.view = 'note'; A.msg = 'Your grade is coming to 2.0 soon'; paint();
  }
  function signOut() {
    if (A.st && SRV.token && (SV.dirty || SRV.pendingEv.length)) saveNow();
    hush(); OVS.forEach(function (id) { var o = document.getElementById(id); if (o) o.remove(); });
    setTimeout(function () { A.st = null; SRV.token = null; SRV.pendingEv = []; A.view = 'signin'; A.pin = ''; A.err = ''; A.grade = null; try { sessionStorage.removeItem('v2-session'); } catch (e) {} paint(); }, 300);
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('#app [data-act]'); if (!b) return; e.preventDefault();
    var a = b.getAttribute('data-act');
    if (a === 'key') { if (A.pin.length < 4 && !A.busy) { A.pin += b.getAttribute('data-k'); A.err = ''; paint(); if (A.pin.length === 4) signIn(); } }
    else if (a === 'clr') { A.pin = A.pin.slice(0, -1); paint(); }
    else if (a === 'go') signIn();
    else if (a === 'out') signOut();
    else if (a === 'grade') setGrade(Number(b.getAttribute('data-g')));
    else if (a === 'subj') { A.subj = b.getAttribute('data-s'); paint(); }
    else if (a === 'play') play(b.getAttribute('data-id'));
    else if (a === 'locked') { b.classList.remove('k1-no'); void b.offsetWidth; b.classList.add('k1-no'); window.speak('Play the game before it first!'); }
    else if (a === 'say') window.speak('Tap PLAY!');
  });
  document.addEventListener('keydown', function (e) { if (A.view !== 'signin') return; if (/^[0-9]$/.test(e.key)) { if (A.pin.length < 4 && !A.busy) { A.pin += e.key; paint(); if (A.pin.length === 4) signIn(); } } else if (e.key === 'Backspace') { A.pin = A.pin.slice(0, -1); paint(); } });

  /* when a game closes, or his stars change, redraw the path; a closed game stops talking */
  var wasGame = false;
  setInterval(function () { var g = gameOpen(); if (wasGame && !g) { hush(); paint(); } wasGame = g; if (!g && A.view === 'home' && sigNow !== sig()) paint(); }, 1000);

  /* a reload keeps him signed in on this tab */
  function resume() {
    var s = null; try { s = JSON.parse(sessionStorage.getItem('v2-session') || 'null'); } catch (e) {}
    if (!s || !s.token) return paint();
    SRV.token = s.token; A.busy = true;
    remote('msLoad', [s.token]).then(function (d) {
      var me = ((d && d.roster) || []).filter(function (x) { return x.id === s.sid; })[0]; if (!me) throw new Error('gone');
      SRV.states = d.states || {}; A.st = Object.assign({}, SRV.states[me.id] || {}, { id: me.id, name: me.name });
      return remote('klMe', [s.token]).then(function (k) { return k && typeof k.grade === 'number' ? k.grade : null; }, function () { return null; });
    }).then(function (g) { A.busy = false; setGrade(g); }).catch(function () { A.busy = false; SRV.token = null; try { sessionStorage.removeItem('v2-session'); } catch (e) {} paint(); });
  }
  window.V2 = { paint: paint, voice: voice, packs: PACKS, setGrade: setGrade };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resume); else resume();
})();
