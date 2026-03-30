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
                 <span v-if="trustScore === null" class="text-xs text-gray-400 font-semibold">Loading seller stats...</span>
                 <span v-else-if="trustScore >= 80" class="text-xs text-green-600 font-bold flex items-center">
                   <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                   Trusted Seller ({{ trustScore }}% Success)
                 </span>
                 <span v-else-if="trustScore >= 50" class="text-xs text-yellow-600 font-bold flex items-center">
                   <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                   Moderate Risk ({{ trustScore }}% Success)
                 </span>
                 <div v-else class="text-xs text-red-600 font-bold flex items-center bg-red-50 py-1 px-2.5 rounded-md border border-red-100 mt-1 shadow-sm w-max">
                   <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   High Risk: Frequently Cancels Deals ({{ trustScore }}%)
                 </div>
               </div>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
              Device Specifications
            </h3>
            
            <div v-if="product.specs" class="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8">
              <div class="grid grid-cols-2 gap-y-5 gap-x-6">
                <div v-if="product.specs.display" class="flex items-start">
                  <svg class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Display</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.display }}</div>
                  </div>
                </div>
                
                <div v-if="product.specs.cpu" class="flex items-start">
                  <svg class="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Processor</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.cpu }}</div>
                  </div>
                </div>

                <div v-if="product.specs.ram" class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Memory (RAM)</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.ram }}</div>
                  </div>
                </div>

                <div v-if="product.specs.storage" class="flex items-start">
                  <svg class="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Storage</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.storage }}</div>
                  </div>
                </div>

                <div v-if="product.specs.camera" class="flex items-start">
                  <svg class="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Camera</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.camera }}</div>
                  </div>
                </div>

                <div v-if="product.specs.battery" class="flex items-start">
                  <svg class="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Battery</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.battery }}</div>
                  </div>
                </div>

                <div v-if="product.specs.os" class="flex items-start">
                  <svg class="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">OS</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.os }}</div>
                  </div>
                </div>

                <div v-if="product.specs.connectivity" class="flex items-start">
                  <svg class="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Connectivity</div>
                    <div class="text-sm font-semibold text-gray-800">{{ product.specs.connectivity }}</div>
                  </div>
                </div>
              </div>
              
              <div v-if="product.specs.other" class="mt-6 pt-4 border-t border-blue-100 flex items-start">
                  <svg class="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div>
                    <div class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Other Features</div>
                    <div class="text-sm font-semibold text-gray-800 leading-relaxed">{{ product.specs.other }}</div>
                  </div>
              </div>
            </div>

            <div v-else class="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 mb-8 text-center">
               <span class="text-gray-400 italic text-sm">No detailed specifications provided for this listing.</span>
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
import { db } from '../services/firebase'
import { getDoc, doc } from 'firebase/firestore'
import BiddingPanel from '../components/product/BiddingPanel.vue'

const route = useRoute()
const auctionStore = useAuctionStore()

const product = computed(() => auctionStore.products.find(p => p.id === route.params.id))

const activeImage = ref('')
const trustScore = ref(null)

watch(product, async (newVal) => {
  if (newVal && newVal.images && newVal.images.length > 0) {
    activeImage.value = newVal.images[0]
  }
  
  if (newVal && newVal.sellerUid) {
    try {
      const sellerSnap = await getDoc(doc(db, 'users', newVal.sellerUid))
      if (sellerSnap.exists()) {
        const data = sellerSnap.data()
        const completed = data.completedDeals || 0
        const rejected = data.rejectedDeals || 0
        const total = completed + rejected
        if (total === 0) {
          trustScore.value = 100
        } else {
          trustScore.value = Math.round((completed / total) * 100)
        }
      } else {
        trustScore.value = 100 // fallback
      }
    } catch(e) {
      console.error("Error fetching seller score:", e)
    }
  }
}, { immediate: true })
</script>
