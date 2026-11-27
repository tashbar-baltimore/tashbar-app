/* CoreDataW13.js: Core Growth job W13, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js W13 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.W13 = [
  ["WRIT.ESSAY.L03.01", "POW Power", "Plan a piece with POW: pick my idea, organize my notes, write and say more", { before: "WRIT.SENT.L03.01", std: "W.2.5", file: "CoreDataW131", min: 8 }],
  ["WRIT.PARA.L03.04", "Topic Sentence", "Write a first sentence that tells what the paragraph is about", { after: "WRIT.ESSAY.L03.01", std: "W.2.2", file: "CoreDataW131", min: 7 }],
  ["WRIT.PARA.L03.05", "Keep It or Cut It", "Keep the details that belong and cut the one that does not", { after: "WRIT.PARA.L03.04", std: "W.2.2", file: "CoreDataW131", min: 7 }],
  ["WRIT.PARA.L03.06", "Closing Sentence", "End a paragraph by saying the main idea again in new words", { after: "WRIT.PARA.L03.05", std: "W.2.2", file: "CoreDataW131", min: 7 }],
  ["WRIT.PARA.L04.02", "Hook the Reader", "Open a paragraph with a hook: a question, a surprising fact or a sound", { after: "WRIT.PARA.L04.01", std: "W.3.2a", file: "CoreDataW132", min: 7 }],
  ["WRIT.PARA.L04.03", "Details That Prove", "Choose details that really prove the topic sentence, not vague ones", { after: "WRIT.PARA.L04.02", std: "W.3.2b", file: "CoreDataW132", min: 7 }],
  ["WRIT.PARA.L04.04", "Strong Close", "End with a closing that says the big idea a new way and leaves a final thought", { after: "WRIT.PARA.L04.03", std: "W.3.2d", file: "CoreDataW132", min: 7 }],
  ["WRIT.PARA.L01.01", "Plan with a Picture", "Draw first to plan what to say", { before: "WRIT.SENT.L01.01", std: "W.K.3", file: "CoreDataW133", min: 5 }],
  ["WRIT.PARA.L01.02", "Tell a Friend First", "Say the sentence out loud before writing it", { after: "WRIT.PARA.L01.01", std: "SL.K.6", file: "CoreDataW133", min: 5 }],
  ["WRIT.PARA.L01.03", "Picture and Words Match", "Make the words tell about the picture", { after: "WRIT.PARA.L01.02", std: "W.K.2", file: "CoreDataW133", min: 5 }],
  ["WRIT.PARA.L01.04", "Tell Me More", "Add a detail: tell more about the picture", { after: "WRIT.PARA.L01.03", std: "W.K.5", file: "CoreDataW133", min: 5 }],
  ["WRIT.PARA.L02.01", "Pick a Topic", "Choose a topic he knows a lot about", { before: "WRIT.SENT.L02.01", std: "W.1.3", file: "CoreDataW134", min: 5 }],
  ["WRIT.PARA.L02.02", "Plan in Boxes", "Plan a piece in three picture boxes before writing", { after: "WRIT.PARA.L02.01", std: "W.1.3", file: "CoreDataW134", min: 5 }],
  ["WRIT.SENT.L02.02", "Say, Write, Read Back", "Say the sentence, write it, then read it back to catch a missing word", { after: "WRIT.PARA.L02.02", std: "W.1.5", file: "CoreDataW134", min: 5 }],
  ["WRIT.PARA.L02.03", "Stay on Topic", "Keep every sentence about his topic", { after: "WRIT.SENT.L02.02", std: "W.1.2", file: "CoreDataW134", min: 5 }],
  ["WRIT.PARA.L01.05", "Label It", "Label the parts of his picture with words he sounds out", { after: "WRIT.PARA.L01.04", std: "W.K.2", file: "CoreDataW135", min: 5 }],
  ["WRIT.PARA.L01.06", "Caption It", "Add a caption that tells what is happening in his picture", { after: "WRIT.PARA.L01.05", std: "W.K.2", file: "CoreDataW135", min: 5 }],
  ["WRIT.SENT.L01.02", "Word by Word", "Write a sentence one word at a time, saying each word", { after: "WRIT.SENT.L01.01", std: "W.K.2", file: "CoreDataW135", min: 5 }],
  ["WRIT.SENT.L01.03", "Point and Read", "Read his sentence back pointing to each word, and fix a missing word", { after: "WRIT.SENT.L01.02", std: "W.K.5", file: "CoreDataW135", min: 4 }],
  ["WRIT.PARA.L02.04", "Zoom In", "Write about one small moment, not the whole day", { after: "WRIT.SENT.L02.01", std: "W.1.3", file: "CoreDataW136", min: 5 }],
  ["WRIT.PARA.L02.05", "Time Words", "Use time words: first, then, after that, at the end", { after: "WRIT.PARA.L02.04", std: "W.1.3", file: "CoreDataW136", min: 5 }],
  ["WRIT.PARA.L02.06", "Feeling Ending", "End a story with how it felt or what he learned", { after: "WRIT.PARA.L02.05", std: "W.1.3", file: "CoreDataW136", min: 5 }],
  ["WRIT.ESSAY.L04.03", "TIDE Plan", "Plan an information piece with TIDE: Topic, Important details, Ending", { after: "WRIT.PARA.L04.04", std: "W.3.2", file: "CoreDataW13H1", min: 8 }],
  ["WRIT.ESSAY.L04.04", "Group the Facts", "Group facts that go together, and add a picture with a caption", { std: "W.3.2a", file: "CoreDataW13H1", min: 7 }],
  ["WRIT.PARA.L04.14", "Facts, Definitions, Details", "Build the topic with facts, definitions and details", { std: "W.3.2b", file: "CoreDataW13H1", min: 7 }],
  ["WRIT.PARA.L04.15", "Fact Linking Words", "Link facts with also, another, and, more and but", { std: "W.3.2c", file: "CoreDataW13H1", min: 7 }],
  ["WRIT.PARA.L04.16", "Concluding Section", "End an information piece with a strong concluding section", { std: "W.3.2d", file: "CoreDataW13H1", min: 7 }],
  ["WRIT.RES.L04.01", "Good Question", "Ask a research question he can answer by reading", { after: "WRIT.PARA.L04.16", std: "W.3.7", file: "CoreDataW13H2", min: 7 }],
  ["WRIT.RES.L04.02", "Notes, Not Copies", "Take notes in his own words: a few key words that answer the question", { std: "W.3.8", file: "CoreDataW13H2", min: 7 }],
  ["WRIT.RES.L04.03", "Sort My Notes", "Sort notes into groups with headings, one paragraph for each group", { std: "W.3.8", file: "CoreDataW13H2", min: 7 }],
  ["WRIT.RES.L04.04", "Where I Found It", "Name the source of his facts: the title and the author", { std: "W.3.8", file: "CoreDataW13H2", min: 6 }],
  ["WRIT.ESSAY.L04.05", "ARMS Revise", "Revise with ARMS: Add, Remove, Move, Substitute", { after: "WRIT.RES.L04.04", std: "W.3.5", file: "CoreDataW13H3", min: 8 }],
  ["WRIT.ESSAY.L04.06", "COPS Edit", "Edit with COPS: Capitals, Order of the words, Punctuation, Spelling", { std: "W.3.5", file: "CoreDataW13H3", min: 7 }],
  ["WRIT.PARA.L04.17", "Letter to a Reader", "Write a letter with all its parts, in words that fit who will read it", { std: "W.3.4", file: "CoreDataW13H3", min: 7 }],
  ["WRIT.ESSAY.L03.05", "Add and Cut", "Revise a draft: add a detail that helps the reader see it, and cut what does not fit", { after: "WRIT.SENT.L03.01", std: "W.2.5", file: "CoreDataW13H4", min: 7 }],
  ["WRIT.ESSAY.L03.06", "CUPS Check", "Edit with CUPS: Capitals, Usage, Punctuation, Spelling", { std: "W.2.5", file: "CoreDataW13H4", min: 7 }],
  ["WRIT.ESSAY.L03.07", "Read It Like a Reader", "Read his writing out loud, pointing to each word, to catch missing and extra words", { std: "W.2.5", file: "CoreDataW13H4", min: 7 }],
  ["WRIT.PARA.L03.15", "Friendly Letter", "Write a friendly letter with all five parts: date, greeting, body, closing, name", { after: "WRIT.ESSAY.L03.07", std: "L.2.2b", file: "CoreDataW13H5", min: 7 }],
  ["WRIT.RES.L03.01", "Find It in a Book", "Find the answer to a question in a book: key word, look, check", { std: "W.2.8", file: "CoreDataW13H5", min: 7 }],
  ["WRIT.RES.L03.02", "Fact Notes", "Take notes as a few key words, not whole copied sentences", { std: "W.2.8", file: "CoreDataW13H5", min: 7 }],
  ["WRIT.PARA.L03.16", "Book Response", "Tell his opinion of a book and prove it with a detail from the book", { std: "W.2.1", file: "CoreDataW13H5", min: 7 }],
  ["WRIT.ESSAY.L04.01", "POW + WWW", "Plan a story with POW and the W-W-W questions", { before: "WRIT.ESSAY.L04.03", std: "W.3.3", file: "CoreDataW13H6", min: 8 }],
  ["WRIT.PARA.L04.05", "Set the Scene", "Start a story with the character, the place and the problem", { after: "WRIT.ESSAY.L04.01", std: "W.3.3a", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.PARA.L04.06", "Talking Characters", "Let characters talk, with quotation marks around their exact words", { after: "WRIT.PARA.L04.05", std: "W.3.3b", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.PARA.L04.07", "Show the Feeling", "Show a feeling with what a character does and thinks", { after: "WRIT.PARA.L04.06", std: "W.3.3b", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.PARA.L04.08", "Then, Later, Finally", "Tell events in order with time words", { after: "WRIT.PARA.L04.07", std: "W.3.3c", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.PARA.L04.09", "Wrap the Story", "End a story so the problem is solved and the reader feels it is finished", { after: "WRIT.PARA.L04.08", std: "W.3.3d", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.ESSAY.L04.02", "TREE Plan", "Plan an opinion piece with TREE: Topic sentence, Reasons, Explain, Ending", { after: "WRIT.PARA.L04.09", std: "W.3.1", file: "CoreDataW13H6", min: 8 }],
  ["WRIT.PARA.L04.10", "Introduce the Topic", "Open an opinion piece by naming the topic and stating his opinion", { after: "WRIT.ESSAY.L04.02", std: "W.3.1a", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.PARA.L04.11", "Reasons That Support", "Give reasons that really support the opinion", { after: "WRIT.PARA.L04.10", std: "W.3.1b", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.PARA.L04.12", "Linking Words", "Link opinion and reasons with because, therefore, since and for example", { after: "WRIT.PARA.L04.11", std: "W.3.1c", file: "CoreDataW13H6", min: 7 }],
  ["WRIT.PARA.L04.13", "Concluding Statement", "End an opinion piece with a strong concluding statement", { after: "WRIT.PARA.L04.12", std: "W.3.1d", file: "CoreDataW13H6", min: 7 }]
];

/* W13 helper data files with no skill rows of their own (they load with the boy's page): Grade 2-3 quick writes. */
var CORE_DATA_FILES = (typeof CORE_DATA_FILES !== 'undefined' && CORE_DATA_FILES) || {};
CORE_DATA_FILES.W13 = ['CoreDataW13H7'];
