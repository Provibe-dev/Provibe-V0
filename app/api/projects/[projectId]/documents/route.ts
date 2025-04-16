// This file should be moved to the correct path: app/api/projects/[projectId]/documents/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateAIDocument } from '@/lib/ai-service';

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;
    console.log("Document generation request for project:", projectId);
    
    // Parse request body
    const body = await request.json();
    const { selectedDocuments, projectPlan } = body;
    
    console.log("Selected documents:", selectedDocuments);
    
    if (!selectedDocuments || !Array.isArray(selectedDocuments) || selectedDocuments.length === 0) {
      return NextResponse.json({ error: 'No documents selected' }, { status: 400 });
    }
    
    // Get project data
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      console.error("Project not found:", projectError);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Verify user has sufficient credits
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, credits_remaining')
      .eq('id', project.user_id)
      .single();
      
    if (userError || !userData) {
      console.error("User not found:", userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Calculate total cost
    const documentTypes = [
      { id: "prd", cost: 200 },
      { id: "user_flow", cost: 200 },
      { id: "architecture", cost: 200 },
      { id: "schema", cost: 200 },
      { id: "api_spec", cost: 200 },
    ];

    const totalCost = selectedDocuments.reduce((sum, docId) => {
      const doc = documentTypes.find(d => d.id === docId);
      return sum + (doc?.cost || 0);
    }, 0);
    
    if (userData.credits_remaining < totalCost) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }
    
    // Create documents for each selected type
    for (const docType of selectedDocuments) {
      // Find document type details
      const documentTypeInfo = documentTypes.find(d => d.id === docType);
      if (!documentTypeInfo) continue;

      // Generate content using the AI service instead of mock data
      const documentContent = await generateAIDocument(docType, project, projectPlan || "");

      // Create document record
      const { error: docError } = await supabaseAdmin
        .from('project_documents')
        .insert({
          project_id: projectId,
          title: docType.charAt(0).toUpperCase() + docType.slice(1).replace('_', ' '),
          type: docType,
          content: documentContent,
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (docError) {
        console.error(`Error creating document record for ${docType}:`, docError);
        throw new Error(`Failed to create document: ${docError.message}`);
      }
    }
    
    // Deduct credits from user
    const { error: creditError } = await supabaseAdmin
      .from('profiles')
      .update({ credits_remaining: userData.credits_remaining - totalCost })
      .eq('id', userData.id);
      
    if (creditError) {
      console.error("Error updating user credits:", creditError);
      // We don't want to fail the request if credits update fails
      // Just log it and continue
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Generated ${selectedDocuments.length} documents successfully`,
      documentCount: selectedDocuments.length
    });
  } catch (error) {
    console.error('Error in document generation API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
