import { useEffect, useRef, useState } from "react";

interface AnimatedScoreProps {
  value: number;
  className?: string;
}

export default function AnimatedScore({ value, className = "" }: AnimatedScoreProps) {
  const [display, setDisplay] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const start = previousValue.current;
    const diff = value - start;
    if (diff === 0) return;

    const started = performance.now();
    const duration = 550;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      setDisplay(Math.round(start + diff * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousValue.current = value;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{display}</span>;
}
