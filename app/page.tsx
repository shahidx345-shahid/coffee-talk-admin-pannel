'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginPage } from '@/components/login-page'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')

    if (token) {
      setIsAuthenticated(true)
      // Redirect to dashboard/users
      router.push('/dashboard/users')
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-border border-t-blue rounded-full"
        />
      </div>
    )
  }

  // If authenticated, show loading (will redirect)
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-border border-t-blue rounded-full"
        />
      </div>
    )
  }

  // Not authenticated, show login
  return <LoginPage />
}
