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
const icon = name => h`<span class="symbol" aria-hidden="true">${name}</span>`;
const label = text => h`<span class="eyebrow mono">${text}</span>`;
const head = (tag, ko, en, descKo, descEn) => h`<header class="page-heading">${label(tag)}<h1 tabindex="-1">${t(ko,en)}</h1><p>${t(descKo,descEn)}</p></header>`;
const page = (id, ko, en, body) => h`<section class="page ${id === 'home' ? 'home-page' : 'inner-page'}" id="page-${id.replaceAll('/','-')}" data-page="${id}" data-title-ko="${ko}" data-title-en="${en}" ${id !== 'home' ? raw('hidden') : ''}>${body}</section>`;
const mapButtons = () => h`<div class="map-links">${external(maps.naver,t('네이버 지도','Naver Maps'),'button small')}${external(maps.kakao,t('카카오맵','Kakao Maps'),'button small')}${external(maps.google,t('Google 지도','Google Maps'),'button small')}</div>`;
const calendarButtons = () => h`<div class="calendar-actions">${external(googleCalendarUrl(workshop),t('Google 캘린더','Google Calendar'),'button compact')}<a class="button compact" href="/assets/workshop-${workshop.id}.ics" download="sogang-workshop-${workshop.id}.ics">${t('아이폰·아웃룩','Apple · Outlook')}<span class="mono muted">.ics</span></a></div>`;

function sidebar() {
  const date = eventDate(workshop);
  const firstDate = eventDate(first);
  const item = (path, ko, en, symbol, meta = '') => route(path,h`${icon(symbol)}${t(ko,en)}<small>${meta}</small>`,'nav-item');
  return h`<button class="menu-backdrop" id="menu-backdrop" aria-label="메뉴 닫기" hidden></button><aside class="sidebar" id="sidebar">
    <button id="menu-close" class="menu-close" type="button" aria-label="메뉴 닫기">${icon('close')}</button>
    ${route('home',h`<img src="/assets/sogang-seal-256.png" width="40" height="40" alt="서강대학교 교표"><span><b>Student Collective</b><small>OpenAI · Sogang</small></span>`,'brand')}
    <nav aria-label="사이트 메뉴"><div class="nav-group">${label(t('시작하기','Start here'))}${item('home','홈','Home','home')}${item('learn','수업 자료','Learning materials','school')}</div>
    <div class="nav-group">${label(t('2026년 2학기','Fall 2026'))}<a class="nav-item" href="${first.url}" target="_blank" rel="noopener noreferrer"><span class="nav-index mint">1</span><span>Workshop 1</span><small>${firstDate.short} ↗</small></a>${route('workshops/02',h`<span class="nav-index lilac">2</span><span>Workshop 2</span><small>${date.short}</small>`,'nav-item')}${item('studio','Studio Session','Studio Session','edit_note')}${item('roadmap','Showcase','Showcase','flag',t('준비 중','Soon'))}</div>
    <div class="nav-group">${label(t('모아보기','Discover'))}${item('roadmap','학기 일정','Semester schedule','calendar_month')}${item('recap','활동 기록','Recap','photo_library')}${item('about','운영·협력','People & partners','groups')}${item('admin','사이트 관리','Administration','settings')}</div></nav>
    <div class="sidebar-bottom"><a class="contact-card" href="${workshop.url}" target="_blank" rel="noopener noreferrer">${icon('chat')}<span><strong>${t('궁금한 점이 있나요?','Have a question?')}</strong><small>${t('Luma에서 운영진에게 문의','Contact the hosts on Luma')}</small></span><span aria-hidden="true">↗</span></a><div class="language-row"><span>Sogang University</span><div class="language-switch" role="group" aria-label="언어 / Language"><button type="button" data-lang="ko" aria-pressed="true">KO</button><button type="button" data-lang="en" aria-pressed="false">EN</button></div></div></div>
  </aside>`;
}

