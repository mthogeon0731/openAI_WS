import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { buildSite, dist } from '../scripts/build.mjs';
import { createPreviewServer } from '../scripts/serve.mjs';
import { esc, h } from '../src/render.mjs';
import { events } from '../src/content.mjs';
import { renderPage } from '../src/page.mjs';

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

test('한국어 문서, 검색 설명, 모바일 viewport가 생성된다', () => {
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /<title>[^<]*(?:서강|Sogang)[^<]*<\/title>/i);
  assert.match(html, /<meta[^>]*name="description"[^>]*content="[^"]+"/i);
  assert.match(html, /<meta[^>]*name="viewport"/i);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
});

test('지역 링크와 자산이 존재하며 페이지 내 링크가 실제 대상으로 이어진다', async () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'HTML id는 중복되지 않아야 합니다.');
  for (const [, attribute, value] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    assert.ok(value && value !== '#', `빈 ${attribute} 링크를 제거해 주세요.`);
    if (/^(?:https?:|mailto:|data:|tel:)/.test(value)) continue;
    const url = new URL(value, `${origin}/`);
    if (url.pathname === '/' && url.hash) assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `대상이 없는 링크: ${value}`);
    const local = path.join(dist, decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
    assert.ok((await stat(local)).isFile(), `자산 또는 페이지가 없음: ${value}`);
  }
});

test('서강대 페이지에 서울대 전용 인증·신청 연결이 유입되지 않는다', () => {
  assert.doesNotMatch(html, /@snu\.ac\.kr|pqDgx8Pi|kY3fXMRaXhv7NWwv6|\/api\/auth\/|snu[^"\s]*\/api\//i);
  assert.doesNotMatch(html, /href="(?:\/learn\/|\/admin\/|\/manage\/)/i);
  assert.doesNotMatch(html, /openai\.collective_sogang/i);
});

test('확정 행사 날짜·요일·시각 표시와 Luma 링크가 실제 콘텐츠와 일치한다', () => {
  const urls = new Set();
  for (const event of events) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    assert.ok(Number.isFinite(start.getTime()) && end > start, `행사 시각 확인: ${event.title}`);
    assert.match(event.start, /\+09:00$/);
    assert.match(event.end, /\+09:00$/);
    assert.equal(event.date, event.start.slice(0, 10).replaceAll('-', '.'));
    assert.equal(event.time, `${event.start.slice(11, 16)}–${event.end.slice(11, 16)}`);
    assert.equal(event.day, event.start.slice(8, 10));
    assert.equal(event.month, new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'Asia/Seoul' }).format(start).toUpperCase());
    assert.equal(event.weekday, new Intl.DateTimeFormat('ko-KR', { weekday: 'long', timeZone: 'Asia/Seoul' }).format(start));
    assert.equal(new URL(event.url).origin, 'https://luma.com');
    assert.ok(!urls.has(event.url), '행사 링크가 중복되지 않아야 합니다.');
    urls.add(event.url);
    assert.ok(html.includes(`href="${event.url}"`), `화면에서 빠진 행사 링크: ${event.url}`);
    assert.ok(html.includes(`data-event-start="${event.start}"`));
    assert.ok(html.includes(`data-event-end="${event.end}"`));
    assert.ok(event.place.trim(), '장소 안내가 필요합니다.');
  }
});

test('행사 시작·종료 경계에서 안내 상태가 바뀐다', t => {
  for (const event of events) {
    for (const [now, expected] of [
      [Date.parse(event.start) - 1, '다가오는 활동'],
      [Date.parse(event.start), '진행 중'],
      [Date.parse(event.end) - 1, '진행 중'],
      [Date.parse(event.end), '지난 활동']
    ]) {
      const clock = t.mock.method(Date, 'now', () => now);
      const card = String(renderPage()).split(`data-event-start="${event.start}"`)[1]?.split('</article>')[0];
      clock.mock.restore();
      assert.ok(card?.includes(`data-event-status>${expected}</span>`), `${event.title}: ${new Date(now).toISOString()} 상태 확인`);
    }
  }
});

test('재사용 HTML 템플릿은 사용자 문구를 실행 가능한 마크업으로 삽입하지 않는다', () => {
  const text = '<img src=x onerror="alert(1)"> & \'quoted\'';
  assert.equal(esc(text), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;quoted&#39;');
  assert.equal(String(h`<p>${text}</p>`), `<p>${esc(text)}</p>`);
});

test('미리보기 서버는 HTML·404·HEAD를 처리하고 프로젝트 밖 파일을 차단한다', async () => {
  const home = await fetch(origin);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.equal(await home.text(), html);
  const head = await fetch(origin, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(`${origin}/missing-page`)).status, 404);
  assert.equal((await fetch(`${origin}/..%2fpackage.json`)).status, 403);
  assert.equal((await fetch(`${origin}/%E0%A4%A`)).status, 400);
  assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
});
