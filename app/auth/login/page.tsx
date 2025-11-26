'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showRegister, setShowRegister] = useState(false)

    const redirectTo = searchParams.get('redirect') || '/dashboard'
    const message = searchParams.get('message')

    // Success messages
    const getSuccessMessage = () => {
        if (message === 'password-updated') {
            return '✓ Senha atualizada com sucesso! Faça login com sua nova senha.'
        }
        if (message === 'password-reset-success') {
            return '✓ Senha redefinida com sucesso! Faça login agora.'
        }
        return null
    }

    const successMessage = getSuccessMessage()

    const handleLoginSuccess = () => {
        router.push(redirectTo)
    }

    const handleRegisterSuccess = () => {
        setShowRegister(false)
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Voltar ao início
                    </Link>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-900/30 border border-green-800 text-green-200 rounded-md flex items-center gap-2 justify-center">
                            <CheckCircle className="h-5 w-5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <h1 className="text-3xl font-bold text-white">
                        {showRegister ? 'Crie sua conta' : 'Bem-vindo de volta!'}
                    </h1>
                    <p className="mt-2 text-gray-400">
                        {showRegister
                            ? 'Junte-se a nós e comece sua jornada'
                            : 'Faça login para acessar sua conta'
                        }
                    </p>
                </div>

                {redirectTo !== '/dashboard' && !showRegister && (
                    <div className="mb-4 p-3 bg-blue-900 border border-blue-700 text-blue-200 rounded-md text-center text-sm">
                        Você precisa fazer login para acessar esta página
                    </div>
                )}

                <div className="bg-gray-800 py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow-xl rounded-lg border border-gray-700">
                    {showRegister ? (
                        <RegisterForm
                            onSuccess={handleRegisterSuccess}
                            onSwitchToLogin={() => setShowRegister(false)}
                        />
                    ) : (
                        <LoginForm
                            onSuccess={handleLoginSuccess}
                            onSwitchToRegister={() => setShowRegister(true)}
                            redirectTo={redirectTo}
                        />
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        {showRegister && (
                            <>
                                Ao criar uma conta, você concorda com nossos{' '}
                                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                                    Termos de Serviço
                                </Link>{' '}
                                e{' '}
                                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                                    Política de Privacidade
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}