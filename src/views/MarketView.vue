<template>
  <div class="bg-gray-50/50 min-h-screen">
    <!-- Hero Banner -->
    <div class="relative bg-white overflow-hidden border-b border-gray-100">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 mt-10">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-blue-800 bg-blue-100 mb-4">
                Trusted by 1M+ Buyers
              </span>
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Premium Used</span>
                <span class="block text-blue-600 xl:inline"> Phones Market</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Shop with confidence. All devices are verified, graded, and covered by the RePhoneX Guarantee. Join the live auctions now!
              </p>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          <img class="w-full h-full object-cover opacity-90" src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200" alt="Phones scattered" />
          <div class="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:visible hidden"></div>
        </div>
      </div>
    </div>

    <!-- Main Marketplace -->
    <ProductList />
  </div>
</template>

<script setup>
import ProductList from '../components/product/ProductList.vue'
</script>
