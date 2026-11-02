import { eventState, countdown } from './time.mjs';

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
};
const pages = [...document.querySelectorAll('.page[data-page]')];
const pageByRoute = new Map(pages.map(page => [page.dataset.page, page]));
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('menu-backdrop');
const toast = document.getElementById('toast');
let language = storage.get('sogang-language') === 'en' ? 'en' : 'ko';
let currentRoute = 'home';
let toastTimer;
let siteData = { events: [] };
try { siteData = JSON.parse(document.getElementById('site-data')?.textContent ?? '{}') ?? {}; } catch {}
const events = Array.isArray(siteData.events) ? siteData.events : [];
const eventById = new Map(events.map(event => [String(event.id).padStart(2, '0'), event]));
const workshop = eventById.get('02');
const say = (ko, en) => language === 'en' ? en : ko;

function announce(message) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => { toast.classList.remove('is-visible'); toast.textContent = ''; }, 6000);
}

function closeMenu({ restoreFocus = true } = {}) {
  const wasOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
  menuToggle?.setAttribute('aria-expanded', 'false');
  sidebar?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (backdrop) backdrop.hidden = true;
  if (wasOpen && restoreFocus) menuToggle?.focus();
}
menuToggle?.addEventListener('click', () => {
  if (menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); return; }
  menuToggle.setAttribute('aria-expanded', 'true');
  sidebar?.classList.add('is-open');
  document.body.classList.add('menu-open');
  if (backdrop) backdrop.hidden = false;
  sidebar?.querySelector('a[data-route]')?.focus();
});
backdrop?.addEventListener('click', () => closeMenu());
document.addEventListener('keydown', event => {
  if (menuToggle?.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
  if (event.key !== 'Tab') return;
  const focusable = [menuToggle, ...sidebar.querySelectorAll('a[href], button:not([disabled])')]
    .filter(element => element.getClientRects().length > 0);
  if (!focusable.length) return;
  event.preventDefault();
  const current = focusable.indexOf(document.activeElement);
  const next = (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
  focusable[next].focus();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu({ restoreFocus: false });
});

function updatePageTitle(page) {
  const title = page?.dataset[language === 'en' ? 'titleEn' : 'titleKo'] ?? say('페이지를 찾을 수 없어요', 'Page not found');
  document.title = `${title} · Sogang Student Collective`;
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = title;
  const path = document.getElementById('hud-path');
  if (path) path.textContent = `sogang / ${currentRoute}`;
}
function renderRoute({ focus = true } = {}) {
  let route = 'home';
  try { route = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'home'; } catch { route = 'not-found'; }
  // 본문 건너뛰기 같은 일반 문서 앵커는 현재 화면을 바꾸지 않습니다.
  if (location.hash && !location.hash.startsWith('#/')) return;
  currentRoute = route;
  const activePage = pageByRoute.get(route);
  const missingPage = document.getElementById('page-not-found');
  for (const page of pages) page.hidden = page !== activePage;
  if (missingPage) missingPage.hidden = Boolean(activePage);
  for (const link of document.querySelectorAll('[data-route]')) {
    const selected = link.dataset.route === route;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  closeMenu({ restoreFocus: false });
  updatePageTitle(activePage);
  if (!activePage && !missingPage) {
    const home = pageByRoute.get('home');
    if (home) home.hidden = false;
    announce(say('페이지를 찾지 못했어요. 홈에서 다시 선택해 주세요.', 'Page not found. Please choose a page from Home.'));
  }
  if (focus) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = (activePage ?? missingPage ?? pageByRoute.get('home'))?.querySelector('h1');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }
}
window.addEventListener('hashchange', () => renderRoute());
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if (link.hasAttribute('data-route')) {
    if (link.hash === location.hash) { event.preventDefault(); renderRoute(); }
    return;
  }
  const href = link.getAttribute('href');
  if (!href.startsWith('#') || href.startsWith('#/')) return;
  let target;
  try { target = document.getElementById(decodeURIComponent(href.slice(1))); } catch { return; }
  if (!target || target.closest('.page[hidden]')) return;
  // 건너뛰기 링크는 현재 경로를 유지해 뒤로 가기가 다른 페이지로 돌아가지 않게 합니다.
  event.preventDefault();
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
});

const clockFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
function updateTime() {
  const now = Date.now();
  const clock = document.getElementById('kst-clock');
  if (clock) clock.textContent = clockFormatter.format(now);
  for (const element of document.querySelectorAll('[data-event-state]')) {
    const event = eventById.get(element.dataset.eventState);
    if (!event) continue;
    const state = eventState(event, now);
    element.dataset.state = state;
    element.textContent = state === 'upcoming' ? say('다가오는 활동', 'Upcoming') : state === 'live' ? say('진행 중', 'Live now') : say('지난 활동', 'Past event');
  }
  for (const element of document.querySelectorAll('[data-event-cta]')) {
    const event = eventById.get(element.dataset.eventCta);
    if (!event) continue;
    const state = eventState(event, now);
    const label = element.querySelector('[data-event-cta-label]') ?? element;
    label.textContent = state === 'upcoming' ? say('Luma에서 신청하기', 'Register on Luma') : state === 'live' ? say('Luma 행사 안내', 'Event on Luma') : say('지난 행사 보기', 'View past event');
  }
  if (!workshop) return;
  const remaining = countdown(workshop, now);
  const hasDays = Boolean(document.querySelector('[data-countdown="days"]'));
  for (const element of document.querySelectorAll('[data-countdown]')) {
    const unit = element.dataset.countdown;
    const value = unit === 'hours' && !hasDays ? remaining.days * 24 + remaining.hours : remaining[unit];
    if (typeof value === 'number') element.textContent = String(value).padStart(2, '0');
  }
  const label = document.getElementById('countdown-label');
  if (label) label.textContent = remaining.state === 'upcoming' ? say('워크숍 시작까지', 'Until the workshop') : remaining.state === 'live' ? say('워크숍 종료까지', 'Until the workshop ends') : say('워크숍이 종료되었어요', 'Workshop completed');
  const hud = document.getElementById('hud-countdown');
  if (hud) hud.textContent = remaining.state === 'ended'
    ? say('종료', 'ENDED')
    : `${remaining.state === 'live' ? 'LIVE · ' : ''}${String(remaining.days * 24 + remaining.hours).padStart(2, '0')}:${String(remaining.minutes).padStart(2, '0')}:${String(remaining.seconds).padStart(2, '0')}`;
}

const missionChecks = [...document.querySelectorAll('[data-mission-check]')];
let savedMissions = {};
try { savedMissions = JSON.parse(storage.get('sogang-missions-v1') ?? '{}') ?? {}; } catch {}
for (const checkbox of missionChecks) checkbox.checked = savedMissions[checkbox.dataset.missionCheck] === true;
function updateProgress() {
  const completed = missionChecks.filter(checkbox => checkbox.checked).length;
  const progress = document.getElementById('mission-progress');
  if (progress) progress.textContent = `${completed} / ${missionChecks.length}`;
  const bar = document.getElementById('mission-progress-bar');
  if (bar) {
    bar.max = missionChecks.length;
    bar.value = completed;
    bar.setAttribute('aria-label', say(`미션 ${missionChecks.length}개 중 ${completed}개 완료`, `${completed} of ${missionChecks.length} missions completed`));
  }
}
for (const checkbox of missionChecks) checkbox.addEventListener('change', () => {
  const value = Object.fromEntries(missionChecks.map(input => [input.dataset.missionCheck, input.checked]));
  updateProgress();
  if (!storage.set('sogang-missions-v1', JSON.stringify(value))) {
    announce(say('이 브라우저에서 저장할 수 없어 체크는 현재 화면에만 반영됩니다.', 'Storage is unavailable. Your checks will last for this page visit only.'));
  }
});

// 원본 포털의 클립보드 실패 시 직접 선택하는 동작을 유지합니다.
function selectText(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  if (selection) { selection.removeAllRanges(); selection.addRange(range); }
}
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy]');
  const target = button && document.getElementById(button.dataset.copy);
  if (!target) return;
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(target.textContent); copied = true; }
  } catch {}
  if (!copied) {
    try { selectText(target); copied = document.execCommand('copy'); } catch {}
  }
  if (copied) announce(say('요청문을 복사했어요. 내 아이디어에 맞게 바꿔 붙여 넣어 주세요.', 'Prompt copied. Adapt it to your idea before pasting.'));
  else { selectText(target); announce(say('글을 선택했어요. Ctrl+C(⌘C) 또는 길게 눌러 복사해 주세요.', 'Text selected. Press Ctrl+C (⌘C), or long-press to copy.')); }
});

