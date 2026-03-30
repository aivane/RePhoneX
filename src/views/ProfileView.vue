<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
        
        <div class="px-6 py-8 sm:p-10 relative">
          <!-- Avatar -->
          <div class="-mt-20 flex justify-center sm:justify-start mb-6">
            <img 
              v-if="authStore.profile?.photoURL" 
              :src="authStore.profile.photoURL" 
              class="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
              alt="Profile"
            />
            <div v-else class="h-24 w-24 rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center text-gray-400">
              <svg class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold capitalize"
                  :class="authStore.profile?.role === 'seller' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'">
              ✨ {{ authStore.profile?.role || 'Buyer' }} Account
            </span>
          </div>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Email (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address (Google)</label>
              <div class="mt-1">
                <input 
                  type="email" 
                  :value="authStore.profile?.email" 
                  disabled
                  class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed px-4 py-2 border"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">Your email is linked to your Google account and cannot be changed here.</p>
            </div>

            <!-- Display Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Display Name</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  v-model="editForm.displayName"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md px-4 py-2 border transition-colors"
                  :class="errors.displayName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
                />
              </div>
              <p v-if="errors.displayName" class="mt-1.5 text-xs text-red-600 font-bold flex items-center">
                <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                {{ errors.displayName }}
              </p>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  v-model="editForm.phoneNumber"
                  placeholder="e.g. 0812345678"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md px-4 py-2 border transition-colors"
                  :class="errors.phoneNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
                />
              </div>
              <p v-if="errors.phoneNumber" class="mt-1.5 text-xs text-red-600 font-bold flex items-center">
                <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                {{ errors.phoneNumber }}
              </p>
            </div>

            <!-- Account Role Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Marketplace Role</label>
              <div class="flex gap-4">
                <label class="flex-1 flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                       :class="editForm.role === 'buyer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50 shadow-sm'">
                  <input type="radio" value="buyer" v-model="editForm.role" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <span class="ml-3 block text-sm font-bold" :class="editForm.role === 'buyer' ? 'text-blue-800' : 'text-gray-700'">
                    🛍️ Buyer
                    <span class="block text-xs font-normal text-gray-500 mt-0.5">I want to bid and buy phones</span>
                  </span>
                </label>
                <label class="flex-1 flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                       :class="editForm.role === 'seller' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50 shadow-sm'">
                  <input type="radio" value="seller" v-model="editForm.role" class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300">
                  <span class="ml-3 block text-sm font-bold" :class="editForm.role === 'seller' ? 'text-purple-800' : 'text-gray-700'">
                    🏬 Seller
                    <span class="block text-xs font-normal text-gray-500 mt-0.5">I want to list and sell phones</span>
                  </span>
                </label>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <span class="text-sm font-medium text-green-600" v-if="successMessage">{{ successMessage }}</span>
              <span class="text-sm font-medium text-red-600" v-else-if="errorMessage">{{ errorMessage }}</span>
              <span v-else></span>
              
              <button 
                type="submit" 
                :disabled="isSaving"
                class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const errors = ref({
  displayName: '',
  phoneNumber: ''
})

const editForm = ref({
  displayName: '',
  phoneNumber: '',
  role: 'buyer'
})

const loadData = () => {
  if (authStore.profile) {
    editForm.value.displayName = authStore.profile.displayName || ''
    editForm.value.phoneNumber = authStore.profile.phoneNumber || ''
    editForm.value.role = authStore.profile.role || 'buyer'
  }
}

watch(() => authStore.profile, loadData, { immediate: true })

onMounted(() => {
  if (!authStore.user && !authStore.loading) {
    router.push('/') 
  }
})

const validateForm = () => {
  let isValid = true
  errors.value = { displayName: '', phoneNumber: '' }
  
  if (!editForm.value.displayName || editForm.value.displayName.trim().length < 3) {
    errors.value.displayName = 'Display Name must be at least 3 characters.'
    isValid = false
  }
  
  if (editForm.value.phoneNumber) {
    const cleanPhone = editForm.value.phoneNumber.trim()
    const phoneRegex = /^[0-9]{9,10}$/
    if (!phoneRegex.test(cleanPhone)) {
      errors.value.phoneNumber = 'Phone number must be exactly 9-10 digits without spaces or dashes.'
      isValid = false
    }
  }
  return isValid
}

const saveProfile = async () => {
  if (!validateForm()) return

  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    await authStore.updateProfileData({
      displayName: editForm.value.displayName,
      phoneNumber: editForm.value.phoneNumber,
      role: editForm.value.role
    })
    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error) {
    errorMessage.value = 'Failed to update profile.'
  } finally {
    isSaving.value = false
  }
}
</script>
