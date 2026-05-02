import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageShell from "../components/PageShell";
import { loadGameState } from "../lib/storage";

export default function HomePage() {
  const navigate = useNavigate();
  const hasGame = Boolean(loadGameState());

  return (
    <PageShell className="justify-between">
      <section className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="grid gap-4">
          <p className="mx-auto w-fit rounded-full border-3 border-[#171721] bg-[#4ECDC4] px-4 py-2 text-sm font-black">
            부모도 아이도 같이 뛰는 풀빌라 파티
          </p>
          <h1 className="text-5xl font-black leading-tight sm:text-7xl">
            🏆 풀빌라
            <br />
            가족오락관 🏆
          </h1>
          <p className="mx-auto max-w-xl text-lg font-bold text-[#36364A]">
            2~3팀이 원하는 라운드만 골라 즐기고, 언제든 시상식으로 마무리할 수 있어요.
          </p>
        </div>

        <div className="grid w-full max-w-md gap-4">
          <Button tone="red" className="text-2xl" onClick={() => navigate("/setup")}>
            새 게임 시작
          </Button>
          {hasGame && (
            <Button tone="blue" className="text-2xl" onClick={() => navigate("/lobby")}>
              이어하기
            </Button>
          )}
        </div>
      </section>

      <footer className="py-4 text-center">
        <Link to="/setup" className="text-sm font-bold text-[#36364A] underline underline-offset-4">
          Anthropic API 키 설정
        </Link>
      </footer>
    </PageShell>
  );
}
