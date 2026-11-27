/* HER SIGN-IN: four digits; the right code goes straight to home.html (choose קודש, Timeline or General Studies).
   Until the girls' records are built (keser/STAFF-PROMPT.md: a separate girls' database, M. Heinemann 2026-11-26), the only code is the
   practice code 1234 and nothing is sent anywhere. The tests read the KSIGN object. */
const $ = id => document.getElementById(id);
const PRACTICE = '1234', S = { code: '', tries: 0, open: false };
const keys = $('keys');
['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].forEach(k => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'key' + (k.length > 1 ? ' fn' : ''); b.dataset.k = k;
  b.textContent = k === 'clear' ? 'Clear' : k === 'back' ? '⌫' : k; if (k === 'back') b.setAttribute('aria-label', 'Delete');
  b.onclick = () => press(k); keys.appendChild(b); });
function show() { [...$('dots').children].forEach((d, i) => d.classList.toggle('on', i < S.code.length)); }
function press(k) {
  if (S.open) return;
  if (k === 'clear') S.code = ''; else if (k === 'back') S.code = S.code.slice(0, -1); else if (S.code.length < 4) S.code += k;
  show();
  if (S.code.length === 4) {
    if (S.code === PRACTICE) { S.open = true; $('msg').textContent = 'Welcome!'; setTimeout(() => { location.href = 'home.html'; }, 250); }
    else { S.tries++; const p = $('pad'); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); $('msg').textContent = 'That code is not right. Try again.';
      setTimeout(() => { S.code = ''; show(); }, 400); }
  }
}
addEventListener('keydown', e => { if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('back'); });
window.KSIGN = { state: S, press, practice: PRACTICE };
