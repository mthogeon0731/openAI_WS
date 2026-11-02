import { h, raw } from './render.mjs';
import { site, events, organizers, studio, prompt, promptEn } from './content.mjs';
import { googleCalendarUrl, mapLinks } from './time.mjs';

const workshop = events.find(event => event.id === '02');
const first = events.find(event => event.id === '01');
const maps = mapLinks();
const formatDate = (value, locale, options) => new Intl.DateTimeFormat(locale, {
  timeZone: 'Asia/Seoul', ...options,
}).format(new Date(value));

function eventDate(event) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(event.start)).map(part => [part.type, part.value]));
  const time = value => formatDate(value, 'en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return {
    year: parts.year, month: parts.month, day: parts.day,
    short: `${parts.month}/${parts.day}`,
    numeric: `${parts.year}.${parts.month}.${parts.day}`,
    monthShort: formatDate(event.start, 'en', { month: 'short' }).toUpperCase(),
    monthLong: formatDate(event.start, 'en', { month: 'long' }).toUpperCase(),
    weekdayKo: formatDate(event.start, 'ko', { weekday: 'short' }),
    weekdayEn: formatDate(event.start, 'en', { weekday: 'short' }),
    longKo: formatDate(event.start, 'ko', { year: 'numeric', month: 'long', day: 'numeric' }),
    longEn: formatDate(event.start, 'en', { year: 'numeric', month: 'long', day: 'numeric' }),
    startTime: time(event.start),
    time: `${time(event.start)}–${time(event.end)}`,
  };
}
const t = (ko, en) => h`<span data-ko="${ko}" data-en="${en}">${ko}</span>`;
const route = (to, label, cls = '') => h`<a href="#/${to}" data-route="${to}" class="${cls}">${label}</a>`;
const external = (url, label, cls = 'button') => h`<a href="${url}" target="_blank" rel="noopener noreferrer" class="${cls}">${label}<span aria-hidden="true">↗</span></a>`;
const state = id => h`<span class="event-state" data-event-state="${id}">${t('일정 확인', 'Event details')}</span>`;
const apply = (cls = 'button primary') => h`<a href="${workshop.url}" target="_blank" rel="noopener noreferrer" class="${cls}"><span data-event-cta="${workshop.id}">${t('Luma 행사 안내', 'Event on Luma')}</span><span aria-hidden="true">↗</span></a>`;
const label = text => h`<span class="eyebrow mono">${text}</span>`;
const head = (tag, ko, en, descKo, descEn) => h`<header class="page-heading">${label(tag)}<h1 tabindex="-1">${t(ko,en)}</h1><p>${t(descKo,descEn)}</p></header>`;
const page = (id, ko, en, body) => h`<section class="page ${id === 'home' ? 'home-page' : 'inner-page'}" id="page-${id.replaceAll('/','-')}" data-page="${id}" data-title-ko="${ko}" data-title-en="${en}" ${id !== 'home' ? raw('hidden') : ''}>${body}</section>`;
const mapButtons = () => h`<div class="map-links">${external(maps.naver,t('네이버 지도','Naver Maps'),'button small')}${external(maps.kakao,t('카카오맵','Kakao Maps'),'button small')}${external(maps.google,t('Google 지도','Google Maps'),'button small')}</div>`;
const calendarButtons = () => h`<div class="calendar-actions">${external(googleCalendarUrl(workshop),t('Google 캘린더','Google Calendar'),'button compact')}<a class="button compact" href="/assets/workshop-${workshop.id}.ics" download="sogang-workshop-${workshop.id}.ics">${t('아이폰·아웃룩','Apple · Outlook')}<span class="mono muted">.ics</span></a></div>`;

