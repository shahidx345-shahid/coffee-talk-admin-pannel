'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Trash2, Edit2, Save, X, Upload, Eye, MapPin, Loader } from 'lucide-react'
import { LoadingTable } from './loading'
import { Header } from './header'
import { ShopOverlay } from './shop-overlay'
import { ShopDeleteOverlay } from './shop-delete-overlay'
import { coffeeShopService } from '@/lib/firebase-service'
import { firebaseStorageService } from '@/lib/firebase-storage'

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

export function CoffeeShops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shops = await coffeeShopService.getAllShops()
        const mappedShops: Shop[] = shops.map((shop: any) => ({
          id: shop.id,
          picture: shop.imageUrl || '',
          pictures: shop.pictures || [shop.imageUrl || ''],
          title: shop.name,
          name: shop.name,
          location: shop.address,
          imageUrl: shop.imageUrl,
          latitude: shop.latitude,
          longitude: shop.longitude
        }))
        setShops(mappedShops)
      } catch (error) {
        console.error('Error fetching shops:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchShops()
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ 
    imageFile: null as File | null, 
    title: '', 
    location: '', 
    imagePreview: '',
    pictures: [] as string[],  // Array to store multiple pictures
    latitude: 0,
    longitude: 0
  })
  const [editData, setEditData] = useState({ picture: '', title: '', location: '' })
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [isShopOverlayOpen, setIsShopOverlayOpen] = useState(false)
  const [isShopEditOverlayOpen, setIsShopEditOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ name: string; lat: number; lon: number }>>([])
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

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
      console.warn('Error getting location name:', error instanceof Error ? error.message : 'Location reverse geocoding failed')
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

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

  const handleGetLiveLocationForAddShop = async () => {
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
          
          setFormData({
            ...formData,
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
      console.error('Error in handleGetLiveLocationForAddShop:', error)
      setIsGettingLocation(false)
    }
  }
  const handleAddShop = async () => {
    if (!formData.title || !formData.location || formData.pictures.length === 0) {
      alert('Please add at least one picture, title, and location')
      return
    }

    setIsUploading(true)
    try {
      // Create shop in Firestore with all pictures
      const newShopData = {
        name: formData.title,
        address: formData.location,
        latitude: formData.latitude || 0,
        longitude: formData.longitude || 0,
        pictures: formData.pictures,     // All pictures in array (no redundant imageUrl)
      }

      const newShop = await coffeeShopService.createShop(newShopData)

      const mappedShop: Shop = {
        id: newShop.id,
        picture: newShop.pictures?.[0] || '',
        pictures: newShop.pictures || [],
        title: newShop.name,
        name: newShop.name,
        location: newShop.address,
        imageUrl: newShop.pictures?.[0] || '',
        latitude: newShop.latitude,
        longitude: newShop.longitude
      }

      setShops([mappedShop, ...shops])
      setFormData({ imageFile: null, title: '', location: '', imagePreview: '', pictures: [], latitude: 0, longitude: 0 })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding shop:', error)
      alert('Error adding shop: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteShop = async (id: string) => {
    try {
      await coffeeShopService.deleteShop(id)
      setShops(shops.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting shop:', error)
      alert('Error deleting shop: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleEditStart = (shop: Shop) => {
    setSelectedShop(shop)
    setIsShopOverlayOpen(true)
  }

  const handleEditSave = async (id: string) => {
    if (editData.picture && editData.title && editData.location) {
      try {
        // Use Firebase service instead of API
        await coffeeShopService.updateShop(id, {
          name: editData.title,
          address: editData.location,
        })

        setShops(shops.map(s => s.id === id ? { ...s, ...editData, name: editData.title } : s))
        setEditingId(null)
      } catch (error) {
        console.error('Error updating shop:', error)
        alert('Error updating shop: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const handleEditShopFromOverlay = async (updatedShop: Shop) => {
    try {
      // Save pictures array and other data to Firebase
      await coffeeShopService.updateShop(updatedShop.id, {
        name: updatedShop.title,
        address: updatedShop.location,
        latitude: updatedShop.latitude || 0,
        longitude: updatedShop.longitude || 0,
        pictures: updatedShop.pictures || [updatedShop.picture],
      })

      setShops(shops.map(s => s.id === updatedShop.id ? updatedShop : s))
      setIsShopEditOverlayOpen(false)
      setSelectedShop(null)
    } catch (error) {
      console.error('Error updating shop:', error)
      alert('Error updating shop: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="flex-1 flex flex-col">
      <Header
        breadcrumb={['Coffee Admin', 'Coffee Shops']}
        title="Coffee Shops"
        action={
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-white rounded-lg font-500 text-xs md:text-sm whitespace-nowrap transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#fa9233' }}
          >
            <Plus size={18} />
            Add Shop
          </motion.button>
        }
      />

      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="space-y-4 md:space-y-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-border rounded-lg text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
              />
            </div>

            <div className="border border-border rounded-lg overflow-x-auto">
              {isLoading ? (
                <LoadingTable />
              ) : filteredShops.length === 0 ? (
                <div className="p-8 text-center text-muted">No shops yet. Create one to get started!</div>
              ) : (
                <table className="w-full text-xs md:text-sm min-w-max md:min-w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Picture</th>
                      <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Title</th>
                      <th className="px-3 md:px-4 py-3 text-left font-600 hidden md:table-cell text-foreground">Location</th>
                      <th className="px-3 md:px-4 py-3 text-center font-600 text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredShops.map((shop, idx) => (
                        <motion.tr
                          key={shop.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border hover:bg-surface/50 transition"
                        >
                          <td className="px-3 md:px-4 py-4">
                            {editingId === shop.id ? (
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onload = (event) => {
                                        setEditData({ ...editData, picture: event.target?.result as string })
                                      }
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                  className="hidden"
                                />
                                <div className="w-12 h-12 bg-surface rounded-lg border-2 border-blue flex items-center justify-center hover:bg-background transition">
                                  {editData.picture && editData.picture.startsWith('data:') ? (
                                    <img src={editData.picture} alt="Shop" className="w-full h-full object-cover rounded" />
                                  ) : (
                                    <span className="text-xs text-muted">Upload</span>
                                  )}
                                </div>
                              </label>
                            ) : (
                              <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden flex items-center justify-center">
                                {shop.imageUrl ? (
                                  <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-surface flex items-center justify-center text-muted text-xs">No Image</div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-3 md:px-4 py-4">
                            {editingId === shop.id ? (
                              <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full px-2 py-1 border-2 border-blue rounded-lg text-xs md:text-sm focus:outline-none"
                              />
                            ) : (
                              <span className="font-500 text-foreground">{shop.title}</span>
                            )}
                          </td>
                          <td className="px-3 md:px-4 py-4 hidden md:table-cell">
                            {editingId === shop.id ? (
                              <input
                                type="text"
                                value={editData.location}
                                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                className="w-full px-2 py-1 border-2 border-blue rounded-lg text-xs md:text-sm focus:outline-none"
                              />
                            ) : (
                              <span className="text-foreground">{shop.location}</span>
                            )}
                          </td>
                          <td className="px-3 md:px-4 py-4">
                            <div className="flex items-center justify-center gap-1 md:gap-2">
                              {editingId === shop.id ? (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEditSave(shop.id)}
                                    className="p-1.5 md:p-2 hover:bg-green-500/10 rounded-lg transition text-green-600 cursor-pointer"
                                    title="Save"
                                  >
                                    <Save size={16} className="md:w-[18px] md:h-[18px]" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setEditingId(null)}
                                    className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500 cursor-pointer"
                                    title="Cancel"
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
                                      setSelectedShop(shop)
                                      setIsShopOverlayOpen(true)
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
                                      setSelectedShop(shop)
                                      setIsShopEditOverlayOpen(true)
                                    }}
                                    className="p-1.5 md:p-2 hover:bg-orange-500/10 rounded-lg transition cursor-pointer"
                                    style={{ color: '#fa9233' }}
                                    title="Edit"
                                  >
                                    <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      setSelectedShop(shop)
                                      setIsDeleteOpen(true)
                                    }}
                                    className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500 cursor-pointer"
                                    title="Delete"
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

        {/* Add Shop Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-16 md:mt-0"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="bg-background rounded-lg border border-border p-4 sm:p-6 shadow-xl w-full max-w-sm max-h-[calc(100vh-120px)] md:max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-bold text-foreground pr-2">Add New Shop</h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsModalOpen(false)}
                      className="p-1.5 hover:bg-surface rounded-lg transition flex-shrink-0 text-muted hover:text-foreground cursor-pointer"
                    >
                      <X size={18} />
                    </motion.button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleAddShop()
                    }}
                    className="space-y-4"
                  >
                    {/* Image Upload with Multiple Pictures Support */}
                    <div>
                      <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Pictures Upload ({formData.pictures.length})</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              try {
                                // Upload to Firebase Storage
                                const imageUrl = await firebaseStorageService.uploadCoffeeShopImage(file)
                                // Add to pictures array
                                setFormData((prev) => ({
                                  ...prev,
                                  pictures: [...prev.pictures, imageUrl],
                                  imagePreview: imageUrl  // Show latest as preview
                                }))
                              } catch (error) {
                                console.error('Error uploading image:', error)
                                alert('Error uploading image')
                              }
                            }
                          }}
                          className="hidden"
                          id="shop-image-upload"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="shop-image-upload"
                          className="flex items-center justify-center w-full px-3 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-blue hover:bg-blue/5 transition"
                        >
                          <div className="text-center">
                            <Upload size={24} className="mx-auto mb-2 text-muted" />
                            <p className="text-xs sm:text-sm font-500 text-foreground">Click to upload image</p>
                            <p className="text-xs text-muted">or drag and drop</p>
                          </div>
                        </label>
                      </div>
                      
                      {/* Picture Thumbnails */}
                      {formData.pictures.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-500 text-muted">Uploaded pictures: {formData.pictures.length}</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.pictures.map((pic, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={pic}
                                  alt={`Picture ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-border"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({
                                    ...prev,
                                    pictures: prev.pictures.filter((_, i) => i !== index)
                                  }))}
                                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                  disabled={isUploading}
                                >
                                  <X size={12} />
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                        placeholder="e.g. Premium Coffee"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Location</label>
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={locationInput}
                            onChange={handleLocationChange}
                            onFocus={() => setShowLocationSuggestions(true)}
                            placeholder="Search location (e.g., Tokyo, New York)..."
                            className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
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
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handleGetLiveLocationForAddShop}
                          disabled={isGettingLocation || isUploading}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-white font-500 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#0066cc' }}
                        >
                          {isGettingLocation ? (
                            <>
                              <Loader size={16} className="animate-spin" />
                              <span>Getting Location...</span>
                            </>
                          ) : (
                            <>
                              <MapPin size={16} />
                              <span>Get Live Location</span>
                            </>
                          )}
                        </motion.button>
                        {formData.latitude !== 0 && formData.longitude !== 0 && (
                          <p className="text-xs text-muted bg-surface/50 p-2 rounded-lg">
                            Lat: {formData.latitude.toFixed(4)}, Long: {formData.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <motion.button
                        whileHover={formData.pictures.length === 0 ? {} : { scale: 1.02 }}
                        whileTap={formData.pictures.length === 0 ? {} : { scale: 0.98 }}
                        type="submit"
                        disabled={formData.pictures.length === 0 || !formData.title || !formData.location || isUploading}
                        className="flex-1 px-4 py-2.5 text-white rounded-lg font-600 text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: '#fa9233',
                          opacity: formData.pictures.length === 0 || !formData.title || !formData.location || isUploading ? 0.5 : 1,
                          cursor: formData.pictures.length === 0 || !formData.title || !formData.location || isUploading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isUploading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {isUploading ? 'Adding Shop...' : 'Add Shop'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false)
                          setFormData({ imageFile: null, title: '', location: '', imagePreview: '', pictures: [], latitude: 0, longitude: 0 })
                        }}
                        disabled={isUploading}
                        className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg font-600 text-xs sm:text-sm hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
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
      </div>

      <ShopOverlay
        shop={selectedShop}
        isOpen={isShopOverlayOpen}
        onClose={() => {
          setIsShopOverlayOpen(false)
          setSelectedShop(null)
        }}
        viewOnly={true}
      />
      <ShopOverlay
        shop={selectedShop}
        isOpen={isShopEditOverlayOpen}
        onClose={() => {
          setIsShopEditOverlayOpen(false)
          setSelectedShop(null)
        }}
        onEdit={handleEditShopFromOverlay}
        viewOnly={false}
      />
      <ShopDeleteOverlay
        shop={selectedShop}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedShop(null)
        }}
        onConfirm={handleDeleteShop}
      />
    </>
  )
}
