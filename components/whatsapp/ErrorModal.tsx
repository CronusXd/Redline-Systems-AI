import React from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

interface ErrorModalProps {
    isOpen: boolean
    errorMessage: string
    isWaitingAutoGenerate: boolean
    autoGenerateTimer: number
    formatTime: (seconds: number) => string
}

export function ErrorModal({
    isOpen,
    errorMessage,
    isWaitingAutoGenerate,
    autoGenerateTimer,
    formatTime
}: ErrorModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
                {/* Ícone de erro */}
                <div className="flex justify-center mb-6">
                    <AlertCircle className="w-20 h-20 text-red-500" />
                </div>

                {/* Mensagem de erro (SEM contador de tentativas) */}
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
                    {errorMessage}
                </h3>

                {/* Timer de espera (apenas para 2º+) */}
                {isWaitingAutoGenerate && (
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Novo código será gerado automaticamente em:
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-4">
                            <p className="text-5xl font-mono font-bold text-blue-600 dark:text-blue-400">
                                {formatTime(autoGenerateTimer)}
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Aguardando...</span>
                        </div>
                    </div>
                )}

                {/* Mensagem de geração imediata (1º pagamento) */}
                {!isWaitingAutoGenerate && (
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            Gerando novo código...
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
