import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA_mock_key_for_local_dev',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'rephonex-mock.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'rephonex-mock',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'rephonex-mock.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
}

let auth = null
let db = null
let storage = null

try {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} catch (error) {
  console.warn("Firebase initialization failed, likely running without valid config:", error)
}

export { auth, db, storage }
