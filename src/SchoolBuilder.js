/* ===== SchoolBuilder.js (takeover3, v266; HoS 2026-11-15: "totally upgrade adding schools, adding students, separating them, giving parents
   login ... the default school stays Tashbar, but make it super easy for other families, homeschool pods and groups to make their own").
   The friendly front door to Access.js. It changes NO rule of who sees whom: every call goes through acAdmin_ / acMine_, students join a school
   through MS_SchoolMembers exactly like Access.js, and parents are made by acSaveParent. New here:
   - sbLoad: one picture of every school (emoji, color, kids, parents, staff) for the Schools & Families home.
   - sbCreate: a school, family, homeschool pod or group WITH its kids and parents in one go; returns each new 4-digit code ONCE for welcome cards.
   - sbAddKids: add many kids straight into a school (no "Tashbar" wording; the kid joins the chosen school at once).
   - sbMove: move kids and get the new counts back (the screen shows them moving, with undo).
   - sbStyle: name, emoji and color of a school (emoji and color live in the MS_Schools "note" column as JSON).
   - sbNewCode: a fresh code for one kid, to print a new card (old codes are never stored, only their hash).
   - sbMySchool: a kid's own school or family name and emoji, for his home screen. ===== */
var SB = { EMO: ['🏫', '🏡', '🌱', '👥', '⭐', '📚', '🦁', '🌈', '🚀', '🌳', '🕯️', '💎'], COLORS: ['#4F46E5', '#059669', '#D97706', '#DB2777', '#0284C7', '#7C3AED', '#DC2626', '#0F766E'], MAXKIDS: 60 };
function sbMeta_() {
  var o = {}; acRows_('MS_Schools').forEach(function (r) { var id = String(r[0] || ''); if (!id) return; var m = {}; try { m = JSON.parse(String(r[6] || '{}')) || {}; } catch (e) { m = {}; } o[id] = { emoji: m.emoji || '', color: m.color || '', row: 0 }; });
  return o;
}
function sbKindEmoji_(k) { return { school: '🏫', family: '🏡', homeschool: '🌱', group: '👥' }[k] || '🏫'; }
function sbSetMeta_(id, meta) {
  var sh = acTab_('MS_Schools'), rows = acRows_('MS_Schools');
  for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id) {
    var m = {}; try { m = JSON.parse(String(rows[i][6] || '{}')) || {}; } catch (e) { m = {}; }
    if (!m || typeof m !== 'object' || Array.isArray(m)) m = { text: String(rows[i][6] || '') };
    if (meta.emoji) m.emoji = String(meta.emoji).slice(0, 8); if (meta.color && /^#[0-9A-Fa-f]{6}$/.test(meta.color)) m.color = meta.color;
    sh.getRange(i + 2, 7).setValue(JSON.stringify(m)); return true;
  }
  return false;
}
function sbLoad(token) {
  var me; try { me = acAdmin_(token); } catch (e) { return { canAdmin: false }; }
  var d = acAdminLoad(token), meta = sbMeta_(), n = {};
  d.schools.forEach(function (s) { n[s.id] = { kids: 0, parents: 0, staff: 0 }; });
  d.students.forEach(function (x) { if (n[x.school]) n[x.school].kids++; });
  d.parents.forEach(function (p) { if (p.active !== false && n[p.school]) n[p.school].parents++; });
  d.staff.forEach(function (x) { if (n[x.school]) n[x.school].staff++; });
  var schools = d.schools.filter(function (s) { return s.active !== false; }).map(function (s, i) { var m = meta[s.id] || {};
    return { id: s.id, name: s.name, kind: s.kind, emoji: m.emoji || sbKindEmoji_(s.kind), color: m.color || SB.COLORS[i % SB.COLORS.length], def: s.id === AC.DEF, kids: n[s.id].kids, parents: n[s.id].parents, staff: n[s.id].staff }; });
  var grade = {}; msRows_('roster').forEach(function (r) { var m = /grade (K|\d)/.exec(String(r[8] || '')); if (r[0] && m) grade[String(r[0])] = m[1]; });
  var kids = d.students.map(function (x) { return { id: x.id, name: x.name, school: x.school, grade: grade[x.id] || '' }; });
  var parents = d.parents.filter(function (p) { return p.active !== false; }).map(function (p) { return { id: p.id, name: p.name, title: p.title, sids: p.sids, school: p.school }; });
  return { canAdmin: true, head: !!me.head, myschool: me.school, def: AC.DEF, schools: schools, kids: kids, parents: parents, emojis: SB.EMO, colors: SB.COLORS, url: ScriptApp.getService().getUrl() };
}
function sbGrade_(g) { g = String(g == null ? '' : g).trim().toUpperCase().replace(/^GRADE\s*/, ''); if (g === 'K' || g === 'KG' || g === '0') return 0; var n = Number(g); return n >= 1 && n <= 8 && Math.round(n) === n ? n : -1; }
/* v270 speed: every code already in use (staff, parents, kids) is read ONCE per save, not once per child per try. */
function sbTaken_() {
  var pairs = [], st = msBook_().getSheetByName('MS_Staff'), n = st ? st.getLastRow() : 0;
  if (n > 1) st.getRange(2, 1, n - 1, 4).getValues().forEach(function (r) { if (r[0]) pairs.push([String(r[2]), String(r[3])]); });
  if (typeof acParentRows_ === 'function') acParentRows_().forEach(function (p) { if (p.salt) pairs.push([p.salt, p.hash]); });
  msRows_('roster').forEach(function (r) { if (r[0] && r[5]) pairs.push([r[5], String(r[6])]); });
  return function (c) { if (msStaffMatch_(c)) return true; for (var i = 0; i < pairs.length; i++) if (msHash_(pairs[i][0], c) === pairs[i][1]) return true; return false; };
}
function sbFreeCode_(used, taken) {
  taken = taken || sgCodeTaken_;
  for (var k = 0; k < 600; k++) { var c = ('000' + Math.floor(Math.random() * 10000)).slice(-4); if (used[c] || !sgCodeOk_(c) || taken(c)) continue; used[c] = 1; return c; }
  throw new Error('Could not make a code. Try again.');
}
/* inside sgLock_: adds the kids to the roster and to the school; returns [{id,name,grade,code}] */
function sbAddKidsLocked_(school, kids, who) {
  var sh = msTab_('roster'), rows = msRows_('roster'), names = {}, max = 0, used = {}, out = [], add = [], mrows = [], taken = sbTaken_();
  rows.forEach(function (r) { if (r[7] !== false) names[String(r[1]).toLowerCase()] = 1; var m = /^T(\d+)$/.exec(String(r[0])); if (m) max = Math.max(max, Number(m[1])); });
  kids.forEach(function (k) {
    var name = String(k.name || '').replace(/\s+/g, ' ').trim().slice(0, 60), gn = sbGrade_(k.grade);
    if (name.length < 2) throw new Error('Every child needs a name.');
    if (gn < 0) throw new Error('Pick a grade K to 8 for ' + name + '.');
    if (names[name.toLowerCase()]) throw new Error(name + ' is already on the list. Add a last name or an initial to tell them apart.');
    names[name.toLowerCase()] = 1;
    var id = 'T' + ('00' + (++max)).slice(-3), band = plBand_(gn + 1), salt = Utilities.getUuid(), code = sbFreeCode_(used, taken);
    add.push([id, name, band, band, band, salt, msHash_(salt, code), true, 'grade ' + (gn === 0 ? 'K' : gn) + ' · added ' + sgToday_() + ' by ' + who + ' (School Builder)']);
    if (school !== AC.DEF) mrows.push([id, school, new Date(), who]);
    out.push({ id: id, name: name, grade: gn === 0 ? 'K' : String(gn), code: code });
  });
  /* v270 speed: all new rows in one write per tab (was one appendRow per child) */
  if (add.length) sh.getRange(sh.getLastRow() + 1, 1, add.length, add[0].length).setValues(add);
  if (mrows.length) { var mem = acTab_('MS_SchoolMembers'); mem.getRange(mem.getLastRow() + 1, 1, mrows.length, 4).setValues(mrows); }
  return out;
}
function sbCleanKids_(kids) { kids = (kids || []).filter(function (k) { return k && String(k.name || '').trim(); }); if (kids.length > SB.MAXKIDS) throw new Error('Up to ' + SB.MAXKIDS + ' children at a time.'); return kids; }
function sbCreate(token, x) {
  var me = acAdmin_(token); x = x || {};
  if (!me.head) throw new Error('Only the Head of School can start a new school, family or group.');
  var kids = sbCleanKids_(x.kids), r = acSaveSchool(token, { name: x.name, kind: x.kind }), id = r.id;
  sgLock_(function () { sbSetMeta_(id, { emoji: x.emoji || sbKindEmoji_(x.kind), color: x.color }); acBump_(); });
  var made = kids.length ? sgLock_(function () { var o = sbAddKidsLocked_(id, kids, me.name); acBump_(); return o; }) : [];
  var pars = [];
  (x.parents || []).slice(0, 30).forEach(function (p) {
    if (!p || !String(p.name || '').trim()) return;
    var sids = (p.kids || []).map(function (i) { return made[Number(i)] && made[Number(i)].id; }).filter(Boolean);
    if (!sids.length) sids = made.map(function (k) { return k.id; });
    if (!sids.length) return;
    var pr = acSaveParent(token, { name: p.name, title: p.title, email: p.email, phone: p.phone, sids: sids });
    pars.push({ id: pr.id, name: acClean_(p.name, 80), title: acClean_(p.title, 30), code: pr.code, kids: sids.map(function (s) { return made.filter(function (k) { return k.id === s; })[0].name; }) });
  });
  return { id: id, name: acClean_(x.name, 80), kind: x.kind, emoji: x.emoji || sbKindEmoji_(x.kind), kids: made, parents: pars, url: ScriptApp.getService().getUrl() };
}
function sbAddKids(token, school, kids) {
  var me = acAdmin_(token); school = String(school || AC.DEF); acMine_(me, school);
  if (!acSchools_().some(function (s) { return s.id === school; })) throw new Error('Pick a school.');
  kids = sbCleanKids_(kids); if (!kids.length) throw new Error('Type at least one child.');
  var made = sgLock_(function () { var o = sbAddKidsLocked_(school, kids, me.name); acBump_(); return o; });
  return { school: school, kids: made, url: ScriptApp.getService().getUrl() };
}
function sbMove(token, sids, school) { var r = acMoveStudents(token, sids, school); return { moved: r.moved, load: sbLoad(token) }; }
function sbStyle(token, school, x) {
  var me = acAdmin_(token); school = String(school || ''); acMine_(me, school); x = x || {};
  if (x.name && me.head) { var cur = acSchools_().filter(function (s) { return s.id === school; })[0]; if (cur) acSaveSchool(token, { id: school, name: x.name, kind: x.kind || cur.kind }); }
  sgLock_(function () { if (!sbSetMeta_(school, x) && school === AC.DEF) { acTab_('MS_Schools').appendRow([AC.DEF, AC.DEFNAME, 'school', true, new Date(), me.name, '{}']); sbSetMeta_(school, x); } acBump_(); });
  return sbLoad(token);
}
function sbNewCode(token, sid) {
  var me = acAdmin_(token), mem = acMembers_(); sid = String(sid || ''); acMine_(me, acSchoolOf_(sid, mem));
  var c = sgFreeCode(token).code, r = sgSetCode(token, sid, c); return { id: sid, name: r.name, code: c, url: ScriptApp.getService().getUrl() };
}
function sbMySchool(token) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) return null;
  /* v270 speed: every kid asks this at sign-in; keep the answer 10 minutes. The key carries TL_ACCESS_VER, which every school or move change bumps, so a change shows at once. */
  var c = CacheService.getScriptCache(), ver = PropertiesService.getScriptProperties().getProperty('TL_ACCESS_VER') || '1', key = 'sbMy:' + ver + ':' + s.sid, hit = c.get(key);
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var id = acSchoolOf_(s.sid), sc = acSchools_().filter(function (x) { return x.id === id; })[0] || { id: AC.DEF, name: AC.DEFNAME, kind: 'school' }, m = sbMeta_()[id] || {};
  var out = { id: id, name: sc.name, kind: sc.kind, emoji: m.emoji || sbKindEmoji_(sc.kind), color: m.color || '', def: id === AC.DEF };
  try { c.put(key, JSON.stringify(out), 600); } catch (e) {}
  return out;
}
