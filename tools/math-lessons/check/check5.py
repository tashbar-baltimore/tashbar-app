import json,re,sys
from fractions import Fraction as F
S=json.load(open(sys.argv[1],encoding='utf8')); bad=[]; checked=0; other={}
def val(s):
    s=s.strip().replace(',','').replace('$','')
    m=re.fullmatch(r'(\d+) (\d+)/(\d+)',s)
    if m: return F(int(m[1]))+F(int(m[2]),int(m[3]))
    if '/' in s: a,b=s.split('/'); return F(int(a),int(b))
    return F(s)
def ev(expr):
    e=expr.replace('×','*').replace('÷','/').replace('−','-').replace(',','')
    e=re.sub(r'(\d+)/(\d+)',lambda m:'(F('+m[1]+','+m[2]+'))',e)
    e=re.sub(r'(?<![\w(,])(\d+(?:\.\d+)?)(?![\d,)])',lambda m:'F("'+m[1]+'")',e)
    return eval(e)
def simp_ok(s):  # answer must be in simplest form
    m=re.search(r'(\d+)/(\d+)$',s)
    if m:
        from math import gcd
        return gcd(int(m[1]),int(m[2]))==1 and int(m[1])<int(m[2]) if ' ' in s or True else True
    return True
for s in S:
    c,sc,ok,opts=s['cap'],s['scene'].replace(' ',' '),s['ok'],s['opts']
    if len(set(opts))!=len(opts) or len(opts)<2: bad.append(('opts',c,opts)); continue
    try:
        if c=='Solve.' or c=='Multiply.' or (c=='Divide.' and '÷' in sc) or c.startswith('Add. Find') or c.startswith('Subtract. Find') or c in('Add the decimals.','Subtract the decimals.'):
            expr=sc.split(' ')[0:3]; m=re.match(r'^([\d.,/]+ [×÷+−] [\d.,/]+)',sc)
            want=ev(m[1]); got=val(ok); checked+=1
            if want!=got: bad.append(('expr',sc[:60],ok,str(want)))
            if '/' in ok and not c.startswith(('Add the','Subtract the')):
                from math import gcd
                mm=re.search(r'(\d+)/(\d+)$',ok)
                if gcd(int(mm[1]),int(mm[2]))!=1 or int(mm[1])>=int(mm[2]): bad.append(('notsimplest',sc[:40],ok))
            for o in opts:
                if o!=ok:
                    try:
                        if val(o)==want: bad.append(('dupval',sc[:40],opts))
                    except Exception: pass
        elif c=='What is the value?':
            want=ev(re.match(r'^([\d()+−×÷ ]+?) ?\d* ?(\d+ )*$',sc) and sc.split('  ')[0] or sc) if False else None
            expr=re.match(r'^(.*?\d\)?)(?: \d+)+$',sc)[1]; want=ev(expr); checked+=1
            if want!=val(ok): bad.append(('ops',expr,ok,str(want)))
        elif c.startswith('Multiply with the standard'):
            a,b=re.match(r'([\d,]+) × (\d+)',sc).groups(); checked+=1
            if val(ok)!=int(a.replace(',',''))*int(b): bad.append(('mul',sc[:30],ok))
        elif c.startswith('Divide ') and ' by ' in c:
            n,d=re.match(r'Divide ([\d,]+) by (\d+)',c).groups(); n=int(n.replace(',','')); d=int(d); q,r=divmod(n,d); checked+=1
            if ok!=str(q)+(' R '+str(r) if r else ''): bad.append(('div',c,ok))
        elif c=='Convert.':
            m=re.match(r'([\d.,]+) (\w+) = \? (\w+)',sc); v=F(m[1].replace(',','')); u1,u2=m[2],m[3]
            M={('kilometers','meters'):1000,('meters','centimeters'):100,('centimeters','millimeters'):10,('kilograms','grams'):1000,('liters','milliliters'):1000}
            want=v*M[(u1,u2)] if (u1,u2) in M else v/M[(u2,u1)]; checked+=1
            if val(ok)!=want: bad.append(('conv',sc[:40],ok,str(want)))
        elif c.startswith('They pour all the marbles'):
            n=len(re.findall(r'🔵',sc)); k=len(re.findall(r'[A-Z][a-z]+',sc)); checked+=1
            if F(int(ok))*k!=n: bad.append(('fair',k,n,ok))
        elif c.startswith('What are the coordinates of point A'):
            checked+=0
        elif c.startswith('Compare. Which sign') and '.' in sc.split('□')[0]:
            a,b=re.findall(r'\d+\.\d+',sc)[:2]; checked+=1
            if ok!=('>' if F(a)>F(b) else '<'): bad.append(('dc',sc[:30],ok))
        elif c.startswith(('How much in all?','How much change?')):
            p=[F(x) for x in re.findall(r'\$(\d+\.\d\d)',sc)]; want=p[0]+p[1] if 'all' in c else p[0]-p[1]; checked+=1
            if val(ok)!=want: bad.append(('money',sc[:60],ok))
        elif 'challahs are shared' in c:
            n,d=re.match(r'(\d+) challahs are shared equally by (\d+)',c).groups(); checked+=1
            if val(ok)!=F(int(n),int(d)): bad.append(('cdiv',c,ok))
        elif 'groups of' in c and 'How much is that' in c:
            w,a,b=re.match(r'(\d+) groups of (\d+)/(\d+)',c).groups(); checked+=1
            if val(ok)!=int(w)*F(int(a),int(b)): bad.append(('gw',c,ok))
        elif c.startswith('What is 10 to the power of'):
            k=int(re.search(r'of (\d+)',c)[1]); checked+=1
            if val(ok)!=10**k: bad.append(('p10',c,ok))
        elif c.startswith('How many cubes in all'):
            l,w,h=map(int,re.match(r'One layer of cubes is (\d+) by (\d+)\. There are (\d+)',sc).groups()); checked+=1
            if int(ok)!=l*w*h: bad.append(('vol',sc,ok))
        elif 'What is its volume' in c:
            l,w,h=map(int,re.search(r'is (\d+) cm long, (\d+) cm wide and (\d+) cm tall',c).groups()); checked+=1
            if int(ok)!=l*w*h: bad.append(('vb',c,ok))
        elif c.startswith('Round ') and ' to the nearest ' in c and '.' in c.split(' to ')[0]:
            v=F(re.match(r'Round ([\d.]+)',c)[1]); to=c.split('nearest ')[1].rstrip('.'); u={'whole number':F(1),'tenth':F(1,10),'hundredth':F(1,100)}[to]
            q=v/u; import math; want=(math.floor(q)+(1 if q-math.floor(q)>=F(1,2) else 0))*u; checked+=1
            if val(ok)!=want: bad.append(('rd',c,ok))
        elif c.startswith('Which decimal is'):
            m=re.match(r'Which decimal is (?:(\d+) and )?(\d+) (tenths|hundredths|thousandths)\?',c); w=int(m[1] or 0); n=int(m[2]); p={'tenths':10,'hundredths':100,'thousandths':1000}[m[3]]; checked+=1
            if val(ok)!=w+F(n,p): bad.append(('dr',c,ok))
        elif c.startswith('Both patterns start at 0'):
            a,b,n=map(int,re.match(r'Both patterns start at 0\. Pattern A adds (\d+)\. Pattern B adds (\d+)\. Which ordered pair is term number (\d+)',c).groups()); checked+=1
            if ok!=f'({n*a}, {n*b})': bad.append(('tp',c,ok))
        elif c.startswith('Which expression means'):
            checked+=1; phrase=c.split(': ',1)[1].rstrip('?')
            m=re.match(r'add (\d+) and (\d+), then multiply by (\d+)',phrase) ; 
            if m: want=(int(m[1])+int(m[2]))*int(m[3])
            m2=re.match(r'multiply (\d+) by (\d+), then add (\d+)',phrase)
            if m2: want=int(m2[1])*int(m2[2])+int(m2[3])
            m3=re.match(r'subtract (\d+) from (\d+), then double it',phrase)
            if m3: want=2*(int(m3[2])-int(m3[1]))
            if ev(ok)!=want: bad.append(('we',phrase,ok))
            for o in opts:
                if o!=ok and ev(o)==want: bad.append(('we-dup',phrase,opts))
        else: other[c[:40]]=other.get(c[:40],0)+1
    except Exception as e: bad.append(('parse',repr(e),c[:50],sc[:80],ok))
print('checked',checked,'of',len(S),'BAD',len(bad)); [print(' ',b) for b in bad[:30]]
print(sorted(other.items(),key=lambda x:-x[1])[:25])
