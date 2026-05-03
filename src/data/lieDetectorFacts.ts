export interface LieDetectorQuestion {
  fact: string;
  isTrue: boolean;
  explanation: string;
}

export const LIE_DETECTOR_FACTS: LieDetectorQuestion[] = [
  {
    fact: "문어는 심장이 3개다",
    isTrue: true,
    explanation: "두 개는 아가미 쪽으로 피를 보내고, 하나는 온몸으로 피를 보내요.",
  },
  {
    fact: "바나나는 나무에서 열린다",
    isTrue: false,
    explanation: "바나나 식물은 나무처럼 보이지만 사실 거대한 풀에 가까워요.",
  },
  {
    fact: "상어의 뼈는 대부분 딱딱한 뼈가 아니라 연골이다",
    isTrue: true,
    explanation: "상어의 몸속 뼈대는 귀나 코처럼 말랑한 연골로 이루어져 있어요.",
  },
  {
    fact: "펭귄은 북극에 산다",
    isTrue: false,
    explanation: "야생 펭귄은 주로 남반구에 살고, 북극에는 자연적으로 살지 않아요.",
  },
  {
    fact: "꿀은 아주 오래 보관될 수 있다",
    isTrue: true,
    explanation: "수분이 적고 산성이어서 미생물이 자라기 어려워요.",
  },
  {
    fact: "금붕어의 기억력은 3초뿐이다",
    isTrue: false,
    explanation: "금붕어도 학습하고 기억할 수 있다는 연구들이 있어요.",
  },
  {
    fact: "돌고래는 물고기다",
    isTrue: false,
    explanation: "돌고래는 새끼를 낳고 젖을 먹이는 포유류예요.",
  },
  {
    fact: "달은 스스로 빛을 낸다",
    isTrue: false,
    explanation: "달은 태양빛을 반사해서 밝게 보이는 거예요.",
  },
  {
    fact: "소리는 공기보다 물속에서 더 빠르게 이동한다",
    isTrue: true,
    explanation: "물속 입자들이 더 가까워서 진동이 더 빠르게 전달돼요.",
  },
  {
    fact: "번개는 태양 표면보다 뜨거울 수 있다",
    isTrue: true,
    explanation: "번개가 지나가는 길은 아주 짧은 순간 매우 높은 온도가 될 수 있어요.",
  },
  {
    fact: "금성의 하루는 금성의 1년보다 길다",
    isTrue: true,
    explanation: "금성은 자전이 아주 느려서 한 바퀴 도는 데 시간이 오래 걸려요.",
  },
  {
    fact: "아기는 어른보다 뼈가 더 적다",
    isTrue: false,
    explanation: "아기는 뼈가 더 많고, 자라면서 일부 뼈가 서로 붙어요.",
  },
  {
    fact: "낙타 혹에는 물이 가득 들어 있다",
    isTrue: false,
    explanation: "낙타 혹에는 물이 아니라 지방이 저장돼요.",
  },
  {
    fact: "북극곰의 피부는 검은색이다",
    isTrue: true,
    explanation: "털 아래 피부는 검은색이라 햇빛의 열을 흡수하는 데 도움이 돼요.",
  },
  {
    fact: "사람은 죽은 뒤에도 머리카락과 손톱이 계속 자란다",
    isTrue: false,
    explanation: "실제로 자라는 것이 아니라 피부가 마르며 그렇게 보일 수 있어요.",
  },
  {
    fact: "땅콩은 땅속에서 자란다",
    isTrue: true,
    explanation: "땅콩 꽃이 핀 뒤 열매가 땅속으로 들어가 자라요.",
  },
  {
    fact: "박쥐는 새다",
    isTrue: false,
    explanation: "박쥐는 날 수 있지만 새가 아니라 포유류예요.",
  },
  {
    fact: "일부 거북이는 겨울에 엉덩이 쪽으로 산소를 흡수할 수 있다",
    isTrue: true,
    explanation: "차가운 물속에서 오래 버티기 위해 특별한 방식으로 산소를 얻는 종류가 있어요.",
  },
  {
    fact: "코알라는 사람처럼 지문이 있다",
    isTrue: true,
    explanation: "코알라의 손가락 무늬는 사람 지문과 꽤 비슷해요.",
  },
  {
    fact: "타조는 하늘을 날 수 있다",
    isTrue: false,
    explanation: "타조는 날 수 없지만 매우 빠르게 달릴 수 있어요.",
  },
  {
    fact: "해파리는 뇌가 없다",
    isTrue: true,
    explanation: "해파리는 뇌 대신 단순한 신경망으로 움직여요.",
  },
  {
    fact: "화성의 하루는 지구의 하루와 꽤 비슷하다",
    isTrue: true,
    explanation: "화성의 하루는 약 24시간 39분 정도예요.",
  },
  {
    fact: "모든 사막은 아주 덥다",
    isTrue: false,
    explanation: "남극처럼 매우 추운 사막도 있어요.",
  },
  {
    fact: "남극은 사막이다",
    isTrue: true,
    explanation: "사막은 비나 눈이 아주 적게 오는 곳인데, 남극도 강수량이 적어요.",
  },
  {
    fact: "혀는 부위마다 단맛, 짠맛을 완전히 따로 느낀다",
    isTrue: false,
    explanation: "혀의 여러 부분에서 대부분의 맛을 느낄 수 있어요.",
  },
  {
    fact: "연필심에는 납이 들어 있다",
    isTrue: false,
    explanation: "연필심은 납이 아니라 흑연과 점토로 만들어져요.",
  },
  {
    fact: "우주에서도 키가 조금 커질 수 있다",
    isTrue: true,
    explanation: "중력이 줄어 척추 사이가 살짝 늘어날 수 있어요.",
  },
  {
    fact: "고양이는 언제나 반드시 발로 착지한다",
    isTrue: false,
    explanation: "고양이는 몸을 돌리는 능력이 좋지만 높이나 상황에 따라 다칠 수 있어요.",
  },
  {
    fact: "흰곰의 털은 실제로 투명에 가깝다",
    isTrue: true,
    explanation: "털 자체는 색이 거의 없고 빛이 반사되어 하얗게 보여요.",
  },
  {
    fact: "잠자리는 뒤로 날 수 있다",
    isTrue: true,
    explanation: "잠자리는 앞, 뒤, 옆으로 매우 자유롭게 날 수 있어요.",
  },
  {
    fact: "거미는 곤충이다",
    isTrue: false,
    explanation: "곤충은 다리가 6개지만 거미는 다리가 8개인 거미류예요.",
  },
  {
    fact: "수컷 해마가 새끼를 품는다",
    isTrue: true,
    explanation: "해마는 수컷의 주머니에서 새끼가 자라는 독특한 동물이에요.",
  },
  {
    fact: "개구리는 피부로도 물을 흡수한다",
    isTrue: true,
    explanation: "개구리는 피부가 촉촉해야 하고 물을 피부로 받아들일 수 있어요.",
  },
  {
    fact: "벌은 춤으로 다른 벌에게 먹이 위치를 알려줄 수 있다",
    isTrue: true,
    explanation: "꿀벌은 몸을 흔드는 춤으로 방향과 거리를 알려줘요.",
  },
  {
    fact: "명왕성은 지금도 태양계의 9번째 행성이다",
    isTrue: false,
    explanation: "명왕성은 현재 왜소행성으로 분류돼요.",
  },
  {
    fact: "태양은 별이다",
    isTrue: true,
    explanation: "태양은 지구에서 가장 가까운 별이에요.",
  },
  {
    fact: "공룡과 사람은 같은 시대에 살았다",
    isTrue: false,
    explanation: "사람은 공룡이 멸종한 훨씬 뒤에 등장했어요.",
  },
  {
    fact: "태양계에는 행성이 8개 있다",
    isTrue: true,
    explanation: "수성부터 해왕성까지 8개의 행성이 있어요.",
  },
  {
    fact: "자석은 모든 금속에 붙는다",
    isTrue: false,
    explanation: "자석은 철처럼 특정 금속에는 잘 붙지만 모든 금속에 붙지는 않아요.",
  },
  {
    fact: "소금물은 보통 민물보다 더 낮은 온도에서 언다",
    isTrue: true,
    explanation: "소금이 물의 어는점을 낮추기 때문이에요.",
  },
  {
    fact: "얼음은 물보다 가벼워서 물 위에 뜬다",
    isTrue: true,
    explanation: "얼음은 액체 물보다 밀도가 낮아서 떠요.",
  },
  {
    fact: "무지개는 사실 완전한 동그라미 모양일 수 있다",
    isTrue: true,
    explanation: "땅에서는 일부만 보여서 반원처럼 보이는 경우가 많아요.",
  },
  {
    fact: "모기는 암컷만 피를 빨아 먹는다",
    isTrue: true,
    explanation: "암컷 모기는 알을 만들기 위해 피가 필요할 때가 있어요.",
  },
  {
    fact: "펭귄은 하늘을 날지는 못하지만 물속에서는 날개로 헤엄친다",
    isTrue: true,
    explanation: "펭귄의 날개는 물속에서 빠르게 움직이는 데 잘 맞게 변했어요.",
  },
  {
    fact: "토끼는 설치류다",
    isTrue: false,
    explanation: "토끼는 설치류가 아니라 토끼목 동물이에요.",
  },
  {
    fact: "달팽이는 이가 없다",
    isTrue: false,
    explanation: "달팽이는 아주 작은 이빨 같은 구조가 많이 있어요.",
  },
  {
    fact: "딸기 겉의 작은 점들은 씨처럼 보인다",
    isTrue: true,
    explanation: "우리가 씨처럼 보는 작은 점들이 딸기 겉에 붙어 있어요.",
  },
  {
    fact: "바닷물은 그냥 마셔도 갈증 해소에 좋다",
    isTrue: false,
    explanation: "바닷물은 소금이 많아 몸에 부담을 줄 수 있어요.",
  },
  {
    fact: "나비도 처음에는 애벌레였다",
    isTrue: true,
    explanation: "나비는 알, 애벌레, 번데기 과정을 거쳐 어른벌레가 돼요.",
  },
  {
    fact: "감자는 뿌리가 아니라 줄기 부분이다",
    isTrue: true,
    explanation: "감자는 땅속에서 굵어진 줄기인 덩이줄기예요.",
  },
  {
    fact: "양파를 자르면 눈물이 날 수 있다",
    isTrue: true,
    explanation: "양파에서 나온 물질이 눈을 자극해서 눈물이 날 수 있어요.",
  },
];
