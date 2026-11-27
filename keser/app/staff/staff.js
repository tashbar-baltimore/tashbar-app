/* KESER GIRLS 3.0 · STAFF PAGE. Talks only to the Keser part of the server (server/keser.js: {api:1, keser:'<call>'}),
   which keeps the girls' records in their own database. The staff token lives in this tab only (sessionStorage).
   A girl's code is shown once, on the code screen, and is never kept on this computer. KSTAFF at the end is for the tests. */
const API = window.KESER_API || 'https://api-q26c275eaa-uk.a.run.app';
const $ = id => document.getElementById(id);
const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8'];
const CROWNS = { gold: '#D4AA50', rose: '#E58FB0', pearl: '#EDE6DA', sapphire: '#3F63C8', emerald: '#2E9B6E', amethyst: '#8B5CC4', ruby: '#B8264A' };
const S = { token: '', me: null, girls: [], girl: null, code: '', form: null, codeBack: 'home' };
try { S.token = sessionStorage.getItem('keser.staff') || ''; } catch (e) {}

async function call(fn, ...args) {
  let j; try { const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, keser: fn, args }) }); j = await r.json(); }
  catch (e) { throw new Error('No connection. Try again.'); }
  if (!j || !j.ok) { const m = (j && j.error) || 'Something went wrong. Try again.'; if (/sign in again/i.test(m) && fn !== 'staffSignIn') signOut(); throw new Error(m); }
  return j.result;
}
function show(id) { document.querySelectorAll('section').forEach(s => s.classList.toggle('on', s.id === id)); $('out').hidden = !S.token || id === 'signin' || id === 'first';
  scrollTo(0, 0); const f = $(id).querySelector('h1'); if (f) { f.tabIndex = -1; f.focus({ preventScroll: true }); } }
const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lessonName = id => String(id).replace(/[._:-]+/g, ' · ');
const gradeName = g => g === 'K' ? 'Kindergarten' : 'Grade ' + g;
const when = at => { if (!at) return ''; const d = new Date(at), days = Math.floor((Date.now() - at) / 864e5);
  return days < 1 ? 'today' : days < 2 ? 'yesterday' : days < 7 ? days + ' days ago' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); };

/* ---------- sign in: one code pad ---------- */
let typed = '';
function drawDots() { $('dots').innerHTML = Array.from({ length: 8 }, (_, i) => '<i' + (i < typed.length ? ' class="f"' : '') + '></i>').join(''); }
$('pad').innerHTML = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'clear'].map(k => k === 'del' ? '<button data-k="del" aria-label="Delete">⌫</button>' : k === 'clear' ? '<button data-k="clear" aria-label="Clear">✕</button>' : '<button data-k="' + k + '">' + k + '</button>').join('');
$('pad').addEventListener('click', e => { const b = e.target.closest('button'); if (b) key(b.dataset.k); });
addEventListener('keydown', e => { if (!$('signin').classList.contains('on')) return; if (/^[0-9]$/.test(e.key)) key(e.key); else if (e.key === 'Backspace') key('del'); });
async function key(k) {
  if (k === 'del') typed = typed.slice(0, -1); else if (k === 'clear') typed = ''; else if (typed.length < 8) typed += k;
  $('msg').textContent = ''; drawDots();
  if (typed.length === 8) { const code = typed; typed = '';
    try { const r = await call('staffSignIn', code); signedIn(r.token, r.me); } catch (e) { $('msg').textContent = e.message; } drawDots(); }
}
function signedIn(token, me) { S.token = token; S.me = me; try { sessionStorage.setItem('keser.staff', token); } catch (e) {} home(); }
function signOut() { if (S.token) fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, keser: 'signOut', args: [S.token] }) }).catch(() => {});
  S.token = ''; S.me = null; S.girls = []; S.girl = null; try { sessionStorage.removeItem('keser.staff'); } catch (e) {} typed = ''; drawDots(); show('signin'); }
$('out').addEventListener('click', signOut);

/* ---------- first time: the setup word ---------- */
$('toFirst').addEventListener('click', () => { $('fMsg').textContent = ''; show('first'); });
$('fGo').addEventListener('click', async () => {
  $('fMsg').textContent = '';
  try { const r = await call('setupLead', $('fWord').value, $('fName').value); $('fWord').value = ''; showCode(r.staff.name + '’s staff code', r.code, 'signin'); }
  catch (e) { $('fMsg').textContent = e.message; }
});

/* ---------- a code, shown once ---------- */
function showCode(title, code, back) { $('h-code').textContent = title; $('codeNum').textContent = code; S.codeBack = back; show('code'); }
$('print').addEventListener('click', () => print());
$('codeDone').addEventListener('click', () => { $('codeNum').textContent = ''; const b = S.codeBack; if (b === 'card') openCard(S.girl.id); else if (b === 'signin') show('signin'); else home(); });

/* ---------- home ---------- */
function home() { $('h-home').textContent = 'Hello' + (S.me && S.me.name ? ', ' + S.me.name : ''); $('toStaff').hidden = !(S.me && S.me.role === 'lead'); show('home'); }
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
function go(where) { if (where === 'girls') return myGirls(); if (where === 'add') return openForm(null); if (where === 'home') return home();
  if (where === 'staffadd') { $('sName').value = ''; $('sMsg').textContent = ''; } show(where); }

