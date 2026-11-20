import json,re,sys
S=json.load(open(sys.argv[1],encoding='utf8')); MI='−'; bad=[]; k={}
def n(s): return int(s.replace(MI,'-'))
for s in S:
    c,h,ok=s['cap'],s.get('html',''),s['ok']
    try:
        if c.startswith('Which number is at the red dot'):
            cx=float(re.search(r'<circle cx="([\d.]+)" cy="40" r="7"',h).group(1)); v=round((cx-10)/14-10); k['nl']=k.get('nl',0)+1
            if n(ok)!=v: bad.append(('nl',v,ok))
        elif c.startswith('What are the coordinates of point P'):
            cx,cy=map(float,re.search(r'<circle cx="([\d.-]+)" cy="([\d.-]+)" r="6"',h).groups()); x=round((cx-120)/20); y=round((120-cy)/20); k['pt']=k.get('pt',0)+1
            got=tuple(n(t) for t in re.findall(r'[−-]?\d+',ok))
            if got!=(x,y): bad.append(('pt',(x,y),ok))
        elif c.startswith('What is the MODE'):
            cols=re.findall(r'line-height:1.05">((?:●<br>)*)</div><div[^>]*>(\d+)</div>',h); cnt={int(v):a.count('●') for a,v in cols}; m=max(cnt.values()); k['mode']=k.get('mode',0)+1
            if list(cnt.values()).count(m)!=1 or cnt[int(ok)]!=m: bad.append(('mode',cnt,ok))
        elif re.match(r'What is the (median|range|IQR)',c) and 'rect x=' in h:
            X=lambda x:round((float(x)-20)*50/260)
            r=re.findall(r'<rect x="([\d.]+)" y="25" width="([\d.]+)"',h); q1=X(r[0][0]); md=X(r[1][0]); q3=X(float(r[1][0])+float(r[1][1]))
            dots=[X(x) for x in re.findall(r'<circle cx="([\d.]+)" cy="45" r="4"',h)]; mn,mx=min(dots),max(dots)
            want=md if 'median' in c else (q3-q1 if 'IQR' in c else mx-mn); k['box']=k.get('box',0)+1
            if int(ok)!=want: bad.append(('box',c,(mn,q1,md,q3,mx),ok))
    except Exception as e: bad.append(('parse',repr(e),c))
print(k,'BAD',len(bad)); [print(' ',b) for b in bad[:10]]
