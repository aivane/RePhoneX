<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Seller Dashboard
            <div v-if="trustScore !== null" class="flex items-center text-sm px-3 py-1 rounded-full font-bold shadow-sm border border-gray-100"
                 :class="trustScore >= 80 ? 'bg-green-100 text-green-700' : trustScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'">
              <svg v-if="trustScore >= 80" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <svg v-else-if="trustScore >= 50" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ trustScore }}% Success Rate
            </div>
          </h1>
          <p class="text-sm text-gray-500 mt-1">Manage your storefront and active listings.</p>
        </div>
        <button @click="openAddModal" class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          New Listing
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-6 mt-4">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'active'"
            :class="activeTab === 'active' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap pb-4 border-b-2 font-bold text-sm transition-colors flex items-center"
          >
            Active Listings
            <span v-if="activeProducts.length > 0" class="ml-2 bg-purple-100 text-purple-600 py-0.5 px-2.5 rounded-full text-xs">{{ activeProducts.length }}</span>
          </button>
          <button 
            @click="activeTab = 'pending'"
            :class="activeTab === 'pending' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap pb-4 border-b-2 font-bold text-sm transition-colors flex items-center"
          >
            Pending Approvals
            <span v-if="pendingProducts.length > 0" class="ml-2 bg-yellow-100 text-yellow-700 py-0.5 px-2.5 rounded-full text-xs animate-pulse">{{ pendingProducts.length }}</span>
          </button>
          <button 
            @click="activeTab = 'history'"
            :class="activeTab === 'history' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap pb-4 border-b-2 font-bold text-sm transition-colors flex items-center"
          >
            History
            <span v-if="historyProducts.length > 0" class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">{{ historyProducts.length }}</span>
          </button>
        </nav>
      </div>

      <!-- Active Tab -->
      <div v-if="activeTab === 'active'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
              <tr v-if="activeProducts.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg class="h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    You have no active listings right now.
                  </div>
                </td>
              </tr>
              <tr v-for="product in activeProducts" :key="product.id" class="hover:bg-gray-50 transition">
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
                  <button @click="openEditModal(product)" title="Edit Listing" class="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition mr-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="promptDelete(product)" title="Delete Listing" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pending Tab -->
      <div v-if="activeTab === 'pending'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="pendingProducts.length === 0" class="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-lg font-bold text-gray-900 mb-1">No Pending Approvals</h3>
          <p class="text-gray-500 text-sm">When an auction ends with a winner, they will appear here for your review.</p>
        </div>
        
        <div v-for="product in pendingProducts" :key="product.id" class="bg-white rounded-2xl shadow-md border border-yellow-200 overflow-hidden flex flex-col hover:shadow-lg transition">
          <div class="p-5 flex items-start gap-4">
            <div class="h-24 w-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <img :src="product.images[0]" class="h-full w-full object-cover">
            </div>
            <div class="flex-grow">
              <span class="px-2 py-0.5 inline-flex text-[10px] leading-5 font-bold rounded bg-yellow-100 text-yellow-800 uppercase tracking-widest mb-1">Awaiting Review</span>
              <h3 class="text-lg font-extrabold text-gray-900 leading-tight">{{ product.model }}</h3>
              <p class="text-xs text-gray-500">{{ product.brand }} • {{ product.condition }}</p>
              <div class="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
                <div class="text-[10px] text-gray-400 font-bold uppercase">Winning Bid</div>
                <div class="text-xl font-black text-gray-900">${{ product.activePrice }} <span class="text-sm text-gray-500 font-medium">by {{ product.leadingBidder }}</span></div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3 border-t border-gray-100 flex gap-3">
            <button @click="promptReject(product)" class="flex-1 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 font-bold rounded-xl transition shadow-sm text-sm">Reject Offer</button>
            <button @click="promptAccept(product)" class="flex-1 py-2 bg-green-600 text-white hover:bg-green-700 font-bold rounded-xl transition shadow-md shadow-green-600/20 text-sm">Accept Deal</button>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Result</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Final Price</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="historyProducts.length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-gray-500 italic">No sales history yet.</td>
              </tr>
              <tr v-for="product in historyProducts" :key="product.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center opacity-80">
                    <div class="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img v-if="product.images && product.images.length" :src="product.images[0]" class="h-full w-full object-cover grayscale">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-extrabold text-gray-900">{{ product.model }}</div>
                      <div class="text-[10px] text-gray-400">{{ product.brand }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="product.resolution === 'accepted'" class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                    Sold to {{ product.leadingBidder }}
                  </span>
                  <span v-else-if="product.resolution === 'rejected'" class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800">
                    Cancelled
                  </span>
                  <span v-else class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-600">
                    Unsold (No Bids)
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold" :class="product.resolution === 'accepted' ? 'text-green-600' : 'text-gray-400 line-through'">
                    ${{ product.activePrice }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Confirm Action Modal -->
    <div v-if="confirmModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!isProcessingTx && (confirmModal.show = false)"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center transform transition-all">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6" :class="confirmModal.action === 'accept' ? 'bg-green-100' : 'bg-red-100'">
          <svg v-if="confirmModal.action === 'accept'" class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <svg v-else class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <h3 class="text-2xl font-black text-gray-900 mb-2">{{ confirmModal.title }}</h3>
        <p class="text-sm text-gray-500 mb-8">{{ confirmModal.message }}</p>
        
        <div class="flex gap-3">
          <button @click="confirmModal.show = false" class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition" :disabled="isProcessingTx">Cancel</button>
          <button @click="executeConfirm" :class="confirmModal.action === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'" class="flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-md transition flex justify-center items-center disabled:opacity-50" :disabled="isProcessingTx">
            <svg v-if="isProcessingTx" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ confirmModal.action === 'accept' ? 'Confirm Sale' : confirmModal.action === 'reject' ? 'Reject Offer' : 'Delete Listing' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Listing Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-black text-gray-900">{{ editProductId ? 'Edit Listing' : 'Create New Listing' }}</h2>
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
              <select v-model="form.condition" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 bg-white">
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Auction Duration</label>
              <select v-model.number="form.durationHours" :disabled="editProductId" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 bg-white font-semibold text-purple-700 disabled:opacity-50 disabled:bg-gray-100">
                <option :value="0.008333">⚡ 30 Seconds (Testing)</option>
                <option :value="1">1 Hour</option>
                <option :value="12">12 Hours</option>
                <option :value="24">24 Hours</option>
                <option :value="168">7 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Starting Price ($)</label>
            <input type="number" v-model="form.basePrice" min="1" :disabled="editProductId" class="w-full rounded-xl px-4 py-2 border transition-colors disabled:opacity-50 disabled:bg-gray-100" :class="errors.basePrice ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'">
            <p v-if="errors.basePrice" class="mt-1.5 text-xs text-red-600 font-bold">{{ errors.basePrice }}</p>
          </div>
          
          <div class="border-t border-gray-100 pt-5 mt-5">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Device Specifications</h3>
            <div class="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Display</label>
                <input type="text" v-model="form.specs.display" placeholder="e.g. 6.1 OLED" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Processor</label>
                <input type="text" v-model="form.specs.cpu" placeholder="e.g. A15 Bionic" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Memory (RAM)</label>
                <input type="text" v-model="form.specs.ram" placeholder="e.g. 8GB" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Storage</label>
                <input type="text" v-model="form.specs.storage" placeholder="e.g. 256GB" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Camera</label>
                <input type="text" v-model="form.specs.camera" placeholder="e.g. 12MP Dual" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Battery</label>
                <input type="text" v-model="form.specs.battery" placeholder="e.g. 95% Health" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">OS</label>
                <input type="text" v-model="form.specs.os" placeholder="e.g. iOS 16" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Connectivity</label>
                <input type="text" v-model="form.specs.connectivity" placeholder="e.g. 5G, Wi-Fi 6" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Other Features</label>
              <textarea v-model="form.specs.other" rows="2" placeholder="e.g. Dual SIM, Face ID, Waterproof" class="w-full rounded-xl px-4 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500"></textarea>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Condition & Defect Notes</label>
            <textarea v-model="form.defects" rows="3" placeholder="Describe any scratches, battery health, or accessories included..." class="w-full rounded-xl px-4 py-2 border transition-colors" :class="errors.defects ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'"></textarea>
            <p v-if="errors.defects" class="mt-1.5 text-xs text-red-600 font-bold">{{ errors.defects }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
            <div 
              class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center"
              :class="errors.images ? 'border-red-300 bg-red-50 hover:bg-red-100' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'"
              @click="$refs.fileInput.click()"
            >
              <svg class="mx-auto h-10 w-10 mb-2" :class="errors.images ? 'text-red-400' : 'text-gray-400'" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="text-sm font-bold text-purple-600 group-hover:text-purple-700">Click to upload photos</span>
              <span class="text-xs text-gray-500 mt-1">Auto-resized for fast loading</span>
              <input type="file" ref="fileInput" class="hidden" multiple accept="image/*" @change="handleFileUpload">
            </div>
            <p v-if="errors.images" class="mt-1.5 text-xs text-red-600 font-bold flex items-center">
              <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
              {{ errors.images }}
            </p>
            
            <!-- Image Previews -->
            <div v-if="uploadedImages.length > 0" class="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
              <div v-for="(img, idx) in uploadedImages" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img :src="img" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <button type="button" @click.stop="removeImage(idx)" class="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md transform hover:scale-110 transition-transform">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pt-4 border-t border-gray-100 flex justify-end">
            <button type="button" @click="showAddModal = false" class="mr-3 px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">Cancel</button>
            <button type="submit" :disabled="isProcessingImages" class="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center">
              <svg v-if="isProcessingImages" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isProcessingImages ? 'Processing Images...' : (editProductId ? 'Save Changes' : 'List Product') }}
            </button>
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
import { db } from '../services/firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

const auctionStore = useAuctionStore()
const authStore = useAuthStore()

const activeTab = ref('active')

const trustScore = computed(() => {
  if (!authStore.profile) return null;
  const completed = authStore.profile.completedDeals || 0;
  const rejected = authStore.profile.rejectedDeals || 0;
  const total = completed + rejected;
  if (total === 0) return 100; // New seller
  return Math.round((completed / total) * 100);
})

const myAllProducts = computed(() => {
  return auctionStore.products.filter(p => p.sellerUid === authStore.user?.uid)
})

const activeProducts = computed(() => {
  return myAllProducts.value.filter(p => p.endsAt > auctionStore.clock)
})

const pendingProducts = computed(() => {
  return myAllProducts.value.filter(p => p.endsAt <= auctionStore.clock && p.leadingBidder !== 'Start Price' && p.resolution === null)
})

const historyProducts = computed(() => {
  return myAllProducts.value.filter(p => p.resolution !== null || (p.endsAt <= auctionStore.clock && p.leadingBidder === 'Start Price')).sort((a,b) => b.endsAt - a.endsAt)
})

const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  action: null,
  product: null
})

