// Simple Firebase Configuration Checker
const fs = require('fs');
const path = require('path');

console.log('🔍 FIREBASE DATA LOADING DIAGNOSTIC\n');
console.log('='.repeat(60));

// Test 1: Environment Variables
console.log('\n📋 TEST 1: Checking .env.local file...\n');

try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim();
        }
    });

    const projectId = envVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
    const authDomain = envVars['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'];
    const apiKey = envVars['NEXT_PUBLIC_FIREBASE_API_KEY'];

    console.log('   ✅ .env.local file found');
    console.log('   📌 Project ID:', projectId || '❌ NOT FOUND');
    console.log('   📌 Auth Domain:', authDomain || '❌ NOT FOUND');
    console.log('   📌 API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : '❌ NOT FOUND');

    if (projectId !== 'coffeetalk-staging') {
        console.log('\n   ⚠️  WARNING: Project ID mismatch!');
        console.log('      Current:', projectId);
        console.log('      Expected: coffeetalk-staging or coffee-talk-android');
    }

} catch (error) {
    console.log('   ❌ Error reading .env.local:', error.message);
}

// Test 2: Firestore Rules
console.log('\n📋 TEST 2: Checking firestore.rules...\n');

try {
    const rulesPath = path.join(__dirname, 'firestore.rules');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    const hasUserRead = rulesContent.includes('match /users') && rulesContent.includes('allow read: if true');
    const hasEventsRead = rulesContent.includes('match /events') && rulesContent.includes('allow read: if true');
    const hasShopsRead = rulesContent.includes('match /coffeeShops') && rulesContent.includes('allow read: if true');

    console.log('   ✅ firestore.rules file found');
    console.log('   📌 Users read access:', hasUserRead ? '✅ Allowed' : '❌ Restricted');
    console.log('   📌 Events read access:', hasEventsRead ? '✅ Allowed' : '❌ Restricted');
    console.log('   📌 Shops read access:', hasShopsRead ? '✅ Allowed' : '❌ Restricted');

    console.log('\n   ⚠️  IMPORTANT: Rules in this file must be deployed to Firebase!');
    console.log('      Run: firebase deploy --only firestore:rules');

} catch (error) {
    console.log('   ❌ Error reading firestore.rules:', error.message);
}

// Test 3: Firestore Indexes
console.log('\n📋 TEST 3: Checking firestore.indexes.json...\n');

try {
    const indexesPath = path.join(__dirname, 'firestore.indexes.json');
    const indexesContent = fs.readFileSync(indexesPath, 'utf8');
    const indexes = JSON.parse(indexesContent);

    console.log('   ✅ firestore.indexes.json file found');
    console.log('   📌 Total indexes defined:', indexes.indexes?.length || 0);

    const collections = indexes.indexes?.map(idx => idx.collectionGroup) || [];
    console.log('   📌 Indexed collections:', collections.join(', '));

    console.log('\n   ⚠️  IMPORTANT: Indexes must be deployed to Firebase!');
    console.log('      Run: firebase deploy --only firestore:indexes');

} catch (error) {
    console.log('   ❌ Error reading firestore.indexes.json:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('\n🎯 MOST LIKELY CAUSES OF YOUR ISSUE:\n');

console.log('1️⃣  Firestore Rules NOT Deployed (Most Common) ⭐');
console.log('   - You have the rules file, but they may not be deployed to Firebase');
console.log('   - Solution: Run "firebase deploy --only firestore:rules"\n');

console.log('2️⃣  Firestore Indexes NOT Created');
console.log('   - orderBy queries require indexes to be built');
console.log('   - Solution: Run "firebase deploy --only firestore:indexes"\n');

console.log('3️⃣  Wrong Firebase Project');
console.log('   - Your .env.local might be pointing to wrong project');
console.log('   - Check Firebase Console to verify project has data\n');

console.log('4️⃣  No Data in Collections');
console.log('   - Collections might be empty');
console.log('   - Check Firebase Console > Firestore Database\n');

console.log('5️⃣  Browser Cache Issue');
console.log('   - Old cached files might be causing issues');
console.log('   - Solution: Hard refresh (Ctrl+Shift+R) or clear cache\n');

console.log('='.repeat(60));
console.log('\n✨ QUICK FIX STEPS:\n');

console.log('Step 1: Check Firebase Console');
console.log('   → Open: https://console.firebase.google.com/project/coffeetalk-staging/firestore');
console.log('   → Verify you see data in: users, events, coffeeShops, interests\n');

console.log('Step 2: Deploy Firestore Configuration (if you have Firebase CLI)');
console.log('   → Run: firebase deploy --only firestore\n');

console.log('Step 3: Check Browser Console');
console.log('   → Open http://localhost:3000');
console.log('   → Press F12 to open DevTools');
console.log('   → Check Console tab for red errors\n');

console.log('Step 4: Check Network Tab');
console.log('   → In DevTools, go to Network tab');
console.log('   → Refresh page');
console.log('   → Look for failed requests to firestore.googleapis.com\n');

console.log('='.repeat(60));
console.log('\n💡 Need to check something specific? Let me know!');
console.log('   I can help with:');
console.log('   - Deploying Firestore rules');
console.log('   - Checking Firebase Console');
console.log('   - Verifying your data structure');
console.log('   - Browser console errors\n');
