/* Picture collector: one adapter per picture site. Each search() returns { cands, skipped } where every candidate already
   carries its licence + credit, and skipped is a list of reasons (counted in the report). A candidate may have resolve()
   to fetch extra details (download link, rights) only when it is actually going to be used. */
'use strict';
const L = require('./lib');

const MIN_W = 800;
const NOT_A_PHOTO = /\b(drawing|illustration|painting|engraving|lithograph|diagram|map|chart|poster|sketch|vector|render(ing)?|3d model|sculpture|statue|figurine|specimen|museum)\b/i;

function licenceFromCommons(m) {
  const v = k => (m[k] && m[k].value) || '';
  if (/true/i.test(v('NonFree'))) return { ok: false, reason: 'licence: non-free file' };
  const lic = v('License').toLowerCase(); const short = v('LicenseShortName');
  let r;
  const cc = /^cc-(by(?:-sa)?(?:-nc)?(?:-nd)?)-([\d.]+)/.exec(lic);
  if (cc) r = L.checkLicence(cc[1], cc[2]);
  else if (lic === 'cc0' || /^cc-zero/.test(lic)) r = L.checkLicence('cc0');
  else if (/^pd|public domain/i.test(lic) || /public domain/i.test(short)) r = L.checkLicence('pdm');
  else r = { ok: false, reason: 'licence: not on the allowed list (' + (lic || short || 'unknown') + ')' };
  if (r.ok) { r.name = short || r.name; if (v('LicenseUrl')) r.url = v('LicenseUrl').replace(/^\/\//, 'https://'); }
  return r;
}

const commons = {
  name: 'wikimedia',
  async search(topic) {
    const q = `${topic.query} filetype:bitmap`;
    const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', generator: 'search',
      gsrnamespace: '6', gsrlimit: '40', gsrsearch: q, prop: 'imageinfo', iiprop: 'url|size|mime|sha1|extmetadata', iiurlwidth: '1280',
      iiextmetadatafilter: 'License|LicenseShortName|LicenseUrl|Artist|Restrictions|ImageDescription|Categories|NonFree|Assessments', maxlag: '5' });
    const d = await L.getJSON(url);
    const pages = ((d.query && d.query.pages) || []).sort((a, b) => a.index - b.index);
    const cands = [], skipped = [];
    for (const p of pages) {
      const ii = p.imageinfo && p.imageinfo[0]; if (!ii) continue; const m = ii.extmetadata || {}; const v = k => (m[k] && m[k].value) || '';
      if (!/image\/(jpeg|png)/.test(ii.mime)) { skipped.push('not a photo (file type)'); continue; }
      if (ii.width < MIN_W) { skipped.push('too small (under 800px wide)'); continue; }
      const lic = licenceFromCommons(m); if (!lic.ok) { skipped.push(lic.reason); continue; }
      if (v('Restrictions')) { skipped.push('licence: extra restrictions (' + v('Restrictions') + ')'); continue; }
      const title = p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''); const desc = L.stripHtml(v('ImageDescription')); const cats = v('Categories');
      const bad = L.unsafeWordFor(topic, title, desc, cats); if (bad) { skipped.push('not for children / off-topic word: ' + bad); continue; }
      if (!L.onTopic(topic, title, desc, cats)) { skipped.push('not about the topic'); continue; }
      if (NOT_A_PHOTO.test(title + ' ' + cats.replace(/\|/g, ' '))) { skipped.push('not a photo (drawing, map, statue…)'); continue; }
      cands.push({ source: 'wikimedia', sourceId: 'commons:' + ii.sha1, title, pageUrl: ii.descriptionurl, author: L.stripHtml(v('Artist')) || 'Wikimedia Commons contributor',
        licence: lic.name, licenceUrl: lic.url, downloadUrl: ii.width > 1280 && ii.thumburl ? ii.thumburl.split('?')[0] : ii.url.split('?')[0],
        rank: /featured|quality/.test(v('Assessments')) ? 0 : 1 });
    }
    cands.sort((a, b) => a.rank - b.rank); /* Featured / Quality images first */
    return { cands, skipped };
  },
};

