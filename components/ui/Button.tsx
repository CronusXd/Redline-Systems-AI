'use client'

import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Size variants
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          
          // Color variants
          {
            // Primary
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': 
              variant === 'primary',
            
            // Secondary
            'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500': 
              variant === 'secondary',
            
            // Danger
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': 
              variant === 'danger',
            
            // Ghost
            'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500': 
              variant === 'ghost',
            
            // Outline
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500': 
              variant === 'outline',
          },
          
          // Full width
          fullWidth && 'w-full',
          
          // Loading state
          loading && 'cursor-wait',
          
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {/* Left icon or loading spinner */}
        {loading ? (
          <Loader2 className={clsx(
            'animate-spin',
            size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5',
            children && 'mr-2'
          )} />
        ) : leftIcon ? (
          <span className={clsx(
            size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5',
            children && 'mr-2'
          )}>
            {leftIcon}
          </span>
        ) : null}
        
        {/* Button text */}
        {children}
        
        {/* Right icon */}
        {rightIcon && !loading && (
          <span className={clsx(
            size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5',
            children && 'ml-2'
          )}>
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }