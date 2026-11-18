/* ================= GAME LIBRARY ================= */
/* KINDERGARTEN READING games (Head of School 2026-11-18). Sounds are taught through WHOLE WORDS (no single letter sounds from the voice). */
const G={};
const W={cat:'🐱',hat:'🎩',bat:'🦇',map:'🗺️',cap:'🧢',dog:'🐶',log:'🪵',frog:'🐸',sun:'☀️',bus:'🚌',cup:'☕',bug:'🐛',duck:'🦆',pig:'🐷',six:'6️⃣',fish:'🐟',dish:'🍽️',bed:'🛏️',hen:'🐔',ten:'🔟',pen:'🖊️',net:'🥅',fox:'🦊',box:'📦',pot:'🍲',sock:'🧦',lock:'🔒',rock:'🪨',clock:'⏰',bee:'🐝',tree:'🌳',key:'🔑',moon:'🌙',spoon:'🥄',boat:'⛵',goat:'🐐',coat:'🧥',ball:'⚽',bell:'🔔',cake:'🎂',snake:'🐍',car:'🚗',star:'⭐',house:'🏠',mouse:'🐭',train:'🚂',rain:'🌧️',king:'👑',ring:'💍',apple:'🍎',egg:'🥚',banana:'🍌',book:'📖',milk:'🥛',kite:'🪁',sock2:'🧦',lamp:'💡',bear:'🐻',chair:'🪑',butterfly:'🦋',elephant:'🐘',rabbit:'🐰',pencil:'✏️',umbrella:'☂️',monkey:'🐵',tomato:'🍅',cupcake:'🧁',ladybug:'🐞',rainbow:'🌈',bow:'🎀',football:'🏈',popcorn:'🍿',starfish:'🌟',sunflower:'🌻',flower:'🌸',corn:'🌽',foot:'🦶',cow:'🐮',horse:'🐴',candle:'🕯️',ant:'🐜',octopus:'🐙',igloo:'🧊',van:'🚐',web:'🕸️',jam:'🍯',nut:'🥜',zip:'🤐'};
const pic=(w,cls)=>({h:O(W[w])+'<small>'+w+'</small>',label:w,cls:'pic-w'+(cls?' '+cls:'')});
const RHY=[['cat','hat','bat'],['dog','log','frog'],['bee','tree','key'],['moon','spoon'],['boat','goat','coat'],['fish','dish'],['cake','snake'],['car','star'],['house','mouse'],['sock','lock','rock','clock'],['train','rain'],['fox','box'],['ten','hen','pen'],['cap','map'],['king','ring'],['ball','bell']];
const OTHERS=Object.keys(W).filter(w=>w!=='sock2');
function notRhyme(set,n){ return shuffle(OTHERS.filter(w=>!RHY.some(r=>r.indexOf(w)>=0&&r.some(x=>set.indexOf(x)>=0))&&set.indexOf(w)<0)).slice(0,n); }
G.rhymePick=async c=>{ const set=any(RHY), s=shuffle(set), t=s[0], a=s[1], d=notRhyme(set,2);
  const items=shuffle([Object.assign(pic(a),{ok:1})].concat(d.map(x=>pic(x))));
  const f=await pickQ('<div class="row big1">'+O(W[t])+'<small>'+t+'</small></div>',items,'Which one rhymes with '+t+'?',async()=>{ await say(t+', '+a+'. They sound the same at the end!'); });
  return [f,t+' and '+a+' rhyme!']; };
G.rhymeYN=async c=>{ const set=any(RHY), s=shuffle(set), yes=Math.random()<.55, a=s[0], b=yes?s[1]:notRhyme(set,1)[0];
  const f=await pickQ('<div class="row big1">'+O(W[a])+'<small>'+a+'</small>'+O(W[b])+'<small>'+b+'</small></div>',[{h:O('👍'),ok:yes,cls:'huge',label:'yes'},{h:O('👎'),ok:!yes,cls:'huge',label:'no'}],'Do '+a+' and '+b+' rhyme? Thumbs up for yes, thumbs down for no.',async()=>{ await say(a+'... '+b+'. Listen to the end of each word.'); });
  return [f,yes?a+' and '+b+' rhyme!':a+' and '+b+' do not rhyme.']; };
