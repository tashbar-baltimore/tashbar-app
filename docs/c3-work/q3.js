
/* ---- GRADE 3 (L04, band B23) ---- */
B['READ.COMP.L04.01']={ band:'B23', pic:'❓', today:'Answer who, what, where and when from the text', why:'The answer is hiding in the words. Find the exact words and you are always right.',
  ready:[{q:'"Mendy ran to the park." Where did Mendy run?', o:['to the park','Mendy','fast'], a:'to the park'},{q:'"Shmuli has a red ball." What does Shmuli have?', o:['a red ball','Shmuli','a park'], a:'a red ball'}],
  bridge:'READ.COMP.L03.01', bridgeName:'Main Topic',
  watch:{ q:'Who was building?', m:{type:'scene',e:'🪵',t:'On Sunday, Avi watched Zeidy build a shtender in the workshop. Then Avi sanded the top.'}, steps:[
    {t:'I circle the question word: Who. Who wants a person.'},
    {t:'I notice two people: Avi and Zeidy. I match the action: who was building? Avi only watched. Zeidy was building.'},
    {t:'What? A thing: a shtender. Where? A place: in the workshop. When? A time: on Sunday.'},
    {t:'Another story: Moshe lost his siddur, and Yehuda found it on the shelf in the beis medrash. What was lost? his siddur. Who found it? Yehuda. Where? on the shelf in the beis medrash. I point to the exact words before I answer.'}], a:'Who: Zeidy. What: a shtender. Where: the workshop. When: Sunday.' },
  oops:{ q:'"Avi watched Zeidy work." Who was building?', wrong:'Avi', right:'Zeidy', why:'Avi only watched. Match the action in the question to the sentence.' },
  ways:['think-aloud','match question words','sort answers','who did what','Mistake Detective'], done:'You can answer who, what, where and when from the text!',
  board:{ one:'Who = person, what = thing, where = place, when = time. Find the exact words.', activity:'Question-word cards: boys hold up Who, What, Where or When when the teacher reads an answer.', mistakes:['Picking the wrong person (who watched, not who did)','Giving a place for a when question','Guessing instead of finding the sentence'] },
  do:[
    {type:'match', pairs:[['Who?','a person'],['What?','a thing'],['Where?','a place'],['When?','a time']], say:'Match each question word to what it wants.', how:'Who is a person. What is a thing. Where is a place. When is a time.'},
    {type:'sort', q:'Naftali gave Abba his lunch in the van.', bins:['Who','What','Where'], cards:[['Naftali',0],['Abba',0],['his lunch',1],['in the van',2]], say:'Does it answer who, what, or where?', how:'Point to each part in the sentence. A person is who, a thing is what, a place is where.'}],
  your:[
    {type:'listen', q:'Eli found it under the bed.', hear:'At noon, Eli found his siddur under the bed. Where was it?', o:['the bed','noon','Eli'], a:'the bed', say:'Listen. Where was the siddur?', how:'Where wants a place: under the bed. Noon is a time, not a place.'},
    {type:'sort', bins:['Where? A place','When? A time'], cards:[['at the bus stop',0],['after davening',1],['in the sukkah',0],['on Sunday',1],['at night',1]], say:'Is it a place, or a time?', how:'A place is where: on the shelf in the beis medrash. A time is when: after davening.'},
    {type:'match', q:'Ari lost his mitten. Baruch found it.', pairs:[['What was lost?','his mitten'],['Who found it?','Baruch'],['Who lost it?','Ari']], say:'Match each question to its answer.', how:'Read the question word. Then find the exact words in the story.'},
    {type:'sort', q:'Abba watched Yanky paint, then swept up.', bins:['Yanky did it','Abba did it'], cards:[['painted',0],['watched',1],['swept up',1]], say:'Mistake Detective: who did this action?', how:'The mistake is picking the wrong person. Abba only watched the painting. Yanky painted.'},
    {type:'listen', q:'Challenge: a shul flyer', hear:'Come to our siyum on Sunday at seven, in the shul hall. When is the siyum?', o:['Sunday','the hall','a siyum'], a:'Sunday', say:'Challenge! When is the siyum?', how:'When wants a time: Sunday at seven. The hall is where.'}] };

