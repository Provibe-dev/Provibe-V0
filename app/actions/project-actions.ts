"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Document templates for different document types
const documentTemplates: Record<string, { title: string; content: string }> = {
  prd: {
    title: "Product Requirements Document",
    content: `
      # Product Requirements Document

      ## Overview
      
      ### Product Name
      [Project Name]
      
      ### Product Summary
      [Brief description of the product]
      
      ### Objectives
      - [Objective 1]
      - [Objective 2]
      - [Objective 3]
      
      ### Target Audience
      [Description of target users]
      
      ## Goals & Success Metrics
      
      ### Goals
      - [Goal 1]
      - [Goal 2]
      
      ### Success Metrics
      - [Metric 1]
      - [Metric 2]
      
      ## Features & Functionality
      
      ### Core Features
      1. [Feature 1]
      2. [Feature 2]
      3. [Feature 3]
      
      ### Future Enhancements
      - [Enhancement 1]
      - [Enhancement 2]
      
      ## Technical Requirements
      
      ### Platform
      [Web/Mobile/Desktop]
      
      ### Technologies
      - [Technology 1]
      - [Technology 2]
      
      ### Integration Points
      - [Integration 1]
      - [Integration 2]
      
      ## Timeline & Milestones
      
      ### Phase 1
      - [Milestone 1]
      - [Milestone 2]
      
      ### Phase 2
      - [Milestone 3]
      - [Milestone 4]
    `,
  },
  user_flow: {
    title: "User Flow",
    content: `
      # User Flow

      ## Overview
      This document outlines the primary user journeys for [Project Name].
      
      ## User Journey 1: [Journey Name]
      
      ### Trigger
      [What initiates this flow]
      
      ### Steps
      1. User [action]
      2. System [response]
      3. User [action]
      4. System [response]
      
      ### End State
      [Desired outcome]
      
      ## User Journey 2: [Journey Name]
      
      ### Trigger
      [What initiates this flow]
      
      ### Steps
      1. User [action]
      2. System [response]
      3. User [action]
      4. System [response]
      
      ### End State
      [Desired outcome]
      
      ## Error Flows
      
      ### Error Flow 1: [Error Scenario]
      [Description of error handling]
    `,
  },
  architecture: {
    title: "Architecture Document",
    content: `
      # Architecture Document

      ## Overview
      This document outlines the technical architecture for [Project Name].
      
      ## Tech Stack
      
      ### Frontend
      - [Framework/Library]
      - [UI Components]
      - [State Management]
      
      ### Backend
      - [Server Technology]
      - [API Framework]
      - [Authentication]
      
      ### Database
      - [Database Type]
      - [ORM/Query Builder]
      
      ### Infrastructure
      - [Hosting]
      - [CI/CD]
      - [Monitoring]
      
      ## System Architecture
      
      ### Component Diagram
      [Diagram description]
      
      ### Data Flow
      1. [Flow step 1]
      2. [Flow step 2]
      3. [Flow step 3]
      
      ## Security Considerations
      
      - [Security measure 1]
      - [Security measure 2]
      
      ## Scalability Strategy
      
      - [Scaling approach 1]
      - [Scaling approach 2]
    `,
  },
  schema: {
    title: "Database Schema",
    content: `
      # Database Schema

      ## Overview
      This document defines the database schema for [Project Name].
      
      ## Tables
      
      ### Table: users
      | Column | Type | Constraints | Description |
      |--------|------|-------------|-------------|
      | id | UUID | PRIMARY KEY | User identifier |
      | email | VARCHAR | UNIQUE, NOT NULL | User email |
      | name | VARCHAR | NOT NULL | User's full name |
      | created_at | TIMESTAMP | NOT NULL | Account creation time |
      
      ### Table: projects
      | Column | Type | Constraints | Description |
      |--------|------|-------------|-------------|
      | id | UUID | PRIMARY KEY | Project identifier |
      | user_id | UUID | FOREIGN KEY | Reference to users.id |
      | name | VARCHAR | NOT NULL | Project name |
      | description | TEXT | | Project description |
      | created_at | TIMESTAMP | NOT NULL | Creation time |
      
      ## Relationships
      
      - users 1:N projects (One user can have many projects)
      
      ## Indexes
      
      - users(email)
      - projects(user_id)
    `,
  },
  api_spec: {
    title: "API Specification",
    content: `
      # API Specification

      ## Overview
      This document outlines the API endpoints for [Project Name].
      
      ## Base URL
      \`https://api.example.com/v1\`
      
      ## Authentication
      All API requests require authentication using [Auth Method].
      
      ## Endpoints
      
      ### GET /resources
      
      **Description:** Retrieves a list of resources
      
      **Parameters:**
      - \`page\` (optional): Page number (default: 1)
      - \`limit\` (optional): Items per page (default: 20)
      
      **Response:**
      \`\`\`json
      {
        "data": [
          {
            "id": "resource_id",
            "name": "Resource Name",
            "created_at": "2023-01-01T00:00:00Z"
          }
        ],
        "meta": {
          "total": 100,
          "page": 1,
          "limit": 20
        }
      }
      \`\`\`
      
      ### POST /resources
      
      **Description:** Creates a new resource
      
      **Request Body:**
      \`\`\`json
      {
        "name": "New Resource",
        "description": "Resource description"
      }
      \`\`\`
      
      **Response:**
      \`\`\`json
      {
        "id": "new_resource_id",
        "name": "New Resource",
        "description": "Resource description",
        "created_at": "2023-01-01T00:00:00Z"
      }
      \`\`\`
    `,
  },
}

