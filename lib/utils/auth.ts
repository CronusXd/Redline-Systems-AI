import { AuthError, PostgrestError } from '@supabase/supabase-js'

// Tipos de erro
export interface ErrorInfo {
  message: string
  type: 'auth' | 'validation' | 'network' | 'database' | 'unknown'
  code?: string
  retryable?: boolean
}

// Mapeamento de erros de autenticação
const authErrorMap: Record<string, ErrorInfo> = {
  'Invalid login credentials': {
    message: 'Email ou senha incorretos',
    type: 'auth',
    code: 'INVALID_CREDENTIALS'
  },
  'User already registered': {
    message: 'Este email já está cadastrado',
    type: 'auth',
    code: 'USER_EXISTS'
  },
  'Password should be at least 6 characters': {
    message: 'A senha deve ter pelo menos 6 caracteres',
    type: 'validation',
    code: 'WEAK_PASSWORD'
  },
  'Unable to validate email address: invalid format': {
    message: 'Formato de email inválido',
    type: 'validation',
    code: 'INVALID_EMAIL'
  },
  'Email not confirmed': {
    message: 'Email não confirmado. Verifique sua caixa de entrada',
    type: 'auth',
    code: 'EMAIL_NOT_CONFIRMED'
  },
  'Token has expired or is invalid': {
    message: 'Sessão expirada. Faça login novamente',
    type: 'auth',
    code: 'TOKEN_EXPIRED'
  },
  'Signup requires a valid password': {
    message: 'Senha é obrigatória',
    type: 'validation',
    code: 'PASSWORD_REQUIRED'
  },
  'User not found': {
    message: 'Usuário não encontrado',
    type: 'auth',
    code: 'USER_NOT_FOUND'
  },
  'Email rate limit exceeded': {
    message: 'Muitas tentativas. Tente novamente em alguns minutos',
    type: 'auth',
    code: 'RATE_LIMIT',
    retryable: true
  }
}

// Mapeamento de erros de banco de dados
const databaseErrorMap: Record<string, ErrorInfo> = {
  'PGRST116': {
    message: 'Recurso não encontrado',
    type: 'database',
    code: 'NOT_FOUND'
  },
  'PGRST202': {
    message: 'Função não encontrada no banco de dados',
    type: 'database',
    code: 'FUNCTION_NOT_FOUND'
  },
  '23505': {
    message: 'Este registro já existe',
    type: 'database',
    code: 'DUPLICATE_KEY'
  },
  '23503': {
    message: 'Referência inválida',
    type: 'database',
    code: 'FOREIGN_KEY_VIOLATION'
  },
  '42P01': {
    message: 'Tabela não encontrada',
    type: 'database',
    code: 'TABLE_NOT_FOUND'
  }
}

// Função principal para mapear erros
export const getAuthErrorMessage = (error: AuthError | PostgrestError | Error | any): string => {
  const errorInfo = getErrorInfo(error)
  return errorInfo.message
}

// Função para obter informações completas do erro
export const getErrorInfo = (error: AuthError | PostgrestError | Error | any): ErrorInfo => {
  // Erro de rede
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return {
      message: 'Erro de conexão. Verifique sua internet e tente novamente',
      type: 'network',
      code: 'NETWORK_ERROR',
      retryable: true
    }
  }

  // Erro de timeout
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return {
      message: 'Operação demorou muito para responder. Tente novamente',
      type: 'network',
      code: 'TIMEOUT',
      retryable: true
    }
  }

  // Erro do Supabase/PostgreSQL
  if (error.code && databaseErrorMap[error.code]) {
    return databaseErrorMap[error.code]
  }

  // Erro de autenticação
  if (error.message && authErrorMap[error.message]) {
    return authErrorMap[error.message]
  }

  // Verificar se é um erro de validação do Zod
  if (error.name === 'ZodError' || error.errors) {
    return {
      message: 'Dados inválidos. Verifique os campos e tente novamente',
      type: 'validation',
      code: 'VALIDATION_ERROR'
    }
  }

  // Erro genérico com mensagem
  if (error.message) {
    return {
      message: error.message,
      type: 'unknown',
      code: 'UNKNOWN_ERROR'
    }
  }

  // Erro completamente desconhecido
  return {
    message: 'Erro inesperado. Tente novamente ou entre em contato com o suporte',
    type: 'unknown',
    code: 'UNKNOWN_ERROR'
  }
}

// Função para logar erros (para debugging)
export const logError = (error: any, context?: string) => {
  const errorInfo = getErrorInfo(error)
  
  console.error('Error occurred:', {
    context,
    errorInfo,
    originalError: error,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
  })

  // Em produção, você pode enviar para um serviço de monitoramento
  if (process.env.NODE_ENV === 'production') {
    // Exemplo: Sentry, LogRocket, etc.
    // sendToErrorTracking(error, context, errorInfo)
  }
}

// Função para determinar se um erro é recuperável
export const isRetryableError = (error: any): boolean => {
  const errorInfo = getErrorInfo(error)
  return errorInfo.retryable === true || errorInfo.type === 'network'
}

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um número' }
  }
  
  return { isValid: true }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const formatPhone = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '')
  
  // Aplica a máscara (XX) XXXXX-XXXX
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

export const validatePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '')
  return numbers.length === 11
}