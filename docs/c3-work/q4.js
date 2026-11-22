
B['READ.LIT.L04.02']={ band:'B23', pic:'🌷', today:'Use clues to tell what a character is like', why:'People show who they are by what they do and say. Good readers notice it.',
  ready:[{q:'A moral is...', o:['a lesson','a name','a place'], a:'a lesson'},{q:'Which word is a feeling?', o:['happy','table','run'], a:'happy'}],
  bridge:'READ.LIT.L04.01', bridgeName:'Moral of the Story',
  watch:{ q:'The Flower Pot', m:{type:'scene',e:'🌷',t:'Pinchas knocked over Mrs. Stern\'s flower pot by mistake. Nobody saw. He knocked on her door, said sorry, and helped her plant new flowers. "You are a good boy," she said.'}, steps:[
    {t:'I watch the actions. Nobody saw, but Pinchas went back and said sorry.'},
    {t:'I ask why. The story shows he takes care of what he does wrong. I use the story\'s clues, not my own guess.'},
    {t:'I listen to what others say: "You are a good boy." That is a clue too.'},
    {t:'I ask: what kind of person does that? A trait word: honest. A trait is what he is like all the time.'},
    {t:'Same steps in any story. Rachel gave up her seat because she knew Michal feels sick on long rides. Michal said, "You always notice things." Trait: thoughtful.'}], a:'Pinchas is honest.' },
  oops:{ q:'Why did Pinchas go back?', wrong:'Mrs. Stern saw him', right:'to say sorry and help', why:'The story says nobody saw. He went back on his own. Use the story\'s clues, not a guess.' },
  ways:['think-aloud','match action and trait','sort traits and feelings','story clue or guess','Mistake Detective'], done:'You can use clues to tell what a character is like!',
  board:{ one:'Actions + words = clues. Ask: what kind of person does that?', activity:'Trait charades: a boy acts out a kind or brave action; the class names the trait and the clue.', mistakes:['Guessing a reason the story never gives','Naming a feeling instead of a trait','Only looking at what the character says'] },
  do:[
    {type:'match', pairs:[['gave up his seat','thoughtful'],['told the truth','honest'],['tried again','determined']], say:'Match each action to a trait word.', how:'Ask: what kind of person does that?'},
    {type:'sort', bins:['Trait (always)','Feeling (now)'], cards:[['honest',0],['happy',1],['brave',0],['tired',1],['kind',0],['sad',1]], say:'Is it a trait, or a feeling?', how:'A trait is what he is like all the time. A feeling is how he feels right now.'}],
  your:[
    {type:'listen', q:'Akiva and the books', hear:'A boy dropped all his books in the hall. Akiva stopped and helped him pick them up. Which word describes Akiva?', o:['kind','funny','sleepy'], a:'kind', say:'Listen. Tap the trait word.', how:'Helping someone is a kind action. Kind is the trait.'},
    {type:'sort', q:'Why did Pinchas go back?', bins:['Story clue','My guess'], cards:[['he said sorry',0],['she saw him',1],['he helped plant',0],['he was bored',1]], say:'Mistake Detective: a story clue, or a guess?', how:'The mistake is guessing what the story never says. It says nobody saw.'},
    {type:'match', pairs:[['honest','told the truth'],['brave','spoke up'],['thoughtful','"You notice"']], say:'Match each trait to the clue that proves it.', how:'Find the action or words that show the trait. Michal said, "You always notice things." That proves thoughtful.'},
    {type:'sort', q:'Akiva and the books', bins:['A clue','Not a clue'], cards:[['he stopped',0],['the hall was long',1],['he picked them up',0],['books are heavy',1]], say:'Does it tell us what Akiva is like?', how:'A clue is what he does or says. In The Last Seat, the clue was why Rachel acted: she knew Michal feels sick on long rides.'},
    {type:'listen', q:'Challenge: Ari and his brother', hear:'Ari\'s little brother was scared of the dark. Ari left the hall light on and sat with him until he fell asleep. Which word describes Ari?', o:['caring','funny','sleepy'], a:'caring', say:'Challenge! Which trait fits Ari?', how:'He stayed with his brother so he would not be scared. That shows caring.'}] };

