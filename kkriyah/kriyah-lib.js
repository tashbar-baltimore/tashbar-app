/* ================= GAME LIBRARY ================= */
/* KINDERGARTEN KRIYAH games (Head of School 2026-11-18). Letters are built from code points (no hand-typed Hebrew). Letter NAMES are Litvish
   (Beis, Sav, Tes); the app's voice says each Hebrew letter inside an English sentence by its name. No single letter sounds are spoken alone. */
const G={};
const H=n=>String.fromCharCode(n), DAG=H(0x5BC), SHIN_DOT=H(0x5C1), SIN_DOT=H(0x5C2);
const LT={alef:[0x5D0,'Aleph'],beis:[0x5D1,'Beis',DAG],veis:[0x5D1,'Veis'],gimmel:[0x5D2,'Gimmel'],daled:[0x5D3,'Daled'],hei:[0x5D4,'Hei'],vav:[0x5D5,'Vav'],zayin:[0x5D6,'Zayin'],ches:[0x5D7,'Ches'],tes:[0x5D8,'Tes'],yud:[0x5D9,'Yud'],
 kaf:[0x5DB,'Kaf',DAG],chaf:[0x5DB,'Chaf'],lamed:[0x5DC,'Lamed'],mem:[0x5DE,'Mem'],nun:[0x5E0,'Nun'],samech:[0x5E1,'Samech'],ayin:[0x5E2,'Ayin'],pei:[0x5E4,'Pei',DAG],fei:[0x5E4,'Fei'],tzadi:[0x5E6,'Tzadi'],kuf:[0x5E7,'Kuf'],reish:[0x5E8,'Reish'],
 shin:[0x5E9,'Shin',SHIN_DOT],sin:[0x5E9,'Sin',SIN_DOT],tav:[0x5EA,'Tav',DAG],sav:[0x5EA,'Sav'],
 fchaf:[0x5DA,'Final Chaf'],fmem:[0x5DD,'Final Mem'],fnun:[0x5DF,'Final Nun'],ffei:[0x5E3,'Final Fei'],ftzadi:[0x5E5,'Final Tzadi']};
const ch=k=>H(LT[k][0])+(LT[k][2]||''), nm=k=>LT[k][1];
const LOOKS={beis:['kaf','veis','chaf'],veis:['chaf','beis','kaf'],kaf:['beis','chaf'],chaf:['veis','kaf'],daled:['reish','fchaf'],reish:['daled','fchaf'],hei:['ches','tav','sav'],ches:['hei','tav','sav'],tav:['ches','hei','sav'],sav:['ches','hei','tav'],
 vav:['zayin','fnun','yud'],zayin:['vav','fnun'],fnun:['vav','zayin'],tes:['mem','samech'],mem:['tes','samech','fmem'],samech:['fmem','mem','tes'],fmem:['samech','mem'],ayin:['tzadi','shin'],tzadi:['ayin','ftzadi'],gimmel:['nun','tzadi'],nun:['gimmel','kaf'],
 yud:['vav','reish'],alef:['ayin','tzadi'],lamed:['kuf','chaf'],kuf:['hei','lamed'],pei:['fei','kaf'],fei:['pei','chaf'],shin:['sin','ayin'],sin:['shin','ayin'],fchaf:['daled','reish'],ffei:['fchaf','fei'],ftzadi:['tzadi','fnun']};
