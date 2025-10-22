// Database types - these should be generated from Supabase
// Run: npx supabase gen types typescript --local > app/types/database.ts
// For now, we'll use a placeholder that can be replaced with generated types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          plan: 'free' | 'pro'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          plan?: 'free' | 'pro'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          plan?: 'free' | 'pro'
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          original_name: string
          storage_key: string
          mime: string
          rows_estimated: number | null
          sha256: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_name: string
          storage_key: string
          mime: string
          rows_estimated?: number | null
          sha256: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_name?: string
          storage_key?: string
          mime?: string
          rows_estimated?: number | null
          sha256?: string
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          file_id: string
          recipe: string
          params: Json | null
          status: 'queued' | 'processing' | 'needs_review' | 'complete' | 'failed'
          started_at: string | null
          finished_at: string | null
          llm_tokens_in: number
          llm_tokens_out: number
          cost_usd: number
          preview_key: string | null
          result_key: string | null
          undo_key: string | null
          confidence: number | null
        }
        Insert: {
          id?: string
          user_id: string
          file_id: string
          recipe: string
          params?: Json | null
          status?: 'queued' | 'processing' | 'needs_review' | 'complete' | 'failed'
          started_at?: string | null
          finished_at?: string | null
          llm_tokens_in?: number
          llm_tokens_out?: number
          cost_usd?: number
          preview_key?: string | null
          result_key?: string | null
          undo_key?: string | null
          confidence?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          file_id?: string
          recipe?: string
          params?: Json | null
          status?: 'queued' | 'processing' | 'needs_review' | 'complete' | 'failed'
          started_at?: string | null
          finished_at?: string | null
          llm_tokens_in?: number
          llm_tokens_out?: number
          cost_usd?: number
          preview_key?: string | null
          result_key?: string | null
          undo_key?: string | null
          confidence?: number | null
        }
      }
      recipe_runs: {
        Row: {
          id: string
          job_id: string
          step_order: number
          engine: 'pandas' | 'llm'
          input_sample: string | null
          output_sample: string | null
          confidence: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          job_id: string
          step_order: number
          engine: 'pandas' | 'llm'
          input_sample?: string | null
          output_sample?: string | null
          confidence?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          step_order?: number
          engine?: 'pandas' | 'llm'
          input_sample?: string | null
          output_sample?: string | null
          confidence?: number | null
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_old_files: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
