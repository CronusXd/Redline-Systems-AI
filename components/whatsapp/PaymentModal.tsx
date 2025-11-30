import React from 'react'
import { X, Lock, Copy, Loader2 } from 'lucide-react'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    pixCopyPaste: string | null
    timeRemaining: number
    paymentStatus: 'pending' | 'completed' | 'expired' | 'cancelled' | null
    isCheckingPayment: boolean
    onPaymentClick: () => void
    formatTime: (seconds: number) => string
    copyToClipboard: (text: string) => void
}

export function PaymentModal({
    isOpen,
    onClose,
    pixCopyPaste,
    timeRemaining,
    paymentStatus,
    isCheckingPayment,
    onPaymentClick,
    formatTime,
    copyToClipboard
}: PaymentModalProps) {
    if (!isOpen || !pixCopyPaste) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative my-8 animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-3">
                        <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Pagamento PIX
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Escaneie o QR Code ou copie o código
                    </p>
                </div>

                {/* Timer */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tempo restante</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {formatTime(timeRemaining)}
                    </p>
                </div>

                {/* Status */}
                {paymentStatus && (
                    <div className={`mb-4 p-3 rounded-xl ${paymentStatus === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                        paymentStatus === 'completed' ? 'bg-green-50 dark:bg-green-900/20' :
                            paymentStatus === 'expired' ? 'bg-red-50 dark:bg-red-900/20' :
                                'bg-gray-50 dark:bg-gray-900/20'
                        }`}>
                        <p className={`text-center text-sm font-medium ${paymentStatus === 'pending' ? 'text-yellow-700 dark:text-yellow-300' :
                            paymentStatus === 'completed' ? 'text-green-700 dark:text-green-300' :
                                paymentStatus === 'expired' ? 'text-red-700 dark:text-red-300' :
                                    'text-gray-700 dark:text-gray-300'
                            }`}>
                            {paymentStatus === 'pending' && '⏳ Aguardando pagamento...'}
                            {paymentStatus === 'completed' && '✅ Pagamento confirmado!'}
                            {paymentStatus === 'expired' && '❌ QR Code expirado'}
                            {paymentStatus === 'cancelled' && '❌ Pagamento cancelado'}
                        </p>
                    </div>
                )}

                {/* QR Code */}
                {paymentStatus === 'pending' && (
                    <div className="mb-4 flex justify-center">
                        <div className="p-2 bg-white rounded-xl">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCopyPaste)}`}
                                alt="QR Code PIX"
                                className="w-44 h-44 mix-blend-multiply"
                            />
                        </div>
                    </div>
                )}

                {/* Copy Paste Input */}
                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Pix Copia e Cola
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            readOnly
                            value={pixCopyPaste}
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-mono text-gray-900 dark:text-white"
                        />
                        <button
                            onClick={() => copyToClipboard(pixCopyPaste)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        💰 Valor: <span className="line-through text-gray-400 mr-2">R$ 350,00</span>
                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">R$ 79,90</span>
                    </p>
                </div>

            </div>
        </div>
    )
}