function monthlyCalendar(event) {
  const date = eventDate(event);
  const year = Number(date.year);
  const month = Number(date.month);
  const offset = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = Math.ceil((offset + days) / 7) * 7;
  return h`<section class="calendar glass" aria-label="${year}년 ${month}월 행사 달력"><div class="section-title"><h2>${t(`${year}년 ${month}월`,`${date.monthLong[0]}${date.monthLong.slice(1).toLowerCase()} ${year}`)}</h2>${icon('calendar_month')}</div><div class="calendar-grid">${[['일','S'],['월','M'],['화','T'],['수','W'],['목','T'],['금','F'],['토','S']].map(([ko,en])=>h`<span class="weekday">${t(ko,en)}</span>`)}${Array.from({length:cells},(_,i)=>{
    const day = i - offset + 1;
    if (day < 1 || day > days) return h`<span></span>`;
    if (day === Number(date.day)) return route('workshops/02',h`<span aria-label="${month}월 ${day}일 ${event.title}">${day}</span>`,'calendar-event');
    return h`<span class="calendar-day ${i%7===0?'sunday':''}">${day}</span>`;
  })}</div><div class="calendar-legend"><span><i></i>${date.short} · ${date.startTime} Workshop ${Number(event.id)}</span><span class="muted">${t(`Studio Session · ${studio.status}`,`Studio Session · ${studio.statusEn}`)}</span></div></section>`;
}

