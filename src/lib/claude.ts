import { FALLBACK_CONTENT } from "../data/fallbacks";
import { getRoundInfo } from "../data/rounds";
import type { RoundType } from "../types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// 파티 중에는 기다림이 곧 사고입니다. 한 모델당 20초, 전체 35초를 넘기면 백업 문제로 넘어갑니다.
const ATTEMPT_TIMEOUT_MS = 20000;
const TOTAL_BUDGET_MS = 35000;
const MAX_TOKENS = 4000;

type ModelCandidate = {
  id: string;
  // 모델 세대마다 받는 옵션이 달라서 후보별로 따로 둡니다.
  options: Record<string, unknown>;
};

const MODEL_CANDIDATES: ModelCandidate[] = [
  { id: "claude-opus-5", options: { thinking: { type: "disabled" }, output_config: { effort: "low" } } },
  { id: "claude-sonnet-5", options: { thinking: { type: "disabled" }, output_config: { effort: "low" } } },
  { id: "claude-haiku-4-5", options: {} },
];

type ClaudeSuccess = {
  data: unknown;
  model: string;
};

type ClaudeErrorPayload = {
  error?: {
    type?: string;
    message?: string;
  };
};

function isModelRetryable(errorType: string, message: string) {
  const lowerMessage = message.toLowerCase();
  return (
    errorType === "not_found_error" ||
    errorType === "invalid_request_error" ||
    errorType === "timeout_error" ||
    errorType === "overloaded_error" ||
    lowerMessage.includes("model")
  );
}

/**
 * 모델이 JSON 앞뒤에 설명이나 태그를 붙여도 살아남도록 첫 번째 JSON 객체만 뽑아냅니다.
 */
export function extractJson(text: string): unknown {
  const withoutFences = text.replace(/```json\n?|```/g, "");
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("JSON 형식을 찾지 못했습니다");
  }
  return JSON.parse(withoutFences.slice(start, end + 1));
}

async function requestClaudeJson(
  prompt: string,
  apiKey: string,
  candidate: ModelCandidate,
  timeoutMs: number,
): Promise<ClaudeSuccess> {
  const requestId = crypto.randomUUID();
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: candidate.id,
        max_tokens: MAX_TOKENS,
        ...candidate.options,
        messages: [
          {
            role: "user",
            content: `${prompt}\n\n요청 고유번호: ${requestId}\n매번 새 게임용으로 이전과 다른 조합을 섞어줘.\nJSON만 반환해. 설명이나 \`\`\`json 마크다운 없이 순수 JSON만.`,
          },
        ],
      }),
    });
  } catch (error) {
    window.clearTimeout(timer);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`[${candidate.id}] timeout_error: ${Math.round(timeoutMs / 1000)}초 안에 응답이 없었습니다`);
    }
    throw new Error(`[${candidate.id}] network_error: ${error instanceof Error ? error.message : String(error)}`);
  }

  let data: ClaudeErrorPayload & { content?: { text?: string }[]; stop_reason?: string };
  try {
    // 헤더만 받고 본문이 멎는 경우가 있어서, 본문을 다 읽을 때까지 같은 타임아웃 안에 둡니다.
    data = (await response.json()) as typeof data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`[${candidate.id}] timeout_error: 응답 본문을 받는 중 시간이 초과됐습니다`);
    }
    throw new Error(`[${candidate.id}] parse_error: 응답을 읽지 못했습니다`);
  } finally {
    window.clearTimeout(timer);
  }

  if (!response.ok) {
    const message = data?.error?.message ?? "Claude API 호출에 실패했습니다";
    const type = data?.error?.type ?? "unknown_error";
    throw new Error(`[${candidate.id}] ${type}: ${message}`);
  }

  if (data.stop_reason === "max_tokens") {
    throw new Error(`[${candidate.id}] truncated_error: 응답이 너무 길어 잘렸습니다`);
  }

  const text = data.content?.map((block) => block?.text ?? "").join("") ?? "";
  if (!text) {
    throw new Error(`[${candidate.id}] Claude 응답 형식이 올바르지 않습니다`);
  }

  return { data: extractJson(text), model: candidate.id };
}

export async function generateContent(prompt: string, apiKeyOverride?: string): Promise<ClaudeSuccess> {
  const apiKey = apiKeyOverride?.trim() || localStorage.getItem("anthropic_api_key");
  if (!apiKey) throw new Error("API 키가 필요합니다");

  const failures: string[] = [];
  const startedAt = Date.now();

  for (const candidate of MODEL_CANDIDATES) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (remaining <= 1000) {
      failures.push("전체 대기 시간을 초과했습니다");
      break;
    }

    try {
      return await requestClaudeJson(prompt, apiKey, candidate, Math.min(ATTEMPT_TIMEOUT_MS, remaining));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);

      const errorType = message.match(/\] ([^:]+):/)?.[1] ?? "";
      if (!isModelRetryable(errorType, message)) {
        break;
      }
    }
  }

  throw new Error(failures.join(" / "));
}

export async function testClaudeConnection(apiKey: string) {
  const result = await generateContent('{"ok": true, "message": "연결 성공"} 형식의 JSON만 반환해.', apiKey);
  return result.model;
}

export type RoundContentResult = {
  data: unknown;
  /** API를 시도했지만 실패해서 우리집 문제 세트로 넘어간 경우 */
  usedFallback: boolean;
  /** 애초에 API를 쓰지 않는 경우 (키 없음) — 이건 오류가 아닙니다 */
  offline: boolean;
  error: string;
  model: string;
};

export function hasApiKey() {
  return Boolean(localStorage.getItem("anthropic_api_key")?.trim());
}

function withAvoidList(prompt: string, avoid: string[]) {
  const trimmed = avoid.filter(Boolean).slice(0, 40);
  if (!trimmed.length) return prompt;
  return `${prompt}\n\n최근 게임에서 이미 낸 문제라서 빼야 할 것들: ${trimmed.join(", ")}`;
}

// React StrictMode(개발)나 빠른 재마운트로 같은 라운드를 연달아 요청할 때
// API를 두 번 때리지 않도록 아주 짧은 시간만 요청을 공유합니다.
const inflight = new Map<string, { promise: Promise<RoundContentResult>; startedAt: number }>();
const INFLIGHT_TTL_MS = 5000;

export function generateRoundContent(type: RoundType, avoid: string[] = []): Promise<RoundContentResult> {
  const cached = inflight.get(type);
  if (cached && Date.now() - cached.startedAt < INFLIGHT_TTL_MS) {
    return cached.promise;
  }

  const promise = requestRoundContent(type, avoid);
  inflight.set(type, { promise, startedAt: Date.now() });
  return promise;
}

async function requestRoundContent(type: RoundType, avoid: string[]): Promise<RoundContentResult> {
  const round = getRoundInfo(type);

  // API 키가 없으면 호출을 시도조차 하지 않습니다. 우리집 문제 세트만으로 전부 진행됩니다.
  if (!round?.prompt || !hasApiKey()) {
    return { data: FALLBACK_CONTENT[type], usedFallback: false, offline: true, error: "", model: "" };
  }

  try {
    const result = await generateContent(withAvoidList(round.prompt, avoid));
    return { data: result.data, usedFallback: false, offline: false, error: "", model: result.model };
  } catch (error) {
    return {
      data: FALLBACK_CONTENT[type],
      usedFallback: true,
      offline: false,
      error: error instanceof Error ? error.message : "문제 생성에 실패했습니다",
      model: "",
    };
  }
}
