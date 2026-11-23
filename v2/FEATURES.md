# 1.0 → 2.0: every piece and where it stands

**Statuses:**
- **In 2.0**: approved and live on the 2.0 link.
- **Moving now**: being taken stock of and built clean in 2.0.
- **Looked at**: written down below what it really does, with a decision.
- **Not looked at yet**
- **Leaving out**: decided not worth moving, with the reason.

The HoS decides the order. The list grows as pieces are found.

| Piece of 1.0 | Main 1.0 files | Status | Notes |
|---|---|---|---|
| Boy sign-in (4-digit code) | QuestPage.html, Kiosk.js, MiddleSchool.js | Moving now (built, waiting for an approver) | `v2/app/core.js`. Same codes, same saved record as 1.0; saving keeps everything 1.0 saved. Staff and parents are told their screens are not in 2.0 yet. |
| K–1 games (train, matching, balloon games, Kriyah) in skill order | K1Only.html, packs/KLessons, KReading, KKriyah, G1Math, G1Reading | Moving now (built, waiting for an approver) | First piece (HoS 2026-11-22). `v2/app/games/` are exact copies of the 1.0 packs. Kindergarten: Numbers, ABC, Kriyah (Level 1); Grade 1: Numbers, Reading, Kriyah (Level 2); in each pack's skill order, next unlocks at 2 stars; full screen; voice bridge. Left out on purpose: 1.0's guess of K-1 from map levels (2.0 uses the roster grade only). Boys in Grades 2-8 are sent to the regular app. Test: `v2/tests/play-k1.js`. |
| Grade 2 math lessons (the 18 reworked to the HoS standard) | OneBite.html, OneBiteKit.html, OneBiteDataMath.html | Moving now | Second piece (HoS 2026-11-22). Needs the lesson player and its check questions moved too. |
| Lessons for other grades and subjects | OneBiteData*.html, QuestPage.html, packs/G2–G6 | Not looked at yet | |
| Level checks and placement | PathfinderLevel.js, Placement.js | Not looked at yet | |
| Map home, levels path, missions, arcade | GameMap.html, KidMap.js, HomePage.html | Not looked at yet | |
| Sound, voice, read-aloud | Sound.js, VoicePro.html, TashbarSound.html | Not looked at yet | Read-aloud for K–1 comes with the games. |
| Staff: class progress, student lookup | StaffHome.html, StudentLookup.js, StaffGrid.js | Not looked at yet | |
| Staff: notes, reports, reviews | StaffNotes.js, Reports.js, StaffReview.js | Not looked at yet | |
| Kodesh (Chumash, Kriyah beyond K–1, Pathfinder Kodesh) | Chumash.js, PathfinderKodesh*.js, packs/Kodesh* | Not looked at yet | Rebbe review applies. |
| Money (T$), store, canteen, prizes | Money.js, Store.js, Canteen.js | Not looked at yet | |
| Arena, class mode, teacher mode | Arena.js, ClassMode.html, TeacherMode.js | Not looked at yet | |
| Pathfinder (several versions) | Pathfinder*.js | Not looked at yet | Many versions overlap; pick one. |
| Block Builders | BlockBuilders*.html | Not looked at yet | |
| Music, jokes, Simcha pages, themes | Music.html, JokeJar.html, Simcha*.html, Theme.html | Not looked at yet | |
| Departments, School Builder, curriculum tools | Dept*.js, SchoolBuilder.js, Curriculum*.js | Not looked at yet | |
| Parent pages, kiosk, library | ParentPage.html, Kiosk.js, Library.js | Not looked at yet | |
| Workbook photos | Photos.js | Not looked at yet | |
