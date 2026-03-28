<template>
  <div class="bg-gray-900 rounded-3xl shadow-xl overflow-hidden p-6 text-white border border-gray-800">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-xl font-bold uppercase tracking-wider text-gray-400">Live Auction</h3>
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 animate-pulse">
        <span class="w-2 h-2 mr-2 bg-red-500 rounded-full animate-ping"></span>
        Live
      </span>
    </div>

    <!-- Current Price Display -->
    <div class="mb-10 text-center">
      <p class="text-sm text-gray-400 mb-2">Current Highest Bid</p>
      <div 
        class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 transform scale-100"
        :class="{ 'scale-110 text-white !from-green-300 !to-yellow-300 drop-shadow-lg': isAnimatingPrice }"
      >
        ${{ currentPrice }}
      </div>
      <p v-if="leadingBidder" class="text-xs text-gray-500 mt-2">Held by: <span class="text-gray-300 font-medium">{{ leadingBidder }}</span></p>
    </div>

    <!-- User Bidding Actions -->
    <div class="grid grid-cols-3 gap-3 mb-8">
      <button @click="placeBid(10)" class="col-span-1 bg-gray-800 hover:bg-gray-700 text-white transition rounded-xl py-3 font-semibold border border-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
        +$10
      </button>
      <button @click="placeBid(50)" class="col-span-1 bg-gray-800 hover:bg-gray-700 text-white transition rounded-xl py-3 font-semibold border border-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
        +$50
      </button>
      <button @click="placeBid(100)" class="col-span-1 bg-blue-600 hover:bg-blue-500 text-white transition rounded-xl py-3 font-bold border border-blue-600 shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
        +$100
      </button>
    </div>

    <!-- Bid History Console -->
    <div class="bg-black/50 rounded-xl p-4 h-64 overflow-y-auto border border-gray-800 font-mono text-sm relative">
      <div v-if="bids.length === 0" class="text-center text-gray-600 italic h-full flex items-center justify-center">
        Waiting for initial bids...
      </div>
      <transition-group name="list" tag="ul" class="space-y-3">
        <li v-for="bid in bids" :key="bid.id" class="flex justify-between items-center p-2 rounded-lg" :class="bid.isMine ? 'bg-blue-900/40 border border-blue-800/50' : 'bg-gray-800/40'">
          <div>
            <span class="text-gray-500 text-xs mr-2">{{ bid.time }}</span>
            <span class="font-semibold" :class="bid.isMine ? 'text-blue-400' : 'text-gray-300'">{{ bid.user }}</span>
          </div>
          <span class="font-bold text-green-400">${{ bid.amount }}</span>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Bidding State
const currentPrice = ref(0)
const bids = ref([])
const leadingBidder = ref('Start Price')
const isAnimatingPrice = ref(false)

// Bot Simulator Data
let simulationTimer = null
const botNames = ['User_John99', 'SecureTrader', 'PhoneGeek', 'Xyz_Bidder', 'Anon8821', 'MarketPro']

// Set initial price once product is loaded
watch(() => props.product, (newVal) => {
  if (newVal) currentPrice.value = newVal.basePrice
}, { immediate: true })

// The flash animation effect for the price
const flashPrice = () => {
  isAnimatingPrice.value = true
  setTimeout(() => {
    isAnimatingPrice.value = false
  }, 300)
}

// Push a bid into the history and update current price
const addBidRecord = (user, newAmount, isMine = false) => {
  currentPrice.value = newAmount
  leadingBidder.value = isMine ? 'You' : user
  
  const now = new Date()
  bids.value.unshift({
    id: Date.now() + Math.random(),
    user: isMine ? 'You (Local)' : user,
    amount: newAmount,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isMine
  })

  // Keep history array from growing infinitely
  if (bids.value.length > 50) bids.value.pop()
  
  flashPrice()
}

// User Action
const placeBid = (increment) => {
  if (currentPrice.value === 0) return
  const newBidAmount = currentPrice.value + increment
  addBidRecord('You', newBidAmount, true)
}

// Simulation Logic
const simulateCompetitiveBids = () => {
  // Random timer between 2s and 7s
  const nextInterval = Math.floor(Math.random() * 5000) + 2000
  
  simulationTimer = setTimeout(() => {
    // Only 60% chance someone actually bids on this tick to feel organic
    if (Math.random() > 0.4 && leadingBidder.value !== 'Start Price') {
      const randomBot = botNames[Math.floor(Math.random() * botNames.length)]
      // The bot bids $5 to $25 over current price
      const botIncrement = Math.floor(Math.random() * 21) + 5
      const newBidAmount = currentPrice.value + botIncrement
      
      // Prevent bots from fighting themselves unnecessarily if they are already leading
      if (leadingBidder.value !== randomBot && leadingBidder.value !== 'You') {
         // Do bid
      }
      addBidRecord(randomBot, newBidAmount, false)
    } else if (leadingBidder.value === 'Start Price' || leadingBidder.value === 'You') {
      // If it's just started or user is leading, definitely try to outbid them aggressively!
      const randomBot = botNames[Math.floor(Math.random() * botNames.length)]
      const botIncrement = Math.floor(Math.random() * 20) + 10
      addBidRecord(randomBot, currentPrice.value + botIncrement, false)
    }
    
    // Loop
    simulateCompetitiveBids()
  }, nextInterval)
}

onMounted(() => {
  // Start simulation engine 2 seconds after page load
  setTimeout(() => {
    simulateCompetitiveBids()
  }, 2000)
})

onUnmounted(() => {
  if (simulationTimer) clearTimeout(simulationTimer)
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
