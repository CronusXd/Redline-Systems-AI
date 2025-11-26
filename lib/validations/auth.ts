import { z } from 'zod'

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(20, 'Nome de usuário deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underline')
    .regex(/^[a-zA-Z]/, 'Nome de usuário deve começar com uma letra'),

  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),

  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/(?=.*[a-z])/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/(?=.*[A-Z])/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/(?=.*\d)/, 'Senha deve conter pelo menos um número'),

  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),

  phone: z
    .string()
    .optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

export const signInSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),

  password: z
    .string()
    .min(1, 'Senha é obrigatória')
})

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),

  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true
      const numbers = phone.replace(/\D/g, '')
      return numbers.length === 11
    }, 'Telefone deve ter 11 dígitos')
})

export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória'),

  newPassword: z
    .string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/(?=.*[a-z])/, 'Nova senha deve conter pelo menos uma letra minúscula')
    .regex(/(?=.*[A-Z])/, 'Nova senha deve conter pelo menos uma letra maiúscula')
    .regex(/(?=.*\d)/, 'Nova senha deve conter pelo menos um número'),

  confirmNewPassword: z
    .string()
    .min(1, 'Confirmação da nova senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmNewPassword']
})

export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>