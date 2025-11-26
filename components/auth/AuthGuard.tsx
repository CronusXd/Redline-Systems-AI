'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
  fallback,
  loadingComponent
}) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Usuário não autenticado tentando acessar área protegida
        const currentPath = window.location.pathname
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
        router.push(redirectUrl)
      } else if (!requireAuth && user) {
        // Usuário autenticado tentando acessar área pública (como login)
        router.push('/dashboard')
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso restrito
          </h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para acessar esta página
          </p>
          <button
            onClick={() => router.push(redirectTo)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fazer login
          </button>
        </div>
      </div>
    )
  }

  // Se não requer autenticação mas usuário está logado (ex: página de login)
  if (!requireAuth && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
  }

  // Renderizar conteúdo se as condições de autenticação forem atendidas
  return <>{children}</>
}

// Hook personalizado para verificar autenticação
export const useRequireAuth = (redirectTo: string = '/auth/login') => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
  }, [user, loading, redirectTo, router])

  return { user, loading, isAuthenticated: !!user }
}

// Hook para verificar se usuário NÃO deve estar autenticado
export const useRequireGuest = (redirectTo: string = '/dashboard') => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, redirectTo, router])

  return { user, loading, isGuest: !user }
}

export { AuthGuard }