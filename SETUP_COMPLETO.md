# 🚀 Guia Completo de Configuração do Supabase

## ✅ Status Atual

- ✅ Conexão com Supabase: **OK**
- ✅ Credenciais configuradas: **OK**
- ✅ Autenticação funcionando: **OK**
- ⚠️ Tabela profiles: **PRECISA SER CRIADA**

## 📋 Passo a Passo para Criar a Tabela

### 1️⃣ Acesse o SQL Editor do Supabase

Abra este link no seu navegador:
```
https://supabase.com/dashboard/project/gmxsemjelybvqpsklkcj/editor/sql
```

### 2️⃣ Crie uma Nova Query

- Clique no botão **"+ New query"** no canto superior esquerdo
- Ou use o atalho: **Ctrl + Enter**

### 3️⃣ Cole o SQL Abaixo

Copie e cole este SQL completo:

```sql
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
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
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
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4️⃣ Execute o SQL

- Clique no botão **"Run"** (ou pressione **Ctrl + Enter**)
- Aguarde a mensagem: **"Success. No rows returned"**

### 5️⃣ Verifique se Funcionou

Execute este comando no terminal:
```bash
node scripts/setup-supabase-remote.js
```

Você deve ver:
```
✅ Tabela profiles: OK
🎉 CONFIGURAÇÃO COMPLETA!
```

## 🧪 Testando o Sistema

### Teste 1: Criar uma Conta

1. Acesse: `http://localhost:3000`
2. Clique em **"Começar Agora"** ou **"Criar Conta"**
3. Preencha:
   - **Nome**: Seu nome
   - **Email**: wolverineimortalxd@gmail.com (ou outro)
   - **Senha**: Mínimo 8 caracteres, com maiúscula, minúscula e número
   - **Confirmar Senha**: Mesma senha
4. Clique em **"Criar conta"**

### Teste 2: Fazer Login

1. Clique em **"Já tenho conta"** ou **"Login"**
2. Digite seu email e senha
3. Clique em **"Entrar"**

### Teste 3: Ver Perfil

1. Após login, você será redirecionado para o dashboard
2. Clique no seu nome no header
3. Ou acesse: `http://localhost:3000/auth/profile`

## 🔍 Verificar no Supabase

### Ver Usuários Criados

1. Acesse: https://supabase.com/dashboard/project/gmxsemjelybvqpsklkcj/auth/users
2. Você verá todos os usuários registrados

### Ver Perfis Criados

1. Acesse: https://supabase.com/dashboard/project/gmxsemjelybvqpsklkcj/editor
2. Clique em **"profiles"** na lista de tabelas
3. Você verá todos os perfis com nome, telefone, etc.

## ❓ Problemas Comuns

### "Could not find the table 'public.profiles'"
**Solução**: Execute o SQL no passo 3 acima

### "Email address is invalid"
**Solução**: Use um email válido (ex: seuemail@gmail.com)

### "Password should be at least 8 characters"
**Solução**: Use uma senha com:
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número

### "Senhas não coincidem"
**Solução**: Digite a mesma senha nos dois campos

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique o console do navegador** (F12)
2. **Verifique o terminal** onde o Next.js está rodando
3. **Execute o teste de conexão**: `http://localhost:3000/test-connection`
4. **Execute o teste de senha**: `http://localhost:3000/test-password`

## 🎉 Pronto!

Após seguir estes passos, seu sistema de autenticação estará 100% funcional!

---

**Última atualização**: 21/12/2024
