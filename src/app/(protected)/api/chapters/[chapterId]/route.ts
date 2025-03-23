// src/app/(protected)/api/chapters/[chapterId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: NextRequest, { params }: { params: { chapterId: string } }) {
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
    
    // Update chapter
    const { data, error } = await supabase
      .from('chapters')
      .update(body)
      .eq('id', params.chapterId)
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
    console.error("Error updating chapter:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update chapter" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { chapterId: string } }) {
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
    
    // Delete chapter
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', params.chapterId);
    
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
    console.error("Error deleting chapter:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete chapter" },
      { status: 500 }
    );
  }
}