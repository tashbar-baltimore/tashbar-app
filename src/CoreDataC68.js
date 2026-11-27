/* CoreDataC68.js: Core Growth job C68, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js C68 ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.C68 = [
  ["READ.COMP.L08.10", "Set His View Apart", "See how an author sets his view apart from others' views", { after: "READ.LIT.L08.02", std: "RI.7.6", file: "CoreDataC68H1", min: 9 }],
  ["READ.LIT.L08.09", "Story and History", "Compare a story and a history of the same events", { std: "RL.7.9", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.11", "Read It, Hear It", "Compare reading a text with hearing it read: what each one does", { std: "RI.7.7", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.12", "Map the Argument", "Trace an argument: claim, reasons and evidence", { std: "RI.7.8", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.13", "Is It Sound?", "Judge whether the reasoning holds up", { std: "RI.7.8", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.14", "Enough Evidence?", "Judge whether the evidence is relevant and enough", { std: "RI.7.8", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.15", "Spot the Trick", "Spot loaded words and one-sided facts", { std: "RI.7.6", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.16", "Agree or Disagree?", "Find where two texts agree and where they disagree", { std: "RI.7.9", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.17", "Put It Together", "Put several texts together to answer one question", { std: "RI.7.9", file: "CoreDataC68H1", min: 10 }],
  ["READ.COMP.L08.18", "Read the Chart", "Read the chart that goes with the article", { std: "RI.7.7", file: "CoreDataC68H1", min: 9 }],
  ["READ.COMP.L08.19", "Long Story Coach", "Read a long story on your own, page by page", { std: "RL.7.10", file: "CoreDataC68H1", min: 10 }],
  ["READ.LIT.L08.10", "How the Parts Fit", "How setting, people and plot change each other", { std: "RL.7.3", file: "CoreDataC68H1", min: 9 }],
  ["READ.LIT.L08.11", "Keep Them Reading", "How an author builds suspense", { std: "RL.7.5", file: "CoreDataC68H1", min: 9 }],
  ["READ.LIT.L08.12", "What the Whole Story Says", "State a theme and prove it from the whole story", { std: "RL.7.2", file: "CoreDataC68H1", min: 9 }],
  ["READ.LIT.L09.09", "Dramatic Irony", "When we know more than the character: spot it and say what it does", { after: "READ.LIT.L09.01", std: "RL.8.6", file: "CoreDataC68H2", min: 9 }],
  ["READ.COMP.L09.14", "Answer the Other Side", "How an author states, concedes and refutes the other side", { std: "RI.8.6", file: "CoreDataC68H2", min: 9 }],
  ["READ.LIT.L09.10", "Watson Tells It", "How the narrator shapes a mystery: what he sees and what he misses", { std: "RL.8.6", file: "CoreDataC68H2", min: 9 }],
  ["READ.FLU.L09.02", "Theatre: A Mystery Scene", "Read a mystery scene aloud with timing, voice and cues", { std: "SL.8.6", file: "CoreDataC68H2", min: 10 }],
  ["READ.COMP.L09.15", "Evidence That Does Not Belong", "Spot evidence that is true but does not support the claim", { after: "READ.COMP.L09.01", std: "RI.8.8", file: "CoreDataC68H2", min: 9 }],
  ["READ.COMP.L09.16", "Same Facts, Different Reading", "Two writers read the same facts differently: judge which reading fits", { after: "READ.COMP.L09.03", std: "RI.8.9", file: "CoreDataC68H2", min: 9 }],
  ["READ.FLU.L09.04", "Read It Twice", "Read a dense paragraph twice: once for sense, once for detail", { std: "RI.8.10", file: "CoreDataC68H2", min: 9 }],
  ["READ.COMP.L09.17", "Print, Video or Chart?", "Choose the form that tells it best: print, video or chart", { after: "READ.COMP.L09.02", std: "RI.8.7", file: "CoreDataC68H2", min: 9 }],
  ["READ.COMP.L09.18", "News or Opinion?", "Tell a news report from an opinion piece by its signs", { std: "RI.8.6", file: "CoreDataC68H2", min: 9 }],
  ["READ.COMP.L09.19", "Check a Claim", "Check a claim against two sources and give a fair verdict", { std: "RI.8.9", file: "CoreDataC68H2", min: 10 }],
  ["READ.LIT.L09.11", "Old Pattern, New Story", "See how a new story follows an old journey pattern: call, guide, tests, return", { after: "READ.LIT.L09.02", std: "RL.8.9", file: "CoreDataC68H3", min: 9 }],
  ["READ.LIT.L09.12", "Book and Film", "Compare a book and its film: what each one changes, and why", { std: "RL.8.7", file: "CoreDataC68H3", min: 9 }],
  ["READ.LIT.L09.13", "What It Means to Me", "Say what a story means to you, and prove it from the text", { std: "RL.8.2", file: "CoreDataC68H3", min: 9 }],
  ["READ.FLU.L09.03", "Give the Speech", "Deliver a speech with pace, pauses and the line people remember", { std: "SL.8.4", file: "CoreDataC68H3", min: 9 }],
  ["READ.LIT.L07.30", "Archive 1: The Key on the Red String", "Read Chapter 1 and prove what the dust and the drawer show", { after: "READ.COMP.L07.01", std: "RL.6.1", file: "CoreDataC68H7", min: 12 }],
  ["READ.COMP.L07.05", "Said or Hinted?", "Tell what a story says outright from what you must infer", { std: "RL.6.1", file: "CoreDataC68H7", min: 9 }],
  ["READ.LIT.L07.31", "Archive 2: Proved and Guessed", "Read Chapter 2 and sort what is proved from what is guessed", { std: "RL.6.1", file: "CoreDataC68H7", min: 12 }],
  ["READ.COMP.L07.06", "Clue + What I Know", "Make an inference and explain the clue and what you know", { std: "RL.6.1", file: "CoreDataC68H7", min: 9 }],
  ["READ.LIT.L07.32", "Archive 3: The Light After Minchah", "Read Chapter 3 and explain each inference the reporters make", { std: "RL.6.1", file: "CoreDataC68H7", min: 12 }],
  ["READ.COMP.L07.07", "The Best Quote", "Pick the quote that proves the whole answer best", { std: "RI.6.1", file: "CoreDataC68H7", min: 9 }],
  ["READ.LIT.L07.33", "Archive 4: A Stakeout with Gemaras", "Read Chapter 4 and prove the answer to the mystery", { std: "RL.6.1", file: "CoreDataC68H7", min: 12 }],
  ["READ.COMP.L07.08", "Read It Again, Closer", "Reread one paragraph to catch what a quick read missed", { std: "RL.6.4", file: "CoreDataC68H7", min: 9 }],
  ["READ.FLU.L07.02", "Voices in the Scene", "Read dialogue so each speaker sounds like himself", { std: "RL.6.10", file: "CoreDataC68H7", min: 9 }]
];
/* Data files that upgrade EXISTING skills to One Bite lessons (TLCORE.upgrade; docs/core-growth/HOW-TO-ADD-A-SKILL.md). */
var CORE_DATA_FILES = (typeof CORE_DATA_FILES !== 'undefined' && CORE_DATA_FILES) || {};
CORE_DATA_FILES.C68 = ['CoreDataC68H1', 'CoreDataC68H2', 'CoreDataC68H3', 'CoreDataC68H7'];
