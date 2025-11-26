export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  created_at: string
}

export interface UserProfile {
  id: string
  name: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
}

export interface SignUpData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface ProfileUpdateData {
  name?: string
  phone?: string
  avatar_url?: string
}

export interface AuthResult {
  success: boolean
  error?: string
  data?: any
}

export interface LoginData {
  email: string
  password: string
}