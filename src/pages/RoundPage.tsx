import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import MusicToggle from "../components/MusicToggle";
import PageShell from "../components/PageShell";
import Scoreboard from "../components/Scoreboard";
import StrokePad from "../components/StrokePad";
import { BLUR_IMAGE_ITEMS, type BlurImageAsset } from "../data/blurImageItems";
import { CARGO_CARDS, type CargoCard } from "../data/cargoCards";
import { DRAWING_CARDS } from "../data/drawingCards";
import { EMOJI_QUIZ_QUESTIONS, type EmojiQuizQuestion } from "../data/emojiQuizQuestions";
import { FALLBACK_CONTENT } from "../data/fallbacks";
import { LIE_DETECTOR_FACTS, type LieDetectorQuestion } from "../data/lieDetectorFacts";
import { HOMONYM_CARDS } from "../data/homonymCards";
import { MEMORY_THEMES } from "../data/memoryThemes";
import { LIST_CHALLENGES, type ListChallenge } from "../data/listChallenges";
import { NUNCHI_PROMPTS, type NunchiPrompt } from "../data/nunchiPrompts";
import { getRoundInfo } from "../data/rounds";
import { SEQUENCE_CARDS } from "../data/sequenceCards";
import { SILENT_SHOUT_WORDS } from "../data/silentShoutWords";
import { SPEED_QUIZ_WORDS } from "../data/speedQuizWords";
import { TRAP_CARDS } from "../data/trapCards";
import { VAULT_CASES, type VaultClue } from "../data/vaultCases";
import { playBeep, playCorrect, playWrong } from "../lib/audio";
import { normalizeChosungQuestion, type ChosungQuestion } from "../lib/chosung";
import { makeOddGrid } from "../lib/oddGrid";
import { generateRoundContent } from "../lib/claude";
import { correctConfetti, finaleConfetti } from "../lib/effects";
import { loadPhotos } from "../lib/photoLibrary";
import { rankAward } from "../lib/scoring";
import { addRoundResult, loadGameState, saveGameState } from "../lib/storage";
import { balancedQuestionCount, staffingLabel, staffingWarning, teamHex, teamMark } from "../lib/teams";
import { useScreenWakeLock } from "../lib/wakeLock";
import type { GameState, RoundResult, RoundType, Team } from "../types";

type WordsContent = { words?: string[] };
type BlurContent = { items?: { id?: string; name: string; emoji?: string; image?: string }[] };
type ChosungContent = { questions?: ChosungQuestion[] };
type EmojiContent = { questions?: EmojiQuizQuestion[] };
type LieContent = { questions?: LieDetectorQuestion[] };

/**
 * 라운드마다 한 팀이 받을 수 있는 최대 점수를 24점 근처로 맞춥니다.
 *
 * 예전에는 수상한 한 칸이 6점, 흐릿한 이미지가 60점이어서 어떤 라운드를 고르느냐가
 * 실력보다 순위를 크게 좌우했어요. 이제 어느 라운드를 몇 개 하든 비슷한 무게입니다.
 * 팀별로 문항이 도는 라운드는 (팀당 문항 수 × 문항당 점수)가 24가 되게 잡았습니다.
 */
const ROUND_MAX_PER_TEAM = 24;

// 팀당 문항이 3개인 라운드는 8점, 4개면 6점, 5개면 5점 안팎으로 둡니다.
const EMOJI_POINT = 8;        // 팀 수 배수 9문제, 선착순
const MEMORY_POINT = 8;       // 팀당 3문제
const SEQUENCE_POINT = 8;     // 팀당 3문제 (두 장만 바뀌었으면 3점)
const SEQUENCE_PARTIAL = 3;
const LIST_POINT = 8;         // 팀당 3문제
const DRAWING_POINT = 8;      // 팀당 3문제
const REVERSE_POINT = 6;      // 팀당 4문제
const VAULT_CLUE_POINT = 3;   // 3금고 × (단서 3 + 열기 5) = 24
const VAULT_OPEN_POINT = 5;

const SPEED_QUIZ_SECONDS = 120;
// 몸짓은 설명보다 오래 걸려서 2분을 줍니다. 대신 개당 점수는 낮춰 스피드 퀴즈와 균형을 맞춥니다.
const CHARADES_SECONDS = 120;
const CHARADES_POINT = 2;

/**
 * 초성 퀴즈는 글자 수만큼 어려워집니다. 두 글자에 30초를 주면 너무 헐렁하고,
 * 다섯 글자를 같은 점수로 치면 손해예요. 그래서 글자 수를 그대로 점수로 쓰고
 * 제한 시간도 글자당 8초로 맞춥니다. (2자 = 16초 2점, 4자 = 32초 4점)
 *
 * 다만 5자에서 끊습니다. 풀에 여섯 글자가 하나 있는데(마인크래프트) 그대로 두면
 * 그 문제만 48초짜리가 돼서 한 팀 차례가 늘어져요.
 */
const CHOSUNG_SECONDS_PER_CHAR = 8;
const CHOSUNG_MAX_SCALE = 5;

// 순서 맞추기는 시간이 없으면 팀이 무한정 만지작거려서 차례가 늘어졌습니다.
const SEQUENCE_SECONDS = 60;

// 금지어를 피하려고 없는 사실을 지어내면 게임이 성립하지 않습니다.
// 처음에는 수비팀 점수를 깎았는데, 0점 아래로 못 내려가게 막다 보니
// 같은 거짓말이 첫 수비 때는 공짜고 나중에는 3점이 되는 이상한 규칙이 됐어요.
// 지금은 공격팀에게 그만큼 더 줍니다. 벌어지는 점수 차이는 똑같이 8점이고,
// 순서에 상관없이 대가가 같습니다.
const INTERVIEW_POINT = 6;
const INTERVIEW_LIE_BONUS = 3;
function chosungLength(chosung: string) {
  return chosung.replace(/\s/g, "").length;
}
const POOL_FINALE_COINS = 30;
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
  "memory_thief",
  "sequence_order",
  "trap_interview",
  "nunchi_allin",
  "list_race",
  "reverse_talk",
  "team_vault",
  "stroke_draw",
  "cargo_six",
  "odd_grid",
  "homonym",
  "silent_shout",
  "charades",
  "pool_finale",
];

const MEMORY_HISTORY_KEY = "poolvilla_memory_recent";
const SEQUENCE_HISTORY_KEY = "poolvilla_sequence_recent";
const TRAP_HISTORY_KEY = "poolvilla_trap_recent";
const NUNCHI_HISTORY_KEY = "poolvilla_nunchi_recent";
const LIST_HISTORY_KEY = "poolvilla_list_recent";
const REVERSE_HISTORY_KEY = "poolvilla_reverse_recent";
const VAULT_HISTORY_KEY = "poolvilla_vault_recent";
const DRAWING_HISTORY_KEY = "poolvilla_drawing_recent";
const HOMONYM_HISTORY_KEY = "poolvilla_homonym_recent";
const NEW_ROUND_HISTORY_LIMIT = 60;

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
  // 이력은 최근 것이 앞에 오므로, 인덱스가 클수록 오래전에 쓴 문항입니다.
  const recentOrder = new Map(loadRecentValues(key).map((value, index) => [normalizeName(value), index]));
  const fresh: T[] = [];
  const recent: { item: T; index: number }[] = [];

  for (const item of items) {
    const index = recentOrder.get(normalizeName(getId(item)));
    if (index === undefined) {
      fresh.push(item);
    } else {
      recent.push({ item, index });
    }
  }

  // 풀이 전부 "최근"이 되어도 가장 오래전에 쓴 것부터 나오게 합니다.
  recent.sort((left, right) => right.index - left.index);

  return [...shuffle(fresh), ...recent.map((entry) => entry.item)];
}

/**
 * setTimeout을 1초씩 이어붙이면 렌더가 밀릴 때마다 시간이 늘어납니다.
 * 시작할 때 마감 시각을 정해두고 벽시계로 남은 시간을 계산합니다.
 */
function useDeadlineCountdown(
  running: boolean,
  totalSeconds: number,
  onEnd: () => void,
  // 문항이 바뀔 때처럼 running이 계속 true인 채로 다시 시작해야 하는 경우에 씁니다.
  resetKey: unknown = null,
) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!running) {
      setRemaining(totalSeconds);
      return;
    }

    const deadline = Date.now() + totalSeconds * 1000;
    let ended = false;
    let lastBeepAt = totalSeconds + 1;
    setRemaining(totalSeconds);

    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);

      if (left <= 5 && left > 0 && left < lastBeepAt) {
        lastBeepAt = left;
        playBeep();
      }

      if (left <= 0 && !ended) {
        ended = true;
        onEndRef.current();
      }
    };

    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [running, totalSeconds, resetKey]);

  return remaining;
}

function selectWordItems(content: unknown, fallbackType: RoundType, historyKey: string) {
  const generated = uniqueStrings(ensureList((content as WordsContent).words, 1));
  const fallback = uniqueStrings(ensureList((FALLBACK_CONTENT[fallbackType] as WordsContent).words, 1));
  // 생성이 성공해도 폴백을 버리지 않습니다. 몸으로말해요처럼 20개만 생성되는 라운드는
  // 팀을 돌다 보면 덱이 먼저 떨어져서 같은 단어가 다시 나옵니다.
  const source = uniqueStrings([...generated, ...fallback]);
  const ordered = preferFresh(source.length ? source : fallback, historyKey, normalizeName);

  // 새로 생성된 단어를 앞에 두되, 뒤에 폴백을 붙여 덱이 떨어지지 않게 합니다.
  const generatedKeys = new Set(generated.map(normalizeName));
  const isGenerated = (word: string) => generatedKeys.has(normalizeName(word));
  return [...ordered.filter(isGenerated), ...ordered.filter((word) => !isGenerated(word))];
}

function findBlurAsset(item: { id?: string; name: string; image?: string; emoji?: string }) {
  if (item.image) return item as BlurImageAsset;

  const requested = normalizeName(item.name);
  return blurPool().find((asset) => {
    const names = [asset.id, asset.name, ...(asset.aliases ?? [])];
    return names.some((name) => normalizeName(name) === requested);
  });
}

/**
 * 자산 풀이 음식·동물 쪽으로 크게 치우쳐 있어서, 그냥 섞으면 한 라운드가
 * 과일과 아기동물로만 채워집니다. 카테고리를 번갈아 뽑아 골고루 나오게 합니다.
 */
function interleaveByCategory(assets: BlurImageAsset[]) {
  const buckets = new Map<string, BlurImageAsset[]>();
  for (const asset of assets) {
    const bucket = buckets.get(asset.category) ?? [];
    bucket.push(asset);
    buckets.set(asset.category, bucket);
  }

  const order = shuffle([...buckets.keys()]);
  const result: BlurImageAsset[] = [];
  let picked = true;

  while (picked) {
    picked = false;
    for (const category of order) {
      const next = buckets.get(category)?.shift();
      if (next) {
        result.push(next);
        picked = true;
      }
    }
  }

  return result;
}

/** 진행자가 넣은 가족 사진을 기본 그림들과 함께 씁니다. */
function blurPool(): BlurImageAsset[] {
  const photos = loadPhotos().map<BlurImageAsset>((photo) => ({
    id: `photo-${photo.id}`,
    name: photo.name,
    image: photo.image,
    category: "우리 사진",
  }));
  return [...photos, ...BLUR_IMAGE_ITEMS];
}

