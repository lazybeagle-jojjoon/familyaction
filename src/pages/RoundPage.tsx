import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import PageShell from "../components/PageShell";
import Scoreboard from "../components/Scoreboard";
import { BLUR_IMAGE_ITEMS, type BlurImageAsset } from "../data/blurImageItems";
import { EMOJI_QUIZ_QUESTIONS, type EmojiQuizQuestion } from "../data/emojiQuizQuestions";
import { FALLBACK_CONTENT } from "../data/fallbacks";
import { LIE_DETECTOR_FACTS, type LieDetectorQuestion } from "../data/lieDetectorFacts";
import { getRoundInfo } from "../data/rounds";
import { playBeep, playCorrect, playWrong } from "../lib/audio";
import { normalizeChosungQuestion, type ChosungQuestion } from "../lib/chosung";
import { generateRoundContent } from "../lib/claude";
import { correctConfetti } from "../lib/effects";
import { rankAward } from "../lib/scoring";
import { addRoundResult, loadGameState, saveGameState } from "../lib/storage";
import { balancedQuestionCount, teamHex, teamMark } from "../lib/teams";
import { useScreenWakeLock } from "../lib/wakeLock";
import type { GameState, RoundResult, RoundType, Team } from "../types";

type WordsContent = { words?: string[] };
type BlurContent = { items?: { id?: string; name: string; emoji?: string; image?: string }[] };
type ChosungContent = { questions?: ChosungQuestion[] };
type EmojiContent = { questions?: EmojiQuizQuestion[] };
type LieContent = { questions?: LieDetectorQuestion[] };

const SPEED_QUIZ_SECONDS = 180;
const BLUR_HISTORY_KEY = "poolvilla_blur_recent_ids";
const BLUR_HISTORY_LIMIT = 80;
const SPEED_HISTORY_KEY = "poolvilla_speed_recent_words";
const WORD_HISTORY_LIMIT = 120;
const CHOSUNG_HISTORY_KEY = "poolvilla_chosung_recent_answers";
const CHOSUNG_HISTORY_LIMIT = 60;
const EMOJI_HISTORY_KEY = "poolvilla_emoji_recent_answers";
const EMOJI_HISTORY_LIMIT = 40;
const LIE_HISTORY_KEY = "poolvilla_lie_recent_facts";
const LIE_HISTORY_LIMIT = 80;
const SILENT_HISTORY_KEY = "poolvilla_silent_recent_words";
const CHARADES_HISTORY_KEY = "poolvilla_charades_recent_words";

// 최근 출제 이력을 프롬프트에서 제외 목록으로 넘겨, 모델 쪽 반복도 줄입니다.
// 흐릿한 이미지는 내부 자산 id라 프롬프트에 쓰기 부적절해 제외합니다.
const HISTORY_KEY_BY_ROUND: Partial<Record<RoundType, string>> = {
  speed_quiz: SPEED_HISTORY_KEY,
  chosung_quiz: CHOSUNG_HISTORY_KEY,
  emoji_quiz: EMOJI_HISTORY_KEY,
  lie_detector: LIE_HISTORY_KEY,
  silent_shout: SILENT_HISTORY_KEY,
  charades: CHARADES_HISTORY_KEY,
};

const roundTypes: RoundType[] = [
  "speed_quiz",
  "blur_image",
  "chosung_quiz",
  "emoji_quiz",
  "lie_detector",
  "silent_shout",
  "charades",
  "pool_finale",
];

function ensureList<T>(items: T[] | undefined, min = 1): T[] {
  return Array.isArray(items) && items.length >= min ? items : [];
}

