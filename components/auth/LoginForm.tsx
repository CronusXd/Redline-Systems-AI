'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { signInSchema, SignInFormData } from '@/lib/validations/auth'
import { clsx } from 'clsx'

interface LoginFormProps {
    onSuccess?: () => void
    onSwitchToRegister?: () => void
    redirectTo?: string
    className?: string
}

const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    onSwitchToRegister,
    redirectTo = '/dashboard',
    className
}) => {
    const router = useRouter()
    const { signIn } = useAuth()

    const [formData, setFormData] = useState<SignInFormData>({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState<Partial<SignInFormData>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [submitError, setSubmitError] = useState<string>('')

    // Função para validar um campo específico
    const validateField = (name: keyof SignInFormData, value: string) => {
        try {
            const fieldSchema = signInSchema.shape[name]
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

        // Limpar erro de submit quando o usuário começar a digitar
        if (submitError) {
            setSubmitError('')
        }

        // Validar campo em tempo real após o usuário começar a digitar
        if (value.length > 0 || errors[name as keyof SignInFormData]) {
            validateField(name as keyof SignInFormData, value)
        }
    }

    // Função para submeter o formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError('')

        // Validar todos os campos
        try {
            signInSchema.parse(formData)
            setErrors({})
        } catch (error: any) {
            const fieldErrors: Partial<SignInFormData> = {}
            error.errors?.forEach((err: any) => {
                if (err.path?.[0]) {
                    fieldErrors[err.path[0] as keyof SignInFormData] = err.message
                }
            })
            setErrors(fieldErrors)
            return
        }

        setIsLoading(true)

        try {
            const result = await signIn(formData.email, formData.password)

            if (result.success) {
                // Chamar callback de sucesso ou redirecionar
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push(redirectTo)
                }
            } else {
                setSubmitError(result.error || 'Erro ao fazer login')
            }
        } catch (error) {
            setSubmitError('Erro inesperado. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={clsx('w-full', className)}>

            {/* Mensagem de erro */}
            {submitError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                    autoFocus
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
                    autoComplete="current-password"
                />

                {/* Link para recuperar senha */}
                <div className="text-right">
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Esqueceu sua senha?
                    </Link>
                </div>

                {/* Botão de submit */}
                <Button
                    type="submit"
                    loading={isLoading}
                    fullWidth
                    size="lg"
                    className="mt-6"
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
            </form>

            {/* Link para registro */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Criar conta
                    </button>
                </p>
            </div>
        </div>
    )
}

export { LoginForm }