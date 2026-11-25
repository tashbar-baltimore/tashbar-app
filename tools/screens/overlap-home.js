/* Page function: for every visible house / Back (.tlk-home, .tlk-back) lists anything within 4 px of it and anything drawn on top of it.
   Empty hits = clean. (Same idea as overlap.js, which checks the pop-up ✕.) */
module.exports = () => {
  const out = []; const pad = 4;
  const nm = e => (e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).split(' ')[0]) + ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) ? ' "' + e.textContent.trim().slice(0, 30) + '"' : '');
  document.querySelectorAll('.tlk-home,.tlk-back').forEach(x => {
    const r = x.getBoundingClientRect(); if (!r.width || getComputedStyle(x).visibility === 'hidden') return;
    const R = { l: r.left - pad, t: r.top - pad, r: r.right + pad, b: r.bottom + pad }; const hits = new Set();
    document.body.querySelectorAll('*').forEach(e => {
      if (e === x || x.contains(e) || e.contains(x)) return;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
      const q = e.getBoundingClientRect(); if (!q.width || !q.height) return;
      if (q.right <= R.l || q.left >= R.r || q.bottom <= R.t || q.top >= R.b) return;
      /* covered by the page on top of it (e.g. the old home's logo under the full page): the boy cannot see it, so it does not touch */
      const ex = Math.min(Math.max(q.left + q.width / 2, 0), innerWidth - 1), ey = Math.min(Math.max(q.top + q.height / 2, 0), innerHeight - 1);
      const top = document.elementsFromPoint(ex, ey).find(t => t !== x && !x.contains(t) && getComputedStyle(t).pointerEvents !== 'none'); if (top && top !== e && !e.contains(top) && !top.contains(e)) return;
      const direct = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (direct || /^(BUTTON|IMG|svg|I|INPUT|SELECT|TEXTAREA|CANVAS|IFRAME|SPAN|B)$/i.test(e.tagName) && q.width * q.height < 20000) hits.add(nm(e));
    });
    for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) { const px = r.left + r.width * i / 4, py = r.top + r.height * j / 4;
      for (const e of document.elementsFromPoint(Math.min(px, innerWidth - 1), Math.min(py, innerHeight - 1))) { if (e === x || x.contains(e)) break; if (e.closest('#tlclock,#ohsky') || getComputedStyle(e).pointerEvents === 'none') continue; hits.add('ON TOP: ' + nm(e)); } }
    out.push({ k: x.classList.contains('tlk-home') ? 'home' : 'back', at: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], hits: [...hits] });
  });
  return out;
};
