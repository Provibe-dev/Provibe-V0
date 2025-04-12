import { NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"
import { generateDocumentContent } from "@/lib/generate-documents"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const { selectedDocuments } = await request.json()
    
    console.log(`API: Generating ${selectedDocuments.length} documents for project ${projectId}`)
    
    // Get the service role client (this will work server-side)
    const supabase = getServiceSupabase()
    
    // Get the project data for content generation
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()
      
    if (projectError) {
      console.error("Error fetching project data:", projectError)
      return NextResponse.json(
        { success: false, error: "Failed to fetch project data" },
        { status: 500 }
      )
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
      
    return NextResponse.json({
      success: true,
      message: `Generated ${validDocuments.length} documents successfully`,
      documentCount: validDocuments.length,
    })
  } catch (error) {
    console.error("Error generating documents:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during document generation",
      },
      { status: 500 }
    )
  }
}

// Document templates for different document types
const documentTemplates: Record<string, { title: string; content: string }> = {
  prd: {
    title: "Product Requirements Document",
    content: `...` // Same content as in generate-documents.ts
  },
  user_flow: {
    title: "User Flow",
    content: `...` // Same content as in generate-documents.ts
  },
  architecture: {
    title: "Architecture Document",
    content: `...` // Same content as in generate-documents.ts
  },
  schema: {
    title: "Database Schema",
    content: `...` // Same content as in generate-documents.ts
  },
  api_spec: {
    title: "API Specification",
    content: `...` // Same content as in generate-documents.ts
  },
}