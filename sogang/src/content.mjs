// 일정과 공개 링크는 확인된 내용만 넣습니다. 서강대 콘텐츠는 이 파일에서 관리합니다.
export const site = {
  name: 'OpenAI Student Collective · Sogang',
  motto: 'Turn your imagination into reality',
  description: 'OpenAI Student Collective 서강대학교. 워크숍 일정, Studio Session, ChatGPT·Codex 실습 자료를 확인하세요.',
  url: 'https://sogang-student-collective.mt-hogeon0731.chatgpt.site',
  repository: 'https://github.com/aeron1120/openAI_WS',
  collective: 'https://student-collective.pages.dev/',
  sourceRepository: 'https://github.com/mthogeon0731/openAI_WS',
  branch: 'codex/sogang-student-collective',
};

export const organizers = ['김호건', '이성빈'];
export const studio = { status: '일정 준비 중', statusEn: 'Schedule coming soon' };

// topicKo/topicEn은 화면 제목에 쓰이고, 캘린더 title도 topicKo에서 생성됩니다.
// 표시용 날짜·요일·시간은 start/end를 Asia/Seoul로 변환하므로 따로 입력하지 않습니다.
export const events = [
  {
    id: '02',
    topicKo: '멀티플레이어 게임 만들기',
    topicEn: 'Build a multiplayer game',
    start: '2026-11-02T18:00:00+09:00',
    end: '2026-11-02T19:00:00+09:00',
    place: '정하상관 307호',
    placeEn: 'Jeong Hasang Hall 307',
    description: 'AI와 함께 멀티플레이어 게임을 만드는 실습. 충전된 노트북을 챙겨 오세요. 참가자에게 피자가 제공됩니다.',
    url: 'https://luma.com/2b30v70u',
    note: '무료 · 신청 후 운영자 승인',
    noteEn: 'Free · Registration requires host approval',
  },
  {
    id: '01',
    topicKo: '서강의 첫 워크숍',
    topicEn: 'Our first Sogang workshop',
    start: '2026-10-14T18:00:00+09:00',
    end: '2026-10-14T19:00:00+09:00',
    place: '정하상관 J 104호',
    placeEn: 'Jeong Hasang Hall J104',
    description: '서강대학교 OpenAI Student Collective의 첫 번째 워크숍. 지난 행사 안내를 Luma에서 확인할 수 있어요.',
    url: 'https://luma.com/l1eignu5',
    note: '지난 행사',
    noteEn: 'Past event',
  },
].map(event => ({ ...event, title: `Workshop ${event.id} · ${event.topicKo}` }));

export const prompt = '이 저장소의 starter를 바탕으로 서강대학교 학생을 위한 웹사이트를 만들고 싶어. 먼저 README와 AGENTS.md를 읽고 기초 틀을 실행해줘. 내가 만들고 싶은 서비스는 [아이디어]야. 필요한 기능과 화면 구성을 함께 정하고, 가장 작은 첫 버전부터 만들어줘.';

export const promptEn = 'I want to build a website for Sogang University students using the starter in this repository. First, read README and AGENTS.md and run the starter. My service idea is [your idea]. Help me decide on the features and screens, then build the smallest first version.';
