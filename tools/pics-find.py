#!/usr/bin/env python3
"""PICS-1 finder: search free picture sources, drop anything whose words break the picture rules, save a numbered contact sheet.
Usage: python3 -I tools/pics-find.py <outdir> "<search words>" [--src pixabay,loc,nasa,openverse,commons] [--n 24] [--illus] [--allow temple,cross]
  --allow un-bans single words for one search (e.g. "temple" for the Beis Hamikdash). You still LOOK at every picture.
  Writes <outdir>/cands.json (one entry per tile number: url, big, page, licence, author, title, tags, w, h, src)
  and <outdir>/sheet.jpg (numbered tiles). LOOK at the sheet before choosing. Then: tools/pics-save.py.
Keys come from the environment (PIXABAY_KEY, PEXELS_KEY); they are never printed.
Sources, best first: pixabay (safesearch on), pexels (if PEXELS_KEY), loc (no known restrictions only), nasa (public domain),
openverse (cc0 / pdm / by / by-sa only), commons (slow: pauses 12 s; standard thumbnail sizes only)."""
import json, os, re, sys, time, io, urllib.request, urllib.parse
from PIL import Image, ImageDraw, ImageFont

BAN = r"\b(wom[ae]n|girls?|lady|ladies|female|mother|mom|mum|bride|wife|daughter|sister|grandmother|grandma|nun|actress|bikini|swimsuit|lingerie|model posing|sexy|nude|naked|kiss|couple|church|cathedral|chapel|cross|crucifix|jesus|christ|christian|christmas|xmas|easter|santa|nativity|angel|saint|bible verse|mosque|islam|muslim|allah|ramadan|hindu|temple|buddha|buddhist|shiva|ganesh|pagoda|shrine|idol|pagan|cult|halloween|pumpkin carving|witch|ghost|zombie|demon|devil|skull|vampire|dragon|unicorn|fairy|elf|monster|fantasy|mermaid|beer|wine|whisky|whiskey|vodka|alcohol|cocktail|liquor|champagne|bar counter|pub|brewery|cigarette|smoking|tobacco|pork|pig roast|bacon|ham|sausage|shrimp|prawn|lobster|crab dish|oyster|clam|sushi|cheeseburger|gun|rifle|weapon|blood|tattoo|yoga|zodiac|horoscope|astrology|tarot|valentine|lgbt|pride flag|rainbow flag|party|disco|nightclub|casino|gambling)\b"
BANRX = re.compile(BAN, re.I)
UA = {'User-Agent': 'tashbar-learning-pics/1.0 (school picture tool)'}

def get(url, headers=None, raw=False, tries=3):
    for t in range(tries):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={**UA, **(headers or {})}), timeout=40).read()
            return r if raw else json.loads(r)
        except Exception as e:
            if t == tries - 1: raise
            time.sleep(3 + 5 * t)

def pixabay(q, n, illus):
    k = os.environ.get('PIXABAY_KEY');
    if not k: return []
    u = 'https://pixabay.com/api/?' + urllib.parse.urlencode({'key': k, 'q': q[:100], 'image_type': 'illustration' if illus else 'photo', 'safesearch': 'true', 'per_page': max(3, min(200, n * 2)), 'order': 'popular'})
    out = []
    for h in get(u).get('hits', []):
        out.append({'src': 'pixabay', 'thumb': h['webformatURL'], 'big': h.get('largeImageURL') or h['webformatURL'], 'page': h['pageURL'],
                    'licence': 'Pixabay Content License', 'author': h.get('user') or 'Pixabay', 'title': h.get('tags', ''), 'tags': h.get('tags', ''), 'w': h.get('imageWidth'), 'h': h.get('imageHeight')})
    return out

