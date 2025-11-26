'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from '@/components/ui/Button'
import { PageLoading } from '@/components/ui/Loading'
import { FadeIn, StaggeredAnimation } from '@/components/ui/Transitions'
import {
  User,
  Settings,
  Shield,
  LogOut,
  Bell,
  Activity,
  Calendar,
  FileText,
  Home
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  )
}

const DashboardContent: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth()

  if (loading) {
    return <PageLoading text="Carregando dashboard..." />
  }

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await signOut()
    }
  }

  const stats = [
    { name: 'Projetos Ativos', value: '12', icon: FileText, color: 'text-blue-400' },
    { name: 'Tarefas Pendentes', value: '8', icon: Calendar, color: 'text-yellow-400' },
    { name: 'Atividades Hoje', value: '24', icon: Activity, color: 'text-green-400' },
    { name: 'Notificações', value: '3', icon: Bell, color: 'text-red-400' },
  ]

  const quickActions = [
    { name: 'Meu Perfil', href: '/auth/profile', icon: User, description: 'Gerenciar informações pessoais' },
    { name: 'Configurações', href: '/settings', icon: Settings, description: 'Preferências do sistema' },
    { name: 'Segurança', href: '/security', icon: Shield, description: 'Configurações de segurança' },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">
                Dashboard
              </h1>

              {/* Home Link */}
              <Link
                href="/"
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-700"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">Home</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Profile Info */}
              <div className="flex items-center space-x-3 bg-gray-700 px-4 py-2 rounded-lg">
                <div className="bg-blue-600 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {profile?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email || profile?.email}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="h-4 w-4" />}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Boas-vindas */}
          <FadeIn>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-2">
                Bem-vindo, {profile?.name || 'Usuário'}! 👋
              </h2>
              <p className="text-gray-400">
                Aqui está um resumo das suas atividades e acesso rápido às principais funcionalidades.
              </p>
            </div>
          </FadeIn>

          {/* Estatísticas */}
          <StaggeredAnimation className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </StaggeredAnimation>

          {/* Ações rápidas */}
          <FadeIn delay={400}>
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">
                  Ações Rápidas
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="group block p-4 border border-gray-700 rounded-lg hover:border-blue-600 hover:shadow-lg transition-all duration-200 bg-gray-700/50"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <action.icon className="h-6 w-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                            {action.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Informações da conta */}
          <FadeIn delay={600}>
            <div className="mt-6 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">
                Informações da Conta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Email</p>
                  <p className="text-sm text-white">{user?.email || profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Nome</p>
                  <p className="text-sm text-white">{profile?.name || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Telefone</p>
                  <p className="text-sm text-white">{profile?.phone || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Membro desde</p>
                  <p className="text-sm text-white">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  )
}