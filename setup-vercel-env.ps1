# Script para adicionar variáveis de ambiente na Vercel
# Execute este script no PowerShell

Write-Host "🚀 Configurando variáveis de ambiente na Vercel..." -ForegroundColor Cyan

# Variável 1: NEXT_PUBLIC_SUPABASE_URL
Write-Host "`n📝 Adicionando NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
echo "https://mduyqujdajzmyvpmoruc.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development

# Variável 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
Write-Host "`n📝 Adicionando NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdXlxdWpkYWp6bXl2cG1vcnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODMyMTMsImV4cCI6MjA3NjY1OTIxM30.nzwJfAaOhVhv6xGAjQj2siBeKa-Q5oxgbOvFzoKY9s4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

# Variável 3: SUPABASE_SERVICE_ROLE_KEY
Write-Host "`n📝 Adicionando SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdXlxdWpkYWp6bXl2cG1vcnVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA4MzIxMywiZXhwIjoyMDc2NjU5MjEzfQ.We-NVw28ULM_mSP9h16PVGfb6ByB3sLU7E5QzJ0f8h8" | vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development

# Variável 4: PIXGO_API_KEY
Write-Host "`n📝 Adicionando PIXGO_API_KEY..." -ForegroundColor Yellow
echo "pk_56db5ecf59631fe0fdbed5e68ccdd485608c941c666c76ad6a6ac84cf90fae7a" | vercel env add PIXGO_API_KEY production preview development

Write-Host "`n✅ Todas as variáveis foram adicionadas!" -ForegroundColor Green
Write-Host "`n🔄 Agora execute: vercel --prod" -ForegroundColor Cyan
Write-Host "   Para fazer o redeploy com as novas variáveis.`n" -ForegroundColor Cyan
