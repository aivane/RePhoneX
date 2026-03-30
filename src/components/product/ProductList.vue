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
        <ProductCard v-for="product in auctionStore.products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuctionStore } from '../../stores/auctionStore'
import ProductCard from './ProductCard.vue'

const auctionStore = useAuctionStore()

onMounted(() => {
  // Kick off the global simulation when user views the marketplace
  auctionStore.startSimulation()
})
</script>