B['READ.FLU.L04.01']={ band:'B23', pic:'🛖', today:'Read a passage smoothly, in phrases, and keep track', why:'Smooth reading lets your brain see the movie, so you remember who did what.',
  ready:[{q:'What does a comma tell you?', o:['short rest','stop','ask'], a:'short rest'},{q:'Which mark means asking?', o:['?','.','!'], a:'?'}],
  bridge:'READ.FLU.L03.01', bridgeName:'Fluent Flyer',
  watch:{ q:'Building the Sukkah', m:{type:'scene',e:'🛖',t:'On the day after Yom Kippur, Abba and the boys start building the sukkah. Menachem carries the wooden boards from the garage. Abba screws them together with a drill. The hardest part is the roof. It must be made of things that grew from the ground, like branches or bamboo. Menachem climbs the ladder slowly, holding each mat with both hands. "Not too thick," Abba reminds him. "At night we should still see a few stars." When they finish, Menachem lies on the floor and looks up. Between the bamboo, he can see a tiny patch of blue sky.'}, steps:[
    {t:'I read in scoops: The hardest part / is the roof. I pause at the period.'},
    {t:'A long word: hardest. I split it into parts: hard | est. Then I read it smoothly.'},
    {t:'I picture it like a movie: Menachem carries boards, Abba uses the drill. I keep track of who does what.'},
    {t:'I check: what must the roof be made of? Things that grew from the ground.'},
    {t:'I check: why not too thick? So they can still see stars at night.'}], a:'Scoop, split long words, picture, check.' },
  oops:{ q:'Who carries the boards?', wrong:'Abba', right:'Menachem', why:'Check the exact name in the sentence. Menachem carries; Abba uses the drill.' },
  ways:['think-aloud','scoop phrases with tiles','split long words','who did what','Mistake Detective'], done:'You can read a passage smoothly and keep track!',
  board:{ one:'Scoop phrases, split long words, picture the scene, then check who, what, why.', activity:'Phrase-scoop: draw a scoop under each phrase on the board and echo-read it.', mistakes:['Mixing up who did what','Reading word by word','Stopping at a long word instead of splitting it'] },
  do:[
    {type:'tiles', w:['The roof','must be','made of','things'], hear:'The roof must be made of things that grew from the ground.', q:'Scoop it.', say:'Listen to how I scoop it. Then put the scoops in order.', how:'Each scoop is a few words that go together: The roof / must be / made of / things.'},
    {type:'match', pairs:[['Menachem','carries boards'],['Abba','uses a drill'],['the roof','branches, bamboo']], say:'Picture the movie. Who did what?', how:'Menachem carries the boards. Abba screws them with a drill. The roof is branches or bamboo.'}],
  your:[
    {type:'tiles', w:['slow','ly'], extra:['sl','owly'], q:'Menachem climbs slowly.', say:'Split slowly into its two parts.', how:'Find the base word: slow. Then the ending: ly. Slow | ly. Like hardest: hard | est.'},
    {type:'sort', q:'The roof: things that grew from the ground', bins:['Roof: yes','Roof: no'], cards:[['branches',0],['bamboo',0],['metal',1],['plastic',1]], say:'Can this go on the sukkah roof?', how:'The roof must be made of things that grew from the ground.'},
    {type:'listen', q:'"Not too thick," Abba reminds him.', hear:'Why should the roof not be too thick?', o:['see stars','stay dry','be strong'], a:'see stars', say:'Listen. Why not too thick?', how:'Abba says: at night we should still see stars. So they can still see stars at night.'},
    {type:'sort', bins:['Menachem','Abba'], cards:[['carries the boards',0],['uses the drill',1],['climbs the ladder',0],['says "Not too thick"',1]], say:'Mistake Detective: who did this?', how:'The mistake is mixing up who did what. Find the name in the sentence.'},
    {type:'tiles', w:['When they finish,','Menachem lies','on the floor','and looks up.'], q:'Challenge: a long sentence', say:'Challenge! Put the scoops in order.', how:'Rest at the comma. Scoop the rest. Stop at the period.'}] };

