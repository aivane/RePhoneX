<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Latest Phones</h2>
      
      <div v-if="loading" class="text-center text-gray-500">
        Loading marketplace...
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Render Products -->
        <div v-for="product in products" :key="product.id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <img :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'" alt="Phone" class="w-full h-48 object-cover">
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-800">{{ product.brand }} {{ product.model }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ product.condition }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-xl font-extrabold text-blue-600">${{ product.price }}</span>
              <button class="px-3 py-1 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && products.length === 0" class="text-center text-gray-500">
        No phones currently available.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Since we haven't configured real firebase credentials yet, we mock data for visual purposes
const products = ref([
  { id: 1, brand: 'Apple', model: 'iPhone 13 Pro', condition: 'Excellent', price: 699, imageUrl: '' },
  { id: 2, brand: 'Samsung', model: 'Galaxy S22 Ultra', condition: 'Good', price: 550, imageUrl: '' },
  { id: 3, brand: 'Google', model: 'Pixel 7', condition: 'Like New', price: 400, imageUrl: '' },
  { id: 4, brand: 'Apple', model: 'iPhone 12', condition: 'Fair', price: 299, imageUrl: '' }
])
const loading = ref(false)

// In a real app, you would fetch from Firebase using:
// import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'
// import { db } from '../../services/firebase'
// ...
</script>
