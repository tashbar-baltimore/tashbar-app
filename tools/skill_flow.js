/* tools/skill_flow.js — builds src/SkillFlowData.js, the data behind the staff "Skill flow chart" (Head of School 2026-11-19:
   "a flow chart of all skills ... click on every step ... objective ... the way the child is learning the skill ... where things are thin").
   Run after lessons change:   node tools/skill_flow.js
   How: opens the student page in the test kit's pretend browser (made-up kid, no server, no real data), reads every English skill's
   real lesson (BANK_ALL, TL_TEACH), reads the K-3 teaching lessons straight from their packs (stations and narration), orders by the
   ladders in CurriculumIndex.js, links skills into a flow (same strand in order + strand-to-strand links), and scores how each one is taught.
   Nothing here is shown to boys. Output: src/SkillFlowData.js  (var SF_DATA = { ENGLISH: {...} }). */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'); const B = require(path.join(ROOT, 'tests/lib/build.js'));
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }
/* standards (Common Core) recorded with the Pathfinder bank: Math and Reading skills, Language Arts skills */
const STD = (() => { try { const vm = require('vm'), rt = require(path.join(ROOT, 'server/runtime.js')).createRuntime({ store: { books: {}, props: {} } });
  return JSON.parse(vm.runInContext('(function(){ var o={}, a=(typeof PF_BANK!=="undefined"&&PF_BANK.skills)||{}, b=(typeof pf5Ix_==="function"&&pf5Ix_().laSkills)||{}; [a,b].forEach(function(m){ Object.keys(m).forEach(function(k){ if(m[k]&&m[k].ccss) o[k]=String(m[k].ccss); }); }); return JSON.stringify(o); })()', rt.ctx)); } catch (e) { console.warn('standards not read: ' + e.message); return {}; } })();
const CI = new Function(fs.readFileSync(path.join(ROOT, 'src/CurriculumIndex.js'), 'utf8') + '; return CI_INDEX;')();

/* ---------- 1. live lesson contents from the test page ---------- */
async function liveLessons(ids) {
  const K = B.kid(); const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const RS = fs.readFileSync(path.join(ROOT, 'tests/run.js'), 'utf8'); const i0 = RS.indexOf('const FAKE = '), i1 = RS.indexOf('\n};\n', i0);
  const FAKE = eval('(' + RS.slice(i0 + 13, i1 + 2) + ')'); await ctx.addInitScript(FAKE, { tools: K.tools, parts: K.parts });
  const pg = await ctx.newPage(); await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: K.page }) : r.abort());
  await pg.goto('http://app.test/'); await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 240000 }); await pg.waitForTimeout(8000);
  const out = await pg.evaluate(ids => { const K3 = ['KR', 'G1R', 'G2R', 'G3R', 'KWR', 'G1W', 'G2W', 'G3W', 'KL', 'G1M', 'G2M', 'G3M', 'KSC', 'G1S', 'G2S', 'G3S', 'KK'];
    return ids.map(([id, name, desc]) => { let b = BANK_ALL[id]; const t = (window.TL_TEACH || {})[id];
      if (!b) { let it = []; try { it = buildMission(id) || []; } catch (e) {} const how = ((window.TL_DO || {})[id] || {}).s || '';   /* Math: no BANK_ALL entry; read the lesson the boy really gets */
        if (it.length) b = { teach: it.filter(x => x.phase === 'teach').map(x => ({ how: how || x.h || '', q: x.q })), practice: it.filter(x => x.phase === 'practice').map(x => ({ t: x.t, q: x.q })),
          check: it.filter(x => x.phase === 'check').map(x => ({ t: x.t, q: x.q })), we: [], re: [] }; }
      return { id, name, desc, built: !!b, k3: K3.filter(g => window[g] && window[g].has && window[g].has(id)),
        teach: b && b.teach ? b.teach.map(x => ({ how: x.how || '', q: x.q })) : [], we: b && b.we ? b.we.map(x => ({ q: x.q })) : [],
        practice: b && b.practice ? b.practice.map(x => ({ t: x.t || 'mc', q: x.q })) : [], check: b && b.check ? b.check.map(x => ({ t: x.t || 'tap', q: x.q })) : [], re: b && b.re ? b.re.map(x => ({ t: x.t || 'mc' })) : [],
        tt: t ? { hook: t.hook, big: t.big, intro: t.intro, ex: (t.ex || []).length, oops: !!t.oops } : null }; }); }, ids);
  await browser.close(); return out;
}

