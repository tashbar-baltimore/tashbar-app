/* KESER GIRLS 3.0 · THE GIRLS' RECORDS (server only, no screens). HoS 2026-11-26; owner M. Heinemann (keser/README.md).
   The girls' records live in their OWN Firestore database, named "keser", in project tashbar-learning-live
   (M. Heinemann 2026-11-26, choice 1). This file is handed that database and nothing else: it never sees the boys'
   database, never loads the boys' server code (runtime.js, fsstore.js, src/), and refuses any database not named "keser".
   The boys' app never reaches this file: functions/index.js sends a request here only when it says {keser: ...},
   before any boys' code runs, and every boys' call keeps its old path.

   WHAT IS KEPT (collections in the "keser" database)
     girls/<id>        first name, grade, class, crown colour, place (everyone starts at the same place: 'start')
     girlcodes/<hash>  her private sign-in code, kept only as a keyed scramble (HMAC), never the code itself
     staff/<id>        a staff member's name and role ('lead' or 'staff')
     staffcodes/<hash> a staff sign-in code, kept the same way, apart from the girls' codes
     sessions/<hash>   who is signed in on a device (girl or staff), until when; the device holds the token, we keep its scramble
     steps/<id>        what she did: one lesson step, right or wrong, when, how long
     throttle/<hash>   wrong sign-in tries per device address, so codes cannot be guessed
     stepcount/<id>    how many steps a girl saved today (a cap, so no one can fill the records)
     sys/pepper        the random key for the scrambles (made on first use; it never leaves the server)

   THE RULES (each one tested in tests/lib/keserserver.js)
     - A girl signs in with her code and from then on the server knows who she is from her session.
       Nothing she sends can name another girl: girl calls take no girl id at all.
     - Staff codes are separate from girls' codes (different collections, different length) and checked here.
       A girl's session is refused on every staff call, and a staff session on every girl call.
     - A girl's code is shown ONCE, when it is made (Add a girl, New code). Lists and cards never carry a code.
       A new code ends the old one and signs her out everywhere.
     - Codes and tokens are never written to a log. Errors never repeat what was sent.
     - Only the calls listed in GIRL and STAFF exist here; any other name (for example a boys' call) is refused.
     - No money, points or gems: nothing here counts or pays anything.

   CALLS: route(body, ip, getDb, adminKey) with body = { api: 1, keser: '<call>', args: [...] }.
     girl:   signIn(code) · me(token) · saveSteps(token, steps) · signOut(token)
     staff:  staffSignIn(code) · girls(token) · addGirl(token, profile) · editGirl(token, id, profile)
             newCode(token, id) · girlCard(token, id) · addStaff(token, name) (lead only) · signOut(token)
     staff:  staffMe(token) · setupLead(setup word, name): the first lead, once, with a setup word Rabbi Khaver puts in the database
     first:  firstLead(name) with body.key = the server's admin key; works only while there are no staff at all. */
const crypto = require('crypto');

const DB_NAME = 'keser';
const GIRL_CODE_LEN = 6, STAFF_CODE_LEN = 8;
const GIRL_HOURS = 14, STAFF_HOURS = 12;
const TRY_WINDOW_MS = 10 * 60 * 1000, GIRL_TRIES = 60, STAFF_TRIES = 15, DAY_TRIES = 300;
const DAY_STEPS = 5000, SETUP_TRIES = 10;
const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8'];
const CROWNS = ['gold', 'rose', 'pearl', 'sapphire', 'emerald', 'amethyst', 'ruby'];
const START = 'start';
const MAX_STEPS = 60;

class KeserError extends Error {}
const no = m => { throw new KeserError(m); };

/* ---------- small helpers ---------- */
const sha = t => crypto.createHash('sha256').update(String(t)).digest('hex');
const now = () => Date.now();
const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const newId = p => p + crypto.randomBytes(9).toString('base64url');
const newToken = () => crypto.randomBytes(32).toString('base64url');
function newCode(len) { let s = ''; while (s.length < len) { const b = crypto.randomBytes(1)[0]; if (b < 250) s += String(b % 10); } return s; }

