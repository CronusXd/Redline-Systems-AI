'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { LoginForm } from '@/components/auth/LoginForm'
import { ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)

  const handleRegisterSuccess = () => {
    // Redirecionar para login após registro bem-sucedido
    setShowLogin(true)
  }

  const handleLoginSuccess = () => {
    // Redirecionar para dashboard após login
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar ao início
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {showLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h1>
          <p className="mt-2 text-gray-600">
            {showLogin 
              ? 'Faça login para acessar sua conta' 
              : 'Junte-se a nós e comece sua jornada'
            }
          </p>
        </div>

        {/* Formulários */}
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow-xl rounded-lg">
          {showLogin ? (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setShowLogin(false)}
              redirectTo="/dashboard"
            />
          ) : (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setShowLogin(true)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}