function home() {
  const date = eventDate(workshop);
  const firstDate = eventDate(first);
  const mottoLines = site.motto.replace(' into ', '\ninto ').split('\n');
  const roomKo = workshop.place.split(' ').at(-1);
  const roomEn = workshop.placeEn.split(' ').at(-1);
  const buildingKo = workshop.place.slice(0, -roomKo.length).trim();
  const buildingEn = workshop.placeEn.slice(0, -roomEn.length).trim();
  const stages = [
    ['recap',`Workshop ${Number(first.id)}`,first.topicKo,first.topicEn,firstDate.short,'mint'],
    ['workshops/02',`Workshop ${Number(workshop.id)}`,workshop.topicKo,workshop.topicEn,date.short,'lilac'],
    ['studio','Studio Session','작업과 질문을 가져오는 모임','Bring your work and questions',t(studio.status,studio.statusEn),'apricot'],
    ['roadmap','Showcase','프로젝트를 소개하는 자리','Share your projects',t('일정 준비 중','Schedule coming soon'),''],
  ];
  const summary = (cls,symbol,title,value,caption,href) => h`<a class="summary-card ${cls}" href="${href}" ${href.startsWith('#/')?raw(`data-route="${href.slice(2)}"`):''}><span class="summary-label">${icon(symbol)}${title}<span aria-hidden="true">↗</span></span><strong class="summary-value">${value}</strong><span class="summary-caption">${caption}</span></a>`;
  return h`<section class="brand-banner" aria-label="OpenAI Student Collective Sogang"><div class="banner-content"><img class="banner-watermark" src="/assets/sogang-seal-mark-720.png" width="720" height="720" alt="" aria-hidden="true"><div class="banner-identity"><img src="/assets/sogang-seal-256.png" width="48" height="48" alt="서강대학교 교표"><span>Student Collective</span></div><div class="banner-wordmark">SOGANG</div><p class="banner-meta">OpenAI Student Collective · 2026.2</p></div><img class="banner-sticker" src="/assets/campus-lead-badge-640.webp" width="200" height="200" alt="Campus Lead 2026 · OpenAI Student Collective"></section>
  <section class="home-intro"><p class="intro-date" id="home-date">${date.longKo}</p><h1 tabindex="-1" lang="en" aria-label="${site.motto}"><span>${mottoLines[0]}</span>${mottoLines[1]?h`<br><span class="red">${mottoLines[1]}</span>`:""}</h1><p>${t('서강대학교 학생들이 ChatGPT와 Codex를 직접 써보는 워크숍입니다. 일정과 실습 자료를 여기에서 확인하세요.','Hands-on workshops with ChatGPT and Codex for Sogang students. Find the schedule and learning materials here.')}</p><div class="actions">${route('workshops/02',h`${t('워크숍 알아보기','Explore the workshop')}${icon('arrow_forward')}`,'button primary large')}${route('learn',h`${t('수업 자료 열기','Learning materials')}${icon('school')}`,'button large')}</div></section>
  <section class="summary-grid" aria-label="학기 안내">
    ${summary('red','event','Workshop 2',h`<span id="summary-event-day">${date.short}</span>`,h`<span id="summary-countdown">${date.time} KST</span>`,'#/workshops/02')}
    ${summary('apricot','edit_note','Studio Session',t('준비 중','Coming soon'),t('일정과 장소를 준비하고 있어요.','Date and venue to be announced.'),'#/studio')}
    ${summary('mint','checklist',t('학기 진행','Semester progress'),h`<span id="semester-progress">0 / ${events.length}</span>`,h`<span id="semester-progress-label">${t('확정된 워크숍 기준','Confirmed workshops')}</span>`,'#/roadmap')}
    ${summary('lilac','location_on',t('Workshop 2 장소','Workshop 2 venue'),t(roomKo,roomEn),t(`${buildingKo} · 지도 보기`,`${buildingEn} · View map`),'#location')}
  </section>
  <div class="dashboard-row primary-row"><section class="workshop-panel glass"><div class="section-title"><h2>Workshop 2</h2>${state(workshop.id)}</div><h3>${t(workshop.topicKo,workshop.topicEn)}</h3><p class="workshop-meta">${date.numeric} (${t(date.weekdayKo,date.weekdayEn)}) · ${date.time}<br>${t(workshop.place,workshop.placeEn)}</p><div class="steps-list">${[
    ['01','게임 아이디어 정하기','Choose a game idea','누가, 어떤 규칙으로 플레이할지 정해요.','Decide who plays and what the rules are.'],
    ['02','AI와 함께 만들고 실행하기','Build and run with AI','Game Lab에서 첫 버전을 만들어봐요.','Make your first version in Game Lab.'],
    ['03','함께 플레이하고 개선하기','Play together and improve','다른 사람의 플레이를 보고 수정해요.','Watch others play, then refine the game.'],
  ].map(([n,ko,en,descK,descE])=>h`<div class="steps-row"><span class="step-number">${n}</span><div class="step-copy"><strong>${t(ko,en)}</strong><p>${t(descK,descE)}</p></div></div>`)}</div><div class="actions">${apply()}${route('workshops/02',t('자세히 보기 →','View details →'),'text-link')}</div>${calendarButtons()}</section>${monthlyCalendar(workshop)}</div>
  <div class="dashboard-row secondary-row"><section class="stage-panel glass"><div class="section-title"><h2>${t('이번 학기','This semester')}</h2>${icon('route')}</div><div class="stage-list">${stages.map(([path,title,ko,en,status,tone],i)=>route(path,h`<span class="stage-index ${tone}">${i+1}</span><span class="stage-copy"><strong>${title}</strong><small>${t(ko,en)}</small></span><span class="stage-status">${status}</span>`,'stage-row'))}</div></section>
  <section class="location glass" id="location"><div class="section-title"><h2>${t('오시는 길','Getting here')}</h2>${icon('location_on')}</div><div class="location-content"><iframe class="map" title="서강대학교 정하상관 Google 지도" src="https://maps.google.com/maps?q=%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%90%20%EC%A0%95%ED%95%98%EC%83%81%EA%B4%80&z=16&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="location-body"><h3>${t(`서강대학교 ${workshop.place}`,`Sogang · ${workshop.placeEn}`)}</h3><p>${t('서울 마포구 백범로 35 · 행사 장소는 Luma에서 확인하세요.','35 Baekbeom-ro, Mapo-gu, Seoul · Check Luma for venue updates.')}</p>${mapButtons()}</div></div></section></div>
  ${route('studio',h`<span class="studio-banner-icon">${icon('edit_note')}</span><span><span class="eyebrow">Studio Session · ${t(studio.status,studio.statusEn)}</span><strong>${t('진행 중인 작업과 질문을 가져오세요.','Bring your work and your questions.')}</strong><span>${t('각자의 프로젝트를 함께 살펴보는 시간을 준비합니다.','A session to work through your projects together.')}</span></span>${icon('arrow_forward')}`,'studio-banner')}`;
}

