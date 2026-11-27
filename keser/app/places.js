/* The places in her world, and how far she has come in each (0 = not started, 1 = all done).
   Progress is shown only as jewels that grow and sparkle on her crown, never as money or points.
   Until her sign-in is built (piece 2), progress is kept on this computer only. ?demo=1 shows a made-up girl's progress. */
/* M. Heinemann (owner), 2026-11-26: "right now i only want one to say Kodesh and one to say general studies ... kodesh should be in hebrew.
   make a picture of a torah for the kodesh one"; "add one that says timeline ... the girls have to do events in order ... It should be its own thing."
   lang: 'he' shows the name in Hebrew, right to left. lab: the part of the Chumash & Timeline Lab the place opens.
   color: each place wears a Keser house color (M. Heinemann 2026-11-26): קודש the Keser Torah maroon, General Studies the Keser Malchus royal blue,
   Timeline the Keser Kehuna green; purple and gold are the base everywhere. girl: a Keser girl in the school uniform stands on the stage beside each place (pictures sent by M. Heinemann, 2026-11-26). */
/* M. Heinemann 2026-11-27: "Take out the general studies completely. I only want the timeline lab and the Chumash lab." */
export const PLACES = [
  { id: 'kodesh',   name: 'קודש', lang: 'he', label: 'Kodesh', color: '#6E1428', hex: 0x8e1f35, note: 0, house: 'Keser Torah', girl: '/pics/keser-girl-uniform-book-tall.webp', girlAspect: 316 / 900, art: '/pics/keser-place-torah.webp', lab: 'hub', labName: 'Chumash Lab' },
  { id: 'timeline', name: 'Timeline', color: '#155E3C', hex: 0x1f8f5c, note: 7, house: 'Keser Kehuna', girl: '/pics/keser-girl-uniform-backpack.webp', girlAspect: 386 / 900, art: '/pics/keser-place-timeline.webp', lab: 'tl', labName: 'Which came first?' },
];
export const DEMO = { kodesh: 0.85, timeline: 0 };
export function readProgress(search, store) {
  let raw = {};
  if (/[?&]demo=1\b/.test(search || '')) raw = DEMO;
  else { try { raw = JSON.parse((store && store.getItem('keser.progress')) || '{}') || {}; } catch (e) { raw = {}; } }
  const out = {};
  for (const p of PLACES) { const v = Number(raw[p.id]); out[p.id] = isFinite(v) ? Math.max(0, Math.min(1, v)) : 0; }
  return out;
}
