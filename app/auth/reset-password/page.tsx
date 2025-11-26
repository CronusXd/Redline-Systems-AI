'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react'
import { resetPasswordAction } from '@/app/actions/reset-password'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validações
        if (!email || !username || !password || !confirmPassword) {
            setError('Preencha todos os campos')
            return
        }

        if (password !== confirmPassword) {
            setError('As senhas não conferem')
            return
        }

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres')
            return
        }

        setIsLoading(true)

        try {
            const result = await resetPasswordAction(email, username, password)

            if (result.success) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/auth/login?message=password-reset-success')
                }, 2000)
            } else {
                setError(result.error || 'Erro ao redefinir senha')
            }
        } catch (err) {
            setError('Erro ao processar solicitação')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Voltar ao login
                    </Link>

                    {success && (
                        <div className="mb-4 p-3 bg-green-900/30 border border-green-800 text-green-200 rounded-md flex items-center gap-2 justify-center">
                            <CheckCircle className="h-5 w-5" />
                            <span>✓ Senha redefinida com sucesso! Redirecionando...</span>
                        </div>
                    )}

                    <h1 className="text-3xl font-bold text-white">
                        Redefinir Senha
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Digite seu email, nome de usuário e a nova senha
                    </p>
                </div>

                <div className="bg-gray-800 py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow-xl rounded-lg border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-md flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="seu@email.com"
                                    disabled={isLoading || success}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Nome de Usuário
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Seu nome"
                                    disabled={isLoading || success}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Nova Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Mínimo 6 caracteres"
                                    disabled={isLoading || success}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirmar Nova Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Digite a senha novamente"
                                    disabled={isLoading || success}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            {isLoading ? 'Redefinindo...' : success ? 'Redirecionando...' : 'Redefinir Senha'}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Lembrou sua senha?{' '}
                        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
