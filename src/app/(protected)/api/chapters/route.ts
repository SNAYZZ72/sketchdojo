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
      title, 
      description,
      order_index
    } = body;
    
    // Validate required fields
    if (!project_id || !title) {
      return NextResponse.json(
        { error: "Project ID and title are required" },
        { status: 400 }
      );
    }
    
    // Verify the project belongs to the user
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();
    
    if (projectError || !projectData) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 403 }
      );
    }
    
    // Get the count of existing chapters for order_index
    const { count, error: countError } = await supabase
      .from('chapters')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', project_id);
    
    if (countError) {
      return NextResponse.json(
        { error: countError.message },
        { status: 500 }
      );
    }
    
    // Create chapter in Supabase
    const { data, error } = await supabase
      .from('chapters')
      .insert({
        project_id,
        title,
        description: description || null,
        order_index: order_index !== undefined ? order_index : count || 0,
        status: 'draft'
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
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create chapter" },
      { status: 500 }
    );
  }
}