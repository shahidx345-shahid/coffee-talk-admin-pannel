# How to Navigate to Firestore Rules (Not Storage Rules!)

## 🎯 Direct Link (Easiest Method)
**Click this link to go directly to Firestore Rules:**
https://console.firebase.google.com/project/coffeetalk-staging/firestore/rules

---

## 📍 Manual Navigation (Alternative Method)

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/

### Step 2: Select Your Project
Click on: **coffeetalk-staging**

### Step 3: Find "Firestore Database" in Left Sidebar
Look for the icon that looks like a database/cylinder (🗄️)
- **CLICK**: "Firestore Database" 
- **NOT**: "Storage" (which has a folder icon 📁)
- **NOT**: "Realtime Database"

### Step 4: Click "Rules" Tab
At the top of the page, you'll see tabs:
- Data
- Rules ← **CLICK THIS**
- Indexes
- Usage

### Step 5: Verify You're in the Right Place
The rules editor should show:
```
rules_version = '2';
service cloud.firestore {  ← Look for this line!
```

**NOT:**
```
service firebase.storage {  ← This is WRONG (Storage rules)
```

---

## ✅ What You Should See

### Current Page Indicators:
- Page title: "Firestore Database"
- Breadcrumb: "Project Overview > Firestore Database > Rules"
- First line of rules: `service cloud.firestore {`

### What You're Currently Seeing (WRONG page):
- Page title: "Storage"
- Breadcrumb: "Project Overview > Storage > Rules"  
- First line of rules: `service firebase.storage {`

---

## 🔄 Visual Difference

**Storage (Current - WRONG):**
```
service firebase.storage {
  match /b/{bucket}/o {
    ...
  }
}
```

**Firestore Database (Needed - CORRECT):**
```
service cloud.firestore {
  match /databases/{database}/documents {
    ...
  }
}
```

---

## 🚀 Once You're on the Correct Page

Copy and paste these **Firestore** rules:

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

Then click **"Publish"** at the top right.

---

## 🎯 Direct Link (Recommended)
**Just click this:**
https://console.firebase.google.com/project/coffeetalk-staging/firestore/rules

This will take you DIRECTLY to the Firestore Rules page!