const BEATS=[['cat',1],['dog',1],['sun',1],['apple',2],['rabbit',2],['pencil',2],['monkey',2],['cupcake',2],['banana',3],['butterfly',3],['elephant',3],['umbrella',3],['tomato',3],['ladybug',3]];
const SPLIT={apple:'ap... ple',rabbit:'rab... bit',pencil:'pen... cil',monkey:'mon... key',cupcake:'cup... cake',banana:'ba... na... na',butterfly:'but... ter... fly',elephant:'el... e... phant',umbrella:'um... brel... la',tomato:'to... ma... to',ladybug:'la... dy... bug'};
G.beats=async c=>{ const b=any(BEATS), w=b[0], n=b[1];
  view('<div class="row big1">'+O(W[w])+'<small>'+w+'</small></div>'+numRow(n,1,3,false,[1,2,3])); await say('Clap the beats in '+w+'. How many beats?');
  const f=await pickNum(n,async()=>{ await say('Let’s clap it: '+(SPLIT[w]||w)+'. '+n+(n===1?' beat.':' beats.')); },'Now tap how many beats.');
  return [f,w+' has '+n+(n===1?' beat.':' beats.')]; };
const FIRST={b:['ball','bee','bus','book','banana','bed','bear'],s:['sun','sock','six'],m:['moon','mouse','milk','map','monkey'],d:['dog','duck'],k:['cat','cup','car','cake','key','kite','king'],f:['fish','fox','foot','flower'],p:['pig','pen','pot','pencil','popcorn'],h:['hat','hen','house','horse'],r:['rock','ring','rain','rabbit'],l:['log','lock','lamp','ladybug'],t:['ten','tomato'],g:['goat'],w:['web'],v:['van']};
const LET={b:'B',s:'S',m:'M',d:'D',k:null,f:'F',p:'P',h:'H',r:'R',l:'L',t:'T',g:'G',w:'W',v:'V'};
function firstSet(){ const ks=Object.keys(FIRST).filter(k=>FIRST[k].length>=2); const k=any(ks), pair=shuffle(FIRST[k]).slice(0,2); const others=shuffle(ks.filter(x=>x!==k)).slice(0,2).map(x=>any(FIRST[x])); return {k,t:pair[0],a:pair[1],others}; }
G.firstSame=async c=>{ const s=firstSet();
  const f=await pickQ('<div class="row big1">'+O(W[s.t])+'<small>'+s.t+'</small></div>',shuffle([Object.assign(pic(s.a),{ok:1})].concat(s.others.map(x=>pic(x)))),'Which one starts with the same sound as '+s.t+'?',async()=>{ await say(s.t+'... '+s.a+'. Listen to the very first sound of each word.'); });
  return [f,s.t+' and '+s.a+' start the same way!']; };
G.firstLetter=async c=>{ const ks=Object.keys(FIRST).filter(k=>LET[k]); const k=any(ks), w=any(FIRST[k]); const wrong=shuffle(ks.filter(x=>x!==k)).slice(0,2);
  const items=shuffle([{h:'<span class="ltr">'+LET[k]+'</span>',ok:1,label:LET[k]}].concat(wrong.map(x=>({h:'<span class="ltr">'+LET[x]+'</span>',label:LET[x]}))));
  const f=await pickQ('<div class="row big1">'+O(W[w])+'<small>'+w+'</small></div>',items,w+'. Which letter does '+w+' start with?',async()=>{ await say(w+' starts with the letter '+LET[k]+'.'); });
  return [f,w+' starts with '+LET[k]+'!']; };
const COMPOUND=[['cup','cake','cupcake'],['rain','bow','rainbow'],['foot','ball','football'],['pop','corn','popcorn'],['sun','flower','sunflower'],['star','fish','starfish'],['butter','fly','butterfly'],['lady','bug','ladybug']];
G.blend=async c=>{ const x=any(COMPOUND), w=x[2]; const d=shuffle(OTHERS.filter(o=>o!==w&&COMPOUND.every(cc=>cc[2]!==o))).slice(0,2);
  const f=await pickQ('<div class="row big1">'+O('👂')+'</div>',shuffle([Object.assign(pic(w),{ok:1})].concat(d.map(o=>pic(o)))),'Listen: '+x[0]+'... '+x[1]+'. Put them together. What word is it?',async()=>{ await say(x[0]+'... '+x[1]+'... '+w+'!'); });
  return [f,x[0]+' and '+x[1]+' make '+w+'!']; };
const CHOP=[['cupcake','cup','cake'],['rainbow','rain','bow'],['football','foot','ball'],['popcorn','pop','corn'],['sunflower','sun','flower'],['starfish','star','fish']];
G.chop=async c=>{ const x=any(CHOP), keep=x[2]; const d=shuffle(OTHERS.filter(o=>o!==keep&&o!==x[0])).slice(0,2);
  const f=await pickQ('<div class="row big1">'+O(W[x[0]])+'<small>'+x[0]+'</small></div>',shuffle([Object.assign(pic(keep),{ok:1})].concat(d.map(o=>pic(o)))),'Say '+x[0]+'. Now say it without '+x[1]+'. What is left?',async()=>{ await say(x[0]+'. Take away '+x[1]+'... '+keep+' is left!'); });
  return [f,x[0]+' without '+x[1]+' is '+keep+'!']; };
