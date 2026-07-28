export interface OddGridPuzzle {
  rule: string;
  cells: string[];
  columns: number;
  answerIndex: number;
  explanation: string;
}

/**
 * "수상한 한 칸" 문제를 그때그때 만들어 냅니다.
 * 고정 카드 45장을 두는 대신 매번 새로 생성해서, 몇 판을 해도 같은 화면이 안 나옵니다.
 */

const EMOJI_SETS = [
  ["🍎", "🍌", "🍇", "🍉", "🍑", "🥝", "🍍", "🍒"],
  ["🐶", "🐱", "🐰", "🐻", "🐼", "🦊", "🐸", "🐵"],
  ["🚗", "🚌", "🚑", "🚒", "🚲", "✈️", "🚂", "🚢"],
  ["⚽", "🏀", "⚾", "🎾", "🏐", "🏓", "🥊", "🎳"],
  ["🌸", "🌻", "🌷", "🌵", "🍀", "🍄", "🌲", "🌴"],
  ["🍕", "🍔", "🌭", "🍟", "🍜", "🍣", "🍩", "🍰"],
];

/** 눈으로 헷갈리는 한글 짝. 한국어 게임이라 이게 은근히 어렵습니다. */
const LOOKALIKE_PAIRS: [string, string][] = [
  ["다", "口"],
  ["ㅁ", "ㅇ"],
  ["旦", "且"],
  ["ㅌ", "ㅍ"],
  ["는", "늘"],
  ["믐", "믇"],
  ["톄", "테"],
  ["ㅈ", "ㅊ"],
  ["웜", "움"],
  ["쓰", "쯔"],
];

const ARROWS: [string, string][] = [
  ["▲", "▼"],
  ["◀", "▶"],
  ["↑", "↓"],
  ["←", "→"],
];

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

/** 하나만 짝이 없는 그림 찾기 */
function makeUnpaired(tier: 1 | 2 | 3): OddGridPuzzle {
  const set = shuffled(pick(EMOJI_SETS));
  // 정답이 짝 목록에 섞이면 답이 두 개가 되므로, 세트 크기를 넘지 않게 자릅니다.
  const pairs = Math.min(tier === 1 ? 3 : tier === 2 ? 5 : 7, set.length - 1);
  const paired = set.slice(0, pairs);
  const lonely = set[pairs];
  const cells = shuffled([...paired, ...paired, lonely]);
  return {
    rule: "그림이 두 개씩 있는데, 딱 하나만 짝이 없어요. 어느 것일까요?",
    cells,
    columns: tier === 1 ? 4 : 4,
    answerIndex: cells.indexOf(lonely),
    explanation: `${lonely} 만 혼자예요.`,
  };
}

/** 방향이 다른 하나 찾기 */
function makeArrow(tier: 1 | 2 | 3): OddGridPuzzle {
  const count = tier === 1 ? 9 : tier === 2 ? 16 : 25;
  const [normal, odd] = pick(ARROWS);
  const answerIndex = Math.floor(Math.random() * count);
  const cells = Array.from({ length: count }, (_, index) => (index === answerIndex ? odd : normal));
  return {
    rule: "하나만 방향이 달라요. 어느 것일까요?",
    cells,
    columns: Math.round(Math.sqrt(count)),
    answerIndex,
    explanation: `${odd} 하나만 다른 쪽을 보고 있어요.`,
  };
}

/** 비슷하게 생긴 글자 중 다른 하나 찾기 */
function makeLookalike(tier: 1 | 2 | 3): OddGridPuzzle {
  const count = tier === 1 ? 9 : tier === 2 ? 16 : 25;
  const [normal, odd] = pick(LOOKALIKE_PAIRS);
  const answerIndex = Math.floor(Math.random() * count);
  const cells = Array.from({ length: count }, (_, index) => (index === answerIndex ? odd : normal));
  return {
    rule: "하나만 다른 글자예요. 어느 것일까요?",
    cells,
    columns: Math.round(Math.sqrt(count)),
    answerIndex,
    explanation: `나머지는 '${normal}', 이것만 '${odd}'예요.`,
  };
}

/** 숫자와 점 개수가 안 맞는 하나 찾기 */
function makeCount(tier: 1 | 2 | 3): OddGridPuzzle {
  const count = tier === 1 ? 4 : tier === 2 ? 6 : 8;
  const answerIndex = Math.floor(Math.random() * count);
  const cells = Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    // 1번 칸에서 점을 하나 빼면 0개가 아니라 1개가 되어 정답이 사라집니다.
    // 그래서 1번은 점을 하나 더하고, 나머지는 하나 뺍니다.
    const dots = index === answerIndex ? (number === 1 ? number + 1 : number - 1) : number;
    return `${number} ${"●".repeat(dots)}`;
  });
  return {
    rule: "숫자와 점 개수가 맞아야 해요. 안 맞는 칸은?",
    cells,
    columns: 2,
    answerIndex,
    explanation:
      answerIndex === 0
        ? "1 옆의 점이 하나 많아요."
        : `${answerIndex + 1} 옆의 점이 하나 모자라요.`,
  };
}

export function makeOddGrid(tier: 1 | 2 | 3): OddGridPuzzle {
  const makers = [makeUnpaired, makeArrow, makeLookalike, makeCount];
  return pick(makers)(tier);
}
