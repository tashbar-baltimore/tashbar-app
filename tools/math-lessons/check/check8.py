import json,re,sys,math
from fractions import Fraction as F
S=json.load(open(sys.argv[1],encoding='utf8')); bad=[]; checked=0; kinds={}
M='−'
def n(s): s=s.strip().replace(',','').replace(M,'-'); return F(s) if '/' in s else (F(s) if '.' in s else int(s))
def nn(s): return str(s).replace('-',M)
def frs(v):
    v=F(v); return nn(v.numerator) if v.denominator==1 else (M if v<0 else '')+f'{abs(v.numerator)}/{v.denominator}'
def pr(x,y): return '('+nn(x)+', '+nn(y)+')'
def add(k): kinds[k]=kinds.get(k,0)+1
SUPMAP=dict(zip('⁰¹²³⁴⁵⁶⁷⁸⁹⁻','0123456789-'))
def desup(s): return ''.join(SUPMAP.get(ch,ch) for ch in s)
def lin_parse(t):
    t=t.replace(' ','').replace(M,'-'); m=re.fullmatch(r'(-?\d*)x([+-]\d+)?',t)
    a=m.group(1); a=1 if a=='' else (-1 if a=='-' else int(a)); b=int(m.group(2) or 0); return a,b
for s in S:
    c,sc,ok,opts=s['cap'],s['scene'],s['ok'],s['opts']
    if len(set(opts))!=len(opts) or len(opts)<2: bad.append(('opts',c,opts)); continue
    try:
        k=None
        if c.startswith('What is the square root of'):
            v=int(re.search(r'of ([\d,]+)',c).group(1).replace(',','')); k='sqrt'; good=int(ok)**2==v
        elif c.startswith('What is the cube root of'):
            v=int(re.search(r'of ([\d,]+)',c).group(1).replace(',','')); k='cbrt'; good=int(ok)**3==v
        elif re.match(r'What is \d+ (squared|cubed)\?',c):
            b,w=re.match(r'What is (\d+) (squared|cubed)',c).groups(); k='pow'; good=int(ok)==int(b)**(2 if w=='squared' else 3)
        elif c=='Solve for x.' and ('x²' in sc or 'x³' in sc):
            cube='x³' in sc; v=int(re.search(r'= (\d+)',sc).group(1)); r=round(v**(1/3)) if cube else math.isqrt(v); k='solveSq'
            good=ok==(str(r) if cube else f'{r} or {M}{r}')
        elif c.startswith('Is ') and 'rational or irrational' in c:
            x=re.search(r'Is (.+) rational or irrational',c).group(1); k='ratIrr'
            if x.startswith('√'): v=int(x[1:]); irr=math.isqrt(v)**2!=v
            elif x=='π' or 'never repeats' in x: irr=True
            else: irr=False
            good=ok==('irrational' if irr else 'rational')
        elif c.startswith('As a decimal, does'):
            a,b=map(int,re.search(r'does (\d+)/(\d+)',c).groups()); d=F(a,b).denominator
            while d%2==0: d//=2
            while d%5==0: d//=5
            k='endsRep'; good=ok==('it ends' if d==1 else 'it repeats')
        elif c.startswith('Write the repeating decimal'):
            m=re.search(r'0\.(\d+)…',sc).group(1); k='rep2frac'
            per=1 if len(set(m))==1 else 2; dig=int(m[:per]); want=F(dig,9 if per==1 else 99); good=ok==frs(want)
        elif c.startswith('Which decimal equals'):
            a,b=map(int,re.search(r'equals (\d+)/(\d+)',c).groups()); k='frac2rep'; good=ok==f'{a/b:.6f}'[:6]+'…'
        elif c.startswith('Between which two whole numbers'):
            v=int(re.search(r'√(\d+)',c).group(1)); r=math.isqrt(v); k='between'; good=ok==f'{r} and {r+1}'
        elif c.startswith('Which whole number is'):
            v=int(re.search(r'√(\d+)',c).group(1)); k='nearest'; good=int(ok)==round(math.sqrt(v))
        elif c.startswith('Compare. Which sign') and '√' in sc:
            v,kk=re.search(r'√(\d+)\s*□\s*(\d+)',sc).groups(); k='rootCmp'; good=ok==('>' if int(v)>int(kk)**2 else '<')
        elif c.startswith('Compare. Which sign') and '× 10' in sc:
            a,e1,b,e2=re.search(r'([\d.]+) × 10(\S+)\s*□\s*([\d.]+) × 10(\S+)',sc).groups(); x=F(a)*F(10)**int(desup(e1)); y=F(b)*F(10)**int(desup(e2)); k='sciCmp'; good=ok==('>' if x>y else '<')
        elif c=='What is the slope?':
            p=re.findall(r'\((\S+), (\S+)\)',sc); (x1,y1),(x2,y2)=[(n(a),n(b)) for a,b in p[:2]]; k='slope2'; good=ok==frs(F(y2-y1,x2-x1))
        elif c.startswith('What is the rate of change (the slope)'):
            nums=re.findall(r'[−]?\d+',sc)[:8]; xs=[n(v) for v in nums[:4]]; ys=[n(v) for v in nums[4:8]]; k='slopeTbl'; good=ok==nn(ys[1]-ys[0]) and all(ys[i+1]-ys[i]==ys[1]-ys[0] for i in range(len(ys)-1))
        elif c.startswith('What is the slope of the line through the dots'):
            p=re.findall(r'\((\d+), (\d+)\)',sc); (x1,y1),(x2,y2)=[(int(a),int(b)) for a,b in p[:2]]; k='slopeGraph'; good=ok==frs(F(y2-y1,x2-x1))
        elif c=='What does the slope tell you?':
            r=re.search(r'goes up (\d+) every (\w+)',sc).groups(); k='slopeMean'; good=ok.startswith(r[0]+' ') and ok.endswith('per '+r[1])
        elif c=='Simplify.':
            q=desup(sc.split('Simplify')[0] if False else sc).strip(); k='expRule'
            q=desup(re.split(r'\s(?=\S+$)',sc)[0]) if False else desup(sc)
            okd=desup(ok)
            m=re.match(r'x(\d+) · x(\d+)',q)
            if m: good=okd=='x'+str(int(m.group(1))+int(m.group(2)))
            elif re.match(r'x(\d+) ÷ x(\d+)',q):
                a,b=re.match(r'x(\d+) ÷ x(\d+)',q).groups(); good=okd=='x'+str(int(a)-int(b))
            elif re.match(r'\(x(\d+)\)(\d+)',q):
                a,b=re.match(r'\(x(\d+)\)(\d+)',q).groups(); good=okd=='x'+str(int(a)*int(b))
            elif re.match(r'(\d+)0 ',q+' ') and not re.match(r'(\d+)-',q):
                good=ok=='1'
            else:
                b,e=re.match(r'(\d+)-(\d+)',q).groups(); good=ok=='1/'+str(int(b)**int(e))
        elif c.startswith('Write it in scientific notation'):
            v=F(re.match(r'([\d,.]+)',sc).group(1).replace(',','')); a,e=re.match(r'([\d.]+) × 10(\S+)',ok).groups(); k='sciWrite'; good=F(a)*F(10)**int(desup(e))==v and 1<=F(a)<10
        elif c=='Multiply.' and '× 10' in sc:
            a,e1,b,e2=re.search(r'\((\d+) × 10(\S+)\) × \((\d+) × 10(\S+)\)',sc).groups(); a2,e3=re.match(r'(\d+) × 10(\S+)',ok).groups(); k='sciMul'; good=int(a2)*10**int(desup(e3))==int(a)*int(b)*10**(int(desup(e1))+int(desup(e2)))
        elif c=='Solve for x.' and '(' in sc:
            a,inside,rhs=re.search(r'(\d+)\((x[^)]*)\) = (\S+)',sc).groups(); _,b=lin_parse(inside); x=n(ok); k='solveDist'; good=int(a)*(x+b)==n(rhs)
        elif c=='Solve for x.':
            L,Rr=re.search(r'^(.*?) = (.*?)(?: \S+){3}$',sc).groups(); a,b=lin_parse(L); cc,d=lin_parse(Rr); x=n(ok); k='solveBoth'; good=a*x+b==cc*x+d
        elif c=='How many solutions?':
            L,Rr=re.search(r'^(.*?) = (.*?) one solution',sc).groups()
            def ex(t):
                t=t.replace(' ','').replace(M,'-'); m=re.fullmatch(r'(\d+)\(x\+(\d+)\)',t)
                return (int(m.group(1)),int(m.group(1))*int(m.group(2))) if m else lin_parse(t)
            (a,b),(cc,d)=ex(L),ex(Rr); want='one solution' if a!=cc else ('infinitely many' if b==d else 'no solution'); k='solCount'; good=ok==want
        elif c.startswith('Which pair (x, y) solves BOTH'):
            e=re.findall(r'(x \+ y|x − y|y) = (.+?)(?=x \+ y|x − y|y =|\(|$)',sc); x,y=[n(v) for v in re.match(r'\((\S+), (\S+)\)',ok).groups()]; k='system'; good=True
            for lhs,rhs in e:
                rhs=rhs.strip()
                if lhs=='y': a,b=lin_parse(rhs); good&=y==a*x+b
                elif lhs=='x + y': good&=x+y==n(rhs)
                else: good&=x-y==n(rhs)
            good&=len(e)==2
        elif c.startswith('Is (') and 'solution to BOTH' in c:
            px,py=[n(v) for v in re.search(r'\((\S+), (\S+)\)',c).groups()]; s1,d1=re.search(r'x \+ y = (\S+)2x − y = (\S+)',sc.replace(' 2x','2x')).groups(); k='sysCheck'; good=ok==('yes' if px+py==n(s1) and 2*px-py==n(d1) else 'no')
        elif c=='Is this a function?':
            nums=re.findall(r'\d+',sc); h=(len(nums))//2; xs,ys=nums[:h],nums[h:]; mp={}; fn=True
            for a,b in zip(xs,ys):
                if a in mp and mp[a]!=b: fn=False
                mp[a]=b
            k='isFunc'; good=ok==('yes' if fn else 'no')
        elif re.match(r'What is f\(',c):
            x=n(re.match(r'What is f\((\S+)\)',c).group(1)); t=sc.split('f(x) = ')[1]; t=t[:len(t)-len(' '.join(opts))].strip(); a,b=lin_parse(t); k='funcEval'; good=n(ok)==a*x+b
        elif c.startswith('Which rule makes this table'):
            nums=re.findall(r'[−]?\d+',sc); xs=[n(v) for v in nums[:4]]; ys=[n(v) for v in nums[4:8]]; a,b=lin_parse(ok[4:]); k='funcRule'; good=all(a*x+b==y for x,y in zip(xs,ys))
        elif c.startswith('As x gets bigger'):
            t=re.search(r'y = (.+?) increasing',sc).group(1);
            try: a,b=lin_parse(t)
            except Exception: a=0
            k='funcDir'; good=ok==('increasing' if a>0 else 'decreasing' if a<0 else 'constant')
        elif c in ('Which equation models this?','What is the rate of change?','What is the starting value (the y-intercept)?'):
            s_,r_=map(int,re.search(r'(?:costs|has) (\d+) .*?(?:plus|adds|by) (\d+)',sc).groups()); k='model'
            good = ok==f'y = {r_}x + {s_}' if c.startswith('Which') else (ok==str(r_) if 'rate' in c else ok==str(s_))
        elif c=='Where does the point land?':
            k='transform'; x,y=[n(v) for v in re.search(r'\((\S+), (\S+)\)',sc).groups()]; ox,oy=[n(v) for v in re.match(r'\((\S+), (\S+)\)',ok).groups()]
            if sc.startswith('Slide'):
                m=re.search(r'(\d+) (right|left) and (\d+) (up|down)',sc); dx=int(m.group(1))*(1 if m.group(2)=='right' else -1); dy=int(m.group(3))*(1 if m.group(4)=='up' else -1); good=(ox,oy)==(x+dx,y+dy)
            elif 'x-axis' in sc: good=(ox,oy)==(x,-y)
            elif 'y-axis' in sc: good=(ox,oy)==(-x,y)
            elif '90' in sc: good=(ox,oy)==(-y,x)
            elif '180' in sc: good=(ox,oy)==(-x,-y)
            elif 'Dilate' in sc:
                kk=F(re.search(r'factor of (\S+) from',sc).group(1)); good=(F(ox),F(oy))==(x*kk,y*kk); k='dilate'
            else: good=False
        elif c.startswith('What is the third angle'):
            a,b=map(int,re.findall(r'(\d+)°',sc)[:2]); k='triSum'; good=int(ok)==180-a-b
        elif c.startswith('How big is the exterior angle'):
            a,b=map(int,re.findall(r'(\d+)°',sc)[:2]); k='extAngle'; good=int(ok)==a+b
        elif re.match(r'What is its (corresponding|alternate interior|same-side interior|angle next to it)',c):
            a=int(re.search(r'One angle is (\d+)',sc).group(1)); k='parallel'; good=int(ok)==(a if ('corresponding' in c or 'alternate' in c) else 180-a)
        elif c.startswith('How long is the longest side'):
            a,b=map(int,re.findall(r'\d+',sc)[:2]); k='pythHyp'; good=int(ok)**2==a*a+b*b
        elif c.startswith('How long is the missing leg'):
            nums=list(map(int,re.findall(r'\d+',sc)[:2])); b,cc=nums; k='pythLeg'; good=int(ok)**2+b*b==cc*cc
        elif 'Is it a right triangle' in c:
            a,b,cc=map(int,re.search(r'sides (\d+), (\d+) and (\d+)',c).groups()); k='pythConv'; good=ok==('yes' if a*a+b*b==cc*cc else 'no')
        elif c.startswith('How far apart are A and B'):
            p=re.findall(r'\((\S+), (\S+)\)',sc); (x1,y1),(x2,y2)=[(n(a),n(b)) for a,b in p[:2]]; k='dist'; good=int(ok)**2==(x2-x1)**2+(y2-y1)**2
        elif c.startswith('Volume of the'):
            r=int(re.search(r'r = (\d+)',sc).group(1)); h=re.search(r'h = (\d+)',sc); h=int(h.group(1)) if h else 0; pi=F(314,100)
            want=pi*r*r*h if 'cylinder' in c else (pi*r*r*h/3 if 'cone' in c else F(4,3)*pi*r**3); k='vol'; good=F(ok)==want
        elif c.startswith('Which formula gives the volume'):
            k='volWhich'; good=ok==({'cylinder':'πr²h','cone':'⅓πr²h','sphere':'⁴⁄₃πr³'}[re.search(r'of a (\w+)',c).group(1)])
        elif c.startswith('Predict y when'):
            x=int(re.search(r'x = (\d+)',c).group(1)); m_,b_=map(int,re.search(r'y = (\d+)x \+ (\d+)',sc).groups()); k='trend'; good=int(ok)==m_*x+b_
        elif 'chess' in sc and (c.startswith('How many') or 'fraction' in c or 'BIGGER' in c):
            a,b,cc,d=map(int,re.findall(r'grade (\d+) (\d+)',sc.replace('7th','').replace('8th',''))[0]+re.findall(r'grade (\d+) (\d+)',sc.replace('7th','').replace('8th',''))[1]); k='twoWay'
            if 'fraction' in c: good=ok==frs(F(cc,cc+d))
            elif 'BIGGER' in c: good=ok==('7th grade' if F(a,a+b)>F(cc,cc+d) else '8th grade')
            elif '8th graders' in c: good=int(ok)==cc+d
            elif 'play chess in all' in c: good=int(ok)==a+cc
            else: good=int(ok)==a+b+cc+d
        elif c.startswith('A triangle is moved.'):
            k='congSim'; good=ok==('similar, not congruent' if re.search(r'bigger|twice|shrunk|dilated',c) else 'congruent')
        else:
            add('other:'+c[:40]); continue
        add(k); checked+=1
        if not good: bad.append((k,c,sc[:160],ok))
    except Exception as e: bad.append(('parse',repr(e),c,sc[:160],ok))
print('checked',checked,'of',len(S)); print('BAD',len(bad)); [print(' ',b) for b in bad[:30]]
print(sorted((k,v) for k,v in kinds.items() if not k.startswith('other'))); print({k:v for k,v in kinds.items() if k.startswith('other')})
