import { FALLBACK_CONTENT } from "../data/fallbacks";
import { getRoundInfo } from "../data/rounds";
import type { RoundType } from "../types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function generateContent(prompt: string): Promise<unknown> {
  const apiKey = localStorage.getItem("anthropic_api_key");
  if (!apiKey) throw new Error("API 키가 필요합니다");

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nJSON만 반환해. 설명이나 \`\`\`json 마크다운 없이 순수 JSON만.`,
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Claude API 호출에 실패했습니다");
  }

  const text = data.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Claude 응답 형식이 올바르지 않습니다");
  }

  // 모델이 마크다운 코드블록으로 감쌌을 때도 진행되도록 정리합니다.
  const clean = text.replace(/```json\n?|```/g, "").trim();
  return JSON.parse(clean);
}

export async function generateRoundContent(type: RoundType) {
  const round = getRoundInfo(type);
  if (!round?.prompt) {
    return { data: FALLBACK_CONTENT[type], usedFallback: false, error: "" };
  }

  try {
    const data = await generateContent(round.prompt);
    return { data, usedFallback: false, error: "" };
  } catch (error) {
    return {
      data: FALLBACK_CONTENT[type],
      usedFallback: true,
      error: error instanceof Error ? error.message : "문제 생성에 실패했습니다",
    };
  }
}
