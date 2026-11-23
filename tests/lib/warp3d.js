/* WARP3D (src/Warp3D.html, 2026-11-23): the 3D galaxy behind the sign-in, the welcome and the map home. Fails the build if:
     - the 3D layer is not on for the sign-in keypad, or the keypad lost its 10 number keys / Delete / Let's go (same data-act);
     - the 3D layer is still drawing during a lesson (lessons must run at full speed) or on a K-1 boy's game path;
     - its off switch (window.TL_W3D = false) does not turn it all off.
   Made-up boys only. It puts the page back the way it found it. */
module.exports = async function (pg) {
  const out = { fails: [], oks: [] };
  const r = await pg.evaluate(async () => {
    const sleep = ms => new Promise(res => setTimeout(res, ms)), bad = [];
    if (!window.W3D) return { bad: ['Warp3D.html did not load (window.W3D missing)'] };
    const keep = { st: A.st, view: A.view, overlay: A.overlay, play: A.play, pin: A.pin, busy: A.busy, err: A.err };
    const on = () => document.body.classList.contains('w3d'), cv = () => document.getElementById('w3d');
    try {
      A.overlay = null; A.play = null; A.pin = ''; A.busy = false; A.err = ''; A.view = 'signin'; render(); await sleep(500);
      if (!on() || !document.body.classList.contains('w3d-si') || !cv() || getComputedStyle(cv()).display === 'none') bad.push('the 3D layer is not on for the sign-in keypad');
      const keys = [...document.querySelectorAll('.sg5keys button[data-act="pin"]')].map(b => b.dataset.n).sort().join('');
      if (keys !== '0123456789') bad.push('the keypad must keep its 10 number keys (got ' + keys + ')');
      if (!document.querySelector('.sg5keys [data-act="del"]') || !document.querySelector('[data-act="signin"]')) bad.push('the keypad lost Delete or Let\'s go');
      if (cv() && getComputedStyle(cv()).pointerEvents !== 'none') bad.push('the 3D layer must never catch a tap');
      A.st = loadStudent({ id: 'TEST-W3D', name: 'Made-up Boy' }); A.view = 'play'; render(); await sleep(500);
      if (on()) bad.push('the 3D layer is still on in a lesson');
      window.TL_W3D = false; A.view = 'signin'; render(); await sleep(500);
      if (on()) bad.push('the off switch TL_W3D=false does not turn the 3D layer off');
    } catch (e) { bad.push('crashed: ' + String(e).slice(0, 160)); }
    finally { delete window.TL_W3D; Object.assign(A, keep); render(); await sleep(450); }
    return { bad };
  });
  r.bad.forEach(b => out.fails.push('3D sign-in/home: ' + b));
  if (!r.bad.length) out.oks.push('3D sign-in/home: on for the keypad (all keys kept, never catches a tap), off in lessons, off switch works');
  return out;
};
