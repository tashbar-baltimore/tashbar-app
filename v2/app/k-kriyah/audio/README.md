# The rebbe's recordings

`sounds.json` lists every recorded sound the games can play, as `"key": "file"`. Today it is empty (`{}`), so the games use the computer voice for the letter sounds and say so on screen.

When Rabbi Khaver's Section 12 recording (the 25 lone letter sounds) comes in:
1. Cut it into one file per sound at the silences (ffmpeg `silencedetect`), in the order of `curriculum/k-kriyah/section-12.pdf`: בּ ב ג ד ה ו ז ח ט י כּ כ ל מ נ ס פּ פ צ ק ר שׁ שׂ תּ ת. Check there are exactly 25, plus the spoken "Section 12" at the start.
2. Save each one small (mono MP3, 64 kbps) here.
3. List them in `sounds.json`. Unit 1 uses `b` (Beis) and `v` (Veis), for example `{"b": "b.mp3", "v": "v.mp3"}`.

Nothing else needs to change: every game plays the file when it is listed and falls back to the computer voice when it isn't.
