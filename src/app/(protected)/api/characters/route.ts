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
      metadata 
    } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Character name is required" },
        { status: 400 }
      );
    }
    
    // Create character in Supabase
    const { data, error } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        project_id,
        name,
        description: description || null,
        image_url: image_url || null,
        metadata: metadata || {}
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
    console.error("Error creating character:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create character" },
      { status: 500 }
    );
  }
}