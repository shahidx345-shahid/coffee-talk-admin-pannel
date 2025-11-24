'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (user: any) => void
}

const AVAILABLE_INTERESTS = [
  '🎨 Art & Design',
  '🎵 Music & Concerts',
  '📚 Books & Writing',
  '🌊 Ocean & Outdoors',
  '💪 Fitness & Wellness',
  '🧘 Mindfulness',
  '✈ Travel & Adventure',
  '📽 Movies',
  '🌍 Language Exchange',
  '🤝 Volunteering & Community',
  '🌿 Sustainability / Environment',
  '🍲 Food & Cooking',
  '📸 Photography',
  '🧳 Remote Work / Freelancing',
  '🌃 Nightlife',
  '🍻 Beer, Wine & Spirits',
  '💃 Dancing & Live Music'
]

export function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    age: 0,
    gender: 'Other',
    bio: '',
    interests: [] as string[],
  })
  const [interestInput, setInterestInput] = useState('')

  const filteredInterests = AVAILABLE_INTERESTS.filter(interest =>
    interest.toLowerCase().includes(interestInput.toLowerCase()) &&
    !formData.interests.includes(interest)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({ name: '', email: '', password: '', username: '', age: 0, gender: 'Other', bio: '', interests: [] })
    onClose()
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-16 md:mt-0"
            onClick={onClose}
          >
            <div 
              className="bg-background rounded-lg border border-border p-4 sm:p-6 shadow-xl w-full max-w-sm max-h-[calc(100vh-120px)] md:max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-foreground pr-2">Add New User</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-surface rounded-lg transition flex-shrink-0 text-muted hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </motion.button>
              </div>
            
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. johndoe"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. 25"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition resize-none"
                    placeholder="Enter bio"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Interests (Max 5)</label>
                  
                  {/* Selected Interests */}
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.interests.map((interest) => (
                        <div
                          key={interest}
                          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white"
                          style={{ backgroundColor: '#03a3ec' }}
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) })}
                            className="hover:opacity-80 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      placeholder="Type to search interests..."
                      disabled={formData.interests.length >= 5}
                      className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition disabled:opacity-50"
                    />

                    {/* Suggestions Dropdown */}
                    {interestInput && filteredInterests.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                        {filteredInterests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, interests: [...formData.interests, interest] })
                              setInterestInput('')
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-surface text-xs sm:text-sm text-foreground transition border-b border-border last:border-b-0"
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    )}

                    {interestInput && filteredInterests.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg p-3 text-xs text-muted text-center">
                        No matching interests
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted mt-2">{formData.interests.length}/5 selected</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2.5 text-white rounded-lg font-600 text-xs sm:text-sm hover:opacity-90 transition-colors cursor-pointer"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    Add User
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg font-600 text-xs sm:text-sm hover:bg-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
