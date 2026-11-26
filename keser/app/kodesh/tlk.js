/* KESER KIT for the Kodesh lab: the same calls the lab makes in 1.0 (window.TLK: main, quiet, x, home, back, pill, ask, young, WORDS),
   drawn in Keser's look (kodesh/lab.css). Only what the lab uses. */
(function () {
  if (window.TLK) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var A = function (a) { return a ? ' ' + a : ''; };
  var X_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var HOME_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
  var BACK_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var WORDS = { start: 'Start', next: 'Next', back: '‹ Back', check: 'Check', close: 'Close', home: 'Back to Kodesh', leaveLesson: 'Leave this lesson', notNow: 'Not now' };
  var KINDS = { prog: 1, now: 1, subj: 1, lock: 1, rank: 1 };
  window.TLK = { WORDS: WORDS, KINDS: KINDS, X_SVG: X_SVG, HOME_SVG: HOME_SVG, BACK_SVG: BACK_SVG,
    main: function (t, a, x) { return '<button type="button" class="tlk tlk-main' + (x ? ' ' + x : '') + '"' + A(a) + '>' + esc(t) + '</button>'; },
    quiet: function (t, a, x) { return '<button type="button" class="tlk tlk-quiet' + (x ? ' ' + x : '') + '"' + A(a) + '>' + esc(t) + '</button>'; },
    x: function (a, place, label) { return '<button type="button" class="tlk tlk-x' + (place ? ' tlk-at-' + place : '') + '" aria-label="' + esc(label || WORDS.close) + '"' + A(a) + '>' + X_SVG + '</button>'; },
    home: function (a, place) { return '<button type="button" class="tlk tlk-home' + (place === '' ? '' : ' tlk-at-' + (place || 'tl')) + '" aria-label="' + WORDS.home + '"' + A(a) + '>' + HOME_SVG + '</button>'; },
    back: function (a, place) { return '<button type="button" class="tlk tlk-back' + (place === '' ? '' : ' tlk-at-' + (place || 'tl')) + '" aria-label="Back"' + A(a) + '>' + BACK_SVG + '</button>'; },
    young: function () { return false; },
    pill: function (kind, text) { return '<span class="tlk-pill tlk-' + (KINDS[kind] ? kind : 'prog') + '">' + esc(text) + '</span>'; },
    ask: function (o) { o = o || {}; return '<div class="tlk-ask">' + (o.icon ? '<div aria-hidden="true" style="font-size:40px;line-height:1">' + o.icon + '</div>' : '') + '<h2 style="margin:0">' + esc(o.title || '') + '</h2>' + (o.text ? '<p style="margin:0">' + esc(o.text) + '</p>' : '') +
      '<div class="tlk-actions">' + window.TLK.main(o.yes || WORDS.start, o.yesAttrs) + window.TLK.quiet(o.no || WORDS.notNow, o.noAttrs) + '</div></div>'; }
  };
})();