function roadmap() {
  const date = eventDate(workshop);
  const firstDate = eventDate(first);
  const rows = [
    [first.id,`WORKSHOP ${first.id}`,first.topicKo,first.topicEn,`${firstDate.short.replace('/', '.')} / ${firstDate.time}`, `${first.place}에서 진행한 첫 번째 모임입니다.`,`Our first gathering at ${first.placeEn}.`, first.url,'past'],
    [workshop.id,`WORKSHOP ${workshop.id}`,workshop.topicKo,workshop.topicEn,`${date.short.replace('/', '.')} / ${date.time}`,`${workshop.place} · AI와 게임을 만들고 함께 플레이해요.`,`${workshop.placeEn} · Build with AI and play together.`,'#/workshops/02','active'],
    ['03','STUDIO SESSION','내 작업을 가져와 함께 풀어보기','Bring your work and build together',null,'궁금한 질문과 진행 중인 작업으로 만나는 시간. 일정과 장소를 준비하고 있어요.','A session for your questions and work in progress. Date and venue are being planned.','#/studio',''],
    ['04','SHOWCASE','프로젝트 소개','Share your project',null,'작업의 과정과 결과를 나눌 자리를 준비합니다. 확정 일정은 이곳에 안내할게요.','We are planning a space to share the process and results. Confirmed dates will appear here.',null,''],
  ];
  return h`${head('SEMESTER / 2026.2','학기 일정','Semester schedule','이번 학기의 워크숍과 모임을 확인하세요.','Find this semester’s workshops and gatherings.')}<ol class="roadmap-list">${rows.map(([n,k,ko,en,date,descK,descE,url,cls])=>h`<li class="glass roadmap-row ${cls}"><span class="roadmap-number mono">${n}</span><div>${label(k)}<h2>${t(ko,en)}</h2><p>${t(descK,descE)}</p>${url?(url.startsWith('#')?route(url.slice(2),t('자세히 보기 →','View details →'),'text-link'):external(url,t('지난 행사 안내','Past event details'),'text-link')):''}</div><span class="roadmap-date mono">${date??t('일정 준비 중','COMING SOON')}</span></li>`)}</ol><div class="note glass">${t('일정은 한국 시간(KST) 기준입니다. 변경 사항과 신청 가능 여부는 각 행사의 Luma 페이지를 확인해 주세요.','All times are Korea Standard Time (KST). Check each Luma event for updates and registration availability.')}</div>`;
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
    ['01','school','준비하고, 첫 실행하기','Prepare and start','기초 틀과 안내를 읽고 나만의 첫 화면을 실행해요.','Read the starter guide and run your first screen.',`${site.repository}/blob/main/guides/START-HERE.md`,'시작 안내 열기','Open the start guide'],
    ['02','laptop_mac','게임을 만들고, 함께 플레이','Build a game. Play together.','Workshop 02의 Game Lab에서 아이디어를 게임으로 바꿔요.','Turn an idea into a game with the Workshop 02 Game Lab.','https://osc-game-making-lab.mt-hogeon0731.chatgpt.site','Game Lab 열기','Open Game Lab'],
    ['review','edit_note','고치고, 다음 시도 기록하기','Reflect and try again','막혔던 부분을 풀고, 무엇을 바꿨는지 한 줄로 남겨요.','Resolve a problem and note what you changed.',`${site.repository}/blob/main/guides/TROUBLESHOOTING.md`,'문제 해결 가이드','Troubleshooting guide'],
  ];
  return h`${head('LEARNING ROOM','수업 자료','Learning materials','자료를 열고 직접 실습해 보세요. 로그인 없이 시작할 수 있어요.','Open the materials and try them out. No sign-in is needed.')}<div class="progress-panel glass"><div><strong>${t('나의 실습 체크','My practice checklist')}</strong><p>${t('체크 상태는 이 브라우저에만 저장돼요.','Your progress stays in this browser.')}</p></div><span class="mono" id="mission-progress" aria-live="polite">0 / 3</span><progress id="mission-progress-bar" max="3" value="0" aria-label="실습 진행률"></progress></div>
  <div class="mission-grid">${missions.map(([id,img,ko,en,descK,descE,url,linkK,linkE],i)=>h`<article class="mission glass"><div class="mission-art"><span>0${i+1}</span>${icon(img)}</div><div class="mission-body"><h2>${t(ko,en)}</h2><p>${t(descK,descE)}</p>${external(url,t(linkK,linkE),'button compact')}<label class="mission-check"><input type="checkbox" data-mission-check="${id}">${t('이 미션을 해봤어요','I tried this mission')}</label></div></article>`)}</div>
  <article class="prompt-panel glass"><div>${label('START WITH A PROMPT')}<h2>${t('첫 요청이 어렵다면,','Need a first prompt?')}<br>${t('이렇게 시작해 보세요.','Start here.')}</h2><p>${t('아이디어 부분만 바꿔 Codex에 붙여 넣으세요.','Replace the idea and paste this into Codex.')}</p></div><div class="prompt-box"><div class="section-meta"><span class="mono">PROMPT / 01</span><button class="button small" type="button" data-copy="starter-prompt">${t('복사','Copy')}</button></div><pre id="starter-prompt">${t(prompt,promptEn)}</pre></div></article>
  <div class="note glass">${t('완료 체크는 나만의 학습 메모예요. 다른 기기와 동기화되거나 출석으로 제출되지는 않습니다.','Completion checks are personal learning notes. They do not submit attendance or sync between devices.')}</div>`;
}

