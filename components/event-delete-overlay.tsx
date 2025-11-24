'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { type Event } from './event-overlay'

interface EventDeleteOverlayProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (eventId: string) => void
}

export function EventDeleteOverlay({ event, isOpen, onClose, onConfirm }: EventDeleteOverlayProps) {
  if (!event) return null

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
              className="bg-background rounded-lg border border-border p-6 shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle size={24} className="text-red-500" />
                  <h2 className="text-lg font-bold text-foreground">Delete Event?</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-surface rounded-lg transition text-muted hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <p className="text-sm text-foreground mb-6">
                Are you sure you want to delete <span className="font-600">"{event.eventName}"</span>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onConfirm(event.id)
                    onClose()
                  }}
                  className="flex-1 px-4 py-2.5 text-white rounded-lg font-600 text-sm hover:opacity-90 transition-colors cursor-pointer"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg font-600 text-sm hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
