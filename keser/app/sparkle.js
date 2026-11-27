/* A LITTLE SPARKLE (M. Heinemann 2026-11-27: "Some sparkles, a little bit of stuff to make it a little bit exciting, but not overwhelming. Still clean.")
   - a few small gold twinkles that softly come and go in the background (never more than a dozen, never over the buttons' text);
   - a tiny burst of gold stars where she taps a button or a card.
   "Reduce motion" turns the twinkles still and the bursts off. */
(function () {
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2z"/></svg>';
  var spots = [[7, 14], [16, 70], [26, 30], [33, 88], [48, 8], [58, 52], [66, 93], [74, 22], [84, 64], [91, 40], [12, 48], [40, 66]];
  var box = document.createElement('div'); box.className = 'k-twinkles'; box.setAttribute('aria-hidden', 'true');
  spots.forEach(function (s, i) { var t = document.createElement('i'); t.innerHTML = STAR;
    t.style.left = s[0] + '%'; t.style.top = s[1] + '%'; t.style.setProperty('--d', (i * 0.73 % 5).toFixed(2) + 's'); t.style.setProperty('--s', (11 + (i * 5) % 11) + 'px'); box.appendChild(t); });
  document.body.insertBefore(box, document.body.firstChild);
  if (calm) return;
  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest || !e.target.closest('button,a.k-btn,.choice')) return;
    for (var k = 0; k < 7; k++) { var s = document.createElement('i'); s.className = 'k-burst'; s.innerHTML = STAR;
      var a = k / 7 * Math.PI * 2, r = 26 + (k % 3) * 8;
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; s.style.setProperty('--x', Math.cos(a) * r + 'px'); s.style.setProperty('--y', Math.sin(a) * r + 'px');
      document.body.appendChild(s); setTimeout(function (n) { n.remove(); }.bind(null, s), 650); }
  }, true);
})();
