export interface VaultClue {
  /** child = 아이가 아는 것, adult = 어른이 아는 것, together = 누구나 셀 수 있는 것 */
  audience: "child" | "adult" | "together";
  prompt: string;
  /** 정답은 한 자리 숫자 */
  digit: string;
}

export interface VaultCase {
  id: string;
  theme: string;
  clues: [VaultClue, VaultClue, VaultClue];
}

/**
 * 세 팀 금고용 문제.
 * 팀마다 단서를 하나씩 나눠 갖고, 각자 푼 숫자를 합쳐야 금고가 열립니다.
 * 팀 대항이 아니라 **세 팀이 다 같이** 성공해야 하는 유일한 라운드입니다.
 * 아이 단서·어른 단서·누구나 단서를 섞어서 한 세대만으로는 못 열게 했습니다.
 */
export const VAULT_CASES: VaultCase[] = [
  {
    id: "v01",
    theme: "숫자 금고 1호",
    clues: [
      { audience: "child", prompt: "문어의 다리는 몇 개?", digit: "8" },
      { audience: "adult", prompt: "야구 한 경기는 몇 이닝?", digit: "9" },
      { audience: "together", prompt: "한 손의 손가락은 몇 개?", digit: "5" },
    ],
  },
  {
    id: "v02",
    theme: "숫자 금고 2호",
    clues: [
      { audience: "child", prompt: "무지개는 보통 몇 가지 색으로 세나요?", digit: "7" },
      { audience: "adult", prompt: "윷놀이에 쓰는 윷가락은 몇 개?", digit: "4" },
      { audience: "together", prompt: "자전거 바퀴는 몇 개?", digit: "2" },
    ],
  },
  {
    id: "v03",
    theme: "숫자 금고 3호",
    clues: [
      { audience: "child", prompt: "주사위 면은 몇 개?", digit: "6" },
      { audience: "adult", prompt: "올림픽 오륜기의 고리는 몇 개?", digit: "5" },
      { audience: "together", prompt: "삼각형의 변은 몇 개?", digit: "3" },
    ],
  },
  {
    id: "v04",
    theme: "숫자 금고 4호",
    clues: [
      { audience: "child", prompt: "네잎클로버의 잎은 몇 장?", digit: "4" },
      { audience: "adult", prompt: "사물놀이에 쓰이는 악기는 몇 가지?", digit: "4" },
      { audience: "together", prompt: "사람의 눈은 몇 개?", digit: "2" },
    ],
  },
  {
    id: "v05",
    theme: "숫자 금고 5호",
    clues: [
      { audience: "child", prompt: "거미의 다리는 몇 개?", digit: "8" },
      { audience: "adult", prompt: "카세트테이프는 앞뒤로 몇 면?", digit: "2" },
      { audience: "together", prompt: "사계절은 몇 개?", digit: "4" },
    ],
  },
  {
    id: "v06",
    theme: "숫자 금고 6호",
    clues: [
      { audience: "child", prompt: "신호등의 색은 몇 가지?", digit: "3" },
      { audience: "adult", prompt: "축구는 전반과 후반, 모두 몇 부분?", digit: "2" },
      { audience: "together", prompt: "한 발의 발가락은 몇 개?", digit: "5" },
    ],
  },
  {
    id: "v07",
    theme: "숫자 금고 7호",
    clues: [
      { audience: "child", prompt: "나비의 날개는 몇 장?", digit: "4" },
      { audience: "adult", prompt: "판소리 다섯 마당은 몇 마당?", digit: "5" },
      { audience: "together", prompt: "삼겹살의 '삼'은 몇?", digit: "3" },
    ],
  },
  {
    id: "v08",
    theme: "숫자 금고 8호",
    clues: [
      { audience: "child", prompt: "자동차 바퀴는 보통 몇 개?", digit: "4" },
      { audience: "adult", prompt: "우리나라 광역시는 몇 개? (부산·대구·인천·광주·대전·울산)", digit: "6" },
      { audience: "together", prompt: "젓가락 한 벌은 몇 짝?", digit: "2" },
    ],
  },
  {
    id: "v09",
    theme: "숫자 금고 9호",
    clues: [
      { audience: "child", prompt: "피아노 페달은 보통 몇 개?", digit: "3" },
      { audience: "adult", prompt: "화투 한 달은 몇 장?", digit: "4" },
      { audience: "together", prompt: "'가족오락관'은 몇 글자?", digit: "5" },
    ],
  },
  {
    id: "v10",
    theme: "숫자 금고 10호",
    clues: [
      { audience: "child", prompt: "삼각김밥의 모서리는 몇 개?", digit: "3" },
      { audience: "adult", prompt: "12간지에서 소는 몇 번째?", digit: "2" },
      { audience: "together", prompt: "육각형의 변은 몇 개?", digit: "6" },
    ],
  },
  {
    id: "v11",
    theme: "숫자 금고 11호",
    clues: [
      { audience: "child", prompt: "사람 손은 모두 몇 개?", digit: "2" },
      { audience: "adult", prompt: "태극기 네 귀퉁이의 괘는 몇 개?", digit: "4" },
      { audience: "together", prompt: "일주일에서 주말을 뺀 날은 며칠?", digit: "5" },
    ],
  },
  {
    id: "v12",
    theme: "숫자 금고 12호",
    clues: [
      { audience: "child", prompt: "'아기상어' 노래에 나오는 상어 가족은 몇 마리?", digit: "5" },
      { audience: "adult", prompt: "바둑판 한 변의 줄은 몇 줄? (십의 자리를 뺀 숫자)", digit: "9" },
      { audience: "together", prompt: "사각형의 꼭짓점은 몇 개?", digit: "4" },
    ],
  },
  {
    id: "v13",
    theme: "숫자 금고 13호",
    clues: [
      { audience: "child", prompt: "곰 세 마리는 몇 마리?", digit: "3" },
      { audience: "adult", prompt: "김밥 한 줄을 반으로 자르면 몇 조각?", digit: "2" },
      { audience: "together", prompt: "별을 그릴 때 꼭짓점은 보통 몇 개?", digit: "5" },
    ],
  },
  {
    id: "v14",
    theme: "숫자 금고 14호",
    clues: [
      { audience: "child", prompt: "'토끼와 거북이'에 나오는 동물은 몇 종류?", digit: "2" },
      { audience: "adult", prompt: "사물함처럼 '사'로 시작하는 말의 '사'는 몇?", digit: "4" },
      { audience: "together", prompt: "야구 베이스는 몇 개? (홈 포함)", digit: "4" },
    ],
  },
  {
    id: "v15",
    theme: "숫자 금고 15호",
    clues: [
      { audience: "child", prompt: "가위바위보에서 낼 수 있는 건 몇 가지?", digit: "3" },
      { audience: "adult", prompt: "칠순은 몇 십 살?", digit: "7" },
      { audience: "together", prompt: "한 사람의 귀는 몇 개?", digit: "2" },
    ],
  },
  {
    id: "v16",
    theme: "숫자 금고 16호",
    clues: [
      { audience: "child", prompt: "'세 마리 아기 돼지'는 몇 마리?", digit: "3" },
      { audience: "adult", prompt: "환갑은 몇 십 살?", digit: "6" },
      { audience: "together", prompt: "오각형의 변은 몇 개?", digit: "5" },
    ],
  },
  {
    id: "v17",
    theme: "숫자 금고 17호",
    clues: [
      { audience: "child", prompt: "달팽이 더듬이는 몇 개?", digit: "4" },
      { audience: "adult", prompt: "우리나라 국경일 중 '삼일절'의 숫자는?", digit: "3" },
      { audience: "together", prompt: "쌍둥이는 몇 명?", digit: "2" },
    ],
  },
  {
    id: "v18",
    theme: "숫자 금고 18호",
    clues: [
      { audience: "child", prompt: "무당벌레 하면 떠오르는 점은 보통 몇 개?", digit: "7" },
      { audience: "adult", prompt: "팔순은 몇 십 살?", digit: "8" },
      { audience: "together", prompt: "한 사람의 팔은 몇 개?", digit: "2" },
    ],
  },
];
