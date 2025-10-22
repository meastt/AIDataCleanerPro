import type { RecipeType } from '@/app/types'

// Recipe definitions
export const RECIPES = {
  dedupe_by_columns: {
    id: 'dedupe_by_columns' as const,
    name: 'Remove Duplicates',
    description: 'Remove duplicate rows based on selected columns',
    category: 'cleaning',
    engine: 'pandas' as const,
    icon: '🗑️',
    requiresColumns: true,
  },
  normalize_dates: {
    id: 'normalize_dates' as const,
    name: 'Normalize Dates',
    description: 'Convert dates to ISO format (YYYY-MM-DD)',
    category: 'normalization',
    engine: 'hybrid' as const, // deterministic first, LLM for ambiguous
    icon: '📅',
    requiresColumns: true,
  },
  normalize_phones: {
    id: 'normalize_phones' as const,
    name: 'Normalize Phone Numbers',
    description: 'Standardize phone numbers to E.164 format',
    category: 'normalization',
    engine: 'hybrid' as const,
    icon: '📞',
    requiresColumns: true,
  },
  normalize_emails: {
    id: 'normalize_emails' as const,
    name: 'Normalize Emails',
    description: 'Trim, lowercase, and validate email addresses',
    category: 'normalization',
    engine: 'pandas' as const,
    icon: '📧',
    requiresColumns: true,
  },
  title_case_names: {
    id: 'title_case_names' as const,
    name: 'Title Case Names',
    description: 'Convert names to proper title case',
    category: 'formatting',
    engine: 'pandas' as const,
    icon: '✨',
    requiresColumns: true,
  },
  map_job_titles: {
    id: 'map_job_titles' as const,
    name: 'Map Job Titles to Seniority',
    description: 'Classify job titles into seniority levels',
    category: 'enrichment',
    engine: 'llm' as const,
    icon: '💼',
    requiresColumns: true,
    requiresPro: true, // Pro feature
  },
  normalize_companies: {
    id: 'normalize_companies' as const,
    name: 'Normalize Company Names',
    description: 'Standardize company names and remove legal suffixes',
    category: 'enrichment',
    engine: 'llm' as const,
    icon: '🏢',
    requiresColumns: true,
    requiresPro: true, // Pro feature
  },
} as const

export type RecipeConfig = (typeof RECIPES)[keyof typeof RECIPES]

// File upload limits
export const FILE_LIMITS = {
  free: {
    maxFileSizeMB: 5,
    maxFileSizeBytes: 5 * 1024 * 1024,
    maxRows: 5000,
    maxJobsPerDay: 2,
  },
  pro: {
    maxFileSizeMB: 50,
    maxFileSizeBytes: 50 * 1024 * 1024,
    maxRows: 100000,
    maxJobsPerDay: 1000,
  },
} as const

// Allowed MIME types
export const ALLOWED_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const

export const ALLOWED_FILE_EXTENSIONS = ['.csv', '.xls', '.xlsx'] as const

// Pricing tiers
export const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 2 jobs per day',
      'Max 5,000 rows per job',
      '5 MB file size limit',
      'Basic recipes (dedupe, dates, phones, emails)',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 12,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      'Up to 1,000 jobs per day',
      'Max 100,000 rows per job',
      '50 MB file size limit',
      'All recipes including AI-powered',
      'Google Sheets integration',
      'Priority queue',
      'Audit exports',
      'Email support',
    ],
  },
} as const

// Data lifecycle
export const DATA_RETENTION_DAYS = 7

// Confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  high: 0.9,
  medium: 0.7,
  low: 0.5,
  needsReview: 0.85, // Below this, job needs manual review
} as const

// LLM settings
export const LLM_CONFIG = {
  maxRetries: 1,
  timeout: 30000, // 30 seconds
  batchSize: 100, // Process in batches for large datasets
  cacheExpiration: 30 * 24 * 60 * 60, // 30 days in seconds
} as const

// Job seniority levels for classification
export const JOB_SENIORITY_LEVELS = [
  'Intern',
  'Junior',
  'Mid',
  'Senior',
  'Lead',
  'Director',
  'VP',
  'C-Level',
  'Unknown',
] as const

export type JobSeniorityLevel = (typeof JOB_SENIORITY_LEVELS)[number]

// Name title case exceptions
export const NAME_EXCEPTIONS = [
  'McDonald',
  'MacDonald',
  "O'Brien",
  "O'Connor",
  "O'Reilly",
  'van',
  'von',
  'de',
  'del',
  'della',
  'di',
  'da',
  'le',
  'la',
] as const

// Common company suffixes to normalize
export const COMPANY_SUFFIXES = [
  'Inc',
  'Inc.',
  'Incorporated',
  'LLC',
  'L.L.C.',
  'Ltd',
  'Ltd.',
  'Limited',
  'Corp',
  'Corp.',
  'Corporation',
  'Co',
  'Co.',
  'Company',
  'LLP',
  'L.L.P.',
  'LP',
  'L.P.',
  'PLC',
  'P.L.C.',
] as const

// API rate limits
export const RATE_LIMITS = {
  free: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
  },
  pro: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
  },
} as const

// Preview settings
export const PREVIEW_CONFIG = {
  maxRowsToShow: 100, // Show max 100 rows in preview
  topRows: 10, // Show first 10 rows
  bottomRows: 10, // Show last 10 rows
  randomSampleSize: 10, // Plus 10 random rows from middle
} as const
