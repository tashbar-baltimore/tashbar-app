/* Store.js — the Tashbar Store (v162, takeover4; Head of School 2026-11-13: "make a store ... one of the options is to turn
   their money into canteen cash ... tzedakah: donate back to Tashbar ... give it to a friend ... crazy, silly, nice, fun, real").
   Tashbar dollars (Money.js) are spent ONLY here. Every spend is its own ledger row (negative cents) with a unique key.
   - fun:     things on the screen (frames, crowns, themes, pets, sounds). Yours at once, no staff needed.
   - real:    a real prize. It waits for a staff member to hand it out (Staff screen, "Store orders"). Cancel = full refund.
   - canteen: a Canteen Card. The dollars turn into Canteen Cash at STORE.CANTEEN_RATE, up to STORE.CANTEEN_WEEK a week.
              It is written to the rewards sheet as a credit row in Canteen Purchases (like a void: a minus amount),
              so the canteen sheet's own balance formula adds it. Food is bought ONLY with Canteen Cash at the canteen.
   - give:    give back to Tashbar (tzedakah) or send dollars to a friend.
   All prices and limits are in STORE below. Change them only here. Amounts are whole cents. */
var STORE = {
  VERSION: 'store-1.1.0',
  TAB: 'TL_Store',
  HEAD: ['order_id', 'at', 'student_id', 'name', 'item_id', 'item', 'cents', 'status', 'updated_at', 'by', 'note', 'extra'],
  CANTEEN_RATE: 200,          /* Tashbar $200 = $1.00 Canteen Cash */
  CANTEEN_WEEK: 500,          /* at most $5.00 Canteen Cash from the store per boy per week (cents of Canteen Cash) */
  GIFT_DAY: 10000,            /* a boy may send at most $100 a day to friends */
  OPEN_PRIZES: 3,             /* at most 3 real prizes waiting to be handed out at a time */
  /* Holiday shop windows on the Hebrew calendar (New York day). A window is [fromMonth, fromDay, toMonth, toDay] with months numbered
     Tishri 1, Heshvan 2, Kislev 3, Tevet 4, Shevat 5, Adar I 5.5, Adar / Adar II 6, Nisan 7, Iyar 8, Sivan 9, Tamuz 10, Av 11, Elul 12.
     Each opens about two weeks before the Yom Tov and closes after it. */
  SEASONS: [
    { id: 'yamim',     name: 'Rosh Hashanah', emoji: '🍎', win: [[12, 1, 12, 30], [1, 1, 1, 10]] },
    { id: 'sukkos',    name: 'Sukkos',        emoji: '🌿', win: [[1, 1, 1, 23]] },
    { id: 'chanukah',  name: 'Chanukah',      emoji: '🕎', win: [[3, 1, 4, 3]] },
    { id: 'tubishvat', name: 'Tu BiShvat',    emoji: '🌳', win: [[4, 20, 5, 15]] },
    { id: 'purim',     name: 'Purim',         emoji: '🎭', win: [[5.5, 20, 6, 15]] },   /* from Rosh Chodesh Adar; in a leap year from Adar I 20 */
    { id: 'pesach',    name: 'Pesach',        emoji: '🌊', win: [[6, 16, 7, 22]] },
    { id: 'lagbaomer', name: 'Lag BaOmer',    emoji: '🔥', win: [[8, 1, 8, 18]] },
    { id: 'shavuos',   name: 'Shavuos',       emoji: '🌸', win: [[8, 19, 9, 7]] }
  ],
  ITEMS: [
    /* ---------- FUN: on the screen, yours right away ---------- */
    { id: 'frame-gold',  cat: 'fun', emoji: '🖼️', name: 'Gold name frame',        cents: 15000, kind: 'wear', slot: 'frame', desc: 'Your name shines in a gold frame on your home page.' },
    { id: 'frame-fire',  cat: 'fun', emoji: '🔥', name: 'Fire name frame',        cents: 25000, kind: 'wear', slot: 'frame', desc: 'Flames dance around your name.' },
    { id: 'crown',       cat: 'fun', emoji: '👑', name: 'Royal crown',            cents: 30000, kind: 'wear', slot: 'hat',   desc: 'A crown next to your name. Fit for a king of learning.' },
    { id: 'title-tc',    cat: 'fun', emoji: '📜', name: 'Title: Talmid Chacham in Training', cents: 40000, kind: 'wear', slot: 'title', desc: 'This title shows under your name.' },
    { id: 'title-wiz',   cat: 'fun', emoji: '🧙', name: 'Title: Math Wizard',     cents: 40000, kind: 'wear', slot: 'title', desc: 'This title shows under your name.' },
    { id: 'title-boss',  cat: 'fun', emoji: '💼', name: 'Title: Big Boss of the Bank', cents: 60000, kind: 'wear', slot: 'title', desc: 'For a student who saves like a pro.' },
    { id: 'theme-space', cat: 'fun', emoji: '🚀', name: 'Outer Space home page',  cents: 50000, kind: 'wear', slot: 'theme', desc: 'Only your home page: it floats in outer space.' },
    { id: 'theme-ocean', cat: 'fun', emoji: '🐠', name: 'Ocean Waves home page',  cents: 50000, kind: 'wear', slot: 'theme', desc: 'Only your home page: deep blue ocean waves. (To color the whole app, see App colors.)' },
    { id: 'theme-gold',  cat: 'fun', emoji: '🌇', name: 'Yerushalayim Gold home page', cents: 80000, kind: 'wear', slot: 'theme', desc: 'Only your home page: golden stone, like the walls of Yerushalayim.' },
    { id: 'pet-lion',    cat: 'fun', emoji: '🦁', name: 'Lion cub buddy',         cents: 35000, kind: 'wear', slot: 'pet',   desc: 'A lion cub sits by your name and roars when you get it right.' },
    { id: 'pet-eagle',   cat: 'fun', emoji: '🦅', name: 'Eagle buddy',            cents: 35000, kind: 'wear', slot: 'pet',   desc: 'An eagle that flies with you.' },
    { id: 'pet-dolphin', cat: 'fun', emoji: '🐬', name: 'Dolphin buddy',          cents: 35000, kind: 'wear', slot: 'pet',   desc: 'A happy dolphin that jumps for every right answer.' },
    { id: 'trail',       cat: 'fun', emoji: '🌟', name: 'Falling stars trail',    cents: 20000, kind: 'wear', slot: 'trail', desc: 'A line of little stars follows your mouse or finger and drifts down. A tap pops one big glowing star.' },
    { id: 'sound-duck',  cat: 'fun', emoji: '🦆', name: 'Silly duck sounds',      cents: 10000, kind: 'wear', slot: 'sound', desc: 'Quack! A silly duck sound on every right answer.' },
    { id: 'sound-drum',  cat: 'fun', emoji: '🥁', name: 'Drum roll sounds',       cents: 10000, kind: 'wear', slot: 'sound', desc: 'Ba-dum-tss on every right answer.' },
    { id: 'gold-coins',  cat: 'fun', emoji: '💰', name: 'Gold rain on my money page', cents: 25000, kind: 'wear', slot: 'coins', desc: 'Only on your money page: gold coins and gold bars rain down. (Not on taps.)' },
    { id: 'star-named',  cat: 'fun', emoji: '⭐', name: 'Name a star in the Tashbar sky', cents: 100000, kind: 'keep', desc: 'A star with your name goes up in the Tashbar sky for everyone to see.' },
    /* ---------- FUN SHOP 2 (2026-11-19, moshe@ session): tap blasts, trails, app colors, bonuses, holiday editions.
       grp = the shelf in the Fun tab. slot 'tap' = how the tap and swipe splash looks (HomePlus); 'trail' = what follows the mouse or finger;
       'color' = a color theme for every page of the app. season = a holiday edition: it can be BOUGHT only in that holiday's window
       (STORE.SEASONS, Hebrew calendar); once bought it is yours forever. ---------- */
    { id: 'tap-rainbow',   cat: 'fun', grp: 'tap', emoji: '🌈', name: 'Rainbow rings blast', cents: 15000, kind: 'wear', slot: 'tap', desc: 'Every tap makes rainbow rings ripple out; swipes leave little rainbow splashes.' },
    { id: 'tap-stars',     cat: 'fun', grp: 'tap', emoji: '💫', name: 'Spinning stars blast', cents: 15000, kind: 'wear', slot: 'tap', desc: 'Every tap shoots a circle of spinning stars; swipes leave little star splashes.' },
    { id: 'tap-confetti',  cat: 'fun', grp: 'tap', emoji: '🎊', name: 'Confetti tap blast', cents: 15000, kind: 'wear', slot: 'tap', desc: 'A small pop of confetti from your finger on every tap and swipe.' },
    { id: 'tap-fireworks', cat: 'fun', grp: 'tap', emoji: '🎆', name: 'Fireworks tap blast', cents: 20000, kind: 'wear', slot: 'tap', desc: 'A firework bursts from your finger on every tap; swipes leave sparks.' },
    { id: 'tap-gold',      cat: 'fun', grp: 'tap', emoji: '🪙', name: 'Flying coins tap blast', cents: 25000, kind: 'wear', slot: 'tap', desc: 'Shiny gold coins flip out of every tap and swipe.' },
    { id: 'trail-rainbow', cat: 'fun', grp: 'trail', emoji: '🎀', name: 'Rainbow ribbon trail', cents: 30000, kind: 'wear', slot: 'trail', desc: 'A smooth rainbow ribbon follows your mouse or finger everywhere. A tap swirls out rainbow streamers.' },
    { id: 'trail-comet',   cat: 'fun', grp: 'trail', emoji: '☄️', name: 'Comet tail trail',  cents: 25000, kind: 'wear', slot: 'trail', desc: 'A blazing comet tail follows you around the screen.' },
    { id: 'trail-sparkle', cat: 'fun', grp: 'trail', emoji: '✨', name: 'Sparkle dust trail', cents: 20000, kind: 'wear', slot: 'trail', desc: 'Sparkly dust falls behind your mouse or finger.' },
    { id: 'trail-bubbles', cat: 'fun', grp: 'trail', emoji: '🫧', name: 'Bubble trail',      cents: 20000, kind: 'wear', slot: 'trail', desc: 'Bubbles float up wherever you go.' },
    { id: 'color-ocean',   cat: 'fun', grp: 'color', emoji: '💧', name: 'Ocean Aqua colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Every page turns cool aqua and sea-green: home, lessons and all.' },
    { id: 'color-forest',  cat: 'fun', grp: 'color', emoji: '🌲', name: 'Forest Green colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Every page turns deep pine-forest green.' },
    { id: 'color-sunset',  cat: 'fun', grp: 'color', emoji: '🌅', name: 'Sunset colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Every page turns warm orange and pink, like the sky before Maariv.' },
    { id: 'color-candy',   cat: 'fun', grp: 'color', emoji: '🍬', name: 'Cotton Candy colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Soft pink and sky blue on every page.' },
    { id: 'color-royal',   cat: 'fun', grp: 'color', emoji: '💜', name: 'Royal Purple and Gold colors for the whole app', cents: 50000, kind: 'wear', slot: 'color', desc: 'Deep purple and gold, fit for a king, on every page.' },
    { id: 'bonus-cannon',  cat: 'fun', grp: 'bonus', emoji: '🎉', name: 'Confetti cannon button', cents: 30000, kind: 'keep', desc: 'A 🎉 button on your home page. Tap it and a big cannon of confetti fills the whole screen.' },
    { id: 'frame-rainbow', cat: 'fun', grp: 'bonus', emoji: '💡', name: 'Name in rainbow lights', cents: 35000, kind: 'wear', slot: 'frame', desc: 'Your name glows in moving rainbow lights.' },
    { id: 'bonus-combo',   cat: 'fun', grp: 'bonus', emoji: '🎇', name: '3-in-a-row fireworks show', cents: 30000, kind: 'wear', slot: 'combo', desc: 'Get 3 right answers in a row and a fireworks show fills the sky. (Not on taps.)' },
    { id: 'hol-honey',     cat: 'fun', grp: 'holiday', season: 'yamim',    emoji: '🍎', name: 'Apples and honey trail',      cents: 25000, kind: 'wear', slot: 'trail', desc: 'Rosh Hashanah edition: apples and honey follow your finger. A sweet new year!' },
    { id: 'hol-newyear',   cat: 'fun', grp: 'holiday', season: 'yamim',    emoji: '📯', name: 'Golden New Year colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Rosh Hashanah edition: white and gold on every page.' },
    { id: 'hol-sukkah',    cat: 'fun', grp: 'holiday', season: 'sukkos',   emoji: '🌿', name: 'Sukkah decorations blast',   cents: 25000, kind: 'wear', slot: 'tap', desc: 'Sukkos edition: every tap bursts into sukkah decorations.' },
    { id: 'hol-schach',    cat: 'fun', grp: 'holiday', season: 'sukkos',   emoji: '🛖', name: 'Schach and Esrog colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Sukkos edition: schach green and bright esrog yellow on every page.' },
    { id: 'hol-flames',    cat: 'fun', grp: 'holiday', season: 'chanukah', emoji: '🕯️', name: 'Chanukah flames trail',      cents: 25000, kind: 'wear', slot: 'trail', desc: 'Chanukah edition: little flames follow your mouse or finger.' },
    { id: 'hol-menorah',   cat: 'fun', grp: 'holiday', season: 'chanukah', emoji: '🕎', name: 'Menorah light blast',        cents: 25000, kind: 'wear', slot: 'tap', desc: 'Chanukah edition: every tap lights up like the menorah.' },
    { id: 'hol-donuts',    cat: 'fun', grp: 'holiday', season: 'chanukah', emoji: '🍩', name: 'Rolling donuts trail',        cents: 30000, kind: 'wear', slot: 'trail', desc: 'Chanukah edition: little donuts roll away from your finger in every direction as you swipe.' },
    { id: 'hol-chanukah',  cat: 'fun', grp: 'holiday', season: 'chanukah', emoji: '💙', name: 'Chanukah blue and silver colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Chanukah edition: silver-white pages with deep navy and bright blue.' },
    { id: 'hol-fruit',     cat: 'fun', grp: 'holiday', season: 'tubishvat', emoji: '🌳', name: 'Seven species blast',       cents: 25000, kind: 'wear', slot: 'tap', desc: 'Tu BiShvat edition: grapes, olives and wheat burst out of every tap.' },
    { id: 'hol-masks',     cat: 'fun', grp: 'holiday', season: 'purim',    emoji: '🎭', name: 'Purim masks blast',          cents: 25000, kind: 'wear', slot: 'tap', desc: 'Purim edition: masks, crowns and drums fly out of every tap.' },
    { id: 'hol-purim',     cat: 'fun', grp: 'holiday', season: 'purim',    emoji: '🥳', name: 'Purim carnival colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Purim edition: bright magenta and orange party colors on every page.' },
    { id: 'hol-sea',       cat: 'fun', grp: 'holiday', season: 'pesach',   emoji: '🌊', name: 'Splitting Sea trail',        cents: 25000, kind: 'wear', slot: 'trail', desc: 'Pesach edition: the waves split wherever your finger goes.' },
    { id: 'hol-spring',    cat: 'fun', grp: 'holiday', season: 'pesach',   emoji: '🌱', name: 'Pesach spring sky colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Pesach edition: sky blue and fresh leaf green on every page.' },
    { id: 'hol-bonfire',   cat: 'fun', grp: 'holiday', season: 'lagbaomer', emoji: '🏕️', name: 'Bonfire sparks trail',      cents: 25000, kind: 'wear', slot: 'trail', desc: 'Lag BaOmer edition: bonfire sparks fly behind your finger.' },
    { id: 'hol-arrows',    cat: 'fun', grp: 'holiday', season: 'lagbaomer', emoji: '🏹', name: 'Bow and arrow blast',       cents: 25000, kind: 'wear', slot: 'tap', desc: 'Lag BaOmer edition: arrows fly out of every tap.' },
    { id: 'hol-flowers',   cat: 'fun', grp: 'holiday', season: 'shavuos',  emoji: '🌸', name: 'Shavuos flower blast',       cents: 25000, kind: 'wear', slot: 'tap', desc: 'Shavuos edition: flowers and greenery burst out of every tap.' },
    { id: 'hol-shavuos',   cat: 'fun', grp: 'holiday', season: 'shavuos',  emoji: '🌼', name: 'Shavuos garden colors for the whole app', cents: 40000, kind: 'wear', slot: 'color', desc: 'Shavuos edition: garden green with pink flowers on every page, like the shul on Shavuos.' },
    /* ---------- REAL: a staff member hands it out ---------- */
    { id: 'p-cert',      cat: 'real', emoji: '📃', name: 'Certificate of Excellence to take home', cents: 25000, kind: 'prize', desc: 'A real certificate with your name, signed by the Head of School.' },
    { id: 'p-song',      cat: 'real', emoji: '🎶', name: 'Pick the class niggun',  cents: 30000, kind: 'prize', desc: 'You choose the niggun the class sings today.' },
    { id: 'p-line',      cat: 'real', emoji: '🥇', name: 'Front of the line for a day', cents: 30000, kind: 'prize', desc: 'You lead the line all day.' },
    { id: 'p-call',      cat: 'real', emoji: '📞', name: 'A proud phone call home', cents: 40000, kind: 'prize', desc: 'Your rebbe calls home to tell your parents how proud he is.' },
    { id: 'p-helper',    cat: 'real', emoji: '🙋', name: "Rebbe's helper for a day", cents: 50000, kind: 'prize', desc: 'Hand out papers, run errands and help your rebbe all day.' },
    { id: 'p-free',      cat: 'real', emoji: '⏰', name: '10 extra minutes of free time', cents: 60000, kind: 'prize', desc: 'Ten extra minutes for you, at a time your rebbe picks.' },
    { id: 'p-game',      cat: 'real', emoji: '🎲', name: 'Choose the class game',  cents: 80000, kind: 'prize', desc: 'You pick the game the class plays at recess.' },
    { id: 'p-dvar',      cat: 'real', emoji: '🎤', name: 'Say the dvar Torah on the loudspeaker', cents: 100000, kind: 'prize', desc: 'The whole school hears your dvar Torah.' },
    { id: 'p-hw',        cat: 'real', emoji: '📝', name: 'Homework pass (one assignment)', cents: 150000, kind: 'prize', desc: 'Skip one homework assignment, with your rebbe’s OK.' },
    { id: 'p-lunch',     cat: 'real', emoji: '🍽️', name: 'Lunch with your Rebbe',  cents: 250000, kind: 'prize', desc: 'Eat your lunch with your rebbe. Just the two of you.' },
    { id: 'p-chair',     cat: 'real', emoji: '🪑', name: "Sit in the Head of School's chair for a morning", cents: 400000, kind: 'prize', desc: 'Be the boss of the office for a morning.' },
    { id: 'p-hos',       cat: 'real', emoji: '🤝', name: 'Lunch with the Head of School', cents: 500000, kind: 'prize', desc: 'Lunch with the Head of School himself.' },
    { id: 'p-sefer',     cat: 'real', emoji: '📚', name: 'A sefer or book of your choice', cents: 750000, kind: 'prize', desc: 'Pick a sefer or a book (staff approve it). It is yours to keep.' },
    /* ---------- CANTEEN: Tashbar dollars turn into Canteen Cash ---------- */
    { id: 'card-1',      cat: 'canteen', emoji: '💳', name: 'Canteen Card $1',      cents: 20000,  kind: 'card', card: 100, desc: '$1.00 goes into your Canteen Cash. Buy food at the canteen.' },
    { id: 'card-2',      cat: 'canteen', emoji: '💳', name: 'Canteen Card $2',      cents: 40000,  kind: 'card', card: 200, desc: '$2.00 goes into your Canteen Cash.' },
    { id: 'card-5',      cat: 'canteen', emoji: '💳', name: 'Canteen Card $5',      cents: 100000, kind: 'card', card: 500, desc: '$5.00 goes into your Canteen Cash.' },
    /* ---------- GIVE: tzedakah back to Tashbar, or to a friend ---------- */
    { id: 'give-10',     cat: 'give', emoji: '💝', name: 'Give $10 to Tashbar',     cents: 1000,   kind: 'donate', desc: 'Tzedakah! Your money goes back to Tashbar.' },
    { id: 'give-25',     cat: 'give', emoji: '💝', name: 'Give $25 to Tashbar',     cents: 2500,   kind: 'donate', desc: 'Tzedakah! Your money goes back to Tashbar.' },
    { id: 'give-100',    cat: 'give', emoji: '💖', name: 'Give $100 to Tashbar',    cents: 10000,  kind: 'donate', desc: 'A big tzedakah. Thank you!' },
    { id: 'brick',       cat: 'give', emoji: '🧱', name: "A brick on the Builders' Wall", cents: 25000, kind: 'donate', wall: true, desc: 'Give $250 to Tashbar and your name goes on a brick of the Builders’ Wall.' },
    { id: 'gift',        cat: 'give', emoji: '🎁', name: 'Send money to a friend',  cents: 0,      kind: 'gift', desc: 'Pick a friend and how much to send. Up to $100 a day.' }
  ]
};

