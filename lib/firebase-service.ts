import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/firebase.config'

// CoffeeShop Model - Admin Panel Extended
// Mobile app only reads: name, address, latitude, longitude
// Admin panel can use imageUrl for display (mobile app ignores it)
export interface CoffeeShop {
  id: string          // Firestore document ID (not saved in data)
  name: string        // Required - mobile app reads this
  address: string     // Required - mobile app reads this
  latitude: number    // Required - mobile app reads this
  longitude: number   // Required - mobile app reads this
  imageUrl?: string   // Optional - for admin panel only (mobile app ignores)
  pictures?: string[] // Optional - array of picture URLs for admin panel
}

// EventModel matching Dart structure
export interface EventModel {
  id: string
  createdBy: string
  eventName: string
  description?: string
  location?: string
  latitude?: number
  longitude?: number
  cafeName?: string
  cafeAddress?: string
  cafeLatitude?: number
  cafeLongitude?: number
  eventDate: Date
  maxAttendees: number
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  attendeesCount?: number
}

// User Model - Matches Mobile App Structure (alphabetical order like Firebase)
export interface User {
  id: string                    // Firestore document ID (Firebase Auth UID)
  age?: number                  // User's age
  bio?: string                  // User biography
  createdAt?: number            // Timestamp in milliseconds
  email: string                 // User email (required)
  fcmToken?: string             // Firebase Cloud Messaging token for push notifications
  fullName: string              // User's full name (required)
  gender?: string               // Male, Female, Other
  interests?: string[]          // Array of interest names
  lastLocationUpdate?: number   // Timestamp of last location update
  latitude?: number             // Last known latitude
  longitude?: number            // Last known longitude
  profileImageUrl?: string      // Profile picture URL from Firebase Storage
  updatedAt?: number            // Timestamp in milliseconds
  username: string              // Username (required)
  // Admin panel display fields (not saved to Firestore)
  name: string                  // Display name (same as fullName) - ALWAYS SET
  avatar: string                // First letter (for admin panel display) - ALWAYS SET
  dateAdded: string             // Human readable date (admin panel only) - ALWAYS SET
}

// Interest Model
export interface Interest {
  id: string
  name: string
  dateAdded: string
}

// Review Model - For coffee shop reviews
export interface Review {
  id: string
  name: string                // Reviewer name
  country: string             // Country code/name (e.g., "US")
  rating: number              // 1-5 stars
  reviewText: string          // Review content
  createdAt?: number          // Timestamp
  updatedAt?: number          // Last updated timestamp
}

// ============ COFFEE SHOPS FUNCTIONS ============
export const coffeeShopService = {
  // Get all coffee shops
  async getAllShops(): Promise<CoffeeShop[]> {
    try {
      const snapshot = await getDocs(collection(db, 'coffeeShops'))
      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || '',
          address: data.address || '',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          imageUrl: data.imageUrl,  // For admin panel display
          pictures: data.pictures || (data.imageUrl ? [data.imageUrl] : []),  // Get pictures array
        }
      })
    } catch (error) {
      console.error('Error fetching coffee shops:', error)
      throw error
    }
  },

  // Get single coffee shop
  async getShopById(id: string): Promise<CoffeeShop | null> {
    try {
      const docRef = doc(db, 'coffeeShops', id)
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        const data = snapshot.data()
        return {
          id: snapshot.id,
          name: data.name || '',
          address: data.address || '',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          imageUrl: data.imageUrl,  // For admin panel display
          pictures: data.pictures || (data.imageUrl ? [data.imageUrl] : []),  // Get pictures array
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching coffee shop:', error)
      throw error
    }
  },

  // Create coffee shop
  async createShop(data: Omit<CoffeeShop, 'id'>): Promise<CoffeeShop> {
    try {
      // Save all provided fields (mobile app ignores imageUrl and pictures)
      const shopData: any = {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      }
      // Add imageUrl if provided (admin panel only)
      if (data.imageUrl) {
        shopData.imageUrl = data.imageUrl
      }
      // Add pictures array if provided (admin panel only)
      if (data.pictures && data.pictures.length > 0) {
        shopData.pictures = data.pictures
      }
      const docRef = await addDoc(collection(db, 'coffeeShops'), shopData)
      return {
        id: docRef.id,
        ...shopData,
      }
    } catch (error) {
      console.error('Error creating coffee shop:', error)
      throw error
    }
  },

  // Update coffee shop
  async updateShop(id: string, data: Partial<CoffeeShop>): Promise<void> {
    try {
      const docRef = doc(db, 'coffeeShops', id)
      const updateData: any = {}
      // Add provided fields
      if (data.name !== undefined) updateData.name = data.name
      if (data.address !== undefined) updateData.address = data.address
      if (data.latitude !== undefined) updateData.latitude = data.latitude
      if (data.longitude !== undefined) updateData.longitude = data.longitude
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
      if (data.pictures !== undefined) updateData.pictures = data.pictures

      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating coffee shop:', error)
      throw error
    }
  },

  // Delete coffee shop
  async deleteShop(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'coffeeShops', id))
    } catch (error) {
      console.error('Error deleting coffee shop:', error)
      throw error
    }
  },
}









