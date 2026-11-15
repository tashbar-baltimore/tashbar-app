/* PATHFINDER Writing content (PF-W1, LOG CHANGE 2201).
   PF_W: copy sentences, spelling inventory (4 lists x 26), sentence tiles (24) and alternatives, 6 picture prompts, rubric.
   Stage A uses the sentence tiles. The rest (copying, spelling, prompts, rubric) waits for Writing Stage B, not installed.
   Built by script from the HQ JSON files (07 PATHFINDER BUILD PROMPT v5, local build 2026-11-12). Do not edit by hand: rebuild.
   Each file is embedded exactly as published (between the <KEY> marker comments), so its sha256 matches the LOG CHANGE.
   Every record is Draft until reviewers mark it Approved. */
/*<W1>*/var PF_W = {
 "bank": "PF-W1_Pathfinder_Writing_DRAFT",
 "made": "2026-11-11",
 "by": "CLAUDE (developer@)",
 "status": "Draft",
 "categories": {
  "IC": [
   "Initial consonant",
   "Letter Name"
  ],
  "FC": [
   "Final consonant",
   "Letter Name"
  ],
  "SV": [
   "Short vowel",
   "Letter Name"
  ],
  "DG": [
   "Digraph",
   "Letter Name"
  ],
  "BL": [
   "Blend",
   "Letter Name"
  ],
  "LV": [
   "Long vowel pattern",
   "Within Word"
  ],
  "OV": [
   "Other vowel (r-controlled, diphthong)",
   "Within Word"
  ],
  "CX": [
   "Complex consonant",
   "Within Word"
  ],
  "IE": [
   "Inflected ending",
   "Syllables & Affixes"
  ],
  "SJ": [
   "Syllable juncture",
   "Syllables & Affixes"
  ],
  "UF": [
   "Unaccented final syllable",
   "Syllables & Affixes"
  ],
  "HS": [
   "Harder suffix",
   "Derivational"
  ],
  "BR": [
   "Base or root change",
   "Derivational"
  ]
 },
 "spelling": {
  "PRIMARY.A": [
   {
    "n": 1,
    "word": "hat",
    "sentence": "Abba wears a black hat.",
    "features": [
     {
      "category": "IC",
      "letters": "h",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "t",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "a",
      "where": "any"
     }
    ]
   },
   {
    "n": 2,
    "word": "web",
    "sentence": "The spider made a web.",
    "features": [
     {
      "category": "IC",
      "letters": "w",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "b",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "e",
      "where": "any"
     }
    ]
   },
   {
    "n": 3,
    "word": "pin",
    "sentence": "I found a pin on the floor.",
    "features": [
     {
      "category": "IC",
      "letters": "p",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "n",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "i",
      "where": "any"
     }
    ]
   },
   {
    "n": 4,
    "word": "mop",
    "sentence": "Use the mop to clean the spill.",
    "features": [
     {
      "category": "IC",
      "letters": "m",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "p",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "o",
      "where": "any"
     }
    ]
   },
   {
    "n": 5,
    "word": "tub",
    "sentence": "The water filled the tub.",
    "features": [
     {
      "category": "IC",
      "letters": "t",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "b",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "u",
      "where": "any"
     }
    ]
   },
   {
    "n": 6,
    "word": "chin",
    "sentence": "He rubbed his chin.",
    "features": [
     {
      "category": "DG",
      "letters": "ch",
      "where": "start"
     },
     {
      "category": "SV",
      "letters": "i",
      "where": "any"
     }
    ]
   },
   {
    "n": 7,
    "word": "shed",
    "sentence": "The bikes are in the shed.",
    "features": [
     {
      "category": "DG",
      "letters": "sh",
      "where": "start"
     },
     {
      "category": "SV",
      "letters": "e",
      "where": "any"
     }
    ]
   },
   {
    "n": 8,
    "word": "crab",
    "sentence": "A crab walked on the sand.",
    "features": [
     {
      "category": "BL",
      "letters": "cr",
      "where": "start"
     },
     {
      "category": "SV",
      "letters": "a",
      "where": "any"
     }
    ]
   },
   {
    "n": 9,
    "word": "jump",
    "sentence": "Can you jump over the rope?",
    "features": [
     {
      "category": "BL",
      "letters": "mp",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "u",
      "where": "any"
     }
    ]
   },
   {
    "n": 10,
    "word": "flag",
    "sentence": "The flag waved in the wind.",
    "features": [
     {
      "category": "BL",
      "letters": "fl",
      "where": "start"
     },
     {
      "category": "SV",
      "letters": "a",
      "where": "any"
     }
    ]
   },
   {
    "n": 11,
    "word": "smile",
    "sentence": "Zeidy gave me a big smile.",
    "features": [
     {
      "category": "BL",
      "letters": "sm",
      "where": "start"
     },
     {
      "category": "LV",
      "letters": "i_e",
      "where": "any"
     }
    ]
   },
   {
    "n": 12,
    "word": "paint",
    "sentence": "We will paint the fence.",
    "features": [
     {
      "category": "LV",
      "letters": "ai",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "nt",
      "where": "end"
     }
    ]
   },
   {
    "n": 13,
    "word": "soap",
    "sentence": "Wash your hands with soap.",
    "features": [
     {
      "category": "LV",
      "letters": "oa",
      "where": "any"
     }
    ]
   },
   {
    "n": 14,
    "word": "light",
    "sentence": "Turn on the light, please.",
    "features": [
     {
      "category": "LV",
      "letters": "igh",
      "where": "any"
     }
    ]
   },
   {
    "n": 15,
    "word": "green",
    "sentence": "The grass is green.",
    "features": [
     {
      "category": "LV",
      "letters": "ee",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "gr",
      "where": "start"
     }
    ]
   },
   {
    "n": 16,
    "word": "storm",
    "sentence": "The storm knocked down a tree.",
    "features": [
     {
      "category": "OV",
      "letters": "or",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "st",
      "where": "start"
     }
    ]
   },
   {
    "n": 17,
    "word": "shirt",
    "sentence": "He wore a white shirt.",
    "features": [
     {
      "category": "OV",
      "letters": "ir",
      "where": "any"
     },
     {
      "category": "DG",
      "letters": "sh",
      "where": "start"
     }
    ]
   },
   {
    "n": 18,
    "word": "cloud",
    "sentence": "A dark cloud hid the sun.",
    "features": [
     {
      "category": "OV",
      "letters": "ou",
      "where": "any"
     }
    ]
   },
   {
    "n": 19,
    "word": "boil",
    "sentence": "Wait for the water to boil.",
    "features": [
     {
      "category": "OV",
      "letters": "oi",
      "where": "any"
     }
    ]
   },
   {
    "n": 20,
    "word": "hiking",
    "sentence": "We went hiking in the hills.",
    "features": [
     {
      "category": "IE",
      "letters": "king",
      "where": "end"
     }
    ]
   },
   {
    "n": 21,
    "word": "hopped",
    "sentence": "The frog hopped away.",
    "features": [
     {
      "category": "IE",
      "letters": "pped",
      "where": "end"
     }
    ]
   },
   {
    "n": 22,
    "word": "babies",
    "sentence": "The babies were sleeping.",
    "features": [
     {
      "category": "IE",
      "letters": "ies",
      "where": "end"
     }
    ]
   },
   {
    "n": 23,
    "word": "rabbit",
    "sentence": "A rabbit ran across the yard.",
    "features": [
     {
      "category": "SJ",
      "letters": "bb",
      "where": "any"
     }
    ]
   },
   {
    "n": 24,
    "word": "pilot",
    "sentence": "The pilot landed the plane.",
    "features": [
     {
      "category": "SJ",
      "letters": "pilo",
      "where": "start"
     }
    ]
   },
   {
    "n": 25,
    "word": "simple",
    "sentence": "The answer was simple.",
    "features": [
     {
      "category": "UF",
      "letters": "ple",
      "where": "end"
     }
    ]
   },
   {
    "n": 26,
    "word": "invitation",
    "sentence": "We got an invitation to the chasunah.",
    "features": [
     {
      "category": "BR",
      "letters": "itation",
      "where": "end"
     }
    ]
   }
  ],
  "PRIMARY.B": [
   {
    "n": 1,
    "word": "cap",
    "sentence": "He put on his cap.",
    "features": [
     {
      "category": "IC",
      "letters": "c",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "p",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "a",
      "where": "any"
     }
    ]
   },
   {
    "n": 2,
    "word": "net",
    "sentence": "The ball went into the net.",
    "features": [
     {
      "category": "IC",
      "letters": "n",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "t",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "e",
      "where": "any"
     }
    ]
   },
   {
    "n": 3,
    "word": "lip",
    "sentence": "He bit his lip.",
    "features": [
     {
      "category": "IC",
      "letters": "l",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "p",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "i",
      "where": "any"
     }
    ]
   },
   {
    "n": 4,
    "word": "dot",
    "sentence": "Put a dot at the end.",
    "features": [
     {
      "category": "IC",
      "letters": "d",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "t",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "o",
      "where": "any"
     }
    ]
   },
   {
    "n": 5,
    "word": "bug",
    "sentence": "A bug landed on my arm.",
    "features": [
     {
      "category": "IC",
      "letters": "b",
      "where": "start"
     },
     {
      "category": "FC",
      "letters": "g",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "u",
      "where": "any"
     }
    ]
   },
   {
    "n": 6,
    "word": "chop",
    "sentence": "Abba will chop the wood.",
    "features": [
     {
      "category": "DG",
      "letters": "ch",
      "where": "start"
     },
     {
      "category": "SV",
      "letters": "o",
      "where": "any"
     }
    ]
   },
   {
    "n": 7,
    "word": "fish",
    "sentence": "We ate fish on Shabbos.",
    "features": [
     {
      "category": "DG",
      "letters": "sh",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "i",
      "where": "any"
     }
    ]
   },
   {
    "n": 8,
    "word": "drum",
    "sentence": "He played the drum.",
    "features": [
     {
      "category": "BL",
      "letters": "dr",
      "where": "start"
     },
     {
      "category": "SV",
      "letters": "u",
      "where": "any"
     }
    ]
   },
   {
    "n": 9,
    "word": "lamp",
    "sentence": "Turn off the lamp.",
    "features": [
     {
      "category": "BL",
      "letters": "mp",
      "where": "end"
     },
     {
      "category": "SV",
      "letters": "a",
      "where": "any"
     }
    ]
   },
   {
    "n": 10,
    "word": "plug",
    "sentence": "Pull out the plug.",
    "features": [
     {
      "category": "BL",
      "letters": "pl",
      "where": "start"
     },
     {
      "category": "SV",
      "letters": "u",
      "where": "any"
     }
    ]
   },
   {
    "n": 11,
    "word": "slide",
    "sentence": "The boys went down the slide.",
    "features": [
     {
      "category": "BL",
      "letters": "sl",
      "where": "start"
     },
     {
      "category": "LV",
      "letters": "i_e",
      "where": "any"
     }
    ]
   },
   {
    "n": 12,
    "word": "snail",
    "sentence": "The snail moved slowly.",
    "features": [
     {
      "category": "LV",
      "letters": "ai",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "sn",
      "where": "start"
     }
    ]
   },
   {
    "n": 13,
    "word": "toast",
    "sentence": "I ate toast for breakfast.",
    "features": [
     {
      "category": "LV",
      "letters": "oa",
      "where": "any"
     }
    ]
   },
   {
    "n": 14,
    "word": "fight",
    "sentence": "Brothers should not fight.",
    "features": [
     {
      "category": "LV",
      "letters": "igh",
      "where": "any"
     }
    ]
   },
   {
    "n": 15,
    "word": "sleep",
    "sentence": "It is time to go to sleep.",
    "features": [
     {
      "category": "LV",
      "letters": "ee",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "sl",
      "where": "start"
     }
    ]
   },
   {
    "n": 16,
    "word": "sport",
    "sentence": "Hockey is a fast sport.",
    "features": [
     {
      "category": "OV",
      "letters": "or",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "sp",
      "where": "start"
     }
    ]
   },
   {
    "n": 17,
    "word": "chirp",
    "sentence": "The birds chirp in the morning.",
    "features": [
     {
      "category": "OV",
      "letters": "ir",
      "where": "any"
     },
     {
      "category": "DG",
      "letters": "ch",
      "where": "start"
     }
    ]
   },
   {
    "n": 18,
    "word": "mouth",
    "sentence": "Open your mouth wide.",
    "features": [
     {
      "category": "OV",
      "letters": "ou",
      "where": "any"
     }
    ]
   },
   {
    "n": 19,
    "word": "coin",
    "sentence": "He dropped a coin in the pushka.",
    "features": [
     {
      "category": "OV",
      "letters": "oi",
      "where": "any"
     }
    ]
   },
   {
    "n": 20,
    "word": "baking",
    "sentence": "We are baking challah.",
    "features": [
     {
      "category": "IE",
      "letters": "king",
      "where": "end"
     }
    ]
   },
   {
    "n": 21,
    "word": "stopped",
    "sentence": "The bus stopped at the corner.",
    "features": [
     {
      "category": "IE",
      "letters": "pped",
      "where": "end"
     }
    ]
   },
   {
    "n": 22,
    "word": "puppies",
    "sentence": "The puppies played in the grass.",
    "features": [
     {
      "category": "IE",
      "letters": "ies",
      "where": "end"
     }
    ]
   },
   {
    "n": 23,
    "word": "muffin",
    "sentence": "He ate a blueberry muffin.",
    "features": [
     {
      "category": "SJ",
      "letters": "ff",
      "where": "any"
     }
    ]
   },
   {
    "n": 24,
    "word": "tiger",
    "sentence": "A tiger has stripes.",
    "features": [
     {
      "category": "SJ",
      "letters": "tige",
      "where": "start"
     }
    ]
   },
   {
    "n": 25,
    "word": "candle",
    "sentence": "Light the candle carefully.",
    "features": [
     {
      "category": "UF",
      "letters": "dle",
      "where": "end"
     }
    ]
   },
   {
    "n": 26,
    "word": "decision",
    "sentence": "That was a good decision.",
    "features": [
     {
      "category": "BR",
      "letters": "cision",
      "where": "end"
     }
    ]
   }
  ],
  "UPPER.A": [
   {
    "n": 1,
    "word": "stroke",
    "sentence": "Each stroke of the oar moved the boat.",
    "features": [
     {
      "category": "LV",
      "letters": "o_e",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "str",
      "where": "start"
     }
    ]
   },
   {
    "n": 2,
    "word": "bridge",
    "sentence": "We walked across the bridge.",
    "features": [
     {
      "category": "CX",
      "letters": "dge",
      "where": "end"
     }
    ]
   },
   {
    "n": 3,
    "word": "throat",
    "sentence": "My throat was sore.",
    "features": [
     {
      "category": "LV",
      "letters": "oa",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "thr",
      "where": "start"
     }
    ]
   },
   {
    "n": 4,
    "word": "spray",
    "sentence": "The waves sent up a cold spray.",
    "features": [
     {
      "category": "LV",
      "letters": "ay",
      "where": "end"
     }
    ]
   },
   {
    "n": 5,
    "word": "crown",
    "sentence": "A crown sits on the Sefer Torah.",
    "features": [
     {
      "category": "OV",
      "letters": "ow",
      "where": "any"
     }
    ]
   },
   {
    "n": 6,
    "word": "nurse",
    "sentence": "The nurse took my temperature.",
    "features": [
     {
      "category": "OV",
      "letters": "ur",
      "where": "any"
     }
    ]
   },
   {
    "n": 7,
    "word": "squeal",
    "sentence": "The brakes made a loud squeal.",
    "features": [
     {
      "category": "CX",
      "letters": "squ",
      "where": "start"
     },
     {
      "category": "LV",
      "letters": "ea",
      "where": "any"
     }
    ]
   },
   {
    "n": 8,
    "word": "knock",
    "sentence": "Please knock before you enter.",
    "features": [
     {
      "category": "CX",
      "letters": "kn",
      "where": "start"
     },
     {
      "category": "CX",
      "letters": "ck",
      "where": "end"
     }
    ]
   },
   {
    "n": 9,
    "word": "hurried",
    "sentence": "He hurried to catch the bus.",
    "features": [
     {
      "category": "IE",
      "letters": "ied",
      "where": "end"
     }
    ]
   },
   {
    "n": 10,
    "word": "planning",
    "sentence": "We are planning a trip.",
    "features": [
     {
      "category": "IE",
      "letters": "nning",
      "where": "end"
     }
    ]
   },
   {
    "n": 11,
    "word": "boxes",
    "sentence": "Stack the boxes in the corner.",
    "features": [
     {
      "category": "IE",
      "letters": "xes",
      "where": "end"
     }
    ]
   },
   {
    "n": 12,
    "word": "napkin",
    "sentence": "Put a napkin on your lap.",
    "features": [
     {
      "category": "SJ",
      "letters": "pk",
      "where": "any"
     }
    ]
   },
   {
    "n": 13,
    "word": "silent",
    "sentence": "The room was silent.",
    "features": [
     {
      "category": "SJ",
      "letters": "sile",
      "where": "start"
     }
    ]
   },
   {
    "n": 14,
    "word": "follow",
    "sentence": "Follow the arrows to the exit.",
    "features": [
     {
      "category": "SJ",
      "letters": "ll",
      "where": "any"
     }
    ]
   },
   {
    "n": 15,
    "word": "mountain",
    "sentence": "They climbed the mountain.",
    "features": [
     {
      "category": "UF",
      "letters": "tain",
      "where": "end"
     }
    ]
   },
   {
    "n": 16,
    "word": "doctor",
    "sentence": "The doctor checked my ears.",
    "features": [
     {
      "category": "UF",
      "letters": "tor",
      "where": "end"
     }
    ]
   },
   {
    "n": 17,
    "word": "pencil",
    "sentence": "Sharpen your pencil.",
    "features": [
     {
      "category": "UF",
      "letters": "cil",
      "where": "end"
     }
    ]
   },
   {
    "n": 18,
    "word": "agreement",
    "sentence": "The boys reached an agreement.",
    "features": [
     {
      "category": "HS",
      "letters": "ment",
      "where": "end"
     }
    ]
   },
   {
    "n": 19,
    "word": "comfortable",
    "sentence": "This chair is comfortable.",
    "features": [
     {
      "category": "HS",
      "letters": "able",
      "where": "end"
     }
    ]
   },
   {
    "n": 20,
    "word": "possible",
    "sentence": "Anything is possible with effort.",
    "features": [
     {
      "category": "HS",
      "letters": "ible",
      "where": "end"
     }
    ]
   },
   {
    "n": 21,
    "word": "explanation",
    "sentence": "Rebbi gave a clear explanation.",
    "features": [
     {
      "category": "BR",
      "letters": "planation",
      "where": "end"
     }
    ]
   },
   {
    "n": 22,
    "word": "competition",
    "sentence": "He entered the chess competition.",
    "features": [
     {
      "category": "BR",
      "letters": "petition",
      "where": "end"
     }
    ]
   },
   {
    "n": 23,
    "word": "admission",
    "sentence": "Admission to the museum is free.",
    "features": [
     {
      "category": "BR",
      "letters": "mission",
      "where": "end"
     }
    ]
   },
   {
    "n": 24,
    "word": "medicine",
    "sentence": "Take the medicine after you eat.",
    "features": [
     {
      "category": "BR",
      "letters": "dicine",
      "where": "end"
     }
    ]
   },
   {
    "n": 25,
    "word": "solemn",
    "sentence": "The room was quiet and solemn.",
    "features": [
     {
      "category": "BR",
      "letters": "mn",
      "where": "end"
     }
    ]
   },
   {
    "n": 26,
    "word": "criticize",
    "sentence": "Do not criticize your friends.",
    "features": [
     {
      "category": "BR",
      "letters": "ticize",
      "where": "end"
     }
    ]
   }
  ],
  "UPPER.B": [
   {
    "n": 1,
    "word": "smoke",
    "sentence": "Smoke rose from the chimney.",
    "features": [
     {
      "category": "LV",
      "letters": "o_e",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "sm",
      "where": "start"
     }
    ]
   },
   {
    "n": 2,
    "word": "judge",
    "sentence": "The judge listened carefully.",
    "features": [
     {
      "category": "CX",
      "letters": "dge",
      "where": "end"
     }
    ]
   },
   {
    "n": 3,
    "word": "groan",
    "sentence": "I heard a groan from the back row.",
    "features": [
     {
      "category": "LV",
      "letters": "oa",
      "where": "any"
     },
     {
      "category": "BL",
      "letters": "gr",
      "where": "start"
     }
    ]
   },
   {
    "n": 4,
    "word": "clay",
    "sentence": "He made a bowl out of clay.",
    "features": [
     {
      "category": "LV",
      "letters": "ay",
      "where": "end"
     }
    ]
   },
   {
    "n": 5,
    "word": "frown",
    "sentence": "Turn that frown upside down.",
    "features": [
     {
      "category": "OV",
      "letters": "ow",
      "where": "any"
     }
    ]
   },
   {
    "n": 6,
    "word": "purse",
    "sentence": "He kept his coins in a small purse.",
    "features": [
     {
      "category": "OV",
      "letters": "ur",
      "where": "any"
     }
    ]
   },
   {
    "n": 7,
    "word": "squeak",
    "sentence": "The door had a squeak.",
    "features": [
     {
      "category": "CX",
      "letters": "squ",
      "where": "start"
     },
     {
      "category": "LV",
      "letters": "ea",
      "where": "any"
     }
    ]
   },
   {
    "n": 8,
    "word": "wreck",
    "sentence": "The storm left a wreck on the beach.",
    "features": [
     {
      "category": "CX",
      "letters": "wr",
      "where": "start"
     },
     {
      "category": "CX",
      "letters": "ck",
      "where": "end"
     }
    ]
   },
   {
    "n": 9,
    "word": "worried",
    "sentence": "He worried about the test.",
    "features": [
     {
      "category": "IE",
      "letters": "ied",
      "where": "end"
     }
    ]
   },
   {
    "n": 10,
    "word": "skipping",
    "sentence": "The boys were skipping stones.",
    "features": [
     {
      "category": "IE",
      "letters": "pping",
      "where": "end"
     }
    ]
   },
   {
    "n": 11,
    "word": "brushes",
    "sentence": "Clean the paint brushes.",
    "features": [
     {
      "category": "IE",
      "letters": "shes",
      "where": "end"
     }
    ]
   },
   {
    "n": 12,
    "word": "pumpkin",
    "sentence": "We baked a pumpkin pie.",
    "features": [
     {
      "category": "SJ",
      "letters": "mpk",
      "where": "any"
     }
    ]
   },
   {
    "n": 13,
    "word": "frozen",
    "sentence": "The lake was frozen.",
    "features": [
     {
      "category": "SJ",
      "letters": "froze",
      "where": "start"
     }
    ]
   },
   {
    "n": 14,
    "word": "pillow",
    "sentence": "He fell asleep on his pillow.",
    "features": [
     {
      "category": "SJ",
      "letters": "ll",
      "where": "any"
     }
    ]
   },
   {
    "n": 15,
    "word": "fountain",
    "sentence": "Water sprayed from the fountain.",
    "features": [
     {
      "category": "UF",
      "letters": "tain",
      "where": "end"
     }
    ]
   },
   {
    "n": 16,
    "word": "visitor",
    "sentence": "We had a visitor from Israel.",
    "features": [
     {
      "category": "UF",
      "letters": "tor",
      "where": "end"
     }
    ]
   },
   {
    "n": 17,
    "word": "fossil",
    "sentence": "He found a fossil in the rock.",
    "features": [
     {
      "category": "UF",
      "letters": "sil",
      "where": "end"
     }
    ]
   },
   {
    "n": 18,
    "word": "payment",
    "sentence": "Abba made the last payment.",
    "features": [
     {
      "category": "HS",
      "letters": "ment",
      "where": "end"
     }
    ]
   },
   {
    "n": 19,
    "word": "washable",
    "sentence": "This jacket is washable.",
    "features": [
     {
      "category": "HS",
      "letters": "able",
      "where": "end"
     }
    ]
   },
   {
    "n": 20,
    "word": "edible",
    "sentence": "Are these berries edible?",
    "features": [
     {
      "category": "HS",
      "letters": "ible",
      "where": "end"
     }
    ]
   },
   {
    "n": 21,
    "word": "exclamation",
    "sentence": "End with an exclamation point.",
    "features": [
     {
      "category": "BR",
      "letters": "clamation",
      "where": "end"
     }
    ]
   },
   {
    "n": 22,
    "word": "repetition",
    "sentence": "Repetition helps you remember.",
    "features": [
     {
      "category": "BR",
      "letters": "petition",
      "where": "end"
     }
    ]
   },
   {
    "n": 23,
    "word": "permission",
    "sentence": "Ask permission before you leave.",
    "features": [
     {
      "category": "BR",
      "letters": "mission",
      "where": "end"
     }
    ]
   },
   {
    "n": 24,
    "word": "musician",
    "sentence": "The musician played the violin.",
    "features": [
     {
      "category": "BR",
      "letters": "sician",
      "where": "end"
     }
    ]
   },
   {
    "n": 25,
    "word": "condemn",
    "sentence": "The rav did not condemn him; he taught him.",
    "features": [
     {
      "category": "BR",
      "letters": "mn",
      "where": "end"
     }
    ]
   },
   {
    "n": 26,
    "word": "publicize",
    "sentence": "We will publicize the event.",
    "features": [
     {
      "category": "BR",
      "letters": "licize",
      "where": "end"
     }
    ]
   }
  ]
 },
 "spelling_rules": {
  "stop_after_misspelled": 6,
  "k1_max_words": 15,
  "max_words": 26,
  "switch_upper_to_primary_if_missed_of_first6": 4,
  "stage_threshold": 0.6666666666666666,
  "early_below": 0.3333333333333333
 },
 "copy": {
  "K-1": {
   "A": "I can see the big red sun.",
   "B": "The cat sat on my hat."
  },
  "2-3": {
   "A": "My brother and I fixed the old blue wagon.",
   "B": "We picked six green apples from the tree."
  },
  "4-5": {
   "A": "The quick brown fox jumps over the lazy dog.",
   "B": "The job requires extra pluck and zeal from every young wage earner."
  },
  "6-8": {
   "A": "Jack quietly moved up front and seized the big ball of wax.",
   "B": "Zev quickly packed six brown jugs of water for the hot morning ride."
  }
 },
 "tiles": {
  "K-1": {
   "A": [
    [
     "The",
     "dog",
     "ran",
     "."
    ],
    [
     "I",
     "see",
     "a",
     "cat",
     "."
    ],
    [
     "We",
     "like",
     "to",
     "play",
     "."
    ]
   ],
   "B": [
    [
     "The",
     "sun",
     "is",
     "hot",
     "."
    ],
    [
     "My",
     "hat",
     "is",
     "red",
     "."
    ],
    [
     "He",
     "can",
     "jump",
     "high",
     "."
    ]
   ]
  },
  "2-3": {
   "A": [
    [
     "The",
     "boys",
     "played",
     "ball",
     "after",
     "lunch",
     "."
    ],
    [
     "Where",
     "is",
     "my",
     "new",
     "siddur",
     "?"
    ],
    [
     "Abba",
     "baked",
     "two",
     "challahs",
     "for",
     "Shabbos",
     "."
    ]
   ],
   "B": [
    [
     "The",
     "bus",
     "stopped",
     "at",
     "the",
     "corner",
     "."
    ],
    [
     "Can",
     "you",
     "help",
     "me",
     "find",
     "my",
     "shoe",
     "?"
    ],
    [
     "Zeidy",
     "told",
     "us",
     "a",
     "funny",
     "story",
     "."
    ]
   ]
  },
  "4-5": {
   "A": [
    [
     "When",
     "the",
     "bell",
     "rang",
     ",",
     "the",
     "boys",
     "lined",
     "up",
     "."
    ],
    [
     "My",
     "cousin",
     ",",
     "who",
     "lives",
     "in",
     "Toronto",
     ",",
     "visited",
     "us",
     "."
    ],
    [
     "We",
     "wanted",
     "to",
     "swim",
     ",",
     "but",
     "the",
     "pool",
     "was",
     "closed",
     "."
    ]
   ],
   "B": [
    [
     "After",
     "davening",
     ",",
     "we",
     "ate",
     "a",
     "big",
     "breakfast",
     "."
    ],
    [
     "The",
     "puppy",
     ",",
     "which",
     "was",
     "tiny",
     ",",
     "barked",
     "loudly",
     "."
    ],
    [
     "I",
     "studied",
     "hard",
     ",",
     "so",
     "I",
     "felt",
     "ready",
     "for",
     "the",
     "test",
     "."
    ]
   ]
  },
  "6-8": {
   "A": [
    [
     "Although",
     "the",
     "path",
     "was",
     "steep",
     ",",
     "the",
     "hikers",
     "kept",
     "climbing",
     "."
    ],
    [
     "The",
     "sefer",
     "that",
     "I",
     "borrowed",
     "from",
     "the",
     "library",
     "is",
     "overdue",
     "."
    ],
    [
     "Because",
     "the",
     "storm",
     "knocked",
     "out",
     "the",
     "power",
     ",",
     "we",
     "used",
     "flashlights",
     "."
    ]
   ],
   "B": [
    [
     "Unless",
     "we",
     "leave",
     "now",
     ",",
     "we",
     "will",
     "miss",
     "the",
     "train",
     "."
    ],
    [
     "The",
     "boy",
     "who",
     "won",
     "the",
     "prize",
     "thanked",
     "his",
     "rebbe",
     "."
    ],
    [
     "Since",
     "the",
     "roads",
     "were",
     "icy",
     ",",
     "school",
     "opened",
     "two",
     "hours",
     "late",
     "."
    ]
   ]
  }
 },
 "tile_alternatives": {
  "4-5.A.1": [
   [
    "The",
    "boys",
    "lined",
    "up",
    "when",
    "the",
    "bell",
    "rang",
    "."
   ]
  ],
  "4-5.B.1": [
   [
    "We",
    "ate",
    "a",
    "big",
    "breakfast",
    "after",
    "davening",
    "."
   ]
  ],
  "6-8.A.1": [
   [
    "The",
    "hikers",
    "kept",
    "climbing",
    "although",
    "the",
    "path",
    "was",
    "steep",
    "."
   ]
  ],
  "6-8.A.3": [
   [
    "We",
    "used",
    "flashlights",
    "because",
    "the",
    "storm",
    "knocked",
    "out",
    "the",
    "power",
    "."
   ]
  ],
  "6-8.B.1": [
   [
    "We",
    "will",
    "miss",
    "the",
    "train",
    "unless",
    "we",
    "leave",
    "now",
    "."
   ]
  ],
  "6-8.B.3": [
   [
    "School",
    "opened",
    "two",
    "hours",
    "late",
    "since",
    "the",
    "roads",
    "were",
    "icy",
    "."
   ]
  ],
  "2-3.A.3": [
   [
    "For",
    "Shabbos",
    ",",
    "Abba",
    "baked",
    "two",
    "challahs",
    "."
   ]
  ],
  "2-3.A.1": [
   [
    "After",
    "lunch",
    ",",
    "the",
    "boys",
    "played",
    "ball",
    "."
   ]
  ]
 },
 "tile_codes": {
  "ORDER-WORD": "words out of order",
  "ORDER-CAP": "capitalized word not first",
  "ORDER-PUNCT": "end mark or comma misplaced"
 },
 "prompts": {
  "K-2": {
   "A": {
    "genre": "narrative",
    "minutes": 3,
    "art": "A boy about six in a yarmulke and tzitzis kneels in a backyard, looking surprised at a small turtle that has crawled out from under a bush. A watering can lies tipped over beside him. Sunny day.",
    "say": "Look at the picture. What is happening? Write a story about the boy and the turtle. Tell what happens first, next, and at the end."
   },
   "B": {
    "genre": "informative",
    "minutes": 3,
    "art": "Two boys and their father in a kitchen braiding challah dough on a floured table. A bowl, a rolling pin and an egg wash brush are on the table. Warm light.",
    "say": "Look at the picture. Write about how to make challah, or about a time you helped make something. Tell the steps in order."
   }
  },
  "3-5": {
   "A": {
    "genre": "narrative",
    "minutes": 5,
    "art": "A boy about ten stands on the shore of a lake at sunset holding a fishing rod that is bent sharply, as if something big is on the line. His older brother runs toward him from a picnic blanket. A small wooden dock.",
    "say": "Look at the picture. Write a story about what happens next. Give your story a beginning, a middle and an end, and show how the characters feel."
   },
   "B": {
    "genre": "opinion",
    "minutes": 5,
    "art": "A classroom where boys are voting with raised hands. On the whiteboard: two choices drawn as pictures, a soccer ball and a book with a magnifying glass (a reading club). A rebbe stands smiling at the side.",
    "say": "The class is voting: a soccer league or a reading club. Which would you choose? Write your opinion and give at least two reasons."
   }
  },
  "6-8": {
   "A": {
    "genre": "argument",
    "minutes": 5,
    "art": "A city street where a new playground is half built. On a fence, a sign shows two plans: a playground with swings, or a parking lot. Several men and boys look at the sign; one father points at the plans while talking to his son.",
    "say": "The city must choose: finish the playground, or turn the space into a parking lot. Which is the better choice? Take a side, give reasons and evidence, and answer one argument from the other side."
   },
   "B": {
    "genre": "explanatory",
    "minutes": 5,
    "art": "A boy about thirteen at a workbench in a garage, repairing a bicycle that is upside down. Tools are laid out neatly: a wrench, a tire lever, a pump and a patch kit. A punctured inner tube is in a bucket of water with bubbles rising.",
    "say": "Look at the picture. Explain how to fix a flat bicycle tire, or explain how to do another job you know well. Make the steps clear enough that someone could follow them."
   }
  }
 },
 "rubric": {
  "Ideas": {
   "K-2": [
    "No clear message, or just a label or list",
    "A topic, with one or two simple details",
    "A clear topic or event with some details that fit",
    "A clear, focused message with several fitting, interesting details"
   ],
   "3-5": [
    "Little or no clear main idea; off the prompt",
    "A main idea, but details are thin or general",
    "A clear main idea, supported by relevant details",
    "A focused, engaging main idea with well-chosen, specific details"
   ],
   "6-8": [
    "No clear claim, focus or point",
    "A general claim or focus; support is thin or off-topic",
    "A clear claim or focus with relevant reasons and evidence",
    "A precise claim or focus; strong, specific evidence; addresses another view when asked"
   ]
  },
  "Organization": {
   "K-2": [
    "Ideas are scattered",
    "Some order, but parts are missing",
    "A beginning and an end; events or steps in order",
    "Clear beginning, middle and end; uses order words (first, next, then)"
   ],
   "3-5": [
    "No clear order",
    "Some order; weak or missing beginning or ending",
    "Logical order with a beginning and an ending; some linking words",
    "Smooth, logical order; strong opening and closing; varied linking words"
   ],
   "6-8": [
    "No structure",
    "Some structure; paragraphs or transitions unclear",
    "Clear structure; paragraphs; transitions connect ideas",
    "Purposeful structure; strong transitions; conclusion follows from the body"
   ]
  },
  "Sentences": {
   "K-2": [
    "Words or phrases, not sentences",
    "Some complete simple sentences",
    "Mostly complete sentences; some variety",
    "Complete sentences that begin in different ways"
   ],
   "3-5": [
    "Many fragments or run-ons",
    "Mostly simple sentences; some errors in sentence structure",
    "Complete sentences with some variety in length and type",
    "Varied, fluent sentences, including compound and complex ones"
   ],
   "6-8": [
    "Frequent fragments or run-ons",
    "Repetitive patterns; some errors",
    "Varied sentences; mostly fluent and correct",
    "Skillfully varied, precise sentences that suit the purpose"
   ]
  },
  "Conventions": {
   "K-2": [
    "Spelling and marks make it hard to read",
    "Some correct capitals and end marks; spells by sounds",
    "Mostly correct capitals and end marks; common words spelled right",
    "Capitals, end marks and grade-level words almost always correct"
   ],
   "3-5": [
    "Errors make it hard to read",
    "Frequent errors in spelling, capitals or punctuation",
    "Some errors, but they do not get in the way of meaning",
    "Few errors; correct use of commas, quotation marks and grade-level spelling"
   ],
   "6-8": [
    "Errors make it hard to read",
    "Frequent errors that distract the reader",
    "Minor errors that do not distract",
    "Nearly error-free; punctuation used for effect"
   ]
  }
 }
};/*</W1>*/
