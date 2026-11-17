/* EVERYTHING ON FIREBASE (Head of School 2026-11-17: "Everything should be moved to the Firebase"). Claude Code builder.
   The app runs on tashbar-learning-live.web.app and its data lives on the Firebase server. A few pages are still drawn by this
   Apps Script link: the parent page (?pp=1), Curriculum Preview (?cp=1), daily sign-off (?so=1), the canteen kiosk (?canteen=1),
   a boy's placement check (?pl=1&check=1) and the Pathfinder (?pf=1, report, Read to Rebbe). Before this file they read and wrote the
   OLD spreadsheet copy, and the ones without their own code pad could not see the web.app sign-in at all.
   Now:
   1. Every one of those pages sends every server call to the Firebase server (FireBridgeUI.html, put at the top of the page),
      so they read and write the same records as the rest of the app. Builders can still open the old copy with &old=1.
   2. A person signed in on web.app who taps a link to one of those pages carries the sign-in over with a one-time code
      (tlHandoff: random, good for 2 minutes, works once; FireLinks.html on web.app). The page trades it back (tlHandoffRedeem).
      The sign-in itself never goes in a link. Same rules as the Pathfinder hand-off (PathfinderGate.js), for kid, staff and parent.
   3. Any other old link with settings (?ms=1, ?ms=1&staff=1, ?sg=1 ...) now forwards to web.app like the plain link does.
   Nothing about sign-in rules, money, parent emails or the microphone changes. */
var TL_FIRE = {
  API: 'https:' + '//api-q26c275eaa-uk.a.run.app/',
  PAGES: ['pp', 'cp', 'so', 'canteen', 'pf']   /* pages drawn here whose calls now go to Firebase; plus a boy's placement check (?pl=1&check=1) */
};
function tlFirePage_(p) { return TL_FIRE.PAGES.some(function (k) { return p[k] === '1'; }) || (p.pl === '1' && p.check === '1'); }
/* still drawn here: those pages and Spark Path (no server calls). Plain ?pl=1 is the old sign-in screen, so it goes to web.app too. */
function tlFireStays_(p) { return tlFirePage_(p) || p.spark === '1'; }

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.old !== '1' && Object.keys(p).length && !tlFireStays_(p) && typeof tlForward_ === 'function') {
    var fw = tlForward_({ parameter: p.sg === '1' || p.staff === '1' ? { sg: '1' } : {} }); if (fw) return fw;   /* 3. old links go to web.app */
  }
  return tlFireWrap_(e, tlDoGetBase_(e));
}

/* 1. put the Firebase bridge at the top of the page (right after <head>) */
function tlFireWrap_(e, out) {
  var p = (e && e.parameter) || {};
  if (p.old === '1' || !out || typeof out.getContent !== 'function' || !tlFirePage_(p)) return out;
  try {
    var cfg = { api: TL_FIRE.API, home: typeof TL_NEW_SITE === 'string' ? TL_NEW_SITE : 'https:' + '//tashbar-learning-live.web.app/',
      tlh: /^[0-9a-f]{24}$/.test(String(p.tlh || '')) ? String(p.tlh) : '' };
    var add = '<script>window.TL_FIRE=' + JSON.stringify(cfg).replace(/</g, '\\u003c') + ';</script>' + HtmlService.createHtmlOutputFromFile('FireBridgeUI').getContent();
    var html = out.getContent(), i = html.search(/<head[^>]*>/i);
    if (i >= 0) { var j = html.indexOf('>', i) + 1; html = html.slice(0, j) + add + html.slice(j); }
    else { var d = html.match(/^\s*<!doctype[^>]*>/i); html = d ? d[0] + add + html.slice(d[0].length) : add + html; }
    out.setContent(html);
  } catch (x) {}
  return out;
}

/* 2. the one-time sign-in hand-off (any signed-in kid, staff member or parent) */
function tlHandoff(token) {
  var s = msSession_(token); if (!s || ['kid', 'staff', 'parent'].indexOf(s.role) < 0) throw new Error('Please sign in again.');
  var code = Utilities.getUuid().replace(/-/g, '').slice(0, 24);
  CacheService.getScriptCache().put('tl_ho_' + code, JSON.stringify({ token: String(token), role: String(s.role), sid: s.sid == null ? null : String(s.sid) }), 120);
  return code;
}
function tlHandoffRedeem(code) {
  code = String(code || ''); if (!/^[0-9a-f]{24}$/.test(code)) return null;
  var c = CacheService.getScriptCache(), raw = c.get('tl_ho_' + code); if (!raw) return null;
  c.remove('tl_ho_' + code);
  var o = JSON.parse(raw);
  try { var s = msSession_(o.token); if (!s || String(s.role) !== o.role || (s.sid == null ? null : String(s.sid)) !== o.sid) return null; } catch (e) { return null; }
  return { token: o.token, role: o.role, sid: o.sid };
}
