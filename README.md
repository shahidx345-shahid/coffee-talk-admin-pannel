# Coffee Talk Admin Panel

Firebase-powered admin dashboard for managing the Coffee Talk mobile application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Create `.env.local` file with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Login
- **Username:** `admin`
- **Password:** `admin123`

---

## 📁 Project Structure

```
admin-dashboard/
├── app/                   # Next.js app directory
│   └── page.tsx          # Main dashboard page
├── components/           # UI components
│   ├── login-page.tsx
│   ├── user-management.tsx
│   ├── coffee-shops.tsx
│   └── interest-management.tsx
├── lib/                  # Firebase services
│   ├── firebase-service.ts
│   ├── firebase-auth.ts
│   └── firebase-storage.ts
├── firebase.config.ts    # Firebase initialization
└── .env.local           # Environment variables
```

---

## ✨ Features

- **User Management** - View, create, edit, delete users
- **Coffee Shop Management** - Manage coffee shops with images
- **Interest Management** - Manage available interests
- **Event Viewing** - View events created by users
- **Firebase Integration** - Authentication, Firestore, Storage

---

## 🔐 Security

- Passwords hashed automatically by Firebase Auth
- Firestore security rules require authentication for writes
- Storage rules protect user-uploaded content

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **UI:** React 18, TailwindCSS
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 📝 Firebase Collections

### Required Collections:
- `users/` - User profiles and data
- `coffeeShops/` - Coffee shop master list
- `interests/` - Interest master list
- `events/` - User-created events

---

## 🔄 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

---

## 📱 Mobile App Compatibility

This admin panel is fully compatible with the Coffee Talk mobile application:
- ✅ User data structure matches mobile app
- ✅ Coffee shops can be viewed in mobile app
- ✅ Interests available for user selection
- ✅ Shared Firebase backend

---

## 🐛 Troubleshooting

### Login Issues
- Ensure Firebase credentials are correct in `.env.local`
- Check Firebase Console → Authentication for admin user

### Data Not Showing
- Verify Firestore security rules allow reads
- Check Firebase Console for data in collections

---

## 📄 License

MIT
