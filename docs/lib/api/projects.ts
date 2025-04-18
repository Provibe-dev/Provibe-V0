import { supabase } from "@/lib/supabase-client";

export async function createProject(userId: string, name: string) {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ user_id: userId, name, status: "draft" }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, payload: Record<string, unknown>) {
  const { error } = await supabase.from("projects").update(payload).eq("id", id);
  if (error) throw error;
}
// add saveIdea, saveDetails, setTools as thin wrappers calling updateProject