// Function to generate document content based on project data
function generateDocumentContent(docType: string, projectData: any): string {
  const template = documentTemplates[docType]?.content || ""

  // Replace placeholders with actual project data
  let content = template
    .replace(/\[Project Name\]/g, projectData.name || "Untitled Project")
    .replace(/\[Brief description of the product\]/g, projectData.idea || "")

  // Replace other placeholders based on product details
  if (projectData.product_details) {
    if (projectData.product_details.targetAudience) {
      content = content.replace(/\[Description of target users\]/g, projectData.product_details.targetAudience)
    }

    if (projectData.product_details.problemSolved) {
      content = content.replace(/\[Objective 1\]/g, `Solve: ${projectData.product_details.problemSolved}`)
    }

    if (projectData.product_details.keyFeatures) {
      const features = projectData.product_details.keyFeatures.split(",").map((f: string) => f.trim())
      for (let i = 0; i < 3; i++) {
        content = content.replace(`[Feature ${i + 1}]`, features[i] || `Feature ${i + 1}`)
      }
    }

    if (projectData.product_details.timeline) {
      content = content.replace(/\[Timeline details\]/g, projectData.product_details.timeline)
    }
  }

  // Replace any remaining placeholders with generic content
  content = content
    .replace(/\[Objective \d+\]/g, "Improve user experience")
    .replace(/\[Goal \d+\]/g, "Achieve market adoption")
    .replace(/\[Metric \d+\]/g, "User engagement rate")
    .replace(/\[Feature \d+\]/g, "Core functionality")
    .replace(/\[Enhancement \d+\]/g, "Future improvement")
    .replace(/\[Technology \d+\]/g, projectData.selected_tools?.[0] || "React")
    .replace(/\[Integration \d+\]/g, "Third-party service")
    .replace(/\[Milestone \d+\]/g, "Development milestone")
    .replace(/\[Journey Name\]/g, "User Registration")
    .replace(/\[What initiates this flow\]/g, "User clicks 'Sign Up' button")
    .replace(/\[action\]/g, "completes form")
    .replace(/\[response\]/g, "processes request")
    .replace(/\[Desired outcome\]/g, "User is registered and logged in")
    .replace(/\[Error Scenario\]/g, "Form Validation Error")
    .replace(/\[Description of error handling\]/g, "System displays validation errors and allows correction")
    .replace(/\[Framework\/Library\]/g, projectData.selected_tools?.[0] || "React")
    .replace(/\[UI Components\]/g, "Custom component library")
    .replace(/\[State Management\]/g, "Redux")
    .replace(/\[Server Technology\]/g, projectData.selected_tools?.[1] || "Node.js")
    .replace(/\[API Framework\]/g, "Express")
    .replace(/\[Authentication\]/g, "JWT")
    .replace(/\[Database Type\]/g, projectData.selected_tools?.[2] || "PostgreSQL")
    .replace(/\[ORM\/Query Builder\]/g, "Prisma")
    .replace(/\[Hosting\]/g, "Vercel")
    .replace(/\[CI\/CD\]/g, "GitHub Actions")
    .replace(/\[Monitoring\]/g, "Datadog")
    .replace(/\[Diagram description\]/g, "Microservices architecture with API Gateway")
    .replace(/\[Flow step \d+\]/g, "Data processing step")
    .replace(/\[Security measure \d+\]/g, "Input validation and sanitization")
    .replace(/\[Scaling approach \d+\]/g, "Horizontal scaling with load balancing")
    .replace(/\[Auth Method\]/g, "Bearer Token")

  return content
}