/* ---------- my girls ---------- */
async function myGirls() {
  show('girls'); $('girlList').innerHTML = '<p class="none">Loading…</p>';
  try { S.girls = await call('girls', S.token); } catch (e) { $('girlList').innerHTML = '<p class="msg">' + esc(e.message) + '</p>'; return; }
  if (!S.girls.length) { $('girlList').innerHTML = '<p class="none">No girls yet. Go back and tap Add a girl.</p>'; return; }
  let html = '', cls = null;
  for (const g of S.girls) { if (g.cls !== cls) { if (cls !== null) html += '</ul>'; cls = g.cls; html += '<p class="cls">' + esc(cls || 'No class yet') + '</p><ul class="list">'; }
    html += '<li><button class="row" data-id="' + esc(g.id) + '"><span class="gem" style="background:' + CROWNS[g.crown] + '"></span><span>' + esc(g.first) + '<small>' + esc(gradeName(g.grade)) + '</small></span></button></li>'; }
  $('girlList').innerHTML = html + '</ul>';
}
$('girlList').addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (b) openCard(b.dataset.id); });

/* ---------- add a girl / change her profile ---------- */
$('aGrade').innerHTML = GRADES.map(g => '<button data-g="' + g + '" aria-pressed="false" aria-label="' + gradeName(g) + '">' + g + '</button>').join('');
$('aCrown').innerHTML = Object.entries(CROWNS).map(([k, c]) => '<button data-c="' + k + '" aria-pressed="false" aria-label="' + k + '" title="' + k + '" style="background:' + c + '"></button>').join('');
const pick = (box, attr, v) => box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset[attr] === v)));
$('aGrade').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { S.form.grade = b.dataset.g; pick($('aGrade'), 'g', b.dataset.g); } });
$('aCrown').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { S.form.crown = b.dataset.c; pick($('aCrown'), 'c', b.dataset.c); } });
function openForm(girl) {
  S.form = girl ? { id: girl.id, grade: girl.grade, crown: girl.crown } : { id: null, grade: '', crown: 'gold' };
  $('h-add').textContent = girl ? 'Change ' + girl.first : 'Add a girl'; $('aSave').textContent = girl ? 'Save' : 'Save and make her code';
  $('addBack').textContent = girl ? '← Her card' : '← Home';
  $('aFirst').value = girl ? girl.first : ''; $('aCls').value = girl ? girl.cls : ''; $('aMsg').textContent = '';
  pick($('aGrade'), 'g', S.form.grade); pick($('aCrown'), 'c', S.form.crown); show('add');
}
$('addBack').addEventListener('click', () => S.form && S.form.id ? openCard(S.form.id) : home());
$('aSave').addEventListener('click', async () => {
  $('aMsg').textContent = ''; const p = { first: $('aFirst').value, grade: S.form.grade, cls: $('aCls').value, crown: S.form.crown };
  if (!p.grade) { $('aMsg').textContent = 'Pick her grade.'; return; }
  try {
    if (S.form.id) { await call('editGirl', S.token, S.form.id, p); openCard(S.form.id); }
    else { const r = await call('addGirl', S.token, p); S.girl = r.girl; showCode(r.girl.first + '’s code', r.code, 'card'); }
  } catch (e) { $('aMsg').textContent = e.message; }
});

/* ---------- her card ---------- */
async function openCard(id) {
  show('card'); ['cDone', 'cTodo', 'cHard'].forEach(k => { $(k).innerHTML = ''; }); $('h-card').textContent = 'Loading…'; $('cSub').textContent = '';
  let c; try { c = await call('girlCard', S.token, id); } catch (e) { $('h-card').textContent = e.message; return; }
  S.girl = c.girl; const g = c.girl;
  $('h-card').textContent = g.first; $('cGem').style.background = CROWNS[g.crown];
  $('cSub').textContent = gradeName(g.grade) + (g.cls ? ' · ' + g.cls : '') + ' · ' + (c.last ? 'last here ' + when(c.last) : 'not started yet');
  const list = (el, items, row, empty) => { $(el).innerHTML = items.length ? items.map(row).join('') : '<li class="none">' + empty + '</li>'; };
  list('cDone', c.finished, x => '<li>' + esc(lessonName(x.lesson)) + '<small>' + esc(when(x.at)) + '</small></li>', 'Nothing finished yet.');
  list('cTodo', c.notDone, x => '<li>' + esc(lessonName(x.lesson)) + '<small>started ' + esc(when(x.at)) + '</small></li>', 'Nothing half done.');
  list('cHard', c.hard, x => '<li>' + esc(x.q) + '<small>' + esc(lessonName(x.lesson)) + ' · missed ' + (x.wrong === 1 ? 'once' : x.wrong === 2 ? 'twice' : x.wrong + ' times') + (x.right ? ', then got it' : '') + '</small></li>', 'Nothing yet.');
}
$('cEdit').addEventListener('click', () => S.girl && openForm(S.girl));
$('cCode').addEventListener('click', async () => {
  if (!S.girl || !confirm('Make a new code for ' + S.girl.first + '? Her old code will stop working.')) return;
  try { const r = await call('newCode', S.token, S.girl.id); showCode(S.girl.first + '’s new code', r.code, 'card'); } catch (e) { alert(e.message); }
});

/* ---------- add staff (lead only) ---------- */
$('sGo').addEventListener('click', async () => {
  $('sMsg').textContent = '';
  try { const r = await call('addStaff', S.token, $('sName').value); showCode(r.staff.name + '’s staff code', r.code, 'home'); } catch (e) { $('sMsg').textContent = e.message; }
});

/* ---------- start ---------- */
drawDots();
(async () => { if (!S.token) return show('signin');
  try { S.me = await call('staffMe', S.token); home(); } catch (e) { show('signin'); } })();
window.KSTAFF = { state: S, show };
