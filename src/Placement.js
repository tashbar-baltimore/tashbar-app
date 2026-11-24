/* Tashbar placement (TL-037, 2026-11-08, by CLAUDE). Anyone may edit this file: log what you change in HQ.
   Every boy has his OWN lineup in every subject. Groups are an optional bulk tool on top: place a whole group in one click.
   Saved straight into the school database, tabs PL_Place, PL_Groups, PL_Checks.
   Staff page: app link + ?pl=1      A boy's math placement check: app link + ?pl=1&check=1
   Reading check: ?pl=1&check=1&s=READ    Social Studies check (Levels 1-13, saved under key SOC): ?pl=1&check=1&s=SS
   The student page (QuestPage) follows the Math placement skill by skill; Reading and Language Arts placements set his band. */
var PL = {
  VERSION: 'pl-1.0.0',
  TABS: {
    place: ['student_id', 'subject', 'level', 'start', 'updated_at', 'by'],
    groups: ['group_id', 'name', 'members_json', 'updated_at', 'by'],
    checks: ['at', 'student_id', 'subject', 'level', 'detail_json']
  },
  /* key, label, lowest level, highest level (Blueprint) */
  SUBJECTS: [
    ['MATH', 'Math', 1, 16], ['READ', 'Reading', 1, 15], ['LANG', 'Language Arts & Writing', 1, 9],
    ['SCI', 'Science', 1, 15], ['SOC', 'Social Studies', 1, 14], ['COMP', 'Computing, Life & Money', 1, 16],
    ['HEB', 'Limudei Kodesh · Lashon Hakodesh', 1, 13]   /* v197: part of Limudei Kodesh (HoS 2026-11-15); his HEB level sets where the Lashon Hakodesh track starts */, ['ELEC', 'Electives', 3, 16], ['VOC', 'Vocational & Trades', 9, 16]
  ],
  WORLDS: ['', 'Number Village', 'Tens Town', 'Hundred Hills', 'Times Tower', 'Million Mountain', 'Decimal Docks', 'Below-Zero Bay', 'Rational Ridge', 'Root Summit']
};

/* Math K-8, all 167 Blueprint rungs in teaching order (level by level; number & operations, then measurement, geometry, data, algebra). */
var MATH_K8 = [
["MATH.NUM.L01.01","Hat Match","Match objects one to one"],["MATH.NUM.L01.02","Count the Stars","Count sets to 10"],["MATH.NUM.L01.03","Number Names","Read and write numbers to 20"],["MATH.NUM.L01.04","Which Is More?","Compare numbers"],["MATH.NUM.L01.05","Count to 100","Count to 100 by ones and by tens"],["MATH.NUM.L01.06","Start Anywhere","Count forward from any number"],["MATH.OPS.L01.02","Put Together, Take Away","Add and take away within 5"],["MATH.OPS.L01.01","Add It Up","Add and subtract within 10"],["MATH.OPS.L01.03","Break It Apart","Break apart a number up to 10"],["MATH.OPS.L01.04","Ten Friends","Find the number that makes 10"],["MATH.PV.L01.01","Teen Tens","Teen numbers are ten and some ones"],
["MATH.GEO.L01.01","Shape Names","Name flat and solid shapes"],["MATH.GEO.L01.02","Where Is It?","Above, below, beside, in front of, behind"],["MATH.MEAS.L01.01","Longer or Shorter","Compare length and weight side by side"],["MATH.STAT.L01.01","Sort and Count","Sort objects into groups and count each group"],["MATH.GEO.L01.03","Build Shapes","Put small shapes together to make bigger ones"],
["MATH.NUM.L02.01","Count to 120","Count, read and write to 120"],["MATH.OPS.L02.03","Hop On, Hop Back","Count on and count back to add and subtract"],["MATH.OPS.L02.04","Doubles","Doubles and near doubles"],["MATH.OPS.L02.05","Make Ten","Make ten to add"],["MATH.OPS.L02.01","Twenty Trail","Add within 20"],["MATH.OPS.L02.06","Missing Piece","Fact families and missing numbers"],["MATH.OPS.L02.02","Block Quest","Subtract within 20"],["MATH.OPS.L02.07","Three in a Row","Add three numbers"],["MATH.OPS.L02.08","Balance Scale","True or false equations"],["MATH.OPS.L02.09","Story Problems","Word problems within 20"],["MATH.PV.L02.01","Tens and Ones","Tens and ones"],["MATH.PV.L02.02","Alligator Signs","Compare two-digit numbers"],["MATH.PV.L02.03","Jump Ten","10 more and 10 less"],["MATH.OPS.L02.10","Add Tens","Add a one-digit or a multiple of ten to a two-digit number"],["MATH.OPS.L02.11","Take Tens","Subtract multiples of 10"],
["MATH.MEAS.L02.01","Measure with Units","Measure length with same-size units"],["MATH.MEAS.L02.02","Clock to the Half Hour","Tell time in hours and half hours"],["MATH.MEAS.L02.03","Coins","Penny, nickel, dime and quarter"],["MATH.STAT.L02.01","Picture Graphs","Show data in three groups; how many more, how many fewer"],["MATH.GEO.L02.01","Shape Rules","Sides and corners make a shape, not color or size"],["MATH.GEO.L02.02","Halves and Quarters","Split circles and rectangles into equal shares"],
["MATH.OPS.L03.03","Fact Flash","Add and subtract within 20 from memory"],["MATH.NUM.L03.01","Odd or Even","Odd and even numbers"],["MATH.OPS.L03.04","Rows of Chairs","Arrays and repeated addition"],["MATH.PV.L03.02","Hundreds Blocks","Hundreds, tens and ones"],["MATH.NUM.L03.02","Skip Count","Skip count by 5s, 10s and 100s"],["MATH.PV.L03.03","Stretch It Out","Expanded form"],["MATH.PV.L03.01","Big Number Battle","Read, write and compare numbers to 1,000"],["MATH.PV.L03.04","Jump 100","Add or subtract 10 or 100 in your head"],["MATH.OPS.L03.01","Big Take-Away","Add and subtract within 100"],["MATH.OPS.L03.05","Column Climb","Add up to four two-digit numbers"],["MATH.OPS.L03.02","Regroup Ridge","Add and subtract within 1,000 with regrouping"],["MATH.OPS.L03.06","Two-Step Stories","Word problems, one and two steps"],
["MATH.MEAS.L03.01","Inches and Centimeters","Measure and estimate with a ruler"],["MATH.MEAS.L03.02","How Much Longer?","Compare lengths and solve length word problems"],["MATH.MEAS.L03.03","Time to 5 Minutes","Tell time to 5 minutes; a.m. and p.m."],["MATH.MEAS.L03.04","Count the Money","Total coins and bills; money word problems"],["MATH.STAT.L03.01","Bar Graphs and Line Plots","Draw and read bar graphs and line plots"],["MATH.GEO.L03.01","Sides and Corners","Sort shapes by sides and angles; rows and columns"],
["MATH.PV.L04.01","Round Up","Round to the nearest 10 or 100"],["MATH.OPS.L04.03","Good Guess","Estimate to check sums and differences"],["MATH.OPS.L04.04","Easy Times","Multiply by 0, 1, 2, 5 and 10"],["MATH.OPS.L04.05","Times Tower 3-4-6","Multiply by 3, 4 and 6"],["MATH.OPS.L04.06","Times Tower 7-8-9","Multiply by 7, 8 and 9"],["MATH.OPS.L04.01","Times Table Champion","Multiplication facts to 10 x 10"],["MATH.OPS.L04.07","Fair Shares","Division as sharing and as grouping"],["MATH.OPS.L04.02","Missing Factor","Division facts as missing factors"],["MATH.OPS.L04.08","Tens Times","Multiply by multiples of 10"],["MATH.OPS.L04.09","Four-Way Stories","Two-step word problems with all four operations"],["MATH.FRAC.L04.02","Fair Pieces","Fractions as equal parts of a whole"],["MATH.FRAC.L04.01","Fraction Trail","Unit fractions on a number line"],["MATH.FRAC.L04.03","Same Size Shares","Equivalent fractions with models"],["MATH.FRAC.L04.04","Whole Numbers in Disguise","Whole numbers as fractions"],["MATH.FRAC.L04.05","Fraction Face-Off","Compare fractions with the same top or bottom"],
["MATH.MEAS.L04.01","Area by Squares","Area as unit squares that cover a shape"],["MATH.MEAS.L04.02","Area by Multiplying","Length times width"],["MATH.MEAS.L04.03","Perimeter","The distance around a shape"],["MATH.MEAS.L04.04","How Long Did It Take?","Elapsed time to the minute"],["MATH.MEAS.L04.05","Liters and Grams","Liquid volume and mass"],["MATH.STAT.L04.01","Scaled Graphs","One picture stands for many; line plots in halves and quarters"],["MATH.GEO.L04.01","Four-Sided Shapes","Rhombus, rectangle and square"],["MATH.ALG.L04.01","Number Patterns","Patterns in addition and times tables"],
["MATH.PV.L05.01","Six-Digit Climb","Place value to one million"],["MATH.PV.L05.02","Round Anything","Round to any place"],["MATH.OPS.L05.03","Column Master","Add and subtract multi-digit numbers"],["MATH.NUM.L05.01","Factor Hunt","Factors, multiples, prime and composite"],["MATH.OPS.L05.04","Times As Many","Multiplicative comparison"],["MATH.OPS.L05.01","Multiply Mountain","Multiply multi-digit numbers"],["MATH.OPS.L05.02","Long Division Lab","Long division with remainders"],["MATH.OPS.L05.05","Leftover Logic","Multi-step word problems and remainders"],["MATH.FRAC.L05.01","Fraction Twins","Equivalent fractions and comparing fractions"],["MATH.FRAC.L05.02","Same-Bottom Sums","Add and subtract fractions with like denominators"],["MATH.FRAC.L05.03","Mixed Up","Mixed numbers and improper fractions"],["MATH.FRAC.L05.04","Tenths to Hundredths","Tenths and hundredths as fractions"],
["MATH.MEAS.L05.01","Convert Units","Feet to inches, kilograms to grams, hours to minutes"],["MATH.MEAS.L05.02","Area and Perimeter Formulas","Use the formulas to solve real problems"],["MATH.GEO.L05.01","Angles and Protractors","Measure and draw angles"],["MATH.GEO.L05.02","Lines and Symmetry","Parallel and perpendicular lines; symmetry"],["MATH.STAT.L05.01","Line Plots with Fractions","Line plots of fraction data"],["MATH.ALG.L05.01","Pattern from a Rule","Build a pattern from a rule"],
["MATH.FRAC.L06.02","Decimal Dollars","Decimals to hundredths; money as decimals"],["MATH.PV.L06.02","Decimal Duel","Read, write and compare decimals to thousandths"],["MATH.PV.L06.01","Power of Ten","Powers of 10 and place-value patterns"],["MATH.PV.L06.03","Decimal Rounding","Round decimals"],["MATH.OPS.L06.01","Big Multiplier","Standard multiplication algorithm"],["MATH.OPS.L06.02","Two-Digit Divisor","Divide by two-digit numbers"],["MATH.OPS.L06.03","Point to Point","Add and subtract decimals"],["MATH.OPS.L06.04","Decimal Times and Shares","Multiply and divide decimals"],["MATH.OPS.L06.05","Order Up","Order of operations with parentheses"],["MATH.FRAC.L06.01","Common Ground","Add and subtract fractions with unlike denominators"],["MATH.FRAC.L06.03","Groups of Fractions","Multiply a fraction by a whole number"],["MATH.FRAC.L06.04","Share the Challah","A fraction is a division"],["MATH.FRAC.L06.05","Fraction Times Fraction","Multiply fractions and mixed numbers"],["MATH.FRAC.L06.06","Split It Small","Divide unit fractions and whole numbers"],["MATH.FRAC.L06.07","Fraction Stories","Fraction word problems"],
["MATH.MEAS.L06.01","Volume","Volume by cubes, then length x width x height"],["MATH.MEAS.L06.02","Metric Conversions","Convert metric units with powers of ten"],["MATH.STAT.L06.01","Fair Shares from Data","Redistribute amounts so each gets the same"],["MATH.ALG.L06.01","Write the Expression","Simple expressions with parentheses"],["MATH.GEO.L06.01","The Coordinate Grid","Points in the first quadrant"],["MATH.ALG.L06.02","Two Patterns, One Graph","Pair two patterns and graph them"],["MATH.GEO.L06.02","Shape Families","Sort flat shapes by their properties"],
["MATH.OPS.L07.01","Division Pro","Fluent multi-digit division"],["MATH.OPS.L07.02","Decimal Pro","Fluent decimal operations"],["MATH.NUM.L07.02","GCF and LCM","Greatest common factor and least common multiple"],["MATH.FRAC.L07.01","Keep, Flip, Multiply","Divide fractions by fractions"],["MATH.NUM.L07.03","Below Zero","Negative numbers, opposites and absolute value"],["MATH.NUM.L07.04","Line Them Up","Compare and order positive and negative numbers"],["MATH.NUM.L07.05","Four Quadrants","The coordinate plane with negatives"],["MATH.NUM.L07.01","Integer Adventure","Add and subtract negative numbers"],
["MATH.ALG.L07.01","Ratios","Ratio language and ratio tables"],["MATH.ALG.L07.02","Unit Rates and Best Buys","Price per item, speed, best deal"],["MATH.ALG.L07.03","Percents","Percent of a number; the whole from a part"],["MATH.MEAS.L07.01","Convert with Ratios","Change units with ratio reasoning"],["MATH.ALG.L07.04","Letters for Numbers","Expressions with variables and exponents"],["MATH.ALG.L07.05","Same Value, New Look","Distribute and combine like terms"],["MATH.ALG.L07.06","One-Step Equations","Solve x + p = q and px = q"],["MATH.GEO.L07.01","Area of Triangles","Triangles and polygons by splitting"],["MATH.GEO.L07.02","Nets and Surface Area","Nets, surface area, volume with fractions"],["MATH.STAT.L07.01","Mean, Median and Spread","Centers and spread of data"],["MATH.STAT.L07.02","Dot Plots, Histograms, Box Plots","Three ways to show one set of numbers"],
["MATH.NUM.L08.02","Sign Rules","Multiply and divide integers"],["MATH.NUM.L08.01","Rational Add-Ups","Add and subtract rational numbers"],["MATH.NUM.L08.03","Rational Times","Multiply and divide rational numbers"],["MATH.NUM.L08.04","Ends or Repeats","Fractions to decimals, ending and repeating"],["MATH.NUM.L08.05","Rational Stories","Word problems with rational numbers"],
["MATH.ALG.L08.01","Proportional Relationships","Tables, graphs, constant of proportionality"],["MATH.ALG.L08.02","Percent Problems","Tax, discount, markup, interest, percent change"],["MATH.ALG.L08.03","Expressions with Rationals","Expressions with fractions and negatives"],["MATH.ALG.L08.04","Two-Step Equations","Two-step equations and inequalities"],["MATH.GEO.L08.01","Scale Drawings","Read and make scale drawings"],["MATH.GEO.L08.02","Circles","Circumference and area of a circle"],["MATH.GEO.L08.03","Angles, Area and Volume Problems","Angle pairs; area and volume of prisms"],["MATH.STAT.L08.01","Samples and Inference","Fair samples; comparing two groups"],["MATH.STAT.L08.02","Probability","Chance of simple and compound events"],
["MATH.NUM.L09.02","Root Finder","Square roots and cube roots"],["MATH.NUM.L09.04","Repeat to Fraction","Repeating decimals as fractions"],["MATH.NUM.L09.01","Real or Not?","Rational and irrational numbers"],["MATH.NUM.L09.03","Squeeze the Root","Estimate irrational numbers"],
["MATH.ALG.L09.01","Slope","Slope as a rate"],["MATH.ALG.L09.02","Powers and Scientific Notation","Exponent rules; very large and small numbers"],["MATH.ALG.L09.03","Solve Linear Equations","Multi-step equations"],["MATH.ALG.L09.04","Two Equations at Once","Systems of two linear equations"],["MATH.FUNC.L09.01","What Is a Function?","One input, one output"],["MATH.FUNC.L09.02","Model with Functions","Linear models; describe a graph"],["MATH.GEO.L09.01","Slide, Turn, Flip","Transformations, congruence, similarity"],["MATH.GEO.L09.02","Angle Facts","Triangle angle sums; parallel lines"],["MATH.GEO.L09.03","Pythagorean Theorem","Use it and its converse"],["MATH.GEO.L09.04","Cylinders, Cones, Spheres","Volume of round solids"],["MATH.STAT.L09.01","Scatter Plots and Trend Lines","Paired data and a fitted line"],["MATH.STAT.L09.02","Two-Way Tables","Relationships in categorical data"]
];

