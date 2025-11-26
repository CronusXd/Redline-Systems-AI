'use client'

import React from 'react'
import { Input, InputProps } from './Input'
import { clsx } from 'clsx'

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  name: string
  label: string
  error?: string
  helperText?: string
  required?: boolean
  description?: string
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  error,
  helperText,
  required = false,
  description,
  className,
  ...inputProps
}) => {
  const fieldId = `field-${name}`
  const errorId = error ? `${fieldId}-error` : undefined
  const descriptionId = description ? `${fieldId}-description` : undefined
  const helperTextId = helperText ? `${fieldId}-helper` : undefined

  return (
    <div className={clsx('space-y-1', className)}>
      {/* Label */}
      <label 
        htmlFor={fieldId}
        className={clsx(
          'block text-sm font-medium transition-colors',
          error ? 'text-red-600' : 'text-gray-700',
          'dark:text-gray-300'
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="obrigatório">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {description}
        </p>
      )}

      {/* Input */}
      <Input
        id={fieldId}
        name={name}
        required={required}
        hasError={!!error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={clsx(
          errorId,
          descriptionId,
          helperTextId
        ).trim() || undefined}
        {...inputProps}
      />

      {/* Error message */}
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p 
          id={helperTextId}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export { FormField }