def pexels(q, n, illus):
    k = os.environ.get('PEXELS_KEY')
    if not k: return []
    d = get('https://api.pexels.com/v1/search?' + urllib.parse.urlencode({'query': q, 'per_page': min(80, n * 2)}), {'Authorization': k})
    return [{'src': 'pexels', 'thumb': p['src']['medium'], 'big': p['src']['large2x'], 'page': p['url'], 'licence': 'Pexels License', 'author': p.get('photographer') or 'Pexels',
             'title': p.get('alt', ''), 'tags': p.get('alt', ''), 'w': p.get('width'), 'h': p.get('height')} for p in d.get('photos', [])]

def loc(q, n, illus):
    d = get('https://www.loc.gov/photos/?' + urllib.parse.urlencode({'q': q, 'fo': 'json', 'c': min(100, n * 3)}))
    out = []
    for r in d.get('results', []):
        ra = ' '.join(r.get('rights_advisory') or []) if isinstance(r.get('rights_advisory'), list) else str(r.get('rights_advisory') or '')
        ims = [i.split('#')[0] for i in (r.get('image_url') or [])]
        if not ims: continue
        if 'no known restriction' not in ra.lower() and 'no known restriction' not in json.dumps(r.get('rights') or '').lower(): continue
        big = re.sub(r'/full/[^/]+/', '/full/pct:100/', ims[-1]) if 'iiif' in ims[-1] else ims[-1]
        out.append({'src': 'loc', 'thumb': ims[0], 'big': big, 'page': r.get('url') or r.get('id'), 'licence': 'No known restrictions (Library of Congress)',
                    'author': ', '.join(r.get('contributor') or []) or 'Library of Congress', 'title': r.get('title', ''), 'tags': ' '.join(r.get('subject') or []), 'w': None, 'h': None})
    return out

def nasa(q, n, illus):
    d = get('https://images-api.nasa.gov/search?' + urllib.parse.urlencode({'q': q, 'media_type': 'image', 'page_size': min(100, n * 2)}))
    out = []
    for it in d.get('collection', {}).get('items', []):
        da = (it.get('data') or [{}])[0]; nid = da.get('nasa_id', '')
        thumb = next((l['href'] for l in it.get('links', []) if l.get('rel') == 'preview'), None)
        if not thumb: continue
        base = thumb.rsplit('~', 1)[0]
        out.append({'src': 'nasa', 'thumb': thumb, 'big': base + '~large.jpg', 'big2': base + '~orig.jpg', 'page': 'https://images.nasa.gov/details/' + urllib.parse.quote(nid), 'licence': 'Public domain (NASA)',
                    'author': da.get('photographer') or da.get('center') or 'NASA', 'title': da.get('title', ''), 'tags': ' '.join(da.get('keywords') or []) + ' ' + (da.get('description') or '')[:400], 'w': None, 'h': None})
    return out

def openverse(q, n, illus):
    d = get('https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license': 'cc0,pdm,by,by-sa', 'page_size': min(20, n * 2)}))
    L = {'cc0': 'CC0', 'pdm': 'Public domain', 'by': 'CC BY', 'by-sa': 'CC BY-SA'}
    return [{'src': 'openverse/' + (r.get('source') or ''), 'thumb': r['thumbnail'], 'big': r['url'], 'page': r.get('foreign_landing_url') or r['url'],
             'licence': (L.get(r.get('license'), r.get('license', '')) + ' ' + (r.get('license_version') or '')).strip(), 'author': r.get('creator') or 'unknown',
             'title': r.get('title') or '', 'tags': ' '.join(t.get('name', '') for t in (r.get('tags') or [])), 'w': r.get('width'), 'h': r.get('height')} for r in d.get('results', [])]

