#!/usr/bin/env python3
"""PICS-1 saver. Crops, resizes (<= 1100 px wide) and encodes WebP (<= ~150 KB), and records the picture in a lane folder.
  python3 -I tools/pics-save.py save <lane> <candsdir> <tile#> <pic-id> --alt "neutral caption" [--crop x,y,w,h] [--author NAME]
      --crop is in % of the ORIGINAL picture (x,y = top-left). Writes <lane>/pics/<pic-id>.webp, adds the entry to <lane>/lib.json
      and a line to <lane>/sources.md. Safe to re-run (replaces the same id).
  python3 -I tools/pics-save.py grid <picture file> <out.jpg>
      Draws a 10% grid with numbers, so you can read box coordinates [x,y,w,h] in %.
  python3 -I tools/pics-save.py file <lane> <local picture> <pic-id> --alt ... --source URL --licence L --author A [--crop ...]
      Same as save, for a picture you already downloaded (e.g. a staff photo)."""
import json, os, sys, io, re, urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageOps
UA = {'User-Agent': 'tashbar-learning-pics/1.0 (school picture tool)'}

def opt(a, k, d=None): return a[a.index(k) + 1] if k in a else d

def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()

def encode(im, path, maxw=1100, maxkb=150):
    im = ImageOps.exif_transpose(im).convert('RGB')
    if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    for q in (82, 76, 70, 64, 58, 50, 42):
        b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6)
        if b.tell() <= maxkb * 1024: break
    if b.tell() > 195 * 1024:
        im = im.resize((int(im.width * .8), int(im.height * .8)), Image.LANCZOS); return encode(im, path, maxw, maxkb)
    open(path, 'wb').write(b.getvalue()); return im.size, b.tell()

def record(lane, pid, size, nbytes, alt, source, licence, author):
    os.makedirs(lane + '/pics', exist_ok=True); lp = lane + '/lib.json'
    lib = json.load(open(lp)) if os.path.exists(lp) else {}
    lib[pid] = {'file': pid + '.webp', 'w': size[0], 'h': size[1], 'alt': alt, 'source': source, 'licence': licence, 'author': author}
    json.dump(lib, open(lp, 'w'), ensure_ascii=False, indent=1)
    sp = lane + '/sources.md'; lines = open(sp).read().splitlines() if os.path.exists(sp) else []
    lines = [l for l in lines if not l.startswith('- ' + pid + '.webp ')] + [f'- {pid}.webp | {source} | {licence} | {author}']
    open(sp, 'w').write('\n'.join(lines) + '\n')
    print('saved', pid + '.webp', size, round(nbytes / 1024), 'KB')

def crop(im, c):
    if not c: return im
    x, y, w, h = [float(v) for v in c.split(',')]
    return im.crop((round(im.width * x / 100), round(im.height * y / 100), round(im.width * (x + w) / 100), round(im.height * (y + h) / 100)))

def main():
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    if a[0] == 'grid':
        im = Image.open(a[1]).convert('RGB'); im.thumbnail((900, 900)); d = ImageDraw.Draw(im)
        try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
        except Exception: f = ImageFont.load_default()
        for i in range(1, 10):
            x, y = im.width * i // 10, im.height * i // 10
            d.line([(x, 0), (x, im.height)], fill=(255, 255, 0), width=1); d.line([(0, y), (im.width, y)], fill=(255, 255, 0), width=1)
            d.text((x + 2, 2), str(i * 10), fill=(255, 0, 0), font=f); d.text((2, y + 2), str(i * 10), fill=(255, 0, 0), font=f)
        im.save(a[2], quality=85); print('grid ->', a[2]); return
    alt = opt(a, '--alt');
    if not alt: sys.exit('need --alt')
    if a[0] == 'save':
        lane, cd, n, pid = a[1], a[2], int(a[3]), a[4]
        c = json.load(open(cd + '/cands.json'))[n]
        raw = None
        for u in [c.get('big'), c.get('big2'), c.get('thumb')]:
            if not u: continue
            try: raw = fetch(u); im = Image.open(io.BytesIO(raw)); im.load(); break
            except Exception as e: print('could not get', u[:80], str(e)[:60]); raw = None
        if raw is None: sys.exit('download failed')
        if im.width < 500: print('WARNING: only', im.width, 'px wide: too small, pick another')
        size, nb = encode(crop(im, opt(a, '--crop')), f'{lane}/pics/{pid}.webp' if os.makedirs(lane + '/pics', exist_ok=True) is None else '')
        record(lane, pid, size, nb, alt, c['page'], c['licence'], opt(a, '--author', c['author']))
    elif a[0] == 'file':
        lane, fp, pid = a[1], a[2], a[3]; os.makedirs(lane + '/pics', exist_ok=True)
        size, nb = encode(crop(Image.open(fp), opt(a, '--crop')), f'{lane}/pics/{pid}.webp')
        record(lane, pid, size, nb, alt, opt(a, '--source'), opt(a, '--licence'), opt(a, '--author'))

if __name__ == '__main__': main()
