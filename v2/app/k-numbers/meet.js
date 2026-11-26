/* Kindergarten Numbers, Unit 1: MEET THE NUMBERS (used by meet123.html and meet45.html).
   Island rule: before any quick-looking game, each number is taught slowly, with no timer.
   A round MEETS a number: the card shows n things and stays in view, the voice names it ("This is two. Two apples."),
   the parts light up, he shows it on the big hand and presses the check. Later rounds ASK: "How many? Show me."
   A miss: the card lights up and the voice says the number again; a second miss shows it on the hand with him.
   Slow boy: the voice keeps naming the number. Quick boy: a bonus mixing all the numbers met so far. */
window.MeetGame = function (o) {   /* o: { id, title, hero, meet: [n...], ask: [n...], bonus: [n...], kinds: [...], extra: { n: line } } */
  var $ = function (id) { return document.getElementById(id); };
  var H, R, done, card, help = 0;
  var NAME = { apple: ['apple', 'apples'], orange: ['orange', 'oranges'], pear: ['pear', 'pears'], candle: ['candle', 'candles'], dots: ['dot', 'dots'] };
  function nm(k, n) { return NAME[k][n === 1 ? 0 : 1]; }
  function ready() { var c = $('check'); c.classList.toggle('dim', H.count() === 0); c.classList.toggle('ready', H.count() > 0 && GAME.phase === 'answer'); }
  function hooks() {
    GAME.right = function () { return FR.fingerTaps(H, R.n, '#bighand').concat([{ tap: '#check' }]); };
    GAME.wrong = function () { var w = R.n < 5 ? R.n + 1 : R.n - 1; return FR.fingerTaps(H, w, '#bighand').concat([{ tap: '#check' }]); };
  }
  function show(n, kind) {
    if (card) card.remove(); card = FR.card(n, kind, FR.LAYOUTS[n][0]); card.id = 'meetcard'; $('cardslot').appendChild(card);
  }
  async function check() {
    NK.unlock(); if (GAME.phase !== 'answer') return; var have = H.count(); if (!have) { FR.say('Tap the hand to show it.'); return; }
    GAME.phase = 'busy'; FR.lock(true); H.lock(true);
    if (have === R.n) {
      await FR.yes($('bighand'), FR.Word(R.n) + '! ' + FR.Word(R.n) + ' ' + nm(R.kind, R.n) + '.');
      var d = done; done = null; d(R.misses === 0); return;
    }
    FR.oops($('bighand')); R.misses++; if (R.misses >= 2) help = 2;
    await FR.say('Look again.'); await FR.showShape(card, true);
    if (R.misses >= 2) {   /* show it with him */
      await FR.say("Let's show " + FR.word(R.n) + ' together.'); H.set(0);
      for (var i = 0; i < R.n; i++) { H.finger(i).classList.remove('down'); NK.sound.pop(); await FR.say(FR.Word(i + 1) + '.', { noRepeat: true }); }
      await FR.say('Now you. Show ' + FR.word(R.n) + '.'); H.set(0);
    } else await FR.say('Show ' + FR.word(R.n) + ' on the hand.');
    GAME.phase = 'answer'; FR.lock(false); H.lock(false); ready(); hooks();
  }
  function round(F, n, kind, meet) {
    return new Promise(async function (res) {
      R = { n: n, kind: kind, misses: 0 }; H.set(0); H.lock(true); GAME.phase = 'busy'; F.lock(true); ready();
      show(n, kind);
      if (meet || help > 0) {
        await F.say('This is ' + F.word(n) + '. ' + F.Word(n) + ' ' + nm(kind, n) + '.');
        if (n > 1) await F.showShape(card, false);
        if (o.extra && o.extra[n] && meet) await F.say(o.extra[n]);
        await F.say('Show ' + F.word(n) + ' on the hand.', { repeat: 'Show ' + F.word(n) + ' on the hand.' });
        if (help > 0 && !meet) help--;
      } else await F.say('How many ' + nm(kind, 2) + '? Show me.', { repeat: 'How many ' + nm(kind, 2) + '? Show me on the hand.' });
      done = res; GAME.phase = 'answer'; F.lock(false); H.lock(false); ready(); hooks();
    });
  }
  var plan = [];
  FR.game({
    id: o.id, title: o.title, rounds: o.meet.length + o.ask.length, hero: o.hero, bonusSay: 'Bonus! All together!',
    init: function (F) { H = F.fingers(0, true); $('bighand').appendChild(H.el); H.onChange = ready; H.lock(true); $('check').addEventListener('click', check); },
    reset: function (F, again, slow) { help = slow ? 99 : 0; plan = o.meet.map(function (n) { return [n, true]; }).concat(F.shuffle(o.ask).map(function (n) { return [n, false]; })); },
    demo: async function (F) {
      show(o.demo, 'apple');
      await F.say('Watch me. This is ' + F.word(o.demo) + '. ' + F.Word(o.demo) + ' apples.');
      await F.say('I tap the hand. One finger each tap.');
      for (var k = 0; k < o.demo; k++) { await F.handTo(H.el, .45, .75); await F.handTap(); H.finger(k).classList.remove('down'); NK.sound.pop(); await F.say(F.Word(k + 1) + '.', { noRepeat: true }); }
      await F.handTo($('check')); await F.handTap();
      await F.yes($('bighand'), F.Word(o.demo) + '! Same as the apples.'); H.set(0);
    },
    round: function (F, i) { var p = plan[i]; return round(F, p[0], o.kinds[i % o.kinds.length], p[1]); },
    bonus: async function (F) { var b = F.shuffle(o.bonus).slice(0, 2); for (var k = 0; k < b.length; k++) await round(F, b[k], o.kinds[(k + 1) % o.kinds.length], false); }
  });
};