function studioPage() {
  return h`${head('BUILD / STUDIO SESSION','Studio Session','Studio Session','각자의 작업과 질문을 가져와 함께 살펴보는 시간입니다.','Bring your work and questions. We will explore them together.')}<div class="studio-hero glass"><div>${label('NEXT SESSION')}<h2>${t(studio.status,studio.statusEn)}<span class="red">.</span></h2><p>${t('확정된 날짜와 장소는 이 페이지에 안내합니다. 지금은 진행 중인 프로젝트와 질문 하나를 준비해 주세요.','The date and venue will be announced here. For now, bring a project in progress and a question you want to explore.')}</p>${route('learn',t('기다리는 동안, 실습해 보기 →','Explore the learning room →'),'button')}</div><div class="studio-coordinate mono">${icon('edit_note')}<strong>Studio<br>Session</strong><span>OpenAI Student Collective</span></div></div><div class="three-columns">${[
    ['01','진행 중인 작업','Work in progress','완성된 결과물이 아니어도 괜찮아요. 지금 만들고 있는 화면부터 보여주세요.','It does not need to be finished. Show what you are working on.'],
    ['02','하나의 질문','One question','어디서 막혔는지, 무엇을 바꾸고 싶은지 함께 이야기해요.','Tell us where you are stuck and what you want to change.'],
    ['03','작은 다음 단계','A small next step','함께 살펴본 내용을 바탕으로 다음에 시도할 한 가지를 정해요.','Leave with one concrete thing to try next.'],
  ].map(([n,ko,en,k,e])=>h`<article class="glass panel">${label(n)}<h2>${t(ko,en)}</h2><p>${t(k,e)}</p></article>`)}</div>`;
}

function recap() {
  return h`${head('ACTIVITY / RECAP','활동 기록','Recap','확인된 행사 안내와 공개된 실습 자료를 한곳에 모았어요.','Event details and published learning materials, in one place.')}<div class="recap-list">${[first,workshop].map((event,i)=>{
    const date = eventDate(event);
    const descriptionKo = i === 0 ? '첫 번째 워크숍의 행사 안내를 확인할 수 있어요.' : 'Game Lab에서 실습을 이어갈 수 있어요.';
    const descriptionEn = i === 0 ? 'View the original event details.' : 'Continue practicing in Game Lab.';
    return h`<article class="glass recap-card"><div class="recap-date mono"><span>${date.monthShort} / ${date.year}</span><strong>${date.day}</strong><span>${date.time} KST</span></div><div>${label(`WORKSHOP ${event.id}`)}<h2>${t(event.topicKo,event.topicEn)}</h2><p>${t(`${date.longKo} · ${event.place}. ${descriptionKo}`,`${date.longEn} · ${event.placeEn}. ${descriptionEn}`)}</p><div class="actions">${external(event.url,t('Luma 행사 안내','Event on Luma'),'button small')}${i===1?external('https://osc-game-making-lab.mt-hogeon0731.chatgpt.site',t('실습 자료','Learning materials'),'button small'):''}</div></div>${state(event.id)}</article>`;
  })}</div><div class="empty-recap glass">${label('MORE STORIES TO COME')}<h2>${t('다음 기록을 준비하고 있어요.','More stories are on the way.')}</h2><p>${t('공개할 활동 사진과 프로젝트가 정리되면 이곳에 소개할게요.','We will add activity photos and projects when they are ready to share.')}</p></div>`;
}

