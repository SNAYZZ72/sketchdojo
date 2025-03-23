import { NextRequest, NextResponse } from 'next/server';

// The API endpoint for Stability AI
const STABILITY_API_ENDPOINT = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();
    const { prompt, size = "1024x1024", quality = "standard", n = 1 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Ensure API key is available
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      console.error("Missing Stability API key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Map size to appropriate dimensions - using only sizes supported by Stability AI
    let width = 1024;
    let height = 1024;
    if (size === "1792x1024") {
      // Use closest supported aspect ratio (1344x768)
      width = 1344;
      height = 768;
    } else if (size === "1024x1792") {
      // Use closest supported aspect ratio (768x1344)
      width = 768;
      height = 1344;
    }

    // Set quality parameters
    const steps = quality === "hd" ? 50 : 30;

    // Call Stability AI API
    const response = await fetch(STABILITY_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height,
        width,
        samples: n,
        steps
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate image");
    }

    const responseData = await response.json();
    
    // Format the response similar to OpenAI's response structure
    const formattedData = responseData.artifacts.map((artifact: any) => ({
      url: `data:image/png;base64,${artifact.base64}`,
      revised_prompt: prompt
    }));

    // Return the generated image data
    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    
    // Check for content filter issues
    if (error.message && error.message.includes("content filters")) {
      return NextResponse.json(
        { 
          error: "Your request was blocked by content filters. Please modify your character description to avoid potentially inappropriate content.",
          details: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}

