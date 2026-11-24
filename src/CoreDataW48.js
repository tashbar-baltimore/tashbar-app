/* CoreDataW48.js: Core Growth job W48, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js W48 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.W48 = [
  ["WRIT.PARA.L05.06", "Umbrella Sentence", "Write a topic sentence that covers every detail", { before: "WRIT.PARA.L05.01", std: "W.4.2a", file: "CoreDataW481", min: 8 }],
  ["WRIT.PARA.L05.07", "Belongs or Not?", "Keep every detail on the topic and cut the one that wanders", { after: "WRIT.PARA.L05.06", std: "W.4.2a", file: "CoreDataW481", min: 7 }],
  ["WRIT.PARA.L05.08", "Say More", "Stretch a detail with an example or a fact", { after: "WRIT.PARA.L05.07", std: "W.4.2b", file: "CoreDataW481", min: 8 }],
  ["WRIT.PARA.L05.09", "Tie It Up", "Write a closing sentence that says the big idea a new way", { after: "WRIT.PARA.L05.01", std: "W.4.2e", file: "CoreDataW481", min: 7 }],
  ["WRIT.ESSAY.L06.02", "Hook the Reader", "Open a piece with a question, a surprising fact or a short scene", { after: "WRIT.ESSAY.L06.01", std: "W.5.2a", file: "CoreDataW482", min: 8 }],
  ["WRIT.ESSAY.L06.03", "Point, Proof, Explain", "Build a body paragraph: a point, proof, and how the proof shows it", { after: "WRIT.ESSAY.L06.02", std: "W.5.2b", file: "CoreDataW482", min: 9 }],
  ["WRIT.ESSAY.L06.04", "Strong Finish", "End a piece by restating the big idea and leaving a final thought", { after: "WRIT.ESSAY.L06.03", std: "W.5.2e", file: "CoreDataW482", min: 8 }],
  ["WRIT.PARA.L06.03", "Who Is Reading?", "Choose words that fit the reader: a friend, a teacher or a little brother", { after: "WRIT.ESSAY.L06.04", std: "W.5.4", file: "CoreDataW482", min: 7 }],
  ["WRIT.ESSAY.L07.04", "Best Evidence", "Choose evidence that is relevant and credible", { after: "WRIT.ESSAY.L07.01", std: "W.6.1b", file: "CoreDataW483", min: 9 }],
  ["WRIT.PARA.L07.01", "Glue Words", "Link claim, reasons and proof with the right glue words", { after: "WRIT.ESSAY.L07.02", std: "W.6.1c", file: "CoreDataW483", min: 8 }],
  ["WRIT.PARA.L07.02", "Formal Voice", "Write an argument in a formal voice: no slang, no shouting, exact words", { after: "WRIT.PARA.L07.01", std: "W.6.1d", file: "CoreDataW483", min: 8 }],
  ["WRIT.PARA.L07.03", "Close the Case", "End an argument: claim with force, strongest reason, call to action", { after: "WRIT.PARA.L07.02", std: "W.6.1e", file: "CoreDataW483", min: 8 }],
  ["WRIT.PARA.L08.01", "Logical Steps", "Show the reasoning from reason to conclusion and spot a gap", { after: "WRIT.ESSAY.L08.02", std: "W.7.1b", file: "CoreDataW484", min: 9 }],
  ["WRIT.PARA.L08.02", "Check the Source", "Check a source: does the writer know, is it up to date, does it gain", { after: "WRIT.PARA.L08.01", std: "W.7.8", file: "CoreDataW484", min: 8 }],
  ["WRIT.PARA.L08.03", "Counter Glue", "Bring in the strongest other side fairly, then answer it", { after: "WRIT.PARA.L08.02", std: "W.7.1c", file: "CoreDataW484", min: 8 }],
  ["WRIT.PARA.L08.04", "Qualify Your Claim", "Make the claim exactly as big as the evidence", { after: "WRIT.PARA.L08.03", std: "W.7.1b", file: "CoreDataW484", min: 8 }],
  ["WRIT.ESSAY.L09.02", "Claim vs Counterclaim", "Tell your claim from the other side, and state the other side fairly at its strongest", { before: "WRIT.RES.L09.01", std: "W.8.1a", file: "CoreDataW485", min: 9 }],
  ["WRIT.ESSAY.L09.03", "Rebuttal", "Answer a counterclaim: show it is mistaken, show it matters less, or concede and outweigh", { after: "WRIT.ESSAY.L09.02", std: "W.8.1a", file: "CoreDataW485", min: 9 }],
  ["WRIT.PARA.L09.01", "Spot the Weak Link", "Name the weak link in an argument: overgeneralizing, false cause, attacking the person, either-or", { after: "WRIT.ESSAY.L09.03", std: "W.8.1b", file: "CoreDataW485", min: 9 }],
  ["WRIT.PARA.L09.02", "Evidence Ladder", "Rank evidence from a single story up to several careful sources that agree", { after: "WRIT.PARA.L09.01", std: "W.8.1b", file: "CoreDataW485", min: 8 }]
];
