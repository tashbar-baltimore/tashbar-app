/* ---- GRADE 2 (L03, band B23). Quality round (HoS 2026-11-22): think-aloud Watch Me on a short original passage,
   then do 1-2 guided (easiest case), your 1-2 a little harder on a NEW passage, your 3 the Mistake Detective mistake,
   your 4 a new representation, your 5 a challenge or real-world case. ---- */
B['READ.COMP.L03.01']={ band:'B23', pic:'🐝', today:'Find the main topic of a page and its parts', why:'When you know what a page is about, every fact on it makes sense, and you can find what you need.',
  ready:[{q:'Chaim has a cat named Puff. Who has a cat?', o:['Chaim','Puff','Mommy'], a:'Chaim'},{q:'Puff ran to the yard. Where did Puff run?', o:['to the yard','to school','home'], a:'to the yard'}],
  bridge:'READ.COMP.L02.01',
  watch:{ q:'Ants', m:{type:'scene',e:'🐜',t:'Ants. Part 1: Ants live in a nest under the ground. Part 2: Ants carry food home in a long line.'}, steps:[
    {t:'I read the title first: Ants. So I think this page is about ants.'},
    {t:'I notice the word ants in every part. A word that keeps coming back is a big clue.', m:{type:'tiles',w:['Ants','nest','Ants','food'],hi:[0,2]}},
    {t:'I read Part 2 only. I notice carry, food, home, line. Most words tell about carrying food. So Part 2 is mostly about how ants carry food.'},
    {t:'Every part is about ants. So the main topic of the whole page is ants.'},
    {t:'A title must fit the WHOLE page: All About Ants. On a page about bees, the title All About Bees fits. Food or Eggs fits only one part.'}], a:'Main topic of the page: ants. Part 2: how ants carry food.' },
  oops:{ q:'A page about snow says sleds one time. Topic?', wrong:'sleds', right:'snow', why:'The topic is what the whole page is about. Sleds came up only once, in one part.' },
  ways:['think-aloud','find the word that comes back','sort topic and detail','match details to topics','Mistake Detective'], done:'You can find the main topic of a page and of each part!',
  board:{ one:'Read the title, find the word that keeps coming back, check that it fits every part.', activity:'Read a short two-part page aloud; boys hold up a finger each time the topic word comes back, then name what each part is mostly about.', mistakes:['Picking a detail that comes up in one part only','Picking a title that fits only one part','Not reading the title first'] },
  do:[
    {type:'findall', q:'A toad can hop. The toad eats bugs.', grid:['A','toad','can','hop','The','toad','eats','bugs'], find:'toad', findSay:'word that comes back', say:'Which word is in every sentence? Tap it each time.', how:'Read both sentences. One word is in both of them. That word is the topic.'},
    {type:'sort', q:'Dogs bark. Dogs wag. Dogs dig.', bins:['Main topic','Small detail'], cards:[['dogs',0],['barking',1],['wagging',1],['digging',1]], say:'Is it the main topic, or a small detail?', how:'The topic is in every sentence: dogs. Each thing a dog does is a detail.'}],
  your:[
    {type:'match', q:'Owls: which part is it from?', pairs:[['catch mice','how owls hunt'],['nest in a tree','owl homes'],['hoot: whoo!','owl sounds']], say:'Match each sentence to what its part is about.', how:'Read the sentence. Is it about hunting, homes, or sounds?'},
    {type:'sort', bins:['All About Bees','Sukkos Things','Chanukah Things'], cards:[['hive',0],['lulav',1],['candles',2],['honey',0],['esrog',1],['dreidel',2]], say:'Which page title does this detail belong under?', how:'Each title must fit every detail under it. Honey fits All About Bees.'},
    {type:'listen', hear:'Turtles. Part 1: A turtle has a hard shell. It hides inside when it is scared. Part 2: A mother turtle digs a hole in the sand and lays eggs. What is the main topic of the whole page?', o:['turtle','shell','eggs'], a:'turtle', say:'Mistake Detective: which word is in every part?', how:'Shells come up in Part 1 only. Eggs come up in Part 2 only. That is the mistake. Turtles are in every part.'},
    {type:'sort', q:'Turtles. Part 1: shell. Part 2: eggs.', bins:['Fits whole page','Only one part'], cards:[['All About Turtles',0],['Turtle Facts',0],['Hard Shells',1],['Laying Eggs',1],['Mother Turtles',1]], say:'Does this title fit the whole page?', how:'A title for the whole page must fit Part 1 AND Part 2. Hard Shells fits only Part 1.'},
    {type:'listen', q:'Challenge: the shul newsletter', hear:'Part 1: Our shul got new books. Part 2: Yehuda and his friends built a new stand for the rav. What is Part 2 mostly about?', o:['stand','books','sukkah'], a:'stand', say:'Challenge! What is Part 2 mostly about?', how:'Listen to Part 2 only. It tells about the new stand, a shtender for the rav.'}] };