const isProcessingTx = ref(false)

const promptAccept = (product) => {
  confirmModal.value = {
    show: true,
    title: 'Confirm Sale',
    message: `You are about to sell ${product.model} for $${product.activePrice}. This will transfer funds to your wallet.`,
    action: 'accept',
    product
  }
}

const promptReject = (product) => {
  confirmModal.value = {
    show: true,
    title: 'Reject Offer',
    message: `You are about to reject the winning bid for ${product.model}. The auction will be cancelled and cannot be undone.`,
    action: 'reject',
    product
  }
}

const promptDelete = (product) => {
  confirmModal.value = {
    show: true,
    title: 'Delete Listing',
    message: `Are you sure you want to delete ${product.brand} ${product.model}? This cannot be undone.`,
    action: 'delete',
    product
  }
}

const executeConfirm = async () => {
  const { action, product } = confirmModal.value
  isProcessingTx.value = true
  
  if (action === 'accept') {
    auctionStore.resolveAuction(product.id, 'accepted')
    
    // Process Financials
    try {
      if (product.leadingBidder !== 'Start Price' && product.leadingBidder !== 'You') {
         // Deduct from Buyer
         const usersRef = collection(db, 'users')
         const q = query(usersRef, where('displayName', '==', product.leadingBidder))
         const snapshot = await getDocs(q)
         if (!snapshot.empty) {
            const buyerDoc = snapshot.docs[0]
            const currentBalance = buyerDoc.data().balance || 2000
            await updateDoc(doc(db, 'users', buyerDoc.id), {
               balance: Math.max(0, currentBalance - product.activePrice)
            })
            console.log("Successfully deducted balance from buyer.")
         }

         // Add to Seller
         if(authStore.user) {
           const sellerRef = doc(db, 'users', authStore.user.uid)
           const newSellerBalance = (authStore.profile?.balance || 0) + product.activePrice
           const newCompletedDeals = (authStore.profile?.completedDeals || 0) + 1
           await updateDoc(sellerRef, { balance: newSellerBalance, completedDeals: newCompletedDeals })
           
           // Update local authStore profile state so UI updates
           if(authStore.profile) {
             authStore.profile.balance = newSellerBalance
             authStore.profile.completedDeals = newCompletedDeals
           }
           console.log("Successfully added balance and completed deal to seller.")
         }
      }
    } catch(e) {
      console.warn("Could not process financials:", e)
    }
  } else if (action === 'reject') {
    auctionStore.resolveAuction(product.id, 'rejected')
    try {
      if (authStore.user) {
        const sellerRef = doc(db, 'users', authStore.user.uid)
        const newRejectedDeals = (authStore.profile?.rejectedDeals || 0) + 1
        await updateDoc(sellerRef, { rejectedDeals: newRejectedDeals })
        if (authStore.profile) {
          authStore.profile.rejectedDeals = newRejectedDeals
        }
        console.log("Incremented rejected deals stats.")
      }
    } catch(e) {
      console.warn("Could not update rejectedDeals stats:", e)
    }
  } else if (action === 'delete') {
    auctionStore.deleteProduct(product.id)
  }
  
  isProcessingTx.value = false
  confirmModal.value.show = false
}

