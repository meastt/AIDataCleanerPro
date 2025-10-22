// Core data types for DataCleanerPro

export type UserPlan = 'free' | 'pro'

export interface User {
  id: string
  email: string
  plan: UserPlan
  createdAt: Date
}

export interface File {
  id: string
  userId: string
  originalName: string
  storageKey: string
  mime: string
  rowsEstimated?: number
  sha256: string
  createdAt: Date
}

export type JobStatus = 'queued' | 'processing' | 'needs_review' | 'complete' | 'failed'

export type RecipeType =
  | 'dedupe_by_columns'
  | 'normalize_dates'
  | 'normalize_phones'
  | 'normalize_emails'
  | 'title_case_names'
  | 'map_job_titles'
  | 'normalize_companies'

export interface Job {
  id: string
  userId: string
  fileId: string
  recipe: RecipeType
  params?: Record<string, unknown>
  status: JobStatus
  startedAt?: Date
  finishedAt?: Date
  llmTokensIn: number
  llmTokensOut: number
  costUsd: number
  previewKey?: string
  resultKey?: string
  undoKey?: string
  confidence?: number
}

export type RecipeEngine = 'pandas' | 'llm'

export interface RecipeRun {
  id: string
  jobId: string
  stepOrder: number
  engine: RecipeEngine
  inputSample?: string
  outputSample?: string
  confidence?: number
  notes?: string
}

// LLM response types
export interface JobTitleClassification {
  label: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Director' | 'VP' | 'C-Level' | 'Unknown'
}

export interface DateNormalization {
  date: string // YYYY-MM-DD or 'Unknown'
  confidence: number
}

export interface CompanyNormalization {
  normalized: string
}

// Recipe parameters
export interface DedupeParams {
  columns: string[]
  keepFirst?: boolean
}

export interface DateNormalizeParams {
  columns: string[]
  localeHint?: string
}

export interface PhoneNormalizeParams {
  columns: string[]
  defaultCountry?: string
}

export interface EmailNormalizeParams {
  columns: string[]
}

export interface TitleCaseParams {
  columns: string[]
  exceptions?: string[]
}

export interface JobTitleMapParams {
  column: string
}

export interface CompanyNormalizeParams {
  column: string
}