function sidebar() {
  const date = eventDate(workshop);
  const firstDate = eventDate(first);
  const item = (path, ko, en, meta = '', marker = '') => route(path,h`<span class="nav-marker" aria-hidden="true">${marker}</span>${t(ko,en)}<small class="mono">${meta}</small>`,'nav-item');
  return h`<button class="menu-backdrop" id="menu-backdrop" aria-label="메뉴 닫기" hidden></button><aside class="sidebar glass" id="sidebar">
    ${route('home',h`<img src="/assets/sogang-emblem.png" width="40" height="40" alt="서강대학교 교표"><span><b>Student Collective</b><small class="mono">OPENAI · SOGANG</small></span>`,'brand')}
    <nav aria-label="사이트 메뉴"><div class="nav-group">${label(t('메뉴','EXPLORE'))}${item('home','홈','Home')}${item('learn','수업 듣기','Learning room',t('학습실','LEARN'))}</div>
    <div class="nav-group">${label(t('학기 과정','SEMESTER'))}<a class="nav-item" href="${first.url}" target="_blank" rel="noopener noreferrer"><span class="nav-marker">▪</span><span>Workshop 1</span><small class="mono">${firstDate.short} ↗</small></a>${item('workshops/02','Workshop 2','Workshop 2',`${date.short} ${date.startTime}`,'●')}${item('studio','Studio Session','Studio Session',t('준비 중','TBA'),'○')}${item('roadmap','Showcase','Showcase',t('준비 중','TBA'),'▫')}</div>
    <div class="nav-group">${label(t('활동 기록','ACTIVITY'))}${item('recap','Recap','Recap')}</div>
    <div class="nav-group">${label(t('안내','INFORMATION'))}${item('roadmap','학기 로드맵','Semester roadmap')}${item('about','운영·협력','People & partners')}${item('admin','관리자','Administration')}</div></nav>
    <div class="sidebar-bottom"><div class="language-switch" role="group" aria-label="언어 / Language"><button type="button" data-lang="ko" aria-pressed="true">KO</button><button type="button" data-lang="en" aria-pressed="false">EN</button></div><span class="mono coordinates">SOGANG UNIVERSITY<br>SINSU-DONG, MAPO-GU</span></div>
  </aside>`;
}

function monthlyCalendar(event) {
  const date = eventDate(event);
  const year = Number(date.year);
  const month = Number(date.month);
  const offset = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = Math.ceil((offset + days) / 7) * 7;
  return h`<section class="calendar glass" aria-label="${year}년 ${month}월 행사 달력"><div class="section-meta"><strong class="mono">${date.year}.${date.month}</strong><span class="mono">${date.monthLong}</span></div><div class="calendar-grid">${[['일','SUN'],['월','MON'],['화','TUE'],['수','WED'],['목','THU'],['금','FRI'],['토','SAT']].map(([ko,en])=>h`<span class="weekday">${t(ko,en)}</span>`)}${Array.from({length:cells},(_,i)=>{
    const day = i - offset + 1;
    if (day < 1 || day > days) return h`<span></span>`;
    if (day === Number(date.day)) return route('workshops/02',h`<span aria-label="${month}월 ${day}일 ${event.title}">${day}</span>`,'calendar-event mono');
    return h`<span class="calendar-day mono ${i%7===0?'sunday':''}">${day}</span>`;
  })}</div><div class="calendar-legend"><span><i></i><span class="mono">${date.short} · ${date.startTime}</span> Workshop ${Number(event.id)}</span><span class="muted">${t(`Studio Session · ${studio.status}`,`Studio Session · ${studio.statusEn}`)}</span></div></section>`;
}

function home() {
  const date = eventDate(workshop);
  const firstDate = eventDate(first);
  const rail = [
    ['recap',`WS ${first.id} · ${firstDate.short}`,first.topicKo,first.topicEn,t('지난 행사','Past event'),'complete'],
    ['workshops/02',`WS ${workshop.id} · ${date.short}`,workshop.topicKo,workshop.topicEn,state(workshop.id),'current'],
    ['studio','STUDIO','함께 만들고, 질문하기','Build and ask together',t(studio.status,studio.statusEn),''],
    ['roadmap','SHOWCASE','과정과 결과 나누기','Share what you made',t('일정 준비 중','Schedule coming soon'),''],
  ];
  return h`<section class="hero"><div class="watermark" aria-hidden="true"><img src="/assets/sogang-emblem.png" width="861" height="861" alt=""><svg viewBox="0 0 440 440"><circle cx="220" cy="220" r="218" fill="none" stroke="rgba(20,19,20,.2)" stroke-width="1" stroke-dasharray="2 9"/><circle cx="220" cy="220" r="194" fill="none" stroke="rgba(20,19,20,.07)" stroke-width="1"/><circle cx="220" cy="2" r="3.5" fill="#B60005"/></svg></div>
    <p class="hero-kicker mono"><span></span>SOGANG CAMPUS LEADS · ${t('2026년 2학기','FALL 2026')}</p>
    <h1 tabindex="-1">${t('아이디어를 직접 구현하고,','Bring your ideas to life,')}<br>${t('사람들에게 공유해요','and share what you make')}<span class="red">.</span></h1>
    <div class="hero-bottom"><div class="hero-copy"><p>${t('ChatGPT·Codex로 배우고, 서강에서 함께 만들어요.','Learn with ChatGPT and Codex. Build together at Sogang.')}</p><div class="actions">${route('workshops/02',h`${t('Workshop 2 만나보기','Explore Workshop 2')} <span aria-hidden="true">↗</span>`,'button primary large')}${route('roadmap',t('학기 과정 한눈에 보기','Explore the semester'),'button large')}</div></div>
    <dl class="spec glass"><div class="spec-heading mono"><span>PROGRAM SPEC</span><span>2026.2</span></div>${[['PROGRAM','OpenAI Student Collective'],['CAMPUS',t('서강대학교','Sogang University')],['FORMAT','Workshop · Studio · Showcase'],['MOTTO',t('Obedire Veritati · 진리에 순종하라','Obedire Veritati')]].map(([key,value])=>h`<div><dt class="mono">${key}</dt><dd>${value}</dd></div>`)}</dl></div>
  </section>
  <section class="flight"><div class="section-meta mono"><span>SEMESTER FLIGHT PATH</span><span>LEARN → BUILD → SHARE</span></div><div class="flight-rail">${rail.map(([path,kicker,ko,en,status,cls])=>route(path,h`<span class="mono">${kicker}</span><strong>${t(ko,en)}</strong><small>${status}</small>`,`flight-stop ${cls}`))}</div></section>
  <section class="next-section"><div class="section-meta"><span class="mono live-label"><i class="live-dot" aria-hidden="true"></i>WORKSHOP 02 · ${state(workshop.id)}</span><span class="mono">SOGANG / WS-02</span></div>
  <article class="next-card glass"><div class="date-tile">${label(`${date.monthShort} · ${date.year}`)}<span class="big-date">${date.day}</span><span class="mono">${date.weekdayEn.toUpperCase()} ${date.time} KST</span><span class="muted">${t(workshop.place,workshop.placeEn)}</span></div><div class="workshop-summary"><h2>Workshop ${workshop.id} ·<br>${t(workshop.topicKo,workshop.topicEn)}</h2><ol class="steps"><li><span>01</span>${t('게임 아이디어 정하기','Choose your game idea')}</li><li><span>02</span>${t('AI와 함께 만들고 실행하기','Build and run it with AI')}</li><li><span>03</span>${t('함께 플레이하고 개선하기','Play together and iterate')}</li></ol><div class="actions">${apply()}${route('workshops/02',t('자세히 보기 →','View details →'),'text-link')}</div></div>
    <div class="countdown-panel"><span class="eyebrow mono" id="countdown-label">${t('행사 시각 · KST','EVENT TIME · KST')}</span><div class="countdown" aria-label="워크숍 카운트다운">${[['hours','시간','HOURS'],['minutes','분','MIN'],['seconds','초','SEC']].map(([key,ko,en])=>h`<div><strong class="mono" data-countdown="${key}">--</strong><small>${t(ko,en)}</small></div>`)}</div>${calendarButtons()}</div></article>
  <div class="two-columns">${monthlyCalendar(workshop)}
  <section class="location glass"><iframe class="map" title="서강대학교 정하상관 Google 지도" src="https://maps.google.com/maps?q=%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%90%20%EC%A0%95%ED%95%98%EC%83%81%EA%B4%80&z=16&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="location-body">${label('LOCATION')}<h3>${t(`서강대학교 ${workshop.place}`,`Sogang · ${workshop.placeEn}`)}</h3><p>${t('서울 마포구 백범로 35 · 행사 장소는 Luma에서 확인하세요.','35 Baekbeom-ro, Mapo-gu, Seoul · Check Luma for venue updates.')}</p>${mapButtons()}</div></section></div>
  ${route('studio',h`<span class="eyebrow mono red">STUDIO SESSION</span><span class="mono muted">${t(studio.status,studio.statusEn)}</span><strong>${t('혼자 막혔던 아이디어를, 함께 앞으로.','Move your idea forward, together.')}</strong><span aria-hidden="true">→</span>`,'studio-banner glass')}
  </section>`;
}

