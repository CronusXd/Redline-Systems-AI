'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface ConsultaData {
    phone_number: string
    messages_count: number
    images_count: number
    videos_count: number
}

interface ConsultaRow {
    id: string
    phone_number: string
    messages_count: number
    images_count: number
    videos_count: number
    created_at: string
}

export async function getOrCreateConsultation(phoneNumber: string): Promise<ConsultaData> {
    const supabase = createServerSupabaseClient()

    // Clean the phone number (remove spaces, hyphens, etc.)
    const cleanNumber = phoneNumber.replace(/\D/g, '')

    // Try to get existing consultation
    const { data: existing, error: fetchError } = await supabase
        .from('consultas')
        .select('*')
        .eq('phone_number', cleanNumber)
        .single()

    if (existing && !fetchError) {
        const row = existing as unknown as ConsultaRow
        // Return existing consultation
        return {
            phone_number: row.phone_number,
            messages_count: row.messages_count,
            images_count: row.images_count,
            videos_count: row.videos_count,
        }
    }

    // Generate random data for new consultation
    const messages_count = Math.floor(Math.random() * 50) + 30 // 30-80
    const images_count = Math.floor(Math.random() * 21) + 40 // 40-60
    const videos_count = Math.floor(Math.random() * 11) + 20 // 20-30

    // Insert new consultation
    const { data: newConsulta, error: insertError } = await supabase
        .from('consultas')
        .insert({
            phone_number: cleanNumber,
            messages_count,
            images_count,
            videos_count,
        })
        .select()
        .single()

    if (insertError) {
        console.error('Error inserting consultation:', insertError)
        // If there's an error (e.g., duplicate), try fetching again
        const { data: retryData } = await supabase
            .from('consultas')
            .select('*')
            .eq('phone_number', cleanNumber)
            .single()

        if (retryData) {
            const retryRow = retryData as unknown as ConsultaRow
            return {
                phone_number: retryRow.phone_number,
                messages_count: retryRow.messages_count,
                images_count: retryRow.images_count,
                videos_count: retryRow.videos_count,
            }
        }

        // Fallback: return the generated data
        return {
            phone_number: cleanNumber,
            messages_count,
            images_count,
            videos_count,
        }
    }

    const newRow = newConsulta as unknown as ConsultaRow
    return {
        phone_number: newRow.phone_number,
        messages_count: newRow.messages_count,
        images_count: newRow.images_count,
        videos_count: newRow.videos_count,
    }
}
