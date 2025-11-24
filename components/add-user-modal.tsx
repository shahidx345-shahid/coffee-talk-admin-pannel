'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Loader } from 'lucide-react'
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
    location: '',
    latitude: 0,
    longitude: 0,
  })
  const [interestInput, setInterestInput] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ name: string; lat: number; lon: number }>>([])
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  const filteredInterests = AVAILABLE_INTERESTS.filter(interest =>
    interest.toLowerCase().includes(interestInput.toLowerCase()) &&
    !formData.interests.includes(interest)
  )

  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([])
      return
    }

    setIsSearchingLocation(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      )
      const data = await response.json()
      
      const suggestions = data.map((item: any) => ({
        name: item.display_name.split(',')[0] + ', ' + (item.address?.country || ''),
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }))
      
      setLocationSuggestions(suggestions)
    } catch (error) {
      console.warn('Error searching location:', error instanceof Error ? error.message : 'Location search failed')
    } finally {
      setIsSearchingLocation(false)
    }
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocationInput(value)
    searchLocation(value)
    setShowLocationSuggestions(true)
  }

  const selectLocation = (location: { name: string; lat: number; lon: number }) => {
    setFormData({
      ...formData,
      location: location.name,
      latitude: location.lat,
      longitude: location.lon
    })
    setLocationInput(location.name)
    setLocationSuggestions([])
    setShowLocationSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({ name: '', email: '', password: '', username: '', age: 0, gender: 'Other', bio: '', interests: [], location: '', latitude: 0, longitude: 0 })
    setLocationInput('')
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
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-0.75rem)] xs:w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-xs xs:max-w-sm sm:max-w-sm md:max-w-md bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden max-h-[75vh] xs:max-h-[80vh] sm:max-h-[85vh] md:max-h-[90vh] flex flex-col mt-16 md:mt-0"
          >
            <div className="relative p-1.5 xs:p-2 sm:p-3 md:p-5 border-b border-border bg-gradient-to-r from-surface via-background to-surface flex-shrink-0">
              <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-800 text-foreground truncate tracking-tight">Add New User</h2>
                  <p className="text-xs xs:text-sm text-muted mt-0.5 xs:mt-1 font-400">Create a new user account</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1 xs:p-1.5 hover:bg-background rounded-lg transition-all flex-shrink-0 cursor-pointer"
                >
                  <X size={16} className="xs:w-[18px] xs:h-[18px] text-muted" />
                </motion.button>
              </div>
            </div>
          
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto flex-1 p-1.5 xs:p-2 sm:p-2.5 md:p-4 space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3">
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition font-500"
                    placeholder="e.g. John Doe"
                  />
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition font-500"
                    placeholder="e.g. john@example.com"
                  />
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition font-500"
                    placeholder="Enter password"
                  />
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition font-500"
                    placeholder="e.g. johndoe"
                  />
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition font-500"
                    placeholder="e.g. 25"
                  />
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition font-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition resize-none font-500"
                    placeholder="Enter bio"
                    rows={1}
                  />
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Location</label>
                  <div className="space-y-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={locationInput}
                        onChange={handleLocationChange}
                        onFocus={() => setShowLocationSuggestions(true)}
                        placeholder="Search location (e.g., Tokyo, New York)..."
                        className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition font-500"
                      />
                      
                      {isSearchingLocation && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader size={16} className="animate-spin text-muted" />
                        </div>
                      )}

                      {/* Location Suggestions Dropdown */}
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                          {locationSuggestions.map((location, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => selectLocation(location)}
                              className="w-full text-left px-2 xs:px-3 py-1.5 xs:py-2 hover:bg-surface text-xs xs:text-sm text-foreground transition border-b border-border last:border-b-0 flex items-center gap-2 font-500"
                            >
                              <MapPin size={14} className="text-muted flex-shrink-0" />
                              {location.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {formData.latitude !== 0 && formData.longitude !== 0 && (
                      <p className="text-xs xs:text-sm text-muted bg-background/50 p-1.5 xs:p-2 rounded-lg font-500">
                        Lat: {formData.latitude.toFixed(4)}, Long: {formData.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="text-xs xs:text-sm font-700 text-muted uppercase tracking-wider">Interests (Max 5)</label>
                  
                  {/* Selected Interests */}
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 p-1.5 xs:p-2 bg-background/50 rounded-lg">
                      {formData.interests.map((interest) => (
                        <div
                          key={interest}
                          className="flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-xs xs:text-sm text-white font-500"
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
                      className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border-2 border-border rounded-lg text-xs xs:text-sm bg-background focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition disabled:opacity-50 font-500"
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
                            className="w-full text-left px-2 xs:px-3 py-1.5 xs:py-2 hover:bg-surface text-xs xs:text-sm text-foreground transition border-b border-border last:border-b-0 font-500"
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

                  <p className="text-xs xs:text-sm text-muted mt-2 font-500">{formData.interests.length}/5 selected</p>
                </motion.div>
                </div>

              <div className="flex gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 p-1.5 xs:p-2 sm:p-2.5 md:p-5 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-2 md:px-3 py-2 text-white rounded-lg text-xs md:text-sm font-600 hover:shadow-lg transition-all flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#fa9233' }}
                >
                  <span>Add User</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
