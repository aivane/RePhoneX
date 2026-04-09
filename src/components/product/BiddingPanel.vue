<template>
  <div class="bg-gray-900 rounded-3xl shadow-xl overflow-hidden p-6 text-white border border-gray-800 relative select-none">
    
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-xl font-bold uppercase tracking-wider text-gray-400">Status</h3>
      
      <!-- Timer Badge -->
      <div 
        class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-300 shadow-inner"
        :class="[
          isEnded ? 'bg-gray-800 border-gray-700 text-gray-500' : 
          isEndingSoon ? 'bg-red-900/50 border-red-500 text-red-400' : 
          'bg-blue-900/40 border-blue-500/50 text-blue-300'
        ]"
      >
        <svg v-if="!isEnded" class="w-4 h-4 mr-2" :class="isEndingSoon ? 'animate-pulse text-red-500' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        {{ !isEnded ? formattedTime : (product.resolution === 'accepted' ? 'SOLD' : product.resolution === 'rejected' ? 'CANCELLED' : product.leadingBidder === 'Start Price' ? 'UNSOLD' : 'AWAITING SELLER') }}
      </div>
    </div>

    <!-- Main Display Section -->
    <div class="mb-8 text-center transition-all duration-500">
      <p class="text-sm font-medium mb-2" :class="isEnded ? 'text-gray-500' : 'text-gray-400'">
        {{ isEnded ? 'Final Winning Bid' : 'Current Highest Bid' }}
      </p>
      <div 
        class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r transition-all duration-300 transform scale-100 drop-shadow-lg"
        :class="[
          isEnded && product.resolution === 'rejected' ? 'from-gray-500 to-gray-700 scale-95 opacity-50 line-through' :
          isEnded ? 'from-gray-400 to-gray-600 scale-95 opacity-80' : 
          product.status === 'hot' ? 'scale-110 from-green-300 to-yellow-300' : 'from-green-400 to-blue-500'
        ]"
      >
        ${{ product.activePrice }}
      </div>
      
      <!-- Winner / Leader UI -->
      <div v-if="isEnded && product.leadingBidder !== 'Start Price'" class="mt-4 px-4 py-3 rounded-xl border inline-block shadow-inner mx-auto"
           :class="product.resolution === 'accepted' ? 'bg-green-900/30 border-green-700' : product.resolution === 'rejected' ? 'bg-red-900/30 border-red-900/50' : 'bg-gray-800/80 border-gray-700'">
        <p class="text-sm" :class="product.resolution === 'accepted' ? 'text-green-400' : product.resolution === 'rejected' ? 'text-red-400' : 'text-gray-400'">
          {{ product.resolution === 'accepted' ? 'Purchased By' : product.resolution === 'rejected' ? 'Cancelled Deal' : 'Pending Approval For' }}
        </p>
        <p class="text-lg font-bold flex items-center justify-center" 
           :class="product.resolution === 'accepted' ? 'text-green-300' : product.resolution === 'rejected' ? 'text-red-400 line-through' : 'text-yellow-400'">
          <svg v-if="product.resolution !== 'rejected'" class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"></path></svg>
          <svg v-else class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          {{ product.leadingBidder }}
        </p>
      </div>
      <div v-else-if="isEnded && product.leadingBidder === 'Start Price'" class="mt-4 px-4 py-3 bg-gray-800/80 rounded-xl border border-gray-700 inline-block shadow-inner mx-auto">
        <p class="text-sm font-bold text-gray-400">No bids were placed</p>
      </div>
      <p v-else class="text-xs mt-2" :class="product.leadingBidder === 'You' ? 'text-green-400 font-bold' : 'text-gray-500'">
        Held by: <span class="font-medium" :class="product.leadingBidder !== 'You' ? 'text-gray-300' : ''">{{ product.leadingBidder }}</span>
      </p>
    </div>

    <!-- Bidding Actions (Only Visible While Active) -->
    <div v-if="!isEnded" class="transition-all">
      <!-- Seller Restriction Message -->
      <div v-if="authStore.profile?.role === 'seller'" class="bg-purple-900/20 border border-purple-800/50 rounded-xl p-4 mb-8 text-center shadow-inner">
        <svg class="mx-auto h-6 w-6 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        <p class="text-sm font-bold text-purple-300">Seller Account Restricted</p>
        <p class="text-[11px] text-purple-400/80 mt-1 uppercase tracking-widest font-bold">Sellers cannot participate in auctions.</p>
      </div>
      
      <!-- Buyer Bidding Interface -->
      <div v-else>
        <div class="mb-4">
          <div class="flex items-center">
            <span class="bg-gray-800 text-gray-400 px-4 py-3 rounded-l-xl border border-r-0 font-bold" :class="bidError ? 'border-red-500 text-red-400' : 'border-gray-700'">$</span>
            <input 
              type="number"
              min="1"
              max="100000"
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

        <div class="grid grid-cols-3 gap-3 mb-8">
          <button @click="handlePlaceBid(10)" class="col-span-1 bg-gray-800 hover:bg-gray-700 text-white transition rounded-xl py-3 font-semibold border border-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95">
            +$10
          </button>
          <button @click="handlePlaceBid(50)" class="col-span-1 bg-gray-800 hover:bg-gray-700 text-white transition rounded-xl py-3 font-semibold border border-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95">
            +$50
          </button>
          <button @click="handlePlaceBid(100)" class="col-span-1 bg-blue-600 hover:bg-blue-500 text-white transition rounded-xl py-3 font-bold border border-blue-600 shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95">
            +$100
          </button>
        </div>
      </div>
    </div>

    <!-- Spacer if Ended to keep UI balanced -->
    <div v-else class="h-6"></div>

    <!-- Bid History Console -->
    <div class="bg-black/50 rounded-xl p-4 h-56 overflow-y-auto border border-gray-800 font-mono text-sm relative shadow-inner">
      <div v-if="bids.length === 0" class="text-center text-gray-600 italic h-full flex items-center justify-center">
        Waiting for initial bids...
      </div>
      <transition-group name="list" tag="ul" class="space-y-3">
        <li v-for="bid in bids" :key="bid.id" class="flex justify-between items-center p-2 rounded-lg" :class="bid.isMine ? 'bg-blue-900/40 border border-blue-800/50' : 'bg-gray-800/40'">
          <div>
            <span class="text-gray-500 text-[10px] mr-2 block sm:inline">{{ bid.time }}</span>
            <span class="font-semibold text-xs sm:text-sm" :class="bid.isMine ? 'text-blue-400' : 'text-gray-300'">{{ bid.user }}</span>
          </div>
          <span class="font-bold tracking-tight text-sm sm:text-base" :class="bid.isMine ? 'text-green-400' : 'text-green-500'">${{ bid.amount }}</span>
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

