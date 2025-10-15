'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Team from '@/components/Team'
import Technology from '@/components/Technology'
import Services from '@/components/Services'
import Reviews from '@/components/Reviews'
import Footer from '@/components/Footer'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-pulse text-2xl text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Team />
      <Technology />
      <Reviews />
      <Footer />
    </main>
  )
}
