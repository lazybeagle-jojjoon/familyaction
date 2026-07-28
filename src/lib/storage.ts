import type { GameState, RoundResult, Team } from "../types";

export const GAME_STATE_KEY = "poolvilla_family_game_state";
export const API_KEY_STORAGE_KEY = "anthropic_api_key";

export function loadGameState(): GameState | null {
  const raw = localStorage.getItem(GAME_STATE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as GameState;
  } catch {
    localStorage.removeItem(GAME_STATE_KEY);
    return null;
  }
}

export function saveGameState(game: GameState) {
  localStorage.setItem(
    GAME_STATE_KEY,
    JSON.stringify({ ...game, updatedAt: new Date().toISOString() }),
  );
}

export function clearGameState() {
  localStorage.removeItem(GAME_STATE_KEY);
}

export function createGameState(teams: Team[]): GameState {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    teams,
    scores: Object.fromEntries(teams.map((team) => [team.id, 0])),
    roundResults: {},
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 같은 라운드를 다시 했을 때 점수를 "따로 더할지"(기본) "지난 기록을 바꿀지" 고를 수 있습니다.
 * 교체를 고르면 직전 기록의 점수를 총점에서 빼고 새 결과로 대체합니다.
 */
export function addRoundResult(
  game: GameState,
  result: RoundResult,
  replaceLast = false,
): GameState {
  const history = game.roundResults[result.roundType] ?? [];
  const scores = { ...game.scores };
  const shouldReplace = replaceLast && history.length > 0;

  if (shouldReplace) {
    const previous = history[history.length - 1];
    for (const [teamId, points] of Object.entries(previous.teamScores)) {
      scores[teamId] = (scores[teamId] ?? 0) - points;
    }
  }

  for (const [teamId, points] of Object.entries(result.teamScores)) {
    scores[teamId] = (scores[teamId] ?? 0) + points;
  }

  return {
    ...game,
    scores,
    roundResults: {
      ...game.roundResults,
      [result.roundType]: shouldReplace ? [...history.slice(0, -1), result] : [...history, result],
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 마지막으로 확정한 라운드 결과를 되돌립니다.
 * 진행자가 실수로 점수를 확정했을 때 판을 다시 짜지 않아도 되게 합니다.
 */
export function undoLastRoundResult(game: GameState): GameState | null {
  let latest: { roundType: RoundResult["roundType"]; result: RoundResult } | null = null;

  for (const [roundType, results] of Object.entries(game.roundResults)) {
    const last = results?.[results.length - 1];
    if (!last) continue;
    if (!latest || last.playedAt > latest.result.playedAt) {
      latest = { roundType: roundType as RoundResult["roundType"], result: last };
    }
  }

  if (!latest) return null;

  const scores = { ...game.scores };
  for (const [teamId, points] of Object.entries(latest.result.teamScores)) {
    scores[teamId] = (scores[teamId] ?? 0) - points;
  }

  const remaining = (game.roundResults[latest.roundType] ?? []).slice(0, -1);
  const roundResults = { ...game.roundResults };
  if (remaining.length) {
    roundResults[latest.roundType] = remaining;
  } else {
    delete roundResults[latest.roundType];
  }

  return { ...game, scores, roundResults, updatedAt: new Date().toISOString() };
}

/** 되돌릴 대상이 있는지, 있으면 어떤 라운드인지 알려 줍니다. */
export function lastRoundResult(game: GameState) {
  let latest: { roundType: RoundResult["roundType"]; result: RoundResult } | null = null;
  for (const [roundType, results] of Object.entries(game.roundResults)) {
    const last = results?.[results.length - 1];
    if (!last) continue;
    if (!latest || last.playedAt > latest.result.playedAt) {
      latest = { roundType: roundType as RoundResult["roundType"], result: last };
    }
  }
  return latest;
}

export function saveApiKey(apiKey: string) {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

export function loadApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
}