// ============ EVENTS FUNCTIONS ============
export const eventService = {
  // Get all events
  async getAllEvents(): Promise<EventModel[]> {
    try {
      console.log('getAllEvents: Fetching events from Firestore...')
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      console.log('getAllEvents: Got snapshot with', snapshot.docs.length, 'documents')
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate?.() || doc.data().eventDate,
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      })) as EventModel[]
      console.log('getAllEvents: Mapped events:', events)
      return events
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },



  // Get single event
  async getEventById(id: string): Promise<EventModel | null> {
    try {
      const docRef = doc(db, 'events', id)
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
          eventDate: snapshot.data().eventDate?.toDate(),
          createdAt: snapshot.data().createdAt?.toDate(),
          updatedAt: snapshot.data().updatedAt?.toDate(),
        } as EventModel
      }
      return null
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  // Create event
  async createEvent(data: Omit<EventModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventModel> {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, 'events'), {
        ...data,
        eventDate: Timestamp.fromDate(data.eventDate),
        createdAt: now,
        updatedAt: now,
      })
      return {
        id: docRef.id,
        ...data,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      }
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  // Update event
  async updateEvent(id: string, data: Partial<EventModel>): Promise<void> {
    try {
      const docRef = doc(db, 'events', id)
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now(),
      }
      if (data.eventDate) {
        updateData.eventDate = Timestamp.fromDate(data.eventDate)
      }
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'events', id))
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },
}

// ============ USERS FUNCTIONS ============
export const userService = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => {
        const data = doc.data()
        const fullName = data.fullName || data.email?.split('@')[0] || 'Unknown'
        return {
          id: doc.id,
          ...data,
          name: fullName,
          avatar: data.avatar || fullName.charAt(0).toUpperCase(),
          dateAdded: data.dateAdded || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        } as User
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get single user
  async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', id)
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        const data = snapshot.data()
        const fullName = data.fullName || data.email?.split('@')[0] || 'Unknown'
        return {
          id: snapshot.id,
          ...data,
          name: fullName,
          avatar: data.avatar || fullName.charAt(0).toUpperCase(),
          dateAdded: data.dateAdded || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        } as User
      }
      return null
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  // Create user
  async createUser(data: Omit<User, 'id'>): Promise<User> {
    try {
      // Remove admin-only fields before saving
      const { name, avatar, dateAdded, ...mobileAppData } = data

      const docRef = await addDoc(collection(db, 'users'), mobileAppData)
      const fullName = mobileAppData.fullName || mobileAppData.email?.split('@')[0] || 'Unknown'
      return {
        id: docRef.id,
        ...mobileAppData,
        name: fullName,
        avatar: fullName.charAt(0).toUpperCase(),
        dateAdded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      } as User
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  // Update user
  async updateUser(id: string, data: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, 'users', id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', id))
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },
}

// ========== INTERESTS FUNCTIONS ============
export const interestService = {
  // Get all interests
  async getAllInterests(): Promise<Interest[]> {
    try {
      const q = query(collection(db, 'interests'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interest[]
    } catch (error) {
      console.error('Error fetching interests:', error)
      throw error
    }
  },

  // Get single interest
  async getInterestById(id: string): Promise<Interest | null> {
    try {
      const docRef = doc(db, 'interests', id)
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as Interest
      }
      return null
    } catch (error) {
      console.error('Error fetching interest:', error)
      throw error
    }
  },

  // Create interest
  async createInterest(data: Omit<Interest, 'id'>): Promise<Interest> {
    try {
      const docRef = await addDoc(collection(db, 'interests'), {
        ...data,
        createdAt: Timestamp.now(),
      })
      return {
        id: docRef.id,
        ...data,
      }
    } catch (error) {
      console.error('Error creating interest:', error)
      throw error
    }
  },

  // Update interest
  async updateInterest(id: string, data: Partial<Interest>): Promise<void> {
    try {
      const docRef = doc(db, 'interests', id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.error('Error updating interest:', error)
      throw error
    }
  },

  // Delete interest
  async deleteInterest(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'interests', id))
    } catch (error) {
      console.error('Error deleting interest:', error)
      throw error
    }
  },
}

// ============ REVIEWS FUNCTIONS ============
export const reviewService = {
  // Get all reviews
  async getAllReviews(): Promise<Review[]> {
    try {
      console.log('getAllReviews: Fetching reviews from Firestore...')
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      console.log('getAllReviews: Got snapshot with', snapshot.docs.length, 'documents')
      const reviews = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          country: data.country,
          rating: data.rating,
          reviewText: data.reviewText,
          createdAt: data.createdAt?.toMillis?.() || data.createdAt,
          updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt,
        } as Review
      })
      console.log('getAllReviews: Mapped reviews:', reviews)
      return reviews
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  },

  // Get reviews for specific coffee shop
  async getReviewsByShopId(coffeeShopId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[]
    } catch (error) {
      console.error('Error fetching reviews for shop:', error)
      throw error
    }
  },

  // Get single review
  async getReviewById(id: string): Promise<Review | null> {
    try {
      const docRef = doc(db, 'reviews', id)
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as Review
      }
      return null
    } catch (error) {
      console.error('Error fetching review:', error)
      throw error
    }
  },

  // Create review
  async createReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    try {
      console.log('createReview: Starting to create review with data:', data)
      const now = Timestamp.now()
      console.log('createReview: Timestamp created:', now)
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      console.log('createReview: Document created with ID:', docRef.id)
      const result = {
        id: docRef.id,
        ...data,
        createdAt: now.toMillis(),
        updatedAt: now.toMillis(),
      }
      console.log('createReview: Returning:', result)
      return result
    } catch (error) {
      console.error('Error creating review:', error)
      console.error('Error details:', (error as any)?.code, (error as any)?.message)
      throw error
    }
  },

  // Update review
  async updateReview(id: string, data: Partial<Review>): Promise<void> {
    try {
      const docRef = doc(db, 'reviews', id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now().toMillis(),
      })
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  },

  // Delete review
  async deleteReview(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'reviews', id))
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  },
}