/* ---------- 2. K-3 teaching lessons, read from the packs ---------- */
const unesc = t => t.replace(/\\n/g, '\n').replace(/\\u003e/g, '>').replace(/\\u003c/g, '<').replace(/\\u0026/g, '&').replace(/\\"/g, '"').replace(/\\'/g, "'");
const kindsIn = s => (String(s || '').match(/\[\s*'([A-Za-z0-9_]+)'/g) || []).map(x => x.replace(/^\[\s*'|'$/g, ''));
const saysIn = s => (String(s || '').match(/say\('((?:[^'\\]|\\.)*)'\)/g) || []).map(x => x.slice(5, -2).replace(/\s+/g, ' '));
function splitArgs(s, n) { const out = []; let depth = 0, cur = '', q = null;
  for (let i = 0; i < s.length && out.length < n; i++) { const c = s[i];
    if (q) { cur += c; if (c === '\\') { cur += s[++i]; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; cur += c; } else if ('([{'.includes(c)) { depth++; cur += c; }
    else if (')]}'.includes(c)) { if (!depth) { out.push(cur.trim()); break; } depth--; cur += c; } else if (c === ',' && !depth) { out.push(cur.trim()); cur = ''; } else cur += c; }
  return out; }
function k3Lessons() { const out = {};
  for (const f of ['KReading', 'G1Reading', 'G2Reading', 'G3Reading', 'KWriting', 'G1Writing', 'G2Writing', 'G3Writing', 'KLessons', 'G1Math', 'G2Math', 'G3Math']) {
    const t = unesc(fs.readFileSync(path.join(ROOT, 'packs', f + '.html'), 'utf8'));
    const re1 = /\{id:'((?:READ|LANG|WRIT|MATH)\.[A-Z]+\.L\d\d\.\d\d)'/g; let m; const starts = [];
    while ((m = re1.exec(t))) starts.push([m.index, m[1]]);
    starts.forEach(([s, id], i) => { if (out[id]) return; const seg = t.slice(s, Math.min(i + 1 < starts.length ? starts[i + 1][0] : s + 9000, s + 9000));
      const g = re => (seg.match(re) || [])[1];
      const arr = key => { const r = new RegExp('\\b' + key + ':\\[([\\s\\S]*?)\\]\\s*,\\s*\\n'); return kindsIn((seg.match(r) || [])[1]); };
      const real = seg.match(/real:\[\s*'([A-Za-z0-9_]+)'(?:[^\]]*?intro:'((?:[^'\\]|\\.)*)')?/);
      out[id] = { t: g(/\bt:'((?:[^'\\]|\\.)*)'/), sub: g(/sub:'((?:[^'\\]|\\.)*)'/), warm: arr('warm'), story: saysIn(g(/story:async\(\)=>\{([\s\S]*?)\},\s*\n\s*movie/)),
        movie: saysIn(g(/movie:async\(\)=>\{([\s\S]*?)\},\s*\n\s*together/)), readAlong: /movie:async[\s\S]{0,80}readAlong/.test(seg),
        together: arr('together'), practice: arr('practice'), real: real && real[1], realIntro: real && real[2], check: kindsIn((seg.match(/check:\[([\s\S]*?)\]\s*\}/) || [])[1]) }; });
    const re2 = /mk\d\('((?:READ|LANG|WRIT|MATH)\.[A-Z]+\.L\d\d\.\d\d)'/g;
    while ((m = re2.exec(t))) { const id = m[1]; if (out[id]) continue; const a = splitArgs(t.slice(m.index + 4), 11); if (a.length < 11) continue;
      const st = x => x.replace(/^'|'$/g, ''); const story = (a[5].match(/'((?:[^'\\]|\\.)*)'\s*\]?\s*$/) || [])[1];
      out[id] = { t: st(a[1]), sub: st(a[3]), warm: kindsIn(a[4]), story: story ? [story.replace(/\s+/g, ' ')] : [], movie: saysIn(a[6]), readAlong: /readAlong/.test(a[6]),
        together: kindsIn(a[7]), practice: kindsIn(a[8]), real: kindsIn(a[9])[0], realIntro: (a[9].match(/intro:'((?:[^'\\]|\\.)*)'/) || [])[1], check: kindsIn(a[10]) }; }
  }
  /* Science K-3: mkS(id, title, emoji, verb, ..., [emoji, story], [[emoji, line], ...], {real:...}) */
  for (const f of ['KScience', 'G1Science', 'G2Science', 'G3Science']) { const t = unesc(fs.readFileSync(path.join(ROOT, 'packs', f + '.html'), 'utf8')); const re = /mkS\('(SCI\.[A-Z]+\.L\d\d\.\d\d)'/g; let m;
    while ((m = re.exec(t))) { const id = m[1]; if (out[id]) continue; const a = splitArgs(t.slice(m.index + 4), 9); if (a.length < 8) continue; const st = x => String(x || '').replace(/^'|'$/g, '');
      const lines = x => (String(x || '').match(/'((?:[^'\\]|\\.)*)'/g) || []).map(y => y.slice(1, -1)).filter(y => y.length > 12);
      out[id] = { t: st(a[1]), sub: st(a[3]), generic: 1, story: lines(a[6]), movie: lines(a[7]), realIntro: (String(a[8] || '').match(/real:'((?:[^'\\]|\\.)*)'/) || [])[1] || '' }; } }
  return out;
}

/* ---------- 3. the flow ---------- */
const LANES = [['PA', 'READ.PA', 'Print & Sounds', 'read', 'How books and sounds work, before reading words.'], ['PHON', 'READ.PHON', 'Phonics & Word Study', 'read', 'Turning letters into sounds and sounds into words.'],
  ['FLU', 'READ.FLU', 'Fluency', 'read', 'Reading smoothly, accurately and with expression.'], ['LV', 'READ.LV', 'Leveled Reading', 'read', 'Reading whole books at the right level.'],
  ['VOC', 'READ.VOC', 'Vocabulary', 'read', 'Knowing and figuring out what words mean.'], ['COMP', 'READ.COMP', 'Comprehension', 'read', 'Understanding, questioning and thinking about a text.'],
  ['LIT', 'READ.LIT', 'Literature', 'read', 'Stories, characters, theme and the author’s craft.'], ['HAND', 'WRIT.HAND', 'Handwriting', 'write', 'Forming letters clearly and comfortably.'],
  ['GRAM', 'LANG.GRAM', 'Grammar', 'write', 'How words work together in a sentence.'], ['MECH', 'LANG.MECH', 'Capitals & Punctuation', 'write', 'The marks that make writing readable.'],
  ['SENT', 'WRIT.SENT|LANG.SENT', 'Sentences', 'write', 'Building complete, varied sentences.'], ['PARA', 'WRIT.PARA', 'Paragraphs', 'write', 'One idea, explained and supported.'],
  ['USE', 'LANG.USE', 'Word Choice & Usage', 'write', 'Choosing the right word for the reader.'], ['ESSAY', 'WRIT.ESSAY', 'Essays', 'write', 'Several paragraphs that make one strong point.'],
  ['RES', 'WRIT.RES', 'Research', 'write', 'Finding, checking and using sources.']];
const KIND = { tap: 'pick the answer', mc: 'pick the answer', sort: 'sort into groups', pairs: 'match pairs', spotall: 'tap every one that fits', order: 'put in order', num: 'type a number', type: 'type the word' };
const GAME = { pick: 'picture choice', yesNo: 'yes or no', sort2: 'sort into two groups', oddOne: 'find the one that does not belong', trace: 'trace with a finger', spot: 'spot it', order3: 'put three in order', buildSent: 'build a sentence from word tiles', passageQ: 'read a short passage and answer', readPic: 'read and match the picture', markPick: 'choose the end mark', blend: 'blend sounds into a word', firstSame: 'same first sound', capMatch: 'match capital and small letters', plural: 'make it plural', snapFind: 'find the sight word', letterFind: 'find the letter', rhymePick: 'pick the rhyme', vowelMissing: 'fill the missing vowel', spell: 'spell the word', digFind: 'find the two-letter sound', snap2: 'sight words', capStart: 'capital at the start', spellCVC: 'spell a short word', spellPat: 'spell with the pattern', beatsCount: 'count the beats', letterForPic: 'letter for the picture', taleMatch: 'match story parts', magicRead: 'read magic-E words', teamRead: 'read vowel-team words', flipPick: 'flip the letter the right way', neatPick: 'pick the neat writing', properPick: 'pick the proper name', rhymeYesNo: 'rhyme or not', clapBeats: 'clap the beats', chopPart: 'chop into parts', picWord: 'picture to word', magicPick: 'pick the magic-E word', compound: 'build a compound word', endFit: 'pick the ending that fits', wordHunt: 'word hunt in a passage', nameGroup: 'name the group', charQ: 'questions about a character', nameRight: 'write the name right', taleOrder: 'retell in order', startWord: 'starting word', listenWho: 'listen: who?', picForLetter: 'picture for the letter', vowelFirst: 'first vowel sound', digPic: 'two-letter sound picture', blendRead: 'blend and read', spaceOk: 'spaces between words', taleOrder2: 'retell in order', rhymeOdd: 'odd one out: rhyme', listenWhat: 'listen: what happened?', firstOdd: 'odd first sound', capLow: 'capital or small', taleWord: 'story word', snapFlash: 'flash sight words', snapFill: 'fill the sight word', digSpell: 'spell two-letter sounds', blendMissing: 'missing blend', teamFind: 'find the vowel team', splitSyl: 'split into syllables', wordSort2: 'sort the words', pathPick: 'choose the path', endMark: 'end mark', soundFirst: 'first sound', settingQ: 'where and when', eventOrder: 'order the events', clue: 'context clue detective', partMeaning: 'word part meaning', idiom: 'what the idiom means', baseWord: 'find the base word', split3: 'split long words', openClosed: 'open or closed syllable', compoundRead: 'read compound words', learnQ: 'answer from what you read', literal: 'what the words say', mainTopic: 'main topic', guideWords: 'dictionary guide words', glossary: 'use the glossary', textTool: 'use text features', whyDid: 'why did it happen?', trait: 'character trait', abcOrder: 'ABC order' };
const human = k => GAME[k] || KIND[k] || String(k).replace(/([a-z])([A-Z0-9])/g, '$1 $2').toLowerCase();
const tally = arr => { const c = {}; arr.filter(k => /^[a-z][A-Za-z0-9]+$/.test(k)).forEach(k => { const h = human(k); c[h] = (c[h] || 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => n > 1 ? k + ' ×' + n : k); };
const lv = id => +(/\.L(\d\d)/.exec(id) || [0, 0])[1]; const GRADE = n => n === 1 ? 'K' : n <= 9 ? String(n - 1) : 'HS';
const laneOf = id => { const p = id.split('.').slice(0, 2).join('.'); const l = LANES.find(x => x[1].split('|').indexOf(p) >= 0); return l ? l[0] : null; };
const PLAN = [['LIT', 5, 'Reading Poetry', 'Read a poem aloud with rhythm; explain what an image or line means.'], ['LIT', 6, 'Reading a Play', 'Follow scenes, stage directions and dialogue; act out a scene.'],
  ['LIT', 7, 'Novel Study', 'Read a whole short novel over several weeks: track characters, plot and theme.'], ['LIT', 9, 'Compare Two Stories', 'Compare how two stories handle the same theme.'],
  ['COMP', 5, 'How a Text Is Built', 'Spot cause and effect, compare and contrast, problem and solution.'], ['COMP', 7, 'Two Sources, One Topic', 'Read two articles on one topic and compare what each says.'],
  ['COMP', 9, 'Judge an Argument', 'Decide if the reasons and evidence really support the claim.'], ['PARA', 5, 'Tell a True Story', 'Write a personal narrative with a beginning, middle and end.'],
  ['ESSAY', 6, 'Revise and Edit', 'Improve a draft: clearer sentences, better words, fewer mistakes.'], ['ESSAY', 8, 'Write About Literature', 'A short essay about a story, with quotes as evidence.'],
  ['COMP', 10, 'Advanced Comprehension', 'Analyze an author’s choices: structure, tone and purpose.'], ['LIT', 10, 'Literary Analysis', 'Interpret theme and symbol across a full novel.'], ['ESSAY', 10, 'The Analytical Essay', 'A multi-page essay with a thesis and textual evidence.']];
const CROSS = [['PA', 'PHON', 0], ['PHON', 'FLU', 0], ['FLU', 'LV', 0], ['PHON', 'VOC', 1], ['FLU', 'COMP', 1], ['VOC', 'COMP', 0], ['COMP', 'LIT', 0], ['HAND', 'SENT', 0], ['GRAM', 'SENT', 0], ['MECH', 'SENT', 0], ['SENT', 'PARA', 0], ['GRAM', 'USE', 0], ['PARA', 'ESSAY', 1], ['ESSAY', 'RES', 1], ['COMP', 'RES', 0], ['COMP', 'PARA', 1], ['LIT', 'ESSAY', 1]];
/* ---------- subjects (HoS 2026-11-19: "build the same chart for math, science, Kodesh") ----------
   lanes: [id, id prefixes (|), name, side, about]. cross: [from lane, to lane, levels back]. plan: stops a full program needs that are not built.
   keyOf: the placement subject (Placement.js PL.SUBJECTS) or null when this lane cannot be placed on. */
const ENGLISH_CFG = { std: 'Common Core', lanes: LANES, laneOf, plan: PLAN, cross: CROSS, sides: [['read', 'Reading'], ['write', 'Writing & Language']], keys: { READ: 'Reading', LANG: 'Writing & Language' }, keyOf: id => (/^READ\./.test(id) ? 'READ' : 'LANG') };
const prefLane = lanes => id => { const p = id.split('.').slice(0, 2).join('.'); const l = lanes.find(x => x[1].split('|').indexOf(p) >= 0); return l ? l[0] : null; };
const MATH_LANES = [['NUM', 'MATH.NUM', 'Counting & Numbers', 'num', 'Counting, comparing and naming numbers.'], ['PV', 'MATH.PV', 'Place Value', 'num', 'Ones, tens, hundreds and beyond: what each digit is worth.'],
  ['OPS', 'MATH.OPS', 'Operations', 'num', 'Adding, subtracting, multiplying and dividing, with understanding.'], ['FRAC', 'MATH.FRAC', 'Fractions & Decimals', 'num', 'Parts of a whole, decimals and how to work with them.'],
  ['ALG', 'MATH.ALG', 'Algebra & Patterns', 'num', 'Patterns, expressions and equations.'], ['FUNC', 'MATH.FUNC', 'Functions', 'num', 'One input, one output: rules that connect numbers.'],
  ['MEAS', 'MATH.MEAS', 'Measurement', 'space', 'Length, weight, time, money, area and volume.'], ['GEO', 'MATH.GEO', 'Geometry', 'space', 'Shapes, angles and space.'], ['STAT', 'MATH.STAT', 'Data & Statistics', 'space', 'Collecting, showing and reading data.']];
const MATH_CFG = { std: 'Common Core', lanes: MATH_LANES, laneOf: prefLane(MATH_LANES), plan: [], sides: [['num', 'Number & Operations'], ['space', 'Shape, Measure & Data']], keys: { MATH: 'Math' }, keyOf: () => 'MATH',
  cross: [['NUM', 'PV', 0], ['NUM', 'OPS', 0], ['PV', 'OPS', 0], ['OPS', 'FRAC', 1], ['FRAC', 'ALG', 1], ['OPS', 'ALG', 1], ['ALG', 'FUNC', 1], ['NUM', 'MEAS', 0], ['MEAS', 'GEO', 1], ['NUM', 'STAT', 0], ['OPS', 'STAT', 1], ['FRAC', 'MEAS', 1]] };
const SCI_LANES = [['INQ', 'SCI.INQ', 'Scientist Skills', 'inq', 'Observe, test fairly, measure and explain.'], ['MATT', 'SCI.MATT|SCI.PHYS', 'Matter, Forces & Energy', 'phys', 'What things are made of, how they move, light, sound and heat.'],
  ['SKY', 'SCI.SKY', 'Space & Sky', 'phys', 'Sun, moon, stars and the patterns in the sky.'], ['LAND', 'SCI.LAND|SCI.EARTH', 'Earth & Weather', 'phys', 'Land, water, rocks and weather.'],
  ['PLANT', 'SCI.PLANT|SCI.LIFE', 'Plants & Living Things', 'life', 'What living things need, how plants grow and change.'], ['ANIM', 'SCI.ANIM', 'Animals', 'life', 'How animals live, grow and fit where they live.'], ['BODY', 'SCI.BODY', 'The Human Body', 'life', 'How the body works and how to keep it healthy.']];
const SCI_CFG = { std: 'not mapped yet', lanes: SCI_LANES, laneOf: prefLane(SCI_LANES), sides: [['phys', 'Earth & Physical'], ['life', 'Life Science'], ['inq', 'Scientist Skills']], keys: { SCI: 'Science' }, keyOf: () => 'SCI',
  cross: [['INQ', 'MATT', 0], ['MATT', 'SKY', 1], ['MATT', 'LAND', 1], ['SKY', 'LAND', 0], ['LAND', 'PLANT', 1], ['PLANT', 'ANIM', 0], ['ANIM', 'BODY', 0]],
  plan: [['INQ', 5, 'Plan a Fair Test', 'Plan an experiment that changes one thing and keeps everything else the same.'], ['INQ', 7, 'Measure, Record, Graph', 'Collect measurements, record them in a table and make a graph.'],
    ['INQ', 9, 'Explain with Evidence', 'Write a conclusion that uses the data as evidence.']] };
const KOD_LANES = [['KRI', 'LK.KRI', 'Kriyah', 'text', 'Reading Hebrew: letters, nekudos, then smooth reading.'], ['LSH', 'HEB.VOC|HEB.GRAM|HEB.READ', 'Lashon Hakodesh', 'text', 'Words, roots and grammar of Lashon Hakodesh.'],
  ['CHU', 'LK.CHU', 'Chumash', 'text', 'Reading and understanding the pesukim.'], ['RAS', 'LK.RAS', 'Rashi', 'text', 'Reading Rashi and his questions on the pasuk.'], ['MSH', 'LK.MSH', 'Mishnayos', 'text', 'Reading and understanding a Mishnah.'],
  ['GEM', 'LK.GEM', 'Gemara', 'text', 'The Gemara’s words, flow and reasoning.'], ['NAV', 'LK.NAV', 'Navi', 'text', 'The stories and lessons of Navi.'], ['TEF', 'LK.TEF', 'Tefillah', 'life', 'Davening: the words, their meaning and the order.'],
  ['HAL', 'LK.HAL', 'Halacha', 'life', 'What to do and how: brachos and daily halachos.'], ['YT', 'LK.YT', 'Yomim Tovim', 'life', 'The Yomim Tovim, their mitzvos and minhagim.'], ['PAR', 'LK.PAR', 'Parsha', 'life', 'The weekly parsha and its lessons.'],
  ['MID', 'LK.MID', 'Middos', 'life', 'Good middos and Pirkei Avos.'], ['CHEM', 'LK.CHEM', 'Chemdas', 'life', 'Core Jewish knowledge, step by step.'], ['TRY', 'LK.TRY', 'Taryag Mitzvos', 'life', 'The 613 mitzvos.']];
const KOD_PLAN = []; ['HAL', 'TEF', 'YT', 'PAR', 'MID', 'NAV'].forEach(l => { const nm = KOD_LANES.find(x => x[0] === l)[2];
  KOD_PLAN.push([l, 5, nm + ', grades 3–5', 'Continue ' + nm + ' past grade 2. What is taught here is set by the Menahel and the rebbeim.'], [l, 8, nm + ', grades 6–8', 'Continue ' + nm + ' in the upper grades. What is taught here is set by the Menahel and the rebbeim.']); });
const KOD_CFG = { std: 'Tashbar’s own Limudei Kodesh sequence', lanes: KOD_LANES, laneOf: prefLane(KOD_LANES), plan: KOD_PLAN, sides: [['text', 'Text skills'], ['life', 'Living Torah']], keys: { HEB: 'Lashon Hakodesh' }, keyOf: id => (/^HEB\./.test(id) ? 'HEB' : null),
  levelOf: id => lv(id) || 6, cross: [['KRI', 'LSH', 0], ['KRI', 'CHU', 0], ['LSH', 'CHU', 0], ['CHU', 'RAS', 0], ['LSH', 'MSH', 1], ['RAS', 'MSH', 1], ['MSH', 'GEM', 1], ['CHU', 'NAV', 1], ['KRI', 'TEF', 0]] };

function buildFlow(ela, k3, C) {
  C = C || ENGLISH_CFG; const laneOf = C.laneOf, LANES = C.lanes, PLAN = C.plan || [], CROSS = C.cross || [];
  const nodes = [];
  for (const s of ela) { const lane = laneOf(s.id); if (!lane || !s.built) continue; const L = C.levelOf ? C.levelOf(s.id) : lv(s.id), K = k3[s.id] && s.k3.length ? k3[s.id] : (s.k3.indexOf('KK') >= 0 ? { t: s.name, generic: 1, story: [], movie: [] } : null);
    const pk = s.practice.map(p => p.t), kinds = new Set(pk.map(t => t === 'mc' ? 'tap' : t)), mcShare = pk.filter(t => t === 'mc').length / Math.max(1, pk.length);
    const avgHow = s.teach.reduce((a, t) => a + (t.how || '').length, 0) / Math.max(1, s.teach.length); const flags = [], has = []; let score = 0;
    if (K) { score += 3; has.push('A full teaching lesson: warm-up, story, narrated mini-movie, guided practice with help, practice, a real-life task, a check with no help.'); } else flags.push('No full teaching lesson. The boy reads three short tips and goes straight to question games.');
    if (s.tt && (s.tt.intro || []).length >= 3) { score++; has.push('Teacher Time: a hook, a big idea, ' + s.tt.intro.length + ' steps' + (s.tt.ex ? ', ' + s.tt.ex + ' worked examples' : '') + (s.tt.oops ? ' and a common mistake to avoid.' : '.')); } else flags.push('No Teacher Time introduction.');
    if (avgHow >= 60) score++; else flags.push('The "Learn it" steps are one short line each; there is little explaining.');
    if (s.we.length) score++; else if (!K) flags.push('No worked example done together before the boy tries alone.');
    if (kinds.size >= 4) score++; else flags.push('Practice uses only ' + kinds.size + ' kind' + (kinds.size === 1 ? '' : 's') + ' of activity.');
    if (mcShare > .25) { score--; flags.push('Much of the practice is plain multiple choice.'); }
    if (s.re.length) score++; else flags.push('No re-teach path if he fails the check: he repeats the same lesson.');
    if (C.extra) C.extra({ s, lane, L, K, flags });
    if (C === ENGLISH_CFG && (lane === 'COMP' || lane === 'LIT') && !K && !s.practice.concat(s.check).some(p => (p.q || '').length > 140)) flags.push('Reading questions use one-line examples, not a real passage or story to read.');
    if (C === ENGLISH_CFG && L >= 5 && /^(ESSAY|PARA|RES)$/.test(lane)) flags.push('Writing is practiced by tapping and sorting; the boy never writes a whole paragraph or essay that gets feedback.');
    const steps = [], quest = [];
    if (K && K.generic) { steps.push({ st: 'Warm-up', t: 'Quick review of what he already knows.' }); if (K.story && K.story.length) steps.push({ st: 'Story hook', t: K.story.join(' ') });
      if (K.movie && K.movie.length) steps.push({ st: 'Mini-movie', t: K.movie.join(' ') }); steps.push({ st: 'Together', t: 'Items done with help that fades.' }); steps.push({ st: 'Practice', t: 'Items on his own, mixed activities.' });
      if (K.realIntro) steps.push({ st: 'Real life', t: '“' + K.realIntro + '”' }); steps.push({ st: 'Check', t: 'Items with no help.' }); steps.push({ st: 'Celebrate', t: 'Stars for the lesson, then the skill’s practice games.' }); }
    else if (K) { steps.push({ st: 'Warm-up', t: 'Quick review of what he already knows: ' + (tally(K.warm).join(', ') || 'review games') + '.' });
      if (K.story.length) steps.push({ st: 'Story hook', t: K.story.join(' ') }); if (K.movie.length) steps.push({ st: 'Mini-movie', t: (K.readAlong ? 'A short passage is read aloud with him. ' : '') + K.movie.join(' ') });
      steps.push({ st: 'Together', t: K.together.length + ' items done with help that fades: ' + tally(K.together).join(', ') + '.' }); steps.push({ st: 'Practice', t: K.practice.length + ' items on his own, mixed: ' + tally(K.practice).join(', ') + '.' });
      if (K.real) steps.push({ st: 'Real life', t: (K.realIntro ? '“' + K.realIntro + '” ' : '') + 'One task using the skill in everyday life (' + human(K.real) + ').' });
      steps.push({ st: 'Check', t: K.check.length + ' items with no help: ' + tally(K.check).join(', ') + '.' }); steps.push({ st: 'Celebrate', t: 'Stars for the lesson, then the skill’s practice games.' }); }
    if (s.tt) quest.push({ st: 'Teacher Time', t: [s.tt.hook, s.tt.big].filter(Boolean).join(' ') + (s.tt.intro && s.tt.intro.length ? ' Steps: ' + s.tt.intro.join(' → ') : '') });
    if (s.teach.length) quest.push({ st: 'Learn it', t: s.teach.length + ' examples, each with a tip: ' + [...new Set(s.teach.map(t => '“' + (t.how || t.q) + '”'))].join(' ') });
    if (s.we.length) quest.push({ st: 'Together', t: s.we.length + ' worked examples step by step.' });
    quest.push({ st: 'Practice games', t: s.practice.length + ' items: ' + tally(pk).join(', ') + '. Examples: ' + s.practice.slice(0, 3).map(p => '“' + p.q + '”').join(' ') });
    quest.push({ st: 'Mastery check', t: s.check.length + ' questions, no help: ' + s.check.map(c => '“' + c.q + '”').join(' ') });
    if (s.re.length) quest.push({ st: 'If he misses', t: s.re.length + ' simpler re-teach items on the skill underneath, then he tries again.' });
    nodes.push({ id: s.id, std: STD[s.id] || '', lane, L, g: GRADE(L), name: s.name, obj: s.desc || (s.tt && s.tt.big) || '', big: s.tt && s.tt.big || '', k3t: K ? K.t : '', depth: K ? 'taught' : score >= 4 ? 'guided' : 'quiz', flags, has, steps, quest, nc: s.check.length, key: C.keyOf(s.id) }); }
  const byLane = {}; nodes.forEach(n => (byLane[n.lane] = byLane[n.lane] || []).push(n));
  PLAN.forEach(([lane, L, name, obj], i) => nodes.push({ id: 'PLAN.' + lane + '.L' + String(L).padStart(2, '0') + '.' + (i + 1), lane, L, g: GRADE(L), name, obj, planned: 1, depth: 'planned', flags: ['Not built yet. No lesson, no questions.'], has: [], steps: [], quest: [] }));
  const edges = [], add = (a, b, k) => { if (a && b && a.id !== b.id && !edges.some(e => e[0] === a.id && e[1] === b.id)) edges.push([a.id, b.id, k]); };
  const lastUpTo = (lane, L) => { const a = (byLane[lane] || []).filter(n => n.L <= L); return a[a.length - 1]; };
  Object.values(byLane).forEach(a => a.forEach((n, i) => { if (i) add(a[i - 1], n, 'lane'); }));
  CROSS.forEach(([from, to, back]) => (byLane[to] || []).forEach((n, i, a) => { if (i && a[i - 1].L === n.L) return; const src = lastUpTo(from, n.L - back); if (src && src.L >= Math.max(1, n.L - 2)) add(src, n, 'cross'); }));
  nodes.filter(n => n.planned).forEach(n => { const a = (byLane[n.lane] || []).filter(m => m.L <= n.L); if (a.length) add(a[a.length - 1], n, 'plan'); });
  return { lanes: LANES.map(l => ({ id: l[0], name: l[2], side: l[3], about: l[4] })), sides: C.sides, keys: C.keys, std: C.std, nodes, edges };
}

(async () => {
  const kodIds = []; const seen = {}; Object.keys(CI.lk).filter(k => k !== 'MIN').forEach(k => CI.lk[k].forEach(id => { if (!seen[id]) { seen[id] = 1; kodIds.push([id, (CI.sk[id] || [id])[0], '']); } }));
  const SUBJ = [['ENGLISH', CI.lad.READ.concat(CI.lad.LANG), ENGLISH_CFG, { title: 'English', from: 'ABCs', to: '8th grade' }],
    ['MATH', CI.lad.MATH, MATH_CFG, { title: 'Math', from: 'Counting', to: '8th grade (Algebra 1 start)' }],
    ['SCIENCE', CI.lad.SCI, SCI_CFG, { title: 'Science', from: 'Kindergarten', to: '8th grade' }],
    ['KODESH', kodIds, KOD_CFG, { title: 'Limudei Kodesh', from: 'Aleph-Beis', to: '8th grade' }]];
  const all = []; SUBJ.forEach(x => x[1].forEach(r => all.push(r))); const live = await liveLessons(all), byId = {}; live.forEach(l => { byId[l.id] = l; }); const k3 = k3Lessons();
  const data = { built: new Date().toISOString().slice(0, 10) };
  for (const [key, ids, C, head] of SUBJ) { const flow = buildFlow(ids.map(r => byId[r[0]]).filter(Boolean), k3, C); const sum = {}; flow.nodes.forEach(n => sum[n.depth] = (sum[n.depth] || 0) + 1);
    data[key] = Object.assign({}, head, { mastery: 'A skill counts as mastered when the boy gets all its check questions right with no help. The K–3 teaching lessons teach and record stars; they do not mark mastery by themselves.' }, flow);
    console.log(key, JSON.stringify(sum), 'edges', flow.edges.length); }
  /* kept as TEXT: the server runs every file on every call, and a 2 MB object costs ~3 ms each time; text costs ~0.3 ms and is read only when the chart opens */
  const js = '/* SkillFlowData.js — GENERATED by tools/skill_flow.js (do not edit by hand). The data behind the staff Skill flow chart (SkillFlow.js, SkillFlowUI.html). */\nvar SF_DATA_JSON = ' + JSON.stringify(JSON.stringify(data)) + ';\n';
  fs.writeFileSync(path.join(ROOT, 'src/SkillFlowData.js'), js); console.log('bytes', js.length);
})().catch(e => { console.error(e); process.exit(1); });
