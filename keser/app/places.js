/* The places in her world, and how far she has come in each (0 = not started, 1 = all done).
   Progress is shown only as jewels that grow and sparkle on her crown, never as money or points.
   Until her sign-in is built (piece 2), progress is kept on this computer only. ?demo=1 shows a made-up girl's progress. */
/* M. Heinemann (owner), 2026-11-26: "right now i only want one to say Kodesh and one to say general studies ... kodesh should be in hebrew.
   make a picture of a torah for the kodesh one"; "add one that says timeline ... the girls have to do events in order ... It should be its own thing."
   lang: 'he' shows the name in Hebrew, right to left. lab: the part of the Chumash & Timeline Lab the place opens. */
export const PLACES = [
  { id: 'kodesh',   name: 'קודש', lang: 'he', label: 'Kodesh', color: '#D4AA50', hex: 0xd4aa50, note: 0, host: 'Ima', pic: '/pics/keser-cast-ima.webp', art: '/pics/keser-place-torah.webp', lab: 'hub', labName: 'Chumash Lab' },
  { id: 'general',  name: 'General Studies', color: '#B08AD8', hex: 0xb08ad8, note: 4, host: 'Ayelet', pic: '/pics/keser-cast-ayelet.webp', art: '/pics/keser-place-reading.webp' },
  { id: 'timeline', name: 'Timeline', color: '#F6E3B0', hex: 0xf6e3b0, note: 7, host: 'Malka', pic: '/pics/keser-cast-malka.webp', art: '/pics/keser-place-timeline.webp', lab: 'tl', labName: 'Which came first?' },
];
/* the girls' cast (keser/PICTURE-ORDERS.md): each place has a host; the sisters greet her when she arrives; Bubby waits by her crown */
export const CAST = { sisters: '/pics/keser-cast-group.webp', bubby: '/pics/keser-cast-bubby.webp', style: '/pics/keser-style-sheet.webp' };
export const DEMO = { kodesh: 0.85, general: 0.4, timeline: 0 };
export function readProgress(search, store) {
  let raw = {};
  if (/[?&]demo=1\b/.test(search || '')) raw = DEMO;
  else { try { raw = JSON.parse((store && store.getItem('keser.progress')) || '{}') || {}; } catch (e) { raw = {}; } }
  const out = {};
  for (const p of PLACES) { const v = Number(raw[p.id]); out[p.id] = isFinite(v) ? Math.max(0, Math.min(1, v)) : 0; }
  return out;
}
