'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Calendar, Edit2, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { type User } from '@/lib/firebase-service'

interface UserOverlayProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (user: User) => void
  viewOnly?: boolean
}

export function UserOverlay({ user, isOpen, onClose, onEdit, viewOnly = false }: UserOverlayProps) {
  const [isEditing, setIsEditing] = useState(!viewOnly)  // Only edit mode if NOT viewOnly
  const [editData, setEditData] = useState<User | null>(null)

  useEffect(() => {
    if (isOpen && user) {
      setEditData(user)
      setIsEditing(!viewOnly)  // Respect viewOnly prop
    }
  }, [isOpen, user, viewOnly])

  if (!user) return null

  const displayUser = editData || user

  const handleSave = async () => {
    if (editData && onEdit) {
      // Map display fields back to model fields
      const userData: User = {
        ...editData,
        fullName: editData.name || editData.fullName,  // Save name as fullName
      }
      onEdit(userData)
      setIsEditing(false)
      setEditData(null)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(null)
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-0.75rem)] xs:w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-xs xs:max-w-sm sm:max-w-sm md:max-w-md bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden max-h-[calc(100vh-50px)] xs:max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-70px)] md:max-h-[90vh] flex flex-col mt-16 md:mt-0"
          >
            {/* Header */}
            <div className="relative p-1.5 xs:p-2 sm:p-3 md:p-5 border-b border-border bg-gradient-to-r from-surface via-background to-surface flex-shrink-0">
              <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
                <div className="min-w-0 flex-1">
                  {viewOnly ? (
                    <h2 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-800 text-foreground truncate tracking-tight">
                      User Details
                    </h2>
                  ) : (
                    <>
                      <h2 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-800 text-foreground truncate tracking-tight">
                        {isEditing ? 'Edit Profile' : 'Edit Profile'}
                      </h2>
                      <p className="text-xs xs:text-xs sm:text-sm text-muted mt-0.5 xs:mt-1 font-400">Manage user account details</p>
                    </>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1 xs:p-1.5 hover:bg-background rounded-lg transition-all flex-shrink-0 cursor-pointer"
                >
                  <X size={16} className="xs:w-[18px] xs:h-[18px] text-muted" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-1.5 xs:p-2 sm:p-2.5 md:p-4 space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 min-h-0">
              {/* Avatar and Name Section */}
              <motion.div
                className="flex flex-col items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-4 pb-1.5 xs:pb-2 sm:pb-2.5 md:pb-4 border-b border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-10 xs:w-12 sm:w-14 md:w-16 h-10 xs:h-12 sm:h-14 md:h-16 rounded-lg xs:rounded-xl bg-gradient-to-br from-color-blue to-color-accent flex items-center justify-center text-base xs:text-lg sm:text-xl md:text-2xl shadow-lg flex-shrink-0">
                  {displayUser.avatar}
                </div>
                <div className="w-full text-center">
                  <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-800 text-foreground tracking-tight">{displayUser.name}</h3>
                  <p className="text-xs xs:text-sm text-muted font-500 mt-0.5 xs:mt-1">Account Holder</p>
                </div>
              </motion.div>

              {/* Info Grid - Compact - Only show if not editing */}
              {!isEditing && (
                <div className="grid grid-cols-1 gap-1 xs:gap-1.5 sm:gap-2 md:gap-3">
                  {/* Email */}
                  <motion.div
                    className="space-y-1 xs:space-y-1.5 sm:space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <Mail size={14} className="xs:w-4 xs:h-4 text-blue flex-shrink-0" />
                      <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Email</label>
                    </div>
                    <p className="text-xs xs:text-sm text-foreground font-500 bg-background/50 p-1.5 xs:p-2 sm:p-2.5 rounded-lg break-all">{displayUser.email}</p>
                  </motion.div>

                  {/* Username */}
                  {displayUser.username && (
                    <motion.div
                      className="space-y-1 xs:space-y-1.5 sm:space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Username</label>
                      <p className="text-xs xs:text-sm text-foreground font-500 bg-background/50 p-1.5 xs:p-2 sm:p-2.5 rounded-lg">{displayUser.username}</p>
                    </motion.div>
                  )}

                  {/* Gender */}
                  {displayUser.gender && (
                    <motion.div
                      className="space-y-1 xs:space-y-1.5 sm:space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Gender</label>
                      <p className="text-xs xs:text-sm text-foreground font-500 bg-background/50 p-1.5 xs:p-2 sm:p-2.5 rounded-lg">{displayUser.gender}</p>
                    </motion.div>
                  )}

                  {/* Age */}
                  {displayUser.age && (
                    <motion.div
                      className="space-y-1 xs:space-y-1.5 sm:space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Age</label>
                      <p className="text-xs xs:text-sm text-foreground font-500 bg-background/50 p-1.5 xs:p-2 sm:p-2.5 rounded-lg">{displayUser.age}</p>
                    </motion.div>
                  )}

                  {/* Bio */}
                  {displayUser.bio && (
                    <motion.div
                      className="space-y-1 xs:space-y-1.5 sm:space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Bio</label>
                      <p className="text-xs xs:text-sm text-foreground font-500 bg-background/50 p-1.5 xs:p-2 sm:p-2.5 rounded-lg break-words">{displayUser.bio}</p>
                    </motion.div>
                  )}

                  {/* Interests */}
                  {displayUser.interests && displayUser.interests.length > 0 && (
                    <motion.div
                      className="space-y-1 xs:space-y-1.5 sm:space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Interests</label>
                      <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 p-1.5 xs:p-2 sm:p-2.5 bg-background/50 rounded-lg">
                        {displayUser.interests.map((interest, idx) => (
                          <span key={idx} className="px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 bg-blue/20 text-blue text-xs font-600 rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </div>
              )}
              
              {/* Edit Mode - Only Name Field */}
              {isEditing && !viewOnly && (
                <div className="py-2 xs:py-3 sm:py-4 px-0">
                  <motion.div
                    className="space-y-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={editData?.name || ''}
                      onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                      className="w-full text-xs xs:text-sm bg-background border-2 border-blue/30 rounded-lg px-2 xs:px-3 py-1.5 xs:py-2 sm:py-2.5 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all font-500"
                      placeholder="Enter name"
                    />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Footer with Buttons */}
            <div className="flex gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 p-1.5 xs:p-2 sm:p-2.5 md:p-5 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
              {viewOnly ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all cursor-pointer"
                >
                  Close
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-2 md:px-3 py-2 text-white rounded-lg text-xs md:text-sm font-600 hover:shadow-lg transition-all flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    <Save size={14} />
                    <span>Save</span>
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
