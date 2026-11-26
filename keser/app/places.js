/* The places in her world, and how far she has come in each (0 = not started, 1 = all done).
   Progress is shown only as jewels that grow and sparkle on her crown, never as money or points.
   Until her sign-in is built (piece 2), progress is kept on this computer only. ?demo=1 shows a made-up girl's progress. */
export const PLACES = [
  { id: 'kodesh',  name: 'Kodesh',  he: 'קודש', color: '#F5C451', hex: 0xf5c451, note: 0 },
  { id: 'reading', name: 'Reading', color: '#FF5FA2', hex: 0xff5fa2, note: 2 },
  { id: 'math',    name: 'Math',    color: '#B98CFF', hex: 0xb98cff, note: 4 },
  { id: 'science', name: 'Science', color: '#5FE3CF', hex: 0x5fe3cf, note: 7 },
  { id: 'writing', name: 'Writing', color: '#8FB8FF', hex: 0x8fb8ff, note: 9 },
];
export const DEMO = { kodesh: 0.85, reading: 0.6, math: 0.35, science: 0.15, writing: 0 };
export function readProgress(search, store) {
  let raw = {};
  if (/[?&]demo=1\b/.test(search || '')) raw = DEMO;
  else { try { raw = JSON.parse((store && store.getItem('keser.progress')) || '{}') || {}; } catch (e) { raw = {}; } }
  const out = {};
  for (const p of PLACES) { const v = Number(raw[p.id]); out[p.id] = isFinite(v) ? Math.max(0, Math.min(1, v)) : 0; }
  return out;
}
