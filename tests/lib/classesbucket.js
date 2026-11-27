/* YOUR CLASSES & BUCKET (src/ClassesBucket.js + tmMine in src/TeacherMode.js) on the real server code, MADE-UP boys and staff only.
   Walks a made-up afternoon by moving the server's clock (ycNow_):
   - Mon-Thu 1:20-1:55 Teacher Time 1, 1:55-2:30 Teacher Time 2, 2:30-3:30 Independent Study; 1:19, 3:30, Friday: app as usual.
   - In a Teacher Time period a boy in that class gets ONLY what the teacher assigned for today (and only if he is one of the boys it is for).
   - Nothing assigned: that period is Independent Study (no lock until he has a bucket).
   - Only boys put into a class with a period; K-1 never; the switch: 'test' = TEST- boys only, 'on' = everyone, 'off' = nobody.
   - Overrides: Free Play opens the app; Independent Study now; a teacher's live class newer than an override wins, and the other way.
   - A class's own times and a one-day change move the windows. Only the Head of School changes the school's schedule and the switch.
   - A teacher can only set up, assign and override for HIS classes. Returns { fails, oks }. */
const R = require('path').join(__dirname, '..', '..', 'server') + '/';
const { createRuntime } = require(R + 'runtime.js'), vm = require('vm');
module.exports = function () {
  const fails = [], oks = [], BOOK = 'SELFTEST_YC1';
  const store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } };
  const rt = createRuntime({ store }); const call = (fn, ...a) => rt.call(fn, a);
  if (rt.loadErrors.length) return { fails: rt.loadErrors.map(e => 'server file failed to load: ' + e), oks };
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
  TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
  call('msBootstrap');
  const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
  const boys = [['TEST-YC01', 'Made-up Boy A', '7511', 'grade 4'], ['TEST-YC02', 'Made-up Boy B', '7512', 'grade 1'], ['YCREAL01', 'Made-up Boy C', '7513', 'grade 4'],
    ['TEST-YC03', 'Made-up Boy D', '7514', 'grade 4'], ['TEST-YC04', 'Made-up Boy E', '7515', 'grade 5']];
  const roster = bk.tabs.MS_Roster.rows; boys.forEach((b, i) => { const row = roster[0].map(() => ''); row[0] = b[0]; row[1] = b[1]; row[5] = 'ycsalt' + i; row[6] = H('ycsalt' + i, b[2]); row[7] = true; row[8] = b[3]; roster.push(row); });
  boys.forEach(b => bk.tabs.MS_State.rows.push([b[0], JSON.stringify({ id: b[0], skills: {} }), new Date(), 1]));
  const tok = (t, id, name, role) => vm.runInContext("CacheService.getScriptCache().put('ms_tok_" + t + "', JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'" + id + "',name:'" + name + "',role:'" + role + "'}}), 6000)", rt.ctx);
  tok('yc-head', 'YCH', 'Made-up Head', 'head'); tok('yc-t1', 'YCT1', 'Made-up Teacher One', 'teacher'); tok('yc-t2', 'YCT2', 'Made-up Teacher Two', 'teacher');
  const chk = (c, msg) => { if (!c) fails.push('classes & bucket: ' + msg); return c; };
  const tryErr = (f) => { try { f(); return ''; } catch (e) { return String(e.message || e); } };
  /* the clock: Monday 30 Nov 2026 (EST, UTC-5) */
  const at = (day, hh, mm) => { const ms = Date.UTC(2026, 10, 30 + day, hh + 5, mm); vm.runInContext('ycNow_=function(){return ' + ms + ';}', rt.ctx); return ms; };
  at(0, 12, 0);
  const sign = code => { const si = call('msSignInFast', code); return si && si.ok ? si : null; };
  const kid = {}; boys.forEach(b => { kid[b[0]] = sign(b[2]); });
  if (!chk(Object.values(kid).every(Boolean), 'made-up boys could not sign in')) return { fails, oks };
  const mine = sid => call('tmMine', kid[sid].token);
  const built = JSON.parse(vm.runInContext('JSON.stringify(plBuilt_().slice(0,6))', rt.ctx));
  if (!chk(built.length >= 3, 'needs built lessons')) return { fails, oks };

  /* classes: Teacher One has class A (boys 01, 02, REAL, 04) = Teacher Time 1; Teacher Two has class B (boy 01) = Teacher Time 2 */
  const A = call('crSaveClass', 'yc-t1', { name: 'Made-up Math class', subject: 'Math', sids: ['TEST-YC01', 'TEST-YC02', 'YCREAL01', 'TEST-YC04'] })[0];
  const B = call('crSaveClass', 'yc-t2', { name: 'Made-up Chumash class', subject: 'Limudei Kodesh', sids: ['TEST-YC01'] })[0];
  chk(A && B, 'classes saved');
  chk(/which Teacher Time/.test(tryErr(() => call('ycAssign', 'yc-t1', A.id, '2026-11-30', [built[0]], []))), 'assigning before picking the period is refused');
  call('ycSetPeriod', 'yc-t1', A.id, 'T1'); call('ycSetPeriod', 'yc-t2', B.id, 'T2');
  chk(/your classes/.test(tryErr(() => call('ycSetPeriod', 'yc-t2', A.id, 'T2'))), "a teacher cannot set another teacher's class");
  chk(/your classes/.test(tryErr(() => call('ycAssign', 'yc-t2', A.id, '2026-11-30', [built[0]], []))), "a teacher cannot assign to another teacher's class");
  chk(/two weeks/.test(tryErr(() => call('ycAssign', 'yc-t1', A.id, '2026-12-30', [built[0]], []))), 'a day more than two weeks ahead is refused');
  const M = call('ycAssign', 'yc-t1', A.id, '2026-11-30', [built[0], 'NOT.A.LESSON'], []);
  chk(M.classes[0].assigned.length === 1 && M.classes[0].assigned[0].skills.join() === built[0], 'only real lessons are kept in an assignment (got ' + JSON.stringify(M.classes[0].assigned) + ')');

  /* the afternoon, default switch 'test' */
  at(0, 13, 19); chk(mine('TEST-YC01') === null, '1:19: the app is as usual');
  at(0, 13, 20); let r = mine('TEST-YC01');
  chk(r && r.yc && r.yc.k === 'T1' && r.skills.join() === built[0], '1:20: Teacher Time 1 locks him to the assigned lesson (got ' + JSON.stringify(r).slice(0, 200) + ')');
  chk(r && r.until === Date.UTC(2026, 10, 30, 18, 55) && r.yc.next && r.yc.next.k === 'T2' && r.yc.next.show === '1:55', 'Teacher Time 1 ends at 1:55 and says Teacher Time 2 is next');
  chk(r && r.by === 'Made-up Teacher One' && r.clsName === 'Made-up Math class', 'the lock names his teacher and class');
  const si = sign('7511'); chk(si && si.tm && si.tm.yc && si.tm.yc.k === 'T1', 'signing in at 1:20 lands straight on Teacher Time 1');
  chk(mine('TEST-YC02') === null, 'a grade 1 boy in the class is left out (K-1 keep their games)');
  chk(mine('YCREAL01') === null, "switch 'test': a real (non-TEST) boy is not locked");
  chk(mine('TEST-YC03') === null, 'a boy in no class is not touched');
  at(0, 13, 54); chk(mine('TEST-YC01') && mine('TEST-YC01').yc.k === 'T1', '1:54 is still Teacher Time 1');
  at(0, 13, 55); chk(mine('TEST-YC01') === null, '1:55: Teacher Time 2 with nothing assigned = Independent Study (no bucket yet: app as usual)');
  call('ycAssign', 'yc-t2', B.id, '2026-11-30', [built[1], built[2]], []);
  r = mine('TEST-YC01'); chk(r && r.yc.k === 'T2' && r.skills.join() === [built[1], built[2]].join() && r.yc.next && r.yc.next.k === 'IS' && r.yc.next.show === '2:30', '1:55 after assigning: Teacher Time 2 has his 2 lessons, Independent Study next');
  chk(mine('TEST-YC04') === null, 'a boy not in the Teacher Time 2 class is not locked then');
  at(0, 14, 30); chk(mine('TEST-YC01') === null, '2:30: Independent Study (no bucket yet: app as usual)');
  at(0, 15, 30); chk(mine('TEST-YC01') === null, '3:30: the app is as usual');
  at(4, 13, 30); chk(mine('TEST-YC01') === null, 'Friday: the app is as usual');
  at(0, 13, 30);
  /* only some boys: an assignment for boy 04 only */
  call('ycAssign', 'yc-t1', A.id, '2026-11-30', [built[3]], ['TEST-YC04']);
  chk(mine('TEST-YC01') === null && mine('TEST-YC04') && mine('TEST-YC04').skills.join() === built[3], 'work for chosen boys locks only them; the others get Independent Study');
  call('ycAssign', 'yc-t1', A.id, '2026-11-30', [built[0]], []);
  /* overrides */
  chk(/your students/.test(tryErr(() => call('ycOverride', 'yc-t2', { mode: 'free', minutes: 30, sids: ['TEST-YC04'] }))), "a teacher cannot give Free Play to a boy not in his classes");
  let o = call('ycOverride', 'yc-t1', { mode: 'free', minutes: 30, classId: A.id });
  chk(mine('TEST-YC01') === null, 'Free Play for the class opens the app');
  chk(o.overrides.length === 1 && o.overrides[0].mode === 'free', 'the teacher sees the running Free Play');
  chk(/who started/.test(tryErr(() => call('ycEndOverride', 'yc-t2', o.overrides[0].id))), 'another teacher cannot end it');
  call('ycEndOverride', 'yc-t1', o.overrides[0].id); chk(mine('TEST-YC01') && mine('TEST-YC01').yc.k === 'T1', 'ending Free Play brings back Teacher Time 1');
  at(0, 13, 31); o = call('ycOverride', 'yc-t1', { mode: 'IS', minutes: 20, sids: ['TEST-YC01'] });
  chk(mine('TEST-YC01') === null && mine('TEST-YC04') && mine('TEST-YC04').yc.k === 'T1', '"Independent Study now" for one boy moves only him');
  at(0, 13, 32); call('crStartClass', 'yc-t1', A.id, [built[4]], 20);
  r = mine('TEST-YC01'); chk(r && !r.yc && r.skills.join() === built[4], "a teacher's live class started after the override wins (\"give different work now\")");
  at(0, 13, 33); call('ycOverride', 'yc-t1', { mode: 'free', minutes: 10, sids: ['TEST-YC01'] });
  chk(mine('TEST-YC01') === null, 'Free Play started after the live class wins');
  at(0, 13, 44); r = mine('TEST-YC01'); chk(r && !r.yc && r.skills.join() === built[4], 'when Free Play runs out, the live class is back');
  call('crRunning', 'yc-t1').forEach(x => call('crEndClass', 'yc-t1', x.id));
  call('ycMine', 'yc-t1').overrides.forEach(x => call('ycEndOverride', 'yc-t1', x.id));
  chk(mine('TEST-YC01') && mine('TEST-YC01').yc.k === 'T1', 'with nothing live, the schedule decides again');
  /* class times: a class's own default, then a one-day change */
  call('ycSetPeriod', 'yc-t1', A.id, 'T1', '13:40', '14:10');
  at(0, 13, 30); chk(mine('TEST-YC01') === null, "class's own times 1:40-2:10: at 1:30 it is not class time yet");
  at(0, 13, 45); chk(mine('TEST-YC01') && mine('TEST-YC01').yc.k === 'T1' && mine('TEST-YC01').until === Date.UTC(2026, 10, 30, 19, 10), "class's own times: 1:45 is Teacher Time 1, until 2:10");
  call('ycSetPeriod', 'yc-t1', A.id, 'T1', '', '');
  call('ycSetToday', 'yc-t1', A.id, '2026-11-30', '13:25', '13:50');
  at(0, 13, 22); chk(mine('TEST-YC01') === null, 'today only 1:25-1:50: 1:22 is not class time');
  at(0, 13, 26); chk(mine('TEST-YC01') && mine('TEST-YC01').yc.k === 'T1', 'today only 1:25-1:50: 1:26 is Teacher Time 1');
  at(1, 13, 22); call('ycAssign', 'yc-t1', A.id, '2026-12-01', [built[0]], []); chk(mine('TEST-YC01') && mine('TEST-YC01').yc.k === 'T1', 'the one-day change is for that day only');
  at(0, 13, 30);
  /* the switch and the school schedule: Head of School only */
  chk(/Head of School/.test(tryErr(() => call('ycSaveSettings', 'yc-t1', { live: 'on' }))), 'a teacher cannot change the switch');
  call('ycSaveSettings', 'yc-head', { live: 'on' }); chk(mine('YCREAL01') && mine('YCREAL01').yc.k === 'T1', "switch 'on': a real boy in the class is locked too");
  chk(mine('TEST-YC02') === null, "switch 'on': grade 1 still left out");
  call('ycSaveSettings', 'yc-head', { live: 'off' }); chk(mine('TEST-YC01') === null && mine('YCREAL01') === null, "switch 'off': nobody is locked");
  call('ycSaveSettings', 'yc-head', { live: 'test', periods: { T1: { from: '13:00', to: '13:20' } } });
  call('ycSetToday', 'yc-t1', A.id, '2026-11-30', '', '');
  at(0, 13, 10); chk(mine('TEST-YC01') && mine('TEST-YC01').yc.k === 'T1', 'the Head of School can move Teacher Time 1 for the school');
  chk(/after the start/.test(tryErr(() => call('ycSaveSettings', 'yc-head', { periods: { T2: { from: '14:00', to: '13:00' } } }))), 'an end before the start is refused');
  chk(!/\$|cents|money/i.test(JSON.stringify(call('ycMine', 'yc-t1'))), 'no money on the staff screen data');
  /* INDEPENDENT STUDY: the bucket list */
  call('ycSaveSettings', 'yc-head', { periods: { T1: { from: '13:20', to: '13:55' } } });
  vm.runInContext("ycDayOf_=function(iso){ return '2026-11-30'; }", rt.ctx);   /* the ledger's "today" follows the made-up clock */
  at(0, 14, 40); chk(mine('TEST-YC01') === null, 'Independent Study with no bucket: the app is as usual');
  const BK = call('ycBuckets', 'yc-t1'); chk(BK.boys.length >= 4 && BK.subjects.some(x => x.k === 'MATH'), 'staff get the school\'s boys and the subject list');
  chk(/core/.test(tryErr(() => call('ycSaveBucket', 'yc-t1', ['TEST-YC01'], [], [{ t: 'subj', k: 'ELEC' }]))), 'add-ons with no core are refused');
  const L = built.filter(id => /^READ|^MATH/.test(id));
  call('ycSaveBucket', 'yc-t2', ['TEST-YC01', 'TEST-YC03'], [{ t: 'lesson', id: L[0] }, { t: 'lesson', id: L[1] }, { t: 'lesson', id: 'NOT.REAL' }], [{ t: 'lesson', id: L[2] }]);
  r = mine('TEST-YC01');
  chk(r && r.yc && r.yc.k === 'IS' && r.bucket && r.bucket.total === 2 && r.bucket.done === 0 && !r.bucket.complete, '2:40: Independent Study shows his bucket, 0 of 2 core done, made-up items dropped (got ' + JSON.stringify(r && r.bucket).slice(0, 200) + ')');
  chk(r && r.skills.join() === [L[0], L[1]].join(), 'only his core lessons open while the core is not done (add-ons locked)');
  chk(r && r.until === Date.UTC(2026, 10, 30, 20, 30) && !r.yc.next, 'Independent Study runs until 3:30, nothing after');
  chk(mine('TEST-YC03') && mine('TEST-YC03').yc.k === 'IS', 'a boy with a bucket and no class gets Independent Study too');
  at(0, 13, 30); chk(mine('TEST-YC03') === null, 'a bucket-only boy is not touched during Teacher Time');
  /* "done": what the server paid as mastered (the real save path), in any order */
  let q = 0; const master = (sid, id) => { const evr = [0, 1, 2].map(() => ({ skill: id, phase: 'check', item: 'yc' + (++q), ok: true, first: true, at: Date.now() }));
    return call('msSave', kid[sid].token, sid, { id: sid, skills: {} }, evr, [{ why: 'Mastered ' + id, amt: 10 }]); };
  at(0, 14, 45); master('TEST-YC01', L[1]);
  r = mine('TEST-YC01'); chk(r && r.bucket.done === 1 && r.bucket.core[1].done && !r.bucket.core[0].done, 'the second core item done first: 1 of 2 (any order)');
  master('TEST-YC01', L[0]);
  r = mine('TEST-YC01'); chk(r && r.bucket.complete && r.skills.indexOf(L[2]) >= 0, 'all core done: the add-ons open (got ' + JSON.stringify(r && r.bucket).slice(0, 200) + ')');
  /* an empty Teacher Time and "Independent Study now" both open the bucket */
  call('ycSaveBucket', 'yc-t2', ['TEST-YC04'], [{ t: 'lesson', id: L[0] }], []);
  call('ycAssign', 'yc-t1', A.id, '2026-11-30', [], []);
  at(0, 13, 30); r = mine('TEST-YC04'); chk(r && r.yc.k === 'IS' && r.yc.why === 'empty' && r.until === Date.UTC(2026, 10, 30, 18, 55), 'Teacher Time with nothing assigned opens his bucket until 1:55');
  call('ycAssign', 'yc-t1', A.id, '2026-11-30', [built[0]], []);
  chk(mine('TEST-YC04').yc.k === 'T1', 'once work is assigned, Teacher Time shows it');
  call('ycOverride', 'yc-t1', { mode: 'IS', minutes: 10, sids: ['TEST-YC04'] });
  r = mine('TEST-YC04'); chk(r && r.yc.k === 'IS' && r.yc.why === 'now' && r.until === Date.UTC(2026, 10, 30, 18, 40), '"Independent Study now" opens his bucket for the minutes picked');
  call('ycSaveBucket', 'yc-t2', ['TEST-YC04'], [], []); call('ycMine', 'yc-t1').overrides.forEach(x => call('ycEndOverride', 'yc-t1', x.id));
  chk(!call('ycBuckets', 'yc-t1').buckets['TEST-YC04'], 'an empty core takes the bucket away');
  /* a subject at his level */
  const subjLine = call('ycSaveBucket', 'yc-t2', ['TEST-YC05x', 'TEST-YC04'], [{ t: 'subj', k: 'MATH' }, { t: 'subj', k: 'NOPE' }], []).buckets['TEST-YC04'];
  chk(subjLine && subjLine.core.length === 1 && subjLine.core[0].k === 'MATH', 'subject lines are kept, unknown subjects dropped');
  /* ACTIVE SHEETS: files kept in memory here (Cloud Storage on the live server) */
  vm.runInContext("var YC_FILES={}; ycFilePut_=function(k,b,t){ YC_FILES[k]={b64:b,type:t}; return {ok:true}; }; ycFileGet_=function(k){ return YC_FILES[k]||null; };", rt.ctx);
  call('ycSaveSettings', 'yc-head', { live: 'test' });
  at(0, 12, 0);
  chk(/at least one question/.test(tryErr(() => call('ycSheetNew', 'yc-t1', { title: 'x', kind: 'text', lines: [] }))), 'a written worksheet needs a question');
  const W1 = call('ycSheetNew', 'yc-t1', { title: 'Made-up review', kind: 'text', lines: ['What is 3 + 4?', 'Draw a square.'] });
  chk(W1.skill === 'SHEET.' + W1.id && W1.sheets.length === 1 && W1.sheets[0].pages === 1, 'a written worksheet is ready at once (1 page)');
  const W2 = call('ycSheetNew', 'yc-t1', { title: 'Made-up upload', kind: 'pages' });
  const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  chk(/not your worksheet/.test(tryErr(() => call('ycSheetPage', 'yc-t2', W2.id, 0, PNG))), "another teacher cannot add pages to my worksheet");
  chk(/did not come through/.test(tryErr(() => call('ycSheetPage', 'yc-t1', W2.id, 0, 'data:text/html;base64,PGI+'))), 'only JPEG or PNG pages');
  call('ycSheetPage', 'yc-t1', W2.id, 0, PNG); call('ycSheetPage', 'yc-t1', W2.id, 1, PNG);
  chk(call('ycSheetReady', 'yc-t1', W2.id, 2).some(x => x.id === W2.id && x.pages === 2 && x.ready), 'an uploaded worksheet is ready with its 2 pages');
  call('ycAssign', 'yc-t1', A.id, '2026-11-30', [W1.skill, W2.skill, built[0]], []);
  at(0, 13, 30); r = mine('TEST-YC01');
  chk(r && r.skills.indexOf(W1.skill) >= 0 && r.skills.indexOf(W2.skill) >= 0 && r.names[W1.skill] === 'Made-up review', 'worksheets are assigned like lessons, with their titles');
  const tk = kid['TEST-YC01'].token;
  let op = call('ycSheetOpen', tk, W2.id); chk(op.canEdit && op.status === 'new' && op.sheet.pages === 2 && !op.work, 'the boy opens the worksheet: 2 pages, nothing on it yet');
  chk(/^data:image\/png;base64,/.test(call('ycSheetImg', tk, W2.id, 1)), 'the boy gets the page pictures');
  chk(/not open now/.test(tryErr(() => call('ycSheetOpen', kid['TEST-YC03'].token, W2.id))) && /not open now/.test(tryErr(() => call('ycSheetImg', kid['TEST-YC03'].token, W2.id, 0))), 'a boy it is not assigned to cannot open it or see its pages');
  const work = { pages: [{ s: [{ c: '#111827', w: 28, p: [100, 100, 900, 900] }], t: [{ x: 500, y: 600, v: '7' }] }] };
  chk(call('ycSheetSave', tk, W2.id, work, false).status === 'started', 'his work saves');
  op = call('ycSheetOpen', tk, W2.id); chk(op.work && op.work.pages[0].t[0].v === '7' && op.status === 'started', 'his work comes back when he opens it again');
  chk(!(mine('TEST-YC01').handed || {})[W2.skill], 'not handed in yet');
  call('ycSheetSave', tk, W2.id, work, true);
  chk(mine('TEST-YC01').handed[W2.skill] === 1, 'handed in: the tile shows done');
  chk(/already handed/.test(tryErr(() => call('ycSheetSave', tk, W2.id, work, false))) && !call('ycSheetOpen', tk, W2.id).canEdit, 'after handing in he cannot change it');
  const SW = call('ycSheetWork', 'yc-t1', W2.id); chk(SW.boys.length === 1 && SW.boys[0].sid === 'TEST-YC01' && SW.boys[0].status === 'handed', 'the teacher sees who handed it in');
  chk(call('ycSheetAnswer', 'yc-t1', W2.id, 'TEST-YC01').work.pages[0].s.length === 1, "the teacher sees the boy's lines and answers");
  call('ycSheetReopen', 'yc-t1', W2.id, 'TEST-YC01'); chk(call('ycSheetOpen', tk, W2.id).canEdit, '"Let him fix it" opens it for him again');
  at(0, 13, 56); chk(/closed now/.test(tryErr(() => call('ycSheetSave', tk, W2.id, work, false))), 'when Teacher Time is over, the worksheet closes (saving is refused)');
  chk(call('ycSheetOpen', tk, W2.id).canEdit === false, 'he can still look at his own work after class, but not change it');
  /* a worksheet in a bucket */
  at(0, 14, 40); call('ycSaveBucket', 'yc-t2', ['TEST-YC01'], [{ t: 'sheet', id: W1.id }], []);
  r = mine('TEST-YC01'); chk(r && r.bucket && r.bucket.core[0].skill === W1.skill && !r.bucket.core[0].done && r.bucket.core[0].name === 'Made-up review', 'a worksheet can be a bucket item');
  call('ycSheetSave', tk, W1.id, { pages: [] }, true); r = mine('TEST-YC01'); chk(r && r.bucket.core[0].done && r.bucket.complete, 'handing in the bucket worksheet marks it done');
  chk(/not your worksheet/.test(tryErr(() => call('ycSheetDelete', 'yc-t2', W1.id))), "another teacher cannot remove my worksheet");
  /* WHO GETS WHAT, WHEN: rules open doors (after the core), take-aways hold all day */
  call('ycSaveBucket', 'yc-t2', ['TEST-YC01'], [{ t: 'lesson', id: L[2] }], []);
  chk(/at least one thing/.test(tryErr(() => call('ycSaveRule', 'yc-t1', { doors: ['torah'], from: '15:00', to: '15:30', classId: A.id }))), 'a rule cannot open a door that only opens with the whole app');
  chk(/your classes/.test(tryErr(() => call('ycSaveRule', 'yc-t2', { doors: ['canteen'], from: '15:00', to: '15:30', classId: A.id }))), "a teacher cannot make a rule for another teacher's class");
  const AR = call('ycSaveRule', 'yc-t1', { doors: ['canteen', 'arena', 'nope'], from: '15:00', to: '15:30', when: 'core', classId: A.id });
  chk(AR.rules.length === 1 && AR.rules[0].doors.join() === 'canteen,arena' && AR.doors.some(d => d.id === 'all'), 'a rule keeps only real doors');
  vm.runInContext("ycDayOf_=function(iso){ return '2026-11-30'; }", rt.ctx);
  at(0, 14, 50); r = mine('TEST-YC01'); chk(r && r.yc.k === 'IS' && !(r.doors || []).length, '2:50: Independent Study, no doors open yet');
  at(0, 15, 5); r = mine('TEST-YC01'); chk(r && !(r.doors || []).length, '3:05 but his core is not done: still no doors');
  master('TEST-YC01', L[2]);
  r = mine('TEST-YC01'); chk(r && r.bucket.complete && (r.doors || []).join() === 'canteen,arena', '3:05 with his core done: the Canteen and Chavrusa duels open (got ' + JSON.stringify(r && r.doors) + ')');
  const tk1 = call('ycTakeAway', 'yc-t1', { sids: ['TEST-YC01'], doors: ['arena', 'music'], until: at(0, 15, 5) + 2 * 864e5, why: 'made-up reason' });
  chk(tk1.takeaways.length === 1 && tk1.takeaways[0].names[0] === 'Made-up Boy A', 'the teacher sees the take-away');
  r = mine('TEST-YC01'); chk(r && r.doors.join() === 'canteen' && r.closed.join() === 'arena,music', 'a door taken away from him is shut even when a rule opens it');
  at(1, 10, 0); r = mine('TEST-YC01'); chk(r && r.open && r.closed.join() === 'arena,music', 'the next morning (no class) the take-away still holds; the rest of the app is open');
  chk(/who took it away/.test(tryErr(() => call('ycGiveBack', 'yc-t2', tk1.takeaways[0].id))), 'another teacher cannot give it back');
  call('ycGiveBack', 'yc-t1', tk1.takeaways[0].id); chk(mine('TEST-YC01') === null, 'given back: nothing is shut');
  call('ycTakeAway', 'yc-t1', { sids: ['TEST-YC01'], doors: ['store'], until: at(1, 10, 0) + 3600000 });
  at(1, 11, 1); chk(mine('TEST-YC01') === null, 'a take-away comes back by itself when its time is up');
  /* a rule that opens the whole app lifts the lock */
  at(0, 15, 5); call('ycSaveRule', 'yc-t1', { doors: ['all'], from: '15:10', to: '15:30', when: 'core', classId: A.id });
  at(0, 15, 12); r = mine('TEST-YC01'); chk(r === null || (r.open && !r.yc), 'a rule that opens the whole app lifts the lock (after his core)');
  chk(mine('TEST-YC04') === null || mine('TEST-YC04').yc, 'the rule is only for boys in that class with their core done');
  call('ycAccess', 'yc-t1').rules.forEach(x => call('ycDeleteRule', 'yc-t1', x.id)); chk(!call('ycAccess', 'yc-t1').rules.length, 'rules can be removed');
  if (!fails.length) oks.push('your classes & bucket (server): who gets what, when (rules open doors at set times, only after the core if asked, the whole app lifts the lock; take-aways hold all day, beat rules, come back by themselves; teachers only for their own boys); active sheets (write or upload, assign or bucket, only his to open, saves, hand in, teacher sees it and can reopen, closes after class); bucket list (core any order, add-ons open after, done = paid mastery, empty Teacher Time and Independent Study now open it); Mon-Thu 1:20/1:55/2:30/3:30, only the assigned work in each Teacher Time, empty = Independent Study, chosen boys only, K-1 and boys in no class untouched, Free Play / Independent Study now / live class (newest wins), class and one-day times, switch and school times Head of School only, teachers only their own classes');
  return { fails, oks };
};
/* the boy page: a Teacher Time answer from tmMine shows the Teacher Time screen (kit tiles + one kit Start), Start opens only his class
   lesson, another lesson cannot start, and when the answer is gone his home is back. Restores the page afterwards. */
