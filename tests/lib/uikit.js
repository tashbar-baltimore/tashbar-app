/* THE BUTTON SYSTEM (src/UiKit.html, docs/BUTTON-SYSTEM.md, HoS decisions 2026-11-23). Runs on the kid page from tests/run.js.
   Draws every part of the kit inside the real boy page (also inside places that style their own buttons, like a footer whose
   buttons are underlined links) and checks the rules by measuring, not by reading the code:
   - the X and the HOUSE are round, 44 px, the same size, carry no words, and their picture is exactly in the middle (within 0.5 px);
   - MAIN is solid gold and floats (has a shadow), QUIET is white with a thin outline and floats; both show the hand pointer;
     neither is underlined or loses its look inside a footer that turns buttons into links;
   - icon OR words: big buttons have words and no picture; round buttons have a picture and no words; Start has no play triangle;
   - information (pills, boxes) has no shadow, no outline, no hand pointer, never a button's colors, and one color per meaning;
   - a question pop-up has exactly one MAIN and one QUIET "Not now", and no X;
   - the kit is loaded before every other part of the page. Returns { fails, oks }. */
module.exports = async function uikit(pg) {
  return pg.evaluate(() => {
    const fails = [], oks = [], T = window.TLK, fail2 = m => fails.push('button system: ' + m);
    if (!T) return { fails: ['button system: window.TLK is missing (src/UiKit.html not loaded by sgQuest_)'], oks };
    const css = document.getElementById('tlk-css'), firstOther = document.getElementById('hp-css');   /* HomePage.html's style: a fixed part that loads after the kit (some parts move themselves to the top of the page later) */
    if (!css) fails.push('button system: the kit style (#tlk-css) is not on the page');
    else if (firstOther && (css.compareDocumentPosition(firstOther) & Node.DOCUMENT_POSITION_PRECEDING)) fails.push('button system: the kit must load before the other parts of the page');
    ['main', 'quiet', 'x', 'home', 'tool', 'pill', 'box', 'ask'].forEach(k => { if (typeof T[k] !== 'function') fails.push('button system: TLK.' + k + ' is missing'); });
    if (fails.length) return { fails, oks };

    const host = document.createElement('div'); host.id = 'tlk-test';
    host.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483646;background:#F6F4FF;padding:20px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;width:600px';
    /* the same parts twice: on their own, and inside a footer whose buttons the page turns into underlined links (QuestPage .foot button) */
    const parts = () => T.main(T.WORDS.start) + T.quiet(T.WORDS.notNow) + T.x('', '') + T.home('', '') + T.tool('🔊', T.WORDS.readToMe) +
      T.pill('money', '$5.00') + T.pill('prog', '0 of 8 earned') + T.pill('now', 'Do this now') + T.pill('rank', 'Bronze') + T.pill('lock', 'Locked') + T.pill('subj', 'Math') + T.box('money', 'Earned', '$4.50');
    host.innerHTML = '<div class="tk-a" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">' + parts() + '</div><div class="foot tk-b" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">' + parts() + '</div>' +
      '<div class="tk-ask" style="position:relative;background:#fff;padding:16px;border-radius:16px">' + T.ask({ title: 'Buy Rainbow trail?', yes: T.WORDS.buyIt }) + '</div>';
    document.body.appendChild(host);
    const cs = e => getComputedStyle(e), rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
    const same = (a, b) => { const x = rgb(a), y = rgb(b); return x.length >= 3 && y.length >= 3 && Math.abs(x[0] - y[0]) < 3 && Math.abs(x[1] - y[1]) < 3 && Math.abs(x[2] - y[2]) < 3; };
    const GOLD = 'rgb(251, 191, 36)', WHITE = 'rgb(255, 255, 255)', PURPLE = 'rgb(91, 63, 208)';
    ['.tk-a', '.tk-b'].forEach(where => {
      const W = where === '.tk-b' ? ' (inside a footer of link-style buttons)' : '', q = s => host.querySelector(where + ' ' + s);
      const main = q('.tlk-main'), quiet = q('.tlk-quiet'), x = q('.tlk-x'), home = q('.tlk-home'), tool = q('.tlk-tool');
      if (!same(cs(main).backgroundColor, GOLD)) fails.push('button system: MAIN must be solid gold' + W + ' (got ' + cs(main).backgroundColor + ')');
      if (!same(cs(quiet).backgroundColor, WHITE) || parseFloat(cs(quiet).borderTopWidth) < 1) fails.push('button system: QUIET must be white with a thin outline' + W);
      [main, quiet, x, home, tool].forEach(b => {
        const s = cs(b), n = b.className.split(' ')[1];
        if (s.boxShadow === 'none') fails.push('button system: ' + n + ' must float (soft shadow)' + W);
        if (s.cursor !== 'pointer') fails.push('button system: ' + n + ' must show the hand pointer' + W);
        if (/underline/.test(s.textDecorationLine)) fails.push('button system: ' + n + ' must never be underlined like a web link' + W);
      });
      [main, quiet].forEach(b => { if (!b.textContent.trim() || b.querySelector('svg,img')) fails.push('button system: big buttons use words only' + W); });
      if (/[▶►]/.test(main.textContent)) fails.push('button system: Start has no play triangle (it only means play a sound or video)');
      [x, home].forEach(b => {
        const r = b.getBoundingClientRect(), p = b.querySelector('svg path').getBoundingClientRect(), n = b.className.split(' ')[1];
        if (Math.abs(r.width - 44) > .5 || Math.abs(r.height - 44) > .5) fails.push('button system: ' + n + ' must be 44 px round' + W + ' (got ' + r.width.toFixed(1) + 'x' + r.height.toFixed(1) + ')');
        if (parseFloat(cs(b).borderTopLeftRadius) < 21) fails.push('button system: ' + n + ' must be round' + W);
        if (b.textContent.trim()) fails.push('button system: ' + n + ' is an icon only, no words' + W);
        const dx = (p.left + p.width / 2) - (r.left + r.width / 2), dy = (p.top + p.height / 2) - (r.top + r.height / 2);
        if (Math.abs(dx) > .5 || Math.abs(dy) > .5) fails.push('button system: the ' + (n === 'tlk-home' ? 'house' : 'X') + ' must be exactly in the middle of its circle' + W + ' (off by ' + dx.toFixed(2) + ', ' + dy.toFixed(2) + ' px)');
      });
      const bgs = {};
      host.querySelectorAll(where + ' .tlk-pill,' + where + ' .tlk-box').forEach(e => {
        const s = cs(e), k = (e.className.match(/tlk-(money|prog|now|rank|lock|subj)/) || [])[1];
        if (s.boxShadow !== 'none') fails.push('button system: information (' + k + ') must have no shadow' + W);
        if (parseFloat(s.borderTopWidth) > 0) fails.push('button system: information (' + k + ') must have no outline' + W);
        if (s.cursor === 'pointer') fails.push('button system: information (' + k + ') must not show the hand pointer' + W);
        if ([GOLD, WHITE, PURPLE].some(c => same(s.backgroundColor, c))) fails.push('button system: information (' + k + ') must never use a button color' + W);
        if (e.classList.contains('tlk-pill')) { if (bgs[s.backgroundColor] && bgs[s.backgroundColor] !== k) fails.push('button system: "' + k + '" and "' + bgs[s.backgroundColor] + '" information share a color; one color per meaning'); bgs[s.backgroundColor] = k; }
      });
    });
    /* K-3 Home (HoS 2026-11-23): bigger, the house AND the word "Home", the house exactly centered top to bottom */
    const k3 = document.createElement('div'); k3.innerHTML = T.home('', '', true); host.appendChild(k3); const hk = k3.firstChild, hr = hk.getBoundingClientRect(), hp = hk.querySelector('svg path').getBoundingClientRect();
    if (hr.height < 51.5) fail2('the K-3 Home must be bigger (52 px tall; got ' + hr.height.toFixed(1) + ')');
    if (hk.textContent.trim() !== 'Home' || !hk.querySelector('svg')) fail2('the K-3 Home shows the house and the word "Home"');
    if (Math.abs((hp.top + hp.height / 2) - (hr.top + hr.height / 2)) > .5) fail2('the house in the K-3 Home must be centered top to bottom');
    if (!T.young(0) || !T.young(3) || T.young(4) || T.young(null)) fail2('TLK.young: K to grade 3 are young, grade 4 and up are not');
    const ask = host.querySelector('.tk-ask');
    if (ask.querySelectorAll('.tlk-main').length !== 1 || ask.querySelectorAll('.tlk-quiet').length !== 1 || ask.querySelector('.tlk-x')) fails.push('button system: a question has one MAIN, one QUIET "Not now" and no X');
    else if (ask.querySelector('.tlk-quiet').textContent.trim() !== 'Not now') fails.push('button system: the quiet answer to a question is "Not now"');
    host.remove();
    if (!fails.length) oks.push('button system (src/UiKit.html): soft-lift MAIN and QUIET, round X and house (44 px, picture exactly centered, no words), the bigger K-3 Home (house + "Home"), information flat in one color per meaning, question = MAIN + "Not now" with no X; the look holds inside a footer of link-style buttons');
    return { fails, oks };
  });
};
