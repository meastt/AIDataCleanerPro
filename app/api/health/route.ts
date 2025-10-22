import { NextResponse } from 'next/server'
import { successResponse } from '@/app/lib/api/response'
import { withErrorHandler } from '@/app/lib/api/errors'

async function handler() {
  return successResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  })
}

export const GET = withErrorHandler(handler)
