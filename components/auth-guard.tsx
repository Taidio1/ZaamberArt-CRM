'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'

// Strony które nie wymagają logowania
const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      const isPublicPath = publicPaths.includes(pathname)
      
      if (!user && !isPublicPath) {
        // Użytkownik nie jest zalogowany i próbuje dostać się do chronionej strony
        router.push('/login')
      } else if (user && isPublicPath) {
        // Użytkownik jest zalogowany i próbuje dostać się do strony logowania
        router.push('/')
      }
    }
  }, [user, loading, pathname, router])

  // Pokazuj loading podczas sprawdzania autentykacji
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    )
  }

  // Jeśli użytkownik nie jest zalogowany i próbuje dostać się do chronionej strony
  const isPublicPath = publicPaths.includes(pathname)
  if (!user && !isPublicPath) {
    return null // AuthGuard przekieruje w useEffect
  }

  // Renderuj children tylko jeśli użytkownik ma dostęp
  return <>{children}</>
} 