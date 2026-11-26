/* Keser Girls 3.0 · the girls' records on the server (server/keser.js), tested with a stand-in Firestore and MADE-UP girls only.
   Every rule in the header of server/keser.js is checked here:
   - only the "keser" database is ever used; a missing database answers "not set up yet";
   - the first lead is made only with the admin key and only once; staff codes and girls' codes are separate;
   - a girl reads and writes only her own records (girl calls take no girl id); girl sessions are refused on staff calls and back;
   - a code is shown once; lists and cards never carry it; the database keeps only its scramble; a new code ends the old one;
   - wrong tries are limited per device address; sessions run out;
   - what she did comes back as finished / not done yet / found hard; the same step sent twice is kept once;
   - codes and tokens never reach a log; any other call name (a boys' call) is refused;
   - the boys' code never reaches the girls' database: only functions/index.js opens it, only for {keser: ...}, before any boys' code.
   Returns { fails: [...], oks: [...] }. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const { fake } = require(path.join(ROOT, 'server', 'fakefs.js'));
const K = require(path.join(ROOT, 'server', 'keser.js'));

module.exports = async function keserServer() {
  const fails = [], oks = [], t = (cond, m) => (cond ? oks : fails).push('keser records: ' + m);
  const logs = [], keep = { log: console.log, warn: console.warn, error: console.error };
  ['log', 'warn', 'error'].forEach(k => { console[k] = (...a) => logs.push(a.map(String).join(' ')); });
  const secrets = [];
  try {
    const db = fake(); db.databaseId = 'keser'; const KEY = 'made-up-admin-key-for-tests-0123456789';
    const call = (fn, args, ip, extra) => K.route(Object.assign({ api: 1, keser: fn, args: args || [] }, extra || {}), ip || '10.0.0.1', () => db, KEY);
    const err = r => (r && !r.ok ? r.error : '');

    /* the database */
    const boys = fake(); boys.databaseId = '(default)';
    t(/only use the "keser" database/.test(err(await K.route({ api: 1, keser: 'girls', args: [] }, 'x', () => boys, KEY))), 'the boys\' database (or any other) is refused');
    const gone = { databaseId: 'keser', collection: () => { const e = new Error('5 NOT_FOUND: The database keser does not exist'); e.code = 5; throw e; }, runTransaction: async () => { const e = new Error('5 NOT_FOUND'); e.code = 5; throw e; } };
    t(/not set up yet/.test(err(await K.route({ api: 1, keser: 'signIn', args: ['123456'] }, 'x', () => gone, KEY))), 'before the database is made, calls answer "not set up yet"');
    for (const fn of ['msLoad', 'msSignInCode', 'msSave', 'apiStaffPage', 'constructor', '__proto__', 'toString', 'firstLeadX']) t(err(await call(fn, [])) === 'Not allowed.', 'a call named ' + fn + ' is refused');

    /* the first lead and staff codes */
    t(err(await call('firstLead', ['Mrs. Made-up Lead'], null, { key: 'wrong' })) === 'Not allowed.', 'first lead: a wrong admin key is refused');
    t(err(await call('firstLead', ['Mrs. Made-up Lead'])) === 'Not allowed.', 'first lead: no admin key is refused');
    const lead = await call('firstLead', ['Mrs. Made-up Lead'], null, { key: KEY });
    t(lead.ok && /^[0-9]{8}$/.test(lead.result.code) && lead.result.staff.role === 'lead', 'first lead made with the admin key; staff codes have 8 digits');
    secrets.push(lead.result.code);
    t(/already exist/.test(err(await call('firstLead', ['Someone Else'], null, { key: KEY }))), 'first lead: only once (staff already exist)');
    const ss = await call('staffSignIn', [lead.result.code]); t(ss.ok && ss.result.token && ss.result.me.role === 'lead', 'the lead signs in with her staff code');
    const ST = ss.result.token; secrets.push(ST);
    t(/did not open/.test(err(await call('staffSignIn', ['00000000']))), 'a wrong staff code is refused');
    const st2 = await call('addStaff', [ST, 'Mrs. Made-up Teacher']); t(st2.ok && /^[0-9]{8}$/.test(st2.result.code), 'the lead adds a staff member (code shown once)');
    secrets.push(st2.result.code);
    const T2 = (await call('staffSignIn', [st2.result.code])).result.token; secrets.push(T2);
    t(/Only the lead/.test(err(await call('addStaff', [T2, 'Another'])) || ''), 'a staff member who is not the lead cannot add staff');

    /* girls */
    const a = await call('addGirl', [T2, { first: 'Tova', grade: '3', cls: 'Room 3A', crown: 'rose' }]);
    const b = await call('addGirl', [ST, { first: 'Esther Malka', grade: 'k', cls: 'K' }]);
    t(a.ok && b.ok && /^[0-9]{6}$/.test(a.result.code) && /^[0-9]{6}$/.test(b.result.code), 'staff add made-up girls; each gets a 6-digit code, shown once');
    secrets.push(a.result.code, b.result.code);
    t(b.ok && b.result.girl.grade === 'K' && b.result.girl.crown === 'gold' && a.result.girl.place === K.START && b.result.girl.place === K.START, 'every girl starts at the same place; crown colour defaults to gold');
    for (const bad of [{ first: '', grade: '3' }, { first: 'Tova', grade: '12' }, { first: 'Tova', grade: '3', crown: 'green-money' }, { first: '<script>', grade: '3' }]) t(!(await call('addGirl', [ST, bad])).ok, 'a bad profile is refused: ' + JSON.stringify(bad));
    const list = await call('girls', [T2]); const lj = JSON.stringify(list);
    t(list.ok && list.result.length === 2 && list.result.every(g => Object.keys(g).sort().join() === 'cls,crown,first,grade,id,place'), 'My girls: each girl has only id, first name, grade, class, crown, place');
    t(lj.indexOf(a.result.code) < 0 && lj.indexOf(b.result.code) < 0 && !/codeKey/.test(lj), 'My girls never carries a code or its scramble');
    const all = JSON.stringify([...db.docs.values()]); t(secrets.every(s => all.indexOf(s) < 0), 'the database keeps no code and no token, only scrambles');

    /* a girl signs in */
    t(/did not open/.test(err(await call('signIn', [lead.result.code]))), 'a staff code does not open the girls\' sign-in');
    t(/did not open/.test(err(await call('staffSignIn', [a.result.code]))), 'a girl\'s code does not open the staff sign-in');
    const ga = await call('signIn', [a.result.code]), gb = await call('signIn', [b.result.code]);
    t(ga.ok && gb.ok && ga.result.me.first === 'Tova' && gb.result.me.first === 'Esther Malka', 'each girl signs in with her own code and sees her own name');
    const A = ga.result.token, Bt = gb.result.token; secrets.push(A, Bt);
    const me = await call('me', [A, b.result.girl.id]); t(me.ok && me.result.id === a.result.girl.id, 'me: a girl always gets herself, even if another girl\'s id is sent');
    for (const [fn, args] of [['girls', [A]], ['girlCard', [A, b.result.girl.id]], ['girlCard', [A, a.result.girl.id]], ['addGirl', [A, { first: 'X', grade: '1' }]], ['editGirl', [A, b.result.girl.id, { grade: '8' }]], ['newCode', [A, b.result.girl.id]], ['addStaff', [A, 'X']]])
      t(/staff only/.test(err(await call(fn, args))), 'a girl\'s session is refused on ' + fn);
    for (const [fn, args] of [['me', [ST]], ['saveSteps', [ST, [{ lesson: 'L1', sid: '1', right: true }]]]]) t(/girls only/.test(err(await call(fn, args))), 'a staff session is refused on the girls\' ' + fn);
    t(/sign in again/.test(err(await call('me', ['x'.repeat(43)]))), 'a made-up token is refused');

    /* what she did */
    const steps = [
      { sid: 's1', lesson: 'KDS.SHORESH.1', step: 'q1', q: 'Find the shoresh of הָלַךְ', right: false, ms: 9000, girl: b.result.girl.id },
      { sid: 's2', lesson: 'KDS.SHORESH.1', step: 'q1', q: 'Find the shoresh of הָלַךְ', right: false, ms: 7000 },
      { sid: 's3', lesson: 'KDS.SHORESH.1', step: 'q2', q: 'Find the shoresh of שָׁמַר', right: true, ms: 4000 },
      { sid: 's4', lesson: 'KDS.SHORESH.1', step: 'end', done: true },
      { sid: 's5', lesson: 'KDS.MILIM.1', step: 'q1', q: 'What does אֶרֶץ mean?', right: false, ms: 5000 }
    ];
    const sv = await call('saveSteps', [A, steps]); t(sv.ok && sv.result.saved === 5, 'a girl saves her lesson steps (right or wrong, time)');
    await call('saveSteps', [A, steps.slice(0, 2)]);
    const mine = [...db.docs.entries()].filter(([k]) => k.indexOf('steps/') === 0).map(([, v]) => v);
    t(mine.length === 5, 'the same step sent twice is kept once (' + mine.length + ' kept)');
    t(mine.every(s => s.girl === a.result.girl.id), 'steps are kept under HER id even when another girl\'s id is sent with them');
    t(!(await call('saveSteps', [A, [{ sid: 'x', lesson: 'L', step: 'q' }]])).ok, 'a step that does not say right or wrong is refused');
    t(!(await call('saveSteps', [A, new Array(61).fill({ sid: 'x', lesson: 'L', right: true })])).ok, 'too many steps at once are refused');
    const card = await call('girlCard', [T2, a.result.girl.id]); const c = card.result || {};
    t(card.ok && c.finished.length === 1 && c.finished[0].lesson === 'KDS.SHORESH.1', 'her card: finished lessons');
    t(card.ok && c.notDone.length === 1 && c.notDone[0].lesson === 'KDS.MILIM.1', 'her card: not done yet');
    t(card.ok && c.hard.length === 2 && c.hard[0].q === 'Find the shoresh of הָלַךְ' && c.hard[0].wrong === 2, 'her card: found hard (the questions she got wrong most, first)');
    t(card.ok && JSON.stringify(c).indexOf(a.result.code) < 0 && !/codeKey/.test(JSON.stringify(c)), 'her card never carries her code');
    const cb = await call('girlCard', [ST, b.result.girl.id]); t(cb.ok && !cb.result.finished.length && !cb.result.hard.length && !cb.result.last, 'the other girl\'s card shows none of the first girl\'s work');
    t(/Pick a girl/.test(err(await call('girlCard', [ST, 'gNOSUCHGIRL']))) && /Pick a girl/.test(err(await call('girlCard', [ST, '../staff/x']))), 'a made-up girl id is refused');

    /* her profile and a new code */
    const ed = await call('editGirl', [ST, a.result.girl.id, { grade: '4', cls: 'Room 4B' }]);
    t(ed.ok && ed.result.grade === '4' && ed.result.first === 'Tova' && ed.result.crown === 'rose' && ed.result.place === K.START, 'staff change her grade and class; the rest stays');
    t(!(await call('editGirl', [ST, a.result.girl.id, { grade: 'Z' }])).ok, 'a bad grade is refused');
    const nc = await call('newCode', [ST, a.result.girl.id]); secrets.push(nc.result && nc.result.code);
    t(nc.ok && /^[0-9]{6}$/.test(nc.result.code) && nc.result.code !== a.result.code, 'New code makes a different 6-digit code (shown once)');
    t(/did not open/.test(err(await call('signIn', [a.result.code], '10.9.9.9'))), 'the old code no longer opens');
    t(/sign in again/.test(err(await call('me', [A]))), 'a new code signs her out on every device');
    t((await call('me', [Bt])).ok, 'the other girl stays signed in');
    const ga2 = await call('signIn', [nc.result.code]); t(ga2.ok && ga2.result.me.id === a.result.girl.id, 'the new code opens her own records'); secrets.push(ga2.result && ga2.result.token);
    t(card.ok && (await call('girlCard', [ST, a.result.girl.id])).result.finished.length === 1, 'her work stays with her after a new code');

    /* wrong tries and sessions that run out */
    for (let i = 0; i < 60; i++) await call('signIn', ['99999' + (i % 10)], '10.7.7.7');
    t(/Too many tries/.test(err(await call('signIn', [nc.result.code], '10.7.7.7'))), 'after 60 wrong tries from one device address (a whole school shares one), even a right code waits ten minutes');
    t((await call('signIn', [nc.result.code], '10.8.8.8')).ok, 'other devices are not blocked');
    for (let i = 0; i < 15; i++) await call('staffSignIn', ['1234567' + (i % 10)], '10.6.6.6');
    t(/Too many tries/.test(err(await call('staffSignIn', [lead.result.code], '10.6.6.6'))), 'staff sign-in allows 15 wrong tries per ten minutes');
    const par = await Promise.all(Array.from({ length: 90 }, (_, i) => call('signIn', [String(100000 + i)], '10.5.5.5')));
    const judged = par.filter(r => /did not open/.test(err(r))).length, cnt = [...db.docs.entries()].filter(([k]) => k.indexOf('throttle/') === 0).map(([, v]) => v);
    t(judged <= 60 && cnt.some(v => v.n === judged), 'guesses sent all at once cannot slip past the count (' + judged + ' of 90 checked, every one counted; the rest refused unchecked)');
    for (let i = 0; i < 60; i++) await call('signIn', ['88888' + (i % 10)], '2001:db8:1:2:aaaa::' + i);
    t(/Too many tries/.test(err(await call('signIn', [nc.result.code], '2001:db8:1:2:ffff::9'))), 'an IPv6 home network counts as one address (its /64)');
    const before = new Set(db.docs.keys()); await call('signIn', ['777777'], '10.2.2.2'); const day = new Date().toISOString().slice(0, 10);
    const dk = [...db.docs.keys()].find(k => k.indexOf('throttle/') === 0 && !before.has(k));
    Object.assign(db.docs.get(dk), { dn: 300, day, n: 0 });
    t(/Too many tries/.test(err(await call('signIn', [nc.result.code], '10.2.2.2'))), 'after 300 wrong tries in one day, that address waits until tomorrow');
    const twice = fake(); twice.databaseId = 'keser'; const both = await Promise.all([1, 2].map(n => K.route({ api: 1, keser: 'firstLead', args: ['Lead ' + n], key: KEY }, 'x', () => twice, KEY)));
    t(both.filter(r => r.ok).length === 1, 'two "first lead" calls at once make only one lead');
    const ga3 = await call('signIn', [nc.result.code], '10.3.3.3'); const A3 = ga3.result.token; secrets.push(A3);
    const gdoc = db.docs.get('girls/' + a.result.girl.id), keepKey = gdoc.codeKey; gdoc.codeKey = 'replaced-a-moment-ago';
    t(/sign in again/.test(err(await call('me', [A3]))), 'a session opened with a code that has since been replaced is refused');
    gdoc.codeKey = keepKey; t((await call('me', [A3])).ok, '(and works again with her current code)');
    db.docs.set('stepcount/' + a.result.girl.id + '_' + new Date().toISOString().slice(0, 10), { n: 4990 });
    t(/a lot of learning/.test(err(await call('saveSteps', [A3, Array.from({ length: 20 }, (_, i) => ({ sid: 'cap' + i, lesson: 'L1', right: true }))]))), 'a day\'s steps are capped (no one can fill the records)');
    for (const [k, v] of db.docs) if (k.indexOf('sessions/') === 0 && v.id === b.result.girl.id) v.until = Date.now() - 1;
    t(/sign in again/.test(err(await call('me', [Bt]))), 'a session that ran out is refused');
    t((await call('signOut', [ST])).ok && /sign in again/.test(err(await call('girls', [ST]))), 'sign out ends the session');

    /* nothing secret in any log */
    secrets.filter(Boolean).forEach(s => { if (logs.some(l => l.indexOf(s) >= 0)) fails.push('keser records: a code or token reached the log'); });
    oks.push('keser records: no code or token reached the log (' + logs.length + ' log lines)');

    /* the boys' code never reaches the girls' database */
    const idx = fs.readFileSync(path.join(ROOT, 'functions', 'index.js'), 'utf8'), kj = fs.readFileSync(path.join(ROOT, 'server', 'keser.js'), 'utf8');
    const iK = idx.indexOf('body.keser) return'), iA = idx.indexOf('body.admin) return'), iF = idx.indexOf("const fn = String((body && body.fn)");
    t(iK > 0 && iK < iA && iK < iF, 'functions/index.js answers a {keser} request before any boys\' code runs');
    t((idx.match(/databaseId/g) || []).length === 1 && /KDB = new Firestore\(\{ databaseId: 'keser' \}\)/.test(idx) && (idx.match(/keserDb/g) || []).length === 2 && (idx.match(/\bKDB\b/g) || []).length === 3, 'only the Keser route opens the "keser" database; no boys\' server gets it');
    t(!/require\([^)]*(runtime|fsstore|firestore|firebase)/i.test(kj) && !/new Firestore/.test(kj) && !/collection\(['"](sys)['"]\)\.doc\(['"]live/.test(kj), 'server/keser.js loads no boys\' code and opens no database of its own');
    const srcHits = fs.readdirSync(path.join(ROOT, 'src')).filter(f => /databaseId\s*:\s*['"]keser|keser\.js|['"]keser['"]/i.test(fs.readFileSync(path.join(ROOT, 'src', f), 'utf8')));
    t(!srcHits.length, 'no boys\' app file (src/) names the girls\' database' + (srcHits.length ? ': ' + srcHits.join(', ') : ''));
    const srvHits = fs.readdirSync(path.join(ROOT, 'server')).filter(f => f !== 'keser.js' && /keser/i.test(fs.readFileSync(path.join(ROOT, 'server', f), 'utf8')));
    t(!srvHits.length, 'no other server file reaches the girls\' records' + (srvHits.length ? ': ' + srvHits.join(', ') : ''));
  } catch (e) { fails.push('keser records test crashed: ' + String(e && e.stack || e).slice(0, 400)); }
  finally { Object.assign(console, keep); }
  return { fails, oks };
};

if (require.main === module) module.exports().then(r => { r.oks.forEach(m => console.log('ok    ' + m)); r.fails.forEach(m => console.log('FAIL  ' + m)); console.log(r.fails.length ? r.fails.length + ' FAILURE(S)' : 'ALL KESER RECORDS TESTS PASSED'); process.exit(r.fails.length ? 1 : 0); });
