'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Users, Coffee, Heart } from 'lucide-react'

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
  ]

  const MenuItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon
    return (
      <button
        onClick={() => {
          setActiveSection(item.id)
          onClose?.()
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-500 transition-all cursor-pointer ${
          isActive
            ? 'text-white'
            : 'text-muted hover:bg-surface'
        }`}
        style={isActive ? { backgroundColor: '#fa9233' } : {}}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <motion.aside 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-64 bg-background border-r border-border h-screen overflow-y-auto flex flex-col"
    >
      {/* Header with smooth gradient */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-4 md:p-6 border-b border-border"
      >
        <div className="flex items-center gap-3 px-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: '#03a3ec' }}
          >
            ☕
          </motion.div>
          <div>
            <motion.div 
              className="font-semibold text-sm"
            >
              Coffee Admin
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* General Section */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-1"
        >
          <motion.div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
            MANAGEMENT
          </motion.div>
          <div className="space-y-1">
            {generalItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <MenuItem item={item} isActive={activeSection === item.id} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Management Section */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-1"
        >
          <motion.div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">
            CATALOG
          </motion.div>
          <div className="space-y-1">
            {coffeeItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <MenuItem item={item} isActive={activeSection === item.id} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer divider */}
      <motion.div 
        className="border-t border-border p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
      </motion.div>
    </motion.aside>
  )
}
