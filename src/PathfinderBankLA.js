/* PATHFINDER Language Arts bank (PF-LA1, LOG CHANGE 2156).
   PF_LA: 102 questions (34 LANG skills x forms A/B/C), 43 mistake codes, strands GRAM / MECH / USE / SENT.
   Built by script from the HQ JSON files (07 PATHFINDER BUILD PROMPT v5, local build 2026-11-12). Do not edit by hand: rebuild.
   Each file is embedded exactly as published (between the <KEY> marker comments), so its sha256 matches the LOG CHANGE.
   Every record is Draft until reviewers mark it Approved. */
/*<LA1>*/var PF_LA = {
 "bank": "PF-LA1_Pathfinder_LanguageArts_L1-9_DRAFT",
 "made": "2026-11-11",
 "by": "CLAUDE (developer@)",
 "status": "Draft",
 "count": 102,
 "codes": {
  "WORD-CLASS": "picked a word of the wrong kind (naming, action or describing word)",
  "SOUND-SPELL": "spelling does not match the sounds of the word",
  "SPELL-PATTERN": "missed a spelling pattern (digraph, blend, vowel pattern)",
  "AGREE-NUMBER": "one/many does not match (noun or subject-verb agreement)",
  "IRREG-OVERREG": "used the regular rule on an irregular word (mouses, goed)",
  "TENSE-SHIFT": "wrong or shifting verb tense",
  "END-MARK": "wrong end mark (period vs question mark)",
  "CAP-MISSING": "a needed capital letter is missing",
  "CAP-EXTRA": "a capital letter where none belongs",
  "FRAGMENT": "not a complete sentence (missing who or what happened)",
  "RUN-ON": "two sentences run together with no punctuation",
  "COMMA-SPLICE": "two sentences joined with only a comma",
  "APOS-MISSING": "apostrophe left out",
  "APOS-PLACE": "apostrophe in the wrong place",
  "APOS-PLURAL": "apostrophe used to make a plural",
  "PRONOUN-NUMBER": "pronoun does not match one/many or person/thing",
  "PRONOUN-CASE": "wrong pronoun form (I/me, he/him)",
  "PRONOUN-VAGUE": "unclear who the pronoun means",
  "COMPARE-DEGREE": "wrong comparing form (-er vs -est, more vs most)",
  "COMPARE-DOUBLE": "doubled comparing (more bigger, most tallest)",
  "QUOTE-PLACE": "quotation marks or end mark in the wrong place",
  "QUOTE-MISSING": "quotation marks left out",
  "HOMOPHONE": "mixed up sound-alike words (their/there/they're, its/it's, to/too/two)",
  "COMMA-MISSING": "a needed comma is missing",
  "COMMA-EXTRA": "a comma where none belongs",
  "CONJ-LOGIC": "joining word gives the wrong meaning (so/but/because)",
  "CONJ-PAIR": "paired joining words mismatched (neither/nor, either/or)",
  "PERFECT-FORM": "wrong perfect tense form (has/had/will have)",
  "TITLE-FORMAT": "title not capitalized or marked correctly",
  "SUFFIX-RULE": "missed a suffix spelling rule (drop e, change y, double)",
  "COMMA-NONRESTRICT": "extra-information commas missing or unpaired",
  "PAREN-UNCLOSED": "parenthesis not closed or opened",
  "DASH-UNPAIRED": "dash missing its partner",
  "INFORMAL": "too casual for the purpose",
  "CLAUSE-TYPE": "confused simple, compound and complex sentences",
  "MODIFIER-DANGLING": "describing phrase has no clear word to describe",
  "MODIFIER-MISPLACED": "describing word or phrase in the wrong place",
  "WORDY": "extra words that add nothing",
  "PASSIVE": "passive voice where active is needed, or misunderstanding of voice",
  "SEMICOLON-WRONG": "semicolon used incorrectly",
  "COLON-WRONG": "colon used incorrectly",
  "ELLIPSIS-WRONG": "ellipsis used incorrectly",
  "MOOD-SHIFT": "unnecessary shift in verb mood (if I was / I will)"
 },
 "items": [
  {
   "item_id": "PF.LA.LANG.GRAM.L01.01.A",
   "skill_id": "LANG.GRAM.L01.01",
   "strand": "GRAM",
   "level": 1,
   "ccss": "L.K.1b",
   "format": "hear and choose 1 of 3",
   "stem": "Which word names a thing?",
   "audio": "Read the question and all choices aloud.",
   "answer": "cup",
   "wrong": [
    {
     "answer": "run",
     "code": "WORD-CLASS"
    },
    {
     "answer": "red",
     "code": "WORD-CLASS"
    }
   ],
   "b": -4.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L01.01.B",
   "skill_id": "LANG.GRAM.L01.01",
   "strand": "GRAM",
   "level": 1,
   "ccss": "L.K.1b",
   "format": "hear and choose 1 of 3",
   "stem": "Which word names a person or animal?",
   "audio": "Read the question and all choices aloud.",
   "answer": "dog",
   "wrong": [
    {
     "answer": "jump",
     "code": "WORD-CLASS"
    },
    {
     "answer": "big",
     "code": "WORD-CLASS"
    }
   ],
   "b": -4.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L01.01.C",
   "skill_id": "LANG.GRAM.L01.01",
   "strand": "GRAM",
   "level": 1,
   "ccss": "L.K.1b",
   "format": "hear and choose 1 of 3",
   "stem": "Which word names a place?",
   "audio": "Read the question and all choices aloud.",
   "answer": "park",
   "wrong": [
    {
     "answer": "sing",
     "code": "WORD-CLASS"
    },
    {
     "answer": "soft",
     "code": "WORD-CLASS"
    }
   ],
   "b": -4.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L01.02.A",
   "skill_id": "LANG.GRAM.L01.02",
   "strand": "GRAM",
   "level": 1,
   "ccss": "L.K.1b",
   "format": "hear and choose 1 of 3",
   "stem": "Which word is something you can do?",
   "audio": "Read the question and all choices aloud.",
   "answer": "hop",
   "wrong": [
    {
     "answer": "hat",
     "code": "WORD-CLASS"
    },
    {
     "answer": "sun",
     "code": "WORD-CLASS"
    }
   ],
   "b": -4,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L01.02.B",
   "skill_id": "LANG.GRAM.L01.02",
   "strand": "GRAM",
   "level": 1,
   "ccss": "L.K.1b",
   "format": "hear and choose 1 of 3",
   "stem": "Which word is an action?",
   "audio": "Read the question and all choices aloud.",
   "answer": "swim",
   "wrong": [
    {
     "answer": "fish",
     "code": "WORD-CLASS"
    },
    {
     "answer": "blue",
     "code": "WORD-CLASS"
    }
   ],
   "b": -4,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L01.02.C",
   "skill_id": "LANG.GRAM.L01.02",
   "strand": "GRAM",
   "level": 1,
   "ccss": "L.K.1b",
   "format": "hear and choose 1 of 3",
   "stem": "Which word tells what the boy does? \"The boy ___ the ball.\"",
   "audio": "Read the question and all choices aloud.",
   "answer": "kicks",
   "wrong": [
    {
     "answer": "ball",
     "code": "WORD-CLASS"
    },
    {
     "answer": "happy",
     "code": "WORD-CLASS"
    }
   ],
   "b": -4,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L01.01.A",
   "skill_id": "LANG.MECH.L01.01",
   "strand": "MECH",
   "level": 1,
   "ccss": "L.K.2c",
   "format": "hear and choose 1 of 3",
   "stem": "Listen: \"map.\" Which spelling is right?",
   "audio": "Read the question and all choices aloud.",
   "answer": "map",
   "wrong": [
    {
     "answer": "mp",
     "code": "SOUND-SPELL"
    },
    {
     "answer": "nap",
     "code": "SOUND-SPELL"
    }
   ],
   "b": -3.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L01.01.B",
   "skill_id": "LANG.MECH.L01.01",
   "strand": "MECH",
   "level": 1,
   "ccss": "L.K.2c",
   "format": "hear and choose 1 of 3",
   "stem": "Listen: \"sun.\" Which spelling is right?",
   "audio": "Read the question and all choices aloud.",
   "answer": "sun",
   "wrong": [
    {
     "answer": "sn",
     "code": "SOUND-SPELL"
    },
    {
     "answer": "son",
     "code": "SOUND-SPELL"
    }
   ],
   "b": -3.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L01.01.C",
   "skill_id": "LANG.MECH.L01.01",
   "strand": "MECH",
   "level": 1,
   "ccss": "L.K.2c",
   "format": "hear and choose 1 of 3",
   "stem": "Listen: \"big.\" Which spelling is right?",
   "audio": "Read the question and all choices aloud.",
   "answer": "big",
   "wrong": [
    {
     "answer": "bg",
     "code": "SOUND-SPELL"
    },
    {
     "answer": "dig",
     "code": "SOUND-SPELL"
    }
   ],
   "b": -3.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.01.A",
   "skill_id": "LANG.GRAM.L02.01",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1c",
   "format": "hear and choose 1 of 3",
   "stem": "Three ___ sat on the fence.",
   "audio": "Read the question and all choices aloud.",
   "answer": "birds",
   "wrong": [
    {
     "answer": "bird",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "birdes",
     "code": "IRREG-OVERREG"
    }
   ],
   "b": -3.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.01.B",
   "skill_id": "LANG.GRAM.L02.01",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1c",
   "format": "hear and choose 1 of 3",
   "stem": "I have two ___ in my bag.",
   "audio": "Read the question and all choices aloud.",
   "answer": "books",
   "wrong": [
    {
     "answer": "book",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "bookes",
     "code": "IRREG-OVERREG"
    }
   ],
   "b": -3.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.01.C",
   "skill_id": "LANG.GRAM.L02.01",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1c",
   "format": "hear and choose 1 of 3",
   "stem": "Abba bought one ___ for Shabbos.",
   "audio": "Read the question and all choices aloud.",
   "answer": "cake",
   "wrong": [
    {
     "answer": "cakes",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "caks",
     "code": "SOUND-SPELL"
    }
   ],
   "b": -3.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.02.A",
   "skill_id": "LANG.GRAM.L02.02",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1f",
   "format": "hear and choose 1 of 3",
   "stem": "Which word describes the dog? \"The fluffy dog barked.\"",
   "audio": "Read the question and all choices aloud.",
   "answer": "fluffy",
   "wrong": [
    {
     "answer": "dog",
     "code": "WORD-CLASS"
    },
    {
     "answer": "barked",
     "code": "WORD-CLASS"
    }
   ],
   "b": -3.21,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.02.B",
   "skill_id": "LANG.GRAM.L02.02",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1f",
   "format": "hear and choose 1 of 3",
   "stem": "Which word tells how the soup feels? \"The soup is hot.\"",
   "audio": "Read the question and all choices aloud.",
   "answer": "hot",
   "wrong": [
    {
     "answer": "soup",
     "code": "WORD-CLASS"
    },
    {
     "answer": "is",
     "code": "WORD-CLASS"
    }
   ],
   "b": -3.21,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.02.C",
   "skill_id": "LANG.GRAM.L02.02",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1f",
   "format": "hear and choose 1 of 3",
   "stem": "Which word describes the bus? \"We rode a yellow bus.\"",
   "audio": "Read the question and all choices aloud.",
   "answer": "yellow",
   "wrong": [
    {
     "answer": "rode",
     "code": "WORD-CLASS"
    },
    {
     "answer": "bus",
     "code": "WORD-CLASS"
    }
   ],
   "b": -3.21,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.03.A",
   "skill_id": "LANG.GRAM.L02.03",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1e",
   "format": "hear and choose 1 of 3",
   "stem": "Yesterday, I ___ with my brother.",
   "audio": "Read the question and all choices aloud.",
   "answer": "played",
   "wrong": [
    {
     "answer": "play",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "will play",
     "code": "TENSE-SHIFT"
    }
   ],
   "b": -3.07,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.03.B",
   "skill_id": "LANG.GRAM.L02.03",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1e",
   "format": "hear and choose 1 of 3",
   "stem": "Tomorrow, we ___ the sukkah.",
   "audio": "Read the question and all choices aloud.",
   "answer": "will build",
   "wrong": [
    {
     "answer": "built",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "builds",
     "code": "TENSE-SHIFT"
    }
   ],
   "b": -3.07,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L02.03.C",
   "skill_id": "LANG.GRAM.L02.03",
   "strand": "GRAM",
   "level": 2,
   "ccss": "L.1.1e",
   "format": "hear and choose 1 of 3",
   "stem": "Right now, Avi ___ a book.",
   "audio": "Read the question and all choices aloud.",
   "answer": "is reading",
   "wrong": [
    {
     "answer": "read",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "will read",
     "code": "TENSE-SHIFT"
    }
   ],
   "b": -3.07,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.01.A",
   "skill_id": "LANG.MECH.L02.01",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2b",
   "format": "hear and choose 1 of 3",
   "stem": "Which mark ends this sentence? \"Where is my hat\"",
   "audio": "Read the question and all choices aloud.",
   "answer": "?",
   "wrong": [
    {
     "answer": ".",
     "code": "END-MARK"
    },
    {
     "answer": ",",
     "code": "END-MARK"
    }
   ],
   "b": -2.93,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.01.B",
   "skill_id": "LANG.MECH.L02.01",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2b",
   "format": "hear and choose 1 of 3",
   "stem": "Which mark ends this sentence? \"I like apples\"",
   "audio": "Read the question and all choices aloud.",
   "answer": ".",
   "wrong": [
    {
     "answer": "?",
     "code": "END-MARK"
    },
    {
     "answer": ",",
     "code": "END-MARK"
    }
   ],
   "b": -2.93,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.01.C",
   "skill_id": "LANG.MECH.L02.01",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2b",
   "format": "hear and choose 1 of 3",
   "stem": "Which sentence is asking?",
   "audio": "Read the question and all choices aloud.",
   "answer": "Can you help me?",
   "wrong": [
    {
     "answer": "You can help me.",
     "code": "END-MARK"
    },
    {
     "answer": "You help me.",
     "code": "END-MARK"
    }
   ],
   "b": -2.93,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.02.A",
   "skill_id": "LANG.MECH.L02.02",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2a",
   "format": "hear and choose 1 of 3",
   "stem": "Which is written the right way?",
   "audio": "Read the question and all choices aloud.",
   "answer": "My friend is Dovid.",
   "wrong": [
    {
     "answer": "My friend is dovid.",
     "code": "CAP-MISSING"
    },
    {
     "answer": "My Friend is dovid.",
     "code": "CAP-EXTRA"
    }
   ],
   "b": -2.79,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.02.B",
   "skill_id": "LANG.MECH.L02.02",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2a",
   "format": "hear and choose 1 of 3",
   "stem": "Which is written the right way?",
   "audio": "Read the question and all choices aloud.",
   "answer": "We live in Baltimore.",
   "wrong": [
    {
     "answer": "We live in baltimore.",
     "code": "CAP-MISSING"
    },
    {
     "answer": "We Live in baltimore.",
     "code": "CAP-EXTRA"
    }
   ],
   "b": -2.79,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.02.C",
   "skill_id": "LANG.MECH.L02.02",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2a",
   "format": "hear and choose 1 of 3",
   "stem": "Which is written the right way?",
   "audio": "Read the question and all choices aloud.",
   "answer": "Shabbos is on Saturday.",
   "wrong": [
    {
     "answer": "Shabbos is on saturday.",
     "code": "CAP-MISSING"
    },
    {
     "answer": "shabbos is On Saturday.",
     "code": "CAP-EXTRA"
    }
   ],
   "b": -2.79,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.03.A",
   "skill_id": "LANG.MECH.L02.03",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2d",
   "format": "hear and choose 1 of 3",
   "stem": "Listen: \"ship.\" Which spelling is right?",
   "audio": "Read the question and all choices aloud.",
   "answer": "ship",
   "wrong": [
    {
     "answer": "sip",
     "code": "SPELL-PATTERN"
    },
    {
     "answer": "chip",
     "code": "SOUND-SPELL"
    }
   ],
   "b": -2.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.03.B",
   "skill_id": "LANG.MECH.L02.03",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2d",
   "format": "hear and choose 1 of 3",
   "stem": "Listen: \"frog.\" Which spelling is right?",
   "audio": "Read the question and all choices aloud.",
   "answer": "frog",
   "wrong": [
    {
     "answer": "fog",
     "code": "SPELL-PATTERN"
    },
    {
     "answer": "frg",
     "code": "SOUND-SPELL"
    }
   ],
   "b": -2.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L02.03.C",
   "skill_id": "LANG.MECH.L02.03",
   "strand": "MECH",
   "level": 2,
   "ccss": "L.1.2d",
   "format": "hear and choose 1 of 3",
   "stem": "Listen: \"lunch.\" Which spelling is right?",
   "audio": "Read the question and all choices aloud.",
   "answer": "lunch",
   "wrong": [
    {
     "answer": "luch",
     "code": "SPELL-PATTERN"
    },
    {
     "answer": "lunsh",
     "code": "SOUND-SPELL"
    }
   ],
   "b": -2.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.SENT.L03.01.A",
   "skill_id": "LANG.SENT.L03.01",
   "strand": "SENT",
   "level": 3,
   "ccss": "L.2.1f",
   "format": "choose 1 of 4",
   "stem": "Which is a complete sentence?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The boys ran to the park.",
   "wrong": [
    {
     "answer": "Ran to the park.",
     "code": "FRAGMENT"
    },
    {
     "answer": "The boys to the park.",
     "code": "FRAGMENT"
    },
    {
     "answer": "To the park with the boys.",
     "code": "FRAGMENT"
    }
   ],
   "b": -2.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.SENT.L03.01.B",
   "skill_id": "LANG.SENT.L03.01",
   "strand": "SENT",
   "level": 3,
   "ccss": "L.2.1f",
   "format": "choose 1 of 4",
   "stem": "Which is a complete sentence?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "My zeidy tells good stories.",
   "wrong": [
    {
     "answer": "Tells good stories.",
     "code": "FRAGMENT"
    },
    {
     "answer": "My zeidy good stories.",
     "code": "FRAGMENT"
    },
    {
     "answer": "Good stories from my zeidy.",
     "code": "FRAGMENT"
    }
   ],
   "b": -2.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.SENT.L03.01.C",
   "skill_id": "LANG.SENT.L03.01",
   "strand": "SENT",
   "level": 3,
   "ccss": "L.2.1f",
   "format": "choose 1 of 4",
   "stem": "Which is NOT a complete sentence?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "After lunch in the yard.",
   "wrong": [
    {
     "answer": "We ate lunch in the yard.",
     "code": "FRAGMENT"
    },
    {
     "answer": "The yard was sunny.",
     "code": "FRAGMENT"
    },
    {
     "answer": "Lunch was very good.",
     "code": "FRAGMENT"
    }
   ],
   "b": -2.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L03.01.A",
   "skill_id": "LANG.GRAM.L03.01",
   "strand": "GRAM",
   "level": 3,
   "ccss": "L.2.1b",
   "format": "choose 1 of 4",
   "stem": "One mouse, two ___.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "mice",
   "wrong": [
    {
     "answer": "mouses",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "mices",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "mouse",
     "code": "AGREE-NUMBER"
    }
   ],
   "b": -2.12,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L03.01.B",
   "skill_id": "LANG.GRAM.L03.01",
   "strand": "GRAM",
   "level": 3,
   "ccss": "L.2.1b",
   "format": "choose 1 of 4",
   "stem": "One foot, two ___.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "feet",
   "wrong": [
    {
     "answer": "foots",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "feets",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "foot",
     "code": "AGREE-NUMBER"
    }
   ],
   "b": -2.12,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L03.01.C",
   "skill_id": "LANG.GRAM.L03.01",
   "strand": "GRAM",
   "level": 3,
   "ccss": "L.2.1b",
   "format": "choose 1 of 4",
   "stem": "One child, many ___.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "children",
   "wrong": [
    {
     "answer": "childs",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "childrens",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "child",
     "code": "AGREE-NUMBER"
    }
   ],
   "b": -2.12,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L03.02.A",
   "skill_id": "LANG.GRAM.L03.02",
   "strand": "GRAM",
   "level": 3,
   "ccss": "L.2.1d",
   "format": "choose 1 of 4",
   "stem": "Yesterday, Shimon ___ to shul early.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "went",
   "wrong": [
    {
     "answer": "goed",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "go",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "wented",
     "code": "IRREG-OVERREG"
    }
   ],
   "b": -1.88,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L03.02.B",
   "skill_id": "LANG.GRAM.L03.02",
   "strand": "GRAM",
   "level": 3,
   "ccss": "L.2.1d",
   "format": "choose 1 of 4",
   "stem": "Last night, I ___ a strange dream.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "had",
   "wrong": [
    {
     "answer": "haved",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "have",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "hadded",
     "code": "IRREG-OVERREG"
    }
   ],
   "b": -1.88,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L03.02.C",
   "skill_id": "LANG.GRAM.L03.02",
   "strand": "GRAM",
   "level": 3,
   "ccss": "L.2.1d",
   "format": "choose 1 of 4",
   "stem": "This morning, we ___ the whole pizza.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "ate",
   "wrong": [
    {
     "answer": "eated",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "eat",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "ated",
     "code": "IRREG-OVERREG"
    }
   ],
   "b": -1.88,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L03.01.A",
   "skill_id": "LANG.MECH.L03.01",
   "strand": "MECH",
   "level": 3,
   "ccss": "L.2.2c",
   "format": "choose 1 of 4",
   "stem": "Which word is a short way to write \"do not\"?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "don't",
   "wrong": [
    {
     "answer": "dont",
     "code": "APOS-MISSING"
    },
    {
     "answer": "do'nt",
     "code": "APOS-PLACE"
    },
    {
     "answer": "don't's",
     "code": "APOS-PLACE"
    }
   ],
   "b": -1.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L03.01.B",
   "skill_id": "LANG.MECH.L03.01",
   "strand": "MECH",
   "level": 3,
   "ccss": "L.2.2c",
   "format": "choose 1 of 4",
   "stem": "Which shows the hat belongs to Avi?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Avi's hat",
   "wrong": [
    {
     "answer": "Avis hat",
     "code": "APOS-MISSING"
    },
    {
     "answer": "Avis' hat",
     "code": "APOS-PLACE"
    },
    {
     "answer": "Avi hat's",
     "code": "APOS-PLACE"
    }
   ],
   "b": -1.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L03.01.C",
   "skill_id": "LANG.MECH.L03.01",
   "strand": "MECH",
   "level": 3,
   "ccss": "L.2.2c",
   "format": "choose 1 of 4",
   "stem": "Which sentence is correct?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The cats are hungry.",
   "wrong": [
    {
     "answer": "The cat's are hungry.",
     "code": "APOS-PLURAL"
    },
    {
     "answer": "The cats' are hungry.",
     "code": "APOS-PLURAL"
    },
    {
     "answer": "The cat,s are hungry.",
     "code": "APOS-PLACE"
    }
   ],
   "b": -1.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L04.01.A",
   "skill_id": "LANG.MECH.L04.01",
   "strand": "MECH",
   "level": 4,
   "ccss": "L.3.2a",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "On Monday, Rabbi Klein visited New York.",
   "wrong": [
    {
     "answer": "On monday, Rabbi Klein visited New York.",
     "code": "CAP-MISSING"
    },
    {
     "answer": "On Monday, rabbi Klein visited new York.",
     "code": "CAP-MISSING"
    },
    {
     "answer": "On Monday, Rabbi Klein Visited New York.",
     "code": "CAP-EXTRA"
    }
   ],
   "b": -1.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L04.01.B",
   "skill_id": "LANG.MECH.L04.01",
   "strand": "MECH",
   "level": 4,
   "ccss": "L.3.2a",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "In July, my family drove to Lakewood.",
   "wrong": [
    {
     "answer": "In july, my family drove to Lakewood.",
     "code": "CAP-MISSING"
    },
    {
     "answer": "In July, my Family drove to Lakewood.",
     "code": "CAP-EXTRA"
    },
    {
     "answer": "in July, my family drove to lakewood.",
     "code": "CAP-MISSING"
    }
   ],
   "b": -1.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L04.01.C",
   "skill_id": "LANG.MECH.L04.01",
   "strand": "MECH",
   "level": 4,
   "ccss": "L.3.2a",
   "format": "choose 1 of 4",
   "stem": "Which words need capital letters? \"we flew to israel for pesach.\"",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "we, israel, pesach",
   "wrong": [
    {
     "answer": "only the word we",
     "code": "CAP-MISSING"
    },
    {
     "answer": "only israel and pesach",
     "code": "CAP-MISSING"
    },
    {
     "answer": "we, flew, and for",
     "code": "CAP-EXTRA"
    }
   ],
   "b": -1.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.01.A",
   "skill_id": "LANG.GRAM.L04.01",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1f",
   "format": "choose 1 of 4",
   "stem": "Moshe and Eli built a fort. ___ worked all day.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "They",
   "wrong": [
    {
     "answer": "He",
     "code": "PRONOUN-NUMBER"
    },
    {
     "answer": "It",
     "code": "PRONOUN-NUMBER"
    },
    {
     "answer": "Them",
     "code": "PRONOUN-CASE"
    }
   ],
   "b": -1.18,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.01.B",
   "skill_id": "LANG.GRAM.L04.01",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1f",
   "format": "choose 1 of 4",
   "stem": "The teacher gave a prize to Chaim and ___.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "me",
   "wrong": [
    {
     "answer": "I",
     "code": "PRONOUN-CASE"
    },
    {
     "answer": "myself",
     "code": "PRONOUN-CASE"
    },
    {
     "answer": "mine",
     "code": "PRONOUN-CASE"
    }
   ],
   "b": -1.18,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.01.C",
   "skill_id": "LANG.GRAM.L04.01",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1f",
   "format": "choose 1 of 4",
   "stem": "The bike is old, but ___ still rides well.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "it",
   "wrong": [
    {
     "answer": "he",
     "code": "PRONOUN-NUMBER"
    },
    {
     "answer": "they",
     "code": "PRONOUN-NUMBER"
    },
    {
     "answer": "them",
     "code": "PRONOUN-CASE"
    }
   ],
   "b": -1.18,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.02.A",
   "skill_id": "LANG.GRAM.L04.02",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1f",
   "format": "choose 1 of 4",
   "stem": "The boys in my class ___ soccer at recess.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "play",
   "wrong": [
    {
     "answer": "plays",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "is playing",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "playing",
     "code": "FRAGMENT"
    }
   ],
   "b": -1,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.02.B",
   "skill_id": "LANG.GRAM.L04.02",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1f",
   "format": "choose 1 of 4",
   "stem": "My brother ___ to cheder every day.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "walks",
   "wrong": [
    {
     "answer": "walk",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "are walking",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "walking",
     "code": "FRAGMENT"
    }
   ],
   "b": -1,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.02.C",
   "skill_id": "LANG.GRAM.L04.02",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1f",
   "format": "choose 1 of 4",
   "stem": "Which sentence is correct?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The dogs bark at night.",
   "wrong": [
    {
     "answer": "The dogs barks at night.",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "The dog bark at night.",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "The dogs is barking at night.",
     "code": "AGREE-NUMBER"
    }
   ],
   "b": -1,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.03.A",
   "skill_id": "LANG.GRAM.L04.03",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1g",
   "format": "choose 1 of 4",
   "stem": "Of all the boys in the class, Yosef is the ___.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "tallest",
   "wrong": [
    {
     "answer": "taller",
     "code": "COMPARE-DEGREE"
    },
    {
     "answer": "most tallest",
     "code": "COMPARE-DOUBLE"
    },
    {
     "answer": "more tall",
     "code": "COMPARE-DEGREE"
    }
   ],
   "b": -0.83,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.03.B",
   "skill_id": "LANG.GRAM.L04.03",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1g",
   "format": "choose 1 of 4",
   "stem": "This box is ___ than that one.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "heavier",
   "wrong": [
    {
     "answer": "heaviest",
     "code": "COMPARE-DEGREE"
    },
    {
     "answer": "more heavier",
     "code": "COMPARE-DOUBLE"
    },
    {
     "answer": "heavy",
     "code": "COMPARE-DEGREE"
    }
   ],
   "b": -0.83,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L04.03.C",
   "skill_id": "LANG.GRAM.L04.03",
   "strand": "GRAM",
   "level": 4,
   "ccss": "L.3.1g",
   "format": "choose 1 of 4",
   "stem": "This puzzle is the ___ one I have ever done.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "most difficult",
   "wrong": [
    {
     "answer": "difficultest",
     "code": "COMPARE-DEGREE"
    },
    {
     "answer": "more difficult",
     "code": "COMPARE-DEGREE"
    },
    {
     "answer": "most difficultest",
     "code": "COMPARE-DOUBLE"
    }
   ],
   "b": -0.83,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L04.02.A",
   "skill_id": "LANG.MECH.L04.02",
   "strand": "MECH",
   "level": 4,
   "ccss": "L.3.2c",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Avi said, \"Let's go to the park.\"",
   "wrong": [
    {
     "answer": "Avi said, \"let's go to the park.\"",
     "code": "CAP-MISSING"
    },
    {
     "answer": "Avi said \"Let's go to the park\".",
     "code": "QUOTE-PLACE"
    },
    {
     "answer": "\"Avi said, Let's go to the park.\"",
     "code": "QUOTE-PLACE"
    }
   ],
   "b": -0.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L04.02.B",
   "skill_id": "LANG.MECH.L04.02",
   "strand": "MECH",
   "level": 4,
   "ccss": "L.3.2c",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Rebbi asked, \"Who knows the answer?\"",
   "wrong": [
    {
     "answer": "Rebbi asked, \"Who knows the answer\"?",
     "code": "QUOTE-PLACE"
    },
    {
     "answer": "Rebbi asked \"who knows the answer?\"",
     "code": "CAP-MISSING"
    },
    {
     "answer": "Rebbi asked, Who knows the answer?",
     "code": "QUOTE-MISSING"
    }
   ],
   "b": -0.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L04.02.C",
   "skill_id": "LANG.MECH.L04.02",
   "strand": "MECH",
   "level": 4,
   "ccss": "L.3.2c",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "\"I found it!\" shouted Shmuel.",
   "wrong": [
    {
     "answer": "\"I found it\"! shouted Shmuel.",
     "code": "QUOTE-PLACE"
    },
    {
     "answer": "I found it! shouted Shmuel.",
     "code": "QUOTE-MISSING"
    },
    {
     "answer": "\"I found it! shouted Shmuel.\"",
     "code": "QUOTE-PLACE"
    }
   ],
   "b": -0.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L05.01.A",
   "skill_id": "LANG.GRAM.L05.01",
   "strand": "GRAM",
   "level": 5,
   "ccss": "L.5.1d",
   "format": "choose 1 of 4",
   "stem": "Choose the word that keeps the tense the same: \"Yesterday we packed our bags and ___ to the airport.\"",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "drove",
   "wrong": [
    {
     "answer": "drive",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "will drive",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "are driving",
     "code": "TENSE-SHIFT"
    }
   ],
   "b": -0.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L05.01.B",
   "skill_id": "LANG.GRAM.L05.01",
   "strand": "GRAM",
   "level": 5,
   "ccss": "L.5.1d",
   "format": "choose 1 of 4",
   "stem": "Which sentence keeps the same tense?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "He opens the door and walks inside.",
   "wrong": [
    {
     "answer": "He opens the door and walked inside.",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "He opened the door and walks inside.",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "He will open the door and walked inside.",
     "code": "TENSE-SHIFT"
    }
   ],
   "b": -0.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L05.01.C",
   "skill_id": "LANG.GRAM.L05.01",
   "strand": "GRAM",
   "level": 5,
   "ccss": "L.5.1d",
   "format": "choose 1 of 4",
   "stem": "Which word should change? \"Every morning, Dovi wakes up early, davened with his father, and eats breakfast.\"",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "davened → davens",
   "wrong": [
    {
     "answer": "wakes → woke",
     "code": "TENSE-SHIFT"
    },
    {
     "answer": "morning → mornings",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "early → earlier",
     "code": "COMPARE-DEGREE"
    }
   ],
   "b": -0.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L05.01.A",
   "skill_id": "LANG.USE.L05.01",
   "strand": "USE",
   "level": 5,
   "ccss": "L.4.1g",
   "format": "choose 1 of 4",
   "stem": "___ going to the game after supper.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "They're",
   "wrong": [
    {
     "answer": "Their",
     "code": "HOMOPHONE"
    },
    {
     "answer": "There",
     "code": "HOMOPHONE"
    },
    {
     "answer": "Theyr'e",
     "code": "APOS-PLACE"
    }
   ],
   "b": 0,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L05.01.B",
   "skill_id": "LANG.USE.L05.01",
   "strand": "USE",
   "level": 5,
   "ccss": "L.4.1g",
   "format": "choose 1 of 4",
   "stem": "The puppy wagged ___ tail.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "its",
   "wrong": [
    {
     "answer": "it's",
     "code": "HOMOPHONE"
    },
    {
     "answer": "its'",
     "code": "APOS-PLACE"
    },
    {
     "answer": "it is",
     "code": "HOMOPHONE"
    }
   ],
   "b": 0,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L05.01.C",
   "skill_id": "LANG.USE.L05.01",
   "strand": "USE",
   "level": 5,
   "ccss": "L.4.1g",
   "format": "choose 1 of 4",
   "stem": "Which sentence is correct?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Your coat is too big for you.",
   "wrong": [
    {
     "answer": "You're coat is too big for you.",
     "code": "HOMOPHONE"
    },
    {
     "answer": "Your coat is to big for you.",
     "code": "HOMOPHONE"
    },
    {
     "answer": "Your coat is two big for you're.",
     "code": "HOMOPHONE"
    }
   ],
   "b": 0,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L05.01.A",
   "skill_id": "LANG.MECH.L05.01",
   "strand": "MECH",
   "level": 5,
   "ccss": "L.4.2c",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "We bought apples, honey, and challah.",
   "wrong": [
    {
     "answer": "We bought apples honey and challah.",
     "code": "COMMA-MISSING"
    },
    {
     "answer": "We bought, apples, honey, and challah.",
     "code": "COMMA-EXTRA"
    },
    {
     "answer": "We bought apples honey, and, challah.",
     "code": "COMMA-EXTRA"
    }
   ],
   "b": 0.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L05.01.B",
   "skill_id": "LANG.MECH.L05.01",
   "strand": "MECH",
   "level": 5,
   "ccss": "L.4.2c",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "I wanted to play, but it was raining.",
   "wrong": [
    {
     "answer": "I wanted to play but, it was raining.",
     "code": "COMMA-EXTRA"
    },
    {
     "answer": "I wanted, to play but it was raining.",
     "code": "COMMA-EXTRA"
    },
    {
     "answer": "I wanted to play, it was raining.",
     "code": "COMMA-SPLICE"
    }
   ],
   "b": 0.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L05.01.C",
   "skill_id": "LANG.MECH.L05.01",
   "strand": "MECH",
   "level": 5,
   "ccss": "L.4.2c",
   "format": "choose 1 of 4",
   "stem": "Which is written correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Yes, I finished my homework.",
   "wrong": [
    {
     "answer": "Yes I finished, my homework.",
     "code": "COMMA-EXTRA"
    },
    {
     "answer": "Yes I finished my homework.",
     "code": "COMMA-MISSING"
    },
    {
     "answer": "Yes, I, finished my homework.",
     "code": "COMMA-EXTRA"
    }
   ],
   "b": 0.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L06.01.A",
   "skill_id": "LANG.GRAM.L06.01",
   "strand": "GRAM",
   "level": 6,
   "ccss": "L.5.1e",
   "format": "choose 1 of 4",
   "stem": "Pick the joining word that makes sense: \"I studied hard, ___ the test was still difficult.\"",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "yet",
   "wrong": [
    {
     "answer": "so",
     "code": "CONJ-LOGIC"
    },
    {
     "answer": "because",
     "code": "CONJ-LOGIC"
    },
    {
     "answer": "or",
     "code": "CONJ-LOGIC"
    }
   ],
   "b": 0.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L06.01.B",
   "skill_id": "LANG.GRAM.L06.01",
   "strand": "GRAM",
   "level": 6,
   "ccss": "L.5.1e",
   "format": "choose 1 of 4",
   "stem": "Pick the best word: \"We stayed inside ___ it was storming.\"",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "because",
   "wrong": [
    {
     "answer": "although",
     "code": "CONJ-LOGIC"
    },
    {
     "answer": "unless",
     "code": "CONJ-LOGIC"
    },
    {
     "answer": "but",
     "code": "CONJ-LOGIC"
    }
   ],
   "b": 0.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L06.01.C",
   "skill_id": "LANG.GRAM.L06.01",
   "strand": "GRAM",
   "level": 6,
   "ccss": "L.5.1e",
   "format": "choose 1 of 4",
   "stem": "Which pair is used correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Neither Avi nor Dovid was late.",
   "wrong": [
    {
     "answer": "Neither Avi or Dovid was late.",
     "code": "CONJ-PAIR"
    },
    {
     "answer": "Either Avi nor Dovid was late.",
     "code": "CONJ-PAIR"
    },
    {
     "answer": "Neither Avi and Dovid was late.",
     "code": "CONJ-PAIR"
    }
   ],
   "b": 0.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L06.02.A",
   "skill_id": "LANG.GRAM.L06.02",
   "strand": "GRAM",
   "level": 6,
   "ccss": "L.5.1b",
   "format": "choose 1 of 4",
   "stem": "By the time we arrived, the train ___.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "had left",
   "wrong": [
    {
     "answer": "has left",
     "code": "PERFECT-FORM"
    },
    {
     "answer": "have left",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "had leaved",
     "code": "IRREG-OVERREG"
    }
   ],
   "b": 0.88,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L06.02.B",
   "skill_id": "LANG.GRAM.L06.02",
   "strand": "GRAM",
   "level": 6,
   "ccss": "L.5.1b",
   "format": "choose 1 of 4",
   "stem": "I ___ this sefer three times already.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "have read",
   "wrong": [
    {
     "answer": "had readed",
     "code": "IRREG-OVERREG"
    },
    {
     "answer": "has read",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "will have readed",
     "code": "IRREG-OVERREG"
    }
   ],
   "b": 0.88,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L06.02.C",
   "skill_id": "LANG.GRAM.L06.02",
   "strand": "GRAM",
   "level": 6,
   "ccss": "L.5.1b",
   "format": "choose 1 of 4",
   "stem": "By next June, my brother ___ his first masechta.",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "will have finished",
   "wrong": [
    {
     "answer": "has finished",
     "code": "PERFECT-FORM"
    },
    {
     "answer": "had finished",
     "code": "PERFECT-FORM"
    },
    {
     "answer": "will have finish",
     "code": "PERFECT-FORM"
    }
   ],
   "b": 0.88,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L06.01.A",
   "skill_id": "LANG.MECH.L06.01",
   "strand": "MECH",
   "level": 6,
   "ccss": "L.5.2d",
   "format": "choose 1 of 4",
   "stem": "Which shows a book title correctly (typed)?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "I read <i>The Long Road Home</i> last week.",
   "wrong": [
    {
     "answer": "I read \"the long road home\" last week.",
     "code": "TITLE-FORMAT"
    },
    {
     "answer": "I read The long road home last week.",
     "code": "TITLE-FORMAT"
    },
    {
     "answer": "I read <i>the Long road Home</i> last week.",
     "code": "TITLE-FORMAT"
    }
   ],
   "b": 1.12,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L06.01.B",
   "skill_id": "LANG.MECH.L06.01",
   "strand": "MECH",
   "level": 6,
   "ccss": "L.5.2d",
   "format": "choose 1 of 4",
   "stem": "Which title is capitalized correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "A Journey to the Mountains",
   "wrong": [
    {
     "answer": "A Journey To The Mountains",
     "code": "TITLE-FORMAT"
    },
    {
     "answer": "A journey to the mountains",
     "code": "TITLE-FORMAT"
    },
    {
     "answer": "a Journey to the Mountains",
     "code": "TITLE-FORMAT"
    }
   ],
   "b": 1.12,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L06.01.C",
   "skill_id": "LANG.MECH.L06.01",
   "strand": "MECH",
   "level": 6,
   "ccss": "L.5.2d",
   "format": "choose 1 of 4",
   "stem": "How should the title of a short story be shown?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "in quotation marks",
   "wrong": [
    {
     "answer": "underlined twice",
     "code": "TITLE-FORMAT"
    },
    {
     "answer": "in all capital letters",
     "code": "TITLE-FORMAT"
    },
    {
     "answer": "in parentheses",
     "code": "TITLE-FORMAT"
    }
   ],
   "b": 1.12,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L06.02.A",
   "skill_id": "LANG.MECH.L06.02",
   "strand": "MECH",
   "level": 6,
   "ccss": "L.5.2e",
   "format": "choose 1 of 4",
   "stem": "hope + ing =",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "hoping",
   "wrong": [
    {
     "answer": "hopeing",
     "code": "SUFFIX-RULE"
    },
    {
     "answer": "hopping",
     "code": "SUFFIX-RULE"
    },
    {
     "answer": "hopying",
     "code": "SUFFIX-RULE"
    }
   ],
   "b": 1.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L06.02.B",
   "skill_id": "LANG.MECH.L06.02",
   "strand": "MECH",
   "level": 6,
   "ccss": "L.5.2e",
   "format": "choose 1 of 4",
   "stem": "happy + ness =",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "happiness",
   "wrong": [
    {
     "answer": "happyness",
     "code": "SUFFIX-RULE"
    },
    {
     "answer": "happiniss",
     "code": "SPELL-PATTERN"
    },
    {
     "answer": "happeness",
     "code": "SUFFIX-RULE"
    }
   ],
   "b": 1.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L06.02.C",
   "skill_id": "LANG.MECH.L06.02",
   "strand": "MECH",
   "level": 6,
   "ccss": "L.5.2e",
   "format": "choose 1 of 4",
   "stem": "begin + ing =",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "beginning",
   "wrong": [
    {
     "answer": "begining",
     "code": "SUFFIX-RULE"
    },
    {
     "answer": "beginnin",
     "code": "SPELL-PATTERN"
    },
    {
     "answer": "beggining",
     "code": "SUFFIX-RULE"
    }
   ],
   "b": 1.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L07.01.A",
   "skill_id": "LANG.GRAM.L07.01",
   "strand": "GRAM",
   "level": 7,
   "ccss": "L.6.1c",
   "format": "choose 1 of 4",
   "stem": "Which sentence uses pronouns correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Every boy should bring his own lunch.",
   "wrong": [
    {
     "answer": "Every boy should bring their own lunch.",
     "code": "PRONOUN-NUMBER"
    },
    {
     "answer": "Every boy should bring there own lunch.",
     "code": "HOMOPHONE"
    },
    {
     "answer": "Every boy should bring him own lunch.",
     "code": "PRONOUN-CASE"
    }
   ],
   "b": 1.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L07.01.B",
   "skill_id": "LANG.GRAM.L07.01",
   "strand": "GRAM",
   "level": 7,
   "ccss": "L.6.1c",
   "format": "choose 1 of 4",
   "stem": "Which sentence is clear?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "When Yaakov met Eli, Eli was holding a map.",
   "wrong": [
    {
     "answer": "When Yaakov met Eli, he was holding a map.",
     "code": "PRONOUN-VAGUE"
    },
    {
     "answer": "When he met Eli, he was holding a map.",
     "code": "PRONOUN-VAGUE"
    },
    {
     "answer": "When Yaakov met him, he was holding it.",
     "code": "PRONOUN-VAGUE"
    }
   ],
   "b": 1.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L07.01.C",
   "skill_id": "LANG.GRAM.L07.01",
   "strand": "GRAM",
   "level": 7,
   "ccss": "L.6.1c",
   "format": "choose 1 of 4",
   "stem": "Choose the correct word: \"Between you and ___, this is the best kugel.\"",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "me",
   "wrong": [
    {
     "answer": "I",
     "code": "PRONOUN-CASE"
    },
    {
     "answer": "myself",
     "code": "PRONOUN-CASE"
    },
    {
     "answer": "mine",
     "code": "PRONOUN-CASE"
    }
   ],
   "b": 1.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L07.01.A",
   "skill_id": "LANG.MECH.L07.01",
   "strand": "MECH",
   "level": 7,
   "ccss": "L.6.2a",
   "format": "choose 1 of 4",
   "stem": "Which is punctuated correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "My uncle, who lives in Chicago, is a doctor.",
   "wrong": [
    {
     "answer": "My uncle who lives in Chicago, is a doctor.",
     "code": "COMMA-NONRESTRICT"
    },
    {
     "answer": "My uncle, who lives in Chicago is a doctor.",
     "code": "COMMA-NONRESTRICT"
    },
    {
     "answer": "My uncle who, lives in Chicago, is a doctor.",
     "code": "COMMA-EXTRA"
    }
   ],
   "b": 2,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L07.01.B",
   "skill_id": "LANG.MECH.L07.01",
   "strand": "MECH",
   "level": 7,
   "ccss": "L.6.2a",
   "format": "choose 1 of 4",
   "stem": "Which is punctuated correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The Erie Canal (finished in 1825) changed trade.",
   "wrong": [
    {
     "answer": "The Erie Canal (finished in 1825 changed trade.",
     "code": "PAREN-UNCLOSED"
    },
    {
     "answer": "The Erie Canal finished in 1825) changed trade.",
     "code": "PAREN-UNCLOSED"
    },
    {
     "answer": "The Erie Canal, (finished in 1825), changed trade.",
     "code": "COMMA-EXTRA"
    }
   ],
   "b": 2,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L07.01.C",
   "skill_id": "LANG.MECH.L07.01",
   "strand": "MECH",
   "level": 7,
   "ccss": "L.6.2a",
   "format": "choose 1 of 4",
   "stem": "Which uses dashes correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The prize—a brand-new bike—went to Natan.",
   "wrong": [
    {
     "answer": "The prize—a brand-new bike went to Natan.",
     "code": "DASH-UNPAIRED"
    },
    {
     "answer": "The prize a brand-new bike—went to Natan.",
     "code": "DASH-UNPAIRED"
    },
    {
     "answer": "The—prize a brand-new bike—went to Natan.",
     "code": "DASH-UNPAIRED"
    }
   ],
   "b": 2,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L07.01.A",
   "skill_id": "LANG.USE.L07.01",
   "strand": "USE",
   "level": 7,
   "ccss": "L.6.3b",
   "format": "choose 1 of 4",
   "stem": "Which sentence fits a letter to the menahel?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "I would like to suggest a longer recess.",
   "wrong": [
    {
     "answer": "Recess is way too short, seriously.",
     "code": "INFORMAL"
    },
    {
     "answer": "Can u make recess longer?",
     "code": "INFORMAL"
    },
    {
     "answer": "Recess is totally lame right now.",
     "code": "INFORMAL"
    }
   ],
   "b": 2.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L07.01.B",
   "skill_id": "LANG.USE.L07.01",
   "strand": "USE",
   "level": 7,
   "ccss": "L.6.3b",
   "format": "choose 1 of 4",
   "stem": "Which sentence is best for a science report?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The plant grew four centimeters in a week.",
   "wrong": [
    {
     "answer": "The plant grew like crazy in a week.",
     "code": "INFORMAL"
    },
    {
     "answer": "The plant got super big really fast.",
     "code": "INFORMAL"
    },
    {
     "answer": "The plant grew a ton, which was awesome.",
     "code": "INFORMAL"
    }
   ],
   "b": 2.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L07.01.C",
   "skill_id": "LANG.USE.L07.01",
   "strand": "USE",
   "level": 7,
   "ccss": "L.6.3b",
   "format": "choose 1 of 4",
   "stem": "Which is the most formal way to end a letter to a rav?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Thank you for your time and guidance.",
   "wrong": [
    {
     "answer": "Thanks a bunch, see ya!",
     "code": "INFORMAL"
    },
    {
     "answer": "OK, that's all, bye now.",
     "code": "INFORMAL"
    },
    {
     "answer": "Write back soon, cool?",
     "code": "INFORMAL"
    }
   ],
   "b": 2.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L08.01.A",
   "skill_id": "LANG.GRAM.L08.01",
   "strand": "GRAM",
   "level": 8,
   "ccss": "L.7.1b",
   "format": "choose 1 of 4",
   "stem": "Which is a complex sentence (a main idea plus a dependent part)?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Because it snowed, school opened late.",
   "wrong": [
    {
     "answer": "It snowed, and school opened late.",
     "code": "CLAUSE-TYPE"
    },
    {
     "answer": "It snowed. School opened late.",
     "code": "CLAUSE-TYPE"
    },
    {
     "answer": "Snow and a late opening for school.",
     "code": "FRAGMENT"
    }
   ],
   "b": 2.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L08.01.B",
   "skill_id": "LANG.GRAM.L08.01",
   "strand": "GRAM",
   "level": 8,
   "ccss": "L.7.1b",
   "format": "choose 1 of 4",
   "stem": "Which sentence is a run-on?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The bell rang the boys ran outside.",
   "wrong": [
    {
     "answer": "The bell rang, and the boys ran outside.",
     "code": "RUN-ON"
    },
    {
     "answer": "When the bell rang, the boys ran outside.",
     "code": "RUN-ON"
    },
    {
     "answer": "The bell rang; the boys ran outside.",
     "code": "RUN-ON"
    }
   ],
   "b": 2.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L08.01.C",
   "skill_id": "LANG.GRAM.L08.01",
   "strand": "GRAM",
   "level": 8,
   "ccss": "L.7.1b",
   "format": "choose 1 of 4",
   "stem": "Which best combines: \"Shmuel studied. He wanted to do well.\"?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Shmuel studied because he wanted to do well.",
   "wrong": [
    {
     "answer": "Shmuel studied, he wanted to do well.",
     "code": "COMMA-SPLICE"
    },
    {
     "answer": "Shmuel studied, but he wanted to do well.",
     "code": "CONJ-LOGIC"
    },
    {
     "answer": "Shmuel studied he wanted to do well.",
     "code": "RUN-ON"
    }
   ],
   "b": 2.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L08.02.A",
   "skill_id": "LANG.GRAM.L08.02",
   "strand": "GRAM",
   "level": 8,
   "ccss": "L.7.1c",
   "format": "choose 1 of 4",
   "stem": "Which sentence is clear?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Walking to shul, I saw a deer in the woods.",
   "wrong": [
    {
     "answer": "Walking to shul, a deer was in the woods.",
     "code": "MODIFIER-DANGLING"
    },
    {
     "answer": "A deer, walking to shul, I saw in the woods.",
     "code": "MODIFIER-MISPLACED"
    },
    {
     "answer": "I saw a deer walking to shul in the woods.",
     "code": "MODIFIER-MISPLACED"
    }
   ],
   "b": 3,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L08.02.B",
   "skill_id": "LANG.GRAM.L08.02",
   "strand": "GRAM",
   "level": 8,
   "ccss": "L.7.1c",
   "format": "choose 1 of 4",
   "stem": "Which sentence is clear?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "After finishing his homework, Moshe went outside.",
   "wrong": [
    {
     "answer": "After finishing his homework, the yard was sunny.",
     "code": "MODIFIER-DANGLING"
    },
    {
     "answer": "After finishing, outside went Moshe his homework.",
     "code": "MODIFIER-MISPLACED"
    },
    {
     "answer": "The yard, after finishing his homework, called Moshe.",
     "code": "MODIFIER-DANGLING"
    }
   ],
   "b": 3,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L08.02.C",
   "skill_id": "LANG.GRAM.L08.02",
   "strand": "GRAM",
   "level": 8,
   "ccss": "L.7.1c",
   "format": "choose 1 of 4",
   "stem": "Where should \"only\" go to say that Avi ate one cookie and nothing more?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Avi ate only one cookie.",
   "wrong": [
    {
     "answer": "Only Avi ate one cookie.",
     "code": "MODIFIER-MISPLACED"
    },
    {
     "answer": "Avi only ate one cookie only.",
     "code": "MODIFIER-MISPLACED"
    },
    {
     "answer": "Avi ate one only cookie.",
     "code": "MODIFIER-MISPLACED"
    }
   ],
   "b": 3,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L08.01.A",
   "skill_id": "LANG.USE.L08.01",
   "strand": "USE",
   "level": 8,
   "ccss": "L.7.3a",
   "format": "choose 1 of 4",
   "stem": "Which sentence says it best, with no extra words?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "We met at noon.",
   "wrong": [
    {
     "answer": "We met at twelve noon in the middle of the day.",
     "code": "WORDY"
    },
    {
     "answer": "At noon, at that time, we met together.",
     "code": "WORDY"
    },
    {
     "answer": "We met together at the time of noon.",
     "code": "WORDY"
    }
   ],
   "b": 3.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L08.01.B",
   "skill_id": "LANG.USE.L08.01",
   "strand": "USE",
   "level": 8,
   "ccss": "L.7.3a",
   "format": "choose 1 of 4",
   "stem": "Which is the most concise?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The project failed because nobody planned.",
   "wrong": [
    {
     "answer": "The reason the project failed was because nobody planned.",
     "code": "WORDY"
    },
    {
     "answer": "Due to the fact that nobody planned, the project failed.",
     "code": "WORDY"
    },
    {
     "answer": "The project, which failed, failed because no one planned it.",
     "code": "WORDY"
    }
   ],
   "b": 3.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L08.01.C",
   "skill_id": "LANG.USE.L08.01",
   "strand": "USE",
   "level": 8,
   "ccss": "L.7.3a",
   "format": "choose 1 of 4",
   "stem": "Which phrase can replace \"in order to\"?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "to",
   "wrong": [
    {
     "answer": "so as for to",
     "code": "WORDY"
    },
    {
     "answer": "for the purpose of",
     "code": "WORDY"
    },
    {
     "answer": "in the event that",
     "code": "WORDY"
    }
   ],
   "b": 3.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L09.01.A",
   "skill_id": "LANG.GRAM.L09.01",
   "strand": "GRAM",
   "level": 9,
   "ccss": "L.8.1b",
   "format": "choose 1 of 4",
   "stem": "Which sentence is in active voice?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The committee chose a new leader.",
   "wrong": [
    {
     "answer": "A new leader was chosen by the committee.",
     "code": "PASSIVE"
    },
    {
     "answer": "A new leader has been chosen.",
     "code": "PASSIVE"
    },
    {
     "answer": "The new leader was chosen yesterday.",
     "code": "PASSIVE"
    }
   ],
   "b": 3.65,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L09.01.B",
   "skill_id": "LANG.GRAM.L09.01",
   "strand": "GRAM",
   "level": 9,
   "ccss": "L.8.1b",
   "format": "choose 1 of 4",
   "stem": "Rewrite in active voice: \"The window was broken by the ball.\"",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The ball broke the window.",
   "wrong": [
    {
     "answer": "The window broke by the ball.",
     "code": "PASSIVE"
    },
    {
     "answer": "The window was broke by the ball.",
     "code": "PASSIVE"
    },
    {
     "answer": "By the ball, the window was broken.",
     "code": "PASSIVE"
    }
   ],
   "b": 3.65,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.GRAM.L09.01.C",
   "skill_id": "LANG.GRAM.L09.01",
   "strand": "GRAM",
   "level": 9,
   "ccss": "L.8.1b",
   "format": "choose 1 of 4",
   "stem": "When is passive voice the better choice?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "When the doer is unknown or unimportant",
   "wrong": [
    {
     "answer": "Whenever you want to sound more formal",
     "code": "PASSIVE"
    },
    {
     "answer": "When the sentence is a question",
     "code": "PASSIVE"
    },
    {
     "answer": "When the verb is in the past tense",
     "code": "PASSIVE"
    }
   ],
   "b": 3.65,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L09.01.A",
   "skill_id": "LANG.MECH.L09.01",
   "strand": "MECH",
   "level": 9,
   "ccss": "L.8.2a",
   "format": "choose 1 of 4",
   "stem": "Which uses a semicolon correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "I wanted to stay; however, it was late.",
   "wrong": [
    {
     "answer": "I wanted to stay; however it was late.",
     "code": "COMMA-MISSING"
    },
    {
     "answer": "I wanted; to stay however, it was late.",
     "code": "SEMICOLON-WRONG"
    },
    {
     "answer": "I wanted to stay, however; it was late.",
     "code": "SEMICOLON-WRONG"
    }
   ],
   "b": 4,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L09.01.B",
   "skill_id": "LANG.MECH.L09.01",
   "strand": "MECH",
   "level": 9,
   "ccss": "L.8.2a",
   "format": "choose 1 of 4",
   "stem": "Which uses a colon correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Bring three things: a siddur, a pen, and a snack.",
   "wrong": [
    {
     "answer": "Bring: a siddur, a pen, and a snack.",
     "code": "COLON-WRONG"
    },
    {
     "answer": "Bring three things a siddur: a pen, and a snack.",
     "code": "COLON-WRONG"
    },
    {
     "answer": "Bring three: things a siddur, a pen, and a snack.",
     "code": "COLON-WRONG"
    }
   ],
   "b": 4,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.MECH.L09.01.C",
   "skill_id": "LANG.MECH.L09.01",
   "strand": "MECH",
   "level": 9,
   "ccss": "L.8.2a",
   "format": "choose 1 of 4",
   "stem": "Which uses an ellipsis to show a pause correctly?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "\"I think… no, I'm sure,\" said Avi.",
   "wrong": [
    {
     "answer": "\"I think, no… I'm sure\" said Avi.",
     "code": "QUOTE-PLACE"
    },
    {
     "answer": "\"I think no I'm sure…,\" said Avi.",
     "code": "ELLIPSIS-WRONG"
    },
    {
     "answer": "\"I… think no, I'm sure\" said… Avi.",
     "code": "ELLIPSIS-WRONG"
    }
   ],
   "b": 4,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L09.01.A",
   "skill_id": "LANG.USE.L09.01",
   "strand": "USE",
   "level": 9,
   "ccss": "L.8.1d",
   "format": "choose 1 of 4",
   "stem": "Which sentence has no errors?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "Each of the students has finished his project.",
   "wrong": [
    {
     "answer": "Each of the students have finished his project.",
     "code": "AGREE-NUMBER"
    },
    {
     "answer": "Each of the students has finished their project.",
     "code": "PRONOUN-NUMBER"
    },
    {
     "answer": "Each of the student's has finished his project.",
     "code": "APOS-PLURAL"
    }
   ],
   "b": 4.35,
   "form": "A",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L09.01.B",
   "skill_id": "LANG.USE.L09.01",
   "strand": "USE",
   "level": 9,
   "ccss": "L.8.1d",
   "format": "choose 1 of 4",
   "stem": "Which sentence avoids an unnecessary shift?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "If I were the captain, I would choose Dovid.",
   "wrong": [
    {
     "answer": "If I was the captain, I would choose Dovid.",
     "code": "MOOD-SHIFT"
    },
    {
     "answer": "If I were the captain, I will choose Dovid.",
     "code": "MOOD-SHIFT"
    },
    {
     "answer": "If I am the captain, I would choose Dovid.",
     "code": "MOOD-SHIFT"
    }
   ],
   "b": 4.35,
   "form": "B",
   "status": "Draft",
   "reviewer": null
  },
  {
   "item_id": "PF.LA.LANG.USE.L09.01.C",
   "skill_id": "LANG.USE.L09.01",
   "strand": "USE",
   "level": 9,
   "ccss": "L.8.1d",
   "format": "choose 1 of 4",
   "stem": "Which sentence has no errors?",
   "audio": "Read aloud only if staff turned on \"read questions aloud\".",
   "answer": "The team lost its first game, but it played well.",
   "wrong": [
    {
     "answer": "The team lost it's first game, but it played well.",
     "code": "HOMOPHONE"
    },
    {
     "answer": "The team lost its first game but, it played well.",
     "code": "COMMA-EXTRA"
    },
    {
     "answer": "The team lost its first game, but they plays well.",
     "code": "AGREE-NUMBER"
    }
   ],
   "b": 4.35,
   "form": "C",
   "status": "Draft",
   "reviewer": null
  }
 ]
};/*</LA1>*/
