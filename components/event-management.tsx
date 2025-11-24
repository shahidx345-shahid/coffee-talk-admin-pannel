'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, Eye } from 'lucide-react'
import { LoadingTable } from './loading'
import { Header } from './header'
import { EventOverlay, type Event } from './event-overlay'
import { EventDeleteOverlay } from './event-delete-overlay'
import { db } from '@/firebase.config'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'


const formatDate = (timestamp: number) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Starting to fetch events...')
        const snapshot = await getDocs(collection(db, 'events'))
        console.log('Events collection snapshot:', snapshot)
        console.log('Number of events:', snapshot.docs.length)

        const mappedEvents: Event[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          console.log('Event data from Firebase:', data)
          return {
            id: doc.id,
            eventName: data.eventName || '',
            description: data.description || '',
            location: data.location || '',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            cafeName: data.cafeName || '',
            cafeAddress: data.cafeAddress || '',
            cafeLatitude: data.cafeLatitude || 0,
            cafeLongitude: data.cafeLongitude || 0,
            eventDate: data.eventDate?.toMillis?.() || data.eventDate || Date.now(),
            maxAttendees: data.maxAttendees || 0,
            imageUrl: data.imageUrl || '',
            createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt || Date.now(),
            attendeesCount: data.attendeesCount || 0,
            createdBy: data.createdBy || ''
          }
        })
        console.log('Mapped events:', mappedEvents)
        setEvents(mappedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
        alert(`Error fetching events: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])





  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventOverlayOpen, setIsEventOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId))
      setEvents(events.filter(e => e.id !== eventId))
      setIsDeleteOpen(false)
      alert('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }



  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  return (
    <div className="flex-1 flex flex-col">
      <Header
        breadcrumb={['Coffee Admin', 'Events']}
        title="Events"
      />



      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="space-y-4 md:space-y-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground transition"
            />
          </div>




          {/* Events Table */}
          <div className="border border-border rounded-lg overflow-x-auto">
            {isLoading ? (
              <LoadingTable />
            ) : filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-muted">No events yet. Create one to get started!</div>
            ) : (
              <table className="w-full text-xs md:text-sm min-w-max md:min-w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Picture</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Event Name</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground hidden md:table-cell">Location</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground hidden sm:table-cell">Date</th>
                    <th className="px-3 md:px-4 py-3 text-center font-600 text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredEvents.map((event, idx) => (
                      <motion.tr
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border hover:bg-surface/50 transition"
                      >
                        <td className="px-3 md:px-4 py-4">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.eventName}
                              className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-surface rounded-lg flex items-center justify-center text-muted text-xs">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-3 md:px-4 py-4">
                          <span className="font-500 text-foreground">{event.eventName}</span>
                        </td>
                        <td className="px-3 md:px-4 py-4 text-foreground hidden md:table-cell">{event.location}</td>
                        <td className="px-3 md:px-4 py-4 text-foreground hidden sm:table-cell">{formatDate(event.eventDate)}</td>
                        <td className="px-3 md:px-4 py-4">
                          <div className="flex items-center justify-center gap-1 md:gap-2">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedEvent(event)
                                setIsEventOverlayOpen(true)
                              }}
                              className="p-1.5 md:p-2 hover:bg-blue/10 rounded-lg transition cursor-pointer"
                              style={{ color: '#03a3ec' }}
                              title="View details"
                            >
                              <Eye size={16} className="md:w-[18px] md:h-[18px]" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedEvent(event)
                                setIsDeleteOpen(true)
                              }}
                              className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                              style={{ color: '#ef4444' }}
                              title="Delete event"
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

      {selectedEvent && (
        <>
          <EventOverlay
            event={selectedEvent}
            isOpen={isEventOverlayOpen}
            onClose={() => {
              setIsEventOverlayOpen(false)
              setSelectedEvent(null)
            }}
            viewOnly={true}
          />
          <EventDeleteOverlay
            event={selectedEvent}
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false)
              setSelectedEvent(null)
            }}
            onConfirm={handleDeleteEvent}
          />
        </>
      )}
    </div>
  )
}