B['READ.COMP.L03.02']={ band:'B23', pic:'🐪', today:'Use headings, captions and bold words to find facts', why:'Text tools are like road signs. They take you straight to the fact you need.',
  ready:[{q:'Which one names the whole page?', o:['the title','the last word','a dot'], a:'the title'},{q:'A page about bees is mostly about...', o:['bees','trees','cars'], a:'bees'}],
  bridge:'READ.COMP.L03.01', bridgeName:'Main Topic',
  watch:{ q:'Beavers', m:{type:'scene',e:'🦫',t:'Beavers. ▶ Building a Dam: A beaver packs sticks and mud to make a DAM. ▶ A Safe Home: The door is under the water. 🦫 A beaver lodge. Word box: dam: a wall that holds back water.'}, steps:[
    {t:'My question: what is a dam? I notice DAM is dark and thick. A bold word is explained nearby.'},
    {t:'So I look in the word box: dam: a wall that holds back water. I found it fast!'},
    {t:'New question: where is the door? I read the headings like road signs. A Safe Home sounds right. It says: The door is under the water. Found it!'},
    {t:'I notice a sentence next to the picture: A beaver lodge. That is the caption. A caption tells about the picture.'},
    {t:'A Safe Home is NOT the caption. It is a heading, a name for a part. On a camel page, the caption is the sentence by the picture: Wide feet help a camel walk on sand.'}], a:'Bold word: look in the word box. Question: pick the heading. Picture: read the caption.' },
  oops:{ q:'Which is the caption?', wrong:'A heading, like Made for Sand', right:'The sentence next to the picture', why:'A heading names a part. A caption is the sentence next to or under a picture and tells about it.' },
  ways:['think-aloud','match tool and job','sort facts under headings','bold words in a word box','Mistake Detective'], done:'You can use text tools to find facts fast!',
  board:{ one:'Headings name a part, captions tell about a picture, bold words are explained in the word box.', activity:'Give each pair a page and three questions; they point to the heading, caption or bold word that answers each one.', mistakes:['Calling a heading the caption','Not looking in the word box for a bold word','Reading every part instead of jumping to the heading'] },
  do:[
    {type:'match', pairs:[['heading','names a part'],['caption','about a picture'],['bold word','a key word']], say:'Match each text tool to its job.', how:'A heading is a road sign for a part. A caption sits by a picture. A bold word is dark and thick.'},
    {type:'sort', q:'Beavers: two headings', bins:['Building a Dam','A Safe Home'], cards:[['sticks and mud',0],['where they sleep',1],['how they build',0],['door under water',1]], say:'Which heading would you read for this?', how:'Building a Dam tells how they build. A Safe Home tells where they live.'}],
  your:[
    {type:'listen', q:'Word box: talons', hear:'Owls. An owl has sharp talons. Word box: talons: sharp claws on a bird\'s feet. What are talons?', o:['claws','eyes','wings'], a:'claws', say:'Talons is a bold word. Use the word box.', how:'A bold word is explained in the word box: talons: sharp claws on a bird\'s feet. On a camel page: hump: a big bump on a camel\'s back.'},
    {type:'sort', q:'Penguins: three headings', bins:['Staying Warm','Finding Food','Penguin Chicks'], cards:[['thick feathers',0],['huddle close',0],['catch fish',1],['dive deep',1],['egg on feet',2]], say:'Which heading would you read for this fact?', how:'Read the headings like road signs. Which part would tell this? On a camel page, why a camel does not sink is under Made for Sand.'},
    {type:'match', q:'Which tool answers it?', pairs:[['meaning of warn','word box'],['where they sleep','a heading'],['what is pictured','the caption']], say:'Which text tool would answer each question?', how:'A word meaning: the word box. Which part to read: a heading. What the picture shows: the caption.'},
    {type:'sort', q:'Caption, or heading?', bins:['A caption','Heading or title'], cards:[['🐧 Chicks stay warm.',0],['🦫 Beavers eat bark.',0],['Made for Sand',1],['A Safe Home',1],['Penguins',1]], say:'Mistake Detective: caption, or heading?', how:'The mistake is calling a heading the caption. A caption is a sentence next to a picture. A heading is a short name for a part.'},
    {type:'listen', q:'Challenge: Dovid\'s Pesach book', hear:'Dovid reads a book about Pesach. Heading: Getting Ready. He sees a dark, thick word: chametz. Where can he look to learn what it means?', o:['word box','title','cover'], a:'word box', say:'Challenge! Where should Dovid look?', how:'A bold word is explained nearby, in the word box.'}] };

