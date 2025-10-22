import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  code?: string
  message?: string
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data }, { status })
}

/**
 * Create a created response
 */
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, 201)
}

/**
 * Create a no content response
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json({ error, code }, { status })
}
