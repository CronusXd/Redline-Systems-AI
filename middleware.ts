import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificar sessão do usuário
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl

  // Rotas que requerem autenticação
  const protectedRoutes = [
    '/dashboard',
    '/auth/profile',
    '/admin'
  ]

  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Se usuário não está logado e tenta acessar rota protegida
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // REMOVIDO: Redirecionamento de usuários logados para dashboard
  // Isso estava causando loops de redirecionamento quando o cookie não estava sincronizado
  // Deixamos o cliente (AuthContext/LoginPage) decidir se deve redirecionar

  // Para rotas protegidas, verificar se o usuário tem perfil (opcional, apenas log)
  if (user && isProtectedRoute) {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        console.error('Tabela profiles não encontrada ou perfil ausente.')
      }
    } catch (error) {
      console.error('Erro ao verificar perfil:', error)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}