const TIPS={alef:'Aleph has two arms, like it is waving hello.',beis:'Beis has a dot inside, like a house with someone home.',veis:'Veis is a Beis with no dot.',gimmel:'Gimmel has a little foot, like it is walking.',daled:'Daled has a corner on top, like a door.',hei:'Hei has a little window on the side.',vav:'Vav is tall and straight, like a nail.',zayin:'Zayin has a hat on top.',ches:'Ches is closed on top, like a gate.',tes:'Tes curls inside, like a basket.',yud:'Yud is the smallest letter, like a dot in the air.',kaf:'Kaf is round, with a dot inside.',chaf:'Chaf is round with no dot.',lamed:'Lamed is the tallest letter, it reaches up high.',mem:'Mem has a little open space at the bottom.',nun:'Nun is like a bent knee.',samech:'Samech is round and closed, like a circle.',ayin:'Ayin has two eyes looking up.',pei:'Pei has a mouth with a dot inside.',fei:'Fei has a mouth with no dot.',tzadi:'Tzadi has a hand reaching up.',kuf:'Kuf has a leg that goes down low.',reish:'Reish is round on top, like a head.',shin:'Shin has three arms and a dot on the right.',sin:'Sin has three arms and a dot on the left.',tav:'Tav has a foot and a dot inside.',sav:'Sav has a foot and no dot.',fchaf:'Final Chaf goes down long at the end of a word.',fmem:'Final Mem is closed like a box, at the end of a word.',fnun:'Final Nun goes straight down at the end of a word.',ffei:'Final Fei goes down long at the end of a word.',ftzadi:'Final Tzadi goes down long at the end of a word.'};
const lb=(k,cls)=>({h:'<span class="heb">'+ch(k)+'</span>',label:nm(k),cls:cls||''});
function dis(k,pool,n){ const near=(LOOKS[k]||[]).filter(x=>x!==k); const rest=shuffle(pool.filter(x=>x!==k&&near.indexOf(x)<0)); return shuffle(near).concat(rest).filter((x,i,a)=>a.indexOf(x)===i&&ch(x)!==ch(k)).slice(0,n); }
let SET=['alef','beis','gimmel','daled','hei'];
const ALL=['alef','beis','gimmel','daled','hei','vav','zayin','ches','tes','yud','kaf','lamed','mem','nun','samech','ayin','pei','tzadi','kuf','reish','shin','tav'];
G.tapLetter=async c=>{ const k=c.k||any(c.set||SET); const items=shuffle([Object.assign(lb(k),{ok:1})].concat(dis(k,c.set||SET.concat(ALL),2).map(x=>lb(x))));
  const f=await pickQ('<div class="row big1">'+O('👆')+'</div>',items,'Tap the '+ch(k)+'.',async()=>{ await say('This is '+ch(k)+'. '+(TIPS[k]||'')); });
  return [f,'That is '+ch(k)+'!']; };
G.sameLetter=async c=>{ const k=c.k||any(c.set||SET); const items=shuffle([Object.assign(lb(k),{ok:1})].concat(dis(k,c.set||SET.concat(ALL),2).map(x=>lb(x))));
  const f=await pickQ('<div class="row big1"><span class="heb big">'+ch(k)+'</span></div>',items,'Find the letter that looks just the same.',async()=>{ await say('Look closely. '+(TIPS[k]||'')); });
  return [f,'Same! That is '+ch(k)+'.']; };
G.lookAlike=async c=>{ const pool=(c.set||SET).filter(k=>(LOOKS[k]||[]).length); const k=any(pool.length?pool:(c.set||SET)), other=(LOOKS[k]||dis(k,ALL,1))[0];
  const f=await pickQ('<div class="row big1">'+O('🔎')+'</div>',shuffle([Object.assign(lb(k),{ok:1}),lb(other)]),'These two look alike! Tap the '+ch(k)+'.',async()=>{ await say(TIPS[k]||('Look for '+ch(k)+'.')); });
  return [f,'You found the '+ch(k)+'!']; };
G.countLetter=async c=>{ const k=c.k||any(c.set||SET), n=R(2,4), others=dis(k,c.set||SET.concat(ALL),2); const row=shuffle(Array.from({length:n},()=>k).concat(Array.from({length:6-n},()=>any(others))));
  view('<div class="row big1">'+row.map(x=>'<span class="heb sm">'+ch(x)+'</span>').join('')+'</div>'+numRow(n,1,5,false,[1,2,3,4,5])); await say('How many '+ch(k)+' can you find?');
  const f=await pickNum(n,async()=>{ await say('Let’s look for '+ch(k)+' one at a time.'); },'Now tap how many.');
  return [f,n+' of them!']; };
