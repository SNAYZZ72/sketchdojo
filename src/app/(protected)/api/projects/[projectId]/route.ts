// src/app/(protected)/api/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
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
    
    // Get project by ID
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { projectId: string } }) {
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
    
    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update(body)
      .eq('id', params.projectId)
      .eq('user_id', user.id)
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
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { projectId: string } }) {
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
    
    // Delete project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.projectId)
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}