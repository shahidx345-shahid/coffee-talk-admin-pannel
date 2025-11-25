'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { type Review } from '@/lib/firebase-service'

interface ReviewOverlayProps {
  review?: Review | null
  isOpen: boolean
  onClose: () => void
  onAdd?: (reviewData: any) => void
  onEdit?: (review: Review) => void
  viewOnly?: boolean
}

export function ReviewOverlay({
  review,
  isOpen,
  onClose,
  onAdd,
  onEdit,
  viewOnly = true,
}: ReviewOverlayProps) {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    rating: 5,
    reviewText: '',
  })

  useEffect(() => {
    if (review) {
      setFormData({
        name: review.name,
        country: review.country,
        rating: review.rating,
        reviewText: review.reviewText,
      })
    } else {
      setFormData({
        name: '',
        country: '',
        rating: 5, // Default to 5 stars
        reviewText: '',
      })
    }
  }, [review, isOpen])

  const handleSubmit = () => {
    if (!formData.name || !formData.country || !formData.reviewText.trim()) {
      alert('Please fill in all fields')
      return
    }

    if (formData.rating < 1) {
      alert('Please select at least 1 star')
      return
    }

    if (review && onEdit) {
      onEdit({
        id: review.id,
        ...formData,
      } as Review)
    } else if (onAdd) {
      onAdd(formData)
    }
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
              className="bg-background rounded-lg border border-border flex flex-col overflow-hidden shadow-xl w-full max-w-md max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border flex-shrink-0">
                <h2 className="text-lg md:text-xl font-bold text-foreground">
                  {viewOnly ? 'Review Details' : review ? 'Edit Review' : 'Add Review'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-surface rounded-lg transition text-muted hover:text-foreground cursor-pointer"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-4">
                {/* Reviewer Name */}
                <div>
                  <label className="block text-xs md:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">
                    Reviewer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={viewOnly}
                    placeholder="e.g., Kristin Watson"
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition disabled:opacity-50"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs md:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    disabled={viewOnly}
                    placeholder="e.g., US, UK, Canada"
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition disabled:opacity-50"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs md:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">
                    Rating (1-5 stars) *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={!viewOnly ? { scale: 1.2 } : {}}
                          whileTap={!viewOnly ? { scale: 0.95 } : {}}
                          onClick={() => {
                            if (!viewOnly) {
                              // If clicking a filled star, deselect it (reduce rating by 1)
                              // If clicking an unfilled star, select up to that star
                              if (star <= formData.rating) {
                                // Clicking on a filled star - deselect it
                                setFormData({ 
                                  ...formData, 
                                  rating: star - 1
                                })
                              } else {
                                // Clicking on an empty star - fill up to that star
                                setFormData({ 
                                  ...formData, 
                                  rating: star
                                })
                              }
                            }
                          }}
                          className="cursor-pointer transition"
                          type="button"
                        >
                          <Star
                            size={32}
                            className={`${
                              star <= formData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted'
                            } transition`}
                          />
                        </motion.button>
                      ))}
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {formData.rating > 0 
                      ? `${formData.rating} star${formData.rating !== 1 ? 's' : ''} selected` 
                      : 'Click a star to rate'}
                  </p>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs md:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">
                    Review *
                  </label>
                  <textarea
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    disabled={viewOnly}
                    placeholder="Write your detailed review here..."
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition disabled:opacity-50 resize-none"
                    rows={5}
                  />
                </div>
              </div>

              {/* Footer */}
              {!viewOnly && (
                <div className="flex gap-2 p-4 md:p-6 border-t border-border flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2.5 text-white rounded-lg font-600 text-sm transition-all"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    {review ? 'Update Review' : 'Add Review'}
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
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
