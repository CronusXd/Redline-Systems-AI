'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

const PIXGO_API_URL = 'https://pixgo.org/api/v1'
const PIXGO_API_KEY = process.env.PIXGO_API_KEY

if (!PIXGO_API_KEY) {
    console.warn('WARNING: PIXGO_API_KEY is not set in environment variables.')
}

interface CreatePaymentResponse {
    success: boolean
    payment_id?: string
    qr_code?: string
    qr_code_base64?: string
    error?: string
}

interface PaymentStatusResponse {
    success: boolean
    status?: 'pending' | 'completed' | 'expired' | 'cancelled'
    error?: string
}

export async function createPixPayment(
    amount: number = 79.90,
    customerName?: string,
    customerEmail?: string
): Promise<CreatePaymentResponse> {
    if (!PIXGO_API_KEY) {
        return { success: false, error: 'Configuration error: API Key missing' }
    }

    try {
        const response = await fetch(`${PIXGO_API_URL}/payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': PIXGO_API_KEY
            },
            body: JSON.stringify({
                amount: amount,
                customer_name: customerName,
                customer_email: customerEmail,
                external_id: 'redline-systems-ai',
                description: 'WhatsApp - Recuperação de Conteúdo'
            })
        })

        const result = await response.json()

        if (!response.ok) {
            console.error('PixGo Create Payment Error:', result)
            return { success: false, error: result.message || 'Failed to create payment' }
        }

        // API returns: { success: true, data: { payment_id, qr_code, qr_image_url, ... } }
        const paymentData = result.data

        return {
            success: true,
            payment_id: paymentData.payment_id,
            qr_code: paymentData.qr_code,
            qr_code_base64: paymentData.qr_image_url // URL to QR code image
        }
    } catch (error) {
        console.error('PixGo Create Payment Exception:', error)
        return { success: false, error: 'Internal server error' }
    }
}

export async function checkPixPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    if (!PIXGO_API_KEY) {
        return { success: false, error: 'Configuration error: API Key missing' }
    }

    try {
        // PRIMEIRO: Verificar se há uma simulação no Supabase
        const supabase = createServerSupabaseClient()
        const { data: supabasePayment, error: supabaseError } = await supabase
            .from('payment_attempts')
            .select('status')
            .eq('payment_id', paymentId)
            .single()

        // Se encontrou no Supabase e está completed, retornar isso (simulação)
        // Isso permite que o botão "Simular Pagamento" funcione
        if (supabasePayment?.status === 'completed') {
            console.log(`[PixGo] Simulação detectada para ${paymentId}: completed`)
            return {
                success: true,
                status: 'completed'
            }
        }

        // SEGUNDO: Consultar API PixGo para pagamentos reais
        console.log(`[PixGo] Consultando API real para ${paymentId}`)
        const response = await fetch(`${PIXGO_API_URL}/payment/${paymentId}/status`, {
            method: 'GET',
            headers: {
                'X-API-Key': PIXGO_API_KEY
            }
        })

        const result = await response.json()

        if (!response.ok) {
            console.error('PixGo Check Status Error:', result)
            return { success: false, error: result.message || 'Failed to check status' }
        }

        // Se a API PixGo retornar completed, atualizar no Supabase também
        const apiStatus = result.data?.status || result.status
        if (apiStatus === 'completed' && supabasePayment) {
            await supabase
                .from('payment_attempts')
                .update({ status: 'completed', updated_at: new Date().toISOString() })
                .eq('payment_id', paymentId)
        }

        // API returns: { success: true, data: { status: 'pending' | 'completed' | ... } }
        return {
            success: true,
            status: apiStatus
        }
    } catch (error) {
        console.error('PixGo Check Status Exception:', error)
        return { success: false, error: 'Internal server error' }
    }
}
