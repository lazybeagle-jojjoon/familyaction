export interface ListChallenge {
  id: string;
  /** "~를 30초 안에 N개" 형태로 화면에 나옵니다 */
  category: string;
  /** 목표 개수 */
  target: number;
  /** 진행자가 헷갈릴 때 참고할 예시 (정답 목록이 아니라 판정 기준) */
  hint: string;
  band: "child" | "adult" | "common";
}

/**
 * 열거 대결용 문항.
 * 30초 안에 정해진 개수를 대는 게임이라 지식보다 순발력과 팀워크가 큽니다.
 * 아이 문항·어른 문항·공통 문항을 팀마다 하나씩 받아 세대 균형을 맞춥니다.
 */
export const LIST_CHALLENGES: ListChallenge[] = [
  // 아이가 유리한 문항
  { id: "lc-c01", category: "포켓몬 이름", target: 5, hint: "피카츄, 꼬부기 같은 이름이면 인정", band: "child" },
  { id: "lc-c02", category: "학용품", target: 6, hint: "연필, 지우개, 자, 가위 등", band: "child" },
  { id: "lc-c03", category: "아이스크림 맛", target: 5, hint: "초코, 딸기, 바닐라 등", band: "child" },
  { id: "lc-c04", category: "만화 주인공", target: 5, hint: "짱구, 도라에몽 등 캐릭터 이름", band: "child" },
  { id: "lc-c05", category: "학교에 있는 것", target: 7, hint: "교실, 칠판, 운동장 등", band: "child" },
  { id: "lc-c06", category: "동물원에서 볼 수 있는 동물", target: 7, hint: "사자, 기린, 코끼리 등", band: "child" },
  { id: "lc-c07", category: "분식집 메뉴", target: 6, hint: "떡볶이, 순대, 튀김 등", band: "child" },
  { id: "lc-c08", category: "놀이터에 있는 것", target: 5, hint: "미끄럼틀, 그네, 시소 등", band: "child" },
  { id: "lc-c09", category: "게임 이름", target: 5, hint: "아는 게임 제목이면 인정", band: "child" },
  { id: "lc-c10", category: "빨간색 물건", target: 6, hint: "사과, 소방차, 딸기 등", band: "child" },
  { id: "lc-c11", category: "바다에 사는 것", target: 7, hint: "물고기, 문어, 상어 등", band: "child" },
  { id: "lc-c12", category: "과일 이름", target: 8, hint: "누구나 아는 과일이면 인정", band: "child" },
  { id: "lc-c13", category: "공으로 하는 운동", target: 5, hint: "축구, 농구, 야구 등", band: "child" },
  { id: "lc-c14", category: "네 발 달린 동물", target: 7, hint: "개, 고양이, 소, 말 등", band: "child" },
  { id: "lc-c15", category: "생일에 있는 것", target: 5, hint: "케이크, 초, 선물 등", band: "child" },

  // 어른이 유리한 문항
  { id: "lc-a01", category: "90년대 유행했던 것", target: 5, hint: "삐삐, 워크맨, 다마고치 등", band: "adult" },
  { id: "lc-a02", category: "찌개 종류", target: 5, hint: "김치찌개, 된장찌개 등", band: "adult" },
  { id: "lc-a03", category: "우리나라 광역시", target: 5, hint: "부산, 대구, 인천, 광주, 대전, 울산", band: "adult" },
  { id: "lc-a04", category: "트로트 가수", target: 4, hint: "이름만 대면 인정", band: "adult" },
  { id: "lc-a05", category: "직장에서 쓰는 말", target: 6, hint: "회의, 보고, 결재, 야근 등", band: "adult" },
  { id: "lc-a06", category: "은행에서 하는 일", target: 4, hint: "입금, 출금, 이체, 대출 등", band: "adult" },
  { id: "lc-a07", category: "김치 종류", target: 4, hint: "배추김치, 깍두기, 총각김치 등", band: "adult" },
  { id: "lc-a08", category: "명절 음식", target: 6, hint: "전, 송편, 떡국, 갈비찜 등", band: "adult" },
  { id: "lc-a09", category: "자동차 브랜드", target: 5, hint: "국산·수입 아무거나", band: "adult" },
  { id: "lc-a10", category: "옛날 과자", target: 5, hint: "쫀드기, 아폴로, 라면땅 등", band: "adult" },
  { id: "lc-a11", category: "집들이 선물", target: 4, hint: "휴지, 세제, 화분 등", band: "adult" },
  { id: "lc-a12", category: "우리나라 강 이름", target: 4, hint: "한강, 낙동강, 금강, 영산강 등", band: "adult" },
  { id: "lc-a13", category: "회 종류", target: 4, hint: "광어, 우럭, 연어 등", band: "adult" },
  { id: "lc-a14", category: "가전제품", target: 7, hint: "냉장고, 세탁기, 에어컨 등", band: "adult" },
  { id: "lc-a15", category: "결혼식에서 볼 수 있는 것", target: 6, hint: "부케, 신부, 축의금 등", band: "adult" },

  // 온 가족 공통 문항
  { id: "lc-s01", category: "노란색인 것", target: 6, hint: "바나나, 병아리, 해바라기 등", band: "common" },
  { id: "lc-s02", category: "둥근 것", target: 7, hint: "공, 해, 접시, 동전 등", band: "common" },
  { id: "lc-s03", category: "차가운 것", target: 6, hint: "얼음, 아이스크림, 겨울 등", band: "common" },
  { id: "lc-s04", category: "냄새로 알 수 있는 것", target: 5, hint: "빵, 커피, 비 오는 날 등", band: "common" },
  { id: "lc-s05", category: "물에 뜨는 것", target: 5, hint: "나무, 튜브, 배 등", band: "common" },
  { id: "lc-s06", category: "소리가 나는 것", target: 7, hint: "종, 북, 전화, 알람 등", band: "common" },
  { id: "lc-s07", category: "주방에 있는 것", target: 8, hint: "냄비, 숟가락, 도마 등", band: "common" },
  { id: "lc-s08", category: "몸의 부위", target: 8, hint: "손, 발, 귀, 코 등", band: "common" },
  { id: "lc-s09", category: "탈것", target: 7, hint: "자동차, 버스, 기차, 배 등", band: "common" },
  { id: "lc-s10", category: "직업", target: 8, hint: "의사, 선생님, 요리사 등", band: "common" },
  { id: "lc-s11", category: "날씨를 나타내는 말", target: 6, hint: "맑음, 흐림, 비, 눈 등", band: "common" },
  { id: "lc-s12", category: "매운 음식", target: 5, hint: "떡볶이, 김치, 라면 등", band: "common" },
  { id: "lc-s13", category: "여름에 하는 것", target: 6, hint: "수영, 물놀이, 빙수 등", band: "common" },
  { id: "lc-s14", category: "네모난 것", target: 6, hint: "책, 창문, 상자 등", band: "common" },
  { id: "lc-s15", category: "빨래에 필요한 것", target: 5, hint: "세제, 세탁기, 건조대 등", band: "common" },
  { id: "lc-s16", category: "겨울에 하는 것", target: 5, hint: "눈싸움, 스키, 붕어빵 등", band: "common" },
  { id: "lc-s17", category: "손으로 하는 일", target: 6, hint: "쓰기, 씻기, 잡기 등", band: "common" },
  { id: "lc-s18", category: "우리 집에 있는 방", target: 4, hint: "거실, 주방, 화장실 등", band: "common" },
  { id: "lc-s19", category: "종이로 만드는 것", target: 5, hint: "책, 딱지, 비행기 등", band: "common" },
  { id: "lc-s20", category: "밤에 볼 수 있는 것", target: 5, hint: "달, 별, 가로등 등", band: "common" },
];
