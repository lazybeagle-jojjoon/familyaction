# 풀빌라 가족오락관

초등 3-4학년 아이들과 부모 두세 가족이 풀빌라에서 즐길 수 있는 가족오락관 스타일 진행 웹앱입니다. 라운드는 자유롭게 선택하고, 문제는 라운드 시작마다 Anthropic Claude API로 새로 생성합니다.

## 주요 기능

- 2팀 또는 3팀 대결
- 8개 라운드 중 원하는 것만 골라 진행
- 누적 점수판과 라운드별 재도전
- localStorage 진행 상태 저장
- Anthropic API 키 브라우저 저장
- Claude 호출 실패 시 백업 문제 사용
- Web Audio API 효과음, `canvas-confetti` 축하 효과
- 모바일 우선 UI, 태블릿/노트북 화면 대응

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 표시되는 Vite 로컬 주소로 접속합니다.

## 빌드 확인

```bash
npm run build
```

## Anthropic API 키 받는 법

1. [console.anthropic.com](https://console.anthropic.com/) 에 가입하거나 로그인합니다.
2. 좌측 메뉴에서 **API Keys**를 엽니다.
3. **Create Key**를 눌러 새 키를 만듭니다.
4. 앱의 `/setup` 화면에서 API 키를 입력합니다.

API 키는 배포 서버에 저장되지 않고, 사용 중인 브라우저의 `localStorage`에만 저장됩니다.

## Vercel 배포

1. GitHub 등에 이 프로젝트를 올립니다.
2. Vercel에서 새 프로젝트를 만들고 저장소를 연결합니다.
3. Framework Preset은 Vite로 둡니다.
4. Build Command는 `npm run build`, Output Directory는 `dist`를 사용합니다.
5. 배포 후 `/setup`에서 각 사용자가 본인의 Anthropic API 키를 입력합니다.

React Router 새로고침을 위해 `vercel.json`에 SPA rewrite가 포함되어 있습니다.

## 라운드

- 스피드 퀴즈
- 흐릿한 이미지
- 초성 퀴즈
- 이모지 퀴즈
- 거짓말 탐지기
- 고요 속의 외침
- 몸으로 말해요
- 수영장 보물찾기

## 이미지 자산

`public/blur-items`의 배경 없는 3D PNG 자산은 Microsoft Fluent Emoji를 사용합니다.

- Source: https://github.com/microsoft/fluentui-emoji
- License: MIT
