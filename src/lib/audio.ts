import { duckMusic } from "./music";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  audioContext ??= new AudioContext();
  // iOS/Safari는 사용자 제스처 전까지 컨텍스트를 suspended로 두고,
  // 앱이 백그라운드에 다녀오면 다시 suspended가 됩니다.
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function tone(frequency: number, duration = 0.12, type: OscillatorType = "sine", volume = 0.14) {
  const context = getAudioContext();
  if (context.state !== "running") return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

export function playClick() {
  tone(420, 0.05, "square", 0.06);
}

export function playCorrect() {
  duckMusic();
  tone(660, 0.09, "sine", 0.12);
  window.setTimeout(() => tone(880, 0.11, "sine", 0.12), 95);
}

export function playWrong() {
  tone(130, 0.22, "sawtooth", 0.12);
}

export function playBeep() {
  tone(900, 0.07, "square", 0.08);
}

export function playFanfare() {
  duckMusic(3);
  [523, 659, 784, 1047, 784, 1047].forEach((freq, index) => {
    window.setTimeout(() => tone(freq, 0.16, "triangle", 0.16), index * 130);
  });
}

export function playDrumroll(durationMs = 5000) {
  const started = Date.now();
  const interval = window.setInterval(() => {
    tone(95 + Math.random() * 55, 0.045, "sawtooth", 0.055);
    if (Date.now() - started >= durationMs) {
      window.clearInterval(interval);
    }
  }, 70);
}
