export type RoundType =
  | "speed_quiz"
  | "blur_image"
  | "chosung_quiz"
  | "emoji_quiz"
  | "lie_detector"
  | "memory_thief"
  | "sequence_order"
  | "hum_song"
  | "trap_interview"
  | "nunchi_allin"
  | "list_race"
  | "reverse_talk"
  | "team_vault"
  | "stroke_draw"
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
  prompt?: string;
}
