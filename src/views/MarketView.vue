<template>
  <div class="bg-gray-50/50 min-h-screen">
    <!-- Hero Banner -->
    <div class="relative bg-white overflow-hidden border-b border-gray-100">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 mt-10">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-5xl tracking-tight font-black text-gray-900 sm:text-6xl md:text-7xl md:mt-10 lg:mt-0">
                <span class="block text-blue-600 mb-2">Find your phone.</span>
                <span class="block">Win your price.</span>
              </h1>
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
