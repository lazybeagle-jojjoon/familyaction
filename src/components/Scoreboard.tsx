import AnimatedScore from "./AnimatedScore";
import type { GameState, TeamColor } from "../types";

const colorMap: Record<TeamColor, string> = {
  red: "#FF6B6B",
  blue: "#4ECDC4",
  green: "#51CF66",
};

interface ScoreboardProps {
  game: GameState;
  compact?: boolean;
}

export default function Scoreboard({ game, compact = false }: ScoreboardProps) {
  const maxScore = Math.max(1, ...Object.values(game.scores));
  const leaders = game.teams.filter((team) => game.scores[team.id] === Math.max(...Object.values(game.scores)));

  return (
    <section className={`tv-panel rounded-2xl ${compact ? "p-3" : "p-4 sm:p-5"}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black sm:text-2xl">실시간 점수판</h2>
        <span className="rounded-full bg-[#FFE66D] px-3 py-1 text-sm font-black">
          {leaders.length === 1 ? `👑 ${leaders[0].name}` : "공동 1등"}
        </span>
      </div>
      <div className="grid gap-3">
        {game.teams.map((team) => {
          const score = game.scores[team.id] ?? 0;
          const width = Math.max(8, Math.round((score / maxScore) * 100));
          const isLeader = leaders.some((leader) => leader.id === team.id);

          return (
            <div key={team.id} className="grid gap-1">
              <div className="flex items-center justify-between gap-2 text-sm font-black sm:text-base">
                <span className="truncate">
                  {isLeader ? "👑 " : ""}
                  {team.name}
                </span>
                <span className={isLeader ? "score-glow text-[#F08C00]" : ""}>
                  <AnimatedScore value={score} />점
                </span>
              </div>
              <div className="h-5 overflow-hidden rounded-full border-2 border-[#171721] bg-white">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${width}%`, backgroundColor: colorMap[team.color] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