// Create a new project with better error handling and validation
export async function createNewProject(userId: string, projectName: string) {
  console.log("Creating new project:", { userId, projectName });

  try {
    // Validate inputs
    if (!userId) throw new Error("User ID is required");
    if (!projectName) throw new Error("Project name is required");

    // Check if a draft project already exists for this user
    const { data: existingDrafts, error: draftCheckError } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "draft")
      .created_at("gte", new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes
    
    if (!draftCheckError && existingDrafts && existingDrafts.length > 0) {
      // Return the existing draft project instead of creating a new one
      const { data: existingProject, error: fetchError } = await supabase
        .from("projects")
        .select()
        .eq("id", existingDrafts[0].id)
        .single();
        
      if (!fetchError && existingProject) {
        console.log("Using existing draft project:", existingProject.id);
        return { success: true, project: existingProject };
      }
    }

    // Create project in database with retry mechanism
    let retryCount = 0;
    let project = null;
    let error = null;

    while (retryCount < 3 && !project) {
      try {
        const { data, error: projectError } = await supabase
          .from("projects")
          .insert([
            {
              user_id: userId,
              name: projectName || "Untitled Project",
              status: "draft",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (projectError) throw projectError;
        project = data;
        break;
      } catch (err) {
        console.error(`Project creation attempt ${retryCount + 1} failed:`, err);
        error = err;
        retryCount++;
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!project) {
      throw error || new Error("Failed to create project after multiple attempts");
    }

    return { success: true, project };
  } catch (error) {
    console.error("Error in createNewProject:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error creating project" 
    };
  }
}

// Create a new project
export async function createProject(formData: FormData) {
  try {
    // Extract form data
    const userId = formData.get("userId") as string
    const projectName = (formData.get("projectName") as string) || "Untitled Project"
    const idea = formData.get("idea") as string
    const refinedIdea = formData.get("refinedIdea") as string
    const voiceNoteUrl = formData.get("voiceNoteUrl") as string
    const selectedTools = JSON.parse((formData.get("selectedTools") as string) || "[]")
    const productDetails = JSON.parse((formData.get("productDetails") as string) || "{}")
    const projectPlan = formData.get("projectPlan") as string
    const selectedDocuments = JSON.parse((formData.get("selectedDocuments") as string) || "[]")

    // Validate required fields
    if (!userId || !idea || selectedDocuments.length === 0) {
      throw new Error("Missing required fields")
    }

    // Check user's project limit
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_tier, projects_limit, credits_remaining")
      .eq("id", userId)
      .single()

    if (profileError) throw new Error("Failed to fetch user profile")

    // Count user's existing projects
    const { data: existingProjects, error: countError } = await supabase
      .from("projects")
      .select("id", { count: "exact" })
      .eq("user_id", userId)

    if (countError) throw new Error("Failed to count existing projects")

    const projectLimit = userProfile.subscription_tier === "pro" ? 20 : 2
    if (existingProjects && existingProjects.length >= projectLimit) {
      throw new Error(
        `You've reached your limit of ${projectLimit} projects. Please upgrade your plan or delete existing projects.`,
      )
    }

    // Check if user has enough credits
    const requiredCredits = selectedDocuments.length * 200
    if (userProfile.credits_remaining < requiredCredits) {
      throw new Error(
        `You need ${requiredCredits} credits to generate these documents. You have ${userProfile.credits_remaining} credits remaining.`,
      )
    }

    // Create project in database
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          user_id: userId,
          name: projectName,
          idea,
          refined_idea: refinedIdea,
          voice_note_url: voiceNoteUrl,
          selected_tools: selectedTools,
          product_details: productDetails,
          project_plan: projectPlan,
          status: "pending",
        },
      ])
      .select()

    if (projectError) throw new Error("Failed to create project")

    if (!project || project.length === 0) {
      throw new Error("Project creation failed")
    }

    const projectId = project[0].id

    // Log credit usage
    await supabase.from("credit_usage_log").insert([
      {
        user_id: userId,
        project_id: projectId,
        action: "document_generation",
        credits_used: requiredCredits,
      },
    ])

    // Update user credits
    await supabase
      .from("profiles")
      .update({
        credits_remaining: userProfile.credits_remaining - requiredCredits,
      })
      .eq("id", userId)

    // Trigger document generation (in a real app, this would call a Supabase Function)
    // For now, we'll simulate the generation by directly updating the documents
    // Create a new function for generating documents
    const { success, error, documentCount } = await generateDocuments(projectId, selectedDocuments)

    if (!success) {
      throw new Error(error || "Failed to generate documents")
    }

    // Revalidate the projects page
    revalidatePath("/dashboard/projects")

    // Return success with project details
    return {
      success: true,
      projectId,
      projectName: project[0].name,
      documentCount,
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Get a project and its documents
export async function getProject(projectId: string) {
  try {
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (projectError) throw new Error("Project not found")

    // Get project documents
    const { data: documents, error: documentsError } = await supabase
      .from("project_documents")
      .select("*")
      .eq("project_id", projectId)

    if (documentsError) throw new Error("Failed to fetch project documents")

    return {
      success: true,
      project,
      documents: documents || [],
    }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Regenerate a document
export async function regenerateDocument(documentId: string, userId: string) {
  try {
    // Get the document
    const { data: document, error: docError } = await supabase
      .from("project_documents")
      .select("*, projects(*)")
      .eq("id", documentId)
      .single()

    if (docError) throw new Error("Document not found")

    // Check if user has enough credits
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("id", userId)
      .single()

    if (profileError) throw new Error("Failed to fetch user profile")

    if (userProfile.credits_remaining < 200) {
      throw new Error("You need 200 credits to regenerate this document. Please upgrade your plan.")
    }

    // Update document status to generating
    await supabase.from("project_documents").update({ status: "generating" }).eq("id", documentId)

    // Log credit usage
    await supabase.from("credit_usage_log").insert([
      {
        user_id: userId,
        project_id: document.project_id,
        document_id: documentId,
        action: "document_regeneration",
        credits_used: 200,
      },
    ])

    // Update user credits
    await supabase
      .from("profiles")
      .update({
        credits_remaining: userProfile.credits_remaining - 200,
      })
      .eq("id", userId)

    // Simulate document regeneration
    setTimeout(async () => {
      try {
        // Simulate generation time
        await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

        // Generate new content
        const content = generateDocumentContent(document.type, document.projects)

        // Update document with new content
        await supabase
          .from("project_documents")
          .update({
            content,
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId)
      } catch (error) {
        console.error("Error in document regeneration:", error)

        // Update document status to error
        await supabase
          .from("project_documents")
          .update({
            status: "error",
            error_message: (error as Error).message,
          })
          .eq("id", documentId)
      }
    }, 1000)

    return { success: true }
  } catch (error) {
    console.error("Error regenerating document:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Create a new function for generating documents
export async function generateDocuments(projectId: string, selectedDocuments: string[]) {
  try {
    console.log(`Generating ${selectedDocuments.length} documents for project ${projectId}`)

    // Get the project data for content generation
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (projectError) {
      console.error("Error fetching project data:", projectError)
      throw new Error("Failed to fetch project data")
    }

    // Create document placeholders
    const documentPromises = selectedDocuments.map(async (docType) => {
      const docTemplate = documentTemplates[docType]
      if (!docTemplate) {
        console.error(`No template found for document type: ${docType}`)
        return null
      }

      try {
        // Create document placeholder
        const { data: document, error: docError } = await supabase
          .from("project_documents")
          .insert([
            {
              project_id: projectId,
              title: docTemplate.title,
              type: docType,
              content: "",
              status: "pending",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (docError) {
          console.error(`Error creating document placeholder for ${docType}:`, docError)
          throw docError
        }

        return document
      } catch (error) {
        console.error(`Error creating document for ${docType}:`, error)
        return null
      }
    })

    // Wait for all document placeholders to be created
    const documents = await Promise.all(documentPromises)
    const validDocuments = documents.filter(Boolean)

    console.log(`Created ${validDocuments.length} document placeholders`)

    // Now generate content for each document
    for (const doc of validDocuments) {
      if (!doc) continue

      try {
        // Update status to generating
        await supabase.from("project_documents").update({ status: "generating" }).eq("id", doc.id)

        // Generate content
        const content = generateDocumentContent(doc.type, projectData)

        // Update document with content
        const { error: updateError } = await supabase
          .from("project_documents")
          .update({
            content,
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", doc.id)

        if (updateError) {
          console.error(`Error updating document ${doc.id} with content:`, updateError)
          throw updateError
        }

        console.log(`Generated content for document ${doc.id} of type ${doc.type}`)
      } catch (error) {
        console.error(`Error generating content for document ${doc.id}:`, error)

        // Update document status to error
        await supabase
          .from("project_documents")
          .update({
            status: "error",
            error_message: error instanceof Error ? error.message : "Unknown error during generation",
            updated_at: new Date().toISOString(),
          })
          .eq("id", doc.id)
      }
    }

    // Update project status to completed
    await supabase
      .from("projects")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)

    return {
      success: true,
      message: `Generated ${validDocuments.length} documents successfully`,
      documentCount: validDocuments.length,
    }
  } catch (error) {
    console.error("Error generating documents:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during document generation",
    }
  }
}
