import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Log the start of the API call
    console.log("API: enhance-idea endpoint called");
    
    // Parse the request body
    let idea;
    try {
      const body = await request.json();
      idea = body.idea;
      console.log("API: Received idea:", idea?.substring(0, 30) + "...");
    } catch (parseError) {
      console.error("API: Error parsing request body:", parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate the idea
    if (!idea || idea.length < 10) {
      console.log("API: Idea validation failed - too short");
      return NextResponse.json(
        { error: 'Idea must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("API: Missing OpenAI API key");
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    console.log("API: Calling OpenAI API");
    
    // Call OpenAI to enhance the idea
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a product development expert. Your task is to take a brief product idea and expand it into a well-structured product idea. Focus on key elements: the problem being solved, target audience, unique value proposition. Keep your response concise (max 200 words) and focused on the core concept."
        },
        {
          role: "user",
          content: `Here's my product idea: ${idea}\n\nPlease enhance this into a well-structured product concept.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract the enhanced idea from the response
    const enhancedIdea = completion.choices[0].message.content;
    
    console.log("API: Successfully enhanced idea, returning response");
    
    return NextResponse.json({ enhancedIdea });
  } catch (error) {
    console.error('API: Error enhancing idea:', error);
    
    // Return a more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to enhance idea: ${errorMessage}` },
      { status: 500 }
    );
  }
}
