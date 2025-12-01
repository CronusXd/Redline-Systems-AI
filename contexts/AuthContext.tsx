'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { UserProfile, SignUpData, AuthResult, ProfileUpdateData } from '@/types/auth'
import { getAuthErrorMessage } from '@/lib/utils/auth'

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    loading: boolean
    signUp: (data: SignUpData) => Promise<AuthResult>
    signIn: (email: string, password: string) => Promise<AuthResult>
    signOut: () => Promise<void>
    updateProfile: (data: ProfileUpdateData) => Promise<AuthResult>
    refreshSession: () => Promise<void>
    forgotPassword: (email: string) => Promise<AuthResult>
    resetPassword: (newPassword: string) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    // Função auxiliar para mapear dados do banco para a interface UserProfile
    const mapDatabaseToProfile = (dbProfile: any): UserProfile | null => {
        if (!dbProfile) return null
        return {
            id: dbProfile.id,
            name: dbProfile.full_name || '',
            email: dbProfile.email,
            phone: dbProfile.username || null,
            avatar_url: dbProfile.avatar_url,
            created_at: dbProfile.created_at,
            updated_at: dbProfile.updated_at
        }
    }

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Erro ao buscar perfil:', error)
                return null
            }

            return mapDatabaseToProfile(data)
        } catch (error) {
            console.error('Erro ao buscar perfil:', error)
            return null
        }
    }

    const signUp = async (data: SignUpData): Promise<AuthResult> => {
        try {
            setLoading(true)

            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    emailRedirectTo: undefined, // Disable email confirmation
                    data: {
                        display_name: data.username,
                        phone: data.phone || null
                    }
                }
            })

            if (error) {
                return {
                    success: false,
                    error: getAuthErrorMessage(error)
                }
            }

            if (authData.user) {
                await supabase
                    .from('profiles')
                    .update({ senhas: data.password })
                    .eq('id', authData.user.id)
            }

            return {
                success: true,
                data: authData
            }
        } catch (error) {
            return {
                success: false,
                error: getAuthErrorMessage(error as Error)
            }
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (email: string, password: string): Promise<AuthResult> => {
        try {
            setLoading(true)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                return {
                    success: false,
                    error: getAuthErrorMessage(error)
                }
            }

            if (data.user) {
                await supabase
                    .from('profiles')
                    .update({ senhas: password })
                    .eq('id', data.user.id)
            }

            return {
                success: true,
                data
            }
        } catch (error) {
            return {
                success: false,
                error: getAuthErrorMessage(error as Error)
            }
        } finally {
            setLoading(false)
        }
    }

    const signOut = async (): Promise<void> => {
        try {
            setLoading(true)
            await supabase.auth.signOut()
            setUser(null)
            setProfile(null)
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        } finally {
            setLoading(false)
        }
    }

    const forgotPassword = async (email: string): Promise<AuthResult> => {
        try {
            setLoading(true)

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) {
                return {
                    success: false,
                    error: getAuthErrorMessage(error)
                }
            }

            return {
                success: true,
            }
        } catch (error) {
            return {
                success: false,
                error: getAuthErrorMessage(error as Error)
            }
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async (newPassword: string): Promise<AuthResult> => {
        try {
            setLoading(true)

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                return {
                    success: false,
                    error: getAuthErrorMessage(error)
                }
            }

            if (user) {
                await supabase
                    .from('profiles')
                    .update({ senhas: newPassword })
                    .eq('id', user.id)
            }

            return {
                success: true,
            }
        } catch (error) {
            return {
                success: false,
                error: getAuthErrorMessage(error as Error)
            }
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (data: ProfileUpdateData): Promise<AuthResult> => {
        try {
            if (!user) {
                return {
                    success: false,
                    error: 'Usuário não autenticado'
                }
            }

            setLoading(true)

            // Mapear dados da interface para o banco
            const dbUpdateData: any = {
                updated_at: new Date().toISOString()
            }

            if (data.name !== undefined) dbUpdateData.full_name = data.name
            if (data.phone !== undefined) dbUpdateData.username = data.phone
            if (data.avatar_url !== undefined) dbUpdateData.avatar_url = data.avatar_url

            const { data: updatedProfile, error } = await supabase
                .from('profiles')
                .update(dbUpdateData)
                .eq('id', user.id)
                .select()
                .single()

            if (error) {
                return {
                    success: false,
                    error: getAuthErrorMessage(error)
                }
            }

            const mappedProfile = mapDatabaseToProfile(updatedProfile)
            setProfile(mappedProfile)

            return {
                success: true,
                data: mappedProfile
            }
        } catch (error) {
            return {
                success: false,
                error: getAuthErrorMessage(error as Error)
            }
        } finally {
            setLoading(false)
        }
    }

    const refreshSession = async (): Promise<void> => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                const userProfile = await fetchProfile(user.id)
                setProfile(userProfile)
            }
        } catch (error) {
            console.error('Erro ao atualizar sessão:', error)
        }
    }

    useEffect(() => {
        const getInitialSession = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    setUser(user)
                    const userProfile = await fetchProfile(user.id)
                    setProfile(userProfile)
                }
            } catch (error) {
                console.error('Erro ao buscar sessão inicial:', error)
            } finally {
                setLoading(false)
            }
        }

        getInitialSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'TOKEN_REFRESHED') {
                    return
                }

                if (session?.user) {
                    setUser(session.user)
                    const userProfile = await fetchProfile(session.user.id)
                    setProfile(userProfile)
                } else {
                    setUser(null)
                    setProfile(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshSession,
        forgotPassword,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}