function roadmap() {
  const date = eventDate(workshop);
  const firstDate = eventDate(first);
  const rows = [
    [first.id,`WORKSHOP ${first.id}`,first.topicKo,first.topicEn,`${firstDate.short.replace('/', '.')} / ${firstDate.time}`, `${first.place}에서 진행한 첫 번째 모임입니다.`,`Our first gathering at ${first.placeEn}.`, first.url,'past'],
    [workshop.id,`WORKSHOP ${workshop.id}`,workshop.topicKo,workshop.topicEn,`${date.short.replace('/', '.')} / ${date.time}`,`${workshop.place} · AI와 게임을 만들고 함께 플레이해요.`,`${workshop.placeEn} · Build with AI and play together.`,'#/workshops/02','active'],
    ['03','STUDIO SESSION','내 작업을 가져와 함께 풀어보기','Bring your work and build together',null,'궁금한 질문과 진행 중인 작업으로 만나는 시간. 일정과 장소를 준비하고 있어요.','A session for your questions and work in progress. Date and venue are being planned.','#/studio',''],
    ['04','SHOWCASE','작은 시도도, 함께 나누면 다음 아이디어로','Share a small experiment. Start the next idea.',null,'작업의 과정과 결과를 나눌 자리를 준비합니다. 확정 일정은 이곳에 안내할게요.','We are planning a space to share the process and results. Confirmed dates will appear here.',null,''],
  ];
  return h`${head('SEMESTER / 2026.2','한 학기, 하나씩 쌓아가는 경험.','A semester of small steps.','배우고, 직접 만들고, 서로의 시도를 나눕니다.','Learn, make something of your own, and share the process.')}<ol class="roadmap-list">${rows.map(([n,k,ko,en,date,descK,descE,url,cls])=>h`<li class="glass roadmap-row ${cls}"><span class="roadmap-number mono">${n}</span><div>${label(k)}<h2>${t(ko,en)}</h2><p>${t(descK,descE)}</p>${url?(url.startsWith('#')?route(url.slice(2),t('자세히 보기 →','View details →'),'text-link'):external(url,t('지난 행사 안내','Past event details'),'text-link')):''}</div><span class="roadmap-date mono">${date??t('일정 준비 중','COMING SOON')}</span></li>`)}</ol><div class="note glass">${t('일정은 한국 시간(KST) 기준입니다. 변경 사항과 신청 가능 여부는 각 행사의 Luma 페이지를 확인해 주세요.','All times are Korea Standard Time (KST). Check each Luma event for updates and registration availability.')}</div>`;
}

