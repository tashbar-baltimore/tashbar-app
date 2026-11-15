/* PATHFINDER Computing, Life and Money, What helps me, About me (PF-X1, LOG CHANGE 2215).
   PF_X: typing passages, 32 Computing + 32 Life and Money questions, 18 What-helps-me sequences, 5 About me screens, mistake codes.
   Built by script from the HQ JSON files (07 PATHFINDER BUILD PROMPT v5, local build 2026-11-12). Do not edit by hand: rebuild.
   Each file is embedded exactly as published (between the <KEY> marker comments), so its sha256 matches the LOG CHANGE.
   Every record is Draft until reviewers mark it Approved. */
/*<X1>*/var PF_X = {
 "bank": "PF-X1_Pathfinder_Computing_Money_WHM_AboutMe_DRAFT",
 "made": "2026-11-11",
 "by": "CLAUDE (developer@)",
 "status": "Draft",
 "codes": {
  "DEVICE-PART": "confused parts of the device",
  "SAFETY-SHARE": "would share private information",
  "SAFETY-CLICK": "would click an unknown link or pop-up",
  "HW-SW": "confused hardware and software",
  "FILE-ORG": "weak file organization",
  "CODE-ORDER": "steps in the wrong order",
  "NET-MYTH": "wrong idea of how the internet works",
  "TOOL-WRONG": "picked the wrong tool or button",
  "PASSWORD-WEAK": "chose a weak or guessable password",
  "CODE-COND": "misread an if-then condition",
  "SOURCE-TRUST": "trusted an unreliable source",
  "CODE-LIST": "misunderstood how a list changes",
  "SHEET-CELL": "misread a spreadsheet cell address",
  "SHEET-FORMULA": "misread a spreadsheet formula",
  "FOOTPRINT-PERM": "thinks posts can be fully erased",
  "CODE-LOOP": "miscounted a loop",
  "SECURITY-MYTH": "wrong idea of encryption or https",
  "CODE-FUNC": "misread a function",
  "CODE-SEARCH": "chose a slow search method",
  "AI-MYTH": "wrong idea of how AI works or how far to trust it",
  "CODE-DEBUG": "weak debugging or testing idea",
  "COIN-VALUE": "wrong coin or bill value",
  "CHANGE-ADD": "added instead of subtracting to make change",
  "CHANGE-WRONG": "subtraction error in making change",
  "BUDGET-PART": "left out or mixed up a part of the budget",
  "UNIT-PRICE": "did not compare price per unit",
  "PERCENT-ERR": "percent calculation error",
  "AD-PRESSURE": "fooled by an advertising trick",
  "PAY-CALC": "pay calculation error",
  "SCAM-TRUST": "would trust a scam message",
  "INTEREST-IGNORED": "forgot that debt grows with interest",
  "INVEST-MYTH": "wrong idea of investing",
  "INSURE-MYTH": "wrong idea of insurance",
  "PROFIT-REVENUE": "confused profit with money taken in",
  "CREDIT-MYTH": "wrong idea of credit scores",
  "INTEREST-SIMPLE": "used simple instead of compound interest",
  "BANK-MYTH": "confused debit and credit",
  "BLEND-PART": "kept only part of the sounds",
  "BLEND-FIRST": "changed the first sound",
  "BLEND-ORDER": "sounds in the wrong order",
  "SILENT-E": "ignored the silent e",
  "VOWEL-WRONG": "wrong vowel",
  "SYLL-SPLIT": "split the syllables in the wrong place",
  "CONTEXT-IGNORED": "ignored the context clue",
  "CONTEXT-PARTIAL": "used only part of the clue",
  "CONTEXT-REVERSED": "missed a contrast clue and chose the opposite",
  "WORD-ASSOC": "picked a word linked by association",
  "TOO-NARROW": "picked one detail instead of the main idea",
  "DETAIL-WRONG": "detail not in the text",
  "INFER-TOO-FAR": "inference goes beyond the clues",
  "INFER-LITERAL": "restated a fact instead of inferring",
  "INFER-WRONG": "inference contradicts the clues",
  "EVIDENCE-TOPIC": "on topic but does not prove the claim",
  "EVIDENCE-WEAK": "related but weak support",
  "REASON-IRRELEVANT": "reason does not connect to the claim",
  "SUMMARY-OPINION": "an opinion, not support"
 },
 "typing": {
  "2-3": {
   "A": "The dog ran to the park. He saw a red ball. He ran and got it. Then he ran back home to his bed.",
   "B": "We went to the farm. We saw a cow and a big red barn full of hay. We fed the hens and got six eggs."
  },
  "4-5": {
   "A": "Every morning, the boys meet at the corner and walk to school together. They talk about baseball, homework and the weekend. When the bell rings, they hurry inside.",
   "B": "Our class planted a garden behind the school. We watered the seeds every day and pulled the weeds. By June, we had tomatoes, beans and tall yellow sunflowers."
  },
  "6-8": {
   "A": "Scientists study volcanoes to warn people before dangerous eruptions. They measure small earthquakes, changes in the shape of the ground, and gases escaping from vents. Careful monitoring has saved thousands of lives.",
   "B": "The printing press changed the world by making books cheaper and more common. As more people learned to read, ideas spread faster than ever before, and knowledge that might have been lost was preserved."
  }
 },
 "computing": [
  {
   "item_id": "PF.CS.COMP.DIG.L02.01.A.1",
   "skill_id": "COMP.DIG.L02.01",
   "level": 2,
   "form": "A",
   "stem": "Which part of the Chromebook do you type on?",
   "answer": "the keyboard",
   "wrong": [
    {
     "answer": "the screen",
     "code": "DEVICE-PART"
    },
    {
     "answer": "the charger",
     "code": "DEVICE-PART"
    },
    {
     "answer": "the camera",
     "code": "DEVICE-PART"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L02.03.A.2",
   "skill_id": "COMP.DIG.L02.03",
   "level": 2,
   "form": "A",
   "stem": "A boy you don't know online asks for your password. What do you do?",
   "answer": "Say no and tell a grown-up",
   "wrong": [
    {
     "answer": "Tell him, if he seems nice",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Tell him only half of it",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Type it in the chat box",
     "code": "SAFETY-SHARE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L02.01.B.1",
   "skill_id": "COMP.DIG.L02.01",
   "level": 2,
   "form": "B",
   "stem": "Which part of the Chromebook shows the pictures and words?",
   "answer": "the screen",
   "wrong": [
    {
     "answer": "the keyboard",
     "code": "DEVICE-PART"
    },
    {
     "answer": "the touchpad",
     "code": "DEVICE-PART"
    },
    {
     "answer": "the charger cord",
     "code": "DEVICE-PART"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L02.03.B.2",
   "skill_id": "COMP.DIG.L02.03",
   "level": 2,
   "form": "B",
   "stem": "Your friend asks to use your password \"just once.\" What is best?",
   "answer": "Keep it private; he should use his own",
   "wrong": [
    {
     "answer": "Tell him, since he is your friend",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Write it on his hand for him",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Tell the whole class so it is fair",
     "code": "SAFETY-SHARE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L03.04.A.1",
   "skill_id": "COMP.DIG.L03.04",
   "level": 3,
   "form": "A",
   "stem": "A box pops up: \"You won a prize! Click here!\" What should you do?",
   "answer": "Close it or ask a grown-up first",
   "wrong": [
    {
     "answer": "Click it quickly before it goes away",
     "code": "SAFETY-CLICK"
    },
    {
     "answer": "Type your name and address to claim it",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Send it to all your friends",
     "code": "SAFETY-CLICK"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L03.02.A.2",
   "skill_id": "COMP.DIG.L03.02",
   "level": 3,
   "form": "A",
   "stem": "Which one is software?",
   "answer": "a typing game app",
   "wrong": [
    {
     "answer": "the mouse",
     "code": "HW-SW"
    },
    {
     "answer": "the keyboard",
     "code": "HW-SW"
    },
    {
     "answer": "the headphones",
     "code": "HW-SW"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L03.04.B.1",
   "skill_id": "COMP.DIG.L03.04",
   "level": 3,
   "form": "B",
   "stem": "An email from someone you don't know has a link. What is the safe choice?",
   "answer": "Don't click; ask a grown-up",
   "wrong": [
    {
     "answer": "Click to see who sent it",
     "code": "SAFETY-CLICK"
    },
    {
     "answer": "Reply and ask who they are",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Forward it to a friend to check",
     "code": "SAFETY-CLICK"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L03.01.B.2",
   "skill_id": "COMP.DIG.L03.01",
   "level": 3,
   "form": "B",
   "stem": "Where is the best place to keep all your science work?",
   "answer": "in one folder named Science",
   "wrong": [
    {
     "answer": "on the desktop with everything else",
     "code": "FILE-ORG"
    },
    {
     "answer": "in a folder named Stuff",
     "code": "FILE-ORG"
    },
    {
     "answer": "in the trash, to save space",
     "code": "FILE-ORG"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L04.01.A.1",
   "skill_id": "COMP.PROG.L04.01",
   "level": 4,
   "form": "A",
   "stem": "To get ready for school, which step comes FIRST?",
   "answer": "Wake up",
   "wrong": [
    {
     "answer": "Put on your coat",
     "code": "CODE-ORDER"
    },
    {
     "answer": "Walk to the bus stop",
     "code": "CODE-ORDER"
    },
    {
     "answer": "Eat breakfast at the table",
     "code": "CODE-ORDER"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L04.03.A.2",
   "skill_id": "COMP.DIG.L04.03",
   "level": 4,
   "form": "A",
   "stem": "When you send an email, how does it reach your friend?",
   "answer": "It travels through the internet to his account",
   "wrong": [
    {
     "answer": "It goes inside the wire to his house only",
     "code": "NET-MYTH"
    },
    {
     "answer": "It is printed and mailed by the post office",
     "code": "NET-MYTH"
    },
    {
     "answer": "It stays on your computer until he visits",
     "code": "NET-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L04.01.B.1",
   "skill_id": "COMP.PROG.L04.01",
   "level": 4,
   "form": "B",
   "stem": "A robot must make a sandwich. Which step must come BEFORE \"spread the peanut butter\"?",
   "answer": "Open the jar",
   "wrong": [
    {
     "answer": "Eat the sandwich",
     "code": "CODE-ORDER"
    },
    {
     "answer": "Put the bread together",
     "code": "CODE-ORDER"
    },
    {
     "answer": "Wash the knife",
     "code": "CODE-ORDER"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L04.01.B.2",
   "skill_id": "COMP.DIG.L04.01",
   "level": 4,
   "form": "B",
   "stem": "In a document, which button makes words thick and dark?",
   "answer": "Bold (B)",
   "wrong": [
    {
     "answer": "Italic (I)",
     "code": "TOOL-WRONG"
    },
    {
     "answer": "Underline (U)",
     "code": "TOOL-WRONG"
    },
    {
     "answer": "Undo (the curved arrow)",
     "code": "TOOL-WRONG"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L05.03.A.1",
   "skill_id": "COMP.DIG.L05.03",
   "level": 5,
   "form": "A",
   "stem": "Which is the strongest password?",
   "answer": "Blue!Tiger7Pancake",
   "wrong": [
    {
     "answer": "password123",
     "code": "PASSWORD-WEAK"
    },
    {
     "answer": "YossiCohen",
     "code": "PASSWORD-WEAK"
    },
    {
     "answer": "12345678",
     "code": "PASSWORD-WEAK"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L05.01.A.2",
   "skill_id": "COMP.PROG.L05.01",
   "level": 5,
   "form": "A",
   "stem": "Code: IF it is raining THEN take an umbrella. It is sunny. What happens?",
   "answer": "No umbrella is taken",
   "wrong": [
    {
     "answer": "An umbrella is taken anyway",
     "code": "CODE-COND"
    },
    {
     "answer": "The code stops working",
     "code": "CODE-COND"
    },
    {
     "answer": "It starts to rain",
     "code": "CODE-COND"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L05.03.B.1",
   "skill_id": "COMP.DIG.L05.03",
   "level": 5,
   "form": "B",
   "stem": "Which is the strongest password?",
   "answer": "Rocket$Maple92Lake",
   "wrong": [
    {
     "answer": "qwerty",
     "code": "PASSWORD-WEAK"
    },
    {
     "answer": "ilovepizza",
     "code": "PASSWORD-WEAK"
    },
    {
     "answer": "MyName2015",
     "code": "PASSWORD-WEAK"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L05.01.B.2",
   "skill_id": "COMP.PROG.L05.01",
   "level": 5,
   "form": "B",
   "stem": "Code: IF score > 10 THEN say \"You win!\" The score is 8. What happens?",
   "answer": "Nothing is said",
   "wrong": [
    {
     "answer": "\"You win!\" is said",
     "code": "CODE-COND"
    },
    {
     "answer": "The score becomes 10",
     "code": "CODE-COND"
    },
    {
     "answer": "The game says \"You lose!\"",
     "code": "CODE-COND"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L06.02.A.1",
   "skill_id": "COMP.DIG.L06.02",
   "level": 6,
   "form": "A",
   "stem": "Which source is most trustworthy for a report on volcanoes?",
   "answer": "A science museum's website",
   "wrong": [
    {
     "answer": "A post by a stranger with no name",
     "code": "SOURCE-TRUST"
    },
    {
     "answer": "An ad for volcano-shaped toys",
     "code": "SOURCE-TRUST"
    },
    {
     "answer": "A video titled \"SHOCKING volcano secrets!!\"",
     "code": "SOURCE-TRUST"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L06.02.A.2",
   "skill_id": "COMP.PROG.L06.02",
   "level": 6,
   "form": "A",
   "stem": "A list holds [5, 8, 2]. You add 6 to the end. What is the list now?",
   "answer": "[5, 8, 2, 6]",
   "wrong": [
    {
     "answer": "[6, 5, 8, 2]",
     "code": "CODE-LIST"
    },
    {
     "answer": "[5, 8, 2]",
     "code": "CODE-LIST"
    },
    {
     "answer": "[5, 8, 8]",
     "code": "CODE-LIST"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L06.02.B.1",
   "skill_id": "COMP.DIG.L06.02",
   "level": 6,
   "form": "B",
   "stem": "Two websites disagree about a fact. What is the best next step?",
   "answer": "Check a third reliable source",
   "wrong": [
    {
     "answer": "Trust the one with more pictures",
     "code": "SOURCE-TRUST"
    },
    {
     "answer": "Pick the one you saw first",
     "code": "SOURCE-TRUST"
    },
    {
     "answer": "Believe the one with more exclamation points",
     "code": "SOURCE-TRUST"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L06.01.B.2",
   "skill_id": "COMP.DIG.L06.01",
   "level": 6,
   "form": "B",
   "stem": "In a spreadsheet, what is cell B3?",
   "answer": "Column B, row 3",
   "wrong": [
    {
     "answer": "Row B, column 3",
     "code": "SHEET-CELL"
    },
    {
     "answer": "The third sheet",
     "code": "SHEET-CELL"
    },
    {
     "answer": "The sum of B and 3",
     "code": "SHEET-CELL"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L07.03.A.1",
   "skill_id": "COMP.DIG.L07.03",
   "level": 7,
   "form": "A",
   "stem": "You post a photo, then delete it an hour later. What is true?",
   "answer": "Someone may already have saved or shared it",
   "wrong": [
    {
     "answer": "It is gone forever from everywhere",
     "code": "FOOTPRINT-PERM"
    },
    {
     "answer": "Only your friends ever saw it",
     "code": "FOOTPRINT-PERM"
    },
    {
     "answer": "Deleting it also removes all copies",
     "code": "FOOTPRINT-PERM"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L07.01.A.2",
   "skill_id": "COMP.DIG.L07.01",
   "level": 7,
   "form": "A",
   "stem": "Cells A1 = 4 and A2 = 6. What does =A1*A2 show?",
   "answer": "24",
   "wrong": [
    {
     "answer": "10",
     "code": "SHEET-FORMULA"
    },
    {
     "answer": "46",
     "code": "SHEET-FORMULA"
    },
    {
     "answer": "A1*A2",
     "code": "SHEET-FORMULA"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L07.03.B.1",
   "skill_id": "COMP.DIG.L07.03",
   "level": 7,
   "form": "B",
   "stem": "Which is the safest thing to put in a public profile?",
   "answer": "Your favorite sport",
   "wrong": [
    {
     "answer": "Your home address",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Your school schedule",
     "code": "SAFETY-SHARE"
    },
    {
     "answer": "Your phone number",
     "code": "SAFETY-SHARE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L07.02.B.2",
   "skill_id": "COMP.PROG.L07.02",
   "level": 7,
   "form": "B",
   "stem": "for i in range(3): print(\"Hi\")  How many times is \"Hi\" printed?",
   "answer": "3",
   "wrong": [
    {
     "answer": "2",
     "code": "CODE-LOOP"
    },
    {
     "answer": "4",
     "code": "CODE-LOOP"
    },
    {
     "answer": "1",
     "code": "CODE-LOOP"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L08.03.A.1",
   "skill_id": "COMP.DIG.L08.03",
   "level": 8,
   "form": "A",
   "stem": "What does encryption do to a message?",
   "answer": "Scrambles it so only someone with the key can read it",
   "wrong": [
    {
     "answer": "Makes it travel faster",
     "code": "SECURITY-MYTH"
    },
    {
     "answer": "Deletes it after reading",
     "code": "SECURITY-MYTH"
    },
    {
     "answer": "Translates it into another language",
     "code": "SECURITY-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L08.01.A.2",
   "skill_id": "COMP.PROG.L08.01",
   "level": 8,
   "form": "A",
   "stem": "def double(n): return n * 2   What is double(7)?",
   "answer": "14",
   "wrong": [
    {
     "answer": "9",
     "code": "CODE-FUNC"
    },
    {
     "answer": "7",
     "code": "CODE-FUNC"
    },
    {
     "answer": "72",
     "code": "CODE-FUNC"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L08.03.B.1",
   "skill_id": "COMP.DIG.L08.03",
   "level": 8,
   "form": "B",
   "stem": "A website address starts with https. What does the \"s\" tell you?",
   "answer": "The connection is encrypted",
   "wrong": [
    {
     "answer": "The site is safe to trust completely",
     "code": "SECURITY-MYTH"
    },
    {
     "answer": "The site is a school site",
     "code": "SECURITY-MYTH"
    },
    {
     "answer": "The site is very small",
     "code": "SECURITY-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L08.02.B.2",
   "skill_id": "COMP.PROG.L08.02",
   "level": 8,
   "form": "B",
   "stem": "You need to find a name in a sorted list of 1,000 names fast. What is best?",
   "answer": "Start in the middle and halve the list each time",
   "wrong": [
    {
     "answer": "Check every name from the start",
     "code": "CODE-SEARCH"
    },
    {
     "answer": "Pick names at random until you find it",
     "code": "CODE-SEARCH"
    },
    {
     "answer": "Sort the list again first",
     "code": "CODE-SEARCH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L09.02.A.1",
   "skill_id": "COMP.DIG.L09.02",
   "level": 9,
   "form": "A",
   "stem": "An AI chatbot gives you a fact for your report. What should you do?",
   "answer": "Check it in a reliable source before using it",
   "wrong": [
    {
     "answer": "Use it; AI is always right",
     "code": "AI-MYTH"
    },
    {
     "answer": "Use it if it sounds confident",
     "code": "AI-MYTH"
    },
    {
     "answer": "Ask the chatbot if it is sure",
     "code": "AI-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L09.01.A.2",
   "skill_id": "COMP.PROG.L09.01",
   "level": 9,
   "form": "A",
   "stem": "A program should add 1 to 5 but prints 15. What is the most likely bug?",
   "answer": "It joined text \"1\" and \"5\" instead of adding numbers",
   "wrong": [
    {
     "answer": "The computer cannot add",
     "code": "CODE-DEBUG"
    },
    {
     "answer": "5 + 1 really is 15",
     "code": "CODE-DEBUG"
    },
    {
     "answer": "The screen is broken",
     "code": "CODE-DEBUG"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.DIG.L09.02.B.1",
   "skill_id": "COMP.DIG.L09.02",
   "level": 9,
   "form": "B",
   "stem": "How does an AI language tool mostly learn to write?",
   "answer": "From patterns in huge amounts of text",
   "wrong": [
    {
     "answer": "By thinking and feeling like a person",
     "code": "AI-MYTH"
    },
    {
     "answer": "By reading only one book many times",
     "code": "AI-MYTH"
    },
    {
     "answer": "From a person typing every answer in advance",
     "code": "AI-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.CS.COMP.PROG.L09.01.B.2",
   "skill_id": "COMP.PROG.L09.01",
   "level": 9,
   "form": "B",
   "stem": "A test checks a function with only one input. Why is that weak?",
   "answer": "Other inputs might still give wrong answers",
   "wrong": [
    {
     "answer": "One test always proves it works",
     "code": "CODE-DEBUG"
    },
    {
     "answer": "Tests slow the program down",
     "code": "CODE-DEBUG"
    },
    {
     "answer": "Functions do not need tests",
     "code": "CODE-DEBUG"
    }
   ],
   "status": "Draft"
  }
 ],
 "money": [
  {
   "item_id": "PF.LM.MATH.MEAS.L02.03.A.1",
   "skill_id": "MATH.MEAS.L02.03",
   "level": 2,
   "form": "A",
   "stem": "How much is 1 quarter and 2 dimes?",
   "answer": "45¢",
   "typed": true,
   "wrong": [
    {
     "answer": "3¢",
     "code": "COIN-VALUE"
    },
    {
     "answer": "35¢",
     "code": "COIN-VALUE"
    },
    {
     "answer": "27¢",
     "code": "COIN-VALUE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.MATH.MEAS.L02.03.A.2",
   "skill_id": "MATH.MEAS.L02.03",
   "level": 2,
   "form": "A",
   "stem": "Which coin is worth 5 cents?",
   "answer": "nickel",
   "typed": false,
   "wrong": [
    {
     "answer": "dime",
     "code": "COIN-VALUE"
    },
    {
     "answer": "penny",
     "code": "COIN-VALUE"
    },
    {
     "answer": "quarter",
     "code": "COIN-VALUE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.MATH.MEAS.L02.03.B.1",
   "skill_id": "MATH.MEAS.L02.03",
   "level": 2,
   "form": "B",
   "stem": "How much is 3 dimes and 1 nickel?",
   "answer": "35¢",
   "typed": true,
   "wrong": [
    {
     "answer": "4¢",
     "code": "COIN-VALUE"
    },
    {
     "answer": "31¢",
     "code": "COIN-VALUE"
    },
    {
     "answer": "40¢",
     "code": "COIN-VALUE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.MATH.MEAS.L02.03.B.2",
   "skill_id": "MATH.MEAS.L02.03",
   "level": 2,
   "form": "B",
   "stem": "Which coin is worth 10 cents?",
   "answer": "dime",
   "typed": false,
   "wrong": [
    {
     "answer": "nickel",
     "code": "COIN-VALUE"
    },
    {
     "answer": "quarter",
     "code": "COIN-VALUE"
    },
    {
     "answer": "penny",
     "code": "COIN-VALUE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.MATH.MEAS.L03.04.A.1",
   "skill_id": "MATH.MEAS.L03.04",
   "level": 3,
   "form": "A",
   "stem": "A pencil costs 60¢. You pay with $1.00. How much change?",
   "answer": "40¢",
   "typed": true,
   "wrong": [
    {
     "answer": "$1.60",
     "code": "CHANGE-ADD"
    },
    {
     "answer": "60¢",
     "code": "CHANGE-WRONG"
    },
    {
     "answer": "50¢",
     "code": "CHANGE-WRONG"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.MATH.MEAS.L03.04.A.2",
   "skill_id": "MATH.MEAS.L03.04",
   "level": 3,
   "form": "A",
   "stem": "You have a $1 bill, 2 quarters and 1 dime. How much in all?",
   "answer": "$1.60",
   "typed": true,
   "wrong": [
    {
     "answer": "$1.35",
     "code": "COIN-VALUE"
    },
    {
     "answer": "$4.00",
     "code": "COIN-VALUE"
    },
    {
     "answer": "$1.52",
     "code": "COIN-VALUE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.MATH.MEAS.L03.04.B.1",
   "skill_id": "MATH.MEAS.L03.04",
   "level": 3,
   "form": "B",
   "stem": "A ball costs 75¢. You pay with $1.00. How much change?",
   "answer": "25¢",
   "typed": true,
   "wrong": [
    {
     "answer": "$1.75",
     "code": "CHANGE-ADD"
    },
    {
     "answer": "75¢",
     "code": "CHANGE-WRONG"
    },
    {
     "answer": "35¢",
     "code": "CHANGE-WRONG"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.MATH.MEAS.L03.04.B.2",
   "skill_id": "MATH.MEAS.L03.04",
   "level": 3,
   "form": "B",
   "stem": "You have two $1 bills, 1 quarter and 3 pennies. How much in all?",
   "answer": "$2.28",
   "typed": true,
   "wrong": [
    {
     "answer": "$2.53",
     "code": "COIN-VALUE"
    },
    {
     "answer": "$6.00",
     "code": "COIN-VALUE"
    },
    {
     "answer": "$2.31",
     "code": "COIN-VALUE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L04.02.A.1",
   "skill_id": "LIFE.FIN.L04.02",
   "level": 4,
   "form": "A",
   "stem": "A sefer costs $8.35. You pay with a $10 bill. How much change?",
   "answer": "$1.65",
   "typed": true,
   "wrong": [
    {
     "answer": "$2.65",
     "code": "CHANGE-WRONG"
    },
    {
     "answer": "$18.35",
     "code": "CHANGE-ADD"
    },
    {
     "answer": "$1.75",
     "code": "CHANGE-WRONG"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.BUD.L04.01.A.2",
   "skill_id": "LIFE.BUD.L04.01",
   "level": 4,
   "form": "A",
   "stem": "You earn 20 T$. You plan to spend half, save some and give 2 T$ to tzedakah. How much do you save?",
   "answer": "8 T$",
   "typed": true,
   "wrong": [
    {
     "answer": "10 T$",
     "code": "BUDGET-PART"
    },
    {
     "answer": "18 T$",
     "code": "BUDGET-PART"
    },
    {
     "answer": "12 T$",
     "code": "BUDGET-PART"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L04.02.B.1",
   "skill_id": "LIFE.FIN.L04.02",
   "level": 4,
   "form": "B",
   "stem": "A game costs $6.40. You pay with a $10 bill. How much change?",
   "answer": "$3.60",
   "typed": true,
   "wrong": [
    {
     "answer": "$4.60",
     "code": "CHANGE-WRONG"
    },
    {
     "answer": "$16.40",
     "code": "CHANGE-ADD"
    },
    {
     "answer": "$3.40",
     "code": "CHANGE-WRONG"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.BUD.L04.02.B.2",
   "skill_id": "LIFE.BUD.L04.02",
   "level": 4,
   "form": "B",
   "stem": "You want a $24 kite. You save $4 each week. How many weeks will it take?",
   "answer": "6 weeks",
   "typed": true,
   "wrong": [
    {
     "answer": "20 weeks",
     "code": "BUDGET-PART"
    },
    {
     "answer": "28 weeks",
     "code": "BUDGET-PART"
    },
    {
     "answer": "4 weeks",
     "code": "BUDGET-PART"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L05.01.A.1",
   "skill_id": "LIFE.FIN.L05.01",
   "level": 5,
   "form": "A",
   "stem": "Which is the better deal for cereal?",
   "answer": "$4.80 for 24 oz (20¢ an ounce)",
   "typed": false,
   "wrong": [
    {
     "answer": "$3.00 for 12 oz (25¢ an ounce)",
     "code": "UNIT-PRICE"
    },
    {
     "answer": "$2.20 for 8 oz (27.5¢ an ounce)",
     "code": "UNIT-PRICE"
    },
    {
     "answer": "$1.50 for 5 oz (30¢ an ounce)",
     "code": "UNIT-PRICE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.BUD.L05.01.A.2",
   "skill_id": "LIFE.BUD.L05.01",
   "level": 5,
   "form": "A",
   "stem": "Your weekly budget is $15. You spent $6.50 and $4.25. How much is left?",
   "answer": "$4.25",
   "typed": true,
   "wrong": [
    {
     "answer": "$10.75",
     "code": "BUDGET-PART"
    },
    {
     "answer": "$8.50",
     "code": "BUDGET-PART"
    },
    {
     "answer": "$4.75",
     "code": "BUDGET-PART"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L05.01.B.1",
   "skill_id": "LIFE.FIN.L05.01",
   "level": 5,
   "form": "B",
   "stem": "Which is the better deal for juice?",
   "answer": "$3.60 for 48 oz (7.5¢ an ounce)",
   "typed": false,
   "wrong": [
    {
     "answer": "$2.00 for 20 oz (10¢ an ounce)",
     "code": "UNIT-PRICE"
    },
    {
     "answer": "$1.20 for 12 oz (10¢ an ounce)",
     "code": "UNIT-PRICE"
    },
    {
     "answer": "$2.70 for 30 oz (9¢ an ounce)",
     "code": "UNIT-PRICE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.BUD.L05.01.B.2",
   "skill_id": "LIFE.BUD.L05.01",
   "level": 5,
   "form": "B",
   "stem": "Your weekly budget is $20. You spent $7.75 and $5.50. How much is left?",
   "answer": "$6.75",
   "typed": true,
   "wrong": [
    {
     "answer": "$13.25",
     "code": "BUDGET-PART"
    },
    {
     "answer": "$7.25",
     "code": "BUDGET-PART"
    },
    {
     "answer": "$6.25",
     "code": "BUDGET-PART"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L06.01.A.1",
   "skill_id": "LIFE.FIN.L06.01",
   "level": 6,
   "form": "A",
   "stem": "You save $200 in an account that pays 5% a year. How much interest after one year?",
   "answer": "$10",
   "typed": true,
   "wrong": [
    {
     "answer": "$5",
     "code": "PERCENT-ERR"
    },
    {
     "answer": "$100",
     "code": "PERCENT-ERR"
    },
    {
     "answer": "$205",
     "code": "PERCENT-ERR"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L06.02.A.2",
   "skill_id": "LIFE.FIN.L06.02",
   "level": 6,
   "form": "A",
   "stem": "An ad says: \"Only 3 left! Buy NOW!\" What is the ad trying to do?",
   "answer": "Rush you so you don't think it over",
   "typed": false,
   "wrong": [
    {
     "answer": "Help you save money",
     "code": "AD-PRESSURE"
    },
    {
     "answer": "Tell you a fact you need",
     "code": "AD-PRESSURE"
    },
    {
     "answer": "Warn you about a danger",
     "code": "AD-PRESSURE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L06.01.B.1",
   "skill_id": "LIFE.FIN.L06.01",
   "level": 6,
   "form": "B",
   "stem": "You save $300 in an account that pays 4% a year. How much interest after one year?",
   "answer": "$12",
   "typed": true,
   "wrong": [
    {
     "answer": "$4",
     "code": "PERCENT-ERR"
    },
    {
     "answer": "$120",
     "code": "PERCENT-ERR"
    },
    {
     "answer": "$304",
     "code": "PERCENT-ERR"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L06.02.B.2",
   "skill_id": "LIFE.FIN.L06.02",
   "level": 6,
   "form": "B",
   "stem": "A famous athlete smiles and holds a drink in an ad. What does that prove about the drink?",
   "answer": "Nothing about how good it is",
   "typed": false,
   "wrong": [
    {
     "answer": "It must be healthy",
     "code": "AD-PRESSURE"
    },
    {
     "answer": "It will make you a better athlete",
     "code": "AD-PRESSURE"
    },
    {
     "answer": "It is the best-tasting drink",
     "code": "AD-PRESSURE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L07.02.A.1",
   "skill_id": "LIFE.FIN.L07.02",
   "level": 7,
   "form": "A",
   "stem": "You work 12 hours at $15 an hour. How much do you earn before taxes?",
   "answer": "$180",
   "typed": true,
   "wrong": [
    {
     "answer": "$27",
     "code": "PAY-CALC"
    },
    {
     "answer": "$150",
     "code": "PAY-CALC"
    },
    {
     "answer": "$1,215",
     "code": "PAY-CALC"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L07.04.A.2",
   "skill_id": "LIFE.FIN.L07.04",
   "level": 7,
   "form": "A",
   "stem": "A text says your bank account is locked and asks for your password. What do you do?",
   "answer": "Don't answer; call the bank's real number",
   "typed": false,
   "wrong": [
    {
     "answer": "Reply with the password to unlock it",
     "code": "SCAM-TRUST"
    },
    {
     "answer": "Click the link to check",
     "code": "SCAM-TRUST"
    },
    {
     "answer": "Send it to a friend to ask",
     "code": "SCAM-TRUST"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L07.02.B.1",
   "skill_id": "LIFE.FIN.L07.02",
   "level": 7,
   "form": "B",
   "stem": "You work 9 hours at $16 an hour. How much do you earn before taxes?",
   "answer": "$144",
   "typed": true,
   "wrong": [
    {
     "answer": "$25",
     "code": "PAY-CALC"
    },
    {
     "answer": "$160",
     "code": "PAY-CALC"
    },
    {
     "answer": "$916",
     "code": "PAY-CALC"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L07.03.B.2",
   "skill_id": "LIFE.FIN.L07.03",
   "level": 7,
   "form": "B",
   "stem": "You owe $500 on a credit card at 20% a year and pay nothing for a year. About how much do you owe then?",
   "answer": "$600",
   "typed": true,
   "wrong": [
    {
     "answer": "$520",
     "code": "PERCENT-ERR"
    },
    {
     "answer": "$500",
     "code": "INTEREST-IGNORED"
    },
    {
     "answer": "$1,000",
     "code": "PERCENT-ERR"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L08.01.A.1",
   "skill_id": "LIFE.FIN.L08.01",
   "level": 8,
   "form": "A",
   "stem": "Why do people spread their savings over many different investments?",
   "answer": "If one does badly, the others can balance it",
   "typed": false,
   "wrong": [
    {
     "answer": "It guarantees they will never lose money",
     "code": "INVEST-MYTH"
    },
    {
     "answer": "It makes every investment grow faster",
     "code": "INVEST-MYTH"
    },
    {
     "answer": "The law requires at least ten investments",
     "code": "INVEST-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.BUD.L08.01.A.2",
   "skill_id": "LIFE.BUD.L08.01",
   "level": 8,
   "form": "A",
   "stem": "A $900 bike. You have $300 and save $75 a month. How many months until you can buy it?",
   "answer": "8 months",
   "typed": true,
   "wrong": [
    {
     "answer": "12 months",
     "code": "BUDGET-PART"
    },
    {
     "answer": "4 months",
     "code": "BUDGET-PART"
    },
    {
     "answer": "16 months",
     "code": "BUDGET-PART"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L08.02.B.1",
   "skill_id": "LIFE.FIN.L08.02",
   "level": 8,
   "form": "B",
   "stem": "What is insurance for?",
   "answer": "Paying for a big loss you could not afford alone",
   "typed": false,
   "wrong": [
    {
     "answer": "Making money grow like a savings account",
     "code": "INSURE-MYTH"
    },
    {
     "answer": "Stopping accidents from happening",
     "code": "INSURE-MYTH"
    },
    {
     "answer": "Getting free things every month",
     "code": "INSURE-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L08.03.B.2",
   "skill_id": "LIFE.FIN.L08.03",
   "level": 8,
   "form": "B",
   "stem": "Your lemonade stand sells $60 of lemonade. Cups and lemons cost $22. What is your profit?",
   "answer": "$38",
   "typed": true,
   "wrong": [
    {
     "answer": "$60",
     "code": "PROFIT-REVENUE"
    },
    {
     "answer": "$82",
     "code": "PROFIT-REVENUE"
    },
    {
     "answer": "$22",
     "code": "PROFIT-REVENUE"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L09.01.A.1",
   "skill_id": "LIFE.FIN.L09.01",
   "level": 9,
   "form": "A",
   "stem": "Which action helps a credit score the most?",
   "answer": "Paying every bill on time",
   "typed": false,
   "wrong": [
    {
     "answer": "Opening many new cards at once",
     "code": "CREDIT-MYTH"
    },
    {
     "answer": "Using all of your credit limit",
     "code": "CREDIT-MYTH"
    },
    {
     "answer": "Never checking your statements",
     "code": "CREDIT-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L09.03.A.2",
   "skill_id": "LIFE.FIN.L09.03",
   "level": 9,
   "form": "A",
   "stem": "$1,000 grows 10% a year, compounded. How much after 2 years?",
   "answer": "$1,210",
   "typed": true,
   "wrong": [
    {
     "answer": "$1,200",
     "code": "INTEREST-SIMPLE"
    },
    {
     "answer": "$1,100",
     "code": "PERCENT-ERR"
    },
    {
     "answer": "$1,020",
     "code": "PERCENT-ERR"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L09.02.B.1",
   "skill_id": "LIFE.FIN.L09.02",
   "level": 9,
   "form": "B",
   "stem": "What is the main difference between a debit card and a credit card?",
   "answer": "Debit uses your money now; credit borrows money",
   "typed": false,
   "wrong": [
    {
     "answer": "They are exactly the same",
     "code": "BANK-MYTH"
    },
    {
     "answer": "Credit uses your money; debit borrows it",
     "code": "BANK-MYTH"
    },
    {
     "answer": "Only debit cards can be used online",
     "code": "BANK-MYTH"
    }
   ],
   "status": "Draft"
  },
  {
   "item_id": "PF.LM.LIFE.FIN.L09.03.B.2",
   "skill_id": "LIFE.FIN.L09.03",
   "level": 9,
   "form": "B",
   "stem": "$2,000 grows 5% a year, compounded. How much after 2 years?",
   "answer": "$2,205",
   "typed": true,
   "wrong": [
    {
     "answer": "$2,200",
     "code": "INTEREST-SIMPLE"
    },
    {
     "answer": "$2,100",
     "code": "PERCENT-ERR"
    },
    {
     "answer": "$2,010",
     "code": "PERCENT-ERR"
    }
   ],
   "status": "Draft"
  }
 ],
 "rules": {
  "stop_after_misses_in_a_row": 3,
  "level": "highest level with both right and at least one right at every level below"
 },
 "what_helps_me": [
  {
   "skill_id": "MATH.OPS.L01.04",
   "name": "Ten Friends",
   "teach": "Two numbers that make 10 are \"ten friends.\" 7 and 3 are ten friends, because 7 + 3 = 10.",
   "hints": {
    "picture": "A ten-frame with 6 red dots filled in and 4 empty boxes, with the empty boxes glowing.",
    "example": "7 and what make 10? Count up from 7: 8, 9, 10. That is 3 more. So 7 and 3 make 10.",
    "first_step": "Count up from 9 to 10 with your finger: 9 … 10. How many did you count?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "6 and what make 10?",
     "answer": "4",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "8 and what make 10?",
     "answer": "2",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "5 and what make 10?",
     "answer": "5",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "9 and what make 10?",
     "answer": "1",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.PV.L02.01",
   "name": "Tens and Ones",
   "teach": "In 34, the 3 means 3 tens (30) and the 4 means 4 ones. 34 = 30 + 4.",
   "hints": {
    "picture": "52 shown as 5 long rods of ten cubes and 2 single cubes, with the rods circled.",
    "example": "How many tens in 36? 36 is 3 rods of ten and 6 ones. So 3 tens.",
    "first_step": "81 is 80 + 1. 80 is how many tens?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "How many tens are in 52?",
     "answer": "5",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "How many tens are in 47?",
     "answer": "4",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "How many ones are in 63?",
     "answer": "3",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "How many tens are in 81?",
     "answer": "8",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.OPS.L03.02",
   "name": "Regroup Ridge (subtraction with regrouping)",
   "teach": "In 52 − 17, you cannot take 7 from 2, so trade 1 ten for 10 ones: 52 becomes 4 tens and 12 ones. 12 − 7 = 5 and 4 − 1 = 3. The answer is 35.",
   "hints": {
    "picture": "61 shown as 6 ten-rods and 1 cube; one rod breaks into 10 cubes, leaving 5 rods and 11 cubes.",
    "example": "54 − 26: trade a ten, 54 = 4 tens and 14 ones. 14 − 6 = 8, 4 − 2 = 2. Answer 28.",
    "first_step": "82 − 47: 82 becomes 7 tens and 12 ones. Now do 12 − 7 and 7 − 4."
   },
   "checks": [
    {
     "n": 1,
     "stem": "43 − 18 = ?",
     "answer": "25",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "61 − 25 = ?",
     "answer": "36",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "70 − 34 = ?",
     "answer": "36",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "82 − 47 = ?",
     "answer": "35",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.OPS.L04.02",
   "name": "Missing Factor",
   "teach": "In 4 × ? = 28, ask: 4 times what is 28? Count by 4s: 4, 8, 12, 16, 20, 24, 28. That is 7 jumps, so ? = 7.",
   "hints": {
    "picture": "An array of 24 dots in rows of 3, with the 8 rows numbered.",
    "example": "4 × ? = 36. 36 ÷ 4 = 9, so ? = 9.",
    "first_step": "7 × ? = 56: count by 7s: 7, 14, 21, 28, 35, 42, 49, 56. How many jumps?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "3 × ? = 24",
     "answer": "8",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "6 × ? = 42",
     "answer": "7",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "5 × ? = 35",
     "answer": "7",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "7 × ? = 56",
     "answer": "8",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.FRAC.L05.01",
   "name": "Fraction Twins (equivalent fractions)",
   "teach": "Multiply the top and bottom by the same number to make an equal fraction: 1/2 = 2/4 = 3/6. To find 2/3 = ?/12, the bottom went from 3 to 12 (× 4), so the top goes 2 × 4 = 8.",
   "hints": {
    "picture": "Two equal bars: one cut in 4 parts with 1 shaded, one cut in 8 parts with 2 shaded, lined up.",
    "example": "1/3 = ?/6. 3 × 2 = 6, so the top is 1 × 2 = 2. 1/3 = 2/6.",
    "first_step": "2/3 = ?/9. The bottom went 3 → 9, that is × 3. Now multiply the top 2 × 3."
   },
   "checks": [
    {
     "n": 1,
     "stem": "1/4 = ?/8",
     "answer": "2",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "2/5 = ?/10",
     "answer": "4",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "3/4 = ?/12",
     "answer": "9",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "2/3 = ?/9",
     "answer": "6",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.FRAC.L06.01",
   "name": "Common Ground (adding unlike fractions)",
   "teach": "To add 1/2 + 1/3, make the bottoms the same: 1/2 = 3/6 and 1/3 = 2/6. Then 3/6 + 2/6 = 5/6.",
   "hints": {
    "picture": "A bar cut in 4 with 1 part shaded, and a bar cut in 4 with 2 parts shaded (the half), combined: 3 of 4 parts.",
    "example": "1/3 + 1/9: 1/3 = 3/9, so 3/9 + 1/9 = 4/9.",
    "first_step": "1/2 + 1/8: 1/2 = 4/8. Now add 4/8 + 1/8."
   },
   "checks": [
    {
     "n": 1,
     "stem": "1/4 + 1/2 = ?/4",
     "answer": "3",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "1/3 + 1/6 = ?/6",
     "answer": "3",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "2/5 + 1/10 = ?/10",
     "answer": "5",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "1/2 + 1/8 = ?/8",
     "answer": "5",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.ALG.L07.03",
   "name": "Percents",
   "teach": "Percent means \"out of 100.\" 25% of 80: 10% of 80 is 8, so 20% is 16 and 5% is 4. 16 + 4 = 20.",
   "hints": {
    "picture": "A 10-by-10 grid with 20 squares shaded, next to a bar of 45 split into 5 equal parts with one part shaded.",
    "example": "30% of 50: 10% of 50 is 5, so 30% is 3 × 5 = 15.",
    "first_step": "25% of 60 is one quarter of 60. 60 ÷ 4 = ?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "10% of 70 = ?",
     "answer": "7",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "20% of 45 = ?",
     "answer": "9",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "50% of 36 = ?",
     "answer": "18",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "25% of 60 = ?",
     "answer": "15",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.ALG.L08.04",
   "name": "Two-Step Equations",
   "teach": "To solve 3x + 5 = 20, undo in reverse order: subtract 5 (3x = 15), then divide by 3 (x = 5).",
   "hints": {
    "picture": "A balance scale with two bags labeled x and 3 single weights on the left, 11 weights on the right; the 3 weights are removed from both sides.",
    "example": "6x + 4 = 28: subtract 4 → 6x = 24; divide by 6 → x = 4.",
    "first_step": "3x − 4 = 14: add 4 to both sides → 3x = 18. Now divide by 3."
   },
   "checks": [
    {
     "n": 1,
     "stem": "2x + 3 = 11. x = ?",
     "answer": "4",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "4x − 1 = 19. x = ?",
     "answer": "5",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "5x + 2 = 37. x = ?",
     "answer": "7",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "3x − 4 = 14. x = ?",
     "answer": "6",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "MATH.ALG.L09.01",
   "name": "Slope",
   "teach": "Slope = rise ÷ run = (change in y) ÷ (change in x). From (1, 2) to (3, 8): y goes up 6, x goes up 2, slope = 6 ÷ 2 = 3.",
   "hints": {
    "picture": "A grid with the two points (0, 1) and (2, 5), a staircase drawn between them: 2 steps right, 4 steps up.",
    "example": "(1, 1) to (3, 7): rise 7 − 1 = 6, run 3 − 1 = 2, slope 6 ÷ 2 = 3.",
    "first_step": "(0, 0) to (5, 20): rise 20 − 0 = 20, run 5 − 0 = 5. Now divide."
   },
   "checks": [
    {
     "n": 1,
     "stem": "Slope from (0, 1) to (2, 5)?",
     "answer": "2",
     "wrong": null
    },
    {
     "n": 2,
     "stem": "Slope from (1, 3) to (4, 12)?",
     "answer": "3",
     "wrong": null
    },
    {
     "n": 3,
     "stem": "Slope from (2, 10) to (4, 6)?",
     "answer": "-2",
     "wrong": null
    },
    {
     "n": 4,
     "stem": "Slope from (0, 0) to (5, 20)?",
     "answer": "4",
     "wrong": null
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.PA.L01.05",
   "name": "Blend It",
   "teach": "Say each sound, then push them together fast: /m/ /a/ /p/ → map.",
   "hints": {
    "picture": "Three boxes in a row with a sound in each; a finger slides under them left to right, then a picture of the sun appears.",
    "example": "/c/ /u/ /p/: slide your finger and say them faster and faster: c-u-p, cup.",
    "first_step": "The first two sounds are joined for you: /be/ … /d/. Now push them together."
   },
   "checks": [
    {
     "n": 1,
     "stem": "Listen: /s/ /u/ /n/. Which word?",
     "answer": "sun",
     "wrong": [
      {
       "answer": "sit",
       "code": "BLEND-PART"
      },
      {
       "answer": "fun",
       "code": "BLEND-FIRST"
      },
      {
       "answer": "us",
       "code": "BLEND-ORDER"
      }
     ]
    },
    {
     "n": 2,
     "stem": "Listen: /h/ /a/ /t/. Which word?",
     "answer": "hat",
     "wrong": [
      {
       "answer": "hit",
       "code": "BLEND-PART"
      },
      {
       "answer": "cat",
       "code": "BLEND-FIRST"
      },
      {
       "answer": "at",
       "code": "BLEND-PART"
      }
     ]
    },
    {
     "n": 3,
     "stem": "Listen: /d/ /o/ /g/. Which word?",
     "answer": "dog",
     "wrong": [
      {
       "answer": "dig",
       "code": "BLEND-PART"
      },
      {
       "answer": "log",
       "code": "BLEND-FIRST"
      },
      {
       "answer": "do",
       "code": "BLEND-PART"
      }
     ]
    },
    {
     "n": 4,
     "stem": "Listen: /b/ /e/ /d/. Which word?",
     "answer": "bed",
     "wrong": [
      {
       "answer": "bad",
       "code": "BLEND-PART"
      },
      {
       "answer": "red",
       "code": "BLEND-FIRST"
      },
      {
       "answer": "deb",
       "code": "BLEND-ORDER"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.LV.L02.01",
   "name": "Silent e",
   "teach": "An e at the end of a word is silent, and it makes the vowel say its name: cap → cape, kit → kite.",
   "hints": {
    "picture": "The word \"hop\" with a quiet e sliding in at the end, and an arrow from the e to the o, which changes to \"hope.\"",
    "example": "\"pin\" + e = \"pine.\" The e is quiet; the i now says its name.",
    "first_step": "\"tap\" + e. The e is quiet. What does the a say now?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "Listen: \"kite.\" Tap the word you hear.",
     "answer": "kite",
     "wrong": [
      {
       "answer": "kit",
       "code": "SILENT-E"
      },
      {
       "answer": "kate",
       "code": "VOWEL-WRONG"
      },
      {
       "answer": "kete",
       "code": "VOWEL-WRONG"
      }
     ]
    },
    {
     "n": 2,
     "stem": "Listen: \"hope.\" Tap the word you hear.",
     "answer": "hope",
     "wrong": [
      {
       "answer": "hop",
       "code": "SILENT-E"
      },
      {
       "answer": "hape",
       "code": "VOWEL-WRONG"
      },
      {
       "answer": "hupe",
       "code": "VOWEL-WRONG"
      }
     ]
    },
    {
     "n": 3,
     "stem": "Listen: \"cube.\" Tap the word you hear.",
     "answer": "cube",
     "wrong": [
      {
       "answer": "cub",
       "code": "SILENT-E"
      },
      {
       "answer": "cobe",
       "code": "VOWEL-WRONG"
      },
      {
       "answer": "cabe",
       "code": "VOWEL-WRONG"
      }
     ]
    },
    {
     "n": 4,
     "stem": "Listen: \"tape.\" Tap the word you hear.",
     "answer": "tape",
     "wrong": [
      {
       "answer": "tap",
       "code": "SILENT-E"
      },
      {
       "answer": "tipe",
       "code": "VOWEL-WRONG"
      },
      {
       "answer": "tope",
       "code": "VOWEL-WRONG"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.PHON.L03.01",
   "name": "Syllable Splitter",
   "teach": "Split between two consonants in the middle: nap|kin, rab|bit. Read each part, then put them together.",
   "hints": {
    "picture": "\"napkin\" with the two middle consonants p and k highlighted and a line drawn between them.",
    "example": "\"muffin\": the middle consonants are f and f. Split between them: muf|fin.",
    "first_step": "\"contest\": the middle consonants are n and t. Split between them."
   },
   "checks": [
    {
     "n": 1,
     "stem": "Where does \"basket\" split?",
     "answer": "bas|ket",
     "wrong": [
      {
       "answer": "ba|sket",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "bask|et",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "b|asket",
       "code": "SYLL-SPLIT"
      }
     ]
    },
    {
     "n": 2,
     "stem": "Where does \"sunset\" split?",
     "answer": "sun|set",
     "wrong": [
      {
       "answer": "su|nset",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "suns|et",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "s|unset",
       "code": "SYLL-SPLIT"
      }
     ]
    },
    {
     "n": 3,
     "stem": "Where does \"picnic\" split?",
     "answer": "pic|nic",
     "wrong": [
      {
       "answer": "pi|cnic",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "picn|ic",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "p|icnic",
       "code": "SYLL-SPLIT"
      }
     ]
    },
    {
     "n": 4,
     "stem": "Where does \"contest\" split?",
     "answer": "con|test",
     "wrong": [
      {
       "answer": "co|ntest",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "cont|est",
       "code": "SYLL-SPLIT"
      },
      {
       "answer": "c|ontest",
       "code": "SYLL-SPLIT"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.VOC.L04.01",
   "name": "Clue Hunter (context clues)",
   "teach": "When you meet a hard word, look at the words around it for a clue: \"The soup was scalding, so hot that he burned his tongue.\" So hot → scalding means very hot.",
   "hints": {
    "picture": "A sentence with the hard word circled and arrows pointing to the clue words \"so thin that only one boy could walk on it.\"",
    "example": "\"The room was frigid; we could see our breath.\" Clue: see our breath. Frigid means very cold.",
    "first_step": "The clue words are \"jumped and cheered.\" What feeling makes you jump and cheer?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "\"The path was narrow, so thin that only one boy could walk on it.\" Narrow means:",
     "answer": "not wide",
     "wrong": [
      {
       "answer": "very long",
       "code": "CONTEXT-IGNORED"
      },
      {
       "answer": "muddy",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "crowded",
       "code": "CONTEXT-PARTIAL"
      }
     ]
    },
    {
     "n": 2,
     "stem": "\"After the long hike, the boys were famished and ate three sandwiches each.\" Famished means:",
     "answer": "very hungry",
     "wrong": [
      {
       "answer": "very tired",
       "code": "CONTEXT-PARTIAL"
      },
      {
       "answer": "very happy",
       "code": "CONTEXT-IGNORED"
      },
      {
       "answer": "very full",
       "code": "CONTEXT-IGNORED"
      }
     ]
    },
    {
     "n": 3,
     "stem": "\"The puppy was timid; it hid behind the couch whenever a guest came in.\" Timid means:",
     "answer": "shy and easily scared",
     "wrong": [
      {
       "answer": "playful and loud",
       "code": "CONTEXT-IGNORED"
      },
      {
       "answer": "very small",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "hungry for treats",
       "code": "WORD-ASSOC"
      }
     ]
    },
    {
     "n": 4,
     "stem": "\"Dovid was elated when he won; he jumped and cheered.\" Elated means:",
     "answer": "very happy",
     "wrong": [
      {
       "answer": "very tired",
       "code": "CONTEXT-IGNORED"
      },
      {
       "answer": "surprised and worried",
       "code": "CONTEXT-PARTIAL"
      },
      {
       "answer": "angry",
       "code": "CONTEXT-IGNORED"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.COMP.L05.01",
   "name": "Big Idea (main idea)",
   "teach": "The main idea is what most of the sentences are about. Ask: what do all the details have in common?",
   "hints": {
    "picture": "An umbrella labeled \"main idea\" with three detail sentences standing under it.",
    "example": "\"Owls see well. Owls hear well. Owls fly quietly.\" What do they share? They help owls hunt. Main idea: owls are built to hunt.",
    "first_step": "The details are cleaning, cooking and setting the best table. What day are they getting ready for?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "\"Bats eat insects. Bats spread seeds. Bats help flowers grow.\" Main idea?",
     "answer": "Bats help nature in many ways.",
     "wrong": [
      {
       "answer": "Bats eat insects.",
       "code": "TOO-NARROW"
      },
      {
       "answer": "Flowers need help.",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "Bats sleep in caves.",
       "code": "DETAIL-WRONG"
      }
     ]
    },
    {
     "n": 2,
     "stem": "\"Eli packed water. He packed a map. He packed a flashlight.\" Main idea?",
     "answer": "Eli got ready for a trip.",
     "wrong": [
      {
       "answer": "Eli packed water.",
       "code": "TOO-NARROW"
      },
      {
       "answer": "Maps are useful.",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "Eli is afraid of the dark.",
       "code": "INFER-TOO-FAR"
      }
     ]
    },
    {
     "n": 3,
     "stem": "\"Ants carry food. Ants build tunnels. Ants guard the queen.\" Main idea?",
     "answer": "Ants do many jobs.",
     "wrong": [
      {
       "answer": "Ants build tunnels.",
       "code": "TOO-NARROW"
      },
      {
       "answer": "Queens are important.",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "Ants are pests.",
       "code": "DETAIL-WRONG"
      }
     ]
    },
    {
     "n": 4,
     "stem": "\"Abba cleaned the house. We cooked. We set the table with the best dishes.\" Main idea?",
     "answer": "The family got ready for Shabbos.",
     "wrong": [
      {
       "answer": "We set the table.",
       "code": "TOO-NARROW"
      },
      {
       "answer": "Dishes break easily.",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "Abba likes to clean.",
       "code": "INFER-TOO-FAR"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.COMP.L06.01",
   "name": "Read Between the Lines (inference)",
   "teach": "An inference uses clues plus what you know. \"Avi's coat was wet and he shook his umbrella.\" Clues + what you know: it is raining.",
   "hints": {
    "picture": "Two puzzle pieces: one labeled \"clues in the text,\" one labeled \"what I know,\" joining to make \"inference.\"",
    "example": "\"Dov wore mittens and a scarf and could see his breath.\" Clues + what you know: it is cold outside.",
    "first_step": "Clues: checks the clock again, taps his foot, by the door. What do people do when they are waiting and want to go?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "\"Moshe yawned, rubbed his eyes and put his head on the desk.\" What can you infer?",
     "answer": "Moshe is tired.",
     "wrong": [
      {
       "answer": "Moshe is hungry.",
       "code": "INFER-TOO-FAR"
      },
      {
       "answer": "Moshe has a desk.",
       "code": "INFER-LITERAL"
      },
      {
       "answer": "Moshe is excited.",
       "code": "INFER-WRONG"
      }
     ]
    },
    {
     "n": 2,
     "stem": "\"The boys heard a crack of thunder and ran inside.\" What can you infer?",
     "answer": "A storm was coming.",
     "wrong": [
      {
       "answer": "The boys were tired.",
       "code": "INFER-TOO-FAR"
      },
      {
       "answer": "The boys heard a sound.",
       "code": "INFER-LITERAL"
      },
      {
       "answer": "It was a sunny day.",
       "code": "INFER-WRONG"
      }
     ]
    },
    {
     "n": 3,
     "stem": "\"Shimon stared at the empty plate and licked his lips.\" What can you infer?",
     "answer": "He enjoyed the food.",
     "wrong": [
      {
       "answer": "He is sick.",
       "code": "INFER-TOO-FAR"
      },
      {
       "answer": "The plate is empty.",
       "code": "INFER-LITERAL"
      },
      {
       "answer": "He hated the food.",
       "code": "INFER-WRONG"
      }
     ]
    },
    {
     "n": 4,
     "stem": "\"Yosef checked the clock again and tapped his foot by the door.\" What can you infer?",
     "answer": "He is waiting impatiently.",
     "wrong": [
      {
       "answer": "He is asleep.",
       "code": "INFER-WRONG"
      },
      {
       "answer": "He has a clock.",
       "code": "INFER-LITERAL"
      },
      {
       "answer": "He is lost.",
       "code": "INFER-TOO-FAR"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.COMP.L07.01",
   "name": "Show Me the Proof (evidence)",
   "teach": "Strong evidence is a sentence from the text that directly proves the answer, not just a sentence on the same topic.",
   "hints": {
    "picture": "A claim on a sign held up by one strong pillar labeled with a proving sentence; a weak pillar labeled \"same topic\" crumbles.",
    "example": "Claim: \"The dog was loyal.\" \"The dog waited by the door every day for its owner\" proves it. \"The dog was brown\" is only on topic.",
    "first_step": "Ask: which sentence shows danger, something that could hurt people?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "Claim: \"Eli was brave.\" Best proof?",
     "answer": "\"Eli walked into the dark cave first.\"",
     "wrong": [
      {
       "answer": "\"Eli liked caves.\"",
       "code": "EVIDENCE-TOPIC"
      },
      {
       "answer": "\"The cave was dark.\"",
       "code": "EVIDENCE-TOPIC"
      },
      {
       "answer": "\"Eli had a flashlight.\"",
       "code": "EVIDENCE-WEAK"
      }
     ]
    },
    {
     "n": 2,
     "stem": "Claim: \"The team worked hard.\" Best proof?",
     "answer": "\"They practiced every day for a month.\"",
     "wrong": [
      {
       "answer": "\"The team wore blue.\"",
       "code": "EVIDENCE-TOPIC"
      },
      {
       "answer": "\"They liked their coach.\"",
       "code": "EVIDENCE-WEAK"
      },
      {
       "answer": "\"Practice was outside.\"",
       "code": "EVIDENCE-TOPIC"
      }
     ]
    },
    {
     "n": 3,
     "stem": "Claim: \"Chaim was generous.\" Best proof?",
     "answer": "\"Chaim gave half his lunch to a new boy.\"",
     "wrong": [
      {
       "answer": "\"Chaim had a big lunch.\"",
       "code": "EVIDENCE-TOPIC"
      },
      {
       "answer": "\"The new boy was hungry.\"",
       "code": "EVIDENCE-WEAK"
      },
      {
       "answer": "\"Lunch was at noon.\"",
       "code": "EVIDENCE-TOPIC"
      }
     ]
    },
    {
     "n": 4,
     "stem": "Claim: \"The storm was dangerous.\" Best proof?",
     "answer": "\"The wind knocked down power lines.\"",
     "wrong": [
      {
       "answer": "\"It rained on Tuesday.\"",
       "code": "EVIDENCE-WEAK"
      },
      {
       "answer": "\"The sky was gray.\"",
       "code": "EVIDENCE-TOPIC"
      },
      {
       "answer": "\"People watched the news.\"",
       "code": "EVIDENCE-TOPIC"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.VOC.L08.02",
   "name": "Context Master (word meaning from context)",
   "teach": "Use the whole sentence, and any contrast or example words, to pin down a word's exact meaning in that sentence.",
   "hints": {
    "picture": "A sentence where the contrast word \"Unlike\" is highlighted, with a seesaw showing the two opposite sides.",
    "example": "\"Unlike the verbose speaker, Rabbi Gold spoke briefly.\" Unlike + briefly → verbose means using too many words.",
    "first_step": "The clue word is \"Though\" (a contrast) and \"splurged\" (spent a lot). Frugal is the opposite of splurging."
   },
   "checks": [
    {
     "n": 1,
     "stem": "\"Unlike his gregarious brother, who loved parties, Natan preferred quiet evenings alone.\" Gregarious means:",
     "answer": "sociable",
     "wrong": [
      {
       "answer": "shy",
       "code": "CONTEXT-REVERSED"
      },
      {
       "answer": "older",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "angry",
       "code": "CONTEXT-IGNORED"
      }
     ]
    },
    {
     "n": 2,
     "stem": "\"The instructions were so ambiguous that every boy built something different.\" Ambiguous means:",
     "answer": "unclear",
     "wrong": [
      {
       "answer": "very long",
       "code": "CONTEXT-PARTIAL"
      },
      {
       "answer": "exact",
       "code": "CONTEXT-REVERSED"
      },
      {
       "answer": "boring",
       "code": "CONTEXT-IGNORED"
      }
     ]
    },
    {
     "n": 3,
     "stem": "\"The old bridge was so precarious that the city closed it.\" Precarious means:",
     "answer": "unsafe",
     "wrong": [
      {
       "answer": "beautiful",
       "code": "CONTEXT-IGNORED"
      },
      {
       "answer": "strong",
       "code": "CONTEXT-REVERSED"
      },
      {
       "answer": "old",
       "code": "WORD-ASSOC"
      }
     ]
    },
    {
     "n": 4,
     "stem": "\"Though usually frugal, Abba splurged on a new set of seforim.\" Frugal means:",
     "answer": "careful with money",
     "wrong": [
      {
       "answer": "generous",
       "code": "CONTEXT-REVERSED"
      },
      {
       "answer": "wealthy",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "busy",
       "code": "CONTEXT-IGNORED"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "skill_id": "READ.COMP.L09.01",
   "name": "Argument Judge",
   "teach": "To judge an argument, ask: is the reason relevant to the claim, and is the evidence strong enough to support it?",
   "hints": {
    "picture": "A scale weighing a claim against its reasons; a heavy reason labeled \"relevant and supported\" tips it, a feather labeled \"off topic\" does not.",
    "example": "\"We should get a dog because dogs are cute.\" Cute is not a strong reason for the family's needs; \"a dog would guard the house\" is more relevant.",
    "first_step": "Ask: does costing more always mean something works better?"
   },
   "checks": [
    {
     "n": 1,
     "stem": "Claim: \"Our yeshiva needs a library.\" Which reason is most relevant?",
     "answer": "Boys have no quiet place to read seforim.",
     "wrong": [
      {
       "answer": "The gym is old.",
       "code": "REASON-IRRELEVANT"
      },
      {
       "answer": "Libraries are old buildings.",
       "code": "WORD-ASSOC"
      },
      {
       "answer": "Many boys like sports.",
       "code": "REASON-IRRELEVANT"
      }
     ]
    },
    {
     "n": 2,
     "stem": "\"Everyone I asked loves the new schedule, so the whole school must love it.\" What is weak?",
     "answer": "He asked too few people to say everyone.",
     "wrong": [
      {
       "answer": "The schedule is new.",
       "code": "EVIDENCE-TOPIC"
      },
      {
       "answer": "He should not ask anyone.",
       "code": "REASON-IRRELEVANT"
      },
      {
       "answer": "Schedules are boring.",
       "code": "SUMMARY-OPINION"
      }
     ]
    },
    {
     "n": 3,
     "stem": "Claim: \"Homework should be shorter.\" Which evidence is strongest?",
     "answer": "A study found long homework cut sleep with no gain in grades.",
     "wrong": [
      {
       "answer": "My friend thinks so.",
       "code": "EVIDENCE-WEAK"
      },
      {
       "answer": "Homework is boring.",
       "code": "SUMMARY-OPINION"
      },
      {
       "answer": "Teachers give homework.",
       "code": "EVIDENCE-TOPIC"
      }
     ]
    },
    {
     "n": 4,
     "stem": "\"This brand is best because it costs the most.\" What is weak?",
     "answer": "A high price does not prove quality.",
     "wrong": [
      {
       "answer": "The brand is popular.",
       "code": "EVIDENCE-TOPIC"
      },
      {
       "answer": "Brands should be cheap.",
       "code": "SUMMARY-OPINION"
      },
      {
       "answer": "Nothing is weak.",
       "code": "REASON-IRRELEVANT"
      }
     ]
    }
   ],
   "status": "Draft"
  }
 ],
 "about_me": [
  {
   "id": "interests",
   "screen": "What do you like? Tap all that you like.",
   "type": "pick many (pictures)",
   "options": [
    "Sports",
    "Animals",
    "Building and making things",
    "Computers and coding",
    "Space and science",
    "History and stories of the past",
    "Drawing and art",
    "Music",
    "Cooking and baking",
    "Cars, trucks and trains",
    "Nature and hiking",
    "Learning Gemara and Chumash",
    "Puzzles and games",
    "Reading books"
   ],
   "use": "Stories and word problems in his lessons; the Learning Plan \"use his interests\" line."
  },
  {
   "id": "languages",
   "screen": "Which languages do people speak in your home? Tap all.",
   "type": "pick many",
   "options": [
    "English",
    "Yiddish",
    "Hebrew",
    "Other"
   ],
   "use": "Report context: a Yiddish- or Hebrew-speaking home explains vocabulary results; never lowers a score."
  },
  {
   "id": "feel",
   "screen": "How do you feel about each subject? Tap a face.",
   "type": "face per subject (4 faces: love it, like it, so-so, not fun yet)",
   "options": [
    "Reading",
    "Math",
    "Writing",
    "Lashon Hakodesh",
    "Computers"
   ],
   "use": "Teacher view only; a \"not fun yet\" next to a low score is flagged as a motivation note."
  },
  {
   "id": "better",
   "screen": "What do you want to get better at? Pick one or two.",
   "type": "pick up to 2",
   "options": [
    "Reading faster",
    "Reading harder books",
    "Math facts",
    "Word problems",
    "Writing stories",
    "Neat handwriting",
    "Spelling",
    "Kriyah",
    "Typing",
    "Something else"
   ],
   "use": "His own goal is shown first on My Path and is one of the 3 Learning Plan goals when it matches a real need."
  },
  {
   "id": "family",
   "screen": "(Staff or parent only, never the boy) Anything we should know about his learning history?",
   "type": "staff text box, optional",
   "options": [],
   "use": "Staff view only. Not shown to the boy. Not sent to Claude."
  }
 ]
};/*</X1>*/
