import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { default as ical } from 'ical-generator';

/**
 * GET /api/ical/calendar/[token]
 * Generates an iCal calendar for a user based on their favorites and (timetable)
 * This endpoint is public but requires a valid token
 */
export async function GET(request, { params }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find user by token
    const { data: userData, error: tokenError } = await supabase
    .from('profiles')
    .select('id, ical_token')
    .eq('ical_token', token)
    .single();
    
    if (tokenError || !userData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      );
    }

    const userId = userData.id;
    console.log('User ID:', userId);

    // Fetch user's watchlist events
    const { data: organizersIds, error: orgError } = await supabase
      .from('profiles')
      .select('favourite_societies')
      .eq('id', userId);

    console.log('Favorite societies:', organizersIds);

    if (orgError) {
      console.error('Error fetching watchlist society events:', orgError);
      return NextResponse.json(
        { error: 'Failed to fetch watchlist society events' },
        { status: 500 }
      );
    }

    let organizerEvents = [];
    if (organizersIds && organizersIds.length > 0) {
      const favSocieties = organizersIds[0]?.favourite_societies || [];
      console.log('Fetching events for society IDs:', favSocieties);
      
      const { data: orgEvents, error: orgEventsError } = await supabase
        .from('events')
        .select('*')
        .in('society_id', favSocieties)
        .gte('start_time', new Date().toISOString()); // Only future events

      console.log('Found events:', orgEvents?.length || 0);
      console.log('Events data:', orgEvents);

      if (!orgEventsError && orgEvents) {
        organizerEvents = orgEvents;
      } else if (orgEventsError) {
        console.error('Error fetching events:', orgEventsError);
      }
    } else {
      console.log('No favorite societies found');
    }

    // Create iCal calendar
    const calendar = ical({
      name: 'MissingLink Events',
      description: 'Your personalized event calendar from MissingLink',
      timezone: 'Australia/Sydney',
      ttl: 30, // Refresh every 5 minutes
      prodId: {
        company: 'MissingLink',
        product: 'Event Calendar'
      }
    });

  
    // Add events from watched organizers (avoid duplicates)
    const watchlistEventIds = new Set();

    console.log('Adding events to calendar:', organizerEvents.length);

    organizerEvents.forEach(event => {
      if (watchlistEventIds.has(event.id)) {
        console.log('Skipping duplicate event:', event.title);
        return; // Skip duplicates
      }
      
      console.log('Adding event:', event.title, 'at', event.start_time);
      
      calendar.createEvent({
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : new Date(new Date(event.start_time).getTime() + 3600000),
        summary: event.title,
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
      
      watchlistEventIds.add(event.id);
    });

    console.log('Calendar generated with', watchlistEventIds.size, 'events');

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
