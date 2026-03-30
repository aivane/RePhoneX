<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <button @click="$router.push('/')" class="mb-6 text-gray-500 hover:text-blue-600 font-semibold flex items-center transition group">
        <svg class="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Market
      </button>

      <div v-if="product" class="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-0 overflow-hidden">
        
        <!-- Left Column: Image & Specs -->
        <div class="flex-1 lg:border-r border-gray-100">
          
          <!-- Image Header & Gallery -->
          <div class="w-full flex flex-col group p-6 sm:p-10 pb-0">
             <div class="h-64 sm:h-96 w-full rounded-2xl relative overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center">
               <img v-if="product.images && product.images.length > 0" :src="activeImage" class="w-full h-full object-contain" :alt="product.model" />
               <div v-else class="flex h-full items-center justify-center text-gray-300">
                 <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
               </div>
               
               <!-- Absolute Spec Badges -->
               <div class="absolute top-4 left-4 flex gap-2">
                 <span class="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-gray-800 uppercase shadow-sm border border-white/50 tracking-wider">
                   {{ product.brand }}
                 </span>
                 <span class="bg-blue-600/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-white uppercase shadow-sm border border-blue-500/50 tracking-wider">
                   {{ product.condition }}
                 </span>
               </div>
             </div>
             
             <!-- Thumbnails -->
             <div v-if="product.images && product.images.length > 1" class="flex gap-4 mt-6 overflow-x-auto pb-2 px-1 scrollbar-hide">
               <button v-for="(img, idx) in product.images" :key="idx" @click="activeImage = img"
                 class="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-gray-50"
                 :class="activeImage === img ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'">
                 <img :src="img" class="w-full h-full object-cover" />
               </button>
             </div>
          </div>
          
          <div class="p-8 sm:p-12">
            <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">{{ product.model }}</h1>
            
            <div v-if="product.defects" class="mb-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <h4 class="text-xs font-black text-yellow-800 uppercase tracking-widest mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                Condition & Defect Notes
              </h4>
              <p class="text-yellow-900 font-medium text-sm leading-relaxed">
                {{ product.defects }}
              </p>
            </div>

            <div class="flex items-center mb-8 border-b border-gray-100 pb-6">
               <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-3 shadow-inner">
                 {{ product.sellerName ? product.sellerName.charAt(0) : 'V' }}
               </div>
               <div class="flex flex-col">
                 <span class="text-sm font-bold text-gray-900 leading-none mb-1">{{ product.sellerName || 'Verified Shop' }}</span>
                 <span class="text-xs text-green-600 font-semibold flex items-center">
                   <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                   Trusted Seller
                 </span>
               </div>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
              Device Features
            </h3>
            <div class="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8">
              <ul role="list" class="space-y-4 text-gray-700 font-medium">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  Factory unlocked for all carriers worldwide
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  Original battery capacity > 90%
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  Includes premium fast charger and tempered glass
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  1-year RePhoneX Protection Guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column: Bidding -->
        <div class="w-full lg:w-[420px] bg-white flex flex-col p-8 sm:p-12">
          <BiddingPanel :product="product" />
        </div>

      </div>

      <div v-else class="text-center py-32 text-gray-500 flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
        <span class="text-lg font-medium">Loading Product Data...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuctionStore } from '../stores/auctionStore'
import BiddingPanel from '../components/product/BiddingPanel.vue'

const route = useRoute()
const auctionStore = useAuctionStore()

const product = computed(() => auctionStore.products.find(p => p.id === route.params.id))

const activeImage = ref('')

watch(product, (newVal) => {
  if (newVal && newVal.images && newVal.images.length > 0) {
    activeImage.value = newVal.images[0]
  }
}, { immediate: true })
</script>
