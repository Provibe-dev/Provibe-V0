import { getServiceSupabase } from './supabase-client';
import { generateAIDocument } from '@/lib/ai-service';

export async function generateDocuments(
  projectId: string, 
  documentTypes: string[],
  projectPlan?: string
) {
  try {
    const supabase = getServiceSupabase();
    
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      return { success: false, error: 'Project not found' };
    }
    
    // Generate each document
    const generatedDocuments = [];
    
    for (const docType of documentTypes) {
      // Generate document content using AI
      const content = await generateAIDocument(docType, project, projectPlan);
      
      // Insert document into database
      const { data, error } = await supabase
        .from('project_documents')
        .insert({
          project_id: projectId,
          type: docType,
          content,
          status: 'completed'
        })
        .select()
        .single();
        
      if (error) {
        console.error(`Error creating ${docType} document:`, error);
        return { success: false, error: `Failed to create ${docType} document` };
      }
      
      generatedDocuments.push(data);
    }
    
    return { success: true, documents: generatedDocuments };
  } catch (error) {
    console.error('Error in generateDocuments:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
