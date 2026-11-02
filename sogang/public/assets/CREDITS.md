# 자산 출처

현재 화면은 새 디자인 ZIP의 교표·흰색 교표 마크·Campus Lead 배지와 `editorial-fonts.css`를 사용합니다. 수업 미션은 Material Symbols 아이콘으로 표시합니다.

이전 디자인 자산도 저장소에 남아 있어 아래에 출처를 보존합니다. 이전 사진·브랜드 이미지·미션 섬 이미지와 `fonts.css`는 현재 화면에서 불러오지 않습니다.

## 현재 디자인 ZIP 제공 자산

새로 제공된 `sogang-student-collective` 디자인 ZIP의 아래 최적화 이미지는 재가공하지 않고 그대로 복사했습니다. 교표·흰색 교표 마크·Campus Lead 배지의 원본 내용과 투명 배경을 유지합니다.

| 웹 파일 | 원본 위치 | 크기 |
| --- | --- | --- |
| `sogang-seal-256.png` | ZIP `export/sogang-student-collective/assets/sogang-seal-256.png` | 256 × 256 |
| `sogang-seal-mark-720.png` | ZIP `export/sogang-student-collective/assets/sogang-seal-mark-720.png` | 720 × 720 |
| `campus-lead-badge-640.webp` | ZIP `export/sogang-student-collective/assets/campus-lead-badge-640.webp` | 640 × 640 |

### 현재 디자인 글꼴

`editorial-fonts.css`는 ZIP의 `index.html`에 명시된 세 스타일시트를 그대로 기준으로 합니다. 글꼴 바이너리는 변경하지 않고 `fonts-editorial/`에 저장했으며 CSS의 파일 주소만 로컬 경로로 바꿨습니다. 원래의 글꼴 이름·굵기·가변 축·`unicode-range`를 유지합니다. 한국어 서브셋은 브라우저가 필요한 문자 범위만 요청합니다. 정확한 원본 스타일시트 주소, 로컬 파일 목록, 바이트 크기와 SHA-256은 `fonts-editorial/sources.json`에 기록했습니다.

- Noto Serif KR 700: Google Fonts의 원본 CSS 및 WOFF2 서브셋 124개. [Google Fonts 배포 라이선스](https://github.com/google/fonts/blob/main/ofl/notoserifkr/OFL.txt), SIL Open Font License 1.1. 사본: `fonts-editorial/OFL-Noto-Serif-KR.txt`.
- Wanted Sans Variable v1.0.1: 디자인에서 지정한 jsDelivr split CSS 및 WOFF2 서브셋 92개. [Wanted Sans 원본 라이선스](https://github.com/wanteddev/wanted-sans/blob/v1.0.1/LICENSE), SIL Open Font License 1.1. 사본: `fonts-editorial/OFL-Wanted-Sans.txt`.
- Material Symbols Rounded: 디자인의 `icon_names` 목록으로 제한된 Google Fonts 가변 글꼴 1개. [Material Design Icons 라이선스](https://github.com/google/material-design-icons/blob/master/LICENSE), Apache License 2.0. 사본: `fonts-editorial/LICENSE-Material-Symbols.txt`.

## 이전 사진·브랜드 자산

이전 화면에 사용한 사진은 사용자가 보유한 `05_Collective_서강소개/사진/` 자료를 웹용 WebP로 축소·압축한 것입니다. 원본의 구도와 내용은 변경하지 않았습니다.

| 웹 파일 | 사용자 제공 원본 | 기존 제작 기록의 출처 |
| --- | --- | --- |
| `campus.webp` | `05_서강대학교_캠퍼스.png` | 서강대학교 홈페이지 |
| `workshop.webp` | `01_Workshop.png` | OpenAI 홈페이지 |
| `studio.webp` | `02_Studio_Hour.png` | OpenAI 홈페이지 |
| `showcase.webp` | `04_Showcase.png` | OpenAI 홈페이지 |
| `sc-mark.webp` | 저장소 `portal/public/images/brand/logo.jpg` | 기존 Student Collective 포털 브랜드 이미지 |
| `favicon.png` | 저장소 `portal/public/images/brand/icon-64.png` | 기존 Student Collective 포털 아이콘 |

사진 출처는 사용자 자료의 `05_Collective_서강소개/제작자료/02_사진추가/changes.json`을 따릅니다. 해당 기록에는 원본 웹페이지의 상세 URL이 없어 임의의 상세 주소를 덧붙이지 않았습니다.

캠퍼스 사진 이외의 활동 이미지는 OpenAI 프로그램 소개용 참고 사진입니다. 서강대학교에서 촬영된 행사·참여자 사진이나 서강대학교의 실제 활동 기록으로 설명하지 않습니다.

브랜드 이미지의 원본 저장소: https://github.com/aeron1120/openAI_WS

## 이전 Glass Console 목업 제공 자산

사용자가 제공한 `Sogang Student Collective.html` 단일 파일의 `__bundler/manifest`에서 아래 자산을 추출했습니다. 실행 코드 없이 이미지와 글꼴 데이터만 사용했습니다.

| 웹 파일 | 목업 자산 식별자 | 처리 |
| --- | --- | --- |
| `sogang-emblem.png` | `8c573c49-2172-47af-a2bb-ea61e8c4b879` | 원본 861 × 861, 투명 배경과 이미지 내용 유지, PNG 무손실 최적화 |
| `campus-lead.webp` | `3ecf9275-fee8-42c8-b0d3-bb7210cea6f6` | 원본 4960 × 4960을 768 × 768 WebP로 축소, 투명 배경과 배지 내용 유지 |
| `missions/island-01.webp` | 저장소 `portal/public/images/learn-map/island-01.webp` | 기존 수업 자료의 이미지를 그대로 복사 |
| `missions/island-02.webp` | 저장소 `portal/public/images/learn-map/island-02.webp` | 기존 수업 자료의 이미지를 그대로 복사 |
| `missions/island-review.webp` | 저장소 `portal/public/images/learn-map/island-review.webp` | 기존 수업 자료의 이미지를 그대로 복사 |

### 이전 디자인 글꼴

`fonts.css`와 `fonts/*.woff2`는 같은 목업에 포함된 Geist, Geist Mono, Pretendard Variable 글꼴을 로컬에서 제공합니다. Geist/Geist Mono는 Latin 및 Latin Extended 범위를, Pretendard는 원래의 한국어 서브셋 92개와 `unicode-range`를 보존했습니다. 동일 자산은 하나의 파일로 공유하며 글꼴 바이너리는 수정하지 않았습니다. 브라우저는 화면에 필요한 문자 범위만 요청합니다.

- Geist 및 Geist Mono: [Vercel Geist](https://github.com/vercel/geist-font), SIL Open Font License 1.1. 라이선스: `fonts/OFL-Geist.txt`.
- Pretendard Variable: [Pretendard](https://github.com/orioncactus/pretendard), SIL Open Font License 1.1. 라이선스: `fonts/OFL-Pretendard.txt`.
