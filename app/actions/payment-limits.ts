'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { normalizePhoneNumber } from '@/lib/utils/phone'

interface PaymentLimitResult {
    canGenerate: boolean
    unpaidCount: number
    failedCount: number
    waitTimeRemaining: number
    message?: string
}

interface RetryLimitResult {
    canRetry: boolean
    retryCount: number
    waitTimeRemaining: number
    message?: string
}

/**
 * Verifica se o usuário pode gerar um novo QR code para um número específico
 * Regras:
 * - Máximo 2 QR codes não pagos (expired/cancelled) por dia PARA ESTE NÚMERO
 * - Máximo 5 QR codes com erro real (failed) por dia PARA ESTE NÚMERO
 * - Intervalo de 30 minutos entre QR codes não pagos
 */
export async function checkPaymentLimit(userId: string, phoneNumber: string): Promise<PaymentLimitResult> {
    const supabase = createServerSupabaseClient()
    const cleanNumber = normalizePhoneNumber(phoneNumber)

    // Data de 24 horas atrás
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)

    try {
        // Contar QR codes não pagos (expired/cancelled) nas últimas 24h para este número
        const { data: unpaidAttempts, error: unpaidError } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('phone_number', cleanNumber) // Filtra pelo número
            .in('status', ['expired', 'cancelled'])
            .eq('is_simulated_error', false)
            .gte('created_at', yesterday.toISOString())
            .order('created_at', { ascending: false })

        if (unpaidError) throw unpaidError

        const unpaidCount = unpaidAttempts?.length || 0

        // Contar QR codes com erro real (failed) nas últimas 24h para este número
        const { data: failedAttempts, error: failedError } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('phone_number', cleanNumber) // Filtra pelo número
            .eq('status', 'failed')
            .eq('is_simulated_error', false)
            .gte('created_at', yesterday.toISOString())

        if (failedError) throw failedError

        const failedCount = failedAttempts?.length || 0

        // Verificar limite de não pagos (2 por dia por número)
        if (unpaidCount >= 2) {
            return {
                canGenerate: false,
                unpaidCount,
                failedCount,
                waitTimeRemaining: 0,
                message: 'Você atingiu o limite de 2 QR codes não pagos por dia para este número.'
            }
        }

        // Verificar limite de erros reais (5 por dia por número)
        if (failedCount >= 5) {
            return {
                canGenerate: false,
                unpaidCount,
                failedCount,
                waitTimeRemaining: 0,
                message: 'Você atingiu o limite de 5 tentativas com erro por dia para este número.'
            }
        }

        // Verificar intervalo de 30 minutos entre QR codes não pagos
        if (unpaidCount > 0 && unpaidAttempts && unpaidAttempts.length > 0) {
            const lastAttempt = unpaidAttempts[0]

            // Buscar último pagamento completado (com sucesso ou erro simulado)
            const { data: lastCompleted } = await supabase
                .from('payment_attempts')
                .select('created_at')
                .eq('user_id', userId)
                .eq('phone_number', cleanNumber)
                .eq('status', 'completed')
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            // Se houve um pagamento completado DEPOIS do último não pago, ignorar o bloqueio
            if (lastCompleted && lastCompleted.created_at && lastAttempt.created_at) {
                const completedTime = new Date(lastCompleted.created_at)
                const unpaidTime = new Date(lastAttempt.created_at)

                // Se pagou depois do erro, libera
                if (completedTime > unpaidTime) {
                    return {
                        canGenerate: true,
                        unpaidCount,
                        failedCount,
                        waitTimeRemaining: 0
                    }
                }
            }

            if (lastAttempt.created_at) {
                const lastAttemptTime = new Date(lastAttempt.created_at)
                const now = new Date()
                const diffMinutes = (now.getTime() - lastAttemptTime.getTime()) / (1000 * 60)

                if (diffMinutes < 30) {
                    const waitTimeRemaining = Math.ceil(30 - diffMinutes)
                    return {
                        canGenerate: false,
                        unpaidCount,
                        failedCount,
                        waitTimeRemaining,
                        message: `Aguarde ${waitTimeRemaining} minutos para gerar um novo QR code para este número.`
                    }
                }
            }
        }

        return {
            canGenerate: true,
            unpaidCount,
            failedCount,
            waitTimeRemaining: 0
        }
    } catch (error) {
        console.error('Error checking payment limit:', error)
        return {
            canGenerate: false,
            unpaidCount: 0,
            failedCount: 0,
            waitTimeRemaining: 0,
            message: 'Erro ao verificar limite de pagamentos.'
        }
    }
}