function selectBlurItems(content: unknown, count: number) {
  const pool = blurPool();
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

  for (const asset of interleaveByCategory(shuffle(pool).filter(isFresh))) {
    addItem(asset);
  }

  for (const asset of generatedItems) {
    addItem(asset);
  }

  for (const asset of shuffle(pool)) {
    addItem(asset);
  }

  return selected.slice(0, count);
}

function isLieQuestion(value: unknown): value is LieDetectorQuestion {
  if (!value || typeof value !== "object") return false;
  const question = value as Partial<LieDetectorQuestion>;
  return (
    typeof question.fact === "string" &&
    question.fact.trim().length > 0 &&
    typeof question.isTrue === "boolean" &&
    typeof question.explanation === "string"
  );
}

/**
 * 로컬 문제 풀은 진실 100 / 거짓 50이라, 그냥 뽑으면 "무조건 진실"만 외쳐도 3분의 2를 맞힙니다.
 * 진실과 거짓을 반씩 뽑은 뒤 순서를 섞어 패턴도 보이지 않게 합니다.
 */
function selectLieQuestions(content: unknown, count: number) {
  const generated = ensureList((content as LieContent).questions, 1).filter(isLieQuestion);
  const generatedKeys = new Set(generated.map((question) => normalizeName(question.fact)));
  const pool = [...generated, ...LIE_DETECTOR_FACTS];
  const ordered = preferFresh(pool, LIE_HISTORY_KEY, (question) => normalizeName(question.fact));

  const truths: LieDetectorQuestion[] = [];
  const lies: LieDetectorQuestion[] = [];
  const seen = new Set<string>();

  // 생성된 문제를 먼저 쓰되, 각 그룹 안에서는 오래 안 나온 것부터 채웁니다.
  const byGeneratedFirst = [
    ...ordered.filter((question) => generatedKeys.has(normalizeName(question.fact))),
    ...ordered.filter((question) => !generatedKeys.has(normalizeName(question.fact))),
  ];

  for (const question of byGeneratedFirst) {
    const key = normalizeName(question.fact);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    (question.isTrue ? truths : lies).push(question);
  }

  const selected: LieDetectorQuestion[] = [];
  const wantLies = Math.floor(count / 2);

  while (selected.length < count && (truths.length || lies.length)) {
    const needMoreLies = selected.filter((question) => !question.isTrue).length < wantLies;
    const next = needMoreLies ? lies.shift() ?? truths.shift() : truths.shift() ?? lies.shift();
    if (!next) break;
    selected.push(next);
  }

  return shuffle(selected);
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
      role="timer"
      aria-label={`남은 시간 ${seconds}초`}
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
  const shortStaffed = round ? staffingWarning(round, game.teams) : "";

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/lobby"
          // 진행 중인 라운드는 아직 저장 전이라, 실수로 나가면 그 판이 사라집니다.
          onClick={(event) => {
            if (!window.confirm("로비로 나가면 이번 라운드 진행과 점수가 사라져요. 나갈까요?")) {
              event.preventDefault();
            }
          }}
          className="rounded-full bg-white px-4 py-2 text-sm font-black shadow"
        >
          ← 로비
        </Link>
        <div className="flex items-center gap-2">
          <MusicToggle />
          <span className="rounded-full bg-[#FFE66D] px-4 py-2 text-sm font-black">
            {round?.tag ?? "라운드"}
          </span>
        </div>
      </div>
      <section className="tv-panel rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{round?.icon}</span>
          <div>
            <h1 className="text-3xl font-black sm:text-5xl">{round?.title}</h1>
            <p className="mt-1 font-bold text-[#4A4A5E]">{round?.description}</p>
            {round && <p className="mt-1 text-sm font-black text-[#1971C2]">👥 {staffingLabel(round)}</p>}
          </div>
        </div>
        {shortStaffed && (
          <p className="mt-3 rounded-xl bg-[#FFE3E3] p-3 text-sm font-black text-[#C92A2A]">
            ⚠️ {shortStaffed}
          </p>
        )}
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

/**
 * 라운드 중간에 끊고 나갈 수 있게 해 줍니다.
 * 단, 모든 팀이 같은 횟수를 마친 지점에서만 보여야 점수가 공평합니다.
 * (3팀 12문제라면 3·6·9문제째를 끝낸 시점)
 */
function EarlyFinish({ ready, done, onFinish }: { ready: boolean; done: number; onFinish: () => void }) {
  if (!ready) return null;

  return (
    <Button tone="white" className="text-base" onClick={onFinish}>
      🏁 여기까지만 하고 점수 내기 (모든 팀 {done}번씩 완료)
    </Button>
  );
}

/** 모든 팀이 같은 횟수를 마쳤는지, 마쳤다면 몇 번씩인지 알려 줍니다. */
function evenTurns(index: number, teamCount: number) {
  const safeTeams = Math.max(1, teamCount);
  return index > 0 && index % safeTeams === 0 ? index / safeTeams : 0;
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
  // 팀마다 다시 섞으면 "최근에 안 나온 단어 먼저" 순서가 통째로 사라집니다.
  // 대신 순서를 유지한 채 번갈아 나눠 가져서, 각 팀이 서로 겹치지 않는 신선한 덱을 받습니다.
  const wordDecks = useMemo(
    () =>
      Object.fromEntries(
        teams.map((team, teamOffset) => {
          const deck = words.filter((_, wordIndex) => wordIndex % teams.length === teamOffset);
          return [team.id, deck.length ? deck : words];
        }),
      ),
    [teams, words],
  );
  const [teamIndex, setTeamIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [wordIndex, setWordIndex] = useState(0);
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

  const finishTurn = useCallback(() => {
    setPhase("done");
    setRawScores((scores) => ({ ...scores, [currentTeam.id]: correctRef.current }));
  }, [currentTeam.id]);

  const seconds = useDeadlineCountdown(phase === "playing", SPEED_QUIZ_SECONDS, finishTurn, teamIndex);

  const nextWord = () => setWordIndex((index) => (index + 1) % currentWords.length);
  const start = () => {
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
  // 맞힌 개수가 곧 점수입니다. 순위 보너스를 쓰면 1개 차이가 3점 차이로 뻥튀기돼서
  // 한 판에 몰아주는 느낌이 강했어요.
  const awardScores = rawScores;

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
            note: "맞힌 개수 1개당 1점",
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
            설명하는 사람만 화면을 보고, 나머지는 정답을 외쳐요. 2분 동안 맞힌 개수가 그대로 점수예요. 팀마다 단어 순서는 새로 섞입니다.
          </p>
          <Button tone="red" className="text-2xl" onClick={start}>
            2분 시작
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
          <p className="text-2xl font-black">현재 {correct}개 · 예상 +{correct}점</p>
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
  const questionCount = balancedQuestionCount(8, game.teams.length, blurPool().length);
  const items = useMemo(() => selectBlurItems(content, questionCount), [content, questionCount]);
  const blurValues = [30, 22, 14, 6, 0];
  // 단계마다 8/6/4/2점. 팀당 세 문제라 한 번도 안 틀리면 24점입니다.
  const blurPoints = [8, 6, 4, 2, 0];
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [scored, setScored] = useState(false);
  const [stopped, setStopped] = useState(false);
  const item = items[index % items.length];
  const team = game.teams[index % game.teams.length];
  const done = stopped || index >= Math.min(questionCount, items.length);
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

    const points = blurPoints[stage] ?? 0;
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
            note: "남은 흐림 단계에 따라 8/6/4/2점",
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
      <EarlyFinish
        ready={!revealed && evenTurns(index, game.teams.length) > 0}
        done={evenTurns(index, game.teams.length)}
        onFinish={() => setStopped(true)}
      />
      <div className="rounded-3xl border-4 border-[#171721] bg-white p-6">
        {/*
          key를 문항마다 바꿔서 새 그림이 '처음부터 흐린 상태'로 그려지게 합니다.
          같은 엘리먼트를 재사용하면 이전 문항의 선명한 상태에서 흐려지는 애니메이션이 재생돼
          다음 그림이 0.7초 동안 먼저 보여 버립니다.
        */}
        <img
          key={item.id}
          src={item.image}
          alt={revealed ? item.name : "아직 공개되지 않은 흐릿한 그림"}
          draggable={false}
          className="mx-auto h-48 w-48 select-none object-contain transition-[filter] duration-700 sm:h-72 sm:w-72"
          // 정답을 공개하면 그림도 선명하게 보여 줍니다. (정답 글자는 이미 나와 있어 추가로 새는 정보가 없음)
          style={{ filter: `blur(${revealed ? 0 : blurValues[stage]}px)` }}
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
  const [scores, setScores] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const done = stopped || index >= totalQuestions;
  const question = questions[index % questions.length];
  const team = game.teams[Math.floor(index / 5)];
  const markShown = useShownHistory(CHOSUNG_HISTORY_KEY, CHOSUNG_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(question?.answers[0]);
  }, [done, markShown, question]);

  const timeUp = useCallback(() => {
    setAnswered(true);
    playWrong();
  }, []);

  const letters = chosungLength(question?.chosung ?? "");
  const scale = Math.min(letters, CHOSUNG_MAX_SCALE);
  const points = scale;
  const seconds = useDeadlineCountdown(
    !done && !answered && !revealed,
    scale * CHOSUNG_SECONDS_PER_CHAR,
    timeUp,
    index,
  );

  const next = () => {
    setIndex((value) => value + 1);
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
            note: "글자 수만큼 점수 (2자 2점 ~ 5자 5점)",
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
      <EarlyFinish
        ready={index > 0 && index % 5 === 0 && !revealed && !answered}
        done={index / 5}
        onFinish={() => setStopped(true)}
      />
      <Countdown seconds={seconds} />
      <div className="rounded-3xl bg-[#4ECDC4] p-8 text-7xl font-black sm:text-9xl">{question.chosung}</div>
      <p className="text-lg font-black text-[#4A4A5E]">
        {letters}글자 · 맞히면 +{points}점 · {scale * CHOSUNG_SECONDS_PER_CHAR}초
      </p>
      <div className="grid gap-3 sm:grid-cols-4">
        <Button
          tone="green"
          disabled={answered}
          onClick={() => {
            setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + points }));
            setAnswered(true);
            setRevealed(true);
            playCorrect();
            correctConfetti();
          }}
        >
          정답 +{points}
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
        <Button
          tone="yellow"
          onClick={() => {
            // 진행자가 답을 모를 수도 있어서, 정답을 본 뒤에도 채점할 수 있게 둡니다.
            // 대신 타이머는 멈춥니다.
            setRevealed(true);
          }}
        >
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
  const [stopped, setStopped] = useState(false);
  // 팀 수의 배수로 맞춰야 선착순이어도 기회가 고르게 돌아갑니다. (3팀이면 9문제)
  const questionCount = balancedQuestionCount(9, game.teams.length, questions.length);
  const question = questions[index % questions.length];
  const done = stopped || index >= questionCount;
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
            note: `정답을 외친 팀에게 ${EMOJI_POINT}점`,
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
      <EarlyFinish
        ready={!revealed && !awardedTeamId && index > 0}
        done={index}
        onFinish={() => setStopped(true)}
      />
      <div className="rounded-3xl bg-white p-8 text-7xl leading-tight sm:text-9xl">{question.emoji}</div>
      {/* 이모지만으로는 범위가 너무 넓어서, 갈래와 글자 수를 같이 줍니다. */}
      <p className="rounded-xl bg-[#FFF3BF] p-4 text-2xl font-black">
        {question.category} · {question.answers[0].replace(/\s/g, "").length}글자
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {game.teams.map((team) => (
          <Button
            key={team.id}
            tone={team.color === "red" ? "red" : team.color === "blue" ? "blue" : "green"}
            disabled={Boolean(awardedTeamId)}
            onClick={() => {
              setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + EMOJI_POINT }));
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
        <p className="rounded-xl bg-[#D3F9D8] p-3 font-black text-[#1B5E20]">
          이 문제는 이미 점수가 들어갔어요. 다음 문제로 넘어가세요.
        </p>
      )}
      {revealed && (
        <p className="rounded-xl bg-[#FFF3BF] p-4 text-2xl font-black">정답: {question.answers.join(", ")}</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button tone="yellow" onClick={() => setRevealed(true)} disabled={revealed}>
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
    </section>
  );
}

function LieDetectorRound({ game, content, type }: { game: GameState; content: unknown; type: RoundType }) {
  // 팀마다 같은 문제 수가 돌아가도록 팀 수의 배수로 맞춥니다. (3팀이면 10문제 → 9문제)
  const targetCount = balancedQuestionCount(10, game.teams.length, LIE_DETECTOR_FACTS.length);
  const questions = useMemo(() => selectLieQuestions(content, targetCount), [content, targetCount]);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  // 진행자가 문제를 읽어줄 시간을 주고 시작합니다. (바로 카운트가 시작되면 첫 문제가 불리해요)
  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);
  const questionCount = Math.min(targetCount, questions.length);
  const done = stopped || index >= questionCount;
  const question = questions[index % questions.length];
  const team = game.teams[index % game.teams.length];
  const markShown = useShownHistory(LIE_HISTORY_KEY, LIE_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(question?.fact);
  }, [done, markShown, question]);

  const timeUp = useCallback(() => {
    setFeedback(`시간 종료! 정답은 ${question.isTrue ? "진실" : "거짓"}. ${question.explanation}`);
    playWrong();
  }, [question]);

  // 남은 초가 곧 점수라, 제한 시간이 그대로 문항당 상한이 됩니다. 팀당 세 문제 × 8점.
  const seconds = useDeadlineCountdown(started && !done && !feedback, 8, timeUp, index);

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
      <EarlyFinish
        ready={!started && !feedback && evenTurns(index, game.teams.length) > 0}
        done={evenTurns(index, game.teams.length)}
        onFinish={() => setStopped(true)}
      />
      <div className="rounded-3xl bg-white p-6 text-3xl font-black leading-tight sm:text-5xl">{question.fact}</div>
      {!started && !feedback ? (
        <Button tone="red" className="text-2xl" onClick={() => setStarted(true)}>
          문제 읽어주고 시작
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button tone="green" className="text-2xl" disabled={Boolean(feedback)} onClick={() => answer(true)}>
            진실
          </Button>
          <Button tone="red" className="text-2xl" disabled={Boolean(feedback)} onClick={() => answer(false)}>
            거짓
          </Button>
        </div>
      )}
      {feedback && (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-xl font-black">{feedback}</p>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              setIndex((value) => value + 1);
              setFeedback("");
              setStarted(false);
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
  const [stopped, setStopped] = useState(false);
  const totalQuestions = game.teams.length * wordsPerTeam;
  const done = stopped || index >= totalQuestions;
  const team = game.teams[index % game.teams.length];
  const currentWord = words[index % words.length];
  const markShown = useShownHistory(SILENT_HISTORY_KEY, WORD_HISTORY_LIMIT);

  useEffect(() => {
    // 숨긴 채 넘어간 단어는 실제로 낸 게 아니라 이력에 넣지 않습니다.
    if (!done && showWord) markShown(currentWord);
  }, [currentWord, done, markShown, showWord]);

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
      <EarlyFinish
        ready={!showWord && evenTurns(index, game.teams.length) > 0}
        done={evenTurns(index, game.teams.length)}
        onFinish={() => setStopped(true)}
      />
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

  const finishTurn = useCallback(() => {
    setScores((value) => ({ ...value, [team.id]: correctRef.current * CHARADES_POINT }));
    setPhase("done");
  }, [team.id]);

  const seconds = useDeadlineCountdown(phase === "playing", CHARADES_SECONDS, finishTurn, teamIndex);

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
            note: `맞힌 개수당 ${CHARADES_POINT}점`,
          }}
        >
          점수 입력 확인
        </SaveRoundButton>
      </section>
    );
  }

  const start = () => {
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
            표현하는 사람만 단어를 보고, 말 없이 몸짓으로 설명합니다. 2분 동안 맞힌 개수 × 2점이에요.
          </p>
          <Button tone="red" className="text-2xl" onClick={start}>
            2분 시작
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
          <p className="text-2xl font-black">현재 {correct}개 · 예상 +{correct * CHARADES_POINT}점</p>
        </>
      ) : (
        <>
          <p className="rounded-xl bg-[#D3F9D8] p-5 text-3xl font-black">{team.name} +{correct * CHARADES_POINT}점!</p>
          <Button tone="blue" className="text-2xl" onClick={nextTeam}>
            {teamIndex < game.teams.length - 1 ? "다음 팀" : "결과 보기"}
          </Button>
        </>
      )}
    </section>
  );
}

