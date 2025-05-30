import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize OpenAI outside of the handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function uploadToSupabase(base64Data: string, bucket: string, fileName: string): Promise<string> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload directly to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw error;
  }
}

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

    // Upload reference images if provided
    let referenceImageUrls: string[] = [];
    if (body.referenceImages?.length > 0) {
      for (let i = 0; i < body.referenceImages.length; i++) {
        const fileName = `ref-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}.png`;
        const url = await uploadToSupabase(body.referenceImages[i], 'user-images', fileName);
        referenceImageUrls.push(url);
      }
    }

    // Generate image using GPT-Image-1
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: body.prompt,
      n: 1,
      size: "1024x1024",
      quality: "high"
    });

    if (!response.data?.[0]?.b64_json) {
      return new NextResponse(
        JSON.stringify({ error: 'No image was generated' }),
        { status: 500, headers }
      );
    }

    // Upload generated image to Supabase
    const generatedFileName = `gen-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const generatedImageUrl = await uploadToSupabase(
      response.data[0].b64_json,
      'generated-images',
      generatedFileName
    );

    return new NextResponse(
      JSON.stringify({ 
        imageUrl: generatedImageUrl,
        referenceUrls: referenceImageUrls
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