/* CoreDataC23.js: Core Growth job C23, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js C23 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.C23 = [
  ["READ.COMP.L03.04", "Ask As You Read", "Ask questions before and while you read, then read on to find the answers", { before: "READ.LIT.L03.01", std: "RL.2.1", file: "CoreDataC231", min: 8 }],
  ["READ.COMP.L03.05", "Who, What, Where, When", "Find who, what, where and when in a story", { std: "RL.2.1", file: "CoreDataC231", min: 8 }],
  ["READ.COMP.L03.06", "Why and How", "Answer why and how questions with the words of the story", { std: "RL.2.1", file: "CoreDataC231", min: 8 }]
];
/* Data files that upgrade EXISTING skills to One Bite lessons (TLCORE.upgrade; docs/core-growth/HOW-TO-ADD-A-SKILL.md). */
var CORE_DATA_FILES = (typeof CORE_DATA_FILES !== 'undefined' && CORE_DATA_FILES) || {};
CORE_DATA_FILES.C23 = ['CoreDataC231'];
