export interface NunchiPrompt {
  id: string;
  prompt: string;
  choices: [string, string, string];
  /** 그 문항에서 최종 결정을 내리는 사람 */
  decider: "child" | "adult" | "together";
}

/**
 * 눈치 올인용 문항.
 * 정답이 없는 게임입니다. 다른 팀과 겹치지 않는 답을 고르는 게 목표라
 * 지식 차이가 없고 어른과 아이가 똑같이 유리합니다.
 */
export const NUNCHI_PROMPTS: NunchiPrompt[] = [
  { id: "n01", prompt: "풀빌라 도착하고 10분 안에 제일 먼저 할 일은?", choices: ["수영복 갈아입기", "방 구경하기", "간식부터 찾기"], decider: "child" },
  { id: "n02", prompt: "갑자기 하루가 통째로 비었다면?", choices: ["집에서 푹 쉬기", "맛집 가기", "훌쩍 떠나기"], decider: "adult" },
  { id: "n03", prompt: "가족 모두가 하루 동안 가질 초능력은?", choices: ["하늘 날기", "순간이동", "시간 멈추기"], decider: "together" },
  { id: "n04", prompt: "치킨 시키면 제일 먼저 없어지는 건?", choices: ["다리", "날개", "무"], decider: "child" },
  { id: "n05", prompt: "여행 갈 때 제일 먼저 챙기는 건?", choices: ["충전기", "약", "간식"], decider: "adult" },
  { id: "n06", prompt: "무인도에 하나만 가져간다면?", choices: ["칼", "라이터", "이불"], decider: "together" },
  { id: "n07", prompt: "학교에서 제일 반가운 소리는?", choices: ["급식 종", "하교 종", "체육 시간"], decider: "child" },
  { id: "n08", prompt: "주말 아침에 제일 하고 싶은 건?", choices: ["더 자기", "산책", "브런치"], decider: "adult" },
  { id: "n09", prompt: "우리 가족을 색으로 표현하면?", choices: ["빨강", "파랑", "노랑"], decider: "together" },
  { id: "n10", prompt: "아이스크림 하나만 고른다면?", choices: ["초코", "딸기", "바닐라"], decider: "child" },
  { id: "n11", prompt: "퇴근길에 제일 반가운 건?", choices: ["빈 자리", "초록불", "택배 도착 알림"], decider: "adult" },
  { id: "n12", prompt: "우리 가족이 동물이 된다면?", choices: ["강아지 가족", "고양이 가족", "펭귄 가족"], decider: "together" },
  { id: "n13", prompt: "여름밤에 제일 어울리는 건?", choices: ["수박", "불꽃놀이", "무서운 이야기"], decider: "child" },
  { id: "n14", prompt: "로또 되면 제일 먼저?", choices: ["집 사기", "여행 가기", "일단 아무 말 안 하기"], decider: "adult" },
  { id: "n15", prompt: "타임머신을 타면?", choices: ["과거로", "미래로", "안 탐"], decider: "together" },
  { id: "n16", prompt: "제일 무서운 건?", choices: ["귀신", "벌레", "주사"], decider: "child" },
  { id: "n17", prompt: "회식에서 제일 곤란한 순간은?", choices: ["노래 시킬 때", "건배사", "2차 가자"], decider: "adult" },
  { id: "n18", prompt: "우리 집 규칙 하나를 없앤다면?", choices: ["잠자는 시간", "게임 시간", "숙제 먼저"], decider: "together" },
  { id: "n19", prompt: "체육대회에서 제일 하고 싶은 종목은?", choices: ["달리기", "줄다리기", "피구"], decider: "child" },
  { id: "n20", prompt: "명절에 제일 듣기 싫은 말은?", choices: ["언제 결혼", "살 좀 빠졌네", "요즘 어때"], decider: "adult" },
  { id: "n21", prompt: "가족 여행지 하나만 고르면?", choices: ["바다", "산", "도시"], decider: "together" },
  { id: "n22", prompt: "간식 하나만 남긴다면?", choices: ["과자", "젤리", "초콜릿"], decider: "child" },
  { id: "n23", prompt: "집안일 중 제일 싫은 건?", choices: ["설거지", "빨래 개기", "화장실 청소"], decider: "adult" },
  { id: "n24", prompt: "우리 가족의 별명을 짓는다면?", choices: ["먹보 가족", "잠꾸러기 가족", "수다 가족"], decider: "together" },
  { id: "n25", prompt: "학교 끝나고 제일 먼저?", choices: ["간식", "게임", "누워 있기"], decider: "child" },
  { id: "n26", prompt: "휴가 마지막 날 기분은?", choices: ["아쉬움", "후련함", "이미 다음 계획 중"], decider: "adult" },
  { id: "n27", prompt: "가족 사진 찍을 때 우리는?", choices: ["다 웃음", "한 명은 눈 감음", "누가 늦게 옴"], decider: "together" },
  { id: "n28", prompt: "물놀이에서 제일 재밌는 건?", choices: ["미끄럼틀", "물총싸움", "튜브 타고 둥둥"], decider: "child" },
  { id: "n29", prompt: "아침에 제일 필요한 건?", choices: ["커피", "5분만 더", "찬물 세수"], decider: "adult" },
  { id: "n30", prompt: "우리 가족의 최고 요리는?", choices: ["김치찌개", "라면", "고기 구이"], decider: "together" },
  { id: "n31", prompt: "소원 하나만 들어준다면?", choices: ["돈", "시간", "건강"], decider: "child" },
  { id: "n32", prompt: "스트레스 풀 때 나는?", choices: ["먹는다", "잔다", "걷는다"], decider: "adult" },
  { id: "n33", prompt: "우리 집에서 제일 오래 쓰는 물건은?", choices: ["리모컨", "냉장고", "이불"], decider: "together" },
  { id: "n34", prompt: "생일에 제일 받고 싶은 건?", choices: ["돈", "장난감", "여행"], decider: "child" },
  { id: "n35", prompt: "다시 태어나면?", choices: ["똑같이", "부자로", "동물로"], decider: "adult" },
  { id: "n36", prompt: "가족 단톡방에서 제일 많이 쓰는 건?", choices: ["이모티콘", "사진", "읽고 무응답"], decider: "together" },
  { id: "n37", prompt: "급식에서 제일 반가운 메뉴는?", choices: ["돈가스", "카레", "떡볶이"], decider: "child" },
  { id: "n38", prompt: "주말에 제일 아까운 건?", choices: ["늦잠 잔 시간", "밀린 집안일", "못 만난 사람"], decider: "adult" },
  { id: "n39", prompt: "우리 가족이 제일 자주 하는 말은?", choices: ["밥 먹자", "빨리빨리", "괜찮아"], decider: "together" },
  { id: "n40", prompt: "제일 갖고 싶은 능력은?", choices: ["공부 잘하기", "운동 잘하기", "말 잘하기"], decider: "child" },
  { id: "n41", prompt: "지갑에 제일 오래 있는 건?", choices: ["영수증", "동전", "안 쓰는 카드"], decider: "adult" },
  { id: "n42", prompt: "우리 가족 여행 스타일은?", choices: ["계획형", "즉흥형", "가서 자기"], decider: "together" },
  { id: "n43", prompt: "학교 가는 길에 제일 먼저 보는 건?", choices: ["시계", "친구", "편의점"], decider: "child" },
  { id: "n44", prompt: "돈이 생기면 제일 먼저?", choices: ["저축", "쇼핑", "맛있는 거"], decider: "adult" },
  { id: "n45", prompt: "우리 집 냉장고에 항상 있는 건?", choices: ["김치", "달걀", "음료"], decider: "together" },
  { id: "n46", prompt: "친구랑 놀 때 제일 재밌는 건?", choices: ["게임", "수다", "먹기"], decider: "child" },
  { id: "n47", prompt: "운전할 때 제일 짜증나는 건?", choices: ["막히는 길", "끼어들기", "주차 자리 없음"], decider: "adult" },
  { id: "n48", prompt: "가족끼리 제일 자주 싸우는 건?", choices: ["채널 선택", "청소", "약속 시간"], decider: "together" },
  { id: "n49", prompt: "체육 시간에 제일 싫은 건?", choices: ["오래달리기", "줄넘기 시험", "뜀틀"], decider: "child" },
  { id: "n50", prompt: "요즘 제일 부족한 건?", choices: ["잠", "돈", "여유"], decider: "adult" },
  { id: "n51", prompt: "우리 가족을 음식으로 표현하면?", choices: ["떡볶이", "김밥", "치킨"], decider: "together" },
  { id: "n52", prompt: "방학 첫날 하고 싶은 건?", choices: ["늦잠", "친구 만나기", "여행"], decider: "child" },
  { id: "n53", prompt: "제일 오래 미룬 일은?", choices: ["운동", "정리", "병원"], decider: "adult" },
  { id: "n54", prompt: "우리 가족 필수 여행 준비물은?", choices: ["간식", "충전기", "베개"], decider: "together" },
  { id: "n55", prompt: "제일 웃긴 소리는?", choices: ["방귀", "코골이", "딸꾹질"], decider: "child" },
  { id: "n56", prompt: "인생에서 제일 중요한 건?", choices: ["가족", "돈", "건강"], decider: "adult" },
  { id: "n57", prompt: "지금 당장 먹고 싶은 건?", choices: ["시원한 것", "매운 것", "달달한 것"], decider: "together" },
  { id: "n58", prompt: "어른이 되면 제일 하고 싶은 건?", choices: ["운전", "밤새 놀기", "돈 벌기"], decider: "child" },
  { id: "n59", prompt: "다시 학생이 된다면?", choices: ["공부 열심히", 	"실컷 놀기", "안 돌아감"], decider: "adult" },
  { id: "n60", prompt: "오늘 게임에서 우리 팀은?", choices: ["1등 할 듯", "중간쯤", "즐기면 됨"], decider: "together" },
];
