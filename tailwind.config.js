/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard",
          "Noto Sans KR",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      boxShadow: {
        pop: "0 16px 40px rgba(20, 20, 45, 0.16)",
        glow: "0 0 28px rgba(255, 230, 109, 0.95)",
      },
      animation: {
        "pulse-red": "pulseRed 0.72s ease-in-out infinite",
        pop: "pop 0.24s ease-out",
      },
      keyframes: {
        pulseRed: {
          "0%, 100%": { transform: "scale(1)", color: "#E03131" },
          "50%": { transform: "scale(1.06)", color: "#FF6B6B" },
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0.4" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
