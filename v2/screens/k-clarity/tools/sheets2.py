"""Makes one picture sheet per game and size from the pictures shoot.js took:
   v2/screens/k-shapes-graphics/<game>/<before|after>-<chromebook|phone>.jpg  (start, lesson, find, drop, mistake, end).
   Run: python3 v2/screens/k-shapes-graphics/sheets.py <folder with shoot.js pictures> [<folder> ...]"""
import sys, os, re, glob
from PIL import Image, ImageDraw, ImageFont
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
WANT = [('start', ['start']), ('lesson', ['tap', 'learn', 'count', 'counting']), ('find', ['find', 'bonus']), ('wrong move', ['wrong', 'drop']), ('mistake', ['mistake']), ('end', ['end'])]
try: FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except Exception: FONT = ImageFont.load_default()
shots = {}
for d in sys.argv[1:]:
    for f in sorted(glob.glob(os.path.join(d, '*.png'))):
        m = re.match(r'(before|after)-(.+)-(chromebook|phone)-(\d+)-([a-z-]+)\.png$', os.path.basename(f))
        if m: shots.setdefault((m.group(2), m.group(1), m.group(3)), []).append((m.group(5), f))
for (game, when, size), lst in sorted(shots.items()):
    tiles = []
    for label, tags in WANT:
        hit = next((f for t, f in lst if t in tags), None)
        if hit: tiles.append((label, hit))
    if not tiles: continue
    sc = 0.5 if size == 'chromebook' else 0.6
    ims = [(l, Image.open(f).convert('RGB')) for l, f in tiles]
    tw, th = int(ims[0][1].width * sc), int(ims[0][1].height * sc)
    cols = 3 if size == 'chromebook' else 6
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * tw + (cols + 1) * 8, rows * (th + 34) + 8), '#FFFFFF'); dr = ImageDraw.Draw(sheet)
    for i, (l, im) in enumerate(ims):
        x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 34)
        sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y)); dr.text((x + 4, y + th + 4), l, fill='#1F2A44', font=FONT)
    os.makedirs(os.path.join(OUT, game), exist_ok=True)
    o = os.path.join(OUT, game, '%s-%s.jpg' % (when, size)); sheet.save(o, quality=82, optimize=True)
    print(o, len(ims), 'screens', os.path.getsize(o) // 1024, 'KB')
