import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { field, idea, projectDetails, question, suggestedAnswer } = await req.json();
    
    console.log("Received request:", { field, idea, question, suggestedAnswer });
    
    if (!idea || !field) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return Response.json({ error: "API key configuration error" }, { status: 500 });
    }
    
    // Construct a prompt that includes the clarifying question if available
    let prompt = "";
    
    // First priority: Use the explicitly provided question parameter
    if (question) {
      console.log("Using provided question:", question);
      prompt = `Based on this product idea: "${idea}", please provide a detailed answer to the following question: "${question}".`;
      
      if (suggestedAnswer) {
        prompt += ` Here's a suggested answer that you can improve upon: "${suggestedAnswer}".`;
      }
    } 
    // Fallback to generic prompts
    else {
      console.log("No question provided, using fallback prompt for field:", field);
      prompt = getFallbackPrompt(field, idea);
    }
    
    // Add context from other fields if available
    if (projectDetails) {
      prompt += " Consider these other details about the project: ";
      for (const [key, value] of Object.entries(projectDetails)) {
        if (key !== field && key !== "clarifyingQuestions" && typeof value === 'string' && value) {
          prompt += `${key}: ${value}. `;
        }
      }
    }
    
    console.log("Generated prompt:", prompt);
    
    try {
      // Make the actual API call to Gemini
      const answer = await generateGeminiResponse(prompt);
      console.log("Generated answer:", answer);
      return Response.json({ answer });
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      return Response.json({ 
        error: apiError instanceof Error ? apiError.message : "Failed to generate content from Gemini API" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in gemini-answer API:", error);
    return Response.json({ 
      error: error instanceof Error ? error.message : "Failed to generate answer" 
    }, { status: 500 });
  }
}

async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    // Create a model instance
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Generate content with safety settings and timeout
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });
    
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to generate content from Gemini API");
  }
}

// Helper function to get fallback prompts
function getFallbackPrompt(field: string, idea: string): string {
  switch (field) {
    case "targetAudience":
      return `Based on this product idea: "${idea}", who would be the target audience?`;
    case "problemSolved":
      return `Based on this product idea: "${idea}", what problem does this product solve?`;
    case "keyFeatures":
      return `Based on this product idea: "${idea}", what would be the key features?`;
    case "successMetrics":
      return `Based on this product idea: "${idea}", what would be appropriate success metrics?`;
    case "timeline":
      return `Based on this product idea: "${idea}", what would be a realistic timeline for development?`;
    default:
      return `Based on this product idea: "${idea}", please provide more details about ${field}.`;
  }
}
