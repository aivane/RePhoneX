import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../services/firebase'
import { collection, doc, addDoc, deleteDoc, updateDoc, onSnapshot, getDoc, serverTimestamp } from 'firebase/firestore'

export const useAuctionStore = defineStore('auction', () => {
  // Global network clock that ticks every second for sync
  const clock = ref(Date.now())
  setInterval(() => {
    clock.value = Date.now()
  }, 1000)

  // --- REACTIVE STATE ---
  const products = ref([])
  let unsubscribe = null

  const getProductById = (id) => {
    return computed(() => products.value.find(p => p.id === id))
  }

  // Backwards compatible getter: extracts bid history from the new embedded bids array
  const getHistoryById = (id) => {
    return computed(() => {
      const p = products.value.find(prod => prod.id === id)
      return p?.bids || []
    })
  }

  // --- CORE SYSTEM ACTIONS ---
  
  // 1. Initialize global listener
  const listenToProducts = () => {
    if (unsubscribe) return; // already listening
    
    const productsRef = collection(db, 'products')
    unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = []
      snapshot.forEach(doc => {
        productsData.push({ id: doc.id, ...doc.data() })
      })
      products.value = productsData.sort((a,b) => b.endsAt - a.endsAt)
    }, (error) => {
      console.error("Error listening to products: ", error)
    })
  }

  // 2. Place a Bid
  const placeBid = async (productId, userDisplayName, uid, amount) => {
    const productRef = doc(db, 'products', productId)
    
    try {
      const pDoc = await getDoc(productRef)
      if (!pDoc.exists()) throw new Error("Product not found")
      
      const product = pDoc.data()
      const currentMs = Date.now()
      
      // Validation
      if (product.endsAt <= currentMs) throw new Error("Auction has ended")
      if (amount <= product.activePrice && product.leadingBidder !== 'Start Price') throw new Error("Bid must be higher than current price")
      
      let newEndsAt = product.endsAt
      // Anti-Sniper Logic
      if (product.endsAt - currentMs < 10000) {
        newEndsAt += 10000
      }

      const now = new Date()
      const newBid = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        uid: uid,
        user: userDisplayName,
        amount: amount,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }

      // Update document
      const existingBids = product.bids || []
      const updatedBids = [newBid, ...existingBids].slice(0, 50) // Keep latest 50
      
      await updateDoc(productRef, {
        activePrice: amount,
        leadingBidder: userDisplayName,
        leadingBidderUid: uid,
        endsAt: newEndsAt,
        status: 'hot',
        bids: updatedBids,
        updatedAt: serverTimestamp()
      })
      
    } catch(e) {
      console.error("Failed to place bid:", e)
      throw e
    }
  }

  // --- SELLER CRUD METHODS ---
  const addProduct = async (productData) => {
    const durationMs = (productData.durationHours || 24) * 60 * 60 * 1000;
    
    const newProduct = {
      ...productData,
      activePrice: productData.basePrice,
      leadingBidder: 'Start Price',
      leadingBidderUid: null,
      status: 'available',
      endsAt: Date.now() + durationMs,
      resolution: null,
      bids: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    try {
      await addDoc(collection(db, 'products'), newProduct)
    } catch(e) {
      console.error("Error adding product:", e)
      throw e
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId))
    } catch(e) {
      console.error("Error deleting product:", e)
      throw e
    }
  }

  const resolveAuction = async (productId, resolutionStatus) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        resolution: resolutionStatus,
        updatedAt: serverTimestamp()
      })
    } catch(e) {
      console.error("Error resolving auction:", e)
      throw e
    }
  }

  const updateProduct = async (productId, updateData) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...updateData,
        updatedAt: serverTimestamp()
      })
    } catch(e) {
      console.error("Error updating product:", e)
      throw e
    }
  }

  return { 
    products, 
    clock,
    getProductById, 
    getHistoryById, 
    listenToProducts,
    placeBid, 
    addProduct,
    updateProduct,
    deleteProduct,
    resolveAuction
  }
})
