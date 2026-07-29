/**
 * 배경음악.
 *
 * 곡은 `public/audio`에 들어 있고, 배경음악을 켤 때 처음 내려받습니다.
 * (앱을 열자마자 20MB를 받지 않도록 일부러 미루는 겁니다.)
 *
 * 볼륨은 audio.volume이 아니라 Web Audio의 GainNode로 조절합니다.
 * iOS 사파리는 audio.volume을 무시해서, 그걸로는 페이드도 덕킹도 안 먹습니다.
 */

const MUSIC_KEY = "poolvilla_music_on";
const PLAYING_VOLUME = 0.35;

export interface Track {
  title: string;
  src: string;
}

/** 딸이 만든 곡들. 순서는 매번 섞습니다. */
export const TRACKS: Track[] = [
  { title: "Afternoon Stretch", src: "/audio/Afternoon_Stretch.mp3" },
  { title: "Charting the Northern Meridian", src: "/audio/Charting_the_Northern_Meridian.mp3" },
  { title: "Paws in the Pond", src: "/audio/Paws_in_the_Pond.mp3" },
  { title: "Seven Turns of the Wheel", src: "/audio/Seven_Turns_of_the_Wheel.mp3" },
  { title: "Sunlight on the Rug", src: "/audio/Sunlight_on_the_Rug.mp3" },
  { title: "Trajectory of a Paper Plane", src: "/audio/Trajectory_of_a_Paper_Plane.mp3" },
];

let audio: HTMLAudioElement | null = null;
let context: AudioContext | null = null;
let gain: GainNode | null = null;
let playlist: Track[] = [];
let position = 0;
const listeners = new Set<(track: Track | null) => void>();

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function notify(track: Track | null) {
  for (const listener of listeners) listener(track);
}

/** 지금 나오는 곡이 바뀔 때 알려 줍니다. */
export function onTrackChange(listener: (track: Track | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function currentTrack(): Track | null {
  return playlist.length ? playlist[position % playlist.length] : null;
}

function ensureGraph() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "none";
    // 한 곡이 끝나면 다음 곡으로. 목록 끝에 닿으면 다시 섞어서 처음부터.
    audio.addEventListener("ended", () => {
      position += 1;
      if (position >= playlist.length) {
        playlist = shuffled(TRACKS);
        position = 0;
      }
      playCurrent();
    });
  }

  if (!context) {
    try {
      context = new AudioContext();
      const source = context.createMediaElementSource(audio);
      gain = context.createGain();
      gain.gain.value = 0.0001;
      source.connect(gain);
      gain.connect(context.destination);
    } catch {
      // Web Audio를 못 쓰는 환경이면 음량 조절만 포기하고 재생은 그대로 합니다.
      context = null;
      gain = null;
      audio.volume = PLAYING_VOLUME;
    }
  }
}

function playCurrent() {
  if (!audio) return;
  const track = currentTrack();
  if (!track) return;
  audio.src = track.src;
  void audio.play().catch(() => {
    // 브라우저가 아직 소리를 막고 있는 경우. 다음 사용자 조작 때 다시 시도됩니다.
  });
  notify(track);
}

function fadeTo(target: number, seconds: number) {
  if (!context || !gain) {
    // Web Audio가 없으면 즉시 반영합니다. (iOS는 audio.volume을 무시하니 소리는 그대로 납니다)
    if (audio) audio.volume = Math.min(1, Math.max(0, target));
    return;
  }
  const now = context.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, target), now + seconds);
}

export function isMusicOn() {
  return localStorage.getItem(MUSIC_KEY) === "on";
}

export function startMusic() {
  ensureGraph();
  if (context?.state === "suspended") void context.resume();

  if (!playlist.length) {
    playlist = shuffled(TRACKS);
    position = 0;
  }

  if (audio && (audio.paused || !audio.src)) playCurrent();
  fadeTo(PLAYING_VOLUME, 2);
}

export function stopMusic() {
  fadeTo(0.0001, 1.2);
  // 페이드가 끝난 뒤에 멈춥니다. 뚝 끊기면 거슬려요.
  window.setTimeout(() => {
    if (!isMusicOn()) {
      audio?.pause();
      notify(null);
    }
  }, 1300);
}

export function setMusicOn(on: boolean) {
  localStorage.setItem(MUSIC_KEY, on ? "on" : "off");
  if (on) startMusic();
  else stopMusic();
}

/** 다음 곡으로 건너뜁니다. */
export function skipTrack() {
  if (!isMusicOn()) return;
  position = (position + 1) % Math.max(1, playlist.length);
  playCurrent();
}

/** 효과음이 울릴 때 잠깐 음악을 낮춰 소리가 묻히지 않게 합니다. */
export function duckMusic(seconds = 1.2) {
  if (!audio || audio.paused || !isMusicOn()) return;
  fadeTo(PLAYING_VOLUME * 0.25, 0.1);
  window.setTimeout(() => {
    if (isMusicOn()) fadeTo(PLAYING_VOLUME, seconds);
  }, 150);
}
