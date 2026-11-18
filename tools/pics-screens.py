#!/usr/bin/env python3
"""PICS-1: list EVERY lesson screen (lesson id, question, teaching line, current pic) from packs/*.html and src/*.html.
Usage: python3 tools/pics-screens.py out.json
The keys in src/RealPics.html are 'LESSON.ID|question' exactly as they appear here. tools/pics-check.js reads this file.
NOTE: packs/ in GitHub can be older than the live packs (Drive). For new screens, refresh packs/ from the live packs first."""
import re,glob,json,bisect,sys,os
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'); out=[]
IDRX=r"""['"]((?:LK|K|SS|SCI|SOC|COMP|FACT|LIFE|ELEC|READ|MATH|WRIT|LANG|VOC|SIM|TT|TQ|HT)[A-Z0-9]*\.[A-Z0-9]+\.L?[A-Z0-9]+(?:\.[A-Z0-9]+)*)['"]\s*:\s*\{"""
for f in sorted(glob.glob(root+'/packs/*.html'))+sorted(glob.glob(root+'/src/*.html')):
  s=open(f,encoding='utf8',errors='ignore').read()
  ids=[(m.start(),m.group(1)) for m in re.finditer(IDRX,s)]; pos=[p for p,_ in ids]
  for m in re.finditer(r"""(?:"q"|\bq)\s*:\s*"((?:[^"\\]|\\.)*)\"""",s):
    i=bisect.bisect_right(pos,m.start())-1
    pre=s[max(0,m.start()-700):m.start()]; how=re.findall(r"""(?:"how"|\bhow)\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*$""",pre)
    post=s[m.end():m.end()+700]
    if not how:
      h2=re.match(r"""(?:(?!\}).)*?(?:"how"|\bhow)\s*:\s*"((?:[^"\\]|\\.)*)\"""",post,re.S); how=[h2.group(1)] if h2 else []
    pic=re.match(r"""(?:(?!\}).)*?(?:"pic"|\bpic)\s*:\s*"((?:[^"\\]|\\.)*)\"""",post,re.S)
    out.append({'f':os.path.basename(f),'id':ids[i][1] if i>=0 else '','q':m.group(1),'how':how[-1] if how else '','pic':pic.group(1) if pic else ''})
json.dump(out,open(sys.argv[1],'w'),ensure_ascii=False)
print(len(out),'screens;',sum(1 for x in out if x['id']),'with a lesson id')
