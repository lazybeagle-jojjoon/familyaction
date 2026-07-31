# Codex Review Packet

## Mode
delta

## Base
Re-sent after the first attempt reached the reviewer truncated: this packet contains ```ts blocks,
and the outer prompt fence was also three backticks, so it closed at the chosung example. Findings
1 and 2 ("packet truncated", "add verification evidence") were both that. Sections below are
unchanged from the original; only the outer fence is fixed.

Finding 3 (chosung with missing/empty text → 0-second, 0-point round) was checked and rejected —
evidence added under Verification.

`main` @ `f3da9d9` (previous review point: `b38072a`). Already pushed and deployed.
Deliberately omitted: the three replaced data files (charadesWords 276 words, drawingCards 60
cards, emojiQuizQuestions 76 questions) — flat string lists whose content was the user's own
editorial call. Also omitted: the 10 unchanged rounds.

## Goal
The user played the app with family for the first time and reported nine specific problems.
Each is a game-design complaint, not a bug: rounds too easy to be a game, or questions harder
than the game itself. This is a retune, not new capability.

## Change

**Scoring / timing**
- Speed quiz: `rankAward(teams, rawScores, [10,7,5])` → `awardScores = rawScores` (1 word = 1 point); 180s → 120s.
- Charades: 60s → 120s; 5 points/word → 2.
- Chosung: fixed 30s/3pt → scaled by answer length.

```ts
const CHOSUNG_SECONDS_PER_CHAR = 8;
const letters = chosungLength(question?.chosung ?? "");   // whitespace stripped
const points = letters;                                   // 2 chars = 2pt … 5 chars = 5pt
const seconds = useDeadlineCountdown(!done && !answered, letters * CHOSUNG_SECONDS_PER_CHAR, timeUp, index);
```

**Interview — lying now costs points.** Defenders could dodge a forbidden word by inventing facts
(claiming a friend was their mother).

```ts
const award = useCallback((attackerWon: boolean, reason: string, penalty = 0) => {
  if (judgedRef.current) return;
  judgedRef.current = true;
  const winner = attackerWon ? matchup.attacker : matchup.defender;
  const loser  = attackerWon ? matchup.defender : matchup.attacker;
  setScores((value) => {
    const next = { ...value, [winner.id]: (value[winner.id] ?? 0) + INTERVIEW_POINT };
    if (penalty) next[loser.id] = Math.max(0, (value[loser.id] ?? 0) - penalty);
    return next;
  });
  ...
}, [matchup]);
```

**Reverse talk — hide the words.** It was easy because players read the on-screen words backwards.
The host now reveals them only during `phase === "ready"` via a toggle; `setShowWords(false)` fires
both on start and on next-question. Group size 10–20 chars → 6–12; time 1.0 → 1.5 s/char.

**Removed** the hum-battle round (`hum_song`) from types / rounds / fallbacks / RoundPage; deleted
`humSongs.ts`.

**Odd-grid generator** — grids 9/16/25 → 16/25/36; unpaired 11/17/23 (emoji sets 8 → 12 each);
count 6/8/10 with mismatch direction randomised; two new generators (`makeSequence`, `makeSwapped`).

## Verification
- `tsc --noEmit` clean; `npm run build` clean; deployed bundle hash matches local build.
- 90,000 generated odd-grid puzzles: each has exactly one cell violating its stated rule, and that
  cell is `answerIndex`. (My first checker was wrong — it asserted "all non-answer cells identical",
  false for the numeric generators. Rewritten per-rule; then 0 failures.)
- Browser, 3 teams: speed 4/7/2 correct → +4/+7/+2. Charades 3/5/1 → +6/+10/+2.
  Chosung 4 chars → 32s/+4, 2 → 16s/+2, 3 → 24s/+3. Interview 5+5−3+5 = 12 / 15 / (−3 clamped to 0).
  Reverse talk: hidden → host view → **hidden again on start** → hidden on next question.
  Emoji hint renders "속담 · 11글자". Lobby shows 19 rounds, no hum battle.
- All 19 round types resolve to a component (`pool_finale` is the intentional `else`).
- **Chosung zero-length check (finding 3):** all 302 fallback questions normalise successfully with
  chosung length 2–6, never 0. Six malformed inputs — `""`, `"   "`, `"abc"`, empty answers,
  `null`, `"!!!"` — all return `null` from `normalizeChosungQuestion` and are dropped by
  `if (!question) continue`. So a question that reaches the screen always has `letters >= 1`.
  If the pool were somehow empty the round would throw at `{question.chosung}` in JSX, which is
  pre-existing and unrelated to this change. No guard added: the state is unreachable.

## Assessment
Confident in the mechanical changes; each was observed working end to end.

Two judgment calls I am least sure of:
1. **Reverse talk may now be too hard for children.** Hiding the words *and* keeping multi-word
   groups is two difficulty increases at once. I lowered chars (10–20 → 6–12) and raised time
   (1.0 → 1.5 s/char) to compensate, but that is a guess, not a measurement.
2. **The interview penalty floors at 0 per round**, so a team that lies while holding 0 round
   points pays nothing. The alternative — letting the round score go negative — would drag the game
   total down, and I judged a negative scoreboard worse for young players.

Known non-issue: `pairs` in the unpaired generator is `Math.min(…, set.length - 1)`, so tier 3 was
capped by set size; raising sets to 12 made tiers 2 and 3 differ (17 vs 23 cells).

## Ask
1. Reverse talk: is hidden words + 6–12 characters + 1.5 s/char sane for a mixed adult/child group,
   or should a hidden question be a single word?
2. Interview: is the per-round floor-at-0 penalty right, or should it carry into the game total
   (allowing negative round scores)?
3. Speed quiz 1 pt/word vs charades 2 pt/word vs chosung 2–5 pt/answer — are these commensurate
   across a 3-game night, or does one round dominate the scoreboard?
