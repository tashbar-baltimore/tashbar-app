import json,re,sys
from fractions import Fraction as F
S=json.load(open(sys.argv[1],encoding='utf8')); bad=[]; checked=0; kinds={}
num=lambda s:int(s.replace(',',''))
def add(k): kinds[k]=kinds.get(k,0)+1
for s in S:
    c,sc,ok,opts=s['cap'],s['scene'],s['ok'],s['opts']
    if len(set(opts))!=len(opts) or len(opts)<2: bad.append(('opts',c,opts)); continue
    try:
        m=re.search(r'([\d,]+) ([+−]) ([\d,]+) \?',sc.replace(' ',' ')) if c.startswith(('Add.','Subtract.')) else None
        if c.startswith('Add. Line up'):
            nums=[num(x) for x in re.findall(r'[\d,]{4,}',sc.replace(' ',' '))][:2]; add('colAdd'); checked+=1
            if num(ok)!=nums[0]+nums[1]: bad.append(('add',sc,ok))
        elif c.startswith('Subtract. Line up'):
            nums=[num(x) for x in re.findall(r'[\d,]{4,}',sc.replace(' ',' '))][:2]; add('colSub'); checked+=1
            if num(ok)!=nums[0]-nums[1]: bad.append(('sub',sc,ok))
        elif c.startswith('Multiply.'):
            a,b=re.search(r'([\d,]+) × (\d+)',sc).groups(); add('mul'); checked+=1
            if num(ok)!=num(a)*int(b): bad.append(('mul',sc,ok))
        elif c.startswith('Divide '):
            n,d=re.search(r'Divide ([\d,]+) by (\d+)',c).groups(); n,d=num(n),int(d); q,r=divmod(n,d); add('div'); checked+=1
            if ok!=(str(q)+(' R '+str(r) if r else '')): bad.append(('div',c,ok))
        elif c.startswith('Add the two parts'):
            a,b=re.search(r'What is (\d+) × (\d+)',c).groups(); add('areaModel'); checked+=1
            if int(ok)!=int(a)*int(b): bad.append(('am',c,ok))
        elif re.match(r'(Add|Subtract)\. The bottoms',c):
            a1,b1,op,a2,b2=re.search(r'(\d+)/(\d+) ([+−]) (\d+)/(\d+)',sc).groups(); add('fracLike'); checked+=1
            want=(int(a1)+int(a2)) if op=='+' else (int(a1)-int(a2))
            if ok!=f'{want}/{b1}': bad.append(('frl',sc,ok))
        elif c.startswith('Write ') and 'improper' in c:
            w,a,b=re.search(r'Write (\d+) and (\d+)/(\d+)',c).groups(); add('m2i'); checked+=1
            if ok!=f'{int(w)*int(b)+int(a)}/{b}': bad.append(('m2i',c,ok))
        elif c.startswith('Write ') and 'mixed number' in c:
            t,b=re.search(r'Write (\d+)/(\d+)',c).groups(); q,r=divmod(int(t),int(b)); add('i2m'); checked+=1
            if ok!=f'{q} {r}/{b}': bad.append(('i2m',c,ok))
        elif c.startswith('Write ') and 'decimal' in c:
            h=int(re.search(r'Write (\d+)/100',c).group(1)); add('dec'); checked+=1
            if ok!=f'{h/100:.2f}': bad.append(('dec',c,ok))
        elif c.startswith('Round '):
            n,to=re.search(r'Round ([\d,]+) to the nearest ([\d,]+)',c).groups(); n,to=num(n),num(to); lo=n//to*to; want=lo+to if n-lo>=to/2 else lo; add('round'); checked+=1
            if num(ok)!=want: bad.append(('round',c,ok))
        elif c.startswith('Compare the decimals'):
            a,b=re.findall(r'\d\.\d+',sc)[:2]; add('decCmp'); checked+=1
            if ok!=('>' if float(a)>float(b) else '<'): bad.append(('dc',sc,ok))
        elif c.startswith('Compare. Which sign'):
            fs=re.findall(r'(\d+)/(\d+)',sc)[-2:]; x=F(int(fs[0][0]),int(fs[0][1])); y=F(int(fs[1][0]),int(fs[1][1])); add('fracCmp'); checked+=1
            if ok!=('>' if x>y else '<'): bad.append(('fc',sc,ok))
        elif c.startswith('Which fraction is EQUAL to'):
            a,b=re.search(r'EQUAL to (\d+)/(\d+)',c).groups(); p,q=ok.split('/'); add('fracEq'); checked+=1
            if F(int(p),int(q))!=F(int(a),int(b)): bad.append(('feq',c,ok))
            for o in opts:
                if o!=ok and F(*map(int,o.split('/')))==F(int(a),int(b)): bad.append(('feq-dup',c,opts))
        elif c.startswith('What is the missing top number'):
            a,b,d=re.search(r'(\d+)/(\d+) = \?/(\d+)',sc).groups(); add('fracMiss'); checked+=1
            if F(int(ok),int(d))!=F(int(a),int(b)): bad.append(('fm',sc,ok))
        elif c.startswith('How many hundredths'):
            a=int(re.search(r'(\d+)/10 ',sc+' ').group(1)); add('tenths'); checked+=1
            if int(ok)!=a*10: bad.append(('th',sc,ok))
        elif 'is how many' in c:
            n,u1,u2=re.search(r'^(\d+) (\w+) is how many (\w+)',c).groups(); f=int(re.search(r'= (\d+)',sc).group(1)); add('conv'); checked+=1
            if num(ok)!=int(n)*f: bad.append(('conv',c,sc,ok))
        elif c.startswith('Is ') and 'prime or composite' in c:
            n=int(re.search(r'Is (\d+)',c).group(1)); pr=n>1 and all(n%d for d in range(2,int(n**.5)+1)); add('prime'); checked+=1
            if ok!=('prime' if pr else 'composite'): bad.append(('pr',c,ok))
        elif c.startswith('Which number is a FACTOR'):
            n=int(re.search(r'FACTOR of (\d+)',c).group(1)); add('factor'); checked+=1
            if n%int(ok): bad.append(('f',c,ok))
            if sum(1 for o in opts if n%int(o)==0)!=1: bad.append(('f-multi',c,opts))
        elif c.startswith('Which number is a MULTIPLE'):
            k=int(re.search(r'MULTIPLE of (\d+)',c).group(1)); add('mult'); checked+=1
            if sum(1 for o in opts if int(o)%k==0)!=1 or int(ok)%k: bad.append(('m',c,opts,ok))
        elif c.startswith('How many factors does'):
            n=int(re.search(r'does (\d+)',c).group(1)); add('nfac'); checked+=1
            if int(ok)!=sum(1 for d in range(1,n+1) if n%d==0): bad.append(('nf',c,ok))
        elif c.startswith('What is the VALUE of the red'):
            add('pvValue'); checked+=1
        elif c.startswith('How many') and 'does' in c and 'have?' in c and 'times as many' in sc:
            a,k=re.search(r'has (\d+) \w+\. \w+ has (\d+) times',sc).groups(); add('tam'); checked+=1
            if int(ok)!=int(a)*int(k): bad.append(('tam',sc,ok))
        elif c.startswith('What is number'):
            st,d=re.search(r'start at (\d+), add (\d+)',sc).groups(); n=int(re.search(r'number (\d+)',c).group(1)); add('rule'); checked+=1
            if int(ok)!=int(st)+(n-1)*int(d): bad.append(('rule',sc,ok))
        elif c.startswith('How big is the whole angle'):
            a,b=re.findall(r'(\d+)°',sc)[:2]; add('angAdd'); checked+=1
            if int(ok)!=int(a)+int(b): bad.append(('aa',sc,ok))
        elif 'What is its AREA' in c:
            w,h=re.findall(r'(\d+) ft',sc)[:2]; add('area'); checked+=1
            if int(ok)!=int(w)*int(h): bad.append(('area',sc,ok))
        elif 'PERIMETER' in c:
            w,h=re.findall(r'(\d+) m\b',sc)[:2]; add('perim'); checked+=1
            if int(ok)!=2*(int(w)+int(h)): bad.append(('per',sc,ok))
        elif c.startswith('Think about the remainder'):
            n,d=None,None; m=re.search(r'(\d+) boys are going.*holds (\d+) boys',sc) or re.search(r'There are (\d+) cookies\. Each plate gets (\d+)',sc) or re.search(r'(\d+) seforim are put on shelves, (\d+) on each',sc)
            n,d=int(m.group(1)),int(m.group(2)); q,r=divmod(n,d); add('leftover'); checked+=1
            want=q+(1 if r else 0) if 'vans' in sc else (q if 'FULL' in sc else r)
            if int(ok)!=want: bad.append(('left',sc,ok))
        elif c.startswith('How many stickers does he have now'):
            a,p,g=re.search(r'buys (\d+) packs of (\d+) stickers\. He gives away (\d+)',sc).groups(); add('story5'); checked+=1
            if int(ok)!=int(a)*int(p)-int(g): bad.append(('st5',sc,ok))
        elif c.startswith('How long is the other side'):
            A,w=re.search(r'area of (\d+) square meters\. One side is (\d+)',sc).groups(); add('missSide'); checked+=1
            if int(ok)*int(w)!=int(A): bad.append(('ms',sc,ok))
        elif c.startswith('How many times as many does the big one'):
            a,b=re.search(r'holds (\d+) Chumashim\. The big one in shul holds (\d+)',sc).groups(); add('hmt'); checked+=1
            if int(ok)*int(a)!=int(b): bad.append(('hmt',sc,ok))
        elif c.startswith('What is the remainder'):
            n,d,q=re.search(r'([\d,]+) ÷ (\d+) = (\d+) R',sc).groups(); add('rem'); checked+=1
            if int(ok)!=num(n)%int(d) or num(n)//int(d)!=int(q): bad.append(('rem',sc,ok))
        elif c.startswith('What should the check give back'):
            a,b,s2,b2=re.search(r'added ([\d,]+) \+ ([\d,]+)\. To check, he subtracts: ([\d,]+) − ([\d,]+)',sc).groups(); add('colCheck'); checked+=1
            if num(ok)!=num(s2)-num(b2) or num(s2)!=num(a)+num(b): bad.append(('cc',sc,ok))
        elif c.startswith('How many lines of symmetry'):
            want={'square':4,'rectangle that is not a square':2,'triangle with all sides equal':3,'heart shape':1}[re.search(r'Think of a (.+?)\.',sc).group(1)]; add('symCount'); checked+=1
            if int(ok)!=want: bad.append(('sym',sc,ok))
        else: add('other:'+c[:40])
    except Exception as e: bad.append(('parse',str(e),c,sc[:120],ok))
print('checked',checked,'of',len(S)); print('BAD',len(bad)); [print(' ',b) for b in bad[:25]]
print({k:v for k,v in sorted(kinds.items()) if k.startswith('other')})
