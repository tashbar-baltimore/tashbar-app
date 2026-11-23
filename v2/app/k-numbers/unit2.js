/* Kindergarten Numbers, Unit 2 ("Counting out loud to 10"): the stepping-stone path and the pieces its games share.
   U2.path(el, { from, to, reverse }) draws a straight path of stones; each stone shows its amount as dots (5 on top, the rest below,
   like a ten-frame), never a written numeral (boys do not read numerals yet). A shiny ball hops stone to stone as the voice counts.
   U2.drum(el) is a big drum to tap on each count. Also: Tatty's car (for the countdown) and loose stones to drag into a gap. */
(function () {
  var U2 = window.U2 = {};
  var css = document.createElement('style');
  css.textContent = [
    '.u2path{ position:relative; display:grid; grid-template-columns:repeat(var(--cols,10),1fr); gap:clamp(6px,1vw,14px); width:100%; max-width:1240px; align-items:center; padding:28px 4px 6px; }',
    '.u2stone{ position:relative; aspect-ratio:1; border-radius:42% 46% 44% 48%; background:radial-gradient(circle at 40% 30%,#FFFFFF,#E3ECF8 55%,#B9C9E0); border:4px solid #fff; box-shadow:0 7px 0 #8FA3C2, 0 12px 16px rgba(40,70,140,.25); display:flex; align-items:center; justify-content:center; transition:transform .2s, box-shadow .2s; touch-action:none; }',
    '.u2stone .dd{ position:absolute; inset:20% 6%; display:grid; grid-template-rows:1fr 1fr; gap:8%; }',
    '.u2stone .dd b{ display:flex; justify-content:center; align-items:center; gap:3%; }',
    '.u2stone .dd i{ width:17%; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle at 35% 30%,#FF9B8A,#E5322D 55%,#8E0E17); box-shadow:0 2px 0 rgba(90,0,10,.35); }',
    '.u2stone.star .dd{ display:flex; align-items:center; justify-content:center; } .u2stone.star svg{ width:56%; height:56%; }',
    '.u2stone.lit{ background:radial-gradient(circle at 40% 30%,#FFFBE0,#FFE27A 60%,#F4B400); box-shadow:0 7px 0 #C98A00, 0 0 0 6px rgba(255,201,61,.5); }',
    '.u2stone.been{ background:radial-gradient(circle at 40% 30%,#F1FFF5,#BDEFCF 60%,#7DD3A0); box-shadow:0 7px 0 #4FA674, 0 12px 16px rgba(40,70,140,.2); }',
    '.u2stone.gap{ background:rgba(255,255,255,.35); border:5px dashed #2FB5E8; box-shadow:none; animation:u2gap 1s infinite; }',
    '.u2stone.gap .dd{ display:none; } @keyframes u2gap{ 50%{ transform:scale(.92); } }',
    '.u2stone.tapme{ cursor:pointer; } .u2stone.tapme:hover{ transform:translateY(-4px); }',
    '.u2stone.bad{ animation:shake .45s; box-shadow:0 7px 0 #C0392B, 0 0 0 6px rgba(255,90,78,.45); }',
    '.u2ball{ position:absolute; width:var(--bw,60px); height:var(--bw,60px); left:0; top:0; z-index:4; pointer-events:none; transition:left .32s ease-in-out, top .32s ease-in-out; filter:drop-shadow(0 8px 5px rgba(0,0,0,.3)); }',
    '.u2ball.hop svg{ animation:u2hop .32s ease-in-out; } @keyframes u2hop{ 50%{ transform:translateY(-34px) scale(1.05,.95); } }',
    '.u2loose{ display:flex; gap:clamp(14px,3vw,36px); justify-content:center; min-height:clamp(84px,14vh,120px); }',
    '.u2loose .u2stone{ width:clamp(84px,14vh,120px); cursor:grab; }',
    '.u2loose .u2stone.picked{ box-shadow:0 7px 0 #C98A00, 0 0 0 7px rgba(255,201,61,.7); }',
    '.u2drum{ width:clamp(150px,30vh,250px); aspect-ratio:1; border-radius:50%; position:relative; cursor:pointer; touch-action:none; background:none; border:0; }',
    '.u2drum svg{ width:100%; height:100%; transition:transform .08s; filter:drop-shadow(0 12px 10px rgba(80,20,10,.3)); } .u2drum.hit svg{ transform:scale(.94,.9) translateY(6px); }',
    '.u2drum::after{ content:""; position:absolute; inset:10%; border-radius:50%; border:8px solid var(--sun); opacity:0; pointer-events:none; } .u2drum.hit::after{ animation:ring .35s ease-out; }',
    '.u2car{ width:clamp(120px,22vh,200px); transition:transform 1.4s cubic-bezier(.5,0,.8,.4); } .u2car.go{ transform:translateX(120vw); }',
    '@media (max-width:760px), (max-aspect-ratio:4/5){ .u2path{ --cols:5 !important; padding-top:34px; row-gap:44px; } }'
  ].join('\n');
  document.head.appendChild(css);

  var BALL = '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="95" rx="28" ry="4" fill="url(#nkShadow)"/><circle cx="50" cy="52" r="38" fill="url(#u2ballg)" stroke="#123E8A" stroke-width="3"/>' +
    '<path d="M16 46 C 34 58, 66 58, 84 46" stroke="#fff" stroke-width="7" fill="none" opacity=".85"/><ellipse cx="36" cy="34" rx="10" ry="7" fill="#fff" opacity=".75" transform="rotate(-25 36 34)"/></svg>';
  var DEFS = '<svg width="0" height="0" style="position:absolute"><defs><radialGradient id="u2ballg" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#9FE0FF"/><stop offset=".45" stop-color="#2F8FE8"/><stop offset="1" stop-color="#16408E"/></radialGradient>' +
    '<linearGradient id="u2car" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0FF"/><stop offset=".5" stop-color="#2F7FE0"/><stop offset="1" stop-color="#1B4F9E"/></linearGradient></defs></svg>';
  document.addEventListener('DOMContentLoaded', function () { var d = document.createElement('div'); d.innerHTML = DEFS; document.body.appendChild(d); });
  if (document.readyState !== 'loading') { var d0 = document.createElement('div'); d0.innerHTML = DEFS; document.body.appendChild(d0); }

  /* dots for 1..10: up to 5 on top, the rest below */
  U2.dots = function (n) { if (n === 0) return ''; if (n > 10 || n < 1) return '<svg viewBox="0 0 100 100"><use href="#nkStar"/></svg>'; var a = Math.min(5, n), b = n - a, h = '<span class="dd"><b>';
    for (var i = 0; i < a; i++) h += '<i></i>'; h += '</b><b>'; for (i = 0; i < b; i++) h += '<i></i>'; return h + '</b></span>'; };
  U2.stone = function (n) { var s = document.createElement('div'); s.className = 'u2stone' + (n > 10 ? ' star' : ''); s.dataset.n = n; s.innerHTML = U2.dots(n); return s; };

  /* the path: numbers from..to (or to..from when reverse) */
  U2.path = function (el, o) {
    el.innerHTML = ''; var nums = []; for (var n = o.from; n <= o.to; n++) nums.push(n); if (o.reverse) nums.reverse();
    var p = document.createElement('div'); p.className = 'u2path'; p.style.setProperty('--cols', nums.length); el.appendChild(p);
    var stones = nums.map(function (k, i) { var s = U2.stone(k); s.id = 'st' + i; s.dataset.i = i; p.appendChild(s); return s; });
    var ball = document.createElement('div'); ball.className = 'u2ball'; ball.innerHTML = BALL; ball.style.opacity = 0; p.appendChild(ball);
    var api = { el: p, stones: stones, nums: nums, at: -1, ball: ball };
    api.place = function (i, hop) {
      api.at = i; if (i < 0) { ball.style.opacity = 0; return; }
      var s = stones[i], w = s.offsetWidth * .62; ball.style.setProperty('--bw', w + 'px'); ball.style.opacity = 1;
      ball.style.left = (s.offsetLeft + s.offsetWidth / 2 - w / 2) + 'px'; ball.style.top = (s.offsetTop - w * .85) + 'px';
      if (hop) { ball.classList.remove('hop'); void ball.offsetWidth; ball.classList.add('hop'); NK.sound.pop(); }
      stones.forEach(function (x, k) { x.classList.toggle('lit', k === i); if (k < i && !x.classList.contains('gap')) x.classList.add('been'); });
    };
    api.reset = function () { stones.forEach(function (x) { x.className = 'u2stone' + (+x.dataset.n > 10 ? ' star' : ''); x.innerHTML = U2.dots(+x.dataset.n); }); api.place(-1); };
    api.gap = function (i) { stones[i].classList.add('gap'); stones[i].classList.remove('lit', 'been'); };
    api.fill = function (i) { stones[i].classList.remove('gap'); };
    addEventListener('resize', function () { if (api.at >= 0) api.place(api.at); });
    return api;
  };
  /* count along the path from stone a to stone b (inclusive), saying each number */
  U2.countAlong = async function (P, a, b, gapStop) {
    for (var i = a; i <= b; i++) { if (gapStop && P.stones[i].classList.contains('gap')) return i; P.place(i, true); await FR.say(FR.Word(P.nums[i]) + (i === b ? '.' : ','), { noRepeat: true }); }
    return -1;
  };
  U2.word = function (n) { var w = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']; return w[n] || String(n); };
  U2.Word = function (n) { var w = U2.word(n); return w.charAt(0).toUpperCase() + w.slice(1); };

  /* ---------- the "what comes next?" game, used by What Comes Next, Countdown and the Unit 2 check ----------
     A path with one empty stone. The voice counts along and stops at the gap: "What comes next?". Three loose stones wait below;
     tapping one says its number; he drags (or taps, then taps the gap) the right one into the gap. */
  U2.gapGame = function (o) {
    var $ = function (id) { return document.getElementById(id); }, P, R, done, slowNext = 0;
    function looseFor(nums, g) {
      var want = nums[g], c = [want], lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums);
      var opts = [want + 1, want - 1, want + 2, want - 2].filter(function (k) { return k >= Math.max(lo, 1) && k <= hi && k !== want; });
      while (c.length < 3 && opts.length) c.push(opts.splice(Math.floor(Math.random() * Math.min(2, opts.length)), 1)[0]);
      return FR.shuffle(c);
    }
    function hooks() {
      var good = document.querySelector('#loose .u2stone[data-n="' + R.want + '"]'), bad = document.querySelector('#loose .u2stone:not([data-n="' + R.want + '"])');
      GAME.right = function () { return [{ drag: ['#' + good.id, '#st' + R.g] }]; };
      GAME.wrong = bad ? function () { return [{ drag: ['#' + bad.id, '#st' + R.g] }]; } : null;
    }
    function nextWord() { return o.reverse ? 'counting down' : ''; }
    async function drop(src, tgt) {
      if (GAME.phase !== 'answer' || tgt.id !== 'st' + R.g) return; GAME.phase = 'busy'; FR.lock(true);
      var n = +src.dataset.n;
      if (n === R.want) {
        src.remove(); P.fill(R.g); P.place(R.g, true); NK.sound.yes();
        if (NK.said[NK.said.length - 1] !== U2.Word(n) + '!') await FR.say(U2.Word(n) + '!', { noRepeat: true });
        var end = Math.min(P.nums.length - 1, R.g + 2); await U2.countAlong(P, R.g + 1, end);
        if (o.afterRight) await o.afterRight(P, R);
        await FR.yes(P.stones[R.g], FR.pick(['Yes! You know what comes next!', 'Right! Good listening!', 'Yes! In order!']));
        var d = done; done = null; d(R.misses === 0); return;
      }
      FR.oops(P.stones[R.g]); R.misses++; if (!o.check) slowNext = 2;
      if (o.check || R.misses >= 2) {
        await FR.say('That says ' + U2.word(n) + '. Look: next comes ' + U2.word(R.want) + '.');
        if (o.check) { var w = document.querySelector('#loose .u2stone[data-n="' + R.want + '"]'); if (w) w.remove(); P.fill(R.g); P.place(R.g, true); await FR.say(U2.Word(R.want) + '.', { noRepeat: true }); var d2 = done; done = null; d2(false); return; }
      } else {
        await FR.say('That one says ' + U2.word(n) + ". Let's look and listen again.");
        await U2.countAlong(P, Math.max(0, R.g - 3), R.g - 1);
        await FR.say('What comes next?');
      }
      GAME.phase = 'answer'; FR.lock(false); hooks();
    }
    FR.game({
      id: o.id, title: o.title, rounds: o.rounds, hero: o.hero, endSay: o.endSay, chant: o.chant,
      init: function (F) {
        F.dragTap({ sources: '#loose .u2stone', targets: '#path .u2stone.gap', drop: drop });
        document.addEventListener('pointerdown', function (e) { var s = e.target.closest('#loose .u2stone'); if (s && GAME.phase === 'answer') { NK.hush(); NK.say(U2.Word(+s.dataset.n) + '!', { noRepeat: true }); } });
        if (o.init) o.init(F);
      },
      reset: function () { slowNext = 0; },
      demo: o.demo ? async function (F) { await o.demo(F, function (pl) { return setup(pl); }); } : null,
      bonus: o.bonus ? function (F) { return round(F, 0, o.bonus); } : null,
      round: function (F, i) { var pl = o.plan(i, slowNext > 0); if (slowNext > 0) slowNext--; return round(F, i, pl); }
    });
    function setup(pl) {
      P = U2.path($('path'), { from: pl.from, to: pl.to, reverse: o.reverse });
      var g = P.nums.indexOf(pl.gapN), s = P.nums.indexOf(pl.startN);
      R = { g: g, s: s, want: pl.gapN, misses: 0 }; P.gap(g);
      $('loose').innerHTML = ''; looseFor(P.nums, g).forEach(function (k, i) { var st = U2.stone(k); st.id = 'lo' + i; $('loose').appendChild(st); });
      return { P: P, R: R };
    }
    function round(F, i, pl) {
      return new Promise(async function (res) {
        GAME.phase = 'busy'; F.lock(true); setup(pl);
        if (o.beforeRound) await o.beforeRound(F, P, R, i);
        await F.wait(150);
        if (i === 0 || pl.say) await F.say(pl.say || (o.reverse ? "Let's count down." : "Let's count."));
        await U2.countAlong(P, R.s, R.g - 1);
        done = res; GAME.phase = 'answer'; F.lock(false); hooks();
        await F.say('What comes next?', { repeat: 'What comes next? Drag it in.' });
        if (i === 0 && !o.check) await F.say('Tap a stone to hear it.');
      });
    }
    return { get: function () { return { P: P, R: R }; } };
  };

  U2.DRUM = '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="112" rx="44" ry="6" fill="url(#nkShadow)"/>' +
    '<path d="M14 44 V 88 C 14 102, 106 102, 106 88 V 44 Z" fill="#E5322D" stroke="#7A0C14" stroke-width="4"/>' +
    '<path d="M14 50 L 34 92 L 54 52 L 74 94 L 94 52 L 106 76" stroke="#FFD23D" stroke-width="5" fill="none" stroke-linejoin="round"/>' +
    '<path d="M18 48 C 30 56, 90 56, 102 48" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/>' +
    '<ellipse cx="60" cy="44" rx="46" ry="16" fill="#FFF8EA" stroke="#7A4A1E" stroke-width="5"/><ellipse cx="48" cy="40" rx="18" ry="5" fill="#fff"/>' +
    '<path d="M86 10 L 66 40" stroke="#8A5220" stroke-width="6" stroke-linecap="round"/><circle cx="88" cy="8" r="7" fill="#FFD23D" stroke="#8A5220" stroke-width="3"/></svg>';
  U2.CAR = '<svg class="u2car" id="car" viewBox="0 0 160 90"><ellipse cx="80" cy="84" rx="70" ry="5" fill="url(#nkShadow)"/>' +
    '<path d="M12 60 C 12 46, 22 42, 40 40 L 54 20 C 58 14, 64 12, 72 12 H 104 C 112 12, 118 16, 122 22 L 134 40 C 148 42, 152 48, 152 60 V 68 C 152 72, 148 74, 144 74 H 20 C 15 74, 12 71, 12 66 Z" fill="url(#u2car)" stroke="#123E8A" stroke-width="4"/>' +
    '<path d="M60 22 H 82 V 40 H 48 Z" fill="#DFF3FF" stroke="#123E8A" stroke-width="3"/><path d="M90 22 H 106 C 110 22, 114 24, 116 28 L 124 40 H 90 Z" fill="#DFF3FF" stroke="#123E8A" stroke-width="3"/>' +
    '<circle cx="44" cy="74" r="13" fill="#2B2350" stroke="#fff" stroke-width="3"/><circle cx="44" cy="74" r="5" fill="#C3CCDA"/><circle cx="120" cy="74" r="13" fill="#2B2350" stroke="#fff" stroke-width="3"/><circle cx="120" cy="74" r="5" fill="#C3CCDA"/>' +
    '<circle cx="146" cy="56" r="4" fill="#FFE680"/><path d="M30 48 H 140" stroke="#fff" stroke-width="3" opacity=".4"/></svg>';
})();
