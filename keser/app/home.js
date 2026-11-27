/* HOME: three choices, each goes straight in (M. Heinemann 2026-11-26).
   קודש opens the Chumash Lab; Timeline opens the Timeline (M. Heinemann 2026-11-27: only these two). 
   The lab (kodesh/) is loaded only when she picks קודש or Timeline. window.KHOME is for the tests. */
const $ = id => document.getElementById(id), body = document.body;
let labLoading = null;
function loadLab() {
  if (window.CLAB && window.CLAB.openLab) return Promise.resolve();
  if (labLoading) return labLoading;
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'kodesh/lab.css'; document.head.appendChild(css);
  const one = src => new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => bad(new Error('could not load ' + src)); document.body.appendChild(s); });
  labLoading = ['kodesh/tlk.js', 'kodesh/data.js', 'kodesh/pics.js', 'kodesh/lab.js'].reduce((p, src) => p.then(() => one(src)), Promise.resolve());
  return labLoading;
}
function go(where) {
  return loadLab().then(() => window.CLAB.openLab(where === 'timeline' ? 'tl' : undefined)).catch(e => console.warn('Keser lab: ' + e.message));
}
document.querySelectorAll('.choice').forEach(b => { b.onclick = () => { b.disabled = true; go(b.dataset.go).finally(() => { b.disabled = false; }); }; });
window.KHOME = { go };