/**
 * 기억 도둑 — 타일을 잠깐 보여준 뒤 하나를 빼고 다시 보여줍니다.
 * 주제와 조합을 매번 새로 뽑기 때문에 세 판을 해도 같은 문제가 나오지 않습니다.
 */
function MemoryThiefRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const tiers = [
    { tiles: 6, seconds: 10 },
    { tiles: 8, seconds: 12 },
    { tiles: 10, seconds: 14 },
  ];
  const totalQuestions = teams.length * tiers.length;

  const questions = useMemo(() => {
    const themes = preferFresh(MEMORY_THEMES, MEMORY_HISTORY_KEY, (theme) => theme.id);
    const built: { themeId: string; theme: string; tiles: string[]; missing: string; seconds: number }[] = [];

    for (let index = 0; index < totalQuestions; index += 1) {
      const theme = themes[index % themes.length];
      const tier = tiers[Math.floor(index / teams.length) % tiers.length];
      const picked = shuffle(theme.tiles).slice(0, Math.min(tier.tiles, theme.tiles.length));
      built.push({
        // 이력은 id로 비교하므로 id를 그대로 들고 다녀야 최근 주제가 실제로 걸러집니다.
        themeId: theme.id,
        theme: theme.name,
        tiles: picked,
        missing: picked[randomIndex(picked.length)],
        seconds: tier.seconds,
      });
    }

    return built;
  }, [totalQuestions, teams.length]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "memorize" | "recall" | "revealed">("ready");
  const [stopped, setStopped] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [scored, setScored] = useState(false);
  const done = stopped || index >= totalQuestions;
  const question = questions[index % questions.length];
  // 블록마다 시작 팀을 돌려서 어려운 문제가 같은 팀에 몰리지 않게 합니다.
  const block = Math.floor(index / teams.length);
  const team = teams[(index + block) % teams.length];
  const markShown = useShownHistory(MEMORY_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(question?.themeId);
  }, [done, markShown, question]);

  const hideOne = useCallback(() => setPhase("recall"), []);
  const seconds = useDeadlineCountdown(phase === "memorize", question?.seconds ?? 10, hideOne, index);

  // 정답을 공개할 때 타일이 또 섞이면 헷갈리므로, 하나 뺀 배치는 문항마다 한 번만 정합니다.
  const remainingTiles = useMemo(
    () => shuffle(question.tiles.filter((tile) => tile !== question.missing)),
    [question],
  );
  const shownTiles = phase === "ready" || phase === "memorize" ? question.tiles : remainingTiles;

  const next = () => {
    setIndex((value) => value + 1);
    setPhase("ready");
    setScored(false);
  };

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="기억 도둑 결과"
        scores={scores}
        note="사라진 그림 맞히면 5점"
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {index + 1} / {totalQuestions} 문제 · 주제: {question.theme}
      </p>
      <EarlyFinish
        ready={phase === "ready" && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />

      {phase === "ready" && (
        <>
          <p className="rounded-xl bg-[#F6FBFF] p-4 text-lg font-bold">
            {question.seconds}초 동안 {question.tiles.length}개를 외우세요. 그다음 하나가 사라집니다.
          </p>
          <Button tone="red" className="text-2xl" onClick={() => setPhase("memorize")}>
            외우기 시작
          </Button>
        </>
      )}

      {phase === "memorize" && (
        <>
          <Countdown seconds={seconds} />
          <Button tone="white" onClick={hideOne}>
            다 외웠어요 (바로 넘기기)
          </Button>
        </>
      )}

      {(phase === "memorize" || phase === "recall" || phase === "revealed") && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shownTiles.map((tile) => (
            <div key={tile} className="rounded-xl border-3 border-[#171721] bg-white p-3 text-lg font-black">
              {tile}
            </div>
          ))}
        </div>
      )}

      {/*
        진행자도 무엇이 사라졌는지 기억하지 못합니다. 그래서 먼저 정답을 확인하고,
        그다음에 팀이 말한 답과 맞춰 보고 점수를 줍니다.
      */}
      {phase === "recall" && (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-xl font-black">무엇이 사라졌을까요?</p>
          <p className="font-bold text-[#4A4A5E]">팀이 답을 말하면 정답을 확인하세요.</p>
          <Button tone="yellow" className="text-2xl" onClick={() => setPhase("revealed")}>
            정답 보기
          </Button>
        </>
      )}

      {phase === "revealed" && (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-2xl font-black">사라진 것: {question.missing}</p>
          {!scored ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                tone="green"
                className="text-2xl"
                onClick={() => {
                  setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + MEMORY_POINT }));
                  setScored(true);
                  playCorrect();
                  correctConfetti();
                }}
              >
                맞혔어요 +{MEMORY_POINT}
              </Button>
              <Button tone="red" className="text-2xl" onClick={() => { setScored(true); playWrong(); }}>
                못 맞혔어요
              </Button>
            </div>
          ) : (
          <Button tone="blue" className="text-2xl" onClick={next}>
            {index + 1 >= totalQuestions ? "결과 보기" : "다음 문제"}
          </Button>
          )}
        </>
      )}
    </section>
  );
}

