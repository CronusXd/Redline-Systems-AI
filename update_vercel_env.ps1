$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL"      = "https://mduyqujdajzmyvpmoruc.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdXlxdWpkYWp6bXl2cG1vcnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODMyMTMsImV4cCI6MjA3NjY1OTIxM30.nzwJfAaOhVhv6xGAjQj2siBeKa-Q5oxgbOvFzoKY9s4"
    "SUPABASE_SERVICE_ROLE_KEY"     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdXlxdWpkYWp6bXl2cG1vcnVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA4MzIxMywiZXhwIjoyMDc2NjU5MjEzfQ.We-NVw28ULM_mSP9h16PVGfb6ByB3sLU7E5QzJ0f8h8"
    "PIXGO_API_KEY"                 = "pk_56db5ecf59631fe0fdbed5e68ccdd485608c941c666c76ad6a6ac84cf90fae7a"
}

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "----------------------------------------"
    Write-Host "Configurando $key..." -ForegroundColor Yellow
    
    # Tenta remover a variável existente (ignora erro se não existir)
    Write-Host "Removendo versão anterior (se houver)..."
    vercel env rm $key production -y 2>$null
    
    # Adiciona a nova variável
    Write-Host "Adicionando nova versão..."
    $value | vercel env add $key production
}

Write-Host "----------------------------------------"
Write-Host "✅ Todas as variáveis foram atualizadas!" -ForegroundColor Green