/* Reading K-8 skills in Blueprint teaching order (Blueprint tab "Reading K–8 Skill Ladder", 78 rungs, Levels 1-9; TL-041). Same shape as MATH_K8: [id, rung name, skill]. */
var READ_K8 = [
["READ.PA.L01.01","Book Explorer","Print concepts: front cover, left to right, spaces between words"],["READ.PA.L01.02","Rhyme Time","Hear and make rhymes"],["READ.COMP.L01.02","Story Listener","Retell a read-aloud story: who, and what happened"],["READ.PA.L01.03","Clap the Beats","Count syllables in spoken words"],
["READ.PA.L01.04","First Sound Detective","Say the first sound in a spoken word"],["READ.PHON.L01.01.a","ABC 1: A to D","Name, sound and shape of A, B, C, D"],["READ.PHON.L01.01.b","ABC 2: E to H","Name, sound and shape of E, F, G, H"],["READ.PHON.L01.01.c","ABC 3: I to L","Name, sound and shape of I, J, K, L"],["READ.PHON.L01.01.d","ABC 4: M to Q","Name, sound and shape of M, N, O, P, Q"],["READ.PHON.L01.01.e","ABC 5: R to U","Name, sound and shape of R, S, T, U"],["READ.PHON.L01.01.f","ABC 6: V to Z","Name, sound and shape of V, W, X, Y, Z"],["READ.PHON.L01.01","Letter Lineup","ABC review: name every capital and small letter"],["READ.PHON.L01.02","Sound Match","Say the main sound for each consonant"],["READ.PHON.L01.03","Short Vowel Sounds","Say the short sound of a, e, i, o, u"],
["READ.PA.L01.05","Blend It","Blend three spoken sounds into a word"],["READ.PA.L01.06","Chop It","Break a spoken three-sound word into its sounds"],["READ.PHON.L01.04","Read CVC","Read short-vowel words like cat, sit, hop"],["READ.FLU.L01.01","Snap Words","Read 25 common sight words on sight"],
["READ.COMP.L01.01","Tiny Tales","Read a decodable sentence and match it to a picture"],["READ.PA.L02.01","Swap a Sound","Change one sound to make a new word"],["READ.PHON.L02.01","Digraph Duo","Read sh, ch, th, wh, ck"],["READ.PHON.L02.02","Blend Builders","Read words with blends like st, fl, mp"],
["READ.LV.L02.01","Magic E","Read long-vowel words with silent e"],["READ.LV.L02.02","Vowel Teams 1","Read ai, ay, ee, ea, oa"],["READ.PHON.L02.03","Two-Part Words","Read compound and two-syllable words"],["READ.PHON.L02.04","Ending Smart","Read endings -s, -ed, -ing"],
["READ.FLU.L02.01","Snap Words 2","Read 100 common sight words"],["READ.FLU.L02.02","Smooth Reader","Read a decodable passage accurately, about 60 words a minute"],["READ.VOC.L02.01","Word Sort","Sort words into groups and name the group"],["READ.LIT.L02.01","Story Parts","Name characters, setting and main events"],
["READ.COMP.L02.01","Ask and Answer","Answer questions about key details"],["READ.LV.L03.01","Vowel Teams 2","Read oo, ow, ou, oi, oy, aw"],["READ.PHON.L03.02","Bossy R","Read ar, or, er, ir, ur"],["READ.LV.L03.02","Vowel Teams 3","Read igh, ie, y (my, happy), ew, ue"],["READ.PHON.L03.01","Syllable Splitter","Decode multisyllable words by syllable type"],
["READ.PHON.L03.03","Tricky Spellings","Soft c and g, silent letters, irregular spellings"],["READ.FLU.L03.01","Fluent Flyer","Read about 90 words a minute with expression"],["READ.VOC.L03.01","Prefix Start","Use un- and re- to find meaning"],["READ.LIT.L03.01","Retell It","Retell beginning, middle, end and the lesson"],
["READ.COMP.L03.01","Main Topic","Name the main topic of a paragraph"],["READ.COMP.L03.02","Text Tools","Use headings, captions and bold words"],["READ.COMP.L03.03","Read to Learn","Read a short nonfiction page and answer how and why"],["READ.PHON.L04.01","Word Parts","Prefixes and suffixes"],
["READ.FLU.L04.01","Smooth Passage","Read a grade-level passage accurately and smoothly"],["READ.VOC.L04.01","Clue Hunter","Use context clues for unknown words"],["READ.COMP.L04.01","Five Questions","Answer who, what, where and when questions"],["READ.VOC.L04.02","Dictionary Detective","Use a glossary or dictionary to find meaning"],
["READ.VOC.L04.03","Literal or Not","Tell literal phrases from expressions"],["READ.LIT.L04.02","Character Clues","Describe a character's traits and reasons"],["READ.LIT.L04.01","Moral of the Story","Find a story's central message"],["READ.FLU.L04.02","Chapter Reader","Read a chapter book over several days and track events"],
["READ.COMP.L05.01","Big Idea","Main idea and supporting details"],["READ.COMP.L05.02","What Happened Next","Sequence and cause and effect"],["READ.COMP.L05.03","Text Structures","Spot compare-contrast and problem-solution"],["READ.COMP.L05.04","Read the Picture","Read charts, diagrams and timelines"],
["READ.VOC.L05.01","Same and Opposite","Synonyms and antonyms"],["READ.LIT.L05.01","Summarize the Story","Write a short summary of a story"],["READ.LIT.L05.02","Who's Telling?","First-person and third-person narrators"],["READ.FLU.L05.01","Stamina Reader","Read 30 minutes straight with short check-ins"],
["READ.COMP.L06.01","Read Between the Lines","Make inferences from clues in the text"],["READ.COMP.L06.02","Feature Finder","Use nonfiction text features"],["READ.VOC.L06.01","Root Power","Greek and Latin roots"],["READ.VOC.L06.02","Figure It Out","Similes and metaphors"],
["READ.COMP.L06.03","Two Big Ideas","Find two or more main ideas in one text"],["READ.LIT.L06.01","Compare Characters","Compare two characters or settings"],["READ.COMP.L06.04","Point and Proof","Match an author's points to reasons"],["READ.COMP.L06.05","Two Sources","Combine information from two texts"],
["READ.COMP.L07.01","Show Me the Proof","Cite text evidence for an answer"],["READ.COMP.L07.02","Just the Facts","Write an objective summary"],["READ.LIT.L07.01","Plot and Theme","Character, conflict and theme"],["READ.VOC.L07.01","Word Choice","How word choice sets tone and feeling"],
["READ.COMP.L07.03","Author's Build","How one part fits the whole text"],["READ.COMP.L07.04","Claim Spotter","Trace an argument's claims and reasons"],["READ.COMP.L08.01","Side by Side","Compare two texts on one topic"],["READ.VOC.L08.01","Beyond Literal","Figurative language"],
["READ.LIT.L08.01","Theme Tracker","Follow how a theme develops through a text"],["READ.LIT.L08.02","Whose View?","Contrast characters' points of view"],["READ.COMP.L08.02","Idea Links","How people, events and ideas affect each other"],["READ.VOC.L08.02","Context Master","Advanced context clues and reference tools"],
["READ.COMP.L09.01","Argument Judge","Judge an argument's claims and evidence"],["READ.LIT.L09.01","Why It Was Written","Author's purpose and point of view"],["READ.COMP.L09.02","Manual Reader","Read technical documents: manuals, plans and specs"],["READ.LIT.L09.02","Long Book Builder","Structure across a longer work"],
["READ.VOC.L09.01","Shades of Meaning","Analogies and fine differences between words"],["READ.COMP.L09.03","Fact Checker","Research reading: find and check facts across sources"]
];
/* Language Arts & Writing K-8 lineup in teaching order (GAP MAP hidden tab "Sheet2", 2026-11-11; v60). The boy's WRIT quests follow his LANG placement. */
var LANG_K8 = [
["WRIT.HAND.L01.01", "Pencil Power", "Hold a pencil; trace lines and curves"],
["LANG.GRAM.L01.01", "Naming Words", "Nouns: person, place, thing"],
["WRIT.HAND.L01.02", "Letter Builder", "Write every capital letter"],
["LANG.GRAM.L01.02", "Action Words", "Verbs"],
["WRIT.HAND.L01.03", "Small Letters", "Write every small letter"],
["WRIT.HAND.L01.04", "Name Writer", "Write their own name"],
["LANG.MECH.L01.01", "Sound It Out", "Spell short-vowel words by their sounds"],
["WRIT.SENT.L01.01", "My First Sentence", "Write a sentence with a capital, spaces and a period"],
["WRIT.HAND.L02.01", "Neat Lines", "Letter size and spacing on lines"],
["LANG.GRAM.L02.01", "One or Many", "Plurals with -s and -es"],
["LANG.GRAM.L02.02", "Describing Words", "Adjectives"],
["LANG.GRAM.L02.03", "Then and Now", "Past, present and future verbs"],
["LANG.MECH.L02.01", "Asking or Telling", "Statements, questions and exclamations with the right end mark"],
["LANG.MECH.L02.02", "Proper Names", "Capitalize names, days and months"],
["LANG.MECH.L02.03", "Pattern Speller", "Spell words using learned phonics patterns"],
["WRIT.SENT.L02.01", "Tell What Happened", "Three sentences in order using first, next, last"],
["LANG.SENT.L03.01", "Whole Thought", "Complete sentences: fix fragments and run-ons"],
["LANG.GRAM.L03.01", "Irregular Plurals", "Feet, mice, children"],
["LANG.GRAM.L03.02", "Irregular Past", "Went, saw, told"],
["LANG.MECH.L03.01", "Apostrophe Basics", "Contractions and possessives"],
["WRIT.SENT.L03.01", "Spice It Up", "Expand sentences with adjectives and adverbs"],
["WRIT.PARA.L03.01", "My Opinion", "State an opinion with one reason"],
["WRIT.PARA.L03.02", "Teach Me Something", "Three-sentence informative piece"],
["WRIT.PARA.L03.03", "Story Starter", "Short story with beginning, middle and end"],
["LANG.MECH.L04.01", "Capital Check", "Capitals, end marks and commas in a list"],
["WRIT.SENT.L04.01", "Join It", "Combine short sentences with and, but, so"],
["LANG.GRAM.L04.01", "Pronoun Partners", "Pronouns that match the noun they replace"],
["LANG.GRAM.L04.02", "Agree to Agree", "Subject and verb agree"],
["LANG.GRAM.L04.03", "Bigger, Biggest", "Comparing adjectives and adverbs"],
["LANG.MECH.L04.02", "Talking Marks", "Quotation marks for dialogue"],
["WRIT.PARA.L04.01", "Paragraph Builder", "Topic sentence, three details, closing"],
["WRIT.HAND.L04.01", "Cursive Start", "Write small letters in cursive"],
["WRIT.PARA.L05.01", "Smooth Moves", "Paragraph with transition words"],
["WRIT.PARA.L05.02", "How-To Hero", "Step-by-step how-to paragraph"],
["LANG.GRAM.L05.01", "Tense Lock", "Keep verb tense consistent"],
["LANG.USE.L05.01", "Mix-Up Words", "to, too, two; their, there, they're; your, you're"],
["LANG.MECH.L05.01", "Comma Rules", "Commas after opening words and in joined sentences"],
["WRIT.PARA.L05.03", "Story with Dialogue", "Story using dialogue and description"],
["WRIT.PARA.L05.04", "Opinion Paragraph", "Opinion with reasons and examples"],
["WRIT.PARA.L05.05", "Fix It Up", "Revise and edit their own paragraph to a checklist"],
["WRIT.PARA.L06.01", "Squeeze It", "Summary paragraph"],
["WRIT.ESSAY.L06.01", "Three-Part Piece", "Three paragraphs with introduction and conclusion"],
["LANG.GRAM.L06.01", "Conjunction Kit", "Because, although, when, unless"],
["LANG.GRAM.L06.02", "Perfect Tense", "Had, has and will have"],
["LANG.MECH.L06.01", "Title Style", "Titles, addresses, and commas with yes, no and names"],
["LANG.MECH.L06.02", "Suffix Spelling", "Drop the e, double the consonant, change y to i"],
["WRIT.PARA.L06.02", "Letter Writer", "Friendly letter and thank-you note"],
["WRIT.ESSAY.L07.01", "Take a Stand", "State a claim with reasons"],
["WRIT.ESSAY.L07.02", "Quote and Explain", "Quote evidence and explain it"],
["LANG.GRAM.L07.01", "Pronoun Precision", "Pronoun case and no vague pronouns"],
["WRIT.SENT.L07.01", "Vary It", "Vary sentence length and pattern"],
["LANG.MECH.L07.01", "Extra Info", "Commas, parentheses and dashes for extra information"],
["WRIT.ESSAY.L07.03", "Show, Don't Tell", "Story with sensory detail"],
["LANG.USE.L07.01", "Formal Voice", "Formal and informal style"],
["LANG.GRAM.L08.01", "Clause Builder", "Clauses and complex sentences"],
["WRIT.ESSAY.L08.01", "Five-Paragraph Argument", "Five-paragraph argument essay"],
["WRIT.ESSAY.L08.02", "The Other Side", "Answer a counterclaim"],
["LANG.GRAM.L08.02", "Modifier Fix", "Fix dangling and misplaced modifiers"],
["LANG.USE.L08.01", "Cut the Clutter", "Say it in fewer, stronger words"],
["WRIT.ESSAY.L08.03", "Explain It All", "Multi-paragraph informative essay with headings"],
["WRIT.RES.L09.01", "Source Scout", "Find and judge sources"],
["WRIT.RES.L09.02", "Say It Your Way", "Paraphrase and cite"],
["WRIT.RES.L09.03", "Report Writer", "Short research report"],
["WRIT.ESSAY.L09.01", "Business Writer", "Letter, proposal and customer note"],
["LANG.GRAM.L09.01", "Active Voice", "Active and passive voice"],
["LANG.MECH.L09.01", "Punctuation Pro", "Dashes and ellipses for pauses and breaks"],
["LANG.USE.L09.01", "Editor's Eye", "Proofread a full piece to a checklist"]
];
/* Science lineup in teaching order — NEW Niflaos HaBorei map (GAP MAP tab "Science", 2026-11-10, science chat yosef@). Replaces SCI_K8 in Placement.gs (same shape: [id, rung name, skill]). Levels 1-9 = K-8 (204 lessons); SCI_HS = Levels 10-13 (96 lessons). The 19 built IDs are unchanged. */
var SCI_K8 = [["SCI.PHYS.L01.01","Sun Warms","Sun and Sky — Observe: what do I see in the sky?"],
["SCI.SKY.L01.01","Day and Night","Sun and Sky — Observe: what do I see in the sky?"],
["SCI.EARTH.L01.01","Weather Watch","Weather and the Ground — Observe and name: sunny, rainy, snowy, windy"],
["SCI.LAND.L01.01","Rocks, Sand and Soil","Weather and the Ground — Observe and name: sunny, rainy, snowy, windy"],
["SCI.EARTH.L01.02","Homes and Habitats","Animals All Around — Observe and describe animals"],
["SCI.ANIM.L01.01","Animals Big and Small","Animals All Around — Observe and describe animals"],
["SCI.LIFE.L01.01","What Living Things Need","Plants Grow — Observe how plants change"],
["SCI.PLANT.L01.01","Parts of a Plant","Plants Grow — Observe how plants change"],
["SCI.INQ.L01.01","Look Closely","My Wonderful Body — Use each sense on purpose"],
["SCI.BODY.L01.01","Clean Hands, Healthy Body","My Wonderful Body — Use each sense on purpose"],
["SCI.PHYS.L01.02","Push and Pull","Things Move — Try it and watch what happens"],
["SCI.MATT.L01.01","Sink or Float","Things Move — Try it and watch what happens"],
["SCI.EARTH.L02.01","Sky Patterns","Lights in the Sky — Compare: day sky and night sky"],
["SCI.SKY.L02.01","The Moon Changes Shape","Lights in the Sky — Compare: day sky and night sky"],
["SCI.SKY.L02.02","Stars Without Number","Lights in the Sky — Compare: day sky and night sky"],
["SCI.SKY.L02.03","The Four Seasons","Lights in the Sky — Compare: day sky and night sky"],
["SCI.LAND.L02.01","Where Water Is","Water and Land — Sort: land or water? Fresh or salty?"],
["SCI.LAND.L02.02","Clouds and Rain","Water and Land — Sort: land or water? Fresh or salty?"],
["SCI.LAND.L02.03","Mountains and Valleys","Water and Land — Sort: land or water? Fresh or salty?"],
["SCI.LAND.L02.04","The Wind","Water and Land — Sort: land or water? Fresh or salty?"],
["SCI.LIFE.L02.01","Parts That Help","Animal Bodies — Compare animals by their parts"],
["SCI.LIFE.L02.02","Like Parents","Animal Bodies — Compare animals by their parts"],
["SCI.ANIM.L02.01","Feathers, Fur and Scales","Animal Bodies — Compare animals by their parts"],
["SCI.ANIM.L02.02","How Animals Move","Animal Bodies — Compare animals by their parts"],
["SCI.PLANT.L02.01","Roots Drink","Plant Parts at Work — Sort plant parts by their jobs"],
["SCI.PLANT.L02.02","Leaves Catch Sunlight","Plant Parts at Work — Sort plant parts by their jobs"],
["SCI.PLANT.L02.03","Flowers and Fruit","Plant Parts at Work — Sort plant parts by their jobs"],
["SCI.PLANT.L02.04","Trees Through the Year","Plant Parts at Work — Sort plant parts by their jobs"],
["SCI.BODY.L02.01","Bones Hold Me Up","My Body Works — Compare: what does each part do?"],
["SCI.BODY.L02.02","My Heart and Muscles","My Body Works — Compare: what does each part do?"],
["SCI.BODY.L02.03","Food Gives Me Energy","My Body Works — Compare: what does each part do?"],
["SCI.BODY.L02.04","Sleep and Rest","My Body Works — Compare: what does each part do?"],
["SCI.PHYS.L02.01","Sound Shakes","Sound and Light — Ask a question and test it fairly"],
["SCI.PHYS.L02.02","Light and Shadow","Sound and Light — Ask a question and test it fairly"],
["SCI.INQ.L02.01","Fair Test","Sound and Light — Ask a question and test it fairly"],
["SCI.MATT.L02.01","Colors in White Light","Sound and Light — Ask a question and test it fairly"],
["SCI.SKY.L03.01","The Sun’s Path","Sun, Shadows and Time — Measure shadows through the day"],
["SCI.SKY.L03.02","Shadow Clocks","Sun, Shadows and Time — Measure shadows through the day"],
["SCI.SKY.L03.03","The Moon and the Jewish Calendar","Sun, Shadows and Time — Measure shadows through the day"],
["SCI.SKY.L03.04","Stars in the Daytime","Sun, Shadows and Time — Measure shadows through the day"],
["SCI.EARTH.L03.01","Land and Water","Land, Water and Ice — Measure and compare"],
["SCI.EARTH.L03.03","Snow and Ice Wonders","Land, Water and Ice — Measure and compare"],
["SCI.LAND.L03.01","Rivers Run to the Sea","Land, Water and Ice — Measure and compare"],
["SCI.LAND.L03.02","Kinds of Soil","Land, Water and Ice — Measure and compare"],
["SCI.LIFE.L03.02","Living Variety","Many Kinds of Animals — Record what you observe in a table"],
["SCI.ANIM.L03.01","Insects: Six Legs","Many Kinds of Animals — Record what you observe in a table"],
["SCI.ANIM.L03.02","Birds and Eggs","Many Kinds of Animals — Record what you observe in a table"],
["SCI.ANIM.L03.03","Animals in Winter","Many Kinds of Animals — Record what you observe in a table"],
["SCI.LIFE.L03.01","Seeds and Pollinators","Seeds and Growing — Measure how a plant grows"],
["SCI.PLANT.L03.01","How Seeds Travel","Seeds and Growing — Measure how a plant grows"],
["SCI.PLANT.L03.02","From Seed to Plant","Seeds and Growing — Measure how a plant grows"],
["SCI.PLANT.L03.03","Ha’etz or Ha’adamah?","Seeds and Growing — Measure how a plant grows"],
["SCI.BODY.L03.01","How We See","My Senses Up Close — Measure with your senses (and see where they fool you)"],
["SCI.BODY.L03.02","How We Hear","My Senses Up Close — Measure with your senses (and see where they fool you)"],
["SCI.BODY.L03.03","Taste and Smell Together","My Senses Up Close — Measure with your senses (and see where they fool you)"],
["SCI.BODY.L03.04","Touch: Skin Feels","My Senses Up Close — Measure with your senses (and see where they fool you)"],
["SCI.INQ.L03.01","Measure It","Materials and Changes — Measure and record (length, weight, temperature)"],
["SCI.PHYS.L03.01","Material Detective","Materials and Changes — Measure and record (length, weight, temperature)"],
["SCI.PHYS.L03.02","Heat Changes Things","Materials and Changes — Measure and record (length, weight, temperature)"],
["SCI.MATT.L03.01","Magnets Pull","Materials and Changes — Measure and record (length, weight, temperature)"],
["SCI.SKY.L04.01","The Earth Spins","Earth, Sun and Moon — Model it: use a ball and a lamp"],
["SCI.SKY.L04.02","A Year Around the Sun","Earth, Sun and Moon — Model it: use a ball and a lamp"],
["SCI.SKY.L04.03","Why the Moon Changes","Earth, Sun and Moon — Model it: use a ball and a lamp"],
["SCI.SKY.L04.04","Star Patterns and the Seasons","Earth, Sun and Moon — Model it: use a ball and a lamp"],
["SCI.LAND.L04.01","Temperature and Thermometers","Weather Up Close — Measure weather and record it every day"],
["SCI.LAND.L04.02","The Water Cycle","Weather Up Close — Measure weather and record it every day"],
["SCI.LAND.L04.03","Thunder and Lightning","Weather Up Close — Measure weather and record it every day"],
["SCI.LAND.L04.04","Weather Around the World","Weather Up Close — Measure weather and record it every day"],
["SCI.ANIM.L04.01","From Caterpillar to Butterfly","Built for the Job — Compare animals with a table"],
["SCI.ANIM.L04.02","From Tadpole to Frog","Built for the Job — Compare animals with a table"],
["SCI.ANIM.L04.03","The Camel, Built for the Desert","Built for the Job — Compare animals with a table"],
["SCI.ANIM.L04.04","Built for the Cold","Built for the Job — Compare animals with a table"],
["SCI.PLANT.L04.01","Leaves Make Food","Plants at Work — Measure growth and record it"],
["SCI.PLANT.L04.02","Why Leaves Change Color","Plants at Work — Measure growth and record it"],
["SCI.PLANT.L04.03","Rings Inside a Tree","Plants at Work — Measure growth and record it"],
["SCI.PLANT.L04.04","Gardens and Farms in the Torah","Plants at Work — Measure growth and record it"],
["SCI.BODY.L04.01","Food and Energy","Food and Health — Record and compare with a chart"],
["SCI.BODY.L04.02","Teeth","Food and Health — Record and compare with a chart"],
["SCI.BODY.L04.03","Germs and Staying Healthy","Food and Health — Record and compare with a chart"],
["SCI.BODY.L04.04","Heart and Exercise","Food and Health — Record and compare with a chart"],
["SCI.MATT.L04.01","Gravity Pulls Down","Forces and Motion — Run a fair test and record results"],
["SCI.MATT.L04.02","Friction","Forces and Motion — Run a fair test and record results"],
["SCI.MATT.L04.03","Simple Machines","Forces and Motion — Run a fair test and record results"],
["SCI.MATT.L04.04","Ramps and Rolling","Forces and Motion — Run a fair test and record results"],
["SCI.SKY.L05.01","Our Sun Is a Star","Our Solar System — Use a scale model"],
["SCI.SKY.L05.02","The Planets","Our Solar System — Use a scale model"],
["SCI.SKY.L05.03","The Moon Up Close","Our Solar System — Use a scale model"],
["SCI.SKY.L05.04","Tides","Our Solar System — Use a scale model"],
["SCI.LAND.L05.01","Rocks and Minerals","Rocks, Minerals and Gems — Classify by testing properties"],
["SCI.LAND.L05.02","Crystals","Rocks, Minerals and Gems — Classify by testing properties"],
["SCI.LAND.L05.03","The Stones of the Choshen","Rocks, Minerals and Gems — Classify by testing properties"],
["SCI.LAND.L05.04","Water Shapes the Land","Rocks, Minerals and Gems — Classify by testing properties"],
["SCI.ANIM.L05.01","Animal Senses","Animal Senses and Signals — Plan an investigation"],
["SCI.ANIM.L05.02","Birds That Travel","Animal Senses and Signals — Plan an investigation"],
["SCI.ANIM.L05.03","How Bees Talk","Animal Senses and Signals — Plan an investigation"],
["SCI.ANIM.L05.04","Kosher Signs: Sorting Animals","Animal Senses and Signals — Plan an investigation"],
["SCI.PLANT.L05.01","Flowers and Pollination","Plant Wonders — Plan a fair test with plants"],
["SCI.PLANT.L05.02","Plants That Move","Plant Wonders — Plan a fair test with plants"],
["SCI.PLANT.L05.03","Giant Trees","Plant Wonders — Plan a fair test with plants"],
["SCI.PLANT.L05.04","The Seven Species","Plant Wonders — Plan a fair test with plants"],
["SCI.BODY.L05.01","Lungs and Breathing","The Body’s Teams — Model a body system"],
["SCI.BODY.L05.02","Heart and Blood","The Body’s Teams — Model a body system"],
["SCI.BODY.L05.03","Bones and Joints","The Body’s Teams — Model a body system"],
["SCI.BODY.L05.04","Brain and Nerves","The Body’s Teams — Model a body system"],
["SCI.MATT.L05.01","Energy All Around","Energy — Plan and run a fair test"],
["SCI.MATT.L05.02","Electricity and Circuits","Energy — Plan and run a fair test"],
["SCI.MATT.L05.03","Waves","Energy — Plan and run a fair test"],
["SCI.MATT.L05.04","Keeping Things Warm","Energy — Plan and run a fair test"],
["SCI.SKY.L06.01","Telescopes and Lenses","Lights in the Heavens — Collect observations over time"],
["SCI.SKY.L06.02","Star Colors","Lights in the Heavens — Collect observations over time"],
["SCI.SKY.L06.03","Finding Your Way by the Stars","Lights in the Heavens — Collect observations over time"],
["SCI.SKY.L06.04","Sun and Moon Together: Our Calendar","Lights in the Heavens — Collect observations over time"],
["SCI.LAND.L06.01","The Oceans","Earth’s Water — Graph where the water is"],
["SCI.LAND.L06.02","Fresh Water","Earth’s Water — Graph where the water is"],
["SCI.LAND.L06.03","Wells and Groundwater","Earth’s Water — Graph where the water is"],
["SCI.LAND.L06.04","Guarding Hashem’s World","Earth’s Water — Graph where the water is"],
["SCI.ANIM.L06.01","Producers and Consumers","Food Chains — Draw and read a food-chain diagram"],
["SCI.ANIM.L06.02","Hunters and Hunted","Food Chains — Draw and read a food-chain diagram"],
["SCI.ANIM.L06.03","The Cleanup Crew","Food Chains — Draw and read a food-chain diagram"],
["SCI.ANIM.L06.04","Balance in a Habitat","Food Chains — Draw and read a food-chain diagram"],
["SCI.PLANT.L06.01","How Plants Build Themselves","Plants Make Food — Measure and graph plant growth"],
["SCI.PLANT.L06.02","Leaves Up Close","Plants Make Food — Measure and graph plant growth"],
["SCI.PLANT.L06.03","Plants and Air","Plants Make Food — Measure and graph plant growth"],
["SCI.PLANT.L06.04","Wheat: From Seed to Bread","Plants Make Food — Measure and graph plant growth"],
["SCI.BODY.L06.01","The Journey of Food","Digestion and Nutrition — Read nutrition labels as data"],
["SCI.BODY.L06.02","Vitamins and Minerals","Digestion and Nutrition — Read nutrition labels as data"],
["SCI.BODY.L06.03","Water in the Body","Digestion and Nutrition — Read nutrition labels as data"],
["SCI.BODY.L06.04","Taste Buds","Digestion and Nutrition — Read nutrition labels as data"],
["SCI.MATT.L06.01","Solids, Liquids and Gases","Matter and Its Changes — Measure mass and volume"],
["SCI.MATT.L06.02","Mixtures and Solutions","Matter and Its Changes — Measure mass and volume"],
["SCI.MATT.L06.03","Nothing Is Lost","Matter and Its Changes — Measure mass and volume"],
["SCI.MATT.L06.04","Ice Floats!","Matter and Its Changes — Measure mass and volume"],
["SCI.SKY.L07.01","Gravity Holds the Planets","Gravity and Orbits — Read patterns in orbit data"],
["SCI.SKY.L07.02","Why We Have Seasons","Gravity and Orbits — Read patterns in orbit data"],
["SCI.SKY.L07.03","Eclipses","Gravity and Orbits — Read patterns in orbit data"],
["SCI.SKY.L07.04","The Molad: Chazal’s Calculation","Gravity and Orbits — Read patterns in orbit data"],
["SCI.LAND.L07.01","Layers of the Earth","The Ground Beneath Us — Model the earth’s layers"],
["SCI.LAND.L07.02","Volcanoes","The Ground Beneath Us — Model the earth’s layers"],
["SCI.LAND.L07.03","Earthquakes and Staying Safe","The Ground Beneath Us — Model the earth’s layers"],
["SCI.LAND.L07.04","Moving Ground, Measured Today","The Ground Beneath Us — Model the earth’s layers"],
["SCI.ANIM.L07.01","Each After Its Kind","Sorting Living Things — Classify with a key"],
["SCI.ANIM.L07.02","Mammals, Birds, Reptiles, Amphibians and Fish","Sorting Living Things — Classify with a key"],
["SCI.ANIM.L07.03","Insects and Spiders","Sorting Living Things — Classify with a key"],
["SCI.ANIM.L07.04","Kosher Fish: Fins and Scales","Sorting Living Things — Classify with a key"],
["SCI.PLANT.L07.01","Flowering and Non-flowering Plants","The Plant Kingdom — Classify with a key"],
["SCI.PLANT.L07.02","Germination Experiment","The Plant Kingdom — Classify with a key"],
["SCI.PLANT.L07.03","Kilayim and Grafting","The Plant Kingdom — Classify with a key"],
["SCI.PLANT.L07.04","Fungi: Not Plants at All","The Plant Kingdom — Classify with a key"],
["SCI.BODY.L07.01","The Eye: Faster Than Any Camera","Senses and the Brain — Measure reaction time and graph it"],
["SCI.BODY.L07.02","The Ear and Balance","Senses and the Brain — Measure reaction time and graph it"],
["SCI.BODY.L07.03","The Brain","Senses and the Brain — Measure reaction time and graph it"],
["SCI.BODY.L07.04","Reflexes","Senses and the Brain — Measure reaction time and graph it"],
["SCI.MATT.L07.01","Mirrors and Reflection","Light and Sound — Graph and compare measurements"],
["SCI.MATT.L07.02","Rainbows and Refraction","Light and Sound — Graph and compare measurements"],
["SCI.MATT.L07.03","Pitch and Volume","Light and Sound — Graph and compare measurements"],
["SCI.MATT.L07.04","Lightning, Then Thunder","Light and Sound — Graph and compare measurements"],
["SCI.SKY.L08.01","Latitude and the North Star","Navigating by the Heavens — Use models and maps"],
["SCI.SKY.L08.02","Kiddush HaChodesh","Navigating by the Heavens — Use models and maps"],
["SCI.SKY.L08.03","How Planets Move","Navigating by the Heavens — Use models and maps"],
["SCI.SKY.L08.04","Satellites and GPS","Navigating by the Heavens — Use models and maps"],
["SCI.LAND.L08.01","Layers of the Air","The Air Around Us — Model the atmosphere"],
["SCI.LAND.L08.02","Air Pressure","The Air Around Us — Model the atmosphere"],
["SCI.LAND.L08.03","Fronts and Forecasts","The Air Around Us — Model the atmosphere"],
["SCI.LAND.L08.04","Kinds of Clouds","The Air Around Us — Model the atmosphere"],
["SCI.ANIM.L08.01","Navigators of the Sky","Navigators of the Sky — Model how animals find their way"],
["SCI.ANIM.L08.02","Navigators of the Sea","Navigators of the Sky — Model how animals find their way"],
["SCI.ANIM.L08.03","Animal Architects","Navigators of the Sky — Model how animals find their way"],
["SCI.ANIM.L08.04","Ants and Teamwork","Navigators of the Sky — Model how animals find their way"],
["SCI.PLANT.L08.01","Pipes in a Plant","Inside a Plant — Draw and label a model"],
["SCI.PLANT.L08.02","Food Factories","Inside a Plant — Draw and label a model"],
["SCI.PLANT.L08.03","Plants Respond","Inside a Plant — Draw and label a model"],
["SCI.PLANT.L08.04","The Masada Date Palm","Inside a Plant — Draw and label a model"],
["SCI.BODY.L08.01","Cells: Building Blocks","Cells and Body Systems — Model a cell"],
["SCI.BODY.L08.02","Parts of a Cell","Cells and Body Systems — Model a cell"],
["SCI.BODY.L08.03","Systems Working Together","Cells and Body Systems — Model a cell"],
["SCI.BODY.L08.04","The Body’s Defenders","Cells and Body Systems — Model a cell"],
["SCI.MATT.L08.01","Atoms","Atoms and Elements — Use models of atoms"],
["SCI.MATT.L08.02","The Periodic Table","Atoms and Elements — Use models of atoms"],
["SCI.MATT.L08.03","Metals in the Torah","Atoms and Elements — Use models of atoms"],
["SCI.MATT.L08.04","Compounds","Atoms and Elements — Use models of atoms"],
["SCI.SKY.L09.01","How the Sun Shines","The Sun and Stars Up Close — Analyze light data"],
["SCI.SKY.L09.02","Reading Starlight","The Sun and Stars Up Close — Analyze light data"],
["SCI.SKY.L09.03","Measuring Huge Distances","The Sun and Stars Up Close — Analyze light data"],
["SCI.SKY.L09.04","Birkas HaChamah","The Sun and Stars Up Close — Analyze light data"],
["SCI.LAND.L09.01","Hurricanes","Hazards and Forecasting — Analyze weather data and explain"],
["SCI.LAND.L09.02","Floods and Rivers","Hazards and Forecasting — Analyze weather data and explain"],
["SCI.LAND.L09.03","Tsunamis","Hazards and Forecasting — Analyze weather data and explain"],
["SCI.LAND.L09.04","Forecasting with Data","Hazards and Forecasting — Analyze weather data and explain"],
["SCI.ANIM.L09.01","Traits and Genes","Traits Within Each Kind — Analyze patterns of traits"],
["SCI.ANIM.L09.02","Predicting Traits","Traits Within Each Kind — Analyze patterns of traits"],
["SCI.ANIM.L09.03","Variety Within a Kind","Traits Within Each Kind — Analyze patterns of traits"],
["SCI.ANIM.L09.04","Engineers Learn from Creation","Traits Within Each Kind — Analyze patterns of traits"],
["SCI.PLANT.L09.01","Populations and Communities","Ecosystems — Analyze population data"],
["SCI.PLANT.L09.02","Energy Pyramids","Ecosystems — Analyze population data"],
["SCI.PLANT.L09.03","Cycles of Matter","Ecosystems — Analyze population data"],
["SCI.PLANT.L09.04","Shemitah: Resting the Land","Ecosystems — Analyze population data"],
["SCI.BODY.L09.01","How the Body Fights Germs","Health and Healing — Analyze health data"],
["SCI.BODY.L09.02","Food Energy and Calories","Health and Healing — Analyze health data"],
["SCI.BODY.L09.03","The Heart Pump","Health and Healing — Analyze health data"],
["SCI.BODY.L09.04","Healing Bones and Skin","Health and Healing — Analyze health data"],
["SCI.MATT.L09.01","Physical and Chemical Changes","Chemical Reactions — Explain results with evidence"],
["SCI.MATT.L09.02","Acids and Bases: Vinegar on Soda","Chemical Reactions — Explain results with evidence"],
["SCI.MATT.L09.03","Nothing Lost, Nothing Gained","Chemical Reactions — Explain results with evidence"],
["SCI.MATT.L09.04","Reactions and Energy","Chemical Reactions — Explain results with evidence"]];
var SCI_HS = [["SCI.SKY.L10.01","Motions of the Sky","Sun, Moon and Calendar — Measure angles and time"],
["SCI.SKY.L10.02","The Moon’s Orbit and Phases","Sun, Moon and Calendar — Measure angles and time"],
["SCI.SKY.L10.03","Eclipses and Their Prediction","Sun, Moon and Calendar — Measure angles and time"],
["SCI.SKY.L10.04","Calculating the Jewish Calendar","Sun, Moon and Calendar — Measure angles and time"],
["SCI.SKY.L10.05","What Stars Are","Lights in the Heavens — Analyze spectra and brightness"],
["SCI.SKY.L10.06","Brightness and Distance","Lights in the Heavens — Analyze spectra and brightness"],
["SCI.SKY.L10.07","Star Colors and Temperature","Lights in the Heavens — Analyze spectra and brightness"],
["SCI.SKY.L10.08","Navigation by the Stars","Lights in the Heavens — Analyze spectra and brightness"],
["SCI.LAND.L10.01","Earth’s Spheres","The Earth System — Model interacting systems"],
["SCI.LAND.L10.02","Inside the Earth","The Earth System — Model interacting systems"],
["SCI.LAND.L10.03","The Crust in Motion, Measured Today","The Earth System — Model interacting systems"],
["SCI.LAND.L10.04","Mountains and Volcanoes","The Earth System — Model interacting systems"],
["SCI.LAND.L10.05","Identifying Minerals","Rocks, Minerals and Gems (advanced) — Classify with tests and data"],
["SCI.LAND.L10.06","Crystal Shapes","Rocks, Minerals and Gems (advanced) — Classify with tests and data"],
["SCI.LAND.L10.07","Rocks and Their Changes","Rocks, Minerals and Gems (advanced) — Classify with tests and data"],
["SCI.LAND.L10.08","The Stones of the Choshen","Rocks, Minerals and Gems (advanced) — Classify with tests and data"],
["SCI.LAND.L10.09","The Atmosphere","Air and Weather — Analyze weather data"],
["SCI.LAND.L10.10","Heat and Wind","Air and Weather — Analyze weather data"],
["SCI.LAND.L10.11","Water in the Air","Air and Weather — Analyze weather data"],
["SCI.LAND.L10.12","Storms and Forecasts","Air and Weather — Analyze weather data"],
["SCI.LAND.L10.13","Seawater","The Oceans — Graph and explain ocean data"],
["SCI.LAND.L10.14","Currents","The Oceans — Graph and explain ocean data"],
["SCI.LAND.L10.15","Tides","The Oceans — Graph and explain ocean data"],
["SCI.LAND.L10.16","The Deep Sea","The Oceans — Graph and explain ocean data"],
["SCI.BODY.L11.01","The Cell","Cells — Use a microscope and draw what you see"],
["SCI.BODY.L11.02","Cell Parts and Jobs","Cells — Use a microscope and draw what you see"],
["SCI.BODY.L11.03","The Cell Membrane","Cells — Use a microscope and draw what you see"],
["SCI.BODY.L11.04","Cell Division","Cells — Use a microscope and draw what you see"],
["SCI.ANIM.L11.01","DNA: The Instruction Book","DNA and Heredity Within Each Kind — Analyze patterns with probability"],
["SCI.ANIM.L11.02","Genes and Traits","DNA and Heredity Within Each Kind — Analyze patterns with probability"],
["SCI.ANIM.L11.03","Patterns of Inheritance","DNA and Heredity Within Each Kind — Analyze patterns with probability"],
["SCI.ANIM.L11.04","Variety Within a Kind","DNA and Heredity Within Each Kind — Analyze patterns with probability"],
["SCI.PLANT.L11.01","Photosynthesis","Plant Biology — Design a controlled experiment"],
["SCI.PLANT.L11.02","Transport in Plants","Plant Biology — Design a controlled experiment"],
["SCI.PLANT.L11.03","Plant Responses","Plant Biology — Design a controlled experiment"],
["SCI.PLANT.L11.04","Plants in Halacha","Plant Biology — Design a controlled experiment"],
["SCI.ANIM.L11.05","Structure and Function","Animals and Design — Compare structure and function"],
["SCI.ANIM.L11.06","Animal Behavior","Animals and Design — Compare structure and function"],
["SCI.ANIM.L11.07","Migration and Navigation","Animals and Design — Compare structure and function"],
["SCI.ANIM.L11.08","Kashrus and Classification","Animals and Design — Compare structure and function"],
["SCI.PLANT.L11.05","Ecosystems","Ecology — Collect and analyze field data"],
["SCI.PLANT.L11.06","Energy and Matter in Ecosystems","Ecology — Collect and analyze field data"],
["SCI.PLANT.L11.07","Populations","Ecology — Collect and analyze field data"],
["SCI.PLANT.L11.08","Guarding Hashem’s World","Ecology — Collect and analyze field data"],
["SCI.BODY.L11.05","Circulation and Breathing","Human Body Systems — Measure and explain body data"],
["SCI.BODY.L11.06","Digestion and Nutrition","Human Body Systems — Measure and explain body data"],
["SCI.BODY.L11.07","The Nervous System","Human Body Systems — Measure and explain body data"],
["SCI.BODY.L11.08","The Immune System","Human Body Systems — Measure and explain body data"],
["SCI.MATT.L12.01","Inside the Atom","Atoms — Use models and measurement"],
["SCI.MATT.L12.02","Protons, Neutrons and Electrons","Atoms — Use models and measurement"],
["SCI.MATT.L12.03","Isotopes","Atoms — Use models and measurement"],
["SCI.MATT.L12.04","Light from Atoms","Atoms — Use models and measurement"],
["SCI.MATT.L12.05","Organizing the Elements","The Periodic Table — Find patterns in data"],
["SCI.MATT.L12.06","Families of Elements","The Periodic Table — Find patterns in data"],
["SCI.MATT.L12.07","Metals","The Periodic Table — Find patterns in data"],
["SCI.MATT.L12.08","Nonmetals and Noble Gases","The Periodic Table — Find patterns in data"],
["SCI.MATT.L12.09","Ionic Bonds","Bonding — Build models of molecules"],
["SCI.MATT.L12.10","Covalent Bonds","Bonding — Build models of molecules"],
["SCI.MATT.L12.11","The Water Molecule","Bonding — Build models of molecules"],
["SCI.MATT.L12.12","Carbon: The Builder","Bonding — Build models of molecules"],
["SCI.MATT.L12.13","Balancing Equations","Reactions and Calculations — Calculate with balanced equations"],
["SCI.MATT.L12.14","Counting with Moles","Reactions and Calculations — Calculate with balanced equations"],
["SCI.MATT.L12.15","Reaction Rates","Reactions and Calculations — Calculate with balanced equations"],
["SCI.MATT.L12.16","Energy in Reactions","Reactions and Calculations — Calculate with balanced equations"],
["SCI.MATT.L12.17","Solutions","Solutions, Acids and Bases — Titrate and calculate"],
["SCI.MATT.L12.18","Acids and Bases","Solutions, Acids and Bases — Titrate and calculate"],
["SCI.MATT.L12.19","The pH Scale","Solutions, Acids and Bases — Titrate and calculate"],
["SCI.MATT.L12.20","Salt and Osmosis: Melichah","Solutions, Acids and Bases — Titrate and calculate"],
["SCI.MATT.L12.21","Metals and Corrosion","Chemistry in Daily Life — Explain with evidence"],
["SCI.MATT.L12.22","Fire","Chemistry in Daily Life — Explain with evidence"],
["SCI.MATT.L12.23","Chemistry of Bread","Chemistry in Daily Life — Explain with evidence"],
["SCI.MATT.L12.24","Kashering Utensils","Chemistry in Daily Life — Explain with evidence"],
["SCI.PHYS.L13.01","Speed and Velocity","Motion — Graph motion and derive equations"],
["SCI.PHYS.L13.02","Acceleration","Motion — Graph motion and derive equations"],
["SCI.PHYS.L13.03","Projectiles","Motion — Graph motion and derive equations"],
["SCI.PHYS.L13.04","Circular Motion","Motion — Graph motion and derive equations"],
["SCI.PHYS.L13.05","Newton’s Laws","Forces — Measure forces and test Newton’s laws"],
["SCI.PHYS.L13.06","Gravity Everywhere","Forces — Measure forces and test Newton’s laws"],
["SCI.PHYS.L13.07","Friction and Air Resistance","Forces — Measure forces and test Newton’s laws"],
["SCI.PHYS.L13.08","Pressure and Fluids","Forces — Measure forces and test Newton’s laws"],
["SCI.PHYS.L13.09","Work and Energy","Energy and Work — Calculate energy before and after"],
["SCI.PHYS.L13.10","Energy Is Conserved","Energy and Work — Calculate energy before and after"],
["SCI.PHYS.L13.11","Power","Energy and Work — Calculate energy before and after"],
["SCI.PHYS.L13.12","Simple Machines","Energy and Work — Calculate energy before and after"],
["SCI.PHYS.L13.13","Wave Properties","Waves and Sound — Measure frequency and wavelength"],
["SCI.PHYS.L13.14","Sound","Waves and Sound — Measure frequency and wavelength"],
["SCI.PHYS.L13.15","Music and Resonance","Waves and Sound — Measure frequency and wavelength"],
["SCI.PHYS.L13.16","The Doppler Effect","Waves and Sound — Measure frequency and wavelength"],
["SCI.PHYS.L13.17","The Speed of Light","Light and Optics — Measure angles and derive laws"],
["SCI.PHYS.L13.18","Reflection and Refraction","Light and Optics — Measure angles and derive laws"],
["SCI.PHYS.L13.19","Lenses and the Eye","Light and Optics — Measure angles and derive laws"],
["SCI.PHYS.L13.20","Color and the Spectrum","Light and Optics — Measure angles and derive laws"],
["SCI.PHYS.L13.21","Electric Charge","Electricity and Magnetism — Build circuits and calculate"],
["SCI.PHYS.L13.22","Circuits and Ohm’s Law","Electricity and Magnetism — Build circuits and calculate"],
["SCI.PHYS.L13.23","Magnetism","Electricity and Magnetism — Build circuits and calculate"],
["SCI.PHYS.L13.24","Generators and Motors","Electricity and Magnetism — Build circuits and calculate"]];
/* Social Studies K-12 in teaching order (HQ "09 SOCIAL STUDIES SKILL LADDER v3", Levels 1-13 = K-12, 82 skills; same IDs and order as SocialMore.html).
   Placement key is SOC (staff grid); the skill IDs and the boy page use SS. Shape like MATH_K8: [id, name, skill]. */
