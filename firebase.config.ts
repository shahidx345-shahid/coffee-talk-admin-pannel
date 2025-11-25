import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Validate environment variables - only check on client side
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

// Only validate if running in browser
if (typeof window !== 'undefined') {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('❌ Missing Firebase environment variables:', missingVars)
    console.error('Please check your .env.local file')
  }
}

// Firebase config from Coffee Talk Android app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Log configuration status (without sensitive data)
console.log('🔥 Firebase Config Status:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
})

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
  console.log('✅ Firebase app initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  throw error
}

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Enable persistence for auth
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('✅ Firebase auth persistence enabled')
    })
    .catch((error) => {
      console.error('❌ Firebase persistence error:', error)
    })
}

console.log('✅ Firebase services initialized:', {
  auth: 'ready',
  firestore: 'ready',
  storage: 'ready',
})

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
