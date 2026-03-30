import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../services/firebase'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)
  const needsRoleSelection = ref(false)
  const pendingNewUser = ref(null)

  async function loginWithGoogle() {
    try {
      loading.value = true
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        // First time login - wait for role selection
        pendingNewUser.value = firebaseUser
        needsRoleSelection.value = true
      } else {
        const currentData = userSnap.data()
        
        // Exists - update the updatedAt timestamp and ensure balance exists
        const updates = { updatedAt: serverTimestamp() }
        if (currentData.balance === undefined) {
          updates.balance = currentData.role === 'seller' ? 0 : 2000
        }
        if (currentData.completedDeals === undefined) updates.completedDeals = 0
        if (currentData.rejectedDeals === undefined) updates.rejectedDeals = 0
        
        await updateDoc(userRef, updates)
        profile.value = { ...currentData, ...updates }
        user.value = firebaseUser
      }
      
      user.value = firebaseUser
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function completeRegistration(selectedRole) {
    if (!pendingNewUser.value) return;
    
    try {
      loading.value = true
      const firebaseUser = pendingNewUser.value
      const userRef = doc(db, 'users', firebaseUser.uid)
      
      const newProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: selectedRole,
        balance: selectedRole === 'seller' ? 0 : 2000,
        completedDeals: 0,
        rejectedDeals: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await setDoc(userRef, newProfile)
      profile.value = newProfile
      user.value = firebaseUser
      
      // Clear pending state
      pendingNewUser.value = null
      needsRoleSelection.value = false
      
    } catch (error) {
      console.error('Error completing registration:', error)
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
            const data = userSnap.data()
            // Legacy schema user fallback pattern
            if (data.balance === undefined) data.balance = 2000
            if (data.completedDeals === undefined) data.completedDeals = 0
            if (data.rejectedDeals === undefined) data.rejectedDeals = 0
            profile.value = data
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
      const updates = {
        displayName: displayName,
        phoneNumber: phoneNumber || null,
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(userRef, updates)
      
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

  return { user, profile, loading, needsRoleSelection, pendingNewUser, loginWithGoogle, completeRegistration, logout, initAuth, updateProfileData }
})
