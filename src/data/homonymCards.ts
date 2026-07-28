export interface HomonymCard {
  id: string;
  word: string;
  /** 서로 다른 뜻 두 가지. 진행자가 판정할 때 기준으로 씁니다. */
  senses: [{ label: string; example: string }, { label: string; example: string }];
  tier: 1 | 2 | 3;
}

/**
 * 한말 두 얼굴용 카드.
 * 같은 단어를 서로 다른 뜻으로 쓴 문장을 각각 하나씩 만드는 게임입니다.
 * 한국어 말장난이라 어른이 어휘로 유리한 대신 아이가 엉뚱한 뜻을 잘 찾아냅니다.
 */
export const HOMONYM_CARDS: HomonymCard[] = [
  // tier 1 — 아이도 바로 아는 두 뜻
  {
    id: "h1-01",
    word: "밤",
    tier: 1,
    senses: [
      { label: "해가 진 시간", example: "밤에 별을 봤다." },
      { label: "먹는 열매", example: "군밤을 먹었다." },
    ],
  },
  {
    id: "h1-02",
    word: "배",
    tier: 1,
    senses: [
      { label: "물에 뜨는 탈것", example: "배를 타고 섬에 갔다." },
      { label: "먹는 과일 또는 몸의 부위", example: "배가 아파서 배를 못 먹었다." },
    ],
  },
  {
    id: "h1-03",
    word: "눈",
    tier: 1,
    senses: [
      { label: "보는 기관", example: "눈이 부시다." },
      { label: "하늘에서 내리는 것", example: "눈이 펑펑 내린다." },
    ],
  },
  {
    id: "h1-04",
    word: "말",
    tier: 1,
    senses: [
      { label: "입으로 하는 말", example: "말을 예쁘게 하자." },
      { label: "타는 동물", example: "말을 타고 달렸다." },
    ],
  },
  {
    id: "h1-05",
    word: "다리",
    tier: 1,
    senses: [
      { label: "몸의 다리", example: "다리가 아프다." },
      { label: "강 위의 다리", example: "다리를 건넜다." },
    ],
  },
  {
    id: "h1-06",
    word: "김",
    tier: 1,
    senses: [
      { label: "먹는 김", example: "김에 밥을 싸 먹었다." },
      { label: "뜨거울 때 나는 김", example: "국에서 김이 난다." },
    ],
  },
  {
    id: "h1-07",
    word: "차",
    tier: 1,
    senses: [
      { label: "자동차", example: "차를 타고 왔다." },
      { label: "마시는 차", example: "따뜻한 차를 마셨다." },
    ],
  },
  {
    id: "h1-08",
    word: "발",
    tier: 1,
    senses: [
      { label: "몸의 발", example: "발이 시리다." },
      { label: "창문에 치는 발", example: "발을 내려 햇빛을 가렸다." },
    ],
  },
  {
    id: "h1-09",
    word: "감",
    tier: 1,
    senses: [
      { label: "먹는 과일", example: "홍시 감이 달다." },
      { label: "느낌", example: "감이 좋다." },
    ],
  },
  {
    id: "h1-10",
    word: "사과",
    tier: 1,
    senses: [
      { label: "과일", example: "사과를 깎았다." },
      { label: "잘못을 빎", example: "친구에게 사과했다." },
    ],
  },
  {
    id: "h1-11",
    word: "코",
    tier: 1,
    senses: [
      { label: "얼굴의 코", example: "코가 막혔다." },
      { label: "그물이나 뜨개의 코", example: "뜨개질 코를 세었다." },
    ],
  },
  {
    id: "h1-12",
    word: "풀",
    tier: 1,
    senses: [
      { label: "붙이는 풀", example: "풀로 종이를 붙였다." },
      { label: "땅에 난 풀", example: "풀이 무성하다." },
    ],
  },

  // tier 2 — 한 번 생각해야 떠오르는 두 뜻
  {
    id: "h2-01",
    word: "타다",
    tier: 2,
    senses: [
      { label: "탈것에 오르다", example: "버스를 탔다." },
      { label: "불에 타다", example: "고기가 탔다." },
    ],
  },
  {
    id: "h2-02",
    word: "쓰다",
    tier: 2,
    senses: [
      { label: "글씨를 쓰다", example: "편지를 썼다." },
      { label: "맛이 쓰다", example: "약이 쓰다." },
    ],
  },
  {
    id: "h2-03",
    word: "차다",
    tier: 2,
    senses: [
      { label: "발로 차다", example: "공을 찼다." },
      { label: "온도가 차다", example: "물이 차다." },
    ],
  },
  {
    id: "h2-04",
    word: "싸다",
    tier: 2,
    senses: [
      { label: "값이 싸다", example: "이 옷은 싸다." },
      { label: "물건을 싸다", example: "짐을 쌌다." },
    ],
  },
  {
    id: "h2-05",
    word: "잡다",
    tier: 2,
    senses: [
      { label: "손으로 잡다", example: "손을 잡았다." },
      { label: "날짜를 정하다", example: "약속 날짜를 잡았다." },
    ],
  },
  {
    id: "h2-06",
    word: "들다",
    tier: 2,
    senses: [
      { label: "손에 들다", example: "가방을 들었다." },
      { label: "마음에 들다", example: "그 옷이 마음에 든다." },
    ],
  },
  {
    id: "h2-07",
    word: "치다",
    tier: 2,
    senses: [
      { label: "때리다", example: "북을 쳤다." },
      { label: "시험을 치다", example: "시험을 쳤다." },
    ],
  },
  {
    id: "h2-08",
    word: "묻다",
    tier: 2,
    senses: [
      { label: "질문하다", example: "길을 물었다." },
      { label: "흙에 묻다", example: "씨앗을 묻었다." },
    ],
  },
  {
    id: "h2-09",
    word: "걸다",
    tier: 2,
    senses: [
      { label: "옷을 걸다", example: "옷걸이에 걸었다." },
      { label: "전화를 걸다", example: "친구에게 전화를 걸었다." },
    ],
  },
  {
    id: "h2-10",
    word: "붙이다",
    tier: 2,
    senses: [
      { label: "풀로 붙이다", example: "우표를 붙였다." },
      { label: "이름을 붙이다", example: "강아지에게 이름을 붙였다." },
    ],
  },
  {
    id: "h2-11",
    word: "머리",
    tier: 2,
    senses: [
      { label: "몸의 머리", example: "머리가 아프다." },
      { label: "생각하는 능력", example: "머리가 좋다." },
    ],
  },
  {
    id: "h2-12",
    word: "손",
    tier: 2,
    senses: [
      { label: "몸의 손", example: "손을 씻었다." },
      { label: "일손", example: "손이 모자란다." },
    ],
  },

  // tier 3 — 어른이 먼저 떠올릴 만한 두 뜻
  {
    id: "h3-01",
    word: "시장",
    tier: 3,
    senses: [
      { label: "물건 파는 시장", example: "시장에서 과일을 샀다." },
      { label: "도시의 시장님", example: "시장이 인사말을 했다." },
    ],
  },
  {
    id: "h3-02",
    word: "정상",
    tier: 3,
    senses: [
      { label: "산꼭대기", example: "정상에 올랐다." },
      { label: "이상 없음", example: "검사 결과가 정상이다." },
    ],
  },
  {
    id: "h3-03",
    word: "기사",
    tier: 3,
    senses: [
      { label: "신문 기사", example: "기사를 읽었다." },
      { label: "운전기사", example: "기사님께 인사했다." },
    ],
  },
  {
    id: "h3-04",
    word: "연기",
    tier: 3,
    senses: [
      { label: "불에서 나는 연기", example: "연기가 자욱하다." },
      { label: "배우의 연기", example: "연기가 훌륭했다." },
    ],
  },
  {
    id: "h3-05",
    word: "부치다",
    tier: 3,
    senses: [
      { label: "편지를 부치다", example: "편지를 부쳤다." },
      { label: "전을 부치다", example: "전을 부쳤다." },
    ],
  },
  {
    id: "h3-06",
    word: "이르다",
    tier: 3,
    senses: [
      { label: "시간이 이르다", example: "아직 이르다." },
      { label: "말해서 알리다", example: "선생님께 일렀다." },
    ],
  },
  {
    id: "h3-07",
    word: "장",
    tier: 3,
    senses: [
      { label: "종이 한 장", example: "종이 한 장을 꺼냈다." },
      { label: "된장·간장 같은 장", example: "장을 담갔다." },
    ],
  },
  {
    id: "h3-08",
    word: "속",
    tier: 3,
    senses: [
      { label: "안쪽", example: "가방 속을 뒤졌다." },
      { label: "마음", example: "속이 상했다." },
    ],
  },
  {
    id: "h3-09",
    word: "줄",
    tier: 3,
    senses: [
      { label: "묶는 줄", example: "줄로 묶었다." },
      { label: "차례로 선 줄", example: "줄을 섰다." },
    ],
  },
  {
    id: "h3-10",
    word: "빨다",
    tier: 3,
    senses: [
      { label: "빨래하다", example: "옷을 빨았다." },
      { label: "입으로 빨다", example: "사탕을 빨았다." },
    ],
  },
  {
    id: "h3-11",
    word: "굽다",
    tier: 3,
    senses: [
      { label: "불에 굽다", example: "고기를 구웠다." },
      { label: "휘어 있다", example: "허리가 굽었다." },
    ],
  },
  {
    id: "h3-12",
    word: "일다",
    tier: 3,
    senses: [
      { label: "생겨나다", example: "바람이 일었다." },
      { label: "쌀을 일다", example: "쌀을 일어 씻었다." },
    ],
  },
];
