# 이미지 출처

이 사이트의 사진은 사용자가 보유한 `05_Collective_서강소개/사진/` 자료를 웹용 WebP로 축소·압축한 것입니다. 원본의 구도와 내용은 변경하지 않았습니다.

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

## Glass Console 목업 제공 자산

사용자가 제공한 `Sogang Student Collective.html` 단일 파일의 `__bundler/manifest`에서 아래 자산을 추출했습니다. 실행 코드 없이 이미지와 글꼴 데이터만 사용했습니다.

| 웹 파일 | 목업 자산 식별자 | 처리 |
| --- | --- | --- |
| `sogang-emblem.png` | `8c573c49-2172-47af-a2bb-ea61e8c4b879` | 원본 861 × 861, 투명 배경과 이미지 내용 유지, PNG 무손실 최적화 |
| `campus-lead.webp` | `3ecf9275-fee8-42c8-b0d3-bb7210cea6f6` | 원본 4960 × 4960을 768 × 768 WebP로 축소, 투명 배경과 배지 내용 유지 |
| `missions/island-01.webp` | 저장소 `portal/public/images/learn-map/island-01.webp` | 기존 수업 자료의 이미지를 그대로 복사 |
| `missions/island-02.webp` | 저장소 `portal/public/images/learn-map/island-02.webp` | 기존 수업 자료의 이미지를 그대로 복사 |
| `missions/island-review.webp` | 저장소 `portal/public/images/learn-map/island-review.webp` | 기존 수업 자료의 이미지를 그대로 복사 |

### 글꼴

`fonts.css`와 `fonts/*.woff2`는 같은 목업에 포함된 Geist, Geist Mono, Pretendard Variable 글꼴을 로컬에서 제공합니다. Geist/Geist Mono는 Latin 및 Latin Extended 범위를, Pretendard는 원래의 한국어 서브셋 92개와 `unicode-range`를 보존했습니다. 동일 자산은 하나의 파일로 공유하며 글꼴 바이너리는 수정하지 않았습니다. 브라우저는 화면에 필요한 문자 범위만 요청합니다.

- Geist 및 Geist Mono: [Vercel Geist](https://github.com/vercel/geist-font), SIL Open Font License 1.1. 라이선스: `fonts/OFL-Geist.txt`.
- Pretendard Variable: [Pretendard](https://github.com/orioncactus/pretendard), SIL Open Font License 1.1. 라이선스: `fonts/OFL-Pretendard.txt`.