B['READ.COMP.L03.03']={ band:'B23', pic:'🐦', today:'Answer how and why questions from a page', why:'How asks the steps or the way. Why asks the reason. Knowing which to look for helps you find the answer.',
  ready:[{q:'Which one is a heading?', o:['Why Plants Need Sun','A plant needs sun.','sun'], a:'Why Plants Need Sun'},{q:'A caption tells about...', o:['a picture','the last page','a word'], a:'a picture'}],
  bridge:'READ.COMP.L03.02', bridgeName:'Text Tools',
  watch:{ q:'How Beavers Build', m:{type:'scene',e:'🦫',t:'How Beavers Build. First a beaver cuts sticks. Then it packs them with mud. It swims with its flat tail. Beavers need deep water, so they build a dam. Deep water is good because it keeps them safe.'}, steps:[
    {t:'My question: how does a beaver build? How wants steps. I look for first and then: first it cuts sticks, then it packs them with mud.'},
    {t:'How can also ask the way: how does it swim? With its flat tail. Birds fly in a big group shaped like a V: that is HOW they fly.'},
    {t:'Next question: why build a dam? Why wants a reason. I look for so or because.'},
    {t:'I notice so: Beavers need deep water, so they build a dam. The reason comes BEFORE so. With because, it comes AFTER: because it keeps them safe.'},
    {t:'Sometimes the reason is in the part before. A part called Cold Is Coming tells why. The next part starts with So.'}], a:'How: first, then, or the way. Why: the reason before so, after because.' },
  oops:{ q:'Why do birds fly south?', wrong:'They fly in a V.', right:'It is warm there.', why:'Flying in a V tells HOW they fly. A why question wants a reason.' },
  ways:['think-aloud','how hand and why hand','sort questions','order steps from a text','Mistake Detective'], done:'You can answer how and why questions from a page!',
  board:{ one:'How wants steps or the way (first, then). Why wants a reason: before so, after because.', activity:'Call out questions; boys raise the how hand or the why hand, then hunt for the signal word in a short page.', mistakes:['Answering a why question with how','Looking after so for the reason (it comes before)','Not reading the heading that matches the question'] },
  do:[
    {type:'sort', bins:['How? Steps, way','Why? A reason'], cards:[['How do seeds grow?',0],['Why fly south?',1],['How do they fly?',0],['Why come back?',1]], say:'Does this question want how, or a reason?', how:'Look at the first word. How wants steps or the way. Why wants a reason.'},
    {type:'match', q:'It was cold, so Yossi ran in fast.', pairs:[['Why go in?','it was cold'],['What did he do?','ran in'],['How did he go?','fast']], say:'Match each question to its answer.', how:'With so, the reason comes before it: it was cold.'}],
  your:[
    {type:'tiles', w:['mix','let rise','braid','bake'], hear:'To bake challah, Shira and Mommy mix the dough. Then they let it rise. Then they braid it. Last, they bake it.', q:'Challah: the steps', say:'Listen. A how question! Put the steps in order.', how:'Listen for first, then, last. The dough rises before they braid it.'},
    {type:'findall', q:'It got cold, so we went in. Then we ate.', grid:['It','got','cold','so','we','went','in','Then','we','ate'], find:['so','Then'], findSay:'signal word', say:'Tap the reason word and the step word.', how:'So: the reason is just before it. Then: the next step.'},
    {type:'match', q:'Bears sleep in winter because food is gone.', pairs:[['Why sleep?','food is gone'],['When?','in winter'],['What do they do?','sleep']], say:'Match each question to its answer.', how:'With because, the reason comes after it: food is gone.'},
    {type:'sort', q:'Why do bears sleep all winter?', bins:['Answers WHY','Answers HOW'], cards:[['food is gone',0],['it is very cold',0],['curl up in dens',1],['breathe slowly',1]], say:'Mistake Detective: does it answer why, or how?', how:'The mistake is answering a why question with how. Why wants a reason. Curling up in a den is how they sleep.'},
    {type:'listen', q:'Challenge: ducks in the fall', hear:'Cold Is Coming. In the fall, ducks cannot find bugs. The Long Trip. So the ducks fly to a warm pond. Why do the ducks fly away?', o:['no bugs','ponds','spring'], a:'no bugs', say:'Challenge! Find the reason in two parts.', how:'The reason comes before So, in the part before. Birds fly south because it is warm there, and food is hard to find up north. In the spring they come back because there is lots of food again.'}] };

