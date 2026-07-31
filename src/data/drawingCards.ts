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
 *
 * 전부 단어입니다. 예전에는 "택배 상자 든 사람", "월급날 통장 스쳐감" 같은 상황 카드가
 * 절반이었는데, 12획으로 장면을 설명하는 건 사실상 불가능해서 매번 막혔어요.
 * 난이도는 그리기 어려운 사물로 올립니다.
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

  // tier 2 — 조금 더 복잡한 사물
  { id: "d2-01", answer: "자전거", tier: 2 },
  { id: "d2-02", answer: "기타", tier: 2 },
  { id: "d2-03", answer: "코끼리", tier: 2 },
  { id: "d2-04", answer: "문어", tier: 2 },
  { id: "d2-05", answer: "로켓", tier: 2 },
  { id: "d2-06", answer: "주전자", tier: 2 },
  { id: "d2-07", answer: "헬리콥터", tier: 2 },
  { id: "d2-08", answer: "공룡", tier: 2 },
  { id: "d2-09", answer: "선풍기", tier: 2 },
  { id: "d2-10", answer: "우체통", tier: 2 },
  { id: "d2-11", answer: "등대", tier: 2 },
  { id: "d2-12", answer: "피아노", tier: 2 },
  { id: "d2-13", answer: "낙타", tier: 2 },
  { id: "d2-14", answer: "해바라기", tier: 2 },
  { id: "d2-15", answer: "전화기", tier: 2 },
  { id: "d2-16", answer: "가로등", tier: 2 },
  { id: "d2-17", answer: "텐트", tier: 2 },
  { id: "d2-18", answer: "펭귄", tier: 2 },
  { id: "d2-19", answer: "자물쇠", tier: 2 },
  { id: "d2-20", answer: "나비", tier: 2 },

  // tier 3 — 12획으로 담기 까다로운 사물
  { id: "d3-01", answer: "관람차", aliases: ["대관람차"], tier: 3 },
  { id: "d3-02", answer: "롤러코스터", tier: 3 },
  { id: "d3-03", answer: "에스컬레이터", tier: 3 },
  { id: "d3-04", answer: "현미경", tier: 3 },
  { id: "d3-05", answer: "주사위", tier: 3 },
  { id: "d3-06", answer: "드럼", aliases: ["드럼세트"], tier: 3 },
  { id: "d3-07", answer: "소화기", tier: 3 },
  { id: "d3-08", answer: "신호등", tier: 3 },
  { id: "d3-09", answer: "계단", tier: 3 },
  { id: "d3-10", answer: "분수대", aliases: ["분수"], tier: 3 },
  { id: "d3-11", answer: "풍차", tier: 3 },
  { id: "d3-12", answer: "낚싯대", tier: 3 },
  { id: "d3-13", answer: "트로피", tier: 3 },
  { id: "d3-14", answer: "사마귀", tier: 3 },
  { id: "d3-15", answer: "공작", tier: 3 },
  { id: "d3-16", answer: "바이올린", tier: 3 },
  { id: "d3-17", answer: "망원경", tier: 3 },
  { id: "d3-18", answer: "타워크레인", aliases: ["크레인"], tier: 3 },
  { id: "d3-19", answer: "회전목마", tier: 3 },
  { id: "d3-20", answer: "모래시계", tier: 3 },
];
