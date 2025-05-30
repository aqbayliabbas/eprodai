import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize OpenAI outside of the handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers }
      );
    }

    // Validate prompt
    if (!body?.prompt) {
      return new NextResponse(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers }
      );
    }

    // Call OpenAI Responses API with GPT-Image-1
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",  // This model can use the image generation tool
      input: body.prompt,
      tools: [{
        type: "image_generation",
        size: "1024x1536",
        quality: "high"
      }]
    });

    // Extract the base64 image from the response
    const imageData = response.output
      .filter(output => output.type === "image_generation_call")
      .map(output => output.result)[0];

    if (!imageData) {
      return new NextResponse(
        JSON.stringify({ error: 'No image was generated' }),
        { status: 500, headers }
      );
    }

    // Return the base64 image data as a data URL
    return new NextResponse(
      JSON.stringify({ 
        imageUrl: `data:image/png;base64,${imageData}`
      }),
      { status: 200, headers }
    );

  } catch (error: any) {
    console.error('Error in thumbnail generation:', error);
    
    // Return error response
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { status: 500, headers }
    );
  }
} 