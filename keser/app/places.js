/* The places in her world, and how far she has come in each (0 = not started, 1 = all done).
   Progress is shown only as jewels that grow and sparkle on her crown, never as money or points.
   Until her sign-in is built (piece 2), progress is kept on this computer only. ?demo=1 shows a made-up girl's progress. */
/* M. Heinemann (owner), 2026-11-26: "right now i only want one to say Kodesh and one to say general studies ... kodesh should be in hebrew. make a picture of a torah for the kodesh one"
   lang: 'he' shows the name in Hebrew, right to left. */
export const PLACES = [
  { id: 'kodesh',  name: 'קודש', lang: 'he', label: 'Kodesh', color: '#F5C451', hex: 0xf5c451, note: 0, host: 'Ima', pic: '/pics/keser-cast-ima.webp' },
  { id: 'general', name: 'General Studies', color: '#FF5FA2', hex: 0xff5fa2, note: 4, host: 'Ayelet', pic: '/pics/keser-cast-ayelet.webp' },
];
/* the girls' cast (keser/PICTURE-ORDERS.md): each place has a host; the sisters greet her when she arrives; Bubby waits by her crown */
export const CAST = { sisters: '/pics/keser-cast-group.webp', bubby: '/pics/keser-cast-bubby.webp', style: '/pics/keser-style-sheet.webp' };
export const DEMO = { kodesh: 0.85, general: 0.4 };
export function readProgress(search, store) {
  let raw = {};
  if (/[?&]demo=1\b/.test(search || '')) raw = DEMO;
  else { try { raw = JSON.parse((store && store.getItem('keser.progress')) || '{}') || {}; } catch (e) { raw = {}; } }
  const out = {};
  for (const p of PLACES) { const v = Number(raw[p.id]); out[p.id] = isFinite(v) ? Math.max(0, Math.min(1, v)) : 0; }
  return out;
}