G.chopCount=async c=>{ const b=any(BEATS.filter(x=>x[1]>1)), w=b[0], n=b[1];
  view('<div class="row big1">'+O(W[w])+'<small>'+w+'</small></div>'+numRow(n,1,3,false,[1,2,3])); await say('Chop '+w+' into parts. How many parts?');
  const f=await pickNum(n,async()=>{ await say('Chop, chop: '+(SPLIT[w]||w)+'. '+n+' parts.'); },'Now tap how many parts.');
  return [f,w+' has '+n+' parts.']; };
const ABC='ABCDEFGHIJKLMNOPRSTUVWZ'.split('');
const LOOK={b:['d','p'],d:['b','p'],p:['q','b'],m:['n','w'],n:['m','h'],u:['n','v'],w:['m','v'],e:['a','c'],a:['o','e'],h:['n','b'],i:['l','j'],t:['f','l']};
G.letterMatch=async c=>{ const U=any(ABC), l=U.toLowerCase(); const wr=(LOOK[l]||shuffle('acdefhkmnorstuz'.split('').filter(x=>x!==l)).slice(0,2)).slice(0,2);
  const items=shuffle([{h:'<span class="ltr">'+l+'</span>',ok:1,label:l}].concat(wr.map(x=>({h:'<span class="ltr">'+x+'</span>',label:x}))));
  const f=await pickQ('<div class="row big1"><span class="ltr big">'+U+'</span></div>',items,'This is big '+U+'. Find little '+U+'.',async()=>{ await say('Big '+U+' and little '+U+' are the same letter. Look at the shape.'); });
  return [f,'Big '+U+', little '+U+'!']; };
G.letterTap=async c=>{ const U=any(ABC); const wr=shuffle(ABC.filter(x=>x!==U)).slice(0,2);
  const f=await pickQ('<div class="row big1">'+O('🔤')+'</div>',shuffle([{h:'<span class="ltr">'+U+'</span>',ok:1,label:U}].concat(wr.map(x=>({h:'<span class="ltr">'+x+'</span>',label:x})))),'Tap the letter '+U+'.',async()=>{ await say('Look for '+U+'.'); });
  return [f,'That is '+U+'!']; };
const VOWEL={a:['cat','hat','map','bat','cap','jam','van'],e:['bed','hen','ten','pen','net','web'],i:['pig','six','zip'],o:['dog','fox','box','pot','sock','log'],u:['sun','bus','cup','bug','duck','nut']};
const VKEY={a:['apple','a'],e:['egg','e'],i:['igloo','i'],o:['octopus','o'],u:['umbrella','u']};
G.vowelPick=async c=>{ const v=any(Object.keys(VOWEL)), w=any(VOWEL[v]); const others=shuffle(Object.keys(VOWEL).filter(x=>x!==v)).slice(0,2).map(x=>any(VOWEL[x]));
  const k=VKEY[v];
  const f=await pickQ('<div class="row big1">'+O(W[k[0]])+'<small>'+k[0]+'</small></div>',shuffle([Object.assign(pic(w),{ok:1})].concat(others.map(o=>pic(o)))),'Which word has the same middle sound as the start of '+k[0]+'?',async()=>{ await say(k[0]+'... '+w+'. Listen to the middle of '+w+'.'); });
  return [f,w+' has the same sound as '+k[0]+'!']; };
const CVC=['cat','hat','map','bat','cap','van','bed','hen','ten','pen','net','web','pig','six','dog','fox','box','pot','log','sun','bus','cup','bug','nut'];
G.readWord=async c=>{ const w=any(CVC), d=shuffle(CVC.filter(x=>x!==w&&x[1]!==w[1])).slice(0,1).concat(shuffle(CVC.filter(x=>x!==w&&x[1]===w[1])).slice(0,1));
  const items=shuffle([{h:O(W[w]),ok:1,label:w,cls:'huge'}].concat(d.map(x=>({h:O(W[x]),label:x,cls:'huge'}))));
  const f=await pickQ('<div class="row big1"><span class="word">'+w+'</span></div>',items,'Read the word. Tap its picture.',async()=>{ await say('Let’s read it together: '+w.split('').join('... ')+'. '+w+'!'); });
  return [f,'You read '+w+'!']; };
