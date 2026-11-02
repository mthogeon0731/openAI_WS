// 요청문 복사와 실패 시 선택은 원본 portal/src/main.js의 동작을 재사용합니다.
function selectText(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
function legacyCopy(element) {
  try { selectText(element); return document.execCommand('copy'); }
  catch { return false; }
}
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy-target]');
  if (!button) return;
  const block = button.closest('.copy-block');
  const target = block?.querySelector('pre');
  const status = block?.querySelector('.copy-status');
  if (!target || !status) return;
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(target.textContent);
      copied = true;
    }
  } catch { copied = false; }
  if (!copied) copied = legacyCopy(target);
  status.classList.toggle('is-ok', copied);
  status.classList.toggle('is-error', !copied);
  if (copied) {
    status.textContent = '복사했어요. 아이디어를 바꿔 Codex에 붙여 넣어 주세요.';
    button.textContent = '복사 완료';
    setTimeout(() => { button.textContent = '복사'; }, 2000);
  } else {
    selectText(target);
    status.textContent = '글을 선택했어요. Ctrl+C(⌘C)를 누르거나 길게 눌러 복사해 주세요.';
  }
});
for (const button of document.querySelectorAll('[data-copy-target]')) button.hidden = false;

// 원본 collective/public/assets/site.js의 모바일 메뉴 키보드 동작.
for (const menu of document.querySelectorAll('details.mobile-menu')) {
  menu.addEventListener('click', event => { if (event.target.closest('a')) menu.open = false; });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
}

const resourceTools = document.querySelector('.resource-tools');
if (resourceTools) {
  resourceTools.hidden = false;
  const buttons = [...resourceTools.querySelectorAll('[data-filter]')];
  const search = resourceTools.querySelector('input[type="search"]');
  const cards = [...document.querySelectorAll('.resource-card')];
  const status = document.querySelector('.search-status');
  let category = 'all';
  function filter() {
    const query = search.value.trim().toLocaleLowerCase('ko');
    let count = 0;
    for (const card of cards) {
      const match = (category === 'all' || card.dataset.category === category) && card.textContent.toLocaleLowerCase('ko').includes(query);
      card.hidden = !match;
      if (match) count++;
    }
    status.textContent = `${count}개의 자료`;
    document.querySelector('.search-empty').hidden = count > 0;
  }
  for (const button of buttons) button.addEventListener('click', () => {
    category = button.dataset.filter;
    for (const option of buttons) {
      option.setAttribute('aria-pressed', String(option === button));
      option.classList.toggle('active', option === button);
    }
    filter();
  });
  search.addEventListener('input', filter);
}

const checks = [...document.querySelectorAll('input[name="preparation"]')];
function updateChecks() {
  const count = checks.filter(input => input.checked).length;
  document.querySelector('.check-count').textContent = `${count} / ${checks.length}${count === checks.length ? ' · 준비 완료!' : ''}`;
}
for (const checkbox of checks) checkbox.addEventListener('change', updateChecks);
if (checks.length) updateChecks();

// 배포 후에도 실제 행사 종료 시각에 맞춰 상태를 갱신합니다.
function updateEvents() {
  const now = Date.now();
  for (const card of document.querySelectorAll('[data-event-start]')) {
    const ended = now >= Date.parse(card.dataset.eventEnd);
    const started = now >= Date.parse(card.dataset.eventStart);
    card.classList.toggle('is-ended', ended);
    card.querySelector('[data-event-status]').textContent = ended ? '지난 활동' : started ? '진행 중' : '다가오는 활동';
    const note = card.querySelector('[data-event-note]');
    note.textContent = ended ? '종료된 행사 · 기록 보기' : note.dataset.upcomingNote;
  }
}
updateEvents();
setInterval(updateEvents, 60000);
