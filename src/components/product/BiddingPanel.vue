<template>
  <div class="bg-gray-900 rounded-3xl shadow-xl overflow-hidden p-6 text-white border border-gray-800">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-xl font-bold uppercase tracking-wider text-gray-400">Live Auction</h3>
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 animate-pulse">
        <span class="w-2 h-2 mr-2 bg-red-500 rounded-full animate-ping"></span>
        {{ product.status === 'hot' ? 'Hot' : 'Live' }}
      </span>
    </div>

    <!-- Current Price Display -->
    <div class="mb-8 text-center">
      <p class="text-sm text-gray-400 mb-2">Current Highest Bid</p>
      <div 
        class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r transition-all duration-300 transform scale-100 drop-shadow-lg"
        :class="product.status === 'hot' ? 'scale-110 from-green-300 to-yellow-300' : 'from-green-400 to-blue-500'"
      >
        ${{ product.activePrice }}
      </div>
      <p class="text-xs mt-2" :class="product.leadingBidder === 'You' ? 'text-green-400 font-bold' : 'text-gray-500'">
        Held by: <span class="font-medium" :class="product.leadingBidder !== 'You' ? 'text-gray-300' : ''">{{ product.leadingBidder }}</span>
      </p>
    </div>

    <!-- User Custom Bidding -->
    <div class="mb-4">
      <div class="flex items-center">
        <span class="bg-gray-800 text-gray-400 px-4 py-3 rounded-l-xl border border-r-0 font-bold" :class="bidError ? 'border-red-500 text-red-400' : 'border-gray-700'">$</span>
        <input 
          type="number" 
          v-model="customBid" 
          class="w-full bg-gray-800 text-white px-4 py-3 border transition-colors outline-none font-mono text-lg"
          :class="bidError ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-blue-500'"
          :placeholder="'Min: $' + (product.activePrice + 1)"
        >
        <button @click="handleCustomBid" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-r-xl transition shadow-md shadow-blue-500/20 border-y border-r border-blue-600">
          Bid
        </button>
      </div>
      <p v-if="bidError" class="text-red-400 text-xs mt-2 font-bold flex items-center">
        <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        {{ bidError }}
      </p>
    </div>

    <!-- Quick Increment Actions -->
    <div class="grid grid-cols-3 gap-3 mb-8">
      <button @click="handlePlaceBid(10)" class="col-span-1 bg-gray-800 hover:bg-gray-700 text-white transition rounded-xl py-3 font-semibold border border-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
        +$10
      </button>
      <button @click="handlePlaceBid(50)" class="col-span-1 bg-gray-800 hover:bg-gray-700 text-white transition rounded-xl py-3 font-semibold border border-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
        +$50
      </button>
      <button @click="handlePlaceBid(100)" class="col-span-1 bg-blue-600 hover:bg-blue-500 text-white transition rounded-xl py-3 font-bold border border-blue-600 shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
import { computed, ref } from 'vue'
import { useAuctionStore } from '../../stores/auctionStore'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const auctionStore = useAuctionStore()
const authStore = useAuthStore()

// Reactively bind to global bid history for this specific product
const bids = computed(() => auctionStore.bidHistories[props.product.id] || [])

const customBid = ref('')
const bidError = ref('')

const doAuthIfNeeded = async () => {
  if (!authStore.user) {
    try {
      await authStore.loginWithGoogle()
    } catch (error) {
      return false // Login failed or user cancelled
    }
  }
  return !!authStore.user
}

const handleCustomBid = async () => {
  bidError.value = ''
  const amount = Number(customBid.value)
  
  if (!amount || amount <= props.product.activePrice) {
    bidError.value = `Bid must be strictly higher than $${props.product.activePrice}`
    return
  }

  if (await doAuthIfNeeded()) {
    const availableBalance = authStore.profile?.balance || 2000
    if (amount > availableBalance) {
      bidError.value = `Insufficient funds. Your limit is $${availableBalance.toLocaleString()}`
      return
    }

    auctionStore.placeBid(props.product.id, authStore.profile?.displayName || 'You', amount, true)
    customBid.value = ''
  }
}

const handlePlaceBid = async (increment) => {
  bidError.value = ''
  if (await doAuthIfNeeded()) {
    const newAmount = props.product.activePrice + increment
    const availableBalance = authStore.profile?.balance || 2000
    
    if (newAmount > availableBalance) {
      bidError.value = `Cannot bid $${newAmount}. Your limit is $${availableBalance.toLocaleString()}`
      return
    }

    auctionStore.placeBid(props.product.id, authStore.profile?.displayName || 'You', newAmount, true)
  }
}
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
