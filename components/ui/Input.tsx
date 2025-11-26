'use client'

import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled'
  showPasswordToggle?: boolean
  hasError?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant = 'default',
    showPasswordToggle = false,
    hasError = false,
    id,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const isPassword = type === 'password'
    const actualType = isPassword && showPassword ? 'text' : type

    // Função para formatar telefone
    const formatPhone = (value: string) => {
      const numbers = value.replace(/\D/g, '')
      if (numbers.length <= 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
      return value
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value

      // Aplicar formatação de telefone se o tipo for 'tel'
      if (type === 'tel') {
        value = formatPhone(value)
        e.target.value = value
      }

      props.onChange?.(e)
    }

    return (
      <div className="relative w-full">
          <input
            id={inputId}
            type={actualType}
            className={clsx(
              'w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              'placeholder:text-gray-400 text-base sm:text-sm',
              'text-gray-900 dark:text-white',
              
              // Variantes
              variant === 'filled' && 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
              variant === 'default' && 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
              
              // Estados de erro
              hasError && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              
              // Estados de foco
              isFocused && !hasError && 'border-blue-500 ring-2 ring-blue-500',
              
              // Padding para ícone de senha
              (isPassword && showPasswordToggle) && 'pr-10',
              
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            onChange={handleChange}
            {...props}
          />
          
          {/* Botão para mostrar/ocultar senha */}
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              className={clsx(
                'absolute inset-y-0 right-0 pr-3 flex items-center',
                'text-gray-400 hover:text-gray-600 transition-colors',
                'focus:outline-none focus:text-gray-600'
              )}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }