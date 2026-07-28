export interface TrapCard {
  id: string;
  topic: string;
  /** 상대가 이 말들 중 하나라도 뱉으면 공격 성공 */
  forbidden: [string, string, string];
  /** 공격자가 던질 첫 질문 */
  opener: string;
  band: "child" | "adult" | "common";
}

/**
 * 말하면 지는 인터뷰용 카드.
 * 공격팀만 화면을 보고, 30초 안에 상대가 금지어를 말하게 유도합니다.
 * 지식이 아니라 말솜씨 싸움이라 어른과 아이 어느 쪽도 절대 유리하지 않습니다.
 */
export const TRAP_CARDS: TrapCard[] = [
  // 아이가 답하기 좋은 주제
  { id: "k01", topic: "치킨", forbidden: ["닭", "바삭", "맛있"], opener: "야식으로 딱 하나만 시킬 수 있다면?", band: "child" },
  { id: "k02", topic: "학교", forbidden: ["선생님", "친구", "공부"], opener: "오늘 학교에서 제일 기억나는 일이 뭐야?", band: "child" },
  { id: "k03", topic: "게임", forbidden: ["레벨", "캐릭터", "재밌"], opener: "요즘 제일 많이 하는 게임 얘기 좀 해줄래?", band: "child" },
  { id: "k04", topic: "간식", forbidden: ["달", "과자", "먹"], opener: "학교 끝나고 제일 먼저 찾는 게 뭐야?", band: "child" },
  { id: "k05", topic: "방학", forbidden: ["숙제", "놀", "여행"], opener: "방학 되면 제일 하고 싶은 게 뭐야?", band: "child" },
  { id: "k06", topic: "강아지", forbidden: ["귀엽", "털", "산책"], opener: "동물 키운다면 뭘 키우고 싶어?", band: "child" },
  { id: "k07", topic: "생일", forbidden: ["선물", "케이크", "축하"], opener: "생일에 뭐 하고 싶어?", band: "child" },
  { id: "k08", topic: "유튜브", forbidden: ["영상", "구독", "채널"], opener: "요즘 뭐 보면서 시간 보내?", band: "child" },
  { id: "k09", topic: "체육시간", forbidden: ["뛰", "공", "운동"], opener: "학교에서 제일 좋아하는 시간은?", band: "child" },
  { id: "k10", topic: "떡볶이", forbidden: ["맵", "빨간", "떡"], opener: "분식집 가면 뭘 제일 먼저 시켜?", band: "child" },
  { id: "k11", topic: "만화", forbidden: ["주인공", "재밌", "그림"], opener: "제일 좋아하는 만화 얘기해줄래?", band: "child" },
  { id: "k12", topic: "수영", forbidden: ["물", "수영", "차갑"], opener: "여름에 제일 하고 싶은 거 하나만 말해봐.", band: "child" },
  { id: "k13", topic: "장난감", forbidden: ["사", "놀", "새"], opener: "문방구 가면 뭘 제일 오래 구경해?", band: "child" },
  { id: "k14", topic: "눈 오는 날", forbidden: ["눈", "춥", "하얀"], opener: "겨울에 제일 좋아하는 날씨는 어떤 날이야?", band: "child" },
  { id: "k15", topic: "친구", forbidden: ["친구", "같이", "놀"], opener: "주말에 보통 누구랑 시간 보내?", band: "child" },
  { id: "k16", topic: "축구", forbidden: ["골", "공", "차"], opener: "운동장에서 뭐 하고 노는 게 제일 재밌어?", band: "child" },
  { id: "k17", topic: "아이스크림", forbidden: ["차갑", "녹", "달"], opener: "더울 때 제일 먼저 생각나는 거는?", band: "child" },
  { id: "k18", topic: "시험", forbidden: ["점수", "공부", "어렵"], opener: "학교에서 제일 긴장되는 순간이 언제야?", band: "child" },
  { id: "k19", topic: "캐릭터 카드", forbidden: ["모으", "카드", "희귀"], opener: "요즘 친구들 사이에서 유행하는 게 뭐야?", band: "child" },
  { id: "k20", topic: "놀이공원", forbidden: ["타", "무서", "줄"], opener: "가족이랑 놀러 가면 어디가 제일 좋아?", band: "child" },

  // 어른이 답하기 좋은 주제
  { id: "a01", topic: "출근", forbidden: ["회사", "지하철", "피곤"], opener: "평일 아침에 가장 먼저 드는 생각이 뭐예요?", band: "adult" },
  { id: "a02", topic: "커피", forbidden: ["카페", "쓴", "아메리카노"], opener: "아침에 꼭 챙기는 게 있으세요?", band: "adult" },
  { id: "a03", topic: "월급", forbidden: ["돈", "통장", "카드"], opener: "매달 25일쯤엔 기분이 어떠세요?", band: "adult" },
  { id: "a04", topic: "명절", forbidden: ["가족", "음식", "고향"], opener: "일 년 중에 제일 정신없는 때가 언제예요?", band: "adult" },
  { id: "a05", topic: "운전", forbidden: ["차", "주차", "막히"], opener: "출퇴근할 때 제일 스트레스받는 게 뭐예요?", band: "adult" },
  { id: "a06", topic: "다이어트", forbidden: ["살", "운동", "먹"], opener: "새해마다 세우는 계획이 있으세요?", band: "adult" },
  { id: "a07", topic: "집안일", forbidden: ["청소", "빨래", "설거지"], opener: "주말에 집에서 제일 많이 하는 게 뭐예요?", band: "adult" },
  { id: "a08", topic: "학창시절", forbidden: ["학교", "친구", "공부"], opener: "옛날 생각 나는 물건이 있으세요?", band: "adult" },
  { id: "a09", topic: "회식", forbidden: ["술", "고기", "노래"], opener: "직장에서 피하고 싶은 자리가 있어요?", band: "adult" },
  { id: "a10", topic: "여행", forbidden: ["가", "짐", "비행기"], opener: "요즘 제일 하고 싶은 게 뭐예요?", band: "adult" },
  { id: "a11", topic: "잠", forbidden: ["자", "피곤", "졸"], opener: "요즘 제일 부족한 게 뭐예요?", band: "adult" },
  { id: "a12", topic: "장보기", forbidden: ["마트", "사", "비싸"], opener: "주말에 꼭 하는 일이 있으세요?", band: "adult" },
  { id: "a13", topic: "등산", forbidden: ["산", "오르", "힘들"], opener: "주말에 몸 쓰는 취미 있으세요?", band: "adult" },
  { id: "a14", topic: "휴대폰 요금", forbidden: ["돈", "요금", "비싸"], opener: "매달 아까운 지출이 있으세요?", band: "adult" },
  { id: "a15", topic: "라면", forbidden: ["끓", "면", "국물"], opener: "밤에 갑자기 배고프면 뭐 하세요?", band: "adult" },
  { id: "a16", topic: "드라마", forbidden: ["보", "재밌", "결말"], opener: "요즘 저녁에 뭐 하면서 쉬세요?", band: "adult" },
  { id: "a17", topic: "병원", forbidden: ["아프", "약", "의사"], opener: "요즘 몸에서 신경 쓰이는 데 있으세요?", band: "adult" },
  { id: "a18", topic: "아이 숙제", forbidden: ["숙제", "공부", "학원"], opener: "저녁에 아이랑 뭘 제일 많이 하세요?", band: "adult" },
  { id: "a19", topic: "노래방", forbidden: ["노래", "부르", "점수"], opener: "스트레스 풀 때 어디 가세요?", band: "adult" },
  { id: "a20", topic: "택배", forbidden: ["시키", "박스", "배송"], opener: "요즘 집에 제일 자주 오는 게 뭐예요?", band: "adult" },

  // 누구나 답할 수 있는 주제
  { id: "s01", topic: "수영장", forbidden: ["물", "수영", "차갑"], opener: "풀빌라 오면 제일 먼저 뭐 하고 싶어요?", band: "common" },
  { id: "s02", topic: "고양이", forbidden: ["귀엽", "털", "야옹"], opener: "동물 중에 제일 좋아하는 게 뭐예요?", band: "common" },
  { id: "s03", topic: "피자", forbidden: ["치즈", "도우", "조각"], opener: "다 같이 시켜 먹는다면 뭐가 좋아요?", band: "common" },
  { id: "s04", topic: "비 오는 날", forbidden: ["비", "우산", "젖"], opener: "제일 싫어하는 날씨가 언제예요?", band: "common" },
  { id: "s05", topic: "휴대폰", forbidden: ["폰", "화면", "충전"], opener: "하루 종일 손에서 안 놓는 게 있어요?", band: "common" },
  { id: "s06", topic: "바다", forbidden: ["바다", "파도", "짜"], opener: "여름휴가 어디로 가고 싶어요?", band: "common" },
  { id: "s07", topic: "치과", forbidden: ["이", "아프", "치료"], opener: "가기 싫은 곳이 어디예요?", band: "common" },
  { id: "s08", topic: "겨울", forbidden: ["춥", "눈", "겨울"], opener: "네 계절 중에 어떤 게 제일 좋아요?", band: "common" },
  { id: "s09", topic: "라면 끓이기", forbidden: ["끓", "물", "면"], opener: "제일 자신 있는 요리가 뭐예요?", band: "common" },
  { id: "s10", topic: "사진", forbidden: ["찍", "카메라", "웃"], opener: "여행 가면 꼭 하는 게 있어요?", band: "common" },
  { id: "s11", topic: "선물", forbidden: ["주", "받", "포장"], opener: "생일에 제일 기억에 남는 일이 뭐예요?", band: "common" },
  { id: "s12", topic: "수박", forbidden: ["빨간", "씨", "달"], opener: "여름에 제일 자주 먹는 과일이 뭐예요?", band: "common" },
  { id: "s13", topic: "지각", forbidden: ["늦", "뛰", "시간"], opener: "아침에 제일 당황한 적 있어요?", band: "common" },
  { id: "s14", topic: "모기", forbidden: ["물리", "가렵", "소리"], opener: "여름밤에 제일 짜증나는 게 뭐예요?", band: "common" },
  { id: "s15", topic: "엘리베이터", forbidden: ["타", "층", "버튼"], opener: "집에 들어갈 때 꼭 거치는 게 있어요?", band: "common" },
  { id: "s16", topic: "김치", forbidden: ["맵", "빨간", "담그"], opener: "밥상에 꼭 있어야 하는 반찬이 뭐예요?", band: "common" },
  { id: "s17", topic: "자전거", forbidden: ["타", "바퀴", "페달"], opener: "밖에서 몸 쓰고 노는 거 뭐 좋아해요?", band: "common" },
  { id: "s18", topic: "설거지", forbidden: ["그릇", "물", "씻"], opener: "밥 먹고 나면 누가 뭘 해요?", band: "common" },
  { id: "s19", topic: "잠옷", forbidden: ["자", "옷", "편하"], opener: "집에 오면 제일 먼저 뭐 해요?", band: "common" },
  { id: "s20", topic: "무지개", forbidden: ["색", "하늘", "비"], opener: "하늘 보다가 감탄한 적 있어요?", band: "common" },
];
