'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Trash2, Edit2, Save, X, Upload } from 'lucide-react'
import { Header } from './header'
import { ShopOverlay } from './shop-overlay'
import { ShopDeleteOverlay } from './shop-delete-overlay'

interface Shop {
  id: string
  picture: string
  title: string
  name: string
  location: string
}

export function CoffeeShops() {
  const [shops, setShops] = useState<Shop[]>([
    { id: '1', picture: '☕', title: 'Premium Coffee', name: 'Brew Haven', location: 'Downtown' },
    { id: '2', picture: '🍵', title: 'Tea & Coffee', name: 'Espresso Express', location: 'Business Park' },
    { id: '3', picture: '☕', title: 'Classic Café', name: 'Coffee Corner', location: 'Mall' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ picture: '', title: '', location: '' })
  const [editData, setEditData] = useState({ picture: '', title: '', location: '' })
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [isShopOverlayOpen, setIsShopOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddShop = () => {
    if (formData.picture && formData.title && formData.location) {
      const newShop: Shop = {
        id: Date.now().toString(),
        picture: formData.picture,
        title: formData.title,
        name: formData.title, // Use title as name
        location: formData.location
      }
      setShops([...shops, newShop])
      setFormData({ picture: '', title: '', location: '' })
      setIsModalOpen(false)
    }
  }

  const handleDeleteShop = (id: string) => {
    setShops(shops.filter(s => s.id !== id))
  }

  const handleEditStart = (shop: Shop) => {
    setSelectedShop(shop)
    setIsShopOverlayOpen(true)
  }

  const handleEditSave = (id: string) => {
    if (editData.picture && editData.title && editData.location) {
      setShops(shops.map(s => s.id === id ? { ...s, ...editData, name: editData.title } : s))
      setEditingId(null)
    }
  }

  const handleEditShopFromOverlay = (updatedShop: Shop) => {
    setShops(shops.map(s => s.id === updatedShop.id ? updatedShop : s))
    setIsShopOverlayOpen(false)
    setSelectedShop(null)
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
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-white rounded-lg font-500 text-xs md:text-sm whitespace-nowrap transition hover:opacity-90"
            style={{ backgroundColor: '#fa9233' }}
          >
            <Plus size={18} />
            Add shop
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
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground transition"
            />
          </div>

          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-max md:min-w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-3 md:px-4 py-3 text-left font-600">Picture</th>
                  <th className="px-3 md:px-4 py-3 text-left font-600">Title</th>
                  <th className="px-3 md:px-4 py-3 text-left font-600 hidden md:table-cell">Location</th>
                  <th className="px-3 md:px-4 py-3 text-center font-600">Actions</th>
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
                            {shop.picture && shop.picture.startsWith('data:') ? (
                              <img src={shop.picture} alt={shop.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">{shop.picture}</span>
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
                      <td className="px-3 md:px-4 py-4">
                        {editingId === shop.id ? (
                          <input
                            type="text"
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className="w-full px-2 py-1 border-2 border-blue rounded-lg text-xs md:text-sm focus:outline-none"
                          />
                        ) : (
                          <span className="text-muted">{shop.location}</span>
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
                                className="p-1.5 md:p-2 hover:bg-green-500/10 rounded-lg transition text-green-600"
                                title="Save"
                              >
                                <Save size={16} className="md:w-[18px] md:h-[18px]" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditingId(null)}
                                className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500"
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
                                onClick={() => handleEditStart(shop)}
                                className="p-1.5 md:p-2 hover:bg-orange-500/10 rounded-lg transition"
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
                                className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500"
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-background rounded-lg border border-border p-4 sm:p-6 shadow-xl w-full max-w-sm max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-foreground pr-2">Add New Shop</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 hover:bg-surface rounded-lg transition flex-shrink-0 text-muted hover:text-foreground"
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
                  {/* Image Upload with Preview */}
                  <div>
                    <label className="block text-xs sm:text-sm font-600 text-foreground mb-2 uppercase tracking-wide">Picture Upload</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setFormData({ ...formData, picture: event.target?.result as string })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="hidden"
                        id="shop-image-upload"
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
                    {formData.picture && typeof formData.picture === 'string' && formData.picture.startsWith('data:') && (
                      <div className="mt-3 relative">
                        <img
                          src={formData.picture}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border border-border"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setFormData({ ...formData, picture: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </motion.button>
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
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 border-2 border-border rounded-lg text-xs sm:text-sm bg-background focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/20 transition"
                      placeholder="e.g. Downtown"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <motion.button
                      whileHover={!formData.picture ? {} : { scale: 1.02 }}
                      whileTap={!formData.picture ? {} : { scale: 0.98 }}
                      type="submit"
                      disabled={!formData.picture}
                      className="flex-1 px-4 py-2.5 text-white rounded-lg font-600 text-xs sm:text-sm transition-all"
                      style={{ 
                        backgroundColor: '#fa9233',
                        opacity: !formData.picture ? 0.5 : 1,
                        cursor: !formData.picture ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Add Shop
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false)
                        setFormData({ picture: '', title: '', location: '' })
                      }}
                      className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-lg font-600 text-xs sm:text-sm hover:bg-surface transition-colors"
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
      onEdit={handleEditShopFromOverlay}
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
