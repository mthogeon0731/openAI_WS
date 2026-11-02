import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { buildSite, dist } from '../scripts/build.mjs';
import { createPreviewServer } from '../scripts/serve.mjs';
import { esc, h } from '../src/render.mjs';
import { events } from '../src/content.mjs';
import { eventState, countdown, eventIcs, googleCalendarUrl, mapLinks } from '../src/time.mjs';

const expectedRoutes = ['home', 'roadmap', 'workshops/02', 'learn', 'studio', 'recap', 'about', 'admin'];
let html;
let server;
let origin;
before(async () => {
  await buildSite();
  html = await readFile(path.join(dist, 'index.html'), 'utf8');
  server = createPreviewServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { if (server) await new Promise(resolve => server.close(resolve)); });

const localFile = pathname => path.join(dist, decodeURIComponent(pathname), pathname.endsWith('/') ? 'index.html' : '');

test('한국어 기본 문서와 8개 해시 경로, 경로별 번역 제목이 생성된다', () => {
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /<title>[^<]*(?:서강|Sogang)[^<]*<\/title>/i);
  assert.match(html, /<meta[^>]*name="description"[^>]*content="[^"]+"/i);
  assert.match(html, /<meta[^>]*name="viewport"/i);
  const pages = [...html.matchAll(/<section\b([^>]*\bdata-page="([^"]+)"[^>]*)>/g)];
  assert.deepEqual(pages.map(match => match[2]).sort(), [...expectedRoutes].sort());
  for (const [, attributes, route] of pages) {
    assert.match(attributes, /data-title-ko="[^"]+"/);
    assert.match(attributes, /data-title-en="[^"]+"/);
    assert.equal(/\bhidden\b/.test(attributes), route !== 'home', `${route}의 초기 표시 상태`);
  }
  assert.match(html, /<section[^>]*id="page-not-found"[^>]*hidden/);
  assert.match(html, /<script[^>]*type="module"[^>]*src="\/assets\/main\.js"/);
});

test('내부 경로·앵커·이미지·캘린더·폰트 파일이 실제 대상으로 이어진다', async () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'HTML id는 중복되지 않아야 합니다.');
  const cssFiles = new Set();
  for (const [, attribute, value] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    assert.ok(value && value !== '#', `빈 ${attribute} 링크를 제거해 주세요.`);
    if (/^(?:https?:|mailto:|data:|tel:)/.test(value)) continue;
    const url = new URL(value, `${origin}/`);
    if (url.hash.startsWith('#/')) {
      assert.ok(expectedRoutes.includes(decodeURIComponent(url.hash.slice(2))), `없는 화면 경로: ${value}`);
    } else if (url.pathname === '/' && url.hash) {
      assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `대상이 없는 앵커: ${value}`);
    }
    assert.ok((await stat(localFile(url.pathname))).isFile(), `자산 또는 페이지가 없음: ${value}`);
    if (url.pathname.endsWith('.css')) cssFiles.add(url.pathname);
  }
  for (const file of cssFiles) {
    const css = await readFile(localFile(file), 'utf8');
    for (const [, value] of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      if (/^(?:https?:|data:)/.test(value)) continue;
      const url = new URL(value, `${origin}${file}`);
      assert.ok((await stat(localFile(url.pathname))).isFile(), `CSS 자산이 없음: ${value}`);
    }
  }
});

