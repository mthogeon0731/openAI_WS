import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildSite, dist } from './build.mjs';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.zip': 'application/zip',
  '.ics': 'text/calendar; charset=utf-8'
};

export function createPreviewServer() {
  return createServer(async (req, res) => {
    const end = (status, body = '', type = 'text/plain; charset=utf-8') => {
      res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); end(405); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { end(400, '주소를 확인해 주세요.'); return; }
    if (pathname.includes('\0') || pathname.includes('\\')) { end(400); return; }
    let target = path.resolve(dist, `.${pathname}`);
    if (target !== dist && !target.startsWith(`${dist}${path.sep}`)) { end(403); return; }
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      end(200, await readFile(target), types[path.extname(target)] ?? 'application/octet-stream');
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') { end(500, '파일을 불러오지 못했습니다.'); return; }
      try { end(404, await readFile(path.join(dist, '404.html')), types['.html']); }
      catch { end(404, '페이지를 찾을 수 없습니다.'); }
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await buildSite();
  const port = Number(process.env.PORT ?? 5176);
  const server = createPreviewServer();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `${port} 포트가 사용 중입니다. PORT를 바꾸거나 기존 서버를 종료해 주세요.` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`서강대 사이트 미리보기: http://localhost:${server.address().port}/ (수정 후 서버를 다시 시작하세요)`));
}
