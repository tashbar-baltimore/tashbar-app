
/* ================= 4th GRADE MATH (Level 5): 18 lessons, all 8 stations. Claude Code builder (yosef@ session), 2026-11-20.
   Same engine as 1st to 3rd grade. New problem kinds below. Every question is a tap (numbers or words).
   House rules kept: no picture draws crossing lines (perpendicular lines are drawn as a corner, never as a cross); boys' names; kosher food. ================= */
L.length=0;
try{ document.body.classList.add('g4calm'); document.head.insertAdjacentHTML('beforeend','<style>body.g4calm{background:linear-gradient(180deg,#EEF4FB,#F7F3EA)}body.g4calm .big-num{font-size:52px}.g4n{font:800 40px var(--f-head);letter-spacing:1px}.g4n b{color:#FF5D73;text-decoration:underline}.g4col{display:inline-grid;font:800 34px var(--f-head);text-align:right;gap:2px;padding:10px 16px;background:#fff;border-radius:14px;border:3px solid #DCE6F2}.g4col .ln{border-top:4px solid #1F2A44}.g4card{background:#fff;border:3px solid #DCE6F2;border-radius:16px;padding:12px 16px;font:700 20px var(--f-body);max-width:560px;margin:0 auto;text-align:left}.g4tag{display:inline-block;background:#3D8BFF;color:#fff;border-radius:10px;padding:2px 10px;margin:2px;font:800 18px var(--f-head)}.ch.wide{min-width:120px}</style>'); }catch(e){}
const fmt=n=>Number(n).toLocaleString('en-US');
const NAMES=['Dovid','Moshe','Yaakov','Shmuel','Eli','Avi','Chaim','Yehuda','Meir','Ari','Nosson','Binyomin','Tzvi','Yosef','Akiva','Reuven'];
const nm=()=>any(NAMES);
function uniq(a,ok,n){ const s=[ok]; for(const x of a){ if(s.length>=(n||3)) break; if(x!==ok&&s.indexOf(x)<0&&String(x).indexOf('-')<0&&String(x)!=='NaN') s.push(x); } return shuffle(s); }
function numC(ans,ext){ return uniq(shuffle(ext.filter(v=>v>=0&&v!==ans)).map(fmt),fmt(ans)); }
async function bigQ(pre,prompt,ans,ext,help){ return choiceText(numC(ans,ext),fmt(ans),prompt,help,pre); }
const PLACES=['ones','tens','hundreds','thousands','ten thousands','hundred thousands'];
function digitsHtml(n,hi){ const s=String(n); return '<div class="row"><span class="g4n">'+fmt(n).split('').map((ch,i,arr)=>{ let k=-1, c=0; for(let j=arr.length-1;j>=0;j--){ if(arr[j]===',') continue; if(j===i){ k=c; break; } c++; } return (ch!==','&&k===hi)?'<b>'+ch+'</b>':ch; }).join('')+'</span></div>'; }
function rnd6(lo){ return R(lo||100000,999999); }
/* --- place value to a million --- */
G.pvValue=async c=>{ const n=rnd6(c.lo), k=R(1,5), d=Math.floor(n/Math.pow(10,k))%10; if(d===0) return G.pvValue(c); const v=d*Math.pow(10,k);
  const f=await bigQ(digitsHtml(n,k),'What is the VALUE of the red digit?',v,[d*Math.pow(10,k+1),d*Math.pow(10,k-1),d],async()=>say('Find its place. The red digit is in the '+PLACES[k]+' place. So it is worth '+d+' '+PLACES[k]+'.')); return [f,'The '+d+' is in the '+PLACES[k]+' place. It is worth '+fmt(v)+'.']; };
G.pvPlace=async c=>{ const n=rnd6(c.lo), k=R(0,5); const f=await choiceText(uniq(shuffle(PLACES.filter((p,i)=>Math.abs(i-k)<=2)),PLACES[k]),PLACES[k],'Which place is the red digit in?',async()=>say('Start at the right: ones, tens, hundreds. Then the thousands family: thousands, ten thousands, hundred thousands.'),digitsHtml(n,k)); return [f,'It is in the '+PLACES[k]+' place.']; };
G.pvExpand=async c=>{ const n=rnd6(c.lo); const ds=String(n).split('').map(Number); const parts=ds.map((d,i)=>d*Math.pow(10,ds.length-1-i)).filter(x=>x>0);
  const swap=Number(String(n).split('').reverse().join('')); const f=await bigQ('<div class="g4card" style="text-align:center;font-size:24px">'+parts.map(fmt).join(' + ')+'</div>','Which number is this?',n,[swap,n+9000>999999?n-9000:n+9000,Math.floor(n/10)],async()=>say('Each part shows one digit and its place. Put each digit in its place.')); return [f,parts.map(fmt).join(' + ')+' = '+fmt(n)+'.']; };
G.pvCompare=async c=>{ let a=rnd6(c.lo), b; if(Math.random()<.6){ const k=R(1,4); b=a+(any([1,-1]))*R(1,9)*Math.pow(10,k); if(b<100000||b>999999) b=a+1; } else b=rnd6(c.lo); if(a===b) b=a+10;
  const ok=a>b?'>':'<'; const f=await choiceText(['>','<','='],ok,'Which sign goes in the box?',async()=>say('Line them up and compare from the LEFT. The first place where the digits are different decides.'),'<div class="row"><span class="g4n">'+fmt(a)+'</span><span class="big-num" style="color:#8E5BFF">□</span><span class="g4n">'+fmt(b)+'</span></div>'); return [f,fmt(a)+' '+ok+' '+fmt(b)+'.']; };
/* --- rounding --- */
G.roundAny=async c=>{ const to=c.to||any([10,100,1000,10000]); const n=R(to===10000?20000:1000,to===10000?990000:99999); const lo=Math.floor(n/to)*to, hi=lo+to; if(n===lo) return G.roundAny(c); const ans=(n-lo)>=to/2?hi:lo;
  const f=await choiceText(uniq([fmt(lo),fmt(hi),fmt(Math.round(n/(to*10))*to*10)],fmt(ans),2+ (Math.round(n/(to*10))*to*10!==lo&&Math.round(n/(to*10))*to*10!==hi?1:0)),fmt(ans),'Round '+fmt(n)+' to the nearest '+fmt(to)+'.',async()=>say('Find the two '+fmt(to)+'s it sits between: '+fmt(lo)+' and '+fmt(hi)+'. Look at the digit to the right of the rounding place. 5 or more rounds up.'),'<div class="row"><span class="g4n">'+fmt(n)+'</span></div>'); return [f,fmt(n)+' rounds to '+fmt(ans)+'.']; };
/* --- column add and subtract --- */
function colHtml(a,b,op){ const w=Math.max(fmt(a).length,fmt(b).length)+1; const pad=s=>' '.repeat(Math.max(0,w-s.length))+s; return '<div class="row"><div class="g4col"><div>'+pad(fmt(a))+'</div><div>'+op+pad(fmt(b)).slice(1)+'</div><div class="ln">?</div></div></div>'; }
function noCarryAdd(a,b){ let s='', x=String(a), y=String(b).padStart(x.length,'0'); for(let i=0;i<x.length;i++) s+=String((+x[i]+ +y[i])%10); return Number(s); }
function bigMinusSmall(a,b){ let s='', x=String(a), y=String(b).padStart(x.length,'0'); for(let i=0;i<x.length;i++) s+=String(Math.abs(+x[i]- +y[i])); return Number(s); }
G.colAdd=async c=>{ const a=R(c.lo||1000,c.hi||89999), b=R(c.lo||1000,Math.min(c.hi||89999,99999-a)); const ans=a+b; const f=await bigQ(colHtml(a,b,'+'),'Add. Line up the places.',ans,[noCarryAdd(a,b),ans+10,ans-100,ans+1000],async()=>say('Start with the ones. If a column makes 10 or more, carry the 1 to the next place.')); return [f,fmt(a)+' + '+fmt(b)+' = '+fmt(ans)+'.']; };
G.colSub=async c=>{ let a=R(c.lo||2000,c.hi||90000), b=R(1000,a-500); const ans=a-b; const f=await bigQ(colHtml(a,b,'−'),'Subtract. Line up the places.',ans,[bigMinusSmall(a,b),ans+100,ans-10,ans+1000],async()=>say('Start with the ones. If the top digit is smaller, regroup: borrow one from the next place, so it becomes 10 more.')); return [f,fmt(a)+' − '+fmt(b)+' = '+fmt(ans)+'.']; };
G.colCheck=async c=>{ const a=R(1000,8999), b=R(1000,8999), ans=a+b; const f=await bigQ('<div class="g4card">'+nm()+' added '+fmt(a)+' + '+fmt(b)+'. To check, he subtracts: '+fmt(ans)+' − '+fmt(b)+' = ?</div>','What should the check give back?',a,[b,ans,a+10],async()=>say('Adding and subtracting undo each other. Take away the number you added and you get back the first number.')); return [f,'The check gives back '+fmt(a)+'. The sum was right!']; };
/* --- factors, multiples, prime --- */
const PR=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
const factorsOf=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
G.factorPick=async c=>{ const n=any([12,16,18,20,24,28,30,32,36,40,42,45,48,54,56,60,63,64,72]); const fs=factorsOf(n).filter(d=>d>1&&d<n); const ok=any(fs); const nots=shuffle(Array.from({length:12},(_,i)=>i+2).filter(d=>n%d!==0)).slice(0,2);
  const f=await choiceText(shuffle([ok].concat(nots).map(String)),String(ok),'Which number is a FACTOR of '+n+'?',async()=>say('A factor divides in with nothing left over. Try it: does it go into '+n+' evenly?'),'<div class="row"><span class="g4n">'+n+'</span></div>'); return [f,ok+' × '+(n/ok)+' = '+n+', so '+ok+' is a factor of '+n+'.']; };
G.factorCount=async c=>{ const n=any([6,8,10,12,15,16,18,20,24]); const fs=factorsOf(n); const f=await numQ('<div class="row"><span class="g4n">'+n+'</span></div>','How many factors does '+n+' have? Count every one, 1 and '+n+' too.',fs.length,{lo:2,hi:12,extra:[fs.length-1,fs.length+1,fs.length-2],help:async()=>say('Find factor pairs: 1 and '+n+', then 2, 3, and so on, until the pairs meet.')}); return [f,'The factors of '+n+' are '+fs.join(', ')+'.']; };
G.primeComp=async c=>{ const n=Math.random()<.5?any(PR.filter(p=>p>10)):any([9,15,21,25,27,33,35,39,49,51,57,63,77,81,91]); const ok=PR.indexOf(n)>=0?'prime':'composite';
  const f=await choiceText(['prime','composite'],ok,'Is '+n+' prime or composite?',async()=>say('Prime: only 2 factors, 1 and itself. Composite: more than 2. Try dividing by 2, 3, 5 and 7.'),'<div class="row"><span class="g4n">'+n+'</span></div>'); return [f,n+' is '+ok+(ok==='composite'?': '+factorsOf(n).join(', ')+'.':': only 1 and '+n+'.')]; };
G.multiplePick=async c=>{ const k=R(3,9), ok=k*R(3,12); const nots=[ok+1,ok+k-1>ok+1?ok+k-1:ok+2,ok-1].filter(x=>x%k!==0); const f=await choiceText(uniq(nots.map(String),String(ok)),String(ok),'Which number is a MULTIPLE of '+k+'?',async()=>say('Multiples of '+k+' are what you say when you skip count by '+k+': '+[1,2,3,4,5].map(i=>i*k).join(', ')+', and on.')); return [f,ok+' = '+k+' × '+(ok/k)+'.']; };
/* --- times as many --- */
G.timesAsMany=async c=>{ const a=R(3,12), k=R(2,9), n1=nm(); let n2=nm(); while(n2===n1) n2=nm(); const it=any(['seforim','marbles','stickers','pages','coins']);
  const f=await numQ('<div class="g4card">'+n1+' has '+a+' '+it+'. '+n2+' has '+k+' times as many.</div>','How many '+it+' does '+n2+' have?',a*k,{lo:1,hi:120,extra:[a+k,a*k+a,a*k-a],help:async()=>say('Times as many means multiply: '+a+' times '+k+'.')}); return [f,a+' × '+k+' = '+(a*k)+'.']; };
