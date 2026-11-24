/* CoreDataF.js: Core Growth job F, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js F ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.F = [
  ["READ.PHON.L03.04", "Open Door, Closed Door", "Tell open from closed syllables and read the vowel right", { before: "READ.PHON.L03.01", std: "RF.2.3a", file: "CoreDataF1", min: 7 }],
  ["READ.PHON.L03.05", "Slide the Line", "Split a word with one middle consonant, and slide the line when needed", { after: "READ.PHON.L03.01", std: "RF.2.3c", file: "CoreDataF1", min: 7 }],
  ["READ.PHON.L03.06", "Silent E in Long Words", "Read long words that have a silent e part", { after: "READ.PHON.L03.05", std: "RF.2.3c", file: "CoreDataF1", min: 7 }]
];
