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

/* 4. ALL PAGES ON FIREBASE (Head of School 2026-11-19: "move everything to Firebase"). The pages above were still DRAWN by this
   Apps Script link, which takes several seconds to open each time. Now the site builder (web/build.js) draws each one once at
   publish time with apiPageHtml and puts it on the Firebase site as a plain fast file: /pages/<kind>/ (the link's settings stay
   in ?...). On web.app, boot.js and FireLinks.html send ?canteen=1 etc. there instead of here. The page gets a small stand-in for
   google.script (settings from the link, "home" = the site) and FireBridgeUI.html, so every call goes to the Firebase server and
   a sign-in carried by a one-time code (&tlh=) still works. No sign-in rule, money or data changes. */
var TL_PAGE_KINDS = { canteen: { canteen: '1' }, so: { so: '1' }, pl: { pl: '1', check: '1' }, pp: { pp: '1' }, cp: { cp: '1' },
  spark: { spark: '1' }, pf: { pf: '1' }, pfstaff: { pf: '1', report: '1' } };
function apiPageHtml(kind) {
  var p = TL_PAGE_KINDS[String(kind || '')]; if (!p) throw new Error('Unknown page.');
  var e = { parameter: JSON.parse(JSON.stringify(p)) }, out = tlDoGetBase_(e), html = out && typeof out.getContent === 'function' ? out.getContent() : '';
  if (!html || html.indexOf('Tashbar has moved') >= 0) throw new Error('Page ' + kind + ' did not draw.');
  var shim = '<script>(function(){var q={},h=location.hash,s=(location.search||"").replace(/^\\?/,"");'
    + 's.split("&").forEach(function(kv){if(!kv)return;var i=kv.indexOf("="),k=decodeURIComponent((i<0?kv:kv.slice(0,i)).replace(/\\+/g," ")),v=i<0?"":decodeURIComponent(kv.slice(i+1).replace(/\\+/g," "));if(!(k in q))q[k]=v;});'
    + 'var t=/^[0-9a-f]{24}$/.test(q.tlh||"")?q.tlh:"";if(t){delete q.tlh;try{history.replaceState(null,"",location.pathname+location.search.replace(/([?&])tlh=[^&]*&?/,"$1").replace(/[?&]$/,"")+h);}catch(x){}}'
    + 'var ps={};Object.keys(q).forEach(function(k){ps[k]=[q[k]];});'
    + 'window.TL_FIRE={api:' + JSON.stringify(TL_FIRE.API) + ',home:location.origin+"/",tlh:t};window.TL_STATIC_PAGE=' + JSON.stringify(String(kind)) + ';'
    + 'window.google=window.google||{};google.script={url:{getLocation:function(cb){cb({parameter:q,parameters:ps,hash:(h||"").replace(/^#/,"")});}},'
    + 'host:{close:function(){},setHeight:function(){},setWidth:function(){},origin:location.origin,editor:{focus:function(){}}},history:{push:function(){},replace:function(){},setChangeHandler:function(){}}};'
    + '})();<\/script>' + HtmlService.createHtmlOutputFromFile('FireBridgeUI').getContent();
  var i = html.search(/<head[^>]*>/i);
  if (i >= 0) { var j = html.indexOf('>', i) + 1; html = html.slice(0, j) + shim + html.slice(j); }
  else { var d = html.match(/^\s*<!doctype[^>]*>/i); html = d ? d[0] + shim + html.slice(d[0].length) : shim + html; }
  return html;
}
