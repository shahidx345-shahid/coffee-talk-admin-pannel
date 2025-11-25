'use client'

import { Users, Coffee, Heart, Calendar, Star } from 'lucide-react'

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ activeSection, setActiveSection, isOpen = true, onClose }: SidebarProps) {
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

  const MenuItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon
    return (
      <button
        onClick={() => {
          setActiveSection(item.id)
          onClose?.()
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-500 transition-all cursor-pointer ${isActive
            ? 'text-white'
            : 'text-muted hover:bg-surface'
          }`}
        style={isActive ? { backgroundColor: '#fa9233' } : {}}
        type="button"
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <aside className="w-64 bg-background border-r border-border h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3 px-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: '#03a3ec' }}
          >
            ☕
          </div>
          <div>
            <div className="font-semibold text-sm">
              Coffee Admin
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* General Section */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
            MANAGEMENT
          </div>
          <div className="space-y-1">
            {generalItems.map((item) => (
              <div key={item.id}>
                <MenuItem item={item} isActive={activeSection === item.id} />
              </div>
            ))}
          </div>
        </div>

        {/* Catalog Section */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
            CATALOG
          </div>
          <div className="space-y-1">
            {coffeeItems.map((item) => (
              <div key={item.id}>
                <MenuItem item={item} isActive={activeSection === item.id} />
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
            EVENTS
          </div>
          <div className="space-y-1">
            {eventItems.map((item) => (
              <div key={item.id}>
                <MenuItem item={item} isActive={activeSection === item.id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer divider */}
      <div className="border-t border-border p-4 md:p-6">
      </div>
    </aside>
  )
}