function about() {
  return h`${head('PEOPLE / SOGANG','운영·협력','People & partners','OpenAI Student Collective의 캠퍼스 활동을 함께 운영합니다.','We bring OpenAI Student Collective activities to our campus.')}<article class="about-leads glass"><div class="badge-wrap"><img src="/assets/campus-lead-badge-640.webp" width="360" height="360" alt="Campus Lead 2026 · OpenAI Student Collective 배지"></div><div>${label('SOGANG CAMPUS LEADS')}<h2>${organizers.join(' · ')}</h2><p>${t('서강대학교의 워크숍과 Studio Session을 운영합니다. 행사 참여나 협력에 관한 문의는 Luma 주최자 문의를 이용해 주세요.','We organize the Sogang workshops and Studio Sessions. Contact the hosts on Luma for participation or collaboration.')}</p><div class="actions">${external(workshop.url,t('Luma에서 운영진에게 문의','Contact the hosts on Luma'),'button primary')}${external(site.sourceRepository,'GitHub','button')}</div></div></article><div class="two-columns"><article class="glass panel">${label(t('우리의 모토','Our motto'))}<h2 lang="en">${site.motto}</h2><p>${t('처음 쓰는 도구도, 아직 정리되지 않은 아이디어도 괜찮아요. 작은 결과물 하나를 만들어보고 서로의 경험에서 다음 단계를 찾습니다.','New tools and unfinished ideas are welcome. Make one small thing and find your next step through someone else’s experience.')}</p>${external(site.collective,t('Student Collective 더 알아보기','Explore Student Collective'),'text-link')}</article><article class="glass panel">${label('COLLABORATION')}<h2>${t('함께할 이야기를 기다립니다.','Let’s talk about working together.')}</h2><p>${t('워크숍 참여, 활동 소개, 협력 제안은 Luma 행사 페이지의 주최자 문의 기능을 이용해 주세요.','For participation, community activities, or collaboration, use Contact Host on the Luma event page.')}</p>${external(workshop.url,t('행사 페이지 열기','Open the event page'),'text-link')}</article></div>`;
}

function admin() {
  const edit = `${site.sourceRepository}/edit/${site.branch}/sogang/src/content.mjs`;
  return h`${head('ADMINISTRATION','사이트 관리','Site administration','행사 정보는 GitHub에서 수정하고 변경 기록으로 확인합니다.','Edit event information on GitHub and review the change history.')}<div class="admin-grid"><article class="glass panel"><div class="section-meta">${label('GITHUB WORKSPACE')}<span class="pill">${t('저장소 권한 필요','Repository access required')}</span></div><h2>${t('GitHub에서 콘텐츠 수정','Edit content on GitHub')}</h2><p>${t('일정·장소·운영진 정보가 담긴 파일을 엽니다. GitHub에 로그인한 뒤 저장소 수정 권한이 있는 계정으로 변경을 커밋할 수 있어요.','Open the file containing dates, venues, and hosts. Sign in on GitHub with an account that can write to this repository to commit changes.')}</p>${external(edit,t('GitHub 편집 화면 열기','Open the GitHub editor'),'button primary')}<p class="admin-caption mono">mthogeon0731/openAI_WS<br>${site.branch}</p></article><article class="glass panel"><span class="eyebrow mono">PUBLISHING WORKFLOW</span><h2>${t('수정 → 확인 → 배포','Edit → Review → Publish')}</h2><ol class="numbered-list"><li>${t('GitHub에서 행사 정보를 수정하고 커밋해요.','Edit the event information and commit on GitHub.')}</li><li>${t('PR에서 변경 내용을 검토하고 빌드를 확인해요.','Review the pull request and check the build.')}</li><li>${t('검토한 버전을 사이트에 배포해요.','Publish the reviewed version to the site.')}</li></ol><div class="note inline-note">${t('이 페이지에서는 GitHub 로그인이나 자동 배포를 실행하지 않습니다. 현재 미리보기는 검토한 버전을 별도로 배포합니다.','This page does not sign you in to GitHub or trigger automatic deployment. The current preview is published separately after review.')}</div>${external(`${site.sourceRepository}/pull/1`,t('변경 검토 PR 열기','Open the review pull request'),'text-link')}</article></div><section class="glass panel"><div class="section-meta"><div>${label('GIT LOG')}<h2>${t('실제 변경 기록','Repository history')}</h2></div><button id="load-commits" type="button" class="button">${t('기록 불러오기','Load history')}</button></div><p id="commit-status" role="status" class="muted"></p><ul id="commit-log" class="commit-log"><li class="commit-state">${t('버튼을 누르면 GitHub의 최근 커밋을 불러옵니다.','Load the latest commits directly from GitHub.')}</li></ul>${external(`${site.sourceRepository}/commits/${site.branch}/sogang`,t('GitHub에서 전체 기록 보기','View all history on GitHub'),'text-link')}</section>`;
}