/** 순서 맞추기 — 섞인 네 장면을 두 개씩 눌러 자리를 바꿔 정렬합니다. */
function SequenceOrderRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const totalQuestions = teams.length * 3;
  // 난이도별로 팀 수만큼 뽑아 블록을 만듭니다. 한 팀만 어려운 문제를 몰아 받지 않게요.
  const cards = useMemo(() => {
    const picked: typeof SEQUENCE_CARDS = [];
    for (const tier of [1, 2, 3] as const) {
      const pool = preferFresh(
        SEQUENCE_CARDS.filter((card) => card.tier === tier),
        SEQUENCE_HISTORY_KEY,
        (card) => card.id,
      );
      for (let seat = 0; seat < teams.length; seat += 1) {
        if (pool.length) picked.push(pool[seat % pool.length]);
      }
    }
    return picked;
  }, [teams.length]);

  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [arrangement, setArrangement] = useState<string[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [stopped, setStopped] = useState(false);
  const done = stopped || index >= Math.min(totalQuestions, cards.length);
  const card = cards[index % Math.max(1, cards.length)];
  const block = Math.floor(index / teams.length);
  const team = teams[(index + block) % teams.length];
  const markShown = useShownHistory(SEQUENCE_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(card?.id);
  }, [card, done, markShown]);

  useEffect(() => {
    if (done || !card) return;
    // 정답 그대로 나오면 문제가 안 되므로, 정답과 달라질 때까지 다시 섞습니다.
    let next = shuffle(card.ordered);
    let guard = 0;
    while (next.every((item, position) => item === card.ordered[position]) && guard < 10) {
      next = shuffle(card.ordered);
      guard += 1;
    }
    setArrangement(next);
    setPicked(null);
    setLocked(false);
    lockedRef.current = false;
  }, [card, done]);

  const swap = (position: number) => {
    if (locked) return;
    if (picked === null) {
      setPicked(position);
      return;
    }
    if (picked === position) {
      setPicked(null);
      return;
    }
    setArrangement((current) => {
      const next = [...current];
      [next[picked], next[position]] = [next[position], next[picked]];
      return next;
    });
    setPicked(null);
  };

  const gained = useMemo(() => {
    // 배열이 아직 안 채워졌을 때 채점하면 빈 배열의 every()가 참이라 만점이 됩니다.
    if (!card || arrangement.length !== card.ordered.length) return 0;
    const correct = arrangement.every((item, position) => item === card.ordered[position]);
    if (correct) return SEQUENCE_POINT;
    // 붙어 있는 두 장만 뒤바뀐 아까운 경우는 절반 점수를 줍니다.
    const wrong = arrangement.map((item, position) => (item === card.ordered[position] ? -1 : position)).filter((p) => p >= 0);
    if (wrong.length === 2 && wrong[1] - wrong[0] === 1) return SEQUENCE_PARTIAL;
    return 0;
  }, [arrangement, card]);

  // 타이머 콜백은 만들어질 당시의 gained를 붙들고 있어서, 최신 배열을 ref로 읽습니다.
  const gainedRef = useRef(0);
  useEffect(() => {
    gainedRef.current = gained;
  }, [gained]);

  const lockedRef = useRef(false);
  const lock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + gainedRef.current }));
    if (gainedRef.current > 0) {
      playCorrect();
      correctConfetti();
    } else {
      playWrong();
    }
  }, [team.id]);

  // 시간이 다 되면 그 시점의 배열 그대로 채점합니다.
  const seconds = useDeadlineCountdown(!locked && !done, SEQUENCE_SECONDS, lock, index);

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="순서 맞추기 결과"
        scores={scores}
        note={`정확히 맞히면 ${SEQUENCE_POINT}점, 두 장만 바뀌었으면 ${SEQUENCE_PARTIAL}점`}
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {index + 1} / {totalQuestions} 문제
      </p>
      <h2 className="rounded-xl bg-[#4ECDC4] p-4 text-2xl font-black">{card.prompt}</h2>
      <EarlyFinish
        ready={!locked && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />
      <p className="font-bold text-[#4A4A5E]">두 칸을 차례로 눌러 자리를 바꾸세요. {SEQUENCE_SECONDS}초!</p>
      {!locked && <Countdown seconds={seconds} />}

      <div className="grid gap-3">
        {arrangement.map((item, position) => {
          const correctHere = locked && item === card.ordered[position];
          return (
            <button
              key={item}
              type="button"
              disabled={locked}
              onClick={() => swap(position)}
              className={`tv-button rounded-xl px-4 py-3 text-left text-xl font-black ${
                picked === position ? "bg-[#FFE66D]" : locked ? (correctHere ? "bg-[#D3F9D8]" : "bg-[#FFE3E3]") : "bg-white"
              }`}
            >
              {position + 1}. {item}
            </button>
          );
        })}
      </div>

      {!locked ? (
        <Button
          tone="red"
          className="text-2xl"
          disabled={arrangement.length !== card.ordered.length}
          onClick={lock}
        >
          이 순서로 확정
        </Button>
      ) : (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-lg font-black">
            정답: {card.ordered.join(" → ")} (+{gained}점)
          </p>
          <p className="rounded-xl bg-white p-3 font-bold">{card.explanation}</p>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => setIndex((value) => value + 1)}
          >
            {index + 1 >= totalQuestions ? "결과 보기" : "다음 문제"}
          </Button>
        </>
      )}
    </section>
  );
}

/** 말하면 지는 인터뷰 — 팀마다 공격 2회·방어 2회로 정확히 균등합니다. */
function TrapInterviewRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  // 3팀이면 A→B, B→C, C→A, A→C, C→B, B→A.
  // 2팀은 조합이 두 개뿐이라 한 바퀴 더 돌려서, 팀 수와 상관없이 공격 2회·방어 2회로 맞춥니다.
  const matchups = useMemo(() => {
    const list: { attacker: Team; defender: Team }[] = [];
    // 팀이 몇이든 공격 2회·방어 2회가 되도록 항상 두 바퀴를 돕니다.
    // 3팀은 상대를 바꿔 가며(A→B, A→C), 2팀은 같은 상대와 두 번 붙습니다.
    const blocks = 2;
    for (let block = 0; block < blocks; block += 1) {
      const gap = (block % Math.max(1, teams.length - 1)) + 1;
      for (let seat = 0; seat < teams.length; seat += 1) {
        // 블록마다 첫 공격팀을 한 칸씩 밀어 같은 팀이 매번 먼저 시작하지 않게 합니다.
        const attackerSeat = (seat + block) % teams.length;
        list.push({ attacker: teams[attackerSeat], defender: teams[(attackerSeat + gap) % teams.length] });
      }
    }
    return list;
  }, [teams]);

  const cards = useMemo(
    () => preferFresh(TRAP_CARDS, TRAP_HISTORY_KEY, (card) => card.id).slice(0, matchups.length),
    [matchups.length],
  );

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "interview" | "judged">("ready");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showCard, setShowCard] = useState(false);
  const [stopped, setStopped] = useState(false);
  const done = stopped || index >= matchups.length;
  const card = cards[index % Math.max(1, cards.length)];
  const matchup = matchups[index % matchups.length];
  const markShown = useShownHistory(TRAP_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(card?.id);
  }, [card, done, markShown]);

  const [verdict, setVerdict] = useState("");
  // 판정은 대결당 한 번만. 상태 업데이터 안에서 점수를 주면 StrictMode에서 두 번 실행되므로
  // 잠금은 ref로 하고 점수 반영은 업데이터 밖에서 합니다.
  const judgedRef = useRef(false);

  const award = useCallback(
    (attackerWon: boolean, reason: string, bonus = 0) => {
      if (judgedRef.current) return;
      judgedRef.current = true;

      const winner = attackerWon ? matchup.attacker : matchup.defender;
      const gained = INTERVIEW_POINT + bonus;
      setScores((value) => ({ ...value, [winner.id]: (value[winner.id] ?? 0) + gained }));
      setVerdict(`${reason} — ${winner.name} +${gained}`);
      setPhase("judged");
      playCorrect();
      correctConfetti();
    },
    [matchup],
  );

  // 30초를 버티면 방어 성공입니다. 판정 없이 넘어가 아무도 점수를 못 받는 일이 없게 합니다.
  const timeUp = useCallback(() => award(false, "30초를 버텼습니다"), [award]);
  const seconds = useDeadlineCountdown(phase === "interview", 30, timeUp, index);

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="말하면 지는 인터뷰 결과"
        scores={scores}
        note={`팀마다 공격 2회·방어 2회, 이긴 쪽 +${INTERVIEW_POINT} / 거짓말 들통나면 공격팀 +${INTERVIEW_POINT + INTERVIEW_LIE_BONUS}`}
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <TeamPill team={matchup.attacker} active />
        <span className="text-xl font-black">공격 →</span>
        <TeamPill team={matchup.defender} />
      </div>
      <p className="text-xl font-black">
        {index + 1} / {matchups.length} 대결
      </p>
      <EarlyFinish
        ready={phase === "ready" && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />
      <p className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        공격팀만 화면을 봅니다. 30초 안에 상대가 금지어를 말하게 유도하세요.
        방어팀은 3초 안에 계속 대답해야 하고, 금지어를 말하면 집니다.
        <br />
        <span className="text-[#C92A2A]">
          단, 금지어를 피하려고 사실이 아닌 말을 하면 안 됩니다. (친구인데 모녀라고 하기 같은 것)
          거짓말이 들통나면 공격팀이 {INTERVIEW_POINT + INTERVIEW_LIE_BONUS}점을 가져갑니다.
        </span>
      </p>

      <div className="rounded-3xl border-4 border-[#171721] bg-white p-5">
        {showCard ? (
          <div className="grid gap-3">
            <p className="text-lg font-bold text-[#4A4A5E]">주제</p>
            <p className="text-3xl font-black">{card.topic}</p>
            <p className="mt-2 text-lg font-bold text-[#4A4A5E]">금지어</p>
            <p className="text-2xl font-black text-[#C92A2A]">{card.forbidden.join(" · ")}</p>
            <p className="mt-2 rounded-xl bg-[#FFF3BF] p-3 font-black">첫 질문: {card.opener}</p>
          </div>
        ) : (
          <p className="text-2xl font-black">카드 숨김</p>
        )}
      </div>
      {/* 인터뷰가 시작되면 금지어가 방어팀에게 보이면 안 되므로 공개 버튼을 잠급니다. */}
      <Button tone="yellow" disabled={phase !== "ready"} onClick={() => setShowCard((value) => !value)}>
        {showCard ? "카드 숨기기" : "공격팀만 보기"}
      </Button>

      {phase === "ready" && (
        <Button
          tone="red"
          className="text-2xl"
          onClick={() => {
            setShowCard(false);
            setPhase("interview");
          }}
        >
          30초 인터뷰 시작
        </Button>
      )}
      {phase === "interview" && <Countdown seconds={seconds} />}

      {phase === "interview" && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Button tone="green" className="text-xl" onClick={() => award(true, "금지어를 말했습니다")}>
            금지어 나왔다 · {matchup.attacker.name} +{INTERVIEW_POINT}
          </Button>
          <Button
            tone="red"
            className="text-xl"
            onClick={() => award(true, "거짓말로 피했습니다", INTERVIEW_LIE_BONUS)}
          >
            거짓말했다 · {matchup.attacker.name} +{INTERVIEW_POINT + INTERVIEW_LIE_BONUS}
          </Button>
          <Button tone="blue" className="text-xl" onClick={() => award(false, "끝까지 버텼습니다")}>
            버텼다 · {matchup.defender.name} +{INTERVIEW_POINT}
          </Button>
        </div>
      )}

      {phase === "judged" && (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-xl font-black">{verdict}</p>
          <Button
            tone="white"
            className="text-2xl"
            onClick={() => {
              judgedRef.current = false;
              setIndex((value) => value + 1);
              setPhase("ready");
              setShowCard(false);
              setVerdict("");
            }}
          >
            {index + 1 >= matchups.length ? "결과 보기" : "다음 대결"}
          </Button>
        </>
      )}
    </section>
  );
}

/**
 * 눈치 올인 — 세 팀이 동시에 손가락으로 1·2·3을 펴서 공개하고, 진행자가 앱에 기록합니다.
 * 정답이 없어서 지식 차이가 전혀 없고, 남을 읽는 게 실력인 유일한 라운드입니다.
 */
function NunchiAllInRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const ROUNDS = 6;
  const deciderLabel: Record<NunchiPrompt["decider"], string> = {
    child: "아이가 결정",
    adult: "어른이 결정",
    together: "같이 결정",
  };

  const prompts = useMemo(() => {
    // 결정자를 아이·어른·같이 각 2번씩 고정해 한쪽만 계속 정하지 않게 합니다.
    const plan: NunchiPrompt["decider"][] = ["child", "adult", "together", "adult", "together", "child"];
    // 결정자별 풀은 한 번만 만들고 커서로 하나씩 꺼냅니다. 슬롯마다 다시 뽑으면 같은 문항이 또 나와요.
    const pools = new Map<NunchiPrompt["decider"], NunchiPrompt[]>();
    const cursor = new Map<NunchiPrompt["decider"], number>();

    return plan.map((decider) => {
      if (!pools.has(decider)) {
        pools.set(
          decider,
          preferFresh(
            NUNCHI_PROMPTS.filter((prompt) => prompt.decider === decider),
            NUNCHI_HISTORY_KEY,
            (prompt) => prompt.id,
          ),
        );
        cursor.set(decider, 0);
      }
      const pool = pools.get(decider) ?? [];
      const at = cursor.get(decider) ?? 0;
      cursor.set(decider, at + 1);
      return pool[at % Math.max(1, pool.length)];
    });
  }, []);

  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [allIn, setAllIn] = useState<Record<string, boolean>>({});
  const [allInUsed, setAllInUsed] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [stopped, setStopped] = useState(false);
  const done = stopped || index >= ROUNDS;
  const prompt = prompts[index % prompts.length];
  const markShown = useShownHistory(NUNCHI_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(prompt?.id);
  }, [done, markShown, prompt]);

  const allPicked = teams.every((team) => picks[team.id]);

  // 혼자 고른 팀이 크게 먹고, 다 갈리면 모두 조금씩, 다 같으면 아무도 못 받습니다.
  const gains = useMemo(() => {
    const result: Record<string, number> = {};
    if (!allPicked) return result;

    const counts = new Map<number, number>();
    for (const team of teams) {
      const choice = picks[team.id];
      counts.set(choice, (counts.get(choice) ?? 0) + 1);
    }

    for (const team of teams) {
      const shared = counts.get(picks[team.id]) ?? 1;
      // 세 팀 이상에서 "모두 다름"은 2점, 혼자만 다른 답이면 3점.
      // 두 팀에서는 다르게 고른 순간 서로 혼자이므로 3점으로 맞춰 상한을 통일합니다.
      const base = shared === 1 ? (teams.length >= 3 && counts.size === teams.length ? 2 : 3) : 0;
      result[team.id] = allIn[team.id] ? base * 2 : base;
    }

    return result;
  }, [allIn, allPicked, picks, teams]);

  const confirm = () => {
    setScores((value) => {
      const next = { ...value };
      for (const team of teams) next[team.id] = (next[team.id] ?? 0) + (gains[team.id] ?? 0);
      return next;
    });
    setAllInUsed((value) => {
      const next = { ...value };
      for (const team of teams) if (allIn[team.id]) next[team.id] = true;
      return next;
    });
    setRevealed(true);
    playCorrect();
    correctConfetti();
  };

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="눈치 올인 결과"
        scores={scores}
        note="다른 팀과 안 겹치면 2~3점, 겹치면 0점, 올인은 두 배"
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <p className="text-xl font-black">
        {index + 1} / {ROUNDS} 문제 · {deciderLabel[prompt.decider]}
      </p>
      <EarlyFinish
        ready={!revealed && index > 0}
        done={index}
        onFinish={() => setStopped(true)}
      />
      <h2 className="rounded-xl bg-[#4ECDC4] p-4 text-2xl font-black">{prompt.prompt}</h2>
      <div className="grid gap-2 sm:grid-cols-3">
        {prompt.choices.map((choice, choiceIndex) => (
          <div key={choice} className="rounded-xl border-3 border-[#171721] bg-white p-3 font-black">
            {choiceIndex + 1}. {choice}
          </div>
        ))}
      </div>
      <p className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        팀끼리 조용히 정한 뒤, 셋 세면 손가락으로 동시에 펴서 공개하세요. 그다음 진행자가 아래에 기록합니다.
        <b>다른 팀과 겹치면 0점</b>이고, 혼자만 고른 답이면 3점(모두 다르면 2점씩)이에요.
        올인은 팀마다 한 번, 그 문제 점수가 두 배가 됩니다.
      </p>

      <div className="grid gap-3">
        {teams.map((team) => (
          <div key={team.id} className="grid gap-2 rounded-xl bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <TeamPill team={team} />
              <Button
                tone={allIn[team.id] ? "red" : "white"}
                className="min-h-[44px] text-sm"
                disabled={revealed || allInUsed[team.id]}
                onClick={() => setAllIn((value) => ({ ...value, [team.id]: !value[team.id] }))}
              >
                {allInUsed[team.id] ? "올인 사용함" : allIn[team.id] ? "올인!" : "올인 걸기"}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((choice) => (
                <Button
                  key={choice}
                  tone={picks[team.id] === choice ? "yellow" : "white"}
                  className="min-h-[52px]"
                  disabled={revealed}
                  onClick={() => setPicks((value) => ({ ...value, [team.id]: choice }))}
                >
                  {choice}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!revealed ? (
        <Button tone="red" className="text-2xl" disabled={!allPicked} onClick={confirm}>
          {allPicked ? "점수 계산" : "모든 팀 선택을 기록하세요"}
        </Button>
      ) : (
        <>
          <div className="grid gap-2 rounded-xl bg-[#FFF3BF] p-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between text-lg font-black">
                <span>
                  {teamMark(team)} {team.name} · {prompt.choices[(picks[team.id] ?? 1) - 1]}
                  {allIn[team.id] ? " (올인)" : ""}
                </span>
                <span>+{gains[team.id] ?? 0}점</span>
              </div>
            ))}
          </div>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              setIndex((value) => value + 1);
              setPicks({});
              setAllIn({});
              setRevealed(false);
            }}
          >
            {index + 1 >= ROUNDS ? "결과 보기" : "다음 문제"}
          </Button>
        </>
      )}
    </section>
  );
}

/** 열거 대결 — 30초 안에 정해진 개수를 대면 성공. 팀마다 아이·어른·공통 문항을 하나씩 받습니다. */
function ListRaceRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const bands: ListChallenge["band"][] = ["child", "adult", "common"];
  const bandLabel: Record<ListChallenge["band"], string> = {
    child: "아이가 주도",
    adult: "어른이 주도",
    common: "다 같이",
  };
  const totalQuestions = teams.length * bands.length;

  const challenges = useMemo(() => {
    const picked: ListChallenge[] = [];
    for (const band of bands) {
      const pool = preferFresh(
        LIST_CHALLENGES.filter((challenge) => challenge.band === band),
        LIST_HISTORY_KEY,
        (challenge) => challenge.id,
      );
      for (let seat = 0; seat < teams.length; seat += 1) picked.push(pool[seat % pool.length]);
    }
    return picked;
  }, [teams.length]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "listing" | "judged">("ready");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [stopped, setStopped] = useState(false);
  const done = stopped || index >= totalQuestions;
  const challenge = challenges[index % challenges.length];
  const block = Math.floor(index / teams.length);
  const team = teams[(index + block) % teams.length];
  const markShown = useShownHistory(LIST_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);
  const scoredRef = useRef(false);

  useEffect(() => {
    if (!done) markShown(challenge?.id);
  }, [challenge, done, markShown]);

  const timeUp = useCallback(() => setPhase("judged"), []);
  const seconds = useDeadlineCountdown(phase === "listing", 30, timeUp, index);

  const judge = (success: boolean) => {
    if (scoredRef.current) return;
    scoredRef.current = true;
    if (success) {
      setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + LIST_POINT }));
      playCorrect();
      correctConfetti();
    } else {
      playWrong();
    }
    setPhase("judged");
  };

  if (done) {
    return <RoundResult game={game} type={type} title="열거 대결 결과" scores={scores} note="개수를 다 채우면 5점" />;
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {index + 1} / {totalQuestions} 문제 · {bandLabel[challenge.band]}
      </p>
      <EarlyFinish
        ready={phase === "ready" && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />
      <div className="rounded-3xl bg-[#FFE66D] p-6">
        <p className="text-3xl font-black sm:text-4xl">{challenge.category}</p>
        <p className="mt-2 text-2xl font-black text-[#C92A2A]">{challenge.target}개!</p>
      </div>
      <p className="rounded-xl bg-[#F6FBFF] p-3 font-bold">판정 기준: {challenge.hint}</p>

      {phase === "ready" && (
        <Button tone="red" className="text-2xl" onClick={() => setPhase("listing")}>
          30초 시작
        </Button>
      )}
      {phase === "listing" && (
        <>
          <Countdown seconds={seconds} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button tone="green" className="text-2xl" onClick={() => judge(true)}>
              {challenge.target}개 성공 +5
            </Button>
            <Button tone="white" className="text-2xl" onClick={() => judge(false)}>
              포기
            </Button>
          </div>
        </>
      )}
      {phase === "judged" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button tone="green" className="text-xl" disabled={scoredRef.current} onClick={() => judge(true)}>
              성공 +5
            </Button>
            <Button tone="red" className="text-xl" disabled={scoredRef.current} onClick={() => judge(false)}>
              실패
            </Button>
          </div>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              scoredRef.current = false;
              setIndex((value) => value + 1);
              setPhase("ready");
            }}
          >
            {index + 1 >= totalQuestions ? "결과 보기" : "다음 문제"}
          </Button>
        </>
      )}
    </section>
  );
}

/** 한글 단어를 글자 단위로 뒤집습니다. "무지개" → "개지무" */
function reverseHangul(word: string) {
  return [...word.replace(/\s+/g, "")].reverse().join("");
}

