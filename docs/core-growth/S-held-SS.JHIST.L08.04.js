/* HELD, not loaded by the app (job S, 2026-11-25). The One Bite lesson for SS.JHIST.L08.04 "The Holocaust: What Happened".
   Built and independently reviewed (all scores 4-5), but held back because the app's reward effects (coins, streaks, "FIRST TRY!")
   play over every lesson, which is wrong for this subject. See the GitHub issue on a quiet mode. To ship: add this entry back into
   the BITE object in src/CoreDataS9.html once a quiet mode exists. */
var HELD_BITE = {
    'SS.JHIST.L08.04':{ band:'M68', pic:'🕯️', today:'Learn what happened in the Holocaust, and remember',
      why:'We remember the kedoshim, and we carry on the Torah they loved.',
      ready:[{q:'In what year did World War I end?', o:['1918','1945','1776'], a:'1918'},
             {q:'What is a law?', o:['a rule a country makes','a kind of song','a holiday'], a:'a rule a country makes'}],
      watch:{ q:'A quiet newsroom', m:{type:'scene', e:'🕯️', t:'The newsroom was quiet. "This story we write slowly and carefully," said Mr. Gross.'}, steps:[
        {t:'In 1933, Adolf Hitler’s Nazi party took power in Germany.'},
        {t:'Laws took away Jews’ rights. On Kristallnacht, November 9–10, 1938, shuls burned.'},
        {t:'The Nazis murdered six million Jews, about one and a half million of them children.'},
        {t:'We call them kedoshim: the holy Jews who were murdered.'},
        {t:'Teach it back: tell a chavrusa what kedoshim means, and why we remember.'}],
        a:'Six million kedoshim, about one and a half million of them children. We remember them.' },
      oops:{ q:'A common mix-up: did Kristallnacht come during the war?', wrong:'Yes, it was part of the fighting.', right:'No. It came in November 1938, before the war began in 1939.', why:'It was a terrible warning, almost a year before the war.' },
      ways:['timeline','find the evidence','worked example','careful thinking','teach it back'], done:'You learned what happened in the Holocaust. We remember the kedoshim.',
      board:{ one:'1933: Hitler and the Nazi party take power in Germany. Laws take away Jews’ rights. Kristallnacht, November 9–10, 1938: shuls burned, Jewish stores attacked. 1939–1945: the war. Six million Jews were murdered, about one and a half million of them children: the kedoshim. Survivors rebuilt Torah and families; many communities say kinnos for them on Tisha B’Av.', activity:'Make a quiet timeline on the wall, 1933 to 1945. Then each boy adds one card for something rebuilt after the war: a yeshiva, a shul, a family.', mistakes:['Thinking the Holocaust happened in World War I','Thinking Kristallnacht came during the war','Forgetting how Torah was rebuilt after the war'] },
      do:[
        {type:'order', steps:['1933: the Nazis take power','1935: laws take away Jews’ rights','1939: World War II begins','1945: the war ends'],
          say:'Build the timeline. Put the years in order.', how:'The war began in 1939 and ended in 1945. The smallest year comes first.'},
        {type:'evidence', q:'Which sentence shows a Jew keeping his emunah?', p:['In hiding, a boy whispered Modeh Ani each morning.','The winter of 1942 was very cold.','The war spread to many countries.','Many roads were closed by soldiers.'], a:0, look:'what the boy did',
          say:'Tap the sentence that proves it.', how:'Emunah is faith in Hashem. Look for a tefillah.'}],
      your:[
        {type:'sort', mis:true, q:'A common mix-up: which war was it?', bins:['World War I','World War II'], cards:[['1914 to 1918',0],['1939 to 1945',1],['America joins in 1917',0],['the Nazis rule Germany',1]],
          say:'A common mix-up. Sort each one into its war.', how:'World War I ended in 1918. The Nazis took power later, in 1933.'},
        {type:'match', pairs:[['survivor','one who lived through it'],['emunah','faith in Hashem'],['Kiddush Hashem','making Hashem’s Name holy']],
          say:'Match each word to its meaning.', how:'Emunah is about faith. Kiddush Hashem is about Hashem’s Name. To survive is to live through.'},
        {type:'cloze', t:'Many Jews tried to leave, but most countries would not ___ them.', o:['let in','pay','write to'], a:'let in',
          say:'Which words fit? Tap them into the gap.', how:'Most countries closed their doors to Jews trying to escape.'},
        {type:'evidence', q:'Which sentence shows Torah being rebuilt?', p:['The war ended in 1945.','Survivors opened new yeshivos in America and Eretz Yisroel.','Germany lost the war.','Many cities lay in ruins.'], a:1, look:'what the survivors built',
          say:'Tap the sentence that proves it.', how:'Look for building, not for the war.'},
        {type:'cloze', t:'Many communities say ___ for the kedoshim on Tisha B’Av.', o:['kinnos','Hallel','zemiros'], a:'kinnos',
          say:'Which word fits? Tap it into the gap.', how:'Kinnos are the sad poems we say on Tisha B’Av.'}] }
};