G.howManyTimes=async c=>{ const a=R(2,9), k=R(2,9), n1=nm(); const f=await numQ('<div class="g4card">A small bookcase holds '+a+' Chumashim. The big one in shul holds '+(a*k)+'.</div>','How many times as many does the big one hold?',k,{lo:1,hi:12,extra:[a*k-a,k+1,k-1],help:async()=>say('Ask: '+a+' times what makes '+(a*k)+'? Divide: '+(a*k)+' divided by '+a+'.')}); return [f,(a*k)+' = '+k+' × '+a+'. '+k+' times as many.']; };
/* --- multiply --- */
G.mulBig=async c=>{ const a=c.two?R(12,98):R(c.lo||120,c.hi||4800), b=c.two?R(12,98):R(2,9); const ans=a*b; const t=Math.floor(a/10)*10, o=a%10;
  const f=await bigQ('<div class="row"><span class="g4n">'+fmt(a)+' × '+b+'</span></div>',c.two?'Multiply. Break a number into tens and ones.':'Multiply. Break the big number into parts.',ans,[a*b-b*o,ans+b,ans+10,a+b],async()=>say(c.two?'Split the second number: tens times the first number, plus ones times the first number. Then add.':'Split '+fmt(a)+' into place parts. Multiply each part by '+b+', then add them all.')); return [f,fmt(a)+' × '+b+' = '+fmt(ans)+'.']; };
G.areaModel=async c=>{ const a=R(12,49), b=R(3,9); const t=Math.floor(a/10)*10, o=a%10; if(!o) return G.areaModel(c);
  const box='<div class="row" style="gap:0;align-items:stretch"><div style="width:'+(t*3)+'px;max-width:46vw;height:90px;background:#D6F5E3;border:3px solid #2FBF71;display:flex;align-items:center;justify-content:center;font:800 20px var(--f-head)">'+t+' × '+b+'</div><div style="width:'+Math.max(56,o*12)+'px;height:90px;background:#FFF0C2;border:3px solid #FFC83D;border-left:0;display:flex;align-items:center;justify-content:center;font:800 18px var(--f-head)">'+o+' × '+b+'</div></div>';
  const f=await numQ(box+'<div class="row"><span class="g4n">'+a+' × '+b+'</span></div>','Add the two parts. What is '+a+' × '+b+'?',a*b,{lo:10,hi:500,extra:[t*b,a*b+b,t*b+o],help:async()=>say(t+' times '+b+' is '+(t*b)+'. '+o+' times '+b+' is '+(o*b)+'. Add them.')}); return [f,(t*b)+' + '+(o*b)+' = '+(a*b)+'.']; };
/* --- long division --- */
G.longDiv=async c=>{ const d=R(2,9), q=R(c.lo||12,c.hi||450), r=c.noR?0:R(0,d-1), n=q*d+r; const ok=q+(r?' R '+r:'');
  const opts=uniq(shuffle([(q+1)+(r?' R '+r:''),q+' R '+(r+1<d?r+1:0),(q-1)+' R '+(r+d<10?r+d:r),String(q*10)]),ok);
  const f=await choiceText(opts,ok,'Divide '+fmt(n)+' by '+d+'.',async()=>say('Divide, multiply, subtract, bring down. Repeat. What is left at the end, smaller than '+d+', is the remainder.'),'<div class="row"><span class="g4n">'+fmt(n)+' ÷ '+d+'</span></div>'); return [f,fmt(n)+' ÷ '+d+' = '+ok+'. Check: '+q+' × '+d+(r?' + '+r:'')+' = '+fmt(n)+'.']; };
G.divCheck=async c=>{ const d=R(3,9), q=R(20,99), r=R(1,d-1), n=q*d+r; const f=await numQ('<div class="g4card">'+fmt(n)+' ÷ '+d+' = '+q+' R ?</div>','What is the remainder?',r,{lo:0,hi:9,extra:[r+1,d-r,r-1],help:async()=>say(q+' times '+d+' is '+(q*d)+'. How much more to reach '+n+'?')}); return [f,q+' × '+d+' = '+(q*d)+', and '+n+' − '+(q*d)+' = '+r+'.']; };
/* --- remainders in stories --- */
G.leftover=async c=>{ const kind=c.kind||any(['up','drop','left']); const d=R(4,9), q=R(3,12), r=R(1,d-1), n=q*d+r; let txt,ans,ext;
  if(kind==='up'){ txt=n+' boys are going on a trip. Each van holds '+d+' boys. How many vans are needed so EVERY boy can go?'; ans=q+1; ext=[q,r,q+2]; }
  else if(kind==='drop'){ txt='There are '+n+' cookies. Each plate gets '+d+'. How many FULL plates can we make?'; ans=q; ext=[q+1,r,q-1]; }
  else { txt=n+' seforim are put on shelves, '+d+' on each shelf. How many seforim are LEFT OVER?'; ans=r; ext=[q,d-r,r+1]; }
  const f=await numQ('<div class="g4card">'+txt+'</div>','Think about the remainder!',ans,{lo:0,hi:200,extra:ext,help:async()=>say(n+' divided by '+d+' is '+q+' with '+r+' left over. Now read the question again: what does it ask for?')}); return [f,n+' ÷ '+d+' = '+q+' R '+r+', so the answer is '+ans+'.']; };
G.story5=async c=>{ const n=nm(), a=R(3,9), p=R(4,12), s=R(5,20); const ans=a*p-s; if(ans<=0) return G.story5(c);
  const f=await numQ('<div class="g4card">'+n+' buys '+a+' packs of '+p+' stickers. He gives away '+s+' stickers.</div>','How many stickers does he have now?',ans,{lo:0,hi:200,extra:[a*p+s,a+p-s>0?a+p-s:ans+5,a*p],help:async()=>say('Two steps. First multiply to find how many he bought: '+a+' times '+p+'. Then subtract what he gave away.')}); return [f,a+' × '+p+' = '+(a*p)+', then '+(a*p)+' − '+s+' = '+ans+'.']; };
