/* KESER GIRLS 3.0 CHECKS (HoS 2026-11-26: a separate, clean app for girls; nothing goes in without an approver's yes). No browser needed.
   - keser/APPROVERS.json is well formed and names at least one approver (keser-gate reads it from main);
   - Keser Girls 3.0 builds on its own, from keser/ only (it never reads 1.0's src/ or packs/ or 2.0's v2/);
   - the publishing rule is wired: auto-publish hands any keser/ pull request to keser-gate, and keser-gate wants a yes after the newest commit from a listed approver;
   - "Keser Girls only" pictures (girls and women, HoS 2026-11-26) are never named by 1.0 or 2.0;
   - what a girl sees never has the word "bite" or the Divine Name. */
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
module.exports = function () {
  const out = { fails: [], oks: [] }, R = path.join(__dirname, '..', '..'), K = path.join(R, 'keser'), bad = m => out.fails.push('Keser Girls 3.0: ' + m);
  if (!fs.existsSync(K)) { bad('the keser/ folder is missing'); return out; }
  try { const a = JSON.parse(fs.readFileSync(path.join(K, 'APPROVERS.json'), 'utf8'));
    if (!Array.isArray(a.approvers) || !a.approvers.length || a.approvers.some(x => !x || !String(x.name || '').trim())) bad('APPROVERS.json must list at least one approver, each with a name');
  } catch (e) { bad('APPROVERS.json does not read: ' + e.message); }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-'));
  try { cp.execFileSync(process.execPath, [path.join(K, 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: tmp }), stdio: 'pipe' });
    if (!fs.existsSync(path.join(tmp, 'index.html'))) bad('the build made no index.html'); } catch (e) { bad('the build failed: ' + String(e.stderr || e).slice(0, 200)); }
  const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); } else files.push(p); } })(path.join(K, 'app'));   /* vendor/ = outside libraries (three.js, MIT), not our words */
  const code = [path.join(K, 'build.js')].concat(files.filter(f => /\.(js|html|css|json)$/.test(f)));
  code.forEach(f => { const t = fs.readFileSync(f, 'utf8'), rel = path.relative(R, f);
    if (f.endsWith('build.js') && /(\.\.\/)+(src|packs|v2)\/|['"`]\/?(src|packs|v2)\//.test(t)) bad(rel + ' reads from 1.0 or 2.0; Keser Girls 3.0 keeps its own copies');
    if (/\bbites?\b/i.test(t.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, ''))) bad(rel + ' has the word "bite" where a girl could see it');
    if (/יהוה|\bJehovah\b|\bYahweh\b/.test(t)) bad(rel + ' has the Divine Name (use ה׳)'); });
  try { const ap = fs.readFileSync(path.join(R, '.github', 'workflows', 'auto-publish.yml'), 'utf8'), g = fs.readFileSync(path.join(R, '.github', 'workflows', 'keser-gate.yml'), 'utf8');
    if (!/\^keser\/[\s\S]{0,300}keser-gate\.yml\/dispatches/.test(ap)) bad('auto-publish no longer hands keser/ pull requests to keser-gate (it would go in without an approver)');
    if (!/APPROVED FOR KESER/.test(g) || !/created_at > /.test(g) || !/keser\/APPROVERS\.json/.test(g)) bad('keser-gate must accept only a yes from a listed approver posted after the newest commit');
    /* the Keser-only lane (HoS 2026-11-26) may be chosen only for a change inside keser/ and art/ with at least one keser/ file; otherwise the whole kit runs */
    const tw = fs.readFileSync(path.join(R, '.github', 'workflows', 'test.yml'), 'utf8'), rj = fs.readFileSync(path.join(R, 'tests', 'run.js'), 'utf8');
    if (!/grep -q '\^keser\/' <<<"\$files" && ! grep -Eqv '\^\(keser\|art\)\/' <<<"\$files"; then lane=keser/.test(tw) || !/previous_filename/.test(tw) || !/lane=full/.test(tw)) bad('the test check must choose the Keser-only lane only for changes inside keser/ and art/ (renames counted), and the whole kit for anything else');
    if (!tw.includes('if [ "${{ needs.scope.outputs.lane }}" = keser ]; then [ "${{ needs.keser.result }}" = success ]; else [ "${{ needs.kit.result }}" = success ]; fi')) bad('the test check must pass only when the lane it chose passed');
    if (!/LANE === 'keser'/.test(rj) || !/staticChecks\(\);\s*\/\* KESER-ONLY LANE/.test(rj)) bad('tests/run.js: the Keser lane must still run every static check (parse, packs, pictures, conflict marks, art library)');
  } catch (e) { bad('publishing files missing: ' + e.message); }
  /* girls-only pictures stay out of the boys' apps */
  try { const cat = fs.readFileSync(path.join(R, 'art', 'CATALOG.md'), 'utf8'), girls = new Set();
    cat.split('\n').filter(l => /^\|/.test(l) && /Keser Girls only/i.test(l)).forEach(l => { const re = /`(?:pics|sounds|models)\/([^`]+)`/g; let m; while ((m = re.exec(l))) girls.add(m[1]); });
    if (girls.size) { const hits = []; const scan = d => { if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) { if (!/^(dist|node_modules)$/.test(f)) scan(p); } else if (/\.(html|js|json|css)$/.test(f)) { const t = fs.readFileSync(p, 'utf8'); girls.forEach(g => { if (t.includes(g)) hits.push(path.relative(R, p) + ' → ' + g); }); } } };
      ['src', 'packs', 'web', 'v2'].forEach(d => scan(path.join(R, d)));
      hits.forEach(h => bad('a "Keser Girls only" picture is used in a boys\' app: ' + h)); }
  } catch (e) { bad('girls-only picture check failed: ' + String(e).slice(0, 150)); }
  if (!out.fails.length) out.oks.push('Keser Girls 3.0: builds from keser/ only, auto-publish hands its changes to the approval gate, the Keser-only test lane is fenced, girls-only pictures stay out of the boys\' apps, no "bite" / Divine Name');
  fs.rmSync(tmp, { recursive: true, force: true });
  return out;
};
