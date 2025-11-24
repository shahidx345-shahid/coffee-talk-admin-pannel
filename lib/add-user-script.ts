import { db } from '@/firebase.config'
import { doc, setDoc } from 'firebase/firestore'

async function addUserToFirebase() {
  try {
    const userId = "fBrFBGpGQZO4uC1P5P69PDfIH8n2"
    const userData = {
      age: 0,
      bio: "",
      createdAt: 1762097688950,
      email: "awais@gmail.com",
      fcmToken: "",
      fullName: "Awais",
      gender: "Other",
      interests: ["💪 Fitness & Wellness", "🧘 Mindfulness"],
      lastLocationUpdate: 1762097898935,
      latitude: 31.4173821,
      longitude: 73.0740001,
      profileImageUrl: "",
      updatedAt: 1762097898935,
      username: "awais"
    }

    await setDoc(doc(db, 'users', userId), userData)
    console.log('User added successfully!')
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

// Call this function to add the user
addUserToFirebase()
