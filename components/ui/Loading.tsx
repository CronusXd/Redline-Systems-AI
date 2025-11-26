'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  fullScreen?: boolean
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const content = (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <Loader2 className={clsx('animate-spin text-blue-600', sizeClasses[size])} />
      {text && (
        <p className={clsx('mt-2 text-gray-600', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return content
}

// Componente de loading para páginas
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  )
}

// Componente de loading para botões
export const ButtonLoading: React.FC = () => {
  return <Loader2 className="h-4 w-4 animate-spin" />
}

// Componente de loading inline
export const InlineLoading: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
}

export default Loading