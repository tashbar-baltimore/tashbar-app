import json,re,sys
from fractions import Fraction as F
S=json.load(open(sys.argv[1],encoding='utf8')); bad=[]; checked=0; kinds={}
def n(s): return F(s.replace('−','-').replace(',','').replace('(','').replace(')','').replace('$',''))
def fs(x):
    x=F(x); 
    if x.denominator==1: return ('−' if x<0 else '')+str(abs(x.numerator))
    return ('−' if x<0 else '')+f'{abs(x.numerator)}/{x.denominator}'
def dec(x):
    x=round(float(x),3); s=('%.3f'%abs(x)).rstrip('0').rstrip('.'); return ('−' if x<0 else '')+s
def money(x):
    x=F(x); return str(x.numerator) if x.denominator==1 else '%.2f'%float(x)
NUM=r'−?\(?−?[\d.]+(?:/\d+)?\)?'
def add(k): kinds[k]=kinds.get(k,0)+1
for s in S:
    c,sc,ok,opts=s['cap'],s['scene'],s['ok'],s['opts']
    if len(set(opts))!=len(opts) or len(opts)<2: bad.append(('opts',c,opts)); continue
    if opts.count(ok)!=1: bad.append(('okcount',c,opts,ok)); continue
    try:
        w=None
        m=re.search(r'('+NUM+r') \+ ('+NUM+r') = \?',sc)
        if c.startswith('Add. Start at') or c.startswith('Add the decimals'):
            a,b=m.groups(); w=dec(n(a)+n(b)); k='add'
        elif c.startswith('Subtract. Change it'):
            a,b=re.search(r'('+NUM+r') − ('+NUM+r') = \?',sc).groups(); w=dec(n(a)-n(b)); k='sub'
        elif c.startswith('How far apart are') and 'number line' in c:
            a,b=re.search(r'are ('+NUM+r') and ('+NUM+r') on',c).groups(); w=str(abs(n(a)-n(b))); k='dist'
        elif c.startswith('Multiply. First decide'):
            a,b=re.search(r'('+NUM+r') × ('+NUM+r') = \?',sc).groups(); w=dec(n(a)*n(b)); k='mulInt'
        elif c.startswith('Divide. Same rule'):
            a,b=re.search(r'('+NUM+r') ÷ ('+NUM+r') = \?',sc).groups(); w=dec(n(a)/n(b)); k='divInt'
        elif c.startswith('Is the product positive'):
            p=1
            for x in re.findall(NUM,sc.split(' positive')[0]): p*=n(x)
            w='positive' if p>0 else 'negative'; k='sign'
        elif c.startswith('Multiply. Then simplify'):
            a,b=re.search(r'^('+NUM+r') × ('+NUM+r')',sc).groups(); w=fs(n(a)*n(b)); k='mulFrac'
        elif c.startswith('Divide. Keep, flip'):
            a,b=re.search(r'^('+NUM+r') ÷ ('+NUM+r')',sc).groups(); w=fs(n(a)/n(b)); k='divFrac'
        elif c=='Multiply.':
            a,b=re.search(r'^('+NUM+r') × ('+NUM+r')',sc).groups(); w=dec(n(a)*n(b)); k='mulDec'
        elif c.startswith('Write it as a decimal'):
            p,q=map(int,re.search(r'^(\d+)/(\d+)',sc).groups()); x=F(p,q); k='fracDec'
            t=q
            for f in (2,5):
                while t%f==0: t//=f
            if t==1: w=dec(x)
            else:
                if not ok.endswith('…') or abs(float(ok[:-1])-p/q)>0.001: bad.append(('rep',sc,ok))
                checked+=1; add(k); continue
        elif c.startswith('Does ') and 'end or repeat' in c:
            p,q=map(int,re.search(r'Does (\d+)/(\d+)',c).groups()); x=F(p,q); t=x.denominator
            for f in (2,5):
                while t%f==0: t//=f
            w='ends' if t==1 else 'repeats'; k='termRep'
        elif c.startswith('Which part repeats'):
            p,q=map(int,re.search(r'^(\d+)/(\d+)',sc).groups()); pre,rep=re.match(r'0\.(\d*)\[(\d+)\]',ok).groups()
            val=F(int(pre+rep) - (int(pre) if pre else 0), (10**len(rep)-1)*10**len(pre)); k='bar'
            w=ok if val==F(p,q) and all(not (lambda m: m and F(int(m[1]+m[2])-(int(m[1]) if m[1] else 0),(10**len(m[2])-1)*10**len(m[1]))==F(p,q))(re.match(r'0\.(\d*)\[(\d+)\]',o)) for o in opts if o!=ok) else 'BAD'
        elif c.startswith('What was the temperature at noon'):
            a,r=re.search(r'was ('+NUM+r')°C.*?(\d+) degrees warmer',sc).groups(); w=dec(n(a)+n(r))+'°C'; k='temp'
        elif c.startswith('Where is he now'):
            a,u=re.search(r'at ('+NUM+r') feet\. He swims up (\d+)',sc).groups(); w=dec(n(a)+n(u))+' feet'; k='diver'
        elif c.startswith('What was the change in temperature'):
            a,b=re.search(r'it was ('+NUM+r')°F\. Motzei Shabbos it was ('+NUM+r')°F',sc).groups(); d=n(b)-n(a); w=('+' if d>0 else '')+dec(d)+'°F'; k='change'
        elif c.startswith('What is the balance now'):
            a,p,g=re.search(r'had \$(\d+)\. They paid \$(\d+) for food baskets, then got \$(\d+)',sc).groups(); v=int(a)-int(p)+int(g); w=('−$'+str(-v)) if v<0 else '$'+str(v); k='money'
        elif c.startswith('What is the constant of proportionality'):
            nums=[n(x) for x in re.findall(r'[\d.]+',sc.split('Cost $')[0])]; ys=[n(x) for x in re.findall(r'[\d.]+',sc.split('Cost $')[1])][:len(nums)]; ks={y/x for x,y in zip(nums,ys)}
            assert len(ks)==1; w=dec(ks.pop()); k='kTable'
        elif c.startswith('Is this table proportional'):
            xs=[int(x) for x in re.search(r'x ([\d ]+) y',sc).group(1).split()]; ys=[int(x) for x in re.search(r' y ([\d ]+?) yes',sc).group(1).split()]; w='yes' if len({F(y,x) for x,y in zip(xs,ys)})==1 else 'no'; k='isProp'
        elif c.startswith('The points lie on a straight line'):
            x,y=re.search(r'\((\d+), (\d+)\)',sc).groups(); w=dec(F(int(y),int(x))); k='kGraph'
        elif c.startswith('The table is proportional'):
            a,b,ya=re.search(r'Boys (\d+) (\d+) Seforim (\d+) \?',sc).groups(); w=str(int(ya)//int(a)*int(b)); k='missProp'
        elif c.startswith('What is the total cost'):
            p,r=re.search(r'costs \$(\d+)\. Sales tax is (\d+)%',sc).groups(); w='$'+money(F(int(p))*(1+F(int(r),100))); k='tax'
        elif c.startswith('What is the sale price'):
            p,r=re.search(r'costs \$(\d+)\. It is (\d+)% off',sc).groups(); w='$'+money(F(int(p))*(1-F(int(r),100))); k='disc'
        elif c.startswith('What is the selling price'):
            p,r=re.search(r'for \$(\d+) and marks them up (\d+)%',sc).groups(); w='$'+money(F(int(p))*(1+F(int(r),100))); k='markup'
        elif c.startswith('How much interest'):
            p,r,t=re.search(r'\$([\d,]+) is saved at (\d+)% simple interest for (\d+) years',sc).groups(); v=int(p.replace(',',''))*int(r)*int(t)//100; w='$'+f'{v:,}'; k='interest'
        elif c.startswith('What is the percent change'):
            a,b=map(int,re.search(r'from (\d+) to (\d+)',sc).groups()); w=f'{abs(b-a)*100//a}% '+('increase' if b>a else 'decrease'); k='pct'
        elif c.startswith('Find the value'):
            a,b,x=re.search(r'^('+NUM+r')x \+ ('+NUM+r'), when x = ('+NUM+r')',sc).groups(); w=dec(n(a)*n(x)+n(b)); k='eval'
        elif c.startswith('Solve for x'):
            ex=sc.split(' x = ')[0]; m2=re.match(r'^(−?\d*)x(?: ([+−]) (\d+))? = ('+NUM+r')',ex)
            a=m2.group(1); a=-1 if a=='−' else (1 if a=='' else int(a.replace('−','-'))); b=0 if not m2.group(2) else (int(m2.group(3))*(1 if m2.group(2)=='+' else -1)); cc=n(m2.group(4))
            w='x = '+dec((cc-b)/a); k='solve'
        elif c.startswith('Solve the inequality'):
            m2=re.match(r'^(−?\d*)x(?: ([+−]) (\d+))? ([<>]) ('+NUM+r')',sc)
            a=m2.group(1); a=-1 if a=='−' else (1 if a=='' else int(a.replace('−','-'))); b=0 if not m2.group(2) else (int(m2.group(3))*(1 if m2.group(2)=='+' else -1)); sym=m2.group(4); cc=n(m2.group(5))
            if a<0: sym={'<':'>','>':'<'}[sym]
            w='x '+sym+' '+dec((cc-b)/a); k='ineq'
        elif c.startswith('How many hours did he ride'):
            fee,per,tot=map(int,re.search(r'costs \$(\d+) plus \$(\d+) per hour\. \w+ paid \$(\d+)',sc).groups()); w=str((tot-fee)//per); k='eqStory'
        elif c.startswith('How far apart are they really'):
            s1,d=map(int,re.search(r'stands for (\d+) km\. Two cities are (\d+) cm',sc).groups()); w=str(s1*d); k='scaleReal'
        elif c.startswith('How long is the wall in the drawing'):
            s1,r=map(int,re.search(r'1 inch for (\d+) feet\. The real wall is (\d+) feet',sc).groups()); w=str(r//s1); k='scaleDraw'
        elif c.startswith('Every side of a rectangle'):
            kk=int(re.search(r'made (\d+) times',c).group(1)); w=f'{kk*kk} times as big'; k='scaleArea'
        elif c.startswith('Find the circumference'):
            m2=re.search(r'r = (\d+)',sc); d=2*int(m2.group(1)) if m2 else int(re.search(r'diameter is (\d+)',sc).group(1)); w=dec(round(F(314,100)*d,1))+' cm'; w=('%.1f'%(3.14*d)).rstrip('0').rstrip('.')+' cm'; k='circC'
        elif c.startswith('Find the area. Use 3.14'):
            r=int(re.search(r'r = (\d+)',sc).group(1)); w=('%.1f'%round(3.14*r*r+1e-9,1)).rstrip('0').rstrip('.')+' sq cm'; k='circA'
        elif c.startswith('What is the other angle'):
            a=int(re.search(r'One is (\d+)°',sc).group(1)); w=str((90 if 'complementary' in sc else 180)-a); k='comp'
        elif c.startswith('What is the VERTICAL'):
            w=re.search(r'One angle is (\d+)°',sc).group(1); k='vert'
        elif c.startswith('What is the volume, in cubic cm'):
            l,wd,h=map(int,re.search(r'^(\d+) cm (\d+) (\d+)',sc).groups()); w=str(l*wd*h); k='vol'
        elif c.startswith('What is the surface area'):
            l,wd,h=map(int,re.search(r'^(\d+) cm (\d+) (\d+)',sc).groups()); w=str(2*(l*wd+l*h+wd*h)); k='sa'
        elif c.startswith('What is its volume, in cubic feet'):
            b,h,L=map(int,re.search(r'base (\d+) ft and height (\d+) ft\. The tent is (\d+) ft',sc).groups()); w=str(b*h*L//2); k='tri'
        elif c.startswith('About how many boys'):
            nn,kk,tot=map(int,re.search(r'sample of (\d+) boys, (\d+) play.*has (\d+) boys',sc).groups()); w=str(kk*tot//nn); k='predict'
        elif c.startswith('How much higher is the mean'):
            A=[int(x) for x in re.search(r'Class A pages read: ([\d, ]+)',sc).group(1).split(',')]; B=[int(x) for x in re.search(r'Class B pages read: ([\d, ]+?)(?: \d+ \d+ \d+)?$',sc).group(1).split(',')[:5]]
            w=str((sum(B)-sum(A))//5); k='means'
        elif c.startswith('One marble is picked'):
            col=re.search(r'it is (\w+)\?',c).group(1); t=sc.count('🔴')+sc.count('🔵')+sc.count('🟢'); m={'red':'🔴','blue':'🔵','green':'🟢'}[col]; w=fs(F(sc.count(m),t)); k='bag'
        elif c.startswith('What is the chance of NOT'):
            nn,kk=map(int,re.search(r'has (\d+) equal parts\. (\d+) are yellow',sc).groups()); w=fs(F(nn-kk,nn)); k='not'
        elif c.startswith('What is the chance of getting'):
            sizes={'a coin':2,'a number cube':6,'a spinner with 4 equal colors':4,'a spinner with 3 equal colors':3}
            a,b=re.search(r'You use (.+?) and (.+?)\.',sc).groups(); w=fs(F(1,sizes[a]*sizes[b])); k='two'
            ev=re.search(r'getting (.+?) AND (.+?)\?',c).groups(); prob={'heads':F(1,2),'tails':F(1,2),'a 6':F(1,6),'an even number':F(1,2),'red':F(1,4),'a 3':F(1,6),'blue':F(1,3),'a number less than 3':F(1,3)}
            w=fs(prob[ev[0]]*prob[ev[1]])
        elif c.startswith('How many different lunches'):
            a,b=map(int,re.search(r'(\d+) kinds of soup and (\d+) kinds',sc).groups()); w=str(a*b); k='lunch'
        elif c.startswith('Combine like terms') or c.startswith('Use the distributive'):
            add('algebra-text'); continue
        else: add('other:'+c[:40]); continue
        add(k); checked+=1
        if w!=ok: bad.append((k,c[:50],sc[:140],ok,w))
    except Exception as e: bad.append(('parse',repr(e),c[:50],sc[:140],ok))
print('checked',checked,'of',len(S)); print('BAD',len(bad)); [print(' ',b) for b in bad[:30]]
print(sorted(kinds.items()))
