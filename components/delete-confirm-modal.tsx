'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  itemName: string
  itemDetails?: {
    label: string
    value: string
  }[]
  isLoading?: boolean
}
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemDetails = [],
  isLoading = false,
}: DeleteConfirmModalProps) {
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
          >
            <div className="bg-background rounded-lg border border-border p-4 sm:p-6 shadow-xl w-full max-w-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-foreground pr-2">{title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-surface rounded-lg transition flex-shrink-0 text-muted hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Warning Icon and Message */}
              <div className="flex items-start gap-3 mb-4 sm:mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-600 text-red-900">Confirm Deletion</p>
                  <p className="text-xs text-red-700 mt-1">This action cannot be undone.</p>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-3 mb-6 pb-4 border-b border-border">
                <div className="bg-background/50 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted uppercase tracking-wider font-600 mb-1">Item to delete</p>
                  <p className="text-sm font-600 text-foreground break-all">{itemName}</p>
                </div>

                {itemDetails.length > 0 && (
                  <div className="space-y-2">
                    {itemDetails.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-2">
                        <span className="text-xs text-muted uppercase tracking-wider font-600">{detail.label}</span>
                        <span className="text-xs text-foreground font-500 text-right break-all">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg font-600 text-xs sm:text-sm hover:bg-surface transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-white rounded-lg font-600 text-xs sm:text-sm hover:opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
