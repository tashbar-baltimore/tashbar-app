# Your Classes & Bucket (1.0)

**Asked for (2026-11-27), one line:** "From 1:20 to 3:30, Monday to Thursday, the Chromebooks replace the afternoon. There are two **Teacher Time** classes, then **Independent Study**. During each class a boy can open **only** what his teacher assigned for that class. During Independent Study he works through his own **bucket list** (core first, any order, then add-ons). Teachers can change all of it easily."

## The default afternoon (school time, Monday to Thursday only)
| Time | Name | What the boy can open |
|---|---|---|
| 1:20 – 1:55 | Teacher Time 1 | only what his Teacher Time 1 teacher assigned for today |
| 1:55 – 2:30 | Teacher Time 2 | only what his Teacher Time 2 teacher assigned for today |
| 2:30 – 3:30 | Independent Study | his bucket list |

- **Who:** grade 2 and up, only boys put into a class that has a period, or given a bucket. K–1 and every other boy: unchanged. Fridays, Sundays and every other hour: unchanged.
- **Nothing assigned** for a Teacher Time period: that period is Independent Study. No bucket either: the app is as usual.
- **Switch** (Head of School only): off / test boys only (the default) / every boy in a class. The school's times are settings too.

## Where it lives
- `src/ClassesBucket.js`: the schedule, assignments, overrides, buckets and active sheets (records in the `MS_YC` tab; settings in Script Properties `yc_settings_v1`).
- `src/TeacherMode.js` `tmMine` asks `ycMine_` first. The newest of a teacher's live class and an override wins; with neither, the schedule decides.
- `src/ClassMode.html`: the boy's screens (Teacher Time, Independent Study bucket list, the worksheet screen). Button kit only.
- `src/StaffClasses.html`: the staff drawer "🕐 Your Classes & Bucket".
- `functions/index.js` `classwork()`: worksheet pages and boys' work as files in Cloud Storage (`classwork/`), asked for only by the app's own server code.
- `web/vendor/pdf.min.js` + `pdf.worker.min.js` (pdf.js 3.11.174, Apache-2.0): turns an uploaded PDF into pages on the teacher's screen.
- Tests: `tests/lib/classesbucket.js` (server: a whole made-up afternoon; page: the Teacher Time screen).

## Teacher tools
- Each class: which Teacher Time it is, its own usual times, today-only times.
- Assign work for a day (up to two weeks ahead): built lessons, the teacher's own quiz lessons, worksheets; for the whole class or chosen boys.
- Right now: Independent Study now, Free Play, Different work now (a live class).
- Worksheets: upload (PDF up to 20 pages, or JPG/PNG photos) or write one (questions, one per line). The boy writes, draws and types on it; it saves by itself; he hands it in; the teacher sees it and can let him fix it.
- Buckets: pick boys (one, or a level group), core (3–6 things, any order) and add-ons (open after the core). A line is a subject at his level, one exact lesson, or a worksheet. It stays until changed.

## Airtight lock and "Who gets what, when"
- While a boy's screen is locked, ClassMode.html stops every tap outside his class work, his bucket, the worksheet screen and sign out (a capture listener on window), hides the floating doors, and hides any part of the app left open when class began.
- Every part of the app is a door (`YC.DOORS` on the server, `DOORS` in ClassMode.html with how each opens). Any teacher can add opening times for his own boys (which doors, days, times, a class or chosen boys, "only after their core"); "The whole app" lifts the lock. Opened doors show as tiles on the class screen.
- Any teacher can take doors away from his boys until a time; that holds all day and beats any opening time.

## The look
The afternoon happens in the boys' world (`docs/WORLD.md`): Teacher Time in the Teacher Time Hall, Independent Study at the Bucket Spring with the crystal bucket. Screens: `docs/screens/classes-bucket/`.

## Not built yet
- A different bucket for a single day. Friday and holiday rules. Kindergarten and Grade 1.
- The server checks what a boy may open for worksheets; for lessons the lock is on the page (as Teacher mode always was).
