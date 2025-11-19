'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { UserManagement } from '@/components/user-management'
import { CoffeeShops } from '@/components/coffee-shops'
import { InterestManagement } from '@/components/interest-management'

export default function Home() {
  const [activeSection, setActiveSection] = useState('users')

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <MobileHeader activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>

      {/* Main content - adjusted for mobile header */}
      <main className="flex-1 overflow-hidden flex flex-col w-full pt-16 md:pt-0">
        <div className="flex-1 overflow-auto">
          {activeSection === 'users' && <UserManagement />}
          {activeSection === 'shops' && <CoffeeShops />}
          {activeSection === 'interests' && <InterestManagement />}
        </div>
      </main>
    </div>
  )
}
