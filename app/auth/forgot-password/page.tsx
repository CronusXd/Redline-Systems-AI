'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirecionar para a página de reset-password
        router.replace('/auth/reset-password')
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Redirecionando...</p>
            </div>
        </div>
    )
}
