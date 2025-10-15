'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Mail, Facebook, Instagram, Twitter, Linkedin, Send, Music, Video, Youtube } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const services = [
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    icon: MessageCircle, 
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-500',
    available: true 
  },
  { 
    id: 'gmail', 
    name: 'Gmail', 
    icon: Mail, 
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-500',
    available: false 
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: Facebook, 
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-600',
    available: false 
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: Instagram, 
    color: 'from-pink-500 to-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
    available: false 
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: Twitter, 
    color: 'from-sky-400 to-blue-500',
    bgColor: 'bg-sky-500',
    available: false 
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: 'from-blue-600 to-blue-800',
    bgColor: 'bg-blue-700',
    available: false 
  },
  { 
    id: 'telegram', 
    name: 'Telegram', 
    icon: Send, 
    color: 'from-sky-400 to-blue-500',
    bgColor: 'bg-sky-500',
    available: false 
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: Music, 
    color: 'from-black to-gray-900',
    bgColor: 'bg-black',
    available: false 
  },
  { 
    id: 'kwai', 
    name: 'Kwai', 
    icon: Video, 
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-500',
    available: false 
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: Youtube, 
    color: 'from-red-500 to-red-700',
    bgColor: 'bg-red-600',
    available: false 
  },
]

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const { t } = useLanguage()
  const router = useRouter()

  const handleServiceClick = (serviceId: string, available: boolean) => {
    if (!available) return
    
    if (serviceId === 'whatsapp') {
      // Redirecionar para página WhatsApp (mesma aba)
      router.push('/whatsapp')
    } else {
      setSelectedService(serviceId)
    }
  }

  return (
    <section id="services" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon
            const isAvailable = service.available
            
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id, service.available)}
                disabled={!service.available}
                className={`relative p-8 rounded-3xl transition-all duration-300 group ${
                  isAvailable
                    ? `bg-gradient-to-br ${service.color} text-white shadow-2xl hover:shadow-3xl hover:scale-110 hover:-translate-y-2`
                    : 'bg-gray-100 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  isAvailable ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700/30'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    isAvailable ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                </div>
                
                {/* Name */}
                <p className={`font-bold text-lg ${
                  isAvailable ? 'text-white' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {service.name}
                </p>
                
                {/* Status */}
                {!service.available && (
                  <p className="text-xs mt-2 text-gray-400 dark:text-gray-600">
                    {t('services.coming-soon')}
                  </p>
                )}
                
                {/* Available Badge */}
                {isAvailable && (
                  <div className="absolute top-3 right-3">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Service Content */}
        {selectedService && selectedService !== 'whatsapp' && (
          <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-12 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('services.coming-soon')}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                This service is currently under development
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