B['READ.PHON.L04.01']={ band:'B23', pic:'🧩', today:'Use prefixes and suffixes to read big words', why:'Big words are built from small parts. Know the parts and you know the word.',
  ready:[{q:'Un means...', o:['not','again','before'], a:'not'},{q:'Re means...', o:['again','not','full'], a:'again'}],
  bridge:'READ.VOC.L03.01', bridgeName:'Prefix Start',
  watch:{ q:'careless', m:{type:'tiles',w:['care','less']}, steps:[
    {t:'A big word: careless. I cover the end. I read the base word: care.', m:{type:'tiles',w:['care','less'],hi:[0]}},
    {t:'I uncover the end: less. A suffix goes at the end. Less means without. Careless means without care.', m:{type:'tiles',w:['care','less'],hi:[1]}},
    {t:'Ful means full of: careful means full of care. Ful and less are opposites!'},
    {t:'Prefixes go at the start. Un and dis mean not: unsafe, disagree means not agree. Re means again: replay means play again.', m:{type:'tiles',w:['dis','agree'],hi:[0]}},
    {t:'My steps: cover the parts, read the base, add the meanings back. Useless: use + less = without a use.'}], a:'dis = not, re = again, -less = without, -ful = full of' },
  oops:{ q:'Hopeless means?', wrong:'full of hope', right:'without hope', why:'-less means without. -ful means full of.' },
  ways:['think-aloud','build words with tiles','match part and meaning','sort -ful and -less','Mistake Detective'], done:'You can read big words by their parts!',
  board:{ one:'Cover the parts, read the base, add the meanings back.', activity:'Word-part cards: boys build words from prefix, base and suffix cards and say the meaning.', mistakes:['Mixing up -ful and -less','Reading the base but forgetting the prefix','Thinking re or un is a prefix in every word (real, uncle)'] },
  do:[
    {type:'match', pairs:[['dis-','not'],['re-','again'],['-less','without'],['-ful','full of']], say:'Match each word part to its meaning.', how:'Prefixes go at the start. Suffixes go at the end.'},
    {type:'tiles', w:['un','safe'], extra:['less'], q:'Build: not safe', say:'Build the word that means not safe.', how:'Not is a prefix, so it goes first: un, then safe.'}],
  your:[
    {type:'listen', hear:'rebuild', o:['build again','not build','no build'], a:'build again', say:'Listen. What does rebuild mean?', how:'Re means again. Rebuild means build again.'},
    {type:'sort', bins:['-ful: full of','-less: without'], cards:[['hopeful',0],['hopeless',1],['thankful',0],['fearless',1],['careful',0],['painless',1]], say:'Mistake Detective: full of, or without?', how:'The mistake is mixing them up. Hopeless means without hope, not full of hope.'},
    {type:'tiles', w:['dis','like'], extra:['re','ful'], q:'Ima dislikes mess. Build: not like', say:'Build the word that means not like.', how:'Not is a prefix, so it goes first: dis, then like.'},
    {type:'sort', q:'Is re a prefix here?', bins:['re = again','not a prefix'], cards:[['redo',0],['refill',0],['real',1],['reach',1],['reread',0]], say:'Cover re. Is a real word left?', how:'Cover re. Is the rest a real word? Redo: do, yes. Real: al, no. So re is not a prefix in real.'},
    {type:'tiles', w:['un','help','ful'], extra:['re','less'], q:'Challenge: build unhelpful', say:'Challenge! Build a word with a prefix AND a suffix.', how:'Not goes first: un. Then the base: help. Then full of: ful. Unhelpful.'}] };

