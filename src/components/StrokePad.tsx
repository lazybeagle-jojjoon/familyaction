import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./Button";

type Stroke = { x: number; y: number }[];

/**
 * 획 수가 제한된 그림판.
 * 손가락을 대고 뗄 때까지가 한 획입니다. 라이브러리 없이 Canvas와 Pointer Events만 씁니다.
 */
export default function StrokePad({
  maxStrokes,
  disabled = false,
  onStrokeCountChange,
}: {
  maxStrokes: number;
  disabled?: boolean;
  onStrokeCountChange?: (count: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef<Stroke | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#171721";
    context.lineWidth = 5;
    context.lineCap = "round";
    context.lineJoin = "round";

    const all = drawingRef.current ? [...strokesRef.current, drawingRef.current] : strokesRef.current;
    for (const stroke of all) {
      if (stroke.length === 0) continue;
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      for (const point of stroke.slice(1)) context.lineTo(point.x, point.y);
      // 점 하나만 찍은 획도 보이도록 살짝 그어 줍니다.
      if (stroke.length === 1) context.lineTo(stroke[0].x + 0.5, stroke[0].y + 0.5);
      context.stroke();
    }
  }, []);

  // 화면 크기에 맞춰 캔버스 해상도를 잡습니다. (선명하게 보이도록 devicePixelRatio 반영)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      redraw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw]);

  const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || strokesRef.current.length >= maxStrokes) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // 포인터 캡처가 안 되는 환경이어도 그리기 자체는 계속되게 둡니다.
    }
    drawingRef.current = [pointFrom(event)];
    redraw();
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current.push(pointFrom(event));
    redraw();
  };

  const end = () => {
    if (!drawingRef.current) return;
    strokesRef.current = [...strokesRef.current, drawingRef.current];
    drawingRef.current = null;
    setStrokeCount(strokesRef.current.length);
    onStrokeCountChange?.(strokesRef.current.length);
    redraw();
  };

  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    onStrokeCountChange?.(strokesRef.current.length);
    redraw();
  };

  const clear = () => {
    strokesRef.current = [];
    drawingRef.current = null;
    setStrokeCount(0);
    onStrokeCountChange?.(0);
    redraw();
  };

  const left = Math.max(0, maxStrokes - strokeCount);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3 font-black">
        <span>남은 획</span>
        <span className={`rounded-full px-3 py-1 ${left === 0 ? "bg-[#FFE3E3] text-[#C92A2A]" : "bg-[#FFE66D]"}`}>
          {left} / {maxStrokes}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        // 그리는 동안 화면이 스크롤되지 않게 합니다.
        style={{ touchAction: "none" }}
        className="h-64 w-full rounded-2xl border-4 border-[#171721] bg-white sm:h-80"
      />
      <div className="grid grid-cols-2 gap-3">
        <Button tone="white" className="min-h-[48px]" disabled={disabled || strokeCount === 0} onClick={undo}>
          한 획 지우기
        </Button>
        <Button tone="white" className="min-h-[48px]" disabled={disabled || strokeCount === 0} onClick={clear}>
          전부 지우기
        </Button>
      </div>
    </div>
  );
}
