/* THE NEW SHELL, workstream B (src/ShProfile.html, docs/SHELL-CONTRACT.md): his room (profile), the Trophy Hall (trophies), Torah Tracks and
   his passport (passport), played as a MADE-UP boy with made-up server answers (the google.script.run proxy as in tests/lib/classesbucket.js).
   Guarantees everything the tests/run.js "My profile" block guarantees for the old page, for the new places:
   - the page is called "My profile"; one level row for every subject on his map; the 8 badges; a quiet Sign out; All my lessons and the doors;
   - Change opens 16 pictures; the one he taps is kept in his state, saved to the server (msSave), given to the Arena (arAv), and shows on the page
     and on his home tile;
   - All my lessons, Skill tree and My week (opened from My profile) have the round Back, and it returns to My profile; My profile itself has none;
   and more: every place has only kit buttons, one house top left (a page) or one round x top right (a pop-up), at most one main button;
   the right server calls with the right arguments (stInfo, arMyStats, sgMyDesk, msSave); every lesson opens through SHK.openLesson;
   K-1 boys see none of it. Restores the page at the end. */
module.exports.page = async function (pg, map) {
  const fails = [], oks = [];
  if (!map) return { fails: ['new shell B: no made-up map to test with'], oks };
  const o = await pg.evaluate(async M0 => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = { errs: [] }, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
    const K = window.SHK; o.kit = !!(K && window.SHP); if (!o.kit) return o;
    const keep = { sch: window.TL_MYSCHOOL, st: A.st, view: A.view, tok: SRV.token, map: window.TL_MAP, rp: window.tlRP, chm: window.tlChm, tour: window.TLTOUR, go: K.go, ol: K.openLesson, menu: window.TL_MENU && Object.assign({}, window.TL_MENU.actions), arAv: (() => { try { return localStorage.getItem('arAv'); } catch (e) { return null; } })() };
    const G = window.google.script.run, D0 = Object.getOwnPropertyDescriptor(window.google.script, 'run'), calls = [];
    const BANK = Object.keys(BANK_ALL), lkPar = BANK.find(id => /^LK\.PAR\./.test(id)) || BANK.find(id => /^LK\./.test(id));
    const ANS = {
      stInfo: () => ({ ok: true, items: [{ id: 'trail-gold', name: 'Gold trail', emoji: '🌈', slot: 'trail', kind: 'wear', cat: 'fun' }, { id: 'prize-ball', name: 'Made-up ball', emoji: '⚽', cat: 'real', kind: 'prize' }], owned: ['trail-gold'], orders: [{ item: 'prize-ball', label: 'Made-up ball', emoji: '⚽', cents: 300, status: 'waiting', at: Date.now() - 864e5 }] }),
      arMyStats: () => ({ wins: 3, played: 5, taught: 1, shakes: 2, lwins: 0, subj: { MATH: 3 }, on: true }),
      sbMySchool: () => ({ def: false, name: 'Made-up Homeschool', emoji: '🏡', kind: 'homeschool', color: '#6D28D9' }),
      sgMyDesk: () => ({ picks: [], shouts: [], parsha: { name: 'Vayeitzei', by: 'Made-up Rebbe', note: 'Yaakov goes to Charan.', lesson: lkPar, lessonName: 'The parsha lesson' } })
    };
    const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
      return (...a) => { calls.push([k, a]); if (ANS[k]) { setTimeout(() => okf && okf(ANS[k](...a)), 15); return; } let b = G; if (okf) b = b.withSuccessHandler(okf); if (nof) b = b.withFailureHandler(nof); return b[k](...a); }; } });
    Object.defineProperty(window.google.script, 'run', { configurable: true, get: () => chain(null, null) });
    const lessons = [], gone = [], menu = [];
    K.openLesson = id => { lessons.push(id); K.closeAll(); };
    K.go = id => { gone.push(id); return /^(profile|trophies|passport)$/.test(id) ? keep.go(id) : false; };
    window.tlRP = () => null; window.tlChm = { open: p => menu.push('chm:' + p) }; window.TLTOUR = { open: () => menu.push('tour') };
    if (window.TL_MENU) TL_MENU.actions = Object.assign({}, TL_MENU.actions, { setSound: v => menu.push('sound:' + v), openMusicPanel: () => menu.push('music'), signOut: () => menu.push('out') });
    const onlyKit = el => [...el.querySelectorAll('button')].every(b => b.classList.contains('tlk'));
    const look = id => { const el = document.getElementById('shk-' + id); if (!el) return { open: false }; const r = { open: true, kit: onlyKit(el), mains: el.querySelectorAll('.tlk-main').length };
      if (el.classList.contains('shk-page')) { const h = el.querySelectorAll('.shk-top .tlk-home'), q = h[0] && h[0].getBoundingClientRect(); r.houses = h.length; r.houseTL = !!(q && q.left < 220 && q.top < 90); r.backs = el.querySelectorAll('.shk-top .tlk-back').length; }
      else { const x = el.querySelectorAll('.tlk-x'), q = x[0] && x[0].getBoundingClientRect(), c = el.querySelector('.shk-card').getBoundingClientRect(); r.xs = x.length; r.xTR = !!(q && q.left > c.left + c.width / 2 && q.top < c.top + 80); }
      return r; };
    const tap = async (sel, wait) => { const b = typeof sel === 'string' ? $(sel) : sel; if (!b) return false; b.click(); await sleep(wait || 40); return true; };
    try {
      delete window.TL_MYSCHOOL; SRV.token = 't'; const MP = JSON.parse(JSON.stringify(M0)); MP.grade = 5; window.TL_MAP = MP; A.st = loadStudent({ id: MP.sid, name: 'Made-up Boy A' }); A.view = 'hub';
      o.subs = Object.keys(MP.subjects || {}).length + Object.keys(MP.kodesh || {}).length;
      o.listed = ['profile', 'trophies', 'passport'].every(id => K.places('k').some(d => d.id === id));
      { const t = document.createElement('div'); t.innerHTML = K.tile('profile') + K.tile('trophies') + K.tile('passport'); o.doors = [...t.querySelectorAll('[data-shgo]')].map(b => b.getAttribute('data-shdoor')).join(','); o.tilesKit = [...t.querySelectorAll('button')].every(b => b.classList.contains('tlk-tile')); }
      /* ---- MY PROFILE ---- */
      keep.go('profile'); await sleep(120); const P = o.prof = look('profile'); const pe = $('#shk-profile');
      if (pe) { P.title = (pe.querySelector('.shk-plaque h1') || {}).textContent || ''; P.levels = pe.querySelectorAll('.shp-lv').length; P.badges = pe.querySelectorAll('.shp-badges .shp-b').length;
        P.out = !!pe.querySelector('.tlk-quiet[data-shp=out]'); P.lib = !!pe.querySelector('.tlk-tile[data-shp=lessons]'); P.tiles = pe.querySelectorAll('.shp-tiles .tlk-tile').length; P.money = /My money/.test(pe.textContent);
        await sleep(80); P.stInfo = calls.some(c => c[0] === 'stInfo' && c[1][0] === 't'); P.school = calls.some(c => c[0] === 'sbMySchool' && c[1][0] === 't') && /Made-up Homeschool/.test($('#shk-profile').textContent) && /My homeschool pod/.test($('#shk-profile').textContent); P.bought = /Made-up ball/.test($('#shk-profile').textContent) && /Gold trail/.test($('#shk-profile').textContent);
        await tap('#shk-profile [data-shp=pick]'); const pk = $$('#shk-profile-pick [data-shp=avk]'); P.pick = pk.length; P.pickLook = look('profile-pick');
        const n0 = calls.filter(c => c[0] === 'msSave').length; if (pk[2]) await tap(pk[2], 80);
        P.av = (A.st && A.st.av) || ''; P.want = pk[2] && pk[2].getAttribute('data-k'); P.pickGone = !$('#shk-profile-pick'); P.big = ($('#shk-profile .shp-bav') || {}).textContent || '';
        P.saved = calls.slice(n0).some(c => c[0] === 'msSave' && c[1][0] === 't' && c[1][2] && c[1][2].av === P.want); try { P.arena = localStorage.getItem('arAv'); } catch (e) {}
        { const t = document.createElement('div'); t.innerHTML = K.tile('profile'); P.onTile = (t.querySelector('.shk-ic') || {}).textContent || ''; }
        await tap('#shk-profile [data-shp=sound]', 100); await tap('#shk-profile [data-shp=music]'); await tap('#shk-profile [data-shp=out]'); P.menu = menu.join(',');
        /* the inner pages: Back returns to My profile, the house goes home */
        P.inner = {};
        for (const [k, id] of [['lessons', 'profile-lessons'], ['tree', 'profile-tree'], ['week', 'profile-week']]) {
          if (!$('#shk-profile')) { keep.go('profile'); await sleep(60); }
          await tap('#shk-profile [data-shp=' + k + ']', 60); const r = look(id); const el = $('#shk-' + id); r.text = el ? el.textContent.slice(0, 4000) : '';
          if (k === 'lessons' && el) { const f = el.querySelector('[data-shp=lf][data-f=done]'); if (f) await tap(f); r.done = $$('#shk-profile-lessons .shp-node').length; const q = $('#shp-q'); if (q) { q.value = 'zzzz-nothing'; q.dispatchEvent(new Event('input', { bubbles: true })); await sleep(30); r.none = $$('#shk-profile-lessons .shp-node').length; }
            const f2 = $('#shk-profile-lessons [data-shp=lf][data-f=all]'); if (f2) await tap(f2); const q2 = $('#shp-q'); if (q2) { q2.value = ''; q2.dispatchEvent(new Event('input', { bubbles: true })); await sleep(30); } const pl = $('#shk-profile-lessons [data-shp=play][data-id]'); r.playId = pl && pl.getAttribute('data-id'); if (pl) { await tap(pl); r.played = lessons[lessons.length - 1]; } }
          if (k === 'tree' && el) { r.nodes = el.querySelectorAll('.shp-node').length; const nn = el.querySelector('.shp-node[data-st=now]'); r.nowId = nn && nn.getAttribute('data-id'); if (nn) { await tap(nn); r.sheet = look('profile-node'); await tap('#shk-profile-node [data-shp=play]'); r.played = lessons[lessons.length - 1]; } }
          if (k === 'week' && el) { r.cheer = !!el.querySelector('.shp-cheer'); r.xp = /XP/.test(el.textContent); r.boxes = el.querySelectorAll('.tlk-box').length; }
          if (!$('#shk-profile')) { keep.go('profile'); await sleep(60); await tap('#shk-profile [data-shp=' + k + ']', 60); }
          const bk = $('#shk-' + id + ' .tlk-back'); r.hasBack = !!bk; if (bk) await tap(bk, 60); r.backTo = !$('#shk-' + id) && !!$('#shk-profile');
          P.inner[k] = r; }
        P.noBack = $$('#shk-profile .shk-top .tlk-back').length === 0;
        await tap('#shk-profile [data-shp=lessons]', 60); const hm = $('#shk-profile-lessons .tlk-home'); if (hm) { hm.click(); await sleep(2600); } P.homeAll = K.open.length === 0;
      }
      /* ---- THE TROPHY HALL ---- */
      K.closeAll(); const n1 = calls.length; keep.go('trophies'); await sleep(150); const T = o.tro = look('trophies'); const te = $('#shk-trophies');
      if (te) { T.badges = te.querySelectorAll('.shp-bd8 .shp-b').length; T.rank = /XP/.test(te.textContent) && te.querySelectorAll('.shp-ladder span').length === 6; T.call = calls.slice(n1).some(c => c[0] === 'arMyStats' && c[1][0] === 't'); T.arena = /First win/.test(te.textContent) && /Math champion/.test(te.textContent); T.backs = te.querySelectorAll('.tlk-back').length; }
      /* ---- TORAH TRACKS AND THE PASSPORT ---- */
      K.closeAll(); const n2 = calls.length; keep.go('passport'); await sleep(150); const S = o.pass = look('passport'); const se = $('#shk-passport');
      if (se) { S.lands = se.querySelectorAll('[data-shp=land]').length; S.desk = calls.slice(n2).some(c => c[0] === 'sgMyDesk' && c[1][0] === 't'); await sleep(60);
        S.parsha = /Parshas Vayeitzei/.test($('#shk-passport').textContent); S.tt = window.TLTT || 0;
        await tap('#shk-passport [data-shp=land][data-k=HAL]', 60); S.land = look('passport-land'); S.stations = $$('#shk-passport-land [data-shp=station]').length;
        const st0 = $('#shk-passport-land [data-shp=station]'); S.stId = st0 && st0.getAttribute('data-id'); if (st0) { await tap(st0); S.stPop = look('passport-station'); await tap('#shk-passport-station [data-shp=play]'); S.stPlayed = lessons[lessons.length - 1]; }
        keep.go('passport'); await sleep(60);
        await tap('#shk-passport [data-shp=stamps]', 60); S.stamps = $$('#shk-passport-stamps .shp-stamp').length; S.stampLook = look('passport-stamps'); const bk = $('#shk-passport-stamps .tlk-back'); if (bk) await tap(bk); S.stampBack = !$('#shk-passport-stamps') && !!$('#shk-passport');
        await tap('#shk-passport [data-shp=taryag]', 60); S.tq = look('passport-taryag'); S.worlds = $$('#shk-passport-taryag [data-shp=tqw]').length; const c0 = $('#shk-passport-taryag .shp-nodes [data-shp=tqpv]'); S.tqId = c0 && c0.getAttribute('data-id');
        if (c0) { await tap(c0); S.tqPop = look('passport-tq'); await tap('#shk-passport-tq [data-shp=play]'); S.tqPlayed = lessons[lessons.length - 1]; }
        keep.go('passport'); await sleep(60);
        const n3 = calls.filter(c => c[0] === 'msSave').length; await tap('#shk-passport [data-shp=dav][data-d=shacharis]', 80); const d = new Date(), ymd = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        S.dav = !!(A.st.dav && A.st.dav[ymd] && A.st.dav[ymd].indexOf('shacharis') >= 0) && calls.slice(n3).some(c => c[0] === 'msSave' && c[1][2] && c[1][2].dav); S.davOn = !!$('#shk-passport [data-shp=dav][data-d=shacharis][aria-pressed=true]');
        await tap('#shk-passport [data-shp=dav][data-d=shacharis]', 80); S.davOff = !(A.st.dav[ymd] || []).length;
        await tap('#shk-passport [data-shp=scroll]', 60); S.scroll = look('passport-scroll'); K.close('passport-scroll');
        await tap('#shk-passport [data-shp=play][data-id="' + lkPar + '"]'); S.parPlayed = lessons[lessons.length - 1];
        keep.go('passport'); await sleep(60); await tap('#shk-passport [data-shp=chm][data-p]'); S.chm = menu.filter(x => /^chm:/.test(x)).pop();
        keep.go('passport'); await sleep(60); const mn = $('#shk-passport .tlk-main[data-shp=play]'); S.mainId = mn && mn.getAttribute('data-id'); if (mn) { await tap(mn); S.mainPlayed = lessons[lessons.length - 1]; }
      }
      /* ---- K-1: none of it ---- */
      K.closeAll(); window.TL_MAP.grade = 1; o.k1 = { listed: K.places('k').filter(d => /^(profile|trophies|passport)$/.test(d.id)).length }; keep.go('profile'); keep.go('passport'); keep.go('trophies'); await sleep(60); o.k1.open = K.open.length;
    } catch (e) { o.errs.push(String(e && e.stack || e).slice(0, 300)); }
    K.closeAll(); K.go = keep.go; K.openLesson = keep.ol; window.tlRP = keep.rp; window.tlChm = keep.chm; window.TLTOUR = keep.tour; if (window.TL_MENU && keep.menu) TL_MENU.actions = keep.menu;
    try { if (keep.arAv == null) localStorage.removeItem('arAv'); else localStorage.setItem('arAv', keep.arAv); } catch (e) {}
    await sleep(2300); /* the last flight home ends */ if (D0) Object.defineProperty(window.google.script, 'run', D0); else window.google.script.run = G;
    window.TL_MYSCHOOL = keep.sch; window.TL_MAP = keep.map; A.st = keep.st; A.view = keep.view; SRV.token = keep.tok; A.play = null; try { render(); } catch (e) {} await sleep(30); o.left = K.open.length;
    o.lessons = lessons; return o;
  }, map);
  const J = x => JSON.stringify(x).slice(0, 500);
  const chk = (c, m, x) => { if (!c) fails.push('new shell B: ' + m + ' (got ' + J(x) + ')'); };
  chk(o.kit, 'window.SHK / window.SHP missing (src/ShProfile.html did not load)', o);
  if (!o.kit) return { fails, oks };
  chk(!o.errs.length, 'the test crashed on the page', o.errs);
  chk(o.listed && o.doors === 'profile,profile,torah' && o.tilesKit, 'My profile, the Trophy Hall and Torah Tracks are places with kit tiles and their class-lock doors (profile, profile, torah)', { listed: o.listed, doors: o.doors });
  const pageOk = r => r && r.open && r.kit && r.houses === 1 && r.houseTL && r.mains <= 1, popOk = r => r && r.open && r.kit && r.xs === 1 && r.xTR && r.mains <= 1;
  const P = o.prof || {};
  chk(pageOk(P) && P.backs === 0, 'My profile is a full page with one house top left, no Back, only kit buttons, at most one main button', P);
  chk(P.title === 'My profile' && P.money, 'the page is called "My profile" and the bank says "My money"', { title: P.title, money: P.money });
  chk(P.subs !== 0 && P.levels === o.subs, 'My profile: one level row for every subject on his map (' + o.subs + ')', P.levels);
  chk(P.badges === 8 && P.out && P.lib && P.tiles >= 6, 'My profile: the 8 badges, a quiet Sign out, All my lessons and the doors', { badges: P.badges, out: P.out, lib: P.lib, tiles: P.tiles });
  chk(P.school, 'My profile shows his school band from sbMySchool (a family, homeschool pod, group or another school)', P.school);
  chk(P.stInfo && P.bought, 'My profile asks the store (stInfo with his token) and shows what he bought and his things', { stInfo: P.stInfo, bought: P.bought });
  chk(P.pick === 16 && popOk(P.pickLook) && P.av && P.av === P.want && P.pickGone && P.big === P.av && P.saved && P.arena === P.av && P.onTile === P.av, 'his picture: Change opens 16 pictures (a pop-up with one x); the one he taps is kept, saved (msSave), given to the Arena and shows on the page and his home tile', P);
  chk(/sound:false|sound:true/.test(P.menu || '') && /music/.test(P.menu || '') && /out/.test(P.menu || ''), 'My settings: Sound, Music and Sign out do their jobs', P.menu);
  for (const k of ['lessons', 'tree', 'week']) { const r = (P.inner || {})[k] || {}; chk(pageOk(r) && r.backs === 1 && r.hasBack && r.backTo, (k === 'lessons' ? 'All my lessons' : k === 'tree' ? 'Skill tree' : 'My week') + ' (from My profile) has the round Back and the house, only kit buttons, and Back returns to My profile', r); }
  { const L = (P.inner || {}).lessons || {}, T = (P.inner || {}).tree || {}, W = (P.inner || {}).week || {};
    chk(L.done > 0 && L.none === 0 && L.playId && L.played === L.playId, 'All my lessons: the filters and the search work, and a lesson opens through SHK.openLesson', L);
    chk(T.nodes > 0 && T.nowId && popOk(T.sheet) && T.played === T.nowId, 'Skill tree: his skills as nodes; his goal now opens a sheet whose Start opens it through SHK.openLesson', T);
    chk(W.cheer && W.xp && W.boxes === 4, 'My week: rank, XP, this week vs last week, days in a row and bosses beaten', W); }
  chk(P.noBack && P.homeAll, 'My profile has no Back; the house on an inner page goes all the way home', { noBack: P.noBack, home: P.homeAll });
  const T = o.tro || {};
  chk(pageOk(T) && T.backs === 0 && T.badges === 8 && T.rank && T.call && T.arena, 'Trophy Hall: a full page (house top left, kit buttons), the 8 badges, rank, XP and ladder, and the Arena trophies from arMyStats', T);
  const S = o.pass || {};
  chk(pageOk(S) && S.lands === 7 && S.desk && S.parsha, 'Torah Tracks: a full page with the seven lands and the Parsha his rebbe set (sgMyDesk)', S);
  chk(pageOk(S.land) && S.land.backs === 1 && S.stations > 0 && popOk(S.stPop) && S.stPlayed === S.stId, 'a land shows its stations (Back to Torah Tracks); a station opens through SHK.openLesson', S);
  chk(S.tt > 0 && S.stamps === S.tt && pageOk(S.stampLook) && S.stampBack, 'the passport has one stamp for every Torah Tracks station (' + S.tt + ') and Back returns to Torah Tracks', { stamps: S.stamps, tt: S.tt });
  chk(pageOk(S.tq) && S.worlds === 14 && S.tqId && popOk(S.tqPop) && S.tqPlayed === S.tqId, 'Taryag Quest: the 14 Worlds and the mitzvah cards; Learn it opens through SHK.openLesson', S);
  chk(S.dav && S.davOn && S.davOff && popOk(S.scroll) && S.parPlayed && S.chm === 'chm:Vayeitzei' && S.mainPlayed && S.mainPlayed === S.mainId, 'Torah Plus: davening is kept and saved (msSave), the Torah scroll opens, the Parsha lesson opens through SHK.openLesson, and the Chumash page opens at his rebbe\'s Parsha', S);
  chk(o.k1 && o.k1.listed === 0 && o.k1.open === 0, 'K-1: none of these places shows or opens', o.k1);
  chk(o.left === 0, 'every page and pop-up is closed at the end', o.left);
  if (!fails.length) oks.push('new shell B: My profile (a level row per subject, 8 badges, 16 pictures kept and saved and shown on the tile, settings, Back from All my lessons / Skill tree / My week to My profile), the Trophy Hall (rank, badges, Arena trophies), Torah Tracks (7 lands, ' + S.stamps + ' stamps, Taryag Quest 14 Worlds, Torah Plus, Chumash page): kit buttons only, house or x in place, right server calls, lessons through SHK.openLesson, nothing for K-1');
  return { fails, oks };
};
