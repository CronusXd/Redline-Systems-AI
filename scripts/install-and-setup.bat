@echo off
echo ========================================
echo  Instalando dependencias necessarias
echo ========================================
echo.

echo Instalando biblioteca pg...
call npm install pg

echo.
echo ========================================
echo  Executando configuracao automatica
echo ========================================
echo.

node scripts/auto-setup-database.js

echo.
echo Pressione qualquer tecla para sair...
pause > nul
