# 🧪 Análise Completa de Cenários e Edge Cases

## 🔴 Problema Reportado

**Cenário:** Usuário gerou QR code e saiu da tela sem pagar
**Erro:** `Failed to find Server Action`
**Causa:** Polling continuou rodando após sair da página

---

## 📋 Todos os Cenários Possíveis

### Cenário 1: Fluxo Normal (Pagamento Bem-Sucedido)
```
✅ Gera QR → Paga → Modal erro → Gera novo QR
Status: DEVE FUNCIONAR
```

### Cenário 2: Usuário Sai da Página com QR Ativo
```
❌ Gera QR → Sai da página → Polling continua rodando
Status: PROBLEMA IDENTIFICADO
Solução: Limpar polling no useEffect cleanup
```

### Cenário 3: Usuário Fecha Modal de Pagamento
```
❌ Gera QR → Fecha modal (X) → Polling continua
Status: PROBLEMA IDENTIFICADO
Solução: Limpar polling ao fechar modal
```

### Cenário 4: QR Code Expira
```
✅ Gera QR → Aguarda 20min → Expira
Status: DEVE FUNCIONAR (timer já limpa)
```

### Cenário 5: Usuário Navega para Outra Página
```
❌ Gera QR → Clica "Voltar" → Polling continua
Status: PROBLEMA IDENTIFICADO
Solução: Limpar polling no unmount
```

### Cenário 6: Múltiplos QR Codes Gerados Rapidamente
```
❌ Gera QR → Fecha → Gera novo → Fecha → Repete
Status: PROBLEMA POTENCIAL
Solução: Limpar polling anterior antes de criar novo
```

### Cenário 7: Timer de Auto-Geração Ativo + Sai da Página
```
❌ Paga 2º QR → Timer 30min ativo → Sai da página
Status: PROBLEMA IDENTIFICADO
Solução: Limpar countdown no unmount
```

### Cenário 8: Modal de Erro Aberto + Sai da Página
```
❌ Modal erro aberto → Sai da página → Timer continua
Status: PROBLEMA IDENTIFICADO
Solução: Limpar timer de auto-geração
```

### Cenário 9: Usuário Recarrega Página
```
⚠️ QR ativo → F5 (reload) → Estados perdidos
Status: COMPORTAMENTO ESPERADO
Nota: Pode gerar novo QR (verificar ativo no backend)
```

### Cenário 10: Conexão Cai Durante Polling
```
⚠️ Polling rodando → Internet cai → Erro de rede
Status: DEVE SER TRATADO
Solução: Try-catch no polling
```

---

## 🐛 Problemas Identificados

### Problema 1: Polling Não é Limpo
**Código Atual:**
```typescript
const startPaymentPolling = (paymentIdToCheck: string) => {
  const pollInterval = setInterval(async () => {
    // ...
  }, 3000)
  // ❌ Não retorna cleanup function
}
```

**Solução:**
```typescript
const startPaymentPolling = (paymentIdToCheck: string) => {
  const pollInterval = setInterval(async () => {
    // ...
  }, 3000)
  
  // ✅ Retornar cleanup
  return () => clearInterval(pollInterval)
}
```

### Problema 2: Countdown Não é Limpo
**Código Atual:**
```typescript
const startAutoGenerateCountdown = () => {
  const countdown = setInterval(() => {
    // ...
  }, 1000)
  // ❌ Não retorna cleanup function
}
```

**Solução:**
```typescript
const startAutoGenerateCountdown = () => {
  const countdown = setInterval(() => {
    // ...
  }, 1000)
  
  // ✅ Retornar cleanup
  return () => clearInterval(countdown)
}
```

### Problema 3: Sem useEffect para Cleanup
**Faltando:**
```typescript
useEffect(() => {
  // Cleanup ao desmontar componente
  return () => {
    // Limpar polling
    // Limpar countdown
    // Resetar estados
  }
}, [])
```

### Problema 4: Fechar Modal Não Limpa Polling
**Código Atual:**
```typescript
<button onClick={() => setShowPaymentModal(false)}>
  <X />
</button>
```

**Solução:**
```typescript
const handleClosePaymentModal = () => {
  // Limpar polling
  if (pollIntervalRef.current) {
    clearInterval(pollIntervalRef.current)
  }
  setShowPaymentModal(false)
  setPaymentStatus(null)
  setHasActivePayment(false)
}
```

