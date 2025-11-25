# Firebase Firestore Rules Deployment Guide

## Problem
The Firestore rules need to be deployed to Firebase to allow your admin panel to read data without authentication errors.

## Solution: Deploy Rules Manually via Firebase Console

Since Firebase CLI authentication isn't set up, deploy the rules manually:

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **coffeetalk-staging**
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top

### Step 2: Copy and Paste the New Rules
Replace the existing rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin collection - only authenticated admins
    match /admins/{adminId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Users collection - allow all reads, authenticated writes
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Coffee shops collection - allow all reads, authenticated writes
    match /coffeeShops/{shopId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Interests collection - allow all reads, authenticated writes
    match /interests/{interestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Events collection - allow all reads, authenticated writes
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }

    // Default deny rule for safety
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Publish the Rules
1. Click the **Publish** button in the Firebase Console
2. Confirm the deployment

### Step 4: Verify the Fix
1. Refresh your admin panel at http://localhost:3000
2. The "Missing or insufficient permissions" error should be resolved
3. Data should load successfully

## What Changed?

### Before (Problematic Rules)
- Used `{document=**}` which matches ALL documents recursively
- Made queries inefficient and caused permission errors

### After (Fixed Rules)
- Uses specific document IDs like `{userId}`, `{shopId}`, etc.
- Separates `create` from `update, delete` operations
- More efficient and precise permission checking
- Allows public reads, but requires authentication for writes

## Security Notes
- **Read Access**: Currently allows anyone to read data (good for admin panels)
- **Write Access**: Requires Firebase Authentication for ALL write operations
- **Admin Collection**: Requires authentication AND user must be modifying their own admin document

## Alternative: CLI Deployment (If you set up Firebase CLI)
```bash
# Login to Firebase
firebase login

# Set the project
firebase use coffeetalk-staging

# Deploy rules
firebase deploy --only firestore:rules
```

## Troubleshooting
If you still see permission errors after deploying:
1. Clear browser cache and refresh
2. Check the Firebase Console to confirm rules are published
3. Verify your `.env.local` has the correct Firebase credentials
4. Check browser console for specific error messages