function normalizeName(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function randomIndex(max: number) {
  if (max <= 1) return 0;

  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const values = new Uint32Array(1);
    cryptoApi.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function uniqueStrings(items: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    if (typeof item !== "string") continue;

    const clean = item.trim();
    const key = normalizeName(clean);
    if (!clean || seen.has(key)) continue;

    result.push(clean);
    seen.add(key);
  }

  return result;
}

function loadRecentValues(key: string) {
  try {
    const values = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(values)
      ? uniqueStrings(values.filter((value): value is string => typeof value === "string"))
      : [];
  } catch {
    return [];
  }
}

function recentKeySet(key: string) {
  return new Set(loadRecentValues(key).map(normalizeName));
}

function rememberRecentValues(key: string, values: string[], limit: number) {
  const current = uniqueStrings(values);
  const currentKeys = new Set(current.map(normalizeName));
  const previous = loadRecentValues(key).filter((value) => !currentKeys.has(normalizeName(value)));
  localStorage.setItem(key, JSON.stringify([...current, ...previous].slice(0, limit)));
}

/**
 * 실제로 화면에 나온 문항만 "최근 출제"로 기록합니다.
 * 후보 풀 전체를 기록하면 한 판 만에 모든 문항이 최근 취급을 받아
 * 다음 판에서 신선한 문항을 고를 수 없게 됩니다.
 */
function useShownHistory(key: string, limit: number) {
  const shown = useRef<string[]>([]);
  const seen = useRef(new Set<string>());

  const flush = useCallback(() => {
    if (!shown.current.length) return;
    rememberRecentValues(key, shown.current, limit);
    shown.current = [];
    seen.current.clear();
  }, [key, limit]);

  // 라운드를 떠날 때(로비 이동, 새로고침 전 언마운트) 기록합니다.
  useEffect(() => flush, [flush]);

  return useCallback((value: string | undefined) => {
    if (!value) return;
    const id = normalizeName(value);
    if (!id || seen.current.has(id)) return;
    seen.current.add(id);
    shown.current.push(value);
  }, []);
}

function preferFresh<T>(items: T[], key: string, getId: (item: T) => string) {
  const recentIds = recentKeySet(key);
  const fresh: T[] = [];
  const recent: T[] = [];

  for (const item of items) {
    if (recentIds.has(normalizeName(getId(item)))) {
      recent.push(item);
    } else {
      fresh.push(item);
    }
  }

  return [...shuffle(fresh), ...shuffle(recent)];
}

function selectWordItems(content: unknown, fallbackType: RoundType, historyKey: string) {
  const generated = uniqueStrings(ensureList((content as WordsContent).words, 1));
  const fallback = uniqueStrings(ensureList((FALLBACK_CONTENT[fallbackType] as WordsContent).words, 1));
  const source = generated.length >= 5 ? generated : uniqueStrings([...generated, ...fallback]);
  return preferFresh(source.length ? source : fallback, historyKey, normalizeName);
}

function findBlurAsset(item: { id?: string; name: string; image?: string; emoji?: string }) {
  if (item.image) return item as BlurImageAsset;

  const requested = normalizeName(item.name);
  return BLUR_IMAGE_ITEMS.find((asset) => {
    const names = [asset.id, asset.name, ...(asset.aliases ?? [])];
    return names.some((name) => normalizeName(name) === requested);
  });
}

function selectBlurItems(content: unknown, count: number) {
  const requestedItems = ensureList((content as BlurContent).items, 1);
  const selected: BlurImageAsset[] = [];
  const selectedIds = new Set<string>();
  const recentIds = recentKeySet(BLUR_HISTORY_KEY);

  const addItem = (asset: BlurImageAsset) => {
    if (selected.length >= count || selectedIds.has(asset.id)) return;
    selected.push(asset);
    selectedIds.add(asset.id);
  };

  const generatedItems: BlurImageAsset[] = [];
  const generatedIds = new Set<string>();
  for (const requestedItem of shuffle(requestedItems)) {
    const asset = findBlurAsset(requestedItem);
    if (asset && !generatedIds.has(asset.id)) {
      generatedItems.push(asset);
      generatedIds.add(asset.id);
    }
  }

  const isFresh = (item: BlurImageAsset) => !recentIds.has(normalizeName(item.id));

  for (const asset of generatedItems.filter(isFresh).slice(0, 3)) {
    addItem(asset);
  }

  for (const asset of shuffle(BLUR_IMAGE_ITEMS).filter(isFresh)) {
    addItem(asset);
  }

  for (const asset of generatedItems) {
    addItem(asset);
  }

  for (const asset of shuffle(BLUR_IMAGE_ITEMS)) {
    addItem(asset);
  }

  return selected.slice(0, count);
}

function selectLieQuestions(content: unknown, count: number) {
  const generated = ensureList((content as LieContent).questions, 5);
  const generatedQuestions = generated.length >= 5
    ? preferFresh(generated, LIE_HISTORY_KEY, (question) => normalizeName(question.fact)).slice(
        0,
        Math.ceil(count / 2),
      )
    : [];
  const fallbackQuestions = preferFresh(LIE_DETECTOR_FACTS, LIE_HISTORY_KEY, (question) => normalizeName(question.fact));
  const selected: LieDetectorQuestion[] = [];
  const seen = new Set<string>();

  for (const question of [...generatedQuestions, ...fallbackQuestions]) {
    const key = normalizeName(question.fact);
    if (!key || seen.has(key)) continue;

    selected.push(question);
    seen.add(key);
    if (selected.length >= count) break;
  }

  return selected;
}

function selectSpeedWords(content: unknown) {
  return selectWordItems(content, "speed_quiz", SPEED_HISTORY_KEY);
}

function selectChosungQuestions(content: unknown) {
  const generated = ensureList((content as ChosungContent).questions, 1);
  const fallback = ensureList((FALLBACK_CONTENT.chosung_quiz as ChosungContent).questions, 1);
  const candidates: ChosungQuestion[] = [];
  const seenAnswers = new Set<string>();

  for (const rawQuestion of [...shuffle(generated), ...shuffle(fallback)]) {
    const question = normalizeChosungQuestion(rawQuestion);
    if (!question) continue;

    const key = question.answers[0].replace(/\s+/g, "").toLowerCase();
    if (seenAnswers.has(key)) continue;

    candidates.push(question);
    seenAnswers.add(key);
  }

  return preferFresh(candidates, CHOSUNG_HISTORY_KEY, (question) => normalizeName(question.answers[0] ?? "")).slice(0, 15);
}

function findEmojiQuizQuestion(question: EmojiQuizQuestion) {
  const requestedEmoji = question.emoji?.trim();
  const requestedAnswers = Array.isArray(question.answers) ? question.answers.map(normalizeName) : [];

  return EMOJI_QUIZ_QUESTIONS.find((candidate) => {
    const candidateAnswers = candidate.answers.map(normalizeName);
    return (
      candidate.emoji === requestedEmoji ||
      candidateAnswers.some((answer) => requestedAnswers.includes(answer))
    );
  });
}

function selectEmojiQuestions(content: unknown) {
  const generated = ensureList((content as EmojiContent).questions, 1);
  const candidates: EmojiQuizQuestion[] = [];
  const seen = new Set<string>();

  const addQuestion = (question: EmojiQuizQuestion | undefined) => {
    if (!question) return;

    const answerKey = normalizeName(question.answers[0] ?? "");
    const emojiKey = question.emoji;
    const key = `${answerKey}:${emojiKey}`;
    if (!answerKey || seen.has(key)) return;

    candidates.push(question);
    seen.add(key);
  };

  for (const question of shuffle(generated)) {
    addQuestion(findEmojiQuizQuestion(question));
  }

  for (const question of shuffle(EMOJI_QUIZ_QUESTIONS)) {
    addQuestion(question);
  }

  return preferFresh(candidates, EMOJI_HISTORY_KEY, (question) => normalizeName(question.answers[0] ?? "")).slice(0, 10);
}

function formatCountdown(seconds: number) {
  if (seconds < 60) return String(seconds);

  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

function Countdown({ seconds, urgentAt = 5 }: { seconds: number; urgentAt?: number }) {
  return (
    <div
      className={`rounded-2xl border-4 border-[#171721] bg-white px-5 py-3 text-center text-5xl font-black sm:text-7xl ${
        seconds <= urgentAt ? "animate-pulse-red" : ""
      }`}
    >
      {formatCountdown(seconds)}
    </div>
  );
}

function RoundHeader({ game, type }: { game: GameState; type: RoundType }) {
  const round = getRoundInfo(type);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <Link to="/lobby" className="rounded-full bg-white px-4 py-2 text-sm font-black shadow">
          ← 로비
        </Link>
        <span className="rounded-full bg-[#FFE66D] px-4 py-2 text-sm font-black">
          {round?.tag ?? "라운드"}
        </span>
      </div>
      <section className="tv-panel rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{round?.icon}</span>
          <div>
            <h1 className="text-3xl font-black sm:text-5xl">{round?.title}</h1>
            <p className="mt-1 font-bold text-[#4A4A5E]">{round?.description}</p>
          </div>
        </div>
      </section>
      <Scoreboard game={game} compact />
    </div>
  );
}

function LoadingRound({
  error,
  usedFallback,
  onSkip,
}: {
  error: string;
  usedFallback: boolean;
  onSkip: () => void;
}) {
  return (
    <section className="tv-panel mt-5 grid min-h-[320px] place-items-center rounded-2xl p-6 text-center">
      <div className="grid gap-4">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-8 border-[#FFE66D] border-t-[#FF6B6B] motion-reduce:animate-none" />
        <h2 className="text-3xl font-black">Claude가 문제를 만들고 있어요...</h2>
        <p className="font-bold text-[#4A4A5E]">사회자도 모르는 새 문제를 받는 중입니다.</p>
        {usedFallback && <p className="rounded-xl bg-[#FFE3E3] p-3 font-black text-[#C92A2A]">{error}</p>}
        <Button tone="white" onClick={onSkip}>
          기다리지 않고 백업 문제로 시작
        </Button>
      </div>
    </section>
  );
}

function SaveRoundButton({
  game,
  result,
  children,
}: {
  game: GameState;
  result: RoundResult;
  children: string;
}) {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const playedCount = game.roundResults[result.roundType]?.length ?? 0;

  const save = (replaceLast: boolean) => {
    saveGameState(addRoundResult(game, result, replaceLast));
    navigate("/lobby");
  };

  if (confirm && playedCount > 0) {
    return (
      <div className="grid gap-3">
        <p className="rounded-xl bg-[#FFF3BF] p-3 text-center font-black">
          이 라운드는 이미 {playedCount}번 했어요. 지난 점수를 바꿀지, 이번 점수를 따로 더할지 골라주세요.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button tone="red" className="text-xl" onClick={() => save(true)}>
            지난 기록 대신 넣기
          </Button>
          <Button tone="blue" className="text-xl" onClick={() => save(false)}>
            점수 따로 더하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {confirm && (
        <p className="rounded-xl bg-[#FFF3BF] p-3 text-center font-black">
          점수를 누적 점수판에 반영할까요? 실수했다면 이 라운드는 다시 진행할 수 있어요.
        </p>
      )}
      <Button
        tone={confirm ? "red" : "yellow"}
        className="text-2xl"
        onClick={() => {
          if (!confirm) {
            setConfirm(true);
            return;
          }
          save(false);
        }}
      >
        {confirm ? "점수 확정하고 로비로" : children}
      </Button>
    </div>
  );
}

function TeamPill({ team, active }: { team: Team; active?: boolean }) {
  return (
    <span
      className={`rounded-full border-3 border-[#171721] px-4 py-2 text-base font-black ${active ? "shadow-glow" : ""}`}
      style={{ backgroundColor: teamHex(team) }}
    >
      <span aria-hidden className="mr-1">
        {teamMark(team)}
      </span>
      {team.name}
    </span>
  );
}

function SpeedQuizRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  const words = useMemo(() => selectSpeedWords(content), [content]);
  const teams = game.teams;
  const wordDecks = useMemo(
    () => Object.fromEntries(teams.map((team) => [team.id, shuffle(words)])),
    [teams, words],
  );
  const [teamIndex, setTeamIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [wordIndex, setWordIndex] = useState(0);
  const [seconds, setSeconds] = useState(SPEED_QUIZ_SECONDS);
  const [correct, setCorrect] = useState(0);
  const [rawScores, setRawScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const currentTeam = teams[teamIndex];
  const currentWords = wordDecks[currentTeam.id] ?? words;
  const currentWord = currentWords[wordIndex % currentWords.length];
  const markShown = useShownHistory(SPEED_HISTORY_KEY, WORD_HISTORY_LIMIT);
  // 타이머 effect가 맞힌 개수 변화 때문에 다시 시작되지 않도록 ref로 읽습니다.
  const correctRef = useRef(0);

  useEffect(() => {
    if (phase === "playing") markShown(currentWord);
  }, [currentWord, markShown, phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (seconds <= 0) {
      setPhase("done");
      setRawScores((scores) => ({ ...scores, [currentTeam.id]: correctRef.current }));
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    if (seconds <= 5) playBeep();
    return () => window.clearTimeout(timer);
  }, [currentTeam.id, phase, seconds]);

  const nextWord = () => setWordIndex((index) => (index + 1) % currentWords.length);
  const start = () => {
    setSeconds(SPEED_QUIZ_SECONDS);
    setCorrect(0);
    correctRef.current = 0;
    setWordIndex(0);
    setPhase("playing");
  };
  const finishTeam = () => {
    if (teamIndex < teams.length - 1) {
      setTeamIndex((index) => index + 1);
      setPhase("ready");
      return;
    }
    setShowResults(true);
  };
  const awardScores = rankAward(teams, rawScores, [10, 7, 5]);

  if (showResults) {
    return (
      <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
        <h2 className="text-3xl font-black">스피드 퀴즈 결과</h2>
        <div className="grid gap-3">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between rounded-xl bg-white p-4 text-xl font-black">
              <TeamPill team={team} />
              <span>
                {rawScores[team.id] ?? 0}개 → +{awardScores[team.id] ?? 0}점
              </span>
            </div>
          ))}
        </div>
        <SaveRoundButton
          game={game}
          result={{
            roundType: type,
            playedAt: new Date().toISOString(),
            teamScores: awardScores,
            note: "맞힌 개수 순위 보너스 10/7/5점",
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {teams.map((team, index) => (
          <TeamPill key={team.id} team={team} active={index === teamIndex} />
        ))}
      </div>
      <h2 className="text-2xl font-black">{currentTeam.name} 차례</h2>
      {phase === "ready" ? (
        <>
          <p className="rounded-xl bg-[#F6FBFF] p-4 text-lg font-bold">
            설명하는 사람만 화면을 보고, 나머지는 정답을 외쳐요. 3분 동안 맞힌 개수를 셉니다. 팀마다 단어 순서는 새로 섞입니다.
          </p>
          <Button tone="red" className="text-2xl" onClick={start}>
            3분 시작
          </Button>
        </>
      ) : phase === "playing" ? (
        <>
          <Countdown seconds={seconds} />
          <div className="rounded-2xl bg-[#FFE66D] p-6 text-5xl font-black sm:text-7xl">{currentWord}</div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              tone="green"
              className="text-2xl"
              onClick={() => {
                correctRef.current += 1;
                setCorrect(correctRef.current);
                nextWord();
                playCorrect();
                correctConfetti();
              }}
            >
              맞힘
            </Button>
            <Button tone="white" className="text-2xl" onClick={nextWord}>
              패스
            </Button>
          </div>
          <p className="text-2xl font-black">현재 {correct}개</p>
        </>
      ) : (
        <>
          <p className="rounded-xl bg-[#D3F9D8] p-5 text-3xl font-black">{currentTeam.name} {correct}개!</p>
          <Button tone="blue" className="text-2xl" onClick={finishTeam}>
            {teamIndex < teams.length - 1 ? "다음 팀" : "결과 보기"}
          </Button>
        </>
      )}
    </section>
  );
}

function BlurImageRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  // 팀마다 같은 문제 수가 돌아가도록 팀 수의 배수로 맞춥니다. (3팀이면 8문제 → 9문제)
  const questionCount = balancedQuestionCount(8, game.teams.length, BLUR_IMAGE_ITEMS.length);
  const items = useMemo(() => selectBlurItems(content, questionCount), [content, questionCount]);
  const blurValues = [30, 22, 14, 6, 0];
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [scored, setScored] = useState(false);
  const item = items[index % items.length];
  const team = game.teams[index % game.teams.length];
  const done = index >= Math.min(questionCount, items.length);
  const markShown = useShownHistory(BLUR_HISTORY_KEY, BLUR_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(item?.id);
  }, [done, item, markShown]);

  useEffect(() => {
    if (done || revealed || stage >= blurValues.length - 1) return;
    const timer = window.setTimeout(() => setStage((value) => value + 1), 5000);
    return () => window.clearTimeout(timer);
  }, [done, revealed, stage]);

  const markCorrect = () => {
    if (scored) return;

    const points = Math.max(0, (blurValues.length - stage - 1) * 5);
    setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + points }));
    setRevealed(true);
    setScored(true);
    playCorrect();
    correctConfetti();
  };
  const next = () => {
    setIndex((value) => value + 1);
    setStage(0);
    setRevealed(false);
    setScored(false);
  };

  if (done) {
    return (
      <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
        <h2 className="text-3xl font-black">흐릿한 이미지 결과</h2>
        {game.teams.map((teamItem) => (
          <div key={teamItem.id} className="flex items-center justify-between rounded-xl bg-white p-4 text-xl font-black">
            <TeamPill team={teamItem} />
            <span>+{scores[teamItem.id] ?? 0}점</span>
          </div>
        ))}
        <SaveRoundButton
          game={game}
          result={{
            roundType: type,
            playedAt: new Date().toISOString(),
            teamScores: scores,
            note: "남은 흐림 단계에 따라 20/15/10/5점",
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <div className="flex items-center justify-center">
        <TeamPill team={team} active />
      </div>
      <p className="text-xl font-black">{index + 1} / {questionCount} 문제</p>
      <div className="rounded-3xl border-4 border-[#171721] bg-white p-6">
        <img
          src={item.image}
          alt=""
          draggable={false}
          className="mx-auto h-48 w-48 select-none object-contain transition-all duration-700 sm:h-72 sm:w-72"
          style={{ filter: `blur(${blurValues[stage]}px)` }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Button tone="green" onClick={markCorrect} disabled={scored}>
          {scored ? "점수 반영 완료" : `맞춤 +${Math.max(0, (blurValues.length - stage - 1) * 5)}점`}
        </Button>
        <Button tone="yellow" onClick={() => setRevealed(true)} disabled={revealed}>
          정답 보기
        </Button>
        <Button tone="blue" onClick={next}>
          다음 문제
        </Button>
      </div>
      {revealed && <p className="rounded-xl bg-[#FFF3BF] p-4 text-3xl font-black">정답: {item.name}</p>}
      {revealed && !scored && (
        <p className="rounded-xl bg-white p-3 font-black text-[#4A4A5E]">
          정답을 확인한 뒤에도 맞힌 처리할 수 있어요. 못 맞혔으면 다음 문제로 넘어가면 0점입니다.
        </p>
      )}
    </section>
  );
}

function ChosungRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  const questions = useMemo(() => selectChosungQuestions(content), [content]);
  const totalQuestions = game.teams.length * 5;
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);
  const done = index >= totalQuestions;
  const question = questions[index % questions.length];
  const team = game.teams[Math.floor(index / 5)];
  const markShown = useShownHistory(CHOSUNG_HISTORY_KEY, CHOSUNG_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(question?.answers[0]);
  }, [done, markShown, question]);

  useEffect(() => {
    if (done || answered) return;
    if (seconds <= 0) {
      setAnswered(true);
      playWrong();
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    if (seconds <= 5) playBeep();
    return () => window.clearTimeout(timer);
  }, [answered, done, seconds]);

  const next = () => {
    setIndex((value) => value + 1);
    setSeconds(30);
    setRevealed(false);
    setAnswered(false);
  };

  if (done) {
    return (
      <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
        <h2 className="text-3xl font-black">초성 퀴즈 결과</h2>
        {game.teams.map((teamItem) => (
          <div key={teamItem.id} className="flex items-center justify-between rounded-xl bg-white p-4 text-xl font-black">
            <TeamPill team={teamItem} />
            <span>+{scores[teamItem.id] ?? 0}점</span>
          </div>
        ))}
        <SaveRoundButton
          game={game}
          result={{
            roundType: type,
            playedAt: new Date().toISOString(),
            teamScores: scores,
            note: "정답 1개당 3점",
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">{team.name} {index % 5 + 1} / 5문제</p>
      <Countdown seconds={seconds} />
      <div className="rounded-3xl bg-[#4ECDC4] p-8 text-7xl font-black sm:text-9xl">{question.chosung}</div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Button
          tone="green"
          disabled={answered}
          onClick={() => {
            setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + 3 }));
            setAnswered(true);
            setRevealed(true);
            playCorrect();
            correctConfetti();
          }}
        >
          정답 +3
        </Button>
        <Button
          tone="red"
          disabled={answered}
          onClick={() => {
            setAnswered(true);
            playWrong();
          }}
        >
          오답
        </Button>
        <Button tone="yellow" onClick={() => setRevealed(true)}>
          정답 보기
        </Button>
        <Button tone="blue" onClick={next}>
          다음 문제
        </Button>
      </div>
      {revealed && (
        <p className="rounded-xl bg-[#FFF3BF] p-4 text-2xl font-black">가능 정답: {question.answers.join(", ")}</p>
      )}
    </section>
  );
}

function EmojiRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  const questions = useMemo(() => selectEmojiQuestions(content), [content]);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  // 한 문제에 한 팀만 득점합니다. (여러 팀이 연달아 눌러 중복 득점하던 문제)
  const [awardedTeamId, setAwardedTeamId] = useState<string | null>(null);
  const questionCount = Math.min(10, questions.length);
  const question = questions[index % questions.length];
  const done = index >= questionCount;
  const markShown = useShownHistory(EMOJI_HISTORY_KEY, EMOJI_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(question?.answers[0]);
  }, [done, markShown, question]);

  if (done) {
    return (
      <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
        <h2 className="text-3xl font-black">이모지 퀴즈 결과</h2>
        {game.teams.map((team) => (
          <div key={team.id} className="flex items-center justify-between rounded-xl bg-white p-4 text-xl font-black">
            <TeamPill team={team} />
            <span>+{scores[team.id] ?? 0}점</span>
          </div>
        ))}
        <SaveRoundButton
          game={game}
          result={{
            roundType: type,
            playedAt: new Date().toISOString(),
            teamScores: scores,
            note: "정답을 외친 팀에게 5점",
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[#FFE66D] px-4 py-2 font-black">{question.category}</span>
        <span className="font-black">{index + 1} / {questionCount}</span>
      </div>
      <div className="rounded-3xl bg-white p-8 text-7xl leading-tight sm:text-9xl">{question.emoji}</div>
      <div className="grid gap-3 sm:grid-cols-3">
        {game.teams.map((team) => (
          <Button
            key={team.id}
            tone={team.color === "red" ? "red" : team.color === "blue" ? "blue" : "green"}
            disabled={Boolean(awardedTeamId)}
            onClick={() => {
              setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + 5 }));
              setAwardedTeamId(team.id);
              setRevealed(true);
              playCorrect();
              correctConfetti();
            }}
          >
            {teamMark(team)} {team.name} 정답 +5
          </Button>
        ))}
      </div>
      {awardedTeamId && (
        <p className="rounded-xl bg-[#D3F9D8] p-3 font-black text-[#2B8A3E]">
          이 문제는 이미 점수가 들어갔어요. 다음 문제로 넘어가세요.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button tone="yellow" onClick={() => setRevealed(true)}>
          정답 보기
        </Button>
        <Button
          tone="white"
          onClick={() => {
            setIndex((value) => value + 1);
            setRevealed(false);
            setAwardedTeamId(null);
          }}
        >
          다음 문제
        </Button>
      </div>
      {revealed && (
        <p className="rounded-xl bg-[#FFF3BF] p-4 text-2xl font-black">정답: {question.answers.join(", ")}</p>
      )}
    </section>
  );
}

function LieDetectorRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  // 팀마다 같은 문제 수가 돌아가도록 팀 수의 배수로 맞춥니다. (3팀이면 10문제 → 9문제)
  const targetCount = balancedQuestionCount(10, game.teams.length, LIE_DETECTOR_FACTS.length);
  const questions = useMemo(() => selectLieQuestions(content, targetCount), [content, targetCount]);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const questionCount = Math.min(targetCount, questions.length);
  const done = index >= questionCount;
  const question = questions[index % questions.length];
  const team = game.teams[index % game.teams.length];
  const markShown = useShownHistory(LIE_HISTORY_KEY, LIE_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(question?.fact);
  }, [done, markShown, question]);

  useEffect(() => {
    if (done || feedback) return;
    if (seconds <= 0) {
      setFeedback(`시간 종료! 정답은 ${question.isTrue ? "진실" : "거짓"}. ${question.explanation}`);
      playWrong();
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    if (seconds <= 5) playBeep();
    return () => window.clearTimeout(timer);
  }, [done, feedback, question.explanation, question.isTrue, seconds]);

  const answer = (choice: boolean) => {
    const isCorrect = choice === question.isTrue;
    if (isCorrect) {
      const points = Math.max(1, seconds);
      setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + points }));
      setFeedback(`정답! +${points}점. ${question.explanation}`);
      playCorrect();
      correctConfetti();
    } else {
      setFeedback(`오답! 정답은 ${question.isTrue ? "진실" : "거짓"}. ${question.explanation}`);
      playWrong();
    }
  };

  if (done) {
    return (
      <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
        <h2 className="text-3xl font-black">거짓말 탐지기 결과</h2>
        {game.teams.map((teamItem) => (
          <div key={teamItem.id} className="flex items-center justify-between rounded-xl bg-white p-4 text-xl font-black">
            <TeamPill team={teamItem} />
            <span>+{scores[teamItem.id] ?? 0}점</span>
          </div>
        ))}
        <SaveRoundButton
          game={game}
          result={{
            roundType: type,
            playedAt: new Date().toISOString(),
            teamScores: scores,
            note: "남은 초만큼 정답 점수",
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <Countdown seconds={seconds} />
      <div className="rounded-3xl bg-white p-6 text-3xl font-black leading-tight sm:text-5xl">{question.fact}</div>
      <div className="grid grid-cols-2 gap-3">
        <Button tone="green" className="text-2xl" disabled={Boolean(feedback)} onClick={() => answer(true)}>
          진실
        </Button>
        <Button tone="red" className="text-2xl" disabled={Boolean(feedback)} onClick={() => answer(false)}>
          거짓
        </Button>
      </div>
      {feedback && (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-xl font-black">{feedback}</p>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              setIndex((value) => value + 1);
              setSeconds(10);
              setFeedback("");
            }}
          >
            다음 문제
          </Button>
        </>
      )}
    </section>
  );
}

function SilentShoutRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  const words = useMemo(() => selectWordItems(content, "silent_shout", SILENT_HISTORY_KEY), [content]);
  const [wordsPerTeam, setWordsPerTeam] = useState(5);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showWord, setShowWord] = useState(false);
  const totalQuestions = game.teams.length * wordsPerTeam;
  const done = index >= totalQuestions;
  const team = game.teams[index % game.teams.length];
  const currentWord = words[index % words.length];
  const markShown = useShownHistory(SILENT_HISTORY_KEY, WORD_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(currentWord);
  }, [currentWord, done, markShown]);

  if (done) {
    return (
      <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
        <h2 className="text-3xl font-black">고요 속의 외침 결과</h2>
        {game.teams.map((teamItem) => (
          <div key={teamItem.id} className="flex items-center justify-between rounded-xl bg-white p-4 text-xl font-black">
            <TeamPill team={teamItem} />
            <span>+{scores[teamItem.id] ?? 0}점</span>
          </div>
        ))}
        <SaveRoundButton
          game={game}
          result={{
            roundType: type,
            playedAt: new Date().toISOString(),
            teamScores: scores,
            note: `팀당 ${wordsPerTeam}개 · 정답 1개당 5점`,
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <div className="rounded-xl bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3 text-left font-black">
          <span>팀당 단어 수</span>
          <span className="rounded-full bg-[#FFE66D] px-3 py-1 text-sm">
            총 {totalQuestions}문제
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[3, 5, 7, 10].map((count) => (
            <Button
              key={count}
              tone={wordsPerTeam === count ? "yellow" : "white"}
              className="min-h-[60px]"
              disabled={index > 0}
              onClick={() => setWordsPerTeam(count)}
            >
              {count}개
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        헤드폰이나 음악으로 주변 소리를 막고, 첫 번째 사람에게만 단어를 보여주세요. 마지막 사람이 맞히면 +5점입니다.
      </div>
      <div className="rounded-3xl bg-[#FFE66D] p-8 text-5xl font-black sm:text-7xl">
        {showWord ? currentWord : "단어 숨김"}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Button tone="yellow" onClick={() => setShowWord((value) => !value)}>
          {showWord ? "단어 숨기기" : "단어 보기"}
        </Button>
        <Button
          tone="green"
          onClick={() => {
            setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + 5 }));
            setIndex((value) => value + 1);
            setShowWord(false);
            playCorrect();
            correctConfetti();
          }}
        >
          정답 +5
        </Button>
        <Button
          tone="white"
          onClick={() => {
            setIndex((value) => value + 1);
            setShowWord(false);
          }}
        >
          패스
        </Button>
      </div>
    </section>
  );
}

function CharadesRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  const words = useMemo(() => selectWordItems(content, "charades", CHARADES_HISTORY_KEY), [content]);
  const [teamIndex, setTeamIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [wordIndex, setWordIndex] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const team = game.teams[teamIndex];
  const currentWord = words[wordIndex % words.length];
  const markShown = useShownHistory(CHARADES_HISTORY_KEY, WORD_HISTORY_LIMIT);
  // 타이머 effect가 맞힌 개수 변화 때문에 다시 시작되지 않도록 ref로 읽습니다.
  const correctRef = useRef(0);

  useEffect(() => {
    if (phase === "playing") markShown(currentWord);
  }, [currentWord, markShown, phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (seconds <= 0) {
      setScores((value) => ({ ...value, [team.id]: correctRef.current * 5 }));
      setPhase("done");
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    if (seconds <= 5) playBeep();
    return () => window.clearTimeout(timer);
  }, [phase, seconds, team.id]);

  if (showResults) {
    return (
      <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
        <h2 className="text-3xl font-black">몸으로 말해요 결과</h2>
        {game.teams.map((teamItem) => (
          <div key={teamItem.id} className="flex items-center justify-between rounded-xl bg-white p-4 text-xl font-black">
            <TeamPill team={teamItem} />
            <span>+{scores[teamItem.id] ?? 0}점</span>
          </div>
        ))}
        <SaveRoundButton
          game={game}
          result={{
            roundType: type,
            playedAt: new Date().toISOString(),
            teamScores: scores,
            note: "맞힌 개수당 5점",
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  const start = () => {
    setSeconds(60);
    setCorrect(0);
    correctRef.current = 0;
    setPhase("playing");
  };
  const nextTeam = () => {
    if (teamIndex >= game.teams.length - 1) {
      setShowResults(true);
      return;
    }
    setTeamIndex((value) => value + 1);
    setPhase("ready");
  };

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      {phase === "ready" ? (
        <>
          <p className="rounded-xl bg-[#F6FBFF] p-4 text-lg font-bold">
            표현하는 사람만 단어를 보고, 말 없이 몸짓으로 설명합니다. 1분 동안 맞힌 개수가 점수예요.
          </p>
          <Button tone="red" className="text-2xl" onClick={start}>
            1분 시작
          </Button>
        </>
      ) : phase === "playing" ? (
        <>
          <Countdown seconds={seconds} />
          <div className="rounded-3xl bg-[#FFE66D] p-8 text-5xl font-black sm:text-7xl">{currentWord}</div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              tone="green"
              className="text-2xl"
              onClick={() => {
                correctRef.current += 1;
                setCorrect(correctRef.current);
                setWordIndex((value) => value + 1);
                playCorrect();
                correctConfetti();
              }}
            >
              맞힘
            </Button>
            <Button tone="white" className="text-2xl" onClick={() => setWordIndex((value) => value + 1)}>
              패스
            </Button>
          </div>
          <p className="text-2xl font-black">현재 {correct}개 · 예상 +{correct * 5}점</p>
        </>
      ) : (
        <>
          <p className="rounded-xl bg-[#D3F9D8] p-5 text-3xl font-black">{team.name} +{correct * 5}점!</p>
          <Button tone="blue" className="text-2xl" onClick={nextTeam}>
            {teamIndex < game.teams.length - 1 ? "다음 팀" : "결과 보기"}
          </Button>
        </>
      )}
    </section>
  );
}

function PoolFinaleRound({ game, type }: { game: GameState; type: RoundType }) {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      playWrong();
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    if (seconds <= 5) playBeep();
    return () => window.clearTimeout(timer);
  }, [running, seconds]);

  const awards = rankAward(game.teams, counts, [30, 20, 10]);

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <div className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        동전 30개를 수영장에 흩뿌립니다. 60초 동안 팀별로 가장 많이 주운 개수를 입력하고, 1·2·3등에게 30/20/10점을 줍니다.
      </div>
      <Countdown seconds={seconds} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          tone={running ? "white" : "red"}
          className="text-2xl"
          onClick={() => {
            setRunning((value) => !value);
            if (seconds === 0) setSeconds(60);
          }}
        >
          {running ? "타이머 일시정지" : "60초 시작"}
        </Button>
        <Button tone="yellow" className="text-2xl" onClick={() => setSeconds(60)}>
          타이머 리셋
        </Button>
      </div>
      <div className="grid gap-3">
        {game.teams.map((team) => (
          <label key={team.id} className="grid gap-2 rounded-xl bg-white p-4 text-left font-black">
            <span>{team.name} 주운 개수</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={counts[team.id] ?? ""}
              onChange={(event) => setCounts((value) => ({ ...value, [team.id]: Number(event.target.value) }))}
              className="min-h-[60px] rounded-xl border-3 border-[#171721] px-4 text-2xl font-black outline-none focus:ring-4 focus:ring-[#FFE66D]"
            />
          </label>
        ))}
      </div>
      <Button tone="blue" className="text-2xl" onClick={() => setShowResult(true)}>
        순위 점수 계산
      </Button>
      {showResult && (
        <div className="grid gap-3 rounded-xl bg-[#FFF3BF] p-4">
          {game.teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between text-xl font-black">
              <TeamPill team={team} />
              <span>
                {counts[team.id] ?? 0}개 → +{awards[team.id] ?? 0}점
              </span>
            </div>
          ))}
          <SaveRoundButton
            game={game}
            result={{
              roundType: type,
              playedAt: new Date().toISOString(),
              teamScores: awards,
              note: "보물찾기 순위 30/20/10점",
            }}
          >
            점수 입력 확인
          </SaveRoundButton>
        </div>
      )}
    </section>
  );
}