B['READ.VOC.L04.01']={ band:'B23', pic:'🔎', today:'Use clue words to find a new word\'s meaning', why:'You meet new words every day. The words around them tell you what they mean.',
  ready:[{q:'Un means...', o:['not','again','full of'], a:'not'},{q:'What does refill mean?', o:['fill again','not fill','full'], a:'fill again'}],
  bridge:'READ.VOC.L03.01', bridgeName:'Prefix Start',
  watch:{ q:'spotless', m:{type:'scene',e:'🧽',t:'After we cleaned for Pesach, the kitchen was spotless. Not one crumb was left on the floor.'}, steps:[
    {t:'A new word: spotless. I read the whole sentence and the next one.'},
    {t:'I hunt for clue words: cleaned for Pesach, not one crumb. So I think spotless means very clean.'},
    {t:'Swap test: the kitchen was very clean. Does it make sense? Yes!'},
    {t:'Word parts help too: unreadable is un + read + able, not able to be read.'},
    {t:'More from clue words: a workshop with tools covering every table is cluttered: messy and full. A boy who stands on the dock a long time and says, "The water looks cold," is reluctant: not wanting to.'}], a:'spotless = very clean' },
  oops:{ q:'"The icy path was hazardous." Hazardous?', wrong:'foggy', right:'dangerous', why:'Hazardous looks like hazy, but do not guess from the look. The clue icy tells you danger.' },
  ways:['think-aloud','find the clue words','swap test','word parts','Mistake Detective'], done:'You can use clue words to find what a word means!',
  board:{ one:'Read the whole sentence, find the clue words, then do the swap test.', activity:'Clue hunt: underline the clue words in three sentences and swap in a meaning.', mistakes:['Guessing from how the word sounds','Ignoring the clue words in the next sentence','Not checking with the swap test'] },
  do:[
    {type:'findall', q:'The tea was scalding hot, so it can burn!', grid:['The','tea','was','It','hot','can','burn','so'], find:['hot','burn'], findSay:'clue word', say:'Tap the clue words for scalding.', how:'Which words tell about scalding? Hot and burn. Scalding means very hot.'},
    {type:'match', pairs:[['spotless','very clean'],['scalding','very hot'],['hazardous','dangerous']], say:'Match each word to its meaning.', how:'Think of the clue words you saw. Then do the swap test.'}],
  your:[
    {type:'listen', q:'Dovid was famished.', hear:'Dovid was famished. He had not eaten all day. What does famished mean?', o:['hungry','tired','happy'], a:'hungry', say:'Listen. Use the clue. What does famished mean?', how:'The clue: he had not eaten all day. Famished means very hungry.'},
    {type:'tiles', w:['un','break','able'], extra:['re'], q:'Build: not able to be broken', say:'Build the word with three parts.', how:'Not goes first: un. Then break. Then able. Unbreakable.'},
    {type:'sort', q:'Icy and slippery, the path was hazardous.', bins:['A real clue','Just a guess'], cards:[['icy',0],['slippery',0],['looks like hazy',1],['a long word',1]], say:'Mistake Detective: a real clue, or a guess?', how:'The mistake is guessing from the look. The clue icy tells you: hazardous means dangerous.'},
    {type:'findall', q:'The box was enormous, as big as a car!', grid:['The','box','was','big','as','a','car','so'], find:['big','car'], findSay:'clue word', say:'Tap the clue words for enormous.', how:'Big and as big as a car are the clues. Enormous means very big.'},
    {type:'listen', q:'Challenge: the drowsy baby', hear:'The baby was drowsy. Her eyes kept closing, and she yawned. What does drowsy mean?', o:['sleepy','hungry','angry'], a:'sleepy', say:'Challenge! Find the clues. Tap the meaning.', how:'Eyes closing and yawning are the clues. Drowsy means sleepy.'}] };

B['READ.VOC.L04.02']={ band:'B23', pic:'📖', today:'Find words in a dictionary, in ABC order', why:'A dictionary tells you any word\'s meaning, if you know how to find it fast.',
  ready:[{q:'Which letter comes first in ABC order?', o:['b','d','g'], a:'b'},{q:'Which letter comes after m?', o:['n','l','p'], a:'n'}],
  bridge:'READ.VOC.L04.01', bridgeName:'Use context clues for new words',
  watch:{ q:'Which page has thumb?', m:{type:'scene',e:'📖',t:'Guide words at the top of a page: tea, tiger. Is thumb on this page?'}, steps:[
    {t:'Dictionaries are in ABC order. I look at the first letter: t, t, t. All the same.'},
    {t:'Same first letter? The second letter is the tiebreaker: te, th, ti. E, h, i are in ABC order.'},
    {t:'Guide words show the first and last word on the page. Thumb starts with th, between te and ti. So thumb is on this page.'},
    {t:'A word can have many meanings. Light: 1. not heavy. 2. what lets us see. In "the box was so light", light means not heavy.'}], a:'Thumb is on the tea to tiger page.' },
  oops:{ q:'Which comes first: shell or seed?', wrong:'shell', right:'seed', why:'Same first letter. Look at letter 2: e comes before h.' },
  ways:['think-aloud','ABC order with tiles','guide-word pages','pick the meaning','Mistake Detective'], done:'You can find words in a dictionary!',
  board:{ one:'First letter, then second letter; guide words show the page.', activity:'Line up: each boy holds a word card, and the class lines up in ABC order.', mistakes:['Stopping at the first letter when it is the same','Ignoring the guide words','Picking the first meaning without checking the sentence'] },
  do:[
    {type:'listen', q:'kugel, latke, bagel', hear:'Which word comes first in ABC order: kugel, latke, or bagel?', o:['bagel','kugel','latke'], a:'bagel', say:'Listen. Which word comes first?', how:'Look at the first letter only: b comes before k and l.'},
    {type:'tiles', w:['fish','flag','fork'], q:'ABC order: letter 2', say:'All start with f. Put them in order.', how:'Same first letter, so look at letter 2: i, l, o.'}],
  your:[
    {type:'sort', q:'Guide words: bat, bus', bins:['On this page','Not on it'], cards:[['bed',0],['bird',0],['cat',1],['bake',1],['box',0]], say:'Is the word on the bat to bus page?', how:'It must come after bat and before bus. Bake comes before bat, so it is not on the page.'},
    {type:'tiles', w:['shell','shop','shul'], q:'ABC order: letter 3', say:'Put them in order. Look closely!', how:'S and h are the same. Look at letter 3: e, o, u.'},
    {type:'match', pairs:[['a light box','not heavy'],['the light is on','lets us see'],['hit with a bat','a wooden stick'],['a bat flew out','flying animal']], say:'Match each phrase to the meaning that fits.', how:'Try each meaning in the phrase. Keep the one that makes sense.'},
    {type:'listen', q:'Which comes first?', hear:'Which comes first in a dictionary: chair, cake, or city?', o:['cake','chair','city'], a:'cake', say:'Mistake Detective: which comes first?', how:'The mistake is stopping at letter 1. All start with c. Letter 2: a comes before h and i, so cake is first.'},
    {type:'sort', q:'Challenge: guide words mat, mop', bins:['On this page','Not on it'], cards:[['milk',0],['map',1],['mitten',0],['move',1],['meat',0]], say:'Challenge! Is it on the mat to mop page?', how:'Map comes before mat: letter 3, p comes before t. Move comes after mop: letter 3, v comes after p.'}] };

