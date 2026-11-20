#!/usr/bin/env node
/* Tashbar picture collector. Downloads safe, freely licensed photos for each topic in topics.json into a local folder
   (never into git, never hotlinked) and records every picture's credit in credits.json.

   Run:   node tools/picture-collector/collect.js                    all topics
          node tools/picture-collector/collect.js --only barn-owl,saturn
          node tools/picture-collector/collect.js --first 10
   Options: --out <folder> (default: picture-library next to the repository folder's root)  --allow-nc  --allow-nd
   Stop it any time (Ctrl+C). Run the same command again and it carries on where it stopped. */
'use strict';
const fs = require('fs'), path = require('path');
const L = require('./lib'); const { SOURCES, MIN_W } = require('./sources');

const TARGET = 8, MAX = 10; /* pictures per topic: aim for 8, never more than 10 */
const CAP = { wikimedia: 4, pixabay: 4, pexels: 3, nasa: 4, loc: 4 }; /* first pass: at most this many from each site */
const CAP_SPECIAL = { wikimedia: 3, pixabay: 2, pexels: 2, nasa: 4, loc: 4 }; /* space / history topics: leave room for NASA or LOC */

const args = process.argv.slice(2); const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const OUT = path.resolve(opt('--out') || path.join(__dirname, '..', '..', 'picture-library'));
const IMG = path.join(OUT, 'images'), CACHE = path.join(OUT, 'cache');
for (const d of [OUT, IMG, CACHE]) fs.mkdirSync(d, { recursive: true });
const F = { credits: path.join(OUT, 'credits.json'), state: path.join(OUT, 'state.json') };

let topics = L.readJSON(path.join(__dirname, 'topics.json'));
if (opt('--only')) { const ids = opt('--only').split(','); topics = topics.filter(t => ids.includes(t.id)); }
if (opt('--first')) topics = topics.slice(0, Number(opt('--first')));

const credits = L.readJSON(F.credits, []);
const state = L.readJSON(F.state, { topics: {}, rejected: [], skipped: {}, errors: [] });
state.skipped = state.skipped || {}; state.errors = state.errors || []; state.rejected = state.rejected || [];
const seen = new Set([...credits.flatMap(c => [c.sha256, c.sourceId]), ...state.rejected]);
const save = () => { L.writeJSONAtomic(F.credits, credits); L.writeJSONAtomic(F.state, state); };
const skip = reason => { state.skipped[reason] = (state.skipped[reason] || 0) + 1; };
const runSkips = {}; const noteSkip = r => { skip(r); runSkips[r] = (runSkips[r] || 0) + 1; };
const offToday = new Map(); /* source → reason, when a site's limit is used up for this run */
const blockedHosts = new Set();

async function take(topic, c) {
  if (seen.has(c.sourceId)) { noteSkip('duplicate'); return false; }
  seen.add(c.sourceId);
  if (c.resolve) { const why = await c.resolve(); if (why) { noteSkip(why); return false; } }
  let buf;
  try { ({ buf } = await L.politeFetch(c.downloadUrl)); }
  catch (e) {
    if (e instanceof L.BlockedHostError) { blockedHosts.add(e.host); noteSkip('picture is on a site not on the allowed list'); return false; }
    noteSkip('download failed'); state.errors.push({ topic: topic.id, source: c.source, error: L.hide(e.message) }); return false;
  }
  const info = L.imageInfo(buf);
  if (!info) { noteSkip('not a picture file'); return false; }
  if (info.w < MIN_W) { noteSkip('too small (under 800px wide)'); return false; }
  const hash = L.sha256(buf); if (seen.has(hash)) { noteSkip('duplicate'); return false; } seen.add(hash);
  const dir = path.join(IMG, topic.category, topic.id); fs.mkdirSync(dir, { recursive: true });
  const n = credits.filter(x => x.topic === topic.id).length + 1;
  const file = path.posix.join(topic.category, topic.id, `${topic.id}-${c.source}-${hash.slice(0, 8)}.${info.type}`);
  fs.writeFileSync(path.join(IMG, file), buf);
  credits.push({ file, topic: topic.id, topicName: topic.name, category: topic.category, group: topic.group, source: c.source,
    provider: c.provider || undefined, pageUrl: c.pageUrl, author: c.author, licence: c.licence, licenceUrl: c.licenceUrl,
    title: String(c.title || '').slice(0, 200), width: info.w, height: info.h, bytes: buf.length, sha256: hash, sourceId: c.sourceId, n });
  save(); return true;
}