B['READ.FLU.L04.02']={ band:'B23', pic:'🍋', today:'Keep track of a chapter book', why:'Chapter books are long. A one-line bookmark after each chapter keeps the whole story together.',
  ready:[{q:'Which part comes first in a story?', o:['the beginning','the end','the lesson'], a:'the beginning'},{q:'Reading in scoops means...', o:['a few words at a time','one letter at a time','very fast'], a:'a few words at a time'}],
  bridge:'READ.FLU.L04.01', bridgeName:'Smooth Passage',
  watch:{ q:'The Esrog', m:{type:'scene',e:'🍋',t:'Ch. 1: Abba brings home an esrog in a box, wrapped in soft flax. Ch. 2: The lid is open. The esrog is gone! A trail of flax leads to the porch. Ch. 3: Little Dovid made it a bed in a shoebox. Shmuel does not yell; he is gentle. Dovid gives it back. Abba thanks Dovid for caring and Shmuel for being gentle.'}, steps:[
    {t:'I read the chapter title and guess what is coming. I read each chapter in smooth scoops, then make my bookmark.'},
    {t:'After Chapter 1, I say one bookmark sentence: Abba brought home a special esrog.'},
    {t:'After Chapter 2: The esrog went missing. That is the problem.'},
    {t:'After Chapter 3: Shmuel found Dovid making it a bed. Chapter 3 tells how the problem was solved.'},
    {t:'I connect them: at the Sukkos table, Abba thanked Dovid for caring, and Shmuel for being gentle with Dovid.'}], a:'One bookmark sentence per chapter.' },
  oops:{ q:'What did Abba bring?', wrong:'a lulav and esrog', right:'an esrog in a box', why:'Check Chapter 1 exactly. It says only an esrog in a box. Do not add things.' },
  ways:['think-aloud','bookmark sentences','order the chapters','sort by chapter','Mistake Detective'], done:'You can keep track of a chapter book!',
  board:{ one:'After every chapter, say one bookmark sentence. Connect the chapters.', activity:'Bookmark strips: boys write one sentence per chapter and line them up.', mistakes:['Adding things the book never said','Forgetting what happened in earlier chapters','Mixing up which chapter had which event'] },
  do:[
    {type:'match', pairs:[['Chapter 1','a new esrog'],['Chapter 2','it is gone'],['Chapter 3','it is solved']], say:'Match each chapter to its bookmark.', how:'Say one sentence for each chapter. The problem starts in Chapter 2 and is solved in Chapter 3.'},
    {type:'tiles', w:['esrog comes','goes missing','Dovid\'s bed','Abba thanks'], hear:'Abba brought home a special esrog. The esrog went missing. Shmuel found Dovid making it a bed. Abba thanked both boys.', q:'The whole book', say:'Listen. Put the four big events in order.', how:'Abba brought home a special esrog. The esrog went missing. Shmuel found Dovid making it a bed. Abba thanked both boys.'}],
  your:[
    {type:'sort', bins:['Chapter 2','Chapter 3'], cards:[['the lid is open',0],['a trail of flax',0],['a shoebox bed',1],['give it back',1]], say:'In which chapter did this happen?', how:'Chapter 2: the esrog is missing. Chapter 3: Dovid and the shoebox bed.'},
    {type:'listen', q:'Shmuel did not yell. He spoke softly.', hear:'Why did Abba thank Shmuel?', o:['was gentle','found it','bought it'], a:'was gentle', say:'Listen. Why did Abba thank Shmuel?', how:'Abba thanked Shmuel for being gentle with Dovid.'},
    {type:'sort', q:'What does Chapter 1 say?', bins:['Book says it','Not in book'], cards:[['an esrog',0],['a lulav',1],['soft flax',0],['a new hadas',1]], say:'Mistake Detective: did the book say this?', how:'The mistake is adding what the book never said. Check Chapter 1 exactly: an esrog in a box, wrapped in flax.'},
    {type:'match', pairs:[['Dovid','for caring'],['Shmuel','for being gentle'],['Abba','got the esrog']], say:'Match each person to what the book says.', how:'Dovid was thanked for caring. Shmuel was thanked for being gentle with Dovid.'},
    {type:'listen', q:'Challenge: a new book', hear:'Chapter 1: Birds eat Chaim\'s seeds. Chapter 2: Chaim and Zeidy build a net. Chapter 3: Chaim picks red tomatoes. Which chapter tells how the problem was solved?', o:['1','2','3'], a:'2', say:'Challenge! Which chapter solves the problem?', how:'Find the problem first: birds eat the seeds. The net solves it, in Chapter 2. The solution is not always the last chapter. In The Esrog, Chapter 3 solves it.'}] };

