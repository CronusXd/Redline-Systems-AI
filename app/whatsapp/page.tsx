'use client'

import { useState, useRef, useEffect } from 'react'
import { Phone, Play, Loader2, CheckCircle, ArrowLeft, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function WhatsAppPage() {
  const { t } = useLanguage()
  const terminalRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isValidNumber, setIsValidNumber] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [terminalLines, setTerminalLines] = useState<Array<{text: string, found?: boolean}>>([])
  const [searchingLines, setSearchingLines] = useState<string[]>([])
  const [recoveredImages, setRecoveredImages] = useState<string[]>([])
  const [recoveredVideos, setRecoveredVideos] = useState<string[]>([])

  // Verificar se o componente está montado
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-scroll para o final do terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines, searchingLines])

  // Evitar problemas de hidratação - mostrar loading
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 dark:text-green-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  // Tempo total entre 60-90 segundos
  const totalDuration = Math.floor(Math.random() * 30000) + 60000 // 60-90s
  
  const phases = [
    { nameKey: 'whatsapp.phase1', duration: totalDuration * 0.15 }, // 15%
    { nameKey: 'whatsapp.phase2', duration: totalDuration * 0.25 }, // 25%
    { nameKey: 'whatsapp.phase3', duration: totalDuration * 0.25 }, // 25%
    { nameKey: 'whatsapp.phase4', duration: totalDuration * 0.20 }, // 20%
    { nameKey: 'whatsapp.phase5', duration: totalDuration * 0.15 }, // 15%
  ]

  const generateRandomHash = () => {
    const chars = '0123456789abcdef'
    let hash = ''
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)]
    }
    return hash
  }

  const generateAssemblyCode = () => {
    const opcodes = ['MOV', 'PUSH', 'POP', 'JMP', 'CALL', 'RET', 'XOR', 'AND', 'OR', 'CMP', 'TEST', 'LEA', 'ADD', 'SUB']
    const registers = ['EAX', 'EBX', 'ECX', 'EDX', 'ESI', 'EDI', 'ESP', 'EBP']
    const opcode = opcodes[Math.floor(Math.random() * opcodes.length)]
    const reg1 = registers[Math.floor(Math.random() * registers.length)]
    const reg2 = registers[Math.floor(Math.random() * registers.length)]
    const addr = '0x' + generateRandomHash().substring(0, 8)
    return `${opcode} ${reg1}, ${reg2} ; ${addr}`
  }

  const generateMemoryDump = () => {
    const addr = generateRandomHash().substring(0, 8)
    const bytes = Array.from({length: 8}, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(' ')
    return `0x${addr}: ${bytes}`
  }

  const validatePhoneNumber = async () => {
    if (!phoneNumber) return

    setIsValidating(true)
    setValidationError('')
    setIsValidNumber(false)

    try {
      // Limpar número (remover espaços, parênteses, hífens)
      let cleanNumber = phoneNumber.replace(/\D/g, '')
      
      // Detectar e adicionar código do país automaticamente se não tiver
      // Brasil: números com 10 ou 11 dígitos (DDD + número)
      if (cleanNumber.length === 10 || cleanNumber.length === 11) {
        // Verificar se começa com DDD válido do Brasil (11-99)
        const ddd = parseInt(cleanNumber.substring(0, 2))
        if (ddd >= 11 && ddd <= 99) {
          cleanNumber = '55' + cleanNumber // Adicionar código do Brasil
        }
      }
      
      // Validação básica de tamanho
      if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        setValidationError(t('whatsapp.error.invalid'))
        setIsValidating(false)
        return
      }

      // Verificar se não é um número repetido (ex: 111111, 222222)
      const isRepeated = /^(\d)\1+$/.test(cleanNumber)
      if (isRepeated) {
        setValidationError(t('whatsapp.error.invalid'))
        setIsValidating(false)
        return
      }

      // Validação de variedade de dígitos (números reais têm variação)
      const digitVariety = new Set(cleanNumber.split('')).size
      if (digitVariety < 5) {
        setValidationError(t('whatsapp.error.invalid'))
        setIsValidating(false)
        return
      }

      // Simular verificação com API do WhatsApp Business
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Validação de padrões por país (com código automático)
      const countryPatterns = [
        // Brasil
        { pattern: /^55[1-9]{2}9[0-9]{8}$/, name: 'Brasil (celular)' },
        { pattern: /^55[1-9]{2}[2-5][0-9]{7}$/, name: 'Brasil (fixo)' },
        // EUA/Canadá
        { pattern: /^1[2-9][0-9]{9}$/, name: 'EUA/Canadá' },
        // Reino Unido
        { pattern: /^44[1-9][0-9]{9}$/, name: 'Reino Unido' },
        // Espanha
        { pattern: /^34[6-9][0-9]{8}$/, name: 'Espanha' },
        // França
        { pattern: /^33[1-9][0-9]{8}$/, name: 'França' },
        // Alemanha
        { pattern: /^49[1-9][0-9]{9,10}$/, name: 'Alemanha' },
        // Itália
        { pattern: /^39[0-9]{9,10}$/, name: 'Itália' },
        // Portugal
        { pattern: /^351[1-9][0-9]{8}$/, name: 'Portugal' },
        // México
        { pattern: /^52[1-9][0-9]{9}$/, name: 'México' },
        // Argentina
        { pattern: /^54[1-9][0-9]{9}$/, name: 'Argentina' },
      ]
      
      const matchedCountry = countryPatterns.find(cp => cp.pattern.test(cleanNumber))
      
      if (!matchedCountry) {
        setValidationError(t('whatsapp.error.notfound'))
        setIsValidating(false)
        return
      }

      // Verificação adicional: números muito sequenciais são suspeitos
      let sequentialCount = 0
      for (let i = 0; i < cleanNumber.length - 2; i++) {
        const a = parseInt(cleanNumber[i])
        const b = parseInt(cleanNumber[i + 1])
        const c = parseInt(cleanNumber[i + 2])
        if (b === a + 1 && c === b + 1) sequentialCount++
      }
      
      if (sequentialCount > 2) {
        setValidationError(t('whatsapp.error.invalid'))
        setIsValidating(false)
        return
      }

      // Número passou em todas as validações
      console.log(`✓ Número validado: ${matchedCountry.name}`)
      setIsValidNumber(true)
      setIsValidating(false)
      
      // Iniciar análise automaticamente após validação
      setTimeout(() => {
        startAnalysis()
      }, 500)
        
    } catch (error) {
      setValidationError(t('whatsapp.error.notfound'))
      setIsValidating(false)
    }
  }

  const generateRecoveredMedia = () => {
    // Gerar 40-60 imagens de pessoas reais (serão exibidas censuradas)
    // Usando apenas fontes que garantem tons de pele visíveis (bege, rosa, marrom)
    const imageCount = Math.floor(Math.random() * 21) + 40 // 40-60 imagens
    const images = Array.from({length: imageCount}, (_, i) => {
      // Usar apenas Random User API que sempre retorna fotos de pessoas com tons de pele visíveis
      const gender = Math.random() > 0.5 ? 'women' : 'men'
      const id = Math.floor(Math.random() * 99)
      return `https://randomuser.me/api/portraits/${gender}/${id}.jpg?${i}`
    })
    
    // Gerar 20-30 vídeos (thumbnails de pessoas, serão exibidos censurados)
    const videoCount = Math.floor(Math.random() * 11) + 20 // 20-30 vídeos
    const videos = Array.from({length: videoCount}, (_, i) => {
      // Usar apenas Random User API que sempre retorna fotos de pessoas com tons de pele visíveis
      const gender = Math.random() > 0.5 ? 'women' : 'men'
      const id = Math.floor(Math.random() * 99)
      return `https://randomuser.me/api/portraits/${gender}/${id}.jpg?${1000 + i}`
    })
    
    setRecoveredImages(images)
    setRecoveredVideos(videos)
  }

  const generateTerminalLine = (phase: number) => {
    const hash = generateRandomHash().substring(0, 16)
    const speed = Math.floor(Math.random() * 9000000 + 1000000)
    const qubits = Math.floor(Math.random() * 50 + 10)
    const vulnAddr = generateRandomHash().substring(0, 8)
    const convs = Math.floor(Math.random() * 100 + 50)
    const media = Math.floor(Math.random() * 200 + 100)

    const lines = [
      // Phase 1 - Conexão
      [
        generateAssemblyCode(),
        generateMemoryDump(),
        `[${t('whatsapp.terminal.init')}] ${t('whatsapp.terminal.connecting')}`,
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.ok')}] ${t('whatsapp.terminal.connected')}`,
        generateMemoryDump()
      ],
      // Phase 2 - Quebra
      [
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.scan')}] ${t('whatsapp.terminal.mapping')} E2E: ${hash}...`,
        generateMemoryDump(),
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.decrypt')}] ${t('whatsapp.terminal.breaking')} RSA-2048...`,
        generateMemoryDump(),
        `[${t('whatsapp.terminal.crack')}] ${t('whatsapp.terminal.testing')} ${speed.toLocaleString()} ${t('whatsapp.terminal.combinations')}`,
        generateAssemblyCode()
      ],
      // Phase 3 - IA
      [
        generateMemoryDump(),
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.ai')}] ${t('whatsapp.terminal.analyzing')}`,
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.quantum')}] ${t('whatsapp.terminal.processing')} ${qubits}M qubits`,
        generateMemoryDump(),
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.break')}] ${t('whatsapp.terminal.vulnerability')}: 0x${vulnAddr}`,
        generateMemoryDump()
      ],
      // Phase 4 - Extração
      [
        generateAssemblyCode(),
        generateMemoryDump(),
        `[${t('whatsapp.terminal.access')}] ${t('whatsapp.terminal.decrypting')}`,
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.extract')}] ${t('whatsapp.terminal.recovering')} ${convs} ${t('whatsapp.terminal.conversations')}`,
        generateMemoryDump(),
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.media')}] ${t('whatsapp.terminal.extracting')} ${media} ${t('whatsapp.terminal.files')}`,
        generateMemoryDump()
      ],
      // Phase 5 - Finalização
      [
        generateAssemblyCode(),
        generateMemoryDump(),
        `[${t('whatsapp.terminal.final')}] ${t('whatsapp.terminal.compiling')}`,
        generateAssemblyCode(),
        generateMemoryDump(),
        `[${t('whatsapp.terminal.success')}] ${t('whatsapp.terminal.totalaccess')}`,
        generateAssemblyCode(),
        `[${t('whatsapp.terminal.complete')}] ${t('whatsapp.terminal.successrate')}: 99.9%`,
        generateMemoryDump()
      ]
    ]
    return lines[phase] || []
  }

  const startAnalysis = async () => {
    if (!phoneNumber || !isValidNumber) return

    setIsAnalyzing(true)
    setProgress(0)
    setCurrentPhase(0)
    setShowResults(false)
    setTerminalLines([])
    setSearchingLines([])
    
    // Gerar mídias recuperadas
    generateRecoveredMedia()

    const phaseDurations = phases.map(p => p.duration)
    const totalTime = phaseDurations.reduce((sum, d) => sum + d, 0)
    
    // Interval para atualizar progresso continuamente (1%, 2%, 3%...)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return Math.min(prev + 1, 100)
      })
    }, totalTime / 100) // Divide o tempo total por 100 para incrementar 1% por vez

    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(i)
      const phaseDuration = phaseDurations[i]
      const phaseLines = generateTerminalLine(i)
      
      // Interval para códigos alternando (simulando busca)
      const searchInterval = setInterval(() => {
        setSearchingLines([
          generateAssemblyCode(),
          generateMemoryDump(),
          generateAssemblyCode()
        ])
      }, 100) // Alterna a cada 100ms

      // Adicionar linhas da fase gradualmente
      for (let j = 0; j < phaseLines.length; j++) {
        const line = phaseLines[j]
        const isLastLine = j === phaseLines.length - 1
        const lineDelay = phaseDuration / phaseLines.length
        
        await new Promise(resolve => setTimeout(resolve, lineDelay))
        
        // Se for a última linha, marcar como "encontrada" com check
        if (isLastLine && (line.includes('[OK]') || line.includes('[SUCCESS]') || line.includes('[BREAK]') || line.includes('[COMPLETE]'))) {
          setTerminalLines(prev => [...prev, { text: line, found: true }])
        } else {
          setTerminalLines(prev => [...prev, { text: line, found: false }])
        }
      }

      clearInterval(searchInterval)
      setSearchingLines([])
    }

    // Garantir que chegue a 100%
    clearInterval(progressInterval)
    setProgress(100)
    
    // Pequeno delay antes de mostrar resultados
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsAnalyzing(false)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>{t('whatsapp.back')}</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Redline Systems AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {!isAnalyzing && !showResults && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('whatsapp.title')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {t('whatsapp.description')}
                </p>
              </div>

              {/* Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  {t('whatsapp.phone-label')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      setValidationError('')
                    }}
                    placeholder={t('whatsapp.phone-placeholder')}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  />
                </div>
                {validationError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {validationError}
                  </p>
                )}
              </div>

              <button
                onClick={validatePhoneNumber}
                disabled={!phoneNumber || isValidating}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>{t('whatsapp.validating')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    <span>{t('whatsapp.start')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}



        {isAnalyzing && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                {t('whatsapp.analyzing')}
              </h2>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t(phases[currentPhase].nameKey)}
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Terminal Console */}
              <div 
                ref={terminalRef}
                className="mb-8 bg-black rounded-xl p-6 font-mono text-sm h-96 overflow-y-auto scroll-smooth"
              >
                {/* Linhas fixas (já encontradas) */}
                {terminalLines.map((line, index) => (
                  <div key={index} className={`mb-1 flex items-center gap-2 ${line.found ? 'text-green-400' : 'text-green-400'}`}>
                    {line.found && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    <span className="text-gray-500">{`>`}</span>
                    <span>{line.text}</span>
                  </div>
                ))}
                
                {/* Linhas alternando (simulando busca) */}
                {searchingLines.map((line, index) => (
                  <div key={`search-${index}`} className="mb-1 text-gray-500 opacity-50">
                    <span className="text-gray-600">{`>`}</span> {line}
                  </div>
                ))}
                
                {/* Cursor */}
                <div className="text-green-400">
                  <span className="text-gray-500">{`>`}</span> <span className="animate-pulse">_</span>
                </div>
              </div>

              {/* Phase Indicator */}
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      index === currentPhase
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : index < currentPhase
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {index < currentPhase ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : index === currentPhase ? (
                        <Loader2 className="w-6 h-6 text-green-600 dark:text-green-400 animate-spin" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      )}
                      <span className={`font-medium ${
                        index <= currentPhase ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {t(phase.nameKey)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showResults && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                {t('whatsapp.complete')}
              </h2>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{t('whatsapp.conversations')}</h4>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{Math.floor(Math.random() * 50) + 30}</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{t('whatsapp.images')}</h4>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{recoveredImages.length}</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                  <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{t('whatsapp.videos')}</h4>
                  <p className="text-4xl font-bold text-pink-600 dark:text-pink-400">{recoveredVideos.length}</p>
                </div>
              </div>

              {/* Galeria de Imagens Recuperadas */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">📷</span>
                  {t('whatsapp.images')} ({recoveredImages.length})
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
                  {recoveredImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer bg-gray-700">
                      <img 
                        src={img} 
                        alt={`Recovered ${i+1}`}
                        className="w-full h-full object-cover"
                        style={{ 
                          filter: 'blur(12px) brightness(1)',
                          transform: 'scale(1.05)'
                        }}
                        loading="lazy"
                      />
                      {/* Ícone de olho cortado no centro */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg 
                          className="w-6 h-6 text-white/80 drop-shadow-lg" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2.5} 
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Galeria de Vídeos Recuperados */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-pink-600 dark:text-pink-400">🎬</span>
                  {t('whatsapp.videos')} ({recoveredVideos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {recoveredVideos.map((video, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden relative group cursor-pointer bg-gray-700">
                      <img 
                        src={video} 
                        alt={`Video ${i+1}`}
                        className="w-full h-full object-cover"
                        style={{ 
                          filter: 'blur(12px) brightness(1)',
                          transform: 'scale(1.05)'
                        }}
                        loading="lazy"
                      />
                      {/* Ícone de olho cortado no centro */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg 
                          className="w-8 h-8 text-white/80 drop-shadow-lg" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2.5} 
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                          />
                        </svg>
                      </div>
                      {/* Ícone de play no canto inferior esquerdo */}
                      <div className="absolute bottom-2 left-2">
                        <div className="bg-black/60 rounded-sm p-1.5 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      {/* Duração do vídeo no canto inferior direito */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-sm">
                        {Math.floor(Math.random() * 300) + 30}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Download */}
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl mb-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h4 className="font-bold text-2xl mb-2 text-gray-900 dark:text-white">
                    {t('whatsapp.download.title')}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {t('whatsapp.download.description')}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    // Simular download
                    const link = document.createElement('a')
                    link.href = '#'
                    link.download = `whatsapp_recovery_${phoneNumber}.zip`
                    link.click()
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{t('whatsapp.download.button')}</span>
                </button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  {t('whatsapp.download.size')}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowResults(false)
                    setPhoneNumber('')
                    setProgress(0)
                  }}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('whatsapp.new-analysis')}
                </button>
                <Link
                  href="/"
                  className="flex-1 py-4 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-center"
                >
                  {t('whatsapp.back')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
