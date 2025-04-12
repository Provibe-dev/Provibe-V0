export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: "free" | "pro"
          credits_remaining: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro"
          credits_remaining?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro"
          credits_remaining?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          idea: string | null
          refined_idea: string | null
          voice_note_url: string | null
          selected_tools: string[] | null
          product_details: Json | null
          project_plan: string | null
          status: "draft" | "completed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          idea?: string | null
          refined_idea?: string | null
          voice_note_url?: string | null
          selected_tools?: string[] | null
          product_details?: Json | null
          project_plan?: string | null
          status?: "draft" | "completed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          idea?: string | null
          refined_idea?: string | null
          voice_note_url?: string | null
          selected_tools?: string[] | null
          product_details?: Json | null
          project_plan?: string | null
          status?: "draft" | "completed"
          created_at?: string
          updated_at?: string
        }
      }
      project_documents: {
        Row: {
          id: string
          project_id: string
          title: string
          type: string
          content: string | null
          status: "pending" | "generating" | "completed" | "error"
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          type: string
          content?: string | null
          status?: "pending" | "generating" | "completed" | "error"
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          type?: string
          content?: string | null
          status?: "pending" | "generating" | "completed" | "error"
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      credit_usage_log: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          document_id: string | null
          action: "idea_refinement" | "ai_answer" | "plan_generation" | "document_generation" | "document_regeneration"
          credits_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          document_id?: string | null
          action: "idea_refinement" | "ai_answer" | "plan_generation" | "document_generation" | "document_regeneration"
          credits_used: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          document_id?: string | null
          action?: "idea_refinement" | "ai_answer" | "plan_generation" | "document_generation" | "document_regeneration"
          credits_used?: number
          created_at?: string
        }
      }
      ai_tools: {
        Row: {
          id: string
          name: string
          category: string | null
          logo: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          category?: string | null
          logo: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          logo?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
