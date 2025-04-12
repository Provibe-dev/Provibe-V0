import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"
import { getServiceSupabase } from "./supabase-client"

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
export function generateDocumentContent(docType: string, projectData: any): string {
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

// Generate documents for a project
export async function generateDocuments(projectId: string, selectedDocuments: string[]) {
  try {
    console.log(`Generating ${selectedDocuments.length} documents for project ${projectId}`)

    // Check if we're in the browser
    const isBrowser = typeof window !== "undefined"
    // Check if we're in the v0 preview environment
    const isV0Preview = isBrowser && window.location.hostname.includes("vusercontent.net")

    if (isBrowser) {
      console.log("Running in browser environment")
      
      if (isV0Preview) {
        console.log("Using mock document generation for preview environment")
        // Simulate document generation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return {
          success: true,
          message: `Generated ${selectedDocuments.length} documents successfully in preview mode`,
          documentCount: selectedDocuments.length,
        }
      } else {
        // For client-side execution in production, we should call an API endpoint
        // that runs the document generation server-side
        console.log("Calling server-side API for document generation")
        try {
          const response = await fetch(`/api/projects/${projectId}/documents`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedDocuments }),
          })
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`)
          }
          
          const result = await response.json()
          return result
        } catch (error) {
          console.error("Error calling document generation API:", error)
          throw new Error("Failed to generate documents via API")
        }
      }
    }

    // Server-side execution
    console.log("Running in server environment")
    
    // Get the service role client
    const supabase = getServiceSupabase()

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
