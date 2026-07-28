import type { Team, TeamColor } from "../types";

// 색상만으로 팀을 구분하면 적록색약인 사람에게 빨강팀과 초록팀이 같아 보입니다.
// 색 + 모양기호 + 이름을 항상 함께 씁니다.
export const TEAM_COLOR_HEX: Record<TeamColor, string> = {
  red: "#FF6B6B",
  blue: "#4ECDC4",
  green: "#51CF66",
};

export const TEAM_MARK: Record<TeamColor, string> = {
  red: "●",
  blue: "▲",
  green: "■",
};

export const TEAM_COLOR_LABEL: Record<TeamColor, string> = {
  red: "빨강",
  blue: "파랑",
  green: "초록",
};

export function teamMark(team: Team) {
  return TEAM_MARK[team.color];
}

export function teamHex(team: Team) {
  return TEAM_COLOR_HEX[team.color];
}

/** 팀별로 문항 수가 똑같이 나뉘도록 총 문항 수를 보정합니다. */
export function balancedQuestionCount(target: number, teamCount: number, available: number) {
  const safeTeams = Math.max(1, teamCount);
  const perTeam = Math.max(1, Math.round(target / safeTeams));
  const wanted = perTeam * safeTeams;
  if (available >= wanted) return wanted;
  // 후보가 모자라면 팀 수의 배수로 내림합니다.
  return Math.max(safeTeams, Math.floor(available / safeTeams) * safeTeams);
}
