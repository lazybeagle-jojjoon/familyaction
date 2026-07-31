export type RoundType =
  | "speed_quiz"
  | "blur_image"
  | "chosung_quiz"
  | "emoji_quiz"
  | "lie_detector"
  | "memory_thief"
  | "sequence_order"
  | "trap_interview"
  | "nunchi_allin"
  | "list_race"
  | "reverse_talk"
  | "team_vault"
  | "stroke_draw"
  | "cargo_six"
  | "odd_grid"
  | "homonym"
  | "silent_shout"
  | "charades"
  | "pool_finale";

export type TeamColor = "red" | "blue" | "green";

export interface Team {
  id: string;
  name: string;
  members: string[];
  color: TeamColor;
}

export interface RoundResult {
  roundType: RoundType;
  playedAt: string;
  teamScores: Record<string, number>;
  note: string;
  /** '지난 기록 대신 넣기'로 밀어낸 결과. 되돌릴 때 이 점수를 되살립니다. */
  replaced?: RoundResult;
}

export interface GameState {
  id: string;
  teams: Team[];
  scores: Record<string, number>;
  roundResults: Partial<Record<RoundType, RoundResult[]>>;
  createdAt: string;
  updatedAt: string;
}

export interface RoundInfo {
  type: RoundType;
  icon: string;
  title: string;
  description: string;
  /** 화면 = 앱 문제를 보고 푸는 라운드, 말·몸 = 목소리와 몸으로 하는 라운드 */
  tag: "화면" | "말·몸";
  /**
   * 한 팀에 최소 몇 명이 있어야 성립하는지.
   * 1 = 혼자서도 됩니다. 2 = 설명하는 사람과 맞히는 사람이 나뉩니다.
   * 3 = 릴레이라 사이에 전달하는 사람이 필요합니다.
   */
  minPerTeam: 1 | 2 | 3;
  /** 팀 수가 이만큼은 되어야 제 맛인 라운드. 적어두지 않으면 2팀부터 됩니다. */
  minTeams?: 3;
  /** 팀원 말고 따로 진행을 봐 줄 사람이 필요한 경우 */
  needsHost?: boolean;
  prompt?: string;
}
