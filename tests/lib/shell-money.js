/* THE NEW SHELL, workstream A: his money (src/ShMoney.html; docs/SHELL-CONTRACT.md). On the boy page, with a made-up TEST boy and
   made-up server answers (a google.script.run proxy, as in tests/lib/classesbucket.js page()):
   - both places are registered (bank "My money", store "Store"), their tiles are kit tiles with the Store's class-lock door, and they are
     for grade 2 and up only (never a K-1 boy);
   - My money: one house top left, only kit buttons, at most one main; the words; stInfo asked; My money story (this week / everything, the
     balance after each line), the Tashbar Bank statement (account, deposit slip, no-interest note), the $1,000 Club, money lessons that
     open only through SHK.openLesson; inner pages have Back before the house;
   - the Store (reachable from My money, with Back): the 6 tabs, Buy it with TLK.ask (main + Not now, no x), stBuy called with the right
     arguments, the balance shown is the server's, the savings goal and Use it / Stop using it save with msSave, send money to a friend,
     a price he cannot pay cannot be bought, payday opens My week; the house closes the Store and My money together;
   - the paycheck: a pop-up with one round x top right and one main;
   - the money engine stays off while StoreKid.html is loaded (no double receipts), and its effect tables equal StoreKid's.
   Restores the page afterwards. */
