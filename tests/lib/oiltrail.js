/* CHANUKAH OLIVE OIL (src/OilTrail.html, HoS 2026-11-23). Runs on the kid page from tests/run.js, made-up boy.
   - In season (23 Nov 2026 through 3 Tevet 5787) the oil is the default trail for a signed-in boy: the free glowing streak and the free
     tap splash step aside (HomePlus.html asks window.tlOilOn / tlOilTapOn); a boy who bought a trail keeps his own.
   - Out of season (before 23 Nov 2026, from 4 Tevet) it is off and the streak is back.
   - Its canvases never catch a click (pointer-events none), and a canvas a boy draws on is marked data-no-oil when touched.
   Returns { fails, oks }. */
module.exports = async function oiltrail(pg) {
  return pg.evaluate(async () => {
    const fails = [], oks = [], f = m => fails.push('olive oil: ' + m), sleep = ms => new Promise(r => setTimeout(r, ms));
    if (!window.TL_OIL || typeof window.tlOilOn !== 'function') return { fails: ['olive oil: OilTrail.html is not on the page'], oks };
    const at = d => { window.TL_OIL_DAY = d; TL_OIL.sync(); };
    at(new Date(2026, 10, 23, 12)); if (!tlOilOn()) f('on 23 Nov 2026 (the first day) it must be on');
    at(new Date(2026, 11, 9, 12)); if (!tlOilOn()) f('during Chanukah it must be on');
    at(new Date(2026, 10, 22, 12)); if (tlOilOn()) f('before 23 Nov 2026 it must be off');
    at(new Date(2026, 11, 22, 12)); if (tlOilOn()) f('after Chanukah (from 4 Tevet) it must be off');
    at(new Date(2026, 11, 1, 12)); await sleep(50);
    if (!tlOilTapOn()) f('in season, a tap with no bought tap blast drops the olive (the free splash steps aside)');
    const blade = typeof bladeOn === 'function' ? bladeOn() : null; if (blade === true) f('in season the free glowing streak must step aside');
    const eng = TL_OIL.engine(); if (!eng) f('in season the oil must be running for a signed-in boy');
    const cv = [...document.querySelectorAll('canvas')].filter(c => c.style.zIndex === '2147483199');
    if (cv.length < 2 || cv.some(c => getComputedStyle(c).pointerEvents !== 'none')) f('its two canvases must let every click through (pointer-events none)');
    /* a bought trail wins */
    const was = window.tlStoreTrailOn; window.tlStoreTrailOn = () => true; if (tlOilOn()) f('a boy who bought a trail keeps his own (no oil)'); window.tlStoreTrailOn = was;
    /* a canvas a boy draws on is never covered in oil */
    const d = document.createElement('canvas'); d.style.cssText = 'position:fixed;left:0;top:0;width:50px;height:50px;z-index:5'; document.body.appendChild(d);
    d.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 })); if (!d.hasAttribute('data-no-oil')) f('a canvas a boy touches must be marked data-no-oil'); d.remove();
    /* TAP OR SWIPE (HoS 2026-11-23, Chromebook touchscreens): a swipe never fires a tap effect; a real tap does */
    let fx = 0; const mo = new MutationObserver(l => l.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && /^(hpsplash|hpdot|hpem)/.test(n.className)) fx++; })));
    mo.observe(document.body, { childList: true });
    const P = (t, x, y) => document.body.dispatchEvent(new PointerEvent(t, { bubbles: true, pointerId: 41, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y }));
    window.TL_OIL_OFF = true; TL_OIL.sync(); const hpfx = window.HP_FX;
    if (hpfx) { fx = 0; P('pointerdown', 30, 700); await sleep(30); P('pointermove', 200, 600); P('pointerup', 220, 590); await sleep(60); if (fx) f('a swipe must not fire the tap splash (it fired ' + fx + ' pieces)');
      fx = 0; P('pointerdown', 30, 700); await sleep(40); P('pointerup', 31, 700); await sleep(60); if (!fx) f('a real tap must fire the tap splash'); }
    window.TL_OIL_OFF = undefined; TL_OIL.sync(); await sleep(30);
    const e2 = TL_OIL.engine(); if (e2 && typeof Touch === 'function') { const o0 = e2.olives(), tgt = document.body;
      const T = (type, x, y) => { const t = new Touch({ identifier: 7, target: tgt, clientX: x, clientY: y }); tgt.dispatchEvent(new TouchEvent(type, { bubbles: true, touches: type === 'touchend' ? [] : [t], changedTouches: [t] })); };
      T('touchstart', 30, 700); await sleep(30); T('touchend', 220, 590); await sleep(30);
      if (e2.olives() !== o0) f('a quick swipe with few touch points must not drop an olive');
      T('touchstart', 30, 700); await sleep(30); T('touchend', 31, 700); await sleep(30);
      if (e2.olives() !== o0 + 1) f('a real tap on empty space must drop one olive'); }
    mo.disconnect();
    window.TL_OIL_DAY = undefined; TL_OIL.sync();
    if (!fails.length) oks.push('olive oil (Chanukah): the default trail 23 Nov 2026 to 3 Tevet 5787, off before and after; the free streak and tap splash step aside, a bought trail wins; clicks pass through; drawing canvases are kept clear; a swipe fires no tap effect and no olive, a real tap does');
    return { fails, oks };
  });
};
