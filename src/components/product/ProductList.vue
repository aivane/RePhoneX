<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Latest Phones</h2>
      
      <div v-if="auctionStore.products.length === 0" class="text-center text-gray-500">
        Loading marketplace...
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Render Products from Vue Store -->
        <div v-for="product in auctionStore.products" :key="product.id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
          
          <!-- Live Status Badge -->
          <div v-if="product.status === 'hot'" class="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse z-10 shadow-lg border border-red-500">
            🔥 Live Bid!
          </div>
          
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-800">{{ product.brand }} {{ product.model }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ product.condition }}</p>
            
            <div class="mt-4 flex justify-between items-center bg-gray-50 p-3 rounded-lg border" :class="product.status === 'hot' ? 'border-red-200' : 'border-gray-100'">
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 font-semibold uppercase">Current Bid</span>
                <span class="text-xl font-extrabold transition-colors duration-300" :class="product.status === 'hot' ? 'text-red-500' : 'text-blue-600'">
                  ${{ product.activePrice }}
                </span>
                <span class="text-[10px] text-gray-400 mt-0.5 truncate w-24" :class="product.leadingBidder === 'You' ? 'text-green-600 font-bold' : ''">
                  {{ product.leadingBidder === 'Start Price' ? 'No Bids Yet' : 'by ' + product.leadingBidder }}
                </span>
              </div>
              <router-link :to="{ name: 'product-detail', params: { id: product.id }}" class="px-3 py-2 bg-blue-600 shadow-md text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95">
                Join Auction
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuctionStore } from '../../stores/auctionStore'

const auctionStore = useAuctionStore()

onMounted(() => {
  // Kick off the global simulation when user views the marketplace
  auctionStore.startSimulation()
})
</script>
