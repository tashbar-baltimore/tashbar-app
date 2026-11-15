/* UPGRADE Phase 5 (2026-11-10): real recorded instrumental music for the boy pages.
   All recordings are public domain (Musopen and FreePD, via the Internet Archive; Public Domain Mark / CC0), instrumental and secular.
   Church-linked or possibly offensive pieces were left out on purpose (Head of School, 2026-11-10).
   Files live in the HQ Drive folder "10 MUSIC — public-domain recordings for the app (Phase 5)".
   The page gets each file through msMusicPart in pieces (no Drive sharing needed: the app reads them as the deploying account).
   Staff can turn music off for the whole school (sgMusicSet); the boy pages then play no music (sound effects stay). */
var MUSIC = {
  FOLDER: '1zgo1obRAC0QGQoCAL0AEkp6tJMHn6Y93',
  PART: 1500000,
  PROP: 'MUSIC_SCHOOL_OFF',
  TRACKS: [
    { id: 'f1', mood: 'focus',  file: '1pcL_7zWK8m7X8kUHihypPLPQzk1HREEq', title: 'Nocturne', by: 'Borodin' },
    { id: 'f2', mood: 'focus',  file: '1kZolbL_nmIn9mGInf7ObJdSrqAR249oc', title: 'Nocturne in F', by: 'Chopin' },
    { id: 'f3', mood: 'focus',  file: '1rnVQrLDBJs2CbSo9Oadjs3v6FevDdC8g', title: 'Morning', by: 'Grieg' },
    { id: 'f4', mood: 'focus',  file: '1VQyXVvHLpOaVZZUoV6Y0EiLxPdijXIbW', title: '"Lark" Quartet · Adagio', by: 'Haydn' },
    { id: 'f5', mood: 'focus',  file: '1C9d3333I9hNnn4_lFJs7iRByfGbw9D4w', title: 'Sonata in A · Andante', by: 'Schubert' },
    { id: 'e1', mood: 'energy', file: '14DAunoVaC3oWIndsiSOahq9Wen5a66ww', title: '"Lark" Quartet · Allegro', by: 'Haydn' },
    { id: 'e2', mood: 'energy', file: '1q0rR4Wmp4HgpoFN8VbZtztH3dzvs9KEn', title: '"Lark" Quartet · Finale', by: 'Haydn' },
    { id: 'e3', mood: 'energy', file: '1UEN8z0D09gTpBpQXKMCyOYoGQP8HfB9r', title: '"American" Quartet · Vivace', by: 'Dvořák' },
    { id: 'e4', mood: 'energy', file: '1EtIAzF75gVl2e0MH5c2J11ogYi-RAjzZ', title: 'Sonata in A · Allegro', by: 'Schubert' },
    { id: 'e5', mood: 'energy', file: '1Xo6paBh90fhbgvD5gnkcY7GMHyRPj_tC', title: 'Grande Valse Brillante', by: 'Chopin' },
    /* 2026-11-11 (Head of School asked for more variety): 19 more Musopen pieces + 17 FreePD tracks (public domain / CC0, instrumental). New mood 'game' = Game tunes. */
    { id: 'f6', mood: 'focus' , file: '15RMMabgAP5bWElo5yQxnjedjO55l8Iak', title: "Quartet No. 6 · Adagio", by: "Beethoven" },
    { id: 'f7', mood: 'focus' , file: '1dIPFrBBVtWZmfEmPK8r1fH7pBdfb63Vx', title: "Quartet No. 1 · Andante", by: "Borodin" },
    { id: 'f8', mood: 'focus' , file: '1d-T1CbER7Zt7C1AwqCThRpppCec5Nmxp', title: "Symphony No. 3 · Andante", by: "Brahms" },
    { id: 'f9', mood: 'focus' , file: '1kzuDvi8y67AKekqLuHcK0cpvQFLv1hk1', title: "Quartet No. 10 · Romanza", by: "Dvořák" },
    { id: 'f10', mood: 'focus' , file: '1JvxYA3xVzBcWjvHn4Wk1XeMbMbA32_cf', title: "\"American\" Quartet · Lento", by: "Dvořák" },
    { id: 'f11', mood: 'focus' , file: '1yUFAFWg_zI4rlNFX7jm2T46y2G2huAwZ', title: "Quartet No. 19 · Andante", by: "Mozart" },
    { id: 'f12', mood: 'focus' , file: '1dzxrNvA4zBgLwaOFZng7Ldycmv89Af_n', title: "Symphony No. 40 · Andante", by: "Mozart" },
    { id: 'f13', mood: 'focus' , file: '1hwWQX5D_6I2uMsL36-sEyF4CIvlh3TZF', title: "Sonata in A minor · Andante", by: "Schubert" },
    { id: 'f14', mood: 'focus' , file: '1MC-eUBdU3Oc71CXhvmGN8ge_VfPiMsu3', title: "Sonata in E-flat · Andante", by: "Schubert" },
    { id: 'f15', mood: 'focus' , file: '1MUk_aqxMO5TqWenk5vg9nJti4bxR6rJO', title: "Study and Relax", by: "FreePD" },
    { id: 'f16', mood: 'focus' , file: '1xZ1SockBV_eMDGWjQU9rtrZ7Bsf1W8ES', title: "Chronos", by: "FreePD" },
    { id: 'f17', mood: 'focus' , file: '1ypNaskfn6Inc1EN0O8RkfBRTuavxysvX', title: "Screen Saver", by: "FreePD" },
    { id: 'f18', mood: 'focus' , file: '1SBMCRPJwkfR65NnuqR25z4jsf8VLwMcZ', title: "From Page to Practice", by: "FreePD" },
    { id: 'f19', mood: 'focus' , file: '1IVV2Ub3L5Ebhwc-OUidTMKxDeQL65Enc', title: "Inspiration", by: "FreePD" },
    { id: 'e6', mood: 'energy', file: '1DmcSVhytgkJs05RNaW5b5VrIe8oW5shy', title: "Quartet No. 6 · Scherzo", by: "Beethoven" },
    { id: 'e7', mood: 'energy', file: '16LWKgFGcLgaXhX3-ciTY9EWQ1eKKKjlK', title: "Quartet No. 1 · Scherzo", by: "Borodin" },
    { id: 'e8', mood: 'energy', file: '1dAnMuq4TsQ_4WaZWZgocOrPOr3IKb9_u', title: "Quartet No. 2 · Scherzo", by: "Borodin" },
    { id: 'e9', mood: 'energy', file: '1WC0bO1Npw-xS4guwSYCF07yEJt6barIG', title: "Symphony No. 4 · Allegro giocoso", by: "Brahms" },
    { id: 'e10', mood: 'energy', file: '19xcSFuupRwwHBjA4mnZf1zfOF42Xdwmh', title: "\"American\" Quartet · Finale", by: "Dvořák" },
    { id: 'e11', mood: 'energy', file: '1ym_ybDYNnOdXOYlqhPYXWdAxMryuYnkD', title: "In the Hall of the Mountain King", by: "Grieg" },
    { id: 'e12', mood: 'energy', file: '1IgqJC_QySL-ouSyR9DIzPNVoWC9nd1tN', title: "\"Lark\" Quartet · Menuetto", by: "Haydn" },
    { id: 'e13', mood: 'energy', file: '18qKOHxc9FYE_M8GU1VyFEX1Xkg81GXSp', title: "Symphony No. 40 · Allegro", by: "Mozart" },
    { id: 'e14', mood: 'energy', file: '1pfnSfPVyuUChJ3zv-ztT5zZ_7s-v77SR', title: "Sonata in A minor · Rondo", by: "Schubert" },
    { id: 'e15', mood: 'energy', file: '1fl11Zx_pOvGYQjkJVQlVSFTlL4O8Xskc', title: "Egmont Overture", by: "Beethoven" },
    { id: 'g1', mood: 'game'  , file: '1G5QM7kwMgTvsp5CZeQNUDfOREwz6m5OH', title: "Bit Bit Loop", by: "FreePD" },
    { id: 'g2', mood: 'game'  , file: '1sQMjhhQi5l-uSAqR7nB3t0S1aS2kdpu1', title: "Game Loop: Mischief", by: "FreePD" },
    { id: 'g3', mood: 'game'  , file: '1_q11exz0-RGo802AIHzr2ANKckn4Zy4b', title: "Jungle Mission", by: "FreePD" },
    { id: 'g4', mood: 'game'  , file: '1rclZb8P75nPmuzdsgCuSJRanbJZZcZoX', title: "Funshine", by: "FreePD" },
    { id: 'g5', mood: 'game'  , file: '1vI8jZSuvCtpMmCyqQ_vZiryVf9HFDG3J', title: "Inventing Flight", by: "FreePD" },
    { id: 'g6', mood: 'game'  , file: '15duWp_A-p_uQwpJbKB5zu9id6Ft3wI6t', title: "City Sunshine", by: "FreePD" },
    { id: 'g7', mood: 'game'  , file: '1bu1JXBVIkDuh8e0Wy05pvUS2KxAkg7yX', title: "Hippety Hop", by: "FreePD" },
    { id: 'g8', mood: 'game'  , file: '1p5l1KU8H16yYN_B3ZRFgcpGIUCHw65-J', title: "Going Bananas", by: "FreePD" },
    { id: 'g9', mood: 'game'  , file: '1e2MwIDap0oSQGCBrx6pPSOjm2x-ILxV0', title: "The Entertainer", by: "Joplin" },
    { id: 'g10', mood: 'game'  , file: '1kcCs-daaQpnY1Om7AAHJJTpcuH6CtEky', title: "Maple Leaf Rag", by: "Joplin" },
    { id: 'g11', mood: 'game'  , file: '1qKyIxrvVhGmyVdtoHqPexKh7bwAGSGiI', title: "Happy Whistling Ukulele", by: "FreePD" },
    { id: 'g12', mood: 'game'  , file: '1ptX4b2AewNkavhMqYN-Lvr7-awO0CK0g', title: "Spring Chicken", by: "FreePD" },
    /* 2026-11-13 v152 (Head of School: "more happy, jolly, exciting music... similar types that cycle"): 63 more tracks in 6 new moods.
       FreePD (CC0; archive.org/details/freepd mirror) and John Philip Sousa marches by the U.S. Marine Band (public domain, archive.org InternetJukebox.JPS.*).
       Converted to Ogg Opus 48 kbps at even loudness (-16 LUFS). Titles checked for school fit; instrumental. */
    { id: "ha1", mood: "happy", file: "1mquzxE1lIEj8ViZjsweQngCXRGCtQ43p", title: "Ukulele Song", by: "FreePD" },
    { id: "ha2", mood: "happy", file: "1bTA8RNQTr29YtmD8N13wUbwGdpT7DHH7", title: "Pickled Pink", by: "FreePD" },
    { id: "ha3", mood: "happy", file: "1tZMfzjD_4nQIUfv1PTgDCDc5ygBMK9s4", title: "Motions", by: "FreePD" },
    { id: "ha4", mood: "happy", file: "1AOngZ_s9R-0fM7vigfwpK08Apu0mAQj1", title: "And Just Like That", by: "FreePD" },
    { id: "ha5", mood: "happy", file: "1UkpiLkYS1sBeVPoPt9EKujTLBO68IPUP", title: "Advertime", by: "FreePD" },
    { id: "ha6", mood: "happy", file: "1Zy8FlN-mN5LnWJ_4YGQz2dIkaf_4uC7P", title: "Hopeful", by: "FreePD" },
    { id: "ha7", mood: "happy", file: "1j5dAsEMwm7wsIuWEQcoJivStCg4BsbEx", title: "Silly Boy", by: "FreePD" },
    { id: "ha8", mood: "happy", file: "1PWYWkvepvqKYTgsE8c8QVytBaqjHkAC8", title: "Llama in Pajama", by: "FreePD" },
    { id: "ha9", mood: "happy", file: "1aKfUAC2B0ja9PBIz5mQPGf3LVQg3pRnZ", title: "My Giant Bunny Friend", by: "FreePD" },
    { id: "ha10", mood: "happy", file: "1la-iki0xD7i9_E80qRkfHXyd_SDH7tYQ", title: "Wakka Wakka", by: "FreePD" },
    { id: "ha11", mood: "happy", file: "10v9o0ffYEs8rOZfVE2dOVqJUpF0JAafV", title: "Barnville", by: "FreePD" },
    { id: "ha12", mood: "happy", file: "1TdsbCxYzIJRf4dtgJH0ta1uf54TCN_K5", title: "Foam Rubber", by: "FreePD" },
    { id: "su1", mood: "sunny", file: "123oCuuXnZ8sSu3RYeXeOySY6bCw5zYJU", title: "Be Jammin", by: "FreePD" },
    { id: "su2", mood: "sunny", file: "1AFN63Y5oiZoHvtYM3VHVAuL-xUOwEHti", title: "Sunny Rasta", by: "FreePD" },
    { id: "su3", mood: "sunny", file: "1tRFf-Lpqq6TaJT2V5CwM6SMU8yDhbxF3", title: "Connecting Rainbows", by: "FreePD" },
    { id: "su4", mood: "sunny", file: "1BGoVekrUh0XWGbsyr8wI0FQJeb7Gwzm7", title: "Hillbilly Swing", by: "FreePD" },
    { id: "su5", mood: "sunny", file: "1ZmVkNpwWXK8F91KX20taG6I54NKBFSc9", title: "Del Rio Bravo", by: "FreePD" },
    { id: "su6", mood: "sunny", file: "1KKhUvk0OMf1u9_wgFIaghuOY_Xihta57", title: "Cumbish", by: "FreePD" },
    { id: "su7", mood: "sunny", file: "1lZ7RUKdDWjJ3E3gUVSP_YyJ9vHmsihZN", title: "Bavarian Seascape", by: "FreePD" },
    { id: "su8", mood: "sunny", file: "1FyIOd2QXZ34fQFdxJPgBm--19QISWNTJ", title: "Still Pickin", by: "FreePD" },
    { id: "su9", mood: "sunny", file: "1F8jw8ZbOOqHwklPtm30PpeTQX3uOdm7h", title: "Village Tarantella", by: "FreePD" },
    { id: "su10", mood: "sunny", file: "1MXIQk3DQ4uNzJREqsinpOGaT5X1PXvAy", title: "Trip Up North", by: "FreePD" },
    { id: "sw1", mood: "swing", file: "1i_r5d-4JvNur3PNtatHCzxSK2YNAlFla", title: "BeBop for Joey", by: "FreePD" },
    { id: "sw2", mood: "swing", file: "1Nc5bZE2_hnWXGNTQyldnBWoNkZTQo9Pv", title: "Frogs Legs Rag", by: "FreePD" },
    { id: "sw3", mood: "swing", file: "1PPbyK1LGVO-3Mqkw9PuczI7CWH1qROsI", title: "Vintage Party", by: "FreePD" },
    { id: "sw4", mood: "swing", file: "1fRubNcn-DTztZR3a6SvGiDwdL0qCXQak", title: "Compy Jazz", by: "FreePD" },
    { id: "sw5", mood: "swing", file: "1LRTCMrkey3fHn_VUKDw6GCiqw99ywFRb", title: "Flutey Jazz", by: "FreePD" },
    { id: "sw6", mood: "swing", file: "1LCDwWSrlXD2W0TQcOtQpIosGFTR26nGy", title: "Downtown Boogie", by: "FreePD" },
    { id: "sw7", mood: "swing", file: "1bNC4KwHEs-Ms7DpXhr8ih0PXoN8aL_mJ", title: "Groovin", by: "FreePD" },
    { id: "sw8", mood: "swing", file: "1LxTqg2aODB4SGROi2BjFhHqsrrPEjma7", title: "Funkeriffic", by: "FreePD" },
    { id: "sw9", mood: "swing", file: "19kLW_8C-ItUahOa6lwuJzcuvP7WDBJ67", title: "Gotta Keep On Movin", by: "FreePD" },
    { id: "sw10", mood: "swing", file: "1g_W8e23h4W41uPqwHY7-CLcr-UdU_8z-", title: "Energizing", by: "FreePD" },
    { id: "sw11", mood: "swing", file: "1Qfn7fN7mNPykbZg6wSSrsadSv5hxyBhw", title: "Celebration", by: "FreePD" },
    { id: "he1", mood: "hero", file: "1vDxfIjSl6DRPr6CKBp3U0d4XLT5VxG70", title: "Adventure", by: "FreePD" },
    { id: "he2", mood: "hero", file: "11yIzVA4MZOJ5u-Q6m0XVui08cQxecgO3", title: "Adventures of Flying Jack", by: "FreePD" },
    { id: "he3", mood: "hero", file: "1leJfPH9SogkKyoGiPIrN362B7jjuNYg-", title: "Heroic Adventure", by: "FreePD" },
    { id: "he4", mood: "hero", file: "19rZxJ0n2Qj8Qq004Qu2DP2X8QDysvpI-", title: "New Hero in Town", by: "FreePD" },
    { id: "he5", mood: "hero", file: "1Lf0M8M5LTK6tnMHDipYAfKDlwWa_33ZL", title: "Overture", by: "FreePD" },
    { id: "he6", mood: "hero", file: "18Fo1pZQfVl9Wnn0gmlprNwjUh2xsAA6u", title: "Video Game Blockbuster", by: "FreePD" },
    { id: "he7", mood: "hero", file: "1kwmr4J2zDJNSxMGCrIVRIfRtowPxAd6Y", title: "Rush", by: "FreePD" },
    { id: "he8", mood: "hero", file: "1eRGgBcu43gcZGx9li1sy2hqGy8jXXMYn", title: "Take the Ride", by: "FreePD" },
    { id: "he9", mood: "hero", file: "1llVVKIqfJgw_EfkfiXUNVL65aX_4-Nvv", title: "Cornfield Chase", by: "FreePD" },
    { id: "he10", mood: "hero", file: "1ncetPlKogH_O4fScVxaDvVqqXGAOBg6V", title: "Fanfare X", by: "FreePD" },
    { id: "ar1", mood: "arcade", file: "1WzIdEdVuXrmanEuog-PzKTwjLTEZXVZm", title: "Beat One", by: "FreePD" },
    { id: "ar2", mood: "arcade", file: "1PeimK_qFPxgXWsCwOkV2OI9nESNdrY5V", title: "Fireworks", by: "FreePD" },
    { id: "ar3", mood: "arcade", file: "1KjmEv_D2on9Sssi-VHIeriBJ0wsiRFWh", title: "Favorite", by: "FreePD" },
    { id: "ar4", mood: "arcade", file: "14l91uO_-g6URCCAV9Pdmm-x3RHltYnH4", title: "Blippy Trance", by: "FreePD" },
    { id: "ar5", mood: "arcade", file: "1DulplL1PFUxAUpdzjzMXxvx0UqTXhRVA", title: "Circuit", by: "FreePD" },
    { id: "ar6", mood: "arcade", file: "198CL2o09T3i68H4QilvIlIRuqCCX5Oh4", title: "Sciencenet Theme", by: "FreePD" },
    { id: "ar7", mood: "arcade", file: "1KIGJtjNMeKr0b3FFoXRcihLQCqm7QhwQ", title: "Construction", by: "FreePD" },
    { id: "ar8", mood: "arcade", file: "1LuJTYb8QKH__YjINYDVh8kiA1HLwpEzb", title: "Improved Ice Cream Truck", by: "FreePD" },
    { id: "ar9", mood: "arcade", file: "1OYp5C1J1wewx12ZiqqNB7x2nVGeuhb_K", title: "Planeteer Reaction", by: "FreePD" },
    { id: "ar10", mood: "arcade", file: "1-OaZqq9NiG9vFGBTtI8ONNxYTgCbGU0j", title: "Backbeat", by: "FreePD" },
    { id: "pa1", mood: "parade", file: "1dq5qvKfwcnN6Z_ec3ZrXLTO1ugkizGqK", title: "The Washington Post", by: "Sousa · U.S. Marine Band" },
    { id: "pa2", mood: "parade", file: "1oAp5kyj5NsBN0px24B1US6yY-F4CxTVn", title: "The Liberty Bell", by: "Sousa · U.S. Marine Band" },
    { id: "pa3", mood: "parade", file: "19odH1_JGK6Vg3mfW_bAy1obwys5u8OaA", title: "The Stars and Stripes Forever", by: "Sousa · U.S. Marine Band" },
    { id: "pa4", mood: "parade", file: "10t1rhBgVMQFCP6BxsmklIri9gTJ0H3xM", title: "The Thunderer", by: "Sousa · U.S. Marine Band" },
    { id: "pa5", mood: "parade", file: "1_k60hWvMkvFDzjK4THC0yz23FSFZPRY9", title: "El Capitan", by: "Sousa · U.S. Marine Band" },
    { id: "pa6", mood: "parade", file: "14hEkLlMailEZkG_68gpp04UaqxpcGlw6", title: "Semper Fidelis", by: "Sousa · U.S. Marine Band" },
    { id: "pa7", mood: "parade", file: "12wXd_h63NoaWjll7x2UOVs0gYAy8pjwo", title: "Manhattan Beach", by: "Sousa · U.S. Marine Band" },
    { id: "pa8", mood: "parade", file: "1QNFppg6y0coek7rtov0eoeasthp6iKnZ", title: "Hands Across the Sea", by: "Sousa · U.S. Marine Band" },
    { id: "pa9", mood: "parade", file: "1tSKxN6mLN3WNrqepSW6PuuAh_jIADBHq", title: "The Fairest of the Fair", by: "Sousa · U.S. Marine Band" },
    { id: "pa10", mood: "parade", file: "1MmzakHZEMuHC4EVXma_UWoJQhBzx4Jup", title: "The High School Cadets", by: "Sousa · U.S. Marine Band" }
  ]
};
function msMusicOff_() { try { return PropertiesService.getScriptProperties().getProperty(MUSIC.PROP) === '1'; } catch (e) { return false; } }
function msMusicTrack_(id) { for (var i = 0; i < MUSIC.TRACKS.length; i++) if (MUSIC.TRACKS[i].id === id) return MUSIC.TRACKS[i]; throw new Error('Unknown track.'); }
/* list for the boy page: {off, tracks:[{id,mood,title,by,size,parts}]} */
function msMusicInfo(token) {
  msSession_(String(token || ''));
  var c = CacheService.getScriptCache(), hit = c.get('music-info-v3'), sizes = hit ? JSON.parse(hit) : null;
  if (!sizes) { sizes = {}; MUSIC.TRACKS.forEach(function (t) { try { sizes[t.id] = DriveApp.getFileById(t.file).getSize(); } catch (e) { sizes[t.id] = 0; } }); c.put('music-info-v3', JSON.stringify(sizes), 21600); }
  return { off: msMusicOff_(), tracks: MUSIC.TRACKS.filter(function (t) { return sizes[t.id] > 0; }).map(function (t) { return { id: t.id, mood: t.mood, title: t.title, by: t.by, size: sizes[t.id], parts: Math.ceil(sizes[t.id] / MUSIC.PART) }; }) };
}
/* one piece of one track, base64 */
function msMusicPart(token, id, part) {
  msSession_(String(token || ''));
  var t = msMusicTrack_(String(id || '')), bytes = DriveApp.getFileById(t.file).getBlob().getBytes();
  part = Math.max(0, Math.floor(Number(part) || 0));
  var a = part * MUSIC.PART, b = Math.min(bytes.length, a + MUSIC.PART);
  if (a >= bytes.length) return { data: '', done: true };
  return { data: Utilities.base64Encode(bytes.slice(a, b)), done: b >= bytes.length };
}
/* staff switch: music off (true) or on (false) for the whole school */
function sgMusicSet(token, off) {
  sgStaff_(token);
  PropertiesService.getScriptProperties().setProperty(MUSIC.PROP, off ? '1' : '0');
  return { off: msMusicOff_() };
}
/* Editor test: every track is readable from Drive. */
function zzMusicSelfTest() {
  return MUSIC.TRACKS.map(function (t) { try { var f = DriveApp.getFileById(t.file); return 'ok ' + t.id + ' ' + f.getName() + ' ' + f.getSize(); } catch (e) { return 'FAIL ' + t.id + ' ' + e.message; } }).join('\n') + '\nschool off: ' + msMusicOff_();
}
