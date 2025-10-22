import { createClient } from '@/app/lib/supabase/server'
import { UnauthorizedError } from './errors'
import type { User } from '@supabase/supabase-js'

/**
 * Get the current authenticated user from request
 * Throws UnauthorizedError if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new UnauthorizedError('Authentication required')
  }

  return user
}

/**
 * Get the current user without throwing if not authenticated
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

/**
 * Check if user has a specific plan
 */
export async function requirePlan(requiredPlan: 'pro'): Promise<User> {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: userData, error } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (error || !userData) {
    throw new UnauthorizedError('Unable to verify user plan')
  }

  if (userData.plan !== requiredPlan) {
    throw new UnauthorizedError(`This feature requires a ${requiredPlan} plan`)
  }

  return user
}
