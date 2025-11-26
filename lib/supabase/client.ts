import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'
import { config } from '../config/env'

export const createClient = () => {
  return createBrowserClient<Database>(
    config.supabaseUrl,
    config.supabaseAnonKey
  )
}

// Cliente singleton para uso em componentes
export const supabase = createClient()