import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderPage } from '../src/page.mjs';
import { events } from '../src/content.mjs';
import { eventIcs } from '../src/time.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
export const dist = path.resolve(root, 'dist');

export async function buildSite() {
  const html = String(renderPage());
  if (!/<html\b/i.test(html) || !/<title>[^<]+<\/title>/i.test(html)) {
    throw new Error('페이지 제목과 HTML 문서를 확인해 주세요.');
  }
  const calendars = events.map(event => {
    if (!/^\d{2}$/.test(event.id)) throw new Error('행사 id는 01, 02 같은 두 자리 숫자로 입력해 주세요.');
    return { file: `workshop-${event.id}.ics`, content: eventIcs(event) };
  });
  // 삭제 범위는 이 프로젝트의 생성물 폴더로만 제한합니다.
  if (path.dirname(dist) !== path.resolve(root) || path.basename(dist) !== 'dist') {
    throw new Error('빌드 출력 경로가 올바르지 않습니다.');
  }
  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, 'assets'), { recursive: true });
  await cp(path.join(root, 'public'), dist, { recursive: true });
  await Promise.all([
    cp(path.join(root, 'src/styles.css'), path.join(dist, 'assets/styles.css')),
    cp(path.join(root, 'src/main.js'), path.join(dist, 'assets/main.js')),
    cp(path.join(root, 'src/time.mjs'), path.join(dist, 'assets/time.mjs')),
    ...calendars.map(calendar => writeFile(path.join(dist, 'assets', calendar.file), calendar.content, 'utf8')),
    writeFile(path.join(dist, 'index.html'), html, 'utf8'),
    writeFile(path.join(dist, '404.html'), `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>페이지를 찾을 수 없어요 · Sogang Student Collective</title><meta name="robots" content="noindex"><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f5f0;color:#222;font:18px/1.7 system-ui,sans-serif}main{max-width:36rem;padding:2rem}a{color:#51258f}h1{font-size:2rem;line-height:1.4}</style></head><body><main><p>SOGANG STUDENT COLLECTIVE</p><h1>페이지를 찾을 수 없어요.</h1><p>주소가 바뀌었거나 존재하지 않는 페이지입니다.</p><a href="/">홈으로 돌아가기 →</a></main></body></html>`, 'utf8')
  ]);
  return dist;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(`서강대 사이트 빌드 완료: ${await buildSite()}`);
}
