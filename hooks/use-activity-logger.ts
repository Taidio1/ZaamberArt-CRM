import { useCallback } from 'react'
import { logUserActivity } from '@/lib/supabase'

export interface ActivityLoggerHook {
  logActivity: (action: string, details?: any) => Promise<void>
  logPageView: (pageName: string) => Promise<void>
  logUserAction: (action: string, details?: any) => Promise<void>
}

export const useActivityLogger = (userId?: string | null): ActivityLoggerHook => {
  const logActivity = useCallback(async (action: string, details?: any) => {
    try {
      await logUserActivity(userId || null, action, {
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.pathname : undefined,
        ...details
      })
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }, [userId])

  const logPageView = useCallback(async (pageName: string) => {
    await logActivity('view_page', {
      page: pageName,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined
    })
  }, [logActivity])

  const logUserAction = useCallback(async (action: string, details?: any) => {
    await logActivity(action, details)
  }, [logActivity])

  return {
    logActivity,
    logPageView,
    logUserAction
  }
} 