export default function RoundPage() {
  const { type } = useParams();
  const roundType = type as RoundType;
  const [game] = useState<GameState | null>(() => loadGameState());
  const [content, setContent] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);
  const [modelUsed, setModelUsed] = useState("");
  const valid = roundTypes.includes(roundType);
  // 사회자가 기다리지 않고 백업 문제로 시작하면, 뒤늦게 도착한 응답이 화면을 덮지 않게 합니다.
  const skippedRef = useRef(false);

  const round = useMemo(() => (valid ? getRoundInfo(roundType) : undefined), [roundType, valid]);

  useScreenWakeLock(valid);

  useEffect(() => {
    let mounted = true;
    if (!valid) return;

    skippedRef.current = false;
    setLoading(true);
    setContent(null);
    setUsedFallback(false);
    setError("");
    setModelUsed("");

    const historyKey = HISTORY_KEY_BY_ROUND[roundType];
    const avoid = historyKey ? loadRecentValues(historyKey).slice(0, 40) : [];

    generateRoundContent(roundType, avoid).then((result) => {
      if (!mounted || skippedRef.current) return;
      setContent(result.data);
      setUsedFallback(result.usedFallback);
      setError(result.error);
      setModelUsed(result.model);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [roundType, valid]);

  const startWithFallback = useCallback(() => {
    skippedRef.current = true;
    setContent(FALLBACK_CONTENT[roundType]);
    setUsedFallback(true);
    setError("사회자가 기다리지 않고 백업 문제로 시작했습니다.");
    setModelUsed("");
    setLoading(false);
  }, [roundType]);

  if (!valid || !round) return <Navigate to="/lobby" replace />;
  if (!game) return <Navigate to="/setup" replace />;

  let body = null;
  if (loading || !content) {
    body = <LoadingRound error={error} usedFallback={usedFallback} onSkip={startWithFallback} />;
  } else if (roundType === "speed_quiz") {
    body = <SpeedQuizRound game={game} content={content} type={roundType} />;
  } else if (roundType === "blur_image") {
    body = <BlurImageRound game={game} content={content} type={roundType} />;
  } else if (roundType === "chosung_quiz") {
    body = <ChosungRound game={game} content={content} type={roundType} />;
  } else if (roundType === "emoji_quiz") {
    body = <EmojiRound game={game} content={content} type={roundType} />;
  } else if (roundType === "lie_detector") {
    body = <LieDetectorRound game={game} content={content} type={roundType} />;
  } else if (roundType === "silent_shout") {
    body = <SilentShoutRound game={game} content={content} type={roundType} />;
  } else if (roundType === "charades") {
    body = <CharadesRound game={game} content={content} type={roundType} />;
  } else {
    body = <PoolFinaleRound game={game} type={roundType} />;
  }

  return (
    <PageShell>
      <RoundHeader game={game} type={roundType} />
      {usedFallback && !loading && (
        <p className="mt-5 rounded-xl border-3 border-[#171721] bg-[#FFE3E3] p-3 text-center font-black text-[#C92A2A]">
          ⚠️ Claude 호출 실패로 백업 문제를 사용 중입니다. {error}
        </p>
      )}
      {!usedFallback && !loading && round.prompt && (
        <p className="mt-5 rounded-xl border-3 border-[#171721] bg-[#D3F9D8] p-3 text-center font-black text-[#2B8A3E]">
          ✅ Claude가 새 문제를 생성했습니다. {modelUsed && `사용 모델: ${modelUsed}`}
        </p>
      )}
      {body}
    </PageShell>
  );
}
