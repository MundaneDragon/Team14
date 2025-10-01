import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { default as ical } from 'ical-generator';

/**
 * GET /api/ical/calendar/[token]
 * Generates an iCal calendar for a user based on their watchlist and timetable
 * This endpoint is public but requires a valid token
 */
export async function GET(request, { params }) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find user by token
    const { data: userData, error: tokenError } = await supabase
      .from('profiles')
      .select('id')
      .eq('ical_token', token)
      .single();

    if (tokenError || !userData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      );
    }

    const userId = userData.user_id;


    // Fetch user's watchlist events
    const { data: organizersIds, error: orgError } = await supabase
      .from('profiles')
      .select('favourite_societies')
      .eq('id', userId);

    if (orgError) {
      console.error('Error fetching watchlist society events:', orgError);
      return NextResponse.json(
        { error: 'Failed to fetch watchlist society events' },
        { status: 500 }
      );
    }

    let organizerEvents = [];
    if (organizersIds && organizersIds.length > 0) {
      const { data: orgEvents, error: orgEventsError } = await supabase
        .from('events')
        .select('*')
        .in('society_id', organizersIds)
        .gte('start_time', new Date().toISOString()); // Only future events

      if (!orgEventsError && orgEvents) {
        organizerEvents = orgEvents;
      }
    }

    // Create iCal calendar
    const calendar = ical({
      name: 'MissingLink Events',
      description: 'Your personalized event calendar from MissingLink',
      timezone: 'Australia/Sydney',
      ttl: 300, // Refresh every 5 minutes
      prodId: {
        company: 'MissingLink',
        product: 'Event Calendar'
      }
    });

  
    // Add events from watched organizers (avoid duplicates)
    const watchlistEventIds = new Set();

    organizerEvents.forEach(event => {
      if (watchlistEventIds.has(event.id)) return; // Skip duplicates
      
      calendar.createEvent({
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : new Date(new Date(event.start_time).getTime() + 3600000),
        title: event.title,
        description: event.description || '',
        location: event.location || '',
        category: event.category || '',
        attachments: [
          {
            uri: event.image || '',
            mime: 'image/jpeg'
          }
        ]
      });
    });

    // Generate iCal string
    const icalString = calendar.toString();

    // Return as iCal file
    return new NextResponse(icalString, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="missinglink-events.ics"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
