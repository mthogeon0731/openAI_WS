// 브라우저와 정적 빌드가 같은 행사 경계를 사용합니다. 시각은 시간대가 포함된 ISO 또는 epoch ms입니다.
function epoch(value, label) {
  if (value == null || value === '' || typeof value === 'boolean') throw new TypeError(`${label}: 올바른 시각이 필요합니다.`);
  const result = typeof value === 'number' ? value : new Date(value).getTime();
  if (!Number.isFinite(result)) throw new TypeError(`${label}: 올바른 시각이 필요합니다.`);
  return result;
}

function interval(event, now) {
  const start = epoch(event?.start, '행사 시작');
  const end = epoch(event?.end, '행사 종료');
  if (end <= start) throw new RangeError('행사 종료는 시작보다 늦어야 합니다.');
  const current = epoch(now, '현재 시각');
  return { start, end, current, state: current < start ? 'upcoming' : current < end ? 'live' : 'ended' };
}

export function eventState(event, now = Date.now()) {
  return interval(event, now).state;
}

export function countdown(event, now = Date.now()) {
  const { start, end, current, state } = interval(event, now);
  const totalSeconds = state === 'ended' ? 0 : Math.max(0, Math.ceil(((state === 'upcoming' ? start : end) - current) / 1000));
  return {
    state,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds % 86400 / 3600),
    minutes: Math.floor(totalSeconds % 3600 / 60),
    seconds: totalSeconds % 60,
    totalSeconds
  };
}

// portal/src/calendar.mjs의 UTC 변환·RFC 5545 텍스트 escape·UTF-8 줄 접기를 재사용합니다.
const utcStamp = value => new Date(epoch(value, '캘린더 시각')).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = value => String(value ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r\n|\r|\n/g, '\\n');
const bytes = text => new TextEncoder().encode(text).length;

function fold(line) {
  const lines = [];
  let current = '';
  for (const character of line) {
    if (bytes(current + character) > 75) { lines.push(current); current = ' '; }
    current += character;
  }
  return [...lines, current].join('\r\n');
}

function eventUrl(event) {
  const url = new URL(event.url);
  if (url.protocol !== 'https:') throw new TypeError('행사 안내 주소는 HTTPS여야 합니다.');
  return url.href;
}

const location = event => event.place ? `서강대학교 ${event.place.replace(/^서강대학교\s*/, '')}` : '서강대학교 정하상관';

export function eventIcs(event, now = Date.now()) {
  interval(event, now);
  const url = eventUrl(event);
  const uid = `${encodeURIComponent(url)}@sogang-student-collective`;
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//OpenAI Student Collective Sogang//Events//KO',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT', `UID:${uid}`,
    `DTSTAMP:${utcStamp(now)}`, `DTSTART:${utcStamp(event.start)}`, `DTEND:${utcStamp(event.end)}`,
    `SUMMARY:${icsText(event.title)}`, `LOCATION:${icsText(location(event))}`,
    `DESCRIPTION:${icsText([event.description, url].filter(Boolean).join('\n'))}`, `URL:${url}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].map(fold).join('\r\n') + '\r\n';
}

export function googleCalendarUrl(event) {
  interval(event, Date.now());
  const params = new URLSearchParams({
    action: 'TEMPLATE', text: event.title,
    dates: `${utcStamp(event.start)}/${utcStamp(event.end)}`,
    details: [event.description, eventUrl(event)].filter(Boolean).join('\n'),
    location: location(event), ctz: 'Asia/Seoul'
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// 호실은 행사 안내에서 확인하고, 지도는 실제 건물 이름으로 검색합니다.
export function mapLinks() {
  const query = encodeURIComponent('서강대학교 정하상관');
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${query}`,
    naver: `https://map.naver.com/p/search/${query}`,
    kakao: `https://map.kakao.com/link/search/${query}`
  };
}
