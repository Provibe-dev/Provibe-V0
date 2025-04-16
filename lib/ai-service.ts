import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize the AI clients
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates document content using AI based on document type and project data
 */
export async function generateAIDocument(
  docType: string,
  project: any,
  projectPlan?: string
): Promise<string> {
  try {
    console.log(`Generating ${docType} document for project ${project.id}`);
    
    // Choose which AI service to use based on document type or environment
    const useGemini = process.env.PREFERRED_AI_SERVICE === 'gemini';
    
    if (useGemini) {
      return await generateWithGemini(docType, project, projectPlan);
    } else {
      return await generateWithOpenAI(docType, project, projectPlan);
    }
  } catch (error) {
    console.error(`Error generating ${docType} document:`, error);
    throw new Error(`Failed to generate ${docType} document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate document using Google's Gemini API
 */
async function generateWithGemini(
  docType: string,
  project: any,
  projectPlan?: string
): Promise<string> {
  // Create prompt based on document type
  const prompt = createPromptForDocType(docType, project, projectPlan);
  
  // Get the generative model
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
  return response.text();
}

/**
 * Generate document using OpenAI's API
 */
async function generateWithOpenAI(
  docType: string,
  project: any,
  projectPlan?: string
): Promise<string> {
  // Create prompt based on document type
  const prompt = createPromptForDocType(docType, project, projectPlan);
  
  // Call OpenAI to generate document
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: getSystemPromptForDocType(docType)
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content || '';
}

/**
 * Create appropriate prompt based on document type
 */
function createPromptForDocType(
  docType: string,
  project: any,
  projectPlan?: string
): string {
  const baseContext = `
Project Name: ${project.name}
Project Idea: ${project.refined_idea || project.idea}
${projectPlan ? `Project Plan: ${projectPlan}` : ''}
${project.product_details ? `Product Details: ${JSON.stringify(project.product_details)}` : ''}
${project.selected_tools ? `Selected Tools: ${project.selected_tools.join(', ')}` : ''}
`;

  switch (docType) {
    case 'prd':
      return `${baseContext}
Please create a comprehensive Product Requirements Document (PRD) for this project.
Include sections for: Overview, Problem Statement, User Personas, User Stories, Features, Non-functional Requirements, and Success Metrics.`;
      
    case 'user_flow':
      return `${baseContext}
Please create a detailed User Flow document for this project.
Include key user journeys, main screens/pages, and interaction points.
Format this as a markdown document with clear sections and bullet points.`;
      
    case 'architecture':
      return `${baseContext}
Please create a Technical Architecture document for this project.
Include sections for: Tech Stack, System Architecture, Data Flow, APIs, Security Considerations, and Scalability Strategy.
Format this as a markdown document with clear sections and bullet points.`;
      
    case 'schema':
      return `${baseContext}
Please create a Database Schema document for this project.
Include entity definitions, relationships, key fields, and data types.
Format this as a markdown document with clear sections.`;
      
    case 'api_spec':
      return `${baseContext}
Please create an API Specification document for this project.
Include endpoints, request/response formats, authentication methods, and error handling.
Format this as a markdown document with clear sections.`;
      
    default:
      return `${baseContext}
Please create a detailed document for the ${docType} aspect of this project.
Format this as a markdown document with clear sections.`;
  }
}

/**
 * Get system prompt based on document type
 */
function getSystemPromptForDocType(docType: string): string {
  switch (docType) {
    case 'prd':
      return "You are a senior product manager with expertise in creating detailed product requirement documents. Create a comprehensive PRD in markdown format.";
      
    case 'user_flow':
      return "You are a UX designer with expertise in mapping user journeys and flows. Create a detailed user flow document in markdown format.";
      
    case 'architecture':
      return "You are a senior software architect with expertise in designing scalable systems. Create a comprehensive technical architecture document in markdown format.";
      
    case 'schema':
      return "You are a database engineer with expertise in designing efficient database schemas. Create a detailed database schema document in markdown format.";
      
    case 'api_spec':
      return "You are an API designer with expertise in RESTful API design. Create a comprehensive API specification document in markdown format.";
      
    default:
      return "You are a technical documentation expert. Create a detailed document in markdown format.";
  }
}