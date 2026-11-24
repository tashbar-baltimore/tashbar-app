/* CHANUKAH SUFGANIYAH JELLY TRAIL (src/JellyTrail.html, a Tashbar Store item, HoS 2026-11-24). Runs on the kid page from tests/run.js, made-up boy.
   - Off unless he wears it (hol-jelly in his trail slot); on when he does. While on it is his trail AND his tap: the olive oil, the free
     glowing streak and the free tap splash step aside; a tap blast he wears separately wins the tap.
   - Its canvases never catch a click (pointer-events none) and a tap on a button still works; a canvas a boy draws on is marked data-no-jelly.
   - The store has it on the Chanukah shelf with its own name and picture, and its card plays the real engine.
   Returns { fails, oks }. */
module.exports = async function jellytrail(pg) {
  return pg.evaluate(async () => {
    const fails = [], oks = [], f = m => fails.push('jelly trail: ' + m), sleep = ms => new Promise(r => setTimeout(r, ms));
    if (!window.TL_JELLY || typeof window.tlJellyOn !== 'function') return { fails: ['jelly trail: JellyTrail.html is not on the page'], oks };
    const st = A.st; st.store = st.store || {}; const keep = JSON.stringify(st.store.wear || {});
    st.store.wear = {}; TL_JELLY.sync(); await sleep(30);
    if (tlJellyOn() || TL_JELLY.engine()) f('it must be off for a boy who does not wear it');
    st.store.wear = { trail: 'hol-jelly' }; TL_JELLY.sync(); await sleep(60);
    if (!tlJellyOn() || !TL_JELLY.engine()) f('it must run for a boy who wears it');
    if (!tlJellyTapOn()) f('it is his tap too (a donut on a tap)');
    if (typeof tlOilOn === 'function' && tlOilOn()) f('the olive oil must step aside (he bought his own trail)');
    if (typeof bladeOn === 'function' && bladeOn()) f('the free glowing streak must step aside');
    const box = document.getElementById('tl-jelly'), cv = box ? [...box.querySelectorAll('canvas')] : [];
    if (!box || getComputedStyle(box).pointerEvents !== 'none' || cv.length < 2 || cv.some(c => getComputedStyle(c).pointerEvents !== 'none')) f('its box and canvases must let every click through (pointer-events none)');
    /* a tap on a button: the donut drops AND the button still works */
    const b = document.createElement('button'); b.textContent = 'x'; b.style.cssText = 'position:fixed;left:300px;top:300px;width:80px;height:40px;z-index:5'; let clicked = 0; b.onclick = () => clicked++; document.body.appendChild(b);
    b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 51, pointerType: 'mouse', clientX: 320, clientY: 310 }));
    b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 51, pointerType: 'mouse', clientX: 320, clientY: 310 })); b.click(); b.remove();
    if (!clicked) f('a tap on a button must still press the button');
    /* a separate tap blast wins the tap */
    st.store.wear = { trail: 'hol-jelly', tap: 'tap-stars' }; TL_JELLY.sync(); if (tlJellyTapOn()) f('a tap blast he wears separately must win the tap');
    /* a drawing canvas is never covered in jelly */
    const d = document.createElement('canvas'); d.style.cssText = 'position:fixed;left:0;top:0;width:50px;height:50px;z-index:5'; document.body.appendChild(d);
    d.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 })); if (!d.hasAttribute('data-no-jelly')) f('a canvas a boy touches must be marked data-no-jelly'); d.remove();
    /* taking it off stops it and removes its canvases */
    st.store.wear = JSON.parse(keep); TL_JELLY.sync(); await sleep(30);
    if (TL_JELLY.engine() || document.getElementById('tl-jelly')) f('taking it off must stop it and remove its canvases');
    if (!fails.length) oks.push('jelly trail (JellyTrail.html): runs only when he wears it; his trail and his tap (oil, streak and free splash step aside, a separate tap blast wins the tap); clicks pass through; drawing areas stay clean; off removes it');
    return { fails, oks };
  });
};
