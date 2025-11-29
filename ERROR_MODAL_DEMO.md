# 🎨 Demonstração Visual dos Modais de Erro

## Modal 1: Primeiro Pagamento (Retry Imediato)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                    ⭕ ❌                           │
│              (Ícone de Erro Vermelho)              │
│                                                    │
│         Erro de Processamento                      │
│         ═══════════════════════                    │
│                                                    │
│   Houve um problema ao processar seu pagamento.   │
│         Gerando novo código...                     │
│                                                    │
│                                                    │
│                    🔄                              │
│              (Loader Azul Girando)                 │
│                                                    │
│            Gerando novo código...                  │
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘

Comportamento:
- Exibido por 3 segundos
- Loader animado girando
- Fecha automaticamente
- Gera novo QR code automaticamente
```

---

## Modal 2: Segundo+ Pagamentos (Timer 30 Minutos)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                    ⭕ ❌                           │
│              (Ícone de Erro Vermelho)              │
│                                                    │
│            Erro com Seu Banco                      │
│            ═══════════════════                     │
│                                                    │
│  Seu banco está bloqueando a transação.           │
│    Aguarde enquanto tentamos novamente.            │
│                                                    │
│                                                    │
│   Novo código será gerado automaticamente em:      │
│                                                    │
│   ┌──────────────────────────────────────┐        │
│   │                                      │        │
│   │            29:47                     │        │
│   │        (Timer Azul Grande)           │        │
│   │                                      │        │
│   └──────────────────────────────────────┘        │
│                                                    │
│              🔄 Aguardando...                      │
│           (Loader Pequeno Girando)                 │
│                                                    │
└────────────────────────────────────────────────────┘

Comportamento:
- Timer decrementa: 30:00 → 29:59 → ... → 00:00
- Quando chega a 00:00:
  - Modal fecha automaticamente
  - Gera novo QR code automaticamente
  - Abre modal de pagamento com novo QR
```

---

## Características Visuais

### Cores
- **Fundo Modal:** Cinza escuro (#1F2937)
- **Ícone de Erro:** Vermelho (#EF4444)
- **Título:** Branco (#FFFFFF)
- **Texto:** Cinza claro (#9CA3AF)
- **Timer:** Azul (#3B82F6)
- **Fundo Timer:** Azul claro transparente
- **Loader:** Azul (#3B82F6)

### Animações
- **Loader:** Rotação contínua
- **Modal:** Fade-in + Zoom-in ao abrir
- **Timer:** Atualização a cada segundo

### Layout
- **Centralizado** na tela
- **Backdrop:** Preto semi-transparente com blur
- **Bordas:** Arredondadas (rounded-2xl)
- **Sombra:** Shadow-2xl
- **Padding:** 2rem (p-8)
- **Max-width:** 28rem (max-w-md)

---

## Diferenças Entre os Modais

| Característica | 1º Pagamento | 2º+ Pagamentos |
|----------------|--------------|----------------|
| **Título** | "Erro de Processamento" | "Erro com Seu Banco" |
| **Mensagem** | "Gerando novo código..." | "Aguarde enquanto tentamos novamente." |
| **Timer** | ❌ Não exibe | ✅ Exibe (30:00) |
| **Loader** | ✅ Grande (w-12 h-12) | ✅ Pequeno (w-4 h-4) |
| **Duração** | 3 segundos | 30 minutos |
| **Contador** | ❌ Oculto | ❌ Oculto |

---

## Fluxo de Transição

### 1º Pagamento
```
Modal de Pagamento (QR Code)
         ↓
Usuário paga
         ↓
Polling detecta "completed"
         ↓
Modal de Pagamento FECHA
         ↓
Modal de Erro ABRE (3s)
         ↓
Loader girando...
         ↓
Modal de Erro FECHA
         ↓
handlePayment() executado
         ↓
Modal de Pagamento ABRE (novo QR)
```

### 2º+ Pagamentos
```
Modal de Pagamento (QR Code)
         ↓
Usuário paga
         ↓
Polling detecta "completed"
         ↓
Modal de Pagamento FECHA
         ↓
Modal de Erro ABRE (30min)
         ↓
Timer: 30:00 → 29:59 → ... → 00:01 → 00:00
         ↓
Modal de Erro FECHA
         ↓
handlePayment() executado
         ↓
Modal de Pagamento ABRE (novo QR)
```

---

## Código CSS Aplicado

```css
/* Modal Container */
.modal-container {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

/* Modal Content */
.modal-content {
  background: rgb(31, 41, 55);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 28rem;
  width: 100%;
  padding: 2rem;
  animation: fadeInZoom 200ms;
}

/* Error Icon */
.error-icon {
  width: 5rem;
  height: 5rem;
  color: #EF4444;
}

/* Timer Box */
.timer-box {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* Timer Text */
.timer-text {
  font-size: 3rem;
  font-family: monospace;
  font-weight: bold;
  color: #3B82F6;
}

/* Animations */
@keyframes fadeInZoom {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

## ✅ Resumo Visual

**Modal 1 (1º Pagamento):**
- ❌ Ícone de erro vermelho grande
- 📝 "Erro de Processamento"
- 🔄 Loader azul girando
- ⏱️ Duração: 3 segundos
- 🎯 Ação: Gera novo QR automaticamente

**Modal 2 (2º+ Pagamentos):**
- ❌ Ícone de erro vermelho grande
- 📝 "Erro com Seu Banco"
- ⏱️ Timer: 30:00 (azul, grande, monospace)
- 🔄 Loader pequeno girando
- ⏱️ Duração: 30 minutos
- 🎯 Ação: Gera novo QR automaticamente

**Sem Contador de Tentativas:** ✅ Confirmado - Não exibido em nenhum modal