var SS_K12 = [["SS.COMM.L01.01", "My Family", ""],
["SS.COMM.L01.02", "Helpers in My Community", ""],
["SS.CIV.L01.01", "Rules Keep Us Safe", ""],
["SS.HIST.L01.01", "Long Ago and Today", ""],
["SS.GEO.L01.01", "Maps: A Picture From Above", ""],
["SS.CIV.L01.02", "Our Country: America", ""],
["SS.GEO.L02.01", "North, South, East, West", ""],
["SS.GEO.L02.02", "Map Keys", ""],
["SS.COMM.L02.01", "My Neighborhood and Baltimore", ""],
["SS.HIST.L02.01", "Calendars and Time", ""],
["SS.ECON.L02.01", "Needs and Wants", ""],
["SS.CIV.L02.01", "Good Neighbors", ""],
["SS.GEO.L03.01", "Continents and Oceans", ""],
["SS.GEO.L03.02", "Land and Water", ""],
["SS.GEO.L03.03", "Globe and Map", ""],
["SS.COMM.L03.01", "Jewish Communities Around the World", ""],
["SS.HIST.L03.01", "Timelines", ""],
["SS.ECON.L03.01", "Goods and Services", ""],
["SS.CIV.L03.01", "Leaders in Our Community", ""],
["SS.GEO.L04.01", "Maryland on the Map", ""],
["SS.GEO.L04.02", "Map Scale and Distance", ""],
["SS.HIST.L04.01", "Baltimore's Story", ""],
["SS.JHIST.L04.01", "Jews in Baltimore", ""],
["SS.CIV.L04.01", "Local and State Government", ""],
["SS.HIST.L04.02", "Primary and Secondary Sources", ""],
["SS.GEO.L05.01", "Regions of the United States", ""],
["SS.GEO.L05.02", "Latitude and Longitude", ""],
["SS.HIST.L05.01", "Explorers and 1492", ""],
["SS.HIST.L05.02", "The Thirteen Colonies", ""],
["SS.JHIST.L05.01", "The First Jews in America", ""],
["SS.HIST.L05.03", "Thanksgiving and the Pilgrims", ""],
["SS.HIST.L06.01", "Road to Revolution", ""],
["SS.HIST.L06.02", "The Declaration of Independence", ""],
["SS.JHIST.L06.01", "Haym Salomon and Jews of the Revolution", ""],
["SS.CIV.L06.01", "The Constitution and Three Branches", ""],
["SS.CIV.L06.02", "Bill of Rights and Freedom of Religion", ""],
["SS.JHIST.L06.02", "Rebecca Gratz and Jewish Philadelphia", ""],
["SS.HIST.L06.03", "A Growing Nation and the Civil War", ""],
["SS.GEO.L07.01", "The Middle East and Eretz Yisroel on the Map", ""],
["SS.HIST.L07.01", "Ancient Mitzrayim", ""],
["SS.HIST.L07.02", "Bavel and Persia", ""],
["SS.HIST.L07.03", "Greece and the Chashmonaim", ""],
["SS.HIST.L07.04", "Rome and the Churban", ""],
["SS.JHIST.L07.01", "The Era of the Mishnah and Gemara", ""],
["SS.JHIST.L08.01", "Geonim and Rishonim", ""],
["SS.HIST.L08.01", "The Middle Ages and the Crusades", ""],
["SS.JHIST.L08.02", "Expulsions and Wandering", ""],
["SS.JHIST.L08.03", "Jewish Life in Poland and Lithuania", ""],
["SS.HIST.L08.02", "Coming to America", ""],
["SS.HIST.L08.03", "World War I", ""],
["SS.JHIST.L08.04", "The Holocaust: What Happened", ""],
["SS.HIST.L09.01", "World War II", ""],
["SS.JHIST.L09.01", "The Holocaust: Courage and Rebuilding", ""],
["SS.JHIST.L09.02", "The State of Israel: Facts and Timeline", ""],
["SS.CIV.L09.01", "How a Law Is Made", ""],
["SS.CIV.L09.02", "Citizens and Voting", ""],
["SS.ECON.L09.01", "Supply, Demand and Prices", ""],
["SS.HIST.L09.02", "The Cold War and Soviet Jewry", ""],
["SS.GEO.L10.01", "Climate Zones and Where People Live", ""],
["SS.GEO.L10.02", "Reading Thematic Maps and Graphs", ""],
["SS.HIST.L10.01", "Trade Routes: Silk Road and Spice Trade", ""],
["SS.HIST.L10.02", "The Printing Press Changes the World", ""],
["SS.JHIST.L10.01", "Tzfas and the Ottoman Haven", ""],
["SS.CIV.L10.01", "Kinds of Government", ""],
["SS.HIST.L11.01", "The Industrial Revolution", ""],
["SS.HIST.L11.02", "Revolutions in France and Beyond", ""],
["SS.JHIST.L11.01", "Emancipation and Its Challenges", ""],
["SS.JHIST.L11.02", "The Yeshiva World of Lithuania", ""],
["SS.HIST.L11.03", "Empires and Imperialism", ""],
["SS.HIST.L11.04", "Dictatorships of the 20th Century", ""],
["SS.HIST.L12.01", "Industrial America and Its Cities", ""],
["SS.HIST.L12.02", "The Great Depression and the New Deal", ""],
["SS.HIST.L12.03", "The Civil Rights Movement", ""],
["SS.JHIST.L12.01", "Building Torah in America", ""],
["SS.HIST.L12.04", "America in a Changing World", ""],
["SS.HIST.L12.05", "Writing a Historical Argument", ""],
["SS.CIV.L13.01", "Federalism: Nation and States", ""],
["SS.CIV.L13.02", "Courts and Religious Freedom", ""],
["SS.CIV.L13.03", "Elections and Campaigns", ""],
["SS.ECON.L13.01", "Measuring an Economy", ""],
["SS.ECON.L13.02", "Government and the Economy", ""],
["SS.CIV.L13.04", "The Jewish Community and Public Life", ""]];
/* Core Growth (job T, 2026-11-24): new skills listed in src/CoreData<Job>.js join these ladders here (CoreSkills.js), once. */
function plCore_() { try { if (typeof coreMerge_ === 'function') coreMerge_(); } catch (e) {} }
/* TL-041: one list per subject that has a skill-by-skill path (Math, Reading; Science added SCI-PAGE 2026-11-10). */
function plList_(k) { plCore_(); return k === 'READ' ? READ_K8 : k === 'MATH' ? MATH_K8 : k === 'SCI' ? SCI_K8 : k === 'LANG' ? LANG_K8 : k === 'SOC' ? SS_K12 : (k === 'COMP' || k === 'HEB') ? plIdxList_(k) : null; }
/* HoS 2026-11-20 ("a lot of screens don't go where they're supposed to"): Computing and Lashon Hakodesh have real lessons at every level
   (CurriculumIndex.js), and staff can place a boy in them, but they had no list here, so his map showed the subject with nothing to play
   (it even said CLEARED). Their list is now read from the curriculum index: every lesson of that subject, level by level, in id order. */
