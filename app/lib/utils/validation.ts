import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z.string().email()

/**
 * Validate and normalize email
 */
export function normalizeEmail(email: string): string | null {
  try {
    const normalized = email.trim().toLowerCase()
    emailSchema.parse(normalized)
    return normalized
  } catch {
    return null
  }
}

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid()

/**
 * CSV column name validation
 */
export const columnNameSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_\s-]+$/, 'Column name contains invalid characters')

/**
 * Validate array of column names
 */
export function validateColumnNames(columns: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (columns.length === 0) {
    errors.push('At least one column must be selected')
    return { valid: false, errors }
  }

  for (const col of columns) {
    try {
      columnNameSchema.parse(col)
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`Invalid column name "${col}": ${error.errors[0]?.message}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if a value looks like a date
 */
export function looksLikeDate(value: string): boolean {
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY or DD/MM/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY or DD-MM-YYYY
    /^\d{1,2}\s+\w+\s+\d{4}$/, // 1 January 2024
  ]
  return datePatterns.some(pattern => pattern.test(value.trim()))
}

/**
 * Check if a value looks like a phone number
 */
export function looksLikePhone(value: string): boolean {
  const phonePattern = /^[\d\s()+-]+$/
  const digitCount = value.replace(/\D/g, '').length
  return phonePattern.test(value) && digitCount >= 7 && digitCount <= 15
}

/**
 * Check if a value looks like an email
 */
export function looksLikeEmail(value: string): boolean {
  try {
    emailSchema.parse(value)
    return true
  } catch {
    return false
  }
}

/**
 * Redact PII from text for LLM processing
 */
export function redactPII(text: string, preserveFormat: boolean = false): string {
  let redacted = text

  // Redact emails
  redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, match =>
    preserveFormat ? 'email@example.com' : '[EMAIL]'
  )

  // Redact phone numbers
  redacted = redacted.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, match =>
    preserveFormat ? '555-555-5555' : '[PHONE]'
  )

  // Redact SSN-like patterns
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')

  return redacted
}
