'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { InterestManagement } from '@/components/interest-management'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

export default function InterestsPage() {
  const router = useRouter()
  const [adminUsername, setAdminUsername] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const username = localStorage.getItem('adminUsername')

    if (!token) {
      router.push('/')
      return
    }

    setAdminUsername(username || 'Admin')
    setIsLoading(false)
  }, [router])

  const handleSetActiveSection = (section: string) => {
    router.push(`/dashboard/${section}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUsername')
    router.push('/')
  }

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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <MobileHeader activeSection="interests" setActiveSection={handleSetActiveSection} onLogout={handleLogout} />

      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar
          activeSection="interests"
          setActiveSection={handleSetActiveSection}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col w-full pt-16 md:pt-0">
        {/* Top Bar with Logout */}
        <div className="hidden md:flex items-center justify-between p-4 md:p-6 border-b border-border bg-gradient-to-r from-surface to-background">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Welcome back,</p>
            <p className="text-lg font-700 text-foreground">{adminUsername}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-600 text-sm transition-all text-white hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#ef4444' }}
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <InterestManagement />
        </div>
      </main>

    </div>
  )
}
