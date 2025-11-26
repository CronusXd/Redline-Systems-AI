@echo off
echo ========================================
echo  Instalando Supabase CLI
echo ========================================
echo.

echo Verificando se o Supabase CLI esta instalado...
where supabase >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Supabase CLI ja esta instalado!
    supabase --version
) else (
    echo Instalando Supabase CLI via npm...
    npm install -g supabase
)

echo.
echo ========================================
echo  Configurando e executando SQL
echo ========================================
echo.

node scripts/execute-sql-via-cli.js

pause
