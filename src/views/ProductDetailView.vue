<template>
  <div class="bg-white min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top nav breadcrumbs -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <router-link to="/marketplace" class="text-gray-400 hover:text-gray-500">Marketplace</router-link>
          </li>
          <li>
            <div class="flex items-center">
              <span class="mx-2 text-gray-400">/</span>
              <span class="text-gray-700 font-medium" aria-current="page">{{ product ? product.brand + ' ' + product.model : 'Loading...' }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div v-if="product" class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <!-- Product Details -->
        <div class="flex flex-col justify-center">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">{{ product.brand }} {{ product.model }}</h1>
            <div class="mt-3">
              <h2 class="sr-only">Product condition</h2>
              <p class="text-lg text-gray-700">Condition: <span class="font-semibold text-gray-900">{{ product.condition }}</span></p>
            </div>
            <div class="mt-6 border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900">Features</h3>
              <div class="mt-4 prose prose-sm text-gray-500">
                <ul role="list" class="space-y-2 list-disc pl-5">
                  <li>Factory unlocked for all carriers</li>
                  <li>Original battery capacity > 90%</li>
                  <li>Includes premium fast charger and tempered glass</li>
                  <li>1-year RePhoneX Guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Bidding Simulation Panel -->
        <div class="mt-10 lg:mt-0">
          <BiddingPanel :product="product" />
        </div>
      </div>
      
      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-semibold text-gray-500">Retrieving secure auction details...</h2>
        <router-link to="/marketplace" class="mt-4 text-blue-600 block">Go back to Marketplace</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuctionStore } from '../stores/auctionStore'
import BiddingPanel from '../components/product/BiddingPanel.vue'

const route = useRoute()
const auctionStore = useAuctionStore()

// Read product reactively from the Pinia store
const product = computed(() => auctionStore.products.find(p => p.id === route.params.id))

</script>