G.wordForPic=async c=>{ const w=any(CVC), d=shuffle(CVC.filter(x=>x!==w&&x[0]===w[0])).slice(0,1).concat(shuffle(CVC.filter(x=>x!==w&&x[0]!==w[0])).slice(0,1));
  const items=shuffle([{h:'<span class="word">'+w+'</span>',ok:1,label:w}].concat(d.map(x=>({h:'<span class="word">'+x+'</span>',label:x}))));
  const f=await pickQ('<div class="row big1">'+O(W[w])+'</div>',items,'Which word says the name of this picture?',async()=>{ await say('This is a '+w+'. Look at every letter.'); });
  return [f,'Yes, '+w+'!']; };
const SNAP=['the','a','I','is','and','see','can','we','to','my','go','like','you','it','in','at'];
G.snap=async c=>{ const w=any(SNAP), d=shuffle(SNAP.filter(x=>x!==w)).slice(0,2);
  const items=shuffle([{h:'<span class="word">'+w+'</span>',ok:1,label:w}].concat(d.map(x=>({h:'<span class="word">'+x+'</span>',label:x}))));
  const f=await pickQ('<div class="row big1">'+O('⚡')+'</div>',items,'Snap word! Tap: '+w+'.',async()=>{ await say(w+'. Look for the word '+w+'.'); });
  return [f,'Snap! '+w+'!']; };
const LINES=[['I','see','a','cat'],['We','can','go'],['I','like','my','dog'],['The','sun','is','hot'],['I','can','see','the','moon']];
G.firstWord=async c=>{ const s=any(LINES);
  view('<div class="row big1">'+O('📖')+'</div><div class="row">'+s.map((w,i)=>'<button class="pic wordb" type="button"'+(i===0?' data-ok="1"':'')+'><span class="word sm">'+w+'</span></button>').join('')+'</div>');
  const f=await new Promise(res=>{ say('Where do we start reading? Tap the first word.').then(()=>{ let first=true; scene.querySelectorAll('.wordb').forEach(b=>b.onclick=async()=>{ if(BUSY) return; if(b.dataset.ok){ b.classList.add('yes'); chime(); scene.querySelectorAll('.wordb').forEach(x=>x.onclick=null); res(first); } else { first=false; b.classList.add('no'); soft(); await wrongHelp(async()=>{ await say('We start at the left, the side of your first finger... and read across.'); },'Tap the first word.'); } }); }); });
  return [f,'We start at the left!']; };
G.wordCount=async c=>{ const s=any(LINES), n=s.length;
  view('<div class="row big1"><span class="word sm">'+s.join('&nbsp;&nbsp;&nbsp;')+'</span></div>'+numRow(n,2,6,false));
  await say('How many words are in this sentence? The spaces show where words end.');
  const f=await pickNum(n,async()=>{ await say('Let’s count the words.'); for(let i=0;i<n;i++){ plink(i); await say(String(i+1)); } },'Now tap how many words.');
  return [f,n+' words!']; };
G.whichWay=async c=>{ const f=await pickQ('<div class="row big1">'+O('📖')+'</div>',[{h:O('➡️'),ok:1,cls:'huge',label:'left to right'},{h:O('⬅️'),cls:'huge',label:'right to left'}],'When we read an English book, which way do we read?',async()=>{ await say('English goes from left to right, like this arrow. Hebrew goes the other way!'); });
  return [f,'Left to right!']; };
const STORIES=[
 {t:'Sam has a red ball. He kicks the ball. The ball goes up, up, up!',q:'What does Sam kick?',a:'ball',d:['book','cake']},
 {t:'A little duck swims in the pond. The duck says quack, quack. Then the duck goes to sleep.',q:'Who swims in the pond?',a:'duck',d:['cat','pig']},
 {t:'It is Erev Shabbos. Mommy bakes a cake. Dovid helps her put candles on the table.',q:'What does Mommy bake?',a:'cake',d:['apple','fish']},
 {t:'The cat wants milk. She sees a cup of milk. She drinks it all up!',q:'What does the cat drink?',a:'milk',d:['jam','egg']},
 {t:'Moshe finds a star in the sky. Then he finds two more. Three stars! It is time for Havdalah.',q:'What does Moshe find in the sky?',a:'star',d:['moon','kite']},
 {t:'A bee flies to a flower. The bee drinks from the flower. Buzz, buzz, says the bee.',q:'Where does the bee fly?',a:'flower',d:['tree','house']}];
G.story=async c=>{ const s=c.s||any(STORIES); view('<div class="row big1">'+O('📖')+O('👂')+'</div>'); await say(s.t);
  const f=await pickQ('<div class="row big1">'+O('🤔')+'</div>',shuffle([Object.assign(pic(s.a),{ok:1})].concat(s.d.map(x=>pic(x)))),s.q,async()=>{ await say('Listen again. '+s.t); });
  return [f,'Yes, the '+s.a+'!']; };
G.storyFirst=async c=>{ const s=any(STORIES.filter(x=>x.first)) ;return G.story(c); };
