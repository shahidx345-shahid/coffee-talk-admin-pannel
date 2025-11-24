import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase config from Coffee Talk Android app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Disable offline persistence to avoid connection issues
if (typeof window !== 'undefined') {
  try {
    import('firebase/firestore').then(({ disableNetwork }) => {
      // Just initialize without offline persistence
    })
  } catch (error) {
    console.error('Firebase config error:', error)
  }
}

// Optional: Connect to Firebase Emulator Suite for development
// DISABLED - Using production Firebase for admin panel
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080)
//     connectStorageEmulator(storage, 'localhost', 9199)
//   } catch (error) {
//     // Emulator already connected or not available
//     console.log('Firebase Emulator not available:', error)
//   }
// }

export default app
