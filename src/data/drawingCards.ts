export interface DrawingCard {
  id: string;
  answer: string;
  aliases?: string[];
  /** 1이 가장 쉽고 3이 가장 어렵습니다 */
  tier: 1 | 2 | 3;
}

/**
 * 열두 획 화백용 카드.
 * 획 수가 12개로 제한돼서 그림 실력보다 '무엇을 그릴지 고르는 감각'이 중요합니다.
 * 그래서 어른이 특별히 유리하지 않고, 아이가 그린 그림이 더 잘 통할 때도 많습니다.
 */
export const DRAWING_CARDS: DrawingCard[] = [
  // tier 1 — 단순한 사물
  { id: "d1-01", answer: "우산", tier: 1 },
  { id: "d1-02", answer: "안경", tier: 1 },
  { id: "d1-03", answer: "집", tier: 1 },
  { id: "d1-04", answer: "나무", tier: 1 },
  { id: "d1-05", answer: "자동차", tier: 1 },
  { id: "d1-06", answer: "물고기", tier: 1 },
  { id: "d1-07", answer: "케이크", tier: 1 },
  { id: "d1-08", answer: "시계", tier: 1 },
  { id: "d1-09", answer: "열쇠", tier: 1 },
  { id: "d1-10", answer: "사다리", tier: 1 },
  { id: "d1-11", answer: "달팽이", tier: 1 },
  { id: "d1-12", answer: "돛단배", aliases: ["배"], tier: 1 },
  { id: "d1-13", answer: "눈사람", tier: 1 },
  { id: "d1-14", answer: "풍선", tier: 1 },
  { id: "d1-15", answer: "촛불", aliases: ["초"], tier: 1 },
  { id: "d1-16", answer: "버섯", tier: 1 },
  { id: "d1-17", answer: "칫솔", tier: 1 },
  { id: "d1-18", answer: "야구방망이", aliases: ["방망이"], tier: 1 },
  { id: "d1-19", answer: "선물상자", aliases: ["선물"], tier: 1 },
  { id: "d1-20", answer: "깃발", tier: 1 },

  // tier 2 — 상황이나 조합
  { id: "d2-01", answer: "우산이 뒤집힌 사람", aliases: ["뒤집힌 우산"], tier: 2 },
  { id: "d2-02", answer: "수박 먹는 상어", aliases: ["상어와 수박"], tier: 2 },
  { id: "d2-03", answer: "선풍기 앞에서 노래하기", aliases: ["선풍기 노래"], tier: 2 },
  { id: "d2-04", answer: "라면 먹는 고양이", tier: 2 },
  { id: "d2-05", answer: "우주로 가는 자전거", tier: 2 },
  { id: "d2-06", answer: "낚시하는 펭귄", tier: 2 },
  { id: "d2-07", answer: "우산 쓴 강아지", tier: 2 },
  { id: "d2-08", answer: "케이크 위의 촛불 세 개", tier: 2 },
  { id: "d2-09", answer: "잠자는 사자", tier: 2 },
  { id: "d2-10", answer: "비 오는 날 버스 정류장", tier: 2 },
  { id: "d2-11", answer: "수영장 미끄럼틀", tier: 2 },
  { id: "d2-12", answer: "축구공에 맞은 사람", tier: 2 },
  { id: "d2-13", answer: "아이스크림 떨어뜨린 아이", tier: 2 },
  { id: "d2-14", answer: "김밥 마는 손", tier: 2 },
  { id: "d2-15", answer: "달을 보는 늑대", tier: 2 },
  { id: "d2-16", answer: "빨래 널린 옥상", tier: 2 },
  { id: "d2-17", answer: "택배 상자 든 사람", tier: 2 },
  { id: "d2-18", answer: "낮잠 자는 할아버지", tier: 2 },
  { id: "d2-19", answer: "바나나 껍질 밟기", tier: 2 },
  { id: "d2-20", answer: "모기 잡는 사람", tier: 2 },

  // tier 3 — 추상적이거나 웃긴 장면
  { id: "d3-01", answer: "지각해서 뛰는 사람", tier: 3 },
  { id: "d3-02", answer: "화장실 급한 사람", tier: 3 },
  { id: "d3-03", answer: "매운 거 먹고 물 찾기", tier: 3 },
  { id: "d3-04", answer: "코골며 자는 사람", tier: 3 },
  { id: "d3-05", answer: "시험 망친 사람", tier: 3 },
  { id: "d3-06", answer: "출근길 만원 지하철", tier: 3 },
  { id: "d3-07", answer: "다이어트 참는 사람", tier: 3 },
  { id: "d3-08", answer: "게임에서 진 사람", tier: 3 },
  { id: "d3-09", answer: "노래방에서 탬버린 치기", tier: 3 },
  { id: "d3-10", answer: "리모컨 찾는 사람", tier: 3 },
  { id: "d3-11", answer: "엘리베이터 닫힘 버튼 연타", tier: 3 },
  { id: "d3-12", answer: "휴대폰 배터리 없음", tier: 3 },
  { id: "d3-13", answer: "숙제 미루는 아이", tier: 3 },
  { id: "d3-14", answer: "명절에 잔소리 듣기", tier: 3 },
  { id: "d3-15", answer: "주차 자리 못 찾는 차", tier: 3 },
  { id: "d3-16", answer: "빙수 먹다 머리 띵", tier: 3 },
  { id: "d3-17", answer: "택시 안 잡히는 밤", tier: 3 },
  { id: "d3-18", answer: "우산 없이 소나기 맞기", tier: 3 },
  { id: "d3-19", answer: "이불 밖은 위험해", tier: 3 },
  { id: "d3-20", answer: "월급날 통장 스쳐감", tier: 3 },
];
