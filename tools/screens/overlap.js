module.exports = () => {
  const out = []; const pad = 4;
  const nm = e => (e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).split(' ')[0]) + ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) ? ' "' + e.textContent.trim().slice(0, 30) + '"' : '');
  document.querySelectorAll('.tlk-x').forEach(x => {
    const r = x.getBoundingClientRect(); if (!r.width || getComputedStyle(x).visibility === 'hidden') return;
    const box = x.closest('.ocard,.p3fc,#hlx-shelf,.kmg,.stbox,.hpsheet,.kkbox,#gm-room,.tq-ov,.tt-ov,#bl-ov,.rpzoom,[role=dialog]') || document.body;
    const R = { l: r.left - pad, t: r.top - pad, r: r.right + pad, b: r.bottom + pad }; const hits = new Set();
    box.querySelectorAll('*').forEach(e => {
      if (e === x || x.contains(e) || e.contains(x)) return;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
      const q = e.getBoundingClientRect(); if (!q.width || !q.height) return;
      if (q.right <= R.l || q.left >= R.r || q.bottom <= R.t || q.top >= R.b) return;
      const direct = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (direct || /^(BUTTON|IMG|svg|I|INPUT|SELECT|TEXTAREA|CANVAS|IFRAME|SPAN)$/i.test(e.tagName) && q.width * q.height < 20000) hits.add(nm(e));
    });
    /* anything drawn on top of the x */
    for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) { const px = r.left + r.width * i / 4, py = r.top + r.height * j / 4;
      for (const e of document.elementsFromPoint(Math.min(px, innerWidth - 1), Math.min(py, innerHeight - 1))) { if (e === x || x.contains(e)) break; if (e.closest('#tlclock,#ohsky') || getComputedStyle(e).pointerEvents === 'none') continue; hits.add('ON TOP: ' + nm(e)); } }
    out.push({ at: [Math.round(r.left), Math.round(r.top)], hits: [...hits] });
  });
  return out;
};
