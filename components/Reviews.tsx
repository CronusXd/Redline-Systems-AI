'use client'

import { Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Reviews() {
  const { t } = useLanguage()

  const reviews = [
    {
      id: 1,
      nameKey: 'reviews.user1.name',
      textKey: 'reviews.user1.text',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      service: 'WhatsApp'
    },
    {
      id: 2,
      nameKey: 'reviews.user2.name',
      textKey: 'reviews.user2.text',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      service: 'WhatsApp'
    },
    {
      id: 3,
      nameKey: 'reviews.user3.name',
      textKey: 'reviews.user3.text',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      service: 'WhatsApp'
    },
    {
      id: 4,
      nameKey: 'reviews.user4.name',
      textKey: 'reviews.user4.text',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      service: 'Gmail'
    },
    {
      id: 5,
      nameKey: 'reviews.user5.name',
      textKey: 'reviews.user5.text',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      service: 'Instagram'
    },
    {
      id: 6,
      nameKey: 'reviews.user6.name',
      textKey: 'reviews.user6.text',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      service: 'Facebook'
    },
    {
      id: 7,
      nameKey: 'reviews.user7.name',
      textKey: 'reviews.user7.text',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      service: 'WhatsApp'
    },
    {
      id: 8,
      nameKey: 'reviews.user8.name',
      textKey: 'reviews.user8.text',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
      service: 'Telegram'
    },
    {
      id: 9,
      nameKey: 'reviews.user9.name',
      textKey: 'reviews.user9.text',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
      service: 'WhatsApp'
    }
  ]

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('reviews.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={review.image}
                  alt={t(review.nameKey)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t(review.nameKey)}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{review.service}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(review.textKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
