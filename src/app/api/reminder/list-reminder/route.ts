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

    const timeMinRaw = unwrap(body.timeMin);
    const timeMaxRaw = unwrap(body.timeMax);
    const maxResultsRaw = unwrap(body.maxResults);
    const maxResults = isEmpty(maxResultsRaw) ? 20 : parseInt(String(maxResultsRaw), 10);

    const timeMin = ensureOffset(timeMinRaw, DEFAULT_OFFSET);
    const timeMax = ensureOffset(timeMaxRaw, DEFAULT_OFFSET);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || undefined,
      maxResults: isNaN(maxResults) ? 20 : maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = (res.data.items || []).map((event: any) => ({
      id: event.id,
      summary: event.summary || '(No title)',
      start: event.start?.dateTime || event.start?.date || null,
      end: event.end?.dateTime || event.end?.date || null,
      timeZone: event.start?.timeZone || null,
      status: event.status,
      html_link: event.htmlLink,
    }));

    return NextResponse.json({
      success: true,
      count: events.length,
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