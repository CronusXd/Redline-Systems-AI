'use server'

import { createClient } from '@supabase/supabase-js'

export async function resetPasswordAction(email: string, username: string, password: string) {
  // Sanitização básica
  const cleanEmail = email.trim().toLowerCase()
  const cleanUsername = username.trim()

  console.log('[Reset Password Action] Iniciando com:', { email: cleanEmail, username: cleanUsername, passwordLength: password.length })

  // Validar requisitos da senha
  if (password.length < 6) {
    console.error('[Reset Password Action] Senha muito curta (mínimo 6 caracteres)')
    return {
      success: false,
      error: 'A senha deve ter no mínimo 6 caracteres.'
    }
  }

  // Validar se temos a chave de serviço
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[Reset Password Action] SUPABASE_SERVICE_ROLE_KEY não definida')
    return {
      success: false,
      error: 'Erro de configuração no servidor. Chave de serviço ausente.'
    }
  }

  console.log('[Reset Password Action] Service Role Key encontrada')

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    // 1. Buscar usuário na tabela profiles (Bypass RLS)
    console.log('[Reset Password Action] Buscando usuário na tabela profiles...')

    const { data: profile, error: searchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name')
      .eq('email', cleanEmail)
      .eq('name', cleanUsername)
      .single()

    console.log('[Reset Password Action] Resultado da busca:', {
      found: !!profile,
      profileId: profile?.id,
      error: searchError
    })

    if (searchError || !profile) {
      console.log('[Reset Password Action] Usuário não encontrado:', {
        email: cleanEmail,
        username: cleanUsername,
        searchError: searchError?.message
      })
      return {
        success: false,
        error: 'Dados de cadastro não conferem. Verifique email e nome.'
      }
    }

    // 2. Verificar se o usuário existe no Auth antes de atualizar
    console.log('[Reset Password Action] Verificando usuário no Auth...')
    const { data: authUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(profile.id)

    console.log('[Reset Password Action] Usuário no Auth:', {
      exists: !!authUser?.user,
      email: authUser?.user?.email,
      confirmed_at: authUser?.user?.confirmed_at,
      error: getUserError?.message
    })

    if (getUserError || !authUser?.user) {
      console.error('[Reset Password Action] Usuário não encontrado no Auth')
      return {
        success: false,
        error: 'Usuário não encontrado no sistema de autenticação.'
      }
    }

    // 3. Invalidar TODAS as sessões antes de atualizar a senha
    console.log('[Reset Password Action] Invalidando todas as sessões antigas...')
    try {
      await supabaseAdmin.auth.admin.signOut(profile.id, 'global')
      console.log('[Reset Password Action] ✅ Sessões invalidadas')
    } catch (err) {
      console.warn('[Reset Password Action] Aviso ao invalidar sessões (ignorando):', err)
    }

    // Aguardar propagação da invalidação
    await new Promise(resolve => setTimeout(resolve, 500))

    // 4. MÉTODO DEFINITIVO: Deletar e recriar usuário (100% garantido)
    console.log('[Reset Password Action] 🔧 Deletando e recriando usuário para garantir mudança...')

    // Guardar metadados antes de deletar
    const userMetadata = authUser.user.user_metadata || {}
    const appMetadata = authUser.user.app_metadata || {}

    // Deletar usuário
    console.log('[Reset Password Action] Deletando usuário...')
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(profile.id)

    if (deleteError) {
      console.error('[Reset Password Action] MÉTODO 2: Falha ao deletar:', deleteError.message)
      return {
        success: false,
        error: `Erro ao resetar senha: ${deleteError.message}`
      }
    }

    console.log('[Reset Password Action] Usuário deletado, aguardando propagação...')
    await new Promise(resolve => setTimeout(resolve, 500))

    // Recriar com a nova senha
    console.log('[Reset Password Action] Recriando usuário com nova senha...')
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: userMetadata,
      app_metadata: appMetadata
    })

    if (createError) {
      console.error('[Reset Password Action] MÉTODO 2: Falha ao recriar:', createError.message)
      return {
        success: false,
        error: `Erro crítico ao recriar usuário: ${createError.message}`
      }
    }

    console.log('[Reset Password Action] Usuário recriado com ID:', newUser.user?.id)

    // Atualizar o profile.id se mudou
    if (newUser.user?.id && newUser.user.id !== profile.id) {
      console.log('[Reset Password Action] Atualizando profile com novo ID...')
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ id: newUser.user.id })
        .eq('id', profile.id)

      if (profileError) {
        console.error('[Reset Password Action] Erro ao atualizar profile:', profileError.message)
      }
    }

    // Aguardar propagação
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Teste final de login
    console.log('[Reset Password Action] 🧪 Testando login final...')

    const finalTestClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: finalLogin, error: finalError } = await finalTestClient.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    })

    console.log('[Reset Password Action] Resultado do teste final:', {
      success: !finalError,
      error: finalError?.message,
      userId: finalLogin?.user?.id
    })

    if (finalError) {
      console.error('[Reset Password Action] 🚨 CRÍTICO: Mesmo após recriar, login falhou')
      console.error('[Reset Password Action] Isso indica um problema de configuração do projeto Supabase')
      return {
        success: false,
        error: 'Não foi possível redefinir a senha. Entre em contato com o suporte.'
      }
    }

    console.log('[Reset Password Action] ✅ MÉTODO 2: Senha redefinida com sucesso!')
    return { success: true }

  } catch (error: any) {
    console.error('[Reset Password Action] Erro inesperado:', error)
    return {
      success: false,
      error: 'Erro interno no servidor.'
    }
  }
}