const commitButton = document.getElementById('load-commits');
const commitList = document.getElementById('commit-log');
let commitState = 'idle';
let commits = [];
function renderCommits() {
  if (!commitList) return;
  commitList.replaceChildren();
  const message = {
    idle: say('GitHub에서 실제 변경 이력을 불러올 수 있어요.', 'Load the actual change history from GitHub.'),
    loading: say('GitHub 변경 이력을 불러오는 중…', 'Loading GitHub history…'),
    empty: say('이 브랜치의 서강대 변경 이력이 아직 없어요.', 'No Sogang changes were found on this branch.'),
    error: say('변경 이력을 불러오지 못했어요. 잠시 후 다시 시도하거나 GitHub 기록을 확인해 주세요.', 'Could not load history. Try again later or open the history on GitHub.'),
  }[commitState];
  if (message) {
    const item = document.createElement('li');
    item.className = 'commit-state';
    item.textContent = message;
    commitList.append(item);
  } else {
    for (const commit of commits) {
      const item = document.createElement('li');
      item.className = 'commit-row';
      const link = document.createElement('a');
      link.href = commit.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const hash = document.createElement('code');
      hash.textContent = commit.sha.slice(0, 7);
      const title = document.createElement('span');
      title.textContent = commit.message;
      link.append(hash, title);
      const time = document.createElement('time');
      time.dateTime = commit.date;
      time.textContent = new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'ko-KR', {
        timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      }).format(new Date(commit.date)) + ' KST';
      item.append(link, time);
      commitList.append(item);
    }
  }
  commitList.setAttribute('aria-busy', String(commitState === 'loading'));
  const status = document.getElementById('commit-status');
  if (status) status.textContent = message ?? say(`${commits.length}개의 실제 변경 이력`, `${commits.length} commits loaded from GitHub`);
  if (commitButton) {
    commitButton.disabled = commitState === 'loading';
    const label = commitButton.querySelector('[data-commit-label]') ?? commitButton;
    label.textContent = commitState === 'loading' ? say('불러오는 중…', 'Loading…') : say('변경 이력 불러오기', 'Load change history');
  }
}
commitButton?.addEventListener('click', async () => {
  if (commitState === 'loading') return;
  commitState = 'loading';
  renderCommits();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const query = new URLSearchParams({ sha: siteData.branch || 'codex/sogang-student-collective', path: 'sogang', per_page: '5' });
    const response = await fetch(`https://api.github.com/repos/mthogeon0731/openAI_WS/commits?${query}`, {
      headers: { Accept: 'application/vnd.github+json' }, credentials: 'omit', cache: 'no-store', signal: controller.signal,
    });
    if (!response.ok) throw new Error('GitHub history unavailable');
    const result = await response.json();
    if (!Array.isArray(result)) throw new Error('Invalid commit response');
    commits = result.filter(commit => /^[a-f0-9]{40}$/.test(commit.sha) &&
      commit.html_url === `https://github.com/mthogeon0731/openAI_WS/commit/${commit.sha}` &&
      typeof commit.commit?.message === 'string' && Number.isFinite(Date.parse(commit.commit?.committer?.date)))
      .map(commit => ({ sha: commit.sha, url: commit.html_url, message: commit.commit.message.split('\n')[0], date: commit.commit.committer.date }));
    commitState = commits.length ? 'loaded' : 'empty';
  } catch { commitState = 'error'; }
  finally { clearTimeout(timeout); renderCommits(); }
});

function setLanguage(nextLanguage, { persist = true } = {}) {
  language = nextLanguage === 'en' ? 'en' : 'ko';
  document.documentElement.lang = language;
  for (const element of document.querySelectorAll('[data-ko][data-en]')) {
    if (element.children.length || element.hasAttribute('data-i18n') || element.matches('[data-event-state],[data-event-cta],[data-countdown]')) continue;
    element.textContent = element.dataset[language];
  }
  for (const button of document.querySelectorAll('[data-lang]')) {
    const active = button.dataset.lang === language;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('active', active);
  }
  if (menuToggle) menuToggle.setAttribute('aria-label', say('메뉴 열기 또는 닫기', 'Open or close navigation'));
  if (persist) storage.set('sogang-language', language);
  updatePageTitle(pageByRoute.get(currentRoute));
  updateTime();
  updateProgress();
  renderCommits();
}
for (const button of document.querySelectorAll('[data-lang]')) button.addEventListener('click', () => setLanguage(button.dataset.lang));

renderRoute({ focus: false });
setLanguage(language, { persist: false });
setInterval(updateTime, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateTime(); });
