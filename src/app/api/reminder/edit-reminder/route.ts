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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = unwrap(body.id);
    const newSummary = unwrap(body.new_summary);
    const newStartTime = unwrap(body.new_start_time);
    const newEndTime = unwrap(body.new_end_time);
    const timeZone = unwrap(body.timeZone) || 'Asia/Jakarta';

    if (isEmpty(id)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid reminder id' },
        { status: 400 }
      );
    }

    if (isEmpty(newSummary) && isEmpty(newStartTime) && isEmpty(newEndTime)) {
      return NextResponse.json(
        { success: false, error: 'No changes provided — nothing to update' },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const patchBody: Record<string, any> = {};

    if (!isEmpty(newSummary)) {
      patchBody.summary = newSummary;
    }

    if (!isEmpty(newStartTime)) {
      patchBody.start = { dateTime: newStartTime, timeZone };
    }

    if (!isEmpty(newEndTime)) {
      patchBody.end = { dateTime: newEndTime, timeZone };
    }

    const res = await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: id,
      requestBody: patchBody,
    });

    return NextResponse.json({
      success: true,
      event_id: res.data.id,
      summary: res.data.summary,
      start: res.data.start,
      end: res.data.end,
      html_link: res.data.htmlLink,
      fields_updated: Object.keys(patchBody),
    });

  } catch (error: any) {
    console.error('Calendar edit error:', error);

    if (error.code === 404) {
      return NextResponse.json(
        { success: false, error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}