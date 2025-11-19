'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react'
import { Header } from './header'
import { AddUserModal } from './add-user-modal'
import { UserOverlay } from './user-overlay'
import { UserDeleteOverlay } from './user-delete-overlay'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  lastActive: string
  dateAdded: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Florence Shaw',
      email: 'florence@untitleudi.com',
      avatar: '👩‍🦰',
      lastActive: 'Mar 4, 2024',
      dateAdded: 'July 4, 2022',
    },
    {
      id: '2',
      name: 'Amelie Laurent',
      email: 'amelie@untitleudi.com',
      avatar: '👩',
      lastActive: 'Mar 4, 2024',
      dateAdded: 'July 4, 2022',
    },
    {
      id: '3',
      name: 'Ammar Foley',
      email: 'ammar@untitleudi.com',
      avatar: '👨',
      lastActive: 'Mar 2, 2024',
      dateAdded: 'July 4, 2022',
    },
    {
      id: '4',
      name: 'Caitlyn King',
      email: 'caitlyn@untitleudi.com',
      avatar: '👱‍♀️',
      lastActive: 'Mar 6, 2024',
      dateAdded: 'July 4, 2022',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [isUserOverlayOpen, setIsUserOverlayOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddUser = (newUserData: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserData.name,
      email: newUserData.email,
      avatar: newUserData.name.charAt(0).toUpperCase(),
      lastActive: 'Now',
      dateAdded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    setUsers([...users, newUser])
    setIsModalOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId))
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
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-white rounded-lg font-500 text-xs md:text-sm whitespace-nowrap transition hover:opacity-90"
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
              className="px-3 py-2.5 border border-border rounded-lg text-sm font-500 text-foreground hover:bg-surface transition flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>

          {/* Table - Responsive */}
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-max md:min-w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-3 md:px-4 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground">User name</th>
                  <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground hidden sm:table-cell">Last active</th>
                  <th className="px-3 md:px-4 py-3 text-left font-600 text-foreground hidden md:table-cell">Date added</th>
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
                      <input type="checkbox" className="rounded" />
                    </td>
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
                    <td className="px-3 md:px-4 py-4 text-sm text-foreground hidden sm:table-cell">{user.lastActive}</td>
                    <td className="px-3 md:px-4 py-4 text-sm text-foreground hidden md:table-cell">{user.dateAdded}</td>
                    <td className="px-3 md:px-4 py-4">
                      <div className="flex items-center justify-center gap-1 md:gap-2">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedUser(user)
                            setIsUserOverlayOpen(true)
                          }}
                          className="p-1.5 md:p-2 hover:bg-blue/10 rounded-lg transition"
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
                          className="p-1.5 md:p-2 hover:bg-orange-500/10 rounded-lg transition"
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
                          className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition text-red-500"
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
        onEdit={(updatedUser) => {
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
          setIsUserOverlayOpen(false)
          setSelectedUser(null)
        }}
      />
      <UserOverlay
        user={selectedUser}
        isOpen={isOverlayOpen}
        onClose={() => {
          setIsOverlayOpen(false)
          setSelectedUser(null)
        }}
        onEdit={(updatedUser) => {
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
          setIsOverlayOpen(false)
          setSelectedUser(null)
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




