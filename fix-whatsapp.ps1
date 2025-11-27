# Script para aplicar correções na página WhatsApp

$file = "app\whatsapp\page.tsx"
$content = Get-Content $file -Raw

# 1. Forçar dark mode - remover classes light mode
$content = $content -replace 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800', 'bg-gray-900'
$content = $content -replace 'bg-white dark:bg-gray-800', 'bg-gray-800'
$content = $content -replace 'text-gray-600 dark:text-gray-400', 'text-gray-400'
$content = $content -replace 'text-gray-900 dark:text-white', 'text-white'

# 2. Mudar botão para "START"
$content = $content -replace '\{t\(''whatsapp\.start''\)\}', 'Start'

# 3. Mudar tempo para 50-90s
$content = $content -replace '// Tempo total entre 60-90 segundos', '// Tempo total entre 50-90 segundos'
$content = $content -replace 'Math\.floor\(Math\.random\(\) \* 30000\) \+ 60000 // 60-90s', 'Math.floor(Math.random() * 40000) + 50000 // 50-90s'

# 4. Remover setTimeout do validatePhoneNumber
$content = $content -replace 'setTimeout\(\(\) => \{\s+startAnalysis\(\)\s+\}, 500\)', 'startAnalysis()'

# Salvar arquivo
Set-Content -Path $file -Value $content -NoNewline

Write-Host "Correções aplicadas com sucesso!"
