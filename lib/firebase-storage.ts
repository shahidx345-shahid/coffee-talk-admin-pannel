import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/firebase.config'

export const firebaseStorageService = {
  // Upload image to Firebase Storage
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`)
      const snapshot = await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  // Delete image from Firebase Storage
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl) return
      const fileRef = ref(storage, imageUrl)
      await deleteObject(fileRef)
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  },



  
  // Upload coffee shop image
  async uploadCoffeeShopImage(file: File): Promise<string> {
    return this.uploadImage(file, 'coffee-shops')
  },

  // Upload event image
  async uploadEventImage(file: File): Promise<string> {
    return this.uploadImage(file, 'events')
  },

  // Upload user avatar
  async uploadUserAvatar(file: File): Promise<string> {
    return this.uploadImage(file, 'users/avatars')
  },
}
