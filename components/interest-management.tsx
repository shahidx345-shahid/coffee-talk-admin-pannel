'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { Header } from './header'
import { InterestOverlay } from './interest-overlay'
import { InterestDeleteOverlay } from './interest-delete-overlay'

interface Interest {
  id: string
  name: string
  dateAdded: string
}

export function InterestManagement() {
  const [interests, setInterests] = useState<Interest[]>([
    { id: '1', name: 'Art & Design', dateAdded: 'Jan 15, 2024' },
    { id: '2', name: 'Music', dateAdded: 'Jan 20, 2024' },
    { id: '3', name: 'Travel', dateAdded: 'Feb 3, 2024' },
  ])

  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null)
  const [isInterestOverlayOpen, setIsInterestOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddInterest = () => {
    if (inputValue.trim()) {
      const newInterest: Interest = {
        id: Date.now().toString(),
        name: inputValue,
        dateAdded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      }
      setInterests([...interests, newInterest])
      setInputValue('')
    }
  }

  const handleDeleteInterest = (id: string) => {
    setInterests(interests.filter(i => i.id !== id))
  }

  const handleEditStart = (interest: Interest) => {
    setSelectedInterest(interest)
    setIsInterestOverlayOpen(true)
  }

  const handleEditSave = (id: string) => {
    if (editValue.trim()) {
      setInterests(interests.map(i => i.id === id ? { ...i, name: editValue } : i))
      setEditingId(null)
      setEditValue('')
    }
  }

  const handleEditInterestFromOverlay = (updatedInterest: Interest) => {
    setInterests(interests.map(i => i.id === updatedInterest.id ? { ...i, ...updatedInterest } : i))
    setIsInterestOverlayOpen(false)
    setSelectedInterest(null)
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
                                onClick={() => handleEditStart(interest)}
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
          </div>

          {/* Empty State */}
          {interests.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-muted text-sm">No interests added yet. Create one to get started!</p>
            </motion.div>
          )}
        </div>
      </div>

      <InterestOverlay 
        interest={selectedInterest}
        isOpen={isInterestOverlayOpen}
        onClose={() => {
          setIsInterestOverlayOpen(false)
          setSelectedInterest(null)
        }}
        onEdit={handleEditInterestFromOverlay}
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
