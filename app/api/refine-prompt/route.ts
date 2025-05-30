import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

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
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert at refining prompts for image generation. Your task is to enhance the given prompt to create more detailed, vivid, and effective image generation prompts. Focus on:
          - Adding relevant artistic style details
          - Specifying lighting, composition, and mood
          - Including relevant technical aspects (e.g., camera angles, rendering style)
          - Maintaining the original intent while making it more descriptive
          
          Provide only the refined prompt without any explanations or additional text.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const refinedPrompt = completion.choices[0]?.message?.content || prompt;

    return new NextResponse(
      JSON.stringify({ refinedPrompt }),
      { status: 200, headers }
    );

  } catch (error: any) {
    console.error('Error in prompt refinement:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { status: 500, headers }
    );
  }
} 