var PL_IDX_ = {};
function plIdxList_(k) {
  if (PL_IDX_[k]) return PL_IDX_[k];
  var sk = (typeof CI_INDEX !== 'undefined' && CI_INDEX && CI_INDEX.sk) || {}, out = [];
  Object.keys(sk).forEach(function (id) { if (id.indexOf(k + '.') === 0 && /\.L\d\d\.\d\d$/.test(id)) out.push([id, String((sk[id] || [])[0] || id), '']); });
  out.sort(function (a, b) { return plMathLevel_(a[0]) - plMathLevel_(b[0]) || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); });
  return (PL_IDX_[k] = out);
}
function plFirst_(k, level) { var r = (plList_(k) || []).filter(function (x) { return plMathLevel_(x[0]) === level; })[0]; return r ? r[0] : ''; }
function plPathOf_(k, start) { var ids = (plList_(k) || []).map(function (x) { return x[0]; }), i = ids.indexOf(start); if (i < 0 && start && /\.L\d\d\./.test(start)) i = ids.indexOf(plFirst_(k, plMathLevel_(start))); /* new science map 2026-11-11: a start on a retired rung falls back to the first rung of the same level */ return i < 0 ? [] : ids.slice(i); }
function plFileText_(n) { try { return tlFileText_(n); } catch (e) { return ''; } }   /* v100: packs in Drive (ContentPacks.js) */