def commons(q, n, illus):
    time.sleep(12)
    d = get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': 'filetype:bitmap ' + q, 'gsrnamespace': 6,
            'gsrlimit': min(30, n), 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 330}))
    out = []
    for p in (d.get('query', {}).get('pages', {}) or {}).values():
        ii = (p.get('imageinfo') or [{}])[0]; md = ii.get('extmetadata', {})
        lic = (md.get('LicenseShortName', {}) or {}).get('value', '')
        if not re.search(r'public domain|^pd|cc0|cc[ -]by(-sa)?[ -]?\d|^cc by', lic, re.I) or re.search(r'nc|nd', lic, re.I): continue
        thumb = ii.get('thumburl');
        if not thumb: continue
        out.append({'src': 'commons', 'thumb': thumb, 'big': re.sub(r'/\d+px-', '/960px-', thumb), 'page': ii.get('descriptionurl'), 'licence': lic,
                    'author': re.sub('<[^>]+>', '', (md.get('Artist', {}) or {}).get('value', '')).strip()[:120] or 'unknown',
                    'title': p.get('title', ''), 'tags': re.sub('<[^>]+>', '', (md.get('ImageDescription', {}) or {}).get('value', ''))[:400] + ' ' + re.sub('<[^>]+>', '', (md.get('Categories', {}) or {}).get('value', '')),
                    'w': ii.get('width'), 'h': ii.get('height')})
    return out

SRC = {'pixabay': pixabay, 'pexels': pexels, 'loc': loc, 'nasa': nasa, 'openverse': openverse, 'commons': commons}

def main():
    a = sys.argv[1:]
    if len(a) < 2: print(__doc__); sys.exit(1)
    out, q = a[0], a[1]; srcs = 'pixabay,pexels'; n = 24; illus = '--illus' in a
    if '--src' in a: srcs = a[a.index('--src') + 1]
    if '--n' in a: n = int(a[a.index('--n') + 1])
    allow = set(a[a.index('--allow') + 1].lower().split(',')) if '--allow' in a else set()
    os.makedirs(out, exist_ok=True); cands = []; dropped = 0; per = []
    for s in srcs.split(','):
        cands = []
        try: got = SRC[s](q, n, illus)
        except Exception as e: print('source', s, 'failed:', str(e)[:120]); got = []
        for c in got:
            hits = {m.group(0).lower() for m in BANRX.finditer(' '.join([c.get('title', ''), c.get('tags', '')]))}
            if hits - allow: dropped += 1; continue
            cands.append(c)
        per.append(cands)
    cands = []
    while len(cands) < n and any(per):
        for lst in per:
            if lst and len(cands) < n: cands.append(lst.pop(0))
    tiles = []
    for i, c in enumerate(cands):
        try:
            try: raw = get(c['thumb'], raw=True, tries=2)
            except Exception: raw = get(c['big'], raw=True, tries=1)
            im = Image.open(io.BytesIO(raw)).convert('RGB'); c['tw'], c['th'] = im.size; tiles.append((i, im))
        except Exception as e: tiles.append((i, None))
    json.dump(cands, open(out + '/cands.json', 'w'), ensure_ascii=False, indent=1)
    if not cands: print('0 candidates (', dropped, 'dropped by the picture rules)'); return
    T = 300; cols = 4; rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * T, rows * (T + 22)), 'white'); dr = ImageDraw.Draw(sheet)
    try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
    except Exception: f = ImageFont.load_default()
    for k, (i, im) in enumerate(tiles):
        x, y = (k % cols) * T, (k // cols) * (T + 22)
        if im:
            im.thumbnail((T - 6, T - 6)); sheet.paste(im, (x + 3, y + 3))
        c = cands[i]; dr.rectangle([x, y + T, x + T, y + T + 22], fill='#222')
        dr.text((x + 4, y + T + 2), f"#{i} {c['src'][:12]} {c.get('w') or ''}x{c.get('h') or ''}", fill='yellow', font=f)
    sheet.save(out + '/sheet.jpg', quality=82)
    print(len(cands), 'candidates (', dropped, 'dropped by the picture rules ) ->', out + '/sheet.jpg')
    for i, c in enumerate(cands): print(f"#{i} [{c['src']}] {c['title'][:70]} | {c['licence']} | {c['author'][:40]}")

if __name__ == '__main__': main()
