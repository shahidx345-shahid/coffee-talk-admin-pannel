'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit2, Save } from 'lucide-react'
import { useState } from 'react'

interface Interest {
  id: string
  name: string
  dateAdded: string
}

interface InterestOverlayProps {
  interest: Interest | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (interest: Interest) => void
}

export function InterestOverlay({ interest, isOpen, onClose, onEdit }: InterestOverlayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Interest | null>(null)

  if (!interest) return null

  const displayInterest = editData || interest

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(interest)
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
            <div className="relative p-3 md:p-4 border-b border-border bg-gradient-to-r from-surface via-background to-surface flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base md:text-lg font-700 text-foreground truncate">
                    {isEditing ? 'Edit Interest' : 'Interest Details'}
                  </h2>
                  <p className="text-xs text-muted mt-0.5 font-500">Manage interest information</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-background rounded-lg transition-all flex-shrink-0 cursor-pointer"
                >
                  <X size={16} className="text-muted" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-3 md:p-4 space-y-4">
              {/* Interest Name Section */}
              <motion.div 
                className="space-y-1.5 pb-3 border-b border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="text-xs font-700 text-muted uppercase tracking-wider">Interest Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.name || ''}
                    onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                    className="w-full text-base font-600 bg-background border-2 border-border rounded-lg px-3 py-2 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all"
                    placeholder="Enter interest name"
                  />
                ) : (
                  <p className="text-base font-600 text-foreground bg-background/50 p-3 rounded-lg">{displayInterest.name}</p>
                )}
              </motion.div>
            </div>

            {/* Footer with Buttons */}
            <div className="flex gap-2 p-3 md:p-4 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
              {isEditing ? (
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
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all cursor-pointer"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    className="flex-1 px-2 md:px-3 py-2 text-white rounded-lg text-xs md:text-sm font-600 hover:shadow-lg transition-all flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    <Edit2 size={14} />
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