function plDoGet_(e) {
  var embed = !!(e && e.parameter && e.parameter.check === '1' && e.parameter.embed === '1');   /* v167: the boy's level check opens INSIDE the boy app (like Spark Path), so it may be framed */
  return tlThemePage_('PlacementPage', 'staff')
    .setTitle('Tashbar Learning · Placement')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(embed ? HtmlService.XFrameOptionsMode.ALLOWALL : HtmlService.XFrameOptionsMode.DEFAULT);
}
function plTab_(k) {
  var ss = msBook_(), name = 'PL_' + k.charAt(0).toUpperCase() + k.slice(1), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, PL.TABS[k].length).setValues([PL.TABS[k]]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function plRows_(k) { var sh = plTab_(k), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, PL.TABS[k].length).getValues(); }
var PL_CACHE_ = null;
function plPlacements_() {
  if (PL_CACHE_) return PL_CACHE_;
  var out = {};
  plRows_('place').forEach(function (r) {
    if (!r[0] || !r[1]) return;
    (out[String(r[0])] = out[String(r[0])] || {})[String(r[1])] = { level: Number(r[2]) || 0, start: String(r[3] || ''), at: r[4] ? new Date(r[4]).getTime() : 0, by: String(r[5] || '') };
  });
  return (PL_CACHE_ = out);
}
function plSubject_(key) { return PL.SUBJECTS.filter(function (s) { return s[0] === key; })[0] || null; }
function plMathLevel_(id) { var m = /\.L(\d\d)\./.exec(String(id)); return m ? Number(m[1]) : 0; }
function plMathFirst_(level) { var r = MATH_K8.filter(function (x) { return plMathLevel_(x[0]) === level; })[0]; return r ? r[0] : ''; }
function plMathPath_(start) { var ids = MATH_K8.map(function (x) { return x[0]; }), i = ids.indexOf(start); return i < 0 ? [] : ids.slice(i); }
function plBand_(level) { return level <= 4 ? 'A' : level <= 6 ? 'B' : level <= 8 ? 'C' : 'D'; }
/* Skills that already have playable lessons, read from the student page itself so this list never drifts. */
function plBuilt_() {
  var c = CacheService.getScriptCache(), hit = c.get('pl_built_v14');
  if (hit) return JSON.parse(hit);
  var html = HtmlService.createHtmlOutputFromFile('QuestPage').getContent() + plFileText_('MathMore') + plFileText_('ReadMore') + plFileText_('ScienceMore') + plFileText_('ScienceMore2') + plFileText_('ElectivesMore') + plFileText_('ComputingMore') + plFileText_('LifeMore') + plFileText_('SocialMore') + plFileText_('OneBiteDataRead') + (typeof coreFiles_ === 'function' ? coreFiles_().filter(function (n) { return CORE_TOOL_FILES.indexOf(n) < 0; }).map(function (n) { return plFileText_(n); }).join('') : '') /* Core Growth data files (CoreSkills.js) */, re = /['"]((?:MATH|READ|WRIT|LANG|VOC|SCI|ELEC|COMP|LIFE|SS)\.[A-Z]+\.L\d\d\.\d\d(?:\.[a-z])?)['"]\s*\]?\s*[:=]\s*\{\s*["']?name["']?\s*:/g, m, out = [];
  while ((m = re.exec(html))) if (out.indexOf(m[1]) < 0) out.push(m[1]);
  ['COMP', 'HEB'].forEach(function (k) { plIdxList_(k).forEach(function (x) { if (out.indexOf(x[0]) < 0) out.push(x[0]); }); });   /* lessons in other packs (KodeshMore for HEB), listed in the curriculum index */
  c.put('pl_built_v14', JSON.stringify(out), 300);
  return out;
}
/* Called by msLoad (MiddleSchool.gs): what this boy's own page follows. */
function plPlanFor_(sid, ranges) {
  var p = plPlacements_()[String(sid)] || {}, r = JSON.parse(JSON.stringify(ranges || {})), out = {};
  if (p.READ && p.READ.level) r.READ = plBand_(p.READ.level);
  if (p.READ && p.READ.level && p.READ.level <= 9) { var rs = p.READ.start || plFirst_('READ', p.READ.level); out.READ = { level: p.READ.level, start: rs, stamp: String(p.READ.at || 0), path: plPathOf_('READ', rs) }; } /* TL-041 */
  if (p.SCI && p.SCI.level && p.SCI.level <= 9) { var ss = p.SCI.start || plFirst_('SCI', p.SCI.level); out.SCI = { level: p.SCI.level, start: ss, stamp: String(p.SCI.at || 0), path: plPathOf_('SCI', ss) }; }
  else if (!p.SCI && p.READ && p.READ.level && p.READ.level <= 9) { var sd = plFirst_('SCI', p.READ.level); out.SCI = { level: p.READ.level, start: sd, stamp: 'r' + String(p.READ.at || 0), path: plPathOf_('SCI', sd) }; } /* SCI-PAGE: Science follows his own Science placement; until staff set one, it starts at his Reading level */
  if (p.SOC && p.SOC.level) out.SS = { level: p.SOC.level, start: p.SOC.start || plFirst_('SOC', p.SOC.level), stamp: 's' + String(p.SOC.at || 0) }; /* SS placement: SocialMore starts his Explorer Trail at this level (no path, so the core quest window is unchanged) */
  if (p.LANG && p.LANG.level) r.WRIT = plBand_(p.LANG.level);
  if (p.LANG && p.LANG.level && p.LANG.level <= 9) { var ls = p.LANG.start || plFirst_('LANG', p.LANG.level); out.WRIT = { level: p.LANG.level, start: ls, stamp: 'w' + String(p.LANG.at || 0), path: plPathOf_('LANG', ls) }; } /* v60: Writing follows his own Language Arts lineup, like Reading */
  if (p.MATH && p.MATH.level) {
    var start = p.MATH.start || plMathFirst_(p.MATH.level);
    r.MATH = plBand_(p.MATH.level);
    out.MATH = { level: p.MATH.level, start: start, stamp: String(p.MATH.at || 0), path: plMathPath_(start) };
  }
  Object.keys(p).forEach(function (k) { if (!out[k]) out[k] = { level: p[k].level }; });
  try { if (typeof pfPlanPatch_ === 'function') pfPlanPatch_(String(sid), p, out); } catch (e) {}   /* PATHFINDER: gap fillers first */
  try { if (typeof pfLcPlanPatch_ === 'function') pfLcPlanPatch_(String(sid), out); } catch (e) {}
  try { if (typeof coreUnitPlanPatch_ === 'function') coreUnitPlanPatch_(String(sid), out); } catch (e) {}   /* CORE GROWTH unit pre-check (CoreChecks.js): skills he showed he knows are skipped */   /* LEVEL CHECK (PathfinderLevel.js): skills he already knows are skipped */
  return { ranges: r, place: out };
}

