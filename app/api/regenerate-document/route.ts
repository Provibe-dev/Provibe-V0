import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-client';
import { generateAIDocument } from '@/lib/ai-service';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { documentId, projectId } = await request.json();
    
    if (!documentId || !projectId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const supabase = getServiceSupabase();
    
    // Get document info
    const { data: document, error: docError } = await supabase
      .from('project_documents')
      .select('*')
      .eq('id', documentId)
      .single();
      
    if (docError || !document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Generate new content
    const content = await generateAIDocument(document.type, project);
    
    // Update document
    const { data, error } = await supabase
      .from('project_documents')
      .update({ 
        content,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    // Revalidate the document page
    revalidatePath(`/dashboard/projects/${projectId}/documents/${documentId}`);
    
    return NextResponse.json({ success: true, document: data });
  } catch (error) {
    console.error('Error regenerating document:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}