module.exports.page = async function (pg) {
  const fails = [], oks = [];
  const o = await pg.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {}, keep = { st: A.st, view: A.view, tok: SRV.token };
    const ids = Object.keys(BANK_ALL).filter(id => /^READ\./.test(id) && BANK_ALL[id].name).slice(0, 3); o.n = ids.length;
    const now = Date.now(), G = window.google.script.run, D0 = Object.getOwnPropertyDescriptor(window.google.script, 'run');
    window.__ycR = { id: 'yc:t:T1', skill: ids[0], skills: [ids[0]], lessons: [], clsName: 'Made-up class', name: BANK_ALL[ids[0]].name, subj: 'READ', by: 'Made-up Teacher', until: now + 600000, now, yc: { k: 'T1', label: 'Teacher Time 1', cls: 'Made-up class', next: { k: 'T2', name: 'Teacher Time 2', show: '1:55' } } };
    const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
      if (k === 'tmMine') return () => setTimeout(() => okf && okf(window.__ycR), 20);
      let b = G; if (okf) b = b.withSuccessHandler(okf); if (nof) b = b.withFailureHandler(nof); return (...a) => b[k](...a); } });
    Object.defineProperty(window.google.script, 'run', { configurable: true, get: () => chain(null, null) });
    try {
      SRV.token = SRV.token || 't'; A.st = loadStudent({ id: 'TEST-YCPAGE', name: 'Made-up Boy' }); A.view = 'hub'; render();
      for (let i = 0; i < 40 && !document.querySelector('.ycw'); i++) await sleep(150);
      const w = document.querySelector('.ycw'); o.shown = !!w; o.label = w ? (w.querySelector('.tlk-pill') || {}).textContent : '';
      o.tiles = w ? w.querySelectorAll('button.tlk.tlk-tile').length : 0; o.mains = w ? w.querySelectorAll('button.tlk.tlk-main').length : 0;
      o.otherBtns = w ? [...w.querySelectorAll('button')].filter(b => !b.classList.contains('tlk')).length : -1;
      o.next = w ? /Next: Teacher Time 2 at 1:55/.test(w.textContent) : false;
      const other = ids[1]; startMission('READ', other, 'skill'); o.blocked = !(A.view === 'play' && A.play && A.play.id === other);
      A.view = 'hub'; render(); await sleep(300);
      const go = document.querySelector('.ycw .tlk-main'); if (go) go.click(); await sleep(1200); o.opened = A.view === 'play' && A.play && A.play.id === ids[0];
      /* AIRTIGHT: every door is stopped during class (a recorder after the guard must never hear the click), nothing opens */
      A.view = 'hub'; render(); await sleep(300);
      const heard = []; const rec = e => { const t = e.target; if (t && t.dataset && t.dataset.yctest) heard.push(t.dataset.yctest); }; document.addEventListener('click', rec, false);
      const tryDoor = (k, attrs) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.yctest = k; Object.keys(attrs).forEach(a => b.setAttribute(a, attrs[a])); document.body.appendChild(b); b.click(); b.remove(); };
      const T = { canteen: { 'data-cno': 'open' }, store: { 'data-st': 'open', 'data-t': 'fun' }, arena: { 'data-aropen': '1' }, games: { 'data-mdopen': '1' }, library: { 'data-bl-open': '1' }, torah: { 'data-tj': 'pass' },
        music: { 'data-act': 'mubtn' }, talk: { 'data-tr': 'open' }, profile: { 'data-gmnav': 'more' }, map: { 'data-gmnav': 'map' }, work: { 'data-gmnav': 'missions' }, other: { 'data-hp': 'levels' } };
      Object.keys(T).forEach(k => tryDoor(k, T[k])); await sleep(400);
      o.leaked = heard.slice(); o.opened = ['#cn-shop', '#tlstore', '#ar-ov', '#mdx', '#bl-ov'].filter(q => { const el = document.querySelector(q); return el && el.offsetParent !== null; });
      o.cloudHidden = !document.querySelector('#ohsky') || getComputedStyle(document.querySelector('#ohsky')).display === 'none';
      o.signOutOk = !!document.querySelector('#tlmenu') || !!document.querySelector('.tl-out') || true;
      /* a teacher's rule opens the Canteen: a tile on his class screen, and only the Canteen opens */
      window.__ycR = Object.assign({}, window.__ycR, { id: 'yc:t:T1b', doors: ['canteen'] }); A.st = loadStudent({ id: 'TEST-YCPAGE3', name: 'Made-up Boy' }); A.view = 'hub'; render();
      for (let i = 0; i < 40 && !document.querySelector('.ycw [data-ycdoor="canteen"]'); i++) await sleep(150);
      o.doorTile = !!document.querySelector('.ycw [data-ycdoor="canteen"]');
      heard.length = 0; tryDoor('canteen', T.canteen); tryDoor('store', T.store); await sleep(200); o.ruleHeard = heard.slice();
      document.querySelectorAll('#cn-shop').forEach(x => x.remove()); document.body.classList.remove('cn-open');
      /* no lock, but the Store was taken away from him: the Store stays shut, everything else opens */
      window.__ycR = { open: true, id: 'yc-open:store', closed: ['store'], now: Date.now() }; A.st = loadStudent({ id: 'TEST-YCPAGE4', name: 'Made-up Boy' }); A.view = 'hub'; render();
      await sleep(2500); heard.length = 0; tryDoor('store', T.store); tryDoor('arena', T.arena); tryDoor('map', T.map); await sleep(200); o.takeHeard = heard.slice(); o.takeLocked = !!document.querySelector('.ycw');
      document.querySelectorAll('#ar-ov').forEach(x => x.remove());
      document.removeEventListener('click', rec, false);
      window.__ycR = null; A.view = 'hub'; A.play = null; A.st = loadStudent({ id: 'TEST-YCPAGE2', name: 'Made-up Boy' }); render();
      for (let i = 0; i < 30 && document.querySelector('.ycw'); i++) await sleep(150); o.gone = !document.querySelector('.ycw');
    } catch (e) { o.err = String(e && e.stack || e).slice(0, 300); }
    if (D0) Object.defineProperty(window.google.script, 'run', D0); else window.google.script.run = G;
    A.st = keep.st; A.view = 'hub'; A.play = null; SRV.token = keep.tok; render(); await sleep(300);
    return o; });
  const chk = (c, m) => { if (!c) fails.push('classes & bucket (page): ' + m); };
  if (o.err) fails.push('classes & bucket (page) crashed: ' + o.err);
  chk(o.n >= 2, 'needs Reading lessons on the page');
  chk(o.shown && /Teacher Time 1/i.test(o.label || ''), 'Teacher Time 1 shows its own screen with the period name (got ' + JSON.stringify(o) + ')');
  chk(o.tiles === 1 && o.mains === 1 && o.otherBtns === 0, 'the screen uses only the button kit: 1 tile, 1 Start (got ' + o.tiles + ' tiles, ' + o.mains + ' main, ' + o.otherBtns + ' other buttons)');
  chk(o.next, 'the screen says what is next');
  chk(o.blocked, 'another lesson cannot start during Teacher Time');
  chk(o.opened, 'Start opens his class lesson');
  chk(o.gone, 'when the schedule lets go, his home is back');
  chk(o.leaked && o.leaked.length === 0, 'during class no other part of the app hears a tap (got ' + JSON.stringify(o.leaked) + ')');
  chk(o.opened && o.opened.length === 0, 'during class nothing else opens (got ' + JSON.stringify(o.opened) + ')');
  chk(o.cloudHidden, 'the floating Olam Haba cloud is hidden during class');
  chk(o.doorTile && JSON.stringify(o.ruleHeard) === '["canteen"]', "a teacher's rule opens only that door, with a tile on his class screen (got " + o.doorTile + ' ' + JSON.stringify(o.ruleHeard) + ')');
  chk(!o.takeLocked && JSON.stringify(o.takeHeard) === '["arena","map"]', 'a door taken away stays shut when he is not in class; the rest opens (got ' + JSON.stringify(o.takeHeard) + ')');
  if (!fails.length) oks.push('your classes & bucket (page): Teacher Time screen from the button kit (period name, teacher, next), only his class lesson starts, airtight (12 kinds of doors tried, none heard, nothing opens, cloud hidden), a rule opens just its door with a tile, a taken-away door stays shut outside class, home back after');
  return { fails, oks };
};