/* ---- staff calls ---- */
function plStaff_(token) { var s = msSession_(token); if (s.role !== 'staff') throw new Error('Staff only. Sign in with a staff code.'); return s; }
function plRoster_() { return msRoster_().map(function (r) { return { id: r.id, name: r.name }; }).sort(function (a, b) { var ta = /^TEST-/.test(a.id) ? 1 : 0, tb = /^TEST-/.test(b.id) ? 1 : 0; return ta - tb || a.name.localeCompare(b.name); }); } /* test student TEST-01 listed last */
function plGroups_() { return plRows_('groups').filter(function (r) { return r[0]; }).map(function (r) { var m = []; try { m = JSON.parse(r[2] || '[]'); } catch (e) {} return { id: String(r[0]), name: String(r[1]), members: m }; }); }
function plChecks_() { var out = {}; plRows_('checks').forEach(function (r) { if (r[1]) out[String(r[1]) + '|' + r[2]] = { at: new Date(r[0]).getTime(), level: Number(r[3]) }; }); return out; }
function plMastered_() {
  var out = {};
  msRows_('state').forEach(function (r) { try { var s = JSON.parse(r[1]); out[String(r[0])] = Object.keys(s.skills || {}).filter(function (k) { return s.skills[k] && s.skills[k].m; }); } catch (e) {} });
  return out;
}
function plLoad(token) {
  plStaff_(token); plCore_();
  return { version: PL.VERSION, subjects: PL.SUBJECTS, worlds: PL.WORLDS, math: MATH_K8, read: READ_K8, sci: SCI_K8, lang: LANG_K8, built: plBuilt_(), students: plRoster_(), place: plPlacements_(), groups: plGroups_(), checks: plChecks_(), mastered: plMastered_() };
}
function plLocked_(fn) { var l = LockService.getScriptLock(); l.waitLock(20000); try { PL_CACHE_ = null; return fn(); } finally { PL_CACHE_ = null; l.releaseLock(); } }
function plFind_(sh, matchFn) { var n = sh.getLastRow(); if (n < 2) return []; var v = sh.getRange(2, 1, n - 1, 2).getValues(), rows = []; for (var i = 0; i < v.length; i++) if (matchFn(v[i])) rows.push(i + 2); return rows; }
function plUpsert_(sid, subject, level, start, by) {
  var sh = plTab_('place'), rows = plFind_(sh, function (k) { return String(k[0]) === sid && String(k[1]) === subject; }), vals = [sid, subject, level, start || '', new Date(), by];
  if (!rows.length) sh.appendRow(vals); else sh.getRange(rows[0], 1, 1, 6).setValues([vals]);
}
function plRemove_(sid, subject) { var sh = plTab_('place'); plFind_(sh, function (k) { return String(k[0]) === sid && String(k[1]) === subject; }).reverse().forEach(function (r) { sh.deleteRow(r); }); }
/* Place one boy or many (a group) on a level. level 0 clears. start = exact Math skill to begin at (optional). */
function plPlace(token, ids, subject, level, start) {
  plStaff_(token);
  subject = String(subject); var subj = plSubject_(subject); if (!subj) throw new Error('Unknown subject.');
  level = Math.round(Number(level)) || 0; start = String(start || '');
  if (level && (level < subj[2] || level > subj[3])) throw new Error(subj[1] + ' runs from Level ' + subj[2] + ' to Level ' + subj[3] + '.');
  if (start && (!plList_(subject) || plMathLevel_(start) !== level || !plList_(subject).some(function (x) { return x[0] === start; }))) throw new Error('That starting skill is not on this level.');
  var known = plRoster_().map(function (r) { return r.id; });
  ids = (ids || []).map(String).filter(function (id) { return known.indexOf(id) >= 0; });
  if (!ids.length) throw new Error('Pick at least one student.');
  return plLocked_(function () {
    ids.forEach(function (id) { if (level) plUpsert_(id, subject, level, start, 'staff'); else plRemove_(id, subject); });
    return plPlacements_();
  });
}
function plSaveGroup(token, g) {
  plStaff_(token);
  var name = String((g && g.name) || '').trim().slice(0, 40); if (!name) throw new Error('Give the group a name.');
  var known = plRoster_().map(function (r) { return r.id; }), members = ((g && g.members) || []).map(String).filter(function (id) { return known.indexOf(id) >= 0; });
  var id = String((g && g.id) || '') || 'G-' + Utilities.getUuid().slice(0, 8);
  return plLocked_(function () {
    var sh = plTab_('groups'), rows = plFind_(sh, function (k) { return String(k[0]) === id; }), vals = [id, name, JSON.stringify(members), new Date(), 'staff'];
    if (!rows.length) sh.appendRow(vals); else sh.getRange(rows[0], 1, 1, 5).setValues([vals]);
    return plGroups_();
  });
}
function plDeleteGroup(token, id) {
  plStaff_(token);
  return plLocked_(function () { var sh = plTab_('groups'); plFind_(sh, function (k) { return String(k[0]) === String(id); }).reverse().forEach(function (r) { sh.deleteRow(r); }); return plGroups_(); });
}

