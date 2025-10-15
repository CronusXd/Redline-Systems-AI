'use client'

import { useState } from 'react'
import { Phone, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function WhatsAppService() {
  const { t } = useLanguage()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const phases = [
    { nameKey: 'whatsapp.phase1', duration: 8000 },
    { nameKey: 'whatsapp.phase2', duration: 12000 },
    { nameKey: 'whatsapp.phase3', duration: 10000 },
    { nameKey: 'whatsapp.phase4', duration: 9000 },
    { nameKey: 'whatsapp.phase5', duration: 7000 },
  ]

  const startAnalysis = async () => {
    if (!phoneNumber) return

    setIsAnalyzing(true)
    setProgress(0)
    setCurrentPhase(0)
    setShowResults(false)

    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0)
    let elapsed = 0

    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(i)
      const phaseDuration = phases[i].duration
      const startTime = Date.now()

      await new Promise((resolve) => {
        const interval = setInterval(() => {
          const phaseElapsed = Date.now() - startTime
          elapsed += 100
          const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
          setProgress(newProgress)

          if (phaseElapsed >= phaseDuration) {
            clearInterval(interval)
            resolve(null)
          }
        }, 100)
      })
    }

    setIsAnalyzing(false)
    setShowResults(true)
  }

  return (
    <div className="p-8">
      {!isAnalyzing && !showResults && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('whatsapp.title')}
          </h3>
          
          {/* User Comments */}
          <div className="mb-8 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('whatsapp.reviews')}</h4>
            {[
              { name: 'Carlos M.', rating: 5, text: 'Worked perfectly! Amazing technology!' },
              { name: 'Ana Paula', rating: 5, text: 'Very professional service. Highly recommend!' },
              { name: 'Roberto Silva', rating: 4, text: 'Impressive AI technology. Recovered old photos.' },
            ].map((review, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{review.name}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{review.text}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              {t('whatsapp.phone-label')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('whatsapp.phone-placeholder')}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={startAnalysis}
            disabled={!phoneNumber}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>{t('whatsapp.start')}</span>
          </button>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {t('whatsapp.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {t('whatsapp.analyzing')}
          </h3>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(phases[currentPhase].nameKey)}
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  index === currentPhase
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : index < currentPhase
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {index < currentPhase ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : index === currentPhase ? (
                    <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
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
      )}

      {showResults && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {t('whatsapp.complete')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{t('whatsapp.conversations')}</h4>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.floor(Math.random() * 50) + 30}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 blur-sm">{t('whatsapp.privacy')}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{t('whatsapp.images')}</h4>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Math.floor(Math.random() * 100) + 50}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 blur-sm">{t('whatsapp.privacy')}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border border-pink-200 dark:border-pink-800">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{t('whatsapp.videos')}</h4>
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{Math.floor(Math.random() * 30) + 10}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 blur-sm">{t('whatsapp.privacy')}</p>
            </div>
          </div>

          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-6">
            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t('whatsapp.notice.title')}</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('whatsapp.notice.text1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t('whatsapp.notice.text2')}
            </p>
          </div>

          <button
            onClick={() => {
              setShowResults(false)
              setPhoneNumber('')
              setProgress(0)
            }}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
          >
            {t('whatsapp.new-analysis')}
          </button>
        </div>
      )}
    </div>
  )
}
