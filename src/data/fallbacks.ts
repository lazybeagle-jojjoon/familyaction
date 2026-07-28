import { CHARADES_WORDS } from "./charadesWords";
import { CHOSUNG_QUESTIONS } from "./chosungQuestions";
import { EMOJI_QUIZ_QUESTIONS } from "./emojiQuizQuestions";
import { LIE_DETECTOR_FACTS } from "./lieDetectorFacts";
import { SILENT_SHOUT_WORDS } from "./silentShoutWords";
import { SPEED_QUIZ_WORDS } from "./speedQuizWords";
import type { RoundType } from "../types";

/**
 * API 없이도 모든 라운드가 그대로 돌아가는 "우리집 문제 세트"입니다.
 * API 키를 넣으면 여기에 새 문제가 얹히고, 없으면 이것만으로 진행합니다.
 */
export const FALLBACK_CONTENT: Record<RoundType, unknown> = {
  speed_quiz: { words: SPEED_QUIZ_WORDS },
  blur_image: { items: [] },
  chosung_quiz: { questions: CHOSUNG_QUESTIONS },
  emoji_quiz: { questions: EMOJI_QUIZ_QUESTIONS },
  lie_detector: { questions: LIE_DETECTOR_FACTS },
  // 아래 네 라운드는 처음부터 로컬 데이터만 씁니다. (프롬프트가 없어 API를 부르지 않습니다)
  memory_thief: {},
  sequence_order: {},
  hum_song: {},
  trap_interview: {},
  nunchi_allin: {},
  list_race: {},
  reverse_talk: {},
  silent_shout: { words: SILENT_SHOUT_WORDS },
  charades: { words: CHARADES_WORDS },
  pool_finale: {
    rules: "동전 30개를 수영장에 흩뿌리고 60초 동안 가장 많이 찾은 팀이 승리합니다.",
  },
};
