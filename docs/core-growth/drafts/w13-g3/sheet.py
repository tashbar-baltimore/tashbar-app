# python3 sheet.py DIR OUT.jpg COLS SCALE : contact sheet of every png in DIR (sorted), labelled
import sys, os
from PIL import Image, ImageDraw
d, out, cols, sc = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
ims = [Image.open(os.path.join(d, f)).convert('RGB') for f in fs]
w, h = int(ims[0].width * sc), int(ims[0].height * sc)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + 8) + 8, rows * (h + 30) + 8), 'white')
dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 30)
    sheet.paste(im.resize((w, h)), (x, y + 22)); dr.text((x, y + 4), f[:-4], fill='black')
sheet.save(out, quality=72)
print(out, len(ims))
