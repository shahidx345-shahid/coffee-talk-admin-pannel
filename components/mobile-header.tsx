'use client'

import { Menu, X, Users, Coffee, Heart, LogOut, Calendar } from 'lucide-react'
import { useState } from 'react'

interface MobileHeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  onLogout?: () => void
}

export function MobileHeader({ activeSection, setActiveSection, onLogout }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const navItems = [
    { id: 'users', label: 'User management', icon: Users },
    { id: 'shops', label: 'Coffee Shops', icon: Coffee },
    { id: 'interests', label: 'Interests', icon: Heart },
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
        className="md:hidden fixed top-16 left-0 right-0 bg-surface border-b border-border z-50 shadow-lg transition-all"
        style={{ 
          display: isOpen ? 'block' : 'none',
          opacity: isOpen ? 1 : 0,
          transitionDuration: '300ms',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item.id)
                  setActiveSection(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-500 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#fa9233] text-white'
                    : 'text-foreground hover:bg-background'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
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






