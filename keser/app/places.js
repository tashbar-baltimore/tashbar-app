/* The places in her world, and how far she has come in each (0 = not started, 1 = all done).
   Progress is shown only as jewels that grow and sparkle on her crown, never as money or points.
   Until her sign-in is built (piece 2), progress is kept on this computer only. ?demo=1 shows a made-up girl's progress. */
export const PLACES = [
  { id: 'kodesh',  name: 'Kodesh',  he: 'קודש', color: '#F5C451', hex: 0xf5c451, note: 0, host: 'Ima', pic: '/pics/keser-cast-ima.webp', art: '/pics/keser-place-kodesh.webp' },
  { id: 'reading', name: 'Reading', color: '#FF5FA2', hex: 0xff5fa2, note: 2, host: 'Ayelet', pic: '/pics/keser-cast-ayelet.webp', art: '/pics/keser-place-reading.webp' },
  { id: 'math',    name: 'Math',    color: '#B98CFF', hex: 0xb98cff, note: 4, host: 'Rivky', pic: '/pics/keser-cast-rivky.webp', art: '/pics/keser-place-math.webp' },
  { id: 'science', name: 'Science', color: '#5FE3CF', hex: 0x5fe3cf, note: 7, host: 'Shira', pic: '/pics/keser-cast-shira.webp', art: '/pics/keser-place-science.webp' },
  { id: 'writing', name: 'Writing', color: '#8FB8FF', hex: 0x8fb8ff, note: 9, host: 'Malka', pic: '/pics/keser-cast-malka.webp', art: '/pics/keser-place-writing.webp' },
];
/* the girls' cast (keser/PICTURE-ORDERS.md): each place has a host; the sisters greet her when she arrives; Bubby waits by her crown */
export const CAST = { sisters: '/pics/keser-cast-group.webp', bubby: '/pics/keser-cast-bubby.webp', style: '/pics/keser-style-sheet.webp' };
export const DEMO = { kodesh: 0.85, reading: 0.6, math: 0.35, science: 0.15, writing: 0 };
export function readProgress(search, store) {
  let raw = {};
  if (/[?&]demo=1\b/.test(search || '')) raw = DEMO;
  else { try { raw = JSON.parse((store && store.getItem('keser.progress')) || '{}') || {}; } catch (e) { raw = {}; } }
  const out = {};
  for (const p of PLACES) { const v = Number(raw[p.id]); out[p.id] = isFinite(v) ? Math.max(0, Math.min(1, v)) : 0; }
  return out;
}
