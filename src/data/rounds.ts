import type { RoundInfo, RoundType } from "../types";

export const ROUND_INFOS: RoundInfo[] = [
  {
    type: "speed_quiz",
    icon: "⚡",
    title: "스피드 퀴즈",
    description: "30초 동안 설명하고 맞히는 대표 가족오락관 게임",
    tag: "온라인",
    prompt:
      '초등 3-4학년이 잘 아는 단어 30개를 JSON 배열로 줘. 일상 사물, 음식, 동물, 캐릭터, 요즘 유행하는 것들 다양하게. 2026년 한국 초등학생 트렌드 반영. 너무 쉬운 것부터 약간 어려운 것까지 섞어서. 형식: {"words": ["단어1", "단어2", ...]}',
  },
  {
    type: "blur_image",
    icon: "🌫️",
    title: "흐릿한 이미지",
    description: "점점 선명해지는 이모지를 빨리 맞혀요",
    tag: "온라인",
    prompt:
      '초등학생이 알 만한 사물/동물/음식 8개를 JSON으로. 형식: {"items": [{"name": "코끼리", "emoji": "🐘"}, ...]}',
  },
  {
    type: "chosung_quiz",
    icon: "ㄱ",
    title: "초성 퀴즈",
    description: "초성만 보고 정답을 외치는 순발력 퀴즈",
    tag: "온라인",
    prompt:
      '초등학생이 맞힐 수 있는 한국어 단어 15개를 골라서 초성과 정답 후보들을 JSON으로. 답이 여러 개일 수 있는 것도 포함. 트렌디한 단어, 캐릭터, 음식, 일상 사물 섞어서. 형식: {"questions": [{"chosung": "ㅋㄲㄹ", "answers": ["코끼리"]}, {"chosung": "ㅍㅈ", "answers": ["피자", "표지", "팥죽"]}, ...]}',
  },
  {
    type: "emoji_quiz",
    icon: "🎭",
    title: "이모지 퀴즈",
    description: "이모지 힌트로 노래, 영화, 캐릭터, 속담 맞히기",
    tag: "온라인",
    prompt:
      '초등학생이 맞힐 수 있는 노래/영화/캐릭터/속담 10개를 이모지로 표현. 형식: {"questions": [{"emoji": "🌟⭐🌟", "answers": ["반짝반짝 작은별"], "category": "노래"}, ...]}. 카테고리: 노래, 영화, 캐릭터, 속담 중 다양하게.',
  },
  {
    type: "lie_detector",
    icon: "🕵️",
    title: "거짓말 탐지기",
    description: "신기한 사실이 진실인지 거짓인지 빠르게 선택",
    tag: "온라인",
    prompt:
      '초등학생도 흥미로워할 만한 신기한 사실 10개를 JSON으로. 각각 진실/거짓 무작위. 형식: {"questions": [{"fact": "코끼리는 점프할 수 없다", "isTrue": true, "explanation": "..."}, ...]}',
  },
  {
    type: "silent_shout",
    icon: "🤫",
    title: "고요 속의 외침",
    description: "입모양만 보고 단어를 전달하는 오프라인 게임",
    tag: "오프라인",
    prompt:
      '고요 속의 외침 게임용 단어 15개를 JSON으로. 입모양으로 전달하기 적당한 발음 헷갈리는 단어들로. 예: 자장면/짜장면, 꽃게/꽃개. 형식: {"words": [...]}',
  },
  {
    type: "charades",
    icon: "🕺",
    title: "몸으로 말해요",
    description: "말 없이 몸짓으로만 단어와 상황을 표현해요",
    tag: "오프라인",
    prompt:
      '몸으로 표현하기 재밌고 도전적인 단어/상황 15개를 JSON으로. 직업, 동작, 동물, 상황 섞어서. 예: 치킨먹방, 화장실 급함, 좀비. 형식: {"words": [...]}',
  },
  {
    type: "pool_finale",
    icon: "🏊",
    title: "수영장 보물찾기",
    description: "동전 30개, 60초. 마지막 한 방 큰 점수!",
    tag: "오프라인",
  },
];

export const getRoundInfo = (type: RoundType) =>
  ROUND_INFOS.find((round) => round.type === type);
