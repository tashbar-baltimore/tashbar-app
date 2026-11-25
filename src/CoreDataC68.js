/* CoreDataC68.js: Core Growth job C68, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js C68 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.C68 = [
  ["READ.COMP.L08.10", "Set His View Apart", "See how an author sets his view apart from others' views", { after: "READ.LIT.L08.02", std: "RI.7.6", file: "CoreDataC68H1", min: 9 }],
  ["READ.LIT.L08.09", "Story and History", "Compare a story and a history of the same events", { std: "RL.7.9", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.11", "Read It, Hear It", "Compare reading a text with hearing it read: what each one does", { std: "RI.7.7", file: "CoreDataC68H1", min: 9 }],
  ["READ.LIT.L09.09", "Dramatic Irony", "When we know more than the character: spot it and say what it does", { after: "READ.LIT.L09.01", std: "RL.8.6", file: "CoreDataC68H2", min: 9 }],
  ["READ.COMP.L09.14", "Answer the Other Side", "How an author states, concedes and refutes the other side", { std: "RI.8.6", file: "CoreDataC68H2", min: 9 }],
  ["READ.LIT.L09.10", "Watson Tells It", "How the narrator shapes a mystery: what he sees and what he misses", { std: "RL.8.6", file: "CoreDataC68H2", min: 9 }],
  ["READ.FLU.L09.02", "Theatre: A Mystery Scene", "Read a mystery scene aloud with timing, voice and cues", { std: "SL.8.6", file: "CoreDataC68H2", min: 10 }]
];
/* Data files that upgrade EXISTING skills to One Bite lessons (TLCORE.upgrade; docs/core-growth/HOW-TO-ADD-A-SKILL.md). */
var CORE_DATA_FILES = (typeof CORE_DATA_FILES !== 'undefined' && CORE_DATA_FILES) || {};
CORE_DATA_FILES.C68 = ['CoreDataC68H1', 'CoreDataC68H2'];
