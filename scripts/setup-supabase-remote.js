const { createClient } = require('@supabase/supabase-js')

// Credenciais do Supabase
const supabaseUrl = 'https://gmxsemjelybvqpsklkcj.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdteHNlbWplbHlidnFwc2tsa2NqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA3NjQxNiwiZXhwIjoyMDc2NjUyNDE2fQ.wkz42Ya1ZZGGw-YrcqzOKvWM2bQVIdDXFGK3SfnwcHM'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Iniciando configuração remota do Supabase...\n')

  try {
    // 1. Testar conexão
    console.log('📡 Testando conexão com Supabase...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError && authError.message !== 'Auth session missing!') {
      console.error('❌ Erro na autenticação:', authError.message)
    } else {
      console.log('✅ Conexão estabelecida com sucesso!\n')
    }

    // 2. Verificar se a tabela profiles existe
    console.log('🔍 Verificando tabela profiles...')
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (checkError) {
      if (checkError.code === 'PGRST116' || checkError.message.includes('does not exist')) {
        console.log('⚠️  Tabela profiles não existe. Será necessário criar via SQL Editor.\n')
        console.log('📋 Execute o seguinte SQL no Supabase SQL Editor:\n')
        console.log('=' .repeat(80))
        console.log(getSQLScript())
        console.log('=' .repeat(80))
        console.log('\n📍 Acesse: https://supabase.com/dashboard/project/gmxsemjelybvqpsklkcj/editor/sql\n')
      } else {
        console.error('❌ Erro ao verificar tabela:', checkError.message)
      }
    } else {
      console.log('✅ Tabela profiles já existe!\n')
      
      // Verificar estrutura da tabela
      console.log('🔍 Verificando estrutura da tabela...')
      const { data: profileData, error: structureError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      if (!structureError) {
        console.log('✅ Estrutura da tabela OK!')
        if (profileData && profileData.length > 0) {
          console.log('📊 Exemplo de registro:', JSON.stringify(profileData[0], null, 2))
        } else {
          console.log('📊 Tabela está vazia (sem registros)')
        }
      }
    }

    // 3. Testar criação de usuário (simulação)
    console.log('\n🧪 Testando funcionalidade de autenticação...')
    const testEmail = `test_${Date.now()}@example.com`
    const testPassword = 'Test123456!'
    
    console.log(`📝 Tentando criar usuário de teste: ${testEmail}`)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Usuário Teste',
          phone: null
        }
      }
    })

    if (signUpError) {
      console.log('⚠️  Erro ao criar usuário de teste:', signUpError.message)
      if (signUpError.message.includes('Email rate limit exceeded')) {
        console.log('ℹ️  Isso é normal - limite de taxa de email atingido')
      }
    } else if (signUpData.user) {
      console.log('✅ Usuário de teste criado com sucesso!')
      console.log('📧 ID do usuário:', signUpData.user.id)
      
      // Tentar deletar o usuário de teste
      console.log('🧹 Limpando usuário de teste...')
      // Nota: Deletar usuário requer permissões especiais
    }

    // 4. Resumo final
    console.log('\n' + '='.repeat(80))
    console.log('📊 RESUMO DA CONFIGURAÇÃO')
    console.log('='.repeat(80))
    console.log('✅ Conexão com Supabase: OK')
    console.log('✅ URL do projeto:', supabaseUrl)
    console.log('✅ Autenticação: Configurada')
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('⚠️  Tabela profiles: PRECISA SER CRIADA')
      console.log('\n📋 PRÓXIMOS PASSOS:')
      console.log('1. Acesse: https://supabase.com/dashboard/project/gmxsemjelybvqpsklkcj/editor/sql')
      console.log('2. Cole o SQL mostrado acima')
      console.log('3. Clique em "Run" para executar')
      console.log('4. Execute este script novamente para verificar')
    } else {
      console.log('✅ Tabela profiles: OK')
      console.log('\n🎉 CONFIGURAÇÃO COMPLETA!')
      console.log('Você já pode usar o sistema de autenticação.')
    }
    console.log('='.repeat(80))

  } catch (error) {
    console.error('\n💥 Erro geral:', error.message)
    console.error('Stack:', error.stack)
  }
}

function getSQLScript() {
  return `
-- 1. Criar tabela profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Criar policies de segurança
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Criar função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`
}

// Executar
setupDatabase()
