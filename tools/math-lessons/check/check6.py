import json,re,sys
from fractions import Fraction as F
from decimal import Decimal as D
S=json.load(open(sys.argv[1],encoding='utf8')); bad=[]; kinds={}; checked=0
MI='−'
def n(s): return int(s.replace(',','').replace(MI,'-'))
def fr(s):
    s=s.strip().replace(MI,'-')
    if ' ' in s: w,f=s.split(' '); return int(w)+F(f)
    return F(s)
def ok_(k,cond,info):
    global checked
    kinds[k]=kinds.get(k,0)+1; checked+=1
    if not cond: bad.append((k,)+info)
INT=r'([−-]?\d[\d,]*)'
for s in S:
    c,sc,ok,opts=s['cap'],s['scene'],s['ok'],s['opts']
    if len(set(opts))!=len(opts) or len(opts)<2: bad.append(('opts',c,opts)); continue
    if ok not in opts: bad.append(('ok-missing',c,ok,opts)); continue
    try:
        m=re.match(r'Divide ([\d,]+) by (\d+)\.',c)
        if m:
            N,d=n(m.group(1)),int(m.group(2)); q,r=divmod(N,d); ok_('div',ok==(str(q)+(' R '+str(r) if r else '')),(c,ok)); continue
        m=re.match(r'About how much is ([\d,]+) ÷ (\d+)\?',c)
        if m:
            N,d=n(m.group(1)),int(m.group(2)); want=round((N//d)/10)*10; ok_('divEst',int(ok)==want,(c,ok)); continue
        m=re.match(r'What is ([\d.]+) ([+−×÷]) ([\d.]+)\?',c)
        if m and '.' in m.group(1)+m.group(3):
            a,op,b=D(m.group(1)),m.group(2),D(m.group(3)); want={'+':a+b,'−':a-b,'×':a*b,'÷':a/b}[op]; ok_('decOp',D(ok)==want,(c,ok)); continue
        m=re.match(r'What is the (GCF|LCM) of (\d+) and (\d+)\?',c)
        if m:
            a,b=int(m.group(2)),int(m.group(3)); from math import gcd; want=gcd(a,b) if m.group(1)=='GCF' else a*b//gcd(a,b); ok_(m.group(1),int(ok)==want,(c,ok)); continue
        m=re.match(r'Write (\d+) \+ (\d+) using the GCF',c)
        if m:
            from math import gcd; a,b=int(m.group(1)),int(m.group(2)); g,x,y=re.match(r'(\d+)\((\d+) \+ (\d+)\)',ok).groups(); ok_('distGCF',int(g)==gcd(a,b) and int(g)*int(x)==a and int(g)*int(y)==b,(c,ok)); continue
        m=re.match(r'What is (\d+)/(\d+) ÷ (\d+)/(\d+)\?',c)
        if m:
            a,b,cc,d=map(int,m.groups()); ok_('fracDiv',fr(ok)==F(a,b)/F(cc,d) and ('/' not in ok or F(ok).denominator==int(ok.split('/')[1])),(c,ok)); continue
        m=re.match(r'How many 1/(\d+)-cup scoops are in (\d+) cups',c)
        if m: ok_('fit',int(ok)==int(m.group(1))*int(m.group(2)),(c,ok)); continue
        m=re.match(r'What is the reciprocal of (\d+)/(\d+)\?',c)
        if m: ok_('recip',fr(ok)*F(int(m.group(1)),int(m.group(2)))==1,(c,ok)); continue
        m=re.match(r'What is the opposite of '+INT+r'\?',c)
        if m: ok_('opp',n(ok)==-n(m.group(1)),(c,ok)); continue
        m=re.match(r'What is the absolute value of '+INT+r'\?',c)
        if m: ok_('abs',n(ok)==abs(n(m.group(1))),(c,ok)); continue
        m=re.match(r'Which number shows (.+)\?',c)
        if m:
            t=m.group(1); v=int(re.search(r'(\d+)',t).group(1)); neg=any(w in t for w in ['below','debt','loss']); ok_('negMean',n(ok)==(-v if neg else v),(c,ok)); continue
        if c.startswith('Which sign goes in the box?'):
            nums=re.findall(r'[−-]?\d[\d,]*',sc.replace('□',' '))[:2]; a,b=n(nums[0]),n(nums[1]); ok_('cmp',ok==('>' if a>b else '<' if a<b else '='),(sc,ok)); continue
        if c.startswith('Which list goes from LEAST'):
            v=[n(x) for x in ok.split(', ')]; shown=sorted(n(x) for x in re.findall(r'[−-]?\d+',sc.split('Which')[0])[:4]); ok_('order',v==sorted(v) and sorted(v)==shown,(sc,ok)); continue
        m=re.match(r'In which quadrant is the point \('+INT+', '+INT+r'\)\?',c)
        if m:
            x,y=n(m.group(1)),n(m.group(2)); want='I' if x>0 and y>0 else 'II' if x<0 and y>0 else 'III' if x<0 and y<0 else 'IV'; ok_('quad',ok==want,(c,ok)); continue
        m=re.match(r'A is at \('+INT+', '+INT+r'\) and B is at \('+INT+', '+INT+r'\)\. How far',c)
        if m:
            x1,y1,x2,y2=map(n,m.groups()); ok_('dist',int(ok)==abs(y1-y2) and x1==x2,(c,ok)); continue
        m=re.match(r'Reflect \('+INT+', '+INT+r'\) over the (x|y)-axis',c)
        if m:
            x,y=n(m.group(1)),n(m.group(2)); want=(x,-y) if m.group(3)=='x' else (-x,y); got=tuple(n(t) for t in re.findall(r'[−-]?\d+',ok)); ok_('reflect',got==want,(c,ok)); continue
        m=re.match(r'What is '+INT+r' ([+−]) \(?'+INT+r'\)?\?',c)
        if m:
            a,op,b=n(m.group(1)),m.group(2),n(m.group(3)); ok_('int',n(ok)==(a+b if op=='+' else a-b),(c,ok)); continue
        if c.startswith('What was the temperature at lunch'):
            t,u=re.search(r'was '+INT+r' degrees\. By lunch it rose (\d+)',sc).groups(); ok_('temp',n(ok)==n(t)+int(u),(sc,ok)); continue
        m=re.match(r'(\d+) notebooks cost \$([\d.]+)\. What is the price of ONE',c)
        if m: ok_('unit',D(ok.strip('$'))*int(m.group(1))==D(m.group(2)),(c,ok)); continue
        if c.startswith('How many miles per hour'):
            dd,h=re.search(r'drives (\d+) miles in (\d+) hours',sc).groups(); ok_('speed',int(ok)*int(h)==int(dd),(sc,ok)); continue
        if c.startswith('Which store has the better buy'):
            a,pa,b,pb=re.search(r'Store A: (\d+) bottles of grape juice for \$([\d.]+).*Store B: (\d+) bottles for \$([\d.]+)',sc).groups(); ua=D(pa)/int(a); ub=D(pb)/int(b); ok_('best',ok==('Store A' if ua<ub else 'Store B') and ua!=ub,(sc,ok)); continue
        m=re.match(r'What is (\d+)% of (\d+)\?',c)
        if m: ok_('pctOf',D(ok)==D(int(m.group(1))*int(m.group(2)))/100,(c,ok)); continue
        if c.startswith('How many boys are in the whole grade'):
            part,p=re.search(r'(\d+) boys in the grade went.*That is (\d+)%',sc).groups(); ok_('pctWhole',D(ok)*int(p)/100==int(part),(sc,ok)); continue
        m=re.match(r'Write (\d+)% as a (fraction|decimal)\.',c)
        if m: ok_('pctForm',(fr(ok) if m.group(2)=='fraction' else F(D(ok)))==F(int(m.group(1)),100) and (m.group(2)=='decimal' or F(ok).denominator==int(ok.split('/')[1])),(c,ok)); continue
        m=re.match(r'How many cups of flour for (\d+) challahs\?',c)
        if m:
            nums=[int(x) for x in re.findall(r'\d+',sc)]; a,a2,b,b2,bk=nums[0],nums[1],nums[2],nums[3],nums[4]; ok_('ratio',F(int(ok),int(m.group(1)))==F(a,b) and a2==2*a and b2==2*b and bk==int(m.group(1)),(sc,ok)); continue
        m=re.match(r'([\d,]+) (\w+) is how many (\w+)\?',c)
        if m:
            mm=re.search(r'1 (\w+) = (\d+) (\w+)',sc)
            if mm:
                N=n(m.group(1)); f=int(mm.group(2)); want=N//f if m.group(2)==mm.group(3) else N*f
                if m.group(2)==mm.group(3): ok_('convDiv',n(ok)*f==N,(c,sc,ok))
                else: ok_('convMul',n(ok)==N*f,(c,sc,ok))
                continue
        m=re.match(r'How far does it go in (\d+) minutes\?',c)
        if m:
            v=int(re.search(r'goes (\d+) miles in 1 hour',sc).group(1)); ok_('rate',D(ok)*60==v*int(m.group(1)),(c,ok)); continue
        m=re.match(r'What is (.+) when x = (\d+)\?',c)
        if m:
            e,x=m.group(1),int(m.group(2)); e2=e.replace('²','**2'); e2=re.sub(r'(\d)x',r'\1*x',e2); e2=re.sub(r'(\d)\(',r'\1*(',e2); ok_('eval',int(ok)==eval(e2,{'x':x}),(c,ok)); continue
        m=re.match(r'What is (\d)([²³])\?',c)
        if m: ok_('power',int(ok)==int(m.group(1))**(2 if m.group(2)=='²' else 3),(c,ok)); continue
        m=re.match(r'Which expression means "(.+)"\?',c)
        if m:
            want={'5 more than n':'n + 5','n times 4':'4n','7 less than n':'n − 7','half of n':'n ÷ 2','3 times the sum of n and 2':'3(n + 2)'}[m.group(1)]; ok_('words',ok==want,(c,ok)); continue
        m=re.match(r'Which is equal to (\d+)\((\w) \+ (\d+)\)\?',c)
        if m:
            a,v,b=int(m.group(1)),m.group(2),int(m.group(3)); ok_('distrib',ok==f'{a}{v} + {a*b}',(c,ok)); continue
        m=re.match(r'Simplify (\d+)(\w) \+ (\d+) \+ (\d+)(\w)\.',c)
        if m:
            a,v,k,b,_=m.groups(); ok_('like',ok==f'{int(a)+int(b)}{v} + {k}',(c,ok)); continue
        m=re.match(r'Are (\d+)\(x \+ (\d+)\) and (\d+)x \+ (\d+) equivalent\?',c)
        if m:
            a,b,a2,k=map(int,m.groups()); ok_('equiv',ok==('yes' if a2==a and k==a*b else 'no'),(c,ok)); continue
        if c.startswith('Solve for x.'):
            e=re.search(r'(x \+ \d+ = \d+|x − \d+ = \d+|\d+x = \d+|x ÷ \d+ = \d+)',sc).group(1); x=int(ok)
            l,r=e.split(' = '); l=l.replace('−','-').replace('÷','/'); l=re.sub(r'(\d)x',r'\1*x',l); ok_('oneStep',eval(l,{'x':x})==int(r),(e,ok)); continue
        m=re.match(r'(\d+) identical sefarim cost \$(\d+) in all\.',c)
        if m: ok_('eqStory',ok==f'{m.group(1)}x = {m.group(2)}',(c,ok)); continue
        if c.startswith('What is the area of the triangle'):
            b,h=re.search(r'base (\d+) cm (\d+) cm',sc).groups(); ok_('tri',D(ok)==D(int(b)*int(h))/2,(sc,ok)); continue
        if c.startswith('Split the shape'):
            w,hr,ht=re.search(r'(\d+) m (\d+) m (\d+) m tall',sc).groups(); w,hr,ht=int(w),int(hr),int(ht); ok_('house',D(ok)==w*hr+D(w*ht)/2,(sc,ok)); continue
        if c.startswith('What is its area?'):
            b,h=re.search(r'base of (\d+) m and a height of (\d+) m',sc).groups(); ok_('para',int(ok)==int(b)*int(h),(sc,ok)); continue
        if c.startswith('What is the surface area of the box'):
            l,h,w=[int(x) for x in re.findall(r'(\d+) cm',sc)][:3]; ok_('SA',int(ok)==2*(l*w+l*h+w*h),(sc,ok)); continue
        if c.startswith('How many faces does the net have'):
            t=re.search(r'net of (.+?)\.',sc).group(1); ok_('net',int(ok)=={'a cube':6,'a rectangular prism':6,'a square pyramid':5,'a triangular prism':5,'a triangular pyramid':4}[t],(sc,ok)); continue
        m=re.match(r'A box is (\d+) ft by (\d+) ft by (\d+) 1/2 ft',c)
        if m:
            l,w,h=map(int,m.groups()); ok_('volFrac',fr(ok)==l*w*(h+F(1,2)),(c,ok)); continue
        if c.startswith('What is the MEAN'):
            v=[int(x) for x in re.findall(r'\d+',re.match(r'((?:\d+, )+\d+)',sc).group(1))]; ok_('mean',F(int(ok))==F(sum(v),len(v)),(sc,ok)); continue
        if c.startswith('What is the MEDIAN'):
            v=sorted(int(x) for x in re.findall(r'\d+',re.match(r'((?:\d+, )+\d+)',sc).group(1))); ok_('median',int(ok)==v[len(v)//2] and len(v)%2==1,(sc,ok)); continue
        if c.startswith('What is the RANGE'):
            v=[int(x) for x in re.findall(r'\d+',re.match(r'((?:\d+, )+\d+)',sc).group(1))]; ok_('range',int(ok)==max(v)-min(v),(sc,ok)); continue
        if c.startswith('These 7 scores are in order'):
            v=[int(x) for x in re.findall(r'\d+',sc)][:7]; ok_('iqr',v==sorted(v) and int(ok)==v[5]-v[1],(sc,ok)); continue
        if c.startswith(('How many boys scored','How many boys took the quiz')):
            nums=[int(x) for x in re.findall(r'(\d+)\s',sc.split('0-9')[0]+' ')][:5] if False else None
            t=sc; vals=[]; labs=['0-9','10-19','20-29','30-39','40-49']
            parts=re.split(r'(0-9|10-19|20-29|30-39|40-49)',t)
            for i,lab in enumerate(labs):
                idx=parts.index(lab); vals.append(int(re.findall(r'\d+',parts[idx-1])[-1]))
            if 'in all' in c: want=sum(vals)
            elif '30 or more' in c: want=vals[3]+vals[4]
            else: want=vals[labs.index(re.search(r'scored (\S+)\?',c).group(1))]
            ok_('hist',int(ok)==want,(c,vals,ok)); continue
        if 'Do you need the GCF or the LCM' in c:
            ok_('gcfOrLcm',ok==('GCF' if ('most' in c or 'long as possible' in c) else 'LCM'),(c,ok)); continue
        m=re.match(r'Which display is best to (.+)\?',c)
        if m:
            ok_('display',ok=={'see the median and the spread at a glance':'box plot','count how many scores fall in each range of 10':'histogram','show every single value as its own dot':'dot plot'}[m.group(1)],(c,ok)); continue
        kinds['other:'+c[:45]]=kinds.get('other:'+c[:45],0)+1
    except Exception as e: bad.append(('parse',repr(e),c,sc[:150],ok))
print('checked',checked,'of',len(S),'BAD',len(bad))
for b in bad[:30]: print(' ',b)
print(sorted((k,v) for k,v in kinds.items() if not k.startswith('other')))
print('UNCHECKED:',sorted((k,v) for k,v in kinds.items() if k.startswith('other')))