### Problema 5: Sem Try-Catch no Polling
**Código Atual:**
```typescript
const pollInterval = setInterval(async () => {
  const statusResult = await checkPixPaymentStatus(paymentIdToCheck)
  // ❌ Sem tratamento de erro
}, 3000)
```

**Solução:**
```typescript
const pollInterval = setInterval(async () => {
  try {
    const statusResult = await checkPixPaymentStatus(paymentIdToCheck)
    // ...
  } catch (error) {
    console.error('Polling error:', error)
    // Não quebra o app
  }
}, 3000)
```

---

## ✅ Correções Necessárias

### 1. Adicionar useRef para Intervalos
```typescript
const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
```

### 2. Modificar startPaymentPolling
```typescript
const startPaymentPolling = (paymentIdToCheck: string) => {
  // Limpar polling anterior
  if (pollIntervalRef.current) {
    clearInterval(pollIntervalRef.current)
  }
  
  pollIntervalRef.current = setInterval(async () => {
    try {
      const { checkPixPaymentStatus } = await import('@/app/actions/pixgo')
      const statusResult = await checkPixPaymentStatus(paymentIdToCheck)
      // ... resto do código
    } catch (error) {
      console.error('Polling error:', error)
    }
  }, 3000)
}
```

### 3. Modificar startAutoGenerateCountdown
```typescript
const startAutoGenerateCountdown = () => {
  // Limpar countdown anterior
  if (countdownIntervalRef.current) {
    clearInterval(countdownIntervalRef.current)
  }
  
  countdownIntervalRef.current = setInterval(() => {
    setAutoGenerateTimer(prev => {
      if (prev <= 1) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
        setShowErrorModal(false)
        setIsWaitingAutoGenerate(false)
        handlePayment()
        return 0
      }
      return prev - 1
    })
  }, 1000)
}
```

### 4. Adicionar useEffect de Cleanup
```typescript
useEffect(() => {
  return () => {
    // Limpar polling ao desmontar
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    // Limpar countdown ao desmontar
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }
  }
}, [])
```

### 5. Adicionar Função de Fechar Modal
```typescript
const handleClosePaymentModal = () => {
  if (pollIntervalRef.current) {
    clearInterval(pollIntervalRef.current)
    pollIntervalRef.current = null
  }
  setShowPaymentModal(false)
  setPaymentStatus(null)
  setPaymentId(null)
  setPixCopyPaste(null)
  setHasActivePayment(false)
}
```

### 6. Adicionar Função de Fechar Modal de Erro
```typescript
const handleCloseErrorModal = () => {
  if (countdownIntervalRef.current) {
    clearInterval(countdownIntervalRef.current)
    countdownIntervalRef.current = null
  }
  setShowErrorModal(false)
  setIsWaitingAutoGenerate(false)
  setAutoGenerateTimer(0)
}
```

---

## 📊 Tabela de Correções

| Problema | Impacto | Correção | Prioridade |
|----------|---------|----------|------------|
| Polling não limpo | 🔴 Alto | useRef + cleanup | ⚡ Crítica |
| Countdown não limpo | 🔴 Alto | useRef + cleanup | ⚡ Crítica |
| Sem useEffect cleanup | 🔴 Alto | Adicionar useEffect | ⚡ Crítica |
| Fechar modal sem limpar | 🟡 Médio | handleCloseModal | 🔥 Alta |
| Sem try-catch | 🟡 Médio | Adicionar try-catch | 🔥 Alta |
| Múltiplos intervalos | 🟡 Médio | Limpar antes de criar | 🔥 Alta |

---

## 🧪 Testes Necessários Após Correção

| Teste | Descrição | Resultado Esperado |
|-------|-----------|-------------------|
| 1 | Gera QR → Sai da página | ✅ Sem erros no console |
| 2 | Gera QR → Fecha modal (X) | ✅ Polling parado |
| 3 | Paga → Modal erro → Sai | ✅ Countdown parado |
| 4 | Gera múltiplos QRs rápido | ✅ Apenas 1 polling ativo |
| 5 | QR ativo → Recarrega (F5) | ✅ Sem erros |
| 6 | Internet cai durante polling | ✅ Erro tratado |
| 7 | Timer 30min → Sai da página | ✅ Timer parado |
| 8 | Navega entre páginas | ✅ Cleanup executado |

---

## 🎯 Próximos Passos

1. ✅ Identificar todos os problemas
2. ⏳ Implementar correções
3. ⏳ Testar todos os cenários
4. ⏳ Verificar sem erros no console
5. ⏳ Documentar resultados
