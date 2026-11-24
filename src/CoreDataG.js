/* CoreDataG.js: Core Growth job G, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js G ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.G = [
  ["LANG.SENT.L03.02", "Because, But, So", "Finish one idea three ways with because, but and so", { after: "LANG.SENT.L03.01", std: "L.2.1f", file: "CoreDataG1", min: 8 }],
  ["LANG.SENT.L03.03", "Grow It", "Grow a kernel sentence with when and where", { std: "L.2.1f", file: "CoreDataG1", min: 7 }],
  ["LANG.SENT.L03.04", "Switch It Around", "Move the when part to the front, with a comma", { std: "L.2.1f", file: "CoreDataG1", min: 7 }],
  ["LANG.SENT.L04.01", "Simple, Compound, Complex", "Tell the three kinds of sentences apart", { after: "WRIT.SENT.L04.01", std: "L.3.1i", file: "CoreDataG1", min: 8 }],
  ["LANG.SENT.L04.02", "When, If, Since", "Join ideas with when, if, since, before and after", { std: "L.3.1h", file: "CoreDataG1", min: 8 }],
  ["LANG.SENT.L04.03", "Fix the Run-On", "Fix a run-on: split it or join it", { std: "L.3.1i", file: "CoreDataG1", min: 7 }],
  ["LANG.SENT.L04.04", "Combine Two", "Combine two short sentences into one strong one", { std: "L.3.3a", file: "CoreDataG1", min: 8 }],
  ["LANG.SENT.L05.01", "Fragment or Sentence?", "Find and fix fragments with three tests", { after: "LANG.MECH.L05.01", std: "L.4.1f", file: "CoreDataG1", min: 8 }],
  ["LANG.SENT.L05.02", "Who, Which, That", "Combine sentences with who, which and that", { std: "L.4.1a", file: "CoreDataG1", min: 9 }],
  ["LANG.SENT.L05.03", "Add a Phrase", "Expand a sentence with a prepositional phrase", { std: "L.4.1e", file: "CoreDataG1", min: 8 }],
  ["LANG.SENT.L06.01", "Combine to One", "Combine sentences three ways", { after: "LANG.GRAM.L06.01", std: "L.5.3a", file: "CoreDataG1", min: 9 }],
  ["LANG.SENT.L06.02", "Appositive", "Add an appositive with a comma on each side", { std: "L.5.3a", file: "CoreDataG1", min: 9 }],
  ["LANG.SENT.L06.03", "Cut It Down", "Cut a wordy sentence without losing the meaning", { std: "L.5.3a", file: "CoreDataG1", min: 8 }],
  ["LANG.GRAM.L07.02", "Myself for Emphasis", "Intensive pronouns, and never myself for I or me", { after: "LANG.GRAM.L07.01", std: "L.6.1b", file: "CoreDataG2", min: 7 }],
  ["LANG.GRAM.L07.03", "Stay in Person", "Fix shifts in pronoun person and number", { std: "L.6.1c", file: "CoreDataG2", min: 8 }],
  ["LANG.GRAM.L08.03", "Phrase or Clause?", "Tell a phrase from a clause and what each does", { before: "LANG.GRAM.L08.01", std: "L.7.1a", file: "CoreDataG2", min: 9 }],
  ["LANG.SENT.L08.01", "Compound-Complex", "Build sentences that show how ideas connect", { after: "LANG.GRAM.L08.01", std: "L.7.1b", file: "CoreDataG2", min: 9 }],
  ["LANG.GRAM.L09.02", "Gerunds", "Spot an -ing word used as a noun", { before: "LANG.GRAM.L09.01", std: "L.8.1a", file: "CoreDataG2", min: 9 }],
  ["LANG.GRAM.L09.03", "Participles", "Use a verb form to describe, without a dangle", { std: "L.8.1a", file: "CoreDataG2", min: 9 }],
  ["LANG.GRAM.L09.04", "Infinitives", "Spot to + verb and the job it does", { std: "L.8.1a", file: "CoreDataG2", min: 8 }]
];
