/* Picture collector: shared helpers (polite HTTP, file safety, licence + content checks). No npm packages needed (Node 18+). */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const USER_AGENT = 'TashbarLearningPictureCollector/1.0 (https://tashbar-learning-live.web.app; educational picture library for a school app)';

/* Only these hosts are ever contacted. Anything else is reported, never worked around. */
const ALLOWED_HOSTS = new Set(['pixabay.com', 'cdn.pixabay.com', 'api.pexels.com', 'images.pexels.com', 'www.loc.gov', 'tile.loc.gov',
  'images-api.nasa.gov', 'images-assets.nasa.gov', 'commons.wikimedia.org', 'upload.wikimedia.org', 'thumb.wikimedia.org',
  'api.openverse.org', 'live.staticflickr.com']);

/* Minimum pause between requests to the same host (ms). Sites' published limits are well above these. */
const HOST_GAP = { 'commons.wikimedia.org': 1000, 'upload.wikimedia.org': 1000, 'thumb.wikimedia.org': 1000, 'api.openverse.org': 3200,
  'pixabay.com': 700, 'cdn.pixabay.com': 500, 'images-api.nasa.gov': 1000, 'images-assets.nasa.gov': 1000, 'www.loc.gov': 3000,
  'tile.loc.gov': 1500, 'live.staticflickr.com': 700, 'api.pexels.com': 1000, 'images.pexels.com': 500 };

/* Hide any API key that might appear in a URL or message. */
const SECRETS = [process.env.PIXABAY_KEY, process.env.PEXELS_KEY].filter(Boolean);
function hide(s) { s = String(s).replace(/([?&]key=)[^&\s]+/gi, '$1HIDDEN'); for (const k of SECRETS) s = s.split(k).join('HIDDEN'); return s; }

class BlockedHostError extends Error { constructor(host) { super('host not on the allowed list: ' + host); this.host = host; } }
class QuotaError extends Error { constructor(host, msg) { super(msg); this.host = host; } }

const lastHit = {}; const sleep = ms => new Promise(r => setTimeout(r, ms));
const hostWaits = {}; /* a host can ask us to wait (rate-limit headers); honoured before the next request */

async function politeFetch(url, { headers = {}, tries = 4, maxBytes = 30e6, quotaCheck } = {}) {
  const u = new URL(url); const host = u.hostname;
  if (u.protocol !== 'https:') { u.protocol = 'https:'; url = u.toString(); }
  if (!ALLOWED_HOSTS.has(host)) throw new BlockedHostError(host);
  for (let attempt = 1; ; attempt++) {
    const gap = HOST_GAP[host] || 1000; const wait = Math.max((lastHit[host] || 0) + gap, hostWaits[host] || 0) - Date.now();
    if (wait > 0) await sleep(wait);
    lastHit[host] = Date.now();
    let res;
    try { res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers }, redirect: 'follow', signal: AbortSignal.timeout(60000) }); }
    catch (e) { if (attempt >= tries) throw new Error(hide('network error ' + (e.cause && e.cause.code || e.message) + ' for ' + url)); await sleep(2000 * 2 ** attempt); continue; }
    const fin = new URL(res.url || url).hostname; if (!ALLOWED_HOSTS.has(fin)) throw new BlockedHostError(fin);
    if (quotaCheck) quotaCheck(res); /* may throw QuotaError, may set hostWaits */
    if (res.status === 429 || res.status === 503) {
      const ra = Number(res.headers.get('retry-after')); const ms = ra > 0 ? Math.min(ra, 600) * 1000 : 5000 * 2 ** attempt;
      if (attempt >= tries) throw new QuotaError(host, `HTTP ${res.status} from ${host} after ${tries} polite retries`);
      console.log(`  …${host} asked us to slow down; waiting ${Math.round(ms / 1000)}s`); hostWaits[host] = Date.now() + ms; continue;
    }
    if (!res.ok) throw new Error(hide(`HTTP ${res.status} for ${url}`));
    const len = Number(res.headers.get('content-length') || 0); if (len > maxBytes) throw new Error(`file too big (${len} bytes)`);
    const buf = Buffer.from(await res.arrayBuffer()); if (buf.length > maxBytes) throw new Error(`file too big (${buf.length} bytes)`);
    return { res, buf };
  }
}
async function getJSON(url, opts) { const { buf } = await politeFetch(url, opts); return JSON.parse(buf.toString('utf8')); }

