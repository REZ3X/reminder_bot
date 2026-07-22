import { google } from 'googleapis';
import { NextResponse, NextRequest } from 'next/server';

function unwrap(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value.length > 0 ? String(value[0]) : undefined;
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? (parsed.length > 0 ? String(parsed[0]) : undefined)
        : value;
    } catch {
      return value;
    }
  }
  return String(value);
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  const str = String(value).trim().toLowerCase();
  return (
    str === '' ||
    str === 'null' ||
    str === 'undefined' ||
    str === '[]' ||
    str === '[""]' ||
    str === 'nan'
  );
}

function ensureOffset(value: unknown, offset: string): string | undefined {
  if (isEmpty(value)) return undefined;
  const str = String(value);
  if (/[+-]\d{2}:\d{2}$/.test(str) || str.endsWith('Z')) {
    return str;
  }
  return `${str}${offset}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const DEFAULT_OFFSET = '+07:00';

    const queryModeRaw = unwrap(body.query_mode);
    const queryMode = isEmpty(queryModeRaw) ? 'event_time' : String(queryModeRaw);

    const timeMinRaw = unwrap(body.timeMin);
    const timeMaxRaw = unwrap(body.timeMax);
    const createdMinRaw = unwrap(body.createdMin);
    const createdMaxRaw = unwrap(body.createdMax);
    const updatedMinRaw = unwrap(body.updatedMin);
    const updatedMaxRaw = unwrap(body.updatedMax);
    const keywordRaw = unwrap(body.keyword);
    const maxResultsRaw = unwrap(body.maxResults);

    const requestedMaxResults = isEmpty(maxResultsRaw) ? 20 : parseInt(String(maxResultsRaw), 10);
    const keyword = isEmpty(keywordRaw) ? undefined : String(keywordRaw);

    const timeMin = ensureOffset(timeMinRaw, DEFAULT_OFFSET);
    const timeMax = ensureOffset(timeMaxRaw, DEFAULT_OFFSET);
    const createdMin = ensureOffset(createdMinRaw, DEFAULT_OFFSET);
    const createdMax = ensureOffset(createdMaxRaw, DEFAULT_OFFSET);
    const updatedMinFilter = ensureOffset(updatedMinRaw, DEFAULT_OFFSET);
    const updatedMaxFilter = ensureOffset(updatedMaxRaw, DEFAULT_OFFSET);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    let items: any[] = [];

    if (queryMode === 'created_time' || queryMode === 'updated_time') {

      const nativeUpdatedMin = queryMode === 'created_time' ? createdMin : updatedMinFilter;

      const res = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: '2000-01-01T00:00:00Z', 
        updatedMin: nativeUpdatedMin || undefined, 
        maxResults: 2500,
        singleEvents: true,
        showDeleted: false,
        q: keyword,
      });

      items = res.data.items || [];

      if (queryMode === 'created_time') {
        items = items.filter((e) => {
          if (!e.created) return false;
          const createdTime = new Date(e.created).getTime();
          if (createdMin && createdTime < new Date(createdMin).getTime()) return false;
          if (createdMax && createdTime > new Date(createdMax).getTime()) return false;
          return true;
        });
        items.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      } else {
        items = items.filter((e) => {
          if (!e.updated) return false;
          const updatedTime = new Date(e.updated).getTime();
          if (updatedMinFilter && updatedTime < new Date(updatedMinFilter).getTime()) return false;
          if (updatedMaxFilter && updatedTime > new Date(updatedMaxFilter).getTime()) return false;
          return true;
        });
        items.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
      }

      items = items.slice(0, isNaN(requestedMaxResults) ? 20 : requestedMaxResults);

    } else {
      const res = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || undefined,
        maxResults: isNaN(requestedMaxResults) ? 20 : requestedMaxResults,
        singleEvents: true,
        showDeleted: false,
        orderBy: 'startTime',
        q: keyword,
      });
      items = res.data.items || [];
    }

    const events = items.map((event: any) => ({
      id: event.id,
      summary: event.summary || '(No title)',
      start: event.start?.dateTime || event.start?.date || null,
      end: event.end?.dateTime || event.end?.date || null,
      timeZone: event.start?.timeZone || null,
      status: event.status,
      created: event.created || null,
      updated: event.updated || null,
      html_link: event.htmlLink,
    }));

    return NextResponse.json({
      success: true,
      count: events.length,
      query_mode: queryMode,
      reminders: events,
    });

  } catch (error: any) {
    console.error('Calendar list error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}