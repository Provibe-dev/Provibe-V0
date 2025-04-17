import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
// Note: Using GOOGLE_GEMINI_API_KEY to match what's used in gemini-answer route
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { idea, details, tools } = body;

    console.log("Received request with data:", { 
      idea: typeof idea === 'string' ? idea.substring(0, 50) + '...' : idea,
      details: details ? 'provided' : 'not provided',
      tools: tools ? `${tools.length} tools provided` : 'not provided'
    });
    
    console.log("Using Gemini API key:", process.env.GOOGLE_GEMINI_API_KEY ? "Key exists" : "Key missing");

    if (!idea) {
      return NextResponse.json({ error: 'Project idea is required' }, { status: 400 });
    }

    // Format the details for the prompt
    const detailsText = details ? Object.entries(details)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        return `- ${formattedKey}: ${value}`;
      })
      .join('\n') : 'No additional details provided';

    // Format the tools for the prompt
    const toolsText = tools && tools.length > 0 
      ? `Selected tools: ${tools.join(', ')}` 
      : 'No specific tools selected';

    // Create a prompt for Gemini
    const prompt = `
Create a comprehensive project plan for the following software project idea:

PROJECT IDEA:
${idea}

PROJECT DETAILS:
${detailsText}

TECHNICAL STACK:
${toolsText}

Please structure your response as a detailed markdown document with the following sections:
1. Project Overview
2. Technical Architecture
3. Development Phases with timeline estimates
4. Key Features and Implementation Details
5. Testing Strategy
6. Potential Challenges and Mitigations

Make the plan specific to the project idea and selected tools. Be concise but thorough.
`;

    console.log("Sending prompt to Gemini API");

    // Get the generative model - using gemini-pro instead of gemini-2.0-flash
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
      ]
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plan = response.text();

    console.log("Successfully received response from Gemini API");
    console.log("Response length:", plan.length);

    // Return the generated plan
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error generating project plan:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to generate project plan';
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
