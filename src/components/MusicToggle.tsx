import { useEffect, useState } from "react";
import { currentTrack, isMusicOn, onTrackChange, setMusicOn, skipTrack, startMusic, type Track } from "../lib/music";

/**
 * 배경음악 켜기/끄기.
 *
 * 브라우저는 사용자가 화면을 한 번 건드리기 전에는 소리를 못 내게 막습니다.
 * 그래서 설정이 켜져 있어도 새로고침 뒤에는 첫 터치를 기다렸다가 다시 틉니다.
 */
export default function MusicToggle({ showTrack = false }: { showTrack?: boolean }) {
  const [on, setOn] = useState(() => isMusicOn());
  const [track, setTrack] = useState<Track | null>(() => currentTrack());

  useEffect(() => onTrackChange(setTrack), []);

  useEffect(() => {
    if (!on) return;

    const resume = () => startMusic();
    startMusic();
    // 자동재생이 막혔으면 첫 터치 때 다시 시도합니다.
    window.addEventListener("pointerdown", resume, { once: true });
    return () => window.removeEventListener("pointerdown", resume);
  }, [on]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={on}
        onClick={() => {
          const next = !on;
          setOn(next);
          setMusicOn(next);
        }}
        className={`rounded-full border-3 border-[#171721] px-4 py-2 text-sm font-black ${
          on ? "bg-[#FFE66D]" : "bg-white"
        }`}
      >
        {on ? "🎵 음악 켜짐" : "🔇 음악 꺼짐"}
      </button>

      {showTrack && on && track && (
        <button
          type="button"
          onClick={skipTrack}
          title="다음 곡으로"
          className="max-w-[210px] truncate rounded-full border-3 border-[#171721] bg-white px-3 py-2 text-xs font-bold"
        >
          ♪ {track.title} ⏭
        </button>
      )}
    </div>
  );
}
