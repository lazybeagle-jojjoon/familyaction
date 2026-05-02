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
    result[team.id] = awards[Math.min(rank, awards.length - 1)] ?? 0;
    previousScore = score;
  });

  return result;
}

export function formatTeamScore(teams: Team[], scores: Record<string, number>) {
  return teams
    .map((team) => `${team.name} ${scores[team.id] ?? 0}점`)
    .join(" · ");
}
