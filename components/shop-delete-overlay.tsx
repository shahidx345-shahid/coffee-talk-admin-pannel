'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Trash2, MapPin } from 'lucide-react'

interface Shop {
  id: string
  picture: string
  title: string
  name: string
  location: string
}

interface ShopDeleteOverlayProps {
  shop: Shop | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (shopId: string) => void
  isLoading?: boolean
}

export function ShopDeleteOverlay({ shop, isOpen, onClose, onConfirm, isLoading = false }: ShopDeleteOverlayProps) {
  if (!shop) return null

  const handleConfirm = () => {
    onConfirm(shop.id)
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
            <div className="relative p-3 md:p-4 border-b border-border bg-gradient-to-r from-red-50 via-red-50/50 to-surface flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base md:text-lg font-700 text-red-900 truncate">
                    Delete Shop
                  </h2>
                  <p className="text-xs text-red-700 mt-0.5 font-500">This action cannot be undone</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1.5 hover:bg-red-100 rounded-lg transition-all flex-shrink-0 disabled:opacity-50"
                >
                  <X size={16} className="text-red-700" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-3 md:p-4 space-y-3">
              {/* Warning Section */}
              <motion.div 
                className="flex items-start gap-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-700 text-red-900">Warning</p>
                  <p className="text-xs text-red-700 mt-0.5">Deleting this shop will permanently remove all associated data.</p>
                </div>
              </motion.div>

              {/* Shop Details */}
              <motion.div
                className="space-y-2.5 p-3 bg-background/50 border border-border rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs font-700 text-muted uppercase tracking-wider">Shop to delete</p>
                
                {/* Picture and Title */}
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-lg bg-surface border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {shop.picture && shop.picture.startsWith('data:') ? (
                      <img src={shop.picture} alt={shop.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">{shop.picture}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-700 text-foreground truncate">{shop.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-muted flex-shrink-0" />
                      <p className="text-xs text-muted truncate">{shop.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer with Buttons */}
            <div className="flex gap-2 p-3 md:p-4 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
              <motion.button
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-2 md:px-3 py-2 text-white rounded-lg text-xs md:text-sm font-600 hover:shadow-lg transition-all flex items-center justify-center gap-1 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#ef4444' }}
              >
                <Trash2 size={14} />
                <span>{isLoading ? 'Deleting...' : 'Delete'}</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