/* ---- a boy's placement check ---- */
function plKid_(token) { var s = msSession_(token); if (s.role !== 'kid') throw new Error('Sign in with your own code.'); return s; }
function plCheckSubj_(subject) { return subject === 'READ' ? 'READ' : (subject === 'SOC' || subject === 'SS') ? 'SOC' : 'MATH'; }
function plCheckHello(token, subject) {
  var k = plCheckSubj_(subject), s = plKid_(token), r = msRoster_().filter(function (x) { return x.id === s.sid; })[0], p = plPlacements_()[s.sid] || {};
  return { name: r ? r.name : '', placed: !!(p[k] && p[k].level), by: p[k] ? p[k].by : '', subject: k };
}
/* Saves the check. It sets his Math level unless a teacher already placed him by hand (the teacher's choice wins). */
function plCheckSave(token, subject, level, detail) {
  var s = plKid_(token);
  if (subject === 'SS') subject = 'SOC';
  if (subject !== 'MATH' && subject !== 'READ' && subject !== 'SOC') throw new Error('Only the math, reading and social studies checks are ready.');
  level = Math.max(1, Math.min(subject === 'SOC' ? 13 : 9, Math.round(Number(level)) || 1));
  var d = JSON.stringify(detail || []).slice(0, 4000);
  return plLocked_(function () {
    plTab_('checks').appendRow([new Date(), s.sid, subject, level, d]);
    var p = plPlacements_()[s.sid] || {}, applied = !(p[subject] && p[subject].by === 'staff');
    if (applied) plUpsert_(s.sid, subject, level, plFirst_(subject, level), 'check');
    return { level: level, world: subject === 'MATH' ? (PL.WORLDS[level] || '') : subject === 'SOC' ? 'Explorer Trail' : 'Story Road', applied: applied };
  });
}

