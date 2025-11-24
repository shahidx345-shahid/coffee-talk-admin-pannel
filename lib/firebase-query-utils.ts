import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  startAfter,
  QueryConstraint,
  DocumentSnapshot,
  getCountFromServer,
} from 'firebase/firestore'
import { db } from '@/firebase.config'

// Advanced query utilities for Firestore
export const firebaseQueryUtils = {
  // Search across multiple fields
  async searchDocuments(
    collectionName: string,
    searchTerm: string,
    searchFields: string[],
    pageSize = 10
  ) {
    try {
      const results: any[] = []
      
      for (const field of searchFields) {
        const q = query(
          collection(db, collectionName),
          where(field, '>=', searchTerm),
          where(field, '<=', searchTerm + '\uf8ff'),
          limit(pageSize)
        )
        
        const snapshot = await getDocs(q)
        results.push(
          ...snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      }
      
      // Remove duplicates
      return results.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      )
    } catch (error) {
      console.error('Error searching documents:', error)
      throw error
    }
  },

  // Get documents count
  async getCollectionCount(collectionName: string): Promise<number> {
    try {
      const q = query(collection(db, collectionName))
      const snapshot = await getCountFromServer(q)
      return snapshot.data().count
    } catch (error) {
      console.error('Error getting collection count:', error)
      throw error
    }
  },

  // Get paginated documents
  async getPaginatedDocuments(
    collectionName: string,
    pageSize = 10,
    startAfterDoc?: DocumentSnapshot
  ) {
    try {
      let q
      
      if (startAfterDoc) {
        q = query(
          collection(db, collectionName),
          orderBy('createdAt', 'desc'),
          startAfter(startAfterDoc),
          limit(pageSize + 1) // Get one extra to check if there are more pages
        )
      } else {
        q = query(
          collection(db, collectionName),
          orderBy('createdAt', 'desc'),
          limit(pageSize + 1)
        )
      }
      
      const snapshot = await getDocs(q)
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return {
        data: docs.slice(0, pageSize),
        hasMore: docs.length > pageSize,
        lastDoc: snapshot.docs[Math.min(pageSize - 1, snapshot.docs.length - 1)]
      }
    } catch (error) {
      console.error('Error getting paginated documents:', error)
      throw error
    }
  },

  // Filter documents by multiple conditions
  async filterDocuments(
    collectionName: string,
    constraints: QueryConstraint[]
  ) {
    try {
      const q = query(collection(db, collectionName), ...constraints)
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error filtering documents:', error)
      throw error
    }
  },
}

export default firebaseQueryUtils