const openverse = {
  name: 'openverse',
  fallback: true, /* test run (10 topics): its matches were the loosest, so it only fills topics the other sites leave short */
  quota(res) {
    const sus = res.headers.get('x-ratelimit-available-anon_sustained'), burst = res.headers.get('x-ratelimit-available-anon_burst');
    if (res.status === 429 && sus !== null && Number(sus) <= 0) throw new L.QuotaError('api.openverse.org', 'Openverse daily limit reached (200 searches a day without an account)');
    if (burst !== null && Number(burst) <= 1) L.hostWaits['api.openverse.org'] = Date.now() + 61000; /* per-minute limit: wait it out */
  },
  async search(topic) {
    const url = 'https://api.openverse.org/v1/images/?' + new URLSearchParams({ q: topic.query, page_size: '20', mature: 'false',
      license_type: 'commercial,modification', excluded_source: 'wikimedia', category: 'photograph' });
    const d = await L.getJSON(url, { quotaCheck: openverse.quota, tries: 3 });
    const cands = [], skipped = [];
    for (const r of d.results || []) {
      if (r.mature) { skipped.push('not for children (marked mature)'); continue; }
      if ((r.width || 0) < MIN_W) { skipped.push('too small (under 800px wide)'); continue; }
      const lic = L.checkLicence(r.license, r.license_version); if (!lic.ok) { skipped.push(lic.reason); continue; }
      const tags = (r.tags || []).map(t => t.name).join(' ');
      const bad = L.unsafeWordFor(topic, r.title, tags); if (bad) { skipped.push('not for children / off-topic word: ' + bad); continue; }
      if (!L.onTopic(topic, r.title)) { skipped.push('not about the topic'); continue; } /* Flickr tags are loose: the title must name it */
      if (NOT_A_PHOTO.test(r.title || '')) { skipped.push('not a photo (drawing, map, statue…)'); continue; }
      cands.push({ source: 'openverse', provider: r.provider, sourceId: 'openverse:' + (r.foreign_landing_url || r.id), title: r.title || topic.name,
        pageUrl: r.foreign_landing_url, author: r.creator || 'unknown', licence: lic.name, licenceUrl: r.license_url || lic.url, downloadUrl: r.url });
    }
    return { cands, skipped };
  },
};

const PIXABAY_CACHE_MS = 24 * 3600e3; /* Pixabay asks API users to cache search results for 24 hours */
const pixabay = {
  name: 'pixabay',
  enabled: () => !!process.env.PIXABAY_KEY,
  quota(res) {
    const rem = Number(res.headers.get('x-ratelimit-remaining')), reset = Number(res.headers.get('x-ratelimit-reset'));
    if (!Number.isNaN(rem) && rem <= 5) L.hostWaits['pixabay.com'] = Date.now() + (Math.max(reset, 1) + 1) * 1000;
  },
  async search(topic, ctx) {
    const params = { q: topic.query.slice(0, 100), image_type: 'photo', safesearch: 'true', per_page: '50', min_width: String(MIN_W), order: 'popular' };
    const cacheFile = L.path.join(ctx.cacheDir, 'pixabay-' + L.slug(topic.id) + '.json');
    let d = L.readJSON(cacheFile, null);
    if (!d || Date.now() - d.at > PIXABAY_CACHE_MS) {
      const url = 'https://pixabay.com/api/?' + new URLSearchParams({ key: process.env.PIXABAY_KEY, ...params });
      d = { at: Date.now(), data: await L.getJSON(url, { quotaCheck: pixabay.quota }) }; L.writeJSONAtomic(cacheFile, d);
    }
    const cands = [], skipped = [];
    for (const h of d.data.hits || []) {
      if (h.imageWidth < MIN_W) { skipped.push('too small (under 800px wide)'); continue; }
      const bad = L.unsafeWordFor(topic, h.tags); if (bad) { skipped.push('not for children / off-topic word: ' + bad); continue; }
      if (!L.onTopic(topic, h.tags)) { skipped.push('not about the topic'); continue; }
      cands.push({ source: 'pixabay', sourceId: 'pixabay:' + h.id, title: h.tags, pageUrl: h.pageURL, author: h.user,
        licence: 'Pixabay Content License', licenceUrl: 'https://pixabay.com/service/license-summary/', downloadUrl: h.largeImageURL });
    }
    return { cands, skipped };
  },
};

/* Ready for when Pexels opens keys again: set PEXELS_KEY and it joins automatically. */
const pexels = {
  name: 'pexels',
  enabled: () => !!process.env.PEXELS_KEY,
  quota(res) { const rem = res.headers.get('x-ratelimit-remaining'); if (rem !== null && Number(rem) <= 0) throw new L.QuotaError('api.pexels.com', 'Pexels monthly limit reached'); },
  async search(topic) {
    const url = 'https://api.pexels.com/v1/search?' + new URLSearchParams({ query: topic.query, per_page: '30' });
    const d = await L.getJSON(url, { headers: { Authorization: process.env.PEXELS_KEY }, quotaCheck: pexels.quota });
    const cands = [], skipped = [];
    for (const p of d.photos || []) {
      if (p.width < MIN_W) { skipped.push('too small (under 800px wide)'); continue; }
      const bad = L.unsafeWordFor(topic, p.alt); if (bad) { skipped.push('not for children / off-topic word: ' + bad); continue; }
      if (!L.onTopic(topic, p.alt)) { skipped.push('not about the topic'); continue; }
      cands.push({ source: 'pexels', sourceId: 'pexels:' + p.id, title: p.alt || topic.name, pageUrl: p.url, author: p.photographer,
        licence: 'Pexels License', licenceUrl: 'https://www.pexels.com/license/', downloadUrl: p.src.large2x });
    }
    return { cands, skipped };
  },
};

