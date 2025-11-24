'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react'
import { Header } from './header'
import { AddUserModal } from './add-user-modal'
import { UserOverlay } from './user-overlay'
import { UserDeleteOverlay } from './user-delete-overlay'
import { LoadingTable } from './loading'
import { userService, type User } from '@/lib/firebase-service'

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getAllUsers()
        const mappedUsers: User[] = users.map((user) => {
          // Generate avatar if not present: first letter of name or email
          const avatarLetter = user.avatar ||
            (user.fullName ? user.fullName.charAt(0).toUpperCase() :
              user.email ? user.email.charAt(0).toUpperCase() : '?')

          return {
            id: user.id,
            email: user.email,
            fullName: user.fullName || user.email?.split('@')[0] || 'Unknown',
            username: user.username || user.fullName || user.email?.split('@')[0] || 'Unknown',
            // Additional user details from database
            age: user.age,
            bio: user.bio,
            gender: user.gender,
            interests: user.interests,
            latitude: user.latitude,
            longitude: user.longitude,
            profileImageUrl: user.profileImageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            // Display fields
            name: user.fullName || user.email?.split('@')[0] || 'Unknown',  // Always a string
            avatar: avatarLetter,
            dateAdded: user.dateAdded || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          }
        })
        setUsers(mappedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [isUserOverlayOpen, setIsUserOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddUser = async (newUserData: any) => {
    try {
      // Create a unique ID for the user (not using Firebase Auth UID)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = Date.now()

      // Create Firestore document with mobile app structure
      const { doc, setDoc } = await import('firebase/firestore')
      const { db } = await import('@/firebase.config')

      // Fields in alphabetical order (matching Firebase structure from mobile app)
      // Using all values from the add-user modal
      const userData = {
        age: newUserData.age || 18,
        bio: newUserData.bio || '',
        createdAt: now,
        email: newUserData.email,
        fcmToken: '',
        fullName: newUserData.name,
        gender: newUserData.gender || 'Other',
        interests: newUserData.interests || [],  // From modal interest selection
        lastLocationUpdate: now,
        latitude: newUserData.latitude || 0,  // From location search
        longitude: newUserData.longitude || 0,  // From location search
        profileImageUrl: '',  // Empty - user uploads profile picture in mobile app
        updatedAt: now,
        username: newUserData.username,  // From modal username field
        password: newUserData.password,  // Store for mobile app login
      }

      // Save to Firestore with generated userId as document ID
      // This keeps user data in Firestore only - NOT in Firebase Authentication
      await setDoc(doc(db, 'users', userId), userData)

      const mappedUser: User = {
        id: userId,
        email: userData.email,
        fullName: userData.fullName,
        username: userData.username,
        name: userData.fullName,  // For admin panel display
        avatar: userData.fullName.charAt(0).toUpperCase(),
        dateAdded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      }

      setUsers([mappedUser, ...users])
      setIsModalOpen(false)
      alert('User added successfully! All profile data has been saved. They can now use the mobile app.')
    } catch (error) {
      console.error('Error adding user:', error)
      alert('Error adding user: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        breadcrumb={['Coffee Admin', 'User management']}
        title="User management"
        action={
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-white rounded-lg font-500 text-xs md:text-sm whitespace-nowrap transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#fa9233' }}
          >
            <Plus size={18} />
            Add user
          </motion.button>
        }
      />

      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="space-y-4 md:space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-foreground transition"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2.5 border border-border rounded-lg text-sm font-500 text-foreground hover:bg-surface transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>

          {/* Table - Responsive */}
          <div className="border border-border rounded-lg overflow-x-auto">
            {isLoading ? (
              <LoadingTable />
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted">No users yet. Create one to get started!</div>
            ) : (
              <table className="w-full text-xs md:text-sm min-w-max md:min-w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">User name</th>
                    <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">Date added</th>
                    <th className="px-3 md:px-4 py-3 text-center font-600 text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-surface/50 transition"
                    >
                      <td className="px-3 md:px-4 py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface flex items-center justify-center text-sm md:text-lg flex-shrink-0">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="font-500 text-foreground truncate">{user.name}</div>
                            <div className="text-xs text-muted truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 py-4 text-xs md:text-sm text-foreground">{user.dateAdded}</td>
                      <td className="px-3 md:px-4 py-4">
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedUser(user)
                              setIsUserOverlayOpen(true)
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
                              setSelectedUser(user)
                              setIsOverlayOpen(true)
                            }}
                            className="p-1.5 md:p-2 hover:bg-orange-500/10 rounded-lg transition cursor-pointer"
                            style={{ color: '#fa9233' }}
                            title="Edit user"
                          >
                            <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteOpen(true)
                            }}
                            className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500 cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddUser} />
      <UserOverlay
        user={selectedUser}
        isOpen={isUserOverlayOpen}
        onClose={() => {
          setIsUserOverlayOpen(false)
          setSelectedUser(null)
        }}
        viewOnly={true}
      />
      <UserOverlay
        user={selectedUser}
        isOpen={isOverlayOpen}
        onClose={() => {
          setIsOverlayOpen(false)
          setSelectedUser(null)
        }}
        onEdit={async (updatedUser) => {
          // Save to Firebase using userService
          try {
            await userService.updateUser(updatedUser.id, {
              fullName: updatedUser.fullName,
              email: updatedUser.email,
              username: updatedUser.username,
              latitude: updatedUser.latitude || 0,
              longitude: updatedUser.longitude || 0,
              updatedAt: Date.now()
            })
            // Update local state after successful save
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
          } catch (error) {
            console.error('Error updating user:', error)
            alert('Error updating user: ' + (error instanceof Error ? error.message : 'Unknown error'))
          }
        }}
      />
      <UserDeleteOverlay
        user={selectedUser}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}




