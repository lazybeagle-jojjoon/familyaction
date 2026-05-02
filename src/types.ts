export type RoundType =
  | "speed_quiz"
  | "blur_image"
  | "chosung_quiz"
  | "emoji_quiz"
  | "lie_detector"
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
  tag: "온라인" | "오프라인";
  prompt?: string;
}