B['READ.FLU.L03.01']={ band:'B23', pic:'🎙️', today:'Read smoothly, follow the marks, then tell what happened', why:'When you read smoothly, the story makes sense, and people love to listen to you.',
  ready:[{q:'Which mark ends an asking sentence?', o:['?','.',','], a:'?'},{q:'Ben has a red hat. What color is the hat?', o:['red','blue','green'], a:'red'}],
  bridge:'READ.FLU.L02.02',
  watch:{ q:'In the Garden', m:{type:'scene',e:'🎃',t:'In the spring, Zev put in corn seeds. Ben put in pumpkin seeds. "Look!" said Ben. "Are they growing?" asked Zev.'}, steps:[
    {t:'I read in scoops, not word by word: Zev put in / corn seeds. That sounds like talking.'},
    {t:'I notice a comma after spring. So I rest a tiny bit, then keep going.'},
    {t:'I notice a period. So I stop and drop my voice a little. I notice an exclamation mark after Look! So I say it excited.'},
    {t:'I notice a question mark. So my voice goes up: Are they growing? That line sounds asking.'},
    {t:'Then I ask myself: what happened? Zev planted corn seeds. Ben planted pumpkin seeds.'}], a:'Scoop, follow the marks, then ask: what happened?' },
  oops:{ q:'Ben put in corn seeds.', wrong:'Ben. Put. In. Corn. Seeds.', right:'Ben put in / corn seeds.', why:'Robot reading stops after every word. Read words that go together in one scoop.' },
  ways:['think-aloud','match marks to voices','good and broken scoops','order what happened','Mistake Detective'], done:'You can read smoothly, with feeling, and tell what happened!',
  board:{ one:'Read in scoops, follow the marks, then ask what happened.', activity:'Echo reading: the teacher reads a line in scoops, the boys read it back the same way, then retell it.', mistakes:['Reading word by word like a robot','Not stopping at a period or resting at a comma','Reading fast but not knowing what happened'] },
  do:[
    {type:'match', pairs:[['?','asking'],['!','excited'],['.','stop'],[',','short rest']], say:'Match each mark to how your voice sounds.', how:'Question mark: voice goes up. Exclamation: excited. Period: stop. Comma: short rest.'},
    {type:'sort', bins:['Good scoop','Broken scoop'], cards:[['by the fence',0],['in the spring',0],['sat by the',1],['spring, they dug',1]], say:'Is it a good scoop, or a broken one?', how:'A good scoop is words that go together. Do not stop in the middle of an idea.'}],
  your:[
    {type:'listen', q:'"Is it ripe yet?" asked Ben.', hear:'Is it ripe yet?', o:['asking','happy','calm'], a:'asking', say:'Listen. How should this line sound?', how:'It ends with a question mark. Your voice goes up: asking. "What will we do with it?" sounds asking too.'},
    {type:'sort', bins:['Smooth scoop','Broken scoop'], cards:[['a big pumpkin /',0],['a big / pumpkin',1],['by the fence /',0],['by the / fence',1]], say:'Mistake Detective: where did the reader stop?', how:'A broken scoop stops in the middle of an idea. Stop after the words that go together.'},
    {type:'tiles', w:['dug rows','planted','shoots came','corn grew'], hear:'In the spring, Ben and Zev dug rows in the dirt. They put in seeds. Soon, little green shoots came up. By the end of the summer, the corn stood tall.', q:'What happened?', say:'Listen and follow along. Put what happened in order.', how:'Listen in scoops. First they dug, then planted, then shoots came, then the corn grew tall.'},
    {type:'sort', bins:['Voice up','Excited','Stop'], cards:[['Is it ripe?',0],['Can I help?',0],['Look at it!',1],['Wow, so tall!',1],['It is big.',2]], say:'How does your voice sound on this line?', how:'Look at the mark at the end. ? voice up. ! excited. Period: stop.'},
    {type:'listen', q:'Challenge: read the whole story', hear:'Ben and Zev had a garden. Zev put in corn seeds. Ben put in pumpkin seeds. Each day they gave the seeds a drink from the hose. By the end of the summer, a big pumpkin sat by the fence. What will we do with it? asked Zev. We will bring it to the shul for Sukkos! said Ben. Where did the big pumpkin sit?', o:['the fence','the shul','the hose'], a:'the fence', say:'Challenge! Read along, then answer.', how:'Read it again, smoother each time. A big pumpkin sat by the fence. They will bring it to the shul for Sukkos.'}] };

