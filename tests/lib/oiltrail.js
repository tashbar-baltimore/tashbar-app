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
    window.TL_OIL_DAY = undefined; TL_OIL.sync();
    if (!fails.length) oks.push('olive oil (Chanukah): the default trail 23 Nov 2026 to 3 Tevet 5787, off before and after; the free streak and tap splash step aside, a bought trail wins; clicks pass through; drawing canvases are kept clear');
    return { fails, oks };
  });
};
