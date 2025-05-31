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
    const { prompt, referenceImages } = body;

    if (!prompt) {
      return new NextResponse(
        JSON.stringify({ error: 'Product description is required' }),
        { status: 400, headers }
      );
    }

    let messages = [];
    
    // Add system message
    messages.push({
      role: "system",
      content: `You are an expert at refining product descriptions for e-commerce image generation. Your task is to enhance the given description by:
      1. Analyzing any reference product images provided
      2. Incorporating key product features, materials, and finishes
      3. Specifying lighting setup and background details
      4. Adding professional photography technical aspects (angles, composition)
      5. Ensuring the description maintains e-commerce best practices
      6. Including specific details about product presentation and styling
      
      Focus on creating a description that will result in a professional, commercial-quality product image.
      Provide only the refined description without any explanations or additional text.`
    });

    // If there are reference images, add them with the prompt in a single message
    if (referenceImages && referenceImages.length > 0) {
      const content = [
        {
          type: "text",
          text: `Please analyze these product images and refine this product description for image generation: ${prompt}`
        }
      ];

      // Add reference images to the content array
      referenceImages.forEach(base64Image => {
        content.push({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
            detail: "high" // Using high detail for better product analysis
          }
        });
      });

      messages.push({
        role: "user",
        content
      });
    } else {
      // If no images, just add the prompt as a regular text message
      messages.push({
        role: "user",
        content: `Please refine this product description for image generation: ${prompt}`
      });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const refinedPrompt = completion.choices[0]?.message?.content || prompt;

      return new NextResponse(
        JSON.stringify({ refinedPrompt }),
        { status: 200, headers }
      );
    } catch (apiError: any) {
      console.error('OpenAI API Error:', apiError);
      
      // If vision model fails, fallback to regular GPT-4
      const fallbackCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at writing professional product descriptions for e-commerce photography. Focus on details that will help generate high-quality product images."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      const refinedPrompt = fallbackCompletion.choices[0]?.message?.content || prompt;
      
      return new NextResponse(
        JSON.stringify({ refinedPrompt }),
        { status: 200, headers }
      );
    }

  } catch (error: any) {
    console.error('Error in product description refinement:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { status: 500, headers }
    );
  }
} 