B['READ.VOC.L03.01']={ band:'B23', pic:'🔁', today:'Snap on un or re to change a word', why:'Learn two tiny parts and you can read hundreds of new words.',
  ready:[{q:'Clap it: how many beats in "unpack"?', o:['2','1','3'], a:'2'},{q:'Which word means the same as glad?', o:['happy','sad','mad'], a:'happy'}],
  bridge:'READ.VOC.L02.01',
  watch:{ q:'unhappy, untie, refill', m:{type:'tiles',w:['un','happy']}, steps:[
    {t:'I see a new word: unhappy. I cover un with my finger. I read: happy. A prefix is a word part at the start.', m:{type:'tiles',w:['un','happy'],hi:[1]}},
    {t:'I snap un back on. Un means not. So unhappy means not happy. Unkind means not kind.', m:{type:'tiles',w:['un','happy'],hi:[0]}},
    {t:'With an action word, un means undo: untie means undo the tie. Unpack means take things out.', m:{type:'tiles',w:['un','tie'],hi:[0]}},
    {t:'Re means again. Refill means fill again. In a sentence: Mordy had to retie his shoe. Retie means tie again.', m:{type:'tiles',w:['re','fill'],hi:[0]}},
    {t:'I check: is a real word left? Uncle: cover un, and cle is not a word. So uncle has no prefix.'}], a:'un = not, or undo. re = again.' },
  oops:{ q:'What does redo mean?', wrong:'not do', right:'do again', why:'Re means again. Un means not or undo. Do not mix them up!' },
  ways:['think-aloud','build words with tiles','match word and meaning','sort by prefix','Mistake Detective'], done:'You can use un and re to read new words!',
  board:{ one:'Cover the prefix, read the word, snap it back: un means not or undo, re means again.', activity:'Prefix cards: boys hold un or re in front of base-word cards and say the new meaning.', mistakes:['Mixing up un and re','Thinking every word that starts with un has a prefix (uncle)','Reading the prefix but not the base word'] },
  do:[
    {type:'match', pairs:[['unhappy','not happy'],['untie','undo the tie'],['redo','do again']], say:'Match each word to what it means.', how:'Cover the prefix and read the word. Un means not or undo. Re means again.'},
    {type:'tiles', w:['un','safe'], extra:['re'], q:'Build the word that means not safe.', say:'Build the word that means not safe.', how:'Not is un. Put un first, then safe: unsafe.'}],
  your:[
    {type:'listen', hear:'reread', o:['read again','not read','read fast'], a:'read again', say:'Listen to the word. Tap what it means.', how:'Cover re: read. Re means again. Reread means read again.'},
    {type:'tiles', w:['re','paint'], extra:['un','ing'], q:'Build the word that means paint again.', say:'Build the word that means paint again.', how:'Again is re. Re goes first, then paint: repaint.'},
    {type:'sort', bins:['un: not, undo','re: again'], cards:[['unkind',0],['redo',1],['unfair',0],['reread',1],['untie',0],['retie',1]], say:'Mistake Detective: un, or re?', how:'The mistake is mixing them up. Redo means do again. Unfair means not fair.'},
    {type:'findall', grid:['redo','red','undo','unit','real','up'], find:['redo','undo'], findSay:'word with a prefix', say:'Tap every word that has a prefix.', how:'Cover un or re. Is a real word left? Unit and real have no prefix.'},
    {type:'match', q:'Challenge: Mordy\'s trip home', pairs:[['relocked door','locked again'],['unlocked door','not locked'],['repacked bag','packed again'],['unpacked bag','took it all out']], say:'Challenge! The prefix decides. Match them.', how:'The base word is the same. Look at the prefix: re means again, un means not or undo.'}] };
