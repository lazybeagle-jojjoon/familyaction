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

export function addRoundResult(game: GameState, result: RoundResult): GameState {
  const scores = { ...game.scores };
  for (const [teamId, points] of Object.entries(result.teamScores)) {
    scores[teamId] = (scores[teamId] ?? 0) + points;
  }

  return {
    ...game,
    scores,
    roundResults: {
      ...game.roundResults,
      [result.roundType]: [...(game.roundResults[result.roundType] ?? []), result],
    },
    updatedAt: new Date().toISOString(),
  };
}

export function saveApiKey(apiKey: string) {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

export function loadApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
}