// --- Timer Logic ---
const timeRemainingMs = computed(() => {
  return Math.max(0, props.product.endsAt - auctionStore.clock)
})
const isEnded = computed(() => timeRemainingMs.value <= 0)
const isEndingSoon = computed(() => !isEnded.value && timeRemainingMs.value < 60000) // Less than 1 minute

const formattedTime = computed(() => {
  if (isEnded.value) return '00:00:00'
  const totalSeconds = Math.floor(timeRemainingMs.value / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})


// --- History & Actions Logic ---
const bids = computed(() => {
  return (props.product.bids || []).map(b => ({
    ...b,
    isMine: b.uid === authStore.user?.uid
  }))
})

const customBid = ref('')
const bidError = ref('')

const doAuthIfNeeded = async () => {
  if (!authStore.user) {
    try {
      await authStore.loginWithGoogle()
    } catch (error) {
      return false
    }
  }
  return !!authStore.user
}

const handleCustomBid = async () => {
  if (isEnded.value) return
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

    auctionStore.placeBid(
      props.product.id, 
      authStore.profile?.displayName || 'Unknown Buyer', 
      authStore.user.uid, 
      amount
    )
    customBid.value = ''
  }
}

const handlePlaceBid = async (increment) => {
  if (isEnded.value) return
  bidError.value = ''
  if (await doAuthIfNeeded()) {
    const newAmount = props.product.activePrice + increment
    const availableBalance = authStore.profile?.balance || 2000
    
    if (newAmount > availableBalance) {
      bidError.value = `Cannot bid $${newAmount}. Your limit is $${availableBalance.toLocaleString()}`
      return
    }

    auctionStore.placeBid(
      props.product.id, 
      authStore.profile?.displayName || 'Unknown Buyer', 
      authStore.user.uid, 
      newAmount
    )
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
