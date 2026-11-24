/* CoreDataW13.js: Core Growth job W13, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js W13 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.W13 = [
  ["WRIT.ESSAY.L03.01", "POW Power", "Plan a piece with POW: pick my idea, organize my notes, write and say more", { before: "WRIT.SENT.L03.01", std: "W.2.5", file: "CoreDataW131", min: 8 }],
  ["WRIT.PARA.L03.04", "Topic Sentence", "Write a first sentence that tells what the paragraph is about", { after: "WRIT.ESSAY.L03.01", std: "W.2.2", file: "CoreDataW131", min: 7 }],
  ["WRIT.PARA.L03.05", "Keep It or Cut It", "Keep the details that belong and cut the one that does not", { after: "WRIT.PARA.L03.04", std: "W.2.2", file: "CoreDataW131", min: 7 }],
  ["WRIT.PARA.L03.06", "Closing Sentence", "End a paragraph by saying the main idea again in new words", { after: "WRIT.PARA.L03.05", std: "W.2.2", file: "CoreDataW131", min: 7 }]
];
