export interface SequenceCard {
  id: string;
  prompt: string;
  /** 올바른 순서. 화면에는 섞어서 보여줍니다. */
  ordered: [string, string, string, string];
  tier: 1 | 2 | 3;
  explanation: string;
}

/**
 * 뒤죽박죽 순서 맞추기용 카드.
 * 세대 지식(출시 연도 같은 것) 대신 한살이·생활 절차·원인과 결과를 써서
 * 어른과 아이가 같이 머리를 맞대면 풀 수 있게 합니다.
 */
export const SEQUENCE_CARDS: SequenceCard[] = [
  // tier 1 — 아이도 바로 아는 순서
  { id: "t1-01", prompt: "식물이 열매를 맺기까지", ordered: ["씨앗", "새싹", "꽃", "열매"], tier: 1, explanation: "씨앗이 싹을 틔우고 꽃이 핀 자리에 열매가 열려요." },
  { id: "t1-02", prompt: "나비의 한살이", ordered: ["알", "애벌레", "번데기", "나비"], tier: 1, explanation: "애벌레가 번데기를 거쳐 날개를 얻어요." },
  { id: "t1-03", prompt: "개구리의 한살이", ordered: ["알", "올챙이", "뒷다리가 난 올챙이", "개구리"], tier: 1, explanation: "올챙이는 뒷다리부터 나와요." },
  { id: "t1-04", prompt: "아침에 학교 갈 준비", ordered: ["일어나기", "세수하기", "옷 입기", "가방 메고 나가기"], tier: 1, explanation: "씻고 입고 챙겨서 나가요." },
  { id: "t1-05", prompt: "라면 끓이기", ordered: ["냄비에 물 붓기", "물 끓이기", "면과 스프 넣기", "그릇에 담기"], tier: 1, explanation: "물이 끓은 다음에 면을 넣어요." },
  { id: "t1-06", prompt: "이 닦기", ordered: ["칫솔에 치약 짜기", "이 닦기", "입 헹구기", "칫솔 꽂아두기"], tier: 1, explanation: "닦고 헹군 뒤 정리해요." },
  { id: "t1-07", prompt: "편지 보내기", ordered: ["편지 쓰기", "봉투에 넣기", "우표 붙이기", "우체통에 넣기"], tier: 1, explanation: "다 쓴 뒤 봉투와 우표를 준비해요." },
  { id: "t1-08", prompt: "물놀이 준비", ordered: ["수영복 갈아입기", "선크림 바르기", "준비운동", "물에 들어가기"], tier: 1, explanation: "몸을 풀고 나서 물에 들어가요." },
  { id: "t1-09", prompt: "케이크 만들기", ordered: ["재료 준비", "반죽 섞기", "오븐에 굽기", "크림 바르기"], tier: 1, explanation: "구운 다음에 장식해요." },
  { id: "t1-10", prompt: "빨래하기", ordered: ["옷 모으기", "세탁기 돌리기", "널기", "개어 넣기"], tier: 1, explanation: "말린 뒤에 정리해요." },
  { id: "t1-11", prompt: "하루의 시간", ordered: ["새벽", "아침", "낮", "밤"], tier: 1, explanation: "새벽이 지나 아침이 오고 밤이 돼요." },
  { id: "t1-12", prompt: "사계절", ordered: ["봄", "여름", "가을", "겨울"], tier: 1, explanation: "봄에서 시작해 겨울로 이어져요." },
  { id: "t1-13", prompt: "김밥 만들기", ordered: ["밥 짓기", "김 위에 밥 펴기", "재료 올려 말기", "썰기"], tier: 1, explanation: "말고 나서 썰어요." },
  { id: "t1-14", prompt: "눈사람 만들기", ordered: ["눈 뭉치기", "굴려서 키우기", "몸 위에 머리 얹기", "눈·코 붙이기"], tier: 1, explanation: "몸을 만들고 얼굴을 꾸며요." },
  { id: "t1-15", prompt: "생일 파티", ordered: ["초 꽂기", "불 붙이기", "노래 부르기", "촛불 끄기"], tier: 1, explanation: "노래가 끝나면 촛불을 꺼요." },

  // tier 2 — 한 번 생각해야 하는 순서
  { id: "t2-01", prompt: "비가 만들어지는 과정", ordered: ["물이 증발", "구름이 생김", "물방울이 뭉침", "비가 내림"], tier: 2, explanation: "증발한 물이 모여 무거워지면 떨어져요." },
  { id: "t2-02", prompt: "택배가 오는 과정", ordered: ["주문하기", "물건 포장", "배송 출발", "문 앞 도착"], tier: 2, explanation: "주문이 먼저고 도착이 마지막이에요." },
  { id: "t2-03", prompt: "병원 진료 받기", ordered: ["접수하기", "대기하기", "진료 받기", "약 타기"], tier: 2, explanation: "진료가 끝나야 처방을 받아요." },
  { id: "t2-04", prompt: "비행기 타기", ordered: ["표 예약", "공항 도착", "보안 검색", "탑승"], tier: 2, explanation: "검색대를 지나야 탑승해요." },
  { id: "t2-05", prompt: "요리 뒤 정리", ordered: ["먹기", "그릇 모으기", "설거지", "그릇 넣기"], tier: 2, explanation: "씻은 뒤 제자리에 넣어요." },
  { id: "t2-06", prompt: "달의 모양 변화", ordered: ["초승달", "상현달", "보름달", "그믐달"], tier: 2, explanation: "점점 차올랐다가 다시 줄어들어요." },
  { id: "t2-07", prompt: "종이가 만들어지는 과정", ordered: ["나무 베기", "잘게 부수기", "물에 풀기", "말려서 종이"], tier: 2, explanation: "잘게 푼 섬유를 펴서 말려요." },
  { id: "t2-08", prompt: "밥이 되는 과정", ordered: ["볍씨 심기", "모내기", "벼 베기", "쌀 찧기"], tier: 2, explanation: "거둔 벼를 찧어야 쌀이 돼요." },
  { id: "t2-09", prompt: "캠핑 하루", ordered: ["텐트 치기", "불 피우기", "고기 굽기", "정리하고 자기"], tier: 2, explanation: "자리를 만든 뒤에 요리해요." },
  { id: "t2-10", prompt: "김치 담그기", ordered: ["배추 절이기", "양념 만들기", "양념 바르기", "익히기"], tier: 2, explanation: "절인 뒤 양념을 발라 익혀요." },
  { id: "t2-11", prompt: "축구 경기", ordered: ["몸 풀기", "경기 시작", "하프타임", "경기 종료"], tier: 2, explanation: "전반이 끝나면 쉬었다가 후반을 해요." },
  { id: "t2-12", prompt: "영화 보러 가기", ordered: ["예매하기", "팝콘 사기", "상영관 입장", "엔딩크레딧"], tier: 2, explanation: "표를 산 뒤에 들어가요." },
  { id: "t2-13", prompt: "화분 키우기", ordered: ["흙 담기", "씨 뿌리기", "물 주기", "잎이 나옴"], tier: 2, explanation: "심고 물을 줘야 싹이 나요." },
  { id: "t2-14", prompt: "이사하는 날", ordered: ["짐 싸기", "짐 옮기기", "새 집에 놓기", "짐 풀기"], tier: 2, explanation: "옮긴 다음에 정리해요." },
  { id: "t2-15", prompt: "머리 감고 나가기", ordered: ["머리 감기", "물기 닦기", "드라이기로 말리기", "빗기"], tier: 2, explanation: "말린 뒤에 정돈해요." },

  // tier 3 — 어른과 아이가 같이 생각해야 하는 순서
  { id: "t3-01", prompt: "사람이 자라는 순서", ordered: ["아기", "어린이", "어른", "할머니 할아버지"], tier: 3, explanation: "시간이 흐르며 이어지는 순서예요." },
  { id: "t3-02", prompt: "우리나라에서 널리 쓰인 순서", ordered: ["카세트테이프", "시디", "엠피삼", "스마트폰"], tier: 3, explanation: "소리를 담는 방법이 점점 바뀌었어요." },
  { id: "t3-03", prompt: "연락 방법이 바뀐 순서", ordered: ["편지", "공중전화", "삐삐", "휴대폰"], tier: 3, explanation: "점점 빠르고 개인적인 방식으로 바뀌었어요." },
  { id: "t3-04", prompt: "번개가 치고 소리가 들리기까지", ordered: ["구름 속에 전기가 쌓임", "번개가 번쩍", "빛이 눈에 닿음", "천둥소리가 들림"], tier: 3, explanation: "빛이 소리보다 훨씬 빨라 번개를 먼저 보고 소리는 나중에 들어요." },
  { id: "t3-05", prompt: "다친 곳이 낫는 순서", ordered: ["상처가 남", "피가 멎음", "딱지가 생김", "새 살이 돋음"], tier: 3, explanation: "피가 멎고 딱지가 앉은 뒤에 새 살이 올라와요." },
  { id: "t3-06", prompt: "빵이 부풀어 구워지기까지", ordered: ["반죽하기", "발효로 부풀기", "굽기", "식히기"], tier: 3, explanation: "부풀린 뒤 구워서 식혀요." },
  { id: "t3-07", prompt: "우유가 치즈가 되기까지", ordered: ["우유 데우기", "덩어리 만들기", "물기 빼기", "숙성시키기"], tier: 3, explanation: "굳힌 뒤 시간을 두고 익혀요." },
  { id: "t3-08", prompt: "산불이 났을 때", ordered: ["연기 발견", "신고하기", "소방차 출동", "불 끄기"], tier: 3, explanation: "알리는 게 가장 먼저예요." },
  { id: "t3-09", prompt: "쓰레기가 처리되는 과정", ordered: ["분리배출", "수거차가 실어감", "선별장에서 나누기", "재활용"], tier: 3, explanation: "잘 나눠 버려야 다시 쓸 수 있어요." },
  { id: "t3-10", prompt: "물이 얼고 녹는 과정", ordered: ["미지근한 물", "찬물", "살얼음", "꽝꽝 언 얼음"], tier: 3, explanation: "온도가 내려가며 점점 굳어요." },
  { id: "t3-11", prompt: "여행 준비", ordered: ["날짜 정하기", "숙소 예약", "짐 싸기", "출발"], tier: 3, explanation: "정하고 예약한 뒤에 떠나요." },
  { id: "t3-12", prompt: "나무가 자라는 순서", ordered: ["씨앗", "묘목", "큰 나무", "베어져 목재"], tier: 3, explanation: "오랜 시간이 지나야 목재가 돼요." },
  { id: "t3-13", prompt: "요리 순서 (미역국)", ordered: ["미역 불리기", "고기 볶기", "물 붓고 끓이기", "간 맞추기"], tier: 3, explanation: "간은 마지막에 맞춰요." },
  { id: "t3-14", prompt: "저금해서 물건 사기", ordered: ["용돈 받기", "저금통에 모으기", "목표 금액 채우기", "물건 사기"], tier: 3, explanation: "모아야 살 수 있어요." },
  { id: "t3-15", prompt: "아침 해가 뜨는 과정", ordered: ["깜깜한 밤", "동이 틈", "해가 뜸", "환한 아침"], tier: 3, explanation: "어둠이 걷히며 밝아져요." },
];
