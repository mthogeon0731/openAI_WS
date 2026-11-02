# 서강대 Student Collective 디자인 검증

final result: passed

## 기준과 비교

- 기준: 사용자가 제공한 `서강대 학생 collective UI.zip`의 `export/sogang-student-collective/index.html`.
- 구현: `src/page.mjs`, `src/styles.css`, `src/main.js`를 빌드한 사이트.
- 데스크톱: Chrome CSS viewport 1440 × 1000, 한국어 홈, 밝은 테마, 스크롤 맨 위. 양쪽 전체 캡처 폭 1424px에서 동일한 1424 × 1000 영역을 자르고 나란히 놓았습니다. 이미지 확대·축소 없음.
- [나란히 비교](docs/qa/editorial/comparison-desktop.jpg): 왼쪽 ZIP 원본, 오른쪽 구현.
- [최종 홈](docs/qa/editorial/home-desktop.jpg), [학습 자료](docs/qa/editorial/learn-desktop.jpg), [운영진](docs/qa/editorial/about-desktop.jpg).
- 모바일: 375 × 812. [한국어](docs/qa/editorial/home-mobile.jpg), [영어](docs/qa/editorial/home-mobile-en.jpg), [메뉴](docs/qa/editorial/mobile-menu.jpg).

## 시각 검토

| 항목 | 결과 |
| --- | --- |
| 글꼴 | 원본의 Wanted Sans Variable, Noto Serif KR 700, Material Symbols Rounded를 로컬 폰트로 제공. |
| 배치 | 268px 크림 사이드바, 최대 1160px 본문, 큰 서강 배너, 모토와 두 개의 버튼, 4색 요약 카드, 행사·달력·장소 패널 유지. |
| 색상 | 흰 본문, #F7F6F3 사이드바, 원본 빨간 배너 그라데이션, 살구·민트·라일락 카드, 검정 버튼 유지. |
| 이미지 | ZIP에 포함된 교표·흰 교표 워터마크·Campus Lead 배지를 그대로 사용. 학습 카드는 단색 영역과 아이콘으로 정리. |
| 모토 | `Turn your imagination into reality`를 홈·운영 소개·푸터에 사용. 한국어에서도 영어로 유지. |
| 모바일 | 980px 미만에서 서랍 메뉴. 375px에서 모토 두 줄과 요약 카드 두 열, 나머지 패널 한 열. |

원본의 김대건관 304호·OOO 운영진·Studio 19:00·미확정 WS3/4는 사용하지 않았습니다. 실제 정하상관 행사 정보, 김호건·이성빈, Studio 준비 중을 반영했습니다. 문구와 메뉴 수의 차이는 사용자 요청 및 확인된 정보에 따른 변경입니다.

## 수정 후 확인

- 배너 워터마크를 배너 내부에 배치해 보이도록 하고 장식이 화면 밖으로 넘치지 않도록 처리.
- 워크숍 단계 행, Studio 안내, 푸터를 실제 HTML 구조에 맞게 정렬.
- 영문 장소명이 요약 카드를 과도하게 높이던 부분을 호실과 건물 안내로 나눔. 값은 행사 장소 문자열에서 생성.
- 운영진 이름을 소개 문장에 중복 입력하지 않고 `organizers`에서 표시.
- 원본과 나란히 비교하고 별도 시각 검토를 완료. 남은 P0/P1/P2 시각 문제 없음.

## 기능 검증

- 최종 자동 검사 **11/11 통과** 및 빌드 성공.
- KO/EN 모토 고정, 8개 경로, 실제 링크·폰트·이미지, 행사 시작/종료 경계, ICS UTC 변환·한글 줄 접기, HTML escape, 서버 MIME·경로 제한 확인.
- 데스크톱 1440px 및 모바일 375px의 8개 경로에서 가로 넘침·깨진 이미지 없음.
- KO/EN 전환 후에도 모토 원문 유지. KST 날짜·상태·남은 시간 및 확정 워크숍 기준 진행률 확인.
- 모바일 메뉴 선택 후 닫힘, 닫기 버튼과 토글 버튼으로 포커스 복귀 확인.
- 미션 체크 후 새로고침 시 `1 / 3` 유지, 요청문 복사 성공 알림 확인.
- 관리자에서 GitHub API의 실제 커밋 이력 2개 조회 확인(검증 시점 최신 `e168f20`).
- 지도 화면에서 실제 **서강대학교 정하상관** 표식 확인. 지연 로딩 때문에 스크롤하지 않은 전체 캡처에는 빈 영역으로 보일 수 있으며, 네이버·카카오·Google 지도 링크도 제공.
- 브라우저 오류·경고 로그 없음. `git diff --check` 통과.

## 범위

학습 체크는 이 브라우저에만 저장됩니다. GitHub 편집 링크와 실제 이력 조회를 제공하며 사이트 내부 OAuth·직접 커밋·자동 배포는 구현하지 않습니다. Studio/Showcase 일정과 실제 활동 사진은 확정 후 추가합니다. 지도는 현재 행사 건물인 정하상관에 맞춰져 있고 건물 변경 시 지도 설정도 변경해야 합니다(README 안내). Chrome에서 검증했으며 Safari·Firefox 실기 검증은 하지 않았습니다.
