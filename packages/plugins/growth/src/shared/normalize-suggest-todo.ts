const PERIOD =
  '凌晨|清晨|早上|早晨|上午|中午|下午|午后|傍晚|晚上|夜里|夜晚|晚间|半夜|午夜';
const NUM = String.raw`\d{1,2}|[零〇一二两三四五六七八九十]{1,3}`;
const TIME_RE = new RegExp(
  `(?:(${PERIOD}))?\\s*(${NUM})\\s*(?:[:：]|点|时)\\s*(半|(?:(${NUM})\\s*分?))?`,
  'g',
);
const DATE_RE = /(?:\d{4}年)?\d{1,2}月\d{1,2}日|\d{4}-\d{2}-\d{2}/g;
const SPOKEN_DATE_RE = /(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日|(\d{4})-(\d{2})-(\d{2})/g;
const SCAFFOLD_RE = /请?提醒我?|记得(?:要)?|帮我/g;
const CN_DIGIT: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

export type SuggestTodoPayload = {
  title: string;
  planned?: string;
  plannedTime?: string;
  note?: string;
};

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function parseSpokenNumber(raw: string): number | undefined {
  if (/^\d+$/.test(raw)) return Number(raw);
  if (raw === '十') return 10;
  if (raw.startsWith('十')) {
    const ones = CN_DIGIT[raw.slice(1)];
    return ones == null ? undefined : 10 + ones;
  }
  if (raw.includes('十')) {
    const [tens, ones = ''] = raw.split('十');
    const t = CN_DIGIT[tens];
    if (t == null) return undefined;
    if (!ones) return t * 10;
    const o = CN_DIGIT[ones];
    return o == null ? undefined : t * 10 + o;
  }
  return CN_DIGIT[raw];
}

function formatHm(hour: number, minute: number): string | undefined {
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return undefined;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return undefined;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function applyPeriod(hour: number, period?: string): number {
  if (!period) return hour;
  if (/中午/.test(period)) return hour === 12 ? 12 : hour < 12 ? hour + 12 : hour;
  if (/半夜|午夜/.test(period)) return hour === 12 ? 0 : hour;
  if (/下午|午后|傍晚|晚上|夜里|夜晚|晚间/.test(period)) {
    if (hour === 12) return 12;
    return hour < 12 ? hour + 12 : hour;
  }
  if (/凌晨|清晨|早上|早晨|上午/.test(period) && hour === 12) return 0;
  return hour;
}

function toClock(value?: string): string | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) return undefined;
  return formatHm(Number(match[1]), Number(match[2]));
}

export function extractSpokenPlanTime(text?: string): string | undefined {
  if (!text) return undefined;
  const clock = toClock(text.trim());
  if (clock) return clock;
  let last: string | undefined;
  const re = new RegExp(TIME_RE.source, 'g');
  for (const match of text.matchAll(re)) {
    const hour = parseSpokenNumber(match[2] || '');
    if (hour == null) continue;
    const minuteToken = (match[4] || match[3] || '').replace(/分$/, '');
    const minute = minuteToken === '半' ? 30 : minuteToken ? (parseSpokenNumber(minuteToken) ?? 0) : 0;
    const hm = formatHm(applyPeriod(hour, match[1]), minute);
    if (hm) last = hm;
  }
  return last;
}

function compact(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '');
}

function stripTimeAndScaffolding(text: string): string {
  return text
    .replace(new RegExp(TIME_RE.source, 'g'), ' ')
    .replace(DATE_RE, ' ')
    .replace(SCAFFOLD_RE, ' ')
    .replace(/[\s，,。.!！、；;：:]+/g, ' ')
    .trim();
}

function uniqueNote(title: string, note: string): string | undefined {
  const leftover = stripTimeAndScaffolding(note);
  if (!leftover) return undefined;
  if (compact(title).includes(compact(leftover))) return undefined;
  const withoutTitle = leftover.replace(title.trim(), ' ').replace(/\s+/g, ' ').trim();
  const rest = stripTimeAndScaffolding(withoutTitle);
  if (!rest || compact(title).includes(compact(rest))) return undefined;
  return rest;
}