export function renderPage() {
  const data = JSON.stringify({events,repository:'mthogeon0731/openAI_WS',branch:site.branch}).replace(/</g,'\\u003c');
  return h`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#FFFFFF"><title>홈 · Sogang Student Collective</title><meta name="description" content="${site.description}"><meta property="og:title" content="Sogang Student Collective"><meta property="og:description" content="${site.description}"><meta property="og:type" content="website"><meta property="og:url" content="${site.url}"><link rel="icon" href="/assets/sogang-seal-256.png"><link rel="stylesheet" href="/assets/editorial-fonts.css"><link rel="stylesheet" href="/assets/styles.css"><script type="module" src="/assets/main.js"></script></head>
  <body><a class="skip-link" href="#main">${t('본문으로 건너뛰기','Skip to content')}</a><div class="app-shell">${sidebar()}<div class="workspace"><header class="mobile-header"><button class="menu-toggle" id="menu-toggle" aria-controls="sidebar" aria-expanded="false" type="button" aria-label="메뉴 열기">${icon('menu')}</button><span class="mobile-brand">Student Collective <small>Sogang</small></span></header><main id="main">
  ${page('home','홈','Home',home())}${page('roadmap','학기 일정','Semester schedule',roadmap())}${page('workshops/02','Workshop 02','Workshop 02',workshopDetail())}${page('learn','수업 자료','Learning materials',learn())}${page('studio','Studio Session','Studio Session',studioPage())}${page('recap','활동 기록','Recap',recap())}${page('about','운영·협력','People & partners',about())}${page('admin','사이트 관리','Administration',admin())}
  <section class="inner-page" id="page-not-found" hidden><h1 tabindex="-1">${t('페이지를 찾을 수 없어요.','Page not found.')}</h1>${route('home',t('홈으로 돌아가기','Return home'),'button')}</section></main>
  <footer class="site-footer"><div class="footer-brand"><img src="/assets/sogang-seal-256.png" width="36" height="36" alt="서강대학교 교표"><div><strong>OpenAI Student Collective · Sogang</strong><p>${t('운영','Hosts')} ${organizers.join(' · ')}</p></div></div><p class="footer-motto" lang="en">${site.motto}</p><div class="footer-links">${external(workshop.url,t('운영진 문의','Contact hosts'),'text-link')}${external(site.sourceRepository,'GitHub','text-link')}</div></footer></div></div><div class="toast" id="toast" role="status" aria-live="polite"></div><script type="application/json" id="site-data">${raw(data)}</script><noscript><div class="no-script">JavaScript를 켜면 페이지 탐색과 실습 체크를 사용할 수 있습니다. 행사 정보와 신청 링크는 위에서 확인할 수 있어요.</div></noscript></body></html>`;
}
