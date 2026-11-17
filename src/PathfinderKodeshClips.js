/* PathfinderKodeshClips.js — the rebbe's 27 Kriyah clips (PFK-CLIPS1) turn on BY THEMSELVES. Claude Code builder (4cc@), 2026-11-16.
   The rebbe uploads his recordings into a folder named "PFK clips ..." inside the Pathfinder HQ folder. No builder step:
   - pfkClipsFound_() looks in that folder (at most every 10 minutes, cached) and maps each file to its clip key:
       exact name   pfk_letter-sound_b_dot.m4a  -> letter-sound:b+dot     (the File column of PFK-CLIPS1)
       or a number  "clip 5.m4a", "Clip 05", "5.m4a" -> clip 5 of the list (when his phone could not rename files)
   - pfkClips_ (PathfinderKodesh.js) merges these in, so the listen-and-tap questions stop being skipped;
   - pfkClipSrc_ turns a found file into a playable data: link for the one question on screen (cached 6 hours).
   Read only: it never changes, moves or shares a file. Audio only (audio/* or a known audio file ending). No Hebrew here. */
var PFKC = {
  HQ: '15aIi2etSxxLnfsUKO3_N1KGZGsxWSuHx',
  FOLDER: /^pfk\s*clips/i,
  TTL: 600, SRC_TTL: 21600, MAX_BYTES: 70000,
  /* PFK-CLIPS1, clips 1-27 in order (file names) */
  LIST: ['pfk_letter-name_b', 'pfk_letter-name_d', 'pfk_letter-name_h', 'pfk_letter-name_v', 'pfk_letter-name_g', 'pfk_letter-name_x', 'pfk_letter-name_e', 'pfk_letter-name_T', 'pfk_letter-name_s',
    'pfk_letter-sound_b_dot', 'pfk_letter-sound_b', 'pfk_letter-sound_k_dot', 'pfk_letter-sound_k', 'pfk_letter-sound_p_dot', 'pfk_letter-sound_p', 'pfk_letter-sound_t_dot', 'pfk_letter-sound_t', 'pfk_letter-sound_shin', 'pfk_letter-sound_sin',
    'pfk_syllable_m_chirik', 'pfk_syllable_l_cholam', 'pfk_syllable_d_kubutz', 'pfk_syllable_n_tzeirei', 'pfk_syllable_r_segol', 'pfk_syllable_g_sheva', 'pfk_syllable_t_kamatz', 'pfk_syllable_s_patach'],
  AUDIO: /\.(m4a|mp3|wav|aac|ogg|oga|webm|mp4|3gp|amr|caf)$/i
};
/* pure: a PFK-CLIPS1 file stem -> the bank's clip key ("pfk_letter-sound_b_dot" -> "letter-sound:b+dot") */
function pfkcKeyOf_(stem) {
  var m = /^pfk_(letter-name|letter-sound|syllable)_([A-Za-z]+)(?:_([A-Za-z]+))?$/.exec(String(stem)); if (!m) return '';
  return m[1] + ':' + m[2] + (m[3] ? '+' + m[3] : '');
}
/* pure: an uploaded file name -> clip key, or '' (exact PFK-CLIPS1 name first, then "clip N" / "N") */
function pfkcMatch_(name) {
  var n = String(name || '').trim(), stem = n.replace(/\.[A-Za-z0-9]+$/, '');
  for (var i = 0; i < PFKC.LIST.length; i++) if (PFKC.LIST[i] === stem) return pfkcKeyOf_(PFKC.LIST[i]);
  var lc = stem.toLowerCase(); for (i = 0; i < PFKC.LIST.length; i++) if (PFKC.LIST[i].toLowerCase() === lc && PFKC.LIST[i] !== 'pfk_letter-name_T' && PFKC.LIST[i] !== 'pfk_letter-name_t') return pfkcKeyOf_(PFKC.LIST[i]);   /* T (tes) and t differ only by case: exact only */
  var k = /^(?:clip|#)?\s*0*([1-9]\d?)\b/i.exec(stem);
  if (k && Number(k[1]) >= 1 && Number(k[1]) <= PFKC.LIST.length) return pfkcKeyOf_(PFKC.LIST[Number(k[1]) - 1]);
  return '';
}
/* {clipKey: 'drive:<fileId>'} from the clips folder; cached; {} when there is no folder yet */
function pfkClipsFound_() {
  var c = null; try { c = CacheService.getScriptCache(); var hit = c.get('pfkc_map'); if (hit) return JSON.parse(hit); } catch (e) {}
  var out = {};
  try {
    var fs = DriveApp.getFolderById(PFKC.HQ).getFolders();
    while (fs.hasNext()) { var f = fs.next(); if (!PFKC.FOLDER.test(f.getName())) continue;
      var files = f.getFiles();
      while (files.hasNext()) { var x = files.next(), nm = x.getName(), mt = String(x.getMimeType() || '');
        if (!(/^audio\//.test(mt) || PFKC.AUDIO.test(nm) || mt === 'video/mp4' || mt === 'video/3gpp')) continue;
        var key = pfkcMatch_(nm); if (key && !out[key]) out[key] = 'drive:' + x.getId(); } }
  } catch (e) { out = {}; }
  try { if (c) c.put('pfkc_map', JSON.stringify(out), PFKC.TTL); } catch (e) {}
  return out;
}
/* a clip value -> what the page plays: a URL stays a URL; 'drive:<id>' becomes a data: link (audio/mp4 for phone recordings) */
function pfkClipSrc_(v) {
  v = String(v || ''); if (v.indexOf('drive:') !== 0) return v;
  var id = v.slice(6), c = null; try { c = CacheService.getScriptCache(); var hit = c.get('pfkc_src_' + id); if (hit) return hit; } catch (e) {}
  try { var f = DriveApp.getFileById(id), b = f.getBlob(), bytes = b.getBytes(); if (bytes.length > PFKC.MAX_BYTES * 4) return '';
    var mt = String(b.getContentType() || ''); if (/^audio\/(x-)?m4a$/i.test(mt)) mt = 'audio/mp4'; if (!/^audio\//.test(mt)) mt = /\.mp3$/i.test(f.getName()) ? 'audio/mpeg' : /\.wav$/i.test(f.getName()) ? 'audio/wav' : 'audio/mp4';
    var src = 'data:' + mt + ';base64,' + Utilities.base64Encode(bytes);
    try { if (c && src.length < 99000) c.put('pfkc_src_' + id, src, PFKC.SRC_TTL); } catch (e) {}
    return src; } catch (e) { return ''; }
}
