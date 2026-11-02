# OpenAI Student Collective · Sogang

서강대학교 프로그램 소개, 활동 안내, 실습 자료, 참여 방법을 모은 정적 웹사이트입니다. 기존 `portal/`과 `collective/`를 참고해 만든 독립 폴더이므로 이 사이트를 빌드해도 서울대 포털과 통합 사이트는 바뀌지 않습니다.

## 실행하기

Node.js 20 이상에서 이 폴더를 열고 실행하세요. 외부 패키지가 없어 `npm install`은 필요하지 않습니다. PowerShell에서 실행 정책 오류가 나면 `npm` 대신 `npm.cmd`를 사용하세요.

```sh
npm run dev
```

브라우저에서 **http://localhost:5176/** 를 여세요. 콘텐츠나 소스를 수정했으면 서버를 종료하고 다시 실행합니다.

```sh
npm test
npm run build
```

빌드 결과는 `dist/`에 생성됩니다. 미리보기 서버는 내 컴퓨터의 루프백 주소에서만 열립니다.

## 수정할 곳

| 파일 | 역할 |
| --- | --- |
| `src/content.mjs` | 서강대 정보, 프로그램, 자료 링크, 자주 묻는 질문 |
| `src/page.mjs` | 화면 구성과 제목·문구 |
| `src/styles.css` | 색상, 글꼴, 배치, 모바일 화면 |
| `src/main.js` | 모바일 메뉴, 자료 필터, 요청문 복사 등 화면 동작 |
| `src/render.mjs` | 원본 포털의 안전한 HTML 출력 도우미 |
| `public/assets/` | 사진·로고 등 공개 이미지 |
| `scripts/build.mjs` | 정적 파일 생성 |
| `scripts/serve.mjs` | 로컬 미리보기 서버 |
| `tests/site.test.mjs` | 링크·자산·문서 구조·안전한 출력·서버 접근 범위 검사 |

확정된 일정은 `src/content.mjs`의 `events`에서 관리합니다. 현재 등록된 행사는 사용자가 제공한 다음 Luma 안내를 기준으로 반영했습니다. 날짜와 시각은 모두 한국 시간(KST)입니다.

| 행사 | 일정·장소 | 원본 안내 |
| --- | --- | --- |
| Workshop 02 · 멀티플레이어 게임 만들기 | 2026년 11월 2일 18:00–19:00 · 정하상관 307호 | https://luma.com/2b30v70u |
| Workshop 01 · 첫 워크숍 | 2026년 10월 14일 18:00–19:00 · 정하상관 J 104호 | https://luma.com/l1eignu5 |

행사 상태는 시작·종료 시각을 기준으로 표시됩니다. 새 일정을 추가할 때는 시간대가 포함된 `start`·`end`와 화면에 보이는 날짜·시간·요일도 함께 맞추세요. 미확정 일정은 추측해서 등록하지 않고, 신청·변경 공지는 Luma에서 확인하도록 안내합니다. 이전 인스타그램 계정은 연결하지 않습니다. 신청을 받는 별도 서버는 포함하지 않습니다.

## Cloudflare Pages에 연결하기

이 GitHub 저장소를 **새 Pages 프로젝트**에 연결하고 다음처럼 설정하세요.

- Root directory: `sogang`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 20 이상

`wrangler.jsonc`의 프로젝트 이름은 `sogang-student-collective`입니다. 기존 서울대·통합 사이트의 프로젝트 설정은 변경하지 마세요. 배포 후 사용할 도메인이 정해지면 공유 메타데이터의 기준 주소도 함께 확인하세요.

## 재사용 출처와 범위

- 원본 저장소: https://github.com/aeron1120/openAI_WS
- `src/render.mjs`: 원본 `portal/src/render.mjs`의 HTML escape, 템플릿 및 링크·요청문 도우미를 재사용합니다.
- 요청문 복사: `portal/src/main.js`의 클립보드 복사와 실패 안내 패턴을 적용했습니다.
- 모바일 메뉴: `collective/public/assets/site.js`의 선택·Escape 닫기 동작을 적용했습니다.
- 기준 코드: `253318ed262788076faff65bff8425152d16fc6a`.
- Workshop 02 실습: 이전 제작물인 https://osc-game-making-lab.mt-hogeon0731.chatgpt.site (공개 상태 확인).
- 구성 참고: https://student-collective.pages.dev/ · https://snu-student-collective.pages.dev/
- 이미지: 기존 작업 폴더의 서강대 소개 자료에서 가져왔으며, 개별 이미지 출처는 페이지와 자산 설명을 기준으로 확인하세요.

이 버전은 공개 안내 페이지입니다. 서울대 전용 Google 로그인, 진도 저장, 질문 서버, 운영진 계정은 연결하지 않습니다. 서강대 학습실이 필요할 때는 별도 인증 도메인과 서버를 구성해야 합니다.