function workshopDetail() {
  const date = eventDate(workshop);
  return h`${head(`WORKSHOPS / ${workshop.id}`,workshop.topicKo,workshop.topicEn,'혼자 떠올린 게임을, 함께 플레이할 수 있는 경험으로.','Turn a game idea into something you can play together.')}<div class="actions">${apply()}${external('https://osc-game-making-lab.mt-hogeon0731.chatgpt.site',t('Game Lab 열기','Open Game Lab'),'button')}</div>
  <div class="detail-grid"><article class="glass panel"><div class="section-meta">${label('EVENT BRIEF')}${state(workshop.id)}</div><dl class="detail-list"><div><dt>${t('일정','Date')}</dt><dd>${date.numeric} (${t(date.weekdayKo,date.weekdayEn)})<br>${date.time} KST</dd></div><div><dt>${t('장소','Venue')}</dt><dd>${t(`서강대학교 ${workshop.place}`,`Sogang · ${workshop.placeEn}`)}</dd></div><div><dt>${t('진행','Hosts')}</dt><dd>${organizers.join(' · ')}</dd></div><div><dt>${t('참가','Admission')}</dt><dd>${t(workshop.note,workshop.noteEn)}</dd></div><div><dt>${t('준비물','Bring')}</dt><dd>${t('충전된 노트북과 충전기','A charged laptop and charger')}</dd></div></dl><p class="food-note">${t('참가자에게 피자가 제공됩니다.','Pizza is provided for participants.')}</p>${calendarButtons()}${mapButtons()}</article>
  <div class="stack"><article class="glass panel"><span class="eyebrow mono">WHAT YOU WILL TRY</span><h2>${t('상상 → 만들기 → 함께 플레이','Imagine → Build → Play together')}</h2><p>${t('Game Lab에서 게임 아이디어를 살펴보고, AI와 함께 작은 첫 버전을 만들어보세요. 다른 사람과 플레이하며 규칙과 화면을 다듬습니다.','Explore ideas in Game Lab and build a small first version with AI. Play with others, then refine the rules and interface.')}</p><ol class="numbered-list"><li>${t('누가, 어떤 목표로 플레이할지 정해요.','Decide who plays and what they try to achieve.')}</li><li>${t('게임 규칙을 설명하고 직접 실행해요.','Describe the rules and run your game.')}</li><li>${t('다른 사람의 플레이를 보고 하나씩 개선해요.','Watch someone play and make one improvement at a time.')}</li></ol>${external('https://osc-game-making-lab.mt-hogeon0731.chatgpt.site',t('이번 워크숍 실습 공간으로','Go to the workshop lab'),'text-link')}</article><article class="glass panel"><span class="eyebrow mono">BEFORE YOU ARRIVE</span><h2>${t('가볍게 준비해 주세요.','A little preparation.')}</h2><p>${t('노트북과 충전기를 챙기고, 사용 중인 AI 도구에 로그인해 두세요. 만들고 싶은 게임 아이디어 하나면 충분해요.','Bring your laptop and charger, and sign in to your AI tools beforehand. One game idea is enough to get started.')}</p>${route('learn',t('수업 자료 미리 보기 →','Preview the learning materials →'),'text-link')}</article></div></div>
  <details class="glass faq"><summary>${t('실습 도중 막히면 어떻게 하나요?','What if I get stuck?')}</summary><p>${t('무엇을 하려 했는지, 무엇을 눌렀는지, 화면에 어떤 결과가 보이는지 설명해 주세요. Game Lab과 문제 해결 가이드를 살펴보고 운영진에게 질문해도 좋아요.','Explain what you were trying to do, what you clicked, and what appeared. Check Game Lab and the troubleshooting guide, or ask the hosts.')}</p>${external(`${site.repository}/blob/main/guides/TROUBLESHOOTING.md`,t('문제 해결 가이드','Troubleshooting guide'),'text-link')}</details>`;
}

function learn() {
  const missions = [
    ['01','island-01.webp','준비하고, 첫 실행하기','Prepare and start','기초 틀과 안내를 읽고 나만의 첫 화면을 실행해요.','Read the starter guide and run your first screen.',`${site.repository}/blob/main/guides/START-HERE.md`,'시작 안내 열기','Open the start guide'],
    ['02','island-02.webp','게임을 만들고, 함께 플레이','Build a game. Play together.','Workshop 02의 Game Lab에서 아이디어를 게임으로 바꿔요.','Turn an idea into a game with the Workshop 02 Game Lab.','https://osc-game-making-lab.mt-hogeon0731.chatgpt.site','Game Lab 열기','Open Game Lab'],
    ['review','island-review.webp','고치고, 다음 시도 기록하기','Reflect and try again','막혔던 부분을 풀고, 무엇을 바꿨는지 한 줄로 남겨요.','Resolve a problem and note what you changed.',`${site.repository}/blob/main/guides/TROUBLESHOOTING.md`,'문제 해결 가이드','Troubleshooting guide'],
  ];
  return h`${head('LEARNING ROOM','작은 미션부터, 나의 속도로.','Small missions. Your own pace.','자료를 열고 직접 실습해 보세요. 로그인 없이 시작할 수 있어요.','Open the materials and try them out. No sign-in is needed.')}<div class="progress-panel glass"><div><strong>${t('나의 실습 체크','My practice checklist')}</strong><p>${t('체크 상태는 이 브라우저에만 저장돼요.','Your progress stays in this browser.')}</p></div><span class="mono" id="mission-progress" aria-live="polite">0 / 3</span><progress id="mission-progress-bar" max="3" value="0" aria-label="실습 진행률"></progress></div>
  <div class="mission-grid">${missions.map(([id,img,ko,en,descK,descE,url,linkK,linkE],i)=>h`<article class="mission glass"><div class="mission-art"><span class="mono">MISSION / 0${i+1}</span><img src="/assets/missions/${img}" width="1024" height="1024" loading="lazy" alt=""></div><div class="mission-body"><h2>${t(ko,en)}</h2><p>${t(descK,descE)}</p>${external(url,t(linkK,linkE),'button compact')}<label class="mission-check"><input type="checkbox" data-mission-check="${id}">${t('이 미션을 해봤어요','I tried this mission')}</label></div></article>`)}</div>
  <article class="prompt-panel glass"><div>${label('START WITH A PROMPT')}<h2>${t('첫 요청이 어렵다면,','Need a first prompt?')}<br>${t('이렇게 시작해 보세요.','Start here.')}</h2><p>${t('아이디어 부분만 바꿔 Codex에 붙여 넣으세요.','Replace the idea and paste this into Codex.')}</p></div><div class="prompt-box"><div class="section-meta"><span class="mono">PROMPT / 01</span><button class="button small" type="button" data-copy="starter-prompt">${t('복사','Copy')}</button></div><pre id="starter-prompt">${t(prompt,promptEn)}</pre></div></article>
  <div class="note glass">${t('완료 체크는 나만의 학습 메모예요. 다른 기기와 동기화되거나 출석으로 제출되지는 않습니다.','Completion checks are personal learning notes. They do not submit attendance or sync between devices.')}</div>`;
}

