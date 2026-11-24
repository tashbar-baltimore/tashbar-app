/* CoreDataW48.js: Core Growth job W48, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js W48 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.W48 = [
  ["WRIT.PARA.L05.06", "Umbrella Sentence", "Write a topic sentence that covers every detail", { before: "WRIT.PARA.L05.01", std: "W.4.2a", file: "CoreDataW481", min: 8 }],
  ["WRIT.PARA.L05.07", "Belongs or Not?", "Keep every detail on the topic and cut the one that wanders", { after: "WRIT.PARA.L05.06", std: "W.4.2a", file: "CoreDataW481", min: 7 }],
  ["WRIT.PARA.L05.08", "Say More", "Stretch a detail with an example or a fact", { after: "WRIT.PARA.L05.07", std: "W.4.2b", file: "CoreDataW481", min: 8 }],
  ["WRIT.PARA.L05.09", "Tie It Up", "Write a closing sentence that says the big idea a new way", { after: "WRIT.PARA.L05.01", std: "W.4.2e", file: "CoreDataW481", min: 7 }]
];