/* --- fractions --- */
function fbarL(a,b,w){ return fbar(a,b,w||300); }
G.fracEq4=async c=>{ const base=any([[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[3,5],[1,6],[5,6]]), k=any([2,3,4].filter(m=>base[1]*m<=12)); const a=base[0]*k, b=base[1]*k;
  const ok=fr(a,b), wr=[fr(base[0]+k,base[1]+k),fr(a,b+1),fr(base[0]*k,base[1]+k)].filter(x=>x!==ok);
  const f=await choiceText(uniq(wr,ok),ok,'Which fraction is EQUAL to '+fr(base[0],base[1])+'?',async()=>say('Multiply the top AND the bottom by the same number. The bar is cut into more pieces, but the same amount is shaded.'),'<div class="row" style="flex-direction:column;gap:8px">'+fbarL(base[0],base[1])+fbarL(a,b)+'</div>'); return [f,fr(base[0],base[1])+' = '+ok+': top and bottom were both multiplied by '+k+'.']; };
G.fracMissing=async c=>{ const base=any([[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5]]), k=any([2,3,4,5].filter(m=>base[1]*m<=20)); const b=base[1]*k, a=base[0]*k;
  const f=await numQ('<div class="row"><span class="g4n">'+fr(base[0],base[1])+' = ?/'+b+'</span></div>','What is the missing top number?',a,{lo:1,hi:20,extra:[base[0]+k,a+1,b-a],help:async()=>say('The bottom went from '+base[1]+' to '+b+': times '+k+'. Do the same to the top.')}); return [f,fr(base[0],base[1])+' = '+fr(a,b)+'.']; };
G.fracCmp4=async c=>{ const P=[[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[3,5],[3,8],[5,8],[5,6],[1,6],[7,10],[3,10]]; let x=any(P), y=any(P); while(x[0]*y[1]===y[0]*x[1]) y=any(P);
  const ok=x[0]*y[1]>y[0]*x[1]?'>':'<'; const f=await choiceText(['>','<','='],ok,'Compare. Which sign goes in the box?',async()=>say('Use a benchmark: is each one more or less than one half? Or make the bottoms the same, then compare the tops.'),'<div class="row" style="flex-direction:column;gap:6px">'+fbarL(x[0],x[1],260)+fbarL(y[0],y[1],260)+'</div><div class="row"><span class="g4n">'+fr(x[0],x[1])+'</span><span class="big-num" style="color:#8E5BFF">□</span><span class="g4n">'+fr(y[0],y[1])+'</span></div>'); return [f,fr(x[0],x[1])+' '+ok+' '+fr(y[0],y[1])+'.']; };
G.fracAddLike=async c=>{ const b=any([4,5,6,8,10,12]), sub=c.sub!=null?c.sub:Math.random()<.4; let a1=R(1,b-1), a2=R(1,b-1); if(!sub&&a1+a2>b) a2=b-a1; if(sub&&a2>a1){ const t=a1; a1=a2; a2=t; } if(sub&&a1===a2) a1=Math.min(b,a1+1);
  const top=sub?a1-a2:a1+a2, ok=fr(top,b); const f=await choiceText(uniq([fr(top,b+b),fr(sub?a1+a2:Math.abs(a1-a2),b),fr(top+1,b)],ok),ok,(sub?'Subtract':'Add')+'. The bottoms are the same.',async()=>say('Same bottom: the pieces are the same size. '+(sub?'Subtract':'Add')+' the tops only. The bottom stays '+b+'.'),'<div class="row"><span class="g4n">'+fr(a1,b)+(sub?' − ':' + ')+fr(a2,b)+' = ?</span></div>'); return [f,fr(a1,b)+(sub?' − ':' + ')+fr(a2,b)+' = '+ok+'. Only the tops change.']; };
G.mixedToImp=async c=>{ const b=any([2,3,4,5,6,8]), w=R(1,4), a=R(1,b-1); const top=w*b+a, ok=fr(top,b); const f=await choiceText(uniq([fr(w+a,b),fr(w*a+b,b),fr(top,b*w)],ok),ok,'Write '+w+' and '+fr(a,b)+' as an improper fraction.',async()=>say('Each whole is '+b+' pieces. '+w+' wholes is '+w+' times '+b+' pieces. Add the '+a+' extra pieces.'),'<div class="row">'+Array.from({length:w},()=>fbar(b,b,110)).join('')+fbar(a,b,110)+'</div>'); return [f,w+' × '+b+' + '+a+' = '+top+', so '+ok+'.']; };
G.impToMixed=async c=>{ const b=any([2,3,4,5,6,8]), w=R(1,4), a=R(1,b-1), top=w*b+a; const ok=w+' '+fr(a,b); const f=await choiceText(uniq([(w+1)+' '+fr(a,b),w+' '+fr(b-a,b),a+' '+fr(w,b)],ok),ok,'Write '+fr(top,b)+' as a mixed number.',async()=>say('How many groups of '+b+' fit in '+top+'? That is the whole number. What is left over is the top of the fraction.'),'<div class="row"><span class="g4n">'+fr(top,b)+'</span></div>'); return [f,top+' ÷ '+b+' = '+w+' R '+a+', so '+ok+'.']; };
G.tenthsHund=async c=>{ const a=R(1,9); const f=await numQ('<div class="row"><span class="g4n">'+fr(a,10)+' = ?/100</span></div>','How many hundredths?',a*10,{lo:1,hi:100,extra:[a,a+10,a*100>100?a+1:a*100],help:async()=>say('1 tenth is the same as 10 hundredths. So '+a+' tenths is '+a+' times 10 hundredths.')}); return [f,fr(a,10)+' = '+fr(a*10,100)+'.']; };
G.decWrite=async c=>{ const h=R(1,99); const ok=(h/100).toFixed(2); const f=await choiceText(uniq([(h/10).toFixed(1),'0.'+String(h).padStart(3,'0'),String(h)+'.0'],ok),ok,'Write '+fr(h,100)+' as a decimal.',async()=>say('Hundredths have two places after the point: tenths, then hundredths.'),'<div class="row"><span class="g4n">'+fr(h,100)+'</span></div>'); return [f,fr(h,100)+' = '+ok+'.']; };
G.decCompare=async c=>{ let a=R(1,99)/100, b=R(1,9)/10; if(a===b) b=Math.min(.9,b+.1); const as=a.toFixed(2), bs=b.toFixed(1); const ok=a>b?'>':'<';
  const f=await choiceText(['>','<','='],ok,'Compare the decimals.',async()=>say('Write both with two places: '+bs+' is '+b.toFixed(2)+'. Now compare like whole numbers.'),'<div class="row"><span class="g4n">'+as+'</span><span class="big-num" style="color:#8E5BFF">□</span><span class="g4n">'+bs+'</span></div>'); return [f,as+' '+ok+' '+bs+' ('+as+' and '+b.toFixed(2)+').']; };
/* --- measurement --- */
const ONE={feet:'foot',yards:'yard',hours:'hour',minutes:'minute',kilograms:'kilogram',meters:'meter',liters:'liter',pounds:'pound',days:'day'};
const CONV=[['feet','inches',12],['yards','feet',3],['hours','minutes',60],['minutes','seconds',60],['kilograms','grams',1000],['meters','centimeters',100],['liters','milliliters',1000],['pounds','ounces',16],['days','hours',24]];
G.convert=async c=>{ const u=any(CONV), n=R(2,u[2]>=100?9:12), ans=n*u[2]; const f=await numQ('<div class="g4card" style="text-align:center"><span class="g4tag">1 '+ONE[u[0]]+' = '+u[2]+' '+u[1]+'</span></div>',n+' '+u[0]+' is how many '+u[1]+'?',ans,{lo:1,hi:100000,extra:[n+u[2],ans+u[2],Math.round(ans/10)],help:async()=>say('Big unit to small unit: multiply. '+n+' times '+u[2]+'.')}); return [f,n+' × '+u[2]+' = '+fmt(ans)+' '+u[1]+'.']; };
G.convWhich=async c=>{ const u=any(CONV); const f=await choiceText(uniq(['multiply by '+u[2],'divide by '+u[2],'add '+u[2]],'multiply by '+u[2]),'multiply by '+u[2],'To change '+u[0]+' into '+u[1]+', what do you do?',async()=>say('There are MORE of the small unit. Big to small: multiply.')); return [f,'Each '+ONE[u[0]]+' is '+u[2]+' '+u[1]+', so multiply by '+u[2]+'.']; };
function rectBox(w,h,u,col){ return '<div style="position:relative;width:'+Math.max(150,Math.min(270,w*14))+'px;height:'+Math.max(90,Math.min(170,h*12))+'px;background:'+(col||'#D6F5E3')+';border:3px solid #2FBF71;margin:28px auto"><span style="position:absolute;top:-26px;left:50%;transform:translateX(-50%);font:800 18px var(--f-head)">'+w+' '+u+'</span><span style="position:absolute;left:-54px;top:50%;transform:translateY(-50%);font:800 18px var(--f-head)">'+h+' '+u+'</span></div>'; }
G.areaF=async c=>{ const w=R(8,25), h=R(4,15); const f=await numQ(rectBox(w,h,'ft'),'The floor of a sukkah. What is its AREA in square feet?',w*h,{lo:10,hi:400,extra:[2*(w+h),w*h+w,w+h],help:async()=>say('Area = length × width: '+w+' times '+h+'.')}); return [f,'Area = '+w+' × '+h+' = '+(w*h)+' square feet.']; };
G.perimF=async c=>{ const w=R(8,40), h=R(4,25); const f=await numQ(rectBox(w,h,'m','#FFF0C2'),'A fence goes all around the yard. What is the PERIMETER?',2*(w+h),{lo:10,hi:200,extra:[w*h>200?w+h:w*h,w+h,2*w+h],help:async()=>say('Perimeter = all the way around: '+w+' + '+h+' + '+w+' + '+h+'. Or 2 times ('+w+' + '+h+').')}); return [f,'Perimeter = 2 × ('+w+' + '+h+') = '+(2*(w+h))+' m.']; };
G.missingSide=async c=>{ const w=R(4,12), h=R(3,12), A=w*h; const f=await numQ('<div class="g4card">A rectangle has an area of '+A+' square meters. One side is '+w+' meters long.</div>','How long is the other side?',h,{lo:1,hi:30,extra:[A-w,h+1,w],help:async()=>say(w+' times what makes '+A+'? Divide: '+A+' divided by '+w+'.')}); return [f,A+' ÷ '+w+' = '+h+' m.']; };
G.areaOrPerim4=async c=>{ const q=any([['carpet to cover the floor','area'],['a fence around the garden','perimeter'],['tiles for the Beis Midrash floor','area'],['a ribbon around a picture frame','perimeter'],['paint for a wall','area'],['a border around a bulletin board','perimeter']]);
  const f=await choiceText(['area','perimeter'],q[1],'Do you need the area or the perimeter for '+q[0]+'?',async()=>say('Covering the inside is area. Going around the edge is perimeter.')); return [f,q[0]+': '+q[1]+'.']; };
/* --- angles (two rays from one point; never crossing) --- */
function angleSvg(deg,pro){ const r=110, cx=130, cy=130, rad=deg*Math.PI/180; const x2=cx+r*Math.cos(rad), y2=cy-r*Math.sin(rad);
  let h='<svg viewBox="0 0 260 150" width="300" height="173" aria-hidden="true">';
  if(pro){ h+='<path d="M20,130 A110,110 0 0 1 240,130" fill="#F3F7FF" stroke="#8E9BB5" stroke-width="2"/>'; for(let d=0;d<=180;d+=10){ const a=d*Math.PI/180, l=d%30===0?12:6; h+='<line x1="'+(cx+110*Math.cos(a))+'" y1="'+(cy-110*Math.sin(a))+'" x2="'+(cx+(110-l)*Math.cos(a))+'" y2="'+(cy-(110-l)*Math.sin(a))+'" stroke="#8E9BB5" stroke-width="2"/>'; if(d%30===0) h+='<text x="'+(cx+88*Math.cos(a))+'" y="'+(cy-88*Math.sin(a)+5)+'" font-size="12" text-anchor="middle" fill="#6B7A99">'+d+'</text>'; } }
  h+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r)+'" y2="'+cy+'" stroke="#1F2A44" stroke-width="5" stroke-linecap="round"/><line x1="'+cx+'" y1="'+cy+'" x2="'+x2+'" y2="'+y2+'" stroke="#FF5D73" stroke-width="5" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+cy+'" r="5" fill="#1F2A44"/>';
  h+='<path d="M'+(cx+30)+','+cy+' A30,30 0 0 0 '+(cx+30*Math.cos(rad))+','+(cy-30*Math.sin(rad))+'" fill="none" stroke="#2FBF71" stroke-width="4"/></svg>'; return '<div class="row">'+h+'</div>'; }
G.angleRead=async c=>{ const d=any([20,30,40,50,60,70,80,100,110,120,130,140,150,160]); const f=await bigQ(angleSvg(d,true),'Read the protractor. How many degrees is the angle?',d,[180-d,d+10,d-10],async()=>say('Put the center on the corner. Start at 0 on the flat ray. Count up the numbers to the red ray.')); return [f,'The angle is '+d+' degrees.']; };
G.angleType=async c=>{ const d=any([25,40,60,75,90,90,110,135,150,180]); const ok=d<90?'acute':d===90?'right':d<180?'obtuse':'straight';
  const f=await choiceText(uniq(shuffle(['acute','right','obtuse','straight']),ok),ok,'What kind of angle is this?',async()=>say('Less than 90 degrees is acute. Exactly 90 is a right angle, like a square corner. More than 90 is obtuse. 180 is a straight line.'),angleSvg(d,false)); return [f,'It is '+d+' degrees: '+ok+'.']; };
G.angleAdd=async c=>{ const a=R(2,8)*10, b=R(2,8)*10; const f=await numQ('<div class="g4card">Two angles sit side by side. One is '+a+'°. The other is '+b+'°.</div>','How big is the whole angle?',a+b,{lo:20,hi:180,extra:[Math.abs(a-b),a+b+10,180-(a+b)>0?180-(a+b):a+b-10],help:async()=>say('Angles that sit side by side add up: '+a+' + '+b+'.')}); return [f,a+'° + '+b+'° = '+(a+b)+'°.']; };
/* --- lines and symmetry --- */
function linesSvg(kind){ let h='<svg viewBox="0 0 220 140" width="240" height="153" aria-hidden="true">';
  if(kind==='parallel') h+='<line x1="20" y1="40" x2="200" y2="40" stroke="#3D8BFF" stroke-width="6" stroke-linecap="round"/><line x1="20" y1="100" x2="200" y2="100" stroke="#FF5D73" stroke-width="6" stroke-linecap="round"/>';
  else if(kind==='perpendicular') h+='<line x1="50" y1="20" x2="50" y2="120" stroke="#3D8BFF" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="120" x2="200" y2="120" stroke="#FF5D73" stroke-width="6" stroke-linecap="round"/><rect x="50" y="104" width="16" height="16" fill="none" stroke="#1F2A44" stroke-width="2"/>';
  else h+='<line x1="30" y1="120" x2="190" y2="120" stroke="#3D8BFF" stroke-width="6" stroke-linecap="round"/><line x1="30" y1="120" x2="170" y2="30" stroke="#FF5D73" stroke-width="6" stroke-linecap="round"/>';
  return '<div class="row">'+h+'</svg></div>'; }
G.lineKind=async c=>{ const k=any(['parallel','perpendicular','meeting']); const ok=k==='meeting'?'they meet, but not square':k;
  const f=await choiceText(['parallel','perpendicular','they meet, but not square'],ok,'How do these two lines go together?',async()=>say('Parallel lines stay the same distance apart and never meet, like train tracks. Perpendicular lines meet at a square corner.'),linesSvg(k)); return [f,'These lines are '+(k==='meeting'?'meeting at a slant, not a square corner.':k+'.')]; };
G.lineWhere=async c=>{ const q=any([['the two rails of a train track','parallel'],['the corner where the wall meets the floor','perpendicular'],['the top and bottom edges of a page','parallel'],['the side and bottom edge of a door','perpendicular'],['two lines of a lined notebook','parallel']]);
  const f=await choiceText(['parallel','perpendicular'],q[1],'Are '+q[0]+' parallel or perpendicular?',async()=>say('Never meet, always the same distance: parallel. Meet at a square corner: perpendicular.')); return [f,q[0]+': '+q[1]+'.']; };
function symSvg(s,line){ const P={rect:'<rect x="40" y="40" width="140" height="80" rx="4"/>',square:'<rect x="60" y="20" width="100" height="100" rx="4"/>',tri:'<polygon points="110,15 185,125 35,125"/>',heart:'<path d="M110,125 C40,80 40,30 80,30 C98,30 110,45 110,55 C110,45 122,30 140,30 C180,30 180,80 110,125Z"/>',arrow:'<polygon points="20,70 110,20 110,50 200,50 200,90 110,90 110,120"/>'};
  let h='<svg viewBox="0 0 220 140" width="220" height="140" aria-hidden="true"><g fill="#E6F0FF" stroke="#1F2A44" stroke-width="3">'+P[s]+'</g>';
  if(line==='v') h+='<line x1="110" y1="5" x2="110" y2="135" stroke="#FF5D73" stroke-width="4" stroke-dasharray="8 6"/>';
  if(line==='h') h+='<line x1="5" y1="70" x2="215" y2="70" stroke="#FF5D73" stroke-width="4" stroke-dasharray="8 6"/>';
  if(line==='d') h+='<line x1="20" y1="10" x2="200" y2="130" stroke="#FF5D73" stroke-width="4" stroke-dasharray="8 6"/>';
  return h+'</svg>'; }
G.symLine=async c=>{ const cases=[['heart','v',true],['heart','h',false],['tri','v',true],['rect','v',true],['rect','d',false],['arrow','h',true],['arrow','v',false]]; const x=any(cases);
  const ok=x[2]?'yes':'no'; const f=await choiceText(['yes','no'],ok,'Is the dashed red line a line of symmetry?',async()=>say('Fold the shape on the line in your mind. If the two halves match exactly, it is a line of symmetry.'),'<div class="row">'+symSvg(x[0],x[1])+'</div>'); return [f,x[2]?'Yes: the two halves match.':'No: the two halves do not match when you fold.']; };
G.symCount=async c=>{ const x=any([['square',4],['rectangle that is not a square',2],['triangle with all sides equal',3],['heart shape',1]]); const f=await numQ('<div class="g4card">Think of a '+x[0]+'.</div>','How many lines of symmetry does it have?',x[1],{lo:0,hi:6,extra:[x[1]+1,x[1]-1,x[1]+2],help:async()=>say('Try each way to fold: up and down, side to side, corner to corner.')}); return [f,'A '+x[0]+' has '+x[1]+'.']; };
/* --- line plots with fractions (dots, no X marks) --- */
G.linePlotFr=async c=>{ const xs=['1/8','2/8','3/8','4/8','5/8'], v=xs.map(()=>R(0,4)); if(v.every(x=>!x)) v[2]=2; const k=R(0,4); const ask=c.ask||any(['count','most','diff']);
  const plot='<div class="row" style="gap:12px;align-items:flex-end">'+xs.map((x,i)=>'<div style="display:flex;flex-direction:column;align-items:center"><div style="color:#3D8BFF;font-size:20px;line-height:1.05">'+'●<br>'.repeat(v[i])+'</div><div style="border-top:3px solid #1F2A44;width:46px;text-align:center;font:800 16px var(--f-head)">'+x+'</div></div>').join('')+'</div><div class="row note">Lengths of leaves, in inches. Each dot is one leaf.</div>';
  let f,line; if(ask==='count'){ f=await numQ(plot,'How many leaves are '+xs[k]+' inch long?',v[k],{lo:0,hi:6,extra:[v[k]+1,v[(k+1)%5],v[k]-1],help:async()=>say('Find '+xs[k]+' on the line. Count the dots above it.')}); line=v[k]+' leaves.'; }
  else if(ask==='most'){ const m=Math.max(...v), i=v.indexOf(m); if(v.filter(x=>x===m).length>1) return G.linePlotFr(c); f=await choiceText(uniq(shuffle(xs.slice()),xs[i]),xs[i],'Which length has the MOST leaves?',async()=>say('Find the tallest stack of dots.'),plot); line=xs[i]+' has the most.'; }
  else { const nz=xs.map((x,i)=>v[i]?i:-1).filter(i=>i>=0); const lo=nz[0], hi=nz[nz.length-1]; if(lo===hi) return G.linePlotFr(c); const ok=fr(hi-lo,8); f=await choiceText(uniq([fr(hi+lo+2,8),fr(hi-lo+1,8),fr(hi-lo,16)],ok),ok,'How much longer is the longest leaf than the shortest?',async()=>say('Find the longest and the shortest that have dots. Subtract the eighths.'),plot); line=fr(hi+1,8)+' − '+fr(lo+1,8)+' = '+ok+'.'; }
  return [f,line]; };
/* --- patterns --- */
G.ruleNext=async c=>{ const st=R(1,15), d=R(3,12), n=R(5,7); const seq=Array.from({length:4},(_,i)=>st+i*d); const ans=st+(n-1)*d;
  const f=await numQ('<div class="g4card" style="text-align:center">Rule: start at '+st+', add '+d+' each time.<br><span class="g4n">'+seq.join(', ')+', …</span></div>','What is number '+n+' in the pattern?',ans,{lo:1,hi:200,extra:[ans+d,ans-d,st*n],help:async()=>say('Keep adding '+d+'. Count how many numbers you have written until you reach number '+n+'.')}); return [f,'Number '+n+' is '+ans+'.']; };
G.ruleFeature=async c=>{ const st=any([1,3,5,7]), d=2; const seq=Array.from({length:5},(_,i)=>st+i*d); const f=await choiceText(['all odd','all even','odd and even take turns'],'all odd','Rule: start at '+st+', add 2. What do you notice?',async()=>say('Odd plus 2 is always odd. Check: '+seq.join(', ')+'.'),'<div class="row"><span class="g4n">'+seq.join(', ')+'</span></div>'); return [f,'Odd plus 2 stays odd: '+seq.join(', ')+'.']; };
G.ruleFind=async c=>{ const m=Math.random()<.5, st=R(2,6), k=m?R(2,3):R(4,11); const seq=Array.from({length:4},(_,i)=>m?st*Math.pow(k,i):st+i*k); const ok=m?'multiply by '+k:'add '+k;
  const f=await choiceText(uniq([m?'add '+(seq[1]-seq[0]):'multiply by '+k,m?'multiply by '+(k+1):'add '+(k+1)],ok),ok,'What is the rule?',async()=>say('Check the jump between EVERY pair, not just the first two.'),'<div class="row"><span class="g4n">'+seq.join(', ')+'</span></div>'); return [f,'The rule is: '+ok+'.']; };

/* ================= LESSONS ================= */
const mk4=(id,t,e,sub,warm,story,movie,tog,pr,real,chk)=>({id,t,e,sub,warm,story:async()=>{ await M(story[0]); await say(story[1]); },movie,together:tog,practice:pr,real,check:chk});
/* --- DEEP FRACTIONS v1 (2026-11-20, Claude cloud builder, HoS chat): MATH.FRAC.L05.01 -> L05.02 -> L05.03 as ONE ladder.
   Every "build" problem joins three things: the PICTURE (fraction bar), the NUMBER SENTENCE, and the WHY.
   Wrong answers get feedback on THAT mistake (with a picture of what the wrong answer really means), then a fresh problem checks the same idea.
   L05.01 twins = cut every piece into k: k times the pieces, so top AND bottom times k.
   L05.02 same bottom = the bottom names the piece size, the top counts pieces; adding counts pieces, so the bottom stays.
   L05.03 mixed = one whole is b/b (a twin of 1), so w wholes and a/b is b/b + b/b + ... + a/b (same-bottom adding). --- */
try{ document.head.insertAdjacentHTML('beforeend','<style>'+
'.howM{max-width:560px;width:100%;box-sizing:border-box;background:#EEF4FF;border:3px dashed #9DBBF5;border-radius:16px;padding:6px 12px;font:700 15px/1.4 var(--f-body);text-align:left}'+
'.howM summary{cursor:pointer;font:800 16px var(--f-head);color:#2a63c0}.howM ol{margin:4px 0 2px;padding-left:22px}.howM .hs{border:0;background:#fff;border-radius:999px;padding:2px 10px;font:800 13px var(--f-body);cursor:pointer;margin-left:8px}'+
'.stepM{display:inline-block;background:#8E5BFF;color:#fff;border-radius:999px;padding:2px 12px;font:800 15px var(--f-head)}'+
'.cardM{max-width:520px;font:800 20px/1.3 var(--f-head);text-align:left}'+
'.barsM{display:flex;flex-direction:column;gap:8px;align-items:center}.barsM .lab{font:800 18px var(--f-head);color:#44506B}'+
'.wrongM{background:#FFF0F2;border:2px solid #FFB3BF;border-radius:14px;padding:6px 10px}'+
'</style>'); }catch(e){}
function howM(lines){ if(!helpOn()) return ''; return '<details class="howM"'+(MODE==='help'?' open':'')+'><summary>💡 How to do it<button class="hs" type="button" aria-label="Read How to do it">🔊</button></summary><ol>'+lines.map(l=>'<li>'+l+'</li>').join('')+'</ol></details>'; }
function wireHowM(lines){ const b=scene.querySelector('.howM .hs'); if(b) b.onclick=async e=>{ e.preventDefault(); e.stopPropagation(); if(BUSY) return; BUSY=true; try{ for(const l of lines) await say(l); } finally { BUSY=false; } }; }
const PN={2:'halves',3:'thirds',4:'fourths',5:'fifths',6:'sixths',8:'eighths',9:'ninths',10:'tenths',12:'twelfths',15:'fifteenths',16:'sixteenths',18:'eighteenths',20:'twentieths',24:'twenty-fourths'}, pn=b=>PN[b]||(b+'ths');
const YEL='#FFC83D', BLU='#7FB2FF';
function fbar2(a1,a2,b,w){ return '<div style="display:flex;width:'+(w||300)+'px;max-width:80vw;height:44px;border:3px solid #1F2A44;border-radius:6px;overflow:hidden">'+Array.from({length:b},(_,i)=>'<div style="flex:1;border-right:'+(i<b-1?'2px solid #1F2A44':'0')+';background:'+(i<a1?YEL:(i<a1+a2?BLU:'#fff'))+'"></div>').join('')+'</div>'; }
function barsM(rows){ return '<div class="barsM">'+rows.map(r=>(r[0]?'<div class="lab">'+r[0]+'</div>':'')+r[1]).join('')+'</div>'; }
/* one tap; each wrong option carries its own teaching (why: async). opts [{t, ok, why, card}] */
async function pickM(pre,opts,prompt,lines){ const card=opts.some(o=>o.card); opts=shuffle(opts);
  view(howM(lines||[])+pre+(card?'<div class="row" style="flex-direction:column;gap:10px">'+opts.map((o,k)=>'<button class="pic" type="button" data-k="'+k+'"'+(o.ok?' data-ok="1"':'')+' style="min-height:0;padding:8px 14px"><span class="cardM">'+o.t+'</span></button>').join('')+'</div>'
   :'<div class="choices">'+opts.map((o,k)=>'<button class="ch wide" type="button" data-k="'+k+'"'+(o.ok?' data-ok="1"':'')+' style="height:auto;min-height:84px;padding:8px 14px">'+o.t+'</button>').join('')+'</div>'));
  wireHowM(lines||[]); await say(prompt);
  return new Promise(res=>{ let first=true; scene.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{ if(BUSY||b.classList.contains('no')) return; const o=opts[+b.dataset.k];
    if(o.ok){ b.classList.add('yes'); chime(); scene.querySelectorAll('[data-k]').forEach(x=>x.onclick=null); res(first); }
    else { first=false; b.classList.add('no'); soft(); BUSY=true; try{ if(helpOn()&&o.why){ await o.why(); await say('Try again.'); } else await say('Look again. Try once more.'); } finally { BUSY=false; } } }); }); }
