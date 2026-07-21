import { google } from 'googleapis';
import { NextResponse, NextRequest } from 'next/server';

function unwrap(value: unknown): string {
  if (Array.isArray(value)) {
    return String(value[0]);
  }
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? String(parsed[0]) : value;
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start_time, end_time, summary, timeZone } = body;

    if (!start_time || !end_time) {
      return NextResponse.json(
        { success: false, error: 'Missing start_time or end_time' },
        { status: 400 }
      );
    }

    const cleanStartTime = unwrap(start_time);
    const cleanEndTime = unwrap(end_time);

    const cleanSummaryRaw = summary != null ? unwrap(summary) : '';
    const cleanSummary = isEmpty(cleanSummaryRaw) ? 'Reminder' : cleanSummaryRaw;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: cleanSummary,
      start: {
        dateTime: cleanStartTime,
        timeZone: timeZone || 'Asia/Jakarta',
      },
      end: {
        dateTime: cleanEndTime,
        timeZone: timeZone || 'Asia/Jakarta',
      },
    };

    const res = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
    });

    return NextResponse.json({
      success: true,
      event_id: res.data.id,
      html_link: res.data.htmlLink,
    });

  } catch (error: any) {
    console.error('Calendar insert error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}