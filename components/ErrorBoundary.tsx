'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './ui/Button'
import { logError } from '@/lib/utils/auth'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    logError(error, 'ErrorBoundary')
    
    // Callback personalizado
    this.props.onError?.(error, errorInfo)
    
    // Atualizar estado com informações do erro
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Renderizar fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Renderizar página de erro padrão
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Algo deu errado
              </h1>
              
              <p className="text-gray-600 mb-6">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
              </p>

              {/* Mostrar detalhes do erro em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-3 bg-gray-100 rounded-md text-left">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Erro (desenvolvimento):
                  </p>
                  <p className="text-xs text-gray-700 font-mono">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                  fullWidth
                >
                  Tentar novamente
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  leftIcon={<Home className="h-4 w-4" />}
                  fullWidth
                >
                  Voltar ao início
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Se o problema persistir, entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para capturar erros em componentes funcionais
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    logError(error, context)
    
    // Em um cenário real, você pode mostrar um toast ou modal de erro
    console.error('Error handled:', error)
  }

  return { handleError }
}

// Componente de erro para páginas específicas
export const ErrorPage: React.FC<{
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}> = ({
  title = 'Página não encontrada',
  message = 'A página que você está procurando não existe ou foi movida.',
  onRetry,
  showRetry = false
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="space-y-3">
            {showRetry && onRetry && (
              <Button
                onClick={onRetry}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                fullWidth
              >
                Tentar novamente
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              leftIcon={<Home className="h-4 w-4" />}
              fullWidth
            >
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary