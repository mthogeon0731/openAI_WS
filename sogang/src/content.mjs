// 일정과 공개 링크는 확인된 내용만 넣습니다. 서강대 콘텐츠는 이 파일에서 관리합니다.
export const site = {
  name: 'OpenAI Student Collective · Sogang',
  description: '서강에서 AI로 배우고, 만들고, 함께 나눕니다. OpenAI Student Collective 서강대학교의 워크숍, Studio Hour, 실습 자료를 만나보세요.',
  url: 'https://sogang-student-collective.mt-hogeon0731.chatgpt.site',
  repository: 'https://github.com/aeron1120/openAI_WS',
  collective: 'https://student-collective.pages.dev/',
};

export const programs = [
  { id: 'workshop', number: '01', label: 'LEARN', title: 'Workshop', subtitle: '한 가지를 배워, 직접 만들어보는 시간.', description: 'AI 도구를 내 과제와 프로젝트에 적용해요. 설명을 듣는 데서 끝내지 않고, 나만의 결과물까지 만들어봅니다.', cadence: '배우고 실습하기', image: 'workshop.webp', alt: '참가자들이 함께 실습하는 OpenAI 프로그램 워크숍', tone: 'purple' },
  { id: 'studio', number: '02', label: 'BUILD', title: 'Studio Hour', subtitle: '혼자 막혔던 아이디어를, 함께 앞으로.', description: '진행 중인 작업과 궁금한 질문을 가져오세요. 서로의 화면을 보며 작은 문제를 풀고 아이디어를 발전시켜요.', cadence: '함께 만들기', image: 'studio.webp', alt: 'OpenAI 프로그램 참가자들의 모임', tone: 'green' },
  { id: 'showcase', number: '03', label: 'SHARE', title: 'Showcase', subtitle: '완성의 크기보다, 시도한 이야기가 중요해요.', description: '직접 만든 결과물과 그 과정에서 배운 점을 나눠요. 서로의 시도에서 다음 프로젝트의 힌트를 찾아봅니다.', cadence: '과정과 결과 나누기', image: 'showcase.webp', alt: '자신의 작업을 소개하는 OpenAI 프로그램 발표자', tone: 'orange' },
];

export const events = [
  { title: 'Workshop 02 · 멀티플레이어 게임 만들기', type: 'WORKSHOP 02', month: 'NOV', day: '02', weekday: '월요일', date: '2026.11.02', start: '2026-11-02T18:00:00+09:00', end: '2026-11-02T19:00:00+09:00', time: '18:00–19:00', place: '정하상관 307호', description: 'AI와 함께 멀티플레이어 게임을 만드는 실습. 충전된 노트북을 챙겨 오세요. 참가자에게 피자가 제공됩니다.', url: 'https://luma.com/2b30v70u', note: '무료 · 신청 후 운영자 승인' },
  { title: 'Workshop 01 · 서강의 첫 워크숍', type: 'WORKSHOP 01', month: 'OCT', day: '14', weekday: '수요일', date: '2026.10.14', start: '2026-10-14T18:00:00+09:00', end: '2026-10-14T19:00:00+09:00', time: '18:00–19:00', place: '정하상관 J 104호', description: '서강대학교 OpenAI Student Collective의 첫 번째 워크숍. 지난 행사 안내를 Luma에서 확인할 수 있어요.', url: 'https://luma.com/l1eignu5', note: '지난 행사' },
];

const base = `${site.repository}/blob/main`;
export const resources = [
  { category: 'build', label: '만들기', title: 'Workshop 02 · Game Lab', description: '이번 워크숍의 게임 제작 실습 공간. 게임 아이디어를 살펴보고 직접 플레이하며 시작해요.', url: 'https://osc-game-making-lab.mt-hogeon0731.chatgpt.site', type: 'SOGANG WORKSHOP', icon: 'spark' },
  { category: 'start', label: '시작하기', title: '처음이라면, 여기서부터', description: '준비부터 첫 실행까지. 처음 참여하는 사람을 위한 순서대로 따라 하는 안내.', url: `${base}/guides/START-HERE.md`, type: 'GUIDE', icon: 'compass' },
  { category: 'build', label: '만들기', title: '내 아이디어의 첫 웹사이트', description: '로그인, 지도, 날씨를 담을 수 있는 기초 틀로 작은 웹사이트를 시작해요.', url: `${site.repository}/tree/main/starter`, type: 'STARTER KIT', icon: 'code' },
  { category: 'help', label: '도움말', title: '막혔을 때 살펴보기', description: '실행이 안 되거나 오류가 날 때, 확인할 내용을 차근차근 찾아봐요.', url: `${base}/guides/TROUBLESHOOTING.md`, type: 'TROUBLESHOOTING', icon: 'life' },
];

export const prompt = '이 저장소의 starter를 바탕으로 서강대학교 학생을 위한 웹사이트를 만들고 싶어. 먼저 README와 AGENTS.md를 읽고 기초 틀을 실행해줘. 내가 만들고 싶은 서비스는 [아이디어]야. 필요한 기능과 화면 구성을 함께 정하고, 가장 작은 첫 버전부터 만들어줘.';

export const faqs = [
  { question: '코딩을 처음 해봐도 참여할 수 있나요?', answer: '처음 시작하는 분도 자료를 따라 실습할 수 있어요. 만들고 싶은 작은 아이디어나 평소 궁금했던 질문 하나를 가져오세요. 행사별 준비물과 참여 조건은 해당 Luma 안내에서 확인해 주세요.' },
  { question: '무엇을 준비하면 좋을까요?', answer: '실습할 노트북과 충전기, 사용 중인 AI 도구 계정을 준비해 주세요. 발표 자료, 설문 데이터, 만들고 싶은 웹사이트처럼 직접 해보고 싶은 작업이 있으면 더욱 좋아요.' },
  { question: 'Workshop과 Studio Hour는 어떻게 다른가요?', answer: 'Workshop에서는 정해진 주제를 배우고 직접 실습해요. Studio Hour에서는 각자의 아이디어와 진행 중인 작업을 가져와 함께 만들고 질문합니다.' },
  { question: '일정과 신청은 어디에서 확인하나요?', answer: '이 페이지의 활동 일정에서 Luma 행사 페이지를 열어 주세요. 신청 가능 여부, 장소 변경과 최신 공지는 각 행사의 Luma 안내를 기준으로 확인해 주세요.' },
];
