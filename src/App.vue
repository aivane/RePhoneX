<template>
  <div class="min-h-screen bg-gray-50/50 font-sans flex flex-col">
    <!-- Sticky Glassmorphism Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          
          <!-- Logo & Links -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="flex flex-col">
                <span class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">RePhoneX</span>
              </router-link>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <router-link to="/" class="border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition" active-class="border-blue-600 text-blue-600">Explore Phones</router-link>
            </div>
          </div>

          <!-- Auth Section -->
          <div class="flex items-center space-x-4">
            
            <template v-if="authStore.loading">
              <div class="animate-pulse flex space-x-4 h-8 bg-gray-200 rounded w-24"></div>
            </template>
            
            <template v-else-if="authStore.user">
              <div class="relative group cursor-pointer flex items-center space-x-3 py-2">
                <img v-if="authStore.profile?.photoURL" :src="authStore.profile.photoURL" alt="User" class="h-9 w-9 rounded-full border-2 border-white shadow-sm object-cover bg-gray-100">
                <div v-else class="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm border-2 border-white">
                  {{ authStore.profile?.displayName?.charAt(0) || 'U' }}
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-800 leading-tight">{{ authStore.profile?.displayName || 'User' }}</span>
                  <span class="text-[10px] text-gray-500 font-medium">{{ authStore.profile?.role === 'admin' ? 'Administrator' : 'Verified Buyer' }}</span>
                </div>
                
                <!-- Dropdown Menu -->
                <div class="absolute right-0 top-[100%] mt-1 w-48 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 transform origin-top border-t-2 border-t-transparent pt-0">
                  <div class="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                  <router-link to="/profile" class="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-semibold transition">
                    <svg class="inline w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Edit Profile
                  </router-link>
                  <div class="border-t border-gray-100 my-1"></div>
                  <button @click="authStore.logout" class="relative w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition">
                    <svg class="inline w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Log Out
                  </button>
                </div>
              </div>
            </template>
            
            <template v-else>
              <button @click="authStore.loginWithGoogle" class="bg-gray-900 border border-gray-800 shadow-md px-5 py-2 text-white font-semibold rounded-full hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 flex items-center text-sm">
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign In 
              </button>
            </template>
            
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex justify-center space-x-6 md:order-2">
            <span class="text-sm text-gray-400 font-semibold tracking-wide">The Trusted Pre-Owned Marketplace</span>
          </div>
          <div class="mt-8 md:mt-0 md:order-1">
            <p class="text-center text-sm text-gray-500">&copy; 2026 RePhoneX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