const showAddModal = ref(false)
const editProductId = ref(null)
const fileInput = ref(null)
const uploadedImages = ref([])
const isProcessingImages = ref(false)

const errors = ref({ brand: '', model: '', basePrice: '', defects: '', images: '' })

const form = ref({
  brand: '',
  model: '',
  condition: 'Excellent',
  durationHours: 24, // default to 24 hours
  basePrice: 300,
  defects: '',
  specs: {
    display: '',
    cpu: '',
    ram: '',
    storage: '',
    camera: '',
    battery: '',
    os: '',
    connectivity: '',
    other: ''
  }
})

const openAddModal = () => {
  editProductId.value = null
  form.value = {
    brand: '', model: '', condition: 'Excellent', durationHours: 24, basePrice: 300, defects: '',
    specs: { display: '', cpu: '', ram: '', storage: '', camera: '', battery: '', os: '', connectivity: '', other: '' }
  }
  uploadedImages.value = []
  errors.value = { brand: '', model: '', basePrice: '', defects: '', images: '' }
  showAddModal.value = true
}

const openEditModal = (product) => {
  editProductId.value = product.id
  form.value = {
    brand: product.brand,
    model: product.model,
    condition: product.condition,
    durationHours: 24, // Not effectively editable, just visual dummy
    basePrice: product.basePrice,
    defects: product.defects,
    specs: { ...(product.specs || { display: '', cpu: '', ram: '', storage: '', camera: '', battery: '', os: '', connectivity: '', other: '' }) }
  }
  uploadedImages.value = [...(product.images || [])]
  errors.value = { brand: '', model: '', basePrice: '', defects: '', images: '' }
  showAddModal.value = true
}

