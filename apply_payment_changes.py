"""
Script para aplicar mudanças no WhatsApp Page de forma segura
Adiciona: timer de 20min, verificação de QR ativo, salvamento no Supabase
"""

import re

# Ler o arquivo
with open('app/whatsapp/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Adicionar novos imports (após os imports existentes, antes de export default)
import_addition = """import { X, Copy, Lock } from 'lucide-react'
"""

# Encontrar a linha com export default e adicionar imports antes
content = content.replace(
    "import { Phone, Play, Loader2, CheckCircle, ArrowLeft, Shield } from 'lucide-react'",
    "import { Phone, Play, Loader2, CheckCircle, ArrowLeft, Shield, X, Copy, Lock } from 'lucide-react'"
)

# 2. Adicionar novos estados (após const [isCheckingPayment...)
state_addition = """  const [timeRemaining, setTimeRemaining] = useState<number>(1200) // 20 minutes in seconds
  const [hasActivePayment, setHasActivePayment] = useState(false)
"""

# Encontrar e adicionar após isCheckingPayment
content = re.sub(
    r"(const \[isCheckingPayment, setIsCheckingPayment\] = useState\(false\))",
    r"\1\n" + state_addition,
    content,
    count=1
)

# 3. Substituir handlePayment completo
old_handle_payment = r"const handlePayment = async \(\) => \{[^}]+\}"

new_handle_payment = """const handlePayment = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/whatsapp')
      return
    }

    try {
      setIsCheckingPayment(true)

      // Verificar se já existe um pagamento ativo
      const { getActivePayment } = await import('@/app/actions/active-payment')
      const activePaymentResult = await getActivePayment(user.id, phoneNumber)

      if (activePaymentResult.hasActivePayment && activePaymentResult.qrCode) {
        // Já existe um QR code ativo, mostrar ele
        setPaymentId(activePaymentResult.paymentId || null)
        setPixCopyPaste(activePaymentResult.qrCode)
        setPaymentStatus('pending')
        setTimeRemaining(activePaymentResult.timeRemaining || 1200)
        setHasActivePayment(true)
        setShowPaymentModal(true)
        setIsCheckingPayment(false)

        // Start polling for existing payment
        startPaymentPolling(activePaymentResult.paymentId!)
        return
      }

      // Não há pagamento ativo, criar novo
      const { createPixPayment } = await import('@/app/actions/pixgo')
      const { saveQRCode } = await import('@/app/actions/active-payment')
      
      const result = await createPixPayment(
        10.00,
        user.user_metadata?.full_name || user.email?.split('@')[0],
        user.email
      )

      if (result.success && result.payment_id && result.qr_code) {
        // Salvar no Supabase
        await saveQRCode(user.id, result.payment_id, phoneNumber, result.qr_code, 10.00)

        setPaymentId(result.payment_id)
        setPixCopyPaste(result.qr_code)
        setPaymentStatus('pending')
        setTimeRemaining(1200) // 20 minutes
        setHasActivePayment(true)
        setShowPaymentModal(true)
        setIsCheckingPayment(false)

        // Start polling
        startPaymentPolling(result.payment_id)
      } else {
        alert('Erro ao gerar pagamento: ' + (result.error || 'Tente novamente.'))
        setShowPaymentModal(false)
        setIsCheckingPayment(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Erro ao processar pagamento.')
      setShowPaymentModal(false)
      setIsCheckingPayment(false)
    }
  }"""

# Usar regex mais específico para encontrar handlePayment
pattern = r'const handlePayment = async \(\) => \{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}'
content = re.sub(pattern, new_handle_payment, content, flags=re.DOTALL)

print("✅ Mudanças aplicadas com sucesso!")
print("📝 Salvando arquivo...")

# Salvar arquivo
with open('app/whatsapp/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Arquivo salvo!")