module.exports.page = async function (pg) {
  const fails = [], oks = [];
  const o = await pg.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {}, K = window.SHK, M = window.SHM;
    o.kit = !!K; o.shm = !!M; if (!K || !M) return o;
    const keep = { st: A.st, view: A.view, tok: SRV.token, map: window.TL_MAP, info: M.info, at: M.at, tab: M.tab, ol: K.openLesson };
    const G = window.google.script.run, D0 = Object.getOwnPropertyDescriptor(window.google.script, 'run'), calls = [];
    const now = Date.now(), wk = new Date(); wk.setHours(0, 0, 0, 0); wk.setDate(wk.getDate() - wk.getDay());
    const it = (id, cat, emoji, name, cents, kind, slot, extra) => Object.assign({ id, cat, grp: '', season: '', open: true, emoji, name, cents, kind, slot: slot || '', desc: 'Made-up item for the test.', card: 0 }, extra || {});
    const INFO = { ok: true, balance: 742.5, items: [
      it('frame-gold', 'fun', '🖼️', 'Gold name frame', 15000, 'wear', 'frame'), it('trail-rainbow', 'fun', '🎀', 'Rainbow ribbon trail', 30000, 'wear', 'trail', { grp: 'trail' }),
      it('tap-stars', 'fun', '💫', 'Spinning stars blast', 15000, 'wear', 'tap', { grp: 'tap' }), it('hol-flames', 'fun', '🕯️', 'Chanukah flames trail', 25000, 'wear', 'trail', { grp: 'holiday', season: 'chanukah', open: false }),
      it('p-dvar', 'real', '🎤', 'Say the dvar Torah', 100000, 'prize'), it('p-sefer', 'real', '📚', 'A sefer of your choice', 750000, 'prize'),
      it('card-1', 'canteen', '💳', 'Canteen Card $1', 20000, 'card', '', { card: 100 }), it('give-10', 'give', '💝', 'Give $10 to Tashbar', 1000, 'donate'), it('gift', 'give', '🎁', 'Send money to a friend', 0, 'gift')],
      seasons: [{ id: 'chanukah', name: 'Chanukah', emoji: '🕎', open: false }], owned: ['trail-rainbow'],
      orders: [{ id: 'S1', at: now - 86400e3, item: 'p-song', label: 'Pick the class niggun', emoji: '🎶', cents: 30000, status: 'waiting' }],
      canteen: { cash: 3.4, rate: 200, weekMax: 500, weekUsed: 100 }, gift: { dayMax: 10000, today: 0 },
      friends: [{ id: 'TEST-SHMF1', name: 'Made-up Friend Ari' }, { id: 'TEST-SHMF2', name: 'Made-up Friend Dovid' }],
      given: { school: 123400, mine: 2500 }, wall: ['Made-up Boy B'], stars: ['Made-up Boy C'],
      week: { week: 'w-test', days: [500, 1250, 800, 2000, 300, 0].map(c => ({ cents: c })), earned: 4850, spent: 30000 }, pf: 1, openPrizes: 3 };
    const LED = [{ at: now - 60e3, amt: 5, why: 'Made-up lesson mastered' }, { at: now - 50e3, amt: 1.5, why: 'First-try bonus' }, { at: wk.getTime() + 1000, amt: -300, why: '🏪 Royal crown' }, { at: wk.getTime() - 3 * 86400e3, amt: 10, why: 'Badge: Perfect Lesson' }];
    const BUY = { ok: true, balance: 592.5, ledger: [{ at: now, amt: -150, why: '🏪 Gold name frame' }].concat(LED), order: { id: 'S9', item: 'frame-gold', label: 'Gold name frame', emoji: '🖼️', cents: 15000, status: 'done' }, cash: null };
    const ans = { stInfo: () => INFO, stBuy: (t, id) => { if (/^(frame|trail|tap)-/.test(id) && INFO.owned.indexOf(id) < 0) INFO.owned.push(id); return BUY; }, msSave: (t, sid, st) => ({ ok: true, balance: Number(st && st.balance) || 0, ledger: (st && st.ledger) || [] }) };
    const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
      if (ans[k]) return (...a) => { calls.push({ fn: k, args: a }); setTimeout(() => okf && okf(JSON.parse(JSON.stringify(ans[k](...a)))), 20); };
      let b = G; if (okf) b = b.withSuccessHandler(okf); if (nof) b = b.withFailureHandler(nof); return (...a) => b[k](...a); } });
    Object.defineProperty(window.google.script, 'run', { configurable: true, get: () => chain(null, null) });
    const lessons = []; K.openLesson = id => { lessons.push(id); };
    const onlyKit = el => !!el && [...el.querySelectorAll('button')].every(b => b.classList.contains('tlk'));
    const q = (s, r) => (r || document).querySelector(s), qa = (s, r) => [...(r || document).querySelectorAll(s)];
    const tap = el => { if (el) el.click(); return !!el; };
    const houseTL = el => { const h = qa('.shk-top .tlk-home', el), r = h[0] && h[0].getBoundingClientRect(); return h.length === 1 && !!r && r.left < 220 && r.top < 90; };
    const backFirst = el => { const t = q('.shk-top', el), b = q('.tlk-back', t), h = q('.tlk-home', t); return !!(b && h && (b.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING)); };
    const title = id => ((q('#shk-' + id + ' .shk-plaque h1') || {}).textContent || '').trim();
    const shmTap = (sel, root) => tap(q(sel, root || document));
    try {
      SRV.token = SRV.token || 't'; A.st = loadStudent({ id: 'TEST-SHM01', name: 'Made-up Boy' }); A.st.balance = 742.5; A.st.ledger = JSON.parse(JSON.stringify(LED));
      A.st.chest = { days: 2, need: 4, paid: false }; A.st.store = { owned: ['trail-rainbow'], wear: {} }; A.view = 'hub'; M.info = null; M.at = 0; M.tab = 'fun';
      /* registered, kit tiles with the Store door, grade 2 and up only */
      const tl = id => { const d = document.createElement('div'); d.innerHTML = K.tile(id); return d.firstElementChild; };
      o.tiles = ['bank', 'store'].every(id => { const b = tl(id); return b && b.classList.contains('tlk-tile') && b.getAttribute('data-shdoor') === 'store' && b.getAttribute('data-shgo') === id; });
      window.TL_MAP = { sid: A.st.id, grade: 5 }; o.g5 = K.places('k').some(d => d.id === 'bank') && K.places('c').some(d => d.id === 'store');
      window.TL_MAP = { sid: A.st.id, grade: 1 }; o.g1 = K.places().some(d => d.id === 'bank' || d.id === 'store');
      window.TL_MAP = keep.map;
      /* MY MONEY */
      calls.length = 0; o.goBank = K.go('bank'); await sleep(200);
      const bk = q('#shk-bank'); o.bank = !!bk;
      if (bk) {
        o.bankTitle = title('bank'); o.bankHouse = houseTL(bk); o.bankKit = onlyKit(bk); o.bankMains = qa('.tlk-main', bk).length; o.bankX = qa('.tlk-x', bk).length;
        o.bankWords = /What can I do with my money\?/.test(bk.textContent) && /\$742\.50/.test(bk.textContent) && /\+\$6\.50 today/.test(bk.textContent);
        o.bankAsked = calls.some(c => c.fn === 'stInfo' && c.args[0] === SRV.token);
        o.four = ['fun', 'give', 'canteen'].every(t => q('#shk-bank [data-shm="store"][data-t="' + t + '"]'));
        shmTap('#shk-bank [data-shm="view"][data-v="story"]'); await sleep(60);
        o.storyTitle = title('bank'); o.storyBack = backFirst(q('#shk-bank')); o.storyRows = qa('#shk-bank .shm-rows .r:not(.none)').length;
        o.storyFirst = ((q('#shk-bank .shm-rows .r em') || {}).textContent || '');
        shmTap('#shk-bank [data-shm="story"][data-v="all"]'); await sleep(60); o.storyAll = qa('#shk-bank .shm-rows .r:not(.none)').length;
        shmTap('#shk-bank .shk-top .tlk-back'); await sleep(60); o.backMain = title('bank') === 'My money' && !q('#shk-bank .shk-top .tlk-back');
        shmTap('#shk-bank [data-shm="view"][data-v="statement"]'); await sleep(60);
        const sb = q('#shk-bank'); o.statement = title('bank') === 'Tashbar Bank' && /····M01/.test(sb.textContent) && /Total deposit/.test(sb.textContent) && /ribbis/.test(sb.textContent) && /Available balance/.test(sb.textContent);
        shmTap('#shk-bank .shk-top .tlk-back'); await sleep(60);
        shmTap('#shk-bank [data-shm="view"][data-v="club"]'); await sleep(60); o.club = title('bank') === '$1,000 Club' && /\$742 of \$1,000/.test(q('#shk-bank').textContent);
        shmTap('#shk-bank .shk-top .tlk-back'); await sleep(60);
        shmTap('#shk-bank [data-shm="view"][data-v="learn"]'); await sleep(60);
        const ls = qa('#shk-bank [data-shm="lesson"]'); o.lessonTiles = ls.length; o.lessonKit = onlyKit(q('#shk-bank'));
        if (ls[0]) { const id = ls[0].getAttribute('data-id'); ls[0].click(); await sleep(30); o.lessonOpened = lessons.length === 1 && lessons[0] === id; }
        shmTap('#shk-bank .shk-top .tlk-back'); await sleep(60);
        /* THE STORE from My money: Back to My money */
        calls.length = 0; shmTap('#shk-bank [data-shm="store"][data-t="fun"]'); await sleep(200);
      }
      const sp = q('#shk-store'); o.store = !!sp;
      if (sp) {
        o.storeTitle = title('store'); o.storeBack = backFirst(sp); o.storeHouse = houseTL(sp); o.storeAsked = calls.some(c => c.fn === 'stInfo');
        o.tabNow = ((q('#shk-store .shm-tabs .tlk-now') || {}).textContent || ''); o.tabQuiet = qa('#shk-store .shm-tabs .tlk-quiet[data-shm="tab"]').length;
        o.storeKit = onlyKit(sp); o.storeX = qa('.tlk-x', sp).length;
        const seen = {};
        for (const t of ['real', 'canteen', 'give', 'mine', 'week', 'fun']) { shmTap('#shk-store [data-shm="tab"][data-t="' + t + '"]'); await sleep(40);
          const s = q('#shk-store'); seen[t] = { now: (q('.shm-tabs .tlk-now', s) || {}).textContent, mains: qa('.tlk-main', s).length, kit: onlyKit(s), text: s.textContent }; }
        o.tabs = seen.real.now === 'Real prizes' && seen.canteen.now === 'Canteen Cards' && seen.give.now === 'Give' && seen.mine.now === 'My stuff' && seen.week.now === 'My week' && seen.fun.now === 'Fun';
        o.tabsKit = Object.values(seen).every(x => x.kit && x.mains <= 1);
        o.tabWords = /canteen money/.test(seen.canteen.text) && /Builders’ Wall/.test(seen.give.text) && /My orders/.test(seen.mine.text) && /Tashbar sky/.test(seen.mine.text) && /Earned this week/.test(seen.week.text) && /Holiday shop/.test(seen.fun.text) && /Back before Chanukah/.test(seen.fun.text);
        /* Buy it: TLK.ask with one main and Not now, no x; Not now closes it */
        shmTap('#shk-store [data-shm="buy"][data-id="frame-gold"]'); await sleep(40);
        const ak = q('#shk-store .shm-askov'); o.ask = !!(ak && q('.tlk-ask', ak) && qa('.tlk-main', ak).length === 1 && /Not now/.test((q('.tlk-quiet', ak) || {}).textContent || '') && !q('.tlk-x', ak) && /Buy Gold name frame\?/.test(ak.textContent));
        o.askOneMain = qa('#shk-store .tlk-main').length === 1;
        shmTap('#shk-store .shm-askov .tlk-quiet'); await sleep(40); o.notNow = !q('#shk-store .shm-askov');
        shmTap('#shk-store [data-shm="buy"][data-id="frame-gold"]'); await sleep(40); calls.length = 0; shmTap('#shk-store .shm-askov .tlk-main'); await sleep(250);
        const bc = calls.find(c => c.fn === 'stBuy'); o.buyArgs = !!(bc && bc.args[0] === SRV.token && bc.args[1] === 'frame-gold' && bc.args[2] && /^[a-z0-9]{9,}$/.test(bc.args[2].clientId) && 'to' in bc.args[2] && 'amount' in bc.args[2]);
        o.buyDone = /It’s yours!/.test((q('#shk-store .shm-askov') || {}).textContent || ''); o.serverBal = A.st.balance === 592.5 && /\$592\.50/.test((q('#shk-store .shk-top .tlk-money') || {}).textContent || '');
        o.worn = A.st.store.wear.frame === 'frame-gold';
        shmTap('#shk-store .shm-askov .tlk-main'); await sleep(40); o.doneClosed = !q('#shk-store .shm-askov');
        /* a price he cannot pay cannot be bought */
        shmTap('#shk-store [data-shm="tab"][data-t="real"]'); await sleep(40);
        o.cantBuy = !!(q('#shk-store [data-shm="buy"][data-id="p-sefer"]') || {}).disabled;
        /* the savings goal saves with msSave */
        calls.length = 0; shmTap('#shk-store [data-shm="goal"][data-id="p-dvar"]'); await sleep(900);
        o.goal = A.st.store.goal === 'p-dvar' && !!q('#shk-store .shm-item.goal') && calls.some(c => c.fn === 'msSave');
        shmTap('#shk-store [data-shm="goal"][data-id="p-dvar"]'); await sleep(40); o.ungoal = !A.st.store.goal;
        /* Use it / Stop using it */
        shmTap('#shk-store [data-shm="tab"][data-t="mine"]'); await sleep(40);
        shmTap('#shk-store [data-shm="wear"][data-id="trail-rainbow"]'); await sleep(40); const on = A.st.store.wear.trail === 'trail-rainbow';
        shmTap('#shk-store [data-shm="wear"][data-id="trail-rainbow"]'); await sleep(40); o.wear = on && !A.st.store.wear.trail;
        /* send money to a friend */
        shmTap('#shk-store [data-shm="tab"][data-t="give"]'); await sleep(40);
        const gq = q('#shm-gq'); if (gq) { gq.value = 'Ari'; gq.dispatchEvent(new Event('input', { bubbles: true })); await sleep(40); }
        const opts = qa('#shm-gto option'); o.search = opts.length === 1 && /Ari/.test(opts[0].textContent);
        const gs = q('#shm-gto'); if (gs) { gs.value = 'TEST-SHMF1'; gs.dispatchEvent(new Event('change', { bubbles: true })); await sleep(40); }
        shmTap('#shk-store [data-shm="amt"][data-a="10"]'); await sleep(40);
        const send = q('#shk-store [data-shm="sendgift"]'); o.sendWord = !!send && /^Send \$10\.00$/.test(send.textContent) && !send.disabled;
        tap(send); await sleep(40); o.giftAsk = /Send \$10\.00 to Made-up Friend Ari\?/.test((q('#shk-store .shm-askov') || {}).textContent || '');
        calls.length = 0; shmTap('#shk-store .shm-askov .tlk-main'); await sleep(250);
        const gc = calls.find(c => c.fn === 'stBuy'); o.giftArgs = !!(gc && gc.args[1] === 'gift' && gc.args[2].to === 'TEST-SHMF1' && gc.args[2].amount === 10);
        shmTap('#shk-store .shm-askov .tlk-main'); await sleep(40);
        /* the canteen tab leads to the canteen */
        shmTap('#shk-store [data-shm="tab"][data-t="canteen"]'); await sleep(40); o.toCanteen = !!q('#shk-store [data-shgo="canteen"],#shk-store [data-cno="open"]');
        /* the house closes the Store and My money together */
        shmTap('#shk-store .shk-top .tlk-home'); await sleep(200); o.homeClosed = !q('#shk-store') && !q('#shk-bank');
      }
      /* the Store straight from the home: no Back; payday opens My week */
      K.go('store'); await sleep(150); o.noBack = !!q('#shk-store') && !q('#shk-store .shk-top .tlk-back');
      K.closeAll(); M.paydayShow(); await sleep(150); o.payday = !!q('#shk-store') && /PAYDAY!/.test(q('#shk-store').textContent) && ((q('#shk-store .shm-tabs .tlk-now') || {}).textContent === 'My week');
      K.closeAll(); M.payday = false;
      /* the paycheck */
      o.rec = M.receipt([{ at: now, amt: 5, why: 'Made-up lesson mastered' }, { at: now, amt: 1, why: 'Right answer' }, { at: now, amt: 1, why: 'Right answer' }]); await sleep(60);
      const rp = q('#shk-shm-pay');
      if (rp) { const x = qa('.tlk-x', rp), r = x[0] && x[0].getBoundingClientRect(), c = q('.shk-card', rp).getBoundingClientRect();
        o.recX = x.length === 1 && r.left > c.left + c.width / 2 && r.top < c.top + 80; o.recMain = qa('.tlk-main', rp).length === 1 && /Put it in my bank/.test(rp.textContent) && onlyKit(rp);
        o.recLines = /2 × Right answer/.test(rp.textContent) && /TOTAL/.test(rp.textContent) && /\$7\.00/.test(rp.textContent) && /PAID/.test(rp.textContent);
        shmTap('#shk-shm-pay .tlk-main'); await sleep(60); o.recClosed = !q('#shk-shm-pay'); }
      /* the money engine: off while StoreKid is loaded; the same effect tables */
      o.engine = M.engine === !window.TLSTORE;
      const F = window.TL_STORE_FX, X = M.fx, strip = h => String(h).replace(/pvg\d+/g, 'pvg');
      o.fxSame = !!F && ['TAPS', 'TAP_OF', 'TRAIL_OF', 'TRAILS', 'COLORS'].every(k => JSON.stringify(F[k]) === JSON.stringify(X[k]))
        && ['trail', 'trail-rainbow', 'tap-stars', 'hol-jelly', 'hol-donuts', 'tap-gold', 'hol-menorah'].every(id => JSON.stringify(F.tapOf(id)) === JSON.stringify(X.tapOf(id)) && JSON.stringify(F.trailOf(id)) === JSON.stringify(X.trailOf(id)) && strip(F.pvStatic(id, '⭐')) === strip(X.pvStatic(id, '⭐')));
    } catch (e) { o.err = String(e && e.stack || e).slice(0, 400); }
    try { K.closeAll(); } catch (e) {}
    if (D0) Object.defineProperty(window.google.script, 'run', D0); else window.google.script.run = G;
    K.openLesson = keep.ol; window.TL_MAP = keep.map; M.info = keep.info; M.at = keep.at; M.tab = keep.tab; M.ask = null; M.payday = false; M.gift = { to: '', amt: 5, q: '' }; M.story = 'week'; M.bview = 'main';
    clearTimeout(M.sv); A.st = keep.st; A.view = 'hub'; A.play = null; SRV.token = keep.tok; render(); await sleep(200);
    o.left = K.open.length;
    return o;
  });
  const chk = (c, m) => { if (!c) fails.push('new shell money (ShMoney.html): ' + m); };
  if (o.err) fails.push('new shell money crashed: ' + o.err);
  chk(o.kit && o.shm, 'window.SHK and window.SHM must be on the boy page');
  if (o.kit && o.shm && !o.err) {
    chk(o.tiles, 'the bank and store tiles are kit tiles (tlk-tile) with the Store class-lock door');
    chk(o.g5 && !o.g1, 'My money and the Store are for grade 2 and up, never for a K-1 boy (got g5 ' + o.g5 + ', g1 ' + o.g1 + ')');
    chk(o.goBank && o.bank && o.bankTitle === 'My money', 'SHK.go("bank") opens My money');
    chk(o.bankHouse && o.bankKit && o.bankMains <= 1 && o.bankX === 0, 'My money has one house top left, only kit buttons, at most one main, no x');
    chk(o.bankWords && o.four, 'My money shows his money, today, and Spend / Give / Canteen');
    chk(o.bankAsked, 'My money asks the server (stInfo with his token)');
    chk(o.storyTitle === 'My money story' && o.storyBack && o.storyRows === 3 && o.storyFirst === '$742.50' && o.storyAll === 4, 'My money story: Back before the house, this week (3) and everything (4), the balance after each line (got ' + JSON.stringify([o.storyTitle, o.storyBack, o.storyRows, o.storyFirst, o.storyAll]) + ')');
    chk(o.backMain, 'Back returns to My money');
    chk(o.statement, 'the Tashbar Bank statement: account, available balance, deposit slip, no-interest note');
    chk(o.club, 'the $1,000 Club shows how far he is');
    chk(o.lessonTiles >= 1 && o.lessonKit && o.lessonOpened, 'a money lesson opens only through SHK.openLesson (got ' + o.lessonTiles + ' tiles)');
    chk(o.store && o.storeTitle === 'Store' && o.storeBack && o.storeHouse && o.storeAsked && o.storeX === 0, 'Spend opens the Store from My money, with Back and the house, and asks stInfo');
    chk(o.tabNow === 'Fun' && o.tabQuiet === 5 && o.tabs && o.tabsKit, 'the Store has its 6 tabs (the open one a "now" pill), only kit buttons, at most one main on each');
    chk(o.tabWords, 'the tabs show their parts (canteen money, Builders’ Wall, My orders, Tashbar sky, My week, Holiday shop)');
    chk(o.ask && o.askOneMain && o.notNow, 'Buy it asks with TLK.ask (one main, Not now, no x) and Not now closes it');
    chk(o.buyArgs && o.buyDone && o.serverBal && o.worn && o.doneClosed, 'Buy calls stBuy(token, item, {clientId, to, amount}) and shows the balance the server sent (got ' + JSON.stringify([o.buyArgs, o.buyDone, o.serverBal, o.worn, o.doneClosed]) + ')');
    chk(o.cantBuy, 'a price he cannot pay cannot be bought');
    chk(o.goal && o.ungoal, 'the savings goal is set, saved with msSave, and can be taken off');
    chk(o.wear, 'Use it / Stop using it changes what he wears');
    chk(o.search && o.sendWord && o.giftAsk && o.giftArgs, 'send money to a friend: search, pick, amount, Send, stBuy("gift", {to, amount})');
    chk(o.toCanteen, 'the Canteen Cards tab leads to the canteen');
    chk(o.homeClosed, 'the house closes the Store and My money together');
    chk(o.noBack, 'the Store opened from the home has no Back');
    chk(o.payday, 'payday opens the Store on My week with PAYDAY');
    chk(o.rec && o.recX && o.recMain && o.recLines && o.recClosed, 'the paycheck: one x top right, one main "Put it in my bank", its lines and total, and it closes');
    chk(o.engine, 'the money engine is off while StoreKid.html is loaded and on when it is gone');
    chk(o.fxSame, "the store items' effect tables in ShMoney equal StoreKid's (window.TL_STORE_FX)");
    chk(o.left === 0, 'no page is left open');
  }
  if (!fails.length) oks.push('new shell money: My money (story, statement, deposit slip, $1,000 Club, money lessons through SHK.openLesson) and the Store (6 tabs, TLK.ask, stBuy with the right arguments, the server\'s balance, goal, Use it, gift to a friend, payday), the paycheck pop-up, kit buttons only, house/x in place, grade 2+ only, effect tables equal');
  return { fails, oks };
};
