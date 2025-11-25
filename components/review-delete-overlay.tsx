'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { type Review } from '@/lib/firebase-service'

interface ReviewDeleteOverlayProps {
  review: Review | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (reviewId: string) => void
}

export function ReviewDeleteOverlay({
  review,
  isOpen,
  onClose,
  onConfirm,
}: ReviewDeleteOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && review && (
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
              className="bg-background rounded-lg border border-red-200 flex flex-col overflow-hidden shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex justify-center pt-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center space-y-2">
                <h2 className="text-lg font-bold text-foreground">Delete Review?</h2>
                <p className="text-sm text-muted">
                  Are you sure you want to delete the review from{' '}
                  <span className="font-600 text-foreground">{review.name}</span>? This action cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-6 border-t border-border">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg font-600 text-sm hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onConfirm(review.id)
                    onClose()
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-600 text-sm transition-colors cursor-pointer"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
