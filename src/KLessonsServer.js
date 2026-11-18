/* KLessonsServer.js — KINDERGARTEN MATH (KLessons.html add-on). Claude Code builder, 2026-11-18. Head of School: publish all of kindergarten live.
   klMe(token): the signed-in boy's roster grade (pfGrade_, "grade K" in the roster note -> 0), so the home shows the
   Kindergarten Math card only to K and 1st grade boys. Read only: no writes, no money, no mastery, no placement.
   Lesson results are saved by the app's own saveStudent/msSave (evidence rows, skill "KLESSON.<id>"); nothing new on the server for that. */
function klMe(token) {
  var s = msSession_(token);
  if (!s || s.role !== 'kid' || !s.sid) return { grade: null };
  var g = null;
  try { g = typeof pfGrade_ === 'function' ? pfGrade_({ id: String(s.sid) }, null) : null; } catch (e) { g = null; }
  return { grade: (g == null || isNaN(Number(g))) ? null : Number(g) };
}