G.nextLetter=async c=>{ const ord=c.order||ALL, i=R(0,Math.max(0,ord.length-3)), a=ord[i], b=ord[i+1], nx=ord[i+2]; if(!nx) return G.tapLetter(c);
  const items=shuffle([Object.assign(lb(nx),{ok:1})].concat(dis(nx,ord.filter(x=>x!==a&&x!==b),2).map(x=>lb(x))));
  const f=await pickQ('<div class="row big1"><span class="heb sm">'+ch(a)+'</span><span class="heb sm">'+ch(b)+'</span><span class="heb sm q">?</span></div>',items,ch(a)+', '+ch(b)+'... which letter comes next?',async()=>{ await say(ch(a)+', '+ch(b)+', '+ch(nx)+'. That is the order of the Aleph-Beis.'); });
  return [f,ch(nx)+' comes next!']; };
/* words built from code points; each letter key of the word, so a letter can be found inside it */
const WORDS=[{w:['shin','beis','sav'],en:'Shabbos',e:'🕯️'},{w:['tav','vav','reish','hei'],en:'Torah',e:'📜'},{w:['mem','zayin','vav','zayin','hei'],en:'mezuzah',e:'🚪'},{w:['alef','beis','alef'],en:'Abba',e:'👨'},{w:['alef','mem','alef'],en:'Imma',e:'👩'},{w:['ches','lamed','hei'],en:'challah',e:'🍞'},{w:['samech','vav','kaf','hei'],en:'sukkah',e:'🛖'},{w:['tzadi','yud','tzadi','yud','sav'],en:'tzitzis',e:'🧵'},{w:['beis','reish','kaf','hei'],en:'bracha',e:'🙏'},{w:['lamed','vav','lamed','beis'],en:'lulav',e:'🌿'}];
G.findInWord=async c=>{ const set=c.set||SET; const cand=WORDS.filter(x=>x.w.some(k=>set.indexOf(k)>=0)); const wd=any(cand.length?cand:WORDS); const opts=wd.w.filter(k=>set.indexOf(k)>=0); const k=any(opts.length?opts:wd.w);
  view('<div class="row big1">'+O(wd.e)+'<small>'+wd.en+'</small></div><div class="row heb-row">'+wd.w.map((x,i)=>'<button class="pic hl" type="button"'+(ch(x)===ch(k)?' data-ok="1"':'')+' aria-label="'+nm(x)+'"><span class="heb">'+ch(x)+'</span></button>').join('')+'</div>');
  const f=await new Promise(res=>{ say('This word is '+wd.en+'. Tap a '+ch(k)+' in it.').then(()=>{ let first=true; scene.querySelectorAll('.heb-row .pic').forEach(b=>b.onclick=async()=>{ if(BUSY) return; if(b.dataset.ok){ b.classList.add('yes'); chime(); scene.querySelectorAll('.heb-row .pic').forEach(x=>x.onclick=null); res(first); } else { first=false; b.classList.add('no'); soft(); await wrongHelp(async()=>{ await say(TIPS[k]||('Look for '+ch(k)+'.')); },'Tap the '+ch(k)+'.'); } }); }); });
  return [f,'You found '+ch(k)+' in '+wd.en+'!']; };
G.dotPick=async c=>{ const pairs=c.pairs||[['beis','veis'],['kaf','chaf']]; const p=any(pairs), want=any(p), other=p[0]===want?p[1]:p[0];
  const f=await pickQ('<div class="row big1">'+O('⚫')+'</div>',shuffle([Object.assign(lb(want),{ok:1}),lb(other)]),'Tap the '+ch(want)+'.',async()=>{ await say(TIPS[want]||''); });
  return [f,'Yes! '+ch(want)+'.']; };
const FINALS=[['kaf','fchaf'],['mem','fmem'],['nun','fnun'],['pei','ffei'],['tzadi','ftzadi']];
G.finalPick=async c=>{ const p=any(FINALS); const third=any(FINALS.filter(q=>q[1]!==p[1]))[1]; const items=shuffle([Object.assign(lb(p[1]),{ok:1}),lb(p[0]),lb(third)]);
  const f=await pickQ('<div class="row big1">'+O('🏁')+'</div>',items,'Which one is '+nm(p[1])+', the letter at the end of a word?',async()=>{ await say(TIPS[p[1]]||''); });
  return [f,'That is '+nm(p[1])+'!']; };
