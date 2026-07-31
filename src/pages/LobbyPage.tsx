import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import MusicToggle from "../components/MusicToggle";
import PageShell from "../components/PageShell";
import Scoreboard from "../components/Scoreboard";
import { getRoundInfo, ROUND_INFOS } from "../data/rounds";
import { staffingLabel, staffingWarning, TEAM_MARK } from "../lib/teams";
import { adjustTeamScore, lastRoundResult, loadGameState, saveGameState, undoLastRoundResult } from "../lib/storage";
import type { GameState } from "../types";

export default function LobbyPage() {
  const navigate = useNavigate();
  const [game, setGame] = useState<GameState | null>(() => loadGameState());
  const [showRounds, setShowRounds] = useState(true);
  const [filter, setFilter] = useState<"all" | "화면" | "말·몸" | "new" | "fit">("all");
  const [editingScores, setEditingScores] = useState(false);

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

  const visibleRounds = useMemo(() => {
    if (!game) return [];
    // 지금 팀 수와 인원으로 제대로 돌아가는 라운드만 남깁니다.
    if (filter === "fit") return ROUND_INFOS.filter((round) => !staffingWarning(round, game.teams));
    if (filter === "new") return ROUND_INFOS.filter((round) => !(game.roundResults[round.type]?.length ?? 0));
    if (filter === "all") return ROUND_INFOS;
    return ROUND_INFOS.filter((round) => round.tag === filter);
  }, [filter, game]);

  // 지금 팀 구성으로 안 되는 라운드를 카드에서 미리 알려 줍니다.
  const shortStaffed = useMemo(() => {
    if (!game) return {} as Record<string, string>;
    return Object.fromEntries(ROUND_INFOS.map((round) => [round.type, staffingWarning(round, game.teams)]));
  }, [game]);

  const fitCount = useMemo(
    () => (game ? ROUND_INFOS.filter((round) => !staffingWarning(round, game.teams)).length : 0),
    [game],
  );

  const undoTarget = game ? lastRoundResult(game) : null;

  if (!game) return null;

  return (
    <PageShell>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/" className="rounded-full bg-white px-4 py-2 text-sm font-black shadow">
          ← 처음으로
        </Link>
        <div className="flex items-center gap-2">
          <MusicToggle showTrack />
          <span className="rounded-full bg-[#FF6B6B] px-4 py-2 text-sm font-black text-[#171721]">
            메인 허브
          </span>
        </div>
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

        <Button tone="white" className="text-lg" onClick={() => setEditingScores((value) => !value)}>
          {editingScores ? "점수 고치기 닫기" : "✏️ 점수 직접 고치기"}
        </Button>

        {editingScores && (
          <section className="tv-panel grid gap-3 rounded-2xl p-4">
            <p className="font-bold leading-7 text-[#4A4A5E]">
              라운드 중에 잘못 눌렀으면 여기서 총점을 바로 고칠 수 있어요. 어느 라운드였는지 몰라도 괜찮아요.
            </p>
            {game.teams.map((team) => (
              <div key={team.id} className="grid gap-2 rounded-xl bg-white p-3">
                <div className="flex items-center justify-between gap-2 text-lg font-black">
                  <span>
                    {TEAM_MARK[team.color]} {team.name}
                  </span>
                  <span className="rounded-full bg-[#FFE66D] px-3 py-1">{game.scores[team.id] ?? 0}점</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[-5, -1, 1, 5].map((delta) => (
                    <Button
                      key={delta}
                      tone={delta < 0 ? "red" : "green"}
                      className="min-h-[52px] text-lg"
                      onClick={() => {
                        const next = adjustTeamScore(game, team.id, delta);
                        saveGameState(next);
                        setGame(next);
                      }}
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {undoTarget && (
          <Button
            tone="white"
            className="text-lg"
            onClick={() => {
              const label = getRoundInfo(undoTarget.roundType)?.title ?? "마지막 라운드";
              if (!window.confirm(`'${label}' 결과를 점수판에서 빼고 없던 일로 할까요?`)) return;
              const next = undoLastRoundResult(game);
              if (next) {
                saveGameState(next);
                setGame(next);
              }
            }}
          >
            ↩️ 마지막 결과 취소 ({getRoundInfo(undoTarget.roundType)?.title})
          </Button>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button tone="white" className="text-lg" onClick={() => navigate("/photos")}>
            📷 우리 사진 넣기
          </Button>
          <Button
            tone="green"
            className="text-lg"
            onClick={() => {
              // 라운드가 많아서 고르기 힘들 때, 아직 안 한 것 중에 하나를 뽑아 줍니다.
              const pool = ROUND_INFOS.filter((round) => !(game.roundResults[round.type]?.length ?? 0));
              const source = pool.length ? pool : ROUND_INFOS;
              const pick = source[Math.floor(Math.random() * source.length)];
              navigate(`/round/${pick.type}`);
            }}
          >
            🎲 아무거나 골라줘
          </Button>
        </div>

        {showRounds && (
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", `전체 ${ROUND_INFOS.length}`],
                ["fit", `👥 지금 인원으로 ${fitCount}`],
                ["화면", "🖥 화면으로"],
                ["말·몸", "🗣 말·몸으로"],
                ["new", "아직 안 한 것"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border-3 border-[#171721] px-4 py-2 text-sm font-black ${
                  filter === key ? "bg-[#FFE66D]" : "bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {showRounds && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleRounds.map((round) => {
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
                        round.tag === "화면" ? "bg-[#4ECDC4]" : "bg-[#FFE66D]"
                      }`}
                    >
                      {round.tag}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black">{round.title}</h2>
                  <p className="mt-2 min-h-[48px] text-sm font-bold text-[#4A4A5E]">{round.description}</p>
                  <p className="mt-2 text-sm font-black text-[#1971C2]">👥 {staffingLabel(round)}</p>
                  {shortStaffed[round.type] && (
                    <p className="mt-1 text-xs font-black text-[#E03131]">⚠️ {shortStaffed[round.type]}</p>
                  )}
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
