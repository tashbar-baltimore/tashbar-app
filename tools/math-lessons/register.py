import sys,re,hashlib,shutil
G=int(sys.argv[1]); SRC=sys.argv[2]; R='/home/user/tashbar-app/'; name='G%dMath'%G; prev='G%dMath'%(G-1)
ORD={5:'5th',6:'6th',7:'7th',8:'8th'}[G]
shutil.copy(SRC,R+'packs/'+name+'.html')
p=R+'src/Photos.js'; s=open(p).read()
if "tlFileText_('%s')"%name not in s:
    a="  var g%dx = ''; try { g%dx = tlFileText_('%s')"%(G-1,G-1,prev); i=s.index(a); j=s.index('\n',i)+1
    s=s[:j]+"  var g%dx = ''; try { g%dx = tlFileText_('%s').replace(/^\\s*<script>/,'').replace(/<\\/script>\\s*$/,''); } catch (e) {} /* %s Grade Math lessons (%s.html), loaded last, own eval */\n"%(G,G,name,ORD,name)+s[j:]
    m=re.search(r"\+ '\\n;try\{\(0,eval\)\(' \+ JSON\.stringify\(g%dx\) \+ '\);\}catch\(e\)\{console\.error\(\"%s\",e\);\}'"%(G-1,prev),s); assert m
    s=s[:m.end()]+" + '\\n;try{(0,eval)(' + JSON.stringify(g%dx) + ');}catch(e){console.error(\"%s\",e);}'"%(G,name)+s[m.end():]
    open(p,'w').write(s)
p=R+'src/Speed.js'; s=open(p).read()
if "'%s'"%name not in s: s=s.replace("'%s', "%prev,"'%s', '%s', "%(prev,name),1); open(p,'w').write(s)
p=R+'src/ContentPacks.js'; s=open(p).read(); data=open(R+'packs/'+name+'.html','rb').read()
line="  %s:     ['github-only', '%s', %d],   /* 2026-11-20 %s Grade Math, full 8-station lessons on the K-3 lesson engine (Claude Code, yosef@ session); lives only in GitHub packs/ */"%(name,hashlib.sha256(data).hexdigest(),len(data),ORD)
lines=s.split('\n'); idx=[i for i,l in enumerate(lines) if l.strip().startswith(name+':')]
if idx: lines[idx[0]]=line
else:
    k=[i for i,l in enumerate(lines) if l.strip().startswith(prev+':')][0]; lines.insert(k+1,line)
open(p,'w').write('\n'.join(lines))
p=R+'tools/skill_flow.js'; s=open(p).read()
if "'%s'"%name not in s:
    s=s.replace("'%s']"%prev,"'%s', '%s']"%(prev,name),1).replace("'G%dM',"%(G-1),"'G%dM', 'G%dM',"%(G-1,G),1); open(p,'w').write(s)
print('registered',name,len(data))
