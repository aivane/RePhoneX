<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p class="text-sm text-gray-500 mt-1">Manage your storefront and active listings.</p>
        </div>
        <button @click="showAddModal = true" class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          New Listing
        </button>
      </div>

      <!-- Listings Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Condition</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Current Bid</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="myProducts.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg class="h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    You haven't listed any phones yet.
                  </div>
                </td>
              </tr>
              <tr v-for="product in myProducts" :key="product.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img v-if="product.images && product.images.length" :src="product.images[0]" alt="" class="h-full w-full object-cover">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-extrabold text-gray-900">{{ product.model }}</div>
                      <div class="text-xs text-gray-500">{{ product.brand }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800">
                    {{ product.condition }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">${{ product.activePrice }}</div>
                  <div class="text-[10px] text-gray-500">{{ product.leadingBidder === 'Start Price' ? 'No bids yet' : 'Leading: ' + product.leadingBidder }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="handleDelete(product.id)" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Listing Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-black text-gray-900">Create New Listing</h2>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="submitListing" class="space-y-5">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Brand</label>
              <input type="text" v-model="form.brand" placeholder="e.g. Apple" class="w-full rounded-xl px-4 py-2 border transition-colors" :class="errors.brand ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'">
              <p v-if="errors.brand" class="mt-1.5 text-xs text-red-600 font-bold">{{ errors.brand }}</p>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Model</label>
              <input type="text" v-model="form.model" placeholder="e.g. iPhone 13 Pro" class="w-full rounded-xl px-4 py-2 border transition-colors" :class="errors.model ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'">
              <p v-if="errors.model" class="mt-1.5 text-xs text-red-600 font-bold">{{ errors.model }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Condition</label>
              <select v-model="form.condition" class="w-full border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 px-4 py-2 border bg-white">
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Starting Price ($)</label>
              <input type="number" v-model="form.basePrice" min="1" class="w-full rounded-xl px-4 py-2 border transition-colors" :class="errors.basePrice ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'">
              <p v-if="errors.basePrice" class="mt-1.5 text-xs text-red-600 font-bold">{{ errors.basePrice }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Condition & Defect Notes</label>
            <textarea v-model="form.defects" rows="3" placeholder="Describe any scratches, battery health, or accessories included..." class="w-full rounded-xl px-4 py-2 border transition-colors" :class="errors.defects ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'"></textarea>
            <p v-if="errors.defects" class="mt-1.5 text-xs text-red-600 font-bold">{{ errors.defects }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Image URLs (One per line)</label>
            <textarea v-model="form.imagesText" rows="3" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" class="w-full rounded-xl px-4 py-2 border font-mono text-sm transition-colors" :class="errors.imagesText ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'"></textarea>
            <p v-if="errors.imagesText" class="mt-1.5 text-xs text-red-600 font-bold">{{ errors.imagesText }}</p>
          </div>
          
          <div class="pt-4 border-t border-gray-100 flex justify-end">
            <button type="button" @click="showAddModal = false" class="mr-3 px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">Cancel</button>
            <button type="submit" class="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition">List Product</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuctionStore } from '../stores/auctionStore'
import { useAuthStore } from '../stores/auth'

const auctionStore = useAuctionStore()
const authStore = useAuthStore()

const myProducts = computed(() => {
  return auctionStore.products.filter(p => p.sellerName === (authStore.profile?.displayName || 'Unknown Seller'))
})

const showAddModal = ref(false)

const errors = ref({ brand: '', model: '', basePrice: '', defects: '', imagesText: '' })

const form = ref({
  brand: '',
  model: '',
  condition: 'Excellent',
  basePrice: 300,
  defects: '',
  imagesText: ''
})

const validateForm = () => {
  let isValid = true
  errors.value = { brand: '', model: '', basePrice: '', defects: '', imagesText: '' }
  
  if (form.value.brand.trim().length < 2) {
    errors.value.brand = 'Brand must be at least 2 characters.'
    isValid = false
  }
  
  if (form.value.model.trim().length < 2) {
    errors.value.model = 'Model must be at least 2 characters.'
    isValid = false
  }
  
  if (!form.value.basePrice || form.value.basePrice <= 0) {
    errors.value.basePrice = 'Starting Price must be greater than $0.'
    isValid = false
  }
  
  if (form.value.defects.trim().length < 10) {
    errors.value.defects = 'Please provide a meaningful description (min 10 characters).'
    isValid = false
  }
  
  const lines = form.value.imagesText.split('\n').map(u => u.trim()).filter(u => u.length > 0)
  if (lines.length === 0) {
    errors.value.imagesText = 'Please provide at least one image URL.'
    isValid = false
  } else {
    for (const url of lines) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        errors.value.imagesText = 'All URLs must start with http:// or https://'
        isValid = false
        break
      }
    }
  }
  
  return isValid
}

const submitListing = () => {
  if (!validateForm()) return

  // Parse images text into array of clean URLs
  const imageUrls = form.value.imagesText.split('\n').map(u => u.trim()).filter(u => u.length > 0)

  auctionStore.addProduct({
    sellerName: authStore.profile?.displayName || 'Unknown Seller',
    brand: form.value.brand,
    model: form.value.model,
    condition: form.value.condition,
    defects: form.value.defects,
    basePrice: form.value.basePrice,
    images: imageUrls
  })
  
  // Reset
  form.value = { brand: '', model: '', condition: 'Excellent', basePrice: 300, defects: '', imagesText: '' }
  showAddModal.value = false
}

const handleDelete = (id) => {
  if(confirm("Are you sure you want to delete this listing?")) {
    auctionStore.deleteProduct(id)
  }
}
</script>
