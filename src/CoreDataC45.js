/* CoreDataC45.js: Core Growth job C45, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js C45 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.C45 = [
  ["READ.COMP.L05.05", "Where Does the Answer Live?", "Tell right-there answers from think-and-search answers", { after: "READ.COMP.L05.01", std: "RI.4.1", file: "CoreDataC451", min: 8 }],
  ["READ.COMP.L05.06", "Prove It!", "Tap the sentence that proves an answer", { std: "RI.4.1", file: "CoreDataC451", min: 8 }],
  ["READ.COMP.L05.07", "Quote It or Say It", "Quote the text exactly or say it in your own words", { std: "RI.4.1", file: "CoreDataC451", min: 8 }],
  ["READ.COMP.L05.08", "Inference Ladder", "Clue plus what I know makes an inference", { std: "RL.4.1", file: "CoreDataC451", min: 8 }],
  ["READ.COMP.L05.09", "Feelings Detective", "Figure out how a character feels without a feeling word", { std: "RL.4.3", file: "CoreDataC451", min: 8 }],
  ["READ.FLU.L05.02", "Long Word Breaker", "Break a long word into beats to read it", { after: "READ.COMP.L05.09", std: "RF.4.3a", file: "CoreDataC451", min: 8 }]
];
