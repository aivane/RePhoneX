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
          
          <!-- Live Status Badge / Timer Badge -->
          <div 
            class="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg border tracking-wider transition-colors backdrop-blur flex items-center"
            :class="[
              isEnded(product.endsAt) ? 'bg-gray-800/90 text-gray-300 border-gray-600' : 
              isEndingSoon(product.endsAt) ? 'bg-red-600/90 text-white border-red-500 animate-pulse' : 
              product.status === 'hot' ? 'bg-orange-500/90 text-white border-orange-400 font-black' : 'bg-black/80 text-white border-gray-700'
            ]"
          >
            <svg v-if="!isEnded(product.endsAt)" class="w-3.5 h-3.5 mr-1.5" :class="isEndingSoon(product.endsAt) ? '' : 'opacity-70'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <svg v-else class="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ isEnded(product.endsAt) ? 'ENDED' : formatTimeLeft(product.endsAt) }}
          </div>
          
          <!-- Image Section -->
          <div class="h-48 w-full bg-gray-50 relative overflow-hidden" :class="isEnded(product.endsAt) ? 'grayscale opacity-80' : ''">
             <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" :alt="product.model" />
             <div v-else class="flex h-full items-center justify-center text-gray-300">
               <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
             </div>
             
             <!-- Condition overlay -->
             <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-extrabold text-gray-800 uppercase shadow-sm border border-white/20">
               {{ product.condition }}
             </div>
          </div>
          
          <div class="p-5 flex-grow flex flex-col justify-between" :class="isEnded(product.endsAt) ? 'bg-gray-50' : ''">
            <div>
              <p class="text-[11px] font-extrabold uppercase tracking-widest mb-1" :class="isEnded(product.endsAt) ? 'text-gray-500' : 'text-blue-600'">{{ product.brand }}</p>
              <h3 class="text-xl font-extrabold text-gray-900 leading-tight" :class="isEnded(product.endsAt) ? 'text-gray-500' : ''">{{ product.model }}</h3>
              <p class="text-[10px] text-gray-500 font-medium mt-1 flex items-center">
                <svg class="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                Seller: {{ product.sellerName || 'Verified Shop' }}
              </p>
            </div>
            
            <div class="mt-6 flex justify-between items-end">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold uppercase tracking-wider mb-0.5" 
                      :class="[isEnded(product.endsAt) ? '' : 'text-gray-400', product.resolution === 'accepted' ? 'text-green-600' : product.resolution === 'rejected' ? 'text-red-500' : isEnded(product.endsAt) ? 'text-yellow-600' : '']">
                  <template v-if="!isEnded(product.endsAt)">Current Bid</template>
                  <template v-else-if="product.leadingBidder === 'Start Price'">Unsold</template>
                  <template v-else-if="product.resolution === 'accepted'">Sold For</template>
                  <template v-else-if="product.resolution === 'rejected'">Cancelled</template>
                  <template v-else>Winning Bid</template>
                </span>
                <span class="text-2xl font-black tracking-tight transition-colors duration-300" 
                      :class="[product.resolution === 'rejected' ? 'text-gray-400 line-through' : product.resolution === 'accepted' ? 'text-green-600' : isEnded(product.endsAt) ? 'text-gray-500' : product.status === 'hot' ? 'text-red-500' : 'text-gray-900']">
                  ${{ product.activePrice }}
                </span>
                <span v-if="!isEnded(product.endsAt)" class="text-xs text-gray-500 mt-1 truncate w-24 font-medium" :class="product.leadingBidder === 'You' ? 'text-green-600 font-bold' : ''">
                  {{ product.leadingBidder === 'Start Price' ? 'Start Price' : 'by ' + product.leadingBidder }}
                </span>
                <span v-else-if="product.leadingBidder !== 'Start Price'" class="text-xs mt-1 truncate w-24 font-bold flex items-center" 
                      :class="product.resolution === 'accepted' ? 'text-green-600' : product.resolution === 'rejected' ? 'text-red-500 line-through' : 'text-yellow-600'">
                  <svg v-if="product.resolution === 'accepted'" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <svg v-else-if="product.resolution === 'rejected'" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  <svg v-else class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"></path></svg>
                  {{ product.leadingBidder }}
                </span>
                <span v-else class="text-xs text-gray-400 mt-1 truncate w-24 font-medium italic">
                  No Bids
                </span>
              </div>
              <button @click="handleJoinAuction(product)" class="px-5 py-2.5 shadow-md text-white text-sm font-bold rounded-xl transition transform hover:scale-105 active:scale-95 group-hover:bg-blue-600"
                :class="isEnded(product.endsAt) ? 'bg-gray-600 hover:bg-gray-500 group-hover:bg-gray-500' : 'bg-gray-900 hover:bg-gray-800'">
                {{ isEnded(product.endsAt) ? 'Result' : 'View' }}
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

const getTimeRemainingMs = (endsAt) => Math.max(0, endsAt - auctionStore.clock)
const isEnded = (endsAt) => getTimeRemainingMs(endsAt) <= 0
const isEndingSoon = (endsAt) => {
  const t = getTimeRemainingMs(endsAt);
  return t > 0 && t < 60000;
}
const formatTimeLeft = (endsAt) => {
  const t = getTimeRemainingMs(endsAt)
  if (t <= 0) return '00:00:00'
  const totalSeconds = Math.floor(t / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

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
