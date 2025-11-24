'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  dateAdded: string
}

interface UserDeleteOverlayProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (userId: string) => void
  isLoading?: boolean
}

export function UserDeleteOverlay({ user, isOpen, onClose, onConfirm, isLoading = false }: UserDeleteOverlayProps) {
  if (!user) return null

  const handleConfirm = () => {
    onConfirm(user.id)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="relative p-4 md:p-5 border-b border-border bg-gradient-to-r from-red-50 via-red-50/50 to-surface flex-shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl font-800 text-red-900 truncate tracking-tight">
                    Delete User
                  </h2>
                  <p className="text-sm text-red-700 mt-1 font-400">This action cannot be undone</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1.5 hover:bg-red-100 rounded-lg transition-all flex-shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <X size={18} className="text-red-700" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-4 md:p-5 space-y-4">
              {/* Warning Section */}
              <motion.div 
                className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-700 text-red-900">Warning</p>
                  <p className="text-xs text-red-700 mt-1">Deleting this user will permanently remove all associated data.</p>
                </div>
              </motion.div>

              {/* User Details */}
              <motion.div
                className="space-y-3 p-4 bg-background/50 border border-border rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs font-700 text-muted uppercase tracking-wider">User to delete</p>
                
                {/* Avatar and Name */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-color-blue to-color-accent flex items-center justify-center text-lg flex-shrink-0 shadow-md">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-700 text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs font-600 text-muted uppercase tracking-wider">Date Added</p>
                    <p className="text-xs font-500 text-foreground mt-1">{user.dateAdded}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer with Buttons */}
            <div className="flex gap-3 p-4 md:p-5 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
              <motion.button
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-3 md:px-4 py-2.5 border-2 border-border rounded-lg text-sm md:text-base font-700 text-foreground hover:bg-background hover:border-muted transition-all tracking-tight disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-3 md:px-4 py-2.5 text-white rounded-lg text-sm md:text-base font-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 tracking-tight disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: '#ef4444' }}
              >
                <Trash2 size={16} />
                <span>{isLoading ? 'Deleting...' : 'Delete User'}</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