function studioPage() {
  return h`${head('BUILD / STUDIO SESSION','혼자 막혔던 아이디어를, 함께 앞으로.','Move your idea forward, together.','각자의 작업과 질문을 가져와 함께 살펴보는 시간입니다.','Bring your work and questions. We will explore them together.')}<div class="studio-hero glass"><div>${label('NEXT SESSION')}<h2>${t(studio.status,studio.statusEn)}<span class="red">.</span></h2><p>${t('확정된 날짜와 장소는 이 페이지에 안내합니다. 지금은 진행 중인 프로젝트와 질문 하나를 준비해 주세요.','The date and venue will be announced here. For now, bring a project in progress and a question you want to explore.')}</p>${route('learn',t('기다리는 동안, 실습해 보기 →','Explore the learning room →'),'button')}</div><div class="studio-coordinate mono"><span>SOGANG</span><strong>BUILD<br>TOGETHER</strong><span>OPEN QUESTIONS. SMALL STEPS.</span></div></div><div class="three-columns">${[
    ['01','진행 중인 작업','Work in progress','완성된 결과물이 아니어도 괜찮아요. 지금 만들고 있는 화면부터 보여주세요.','It does not need to be finished. Show what you are working on.'],
    ['02','하나의 질문','One question','어디서 막혔는지, 무엇을 바꾸고 싶은지 함께 이야기해요.','Tell us where you are stuck and what you want to change.'],
    ['03','작은 다음 단계','A small next step','함께 살펴본 내용을 바탕으로 다음에 시도할 한 가지를 정해요.','Leave with one concrete thing to try next.'],
  ].map(([n,ko,en,k,e])=>h`<article class="glass panel">${label(n)}<h2>${t(ko,en)}</h2><p>${t(k,e)}</p></article>`)}</div>`;
}

function recap() {
  return h`${head('ACTIVITY / RECAP','우리가 만나고, 시도한 기록.','The things we try together.','확인된 행사 안내와 공개된 실습 자료를 한곳에 모았어요.','Event details and published learning materials, in one place.')}<div class="recap-list">${[first,workshop].map((event,i)=>{
    const date = eventDate(event);
    const descriptionKo = i === 0 ? '첫 번째 워크숍의 행사 안내를 확인할 수 있어요.' : 'Game Lab에서 실습을 이어갈 수 있어요.';
    const descriptionEn = i === 0 ? 'View the original event details.' : 'Continue practicing in Game Lab.';
    return h`<article class="glass recap-card"><div class="recap-date mono"><span>${date.monthShort} / ${date.year}</span><strong>${date.day}</strong><span>${date.time} KST</span></div><div>${label(`WORKSHOP ${event.id}`)}<h2>${t(event.topicKo,event.topicEn)}</h2><p>${t(`${date.longKo} · ${event.place}. ${descriptionKo}`,`${date.longEn} · ${event.placeEn}. ${descriptionEn}`)}</p><div class="actions">${external(event.url,t('Luma 행사 안내','Event on Luma'),'button small')}${i===1?external('https://osc-game-making-lab.mt-hogeon0731.chatgpt.site',t('실습 자료','Learning materials'),'button small'):''}</div></div>${state(event.id)}</article>`;
  })}</div><div class="empty-recap glass">${label('MORE STORIES TO COME')}<h2>${t('다음 기록을 준비하고 있어요.','More stories are on the way.')}</h2><p>${t('공개할 활동 사진과 프로젝트가 정리되면 이곳에 소개할게요.','We will add activity photos and projects when they are ready to share.')}</p></div>`;
}

