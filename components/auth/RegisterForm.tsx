'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { signUpSchema, SignUpFormData } from '@/lib/validations/auth'
import { User, Mail, Lock } from 'lucide-react'
import { clsx } from 'clsx'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
  className?: string
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  className
}) => {
  const router = useRouter()
  const { signUp } = useAuth()
  
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  // Função para validar um campo específico
  const validateField = (name: keyof SignUpFormData, value: string) => {
    try {
      const fieldSchema = signUpSchema.shape[name]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors(prev => ({ ...prev, [name]: undefined }))
      }
    } catch (error: any) {
      if (error.errors?.[0]?.message) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }))
      }
    }
  }

  // Função para lidar com mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validar campo em tempo real após o usuário começar a digitar
    if (value.length > 0 || errors[name as keyof SignUpFormData]) {
      validateField(name as keyof SignUpFormData, value)
    }
    
    // Validação especial para confirmação de senha
    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? value : formData.password
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword
      
      if (confirmPassword && password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Senhas não coincidem' }))
      } else if (password === confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }))
      }
    }
  }

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSuccessMessage('')
    
    // Validar todos os campos
    try {
      signUpSchema.parse(formData)
      setErrors({})
    } catch (error: any) {
      const fieldErrors: Partial<SignUpFormData> = {}
      error.errors?.forEach((err: any) => {
        if (err.path?.[0]) {
          fieldErrors[err.path[0] as keyof SignUpFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      if (result.success) {
        setSuccessMessage('Conta criada com sucesso! Verifique seu email para confirmar a conta.')
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        })
        
        // Chamar callback de sucesso ou redirecionar
        if (onSuccess) {
          onSuccess()
        } else {
          setTimeout(() => {
            router.push('/auth/login')
          }, 2000)
        }
      } else {
        setSubmitError(result.error || 'Erro ao criar conta')
      }
    } catch (error) {
      setSubmitError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={clsx('w-full', className)}>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Mensagem de erro */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Nome */}
          <FormField
            name="name"
            label="Nome completo"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Digite seu nome completo"
            autoComplete="name"
          />

          {/* Email */}
          <FormField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Digite seu email"
            autoComplete="email"
          />



          {/* Senha */}
          <FormField
            name="password"
            label="Senha"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Digite sua senha"
            showPasswordToggle
            helperText="Mínimo 8 caracteres, com maiúscula, minúscula e número"
            autoComplete="new-password"
          />

          {/* Confirmar Senha */}
          <FormField
            name="confirmPassword"
            label="Confirmar senha"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            placeholder="Confirme sua senha"
            showPasswordToggle
            autoComplete="new-password"
          />

          {/* Botão de submit */}
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="lg"
            className="mt-6"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        {/* Link para login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Fazer login
            </button>
          </p>
        </div>
    </div>
  )
}

export { RegisterForm }