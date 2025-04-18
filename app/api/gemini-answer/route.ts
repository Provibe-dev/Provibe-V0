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
    
    // Find the matching clarifying question if available
    let matchingQuestion = null;
    if (projectDetails && projectDetails.clarifyingQuestions) {
      const fieldMapping: Record<string, number> = {
        "targetAudience": 0,
        "problemSolved": 1,
        "keyFeatures": 2,
        "successMetrics": 3,
        "timeline": 4,
        "additionalInfo1": 5,
        "additionalInfo2": 6
      };
      
      const questionIndex = fieldMapping[field];
      if (questionIndex !== undefined && 
          projectDetails.clarifyingQuestions.length > questionIndex) {
        matchingQuestion = projectDetails.clarifyingQuestions[questionIndex];
      }
    }
    
    // Construct a prompt that includes the clarifying question if available
    let prompt = "";
    
    if (matchingQuestion) {
      // Use the actual clarifying question
      prompt = `Based on this product idea: "${idea}", please provide a detailed answer to the following question: "${matchingQuestion.question}".`;
      
      if (matchingQuestion.suggestedAnswer) {
        prompt += ` Here's a suggested answer that you can improve upon: "${matchingQuestion.suggestedAnswer}".`;
      }
    } else if (question) {
      // Use the provided question parameter
      prompt = `Based on this product idea: "${idea}", please provide a detailed answer to the following question: "${question}".`;
      
      if (suggestedAnswer) {
        prompt += ` Here's a suggested answer that you can improve upon: "${suggestedAnswer}".`;
      }
    } else {
      // Fallback to generic prompts based on field name
      switch (field) {
        case "targetAudience":
          prompt = `Based on this product idea: "${idea}", who would be the target audience?`;
          break;
        case "problemSolved":
          prompt = `Based on this product idea: "${idea}", what problem does this product solve?`;
          break;
        case "keyFeatures":
          prompt = `Based on this product idea: "${idea}", what would be the key features?`;
          break;
        case "successMetrics":
          prompt = `Based on this product idea: "${idea}", what would be appropriate success metrics?`;
          break;
        case "timeline":
          prompt = `Based on this product idea: "${idea}", what would be a realistic timeline for development?`;
          break;
        default:
          prompt = `Based on this product idea: "${idea}", please provide more details about ${field}.`;
      }
    }
    
    // Add context from other fields if available
    if (projectDetails) {
      prompt += " Consider these other details about the project: ";
      for (const [key, value] of Object.entries(projectDetails)) {
        if (key !== field && key !== "clarifyingQuestions" && value) {
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
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
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
