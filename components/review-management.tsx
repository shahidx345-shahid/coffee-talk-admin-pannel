'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Star } from 'lucide-react'
import { Header } from './header'
import { LoadingTable } from './loading'
import { ReviewOverlay } from './review-overlay'
import { ReviewDeleteOverlay } from './review-delete-overlay'
import { reviewService, type Review } from '@/lib/firebase-service'

export function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching reviews...')
        const reviewsData = await reviewService.getAllReviews()
        console.log('Fetched reviews:', reviewsData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false)
  const [isReviewEditOverlayOpen, setIsReviewEditOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddReview = async (newReviewData: any) => {
    try {
      const reviewData = {
        name: newReviewData.name,
        country: newReviewData.country,
        rating: newReviewData.rating,
        reviewText: newReviewData.reviewText,
      }

      console.log('Calling createReview with:', reviewData)
      const newReview = await reviewService.createReview(reviewData)
      console.log('Review created successfully:', newReview)
      setReviews([newReview, ...reviews])
      setIsModalOpen(false)
      alert('Review added successfully!')
    } catch (error: any) {
      console.error('Error adding review:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Full error:', error)
      alert('Error adding review: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId)
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Error deleting review: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleEditReview = async (updatedReview: Review) => {
    try {
      await reviewService.updateReview(updatedReview.id, {
        rating: updatedReview.rating,
        reviewText: updatedReview.reviewText,
        name: updatedReview.name,
        country: updatedReview.country,
      })
      setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r))
      setIsReviewEditOverlayOpen(false)
      setSelectedReview(null)
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Error updating review: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const filteredReviews = reviews.filter(review =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}
            />
          ))}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        breadcrumb={['Coffee Admin', 'Reviews']}
        title="Coffee Shop Reviews"
        action={
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-white rounded-lg font-500 text-xs md:text-sm whitespace-nowrap transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#fa9233' }}
          >
            <Plus size={18} />
            Add Review
          </motion.button>
        }
      />

      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="space-y-4 md:space-y-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground transition"
            />
          </div>

          {/* Reviews Table */}
          <div className="border border-border rounded-lg overflow-x-auto">
            {isLoading ? (
              <LoadingTable />
            ) : filteredReviews.length === 0 ? (
              <div className="p-8 text-center text-muted">No reviews yet. Create one to get started!</div>
            ) : (
              <table className="w-full text-xs md:text-sm min-w-max md:min-w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Name</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Country</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Rating</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 hidden md:table-cell text-foreground">Review</th>
                    <th className="px-3 md:px-4 py-3 text-center font-600 text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredReviews.map((review, idx) => (
                      <motion.tr
                        key={review.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border hover:bg-surface/50 transition"
                      >
                        <td className="px-3 md:px-4 py-4">
                          <span className="font-500 text-foreground">{review.name}</span>
                        </td>
                        <td className="px-3 md:px-4 py-4">
                          <span className="text-xs text-foreground">{review.country}</span>
                        </td>
                        <td className="px-3 md:px-4 py-4">
                          {renderStars(review.rating)}
                        </td>
                        <td className="px-3 md:px-4 py-4 hidden md:table-cell">
                          <span className="text-foreground line-clamp-2">{review.reviewText}</span>
                        </td>
                        <td className="px-3 md:px-4 py-4">
                          <div className="flex items-center justify-center gap-1 md:gap-2">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedReview(review)
                                setIsReviewEditOverlayOpen(true)
                              }}
                              className="p-1.5 md:p-2 hover:bg-orange-500/10 rounded-lg transition cursor-pointer"
                              style={{ color: '#fa9233' }}
                              title="Edit review"
                            >
                              <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedReview(review)
                                setIsDeleteOpen(true)
                              }}
                              className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500 cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ReviewOverlay
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddReview}
        viewOnly={false}
      />
      <ReviewOverlay
        review={selectedReview}
        isOpen={isReviewEditOverlayOpen}
        onClose={() => {
          setIsReviewEditOverlayOpen(false)
          setSelectedReview(null)
        }}
        onEdit={handleEditReview}
        viewOnly={false}
      />
      <ReviewDeleteOverlay
        review={selectedReview}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedReview(null)
        }}
        onConfirm={handleDeleteReview}
      />
    </div>
  )
}