/**
 * Verifica se o usuário pode fazer retry após erro simulado
 * Regras:
 * - 1ª e 2ª tentativa: imediato
 * - 3ª+ tentativa: aguardar 30 minutos
 */
export async function checkRetryLimit(userId: string): Promise<RetryLimitResult> {
    const supabase = createServerSupabaseClient()

    try {
        // Buscar última tentativa com erro simulado
        const { data: lastSimulatedError, error } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('is_simulated_error', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') throw error

        if (!lastSimulatedError) {
            return {
                canRetry: true,
                retryCount: 0,
                waitTimeRemaining: 0
            }
        }

        const retryCount = lastSimulatedError.retry_count || 0

        // 1ª e 2ª tentativa: imediato
        if (retryCount < 2) {
            return {
                canRetry: true,
                retryCount,
                waitTimeRemaining: 0
            }
        }

        // 3ª+ tentativa: verificar 30 minutos
        if (lastSimulatedError.last_retry_at) {
            const lastRetryTime = new Date(lastSimulatedError.last_retry_at)
            const now = new Date()
            const diffMinutes = (now.getTime() - lastRetryTime.getTime()) / (1000 * 60)

            if (diffMinutes < 30) {
                const waitTimeRemaining = Math.ceil(30 - diffMinutes)
                return {
                    canRetry: false,
                    retryCount,
                    waitTimeRemaining,
                    message: `Aguarde ${waitTimeRemaining} minutos para gerar um novo QR code.`
                }
            }
        }

        return {
            canRetry: true,
            retryCount,
            waitTimeRemaining: 0
        }
    } catch (error) {
        console.error('Error checking retry limit:', error)
        return {
            canRetry: false,
            retryCount: 0,
            waitTimeRemaining: 0,
            message: 'Erro ao verificar limite de retries.'
        }
    }
}

/**
 * Registra uma tentativa de pagamento
 */
export async function recordPaymentAttempt(
    userId: string,
    paymentId: string,
    phoneNumber: string,
    amount: number,
    status: string,
    isSimulatedError: boolean = false
) {
    const supabase = createServerSupabaseClient()
    const cleanNumber = normalizePhoneNumber(phoneNumber)

    try {
        const { error } = await supabase
            .from('payment_attempts')
            .insert({
                user_id: userId,
                payment_id: paymentId,
                phone_number: cleanNumber,
                qr_code: '', // Will be updated later
                amount,
                status,
                is_simulated_error: isSimulatedError,
                retry_count: 0,
                last_retry_at: null
            })

        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error recording payment attempt:', error)
        return { success: false, error }
    }
}

/**
 * Atualiza o status de um pagamento
 */
export async function updatePaymentStatus(
    paymentId: string,
    status: string,
    isSimulatedError: boolean = false
) {
    const supabase = createServerSupabaseClient()

    try {
        const { error } = await supabase
            .from('payment_attempts')
            .update({
                status,
                is_simulated_error: isSimulatedError,
                updated_at: new Date().toISOString()
            })
            .eq('payment_id', paymentId)

        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error updating payment status:', error)
        return { success: false, error }
    }
}

/**
 * Incrementa o contador de retry para erros simulados
 */
export async function incrementRetryCount(userId: string) {
    const supabase = createServerSupabaseClient()

    try {
        // Buscar última tentativa com erro simulado
        const { data: lastAttempt, error: fetchError } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('is_simulated_error', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

        if (lastAttempt) {
            const { error: updateError } = await supabase
                .from('payment_attempts')
                .update({
                    retry_count: (lastAttempt.retry_count || 0) + 1,
                    last_retry_at: new Date().toISOString()
                })
                .eq('id', lastAttempt.id)

            if (updateError) throw updateError
        }

        return { success: true }
    } catch (error) {
        console.error('Error incrementing retry count:', error)
        return { success: false, error }
    }
}
