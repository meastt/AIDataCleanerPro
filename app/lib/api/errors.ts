import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', code?: string) {
    super(400, message, code)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', code?: string) {
    super(401, message, code)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden', code?: string) {
    super(403, message, code)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found', code?: string) {
    super(404, message, code)
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict', code?: string) {
    super(409, message, code)
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too Many Requests', code?: string) {
    super(429, message, code)
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal Server Error', code?: string) {
    super(500, message, code)
  }
}

/**
 * Handle errors and return appropriate API response
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle ApiError instances
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    )
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }

  // Unknown error
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  )
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
