export interface BlurImageAsset {
  id: string;
  name: string;
  image: string;
  category: "음식" | "동물" | "물건" | "놀이";
  aliases?: string[];
}

export const BLUR_IMAGE_ITEMS: BlurImageAsset[] = [
  { id: "green-apple", name: "초록 사과", image: "/blur-items/green-apple.png", category: "음식", aliases: ["사과"] },
  { id: "red-apple", name: "빨간 사과", image: "/blur-items/red-apple.png", category: "음식", aliases: ["사과"] },
  { id: "banana", name: "바나나", image: "/blur-items/banana.png", category: "음식" },
  { id: "strawberry", name: "딸기", image: "/blur-items/strawberry.png", category: "음식" },
  { id: "watermelon", name: "수박", image: "/blur-items/watermelon.png", category: "음식" },
  { id: "grapes", name: "포도", image: "/blur-items/grapes.png", category: "음식" },
  { id: "lemon", name: "레몬", image: "/blur-items/lemon.png", category: "음식" },
  { id: "peach", name: "복숭아", image: "/blur-items/peach.png", category: "음식" },
  { id: "carrot", name: "당근", image: "/blur-items/carrot.png", category: "음식" },
  { id: "broccoli", name: "브로콜리", image: "/blur-items/broccoli.png", category: "음식" },
  { id: "pizza", name: "피자", image: "/blur-items/pizza.png", category: "음식" },
  { id: "hamburger", name: "햄버거", image: "/blur-items/hamburger.png", category: "음식" },
  { id: "hot-dog", name: "핫도그", image: "/blur-items/hot-dog.png", category: "음식" },
  { id: "taco", name: "타코", image: "/blur-items/taco.png", category: "음식" },
  { id: "french-fries", name: "감자튀김", image: "/blur-items/french-fries.png", category: "음식" },
  { id: "popcorn", name: "팝콘", image: "/blur-items/popcorn.png", category: "음식" },
  { id: "cookie", name: "쿠키", image: "/blur-items/cookie.png", category: "음식" },
  { id: "doughnut", name: "도넛", image: "/blur-items/doughnut.png", category: "음식", aliases: ["도너츠"] },
  { id: "lollipop", name: "막대사탕", image: "/blur-items/lollipop.png", category: "음식", aliases: ["사탕"] },
  { id: "candy", name: "사탕", image: "/blur-items/candy.png", category: "음식" },
  { id: "chocolate-bar", name: "초콜릿", image: "/blur-items/chocolate-bar.png", category: "음식" },
  { id: "ice-cream", name: "아이스크림", image: "/blur-items/ice-cream.png", category: "음식" },
  { id: "dog-face", name: "강아지", image: "/blur-items/dog-face.png", category: "동물", aliases: ["개"] },
  { id: "cat-face", name: "고양이", image: "/blur-items/cat-face.png", category: "동물" },
  { id: "hamster", name: "햄스터", image: "/blur-items/hamster.png", category: "동물" },
  { id: "rabbit", name: "토끼", image: "/blur-items/rabbit.png", category: "동물" },
  { id: "bear", name: "곰", image: "/blur-items/bear.png", category: "동물" },
  { id: "panda", name: "판다", image: "/blur-items/panda.png", category: "동물" },
  { id: "koala", name: "코알라", image: "/blur-items/koala.png", category: "동물" },
  { id: "lion", name: "사자", image: "/blur-items/lion.png", category: "동물" },
  { id: "tiger-face", name: "호랑이", image: "/blur-items/tiger-face.png", category: "동물" },
  { id: "unicorn", name: "유니콘", image: "/blur-items/unicorn.png", category: "동물" },
  { id: "elephant", name: "코끼리", image: "/blur-items/elephant.png", category: "동물" },
  { id: "turtle", name: "거북이", image: "/blur-items/turtle.png", category: "동물" },
  { id: "octopus", name: "문어", image: "/blur-items/octopus.png", category: "동물" },
  { id: "butterfly", name: "나비", image: "/blur-items/butterfly.png", category: "동물" },
  { id: "soccer-ball", name: "축구공", image: "/blur-items/soccer-ball.png", category: "놀이" },
  { id: "basketball", name: "농구공", image: "/blur-items/basketball.png", category: "놀이" },
  { id: "baseball", name: "야구공", image: "/blur-items/baseball.png", category: "놀이" },
  { id: "tennis", name: "테니스공", image: "/blur-items/tennis.png", category: "놀이" },
  { id: "camera", name: "카메라", image: "/blur-items/camera.png", category: "물건" },
  { id: "robot", name: "로봇", image: "/blur-items/robot.png", category: "물건" },
  { id: "laptop", name: "노트북", image: "/blur-items/laptop.png", category: "물건" },
  { id: "mobile-phone", name: "휴대폰", image: "/blur-items/mobile-phone.png", category: "물건", aliases: ["스마트폰"] },
  { id: "guitar", name: "기타", image: "/blur-items/guitar.png", category: "물건" },
  { id: "balloon", name: "풍선", image: "/blur-items/balloon.png", category: "놀이" },
  { id: "teddy-bear", name: "곰인형", image: "/blur-items/teddy-bear.png", category: "물건", aliases: ["인형"] },
  { id: "rocket", name: "로켓", image: "/blur-items/rocket.png", category: "물건" },
  { id: "crown", name: "왕관", image: "/blur-items/crown.png", category: "물건" },
  { id: "wrapped-gift", name: "선물상자", image: "/blur-items/wrapped-gift.png", category: "물건", aliases: ["선물"] },
];

export const blurImageCandidateText = BLUR_IMAGE_ITEMS.map(
  (item) => `${item.name}(${item.category})`,
).join(", ");
