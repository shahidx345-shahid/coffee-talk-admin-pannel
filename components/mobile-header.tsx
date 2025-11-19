'use client'

import { motion } from 'framer-motion'
import { Menu, X, Users, Coffee, Heart } from 'lucide-react'
import { useState } from 'react'

interface MobileHeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function MobileHeader({ activeSection, setActiveSection }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: 'users', label: 'User management', icon: Users },
    { id: 'shops', label: 'Coffee Shops', icon: Coffee },
    { id: 'interests', label: 'Interests', icon: Heart },
  ]

  return (
    <>
      {/* Mobile Header */}
      <motion.header 
        className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between px-4 py-4">
          {/* Hamburger Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
            whileTap={{ scale: 0.95 }}
            whileHover={{ 
              backgroundColor: 'rgba(250, 146, 51, 0.1)',
              
            }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>

          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <motion.div 
              className="text-2xl"
              animate={{ scale: isOpen ? 1.1 : 1 }}
              whileHover={{ scale: 1.2, color: '#fa9233' }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ☕
            </motion.div>
            <span className="font-semibold text-sm">Coffee Admin</span>
          </div>

          {/* Placeholder for user avatar or other elements */}
          <div className="w-8" />
        </div>
      </motion.header>

      {/* Mobile Sidebar Menu */}
      <motion.div
        className="md:hidden fixed top-16 left-0 right-0 bg-surface border-b border-border z-50 shadow-lg"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0, 
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-500 transition-all ${
                  isActive
                    ? 'bg-[#fa9233] text-white'
                    : 'text-foreground hover:bg-background'
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileTap={{ scale: 0.98 }}
                whileHover={{
                  backgroundColor: isActive ? '#fa9233' : 'rgba(250, 146, 51, 0.1)',
                  border: isActive ? 'none' : '1px solid rgba(250, 146, 51, 0.3)',
                  color: isActive ? 'white' : '#fa9233',
                  scale: 1.02
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </motion.button>
            )
          })}
        </nav>
      </motion.div>

      {/* Backdrop */}
      <motion.div
        className="md:hidden fixed inset-0 bg-black/30 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(false)}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />
    </>
  )
}






