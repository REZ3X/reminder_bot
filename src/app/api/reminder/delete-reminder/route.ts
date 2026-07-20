import { google } from 'googleapis';
import { NextResponse, NextRequest } from 'next/server';

function unwrap(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return String(value[0]);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = unwrap(body.id);

    if (!id || id === 'null') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid reminder id' },
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

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: id,
    });

    return NextResponse.json({
      success: true,
      deleted_id: id,
    });

  } catch (error: any) {
    console.error('Calendar delete error:', error);

    if (error.code === 410 || error.code === 404) {
      return NextResponse.json(
        { success: false, error: 'Reminder not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}