function checkDb(db) {
  if (!db || db.databaseId !== DB_NAME) no('The girls\' records may only use the "keser" database.');
  return db;
}
async function pepper(db) {
  const ref = db.collection('sys').doc('pepper');
  return db.runTransaction(async tx => { const d = await tx.get(ref); if (d.exists && d.data().k) return d.data().k;
    const k = crypto.randomBytes(32).toString('hex'); tx.set(ref, { k, made: new Date().toISOString() }); return k; });
}
const codeKey = (pep, kind, code) => crypto.createHmac('sha256', pep).update(kind + ':' + code).digest('hex');

/* ---------- profile ---------- */
function profile(p, base) {
  p = p && typeof p === 'object' ? p : {}; const o = Object.assign({}, base || {});
  if (p.first !== undefined || !base) { const f = clean(p.first, 30); if (!/^[\p{L}][\p{L}\p{M}' .-]*$/u.test(f)) no('Type her first name.'); o.first = f; }
  if (p.grade !== undefined || !base) { const g = clean(p.grade, 2).toUpperCase(); if (GRADES.indexOf(g) < 0) no('Pick her grade.'); o.grade = g; }
  if (p.cls !== undefined || !base) { o.cls = clean(p.cls, 30); }
  if (p.crown !== undefined || !base) { const c = clean(p.crown, 12).toLowerCase() || 'gold'; if (CROWNS.indexOf(c) < 0) no('Pick a crown colour.'); o.crown = c; }
  return o;
}
const girlOut = (id, g) => ({ id, first: g.first, grade: g.grade, cls: g.cls || '', crown: g.crown || 'gold', place: g.place || START });

/* ---------- sign-in, sessions, wrong tries ---------- */
/* Wrong tries are counted per device address (an IPv6 address by its /64 block), in the SAME transaction that looks the
   code up: parallel guesses cannot slip past the count, because the transaction reads the count and the code together
   and a wrong guess writes the count before it can be answered. A right code only reads (no lock-out from the school's
   own sign-ins at 8:30). Limits: GIRL_TRIES / STAFF_TRIES per ten minutes and DAY_TRIES per day per address. */
function addrOf(ip) { ip = String(ip || '?'); if (ip.indexOf(':') >= 0 && !/^::ffff:/i.test(ip)) return ip.split(':').slice(0, 4).join(':') + '::/64'; return ip.replace(/^::ffff:/i, ''); }
function over(t, limit) { if (!t) return false; const day = new Date().toISOString().slice(0, 10);
  return (now() - t.since < TRY_WINDOW_MS && t.n >= limit) || (t.day === day && t.dn >= DAY_TRIES); }
function counted(t) { const day = new Date().toISOString().slice(0, 10), fresh = !t || now() - t.since >= TRY_WINDOW_MS;
  return { since: fresh ? now() : t.since, n: fresh ? 1 : t.n + 1, day, dn: t && t.day === day ? t.dn + 1 : 1 }; }
async function signInWith(db, ip, code, kind) {
  const girl = kind === 'girl', len = girl ? GIRL_CODE_LEN : STAFF_CODE_LEN, limit = girl ? GIRL_TRIES : STAFF_TRIES; const pep = await pepper(db);
  const tref = db.collection('throttle').doc(codeKey(pep, 'ip-' + kind, addrOf(ip)));
  code = String(code == null ? '' : code).replace(/\s+/g, '');
  const cref = db.collection(girl ? 'girlcodes' : 'staffcodes').doc(codeKey(pep, kind, new RegExp('^[0-9]{' + len + '}$').test(code) ? code : 'x'));
  const v = await db.runTransaction(async tx => { const t = await tx.get(tref), c = await tx.get(cref); const td = t.exists ? t.data() : null;
    if (over(td, limit)) return { many: true };
    if (!c.exists) { tx.set(tref, counted(td)); return { bad: true }; }
    return { id: c.data().id, key: cref.id }; });
  if (v.many) no('Too many tries. Wait ten minutes and try again.');
  if (v.bad) no('That code did not open. Try again.');
  const who = await db.collection(girl ? 'girls' : 'staff').doc(v.id).get();
  if (!who.exists || who.data().off || who.data().codeKey !== v.key) no('That code did not open. Try again.');   /* a code replaced a moment ago */
  const token = newToken();
  await db.collection('sessions').doc(sha(token)).set({ kind, id: v.id, key: v.key, made: now(), until: now() + (girl ? GIRL_HOURS : STAFF_HOURS) * 3600e3 });
  return { token, who: who.data(), id: v.id };
}
async function session(db, token, kind) {
  if (typeof token !== 'string' || token.length < 30 || token.length > 100) no('Please sign in again.');
  const ref = db.collection('sessions').doc(sha(token)); const d = await ref.get();
  if (!d.exists) no('Please sign in again.');
  const s = d.data(); if (s.until < now()) { await ref.delete(); no('Please sign in again.'); }
  if (s.kind !== kind) no(kind === 'staff' ? 'This is for staff only.' : 'This is for girls only.');
  const m = await db.collection(kind === 'staff' ? 'staff' : 'girls').doc(s.id).get();
  if (!m.exists || m.data().off || m.data().codeKey !== s.key) no('Please sign in again.');   /* a new code ends every session opened with the old one */
  s.role = m.data().role; s.who = m.data(); return s;
}
async function endSessions(db, kind, id) {
  const q = await db.collection('sessions').where('id', '==', id).get(); const dels = [];
  q.forEach(d => { if (d.data().kind === kind) dels.push(db.collection('sessions').doc(d.id).delete()); });
  await Promise.all(dels);
}
/* make a fresh code that no one else has (girls and staff each have their own codes) */
async function giveCode(db, kind, id) {
  const pep = await pepper(db), col = db.collection(kind === 'girl' ? 'girlcodes' : 'staffcodes'), len = kind === 'girl' ? GIRL_CODE_LEN : STAFF_CODE_LEN;
  const owner = db.collection(kind === 'girl' ? 'girls' : 'staff').doc(id);
  for (let i = 0; i < 20; i++) {
    const code = newCode(len), ref = col.doc(codeKey(pep, kind, code));
    const got = await db.runTransaction(async tx => { const [c, o] = [await tx.get(ref), await tx.get(owner)]; if (c.exists) return false;
      const old = o.exists && o.data().codeKey; if (old) tx.delete(col.doc(old));
      tx.set(ref, { id, made: now() }); tx.set(owner, Object.assign({}, o.exists ? o.data() : {}, { codeKey: ref.id })); return true; });
    if (got) return code;
  }
  no('Could not make a new code. Try again.');
}

/* ---------- what she did ---------- */
function stepIn(x) {
  if (!x || typeof x !== 'object') no('A step was not readable.');
  const lesson = clean(x.lesson, 80), step = clean(x.step, 80), sid = clean(x.sid, 60);
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(lesson)) no('A step has no lesson.');
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(sid)) no('A step has no step number.');
  const o = { lesson, step, q: clean(x.q, 200), right: x.right === true, ms: Math.max(0, Math.min(36e5, Math.round(Number(x.ms) || 0))), done: x.done === true };
  if (x.right !== true && x.right !== false && !o.done) no('A step must say right or wrong.');
  o.sid = sid; return o;
}
function summary(rows) {
  const L = {}, Q = {}; let last = 0;
  rows.forEach(r => { last = Math.max(last, r.at || 0); const l = L[r.lesson] || (L[r.lesson] = { lesson: r.lesson, done: false, at: 0, steps: 0, right: 0, wrong: 0 });
    l.at = Math.max(l.at, r.at || 0); if (r.done) l.done = true; else { l.steps++; r.right ? l.right++ : l.wrong++; }
    if (!r.done && r.q) { const k = r.lesson + '\u0001' + r.q, q = Q[k] || (Q[k] = { lesson: r.lesson, q: r.q, wrong: 0, right: 0, at: 0 }); r.right ? q.right++ : q.wrong++; q.at = Math.max(q.at, r.at || 0); } });
  const lessons = Object.values(L).sort((a, b) => b.at - a.at);
  const hard = Object.values(Q).filter(q => q.wrong >= 2 || (q.wrong >= 1 && q.right === 0)).sort((a, b) => b.wrong - a.wrong || b.at - a.at).slice(0, 8);
  return { finished: lessons.filter(l => l.done).map(l => ({ lesson: l.lesson, at: l.at })),
    notDone: lessons.filter(l => !l.done).map(l => ({ lesson: l.lesson, at: l.at, steps: l.steps })),
    hard: hard.map(q => ({ lesson: q.lesson, q: q.q, wrong: q.wrong, right: q.right })), last: last || null };
}

/* ---------- the calls ---------- */
const GIRL = {
  async signIn(db, ip, code) { const r = await signInWith(db, ip, code, 'girl'); return { token: r.token, me: girlOut(r.id, r.who) }; },
  async me(db, ip, token) { const s = await session(db, token, 'girl'); return girlOut(s.id, s.who); },
  async saveSteps(db, ip, token, steps) {
    const s = await session(db, token, 'girl');
    if (!Array.isArray(steps) || !steps.length) return { saved: 0 }; if (steps.length > MAX_STEPS) no('Too many steps at once.');
    const list = steps.map(stepIn), at = now(), batch = db.batch();
    const cref = db.collection('stepcount').doc(s.id + '_' + new Date().toISOString().slice(0, 10));
    const room = await db.runTransaction(async tx => { const c = await tx.get(cref), n = c.exists ? c.data().n : 0; if (n + list.length > DAY_STEPS) return false; tx.set(cref, { n: n + list.length }); return true; });
    if (!room) no('That is a lot of learning for one day. Save again tomorrow.');
    /* the id comes from HER session and the device's step id, so sending the same step again keeps one copy */
    list.forEach(x => { const sid = x.sid; delete x.sid; batch.set(db.collection('steps').doc(sha(s.id + '|' + sid).slice(0, 40)), Object.assign(x, { girl: s.id, at })); });
    await batch.commit(); return { saved: list.length };
  },
  async signOut(db, ip, token) { if (typeof token === 'string' && token.length >= 30 && token.length <= 100) await db.collection('sessions').doc(sha(token)).delete(); return { out: true }; }
};
const STAFF = {
  async staffSignIn(db, ip, code) { const r = await signInWith(db, ip, code, 'staff'); return { token: r.token, me: { name: r.who.name, role: r.who.role } }; },
  async girls(db, ip, token) { await session(db, token, 'staff'); const q = await db.collection('girls').get(); const out = [];
    q.forEach(d => { const g = d.data(); if (!g.off) out.push(girlOut(d.id, g)); });
    return out.sort((a, b) => (a.cls || '').localeCompare(b.cls || '') || a.first.localeCompare(b.first)); },
  async addGirl(db, ip, token, p) { const s = await session(db, token, 'staff'); const g = profile(p); const id = newId('g');
    await db.collection('girls').doc(id).set(Object.assign(g, { place: START, made: now(), by: s.id }));
    const code = await giveCode(db, 'girl', id); return { girl: girlOut(id, g), code }; },
  async editGirl(db, ip, token, id, p) { await session(db, token, 'staff'); const ref = await girlRef(db, id); const old = (await ref.get()).data();
    const g = profile(p, old); await ref.set({ first: g.first, grade: g.grade, cls: g.cls, crown: g.crown }, { merge: true }); return girlOut(ref.id, g); },   /* only her profile: never her code or place */
  async newCode(db, ip, token, id) { await session(db, token, 'staff'); const ref = await girlRef(db, id);
    const code = await giveCode(db, 'girl', ref.id); await endSessions(db, 'girl', ref.id).catch(() => {}); return { code }; },   /* old sessions already stop (key check); this only tidies */
  async girlCard(db, ip, token, id) { await session(db, token, 'staff'); const ref = await girlRef(db, id); const g = (await ref.get()).data();
    const rows = []; (await db.collection('steps').where('girl', '==', ref.id).get()).forEach(d => rows.push(d.data()));
    return Object.assign({ girl: girlOut(ref.id, g) }, summary(rows)); },
  async addStaff(db, ip, token, name) { const s = await session(db, token, 'staff'); if (s.role !== 'lead') no('Only the lead can add staff.');
    return makeStaff(db, name, 'staff'); },
  async staffMe(db, ip, token) { const s = await session(db, token, 'staff'); return { name: s.who.name, role: s.who.role }; },
  /* THE VERY FIRST STAFF CODE (the lead), with no secret key: Rabbi Khaver types a setup word of his own into the "keser" database
     (collection sys, document setup, field word: at least 8 letters, or field hash: the word's sha256, written by the keser-setup job) in the Google Cloud console. The staff page's "First time" screen
     sends that word and his name; the server makes the lead and her or his code (shown once), then deletes the word. It works only
     once, only while there are no staff, and wrong words count as wrong tries (10 per ten minutes). */
  async setupLead(db, ip, word, name) {
    if (clean(name, 40).length < 2) no('Type your name.');
    const pep = await pepper(db), tref = db.collection('throttle').doc(codeKey(pep, 'ip-setup', addrOf(ip))), sref = db.collection('sys').doc('setup'), mark = db.collection('sys').doc('firstLead');
    word = String(word == null ? '' : word).trim();
    const v = await db.runTransaction(async tx => { const t = await tx.get(tref), st = await tx.get(sref), m = await tx.get(mark); const td = t.exists ? t.data() : null;
      if (over(td, SETUP_TRIES)) return { many: true };
      if (m.exists) return { done: true };
      const real = st.exists ? String(st.data().word || '').trim() : '', realHash = st.exists ? String(st.data().hash || '').toLowerCase() : '';
      if (!real && !/^[0-9a-f]{64}$/.test(realHash)) return { none: true };
      if (real && real.length < 8) return { short: true };
      /* the setup word may be kept as the word itself, or only as its sha256 (hash), so that the word never has to be written anywhere public */
      if (!crypto.timingSafeEqual(Buffer.from(real ? sha(real) : realHash, 'hex'), Buffer.from(sha(word), 'hex'))) { tx.set(tref, counted(td)); return { bad: true }; }
      tx.set(mark, { at: now() }); tx.delete(sref); return { ok: true }; });
    if (v.many) no('Too many tries. Wait ten minutes and try again.');
    if (v.done) no('Staff already exist. Sign in with your staff code.');
    if (v.none) no('The setup word is not in place yet.');
    if (v.short) no('The setup word must be at least 8 letters.');
    if (v.bad) no('That setup word is not right.');
    const any = await db.collection('staff').get(); if (any.size) no('Staff already exist. Sign in with your staff code.');
    return makeStaff(db, name, 'lead');
  },
  signOut: GIRL.signOut
};
async function girlRef(db, id) {
  id = String(id == null ? '' : id); if (!/^g[A-Za-z0-9_-]{6,20}$/.test(id)) no('Pick a girl.');
  const ref = db.collection('girls').doc(id); const d = await ref.get(); if (!d.exists || d.data().off) no('Pick a girl.'); return ref;
}
async function makeStaff(db, name, role) {
  const n = clean(name, 40); if (n.length < 2) no('Type the staff member\'s name.');
  const id = newId('s'); await db.collection('staff').doc(id).set({ name: n, role, made: now() });
  const code = await giveCode(db, 'staff', id); return { staff: { id, name: n, role }, code };
}
async function firstLead(db, key, adminKey, name) {
  if (!adminKey || typeof key !== 'string' || key.length !== adminKey.length || !crypto.timingSafeEqual(Buffer.from(key), Buffer.from(adminKey))) no('Not allowed.');
  if (clean(name, 40).length < 2) no('Type the staff member\'s name.');
  const mark = db.collection('sys').doc('firstLead');
  const first = await db.runTransaction(async tx => { const m = await tx.get(mark); if (m.exists) return false; tx.set(mark, { at: now() }); return true; });
  const any = await db.collection('staff').get(); if (!first || any.size) no('Staff already exist. A lead adds staff from the staff page.');
  return makeStaff(db, name, 'lead');
}

/* The one way in. Always answers { ok, result } or { ok: false, error } with a plain sentence; never echoes what was sent. */
async function route(body, ip, getDb, adminKey) {
  try {
    const fn = String(body && body.keser || ''), args = Array.isArray(body && body.args) ? body.args.slice(0, 4) : [];
    const call = Object.prototype.hasOwnProperty.call(GIRL, fn) ? GIRL[fn] : Object.prototype.hasOwnProperty.call(STAFF, fn) ? STAFF[fn] : null;
    if (!call && fn !== 'firstLead') return { ok: false, error: 'Not allowed.' };
    const db = checkDb(getDb());
    const result = fn === 'firstLead' ? await firstLead(db, body.key, adminKey, args[0]) : await call(db, String(ip || ''), ...args);
    return { ok: true, result };
  } catch (e) {
    if (e instanceof KeserError) return { ok: false, error: e.message };
    if (e && (e.code === 5 || /NOT_FOUND/.test(String(e.message)))) return { ok: false, error: 'The girls\' records are not set up yet.' };
    console.warn('keser: a call failed (' + String(e && e.code || '') + ')');   /* never the message: it could hold what was sent */
    return { ok: false, error: 'Something went wrong. Try again.' };
  }
}

module.exports = { route, DB_NAME, GIRL_CODE_LEN, STAFF_CODE_LEN, CROWNS, GRADES, START, summary };
