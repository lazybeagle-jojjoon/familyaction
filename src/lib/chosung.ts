const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const HANGUL_BLOCK_SIZE = 588;
const INITIALS = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

export type ChosungQuestion = {
  chosung: string;
  answers: string[];
};

export function toChosung(value: string) {
  let result = "";

  for (const char of value.trim()) {
    const code = char.codePointAt(0);
    if (!code || /\s/.test(char)) continue;

    if (code >= HANGUL_BASE && code <= HANGUL_END) {
      result += INITIALS[Math.floor((code - HANGUL_BASE) / HANGUL_BLOCK_SIZE)];
    } else if (code >= 0x3131 && code <= 0x314e) {
      result += char;
    }
  }

  return result;
}

function normalizeChosung(value: string) {
  return value.replace(/[^\u3131-\u314e]/g, "");
}

function normalizeAnswer(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

export function normalizeChosungQuestion(question: unknown): ChosungQuestion | null {
  if (!question || typeof question !== "object") return null;

  const rawQuestion = question as Partial<ChosungQuestion>;
  if (typeof rawQuestion.chosung !== "string" || !Array.isArray(rawQuestion.answers)) return null;

  const provided = normalizeChosung(rawQuestion.chosung);
  const groups = new Map<string, string[]>();

  for (const answer of rawQuestion.answers) {
    if (typeof answer !== "string") continue;

    const cleanAnswer = answer.trim();
    const computed = toChosung(cleanAnswer);
    if (!cleanAnswer || !computed) continue;

    const answers = groups.get(computed) ?? [];
    if (!answers.some((item) => normalizeAnswer(item) === normalizeAnswer(cleanAnswer))) {
      answers.push(cleanAnswer);
    }
    groups.set(computed, answers);
  }

  const exactAnswers = provided ? groups.get(provided) : undefined;
  if (provided && exactAnswers?.length) {
    return { chosung: provided, answers: exactAnswers };
  }

  const best = [...groups.entries()].sort((left, right) => right[1].length - left[1].length)[0];
  if (!best) return null;

  return { chosung: best[0], answers: best[1] };
}
