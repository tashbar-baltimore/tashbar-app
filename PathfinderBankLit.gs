/* PATHFINDER literacy measures: maze (PF-P4B forms A/B, LOG 2129; PF-P4D forms C/D, LOG 2309), listening/reading pairs
   (PF-P4C v2, LOG 2304, replaces 2145), oral reading passages, word lists, rapid naming and fluency norms (PF-P4, LOG 2108).
   Oral reading / word lists / rapid naming wait for Stage C (microphone permission, parent notice, speech-tool decision): stored here, not used by any screen.
   Built by script from the HQ JSON files (07 PATHFINDER BUILD PROMPT v5, local build 2026-11-12). Do not edit by hand: rebuild.
   Each file is embedded exactly as published (between the <KEY> marker comments), so its sha256 matches the LOG CHANGE.
   Every record is Draft until reviewers mark it Approved. */
/*<P4B>*/var PF_MAZE_AB = {
 "bank": "PF-P4B_Pathfinder_Maze_DRAFT",
 "made": "2026-11-11",
 "by": "CLAUDE (developer@)",
 "status": "Draft",
 "minutes": 3,
 "score": "correct - 0.5*incorrect",
 "codes": {
  "MAZE-SYNTAX": "wrong kind of word; sentence breaks",
  "MAZE-MEANING": "right kind of word; meaning wrong"
 },
 "passages": [
  {
   "passage_id": "PF.MAZE.G2.A",
   "grade": 2,
   "form": "A",
   "title": "The New Puppy Next Door",
   "words": 182,
   "first_sentence": "Our neighbor Mr.",
   "tokens": [
    "Katz",
    "got",
    "a",
    "new",
    "puppy",
    "last",
    "week.",
    "The",
    "puppy",
    "is",
    "small",
    "and",
    "brown",
    "with",
    "one",
    "white",
    "ear.",
    "His",
    "name",
    "is",
    "Pretzel",
    "because",
    "his",
    "tail",
    "curls",
    "up",
    "like",
    "a",
    "pretzel.",
    "Every",
    "morning,",
    "Mr.",
    "Katz",
    "takes",
    "Pretzel",
    "for",
    "a",
    "walk",
    "down",
    "our",
    "street.",
    "Pretzel",
    "pulls",
    "on",
    "his",
    "leash",
    "and",
    "sniffs",
    "every",
    "tree",
    "and",
    "every",
    "bush.",
    "When",
    "he",
    "sees",
    "me,",
    "he",
    "wags",
    "his",
    "tail",
    "so",
    "hard",
    "that",
    "his",
    "whole",
    "body",
    "wiggles.",
    "Mr.",
    "Katz",
    "lets",
    "me",
    "pet",
    "him",
    "gently",
    "on",
    "the",
    "head.",
    "Pretzel",
    "licks",
    "my",
    "hand",
    "and",
    "jumps",
    "up",
    "on",
    "my",
    "legs.",
    "Yesterday,",
    "Mr.",
    "Katz",
    "asked",
    "if",
    "I",
    "could",
    "help",
    "him",
    "teach",
    "Pretzel",
    "to",
    "sit.",
    "I",
    "held",
    "a",
    "small",
    "treat",
    "above",
    "the",
    "puppy's",
    "nose.",
    "Slowly,",
    "I",
    "moved",
    "it",
    "back",
    "over",
    "his",
    "head.",
    "Pretzel",
    "looked",
    "up",
    "at",
    "the",
    "treat,",
    "and",
    "his",
    "back",
    "end",
    "went",
    "down",
    "on",
    "the",
    "grass.",
    "\"Good",
    "sit!\"",
    "I",
    "said,",
    "and",
    "I",
    "gave",
    "him",
    "the",
    "treat.",
    "We",
    "did",
    "it",
    "again",
    "and",
    "again.",
    "By",
    "the",
    "end",
    "of",
    "the",
    "day,",
    "Pretzel",
    "could",
    "sit",
    "every",
    "time",
    "I",
    "asked.",
    "Mr.",
    "Katz",
    "said",
    "I",
    "was",
    "a",
    "great",
    "helper.",
    "Tomorrow,",
    "we",
    "will",
    "try",
    "to",
    "teach",
    "him",
    "to",
    "stay."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": ".",
     "options": [
      "door",
      "week",
      "slowly"
     ],
     "answer": "week",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "door",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "with",
      "jumped",
      "under"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "Quickly",
      "Kitchen",
      "Pretzel"
     ],
     "answer": "Pretzel",
     "wrong": [
      {
       "answer": "Quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Kitchen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "our",
      "a",
      "clapped"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "our",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "Pretzel",
      "Gently",
      "Milk"
     ],
     "answer": "Pretzel",
     "wrong": [
      {
       "answer": "Gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Milk",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "Loudly",
      "Water",
      "Pretzel"
     ],
     "answer": "Pretzel",
     "wrong": [
      {
       "answer": "Loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Water",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "hungry",
      "every",
      "hopped"
     ],
     "answer": "every",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "sees",
      "table",
      "eats"
     ],
     "answer": "sees",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eats",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "window",
      "quietly",
      "hard"
     ],
     "answer": "hard",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "quietly",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "Tree",
      "Katz",
      "Softly"
     ],
     "answer": "Katz",
     "wrong": [
      {
       "answer": "Softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Tree",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "the",
      "skipped",
      "rainy"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rainy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "carrot",
      "sleeps",
      "jumps"
     ],
     "answer": "jumps",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeps",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "Hat",
      "Katz",
      "Happily"
     ],
     "answer": "Katz",
     "wrong": [
      {
       "answer": "Happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Hat",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "teach",
      "blanket",
      "paint"
     ],
     "answer": "teach",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "paint",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "swim",
      "loud",
      "small"
     ],
     "answer": "small",
     "wrong": [
      {
       "answer": "swim",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "Trees",
      "I",
      "Sadly"
     ],
     "answer": "I",
     "wrong": [
      {
       "answer": "Sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Trees",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "Pretzel",
      "Bravely",
      "Bread"
     ],
     "answer": "Pretzel",
     "wrong": [
      {
       "answer": "Bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "climbed",
      "blue",
      "his"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "blue",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": ".",
     "options": [
      "sky",
      "grass",
      "calmly"
     ],
     "answer": "grass",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sky",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "gave",
      "ladder",
      "told"
     ],
     "answer": "gave",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "told",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "bucket",
      "never",
      "again"
     ],
     "answer": "again",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "green",
      "the",
      "washed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "I",
      "Neatly",
      "Rain"
     ],
     "answer": "I",
     "wrong": [
      {
       "answer": "Neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "baked",
      "his",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "his",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "of",
      "to",
      "swept"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "of",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G2.B",
   "grade": 2,
   "form": "B",
   "title": "The Class Garden",
   "words": 179,
   "first_sentence": "Our class planted a garden behind the school this spring.",
   "tokens": [
    "First,",
    "our",
    "rebbe",
    "showed",
    "us",
    "how",
    "to",
    "dig",
    "small",
    "holes",
    "in",
    "the",
    "dirt.",
    "We",
    "put",
    "two",
    "bean",
    "seeds",
    "in",
    "each",
    "hole",
    "and",
    "covered",
    "them",
    "up.",
    "Then",
    "we",
    "watered",
    "the",
    "seeds",
    "with",
    "a",
    "green",
    "can.",
    "Every",
    "day",
    "after",
    "lunch,",
    "we",
    "went",
    "outside",
    "to",
    "check",
    "on",
    "the",
    "garden.",
    "For",
    "a",
    "whole",
    "week,",
    "nothing",
    "happened,",
    "and",
    "some",
    "boys",
    "thought",
    "the",
    "seeds",
    "were",
    "dead.",
    "Then",
    "one",
    "morning,",
    "Shmuel",
    "shouted,",
    "\"Look!",
    "Something",
    "is",
    "growing!\"",
    "Tiny",
    "green",
    "leaves",
    "were",
    "poking",
    "up",
    "out",
    "of",
    "the",
    "dirt.",
    "We",
    "were",
    "so",
    "excited",
    "that",
    "we",
    "all",
    "ran",
    "over",
    "to",
    "see.",
    "The",
    "plants",
    "grew",
    "taller",
    "every",
    "day.",
    "Soon",
    "they",
    "needed",
    "sticks",
    "to",
    "climb",
    "on,",
    "so",
    "we",
    "pushed",
    "long",
    "sticks",
    "into",
    "the",
    "ground.",
    "The",
    "bean",
    "plants",
    "wrapped",
    "around",
    "the",
    "sticks",
    "and",
    "kept",
    "climbing",
    "up.",
    "By",
    "the",
    "end",
    "of",
    "the",
    "year,",
    "the",
    "plants",
    "were",
    "taller",
    "than",
    "our",
    "rebbe.",
    "We",
    "picked",
    "the",
    "beans",
    "and",
    "put",
    "them",
    "in",
    "a",
    "big",
    "bowl.",
    "Our",
    "rebbe",
    "cooked",
    "them,",
    "and",
    "we",
    "each",
    "had",
    "a",
    "taste.",
    "They",
    "were",
    "the",
    "best",
    "beans",
    "I",
    "ever",
    "ate,",
    "because",
    "we",
    "grew",
    "them",
    "ourselves."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "up",
      "to",
      "whistled"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "up",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "We",
      "Rarely",
      "Fish"
     ],
     "answer": "We",
     "wrong": [
      {
       "answer": "Rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Fish",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "barely",
      "sky",
      "hole"
     ],
     "answer": "hole",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sky",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "ate",
      "watered",
      "basket"
     ],
     "answer": "watered",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "Every",
      "Wiggled",
      "Loud"
     ],
     "answer": "Every",
     "wrong": [
      {
       "answer": "Wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "juggled",
      "of",
      "to"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "of",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "hungry",
      "whole",
      "sing"
     ],
     "answer": "whole",
     "wrong": [
      {
       "answer": "sing",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "thought",
      "mitten",
      "sang"
     ],
     "answer": "thought",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": ",",
     "options": [
      "eagerly",
      "spoon",
      "morning"
     ],
     "answer": "morning",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "Angry",
      "Tiny",
      "Jump"
     ],
     "answer": "Tiny",
     "wrong": [
      {
       "answer": "Jump",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Angry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "of",
      "tumbled",
      "at"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "at",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "giggled",
      "if",
      "that"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "if",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "Sad",
      "The",
      "Stirred"
     ],
     "answer": "The",
     "wrong": [
      {
       "answer": "Stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Sad",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "they",
      "kindly",
      "clouds"
     ],
     "answer": "they",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "proudly",
      "rain",
      "we"
     ],
     "answer": "we",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "Noisy",
      "The",
      "Shouted"
     ],
     "answer": "The",
     "wrong": [
      {
       "answer": "Shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Noisy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "and",
      "hummed",
      "unless"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "chewed",
      "on",
      "of"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "on",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "as",
      "than",
      "splashed"
     ],
     "answer": "than",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "as",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "and",
      "rattled",
      "but"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "but",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "Crawled",
      "Tall",
      "Our"
     ],
     "answer": "Our",
     "wrong": [
      {
       "answer": "Crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Tall",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "drove",
      "had",
      "garden"
     ],
     "answer": "had",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "drove",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "beans",
      "boldly",
      "rocks"
     ],
     "answer": "beans",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rocks",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "briskly",
      "shoes",
      "them"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "shoes",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G3.A",
   "grade": 3,
   "form": "A",
   "title": "A Day at the Fire Station",
   "words": 208,
   "first_sentence": "Last Thursday, our class took a trip to the fire station on Elm Street.",
   "tokens": [
    "A",
    "firefighter",
    "named",
    "Mr.",
    "Rubin",
    "met",
    "us",
    "at",
    "the",
    "big",
    "red",
    "door.",
    "He",
    "showed",
    "us",
    "the",
    "bright",
    "red",
    "fire",
    "truck",
    "parked",
    "inside.",
    "It",
    "was",
    "much",
    "bigger",
    "than",
    "it",
    "looks",
    "on",
    "the",
    "road.",
    "Mr.",
    "Rubin",
    "let",
    "us",
    "climb",
    "into",
    "the",
    "front",
    "seat",
    "one",
    "at",
    "a",
    "time.",
    "From",
    "up",
    "there,",
    "I",
    "could",
    "see",
    "the",
    "whole",
    "station.",
    "Next,",
    "he",
    "showed",
    "us",
    "the",
    "heavy",
    "coat,",
    "boots,",
    "and",
    "helmet",
    "that",
    "firefighters",
    "wear.",
    "He",
    "put",
    "them",
    "all",
    "on",
    "in",
    "less",
    "than",
    "one",
    "minute.",
    "\"We",
    "have",
    "to",
    "be",
    "fast,\"",
    "he",
    "explained.",
    "\"When",
    "the",
    "alarm",
    "rings,",
    "every",
    "second",
    "counts.\"",
    "Then",
    "he",
    "showed",
    "us",
    "the",
    "long",
    "hoses",
    "rolled",
    "up",
    "on",
    "the",
    "side",
    "of",
    "the",
    "truck.",
    "Each",
    "hose",
    "can",
    "spray",
    "water",
    "higher",
    "than",
    "a",
    "three-story",
    "building.",
    "Mr.",
    "Rubin",
    "also",
    "taught",
    "us",
    "what",
    "to",
    "do",
    "if",
    "there",
    "is",
    "ever",
    "a",
    "fire",
    "at",
    "home.",
    "\"Stay",
    "low,",
    "where",
    "the",
    "air",
    "is",
    "clean,",
    "and",
    "get",
    "out",
    "fast,\"",
    "he",
    "said.",
    "\"Never",
    "go",
    "back",
    "inside",
    "for",
    "anything.\"",
    "Before",
    "we",
    "left,",
    "the",
    "alarm",
    "suddenly",
    "rang.",
    "The",
    "firefighters",
    "jumped",
    "into",
    "their",
    "gear",
    "and",
    "drove",
    "away",
    "with",
    "the",
    "sirens",
    "blaring.",
    "We",
    "waved",
    "as",
    "the",
    "truck",
    "turned",
    "the",
    "corner.",
    "On",
    "the",
    "bus",
    "ride",
    "back",
    "to",
    "school,",
    "everyone",
    "talked",
    "about",
    "becoming",
    "a",
    "firefighter",
    "one",
    "day."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "us",
      "firmly",
      "cars"
     ],
     "answer": "us",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "cars",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "kettle",
      "sold",
      "showed"
     ],
     "answer": "showed",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sold",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "swimming",
      "parked",
      "saddle"
     ],
     "answer": "parked",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swimming",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "it",
      "warmly",
      "bread"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "feather",
      "ate",
      "let"
     ],
     "answer": "let",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "apple",
      "one",
      "wisely"
     ],
     "answer": "one",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "apple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "I",
      "Loosely",
      "Trucks"
     ],
     "answer": "I",
     "wrong": [
      {
       "answer": "Loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Trucks",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "tightly",
      "it",
      "he"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "it",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "but",
      "and",
      "waved"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "but",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "them",
      "nearly",
      "ladders"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ladders",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": ".",
     "options": [
      "freshly",
      "pillow",
      "minute"
     ],
     "answer": "minute",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": ".",
     "options": [
      "sneezed",
      "explained",
      "pocket"
     ],
     "answer": "explained",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": ".\"",
     "options": [
      "counts",
      "hammer",
      "sleeps"
     ],
     "answer": "counts",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeps",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "lazily",
      "sandwiches",
      "hoses"
     ],
     "answer": "hoses",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwiches",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "my",
      "the",
      "kicked"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "my",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "higher",
      "pebble",
      "softer"
     ],
     "answer": "higher",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "softer",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "trumpet",
      "never",
      "also"
     ],
     "answer": "also",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "he",
      "there",
      "nicely"
     ],
     "answer": "there",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "he",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "\"",
     "after": "",
     "options": [
      "Stay",
      "Jacket",
      "Sing"
     ],
     "answer": "Stay",
     "wrong": [
      {
       "answer": "Jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "mixed",
      "unless",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "eat",
      "go",
      "wagon"
     ],
     "answer": "go",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eat",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": ",",
     "options": [
      "left",
      "cabbage",
      "slept"
     ],
     "answer": "left",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "slept",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "helmet",
      "yawned",
      "jumped"
     ],
     "answer": "jumped",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yawned",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "under",
      "with",
      "jumped"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "the",
      "clapped",
      "no"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "partly",
      "rock",
      "bus"
     ],
     "answer": "bus",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rock",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "below",
      "about",
      "hopped"
     ],
     "answer": "about",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "below",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G3.B",
   "grade": 3,
   "form": "B",
   "title": "How Bees Make Honey",
   "words": 197,
   "first_sentence": "Honey is one of the oldest sweet foods in the world.",
   "tokens": [
    "It",
    "is",
    "made",
    "by",
    "honeybees,",
    "and",
    "making",
    "it",
    "takes",
    "a",
    "lot",
    "of",
    "hard",
    "work.",
    "Bees",
    "fly",
    "from",
    "flower",
    "to",
    "flower",
    "looking",
    "for",
    "a",
    "sweet",
    "liquid",
    "called",
    "nectar.",
    "A",
    "bee",
    "drinks",
    "the",
    "nectar",
    "and",
    "stores",
    "it",
    "in",
    "a",
    "special",
    "pouch",
    "inside",
    "its",
    "body.",
    "When",
    "the",
    "pouch",
    "is",
    "full,",
    "the",
    "bee",
    "flies",
    "back",
    "to",
    "the",
    "hive.",
    "There,",
    "it",
    "passes",
    "the",
    "nectar",
    "to",
    "other",
    "bees,",
    "who",
    "chew",
    "it",
    "for",
    "a",
    "while.",
    "Then",
    "they",
    "spread",
    "the",
    "nectar",
    "into",
    "the",
    "tiny",
    "six-sided",
    "rooms",
    "of",
    "the",
    "honeycomb.",
    "The",
    "nectar",
    "is",
    "still",
    "too",
    "watery",
    "to",
    "be",
    "honey.",
    "To",
    "dry",
    "it",
    "out,",
    "the",
    "bees",
    "fan",
    "it",
    "with",
    "their",
    "wings.",
    "They",
    "beat",
    "their",
    "wings",
    "so",
    "fast",
    "that",
    "the",
    "water",
    "slowly",
    "goes",
    "into",
    "the",
    "air.",
    "When",
    "the",
    "honey",
    "is",
    "thick",
    "enough,",
    "the",
    "bees",
    "cover",
    "each",
    "room",
    "with",
    "a",
    "thin",
    "lid",
    "of",
    "wax.",
    "The",
    "honey",
    "can",
    "stay",
    "fresh",
    "inside",
    "for",
    "a",
    "very",
    "long",
    "time.",
    "A",
    "single",
    "bee",
    "makes",
    "only",
    "a",
    "tiny",
    "bit",
    "of",
    "honey",
    "in",
    "its",
    "whole",
    "life.",
    "It",
    "takes",
    "thousands",
    "of",
    "bees",
    "working",
    "together",
    "to",
    "fill",
    "one",
    "jar.",
    "The",
    "next",
    "time",
    "you",
    "dip",
    "an",
    "apple",
    "in",
    "honey",
    "on",
    "Rosh",
    "Hashanah,",
    "think",
    "of",
    "all",
    "those",
    "busy",
    "bees."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "making",
      "ribbon",
      "eating"
     ],
     "answer": "making",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eating",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": ".",
     "options": [
      "safely",
      "rain",
      "work"
     ],
     "answer": "work",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "sleeping",
      "looking",
      "tunnel"
     ],
     "answer": "looking",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeping",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "A",
      "Skipped",
      "Red"
     ],
     "answer": "A",
     "wrong": [
      {
       "answer": "Skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Red",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "slowly",
      "rocks",
      "it"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rocks",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": ".",
     "options": [
      "hat",
      "body",
      "quickly"
     ],
     "answer": "body",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hat",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "bee",
      "gently",
      "cloud"
     ],
     "answer": "bee",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "cloud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "loudly",
      "spoon",
      "it"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "tables",
      "who",
      "softly"
     ],
     "answer": "who",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tables",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "they",
      "happily",
      "we"
     ],
     "answer": "they",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "we",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "clap",
      "hungry",
      "six-sided"
     ],
     "answer": "six-sided",
     "wrong": [
      {
       "answer": "clap",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "sings",
      "is",
      "violin"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sings",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "To",
      "Climbed",
      "If"
     ],
     "answer": "To",
     "wrong": [
      {
       "answer": "Climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "If",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "sadly",
      "shoes",
      "it"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "shoes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "boots",
      "wings",
      "bravely"
     ],
     "answer": "wings",
     "wrong": [
      {
       "answer": "bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "boots",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "goes",
      "rocket",
      "eats"
     ],
     "answer": "goes",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eats",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "penny",
      "cries",
      "is"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "cries",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "flower",
      "room",
      "calmly"
     ],
     "answer": "room",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "flower",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "The",
      "Washed",
      "Loud"
     ],
     "answer": "The",
     "wrong": [
      {
       "answer": "Washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "baked",
      "no",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "paints",
      "makes",
      "barrel"
     ],
     "answer": "makes",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "paints",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "in",
      "swept",
      "under"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "whistled",
      "at",
      "of"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "at",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": ".",
     "options": [
      "pillow",
      "jar",
      "neatly"
     ],
     "answer": "jar",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "apple",
      "rarely",
      "onion"
     ],
     "answer": "apple",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "onion",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "wiggled",
      "below",
      "of"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "below",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G4.A",
   "grade": 4,
   "form": "A",
   "title": "The Science Fair Project",
   "words": 284,
   "first_sentence": "Ephraim wanted to win first place at the school science fair.",
   "tokens": [
    "For",
    "weeks,",
    "he",
    "could",
    "not",
    "decide",
    "what",
    "to",
    "study.",
    "Then",
    "one",
    "evening,",
    "he",
    "noticed",
    "that",
    "his",
    "grandfather's",
    "plants",
    "on",
    "the",
    "kitchen",
    "windowsill",
    "were",
    "leaning",
    "toward",
    "the",
    "glass.",
    "He",
    "wondered",
    "whether",
    "plants",
    "always",
    "grow",
    "toward",
    "light.",
    "That",
    "gave",
    "him",
    "an",
    "idea",
    "for",
    "his",
    "project.",
    "Ephraim",
    "planted",
    "six",
    "bean",
    "seeds",
    "in",
    "six",
    "small",
    "cups",
    "of",
    "soil.",
    "He",
    "put",
    "two",
    "cups",
    "in",
    "a",
    "sunny",
    "window,",
    "two",
    "cups",
    "in",
    "a",
    "dark",
    "closet,",
    "and",
    "two",
    "cups",
    "inside",
    "a",
    "shoebox",
    "with",
    "a",
    "small",
    "hole",
    "cut",
    "in",
    "one",
    "side.",
    "Every",
    "day,",
    "he",
    "watered",
    "the",
    "plants",
    "and",
    "measured",
    "them",
    "with",
    "a",
    "ruler.",
    "He",
    "wrote",
    "the",
    "numbers",
    "carefully",
    "in",
    "a",
    "notebook.",
    "After",
    "two",
    "weeks,",
    "the",
    "results",
    "were",
    "clear.",
    "The",
    "plants",
    "in",
    "the",
    "window",
    "were",
    "green",
    "and",
    "healthy.",
    "The",
    "plants",
    "in",
    "the",
    "closet",
    "were",
    "pale",
    "and",
    "thin,",
    "and",
    "they",
    "had",
    "stopped",
    "growing.",
    "The",
    "most",
    "interesting",
    "plants",
    "were",
    "the",
    "ones",
    "in",
    "the",
    "shoebox.",
    "Their",
    "stems",
    "had",
    "bent",
    "and",
    "stretched",
    "all",
    "the",
    "way",
    "toward",
    "the",
    "small",
    "hole,",
    "reaching",
    "for",
    "the",
    "light.",
    "Ephraim",
    "made",
    "a",
    "poster",
    "with",
    "photographs",
    "and",
    "a",
    "chart",
    "of",
    "his",
    "measurements.",
    "At",
    "the",
    "fair,",
    "the",
    "judges",
    "asked",
    "him",
    "many",
    "questions,",
    "and",
    "he",
    "answered",
    "each",
    "one",
    "clearly.",
    "Ephraim",
    "did",
    "not",
    "win",
    "first",
    "place,",
    "but",
    "he",
    "won",
    "second.",
    "More",
    "importantly,",
    "he",
    "discovered",
    "how",
    "much",
    "he",
    "enjoyed",
    "being",
    "a",
    "scientist.",
    "On",
    "the",
    "way",
    "home,",
    "he",
    "was",
    "already",
    "planning",
    "next",
    "year's",
    "project.",
    "He",
    "wanted",
    "to",
    "find",
    "out",
    "whether",
    "plants",
    "grow",
    "differently",
    "when",
    "they",
    "hear",
    "music.",
    "His",
    "younger",
    "brother",
    "offered",
    "to",
    "sing",
    "to",
    "the",
    "plants",
    "every",
    "day,",
    "but",
    "Ephraim",
    "decided",
    "that",
    "the",
    "radio",
    "would",
    "be",
    "a",
    "fairer",
    "test.",
    "After",
    "all,",
    "a",
    "good",
    "scientist",
    "changes",
    "only",
    "one",
    "thing",
    "at",
    "a",
    "time,",
    "and",
    "he",
    "keeps",
    "everything",
    "else",
    "exactly",
    "the",
    "same."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "barely",
      "lunch",
      "what"
     ],
     "answer": "what",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "lunch",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "ate",
      "noticed",
      "table"
     ],
     "answer": "noticed",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "kitchen",
      "eagerly",
      "ocean"
     ],
     "answer": "kitchen",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ocean",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "Kindly",
      "Plants",
      "He"
     ],
     "answer": "He",
     "wrong": [
      {
       "answer": "Kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Plants",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": ".",
     "options": [
      "noise",
      "light",
      "proudly"
     ],
     "answer": "light",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "noise",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "his",
      "juggled",
      "every"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "tumbled",
      "over",
      "in"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "over",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "sang",
      "put",
      "window"
     ],
     "answer": "put",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "two",
      "hop",
      "hungry"
     ],
     "answer": "two",
     "wrong": [
      {
       "answer": "hop",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "skip",
      "loud",
      "two"
     ],
     "answer": "two",
     "wrong": [
      {
       "answer": "skip",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "wet",
      "small",
      "dig"
     ],
     "answer": "small",
     "wrong": [
      {
       "answer": "dig",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wet",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": ",",
     "options": [
      "day",
      "boldly",
      "shoe"
     ],
     "answer": "day",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "shoe",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "briskly",
      "clouds",
      "them"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "songs",
      "numbers",
      "firmly"
     ],
     "answer": "numbers",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "songs",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": ",",
     "options": [
      "weeks",
      "warmly",
      "shoes"
     ],
     "answer": "weeks",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "shoes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "giggled",
      "without",
      "in"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "Happy",
      "The",
      "Stirred"
     ],
     "answer": "The",
     "wrong": [
      {
       "answer": "Stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Happy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "and",
      "shouted",
      "so"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "so",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "Hummed",
      "Few",
      "The"
     ],
     "answer": "The",
     "wrong": [
      {
       "answer": "Hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "after",
      "in",
      "chewed"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "and",
      "splashed",
      "if"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "if",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "chew",
      "tall",
      "small"
     ],
     "answer": "small",
     "wrong": [
      {
       "answer": "chew",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tall",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "swallowed",
      "made",
      "carrot"
     ],
     "answer": "made",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "chart",
      "wisely",
      "pillow"
     ],
     "answer": "chart",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "rattled",
      "no",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "it",
      "he",
      "loosely"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "it",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "not",
      "blanket",
      "also"
     ],
     "answer": "not",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "also",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": ".",
     "options": [
      "tightly",
      "breakfast",
      "second"
     ],
     "answer": "second",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "rain",
      "he",
      "nearly"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "way",
      "freshly",
      "door"
     ],
     "answer": "way",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "door",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "lazily",
      "dog's",
      "year's"
     ],
     "answer": "year's",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "dog's",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "until",
      "whether",
      "crawled"
     ],
     "answer": "whether",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": ".",
     "options": [
      "music",
      "nicely",
      "colors"
     ],
     "answer": "music",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "colors",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "waved",
      "beneath",
      "to"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "sneezed",
      "decided",
      "ladder"
     ],
     "answer": "decided",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "fairer",
      "climb",
      "louder"
     ],
     "answer": "fairer",
     "wrong": [
      {
       "answer": "climb",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "louder",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "bucket",
      "eats",
      "changes"
     ],
     "answer": "changes",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eats",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "unless",
      "and",
      "kicked"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": ".",
     "options": [
      "same",
      "wash",
      "purple"
     ],
     "answer": "same",
     "wrong": [
      {
       "answer": "wash",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G4.B",
   "grade": 4,
   "form": "B",
   "title": "The Underground Railroad",
   "words": 284,
   "first_sentence": "Before the Civil War, millions of people in the southern United States were held as slaves.",
   "tokens": [
    "Many",
    "of",
    "them",
    "risked",
    "their",
    "lives",
    "to",
    "escape",
    "to",
    "freedom",
    "in",
    "the",
    "North",
    "or",
    "in",
    "Canada.",
    "They",
    "were",
    "helped",
    "by",
    "a",
    "secret",
    "network",
    "of",
    "people",
    "and",
    "hiding",
    "places",
    "known",
    "as",
    "the",
    "Underground",
    "Railroad.",
    "It",
    "was",
    "not",
    "really",
    "underground,",
    "and",
    "it",
    "was",
    "not",
    "a",
    "railroad.",
    "Instead,",
    "it",
    "was",
    "a",
    "system",
    "of",
    "routes,",
    "safe",
    "houses,",
    "and",
    "helpers",
    "who",
    "guided",
    "escaping",
    "people",
    "from",
    "one",
    "place",
    "to",
    "the",
    "next.",
    "The",
    "helpers",
    "used",
    "railroad",
    "words",
    "as",
    "a",
    "secret",
    "code.",
    "The",
    "safe",
    "houses",
    "were",
    "called",
    "stations,",
    "and",
    "the",
    "people",
    "who",
    "guided",
    "travelers",
    "were",
    "called",
    "conductors.",
    "Travelers",
    "usually",
    "moved",
    "at",
    "night",
    "and",
    "hid",
    "during",
    "the",
    "day",
    "in",
    "barns,",
    "cellars,",
    "and",
    "secret",
    "rooms.",
    "They",
    "followed",
    "rivers",
    "and",
    "used",
    "the",
    "North",
    "Star",
    "to",
    "find",
    "their",
    "direction.",
    "The",
    "journey",
    "could",
    "take",
    "weeks",
    "or",
    "even",
    "months,",
    "and",
    "it",
    "was",
    "extremely",
    "dangerous.",
    "If",
    "they",
    "were",
    "caught,",
    "they",
    "could",
    "be",
    "punished",
    "severely",
    "and",
    "sent",
    "back.",
    "Helpers",
    "who",
    "were",
    "caught",
    "could",
    "be",
    "fined",
    "or",
    "sent",
    "to",
    "jail.",
    "One",
    "of",
    "the",
    "most",
    "famous",
    "conductors",
    "was",
    "Harriet",
    "Tubman's",
    "partner",
    "in",
    "this",
    "work,",
    "a",
    "man",
    "named",
    "William",
    "Still,",
    "who",
    "kept",
    "careful",
    "records",
    "of",
    "the",
    "people",
    "he",
    "helped",
    "so",
    "families",
    "could",
    "later",
    "find",
    "one",
    "another.",
    "Thanks",
    "to",
    "the",
    "courage",
    "of",
    "many",
    "people,",
    "thousands",
    "reached",
    "freedom.",
    "Still's",
    "records",
    "are",
    "still",
    "studied",
    "today.",
    "They",
    "show",
    "that",
    "the",
    "people",
    "who",
    "escaped",
    "were",
    "not",
    "simply",
    "rescued",
    "by",
    "others.",
    "Most",
    "of",
    "them",
    "planned",
    "their",
    "own",
    "escapes,",
    "chose",
    "when",
    "to",
    "leave,",
    "and",
    "faced",
    "the",
    "greatest",
    "dangers",
    "themselves.",
    "The",
    "helpers",
    "made",
    "the",
    "journey",
    "possible,",
    "but",
    "the",
    "travelers",
    "showed",
    "the",
    "most",
    "courage",
    "of",
    "all.",
    "After",
    "the",
    "war",
    "ended,",
    "slavery",
    "was",
    "finally",
    "abolished",
    "in",
    "the",
    "United",
    "States,",
    "and",
    "the",
    "secret",
    "routes",
    "were",
    "no",
    "longer",
    "needed."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "mixed",
      "under",
      "to"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "if",
      "or",
      "jumped"
     ],
     "answer": "or",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "if",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "a",
      "clapped",
      "no"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "partly",
      "songs",
      "places"
     ],
     "answer": "places",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "songs",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "ate",
      "was",
      "basket"
     ],
     "answer": "was",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "not",
      "mitten",
      "also"
     ],
     "answer": "not",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "also",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "safely",
      "pillow",
      "system"
     ],
     "answer": "system",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "rivers",
      "who",
      "slowly"
     ],
     "answer": "who",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rivers",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "to",
      "hopped",
      "beneath"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "quickly",
      "tracks",
      "words"
     ],
     "answer": "words",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tracks",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "apples",
      "houses",
      "gently"
     ],
     "answer": "houses",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "apples",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "who",
      "loudly",
      "clouds"
     ],
     "answer": "who",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "garden",
      "never",
      "usually"
     ],
     "answer": "usually",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "every",
      "the",
      "skipped"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": ".",
     "options": [
      "rooms",
      "softly",
      "oceans"
     ],
     "answer": "rooms",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "oceans",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "Happily",
      "Kitchen",
      "North"
     ],
     "answer": "North",
     "wrong": [
      {
       "answer": "Happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Kitchen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "lunch",
      "journey",
      "sadly"
     ],
     "answer": "journey",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "lunch",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "and",
      "climbed",
      "unless"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "kettle",
      "sang",
      "were"
     ],
     "answer": "were",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "until",
      "and",
      "washed"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "could",
      "saddle",
      "cannot"
     ],
     "answer": "could",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "cannot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "Bravely",
      "Sky",
      "One"
     ],
     "answer": "One",
     "wrong": [
      {
       "answer": "Bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Sky",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "Breakfast",
      "Harriet",
      "Calmly"
     ],
     "answer": "Harriet",
     "wrong": [
      {
       "answer": "Calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "man",
      "neatly",
      "river"
     ],
     "answer": "man",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "river",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "rarely",
      "jokes",
      "records"
     ],
     "answer": "records",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "jokes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "spoons",
      "families",
      "barely"
     ],
     "answer": "families",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "to",
      "baked",
      "without"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "feather",
      "forgot",
      "reached"
     ],
     "answer": "reached",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forgot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": ".",
     "options": [
      "yesterday",
      "today",
      "pocket"
     ],
     "answer": "today",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yesterday",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "escaped",
      "hammer",
      "slept"
     ],
     "answer": "escaped",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "slept",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "Eagerly",
      "Buttons",
      "Most"
     ],
     "answer": "Most",
     "wrong": [
      {
       "answer": "Eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Buttons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "sneezed",
      "chose",
      "pebble"
     ],
     "answer": "chose",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "greatest",
      "bake",
      "smallest"
     ],
     "answer": "greatest",
     "wrong": [
      {
       "answer": "bake",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "smallest",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "kindly",
      "puzzle",
      "journey"
     ],
     "answer": "journey",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "puzzle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "least",
      "most",
      "sweep"
     ],
     "answer": "most",
     "wrong": [
      {
       "answer": "sweep",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "least",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": ",",
     "options": [
      "ended",
      "trumpet",
      "yawned"
     ],
     "answer": "ended",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yawned",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "Knit",
      "Sleepy",
      "United"
     ],
     "answer": "United",
     "wrong": [
      {
       "answer": "Knit",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "so",
      "no",
      "jacket"
     ],
     "answer": "no",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "so",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G5.A",
   "grade": 5,
   "form": "A",
   "title": "Volcanoes: Mountains of Fire",
   "words": 295,
   "first_sentence": "A volcano is an opening in the surface of the earth through which melted rock, gas, and ash escape.",
   "tokens": [
    "Deep",
    "beneath",
    "our",
    "feet,",
    "the",
    "temperature",
    "is",
    "so",
    "high",
    "that",
    "some",
    "rock",
    "melts",
    "into",
    "a",
    "thick,",
    "glowing",
    "liquid",
    "called",
    "magma.",
    "Because",
    "magma",
    "is",
    "lighter",
    "than",
    "the",
    "solid",
    "rock",
    "around",
    "it,",
    "it",
    "slowly",
    "rises",
    "toward",
    "the",
    "surface.",
    "It",
    "collects",
    "in",
    "large",
    "underground",
    "pools",
    "called",
    "magma",
    "chambers.",
    "Over",
    "time,",
    "pressure",
    "builds",
    "as",
    "more",
    "magma",
    "and",
    "gas",
    "push",
    "upward.",
    "When",
    "the",
    "pressure",
    "becomes",
    "too",
    "great,",
    "the",
    "magma",
    "bursts",
    "through",
    "cracks",
    "in",
    "the",
    "earth's",
    "crust.",
    "Once",
    "it",
    "reaches",
    "the",
    "surface,",
    "it",
    "is",
    "called",
    "lava.",
    "Some",
    "eruptions",
    "are",
    "gentle,",
    "with",
    "rivers",
    "of",
    "lava",
    "flowing",
    "slowly",
    "down",
    "the",
    "sides",
    "of",
    "the",
    "mountain.",
    "Others",
    "are",
    "violent",
    "explosions",
    "that",
    "blast",
    "ash",
    "and",
    "rock",
    "miles",
    "into",
    "the",
    "sky.",
    "The",
    "type",
    "of",
    "eruption",
    "depends",
    "mostly",
    "on",
    "how",
    "thick",
    "the",
    "magma",
    "is",
    "and",
    "how",
    "much",
    "gas",
    "it",
    "contains.",
    "Thin,",
    "runny",
    "magma",
    "lets",
    "gas",
    "escape",
    "easily,",
    "so",
    "it",
    "usually",
    "produces",
    "calm",
    "eruptions.",
    "Thick,",
    "sticky",
    "magma",
    "traps",
    "gas",
    "inside,",
    "and",
    "the",
    "pressure",
    "can",
    "cause",
    "a",
    "powerful",
    "explosion.",
    "Although",
    "volcanoes",
    "can",
    "be",
    "destructive,",
    "they",
    "also",
    "help",
    "the",
    "earth.",
    "Volcanic",
    "ash",
    "breaks",
    "down",
    "into",
    "rich",
    "soil",
    "that",
    "is",
    "excellent",
    "for",
    "growing",
    "crops.",
    "Many",
    "islands,",
    "including",
    "Hawaii,",
    "were",
    "formed",
    "entirely",
    "by",
    "volcanoes",
    "rising",
    "from",
    "the",
    "ocean",
    "floor.",
    "Scientists",
    "called",
    "volcanologists",
    "study",
    "volcanoes",
    "carefully",
    "so",
    "they",
    "can",
    "warn",
    "people",
    "before",
    "dangerous",
    "eruptions",
    "happen.",
    "They",
    "measure",
    "small",
    "earthquakes,",
    "changes",
    "in",
    "the",
    "shape",
    "of",
    "the",
    "ground,",
    "and",
    "the",
    "gases",
    "that",
    "escape",
    "from",
    "vents.",
    "When",
    "these",
    "signs",
    "increase,",
    "it",
    "often",
    "means",
    "that",
    "magma",
    "is",
    "moving",
    "closer",
    "to",
    "the",
    "surface.",
    "Thanks",
    "to",
    "this",
    "careful",
    "work,",
    "towns",
    "near",
    "active",
    "volcanoes",
    "can",
    "now",
    "be",
    "evacuated",
    "days",
    "before",
    "an",
    "eruption,",
    "and",
    "many",
    "lives",
    "are",
    "saved.",
    "Even",
    "so,",
    "scientists",
    "admit",
    "that",
    "predicting",
    "the",
    "exact",
    "moment",
    "of",
    "an",
    "eruption",
    "remains",
    "very",
    "difficult."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "sings",
      "is",
      "wagon"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sings",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "into",
      "swept",
      "without"
     ],
     "answer": "into",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "Whistled",
      "Unless",
      "Because"
     ],
     "answer": "Because",
     "wrong": [
      {
       "answer": "Whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "water",
      "rock",
      "proudly"
     ],
     "answer": "rock",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "water",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "the",
      "wiggled",
      "no"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "boldly",
      "forests",
      "pools"
     ],
     "answer": "pools",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forests",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "sleeps",
      "builds",
      "cabbage"
     ],
     "answer": "builds",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeps",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": ".",
     "options": [
      "upward",
      "helmet",
      "sideways"
     ],
     "answer": "upward",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "juggled",
      "every",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "bread's",
      "earth's",
      "briskly"
     ],
     "answer": "earth's",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "bread's",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "it",
      "firmly",
      "rain"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": ",",
     "options": [
      "paddle",
      "frozen",
      "gentle"
     ],
     "answer": "gentle",
     "wrong": [
      {
       "answer": "paddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "frozen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "inside",
      "down",
      "tumbled"
     ],
     "answer": "down",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "are",
      "ribbon",
      "sing"
     ],
     "answer": "are",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "warmly",
      "soup",
      "rock"
     ],
     "answer": "rock",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "at",
      "of",
      "giggled"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "at",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "the",
      "stirred",
      "few"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "wisely",
      "we",
      "it"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "we",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "freeze",
      "escape",
      "tunnel"
     ],
     "answer": "escape",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "freeze",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": ".",
     "options": [
      "eruptions",
      "loosely",
      "sandwiches"
     ],
     "answer": "eruptions",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwiches",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "shouted",
      "if",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "if",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": ".",
     "options": [
      "nap",
      "explosion",
      "tightly"
     ],
     "answer": "explosion",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "nap",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "also",
      "violin",
      "never"
     ],
     "answer": "also",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "rocket",
      "backward",
      "down"
     ],
     "answer": "down",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "against",
      "for",
      "hummed"
     ],
     "answer": "for",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "were",
      "penny",
      "sang"
     ],
     "answer": "were",
     "wrong": [
      {
       "answer": "penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "chewed",
      "many",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "pancakes",
      "volcanoes",
      "nearly"
     ],
     "answer": "volcanoes",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "before",
      "splashed",
      "after"
     ],
     "answer": "before",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": ",",
     "options": [
      "freshly",
      "songs",
      "earthquakes"
     ],
     "answer": "earthquakes",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "songs",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": ",",
     "options": [
      "sky",
      "ground",
      "lazily"
     ],
     "answer": "ground",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sky",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": ".",
     "options": [
      "vents",
      "nicely",
      "pockets"
     ],
     "answer": "vents",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pockets",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "barrel",
      "sneezes",
      "means"
     ],
     "answer": "means",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "some",
      "the",
      "rattled"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "some",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "towns",
      "partly",
      "oceans"
     ],
     "answer": "towns",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "oceans",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "table",
      "painted",
      "evacuated"
     ],
     "answer": "evacuated",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "shoes",
      "lives",
      "safely"
     ],
     "answer": "lives",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "shoes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "that",
      "crawled",
      "because"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "because",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": "",
     "options": [
      "slowly",
      "breakfast",
      "eruption"
     ],
     "answer": "eruption",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G5.B",
   "grade": 5,
   "form": "B",
   "title": "The Lost Wallet",
   "words": 289,
   "first_sentence": "On his way home from shul one Sunday morning, Binyamin spotted a brown leather wallet lying in the gutter.",
   "tokens": [
    "He",
    "picked",
    "it",
    "up",
    "and",
    "opened",
    "it",
    "carefully.",
    "Inside",
    "were",
    "several",
    "credit",
    "cards,",
    "a",
    "driver's",
    "license,",
    "and",
    "more",
    "cash",
    "than",
    "Binyamin",
    "had",
    "ever",
    "held",
    "at",
    "one",
    "time.",
    "For",
    "a",
    "moment,",
    "he",
    "stood",
    "frozen",
    "on",
    "the",
    "sidewalk,",
    "unsure",
    "what",
    "to",
    "do.",
    "He",
    "thought",
    "about",
    "the",
    "new",
    "bicycle",
    "he",
    "had",
    "been",
    "saving",
    "for",
    "since",
    "the",
    "summer.",
    "The",
    "money",
    "in",
    "his",
    "hand",
    "would",
    "pay",
    "for",
    "it",
    "twice",
    "over.",
    "Nobody",
    "had",
    "seen",
    "him",
    "pick",
    "up",
    "the",
    "wallet,",
    "and",
    "the",
    "owner",
    "might",
    "never",
    "know",
    "what",
    "happened",
    "to",
    "it.",
    "But",
    "Binyamin",
    "also",
    "remembered",
    "what",
    "his",
    "father",
    "always",
    "said:",
    "\"Returning",
    "a",
    "lost",
    "object",
    "is",
    "a",
    "mitzvah,",
    "and",
    "it",
    "is",
    "also",
    "simply",
    "the",
    "right",
    "thing",
    "to",
    "do.\"",
    "He",
    "looked",
    "at",
    "the",
    "license",
    "and",
    "read",
    "the",
    "name",
    "and",
    "address.",
    "The",
    "owner,",
    "Mr.",
    "Weiss,",
    "lived",
    "only",
    "four",
    "blocks",
    "away.",
    "Binyamin",
    "walked",
    "quickly",
    "to",
    "the",
    "address",
    "and",
    "rang",
    "the",
    "bell.",
    "A",
    "tired-looking",
    "man",
    "opened",
    "the",
    "door.",
    "When",
    "Binyamin",
    "held",
    "up",
    "the",
    "wallet,",
    "the",
    "man's",
    "face",
    "changed",
    "completely.",
    "\"I",
    "have",
    "been",
    "searching",
    "for",
    "this",
    "all",
    "morning,\"",
    "Mr.",
    "Weiss",
    "said,",
    "almost",
    "laughing",
    "with",
    "relief.",
    "He",
    "tried",
    "to",
    "give",
    "Binyamin",
    "a",
    "reward,",
    "but",
    "Binyamin",
    "politely",
    "refused.",
    "Walking",
    "home,",
    "he",
    "felt",
    "lighter",
    "than",
    "he",
    "had",
    "in",
    "weeks,",
    "and",
    "the",
    "bicycle",
    "could",
    "wait.",
    "That",
    "evening,",
    "the",
    "phone",
    "rang",
    "during",
    "supper.",
    "It",
    "was",
    "Mr.",
    "Weiss,",
    "who",
    "had",
    "called",
    "the",
    "shul",
    "to",
    "find",
    "out",
    "which",
    "family",
    "Binyamin",
    "belonged",
    "to.",
    "He",
    "wanted",
    "to",
    "tell",
    "Binyamin's",
    "parents",
    "how",
    "grateful",
    "he",
    "was.",
    "Binyamin's",
    "father",
    "listened,",
    "thanked",
    "him,",
    "and",
    "hung",
    "up.",
    "He",
    "did",
    "not",
    "say",
    "much,",
    "but",
    "at",
    "the",
    "end",
    "of",
    "the",
    "meal",
    "he",
    "put",
    "his",
    "hand",
    "on",
    "his",
    "son's",
    "shoulder",
    "and",
    "squeezed",
    "it.",
    "To",
    "Binyamin,",
    "that",
    "meant",
    "more",
    "than",
    "any",
    "reward."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "clouds",
      "it",
      "quickly"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "a",
      "waved",
      "every"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "Gently",
      "Sidewalk",
      "Binyamin"
     ],
     "answer": "Binyamin",
     "wrong": [
      {
       "answer": "Gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Sidewalk",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "Under",
      "For",
      "Kicked"
     ],
     "answer": "For",
     "wrong": [
      {
       "answer": "Kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "the",
      "mixed",
      "no"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "window",
      "ate",
      "thought"
     ],
     "answer": "thought",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "sang",
      "been",
      "carrot"
     ],
     "answer": "been",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "money",
      "loudly",
      "rain"
     ],
     "answer": "money",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "softly",
      "pillows",
      "it"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillows",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "sing",
      "pick",
      "blanket"
     ],
     "answer": "pick",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "might",
      "ladder",
      "swims"
     ],
     "answer": "might",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swims",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "Jumped",
      "Because",
      "But"
     ],
     "answer": "But",
     "wrong": [
      {
       "answer": "Jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Because",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "never",
      "always",
      "bucket"
     ],
     "answer": "always",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "a",
      "clapped",
      "few"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "hopped",
      "many",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "beneath",
      "at",
      "skipped"
     ],
     "answer": "at",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "and",
      "climbed",
      "if"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "if",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "basket",
      "backward",
      "only"
     ],
     "answer": "only",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "without",
      "to",
      "washed"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "A",
      "Baked",
      "Some"
     ],
     "answer": "A",
     "wrong": [
      {
       "answer": "Baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Some",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "Happily",
      "Bread",
      "Binyamin"
     ],
     "answer": "Binyamin",
     "wrong": [
      {
       "answer": "Happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "shoe",
      "face",
      "sadly"
     ],
     "answer": "face",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "shoe",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "for",
      "swept",
      "against"
     ],
     "answer": "for",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "mitten",
      "sideways",
      "almost"
     ],
     "answer": "almost",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "hide",
      "give",
      "garden"
     ],
     "answer": "give",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hide",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": ".",
     "options": [
      "refused",
      "kettle",
      "sneezed"
     ],
     "answer": "refused",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "bravely",
      "it",
      "he"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "it",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "yawned",
      "could",
      "saddle"
     ],
     "answer": "could",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yawned",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "during",
      "whistled",
      "inside"
     ],
     "answer": "during",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "feather",
      "painted",
      "had"
     ],
     "answer": "had",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "loud",
      "which",
      "wiggled"
     ],
     "answer": "which",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "to",
      "juggled",
      "across"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": ".",
     "options": [
      "pocket",
      "slept",
      "was"
     ],
     "answer": "was",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "slept",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "danced",
      "hung",
      "hammer"
     ],
     "answer": "hung",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "danced",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "but",
      "tumbled",
      "unless"
     ],
     "answer": "but",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "calmly",
      "soup",
      "he"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "sandwich",
      "shoulder",
      "neatly"
     ],
     "answer": "shoulder",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "meant",
      "pebble",
      "forgot"
     ],
     "answer": "meant",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forgot",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G6.A",
   "grade": 6,
   "form": "A",
   "title": "The Great Wall of China",
   "words": 300,
   "first_sentence": "The Great Wall of China is one of the most famous structures ever built by human hands.",
   "tokens": [
    "It",
    "stretches",
    "across",
    "northern",
    "China",
    "for",
    "thousands",
    "of",
    "miles,",
    "winding",
    "over",
    "mountains,",
    "deserts,",
    "and",
    "grasslands.",
    "Contrary",
    "to",
    "popular",
    "belief,",
    "it",
    "is",
    "not",
    "a",
    "single",
    "continuous",
    "wall.",
    "Instead,",
    "it",
    "is",
    "a",
    "series",
    "of",
    "walls",
    "and",
    "fortifications",
    "built",
    "and",
    "rebuilt",
    "over",
    "roughly",
    "two",
    "thousand",
    "years",
    "by",
    "different",
    "dynasties.",
    "The",
    "earliest",
    "sections",
    "were",
    "constructed",
    "more",
    "than",
    "two",
    "thousand",
    "years",
    "ago",
    "to",
    "protect",
    "Chinese",
    "kingdoms",
    "from",
    "invading",
    "groups",
    "from",
    "the",
    "north.",
    "Later",
    "emperors",
    "connected",
    "and",
    "extended",
    "these",
    "walls.",
    "Most",
    "of",
    "the",
    "wall",
    "that",
    "tourists",
    "visit",
    "today",
    "was",
    "built",
    "during",
    "the",
    "Ming",
    "dynasty,",
    "which",
    "ruled",
    "from",
    "the",
    "1300s",
    "to",
    "the",
    "1600s.",
    "Building",
    "the",
    "wall",
    "required",
    "enormous",
    "effort.",
    "Hundreds",
    "of",
    "thousands",
    "of",
    "soldiers,",
    "farmers,",
    "and",
    "prisoners",
    "labored",
    "in",
    "harsh",
    "conditions,",
    "often",
    "far",
    "from",
    "home.",
    "Workers",
    "used",
    "whatever",
    "materials",
    "were",
    "nearby:",
    "packed",
    "earth",
    "in",
    "the",
    "plains,",
    "stone",
    "in",
    "the",
    "mountains,",
    "and",
    "later,",
    "millions",
    "of",
    "fired",
    "bricks.",
    "Along",
    "the",
    "wall,",
    "watchtowers",
    "allowed",
    "soldiers",
    "to",
    "spot",
    "approaching",
    "enemies",
    "from",
    "great",
    "distances.",
    "When",
    "danger",
    "appeared,",
    "guards",
    "sent",
    "signals",
    "from",
    "tower",
    "to",
    "tower",
    "using",
    "smoke",
    "during",
    "the",
    "day",
    "and",
    "fire",
    "at",
    "night,",
    "so",
    "that",
    "a",
    "warning",
    "could",
    "travel",
    "hundreds",
    "of",
    "miles",
    "in",
    "a",
    "few",
    "hours.",
    "Today,",
    "the",
    "Great",
    "Wall",
    "no",
    "longer",
    "protects",
    "China",
    "from",
    "invaders,",
    "but",
    "it",
    "attracts",
    "millions",
    "of",
    "visitors",
    "each",
    "year",
    "who",
    "come",
    "to",
    "marvel",
    "at",
    "its",
    "size",
    "and",
    "history.",
    "Unfortunately,",
    "parts",
    "of",
    "the",
    "wall",
    "are",
    "in",
    "danger.",
    "Wind",
    "and",
    "rain",
    "have",
    "worn",
    "away",
    "many",
    "of",
    "the",
    "earthen",
    "sections,",
    "and",
    "some",
    "visitors",
    "have",
    "damaged",
    "the",
    "stones",
    "by",
    "climbing",
    "on",
    "fragile",
    "areas",
    "or",
    "carving",
    "their",
    "names",
    "into",
    "the",
    "bricks.",
    "Some",
    "villagers",
    "have",
    "even",
    "taken",
    "bricks",
    "to",
    "build",
    "their",
    "homes.",
    "In",
    "recent",
    "years,",
    "the",
    "Chinese",
    "government",
    "has",
    "passed",
    "laws",
    "to",
    "protect",
    "the",
    "wall",
    "and",
    "has",
    "begun",
    "restoring",
    "the",
    "sections",
    "that",
    "are",
    "most",
    "at",
    "risk."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "thousands",
      "rarely",
      "spoonfuls"
     ],
     "answer": "thousands",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoonfuls",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "giggled",
      "if",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "if",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "sings",
      "is",
      "trumpet"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sings",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "it",
      "barely",
      "rain"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "eagerly",
      "sandwiches",
      "fortifications"
     ],
     "answer": "fortifications",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwiches",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "hungry",
      "thousand",
      "whistle"
     ],
     "answer": "thousand",
     "wrong": [
      {
       "answer": "whistle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "sections",
      "kindly",
      "clouds"
     ],
     "answer": "sections",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "proudly",
      "pencils",
      "years"
     ],
     "answer": "years",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pencils",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "sleeping",
      "invading",
      "wiggle"
     ],
     "answer": "invading",
     "wrong": [
      {
       "answer": "wiggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeping",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "connected",
      "jacket",
      "swallowed"
     ],
     "answer": "connected",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "stirred",
      "no",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "eaten",
      "built",
      "wagon"
     ],
     "answer": "built",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eaten",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "from",
      "shouted",
      "without"
     ],
     "answer": "from",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "hummed",
      "few",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "buttons",
      "thousands",
      "boldly"
     ],
     "answer": "thousands",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "buttons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "in",
      "chewed",
      "beneath"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "Briskly",
      "Fish",
      "Workers"
     ],
     "answer": "Workers",
     "wrong": [
      {
       "answer": "Briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Fish",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "candy",
      "earth",
      "firmly"
     ],
     "answer": "earth",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "candy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": ",",
     "options": [
      "mountains",
      "warmly",
      "kitchens"
     ],
     "answer": "mountains",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "kitchens",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "Splashed",
      "Against",
      "Along"
     ],
     "answer": "Along",
     "wrong": [
      {
       "answer": "Splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "invite",
      "spot",
      "cabbage"
     ],
     "answer": "spot",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "invite",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "danger",
      "wisely",
      "breakfast"
     ],
     "answer": "danger",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "rattled",
      "under",
      "to"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "unless",
      "and",
      "crawled"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "warning",
      "loosely",
      "pillow"
     ],
     "answer": "warning",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "waved",
      "every",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "so",
      "no",
      "helmet"
     ],
     "answer": "no",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "so",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "it",
      "tightly",
      "soup"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "nearly",
      "tables",
      "who"
     ],
     "answer": "who",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tables",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "because",
      "and",
      "kicked"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "because",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "are",
      "ribbon",
      "dance"
     ],
     "answer": "are",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "dance",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "tunnel",
      "painted",
      "worn"
     ],
     "answer": "worn",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "until",
      "and",
      "mixed"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "by",
      "jumped",
      "after"
     ],
     "answer": "by",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "clapped",
      "loud",
      "their"
     ],
     "answer": "their",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "sang",
      "have",
      "violin"
     ],
     "answer": "have",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": ".",
     "options": [
      "homes",
      "freshly",
      "puzzles"
     ],
     "answer": "homes",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "puzzles",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "rocket",
      "yawned",
      "has"
     ],
     "answer": "has",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yawned",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": "",
     "options": [
      "but",
      "and",
      "hopped"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "but",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 40,
     "token_index": 279,
     "before": "",
     "after": "",
     "options": [
      "are",
      "penny",
      "laugh"
     ],
     "answer": "are",
     "wrong": [
      {
       "answer": "penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "laugh",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G6.B",
   "grade": 6,
   "form": "B",
   "title": "The Championship Game",
   "words": 301,
   "first_sentence": "With only twelve seconds left in the championship game, the score was tied, and the ball was in Natan's hands.",
   "tokens": [
    "The",
    "crowd",
    "in",
    "the",
    "gym",
    "was",
    "shouting",
    "so",
    "loudly",
    "that",
    "he",
    "could",
    "barely",
    "think.",
    "All",
    "season,",
    "Natan",
    "had",
    "been",
    "the",
    "player",
    "who",
    "passed",
    "the",
    "ball",
    "rather",
    "than",
    "the",
    "one",
    "who",
    "took",
    "the",
    "final",
    "shot.",
    "He",
    "was",
    "known",
    "for",
    "his",
    "teamwork,",
    "not",
    "his",
    "scoring.",
    "Now",
    "his",
    "coach",
    "had",
    "called",
    "a",
    "play",
    "that",
    "left",
    "him",
    "wide",
    "open",
    "at",
    "the",
    "top",
    "of",
    "the",
    "key.",
    "Natan",
    "dribbled",
    "twice",
    "and",
    "glanced",
    "at",
    "the",
    "clock.",
    "Eight",
    "seconds.",
    "Out",
    "of",
    "the",
    "corner",
    "of",
    "his",
    "eye,",
    "he",
    "saw",
    "his",
    "teammate",
    "Dovid",
    "cutting",
    "toward",
    "the",
    "basket",
    "with",
    "no",
    "one",
    "guarding",
    "him.",
    "Natan",
    "had",
    "a",
    "choice.",
    "He",
    "could",
    "take",
    "the",
    "shot",
    "himself",
    "and",
    "possibly",
    "become",
    "the",
    "hero",
    "of",
    "the",
    "game,",
    "or",
    "he",
    "could",
    "pass",
    "to",
    "Dovid,",
    "who",
    "had",
    "the",
    "easier",
    "chance.",
    "For",
    "a",
    "fraction",
    "of",
    "a",
    "second,",
    "Natan",
    "imagined",
    "the",
    "cheering",
    "crowd",
    "lifting",
    "him",
    "onto",
    "their",
    "shoulders.",
    "Then",
    "he",
    "made",
    "his",
    "decision.",
    "He",
    "fired",
    "a",
    "crisp",
    "bounce",
    "pass,",
    "and",
    "Dovid",
    "laid",
    "the",
    "ball",
    "gently",
    "against",
    "the",
    "backboard",
    "and",
    "into",
    "the",
    "net",
    "just",
    "as",
    "the",
    "buzzer",
    "sounded.",
    "The",
    "gym",
    "exploded",
    "with",
    "noise.",
    "Later,",
    "in",
    "the",
    "locker",
    "room,",
    "the",
    "coach",
    "handed",
    "the",
    "game",
    "ball",
    "to",
    "Natan",
    "instead",
    "of",
    "Dovid.",
    "\"Anyone",
    "can",
    "take",
    "a",
    "shot,\"",
    "the",
    "coach",
    "said.",
    "\"It",
    "takes",
    "a",
    "real",
    "player",
    "to",
    "see",
    "the",
    "best",
    "one.\"",
    "Natan",
    "looked",
    "over",
    "at",
    "Dovid,",
    "who",
    "was",
    "grinning",
    "at",
    "him",
    "from",
    "across",
    "the",
    "room.",
    "He",
    "walked",
    "over",
    "and",
    "placed",
    "the",
    "ball",
    "in",
    "his",
    "friend's",
    "hands.",
    "\"You",
    "made",
    "the",
    "basket,\"",
    "he",
    "said.",
    "Dovid",
    "tried",
    "to",
    "give",
    "it",
    "back,",
    "and",
    "soon",
    "the",
    "whole",
    "team",
    "was",
    "laughing",
    "as",
    "the",
    "ball",
    "went",
    "back",
    "and",
    "forth",
    "between",
    "them.",
    "In",
    "the",
    "end,",
    "they",
    "agreed",
    "that",
    "the",
    "ball",
    "would",
    "sit",
    "on",
    "the",
    "shelf",
    "in",
    "the",
    "gym,",
    "where",
    "the",
    "entire",
    "team",
    "could",
    "see",
    "it."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "shouting",
      "barrel",
      "sleeping"
     ],
     "answer": "shouting",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeping",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": ".",
     "options": [
      "table",
      "sneeze",
      "think"
     ],
     "answer": "think",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneeze",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "sandwich",
      "player",
      "lazily"
     ],
     "answer": "player",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "the",
      "skipped",
      "few"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "Nicely",
      "Rain",
      "He"
     ],
     "answer": "He",
     "wrong": [
      {
       "answer": "Nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "loud",
      "his",
      "climbed"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "a",
      "washed",
      "no"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "baked",
      "beneath",
      "at"
     ],
     "answer": "at",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "painted",
      "dribbled",
      "window"
     ],
     "answer": "dribbled",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "Eight",
      "Partly",
      "Pancake"
     ],
     "answer": "Eight",
     "wrong": [
      {
       "answer": "Partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Pancake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "swept",
      "every",
      "his"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "napping",
      "cutting",
      "carrot"
     ],
     "answer": "cutting",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "napping",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "guarding",
      "blanket",
      "feeding"
     ],
     "answer": "guarding",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "feeding",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "ladder",
      "yawned",
      "could"
     ],
     "answer": "could",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yawned",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "forget",
      "become",
      "bucket"
     ],
     "answer": "become",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forget",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "he",
      "safely",
      "soup"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "whistled",
      "many",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "some",
      "a",
      "wiggled"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "some",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "lifting",
      "basket",
      "painting"
     ],
     "answer": "lifting",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painting",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "mitten",
      "sang",
      "made"
     ],
     "answer": "made",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "sleepy",
      "bounce",
      "juggle"
     ],
     "answer": "bounce",
     "wrong": [
      {
       "answer": "juggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "gently",
      "garden",
      "backward"
     ],
     "answer": "gently",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "slowly",
      "refrigerator",
      "net"
     ],
     "answer": "net",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "refrigerator",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "pencil",
      "gym",
      "quickly"
     ],
     "answer": "gym",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pencil",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "locker",
      "gently",
      "volcano"
     ],
     "answer": "locker",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "volcano",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "loudly",
      "pillow",
      "ball"
     ],
     "answer": "ball",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "cannot",
      "can",
      "kettle"
     ],
     "answer": "can",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "cannot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "\"",
     "after": "",
     "options": [
      "It",
      "Softly",
      "Bread"
     ],
     "answer": "It",
     "wrong": [
      {
       "answer": "Softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "juggled",
      "hungry",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": ",",
     "options": [
      "Breakfast",
      "Dovid",
      "Happily"
     ],
     "answer": "Dovid",
     "wrong": [
      {
       "answer": "Happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "across",
      "tumbled",
      "inside"
     ],
     "answer": "across",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "saddle",
      "swallowed",
      "placed"
     ],
     "answer": "placed",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "\"",
     "after": "",
     "options": [
      "Clouds",
      "You",
      "Sadly"
     ],
     "answer": "You",
     "wrong": [
      {
       "answer": "Sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "tried",
      "feather",
      "forgot"
     ],
     "answer": "tried",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forgot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "giggled",
      "purple",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "button",
      "ball",
      "bravely"
     ],
     "answer": "ball",
     "wrong": [
      {
       "answer": "bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "button",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "In",
      "Stirred",
      "Under"
     ],
     "answer": "In",
     "wrong": [
      {
       "answer": "Stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "calmly",
      "spoon",
      "ball"
     ],
     "answer": "ball",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": "",
     "options": [
      "green",
      "the",
      "shouted"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 40,
     "token_index": 279,
     "before": "",
     "after": "",
     "options": [
      "see",
      "pocket",
      "taste"
     ],
     "answer": "see",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "taste",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G7.A",
   "grade": 7,
   "form": "A",
   "title": "The Invention of the Telephone",
   "words": 301,
   "first_sentence": "In the 1870s, sending a message over a long distance usually meant using the telegraph, which transmitted coded clicks along a wire.",
   "tokens": [
    "Operators",
    "had",
    "to",
    "translate",
    "every",
    "message",
    "into",
    "dots",
    "and",
    "dashes,",
    "and",
    "only",
    "trained",
    "experts",
    "could",
    "read",
    "them.",
    "Several",
    "inventors",
    "believed",
    "it",
    "might",
    "be",
    "possible",
    "to",
    "send",
    "the",
    "human",
    "voice",
    "itself",
    "through",
    "a",
    "wire.",
    "Among",
    "them",
    "was",
    "Alexander",
    "Graham",
    "Bell,",
    "a",
    "teacher",
    "of",
    "the",
    "deaf",
    "who",
    "had",
    "spent",
    "years",
    "studying",
    "how",
    "sound",
    "travels.",
    "Bell",
    "understood",
    "that",
    "speaking",
    "causes",
    "vibrations",
    "in",
    "the",
    "air.",
    "His",
    "idea",
    "was",
    "to",
    "convert",
    "those",
    "vibrations",
    "into",
    "a",
    "changing",
    "electrical",
    "current,",
    "send",
    "the",
    "current",
    "through",
    "a",
    "wire,",
    "and",
    "convert",
    "it",
    "back",
    "into",
    "sound",
    "at",
    "the",
    "other",
    "end.",
    "Working",
    "with",
    "his",
    "assistant,",
    "Thomas",
    "Watson,",
    "Bell",
    "experimented",
    "for",
    "months",
    "with",
    "membranes,",
    "magnets,",
    "and",
    "wires.",
    "Many",
    "attempts",
    "failed",
    "completely.",
    "Then,",
    "in",
    "March",
    "1876,",
    "Bell",
    "spoke",
    "into",
    "his",
    "device",
    "and",
    "Watson,",
    "waiting",
    "in",
    "another",
    "room,",
    "heard",
    "his",
    "words",
    "clearly.",
    "Bell",
    "received",
    "a",
    "patent",
    "for",
    "the",
    "telephone",
    "that",
    "same",
    "year,",
    "although",
    "another",
    "inventor,",
    "Elisha",
    "Gray,",
    "had",
    "filed",
    "papers",
    "on",
    "a",
    "similar",
    "idea",
    "on",
    "the",
    "very",
    "same",
    "day.",
    "At",
    "first,",
    "many",
    "people",
    "considered",
    "the",
    "telephone",
    "a",
    "curious",
    "toy",
    "rather",
    "than",
    "a",
    "practical",
    "tool.",
    "Within",
    "a",
    "few",
    "decades,",
    "however,",
    "telephone",
    "lines",
    "connected",
    "cities",
    "across",
    "the",
    "country,",
    "and",
    "businesses",
    "and",
    "families",
    "could",
    "not",
    "imagine",
    "life",
    "without",
    "them.",
    "The",
    "invention",
    "transformed",
    "communication",
    "and",
    "prepared",
    "the",
    "way",
    "for",
    "many",
    "technologies",
    "we",
    "rely",
    "on",
    "today.",
    "Bell",
    "himself,",
    "however,",
    "never",
    "stopped",
    "thinking",
    "of",
    "himself",
    "as",
    "a",
    "teacher",
    "of",
    "the",
    "deaf.",
    "He",
    "continued",
    "to",
    "support",
    "schools",
    "and",
    "research",
    "for",
    "deaf",
    "students",
    "throughout",
    "his",
    "life,",
    "and",
    "he",
    "considered",
    "that",
    "work",
    "more",
    "important",
    "than",
    "any",
    "invention.",
    "Interestingly,",
    "he",
    "reportedly",
    "refused",
    "to",
    "keep",
    "a",
    "telephone",
    "in",
    "his",
    "own",
    "study,",
    "because",
    "he",
    "found",
    "the",
    "ringing",
    "too",
    "distracting",
    "while",
    "he",
    "was",
    "working.",
    "The",
    "inventor",
    "of",
    "the",
    "telephone,",
    "it",
    "seems,",
    "valued",
    "quiet",
    "concentration",
    "above",
    "constant",
    "connection."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "hummed",
      "against",
      "into"
     ],
     "answer": "into",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "puppies",
      "experts",
      "neatly"
     ],
     "answer": "experts",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "puppies",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "it",
      "rarely",
      "soup"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "tumble",
      "wooden",
      "human"
     ],
     "answer": "human",
     "wrong": [
      {
       "answer": "tumble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wooden",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "clouds",
      "them",
      "barely"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "of",
      "chewed",
      "beneath"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "hammer",
      "painting",
      "studying"
     ],
     "answer": "studying",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painting",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "sleeping",
      "speaking",
      "pebble"
     ],
     "answer": "speaking",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeping",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "idea",
      "eagerly",
      "breakfast"
     ],
     "answer": "idea",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "splashed",
      "no",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "without",
      "through",
      "rattled"
     ],
     "answer": "through",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "into",
      "crawled",
      "behind"
     ],
     "answer": "into",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "behind",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "waved",
      "under",
      "with"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "after",
      "for",
      "kicked"
     ],
     "answer": "for",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "Many",
      "Mixed",
      "Purple"
     ],
     "answer": "Many",
     "wrong": [
      {
       "answer": "Mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ",",
     "options": [
      "kindly",
      "pancakes",
      "1876"
     ],
     "answer": "1876",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": ",",
     "options": [
      "Kitchen",
      "Watson",
      "Proudly"
     ],
     "answer": "Watson",
     "wrong": [
      {
       "answer": "Proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Kitchen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "words",
      "boldly",
      "shoes"
     ],
     "answer": "words",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "shoes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "jumped",
      "few",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": ",",
     "options": [
      "pillow",
      "inventor",
      "briskly"
     ],
     "answer": "inventor",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "a",
      "clapped",
      "loud"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": ".",
     "options": [
      "firmly",
      "spoon",
      "day"
     ],
     "answer": "day",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "sandwich",
      "telephone",
      "warmly"
     ],
     "answer": "telephone",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "practical",
      "scribble",
      "sleepy"
     ],
     "answer": "practical",
     "wrong": [
      {
       "answer": "scribble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "wisely",
      "button",
      "telephone"
     ],
     "answer": "telephone",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "button",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "unless",
      "and",
      "hopped"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "life",
      "loosely",
      "puzzles"
     ],
     "answer": "life",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "puzzles",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "skipped",
      "until",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "rivers",
      "we",
      "tightly"
     ],
     "answer": "we",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rivers",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "never",
      "trumpet",
      "backward"
     ],
     "answer": "never",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "nearly",
      "candle",
      "teacher"
     ],
     "answer": "teacher",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "candle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "sneeze",
      "support",
      "jacket"
     ],
     "answer": "support",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneeze",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "throughout",
      "climbed",
      "inside"
     ],
     "answer": "throughout",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "freshly",
      "lunch",
      "work"
     ],
     "answer": "work",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "lunch",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "rain",
      "he",
      "lazily"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "in",
      "washed",
      "across"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "baked",
      "hungry",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": ".",
     "options": [
      "swimming",
      "working",
      "wagon"
     ],
     "answer": "working",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swimming",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": ",",
     "options": [
      "seems",
      "cabbage",
      "sneezes"
     ],
     "answer": "seems",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezes",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G7.B",
   "grade": 7,
   "form": "B",
   "title": "A Lesson in Patience",
   "words": 300,
   "first_sentence": "When Avraham's grandfather offered to teach him woodworking, Avraham imagined building a bookcase by the end of the first afternoon.",
   "tokens": [
    "Instead,",
    "his",
    "grandfather",
    "handed",
    "him",
    "a",
    "rough",
    "board,",
    "a",
    "block",
    "of",
    "wood",
    "wrapped",
    "in",
    "sandpaper,",
    "and",
    "a",
    "single",
    "instruction:",
    "\"Make",
    "it",
    "smooth.\"",
    "Avraham",
    "sanded",
    "for",
    "ten",
    "minutes",
    "and",
    "announced",
    "that",
    "he",
    "was",
    "finished.",
    "His",
    "grandfather",
    "ran",
    "his",
    "hand",
    "along",
    "the",
    "board,",
    "shook",
    "his",
    "head,",
    "and",
    "handed",
    "it",
    "back",
    "without",
    "a",
    "word.",
    "Frustrated,",
    "Avraham",
    "returned",
    "to",
    "work.",
    "This",
    "time",
    "he",
    "sanded",
    "for",
    "half",
    "an",
    "hour,",
    "until",
    "his",
    "arm",
    "ached",
    "and",
    "a",
    "fine",
    "layer",
    "of",
    "dust",
    "covered",
    "his",
    "shirt.",
    "Again,",
    "his",
    "grandfather",
    "felt",
    "the",
    "surface",
    "and",
    "returned",
    "it.",
    "By",
    "the",
    "third",
    "attempt,",
    "Avraham",
    "had",
    "stopped",
    "watching",
    "the",
    "clock.",
    "He",
    "began",
    "to",
    "notice",
    "things",
    "he",
    "had",
    "ignored",
    "before:",
    "the",
    "way",
    "the",
    "grain",
    "of",
    "the",
    "wood",
    "ran",
    "in",
    "long,",
    "curving",
    "lines,",
    "the",
    "rough",
    "patches",
    "near",
    "a",
    "knot,",
    "the",
    "difference",
    "in",
    "sound",
    "as",
    "the",
    "sandpaper",
    "moved",
    "from",
    "coarse",
    "areas",
    "to",
    "smooth",
    "ones.",
    "He",
    "worked",
    "slowly,",
    "checking",
    "the",
    "surface",
    "with",
    "his",
    "fingertips",
    "the",
    "way",
    "his",
    "grandfather",
    "did.",
    "When",
    "he",
    "finally",
    "handed",
    "back",
    "the",
    "board,",
    "his",
    "grandfather",
    "closed",
    "his",
    "eyes",
    "and",
    "moved",
    "his",
    "hand",
    "across",
    "it",
    "twice.",
    "Then",
    "he",
    "smiled.",
    "\"Now,\"",
    "he",
    "said,",
    "\"you",
    "are",
    "ready",
    "to",
    "build",
    "something.\"",
    "Years",
    "later,",
    "Avraham",
    "would",
    "say",
    "that",
    "the",
    "bookcase",
    "they",
    "eventually",
    "made",
    "together",
    "was",
    "not",
    "the",
    "most",
    "important",
    "thing",
    "he",
    "learned",
    "in",
    "that",
    "workshop.",
    "What",
    "he",
    "learned",
    "was",
    "that",
    "good",
    "work",
    "cannot",
    "be",
    "rushed,",
    "and",
    "that",
    "the",
    "first",
    "step",
    "of",
    "any",
    "craft",
    "is",
    "learning",
    "to",
    "see.",
    "He",
    "carried",
    "that",
    "lesson",
    "into",
    "his",
    "studies,",
    "into",
    "his",
    "job,",
    "and",
    "eventually",
    "into",
    "teaching",
    "his",
    "own",
    "sons.",
    "When",
    "one",
    "of",
    "them",
    "complained",
    "that",
    "a",
    "page",
    "of",
    "Gemara",
    "was",
    "taking",
    "too",
    "long,",
    "Avraham",
    "handed",
    "him",
    "a",
    "rough",
    "board",
    "and",
    "a",
    "block",
    "of",
    "sandpaper,",
    "and",
    "he",
    "smiled",
    "at",
    "the",
    "confused",
    "look",
    "on",
    "the",
    "boy's",
    "face."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "giggle",
      "sleepy",
      "rough"
     ],
     "answer": "rough",
     "wrong": [
      {
       "answer": "giggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "against",
      "in",
      "swept"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "it",
      "nicely",
      "soup"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "whistled",
      "unless",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "refrigerator",
      "grandfather",
      "partly"
     ],
     "answer": "grandfather",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "refrigerator",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "shook",
      "helmet",
      "painted"
     ],
     "answer": "shook",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "wiggled",
      "beneath",
      "without"
     ],
     "answer": "without",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": ".",
     "options": [
      "tuesday",
      "work",
      "safely"
     ],
     "answer": "work",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tuesday",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "an",
      "juggled",
      "no"
     ],
     "answer": "an",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "tumbled",
      "loud",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": ".",
     "options": [
      "thunder",
      "shirt",
      "slowly"
     ],
     "answer": "shirt",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "thunder",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "and",
      "giggled",
      "until"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "Quickly",
      "Bread",
      "Avraham"
     ],
     "answer": "Avraham",
     "wrong": [
      {
       "answer": "Quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "forgot",
      "began",
      "ribbon"
     ],
     "answer": "began",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forgot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": ":",
     "options": [
      "before",
      "tunnel",
      "backward"
     ],
     "answer": "before",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "gently",
      "clouds",
      "wood"
     ],
     "answer": "wood",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "purple",
      "rough",
      "stir"
     ],
     "answer": "rough",
     "wrong": [
      {
       "answer": "stir",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "in",
      "stirred",
      "across"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "mop",
      "hungry",
      "coarse"
     ],
     "answer": "coarse",
     "wrong": [
      {
       "answer": "mop",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": ",",
     "options": [
      "sideways",
      "slowly",
      "violin"
     ],
     "answer": "slowly",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "the",
      "shouted",
      "few"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "rocket",
      "never",
      "finally"
     ],
     "answer": "finally",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "sneezed",
      "closed",
      "penny"
     ],
     "answer": "closed",
     "wrong": [
      {
       "answer": "penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "across",
      "hummed",
      "under"
     ],
     "answer": "across",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "loudly",
      "rain",
      "he"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": ".\"",
     "options": [
      "nothing",
      "something",
      "softly"
     ],
     "answer": "something",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "nothing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "the",
      "chewed",
      "green"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "barrel",
      "also",
      "not"
     ],
     "answer": "not",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "also",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "after",
      "in",
      "splashed"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "that",
      "rattled",
      "because"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "because",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "crawled",
      "if",
      "that"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "if",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "sings",
      "is",
      "table"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sings",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "lesson",
      "happily",
      "pillow"
     ],
     "answer": "lesson",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "waved",
      "so",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "so",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "Whether",
      "When",
      "Kicked"
     ],
     "answer": "When",
     "wrong": [
      {
       "answer": "Kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Whether",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "page",
      "sadly",
      "button"
     ],
     "answer": "page",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "button",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "Bravely",
      "Kitchen",
      "Avraham"
     ],
     "answer": "Avraham",
     "wrong": [
      {
       "answer": "Bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Kitchen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "many",
      "a",
      "mixed"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": "",
     "options": [
      "at",
      "jumped",
      "inside"
     ],
     "answer": "at",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 40,
     "token_index": 279,
     "before": "",
     "after": ".",
     "options": [
      "calmly",
      "spoon",
      "face"
     ],
     "answer": "face",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G8.A",
   "grade": 8,
   "form": "A",
   "title": "The Water Cycle and Our Changing Climate",
   "words": 305,
   "first_sentence": "Every drop of water on Earth is part of a continuous journey known as the water cycle.",
   "tokens": [
    "Energy",
    "from",
    "the",
    "sun",
    "heats",
    "oceans,",
    "lakes,",
    "and",
    "rivers,",
    "causing",
    "water",
    "to",
    "evaporate",
    "and",
    "rise",
    "into",
    "the",
    "atmosphere",
    "as",
    "invisible",
    "vapor.",
    "Plants",
    "contribute",
    "as",
    "well,",
    "releasing",
    "moisture",
    "through",
    "tiny",
    "openings",
    "in",
    "their",
    "leaves",
    "in",
    "a",
    "process",
    "called",
    "transpiration.",
    "As",
    "the",
    "vapor",
    "rises,",
    "it",
    "cools",
    "and",
    "condenses",
    "around",
    "microscopic",
    "particles",
    "of",
    "dust,",
    "forming",
    "the",
    "droplets",
    "that",
    "make",
    "up",
    "clouds.",
    "When",
    "these",
    "droplets",
    "combine",
    "and",
    "grow",
    "heavy",
    "enough,",
    "they",
    "fall",
    "back",
    "to",
    "the",
    "surface",
    "as",
    "precipitation,",
    "whether",
    "rain,",
    "snow,",
    "sleet,",
    "or",
    "hail.",
    "Some",
    "of",
    "this",
    "water",
    "flows",
    "across",
    "the",
    "land",
    "into",
    "streams",
    "and",
    "rivers,",
    "eventually",
    "returning",
    "to",
    "the",
    "sea.",
    "Some",
    "soaks",
    "into",
    "the",
    "ground,",
    "refilling",
    "underground",
    "stores",
    "of",
    "water",
    "that",
    "supply",
    "wells",
    "and",
    "springs.",
    "The",
    "cycle",
    "then",
    "begins",
    "again.",
    "Scientists",
    "have",
    "observed",
    "that",
    "rising",
    "global",
    "temperatures",
    "are",
    "altering",
    "this",
    "ancient",
    "pattern.",
    "Warmer",
    "air",
    "can",
    "hold",
    "more",
    "moisture,",
    "which",
    "tends",
    "to",
    "intensify",
    "both",
    "extremes",
    "of",
    "the",
    "cycle.",
    "Some",
    "regions",
    "experience",
    "heavier",
    "storms",
    "and",
    "more",
    "severe",
    "flooding,",
    "while",
    "others",
    "suffer",
    "longer",
    "and",
    "more",
    "frequent",
    "droughts.",
    "Because",
    "the",
    "timing",
    "of",
    "snowmelt",
    "is",
    "also",
    "shifting,",
    "communities",
    "that",
    "depend",
    "on",
    "mountain",
    "snow",
    "for",
    "their",
    "summer",
    "water",
    "supply",
    "face",
    "new",
    "challenges.",
    "Understanding",
    "the",
    "water",
    "cycle",
    "is",
    "therefore",
    "not",
    "merely",
    "an",
    "academic",
    "exercise;",
    "it",
    "is",
    "essential",
    "for",
    "farmers,",
    "engineers,",
    "and",
    "governments",
    "planning",
    "how",
    "to",
    "provide",
    "clean",
    "water",
    "for",
    "growing",
    "populations",
    "in",
    "the",
    "decades",
    "ahead.",
    "Engineers",
    "are",
    "already",
    "responding",
    "by",
    "designing",
    "reservoirs",
    "that",
    "capture",
    "more",
    "water",
    "during",
    "heavy",
    "rains",
    "and",
    "by",
    "improving",
    "systems",
    "that",
    "recycle",
    "used",
    "water",
    "for",
    "farming.",
    "Farmers",
    "are",
    "experimenting",
    "with",
    "crops",
    "that",
    "need",
    "less",
    "irrigation,",
    "and",
    "cities",
    "are",
    "encouraging",
    "residents",
    "to",
    "conserve",
    "water",
    "during",
    "dry",
    "seasons.",
    "Each",
    "of",
    "these",
    "solutions",
    "depends",
    "on",
    "accurate",
    "measurements",
    "of",
    "how",
    "the",
    "cycle",
    "is",
    "changing,",
    "which",
    "is",
    "why",
    "scientists",
    "continue",
    "to",
    "monitor",
    "rainfall,",
    "rivers,",
    "and",
    "soil",
    "moisture",
    "around",
    "the",
    "world."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": ",",
     "options": [
      "pancakes",
      "lakes",
      "neatly"
     ],
     "answer": "lakes",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "and",
      "clapped",
      "unless"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": ".",
     "options": [
      "rarely",
      "pebbles",
      "vapor"
     ],
     "answer": "vapor",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pebbles",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "against",
      "through",
      "hopped"
     ],
     "answer": "through",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "a",
      "skipped",
      "no"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": ",",
     "options": [
      "window",
      "sleeps",
      "rises"
     ],
     "answer": "rises",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeps",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "pillows",
      "particles",
      "barely"
     ],
     "answer": "particles",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillows",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "make",
      "carrot",
      "paint"
     ],
     "answer": "make",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "paint",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "climbed",
      "until",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "beneath",
      "to",
      "washed"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": ",",
     "options": [
      "snow",
      "eagerly",
      "pencils"
     ],
     "answer": "snow",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pencils",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "kindly",
      "music",
      "water"
     ],
     "answer": "water",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "music",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "because",
      "and",
      "baked"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "because",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "Some",
      "Swept",
      "Purple"
     ],
     "answer": "Some",
     "wrong": [
      {
       "answer": "Swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "proudly",
      "songs",
      "stores"
     ],
     "answer": "stores",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "songs",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ".",
     "options": [
      "kitchens",
      "springs",
      "boldly"
     ],
     "answer": "springs",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "kitchens",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "have",
      "blanket",
      "sang"
     ],
     "answer": "have",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "ladder",
      "painting",
      "altering"
     ],
     "answer": "altering",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painting",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "sneeze",
      "hold",
      "bucket"
     ],
     "answer": "hold",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneeze",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "both",
      "whistled",
      "few"
     ],
     "answer": "both",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "basket",
      "invent",
      "experience"
     ],
     "answer": "experience",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "invent",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "so",
      "while",
      "wiggled"
     ],
     "answer": "while",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "so",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": ".",
     "options": [
      "droughts",
      "briskly",
      "birthdays"
     ],
     "answer": "droughts",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "birthdays",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "mitten",
      "backward",
      "also"
     ],
     "answer": "also",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "candy",
      "snow",
      "firmly"
     ],
     "answer": "snow",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "candy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "new",
      "shout",
      "sleepy"
     ],
     "answer": "new",
     "wrong": [
      {
       "answer": "shout",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "garden",
      "sideways",
      "therefore"
     ],
     "answer": "therefore",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "sings",
      "is",
      "kettle"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sings",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "planning",
      "saddle",
      "swimming"
     ],
     "answer": "planning",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swimming",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "hum",
      "wooden",
      "growing"
     ],
     "answer": "growing",
     "wrong": [
      {
       "answer": "hum",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wooden",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "laugh",
      "are",
      "feather"
     ],
     "answer": "are",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "laugh",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "capture",
      "pocket",
      "tickle"
     ],
     "answer": "capture",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "juggled",
      "after",
      "by"
     ],
     "answer": "by",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "across",
      "for",
      "tumbled"
     ],
     "answer": "for",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "that",
      "warmly",
      "soup"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "hammer",
      "forbidding",
      "encouraging"
     ],
     "answer": "encouraging",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forbidding",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": ".",
     "options": [
      "spoons",
      "seasons",
      "wisely"
     ],
     "answer": "seasons",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": "",
     "options": [
      "accurate",
      "swim",
      "hungry"
     ],
     "answer": "accurate",
     "wrong": [
      {
       "answer": "swim",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": ",",
     "options": [
      "pebble",
      "yawning",
      "changing"
     ],
     "answer": "changing",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yawning",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 40,
     "token_index": 279,
     "before": "",
     "after": "",
     "options": [
      "ignore",
      "monitor",
      "trumpet"
     ],
     "answer": "monitor",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ignore",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 41,
     "token_index": 286,
     "before": "",
     "after": "",
     "options": [
      "the",
      "giggled",
      "green"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G8.B",
   "grade": 8,
   "form": "B",
   "title": "The Apprentice Clockmaker",
   "words": 302,
   "first_sentence": "In the narrow shop on Kanal Street, old Reb Zelig had repaired clocks for nearly fifty years, and his reputation for precision extended far beyond the town.",
   "tokens": [
    "When",
    "he",
    "finally",
    "agreed",
    "to",
    "take",
    "an",
    "apprentice,",
    "dozens",
    "of",
    "boys",
    "applied,",
    "but",
    "he",
    "chose",
    "Yaakov,",
    "the",
    "quiet",
    "son",
    "of",
    "a",
    "bookbinder,",
    "for",
    "reasons",
    "nobody",
    "understood.",
    "For",
    "the",
    "first",
    "month,",
    "Yaakov",
    "was",
    "not",
    "permitted",
    "to",
    "touch",
    "a",
    "single",
    "clock.",
    "Instead,",
    "Reb",
    "Zelig",
    "instructed",
    "him",
    "to",
    "observe,",
    "to",
    "sweep",
    "the",
    "floor,",
    "and",
    "to",
    "sort",
    "thousands",
    "of",
    "tiny",
    "screws",
    "and",
    "gears",
    "into",
    "labeled",
    "drawers.",
    "Yaakov",
    "grew",
    "impatient.",
    "His",
    "friends",
    "teased",
    "him",
    "that",
    "he",
    "had",
    "become",
    "a",
    "servant",
    "rather",
    "than",
    "a",
    "craftsman.",
    "One",
    "evening,",
    "he",
    "finally",
    "gathered",
    "the",
    "courage",
    "to",
    "complain.",
    "Reb",
    "Zelig",
    "listened",
    "without",
    "interrupting,",
    "then",
    "placed",
    "a",
    "broken",
    "pocket",
    "watch",
    "on",
    "the",
    "counter",
    "and",
    "asked",
    "Yaakov",
    "to",
    "identify",
    "every",
    "part.",
    "To",
    "his",
    "own",
    "astonishment,",
    "Yaakov",
    "named",
    "each",
    "piece",
    "without",
    "hesitation,",
    "explained",
    "what",
    "it",
    "did,",
    "and",
    "even",
    "noticed",
    "that",
    "one",
    "gear",
    "had",
    "been",
    "replaced",
    "with",
    "a",
    "slightly",
    "incorrect",
    "size",
    "by",
    "a",
    "previous",
    "repairman.",
    "The",
    "old",
    "man",
    "nodded",
    "slowly.",
    "\"A",
    "clock",
    "is",
    "not",
    "repaired",
    "by",
    "the",
    "hands,\"",
    "he",
    "said.",
    "\"It",
    "is",
    "repaired",
    "by",
    "the",
    "eyes",
    "and",
    "the",
    "mind;",
    "the",
    "hands",
    "only",
    "follow.\"",
    "He",
    "slid",
    "the",
    "watch",
    "and",
    "a",
    "set",
    "of",
    "fine",
    "tools",
    "across",
    "the",
    "counter.",
    "That",
    "night,",
    "under",
    "the",
    "yellow",
    "lamp,",
    "Yaakov",
    "began",
    "his",
    "first",
    "repair,",
    "and",
    "he",
    "understood",
    "at",
    "last",
    "why",
    "the",
    "weeks",
    "of",
    "sorting",
    "had",
    "been",
    "necessary.",
    "By",
    "the",
    "end",
    "of",
    "the",
    "year,",
    "customers",
    "began",
    "asking",
    "specifically",
    "for",
    "the",
    "young",
    "apprentice.",
    "Reb",
    "Zelig",
    "pretended",
    "to",
    "be",
    "offended,",
    "but",
    "those",
    "who",
    "knew",
    "him",
    "well",
    "could",
    "see",
    "that",
    "he",
    "was",
    "proud.",
    "When",
    "the",
    "old",
    "clockmaker",
    "finally",
    "retired,",
    "he",
    "left",
    "the",
    "shop",
    "to",
    "Yaakov,",
    "along",
    "with",
    "a",
    "small",
    "wooden",
    "box.",
    "Inside",
    "was",
    "a",
    "single",
    "note",
    "in",
    "his",
    "careful",
    "handwriting:",
    "\"Remember",
    "to",
    "teach",
    "your",
    "apprentice",
    "to",
    "sort",
    "the",
    "screws",
    "first.\""
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "no",
      "an",
      "stirred"
     ],
     "answer": "an",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "he",
      "loosely",
      "soup"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "shouted",
      "loud",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "purple",
      "the",
      "hummed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "to",
      "chewed",
      "against"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "Tightly",
      "Pancake",
      "Zelig"
     ],
     "answer": "Zelig",
     "wrong": [
      {
       "answer": "Tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Pancake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "green",
      "the",
      "splashed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "tiny",
      "sing",
      "hungry"
     ],
     "answer": "tiny",
     "wrong": [
      {
       "answer": "sing",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "Nearly",
      "Bread",
      "Yaakov"
     ],
     "answer": "Yaakov",
     "wrong": [
      {
       "answer": "Nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "unless",
      "that",
      "rattled"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "than",
      "crawled",
      "beneath"
     ],
     "answer": "than",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "jacket",
      "swallowed",
      "gathered"
     ],
     "answer": "gathered",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "sneezed",
      "listened",
      "wagon"
     ],
     "answer": "listened",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "pocket",
      "freshly",
      "kitchen"
     ],
     "answer": "pocket",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "kitchen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "Lazily",
      "Pillow",
      "Yaakov"
     ],
     "answer": "Yaakov",
     "wrong": [
      {
       "answer": "Lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "sleepy",
      "own",
      "jump"
     ],
     "answer": "own",
     "wrong": [
      {
       "answer": "jump",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": ",",
     "options": [
      "hesitation",
      "nicely",
      "lunch"
     ],
     "answer": "hesitation",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "lunch",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "cabbage",
      "forgot",
      "noticed"
     ],
     "answer": "noticed",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forgot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "across",
      "with",
      "waved"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "previous",
      "clap",
      "wooden"
     ],
     "answer": "previous",
     "wrong": [
      {
       "answer": "clap",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wooden",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "\"",
     "after": "",
     "options": [
      "Kicked",
      "Tall",
      "A"
     ],
     "answer": "A",
     "wrong": [
      {
       "answer": "Kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Tall",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": ",\"",
     "options": [
      "spoons",
      "hands",
      "partly"
     ],
     "answer": "hands",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "the",
      "mixed",
      "few"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "helmet",
      "backward",
      "only"
     ],
     "answer": "only",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "many",
      "a",
      "jumped"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": ".",
     "options": [
      "counter",
      "safely",
      "cloud"
     ],
     "answer": "counter",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "cloud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "Slowly",
      "Button",
      "Yaakov"
     ],
     "answer": "Yaakov",
     "wrong": [
      {
       "answer": "Slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Button",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "painted",
      "understood",
      "ribbon"
     ],
     "answer": "understood",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "sorting",
      "tunnel",
      "sleeping"
     ],
     "answer": "sorting",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeping",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "clapped",
      "inside",
      "of"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "under",
      "for",
      "hopped"
     ],
     "answer": "for",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "to",
      "skipped",
      "after"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "quickly",
      "rain",
      "him"
     ],
     "answer": "him",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": ".",
     "options": [
      "frozen",
      "proud",
      "hop"
     ],
     "answer": "proud",
     "wrong": [
      {
       "answer": "hop",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "frozen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "he",
      "gently",
      "rivers"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rivers",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "climbed",
      "until",
      "with"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "every",
      "a",
      "washed"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "\"",
     "after": "",
     "options": [
      "Remember",
      "Violin",
      "Swallow"
     ],
     "answer": "Remember",
     "wrong": [
      {
       "answer": "Violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Swallow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 39,
     "token_index": 272,
     "before": "",
     "after": "",
     "options": [
      "baked",
      "angry",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "angry",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  }
 ]
};/*</P4B>*/
/*<P4D>*/var PF_MAZE_CD = {
 "bank": "PF-P4D_Pathfinder_Maze_CD_DRAFT",
 "made": "2026-11-11",
 "by": "CLAUDE (developer@)",
 "status": "Draft",
 "minutes": 3,
 "score": "correct - 0.5*incorrect",
 "codes": {
  "MAZE-SYNTAX": "wrong kind of word; sentence breaks",
  "MAZE-MEANING": "right kind of word; meaning wrong"
 },
 "passages": [
  {
   "passage_id": "PF.MAZE.G2.C",
   "grade": 2,
   "form": "C",
   "title": "The Rainy Day Game",
   "words": 189,
   "first_sentence": "On Sunday it rained all day, so Yaakov could not play outside.",
   "tokens": [
    "He",
    "sat",
    "by",
    "the",
    "window",
    "and",
    "watched",
    "the",
    "drops",
    "run",
    "down",
    "the",
    "glass.",
    "His",
    "little",
    "brother",
    "Dovi",
    "came",
    "over",
    "with",
    "a",
    "box",
    "of",
    "blocks.",
    "\"Let's",
    "build",
    "a",
    "tall",
    "tower,\"",
    "Dovi",
    "said.",
    "The",
    "boys",
    "sat",
    "on",
    "the",
    "rug",
    "and",
    "started",
    "to",
    "stack",
    "the",
    "blocks",
    "one",
    "by",
    "one.",
    "The",
    "tower",
    "grew",
    "taller",
    "and",
    "taller.",
    "Soon",
    "it",
    "was",
    "as",
    "tall",
    "as",
    "Dovi.",
    "Yaakov",
    "put",
    "a",
    "small",
    "red",
    "block",
    "on",
    "the",
    "very",
    "top.",
    "Then",
    "Dovi",
    "sneezed,",
    "and",
    "the",
    "whole",
    "tower",
    "fell",
    "down",
    "with",
    "a",
    "crash!",
    "Blocks",
    "rolled",
    "under",
    "the",
    "couch",
    "and",
    "the",
    "table.",
    "At",
    "first",
    "Dovi",
    "looked",
    "like",
    "he",
    "would",
    "cry.",
    "Then",
    "Yaakov",
    "started",
    "to",
    "laugh,",
    "and",
    "Dovi",
    "laughed",
    "too.",
    "\"Let's",
    "build",
    "it",
    "again,\"",
    "Yaakov",
    "said,",
    "\"but",
    "this",
    "time",
    "we",
    "will",
    "make",
    "the",
    "bottom",
    "wider.\"",
    "They",
    "built",
    "a",
    "new",
    "tower",
    "with",
    "a",
    "big,",
    "strong",
    "base.",
    "It",
    "did",
    "not",
    "fall,",
    "even",
    "when",
    "Dovi",
    "sneezed",
    "again.",
    "When",
    "the",
    "rain",
    "stopped,",
    "the",
    "boys",
    "were",
    "so",
    "busy",
    "that",
    "they",
    "did",
    "not",
    "even",
    "notice.",
    "They",
    "were",
    "still",
    "building",
    "when",
    "Abba",
    "called",
    "them",
    "for",
    "supper,",
    "and",
    "the",
    "tallest",
    "tower",
    "stood",
    "proudly",
    "in",
    "the",
    "middle",
    "of",
    "the",
    "rug."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "ate",
      "watched",
      "table"
     ],
     "answer": "watched",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "His",
      "Jumped",
      "Loud"
     ],
     "answer": "His",
     "wrong": [
      {
       "answer": "Jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "clapped",
      "every",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "wet",
      "tall",
      "swim"
     ],
     "answer": "tall",
     "wrong": [
      {
       "answer": "swim",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wet",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "on",
      "hopped",
      "under"
     ],
     "answer": "on",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "skipped",
      "few",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "sang",
      "grew",
      "window"
     ],
     "answer": "grew",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "as",
      "carrot",
      "not"
     ],
     "answer": "as",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "not",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "sing",
      "hungry",
      "small"
     ],
     "answer": "small",
     "wrong": [
      {
       "answer": "sing",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "Tomorrow",
      "Then",
      "Blanket"
     ],
     "answer": "Then",
     "wrong": [
      {
       "answer": "Blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Tomorrow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "fell",
      "ladder",
      "smiled"
     ],
     "answer": "fell",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "smiled",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "climbed",
      "above",
      "under"
     ],
     "answer": "under",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "above",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "sea",
      "first",
      "slowly"
     ],
     "answer": "first",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sea",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "Then",
      "Bucket",
      "Never"
     ],
     "answer": "Then",
     "wrong": [
      {
       "answer": "Bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "basket",
      "slept",
      "laughed"
     ],
     "answer": "laughed",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "slept",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ",",
     "options": [
      "sneezed",
      "said",
      "mitten"
     ],
     "answer": "said",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "the",
      "washed",
      "no"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "quickly",
      "sandwich",
      "tower"
     ],
     "answer": "tower",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "drank",
      "did",
      "garden"
     ],
     "answer": "did",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "drank",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": ".",
     "options": [
      "again",
      "kettle",
      "yesterday"
     ],
     "answer": "again",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "yesterday",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "saddle",
      "swam",
      "were"
     ],
     "answer": "were",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swam",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "loudly",
      "even",
      "feather"
     ],
     "answer": "even",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loudly",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "Abba",
      "Gently",
      "Snow"
     ],
     "answer": "Abba",
     "wrong": [
      {
       "answer": "Gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Snow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "jump",
      "wettest",
      "tallest"
     ],
     "answer": "tallest",
     "wrong": [
      {
       "answer": "jump",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wettest",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "without",
      "of",
      "baked"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G2.D",
   "grade": 2,
   "form": "D",
   "title": "Helping Zeidy",
   "words": 175,
   "first_sentence": "Every Friday, Moshe goes to help his zeidy get ready for Shabbos.",
   "tokens": [
    "Zeidy",
    "lives",
    "in",
    "a",
    "small",
    "house",
    "at",
    "the",
    "end",
    "of",
    "the",
    "street.",
    "First,",
    "Moshe",
    "sweeps",
    "the",
    "front",
    "steps",
    "with",
    "a",
    "big",
    "broom.",
    "Then",
    "he",
    "sets",
    "the",
    "table",
    "with",
    "a",
    "white",
    "cloth",
    "and",
    "shiny",
    "cups.",
    "Zeidy",
    "likes",
    "the",
    "candlesticks",
    "to",
    "be",
    "in",
    "the",
    "middle",
    "of",
    "the",
    "table.",
    "Moshe",
    "puts",
    "them",
    "there",
    "very",
    "carefully,",
    "because",
    "they",
    "are",
    "old",
    "and",
    "special.",
    "They",
    "came",
    "from",
    "Zeidy's",
    "own",
    "grandfather",
    "a",
    "long",
    "time",
    "ago.",
    "After",
    "the",
    "table",
    "is",
    "ready,",
    "Zeidy",
    "and",
    "Moshe",
    "sit",
    "down",
    "to",
    "rest.",
    "Zeidy",
    "tells",
    "a",
    "story",
    "about",
    "when",
    "he",
    "was",
    "a",
    "boy.",
    "He",
    "tells",
    "about",
    "the",
    "little",
    "shul",
    "where",
    "he",
    "davened",
    "and",
    "the",
    "friends",
    "he",
    "played",
    "with.",
    "Moshe",
    "likes",
    "the",
    "stories",
    "more",
    "than",
    "anything.",
    "Before",
    "Moshe",
    "goes",
    "home,",
    "Zeidy",
    "gives",
    "him",
    "a",
    "big",
    "hug",
    "and",
    "a",
    "piece",
    "of",
    "cake.",
    "\"You",
    "are",
    "a",
    "good",
    "helper,\"",
    "Zeidy",
    "says",
    "with",
    "a",
    "smile.",
    "Moshe",
    "walks",
    "home",
    "feeling",
    "warm",
    "and",
    "happy.",
    "He",
    "can't",
    "wait",
    "until",
    "next",
    "Friday.",
    "He",
    "already",
    "knows",
    "which",
    "story",
    "he",
    "will",
    "ask",
    "Zeidy",
    "to",
    "tell",
    "next",
    "time."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "under",
      "at",
      "swept"
     ],
     "answer": "at",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "Moshe",
      "Loudly",
      "Soup"
     ],
     "answer": "Moshe",
     "wrong": [
      {
       "answer": "Loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "clap",
      "sleepy",
      "big"
     ],
     "answer": "big",
     "wrong": [
      {
       "answer": "clap",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "behind",
      "with",
      "whistled"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "behind",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "Zeidy",
      "Softly",
      "Broom"
     ],
     "answer": "Zeidy",
     "wrong": [
      {
       "answer": "Softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Broom",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "wiggled",
      "no",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "rain",
      "them",
      "happily"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "old",
      "hop",
      "hungry"
     ],
     "answer": "old",
     "wrong": [
      {
       "answer": "hop",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "skip",
      "loud",
      "own"
     ],
     "answer": "own",
     "wrong": [
      {
       "answer": "skip",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "few",
      "the",
      "juggled"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "sit",
      "pocket",
      "swim"
     ],
     "answer": "sit",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swim",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "sadly",
      "pickle",
      "story"
     ],
     "answer": "story",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "Cake",
      "He",
      "Bravely"
     ],
     "answer": "He",
     "wrong": [
      {
       "answer": "Bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Cake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "he",
      "calmly",
      "it"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "it",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": ".",
     "options": [
      "tumbled",
      "inside",
      "with"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ".",
     "options": [
      "nothing",
      "anything",
      "neatly"
     ],
     "answer": "anything",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "nothing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "him",
      "rarely",
      "clouds"
     ],
     "answer": "him",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "giggled",
      "at",
      "of"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "at",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "Mailbox",
      "Zeidy",
      "Barely"
     ],
     "answer": "Zeidy",
     "wrong": [
      {
       "answer": "Barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Mailbox",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "home",
      "hammer",
      "backward"
     ],
     "answer": "home",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "pebble",
      "sleep",
      "wait"
     ],
     "answer": "wait",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleep",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "wet",
      "which",
      "dig"
     ],
     "answer": "which",
     "wrong": [
      {
       "answer": "dig",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wet",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "tell",
      "trumpet",
      "sing"
     ],
     "answer": "tell",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G3.C",
   "grade": 3,
   "form": "C",
   "title": "How Plants Drink Water",
   "words": 206,
   "first_sentence": "Plants need water to live, but they do not have mouths to drink with.",
   "tokens": [
    "Instead,",
    "plants",
    "drink",
    "through",
    "their",
    "roots,",
    "which",
    "grow",
    "under",
    "the",
    "ground.",
    "The",
    "roots",
    "have",
    "tiny",
    "hairs",
    "that",
    "soak",
    "up",
    "water",
    "from",
    "the",
    "soil,",
    "like",
    "a",
    "sponge",
    "soaking",
    "up",
    "a",
    "spill.",
    "Once",
    "the",
    "water",
    "is",
    "inside",
    "the",
    "roots,",
    "it",
    "travels",
    "up",
    "through",
    "the",
    "stem.",
    "The",
    "stem",
    "has",
    "thin",
    "tubes",
    "inside",
    "it,",
    "almost",
    "like",
    "straws.",
    "The",
    "water",
    "moves",
    "up",
    "these",
    "tubes",
    "all",
    "the",
    "way",
    "to",
    "the",
    "leaves.",
    "In",
    "the",
    "leaves,",
    "the",
    "plant",
    "uses",
    "water,",
    "air,",
    "and",
    "sunlight",
    "to",
    "make",
    "its",
    "own",
    "food.",
    "Some",
    "of",
    "the",
    "water",
    "also",
    "escapes",
    "from",
    "tiny",
    "holes",
    "in",
    "the",
    "leaves",
    "and",
    "goes",
    "back",
    "into",
    "the",
    "air.",
    "You",
    "can",
    "see",
    "how",
    "this",
    "works",
    "with",
    "a",
    "simple",
    "test.",
    "Put",
    "a",
    "white",
    "flower",
    "in",
    "a",
    "glass",
    "of",
    "water",
    "mixed",
    "with",
    "blue",
    "food",
    "coloring.",
    "Wait",
    "a",
    "day",
    "or",
    "two.",
    "The",
    "petals",
    "will",
    "slowly",
    "turn",
    "blue!",
    "The",
    "colored",
    "water",
    "traveled",
    "up",
    "the",
    "stem",
    "and",
    "into",
    "the",
    "flower,",
    "just",
    "like",
    "the",
    "water",
    "from",
    "the",
    "soil.",
    "This",
    "is",
    "how",
    "even",
    "the",
    "tallest",
    "trees",
    "get",
    "water",
    "all",
    "the",
    "way",
    "to",
    "their",
    "top",
    "leaves.",
    "The",
    "next",
    "time",
    "you",
    "water",
    "a",
    "plant,",
    "think",
    "about",
    "the",
    "long",
    "trip",
    "that",
    "each",
    "drop",
    "of",
    "water",
    "will",
    "take",
    "from",
    "the",
    "roots",
    "to",
    "the",
    "leaves."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "which",
      "eagerly",
      "pencils"
     ],
     "answer": "which",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pencils",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "jacket",
      "sing",
      "have"
     ],
     "answer": "have",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "toward",
      "from",
      "stirred"
     ],
     "answer": "from",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "toward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "up",
      "wagon",
      "sideways"
     ],
     "answer": "up",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "shouted",
      "above",
      "inside"
     ],
     "answer": "inside",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "above",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "no",
      "the",
      "hummed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "inside",
      "chewed",
      "without"
     ],
     "answer": "inside",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "cabbage",
      "sleeps",
      "moves"
     ],
     "answer": "moves",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeps",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "from",
      "to",
      "splashed"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "from",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "plant",
      "kindly",
      "spoon"
     ],
     "answer": "plant",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "helmet",
      "paint",
      "make"
     ],
     "answer": "make",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "paint",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "music",
      "water",
      "proudly"
     ],
     "answer": "water",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "music",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "the",
      "rattled",
      "loud"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": ".",
     "options": [
      "boldly",
      "pocket",
      "air"
     ],
     "answer": "air",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pocket",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "against",
      "with",
      "crawled"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "against",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "flower",
      "briskly",
      "pancake"
     ],
     "answer": "flower",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "waved",
      "under",
      "with"
     ],
     "answer": "with",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "but",
      "or",
      "kicked"
     ],
     "answer": "or",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "but",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "!",
     "options": [
      "blue",
      "chew",
      "sour"
     ],
     "answer": "blue",
     "wrong": [
      {
       "answer": "chew",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sour",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "firmly",
      "sky",
      "stem"
     ],
     "answer": "stem",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sky",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "few",
      "the",
      "mixed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "how",
      "ribbon",
      "never"
     ],
     "answer": "how",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "jumped",
      "some",
      "all"
     ],
     "answer": "all",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "some",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "Purple",
      "The",
      "Clapped"
     ],
     "answer": "The",
     "wrong": [
      {
       "answer": "Clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "think",
      "tunnel",
      "sneeze"
     ],
     "answer": "think",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneeze",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "warmly",
      "feather",
      "drop"
     ],
     "answer": "drop",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "feather",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "clouds",
      "roots",
      "wisely"
     ],
     "answer": "roots",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G3.D",
   "grade": 3,
   "form": "D",
   "title": "The Lost Puppy",
   "words": 191,
   "first_sentence": "On the way home from cheder, Avi and Shmuel heard a soft whimpering sound coming from behind a bush.",
   "tokens": [
    "They",
    "pushed",
    "the",
    "leaves",
    "aside",
    "and",
    "found",
    "a",
    "small",
    "brown",
    "puppy",
    "with",
    "floppy",
    "ears.",
    "It",
    "was",
    "shivering",
    "and",
    "looked",
    "very",
    "scared.",
    "\"It",
    "must",
    "be",
    "lost,\"",
    "said",
    "Avi.",
    "The",
    "puppy",
    "had",
    "a",
    "red",
    "collar",
    "with",
    "a",
    "little",
    "metal",
    "tag.",
    "Shmuel",
    "bent",
    "down",
    "slowly",
    "so",
    "he",
    "would",
    "not",
    "frighten",
    "it.",
    "He",
    "read",
    "the",
    "tag",
    "out",
    "loud:",
    "\"My",
    "name",
    "is",
    "Biscuit.",
    "Please",
    "call",
    "my",
    "family.\"",
    "There",
    "was",
    "a",
    "phone",
    "number",
    "on",
    "the",
    "back.",
    "The",
    "boys",
    "carried",
    "Biscuit",
    "carefully",
    "to",
    "Avi's",
    "house,",
    "which",
    "was",
    "just",
    "around",
    "the",
    "corner.",
    "Avi's",
    "father",
    "called",
    "the",
    "number",
    "on",
    "the",
    "tag.",
    "A",
    "man",
    "answered",
    "and",
    "sounded",
    "very",
    "worried.",
    "He",
    "said",
    "that",
    "Biscuit",
    "had",
    "run",
    "out",
    "of",
    "the",
    "yard",
    "that",
    "morning,",
    "and",
    "his",
    "children",
    "had",
    "been",
    "searching",
    "for",
    "hours.",
    "Twenty",
    "minutes",
    "later,",
    "a",
    "car",
    "pulled",
    "up,",
    "and",
    "two",
    "boys",
    "jumped",
    "out.",
    "When",
    "Biscuit",
    "saw",
    "them,",
    "he",
    "wagged",
    "his",
    "tail",
    "so",
    "hard",
    "his",
    "whole",
    "body",
    "shook.",
    "The",
    "boys",
    "thanked",
    "Avi",
    "and",
    "Shmuel",
    "again",
    "and",
    "again.",
    "That",
    "night,",
    "Avi",
    "asked",
    "his",
    "father",
    "if",
    "one",
    "day",
    "their",
    "family",
    "could",
    "have",
    "a",
    "puppy",
    "of",
    "its",
    "own."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "found",
      "violin",
      "painted"
     ],
     "answer": "found",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": ".",
     "options": [
      "loosely",
      "wheels",
      "ears"
     ],
     "answer": "ears",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wheels",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": ".",
     "options": [
      "purple",
      "scared",
      "climb"
     ],
     "answer": "scared",
     "wrong": [
      {
       "answer": "climb",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "The",
      "Hopped",
      "No"
     ],
     "answer": "The",
     "wrong": [
      {
       "answer": "Hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "No",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "skipped",
      "few",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "loudly",
      "slowly",
      "rocket"
     ],
     "answer": "slowly",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loudly",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "He",
      "Tightly",
      "Rain"
     ],
     "answer": "He",
     "wrong": [
      {
       "answer": "Tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "nearly",
      "pocket",
      "name"
     ],
     "answer": "name",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pocket",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "Never",
      "There",
      "Penny"
     ],
     "answer": "There",
     "wrong": [
      {
       "answer": "Penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": ".",
     "options": [
      "back",
      "freshly",
      "moon"
     ],
     "answer": "back",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "Lazily",
      "Zebra's",
      "Avi's"
     ],
     "answer": "Avi's",
     "wrong": [
      {
       "answer": "Lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Zebra's",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": ".",
     "options": [
      "ocean",
      "corner",
      "nicely"
     ],
     "answer": "corner",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ocean",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "the",
      "climbed",
      "many"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "barrel",
      "not",
      "very"
     ],
     "answer": "very",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "not",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "sung",
      "run",
      "table"
     ],
     "answer": "run",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sung",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "and",
      "washed",
      "unless"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": ".",
     "options": [
      "partly",
      "pancakes",
      "hours"
     ],
     "answer": "hours",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": ",",
     "options": [
      "sideways",
      "up",
      "window"
     ],
     "answer": "up",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "Biscuit",
      "Safely",
      "Bread"
     ],
     "answer": "Biscuit",
     "wrong": [
      {
       "answer": "Safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "carrot",
      "upward",
      "so"
     ],
     "answer": "so",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "upward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "trees",
      "boys",
      "slowly"
     ],
     "answer": "boys",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "trees",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": ".",
     "options": [
      "again",
      "blanket",
      "backward"
     ],
     "answer": "again",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "baked",
      "because",
      "if"
     ],
     "answer": "if",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "because",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "each",
      "a",
      "swept"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "each",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G4.C",
   "grade": 4,
   "form": "C",
   "title": "The Penguins of the South",
   "words": 273,
   "first_sentence": "Penguins are birds, but they cannot fly.",
   "tokens": [
    "Instead,",
    "they",
    "are",
    "amazing",
    "swimmers.",
    "Their",
    "wings",
    "have",
    "changed",
    "over",
    "time",
    "into",
    "stiff",
    "flippers",
    "that",
    "push",
    "them",
    "through",
    "the",
    "water",
    "like",
    "the",
    "oars",
    "of",
    "a",
    "boat.",
    "Some",
    "penguins",
    "can",
    "swim",
    "faster",
    "than",
    "fifteen",
    "miles",
    "an",
    "hour",
    "and",
    "dive",
    "deeper",
    "than",
    "a",
    "tall",
    "building.",
    "Most",
    "penguins",
    "live",
    "in",
    "the",
    "southern",
    "half",
    "of",
    "the",
    "world,",
    "and",
    "some",
    "live",
    "on",
    "the",
    "ice",
    "of",
    "Antarctica,",
    "the",
    "coldest",
    "place",
    "on",
    "earth.",
    "How",
    "do",
    "they",
    "survive",
    "the",
    "freezing",
    "cold?",
    "Penguins",
    "have",
    "a",
    "thick",
    "layer",
    "of",
    "fat",
    "under",
    "their",
    "skin",
    "that",
    "keeps",
    "them",
    "warm.",
    "They",
    "also",
    "have",
    "short,",
    "tightly",
    "packed",
    "feathers",
    "that",
    "work",
    "like",
    "a",
    "waterproof",
    "coat.",
    "During",
    "the",
    "worst",
    "storms,",
    "emperor",
    "penguins",
    "huddle",
    "together",
    "in",
    "a",
    "big",
    "crowd.",
    "The",
    "penguins",
    "in",
    "the",
    "middle",
    "stay",
    "warm,",
    "while",
    "those",
    "on",
    "the",
    "outside",
    "face",
    "the",
    "wind.",
    "Every",
    "so",
    "often,",
    "the",
    "birds",
    "slowly",
    "shuffle",
    "around,",
    "so",
    "each",
    "penguin",
    "gets",
    "a",
    "turn",
    "in",
    "the",
    "warm",
    "center.",
    "Emperor",
    "penguins",
    "are",
    "also",
    "known",
    "for",
    "how",
    "they",
    "care",
    "for",
    "their",
    "eggs.",
    "The",
    "parent",
    "lays",
    "one",
    "egg",
    "and",
    "goes",
    "to",
    "the",
    "sea",
    "to",
    "eat.",
    "The",
    "father",
    "balances",
    "the",
    "egg",
    "on",
    "his",
    "feet",
    "and",
    "covers",
    "it",
    "with",
    "a",
    "warm",
    "fold",
    "of",
    "skin.",
    "For",
    "about",
    "two",
    "months,",
    "he",
    "stands",
    "in",
    "the",
    "cold",
    "and",
    "wind",
    "without",
    "eating,",
    "keeping",
    "the",
    "egg",
    "safe",
    "until",
    "it",
    "hatches.",
    "When",
    "the",
    "parent",
    "returns,",
    "it",
    "feeds",
    "the",
    "chick,",
    "and",
    "the",
    "hungry",
    "father",
    "finally",
    "goes",
    "to",
    "the",
    "sea",
    "to",
    "find",
    "food.",
    "Scientists",
    "who",
    "study",
    "penguins",
    "say",
    "that",
    "this",
    "teamwork",
    "is",
    "one",
    "of",
    "the",
    "main",
    "reasons",
    "these",
    "birds",
    "can",
    "survive",
    "in",
    "one",
    "of",
    "the",
    "harshest",
    "places",
    "on",
    "the",
    "planet.",
    "Without",
    "it,",
    "few",
    "chicks",
    "would",
    "live",
    "through",
    "their",
    "first",
    "winter",
    "on",
    "the",
    "ice."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "quickly",
      "spoons",
      "wings"
     ],
     "answer": "wings",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "pillows",
      "flippers",
      "gently"
     ],
     "answer": "flippers",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillows",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "like",
      "whistled",
      "under"
     ],
     "answer": "like",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "loudly",
      "rocks",
      "penguins"
     ],
     "answer": "penguins",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rocks",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "no",
      "an",
      "wiggled"
     ],
     "answer": "an",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "tall",
      "wash",
      "sleepy"
     ],
     "answer": "tall",
     "wrong": [
      {
       "answer": "wash",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "bake",
      "sticky",
      "southern"
     ],
     "answer": "southern",
     "wrong": [
      {
       "answer": "bake",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sticky",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "sing",
      "live",
      "ladder"
     ],
     "answer": "live",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "coldest",
      "sweep",
      "loudest"
     ],
     "answer": "coldest",
     "wrong": [
      {
       "answer": "sweep",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loudest",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "bucket",
      "paint",
      "survive"
     ],
     "answer": "survive",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "paint",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "purple",
      "thick",
      "knit"
     ],
     "answer": "thick",
     "wrong": [
      {
       "answer": "knit",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "that",
      "softly",
      "clouds"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": ",",
     "options": [
      "paddle",
      "wooden",
      "short"
     ],
     "answer": "short",
     "wrong": [
      {
       "answer": "paddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wooden",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "few",
      "a",
      "juggled"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "emperor",
      "happily",
      "pancake"
     ],
     "answer": "emperor",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ".",
     "options": [
      "sadly",
      "pocket",
      "crowd"
     ],
     "answer": "crowd",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pocket",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": ",",
     "options": [
      "noisy",
      "warm",
      "whistle"
     ],
     "answer": "warm",
     "wrong": [
      {
       "answer": "whistle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "noisy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "the",
      "tumbled",
      "each"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "each",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "basket",
      "backward",
      "slowly"
     ],
     "answer": "slowly",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "many",
      "a",
      "giggled"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "penguins",
      "bravely",
      "pebbles"
     ],
     "answer": "penguins",
     "wrong": [
      {
       "answer": "bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pebbles",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "mitten",
      "laugh",
      "care"
     ],
     "answer": "care",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "laugh",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "rubber",
      "one",
      "wiggle"
     ],
     "answer": "one",
     "wrong": [
      {
       "answer": "wiggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rubber",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "to",
      "stirred",
      "without"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "shouted",
      "inside",
      "on"
     ],
     "answer": "on",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "every",
      "a",
      "hummed"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "every",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "two",
      "juggle",
      "blue"
     ],
     "answer": "two",
     "wrong": [
      {
       "answer": "juggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "blue",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "chewed",
      "unless",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "soggy",
      "safe",
      "tumble"
     ],
     "answer": "safe",
     "wrong": [
      {
       "answer": "tumble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soggy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": ",",
     "options": [
      "returns",
      "garden",
      "sneezes"
     ],
     "answer": "returns",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "scribble",
      "sparkly",
      "hungry"
     ],
     "answer": "hungry",
     "wrong": [
      {
       "answer": "scribble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sparkly",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "beneath",
      "to",
      "splashed"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "say",
      "kettle",
      "swim"
     ],
     "answer": "say",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swim",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "rattled",
      "loud",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "after",
      "in",
      "crawled"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "after",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "the",
      "waved",
      "green"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "saddle",
      "dance",
      "live"
     ],
     "answer": "live",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "dance",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 38,
     "token_index": 265,
     "before": "",
     "after": ".",
     "options": [
      "moon",
      "ice",
      "calmly"
     ],
     "answer": "ice",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G4.D",
   "grade": 4,
   "form": "D",
   "title": "The Broken Bike",
   "words": 279,
   "first_sentence": "Chaim had been saving for months to buy a new bike, and when he finally rode it home, he was the happiest boy on the block.",
   "tokens": [
    "For",
    "two",
    "weeks,",
    "he",
    "rode",
    "it",
    "everywhere:",
    "to",
    "shul,",
    "to",
    "the",
    "park,",
    "and",
    "to",
    "his",
    "cousins'",
    "house",
    "across",
    "town.",
    "Then",
    "one",
    "afternoon,",
    "he",
    "left",
    "it",
    "leaning",
    "against",
    "the",
    "fence",
    "while",
    "he",
    "ran",
    "inside",
    "for",
    "a",
    "drink.",
    "When",
    "he",
    "came",
    "back",
    "out,",
    "his",
    "little",
    "brother",
    "Yitzy",
    "was",
    "standing",
    "next",
    "to",
    "the",
    "bike",
    "with",
    "a",
    "guilty",
    "look",
    "on",
    "his",
    "face.",
    "The",
    "front",
    "wheel",
    "was",
    "bent,",
    "and",
    "the",
    "chain",
    "was",
    "hanging",
    "loose.",
    "\"I",
    "just",
    "wanted",
    "to",
    "try",
    "it,\"",
    "Yitzy",
    "whispered.",
    "\"I'm",
    "sorry.\"",
    "Chaim",
    "felt",
    "his",
    "face",
    "grow",
    "hot.",
    "He",
    "wanted",
    "to",
    "shout.",
    "He",
    "had",
    "worked",
    "so",
    "hard",
    "for",
    "that",
    "bike.",
    "But",
    "when",
    "he",
    "saw",
    "the",
    "tears",
    "in",
    "Yitzy's",
    "eyes,",
    "he",
    "took",
    "a",
    "deep",
    "breath",
    "instead.",
    "He",
    "remembered",
    "how",
    "much",
    "he",
    "had",
    "wanted",
    "to",
    "ride",
    "a",
    "big",
    "bike",
    "when",
    "he",
    "was",
    "little.",
    "\"It's",
    "okay,\"",
    "Chaim",
    "finally",
    "said.",
    "\"Let's",
    "see",
    "if",
    "we",
    "can",
    "fix",
    "it",
    "together.\"",
    "The",
    "two",
    "brothers",
    "wheeled",
    "the",
    "bike",
    "to",
    "their",
    "uncle's",
    "garage.",
    "Their",
    "uncle",
    "showed",
    "them",
    "how",
    "to",
    "straighten",
    "the",
    "wheel",
    "and",
    "put",
    "the",
    "chain",
    "back",
    "on.",
    "It",
    "took",
    "the",
    "whole",
    "afternoon,",
    "and",
    "their",
    "hands",
    "were",
    "covered",
    "with",
    "grease.",
    "When",
    "they",
    "finished,",
    "the",
    "bike",
    "worked",
    "perfectly.",
    "Chaim",
    "even",
    "let",
    "Yitzy",
    "ride",
    "it",
    "slowly",
    "around",
    "the",
    "driveway,",
    "holding",
    "the",
    "back",
    "of",
    "the",
    "seat",
    "to",
    "keep",
    "him",
    "steady.",
    "That",
    "night,",
    "Chaim",
    "realized",
    "he",
    "felt",
    "proud,",
    "not",
    "angry.",
    "Fixing",
    "the",
    "bike",
    "together",
    "had",
    "taught",
    "both",
    "brothers",
    "something",
    "important.",
    "A",
    "broken",
    "thing",
    "can",
    "often",
    "be",
    "repaired,",
    "and",
    "so",
    "can",
    "a",
    "hurt",
    "feeling,",
    "if",
    "you",
    "are",
    "patient",
    "enough",
    "to",
    "try.",
    "Yitzy",
    "never",
    "touched",
    "the",
    "bike",
    "again",
    "without",
    "asking",
    "first."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": ":",
     "options": [
      "feather",
      "nowhere",
      "everywhere"
     ],
     "answer": "everywhere",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "nowhere",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "under",
      "to",
      "kicked"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "one",
      "mixed",
      "no"
     ],
     "answer": "one",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "jumped",
      "few",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "many",
      "a",
      "clapped"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "his",
      "hopped",
      "green"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "skipped",
      "inside",
      "to"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "behind",
      "on",
      "climbed"
     ],
     "answer": "on",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "behind",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": ",",
     "options": [
      "bent",
      "giggle",
      "delicious"
     ],
     "answer": "bent",
     "wrong": [
      {
       "answer": "giggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "delicious",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "\"",
     "after": "",
     "options": [
      "Neatly",
      "Soup",
      "I"
     ],
     "answer": "I",
     "wrong": [
      {
       "answer": "Neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": ".",
     "options": [
      "barked",
      "whispered",
      "pocket"
     ],
     "answer": "whispered",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "barked",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "grow",
      "hammer",
      "sing"
     ],
     "answer": "grow",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "pebble",
      "ate",
      "had"
     ],
     "answer": "had",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "Unless",
      "But",
      "Washed"
     ],
     "answer": "But",
     "wrong": [
      {
       "answer": "Washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "Yitzy's",
      "Rarely",
      "Pancake's"
     ],
     "answer": "Yitzy's",
     "wrong": [
      {
       "answer": "Rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Pancake's",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ".",
     "options": [
      "trumpet",
      "sideways",
      "instead"
     ],
     "answer": "instead",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "hated",
      "wanted",
      "jacket"
     ],
     "answer": "wanted",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hated",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "he",
      "barely",
      "it"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "it",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": ".",
     "options": [
      "wagon",
      "sneezed",
      "said"
     ],
     "answer": "said",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "clouds",
      "it",
      "eagerly"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "bike",
      "kindly",
      "moon"
     ],
     "answer": "bike",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "cabbage",
      "sold",
      "showed"
     ],
     "answer": "showed",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sold",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "until",
      "and",
      "baked"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "took",
      "helmet",
      "painted"
     ],
     "answer": "took",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "ribbon",
      "danced",
      "were"
     ],
     "answer": "were",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "danced",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "each",
      "the",
      "swept"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "each",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "Yitzy",
      "Proudly",
      "Spoon"
     ],
     "answer": "Yitzy",
     "wrong": [
      {
       "answer": "Proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "tunnel",
      "eating",
      "holding"
     ],
     "answer": "holding",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eating",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "tickle",
      "keep",
      "violin"
     ],
     "answer": "keep",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "he",
      "boldly",
      "rain"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "briskly",
      "pickle",
      "bike"
     ],
     "answer": "bike",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": ".",
     "options": [
      "purple",
      "important",
      "stir"
     ],
     "answer": "important",
     "wrong": [
      {
       "answer": "stir",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": ",",
     "options": [
      "repaired",
      "rocket",
      "eaten"
     ],
     "answer": "repaired",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eaten",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "whistled",
      "although",
      "if"
     ],
     "answer": "if",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "although",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "Bread",
      "Yitzy",
      "Firmly"
     ],
     "answer": "Yitzy",
     "wrong": [
      {
       "answer": "Firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "asking",
      "penny",
      "sneezing"
     ],
     "answer": "asking",
     "wrong": [
      {
       "answer": "penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezing",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G5.C",
   "grade": 5,
   "form": "C",
   "title": "The Life of a Honeybee Hive",
   "words": 277,
   "first_sentence": "A honeybee hive is like a busy city, with tens of thousands of bees working together.",
   "tokens": [
    "Each",
    "bee",
    "has",
    "a",
    "special",
    "job,",
    "and",
    "the",
    "jobs",
    "change",
    "as",
    "the",
    "bee",
    "grows",
    "older.",
    "At",
    "the",
    "center",
    "of",
    "the",
    "hive",
    "is",
    "the",
    "queen,",
    "the",
    "only",
    "bee",
    "that",
    "lays",
    "eggs.",
    "It",
    "can",
    "lay",
    "more",
    "than",
    "a",
    "thousand",
    "eggs",
    "in",
    "a",
    "single",
    "day.",
    "The",
    "worker",
    "bees,",
    "which",
    "make",
    "up",
    "almost",
    "the",
    "whole",
    "hive,",
    "take",
    "care",
    "of",
    "everything",
    "else.",
    "Young",
    "workers",
    "start",
    "by",
    "cleaning",
    "the",
    "cells",
    "where",
    "eggs",
    "are",
    "laid.",
    "A",
    "few",
    "days",
    "later,",
    "they",
    "become",
    "nurses,",
    "feeding",
    "the",
    "young",
    "bees",
    "with",
    "a",
    "special",
    "food",
    "made",
    "in",
    "their",
    "own",
    "bodies.",
    "After",
    "that,",
    "they",
    "build",
    "wax",
    "comb,",
    "store",
    "food,",
    "and",
    "guard",
    "the",
    "entrance",
    "of",
    "the",
    "hive",
    "against",
    "wasps",
    "and",
    "other",
    "intruders.",
    "In",
    "the",
    "last",
    "weeks",
    "of",
    "their",
    "lives,",
    "workers",
    "become",
    "foragers.",
    "They",
    "fly",
    "out",
    "to",
    "find",
    "flowers,",
    "collecting",
    "nectar",
    "to",
    "make",
    "honey",
    "and",
    "pollen",
    "to",
    "feed",
    "the",
    "young.",
    "A",
    "busy",
    "forager",
    "may",
    "visit",
    "hundreds",
    "of",
    "flowers",
    "on",
    "a",
    "single",
    "trip.",
    "The",
    "hive",
    "also",
    "has",
    "male",
    "bees,",
    "called",
    "drones.",
    "Drones",
    "do",
    "not",
    "collect",
    "food",
    "or",
    "guard",
    "the",
    "hive.",
    "Their",
    "only",
    "job",
    "is",
    "to",
    "mate",
    "with",
    "a",
    "queen",
    "from",
    "another",
    "hive.",
    "In",
    "the",
    "fall,",
    "when",
    "food",
    "becomes",
    "scarce,",
    "the",
    "workers",
    "push",
    "the",
    "drones",
    "out",
    "of",
    "the",
    "hive.",
    "During",
    "the",
    "winter,",
    "the",
    "bees",
    "cluster",
    "together",
    "in",
    "a",
    "tight",
    "ball,",
    "shivering",
    "their",
    "wing",
    "muscles",
    "to",
    "make",
    "heat",
    "and",
    "keep",
    "the",
    "queen",
    "warm",
    "until",
    "spring.",
    "When",
    "the",
    "weather",
    "warms",
    "and",
    "the",
    "first",
    "flowers",
    "open,",
    "the",
    "foragers",
    "fly",
    "out",
    "again,",
    "and",
    "the",
    "busy",
    "life",
    "of",
    "the",
    "hive",
    "begins",
    "once",
    "more.",
    "Every",
    "bee,",
    "from",
    "the",
    "queen",
    "to",
    "the",
    "youngest",
    "worker,",
    "has",
    "a",
    "part",
    "to",
    "play",
    "in",
    "keeping",
    "the",
    "whole",
    "colony",
    "alive."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "unless",
      "and",
      "wiggled"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "grows",
      "barrel",
      "sings"
     ],
     "answer": "grows",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sings",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "warmly",
      "spoon",
      "hive"
     ],
     "answer": "hive",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "pillows",
      "that",
      "wisely"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillows",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "than",
      "juggled",
      "under"
     ],
     "answer": "than",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": ".",
     "options": [
      "loosely",
      "pocket",
      "day"
     ],
     "answer": "day",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pocket",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "never",
      "almost",
      "table"
     ],
     "answer": "almost",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "everything",
      "tightly",
      "nothing"
     ],
     "answer": "everything",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "nothing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "tumbled",
      "no",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "purple",
      "few",
      "mop"
     ],
     "answer": "few",
     "wrong": [
      {
       "answer": "mop",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "the",
      "giggled",
      "loud"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "window",
      "sung",
      "made"
     ],
     "answer": "made",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sung",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "rocks",
      "they",
      "nearly"
     ],
     "answer": "they",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rocks",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "guard",
      "carrot",
      "paint"
     ],
     "answer": "guard",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "paint",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "freshly",
      "pancakes",
      "wasps"
     ],
     "answer": "wasps",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "buttons",
      "weeks",
      "lazily"
     ],
     "answer": "weeks",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "buttons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "They",
      "Nicely",
      "Clouds"
     ],
     "answer": "They",
     "wrong": [
      {
       "answer": "Nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "partly",
      "gravel",
      "nectar"
     ],
     "answer": "nectar",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "gravel",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "tickle",
      "feed",
      "blanket"
     ],
     "answer": "feed",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "visit",
      "ladder",
      "juggle"
     ],
     "answer": "visit",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "juggle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": ".",
     "options": [
      "safely",
      "nap",
      "trip"
     ],
     "answer": "trip",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "nap",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "painted",
      "called",
      "bucket"
     ],
     "answer": "called",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "or",
      "stirred",
      "until"
     ],
     "answer": "or",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "basket",
      "swims",
      "is"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swims",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "sleepy",
      "another",
      "shout"
     ],
     "answer": "another",
     "wrong": [
      {
       "answer": "shout",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "becomes",
      "mitten",
      "dances"
     ],
     "answer": "becomes",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "dances",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "garden",
      "upward",
      "out"
     ],
     "answer": "out",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "upward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "few",
      "the",
      "shouted"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": ",",
     "options": [
      "ball",
      "slowly",
      "sandwich"
     ],
     "answer": "ball",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "quickly",
      "music",
      "heat"
     ],
     "answer": "heat",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "music",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": ".",
     "options": [
      "breakfast",
      "spring",
      "gently"
     ],
     "answer": "spring",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "first",
      "hum",
      "loudest"
     ],
     "answer": "first",
     "wrong": [
      {
       "answer": "hum",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loudest",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": ",",
     "options": [
      "kettle",
      "backward",
      "again"
     ],
     "answer": "again",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "moon",
      "hive",
      "loudly"
     ],
     "answer": "hive",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "the",
      "hummed",
      "many"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "chewed",
      "each",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "each",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "wooden",
      "whole",
      "swim"
     ],
     "answer": "whole",
     "wrong": [
      {
       "answer": "swim",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wooden",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G5.D",
   "grade": 5,
   "form": "D",
   "title": "The Science Fair Surprise",
   "words": 278,
   "first_sentence": "When Rabbi Klein announced that every fifth grader would enter the science fair, Dovid groaned out loud.",
   "tokens": [
    "He",
    "loved",
    "reading",
    "about",
    "science,",
    "but",
    "he",
    "had",
    "no",
    "idea",
    "what",
    "to",
    "study,",
    "and",
    "the",
    "fair",
    "was",
    "only",
    "four",
    "weeks",
    "away.",
    "That",
    "evening,",
    "he",
    "complained",
    "to",
    "his",
    "older",
    "brother",
    "Yehuda,",
    "who",
    "was",
    "cleaning",
    "a",
    "fish",
    "tank",
    "in",
    "the",
    "kitchen.",
    "\"Why",
    "not",
    "study",
    "something",
    "right",
    "here?\"",
    "Yehuda",
    "suggested,",
    "pointing",
    "at",
    "the",
    "fish.",
    "Dovid",
    "looked",
    "at",
    "the",
    "tank.",
    "He",
    "noticed",
    "that",
    "the",
    "fish",
    "always",
    "swam",
    "to",
    "the",
    "same",
    "corner",
    "when",
    "someone",
    "walked",
    "into",
    "the",
    "room.",
    "Did",
    "they",
    "expect",
    "food?",
    "He",
    "decided",
    "to",
    "find",
    "out",
    "whether",
    "fish",
    "could",
    "learn.",
    "For",
    "two",
    "weeks,",
    "Dovid",
    "tapped",
    "twice",
    "on",
    "the",
    "glass",
    "before",
    "he",
    "fed",
    "the",
    "fish.",
    "He",
    "wrote",
    "down",
    "how",
    "long",
    "it",
    "took",
    "them",
    "to",
    "swim",
    "to",
    "the",
    "corner",
    "each",
    "time.",
    "At",
    "first,",
    "the",
    "fish",
    "ignored",
    "the",
    "tapping.",
    "By",
    "the",
    "fifth",
    "day,",
    "they",
    "swam",
    "over",
    "as",
    "soon",
    "as",
    "they",
    "heard",
    "it,",
    "even",
    "before",
    "the",
    "food",
    "appeared.",
    "To",
    "make",
    "sure",
    "it",
    "was",
    "really",
    "the",
    "tapping,",
    "Dovid",
    "tried",
    "tapping",
    "without",
    "feeding",
    "them.",
    "The",
    "fish",
    "still",
    "came.",
    "Dovid",
    "made",
    "a",
    "poster",
    "with",
    "a",
    "graph",
    "showing",
    "how",
    "the",
    "time",
    "grew",
    "shorter",
    "each",
    "day.",
    "At",
    "the",
    "fair,",
    "the",
    "judges",
    "asked",
    "him",
    "how",
    "he",
    "knew",
    "the",
    "fish",
    "were",
    "responding",
    "to",
    "the",
    "sound",
    "and",
    "not",
    "to",
    "his",
    "shadow.",
    "Dovid",
    "explained",
    "that",
    "he",
    "had",
    "also",
    "tapped",
    "from",
    "behind",
    "a",
    "towel",
    "so",
    "the",
    "fish",
    "could",
    "not",
    "see",
    "him.",
    "The",
    "judges",
    "smiled",
    "and",
    "wrote",
    "something",
    "on",
    "their",
    "clipboards.",
    "Dovid",
    "won",
    "first",
    "prize,",
    "but",
    "the",
    "best",
    "part",
    "was",
    "discovering",
    "that",
    "a",
    "question",
    "at",
    "home",
    "could",
    "become",
    "a",
    "real",
    "experiment.",
    "Next",
    "year,",
    "he",
    "already",
    "planned",
    "to",
    "test",
    "whether",
    "the",
    "fish",
    "could",
    "learn",
    "two",
    "different",
    "signals",
    "at",
    "the",
    "same",
    "time."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "it",
      "he",
      "softly"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "it",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "and",
      "splashed",
      "unless"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": ".",
     "options": [
      "saddle",
      "upward",
      "away"
     ],
     "answer": "away",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "upward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "purple",
      "older",
      "sing"
     ],
     "answer": "older",
     "wrong": [
      {
       "answer": "sing",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "fish",
      "happily",
      "pancake"
     ],
     "answer": "fish",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "feather",
      "sneeze",
      "study"
     ],
     "answer": "study",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneeze",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "under",
      "at",
      "rattled"
     ],
     "answer": "at",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": ".",
     "options": [
      "tank",
      "sadly",
      "moon"
     ],
     "answer": "tank",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "pocket",
      "sang",
      "swam"
     ],
     "answer": "swam",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "melted",
      "walked",
      "hammer"
     ],
     "answer": "walked",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "melted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "?",
     "options": [
      "food",
      "bravely",
      "homework"
     ],
     "answer": "food",
     "wrong": [
      {
       "answer": "bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "homework",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "calmly",
      "rocks",
      "fish"
     ],
     "answer": "fish",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rocks",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "painted",
      "tapped",
      "pebble"
     ],
     "answer": "tapped",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "fed",
      "trumpet",
      "tickled"
     ],
     "answer": "fed",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tickled",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "jump",
      "loud",
      "long"
     ],
     "answer": "long",
     "wrong": [
      {
       "answer": "jump",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "no",
      "the",
      "crawled"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "fish",
      "neatly",
      "clouds"
     ],
     "answer": "fish",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": ",",
     "options": [
      "rarely",
      "pickle",
      "day"
     ],
     "answer": "day",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "spoons",
      "they",
      "barely"
     ],
     "answer": "they",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": ".",
     "options": [
      "appeared",
      "jacket",
      "danced"
     ],
     "answer": "appeared",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "danced",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "waved",
      "few",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": ".",
     "options": [
      "pillows",
      "them",
      "eagerly"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillows",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "a",
      "kicked",
      "many"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "mixed",
      "each",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "each",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "green",
      "the",
      "jumped"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "he",
      "kindly",
      "rain"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "clapped",
      "sleepy",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "Breakfast",
      "Dovid",
      "Proudly"
     ],
     "answer": "Dovid",
     "wrong": [
      {
       "answer": "Proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "from",
      "hopped",
      "inside"
     ],
     "answer": "from",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "wagon",
      "ate",
      "could"
     ],
     "answer": "could",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "ate",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "until",
      "and",
      "skipped"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "won",
      "cabbage",
      "lost"
     ],
     "answer": "won",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "lost",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "helmet",
      "sneezed",
      "was"
     ],
     "answer": "was",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "swam",
      "could",
      "ribbon"
     ],
     "answer": "could",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swam",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "he",
      "boldly",
      "soup"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "briskly",
      "stars",
      "fish"
     ],
     "answer": "fish",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "stars",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "hungry",
      "the",
      "climbed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G6.C",
   "grade": 6,
   "form": "C",
   "title": "Inside a Storm Cloud",
   "words": 283,
   "first_sentence": "Thunderstorms are among the most powerful events in nature, and they begin with something as simple as warm, moist air rising into the sky.",
   "tokens": [
    "On",
    "a",
    "hot",
    "day,",
    "the",
    "sun",
    "heats",
    "the",
    "ground,",
    "which",
    "warms",
    "the",
    "air",
    "just",
    "above",
    "it.",
    "Because",
    "warm",
    "air",
    "is",
    "lighter",
    "than",
    "cool",
    "air,",
    "it",
    "rises,",
    "carrying",
    "water",
    "vapor",
    "upward.",
    "As",
    "the",
    "air",
    "climbs",
    "higher,",
    "it",
    "cools,",
    "and",
    "the",
    "vapor",
    "condenses",
    "into",
    "tiny",
    "droplets,",
    "forming",
    "a",
    "cloud.",
    "If",
    "the",
    "rising",
    "air",
    "is",
    "strong",
    "enough,",
    "the",
    "cloud",
    "keeps",
    "growing",
    "taller,",
    "sometimes",
    "reaching",
    "more",
    "than",
    "ten",
    "miles",
    "high.",
    "These",
    "towering",
    "clouds",
    "are",
    "called",
    "cumulonimbus",
    "clouds.",
    "Inside",
    "them,",
    "powerful",
    "currents",
    "of",
    "air",
    "move",
    "up",
    "and",
    "down",
    "at",
    "great",
    "speeds.",
    "Water",
    "droplets",
    "and",
    "bits",
    "of",
    "ice",
    "crash",
    "into",
    "one",
    "another,",
    "building",
    "up",
    "electrical",
    "charges.",
    "Eventually,",
    "the",
    "difference",
    "in",
    "charge",
    "becomes",
    "so",
    "great",
    "that",
    "electricity",
    "jumps",
    "through",
    "the",
    "air",
    "as",
    "a",
    "giant",
    "spark.",
    "That",
    "spark",
    "is",
    "lightning.",
    "A",
    "single",
    "bolt",
    "can",
    "heat",
    "the",
    "air",
    "around",
    "it",
    "to",
    "a",
    "temperature",
    "hotter",
    "than",
    "the",
    "surface",
    "of",
    "the",
    "sun.",
    "The",
    "air",
    "expands",
    "so",
    "suddenly",
    "that",
    "it",
    "creates",
    "a",
    "booming",
    "shock",
    "wave,",
    "which",
    "we",
    "hear",
    "as",
    "thunder.",
    "Because",
    "light",
    "travels",
    "much",
    "faster",
    "than",
    "sound,",
    "we",
    "see",
    "the",
    "flash",
    "before",
    "we",
    "hear",
    "the",
    "boom.",
    "You",
    "can",
    "estimate",
    "how",
    "far",
    "away",
    "a",
    "storm",
    "is",
    "by",
    "counting",
    "the",
    "seconds",
    "between",
    "them",
    "and",
    "dividing",
    "by",
    "five;",
    "the",
    "answer",
    "is",
    "roughly",
    "the",
    "distance",
    "in",
    "miles.",
    "During",
    "a",
    "storm,",
    "the",
    "safest",
    "place",
    "is",
    "inside",
    "a",
    "building",
    "or",
    "a",
    "car",
    "with",
    "a",
    "metal",
    "roof,",
    "far",
    "from",
    "tall",
    "trees",
    "and",
    "open",
    "fields.",
    "If",
    "you",
    "are",
    "caught",
    "outside,",
    "stay",
    "away",
    "from",
    "water",
    "and",
    "metal",
    "fences,",
    "crouch",
    "low",
    "on",
    "the",
    "balls",
    "of",
    "your",
    "feet,",
    "and",
    "wait",
    "at",
    "least",
    "thirty",
    "minutes",
    "after",
    "the",
    "last",
    "thunder",
    "before",
    "going",
    "back",
    "outside."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "heats",
      "tunnel",
      "paints"
     ],
     "answer": "heats",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "paints",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "violin",
      "never",
      "just"
     ],
     "answer": "just",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "louder",
      "lighter",
      "clap"
     ],
     "answer": "lighter",
     "wrong": [
      {
       "answer": "clap",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "louder",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "water",
      "firmly",
      "pepper"
     ],
     "answer": "water",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pepper",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": ",",
     "options": [
      "rocket",
      "sideways",
      "higher"
     ],
     "answer": "higher",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "without",
      "into",
      "washed"
     ],
     "answer": "into",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "the",
      "baked",
      "no"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "warmly",
      "pencil",
      "cloud"
     ],
     "answer": "cloud",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pencil",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "under",
      "than",
      "swept"
     ],
     "answer": "than",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "are",
      "penny",
      "sing"
     ],
     "answer": "are",
     "wrong": [
      {
       "answer": "penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "wisely",
      "pancakes",
      "currents"
     ],
     "answer": "currents",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "inside",
      "at",
      "whistled"
     ],
     "answer": "at",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "of",
      "wiggled",
      "beneath"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "barrel",
      "backward",
      "up"
     ],
     "answer": "up",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "flavor",
      "charge",
      "loosely"
     ],
     "answer": "charge",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "flavor",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "through",
      "juggled",
      "behind"
     ],
     "answer": "through",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "behind",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "Tumbled",
      "Purple",
      "That"
     ],
     "answer": "That",
     "wrong": [
      {
       "answer": "Tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "forgot",
      "can",
      "table"
     ],
     "answer": "can",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forgot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "a",
      "giggled",
      "few"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "stirred",
      "loud",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "unless",
      "that",
      "shouted"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "which",
      "tightly",
      "pillows"
     ],
     "answer": "which",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillows",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "window",
      "sleeps",
      "travels"
     ],
     "answer": "travels",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleeps",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "many",
      "the",
      "hummed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "You",
      "Nearly",
      "Clouds"
     ],
     "answer": "You",
     "wrong": [
      {
       "answer": "Nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "freshly",
      "sandwich",
      "storm"
     ],
     "answer": "storm",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "spoons",
      "them",
      "lazily"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "is",
      "carrot",
      "dances"
     ],
     "answer": "is",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "dances",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "chewed",
      "each",
      "a"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "each",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "hungry",
      "a",
      "splashed"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "metal",
      "hop",
      "jelly"
     ],
     "answer": "metal",
     "wrong": [
      {
       "answer": "hop",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "jelly",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "skip",
      "sleepy",
      "open"
     ],
     "answer": "open",
     "wrong": [
      {
       "answer": "skip",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "swim",
      "stay",
      "blanket"
     ],
     "answer": "stay",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swim",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "crouch",
      "ladder",
      "juggle"
     ],
     "answer": "crouch",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "juggle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": ",",
     "options": [
      "nicely",
      "noses",
      "feet"
     ],
     "answer": "feet",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "noses",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "across",
      "after",
      "rattled"
     ],
     "answer": "after",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": ".",
     "options": [
      "outside",
      "bucket",
      "upward"
     ],
     "answer": "outside",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "upward",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G6.D",
   "grade": 6,
   "form": "D",
   "title": "The Visitor from the Old Country",
   "words": 278,
   "first_sentence": "When Zeidy's cousin Reb Mendel came to visit from overseas, Shloime was not sure what to expect.",
   "tokens": [
    "He",
    "had",
    "only",
    "seen",
    "one",
    "faded",
    "photograph",
    "of",
    "the",
    "old",
    "man,",
    "standing",
    "stiffly",
    "beside",
    "a",
    "wooden",
    "fence.",
    "Reb",
    "Mendel",
    "spoke",
    "very",
    "little",
    "English,",
    "and",
    "Shloime's",
    "Yiddish",
    "was",
    "mostly",
    "the",
    "words",
    "he",
    "heard",
    "at",
    "the",
    "Shabbos",
    "table.",
    "On",
    "the",
    "first",
    "evening,",
    "the",
    "two",
    "of",
    "them",
    "sat",
    "across",
    "from",
    "each",
    "other",
    "in",
    "awkward",
    "silence",
    "while",
    "the",
    "grown-ups",
    "talked",
    "in",
    "the",
    "kitchen.",
    "Shloime",
    "fidgeted",
    "with",
    "his",
    "napkin",
    "and",
    "wished",
    "he",
    "could",
    "be",
    "somewhere",
    "else.",
    "Then",
    "Reb",
    "Mendel",
    "reached",
    "into",
    "his",
    "coat",
    "and",
    "pulled",
    "out",
    "a",
    "small",
    "wooden",
    "box.",
    "Inside",
    "was",
    "a",
    "set",
    "of",
    "carved",
    "chess",
    "pieces,",
    "worn",
    "smooth",
    "from",
    "years",
    "of",
    "use.",
    "He",
    "raised",
    "his",
    "eyebrows",
    "and",
    "pointed",
    "at",
    "the",
    "board",
    "painted",
    "on",
    "the",
    "lid.",
    "Shloime",
    "grinned.",
    "Chess",
    "was",
    "something",
    "he",
    "understood.",
    "They",
    "played",
    "until",
    "long",
    "after",
    "the",
    "grown-ups",
    "had",
    "finished",
    "their",
    "tea.",
    "Reb",
    "Mendel",
    "won",
    "the",
    "first",
    "game",
    "easily,",
    "but",
    "he",
    "slowed",
    "down",
    "in",
    "the",
    "second,",
    "pointing",
    "to",
    "pieces",
    "and",
    "nodding",
    "when",
    "Shloime",
    "found",
    "a",
    "good",
    "move.",
    "Without",
    "sharing",
    "more",
    "than",
    "a",
    "few",
    "words,",
    "they",
    "laughed",
    "together",
    "whenever",
    "one",
    "of",
    "them",
    "made",
    "a",
    "clever",
    "trap.",
    "By",
    "the",
    "end",
    "of",
    "the",
    "week,",
    "Shloime",
    "had",
    "learned",
    "a",
    "dozen",
    "new",
    "Yiddish",
    "words,",
    "and",
    "Reb",
    "Mendel",
    "could",
    "say",
    "\"checkmate\"",
    "with",
    "a",
    "proud",
    "smile.",
    "On",
    "the",
    "morning",
    "he",
    "left,",
    "Reb",
    "Mendel",
    "pressed",
    "the",
    "wooden",
    "box",
    "into",
    "Shloime's",
    "hands.",
    "Shloime",
    "tried",
    "to",
    "give",
    "it",
    "back,",
    "but",
    "the",
    "old",
    "man",
    "shook",
    "his",
    "head",
    "firmly.",
    "Today",
    "the",
    "box",
    "sits",
    "on",
    "Shloime's",
    "shelf,",
    "a",
    "reminder",
    "that",
    "friendship",
    "does",
    "not",
    "always",
    "need",
    "a",
    "common",
    "language.",
    "Every",
    "year",
    "on",
    "Chanukah,",
    "Shloime",
    "takes",
    "out",
    "the",
    "pieces",
    "and",
    "plays",
    "a",
    "game",
    "in",
    "honor",
    "of",
    "Reb",
    "Mendel."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "photograph",
      "partly",
      "pancake"
     ],
     "answer": "photograph",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "crawled",
      "inside",
      "beside"
     ],
     "answer": "beside",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "never",
      "very",
      "basket"
     ],
     "answer": "very",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "mostly",
      "mitten",
      "loudly"
     ],
     "answer": "mostly",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loudly",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "Safely",
      "Pickle",
      "Shabbos"
     ],
     "answer": "Shabbos",
     "wrong": [
      {
       "answer": "Safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Pickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "seven",
      "two",
      "slowly"
     ],
     "answer": "two",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "seven",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "other",
      "quickly",
      "spoons"
     ],
     "answer": "other",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "garden",
      "melted",
      "talked"
     ],
     "answer": "talked",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "melted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "purple",
      "his",
      "waved"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "somewhere",
      "kettle",
      "upward"
     ],
     "answer": "somewhere",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "upward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "kicked",
      "green",
      "his"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "sleepy",
      "wooden",
      "dig"
     ],
     "answer": "wooden",
     "wrong": [
      {
       "answer": "dig",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "carved",
      "chew",
      "soggy"
     ],
     "answer": "carved",
     "wrong": [
      {
       "answer": "chew",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soggy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "mixed",
      "under",
      "of"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "sneezed",
      "pointed",
      "saddle"
     ],
     "answer": "pointed",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ".",
     "options": [
      "lid",
      "gently",
      "moon"
     ],
     "answer": "lid",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": ".",
     "options": [
      "feather",
      "swallowed",
      "understood"
     ],
     "answer": "understood",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "pigeons",
      "grown-ups",
      "softly"
     ],
     "answer": "grown-ups",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pigeons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "won",
      "pocket",
      "painted"
     ],
     "answer": "won",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "hammer",
      "froze",
      "slowed"
     ],
     "answer": "slowed",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "froze",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "clouds",
      "pieces",
      "happily"
     ],
     "answer": "pieces",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "good",
      "climb",
      "wet"
     ],
     "answer": "good",
     "wrong": [
      {
       "answer": "climb",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wet",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "wash",
      "tall",
      "few"
     ],
     "answer": "few",
     "wrong": [
      {
       "answer": "wash",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tall",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "beneath",
      "of",
      "jumped"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "the",
      "clapped",
      "loud"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "pebble",
      "eaten",
      "learned"
     ],
     "answer": "learned",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eaten",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "Soup",
      "Reb",
      "Sadly"
     ],
     "answer": "Reb",
     "wrong": [
      {
       "answer": "Sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "proud",
      "bake",
      "frozen"
     ],
     "answer": "proud",
     "wrong": [
      {
       "answer": "bake",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "frozen",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "Bravely",
      "Bread",
      "Reb"
     ],
     "answer": "Reb",
     "wrong": [
      {
       "answer": "Bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Bread",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "Lamp's",
      "Shloime's",
      "Calmly"
     ],
     "answer": "Shloime's",
     "wrong": [
      {
       "answer": "Calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Lamp's",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": ",",
     "options": [
      "back",
      "trumpet",
      "sideways"
     ],
     "answer": "back",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sideways",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "neatly",
      "spoon",
      "head"
     ],
     "answer": "head",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "Cloud's",
      "Shloime's",
      "Rarely"
     ],
     "answer": "Shloime's",
     "wrong": [
      {
       "answer": "Rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Cloud's",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "not",
      "jacket",
      "also"
     ],
     "answer": "not",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "also",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "barely",
      "pencil",
      "year"
     ],
     "answer": "year",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pencil",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "buttons",
      "pieces",
      "eagerly"
     ],
     "answer": "pieces",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "buttons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "of",
      "hopped",
      "across"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G7.C",
   "grade": 7,
   "form": "C",
   "title": "The Story of the Panama Canal",
   "words": 281,
   "first_sentence": "For centuries, ships traveling between the Atlantic and Pacific Oceans had to make a long and dangerous journey around the southern tip of South America.",
   "tokens": [
    "A",
    "canal",
    "across",
    "the",
    "narrow",
    "land",
    "of",
    "Panama,",
    "people",
    "realized,",
    "could",
    "shorten",
    "the",
    "trip",
    "by",
    "thousands",
    "of",
    "miles.",
    "In",
    "the",
    "1880s,",
    "a",
    "French",
    "company",
    "began",
    "digging,",
    "led",
    "by",
    "the",
    "same",
    "engineer",
    "who",
    "had",
    "built",
    "the",
    "Suez",
    "Canal",
    "in",
    "Egypt.",
    "The",
    "effort",
    "was",
    "a",
    "disaster.",
    "Workers",
    "struggled",
    "with",
    "heavy",
    "rains,",
    "constant",
    "landslides,",
    "and",
    "thick",
    "jungle.",
    "Even",
    "worse,",
    "thousands",
    "fell",
    "ill",
    "with",
    "yellow",
    "fever",
    "and",
    "malaria,",
    "diseases",
    "that",
    "no",
    "one",
    "yet",
    "understood",
    "were",
    "spread",
    "by",
    "mosquitoes.",
    "After",
    "years",
    "of",
    "losses,",
    "the",
    "French",
    "abandoned",
    "the",
    "project.",
    "In",
    "1904,",
    "the",
    "United",
    "States",
    "took",
    "over.",
    "This",
    "time,",
    "the",
    "planners",
    "began",
    "by",
    "fighting",
    "the",
    "diseases.",
    "A",
    "doctor",
    "named",
    "William",
    "Gorgas",
    "led",
    "a",
    "campaign",
    "to",
    "drain",
    "swamps,",
    "cover",
    "water",
    "barrels,",
    "and",
    "spray",
    "standing",
    "water",
    "where",
    "mosquitoes",
    "bred.",
    "Within",
    "a",
    "few",
    "years,",
    "yellow",
    "fever",
    "had",
    "almost",
    "disappeared",
    "from",
    "the",
    "canal",
    "zone.",
    "The",
    "engineers",
    "also",
    "changed",
    "the",
    "design.",
    "Instead",
    "of",
    "digging",
    "a",
    "canal",
    "at",
    "sea",
    "level,",
    "they",
    "built",
    "a",
    "system",
    "of",
    "locks,",
    "giant",
    "water-filled",
    "chambers",
    "that",
    "raise",
    "ships",
    "up",
    "to",
    "an",
    "artificial",
    "lake",
    "and",
    "then",
    "lower",
    "them",
    "back",
    "down",
    "on",
    "the",
    "other",
    "side.",
    "Tens",
    "of",
    "thousands",
    "of",
    "workers",
    "from",
    "many",
    "countries",
    "labored",
    "for",
    "a",
    "decade,",
    "moving",
    "enough",
    "earth",
    "to",
    "fill",
    "a",
    "line",
    "of",
    "railroad",
    "cars",
    "that",
    "would",
    "circle",
    "the",
    "globe",
    "several",
    "times.",
    "The",
    "canal",
    "finally",
    "opened",
    "in",
    "1914.",
    "Today,",
    "thousands",
    "of",
    "ships",
    "pass",
    "through",
    "it",
    "each",
    "year,",
    "carrying",
    "goods",
    "that",
    "people",
    "around",
    "the",
    "world",
    "depend",
    "on.",
    "The",
    "canal",
    "remains",
    "one",
    "of",
    "the",
    "greatest",
    "engineering",
    "projects",
    "ever",
    "completed,",
    "and",
    "its",
    "story",
    "shows",
    "how",
    "solving",
    "a",
    "scientific",
    "problem,",
    "the",
    "spread",
    "of",
    "disease,",
    "made",
    "an",
    "engineering",
    "triumph",
    "possible."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "skipped",
      "under",
      "of"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "menu",
      "trip",
      "kindly"
     ],
     "answer": "trip",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "menu",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": ",",
     "options": [
      "1880s",
      "proudly",
      "pancakes"
     ],
     "answer": "1880s",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "climbed",
      "inside",
      "by"
     ],
     "answer": "by",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "few",
      "the",
      "washed"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "was",
      "wagon",
      "sang"
     ],
     "answer": "was",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": ",",
     "options": [
      "boldly",
      "jokes",
      "rains"
     ],
     "answer": "rains",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "jokes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": ",",
     "options": [
      "tastier",
      "worse",
      "sweep"
     ],
     "answer": "worse",
     "wrong": [
      {
       "answer": "sweep",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tastier",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "and",
      "baked",
      "unless"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "cabbage",
      "painted",
      "understood"
     ],
     "answer": "understood",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "beneath",
      "of",
      "swept"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "In",
      "Whistled",
      "Behind"
     ],
     "answer": "In",
     "wrong": [
      {
       "answer": "Whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Behind",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "Wiggled",
      "Purple",
      "This"
     ],
     "answer": "This",
     "wrong": [
      {
       "answer": "Wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "no",
      "the",
      "juggled"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "led",
      "helmet",
      "swallowed"
     ],
     "answer": "led",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "briskly",
      "music",
      "water"
     ],
     "answer": "water",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "music",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "pianos",
      "mosquitoes",
      "firmly"
     ],
     "answer": "mosquitoes",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pianos",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "fever",
      "warmly",
      "pudding"
     ],
     "answer": "fever",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pudding",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": ".",
     "options": [
      "wisely",
      "sandwich",
      "zone"
     ],
     "answer": "zone",
     "wrong": [
      {
       "answer": "wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "Upward",
      "Instead",
      "Ribbon"
     ],
     "answer": "Instead",
     "wrong": [
      {
       "answer": "Ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Upward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": ",",
     "options": [
      "level",
      "loosely",
      "breakfast"
     ],
     "answer": "level",
     "wrong": [
      {
       "answer": "loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "knit",
      "edible",
      "giant"
     ],
     "answer": "giant",
     "wrong": [
      {
       "answer": "knit",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "edible",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "without",
      "to",
      "tumbled"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "them",
      "tightly",
      "clouds"
     ],
     "answer": "them",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "Nearly",
      "Spoons",
      "Tens"
     ],
     "answer": "Tens",
     "wrong": [
      {
       "answer": "Nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "planets",
      "countries",
      "freshly"
     ],
     "answer": "countries",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "planets",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "earth",
      "lazily",
      "candy"
     ],
     "answer": "earth",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "candy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "nicely",
      "violins",
      "cars"
     ],
     "answer": "cars",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "violins",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": ".",
     "options": [
      "noodles",
      "times",
      "partly"
     ],
     "answer": "times",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "noodles",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": ",",
     "options": [
      "Today",
      "Tunnel",
      "Yesterday"
     ],
     "answer": "Today",
     "wrong": [
      {
       "answer": "Tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Yesterday",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "giggled",
      "none",
      "each"
     ],
     "answer": "each",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "none",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "hungry",
      "the",
      "stirred"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "one",
      "safely",
      "pickle"
     ],
     "answer": "one",
     "wrong": [
      {
       "answer": "safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": ",",
     "options": [
      "violin",
      "eaten",
      "completed"
     ],
     "answer": "completed",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eaten",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "loud",
      "a",
      "shouted"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "made",
      "rocket",
      "sneezed"
     ],
     "answer": "made",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G7.D",
   "grade": 7,
   "form": "D",
   "title": "The Debate Team",
   "words": 277,
   "first_sentence": "Yisroel had always considered himself shy, so when Rabbi Lerner asked him to join the seventh-grade debate team, he assumed it was a mistake.",
   "tokens": [
    "The",
    "team",
    "needed",
    "a",
    "fourth",
    "member",
    "for",
    "the",
    "citywide",
    "tournament,",
    "and",
    "Rabbi",
    "Lerner",
    "insisted",
    "that",
    "Yisroel's",
    "careful",
    "written",
    "arguments",
    "showed",
    "real",
    "promise.",
    "Reluctantly,",
    "Yisroel",
    "agreed.",
    "The",
    "first",
    "practice",
    "was",
    "miserable.",
    "When",
    "it",
    "was",
    "his",
    "turn",
    "to",
    "speak,",
    "his",
    "mind",
    "went",
    "blank,",
    "and",
    "he",
    "stared",
    "at",
    "his",
    "notes",
    "while",
    "the",
    "seconds",
    "ticked",
    "by.",
    "His",
    "teammates",
    "were",
    "kind,",
    "but",
    "Yisroel",
    "noticed",
    "the",
    "worried",
    "looks",
    "they",
    "exchanged.",
    "That",
    "night,",
    "he",
    "almost",
    "decided",
    "to",
    "quit.",
    "Instead,",
    "he",
    "asked",
    "his",
    "older",
    "brother",
    "Natan,",
    "who",
    "had",
    "debated",
    "in",
    "high",
    "school,",
    "for",
    "advice.",
    "Natan",
    "told",
    "him",
    "that",
    "good",
    "debaters",
    "are",
    "not",
    "the",
    "loudest",
    "people",
    "in",
    "the",
    "room;",
    "they",
    "are",
    "the",
    "best",
    "prepared.",
    "He",
    "suggested",
    "that",
    "Yisroel",
    "predict",
    "every",
    "argument",
    "the",
    "other",
    "side",
    "might",
    "make",
    "and",
    "write",
    "a",
    "short",
    "answer",
    "to",
    "each",
    "one.",
    "For",
    "the",
    "next",
    "three",
    "weeks,",
    "Yisroel",
    "filled",
    "an",
    "entire",
    "notebook",
    "with",
    "possible",
    "arguments",
    "and",
    "responses.",
    "He",
    "practiced",
    "speaking",
    "in",
    "front",
    "of",
    "the",
    "mirror,",
    "then",
    "in",
    "front",
    "of",
    "his",
    "family",
    "at",
    "the",
    "Shabbos",
    "table.",
    "At",
    "the",
    "tournament,",
    "the",
    "opposing",
    "team",
    "raised",
    "a",
    "point",
    "that",
    "his",
    "teammates",
    "had",
    "not",
    "considered.",
    "Yisroel's",
    "teammates",
    "looked",
    "at",
    "him,",
    "and",
    "he",
    "realized",
    "he",
    "had",
    "already",
    "written",
    "an",
    "answer",
    "to",
    "that",
    "exact",
    "argument.",
    "His",
    "voice",
    "shook",
    "a",
    "little",
    "at",
    "first,",
    "but",
    "as",
    "he",
    "spoke,",
    "it",
    "grew",
    "steadier.",
    "When",
    "the",
    "judges",
    "announced",
    "the",
    "results,",
    "his",
    "team",
    "had",
    "won",
    "the",
    "round.",
    "Yisroel",
    "learned",
    "that",
    "confidence",
    "is",
    "not",
    "something",
    "you",
    "are",
    "born",
    "with;",
    "it",
    "often",
    "grows",
    "from",
    "careful",
    "preparation.",
    "He",
    "kept",
    "the",
    "notebook",
    "and",
    "used",
    "the",
    "same",
    "method",
    "the",
    "next",
    "year,",
    "when",
    "he",
    "became",
    "captain",
    "of",
    "the",
    "team."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "hummed",
      "under",
      "for"
     ],
     "answer": "for",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "sneezed",
      "insisted",
      "penny"
     ],
     "answer": "insisted",
     "wrong": [
      {
       "answer": "penny",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "real",
      "paddle",
      "soggy"
     ],
     "answer": "real",
     "wrong": [
      {
       "answer": "paddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soggy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "slowly",
      "pancake",
      "practice"
     ],
     "answer": "practice",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancake",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "lunch",
      "turn",
      "quickly"
     ],
     "answer": "turn",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "lunch",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "and",
      "chewed",
      "unless"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "splashed",
      "no",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": ",",
     "options": [
      "purple",
      "kind",
      "whistle"
     ],
     "answer": "kind",
     "wrong": [
      {
       "answer": "whistle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "they",
      "gently",
      "spoons"
     ],
     "answer": "they",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "rattled",
      "beneath",
      "to"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "mailbox",
      "brother",
      "loudly"
     ],
     "answer": "brother",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "mailbox",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": ",",
     "options": [
      "school",
      "softly",
      "pudding"
     ],
     "answer": "school",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pudding",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "wiggle",
      "hungry",
      "good"
     ],
     "answer": "good",
     "wrong": [
      {
       "answer": "wiggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "hungry",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "inside",
      "in",
      "crawled"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": ".",
     "options": [
      "prepared",
      "juggle",
      "wettest"
     ],
     "answer": "prepared",
     "wrong": [
      {
       "answer": "juggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wettest",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "happily",
      "sandwich",
      "argument"
     ],
     "answer": "argument",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "swallow",
      "write",
      "barrel"
     ],
     "answer": "write",
     "wrong": [
      {
       "answer": "barrel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "For",
      "Waved",
      "Without"
     ],
     "answer": "For",
     "wrong": [
      {
       "answer": "Waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "kicked",
      "many",
      "an"
     ],
     "answer": "an",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "many",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": ".",
     "options": [
      "noodles",
      "responses",
      "sadly"
     ],
     "answer": "responses",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "noodles",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "the",
      "mixed",
      "each"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "each",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "bravely",
      "goldfish",
      "family"
     ],
     "answer": "family",
     "wrong": [
      {
       "answer": "bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "goldfish",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": ",",
     "options": [
      "dentist",
      "tournament",
      "calmly"
     ],
     "answer": "tournament",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "dentist",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "that",
      "neatly",
      "clouds"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "clouds",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "rarely",
      "pillows",
      "teammates"
     ],
     "answer": "teammates",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillows",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "rain",
      "he",
      "barely"
     ],
     "answer": "he",
     "wrong": [
      {
       "answer": "barely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "rain",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "that",
      "jumped",
      "loud"
     ],
     "answer": "that",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "tumble",
      "green",
      "little"
     ],
     "answer": "little",
     "wrong": [
      {
       "answer": "tumble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "soup",
      "it",
      "eagerly"
     ],
     "answer": "it",
     "wrong": [
      {
       "answer": "eagerly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soup",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "the",
      "clapped",
      "few"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "clapped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": ".",
     "options": [
      "kindly",
      "moon",
      "round"
     ],
     "answer": "round",
     "wrong": [
      {
       "answer": "kindly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "nothing",
      "something",
      "proudly"
     ],
     "answer": "something",
     "wrong": [
      {
       "answer": "proudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "nothing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "grows",
      "table",
      "melts"
     ],
     "answer": "grows",
     "wrong": [
      {
       "answer": "table",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "melts",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "boldly",
      "umbrella",
      "notebook"
     ],
     "answer": "notebook",
     "wrong": [
      {
       "answer": "boldly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "umbrella",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "sleepy",
      "next",
      "scribble"
     ],
     "answer": "next",
     "wrong": [
      {
       "answer": "scribble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "the",
      "hopped",
      "wet"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hopped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wet",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G8.C",
   "grade": 8,
   "form": "C",
   "title": "The Race to Cure Polio",
   "words": 282,
   "first_sentence": "In the first half of the twentieth century, few diseases frightened parents in the United States more than polio.",
   "tokens": [
    "The",
    "virus",
    "spread",
    "most",
    "often",
    "in",
    "the",
    "summer,",
    "and",
    "it",
    "could",
    "strike",
    "suddenly,",
    "paralyzing",
    "the",
    "muscles",
    "of",
    "the",
    "legs,",
    "arms,",
    "and",
    "sometimes",
    "the",
    "chest.",
    "Children",
    "who",
    "could",
    "no",
    "longer",
    "breathe",
    "on",
    "their",
    "own",
    "were",
    "placed",
    "in",
    "iron",
    "lungs,",
    "large",
    "machines",
    "that",
    "pumped",
    "air",
    "in",
    "and",
    "out",
    "of",
    "their",
    "bodies.",
    "In",
    "1952",
    "alone,",
    "there",
    "were",
    "nearly",
    "58,000",
    "reported",
    "cases",
    "in",
    "the",
    "country.",
    "Swimming",
    "pools",
    "and",
    "movie",
    "theaters",
    "closed",
    "during",
    "outbreaks,",
    "and",
    "families",
    "kept",
    "their",
    "children",
    "indoors.",
    "Scientists",
    "knew",
    "that",
    "a",
    "vaccine",
    "was",
    "the",
    "best",
    "hope,",
    "and",
    "two",
    "researchers",
    "took",
    "different",
    "approaches.",
    "Jonas",
    "Salk,",
    "working",
    "at",
    "the",
    "University",
    "of",
    "Pittsburgh,",
    "developed",
    "a",
    "vaccine",
    "made",
    "from",
    "a",
    "virus",
    "that",
    "had",
    "been",
    "killed",
    "with",
    "a",
    "chemical,",
    "so",
    "it",
    "could",
    "no",
    "longer",
    "cause",
    "disease",
    "but",
    "could",
    "still",
    "teach",
    "the",
    "body",
    "to",
    "defend",
    "itself.",
    "In",
    "1954,",
    "his",
    "vaccine",
    "was",
    "tested",
    "on",
    "more",
    "than",
    "a",
    "million",
    "children,",
    "one",
    "of",
    "the",
    "largest",
    "medical",
    "trials",
    "in",
    "history.",
    "When",
    "the",
    "results",
    "were",
    "announced",
    "in",
    "1955,",
    "the",
    "news",
    "was",
    "celebrated",
    "across",
    "the",
    "country:",
    "the",
    "vaccine",
    "was",
    "safe",
    "and",
    "effective.",
    "A",
    "few",
    "years",
    "later,",
    "Albert",
    "Sabin",
    "introduced",
    "a",
    "vaccine",
    "made",
    "from",
    "a",
    "weakened",
    "live",
    "virus,",
    "which",
    "could",
    "be",
    "given",
    "by",
    "mouth",
    "on",
    "a",
    "sugar",
    "cube",
    "rather",
    "than",
    "by",
    "injection.",
    "Because",
    "it",
    "was",
    "cheaper",
    "and",
    "easier",
    "to",
    "give,",
    "it",
    "became",
    "the",
    "main",
    "tool",
    "for",
    "vaccinating",
    "children",
    "around",
    "the",
    "world.",
    "Thanks",
    "to",
    "decades",
    "of",
    "vaccination",
    "campaigns,",
    "polio",
    "has",
    "been",
    "eliminated",
    "from",
    "most",
    "countries,",
    "and",
    "doctors",
    "hope",
    "that",
    "one",
    "day",
    "it",
    "will",
    "disappear",
    "completely.",
    "The",
    "story",
    "of",
    "polio",
    "shows",
    "how",
    "science,",
    "patience",
    "and",
    "the",
    "cooperation",
    "of",
    "millions",
    "of",
    "families",
    "can",
    "defeat",
    "even",
    "a",
    "disease",
    "that",
    "once",
    "seemed",
    "unstoppable."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "no",
      "the",
      "skipped"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "skipped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": "",
     "options": [
      "paralyzing",
      "window",
      "painting"
     ],
     "answer": "paralyzing",
     "wrong": [
      {
       "answer": "window",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painting",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "climbed",
      "unless",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "climbed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "also",
      "no",
      "carrot"
     ],
     "answer": "no",
     "wrong": [
      {
       "answer": "carrot",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "also",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "placed",
      "blanket",
      "eaten"
     ],
     "answer": "placed",
     "wrong": [
      {
       "answer": "blanket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eaten",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "ladder",
      "sang",
      "pumped"
     ],
     "answer": "pumped",
     "wrong": [
      {
       "answer": "ladder",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": ".",
     "options": [
      "pockets",
      "bodies",
      "briskly"
     ],
     "answer": "bodies",
     "wrong": [
      {
       "answer": "briskly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pockets",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "58,000",
      "giggle",
      "purple"
     ],
     "answer": "58,000",
     "wrong": [
      {
       "answer": "giggle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "firmly",
      "pancakes",
      "pools"
     ],
     "answer": "pools",
     "wrong": [
      {
       "answer": "firmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": "",
     "options": [
      "until",
      "and",
      "washed"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "washed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "knew",
      "bucket",
      "sneezed"
     ],
     "answer": "knew",
     "wrong": [
      {
       "answer": "bucket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": ",",
     "options": [
      "warmly",
      "sandwich",
      "hope"
     ],
     "answer": "hope",
     "wrong": [
      {
       "answer": "warmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sandwich",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "Pickle",
      "Jonas",
      "Wisely"
     ],
     "answer": "Jonas",
     "wrong": [
      {
       "answer": "Wisely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Pickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": ",",
     "options": [
      "Pittsburgh",
      "Loosely",
      "Breakfast"
     ],
     "answer": "Pittsburgh",
     "wrong": [
      {
       "answer": "Loosely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "tightly",
      "pillow",
      "virus"
     ],
     "answer": "virus",
     "wrong": [
      {
       "answer": "tightly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pillow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": ",",
     "options": [
      "lullaby",
      "chemical",
      "nearly"
     ],
     "answer": "chemical",
     "wrong": [
      {
       "answer": "nearly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "lullaby",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "disease",
      "freshly",
      "music"
     ],
     "answer": "disease",
     "wrong": [
      {
       "answer": "freshly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "music",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "baked",
      "beneath",
      "to"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "baked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "danced",
      "was",
      "basket"
     ],
     "answer": "was",
     "wrong": [
      {
       "answer": "basket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "danced",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": ",",
     "options": [
      "children",
      "lazily",
      "bananas"
     ],
     "answer": "children",
     "wrong": [
      {
       "answer": "lazily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "bananas",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "swept",
      "under",
      "in"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "swept",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "across",
      "in",
      "whistled"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "whistled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "the",
      "wiggled",
      "few"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "wiggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": ".",
     "options": [
      "stir",
      "delicious",
      "effective"
     ],
     "answer": "effective",
     "wrong": [
      {
       "answer": "stir",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "delicious",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "swallowed",
      "introduced",
      "mitten"
     ],
     "answer": "introduced",
     "wrong": [
      {
       "answer": "mitten",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "live",
      "mop",
      "wooden"
     ],
     "answer": "live",
     "wrong": [
      {
       "answer": "mop",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "wooden",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "nicely",
      "elbow",
      "mouth"
     ],
     "answer": "mouth",
     "wrong": [
      {
       "answer": "nicely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "elbow",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "without",
      "by",
      "juggled"
     ],
     "answer": "by",
     "wrong": [
      {
       "answer": "juggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "easier",
      "shout",
      "louder"
     ],
     "answer": "easier",
     "wrong": [
      {
       "answer": "shout",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "louder",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "partly",
      "noodle",
      "tool"
     ],
     "answer": "tool",
     "wrong": [
      {
       "answer": "partly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "noodle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "Sneezes",
      "Thanks",
      "Safely"
     ],
     "answer": "Thanks",
     "wrong": [
      {
       "answer": "Safely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Sneezes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "has",
      "garden",
      "melted"
     ],
     "answer": "has",
     "wrong": [
      {
       "answer": "garden",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "melted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "slowly",
      "pianos",
      "doctors"
     ],
     "answer": "doctors",
     "wrong": [
      {
       "answer": "slowly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pianos",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "juggle",
      "disappear",
      "kettle"
     ],
     "answer": "disappear",
     "wrong": [
      {
       "answer": "kettle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "juggle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "how",
      "saddle",
      "never"
     ],
     "answer": "how",
     "wrong": [
      {
       "answer": "saddle",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "never",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "quickly",
      "spoons",
      "millions"
     ],
     "answer": "millions",
     "wrong": [
      {
       "answer": "quickly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "spoons",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "birthday",
      "disease",
      "gently"
     ],
     "answer": "disease",
     "wrong": [
      {
       "answer": "gently",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "birthday",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  },
  {
   "passage_id": "PF.MAZE.G8.D",
   "grade": 8,
   "form": "D",
   "title": "The Bookbinder's Gift",
   "words": 293,
   "first_sentence": "Ever since he was small, Ephraim had loved the smell of old books, so when his grandfather offered to teach him the craft of bookbinding during the summer, he agreed immediately.",
   "tokens": [
    "His",
    "grandfather's",
    "workshop",
    "occupied",
    "the",
    "back",
    "room",
    "of",
    "a",
    "narrow",
    "building",
    "near",
    "the",
    "shul,",
    "crowded",
    "with",
    "presses,",
    "spools",
    "of",
    "thread,",
    "and",
    "stacks",
    "of",
    "worn",
    "seforim",
    "waiting",
    "to",
    "be",
    "repaired.",
    "On",
    "the",
    "first",
    "day,",
    "Ephraim",
    "expected",
    "to",
    "begin",
    "restoring",
    "the",
    "beautiful",
    "leather",
    "volumes",
    "on",
    "the",
    "high",
    "shelf.",
    "Instead,",
    "his",
    "grandfather",
    "handed",
    "him",
    "a",
    "single",
    "loose",
    "page",
    "and",
    "asked",
    "him",
    "to",
    "fold",
    "it",
    "perfectly",
    "in",
    "half",
    "fifty",
    "times,",
    "on",
    "fifty",
    "separate",
    "sheets.",
    "Ephraim",
    "finished",
    "in",
    "ten",
    "minutes,",
    "but",
    "his",
    "grandfather",
    "held",
    "each",
    "fold",
    "up",
    "to",
    "the",
    "light",
    "and",
    "set",
    "aside",
    "more",
    "than",
    "half",
    "of",
    "them",
    "as",
    "uneven.",
    "Over",
    "the",
    "following",
    "weeks,",
    "Ephraim",
    "learned",
    "to",
    "sew",
    "signatures",
    "together",
    "with",
    "linen",
    "thread,",
    "to",
    "mix",
    "glue",
    "to",
    "exactly",
    "the",
    "right",
    "thickness,",
    "and",
    "to",
    "trim",
    "edges",
    "so",
    "straight",
    "that",
    "the",
    "pages",
    "felt",
    "like",
    "a",
    "single",
    "solid",
    "block.",
    "He",
    "made",
    "many",
    "mistakes,",
    "and",
    "some",
    "evenings",
    "he",
    "left",
    "the",
    "workshop",
    "frustrated,",
    "wondering",
    "whether",
    "he",
    "would",
    "ever",
    "be",
    "trusted",
    "with",
    "anything",
    "important.",
    "Near",
    "the",
    "end",
    "of",
    "the",
    "summer,",
    "the",
    "gabbai",
    "of",
    "the",
    "shul",
    "brought",
    "in",
    "an",
    "old",
    "siddur",
    "whose",
    "cover",
    "had",
    "completely",
    "separated",
    "from",
    "its",
    "pages.",
    "It",
    "had",
    "belonged",
    "to",
    "a",
    "founder",
    "of",
    "the",
    "community,",
    "and",
    "the",
    "family",
    "wanted",
    "it",
    "preserved.",
    "To",
    "Ephraim's",
    "astonishment,",
    "his",
    "grandfather",
    "placed",
    "the",
    "siddur",
    "in",
    "front",
    "of",
    "him",
    "and",
    "stepped",
    "back.",
    "Ephraim",
    "worked",
    "slowly",
    "for",
    "three",
    "days,",
    "checking",
    "every",
    "fold",
    "and",
    "every",
    "stitch",
    "the",
    "way",
    "he",
    "had",
    "been",
    "taught.",
    "When",
    "the",
    "family",
    "came",
    "to",
    "collect",
    "it,",
    "they",
    "ran",
    "their",
    "hands",
    "over",
    "the",
    "new",
    "binding",
    "in",
    "silence.",
    "Ephraim",
    "finally",
    "understood",
    "why",
    "the",
    "first",
    "fifty",
    "folds",
    "had",
    "mattered",
    "so",
    "much.",
    "Good",
    "work",
    "rests",
    "on",
    "small",
    "steps",
    "done",
    "well."
   ],
   "choices": [
    {
     "n": 1,
     "token_index": 6,
     "before": "",
     "after": "",
     "options": [
      "smile",
      "room",
      "loudly"
     ],
     "answer": "room",
     "wrong": [
      {
       "answer": "loudly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "smile",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 2,
     "token_index": 13,
     "before": "",
     "after": ",",
     "options": [
      "shul",
      "softly",
      "moon"
     ],
     "answer": "shul",
     "wrong": [
      {
       "answer": "softly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "moon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 3,
     "token_index": 20,
     "before": "",
     "after": "",
     "options": [
      "tumbled",
      "unless",
      "and"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "tumbled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "unless",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 4,
     "token_index": 27,
     "before": "",
     "after": "",
     "options": [
      "sing",
      "be",
      "feather"
     ],
     "answer": "be",
     "wrong": [
      {
       "answer": "feather",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sing",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 5,
     "token_index": 34,
     "before": "",
     "after": "",
     "options": [
      "expected",
      "pocket",
      "sneezed"
     ],
     "answer": "expected",
     "wrong": [
      {
       "answer": "pocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sneezed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 6,
     "token_index": 41,
     "before": "",
     "after": "",
     "options": [
      "happily",
      "pancakes",
      "volumes"
     ],
     "answer": "volumes",
     "wrong": [
      {
       "answer": "happily",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pancakes",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 7,
     "token_index": 48,
     "before": "",
     "after": "",
     "options": [
      "goldfish",
      "grandfather",
      "sadly"
     ],
     "answer": "grandfather",
     "wrong": [
      {
       "answer": "sadly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "goldfish",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 8,
     "token_index": 55,
     "before": "",
     "after": "",
     "options": [
      "and",
      "giggled",
      "until"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "giggled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "until",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 9,
     "token_index": 62,
     "before": "",
     "after": "",
     "options": [
      "stirred",
      "under",
      "in"
     ],
     "answer": "in",
     "wrong": [
      {
       "answer": "stirred",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "under",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 10,
     "token_index": 69,
     "before": "",
     "after": ".",
     "options": [
      "noodles",
      "sheets",
      "bravely"
     ],
     "answer": "sheets",
     "wrong": [
      {
       "answer": "bravely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "noodles",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 11,
     "token_index": 76,
     "before": "",
     "after": "",
     "options": [
      "his",
      "shouted",
      "purple"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "shouted",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "purple",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 12,
     "token_index": 83,
     "before": "",
     "after": "",
     "options": [
      "hummed",
      "no",
      "the"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "hummed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "no",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 13,
     "token_index": 90,
     "before": "",
     "after": "",
     "options": [
      "breakfast",
      "half",
      "calmly"
     ],
     "answer": "half",
     "wrong": [
      {
       "answer": "calmly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "breakfast",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 14,
     "token_index": 97,
     "before": "",
     "after": "",
     "options": [
      "following",
      "hum",
      "sleepy"
     ],
     "answer": "following",
     "wrong": [
      {
       "answer": "hum",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sleepy",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 15,
     "token_index": 104,
     "before": "",
     "after": "",
     "options": [
      "hammer",
      "upward",
      "together"
     ],
     "answer": "together",
     "wrong": [
      {
       "answer": "hammer",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "upward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 16,
     "token_index": 111,
     "before": "",
     "after": "",
     "options": [
      "beneath",
      "to",
      "chewed"
     ],
     "answer": "to",
     "wrong": [
      {
       "answer": "chewed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "beneath",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 17,
     "token_index": 118,
     "before": "",
     "after": "",
     "options": [
      "trim",
      "pebble",
      "juggle"
     ],
     "answer": "trim",
     "wrong": [
      {
       "answer": "pebble",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "juggle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 18,
     "token_index": 125,
     "before": "",
     "after": "",
     "options": [
      "trumpet",
      "sang",
      "felt"
     ],
     "answer": "felt",
     "wrong": [
      {
       "answer": "trumpet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "sang",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 19,
     "token_index": 132,
     "before": "",
     "after": "",
     "options": [
      "swallowed",
      "made",
      "jacket"
     ],
     "answer": "made",
     "wrong": [
      {
       "answer": "jacket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "swallowed",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 20,
     "token_index": 139,
     "before": "",
     "after": "",
     "options": [
      "left",
      "wagon",
      "painted"
     ],
     "answer": "left",
     "wrong": [
      {
       "answer": "wagon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "painted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 21,
     "token_index": 146,
     "before": "",
     "after": "",
     "options": [
      "cabbage",
      "danced",
      "would"
     ],
     "answer": "would",
     "wrong": [
      {
       "answer": "cabbage",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "danced",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 22,
     "token_index": 153,
     "before": "",
     "after": "",
     "options": [
      "Inside",
      "Near",
      "Splashed"
     ],
     "answer": "Near",
     "wrong": [
      {
       "answer": "Splashed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "Inside",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 23,
     "token_index": 160,
     "before": "",
     "after": "",
     "options": [
      "gabbai",
      "neatly",
      "pigeon"
     ],
     "answer": "gabbai",
     "wrong": [
      {
       "answer": "neatly",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "pigeon",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 24,
     "token_index": 167,
     "before": "",
     "after": "",
     "options": [
      "swim",
      "edible",
      "old"
     ],
     "answer": "old",
     "wrong": [
      {
       "answer": "swim",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "edible",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 25,
     "token_index": 174,
     "before": "",
     "after": "",
     "options": [
      "across",
      "from",
      "rattled"
     ],
     "answer": "from",
     "wrong": [
      {
       "answer": "rattled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "across",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 26,
     "token_index": 181,
     "before": "",
     "after": "",
     "options": [
      "a",
      "crawled",
      "loud"
     ],
     "answer": "a",
     "wrong": [
      {
       "answer": "crawled",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "loud",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 27,
     "token_index": 188,
     "before": "",
     "after": "",
     "options": [
      "rarely",
      "umbrella",
      "family"
     ],
     "answer": "family",
     "wrong": [
      {
       "answer": "rarely",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "umbrella",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 28,
     "token_index": 195,
     "before": "",
     "after": "",
     "options": [
      "green",
      "his",
      "waved"
     ],
     "answer": "his",
     "wrong": [
      {
       "answer": "waved",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "green",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 29,
     "token_index": 202,
     "before": "",
     "after": "",
     "options": [
      "of",
      "kicked",
      "without"
     ],
     "answer": "of",
     "wrong": [
      {
       "answer": "kicked",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "without",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 30,
     "token_index": 209,
     "before": "",
     "after": "",
     "options": [
      "helmet",
      "backward",
      "slowly"
     ],
     "answer": "slowly",
     "wrong": [
      {
       "answer": "helmet",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "backward",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 31,
     "token_index": 216,
     "before": "",
     "after": "",
     "options": [
      "although",
      "and",
      "mixed"
     ],
     "answer": "and",
     "wrong": [
      {
       "answer": "mixed",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "although",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 32,
     "token_index": 223,
     "before": "",
     "after": "",
     "options": [
      "been",
      "ribbon",
      "eaten"
     ],
     "answer": "been",
     "wrong": [
      {
       "answer": "ribbon",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "eaten",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 33,
     "token_index": 230,
     "before": "",
     "after": "",
     "options": [
      "tunnel",
      "tickle",
      "collect"
     ],
     "answer": "collect",
     "wrong": [
      {
       "answer": "tunnel",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "tickle",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 34,
     "token_index": 237,
     "before": "",
     "after": "",
     "options": [
      "few",
      "the",
      "jumped"
     ],
     "answer": "the",
     "wrong": [
      {
       "answer": "jumped",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "few",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 35,
     "token_index": 244,
     "before": "",
     "after": "",
     "options": [
      "understood",
      "violin",
      "forgot"
     ],
     "answer": "understood",
     "wrong": [
      {
       "answer": "violin",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "forgot",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 36,
     "token_index": 251,
     "before": "",
     "after": "",
     "options": [
      "rocket",
      "melted",
      "mattered"
     ],
     "answer": "mattered",
     "wrong": [
      {
       "answer": "rocket",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "melted",
       "code": "MAZE-MEANING"
      }
     ]
    },
    {
     "n": 37,
     "token_index": 258,
     "before": "",
     "after": "",
     "options": [
      "soggy",
      "small",
      "jump"
     ],
     "answer": "small",
     "wrong": [
      {
       "answer": "jump",
       "code": "MAZE-SYNTAX"
      },
      {
       "answer": "soggy",
       "code": "MAZE-MEANING"
      }
     ]
    }
   ],
   "status": "Draft"
  }
 ]
};/*</P4D>*/
/*<P4Cv2>*/var PF_LR = {
 "bank": "PF-P4C_Pathfinder_ListenRead_DRAFT_v2",
 "made": "2026-11-11",
 "by": "CLAUDE (developer@)",
 "status": "Draft",
 "rules": {
  "grade": "enrolled grade",
  "order": "alternate listen-first / read-first by boy",
  "questions_read_aloud": "both conditions",
  "confirm": "if a pattern flags, give the grade-below pair (same form) before reporting",
  "patterns": [
   {
    "name": "decoding_barrier",
    "listen": "4-5",
    "read": "0-2",
    "also": "ORF < p25 or low word list"
   },
   {
    "name": "language_barrier",
    "listen": "0-2",
    "read": "0-2"
   },
   {
    "name": "listening_low",
    "listen": "0-2",
    "read": "4-5"
   }
  ]
 },
 "passages": [
  {
   "passage_id": "PF.LR.G0.L.A",
   "grade": 0,
   "mode": "listen",
   "form": "A",
   "title": "Moshe's Rainy Day",
   "words": 100,
   "text": "Moshe wanted to play outside, but it was raining. Big drops hit the window. \"I am bored,\" Moshe said. His zeidy smiled. \"Let's build a tent inside!\" Zeidy put a big blanket over two chairs. Moshe brought pillows and his flashlight. They crawled inside the tent. It was dark and cozy. Zeidy told Moshe a story about a brave little boat. Then they ate crackers and drank apple juice. Moshe heard the rain tapping on the roof. \"Zeidy,\" he said, \"rainy days are the best days.\" When the sun came out, Moshe did not even want to leave the tent.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G0.R.A",
   "grade": 0,
   "mode": "read",
   "form": "A",
   "title": "Ben and the Cat",
   "words": 51,
   "text": "Ben has a cat. The cat is big and tan. The cat sat on a mat. Ben got a cup of milk. The cat ran to the cup. The cat had the milk! Ben had to get a new cup. Ben did not get mad. The cat sat on his lap.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G0.L.B",
   "grade": 0,
   "mode": "listen",
   "form": "B",
   "title": "The Big Snowman",
   "words": 104,
   "text": "On the first snowy morning, Avi and his big brother Yehuda ran outside. The snow was deep and soft. \"Let's make the biggest snowman ever!\" said Avi. They rolled a ball of snow across the yard. It grew bigger and bigger until it was too heavy to push. Yehuda rolled a second ball and lifted it on top. Avi made a small ball for the head. They used two black stones for eyes and a carrot for a nose. Avi gave the snowman his old blue scarf. When their abba came home, he laughed and said, \"That snowman is almost as tall as me!\"",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G0.R.B",
   "grade": 0,
   "mode": "read",
   "form": "B",
   "title": "The Red Bus",
   "words": 54,
   "text": "Dan sat on the red bus. The bus went up a big hill. Dan had a bag on his lap. In the bag was a hat and a pen. The bus got to the top. Dan got off the bus. His rebbe was at the gate. \"Hi, Dan!\" said the rebbe. Dan was glad.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G1.L.A",
   "grade": 1,
   "mode": "listen",
   "form": "A",
   "title": "The Lost Mitten",
   "words": 119,
   "text": "Shimon had two warm red mittens. Every morning, he wore them on the way to cheder. One cold day, when Shimon got home, he had only one mitten. \"Oh no!\" he cried. \"I lost one!\" His father said, \"Let's walk back the way you came and look carefully.\" They walked down the street, looking under bushes and next to fences. Near the bus stop, they saw something red hanging on a branch. It was the mitten! Someone had found it on the sidewalk and hung it up high so its owner could see it. Shimon put on both mittens. \"Whoever hung it up was very kind,\" he said. \"Next time I find something, I will do the same thing.\"",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G1.R.A",
   "grade": 1,
   "mode": "read",
   "form": "A",
   "title": "The Frog and the Log",
   "words": 76,
   "text": "A green frog sat on a log in the pond. The sun was hot, and the frog wanted to rest. Then a big fish swam by. The fish had a wide mouth. The frog did not want to be lunch! He jumped off the log and swam fast to the grass. He hid there until the fish was gone. When it was safe, the frog hopped back to his log and sat in the sun again.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G1.L.B",
   "grade": 1,
   "mode": "listen",
   "form": "B",
   "title": "Helping at the Bakery",
   "words": 123,
   "text": "Every Friday, Akiva helps his uncle at the bakery. Before the sun comes up, the bakery is already busy. The ovens are hot, and the whole street smells like fresh bread. Akiva's job is to put the challahs into paper bags. He has to be gentle, because the challahs are soft and warm. One Friday, a long line of customers waited at the door. Akiva worked as fast as he could. Then he noticed an old man at the back of the line leaning on a cane. Akiva brought him a chair and a small roll to eat while he waited. When the old man reached the front, he thanked Akiva with a big smile. \"You are a real helper,\" his uncle said.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G1.R.B",
   "grade": 1,
   "mode": "read",
   "form": "B",
   "title": "The Kite",
   "words": 71,
   "text": "Yossi made a kite out of paper and sticks. He tied a long string to it. Then he ran across the field. The wind lifted the kite up into the sky. It went higher and higher. Then the wind stopped, and the kite fell into a tree! Yossi was sad. His friend Eli got a tall ladder and helped him get it down. The next day, they flew the kite together.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G2.L.A",
   "grade": 2,
   "mode": "listen",
   "form": "A",
   "title": "The Tortoise Who Kept Going",
   "words": 123,
   "text": "Tortoises are some of the slowest animals on earth, but they are also some of the longest living. Some giant tortoises live for more than one hundred years! A tortoise carries its house on its back. Its hard shell protects it from enemies. When it feels danger, it pulls its head and legs inside the shell and waits until the danger goes away. Tortoises live on land, unlike turtles, many of which spend most of their time in water. Tortoises eat plants, such as grass, leaves, and flowers. Because they move so slowly, they do not need much food. In cold places, some tortoises dig holes and sleep through the winter. They wake up again when the warm weather returns in the spring.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G2.R.A",
   "grade": 2,
   "mode": "read",
   "form": "A",
   "title": "The Spelling Bee",
   "words": 114,
   "text": "Our class had a spelling bee on Thursday. Each boy had to stand up and spell a word out loud. I practiced every night with my older brother. He read words from a list, and I spelled them back to him. On the day of the bee, my hands were shaking. My first word was \"basket,\" and I spelled it right. My second word was \"kitchen.\" I almost forgot the \"t,\" but I remembered just in time. Soon only two boys were left, Meir and me. Meir spelled \"beautiful\" perfectly. Then I got the word \"neighbor.\" I spelled it slowly and carefully. \"Correct!\" said our rebbe. We both won, and we shared the prize.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G2.L.B",
   "grade": 2,
   "mode": "listen",
   "form": "B",
   "title": "How Seeds Travel",
   "words": 124,
   "text": "Plants cannot walk, but their seeds can travel a long way. Seeds need to move away from the parent plant so that they have enough space, sunlight, and water to grow. Some seeds are carried by the wind. A dandelion seed has a tiny fluffy top that works like a parachute and floats through the air. Other seeds travel by water. A coconut can float across the ocean for weeks before it washes up on a beach and starts to grow. Some seeds hitch a ride on animals. Burrs have little hooks that stick to an animal's fur. Later they fall off in a new place. Birds help too. They eat berries, fly away, and drop the seeds far from where they found them.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G2.R.B",
   "grade": 2,
   "mode": "read",
   "form": "B",
   "title": "The Lunch Mix-Up",
   "words": 103,
   "text": "On Monday, Chaim opened his lunch bag and found a tuna sandwich. That was strange, because Chaim did not like tuna. His lunch was always peanut butter. He looked around the lunchroom. At the next table, his friend Zev was staring at a peanut butter sandwich with a puzzled face. Both boys had the same blue lunch bags! They had picked up the wrong ones from the shelf that morning. The boys laughed and traded bags. The next day, Chaim wrote his name on his bag in big letters. Zev tied a red ribbon to his. There were no more mix-ups after that.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G3.L.A",
   "grade": 3,
   "mode": "listen",
   "form": "A",
   "title": "The Bridge Builders",
   "words": 144,
   "text": "When a city needs to cross a wide river, engineers design a bridge. Building a bridge is like solving a giant puzzle. First, the engineers study the river. They measure how wide and deep it is, how fast the water moves, and what kind of ground lies beneath it. Next, they choose the type of bridge. A beam bridge is simple: a flat road rests on posts. It works well for short distances. An arch bridge uses a curved shape that pushes the weight outward to strong supports on each side. For very long distances, engineers often build a suspension bridge. Its road hangs from thick steel cables stretched between tall towers. Before anything is built, engineers test models to make sure the bridge can hold heavy traffic, strong winds, and even earthquakes. A well-built bridge can last for more than a hundred years.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G3.R.A",
   "grade": 3,
   "mode": "read",
   "form": "A",
   "title": "The Science Club Rocket",
   "words": 150,
   "text": "For weeks, the boys in the science club had been building a model rocket. Gavriel cut the cardboard fins, Pinny painted the body silver, and Mendel carefully packed the parachute into the nose. On launch day, the whole school gathered on the field to watch. Mr. Levin, the science teacher, checked everything twice. \"Three, two, one!\" everyone shouted. With a loud whoosh, the rocket shot into the sky, leaving a trail of white smoke. It climbed so high that it looked like a tiny silver dot. Then, at the very top, the nose popped open. Out came the parachute, but it was tangled! The rocket tumbled down and landed in a puddle. The boys groaned. Mendel looked at the muddy parachute and frowned. \"I folded it too tightly,\" he said. \"Next time, I'll fold it loosely.\" Mr. Levin smiled. \"That's exactly what real scientists do. They learn from every launch.\"",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G3.L.B",
   "grade": 3,
   "mode": "listen",
   "form": "B",
   "title": "The Camping Trip",
   "words": 169,
   "text": "Last summer, Nosson went camping for the first time with his father and his uncle. They drove for three hours to a forest beside a lake. Nosson helped set up the tent, though the poles kept falling down until his uncle showed him how to tighten the ropes. That evening, they collected dry sticks and built a small campfire. They davened mincha beside the lake while the sun set behind the trees. After supper, Nosson lay on his back and looked up at the sky. He had never seen so many stars. In the city, the bright lights hid most of them. His father pointed out the Big Dipper and showed him how to find the North Star. That night, Nosson heard strange noises outside the tent: rustling leaves, an owl hooting, and something small scurrying past. At first he was nervous, but his father explained that the forest is always full of quiet life at night. By morning, Nosson had decided that camping was his new favorite thing.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G3.R.B",
   "grade": 3,
   "mode": "read",
   "form": "B",
   "title": "Why We Have Seasons",
   "words": 160,
   "text": "Many people think that summer happens because the earth moves closer to the sun. That idea makes sense, but it is not correct. The real reason for the seasons is the tilt of the earth. The earth is tipped a little to one side as it travels around the sun each year. For part of the year, the northern half of the earth leans toward the sun. The sun's rays hit it more directly, the days are longer, and the weather is warmer. That is summer in the north. Six months later, the earth is on the other side of the sun. Now the northern half leans away. The sun's rays hit at a slant, the days are shorter, and the weather is colder. That is winter. Here is an interesting fact: when it is summer in New York, it is winter in Australia, because the southern half of the earth is leaning away from the sun at that time.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G4.L.A",
   "grade": 4,
   "mode": "listen",
   "form": "A",
   "title": "The Mystery of the Missing Siddur",
   "words": 174,
   "text": "On Tuesday morning, Reuven discovered that his new siddur was missing from his desk. It had a dark green cover with his name stamped in gold letters, and it had been a gift for his bar mitzvah lessons. Reuven searched everywhere: under the desks, in the coat closet, even in the lost-and-found box. By lunchtime, he was miserable, and he could hardly pay attention in class. His friend Doniel offered to help. \"Let's think like detectives,\" Doniel suggested. \"When did you last see it?\" Reuven remembered using it during Shacharis in the beis medrash. After davening, the boys had rushed out to catch the bus for a trip. Maybe he had left it behind. The two boys hurried to the beis medrash and checked the shelves. There, between two old siddurim, was a dark green cover. Someone had found it on a bench and placed it on the shelf where siddurim belong. Reuven hugged it to his chest. \"Next time,\" he said, \"I'm going to slow down and check my place before I leave.\"",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G4.R.A",
   "grade": 4,
   "mode": "read",
   "form": "A",
   "title": "The Language of Bees",
   "words": 170,
   "text": "Honeybees cannot talk, but they have an amazing way of sharing information: they dance. When a worker bee discovers a good patch of flowers, it returns to the hive and performs a special dance on the honeycomb. Other bees crowd around to feel its movements in the darkness of the hive. If the flowers are close by, the bee does a \"round dance,\" circling first one way and then the other. This tells the others to search near the hive. If the flowers are far away, the bee performs a \"waggle dance.\" It walks in a straight line while shaking its body from side to side, then loops around and repeats the pattern. The direction of the straight line shows which way to fly compared to the sun. The length of the waggle shows how far away the flowers are: the longer the waggle, the longer the trip. A scientist named Karl von Frisch spent years decoding this dance, and in 1973 he won a Nobel Prize for his discovery.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G4.L.B",
   "grade": 4,
   "mode": "listen",
   "form": "B",
   "title": "The Inventor Who Never Quit",
   "words": 170,
   "text": "Thomas Edison is famous for inventing a practical electric light bulb, but his success did not come quickly. In the late 1870s, many inventors were trying to make a bulb that would glow for a long time without burning out. The hardest part was finding the right material for the thin thread inside the bulb, called the filament. Edison and his team tested thousands of materials, including cotton thread, fishing line, and even hairs from a friend's beard. Most of them burned out in seconds or minutes. A reporter once asked Edison how it felt to fail so many times. Edison reportedly answered that he had not failed; he had simply found many ways that did not work. Finally, the team tried a carefully baked strip of bamboo. It glowed for more than a thousand hours. Edison's bulbs, together with the power stations he helped build, brought electric light into homes and streets across America. His story shows that patience and hard work can matter as much as brilliant ideas.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G4.R.B",
   "grade": 4,
   "mode": "read",
   "form": "B",
   "title": "The New Boy",
   "words": 170,
   "text": "When Elchanan moved from Israel to Baltimore in the middle of fourth grade, he understood only a little English. On his first day, the boys in his class crowded around him, asking questions he could not follow. He smiled and nodded, but inside he felt lost. At recess, he stood by the fence while the others played ball. The next morning, a boy named Hillel sat down beside him. Hillel had a grandfather from Israel, and he knew some Hebrew. \"Boker tov,\" he said, grinning. Elchanan's face lit up. During recess, Hillel taught him the rules of the game they called punchball, mixing English and Hebrew words. When Elchanan didn't know a word, Hillel acted it out, and both boys laughed. Week by week, Elchanan's English improved. In return, he helped Hillel with his Chumash homework, explaining the Hebrew words that Hillel found difficult. By the end of the year, the two boys were inseparable. Elchanan later said that the most important English word he learned that year was \"friend.\"",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G5.L.A",
   "grade": 5,
   "mode": "listen",
   "form": "A",
   "title": "The Coral Reef City",
   "words": 213,
   "text": "A coral reef looks like a garden of colorful rocks, but it is actually built by living animals. Tiny creatures called coral polyps, each no bigger than a pencil eraser, take minerals from seawater and build hard skeletons around themselves. When polyps die, new ones grow on top of their skeletons. Over thousands of years, these layers form enormous reefs. The Great Barrier Reef near Australia is so large that it can be seen from space. Reefs cover less than one percent of the ocean floor, yet about a quarter of all ocean species depend on them for food or shelter. Fish hide in the reef's cracks, sea turtles graze on nearby sea grass, and small cleaner fish pick parasites off larger fish. Reefs also protect coastlines by breaking up powerful waves before they reach the shore. Unfortunately, reefs are in danger. When ocean water becomes too warm, polyps lose the tiny algae that live inside them and give them their color and much of their food. The coral turns white, a process called bleaching. If the water cools quickly, the coral can recover, but if the heat lasts too long, the coral may die. Scientists around the world are working to protect reefs and even to grow new coral in underwater nurseries.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G5.R.A",
   "grade": 5,
   "mode": "read",
   "form": "A",
   "title": "The Chess Tournament",
   "words": 201,
   "text": "Yisroel had been playing chess with his grandfather every motzei Shabbos since he was six, but he had never played in a real tournament. When his rebbe announced a chess competition between the yeshivos in the city, Yisroel signed up immediately. His first two games went smoothly. In the third round, he faced Baruch, a tall eighth grader with a reputation for winning quickly. Baruch moved his pieces fast and confidently, and within minutes Yisroel had lost a knight. Yisroel felt his face grow hot. He wanted to hurry, to win the piece back right away. Then he remembered his grandfather's advice: \"When you feel rushed, that is exactly when you must slow down.\" Yisroel folded his hands and studied the board for a long time. He noticed that Baruch, in his hurry, had left his king poorly protected. Slowly, carefully, Yisroel moved his bishop and then his queen into position. Six moves later, Baruch stared at the board in surprise. It was checkmate. Yisroel didn't win the whole tournament; he finished in third place. But when he showed his grandfather the game that night, the old man replayed every move twice and said, \"This is the game I will remember.\"",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G5.L.B",
   "grade": 5,
   "mode": "listen",
   "form": "B",
   "title": "The Pony Express",
   "words": 207,
   "text": "In 1860, sending a letter from Missouri to California could take a month or more by stagecoach or ship. A company decided to try something faster: a relay of horseback riders called the Pony Express. Riders, mostly young men who were light and tough, galloped about ten to fifteen miles to a station, where they quickly jumped onto a fresh horse and kept going. After about seventy-five miles, a new rider took over the mail pouch. Day and night, through deserts, mountains, and storms, the mail kept moving. The trip of nearly two thousand miles took only about ten days. The riders faced great danger from harsh weather, rough trails, and the loneliness of the open land. They carried very little: the mail, a canteen of water, and sometimes a small Bible given to each rider by the company. For a short time, the Pony Express was the fastest way to send news across the country. But it lasted only about eighteen months. In October 1861, the first telegraph line connected the east and west coasts. A message that took ten days by horse could now arrive in seconds. The Pony Express shut down almost immediately, but its riders became a lasting symbol of courage and determination.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G5.R.B",
   "grade": 5,
   "mode": "read",
   "form": "B",
   "title": "How Your Heart Works",
   "words": 198,
   "text": "Your heart is a muscle about the size of your fist, and it works every second of your life without ever taking a break. Each day, it beats about one hundred thousand times, pumping blood through a network of blood vessels long enough to circle the earth more than twice. The heart has four rooms, called chambers. The two upper chambers receive blood, and the two lower chambers pump it out. The right side of the heart sends blood to the lungs, where it picks up oxygen and gets rid of carbon dioxide. The oxygen-rich blood then returns to the left side of the heart, which pumps it out to the rest of the body. Because the left side has to push blood much farther, its walls are thicker and stronger. Valves between the chambers act like one-way doors, opening to let blood through and then snapping shut so it cannot flow backward. The \"lub-dub\" sound a doctor hears through a stethoscope is the sound of these valves closing. Like any muscle, the heart gets stronger with exercise. Activities such as running, swimming, and biking make it more efficient, so it can pump more blood with each beat.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G6.L.A",
   "grade": 6,
   "mode": "listen",
   "form": "A",
   "title": "The Mapmaker",
   "words": 231,
   "text": "For centuries, sailors trusted their lives to maps that were full of mistakes. Coastlines were drawn in the wrong places, islands appeared that did not exist, and huge areas were simply left blank. One reason was that sailors could measure how far north or south they were by looking at the sun or stars, but measuring how far east or west they had traveled, called longitude, was nearly impossible. To find longitude, a navigator needed to know the exact time at home port and compare it with the local time on the ship. Every hour of difference meant fifteen degrees of longitude. The problem was that ordinary clocks, which used swinging pendulums, could not keep accurate time on a rolling ship. Errors of even a few minutes could put a ship dozens of miles off course, sometimes onto deadly rocks. In 1714, the British government offered an enormous prize to anyone who could solve the longitude problem. The winner was not a famous scientist but a self-taught carpenter and clockmaker named John Harrison. Over more than forty years, he built a series of marine clocks, each smaller and more accurate than the last. His final design, about the size of a large pocket watch, lost only a few seconds during a long sea voyage. Harrison's invention made ocean travel far safer and allowed mapmakers, at last, to draw the world accurately.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G6.R.A",
   "grade": 6,
   "mode": "read",
   "form": "A",
   "title": "The Fundraiser",
   "words": 223,
   "text": "When the roof of the shul's small library began to leak, Gershon decided that the boys in sixth grade should raise the money to fix it. The repair would cost twelve hundred dollars, which seemed impossible to most of his classmates. \"We're just kids,\" said Tzvi. \"Where are we going to find that kind of money?\" Gershon refused to be discouraged. He divided the class into teams. One team organized a car wash in the shul parking lot every Sunday. Another team collected used seforim, repaired their covers, and sold them at a table after davening. A third team made colorful posters explaining the project and hung them in every store on the avenue. For the first two weeks, they raised only ninety dollars, and some boys wanted to quit. Gershon reminded them that every dollar meant one less drop of water on the old books. Slowly, the community noticed. A hardware store donated roofing materials. A retired roofer offered to do the work at half price. People began dropping extra money into the car-wash bucket. By Chanukah, the boys had raised the full amount, plus enough extra to buy a new bookshelf. At the dedication, the rav thanked the boys and said that they had repaired more than a roof; they had reminded the whole community what determined people can do together.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G6.L.B",
   "grade": 6,
   "mode": "listen",
   "form": "B",
   "title": "Lessons from the Dust Bowl",
   "words": 217,
   "text": "In the 1930s, a terrible disaster struck the Great Plains of the United States. For decades, farmers had plowed up millions of acres of native grassland to plant wheat. The deep roots of the prairie grasses had held the soil in place for thousands of years, even through droughts. Once the grass was gone, nothing protected the bare earth. Then, beginning in 1931, the rain stopped falling. Year after year, crops withered and died. Strong winds swept across the dry fields and lifted the loose topsoil into the air. Enormous clouds of dust, some more than a mile high, rolled across the plains, turning day into night. People called them black blizzards. Dust piled up against fences and buried farm equipment. It seeped through cracks in windows and doors, covering furniture and food. Many people and animals developed serious lung illnesses. Hundreds of thousands of families abandoned their farms and moved west in search of work. The government responded by teaching farmers new methods: planting rows of trees to block the wind, plowing along the curves of the land, rotating crops, and leaving some fields to rest. These practices helped the soil recover. Today, the Dust Bowl is remembered as a powerful lesson about what can happen when people change the land without understanding how it works.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G6.R.B",
   "grade": 6,
   "mode": "read",
   "form": "B",
   "title": "The Robot Competition",
   "words": 216,
   "text": "For three months, the robotics team at Yeshiva Tiferes had been building a robot for the regional competition. The challenge was to design a machine that could pick up colored blocks and stack them into a tower within two minutes. Shloime wrote the computer code, Ari designed the claw, and Moishy built the base and wheels. The night before the competition, disaster struck. During a final test, the claw suddenly snapped, and a crucial gear cracked in half. There was no replacement gear, and the store that sold parts was closed. The boys stared at the broken robot in silence. Then Ari had an idea. \"What if we don't need that gear?\" he asked. \"What if we redesign the claw to use rubber bands instead?\" It sounded ridiculous, but they had nothing to lose. Working until midnight, the boys rebuilt the claw using rubber bands, a paper clip, and parts from an old toy truck. Shloime rewrote the code to match the new design. At the competition, their robot looked strange next to the polished machines of the other teams. But when the timer started, it worked. The rubber-band claw gripped the blocks gently and stacked them perfectly. The team didn't win first place, but the judges gave them a special award for creative problem solving.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G7.L.A",
   "grade": 7,
   "mode": "listen",
   "form": "A",
   "title": "The Power of Habits",
   "words": 235,
   "text": "Psychologists estimate that a large share of what we do each day is not the result of conscious decisions but of habits, actions we repeat so often that they become automatic. Brushing your teeth, tying your shoes, and even the route you walk to school are all habits. Researchers describe a habit as a loop with three parts. First comes a cue, a signal that triggers the behavior, such as an alarm clock ringing. Next comes the routine, the behavior itself. Finally comes a reward, something that makes the brain want to repeat the loop, such as a feeling of satisfaction or relief. Over time, the brain links the cue directly to the reward, and the routine happens almost without thought. This explains why bad habits can be so hard to break. A student who checks his phone whenever he feels bored is responding to a cue, boredom, and receiving a reward, a moment of entertainment. Simply deciding to stop rarely works. Experts suggest a more effective strategy: keep the cue and the reward, but change the routine. When boredom strikes, the student might stand up and stretch, or review a few vocabulary words, and then enjoy a short break as a reward. Building good habits works the same way. Our Sages taught that a person is shaped by his repeated actions, and modern research agrees: small actions, repeated daily, gradually shape who we become.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G7.R.A",
   "grade": 7,
   "mode": "read",
   "form": "A",
   "title": "The Long Way Back",
   "words": 243,
   "text": "Eliezer had always been the fastest runner in his class, so when he tore a ligament in his knee during a baseball game in October, it felt as though the ground had been pulled out from under him. The doctor's verdict was clear: surgery, followed by months of physical therapy. There would be no running until spring, possibly longer. The first weeks were the hardest. Eliezer watched from the bench as his friends played at recess, and he grew irritable and quiet. His physical therapist, a soft-spoken man named Mr. Adler, gave him exercises that seemed absurdly small: lifting his leg a few inches, bending his knee a few degrees more each day. \"This is pointless,\" Eliezer muttered one afternoon. Mr. Adler showed him a chart. On it, he had recorded every measurement since the first session. The line climbed slowly but steadily upward. \"Progress you can't feel is still progress,\" Mr. Adler said. Something shifted in Eliezer's thinking. He began keeping his own chart and setting tiny goals. He discovered that he had more patience than he had imagined. He also started spending recess with Yitzchak, a quiet boy who rarely joined the games and who, it turned out, had a brilliant sense of humor. By April, Eliezer was jogging again. By June, he was running. But when his rebbe asked the class to write about the most important thing they had learned that year, Eliezer didn't write about running at all.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G7.L.B",
   "grade": 7,
   "mode": "listen",
   "form": "B",
   "title": "The Silk Road",
   "words": 226,
   "text": "For more than a thousand years, a vast network of trade routes known as the Silk Road connected China with Central Asia, the Middle East, and Europe. It was not a single road but a web of paths across deserts, mountains, and grasslands, stretching some four thousand miles. Merchants rarely traveled the whole distance. Instead, goods passed from trader to trader, city to city, increasing in price at each stop. The route took its name from Chinese silk, a luxurious fabric that was highly prized in Rome and elsewhere. For centuries, the Chinese closely guarded the secret of how silk was made from the cocoons of silkworms. But silk was only one of many goods. Spices, paper, tea, glass, horses, and precious stones traveled in both directions. Even more important than goods, however, were ideas. Along the Silk Road, travelers shared inventions such as papermaking and the compass, as well as knowledge of mathematics, medicine, and astronomy. Jewish merchants, known as the Radhanites, were among the traders who traveled these routes in the early Middle Ages, using their knowledge of many languages to do business across distant lands. The Silk Road also had a darker side. Diseases spread along trade routes, including the plague that devastated Europe in the 1300s. By the 1400s, as sea routes became faster and safer, the overland Silk Road gradually declined.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G7.R.B",
   "grade": 7,
   "mode": "read",
   "form": "B",
   "title": "Are Video Games Good for You?",
   "words": 234,
   "text": "For years, many parents and teachers have worried that video games harm children's minds and bodies. Recently, some researchers have argued that the picture is more complicated. Several studies have found that certain fast-paced games can improve players' visual attention, helping them notice details and track multiple moving objects at once. Strategy games may strengthen planning and problem-solving skills, and some games that require cooperation can build teamwork. Supporters point to these findings as evidence that games are not simply a waste of time. Critics, however, raise serious concerns. Many studies of game benefits are small, and skills learned in a game do not always transfer to real-life tasks such as reading or mathematics. Long hours of gaming can crowd out sleep, physical exercise, homework, and time with family. Some games are designed with features that encourage players to keep playing far longer than they intended, making it hard to stop. There is also strong evidence that heavy screen use late at night disrupts sleep, which in turn harms memory and mood. Most experts now agree that the question is not simply whether games are good or bad. What matters is which games, how much time, and what activities are being replaced. A short session of a thoughtful strategy game is very different from five hours of play that pushes aside learning and rest. As with many things, the key is balance and self-control.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G8.L.A",
   "grade": 8,
   "mode": "listen",
   "form": "A",
   "title": "The Race to the South Pole",
   "words": 241,
   "text": "In 1911, two expeditions set out to become the first people to reach the South Pole. One was led by Roald Amundsen of Norway; the other by Robert Falcon Scott of Britain. Both teams faced temperatures far below zero, fierce winds, and hundreds of miles of ice. Their outcomes, however, could hardly have been more different. Amundsen had spent years learning from the Inuit people of the Arctic. He dressed his men in loose fur clothing that kept them warm without trapping sweat, and he relied on teams of sled dogs, which were well suited to the cold. He planned his route carefully, set up supply depots in advance, and marked them clearly so they could be found even in poor visibility. Scott's team relied partly on motor sledges and ponies. The motor sledges broke down in the extreme cold, and the ponies struggled in deep snow and had to be put down. Scott's men ended up pulling their heavy sledges themselves, burning enormous amounts of energy. Amundsen reached the Pole on December 14, 1911. When Scott's exhausted team arrived more than a month later, they found the Norwegian flag already flying. On the return journey, Scott and his companions died of cold, hunger, and exhaustion, only about eleven miles from a supply depot. Historians still debate the reasons for the two outcomes, but most agree that Amundsen's careful preparation and willingness to learn from experienced people played a decisive role.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G8.R.A",
   "grade": 8,
   "mode": "read",
   "form": "A",
   "title": "The Translator",
   "words": 254,
   "text": "Every Thursday after Maariv, Pesach walked to the apartment of Mr. Stern, an elderly man who lived alone two blocks from the shul. Officially, Pesach came to help with errands: carrying groceries, fixing the television remote, reading the small print on medicine bottles. Unofficially, he came to listen. Mr. Stern had grown up in a small town in Hungary and had survived the war as a teenager. He rarely spoke about those years, but he loved to talk about the town before the war: the wooden shul with its painted ceiling, the market on Tuesdays, the rebbe who tested the boys on Gemara every Friday afternoon. One evening, Mr. Stern took a bundle of yellowed letters from a drawer. They were written in Yiddish by his father, the last letters he had received before the deportations. \"My eyes are too weak now,\" he said quietly. \"And my grandchildren cannot read Yiddish.\" Pesach hesitated. His Yiddish was decent but far from perfect. Still, he agreed to try. Week after week, the two of them worked through the letters, Pesach reading slowly, Mr. Stern correcting a word here and there, sometimes pausing for a long while in silence. Pesach typed each letter in English, and by the end of the winter, he had bound them into a small book. At Mr. Stern's ninetieth birthday, his grandchildren held the book in their hands and read their great-grandfather's words for the first time. Mr. Stern looked across the room at Pesach and said nothing. He didn't need to.",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G8.L.B",
   "grade": 8,
   "mode": "listen",
   "form": "B",
   "title": "Can We Trust What We Read Online?",
   "words": 247,
   "text": "Every day, billions of people get their news and information from the internet. This has made knowledge more available than at any time in history, but it has also created a serious problem: false information can spread faster than ever. Studies of social media have found that false stories often travel farther and faster than true ones, partly because they tend to be surprising or emotional, which makes people more likely to share them. Some false information is spread by accident, when people repeat something without checking it. Some is created deliberately to mislead, to make money from advertising, or to influence opinions. Edited photos and videos have made the problem harder, because seeing is no longer always believing. Researchers who study how professional fact-checkers work have noticed something interesting. When experts evaluate an unfamiliar website, they do not spend much time reading the site itself. Instead, they quickly open new tabs to see what other reliable sources say about the site and its claims. This strategy, called lateral reading, is far more effective than judging a site by how professional it looks. Experts also suggest a simple habit: before sharing something that makes you feel a strong emotion, pause and ask three questions. Who is behind this information? What is the evidence? What do other trustworthy sources say? Our tradition places great weight on guarding one's speech and avoiding falsehood; in the digital age, that responsibility includes what we choose to share with a single click.",
   "show_text": false,
   "replays_allowed": 1,
   "status": "Draft"
  },
  {
   "passage_id": "PF.LR.G8.R.B",
   "grade": 8,
   "mode": "read",
   "form": "B",
   "title": "The Architect's Choice",
   "words": 248,
   "text": "When the city announced a competition to design a new public library, Daniel Weiss, a young architect who had just opened his own small firm, decided to enter. The prize was enormous, and winning would establish his career. Most entries, he knew, would feature dramatic glass towers and bold, unusual shapes, the kind of buildings that win magazine covers. Daniel began sketching along the same lines, but something troubled him. He spent a week visiting the old library at different hours. He watched elderly men reading newspapers by the windows in the morning, fathers bringing toddlers for story time, teenagers crowding the few tables after school, and immigrants waiting patiently for the computers to look for work. He noticed that the most popular spots were not the grand reading room but the small, quiet corners with natural light. He threw away his sketches. His new design was modest from the outside: low, warm brick buildings arranged around a courtyard garden. Inside, it offered dozens of small reading nooks by large windows, a separate wing for children so that noise would not disturb readers, and twice as many computer stations as the old library. His colleagues warned him that the judges would find it unexciting. They were partly right; several judges preferred a striking design of twisted glass. But after visiting the community meetings, the jury chose Daniel's plan. One judge wrote, \"Most entries asked what the library should look like. This one asked how people actually use it.\"",
   "show_text": true,
   "replays_allowed": null,
   "status": "Draft"
  }
 ],
 "items": [
  {
   "item_id": "PF.LR.G0.L.A.Q1",
   "passage": "PF.LR.G0.L.A",
   "grade": 0,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Moshe and his zeidy make a rainy day fun",
   "wrong": [
    {
     "answer": "Moshe plays outside in the sun all day long",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A brave little boat",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Moshe eats crackers",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.A.Q2",
   "passage": "PF.LR.G0.L.A",
   "grade": 0,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What did Zeidy use to make the tent?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A blanket and two chairs",
   "wrong": [
    {
     "answer": "Pillows and a flashlight",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "A big umbrella",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A box and some tape",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "a big blanket over two chairs",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.A.Q3",
   "passage": "PF.LR.G0.L.A",
   "grade": 0,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did Moshe say he was bored?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He could not play outside because of the rain",
   "wrong": [
    {
     "answer": "He did not like the tent",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Zeidy told him a story",
     "code": "CAUSE-EFFECT-REVERSED"
    },
    {
     "answer": "He was hungry and wanted crackers and juice",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "wanted to play outside, but it was raining",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.A.Q4",
   "passage": "PF.LR.G0.L.A",
   "grade": 0,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "How did Moshe feel at the end?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Happy",
   "wrong": [
    {
     "answer": "Bored and grumpy",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "Scared of the dark",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Angry at the rain",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.A.Q5",
   "passage": "PF.LR.G0.L.A",
   "grade": 0,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "The tent was \"cozy.\" What does cozy mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Warm and comfortable",
   "wrong": [
    {
     "answer": "Wet, cold, and dripping",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Very large",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Loud and busy",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "It was dark and cozy",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.A.Q1",
   "passage": "PF.LR.G0.R.A",
   "grade": 0,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Ben and his cat",
   "wrong": [
    {
     "answer": "A big dog",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A new mat",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Ben going to school",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.A.Q2",
   "passage": "PF.LR.G0.R.A",
   "grade": 0,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What color is the cat?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Tan",
   "wrong": [
    {
     "answer": "Black",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Very big",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Bright red",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "big and tan",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.A.Q3",
   "passage": "PF.LR.G0.R.A",
   "grade": 0,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did Ben get a new cup?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The cat had his milk",
   "wrong": [
    {
     "answer": "The cup was dirty",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The cat sat on the mat",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Ben was mad",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": "The cat had the milk",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.A.Q4",
   "passage": "PF.LR.G0.R.A",
   "grade": 0,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "What kind of boy is Ben?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Kind and patient",
   "wrong": [
    {
     "answer": "Angry",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "Scared of his cat",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Fast",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.A.Q5",
   "passage": "PF.LR.G0.R.A",
   "grade": 0,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "The cat sat on a \"mat.\" What is a mat?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A small rug on the floor",
   "wrong": [
    {
     "answer": "A big cup of cold milk",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "A tall chair",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A hat",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.B.Q1",
   "passage": "PF.LR.G0.L.B",
   "grade": 0,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Two brothers build a big snowman",
   "wrong": [
    {
     "answer": "Abba comes home from work and laughs",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Avi loses his scarf",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "A carrot nose",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.B.Q2",
   "passage": "PF.LR.G0.L.B",
   "grade": 0,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What did they use for the eyes?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Two black stones",
   "wrong": [
    {
     "answer": "A carrot",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Two buttons",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "His old blue scarf",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "two black stones for eyes",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.B.Q3",
   "passage": "PF.LR.G0.L.B",
   "grade": 0,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did Yehuda lift the second ball?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The first ball was too heavy to push any more",
   "wrong": [
    {
     "answer": "Avi asked for a scarf",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Abba told him to lift it before work",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The snow was melting",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "too heavy to push",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.B.Q4",
   "passage": "PF.LR.G0.L.B",
   "grade": 0,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "How did Abba feel about the snowman?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He liked it",
   "wrong": [
    {
     "answer": "He was angry at them",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He was cold outside",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "He was too tall",
     "code": "INFER-LITERAL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.L.B.Q5",
   "passage": "PF.LR.G0.L.B",
   "grade": 0,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "The snow was \"deep.\" What does deep mean here?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "There was a lot of it",
   "wrong": [
    {
     "answer": "It was very, very cold",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "It was wet",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "It was far away",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.B.Q1",
   "passage": "PF.LR.G0.R.B",
   "grade": 0,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Dan rides the bus to school",
   "wrong": [
    {
     "answer": "A red hat",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Dan goes to the park to play",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A big hill of sand",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.B.Q2",
   "passage": "PF.LR.G0.R.B",
   "grade": 0,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What was in the bag?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A hat and a pen",
   "wrong": [
    {
     "answer": "A pen and a cup",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A bus",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Dan",
     "code": "NAME-IN-TEXT"
    }
   ],
   "evidence": "a hat and a pen",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.B.Q3",
   "passage": "PF.LR.G0.R.B",
   "grade": 0,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Where did the bus go before Dan got off?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Up a big hill",
   "wrong": [
    {
     "answer": "Into a deep pond",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "To the gate of a big farm",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Down to the store",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "went up a big hill",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.B.Q4",
   "passage": "PF.LR.G0.R.B",
   "grade": 0,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "Who met Dan at the gate?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "His rebbe",
   "wrong": [
    {
     "answer": "His big dog",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The red bus",
     "code": "NAME-IN-TEXT"
    },
    {
     "answer": "Nobody at all",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": "His rebbe was at the gate",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G0.R.B.Q5",
   "passage": "PF.LR.G0.R.B",
   "grade": 0,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "\"Dan was glad.\" What does glad mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Happy",
   "wrong": [
    {
     "answer": "Very sad",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Tired out",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Too late",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.A.Q1",
   "passage": "PF.LR.G1.L.A",
   "grade": 1,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Shimon finds his lost mitten",
   "wrong": [
    {
     "answer": "Shimon walks to the bus stop",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Shimon gets a new pair of mittens",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A cold day at cheder",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.A.Q2",
   "passage": "PF.LR.G1.L.A",
   "grade": 1,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "Where did they find the mitten?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "On a branch by the bus stop",
   "wrong": [
    {
     "answer": "Under a bush",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "In the pocket of his coat",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "At cheder",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "Near the bus stop, they saw something red hanging on a branch",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.A.Q3",
   "passage": "PF.LR.G1.L.A",
   "grade": 1,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why was the mitten hanging up high?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "So its owner could see it",
   "wrong": [
    {
     "answer": "The wind blew it up there",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Shimon threw it",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A bird carried it",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "hung it up high so its owner could see it",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.A.Q4",
   "passage": "PF.LR.G1.L.A",
   "grade": 1,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "What will Shimon probably do if he finds a lost hat?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Hang it up where it can be seen",
   "wrong": [
    {
     "answer": "Keep it",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Throw it away",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Wear it to cheder the next day",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.A.Q5",
   "passage": "PF.LR.G1.L.A",
   "grade": 1,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "They looked \"carefully.\" What does carefully mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Slowly, paying close attention",
   "wrong": [
    {
     "answer": "Very fast",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Quickly, with their eyes closed",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "In a loud voice",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.A.Q1",
   "passage": "PF.LR.G1.R.A",
   "grade": 1,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A frog hides from a fish",
   "wrong": [
    {
     "answer": "A fish eats lunch",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The sun is hot",
     "code": "TOO-NARROW"
    },
    {
     "answer": "A log that floats in the woods",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.A.Q2",
   "passage": "PF.LR.G1.R.A",
   "grade": 1,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "Where did the frog hide?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "In the grass",
   "wrong": [
    {
     "answer": "Under the log",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Out in the sun",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Up in a tall tree",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "swam fast to the grass",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.A.Q3",
   "passage": "PF.LR.G1.R.A",
   "grade": 1,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did the frog jump off the log?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He was afraid of the fish",
   "wrong": [
    {
     "answer": "The log was too hot",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He wanted to swim with the fish",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He was hungry",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "did not want to be lunch",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.A.Q4",
   "passage": "PF.LR.G1.R.A",
   "grade": 1,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "What did the frog think about the fish?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "It was dangerous",
   "wrong": [
    {
     "answer": "It was a friend",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "It was green and small",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It had a wide mouth",
     "code": "INFER-LITERAL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.A.Q5",
   "passage": "PF.LR.G1.R.A",
   "grade": 1,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "The frog waited until it was \"safe.\" What does safe mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Not in danger",
   "wrong": [
    {
     "answer": "Too hot in the sun",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Wet",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Hungry",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.B.Q1",
   "passage": "PF.LR.G1.L.B",
   "grade": 1,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Akiva helps at the bakery",
   "wrong": [
    {
     "answer": "How ovens work",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Akiva buys a challah for Shabbos",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A long line",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.B.Q2",
   "passage": "PF.LR.G1.L.B",
   "grade": 1,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What is Akiva's job at the bakery?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Putting challahs in bags",
   "wrong": [
    {
     "answer": "Baking all of the bread",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Washing the ovens",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Selling cakes",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "put the challahs into paper bags",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.B.Q3",
   "passage": "PF.LR.G1.L.B",
   "grade": 1,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why does Akiva have to be gentle?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The challahs are soft and warm",
   "wrong": [
    {
     "answer": "The bags are heavy",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "His uncle is tired",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The ovens are much too hot",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "because the challahs are soft and warm",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.B.Q4",
   "passage": "PF.LR.G1.L.B",
   "grade": 1,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "Why did Akiva bring the old man a chair?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "It was hard for him to stand",
   "wrong": [
    {
     "answer": "The old man asked him for a roll",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Akiva wanted to sit down",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The chairs were for sale",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.L.B.Q5",
   "passage": "PF.LR.G1.L.B",
   "grade": 1,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Many \"customers\" waited. Who are customers?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "People who come to buy things",
   "wrong": [
    {
     "answer": "People who bake bread all night",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "People who drive buses",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Children at school",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.B.Q1",
   "passage": "PF.LR.G1.R.B",
   "grade": 1,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Yossi loses his kite and gets help",
   "wrong": [
    {
     "answer": "How to build a ladder",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A tall tree",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Eli makes a kite out of paper",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.B.Q2",
   "passage": "PF.LR.G1.R.B",
   "grade": 1,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What did Yossi make the kite from?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Paper and sticks",
   "wrong": [
    {
     "answer": "A long piece of string",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Cloth and thin wire",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Leaves from the tree",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "paper and sticks",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.B.Q3",
   "passage": "PF.LR.G1.R.B",
   "grade": 1,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did the kite fall into the tree?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The wind stopped",
   "wrong": [
    {
     "answer": "Yossi let go of the string",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Eli pulled it down",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It flew much too high",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "the wind stopped",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.B.Q4",
   "passage": "PF.LR.G1.R.B",
   "grade": 1,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "What kind of friend is Eli?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A helpful friend",
   "wrong": [
    {
     "answer": "A friend who laughs at him",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "A tall friend",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A friend who lost his kite",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G1.R.B.Q5",
   "passage": "PF.LR.G1.R.B",
   "grade": 1,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "The wind \"lifted\" the kite. What does lifted mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Raised it up",
   "wrong": [
    {
     "answer": "Broke it in half",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Painted it blue",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Tied it to a tree",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.A.Q1",
   "passage": "PF.LR.G2.L.A",
   "grade": 2,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How tortoises live",
   "wrong": [
    {
     "answer": "How sea turtles swim",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Tortoises sleeping in winter",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Animals that eat flowers",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.A.Q2",
   "passage": "PF.LR.G2.L.A",
   "grade": 2,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What do tortoises eat?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Plants, like grass",
   "wrong": [
    {
     "answer": "Small fish",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Bugs and worms",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Hardly any food at all",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "Tortoises eat plants, such as grass, leaves, and flowers",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.A.Q3",
   "passage": "PF.LR.G2.L.A",
   "grade": 2,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why does a tortoise pull its head into its shell?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "To stay safe from danger",
   "wrong": [
    {
     "answer": "To sleep through the winter",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "To get warm in the sun",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "To dig a hole",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "When it feels danger, it pulls its head and legs inside",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.A.Q4",
   "passage": "PF.LR.G2.L.A",
   "grade": 2,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "Why might a tortoise not need to run from enemies?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Its shell keeps it safe",
   "wrong": [
    {
     "answer": "It lives in water",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It is very fast",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "It lives for a hundred years",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.A.Q5",
   "passage": "PF.LR.G2.L.A",
   "grade": 2,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "The shell \"protects\" the tortoise. What does protects mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Keeps it from being hurt",
   "wrong": [
    {
     "answer": "Makes it move very slowly",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Feeds it",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Carries it",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.A.Q1",
   "passage": "PF.LR.G2.R.A",
   "grade": 2,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A boy does well in a spelling bee",
   "wrong": [
    {
     "answer": "How to spell \"kitchen\"",
     "code": "TOO-NARROW"
    },
    {
     "answer": "An older brother reads a list",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "Meir loses the spelling bee",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.A.Q2",
   "passage": "PF.LR.G2.R.A",
   "grade": 2,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "Who helped the boy practice?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "His older brother",
   "wrong": [
    {
     "answer": "Meir",
     "code": "NAME-IN-TEXT"
    },
    {
     "answer": "His rebbe at school",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "His neighbor",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "practiced every night with my older brother",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.A.Q3",
   "passage": "PF.LR.G2.R.A",
   "grade": 2,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why were his hands shaking?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He was nervous",
   "wrong": [
    {
     "answer": "He was very cold",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "He forgot every word",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He had already won the prize",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "On the day of the bee, my hands were shaking",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.A.Q4",
   "passage": "PF.LR.G2.R.A",
   "grade": 2,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "What helped the boy do well?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He practiced every night",
   "wrong": [
    {
     "answer": "Meir told him the words",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The words were all short",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He spelled fast",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.A.Q5",
   "passage": "PF.LR.G2.R.A",
   "grade": 2,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Meir spelled the word \"perfectly.\" What does perfectly mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "With no mistakes",
   "wrong": [
    {
     "answer": "Very slowly",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Very loudly and quickly",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "With help",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.B.Q1",
   "passage": "PF.LR.G2.L.B",
   "grade": 2,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The different ways seeds travel",
   "wrong": [
    {
     "answer": "How coconuts float",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Why birds eat berries",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "How plants walk to new places",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.B.Q2",
   "passage": "PF.LR.G2.L.B",
   "grade": 2,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "How does a coconut travel?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "It floats",
   "wrong": [
    {
     "answer": "It sticks to fur",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "It blows in the wind",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A bird carries it",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "A coconut can float across the ocean",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.B.Q3",
   "passage": "PF.LR.G2.L.B",
   "grade": 2,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why do seeds need to move away from the parent plant?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "To get space, sun, and water",
   "wrong": [
    {
     "answer": "Because animals eat the parent plant",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "To make the parent plant taller",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Because they are fluffy",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "so that they have enough space, sunlight, and water to grow",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.B.Q4",
   "passage": "PF.LR.G2.L.B",
   "grade": 2,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "A dog runs through a field and comes home with seeds in its fur. What kind of seeds are they most likely?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Seeds with little hooks",
   "wrong": [
    {
     "answer": "Coconuts",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Seeds with fluffy parachute tops",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Berries",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.L.B.Q5",
   "passage": "PF.LR.G2.L.B",
   "grade": 2,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Seeds \"hitch a ride\" on animals. What does that mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The animal carries them",
   "wrong": [
    {
     "answer": "They pull the animal",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "They give the animal food to eat",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "They scare the animal",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.B.Q1",
   "passage": "PF.LR.G2.R.B",
   "grade": 2,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Two boys mix up their lunch bags",
   "wrong": [
    {
     "answer": "Chaim likes peanut butter",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How to make a good tuna sandwich",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Zev loses his lunch",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.B.Q2",
   "passage": "PF.LR.G2.R.B",
   "grade": 2,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What did Zev tie to his bag?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A red ribbon",
   "wrong": [
    {
     "answer": "His name in big letters",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "A blue string",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "A tuna sandwich",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "Zev tied a red ribbon to his",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.B.Q3",
   "passage": "PF.LR.G2.R.B",
   "grade": 2,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did the boys pick up the wrong bags?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The bags looked the same",
   "wrong": [
    {
     "answer": "Zev wanted the peanut butter",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Chaim liked tuna",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "They traded bags",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "Both boys had the same blue lunch bags",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.B.Q4",
   "passage": "PF.LR.G2.R.B",
   "grade": 2,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "Why did Zev look puzzled?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He expected tuna",
   "wrong": [
    {
     "answer": "He did not like his friend",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He forgot his lunch at home",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He had a red ribbon",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G2.R.B.Q5",
   "passage": "PF.LR.G2.R.B",
   "grade": 2,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "The boys \"traded\" bags. What does traded mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Gave each other their bags",
   "wrong": [
    {
     "answer": "Threw their bags in the garbage",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Bought new bags",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Wrote on their bags",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.A.Q1",
   "passage": "PF.LR.G3.L.A",
   "grade": 3,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How engineers plan and choose bridges",
   "wrong": [
    {
     "answer": "How rivers flow",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Suspension bridges hang from steel cables",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Why earthquakes happen",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.A.Q2",
   "passage": "PF.LR.G3.L.A",
   "grade": 3,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What does a suspension bridge hang from?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Steel cables between tall towers",
   "wrong": [
    {
     "answer": "Posts standing in the middle of the river",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "A curved arch",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Strong winds",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "hangs from thick steel cables stretched between tall towers",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.A.Q3",
   "passage": "PF.LR.G3.L.A",
   "grade": 3,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why do engineers test models first?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "To be sure it can hold traffic, wind, and earthquakes",
   "wrong": [
    {
     "answer": "To decide what color to paint it",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "To measure the river",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Because a small model is cheaper for drivers to cross",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": "to make sure the bridge can hold heavy traffic, strong winds, and even earthquakes",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.A.Q4",
   "passage": "PF.LR.G3.L.A",
   "grade": 3,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "A town needs to cross a very narrow stream. Which bridge would probably be best?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A beam bridge",
   "wrong": [
    {
     "answer": "A suspension bridge",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "No bridge can cross a stream",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "A bridge made of cables only",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.A.Q5",
   "passage": "PF.LR.G3.L.A",
   "grade": 3,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Engineers \"design\" a bridge. What does design mean here?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Plan how it will be made",
   "wrong": [
    {
     "answer": "Drive across it when it opens",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Paint it",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Take it apart",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.A.Q1",
   "passage": "PF.LR.G3.R.A",
   "grade": 3,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A club launches a rocket and learns from a mistake",
   "wrong": [
    {
     "answer": "Pinny paints a rocket silver",
     "code": "TOO-NARROW"
    },
    {
     "answer": "The school watches a fire",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Mr. Levin builds a rocket by himself after school",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.A.Q2",
   "passage": "PF.LR.G3.R.A",
   "grade": 3,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "Who packed the parachute?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Mendel",
   "wrong": [
    {
     "answer": "Gavriel",
     "code": "NAME-IN-TEXT"
    },
    {
     "answer": "Pinny",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Mr. Levin",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "Mendel carefully packed the parachute",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.A.Q3",
   "passage": "PF.LR.G3.R.A",
   "grade": 3,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did the rocket tumble into a puddle?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The parachute was tangled",
   "wrong": [
    {
     "answer": "The fins fell off",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It was painted silver and too heavy",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "It went too high",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": "Out came the parachute, but it was tangled",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.A.Q4",
   "passage": "PF.LR.G3.R.A",
   "grade": 3,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "What does Mr. Levin think about the failed landing?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "It is a useful lesson",
   "wrong": [
    {
     "answer": "It is a disaster",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "It is all Mendel's fault",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "It is funny",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.A.Q5",
   "passage": "PF.LR.G3.R.A",
   "grade": 3,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "The boys \"groaned.\" What does groaned mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Made a sound of disappointment",
   "wrong": [
    {
     "answer": "Cheered loudly for the rocket",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Ran away",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Grew taller",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.B.Q1",
   "passage": "PF.LR.G3.L.B",
   "grade": 3,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Nosson's first camping trip",
   "wrong": [
    {
     "answer": "How to find the North Star",
     "code": "TOO-NARROW"
    },
    {
     "answer": "A drive to the city",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "An owl in the forest",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.B.Q2",
   "passage": "PF.LR.G3.L.B",
   "grade": 3,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "Who showed Nosson how to tighten the ropes?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "His uncle",
   "wrong": [
    {
     "answer": "His father",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "A park ranger",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Nobody helped him",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "until his uncle showed him how to tighten the ropes",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.B.Q3",
   "passage": "PF.LR.G3.L.B",
   "grade": 3,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why had Nosson never seen so many stars?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "City lights hid most of them",
   "wrong": [
    {
     "answer": "He always went to bed very early",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "It was always cloudy",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He was lying on his back",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "In the city, the bright lights hid most of them",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.B.Q4",
   "passage": "PF.LR.G3.L.B",
   "grade": 3,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "How did Nosson's feelings change during the night?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He went from nervous to calm",
   "wrong": [
    {
     "answer": "He went from happy to angry",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He was scared the whole time",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "He felt hungry",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.L.B.Q5",
   "passage": "PF.LR.G3.L.B",
   "grade": 3,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Something small was \"scurrying\" past. What does scurrying mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Moving quickly with short steps",
   "wrong": [
    {
     "answer": "Sleeping quietly in a hole",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Singing",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Flying high",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.B.Q1",
   "passage": "PF.LR.G3.R.B",
   "grade": 3,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The tilt of the earth causes the seasons",
   "wrong": [
    {
     "answer": "Australia has winter",
     "code": "TOO-NARROW"
    },
    {
     "answer": "The earth moves closer to the sun in summer",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Days are longer in summer",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.B.Q2",
   "passage": "PF.LR.G3.R.B",
   "grade": 3,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "In summer in the north, what is true?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The days are longer",
   "wrong": [
    {
     "answer": "The earth is closer to the sun",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The sun's rays hit at a slant",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "It is summer in Australia",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "the days are longer, and the weather is warmer",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.B.Q3",
   "passage": "PF.LR.G3.R.B",
   "grade": 3,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why is it cold in winter in the north?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The north leans away from the sun",
   "wrong": [
    {
     "answer": "The sun gets smaller in the winter",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The earth stops moving",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Australia leans away",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "Now the northern half leans away",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.B.Q4",
   "passage": "PF.LR.G3.R.B",
   "grade": 3,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "If it is winter in Australia, what season is it in New York?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Summer",
   "wrong": [
    {
     "answer": "Winter, too",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "There are no seasons in New York",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Spring always",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G3.R.B.Q5",
   "passage": "PF.LR.G3.R.B",
   "grade": 3,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "The earth has a \"tilt.\" What does tilt mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A lean to one side",
   "wrong": [
    {
     "answer": "A spin",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "A very hot place",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A long trip",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.A.Q1",
   "passage": "PF.LR.G4.L.A",
   "grade": 4,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Two boys use clues to find a siddur",
   "wrong": [
    {
     "answer": "Reuven goes on a school trip",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Doniel loses his siddur",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "How siddurim are printed and bound",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.A.Q2",
   "passage": "PF.LR.G4.L.A",
   "grade": 4,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "Where was the siddur found?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "On a shelf in the beis medrash",
   "wrong": [
    {
     "answer": "In the lost-and-found box in the office",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "On the bus",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "In the coat closet",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "The two boys hurried to the beis medrash and checked the shelves",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.A.Q3",
   "passage": "PF.LR.G4.L.A",
   "grade": 4,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did Reuven leave the siddur behind?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "They rushed out to catch the bus",
   "wrong": [
    {
     "answer": "He did not like the siddur",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Doniel hid it",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It was stamped in gold and slipped away",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "the boys had rushed out to catch the bus",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.A.Q4",
   "passage": "PF.LR.G4.L.A",
   "grade": 4,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "What lesson did Reuven learn?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Rushing can make you forget things",
   "wrong": [
    {
     "answer": "Siddurim should stay at home",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Detectives can always find anything",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Green covers are easy to see",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.A.Q5",
   "passage": "PF.LR.G4.L.A",
   "grade": 4,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "By lunchtime, Reuven was \"miserable.\" What does miserable mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Very unhappy",
   "wrong": [
    {
     "answer": "Very hungry for lunch",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Very excited",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Very sleepy",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.A.Q1",
   "passage": "PF.LR.G4.R.A",
   "grade": 4,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Bees dance to show where flowers are",
   "wrong": [
    {
     "answer": "Karl von Frisch won a prize",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How bees turn nectar into honey",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Bees dance for fun",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.A.Q2",
   "passage": "PF.LR.G4.R.A",
   "grade": 4,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What does the length of the waggle show?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How far away the flowers are",
   "wrong": [
    {
     "answer": "Which way to fly compared to the sun",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "How many flowers there are",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "What color the flowers are",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "The length of the waggle shows how far away the flowers are",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.A.Q3",
   "passage": "PF.LR.G4.R.A",
   "grade": 4,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why do the other bees feel the dancer's movements instead of watching?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The hive is dark inside",
   "wrong": [
    {
     "answer": "They cannot see any colors",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The dance is much too fast to watch",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The flowers are far away",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "to feel its movements in the darkness of the hive",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.A.Q4",
   "passage": "PF.LR.G4.R.A",
   "grade": 4,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "A bee does a round dance. What will the other bees probably do?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Look for flowers near the hive",
   "wrong": [
    {
     "answer": "Fly far away",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Stay inside the hive for the whole day",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Start dancing in a line",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.A.Q5",
   "passage": "PF.LR.G4.R.A",
   "grade": 4,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Von Frisch spent years \"decoding\" the dance. What does decoding mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Figuring out what it means",
   "wrong": [
    {
     "answer": "Teaching it to bees",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Writing music to go with it",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Stopping it",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.B.Q1",
   "passage": "PF.LR.G4.L.B",
   "grade": 4,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Edison kept testing until a bulb worked",
   "wrong": [
    {
     "answer": "Bamboo grows quickly",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A reporter asks a question",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Edison invented electricity by himself",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.B.Q2",
   "passage": "PF.LR.G4.L.B",
   "grade": 4,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "Which material finally worked?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A baked strip of bamboo",
   "wrong": [
    {
     "answer": "Fishing line and cotton thread",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Gold wire",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Glass",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "a carefully baked strip of bamboo",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.B.Q3",
   "passage": "PF.LR.G4.L.B",
   "grade": 4,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did Edison test thousands of materials?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Most burned out too quickly",
   "wrong": [
    {
     "answer": "He wanted the bulb to be pretty",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "A reporter told him to",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He built power stations",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "Most of them burned out in seconds or minutes",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.B.Q4",
   "passage": "PF.LR.G4.L.B",
   "grade": 4,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "What does Edison's answer to the reporter show about him?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He saw mistakes as steps forward",
   "wrong": [
    {
     "answer": "He was angry at the reporter",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He never made a single mistake",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "He liked bamboo",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.L.B.Q5",
   "passage": "PF.LR.G4.L.B",
   "grade": 4,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Edison made a \"practical\" light bulb. What does practical mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Useful in real life",
   "wrong": [
    {
     "answer": "Very expensive to buy",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Made from bamboo strips",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Make-believe, not real",
     "code": "CONTEXT-IGNORED"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.B.Q1",
   "passage": "PF.LR.G4.R.B",
   "grade": 4,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Two boys help each other and become friends",
   "wrong": [
    {
     "answer": "How to play punchball",
     "code": "TOO-NARROW"
    },
    {
     "answer": "A family moving from Baltimore to Israel",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Learning Chumash",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.B.Q2",
   "passage": "PF.LR.G4.R.B",
   "grade": 4,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "How did Hillel know some Hebrew?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "His grandfather was from Israel",
   "wrong": [
    {
     "answer": "He was born in Israel",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Elchanan had taught him Hebrew first",
     "code": "CAUSE-EFFECT-REVERSED"
    },
    {
     "answer": "He learned it at recess",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "Hillel had a grandfather from Israel",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.B.Q3",
   "passage": "PF.LR.G4.R.B",
   "grade": 4,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did Elchanan feel lost on his first day?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He knew very little English",
   "wrong": [
    {
     "answer": "He did not like ball games",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Hillel and the others ignored him",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He stood by the fence",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "he understood only a little English",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.B.Q4",
   "passage": "PF.LR.G4.R.B",
   "grade": 4,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "Why was \"friend\" the most important word for Elchanan?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A friend changed his whole year",
   "wrong": [
    {
     "answer": "It was the hardest word for him to spell",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "It is a Hebrew word",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It was the first word he heard",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G4.R.B.Q5",
   "passage": "PF.LR.G4.R.B",
   "grade": 4,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "The boys became \"inseparable.\" What does inseparable mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Always together",
   "wrong": [
    {
     "answer": "Not able to talk",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Angry at each other",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "In different classes",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.A.Q1",
   "passage": "PF.LR.G5.L.A",
   "grade": 5,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How reefs form, why they matter, and their danger",
   "wrong": [
    {
     "answer": "Coral can be seen from space",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How scientists grow coral in underwater nurseries",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "Why fish are colorful",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.A.Q2",
   "passage": "PF.LR.G5.L.A",
   "grade": 5,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What gives coral much of its color and food?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Tiny algae inside the polyps",
   "wrong": [
    {
     "answer": "Minerals the polyps take from seawater",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Sea grass",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Sunlight reflecting off rocks",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "the tiny algae that live inside them and give them their color",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.A.Q3",
   "passage": "PF.LR.G5.L.A",
   "grade": 5,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "What causes coral bleaching?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Ocean water that is too warm",
   "wrong": [
    {
     "answer": "Too many fish",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Powerful waves",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "New polyps growing on top of old ones",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "When ocean water becomes too warm",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.A.Q4",
   "passage": "PF.LR.G5.L.A",
   "grade": 5,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "Why might a town by the sea worry if its reef dies?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Stronger waves and fewer fish",
   "wrong": [
    {
     "answer": "The town would be seen from space",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "The water would turn white",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "The town would get colder",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.A.Q5",
   "passage": "PF.LR.G5.L.A",
   "grade": 5,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Sea turtles \"graze\" on sea grass. What does graze mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Eat slowly, a little at a time",
   "wrong": [
    {
     "answer": "Swim over it very quickly",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Sleep",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Hide inside",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.A.Q1",
   "passage": "PF.LR.G5.R.A",
   "grade": 5,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Yisroel wins a game by staying patient",
   "wrong": [
    {
     "answer": "Baruch is a tall eighth grader",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Yisroel wins the whole city tournament",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "How a knight moves",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.A.Q2",
   "passage": "PF.LR.G5.R.A",
   "grade": 5,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What place did Yisroel finish in the tournament?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Third place",
   "wrong": [
    {
     "answer": "First place",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The third round",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Last place of all",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "he finished in third place",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.A.Q3",
   "passage": "PF.LR.G5.R.A",
   "grade": 5,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "What mistake helped Yisroel win the game against Baruch?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Baruch left his king unprotected",
   "wrong": [
    {
     "answer": "Baruch lost a knight",
     "code": "CAUSE-EFFECT-REVERSED"
    },
    {
     "answer": "Baruch moved his pieces too slowly",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Baruch forgot the rules",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": "had left his king poorly protected",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.A.Q4",
   "passage": "PF.LR.G5.R.A",
   "grade": 5,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "Why did the grandfather say \"This is the game I will remember\"?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He was proud of Yisroel's patience",
   "wrong": [
    {
     "answer": "It was the game Yisroel lost",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He had a poor memory",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "He wanted to play against Baruch himself",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.A.Q5",
   "passage": "PF.LR.G5.R.A",
   "grade": 5,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Baruch had a \"reputation\" for winning quickly. What is a reputation?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "What people believe about someone",
   "wrong": [
    {
     "answer": "A prize",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A very fast and surprising chess move",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "A rule of chess",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.B.Q1",
   "passage": "PF.LR.G5.L.B",
   "grade": 5,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A fast mail service that did not last",
   "wrong": [
    {
     "answer": "Riders carried canteens",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How the telegraph sends messages in seconds",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "Horses in the desert",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.B.Q2",
   "passage": "PF.LR.G5.L.B",
   "grade": 5,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "About how long did the Pony Express trip take?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "About ten days",
   "wrong": [
    {
     "answer": "About a whole month",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Just a few seconds",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Eighteen months",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "took only about ten days",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.B.Q3",
   "passage": "PF.LR.G5.L.B",
   "grade": 5,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did the Pony Express shut down?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The telegraph was much faster",
   "wrong": [
    {
     "answer": "The riders got too old",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The horses ran away",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The letters became too heavy for horses",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "the first telegraph line connected the east and west coasts",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.B.Q4",
   "passage": "PF.LR.G5.L.B",
   "grade": 5,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "Why did riders switch to fresh horses so often?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "So tired horses would not slow the mail",
   "wrong": [
    {
     "answer": "Because the riders were lonely",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Because each horse could carry only one letter",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Because the stations were in deserts",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.L.B.Q5",
   "passage": "PF.LR.G5.L.B",
   "grade": 5,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "The riders were a symbol of \"determination.\" What does determination mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Refusing to give up",
   "wrong": [
    {
     "answer": "Being the fastest rider",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Being afraid",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Carrying mail",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.B.Q1",
   "passage": "PF.LR.G5.R.B",
   "grade": 5,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How the heart pumps blood",
   "wrong": [
    {
     "answer": "What a stethoscope is",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Why running and swimming are fun",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "How lungs breathe",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.B.Q2",
   "passage": "PF.LR.G5.R.B",
   "grade": 5,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "Where does the right side of the heart send blood?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "To the lungs",
   "wrong": [
    {
     "answer": "To the rest of the body",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "To the brain only",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "To the stomach",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "The right side of the heart sends blood to the lungs",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.B.Q3",
   "passage": "PF.LR.G5.R.B",
   "grade": 5,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why are the walls of the left side thicker?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "It pushes blood much farther",
   "wrong": [
    {
     "answer": "It receives more oxygen",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It beats less often",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "It has valves that act like doors",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "Because the left side has to push blood much farther",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.B.Q4",
   "passage": "PF.LR.G5.R.B",
   "grade": 5,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "What would happen if a valve did not close properly?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Some blood could flow backward",
   "wrong": [
    {
     "answer": "The heart would stop growing",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The lungs would fill with blood",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "The heart would beat louder for exercise",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G5.R.B.Q5",
   "passage": "PF.LR.G5.R.B",
   "grade": 5,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Exercise makes the heart more \"efficient.\" What does efficient mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Doing more work with less effort",
   "wrong": [
    {
     "answer": "Larger in size",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Slower, weaker, and more tired",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Louder",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.A.Q1",
   "passage": "PF.LR.G6.L.A",
   "grade": 6,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How a sea clock solved the longitude problem",
   "wrong": [
    {
     "answer": "Why maps had blank areas",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How pendulum clocks swing back and forth",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "Famous British sailors",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.A.Q2",
   "passage": "PF.LR.G6.L.A",
   "grade": 6,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What was John Harrison's training?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A self-taught carpenter and clockmaker",
   "wrong": [
    {
     "answer": "A famous scientist from a great university",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He was a ship captain",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "He was a mapmaker",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "a self-taught carpenter and clockmaker named John Harrison",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.A.Q3",
   "passage": "PF.LR.G6.L.A",
   "grade": 6,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why could ordinary clocks not solve the problem?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "They could not keep time on a rolling ship",
   "wrong": [
    {
     "answer": "They were too small",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Sailors could not read them",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "They showed only the local time on the ship",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "could not keep accurate time on a rolling ship",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.A.Q4",
   "passage": "PF.LR.G6.L.A",
   "grade": 6,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "Why did the government offer such a large prize?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Bad longitude was costing ships and lives",
   "wrong": [
    {
     "answer": "Harrison had asked the government for money",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Clocks were very cheap",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Maps were too colorful",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.A.Q5",
   "passage": "PF.LR.G6.L.A",
   "grade": 6,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "A \"navigator\" needed to know the time. What is a navigator?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The person who guides a ship's course",
   "wrong": [
    {
     "answer": "The person who builds the ship's clocks",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "A person who cooks on a ship",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "A person who draws pictures",
     "code": "CONTEXT-IGNORED"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.A.Q1",
   "passage": "PF.LR.G6.R.A",
   "grade": 6,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A class raises money to fix the roof",
   "wrong": [
    {
     "answer": "A car wash on Sunday",
     "code": "TOO-NARROW"
    },
    {
     "answer": "A retired roofer looks for a new job",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "Tzvi gives up",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.A.Q2",
   "passage": "PF.LR.G6.R.A",
   "grade": 6,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What did one team do with used seforim?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Repaired their covers and sold them",
   "wrong": [
    {
     "answer": "Gave them all to the library for free",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Hung posters about them",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Threw them away",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "collected used seforim, repaired their covers, and sold them",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.A.Q3",
   "passage": "PF.LR.G6.R.A",
   "grade": 6,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did the cost of the repair go down?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A store and a roofer gave help",
   "wrong": [
    {
     "answer": "The roof stopped leaking",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The boys fixed the roof by themselves",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "They raised ninety dollars",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "A hardware store donated roofing materials",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.A.Q4",
   "passage": "PF.LR.G6.R.A",
   "grade": 6,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "What does Tzvi's comment at the beginning show?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Boys first thought the goal was too hard",
   "wrong": [
    {
     "answer": "Tzvi did not care at all about the library",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Tzvi had a lot of money",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Tzvi was the leader",
     "code": "NAME-IN-TEXT"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.A.Q5",
   "passage": "PF.LR.G6.R.A",
   "grade": 6,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Gershon \"refused to be discouraged.\" What does discouraged mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Losing hope or confidence",
   "wrong": [
    {
     "answer": "Very busy",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Excited, eager, and ready",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Wet from the rain",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.B.Q1",
   "passage": "PF.LR.G6.L.B",
   "grade": 6,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How poor farming and drought caused the Dust Bowl",
   "wrong": [
    {
     "answer": "Families moving west",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How to grow wheat",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Black blizzards were huge storms made of snow",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.B.Q2",
   "passage": "PF.LR.G6.L.B",
   "grade": 6,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What held the soil in place before the farmers came?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Deep roots of prairie grasses",
   "wrong": [
    {
     "answer": "Rows of trees",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Heavy rain that fell every single year",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Farm equipment",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "The deep roots of the prairie grasses had held the soil in place",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.B.Q3",
   "passage": "PF.LR.G6.L.B",
   "grade": 6,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "What made the topsoil blow away?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Strong winds on bare, dry soil",
   "wrong": [
    {
     "answer": "Too many trees",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Families moving west to find work",
     "code": "CAUSE-EFFECT-REVERSED"
    },
    {
     "answer": "Crop rotation",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "Strong winds swept across the dry fields and lifted the loose topsoil",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.B.Q4",
   "passage": "PF.LR.G6.L.B",
   "grade": 6,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "Why would planting rows of trees help?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Trees slow the wind",
   "wrong": [
    {
     "answer": "The trees make it rain more often",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The trees replace the wheat",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The trees are good to eat",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.L.B.Q5",
   "passage": "PF.LR.G6.L.B",
   "grade": 6,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Families \"abandoned\" their farms. What does abandoned mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Left behind for good",
   "wrong": [
    {
     "answer": "Repaired",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Sold for a lot of money",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Planted",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.B.Q1",
   "passage": "PF.LR.G6.R.B",
   "grade": 6,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A team fixes a problem with a creative design",
   "wrong": [
    {
     "answer": "How to write computer code",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "The team wins first place at the competition",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The store was closed",
     "code": "TOO-NARROW"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.B.Q2",
   "passage": "PF.LR.G6.R.B",
   "grade": 6,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What did the boys use to rebuild the claw?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Rubber bands, a clip, and toy parts",
   "wrong": [
    {
     "answer": "A new gear from the store in the morning",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Polished metal parts",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "The base and wheels",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "rebuilt the claw using rubber bands, a paper clip, and parts from an old toy truck",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.B.Q3",
   "passage": "PF.LR.G6.R.B",
   "grade": 6,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did Shloime have to rewrite the code?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The claw had a new design",
   "wrong": [
    {
     "answer": "The robot was moving too slowly",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "The judges asked him to change it",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The blocks were colored",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "rewrote the code to match the new design",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.B.Q4",
   "passage": "PF.LR.G6.R.B",
   "grade": 6,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "Why did the judges give the team a special award?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "They solved a problem in a clever way",
   "wrong": [
    {
     "answer": "Their robot was the most polished",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "They felt sorry for the team with the broken robot",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Their robot was the biggest",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G6.R.B.Q5",
   "passage": "PF.LR.G6.R.B",
   "grade": 6,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "A \"crucial\" gear cracked. What does crucial mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Very important",
   "wrong": [
    {
     "answer": "Very small and light",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Brand new and shiny",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Not needed at all",
     "code": "CONTEXT-IGNORED"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.A.Q1",
   "passage": "PF.LR.G7.L.A",
   "grade": 7,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "How habits form and how to change them",
   "wrong": [
    {
     "answer": "Why phones are boring",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Brushing your teeth",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Bad habits can never be broken, no matter what",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.A.Q2",
   "passage": "PF.LR.G7.L.A",
   "grade": 7,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What are the three parts of the habit loop?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Cue, routine, and reward",
   "wrong": [
    {
     "answer": "Alarm, phone, and a short break",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Decision, effort, and result",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Morning, afternoon, and night",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "First comes a cue",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.A.Q3",
   "passage": "PF.LR.G7.L.A",
   "grade": 7,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "According to the passage, why are bad habits hard to break?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The brain links the cue to the reward",
   "wrong": [
    {
     "answer": "People do not know about them",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Rewards are always unhealthy and harmful",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Habits have only one part",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "the brain links the cue directly to the reward",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.A.Q4",
   "passage": "PF.LR.G7.L.A",
   "grade": 7,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "A boy snacks every time he sits down to do homework. Using the passage, what would experts suggest?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Keep the cue and reward; change the routine",
   "wrong": [
    {
     "answer": "Never do homework again",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Simply decide, once and for all, to stop snacking",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Eat a bigger snack",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.A.Q5",
   "passage": "PF.LR.G7.L.A",
   "grade": 7,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Habits become \"automatic.\" What does automatic mean here?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Done without thinking about it",
   "wrong": [
    {
     "answer": "Done by a machine or robot",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Done only once",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Done with great effort",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.A.Q1",
   "passage": "PF.LR.G7.R.A",
   "grade": 7,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A hurt boy learns patience and makes a friend",
   "wrong": [
    {
     "answer": "How knee surgery is done",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Eliezer trains hard and wins a race in June",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Mr. Adler keeps a chart",
     "code": "TOO-NARROW"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.A.Q2",
   "passage": "PF.LR.G7.R.A",
   "grade": 7,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What did Mr. Adler show Eliezer?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A chart of every measurement",
   "wrong": [
    {
     "answer": "A video of a baseball game",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Exercises that seemed far too small",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "A new knee brace",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "he had recorded every measurement since the first session",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.A.Q3",
   "passage": "PF.LR.G7.R.A",
   "grade": 7,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did Eliezer grow irritable at first?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He had to sit on the bench",
   "wrong": [
    {
     "answer": "Yitzchak teased him",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "He disliked Mr. Adler and his exercises",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He started keeping a chart",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "Eliezer watched from the bench as his friends played",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.A.Q4",
   "passage": "PF.LR.G7.R.A",
   "grade": 7,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "What did Eliezer most likely write about for his rebbe?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Patience, or his friend Yitzchak",
   "wrong": [
    {
     "answer": "How to run faster than anyone in his class",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "How to play baseball",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Why surgery is pointless",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.A.Q5",
   "passage": "PF.LR.G7.R.A",
   "grade": 7,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "The exercises seemed \"absurdly\" small. What does absurdly mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Ridiculously",
   "wrong": [
    {
     "answer": "Carefully",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Painfully",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Secretly",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.B.Q1",
   "passage": "PF.LR.G7.L.B",
   "grade": 7,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "It linked distant lands through goods and ideas",
   "wrong": [
    {
     "answer": "How silkworms make cocoons",
     "code": "TOO-NARROW"
    },
    {
     "answer": "It was a single paved road from China to Rome",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Sea routes in the 1400s",
     "code": "SUMMARY-DETAIL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.B.Q2",
   "passage": "PF.LR.G7.L.B",
   "grade": 7,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "Who were the Radhanites?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Jewish merchants on these routes",
   "wrong": [
    {
     "answer": "Chinese workers who made silk",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Roman soldiers",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Inventors of the compass",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "Jewish merchants, known as the Radhanites",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.B.Q3",
   "passage": "PF.LR.G7.L.B",
   "grade": 7,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did goods become more expensive as they traveled?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Each trader along the way raised the price",
   "wrong": [
    {
     "answer": "Silk was guarded as a secret by the Chinese",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "The roads charged tolls in gold only",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Diseases spread along the route",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": "increasing in price at each stop",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.B.Q4",
   "passage": "PF.LR.G7.L.B",
   "grade": 7,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "Why does the author say ideas were \"even more important than goods\"?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Ideas changed civilizations for centuries",
   "wrong": [
    {
     "answer": "Ideas were much cheaper and lighter to carry",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Goods were often stolen",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Silk was not valuable",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.L.B.Q5",
   "passage": "PF.LR.G7.L.B",
   "grade": 7,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Silk was a \"luxurious\" fabric. What does luxurious mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Fine, expensive, and comfortable",
   "wrong": [
    {
     "answer": "Rough, cheap, and scratchy",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Made from cotton",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Secret",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.B.Q1",
   "passage": "PF.LR.G7.R.B",
   "grade": 7,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Games have benefits and costs; balance matters",
   "wrong": [
    {
     "answer": "Video games are always harmful to every child",
     "code": "SUMMARY-OPINION"
    },
    {
     "answer": "Strategy games teach planning",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How to design video games",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.B.Q2",
   "passage": "PF.LR.G7.R.B",
   "grade": 7,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What benefit have some studies found for fast-paced games?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Better visual attention",
   "wrong": [
    {
     "answer": "Better reading",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Better teamwork and cooperation",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Better sleep",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "can improve players' visual attention",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.B.Q3",
   "passage": "PF.LR.G7.R.B",
   "grade": 7,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "According to the passage, how can late-night screen use harm memory?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "It harms sleep, which harms memory",
   "wrong": [
    {
     "answer": "It strengthens planning",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "It improves attention, which harms memory",
     "code": "CAUSE-EFFECT-REVERSED"
    },
    {
     "answer": "It makes games shorter",
     "code": "INFER-TOO-FAR"
    }
   ],
   "evidence": "heavy screen use late at night disrupts sleep, which in turn harms memory",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.B.Q4",
   "passage": "PF.LR.G7.R.B",
   "grade": 7,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "Which boy best follows the advice at the end of the passage?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A boy who plays a strategy game briefly after homework",
   "wrong": [
    {
     "answer": "A boy who never looks at any screen",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "A boy who plays five hours a night to improve his attention",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "A boy who plays only fast-paced games",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G7.R.B.Q5",
   "passage": "PF.LR.G7.R.B",
   "grade": 7,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Skills do not always \"transfer\" to real life. What does transfer mean here?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Carry over to a new situation",
   "wrong": [
    {
     "answer": "Get deleted from the computer",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Become a game",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Get faster",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.A.Q1",
   "passage": "PF.LR.G8.L.A",
   "grade": 8,
   "mode": "listen",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Two teams raced to the Pole; preparation decided it",
   "wrong": [
    {
     "answer": "Inuit people of the Arctic",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Why motor sledges break",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "Scott reached the Pole first but could not prove it",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.A.Q2",
   "passage": "PF.LR.G8.L.A",
   "grade": 8,
   "mode": "listen",
   "form": "A",
   "skill": "DETAIL",
   "stem": "What did Scott's team find when they reached the Pole?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "The Norwegian flag already flying",
   "wrong": [
    {
     "answer": "A supply depot",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Amundsen and his men waiting for them",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Inuit hunters",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "they found the Norwegian flag already flying",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.A.Q3",
   "passage": "PF.LR.G8.L.A",
   "grade": 8,
   "mode": "listen",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did Scott's men end up pulling the sledges themselves?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Their sledges broke and the ponies failed",
   "wrong": [
    {
     "answer": "They wanted to move faster than the ponies could",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Amundsen took their dogs",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "They burned enormous energy",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "The motor sledges broke down in the extreme cold",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.A.Q4",
   "passage": "PF.LR.G8.L.A",
   "grade": 8,
   "mode": "listen",
   "form": "A",
   "skill": "INFER",
   "stem": "What does the detail \"only about eleven miles from a supply depot\" suggest?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "They nearly reached the supplies that could have saved them",
   "wrong": [
    {
     "answer": "Amundsen had marked the depot so poorly that no one could find it",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Eleven miles is an easy walk in Antarctica",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "They did not need supplies",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.A.Q5",
   "passage": "PF.LR.G8.L.A",
   "grade": 8,
   "mode": "listen",
   "form": "A",
   "skill": "VOCAB",
   "stem": "Preparation played a \"decisive\" role. What does decisive mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Deciding the outcome",
   "wrong": [
    {
     "answer": "Small and unimportant",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Cold and harsh",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Quick to make choices",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.A.Q1",
   "passage": "PF.LR.G8.R.A",
   "grade": 8,
   "mode": "read",
   "form": "A",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "A boy helps a survivor preserve his father's letters",
   "wrong": [
    {
     "answer": "Mr. Stern's town in Hungary",
     "code": "TOO-NARROW"
    },
    {
     "answer": "How to fix a television remote",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Pesach learns to speak and read Hungarian",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.A.Q2",
   "passage": "PF.LR.G8.R.A",
   "grade": 8,
   "mode": "read",
   "form": "A",
   "skill": "DETAIL",
   "stem": "Why could Mr. Stern's grandchildren not read the letters?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "They could not read Yiddish",
   "wrong": [
    {
     "answer": "The letters were lost",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Mr. Stern's eyes were too weak",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "The letters were in English",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "my grandchildren cannot read Yiddish",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.A.Q3",
   "passage": "PF.LR.G8.R.A",
   "grade": 8,
   "mode": "read",
   "form": "A",
   "skill": "CAUSE",
   "stem": "Why did Pesach hesitate before agreeing?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "His Yiddish was not perfect",
   "wrong": [
    {
     "answer": "He was too busy with all the errands",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He did not like Mr. Stern",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The letters were yellowed",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    }
   ],
   "evidence": "His Yiddish was decent but far from perfect",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.A.Q4",
   "passage": "PF.LR.G8.R.A",
   "grade": 8,
   "mode": "read",
   "form": "A",
   "skill": "INFER",
   "stem": "What does Mr. Stern's silence at the end show?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "His gratitude was beyond words",
   "wrong": [
    {
     "answer": "He was angry at Pesach",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He did not notice Pesach in the crowd",
     "code": "INFER-LITERAL"
    },
    {
     "answer": "He could not hear well",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.A.Q5",
   "passage": "PF.LR.G8.R.A",
   "grade": 8,
   "mode": "read",
   "form": "A",
   "skill": "VOCAB",
   "stem": "\"Officially,\" Pesach came to help with errands. What does officially mean here?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "As the stated reason",
   "wrong": [
    {
     "answer": "Secretly",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "As a paid worker with a contract",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Every day",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.B.Q1",
   "passage": "PF.LR.G8.L.B",
   "grade": 8,
   "mode": "listen",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this passage mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "False information spreads online, but it can be checked",
   "wrong": [
    {
     "answer": "Edited photos are popular",
     "code": "TOO-NARROW"
    },
    {
     "answer": "The internet should be banned because it is dangerous",
     "code": "SUMMARY-OPINION"
    },
    {
     "answer": "How to build a website",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.B.Q2",
   "passage": "PF.LR.G8.L.B",
   "grade": 8,
   "mode": "listen",
   "form": "B",
   "skill": "DETAIL",
   "stem": "What is \"lateral reading\"?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Checking what other sources say about it",
   "wrong": [
    {
     "answer": "Reading a site very slowly from top to bottom",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Judging a site by how professional it looks",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Reading the words sideways across the screen",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "quickly open new tabs to see what other reliable sources say",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.B.Q3",
   "passage": "PF.LR.G8.L.B",
   "grade": 8,
   "mode": "listen",
   "form": "B",
   "skill": "CAUSE",
   "stem": "According to the passage, why do false stories often spread faster?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "They are surprising or emotional",
   "wrong": [
    {
     "answer": "They are always written by experts",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Fact-checkers share them",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "They are shorter",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "because they tend to be surprising or emotional",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.B.Q4",
   "passage": "PF.LR.G8.L.B",
   "grade": 8,
   "mode": "listen",
   "form": "B",
   "skill": "INFER",
   "stem": "A boy sees a shocking video that makes him angry. What would the author want him to do first?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Pause and check its source and other sources",
   "wrong": [
    {
     "answer": "Share it right away so others are warned",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "Look at how professional the video looks",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "Watch it again several times to be sure",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.L.B.Q5",
   "passage": "PF.LR.G8.L.B",
   "grade": 8,
   "mode": "listen",
   "form": "B",
   "skill": "VOCAB",
   "stem": "Some false information is created \"deliberately.\" What does deliberately mean?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "On purpose",
   "wrong": [
    {
     "answer": "By accident",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Very quickly",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "By trained experts",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.B.Q1",
   "passage": "PF.LR.G8.R.B",
   "grade": 8,
   "mode": "read",
   "form": "B",
   "skill": "MAIN",
   "stem": "What is this story mostly about?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "An architect designs for how people use a library",
   "wrong": [
    {
     "answer": "Glass towers always win magazine covers and prizes",
     "code": "TOO-NARROW"
    },
    {
     "answer": "Daniel opens a small firm",
     "code": "SUMMARY-DETAIL"
    },
    {
     "answer": "How brick is made",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.B.Q2",
   "passage": "PF.LR.G8.R.B",
   "grade": 8,
   "mode": "read",
   "form": "B",
   "skill": "DETAIL",
   "stem": "Which spots did Daniel notice were most popular?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Small, quiet corners with natural light",
   "wrong": [
    {
     "answer": "The grand reading room",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "The computer stations",
     "code": "DETAIL-TRUE-NOT-ANSWER"
    },
    {
     "answer": "The courtyard garden in the middle of the library",
     "code": "WORD-ASSOC"
    }
   ],
   "evidence": "the small, quiet corners with natural light",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.B.Q3",
   "passage": "PF.LR.G8.R.B",
   "grade": 8,
   "mode": "read",
   "form": "B",
   "skill": "CAUSE",
   "stem": "Why did Daniel throw away his first sketches?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "He saw what people actually needed",
   "wrong": [
    {
     "answer": "The judges told him to start over",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "Glass was too expensive",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "He won the competition",
     "code": "CAUSE-EFFECT-REVERSED"
    }
   ],
   "evidence": "He threw away his sketches",
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.B.Q4",
   "passage": "PF.LR.G8.R.B",
   "grade": 8,
   "mode": "read",
   "form": "B",
   "skill": "INFER",
   "stem": "What does the judge's comment suggest about the other entries?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "They focused on looks more than on users",
   "wrong": [
    {
     "answer": "They were all made of brick",
     "code": "DETAIL-WRONG"
    },
    {
     "answer": "They were too small",
     "code": "INFER-TOO-FAR"
    },
    {
     "answer": "They were better looking than Daniel's plan",
     "code": "INFER-LITERAL"
    }
   ],
   "evidence": null,
   "status": "Draft"
  },
  {
   "item_id": "PF.LR.G8.R.B.Q5",
   "passage": "PF.LR.G8.R.B",
   "grade": 8,
   "mode": "read",
   "form": "B",
   "skill": "VOCAB",
   "stem": "His design was \"modest\" from the outside. What does modest mean here?",
   "audio": "Read the question and options aloud (both conditions).",
   "answer": "Simple and not showy",
   "wrong": [
    {
     "answer": "Very tall",
     "code": "CONTEXT-IGNORED"
    },
    {
     "answer": "Made of glass",
     "code": "WORD-ASSOC"
    },
    {
     "answer": "Very expensive and showy",
     "code": "DETAIL-WRONG"
    }
   ],
   "evidence": null,
   "status": "Draft"
  }
 ]
};/*</P4Cv2>*/
/*<P4>*/var PF_ORF = {
 "bank": "PF-P4_Pathfinder_Recordings_Content_DRAFT",
 "made": "2026-11-11",
 "by": "CLAUDE (developer@)",
 "status": "Draft",
 "norms": {
  "1": {
   "p50": [
    null,
    29,
    60
   ],
   "p25": [
    null,
    16,
    34
   ]
  },
  "2": {
   "p50": [
    50,
    84,
    100
   ],
   "p25": [
    36,
    59,
    72
   ]
  },
  "3": {
   "p50": [
    83,
    97,
    112
   ],
   "p25": [
    59,
    79,
    91
   ]
  },
  "4": {
   "p50": [
    94,
    120,
    133
   ],
   "p25": [
    75,
    95,
    105
   ]
  },
  "5": {
   "p50": [
    121,
    133,
    146
   ],
   "p25": [
    87,
    109,
    119
   ]
  },
  "6": {
   "p50": [
    132,
    145,
    146
   ],
   "p25": [
    112,
    116,
    122
   ]
  },
  "7": {
   "p50": [
    128,
    136,
    150
   ],
   "p25": [
    102,
    109,
    123
   ],
   "src": "2006"
  },
  "8": {
   "p50": [
    133,
    146,
    151
   ],
   "p25": [
    106,
    115,
    124
   ],
   "src": "2006"
  }
 },
 "norms_source": "Hasbrouck & Tindal 2017 (grades 1-6); Hasbrouck & Tindal 2006 (grades 7-8)",
 "season_cutoffs": {
  "winter_from": "12-01",
  "spring_from": "03-16"
 },
 "rules": {
  "flag_below_p50_by": 10,
  "strong_flag_below": "p25",
  "strong_flag_accuracy_below": 0.9,
  "fluent_but_low_comprehension": "WCPM>=p50 and reading level <= grade-2",
  "ran_alone_never_flags": true,
  "ran_cutoffs": "set from pilot"
 },
 "error_codes": {
  "ORF-SUB": "wrong word",
  "ORF-OMIT": "skipped word",
  "ORF-HES": "pause of 3 s or more; app says the word",
  "ORF-SC": "self-corrected within 3 s (not an error)",
  "ORF-INS": "added word (logged, not an error)"
 },
 "passages": [
  {
   "passage_id": "PF.ORF.G1.A",
   "grade": 1,
   "form": "A",
   "title": "The Lost Hat",
   "words": 121,
   "fk": -1,
   "text": "Dov has a red hat. He likes his hat a lot. One day, Dov went to the park with his dad. The sun was hot, so Dov sat on a bench in the shade. He put his hat on the bench next to him. Then Dov ran to play on the slide. He went up and down, up and down. When it was time to go home, Dov ran back to the bench. His hat was not there! Dov looked under the bench. He looked by the tree. \"Is this your hat?\" asked a big boy. He held up a red hat. \"Yes! Thank you!\" said Dov. He put the hat on his head and gave the boy a big smile.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G1.B",
   "grade": 1,
   "form": "B",
   "title": "The Fish Tank",
   "words": 130,
   "fk": -0.2,
   "text": "Eli has a fish tank in his room. In the tank are three fish. One fish is red, one is gold, and one is black. Eli feeds the fish each day when he gets up. He drops in a pinch of food, and the fish swim up to get it. One day, the black fish did not swim up. It sat at the back of the tank. Eli was sad. He ran to get his abba. \"Abba, the black fish is sick!\" Abba came to look. \"The tank is too cold,\" said Abba. He fixed the heater in the tank. The next day, the black fish swam up with the red fish and the gold fish. Eli clapped his hands. \"Now all three of my fish are well,\" he said.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G2.A",
   "grade": 2,
   "form": "A",
   "title": "The Sukkah Lights",
   "words": 159,
   "fk": 2.5,
   "text": "Every year, Yosef helps his father build the sukkah in the back yard. This year, Yosef had a new job. He was in charge of the lights. He took a long string of lights out of the box and plugged it in, but only half of the bulbs lit up. \"Oh no,\" said Yosef. \"Half of them are broken.\" His father showed him how to check each bulb, one at a time. When Yosef found a bulb that was loose, he turned it until it clicked. Slowly, more and more lights began to glow. At last, every bulb on the string was shining. Yosef hung the lights across the top of the sukkah, just below the green branches. That night, when the family sat down to eat, the sukkah sparkled like a sky full of stars. \"You did a great job,\" said his father. Yosef smiled. Fixing one small bulb at a time had made the whole sukkah bright.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G2.B",
   "grade": 2,
   "form": "B",
   "title": "The Snow Fort",
   "words": 153,
   "fk": 3.2,
   "text": "After the first big snow, Chaim and his brother Shlomo decided to build a snow fort. They rolled three huge snowballs across the yard and pushed them together to make a wall. Then they packed snow into the cracks so the wall would be strong. \"We need a roof,\" said Shlomo. Chaim found an old board in the garage, and they laid it across the top of the wall. The board was heavy, and it sagged in the middle, but it held. Inside the fort, it was quiet and dim. The boys sat on a sled and listened to the wind blow outside. Soon their noses were red, and their toes began to feel numb. \"Let's go in for hot cocoa,\" said Chaim. \"We can come back after lunch.\" When they looked out the window later, the fort was still standing, with a little pile of snow on top like a white hat.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G3.A",
   "grade": 3,
   "form": "A",
   "title": "Why Owls Hunt at Night",
   "words": 169,
   "fk": 3.4,
   "text": "Most birds sleep at night, but owls do their hunting in the dark. How can they find food when it is so hard to see? Owls have very large eyes that let in a lot of light. Their eyes are so big that they cannot move them in their heads. Instead, an owl turns its whole head to look around. It can turn its head much farther than a person can, almost all the way to the back. Owls also have amazing hearing. The feathers on an owl's face form a round dish that catches sound and sends it to the ears. Some owls can hear a mouse moving under the snow and catch it without ever seeing it. Owls are quiet, too. The edges of their wing feathers are soft and fringed, so the air flows over them without a sound. A mouse never hears the owl coming. With sharp eyes, sharp ears and silent wings, the owl is one of the best night hunters in the world.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G3.B",
   "grade": 3,
   "form": "B",
   "title": "How Camels Live in the Desert",
   "words": 162,
   "fk": 4.3,
   "text": "A desert is a hard place to live. There is very little water, and the sun can be burning hot during the day. Yet camels live in the desert and do well. How do they do it? Many people think a camel's hump is full of water, but it is really full of fat. When food is hard to find, the camel's body uses the fat for energy. A camel can also go a long time without drinking. When it finally finds water, it can drink more than twenty gallons in just a few minutes. Camels are built for the sand, too. Their wide, flat feet spread out so they do not sink. Long eyelashes and nostrils that can close keep the blowing sand out of their eyes and noses. Even the camel's thick fur helps, by keeping out the heat of the sun. Because of all these gifts, camels can carry people and heavy loads across the desert for many days.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G4.A",
   "grade": 4,
   "form": "A",
   "title": "The Shortcut",
   "words": 204,
   "fk": 5.9,
   "text": "Every afternoon, Mordechai walked home from yeshiva the long way, around the edge of the park. One rainy Tuesday, his friend Pinchas suggested a shortcut through the woods behind the ballfield. \"It will save us ten minutes,\" Pinchas promised. \"I've done it a hundred times.\"\nThe path started out wide and easy, but soon it narrowed and split into three smaller trails. Pinchas paused, scratched his head, and chose the one on the left. Twenty minutes later, the boys were standing at the edge of a muddy creek that neither of them had ever seen before. The rain was falling harder, and the sky was turning gray.\n\"I think we're lost,\" Mordechai said quietly.\nInstead of panicking, he remembered something his father had taught him: when you are lost, stop and think before you walk any farther. He listened carefully. Far away, he could hear the hum of traffic. The boys followed the sound, picking their way along the creek, until they came out on a road just two blocks from home.\nThat evening, soaked and muddy, the boys laughed about their adventure. But the next afternoon, when Pinchas mentioned another shortcut, Mordechai just smiled and pointed toward the long way around the park.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G4.B",
   "grade": 4,
   "form": "B",
   "title": "The Broken Window",
   "words": 211,
   "fk": 4.4,
   "text": "Yehoshua had been told a hundred times not to play ball near the house, but the yard was so much bigger than the narrow strip by the fence. On Sunday afternoon, he tossed a tennis ball high into the air, swung his bat, and watched the ball sail straight through the kitchen window with a sharp crash.\nFor a moment, everything was silent. Yehoshua's first thought was to run. Nobody had seen him, and the ball could have come from anywhere. But his feet would not move. He thought about his father coming home, finding the glass on the floor, and wondering who had broken it.\nSlowly, Yehoshua walked inside and got the broom. He swept up every piece of glass he could find and put the pieces in a paper bag. When his father's car pulled into the driveway, Yehoshua was waiting at the door.\n\"Abba, I broke the window,\" he said. \"I was playing ball where I wasn't supposed to.\"\nHis father looked at the window, then at the swept floor, then at his son. \"That will cost money to fix,\" he said seriously. \"You'll help pay for it from your allowance.\" Then he put his hand on Yehoshua's shoulder. \"But I'm proud of you for telling me yourself.\"",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G5.A",
   "grade": 5,
   "form": "A",
   "title": "How a Hot Air Balloon Flies",
   "words": 206,
   "fk": 5.9,
   "text": "A hot air balloon has no engine and no wings, yet it can carry people thousands of feet into the sky. The secret is simple: hot air is lighter than cool air.\nA balloon has three main parts. The envelope is the giant, colorful bag that holds the air. Below it hangs a burner, which shoots a powerful flame upward. At the bottom is the basket, usually made of woven wicker, where the pilot and passengers stand.\nBefore takeoff, a fan blows cool air into the envelope until it fills out on the ground. Then the pilot lights the burner. As the air inside the envelope heats up, its tiny particles spread farther apart, so the hot air weighs less than the same amount of cool air outside. When the air inside is warm enough, the whole balloon begins to rise.\nSteering a balloon is tricky because it simply floats along with the wind. To move up, the pilot heats the air with the burner. To come down, he lets the air cool or opens a vent at the top. Since winds at different heights often blow in different directions, a skilled pilot changes height to find a wind going the way he wants to travel.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G5.B",
   "grade": 5,
   "form": "B",
   "title": "How Submarines Dive and Rise",
   "words": 199,
   "fk": 7.4,
   "text": "A submarine can float on the surface like a ship, then sink deep underwater and rise again whenever its crew decides. How can the same vessel do both?\nThe answer lies in special tanks called ballast tanks, built between the submarine's inner and outer hulls. When the submarine is floating on the surface, these tanks are full of air, which makes the vessel light enough to stay up.\nTo dive, the crew opens valves that let seawater rush into the ballast tanks. The water pushes out the air, and the submarine becomes heavier than the water around it, so it begins to sink. Small fins on the sides and back, called planes, tilt the front of the submarine downward and help guide it smoothly into the deep.\nTo rise again, the crew blows compressed air, stored in strong tanks on board, into the ballast tanks. The air forces the water back out into the sea. The submarine grows lighter, and slowly it floats back toward the surface.\nBy carefully adjusting how much water is in the tanks, the crew can even make the submarine hover at one depth, neither sinking nor rising, like a fish resting in a stream.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G6.A",
   "grade": 6,
   "form": "A",
   "title": "The Wrong Cards",
   "words": 227,
   "fk": 7.1,
   "text": "When Rabbi Fine announced the topics for the sixth-grade debate, Akiva groaned. He had been assigned to argue that homework should be banned, which sounded easy, except that his opponent would be Shimon, the best speaker in the class.\nFor a week, Akiva prepared. He searched the library for articles, filled index cards with facts, and practiced in front of the mirror until his little brother begged him to stop. Still, every time he imagined Shimon's confident voice, his stomach tightened.\nOn the morning of the debate, Akiva's hands trembled as he walked to the front of the room. He looked down at his first card and realized, with horror, that he had grabbed the wrong stack. These were his notes for a science quiz.\nThere was a long, painful pause. Then Akiva took a breath, set the cards aside, and began to speak from memory. He talked about boys he knew who stayed up late finishing worksheets, about the hours he spent at the kitchen table instead of learning with his father, and about the difference between practice that helps and busywork that only fills time.\nWhen he sat down, the room was quiet. Then, to his astonishment, Shimon began to clap.\nAkiva didn't win the debate, but he learned something more valuable: when he truly understood his ideas, he didn't need cards to explain them.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G6.B",
   "grade": 6,
   "form": "B",
   "title": "The Corner Lot",
   "words": 229,
   "fk": 7.1,
   "text": "Everyone on Rosewood Street agreed that the empty lot at the corner was an eyesore. It was full of weeds, broken bottles and an old tire that had been there for as long as anyone could remember. Then, one spring, Naftali and his grandfather decided to do something about it.\nThey began on a Sunday morning with two rakes, a wheelbarrow and a box of garbage bags. Neighbors watched from their porches with curiosity, and a few shook their heads. \"It will just fill up with junk again,\" one man predicted.\nBy the second weekend, three boys from down the block had joined them. By the third, a retired carpenter offered to build wooden boxes for planting, and the hardware store donated soil. Naftali drew a map of the lot on graph paper, dividing it into neat rows for tomatoes, peppers, cucumbers and sunflowers.\nThe summer was hot and dry, and the young plants needed constant attention. Naftali organized a watering schedule and taped it to a pole at the edge of the garden. Some mornings he arrived to find that someone had already done his shift.\nIn August, the neighbors held a small celebration among the sunflowers, which now towered over everyone's heads. The man who had predicted failure brought a basket of his own tomatoes to share. \"I suppose I was wrong,\" he admitted with a grin.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G7.A",
   "grade": 7,
   "form": "A",
   "title": "The Science of Sleep",
   "words": 225,
   "fk": 8.7,
   "text": "Many students treat sleep as wasted time, something to cut short when there is homework to finish or a game to watch. Scientists, however, have discovered that sleep is one of the most active and important things the brain does.\nDuring the night, the brain cycles through several stages. In the deepest stage, the body repairs muscles, strengthens the immune system and releases hormones that help young people grow. In another stage, known as REM sleep, the brain becomes highly active, and this is when most vivid dreaming takes place.\nPerhaps the most remarkable discovery is the connection between sleep and memory. While a person sleeps, the brain sorts through the day's experiences, strengthening important information and discarding the rest. Students who sleep well after learning something new often remember it better the next day than students who stay up late reviewing.\nHealth experts recommend that children between the ages of six and twelve get nine to twelve hours of sleep a night, and that teenagers get eight to ten. Yet surveys suggest that many students fall short, partly because of screens that keep their minds alert long after bedtime.\nThe lesson is clear. A good night's sleep is not a reward to be earned after the work is done; it is part of the work itself, preparing the mind to learn, focus and remember.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G7.B",
   "grade": 7,
   "form": "B",
   "title": "The Mystery of Bird Migration",
   "words": 205,
   "fk": 7.3,
   "text": "Every autumn, billions of birds leave their summer homes and fly hundreds or even thousands of miles to warmer places. Every spring, they make the long journey back. For centuries, people wondered how birds could find their way across oceans, mountains and deserts without a map.\nScientists now know that birds use several tools at once. Many birds navigate by the sun during the day, adjusting for its movement across the sky. Those that fly at night, such as many songbirds, use the stars, especially the patterns that circle the North Star. Young birds appear to learn these patterns by watching the night sky before their first journey.\nBirds can also sense Earth's magnetic field, the invisible force that makes a compass needle point north. This ability works even on cloudy days, when neither the sun nor the stars can be seen. In addition, birds recognize landmarks such as coastlines, rivers and mountain ranges, and some may even use smells to help find their way.\nThe journey is dangerous. Storms, exhaustion and a shortage of food along the route claim many lives each year. Yet the birds return season after season, guided by a set of skills that scientists are still working to fully understand.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G8.A",
   "grade": 8,
   "form": "A",
   "title": "How the Printing Press Changed the World",
   "words": 231,
   "fk": 9,
   "text": "Before the middle of the 1400s, every book in Europe had to be copied by hand. A skilled scribe might spend months producing a single volume, and books were so expensive that only the wealthiest people and institutions could own them. Most people never held a book in their hands.\nAround 1450, a German metalworker named Johannes Gutenberg developed a printing press that used movable metal type. Each letter was cast as a separate piece, and the pieces could be arranged into words and lines, inked, and pressed onto paper. When one page was finished, the letters could be rearranged for the next.\nThe effects were dramatic. Within a few decades, printing shops had spread to cities across Europe, and millions of books had been produced. As books became cheaper, more people learned to read, and ideas could travel farther and faster than ever before. Scientists could share discoveries with colleagues in distant countries, and knowledge that might once have been lost now survived in many identical copies.\nJewish communities, too, embraced the new technology. Hebrew printing presses produced editions of the Chumash, the Talmud and siddurim, and some of the page layouts set by early printers are still used today.\nHistorians often rank the printing press among the most important inventions in human history, because it transformed not only how books were made, but also who could learn from them.",
   "status": "Draft"
  },
  {
   "passage_id": "PF.ORF.G8.B",
   "grade": 8,
   "form": "B",
   "title": "The Accidental Discovery of Penicillin",
   "words": 226,
   "fk": 9.9,
   "text": "In 1928, a Scottish scientist named Alexander Fleming returned to his laboratory after a vacation and noticed something unusual. One of the dishes in which he had been growing bacteria had become contaminated with a fuzzy blue-green mold. Around the mold, the bacteria had disappeared, as if something had dissolved them.\nMany scientists might have thrown the spoiled dish away. Fleming, however, was curious. He discovered that the mold, called Penicillium, produced a substance that killed many kinds of harmful bacteria. He named it penicillin.\nFor years, though, penicillin remained little more than a laboratory curiosity. It was difficult to produce in large amounts, and it was not stable enough to use as a medicine. It was not until around 1940 that a team of researchers at Oxford University found ways to purify it and showed that it could cure serious infections in animals and then in people.\nDuring the Second World War, factories in the United States and Britain raced to manufacture penicillin on a massive scale. By the end of the war, it was saving the lives of countless soldiers who would otherwise have died from infected wounds.\nPenicillin became the first widely used antibiotic and opened a new era in medicine. Its story is also a reminder that great discoveries sometimes begin with an accident, noticed by someone patient enough to ask why.",
   "status": "Draft"
  }
 ],
 "word_lists": [
  {
   "list_id": "PF.WL.G1.A",
   "grade": 1,
   "form": "A",
   "words": [
    "the",
    "and",
    "is",
    "can",
    "see",
    "a",
    "to",
    "go",
    "he",
    "we",
    "my",
    "up",
    "cat",
    "dog",
    "sun",
    "run",
    "big",
    "red",
    "hop",
    "sit",
    "fun",
    "bed",
    "cup",
    "map",
    "hen",
    "fox",
    "bug",
    "jam",
    "wet",
    "lid",
    "rug",
    "ten",
    "hat",
    "pot",
    "mud",
    "van",
    "zip",
    "yes",
    "bat",
    "kit",
    "log",
    "net",
    "hut",
    "fin",
    "gum",
    "box",
    "web",
    "tub",
    "dip",
    "cot"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G1.B",
   "grade": 1,
   "form": "B",
   "words": [
    "was",
    "said",
    "you",
    "of",
    "for",
    "they",
    "have",
    "are",
    "look",
    "come",
    "pan",
    "dig",
    "nut",
    "pen",
    "jog",
    "rat",
    "wig",
    "cap",
    "mop",
    "bus",
    "den",
    "pin",
    "rib",
    "sad",
    "hug",
    "kid",
    "lap",
    "men",
    "nap",
    "pet",
    "rod",
    "tip",
    "vet",
    "wax",
    "yak",
    "zap",
    "beg",
    "cub",
    "fan",
    "gas",
    "hip",
    "jet",
    "lot",
    "mat",
    "nod",
    "pad",
    "rim",
    "sip",
    "tag",
    "hum"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G2.A",
   "grade": 2,
   "form": "A",
   "words": [
    "ship",
    "chat",
    "thin",
    "when",
    "much",
    "shop",
    "rain",
    "boat",
    "seed",
    "play",
    "night",
    "snow",
    "cake",
    "bike",
    "home",
    "tune",
    "park",
    "bird",
    "corn",
    "fern",
    "coin",
    "toy",
    "cloud",
    "book",
    "moon",
    "saw",
    "chalk",
    "splash",
    "strong",
    "spring",
    "catch",
    "bridge",
    "knock",
    "write",
    "sunset",
    "picnic",
    "rabbit",
    "kitten",
    "napkin",
    "basket",
    "jumping",
    "rained",
    "wishes",
    "happy",
    "could",
    "would",
    "again",
    "every",
    "friend",
    "because"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G2.B",
   "grade": 2,
   "form": "B",
   "words": [
    "chip",
    "them",
    "with",
    "whip",
    "fish",
    "mail",
    "road",
    "feet",
    "day",
    "light",
    "grow",
    "lake",
    "kite",
    "rope",
    "cube",
    "star",
    "shirt",
    "horn",
    "turn",
    "boil",
    "boy",
    "crown",
    "cook",
    "food",
    "draw",
    "talk",
    "scrap",
    "strip",
    "thread",
    "match",
    "judge",
    "wrap",
    "know",
    "pancake",
    "cabin",
    "button",
    "mitten",
    "zigzag",
    "helped",
    "planted",
    "boxes",
    "sunny",
    "puppy",
    "should",
    "many",
    "other",
    "people",
    "school",
    "pretty",
    "chew"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G3.A",
   "grade": 3,
   "form": "A",
   "words": [
    "careful",
    "unhappy",
    "rebuild",
    "quickly",
    "thankful",
    "darkness",
    "preheat",
    "mistake",
    "country",
    "enough",
    "through",
    "thought",
    "beautiful",
    "different",
    "important",
    "together",
    "remember",
    "surprise",
    "finally",
    "answer",
    "special",
    "children",
    "animal",
    "problem",
    "family",
    "question",
    "minute",
    "picture",
    "already",
    "weather",
    "kitchen",
    "treasure",
    "measure",
    "pencil",
    "giant",
    "circle",
    "ocean",
    "station",
    "nature",
    "famous",
    "however",
    "began",
    "island",
    "listen",
    "journey",
    "early",
    "heavy",
    "window",
    "hungry",
    "garden"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G3.B",
   "grade": 3,
   "form": "B",
   "words": [
    "helpful",
    "unlock",
    "retell",
    "slowly",
    "cheerful",
    "kindness",
    "prepay",
    "misread",
    "trouble",
    "though",
    "bought",
    "caught",
    "wonderful",
    "favorite",
    "sometimes",
    "everyone",
    "discover",
    "believe",
    "suddenly",
    "laughed",
    "notice",
    "village",
    "machine",
    "holiday",
    "thousand",
    "building",
    "often",
    "honest",
    "adventure",
    "mixture",
    "furniture",
    "citizen",
    "gentle",
    "center",
    "fiction",
    "motion",
    "delight",
    "probably",
    "among",
    "double",
    "castle",
    "whistle",
    "autumn",
    "eager",
    "ready",
    "meadow",
    "sweater",
    "cousin",
    "finish",
    "pocket"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G4.A",
   "grade": 4,
   "form": "A",
   "words": [
    "accident",
    "ancient",
    "appear",
    "attention",
    "celebrate",
    "character",
    "collection",
    "complete",
    "continue",
    "decision",
    "describe",
    "direction",
    "disappear",
    "discovery",
    "distance",
    "electric",
    "encourage",
    "especially",
    "experience",
    "explain",
    "imagine",
    "instrument",
    "invention",
    "material",
    "mountain",
    "necessary",
    "neighbor",
    "ordinary",
    "paragraph",
    "peaceful",
    "population",
    "position",
    "possible",
    "prepare",
    "president",
    "pressure",
    "volcano",
    "protect",
    "recently",
    "satisfy",
    "separate",
    "signal",
    "solution",
    "straight",
    "terrible",
    "therefore",
    "usually",
    "various",
    "electricity",
    "enormous"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G4.B",
   "grade": 4,
   "form": "B",
   "words": [
    "astronaut",
    "agreement",
    "argument",
    "audience",
    "bicycle",
    "calendar",
    "captain",
    "certain",
    "chemical",
    "combine",
    "connection",
    "creature",
    "curious",
    "delicious",
    "difficult",
    "disagree",
    "division",
    "doubtful",
    "earthquake",
    "effort",
    "entire",
    "equipment",
    "exercise",
    "familiar",
    "fortunate",
    "frighten",
    "government",
    "hospital",
    "immediately",
    "information",
    "judgment",
    "knowledge",
    "library",
    "license",
    "manufacture",
    "mysterious",
    "natural",
    "opposite",
    "organize",
    "perhaps",
    "permission",
    "quarter",
    "rescue",
    "several",
    "surface",
    "temperature",
    "tomorrow",
    "unusual",
    "valuable",
    "vegetable"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G5.A",
   "grade": 5,
   "form": "A",
   "words": [
    "abundant",
    "accomplish",
    "adjective",
    "approximately",
    "assignment",
    "atmosphere",
    "boundary",
    "category",
    "circumstance",
    "colony",
    "competition",
    "consequence",
    "constitution",
    "contribute",
    "convenient",
    "democracy",
    "determine",
    "dimension",
    "efficient",
    "elaborate",
    "emphasize",
    "environment",
    "evaporate",
    "evidence",
    "exaggerate",
    "fascinate",
    "frequently",
    "generation",
    "geography",
    "hesitate",
    "horizon",
    "hypothesis",
    "independent",
    "influence",
    "investigate",
    "legislation",
    "magnificent",
    "microscope",
    "molecule",
    "observation",
    "particular",
    "perimeter",
    "persuade",
    "previous",
    "significant",
    "structure",
    "suspicious",
    "transform",
    "vocabulary",
    "spectacular"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G5.B",
   "grade": 5,
   "form": "B",
   "words": [
    "accurate",
    "achievement",
    "advantage",
    "anniversary",
    "apparent",
    "architecture",
    "benefit",
    "calculate",
    "ceremony",
    "civilization",
    "communicate",
    "comparison",
    "conclusion",
    "considerable",
    "cooperate",
    "criticize",
    "definition",
    "demonstrate",
    "desperate",
    "economy",
    "eliminate",
    "encyclopedia",
    "equation",
    "estimate",
    "exhibit",
    "expedition",
    "fortunately",
    "glossary",
    "hemisphere",
    "identical",
    "illustrate",
    "imaginary",
    "inhabitant",
    "interrupt",
    "landscape",
    "majority",
    "mineral",
    "negotiate",
    "occasion",
    "opportunity",
    "orchestra",
    "preserve",
    "procedure",
    "reluctant",
    "resource",
    "sequence",
    "thermometer",
    "tradition",
    "vertical",
    "volunteer"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G6.A",
   "grade": 6,
   "form": "A",
   "words": [
    "adolescent",
    "ambitious",
    "analyze",
    "anonymous",
    "anticipate",
    "archaeology",
    "authentic",
    "barometer",
    "biography",
    "chronological",
    "coincidence",
    "commemorate",
    "compassionate",
    "conscientious",
    "controversy",
    "correspondence",
    "deteriorate",
    "diagnosis",
    "dialogue",
    "diminish",
    "discrepancy",
    "enthusiasm",
    "equilibrium",
    "exceptional",
    "extraordinary",
    "feasible",
    "fluctuate",
    "guarantee",
    "hierarchy",
    "hypothetical",
    "illuminate",
    "inevitable",
    "infrastructure",
    "integrity",
    "irrelevant",
    "jeopardize",
    "legitimate",
    "meticulous",
    "mischievous",
    "nuisance",
    "omission",
    "perseverance",
    "phenomenon",
    "prejudice",
    "proportion",
    "questionnaire",
    "rehearsal",
    "simultaneous",
    "spontaneous",
    "unanimous"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G6.B",
   "grade": 6,
   "form": "B",
   "words": [
    "abbreviate",
    "accommodate",
    "acquaintance",
    "admirable",
    "advocate",
    "alliance",
    "amateur",
    "apprehensive",
    "aspiration",
    "bureaucracy",
    "catastrophe",
    "circumference",
    "collaborate",
    "competent",
    "condensation",
    "conspicuous",
    "deceive",
    "deliberate",
    "dilemma",
    "disciplinary",
    "eccentric",
    "efficiency",
    "embarrass",
    "emphasis",
    "exhilarate",
    "expenditure",
    "facilitate",
    "formidable",
    "gradually",
    "hospitable",
    "ingenious",
    "innovation",
    "interpretation",
    "laboratory",
    "lieutenant",
    "mediocre",
    "miniature",
    "negligible",
    "obstacle",
    "parallel",
    "perpendicular",
    "precipitation",
    "pronunciation",
    "reconcile",
    "resilient",
    "sufficient",
    "tremendous",
    "vulnerable",
    "itinerary",
    "courteous"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G7.A",
   "grade": 7,
   "form": "A",
   "words": [
    "abolition",
    "acknowledge",
    "adversary",
    "aesthetic",
    "allegiance",
    "ambiguous",
    "anecdote",
    "antagonist",
    "arbitrary",
    "benevolent",
    "capitalism",
    "coherent",
    "comprehensive",
    "connotation",
    "contemporary",
    "credibility",
    "culminate",
    "depict",
    "dissent",
    "eloquent",
    "empirical",
    "exemplify",
    "exploit",
    "fallacy",
    "foreshadow",
    "gratuitous",
    "ideology",
    "implicit",
    "incentive",
    "inference",
    "juxtapose",
    "melancholy",
    "metaphorical",
    "narrative",
    "objective",
    "paradox",
    "perspective",
    "plausible",
    "precedent",
    "reciprocal",
    "rhetoric",
    "skeptical",
    "subsequent",
    "synthesize",
    "tangible",
    "tenacious",
    "unprecedented",
    "utilitarian",
    "verify",
    "zealous"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G7.B",
   "grade": 7,
   "form": "B",
   "words": [
    "abstract",
    "adequate",
    "alleviate",
    "amendment",
    "analogy",
    "apathy",
    "articulate",
    "indispensable",
    "chronicle",
    "colloquial",
    "commodity",
    "concise",
    "constituent",
    "corroborate",
    "cynical",
    "denotation",
    "diligent",
    "discern",
    "disparity",
    "elicit",
    "emulate",
    "reconciliation",
    "explicit",
    "extrapolate",
    "ambivalent",
    "hypocrisy",
    "imminent",
    "indifferent",
    "inherent",
    "irony",
    "mitigate",
    "monotonous",
    "nuance",
    "obsolete",
    "pragmatic",
    "profound",
    "prominent",
    "refute",
    "renaissance",
    "satire",
    "scrutinize",
    "sovereign",
    "stagnant",
    "perpetuate",
    "succinct",
    "theoretical",
    "transition",
    "undermine",
    "vindicate",
    "accountability"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G8.A",
   "grade": 8,
   "form": "A",
   "words": [
    "aberration",
    "acquiesce",
    "admonish",
    "affluent",
    "ameliorate",
    "antithesis",
    "assimilate",
    "audacious",
    "bolster",
    "brevity",
    "cacophony",
    "circumvent",
    "clandestine",
    "cognizant",
    "complacent",
    "conjecture",
    "convoluted",
    "culpable",
    "debilitate",
    "dichotomy",
    "discerning",
    "disseminate",
    "ebullient",
    "egregious",
    "enumerate",
    "ephemeral",
    "equivocal",
    "exacerbate",
    "extraneous",
    "fastidious",
    "gregarious",
    "idiosyncrasy",
    "impetuous",
    "incongruous",
    "inextricable",
    "insipid",
    "juxtaposition",
    "laudable",
    "magnanimous",
    "nebulous",
    "obfuscate",
    "ostentatious",
    "pernicious",
    "quintessential",
    "repudiate",
    "sagacious",
    "superfluous",
    "ubiquitous",
    "terse",
    "wry"
   ],
   "status": "Draft"
  },
  {
   "list_id": "PF.WL.G8.B",
   "grade": 8,
   "form": "B",
   "words": [
    "recalcitrant",
    "acrimony",
    "adulation",
    "alacrity",
    "anomaly",
    "apprise",
    "ascertain",
    "austere",
    "belligerent",
    "buttress",
    "capricious",
    "censure",
    "coalesce",
    "condone",
    "contrite",
    "corroborative",
    "deference",
    "delineate",
    "diatribe",
    "disparage",
    "dogmatic",
    "elucidate",
    "enigmatic",
    "esoteric",
    "euphemism",
    "exonerate",
    "fervent",
    "perfunctory",
    "hackneyed",
    "impeccable",
    "incessant",
    "indefatigable",
    "innocuous",
    "intrepid",
    "lethargic",
    "maverick",
    "meander",
    "nonchalant",
    "oblivious",
    "paradigm",
    "placate",
    "precarious",
    "vituperative",
    "reticent",
    "scrupulous",
    "tenuous",
    "unequivocal",
    "vacillate",
    "venerable",
    "indiscriminate"
   ],
   "status": "Draft"
  }
 ],
 "rapid_naming": [
  {
   "grid_id": "PF.RAN.LET.A",
   "rows": [
    [
     "p",
     "d",
     "s",
     "d",
     "o",
     "p",
     "s",
     "o",
     "a",
     "p"
    ],
    [
     "s",
     "d",
     "s",
     "a",
     "p",
     "o",
     "a",
     "s",
     "d",
     "s"
    ],
    [
     "p",
     "o",
     "d",
     "p",
     "o",
     "p",
     "o",
     "d",
     "a",
     "s"
    ],
    [
     "d",
     "a",
     "d",
     "a",
     "s",
     "p",
     "d",
     "a",
     "d",
     "p"
    ],
    [
     "o",
     "a",
     "o",
     "a",
     "p",
     "a",
     "o",
     "s",
     "o",
     "s"
    ]
   ],
   "status": "Draft"
  },
  {
   "grid_id": "PF.RAN.LET.B",
   "rows": [
    [
     "s",
     "p",
     "o",
     "s",
     "a",
     "d",
     "a",
     "s",
     "p",
     "o"
    ],
    [
     "s",
     "a",
     "p",
     "s",
     "d",
     "p",
     "a",
     "p",
     "a",
     "o"
    ],
    [
     "d",
     "o",
     "d",
     "p",
     "o",
     "d",
     "o",
     "a",
     "s",
     "d"
    ],
    [
     "o",
     "s",
     "d",
     "s",
     "a",
     "s",
     "o",
     "p",
     "o",
     "p"
    ],
    [
     "d",
     "p",
     "o",
     "s",
     "a",
     "p",
     "a",
     "d",
     "a",
     "d"
    ]
   ],
   "status": "Draft"
  },
  {
   "grid_id": "PF.RAN.DIG.A",
   "rows": [
    [
     "2",
     "9",
     "7",
     "4",
     "7",
     "4",
     "9",
     "6",
     "7",
     "4"
    ],
    [
     "2",
     "9",
     "6",
     "4",
     "7",
     "2",
     "7",
     "2",
     "9",
     "4"
    ],
    [
     "7",
     "2",
     "9",
     "4",
     "9",
     "2",
     "6",
     "2",
     "6",
     "7"
    ],
    [
     "9",
     "4",
     "6",
     "7",
     "2",
     "7",
     "2",
     "7",
     "9",
     "6"
    ],
    [
     "4",
     "9",
     "6",
     "9",
     "2",
     "6",
     "4",
     "6",
     "4",
     "6"
    ]
   ],
   "status": "Draft"
  },
  {
   "grid_id": "PF.RAN.DIG.B",
   "rows": [
    [
     "4",
     "2",
     "4",
     "7",
     "4",
     "7",
     "6",
     "9",
     "4",
     "6"
    ],
    [
     "2",
     "4",
     "9",
     "2",
     "9",
     "2",
     "7",
     "4",
     "7",
     "2"
    ],
    [
     "4",
     "6",
     "2",
     "7",
     "9",
     "4",
     "6",
     "7",
     "2",
     "9"
    ],
    [
     "6",
     "2",
     "4",
     "9",
     "7",
     "2",
     "4",
     "9",
     "6",
     "9"
    ],
    [
     "2",
     "6",
     "9",
     "6",
     "7",
     "9",
     "6",
     "7",
     "6",
     "7"
    ]
   ],
   "status": "Draft"
  }
 ]
};/*</P4>*/
