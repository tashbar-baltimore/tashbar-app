/* UPGRADE Phase 4 (2026-11-10): one design system ("Royal Gold") for every page.
   tlTheme_(html, kind) adds the Google font link and the matching <style> block from Theme.html before </head>.
   kind: 'boy' (sign-in, home, lessons), 'staff' (staff grid, sign-off, placement, old teacher page), 'canteen' (kiosk).
   If anything goes wrong the page is returned unchanged (old look). */
function tlTheme_(html, kind) {
  try {
    var t = HtmlService.createHtmlOutputFromFile('Theme').getContent();
    var link = (t.match(/<link id="theme-font"[^>]*>/) || [''])[0];
    var css = (t.match(new RegExp('<style id="theme-' + kind + '">[\\s\\S]*?<\\/style>')) || [''])[0];
    if (!css) return html;
    var add = link + css, i;
    try { if (typeof tlLogoTag_ === 'function') add += tlLogoTag_(); } catch (e) {}   /* v79: school logo in every page header (Logo.js) */
    i = html.indexOf('</head>');
    return i < 0 ? add + html : html.slice(0, i) + add + html.slice(i);
  } catch (e) { return html; }
}
function tlThemePage_(file, kind) { return HtmlService.createHtmlOutput(tlTheme_(HtmlService.createHtmlOutputFromFile(file).getContent(), kind)); }
/* Editor test: every page type gets its block. */
function zzThemeSelfTest() {
  var page = '<html><head><title>x</title></head><body></body></html>';
  return ['boy', 'staff', 'canteen'].map(function (k) { var o = tlTheme_(page, k); return k + ': ' + (o.indexOf('id="theme-' + k + '"') > 0 && o.indexOf('theme-font') > 0 ? 'ok' : 'FAIL'); }).join('\n');
}
