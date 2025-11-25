'use client'

import { Menu, X, Users, Coffee, Heart, LogOut, Calendar, Star } from 'lucide-react'
import { useState } from 'react'

interface MobileHeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  onLogout?: () => void
}

export function MobileHeader({ activeSection, setActiveSection, onLogout }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const generalItems = [
    { id: 'users', label: 'User management', icon: Users },
  ]

  const coffeeItems = [
    { id: 'shops', label: 'Coffee Shops', icon: Coffee },
    { id: 'interests', label: 'Interests', icon: Heart },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ]

  const eventItems = [
    { id: 'events', label: 'Events', icon: Calendar },
  ]

  const handleLogout = () => {
    setIsOpen(false)
    onLogout?.()
  }

  return (
    <>
      {/* Mobile Header */}
      <header 
        className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50"
      >
        <div className="flex items-center justify-between px-4 py-4">
          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-surface transition-colors cursor-pointer"
            style={{ 
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transitionDuration: '300ms'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ 
                backgroundColor: '#03a3ec'
              }}
            >
              ☕
            </div>
            <span className="font-semibold text-sm">Coffee Admin</span>
          </div>

          {/* Logout Button - Mobile Right */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-surface transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut size={20} style={{ color: '#ef4444' }} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className="md:hidden fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border z-50 shadow-xl transition-all overflow-y-auto"
        style={{ 
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transitionDuration: '300ms'
        }}
      >
        <nav className="flex flex-col p-4 space-y-6">
          {/* General Section */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
              MANAGEMENT
            </div>
            <div className="space-y-1">
              {generalItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-500 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#fa9233] text-white'
                        : 'text-foreground hover:bg-surface'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Catalog Section */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
              CATALOG
            </div>
            <div className="space-y-1">
              {coffeeItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-500 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#fa9233] text-white'
                        : 'text-foreground hover:bg-surface'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Events Section */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
              EVENTS
            </div>
            <div className="space-y-1">
              {eventItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-500 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#fa9233] text-white'
                        : 'text-foreground hover:bg-surface'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/30 z-30 transition-all"
        onClick={() => setIsOpen(false)}
        style={{ 
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transitionDuration: '300ms'
        }}
      />
    </>
  )
}






