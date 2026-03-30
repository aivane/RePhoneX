<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">My Bids & Orders</h1>
        <p class="text-sm text-gray-500 mt-1">Track your active auctions and purchase history.</p>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'active'"
            :class="activeTab === 'active' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap pb-4 border-b-2 font-bold text-sm transition-colors flex items-center"
          >
            Active Bids
            <span v-if="myOngoingBids.length > 0" class="ml-2 bg-purple-100 text-purple-600 py-0.5 px-2.5 rounded-full text-xs">{{ myOngoingBids.length }}</span>
          </button>
          <button 
            @click="activeTab = 'pending'"
            :class="activeTab === 'pending' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap pb-4 border-b-2 font-bold text-sm transition-colors flex items-center"
          >
            Awaiting Seller Approval
            <span v-if="myPendingWins.length > 0" class="ml-2 bg-yellow-100 text-yellow-700 py-0.5 px-2.5 rounded-full text-xs">{{ myPendingWins.length }}</span>
          </button>
          <button 
            @click="activeTab = 'history'"
            :class="activeTab === 'history' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap pb-4 border-b-2 font-bold text-sm transition-colors"
          >
            Order History
          </button>
        </nav>
      </div>

      <!-- Active Tab Content -->
      <div v-if="activeTab === 'active'" class="space-y-4">
        <div v-if="myOngoingBids.length === 0" class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-lg font-bold text-gray-900 mb-1">No Active Bids</h3>
          <p class="text-gray-500 text-sm">You are not participating in any live auctions right now.</p>
          <router-link to="/" class="mt-4 inline-block bg-purple-50 text-purple-700 font-bold px-5 py-2 rounded-xl text-sm transition hover:bg-purple-100">Explore Marketplace</router-link>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in myOngoingBids" :key="product.id" :product="product" />
        </div>
      </div>

      <!-- Pending Tab Content -->
      <div v-if="activeTab === 'pending'" class="space-y-4">
        <div v-if="myPendingWins.length === 0" class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-lg font-bold text-gray-900 mb-1">No Pending Approvals</h3>
          <p class="text-gray-500 text-sm">You haven't won any recent auctions that are waiting for seller confirmation.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in myPendingWins" :key="product.id" :product="product" />
        </div>
      </div>

      <!-- History Tab Content (Table layout better for history) -->
      <div v-if="activeTab === 'history'">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Final Price</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="myHistory.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">No history available yet.</td>
                </tr>
                <tr v-for="product in myHistory" :key="product.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img v-if="product.images && product.images.length" :src="product.images[0]" alt="" class="h-full w-full object-cover grayscale opacity-80">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-extrabold text-gray-900">{{ product.model }}</div>
                        <div class="text-xs text-gray-500">Seller: {{ product.sellerName }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                    ${{ product.activePrice }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <!-- Won & Accepted -->
                    <span v-if="product.leadingBidderUid === authStore.user?.uid && product.resolution === 'accepted'" class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Purchased
                    </span>
                    <!-- Won but Rejected -->
                    <span v-else-if="product.leadingBidderUid === authStore.user?.uid && product.resolution === 'rejected'" class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Seller Rejected
                    </span>
                    <!-- Outbid/Lost -->
                    <span v-else class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-600">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Lost Auction
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <router-link :to="'/product/' + product.id" class="text-blue-600 hover:text-blue-900 font-bold">View</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuctionStore } from '../stores/auctionStore'
import { useAuthStore } from '../stores/auth'
import ProductCard from '../components/product/ProductCard.vue'

const auctionStore = useAuctionStore()
const authStore = useAuthStore()
const activeTab = ref('active')

const myUid = computed(() => authStore.user?.uid)

const myOngoingBids = computed(() => {
  if (!myUid.value) return []
  return auctionStore.products.filter(p => {
    const timeRemaining = p.endsAt - auctionStore.clock;
    if (timeRemaining <= 0) return false;
    
    // Check if user is leading or in history
    const history = p.bids || [];
    const isInteracted = p.leadingBidderUid === myUid.value || history.some(b => b.uid === myUid.value);
    return isInteracted;
  });
})

const myPendingWins = computed(() => {
  if (!myUid.value) return []
  return auctionStore.products.filter(p => {
    const timeRemaining = p.endsAt - auctionStore.clock;
    if (timeRemaining > 0) return false;
    
    return p.leadingBidderUid === myUid.value && p.resolution === null;
  });
})

const myHistory = computed(() => {
  if (!myUid.value) return []
  return auctionStore.products.filter(p => {
    const timeRemaining = p.endsAt - auctionStore.clock;
    if (timeRemaining > 0) return false;
    
    // Won and Accepted/Rejected
    if (p.leadingBidderUid === myUid.value && p.resolution !== null) {
      return true;
    }
    
    // Lost
    if (p.leadingBidderUid !== myUid.value) {
      const history = p.bids || [];
      if (history.some(b => b.uid === myUid.value)) return true;
    }
    
    return false;
  }).sort((a,b) => b.endsAt - a.endsAt);
})
</script>
