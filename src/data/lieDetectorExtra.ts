import type { LieDetectorQuestion } from "./lieDetectorFacts";

/**
 * 거짓말 탐지기 추가 문제.
 * 원래 풀이 진실 100 / 거짓 50이라 "무조건 진실"만 외쳐도 이기는 구조였습니다.
 * 여기서는 거짓을 더 많이 넣어 전체가 반반에 가까워지게 맞춥니다.
 * 진실 항목은 확실한 것만 담고, 설명은 어른이 읽어도 납득되게 한 문장으로 씁니다.
 */
export const LIE_DETECTOR_EXTRA_FACTS: LieDetectorQuestion[] = [
  // ── 거짓 (흔히 믿는 오해들) ──
  {
    fact: "만리장성은 달에서 맨눈으로 보인다",
    isTrue: false,
    explanation: "폭이 좁아서 우주에서 맨눈으로는 보이지 않아요.",
  },
  {
    fact: "사람은 뇌의 10퍼센트만 쓴다",
    isTrue: false,
    explanation: "하루 동안 뇌의 거의 모든 부분이 번갈아 일해요.",
  },
  {
    fact: "박쥐는 눈이 완전히 보이지 않는다",
    isTrue: false,
    explanation: "박쥐도 눈이 보이고, 어두울 때 소리를 함께 쓰는 거예요.",
  },
  {
    fact: "낙타는 혹에 물을 저장한다",
    isTrue: false,
    explanation: "혹에 들어 있는 건 물이 아니라 지방이에요.",
  },
  {
    fact: "타조는 위험하면 모래에 머리를 묻는다",
    isTrue: false,
    explanation: "머리를 낮춰 알을 살피는 모습이 그렇게 보였을 뿐이에요.",
  },
  {
    fact: "카멜레온은 주변 색에 맞추려고 몸 색을 바꾼다",
    isTrue: false,
    explanation: "주로 온도나 기분에 따라 색이 변해요.",
  },
  {
    fact: "손가락을 꺾으면 관절염에 걸린다",
    isTrue: false,
    explanation: "소리는 관절 속 기포가 터지는 소리이고 관절염과는 관계가 없어요.",
  },
  {
    fact: "머리카락은 자를수록 굵어진다",
    isTrue: false,
    explanation: "잘린 단면이 뭉툭해서 굵어 보일 뿐이에요.",
  },
  {
    fact: "감기는 추운 날씨 자체가 원인이다",
    isTrue: false,
    explanation: "감기는 바이러스 때문이고, 추우면 옮기 쉬운 환경이 될 뿐이에요.",
  },
  {
    fact: "껌을 삼키면 7년 동안 뱃속에 남는다",
    isTrue: false,
    explanation: "소화는 안 되지만 며칠 안에 그대로 몸 밖으로 나와요.",
  },
  {
    fact: "당근을 많이 먹으면 밤에도 잘 보인다",
    isTrue: false,
    explanation: "눈 건강에 도움은 되지만 어둠 속에서 잘 보이게 되진 않아요.",
  },
  {
    fact: "설탕은 이가 썩는 유일한 원인이다",
    isTrue: false,
    explanation: "입안 세균과 양치 습관이 함께 영향을 줘요.",
  },
  {
    fact: "번개는 같은 자리에 두 번 치지 않는다",
    isTrue: false,
    explanation: "높은 건물에는 같은 자리에 여러 번 떨어져요.",
  },
  {
    fact: "북극에는 펭귄이 산다",
    isTrue: false,
    explanation: "펭귄은 주로 남반구에 살아요.",
  },
  {
    fact: "지구는 완벽한 공 모양이다",
    isTrue: false,
    explanation: "적도 쪽이 살짝 부푼 찌그러진 공 모양이에요.",
  },
  {
    fact: "계절이 바뀌는 이유는 지구가 태양에서 멀어지기 때문이다",
    isTrue: false,
    explanation: "지구 자전축이 기울어져 있어서 계절이 생겨요.",
  },
  {
    fact: "달의 뒷면은 항상 어둡다",
    isTrue: false,
    explanation: "뒷면에도 낮과 밤이 있고, 우리 눈에 안 보일 뿐이에요.",
  },
  {
    fact: "유성은 별이 떨어지는 것이다",
    isTrue: false,
    explanation: "작은 먼지가 대기와 부딪히며 타는 빛이에요.",
  },
  {
    fact: "화성이 붉은 이유는 지금도 불타고 있기 때문이다",
    isTrue: false,
    explanation: "표면에 녹슨 철 성분이 많아서 붉게 보여요.",
  },
  {
    fact: "블랙홀은 근처의 모든 것을 무조건 빨아들인다",
    isTrue: false,
    explanation: "충분히 멀면 행성처럼 주위를 돌 수도 있어요.",
  },
  {
    fact: "공룡은 모두 크고 무거웠다",
    isTrue: false,
    explanation: "닭만 한 크기의 공룡도 많았어요.",
  },
  {
    fact: "거북이는 등껍질에서 빠져나올 수 있다",
    isTrue: false,
    explanation: "등껍질은 갈비뼈와 이어진 몸의 일부예요.",
  },
  {
    fact: "개는 색을 전혀 구별하지 못한다",
    isTrue: false,
    explanation: "사람보다 적지만 파랑과 노랑 계열은 구별해요.",
  },
  {
    fact: "고양이는 높은 곳에서 떨어져도 절대 다치지 않는다",
    isTrue: false,
    explanation: "잘 착지하는 편이지만 다치는 경우도 많아요.",
  },
  {
    fact: "코끼리는 쥐를 무서워한다",
    isTrue: false,
    explanation: "갑자기 움직이는 것에 놀랄 뿐 쥐를 특별히 무서워하지 않아요.",
  },
  {
    fact: "모든 벌은 한 번 쏘면 죽는다",
    isTrue: false,
    explanation: "꿀벌은 그렇지만 말벌은 여러 번 쏠 수 있어요.",
  },
  {
    fact: "지렁이를 반으로 자르면 두 마리가 된다",
    isTrue: false,
    explanation: "한쪽만 살아남는 경우가 대부분이에요.",
  },
  {
    fact: "개구리를 만지면 사마귀가 생긴다",
    isTrue: false,
    explanation: "사마귀는 바이러스 때문에 생겨요.",
  },
  {
    fact: "소는 빨간색을 보면 흥분한다",
    isTrue: false,
    explanation: "소는 붉은색을 잘 구별하지 못하고 천이 움직여서 반응해요.",
  },
  {
    fact: "닭은 전혀 날지 못한다",
    isTrue: false,
    explanation: "멀리는 못 가도 짧게 날아오를 수 있어요.",
  },
  {
    fact: "기린은 목이 길어서 목뼈가 사람보다 훨씬 많다",
    isTrue: false,
    explanation: "기린도 사람처럼 목뼈가 7개예요.",
  },
  {
    fact: "하마는 풀만 먹어서 사람에게 전혀 위험하지 않다",
    isTrue: false,
    explanation: "성격이 사나워서 아프리카에서 매우 위험한 동물로 꼽혀요.",
  },
  {
    fact: "나무늘보가 느린 것은 게을러서다",
    isTrue: false,
    explanation: "먹는 잎에서 얻는 에너지가 적어서 천천히 움직여요.",
  },
  {
    fact: "펭귄은 날지 못하니 헤엄도 잘 못 친다",
    isTrue: false,
    explanation: "물속에서는 날듯이 아주 빠르게 헤엄쳐요.",
  },
  {
    fact: "모기는 암컷과 수컷 모두 피를 빤다",
    isTrue: false,
    explanation: "피를 빠는 건 알을 만드는 암컷뿐이에요.",
  },
  {
    fact: "반딧불이의 불빛은 만지면 뜨겁다",
    isTrue: false,
    explanation: "거의 열이 나지 않는 차가운 빛이에요.",
  },
  {
    fact: "해바라기는 밤에도 해를 따라 고개를 돌린다",
    isTrue: false,
    explanation: "밤에는 다시 동쪽으로 천천히 돌아와요.",
  },
  {
    fact: "선인장은 물이 전혀 없어도 계속 살 수 있다",
    isTrue: false,
    explanation: "물을 적게 쓸 뿐 물이 아예 없으면 말라 죽어요.",
  },
  {
    fact: "대나무는 나무다",
    isTrue: false,
    explanation: "아주 크게 자라는 풀에 가까워요.",
  },
  {
    fact: "수박씨를 삼키면 배 속에서 수박이 자란다",
    isTrue: false,
    explanation: "소화 기관에서는 씨가 자랄 수 없어요.",
  },
  {
    fact: "사과 껍질에는 영양분이 거의 없다",
    isTrue: false,
    explanation: "껍질 쪽에 식이섬유와 영양분이 많아요.",
  },
  {
    fact: "전자레인지는 음식을 안쪽부터 익힌다",
    isTrue: false,
    explanation: "표면 근처부터 데워지고 열이 안으로 퍼져요.",
  },
  {
    fact: "냉장고 문을 열어두면 방이 시원해진다",
    isTrue: false,
    explanation: "뒤쪽으로 열을 내보내기 때문에 오히려 더워져요.",
  },
  {
    fact: "소금을 넣으면 물이 더 낮은 온도에서 끓는다",
    isTrue: false,
    explanation: "소금을 넣으면 끓는 온도가 조금 더 올라가요.",
  },
  {
    fact: "얼음의 온도는 항상 0도다",
    isTrue: false,
    explanation: "냉동실 얼음은 영하 십몇 도까지 내려가요.",
  },
  {
    fact: "천둥이 먼저 생기고 나서 번개가 친다",
    isTrue: false,
    explanation: "번개가 먼저 치고 그 소리가 천둥이에요.",
  },
  {
    fact: "무지개는 정확히 일곱 가지 색으로 나뉘어 있다",
    isTrue: false,
    explanation: "색이 이어져 있어서 몇 가지로 나눌지는 사람이 정한 거예요.",
  },
  {
    fact: "눈송이는 원래 하얀색이다",
    isTrue: false,
    explanation: "얼음은 투명한데 빛이 여러 번 반사돼 하얗게 보여요.",
  },
  {
    fact: "사막은 언제나 덥다",
    isTrue: false,
    explanation: "밤에는 몹시 춥고, 아주 추운 사막도 있어요.",
  },
  {
    fact: "바닷물은 짜서 절대 얼지 않는다",
    isTrue: false,
    explanation: "민물보다 더 낮은 온도에서 얼어요.",
  },
  {
    fact: "지구의 자석 북극과 지도의 북극은 같은 자리다",
    isTrue: false,
    explanation: "두 곳은 서로 떨어져 있고 조금씩 움직여요.",
  },
  {
    fact: "다이아몬드는 단단해서 절대 깨지지 않는다",
    isTrue: false,
    explanation: "긁히지 않을 뿐 세게 치면 깨져요.",
  },
  {
    fact: "금은 자석에 붙는다",
    isTrue: false,
    explanation: "금은 자석에 붙지 않아요.",
  },
  {
    fact: "유리는 재활용이 되지 않는다",
    isTrue: false,
    explanation: "유리는 여러 번 다시 녹여 쓸 수 있어요.",
  },
  {
    fact: "배터리는 완전히 다 쓴 뒤 충전해야 오래 쓴다",
    isTrue: false,
    explanation: "요즘 배터리는 조금씩 자주 충전하는 편이 좋아요.",
  },
  {
    fact: "비행기 창문은 안에서 열 수 있다",
    isTrue: false,
    explanation: "높은 곳에서 기압을 유지해야 해서 열리지 않아요.",
  },
  {
    fact: "비행기는 번개를 맞으면 곧바로 떨어진다",
    isTrue: false,
    explanation: "전기가 겉면을 타고 흘러 나가도록 만들어져 있어요.",
  },
  {
    fact: "떨어뜨린 음식도 5초 안에 주우면 세균이 붙지 않는다",
    isTrue: false,
    explanation: "닿는 순간 바로 묻어요.",
  },
  {
    fact: "왼손잡이는 오른쪽 뇌만 쓴다",
    isTrue: false,
    explanation: "누구나 양쪽 뇌를 함께 써요.",
  },
  {
    fact: "혀는 부위마다 느끼는 맛이 정해져 있다",
    isTrue: false,
    explanation: "혀 어디서든 여러 맛을 느낄 수 있어요.",
  },
  {
    fact: "안경을 쓰면 눈이 더 나빠진다",
    isTrue: false,
    explanation: "안 맞는 도수를 오래 쓰는 게 문제일 뿐이에요.",
  },
  {
    fact: "어두운 데서 책을 보면 눈이 먼다",
    isTrue: false,
    explanation: "눈이 피로해질 뿐 시력을 잃지는 않아요.",
  },
  {
    fact: "감기에 걸리면 항생제를 먹어야 낫는다",
    isTrue: false,
    explanation: "감기는 바이러스라서 항생제로는 낫지 않아요.",
  },
  {
    fact: "하품은 몸에 산소가 부족할 때만 나온다",
    isTrue: false,
    explanation: "졸리거나 지루할 때도 나오고 이유가 여러 가지예요.",
  },
  {
    fact: "우유를 많이 마시면 키가 반드시 큰다",
    isTrue: false,
    explanation: "도움은 되지만 키는 유전과 여러 조건이 함께 정해요.",
  },
  {
    fact: "시금치에는 다른 채소보다 철분이 압도적으로 많다",
    isTrue: false,
    explanation: "옛날 계산 실수가 퍼진 이야기예요.",
  },
  {
    fact: "물은 누구나 하루에 꼭 2리터를 마셔야 한다",
    isTrue: false,
    explanation: "몸무게와 활동량, 음식 속 수분에 따라 달라요.",
  },
  {
    fact: "설탕을 많이 먹으면 아이는 반드시 산만해진다",
    isTrue: false,
    explanation: "연구로는 뚜렷한 관계가 확인되지 않았어요.",
  },
  {
    fact: "유리는 아주 천천히 흐르는 액체다",
    isTrue: false,
    explanation: "오래된 창유리가 아래쪽이 두꺼운 건 만드는 방식 때문이에요.",
  },
  {
    fact: "우주에서는 무중력이라 근육이 저절로 튼튼해진다",
    isTrue: false,
    explanation: "오히려 근육과 뼈가 약해져서 매일 운동을 해요.",
  },
  {
    fact: "손을 아주 뜨거운 물로 씻으면 비누 없이도 세균이 다 죽는다",
    isTrue: false,
    explanation: "손이 견딜 만한 온도로는 부족해서 비누가 필요해요.",
  },
  {
    fact: "사람은 물속에서 눈을 뜨면 눈이 먼다",
    isTrue: false,
    explanation: "따갑고 흐릴 뿐 눈이 멀지는 않아요.",
  },
  {
    fact: "닭이 낳은 갈색 달걀이 흰 달걀보다 영양이 훨씬 높다",
    isTrue: false,
    explanation: "껍질 색은 닭의 품종 차이일 뿐이에요.",
  },
  {
    fact: "라면은 이미 익힌 면이라 끓이지 않아도 몸에 똑같다",
    isTrue: false,
    explanation: "튀겨서 말린 면이라 끓여야 제대로 익어요.",
  },
  {
    fact: "매운 음식을 먹고 물을 마시면 매운맛이 빨리 사라진다",
    isTrue: false,
    explanation: "매운 성분은 물에 잘 안 녹아서 우유가 더 나아요.",
  },
  {
    fact: "얼린 음식은 세균이 모두 죽어서 안전하다",
    isTrue: false,
    explanation: "활동을 멈출 뿐 녹으면 다시 늘어나요.",
  },
  {
    fact: "빨래는 뜨거운 물로만 빨아야 깨끗해진다",
    isTrue: false,
    explanation: "찬물용 세제로도 잘 빨려요.",
  },
  {
    fact: "번개가 칠 때 나무 아래에 서 있으면 안전하다",
    isTrue: false,
    explanation: "높은 나무는 번개가 잘 떨어지는 곳이라 아주 위험해요.",
  },
  {
    fact: "자동차 안이 번개에 안전한 이유는 고무 타이어 때문이다",
    isTrue: false,
    explanation: "금속 차체가 전기를 겉으로 흘려보내기 때문이에요.",
  },
  {
    fact: "낙타는 사막이 아니면 살 수 없다",
    isTrue: false,
    explanation: "추운 지역에 사는 낙타 종류도 있어요.",
  },
  {
    fact: "개미는 여왕개미가 일일이 명령을 내려 움직인다",
    isTrue: false,
    explanation: "여왕은 알을 낳고, 일은 서로 주고받는 신호로 정해져요.",
  },
  {
    fact: "고래는 입으로 물을 뿜는다",
    isTrue: false,
    explanation: "머리 위 숨구멍으로 숨을 내쉬는 거예요.",
  },
  {
    fact: "모든 상어는 평생 한 번도 쉬지 않는다",
    isTrue: false,
    explanation: "바닥에 머물러 쉬는 상어 종류도 있어요.",
  },
  {
    fact: "선풍기를 켠 채로 자면 반드시 위험하다",
    isTrue: false,
    explanation: "널리 퍼진 이야기지만 근거가 뚜렷하지 않아요.",
  },
  {
    fact: "무거운 물체가 가벼운 물체보다 항상 빨리 떨어진다",
    isTrue: false,
    explanation: "공기 저항이 없으면 같은 속도로 떨어져요.",
  },

  // ── 진실 ──
  {
    fact: "꿀벌은 춤을 춰서 꽃이 있는 방향을 알려준다",
    isTrue: true,
    explanation: "몸을 흔드는 각도와 시간으로 방향과 거리를 알려줘요.",
  },
  {
    fact: "코알라의 지문은 사람 지문과 아주 비슷하다",
    isTrue: true,
    explanation: "너무 닮아서 헷갈릴 정도라고 해요.",
  },
  {
    fact: "해마는 수컷이 새끼를 배 주머니에 품는다",
    isTrue: true,
    explanation: "암컷이 알을 맡기면 수컷이 품고 있다가 내보내요.",
  },
  {
    fact: "벌새는 뒤로도 날 수 있다",
    isTrue: true,
    explanation: "날개를 8자로 아주 빠르게 저어서 뒤로도 움직여요.",
  },
  {
    fact: "나무늘보는 일주일에 한 번 정도만 화장실에 간다",
    isTrue: true,
    explanation: "천천히 소화하기 때문에 아주 가끔 나무에서 내려와요.",
  },
  {
    fact: "플라밍고가 분홍색인 것은 먹이 때문이다",
    isTrue: true,
    explanation: "새우와 조류에 든 색소가 깃털을 물들여요.",
  },
  {
    fact: "달팽이의 입에는 아주 작은 이가 수천 개 있다",
    isTrue: true,
    explanation: "줄처럼 생긴 혀에 작은 이가 촘촘히 박혀 있어요.",
  },
  {
    fact: "지구에서 가장 큰 동물은 흰긴수염고래다",
    isTrue: true,
    explanation: "지금까지 살았던 동물 중에서도 가장 커요.",
  },
  {
    fact: "기린의 목뼈는 사람과 똑같이 7개다",
    isTrue: true,
    explanation: "뼈 하나하나가 아주 길어요.",
  },
  {
    fact: "개미는 아주 짧은 잠을 하루에 여러 번 잔다",
    isTrue: true,
    explanation: "몇 분씩 쉬는 잠을 수백 번 나눠 자요.",
  },
  {
    fact: "달에는 바람이 불지 않는다",
    isTrue: true,
    explanation: "공기가 거의 없어서 발자국도 오래 남아요.",
  },
  {
    fact: "우주 공간에서는 소리가 전달되지 않는다",
    isTrue: true,
    explanation: "소리를 옮겨 줄 공기가 없기 때문이에요.",
  },
  {
    fact: "토성은 물보다 가벼워서 아주 큰 물에 넣으면 뜬다",
    isTrue: true,
    explanation: "대부분 가벼운 기체로 되어 있어요.",
  },
  {
    fact: "금성은 하루가 1년보다 길다",
    isTrue: true,
    explanation: "스스로 도는 속도가 태양을 도는 속도보다 느려요.",
  },
  {
    fact: "목성에는 발을 디딜 단단한 땅이 없다",
    isTrue: true,
    explanation: "대부분 기체로 되어 있는 행성이에요.",
  },
  {
    fact: "태양빛이 지구까지 오는 데 약 8분이 걸린다",
    isTrue: true,
    explanation: "지금 보는 햇빛은 8분 전에 출발한 빛이에요.",
  },
  {
    fact: "국제우주정거장은 하루에 지구를 열 바퀴 넘게 돈다",
    isTrue: true,
    explanation: "약 90분에 한 바퀴씩 돌아요.",
  },
  {
    fact: "별똥별의 대부분은 모래알만 한 먼지다",
    isTrue: true,
    explanation: "작아도 아주 빨라서 타면서 밝게 보여요.",
  },
  {
    fact: "아기 때가 어른보다 뼈의 개수가 더 많다",
    isTrue: true,
    explanation: "자라면서 여러 뼈가 서로 붙어요.",
  },
  {
    fact: "사람 몸에서 가장 단단한 부분은 이의 겉면이다",
    isTrue: true,
    explanation: "법랑질이라고 부르는 아주 단단한 층이에요.",
  },
  {
    fact: "왼쪽 폐가 오른쪽 폐보다 조금 작다",
    isTrue: true,
    explanation: "심장이 들어갈 자리를 내주기 때문이에요.",
  },
  {
    fact: "심장은 하루에 10만 번 정도 뛴다",
    isTrue: true,
    explanation: "쉬지 않고 온몸으로 피를 보내요.",
  },
  {
    fact: "재채기를 하면서 눈을 뜨고 있기는 아주 어렵다",
    isTrue: true,
    explanation: "재채기와 함께 눈이 저절로 감겨요.",
  },
  {
    fact: "위 속에는 염산이 들어 있다",
    isTrue: true,
    explanation: "음식을 녹이고 세균을 막아 줘요.",
  },
  {
    fact: "눈물에는 세균을 막아 주는 성분이 들어 있다",
    isTrue: true,
    explanation: "눈을 씻어 주고 지켜 주는 역할도 해요.",
  },
  {
    fact: "소름이 돋는 것은 털을 세우려는 반응이다",
    isTrue: true,
    explanation: "털이 많던 시절의 흔적이 남은 거예요.",
  },
  {
    fact: "쌍둥이도 지문은 서로 다르다",
    isTrue: true,
    explanation: "지문은 자라면서 만들어져서 사람마다 달라요.",
  },
  {
    fact: "높은 산에서는 물이 100도보다 낮은 온도에서 끓는다",
    isTrue: true,
    explanation: "기압이 낮아서 더 쉽게 끓어요.",
  },
  {
    fact: "소금물은 맹물보다 더 늦게 언다",
    isTrue: true,
    explanation: "어는 온도가 0도보다 내려가요.",
  },
  {
    fact: "물은 얼면 부피가 늘어난다",
    isTrue: true,
    explanation: "그래서 얼음이 물에 떠요.",
  },
  {
    fact: "다이아몬드와 연필심은 같은 원소로 되어 있다",
    isTrue: true,
    explanation: "둘 다 탄소인데 붙어 있는 모양이 달라요.",
  },
  {
    fact: "무지개는 원래 동그란 모양이다",
    isTrue: true,
    explanation: "땅에 가려서 반원으로 보일 뿐이에요.",
  },
  {
    fact: "사하라 사막에 눈이 내린 적이 있다",
    isTrue: true,
    explanation: "드물게 기온이 크게 떨어지면 눈이 쌓이기도 해요.",
  },
  {
    fact: "에베레스트산은 지금도 아주 조금씩 높아지고 있다",
    isTrue: true,
    explanation: "땅덩어리가 계속 밀려 올라가고 있어요.",
  },
  {
    fact: "바닷물에는 금이 아주 조금 녹아 있다",
    isTrue: true,
    explanation: "너무 적어서 모으는 비용이 더 들어요.",
  },
  {
    fact: "사과를 물에 넣으면 뜬다",
    isTrue: true,
    explanation: "속에 공기가 들어 있어서 물보다 가벼워요.",
  },
  {
    fact: "당근은 원래 주황색이 아니었다",
    isTrue: true,
    explanation: "보라색과 흰색 당근이 먼저 있었어요.",
  },
  {
    fact: "토마토는 채소가 아니라 열매로 분류된다",
    isTrue: true,
    explanation: "꽃이 진 자리에 씨와 함께 자라기 때문이에요.",
  },
  {
    fact: "땅콩은 견과류가 아니라 콩 종류다",
    isTrue: true,
    explanation: "땅속에서 열리는 콩과 식물이에요.",
  },
  {
    fact: "감자에 싹이 나면 그 부분은 먹지 않는 게 좋다",
    isTrue: true,
    explanation: "싹과 초록색 부분에 해로운 성분이 생겨요.",
  },
  {
    fact: "초콜릿은 개에게 위험할 수 있다",
    isTrue: true,
    explanation: "개는 초콜릿 속 성분을 잘 분해하지 못해요.",
  },
  {
    fact: "커피 원두는 열매 속의 씨앗이다",
    isTrue: true,
    explanation: "빨간 커피 열매 안에 든 씨를 볶은 거예요.",
  },
  {
    fact: "탄산음료의 톡 쏘는 거품은 이산화탄소다",
    isTrue: true,
    explanation: "녹아 있던 기체가 빠져나오면서 톡 쏘아요.",
  },
  {
    fact: "찬 음식을 급하게 먹으면 머리가 찡할 수 있다",
    isTrue: true,
    explanation: "입천장이 갑자기 차가워져 생기는 반응이에요.",
  },
  {
    fact: "바나나에서는 아주 약한 방사선이 나온다",
    isTrue: true,
    explanation: "칼륨 성분 때문인데 몸에 해로운 정도는 아니에요.",
  },
  {
    fact: "옥수수수염의 개수는 옥수수 알갱이 개수와 같다",
    isTrue: true,
    explanation: "수염 하나가 알갱이 하나로 이어져요.",
  },
  {
    fact: "한글은 누가 언제 만들었는지 기록이 남아 있는 문자다",
    isTrue: true,
    explanation: "만든 이유와 원리까지 책으로 남아 있어요.",
  },
  {
    fact: "남한에서 가장 긴 강은 낙동강이다",
    isTrue: true,
    explanation: "한강보다 조금 더 길어요.",
  },
  {
    fact: "제주도는 화산 활동으로 만들어진 섬이다",
    isTrue: true,
    explanation: "한라산도 화산이에요.",
  },
  {
    fact: "무궁화 꽃 한 송이는 하루 만에 피었다 진다",
    isTrue: true,
    explanation: "대신 새 꽃이 계속 피어서 오래 피어 있는 것처럼 보여요.",
  },
  {
    fact: "태극기의 네 귀퉁이 무늬는 하늘, 땅, 물, 불을 뜻한다",
    isTrue: true,
    explanation: "건곤감리라고 불러요.",
  },
  {
    fact: "라면 스프를 먼저 넣으면 물이 조금 더 높은 온도에서 끓는다",
    isTrue: true,
    explanation: "소금기가 있으면 끓는 온도가 살짝 올라가요.",
  },
  {
    fact: "김치는 익어 가면서 유산균이 늘어난다",
    isTrue: true,
    explanation: "발효되면서 신맛도 함께 강해져요.",
  },
  {
    fact: "번개는 같은 자리에 여러 번 칠 수 있다",
    isTrue: true,
    explanation: "높은 건물의 피뢰침에는 자주 떨어져요.",
  },
  {
    fact: "문어는 색을 구별하지 못한다고 알려져 있다",
    isTrue: true,
    explanation: "대신 밝기와 무늬를 아주 잘 알아봐요.",
  },
  {
    fact: "어린 해바라기는 낮 동안 해를 따라 고개를 움직인다",
    isTrue: true,
    explanation: "다 자라면 대개 동쪽을 보고 멈춰요.",
  },
  {
    fact: "사람은 하루에 침을 1리터 넘게 만든다",
    isTrue: true,
    explanation: "음식을 부드럽게 하고 입안을 지켜 줘요.",
  },
  {
    fact: "가장 깊은 바다는 마리아나 해구다",
    isTrue: true,
    explanation: "에베레스트산을 넣어도 잠길 만큼 깊어요.",
  },
];
