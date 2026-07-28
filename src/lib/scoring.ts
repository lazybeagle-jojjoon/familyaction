import type { Team } from "../types";

export function rankAward(
  teams: Team[],
  rawScores: Record<string, number>,
  awards: number[],
): Record<string, number> {
  const sorted = [...teams].sort((a, b) => (rawScores[b.id] ?? 0) - (rawScores[a.id] ?? 0));
  const result: Record<string, number> = {};
  let rank = 0;
  let previousScore: number | null = null;

  sorted.forEach((team, index) => {
    const score = rawScores[team.id] ?? 0;
    if (previousScore === null || score < previousScore) {
      rank = index;
    }
    // 하나도 못 맞힌 팀은 순위 보너스를 받지 않습니다. (전원 0점일 때 전원 1등 상금을 받던 문제)
    result[team.id] = score > 0 ? awards[Math.min(rank, awards.length - 1)] ?? 0 : 0;
    previousScore = score;
  });

  return result;
}

export function formatTeamScore(teams: Team[], scores: Record<string, number>) {
  return teams
    .map((team) => `${team.name} ${scores[team.id] ?? 0}점`)
    .join(" · ");
}
