import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { 
      project_id, 
      name, 
      description,
      image_url,
      background_type,
      style,
      setting,
      time_of_day,
      weather,
      mood,
      perspective,
      lighting,
      season,
      theme,
      additional_details,
      environment_elements,
      architectural_elements,
      props
    } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Background name is required" },
        { status: 400 }
      );
    }
    
    // Create background in Supabase
    const { data, error } = await supabase
      .from('backgrounds')
      .insert({
        user_id: user.id,
        project_id,
        name,
        description: description || null,
        image_url: image_url || null,
        metadata: {
          background_type,
          style,
          setting,
          time_of_day,
          weather,
          mood,
          perspective,
          lighting,
          season,
          theme,
          additional_details,
          environment_elements: environment_elements || [],
          architectural_elements: architectural_elements || [],
          props: props || []
        }
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error("Error creating background:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create background" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const projectId = url.searchParams.get('project_id');
    
    // Build query
    let query = supabase
      .from('backgrounds')
      .select('*')
      .eq('user_id', user.id);
    
    // Add project filter if provided
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    // Execute query
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error("Error fetching backgrounds:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch backgrounds" },
      { status: 500 }
    );
  }
}