function about() {
  return h`${head('PEOPLE / SOGANG','서강에서, 함께 만드는 사람들.','The people building at Sogang.','OpenAI Student Collective의 캠퍼스 활동을 함께 운영합니다.','We bring OpenAI Student Collective activities to our campus.')}<article class="about-leads glass"><div class="badge-wrap"><img src="/assets/campus-lead.webp" width="360" height="360" alt="Campus Lead 2026 · OpenAI Student Collective 배지"></div><div>${label('SOGANG CAMPUS LEADS')}<h2>${organizers.join(' · ')}</h2><p>${t('배우고, 만들고, 나누는 경험을 서강에서 연결합니다. 워크숍과 실습 자료를 준비하고, 여러분의 질문과 새로운 시도를 함께 살펴봅니다.','We connect learning, building, and sharing at Sogang. We prepare workshops and materials, and explore your questions and experiments together.')}</p><div class="actions">${external(workshop.url,t('Luma에서 운영진에게 문의','Contact the hosts on Luma'),'button primary')}${external(site.sourceRepository,'GitHub','button')}</div></div></article><div class="two-columns"><article class="glass panel">${label('LEARN · BUILD · SHARE')}<h2>${t('모두의 출발점은 달라도 좋아요.','Every starting point is welcome.')}</h2><p>${t('처음 쓰는 도구도, 아직 정리되지 않은 아이디어도 괜찮아요. 작은 결과물 하나를 만들어보고 서로의 경험에서 다음 단계를 찾습니다.','New tools and unfinished ideas are welcome. Make one small thing and find your next step through someone else’s experience.')}</p>${external(site.collective,t('Student Collective 더 알아보기','Explore Student Collective'),'text-link')}</article><article class="glass panel">${label('COLLABORATION')}<h2>${t('함께할 이야기를 기다립니다.','Let’s talk about working together.')}</h2><p>${t('워크숍 참여, 활동 소개, 협력 제안은 Luma 행사 페이지의 주최자 문의 기능을 이용해 주세요.','For participation, community activities, or collaboration, use Contact Host on the Luma event page.')}</p>${external(workshop.url,t('행사 페이지 열기','Open the event page'),'text-link')}</article></div>`;
}

function admin() {
  const edit = `${site.sourceRepository}/edit/${site.branch}/sogang/src/content.mjs`;
  return h`${head('ADMINISTRATION','운영 정보, 원본에서 관리해요.','Manage the source of truth.','행사 정보는 GitHub에서 수정하고 변경 기록으로 확인합니다.','Edit event information on GitHub and review the change history.')}<div class="admin-grid"><article class="glass panel"><div class="section-meta">${label('GITHUB WORKSPACE')}<span class="pill">${t('저장소 권한 필요','Repository access required')}</span></div><h2>${t('GitHub에서 콘텐츠 수정','Edit content on GitHub')}</h2><p>${t('일정·장소·운영진 정보가 담긴 파일을 엽니다. GitHub에 로그인한 뒤 저장소 수정 권한이 있는 계정으로 변경을 커밋할 수 있어요.','Open the file containing dates, venues, and hosts. Sign in on GitHub with an account that can write to this repository to commit changes.')}</p>${external(edit,t('GitHub 편집 화면 열기','Open the GitHub editor'),'button primary')}<p class="admin-caption mono">mthogeon0731/openAI_WS<br>${site.branch}</p></article><article class="glass panel"><span class="eyebrow mono">PUBLISHING WORKFLOW</span><h2>${t('수정 → 확인 → 배포','Edit → Review → Publish')}</h2><ol class="numbered-list"><li>${t('GitHub에서 행사 정보를 수정하고 커밋해요.','Edit the event information and commit on GitHub.')}</li><li>${t('PR에서 변경 내용을 검토하고 빌드를 확인해요.','Review the pull request and check the build.')}</li><li>${t('검토한 버전을 사이트에 배포해요.','Publish the reviewed version to the site.')}</li></ol><div class="note inline-note">${t('이 페이지에서는 GitHub 로그인이나 자동 배포를 실행하지 않습니다. 현재 미리보기는 검토한 버전을 별도로 배포합니다.','This page does not sign you in to GitHub or trigger automatic deployment. The current preview is published separately after review.')}</div>${external(`${site.sourceRepository}/pull/1`,t('변경 검토 PR 열기','Open the review pull request'),'text-link')}</article></div><section class="glass panel"><div class="section-meta"><div>${label('GIT LOG')}<h2>${t('실제 변경 기록','Repository history')}</h2></div><button id="load-commits" type="button" class="button">${t('기록 불러오기','Load history')}</button></div><p id="commit-status" role="status" class="muted"></p><ul id="commit-log" class="commit-log"><li class="commit-state">${t('버튼을 누르면 GitHub의 최근 커밋을 불러옵니다.','Load the latest commits directly from GitHub.')}</li></ul>${external(`${site.sourceRepository}/commits/${site.branch}/sogang`,t('GitHub에서 전체 기록 보기','View all history on GitHub'),'text-link')}</section>`;
}

