export interface CargoCard {
  id: string;
  label: string;
  emoji: string;
  weight: 1 | 2 | 3;
}

/**
 * "멈출까? 짐칸 6"용 짐 카드.
 * 한 번 실을 때마다 무게 1·1·2·2·3·3 여섯 장으로 덱을 만들어서,
 * 팀마다 확률이 완전히 같습니다. 이름만 매번 달라져 지루하지 않아요.
 */
export const CARGO_CARDS: CargoCard[] = [
  // 무게 1 — 가벼운 것
  { id: "w1-01", label: "튜브", emoji: "🛟", weight: 1 },
  { id: "w1-02", label: "물안경", emoji: "🥽", weight: 1 },
  { id: "w1-03", label: "선크림", emoji: "🧴", weight: 1 },
  { id: "w1-04", label: "슬리퍼", emoji: "🩴", weight: 1 },
  { id: "w1-05", label: "모자", emoji: "🧢", weight: 1 },
  { id: "w1-06", label: "손수건", emoji: "🧻", weight: 1 },
  { id: "w1-07", label: "젤리", emoji: "🍬", weight: 1 },
  { id: "w1-08", label: "이어폰", emoji: "🎧", weight: 1 },
  { id: "w1-09", label: "부채", emoji: "🪭", weight: 1 },
  { id: "w1-10", label: "카드", emoji: "🃏", weight: 1 },
  { id: "w1-11", label: "양말", emoji: "🧦", weight: 1 },
  { id: "w1-12", label: "볼펜", emoji: "🖊️", weight: 1 },

  // 무게 2 — 보통
  { id: "w2-01", label: "수박", emoji: "🍉", weight: 2 },
  { id: "w2-02", label: "돗자리", emoji: "🧺", weight: 2 },
  { id: "w2-03", label: "축구공", emoji: "⚽", weight: 2 },
  { id: "w2-04", label: "베개", emoji: "🛏️", weight: 2 },
  { id: "w2-05", label: "치킨", emoji: "🍗", weight: 2 },
  { id: "w2-06", label: "우산", emoji: "☂️", weight: 2 },
  { id: "w2-07", label: "보드게임", emoji: "🎲", weight: 2 },
  { id: "w2-08", label: "물통", emoji: "🚰", weight: 2 },
  { id: "w2-09", label: "카메라", emoji: "📷", weight: 2 },
  { id: "w2-10", label: "책 묶음", emoji: "📚", weight: 2 },
  { id: "w2-11", label: "라디오", emoji: "📻", weight: 2 },
  { id: "w2-12", label: "화분", emoji: "🪴", weight: 2 },

  // 무게 3 — 무거운 것
  { id: "w3-01", label: "아이스박스", emoji: "🧊", weight: 3 },
  { id: "w3-02", label: "텐트", emoji: "⛺", weight: 3 },
  { id: "w3-03", label: "캐리어", emoji: "🧳", weight: 3 },
  { id: "w3-04", label: "이불 뭉치", emoji: "🛌", weight: 3 },
  { id: "w3-05", label: "바비큐 그릴", emoji: "🍖", weight: 3 },
  { id: "w3-06", label: "자전거", emoji: "🚲", weight: 3 },
  { id: "w3-07", label: "냉장고", emoji: "🧊", weight: 3 },
  { id: "w3-08", label: "장작 더미", emoji: "🪵", weight: 3 },
  { id: "w3-09", label: "여행 가방", emoji: "🎒", weight: 3 },
  { id: "w3-10", label: "물놀이 미끄럼틀", emoji: "🛝", weight: 3 },
  { id: "w3-11", label: "대형 튜브", emoji: "🦩", weight: 3 },
  { id: "w3-12", label: "선베드", emoji: "🏖️", weight: 3 },
];