/** 거꾸로 말하기 — 단어를 거꾸로 말하면 성공. 틀릴 때가 더 웃긴 라운드입니다. */
function ReverseTalkRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const totalQuestions = teams.length * 4;

  // 단어가 화면에 떠 있으면 눈으로 읽어 내려오면 그만이라 너무 쉬웠어요.
  // 이제 진행자만 보고 읽어 주므로, 외우기까지 해야 합니다. 그만큼 글자 수는 줄였습니다.
  const MIN_CHARS_BY_BLOCK = [6, 8, 10, 12];

  const questions = useMemo(() => {
    const source = uniqueStrings([...SPEED_QUIZ_WORDS, ...SILENT_SHOUT_WORDS]).filter(
      (word) =>
        !/\s/.test(word) &&
        /^[가-힣]+$/.test(word) &&
        word.length >= 2 &&
        word.length <= 4 &&
        // "삐삐"처럼 거꾸로 해도 같은 단어는 문제가 성립하지 않습니다.
        word !== reverseHangul(word),
    );
    // 풀과 커서를 하나만 써서 라운드 전체에 같은 단어가 두 번 나오지 않게 합니다.
    const pool = preferFresh(source, REVERSE_HISTORY_KEY, (word) => word);
    let cursor = 0;

    const built: string[][] = [];
    for (const minChars of MIN_CHARS_BY_BLOCK) {
      for (let seat = 0; seat < teams.length; seat += 1) {
        const group: string[] = [];
        let chars = 0;
        while (chars < minChars && cursor < pool.length) {
          const next = pool[cursor];
          cursor += 1;
          group.push(next);
          chars += next.length;
        }
        if (group.length) built.push(group);
      }
    }
    return built;
  }, [teams.length]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "thinking" | "judged">("ready");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  // 진행자가 읽어 줄 동안에만 단어를 띄웁니다. 시작하면 다시 감춰서 눈으로 못 읽게 합니다.
  const [showWords, setShowWords] = useState(false);
  const [judged, setJudged] = useState(false);
  const [stopped, setStopped] = useState(false);
  const done = stopped || index >= Math.min(totalQuestions, questions.length);
  const group = questions[index % Math.max(1, questions.length)] ?? [];
  const totalChars = group.reduce((sum, word) => sum + word.length, 0);
  // 듣고 외우는 시간이 필요해서 글자당 1.5초를 줍니다. 8글자면 12초, 12글자면 18초.
  const limitSeconds = Math.max(10, Math.round(totalChars * 1.5));
  const block = Math.floor(index / teams.length);
  const team = teams[(index + block) % teams.length];
  const markShown = useShownHistory(REVERSE_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);
  const scoredRef = useRef(false);

  useEffect(() => {
    if (done) return;
    for (const word of group) markShown(word);
  }, [done, group, markShown]);

  // 진행자가 "반침나"가 맞는지 암산으로 확인하긴 어렵습니다.
  // 그래서 시간이 끝나면 뒤집은 답을 먼저 띄우고, 그걸 보면서 판정하게 합니다.
  const timeUp = useCallback(() => {
    setShowAnswer(true);
    setPhase("judged");
  }, []);
  const seconds = useDeadlineCountdown(phase === "thinking", limitSeconds, timeUp, index);

  const judge = (success: boolean) => {
    if (scoredRef.current) return;
    scoredRef.current = true;
    setJudged(true);
    if (success) {
      setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + REVERSE_POINT }));
      playCorrect();
      correctConfetti();
    } else {
      playWrong();
    }
    setShowAnswer(true);
    setPhase("judged");
  };

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="거꾸로 말하기 결과"
        scores={scores}
        note="듣고 외운 단어를 전부 거꾸로 말하면 5점"
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {index + 1} / {totalQuestions} 문제 · {group.length}단어 {totalChars}글자
      </p>
      <EarlyFinish
        ready={phase === "ready" && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />
      {showWords || showAnswer ? (
        <div className="grid gap-2 rounded-3xl bg-[#FFE66D] p-5 sm:grid-cols-2">
          {group.map((word, position) => (
            <div key={`${word}-${position}`} className="rounded-xl bg-white/70 p-3 text-3xl font-black sm:text-4xl">
              {position + 1}. {word}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#FFE66D] p-8 text-4xl font-black sm:text-5xl">
          🙈 {group.length}단어 {totalChars}글자
        </div>
      )}
      <p className="rounded-xl bg-[#F6FBFF] p-3 font-bold">
        진행자가 <b>한 번만</b> 읽어 줍니다. 듣고 외운 뒤 {group.length}개를 <b>순서대로 전부</b> 거꾸로
        말하세요. 하나라도 틀리면 실패예요. {limitSeconds}초!
      </p>

      {phase === "ready" && (
        <>
          <Button tone="yellow" onClick={() => setShowWords((value) => !value)}>
            {showWords ? "가리기" : "진행자만 보기"}
          </Button>
          <Button
            tone="red"
            className="text-2xl"
            onClick={() => {
              setShowWords(false);
              setPhase("thinking");
            }}
          >
            읽어 줬어요 · {limitSeconds}초 시작
          </Button>
        </>
      )}
      {phase === "thinking" && <Countdown seconds={seconds} />}

      {/* 진행자가 "반침나"를 암산으로 확인하긴 어려워서, 정답을 먼저 띄우고 그걸 보면서 판정합니다. */}
      {showAnswer && (
        <div className="grid gap-2 rounded-xl bg-[#FFF3BF] p-4 text-left sm:grid-cols-2">
          {group.map((word, position) => (
            <p key={`answer-${word}-${position}`} className="text-xl font-black">
              {word} → <span className="text-[#C92A2A]">{reverseHangul(word)}</span>
            </p>
          ))}
        </div>
      )}

      {phase !== "ready" && !judged && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Button tone="green" className="text-2xl" onClick={() => judge(true)}>
            맞혔어요 +{REVERSE_POINT}
          </Button>
          <Button tone="red" className="text-2xl" onClick={() => judge(false)}>
            틀렸어요
          </Button>
        </div>
      )}

      {judged && (
        <Button
          tone="blue"
          className="text-2xl"
          onClick={() => {
            scoredRef.current = false;
            setJudged(false);
            setIndex((value) => value + 1);
            setPhase("ready");
            setShowAnswer(false);
            setShowWords(false);
          }}
        >
          {index + 1 >= totalQuestions ? "결과 보기" : "다음 문제"}
        </Button>
      )}
    </section>
  );
}

/**
 * 세 팀 금고 — 유일한 협동 라운드.
 * 팀마다 단서를 하나씩 맡아 숫자를 얻고, 그 숫자를 합쳐야 금고가 열립니다.
 * 자기 단서를 풀면 그 팀 +2, 금고가 열리면 전 팀 +3.
 */
function VaultRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const CASES = 3;
  const audienceLabel: Record<VaultClue["audience"], string> = {
    child: "아이 단서",
    adult: "어른 단서",
    together: "누구나 단서",
  };

  const cases = useMemo(
    () => preferFresh(VAULT_CASES, VAULT_HISTORY_KEY, (item) => item.id).slice(0, CASES),
    [],
  );

  const [caseIndex, setCaseIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [revealedDigit, setRevealedDigit] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean[]>([]);
  const [entry, setEntry] = useState("");
  const [opened, setOpened] = useState<null | boolean>(null);
  const [stopped, setStopped] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const done = stopped || caseIndex >= Math.min(CASES, cases.length);
  const vault = cases[caseIndex % Math.max(1, cases.length)];
  const markShown = useShownHistory(VAULT_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);

  useEffect(() => {
    if (!done) markShown(vault?.id);
  }, [done, markShown, vault]);

  // 금고마다 단서 담당을 한 칸씩 밀어, 세 판이면 모든 팀이 아이·어른·누구나 단서를 한 번씩 맡습니다.
  const clues = useMemo(() => {
    if (!vault) return [];
    return teams.map((team, seat) => ({
      team,
      clue: vault.clues[(seat + caseIndex) % vault.clues.length],
    }));
  }, [caseIndex, teams, vault]);

  const code = clues.map((entryItem) => entryItem.clue.digit).join("");
  const allCluesHandled = clueIndex >= clues.length;

  const markClue = (correct: boolean) => {
    const entry = clues[clueIndex];
    if (correct && entry) {
      setScores((value) => ({ ...value, [entry.team.id]: (value[entry.team.id] ?? 0) + VAULT_CLUE_POINT }));
      playCorrect();
    } else {
      playWrong();
    }
    setSolved((value) => [...value, correct]);
    // 판정한 뒤에 숫자를 알려 줍니다. 못 맞혔어도 금고는 같이 열어야 하니까요.
    setRevealedDigit(entry?.clue.digit ?? null);
  };

  const tryOpen = () => {
    const success = entry === code;
    setOpened(success);
    if (success) {
      setScores((value) => {
        const next = { ...value };
        for (const team of teams) next[team.id] = (next[team.id] ?? 0) + VAULT_OPEN_POINT;
        return next;
      });
      playCorrect();
      finaleConfetti("medium");
    } else {
      playWrong();
    }
  };

  const nextCase = () => {
    setCaseIndex((value) => value + 1);
    setClueIndex(0);
    setShowClue(false);
    setRevealedDigit(null);
    setSolved([]);
    setEntry("");
    setOpened(null);
  };

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="세 팀 금고 결과"
        scores={scores}
        note="단서 성공 2점 · 금고 열면 전 팀 3점"
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <h2 className="rounded-xl bg-[#4ECDC4] p-4 text-2xl font-black">
        {vault.theme} ({caseIndex + 1} / {Math.min(CASES, cases.length)})
      </h2>
      <EarlyFinish
        ready={caseIndex > 0 && clueIndex === 0}
        done={caseIndex}
        onFinish={() => setStopped(true)}
      />
      <p className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        팀마다 단서를 하나씩 맡습니다. 자기 단서를 풀면 그 팀이 2점,
        모두의 숫자를 순서대로 이어 금고를 열면 <b>전 팀이 3점</b>씩 받아요. 이번 라운드는 다 같이 이기는 게임이에요.
      </p>

      {!allCluesHandled ? (
        <>
          <div className="flex items-center justify-center gap-2">
            <TeamPill team={clues[clueIndex].team} active />
            <span className="rounded-full bg-[#FFE66D] px-3 py-1 font-black">
              {audienceLabel[clues[clueIndex].clue.audience]}
            </span>
          </div>
          <p className="text-lg font-black">
            단서 {clueIndex + 1} / {clues.length}
          </p>
          <div className="rounded-3xl border-4 border-[#171721] bg-white p-6 text-2xl font-black sm:text-3xl">
            {showClue ? clues[clueIndex].clue.prompt : "단서 숨김"}
          </div>

          {revealedDigit === null ? (
            <>
              <Button tone="yellow" onClick={() => setShowClue((value) => !value)}>
                {showClue ? "단서 숨기기" : "이 팀만 보기"}
              </Button>
              {/* 답을 맞혔는지 먼저 정하고 나서 숫자를 공개합니다. 같이 보여주면 읽기만 해도 점수를 받아요. */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  tone="green"
                  className="text-xl"
                  disabled={!showClue}
                  onClick={() => markClue(true)}
                >
                  맞혔어요 +2
                </Button>
                <Button
                  tone="red"
                  className="text-xl"
                  disabled={!showClue}
                  onClick={() => markClue(false)}
                >
                  못 맞혔어요
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="rounded-xl bg-[#FFF3BF] p-4 text-2xl font-black">
                이 단서의 숫자: {revealedDigit}
              </p>
              <Button
                tone="blue"
                className="text-2xl"
                onClick={() => {
                  setRevealedDigit(null);
                  setClueIndex((value) => value + 1);
                  setShowClue(false);
                }}
              >
                {clueIndex + 1 >= clues.length ? "금고 열기로" : "다음 단서"}
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-lg font-black">
            단서 결과: {solved.map((ok) => (ok ? "○" : "✕")).join(" ")} · 이제 숫자를 순서대로 이어 금고를 열어보세요
          </p>
          <div className="rounded-3xl border-4 border-[#171721] bg-white p-6 text-5xl font-black tracking-widest">
            {entry.padEnd(clues.length, "_")}
          </div>
          {opened === null ? (
            <>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                  <Button
                    key={digit}
                    tone="white"
                    className="min-h-[52px] text-xl"
                    disabled={entry.length >= clues.length}
                    onClick={() => setEntry((value) => value + digit)}
                  >
                    {digit}
                  </Button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button tone="white" onClick={() => setEntry("")}>
                  지우기
                </Button>
                <Button tone="red" className="text-xl" disabled={entry.length !== clues.length} onClick={tryOpen}>
                  금고 열기
                </Button>
              </div>
            </>
          ) : (
            <>
              <p
                className={`rounded-xl p-4 text-2xl font-black ${
                  opened ? "bg-[#D3F9D8] text-[#1B5E20]" : "bg-[#FFE3E3] text-[#C92A2A]"
                }`}
              >
                {opened ? `금고가 열렸어요! 전 팀 +3점 (코드 ${code})` : `아쉬워요. 정답 코드는 ${code}였어요`}
              </p>
              <Button tone="blue" className="text-2xl" onClick={nextCase}>
                {caseIndex + 1 >= Math.min(CASES, cases.length) ? "결과 보기" : "다음 금고"}
              </Button>
            </>
          )}
        </>
      )}
    </section>
  );
}

/**
 * 열두 획 화백 — 글자·숫자 없이 12획 안에 그려서 팀이 맞히게 합니다.
 * 그림 실력보다 "무엇을 그릴지" 고르는 감각이 중요해서 아이가 이길 때도 많습니다.
 */
function DrawingRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const MAX_STROKES = 12;
  const totalQuestions = teams.length * 3;
  const drawerLabel = ["아이가 그리기", "어른이 그리기", "아무나 그리기"];

  const cards = useMemo(() => {
    const picked: typeof DRAWING_CARDS = [];
    for (const tier of [1, 2, 3] as const) {
      const pool = preferFresh(
        DRAWING_CARDS.filter((card) => card.tier === tier),
        DRAWING_HISTORY_KEY,
        (card) => card.id,
      );
      for (let seat = 0; seat < teams.length; seat += 1) {
        if (pool.length) picked.push(pool[seat % pool.length]);
      }
    }
    return picked;
  }, [teams.length]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "drawing" | "judged">("ready");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showCard, setShowCard] = useState(false);
  const [resolved, setResolved] = useState(false);
  const done = index >= Math.min(totalQuestions, cards.length);
  const [stopped, setStopped] = useState(false);
  const card = cards[index % Math.max(1, cards.length)];
  const block = Math.floor(index / teams.length);
  const team = teams[(index + block) % teams.length];
  const markShown = useShownHistory(DRAWING_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);
  const scoredRef = useRef(false);

  useEffect(() => {
    if (!done) markShown(card?.id);
  }, [card, done, markShown]);

  // 시간이 끝나도 정답은 아직 감춥니다. 진행자가 판정한 뒤에 공개돼요.
  const timeUp = useCallback(() => setPhase("judged"), []);
  const seconds = useDeadlineCountdown(phase === "drawing", 45, timeUp, index);

  const judge = (success: boolean) => {
    if (scoredRef.current) return;
    scoredRef.current = true;
    setResolved(true);
    if (success) {
      setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + DRAWING_POINT }));
      playCorrect();
      correctConfetti();
    } else {
      playWrong();
    }
    setPhase("judged");
  };

  if (done) {
    return <RoundResult game={game} type={type} title="열두 획 화백 결과" scores={scores} note="맞히면 5점" />;
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {index + 1} / {totalQuestions} 문제 · {drawerLabel[block % drawerLabel.length]}
      </p>
      <EarlyFinish
        ready={phase === "ready" && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />
      <p className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        그리는 사람만 카드를 봅니다. <b>글자와 숫자는 쓸 수 없고 12획까지만</b> 그릴 수 있어요.
        같은 팀이 45초 안에 맞히면 5점입니다.
      </p>

      <div className="rounded-2xl border-4 border-[#171721] bg-white p-4 text-2xl font-black">
        {showCard ? card.answer : "카드 숨김"}
      </div>
      <Button tone="yellow" disabled={phase !== "ready"} onClick={() => setShowCard((value) => !value)}>
        {showCard ? "카드 숨기기" : "그리는 사람만 보기"}
      </Button>

      {phase === "ready" && (
        <Button
          tone="red"
          className="text-2xl"
          onClick={() => {
            setShowCard(false);
            setPhase("drawing");
          }}
        >
          45초 그리기 시작
        </Button>
      )}

      {phase !== "ready" && (
        <>
          {phase === "drawing" && <Countdown seconds={seconds} />}
          {/* index를 key로 줘서 문항이 바뀌면 그림판이 깨끗하게 초기화됩니다. */}
          <StrokePad key={index} maxStrokes={MAX_STROKES} disabled={phase === "judged"} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button tone="green" className="text-2xl" disabled={scoredRef.current} onClick={() => judge(true)}>
              맞혔어요 +5
            </Button>
            <Button tone="red" className="text-2xl" disabled={scoredRef.current} onClick={() => judge(false)}>
              못 맞혔어요
            </Button>
          </div>
        </>
      )}

      {resolved && (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-2xl font-black">정답: {card.answer}</p>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              scoredRef.current = false;
              setResolved(false);
              setIndex((value) => value + 1);
              setPhase("ready");
              setShowCard(false);
            }}
          >
            {index + 1 >= totalQuestions ? "결과 보기" : "다음 문제"}
          </Button>
        </>
      )}
    </section>
  );
}

