import { FALLBACK_CONTENT } from "../data/fallbacks";
import { getRoundInfo } from "../data/rounds";
import type { RoundType } from "../types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const MODEL_CANDIDATES = [
  "claude-sonnet-4-5",
  "claude-sonnet-4-5-20250929",
  "claude-sonnet-4-6",
  "claude-sonnet-4-20250514",
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
    lowerMessage.includes("model")
  );
}

async function requestClaudeJson(prompt: string, apiKey: string, model: string): Promise<ClaudeSuccess> {
  const requestId = crypto.randomUUID();

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n요청 고유번호: ${requestId}\n매번 새 게임용으로 이전과 다른 조합을 섞어줘.\nJSON만 반환해. 설명이나 \`\`\`json 마크다운 없이 순수 JSON만.`,
        },
      ],
    }),
  });

  const data = (await response.json()) as ClaudeErrorPayload & {
    content?: { text?: string }[];
  };

  if (!response.ok) {
    const message = data?.error?.message ?? "Claude API 호출에 실패했습니다";
    const type = data?.error?.type ?? "unknown_error";
    throw new Error(`[${model}] ${type}: ${message}`);
  }

  const text = data.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error(`[${model}] Claude 응답 형식이 올바르지 않습니다`);
  }

  // 모델이 마크다운 코드블록으로 감쌌을 때도 진행되도록 정리합니다.
  const clean = text.replace(/```json\n?|```/g, "").trim();
  return { data: JSON.parse(clean), model };
}

export async function generateContent(prompt: string, apiKeyOverride?: string): Promise<ClaudeSuccess> {
  const apiKey = apiKeyOverride?.trim() || localStorage.getItem("anthropic_api_key");
  if (!apiKey) throw new Error("API 키가 필요합니다");

  const failures: string[] = [];

  for (const model of MODEL_CANDIDATES) {
    try {
      return await requestClaudeJson(prompt, apiKey, model);
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

export async function generateRoundContent(type: RoundType) {
  const round = getRoundInfo(type);
  if (!round?.prompt) {
    return { data: FALLBACK_CONTENT[type], usedFallback: false, error: "", model: "" };
  }

  try {
    const result = await generateContent(round.prompt);
    return { data: result.data, usedFallback: false, error: "", model: result.model };
  } catch (error) {
    return {
      data: FALLBACK_CONTENT[type],
      usedFallback: true,
      error: error instanceof Error ? error.message : "문제 생성에 실패했습니다",
      model: "",
    };
  }
}
