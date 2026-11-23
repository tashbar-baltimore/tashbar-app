/* 2.0 CHECKS (HoS 2026-11-22: a separate, clean 2.0 app; nothing goes in without an approver's yes). No browser needed.
   - v2/APPROVERS.json is well formed (the gate reads it from main to decide who may approve);
   - 2.0 builds on its own, from v2/ only (it never reads 1.0's src/ or packs/, so a 1.0 change cannot leak into 2.0);
   - the publishing rule is wired: auto-publish hands any v2/ pull request to v2-gate, and v2-gate decides from main only;
   - what a boy sees in 2.0 never has the word "bite" or the Divine Name, and no real student codes are written into it. */
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
module.exports = function () {
  const out = { fails: [], oks: [] }, R = path.join(__dirname, '..', '..'), V2 = path.join(R, 'v2'), bad = m => out.fails.push('2.0: ' + m);
  if (!fs.existsSync(V2)) { bad('the v2/ folder is missing'); return out; }
  try { const a = JSON.parse(fs.readFileSync(path.join(V2, 'APPROVERS.json'), 'utf8'));
    if (!Array.isArray(a.approvers) || !a.approvers.length) bad('APPROVERS.json has no approvers list');
    else a.approvers.forEach((p, i) => { if (!p || typeof p.name !== 'string' || !p.name || typeof p.github !== 'string') bad('APPROVERS.json entry ' + (i + 1) + ' needs a name and a github field');
      else if (p.github && !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(p.github)) bad('APPROVERS.json: "' + p.github + '" is not a GitHub username'); });
  } catch (e) { bad('APPROVERS.json does not read: ' + e.message); }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-'));
  try { cp.execFileSync(process.execPath, [path.join(V2, 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: tmp }), stdio: 'pipe' });
    if (!fs.existsSync(path.join(tmp, 'index.html'))) bad('the build made no index.html'); } catch (e) { bad('the 2.0 build failed: ' + String(e.stderr || e).slice(0, 200)); }
  const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } })(path.join(V2, 'app'));
  const code = [path.join(V2, 'build.js')].concat(files.filter(f => /\.(js|html)$/.test(f)));
  code.forEach(f => { const t = fs.readFileSync(f, 'utf8'), rel = path.relative(R, f);
    if (/(\.\.\/)+(src|packs)\/|['"`]\/?(src|packs)\//.test(t) && f.endsWith('build.js')) bad(rel + ' reads from 1.0 (src/ or packs/); 2.0 keeps its own copies');
    if (/\bbites?\b/i.test(t.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, ''))) bad(rel + ' has the word "bite" where a boy could see it');
    if (/יהוה|\bJehovah\b|\bYahweh\b/.test(t)) bad(rel + ' has the Divine Name (use ה׳)'); });
  try { const ap = fs.readFileSync(path.join(R, '.github', 'workflows', 'auto-publish.yml'), 'utf8'), g = fs.readFileSync(path.join(R, '.github', 'workflows', 'v2-gate.yml'), 'utf8');
    if (!/\^v2\/[\s\S]{0,300}v2-gate\.yml\/dispatches/.test(ap)) bad('auto-publish no longer hands v2/ pull requests to v2-gate (2.0 would go in without an approver)');
    if (!/APPROVERS\.json\?ref=main/.test(g)) bad('v2-gate must read the approvers list from main, not from the pull request');
    if (!/APPROVED/.test(g) || !/commit_id/.test(g)) bad('v2-gate must check an approval of the exact newest commit');
  } catch (e) { bad('publishing files missing: ' + e.message); }
  if (!out.fails.length) out.oks.push('2.0: approvers list well formed, builds from v2/ only, auto-publish hands 2.0 changes to the approval gate, no "bite" / Divine Name');
  fs.rmSync(tmp, { recursive: true, force: true });
  return out;
};
