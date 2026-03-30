<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 class="text-3xl font-extrabold text-gray-900">Latest Phones</h2>
        
        <!-- Search Bar -->
        <div class="relative w-full sm:w-96">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search brand, model, specs..." 
            class="block w-full pl-11 pr-10 py-3 rounded-2xl border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white transition-all text-sm font-medium placeholder-gray-400"
          >
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition outline-none">
             <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
      
      <div v-if="auctionStore.products.length === 0" class="text-center text-gray-500 py-20 flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
        <span>Loading marketplace...</span>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm w-full mx-auto">
        <svg class="mx-auto h-16 w-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 class="text-xl font-bold text-gray-900 mb-1">No phones found</h3>
        <p class="text-gray-500 text-sm">We couldn't find any listings matching "{{ searchQuery }}".</p>
        <button @click="searchQuery = ''" class="mt-6 px-6 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl transition text-sm">Clear Search</button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- Render Products from Vue Store -->
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuctionStore } from '../../stores/auctionStore'
import ProductCard from './ProductCard.vue'

const auctionStore = useAuctionStore()
const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value) return auctionStore.products;
  const q = searchQuery.value.toLowerCase().trim();
  
  return auctionStore.products.filter(p => {
     if(p.brand.toLowerCase().includes(q)) return true;
     if(p.model.toLowerCase().includes(q)) return true;
     if(p.condition.toLowerCase().includes(q)) return true;
     
     if(p.specs) {
        if(p.specs.display && p.specs.display.toLowerCase().includes(q)) return true;
        if(p.specs.cpu && p.specs.cpu.toLowerCase().includes(q)) return true;
        if(p.specs.ram && p.specs.ram.toLowerCase().includes(q)) return true;
        if(p.specs.storage && p.specs.storage.toLowerCase().includes(q)) return true;
        if(p.specs.camera && p.specs.camera.toLowerCase().includes(q)) return true;
        if(p.specs.other && p.specs.other.toLowerCase().includes(q)) return true;
     }
     
     return false;
  })
})

onMounted(() => {
  // Kick off the global simulation when user views the marketplace
  auctionStore.startSimulation()
})
</script>


