'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from '@/components/ui/Button'
import { PageLoading } from '@/components/ui/Loading'
import { FadeIn, StaggeredAnimation } from '@/components/ui/Transitions'
import { createBrowserClient } from '@supabase/ssr'
import {
  User,
  LogOut,
  Activity,
  FileText,
  Home,
  MessageCircle,
  Image as ImageIcon,
  Video
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  )
}

interface Consulta {
  id: string
  created_at: string
  phone_number: string
  messages_count: number
  images_count: number
  videos_count: number
}

const DashboardContent: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchConsultas = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('consultas')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) {
          setConsultas(data)
        }
      }
    }

    fetchConsultas()
  }, [user, supabase])

  if (loading) {
    return <PageLoading text="Carregando dashboard..." />
  }

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await signOut()
    }
  }

  const stats = [
    { name: 'Consultas Realizadas', value: consultas.length.toString(), icon: FileText, color: 'text-blue-400' },
    { name: 'Atividades Hoje', value: consultas.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length.toString(), icon: Activity, color: 'text-green-400' },
  ]

  const quickActions = [
    { name: 'Nova Consulta', href: '/whatsapp', icon: MessageCircle, description: 'Iniciar nova análise de WhatsApp' },
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

              {/* Profile Link */}
              <Link
                href="/auth/profile"
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-700"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Meu Perfil</span>
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
          <StaggeredAnimation className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

          {/* Consultas Recentes */}
          <FadeIn delay={200}>
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 mb-6">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  Consultas Recentes
                </h3>
                <Link href="/whatsapp" className="text-sm text-blue-400 hover:text-blue-300">
                  Nova Consulta
                </Link>
              </div>
              <div className="p-6">
                {consultas.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Telefone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mensagens</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Imagens</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vídeos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {consultas.map((consulta) => (
                          <tr key={consulta.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(consulta.created_at).toLocaleDateString('pt-BR')} {new Date(consulta.created_at).toLocaleTimeString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                              {consulta.phone_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4 text-blue-400" />
                                <span>{consulta.messages_count}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex items-center space-x-1">
                                <ImageIcon className="w-4 h-4 text-purple-400" />
                                <span>{consulta.images_count}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex items-center space-x-1">
                                <Video className="w-4 h-4 text-pink-400" />
                                <span>{consulta.videos_count}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Concluído
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Nenhuma consulta realizada ainda.</p>
                    <Link href="/whatsapp">
                      <Button variant="primary" size="sm">
                        Realizar Primeira Consulta
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Ações rápidas */}
          <FadeIn delay={400}>
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">
                  Ações Rápidas
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
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