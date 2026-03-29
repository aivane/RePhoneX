<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-extrabold text-blue-600">RePhoneX</span>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link to="/" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" active-class="border-blue-500 text-gray-900">Home</router-link>
              <router-link to="/marketplace" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" active-class="border-blue-500 text-gray-900">Marketplace</router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <template v-if="authStore.loading">
              <div class="animate-pulse flex space-x-4 h-8 bg-gray-200 rounded w-24"></div>
            </template>
            <template v-else-if="authStore.user">
              <div class="flex items-center space-x-3">
                <img v-if="authStore.profile?.photoURL" :src="authStore.profile.photoURL" alt="User Profile" class="h-8 w-8 rounded-full border border-gray-300 shadow-sm object-cover">
                <span class="text-sm font-semibold text-gray-700">{{ authStore.profile?.displayName || 'User' }}</span>
                <button @click="authStore.logout" class="ml-4 bg-red-50 text-red-600 px-3 py-1.5 text-sm font-bold rounded-lg hover:bg-red-100 transition shadow-sm">
                  Logout
                </button>
              </div>
            </template>
            <template v-else>
              <button @click="authStore.loginWithGoogle" class="bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center">
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign In with Google
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <router-view></router-view>
    </main>
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
/* Add any global styles here if necessary */
</style>