/* NASA: only for topics marked "nasa" (space). NASA's own pictures are public domain; anything credited to others is skipped. */
const nasa = {
  name: 'nasa',
  only: 'nasa',
  async search(topic) {
    const d = await L.getJSON('https://images-api.nasa.gov/search?' + new URLSearchParams({ q: topic.query, media_type: 'image', page_size: '30' }));
    const cands = [], skipped = [];
    for (const it of (d.collection && d.collection.items) || []) {
      const m = (it.data && it.data[0]) || {}; const who = [m.photographer, m.secondary_creator].filter(Boolean).join(', ');
      const text = [m.title, m.description, who].join(' ');
      if (/©|copyright|courtesy of|getty|reuters|associated press|\bAP\b/i.test(text)) { skipped.push('licence: credited to someone other than NASA'); continue; }
      if (/\b(illustration|artist'?s? (concept|impression|rendering)|animation|graphic|logo|insignia)\b/i.test((m.title || '') + ' ' + (m.keywords || []).join(' '))) { skipped.push('not a photo (drawing, map, statue…)'); continue; }
      const bad = L.unsafeWordFor(topic, m.title, m.description, (m.keywords || []).join(' ')); if (bad) { skipped.push('not for children / off-topic word: ' + bad); continue; }
      if (!L.onTopic(topic, m.title, m.description, (m.keywords || []).join(' '))) { skipped.push('not about the topic'); continue; }
      cands.push({ source: 'nasa', sourceId: 'nasa:' + m.nasa_id, title: m.title, pageUrl: 'https://images.nasa.gov/details/' + encodeURIComponent(m.nasa_id),
        author: who || ('NASA' + (m.center ? ' / ' + m.center : '')), licence: 'Public domain (NASA media)', licenceUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
        async resolve() {
          const files = await L.getJSON(it.href); const list = Array.isArray(files) ? files : [];
          const pick = ['~large.jpg', '~medium.jpg', '~orig.jpg', '~large.png', '~orig.png'].map(s => list.find(u => u.endsWith(s))).find(Boolean);
          if (!pick) return 'no usable picture file';
          this.downloadUrl = pick.replace(/^http:/, 'https:').replace(/ /g, '%20'); return null;
        } });
    }
    return { cands, skipped };
  },
};

/* Library of Congress: only for topics marked "loc" (history). Each item's own rights statement must say it is free to use. */
const loc = {
  name: 'loc',
  only: 'loc',
  async search(topic) {
    const d = await L.getJSON('https://www.loc.gov/photos/?' + new URLSearchParams({ q: topic.query, fo: 'json', c: '25', fa: 'online-format:image' }));
    const cands = [], skipped = [];
    for (const r of d.results || []) {
      const imgs = (r.image_url || []).map(u => ({ u: u.split('#')[0], w: Number((/[#&]w=(\d+)/.exec(u) || [])[1] || 0) })).filter(x => /\.jpe?g$/i.test(x.u)).sort((a, b) => b.w - a.w);
      if (!imgs.length) { skipped.push('no usable picture file'); continue; }
      if (imgs[0].w < MIN_W) { skipped.push('too small (under 800px wide)'); continue; }
      const title = Array.isArray(r.title) ? r.title[0] : r.title;
      const bad = L.unsafeWordFor(topic, title, (r.subject || []).join(' ')); if (bad) { skipped.push('not for children / off-topic word: ' + bad); continue; }
      const itemUrl = String(r.id || r.url).replace(/^http:/, 'https:');
      cands.push({ source: 'loc', sourceId: 'loc:' + itemUrl, title, pageUrl: itemUrl, author: 'Library of Congress', downloadUrl: imgs[0].u,
        async resolve() {
          const it = (await L.getJSON(itemUrl + (itemUrl.includes('?') ? '&' : '?') + 'fo=json')).item || {};
          const rights = [it.rights_advisory, ...(Array.isArray(it.rights) ? it.rights : [it.rights])].filter(Boolean).join(' ');
          if (!/no known restrictions|public domain|no known copyright/i.test(rights)) return 'licence: Library of Congress rights not cleared';
          this.licence = /public domain/i.test(rights) ? 'Public domain (Library of Congress)' : 'No known restrictions on publication (Library of Congress)';
          this.licenceUrl = 'https://www.loc.gov/legal/understanding-copyright/';
          const names = it.contributor_names || it.creator || it.contributors; if (names && names.length) this.author = [].concat(names)[0];
          return null;
        } });
    }
    return { cands, skipped };
  },
};

/* The order here is the order pictures are taken in. */
const SOURCES = [commons, openverse, pixabay, pexels, nasa, loc];
module.exports = { SOURCES, MIN_W };