test('브라우저 이벤트·미션·복사 컨트롤이 올바른 데이터와 연결된다', () => {
  const dataText = html.match(/<script\b[^>]*id="site-data"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  const data = JSON.parse(dataText);
  assert.deepEqual(data.events.map(event => event.id).sort(), ['01', '02']);
  for (const [, id] of html.matchAll(/data-event-(?:state|cta)="([^"]+)"/g)) {
    assert.ok(data.events.some(event => event.id === id), `행사 정보가 없는 컨트롤: ${id}`);
  }
  for (const [, unit] of html.matchAll(/data-countdown="([^"]+)"/g)) assert.ok(['days', 'hours', 'minutes', 'seconds'].includes(unit));
  assert.match(html, /<progress\b[^>]*id="mission-progress-bar"[^>]*max="3"/);
  const missionIds = [...html.matchAll(/data-mission-check="([^"]+)"/g)].map(match => match[1]);
  assert.equal(missionIds.length, 3);
  assert.equal(new Set(missionIds).size, missionIds.length);
  for (const [, id] of html.matchAll(/data-copy="([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`));
  assert.match(html, /id="menu-toggle"[^>]*aria-controls="sidebar"[^>]*aria-expanded="false"/);
  assert.match(html, /id="toast"[^>]*role="status"[^>]*aria-live="polite"/);
});

test('서강대 콘텐츠에 서울대 전용 인증·연락처나 이전 소셜 계정이 유입되지 않는다', () => {
  assert.doesNotMatch(html, /@snu\.ac\.kr|pqDgx8Pi|kY3fXMRaXhv7NWwv6|\/api\/auth\/|snu[^"\s]*\/api\//i);
  assert.doesNotMatch(html, /openai\.collective_sogang/i);
  assert.doesNotMatch(html, /href="(?:\/learn\/|\/admin\/|\/manage\/)/i);
});

test('행사 상태는 시작과 종료의 정확한 경계에서 전환된다', () => {
  for (const event of events) {
    const start = Date.parse(event.start);
    const end = Date.parse(event.end);
    assert.ok(end > start);
    assert.match(event.start, /\+09:00$/);
    assert.match(event.end, /\+09:00$/);
    assert.equal(eventState(event, start - 1), 'upcoming');
    assert.equal(eventState(event, start), 'live');
    assert.equal(eventState(event, end - 1), 'live');
    assert.equal(eventState(event, end), 'ended');
    assert.equal(eventState(event, end + 1), 'ended');
  }
});

test('카운트다운은 시작 전에는 시작까지, 진행 중에는 종료까지 계산하며 음수가 되지 않는다', () => {
  const event = events.find(item => item.id === '02');
  const start = Date.parse(event.start);
  const end = Date.parse(event.end);
  const duration = (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;
  assert.deepEqual(countdown(event, start - duration), { state: 'upcoming', days: 2, hours: 3, minutes: 4, seconds: 5, totalSeconds: duration / 1000 });
  assert.equal(countdown(event, start - 1).totalSeconds, 1);
  assert.deepEqual(countdown(event, start), { state: 'live', days: 0, hours: 1, minutes: 0, seconds: 0, totalSeconds: 3600 });
  assert.equal(countdown(event, end - 1).totalSeconds, 1);
  assert.deepEqual(countdown(event, end + 60000), { state: 'ended', days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
  assert.throws(() => eventState({ ...event, start: null }, start), TypeError);
  assert.throws(() => eventState({ ...event, end: event.start }, start), RangeError);
  assert.throws(() => countdown(event, NaN), TypeError);
});

test('ICS 다운로드는 KST를 UTC로 변환하며 한글·개행·긴 줄을 손상시키지 않는다', async () => {
  for (const event of events) {
    const ics = await readFile(path.join(dist, 'assets', `workshop-${event.id}.ics`), 'utf8');
    assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
    assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
    assert.equal(ics.replaceAll('\r\n', '').includes('\n'), false);
    for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75);
    const unfolded = ics.replace(/\r\n[ \t]/g, '');
    const stamp = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    assert.ok(unfolded.includes(`DTSTART:${stamp(event.start)}\r\n`));
    assert.ok(unfolded.includes(`DTEND:${stamp(event.end)}\r\n`));
    assert.ok(unfolded.includes(`URL:${event.url}\r\n`));
  }
  const event = { ...events[0], title: '테스트, 제목; 역슬래시\\\n다음 줄', description: '한글과 emoji 🙂 '.repeat(60) };
  const first = eventIcs(event, '2026-11-01T00:00:00Z');
  const second = eventIcs(event, '2026-11-02T00:00:00Z');
  const unfolded = first.replace(/\r\n[ \t]/g, '');
  assert.ok(unfolded.includes('SUMMARY:테스트\\, 제목\\; 역슬래시\\\\\\n다음 줄\r\n'));
  assert.ok(unfolded.includes(event.description));
  assert.equal(first.match(/UID:[^\r]+/)[0], second.match(/UID:[^\r]+/)[0]);
  for (const line of first.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75);
  assert.equal((unfolded.match(/BEGIN:VEVENT/g) ?? []).length, 1);
});

test('Google Calendar와 지도는 실제 행사 시간과 정하상관을 가리킨다', () => {
  const event = events.find(item => item.id === '02');
  const calendar = new URL(googleCalendarUrl(event));
  assert.equal(calendar.origin, 'https://calendar.google.com');
  assert.equal(calendar.searchParams.get('dates'), '20261102T090000Z/20261102T100000Z');
  assert.equal(calendar.searchParams.get('ctz'), 'Asia/Seoul');
  assert.equal(calendar.searchParams.get('text'), event.title);
  assert.ok(calendar.searchParams.get('location').includes(event.place));
  for (const url of Object.values(mapLinks())) {
    assert.equal(new URL(url).protocol, 'https:');
    assert.ok(decodeURIComponent(url).includes('서강대학교 정하상관'));
  }
});

test('HTML 템플릿은 사용자 문구를 실행 가능한 마크업으로 삽입하지 않는다', () => {
  const text = '<img src=x onerror="alert(1)"> & \'quoted\'';
  assert.equal(esc(text), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;quoted&#39;');
  assert.equal(String(h`<p>${text}</p>`), `<p>${esc(text)}</p>`);
});

test('서버는 ES module·ICS MIME과 오류를 처리하고 프로젝트 밖 파일을 차단한다', async () => {
  const home = await fetch(origin);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.equal(await home.text(), html);
  const module = await fetch(`${origin}/assets/time.mjs`);
  assert.equal(module.status, 200);
  assert.match(module.headers.get('content-type'), /text\/javascript/);
  const calendar = await fetch(`${origin}/assets/workshop-02.ics`);
  assert.equal(calendar.status, 200);
  assert.match(calendar.headers.get('content-type'), /text\/calendar/);
  const head = await fetch(origin, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(`${origin}/missing-page`)).status, 404);
  assert.equal((await fetch(`${origin}/..%2fpackage.json`)).status, 403);
  assert.equal((await fetch(`${origin}/%E0%A4%A`)).status, 400);
  assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
});
