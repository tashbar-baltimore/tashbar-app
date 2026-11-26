
/* ---------- Grade 3 (L04), Unit 3 "Opinion with Reasons" (docs/core-growth/W13-map.md, W.3.1): the "Speak Up" page of The Shabbos Street News.
   Rabbi Feld asks the club: should Shabbos Street have a Lag BaOmer bonfire or a barbecue? Chaim says bonfire, Dovid says barbecue.
   Opinion writing with the SRSD strategy TREE: T = Topic sentence (my opinion), R = Reasons (3), E = Explain each reason, E = Ending.
   Piece 7 (an opinion about a book with reasons from the text) uses the live C23 chapter book C1 "The Shabbos Street Club and the Missing
   Map", chapter 1 (texts/C23/C23.B1.01): the Grade 3 C23 book C2 is not live yet. */
(function () {
  var LESSONS = {

  'WRIT.ESSAY.L04.02':{name:'TREE Plan',
  teach:[
    {how:'An opinion is what you think or believe. Another boy may think differently. TREE helps you plan it: T Topic sentence, R Reasons, E Explain, E Ending.', q:'In TREE, what does the R stand for?', o:['Reasons','Read it again','Remember the title']},
    {how:'T, the topic sentence, tells your opinion in one clear sentence: “Our street should have a bonfire on Lag BaOmer.”', q:'Which line could be the topic sentence of an opinion piece?', o:['Our street should have a barbecue on Lag BaOmer.','Lag BaOmer comes in the spring.','Dovid ate two hot dogs last year.']},
    {how:'The first E, Explain, says more about a reason: why it matters, or an example.', q:'Reason: “A barbecue feeds everyone.” Which line explains it?', o:['Every family can bring kosher burgers and share.','Barbecues are a lot of fun.','My sister likes the color red.']}
  ],
  practice:[
    {t:'order', q:'Put the parts of TREE in order.', tiles:['T: Topic sentence: my opinion','R: Reasons: three or more','E: Explain each reason','E: Ending: my opinion again'], h:'Say the TREE chant in your head.'},
    {t:'pairs', q:'Match each part of TREE to its job.', pairs:[['T','tells my opinion'],['R','gives a reason why'],['E (Explain)','says more about a reason'],['E (Ending)','says my opinion again']],
      h:'Think of what each letter stands for.'},
    {t:'sort', q:'Mistake Detective. A good TREE plan, or a mistake?', bins:[{id:'G',label:'Good plan'},{id:'M',label:'Mistake'}],
      items:[{label:'The topic sentence tells my opinion.',bin:'G'},{label:'Three reasons that support it.',bin:'G'},{label:'No ending at all.',bin:'M'},{label:'A reason for the other side.',bin:'M'}],
      h:'Check each letter: T, R, E, E.'},
    {t:'spotall', q:'Opinion: “Our street should have a barbecue.” Tap every reason that supports it.', cells:[{label:'Everyone can eat together.',ok:true},{label:'Families can share kosher food.',ok:true},{label:'It is safe for little kids.',ok:true},{label:'A bonfire is bright.',ok:false},{label:'My shoes are new.',ok:false}],
      h:'Does it give a reason FOR a barbecue?'},
    {t:'pairs', q:'Match each reason to the line that explains it.', pairs:[['We can sing together.','Everyone sits in a circle and sings.'],['A fire lights up the night.','We can see each other’s faces in the dark.'],['A bonfire is a Lag BaOmer custom.','Boys all over the world light one that night.']],
      h:'Which line says more about that reason?'},
    {t:'order', q:'Put Chaim’s TREE plan in order.', tiles:['Our street should have a Lag BaOmer bonfire.','One reason is that we can sing together.','Everyone sits in a circle and sings.','That is why our street needs a bonfire.'], h:'Opinion, reason, explain, ending.'}
  ],
  check:[
    {pic:'🐟', q:'Shimon’s plan: “Our class should keep a fish tank.” / “Fish are calm to watch.” / “So let’s bring a fish tank to our class.” Which line is the ending?', o:['So let’s bring a fish tank to our class.','Fish are calm to watch.','Our class should keep a fish tank.'], h:'Which line comes last and says the opinion again?'},
    {pic:'🏊', q:'Avi’s opinion: “Every boy should learn to swim.” Which line is a reason that supports it?', o:['Swimming keeps you safe near water.','The town pool opens in June.','Avi has a blue towel with stripes.'], h:'Which line tells WHY every boy should learn?'},
    {pic:'🚲', q:'Dovid’s reason: “A bike helps you get places.” Then he wrote: “I can ride to cheder in five minutes.” Which TREE part is that second line?', o:['Explain','Topic sentence','Ending'], h:'Does the line give the opinion, say more about a reason, or end?'}
  ],
  re:[
    {how:'A new way: a TREE has a trunk (your opinion), branches (reasons) and leaves (the details that explain).', q:'The branches of the TREE are the…', o:['reasons','ending','title']},
    {how:'A simpler step: just say T, R, E, E.', q:'What comes first in TREE?', o:['the Topic sentence','the Ending','the Reasons']},
    {how:'The skill underneath: you planned a story with POW + WWW. POW stays; for an opinion, TREE takes the place of W-W-W.', q:'For an opinion, O in POW means organize with…', o:['TREE','W-W-W','a map']}
  ]},

  'WRIT.PARA.L04.10':{name:'Introduce the Topic',
  teach:[
    {how:'An opinion piece starts by telling the topic and your opinion, in one clear sentence. Opinion words: I think, I believe, should, the best.', q:'Which sentence states an opinion?', o:['I think every street should have a Lag BaOmer bonfire.','Lag BaOmer is the 33rd day of the Omer.','Our street has twelve houses on it.']},
    {how:'A fact can be checked. An opinion is what someone thinks; another boy may disagree.', q:'Which one is a fact?', o:['The park opens at nine.','The park is the best place to play.','Everyone should go to the park.']},
    {how:'Do not just name the topic. “I will tell you about Lag BaOmer” has no opinion. Tell what you think.', q:'Which opening is a mistake?', o:['I will tell you about Lag BaOmer.','Our street should have a bonfire this Lag BaOmer.','I believe a barbecue is the best way to spend Lag BaOmer.']}
  ],
  practice:[
    {t:'sort', q:'Fact, or opinion?', bins:[{id:'F',label:'Fact'},{id:'O',label:'Opinion'}],
      items:[{label:'Lag BaOmer comes in the spring.',bin:'F'},{label:'The shul has two doors.',bin:'F'},{label:'Bonfires are the best part of Lag BaOmer.',bin:'O'},{label:'Our street should have a barbecue.',bin:'O'}],
      h:'Can you check it? Or is it what someone thinks?'},
    {t:'sort', q:'Mistake Detective. A clear opinion sentence, or a mistake?', bins:[{id:'C',label:'Clear opinion'},{id:'M',label:'Mistake'}],
      items:[{label:'Our club should paint the clubhouse blue.',bin:'C'},{label:'This is about the clubhouse.',bin:'M'},{label:'I believe the library should stay open late.',bin:'C'},{label:'I am going to write now.',bin:'M'}],
      h:'Does it tell the topic AND what the writer thinks?'},
    {t:'spotall', q:'Tap every opinion word.', cells:[{label:'I think',ok:true},{label:'should',ok:true},{label:'the best',ok:true},{label:'I believe',ok:true},{label:'on Sunday',ok:false},{label:'twelve',ok:false}],
      h:'Which words show what someone thinks?'},
    {t:'order', q:'Build an opinion sentence.', tiles:['I believe','our street should have','a Lag BaOmer bonfire.'], h:'Opinion words, then the topic.'},
    {t:'pairs', q:'Match each topic to its opinion sentence.', pairs:[['the clubhouse','Our clubhouse needs a new roof.'],['recess','Recess should be ten minutes longer.'],['the library','The shul library should have more books about animals.']],
      h:'Which opinion is about that topic?'},
    {t:'sort', q:'Does it introduce the topic with an opinion?', bins:[{id:'Y',label:'Yes'},{id:'N',label:'Not yet'}],
      items:[{label:'Every boy should help set up the sukkah.',bin:'Y'},{label:'The sukkah is in the yard.',bin:'N'},{label:'I think fish make the best class pets.',bin:'Y'},{label:'Let me tell you something.',bin:'N'}],
      h:'Do you know the topic and what the writer thinks?'}
  ],
  check:[
    {pic:'🪑', q:'Which sentence is an opinion?', o:['Shabbos Street needs a new bench by the shul.','Shabbos Street has a bench by the shul.','The bench by the shul is made of wood.'], h:'Which one tells what someone thinks? Can the others be checked?'},
    {pic:'📚', q:'Yitzy’s piece is about the school library. Which first sentence introduces the topic AND his opinion?', o:['Our school library should stay open at lunch.','I am going to write about the library now.','The library has many shelves of books.'], h:'Which one names the topic and says what he thinks?'},
    {pic:'🗳️', q:'“Recess should be longer.” Which word shows that this sentence is an opinion?', o:['should','recess','longer'], h:'Which word tells what the writer wants?'}
  ],
  re:[
    {how:'A new way: a fact is like a ruler: you can measure it. An opinion is like a favorite color: it is yours.', q:'An opinion is…', o:['what someone thinks','something you can measure','always true']},
    {how:'A simpler step: look for I think, I believe, should, or the best.', q:'“I believe…” starts…', o:['an opinion','a fact','a question']},
    {how:'The skill underneath: a topic sentence tells what the paragraph is about (Paragraph Builder). An opinion topic sentence adds what you think.', q:'An opinion topic sentence tells…', o:['the topic and what I think','only the topic','only the ending']}
  ]},

  'WRIT.PARA.L04.11':{name:'Reasons That Support',
  teach:[
    {how:'A reason tells WHY you think so. A good reason really supports your opinion.', q:'Opinion: “Our class should have a reading corner.” Which reason supports it?', o:['Boys would read more in a cozy spot.','The classroom has a round clock.','Recess is at twelve o’clock.']},
    {how:'A reason for the other side does not belong in your piece.', q:'Opinion: “We should have a barbecue.” Which reason is a mistake?', o:['A bonfire lets everyone sing together.','Everyone can eat together.','Families can share kosher food.']},
    {how:'Saying your opinion again is not a reason. “It is good because it is good” gives no why.', q:'Which is a real reason?', o:['A garden gives us fresh vegetables.','A garden is good because it is good.','I want a garden because I want one.']}
  ],
  practice:[
    {t:'sort', q:'Opinion: “Every boy should have a library card.” Does the reason support it?', bins:[{id:'Y',label:'Supports it'},{id:'N',label:'Does not'}],
      items:[{label:'He can borrow books for free.',bin:'Y'},{label:'He can find books for school reports.',bin:'Y'},{label:'The library has a red door.',bin:'N'},{label:'Library cards are good because they are good.',bin:'N'}],
      h:'Does it tell WHY he should have one?'},
    {t:'sort', q:'Mistake Detective. A real reason, or a mistake?', bins:[{id:'R',label:'Real reason'},{id:'M',label:'Mistake'}],
      items:[{label:'Trees give cool shade in summer.',bin:'R'},{label:'Trees are trees, so plant them.',bin:'M'},{label:'Birds can build nests in trees.',bin:'R'},{label:'My cousin has a new bike.',bin:'M'}],
      h:'A real reason tells why. It does not repeat or wander off.'},
    {t:'pairs', q:'Match each opinion to its reason.', pairs:[['Our club should meet on Sunday.','Nobody has cheder on Sunday afternoon.'],['Every boy should learn to swim.','Swimming keeps you safe near water.'],['The shul should have a bike rack.','Boys could ride to davening.']],
      h:'Which reason tells why for that opinion?'},
    {t:'spotall', q:'Opinion: “Our clubhouse needs a new roof.” Tap every reason that supports it.', cells:[{label:'Rain drips on our notebooks.',ok:true},{label:'The old roof has holes.',ok:true},{label:'Wind blows in on cold days.',ok:true},{label:'The clubhouse is in a garage.',ok:false},{label:'Avi likes jokes.',ok:false}],
      h:'Which ones tell why it needs a new roof?'},
    {t:'order', q:'Build a sentence with a reason.', tiles:['One reason is that','a reading corner','helps boys read more.'], h:'Start with “One reason is that”.'},
    {t:'pairs', q:'Match each weak reason to what is wrong.', pairs:[['It is good because it is good.','It repeats the opinion.'],['A bonfire is bright.','It is for the other side.'],['My shoes are new.','It is off the topic.']],
      h:'Does it repeat, switch sides, or wander off?'}
  ],
  check:[
    {pic:'🪪', q:'Opinion: “Every boy should have a library card.” Which reason supports it?', o:['He can take books home to read.','The library is on Park Street.','Library cards are blue and white.'], h:'Which one tells WHY?'},
    {pic:'🌳', q:'Opinion: “Our street should plant more trees.” Which reason is a mistake?', o:['Trees are trees, so we should plant them.','Trees give cool shade in summer.','Birds can build nests in the trees.'], h:'Which one gives no real why?'},
    {pic:'📅', q:'Opinion: “Our club should meet on Sunday.” Which reason does NOT support it?', o:['Chaim’s bike is blue and fast.','Nobody has cheder on Sunday afternoon.','Everyone is home after lunch on Sunday.'], h:'Which one is not about meeting on Sunday?'}
  ],
  re:[
    {how:'A new way: reasons are the legs of a table. Without legs, the opinion falls down.', q:'Reasons…', o:['hold up the opinion','repeat the opinion','end the piece']},
    {how:'A simpler step: after your opinion, ask “Why?” The answer is a reason.', q:'To find a reason, ask…', o:['Why?','When?','Who?']},
    {how:'The skill underneath: details that prove (Details That Prove). Reasons prove an opinion the way details prove a topic.', q:'A good reason…', o:['proves the opinion','is about something else','is a title']}
  ]},

  'WRIT.PARA.L04.12':{name:'Linking Words',
  teach:[
    {how:'“Because” and “since” give a reason: “We should have a bonfire because we can sing together.”', q:'“Our street should have a barbecue ___ everyone gets to eat.” Which word fits?', o:['because','therefore','for example']},
    {how:'“For example” gives an example that shows your reason: “A barbecue feeds everyone. For example, the Levis can bring corn.”', q:'Which sentence gives an example?', o:['For example, the Levis can bring corn.','Therefore, we need a grill.','Since it is spring.']},
    {how:'“Therefore” means “so”. It comes before what should happen because of your reasons.', q:'“Bonfires are bright and warm. ___, our street should have one.” Which word fits?', o:['Therefore','For example','Since']}
  ],
  practice:[
    {t:'sort', q:'What does each linking word do?', bins:[{id:'R',label:'Gives a reason'},{id:'X',label:'Gives an example'},{id:'S',label:'Means “so”'}],
      items:[{label:'because',bin:'R'},{label:'since',bin:'R'},{label:'for example',bin:'X'},{label:'therefore',bin:'S'}],
      h:'Does it tell why, show an example, or tell what follows?'},
    {t:'sort', q:'Mistake Detective. Right linking word, or a mistake?', bins:[{id:'R',label:'Right'},{id:'M',label:'Mistake'}],
      items:[{label:'We should plant trees because they give shade.',bin:'R'},{label:'We should plant trees therefore they give shade.',bin:'M'},{label:'Trees help birds. For example, robins nest in them.',bin:'R'},{label:'Trees help birds. Because, robins nest in them.',bin:'M'}],
      h:'Because gives the why. For example gives an example.'},
    {t:'pairs', q:'Match each start to its end.', pairs:[['We need a reading corner','because boys would read more.'],['Fruit is healthy. For example,','apples have vitamins.'],['The roof leaks. Therefore,','we need a new one.']],
      h:'Read each pair out loud. Does it make sense?'},
    {t:'spotall', q:'Tap every linking word in Chaim’s piece.', cells:[{label:'because',ok:true},{label:'For example',ok:true},{label:'Therefore',ok:true},{label:'bonfire',ok:false},{label:'Lag BaOmer',ok:false}],
      h:'Which words join a reason to the opinion?'},
    {t:'order', q:'Build a linked sentence.', tiles:['Our street should have a bonfire','because','we can sing together.'], h:'Opinion, then the linking word, then the reason.'},
    {t:'order', q:'Put the paragraph in order.', tiles:['Our street should have a barbecue.','One reason is that everyone can eat together.','For example, every family can bring one dish.','Therefore, a barbecue is the best plan.'], h:'Opinion, reason, example, then “therefore”.'}
  ],
  check:[
    {pic:'🐠', q:'“Our class should have a fish tank ___ fish are calm to watch.” Which word fits?', o:['because','therefore','for example'], h:'The second part tells why.'},
    {pic:'🍎', q:'“Many fruits grow on trees. ___, apples, cherries and plums all grow on trees.” Which words fit?', o:['For example','Therefore','Because'], h:'The second sentence names some fruits.'},
    {pic:'🌧️', q:'“It is raining hard. ___, the club will meet inside.” Which word fits?', o:['Therefore','For example','Because'], h:'The rain makes something happen. Which word means “so”?'}
  ],
  re:[
    {how:'A new way: linking words are bridges. Because crosses to the why. For example crosses to a sample. Therefore crosses to the result.', q:'“Because” leads to…', o:['the why','an example','the ending']},
    {how:'A simpler step: use “because” after your opinion.', q:'“We should rest ___ we are tired.”', o:['because','therefore','for example']},
    {how:'The skill underneath: you linked facts with also, another and but (Fact Linking Words). Opinions use their own linking words.', q:'Which word links a reason?', o:['because','another','also']}
  ]},

  'WRIT.PARA.L04.13':{name:'Concluding Statement',
  teach:[
    {how:'A concluding statement says your opinion again, in new words, at the end.', q:'Opinion: “Our street should have a bonfire.” Which is a strong concluding statement?', o:['So let’s gather around the fire this Lag BaOmer!','The end.','Also, fires are hot.']},
    {how:'Do not add a new reason at the end. Your reasons go in the middle.', q:'Which ending is a mistake?', o:['Also, a bonfire is easy to build.','That is why our street needs a bonfire.','So come and sing with us at the fire!']},
    {how:'A strong ending can ask the reader to do something: “Vote for the barbecue!”', q:'Which ending asks the reader to act?', o:['Come to the meeting and vote for the barbecue!','Barbecues have hot grills.','I like Lag BaOmer a lot.']}
  ],
  practice:[
    {t:'sort', q:'Mistake Detective. A strong ending, or a weak one?', bins:[{id:'S',label:'Strong ending'},{id:'W',label:'Weak ending'}],
      items:[{label:'So let’s plant trees on every corner!',bin:'S'},{label:'The end.',bin:'W'},{label:'Also, trees can be tall.',bin:'W'},{label:'That is why our street needs more trees.',bin:'S'}],
      h:'A weak ending stops, or adds a new reason.'},
    {t:'pairs', q:'Match each weak ending to what is wrong.', pairs:[['The end.','It just stops.'],['Also, fires are warm.','It adds a new reason.'],['Our street should have a bonfire.','It copies the topic sentence word for word.']],
      h:'Does it stop, add, or copy?'},
    {t:'spotall', q:'Opinion: “Every boy should learn to swim.” Tap every strong ending.', cells:[{label:'So sign up for swim lessons this summer!',ok:true},{label:'That is why every boy should learn to swim safely.',ok:true},{label:'The end.',ok:false},{label:'Also, pools have slides.',ok:false}],
      h:'Which ones say the opinion again, or ask the reader to act?'},
    {t:'order', q:'Build a concluding statement.', tiles:['That is why','our street needs','a Lag BaOmer bonfire.'], h:'Closing words, then the opinion again.'},
    {t:'order', q:'Put the opinion piece in order.', tiles:['Our club should paint the clubhouse.','The old paint is peeling off.','A fresh coat would make it look new.','So grab a brush and help us paint!'], h:'Opinion, reasons, then the ending.'},
    {t:'sort', q:'Does the ending say the opinion again, or ask the reader to act?', bins:[{id:'A',label:'Opinion again'},{id:'D',label:'Asks the reader to act'}],
      items:[{label:'That is why our street needs a bonfire.',bin:'A'},{label:'Come and sing with us at the fire!',bin:'D'},{label:'A reading corner is the best idea for our class.',bin:'A'},{label:'Bring a book from home for our new corner!',bin:'D'}],
      h:'Does it repeat what you think, or tell the reader what to do?'}
  ],
  check:[
    {pic:'🐟', q:'Shimon’s opinion: “Our class should keep a fish tank.” Which concluding statement is strong?', o:['So let’s bring fish to our class and watch them swim!','Fish tanks need water, so we must fill ours up.','The end, and that is all I have to say about it.'], h:'Which one says the opinion again in new words?'},
    {pic:'🏊', q:'Avi’s piece says every boy should learn to swim. It ends: “Also, the pool has a slide.” What is wrong?', o:['It adds a new reason at the end.','It says his opinion again.','Nothing, it is a strong ending.'], h:'What should an ending never add?'},
    {pic:'🪪', q:'Opinion: “Every boy should have a library card.” Which ending says it again in NEW words?', o:['So go and get your card, and start reading today!','Every boy should have a library card.','Library cards are small enough for a wallet.'], h:'Which one says the same idea, but in new words?'}
  ],
  re:[
    {how:'A new way: the ending is the last knock on the door. It reminds the reader what you want.', q:'A concluding statement…', o:['says the opinion again','adds a new reason','starts a story']},
    {how:'A simpler step: start your ending with “That is why” or “So”.', q:'Which can start a concluding statement?', o:['That is why','Another reason','For example']},
    {how:'The skill underneath: a strong close says the big idea a new way (Strong Close).', q:'In TREE, the concluding statement is the…', o:['Ending','Topic sentence','Reason']}
  ]}
  };

  var TEACH = {
  'WRIT.ESSAY.L04.02':{hook:'How do you get people to agree with you?', big:'Plan an opinion with TREE: Topic sentence, Reasons, Explain, Ending.',
    intro:['T: tell your opinion in one clear sentence.','R: give three reasons why.','E: explain each reason: say more, or give an example.','E: end by saying your opinion again.'],
    ex:[{q:'Chaim: a Lag BaOmer bonfire',steps:['T: Our street should have a bonfire.','R: We can sing together.','E: Everyone sits in a circle and sings.','E: That is why our street needs a bonfire.'],a:'A full TREE plan.'},
        {q:'Dovid: a barbecue',steps:['R: Everyone can eat together.','E: Every family brings one kosher dish to share.'],a:'A reason, then its explanation.'}],
    oops:{q:'Chaim’s plan for a bonfire.',wrong:'R: Barbecues are tasty.',right:'R: We can all sing together around the fire.',why:'A reason must support YOUR opinion, not the other side.'},
    idea:['A TREE has a trunk (your opinion), branches (reasons) and leaves (the explaining).'],
    try:{q:'Which is a reason for a bonfire?',o:['The fire lights up the night.','Burgers taste good.'],a:'The fire lights up the night.',steps:['Does it support the bonfire?']}},
  'WRIT.PARA.L04.10':{hook:'How does a reader know what you think, right away?', big:'Introduce the topic and tell your opinion in the first sentence.',
    intro:['Name the topic.','Tell what you think, with an opinion word: I think, I believe, should, the best.','A fact can be checked; an opinion is what you think.','Never just “I will tell you about…”.'],
    ex:[{q:'Topic: the library',steps:['Topic: the school library.','What I think: it should stay open at lunch.'],a:'Our school library should stay open at lunch.'},
        {q:'Fact or opinion?',steps:['“The park opens at nine.” You can check it: a fact.','“The park is the best place.” What someone thinks: an opinion.'],a:'Know the difference.'}],
    oops:{q:'Opening an opinion piece.',wrong:'I will tell you about Lag BaOmer.',right:'Our street should have a bonfire this Lag BaOmer.',why:'Tell the topic AND what you think.'},
    idea:['A fact is a ruler: you can measure it. An opinion is your favorite color.'],
    try:{q:'Which is an opinion?',o:['Recess should be longer.','Recess is at noon.'],a:'Recess should be longer.',steps:['Look for “should”.']}},
  'WRIT.PARA.L04.11':{hook:'How do you make your opinion strong?', big:'Give reasons that really support your opinion.',
    intro:['After your opinion, ask: Why?','Each answer is a reason.','Keep only reasons that support YOUR side.','“It is good because it is good” is not a reason.'],
    ex:[{q:'Opinion: our class should have a reading corner',steps:['Why? Boys would read more.','Why? A quiet spot helps us think.'],a:'Two real reasons.'},
        {q:'Reasons from a book',steps:['Opinion: Avi is the club’s map expert.','Proof from the book: “This river is our river,” he said.'],a:'A reason with proof from the text.'}],
    oops:{q:'Opinion: we should have a barbecue.',wrong:'A bonfire lets everyone sing.',right:'Everyone can eat together.',why:'The first reason is for the other side.'},
    idea:['Reasons are the legs of a table: no legs, and the opinion falls.'],
    try:{q:'Which is a real reason?',o:['Trees give shade.','Trees are trees.'],a:'Trees give shade.',steps:['Does it tell why?']}},
  'WRIT.PARA.L04.12':{hook:'How do you join your reasons to your opinion?', big:'Link with because, since, therefore and for example.',
    intro:['because, since: give the reason.','for example: show an example.','therefore: means “so”: what should happen.','Read it out loud: does it make sense?'],
    ex:[{q:'Bonfire and singing',steps:['Opinion + because + reason.'],a:'We should have a bonfire because we can sing together.'},
        {q:'A barbecue feeds everyone',steps:['Give an example.'],a:'For example, the Levis can bring corn.'}],
    oops:{q:'Trees help birds. ___ robins nest in them.',wrong:'Because, robins nest in them.',right:'For example, robins nest in them.',why:'Robins are an example, so use “for example”.'},
    idea:['Linking words are bridges: to the why, to an example, or to the result.'],
    try:{q:'“We should rest ___ we are tired.”',o:['because','for example'],a:'because',steps:['The second part tells why.']}},
  'WRIT.PARA.L04.13':{hook:'How do you end so the reader remembers what you want?', big:'End with a concluding statement: your opinion again, in new words.',
    intro:['Say your opinion again in new words.','You can ask the reader to do something.','No new reasons at the end.','Never just “The end.”'],
    ex:[{q:'Bonfire piece',steps:['Opinion again, new words.'],a:'That is why our street needs a Lag BaOmer bonfire.'},
        {q:'Ask the reader to act',steps:['Tell him what to do.'],a:'So come and sing with us at the fire!'}],
    oops:{q:'Ending of the bonfire piece.',wrong:'Also, a bonfire is easy to build.',right:'That is why our street needs a bonfire.',why:'A new reason does not end the piece.'},
    idea:['The ending is the last knock on the door: it reminds the reader what you want.'],
    try:{q:'Which can start an ending?',o:['That is why','Another reason'],a:'That is why',steps:['Endings wrap up.']}}
  };

  var HOWTO = {
  'WRIT.ESSAY.L04.02':{s:'T: tell your opinion.\nR: give three reasons.\nE: explain each reason.\nE: end with your opinion again.'},
  'WRIT.PARA.L04.10':{s:'Name the topic.\nTell what you think: I think, I believe, should, the best.\nA fact can be checked. An opinion is what you think.\nNever “I will tell you about…”.'},
  'WRIT.PARA.L04.11':{s:'Ask: Why?\nEach answer is a reason.\nKeep reasons for YOUR side.\nRepeating the opinion is not a reason.'},
  'WRIT.PARA.L04.12':{s:'because, since: the why.\nfor example: an example.\ntherefore: so.\nRead it out loud.'},
  'WRIT.PARA.L04.13':{s:'Say your opinion again in new words.\nOr ask the reader to act.\nNo new reasons.\nNever “The end.”'}
  };

  var BITE = {
  'WRIT.ESSAY.L04.02':{ band:'B23', pic:'🔥', today:'Plan an opinion with TREE', why:'A plan helps people see why you are right.',
    ready:[{q:'In POW, W means…', o:['Write and say more','Wait for help','Wipe the board'], a:'Write and say more'}],
    bridge:'WRIT.ESSAY.L04.01', bridgeName:'POW + WWW',
    watch:{ q:'The Shabbos Street News has a new page: Speak Up! Rabbi Feld asks: a bonfire or a barbecue for Lag BaOmer?', m:{type:'scene', e:'🔥', t:'Chaim says, “A bonfire!” Dovid says, “A barbecue!” Each one must convince the street.'}, steps:[
      {t:'An opinion is what you think. Others may think something else.'},
      {t:'Chaim plans with TREE. T: “Our street should have a Lag BaOmer bonfire.”'},
      {t:'R: Reasons. “We can sing together. The fire lights up the night.”'},
      {t:'E: Explain. “Everyone sits in a circle and sings, with the grown-ups watching the fire.”'},
      {t:'E: Ending. “That is why our street needs a bonfire!”'},
      {t:'Dovid plans too. His reasons are for the barbecue, not the bonfire.'},
      {t:'Grow a TREE with me! Trunk, branches, leaves, then hands up high!', m:{type:'move', t:'Stand tall like a trunk: T! Arms out like branches: R! Wiggle your fingers like leaves: E! Hands high: E, the ending!'}}], a:'TREE: Topic sentence, Reasons, Explain, Ending.' },
    oops:{ q:'Chaim’s plan for a bonfire.', wrong:'R: Barbecues are tasty.', right:'R: We can all sing together around the fire.', why:'A reason must support YOUR opinion, not the other side.' },
    ways:['worked example','movement','story map','Mistake Detective','tap the sentence','put it in order','match it','fill the gap','listen'], done:'You can plan an opinion with TREE! Tell your chavrusa your opinion and one reason.',
    board:{ key:'Show me answers (for the rebbe): So let’s bring a fish tank to our class. · Swimming keeps you safe near water. · Explain', one:'TREE: Topic sentence (my opinion), Reasons (3), Explain each reason, Ending (my opinion again).', activity:'Hold a class vote on a small question (the best Shabbos dessert, kosher of course). Each side builds a TREE plan on the board.', mistakes:['A reason for the other side','No explaining','No ending'] },
    do:[
      {type:'storymap', slots:['T · Topic sentence','R · Reason','E · Explain','E · Ending'], cards:['Our street should have a Lag BaOmer bonfire.','We can all sing together.','Everyone sits in a circle and sings.','That is why our street needs a bonfire.'], extra:['Barbecues are tasty.'],
        say:'Build Chaim’s TREE plan.', how:'Opinion, a reason, say more about it, then the ending.'},
      {type:'sort', q:'Chaim’s plan: a bonfire.', bins:['Fits the plan','Mistake'], cards:[['We can sing together.',0],['The fire lights up the night.',0],['Barbecues are tasty.',1],['My cousin lives in Toronto.',1]], mis:true,
        say:'Mistake Detective! Does it fit Chaim’s plan?', how:'A reason must support a bonfire.'}],
    your:[
      {type:'evidence', q:'Dovid’s plan. Which line is his topic sentence?', p:['Everyone can eat together.','Our street should have a barbecue on Lag BaOmer.','Every family can bring one dish.','So vote for the barbecue!'], a:1, look:'the line that tells his opinion',
        say:'Find Dovid’s topic sentence.', how:'Which line tells what he thinks?'},
      {type:'order', steps:['Topic sentence','Reasons','Explain','Ending'],
        say:'Put the parts of TREE in order.', how:'Grow the tree: trunk, branches, leaves, top.'},
      {type:'match', pairs:[['We can sing together.','Everyone sits in a circle and sings.'],['A barbecue feeds everyone.','Every family brings one kosher dish.'],['A fire lights the night.','We can see each other’s faces.']],
        say:'Match each reason to the line that explains it.', how:'Which line says more about that reason?'},
      {type:'cloze', t:'Shimon’s opinion: Our class should keep a fish tank. Reason: Fish are ___ to watch.', o:['calm','loud','late'], a:'calm',
        say:'Finish Shimon’s reason.', how:'Why would fish be good in a class?'},
      {type:'listen', q:'“That is why every boy should learn to swim.”', hear:'That is why every boy should learn to swim.', o:['the Ending','a Reason','the Explain'], a:'the Ending',
        say:'Listen. Which part of TREE is it?', how:'Does it start, give a reason, or wrap up?'}] },

  'WRIT.PARA.L04.10':{ band:'B23', pic:'📣', today:'Start an opinion piece with your opinion', why:'The reader should know what you think right away.',
    ready:[{q:'In TREE, the T is…', o:['the topic sentence','a reason','the ending'], a:'the topic sentence'}],
    bridge:'WRIT.ESSAY.L04.02', bridgeName:'TREE Plan',
    watch:{ q:'Dovid wrote his first line for Speak Up: “I will tell you about Lag BaOmer.” Avi laughs: “But what do you THINK?”', m:{type:'scene', e:'📣', t:'A Speak Up piece must say what the writer thinks, right at the start.'}, steps:[
      {t:'A fact can be checked: “Lag BaOmer is in the spring.”'},
      {t:'An opinion is what you think: “A barbecue is the best way to spend Lag BaOmer.”'},
      {t:'Opinion words help: I think, I believe, should, the best.'},
      {t:'Dovid fixes it: “I believe our street should have a barbecue this Lag BaOmer.”'},
      {t:'Now the reader knows the topic AND what Dovid thinks.'},
      {t:'Say it with me! Fist up for a fact, thumb up for an opinion!', m:{type:'move', t:'Fist up: “The park opens at nine.” A fact! Thumb up: “The park is the best!” An opinion!'}}], a:'Name the topic and say what you think.' },
    oops:{ q:'Opening an opinion piece.', wrong:'I will tell you about Lag BaOmer.', right:'Our street should have a bonfire this Lag BaOmer.', why:'Tell the topic AND what you think.' },
    ways:['worked example','movement','sort it','tap the sentence','match it','fill the gap','build with tiles','find them all','listen','Mistake Detective'], done:'You can start an opinion piece! Now your reader knows what you think.',
    board:{ key:'Show me answers (for the rebbe): Shabbos Street needs a new bench by the shul. · Our school library should stay open at lunch. · should', one:'Introduce the topic and state the opinion in one clear sentence; know fact from opinion.', activity:'Read ten sentences aloud. Boys show a fist for a fact and a thumb for an opinion, then fix two “I will tell you about…” openings.', mistakes:['“I will tell you about…”','A fact instead of an opinion','No topic named'] },
    do:[
      {type:'sort', q:'Opening lines for Speak Up.', bins:['Clear opinion','Mistake'], cards:[['Our club should paint the clubhouse blue.',0],['This is about the clubhouse.',1],['I believe the library should stay open late.',0],['I am going to write now.',1]], mis:true,
        say:'Mistake Detective! Clear opinion, or a mistake?', how:'Does it name the topic AND say what the writer thinks?'},
      {type:'findall', grid:['I think','on Sunday','should','twelve','the best','I believe'], find:['I think','should','the best','I believe'], findSay:'opinion words',
        say:'Tap every opinion word.', how:'Which words show what someone thinks?'}],
    your:[
      {type:'sort', bins:['Fact','Opinion'], cards:[['Lag BaOmer comes in the spring.',0],['The shul has two doors.',0],['Bonfires are the best part of Lag BaOmer.',1],['Our street should have a barbecue.',1]],
        say:'Fact or opinion? Sort them.', how:'Can you check it? Or is it what someone thinks?'},
      {type:'evidence', q:'Which first line introduces the topic AND an opinion?', p:['The sukkah is in the yard.','Let me tell you something.','Every boy should help set up the sukkah.','Sukkos is in the fall.'], a:2, look:'the topic plus what the writer thinks',
        say:'Find the line that tells the opinion.', how:'Which one says what the writer thinks?'},
      {type:'tiles', w:['I believe','our street should have','a Lag BaOmer bonfire.'], extra:['I will tell you'],
        say:'Build Chaim’s opening sentence.', how:'Opinion words first, then the topic.'},
      {type:'cloze', t:'Recess ___ be ten minutes longer.', o:['should','is','was'], a:'should',
        say:'Pick the word that makes it an opinion.', how:'Which word tells what the writer wants?'},
      {type:'listen', q:'“The best day of the week is Shabbos.”', hear:'The best day of the week is Shabbos.', o:['an opinion','a fact','a question'], a:'an opinion',
        say:'Listen. Is it a fact or an opinion?', how:'Listen for “the best”.'}] },

  'WRIT.PARA.L04.11':{ band:'B23', pic:'🦵', today:'Give reasons that really support your opinion', why:'Strong reasons make people agree with you.',
    ready:[{q:'“Bonfires are the best.” This is…', o:['an opinion','a fact','a reason'], a:'an opinion'}],
    bridge:'WRIT.PARA.L04.10', bridgeName:'Introduce the Topic',
    watch:{ q:'Dovid’s Speak Up piece says: “We should have a barbecue because barbecues are good.” Naftali shakes his head.', m:{type:'scene', e:'🦵', t:'Naftali’s Zeidy says: “Reasons are the legs of a table. Is your table standing?”'}, steps:[
      {t:'A reason tells WHY. Ask your opinion: Why?'},
      {t:'Why a barbecue? “Everyone can eat together.” A real reason!'},
      {t:'“Because barbecues are good” just says the opinion again. No leg!'},
      {t:'“A bonfire is bright” is a reason for the OTHER side. It does not hold up Dovid’s table.'},
      {t:'Reasons can come from a book too: find the sentence that proves it.'},
      {t:'Stamp with me! One stamp for every real reason: stamp, stamp, stamp!', m:{type:'move', t:'Stamp one foot for each real reason: everyone eats, families share, little kids are safe! Three legs, the table stands!'}}], a:'A real reason tells why and supports YOUR side.' },
    oops:{ q:'Opinion: we should have a barbecue.', wrong:'A bonfire lets everyone sing.', right:'Everyone can eat together.', why:'The first reason is for the other side.' },
    ways:['worked example','movement','sort it','tap the proof in the book','match it','fill the gap','put it in order','listen','Mistake Detective'], done:'You can give reasons that support your opinion! Tell your chavrusa one reason from a book.',
    board:{ key:'Show me answers (for the rebbe): He can take books home to read. · Trees are trees, so we should plant them. · Chaim’s bike is blue and fast.', one:'A reason tells why and supports YOUR opinion; no repeats, no other side, no wandering off; reasons can come from a text.', activity:'Write one opinion on the board. Boys call out reasons; the class keeps only the ones that tell why for that side.', mistakes:['Repeating the opinion as a reason','A reason for the other side','A reason about something else'] },
    do:[
      {type:'sort', q:'Opinion: our street should plant more trees.', bins:['Real reason','Mistake'], cards:[['Trees give cool shade in summer.',0],['Trees are trees, so plant them.',1],['Birds can build nests in trees.',0],['My cousin has a new bike.',1]], mis:true,
        say:'Mistake Detective! Real reason, or a mistake?', how:'A real reason tells why. It does not repeat or wander off.'},
      {type:'proof', text:'C23.B1.01', q:'Opinion: Avi knows maps better than anyone in the club. Which sentence proves it?', proof:'This river is our river', look:'what Avi sees on the map',
        say:'Open the book. Find the proof.', how:'Look for what Avi says about the map.'}],
    your:[
      {type:'match', pairs:[['Our club should meet on Sunday.','Nobody has cheder on Sunday afternoon.'],['Every boy should learn to swim.','Swimming keeps you safe near water.'],['The shul should have a bike rack.','Boys could ride to davening.']],
        say:'Match each opinion to its reason.', how:'Which reason tells why for that opinion?'},
      {type:'evidence', q:'Opinion: our clubhouse needs a new roof. Which reason supports it?', p:['The clubhouse is in a garage.','Rain drips on our notebooks.','Avi likes jokes.','The roof is very old because it is old.'], a:1, look:'a reason that tells why',
        say:'Find the reason that supports it.', how:'Which one tells WHY it needs a roof?'},
      {type:'cloze', t:'Opinion: every boy should have a library card. Reason: he can borrow books for ___.', o:['free','lunch','Pesach'], a:'free',
        say:'Finish the reason.', how:'What is good about a library card?'},
      {type:'listen', q:'“A garden is good because it is good.”', hear:'A garden is good because it is good.', o:['It repeats the opinion.','It is a real reason.','It is for the other side.'], a:'It repeats the opinion.',
        say:'Listen. What is wrong with this reason?', how:'Does it tell a real why?'},
      {type:'order', steps:['Our street should have a barbecue.','One reason is that everyone can eat together.','Another reason is that families can share food.','That is why a barbecue is the best plan.'],
        say:'Put Dovid’s piece in order.', how:'Opinion first, then the reasons, then the ending.'}] },

  'WRIT.PARA.L04.12':{ band:'B23', pic:'🌉', today:'Link reasons with because, therefore and for example', why:'Linking words help the reader follow your thinking.',
    ready:[{q:'Ask your opinion this question to find a reason:', o:['Why?','Where?','Who?'], a:'Why?'}],
    bridge:'WRIT.PARA.L04.15', bridgeName:'Fact Linking Words',
    watch:{ q:'Chaim’s Speak Up piece sounds choppy: “We should have a bonfire. We can sing. Fires are bright. We should have one.”', m:{type:'scene', e:'🌉', t:'Rabbi Feld says, “Build bridges between your sentences!”'}, steps:[
      {t:'“Because” gives the reason: “We should have a bonfire because we can sing together.”'},
      {t:'“Since” works the same way: “Since the fire is bright, we can see everyone.”'},
      {t:'“For example” shows an example: “We can sing songs. For example, we can sing Bar Yochai.”'},
      {t:'“Therefore” means “so”: “Bonfires are bright and warm. Therefore, our street should have one.”'},
      {t:'Now Chaim’s reasons hold hands with his opinion.'},
      {t:'Chant it with me, and clap on each linking word!', m:{type:'chant', lines:['Because and since, they tell you why,','For example shows, give it a try!','Therefore means so, it tells the end,','Linking words, a writer’s best friend!']}}], a:'because, since: why · for example: an example · therefore: so.' },
    oops:{ q:'Trees help birds. ___ robins nest in them.', wrong:'Because, robins nest in them.', right:'For example, robins nest in them.', why:'Robins are an example, so use “for example”.' },
    ways:['worked example','chant','combine sentences','sort it','tap the sentence','match it','fill the gap','put it in order','listen','Mistake Detective'], done:'You can link your reasons! Read one linked sentence to your chavrusa.',
    board:{ key:'Show me answers (for the rebbe): because · For example · Therefore', one:'because and since give the reason; for example gives an example; therefore means so.', activity:'Give pairs two cut-up sentences and three linking-word cards. They choose the card that makes it make sense, and read it aloud.', mistakes:['“Because,” starting an example','“Therefore” before a reason','No linking words at all'] },
    do:[
      {type:'combine', a:'Our street should have a bonfire.', b:'We can sing together.', o:['because','therefore','or'], j:'because', mis:true,
        say:'Careful! Join the opinion to its reason.', how:'The second part tells why. Which word gives the why?'},
      {type:'sort', q:'Linking words.', bins:['Right','Mistake'], cards:[['We should plant trees because they give shade.',0],['We should plant trees therefore they give shade.',1],['Trees help birds. For example, robins nest in them.',0],['Trees help birds. Because, robins nest in them.',1]],
        say:'Mistake Detective! Right word, or a mistake?', how:'Because gives the why. For example gives an example.'}],
    your:[
      {type:'match', pairs:[['because','gives the reason'],['for example','gives an example'],['therefore','means “so”']],
        say:'Match each linking word to its job.', how:'Does it tell why, show, or tell what follows?'},
      {type:'cloze', t:'Fruit is healthy. ___, apples have vitamins.', o:['For example','Therefore','Because'], a:'For example',
        say:'Pick the linking words.', how:'Apples are one fruit. Is that an example?'},
      {type:'evidence', q:'Which sentence uses “therefore” the right way?', p:['The roof leaks. Therefore, we need a new one.','Therefore the roof, it leaks.','We need a roof therefore.','Therefore, for example, because.'], a:0, look:'“therefore” meaning “so”',
        say:'Find the right “therefore”.', how:'Read it out loud. Does “so” fit there?'},
      {type:'listen', q:'“We should rest, since we walked all day.”', hear:'We should rest, since we walked all day.', o:['gives a reason','gives an example','means so'], a:'gives a reason',
        say:'Listen. What does “since” do here?', how:'Does it tell why?'},
      {type:'order', steps:['Our street should have a barbecue.','One reason is that everyone can eat together.','For example, every family can bring one dish.','Therefore, a barbecue is the best plan.'],
        say:'Put the paragraph in order.', how:'Opinion, reason, example, then “therefore”.'}] },

  'WRIT.PARA.L04.13':{ band:'B23', pic:'🚪', today:'End an opinion piece strongly', why:'A strong ending makes the reader remember what you want.',
    ready:[{q:'In TREE, the last E is…', o:['the Ending','Explain','a reason'], a:'the Ending'}],
    bridge:'WRIT.PARA.L04.04', bridgeName:'Strong Close',
    watch:{ q:'Chaim’s Speak Up piece ends: “Also, fires are warm. The end.” Avi says, “Wait, what do you want us to do?”', m:{type:'scene', e:'🚪', t:'The ending is the last knock on the door.'}, steps:[
      {t:'A concluding statement says the opinion again, in new words.'},
      {t:'“That is why our street needs a Lag BaOmer bonfire.”'},
      {t:'It can also ask the reader to act: “Come and sing with us at the fire!”'},
      {t:'Not a new reason at the end: “Also, fires are warm.” That belongs in the middle.'},
      {t:'And never just “The end.”'},
      {t:'Knock with me, three knocks, and say it: That is why!', m:{type:'move', t:'Knock, knock, knock on the desk! Then point to the class: That is why our street needs a bonfire!'}}], a:'Say the opinion again in new words, or ask the reader to act.' },
    oops:{ q:'Ending of the bonfire piece.', wrong:'Also, a bonfire is easy to build.', right:'That is why our street needs a bonfire.', why:'A new reason does not end the piece.' },
    ways:['worked example','movement','sort it','tap the sentence','match it','fill the gap','put it in order','story map','listen','Mistake Detective'], done:'You can end an opinion piece! Your Speak Up piece is ready to plan.',
    board:{ key:'Show me answers (for the rebbe): So let’s bring fish to our class and watch them swim! · It adds a new reason at the end. · So go and get your card, and start reading today!', one:'End with the opinion again in new words, or ask the reader to act; no new reasons; never “The end.”', activity:'Read an opinion piece with three possible endings. The class votes for the strongest and says why the others are weak.', mistakes:['A new reason at the end','Copying the topic sentence word for word','“The end.”'] },
    do:[
      {type:'sort', q:'Endings for “our street should plant more trees”.', bins:['Strong ending','Weak ending'], cards:[['So let’s plant trees on every corner!',0],['The end.',1],['Also, trees can be tall.',1],['That is why our street needs more trees.',0]], mis:true,
        say:'Mistake Detective! Strong ending, or weak?', how:'A weak ending stops, or adds a new reason.'},
      {type:'match', pairs:[['The end.','It just stops.'],['Also, fires are warm.','It adds a new reason.'],['Our street should have a bonfire.','It copies the topic sentence.']],
        say:'Match each weak ending to what is wrong.', how:'Does it stop, add, or copy?'}],
    your:[
      {type:'evidence', q:'Opinion: every boy should learn to swim. Which is the strong ending?', p:['Also, pools have slides.','The end.','So sign up for swim lessons this summer!','Every boy should learn to swim.'], a:2, look:'the ending that asks the reader to act',
        say:'Find the strong ending.', how:'Which one wraps up and asks the reader to act?'},
      {type:'cloze', t:'That is ___ our street needs a Lag BaOmer bonfire.', o:['why','also','first'], a:'why',
        say:'Finish the concluding statement.', how:'Which word makes “That is ___” an ending?'},
      {type:'storymap', slots:['T · Topic sentence','R · Reason','E · Ending'], cards:['Our club should paint the clubhouse.','The old paint is peeling off.','So grab a brush and help us paint!'], extra:['Also, paint is wet.'],
        say:'Build the opinion piece, ending last.', how:'Which card wraps it up?'},
      {type:'listen', q:'“Come to the meeting and vote for the barbecue!”', hear:'Come to the meeting and vote for the barbecue!', o:['asks the reader to act','adds a new reason','copies the topic'], a:'asks the reader to act',
        say:'Listen. What kind of ending is it?', how:'Does it tell the reader what to do?'},
      {type:'order', steps:['Our club should paint the clubhouse.','The old paint is peeling off.','A fresh coat would make it look new.','So grab a brush and help us paint!'],
        say:'Put the opinion piece in order.', how:'Opinion, reasons, then the ending.'}] }
  };

  if (window.TLCORE) TLCORE.add('W13', LESSONS, { teach: TEACH, howto: HOWTO, bite: BITE });

  /* Unit W13.U33 = Grade 3, Unit 3 "Opinion with Reasons". The real task (map: Gr 3 pieces 6 and 7): ONE Writing Workshop piece. The boy picks:
     the "Speak Up" question (piece 6), or an opinion about the club book he read, with reasons from it (piece 7). */
  var PIECE6 = { id: 'W13.OPIN3.01', title: 'Speak Up!', grade: 3, kind: 'opinion',
    prompt: 'Write for the Speak Up page of The Shabbos Street News. Pick one: (1) Should our street have a Lag BaOmer bonfire or a barbecue? (2) In “Half a Map”, chapter 1 of The Shabbos Street Club and the Missing Map, which club member would you want on your team? Give reasons from the book. Tell your opinion, give three reasons, explain each one, and end strongly.',
    strategy: { name: 'POW + TREE', steps: [['P', 'Pick my idea'], ['O', 'Organize my notes: TREE'], ['W', 'Write and say more']],
      more: [['T', 'Topic sentence: my opinion'], ['R', 'Reasons: three'], ['E', 'Explain each reason'], ['E', 'Ending: my opinion again']] },
    plan: [ { k: 'topic', label: 'T · My opinion', hint: 'Our street should have a…' },
            { k: 'r1', label: 'R + E · Reason 1 (and explain)', hint: 'One reason is… For example…' },
            { k: 'r2', label: 'R + E · Reason 2 (and explain)', hint: 'Another reason is…' },
            { k: 'r3', label: 'R + E · Reason 3 (and explain)', hint: 'Also… because…' },
            { k: 'end', label: 'E · My ending', hint: 'That is why… / So come and…' } ],
    starters: ['I believe', 'One reason is', 'because', 'For example,', 'Another reason is', 'Therefore,', 'That is why'],
    min: 70,
    checks: [
      { t: 'I wrote at least 6 sentences.', sentences: 6 },
      { t: 'My first sentence tells my opinion, with words from my plan.', first: 'topic' },
      { t: 'I used every part of my plan.', plan: true },
      { t: 'I linked my reasons with because, since, for example or therefore.', any: ['because', 'since', 'for example', 'therefore'] },
      { t: 'Every sentence starts with a capital and ends with . ! or ?', caps: true },
      { t: 'Every reason supports MY opinion.', self: true },
      { t: 'I read it out loud to myself.', self: true } ],
    rubric: ['My opinion is clear at the start', 'Three reasons that support it', 'Each reason explained', 'Linking words', 'A strong concluding statement', 'Capitals, end marks and spelling'],
    pics: ['🔥', '🍔', '🗺️', '📣'] };

  if (window.TLCORE && TLCORE.units) TLCORE.units.add({ id: 'W13.U33', title: 'Opinion with Reasons', c: 'WRIT', grade: 3,
    skills: ['WRIT.ESSAY.L04.02', 'WRIT.PARA.L04.10', 'WRIT.PARA.L04.11', 'WRIT.PARA.L04.12', 'WRIT.PARA.L04.13'],
    review: ['WRIT.ESSAY.L04.01', 'WRIT.PARA.L04.06', 'WRIT.PARA.L04.09'], n: 10, task: PIECE6,
    items: [
      { skill: 'WRIT.ESSAY.L04.02', type: 'evidence', q: 'Ezra’s plan: “Our class should grow a garden.” Which line is a reason?', p: ['Our class should grow a garden.', 'We could eat our own fresh cucumbers.', 'That is why we need a garden.', 'Gardens need dirt and many seeds and sun.'], a: 1, look: 'the line that tells why', say: 'Find the reason in Ezra’s plan.', how: 'Which line answers “Why?”' },
      { skill: 'WRIT.PARA.L04.10', type: 'evidence', q: 'Which sentence is an opinion?', p: ['The shul has a big clock on the wall.', 'The shul clock rings every hour.', 'The shul needs a quieter clock.', 'The shul clock is made of wood and brass.'], a: 2, look: 'what someone thinks', say: 'Find the opinion.', how: 'Which one can you not check? Which one tells what someone wants?' },
      { skill: 'WRIT.PARA.L04.11', type: 'evidence', q: 'Opinion: “Our class should have a pet bird.” Which reason supports it?', p: ['A bird is a bird, so we want one.', 'Birds sing, and their songs are cheerful.', 'Cats like to chase birds in the yard.', 'My uncle lives in Monsey with his family.'], a: 1, look: 'a real why for a pet bird', say: 'Find the reason that supports it.', how: 'Which one gives a real why?' },
      { skill: 'WRIT.PARA.L04.12', type: 'evidence', q: 'Which sentence uses its linking word the right way?', p: ['Snow is fun. Because, we can sled down the hill.', 'Snow is fun. For example, we can sled down the hill.', 'Snow is fun therefore we sled because.', 'For example snow, the hill, the sled.'], a: 1, look: 'an example after “for example”', say: 'Find the linking word used right.', how: 'Is sledding a reason, an example, or a “so”?' },
      { skill: 'WRIT.PARA.L04.13', type: 'evidence', q: 'Opinion: “Our street should have a book swap.” Which concluding statement is strong?', p: ['Also, books have pages and covers.', 'The end of my piece is here.', 'So bring a book you love, and take home a new one!', 'Our street should have a book swap.'], a: 2, look: 'the opinion again, or what the reader should do', say: 'Find the strong ending.', how: 'Which one wraps up without a new reason or a copy?' },
      { skill: 'WRIT.PARA.L04.12', type: 'evidence', q: 'Which sentence uses “because” the right way?', p: ['We need a new ball because ours has a hole.', 'We need a new ball. Because, for example.', 'Because we need a ball therefore.', 'Ours has a hole because, a new ball.'], a: 0, look: 'a reason after “because”', say: 'Find the right “because”.', how: 'After “because” comes the why.' }
    ] });
})();
