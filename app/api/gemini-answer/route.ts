import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
 

// Initialize the Gemini API with proper error handling
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    console.log('Gemini API: Request received');
    
    const { field, idea, projectDetails } = await request.json();
    
    if (!field || !idea) {
      console.log('Gemini API: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify API key is present
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('Gemini API: API key is missing');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    console.log(`Gemini API: Processing request for field: ${field}`);
    
    try {
      // Create a model instance without safety settings
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          // ... other safety settings
        ],
      });

      // Prepare prompt based on the field
      let prompt = '';
      switch (field) {
        case 'targetAudience':
          prompt = `Based on the following product idea, identify and describe the target audience in 3-4 sentences. Be specific about demographics, needs, and behaviors.
          
Product idea: ${idea}

${projectDetails ? `Additional context about the product:
${JSON.stringify(projectDetails)}` : ''}`;
          break;
        case 'problemSolved':
          prompt = `Based on the following product idea, clearly articulate the problem this product solves in 3-4 sentences. Focus on pain points and current market gaps.
          
Product idea: ${idea}

${projectDetails ? `Additional context about the product:
${JSON.stringify(projectDetails)}` : ''}`;
          break;
        case 'keyFeatures':
          prompt = `Based on the following product idea, list 3-5 key features of this product in 3-4 sentences. Focus on what makes it unique and valuable.
          
Product idea: ${idea}

${projectDetails ? `Additional context about the product:
${JSON.stringify(projectDetails)}` : ''}`;
          break;
        case 'successMetrics':
          prompt = `Based on the following product idea, suggest 3-4 metrics to measure the success of this product in 3-4 sentences. Include both business and user-focused metrics.
          
Product idea: ${idea}

${projectDetails ? `Additional context about the product:
${JSON.stringify(projectDetails)}` : ''}`;
          break;
        case 'timeline':
          prompt = `Based on the following product idea, suggest a realistic timeline for developing and launching this product in 3-4 sentences. Break it down into major phases.
          
Product idea: ${idea}

${projectDetails ? `Additional context about the product:
${JSON.stringify(projectDetails)}` : ''}`;
          break;
        default:
          prompt = `Based on the following product idea, provide insights about ${field} in 3-4 sentences.
          
Product idea: ${idea}

${projectDetails ? `Additional context about the product:
${JSON.stringify(projectDetails)}` : ''}`;
      }

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini API: Successfully generated content');
      return NextResponse.json({ answer: text });      
    } catch (apiError) {
      console.error('Gemini API specific error:', apiError);      
      let errorMessage = 'Unknown API error';
      if (apiError instanceof Error) {
        errorMessage = apiError.message;
      } else if (typeof apiError === 'object' && apiError !== null && 'message' in apiError) {
        errorMessage = String(apiError.message);
      }
      return NextResponse.json(
        { error: `Gemini API error: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Gemini API general error:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: `Failed to generate answer with Gemini: ${errorMessage}` },
      { status: 500 }
    );
  }
}
