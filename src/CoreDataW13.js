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
  ["WRIT.PARA.L04.16", "Concluding Section", "End an information piece with a strong concluding section", { std: "W.3.2d", file: "CoreDataW13H1", min: 7 }]
];
