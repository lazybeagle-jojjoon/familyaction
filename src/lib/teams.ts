import type { RoundInfo, Team, TeamColor } from "../types";

// 색상만으로 팀을 구분하면 적록색약인 사람에게 빨강팀과 초록팀이 같아 보입니다.
// 색 + 모양기호 + 이름을 항상 함께 씁니다.
export const TEAM_COLOR_HEX: Record<TeamColor, string> = {
  red: "#FF6B6B",
  blue: "#4ECDC4",
  green: "#51CF66",
  purple: "#B197FC",
  orange: "#FFA94D",
};

export const TEAM_MARK: Record<TeamColor, string> = {
  red: "●",
  blue: "▲",
  green: "■",
  purple: "★",
  orange: "◆",
};

export const TEAM_COLOR_LABEL: Record<TeamColor, string> = {
  red: "빨강",
  blue: "파랑",
  green: "초록",
  purple: "보라",
  orange: "주황",
};

export function teamMark(team: Team) {
  return TEAM_MARK[team.color];
}

export function teamHex(team: Team) {
  return TEAM_COLOR_HEX[team.color];
}

/** "팀당 2명 이상 · 진행자 1명" 같은 한 줄 안내를 만듭니다. */
export function staffingLabel(round: RoundInfo) {
  const parts = [round.minPerTeam === 1 ? "팀당 1명부터" : `팀당 ${round.minPerTeam}명 이상`];
  if (round.minTeams) parts.push(`${round.minTeams}팀`);
  if (round.needsHost) parts.push("진행자 1명");
  return parts.join(" · ");
}

/**
 * 지금 짜인 팀으로 이 라운드가 되는지 봅니다.
 * 팀원 이름을 안 적었으면 인원을 알 수 없으니 아무 말도 하지 않습니다.
 */
export function staffingWarning(round: RoundInfo, teams: Team[]) {
  if (round.minTeams && teams.length < round.minTeams) {
    return `${round.minTeams}팀은 되어야 점수가 갈립니다. 지금은 ${teams.length}팀이에요.`;
  }
  const short = teams.filter((team) => team.members.length > 0 && team.members.length < round.minPerTeam);
  if (short.length) {
    const names = short.map((team) => `${team.name}(${team.members.length}명)`).join(", ");
    return `팀당 ${round.minPerTeam}명은 있어야 해요. ${names}이 모자랍니다.`;
  }
  return "";
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