/* Image type + pixel size from the file itself (JPEG, PNG, WebP, GIF). Returns null if not a recognised image. */
function imageInfo(b) {
  if (b.length > 24 && b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') return { type: 'png', w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') return { type: 'gif', w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const c = b.toString('ascii', 12, 16);
    if (c === 'VP8 ') return { type: 'webp', w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (c === 'VP8L') { const n = b.readUInt32LE(21); return { type: 'webp', w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
    if (c === 'VP8X') return { type: 'webp', w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1]; if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { type: 'jpg', h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return null;
}

/* ---------- licences: keep only ones that allow reuse (incl. commercial) AND changes ---------- */
function ccUrl(code, ver) { return code === 'cc0' ? 'https://creativecommons.org/publicdomain/zero/1.0/' : code === 'pdm' ? 'https://creativecommons.org/publicdomain/mark/1.0/' : `https://creativecommons.org/licenses/${code}/${ver || '4.0'}/`; }
/* Returns {ok, name, url, reason}. Non-commercial (NC) and no-derivatives (ND) are refused unless explicitly allowed. */
function checkLicence(code, ver, { allowNC = false, allowND = false } = {}) {
  code = String(code || '').toLowerCase().replace(/^cc[- ]/, '').replace(/\s+/g, '-');
  if (code === 'cc0' || code === 'zero' || code === '0') return { ok: true, name: 'CC0 1.0 (public domain dedication)', url: ccUrl('cc0') };
  if (code === 'pdm' || code === 'pd' || code.startsWith('public-domain') || code.startsWith('pd-')) return { ok: true, name: 'Public domain', url: ccUrl('pdm') };
  if (/^by(-sa)?(-nc)?(-nd)?$|^by-nc-sa$|^by-nd$/.test(code)) {
    if (code.includes('nc') && !allowNC) return { ok: false, reason: 'licence: non-commercial (NC)' };
    if (code.includes('nd') && !allowND) return { ok: false, reason: 'licence: no-derivatives (ND)' };
    return { ok: true, name: `CC ${code.toUpperCase()} ${ver || ''}`.trim(), url: ccUrl(code, ver) };
  }
  return { ok: false, reason: 'licence: not on the allowed list (' + (code || 'unknown') + ')' };
}

/* ---------- content safety: the sites' own safe-search is on; this is a second, word-based net ----------
   Any of these words in the title, description, tags or categories → the picture is skipped. A person still reviews
   the gallery (review.html) before pictures go into lessons. */
const BLOCK_WORDS = [
  /* adult / immodest */ 'nude', 'nudity', 'naked', 'topless', 'erotic', 'sexy', 'sex', 'lingerie', 'bikini', 'swimsuit', 'swimwear', 'underwear', 'bra', 'model', 'fashion', 'pin-up', 'pinup', 'kiss', 'kissing', 'romance', 'romantic', 'bride', 'woman', 'women', 'girl', 'girls', 'lady', 'ladies', 'female model', 'people', 'person', 'portrait', 'selfie', 'dress', 'mating', 'breeding', 'genitals', 'penis', 'vagina', 'breast', 'buttocks',
  /* violence / death */ 'blood', 'bloody', 'gore', 'dead', 'death', 'corpse', 'carcass', 'roadkill', 'kill', 'killed', 'killing', 'hunting', 'hunter', 'hunted', 'slaughter', 'butcher', 'skinned', 'taxidermy', 'injured', 'injury', 'wound', 'execution', 'weapon', 'gun', 'rifle', 'pistol', 'bullet', 'bomb', 'skull', 'skeleton', 'bones', 'horror', 'zombie', 'scary', 'halloween', 'demon', 'devil', 'witch', 'monster',
  /* not for a frum school */ 'church', 'cathedral', 'chapel', 'crucifix', 'jesus', 'christ', 'christian', 'christmas', 'easter', 'santa', 'nativity', 'angel', 'saint', 'monk', 'nun', 'priest', 'pope', 'mosque', 'buddha', 'buddhist', 'hindu', 'idol', 'pagoda', 'deity', 'god', 'goddess', 'swastika', 'nazi', 'communist', 'communism', 'soviet', 'hammer and sickle', 'propaganda',
  'pig', 'pigs', 'pork', 'bacon', 'ham', 'sausage', 'shellfish dish', 'seafood dish', 'lobster dinner',
  'beer', 'wine glass', 'cocktail', 'alcohol', 'whiskey', 'vodka', 'pub', 'drunk', 'cigarette', 'cigar', 'smoking', 'tobacco', 'drug', 'drugs', 'marijuana', 'cannabis', 'casino', 'gambling', 'tattoo', 'party',
  /* not a real photo of the thing */ 'cartoon', 'clipart', 'clip art', 'logo', 'icon', 'coat of arms', 'heraldry', 'stamp', 'banknote', 'coin', 'meme', 'screenshot', 'ai generated', 'ai-generated', 'midjourney', 'stable diffusion', 'dall-e', 'fantasy', 'toy', 'plush', 'costume', 'mascot',
];
const BLOCK_RE = new RegExp('(^|[^a-z])(' + BLOCK_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[\\s_-]+')).join('|') + ')(?=$|[^a-z])', 'i');
function unsafeWord(...texts) {
  const t = texts.filter(Boolean).join(' ').replace(/<[^>]+>/g, ' ').replace(/_/g, ' ');
  const m = BLOCK_RE.exec(t); return m ? m[2].toLowerCase() : null;
}
/* A blocked word that is part of the topic's own name does not count (e.g. "Dead" in Dead Sea, "ram" the sheep),
   but every other blocked word still does ("Hammer and Sickle" is still blocked for the topic "hammer"). */
function unsafeWordFor(topic, ...texts) {
  const t = texts.filter(Boolean).join(' ').replace(/<[^>]+>/g, ' ').replace(/_/g, ' ');
  const own = (topic.name + ' ' + topic.query).toLowerCase();
  for (const w of topic.avoid || []) if (new RegExp('(^|[^a-z])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z])', 'i').test(t)) return w; /* per-topic mix-ups, e.g. the ship "USS Fort McHenry" */
  const re = new RegExp(BLOCK_RE.source, 'gi'); let m;
  while ((m = re.exec(t))) { const w = m[2].toLowerCase(); if (!new RegExp('(^|[^a-z])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z])').test(own)) return w; re.lastIndex = m.index + 1; }
  return null;
}

/* On-topic check: every main word of the topic's name must appear in the picture's own words (title, tags, description).
   Generic words like "tree" or "flower" are not required, and a plural or a scientific name in the topic's "also" list counts. */
const GENERIC = new Set(['tree', 'plant', 'flower', 'fruit', 'the', 'of', 'a', 'and', 'on', 'in', 'from', 'space', 'planet', 'animal', 'bird', 'insect', 'tool']);
function onTopic(topic, ...texts) {
  const t = ' ' + texts.filter(Boolean).join(' ').replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
  const alts = [topic.name, ...(topic.also || [])];
  return alts.some(name => {
    const words = name.toLowerCase().replace(/['’]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 1 && !GENERIC.has(w));
    if (!words.length) return true;
    const split = w => { for (let k = 3; k <= w.length - 3; k++) if (t.includes(' ' + w.slice(0, k) + ' ' + w.slice(k) + ' ')) return true; return false; }; /* "honey bee" counts for "honeybee" */
    return words.every(w => [w, w + 's', w + 'es', w.replace(/y$/, 'ies'), w.replace(/s$/, '')].some(v => t.includes(' ' + v + ' ')) || split(w));
  });
}

function stripHtml(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(); }
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function writeJSONAtomic(file, data) { const tmp = file + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(data, null, 1)); fs.renameSync(tmp, file); }
function readJSON(file, dflt) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return dflt; throw e; } }
function slug(s) { return String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60); }

module.exports = { USER_AGENT, ALLOWED_HOSTS, politeFetch, getJSON, imageInfo, checkLicence, ccUrl, unsafeWord, unsafeWordFor, stripHtml, sha256,
  writeJSONAtomic, readJSON, slug, onTopic, hide, sleep, hostWaits, BlockedHostError, QuotaError, path };
