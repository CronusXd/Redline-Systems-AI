'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { profileUpdateSchema, ProfileUpdateFormData } from '@/lib/validations/auth'
import { LogOut, Save, User } from 'lucide-react'
import { clsx } from 'clsx'

interface ProfileFormProps {
  className?: string
}

const ProfileForm: React.FC<ProfileFormProps> = ({ className }) => {
  const { user, profile, updateProfile, signOut } = useAuth()

  const [formData, setFormData] = useState<ProfileUpdateFormData>({
    name: '',
    phone: ''
  })

  const [errors, setErrors] = useState<Partial<ProfileUpdateFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)

  // Carregar dados do perfil quando disponível
  useEffect(() => {
    if (profile) {
      const newFormData = {
        name: profile.name || '',
        phone: profile.phone || ''
      }
      setFormData(newFormData)
    }
  }, [profile])

  // Verificar se há mudanças
  useEffect(() => {
    if (profile) {
      const hasNameChange = formData.name !== (profile.name || '')
      const hasPhoneChange = formData.phone !== (profile.phone || '')
      setHasChanges(hasNameChange || hasPhoneChange)
    }
  }, [formData, profile])

  // Função para validar um campo específico
  const validateField = (name: keyof ProfileUpdateFormData, value: string) => {
    try {
      const fieldSchema = profileUpdateSchema.shape[name]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors(prev => ({ ...prev, [name]: undefined }))
      }
    } catch (error: any) {
      if (error.errors?.[0]?.message) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }))
      }
    }
  }

  // Função para lidar com mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))

    // Limpar mensagens quando o usuário começar a editar
    if (submitError) setSubmitError('')
    if (successMessage) setSuccessMessage('')

    // Validar campo em tempo real
    if (value.length > 0 || errors[name as keyof ProfileUpdateFormData]) {
      validateField(name as keyof ProfileUpdateFormData, value)
    }
  }

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    // Validar todos os campos
    try {
      profileUpdateSchema.parse(formData)
      setErrors({})
    } catch (error: any) {
      const fieldErrors: Partial<ProfileUpdateFormData> = {}
      error.errors?.forEach((err: any) => {
        if (err.path?.[0]) {
          fieldErrors[err.path[0] as keyof ProfileUpdateFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone || undefined
      })

      if (result.success) {
        setSuccessMessage('Perfil atualizado com sucesso!')
        setHasChanges(false)
      } else {
        setSubmitError(result.error || 'Erro ao atualizar perfil')
      }
    } catch (error) {
      setSubmitError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para fazer logout
  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await signOut()
    }
  }

  // Função para resetar formulário
  const handleReset = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || ''
      })
      setErrors({})
      setSubmitError('')
      setSuccessMessage('')
    }
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('w-full max-w-2xl mx-auto', className)}>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
              <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            Sair
          </Button>
        </div>

        {/* Informações da conta */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Informações da Conta</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            {profile.created_at && (
              <p><span className="font-medium">Conta criada em:</span> {new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
            )}
            {profile.updated_at && profile.updated_at !== profile.created_at && (
              <p><span className="font-medium">Última atualização:</span> {new Date(profile.updated_at).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        </div>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Mensagem de erro */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <FormField
            name="name"
            label="Nome completo"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Digite seu nome completo"
            autoComplete="name"
          />

          {/* Telefone */}
          <FormField
            name="phone"
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="(11) 99999-9999"
            helperText="Opcional - formato: (11) 99999-9999"
            autoComplete="tel"
          />

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              loading={isLoading}
              disabled={!hasChanges}
              leftIcon={<Save className="h-4 w-4" />}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>

            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>

        {/* Informações adicionais */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Segurança</h3>
          <p className="text-sm text-gray-600 mb-3">
            Para alterar seu email ou senha, entre em contato com o suporte.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // TODO: Implementar mudança de senha
              alert('Funcionalidade de alteração de senha será implementada em breve')
            }}
          >
            Alterar senha
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ProfileForm }