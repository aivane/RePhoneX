import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useAuctionStore = defineStore('auction', () => {
  // --- 1. SET UP DEFAULTS ---
  const defaultProducts = [
    { id: '1', brand: 'Apple', model: 'iPhone 13 Pro', condition: 'Excellent', basePrice: 699, activePrice: 699, leadingBidder: 'Start Price', status: 'available', imageUrl: '' },
    { id: '2', brand: 'Samsung', model: 'Galaxy S22 Ultra', condition: 'Good', basePrice: 550, activePrice: 550, leadingBidder: 'Start Price', status: 'available', imageUrl: '' },
    { id: '3', brand: 'Google', model: 'Pixel 7', condition: 'Like New', basePrice: 400, activePrice: 400, leadingBidder: 'Start Price', status: 'available', imageUrl: '' },
    { id: '4', brand: 'Apple', model: 'iPhone 12', condition: 'Fair', basePrice: 299, activePrice: 299, leadingBidder: 'Start Price', status: 'available', imageUrl: '' }
  ]

  const defaultHistories = {
    '1': [], '2': [], '3': [], '4': []
  }

  // --- 2. HYDRATE FROM LOCAL STORAGE (To survive F5 Refresh) ---
  const storedState = localStorage.getItem('rephonex_auction_state')
  let initialProducts = defaultProducts
  let initialHistories = defaultHistories

  if (storedState) {
    try {
      const parsed = JSON.parse(storedState)
      if (parsed.products) initialProducts = parsed.products
      if (parsed.bidHistories) initialHistories = parsed.bidHistories
    } catch(e) { 
      console.warn("Could not parse saved auction state. Reverting to defaults.") 
    }
  }

  // --- 3. INITIALIZE REACTIVE STATE ---
  const products = ref(initialProducts)
  const bidHistories = ref(initialHistories)
  
  // Save to LocalStorage whenever these arrays mutate
  watch([products, bidHistories], () => {
    localStorage.setItem('rephonex_auction_state', JSON.stringify({
      products: products.value,
      bidHistories: bidHistories.value
    }))
  }, { deep: true })

  // Global Engine State
  const simulationActive = ref(false)
  const botNames = ['User_John99', 'SecureTrader', 'PhoneGeek', 'Xyz_Bidder', 'Anon8821', 'MarketPro', 'SniperX']

  const getProductById = (id) => {
    return computed(() => products.value.find(p => p.id === id))
  }

  const getHistoryById = (id) => {
    return computed(() => bidHistories.value[id] || [])
  }

  // --- 4. CORE ACTIONS ---
  const placeBid = (productId, user, amount, isMine = false) => {
    const product = products.value.find(p => p.id === productId)
    if (!product) return

    // Ensure bid is genuinely higher
    if (amount <= product.activePrice && product.leadingBidder !== 'Start Price') return

    // Update product active status
    product.activePrice = amount
    product.leadingBidder = isMine ? 'You' : user
    product.status = 'hot' // visually mark as receiving bids

    const now = new Date()
    const historyItem = {
      id: Date.now() + Math.random(),
      user: isMine ? 'You (Local)' : user,
      amount: amount,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isMine
    }

    if (!bidHistories.value[productId]) bidHistories.value[productId] = []
    
    // Unshift puts newest at top, keep length reasonable
    bidHistories.value[productId].unshift(historyItem)
    if (bidHistories.value[productId].length > 50) bidHistories.value[productId].pop()
      
    // Cooldown status effect after 4 seconds
    setTimeout(() => {
      // If no new bids came in since we updated this...
      if (product.activePrice === amount) {
        product.status = 'available'
      }
    }, 4000)
  }

  // --- 5. GLOBAL BOT SIMULATION ---
  const startSimulation = () => {
    if (simulationActive.value) return // prevent duplicate intervals
    simulationActive.value = true
    
    const simulateTick = () => {
      if (!simulationActive.value) return

      // Pick 1 or 2 random products to receive activity
      const numProductsToTick = Math.random() > 0.5 ? 2 : 1
      for (let i = 0; i < numProductsToTick; i++) {
        const randomProduct = products.value[Math.floor(Math.random() * products.value.length)]
        
        // 50% chance they actually bid to make it look organic
        if (Math.random() > 0.5) {
          const randomBot = botNames[Math.floor(Math.random() * botNames.length)]
          
          // Don't bid against yourself
          if (randomProduct.leadingBidder !== randomBot && randomProduct.leadingBidder !== 'You') {
             const botIncrement = Math.floor(Math.random() * 21) + 5
             placeBid(randomProduct.id, randomBot, randomProduct.activePrice + botIncrement, false)
          } else if (randomProduct.leadingBidder === 'Start Price' || randomProduct.leadingBidder === 'You') {
             // Aggressive bidding on fresh items or trying to beat the human player
             const randomBot2 = botNames[Math.floor(Math.random() * botNames.length)]
             const botIncrement = Math.floor(Math.random() * 15) + 10
             placeBid(randomProduct.id, randomBot2, randomProduct.activePrice + botIncrement, false)
          }
        }
      }

      // Dynamic ticking: Next burst 1.5s to 4s away
      setTimeout(simulateTick, Math.floor(Math.random() * 2500) + 1500)
    }

    // Start engine
    simulateTick()
  }

  const stopSimulation = () => {
    simulationActive.value = false
  }

  // Helper method to clear the presenter's cache back to default
  const resetAuctionState = () => {
    localStorage.removeItem('rephonex_auction_state')
    products.value = [...defaultProducts]
    bidHistories.value = { '1': [], '2': [], '3': [], '4': [] }
  }

  return { 
    products, 
    bidHistories, 
    getProductById, 
    getHistoryById, 
    placeBid, 
    startSimulation, 
    stopSimulation,
    resetAuctionState
  }
})