/* Run from the editor to check the wiring. Only creates the three PL_ tabs if they are missing. */
function plSelfTest() {
  var ids = MATH_K8.map(function (x) { return x[0]; }), dup = ids.filter(function (x, i) { return ids.indexOf(x) !== i; });
  var lv = ids.map(plMathLevel_), sorted = lv.every(function (x, i) { return !i || x >= lv[i - 1]; });
  var built = plBuilt_().filter(function (x) { return x.indexOf('MATH.') === 0; });
  var rids = READ_K8.map(function (x) { return x[0]; }), rlv = rids.map(plMathLevel_), rbuilt = plBuilt_().filter(function (x) { return x.indexOf('READ.') === 0; });
  Logger.log(JSON.stringify({ rungs: ids.length, duplicates: dup, inLevelOrder: sorted, mathBuilt: built.length, notOnMap: built.filter(function (x) { return ids.indexOf(x) < 0; }), readRungs: rids.length, readDuplicates: rids.filter(function (x, i) { return rids.indexOf(x) !== i; }), readInLevelOrder: rlv.every(function (x, i) { return !i || x >= rlv[i - 1]; }), readPerLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (l) { return rlv.filter(function (x) { return x === l; }).length; }), readBuilt: rbuilt.length, readNotOnMap: rbuilt.filter(function (x) { return rids.indexOf(x) < 0; }), sciRungs: SCI_K8.length, sciDuplicates: SCI_K8.map(function (x) { return x[0]; }).filter(function (x, i, a) { return a.indexOf(x) !== i; }), sciInLevelOrder: SCI_K8.map(function (x) { return plMathLevel_(x[0]); }).every(function (x, i, a) { return !i || x >= a[i - 1]; }), sciBuilt: plBuilt_().filter(function (x) { return x.indexOf('SCI.') === 0; }).length, sciNotOnMap: plBuilt_().filter(function (x) { return x.indexOf('SCI.') === 0 && !SCI_K8.some(function (r) { return r[0] === x; }); }), socRungs: SS_K12.length, socDuplicates: SS_K12.map(function (x) { return x[0]; }).filter(function (x, i, a) { return a.indexOf(x) !== i; }), socInLevelOrder: SS_K12.map(function (x) { return plMathLevel_(x[0]); }).every(function (x, i, a) { return !i || x >= a[i - 1]; }), socBuilt: plBuilt_().filter(function (x) { return x.indexOf('SS.') === 0; }).length, socNotOnMap: plBuilt_().filter(function (x) { return x.indexOf('SS.') === 0 && !SS_K12.some(function (r) { return r[0] === x; }); }), tabs: Object.keys(PL.TABS).map(function (k) { return plTab_(k).getName(); }) }));
}

/* Editor helper for the TEST student only (TEST-01, Head of School 2026-11-08). Sets his Math level so a tester can play that level. Change lvl, run, log it in HQ. */
function plPlaceTestStudent() { var lvl = 4; return plLocked_(function () { plUpsert_('TEST-01', 'MATH', lvl, '', 'test'); Logger.log('TEST-01 placed at Math Level ' + lvl); return lvl; }); }
plCore_();   /* Core Growth: on the server every src/*.js runs in name order, so the CoreData<Job>.js lists and CoreSkills.js are already loaded here */
