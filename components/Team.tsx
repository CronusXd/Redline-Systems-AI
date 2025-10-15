'use client'

import { Linkedin, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Team() {
  const { t } = useLanguage()
  
  const teamMembers = [
    {
      name: 'Dr. Rajesh Kumar',
      roleKey: 'team.role.cto',
      bioKey: 'team.bio.rajesh',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      linkedin: '#',
      email: 'rajesh.kumar@redlinesystems.ai'
    },
    {
      name: 'Dr. Priya Sharma',
      roleKey: 'team.role.head-ai',
      bioKey: 'team.bio.priya',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      linkedin: '#',
      email: 'priya.sharma@redlinesystems.ai'
    },
    {
      name: 'Vikram Patel',
      roleKey: 'team.role.senior-crypto',
      bioKey: 'team.bio.vikram',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      linkedin: '#',
      email: 'vikram.patel@redlinesystems.ai'
    },
    {
      name: 'Dr. Wei Zhang',
      roleKey: 'team.role.chief-security',
      bioKey: 'team.bio.wei',
      country: 'China',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      linkedin: '#',
      email: 'wei.zhang@redlinesystems.ai'
    },
    {
      name: 'Li Chen',
      roleKey: 'team.role.lead-quantum',
      bioKey: 'team.bio.li',
      country: 'China',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      linkedin: '#',
      email: 'li.chen@redlinesystems.ai'
    }
  ]
  
  return (
    <section id="team" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('team.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-300 text-sm">{t(member.roleKey)}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {t(member.bioKey)}
                </p>
                <div className="flex items-center space-x-4">
                  <a
                    href={member.linkedin}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
