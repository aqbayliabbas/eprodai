import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

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

export async function POST(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    const body = await request.json();
    const { prompt, referenceImages } = body;

    if (!prompt || !referenceImages || referenceImages.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Prompt and at least one reference image are required' }),
        { status: 400, headers }
      );
    }

    // Convert base64 images to Blobs
    const imageBlobs = await Promise.all(
      referenceImages.map(async (base64Data: string) => {
        const binaryData = atob(base64Data);
        const uint8Array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }
        return new Blob([uint8Array], { type: 'image/png' });
      })
    );

    // Convert Blobs to Files
    const imageFiles = imageBlobs.map((blob, index) => 
      new File([blob], `image-${index}.png`, { type: 'image/png' })
    );

    // Call OpenAI API for image editing
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFiles,
      prompt: `Create a professional product image: ${prompt}. Ensure high-quality commercial aesthetic with clean background and professional lighting.`,
    });

    if (!response.data || response.data.length === 0 || !response.data[0].b64_json) {
      throw new Error('No image data received from OpenAI API');
    }

    // Convert the generated image base64 to Blob
    const generatedBase64 = response.data[0].b64_json;
    const binaryData = atob(generatedBase64);
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    const generatedImageBlob = new Blob([uint8Array], { type: 'image/png' });

    // Upload to Supabase
    const timestamp = new Date().toISOString();
    const randomId = crypto.randomUUID();
    const fileName = `generated-${timestamp}-${randomId}.png`;

    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(fileName, generatedImageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw new Error('Failed to upload generated image to storage');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);

    return new NextResponse(
      JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        message: 'Image processed and stored successfully'
      }),
      { status: 200, headers }
    );

  } catch (error: any) {
    console.error('Error processing image:', error);
    return new NextResponse(
      JSON.stringify({
        error: error.message || 'Failed to process image',
        details: error.toString()
      }),
      { status: 500, headers }
    );
  }
} 