'use client'

import { Shield, Cpu, Lock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  
  return (
    <section id="home" className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">99.9%</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('hero.stat1')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
              <Cpu className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10 PB</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('hero.stat2')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-800">
              <Lock className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">256-bit</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('hero.stat3')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
