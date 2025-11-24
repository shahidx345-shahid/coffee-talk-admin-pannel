import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  Auth,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
} from 'firebase/auth'
import { auth } from '@/firebase.config'
import { userService } from './firebase-service'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date | null
}

export const authService = {
  // Current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata?.creationTime || null,
        })
      } else {
        callback(null)
      }
    })
  },

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (displayName) {
        await updateProfile(user, {
          displayName,
        })
      }

      // Create user document in Firestore
      await userService.createUser({
        id: user.uid,
        name: displayName || email.split('@')[0],
        email: email,
        avatar: user.photoURL || displayName?.charAt(0).toUpperCase() || 'A',
        dateAdded: new Date().toLocaleDateString('en-US'),
      })

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.metadata?.creationTime || null,
      }
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.metadata?.creationTime || null,
      }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error sending password reset email:', error)
      throw error
    }
  },

  // Update user profile
  async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName || auth.currentUser.displayName,
          photoURL: photoURL || auth.currentUser.photoURL,
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  // Update email
  async updateUserEmail(newEmail: string): Promise<void> {
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail)
      }
    } catch (error) {
      console.error('Error updating email:', error)
      throw error
    }
  },

  // Update password
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword)
      }
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  },

  // Get ID token
  async getIdToken(): Promise<string> {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken()
      }
      return ''
    } catch (error) {
      console.error('Error getting ID token:', error)
      throw error
    }
  },
}

export default authService
