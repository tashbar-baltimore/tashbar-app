/* THE NEW SHELL, workstream E (src/ShPlaces.html, docs/SHELL-CONTRACT.md): the Canteen Court, My Library, the Olam Haba sky,
   the Music Pavilion and Talk to my Rebbe, on the boy page, as a made-up boy with made-up server answers.
   For each place: SHK.go(id) opens a full page with exactly one house top left (no x), only button-kit buttons, at most one main;
   every function is used and the right server call is made with the right arguments; lessons open only through SHK.openLesson.
   The Canteen's four doors keep their order (Buy food, Get canteen money, My story, Lessons), the same order tests/run.js checks
   on the old canteen; it says "canteen money"; it stays shut during class (TM_CLASS) and makes no server call then.
   Restores the page afterwards (boy, map, server, lesson opener, music). */
module.exports.page = async function (pg) {
  const fails = [], oks = [];
  const o = await pg.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {}, K = window.SHK;
    const until = async (f, ms) => { for (let i = 0; i < (ms || 3000) / 50; i++) { try { if (f()) return true; } catch (e) {} await sleep(50); } return false; };
    if (!K) { o.noKit = true; return o; }
    const keep = { st: A.st, view: A.view, tok: SRV.token, map: window.TL_MAP, play: window.GM_PLAY, tmc: window.TM_CLASS, k1: document.body.classList.contains('k1-home'),
      muInfo: window.TashbarMusic ? TashbarMusic.state.info : undefined };
    const G = window.google.script.run, D0 = Object.getOwnPropertyDescriptor(window.google.script, 'run');
    const calls = [], lessons = [];
    const R = {
      cnKidInfo: () => ({ ok: true, cash: 2.5, pf: 1, order: null, menuN: 3, crew: { assigned: false, isCrew: false, done: [], all: [] } }),
      cnOrderMenu: () => ({ ok: true, cash: 2.5, pf: 0.5, story: [{ note: 'Sign-off: on time', cents: 20 }, { note: 'Bought pretzels', cents: -75 }],
        menu: [{ id: 'm1', name: 'Pretzels', price: 0.75, emoji: '🥨', out: false, left: null }, { id: 'm2', name: 'Water', price: 0.5, emoji: '💧', out: false, left: 4 }, { id: 'm3', name: 'Pizza', price: 3, emoji: '🍕', out: false, left: null }, { id: 'm4', name: 'Apple juice', price: 1, emoji: '🧃', out: true, left: 0 }],
        open: window.__shpOrder ? [window.__shpOrder] : [], recent: [] }),
      cnOrderPlace: (t, cart, cid) => { window.__shpOrder = { id: 'O' + cid, status: 'pending', seen: false, at: Date.now(), paid: true, est: 1.25, items: [{ name: 'Pretzels', emoji: '🥨', price: 0.75, qty: 1 }, { name: 'Water', emoji: '💧', price: 0.5, qty: 1 }] }; return { ok: true, order: window.__shpOrder, cash: 1.25, before: 2.5 }; },
      cnOrderCancel: () => { window.__shpOrder = null; return { ok: true, back: 1.25, cash: 2.5 }; },
      libMyLibrary: () => ({ on: true, picks: [[window.__shpIds[0], 'Made-up pick', 'Rabbi Made-up', '']],
        shelves: [{ name: 'Reading', icon: '📖', books: [[window.__shpIds[1], 'Book one', 'before'], [window.__shpIds[2], 'Book two', 'now'], [window.__shpIds[3], 'Book three', 'next']] }] }),
      msMusicInfo: () => ({ off: false, tracks: [{ id: 'tz1', mood: 'focus', title: 'Made-up Song', by: 'Made-up Band' }] }),
      msMusicPart: () => ({ data: '', done: true }),
      crStaffList: () => [{ id: 's1', name: 'Rabbi Made-up' }, { id: 's2', name: 'Mr. Made-up' }],
      crSend: (t, to) => ({ ok: true, to: to === 's1' ? 'Rabbi Made-up' : 'Mr. Made-up' })
    };
    const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
      if (R[k]) return (...a) => { calls.push([k].concat(a)); setTimeout(() => { try { okf && okf(R[k](...a)); } catch (e) { nof && nof(e); } }, 20); };
      let b = G; if (okf) b = b.withSuccessHandler(okf); if (nof) b = b.withFailureHandler(nof); return (...a) => b[k](...a); } });
    const called = (fn, f) => calls.filter(c => c[0] === fn && (!f || f(c)));
    const flyOff = () => document.querySelectorAll('.shk-fly').forEach(f => f.click());
    /* a page: one house top left, no x, only kit buttons, at most one main */
    const shape = id => { const el = document.getElementById('shk-' + id); if (!el) return { open: false };
      const h = el.querySelectorAll('.tlk-home'), r = h[0] && h[0].getBoundingClientRect(), btn = [...el.querySelectorAll('button')];
      return { open: true, houses: h.length, tl: !!(r && r.left < 240 && r.top < 100), xs: el.querySelectorAll('.tlk-x').length, kit: btn.every(b => b.classList.contains('tlk')), mains: el.querySelectorAll('.tlk-main').length, text: el.textContent }; };
    const q = (id, s) => document.querySelector('#shk-' + id + ' ' + s);
    const qa = (id, s) => [...document.querySelectorAll('#shk-' + id + ' ' + s)];
    try {
      window.__shpIds = Object.keys(BANK_ALL).filter(id => /^READ\./.test(id) && BANK_ALL[id].name).slice(0, 4); window.__shpOrder = null;
      Object.defineProperty(window.google.script, 'run', { configurable: true, get: () => chain(null, null) });
      window.GM_PLAY = id => { lessons.push(id); };
      window.TM_CLASS = () => null; document.body.classList.remove('k1-home');
      SRV.token = 'tok-shp'; A.st = loadStudent({ id: 'TEST-SHP01', name: 'Made-up Boy' }); window.TL_MAP = Object.assign({}, keep.map || {}, { sid: 'TEST-SHP01', grade: 5 }); A.view = 'hub';
      o.on = K.on();
      /* the five tiles: kit tiles with their class-lock doors */
      const want = { canteen: 'canteen', library: 'library', olamhaba: 'olamhaba', music: 'music', talk: 'talk' };
      o.tiles = Object.keys(want).map(id => { const t = document.createElement('div'); t.innerHTML = K.tile(id); const b = t.firstElementChild; return !!(b && b.classList.contains('tlk-tile') && b.getAttribute('data-shdoor') === want[id] && b.getAttribute('data-shgo') === id); });
      o.listed = Object.keys(want).every(id => K.places().some(d => d.id === id));
      await sleep(300); calls.length = 0;

      /* ---------- THE CANTEEN ---------- */
      K.go('canteen'); flyOff(); await until(() => q('canteen', '.shp-food'));
      o.cn = shape('canteen');
      o.cnMenuCall = called('cnOrderMenu', c => c[1] === 'tok-shp').length >= 1 && called('cnKidInfo', c => c[1] === 'tok-shp').length >= 1;
      o.cnDoors = qa('canteen', '[data-shp="cn-door"]').map(b => b.dataset.p);
      o.cnDoorWords = qa('canteen', '[data-shp="cn-door"] b').map(b => b.textContent);
      o.cnWord = /canteen money/.test(o.cn.text || ''); o.cnMoneyPill = !!q('canteen', '.tlk-box.tlk-money'); o.cnQuarter = /quick level check/.test(o.cn.text || '');
      o.cnLocked = /Need \$?[\d.]+¢? more|Need .* more/.test(q('canteen', '[data-id="m3"]') ? q('canteen', '[data-id="m3"]').textContent : '') && /Sold out/.test((q('canteen', '[data-id="m4"]') || {}).textContent || '');
      q('canteen', '[data-shp="cn-add"][data-id="m1"]').click(); await sleep(30); q('canteen', '[data-shp="cn-add"][data-id="m2"]').click(); await sleep(30);
      o.cnTray = qa('canteen', '[data-shp="cn-sub"]').length === 2 && /\$1\.25 left/.test(document.getElementById('shk-canteen').textContent);
      o.cnShop = shape('canteen'); q('canteen', '.tlk-main[data-shp="cn-check"]').click(); await sleep(30);
      const ask = q('canteen', '.tlk-ask'); o.cnAsk = !!(ask && ask.querySelector('.tlk-main[data-shp="cn-buy"]') && ask.querySelector('.tlk-main').textContent === 'Buy it' && ask.querySelector('.tlk-quiet[data-shp="cn-back"]') && ask.querySelector('.tlk-quiet').textContent === 'Not now');
      o.cnCheck = shape('canteen');
      ask.querySelector('[data-shp="cn-buy"]').click(); await until(() => q('canteen', '.shp-track'));
      const pl = called('cnOrderPlace')[0]; o.cnPlace = !!(pl && pl[1] === 'tok-shp' && JSON.stringify(pl[2]) === JSON.stringify([{ id: 'm1', qty: 1 }, { id: 'm2', qty: 1 }]) && typeof pl[3] === 'string' && pl[3].length >= 8);
      o.cnTrack = /You paid \$1\.25/.test(document.getElementById('shk-canteen').textContent) && !!q('canteen', '[data-shp="cn-cancel"].tlk-quiet');
      q('canteen', '[data-shp="cn-cancel"]').click(); await until(() => /is back in your canteen money/.test(document.getElementById('shk-canteen').textContent));
      const cc = called('cnOrderCancel')[0]; o.cnCancel = !!(cc && cc[1] === 'tok-shp' && /^O/.test(cc[2])) && /\$1\.25 is back in your canteen money/.test(document.getElementById('shk-canteen').textContent);
      q('canteen', '[data-p="cash"]').click(); await sleep(30); o.cnCash = /Where canteen money comes from/.test(document.getElementById('shk-canteen').textContent) && !!q('canteen', '.tlk-quiet[data-shp="cn-store"]'); o.cnCashShape = shape('canteen');
      q('canteen', '[data-p="story"]').click(); await sleep(30); o.cnStory = /Sign-off: on time/.test(document.getElementById('shk-canteen').textContent) && qa('canteen', '.shp-list .tlk-money').length === 2;
      q('canteen', '[data-p="learn"]').click(); await sleep(30); const ls = qa('canteen', '[data-shp="lesson"]'); o.cnLessons = ls.length; o.cnLearnShape = shape('canteen');
      if (ls[0]) { const id = ls[0].dataset.id; ls[0].click(); await sleep(60); o.cnLesson = lessons[lessons.length - 1] === id && /^LIFE\.FIN\./.test(id) && !document.getElementById('shk-canteen'); }
      /* during class (no teacher opened the canteen): shut, and no server call */
      window.TM_CLASS = () => ({ k: 'T1' }); calls.length = 0; K.go('canteen'); flyOff(); await sleep(200);
      o.cnClass = /The canteen opens after class/.test((document.getElementById('shk-canteen') || {}).textContent || '') && !called('cnOrderMenu').length && !q('canteen', '[data-shp="cn-door"]');
      window.TM_CLASS = () => null; K.closeAll();

      /* ---------- MY LIBRARY ---------- */
      calls.length = 0; K.go('library'); flyOff(); await until(() => q('library', '[data-shp="lesson"]'));
      o.lb = shape('library'); o.lbCall = called('libMyLibrary', c => c[1] === 'tok-shp').length >= 1; o.lbTitle = /Made-up’s Library/.test(o.lb.text || '');
      o.lbPick = !!q('library', '.tlk-tile[data-shp="lesson"][data-id="' + window.__shpIds[0] + '"]') && /From Rabbi Made-up/.test(o.lb.text || '');
      o.lbTabs = qa('library', '[data-shp="lb-tab"].tlk-quiet').length === 1 && !!q('library', '.shp-tabs .tlk-pill');
      q('library', '[data-shp="lb-tab"]').click(); await sleep(30);
      o.lbShelf = qa('library', '.shp-books .tlk-tile').length === 3 && /Earlier/.test(document.getElementById('shk-library').textContent) && !/Level \d/.test(document.getElementById('shk-library').textContent); o.lbShelfShape = shape('library');
      const bk = q('library', '.shp-books [data-id="' + window.__shpIds[2] + '"]'); if (bk) { bk.click(); await sleep(60); } o.lbLesson = lessons[lessons.length - 1] === window.__shpIds[2] && !document.getElementById('shk-library');

      /* ---------- THE OLAM HABA SKY ---------- */
      const d = new Date(); A.st.ohb = { d: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), t: 12, k: 3, L: 250, S: 7, P: [0, 3] };
      K.go('olamhaba'); flyOff(); await sleep(60); o.oh = shape('olamhaba');
      o.ohPearls = qa('olamhaba', '.shp-pearl:not(.no)').length === 2 && qa('olamhaba', '.shp-pearl.no').length === 6; o.ohStars = qa('olamhaba', '.shp-stars i').length === 7;
      o.ohWords = /My Olam Haba/.test(o.oh.text || '') && /the effort is what counts/.test(o.oh.text || '') && /Pirkei Avos 5:23/.test(o.oh.text || '');
      const kg = q('olamhaba', '.tlk-main'); o.ohGo = !!kg && kg.textContent === 'Keep going!'; kg && kg.click(); await sleep(60); flyOff(); await sleep(450); o.ohClosed = !document.getElementById('shk-olamhaba');

      /* ---------- THE MUSIC PAVILION ---------- */
      calls.length = 0; if (window.TashbarMusic) TashbarMusic.state.info = null; A.st.music = { mood: 'off', vol: 0.6 };
      K.go('music'); flyOff(); await until(() => q('music', '[data-m="focus"]:not([disabled])'));
      o.mu = shape('music'); o.muInfo = called('msMusicInfo', c => c[1] === 'tok-shp').length >= 1; o.muOff = !!q('music', '.tlk-tile[data-m="off"]') && /No music/.test(o.mu.text || '');
      o.muVol = !!q('music', 'input[type="range"][data-shp="mu-vol"]');
      q('music', '[data-m="focus"]').click(); await until(() => called('msMusicPart').length, 2000);
      o.muPick = A.st.music.mood === 'focus' && !!q('music', '[data-m="focus"][aria-pressed="true"]'); o.muPart = called('msMusicPart', c => c[1] === 'tok-shp' && c[2] === 'tz1' && c[3] === 0).length >= 1;
      q('music', '[data-m="off"]').click(); await sleep(60); o.muStop = A.st.music.mood === 'off'; try { muStop(); } catch (e) {}
      K.closeAll();

      /* ---------- TALK TO MY REBBE ---------- */
      calls.length = 0; K.go('talk'); flyOff(); await until(() => q('talk', '#shp-tr-to'));
      o.tr = shape('talk'); o.trList = called('crStaffList', c => c[1] === 'tok-shp').length === 1 && qa('talk', '#shp-tr-to option').length === 3;
      o.trPrivate = /Only the person you pick will see this note/.test(o.tr.text || '');
      q('talk', '.tlk-main[data-shp="tr-ask"]').click(); await sleep(30); o.trNeedWho = /Pick who the note is for/.test(document.getElementById('shk-talk').textContent);
      const sel = q('talk', '#shp-tr-to'); sel.value = 's1'; sel.dispatchEvent(new Event('change', { bubbles: true }));
      const ta = q('talk', '#shp-tr-text'); ta.value = 'Hello, this is a made-up note.'; ta.dispatchEvent(new Event('input', { bubbles: true })); o.trCount = /30 \/ 1000/.test(q('talk', '#shp-tr-n').textContent);
      q('talk', '[data-shp="tr-ask"]').click(); await sleep(30);
      const ta2 = q('talk', '.tlk-ask'); o.trAsk = !!(ta2 && /Send this note to Rabbi Made-up\?/.test(ta2.textContent) && ta2.querySelector('.tlk-main').textContent === 'Send' && ta2.querySelector('.tlk-quiet').textContent === 'Not now'); o.trAskShape = shape('talk');
      o.trNotYet = !called('crSend').length;
      ta2.querySelector('[data-shp="tr-send"]').click(); await until(() => /Your note was sent/.test(document.getElementById('shk-talk').textContent));
      const cs = called('crSend')[0]; o.trSend = !!(cs && cs[1] === 'tok-shp' && cs[2] === 's1' && cs[3] === 'Hello, this is a made-up note.') && /It went to Rabbi Made-up/.test(document.getElementById('shk-talk').textContent);
      K.closeAll(); window.SHP.talk('I am stuck on a lesson.'); flyOff(); await sleep(100); o.trPrefill = (q('talk', '#shp-tr-text') || {}).value === 'I am stuck on a lesson.';
      /* the house closes a page */
      const hs = q('talk', '.tlk-home'); hs && hs.click(); await sleep(80); flyOff(); await sleep(450); o.houseCloses = !document.getElementById('shk-talk');
      /* K-1: none of this */
      window.TL_MAP = Object.assign({}, window.TL_MAP, { grade: 1 }); K.go('talk'); flyOff(); await sleep(60); o.k1 = !document.getElementById('shk-talk') && !K.places().some(d => Object.keys(want).indexOf(d.id) >= 0);
    } catch (e) { o.err = String(e && e.stack || e).slice(0, 400); }
    try { K.closeAll(); } catch (e) {} flyOff();
    if (D0) Object.defineProperty(window.google.script, 'run', D0); else window.google.script.run = G;
    window.GM_PLAY = keep.play; window.TM_CLASS = keep.tmc; window.TL_MAP = keep.map; if (keep.k1) document.body.classList.add('k1-home');
    try { if (window.TashbarMusic) TashbarMusic.state.info = keep.muInfo; } catch (e) {}
    window.__shpOrder = null; delete window.__shpIds;
    A.st = keep.st; A.view = 'hub'; A.play = null; SRV.token = keep.tok; try { render(); } catch (e) {} await sleep(300);
    o.left = K.open.length;
    return o;
  });
  const chk = (c, m) => { if (!c) fails.push('new shell E (canteen, library, olam haba, music, talk): ' + m); };
  if (o.noKit) { fails.push('new shell E: window.SHK is missing'); return { fails, oks }; }
  if (o.err) fails.push('new shell E crashed: ' + o.err);
  const page = (s, n) => chk(s && s.open && s.houses === 1 && s.tl && s.xs === 0 && s.kit && s.mains <= 1, n + ' is a full page with one house top left, no x, only kit buttons, at most one main (got ' + JSON.stringify(Object.assign({}, s, { text: undefined })) + ')');
  chk(o.on, 'a grade 5 made-up boy has the new shell');
  chk(o.tiles && o.tiles.every(Boolean) && o.listed, 'the five tiles are kit tiles with their class-lock doors (got ' + JSON.stringify(o.tiles) + ')');
  page(o.cn, 'the Canteen'); page(o.cnShop, 'the Canteen (tray)'); page(o.cnCheck, 'the Canteen (Buy it?)'); page(o.cnCashShape, 'the Canteen (Get canteen money)'); page(o.cnLearnShape, 'the Canteen (Lessons)');
  chk(o.cnMenuCall, 'the Canteen asks cnOrderMenu and cnKidInfo with his token');
  chk(JSON.stringify(o.cnDoors) === '["buy","cash","story","learn"]', 'the Canteen doors are in order buy, cash, story, learn (got ' + JSON.stringify(o.cnDoors) + ')');
  chk(JSON.stringify(o.cnDoorWords) === '["Buy food","Get canteen money","My story","Lessons"]', 'the Canteen doors say Buy food, Get canteen money, My story, Lessons (got ' + JSON.stringify(o.cnDoorWords) + ')');
  chk(o.cnWord && o.cnMoneyPill, 'the Canteen says "canteen money" and shows it as a money box');
  chk(o.cnQuarter, 'the Level Pass note shows when the server says pf < 1');
  chk(o.cnLocked, 'food he cannot pay for is locked, sold-out food says so');
  chk(o.cnTray, 'tapping food puts it in the tray with the "left" line');
  chk(o.cnAsk, 'Next asks "Buy it?" with the kit question (Buy it / Not now)');
  chk(o.cnPlace, 'Buy it calls cnOrderPlace(token, cart, clientId) with the tray');
  chk(o.cnTrack, 'after paying he sees what he paid, the three steps and a quiet Cancel');
  chk(o.cnCancel, 'Cancel calls cnOrderCancel(token, orderId) and shows the money the server gave back');
  chk(o.cnCash, 'Get canteen money says where it comes from, with a quiet "Get a Canteen Card"');
  chk(o.cnStory, 'My story shows money in and out from the server');
  chk(o.cnLessons >= 5, 'Lessons lists at least 5 money lessons (got ' + o.cnLessons + ')');
  chk(o.cnLesson, 'a money lesson opens through SHK.openLesson and closes the canteen');
  chk(o.cnClass, 'during class the Canteen says it opens after class and asks the server nothing');
  page(o.lb, 'My Library'); page(o.lbShelfShape, 'My Library (a shelf)');
  chk(o.lbCall && o.lbTitle, 'My Library asks libMyLibrary with his token and is named "<first name>’s Library"');
  chk(o.lbPick, 'For me shows his rebbe\'s pick with who picked it');
  chk(o.lbTabs, 'the shelf tabs are kit buttons (the open one is a pill)');
  chk(o.lbShelf, 'a shelf shows its books on Earlier / Now / Next, never a level number');
  chk(o.lbLesson, 'a book opens its lesson through SHK.openLesson');
  page(o.oh, 'the Olam Haba sky');
  chk(o.ohWords && o.ohPearls && o.ohStars, 'the Olam Haba sky shows My Olam Haba, how it works, his pearls (2 found, 6 waiting) and his stars');
  chk(o.ohGo && o.ohClosed, '"Keep going!" is the kit main button and takes him home');
  page(o.mu, 'Music');
  chk(o.muInfo && o.muOff && o.muVol, 'Music asks msMusicInfo with his token, has "No music" and a volume');
  chk(o.muPick && o.muPart, 'picking a kind of music saves it and the song is fetched with msMusicPart(token, id, part)');
  chk(o.muStop, '"No music" turns the music off');
  page(o.tr, 'Talk to my Rebbe'); page(o.trAskShape, 'Talk to my Rebbe (Send this?)');
  chk(o.trList && o.trPrivate, 'Talk to my Rebbe lists the staff from crStaffList and says only that person will see it');
  chk(o.trNeedWho && o.trCount, 'it asks him to pick who the note is for, and counts the letters');
  chk(o.trAsk && o.trNotYet, 'Send my note asks first with the kit question (Send / Not now) and sends nothing yet');
  chk(o.trSend, 'Send calls crSend(token, staffId, text) and says who it went to');
  chk(o.trPrefill, 'another part of the app can open it with a note already written (SHP.talk)');
  chk(o.houseCloses, 'the house closes the page');
  chk(o.k1, 'a Grade 1 boy gets none of these places');
  chk(o.left === 0, 'no page is left open');
  if (!fails.length) oks.push('new shell E: Canteen (4 doors in order: Buy food, Get canteen money, My story, Lessons; buy, cancel, story, money lessons, shut in class), My Library (picks, shelves, books open lessons), Olam Haba sky (pearls, stars, Keep going!), Music (moods, No music, volume, songs from the server), Talk to my Rebbe (staff list, Send? asked first, crSend): full pages, one house top left, kit buttons only, right server calls, lessons through SHK.openLesson');
  return { fails, oks };
};
