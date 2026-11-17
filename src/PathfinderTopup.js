/* PathfinderTopup.js (v290, rabbikhaver cloud builder 2): 4cc@ General Pathfinder top-ups for the PF-BANK1 thin spots.
   PF-B15 Reading L3 +9 and L4 +16 multiple-choice items on 7 new passages, and PF-B16 Math L8 +8 typed items (from gen_general.py, HARD 0).
   NOT included yet: 14 "tap the sentence" items (the engine has no tap-a-sentence format yet): PF.R.L03.B15.A.Q3, PF.R.L03.B15.A.Q4, PF.R.L03.B15.B.Q3, PF.R.L03.B15.B.Q4, PF.R.L03.B15.C.Q3, PF.R.L03.B15.C.Q4, PF.R.L04.B15.A.Q2, PF.R.L04.B15.A.Q3, PF.R.L04.B15.B.Q2, PF.R.L04.B15.B.Q3, PF.R.L04.B15.C.Q2, PF.R.L04.B15.C.Q3, PF.R.L04.B15.D.Q2, PF.R.L04.B15.D.Q3.
   All Draft: only TEST boys get them (pfItemOk_). Reviewers mark them Approved later. Applied once, inside pfIx_(). */
var PF_TOPUP = {"codes": {"WRONG-FEATURE": "picked a detail from the wrong part of the page", "NOT-IN-TEXT": "the page does not say this", "OFF-TOPIC": "not what the page is about", "WRONG-DETAIL": "a real detail, but not the one asked", "OPPOSITE": "says the opposite of the text", "WRONG-PART": "took the answer from the wrong part of the text", "TRUE-BUT-NOT": "true, but does not answer the question", "WRONG-NUMBER": "read the wrong number from the text", "CLOSE-DETAIL": "a nearby detail, not the one asked", "TOO-NARROW": "only one small part, not the main idea", "TOO-BROAD": "bigger than what the page is about", "SIGN-RULE": "multiplied right but used the wrong sign", "ADDED": "added instead of the operation asked", "ADD-ACROSS": "added tops and bottoms across", "SIGN": "lost the minus sign", "WRONG-DIRECTION": "moved the wrong way on the number line", "DIAMETER-AS-RADIUS": "used the diameter as the radius", "RADIUS-ONLY": "stopped at the radius step", "SUPPLEMENTARY": "used 180 instead of 90 (or the reverse)", "COUNT-COLORS": "counted colors instead of outcomes", "PART-OF-PART": "took a part of a part", "ADD-THE-DIFFERENCE": "added the difference instead of scaling", "NO-UNIT-RATE": "skipped the unit rate", "WRONG-INVERSE": "undid the steps in the wrong order", "STOP-EARLY": "stopped one step early"},
"passages": {
"PF.R.L03.B15.A": {
"id": "PF.R.L03.B15.A",
"title": "Busy Honey Bees",
"text": "A Home of Wax\nA honey bee lives in a hive with thousands of other bees. The bees build the hive out of wax. Inside, the wax makes many small rooms with six sides.\nFrom Flower to Honey\nA bee flies from flower to flower and drinks a sweet juice called nectar. It carries the nectar back to the hive. There the bees fan it with their wings until it turns thick and sweet. That is honey!",
"kind": "informational"
},
"PF.R.L03.B15.B": {
"id": "PF.R.L03.B15.B",
"title": "The Big Snow",
"text": "A Surprise in the Morning\nWhen Yaakov woke up, the street was white. Snow covered the cars, the trees and the steps. His little brother Ezra ran to the window and shouted, \"School is closed!\"\nHelping Out\nTheir father handed each boy a shovel. Together they cleared the steps and the path to the door. Then they cleared the path for their neighbor, Mr. Peretz, who is too old to shovel.\nA Warm Ending\nMr. Peretz waved from his window and smiled. Later, the boys came inside with cold hands and cold toes. Their father made hot cocoa, and the boys drank it by the window.",
"kind": "literary"
},
"PF.R.L03.B15.C": {
"id": "PF.R.L03.B15.C",
"title": "The Camel",
"text": "Made for the Desert\nA camel can walk for days in the hot, dry desert. Its wide, soft feet do not sink in the sand. Long eyelashes keep the blowing sand out of its eyes.\nFood and Water\nA camel can go a long time without drinking. When it finds water, it can drink a whole bathtub full in a few minutes! The hump on its back holds fat, not water. The camel uses the fat when food is hard to find.",
"kind": "informational"
},
"PF.R.L04.B15.A": {
"id": "PF.R.L04.B15.A",
"title": "Bridges",
"text": "Why We Need Bridges\nA bridge lets people cross over a river, a road or a deep valley. Without bridges, many trips would take hours longer, because people would have to go all the way around.\nKinds of Bridges\nA beam bridge is the simplest kind. It is a strong, flat beam that rests on posts at each end. An arch bridge has a curved shape underneath, and the curve pushes the weight out to the sides. A suspension bridge hangs from thick steel cables. The cables run over tall towers and are tied down at both ends.\nTesting a Bridge\nBefore a new bridge opens, engineers test it carefully. They drive heavy trucks across it and measure how much it bends. A bridge is allowed to bend a little, but it must never crack.",
"kind": "informational"
},
"PF.R.L04.B15.B": {
"id": "PF.R.L04.B15.B",
"title": "The Keeper of the Light",
"text": "A Light by the Sea\nLong ago, before ships had computers, sailors needed lighthouses to stay safe at night. A lighthouse is a tall tower with a bright lamp at the top. The light warned ships to stay away from the rocks near the shore.\nShmuel's Job\nShmuel Abrams was a lighthouse keeper for forty years. Every evening he climbed one hundred and twelve steps to the top. He cleaned the glass, filled the lamp with oil and trimmed the wick so the flame burned brightly.\nThe Night of the Storm\nOne winter night a terrible storm hit the coast. The wind was so strong that it broke a window in the tower. Shmuel covered the window with a wooden board and kept the lamp burning until morning. When the sun came up, he saw a fishing boat safe in the harbor. The captain later came to thank him.",
"kind": "literary"
},
"PF.R.L04.B15.C": {
"id": "PF.R.L04.B15.C",
"title": "From Tree to Syrup",
"text": "Sweet Sap\nIn late winter, maple trees begin to wake up. Warm days and freezing nights make sweet sap move up and down inside the trunk. Farmers drill a small hole in each tree and push in a tap. The sap drips out into a bucket or flows through plastic tubes.\nBoiling It Down\nFresh sap is clear and thin, almost like water. To make syrup, farmers boil the sap in a large, flat pan. As the water steams away, the sap gets thicker, darker and sweeter. It takes about forty buckets of sap to make just one bucket of syrup!\nTaking Care of the Trees\nA good farmer never takes too much sap. The small hole heals by the next summer, and the same tree can give sap for many years.",
"kind": "informational"
},
"PF.R.L04.B15.D": {
"id": "PF.R.L04.B15.D",
"title": "The Bean Experiment",
"text": "A Question\nAvi wanted to know if beans need light to grow. He asked his teacher, Rabbi Toledano, how he could find out. \"Try an experiment,\" the rabbi said. \"Change only one thing and watch what happens.\"\nThe Plan\nAvi planted six beans in two cups of soil. He put one cup on a sunny windowsill and the other inside a dark closet. He gave both cups the same amount of water every morning.\nWhat Happened\nAfter a week, the beans in the sunny cup grew strong, green stems. The beans in the closet grew tall but pale and weak. Avi wrote everything in his notebook and drew a chart. At the science fair, his friend Yehuda said, \"Now I know why my mother keeps her plants by the window!\"",
"kind": "literary"
}
},
"items": [
{
"id": "PF.R.L03.B15.A.Q1",
"skill": "READ.COMP.L03.01",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "What is this page mostly about?",
"say": "What is this page mostly about?",
"ans": "how bees live and make honey",
"wrong": [
[
"bees flying from one flower to the next flower",
"TOO-NARROW"
],
[
"insects that fly",
"TOO-BROAD"
],
[
"the six sides of a wax room",
"TOO-NARROW"
]
],
"b": -2.3,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.A",
"rw": 31,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.A.Q2",
"skill": "READ.COMP.L03.02",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "Which part tells you how bees make honey?",
"say": "Which part tells you how bees make honey?",
"ans": "the heading \"From Flower to Honey\"",
"wrong": [
[
"the heading \"A Home of Wax\"",
"WRONG-FEATURE"
],
[
"the title \"Busy Honey Bees\"",
"WRONG-FEATURE"
],
[
"the picture caption",
"WRONG-FEATURE"
]
],
"b": -2.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.A",
"rw": 28,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.A.Q5",
"skill": "READ.COMP.L03.03",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "How does the nectar turn into thick honey?",
"say": "How does the nectar turn into thick honey?",
"ans": "The bees fan it with their wings.",
"wrong": [
[
"The sun dries it on the flower.",
"NOT-IN-TEXT"
],
[
"The bees mix it with water from a pond.",
"NOT-IN-TEXT"
],
[
"The bees keep it in the cold all winter.",
"NOT-IN-TEXT"
]
],
"b": -2.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.A",
"rw": 40,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.B.Q1",
"skill": "READ.COMP.L03.01",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "What is this story mostly about?",
"say": "What is this story mostly about?",
"ans": "two brothers helping on a snowy day",
"wrong": [
[
"why school was closed that morning",
"TOO-NARROW"
],
[
"Mr. Peretz waving from his window",
"TOO-NARROW"
],
[
"different kinds of winter weather around the world",
"TOO-BROAD"
]
],
"b": -2.3,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.B",
"rw": 33,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.B.Q2",
"skill": "READ.COMP.L03.02",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "Which part tells how the boys helped?",
"say": "Which part tells how the boys helped?",
"ans": "the heading \"Helping Out\"",
"wrong": [
[
"the heading \"A Surprise in the Morning\"",
"WRONG-FEATURE"
],
[
"the heading \"A Warm Ending\"",
"WRONG-FEATURE"
],
[
"the picture caption",
"WRONG-FEATURE"
]
],
"b": -2.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.B",
"rw": 26,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.B.Q5",
"skill": "READ.COMP.L03.03",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "What did their father make when the boys came inside?",
"say": "What did their father make when the boys came inside?",
"ans": "hot cocoa",
"wrong": [
[
"a snowman for the yard",
"NOT-IN-TEXT"
],
[
"soup and warm bread",
"NOT-IN-TEXT"
],
[
"a fire in the fireplace",
"NOT-IN-TEXT"
]
],
"b": -2.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.B",
"rw": 26,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.C.Q1",
"skill": "READ.COMP.L03.01",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "What is this page mostly about?",
"say": "What is this page mostly about?",
"ans": "how a camel lives in the desert",
"wrong": [
[
"why a camel has a hump on its back",
"TOO-NARROW"
],
[
"animals that live in hot places",
"TOO-BROAD"
],
[
"the sand of the desert",
"OFF-TOPIC"
]
],
"b": -2.3,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.C",
"rw": 33,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.C.Q2",
"skill": "READ.COMP.L03.02",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "Where would you look to learn what is inside the hump?",
"say": "Where would you look to learn what is inside the hump?",
"ans": "the heading \"Food and Water\"",
"wrong": [
[
"the heading \"Made for the Desert\"",
"WRONG-FEATURE"
],
[
"the title \"The Camel\"",
"WRONG-FEATURE"
],
[
"the picture caption",
"WRONG-FEATURE"
]
],
"b": -2.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.C",
"rw": 29,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L03.B15.C.Q5",
"skill": "READ.COMP.L03.03",
"subject": "READ",
"strand": "INF",
"level": 3,
"ccss": "",
"fmt": "CHOICE",
"stem": "What keeps sand out of a camel's eyes?",
"say": "What keeps sand out of a camel's eyes?",
"ans": "its long eyelashes",
"wrong": [
[
"its wide, soft feet",
"WRONG-DETAIL"
],
[
"the fat in its hump",
"WRONG-DETAIL"
],
[
"the water it drinks",
"WRONG-DETAIL"
]
],
"b": -2.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L03.B15.C",
"rw": 24,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.A.Q1",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What is the simplest kind of bridge?",
"say": "What is the simplest kind of bridge?",
"ans": "a beam bridge",
"wrong": [
[
"an arch bridge",
"WRONG-DETAIL"
],
[
"a suspension bridge",
"WRONG-DETAIL"
],
[
"a bridge with steel cables",
"WRONG-DETAIL"
]
],
"b": -1.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.A",
"rw": 21,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.A.Q4",
"skill": "READ.VOC.L04.01",
"subject": "READ",
"strand": "VOC",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "\"An arch bridge has a curved shape underneath.\" What does curved mean?",
"say": "\"An arch bridge has a curved shape underneath.\" What does curved mean?",
"ans": "bent like part of a circle",
"wrong": [
[
"very long and very flat",
"OPPOSITE"
],
[
"made of thick steel cables",
"WRONG-PART"
],
[
"full of many small holes",
"NOT-IN-TEXT"
]
],
"b": -0.9999999999999999,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.A",
"rw": 33,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.A.Q5",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "Why would many trips take longer without bridges?",
"say": "Why would many trips take longer without bridges?",
"ans": "People would have to go all the way around.",
"wrong": [
[
"Trucks would have to drive very slowly on bridges.",
"NOT-IN-TEXT"
],
[
"Engineers would have to test every road first.",
"NOT-IN-TEXT"
],
[
"Rivers would get much deeper every single year.",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.A",
"rw": 42,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.A.Q6",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What must a bridge never do?",
"say": "What must a bridge never do?",
"ans": "crack",
"wrong": [
[
"bend even a little",
"TRUE-BUT-NOT"
],
[
"carry heavy trucks",
"NOT-IN-TEXT"
],
[
"rest on posts",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.A",
"rw": 17,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.B.Q1",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What did the light warn ships about?",
"say": "What did the light warn ships about?",
"ans": "the rocks near the shore",
"wrong": [
[
"the storm coming in from the sea",
"NOT-IN-TEXT"
],
[
"the fishing boats in the harbor",
"NOT-IN-TEXT"
],
[
"the time to sail back home",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.B",
"rw": 31,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.B.Q4",
"skill": "READ.VOC.L04.01",
"subject": "READ",
"strand": "VOC",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "\"He trimmed the wick so the flame burned brightly.\" What does trimmed mean here?",
"say": "\"He trimmed the wick so the flame burned brightly.\" What does trimmed mean here?",
"ans": "cut to make neat",
"wrong": [
[
"lit with a match",
"NOT-IN-TEXT"
],
[
"washed with water",
"NOT-IN-TEXT"
],
[
"made much longer",
"OPPOSITE"
]
],
"b": -0.9999999999999999,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.B",
"rw": 28,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.B.Q5",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What did Shmuel do after the window broke?",
"say": "What did Shmuel do after the window broke?",
"ans": "He covered it with a board and kept the lamp burning.",
"wrong": [
[
"He ran down all the steps and went home to bed.",
"NOT-IN-TEXT"
],
[
"He called the captain of the fishing boat for help.",
"NOT-IN-TEXT"
],
[
"He turned off the lamp until the storm was over.",
"OPPOSITE"
]
],
"b": -1.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.B",
"rw": 50,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.B.Q6",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "How long was Shmuel a lighthouse keeper?",
"say": "How long was Shmuel a lighthouse keeper?",
"ans": "forty years",
"wrong": [
[
"twelve years",
"WRONG-NUMBER"
],
[
"one winter",
"NOT-IN-TEXT"
],
[
"one hundred years",
"WRONG-NUMBER"
]
],
"b": -1.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.B",
"rw": 16,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.C.Q1",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "When does the sap start to move?",
"say": "When does the sap start to move?",
"ans": "in late winter",
"wrong": [
[
"in the middle of the summer",
"NOT-IN-TEXT"
],
[
"in the early part of the fall",
"NOT-IN-TEXT"
],
[
"at the very end of spring",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.C",
"rw": 29,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.C.Q4",
"skill": "READ.VOC.L04.01",
"subject": "READ",
"strand": "VOC",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "\"The small hole heals by the next summer.\" What does heals mean?",
"say": "\"The small hole heals by the next summer.\" What does heals mean?",
"ans": "gets better and closes",
"wrong": [
[
"gets bigger and bigger",
"OPPOSITE"
],
[
"fills up with sweet sap",
"NOT-IN-TEXT"
],
[
"turns very dark brown",
"NOT-IN-TEXT"
]
],
"b": -0.9999999999999999,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.C",
"rw": 29,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.C.Q5",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What happens to the sap as the water steams away?",
"say": "What happens to the sap as the water steams away?",
"ans": "It gets thicker, darker and sweeter.",
"wrong": [
[
"It gets thinner, lighter and clearer.",
"OPPOSITE"
],
[
"It turns back into water from the tree.",
"NOT-IN-TEXT"
],
[
"It freezes into small pieces of ice.",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.C",
"rw": 37,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.C.Q6",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "Why does a good farmer never take too much sap?",
"say": "Why does a good farmer never take too much sap?",
"ans": "so the same tree can give sap for many years",
"wrong": [
[
"so the buckets do not get too heavy to carry",
"NOT-IN-TEXT"
],
[
"so the syrup does not get too sweet to eat",
"NOT-IN-TEXT"
],
[
"so the plastic tubes do not break in winter",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "A",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.C",
"rw": 49,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.D.Q1",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What did Avi want to find out?",
"say": "What did Avi want to find out?",
"ans": "if beans need light to grow",
"wrong": [
[
"if beans need water to grow",
"CLOSE-DETAIL"
],
[
"how tall beans can grow in one week",
"NOT-IN-TEXT"
],
[
"which kind of soil is best for beans",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.D",
"rw": 35,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.D.Q4",
"skill": "READ.VOC.L04.01",
"subject": "READ",
"strand": "VOC",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "\"The beans in the closet grew tall but pale and weak.\" What does pale mean?",
"say": "\"The beans in the closet grew tall but pale and weak.\" What does pale mean?",
"ans": "light in color",
"wrong": [
[
"very strong",
"OPPOSITE"
],
[
"very short",
"NOT-IN-TEXT"
],
[
"full of water",
"NOT-IN-TEXT"
]
],
"b": -0.9999999999999999,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.D",
"rw": 25,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.D.Q5",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What did Avi do the same for both cups?",
"say": "What did Avi do the same for both cups?",
"ans": "gave them the same amount of water",
"wrong": [
[
"put them in the same sunny place",
"NOT-IN-TEXT"
],
[
"kept them both in the dark closet",
"NOT-IN-TEXT"
],
[
"gave them both lots of sunlight",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.D",
"rw": 36,
"src": "PF-B15 4cc@"
},
{
"id": "PF.R.L04.B15.D.Q6",
"skill": "READ.COMP.L04.01",
"subject": "READ",
"strand": "INF",
"level": 4,
"ccss": "",
"fmt": "CHOICE",
"stem": "What did the rabbi tell Avi to do?",
"say": "What did the rabbi tell Avi to do?",
"ans": "Change only one thing and watch what happens.",
"wrong": [
[
"Plant many more beans in one big pot.",
"NOT-IN-TEXT"
],
[
"Ask all of his friends what they think.",
"NOT-IN-TEXT"
],
[
"Read a long book about beans first.",
"NOT-IN-TEXT"
]
],
"b": -1.15,
"form": "B",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"passage": "PF.R.L04.B15.D",
"rw": 39,
"src": "PF-B15 4cc@"
},
{
"id": "PF.M.MATH.NUM.L08.02.F",
"skill": "MATH.NUM.L08.02",
"subject": "MATH",
"strand": "NPV",
"level": 8,
"ccss": "7.NS.A.2",
"fmt": "TYPE",
"stem": "(−8) × 5 = ?",
"say": null,
"ans": "-40",
"accept": [],
"wrong": [
[
"40",
"SIGN-RULE"
],
[
"-3",
"ADDED"
]
],
"b": 2.66,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 5,
"src": "PF-B16 4cc@"
},
{
"id": "PF.M.MATH.NUM.L08.01.F",
"skill": "MATH.NUM.L08.01",
"subject": "MATH",
"strand": "NPV",
"level": 8,
"ccss": "7.NS.A.1",
"fmt": "TYPE",
"stem": "−5/6 + 1/3 = ?",
"say": null,
"ans": "-1/2",
"accept": [],
"wrong": [
[
"-4/9",
"ADD-ACROSS"
],
[
"1/2",
"SIGN"
]
],
"b": 2.72,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 5,
"src": "PF-B16 4cc@"
},
{
"id": "PF.M.MATH.NUM.L08.05.F",
"skill": "MATH.NUM.L08.05",
"subject": "MATH",
"strand": "NPV",
"level": 8,
"ccss": "7.NS.A.3",
"fmt": "TYPE",
"stem": "A diver is at −12.5 meters. He swims up 4.75 meters. Where is he now?",
"say": null,
"ans": "-7.75",
"accept": [],
"wrong": [
[
"-17.25",
"WRONG-DIRECTION"
],
[
"7.75",
"SIGN"
]
],
"b": 2.88,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 15,
"src": "PF-B16 4cc@"
},
{
"id": "PF.M.MATH.GEO.L08.02.F",
"skill": "MATH.GEO.L08.02",
"subject": "MATH",
"strand": "GEO",
"level": 8,
"ccss": "7.G.B.4",
"fmt": "TYPE",
"stem": "A circle has a diameter of 8 cm. What is its circumference in cm? (Use 3.14 for π.)",
"say": null,
"ans": "25.12",
"accept": [],
"wrong": [
[
"50.24",
"DIAMETER-AS-RADIUS"
],
[
"12.56",
"RADIUS-ONLY"
]
],
"b": 3.22,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 18,
"src": "PF-B16 4cc@"
},
{
"id": "PF.M.MATH.GEO.L08.03.F",
"skill": "MATH.GEO.L08.03",
"subject": "MATH",
"strand": "GEO",
"level": 8,
"ccss": "7.G.B.5",
"fmt": "TYPE",
"stem": "Two angles are complementary. One angle is 38°. How many degrees is the other?",
"say": null,
"ans": "52",
"accept": [],
"wrong": [
[
"142",
"SUPPLEMENTARY"
],
[
"128",
"ADDED"
]
],
"b": 3.28,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 14,
"src": "PF-B16 4cc@"
},
{
"id": "PF.M.MATH.STAT.L08.02.F",
"skill": "MATH.STAT.L08.02",
"subject": "MATH",
"strand": "DATA",
"level": 8,
"ccss": "7.SP.C.8",
"fmt": "TYPE",
"stem": "A spinner has 8 equal parts: 3 red, 1 blue and 4 yellow. What is the probability of yellow?",
"say": null,
"ans": "1/2",
"accept": [
"4/8"
],
"wrong": [
[
"1/4",
"COUNT-COLORS"
],
[
"1",
"PART-OF-PART"
]
],
"b": 3.35,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 19,
"src": "PF-B16 4cc@"
},
{
"id": "PF.M.MATH.ALG.L08.01.F",
"skill": "MATH.ALG.L08.01",
"subject": "MATH",
"strand": "RA",
"level": 8,
"ccss": "7.RP.A.2",
"fmt": "TYPE",
"stem": "5 notebooks cost $8.75. How many dollars do 12 notebooks cost?",
"say": null,
"ans": "21",
"accept": [],
"wrong": [
[
"15.75",
"ADD-THE-DIFFERENCE"
],
[
"105",
"NO-UNIT-RATE"
]
],
"b": 2.93,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 11,
"src": "PF-B16 4cc@"
},
{
"id": "PF.M.MATH.ALG.L08.04.F",
"skill": "MATH.ALG.L08.04",
"subject": "MATH",
"strand": "RA",
"level": 8,
"ccss": "7.EE.B.4",
"fmt": "TYPE",
"stem": "4x − 7 = 21. What is x?",
"say": null,
"ans": "7",
"accept": [],
"wrong": [
[
"7/2",
"WRONG-INVERSE"
],
[
"28",
"STOP-EARLY"
]
],
"b": 3.11,
"form": "F",
"status": "Draft",
"show": "",
"cmode": "text",
"screenNote": "",
"audioOnly": false,
"rw": 8,
"src": "PF-B16 4cc@"
}
]
};
function pfTopupApply_() {
  if (PF_TOPUP.applied || typeof PF_BANK === 'undefined') return;
  var have = {}; PF_BANK.items.forEach(function (it) { have[it.id] = 1; });
  PF_BANK.codes = PF_BANK.codes || {}; Object.keys(PF_TOPUP.codes || {}).forEach(function (k) { if (!PF_BANK.codes[k]) PF_BANK.codes[k] = PF_TOPUP.codes[k]; });
  Object.keys(PF_TOPUP.passages).forEach(function (k) { if (!PF_BANK.passages[k]) PF_BANK.passages[k] = PF_TOPUP.passages[k]; });
  PF_TOPUP.items.forEach(function (it) { if (!have[it.id]) PF_BANK.items.push(it); });
  PF_TOPUP.applied = true;
}
