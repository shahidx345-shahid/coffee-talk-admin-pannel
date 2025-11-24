'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react'

export interface Event {
  id: string
  eventName: string
  description?: string
  location?: string
  latitude?: number
  longitude?: number
  cafeName?: string
  cafeAddress?: string
  cafeLatitude?: number
  cafeLongitude?: number
  eventDate: number
  maxAttendees?: number
  imageUrl?: string
  createdAt: number
  updatedAt?: number
  attendeesCount?: number
  createdBy?: string
}

interface EventOverlayProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  viewOnly?: boolean
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function EventOverlay({ event, isOpen, onClose, viewOnly }: EventOverlayProps) {
  if (!event) return null

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-16 md:mt-0"
            onClick={onClose}
          >
            <div
              className="bg-background rounded-lg border border-border shadow-xl w-full max-w-lg max-h-[calc(100vh-120px)] md:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between p-3 md:p-4 border-b border-border bg-surface/50 backdrop-blur-sm z-10">
                <h2 className="text-base md:text-lg font-bold text-foreground">Event Details</h2>
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
              <div className="p-3 md:p-4 space-y-3">
                {/* Event Image */}
                {event.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full h-32 md:h-40 bg-surface rounded-lg overflow-hidden"
                  >
                    <img
                      src={event.imageUrl}
                      alt={event.eventName}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Event Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-foreground mb-1">{event.eventName}</h3>
                </motion.div>

                {/* Description */}
                {event.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm text-foreground/80">{event.description}</p>
                  </motion.div>
                )}

                {/* Event Details Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  {/* Date */}
                  <div className="p-2 bg-surface rounded-lg">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <CalendarIcon size={14} className="text-blue-500" />
                      <span className="text-xs font-600 text-muted uppercase">Event Date</span>
                    </div>
                    <p className="text-sm text-foreground font-500">{formatDate(event.eventDate)}</p>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="p-2 bg-surface rounded-lg">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MapPin size={14} className="text-orange-500" />
                        <span className="text-xs font-600 text-muted uppercase">Location</span>
                      </div>
                      <p className="text-sm text-foreground font-500 line-clamp-1">{event.location}</p>
                    </div>
                  )}

                  {/* Max Attendees */}
                  {event.maxAttendees && (
                    <div className="p-2 bg-surface rounded-lg">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Users size={14} className="text-green-500" />
                        <span className="text-xs font-600 text-muted uppercase">Max Attendees</span>
                      </div>
                      <p className="text-sm text-foreground font-500">{event.maxAttendees}</p>
                    </div>
                  )}

                  {/* Current Attendees */}
                  {event.attendeesCount !== undefined && (
                    <div className="p-2 bg-surface rounded-lg">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Users size={14} className="text-blue-500" />
                        <span className="text-xs font-600 text-muted uppercase">Current Attendees</span>
                      </div>
                      <p className="text-sm text-foreground font-500">{event.attendeesCount}</p>
                    </div>
                  )}
                </motion.div>

                {/* Cafe Details */}
                {event.cafeName && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-2.5 bg-surface rounded-lg border border-border"
                  >
                    <h4 className="font-600 text-sm text-foreground mb-2">Cafe Details</h4>
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs font-600 text-muted uppercase block mb-0.5">Cafe Name</span>
                        <p className="text-sm text-foreground">{event.cafeName}</p>
                      </div>
                      {event.cafeAddress && (
                        <div>
                          <span className="text-xs font-600 text-muted uppercase block mb-0.5">Address</span>
                          <p className="text-sm text-foreground line-clamp-1">{event.cafeAddress}</p>
                        </div>
                      )}
                      {event.cafeLatitude && event.cafeLongitude && (
                        <div>
                          <span className="text-xs font-600 text-muted uppercase block mb-0.5">Coordinates</span>
                          <p className="text-xs text-foreground">
                            {event.cafeLatitude.toFixed(4)}, {event.cafeLongitude.toFixed(4)}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Event Coordinates */}
                {event.latitude && event.longitude && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-2.5 bg-surface rounded-lg border border-border"
                  >
                    <h4 className="font-600 text-sm text-foreground mb-1">Event Location Coordinates</h4>
                    <p className="text-xs text-foreground">
                      {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                    </p>
                  </motion.div>
                )}


              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
