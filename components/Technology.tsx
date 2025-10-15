'use client'

import { Brain, Zap, Database, Shield, Cpu, Network } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const technologies = [
  {
    icon: Brain,
    title: 'Advanced AI Models',
    description: 'Proprietary neural networks trained on billions of encryption patterns'
  },
  {
    icon: Zap,
    title: 'Quantum Computing',
    description: 'Leveraging quantum algorithms for exponential processing speed'
  },
  {
    icon: Database,
    title: 'Distributed Computing',
    description: '10 petabytes of computing power across global data centers'
  },
  {
    icon: Shield,
    title: 'Pattern Recognition',
    description: 'ML models that identify cryptographic vulnerabilities'
  },
  {
    icon: Cpu,
    title: 'GPU Acceleration',
    description: 'Thousands of GPUs working in parallel for maximum efficiency'
  },
  {
    icon: Network,
    title: 'Cloud Infrastructure',
    description: 'Scalable architecture handling millions of requests'
  }
]

export default function Technology() {
  const { t } = useLanguage()
  
  return (
    <section id="technology" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('tech.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('tech.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
            <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('tech.ai.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('tech.ai.desc')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
            <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('tech.quantum.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('tech.quantum.desc')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
            <Database className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('tech.distributed.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('tech.distributed.desc')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
            <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('tech.pattern.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('tech.pattern.desc')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
            <Cpu className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('tech.gpu.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('tech.gpu.desc')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
            <Network className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('tech.cloud.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('tech.cloud.desc')}</p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-blue-800">
          <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('tech.how.title')}
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t('tech.step1.title')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{t('tech.step1.desc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t('tech.step2.title')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{t('tech.step2.desc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t('tech.step3.title')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{t('tech.step3.desc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t('tech.step4.title')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{t('tech.step4.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
