import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageShell from "../components/PageShell";
import Scoreboard from "../components/Scoreboard";
import { ROUND_INFOS } from "../data/rounds";
import { loadGameState } from "../lib/storage";
import type { GameState } from "../types";

export default function LobbyPage() {
  const navigate = useNavigate();
  const [game, setGame] = useState<GameState | null>(() => loadGameState());
  const [showRounds, setShowRounds] = useState(true);

  useEffect(() => {
    if (!game) navigate("/setup", { replace: true });
  }, [game, navigate]);

  const latestRoundScores = useMemo(() => {
    if (!game) return {};
    return Object.fromEntries(
      ROUND_INFOS.map((round) => {
        const history = game.roundResults[round.type] ?? [];
        const latest = history[history.length - 1];
        const text = latest
          ? game.teams.map((team) => `${team.name} +${latest.teamScores[team.id] ?? 0}`).join(" · ")
          : "";
        return [round.type, text];
      }),
    );
  }, [game]);

  useEffect(() => {
    const onStorage = () => setGame(loadGameState());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!game) return null;

  return (
    <PageShell>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/" className="rounded-full bg-white px-4 py-2 text-sm font-black shadow">
          ← 처음으로
        </Link>
        <span className="rounded-full bg-[#FF6B6B] px-4 py-2 text-sm font-black text-white">
          메인 허브
        </span>
      </div>

      <div className="grid gap-5">
        <Scoreboard game={game} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Button tone="yellow" className="text-2xl" onClick={() => navigate("/finale")}>
            🏆 시상식으로 가기
          </Button>
          <Button tone="blue" className="text-2xl" onClick={() => setShowRounds((value) => !value)}>
            {showRounds ? "라운드 카드 접기" : "+ 라운드 추가"}
          </Button>
        </div>

        {showRounds && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROUND_INFOS.map((round) => {
              const playedCount = game.roundResults[round.type]?.length ?? 0;
              const played = playedCount > 0;

              return (
                <button
                  key={round.type}
                  type="button"
                  onClick={() => navigate(`/round/${round.type}`)}
                  className="tv-panel min-h-[230px] rounded-2xl p-4 text-left transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#FFE66D]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-5xl" aria-hidden>
                      {round.icon}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        round.tag === "온라인" ? "bg-[#4ECDC4]" : "bg-[#FFE66D]"
                      }`}
                    >
                      {round.tag}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black">{round.title}</h2>
                  <p className="mt-2 min-h-[48px] text-sm font-bold text-[#4A4A5E]">{round.description}</p>
                  <div className="mt-4 rounded-xl bg-[#F8F9FA] p-3 text-sm font-black">
                    {played ? (
                      <>
                        <div>✅ 진행 {playedCount}회 · 재도전 가능</div>
                        <div className="mt-1 text-[#E03131]">{latestRoundScores[round.type]}</div>
                      </>
                    ) : (
                      "아직 안 한 라운드"
                    )}
                  </div>
                </button>
              );
            })}
          </section>
        )}
      </div>
    </PageShell>
  );
}
