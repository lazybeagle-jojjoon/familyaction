import type { RoundInfo, RoundType } from "../types";
import { blurImageCandidateText } from "./blurImageItems";
import { emojiQuizCandidateText } from "./emojiQuizQuestions";

export const ROUND_INFOS: RoundInfo[] = [
  {
    type: "speed_quiz",
    icon: "⚡",
    title: "스피드 퀴즈",
    description: "2분 동안 설명하고 맞히기 · 1개당 1점",
    tag: "화면",
    minPerTeam: 2,
    prompt:
      '초등학생부터 부모까지 함께 하는 가족오락관 스피드 퀴즈용 단어 80개를 JSON 배열로 줘. 3분 게임에서 패스가 많아도 반복이 적게 나오도록 충분히 다양하게 골라. 아이만 아는 단어로 도배하지 말고, 어른이 설명할 때 신나는 단어와 아이가 설명할 때 신나는 단어를 반반 정도로 섞어. 너무 쉬운 단일 일상명사(예: 사과, 강아지, 피자, 공, 책, 물)는 전체 80개 중 8개 이하만 허용해. 카테고리는 요즘 초등 문화(게임/캐릭터/유행어, 예: 로블록스, 브롤스타즈, 티니핑, 챌린지) 18개, 부모 세대가 반가워할 90~2000년대 추억(그때 과자·문구·만화·유행가·물건, 예: 워크맨, 삐삐, 문방구 뽑기, 다마고치) 15개, 온 가족이 다 아는 드라마·예능·영화·가요 12개, 먹거리·여행·계절 15개, 집안일·직장·학교 같은 생활(예: 분리수거, 회식, 출근길, 받아쓰기) 10개, 가족/풀빌라/물놀이 상황 10개를 섞어. 난이도는 쉬움 20개, 보통 40개, 도전 20개 정도로 섞고, 한 라운드 안에서 비슷한 단어가 겹치지 않게 해. 배열 순서도 매번 무작위로 섞어. 정치/선정/혐오/공포가 강한 단어, 설명하기 민망한 단어, 가족이 함께 말하기 어려운 과도한 은어는 빼. 형식: {"words": ["단어1", "단어2", ...]}',
  },
  {
    type: "blur_image",
    icon: "🌫️",
    title: "흐릿한 이미지",
    description: "점점 선명해지는 배경 없는 그림을 빨리 맞혀요",
    tag: "화면",
    minPerTeam: 1,
    prompt:
      `아이도 어른도 같이 맞히는 흐릿한 이미지 퀴즈용 정답 9개를 아래 후보 목록에서만 골라 JSON으로 줘. 과일과 아기동물로만 채우지 말고 음식/동물/물건/놀이를 고르게 섞어. 너무 비슷한 것은 같이 고르지 마. 후보: ${blurImageCandidateText}. 형식: {"items": [{"name": "코끼리"}, {"name": "피자"}]}`,
  },
  {
    type: "chosung_quiz",
    icon: "ㄱ",
    title: "초성 퀴즈",
    description: "초성만 보고 외치기 · 글자 수만큼 시간과 점수",
    tag: "화면",
    minPerTeam: 1,
    prompt:
      '초등학생이 맞힐 수 있는 한국어 단어 20개를 골라서 초성과 정답 후보들을 JSON으로 줘. 반드시 각 정답의 실제 한글 초성과 chosung이 정확히 일치해야 해. 예: 치킨은 "ㅊㅋ"이고 "ㅊㅋㅊ"가 아니야. 코끼리는 "ㅋㄲㄹ", 마라탕은 "ㅁㄹㅌ", 로블록스는 "ㄹㅂㄹㅅ". answers 배열 안의 모든 후보는 같은 초성을 가져야 하고, 초성이 다른 후보는 넣지 마. 영문/숫자/기호가 섞인 답은 피하고 한글 표기만 사용해. 아이가 아는 요즘 단어와 어른이 반가워할 추억의 단어를 반반 섞고, 캐릭터·음식·일상 사물·장소를 고르게 넣어. 형식: {"questions": [{"chosung": "ㅋㄲㄹ", "answers": ["코끼리"]}, {"chosung": "ㅍㅈ", "answers": ["피자", "표지", "팥죽"]}, ...]}',
  },
  {
    type: "emoji_quiz",
    icon: "🎭",
    title: "이모지 퀴즈",
    description: "이모지 힌트로 노래, 영화, 캐릭터, 속담 맞히기",
    tag: "화면",
    minPerTeam: 1,
    prompt:
      `아이도 어른도 같이 맞히는 이모지 퀴즈 10개를 아래 후보 목록에서만 골라 JSON으로 줘. emoji, answers, category는 후보의 의미와 정확히 맞아야 하고, 후보에 없는 "벌과 베짱이"처럼 잘못된 제목을 만들지 마. 같은 정답이나 비슷한 이모지 조합은 반복하지 말고 노래/영화/캐릭터/속담을 골고루 섞어. 유아용 동요·유아 캐릭터만 몰아서 고르지 말고, 어른이 반가워할 것도 절반쯤 섞어. 후보: ${emojiQuizCandidateText}. 형식: {"questions": [{"emoji": "👶🦈", "answers": ["아기상어", "상어가족"], "category": "노래"}, ...]}`,
  },
  {
    type: "lie_detector",
    icon: "🕵️",
    title: "거짓말 탐지기",
    description: "신기한 사실이 진실인지 거짓인지 빠르게 선택",
    tag: "화면",
    minPerTeam: 1,
    prompt:
      '초등학생부터 어른까지 함께 맞히는 거짓말 탐지기용 신기한 사실 14개를 JSON으로 줘. 아이용 상식만 내지 말고 어른도 처음 듣고 놀랄 사실을 절반쯤 섞어. 진실 7개, 거짓 7개 정도로 섞고 순서는 무작위로 해. 너무 흔한 문제(코끼리는 점프할 수 없다, 문어는 심장이 3개다, 펭귄은 북극에 산다, 금붕어 기억력 3초, 꿀은 오래 간다)는 가능하면 피하고, 동물/우주/음식/몸/자연/생활과학을 골고루 섞어. 초등학생도 흥미로워야 하지만 설명은 부모가 읽었을 때 납득 가능한 정확한 내용이어야 해. 공포감이 큰 질병, 정치, 선정적 내용, 위험한 따라하기 실험은 제외해. explanation은 한 문장으로 쉽게 써. 형식: {"questions": [{"fact": "달은 스스로 빛을 낸다", "isTrue": false, "explanation": "달은 태양빛을 반사해서 밝게 보여요."}, ...]}',
  },
  {
    type: "silent_shout",
    icon: "🤫",
    title: "고요 속의 외침",
    description: "입모양만 보고 단어를 전달하는 릴레이 게임",
    tag: "말·몸",
    minPerTeam: 3,
    prompt:
      '고요 속의 외침 게임용 단어 30개를 JSON으로. 입모양으로 전달하기 적당한 발음 헷갈리는 단어들로. 예: 자장면/짜장면, 꽃게/꽃개. 2~3팀이 팀당 3~10개씩 진행해도 반복이 적게 나오도록 음식, 물건, 동물, 장소, 웃긴 말투를 섞어. 아이만 아는 말로 채우지 말고 어른이 읽고 웃을 단어도 절반쯤 넣어. 형식: {"words": [...]}',
  },
  {
    type: "charades",
    icon: "🕺",
    title: "몸으로 말해요",
    description: "2분 동안 몸짓으로만 단어를 표현해요 · 1개당 2점",
    tag: "말·몸",
    minPerTeam: 2,
    prompt:
      '몸으로 표현하기 재밌고 도전적인 단어/상황 20개를 JSON으로. 직업, 동작, 동물, 상황을 섞고, 아이가 하기 좋은 것과 어른이 해야 더 웃긴 것(예: 출근길 졸기, 노래방 탬버린, 무거운 짐 들기)을 반반 섞어. 예: 치킨먹방, 화장실 급함, 좀비. 형식: {"words": [...]}',
  },
  {
    type: "memory_thief",
    icon: "🧠",
    title: "기억 도둑",
    description: "잠깐 보여준 그림 중 사라진 하나를 찾아요",
    tag: "화면",
    minPerTeam: 1,
  },
  {
    type: "sequence_order",
    icon: "🔢",
    title: "순서 맞추기",
    description: "뒤죽박죽 섞인 네 장면을 순서대로 되돌려요",
    tag: "화면",
    minPerTeam: 1,
  },
  {
    type: "trap_interview",
    icon: "🎙️",
    title: "말하면 지는 인터뷰",
    description: "상대가 금지어를 말하게 유도하기. 거짓말은 상대에게 +8",
    tag: "말·몸",
    minPerTeam: 1,
  },
  {
    type: "nunchi_allin",
    icon: "🤝",
    title: "눈치 올인",
    description: "다른 팀과 안 겹치는 답을 골라야 점수를 받아요",
    tag: "말·몸",
    minPerTeam: 1,
  },
  {
    type: "list_race",
    icon: "📝",
    title: "열거 대결",
    description: "30초 안에 정해진 개수만큼 대기",
    tag: "말·몸",
    minPerTeam: 1,
  },
  {
    type: "reverse_talk",
    icon: "🔄",
    title: "거꾸로 말하기",
    description: "듣고 외운 단어를 거꾸로 말하기. 화면엔 안 보여요",
    tag: "말·몸",
    minPerTeam: 1,
    needsHost: true,
  },
  {
    type: "team_vault",
    icon: "🔐",
    title: "세 팀 금고",
    description: "팀마다 단서 하나씩. 숫자를 합쳐 다 같이 금고를 열어요",
    tag: "말·몸",
    minPerTeam: 1,
    minTeams: 3,
  },
  {
    type: "stroke_draw",
    icon: "✏️",
    title: "열두 획 화백",
    description: "글자 없이 12획으로 그려서 우리 팀이 맞히게 해요",
    tag: "화면",
    minPerTeam: 2,
  },
  {
    type: "cargo_six",
    icon: "📦",
    title: "멈출까? 짐칸 6",
    description: "짐을 더 실을지 지금 출발할지, 6을 넘기면 0점",
    tag: "화면",
    minPerTeam: 1,
  },
  {
    type: "odd_grid",
    icon: "🔍",
    title: "수상한 한 칸",
    description: "규칙을 혼자 어긴 칸 하나를 찾아요",
    tag: "화면",
    minPerTeam: 1,
  },
  {
    type: "homonym",
    icon: "🎭",
    title: "한말 두 얼굴",
    description: "같은 단어를 서로 다른 뜻으로 쓴 문장 만들기",
    tag: "말·몸",
    minPerTeam: 1,
  },
  {
    type: "pool_finale",
    icon: "🏊",
    title: "수영장 보물찾기",
    description: "동전 30개, 60초. 마지막 한 방 큰 점수!",
    tag: "말·몸",
    minPerTeam: 1,
  },
];

export const getRoundInfo = (type: RoundType) =>
  ROUND_INFOS.find((round) => round.type === type);
