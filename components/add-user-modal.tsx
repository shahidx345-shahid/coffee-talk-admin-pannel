'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (user: any) => void
}

export function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({ name: '', email: '', password: '' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div 
              className="bg-background rounded-lg border border-border p-4 sm:p-6 shadow-xl w-full max-w-sm max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-foreground pr-2">Add New User</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-surface rounded-lg transition flex-shrink-0 text-muted hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </motion.button>
              </div>
            
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="Enter password"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2.5 text-white rounded-lg font-600 text-xs sm:text-sm hover:opacity-90 transition-colors cursor-pointer"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    Add User
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg font-600 text-xs sm:text-sm hover:bg-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