async function doTopic(topic, i) {
  const st = state.topics[topic.id] = state.topics[topic.id] || { sources: {} };
  const have = () => credits.filter(x => x.topic === topic.id);
  const srcs = SOURCES.filter(s => (!s.enabled || s.enabled()) && (!s.only || (topic.extra || []).includes(s.only)));
  const found = {};
  const searchSite = async s => {
    if (st.sources[s.name] === 'done') return;
    if (offToday.has(s.name)) { st.sources[s.name] = 'waiting'; return; }
    try { const r = await s.search(topic, { cacheDir: CACHE }); found[s.name] = r.cands; r.skipped.forEach(noteSkip); }
    catch (e) {
      if (e instanceof L.QuotaError) { offToday.set(s.name, e.message); st.sources[s.name] = 'waiting'; console.log(`  ${s.name}: ${e.message}. It will be used again on the next run.`); return; }
      if (e instanceof L.BlockedHostError) { blockedHosts.add(e.host); st.sources[s.name] = 'error'; return; }
      st.sources[s.name] = 'error'; state.errors.push({ topic: topic.id, source: s.name, error: L.hide(e.message) }); console.log(`  ${s.name}: error ${L.hide(e.message)}`);
    }
  };
  const main = srcs.filter(s => !s.fallback), fill = srcs.filter(s => s.fallback);
  for (const s of main) await searchSite(s);
  /* pass 1: a few from each site, in order. pass 2: top up to TARGET from whatever is left. */
  for (const s of main) {
    for (const c of found[s.name] || []) {
      if (have().length >= MAX || have().filter(x => x.source === s.name).length >= (topic.extra ? CAP_SPECIAL : CAP)[s.name]) break;
      await take(topic, c);
    }
  }
  for (const s of main) for (const c of found[s.name] || []) { if (have().length >= TARGET) break; if (!seen.has(c.sourceId)) await take(topic, c); }
  /* pass 3: fill-in sites (Openverse) only if the topic is still short */
  for (const s of fill) {
    if (have().length >= TARGET) { st.sources[s.name] = 'done'; continue; }
    await searchSite(s);
    for (const c of found[s.name] || []) { if (have().length >= TARGET) break; await take(topic, c); }
  }
  for (const s of srcs) if (found[s.name]) st.sources[s.name] = 'done';
  st.done = srcs.every(s => st.sources[s.name] === 'done'); st.count = have().length; save();
  const bySrc = {}; for (const x of have()) bySrc[x.source] = (bySrc[x.source] || 0) + 1;
  console.log(`[${i + 1}/${topics.length}] ${topic.name}: ${st.count} pictures ${JSON.stringify(bySrc)}${st.done ? '' : ' (some sites still to do)'}`);
}

(async () => {
  console.log(`Saving to ${OUT}\nSites: ${SOURCES.filter(s => !s.enabled || s.enabled()).map(s => s.name).join(', ')}` + (process.env.PEXELS_KEY ? '' : '  (Pexels: no key yet, skipped)'));
  let stop = false; process.on('SIGINT', () => { if (stop) process.exit(1); stop = true; console.log('\nStopping after this topic… (run again to continue)'); });
  const todo = topics.filter(t => !(state.topics[t.id] && state.topics[t.id].done));
  console.log(`${topics.length - todo.length} topics already finished, ${todo.length} to do.`);
  for (const [i, t] of todo.entries()) { if (stop) break; try { await doTopic(t, i); } catch (e) { console.log(`  ${t.name}: error ${L.hide(e.message)}`); state.errors.push({ topic: t.id, error: L.hide(e.message) }); save(); } }
  save();
  require('./make-pages').build(OUT);
  const mine = credits.filter(c => topics.some(t => t.id === c.topic));
  const count = k => mine.reduce((m, c) => (m[c[k]] = (m[c[k]] || 0) + 1, m), {});
  console.log('\n=== Summary (topics in this run) ===');
  console.log('Pictures kept:', mine.length, ' per site:', count('source'), ' per category:', count('category'));
  console.log('Skipped this run:', runSkips);
  if (offToday.size) console.log('Sites that hit their limit (will continue next run):', Object.fromEntries(offToday));
  if (blockedHosts.size) console.log('Sites NOT on the allowed list (pictures there were skipped):', [...blockedHosts].join(', '));
  const unfinished = topics.filter(t => !(state.topics[t.id] && state.topics[t.id].done)).length;
  console.log(unfinished ? `${unfinished} topics still to finish: run the same command again.` : 'All topics finished.');
  console.log(`Credits page: ${path.join(OUT, 'credits.html')}\nReview gallery: ${path.join(OUT, 'review.html')}`);
})();
