'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Calendar, Clock, Edit2, Save } from 'lucide-react'
import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  lastActive: string
  dateAdded: string
}

interface UserOverlayProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (user: User) => void
}

export function UserOverlay({ user, isOpen, onClose, onEdit }: UserOverlayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<User | null>(null)

  if (!user) return null

  const displayUser = editData || user

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(user)
  }

  const handleSave = () => {
    if (editData && onEdit) {
      onEdit(editData)
      setIsEditing(false)
      setEditData(null)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(null)
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
            <div className="relative p-4 md:p-5 border-b border-border bg-gradient-to-r from-surface via-background to-surface flex-shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl font-800 text-foreground truncate tracking-tight">
                    {isEditing ? 'Edit Profile' : 'User Profile'}
                  </h2>
                  <p className="text-sm text-muted mt-1 font-400">Manage user account details</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-background rounded-lg transition-all flex-shrink-0"
                >
                  <X size={18} className="text-muted" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-3 md:p-4 space-y-4">
              {/* Avatar and Name Section */}
              <motion.div 
                className="flex flex-col items-center gap-4 pb-4 border-b border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-color-blue to-color-accent flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                  {displayUser.avatar}
                </div>
                <div className="w-full text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData?.name || ''}
                      onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                      className="w-full text-lg font-800 bg-background border-2 border-blue/30 rounded-lg px-3 py-2 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all text-center tracking-tight"
                      placeholder="Enter name"
                    />
                  ) : (
                    <h3 className="text-xl font-800 text-foreground tracking-tight">{displayUser.name}</h3>
                  )}
                  <p className="text-sm text-muted font-500 mt-1">Account Holder</p>
                </div>
              </motion.div>

              {/* Info Grid - Compact */}
              <div className="grid grid-cols-1 gap-4">
                {/* Email */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue flex-shrink-0" />
                    <label className="text-sm font-700 text-muted uppercase tracking-wider">Email</label>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData?.email || ''}
                      onChange={(e) => setEditData({ ...editData!, email: e.target.value })}
                      className="w-full text-sm bg-background border-2 border-border rounded-lg px-3 py-2 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all font-500"
                      placeholder="Enter email"
                    />
                  ) : (
                    <p className="text-sm text-foreground font-500 bg-background/50 p-2.5 rounded-lg break-all">{displayUser.email}</p>
                  )}
                </motion.div>

                {/* Last Active */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue flex-shrink-0" />
                    <label className="text-sm font-700 text-muted uppercase tracking-wider">Last Active</label>
                  </div>
                  <p className="text-sm text-foreground font-500 bg-background/50 p-2.5 rounded-lg">{displayUser.lastActive}</p>
                </motion.div>

                {/* Date Added */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue flex-shrink-0" />
                    <label className="text-sm font-700 text-muted uppercase tracking-wider">Date Added</label>
                  </div>
                  <p className="text-sm text-foreground font-500 bg-background/50 p-2.5 rounded-lg">{displayUser.dateAdded}</p>
                </motion.div>
              </div>
            </div>

            {/* Footer with Buttons */}
            <div className="flex gap-3 p-4 md:p-5 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-3 md:px-4 py-2.5 border-2 border-border rounded-lg text-sm md:text-base font-700 text-foreground hover:bg-background hover:border-muted transition-all tracking-tight"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-3 md:px-4 py-2.5 text-white rounded-lg text-sm md:text-base font-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 tracking-tight"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-3 md:px-4 py-2.5 border-2 border-border rounded-lg text-sm md:text-base font-700 text-foreground hover:bg-background hover:border-muted transition-all tracking-tight"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    className="flex-1 px-3 md:px-4 py-2.5 text-white rounded-lg text-sm md:text-base font-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 tracking-tight"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
