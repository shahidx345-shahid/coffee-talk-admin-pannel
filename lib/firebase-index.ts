// Firebase services index - export all Firebase utilities from one place
export { default as app, auth, db, storage } from '@/firebase.config'
export { authService, type AuthUser } from '@/lib/firebase-auth'
export {
  coffeeShopService,
  eventService,
  userService,
  interestService,
  type CoffeeShop,
  type EventModel,
  type User,
  type Interest,
} from '@/lib/firebase-service'
export { firebaseStorageService } from '@/lib/firebase-storage'
export { firebaseQueryUtils } from '@/lib/firebase-query-utils'

// Combined service for convenience
export const firebaseServices = {
  auth: authService,
  coffeeShops: coffeeShopService,
  events: eventService,
  users: userService,
  interests: interestService,
  storage: firebaseStorageService,
  query: firebaseQueryUtils,
}

export default firebaseServices
