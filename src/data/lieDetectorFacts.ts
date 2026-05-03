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
  {
    fact: "사람의 피는 몸 밖으로 나오면 파란색이 된다",
    isTrue: false,
    explanation: "피는 몸 안에서도 밖에서도 붉은색 계열로 보여요.",
  },
  {
    fact: "사람은 땀을 흘리며 몸의 열을 식힐 수 있다",
    isTrue: true,
    explanation: "땀이 증발하면서 몸에서 열을 가져가 시원해지는 데 도움을 줘요.",
  },
  {
    fact: "뼈는 죽은 돌처럼 아무 변화가 없는 물질이다",
    isTrue: false,
    explanation: "뼈도 살아 있는 조직이라 자라고 회복될 수 있어요.",
  },
  {
    fact: "사람의 몸은 물이 큰 비중을 차지한다",
    isTrue: true,
    explanation: "몸속 세포와 피, 여러 기관에는 많은 물이 들어 있어요.",
  },
  {
    fact: "폐는 공기에서 산소를 받아들이는 일을 한다",
    isTrue: true,
    explanation: "숨을 쉬면 폐에서 산소가 피로 옮겨져 온몸으로 가요.",
  },
  {
    fact: "심장은 피를 온몸으로 보내는 펌프 역할을 한다",
    isTrue: true,
    explanation: "심장이 뛰면서 피가 몸 구석구석으로 이동해요.",
  },
  {
    fact: "귀지는 귀를 보호하는 데 도움을 줄 수 있다",
    isTrue: true,
    explanation: "귀지는 먼지와 이물질이 안쪽으로 들어가는 것을 줄여줘요.",
  },
  {
    fact: "유치는 한 번 빠지면 다시는 이가 나지 않는다",
    isTrue: false,
    explanation: "유치가 빠진 자리에는 보통 영구치가 새로 나요.",
  },
  {
    fact: "문어의 피는 붉은색이 아니라 푸른빛을 띨 수 있다",
    isTrue: true,
    explanation: "문어 피에는 구리를 포함한 물질이 있어 푸르게 보일 수 있어요.",
  },
  {
    fact: "오징어도 심장이 여러 개 있다",
    isTrue: true,
    explanation: "오징어는 문어처럼 심장이 3개인 동물이에요.",
  },
  {
    fact: "암탉은 수탉이 없어도 알을 낳을 수 있다",
    isTrue: true,
    explanation: "우리가 먹는 달걀 중에는 병아리가 되지 않는 알도 많아요.",
  },
  {
    fact: "벌새는 뒤로 날 수 있다",
    isTrue: true,
    explanation: "벌새는 날개를 빠르게 움직여 뒤쪽으로도 날 수 있어요.",
  },
  {
    fact: "기린은 목이 길어서 사람보다 목뼈 개수가 훨씬 많다",
    isTrue: false,
    explanation: "기린도 사람처럼 목뼈가 보통 7개예요. 대신 뼈 하나하나가 길어요.",
  },
  {
    fact: "고래는 물고기다",
    isTrue: false,
    explanation: "고래는 물속에 살지만 새끼를 낳고 젖을 먹이는 포유류예요.",
  },
  {
    fact: "카멜레온은 주변 상황이나 몸 상태에 따라 색이 달라질 수 있다",
    isTrue: true,
    explanation: "빛, 온도, 기분 같은 여러 이유로 몸 색이 바뀔 수 있어요.",
  },
  {
    fact: "개미는 자기 몸보다 훨씬 무거운 것을 들 수 있다",
    isTrue: true,
    explanation: "개미는 몸집에 비해 힘이 세서 큰 먹이를 옮길 수 있어요.",
  },
  {
    fact: "모기는 이빨로 사람을 문다",
    isTrue: false,
    explanation: "모기는 바늘처럼 생긴 입 부분으로 피부를 찔러요.",
  },
  {
    fact: "불가사리는 물고기다",
    isTrue: false,
    explanation: "불가사리는 이름에 물고기라는 말이 들어가지만 물고기는 아니에요.",
  },
  {
    fact: "침팬지는 도구를 사용할 수 있다",
    isTrue: true,
    explanation: "침팬지는 나뭇가지 같은 도구로 먹이를 얻는 행동을 해요.",
  },
  {
    fact: "코끼리의 엄니는 사실 이빨의 한 종류다",
    isTrue: true,
    explanation: "코끼리 엄니는 길게 자란 앞니예요.",
  },
  {
    fact: "고양이는 단맛을 사람처럼 잘 느끼지 못한다",
    isTrue: true,
    explanation: "고양이는 단맛을 느끼는 능력이 사람과 달라요.",
  },
  {
    fact: "거북이는 등껍질을 벗고 다른 집으로 이사할 수 있다",
    isTrue: false,
    explanation: "거북이 등껍질은 몸의 일부라 벗고 살 수 없어요.",
  },
  {
    fact: "일부 불가사리는 잘린 팔을 다시 자라게 할 수 있다",
    isTrue: true,
    explanation: "종류에 따라 잃은 팔을 재생하는 능력이 있어요.",
  },
  {
    fact: "수성은 태양에 가장 가까운 행성이다",
    isTrue: true,
    explanation: "태양계 행성 중 수성이 태양과 가장 가까워요.",
  },
  {
    fact: "태양에 가장 가까운 수성이 태양계에서 가장 뜨거운 행성이다",
    isTrue: false,
    explanation: "가장 뜨거운 행성은 두꺼운 대기를 가진 금성이에요.",
  },
  {
    fact: "목성은 태양계에서 가장 큰 행성이다",
    isTrue: true,
    explanation: "목성은 다른 행성들보다 훨씬 큰 거대 행성이에요.",
  },
  {
    fact: "달에는 바람이 거의 없어 발자국이 오래 남을 수 있다",
    isTrue: true,
    explanation: "달에는 지구처럼 발자국을 지울 바람이나 비가 거의 없어요.",
  },
  {
    fact: "우주에서는 소리가 공기처럼 잘 퍼진다",
    isTrue: false,
    explanation: "소리는 전달할 공기 같은 물질이 필요해서 우주 공간에서는 잘 퍼지지 않아요.",
  },
  {
    fact: "국제우주정거장은 지구 주위를 돈다",
    isTrue: true,
    explanation: "국제우주정거장은 지구 주변 궤도를 빠르게 돌고 있어요.",
  },
  {
    fact: "태양빛이 지구까지 오는 데 약 8분 정도 걸린다",
    isTrue: true,
    explanation: "빛은 아주 빠르지만 태양과 지구 사이가 멀어서 시간이 조금 걸려요.",
  },
  {
    fact: "지구는 완벽하게 매끈한 공 모양이다",
    isTrue: false,
    explanation: "지구는 자전 때문에 적도 쪽이 살짝 불룩하고 표면도 울퉁불퉁해요.",
  },
  {
    fact: "별똥별은 진짜 별이 하늘에서 떨어지는 것이다",
    isTrue: false,
    explanation: "별똥별은 작은 우주 먼지나 돌조각이 대기에서 타며 빛나는 현상이에요.",
  },
  {
    fact: "계절은 지구가 기울어진 채 태양 주위를 돌기 때문에 생긴다",
    isTrue: true,
    explanation: "지구의 기울기 때문에 햇빛을 받는 각도와 시간이 달라져요.",
  },
  {
    fact: "달 모양이 바뀌는 것은 달이 실제로 줄었다 커지기 때문이다",
    isTrue: false,
    explanation: "달은 그대로이고 태양빛을 받는 부분이 달라 보이는 거예요.",
  },
  {
    fact: "화성은 붉게 보이는 행성이다",
    isTrue: true,
    explanation: "화성 표면의 철 성분이 녹슨 것처럼 보여 붉은빛을 띠어요.",
  },
  {
    fact: "토성의 고리는 얼음과 작은 돌조각들로 이루어져 있다",
    isTrue: true,
    explanation: "토성의 고리에는 수많은 얼음 조각과 암석 조각이 있어요.",
  },
  {
    fact: "태양은 영원히 계속 같은 모습으로 빛난다",
    isTrue: false,
    explanation: "태양도 아주 긴 시간이 지나면 모습과 밝기가 달라져요.",
  },
  {
    fact: "지구 표면의 대부분은 물로 덮여 있다",
    isTrue: true,
    explanation: "지구 표면은 땅보다 바다와 물이 차지하는 부분이 더 커요.",
  },
  {
    fact: "강물은 대체로 높은 곳에서 낮은 곳으로 흐른다",
    isTrue: true,
    explanation: "중력 때문에 물은 낮은 곳을 향해 흘러가요.",
  },
  {
    fact: "화산에서 나온 용암은 식으면 돌이 될 수 있다",
    isTrue: true,
    explanation: "뜨거운 용암이 식고 굳으면 화산암 같은 돌이 돼요.",
  },
  {
    fact: "구름은 솜으로 만들어져 있다",
    isTrue: false,
    explanation: "구름은 아주 작은 물방울이나 얼음 알갱이로 이루어져 있어요.",
  },
  {
    fact: "눈은 얼음 결정으로 이루어져 있다",
    isTrue: true,
    explanation: "눈송이는 물이 얼어 생긴 작은 결정들이 모여 만들어져요.",
  },
  {
    fact: "번개가 보인 뒤 천둥소리가 늦게 들릴 수 있다",
    isTrue: true,
    explanation: "빛이 소리보다 훨씬 빠르기 때문에 번개가 먼저 보여요.",
  },
  {
    fact: "태풍은 육지에 올라오면 힘이 약해질 수 있다",
    isTrue: true,
    explanation: "따뜻한 바다에서 얻던 에너지가 줄어들기 때문이에요.",
  },
  {
    fact: "공기는 아무 무게가 없다",
    isTrue: false,
    explanation: "공기도 물질이라 무게가 있고 압력을 만들어요.",
  },
  {
    fact: "식물은 빛이 있어야 광합성을 할 수 있다",
    isTrue: true,
    explanation: "광합성은 빛 에너지를 이용해 양분을 만드는 과정이에요.",
  },
  {
    fact: "선인장은 물을 저장하는 능력이 있다",
    isTrue: true,
    explanation: "건조한 곳에서 버티기 위해 줄기 등에 물을 저장해요.",
  },
  {
    fact: "대나무는 나무가 아니라 풀의 한 종류다",
    isTrue: true,
    explanation: "대나무는 키가 크지만 식물 분류로는 벼과에 속하는 풀이에요.",
  },
  {
    fact: "꽃가루는 식물의 씨앗이다",
    isTrue: false,
    explanation: "꽃가루는 씨앗을 만드는 데 필요한 가루이고 씨앗 자체는 아니에요.",
  },
  {
    fact: "사과를 잘라 두면 갈색으로 변할 수 있다",
    isTrue: true,
    explanation: "사과 속 성분이 공기와 만나 색이 변하는 현상이 일어나요.",
  },
  {
    fact: "토마토는 식물학적으로 열매에 속한다",
    isTrue: true,
    explanation: "꽃이 핀 뒤 씨를 품고 생기는 부분이라 열매로 볼 수 있어요.",
  },
  {
    fact: "콩나물은 콩에서 자란 싹이다",
    isTrue: true,
    explanation: "콩에 물을 주고 키우면 콩나물이 자라요.",
  },
  {
    fact: "뜨거운 공기는 차가운 공기보다 위로 올라가려는 성질이 있다",
    isTrue: true,
    explanation: "뜨거워진 공기는 밀도가 낮아져 위쪽으로 움직이기 쉬워요.",
  },
  {
    fact: "그림자는 빛이 물체에 막힐 때 생긴다",
    isTrue: true,
    explanation: "빛이 지나가지 못한 곳이 어둡게 보여 그림자가 돼요.",
  },
  {
    fact: "거울은 빛을 반사해서 모습을 보여준다",
    isTrue: true,
    explanation: "거울 표면은 빛을 잘 반사해 우리 모습이 보이게 해요.",
  },
  {
    fact: "플라스틱은 자연에서 매우 빨리 녹아 사라진다",
    isTrue: false,
    explanation: "많은 플라스틱은 자연에서 분해되는 데 아주 오래 걸려요.",
  },
  {
    fact: "유리는 모래를 재료로 만들 수 있다",
    isTrue: true,
    explanation: "유리의 중요한 재료 중 하나가 모래 속 규소 성분이에요.",
  },
  {
    fact: "종이는 나무에서 나온 섬유로 만들 수 있다",
    isTrue: true,
    explanation: "나무 섬유를 가공해 종이를 만드는 경우가 많아요.",
  },
  {
    fact: "물은 해수면 근처에서 보통 100도쯤 끓는다",
    isTrue: true,
    explanation: "기압에 따라 조금 달라지지만 보통 100도 근처에서 끓어요.",
  },
  {
    fact: "기름은 물과 쉽게 섞인다",
    isTrue: false,
    explanation: "기름과 물은 성질이 달라 잘 섞이지 않고 층이 생겨요.",
  },
  {
    fact: "설탕은 물에 녹을 수 있다",
    isTrue: true,
    explanation: "설탕 알갱이는 물속에서 작게 퍼져 녹아요.",
  },
  {
    fact: "쇠는 물과 산소를 만나 녹슬 수 있다",
    isTrue: true,
    explanation: "쇠가 산소와 물을 만나면 산화되어 녹이 생겨요.",
  },
  {
    fact: "소리는 물체나 공기의 진동으로 전달된다",
    isTrue: true,
    explanation: "진동이 주변 물질을 흔들며 귀까지 전달되면 소리로 느껴요.",
  },
  {
    fact: "무거운 물체는 어떤 상황에서도 가벼운 물체보다 빨리 떨어진다",
    isTrue: false,
    explanation: "공기 저항이 없으면 무게가 달라도 같은 속도로 떨어질 수 있어요.",
  },
  {
    fact: "공기 저항이 없으면 깃털과 쇠공도 같이 떨어질 수 있다",
    isTrue: true,
    explanation: "달처럼 공기가 거의 없는 곳에서는 이런 실험을 할 수 있어요.",
  },
  {
    fact: "전기는 젖은 손으로 만져도 항상 안전하다",
    isTrue: false,
    explanation: "물은 전기를 통하게 할 수 있어 젖은 손으로 전기 제품을 만지면 위험해요.",
  },
  {
    fact: "배터리는 에너지를 저장해 기계를 움직이게 할 수 있다",
    isTrue: true,
    explanation: "배터리 안의 화학 에너지가 전기 에너지로 바뀌어 쓰여요.",
  },
  {
    fact: "LED 전구는 전기 에너지를 빛으로 바꾼다",
    isTrue: true,
    explanation: "LED는 전기를 적게 쓰면서 빛을 내는 부품이에요.",
  },
  {
    fact: "냉장고는 안의 열을 밖으로 옮겨 차갑게 만든다",
    isTrue: true,
    explanation: "냉장고 뒤쪽이나 옆쪽이 따뜻해지는 이유가 여기에 있어요.",
  },
  {
    fact: "전자레인지는 음식을 차갑게 얼리는 기계다",
    isTrue: false,
    explanation: "전자레인지는 전자파로 음식 속 물 분자를 움직여 데우는 기계예요.",
  },
  {
    fact: "나침반은 대체로 북쪽을 가리킨다",
    isTrue: true,
    explanation: "지구의 자기장 때문에 나침반 바늘이 일정한 방향을 가리켜요.",
  },
  {
    fact: "QR코드는 그림처럼 보이지만 정보를 담을 수 있다",
    isTrue: true,
    explanation: "작은 네모 배열 안에 주소나 글자 같은 정보를 넣을 수 있어요.",
  },
  {
    fact: "와이파이는 선 없이 전파로 데이터를 보낸다",
    isTrue: true,
    explanation: "와이파이는 전파를 이용해 기기와 인터넷 장비를 연결해요.",
  },
  {
    fact: "터치스크린은 손가락이 닿은 위치를 감지할 수 있다",
    isTrue: true,
    explanation: "화면 안 센서가 손가락의 위치 변화를 알아차려요.",
  },
  {
    fact: "GPS는 인공위성 신호를 이용해 위치를 찾는다",
    isTrue: true,
    explanation: "여러 위성의 신호를 바탕으로 내 위치를 계산해요.",
  },
  {
    fact: "비행기는 공기의 힘을 이용해 날 수 있다",
    isTrue: true,
    explanation: "날개 주변의 공기 흐름이 비행기를 들어 올리는 힘을 만들어요.",
  },
  {
    fact: "헬륨 풍선은 공기보다 가벼워 위로 뜰 수 있다",
    isTrue: true,
    explanation: "헬륨은 주변 공기보다 가벼워 풍선이 떠오르게 해요.",
  },
  {
    fact: "안전벨트는 갑자기 멈출 때 몸을 잡아주는 역할을 한다",
    isTrue: true,
    explanation: "차가 급하게 멈출 때 몸이 앞으로 튀어나가는 것을 줄여줘요.",
  },
  {
    fact: "횡단보도 초록불이면 주변을 보지 않아도 무조건 안전하다",
    isTrue: false,
    explanation: "초록불이어도 차가 오는지 양쪽을 확인하는 습관이 중요해요.",
  },
  {
    fact: "엘리베이터 문에 기대는 것은 안전한 행동이다",
    isTrue: false,
    explanation: "엘리베이터 문은 벽이 아니어서 기대면 위험할 수 있어요.",
  },
  {
    fact: "수영장 물은 깨끗해 보여도 마시는 물이 아니다",
    isTrue: true,
    explanation: "수영장 물에는 소독약과 여러 이물질이 있을 수 있어 마시면 안 돼요.",
  },
  {
    fact: "젖은 바닥은 마른 바닥보다 미끄러울 수 있다",
    isTrue: true,
    explanation: "물기가 있으면 발이나 신발이 덜 미끄러지지 않고 더 쉽게 미끄러져요.",
  },
  {
    fact: "햇빛에는 자외선이 포함되어 있다",
    isTrue: true,
    explanation: "자외선은 피부를 태우거나 눈에 부담을 줄 수 있어요.",
  },
  {
    fact: "무지개는 비 오는 날에만 절대 볼 수 있다",
    isTrue: false,
    explanation: "분수나 물방울이 많은 곳에서도 햇빛 각도가 맞으면 무지개가 보일 수 있어요.",
  },
  {
    fact: "비누는 기름때를 물에 씻겨 나가게 돕는다",
    isTrue: true,
    explanation: "비누 분자는 물과 기름 사이를 이어 주어 때가 떨어지기 쉽게 해요.",
  },
  {
    fact: "얼음이 녹으면 물의 종류가 완전히 다른 물질로 바뀐다",
    isTrue: false,
    explanation: "얼음과 물은 상태만 다를 뿐 둘 다 같은 물질인 물이에요.",
  },
  {
    fact: "풍선 안에 공기를 많이 넣으면 압력이 커질 수 있다",
    isTrue: true,
    explanation: "공기 입자가 많아지면 풍선 안쪽을 미는 힘이 커져요.",
  },
  {
    fact: "컵을 거꾸로 엎으면 안에 있던 물은 중력 때문에 아래로 떨어지려 한다",
    isTrue: true,
    explanation: "중력은 물체를 지구 중심 쪽으로 끌어당겨요.",
  },
  {
    fact: "연필심은 전기를 조금 통할 수 있다",
    isTrue: true,
    explanation: "연필심의 흑연은 조건에 따라 전기를 통하게 할 수 있어요.",
  },
  {
    fact: "소화기는 불이 났을 때 아무 방향으로나 뿌리면 된다",
    isTrue: false,
    explanation: "소화기는 불의 아래쪽을 향해 안전하게 사용하는 것이 중요해요.",
  },
  {
    fact: "물이 든 페트병을 얼리면 부피가 늘어날 수 있다",
    isTrue: true,
    explanation: "물은 얼면서 부피가 커질 수 있어 병이 터질 수도 있어요.",
  },
  {
    fact: "빨대 안의 음료가 올라오는 데는 공기압도 관련이 있다",
    isTrue: true,
    explanation: "입으로 빨면 빨대 안 압력이 낮아지고 바깥 공기압이 음료를 밀어 올려요.",
  },
  {
    fact: "자전거 브레이크는 마찰을 이용해 속도를 줄인다",
    isTrue: true,
    explanation: "브레이크 패드와 바퀴가 맞닿으며 생기는 마찰이 움직임을 늦춰요.",
  },
  {
    fact: "컵라면 용기는 전자레인지에 모두 넣어도 안전하다",
    isTrue: false,
    explanation: "용기 종류에 따라 위험할 수 있으니 표시를 꼭 확인해야 해요.",
  },
  {
    fact: "물고기도 산소가 필요하다",
    isTrue: true,
    explanation: "물고기는 아가미로 물속에 녹아 있는 산소를 받아들여요.",
  },
  {
    fact: "나뭇잎이 초록색으로 보이는 데는 엽록소가 관련 있다",
    isTrue: true,
    explanation: "엽록소는 빛을 이용해 양분을 만드는 데 중요한 초록색 물질이에요.",
  },
  {
    fact: "빨간색 물감과 파란색 물감을 섞으면 보통 보라색 계열이 된다",
    isTrue: true,
    explanation: "물감은 색소가 섞이며 중간색처럼 보이는 색을 만들 수 있어요.",
  },
  {
    fact: "컴퓨터 파일 이름은 아무 글자나 무한히 길게 만들 수 있다",
    isTrue: false,
    explanation: "운영체제마다 파일 이름에 쓸 수 없는 글자와 길이 제한이 있어요.",
  },
  {
    fact: "휴대폰 화면 밝기를 낮추면 배터리를 아끼는 데 도움이 될 수 있다",
    isTrue: true,
    explanation: "화면은 전기를 많이 쓰는 부품 중 하나라 밝기를 낮추면 도움이 돼요.",
  },
];