/* the ledger types the store adds (Money.js checks every type) */
(function () { ['spend', 'gift', 'giftin', 'refund'].forEach(function (t) { if (MONEY.TYPES.indexOf(t) < 0) MONEY.TYPES.push(t); }); })();

/* Today's Hebrew date as [month number (see STORE.SEASONS), day], New York time. null if this server has no Hebrew calendar. */
function stHebDay_(when) {
  try {
    var parts = new Intl.DateTimeFormat('en-u-ca-hebrew', { timeZone: 'America/New_York', day: 'numeric', month: 'long' }).formatToParts(when || new Date());
    var m = '', d = 0; parts.forEach(function (p) { if (p.type === 'month') m = p.value; if (p.type === 'day') d = Number(p.value); });
    var N = { 'Tishri': 1, 'Tishrei': 1, 'Heshvan': 2, 'Cheshvan': 2, 'Kislev': 3, 'Tevet': 4, 'Teves': 4, 'Shevat': 5, 'Adar I': 5.5, 'Adar': 6, 'Adar II': 6, 'Nisan': 7, 'Iyar': 8, 'Sivan': 9, 'Tamuz': 10, 'Tammuz': 10, 'Av': 11, 'Elul': 12 }[m];
    return N && d ? [N, d] : null;
  } catch (e) { return null; }
}
/* the holiday windows open today: { chanukah: true, ... } */
function stSeasonsOpen_(when) {
  var h = stHebDay_(when), open = {}; if (!h) return open; var v = h[0] * 100 + h[1];
  STORE.SEASONS.forEach(function (s) { s.win.forEach(function (w) { if (v >= w[0] * 100 + w[1] && v <= w[2] * 100 + w[3]) open[s.id] = true; }); });
  return open;
}
function stItem_(id) { return STORE.ITEMS.filter(function (x) { return x.id === id; })[0] || null; }
function stTab_() {
  var b = msBook_(), sh = b.getSheetByName(STORE.TAB);
  if (!sh) { sh = b.insertSheet(STORE.TAB); sh.getRange(1, 1, 1, STORE.HEAD.length).setValues([STORE.HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function stOrders_() {
  var sh = stTab_(), n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, STORE.HEAD.length).getValues().map(function (r, i) {
    return { row: i + 2, id: String(r[0]), at: r[1] ? new Date(r[1]).getTime() : 0, sid: String(r[2]), name: String(r[3]), item: String(r[4]), label: String(r[5]),
      cents: Number(r[6]) || 0, status: String(r[7]), upd: r[8] ? new Date(r[8]).getTime() : 0, by: String(r[9] || ''), note: String(r[10] || ''), extra: String(r[11] || '') };
  }).filter(function (o) { return o.id; });
}
function stOut_(o) { var it = stItem_(o.item) || {}; return { id: o.id, at: o.at, item: o.item, label: o.label, emoji: it.emoji || '🎁', cents: o.cents, status: o.status, upd: o.upd, note: o.note, extra: o.extra, name: o.name, sid: o.sid }; }
function stKid_(token) { var s = msSession_(token); if (s.role !== 'kid' || !s.sid) throw new Error('Sign in with your own code.'); return s.sid; }
function stName_(sid) { var r = msRoster_().filter(function (x) { return x.id === sid; })[0]; return r ? r.name : sid; }
function stWeekKey_() { return moneyWeekStart_(moneyDay_()); }

/* Canteen Cash from the store this week (cents of Canteen Cash) */
function stCardWeek_(sid) {
  var week = stWeekKey_();
  return stOrders_().filter(function (o) { return o.sid === sid && o.status !== 'cancelled' && /^card-/.test(o.item) && moneyWeekStart_(moneyDay_(new Date(o.at).toISOString())) === week; })
    .reduce(function (a, o) { var it = stItem_(o.item); return a + (it ? it.card : 0); }, 0);
}
function stGiftToday_(sid) {
  var d = moneyDay_();
  return moneyRowsFor_(sid).filter(function (r) { return r.type === 'gift' && moneyDay_(r.at) === d; }).reduce(function (a, r) { return a - r.cents; }, 0);
}
/* the week in dollars, for the Friday payday and the store */
function stWeek_(sid) {
  var week = stWeekKey_(), days = {}, interest = 0, given = 0, spent = 0;
  moneyRowsFor_(sid).forEach(function (r) {
    var d = moneyDay_(r.at); if (d < week) return;
    if (r.cents > 0 && (r.type === 'earn' || r.type === 'bonus')) days[d] = (days[d] || 0) + r.cents;
    if (r.type === 'interest') interest += r.cents;
    if (r.type === 'donate' || (r.type === 'spend' && /^give|^brick/.test(r.itemId))) given -= r.cents;
    if (r.type === 'spend') spent -= r.cents;
  });
  var list = []; for (var i = 0; i < 6; i++) { var d2 = moneyShift_(week, i); list.push({ d: d2, cents: days[d2] || 0 }); }
  return { week: week, days: list, earned: list.reduce(function (a, x) { return a + x.cents; }, 0), interest: interest, spent: spent };
}
function stLastInterest_(sid) {
  var r = moneyRowsFor_(sid).filter(function (x) { return x.type === 'interest'; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; })[0];
  return r ? { cents: r.cents, at: r.at } : null;
}
function stGivenAll_() {
  var all = moneyStore_().rows(), tot = 0;
  all.forEach(function (r) { if (r.type === 'spend' && /^(give-|brick)/.test(r.itemId)) { tot -= r.cents; } });
  return tot;
}

/* ---------- the boy's store ---------- */
function stInfo(token) {
  var sid = stKid_(token), test = msIsTest_(sid), orders = stOrders_(), seas = stSeasonsOpen_();
  var mine = orders.filter(function (o) { return o.sid === sid; });
  var owned = {}; mine.forEach(function (o) { var it = stItem_(o.item); if (it && (it.kind === 'wear' || it.kind === 'keep') && o.status !== 'cancelled') owned[it.id] = 1; });
  var cash = null; try { cash = cnBalance_(sid); } catch (e) {}
  var friends = []; try {
    friends = cnBoys_().filter(function (b) { return b.id !== sid && msIsTest_(b.id) === test; })
      .map(function (b) { return { id: b.id, name: b.name }; }).sort(function (a, b) { return a.name < b.name ? -1 : 1; });
  } catch (e) {}
  var wall = orders.filter(function (o) { return o.item === 'brick' && o.status !== 'cancelled' && msIsTest_(o.sid) === test; }).slice(-40).reverse().map(function (o) { return o.name; });
  var stars = orders.filter(function (o) { return o.item === 'star-named' && o.status !== 'cancelled' && msIsTest_(o.sid) === test; }).map(function (o) { return o.name; });
  return {
    ok: true, version: STORE.VERSION, balance: moneyBalance_(sid) / 100,
    items: STORE.ITEMS.map(function (x) { return { id: x.id, cat: x.cat, grp: x.grp || '', season: x.season || '', open: !x.season || !!seas[x.season], emoji: x.emoji, name: x.name, cents: x.cents, kind: x.kind, slot: x.slot || '', desc: x.desc, card: x.card || 0 }; }),
    seasons: STORE.SEASONS.map(function (s) { return { id: s.id, name: s.name, emoji: s.emoji, open: !!seas[s.id] }; }),
    owned: Object.keys(owned), orders: mine.slice(-25).reverse().map(stOut_),
    canteen: { cash: cash, rate: STORE.CANTEEN_RATE, weekMax: STORE.CANTEEN_WEEK, weekUsed: stCardWeek_(sid) },
    gift: { dayMax: STORE.GIFT_DAY, today: stGiftToday_(sid) }, friends: friends,
    given: { school: stGivenAll_(), mine: mine.filter(function (o) { return /^(give-|brick)/.test(o.item) && o.status !== 'cancelled'; }).reduce(function (a, o) { return a + o.cents; }, 0) },
    wall: wall, stars: stars, week: stWeek_(sid), interest: null, pf: cnPfRate_(sid), openPrizes: STORE.OPEN_PRIZES
  };
}

/* Buy one item. opt: {clientId, to (friend id, for gift), amount (dollars, for gift)} */
function stBuy(token, itemId, opt) {
  var sid = stKid_(token); opt = opt || {};
  var it = stItem_(String(itemId || '')); if (!it) throw new Error('That is not in the store.');
  var oid = 'S' + String(opt.clientId || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 24); if (oid.length < 9) throw new Error('Try again.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var orders = stOrders_(), dup = orders.filter(function (o) { return o.id === oid; })[0];
    if (dup) return stDone_(sid, dup);
    var mine = orders.filter(function (o) { return o.sid === sid; });
    var cents = it.cents, to = null, extra = '';
    if (it.kind === 'wear' || it.kind === 'keep') { if (mine.some(function (o) { return o.item === it.id && o.status !== 'cancelled'; })) throw new Error('You already have it!'); }
    if (it.season && !stSeasonsOpen_()[it.season]) { var sn = STORE.SEASONS.filter(function (z) { return z.id === it.season; })[0]; throw new Error('This ' + (sn ? sn.name : 'holiday') + ' edition is sold only in the weeks before ' + (sn ? sn.name : 'the holiday') + '. It will be back!'); }
    if (it.kind === 'prize' && mine.filter(function (o) { return o.status === 'waiting'; }).length >= STORE.OPEN_PRIZES) throw new Error('You have ' + STORE.OPEN_PRIZES + ' prizes waiting. Get them first.');
    if (it.kind === 'card') {
      var cash = cnBalance_(sid); if (cash === null) throw new Error('You don’t have a Canteen Cash account yet. Ask the office.');
      var used = stCardWeek_(sid); if (used + it.card > STORE.CANTEEN_WEEK) throw new Error('This week you can still get $' + ((STORE.CANTEEN_WEEK - used) / 100).toFixed(2) + ' of Canteen Cash.');
    }
    if (it.kind === 'gift') {
      var amt = Math.round(Number(opt.amount) * 100); if (!(amt >= 100) || amt % 100) throw new Error('Pick a whole dollar amount.');
      if (stGiftToday_(sid) + amt > STORE.GIFT_DAY) throw new Error('You can send up to $' + (STORE.GIFT_DAY / 100) + ' a day.');
      to = cnBoys_().filter(function (b) { return b.id === String(opt.to || '') && b.id !== sid && msIsTest_(b.id) === msIsTest_(sid); })[0];
      if (!to) throw new Error('Pick a friend.');
      cents = amt; extra = to.id;
    }
    if (!moneyHasKey_('store:' + sid + ':' + oid) && moneyBalance_(sid) < cents) throw new Error('You need $' + ((cents - moneyBalance_(sid)) / 100).toFixed(2) + ' more.');
    var name = stName_(sid), label = it.kind === 'gift' ? 'Gift to ' + to.name : it.name;
    var status = it.kind === 'prize' ? 'waiting' : 'done';
    var key = 'store:' + sid + ':' + oid;
    var charged = moneyHasKey_(key);   /* a retry after a half-finished buy: the money already came off, just finish the order */
    if (!charged && !moneyPost_({ sid: sid, type: it.kind === 'gift' ? 'gift' : 'spend', cents: -cents, reason: (it.kind === 'gift' ? '🎁 ' : '🏪 ') + label, key: key, itemId: it.id, lessonId: oid, by: 'store' })) throw new Error('Try again.');
    if (it.kind === 'gift') moneyPost_({ sid: to.id, type: 'giftin', cents: cents, reason: '🎁 Gift from ' + name, key: key + ':to', itemId: 'gift', lessonId: oid, by: 'store' });
    if (it.kind === 'card') {
      try { stCanteenCredit_(sid, it.card, oid); }
      catch (e) { moneyPost_({ sid: sid, type: 'refund', cents: cents, reason: 'Refund: ' + label + ' (canteen not reachable)', key: 'refund:' + oid, itemId: it.id, lessonId: oid, by: 'store' }); throw new Error('The canteen is not reachable right now. Your money is back.'); }
    }
    stTab_().appendRow([oid, new Date(), sid, name, it.id, label, cents, status, new Date(), 'store', '', extra]);
    return stDone_(sid, { id: oid, at: Date.now(), sid: sid, name: name, item: it.id, label: label, cents: cents, status: status, upd: Date.now(), by: 'store', note: '', extra: extra });
  } finally { lock.releaseLock(); }
}
function stDone_(sid, o) {
  var cash = null; try { if (/^card-/.test(o.item)) cash = cnBalance_(sid); } catch (e) {}
  return { ok: true, order: stOut_(o), balance: moneyBalance_(sid) / 100, ledger: msLedger_(sid), cash: cash };
}
/* A Canteen Card: v378 the Canteen Wallet row (CN_Wallet, 'card') is what counts. The office row in Canteen Purchases (a minus amount, like a void)
   is still written for real boys. The wallet is opened BEFORE the sheet row. */
function stCanteenCredit_(sid, cardCents, oid) {
  if (cnWalHas_('card:' + oid)) return;
  if (!cnWalOpen_(sid)) throw new Error('No Canteen Cash account.');
  if (!cnTestSid_(sid)) {
    var ss = cnBook_(), cp = ss.getSheetByName('Canteen Purchases'), scan = cnCpScan_(cp), have = false;
    for (var i = 0; i < scan.v.length; i++) if (String(scan.v[i][5]).indexOf('Store card ' + oid + ' ') === 0) have = true;
    if (!have) { var row = scan.last + 1; if (row > CN.CP_LAST) throw new Error('The purchase list is full.');
      cp.getRange(row, 1, 1, 6).setValues([[cnDay_(), sid, 'Tashbar Store: Canteen Card', -cardCents / 100, 'Tashbar Store', 'Store card ' + oid + ' · T$ ' + (cardCents * STORE.CANTEEN_RATE / 100).toFixed(2)]]); }
  }
  cnWalPost_(sid, cardCents, 'card', 'card:' + oid, 'Tashbar Store', 'Canteen Card from your Tashbar $ (T$' + (cardCents * STORE.CANTEEN_RATE / 100).toFixed(0) + ')');
  SpreadsheetApp.flush();
}

/* ---------- staff: hand out real prizes, or cancel with a full refund ---------- */
function stStaffOrders(token) {
  var s = sgStaff_(token), all = stOrders_().filter(function (o) { return !TL_SCOPE_ || !!TL_SCOPE_[o.sid]; });   /* Access.js scope */
  var given = 0, cards = 0, week = stWeekKey_();
  all.forEach(function (o) { if (o.status === 'cancelled') return; if (/^(give-|brick)/.test(o.item)) given += o.cents; if (/^card-/.test(o.item) && moneyWeekStart_(moneyDay_(new Date(o.at).toISOString())) === week) { var it = stItem_(o.item); cards += it ? it.card : 0; } });
  return { ok: true, waiting: all.filter(function (o) { return o.status === 'waiting'; }).map(stOut_),
    recent: all.filter(function (o) { return o.status !== 'waiting'; }).slice(-40).reverse().map(stOut_), given: given, cardsWeek: cards, head: sgIsHead_(s) };
}
function stStaffSet(token, oid, action, note) {
  var s = sgStaff_(token), who = sgWho_(s);
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var o = stOrders_().filter(function (x) { return x.id === String(oid || ''); })[0]; if (!o) throw new Error('Order not found.');
    if (TL_SCOPE_ && !TL_SCOPE_[o.sid]) throw new Error('That student is not in your school or class.');
    if (o.status !== 'waiting') throw new Error('This order is already ' + o.status + '.');
    if (action === 'handed') {
      stTab_().getRange(o.row, 8, 1, 4).setValues([['handed', new Date(), who.name, String(note || '').slice(0, 120)]]);
    } else if (action === 'cancel') {
      moneyPost_({ sid: o.sid, type: 'refund', cents: o.cents, reason: 'Refund: ' + o.label + (note ? ' (' + String(note).slice(0, 80) + ')' : ''), key: 'refund:' + o.id, itemId: o.item, lessonId: o.id, by: who.name });
      stTab_().getRange(o.row, 8, 1, 4).setValues([['cancelled', new Date(), who.name, String(note || '').slice(0, 120)]]);
    } else throw new Error('Bad action.');
    return stStaffOrders(token);
  } finally { lock.releaseLock(); }
}

/* ---------- editor self-test (in-memory ledger, no sheets touched except reading the catalog) ---------- */
function stSelfTest() {
  var ids = {}, out = [];
  STORE.ITEMS.forEach(function (x) { if (ids[x.id]) throw Error('Duplicate store id ' + x.id); ids[x.id] = 1; if (x.kind !== 'gift' && !(x.cents > 0)) throw Error('Bad price ' + x.id); if (x.kind === 'card' && x.cents !== x.card * STORE.CANTEEN_RATE) throw Error('Card price off ' + x.id); });
  var sids = {}; STORE.SEASONS.forEach(function (z) { sids[z.id] = 1; });
  STORE.ITEMS.forEach(function (x) { if (x.season && !sids[x.season]) throw Error('Unknown season ' + x.season + ' on ' + x.id); if (x.kind === 'wear' && !x.slot) throw Error('No slot ' + x.id); });
  out.push(STORE.ITEMS.length + ' items OK; types ' + MONEY.TYPES.join(','));
  Logger.log(out.join('\n')); return out.join('\n');
}
