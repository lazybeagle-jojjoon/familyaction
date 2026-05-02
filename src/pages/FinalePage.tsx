import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageShell from "../components/PageShell";
import Scoreboard from "../components/Scoreboard";
import { playDrumroll, playFanfare } from "../lib/audio";
import { finaleConfetti } from "../lib/effects";
import { clearGameState, loadGameState } from "../lib/storage";
import type { GameState, Team } from "../types";

type Stage = "ready" | "drumroll" | "third" | "second" | "first" | "done";

function rankTeams(game: GameState) {
  return [...game.teams].sort((a, b) => (game.scores[b.id] ?? 0) - (game.scores[a.id] ?? 0));
}

function AwardCard({ team, rank, score }: { team: Team; rank: number; score: number }) {
  const medal = rank === 1 ? "🏆" : rank === 2 ? "🥈" : "🥉";
  return (
    <section className={`tv-panel rounded-2xl p-5 text-center ${rank === 1 ? "shadow-glow" : ""}`}>
      <div className="text-7xl">{medal}</div>
      <h2 className="mt-3 text-4xl font-black">{rank}등 {team.name}</h2>
      <p className="mt-2 text-3xl font-black text-[#E03131]">{score}점</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {team.members.length > 0 ? (
          team.members.map((member) => (
            <span key={member} className="rounded-full bg-[#FFE66D] px-3 py-2 text-sm font-black">
              {member}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-[#FFE66D] px-3 py-2 text-sm font-black">멤버 미입력</span>
        )}
      </div>
    </section>
  );
}

export default function FinalePage() {
  const navigate = useNavigate();
  const [game] = useState<GameState | null>(() => loadGameState());
  const [stage, setStage] = useState<Stage>("ready");
  const ranked = useMemo(() => (game ? rankTeams(game) : []), [game]);

  useEffect(() => {
    if (stage === "drumroll") {
      playDrumroll(5000);
      const timer = window.setTimeout(() => {
        const next = ranked.length >= 3 ? "third" : ranked.length >= 2 ? "second" : "first";
        setStage(next);
        finaleConfetti("small");
      }, 5000);
      return () => window.clearTimeout(timer);
    }

    if (stage === "third") {
      const timer = window.setTimeout(() => {
        setStage("second");
        finaleConfetti("medium");
      }, 2800);
      return () => window.clearTimeout(timer);
    }

    if (stage === "second") {
      const timer = window.setTimeout(() => {
        setStage("first");
        playFanfare();
        finaleConfetti("huge");
      }, 3000);
      return () => window.clearTimeout(timer);
    }

    if (stage === "first") {
      playFanfare();
      finaleConfetti("huge");
      const timer = window.setTimeout(() => setStage("done"), 3600);
      return () => window.clearTimeout(timer);
    }
  }, [ranked.length, stage]);

  if (!game) return <Navigate to="/setup" replace />;

  const visibleRanks =
    stage === "ready" || stage === "drumroll"
      ? []
      : stage === "third"
        ? [3]
        : stage === "second"
          ? ranked.length >= 3
            ? [3, 2]
            : [2]
          : ranked.length >= 3
            ? [3, 2, 1]
            : ranked.length >= 2
              ? [2, 1]
              : [1];

  return (
    <PageShell>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/lobby" className="rounded-full bg-white px-4 py-2 text-sm font-black shadow">
          ← 로비
        </Link>
        <span className="rounded-full bg-[#FFE66D] px-4 py-2 text-sm font-black">시상식</span>
      </div>

      <div className="grid gap-5">
        <Scoreboard game={game} />

        <section className="tv-panel rounded-2xl p-5 text-center">
          <h1 className="text-4xl font-black sm:text-6xl">🏆 최종 시상식 🏆</h1>
          <p className="mt-3 text-lg font-bold text-[#4A4A5E]">드럼롤 뒤에 3등부터 차례대로 발표합니다.</p>
          {stage === "ready" && (
            <Button tone="red" className="mt-6 w-full text-2xl sm:w-auto" onClick={() => setStage("drumroll")}>
              지금까지 점수로 시상식 시작
            </Button>
          )}
          {stage === "drumroll" && (
            <div className="mt-6 animate-pop rounded-3xl bg-[#171721] p-8 text-5xl font-black text-white">
              두구두구두구...
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {visibleRanks.map((rank) => {
            const team = ranked[rank - 1];
            if (!team) return null;
            return <AwardCard key={team.id} team={team} rank={rank} score={game.scores[team.id] ?? 0} />;
          })}
        </section>

        {stage === "done" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              tone="red"
              className="text-2xl"
              onClick={() => {
                clearGameState();
                navigate("/setup");
              }}
            >
              다시 시작
            </Button>
            <Button tone="blue" className="text-2xl" onClick={() => navigate("/lobby")}>
              라운드 더 하기
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
