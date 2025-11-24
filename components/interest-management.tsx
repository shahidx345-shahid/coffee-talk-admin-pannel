'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react'
import { Header } from './header'
import { LoadingTable } from './loading'
import { InterestOverlay } from './interest-overlay'
import { InterestDeleteOverlay } from './interest-delete-overlay'
import { interestService } from '@/lib/firebase-service'

interface Interest {
  id: string
  name: string
  dateAdded: string
}

export function InterestManagement() {
  const [interests, setInterests] = useState<Interest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const interests = await interestService.getAllInterests()
        const mappedInterests: Interest[] = interests.map((interest: any) => ({
          id: interest.id,
          name: interest.name,
          dateAdded: interest.dateAdded || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }))
        setInterests(mappedInterests)
      } catch (error) {
        console.error('Error fetching interests:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInterests()
  }, [])

  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null)
  const [isInterestOverlayOpen, setIsInterestOverlayOpen] = useState(false)
  const [isInterestEditOverlayOpen, setIsInterestEditOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddInterest = async () => {
    if (inputValue.trim()) {
      try {
        const newInterest = await interestService.createInterest({
          name: inputValue,
          dateAdded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        })

        const mappedInterest: Interest = {
          id: newInterest.id,
          name: newInterest.name,
          dateAdded: newInterest.dateAdded || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }

        setInterests([mappedInterest, ...interests])
        setInputValue('')
      } catch (error) {
        console.error('Error adding interest:', error)
        alert('Error adding interest: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const handleDeleteInterest = async (id: string) => {
    try {
      await interestService.deleteInterest(id)
      setInterests(interests.filter(i => i.id !== id))
    } catch (error) {
      console.error('Error deleting interest:', error)
      alert('Error deleting interest: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleEditStart = (interest: Interest) => {
    setSelectedInterest(interest)
    setIsInterestOverlayOpen(true)
  }

  const handleEditSave = async (id: string) => {
    if (editValue.trim()) {
      try {
        // Use Firebase service instead of API
        await interestService.updateInterest(id, {
          name: editValue,
        })

        setInterests(interests.map(i => i.id === id ? { ...i, name: editValue } : i))
        setEditingId(null)
        setEditValue('')
      } catch (error) {
        console.error('Error updating interest:', error)
        alert('Error updating interest: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const handleEditInterestFromOverlay = async (updatedInterest: Interest) => {
    try {
      await interestService.updateInterest(updatedInterest.id, {
        name: updatedInterest.name,
      })

      setInterests(interests.map(i => i.id === updatedInterest.id ? { ...i, ...updatedInterest } : i))
      setIsInterestEditOverlayOpen(false)
      setSelectedInterest(null)
    } catch (error) {
      console.error('Error updating interest:', error)
      alert('Error updating interest: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      callback()
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        breadcrumb={['Coffee Admin', 'Interests']}
        title="Manage Interests"
      />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="space-y-4 md:space-y-6">
          {/* Add Interest Input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter new interest..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddInterest)}
              className="flex-1 px-4 py-2.5 border-2 border-border rounded-lg text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddInterest}
              className="px-4 py-2.5 text-white rounded-lg font-600 text-sm transition flex items-center justify-center gap-2 whitespace-nowrap hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: '#fa9233' }}
            >
              <Plus size={18} />
              <span>Add Interest</span>
            </motion.button>
          </div>

          {/* Interests Table */}
          <div className="border border-border rounded-lg overflow-x-auto">
            {isLoading ? (
              <LoadingTable />
            ) : interests.length === 0 ? (
              <div className="p-8 text-center text-muted">No interests yet. Create one to get started!</div>
            ) : (
              <table className="w-full text-xs md:text-sm min-w-max md:min-w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Interest Name</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground hidden sm:table-cell">Date Added</th>
                    <th className="px-3 md:px-4 py-3 text-center font-600 text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {interests.map((interest, idx) => (
                      <motion.tr
                        key={interest.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border hover:bg-surface/50 transition"
                      >
                        <td className="px-3 md:px-4 py-4">
                          {editingId === interest.id ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, () => handleEditSave(interest.id))}
                              className="w-full px-2 py-1 border-2 border-blue rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue/20"
                              autoFocus
                            />
                          ) : (
                            <span className="font-500 text-foreground">{interest.name}</span>
                          )}
                        </td>
                        <td className="px-3 md:px-4 py-4 text-foreground hidden sm:table-cell">{interest.dateAdded}</td>
                        <td className="px-3 md:px-4 py-4">
                          <div className="flex items-center justify-center gap-1 md:gap-2">
                            {editingId === interest.id ? (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditSave(interest.id)}
                                  className="p-1.5 md:p-2 hover:bg-orange-500/10 rounded-lg transition cursor-pointer"
                                  style={{ color: '#fa9233' }}
                                  title="Save changes"
                                >
                                  <Save size={16} className="md:w-[18px] md:h-[18px]" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setEditingId(null)}
                                  className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500 cursor-pointer"
                                  title="Cancel edit"
                                >
                                  <X size={16} className="md:w-[18px] md:h-[18px]" />
                                </motion.button>
                              </>
                            ) : (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setSelectedInterest(interest)
                                    setIsInterestEditOverlayOpen(true)
                                  }}
                                  className="p-1.5 md:p-2 hover:bg-orange-500/10 rounded-lg transition cursor-pointer"
                                  style={{ color: '#fa9233' }}
                                  title="Edit interest"
                                >
                                  <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setSelectedInterest(interest)
                                    setIsDeleteOpen(true)
                                  }}
                                  className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500 cursor-pointer"
                                  title="Delete interest"
                                >
                                  <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                </motion.button>
                              </>
                            )}
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

      <InterestOverlay
        interest={selectedInterest}
        isOpen={isInterestOverlayOpen}
        onClose={() => {
          setIsInterestOverlayOpen(false)
          setSelectedInterest(null)
        }}
        viewOnly={true}
      />
      <InterestOverlay
        interest={selectedInterest}
        isOpen={isInterestEditOverlayOpen}
        onClose={() => {
          setIsInterestEditOverlayOpen(false)
          setSelectedInterest(null)
        }}
        onEdit={handleEditInterestFromOverlay}
        viewOnly={false}
      />
      <InterestDeleteOverlay
        interest={selectedInterest}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedInterest(null)
        }}
        onConfirm={handleDeleteInterest}
      />
    </div>
  )
}
