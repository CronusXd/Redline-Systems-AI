// Validação de variáveis de ambiente
export const validateEnv = () => {
  const requiredEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const serverOnlyEnvVars = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const missingVars: string[] = []

  // Verificar variáveis obrigatórias
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key)
    }
  })

  // Verificar variáveis do servidor (apenas no servidor)
  if (typeof window === 'undefined') {
    Object.entries(serverOnlyEnvVars).forEach(([key, value]) => {
      if (!value) {
        missingVars.push(key)
      }
    })
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.\n' +
      'See ENV_SETUP.md for more information.'
    )
  }

  // Validar formato das URLs
  if (requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      new URL(requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL)
    } catch {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    }
  }

  return {
    supabaseUrl: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseServiceKey: serverOnlyEnvVars.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }
}

// Configuração exportada
export const config = validateEnv()

// Função para verificar se estamos em desenvolvimento
export const isDevelopment = () => config.nodeEnv === 'development'

// Função para verificar se estamos em produção
export const isProduction = () => config.nodeEnv === 'production'

// Log de configuração (apenas em desenvolvimento)
if (isDevelopment() && typeof window === 'undefined') {
  console.log('🔧 Environment configuration loaded:', {
    nodeEnv: config.nodeEnv,
    supabaseUrl: config.supabaseUrl,
    appUrl: config.appUrl,
    hasServiceKey: !!config.supabaseServiceKey,
  })
}