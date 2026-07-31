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

// 짝 찾기는 세트 크기가 곧 난이도 상한입니다. 12개씩 두면 어려운 판에서 23칸까지 갑니다.
const EMOJI_SETS = [
  ["🍎", "🍌", "🍇", "🍉", "🍑", "🥝", "🍍", "🍒", "🍓", "🥭", "🍐", "🥥"],
  ["🐶", "🐱", "🐰", "🐻", "🐼", "🦊", "🐸", "🐵", "🐷", "🐮", "🐯", "🦁"],
  ["🚗", "🚌", "🚑", "🚒", "🚲", "✈️", "🚂", "🚢", "🛵", "🚜", "🚁", "🛺"],
  ["⚽", "🏀", "⚾", "🎾", "🏐", "🏓", "🥊", "🎳", "🏸", "🥅", "🏒", "🥌"],
  ["🌸", "🌻", "🌷", "🌵", "🍀", "🍄", "🌲", "🌴", "🌹", "🌾", "🍁", "🌰"],
  ["🍕", "🍔", "🌭", "🍟", "🍜", "🍣", "🍩", "🍰", "🥟", "🌮", "🥞", "🍿"],
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

/** 순서만 뒤집힌 두 글자. 빠르게 훑으면 거의 구분이 안 됩니다. */
const SWAP_PAIRS: [string, string][] = [
  ["나", "너"],
  ["모", "무"],
  ["바", "비"],
  ["소", "수"],
  ["가", "고"],
  ["다", "도"],
  ["라", "로"],
  ["마", "머"],
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
  const pairs = Math.min(tier === 1 ? 5 : tier === 2 ? 8 : 11, set.length - 1);
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
  const count = tier === 1 ? 16 : tier === 2 ? 25 : 36;
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
  const count = tier === 1 ? 16 : tier === 2 ? 25 : 36;
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
  const count = tier === 1 ? 6 : tier === 2 ? 8 : 10;
  const answerIndex = Math.floor(Math.random() * count);
  // 항상 '하나 모자람'이면 한 번 눈치챈 뒤로는 그것만 찾게 되니 방향도 섞습니다.
  // 다만 1번 칸은 하나 빼면 0개가 되어 답이 사라지므로 늘 더하는 쪽입니다.
  const addsOne = answerIndex === 0 || Math.random() < 0.5;
  const cells = Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const dots = index === answerIndex ? (addsOne ? number + 1 : number - 1) : number;
    return `${number} ${"●".repeat(dots)}`;
  });
  return {
    rule: "숫자와 점 개수가 맞아야 해요. 안 맞는 칸은?",
    cells,
    columns: 2,
    answerIndex,
    explanation: `${answerIndex + 1} 옆의 점이 하나 ${addsOne ? "많아요" : "모자라요"}.`,
  };
}

/** 규칙적으로 늘어나는 숫자 중 규칙을 깬 하나 찾기 */
function makeSequence(tier: 1 | 2 | 3): OddGridPuzzle {
  const count = tier === 1 ? 8 : tier === 2 ? 10 : 12;
  const step = pick(tier === 1 ? [2, 5] : tier === 2 ? [3, 4, 6] : [3, 4, 6, 7, 9]);
  const start = 1 + Math.floor(Math.random() * 9);
  // 첫 칸이 어긋나면 나머지 전체가 규칙처럼 보여서 답이 모호해집니다.
  const answerIndex = 1 + Math.floor(Math.random() * (count - 1));
  const drift = Math.random() < 0.5 ? 1 : -1;
  const cells = Array.from({ length: count }, (_, index) => {
    const value = start + step * index;
    return String(index === answerIndex ? value + drift : value);
  });
  return {
    rule: `숫자가 ${step}씩 늘어나야 해요. 규칙을 깬 칸은?`,
    cells,
    columns: 4,
    answerIndex,
    explanation: `${cells[answerIndex]}가 아니라 ${start + step * answerIndex}여야 해요.`,
  };
}

/** 같은 두 글자인데 하나만 순서가 뒤바뀐 것 찾기 */
function makeSwapped(tier: 1 | 2 | 3): OddGridPuzzle {
  const count = tier === 1 ? 16 : tier === 2 ? 25 : 36;
  const [a, b] = pick(SWAP_PAIRS);
  const answerIndex = Math.floor(Math.random() * count);
  const cells = Array.from({ length: count }, (_, index) =>
    index === answerIndex ? `${b}${a}` : `${a}${b}`,
  );
  return {
    rule: "하나만 글자 순서가 뒤바뀌었어요. 어느 것일까요?",
    cells,
    columns: Math.round(Math.sqrt(count)),
    answerIndex,
    explanation: `나머지는 '${a}${b}', 이것만 '${b}${a}'예요.`,
  };
}

export function makeOddGrid(tier: 1 | 2 | 3): OddGridPuzzle {
  const makers = [makeUnpaired, makeArrow, makeLookalike, makeCount, makeSequence, makeSwapped];
  return pick(makers)(tier);
}
