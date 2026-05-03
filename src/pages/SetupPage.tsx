import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageShell from "../components/PageShell";
import { testClaudeConnection } from "../lib/claude";
import { createGameState, loadApiKey, saveApiKey, saveGameState } from "../lib/storage";
import type { Team, TeamColor } from "../types";

const colors: TeamColor[] = ["red", "blue", "green"];
const colorLabel: Record<TeamColor, string> = {
  red: "빨강",
  blue: "파랑",
  green: "초록",
};
const colorHex: Record<TeamColor, string> = {
  red: "#FF6B6B",
  blue: "#4ECDC4",
  green: "#51CF66",
};

export default function SetupPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(loadApiKey());
  const [teamCount, setTeamCount] = useState<2 | 3>(2);
  const [teamNames, setTeamNames] = useState(["빨강팀", "파랑팀", "초록팀"]);
  const [members, setMembers] = useState(["", "", ""]);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState("");
  const [apiTest, setApiTest] = useState<{
    status: "idle" | "testing" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });

  const teams = useMemo<Team[]>(
    () =>
      Array.from({ length: teamCount }, (_, index) => ({
        id: `team-${index + 1}`,
        name: teamNames[index].trim() || `${colorLabel[colors[index]]}팀`,
        members: members[index]
          .split(/[\n,]/)
          .map((name) => name.trim())
          .filter(Boolean),
        color: colors[index],
      })),
    [members, teamCount, teamNames],
  );

  const startGame = () => {
    if (!apiKey.trim()) {
      setError("Claude 문제 생성을 위해 Anthropic API 키를 입력해주세요.");
      return;
    }

    saveApiKey(apiKey);
    const game = createGameState(teams);
    saveGameState(game);
    navigate("/lobby");
  };

  const checkApiKey = async () => {
    if (!apiKey.trim()) {
      setApiTest({ status: "error", message: "API 키를 먼저 입력해주세요." });
      return;
    }

    setApiTest({ status: "testing", message: "Claude 연결을 확인하는 중입니다..." });
    try {
      const model = await testClaudeConnection(apiKey);
      saveApiKey(apiKey);
      setApiTest({
        status: "success",
        message: `Claude 연결 성공! 사용 모델: ${model}`,
      });
    } catch (testError) {
      setApiTest({
        status: "error",
        message: testError instanceof Error ? testError.message : "Claude 연결에 실패했습니다.",
      });
    }
  };

  return (
    <PageShell>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/" className="rounded-full bg-white px-4 py-2 text-sm font-black shadow">
          ← 처음으로
        </Link>
        <span className="rounded-full bg-[#FFE66D] px-4 py-2 text-sm font-black">초기 설정</span>
      </div>

      <section className="tv-panel rounded-2xl p-4 sm:p-6">
        <h1 className="text-3xl font-black sm:text-5xl">게임 준비</h1>
        <p className="mt-2 text-base font-bold text-[#4A4A5E]">
          API 키와 팀만 정하면 바로 라운드를 골라 시작할 수 있어요.
        </p>

        <div className="mt-6 grid gap-6">
          <label className="grid gap-2">
            <span className="text-lg font-black">Anthropic API 키</span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setApiTest({ status: "idle", message: "" });
              }}
              placeholder="sk-ant-..."
              className="min-h-[60px] rounded-xl border-3 border-[#171721] bg-white px-4 text-base font-bold outline-none focus:ring-4 focus:ring-[#4ECDC4]"
            />
          </label>

          <div className="grid gap-3 rounded-xl border-3 border-[#171721] bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-black">Claude 연결 테스트</p>
                <p className="text-sm font-bold text-[#4A4A5E]">
                  게임 시작 전에 API 키가 실제로 작동하는지 확인합니다.
                </p>
              </div>
              <Button tone="blue" onClick={checkApiKey} disabled={apiTest.status === "testing"}>
                {apiTest.status === "testing" ? "확인 중..." : "API 테스트"}
              </Button>
            </div>
            {apiTest.message && (
              <p
                className={`rounded-xl p-3 text-sm font-black ${
                  apiTest.status === "success"
                    ? "bg-[#D3F9D8] text-[#2B8A3E]"
                    : apiTest.status === "testing"
                      ? "bg-[#F6FBFF] text-[#1864AB]"
                      : "bg-[#FFE3E3] text-[#C92A2A]"
                }`}
              >
                {apiTest.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowHelp((value) => !value)}
            className="w-fit rounded-full bg-[#4ECDC4] px-4 py-2 text-left text-sm font-black"
          >
            API 키 어떻게 받나요?
          </button>
          {showHelp && (
            <div className="rounded-xl border-3 border-[#171721] bg-[#F6FBFF] p-4 text-sm font-bold leading-6">
              <p>1. console.anthropic.com 에 가입하거나 로그인합니다.</p>
              <p>2. 좌측 메뉴에서 API Keys를 엽니다.</p>
              <p>3. Create Key를 눌러 새 키를 만들고 이 화면에 붙여넣습니다.</p>
              <p>키는 이 브라우저의 localStorage에만 저장됩니다.</p>
            </div>
          )}

          <fieldset className="grid gap-3">
            <legend className="text-lg font-black">팀 수</legend>
            <div className="grid grid-cols-2 gap-3">
              {[2, 3].map((count) => (
                <label
                  key={count}
                  className={`flex min-h-[60px] cursor-pointer items-center justify-center rounded-xl border-3 border-[#171721] text-xl font-black ${
                    teamCount === count ? "bg-[#FFE66D]" : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={teamCount === count}
                    onChange={() => setTeamCount(count as 2 | 3)}
                  />
                  {count}팀
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 lg:grid-cols-3">
            {teams.map((team, index) => (
              <section key={team.id} className="rounded-2xl border-3 border-[#171721] bg-white p-4 shadow-pop">
                <div className="mb-4 flex items-center justify-between">
                  <strong className="text-lg font-black">{index + 1}팀</strong>
                  <span
                    className="rounded-full border-2 border-[#171721] px-3 py-1 text-sm font-black"
                    style={{ backgroundColor: colorHex[team.color] }}
                  >
                    {colorLabel[team.color]}
                  </span>
                </div>
                <label className="grid gap-2">
                  <span className="text-sm font-black">팀명</span>
                  <input
                    value={teamNames[index]}
                    onChange={(event) => {
                      const next = [...teamNames];
                      next[index] = event.target.value;
                      setTeamNames(next);
                    }}
                    className="min-h-[52px] rounded-xl border-2 border-[#171721] px-3 font-bold outline-none focus:ring-4 focus:ring-[#FFE66D]"
                  />
                </label>
                <label className="mt-4 grid gap-2">
                  <span className="text-sm font-black">멤버 이름들</span>
                  <textarea
                    value={members[index]}
                    onChange={(event) => {
                      const next = [...members];
                      next[index] = event.target.value;
                      setMembers(next);
                    }}
                    placeholder="한 줄에 한 명씩 입력"
                    rows={4}
                    className="rounded-xl border-2 border-[#171721] px-3 py-3 font-bold outline-none focus:ring-4 focus:ring-[#FFE66D]"
                  />
                </label>
              </section>
            ))}
          </div>

          {error && <p className="rounded-xl bg-[#FFE3E3] p-3 text-center font-black text-[#C92A2A]">{error}</p>}

          <Button tone="red" className="text-2xl" onClick={startGame}>
            게임 시작
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