B['READ.VOC.L04.03']={ band:'B23', pic:'☁️', today:'Tell real words from expressions', why:'People say "on cloud nine" all the time. Knowing expressions helps you understand them.',
  ready:[{q:'Cluttered means...', o:['messy and full','clean','empty'], a:'messy and full'},{q:'What helps you find a new word\'s meaning?', o:['clue words','the page number','the title'], a:'clue words'}],
  bridge:'READ.VOC.L04.01', bridgeName:'Use context clues for new words',
  watch:{ q:'Yehuda\'s Big Game', m:{type:'scene',e:'⚾',t:'Before the game, Yehuda had butterflies in his stomach. But hitting the ball was a piece of cake. After the win, he was walking on air.'}, steps:[
    {t:'I read: butterflies in his stomach. Literal means the words mean exactly that. Real butterflies? No!'},
    {t:'It does not make sense, so it is an expression: a saying with a hidden meaning. Butterflies in his stomach means nervous.'},
    {t:'A piece of cake: did he eat cake? No. It means easy. Walking on air means very happy.'},
    {t:'Same steps in any story. The test was a breeze: the test was easy. Avraham had ants in his pants. That means he could not sit still. In hot water means in trouble.'}], a:'If the words do not make sense, find the hidden meaning.' },
  oops:{ q:'"Hold your horses." Means?', wrong:'grab a horse', right:'wait', why:'It is an expression: slow down and wait.' },
  ways:['think-aloud','sort literal and expression','match expression and meaning','real meaning or silly picture','Mistake Detective'], done:'You can understand expressions!',
  board:{ one:'If the words do not make sense, it is an expression with a hidden meaning.', activity:'Draw it: boys draw the silly literal picture of an expression, then write its real meaning.', mistakes:['Taking an expression literally','Thinking every sentence is an expression','Not checking whether the literal meaning makes sense'] },
  do:[
    {type:'match', pairs:[['piece of cake','easy'],['walking on air','very happy'],['butterflies','nervous']], hear:'Before the game, Yehuda had butterflies in his stomach. But hitting the ball was a piece of cake.', say:'Listen. Match each expression to what it really means.', how:'Ask: do the real words make sense here? If not, find the hidden meaning.'},
    {type:'sort', bins:['Literal','Expression'], cards:[['ate some cake',0],['butterflies in stomach',1],['saw a butterfly',0],['walking on air',1]], say:'Do the words mean exactly that, or not?', how:'Could it really happen? Then it is literal. If not, it is an expression.'}],
  your:[
    {type:'listen', hear:'It is raining cats and dogs outside. What does that mean?', o:['hard rain','pets','cats run'], a:'hard rain', say:'Listen. Tap the hidden meaning.', how:'Cats and dogs cannot fall from the sky. It means it is raining very hard.'},
    {type:'sort', bins:['Expression','Literal'], cards:[['hit the books',0],['read a book',1],['I\'m all ears',0],['washed his ears',1]], say:'Which sentence uses an expression?', how:'Could it really happen? Then it is literal. If not, it is an expression.'},
    {type:'match', pairs:[['hit the books','study hard'],['all ears','listening'],['cold feet','too scared']], say:'Match each expression to its meaning.', how:'Picture the words. Silly? Find the hidden meaning. Like the test was a breeze: the test was easy.'},
    {type:'sort', q:'"Hold your horses!"', bins:['Real meaning','Silly picture'], cards:[['wait',0],['grab a horse',1],['slow down',0],['ride away',1]], say:'Mistake Detective: real meaning, or silly picture?', how:'The mistake is reading it literally. Hold your horses means slow down and wait.'},
    {type:'listen', q:'Challenge: Mendy\'s room', hear:'Before Shabbos, Mendy cleaned his room in the blink of an eye. It was done before Ima came back! What does in the blink of an eye mean?', o:['very fast','very slow','eyes shut'], a:'very fast', say:'Challenge! Use the clues. What does it mean?', how:'Picture it: no one cleans with an eye blink. The clue: done before Ima came back. It means very fast.'}] };
