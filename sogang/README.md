# OpenAI Student Collective · Sogang

서강대학교 Student Collective의 **1a Glass Console** 사이트입니다. 사용자가 제공한 `Sogang Student Collective.html`의 유리 사이드바, HUD, 교표 워터마크와 글꼴을 바탕으로 실제 서강대 행사 정보에 맞춰 구현했습니다. 외부 프레임워크 없이 HTML·CSS·JavaScript로 동작하며, 기존 `portal/`과 `collective/`는 별도로 유지합니다.

## 화면과 동작

- `#/home`: 워크숍 안내, KST 시계·카운트다운, 월별 달력, 정하상관 지도.
- `#/roadmap`: 학기 활동과 확정/준비 중인 일정.
- `#/workshops/02`: 실제 행사 정보, Luma 신청, Game Lab, Google Calendar·ICS.
- `#/learn`: 실습 자료, 브라우저에 저장되는 미션 체크, 시작 요청문 복사.
- `#/studio`: 일정 준비 중인 Studio Session 소개.
- `#/recap`: 두 워크숍의 행사 안내와 공개 자료. 실제 활동 사진은 아직 게시하지 않습니다.
- `#/about`: 김호건·이성빈 운영진과 Luma 주최자 문의.
- `#/admin`: GitHub 콘텐츠 편집 링크와 API로 읽어오는 실제 커밋 기록.

KO/EN 전환, 뒤로 가기, 모바일 메뉴, 키보드 탐색과 동작 줄이기 설정을 지원합니다. 미션 상태·언어만 브라우저에 저장하며 계정·출석 서버는 없습니다.

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
| `src/content.mjs` | 실제 행사·운영진·Studio 상태·KO/EN 요청문 |
| `src/page.mjs` | 화면 구성과 제목·문구 |
| `src/styles.css` | 색상, 글꼴, 배치, 모바일 화면 |
| `src/main.js` | 라우팅, 번역, 시계, 진도 저장, 복사, GitHub 기록 조회 |
| `src/time.mjs` | 행사 상태·카운트다운·ICS·Google Calendar·지도 주소 |
| `src/render.mjs` | 원본 포털의 안전한 HTML 출력 도우미 |
| `public/assets/` | 원본 교표·배지, 로컬 글꼴, 실습 섬 이미지와 출처 |
| `scripts/build.mjs` | 정적 파일 생성 |
| `scripts/serve.mjs` | 로컬 미리보기 서버 |
| `tests/site.test.mjs` | 링크·자산·문서 구조·안전한 출력·서버 접근 범위 검사 |

확정된 일정은 `src/content.mjs`의 `events`에서 관리합니다. 현재 등록된 행사는 사용자가 제공한 다음 Luma 안내를 기준으로 반영했습니다. 날짜와 시각은 모두 한국 시간(KST)입니다.

| 행사 | 일정·장소 | 원본 안내 |
| --- | --- | --- |
| Workshop 02 · 멀티플레이어 게임 만들기 | 2026년 11월 2일 18:00–19:00 · 정하상관 307호 | https://luma.com/2b30v70u |
| Workshop 01 · 첫 워크숍 | 2026년 10월 14일 18:00–19:00 · 정하상관 J 104호 | https://luma.com/l1eignu5 |

행사 상태는 시작·종료 시각을 기준으로 표시됩니다. `start`·`end`는 시간대가 포함된 ISO 형식으로 입력하세요. 날짜·요일·달력은 `Asia/Seoul` 기준으로 자동 계산되며, 제목은 `topicKo`·`topicEn`, 장소는 `place`·`placeEn`에서 함께 수정합니다. 장소 건물이 바뀌면 `src/time.mjs`의 지도 검색어와 `src/page.mjs`의 지도 iframe도 변경하세요. 신청·변경 공지는 Luma에서 확인하며, 폐기된 인스타그램 계정은 연결하지 않습니다.

## 관리자와 배포 범위

관리자 화면은 GitHub로 이동해 권한 있는 계정이 직접 편집하는 방식입니다. 브라우저에서 OAuth 로그인·커밋·빌드 성공을 흉내 내지 않습니다. GitHub 공개 API로 실제 커밋을 조회하며, 네트워크 또는 API 제한 시 재시도와 GitHub 기록 링크를 제공합니다. 토큰이나 비밀키를 받거나 저장하지 않습니다.

현재 ChatGPT Sites 미리보기는 검토한 버전을 별도로 배포합니다. GitHub 커밋만으로 이 미리보기가 자동 갱신되지는 않습니다. 아래처럼 Cloudflare Pages의 Git 연결을 설정하면 선택한 브랜치의 커밋을 자동 빌드·배포할 수 있습니다. 새 OAuth 앱이나 Cloudflare 프로젝트는 이번 변경에서 생성하지 않았습니다.

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
- 디자인: 사용자가 제공한 `Sogang Student Collective.html` / 1a Glass Console. 원본 교표·Campus Lead 배지·Geist/Geist Mono/Pretendard 글꼴을 추출해 사용했습니다. 원본의 샘플 일정·서울대 링크·가짜 로그인/배포 동작은 실제 정보와 지원하는 동작으로 교체했습니다.
- 미션 이미지: 원본 `portal/public/images/learn-map`의 투명 WebP를 재사용했습니다.
- 달력: 원본 `portal/src/calendar.mjs`의 UTC·텍스트 escape·UTF-8 줄 접기 방식을 적용했습니다.
- 자산 출처와 폰트 라이선스: `public/assets/CREDITS.md`, `public/assets/fonts/`.
- 화면 비교·실행 검증: `design-qa.md`.

모든 신청은 원래 Luma 페이지에서 진행합니다. 이 저장소의 학습 체크는 개인용이며 제출·평가나 인증된 수강 기록이 아닙니다.
