import { ALLOWED_MIME_TYPES, ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from '@/app/lib/constants'
import type { UserPlan } from '@/app/types'

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type as any)
  const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  )
  return hasValidMime || hasValidExtension
}

/**
 * Validate file size based on user plan
 */
export function isValidFileSize(file: File, plan: UserPlan): boolean {
  const limit = FILE_LIMITS[plan].maxFileSizeBytes
  return file.size <= limit
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase()
}

/**
 * Generate a safe storage key for a file
 */
export function generateStorageKey(userId: string, filename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const ext = getFileExtension(filename)
  return `${userId}/${timestamp}-${random}${ext}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Estimate number of rows from file size (rough estimate)
 */
export function estimateRowCount(fileSizeBytes: number): number {
  // Rough estimate: average 100 bytes per row
  return Math.floor(fileSizeBytes / 100)
}

/**
 * Calculate SHA-256 hash of a file
 */
export async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}
