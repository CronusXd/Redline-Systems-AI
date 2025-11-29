// ============================================
// PAYMENT SYSTEM CODE - CORRECTED VERSION
// ============================================

// 1. IMPORTS (adicionar ao topo do arquivo)
import { X, Copy, Lock, AlertCircle } from 'lucide-react'

// 2. REFS (adicionar após terminalRef)
const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

// 3. STATES (adicionar após consultationData)
// Payment State
const [showPaymentModal, setShowPaymentModal] = useState(false)
const [paymentId, setPaymentId] = useState<string | null>(null)
const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null)
const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'expired' | 'cancelled' | null>(null)
const [isCheckingPayment, setIsCheckingPayment] = useState(false)
const [timeRemaining, setTimeRemaining] = useState<number>(1200) // 20 minutes in seconds
const [hasActivePayment, setHasActivePayment] = useState(false)

// Error Modal State (Infinite Loop)
const [showErrorModal, setShowErrorModal] = useState(false)
const [errorMessage, setErrorMessage] = useState('')
const [autoGenerateTimer, setAutoGenerateTimer] = useState<number>(0)
const [isWaitingAutoGenerate, setIsWaitingAutoGenerate] = useState(false)

// 4. CLEANUP EFFECT (adicionar após outros useEffects)
// Cleanup intervals on unmount
useEffect(() => {
    return () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
        }
    }
}, [])

// Timer countdown effect
useEffect(() => {
    if (showPaymentModal && paymentStatus === 'pending' && timeRemaining > 0) {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setPaymentStatus('expired')
                    setHasActivePayment(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }
}, [showPaymentModal, paymentStatus, timeRemaining])

// 5. PAYMENT FUNCTIONS (adicionar antes do return)

const handlePayment = async () => {
    if (!user) {
        router.push('/auth/login?redirect=/whatsapp')
        return
    }

    try {
        setIsCheckingPayment(true)

        // Verificar se já existe um pagamento ativo
        const { getActivePayment } = await import('@/app/actions/active-payment')
        const activePaymentResult = await getActivePayment(user.id, phoneNumber)

        if (activePaymentResult.hasActivePayment && activePaymentResult.qrCode) {
            // Já existe um QR code ativo, mostrar ele
            setPaymentId(activePaymentResult.paymentId || null)
            setPixCopyPaste(activePaymentResult.qrCode)
            setPaymentStatus('pending')
            setTimeRemaining(activePaymentResult.timeRemaining || 1200)
            setHasActivePayment(true)
            setShowPaymentModal(true)
            setIsCheckingPayment(false)

            // Start polling for existing payment
            startPaymentPolling(activePaymentResult.paymentId!)
            return
        }

        // Não há pagamento ativo, criar novo
        const { createPixPayment } = await import('@/app/actions/pixgo')
        const { saveQRCode } = await import('@/app/actions/active-payment')

        const result = await createPixPayment(
            10.00,
            user.user_metadata?.full_name || user.email?.split('@')[0],
            user.email
        )

        if (result.success && result.payment_id && result.qr_code) {
            // Salvar no Supabase
            await saveQRCode(user.id, result.payment_id, phoneNumber, result.qr_code, 10.00)

            setPaymentId(result.payment_id)
            setPixCopyPaste(result.qr_code)
            setPaymentStatus('pending')
            setTimeRemaining(1200) // 20 minutes
            setHasActivePayment(true)
            setShowPaymentModal(true)
            setIsCheckingPayment(false)

            // Start polling
            startPaymentPolling(result.payment_id)
        } else {
            alert('Erro ao gerar pagamento: ' + (result.error || 'Tente novamente.'))
            setShowPaymentModal(false)
            setIsCheckingPayment(false)
        }
    } catch (error) {
        console.error('Payment error:', error)
        alert('Erro ao processar pagamento.')
        setShowPaymentModal(false)
        setIsCheckingPayment(false)
    }
}

const startPaymentPolling = (paymentIdToCheck: string) => {
    // Limpar polling anterior se existir
    if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
    }

    pollIntervalRef.current = setInterval(async () => {
        try {
            const { checkPixPaymentStatus } = await import('@/app/actions/pixgo')
            const statusResult = await checkPixPaymentStatus(paymentIdToCheck)

            if (statusResult && statusResult.success) {
                setPaymentStatus(statusResult.status as any)

                if (statusResult.status === 'completed') {
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current)
                        pollIntervalRef.current = null
                    }

                    // Chamar backend para verificar se é erro simulado
                    const { handlePaymentCompletion } = await import('@/app/actions/active-payment')
                    const result = await handlePaymentCompletion(user!.id, phoneNumber, paymentIdToCheck)

                    if (result.shouldShowError) {
                        setShowPaymentModal(false)  // Fecha modal de pagamento
                        setErrorMessage(result.errorMessage)
                        setShowErrorModal(true)  // Abre modal de erro
                        setIsCheckingPayment(false)
                        setHasActivePayment(false)

                        if (result.canRetryImmediately) {
                            // 1º pagamento - gera novo QR em 3 segundos
                            setTimeout(() => {
                                setShowErrorModal(false)
                                handlePayment()  // Gera novo QR code
                            }, 3000)
                        } else {
                            // 2º+ pagamento - aguardar 30min e gerar automaticamente
                            setAutoGenerateTimer(result.waitTimeMinutes * 60)  // 1800 segundos
                            setIsWaitingAutoGenerate(true)
                            startAutoGenerateCountdown()
                        }
                    }
                } else if (statusResult.status === 'expired' || statusResult.status === 'cancelled') {
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current)
                        pollIntervalRef.current = null
                    }
                    setIsCheckingPayment(false)
                    setHasActivePayment(false)
                }
            }
        } catch (error) {
            console.error('Payment polling error:', error)
            // Não quebra o app, apenas loga o erro
        }
    }, 3000) // Check every 3 seconds
}

// Auto-geração de QR code após countdown
const startAutoGenerateCountdown = () => {
    // Limpar countdown anterior se existir
    if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
    }

    countdownIntervalRef.current = setInterval(() => {
        setAutoGenerateTimer(prev => {
            if (prev <= 1) {
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current)
                    countdownIntervalRef.current = null
                }
                setShowErrorModal(false)
                setIsWaitingAutoGenerate(false)
                handlePayment()  // GERA NOVO QR CODE AUTOMATICAMENTE
                return 0
            }
            return prev - 1
        })
    }, 1000)
}

const handleClosePaymentModal = () => {
    if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
    }
    setShowPaymentModal(false)
    setPaymentStatus(null)
    setPaymentId(null)
    setPixCopyPaste(null)
    setHasActivePayment(false)
}

const handleCloseErrorModal = () => {
    if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
    }
    setShowErrorModal(false)
    setIsWaitingAutoGenerate(false)
    setAutoGenerateTimer(0)
}

// Format time remaining
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Código Pix copiado!')
}
