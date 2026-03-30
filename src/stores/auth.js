import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../services/firebase'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)

  async function loginWithGoogle(selectedRole = 'buyer') {
    try {
      loading.value = true
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        // First time login - create profile based on schema
        const newProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: selectedRole, // Set role strictly on first login
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
        await setDoc(userRef, newProfile)
        profile.value = newProfile
      } else {
        // Exists - update the updatedAt timestamp
        await updateDoc(userRef, {
          updatedAt: serverTimestamp()
        })
        profile.value = userSnap.data()
      }
      
      user.value = firebaseUser
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      loading.value = true
      await signOut(auth)
      user.value = null
      profile.value = null
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      loading.value = false
    }
  }

  function initAuth() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      loading.value = true
      if (firebaseUser) {
        user.value = firebaseUser
        try {
          const userRef = doc(db, 'users', firebaseUser.uid)
          const userSnap = await getDoc(userRef)
          if (userSnap.exists()) {
            profile.value = userSnap.data()
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        user.value = null
        profile.value = null
      }
      loading.value = false
    })
  }

  async function updateProfileData({ displayName, phoneNumber }) {
    if (!user.value) throw new Error("Not logged in")
    try {
      loading.value = true
      const userRef = doc(db, 'users', user.value.uid)
      await updateDoc(userRef, {
        displayName: displayName,
        phoneNumber: phoneNumber || null,
        updatedAt: serverTimestamp()
      })
      
      if (profile.value) {
        profile.value.displayName = displayName
        profile.value.phoneNumber = phoneNumber || null
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return { user, profile, loading, loginWithGoogle, logout, initAuth, updateProfileData }
})
