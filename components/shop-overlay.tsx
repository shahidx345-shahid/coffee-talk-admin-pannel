'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Edit2, Save, Upload, ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Shop {
  id: string
  picture: string
  pictures?: string[]
  title: string
  name: string
  location: string
  imageUrl?: string
  latitude?: number
  longitude?: number
}

interface ShopOverlayProps {
  shop: Shop | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (shop: Shop) => void
  viewOnly?: boolean
}

export function ShopOverlay({ shop, isOpen, onClose, onEdit, viewOnly = false }: ShopOverlayProps) {
  const [isEditing, setIsEditing] = useState(!viewOnly)
  const [editData, setEditData] = useState<Shop | null>(null)
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (isOpen && shop) {
      setEditData(shop)
      setIsEditing(!viewOnly)
      setCurrentPictureIndex(0)
    }
  }, [isOpen, shop, viewOnly])

  // Calculate displayShop and pictures safely
  const displayShop = editData || shop
  const pictures = displayShop ? (displayShop.pictures && displayShop.pictures.length > 0 ? displayShop.pictures : [displayShop.picture]) : []
  
  // Debug logging
  useEffect(() => {
    if (displayShop) {
      console.log('ShopOverlay - Shop:', displayShop.name)
      console.log('ShopOverlay - displayShop.pictures:', displayShop.pictures)
      console.log('ShopOverlay - pictures array:', pictures)
      console.log('ShopOverlay - pictures length:', pictures.length)
    }
  }, [displayShop?.name, displayShop?.pictures])

  // Auto-rotate pictures every 3 seconds
  useEffect(() => {
    if (!autoRotate || !pictures || pictures.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentPictureIndex((prev) => (prev + 1) % pictures.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [autoRotate, pictures])

  // Return null after all hooks are called
  if (!shop || !displayShop) return null

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(shop)
  }

  const handleSave = async () => {
    if (editData && onEdit) {
      // Simply pass the data to parent component which handles Firebase
      onEdit(editData)
      setIsEditing(false)
      setEditData(null)
      onClose()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(null)
    onClose()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editData) {
      try {
        // Import Firebase storage service
        const { firebaseStorageService } = await import('@/lib/firebase-storage')
        
        // Upload to Firebase Storage
        const imageUrl = await firebaseStorageService.uploadCoffeeShopImage(file)
        
        const currentPictures = editData.pictures || [editData.picture] || []
        const updatedPictures = [...currentPictures]
        updatedPictures[currentPictureIndex] = imageUrl
        setEditData({ 
          ...editData, 
          picture: imageUrl,
          pictures: updatedPictures
        })
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const handleAddPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editData) {
      try {
        // Import Firebase storage service
        const { firebaseStorageService } = await import('@/lib/firebase-storage')
        
        // Upload to Firebase Storage
        const imageUrl = await firebaseStorageService.uploadCoffeeShopImage(file)
        
        const currentPictures = editData.pictures || [editData.picture] || []
        const updatedPictures = [...currentPictures]
        updatedPictures.push(imageUrl)
        
        setEditData({ 
          ...editData, 
          pictures: updatedPictures
        })
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const handleRemovePicture = (index: number) => {
    if (editData) {
      const updatedPictures = pictures.filter((_, i) => i !== index)
      setEditData({
        ...editData,
        pictures: updatedPictures.length > 0 ? updatedPictures : [displayShop.picture]
      })
      if (currentPictureIndex >= updatedPictures.length && updatedPictures.length > 0) {
        setCurrentPictureIndex(updatedPictures.length - 1)
      }
    }
  }

  const nextPicture = () => {
    setCurrentPictureIndex((prev) => (prev + 1) % pictures.length)
    setAutoRotate(false)
  }

  const prevPicture = () => {
    setCurrentPictureIndex((prev) => (prev - 1 + pictures.length) % pictures.length)
    setAutoRotate(false)
  }

  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      // Use OpenStreetMap's reverse geocoding service (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      
      // Extract address from response
      if (data.address) {
        const addr = data.address
        // Build readable address
        const addressParts = [
          addr.road || addr.street,
          addr.city || addr.town || addr.village,
          addr.county || addr.state,
          addr.country
        ].filter(Boolean)
        return addressParts.join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch (error) {
      console.error('Error getting location name:', error)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  const handleGetLiveLocation = async () => {
    setIsGettingLocation(true)
    try {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser')
        setIsGettingLocation(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const locationName = await getLocationName(latitude, longitude)
          
          setEditData({
            ...editData!,
            location: locationName,
            latitude: Math.round(latitude * 100000) / 100000,
            longitude: Math.round(longitude * 100000) / 100000
          })
          setIsGettingLocation(false)
        },
        (error) => {
          console.warn('Geolocation error:', error?.message || 'User denied location access')
          setIsGettingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } catch (error) {
      console.error('Error in handleGetLiveLocation:', error)
      setIsGettingLocation(false)
    }
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden max-h-[calc(100vh-100px)] md:max-h-[85vh] flex flex-col mt-16 md:mt-0"
          >
            {/* Header */}
            <div className="relative p-2.5 md:p-4 border-b border-border bg-gradient-to-r from-surface via-background to-surface flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base md:text-lg font-700 text-foreground truncate">
                    {isEditing ? 'Edit Shop' : 'Shop Details'}
                  </h2>
                  <p className="text-xs text-muted mt-0.5 font-500">Manage shop information</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-background rounded-lg transition-all flex-shrink-0 cursor-pointer"
                >
                  <X size={16} className="text-muted" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-2.5 md:p-4 space-y-3">
              {/* Picture Section with Auto-Rotate */}
              <motion.div
                className="flex flex-col items-center gap-3 pb-3 border-b border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Main Picture Display */}
                <div className="relative w-full aspect-square rounded-lg bg-surface border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {pictures[currentPictureIndex]?.startsWith('data:') || pictures[currentPictureIndex]?.startsWith('http') ? (
                    <img src={pictures[currentPictureIndex]} alt={`${displayShop.name} ${currentPictureIndex + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">{pictures[currentPictureIndex]}</span>
                  )}
                  
                  {/* Navigation Buttons - Only show if multiple pictures */}
                  {pictures.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevPicture}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
                      >
                        <ChevronLeft size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextPicture}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
                      >
                        <ChevronRight size={16} />
                      </motion.button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-1 rounded-full text-white text-xs">
                        {currentPictureIndex + 1} / {pictures.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Picture Thumbnails - Show all pictures */}
                {pictures && pictures.length > 0 && (
                  <div className="w-full flex gap-2 overflow-x-auto pb-2">
                    {pictures.map((pic, index) => {
                      // Filter out empty or undefined pictures
                      if (!pic) return null
                      
                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setCurrentPictureIndex(index)
                            setAutoRotate(false)
                          }}
                          className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition ${
                            currentPictureIndex === index ? 'border-blue' : 'border-border'
                          }`}
                        >
                          {pic?.startsWith('data:') || pic?.startsWith('http') ? (
                            <img src={pic} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl bg-background">{pic}</div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* Upload Buttons */}
                {isEditing && (
                  <div className="flex gap-2 w-full">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-90 transition text-xs text-white font-500 cursor-pointer w-full" style={{ backgroundColor: '#fa9233' }}>
                        <Upload size={14} />
                        Edit Current
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddPicture}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-90 transition text-xs text-white font-500 cursor-pointer w-full" style={{ backgroundColor: '#0066cc' }}>
                        <Upload size={14} />
                        Add New
                      </div>
                    </label>
                  </div>
                )}

                {/* Delete Picture Button - Only show if editing and multiple pictures */}
                {isEditing && pictures.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRemovePicture(currentPictureIndex)}
                    className="w-full px-3 py-1.5 rounded-lg text-xs text-white font-500 hover:opacity-90 transition"
                    style={{ backgroundColor: '#dc2626' }}
                  >
                    Remove Picture
                  </motion.button>
                )}
              </motion.div>

              {/* Info Grid - Compact */}
              <div className="grid grid-cols-1 gap-3">
                {/* Title */}
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="text-xs font-700 text-muted uppercase tracking-wider">Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData?.title || ''}
                      onChange={(e) => setEditData({ ...editData!, title: e.target.value })}
                      className="w-full text-xs bg-background border-2 border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all font-500"
                      placeholder="Enter title"
                    />
                  ) : (
                    <p className="text-xs text-foreground font-500 bg-background/50 p-1.5 rounded-lg">{displayShop.title}</p>
                  )}
                </motion.div>

                {/* Location */}
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue flex-shrink-0" />
                    <label className="text-xs font-700 text-muted uppercase tracking-wider">Location</label>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData?.location || ''}
                        onChange={(e) => setEditData({ ...editData!, location: e.target.value })}
                        className="w-full text-xs bg-background border-2 border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all font-500"
                        placeholder="Enter location or use Get Live Location"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGetLiveLocation}
                        disabled={isGettingLocation}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white font-500 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#0066cc' }}
                      >
                        {isGettingLocation ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            <span>Getting Location...</span>
                          </>
                        ) : (
                          <>
                            <MapPin size={14} />
                            <span>Get Live Location</span>
                          </>
                        )}
                      </motion.button>
                      {editData?.latitude && editData?.longitude && (
                        <p className="text-xs text-muted bg-background/50 p-1.5 rounded-lg">
                          Lat: {editData.latitude.toFixed(4)}, Long: {editData.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-foreground font-500 bg-background/50 p-1.5 rounded-lg">{displayShop.location}</p>
                      {displayShop.latitude && displayShop.longitude && (
                        <p className="text-xs text-muted bg-background/50 p-1.5 rounded-lg">
                          Lat: {displayShop.latitude.toFixed(4)}, Long: {displayShop.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Footer with Buttons */}
            <div className="flex gap-2 p-2.5 md:p-4 border-t border-border bg-gradient-to-r from-background via-surface to-background flex-shrink-0">
              {viewOnly ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all cursor-pointer"
                >
                  Close
                </motion.button>
              ) : isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-2 md:px-3 py-2 text-white rounded-lg text-xs md:text-sm font-600 hover:shadow-lg transition-all flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-2 md:px-3 py-2 border-2 border-border rounded-lg text-xs md:text-sm font-600 text-foreground hover:bg-background hover:border-muted transition-all cursor-pointer"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    className="flex-1 px-2 md:px-3 py-2 text-white rounded-lg text-xs md:text-sm font-600 hover:shadow-lg transition-all flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#fa9233' }}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
