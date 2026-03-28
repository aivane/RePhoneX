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
    <div class="mb-10 text-center">
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

    <!-- User Bidding Actions -->
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
import { computed } from 'vue'
import { useAuctionStore } from '../../stores/auctionStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const auctionStore = useAuctionStore()

// Reactively bind to global bid history for this specific product
const bids = computed(() => auctionStore.bidHistories[props.product.id] || [])

const handlePlaceBid = (increment) => {
  const newAmount = props.product.activePrice + increment
  auctionStore.placeBid(props.product.id, 'You', newAmount, true)
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
