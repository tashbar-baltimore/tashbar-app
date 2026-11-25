import sys
from PIL import Image, ImageDraw, ImageFont
D,tag,out=sys.argv[1],sys.argv[2],sys.argv[3]; items=[x.split('=') for x in sys.argv[4:]]
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
for nm,sc,cols in [('cb',0.5,2),('ph',0.6,4)]:
  ims=[Image.open(f'{D}/{tag}-{k}-{nm}.png') for k,_ in items]
  w,h=int(ims[0].width*sc),int(ims[0].height*sc); lab=32; pad=12; rows=(len(ims)+cols-1)//cols
  S=Image.new('RGB',(cols*(w+pad)+pad,rows*(h+lab+pad)+pad),'#f1f5f9'); d=ImageDraw.Draw(S)
  for i,(im,(k,t)) in enumerate(zip(ims,items)):
    x=pad+(i%cols)*(w+pad); y=pad+(i//cols)*(h+lab+pad); d.text((x,y+5),t,fill='#0f172a',font=F); S.paste(im.resize((w,h)),(x,y+lab))
  S.save(f'{out}-{"chromebook" if nm=="cb" else "phone"}.png')
