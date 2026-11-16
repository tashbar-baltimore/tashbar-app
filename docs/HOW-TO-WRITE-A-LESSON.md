# How to write a lesson

A lesson (a "skill") has an id such as `LK.CHU.L03.02` and four parts the student goes through:

1. **Teacher Time** (`TL_TEACH`): a short hand-written lesson before the questions.
2. **Learn it** (`teach`): 3 worked questions, each with a "How to do it" box.
3. **Practice** (`practice`): about 6 hands-on questions (sort, match pairs, find them all, put in order, type). Not plain multiple choice.
4. **On your own** (`check`): 3 questions, one try each, no hints.

## Teacher Time format
```
TL_TEACH["SKILL.ID"] = {
  hook:  one line that makes a child curious,
  big:   the one big idea, in one sentence,
  intro: 3-4 short lines that teach the METHOD,
  ex:    two fully worked examples, different from each other (steps, 5 at most),
  oops:  the real mistake children make, and why it is wrong,
  idea:  another way to see it,
  try:   one "your turn" question with its choices, the answer, and the steps
};
```

## Rules for questions
- **Check questions must be tap or order**, and must match what was taught. If the answer to a check question never appeared in Teacher Time, Learn it or Practice, the test counts it.
- Every question has its own "How to do it" box: the trick, the trick on a sister example, "Your turn", go. The box must never give the answer to this question.
- A hint teaches the method. It never says the answer.
- The right answer must not always be the longest choice.

## Wording for K-2
- Lines of 12 words or fewer. Short, plain words. The app reads the question aloud.
- 3 choices at most. No hints in K-2.
- Hebrew goes in pictures, tiles and cards, never inside a read-aloud line.

## Kodesh
- Every Hebrew string is copied by script from a source text, never typed.
- Never write the Divine Name: use ה׳, and אלקים for Elokim.
- Say "REBBE: review after live" in the pull request and attach the proof sheet.
