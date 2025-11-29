# 🧪 Teste Manual do Fluxo de Pagamento

## ✅ Servidor Iniciado

```
✓ Ready in 5.9s
- Local: http://localhost:3001
```

---

## 📋 Checklist de Testes

### Preparação
- [x] Servidor rodando em http://localhost:3001
- [ ] Abrir navegador em /whatsapp
- [ ] Fazer login com usuário de teste
- [ ] Inserir número de telefone
- [ ] Completar análise

### Teste 1: Primeiro Pagamento
- [ ] Clicar em "Liberar Acesso Completo"
- [ ] Verificar modal de pagamento abre
- [ ] Verificar QR code é exibido
- [ ] Simular pagamento (via PixGo dashboard ou mock)
- [ ] Verificar modal de pagamento fecha
- [ ] Verificar modal de erro abre
- [ ] Verificar mensagem: "Erro de processamento. Gerando novo código..."
- [ ] Verificar loader azul girando
- [ ] Verificar SEM contador de tentativas
- [ ] Aguardar 3 segundos
- [ ] Verificar modal de erro fecha automaticamente
- [ ] Verificar novo QR code é gerado automaticamente
- [ ] Verificar modal de pagamento abre com novo QR

### Teste 2: Segundo Pagamento
- [ ] Simular pagamento do 2º QR code
- [ ] Verificar modal de pagamento fecha
- [ ] Verificar modal de erro abre
- [ ] Verificar mensagem: "Erro com seu banco. Aguarde..."
- [ ] Verificar timer exibido: "30:00"
- [ ] Verificar timer decrementa: 29:59, 29:58...
- [ ] Verificar loader pequeno girando
- [ ] Verificar SEM contador de tentativas
- [ ] Aguardar timer chegar a 00:00 (ou simular)
- [ ] Verificar modal de erro fecha automaticamente
- [ ] Verificar novo QR code é gerado automaticamente
- [ ] Verificar modal de pagamento abre com novo QR

### Teste 3: Terceiro Pagamento (Loop)
- [ ] Simular pagamento do 3º QR code
- [ ] Verificar comportamento idêntico ao Teste 2
- [ ] Verificar timer 30:00 novamente
- [ ] Confirmar loop continua

### Teste 4: Verificação no Supabase
- [ ] Abrir Supabase dashboard
- [ ] Verificar tabela `payment_attempts`
- [ ] Verificar registros com `is_simulated_error: true`
- [ ] Verificar `status: 'completed'`
- [ ] Verificar contador incrementando

### Teste 5: Usuário Para de Pagar
- [ ] Deixar QR code expirar (20 minutos)
- [ ] Verificar status muda para `expired`
- [ ] Verificar contador não pagos: 1/2
- [ ] Aguardar 30 minutos
- [ ] Gerar novo QR code
- [ ] Deixar expirar novamente
- [ ] Verificar contador: 2/2
- [ ] Tentar gerar 3º QR code
- [ ] Verificar bloqueio: "Limite de 2 QR codes não pagos por dia"

---

## 🔍 Pontos de Verificação

### Backend (Console do Servidor)
```bash
# Verificar logs:
- "Error counting completed payments" (se houver erro)
- "Error handling payment completion" (se houver erro)
- Chamadas para getCompletedPaymentCountForPhone()
- Chamadas para handlePaymentCompletion()
```

### Frontend (Console do Navegador)
```javascript
// Verificar estados:
- showErrorModal: true/false
- errorMessage: string
- autoGenerateTimer: number (1800 para 30min)
- isWaitingAutoGenerate: true/false
- paymentStatus: 'completed'
```

### Supabase (Tabela payment_attempts)
```sql
SELECT 
  payment_id,
  phone_number,
  status,
  is_simulated_error,
  created_at
FROM payment_attempts
WHERE user_id = '[user_id]'
ORDER BY created_at DESC;
```

---

## 📊 Resultados Esperados

| Teste | Status | Observação |
|-------|--------|------------|
| 1º Pagamento | ⏳ Pendente | Erro → 3s → Novo QR |
| 2º Pagamento | ⏳ Pendente | Erro → 30min → Novo QR |
| 3º Pagamento | ⏳ Pendente | Loop confirmado |
| Supabase | ⏳ Pendente | Registros corretos |
| Fallback | ⏳ Pendente | Bloqueio 24h |

---

## 🐛 Possíveis Problemas

### Problema 1: Modal não abre
**Causa:** Estado `showErrorModal` não está sendo setado
**Solução:** Verificar `handlePaymentCompletion` está sendo chamado

### Problema 2: Timer não decrementa
**Causa:** `startAutoGenerateCountdown` não está sendo executado
**Solução:** Verificar `setIsWaitingAutoGenerate(true)` está sendo chamado

### Problema 3: QR code não gera automaticamente
**Causa:** `handlePayment()` não está sendo chamado após timer
**Solução:** Verificar `clearInterval` e chamada de `handlePayment()`

### Problema 4: Contador de tentativas aparece
**Causa:** Código antigo ainda presente
**Solução:** Verificar JSX do modal não tem `{paymentCount}`

---

## 📝 Notas de Teste

**Data:** 2025-11-28
**Hora:** 22:47
**Servidor:** http://localhost:3001
**Status:** Aguardando testes manuais

**Próximos Passos:**
1. Abrir navegador
2. Navegar para /whatsapp
3. Executar checklist de testes
4. Documentar resultados
5. Corrigir bugs se necessário
