// src/app/(protected)/api/characters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
      .from('characters')
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
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch characters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("Character POST request received");
  
  try {
    const supabase = await createClient();
    console.log("Supabase client created");
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("User authentication check completed", user?.id);
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    console.log("Request body received:", JSON.stringify(body, null, 2));
    
    const { 
      name, 
      description,
      project_id,
      image_url,
      gender,
      age,
      style,
      hair_color,
      eye_color,
      skin_tone,
      body_type,
      clothing,
      personality,
      facial_features,
      pose,
      background,
      accessories,
      expression,
      additional_details,
      generation_params
    } = body;
    
    // Validate required fields
    if (!name) {
      console.error("Character name is required");
      return NextResponse.json(
        { error: "Character name is required" },
        { status: 400 }
      );
    }
    
    let finalProjectId = project_id;
    
    // Check if project_id is provided (as it's a required field in the database)
    if (!finalProjectId) {
      console.log("No project_id provided, looking for a default project");
      
      // Try to find an existing project
      const { data: projects, error: projectQueryError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (projectQueryError) {
        console.error("Error fetching projects:", projectQueryError);
      }
      
      console.log("Found projects:", projects);
      
      if (projects && projects.length > 0) {
        finalProjectId = projects[0].id;
        console.log(`Using existing project as default: ${finalProjectId}`);
      } else {
        console.log("No existing projects found, creating a default project");
        
        // Create a default project if none exists
        const { data: newProject, error: projectError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            title: 'Default Project',
            status: 'draft',
            metadata: {
              genre: 'general',
              template_type: 'blank'
            }
          })
          .select('id')
          .single();
        
        if (projectError) {
          console.error("Error creating default project:", projectError);
          return NextResponse.json(
            { error: "Could not create a default project. Please select a project for your character." },
            { status: 400 }
          );
        }
        
        finalProjectId = newProject.id;
        console.log(`Created and using default project: ${finalProjectId}`);
      }
    }
    
    // Prepare the insert data
    const insertData = {
      user_id: user.id,
      project_id: finalProjectId,
      name,
      description: description || null,
      image_url: image_url || null,
      metadata: {
        gender,
        age,
        style,
        hair_color,
        eye_color,
        skin_tone,
        body_type,
        clothing,
        personality: personality || [],
        facial_features: facial_features || [],
        pose,
        background,
        accessories: accessories || [],
        expression,
        additional_details,
        generation_params
      }
    };
    
    console.log("Inserting character with data:", JSON.stringify(insertData, null, 2));
    
    // Create character in Supabase
    const result = await supabase
      .from('characters')
      .insert(insertData)
      .select()
      .single();
    
    if (result.error) {
      console.error("Supabase insert error details:", {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint
      });
      
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }
    
    console.log("Character inserted successfully:", result.data.id);
    
    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error: any) {
    console.error("Error creating character:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to create character" },
      { status: 500 }
    );
  }
}