export function renderPage() {
  const data = JSON.stringify({events,repository:'mthogeon0731/openAI_WS',branch:site.branch}).replace(/</g,'\\u003c');
  return h`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ECECEA"><title>홈 · Sogang Student Collective</title><meta name="description" content="${site.description}"><meta property="og:title" content="Sogang Student Collective"><meta property="og:description" content="${site.description}"><meta property="og:type" content="website"><meta property="og:url" content="${site.url}"><link rel="icon" href="/assets/sogang-emblem.png"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/styles.css"><script type="module" src="/assets/main.js"></script></head>
  <body><a class="skip-link" href="#main">${t('본문으로 건너뛰기','Skip to content')}</a><div class="ambient" aria-hidden="true"></div><div class="app-shell">${sidebar()}<div class="workspace"><header class="hud glass mono"><button class="menu-toggle" id="menu-toggle" aria-controls="sidebar" aria-expanded="false" type="button">${t('메뉴','Menu')}</button><span id="hud-path">SOGANG / HOME</span><span class="clock"><i class="live-dot" aria-hidden="true"></i>KST <time id="kst-clock">--:--:--</time></span><span class="hud-next">WS-02 · <span id="hud-countdown">${eventDate(workshop).numeric}</span></span><span class="motto">OBEDIRE VERITATI</span></header><main id="main">
  ${page('home','홈','Home',home())}${page('roadmap','학기 로드맵','Semester roadmap',roadmap())}${page('workshops/02','Workshop 02','Workshop 02',workshopDetail())}${page('learn','수업 듣기','Learning room',learn())}${page('studio','Studio Session','Studio Session',studioPage())}${page('recap','Recap','Recap',recap())}${page('about','운영·협력','People & partners',about())}${page('admin','관리자','Administration',admin())}
  <section class="inner-page" id="page-not-found" hidden><h1 tabindex="-1">${t('페이지를 찾을 수 없어요.','Page not found.')}</h1>${route('home',t('홈으로 돌아가기','Return home'),'button')}</section></main>
  <footer class="site-footer"><img src="/assets/campus-lead.webp" width="48" height="48" alt="Campus Lead 2026"><div><strong>OpenAI Student Collective | SOGANG</strong><span> · ${t('운영','Hosts')} ${organizers.join(' · ')}</span><p>${t('배우고, 만들고, 나누는 서강의 커뮤니티.','A community for learning, building, and sharing at Sogang.')}</p></div><div class="footer-links">${external(workshop.url,t('운영진 문의','Contact hosts'),'text-link')}${external(site.sourceRepository,'GitHub','text-link')}${route('about',t('운영·협력 안내','People & partners'),'text-link')}</div></footer></div></div><div class="toast" id="toast" role="status" aria-live="polite"></div><script type="application/json" id="site-data">${raw(data)}</script><noscript><div class="no-script">JavaScript를 켜면 페이지 탐색, 실습 체크, 실시간 시계를 사용할 수 있습니다. 행사 정보와 신청 링크는 위에서 확인할 수 있어요.</div></noscript></body></html>`;
}
