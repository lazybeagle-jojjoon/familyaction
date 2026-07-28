import { useEffect } from "react";

type WakeLockSentinelLike = { release: () => Promise<void> };
type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
};

/**
 * 라운드를 진행하는 동안 화면이 꺼지지 않게 합니다.
 * 지원하지 않는 브라우저에서는 조용히 아무 일도 하지 않습니다.
 */
export function useScreenWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const wakeLock = (navigator as WakeLockNavigator).wakeLock;
    if (!wakeLock) return;

    let sentinel: WakeLockSentinelLike | null = null;
    let released = false;

    const acquire = async () => {
      try {
        const next = await wakeLock.request("screen");
        if (released) {
          void next.release();
          return;
        }
        sentinel = next;
      } catch {
        // 배터리 절약 모드 등으로 거절될 수 있습니다. 진행에는 영향이 없습니다.
      }
    };

    // 앱이 백그라운드에 다녀오면 잠금이 풀리므로 다시 잡습니다.
    const onVisible = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    void acquire();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisible);
      void sentinel?.release();
    };
  }, [active]);
}
