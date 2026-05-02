import confetti from "canvas-confetti";

export function correctConfetti() {
  void confetti({
    particleCount: 60,
    spread: 64,
    origin: { y: 0.68 },
    colors: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#51CF66"],
  });
}

export function finaleConfetti(level: "small" | "medium" | "huge" = "medium") {
  const count = level === "huge" ? 240 : level === "medium" ? 140 : 80;
  void confetti({
    particleCount: count,
    spread: level === "huge" ? 120 : 86,
    startVelocity: level === "huge" ? 48 : 34,
    origin: { y: 0.62 },
    colors: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#F06595", "#51CF66"],
  });
}