async function showWrong(html){ const d=document.createElement('div'); d.className='wrongM'; d.innerHTML=html; scene.appendChild(d); }
async function sayM(a){ for(const l of a) await say(l); }
const TW=[[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[3,5],[1,6],[5,6]];
function twinPair(){ const base=any(TW), k=any([2,3,4].filter(m=>base[1]*m<=12)); return {a:base[0],b:base[1],k,A:base[0]*k,B:base[1]*k}; }

/* ===== L05.01 FRACTION TWINS ===== */
G.twinBuildM=async c=>{ const t=twinPair(); let all=true;
  const L1=['Each shaded piece gets cut into '+t.k+' pieces.','Count the shaded pieces in the new bar.','Sister: 1/2, cut each piece in 3: 3/6.','Your turn: count, do not guess.'];
  const pre=barsM([['Before: '+fr(t.a,t.b),fbar(t.a,t.b,300)],['After: cut every piece into '+t.k,fbar(t.A,t.B,300)]])+'<div class="row"><span class="stepM">Step 1: the picture</span></div>';
  all=await pickM(pre,[{t:String(t.A),ok:true},(t.a+t.k!==t.A?{t:String(t.a+t.k),why:async()=>sayM(['You added '+t.k+'.','But each shaded piece became '+t.k+' pieces.','Count them in the bottom bar.'])}:{t:String(t.B),why:async()=>sayM([t.B+' is ALL the pieces.','Count only the shaded ones.'])}),{t:String(t.a),why:async()=>sayM(['That is the old count.','The pieces got smaller. Count the NEW shaded pieces.'])}],
    'The bar was '+fr(t.a,t.b)+'. We cut every piece into '+t.k+'. How many pieces are shaded now?',L1)&&all;
  const L2=['Top: shaded pieces. Bottom: all the pieces.','What happened to EACH number?','Sister: 1/2 became 3/6. 1 × 3, 2 × 3.','Your turn: which sentence shows the cut?'];
  all=await pickM(barsM([['',fbar(t.a,t.b,260)],['',fbar(t.A,t.B,260)]])+'<div class="row"><span class="stepM">Step 2: the number sentence</span></div>',[
    {t:'('+t.a+' × '+t.k+') / ('+t.b+' × '+t.k+') = '+fr(t.A,t.B),ok:true,card:1},
    {t:'('+t.a+' + '+t.k+') / ('+t.b+' + '+t.k+') = '+fr(t.a+t.k,t.b+t.k),card:1,why:async()=>{ await showWrong(barsM([[fr(t.a+t.k,t.b+t.k),fbar(t.a+t.k,t.b+t.k,260)]])); await sayM(['Look at that bar. It shades a different amount!','Adding changes the amount. Cutting multiplies.']); }},
    {t:t.a+' / ('+t.b+' × '+t.k+') = '+fr(t.a,t.B),card:1,why:async()=>{ await showWrong(barsM([[fr(t.a,t.B),fbar(t.a,t.B,260)]])); await sayM(['Look: that shades much less!','The pieces got smaller, but you did not count the new pieces.']); }}],
    'Which number sentence matches the picture?',L2)&&all;
  const L3=['Think about ONE shaded piece.','What happened to it when we cut?','Your turn: pick the reason, not a rule.'];
  all=await pickM('<div class="row"><span class="stepM">Step 3: the why</span></div><div class="row"><span class="g4n">'+fr(t.a,t.b)+' = '+fr(t.A,t.B)+'</span></div>',[
    {t:'Each shaded piece was cut into '+t.k+', so there are '+t.k+' times as many.',ok:true,card:1},
    {t:'The top must always get bigger.',card:1,why:async()=>sayM(['That is not a reason.','Think: what happened to each shaded piece?'])},
    {t:'So the numbers match.',card:1,why:async()=>sayM(['Matching is not the reason.','Look at one shaded piece. What did the cut do to it?'])}],
    'WHY do we multiply the top by '+t.k+' too?',L3)&&all;
  return [all,fr(t.a,t.b)+' = '+fr(t.A,t.B)+'. Same amount, cut '+t.k+' times smaller.']; };
G.twinPickM=async c=>{ const t=twinPair(); const L=['Multiply the top AND bottom by the same number.','Sister: 1/3 = 2/6. Both times 2.','Adding the same number is NOT a twin.','Your turn: which one is a true twin?'];
  const f=await pickM('<div class="row"><span class="g4n">'+fr(t.a,t.b)+' = ?</span></div>'+(helpOn()?'<div class="row">'+fbar(t.a,t.b,260)+'</div>':''),[
    {t:fr(t.A,t.B),ok:true},
    {t:fr(t.a+t.k,t.b+t.k),why:async()=>{ await showWrong(barsM([[fr(t.a,t.b),fbar(t.a,t.b,240)],[fr(t.a+t.k,t.b+t.k),fbar(t.a+t.k,t.b+t.k,240)]])); await sayM(['That adds '+t.k+' to the top and bottom.','See the bars? Different amounts. Not twins!']); }},
    {t:fr(t.a,t.B),why:async()=>{ await showWrong(barsM([[fr(t.a,t.b),fbar(t.a,t.b,240)],[fr(t.a,t.B),fbar(t.a,t.B,240)]])); await sayM(['Only the bottom changed.','Smaller pieces, same count: less is shaded. Not twins!']); }}],
    'Which fraction is a twin of '+fr(t.a,t.b)+'?',L);
  return [f,fr(t.a,t.b)+' = '+fr(t.A,t.B)+': top and bottom times '+t.k+'.']; };
G.twinMissingM=async c=>{ const t=twinPair(); const L=['Look at the bottoms first.','What number times the old bottom makes the new one?','Do the SAME to the top.','Sister: 2/5 = ?/10. 5 × 2 = 10, so 2 × 2.'];
  const add=t.a+(t.B-t.b);
  const f=await pickM('<div class="row"><span class="g4n">'+fr(t.a,t.b)+' = ?/'+t.B+'</span></div>',[
    {t:String(t.A),ok:true},
    {t:String(add===t.A?t.A+1:add),why:async()=>sayM(['You added '+(t.B-t.b)+', the jump on the bottom.','But the bottom was MULTIPLIED: '+t.b+' × '+t.k+' = '+t.B+'.','Multiply the top the same way.'])},
    {t:String(t.a),why:async()=>sayM(['The pieces got '+t.k+' times smaller.','So you need '+t.k+' times as many pieces on top.'])}],
    'What is the missing top number?',L);
  return [f,fr(t.a,t.b)+' = '+fr(t.A,t.B)+'.']; };
G.twinCompareM=async c=>{ const t=twinPair(); let c2=t.A+any([-1,1]); if(c2<=0||c2>=t.B) c2=t.A+(t.A+1<t.B?1:-1); const ok=t.A>c2?'>':'<';
  const L=['Different bottoms? Make a twin with the SAME bottom.','Then the pieces are the same size.','Compare the tops.','Sister: 1/2 vs 3/8. 1/2 = 4/8. 4 > 3.'];
  const bigBottomWrong=ok==='>'?'<':'>';
  const f=await pickM('<div class="row" style="flex-direction:column;gap:6px">'+fbar(t.a,t.b,260)+fbar(c2,t.B,260)+'</div><div class="row"><span class="g4n">'+fr(t.a,t.b)+' □ '+fr(c2,t.B)+'</span></div>',[
    {t:ok,ok:true},
    {t:bigBottomWrong,why:async()=>{ await showWrong('<div class="row"><span class="g4n">'+fr(t.a,t.b)+' = '+fr(t.A,t.B)+'</span></div>'); await sayM(['Make a twin first: '+fr(t.a,t.b)+' is '+fr(t.A,t.B)+'.','Now the pieces are the same size.','Compare '+t.A+' pieces and '+c2+' pieces.']); }},
    {t:'=',why:async()=>sayM(['Twins have the SAME amount.','Make '+fr(t.a,t.b)+' into '+pn(t.B)+'. Is it '+c2+'?'])}],
    'Compare. Which sign goes in the box?',L);
  return [f,fr(t.a,t.b)+' = '+fr(t.A,t.B)+', so '+fr(t.a,t.b)+' '+ok+' '+fr(c2,t.B)+'.']; };
G.twinJudgeM=async c=>{ const t=twinPair(), n=nm(); const L=['Draw it in your head: two bars.','Do they shade the same amount?','Your turn: who is right, and WHY?'];
  const f=await pickM('<div class="g4card">'+n+' says '+fr(t.a,t.b)+' = '+fr(t.a+1,t.b+1)+', because he added 1 to the top and the bottom.</div>',[
    {t:'No. Adding changes the amount. Twins multiply top and bottom.',ok:true,card:1},
    {t:'Yes. Both numbers got 1 more, so it is fair.',card:1,why:async()=>{ await showWrong(barsM([[fr(t.a,t.b),fbar(t.a,t.b,240)],[fr(t.a+1,t.b+1),fbar(t.a+1,t.b+1,240)]])); await say('Fair to the numbers, but look at the bars. Not the same amount!'); }},
    {t:'No. The bottom can never change.',card:1,why:async()=>sayM(['The bottom CAN change: 1/2 = 2/4.','What matters is how it changes.'])}],
    'Is '+n+' right?',L);
  return [f,fr(t.a,t.b)+' is not '+fr(t.a+1,t.b+1)+'. A twin is '+fr(t.A,t.B)+'.']; };

/* ===== L05.02 SAME-BOTTOM SUMS ===== */
function addPair(sub){ const b=any([4,5,6,8,10,12]); let a1=R(1,b-2), a2=R(1,b-1-a1); if(sub){ const x=R(2,b-1), y=R(1,x-1); return {b,a1:x,a2:y,sub:true}; } return {b,a1,a2,sub:false}; }
G.addBuildM=async c=>{ const p=addPair(false), s=p.a1+p.a2; let all=true;
  const L1=['The bottom tells the SIZE of each piece.','Count the yellow pieces, then the blue pieces.','Your turn: how many pieces are shaded in all?'];
  all=await pickM(barsM([[fr(p.a1,p.b)+' yellow and '+fr(p.a2,p.b)+' blue',fbar2(p.a1,p.a2,p.b,300)]])+'<div class="row"><span class="stepM">Step 1: the picture</span></div>',[
    {t:String(s),ok:true},{t:String(s+1!==p.b?s+1:s-1),why:async()=>say('Count again, one piece at a time.')},{t:String(p.b),why:async()=>sayM([p.b+' is ALL the pieces in the bar.','Count only the shaded ones.'])}],
    'How many pieces are shaded in all?',L1)&&all;
  const L2=['The pieces are '+pn(p.b)+'. Did their size change?','Sister: 1 apple + 2 apples = 3 apples, not 3 big apples.','Your turn: which sentence matches the bar?'];
  all=await pickM('<div class="row">'+fbar2(p.a1,p.a2,p.b,280)+'</div><div class="row"><span class="stepM">Step 2: the number sentence</span></div>',[
    {t:fr(p.a1,p.b)+' + '+fr(p.a2,p.b)+' = '+fr(s,p.b),ok:true,card:1},
    {t:fr(p.a1,p.b)+' + '+fr(p.a2,p.b)+' = '+fr(s,2*p.b),card:1,why:async()=>{ await showWrong(barsM([[fr(s,2*p.b),fbar(s,2*p.b,280)]])); await sayM(['Look at that bar: tiny pieces, much less shaded!','Adding cannot make less. The pieces are still '+pn(p.b)+'.']); }},
    {t:fr(p.a1,p.b)+' + '+fr(p.a2,p.b)+' = '+fr(p.a1*p.a2===s?s+1:p.a1*p.a2,p.b),card:1,why:async()=>sayM(['That multiplied the tops.','Adding means counting the pieces together.'])}],
    'Which number sentence matches the bar?',L2)&&all;
  all=await pickM('<div class="row"><span class="stepM">Step 3: the why</span></div><div class="row"><span class="g4n">'+fr(p.a1,p.b)+' + '+fr(p.a2,p.b)+' = '+fr(s,p.b)+'</span></div>',[
    {t:'The pieces are still '+pn(p.b)+'. We only counted more of them.',ok:true,card:1},
    {t:'You are not allowed to add bottoms.',card:1,why:async()=>sayM(['That is a rule, not a reason.','What does the bottom TELL us?'])},
    {t:'The bottom is always the biggest number.',card:1,why:async()=>sayM(['Not always! 5/4 has a bigger top.','Think: what does the bottom number name?'])}],
    'WHY does the bottom stay '+p.b+'?',['The bottom names the piece size.','The top counts pieces.','Your turn: pick the reason.'])&&all;
  return [all,fr(p.a1,p.b)+' + '+fr(p.a2,p.b)+' = '+fr(s,p.b)+'. Same size pieces, more of them.']; };
G.addPickM=async c=>{ const p=addPair(c.sub!=null?c.sub:Math.random()<.4), top=p.sub?p.a1-p.a2:p.a1+p.a2, op=p.sub?' − ':' + ';
  const L=['Same bottom means same size pieces.','Count the pieces: '+(p.sub?'take away':'add')+' the tops.','Keep the bottom.','Sister: 5/9 − 2/9 = 3/9.'];
  const choices=[{t:fr(top,p.b),ok:true},
    p.sub?{t:fr(p.a1+p.a2,p.b),why:async()=>sayM(['That ADDED the tops.','The sign says take away.'])}:{t:fr(top,p.b*2),why:async()=>{ await showWrong(barsM([[fr(top,2*p.b),fbar(Math.min(top,2*p.b),2*p.b,260)]])); await sayM(['You added the bottoms too.','The pieces are still '+pn(p.b)+', so the bottom stays '+p.b+'.']); }},
    {t:fr(top+1,p.b),why:async()=>sayM(['Close! Count the pieces again carefully.',fr(p.a1,p.b)+op+fr(p.a2,p.b)+': '+p.a1+(p.sub?' take away ':' and ')+p.a2+'.'])}];
  const f=await pickM('<div class="row">'+(helpOn()?(p.sub?fbar(p.a1,p.b,280):fbar2(p.a1,p.a2,p.b,280)):'')+'</div><div class="row"><span class="g4n">'+fr(p.a1,p.b)+op+fr(p.a2,p.b)+' = ?</span></div>',choices,(p.sub?'Subtract':'Add')+'. The bottoms are the same.',L);
  return [f,fr(p.a1,p.b)+op+fr(p.a2,p.b)+' = '+fr(top,p.b)+'. Only the tops change.']; };
G.addJudgeM=async c=>{ const p=addPair(false), s=p.a1+p.a2, n=nm(); const L=['Check the answer with a picture.','Is the answer MORE than each part?','Your turn: find the mistake, and say why.'];
  const f=await pickM('<div class="g4card">'+n+' says '+fr(p.a1,p.b)+' + '+fr(p.a2,p.b)+' = '+fr(s,2*p.b)+'.</div>',[
    {t:'He added the bottoms. The pieces are still '+pn(p.b)+'.',ok:true,card:1},
    {t:'He added the tops. He should multiply them.',card:1,why:async()=>sayM(['Adding the tops is right!','Look at his bottom number.'])},
    {t:'Nothing. He is right.',card:1,why:async()=>{ await showWrong(barsM([[fr(p.a2,p.b),fbar(p.a2,p.b,240)],[fr(s,2*p.b),fbar(s,2*p.b,240)]])); await say('His answer is about as much as just one part! Something is wrong.'); }}],
    'What did '+n+' do wrong?',L);
  return [f,fr(p.a1,p.b)+' + '+fr(p.a2,p.b)+' = '+fr(s,p.b)+', not '+fr(s,2*p.b)+'.']; };
G.makeWholeM=async c=>{ const b=any([3,4,5,6,8,10]), a=R(1,b-1); const L=['One whole bar is '+b+'/'+b+'. A twin of 1!','How many pieces are still empty?','Sister: 3/5 + 2/5 = 5/5 = 1.'];
  const f=await pickM('<div class="row">'+fbar(a,b,280)+'</div><div class="row"><span class="g4n">'+fr(a,b)+' + ?/'+b+' = 1</span></div>',[
    {t:String(b-a),ok:true},{t:String(b),why:async()=>sayM([b+'/'+b+' is a whole by itself.','We already have '+a+' pieces. How many MORE fill the bar?'])},
    {t:String(b-a===1?b-a+1:1),why:async()=>sayM(['Count the empty pieces in the bar.'])}],
    'How many more '+pn(b)+' make one whole?',L);
  return [f,fr(a,b)+' + '+fr(b-a,b)+' = '+fr(b,b)+' = 1.']; };
G.addTwinM=async c=>{ const half=any([2,3,4,5]), b=half*2, a1=R(1,half-1), a2=half-a1; const L=['First add: count the pieces.','Then look: is it half the bar?','Sister: 3/6 is a twin of 1/2.'];
  const f=await pickM('<div class="row">'+fbar2(a1,a2,b,280)+'</div><div class="row"><span class="g4n">'+fr(a1,b)+' + '+fr(a2,b)+' = '+fr(half,b)+' = ?</span></div>',[
    {t:'1/2',ok:true},{t:fr(half,b*2),why:async()=>sayM(['That doubled the bottom.','Look at the bar. How much is shaded?'])},{t:fr(1,b),why:async()=>sayM(['1/'+b+' is just ONE piece.','Look at how much of the bar is shaded.'])}],
    'Which simpler twin is the same amount?',L);
  return [f,fr(half,b)+' = 1/2.']; };

/* ===== L05.03 MIXED UP ===== */
function mixPair(){ const b=any([3,4,5,6,8]), w=R(1,3), a=R(1,b-1); return {b,w,a,T:w*b+a}; }
G.mixBuildM=async c=>{ const m=mixPair(); let all=true; const bars='<div class="row" style="flex-wrap:wrap">'+Array.from({length:m.w},()=>fbar(m.b,m.b,110)).join('')+fbar(m.a,m.b,110)+'</div>';
  const L1=['Each whole bar has '+m.b+' pieces.','Count all the shaded pieces, in every bar.','Your turn: count by '+m.b+'s for the wholes.'];
  all=await pickM(bars+'<div class="row"><span class="g4n">'+m.w+' '+fr(m.a,m.b)+'</span><span class="stepM">Step 1: the picture</span></div>',[
    {t:String(m.T),ok:true},{t:String(m.w+m.a),why:async()=>sayM(['You counted each whole as ONE piece.','But each whole bar has '+m.b+' pieces.'])},
    {t:String(m.w===1?m.T+1:m.w*m.a+m.b),why:async()=>sayM(['Count the pieces in the bars, one bar at a time.'])}],
    'How many '+pn(m.b)+' are shaded in all?',L1)&&all;
  const whole=fr(m.b,m.b), sum=Array.from({length:m.w},()=>whole).join(' + ')+' + '+fr(m.a,m.b);
  all=await pickM(bars+'<div class="row"><span class="stepM">Step 2: the number sentence</span></div>',[
    {t:sum+' = '+fr(m.T,m.b),ok:true,card:1},
    (m.w!==m.b?{t:fr(m.w,m.b)+' + '+fr(m.a,m.b)+' = '+fr(m.w+m.a,m.b),card:1,why:async()=>sayM(['That turns each whole into one tiny piece.','A whole is '+whole+', not 1/'+m.b+'.'])}:{t:sum+' = '+fr(m.T,m.w*m.b),card:1,why:async()=>sayM(['The pieces are still '+pn(m.b)+'.','Same bottom: add the tops only.'])}),
    (m.w>1?{t:whole+' + '+fr(m.a,m.b)+' = '+fr(m.b+m.a,m.b),card:1,why:async()=>sayM(['That counts only ONE whole.','How many whole bars are there?'])}:{t:whole+' + '+fr(m.a,m.b)+' = '+fr(m.T,2*m.b),card:1,why:async()=>sayM(['The pieces are still '+pn(m.b)+'.','Same bottom: add the tops only.'])})],
    'Which number sentence matches the bars?',['Each whole is '+whole+', a twin of 1.','Add same-bottom fractions: count the pieces.','Your turn: which sentence adds every bar?'])&&all;
  all=await pickM('<div class="row"><span class="stepM">Step 3: the why</span></div><div class="row"><span class="g4n">'+m.w+' '+fr(m.a,m.b)+' = '+fr(m.T,m.b)+'</span></div>',[
    {t:'Each whole is '+whole+', so '+m.w+' wholes are '+(m.w*m.b)+' pieces, plus '+m.a+'.',ok:true,card:1},
    {t:'You always multiply the two numbers you see.',card:1,why:async()=>sayM(['That is a trick, not a reason.','Why does each whole count as '+m.b+'?'])},
    {t:'Because '+m.w+' + '+m.a+' = '+(m.w+m.a)+'.',card:1,why:async()=>sayM(['That adds wholes and pieces like they are the same size.','They are not!'])}],
    'WHY is it '+m.T+'?',['Think about the size of a whole.','A whole bar has '+m.b+' pieces.'])&&all;
  return [all,m.w+' '+fr(m.a,m.b)+' = '+fr(m.T,m.b)+'.']; };
G.m2iPickM=async c=>{ const m=mixPair(); const L=['Each whole is '+m.b+'/'+m.b+'.','Wholes × '+m.b+', then add the extra pieces.','Sister: 2 1/3 → 2 × 3 + 1 = 7, so 7/3.'];
  const f=await pickM((helpOn()?'<div class="row" style="flex-wrap:wrap">'+Array.from({length:m.w},()=>fbar(m.b,m.b,100)).join('')+fbar(m.a,m.b,100)+'</div>':'')+'<div class="row"><span class="g4n">'+m.w+' '+fr(m.a,m.b)+' = ?</span></div>',[
    {t:fr(m.T,m.b),ok:true},{t:fr(m.w+m.a,m.b),why:async()=>sayM(['You added '+m.w+' + '+m.a+'.','But each whole is '+m.b+' pieces, not 1.'])},
    {t:fr(m.w*m.a+m.b===m.T?m.T+1:m.w*m.a+m.b,m.b),why:async()=>sayM(['Mixed up the numbers!','Multiply the WHOLES by the bottom: '+m.w+' × '+m.b+'.'])}],
    'Write '+m.w+' and '+fr(m.a,m.b)+' as an improper fraction.',L);
  return [f,m.w+' × '+m.b+' + '+m.a+' = '+m.T+', so '+fr(m.T,m.b)+'.']; };
G.i2mPickM=async c=>{ const m=mixPair(); const L=['How many groups of '+m.b+' fit in '+m.T+'?','Each group of '+m.b+' is one whole.','What is left over stays a fraction.','Sister: 7/3 → two 3s make 6, 1 left: 2 1/3.'];
  const okT=m.w+' '+fr(m.a,m.b); const f=await pickM('<div class="row"><span class="g4n">'+fr(m.T,m.b)+' = ?</span></div>',[
    {t:okT,ok:true},{t:(m.w+1)+' '+fr(m.a,m.b),why:async()=>sayM(['Check: '+(m.w+1)+' × '+m.b+' = '+((m.w+1)*m.b)+'.','That is MORE than '+m.T+'. Too many wholes!'])},
    {t:m.w+' '+fr(m.b-m.a===m.a?m.a+1>=m.b?m.a-1:m.a+1:m.b-m.a,m.b),why:async()=>sayM(['The whole number is right.','Now: '+m.T+' take away '+(m.w*m.b)+'. What is left?'])}],
    'Write '+fr(m.T,m.b)+' as a mixed number.',L);
  return [f,m.T+' ÷ '+m.b+' = '+m.w+' R '+m.a+', so '+okT+'.']; };
G.mixAddM=async c=>{ const b=any([3,4,5,6,8]); let a1=R(2,b-1), a2=R(b-a1+1,b-1); if(a1+a2<=b) a2=b-a1+1; const s=a1+a2, w=Math.floor(s/b), r=s%b; if(!r) return G.mixAddM(c);
  const L=['Step 1: same bottom, add the tops.','Step 2: one whole is '+b+'/'+b+'.','Take out the whole. What is left?','Sister: 4/5 + 3/5 = 7/5 = 1 2/5.'];
  const okT=w+' '+fr(r,b); const f=await pickM((helpOn()?'<div class="row">'+fbar(a1,b,200)+fbar(a2,b,200)+'</div>':'')+'<div class="row"><span class="g4n">'+fr(a1,b)+' + '+fr(a2,b)+' = ?</span></div>',[
    {t:okT,ok:true},{t:'1 '+fr(s,b),why:async()=>sayM(['You have '+s+'/'+b+'. One whole is '+b+'/'+b+'.','Take the whole OUT of the '+s+' pieces.'])},
    {t:fr(s,2*b),why:async()=>sayM(['Same bottom: the pieces are still '+pn(b)+'.','Do not add the bottoms.'])}],
    'Add. Write the answer as a mixed number.',L);
  return [f,fr(a1,b)+' + '+fr(a2,b)+' = '+fr(s,b)+' = '+okT+'.']; };
G.mixJudgeM=async c=>{ const m=mixPair(), n=nm(); const L=['Draw the bars in your head.','How many pieces is ONE whole?','Your turn: find the mistake, and say why.'];
  const f=await pickM('<div class="g4card">'+n+' says '+m.w+' '+fr(m.a,m.b)+' = '+fr(m.w+m.a,m.b)+'.</div>',[
    {t:'He counted each whole as 1 piece. A whole is '+m.b+'/'+m.b+'.',ok:true,card:1},
    {t:'He should have added the bottoms too.',card:1,why:async()=>sayM(['Adding bottoms is never right for same-size pieces.','Think about the wholes.'])},
    {t:'Nothing. He is right.',card:1,why:async()=>{ await showWrong('<div class="row" style="flex-wrap:wrap">'+Array.from({length:m.w},()=>fbar(m.b,m.b,90)).join('')+fbar(m.a,m.b,90)+'</div>'); await say('Count the shaded pieces. Is it '+(m.w+m.a)+'?'); }}],
    'What did '+n+' do wrong?',L);
  return [f,m.w+' '+fr(m.a,m.b)+' = '+fr(m.T,m.b)+'.']; };

/* ===== the three lessons (same ids; replace the old lines) ===== */
const FRAC3={
'MATH.FRAC.L05.01':mk4('MATH.FRAC.L05.01','Fraction Twins','👯','equivalent fractions and comparing fractions',[['fracShade'],['fracEquiv']],['<div class="row">'+fbar(1,2,200)+'</div><div class="row">'+fbar(2,4,200)+'</div>','Different names, same amount! Today you will SEE why twins are equal.'],
 async()=>{ await M(barsM([['2/3',fbar(2,3,300)]])); await say('Here is two thirds. Watch: I cut every piece into 2.');
  await M(barsM([['2/3',fbar(2,3,300)],['every piece cut in 2',fbar(4,6,300)]])); await say('Now there are 6 pieces in all, and 4 are shaded.'); await say('Same amount shaded. Two thirds equals four sixths.');
  await say('Number sentence: 2 times 2 over 3 times 2 is 4 sixths.'); await say('Why times 2 on top too? Each shaded piece was cut into 2.');
  await M(barsM([['2/3',fbar(2,3,300)],['3/4',fbar(3,4,300)]])); await say('Careful! Adding 1 to the top and bottom gives 3 fourths.'); await say('Look at the bars. 3 fourths shades more. Adding does not make a twin.');
  await M(barsM([['2/3 = 4/6',fbar(4,6,300)],['5/6',fbar(5,6,300)]])); await say('To compare 2 thirds and 5 sixths, make a twin: 2 thirds is 4 sixths.'); await say('Now the pieces are the same size. 4 sixths is less than 5 sixths.'); },
 [['twinBuildM'],['twinPickM'],['twinJudgeM']],[['twinMissingM'],['twinPickM'],['twinCompareM'],['twinBuildM'],['twinMissingM'],['twinCompareM'],['twinJudgeM'],['twinPickM']],['twinCompareM',{intro:'Who learned more of the masechta? Make twins to find out.'}],[['twinPickM'],['twinMissingM'],['twinCompareM']]),
'MATH.FRAC.L05.02':mk4('MATH.FRAC.L05.02','Same-Bottom Sums','➕','add and subtract fractions with like denominators',[['twinPickM'],['fracShade']],['<div class="row">'+fbar2(2,3,8,260)+'</div>','The bottom names the piece. The top counts the pieces.'],
 async()=>{ await M('<div class="row">'+fbar2(2,3,8,300)+'</div>'); await say('2 eighths in yellow, 3 eighths in blue. Count the pieces: 5.'); await say('The pieces are still eighths. So 2 eighths plus 3 eighths is 5 eighths.'); await say('The bottom names the piece. The top counts pieces.');
  await M(barsM([['5/8',fbar(5,8,300)],['5/16',fbar(5,16,300)]])); await say('A common mistake: 5 sixteenths. Look! It is less than 5 eighths.'); await say('Adding can never make less. Keep the bottom.');
  await M('<div class="row">'+fbar(7,10,300)+'</div>'); await say('Subtracting works the same way: 7 tenths take away 4 tenths is 3 tenths.');
  await M('<div class="row">'+fbar(3,8,300)+'</div>'); await say('3 eighths plus how many eighths make one whole?'); await say('One whole is 8 eighths, a twin of 1. So 5 more eighths.'); },
 [['addBuildM'],['addPickM',{sub:false}],['addJudgeM']],[['addPickM',{sub:true}],['makeWholeM'],['addTwinM'],['addPickM'],['addBuildM'],['addJudgeM'],['makeWholeM'],['addPickM',{sub:true}]],['addPickM',{sub:false,intro:'Pizza at the class party: how much of the pie did two boys eat?'}],[['addPickM',{sub:false}],['addPickM',{sub:true}],['makeWholeM']]),
'MATH.FRAC.L05.03':mk4('MATH.FRAC.L05.03','Mixed Up','🔀','mixed numbers and improper fractions',[['addPickM',{sub:false}],['makeWholeM']],['<div class="row">'+fbar(4,4,120)+fbar(1,4,120)+'</div>','One whole and one quarter. A whole is 4 quarters, so it is also 5 quarters!'],
 async()=>{ await M('<div class="row">'+fbar(4,4,110)+fbar(4,4,110)+fbar(3,4,110)+'</div>'); await say('2 and 3 quarters. Each whole bar is 4 quarters.'); await say('So it is 4 quarters plus 4 quarters plus 3 quarters. Same-bottom adding! That is 11 quarters.'); await say('Short way: 2 wholes times 4, plus 3, is 11.');
  await say('Careful! 2 plus 3 is 5 quarters. That counts each whole as one tiny piece.');
  await M('<div class="row"><span class="g4n">11/4</span></div>'); await say('Going back: 11 quarters. How many groups of 4 fit? 2 groups, with 3 left. So 2 and 3 quarters.');
  await M('<div class="row">'+fbar(3,4,150)+fbar(3,4,150)+'</div>'); await say('Adding can make more than a whole: 3 quarters plus 3 quarters is 6 quarters.'); await say('Take out one whole, 4 quarters. 2 quarters are left: 1 and 2 quarters.'); },
 [['mixBuildM'],['m2iPickM'],['i2mPickM']],[['m2iPickM'],['mixJudgeM'],['i2mPickM'],['mixAddM'],['mixBuildM'],['i2mPickM'],['m2iPickM'],['mixAddM']],['m2iPickM',{intro:'Measuring wood to build a sukkah wall.'}],[['m2iPickM'],['i2mPickM'],['mixAddM']])};

L.push(
mk4('MATH.PV.L05.01','Six-Digit Climb','🏔️','place value to one million',[['hundreds'],['expanded']],['<div class="row"><span class="g4n">472,315</span></div>','Big numbers have a pattern: ones, tens, hundreds, then the same again for thousands. Let us climb to a million!'],
 async()=>{ await M(digitsHtml(472315,5)); await say('Read big numbers in groups of three. The comma splits them.'); await M(digitsHtml(472315,4)); await say('472 thousand, 315. The 4 is in the hundred thousands place, so it is worth 400,000.'); await say('Each place is worth ten times the place to its right.'); },
 [['pvPlace'],['pvValue'],['pvExpand']],[['pvValue'],['pvPlace'],['pvExpand'],['pvCompare'],['pvValue'],['pvExpand'],['pvCompare'],['pvPlace']],['pvCompare',{intro:'Two shuls are raising money for a new building. Which raised more?'}],[['pvValue'],['pvExpand'],['pvCompare']]),
mk4('MATH.PV.L05.02','Round Anything','🎯','round to any place',[['roundTen'],['pvPlace']],['<div class="row" style="font-size:60px">🎯</div>','About how many? Rounding gives a number that is easy to use and still close.'],
 async()=>{ await M('<div class="row"><span class="g4n">46,<b>8</b>21</span></div>'); await say('Round 46,821 to the nearest thousand. It sits between 46,000 and 47,000.'); await say('Look one place to the right: the hundreds digit is 8. 5 or more rounds up, so it rounds to 47,000.'); await say('Everything after the rounding place becomes zero.'); },
 [['roundAny',{to:100}],['roundAny',{to:1000}],['roundAny',{to:10000}]],[['roundAny',{to:10}],['roundAny',{to:100}],['roundAny',{to:1000}],['pvValue'],['roundAny',{to:10000}],['roundAny'],['roundAny',{to:1000}],['roundAny']],['roundAny',{to:1000,intro:'About how many people came to the Siyum? Round for the newsletter.'}],[['roundAny',{to:100}],['roundAny',{to:1000}],['roundAny',{to:10000}]]),
mk4('MATH.OPS.L05.03','Column Master','🏛️','add and subtract multi-digit numbers',[['addSub100'],['regroup']],['<div class="row" style="font-size:60px">🏛️</div>','Big numbers stack up like floors of a building. Keep every place in its own column!'],
 async()=>{ await M(colHtml(4567,2785,'+')); await say('Add the ones: 7 plus 5 is 12. Write 2, carry 1 to the tens.'); await say('Keep going to the left, one place at a time. The answer is 7,352.'); await M(colHtml(6003,2458,'−')); await say('Subtracting: 3 take away 8 does not work. Regroup from the next place. When there are zeros, borrow across them.'); await say('Check by adding back: the answer plus the number you took away should give the top number.'); },
 [['colAdd',{lo:1000,hi:8999}],['colSub',{lo:2000,hi:9999}],['colCheck']],[['colAdd'],['colSub'],['colAdd'],['colCheck'],['colSub'],['colAdd'],['colSub'],['colAdd']],['colSub',{intro:'The yeshiva needs 25,000 dollars for new seforim. How much is still missing?'}],[['colAdd'],['colSub'],['colAdd']]),
mk4('MATH.NUM.L05.01','Factor Hunt','🔎','factors, multiples, prime and composite',[['times',{set:[3,4,6]}],['divFact']],['<div class="row" style="font-size:60px">🔎</div>','Every number has a family of factors hiding inside it. Let us hunt them down!'],
 async()=>{ await say('A factor divides a number with nothing left over. 3 is a factor of 12, because 3 times 4 is 12.'); await say('Find factors in pairs: 1 and 12, 2 and 6, 3 and 4. So 12 has six factors.'); await say('A prime number has exactly two factors: 1 and itself, like 7 or 13. A composite number has more.'); await say('Multiples are what you get when you skip count: multiples of 6 are 6, 12, 18, 24.'); },
 [['factorPick'],['multiplePick'],['primeComp']],[['factorPick'],['primeComp'],['multiplePick'],['factorCount'],['primeComp'],['factorPick'],['multiplePick'],['factorCount']],['factorPick',{intro:'Arranging chairs for a shiur in equal rows.'}],[['factorPick'],['primeComp'],['multiplePick']]),
mk4('MATH.OPS.L05.04','Times As Many','✖️','multiplicative comparison',[['times',{set:[3,4,5]}],['groupsOf']],['<div class="row" style="font-size:60px">📚</div>','“Three times as many” is a different way to compare. It is about multiplying, not adding.'],
 async()=>{ await say('Avi has 4 seforim. Chaim has 3 times as many. That is 4 times 3: 12 seforim.'); await say('3 MORE than 4 would only be 7. Times as many means multiply.'); await say('To find how many times as many, divide: 20 is how many times 5? 20 divided by 5 is 4.'); },
 [['timesAsMany'],['howManyTimes'],['timesAsMany']],[['timesAsMany'],['howManyTimes'],['timesAsMany'],['missFactor'],['howManyTimes'],['timesAsMany'],['divFact'],['timesAsMany']],['timesAsMany',{intro:'Collecting tzedakah coins for the class pushka.'}],[['timesAsMany'],['howManyTimes'],['timesAsMany']]),
mk4('MATH.OPS.L05.01','Multiply Mountain','⛰️','multiply multi-digit numbers',[['tensTimes'],['times',{set:[6,7,8,9]}]],['<div class="row" style="font-size:60px">⛰️</div>','Multiplying big numbers is a climb. Break it into small steps and you will reach the top.'],
 async()=>{ await say('To multiply 34 times 6, split 34 into 30 and 4.'); await say('30 times 6 is 180. 4 times 6 is 24. Add the parts: 204.'); await say('Two-digit times two-digit: 23 times 15. 23 times 10 is 230, and 23 times 5 is 115. Add: 345.'); await say('Estimate first, so you know if your answer makes sense.'); },
 [['areaModel'],['mulBig',{lo:100,hi:999}],['mulBig',{two:true}]],[['areaModel'],['mulBig'],['mulBig',{two:true}],['areaModel'],['mulBig',{lo:1000,hi:4999}],['tensTimes'],['mulBig',{two:true}],['mulBig']],['mulBig',{lo:120,hi:480,intro:'Ordering siddurim: every boy in the grade needs one.'}],[['mulBig'],['mulBig',{two:true}],['areaModel']]),
mk4('MATH.OPS.L05.02','Long Division Lab','🧪','long division with remainders',[['divFact'],['share']],['<div class="row" style="font-size:60px">🧪</div>','Long division shares a big number fairly, one place at a time.'],
 async()=>{ await say('Divide 157 by 4. How many 4s fit in 15? 3. Write 3. 3 times 4 is 12. 15 take away 12 is 3.'); await say('Bring down the 7: 37. How many 4s in 37? 9. 9 times 4 is 36. 1 is left.'); await say('So 157 divided by 4 is 39, remainder 1. The steps are: divide, multiply, subtract, bring down.'); await say('Check: 39 times 4 is 156, plus 1 is 157.'); },
 [['longDiv',{lo:12,hi:40}],['divCheck'],['longDiv',{lo:12,hi:99,noR:true}]],[['longDiv'],['divCheck'],['longDiv',{noR:true}],['divFact'],['longDiv'],['divCheck'],['longDiv',{lo:100,hi:999}],['longDiv']],['longDiv',{lo:20,hi:150,intro:'Packing boxes of matzah for families before Pesach.'}],[['longDiv'],['divCheck'],['longDiv']]),
mk4('MATH.OPS.L05.05','Leftover Logic','🚐','multi-step word problems and remainders',[['longDiv',{lo:5,hi:20}],['story4']],['<div class="row" style="font-size:60px">🚐</div>','After you divide, ask: what does the leftover mean in this story?'],
 async()=>{ await say('29 boys, 6 in each van. 29 divided by 6 is 4 remainder 5. Five boys are left, so we need one more van: 5 vans.'); await say('29 cookies, 6 on a plate. Only 4 plates are FULL. The leftover cookies do not make a full plate.'); await say('Sometimes the question asks for the leftover itself: 5 cookies are left.'); await say('Two-step problems: do one step, then use that answer for the next step.'); },
 [['leftover',{kind:'up'}],['leftover',{kind:'drop'}],['leftover',{kind:'left'}]],[['leftover'],['story5'],['leftover'],['longDiv'],['leftover'],['story5'],['leftover'],['story5']],['leftover',{kind:'up',intro:'Taking the whole grade to the Siyum in vans.'}],[['leftover'],['story5'],['leftover']]),
FRAC3['MATH.FRAC.L05.01'],
FRAC3['MATH.FRAC.L05.02'],
FRAC3['MATH.FRAC.L05.03'],
mk4('MATH.FRAC.L05.04','Tenths to Hundredths','💯','tenths and hundredths as fractions and decimals',[['fracShade'],['money']],['<div class="row" style="font-size:60px">💯</div>','Dimes and pennies! Tenths and hundredths work just like money.'],
 async()=>{ await say('A dollar has 10 dimes. One dime is one tenth of a dollar. It is also 10 pennies: 10 hundredths.'); await say('So 3 tenths equals 30 hundredths. As a decimal, 30 hundredths is 0.30, the same as 0.3.'); await say('To compare 0.5 and 0.45, write both with two places: 0.50 and 0.45. 50 hundredths is more.'); },
 [['tenthsHund'],['decWrite'],['decCompare']],[['tenthsHund'],['decWrite'],['decCompare'],['tenthsHund'],['decCompare'],['decWrite'],['money'],['decCompare']],['decCompare',{intro:'Which pushka has more: the one with 0.75 or the one with 0.8 of a dollar?'}],[['tenthsHund'],['decWrite'],['decCompare']]),
mk4('MATH.MEAS.L05.01','Convert Units','📏','feet to inches, kilograms to grams, hours to minutes',[['times',{set:[10]}],['unitMass']],['<div class="row" style="font-size:60px">📏</div>','A long trip can be measured in hours or in minutes. Same time, different units.'],
 async()=>{ await say('1 foot is 12 inches. So 3 feet is 3 times 12: 36 inches.'); await say('When you change a big unit into a small unit, you get MORE of them, so you multiply.'); await say('1 kilogram is 1,000 grams. 1 hour is 60 minutes. 1 meter is 100 centimeters.'); },
 [['convWhich'],['convert'],['convert']],[['convert'],['convWhich'],['convert'],['unitMass'],['convert'],['convert'],['convWhich'],['convert']],['convert',{intro:'How many minutes is the drive to the Kosel from the airport?'}],[['convert'],['convWhich'],['convert']]),
mk4('MATH.MEAS.L05.02','Area and Perimeter Formulas','📐','use the formulas to solve real problems',[['areaMul'],['perim']],['<div class="row" style="font-size:60px">📐</div>','Builders use two formulas every day: one for inside, one for around.'],
 async()=>{ await M(rectBox(12,8,'ft')); await say('Area covers the inside: length times width. 12 times 8 is 96 square feet.'); await say('Perimeter goes all around the edge: 2 times length plus width. 2 times 20 is 40 feet.'); await say('If you know the area and one side, divide to find the other side.'); },
 [['areaF'],['perimF'],['missingSide']],[['areaF'],['perimF'],['areaOrPerim4'],['missingSide'],['areaF'],['perimF'],['areaOrPerim4'],['missingSide']],['areaF',{intro:'How much floor does our new sukkah have?'}],[['areaF'],['perimF'],['missingSide']]),
mk4('MATH.GEO.L05.01','Angles and Protractors','📐','measure and draw angles',[['anglesCount'],['sides']],['<div class="row">'+angleSvg(60,false)+'</div>','An angle is a turn. We measure turns in degrees.'],
 async()=>{ await M(angleSvg(50,true)); await say('Put the center of the protractor on the corner. Line up zero with one ray.'); await say('Count up to the other ray. This angle is 50 degrees.'); await say('A square corner is 90 degrees: a right angle. Less is acute, more is obtuse, and a straight line is 180.'); await say('Angles side by side add up.'); },
 [['angleType'],['angleRead'],['angleAdd']],[['angleRead'],['angleType'],['angleAdd'],['angleRead'],['angleType'],['angleRead'],['angleAdd'],['angleType']],['angleType',{intro:'Looking at the corners of the shtender in class.'}],[['angleRead'],['angleType'],['angleAdd']]),
mk4('MATH.GEO.L05.02','Lines and Symmetry','🪞','parallel and perpendicular lines; symmetry',[['sidesName'],['shapeRule']],['<div class="row">'+linesSvg('parallel')+'</div>','Some lines never meet. Some meet at a perfect square corner.'],
 async()=>{ await M(linesSvg('parallel')); await say('Parallel lines stay the same distance apart and never meet, like train tracks.'); await M(linesSvg('perpendicular')); await say('Perpendicular lines meet at a square corner, like the side and bottom of a door.'); await M('<div class="row">'+symSvg('heart','v')+'</div>'); await say('A line of symmetry folds a shape into two halves that match exactly.'); },
 [['lineKind'],['symLine'],['lineWhere']],[['lineKind'],['symLine'],['lineWhere'],['symCount'],['lineKind'],['symLine'],['lineWhere'],['symCount']],['lineWhere',{intro:'Looking around the Beis Midrash for parallel and perpendicular lines.'}],[['lineKind'],['symLine'],['symCount']]),
mk4('MATH.STAT.L05.01','Line Plots with Fractions','📊','line plots of fraction data',[['linePlot'],['fracAddLike']],['<div class="row" style="font-size:60px">🍃</div>','We measured leaves from the sukkah schach. A line plot shows every measurement at once.'],
 async()=>{ await say('The number line is marked in eighths of an inch. Each dot stands for one leaf.'); await say('To find how many leaves were 3/8 inch, count the dots above 3/8.'); await say('To find how much longer the longest is than the shortest, subtract their eighths: 5/8 minus 1/8 is 4/8.'); },
 [['linePlotFr',{ask:'count'}],['linePlotFr',{ask:'most'}],['linePlotFr',{ask:'diff'}]],[['linePlotFr'],['linePlotFr',{ask:'count'}],['fracAddLike',{sub:true}],['linePlotFr',{ask:'diff'}],['linePlotFr'],['linePlotFr',{ask:'most'}],['fracAddLike'],['linePlotFr']],['linePlotFr',{ask:'count',intro:'Measuring leaves for the sukkah schach.'}],[['linePlotFr',{ask:'count'}],['linePlotFr',{ask:'most'}],['linePlotFr',{ask:'diff'}]]),
mk4('MATH.ALG.L05.01','Pattern from a Rule','🔁','build a pattern from a rule',[['pattern'],['skip',{step:5}]],['<div class="row"><span class="g4n">3, 7, 11, 15, …</span></div>','A rule tells you how to make the next number. Follow it, and you can see far ahead!'],
 async()=>{ await say('Rule: start at 3, add 4. The pattern is 3, 7, 11, 15, 19.'); await say('Look for things the rule does not say out loud. Every number here is odd, because odd plus an even number stays odd.'); await say('To find the rule, check the jump between every pair of numbers.'); },
 [['ruleNext'],['ruleFind'],['ruleFeature']],[['ruleNext'],['ruleFind'],['ruleFeature'],['pattern'],['ruleNext'],['ruleFind'],['ruleNext'],['ruleFind']],['ruleNext',{intro:'Each week the class learns 4 more mishnayos. How many by week 6?'}],[['ruleNext'],['ruleFind'],['ruleFeature']])
);