const processFileToCanvas = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxWidth = 800
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        // Auto-compress to WEBP 0.7 for huge space saving in localStorage
        resolve(canvas.toDataURL('image/webp', 0.7))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const handleFileUpload = async (e) => {
  const files = e.target.files
  if (!files || files.length === 0) return
  
  isProcessingImages.value = true
  errors.value.images = ''
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file.type.startsWith('image/')) continue
    const base64Data = await processFileToCanvas(file)
    uploadedImages.value.push(base64Data)
  }
  
  // reset input so the same files can be selected again if deleted
  if (fileInput.value) fileInput.value.value = ''
  isProcessingImages.value = false
}

const removeImage = (idx) => {
  uploadedImages.value.splice(idx, 1)
}

const validateForm = () => {
  let isValid = true
  errors.value = { brand: '', model: '', basePrice: '', defects: '', images: '' }
  
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
  
  if (uploadedImages.value.length === 0) {
    errors.value.images = 'Please upload at least one image.'
    isValid = false
  }
  
  return isValid
}

const submitListing = () => {
  if (isProcessingImages.value) return
  if (!validateForm()) return

  if (editProductId.value) {
    auctionStore.updateProduct(editProductId.value, {
      brand: form.value.brand,
      model: form.value.model,
      condition: form.value.condition,
      defects: form.value.defects,
      images: [...uploadedImages.value],
      specs: { ...form.value.specs }
    })
  } else {
    auctionStore.addProduct({
      sellerUid: authStore.user?.uid,
      sellerName: authStore.profile?.displayName || 'Unknown Seller',
      brand: form.value.brand,
      model: form.value.model,
      condition: form.value.condition,
      durationHours: form.value.durationHours,
      defects: form.value.defects,
      basePrice: form.value.basePrice,
      images: [...uploadedImages.value],
      specs: { ...form.value.specs }
    })
  }
  
  // Reset
  form.value = { 
    brand: '', model: '', condition: 'Excellent', durationHours: 24, basePrice: 300, defects: '',
    specs: { display: '', cpu: '', ram: '', storage: '', camera: '', battery: '', os: '', connectivity: '', other: '' }
  }
  uploadedImages.value = []
  showAddModal.value = false
}
</script>