type Ymd = { year?: number; month: number; day: number };

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatYmd(year: number, month: number, day: number): string | undefined {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return undefined;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function parseIsoDate(value?: string): Ymd | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return formatYmd(year, month, day) ? { year, month, day } : undefined;
}

function ymdFromMatch(match: RegExpMatchArray): Ymd | undefined {
  if (match[4]) {
    const year = Number(match[4]);
    const month = Number(match[5]);
    const day = Number(match[6]);
    return formatYmd(year, month, day) ? { year, month, day } : undefined;
  }
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!month || !day) return undefined;
  const yearToken = match[1];
  const year = yearToken ? Number(yearToken) : undefined;
  if (year != null && !formatYmd(year, month, day)) return undefined;
  if (year == null && !formatYmd(2000, month, day) && !formatYmd(2001, month, day)) return undefined;
  return { year, month, day };
}

export function extractSpokenPlanDate(text?: string): Ymd | undefined {
  if (!text) return undefined;
  let last: Ymd | undefined;
  const re = new RegExp(SPOKEN_DATE_RE.source, 'g');
  for (const match of text.matchAll(re)) {
    const parsed = ymdFromMatch(match);
    if (parsed) last = parsed;
  }
  return last;
}

function todayYmd(now: Date): { year: number; month: number; day: number } {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

function compareYmd(
  left: { year: number; month: number; day: number },
  right: { year: number; month: number; day: number },
): number {
  if (left.year !== right.year) return left.year - right.year;
  if (left.month !== right.month) return left.month - right.month;
  return left.day - right.day;
}

export function nextOccurrence(month: number, day: number, now = new Date()): string | undefined {
  const today = todayYmd(now);
  const thisYear = formatYmd(today.year, month, day);
  if (thisYear && compareYmd({ year: today.year, month, day }, today) >= 0) return thisYear;
  return formatYmd(today.year + 1, month, day);
}

function textHasExplicitYear(text: string): boolean {
  return /(?:\d{4}年|\d{4}-\d{2}-\d{2})/.test(text);
}

function resolvePlanDate(input: {
  title: string;
  note?: string;
  planned?: string;
  now: Date;
}): string | undefined {
  const spokenText = [input.note, input.title].filter(Boolean).join(' ');
  const spoken = extractSpokenPlanDate(spokenText);
  if (spoken?.year != null) return formatYmd(spoken.year, spoken.month, spoken.day);
  if (spoken) return nextOccurrence(spoken.month, spoken.day, input.now);
  const field = parseIsoDate(input.planned);
  if (!field) return optionalString(input.planned);
  if (textHasExplicitYear(spokenText) && field.year != null) {
    return formatYmd(field.year, field.month, field.day);
  }
  return nextOccurrence(field.month, field.day, input.now);
}

export function normalizeSuggestTodoPayload(
  input: Record<string, unknown>,
  now = new Date(),
): SuggestTodoPayload {
  const title = String(input.title || input.name || '').trim();
  const rawNote = optionalString(input.description) || optionalString(input.note);
  const planned = resolvePlanDate({
    title,
    note: rawNote,
    planned: optionalString(input.planDate) || optionalString(input.planned),
    now,
  });
  const plannedTime =
    extractSpokenPlanTime(rawNote) ||
    extractSpokenPlanTime(title) ||
    extractSpokenPlanTime(optionalString(input.plannedTime)) ||
    toClock(optionalString(input.plannedTime));
  const note = rawNote ? uniqueNote(title, rawNote) : undefined;
  return {
    title,
    ...(planned ? { planned } : {}),
    ...(plannedTime ? { plannedTime } : {}),
    ...(note ? { note } : {}),
  };
}
