import type { ButtonHTMLAttributes, ReactNode } from "react";
import { playClick } from "../lib/audio";

type ButtonTone = "red" | "blue" | "yellow" | "green" | "white" | "dark";

const toneClass: Record<ButtonTone, string> = {
  red: "bg-[#FF6B6B] text-white",
  blue: "bg-[#4ECDC4] text-[#171721]",
  yellow: "bg-[#FFE66D] text-[#171721]",
  green: "bg-[#51CF66] text-[#171721]",
  white: "bg-white text-[#171721]",
  dark: "bg-[#171721] text-white",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ButtonTone;
  children: ReactNode;
}

export default function Button({ tone = "yellow", className = "", onClick, children, ...props }: ButtonProps) {
  return (
    <button
      className={`tv-button rounded-xl px-5 py-3 text-lg font-black disabled:cursor-not-allowed disabled:opacity-45 ${toneClass[tone]} ${className}`}
      onClick={(event) => {
        playClick();
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