B['READ.LIT.L04.01']={ band:'B23', pic:'💌', today:'Find the moral a story teaches', why:'Every good story has a lesson you can use in your own life.',
  ready:[{q:'Where is a story\'s problem solved?', o:['the end','the title','the cover'], a:'the end'},{q:'"Ezriel gave the coin back." What did he do?', o:['gave it back','kept it','lost it'], a:'gave it back'}],
  bridge:'READ.LIT.L03.01', bridgeName:'Retell It',
  watch:{ q:'Shimon\'s Promise', m:{type:'scene',e:'🤝',t:'Shimon promised to help Bubby rake leaves on Sunday. On Sunday, his friends called him to play ball. Shimon said, I promised Bubby. Bubby gave him a big hug.'}, steps:[
    {t:'I ask: what did the character do? Shimon kept his promise to Bubby.'},
    {t:'I ask: what happened because of it? Bubby gave him a big hug. That clue shows the choice was good.'},
    {t:'I say the lesson as a rule for everyone: We should keep our promises.'},
    {t:'I check: is it a lesson, or just a detail? "Playing ball is fun" is a detail. "Keep your promises" is the moral.'},
    {t:'I do the same with any story. A boy made a thank-you card for Mr. Katz, the bus driver. Moral: Thank the people who help you.'}], a:'Moral: Keep your promises.' },
  oops:{ q:'Moral of the Shimon story?', wrong:'Playing ball is fun', right:'Keep your promises', why:'A moral is a lesson for everyone, not a detail from the story.' },
  ways:['think-aloud','order the story','match story and moral','find the clue','Mistake Detective'], done:'You can find the moral of a story!',
  board:{ one:'The moral is a lesson for everyone: We should...', activity:'Read a short story; each boy finishes the sentence "We should..." and the class picks the one the clues prove.', mistakes:['Giving a detail instead of a lesson','Telling what happened, not what we learn','Picking a clue that does not connect to the lesson'] },
  do:[
    {type:'sort', q:'Ezriel gave back the shiny coin he found.', bins:['A lesson','A detail'], cards:[['Give back lost things',0],['The coin was shiny',1],['Ezriel found a coin',1],['Be honest',0]], say:'Is it a lesson for everyone, or a detail?', how:'A lesson tells us what we should do. A detail is just a fact in the story.'},
    {type:'tiles', w:['promise','friends call','keeps it','hug'], hear:'Shimon promised to help Bubby. His friends called him to play. He kept his promise. Bubby hugged him.', q:'Shimon\'s Promise', say:'Listen. Put the story in order.', how:'The promise comes first. Then the test: his friends call. Then his choice, then the hug.'}],
  your:[
    {type:'sort', q:'Yossi sat with the new boy and shared.', bins:['The moral','Just a detail'], cards:[['Include others',0],['Pretzels are salty',1],['It was lunch',1],['Be a friend',0]], say:'Mistake Detective: is it the moral, or a detail?', how:'The mistake is giving a detail. A moral is a rule for everyone, like: Thank the people who help you.'},
    {type:'listen', q:'Yossi and the new boy', hear:'A new boy sat alone at lunch. Yossi sat down next to him and shared his pretzels. What did Yossi do?', o:['shared','left','ran'], a:'shared', say:'Listen. What did Yossi do?', how:'First find what the character did. Yossi sat with him and shared. In the bus story, he made a thank-you card for Mr. Katz.'},
    {type:'sort', q:'Shimon\'s Promise', bins:['Shows the moral','Does not'], cards:[['Bubby hugged him',0],['friends played ball',1],['he said I promised',0],['it was Sunday',1]], say:'Does this clue show the moral?', how:'The best clue shows the good choice or what it did. In the bus story: Mr. Katz\'s eyes shone when he read the card.'},
    {type:'match', pairs:[['gave a coin back','be honest'],['made a card','say thank you'],['tried again','do not give up']], say:'Match each story to its moral.', how:'What did he do? What does it teach us to do?'},
    {type:'listen', q:'Challenge: a new story', hear:'Moshe found his Mishnayos hard. He practised a little every night. At the siyum, he knew it all by heart. What is the moral?', o:['Keep trying','Eat cake','Sit still'], a:'Keep trying', say:'Challenge! Tap the moral.', how:'What did he do? He kept practising. Rule for everyone: keep trying, even when it is hard.'}] };
