import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * GET /api/ical/token
 * Retrieves or creates a unique iCal token for the authenticated user
 */
export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No auth token found' },
        { status: 401 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Get user with token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already has a token
    let { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('ical_token')
      .eq('id', user.id)
      .single();

    // If no token exists, create one
    let tokenData = userData;
    
    // Check if token is missing or is the string "NULL"
    if (fetchError || !userData || !userData.ical_token || userData.ical_token === 'NULL') {
      const newToken = crypto.randomBytes(32).toString('hex');
      
      const { data: newTokenData, error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ical_token: newToken
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (updateError) {
        console.error('Error creating iCal token:', updateError);
        return NextResponse.json(
          { error: 'Failed to create iCal token' },
          { status: 500 }
        );
      }

      tokenData = newTokenData;
    }

    // Generate the iCal feed URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000';
    const icalUrl = `${baseUrl}/api/ical/calendar/${tokenData.ical_token}`;

    return NextResponse.json({ 
      token: tokenData.ical_token,
      icalUrl 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ical/token
 * Regenerates the user's iCal token (invalidates old links)
 */
export async function POST(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No auth token found' },
        { status: 401 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Get user with token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const newToken = crypto.randomBytes(32).toString('hex');

    // Upsert the token (update if exists, insert if not)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ical_token: newToken
      }, {
        onConflict: 'id'
      })
      .select('ical_token')
      .single();

    if (error) {
      console.error('Error regenerating iCal token:', error);
      return NextResponse.json(
        { error: 'Failed to regenerate iCal token' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const icalUrl = `${baseUrl}/api/ical/calendar/${data.ical_token}`;

    return NextResponse.json({ 
      token: data.token,
      icalUrl 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