/**
 * 멈출까? 짐칸 6 — 짐을 계속 실어 합계 6에 가깝게 만들되, 넘기기 전에 출발해야 합니다.
 * 지식이 전혀 필요 없는 유일한 라운드라 제일 어린 아이도 똑같이 이길 수 있습니다.
 */
function CargoRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const TRIPS = 2;
  const LIMIT = 6;
  const totalTurns = teams.length * TRIPS;

  // 매 여행마다 무게 1·1·2·2·3·3 여섯 장. 이름만 다르고 확률은 모든 팀이 같습니다.
  const decks = useMemo(() => {
    const built: CargoCard[][] = [];
    for (let turn = 0; turn < totalTurns; turn += 1) {
      const deck: CargoCard[] = [];
      for (const weight of [1, 2, 3] as const) {
        const pool = shuffle(CARGO_CARDS.filter((card) => card.weight === weight));
        deck.push(pool[0], pool[1] ?? pool[0]);
      }
      built.push(shuffle(deck));
    }
    return built;
  }, [totalTurns]);

  const [turn, setTurn] = useState(0);
  const [drawn, setDrawn] = useState<CargoCard[]>([]);
  const [settled, setSettled] = useState<null | { total: number; busted: boolean; points: number }>(null);
  const [stopped, setStopped] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const done = stopped || turn >= totalTurns;
  // 1차는 A→B→C, 2차는 C→B→A 순서로 돌아 마지막 순서의 이점을 없앱니다.
  const trip = Math.floor(turn / teams.length);
  const seat = turn % teams.length;
  const team = teams[trip % 2 === 0 ? seat : teams.length - 1 - seat];
  const deck = decks[turn % Math.max(1, decks.length)] ?? [];
  const total = drawn.reduce((sum, card) => sum + card.weight, 0);

  const pointsFor = (value: number) => {
    if (value > LIMIT) return 0;
    if (value >= 5) return 8;
    if (value >= 3) return 5;
    return value >= 1 ? 2 : 0;
  };

  const draw = () => {
    const next = deck[drawn.length];
    if (!next) return;
    const nextDrawn = [...drawn, next];
    setDrawn(nextDrawn);
    const nextTotal = nextDrawn.reduce((sum, card) => sum + card.weight, 0);
    if (nextTotal > LIMIT) {
      setSettled({ total: nextTotal, busted: true, points: 0 });
      playWrong();
    } else if (nextDrawn.length === deck.length) {
      // 여섯 장을 다 실었는데도 안 넘겼다면 그대로 출발합니다.
      const points = pointsFor(nextTotal);
      setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + points }));
      setSettled({ total: nextTotal, busted: false, points });
      playCorrect();
    }
  };

  const depart = () => {
    const points = pointsFor(total);
    setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + points }));
    setSettled({ total, busted: false, points });
    if (points > 0) {
      playCorrect();
      correctConfetti();
    } else {
      playWrong();
    }
  };

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="멈출까? 짐칸 6 결과"
        scores={scores}
        note="5~6은 8점, 3~4는 5점, 1~2는 2점, 6 초과는 0점"
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {trip + 1}번째 여행 · {turn + 1} / {totalTurns}
      </p>
      <EarlyFinish
        ready={!settled && drawn.length === 0 && evenTurns(turn, teams.length) > 0}
        done={evenTurns(turn, teams.length)}
        onFinish={() => setStopped(true)}
      />
      <p className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        짐을 실을 때마다 무게가 더해집니다. 합계 <b>6을 넘기면 0점</b>,
        5~6이면 3점, 3~4면 2점, 1~2면 1점이에요. 욕심낼지 지금 출발할지 팀이 정하세요.
      </p>

      <div className="rounded-3xl border-4 border-[#171721] bg-white p-5">
        <p className="text-6xl font-black">{total}</p>
        <p className="mt-1 font-black text-[#4A4A5E]">지금 무게 (한계 {LIMIT})</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {drawn.map((card, position) => (
            <span
              key={`${card.id}-${position}`}
              className="rounded-xl border-3 border-[#171721] bg-[#FFE66D] px-3 py-2 font-black"
            >
              {card.emoji} {card.label} {card.weight}
            </span>
          ))}
          {drawn.length === 0 && <span className="font-bold text-[#4A4A5E]">아직 실은 짐이 없어요</span>}
        </div>
      </div>

      {!settled ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Button tone="red" className="text-2xl" disabled={drawn.length >= deck.length} onClick={draw}>
            짐 더 싣기
          </Button>
          <Button tone="green" className="text-2xl" disabled={drawn.length === 0} onClick={depart}>
            지금 출발 (+{pointsFor(total)}점)
          </Button>
        </div>
      ) : (
        <>
          <p
            className={`rounded-xl p-4 text-2xl font-black ${
              settled.busted ? "bg-[#FFE3E3] text-[#C92A2A]" : "bg-[#D3F9D8] text-[#1B5E20]"
            }`}
          >
            {settled.busted
              ? `무게 ${settled.total}! 짐칸이 터졌어요. 0점`
              : `무게 ${settled.total}로 출발! +${settled.points}점`}
          </p>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              setTurn((value) => value + 1);
              setDrawn([]);
              setSettled(null);
            }}
          >
            {turn + 1 >= totalTurns ? "결과 보기" : "다음 팀"}
          </Button>
        </>
      )}
    </section>
  );
}

/**
 * 수상한 한 칸 — 화면 안에서 규칙을 혼자 어긴 칸을 찾습니다.
 * 문제를 매번 새로 만들어 내기 때문에 몇 판을 해도 같은 화면이 안 나옵니다.
 * 지식이 아니라 관찰력이라 아이가 어른보다 훨씬 빨리 찾을 때가 많습니다.
 */
function OddGridRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const totalQuestions = teams.length * 3;

  const puzzles = useMemo(
    () =>
      Array.from({ length: totalQuestions }, (_, index) =>
        makeOddGrid((Math.floor(index / teams.length) + 1) as 1 | 2 | 3),
      ),
    [teams.length, totalQuestions],
  );

  const [index, setIndex] = useState(0);
  const [tries, setTries] = useState(0);
  const [finished, setFinished] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const done = stopped || index >= totalQuestions;
  const puzzle = puzzles[index % puzzles.length];
  const block = Math.floor(index / teams.length);
  const team = teams[(index + block) % teams.length];

  const tap = (cell: number) => {
    if (finished) return;

    if (cell === puzzle.answerIndex) {
      // 첫 번에 찾으면 2점, 두 번째에 찾으면 1점.
      const points = tries === 0 ? 8 : tries === 1 ? 4 : 0;
      setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + points }));
      setFinished(true);
      playCorrect();
      if (points > 0) correctConfetti();
      return;
    }

    const nextTries = tries + 1;
    setTries(nextTries);
    playWrong();
    // 화면에 "남은 기회 2번"이라고 적혀 있으니 두 번 틀리면 끝냅니다.
    if (nextTries >= 2) setFinished(true);
  };

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="수상한 한 칸 결과"
        scores={scores}
        note="한 번에 찾으면 8점, 두 번째에 찾으면 4점"
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {index + 1} / {totalQuestions} 문제 · 난이도 {block + 1}
      </p>
      <EarlyFinish
        ready={!finished && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />
      <h2 className="rounded-xl bg-[#4ECDC4] p-4 text-xl font-black">{puzzle.rule}</h2>
      <p className="font-black">
        {finished ? "정답 위치를 확인하세요" : `남은 기회 ${Math.max(0, 2 - tries)}번`}
      </p>

      <div
        className="mx-auto grid w-full max-w-lg gap-2"
        style={{ gridTemplateColumns: `repeat(${puzzle.columns}, minmax(0, 1fr))` }}
      >
        {puzzle.cells.map((cell, cellIndex) => {
          const isAnswer = cellIndex === puzzle.answerIndex;
          return (
            <button
              key={`${cell}-${cellIndex}`}
              type="button"
              disabled={finished}
              onClick={() => tap(cellIndex)}
              aria-label={`${cellIndex + 1}번 칸`}
              className={`aspect-square rounded-xl border-3 border-[#171721] text-2xl font-black sm:text-3xl ${
                finished && isAnswer ? "bg-[#D3F9D8]" : "bg-white"
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {finished && (
        <>
          <p className="rounded-xl bg-[#FFF3BF] p-4 text-lg font-black">{puzzle.explanation}</p>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              setIndex((value) => value + 1);
              setTries(0);
              setFinished(false);
            }}
          >
            {index + 1 >= totalQuestions ? "결과 보기" : "다음 문제"}
          </Button>
        </>
      )}
    </section>
  );
}

/**
 * 한말 두 얼굴 — 같은 단어를 서로 다른 뜻으로 쓴 문장을 하나씩 만듭니다.
 * 어른은 어휘가 넓고 아이는 엉뚱한 뜻을 잘 찾아서 의외로 팽팽합니다.
 */
function HomonymRound({ game, type }: { game: GameState; type: RoundType }) {
  const teams = game.teams;
  const totalQuestions = teams.length * 3;

  const cards = useMemo(() => {
    const picked: typeof HOMONYM_CARDS = [];
    for (const tier of [1, 2, 3] as const) {
      const pool = preferFresh(
        HOMONYM_CARDS.filter((card) => card.tier === tier),
        HOMONYM_HISTORY_KEY,
        (card) => card.id,
      );
      for (let seat = 0; seat < teams.length; seat += 1) {
        if (pool.length) picked.push(pool[seat % pool.length]);
      }
    }
    return picked;
  }, [teams.length]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "thinking" | "judged">("ready");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [resolved, setResolved] = useState(false);
  const [stopped, setStopped] = useState(false);
  const done = stopped || index >= Math.min(totalQuestions, cards.length);
  const card = cards[index % Math.max(1, cards.length)];
  const block = Math.floor(index / teams.length);
  const team = teams[(index + block) % teams.length];
  const markShown = useShownHistory(HOMONYM_HISTORY_KEY, NEW_ROUND_HISTORY_LIMIT);
  const scoredRef = useRef(false);

  useEffect(() => {
    if (!done) markShown(card?.id);
  }, [card, done, markShown]);

  const timeUp = useCallback(() => setPhase("judged"), []);
  const seconds = useDeadlineCountdown(phase === "thinking", 25, timeUp, index);

  const judge = (points: number) => {
    if (scoredRef.current) return;
    scoredRef.current = true;
    setResolved(true);
    if (points > 0) {
      setScores((value) => ({ ...value, [team.id]: (value[team.id] ?? 0) + points }));
      playCorrect();
      correctConfetti();
    } else {
      playWrong();
    }
    setPhase("judged");
  };

  if (done) {
    return (
      <RoundResult
        game={game}
        type={type}
        title="한말 두 얼굴 결과"
        scores={scores}
        note="두 뜻 다 살리면 8점, 하나만 살리면 4점"
      />
    );
  }

  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5 text-center">
      <TeamPill team={team} active />
      <p className="text-xl font-black">
        {index + 1} / {totalQuestions} 문제
      </p>
      <div className="rounded-3xl bg-[#FFE66D] p-6 text-5xl font-black sm:text-7xl">{card.word}</div>
      <EarlyFinish
        ready={phase === "ready" && evenTurns(index, teams.length) > 0}
        done={evenTurns(index, teams.length)}
        onFinish={() => setStopped(true)}
      />
      <p className="rounded-xl bg-[#F6FBFF] p-4 text-left font-bold leading-7">
        이 단어를 <b>서로 다른 뜻</b>으로 쓴 문장을 두 개 만들어 보세요.
        어른이 하나, 아이가 하나씩 말하면 좋아요. 25초!
      </p>

      {phase === "ready" && (
        <Button tone="red" className="text-2xl" onClick={() => setPhase("thinking")}>
          25초 시작
        </Button>
      )}
      {phase === "thinking" && <Countdown seconds={seconds} />}

      {phase !== "ready" && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Button tone="green" className="text-xl" disabled={scoredRef.current} onClick={() => judge(8)}>
            둘 다 성공 +4
          </Button>
          <Button tone="yellow" className="text-xl" disabled={scoredRef.current} onClick={() => judge(4)}>
            하나만 +2
          </Button>
          <Button tone="red" className="text-xl" disabled={scoredRef.current} onClick={() => judge(0)}>
            못 했어요
          </Button>
        </div>
      )}

      {resolved && (
        <>
          <div className="grid gap-2 rounded-xl bg-[#FFF3BF] p-4 text-left">
            {card.senses.map((sense) => (
              <p key={sense.label} className="font-black">
                · {sense.label} — <span className="font-bold">{sense.example}</span>
              </p>
            ))}
          </div>
          <Button
            tone="blue"
            className="text-2xl"
            onClick={() => {
              scoredRef.current = false;
              setResolved(false);
              setIndex((value) => value + 1);
              setPhase("ready");
            }}
          >
            {index + 1 >= totalQuestions ? "결과 보기" : "다음 문제"}
          </Button>
        </>
      )}
    </section>
  );
}

/** 새 라운드들이 같은 모양의 결과 화면을 쓰도록 묶었습니다. */
function RoundResult({
  game,
  type,
  title,
  scores,
  note,
}: {
  game: GameState;
  type: RoundType;
  title: string;
  scores: Record<string, number>;
  note: string;
}) {
  return (
    <section className="tv-panel mt-5 grid gap-5 rounded-2xl p-5">
      <h2 className="text-3xl font-black">{title}</h2>
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
          note,
        }}
      >
        점수 입력 확인
      </SaveRoundButton>
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

  const awards = rankAward(game.teams, counts, [24, 16, 8]);
  const totalPicked = game.teams.reduce((sum, team) => sum + (counts[team.id] ?? 0), 0);
  const overCoinLimit = totalPicked > POOL_FINALE_COINS;

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
              max={POOL_FINALE_COINS}
              step={1}
              inputMode="numeric"
              value={counts[team.id] ?? ""}
              onChange={(event) => {
                const raw = event.target.value;
                if (raw === "") {
                  setCounts((value) => {
                    const next = { ...value };
                    delete next[team.id];
                    return next;
                  });
                  return;
                }
                // 동전은 30개뿐이라 음수·소수·30 초과는 애초에 못 들어가게 막습니다.
                const clamped = Math.max(0, Math.min(POOL_FINALE_COINS, Math.floor(Number(raw) || 0)));
                setCounts((value) => ({ ...value, [team.id]: clamped }));
              }}
              className="min-h-[60px] rounded-xl border-3 border-[#171721] px-4 text-2xl font-black outline-none focus:ring-4 focus:ring-[#FFE66D]"
            />
          </label>
        ))}
      </div>
      {overCoinLimit && (
        <p className="rounded-xl bg-[#FFE3E3] p-3 font-black text-[#C92A2A]">
          팀별 합계가 {totalPicked}개예요. 동전은 {POOL_FINALE_COINS}개라 숫자를 다시 확인해주세요.
        </p>
      )}
      <Button tone="blue" className="text-2xl" disabled={overCoinLimit} onClick={() => setShowResult(true)}>
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
              note: "보물찾기 순위 24/16/8점",
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
  const [offline, setOffline] = useState(false);
  const [modelUsed, setModelUsed] = useState("");
  const valid = roundTypes.includes(roundType);
  // 사회자가 기다리지 않고 백업 문제로 시작하면, 뒤늦게 도착한 응답이 화면을 덮지 않게 합니다.
  const skippedRef = useRef(false);

  const round = useMemo(() => (valid ? getRoundInfo(roundType) : undefined), [roundType, valid]);

  useScreenWakeLock(valid);

  // 새로고침·탭 닫기로 진행 중인 라운드를 통째로 날리는 사고를 막습니다.
  useEffect(() => {
    if (!valid) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [valid]);

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
      setOffline(result.offline);
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
  } else if (roundType === "memory_thief") {
    body = <MemoryThiefRound game={game} type={roundType} />;
  } else if (roundType === "sequence_order") {
    body = <SequenceOrderRound game={game} type={roundType} />;
  } else if (roundType === "trap_interview") {
    body = <TrapInterviewRound game={game} type={roundType} />;
  } else if (roundType === "nunchi_allin") {
    body = <NunchiAllInRound game={game} type={roundType} />;
  } else if (roundType === "list_race") {
    body = <ListRaceRound game={game} type={roundType} />;
  } else if (roundType === "reverse_talk") {
    body = <ReverseTalkRound game={game} type={roundType} />;
  } else if (roundType === "team_vault") {
    body = <VaultRound game={game} type={roundType} />;
  } else if (roundType === "stroke_draw") {
    body = <DrawingRound game={game} type={roundType} />;
  } else if (roundType === "cargo_six") {
    body = <CargoRound game={game} type={roundType} />;
  } else if (roundType === "odd_grid") {
    body = <OddGridRound game={game} type={roundType} />;
  } else if (roundType === "homonym") {
    body = <HomonymRound game={game} type={roundType} />;
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
          ⚠️ Claude 호출 실패로 우리집 문제 세트로 진행합니다. {error}
        </p>
      )}
      {offline && !loading && round.prompt && (
        <p className="mt-5 rounded-xl border-3 border-[#171721] bg-[#F6FBFF] p-3 text-center font-black text-[#1864AB]">
          📚 우리집 문제 세트로 진행합니다. (API 없이 그대로 즐기면 돼요)
        </p>
      )}
      {!usedFallback && !offline && !loading && round.prompt && (
        <p className="mt-5 rounded-xl border-3 border-[#171721] bg-[#D3F9D8] p-3 text-center font-black text-[#1B5E20]">
          ✅ Claude가 새 문제를 생성했습니다. {modelUsed && `사용 모델: ${modelUsed}`}
        </p>
      )}
      {body}
    </PageShell>
  );
}
