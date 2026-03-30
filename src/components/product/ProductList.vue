<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Latest Phones</h2>
      
      <div v-if="auctionStore.products.length === 0" class="text-center text-gray-500 py-20 flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
        <span>Loading marketplace...</span>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- Render Products from Vue Store -->
        <div v-for="product in auctionStore.products" :key="product.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col">
          
          <!-- Live Status Badge -->
          <div v-if="product.status === 'hot'" class="absolute top-3 left-3 bg-red-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse z-10 shadow-lg border border-red-500/50 tracking-wider">
            🔥 LIVE
          </div>
          
          <!-- Image Section -->
          <div class="h-48 w-full bg-gray-50 relative overflow-hidden">
             <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" :alt="product.model" />
             <div v-else class="flex h-full items-center justify-center text-gray-300">
               <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
             </div>
             
             <!-- Condition overlay -->
             <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-extrabold text-gray-800 uppercase shadow-sm border border-white/20">
               {{ product.condition }}
             </div>
          </div>
          
          <div class="p-5 flex-grow flex flex-col justify-between">
            <div>
              <p class="text-[11px] text-blue-600 font-extrabold uppercase tracking-widest mb-1">{{ product.brand }}</p>
              <h3 class="text-xl font-extrabold text-gray-900 leading-tight">{{ product.model }}</h3>
              <p class="text-[10px] text-gray-500 font-medium mt-1 flex items-center">
                <svg class="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                Seller: {{ product.sellerName || 'Verified Shop' }}
              </p>
            </div>
            
            <div class="mt-6 flex justify-between items-end">
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Current Bid</span>
                <span class="text-2xl font-black tracking-tight transition-colors duration-300" :class="product.status === 'hot' ? 'text-red-500' : 'text-gray-900'">
                  ${{ product.activePrice }}
                </span>
                <span class="text-xs text-gray-500 mt-1 truncate w-24 font-medium" :class="product.leadingBidder === 'You' ? 'text-green-600 font-bold' : ''">
                  {{ product.leadingBidder === 'Start Price' ? 'Start Price' : 'by ' + product.leadingBidder }}
                </span>
              </div>
              <button @click="handleJoinAuction(product)" class="px-5 py-2.5 bg-gray-900 shadow-md text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition transform hover:scale-105 active:scale-95 group-hover:bg-blue-600">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuctionStore } from '../../stores/auctionStore'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auctionStore = useAuctionStore()
const authStore = useAuthStore()

const handleJoinAuction = async (product) => {
  if (!authStore.user) {
    try {
      await authStore.loginWithGoogle()
    } catch (error) {
      return // Login failed or cancelled
    }
  }
  
  if (authStore.user) {
    router.push({ name: 'product-detail', params: { id: product.id } })
  }
}

onMounted(() => {
  // Kick off the global simulation when user views the marketplace
  auctionStore.startSimulation()
})
</script>
