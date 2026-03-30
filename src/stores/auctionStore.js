import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useAuctionStore = defineStore('auction', () => {
  // Global network clock that ticks every second for sync
  const clock = ref(Date.now())
  setInterval(() => {
    clock.value = Date.now()
  }, 1000)
  // Generating 25 mock products (5 sellers x 5 products)
  const generateMockData = () => {
    const sellers = ['TechSource Certified', 'Mobile Hub', 'Gadget Xchange', 'Smart Life Electronics', 'Pro Device Deals'];
    const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Sony'];
    const models = [
      ['iPhone 14 Pro', 'iPhone 13', 'iPhone 12 Mini', 'iPhone 11 Pro Max', 'iPhone SE'],
      ['Galaxy S23 Ultra', 'Galaxy S22', 'Galaxy Z Fold 4', 'Galaxy A54', 'Galaxy Note 20'],
      ['Pixel 7 Pro', 'Pixel 6a', 'Pixel 5', 'Pixel 7', 'Pixel 4 XL'],
      ['OnePlus 11', 'OnePlus 10 Pro', 'OnePlus Nord N20', 'OnePlus 9', 'OnePlus 8T'],
      ['Xperia 1 IV', 'Xperia 5 III', 'Xperia 10 IV', 'Xperia PRO-I', 'Xperia 1 III']
    ];
    const imageSets = [
      ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800'],
      ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800'],
      ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800'],
      ['https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800'],
      ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800']
    ];
    const conditions = ['Like New', 'Excellent', 'Good', 'Fair', 'Refurbished'];
    const defectSamples = [
      'Minor scratch on the bottom right corner.',
      'Battery health at 84%. Light wear around the charging port.',
      'None. Pristine condition with screen protector installed from day one.',
      'Small dent on the top bezel. Does not affect screen or usability.',
      'Replaced screen with genuine parts. Minor software lag occasionally.'
    ];
    
    let prods = [];
    let hists = {};
    let idCounter = 1;
    
    sellers.forEach((seller, i) => {
      for(let j=0; j<5; j++) {
        const id = String(idCounter++);
        const basePrice = Math.floor(Math.random() * 500) + 200;
        
        let endsAt = Date.now();
        if (idCounter <= 4) { // First 3 products get 15-45 seconds for rapid testing
           endsAt += Math.floor(Math.random() * 30000) + 15000;
        } else { // Rest get 1-24 hours
           endsAt += Math.floor(Math.random() * 86400000) + 3600000;
        }

        prods.push({
          id,
          sellerName: seller,
          brand: brands[i],
          model: models[i][j],
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          defects: defectSamples[Math.floor(Math.random() * defectSamples.length)],
          basePrice: basePrice,
          activePrice: basePrice,
          leadingBidder: 'Start Price',
          status: 'available',
          images: imageSets[Math.floor(Math.random() * imageSets.length)],
          endsAt: endsAt
        });
        hists[id] = [];
      }
    });
    return { prods, hists };
  }

  const mockData = generateMockData();
  const defaultProducts = mockData.prods;
  const defaultHistories = mockData.hists;

  // --- 2. HYDRATE FROM LOCAL STORAGE (To survive F5 Refresh) ---
  const storedState = localStorage.getItem('rephonex_auction_state_v4')
  let initialProducts = defaultProducts
  let initialHistories = defaultHistories

  if (storedState) {
    try {
      const parsed = JSON.parse(storedState)
      if (parsed.products) {
        initialProducts = parsed.products
      }
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
    localStorage.setItem('rephonex_auction_state_v4', JSON.stringify({
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

    // Ensure auction is not expired
    const currentMs = Date.now()
    if (product.endsAt <= currentMs) return

    // Ensure bid is genuinely higher
    if (amount <= product.activePrice && product.leadingBidder !== 'Start Price') return

    // Anti-Sniper Logic (Popcorn bid) - if less than 10 seconds remain, extend by 10s
    if (product.endsAt - currentMs < 10000) {
      product.endsAt += 10000
    }

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
        const activeProducts = products.value.filter(p => p.endsAt > Date.now())
        if (activeProducts.length === 0) return // Nothing left to bid on
        
        const randomProduct = activeProducts[Math.floor(Math.random() * activeProducts.length)]
        
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

      // Consistent ticking: Exactly 5 seconds
      setTimeout(simulateTick, 5000)
    }

    // Start engine
    simulateTick()
  }

  const stopSimulation = () => {
    simulationActive.value = false
  }

  // Helper method to clear the presenter's cache back to default
  const resetAuctionState = () => {
    localStorage.removeItem('rephonex_auction_state_v3')
    localStorage.removeItem('rephonex_auction_state_v4')
    products.value = [...defaultProducts]
    bidHistories.value = JSON.parse(JSON.stringify(defaultHistories)) // deep copy
  }

  // --- 6. SELLER CRUD METHODS ---
  const addProduct = (productData) => {
    const newId = 'prod_' + Date.now();
    const durationMs = (productData.durationHours || 24) * 60 * 60 * 1000;
    
    products.value.unshift({
      id: newId,
      ...productData,
      activePrice: productData.basePrice,
      leadingBidder: 'Start Price',
      status: 'available',
      endsAt: Date.now() + durationMs
    });
    bidHistories.value[newId] = [];
  }

  const deleteProduct = (productId) => {
    products.value = products.value.filter(p => p.id !== productId)
    delete bidHistories.value[productId]
  }

  return { 
    products, 
    bidHistories, 
    clock,
    getProductById, 
    getHistoryById, 
    placeBid, 
    startSimulation, 
    stopSimulation,
    resetAuctionState,
    addProduct,
    deleteProduct
  }
})
