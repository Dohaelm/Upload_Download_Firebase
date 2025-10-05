import { initializeApp, getApps, cert, App } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

let adminApp: App

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    // Option 1: Using service account key file (recommended for development)
    // Download from Firebase Console > Project Settings > Service Accounts
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
    })

    // Option 2: Using service account JSON file path
    // Uncomment this and comment out Option 1 if you prefer using a JSON file
    /*
    adminApp = initializeApp({
      credential: cert(require("path/to/serviceAccountKey.json")),
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
    })
    */
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
    throw error
  }
} else {
  adminApp = getApps()[0]
}

// Export admin services
export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
export const adminStorage = getStorage(adminApp)

export default adminApp