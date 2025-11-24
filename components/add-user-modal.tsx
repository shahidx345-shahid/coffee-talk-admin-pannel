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
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-16 md:mt-0"
            onClick={onClose}
          >
            <div 
              className="bg-background rounded-lg border border-border shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[calc(100vh-40px)] sm:max-h-[calc(100vh-50px)] md:max-h-[75vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-1.5 sm:p-2 md:p-3 border-b border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
                <h2 className="text-xs sm:text-sm md:text-base font-bold text-foreground">Add New User</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-surface rounded-lg transition flex-shrink-0 text-muted hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </motion.button>
              </div>
            
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto flex-1 p-1.5 sm:p-2 md:p-3 space-y-2 sm:space-y-2.5 md:space-y-3">
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Password</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. johndoe"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                    placeholder="e.g. 25"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition resize-none"
                    placeholder="Enter bio"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Location</label>
                  <div className="space-y-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={locationInput}
                        onChange={handleLocationChange}
                        onFocus={() => setShowLocationSuggestions(true)}
                        placeholder="Search location (e.g., Tokyo, New York)..."
                        className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
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
                              className="w-full text-left px-3 py-2.5 hover:bg-surface text-xs sm:text-sm text-foreground transition border-b border-border last:border-b-0 flex items-center gap-2"
                            >
                              <MapPin size={14} className="text-muted flex-shrink-0" />
                              {location.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {formData.latitude !== 0 && formData.longitude !== 0 && (
                      <p className="text-xs text-muted bg-surface/50 p-2 rounded-lg">
                        Lat: {formData.latitude.toFixed(4)}, Long: {formData.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-xs md:text-sm font-600 text-foreground mb-1 uppercase tracking-wide text-[11px]">Interests (Max 5)</label>
                  
                  {/* Selected Interests */}
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
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
                      className="w-full px-2.5 py-1.5 border-2 border-border rounded-lg text-xs sm:text-xs md:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition disabled:opacity-50"
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
                </div>

                <div className="flex gap-1.5 p-1.5 sm:p-2 md:p-3 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-3 py-1.5 text-white rounded-lg font-600 text-xs sm:text-xs md:text-sm hover:opacity-90 transition-colors cursor-pointer"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    Add User
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-3 py-1.5 border-2 border-border text-foreground rounded-lg font-600 text-xs sm:text-xs md:text-sm hover:bg-surface transition-colors cursor-pointer"
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
